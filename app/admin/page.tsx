import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalBookings, completedBookings, pendingBookings, totalRevenue] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "BOOKED" } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "COMPLETED" } }),
    ]);

  const stats = [
    { label: "Total Bookings", value: totalBookings, color: "text-blue-600" },
    { label: "Completed", value: completedBookings, color: "text-green-600" },
    { label: "Awaiting Assignment", value: pendingBookings, color: "text-yellow-600" },
    { label: "Revenue", value: `$${totalRevenue._sum.amount?.toFixed(2) ?? "0.00"}`, color: "text-brand-600" },
  ];

  // Recent bookings
  const recent = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: { include: { user: true } }, assignment: { include: { cleaner: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
          <a href="/admin/bookings" className="text-sm text-brand-600 hover:underline">View all</a>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cleaner</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((b) => (
              <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-mono">
                  <a href={`/admin/bookings/${b.id}`} className="text-brand-600 hover:underline">
                    {b.id.slice(0, 8).toUpperCase()}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">{b.serviceType === "ONE_BEDROOM" ? "1 BR" : "2 BR"}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {b.assignment?.cleaner.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold">${b.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
