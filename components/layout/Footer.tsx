import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-3">Sevens Cleaners</h3>
            <p className="text-sm text-slate-500">
              Professional apartment cleaning on demand.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/pricing" className="hover:text-slate-800">Pricing</Link></li>
              <li><Link href="/book" className="hover:text-slate-800">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/faq" className="hover:text-slate-800">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/terms" className="hover:text-slate-800">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-800">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Sevens Cleaners. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
