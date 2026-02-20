import { clsx } from "clsx";

const statusConfig: Record<string, { label: string; classes: string }> = {
  BOOKED:     { label: "Booked",     classes: "bg-blue-100 text-blue-700" },
  ASSIGNED:   { label: "Assigned",   classes: "bg-purple-100 text-purple-700" },
  IN_ROUTE:   { label: "In Route",   classes: "bg-yellow-100 text-yellow-700" },
  CLEANING:   { label: "Cleaning",   classes: "bg-orange-100 text-orange-700" },
  COMPLETED:  { label: "Completed",  classes: "bg-green-100 text-green-700" },
  CANCELLED:  { label: "Cancelled",  classes: "bg-red-100 text-red-700" },
  PENDING:    { label: "Pending",    classes: "bg-slate-100 text-slate-600" },
  ACCEPTED:   { label: "Accepted",   classes: "bg-green-100 text-green-700" },
  DECLINED:   { label: "Declined",   classes: "bg-red-100 text-red-700" },
  FINISHED:   { label: "Finished",   classes: "bg-green-100 text-green-700" },
  STARTED:    { label: "Started",    classes: "bg-orange-100 text-orange-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, classes: "bg-slate-100 text-slate-600" };
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", config.classes)}>
      {config.label}
    </span>
  );
}
