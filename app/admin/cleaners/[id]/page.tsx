import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { getSignedUrl } from "@/lib/supabase";
import AdminCleanerControls from "./AdminCleanerControls";

interface Props {
  params: { id: string };
}

export default async function AdminCleanerDetailPage({ params }: Props) {
  const cleaner = await prisma.cleanerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      assignments: {
        include: { booking: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!cleaner) notFound();

  const availability = cleaner.availability as string[] | Record<string, unknown>;
  const availDays = Array.isArray(availability) ? availability : Object.keys(availability);

  // Get signed URLs for ID images (admin only)
  let idFrontUrl: string | null = null;
  let idBackUrl: string | null = null;

  if (cleaner.idFrontUrl) {
    // If it's a full signed URL already, use it; otherwise get a fresh one
    idFrontUrl = cleaner.idFrontUrl.startsWith("https://")
      ? cleaner.idFrontUrl
      : await getSignedUrl(cleaner.idFrontUrl);
  }
  if (cleaner.idBackUrl) {
    idBackUrl = cleaner.idBackUrl.startsWith("https://")
      ? cleaner.idBackUrl
      : await getSignedUrl(cleaner.idBackUrl);
  }

  const completedJobs = cleaner.assignments.filter((a) => a.status === "FINISHED").length;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/cleaners" className="text-sm text-brand-600 hover:underline mb-4 block">
        ← Back to Cleaners
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cleaner.name}</h1>
          <p className="text-slate-500 text-sm">{cleaner.email} · {cleaner.phone}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cleaner.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {cleaner.approved ? "Approved" : "Pending"}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cleaner.active ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
            {cleaner.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Service Area</dt><dd>{cleaner.serviceArea}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Rate</dt><dd>${cleaner.rate}/hr</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Supplies</dt><dd>{cleaner.suppliesIncluded ? "Included" : "Not included"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Joined</dt><dd>{format(new Date(cleaner.createdAt), "MMM d, yyyy")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Completed Jobs</dt><dd className="font-semibold text-green-600">{completedJobs}</dd></div>
          </dl>
          <div className="mt-3">
            <dt className="text-slate-500 text-sm mb-1">Availability</dt>
            <dd className="text-sm font-medium">{availDays.length > 0 ? availDays.join(", ") : "Not set"}</dd>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-3">Government ID</h2>
          {idFrontUrl ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Front</p>
                <a href={idFrontUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={idFrontUrl} alt="ID Front" className="w-full rounded border max-h-32 object-cover" />
                </a>
              </div>
              {idBackUrl && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Back</p>
                  <a href={idBackUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={idBackUrl} alt="ID Back" className="w-full rounded border max-h-32 object-cover" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No ID uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Admin Controls</h2>
        <AdminCleanerControls
          cleanerId={cleaner.id}
          approved={cleaner.approved}
          active={cleaner.active}
        />
      </div>

      {/* Job history */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold">Job History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Service</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {cleaner.assignments.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6 text-slate-400">No jobs yet.</td></tr>
            ) : (
              cleaner.assignments.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm">{format(new Date(a.booking.scheduleDate), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3 text-sm">{a.booking.serviceType === "ONE_BEDROOM" ? "1 BR" : "2 BR"}</td>
                  <td className="px-4 py-3 text-sm">{a.status}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">${a.booking.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
