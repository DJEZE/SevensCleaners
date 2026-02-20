import Link from "next/link";

export default function HomePage() {
  const features = [
    { icon: "📅", title: "Book in Minutes", desc: "Select your service, add-ons, and schedule online — no phone calls needed." },
    { icon: "💳", title: "Secure Payment", desc: "Pay online with any major card. Powered by Square." },
    { icon: "🧹", title: "Vetted Cleaners", desc: "All cleaners are background-checked with verified ID on file." },
    { icon: "📲", title: "Stay Updated", desc: "Get SMS and email notifications at every step." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Professional Cleaning,<br />On Your Schedule
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Book a professional apartment cleaning online in minutes. Vetted cleaners, transparent pricing, no surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-primary text-lg px-8 py-3 inline-block">
              Book a Cleaning
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-8 py-3 inline-block">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready for a Fresh Start?</h2>
        <p className="text-brand-100 mb-8 text-lg">Book your first cleaning today. Satisfaction guaranteed.</p>
        <Link href="/book" className="bg-white text-brand-700 font-bold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors inline-block">
          Book Now
        </Link>
      </section>
    </>
  );
}
