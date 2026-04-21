"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function NewArticleButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function create() {
    const title = prompt("Makale başlığı?");
    if (!title) return;
    setLoading(true);
    const res = await apiFetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const a = await res.json();
      // next/navigation router.push basePath'i otomatik handle eder
      router.push(`/studio/articles/${a.slug}`);
    }
    setLoading(false);
  }

  return (
    <button className="btn-primary" onClick={create} disabled={loading}>
      <Plus className="h-4 w-4" /> Yeni makale
    </button>
  );
}
