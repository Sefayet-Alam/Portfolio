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
  "JavaScript": <SiJavascript size={16} />,
  "Python": <SiPython size={16} />,
  "C/C++": <SiCplusplus size={16} />,
  "Java": <FaJava size={16} />,
  "Dart": <SiDart size={16} />,

  // Frameworks
  "React": <SiReact size={16} />,
  "Express.js": <SiExpress size={16} />,
  "Django": <SiDjango size={16} />,
  "DRF": <SiDjango size={16} />,
  "Flutter": <SiFlutter size={16} />,
  "LangChain": <Sparkles size={16} />, // safe, always exists

  // Databases
  "MongoDB": <SiMongodb size={16} />,
  "Firebase (Auth/Firestore)": <SiFirebase size={16} />,
  "MySQL (basic)": <SiMysql size={16} />,

  // Tools
  "Git/GitHub": <SiGithub size={16} />,
  "Postman": <SiPostman size={16} />,
};

function Chip({ label }: { label: string }) {
  const icon = iconMap[label];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200">
      {icon ? <span className="text-zinc-700 dark:text-zinc-200">{icon}</span> : null}
      <span>{label}</span>
    </span>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/55 p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/45">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((x) => (
          <Chip key={x} label={x} />
        ))}
      </div>
    </div>
  );
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="py-14">
      <h2 className="text-lg font-semibold tracking-tight md:text-xl">Skills</h2>

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
