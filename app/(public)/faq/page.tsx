const faqs = [
  {
    q: "How do I book a cleaning?",
    a: "Select your service type, choose any add-ons, enter your address, pick a date and time window, then pay securely online. You'll get a confirmation by SMS and email.",
  },
  {
    q: "How much does it cost?",
    a: "1 bedroom starts at $120 and 2 bedroom starts at $160. Add-ons like deep clean, inside oven/fridge, move-in/out, and pet hair are available at an additional cost. All prices are shown before checkout.",
  },
  {
    q: "Are your cleaners vetted?",
    a: "Yes. All cleaners provide a government-issued photo ID which is verified and securely stored. We only activate cleaners who have been approved by our admin team.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve the local metropolitan area. Enter your address during booking — if we don't serve your area, we'll let you know.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Contact us as soon as possible. We'll do our best to accommodate your request. Cancellations within 24 hours of the scheduled time may incur a fee.",
  },
  {
    q: "Do cleaners bring their own supplies?",
    a: "Some cleaners include supplies; this is shown during the booking assignment. You can also add a note if you have specific product preferences.",
  },
  {
    q: "How will I know when my cleaner is on the way?",
    a: "You'll receive an SMS and email notification when a cleaner is assigned and again when they are in route.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. Payments are processed by Square — a PCI-compliant payment processor. We never store your card details.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach our support team by email at Support@Sevenscleaners.com. We're happy to help with any questions or concerns.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-slate-500 text-center mb-12">Everything you need to know about Sevens Cleaners.</p>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.q} className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
            <p className="text-slate-600 text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-slate-600 text-sm">Still have questions? Email us at{" "}
          <a href="mailto:Support@Sevenscleaners.com" className="text-blue-600 hover:underline">
            Support@Sevenscleaners.com
          </a>
        </p>
      </div>
    </div>
  );
}
