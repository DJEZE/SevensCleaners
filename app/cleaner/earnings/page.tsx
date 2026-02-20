import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function EarningsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });
  if (!user?.cleanerProfile) redirect("/cleaner/onboarding");

  const finished = await prisma.assignment.findMany({
    where: { cleanerId: user.cleanerProfile.id, status: "FINISHED" },
    include: { booking: { include: { payment: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const totalJobs = finished.length;
  const totalRevenue = finished.reduce((sum, a) => sum + a.booking.price, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Earnings</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-brand-600 mb-1">{totalJobs}</div>
          <div className="text-sm text-slate-500">Jobs Completed</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-brand-600 mb-1">${totalRevenue}</div>
          <div className="text-sm text-slate-500">Total Revenue*</div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-6">*Revenue figures are for display only. Payouts are processed manually.</p>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {finished.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-slate-400">No completed jobs yet.</td></tr>
            ) : (
              finished.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm">{format(new Date(a.booking.scheduleDate), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3 text-sm">{a.booking.serviceType === "ONE_BEDROOM" ? "1 BR" : "2 BR"}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-brand-600">${a.booking.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
