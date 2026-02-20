import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function CleanerLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || (user.role !== "CLEANER" && user.role !== "ADMIN")) {
    redirect("/cleaner/onboarding");
  }

  const navItems = [
    { href: "/cleaner/dashboard", label: "Available Jobs" },
    { href: "/cleaner/availability", label: "Availability" },
    { href: "/cleaner/earnings", label: "Earnings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/cleaner/dashboard" className="font-bold text-brand-700">Sevens Cleaners</Link>
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
