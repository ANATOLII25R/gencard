import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session.metadata?.userId;
    if (!userId) return NextResponse.json({ error: "No userId" }, { status: 400 });

    const priceId = subscription.items.data[0].price.id;
    let plan: "FREE" | "PRO" | "BUSINESS" = "FREE";
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "PRO";
    if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "BUSINESS";

    const subObj = subscription as any;

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subObj.id,
        stripeCustomerId: subObj.customer as string,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(subObj.current_period_end * 1000),
        plan,
        status: subObj.status,
      },
      update: {
        stripeSubscriptionId: subObj.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(subObj.current_period_end * 1000),
        plan,
        status: subObj.status,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      (event.data.object as any).subscription as string
    );

    const subObj = subscription as any;

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subObj.id },
      data: {
        stripeCurrentPeriodEnd: new Date(subObj.current_period_end * 1000),
        status: subObj.status,
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { plan: "FREE", status: "canceled" },
    });
  }

  return NextResponse.json({ received: true });
}
