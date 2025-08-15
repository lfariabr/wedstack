import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { priceId, label, amount, currency = "AUD", quantity = 1, locale, image } = await req.json();

    // Validate request body
    if (!priceId && (!label || typeof amount !== "number")) {
      return NextResponse.json(
        { error: "Provide either priceId or (label and amount)" },
        { status: 400 }
      );
    }

    // Validate secret key
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfigured: STRIPE_SECRET_KEY not set" }, { status: 500 });
    }
    if (!secret.startsWith("sk_")) {
      return NextResponse.json({ error: "Server Stripe key misconfigured" }, { status: 500 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Build absolute image URL if provided
    let imageUrl: string | undefined;
    if (image) {
      if (image.startsWith("http")) {
        imageUrl = image;
      } else {
        // resolve relative to origin
        imageUrl = `${origin}${image.startsWith("/") ? image : `/${image}`}`;
      }
    }
    // Only allow https image URLs for Stripe
    if (imageUrl && !imageUrl.startsWith("https://")) {
      imageUrl = undefined;
    }

    // Use a stable API version
    const stripe = new Stripe(secret, { apiVersion: "2025-07-30.basil" });

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = priceId
      ? {
          price: priceId,
          quantity,
        }
      : {
          quantity,
          price_data: {
            currency,
            unit_amount: Math.round(Number(amount) * 100),
            product_data: {
              name: label as string,
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
          },
        };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gifts?canceled=1`,
      locale: locale || "auto",
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error("/api/checkout error", err);
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}