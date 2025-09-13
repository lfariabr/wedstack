"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import GalleryGrid from "@/components/photos/GalleryGrid";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function MemoryLanePage() {
  const { t } = useI18n();
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="w-script text-5xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              {t("memoryLane.title") || "Memory Lane"}
            </h1>
            <p className="text-base sm:text-lg text-[var(--primary)]/80 italic">
              {t("memoryLane.subtitle") || "See all shared moments. Tap a photo to download."}
            </p>
            <div className="mt-1">
              <Link href="/share-love" className="w-cta-secondary">
                {t("memoryLane.ctaShare") || "Share your love (upload a photo)"}
              </Link>
            </div>
          </div>

          {/* Gallery Card */}
          <div className="w-full p-6 sm:p-8 rounded-2xl shadow-sm border border-[var(--border)] bg-white/80 backdrop-blur">
            <GalleryGrid />
          </div>
        </main>
      </div>
    </MainLayout>
  );
}