export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <section>
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>By using Sevens Cleaners, you agree to these terms. If you do not agree, do not use our service.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">2. Services</h2>
          <p>Sevens Cleaners provides on-demand apartment cleaning services. We reserve the right to refuse service to anyone at any time.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">3. Booking and Payment</h2>
          <p>All bookings require prepayment. Payments are processed securely via Square. Prices displayed at checkout are final.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">4. Cancellations</h2>
          <p>Cancellations must be made at least 24 hours before the scheduled cleaning. Late cancellations may be subject to a fee.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">5. Liability</h2>
          <p>Sevens Cleaners is not liable for pre-existing damage. Cleaners are independent contractors. Claims for damages must be reported within 24 hours of service completion.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">6. Changes to Terms</h2>
          <p>We may update these terms. Continued use of the service constitutes acceptance of new terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">7. Contact</h2>
          <p>Questions? Contact us at support@sevenscleaners.com</p>
        </section>
      </div>
    </div>
  );
}
