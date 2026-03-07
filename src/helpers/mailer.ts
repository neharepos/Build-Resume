import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: any) => {
  try {
    // create hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await db
        .update(users)
        .set({
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        })
        .where(eq(users.id, userId));
    } else if (emailType === "RESET") {
      await db
        .update(users)
        .set({
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(
            Date.now() + 3600000
          ),
        })
        .where(eq(users.id, userId));
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "no-reply@resumeapp.com",
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

        <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY"
          ? "verifyemail"
          : "resetpassword"
      }?token=${hashedToken}">
        Click Here
        </a>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};