'use client';

import { MainLayout } from "@/components/layouts/MainLayout";
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function QRCodePage() {
  const { t, locale } = useI18n();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              Custom-made QR Code
            </h1>
            <div className="flex justify-center">
                <img src="data:image/png;base64,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" alt="Share Love QR Code" />
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
