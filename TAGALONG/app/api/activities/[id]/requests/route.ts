import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { rateLimit, sanitizeText } from "@/lib/security";

const requestSchema = z.object({ introduction: z.string().max(600).optional().transform((value) => value ? sanitizeText(value) : value) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    rateLimit(`request:${user.id}`, 8, 60_000);
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity || activity.hostId === user.id) return NextResponse.json({ error: "Request not allowed." }, { status: 400 });
    const data = requestSchema.parse(await request.json());
    const activityRequest = await prisma.activityRequest.create({ data: { activityId: id, requesterId: user.id, introduction: data.introduction } });
    await prisma.notification.create({ data: { userId: activity.hostId, title: "New join request", body: "Someone requested to join your activity." } });
    return NextResponse.json({ request: activityRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Join request could not be sent." }, { status: 400 });
  }
}
