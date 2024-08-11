import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Set up email transporter with your email and password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to create the reset password email content
export const generateResetPasswordEmail = (name, resetLink) => {
  return `
    <h1>Dear ${name},</h1>
    <p>You have forgotten your password. No problem! Create a new password here:</p>
    <a href="${resetLink}">Create New Password</a>
    <p>Can't open the link?</p>
    <p>Copy and paste the following link into your browser's address bar:</p>
    <p>${resetLink}</p>
    <p>Didn't request a new password?</p>
    <p>No worries. Your password hasn't been changed. If you're concerned, please contact our customer service.</p>
    <p>Did we inform you well with this email?</p>
    <p>👍 👎</p>
  `;
};
