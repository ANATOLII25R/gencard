import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { priceId } = await req.json();

  let stripeCustomerId: string | undefined;

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (subscription?.stripeCustomerId) {
    stripeCustomerId = subscription.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name || undefined,
    });
    stripeCustomerId = customer.id;

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        stripeCustomerId: customer.id,
        plan: "FREE",
      },
      update: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/prezzi?canceled=true`,
    metadata: {
      userId: session.user.id,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
