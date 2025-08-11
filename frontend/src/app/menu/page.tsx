'use client';

import { Utensils, Wine } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function MenuPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Menu
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              Tudo o que você precisa saber 🍴🍹
            </p>
          </div>

          {/* Food */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)]">
            {/* Food Section */}
            <div className="flex items-start gap-4">
              <Utensils className="w-6 h-6 mt-1 text-primary" />
              <div>
                <h3 className="font-semibold text-xl">Comidas – Set Menu</h3>
                <p>O Sweethearts Rooftop serve delícias da culinária mexicana, e nós escolhemos um set menu especial com o que mais gostamos do cardápio.</p>
              </div>
            </div>
          </div>

          {/* Drinks */}
          {/* <div className="w-full min-w-[300px] max-w-[640px] mx-auto grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border"> */}
          <div className="w-full min-w-[300px] max-w-[640px] mx-auto grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#D9ADD1] shadow-md border border-border">

            <div className="flex items-start gap-4">
              <Wine className="w-6 h-6 mt-1 text-primary padding-2" />
              <div>
                <h3 className="font-semibold text-xl">Bebidas</h3>
                <p>Durante a celebração, teremos 3 horas de cervejas e vinhos selecionados à vontade para brindar com a gente!</p>
                <p><br></br>Refrigerantes e outras bebidas podem ser solicitados separadamente, conforme o menu da casa.</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs italic text-muted-foreground">
                  * Outras opções também estarão disponíveis para pedido à parte — é só falar com o garçom.
                </p>

        </main>
      </div>
    </MainLayout>
  );
}
