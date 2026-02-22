import Link from "next/link";
import Image from "next/image";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Sevens Cleaners" width={130} height={44} className="object-contain" />
          </Link>
          <Link href="/book" className="btn-primary text-sm">Book a Cleaning</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
