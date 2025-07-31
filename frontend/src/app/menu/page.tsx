'use client';

import { Utensils, Wine } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";

export default function MenuPage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-[rgba(255,243,240,0.92)] to-[rgba(253,231,226,0.92)] dark:from-muted dark:to-background">
        <main className="container max-w-3xl px-6 py-16 space-y-12 text-foreground">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
              Menu
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Vai ter comida boa e bebida gelada 🍽️🍷
            </p>
          </div>

          {/* Card de Comida */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border">
            <div className="flex items-start gap-4">
              <Utensils className="w-6 h-6 mt-1 text-primary" />
              <div>
                <h3 className="font-semibold text-xl">Comidas - Set Menu</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>Totopos</strong> – Tortilla chips com guacamole & salsa macha (GF) (V) (VE)</li>
                  <li><strong>Tuna Tostada</strong> – Ceviche de atum com avocado crème & salsa macha (GF)</li>
                  <li><strong>Elote</strong> – Milho grelhado na espiga com crème, limão, chilli e queijo fresco (GF) (V) (VE)</li>
                  <li><strong>Polvo Grelhado</strong> – Com batatas temperadas e sofrito de tinta de lula (GF)</li>
                  <li><strong>Carne Asada Fajitas</strong> – Carne bovina grelhada com chimichurri, crème, salsa, pimentão e cebola grelhados</li>
                </ul>
                <p className="mt-4 text-xs italic text-muted-foreground">
                  Outras opções disponíveis no cardápio à parte.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Bebidas */}
          <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-white shadow-md border border-border">
            <div className="flex items-start gap-4">
              <Wine className="w-6 h-6 mt-1 text-primary" />
              <div>
                <h3 className="font-semibold text-xl">Bebidas</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>PPH Lager</strong> – 4.2% ABV</li>
                  <li><strong>Cascade Premium Light</strong> – 2.5% ABV</li>
                  <li><strong>Carlton Zero</strong> – 0% ABV</li>
                  <li><strong>Pino Grigio</strong> – Austrália</li>
                  <li><strong>Pinot Noir</strong> – Austrália</li>
                  <li><strong>Brut Cuvée</strong> – Austrália</li>
                </ul>
                <p className="mt-4 text-xs italic text-muted-foreground">
                  Outras opções disponíveis no cardápio à parte.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}