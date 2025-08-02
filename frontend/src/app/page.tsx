import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { MapPin, Utensils, Mail, Gift } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[var(--background)] px-6 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-16">

          {/* Cabeçalho com mais leveza */}
          <div className="text-center space-y-4">
            <span className="text-[var(--primary)] text-sm font-semibold tracking-widest uppercase">
              Você está convidado
            </span>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Guizo & Naná
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              vão casar em <strong className="text-[var(--accent)] not-italic">21/set/2025</strong>
            </p>
          </div>

          {/* Cartões com mais carinho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {[
              {
                title: "Detalhes",
                href: "/details",
                icon: <MapPin className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/30",
              },
              {
                title: "Cardápio",
                href: "/menu",
                icon: <Utensils className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--accent)]/20",
              },
              {
                title: "Deixe um Recado",
                href: "/message",
                icon: <Mail className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/30",
              },
              {
                title: "Presenteie",
                href: "/gifts",
                icon: <Gift className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--accent)]/20",
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`group rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all ${item.bg} p-6 flex items-center gap-4 hover:border-[var(--primary)]`}
              >
                <div>{item.icon}</div>
                <span className="font-medium text-lg text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
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
