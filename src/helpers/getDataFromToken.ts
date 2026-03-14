import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    // const token = request.cookies.get("token")?.value || "";
    const token = request.cookies.get("token")?.value;

    if (!token) {
      throw new Error("Token not found");
    }

    if (!token) {
      throw new Error("Token missing");
    }

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
