import { db } from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 },
      );
    }

    const user = existingUser[0];

    if (!user.isVerified) {
    return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
    );
}

    // compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict", // Prevents CSRF attacks
      path: "/", // Cookie available for the whole site
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
