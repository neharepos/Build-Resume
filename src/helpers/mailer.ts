import nodemailer from "nodemailer";


import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";


import crypto from "crypto";

type EmailParams = {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: number;
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: EmailParams) => {
  try {

    console.log("HOST:", process.env.MAILTRAP_HOST);
    console.log("PORT:", process.env.MAILTRAP_PORT);
    console.log("USER:", process.env.MAILTRAP_USER);
    console.log("PASS:", process.env.MAILTRAP_PASS);

    // create a secure, URL-safe hexadecimal token
    const hashedToken = crypto.randomBytes(32).toString('hex');

    if (emailType === "VERIFY") {
      await db
        .update(users)
        .set({
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 86400000),
        })
        .where(eq(users.id, userId));
    } else if (emailType === "RESET") {
      await db
        .update(users)
        .set({
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(
            Date.now() + 86400000
          ),
        })
        .where(eq(users.id, userId));
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

     const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

    const mailOptions = {
      from: "nehakeshri@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",

      html: `
        <p>
        Click the link below to ${
          emailType === "VERIFY"
            ? "verify your email"
            : "reset your password"
        }
        </p>

        <a href="${link}">
        Click Here
        </a>
         <p>If the link doesn't work copy this:</p>
        <p>${link}</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    console.error("Email sending error:", error);
    throw new Error(error.message);
  }
};