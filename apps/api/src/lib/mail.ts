import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
) => {
  try {
    console.log("Sending email...");

    const info = await transporter.sendMail({
      from: env.SMTP_EMAIL,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
    console.log(info);
  } catch (error) {
    console.error("SMTP Error:", error);
    throw error;
  }
};