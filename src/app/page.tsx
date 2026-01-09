import portfolio from "@/content/portfolio.seed.json";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { IntroLoader } from "@/components/ui/IntroLoader";

import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Certifications } from "@/components/sections/Certifications";
import { Achievements } from "@/components/sections/Achievements";

export default function HomePage() {
  const certs = (portfolio as any).certifications ?? [];

  return (
    <main id="top" className="min-h-screen">
      <IntroLoader />

      <Header resumeHref={portfolio.profile.links.resume} />

      <div className="mx-auto max-w-5xl px-4">
        <Hero profile={portfolio.profile} />
        <Experience experience={portfolio.experience} />
        <Skills skills={portfolio.skills} />
        <Projects projects={portfolio.projects} />

        {/* ✅ Certificates before highlights */}
        <Certifications certifications={certs} />

        <Achievements highlights={portfolio.highlights} />
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
