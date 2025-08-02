'use client';

import { MapPin, CalendarDays, Clock, Shirt, Cake } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DetailsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">

          {/* Cabeçalho com elegância */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Detalhes
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              Tudo o que você precisa saber 💍
            </p>
          </div>

          {/* Cartão de Informações */}
          {/* <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[[var(--accent)]/20] shadow-sm border border-[var(--border)]"> */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl shadow-sm border border-[var(--border)] sm:grid-cols-1 bg-[#C7B65D33]">
          {/* <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-sm border border-[var(--border)] sm:grid-cols-1"> */}
            {/* Local */}
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1 text-[var(--primary)]" />
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
                    Ver no mapa
                  </Button>
                </Link>
              </div>
            </div>

            {/* Data */}
            <div className="flex items-start gap-4">
              <CalendarDays className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">Data</h3>
                <p>Domingo, 21 de setembro de 2025</p>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">Horário</h3>
                <p>Cerimônia e recepção às 12:00</p>
              </div>
            </div>

            {/* Traje */}
            <div className="flex items-start gap-4">
              <Shirt className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">Traje</h3>
                <p>Preferencialmente preto — elegante, confortável e com estilo</p>
              </div>
            </div>

            {/* Bolo */}
            <div className="flex items-start gap-4">
              <Cake className="w-6 h-6 mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-xl">Sobre o Bolo</h3>
                <p>
                  Vai ter bolo (e é grande!). Não precisa correr — será servido com calma ❤️
                </p>
                <Link href="/menu" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="mt-2">
                    Ver o cardápio completo
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
