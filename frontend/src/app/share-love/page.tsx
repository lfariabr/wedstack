"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import CameraCapture from "@/components/photos/CameraCapture";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function ShareLovePage() {
  const router = useRouter();
  const defaultPasscode = process.env.NEXT_PUBLIC_UPLOAD_PASSCODE || "";
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [uploaderName, setUploaderName] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    if (defaultPasscode && !passcode) setPasscode(defaultPasscode);
  }, [defaultPasscode, passcode]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      alert(t("shareLove.error") || "Please enter a passcode");
      return;
    }
    console.log("Attempting unlock with passcode:", passcode);
    setIsUnlocked(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="w-script text-5xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              {t("shareLove.title") || "Share your love"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--primary)]/80 italic">
              {t("shareLove.subtitle") || "Capture a moment and share your photo with us."}
            </p>
            <div className="mt-1">
              <a href="/memory-lane" className="w-cta-secondary">{t("shareLove.goToMemoryLane") || "See Pics"}</a>
            </div>
          </div>

          {/* Card */}
          <div className="w-full p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--border)] bg-white/80 backdrop-blur">
            {!isUnlocked ? (
              <form onSubmit={handleUnlock} className="flex flex-col gap-4 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("shareLove.passcodeLabel") || "Passcode"}</label>
                  <Input
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder={t("shareLove.placeholder") || "Enter passcode"}
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                  <p className="text-xs text-neutral-500 mt-1">{t("shareLove.hint") || "Hint: ask the couple for the code."}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t("shareLove.nameLabel") || "Your name (optional)"}</label>
                  <Input
                    value={uploaderName}
                    onChange={(e) => setUploaderName(e.target.value)}
                    placeholder={t("shareLove.namePlaceholder") || "e.g., Ana & João"}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleUnlock} className="w-cta" type="button">{t("shareLove.unlockCamera") || "Unlock Camera"}</button>
                  <a href="/memory-lane" className="w-cta-secondary">
                   {t("shareLove.goToMemoryLane") || "See Gallery"}
                  </a>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <CameraCapture
                  passcode={passcode}
                  uploaderName={uploaderName}
                  onUploaded={() => router.push("/memory-lane")}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
