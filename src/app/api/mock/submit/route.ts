import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { testId, userAnswers, timeTaken } = await req.json(); // userAnswers: { [questionIndex]: selectedOptionIndex }

    const test = await db.mockTest.findUnique({ where: { id: testId } });
    if (!test) return new NextResponse("Test not found", { status: 404 });

    const questions = test.questionsJson as any[];
    let score = 0;
    let wrong = 0;

    questions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            score++;
        } else {
            wrong++;
        }
    });

    await db.mockResult.create({
        data: {
            userId: session.user.id,
            score,
            totalQuestions: questions.length,
            wrongAnswers: wrong,
            timeTaken
        }
    });

    // Reward
    const rewardPoints = 25;
    await db.user.update({
        where: { id: session.user.id },
        data: { points: { increment: rewardPoints } }
    });

    await db.rewards.create({
        data: {
            userId: session.user.id,
            points: rewardPoints,
            reason: "Mock Test Complete"
        }
    });

    return NextResponse.json({ score, total: questions.length, wrong });

  } catch (error) {
    console.error("Submit Error:", error);
    return new NextResponse("Internal Submit Error", { status: 500 });
  }
}
