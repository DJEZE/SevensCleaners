import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function CleanerLayout({ children }: { children: React.ReactNode }) {
  const cleanerId = cookies().get("cleaner-id")?.value;
  if (!cleanerId) redirect("/cleaner/login");

  const navItems = [
    { href: "/cleaner/dashboard", label: "Available Jobs" },
    { href: "/cleaner/availability", label: "Availability" },
    { href: "/cleaner/earnings", label: "Earnings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/cleaner/dashboard">
            <Image src="/logo.png" alt="Sevens Cleaners" width={130} height={44} className="object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/cleaner-logout" method="POST">
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
