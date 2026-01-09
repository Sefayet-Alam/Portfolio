import { NextResponse } from "next/server";
import { seedKbFromPortfolio } from "@/lib/ai/seed";
import { getDb } from "@/lib/db/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // allow seeding in dev; require token only in production
    const token = process.env.ADMIN_TOKEN;
    const got = req.headers.get("x-admin-token") || "";

    if (process.env.NODE_ENV === "production" && token && got !== token) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const db = await getDb();
    const before = await db.collection("kb_chunks").countDocuments();

    const result = await seedKbFromPortfolio();

    const after = await db.collection("kb_chunks").countDocuments();

    return NextResponse.json({
      ok: true,
      db: db.databaseName,
      before,
      after,
      ...result,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
