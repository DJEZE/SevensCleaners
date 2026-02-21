import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { format } from "date-fns";
import { PRICING } from "@/lib/pricing";
import AdminBookingControls from "./AdminBookingControls";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function AdminBookingDetailPage({ params }: Props) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      customer: { include: { user: true } },
      payment: true,
      assignment: { include: { cleaner: true } },
    },
  });
  if (!booking) notFound();

  const cleaners = await prisma.cleanerProfile.findMany({
    where: { approved: true, active: true },
    orderBy: { name: "asc" },
  });

  const addOns = booking.addOns as string[];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/bookings" className="text-sm text-brand-600 hover:underline mb-4 block">
        ← Back to Bookings
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"} Cleaning
          </h1>
          <p className="text-slate-500 text-sm font-mono">
            {booking.id.slice(0, 8).toUpperCase()} · {format(new Date(booking.createdAt), "MMM d, yyyy h:mm a")}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Timeline */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Status Timeline</h2>
        <StatusTimeline status={booking.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Booking details */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Booking Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Service</dt>
              <dd>{booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"}</dd>
            </div>
            {addOns.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Add-Ons</dt>
                <dd>{addOns.map((a) => PRICING.addOns[a as keyof typeof PRICING.addOns]?.label ?? a).join(", ")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-slate-500">Date</dt>
              <dd>{format(new Date(booking.scheduleDate), "EEE, MMM d, yyyy")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Time</dt>
              <dd>{booking.scheduleWindow}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Address</dt>
              <dd className="text-right max-w-[60%]">{booking.address}</dd>
            </div>
            {booking.notes && (
              <div className="flex justify-between">
                <dt className="text-slate-500">Notes</dt>
                <dd className="text-right max-w-[60%]">{booking.notes}</dd>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <dt>Total</dt>
              <dd className="text-brand-600">${booking.price}</dd>
            </div>
          </dl>
        </div>

        {/* Payment */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Payment</h2>
          {booking.payment ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Status</dt>
                <dd><StatusBadge status={booking.payment.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Amount</dt>
                <dd>${booking.payment.amount}</dd>
              </div>
              {booking.payment.stripeSessionId && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Session ID</dt>
                  <dd className="font-mono text-xs">{booking.payment.stripeSessionId.slice(0, 20)}...</dd>
                </div>
              )}
              {booking.payment.stripePaymentIntentId && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Payment Intent</dt>
                  <dd className="font-mono text-xs">{booking.payment.stripePaymentIntentId.slice(0, 20)}...</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-slate-400 text-sm">No payment record.</p>
          )}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Admin Controls</h2>
        <AdminBookingControls
          bookingId={booking.id}
          currentStatus={booking.status}
          currentAssignment={booking.assignment ? {
            id: booking.assignment.id,
            cleanerId: booking.assignment.cleanerId,
            cleanerName: booking.assignment.cleaner.name,
            status: booking.assignment.status,
          } : null}
          cleaners={cleaners.map((c) => ({ id: c.id, name: c.name, serviceArea: c.serviceArea }))}
        />
      </div>
    </div>
  );
}
