import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Password Reset",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 5 minutes.</p>
      <p>Please do not share this OTP with anyone.</p>
    `,
  });
};