export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-slate-600">
        <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <section>
          <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
          <p>We collect your name, email, phone number, service address, and payment information (processed securely, never stored by us).</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>To process and fulfill your booking</li>
            <li>To send booking confirmations and status updates via SMS and email</li>
            <li>To improve our service</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">Data Retention</h2>
          <p>We retain booking records for 3 years for business and tax purposes. You may request deletion of your account by contacting us.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>Privacy questions: privacy@sevenscleaners.com</p>
        </section>
      </div>
    </div>
  );
}
