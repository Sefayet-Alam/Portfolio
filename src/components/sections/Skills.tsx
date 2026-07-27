import {
  SiReact,
  SiExpress,
  SiDjango,
  SiFlutter,
  SiMongodb,
  SiFirebase,
  SiMysql,
  SiPostman,
  SiGithub,
  SiJavascript,
  SiPython,
  SiCplusplus,
  SiDart,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { Marquee } from "@/components/motion/Marquee";

type SkillsProps = {
  skills: {
    strengths: string[];
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
};

// Keyed to exact label strings in portfolio.seed.json — do not rename.
const iconMap: Record<string, React.ReactNode> = {
  // Languages
  JavaScript: <SiJavascript size={18} />,
  Python: <SiPython size={18} />,
  "C/C++": <SiCplusplus size={18} />,
  Java: <FaJava size={18} />,
  Dart: <SiDart size={18} />,

  // Frameworks
  React: <SiReact size={18} />,
  "Express.js": <SiExpress size={18} />,
  Django: <SiDjango size={18} />,
  DRF: <SiDjango size={18} />,
  Flutter: <SiFlutter size={18} />,
  LangChain: <Sparkles size={18} />,

  // Databases
  MongoDB: <SiMongodb size={18} />,
  "Firebase (Auth/Firestore)": <SiFirebase size={18} />,
  "MySQL (basic)": <SiMysql size={18} />,

  // Tools
  "Git/GitHub": <SiGithub size={18} />,
  Postman: <SiPostman size={18} />,
};

function SkillChip({ label }: { label: string }) {
  const icon = iconMap[label];

  return (
    <span className="inline-flex shrink-0 items-center gap-2 border border-rule bg-raised px-4 py-2 font-mono text-sm text-ink">
      {icon ? <span className="text-accent">{icon}</span> : null}
      <span>{label}</span>
    </span>
  );
}

function Row({
  title,
  items,
  reverse,
}: {
  title: string;
  items: string[];
  reverse?: boolean;
}) {
  return (
    <div className="border-t border-rule py-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {title}
      </p>
      <Marquee reverse={reverse} speed={36}>
        {items.map((x) => (
          <SkillChip key={x} label={x} />
        ))}
      </Marquee>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-20 md:py-28">
      <h2 className="border-b border-rule pb-5 font-mono text-sm uppercase tracking-[0.22em] text-ink">
        <span className="text-accent">02</span> — Skills
      </h2>

      <div className="mt-4">
        <Row title="Strengths" items={skills.strengths} />
        <Row title="Languages" items={skills.languages} reverse />
        <Row title="Frameworks" items={skills.frameworks} />
        <Row title="Databases" items={skills.databases} reverse />
        <Row title="Tools" items={skills.tools} />
      </div>
    </section>
  );
}
