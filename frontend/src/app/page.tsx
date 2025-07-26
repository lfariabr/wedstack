import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950">
        <main className="container max-w-4xl px-6 py-16 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-5xl lg:text-6xl">
              Guizo e Naná
            </h1>
            <p className="max-w-[700px] text-2xl sm:text-3xl text-center text-muted-foreground mx-auto leading-relaxed">
                No dia <strong>21 de Setembro de 2025</strong>, <br></br>no <a 
                href="https://share.google/ZwFctJ79ZDOMaaT1u" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Sweethearts Rooftop
                <br></br>
              </a> em Potts Point, Sydney.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
  {[
    {
      title: "🌇 Detalhes",
      desc: "Horários, localização, dress code...",
      href: "/projects"
    },
    {
      title: "🍽️ Cardápio",
      desc: "O que vai ter pra comer e beber?",
      href: "/projects"
    },
    {
      title: "💌 Deixe um Recado",
      desc: "Uma mensagem fofa pros noivos ❤️",
      href: "/projects"
    },
    {
      title: "🎁 Presenteie",
      desc: "Demonstre seu carinho com um mimo",
      href: "/articles"
    }
  ].map((item, i) => (
    <Link
      key={i}
      href={item.href}
      className="group relative overflow-hidden rounded-2xl border border-muted bg-white/90 text-card-foreground shadow-md transition-all hover:shadow-xl hover:border-primary"
    >
      <div className="p-6 space-y-2 relative z-10">
        <h3 className="font-semibold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-base">{item.desc}</p>
      </div>
      <div className="absolute inset-0 z-0 bg-pink-100 opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl" />
    </Link>
  ))}

          </div>
{/* 
          <div className="flex justify-center mt-12">
            <Button asChild className="rounded-full px-8">
              <Link href="/projects">Ler mais</Link>
            </Button>
          </div> */}
        </main>
      </div>
    </MainLayout>
  );
}