"use client";

import { useState, useEffect } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/cleaners/me").then((r) => r.json()).then((data) => {
      const avail: Record<string, boolean> = {};
      if (Array.isArray(data.availability)) {
        data.availability.forEach((d: string) => { avail[d] = true; });
      }
      setAvailability(avail);
    });
  }, []);

  async function save() {
    setLoading(true);
    const days = Object.entries(availability).filter(([, v]) => v).map(([k]) => k);
    await fetch("/api/cleaners/availability", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability: days }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">My Availability</h1>
      <p className="text-slate-500 mb-6">Select the days you are available to take jobs.</p>

      <div className="card p-6 space-y-3 mb-6">
        {DAYS.map((day) => (
          <label key={day} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!availability[day]}
              onChange={(e) => setAvailability((p) => ({ ...p, [day]: e.target.checked }))}
              className="w-5 h-5 text-brand-600 rounded"
            />
            <span className="font-medium text-slate-900">{day}</span>
          </label>
        ))}
      </div>

      <button onClick={save} disabled={loading} className="btn-primary py-3 px-8">
        {loading ? "Saving..." : saved ? "Saved!" : "Save Availability"}
      </button>
    </div>
  );
}
