import portfolio from "@/content/portfolio.seed.json";
import { getCollections, KbChunk } from "@/lib/db/collections";

function chunk(key: string, title: string, text: string, tags: string[] = []): KbChunk {
  return {
    key,
    title,
    text,
    tags,
    source: "portfolio.seed.json",
    updatedAt: new Date(),
  };
}

export async function seedKbFromPortfolio() {
  const { kb } = await getCollections();

  const p: any = portfolio;

  const chunks: KbChunk[] = [];

  // Profile
  chunks.push(
    chunk(
      "profile",
      "Profile",
      [
        `Name: ${p.profile?.name}`,
        `Title: ${p.profile?.title}`,
        `Tagline: ${p.profile?.tagline}`,
        `Location: ${p.profile?.location}`,
        `Email: ${p.profile?.email}`,
        `Phone: ${p.profile?.phone}`,
        `Links: GitHub ${p.profile?.links?.github} | LinkedIn ${p.profile?.links?.linkedin} | Codeforces ${p.profile?.links?.codeforces}`,
      ].join("\n"),
      ["profile", "contact"]
    )
  );

  // Skills
  const s = p.skills || {};
  chunks.push(
    chunk(
      "skills",
      "Skills",
      [
        `Strengths: ${(s.strengths || []).join(", ")}`,
        `Languages: ${(s.languages || []).join(", ")}`,
        `Frameworks: ${(s.frameworks || []).join(", ")}`,
        `Databases: ${(s.databases || []).join(", ")}`,
        `Tools: ${(s.tools || []).join(", ")}`,
      ].join("\n"),
      ["skills"]
    )
  );

  // Projects
  (p.projects || []).forEach((proj: any, i: number) => {
    chunks.push(
      chunk(
        `project_${i}_${proj.name}`,
        `Project: ${proj.name}`,
        [
          `Stack: ${(proj.stack || []).join(", ")}`,
          `Highlights:`,
          ...(proj.bullets || []).map((b: string) => `- ${b}`),
          proj.repo ? `Repo: ${proj.repo}` : "",
          proj.live ? `Live: ${proj.live}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        ["projects"]
      )
    );
  });

  // Experience (work + studies)
  const exp = p.experience || {};
  (exp.work || []).forEach((e: any, i: number) => {
    chunks.push(
      chunk(
        `work_${i}_${e.title}`,
        `Work: ${e.title} @ ${e.org}`,
        [`Date: ${e.date}`, ...(e.bullets || []).map((b: string) => `- ${b}`)].join("\n"),
        ["experience", "work"]
      )
    );
  });

  (exp.studies || []).forEach((e: any, i: number) => {
    chunks.push(
      chunk(
        `study_${i}_${e.title}`,
        `Study: ${e.title} @ ${e.org}`,
        [`Date: ${e.date}`, ...(e.bullets || []).map((b: string) => `- ${b}`)].join("\n"),
        ["experience", "studies", "education"]
      )
    );
  });

  // Highlights: achievements + publications (timeline style data)
  const hi = p.highlights || {};
  (hi.achievements || []).forEach((a: any, i: number) => {
    chunks.push(
      chunk(
        `achievement_${i}_${a.title}`,
        `Achievement: ${a.title}`,
        [`Org: ${a.org}`, `Date: ${a.date}`, ...(a.bullets || []).map((b: string) => `- ${b}`)].join("\n"),
        ["achievement"]
      )
    );
  });

  (hi.publications || []).forEach((pub: any, i: number) => {
    chunks.push(
      chunk(
        `publication_${i}_${pub.title}`,
        `Publication: ${pub.title}`,
        [`Org: ${pub.org}`, `Date: ${pub.date}`, ...(pub.bullets || []).map((b: string) => `- ${b}`)].join("\n"),
        ["publication"]
      )
    );
  });

  // Upsert all
  let upserted = 0;
  for (const c of chunks) {
    const res = await kb.updateOne(
      { key: c.key },
      { $set: c },
      { upsert: true }
    );
    if (res.upsertedCount) upserted += 1;
  }

  const total = await kb.countDocuments();
  return { upserted, total, chunks: chunks.length };
}
