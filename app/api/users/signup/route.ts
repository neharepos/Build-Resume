import { db } from "@/src/db/index"
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest} from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/src/helpers/mailer";



export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;

        console.log(reqBody);

        //check if useralready exists

        const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

        //hash password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);      

        const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();

       const savedUser = newUser[0];

         console.log(savedUser);


         // send verification email

         await sendEmail({email, emailType: "VERIFY",
            userId: savedUser.id
         })

         return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser,
         })

         
    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status: 500})
    }
}
