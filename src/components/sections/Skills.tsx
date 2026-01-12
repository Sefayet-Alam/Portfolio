// components/sections/skill.tsx
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

type SkillsProps = {
  skills: {
    strengths: string[];
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
  };
};

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
    <span
      className="
        inline-flex items-center gap-2
        rounded-full border border-zinc-200 bg-white/70
        px-3 py-1.5
        text-sm leading-snug text-zinc-700 backdrop-blur
        dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200
        md:px-4 md:py-2 md:text-base
      "
    >
      {icon ? (
        <span className="text-zinc-700 dark:text-zinc-200">{icon}</span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/55 p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/45">
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 md:text-lg">
        {title}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5 md:gap-3">
        {items.map((x) => (
          <SkillChip key={x} label={x} />
        ))}
      </div>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-14">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        Skills
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Block title="Strengths" items={skills.strengths} />
        <Block title="Languages" items={skills.languages} />
        <Block title="Frameworks" items={skills.frameworks} />
        <Block title="Databases" items={skills.databases} />
        <Block title="Tools" items={skills.tools} />
      </div>
    </section>
  );
}
