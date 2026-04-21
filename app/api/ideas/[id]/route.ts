import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { nextKey } from "@/lib/utils";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().optional(),
  body: z.string().nullable().optional(),
  status: z
    .enum(["NEW", "REVIEWING", "ACCEPTED", "REJECTED", "PROMOTED"])
    .optional(),
  votes: z.number().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = patchSchema.parse(await req.json());
  const card = await db.ideationCard.update({
    where: { id },
    data,
  });
  return NextResponse.json(card);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await db.ideationCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
