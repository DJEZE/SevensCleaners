import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  serviceType: z.enum(["ONE_BEDROOM", "TWO_BEDROOM"]),
  addOns: z.array(z.string()),
  address: z.string().min(5).max(500),
  scheduleDate: z.string(),
  scheduleWindow: z.string(),
  notes: z.string().max(1000).optional(),
  price: z.number().positive(),
  durationMinutes: z.number().positive(),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set");

    // Create booking in PENDING — confirmed to BOOKED only after Stripe webhook fires
    const booking = await prisma.booking.create({
      data: {
        serviceType: data.serviceType,
        addOns: data.addOns,
        price: data.price,
        durationMinutes: data.durationMinutes,
        address: data.address,
        scheduleDate: new Date(data.scheduleDate + "T12:00:00"),
        scheduleWindow: data.scheduleWindow,
        notes: data.notes ?? "",
        status: "PENDING",
        guestEmail: data.email,
        guestPhone: data.phone ?? null,
      },
    });

    const serviceLabel =
      data.serviceType === "ONE_BEDROOM" ? "1 Bedroom Cleaning" : "2 Bedroom Cleaning";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: serviceLabel },
          unit_amount: Math.round(data.price * 100),
        },
        quantity: 1,
      },
    ];

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: data.email,
      metadata: { bookingId: booking.id },
      success_url: `${appUrl}/book/confirmation?bookingId=${booking.id}`,
      cancel_url: `${appUrl}/book`,
    });

    if (!session.url) throw new Error("Failed to create Stripe Checkout Session");

    // Persist the session ID so the webhook can look up this booking
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripeSessionId: session.id,
        amount: data.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({ bookingId: booking.id, paymentUrl: session.url });
  } catch (error) {
    console.error("Create booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
