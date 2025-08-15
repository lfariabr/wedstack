'use client';

import { Utensils, Wine } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function MenuPage() {
  const { t, locale } = useI18n();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center gap-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              {t('menu.title')}
            </h1>
          </div>

          {/* Food */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#F47EAB]/50 shadow-md border border-[var(--border)] w-full">
            {/* Food Section */}
            <div className="flex items-start gap-4">
              <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t('menu.foodTitle')}</h3>
                <p>{t('menu.foodDesc')}</p>
                <p className="text-sm italic"><br />{t('menu.foodNote')}</p>
              </div>
            </div>
          </div>

          {/* Drinks */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#F9785F]/50 shadow-md border border-[var(--border)] w-full">
            <div className="flex items-start gap-4">
              <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
                <Wine className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">{t('menu.drinksTitle')}</h3>
                <p>{t('menu.drinksDesc')}</p>
                <p className="text-sm italic"><br />{t('menu.drinksNote')}</p>
              </div>
            </div>
          </div>
          

        </main>
      </div>
    </MainLayout>
  );
}
