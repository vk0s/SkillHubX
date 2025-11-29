import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { action } = await req.json();
    let points = 0;
    let reason = "";

    switch(action) {
        case "daily_login": points = 5; reason = "Daily Login"; break;
        default: return new NextResponse("Invalid action", { status: 400 });
    }

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    await db.user.update({
        where: { id: user.id },
        data: { walletBalance: { increment: points } }
    });

    await db.rewardTransaction.create({
        data: {
            userId: user.id,
            amount: points,
            reason,
            type: "EARN"
        }
    });

    return NextResponse.json({ success: true, pointsAdded: points });

  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
