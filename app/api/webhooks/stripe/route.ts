import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendBookingConfirmation } from "@/lib/notifications";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    if (!bookingId) {
      console.error("Stripe webhook: missing bookingId in session metadata", session.id);
      return NextResponse.json({ received: true });
    }

    const paymentRecord = await prisma.payment.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: { customer: { include: { user: true } } },
        },
      },
    });

    if (!paymentRecord) {
      console.error("Stripe webhook: no payment record found for bookingId", bookingId);
      return NextResponse.json({ received: true });
    }

    // Mark payment complete and store payment intent ID
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: "COMPLETED",
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    });

    // Promote booking from PENDING → BOOKED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "BOOKED" },
    });

    const booking = paymentRecord.booking;
    await sendBookingConfirmation({
      id: booking.id,
      address: booking.address,
      scheduleDate: booking.scheduleDate,
      scheduleWindow: booking.scheduleWindow,
      price: booking.price,
      serviceType: booking.serviceType,
      addOns: booking.addOns,
      customerPhone: booking.customer.phone ?? undefined,
      customerEmail: booking.customer.user.email,
    });
  }

  return NextResponse.json({ received: true });
}
