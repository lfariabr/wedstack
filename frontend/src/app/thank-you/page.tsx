"use client";

import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { Suspense, useEffect, useState } from "react";

export default function ThankYouPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      setSessionId(sp.get('session_id'));
    }
  }, []);

  return (
    <Suspense fallback={<div />}> 
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#FCF9F4] px-4 py-16">
          <div className="w-full max-w-2xl text-center space-y-6">
            <div className="flex items-center justify-center gap-3 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
              <h1 className="text-2xl font-semibold">{t("thankyou.title") || "Thank you for your gift! 💕"}</h1>
            </div>
            <p className="text-[var(--primary)]/80">
              {t("thankyou.subtitle") || "Your payment was completed successfully. We truly appreciate your contribution to our special day."}
            </p>
            {sessionId && (
              <p className="text-xs text-gray-500">{t("thankyou.reference") || "Ref:"} {sessionId}</p>
            )}

            <div className="flex items-center justify-center gap-3 pt-4">
              <Link href="/gifts">
                <Button variant="default">{t("thankyou.backToGifts") || "Back to Gifts"}</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">{t("thankyou.home") || "Home"}</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    </Suspense>
  );
}
