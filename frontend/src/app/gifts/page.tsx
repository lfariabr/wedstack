'use client';

// Opt out of static rendering so useSearchParams can be used safely at build time
export const dynamic = 'force-dynamic';

import { Gift, CreditCard, DollarSign, Smartphone } from "lucide-react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useCallback, useMemo, useState, Suspense, useEffect } from "react";
import { useI18n } from '@/lib/i18n/I18nProvider';
import getStripe from "@/lib/stripe/stripeClient";

export default function GiftPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canceled, setCanceled] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      setSuccess(sp.get('success'));
      setCanceled(sp.get('canceled'));
    }
  }, []);

  // Some i18n libs return the key when a translation is missing.
  // This helper falls back to a friendly default in that case.
  const safeT = useCallback((key: string, fallback: string) => {
    const val = t(key) as unknown as string;
    if (!val || val === key) return fallback;
    return val;
  }, [t]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const products = useMemo(() => (
    [
      { id: 'prod_Ss3yAmvLaWA3Sj', label: "Long Black", priceId: 'price_1RwJq5FFcBU9iCCUoPShv4mF', amount: 5, currency: 'AUD', image: '/gifts/coffee.jpg' },
      { id: 'prod_Ss3zdlKrhJTrDB', label: "Pistachio Rivareno", priceId: 'price_1RwJrEFFcBU9iCCUcSlMIjS1', amount: 15, currency: 'AUD', image: '/gifts/rivareno.jpg' },
      { id: 'prod_Ss3xxgkcUO0Bka', label: "30 min Thai Massage", priceId: 'price_1RwJpDFFcBU9iCCUJO4pQr48', amount: 50, currency: 'AUD', image: '/gifts/capuccino.jpeg' },
      { id: 'prod_Ss3zvnZ8ldlfSK', label: "Romantic Dinner", priceId: 'price_1RwJrXFFcBU9iCCU6dT9aKCd', amount: 100, currency: 'AUD', image: '/gifts/dinner.jpeg' },
    ] as { id: string; label: string; priceId: string; amount: number; currency: 'AUD' | 'BRL'; image?: string }[]
  ), []);

  const handleCheckout = useCallback(async (product: { label: string; amount: number; currency: 'AUD' | 'BRL'; priceId: string; id: string; image?: string }) => {
    try {
      setLoadingId(product.priceId);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: product.label, amount: product.amount, currency: product.currency, quantity: 1, image: product.image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');

      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe failed to initialize');
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) alert(error.message);
    } catch (e: any) {
      alert(e?.message || 'Checkout error');
    } finally {
      setLoadingId(null);
    }
  }, []);

  const formatPrice = useCallback((amount: number, currency: 'AUD' | 'BRL') => {
    const locale = currency === 'BRL' ? 'pt-BR' : 'en-AU';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }, []);

  return (
    <Suspense fallback={<div />}>
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-[#FCF9F4] px-4 py-16">
          <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="w-script text-6xl sm:text-6xl font-serif font-bold text-[#F47EAB]/50 drop-shadow-sm">
                {t('gifts.headerTitle')}
              </h1>
              <p className="text-lg sm:text-xl text-[var(--primary)]/80 italic">
                {t('gifts.headerSubtitle')}
              </p>
            </div>

            {/* Alerts for success/cancel */}
            {(success || canceled) && (
              <div className={`w-full rounded-lg border p-4 ${success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                {success && (
                  <p className="text-green-700">{safeT('gifts.thankYou', 'Thank you for your gift! 💕')}</p>
                )}
                {canceled && (
                  <p className="text-yellow-700">{safeT('gifts.checkoutCanceled', 'Checkout canceled. You can try again anytime.')}</p>
                )}
              </div>
            )}

            {/* Payment Options */}
            <div className="w-full space-y-6">
              {/* Credit Card / Digital Payments */}
              <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[var(--accent)]/20 shadow-md border border-[var(--border)]">
                <div className="flex items-start gap-4">
                  <CreditCard className="w-6 h-6 mt-1 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2">{t('gifts.ccTitle')}</h3>
                    <p className="text-gray-700 mb-4">{t('gifts.ccDesc')}</p>

                    {/* Product cards - 2x2 grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {products.map((p) => (
                        <div key={p.id} className="rounded-xl border border-[var(--border)] bg-white/70 p-3 shadow-sm flex flex-col">
                          {p.image && (
                            <img src={p.image} alt={p.label} className="mb-2 h-20 w-full object-cover rounded-md" />
                          )}
                          <div className="mb-0.5 font-semibold text-[var(--primary)] text-sm">{p.label}</div>
                          <div className="mb-2 text-xs text-gray-600">{formatPrice(p.amount, p.currency)}</div>
                          <Button
                            className="w-full py-2 text-sm"
                            onClick={() => handleCheckout(p)}
                            disabled={loadingId === p.priceId}
                            aria-busy={loadingId === p.priceId}
                          >
                            <Gift className="mr-2 h-4 w-4" /> {loadingId === p.priceId ? (t('common.processing') || 'Processando...') : t('gifts.payNow')}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PIX */}
              <div className="grid grid-cols-1 gap-6 p-8 rounded-2xl bg-[#F47EAB]/50 shadow-md border border-[var(--border)]">
                <div className="flex items-start gap-4">
                  <Smartphone className="w-6 h-6 mt-1 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-2">{t('gifts.pixTitle')}</h3>
                    <p className="text-gray-700 mb-4">{t('gifts.pixDesc')}</p>

                    <div className="bg-white/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{t('gifts.pixKeyCpf')}</p>
                          <p className="font-mono text-sm">41811538860</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy('41811538860')}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copied === '41811538860' ? t('gifts.copied') : t('gifts.copy')}
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
                    <h3 className="font-semibold text-xl mb-2">{t('gifts.payidTitle')}</h3>
                    <p className="text-gray-700 mb-4">{t('gifts.payidDesc')}</p>

                    <div className="bg-white/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{t('gifts.payidLabel')}</p>
                          <p className="font-mono">0403278880</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy('0403278880')}
                        >
                          <Copy className="w-4 h-4" />
                          {copied === '0403278880' ? t('gifts.copied') : t('gifts.copy')}
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('gifts.nameLabel')}</p>
                        <p className="font-medium">Luis Guilherme de...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </MainLayout>
    </Suspense>
  );
}
