'use client';
import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { MapPin, Utensils, Mail, Gift } from "lucide-react";
import { useI18n } from '@/lib/i18n/I18nProvider';

// Componente de data no estilo da imagem
function WeddingDate({ start }: { start: string }) {
  const dt = new Date(start);

  const weekday = dt.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase();
  const month = dt.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();
  const day = String(dt.getDate());
  const year = dt.getFullYear();
  const hour = String(dt.getHours()).padStart(2, "0");
  const horaLabel = `${hour}H ÀS 15H`;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-row items-center justify-center gap-10 text-neutral-800">
      {/* Esquerda: dia da semana com linhas */}
      <div className="flex flex-col items-center gap-3 min-w-[80px]">
        <div className="w-full border-t border-neutral-300" />
        <div className="tracking-[0.25em] text-sm sm:text-base">{weekday}</div>
        <div className="w-full border-t border-neutral-300" />
      </div>

      {/* Centro: mês, dia grande, ano */}
      <div className="text-center leading-tight min-w-[100px]">
        <div className="text-sm tracking-[0.3em]" style={{ color: "#FF7D59" }}>
          {month}
        </div>
        <div className="text-5xl sm:text-6xl font-semibold">{day}</div>
        <div className="text-xl tracking-widest">{year}</div>
      </div>

      {/* Direita: hora com linhas */}
      <div className="flex flex-col items-center gap-3 min-w-[80px]">
        <div className="w-full border-t border-neutral-300" />
        <div className="tracking-[0.25em] text-sm sm:text-base">{horaLabel}</div>
        <div className="w-full border-t border-neutral-300" />
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();

    return (
    <MainLayout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[var(--background)] px-6 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-16">

          {/* Cabeçalho com mais leveza */}
          <div className="text-center space-y-4">
            <h1
              className="text-5xl sm:text-6xl font-bold drop-shadow-sm"
              style={{ 
                color: "#FF7D59", 
                fontFamily: "var(--font-vintage)",
                fontWeight: "900",
                letterSpacing: "0.05em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {t('home.title')}
            </h1>
            {/* p basic, straight, uniform font, not italic/round */}
            <p
              className="text-lg sm:text-xl"
              style={{ 
                color: "rgba(0,0,0,0.6)",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "400",
                letterSpacing: "0.02em"
              }}
            >
              {t('home.subtitle')}
            </p>

            <WeddingDate start="2025-09-21T12:00:00" />
          </div>

          {/* Cartões com mais carinho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {[
              {
                title: t('nav.details'),
                href: "/details",
                icon: <MapPin className="w-6 h-6 text-[var(--primary)]" />,
              },
              {
                title: t('nav.menu'),
                href: "/menu",
                icon: <Utensils className="w-6 h-6 text-[var(--primary)]" />,
              },
              {
                title: t('nav.message'),
                href: "/message",
                icon: <Mail className="w-6 h-6 text-[var(--primary)]" />,
              },
              {
                title: t('nav.gifts'),
                href: "/gifts",
                icon: <Gift className="w-6 h-6 text-[var(--primary)]" />,
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group rounded-2xl border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 flex items-center gap-4"
                style={{
                  // background: "linear-gradient(135deg, #F5A3A4 0%, #F08A8B 100%)",
                  // transparent background
                  background: "transparent",
                }}
              >
                <div>{item.icon}</div>
                <span className="font-medium text-lg text-[var(--primary)] transition-all duration-200">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
