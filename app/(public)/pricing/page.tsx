import Link from "next/link";
import { PRICING } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">Simple, Transparent Pricing</h1>
      <p className="text-slate-500 text-center mb-12">No hidden fees. Pay exactly what you see.</p>

      {/* Services */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {Object.entries(PRICING.services).map(([key, service]) => (
          <div key={key} className="card p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{service.label}</h2>
            <div className="text-4xl font-bold text-brand-600 mb-2">${service.price}</div>
            <p className="text-slate-500 text-sm mb-6">~{service.durationMinutes} min estimated</p>
            <Link href="/book" className="btn-primary w-full">Book Now</Link>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Optional Add-Ons</h2>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">Service</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-slate-600">Price</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-slate-600">Est. Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(PRICING.addOns).map(([key, addOn], idx) => (
              <tr key={key} className={idx % 2 === 0 ? "" : "bg-slate-50"}>
                <td className="px-6 py-4 text-slate-900">{addOn.label}</td>
                <td className="px-6 py-4 text-right text-brand-600 font-semibold">+${addOn.price}</td>
                <td className="px-6 py-4 text-right text-slate-400 text-sm">+{addOn.durationMinutes} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <Link href="/book" className="btn-primary text-lg px-10 py-3 inline-block">
          Book a Cleaning
        </Link>
      </div>
    </div>
  );
}
