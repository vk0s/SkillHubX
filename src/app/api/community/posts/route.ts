import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { content } = await req.json();

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const post = await db.communityPost.create({
        data: {
            content,
            userId: user.id
        }
    });

    return NextResponse.json(post);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function GET(req: Request) {
    const posts = await db.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { email: true } },
            _count: { select: { likes: true, comments: true } }
        },
        take: 50
    });
    return NextResponse.json(posts);
}
