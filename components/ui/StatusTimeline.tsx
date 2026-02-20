import { clsx } from "clsx";

const STEPS = [
  { key: "BOOKED",    label: "Booked" },
  { key: "ASSIGNED",  label: "Assigned" },
  { key: "IN_ROUTE",  label: "In Route" },
  { key: "CLEANING",  label: "Cleaning" },
  { key: "COMPLETED", label: "Completed" },
];

const ORDER = ["BOOKED", "ASSIGNED", "IN_ROUTE", "CLEANING", "COMPLETED"];

export function StatusTimeline({ status }: { status: string }) {
  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  done
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-slate-300 text-slate-400"
                )}
              >
                {done && !current ? "✓" : idx + 1}
              </div>
              <span className={clsx("text-xs mt-1 whitespace-nowrap", done ? "text-brand-600 font-medium" : "text-slate-400")}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={clsx("flex-1 h-0.5 mb-5 mx-1", idx < currentIdx ? "bg-brand-600" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
