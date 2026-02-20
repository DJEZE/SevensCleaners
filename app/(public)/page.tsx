import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Pick Your Service",
    desc: "Choose a standard or deep clean, select your add-ons, and pick a date and time that works for you — all online in under 3 minutes.",
  },
  {
    number: "02",
    title: "Pay Securely",
    desc: "Check out with any major card through our Square-powered payment page. No hidden fees, no surprises — you see the total before you pay.",
  },
  {
    number: "03",
    title: "We Come to You",
    desc: "A vetted, background-checked cleaner shows up on time. You'll get SMS and email updates from the moment they're on their way.",
  },
];

const included = [
  "Kitchen — counters, sink, stovetop & appliances wiped",
  "Bathrooms — toilet, tub/shower, vanity & mirrors scrubbed",
  "All rooms — dusting, vacuuming & mopping",
  "Trash emptied & bins wiped",
  "Beds made (linens changed with Deep Clean)",
  "Interior windows and sliding doors cleaned",
];

const addons = [
  { label: "Inside Oven", icon: "🔥" },
  { label: "Inside Fridge", icon: "🧊" },
  { label: "Laundry Wash & Fold", icon: "👕" },
  { label: "Interior Cabinets", icon: "🗄️" },
  { label: "Garage Sweep", icon: "🏠" },
  { label: "Window Detail", icon: "🪟" },
];

const reasons = [
  {
    icon: "🔍",
    title: "Fully Vetted Cleaners",
    desc: "Every cleaner passes a background check and identity verification before their first job.",
  },
  {
    icon: "💬",
    title: "Real-Time Updates",
    desc: "Get notified when your cleaner is on the way, when they arrive, and when the job is done.",
  },
  {
    icon: "✅",
    title: "Satisfaction Guaranteed",
    desc: "Not happy with something? Let us know within 24 hours and we'll make it right at no extra cost.",
  },
  {
    icon: "📆",
    title: "Flexible Scheduling",
    desc: "Book one-time or recurring cleanings. Change or cancel anytime before your scheduled date.",
  },
  {
    icon: "💳",
    title: "Transparent Pricing",
    desc: "Flat-rate prices by bedroom count. No hourly surprises — you know exactly what you'll pay.",
  },
  {
    icon: "🛡️",
    title: "Insured & Professional",
    desc: "All services are fully insured. We treat your home like our own.",
  },
];

const testimonials = [
  {
    name: "Marcus T.",
    location: "Chicago, IL",
    rating: 5,
    text: "I booked a deep clean for my apartment before listing it on Airbnb. The cleaners were on time, thorough, and professional. Booked again the very next week.",
  },
  {
    name: "Priya S.",
    location: "Atlanta, GA",
    rating: 5,
    text: "The online booking took maybe two minutes. I got a text when they were on the way, and the place looked spotless when I got home. This is exactly what I needed.",
  },
  {
    name: "Jordan M.",
    location: "Houston, TX",
    rating: 5,
    text: "Sevens Cleaners has become my monthly routine. Reliable, consistent, and the pricing is totally fair. I love that I don't have to call anyone.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Professional Cleaning · On Demand
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            A Spotless Home,<br />
            <span className="text-brand-600">Booked in Minutes</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Vetted, insured cleaners. Transparent flat-rate pricing. Real-time SMS updates.
            No phone calls — book everything online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/book" className="btn-primary text-lg px-10 py-3.5 inline-block">
              Book a Cleaning
            </Link>
            <Link href="/pricing" className="btn-secondary text-lg px-10 py-3.5 inline-block">
              See Pricing
            </Link>
          </div>

          {/* Trust bar */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-slate-500 text-sm">
            {[
              { stat: "500+", label: "Cleanings Completed" },
              { stat: "4.9 ★", label: "Average Rating" },
              { stat: "100%", label: "Background-Checked Cleaners" },
            ].map(({ stat, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-slate-900">{stat}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              From booking to a clean home — the whole process is simple and stress-free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-full w-full h-px bg-brand-100 -translate-x-4 z-0" />
                )}
                <div className="card p-8 relative z-10">
                  <div className="text-4xl font-black text-brand-100 mb-4 leading-none">{step.number}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book" className="btn-primary inline-block px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="py-20 px-4 bg-brand-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Every Clean Covers the Essentials
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Our standard clean tackles every room in your home. Upgrade to a deep clean or add on exactly what you need.
              </p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Add-Ons</h3>
              <div className="grid grid-cols-2 gap-3">
                {addons.map(({ label, icon }) => (
                  <div key={label} className="card p-4 flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">Add-ons are selectable at checkout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Sevens ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Sevens Cleaners</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              We built every part of this service to make it easy to trust us with your home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div key={r.title} className="card p-6">
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-brand-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-brand-200 text-lg">Real reviews from real customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <StarRating count={t.rating} />
                <p className="text-white/90 text-sm leading-relaxed mt-4 mb-5">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-brand-300 text-xs">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="py-20 px-4 bg-brand-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple, Flat-Rate Pricing
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            No hourly billing. No hidden fees. Pay a flat rate based on your apartment size — you'll always know the total before you book.
          </p>
          <div className="card p-8 inline-block text-left w-full max-w-sm mx-auto mb-8">
            <div className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-4">Standard Clean</div>
            <div className="space-y-3 text-sm text-slate-700">
              {[
                ["Studio", "From $89"],
                ["1 Bedroom", "From $109"],
                ["2 Bedrooms", "From $139"],
                ["3+ Bedrooms", "From $169"],
              ].map(([size, price]) => (
                <div key={size} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span>{size}</span>
                  <span className="font-semibold text-slate-900">{price}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing" className="btn-primary inline-block px-8 py-3">
              Full Pricing Details
            </Link>
            <Link href="/book" className="btn-secondary inline-block px-8 py-3">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for a Fresh Start?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Book your first cleaning in minutes. Satisfaction guaranteed or we come back for free.
          </p>
          <Link
            href="/book"
            className="bg-white text-brand-700 font-bold text-lg px-12 py-4 rounded-lg hover:bg-brand-50 transition-colors inline-block"
          >
            Book a Cleaning
          </Link>
          <p className="text-xs text-brand-200 mt-4">
            No account required to get a quote. Sign up at checkout.
          </p>
        </div>
      </section>
    </>
  );
}
