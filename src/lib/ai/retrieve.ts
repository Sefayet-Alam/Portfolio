import { getCollections } from "@/lib/db/collections";

export async function retrieveKb(query: string, limit = 6) {
  const { kb } = await getCollections();

  // Mongo text search (free + simple)
  const docs = await kb
    .find(
      { $text: { $search: query } },
      {
        projection: {
          _id: 0,
          key: 1,
          title: 1,
          text: 1,
          tags: 1,
          score: { $meta: "textScore" },
        } as any,
      }
    )
    .sort({ score: { $meta: "textScore" } } as any)
    .limit(limit)
    .toArray();

  return docs.map((d) => ({ title: d.title, text: d.text }));
}
