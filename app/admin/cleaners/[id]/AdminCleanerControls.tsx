"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  cleanerId: string;
  approved: boolean;
  active: boolean;
}

export default function AdminCleanerControls({ cleanerId, approved, active }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function update(data: { approved?: boolean; active?: boolean }) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/cleaners/${cleanerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setMessage("Updated successfully.");
      router.refresh();
    } catch {
      setMessage("Error updating cleaner.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {!approved ? (
        <button onClick={() => update({ approved: true })} disabled={loading} className="btn-primary">
          Approve Cleaner
        </button>
      ) : (
        <button onClick={() => update({ approved: false })} disabled={loading} className="btn-secondary text-yellow-700 border-yellow-300">
          Revoke Approval
        </button>
      )}
      {active ? (
        <button onClick={() => update({ active: false })} disabled={loading} className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 px-4 rounded-lg border border-red-200 transition-colors">
          Deactivate
        </button>
      ) : (
        <button onClick={() => update({ active: true })} disabled={loading} className="btn-primary">
          Reactivate
        </button>
      )}
      {message && <span className="text-sm text-green-700 self-center">{message}</span>}
    </div>
  );
}
