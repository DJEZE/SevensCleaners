"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@prisma/client";

interface Props {
  bookingId: string;
  currentStatus: BookingStatus;
  currentAssignment: { id: string; cleanerId: string; cleanerName: string; status: string } | null;
  cleaners: { id: string; name: string; serviceArea: string }[];
}

const STATUSES: BookingStatus[] = ["BOOKED", "ASSIGNED", "IN_ROUTE", "CLEANING", "COMPLETED", "CANCELLED"];

export default function AdminBookingControls({ bookingId, currentStatus, currentAssignment, cleaners }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [selectedCleaner, setSelectedCleaner] = useState(currentAssignment?.cleanerId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function updateStatus() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setMessage("Status updated.");
      router.refresh();
    } catch {
      setMessage("Error updating status.");
    } finally {
      setLoading(false);
    }
  }

  async function assignCleaner() {
    if (!selectedCleaner) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleanerId: selectedCleaner }),
      });
      if (!res.ok) throw new Error("Failed to assign cleaner");
      setMessage("Cleaner assigned.");
      router.refresh();
    } catch {
      setMessage("Error assigning cleaner.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Status override */}
      <div>
        <label className="label">Update Booking Status</label>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)} className="input flex-1">
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
          <button onClick={updateStatus} disabled={loading} className="btn-primary whitespace-nowrap">
            Update Status
          </button>
        </div>
      </div>

      {/* Cleaner assignment */}
      <div>
        <label className="label">
          {currentAssignment ? `Reassign Cleaner (currently: ${currentAssignment.cleanerName})` : "Assign Cleaner"}
        </label>
        <div className="flex gap-2">
          <select value={selectedCleaner} onChange={(e) => setSelectedCleaner(e.target.value)} className="input flex-1">
            <option value="">Select a cleaner...</option>
            {cleaners.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.serviceArea}
              </option>
            ))}
          </select>
          <button onClick={assignCleaner} disabled={loading || !selectedCleaner} className="btn-primary whitespace-nowrap">
            Assign
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">
          {message}
        </div>
      )}
    </div>
  );
}
