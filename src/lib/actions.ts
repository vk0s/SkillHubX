'use server'

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { revalidatePath } from "next/cache";

// --- User Actions ---

export async function syncUser() {
  const { userId, sessionClaims } = auth();
  if (!userId) return null;

  // Ideally this happens via webhook, but for simplicity we'll check/create on demand or specific actions
  // Here we just return the user from our DB
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { adminProfile: true, superAdminProfile: true }
  });

  if (!user) {
      // Create user if not exists (fallback if webhook fails or simplistic setup)
      // We need email from sessionClaims if available, or fetch from clerk client
      // For this step, let's assume user is created or we handle it here
      // But accessing email from `auth()` directly isn't possible, we need `currentUser()`
      // We will skip creation here to avoid making this function too heavy,
      // but in a real app we'd use `currentUser()` to get email.
      return null;
  }

  return user;
}

export async function getUserBalance() {
    const { userId } = auth();
    if (!userId) return 0;

    const user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { walletBalance: true }
    });

    return user?.walletBalance || 0;
}

// --- Content Actions ---

export async function uploadContent(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "VIDEO" | "PDF";
  const price = parseInt(formData.get("price") as string);
  const file = formData.get("file") as File; // In real app, upload to storage (S3/Uploadthing) and get URL

  // Mock URL since we don't have real storage
  const url = `https://mockstorage.com/${file.name}`;

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found in DB");

  await db.content.create({
    data: {
      title,
      description,
      type,
      url, // Store the mock URL
      price,
      uploaderId: user.id,
      status: "PENDING"
    }
  });

  revalidatePath("/upload");
}

export async function getPendingContent() {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    // Check if admin
    const user = await db.user.findUnique({
        where: { clerkId: userId },
        include: { adminProfile: true }
    });

    if (!user?.adminProfile && user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
        throw new Error("Forbidden");
    }

    return await db.content.findMany({
        where: { status: "PENDING" },
        include: { uploader: true }
    });
}

export async function approveContent(contentId: string) {
     // Check admin permissions...
     await db.content.update({
         where: { id: contentId },
         data: { status: "APPROVED" }
     });
     revalidatePath("/admin");
}

export async function rejectContent(contentId: string) {
     // Check admin permissions...
     await db.content.update({
         where: { id: contentId },
         data: { status: "REJECTED" }
     });
     revalidatePath("/admin");
}

// --- Transaction Actions ---

export async function rewardUser(amount: number, message: string) {
    const { userId } = auth();
    if (!userId) return;

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return;

    await db.$transaction([
        db.user.update({
            where: { id: user.id },
            data: { walletBalance: { increment: amount } }
        }),
        db.transaction.create({
            data: {
                userId: user.id,
                amount,
                type: "EARN",
                message
            }
        })
    ]);
}
