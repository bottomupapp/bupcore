import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { voiceToPrd } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();

  const form = await req.formData();
  const file = form.get("audio") as File | null;
  const hint = (form.get("hint") as string) || undefined;

  if (!file) {
    return NextResponse.json({ error: "audio required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mimeType = file.type || "audio/webm";

  const recording = await db.voiceRecording.create({
    data: {
      workspaceId: workspace.id,
      userId: session.user.id,
      mimeType,
      audioBase64: base64,
      status: "DRAFTING",
    },
  });

  if (!process.env.ANTHROPIC_API_KEY) {
    await db.voiceRecording.update({
      where: { id: recording.id },
      data: {
        status: "FAILED",
        errorMessage:
          "ANTHROPIC_API_KEY tanımlı değil. .env'ye ekleyip tekrar deneyin.",
      },
    });
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY missing" },
      { status: 500 },
    );
  }

  try {
    const { raw, json } = await voiceToPrd({
      audioBase64: base64,
      mimeType,
      hint,
    });
    const updated = await db.voiceRecording.update({
      where: { id: recording.id },
      data: {
        status: "READY",
        transcript: raw.slice(0, 10_000),
        prdDraft: json ?? { raw },
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    const updated = await db.voiceRecording.update({
      where: { id: recording.id },
      data: {
        status: "FAILED",
        errorMessage: String(e?.message ?? e),
      },
    });
    return NextResponse.json(updated, { status: 500 });
  }
}

export async function GET() {
  const { workspace } = await requireWorkspace();
  const list = await db.voiceRecording.findMany({
    where: { workspaceId: workspace.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      mimeType: true,
      durationSec: true,
      transcript: true,
      prdDraft: true,
      errorMessage: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(list);
}
