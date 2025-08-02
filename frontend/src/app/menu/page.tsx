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
              Comida boa e bebida gelada 🍽️🍷
            </p>
          </div>

          {/* Food */}
          {/* <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border"> */}
          {/* <div className="grid grid-cols-1 gap- p-8 rounded-2xl bg-[#D9ADD1] shadow-md border border-border"> */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)]">
            {/* Food Section */}
            <div className="flex items-start gap-4">
              <Utensils className="w-6 h-6 mt-1 text-primary" />
              <div>
                <h3 className="font-semibold text-xl">Comidas – Set Menu</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>Totopos</strong> – Tortilla chips com guacamole & salsa macha (GF) (V) (VE)</li>
                  <li><strong>Tuna Tostada</strong> – Ceviche de atum com avocado crème & salsa macha (GF)</li>
                  <li><strong>Elote</strong> – Milho grelhado com crème, limão, chilli e queijo fresco (GF) (V) (VE)</li>
                  <li><strong>Polvo Grelhado</strong> – Com batatas e sofrito de tinta de lula (GF)</li>
                  <li><strong>Carne Asada Fajitas</strong> – Carne bovina grelhada com chimichurri, crème e pimentões</li>
                </ul>
                <p className="mt-4 text-xs italic text-muted-foreground">
                  * Outras opções disponíveis no cardápio à parte.
                </p>
              </div>
            </div>
          </div>

          {/* Drinks */}
          {/* <div className="w-full min-w-[300px] max-w-[640px] mx-auto grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border"> */}
          <div className="w-full min-w-[300px] max-w-[640px] mx-auto grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#D9ADD1] shadow-md border border-border">

            <div className="flex items-start gap-4">
              <Wine className="w-6 h-6 mt-1 text-primary" />
              <div>
                <h3 className="font-semibold text-xl">Bebidas</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>PPH Lager</strong> – 4.2% ABV</li>
                  <li><strong>Cascade Premium Light</strong> – 2.5% ABV</li>
                  <li><strong>Carlton Zero</strong> – 0% ABV</li>
                  <li><strong>Pinot Grigio</strong> – Austrália</li>
                  <li><strong>Pinot Noir</strong> – Austrália</li>
                  <li><strong>Brut Cuvée</strong> – Austrália</li>
                </ul>
                <p className="mt-4 text-xs italic text-muted-foreground">
                  * Outras opções disponíveis no cardápio à parte.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
