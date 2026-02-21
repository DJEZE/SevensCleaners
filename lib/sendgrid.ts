import sgMail from "@sendgrid/mail";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL!,
        name: process.env.SENDGRID_FROM_NAME || "Sevens Cleaners",
      },
      subject,
      html,
      text,
    });
    return true;
  } catch (error) {
    console.error("SendGrid email error:", error);
    return false;
  }
}
