import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 25,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (data) => {
  await transporter.sendMail(data, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return false;
    } else {
      console.log("Email sent: ", info.response);
      return true;
    }
  });
};
export { sendEmail };
