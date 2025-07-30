'use client';

import { MapPin, CalendarDays, Clock, Shirt, LocateFixed, Cake } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DetailsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-[rgba(255,243,240,0.92)] to-[rgba(253,231,226,0.92)] dark:from-muted dark:to-background">
      <main className="container max-w-3xl px-6 py-16 space-y-12 text-foreground">
  <div className="text-center space-y-4">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
      Detalhes
    </h1>
    <p className="text-xl sm:text-2xl text-muted-foreground">
      Tudo o que você precisa saber 💍
    </p>
  </div>

  {/* CARD BRANCO */}
  <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border sm:grid-cols-1 lg:grid-cols-1">
    <div className="flex items-start gap-4">
      <MapPin className="w-6 h-6 mt-1 text-primary" />
      <div>
        <h3 className="font-semibold text-xl">Local</h3>
        <p><i>Sweethearts Rooftop</i></p>
        <p>Level 3/33-35 Darlinghurst Rd, Potts Point</p>
        <Link
          href="https://www.google.com/search?kgmid=%2Fg%2F11scjlxb18&hl=en-AU&q=Sweethearts%20Rooftop"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="mt-2">
            Ver o endereço no mapa
          </Button>
        </Link>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <CalendarDays className="w-6 h-6 mt-1 text-primary" />
      <div>
        <h3 className="font-semibold text-xl">Data</h3>
        <p>Domingo, 21 de setembro de 2025</p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Clock className="w-6 h-6 mt-1 text-primary" />
      <div>
        <h3 className="font-semibold text-xl">Horário</h3>
        <p>Cerimônia e recepção às 12:00</p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Shirt className="w-6 h-6 mt-1 text-primary" />
      <div>
        <h3 className="font-semibold text-xl">Traje</h3>
        <p>Preferencialmente preto — elegante, confortável e com estilo</p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <Cake className="w-6 h-6 mt-1 text-primary" />
      <div>
        <h3 className="font-semibold text-xl">Sobre o Bolo</h3>
        <p>Vai ter bolo (e é grande!). Não precisa correr — vai ser servido com calma ❤️</p>
        <Link
          href="/menu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="mt-2">
            Ver outros itens do Menu
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