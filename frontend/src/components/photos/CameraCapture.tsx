"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useMutation, ApolloError } from "@apollo/client";
import { ADD_PHOTO, GET_PHOTO_UPLOAD_URL } from "@/lib/graphql/photos";

type Props = {
  passcode: string;
  uploaderName?: string;
  onUploaded?: (photo: {
    id: string;
    url: string;
    key: string;
  }) => void;
};

export default function CameraCapture({ passcode, uploaderName, onUploaded }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startingRef = useRef(false);

  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const setupCamera = useCallback(async () => {
    if (startingRef.current) return; // prevent re-entrancy
    if (streamRef.current) return; // already started
    startingRef.current = true;

    setError(null);
    try {
      // Ensure any old stream is stopped
      stopStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        // @ts-ignore
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;

        // Wait for metadata, then play to avoid interruption
        const onLoaded = async () => {
          try {
            await video.play();
          } catch (e: any) {
            // Some browsers require a user gesture; button click will trigger play implicitly
            console.warn("Auto-play failed, will rely on user gesture to start video.");
          }
          video.removeEventListener("loadedmetadata", onLoaded);
        };
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
      }
    } catch (e: any) {
      setError(e?.message || "Could not access camera. Please check permissions and HTTPS.");
    } finally {
      startingRef.current = false;
    }
  }, []);

  useEffect(() => {
    setupCamera();
    return () => {
      stopStream();
    };
  }, [setupCamera]);

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
        (blob) => {
          if (!blob) return reject(new Error("Failed to create image blob"));
          resolve(blob);
        },
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
      origin: window.location.origin
    });
  };

  const handleCapture = async () => {
    if (!passcode) {
      setError("Missing passcode");
      return;
    }
    setIsCapturing(true);
    setIsUploading(true);
    setError(null);
    setProgress(0);
    try {
      const blob = await captureFrameToBlob();
      const filename = `memory_${Date.now()}.jpg`;
      const contentType = "image/jpeg";

      // 1) Ask backend for signed URL
      const res = await getUploadUrl({
        variables: { filename, contentType, passcode },
      });

      const payload = (res as any)?.data?.getPhotoUploadUrl as { url: string; key: string } | undefined;
      if (!payload) {
        const errMsg = (res as any)?.errors?.[0]?.message || "Failed to get upload URL (check passcode).";
        throw new Error(errMsg);
      }

      const { url, key } = payload;

      // 2) Upload to Spaces with progress
      debugUpload(url, blob);
      await uploadWithProgress(url, blob, contentType, (p) => setProgress(p));

      // 3) Persist metadata
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

      if (onUploaded) onUploaded(created);
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
      {error && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">{error}</div>
      )}

      <div className="rounded overflow-hidden border border-neutral-200">
        <video ref={videoRef} playsInline autoPlay muted className="w-full h-auto bg-black" />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={handleCapture}
        disabled={isCapturing || isUploading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {isCapturing || isUploading ? "Uploading..." : "Capture & Upload"}
      </button>

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
    </div>
  );
}

async function uploadWithProgress(url: string, blob: Blob, contentType: string, onProgress: (p: number) => void) {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const p = Math.round((ev.loaded / ev.total) * 100);
        onProgress(p);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    };
    xhr.onerror = () => {
      console.error("XHR Error details:", {
        status: xhr.status,
        statusText: xhr.statusText,
        readyState: xhr.readyState,
        responseText: xhr.responseText
      });
      reject(new Error("Network error during upload"));
    };

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
