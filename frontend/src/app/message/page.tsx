'use client';

import { Send, MessageSquare } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function MessagePage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">

          {/* Cabeçalho */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Recadinhos
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              Escreva um recado especial para os noivos 💌
            </p>
          </div>

          {/* Formulário */}
          <div className="w-full max-w-[640px] p-8 rounded-2xl bg-[#CBCADC]/20 shadow-sm border border-[var(--border)] space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Seu nome
              </label>
              <Input placeholder="Ex: Tia Jurema" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Escreva um recado para os noivos
              </label>
              <Textarea placeholder="Ex: Que alegria participar desse momento tão especial..." rows={4} />
            </div>

            <Button className="flex items-center gap-2" type="submit">
              <Send className="w-4 h-4" />
              Enviar recado
            </Button>
          </div>

          {/* Mensagens já enviadas */}
          <div className="w-full max-w-[640px] space-y-4 mt-8">
            <h2 className="text-2xl font-semibold text-[var(--primary)]">Mensagens recebidas 💬</h2>

            <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground italic">"Parabéns Nay e Luis! Que Deus abençoe essa união."</p>
              <p className="text-xs text-right text-muted-foreground mt-2">— João Pedro</p>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground italic">"Mal posso esperar para comemorar com vocês! 💖"</p>
              <p className="text-xs text-right text-muted-foreground mt-2">— Tia Sebastiana</p>
            </div>

            {/* Add mais mensagens aqui quando conectar com backend ou banco */}
          </div>

        </main>
      </div>
    </MainLayout>
  );
}
