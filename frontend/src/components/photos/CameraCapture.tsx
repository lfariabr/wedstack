"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { ADD_PHOTO, GET_PHOTO_UPLOAD_URL } from "@/lib/graphql/photos";

type Props = {
  passcode: string;
  uploaderName?: string;
  onUploaded?: (photo: { id: string; url: string; key: string }) => void;
};

type Facing = "environment" | "user";

export default function CameraCapture({ passcode, uploaderName, onUploaded }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // NEW: camera management state
  const [facing, setFacing] = useState<Facing>("environment");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const [getUploadUrl] = useMutation(GET_PHOTO_UPLOAD_URL);
  const [addPhoto] = useMutation(ADD_PHOTO);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.srcObject = null;
    }
  };

  // enumerate available cameras (labels require prior permission in most browsers)
  const refreshDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const cams = all.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      // If a specific device is selected but no longer present, clear it
      if (selectedDeviceId && !cams.some((d) => d.deviceId === selectedDeviceId)) {
        setSelectedDeviceId(null);
      }
    } catch (e) {
      // ignore silently; some browsers block until permission granted
    }
  }, [selectedDeviceId]);

  const startWithConstraints = useCallback(
    async (opts?: { deviceId?: string; facingMode?: Facing }) => {
      const constraints: MediaStreamConstraints = {
        video: {
          // Prefer deviceId when given; else try facingMode
          ...(opts?.deviceId
            ? { deviceId: { exact: opts.deviceId } }
            : { facingMode: { ideal: opts?.facingMode ?? facing } }),
          // A few helpful hints to get decent quality/latency
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: false,
      };

      // Ensure any old stream is stopped
      stopStream();

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        // @ts-ignore
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        const onLoaded = async () => {
          try {
            await video.play();
          } catch {
            // user gesture might be required
          }
          video.removeEventListener("loadedmetadata", onLoaded);
        };
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
      }

      await refreshDevices(); // labels become available after permission
    },
    [facing, refreshDevices]
  );

  const setupCamera = useCallback(async () => {
    if (startingRef.current) return;
    if (streamRef.current) return;
    startingRef.current = true;
    setError(null);
    try {
      await startWithConstraints({ facingMode: facing }); // initial start
    } catch (e: any) {
      setError(e?.message || "Could not access camera. Please check permissions and HTTPS.");
    } finally {
      startingRef.current = false;
    }
  }, [facing, startWithConstraints]);

  useEffect(() => {
    setupCamera();
    return () => stopStream();
  }, [setupCamera]);

  // === Flip camera (front/back) ===
  const flipCamera = async () => {
    try {
      const nextFacing: Facing = facing === "environment" ? "user" : "environment";
      setFacing(nextFacing);

      const stream = streamRef.current;
      const track = stream?.getVideoTracks?.()[0];

      // 1) Try smooth applyConstraints on the existing track
      if (track && typeof track.applyConstraints === "function") {
        try {
          await track.applyConstraints({ facingMode: nextFacing });
          return;
        } catch {
          // fall through to full restart
        }
      }

      // 2) If we know deviceIds, pick the "other" one that matches likely facing
      if (devices.length > 1) {
        // naive pick: try to guess front/back by label keywords, else just switch index
        const pick = devices.find((d) =>
          nextFacing === "user"
            ? /front|user/i.test(d.label)
            : /back|rear|environment/i.test(d.label)
        ) || devices.find((d) => d.deviceId !== selectedDeviceId) || devices[0];

        setSelectedDeviceId(pick.deviceId);
        await startWithConstraints({ deviceId: pick.deviceId });
        return;
      }

      // 3) Restart with facingMode (some browsers will honor it)
      await startWithConstraints({ facingMode: nextFacing });
    } catch (e: any) {
      setError(e?.message || "Unable to switch camera");
    }
  };

  // === Pick from gallery ===
  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFilePicked = async (file: File) => {
    try {
      if (!passcode) throw new Error("Missing passcode");
      setIsCapturing(true);
      setIsUploading(true);
      setError(null);
      setProgress(0);

      // Optional: downscale large images by drawing to canvas, else upload file directly
      const blob = file; // or await downscaleToBlob(file)

      await runUpload(blob, file.type || "image/jpeg");
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      console.error(e);
      setError(firstGraphQLError(e, "Failed to upload selected image"));
    } finally {
      setIsCapturing(false);
      setIsUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const captureFrameToBlob = async (): Promise<Blob> => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) throw new Error("Camera not ready");

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) throw new Error("Camera not ready (no video size yet)");

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(video, 0, 0, w, h);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create image blob"))),
        "image/jpeg",
        0.85
      );
    });
  };

  const firstGraphQLError = (e: unknown, fallback: string) => {
    if (e instanceof ApolloError) {
      const msg = e.graphQLErrors?.[0]?.message || e.message;
      return msg || fallback;
    }
    return (e as any)?.message || fallback;
  };

  const debugUpload = (url: string, blob: Blob) => {
    console.log("Upload details:", {
      url,
      blobSize: blob.size,
      blobType: blob.type,
      origin: window.location.origin,
    });
  };

  // Extracted upload pipeline (reused by camera and gallery)
  const runUpload = async (blob: Blob, contentType: string) => {
    const filename = `memory_${Date.now()}.jpg`;
    // 1) signed URL
    const res = await getUploadUrl({ variables: { filename, contentType, passcode } });
    const payload = (res as any)?.data?.getPhotoUploadUrl as { url: string; key: string } | undefined;
    if (!payload) {
      const errMsg = (res as any)?.errors?.[0]?.message || "Failed to get upload URL (check passcode).";
      throw new Error(errMsg);
    }
    const { url, key } = payload;

    // 2) upload with progress
    debugUpload(url, blob);
    await uploadWithProgress(url, blob, contentType, (p) => setProgress(p));

    // 3) persist metadata
    const publicUrl = new URL(url);
    publicUrl.search = "";
    const cleanedUrl = publicUrl.toString();

    const img = await blobToImage(blob);
    const addRes = await addPhoto({
      variables: {
        input: {
          key,
          url: cleanedUrl,
          contentType,
          width: img.width,
          height: img.height,
          uploaderName: uploaderName || null,
        },
      },
    });
    const created = (addRes as any)?.data?.addPhoto;
    if (!created) {
      const errMsg = (addRes as any)?.errors?.[0]?.message || "Failed to save photo metadata.";
      throw new Error(errMsg);
    }
    onUploaded?.(created);
  };

  const handleCapture = async () => {
    if (!passcode) return setError("Missing passcode");
    setIsCapturing(true);
    setIsUploading(true);
    setError(null);
    setProgress(0);
    try {
      const blob = await captureFrameToBlob();
      await runUpload(blob, "image/jpeg");
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e: any) {
      console.error(e);
      setError(firstGraphQLError(e, "Failed to capture and upload"));
    } finally {
      setIsCapturing(false);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {error && <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">{error}</div>}

      <div className="rounded overflow-hidden border border-neutral-200 relative">
        <video ref={videoRef} playsInline autoPlay muted className="w-full h-auto bg-black" />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay controls (flip + gallery) */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            type="button"
            onClick={flipCamera}
            className="px-3 py-1.5 rounded bg-black/70 text-white text-sm"
            title="Flip camera"
          >
            Flip
          </button>
          <button
            type="button"
            onClick={openGallery}
            className="px-3 py-1.5 rounded bg-black/70 text-white text-sm"
            title="Pick from gallery"
          >
            Gallery
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCapture}
          disabled={isCapturing || isUploading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {isCapturing || isUploading ? "Uploading..." : "Capture & Upload"}
        </button>

        {/* Optional: camera selector if multiple devices */}
        {devices.length > 1 && (
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedDeviceId ?? ""}
            onChange={async (e) => {
              const id = e.target.value || null;
              setSelectedDeviceId(id);
              await startWithConstraints(id ? { deviceId: id } : { facingMode: facing });
            }}
          />
        )}
      </div>

      {progress > 0 && (
        <div className="w-full bg-neutral-200 rounded h-2">
          <div className="bg-black h-2 rounded" style={{ width: `${progress}%` }} />
        </div>
      )}

      {previewUrl && (
        <div className="mt-2">
          <div className="text-sm text-neutral-600 mb-1">Last upload preview</div>
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded border border-neutral-200" />
        </div>
      )}

      {/* Hidden file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFilePicked(file);
        }}
      />
    </div>
  );
}

// === helpers unchanged ===
async function uploadWithProgress(url: string, blob: Blob, contentType: string, onProgress: (p: number) => void) {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("x-amz-acl", "public-read");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) onProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed with status ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(blob);
  });
}

function blobToImage(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (e) => reject(e);
    img.src = URL.createObjectURL(blob);
  });
}