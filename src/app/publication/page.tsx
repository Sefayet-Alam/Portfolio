import portfolio from "@/content/portfolio.seed.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Publications } from "@/components/sections/Publications";

export default function PublicationsPage() {
  return (
    <main className="min-h-screen">
      <Header resumeHref={portfolio.profile.links.resume} />

      <div className="mx-auto max-w-5xl px-4">
        <Publications publications={portfolio.highlights.publications} />
      </div>

      <Footer
        email={portfolio.profile.email}
        phone={portfolio.profile.phone}
        github={portfolio.profile.links.github}
        linkedin={portfolio.profile.links.linkedin}
        codeforces={portfolio.profile.links.codeforces}
      />
    </main>
  );
}
