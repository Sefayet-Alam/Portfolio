import type { Collection } from "mongodb";
import { getDb } from "@/lib/db/mongo";

export type KbChunk = {
  key: string;            // unique id for upsert
  title: string;
  text: string;           // searchable content
  tags?: string[];
  source?: string;        // e.g., "portfolio.seed.json"
  updatedAt: Date;
};

let indexed = false;

export async function getCollections() {
  const db = await getDb();

  const kb = db.collection<KbChunk>("kb_chunks");

  // Create indexes once (safe to call repeatedly, but we guard anyway)
  if (!indexed) {
    await kb.createIndex({ key: 1 }, { unique: true });
    await kb.createIndex({ title: "text", text: "text", tags: "text" });
    indexed = true;
  }

  return { db, kb };
}
