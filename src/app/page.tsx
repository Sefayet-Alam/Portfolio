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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const certs = (portfolio as any).certifications ?? [];

  return (
    // overflow-x-clip contains the horizontal projects rail without
    // breaking the sticky header — `overflow-x: hidden` would.
    <main id="top" className="min-h-screen overflow-x-clip">
      <IntroLoader />

      <Header resumeHref={portfolio.profile.links.resume} />

      <div className="mx-auto max-w-6xl px-6">
        <Hero profile={portfolio.profile} />
        <Experience experience={portfolio.experience} />
        <Skills skills={portfolio.skills} />
        <Projects projects={portfolio.projects} />
        <Achievements
          highlights={portfolio.highlights}
          scholarUrl={portfolio.profile.links.scholar}
        />
        <Certifications certifications={certs} />
      </div>

      <Footer
        email={portfolio.profile.email}
        phone={portfolio.profile.phone}
        github={portfolio.profile.links.github}
        linkedin={portfolio.profile.links.linkedin}
        codeforces={portfolio.profile.links.codeforces}
        scholar={portfolio.profile.links.scholar}
      />
    </main>
  );
}
