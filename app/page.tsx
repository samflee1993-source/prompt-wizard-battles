import Link from "next/link";
import { StubBadge } from "@/components/StubBadge";

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero-placeholder">
        <div className="placeholder-tag">
          <StubBadge kind="landing" />
        </div>
        <p className="eyebrow">A two-wizard prompt duel</p>
        <h1>Prompt Wizard Battles</h1>
        <p className="hero-lede">
          Same before. Same riddle. One spell each. Gens fly in parallel. Half
          the score is a cold match to the after — the other half is a
          personality with opinions.
        </p>
        <div className="hero-art" aria-hidden>
          <span>Landing hero art</span>
          <small>Reserved for Landing agent handoff</small>
        </div>
        <Link href="/duel" className="btn primary xl">
          Enter the duel
        </Link>
      </section>

      <section className="how">
        <h2>How a duel works</h2>
        <div className="how-grid">
          <article className="placeholder-card">
            <span className="num">1</span>
            <h3>Riddle the after</h3>
            <p>Both wizards see the before-image and a riddle that hints at the true prompt-method.</p>
          </article>
          <article className="placeholder-card">
            <span className="num">2</span>
            <h3>Cast in parallel</h3>
            <p>One spell each. The circle waits on both gens at once — not one after the other.</p>
          </article>
          <article className="placeholder-card">
            <span className="num">3</span>
            <h3>Split the laurel</h3>
            <p>50% deterministic similarity · 50% Archmage Snark. Winner gets a funny congrats.</p>
          </article>
        </div>
      </section>

      <section className="handoff-note">
        <p>
          Visuals on this page are labeled placeholders until Landing / Orchestrator
          ships approved blocks into <code>/public/landing/</code>. Duel routes stay
          unchanged.
        </p>
      </section>
    </div>
  );
}
