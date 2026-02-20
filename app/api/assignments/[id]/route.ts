import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdate } from "@/lib/notifications";
import { AssignmentStatus, BookingStatus } from "@prisma/client";

// Map assignment status to booking status
const STATUS_MAP: Partial<Record<AssignmentStatus, BookingStatus>> = {
  IN_ROUTE: "IN_ROUTE",
  STARTED: "CLEANING",
  FINISHED: "COMPLETED",
};

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { cleanerProfile: true },
    });
    if (!user?.cleanerProfile) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const assignment = await prisma.assignment.findUnique({
      where: { id: params.id },
      include: { booking: { include: { customer: { include: { user: true } } } } },
    });

    if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only the assigned cleaner (or admin) can update
    if (assignment.cleanerId !== user.cleanerProfile.id && user.role !== "ADMIN") {
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

      // Notify customer
      await sendStatusUpdate(
        assignment.booking,
        bookingStatus,
        assignment.booking.customer.phone ?? undefined,
        assignment.booking.customer.user.email
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
