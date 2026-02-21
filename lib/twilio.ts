import twilio from "twilio";

export async function sendSMS(to: string, body: string): Promise<boolean> {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return true;
  } catch (error) {
    console.error("Twilio SMS error:", error);
    return false;
  }
}
