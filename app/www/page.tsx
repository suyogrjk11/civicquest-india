"use client";

import Link from "next/link";

export default function WWWHome() {
  return (
    <main className="kf-www">
      <style>{`
        .kf-www {
          --navy: #061a35;
          --navy-2: #0a2344;
          --ivory: #fbf7ef;
          --ink: #102033;
          --muted: #667487;
          --orange: #ff7a1a;
          --line: rgba(16,32,51,.10);
          min-height: 100vh;
          background: var(--ivory);
          color: var(--ink);
          overflow: hidden;
        }

        .kf-www * { box-sizing: border-box; }

        .kf-www-shell {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
        }

        .kf-www-nav {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 78px;
          gap: 24px;
          border-bottom: 1px solid var(--line);
        }

        .kf-www-logo {
          color: var(--ink);
          text-decoration: none;
          font-family: var(--font-display), sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -.03em;
        }

        .kf-www-logo span { color: var(--orange); }

        .kf-www-navlinks {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .kf-www-navlinks a {
          color: #445165;
          text-decoration: none;
          font: 700 .9rem var(--font-body), sans-serif;
          transition: color .18s ease;
        }

        .kf-www-navlinks a:hover { color: var(--ink); }

        .kf-www-navactions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-www-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          text-decoration: none;
          font: 800 .85rem var(--font-body), sans-serif;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .kf-www-pill:hover {
          transform: translateY(-2px);
        }

        .kf-www-pill-ghost {
          color: var(--ink);
          border: 1px solid rgba(16,32,51,.15);
          background: rgba(255,255,255,.5);
        }

        .kf-www-pill-primary {
          color: #1a2230;
          background: var(--orange);
          box-shadow: 0 12px 28px rgba(255,122,26,.17);
        }

        .kf-www-hero {
          position: relative;
          padding: 78px 0 84px;
        }

        .kf-www-hero::before {
          content: "";
          position: absolute;
          width: 620px;
          height: 620px;
          right: -180px;
          top: -130px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,191,131,.52), rgba(255,191,131,0) 68%);
          pointer-events: none;
        }

        .kf-www-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.02fr .98fr;
          align-items: center;
          gap: 60px;
        }

        .kf-www-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          color: #735038;
          background: rgba(255,226,198,.72);
          border: 1px solid rgba(255,122,26,.16);
          font: 900 .72rem var(--font-body), sans-serif;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-www-title {
          margin: 22px 0 18px;
          max-width: 700px;
          font-family: var(--font-display), sans-serif;
          font-size: clamp(4rem, 7.2vw, 7.1rem);
          font-weight: 800;
          line-height: .9;
          letter-spacing: -.04em;
        }

        .kf-www-title span {
          display: block;
        }

        .kf-www-title .orange {
          color: var(--orange);
        }

        .kf-www-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font: 500 1.08rem/1.7 var(--font-body), sans-serif;
        }

        .kf-www-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .kf-www-note {
          margin-top: 18px;
          color: #8a95a3;
          font: 700 .72rem var(--font-body), sans-serif;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .kf-www-visual {
          position: relative;
          min-height: 570px;
        }

        .kf-www-image-wrap {
          position: absolute;
          inset: 22px 30px 30px 36px;
          overflow: hidden;
          border: 10px solid rgba(255,255,255,.68);
          border-radius: 34px 46px 34px 48px;
          background: #dfe9f1;
          box-shadow: 0 32px 72px rgba(16,32,51,.16);
          transform: rotate(1.4deg);
        }

        .kf-www-image-wrap img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .kf-www-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-www-orb-a {
          width: 172px;
          height: 172px;
          right: 4px;
          top: 18px;
          background: #ffc58f;
        }

        .kf-www-orb-b {
          width: 138px;
          height: 138px;
          left: 0;
          bottom: 30px;
          background: #dcecf6;
        }

        .kf-www-float {
          position: absolute;
          display: grid;
          gap: 4px;
          padding: 14px 18px;
          border-radius: 18px;
          border: 1px solid rgba(16,32,51,.08);
          background: rgba(255,255,255,.90);
          box-shadow: 0 18px 38px rgba(16,32,51,.12);
          backdrop-filter: blur(12px);
        }

        .kf-www-float small {
          color: #8a95a3;
          font: 900 .6rem var(--font-body), sans-serif;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-www-float strong {
          color: var(--ink);
          font: 800 .95rem var(--font-body), sans-serif;
        }

        .kf-www-float-a {
          left: 0;
          top: 110px;
        }

        .kf-www-float-b {
          right: 0;
          bottom: 96px;
        }

        .kf-www-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 56px;
        }

        .kf-www-step {
          padding: 18px 20px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 20px;
          background: rgba(255,255,255,.52);
          box-shadow: 0 12px 30px rgba(16,32,51,.05);
        }

        .kf-www-step b {
          display: block;
          margin-bottom: 6px;
          font: 900 .72rem var(--font-body), sans-serif;
          letter-spacing: .15em;
          color: var(--orange);
          text-transform: uppercase;
        }

        .kf-www-step span {
          color: #536073;
          font: 800 .96rem var(--font-body), sans-serif;
        }

        @media (max-width: 960px) {
          .kf-www-navlinks { display: none; }

          .kf-www-hero-grid {
            grid-template-columns: 1fr;
          }

          .kf-www-copy {
            max-width: 760px;
          }

          .kf-www-visual {
            min-height: 520px;
          }

          .kf-www-steps {
            margin-top: 32px;
          }
        }

        @media (max-width: 640px) {
          .kf-www-shell {
            width: min(100% - 28px, 1240px);
          }

          .kf-www-nav {
            min-height: 68px;
          }

          .kf-www-navactions .kf-www-pill-ghost {
            display: none;
          }

          .kf-www-hero {
            padding: 48px 0 56px;
          }

          .kf-www-title {
            font-size: clamp(3.5rem, 17vw, 5rem);
          }

          .kf-www-visual {
            min-height: 400px;
          }

          .kf-www-image-wrap {
            inset: 8px 18px 20px 12px;
            border-width: 7px;
          }

          .kf-www-float {
            padding: 11px 13px;
          }

          .kf-www-steps {
            grid-template-columns: 1fr;
          }
        }

        html[data-theme="dark"] .kf-www {
          --ivory: #07111f;
          --ink: #f5f7fb;
          --muted: #9eafc2;
          --line: rgba(143,181,220,.16);
          background: #07111f;
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-www-logo,
        html[data-theme="dark"] .kf-www-navlinks a,
        html[data-theme="dark"] .kf-www-pill-ghost {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-www-navlinks a:hover {
          color: #ffffff;
        }

        html[data-theme="dark"] .kf-www-pill-ghost {
          background: rgba(16,36,58,.82);
          border-color: rgba(143,181,220,.18);
        }

        html[data-theme="dark"] .kf-www-hero::before {
          background: radial-gradient(circle, rgba(79,181,255,.14), rgba(79,181,255,0) 68%);
        }

        html[data-theme="dark"] .kf-www-eyebrow {
          color: #d6b08e;
          background: rgba(66,47,33,.62);
          border-color: rgba(255,179,122,.18);
        }

        html[data-theme="dark"] .kf-www-copy {
          color: #aebdd0;
        }

        html[data-theme="dark"] .kf-www-note {
          color: #71849a;
        }

        html[data-theme="dark"] .kf-www-image-wrap {
          border-color: rgba(255,255,255,.14);
          background: #10243a;
          box-shadow: 0 34px 78px rgba(0,0,0,.34);
        }

        html[data-theme="dark"] .kf-www-orb-a {
          background: #5b3a23;
        }

        html[data-theme="dark"] .kf-www-orb-b {
          background: #173c55;
        }

        html[data-theme="dark"] .kf-www-float {
          background: rgba(14,34,55,.88);
          border-color: rgba(143,181,220,.18);
          box-shadow: 0 20px 42px rgba(0,0,0,.28);
        }

        html[data-theme="dark"] .kf-www-float small {
          color: #8ea2b8;
        }

        html[data-theme="dark"] .kf-www-float strong {
          color: #f2f6fb;
        }

        html[data-theme="dark"] .kf-www-step {
          background: rgba(16,36,58,.72);
          border-color: rgba(143,181,220,.14);
        }

        html[data-theme="dark"] .kf-www-step span {
          color: #bac8d6;
        }
      `}</style>

      <div className="kf-www-shell">
        <nav className="kf-www-nav" aria-label="Main navigation">
          <Link href="/www" className="kf-www-logo">
            Karma<span>Facie</span>
          </Link>

          <div className="kf-www-navlinks">
            <a href="#about">About</a>
            <a href="#how">How it works</a>
            <a href="#platform">Platform</a>
            <a href="#impact">Impact</a>
          </div>

          <div className="kf-www-navactions">
            <Link href="/" className="kf-www-pill kf-www-pill-ghost">
              Explore
            </Link>
            <Link href="/auth" className="kf-www-pill kf-www-pill-primary">
              Enter KarmaFacie →
            </Link>
          </div>
        </nav>

        <section className="kf-www-hero">
          <div className="kf-www-hero-grid">
            <div>
              <span className="kf-www-eyebrow">🇮🇳 Built for citizens of India</span>

              <h1 className="kf-www-title">
                <span>Know.</span>
                <span>Understand.</span>
                <span className="orange">Participate.</span>
              </h1>

              <p className="kf-www-copy">
                KarmaFacie brings civic learning, understanding and meaningful
                participation into one connected citizen experience.
              </p>

              <div className="kf-www-actions">
                <Link href="/" className="kf-www-pill kf-www-pill-primary">
                  Explore KarmaFacie →
                </Link>
                <Link href="/auth" className="kf-www-pill kf-www-pill-ghost">
                  Start your civic journey
                </Link>
              </div>

              <div className="kf-www-note">
                Learn · Understand · Act · Verify · Earn · Belong
              </div>

              <div className="kf-www-steps" id="how">
                <div className="kf-www-step">
                  <b>Learn</b>
                  <span>Build civic knowledge.</span>
                </div>
                <div className="kf-www-step">
                  <b>Understand</b>
                  <span>Connect knowledge to real systems.</span>
                </div>
                <div className="kf-www-step">
                  <b>Participate</b>
                  <span>Turn knowledge into civic action.</span>
                </div>
              </div>
            </div>

            <div className="kf-www-visual" aria-hidden="true">
              <div className="kf-www-orb kf-www-orb-a" />
              <div className="kf-www-orb kf-www-orb-b" />

              <div className="kf-www-image-wrap">
                <img src="/images/kf-hero.png" alt="" />
              </div>

              <div className="kf-www-float kf-www-float-a">
                <small>KarmaFacie</small>
                <strong>Learn → Understand</strong>
              </div>

              <div className="kf-www-float kf-www-float-b">
                <small>Civic journey</small>
                <strong>Learn → Act → Track</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="about" style={{ padding: "20px 0 80px" }}>
          <div
            style={{
              padding: "34px 0 0",
              borderTop: "1px solid var(--line)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#ff7a1a",
                font: "900 .72rem var(--font-body), sans-serif",
                letterSpacing: ".18em",
                textTransform: "uppercase",
              }}
            >
              WHAT IS KARMAFACIE?
            </p>
            <h2
              style={{
                margin: "12px 0 0",
                maxWidth: 800,
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: ".95",
                letterSpacing: "-.035em",
              }}
            >
              A simpler way to understand and participate in civic life.
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}
