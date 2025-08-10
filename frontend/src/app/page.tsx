import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { MapPin, Utensils, Mail, Gift, Check } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[var(--background)] px-6 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-16">

          {/* Cabeçalho com mais leveza */}
          <div className="text-center space-y-4">
            <h1
              className="text-5xl sm:text-6xl font-bold drop-shadow-sm"
              style={{ 
                color: "#AEA434",
                fontFamily: "var(--font-vintage)",
                fontWeight: "900",
                letterSpacing: "0.05em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Guizo & Naná
            </h1>
            {/* p basic, straight, uniform font, not italic/round */}
            <p
              className="text-lg sm:text-xl"
              style={{ 
                color: "#FF7D59",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "400",
                letterSpacing: "0.02em"
              }}
            >
              Convidam para seu casamento civil
            </p>

            <p className="text-lg sm:text-xl" style={{ color: "#D1D16I" }}>
              <strong style={{ color: "#AEA434", fontStyle: "normal" }}>
                21 de Setembro de 2025
              </strong>
              <br />
              <strong style={{ color: "#AEA434", fontStyle: "normal" }}>
                12:00pm - 3:00pm
              </strong>
            </p>
          </div>

          {/* Cartões com mais carinho */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {[
              {
                title: "Detalhes",
                href: "/details",
                icon: <MapPin className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/95",
              },
              {
                title: "Cardápio",
                href: "/menu",
                icon: <Utensils className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/95",
              },
              {
                title: "Deixe um Recado",
                href: "/message",
                icon: <Mail className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/95",
              },
              {
                title: "Presenteie",
                href: "/gifts",
                icon: <Gift className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/95",
              },
              {
                title: "Confirme sua Presença",
                href: "/confirmation",
                icon: <Check className="w-6 h-6 text-[var(--primary)]" />,
                bg: "bg-[var(--secondary)]/95",
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
