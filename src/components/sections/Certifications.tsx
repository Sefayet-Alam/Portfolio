import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { PointerTilt } from "@/components/motion/PointerTilt";
import { Reveal } from "@/components/motion/Reveal";
import { SectionMotion } from "@/components/motion/SectionMotion";
import { actionClassName } from "@/components/ui/ActionButton";
import { Surface } from "@/components/ui/Surface";

type Cert = {
  name: string;
  issuer: string;
  issued: string;
  image?: string;
  link?: string;
  bullets: string[];
};

export function Certifications({
  certifications,
}: {
  certifications: Cert[];
}) {
  if (!certifications?.length) return null;

  return (
    <section id="certifications" className="py-20 md:py-28">
      <div className="grid gap-7 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div>
          <p className="section-kicker">06 / Credentials</p>
          <Reveal as="h2" className="section-title mt-4">
            Credentials that back the craft.
          </Reveal>
        </div>
        <Reveal
          as="p"
          className="max-w-lg text-base leading-7 text-muted md:justify-self-end"
        >
          Formal recognition across AI/ML, competitive programming, and
          product engineering, kept compact and directly verifiable.
        </Reveal>
      </div>

      <SectionMotion variant="deal" className="mt-10 grid gap-5 md:grid-cols-2">
        {certifications.map((certificate) => (
          <PointerTilt key={certificate.name} maxTilt={2.5} lift={4}>
            <Surface
              as="article"
              className="group h-full overflow-hidden p-2.5"
            >
              <div className="relative aspect-[16/8] overflow-hidden rounded-[16px] border border-rule bg-surface">
                {certificate.image ? (
                  <Image
                    src={certificate.image}
                    alt={certificate.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                  />
                ) : (
                  <div className="relative grid h-full place-items-center overflow-hidden bg-[#0b1020] text-white">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-60"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 25% 35%, rgba(85,217,232,.35) 0 2px, transparent 3px), radial-gradient(circle at 72% 62%, rgba(124,137,255,.42) 0 3px, transparent 4px), linear-gradient(135deg, transparent 35%, rgba(124,137,255,.16), transparent 65%)",
                        backgroundSize: "52px 52px, 76px 76px, auto",
                      }}
                    />
                    <div className="relative text-center">
                      <BadgeCheck
                        size={34}
                        className="mx-auto text-signal"
                      />
                      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
                        Verified learning track
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                        AI / ML Credential
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink">
                      {certificate.name}
                    </h3>
                    <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-muted">
                      {certificate.issuer} · {certificate.issued}
                    </p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-signal-soft text-signal">
                    <BadgeCheck size={16} />
                  </span>
                </div>

                {certificate.bullets.length ? (
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {certificate.bullets[0]}
                  </p>
                ) : null}

                {certificate.link ? (
                  <a
                    href={certificate.link}
                    target="_blank"
                    rel="noreferrer"
                    className={actionClassName("quiet", "mt-5")}
                  >
                    Verify
                    <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            </Surface>
          </PointerTilt>
        ))}
      </SectionMotion>
    </section>
  );
}
