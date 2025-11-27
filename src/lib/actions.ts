'use server'

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateContentFromText, QUIZ_PROMPT_TEMPLATE } from "@/lib/ai";

// Sync User
export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const existingUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!existingUser) {
    return await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        role: "USER",
      },
    });
  }
  return existingUser;
}

// Upload Content
export async function uploadContent(formData: FormData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as "VIDEO" | "PDF";
  const price = Number(formData.get("price"));

  // Mock file upload - in production use S3/Uploadthing
  // We'll simulate a URL based on type
  const mockUrl = type === "VIDEO"
    ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    : "https://pdfobject.com/pdf/sample.pdf";

  const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser) throw new Error("User not found");

  await db.content.create({
    data: {
      title,
      description,
      type,
      price,
      url: mockUrl,
      uploaderId: dbUser.id,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/upload");
}

// Admin Actions
export async function updateContentStatus(contentId: string, status: "APPROVED" | "REJECTED") {
    // Check admin
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== "ADMIN" && dbUser.role !== "SUPERADMIN")) throw new Error("Forbidden");

    await db.content.update({
        where: { id: contentId },
        data: { status }
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
}

// AI Actions
export async function generateStudyMaterial(topic: string) {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    const dbUser = await db.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) throw new Error("User not found");

    const prompt = QUIZ_PROMPT_TEMPLATE + topic;
    const aiResponseText = await generateContentFromText(prompt);

    // Clean JSON markdown
    const cleanedText = aiResponseText.replace(/```json/g, "").replace(/```/g, "");
    const aiData = JSON.parse(cleanedText);

    await db.quiz.create({
        data: {
            ownerId: dbUser.id,
            inputType: "TEXT",
            generatedQuestions: aiData.quiz,
            generatedSummary: aiData.summary
        }
    });

    return aiData;
}

// Reward System
export async function rewardForWatch(contentId: string) {
    const { userId } = auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return { success: false, message: "User not found" };

    const REWARD_AMOUNT = 10;
    const message = `Watched content ${contentId}`;

    // Check existing transaction for this content
    const existing = await db.transaction.findFirst({
        where: {
            userId: user.id,
            type: "EARN",
            message: message
        }
    });

    if (existing) return { success: false, message: "Already rewarded" };

    await db.$transaction([
        db.user.update({
            where: { id: user.id },
            data: { walletBalance: { increment: REWARD_AMOUNT } }
        }),
        db.transaction.create({
            data: {
                userId: user.id,
                amount: REWARD_AMOUNT,
                type: "EARN",
                message: message
            }
        })
    ]);

    revalidatePath("/dashboard");
    return { success: true, message: "Coins earned!" };
}

// Super Admin Actions
export async function promoteToAdmin(targetId: string) {
    const { userId } = auth();
    if (!userId) return;
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (user?.role !== "SUPERADMIN") throw new Error("Unauthorized");

    await db.user.update({
        where: { id: targetId },
        data: { role: "ADMIN" }
    });
    revalidatePath("/super-admin");
}

export async function demoteToUser(targetId: string) {
    const { userId } = auth();
    if (!userId) return;
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (user?.role !== "SUPERADMIN") throw new Error("Unauthorized");

    await db.user.update({
        where: { id: targetId },
        data: { role: "USER" }
    });
    revalidatePath("/super-admin");
}
