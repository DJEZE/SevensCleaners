import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Sevens Cleaners <no-reply@sevenscleaners.com>",
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("Resend email error:", error);
    return false;
  }
}
