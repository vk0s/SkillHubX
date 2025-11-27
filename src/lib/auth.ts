import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getSelf() {
  const { userId } = auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
     const clerkUser = await currentUser();
     if (!clerkUser) return null;

     // Atomically create user
     try {
         const newUser = await db.user.create({
             data: {
                 clerkId: userId,
                 email: clerkUser.emailAddresses[0].emailAddress,
                 role: "USER"
             }
         });
         return newUser;
     } catch (e) {
         // Handle race condition if user created in parallel
         return await db.user.findUnique({ where: { clerkId: userId } });
     }
  }

  return user;
}

export async function isAdmin() {
    const user = await getSelf();
    if (!user) return false;
    return user.role === "ADMIN" || user.role === "SUPERADMIN";
}

export async function isSuperAdmin() {
    const user = await getSelf();
    if (!user) return false;
    return user.role === "SUPERADMIN";
}
