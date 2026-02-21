import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { squareClient, SQUARE_LOCATION_ID } from "@/lib/square";
import { getOrCreateUser } from "@/lib/auth";
import { z } from "zod";
import { randomUUID } from "crypto";

const schema = z.object({
  serviceType: z.enum(["ONE_BEDROOM", "TWO_BEDROOM"]),
  addOns: z.array(z.string()),
  address: z.string().min(5).max(500),
  scheduleDate: z.string(),
  scheduleWindow: z.string(),
  notes: z.string().max(1000).optional(),
  price: z.number().positive(),
  durationMinutes: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = schema.parse(body);

    const user = await getOrCreateUser();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Ensure customer profile exists
    let profile = user.customerProfile;
    if (!profile) {
      profile = await prisma.customerProfile.create({ data: { userId: user.id } });
    }

    // Create booking record in PENDING state
    const booking = await prisma.booking.create({
      data: {
        customerId: profile.id,
        serviceType: data.serviceType,
        addOns: data.addOns,
        price: data.price,
        durationMinutes: data.durationMinutes,
        address: data.address,
        scheduleDate: new Date(data.scheduleDate + "T12:00:00"),
        scheduleWindow: data.scheduleWindow,
        notes: data.notes ?? "",
        status: "BOOKED",
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: data.price,
        status: "PENDING",
      },
    });

    // Create Square order + payment link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL environment variable is not set");
    const serviceLabel = data.serviceType === "ONE_BEDROOM" ? "1 Bedroom Cleaning" : "2 Bedroom Cleaning";

    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: randomUUID(),
      order: {
        locationId: SQUARE_LOCATION_ID,
        referenceId: booking.id,
        lineItems: [
          {
            name: serviceLabel,
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(Math.round(data.price * 100)),
              currency: "USD",
            },
          },
          ...(data.addOns.map((addOn) => ({
            name: addOn.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(0), // Priced into total already
              currency: "USD",
            },
          }))),
        ],
      },
      checkoutOptions: {
        redirectUrl: `${appUrl}/book/confirmation?bookingId=${booking.id}`,
        askForShippingAddress: false,
      },
      prePopulatedData: {
        buyerEmail: user.email,
      },
    });

    const paymentUrl = result.paymentLink?.url;
    if (!paymentUrl) {
      throw new Error("Failed to create Square payment link");
    }

    // Store Square order ID on payment record
    if (result.paymentLink?.orderId) {
      await prisma.payment.update({
        where: { bookingId: booking.id },
        data: { squareOrderId: result.paymentLink.orderId },
      });
    }

    return NextResponse.json({ bookingId: booking.id, paymentUrl });
  } catch (error) {
    console.error("Create booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
