import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Mail, Gift } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-[rgba(255,243,240,0.92)] to-[rgba(253,231,226,0.92)] dark:from-muted dark:to-background">
        <main className="container max-w-4xl px-6 py-16 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-5xl lg:text-6xl text-foreground drop-shadow-md">
              Guizo e Naná
            </h1>
            <p className="max-w-[700px] text-2xl sm:text-3xl text-center text-foreground mx-auto leading-relaxed">
              vão casar em <strong>21/set/2025</strong>
            </p>
            {/* <div className="relative flex justify-center mt-4">
            <svg width="240" height="120" viewBox="0 0 240 120" fill="none">
              <path
                id="circlePath"
                d="M20,100 A100,100 0 0,1 220,100"
                fill="transparent"
              />
              <text fill="#ED583F" fontSize="14" fontFamily="serif">
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                  Você está convidado 💌
                </textPath>
              </text>
            </svg>
          </div> */}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                title: "Detalhes",
                href: "/projects",
                icon: <MapPin className="w-6 h-6 text-primary" />,
              },
              {
                title: "Cardápio",
                href: "/projects",
                icon: <Utensils className="w-6 h-6 text-primary" />,
              },
              {
                title: "Deixe um Recado",
                href: "/projects",
                icon: <Mail className="w-6 h-6 text-primary" />,
              },
              {
                title: "Presenteie",
                href: "/articles",
                icon: <Gift className="w-6 h-6 text-primary" />,
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-md transition-all hover:shadow-lg hover:border-primary"
              >
                <div className="p-6 space-y-2 relative z-10">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <h3 className="font-semibold text-2xl sm:text-3xl tracking-tight text-foreground drop-shadow-sm group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="absolute inset-0 z-0 bg-pink-100 opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
