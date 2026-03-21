import "dotenv/config";
import { db } from "./src/db/index";
import { users } from "./src/db/schema";

import { eq } from "drizzle-orm";

async function checkUsers() {
    const token = "ff009f092e94906604c5d355d6f553fb9ffb3960b93e4d97bb18ac5c20b444de";
    const user = await db.select().from(users).where(eq(users.verifyToken, token));
    console.log("User for token:", JSON.stringify(user, null, 2));
    if (user.length > 0) {
        console.log("Current time:", new Date().toISOString());
        console.log("Expiry time:", user[0].verifyTokenExpiry);
        console.log("Is Expired?", new Date() > new Date(user[0].verifyTokenExpiry!));
    }
    process.exit(0);
}

checkUsers().catch(err => {
    console.error(err);
    process.exit(1);
});
