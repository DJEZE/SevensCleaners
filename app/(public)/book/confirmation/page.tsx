import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { sendBookingConfirmation } from "@/lib/notifications";

interface Props {
  searchParams: { bookingId?: string };
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const bookingId = searchParams.bookingId;

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h1>
          <Link href="/book" className="btn-primary">Book a Cleaning</Link>
        </div>
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      payment: true,
      messageLogs: { where: { type: "EMAIL" } },
    },
  });

  // If payment is confirmed but no confirmation email was sent yet (e.g. webhook missed),
  // send it now so the customer always receives their confirmation.
  if (booking && booking.status !== "PENDING" && booking.messageLogs.length === 0) {
    await sendBookingConfirmation({
      id: booking.id,
      address: booking.address,
      scheduleDate: booking.scheduleDate,
      scheduleWindow: booking.scheduleWindow,
      price: booking.price,
      serviceType: booking.serviceType,
      addOns: booking.addOns,
      customerPhone: booking.guestPhone ?? undefined,
      customerEmail: booking.guestEmail ?? undefined,
    });
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h1>
          <Link href="/book" className="btn-primary">Book a Cleaning</Link>
        </div>
      </div>
    );
  }

  const isPending = booking.status === "PENDING";
  const addOns = booking.addOns as string[];
  const dateStr = new Date(booking.scheduleDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center mb-6">
          {isPending ? (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⏳
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Processing</h1>
              <p className="text-slate-500">
                Your payment is being confirmed. This page will update once it's verified.
                Booking ID:{" "}
                <span className="font-mono font-bold text-slate-900">
                  {booking.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
              <p className="text-slate-500">
                Confirmation sent by SMS and email. Booking ID:{" "}
                <span className="font-mono font-bold text-slate-900">
                  {booking.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </>
          )}
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Booking Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-slate-500">Service</dt>
              <dd className="font-medium">{booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"}</dd>
            </div>
            {addOns.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Add-Ons</dt>
                <dd className="font-medium">{addOns.join(", ")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Date</dt>
              <dd className="font-medium">{dateStr}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Time Window</dt>
              <dd className="font-medium">{booking.scheduleWindow}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Address</dt>
              <dd className="font-medium text-right max-w-[60%]">{booking.address}</dd>
            </div>
            <div className="flex justify-between border-t pt-3">
              <dt className="font-bold text-slate-900">Total {isPending ? "Due" : "Paid"}</dt>
              <dd className="font-bold text-brand-600 text-lg">${booking.price}</dd>
            </div>
          </dl>
        </div>

        {!isPending && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-slate-900 mb-6">Booking Status</h2>
            <StatusTimeline status={booking.status} />
          </div>
        )}

        <div className="text-center space-x-4">
          <Link href="/book" className="btn-primary">Book Again</Link>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
