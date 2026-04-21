import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { transcriptToPrd } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const { workspace, session } = await requireWorkspace();

  const form = await req.formData();
  const file = form.get("audio") as File | null;
  const transcript = (form.get("transcript") as string | null)?.trim() || "";
  const hint = (form.get("hint") as string) || undefined;

  if (!transcript && !file) {
    return NextResponse.json(
      { error: "transcript or audio required" },
      { status: 400 },
    );
  }

  let base64: string | null = null;
  let mimeType: string | null = null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    base64 = buffer.toString("base64");
    mimeType = file.type || "audio/webm";
  }

  const recording = await db.voiceRecording.create({
    data: {
      workspaceId: workspace.id,
      userId: session.user.id,
      mimeType: mimeType ?? undefined,
      audioBase64: base64 ?? undefined,
      transcript: transcript || undefined,
      status: transcript ? "DRAFTING" : "FAILED",
      errorMessage: transcript
        ? null
        : "Tarayıcı transkripti alınamadı. Sayfada konuşma tanıma destekli mi kontrol edin.",
    },
  });

  if (!transcript) {
    return NextResponse.json(recording, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    const updated = await db.voiceRecording.update({
      where: { id: recording.id },
      data: {
        status: "FAILED",
        errorMessage:
          "ANTHROPIC_API_KEY tanımlı değil. .env'ye ekleyip tekrar deneyin.",
      },
    });
    return NextResponse.json(updated, { status: 500 });
  }

  try {
    const { raw, json } = await transcriptToPrd({ transcript, hint });
    const updated = await db.voiceRecording.update({
      where: { id: recording.id },
      data: {
        status: "READY",
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
