import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { action } = await req.json();
    let points = 0;
    let reason = "";

    switch(action) {
        case "daily_login": points = 5; reason = "Daily Login"; break;
        case "post": points = 8; reason = "Community Post"; break;
        default: return new NextResponse("Invalid action", { status: 400 });
    }

    // Check if daily login already awarded today logic could go here
    // For simplicity, just add.

    await db.user.update({
        where: { id: session.user.id },
        data: { points: { increment: points } }
    });

    await db.rewards.create({
        data: {
            userId: session.user.id,
            points,
            reason
        }
    });

    return NextResponse.json({ success: true, pointsAdded: points });

  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
