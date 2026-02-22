import Link from "next/link";
import { format } from "date-fns";

export default async function AdminCleanersPage() {
  const cleaners: never[] = [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cleaners</h1>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Area</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Approved</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cleaners.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No cleaners yet.</td></tr>
            ) : (
              cleaners.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{c.serviceArea}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{format(new Date(c.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex w-5 h-5 rounded-full mx-auto ${c.approved ? "bg-green-500" : "bg-slate-300"}`} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex w-5 h-5 rounded-full mx-auto ${c.active ? "bg-green-500" : "bg-red-400"}`} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/cleaners/${c.id}`} className="text-sm text-brand-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
