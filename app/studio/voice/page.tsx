import { requireWorkspace } from "@/lib/workspace";
import { db } from "@/lib/db";
import VoiceClient from "./voice-client";

export default async function VoicePage() {
  const { workspace } = await requireWorkspace();
  const list = await db.voiceRecording.findMany({
    where: { workspaceId: workspace.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      transcript: true,
      prdDraft: true,
      articleId: true,
      errorMessage: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return <VoiceClient initial={JSON.parse(JSON.stringify(list))} />;
}
