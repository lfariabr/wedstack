'use client';
import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, AddressElement, useElements, useStripe, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { PaymentRequest } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  defaultAmount: number;                      // em cents
  defaultCurrency: "AUD" | "BRL";
  productId?: string;
};

function CheckoutForm({ clientSecret, currency }: { clientSecret: string; currency: "AUD"|"BRL" }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [prSupported, setPrSupported] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  // Payment Request (Apple Pay / Google Pay)
  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: currency === "AUD" ? "AU" : "BR",
      currency: currency.toLowerCase(),
      total: { label: "Wedding gift", amount: 0 }, // valor real é do PaymentIntent
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.canMakePayment().then(res => {
      if (res) {
        setPaymentRequest(pr);
        setPrSupported(true);
      }
    });
  }, [stripe, currency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/gift?success=1" },
      redirect: "if_required",
    });
    setLoading(false);
    if (error) alert(error.message);
    else window.location.href = "/gift?success=1";
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Endereço opcional (bom pro antifraude do cartão) */}
      <AddressElement options={{ mode: "shipping", allowedCountries: ["AU","BR"] }} />

      {/* Payment Request (Apple/Google Pay) aparece se suportado */}
      {prSupported && paymentRequest && (
        <div className="rounded-lg border p-3">
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}

      <PaymentElement options={{ layout: "tabs" }} />
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processando..." : "Pagar"}
      </Button>
    </form>
  );
}

export default function StripeTransparentCheckout({ defaultAmount, defaultCurrency, productId }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(defaultAmount);
  const [currency, setCurrency] = useState<"AUD"|"BRL">(defaultCurrency);

  const options = useMemo(
    () => (clientSecret ? { clientSecret, appearance: { variables: { colorPrimary: "#FF7D59" } } } : undefined),
    [clientSecret]
  );

  const createIntent = async () => {
    const res = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, productId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create intent");
    setClientSecret(data.clientSecret);
  };

  const [showForm, setShowForm] = useState(false);
  const handleContinue = async () => {
    await createIntent();
    setShowForm(true);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Seletores simples de valor/moeda
      <div className="grid grid-cols-2 gap-3">
        <select className="border rounded-lg px-3 py-2" value={currency} onChange={e => setCurrency(e.target.value as any)}>
          <option value="AUD">AUD</option>
          <option value="BRL">BRL (habilita Pix)</option>
        </select>
        <select className="border rounded-lg px-3 py-2" value={amount} onChange={e => setAmount(parseInt(e.target.value,10))}>
          <option value={3000}>30</option>
          <option value={5000}>50</option>
          <option value={10000}>100</option>
          <option value={20000}>200</option>
        </select>
      </div> */}

      {/* Botão para criar o intent só quando usuário decidir */}
      <Button className="w-cta" onClick={handleContinue} disabled={!amount || !currency}>
        <Gift className="w-cta-icon" />
        Pagar
      </Button>

      {showForm && clientSecret && options && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} currency={currency}/>
        </Elements>
      )}
    </div>
  );
}