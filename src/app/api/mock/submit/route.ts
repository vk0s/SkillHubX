import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { testId, userAnswers } = await req.json();

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const test = await db.mockTest.findUnique({ where: { id: testId } });
    if (!test) return new NextResponse("Test not found", { status: 404 });

    const questions = test.weakAreas as any[];
    let score = 0;

    questions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) score++;
    });

    await db.mockTest.update({
        where: { id: testId },
        data: { score }
    });

    await db.user.update({
        where: { id: user.id },
        data: { walletBalance: { increment: 25 } }
    });

    await db.rewardTransaction.create({
        data: {
            userId: user.id,
            amount: 25,
            reason: "Mock Test Complete",
            type: "EARN"
        }
    });

    return NextResponse.json({ score, total: questions.length });

  } catch (error) {
    console.error("Submit Error:", error);
    return new NextResponse("Internal Submit Error", { status: 500 });
  }
}
