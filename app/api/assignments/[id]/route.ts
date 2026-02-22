import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdate } from "@/lib/notifications";
import { AssignmentStatus, BookingStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

// Map assignment status to booking status
const STATUS_MAP: Partial<Record<AssignmentStatus, BookingStatus>> = {
  IN_ROUTE: "IN_ROUTE",
  STARTED: "CLEANING",
  FINISHED: "COMPLETED",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const cleanerId = cookieStore.get("cleaner-id")?.value;
    const adminSession = cookieStore.get("admin-session")?.value;
    const isAdmin = adminSession === (process.env.ADMIN_PASSWORD ?? "admin");

    if (!cleanerId && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { booking: { include: { customer: { include: { user: true } } } } },
    });

    if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only the assigned cleaner or admin can update
    if (!isAdmin && assignment.cleanerId !== cleanerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json() as { status: AssignmentStatus };

    const updated = await prisma.assignment.update({
      where: { id: params.id },
      data: { status },
    });

    // Mirror status onto booking
    const bookingStatus = STATUS_MAP[status];
    if (bookingStatus) {
      await prisma.booking.update({
        where: { id: assignment.bookingId },
        data: { status: bookingStatus },
      });

      // Notify customer — support both linked accounts and guest bookings
      const booking = assignment.booking;
      const customerPhone = booking.customer?.phone ?? booking.guestPhone ?? undefined;
      const customerEmail = booking.customer?.user.email ?? booking.guestEmail ?? undefined;
      await sendStatusUpdate(booking, bookingStatus, customerPhone, customerEmail);
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
