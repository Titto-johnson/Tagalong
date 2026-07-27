import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";

export async function DELETE() {
  const user = await requireUser();
  await prisma.profile.updateMany({ where: { userId: user.id }, data: { accountDeletedAt: new Date() } });
  await prisma.user.update({ where: { id: user.id }, data: { name: "Deleted account", email: `deleted-${user.id}@example.invalid`, image: null, passwordHash: null } });
  return NextResponse.json({ ok: true });
}
