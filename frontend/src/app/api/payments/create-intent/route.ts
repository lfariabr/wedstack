import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });

export async function POST(req: Request) {
  try {
    const { amount, currency, productId } = await req.json() as {
      amount: number;                // em cents
      currency: "AUD" | "BRL";
      productId?: string;            // opcional (produto “fictício”)
    };

    if (!amount || amount < 100) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // Apple/Google Pay via PaymentRequestButton; Pix só com BRL
    const supportedPaymentMethodTypes = currency === "BRL" ? ["card", "pix"] : ["card"];

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true }, // inclui wallets quando possível
      metadata: { project: "wedstack", productId: productId ?? "gift" },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, currency, supportedPaymentMethodTypes });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}