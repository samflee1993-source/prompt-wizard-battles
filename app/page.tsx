import Link from "next/link";

const BANNERS = [
  {
    id: "hero",
    src: "/landing/hero-v1.png",
    alt: "Prompt Wizard Battles — duel with prompts, laugh at the verdict. Enter the Arena.",
    href: "/duel",
  },
  {
    id: "how-it-works",
    src: "/landing/how-it-works-v1.png",
    alt: "How it works: get the riddle, cast your prompt, wait for the sparks, judge picks a winner",
  },
  {
    id: "learn",
    src: "/landing/learn-fun-v2.png",
    alt: "Learn by laughing — watch the professor's transformation spell, then replicate it with your own prompt",
  },
  {
    id: "duel",
    src: "/landing/duel-tease-v1.png",
    alt: "The Duel — same riddle, two spells, parallel generation",
  },
  {
    id: "judge",
    src: "/landing/judge-tease-v1.png",
    alt: "The Judge — personality LLM, half-deterministic, fully ridiculous",
  },
  {
    id: "cta",
    src: "/landing/cta-v1.png",
    alt: "Ready to cast? Enter the Arena",
    href: "/duel",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="landing">
      {BANNERS.map((block) => {
        const img = <img src={block.src} alt={block.alt} />;
        return (
          <section
            key={block.id}
            className="landing-block"
            id={block.id}
            aria-label={block.alt}
          >
            {"href" in block && block.href ? (
              <Link
                href={block.href}
                className="banner-cta"
                aria-label="Enter the Arena"
              >
                {img}
              </Link>
            ) : (
              img
            )}
          </section>
        );
      })}

      <div className="live-cta" id="enter">
        <Link href="/duel">Enter the Arena</Link>
      </div>

      <footer className="site-footer">
        Prompt Wizard Battles · POC · stubs labeled · no paid APIs required
      </footer>
    </div>
  );
}
