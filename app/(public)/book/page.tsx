import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";

export default async function BookPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/book");
  }

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
