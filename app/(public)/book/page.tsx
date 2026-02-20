import { Suspense } from "react";
import BookingForm from "@/components/booking/BookingForm";

export default function BookPage() {
  return (
    <div className="py-12 px-4 bg-slate-50 flex-1">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book a Cleaning</h1>
        <p className="text-slate-500 mb-8">Takes less than 2 minutes. Pay securely online.</p>
        <Suspense fallback={<div>Loading...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
