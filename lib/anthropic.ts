import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL =
  process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";

/**
 * Ses + talimat → yapısal PRD taslağı
 * audioBase64: ham base64 (data: öneki OLMADAN)
 */
/**
 * Metin transkript + opsiyonel bağlamdan yapısal PRD taslağı üretir.
 * Anthropic Messages API audio girdisi desteklemez; transkripsiyon
 * tarayıcıda (Web Speech API) yapılır ve buraya metin gelir.
 */
export async function transcriptToPrd({
  transcript,
  hint,
}: {
  transcript: string;
  hint?: string;
}) {
  const systemPrompt = `Sen deneyimli bir ürün yöneticisisin. Sana verilen transkripte dayanarak aşağıdaki alanları içeren bir ürün gereksinim belgesi (PRD) üret. JSON ile yanıt ver.

Alanlar:
- title (string)
- subtitle (string, max 140 karakter)
- problem (markdown)
- goals (string dizisi, maddeler halinde)
- nonGoals (string dizisi)
- users (string dizisi, hedef kitle)
- userStories (dizi; her biri {role, want, benefit})
- requirements (dizi; her biri {title, detail, priority: "LOW"|"MEDIUM"|"HIGH"|"URGENT"})
- epics (dizi; her biri {title, summary, tasks: string[]})
- risks (string dizisi)
- successMetrics (string dizisi)

Dili transkriptin dilinde tut. Kısa, net, aksiyonlu yaz.`;

  const userText = [
    hint ? `Ek bağlam: ${hint}` : null,
    `Transkript:\n${transcript}`,
    "Yanıtı sadece geçerli JSON olarak ver. Başka açıklama ekleme.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: [{ type: "text", text: userText }] }],
  });

  const textBlock = response.content.find((c) => c.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "";
  const json = extractJson(raw);
  return { raw, json };
}

export async function voiceToPrd({
  audioBase64,
  mimeType,
  hint,
}: {
  audioBase64: string;
  mimeType: string;
  hint?: string;
}) {
  const systemPrompt = `Sen deneyimli bir ürün yöneticisisin. Kullanıcının sesli anlatımını dinle ve aşağıdaki alanları içeren bir ürün gereksinim belgesi (PRD) üret. JSON ile yanıt ver.

Alanlar:
- title (string)
- subtitle (string, max 140 karakter)
- problem (markdown)
- goals (string dizisi, maddeler halinde)
- nonGoals (string dizisi)
- users (string dizisi, hedef kitle)
- userStories (dizi; her biri {role, want, benefit})
- requirements (dizi; her biri {title, detail, priority: "LOW"|"MEDIUM"|"HIGH"|"URGENT"})
- epics (dizi; her biri {title, summary, tasks: string[]})
- risks (string dizisi)
- successMetrics (string dizisi)

Dili kullanıcının ses dilinde tut. Kısa, net, aksiyonlu yaz.`;

  const userText = hint
    ? `Ek bağlam: ${hint}\n\nLütfen ses kaydına dayanarak PRD üret.`
    : "Lütfen ses kaydına dayanarak PRD üret.";

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: mimeType,
              data: audioBase64,
            },
          } as any,
          { type: "text", text: userText },
          {
            type: "text",
            text: "Yanıtı sadece geçerli JSON olarak ver. Başka açıklama ekleme.",
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((c) => c.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "";
  const json = extractJson(raw);
  return { raw, json };
}

export async function transcribeOnly({
  audioBase64,
  mimeType,
}: {
  audioBase64: string;
  mimeType: string;
}) {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system:
      "Sen profesyonel bir transkripsiyon aracısın. Sadece sesteki konuşmayı bire bir metne dök. Noktalama ve paragrafları düzelt. Başka yorum ekleme.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: mimeType,
              data: audioBase64,
            },
          } as any,
          { type: "text", text: "Transkript ver." },
        ],
      },
    ],
  });
  const textBlock = response.content.find((c) => c.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}

function extractJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/\{[\s\S]*\}$/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }
  const fence = text.match(/```json\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {}
  }
  return null;
}
