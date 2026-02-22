export default async function AdminCleanersPage() {
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
            <tr><td colSpan={6} className="text-center py-8 text-slate-400">No cleaners yet.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
