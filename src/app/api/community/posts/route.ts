import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { content } = await req.json();

    const post = await db.communityPost.create({
        data: {
            content,
            authorId: session.user.id
        }
    });

    // Reward for posting
    await db.user.update({ where: { id: session.user.id }, data: { points: { increment: 8 } } });
    await db.rewards.create({ data: { userId: session.user.id, points: 8, reason: "Created Post" } });

    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    // Public feed or protected? Protected usually better for community
    const posts = await db.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { name: true, image: true } },
            _count: { select: { likes: true, comments: true } }
        },
        take: 50
    });
    return NextResponse.json(posts);
}
