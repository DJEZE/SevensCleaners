"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  assignmentId: string;
  bookingId: string;
  status: string;
}

export default function CleanerJobActions({ assignmentId, bookingId, status }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      await fetch(`/api/assignments/${assignmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (status === "PENDING") {
    return (
      <div className="flex gap-2">
        <button onClick={() => updateStatus("ACCEPTED")} disabled={loading} className="btn-primary text-sm flex-1">
          Accept Job
        </button>
        <button onClick={() => updateStatus("DECLINED")} disabled={loading} className="btn-secondary text-sm flex-1">
          Decline
        </button>
      </div>
    );
  }

  if (status === "ACCEPTED") {
    return (
      <button onClick={() => updateStatus("IN_ROUTE")} disabled={loading} className="btn-primary text-sm w-full">
        Mark: In Route
      </button>
    );
  }

  if (status === "IN_ROUTE") {
    return (
      <button onClick={() => updateStatus("STARTED")} disabled={loading} className="btn-primary text-sm w-full">
        Mark: Started Cleaning
      </button>
    );
  }

  if (status === "STARTED") {
    return (
      <button onClick={() => updateStatus("FINISHED")} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full text-sm">
        Mark: Finished
      </button>
    );
  }

  return null;
}
