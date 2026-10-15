import {
  SiCplusplus,
  SiDart,
  SiDjango,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiPostman,
  SiPython,
  SiReact,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Boxes, Database, Languages, Sparkles, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Surface } from "@/components/ui/Surface";

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
  JavaScript: <SiJavascript size={17} />,
  Python: <SiPython size={17} />,
  "C/C++": <SiCplusplus size={17} />,
  Java: <FaJava size={17} />,
  Dart: <SiDart size={17} />,
  React: <SiReact size={17} />,
  "Express.js": <SiExpress size={17} />,
  Django: <SiDjango size={17} />,
  DRF: <SiDjango size={17} />,
  Flutter: <SiFlutter size={17} />,
  LangChain: <Sparkles size={17} />,
  MongoDB: <SiMongodb size={17} />,
  "Firebase (Auth/Firestore)": <SiFirebase size={17} />,
  "MySQL (basic)": <SiMysql size={17} />,
  "Git/GitHub": <SiGithub size={17} />,
  Postman: <SiPostman size={17} />,
};

function SkillChip({ label }: { label: string }) {
  const icon = iconMap[label];

  return (
    <li className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-rule bg-surface/70 px-3 py-2 text-sm text-ink transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-rule-strong hover:bg-accent-soft hover:shadow-[0_10px_24px_var(--accent-soft)] focus-within:-translate-y-1">
      {icon ? (
        <span className="text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110">
          {icon}
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
      )}
      <span>{label}</span>
    </li>
  );
}

function CapabilityGroup({
  title,
  description,
  items,
  icon,
  className,
}: {
  title: string;
  description: string;
  items: string[];
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <Surface as="article" interactive className={`p-6 md:p-7 ${className}`}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.035em] text-ink">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rule bg-accent-soft text-accent">
          {icon}
        </span>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <SkillChip key={item} label={item} />
        ))}
      </ul>
    </Surface>
  );
}

export function Skills({ skills }: SkillsProps) {
  const total = Object.values(skills).reduce(
    (count, items) => count + items.length,
    0,
  );

  return (
    <section id="skills" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[0.85fr_1.15fr] md:items-end">
        <div>
          <p className="section-kicker">03 / Capability matrix</p>
          <Reveal as="h2" className="section-title mt-4">
            The whole toolkit, at a glance.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-xl text-base leading-7 text-muted md:justify-self-end"
        >
          No rotating wheel and no waiting for a ticker. All {total} capabilities
          stay visible, grouped by how I use them to move from problem to product.
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-12">
        <CapabilityGroup
          title="Core strengths"
          description="The habits behind the implementation."
          items={skills.strengths}
          icon={<Sparkles size={18} />}
          className="lg:col-span-5"
        />
        <CapabilityGroup
          title="Languages"
          description="From systems thinking to product scripting."
          items={skills.languages}
          icon={<Languages size={18} />}
          className="lg:col-span-7"
        />
        <CapabilityGroup
          title="Frameworks"
          description="Web, mobile, APIs, and AI orchestration."
          items={skills.frameworks}
          icon={<Boxes size={18} />}
          className="lg:col-span-7"
        />
        <CapabilityGroup
          title="Data layer"
          description="Pragmatic persistence for production apps."
          items={skills.databases}
          icon={<Database size={18} />}
          className="lg:col-span-5"
        />
        <CapabilityGroup
          title="Workflow"
          description="Tools that keep delivery inspectable and repeatable."
          items={skills.tools}
          icon={<Wrench size={18} />}
          className="lg:col-span-12"
        />
      </div>
    </section>
  );
}
