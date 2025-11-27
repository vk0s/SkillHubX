import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getSelf() {
  const { userId } = auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
     // Auto-create user if they don't exist in our DB but exist in Clerk
     // This is a simple sync mechanism
     const clerkUser = await currentUser();
     if (!clerkUser) return null;

     const newUser = await db.user.create({
         data: {
             clerkId: userId,
             email: clerkUser.emailAddresses[0].emailAddress,
             role: "USER"
         }
     });
     return newUser;
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
