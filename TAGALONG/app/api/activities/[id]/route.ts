import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { activityBaseSchema } from "@/lib/security";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity || activity.hostId !== user.id) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    const data = activityBaseSchema.partial().parse(await request.json());
    return NextResponse.json({ activity: await prisma.activity.update({ where: { id }, data }) });
  } catch {
    return NextResponse.json({ error: "Activity could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity || activity.hostId !== user.id) return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  return NextResponse.json({ activity: await prisma.activity.update({ where: { id }, data: { status: "CANCELLED" } }) });
}
