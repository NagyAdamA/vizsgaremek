const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail esetén alkalmazásjelszó kell
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email elküldve:", to);
  } catch (error) {
    console.error("Email küldési hiba:", error);
    throw error;
  }
};