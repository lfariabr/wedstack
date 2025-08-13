'use client';

import { Gift, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
// import StripeTransparentCheckout from "@/components/stripe/StripeTransparentCheckout";


export default function GiftPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
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

          {/* Payment Options */}
          <div className="w-full space-y-6">
            
            {/* Credit Card / Digital Payments */}
            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <CreditCard className="w-6 h-6 mt-1 text-primary" />
                <div>
                  <h3 className="font-semibold text-xl mb-2">Cartão / Apple Pay / PayPal</h3>
                  <p className="text-gray-700 mb-4">
                    A forma mais fácil e segura de contribuir para nosso casamento.
                  </p>
                  <Button className="w-cta">
                    <Gift className="w-cta-icon" />
                    Pagar Agora
                  </Button>
                  {/* <StripeTransparentCheckout defaultAmount={3000} defaultCurrency="AUD"/> */}
                </div>
              </div>
            </div>

            {/* PIX */}
            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#84B067]/20 shadow-md border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <Smartphone className="w-6 h-6 mt-1 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">PIX (Brasil)</h3>
                  <p className="text-gray-700 mb-4">
                    Transferência instantânea
                  </p>
                  
                  <div className="bg-white/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Chave PIX (CPF)</p>
                        <p className="font-mono text-sm">41811538860</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy('41811538860')}
                        className="ml-2"
                      >
                        <Copy className="w-4 h-4" />
                        {copied === '41811538860' ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/15 shadow-md border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 mt-1 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">PayID (Australia)</h3>
                  <p className="text-gray-700 mb-4">
                    Transferência instantânea
                  </p>
                  
                  <div className="bg-white/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">PayID</p>
                        <p className="font-mono">0403278880</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy('0403278880')}
                      >
                        <Copy className="w-4 h-4" />
                        {copied === '0403278880' ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-medium">Luis Guilherme de...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Thank you note */}
          {/* <div className="text-center max-w-2xl">
            <p className="text-lg text-[var(--primary)]/70 italic">
              "O amor não se mede pelo que você recebe, mas pelo que você dá. 
              Obrigado por fazer parte da nossa história!" 💕
            </p>
          </div> */}

        </main>
      </div>
    </MainLayout>
  );
}
