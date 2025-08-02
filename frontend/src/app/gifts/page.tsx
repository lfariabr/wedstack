'use client';

import { Gift, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";


export default function GiftPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000); // reset after 2s
    };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] dark:from-[#2D2A26] dark:to-[#1C1A18] px-4 py-16">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-[var(--primary)] drop-shadow-sm">
              Presentes
            </h1>
            <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
              Sua presença é o melhor presente! Mas se quiser contribuir... ❤️
            </p>
          </div>

          {/* Stripe */}
          <div className="w-full p-6 rounded-2xl bg-white shadow-sm border border-[var(--border)] space-y-4">
            <div className="flex items-center gap-4">
              <CreditCard className="text-[var(--primary)] w-6 h-6" />
              <h2 className="text-xl font-semibold">Cartão / Apple Pay / PayPal</h2>
            </div>
            <p className="text-muted-foreground">
              Contribua com qualquer valor usando seu cartão.
            </p>
            <Button asChild variant="default" className="w-full">
              <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Pagar Agora 💳</a>
            </Button>
          </div>

          {/* Pix */}
            <div className="w-full p-6 rounded-2xl bg-white shadow-sm border border-[var(--border)] space-y-4">
            <div className="flex items-center gap-4">
                <Smartphone className="text-[var(--primary)] w-6 h-6" />
                <h2 className="text-xl font-semibold">PIX (Brasil)</h2>
            </div>
            <p className="text-muted-foreground">
                Caso prefira, você pode mandar um Pix para a chave:
            </p>
            <div className="bg-muted p-4 rounded font-mono text-sm flex justify-between items-center">
                <span>41811538860</span>
                <button onClick={() => handleCopy("41811538860")}>
                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>
            </div>
            {copied === "41811538860" && (
                <p className="text-green-600 text-sm mt-2">✅ Pix copiado com sucesso!</p>
            )}
            </div>

          {/* PayID (CBA - Australia) */}
            <div className="w-full p-6 rounded-2xl bg-white shadow-sm border border-[var(--border)] space-y-4">
            <div className="flex items-center gap-4">
                <DollarSign className="text-[var(--primary)] w-6 h-6" />
                <h2 className="text-xl font-semibold">PayID (Austrália)</h2>
            </div>
            <p className="text-muted-foreground">
                Para transferências na Austrália via CBA (Commonwealth), use o PayID abaixo:
            </p>
            <div className="bg-muted p-4 rounded font-mono text-sm flex justify-between items-center">
                <span>0403278880</span>
                <button onClick={() => handleCopy("0403278880")}>
                <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>
            </div>
            {copied === "0403278880" && (
                <p className="text-green-600 text-sm mt-2">✅ PayID copiado com sucesso!</p>
            )}
            </div>


        </main>
      </div>
    </MainLayout>
  );
}
