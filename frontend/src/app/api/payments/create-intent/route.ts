// // frontend/app/api/payments/create-intent/route.ts
// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// export const runtime = "nodejs"; // garante Node (Edge não funciona com Stripe SDK)

// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
// const stripe = STRIPE_SECRET_KEY
//   ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-07-30.basil" })
//   : null;

// export async function POST(req: Request) {
//   try {
//     if (!stripe) {
//       console.warn("Stripe secret key is not set. Payment functionality is disabled.");
//       return NextResponse.json(
//         { error: "Payment service not configured" },
//         { status: 501 }
//       );
//     }

//     const { amount, currency, productId } = (await req.json()) as {
//       amount: number;               // em cents
//       currency: "AUD" | "BRL";
//       productId?: string;
//     };

//     if (!amount || amount < 100) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     // Optional: manter para logs/telemetria
//     const supportedPaymentMethodTypes =
//       currency === "BRL" ? (["card", "pix"] as const) : (["card"] as const);

//     const intent = await stripe.paymentIntents.create({
//       amount,
//       currency: currency.toLowerCase() as "aud" | "brl",
//       // Habilita 'card' e wallets automaticamente; Pix aparece quando currency='brl' e conta habilitada
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         project: "wedstack",
//         productId: productId ?? "gift",
//         currencySelected: currency,
//       },
//     });

//     return NextResponse.json({
//       clientSecret: intent.client_secret,
//       currency,
//       supportedPaymentMethodTypes,
//     });
//   } catch (e: any) {
//     console.error(e);
//     return NextResponse.json(
//       { error: e?.message ?? "Server error" },
//       { status: 500 }
//     );
//   }
// }