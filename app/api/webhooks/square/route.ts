import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/notifications";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifySquareSignature(body: string, signature: string, signatureKey: string, url: string): boolean {
  const hmac = crypto.createHmac("sha256", signatureKey);
  hmac.update(url + body);
  const expected = hmac.digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature") ?? "";
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? "";
    const url = (process.env.NEXT_PUBLIC_APP_URL ?? "") + "/api/webhooks/square";

    // Verify signature in production
    if (process.env.SQUARE_ENVIRONMENT === "production" && signatureKey) {
      if (!verifySquareSignature(body, signature, signatureKey, url)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType: string = event.type ?? "";

    if (eventType === "payment.completed") {
      const payment = event.data?.object?.payment;
      const orderId: string = payment?.order_id ?? "";
      const paymentId: string = payment?.id ?? "";
      const status: string = payment?.status ?? "";

      if (orderId && status === "COMPLETED") {
        const paymentRecord = await prisma.payment.findFirst({
          where: { squareOrderId: orderId },
          include: { booking: { include: { customer: { include: { user: true } } } } },
        });

        if (paymentRecord) {
          await prisma.payment.update({
            where: { id: paymentRecord.id },
            data: { status: "COMPLETED", squarePaymentId: paymentId },
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
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
