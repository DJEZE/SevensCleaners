import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/Badge";
import { StatusTimeline } from "@/components/ui/StatusTimeline";
import { format } from "date-fns";
import Link from "next/link";
import { PRICING } from "@/lib/pricing";

interface Props {
  params: { id: string };
}

export default async function BookingDetailPage({ params }: Props) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  if (!user.customerProfile) redirect("/dashboard");

  const booking = await prisma.booking.findFirst({
    where: { id: params.id, customerId: user.customerProfile.id },
    include: {
      payment: true,
      assignment: { include: { cleaner: true } },
    },
  });

  if (!booking) notFound();

  const addOns = booking.addOns as string[];

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline mb-4 block">
        ← Back to My Bookings
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"} Cleaning
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            ID: <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Timeline */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-6">Status</h2>
        <StatusTimeline status={booking.status} />
      </div>

      {/* Details */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">Booking Details</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-slate-500">Service</dt>
            <dd className="font-medium">{booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"}</dd>
          </div>
          {addOns.length > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Add-Ons</dt>
              <dd className="font-medium">{addOns.map((a) => PRICING.addOns[a as keyof typeof PRICING.addOns]?.label ?? a).join(", ")}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-slate-500">Date</dt>
            <dd className="font-medium">{format(new Date(booking.scheduleDate), "EEEE, MMMM d, yyyy")}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Time Window</dt>
            <dd className="font-medium">{booking.scheduleWindow}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Address</dt>
            <dd className="font-medium">{booking.address}</dd>
          </div>
          {booking.notes && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Notes</dt>
              <dd className="font-medium">{booking.notes}</dd>
            </div>
          )}
          <div className="flex justify-between border-t pt-3">
            <dt className="font-bold text-slate-900">Total Paid</dt>
            <dd className="font-bold text-brand-600 text-lg">${booking.price}</dd>
          </div>
        </dl>
      </div>

      {/* Cleaner Info */}
      {booking.assignment && (
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Your Cleaner</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
              {booking.assignment.cleaner.name[0]}
            </div>
            <div>
              <div className="font-medium text-slate-900">{booking.assignment.cleaner.name}</div>
              <div className="text-sm text-slate-500">
                Supplies included: {booking.assignment.cleaner.suppliesIncluded ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
