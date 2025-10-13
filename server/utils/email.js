import nodemailer from "nodemailer";

const buildTransportConfig = () => {
  if (process.env.SMTP_URL) {
    return process.env.SMTP_URL;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured");
  }

  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };
};

const transporter = nodemailer.createTransport(buildTransportConfig());

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    throw new Error("Email recipient is required");
  }

  const mail = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: text || html?.replace(/<[^>]+>/g, ""),
    html,
  };

  await transporter.sendMail(mail);
};
