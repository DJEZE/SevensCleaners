import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { format } from "date-fns";

export default async function CustomerDashboard() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  // Create customer profile if it doesn't exist
  let profile = user.customerProfile;
  if (!profile) {
    profile = await prisma.customerProfile.create({
      data: { userId: user.id },
    });
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: profile.id },
    orderBy: { createdAt: "desc" },
    include: { payment: true, assignment: { include: { cleaner: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">My Bookings</h1>
      <p className="text-slate-500 mb-6">Track the status of all your cleaning appointments.</p>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🧹</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h2>
          <p className="text-slate-500 mb-6">Book your first cleaning and we will take care of the rest.</p>
          <Link href="/book" className="btn-primary">Book a Cleaning</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/dashboard/bookings/${booking.id}`}
              className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow block"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"} Cleaning
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {format(new Date(booking.scheduleDate), "EEE, MMM d, yyyy")} · {booking.scheduleWindow}
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{booking.address}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={booking.status} />
                <span className="font-bold text-brand-600">${booking.price}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
