import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/Badge";
import CleanerJobActions from "./CleanerJobActions";
import Link from "next/link";

export default async function CleanerDashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });

  if (!user?.cleanerProfile) redirect("/cleaner/onboarding");

  const profile = user.cleanerProfile;

  if (!profile.approved) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Application Under Review</h2>
        <p className="text-slate-500">Your application is being reviewed. You'll be notified once approved and can start accepting jobs.</p>
      </div>
    );
  }

  // Available assignments (PENDING, not declined, assigned to this cleaner)
  const available = await prisma.assignment.findMany({
    where: { cleanerId: profile.id, status: "PENDING" },
    include: { booking: true },
    orderBy: { createdAt: "desc" },
  });

  // Active assignments
  const active = await prisma.assignment.findMany({
    where: { cleanerId: profile.id, status: { in: ["ACCEPTED", "IN_ROUTE", "STARTED"] } },
    include: { booking: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Cleaner Dashboard</h1>

      {/* Active jobs */}
      {active.length > 0 && (
        <section>
          <h2 className="font-semibold text-slate-700 mb-3">Active Jobs</h2>
          <div className="space-y-3">
            {active.map((assignment) => (
              <div key={assignment.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold">
                      {assignment.booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"} Cleaning
                    </div>
                    <div className="text-sm text-slate-500">
                      {format(new Date(assignment.booking.scheduleDate), "EEE, MMM d")} · {assignment.booking.scheduleWindow}
                    </div>
                    <div className="text-sm text-slate-400">{assignment.booking.address}</div>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>
                <CleanerJobActions
                  assignmentId={assignment.id}
                  bookingId={assignment.bookingId}
                  status={assignment.status}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available jobs */}
      <section>
        <h2 className="font-semibold text-slate-700 mb-3">New Job Offers</h2>
        {available.length === 0 ? (
          <div className="card p-8 text-center text-slate-400">No new jobs available right now.</div>
        ) : (
          <div className="space-y-3">
            {available.map((assignment) => (
              <div key={assignment.id} className="card p-5">
                <div className="mb-3">
                  <div className="font-semibold">
                    {assignment.booking.serviceType === "ONE_BEDROOM" ? "1 Bedroom" : "2 Bedroom"} Cleaning
                  </div>
                  <div className="text-sm text-slate-500">
                    {format(new Date(assignment.booking.scheduleDate), "EEE, MMM d")} · {assignment.booking.scheduleWindow}
                  </div>
                  <div className="text-sm text-slate-400">{assignment.booking.address}</div>
                  {assignment.booking.notes && (
                    <div className="text-sm text-slate-500 mt-1 italic">Note: {assignment.booking.notes}</div>
                  )}
                </div>
                <CleanerJobActions
                  assignmentId={assignment.id}
                  bookingId={assignment.bookingId}
                  status={assignment.status}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
