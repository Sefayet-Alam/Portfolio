import { ArrowUpRight, Mail } from "lucide-react";
import { ActionLink } from "@/components/ui/ActionButton";
import { Surface } from "@/components/ui/Surface";

type ContactProps = {
  email: string;
  links: {
    github: string;
    linkedin: string;
    codeforces: string;
    resume: string;
  };
};

export function Contact({ email, links }: ContactProps) {
  return (
    <section id="contact" className="py-20 md:py-28">
      <Surface className="overflow-hidden p-7 md:p-10">
        <p className="section-kicker">Open channel</p>
        <h2 className="mt-4 max-w-[13ch] text-4xl font-semibold tracking-[-0.055em] text-ink md:text-6xl">
          Let&apos;s turn a hard problem into a clear product.
        </h2>
        <div className="mt-7 flex flex-wrap gap-3">
          <ActionLink href={`mailto:${email}`} variant="primary">
            <Mail size={15} />
            Start a conversation
          </ActionLink>
          <ActionLink href={links.resume} external variant="secondary">
            Résumé
            <ArrowUpRight size={14} />
          </ActionLink>
        </div>
      </Surface>
    </section>
  );
}
