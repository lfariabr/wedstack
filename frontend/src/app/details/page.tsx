'use client';

import { MapPin, CalendarDays, Clock, Shirt, Cake, Menu } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function DetailsPage() {
  const { t, locale } = useI18n();

  const eventDate = new Date('2025-09-21T12:00:00');
  const dateStr = eventDate.toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const hourStr = eventDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  const capFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">

          {/* Cabeçalho com elegância */}
          <div className="text-center space-y-4">
            <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
              {t('details.title')}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              {t('details.intro1')}
            </p>
            <p className="text-sm text-[var(--secondary)]/90">
              {t('details.intro2')}
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
              {t('details.intro3')}
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
              {t('details.intro4')}
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
              <strong>{t('details.intro5')}</strong>
            </p>
          </div>

          {/* Cartão de Informações */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl shadow-sm border border-[var(--border)] sm:grid-cols-1 bg-[#F47EAB]/50"> 
            {/* Local */}
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">{t('details.where')}</h3>
                <p><i>Sweethearts Rooftop</i></p>
                <p>Level 3/33-35 Darlinghurst Rd, Potts Point</p>
                <Link
                  href="https://www.google.com/search?kgmid=%2Fg%2F11scjlxb18&hl=en-AU&q=Sweethearts%20Rooftop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="mt-2">
                    {t('details.mapButton')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-4">
              <CalendarDays className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">{t('details.when')}</h3>
                <p>{capFirst(dateStr)}</p>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">{t('details.time')}</h3>
                <p>{t('details.timeDesc')}</p>
              </div>
            </div>

            {/* Traje */}
            <div className="flex items-start gap-4">
              <Shirt className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">{t('details.attire')}</h3>
                <p>{t('details.attireDesc')}</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">
                      {t('details.attireRefs')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex items-center">
                    <Image
                      src="https://i.pinimg.com/736x/6f/31/a7/6f31a77c4fdb8f923625d67e283d0534.jpg"
                      alt="Referência de traje"
                      width={400}
                      height={600}
                      className="rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                
              </div>
            </div>

            {/* Bolo */}
            <div className="flex items-start gap-4">
              <Cake className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">{t('details.menu')}</h3>
                <p>{t('details.menuDesc')}</p>
                <Link href="/menu" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="mt-2">
                    {t('details.menuButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </main>
      </div>
    </MainLayout>
  );
}
