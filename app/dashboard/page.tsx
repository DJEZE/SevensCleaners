import Link from "next/link";

export default function CustomerDashboard() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🧹</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">No account needed</h1>
      <p className="text-slate-500 mb-6">
        We don&apos;t require an account. Check your confirmation email for booking details.
      </p>
      <Link href="/book" className="btn-primary">Book a Cleaning</Link>
    </div>
  );
}
