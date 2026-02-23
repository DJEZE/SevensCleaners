"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PromoCode {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  initialCodes: PromoCode[];
}

export default function PromoCodesClient({ initialCodes }: Props) {
  const router = useRouter();
  const [codes, setCodes] = useState<PromoCode[]>(initialCodes);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: "",
    maxUses: "",
    expiresAt: "",
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create promo code.");
        return;
      }

      setCodes((prev) => [data, ...prev]);
      setShowForm(false);
      setForm({ code: "", discountType: "PERCENTAGE", discountValue: "", maxUses: "", expiresAt: "" });
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id: string, currentActive: boolean) {
    const res = await fetch(`/api/admin/promo-codes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    if (res.ok) {
      setCodes((prev) => prev.map((c) => c.id === id ? { ...c, active: !currentActive } : c));
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete promo code "${code}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/promo-codes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCodes((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Promo Codes</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary px-4 py-2 text-sm"
        >
          {showForm ? "Cancel" : "+ New Code"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Create Promo Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Code *</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") }))}
                  placeholder="e.g. WELCOME20"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Discount Type *</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "PERCENTAGE" | "FIXED" }))}
                  className="input"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
              </div>
              <div>
                <label className="label">
                  {form.discountType === "PERCENTAGE" ? "Discount % *" : "Discount Amount ($) *"}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                  placeholder={form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 15"}
                  min="0.01"
                  max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                  step="0.01"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Max Uses (leave blank for unlimited)</label>
                <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                  placeholder="e.g. 100"
                  min="1"
                  className="input"
                />
              </div>
              <div className="col-span-2">
                <label className="label">Expiration Date (leave blank for no expiry)</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="input"
                />
              </div>
            </div>

            {formError && (
              <p className="text-red-600 text-sm">{formError}</p>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary px-6 py-2">
                {submitting ? "Creating..." : "Create Code"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-6 py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promo codes table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Discount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Uses</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Expires</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No promo codes yet. Create your first one above.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-sm text-slate-900">{c.code}</td>
                  <td className="px-4 py-3 text-sm">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}% off`
                      : `$${c.discountValue} off`}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleToggle(c.id, c.active)}
                        className="text-xs text-slate-500 hover:text-slate-900 underline"
                      >
                        {c.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
