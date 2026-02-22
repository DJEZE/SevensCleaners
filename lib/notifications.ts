import { sendSMS } from "./twilio";
import { sendEmail } from "./sendgrid";
import { prisma } from "./prisma";

export async function sendBookingConfirmation(booking: {
  id: string;
  address: string;
  scheduleDate: Date;
  scheduleWindow: string;
  price: number;
  serviceType: string;
  addOns: unknown;
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const dateStr = new Date(booking.scheduleDate).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const smsBody = `Sevens Cleaners: Booking confirmed! Date: ${dateStr} (${booking.scheduleWindow}). Address: ${booking.address}. Total: $${booking.price}. Booking ID: ${booking.id.slice(0,8).toUpperCase()}`;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sevenscleaners.com";

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <div style="text-align:center;margin-bottom:24px">
        <img src="${siteUrl}/logo.png" alt="Sevens Cleaners" style="height:60px;width:auto" />
      </div>
      <h2 style="margin:0 0 8px">Booking Confirmed!</h2>
      <p>Hi ${booking.customerName || "there"},</p>
      <p>Your cleaning is scheduled. Here are your details:</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">Booking ID</td><td style="padding:8px">${booking.id.slice(0,8).toUpperCase()}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Date</td><td style="padding:8px">${dateStr}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Time Window</td><td style="padding:8px">${booking.scheduleWindow}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Address</td><td style="padding:8px">${booking.address}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Total Paid</td><td style="padding:8px">$${booking.price}</td></tr>
      </table>
      <p>We'll notify you when a cleaner is assigned. Thank you for choosing Sevens Cleaners!</p>
    </div>
  `;

  // SMS
  if (booking.customerPhone) {
    const smsSent = await sendSMS(booking.customerPhone, smsBody);
    await prisma.messageLog.create({
      data: {
        bookingId: booking.id,
        type: "SMS",
        recipient: booking.customerPhone,
        body: smsBody,
        status: smsSent ? "sent" : "failed",
      },
    });
  }

  // Email
  if (booking.customerEmail) {
    const emailResult = await sendEmail(
      booking.customerEmail,
      "Booking Confirmed - Sevens Cleaners",
      emailHtml,
      smsBody
    );
    await prisma.messageLog.create({
      data: {
        bookingId: booking.id,
        type: "EMAIL",
        recipient: booking.customerEmail,
        body: emailHtml,
        status: emailResult.success ? "sent" : "failed",
        externalId: emailResult.emailId,
      },
    });
  }
}

export async function sendStatusUpdate(
  booking: { id: string; address: string; scheduleDate: Date },
  status: string,
  customerPhone?: string,
  customerEmail?: string
) {
  const statusMessages: Record<string, string> = {
    ASSIGNED:  "Great news! A cleaner has been assigned to your booking.",
    IN_ROUTE:  "Your cleaner is on the way!",
    CLEANING:  "Your cleaning has started.",
    COMPLETED: "Your cleaning is complete. Thank you for choosing Sevens Cleaners!",
  };

  const msg = statusMessages[status];
  if (!msg) return;

  const body = `Sevens Cleaners: ${msg} Booking ID: ${booking.id.slice(0,8).toUpperCase()}`;

  if (customerPhone) {
    const sent = await sendSMS(customerPhone, body);
    await prisma.messageLog.create({
      data: { bookingId: booking.id, type: "SMS", recipient: customerPhone, body, status: sent ? "sent" : "failed" },
    });
  }

  if (customerEmail) {
    const emailResult = await sendEmail(customerEmail, `Booking Update: ${status}`, `<p>${body}</p>`, body);
    await prisma.messageLog.create({
      data: { bookingId: booking.id, type: "EMAIL", recipient: customerEmail, body, status: emailResult.success ? "sent" : "failed", externalId: emailResult.emailId },
    });
  }
}
