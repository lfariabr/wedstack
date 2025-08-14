'use client';

import { MapPin, CalendarDays, Clock, Shirt, Cake, Menu } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

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
              Tudo o que você precisa saber
            </p>
            <p className="text-sm text-[var(--secondary)]/90">
            Sim, amigos, vamos casar!
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
            E adoraríamos ter você conosco neste dia.
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
            Teremos uma breve cerimônia civil seguida de um coquetel com comidinhas e drinks para aproveitarmos juntos.
            </p>
            <p className="text-sm text-[var(--primary)]/80 italic"> 
              <strong>Nothing fancy, just love</strong>.
            </p>
          </div>

          {/* Cartão de Informações */}
          {/* <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[[var(--accent)]/20] shadow-sm border border-[var(--border)]"> */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl shadow-sm border border-[var(--border)] sm:grid-cols-1 bg-[#F47EAB]/50"> 
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
                <p>Cocktail Semi formal</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">
                      Referências
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
                <h3 className="font-semibold text-xl">Cardápio</h3>
                <p>
                  Set menu + seleção de cervejas e vinhos
                </p>
                <Link href="/menu" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="mt-2">
                    Detalhes do cardápio
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
