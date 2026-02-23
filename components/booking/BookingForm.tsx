"use client";

import { useState } from "react";
import { PRICING, ServiceType, AddOnType, calculateTotal } from "@/lib/pricing";

interface BookingFormState {
  step: number;
  serviceType: ServiceType | null;
  addOns: AddOnType[];
  address: string;
  scheduleDate: string;
  scheduleWindow: string;
  notes: string;
  email: string;
  phone: string;
  promoCode: string;
}

interface PromoResult {
  valid: boolean;
  message?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  discountAmount?: number;
  finalPrice?: number;
  code?: string;
}

const TIME_WINDOWS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

const ADD_ON_KEYS = Object.keys(PRICING.addOns) as AddOnType[];

export default function BookingForm() {
  const [state, setState] = useState<BookingFormState>({
    step: 1,
    serviceType: null,
    addOns: [],
    address: "",
    scheduleDate: "",
    scheduleWindow: "",
    notes: "",
    email: "",
    phone: "",
    promoCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const pricing =
    state.serviceType ? calculateTotal(state.serviceType, state.addOns) : null;

  const subtotal = pricing?.price ?? 0;
  const discountAmount = promoResult?.valid ? (promoResult.discountAmount ?? 0) : 0;
  const finalPrice = Math.max(0, subtotal - discountAmount);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  function toggleAddOn(key: AddOnType) {
    setState((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(key)
        ? prev.addOns.filter((a) => a !== key)
        : [...prev.addOns, key],
    }));
    // Clear promo when service changes since subtotal changes
    setPromoResult(null);
    setPromoInput("");
  }

  async function handleNextToReview() {
    setValidatingAddress(true);
    setAddressError("");
    try {
      const res = await fetch(`/api/validate-address?address=${encodeURIComponent(state.address)}`);
      const data = await res.json();
      if (!data.valid) {
        setAddressError(data.error || "Address is outside our service area.");
        return;
      }
      setState((p) => ({ ...p, step: 3 }));
    } catch {
      // On failure, allow proceeding
      setState((p) => ({ ...p, step: 3 }));
    } finally {
      setValidatingAddress(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoInput.trim() || !pricing) return;
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), subtotal }),
      });
      const data: PromoResult = await res.json();
      setPromoResult(data);
      if (data.valid && data.code) {
        setState((p) => ({ ...p, promoCode: data.code! }));
      }
    } catch {
      setPromoResult({ valid: false, message: "Could not apply promo code. Please try again." });
    } finally {
      setPromoLoading(false);
    }
  }

  function handleRemovePromo() {
    setPromoResult(null);
    setPromoInput("");
    setState((p) => ({ ...p, promoCode: "" }));
  }

  async function handleCheckout() {
    if (!state.serviceType || !state.address || !state.scheduleDate || !state.scheduleWindow || !state.email) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: state.serviceType,
          addOns: state.addOns,
          address: state.address,
          scheduleDate: state.scheduleDate,
          scheduleWindow: state.scheduleWindow,
          notes: state.notes,
          price: subtotal,
          durationMinutes: pricing!.durationMinutes,
          email: state.email,
          phone: state.phone || undefined,
          promoCode: state.promoCode || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const { paymentUrl } = await res.json();
      window.location.href = paymentUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s <= state.step
                  ? "bg-brand-600 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${s === state.step ? "font-semibold text-slate-900" : "text-slate-400"}`}>
              {s === 1 ? "Service" : s === 2 ? "Schedule" : "Review"}
            </span>
            {s < 3 && <div className="w-8 h-px bg-slate-300" />}
          </div>
        ))}
      </div>

      {/* Step 1: Service Selection */}
      {state.step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Choose Your Service</h2>

          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(PRICING.services) as ServiceType[]).map((key) => {
              const service = PRICING.services[key];
              return (
                <button
                  key={key}
                  onClick={() => setState((p) => ({ ...p, serviceType: key }))}
                  className={`p-6 rounded-xl border-2 text-center transition-all ${
                    state.serviceType === key
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <div className="font-bold text-lg text-slate-900">{service.label}</div>
                  <div className="text-2xl font-bold text-brand-600 mt-1">${service.price}</div>
                  <div className="text-xs text-slate-400 mt-1">~{service.durationMinutes} min</div>
                </button>
              );
            })}
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Add-Ons (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              {ADD_ON_KEYS.map((key) => {
                const addOn = PRICING.addOns[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleAddOn(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      state.addOns.includes(key)
                        ? "border-brand-600 bg-brand-50"
                        : "border-slate-200 hover:border-brand-300"
                    }`}
                  >
                    <div className="font-medium text-sm text-slate-900">{addOn.label}</div>
                    <div className="text-brand-600 font-semibold text-sm">+${addOn.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {pricing && (
            <div className="card p-4 bg-brand-50 border-brand-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Estimated Total</span>
                <span className="text-2xl font-bold text-brand-600">${pricing.price}</span>
              </div>
              <div className="text-sm text-slate-500 mt-1">~{pricing.durationMinutes} minutes</div>
            </div>
          )}

          <button
            onClick={() => setState((p) => ({ ...p, step: 2 }))}
            disabled={!state.serviceType}
            className="btn-primary w-full py-3"
          >
            Next: Schedule
          </button>
        </div>
      )}

      {/* Step 2: Address & Schedule */}
      {state.step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Address & Schedule</h2>

          <div>
            <label className="label">Service Address *</label>
            <input
              type="text"
              value={state.address}
              onChange={(e) => { setState((p) => ({ ...p, address: e.target.value })); setAddressError(""); }}
              placeholder="Enter your full address"
              className={`input ${addressError ? "border-red-400" : ""}`}
              id="address-autocomplete"
            />
            {addressError && (
              <p className="text-red-600 text-sm mt-1">{addressError}</p>
            )}
          </div>

          <div>
            <label className="label">Preferred Date *</label>
            <input
              type="date"
              value={state.scheduleDate}
              min={minDate}
              onChange={(e) => setState((p) => ({ ...p, scheduleDate: e.target.value }))}
              className="input"
            />
          </div>

          <div>
            <label className="label">Preferred Time Window *</label>
            <div className="grid grid-cols-1 gap-2">
              {TIME_WINDOWS.map((window) => (
                <button
                  key={window}
                  onClick={() => setState((p) => ({ ...p, scheduleWindow: window }))}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    state.scheduleWindow === window
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <span className="text-sm font-medium">{window}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Special Notes (Optional)</label>
            <textarea
              value={state.notes}
              onChange={(e) => setState((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Entry instructions, areas of focus, pets, etc."
              rows={3}
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setState((p) => ({ ...p, step: 1 }))} className="btn-secondary flex-1 py-3">
              Back
            </button>
            <button
              onClick={handleNextToReview}
              disabled={!state.address || !state.scheduleDate || !state.scheduleWindow || validatingAddress}
              className="btn-primary flex-1 py-3"
            >
              {validatingAddress ? "Checking address..." : "Next: Review"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Pay */}
      {state.step === 3 && state.serviceType && pricing && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Review & Pay</h2>

          <div className="card p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Service</span>
              <span className="font-medium">{PRICING.services[state.serviceType].label}</span>
            </div>
            {state.addOns.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Add-Ons</span>
                <span className="font-medium">{state.addOns.map((a) => PRICING.addOns[a].label).join(", ")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">Address</span>
              <span className="font-medium text-right max-w-[200px]">{state.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Date</span>
              <span className="font-medium">{new Date(state.scheduleDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Time Window</span>
              <span className="font-medium">{state.scheduleWindow}</span>
            </div>
            {state.notes && (
              <div className="flex justify-between">
                <span className="text-slate-600">Notes</span>
                <span className="font-medium text-right max-w-[200px]">{state.notes}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              {discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-500">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo ({promoResult?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-brand-600">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <label className="label">Promo Code (Optional)</label>
            {promoResult?.valid ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-800">{promoResult.code} applied</div>
                  <div className="text-xs text-green-700">
                    {promoResult.discountType === "PERCENTAGE"
                      ? `${promoResult.discountValue}% off`
                      : `$${promoResult.discountValue} off`}
                    {" "}— you save ${discountAmount.toFixed(2)}
                  </div>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-xs text-green-700 hover:text-green-900 underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoResult(null); }}
                  placeholder="Enter promo code"
                  className="input flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoInput.trim() || promoLoading}
                  className="btn-secondary px-4 py-2 whitespace-nowrap"
                >
                  {promoLoading ? "Applying..." : "Apply"}
                </button>
              </div>
            )}
            {promoResult && !promoResult.valid && (
              <p className="text-red-600 text-sm mt-1">{promoResult.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Contact Info</h3>
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="input"
              />
              <p className="text-xs text-slate-400 mt-1">We&apos;ll send your booking confirmation here.</p>
            </div>
            <div>
              <label className="label">Phone (Optional)</label>
              <input
                type="tel"
                value={state.phone}
                onChange={(e) => setState((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(555) 000-0000"
                className="input"
              />
              <p className="text-xs text-slate-400 mt-1">For SMS updates on your cleaner&apos;s arrival.</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setState((p) => ({ ...p, step: 2 }))} className="btn-secondary flex-1 py-3">
              Back
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading || !state.email}
              className="btn-primary flex-1 py-3"
            >
              {loading ? "Processing..." : `Pay $${finalPrice.toFixed(2)}`}
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Secure payment powered by Stripe. Your card information is never stored by us.
          </p>
        </div>
      )}
    </div>
  );
}
