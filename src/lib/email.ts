"use server";

type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  // In a production environment, you would use a real email service like SendGrid, Mailgun, etc.
  // For now, we'll just log the email to the console
  console.log(`
    Email sent:
    To: ${to}
    Subject: ${subject}
    Text: ${text}
    HTML: ${html || "No HTML version"}
  `);

  // For development, return success
  return { success: true };
}
