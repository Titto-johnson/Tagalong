import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { activitySchema } from "@/lib/security";
import { milesBetween } from "@/lib/distance";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const distance = Number(url.searchParams.get("distance") ?? 25);
  const category = url.searchParams.get("category") ?? undefined;
  const user = await requireUser();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ activities: [] });
  const where = category
    ? { status: "PUBLISHED" as const, visibility: "PUBLIC" as const, category: category as "ENTERTAINMENT_ERRANDS" | "HELP_VOLUNTEER" | "ADVENTURE" }
    : { status: "PUBLISHED" as const, visibility: "PUBLIC" as const };
  const activities = await prisma.activity.findMany({
    where,
    include: { host: { include: { profile: true } }, participants: true },
    orderBy: { startsAt: "asc" },
    take: 50
  }) as Array<Record<string, unknown> & { latitude: number; longitude: number }>;
  const nearby = activities
    .map((activity) => ({ ...activity, distance: milesBetween(profile, activity) }))
    .filter((activity) => activity.distance <= distance);
  return NextResponse.json({ activities: nearby });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = activitySchema.parse(await request.json());
    const activity = await prisma.activity.create({ data: { ...data, hostId: user.id } });
    return NextResponse.json({ activity }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Activity could not be created." }, { status: 400 });
  }
}
