"use client";

import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import GalleryGrid from "@/components/photos/GalleryGrid";

export default function GalleryPage() {
  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-2">Gallery</h1>
      <p className="text-neutral-600 mb-6">See all shared moments. Tap a photo to download.</p>
      <GalleryGrid />
    </MainLayout>
  );
}
