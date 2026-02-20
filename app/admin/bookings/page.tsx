import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/Badge";
import { format } from "date-fns";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";

interface Props {
  searchParams: { status?: string };
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const statusFilter = searchParams.status as BookingStatus | undefined;

  const bookings = await prisma.booking.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: "desc" },
    include: {
      customer: { include: { user: true } },
      assignment: { include: { cleaner: true } },
      payment: true,
    },
  });

  const statuses: (BookingStatus | "ALL")[] = ["ALL", "BOOKED", "ASSIGNED", "IN_ROUTE", "CLEANING", "COMPLETED", "CANCELLED"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">All Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/bookings" : `/admin/bookings?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (s === "ALL" && !statusFilter) || s === statusFilter
                ? "bg-brand-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cleaner</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No bookings found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    <Link href={`/admin/bookings/${b.id}`} className="text-brand-600 hover:underline">
                      {b.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">{b.serviceType === "ONE_BEDROOM" ? "1 BR" : "2 BR"}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {format(new Date(b.scheduleDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {b.assignment?.cleaner.name ?? <span className="text-yellow-600 font-medium">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">${b.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
