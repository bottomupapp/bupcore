import { NextResponse } from "next/server";

// Railway healthcheck (railway.json → /api/health). The app no longer
// owns a database, so liveness is just "the server answers".
export function GET() {
  return NextResponse.json({ ok: true });
}
