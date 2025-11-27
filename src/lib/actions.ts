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
