"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function CleanerOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", serviceArea: "",
    rate: "", suppliesIncluded: false,
    availability: {} as Record<string, boolean>,
  });
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idFront || !idBack) {
      setError("Both front and back of government ID are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("serviceArea", form.serviceArea);
      formData.append("rate", form.rate);
      formData.append("suppliesIncluded", String(form.suppliesIncluded));
      formData.append("availability", JSON.stringify(
        Object.entries(form.availability).filter(([, v]) => v).map(([k]) => k)
      ));
      formData.append("idFront", idFront);
      formData.append("idBack", idBack);

      const res = await fetch("/api/cleaners/onboard", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
      }

      router.push("/cleaner/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Join as a Cleaner</h1>
        <p className="text-slate-500 mb-8">Complete your profile to start accepting jobs. Your application will be reviewed by our admin team.</p>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input" placeholder="Jane Smith" />
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input required type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="input" placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input" placeholder="jane@example.com" />
          </div>
          <div>
            <label className="label">Service Area *</label>
            <input required value={form.serviceArea} onChange={(e) => setForm((p) => ({ ...p, serviceArea: e.target.value }))} className="input" placeholder="e.g. Downtown Atlanta, GA" />
          </div>
          <div>
            <label className="label">Your Hourly Rate ($) *</label>
            <input required type="number" min="10" max="200" value={form.rate} onChange={(e) => setForm((p) => ({ ...p, rate: e.target.value }))} className="input" placeholder="25" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="supplies" checked={form.suppliesIncluded} onChange={(e) => setForm((p) => ({ ...p, suppliesIncluded: e.target.checked }))} className="w-4 h-4 text-brand-600" />
            <label htmlFor="supplies" className="text-sm font-medium text-slate-700">I bring my own cleaning supplies</label>
          </div>

          <div>
            <label className="label">Availability (select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form.availability[day]}
                    onChange={(e) => setForm((p) => ({ ...p, availability: { ...p.availability, [day]: e.target.checked } }))}
                    className="w-4 h-4 text-brand-600"
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Government ID - Front *</label>
            <input required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setIdFront(e.target.files?.[0] ?? null)} className="input py-1.5" />
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP or PDF. Max 5MB.</p>
          </div>
          <div>
            <label className="label">Government ID - Back *</label>
            <input required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setIdBack(e.target.files?.[0] ?? null)} className="input py-1.5" />
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP or PDF. Max 5MB.</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
