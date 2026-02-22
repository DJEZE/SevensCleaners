import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/cleaners", label: "Cleaners" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("admin-session")?.value;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
  if (session !== ADMIN_PASSWORD) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 flex flex-col fixed inset-y-0">
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="font-bold text-white">Sevens Cleaners</div>
          <div className="text-xs text-slate-400 mt-0.5">Admin Portal</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700">
          <form action="/api/auth/admin-logout" method="POST">
            <button type="submit" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  );
}
