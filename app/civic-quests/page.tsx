"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { constitutionQuest } from "@/lib/civic-quests";
import { governanceQuest } from "@/lib/governance-quest";
import { electionsQuest } from "@/lib/elections-quest";
import { knowIndiaQuest } from "@/lib/know-india-quest";

type QuestCard = {
  id: string;
  icon: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: Record<Language, string>;
  questions: number;
  xp: number;
  path?: string;
  available: boolean;
};

const ui: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    description: string;
    library: string;
    available: string;
    comingSoon: string;
    questions: string;
    xp: string;
    start: string;
    soonDescription: string;
    backDashboard: string;
    footer: string;
    language: string;
    questCount: (count: number) => string;
  }
> = {
  en: {
    eyebrow: "🎯 CIVICQUEST",
    title: "Learn. Play. Understand India.",
    description:
      "Take short interactive civic challenges, test what you know and earn XP as you learn.",
    library: "Quest Library",
    available: "AVAILABLE NOW",
    comingSoon: "COMING SOON",
    questions: "questions",
    xp: "XP",
    start: "Start Quest →",
    soonDescription:
      "This quest is being prepared. Check back soon for a new civic challenge.",
    backDashboard: "← Back to Dashboard",
    footer: "Civic knowledge grows one quest at a time.",
    language: "Language",
    questCount: (count) => `${count} quests`,
  },
  hi: {
    eyebrow: "🎯 CIVICQUEST",
    title: "सीखें। खेलें। भारत को समझें।",
    description:
      "छोटी इंटरैक्टिव नागरिक चुनौतियों में भाग लें, अपनी जानकारी परखें और सीखते हुए XP अर्जित करें।",
    library: "क्वेस्ट लाइब्रेरी",
    available: "अभी उपलब्ध",
    comingSoon: "जल्द आ रहा है",
    questions: "प्रश्न",
    xp: "XP",
    start: "क्वेस्ट शुरू करें →",
    soonDescription:
      "यह क्वेस्ट तैयार की जा रही है। एक नई नागरिक चुनौती के लिए जल्द वापस आएँ।",
    backDashboard: "← डैशबोर्ड पर वापस जाएँ",
    footer: "नागरिक ज्ञान एक-एक क्वेस्ट के साथ बढ़ता है।",
    language: "भाषा",
    questCount: (count) => `${count} क्वेस्ट`,
  },
  mr: {
    eyebrow: "🎯 CIVICQUEST",
    title: "शिका. खेळा. भारत समजून घ्या.",
    description:
      "छोट्या इंटरॅक्टिव्ह नागरी आव्हानांमध्ये सहभागी व्हा, तुमचे ज्ञान तपासा आणि शिकताना XP मिळवा.",
    library: "क्वेस्ट लायब्ररी",
    available: "आत्ता उपलब्ध",
    comingSoon: "लवकरच येत आहे",
    questions: "प्रश्न",
    xp: "XP",
    start: "क्वेस्ट सुरू करा →",
    soonDescription:
      "ही क्वेस्ट तयार केली जात आहे. नवीन नागरी आव्हानासाठी लवकरच पुन्हा भेट द्या.",
    backDashboard: "← डॅशबोर्डवर परत जा",
    footer: "नागरी ज्ञान एका वेळी एका क्वेस्टने वाढते.",
    language: "भाषा",
    questCount: (count) => `${count} क्वेस्ट`,
  },
};

const quests: QuestCard[] = [
  {
    id: "constitution",
    icon: "📜",
    title: constitutionQuest.title,
    description: constitutionQuest.description,
    category: {
      en: "Constitution & Democracy",
      hi: "संविधान और लोकतंत्र",
      mr: "राज्यघटना आणि लोकशाही",
    },
    questions: constitutionQuest.questions.length,
    xp: constitutionQuest.questions.length * constitutionQuest.xpPerQuestion,
    path: "/civic-quests/constitution",
    available: true,
  },
  {
    id: "governance",
    icon: "🏛️",
    title: {
      en: "How India is Governed",
      hi: "भारत में शासन कैसे चलता है",
      mr: "भारतात शासन कसे चालते",
    },
    description: {
      en: "Explore how Union, State and Local Government work and how responsibilities are divided.",
      hi: "जानें कि केंद्र, राज्य और स्थानीय सरकारें कैसे काम करती हैं और जिम्मेदारियाँ कैसे बाँटी जाती हैं।",
      mr: "केंद्र, राज्य आणि स्थानिक सरकारे कशी काम करतात आणि जबाबदाऱ्या कशा विभागल्या जातात ते जाणून घ्या.",
    },
    category: {
      en: "Government",
      hi: "सरकार",
      mr: "शासन",
    },
    questions: governanceQuest.questions.length,
    xp: governanceQuest.questions.length * governanceQuest.xpPerQuestion,
    path: "/civic-quests/governance",
    available: true,
  },
  {
    id: "elections",
    icon: "🗳️",
    title: {
      en: "Elections & Voting",
      hi: "चुनाव और मतदान",
      mr: "निवडणुका आणि मतदान",
    },
    description: {
      en: "Understand voters, elections, EVMs, VVPAT and ways citizens participate in democracy.",
      hi: "मतदाता, चुनाव, EVM, VVPAT और लोकतंत्र में नागरिक भागीदारी के तरीकों को समझें।",
      mr: "मतदार, निवडणुका, EVM, VVPAT आणि लोकशाहीतील नागरिकांच्या सहभागाचे मार्ग समजून घ्या.",
    },
    category: {
      en: "Elections",
      hi: "चुनाव",
      mr: "निवडणुका",
    },
    questions: electionsQuest.questions.length,
    xp: electionsQuest.questions.length * electionsQuest.xpPerQuestion,
    path: "/civic-quests/elections",
    available: true,
  },
  {
    id: "india",
    icon: "🇮🇳",
    title: {
      en: "Know India Challenge",
      hi: "भारत को जानें चुनौती",
      mr: "भारत जाणून घ्या आव्हान",
    },
    description: {
      en: "Test your knowledge of India's states, Union Territories, geography, history and national symbols.",
      hi: "भारत के राज्यों, केंद्रशासित प्रदेशों, भूगोल, इतिहास और राष्ट्रीय प्रतीकों के बारे में अपनी जानकारी परखें।",
      mr: "भारताची राज्ये, केंद्रशासित प्रदेश, भूगोल, इतिहास आणि राष्ट्रीय प्रतीकांबद्दलचे तुमचे ज्ञान तपासा.",
    },
    category: {
      en: "Know India",
      hi: "भारत को जानें",
      mr: "भारत जाणून घ्या",
    },
    questions: knowIndiaQuest.questions.length,
    xp: knowIndiaQuest.questions.length * knowIndiaQuest.xpPerQuestion,
    path: "/civic-quests/know-india",
    available: true,
  },
];

export default function CivicQuestsPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const text = ui[language];

  // Prevent server/client language-state differences from causing a first-render
  // hydration mismatch. The full page is rendered only after the client mounts.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background:
            "radial-gradient(circle at 90% 4%, rgba(215,232,242,.92) 0%, rgba(215,232,242,0) 26%), radial-gradient(circle at 8% 92%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 28%), #f8f3ea",
          color: "#102033",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            width: "min(440px,100%)",
            padding: "34px 30px",
            textAlign: "center",
            borderRadius: "30px",
            background: "rgba(255,253,249,.97)",
            border: "1px solid #ded8cf",
            boxShadow: "0 20px 56px rgba(16,27,43,.08)",
          }}
        >
          <div
            style={{
              color: "#102033",
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              lineHeight: 1,
              letterSpacing: "-.05em",
              fontWeight: 800,
            }}
          >
            Karma<span style={{ color: "#ff7a00" }}>Facie</span>
          </div>

          <div
            style={{
              width: "68px",
              height: "5px",
              margin: "15px auto",
              borderRadius: "999px",
              background: "#ff7a00",
            }}
          />

          <div
            style={{
              color: "#687985",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Loading…
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="kf-quests-page">
      <div className="kf-quests-shell">

        {/* TOP BAR */}
        <header className="kf-quests-topbar">
          <div className="kf-header-side kf-header-left">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="kf-back-button"
            >
              <span>←</span>
              {text.backDashboard.replace("← ", "")}
            </button>
          </div>

          <div className="kf-brand-lockup kf-centered-brand" aria-label="KarmaFacie Civic Quests">
            <div className="kf-brand-box">K</div>

            <div>
              <div className="kf-brand-name">
                Karma<span>Facie</span>
              </div>

              <div className="kf-brand-caption">
                CIVIC QUESTS
              </div>
            </div>
          </div>

          <div className="kf-header-side kf-header-right">
            <label className="kf-language">
              <span>{text.language}</span>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(
                    event.target.value as Language
                  )
                }
                aria-label={text.language}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </label>
          </div>
        </header>

        {/* HERO */}
        <section className="kf-quests-hero">
          <div className="kf-hero-orb kf-hero-blue" />
          <div className="kf-hero-orb kf-hero-peach" />

          <div className="kf-hero-content">
            <div className="kf-eyebrow">
              {text.eyebrow}
            </div>

            <div className="kf-hero-grid">
              <div>
                <h1>{text.title}</h1>
                <p>{text.description}</p>
              </div>

              <div className="kf-hero-badge">
                <div className="kf-hero-badge-icon">🧭</div>
                <div>
                  <strong>
                    {text.questCount(quests.length)}
                  </strong>
                  <span>{text.library}</span>
                </div>
              </div>
            </div>

            <div className="kf-hero-note">
              <span>✨</span>
              <span>
                {language === "en"
                  ? "Learn something. Test yourself. Keep your civic journey moving."
                  : language === "hi"
                    ? "कुछ सीखें। खुद को परखें। अपनी नागरिक यात्रा को आगे बढ़ाएँ।"
                    : "काहीतरी शिका. स्वतःची चाचणी घ्या. तुमचा नागरी प्रवास पुढे न्या."}
              </span>
            </div>
          </div>
        </section>

        {/* LIBRARY */}
        <section className="kf-library-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                QUEST LIBRARY
              </div>

              <h2>{text.library}</h2>

              <p>
                {language === "en"
                  ? "Explore the civic topics currently available on KarmaFacie."
                  : language === "hi"
                    ? "KarmaFacie पर अभी उपलब्ध नागरिक विषयों को देखें।"
                    : "KarmaFacie वर सध्या उपलब्ध नागरी विषयांचा शोध घ्या."}
              </p>
            </div>

            <div className="kf-count-pill">
              {text.questCount(quests.length)}
            </div>
          </div>

          <div className="kf-quest-grid">
            {quests.map((quest, index) => (
              <article
                key={quest.id}
                className={[
                  "kf-quest-card",
                  index % 4 === 0
                    ? "kf-card-blue"
                    : index % 4 === 1
                      ? "kf-card-peach"
                      : index % 4 === 2
                        ? "kf-card-green"
                        : "kf-card-lavender",
                ].join(" ")}
              >
                <div className="kf-card-top">
                  <div className="kf-quest-icon">
                    {quest.icon}
                  </div>

                  <span
                    className={
                      quest.available
                        ? "kf-availability kf-available"
                        : "kf-availability kf-coming"
                    }
                  >
                    {quest.available
                      ? text.available
                      : text.comingSoon}
                  </span>
                </div>

                <div className="kf-quest-category">
                  {quest.category[language]}
                </div>

                <h3>
                  {quest.title[language]}
                </h3>

                <p className="kf-quest-description">
                  {quest.description[language]}
                </p>

                <div className="kf-quest-stats">
                  <div className="kf-stat">
                    <span className="kf-stat-icon">❓</span>
                    <div>
                      <strong>
                        {quest.questions}
                      </strong>
                      <small>
                        {text.questions}
                      </small>
                    </div>
                  </div>

                  <div className="kf-stat">
                    <span className="kf-stat-icon">⭐</span>
                    <div>
                      <strong>{quest.xp}</strong>
                      <small>{text.xp}</small>
                    </div>
                  </div>
                </div>

                {quest.available ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        quest.available &&
                        quest.path
                      ) {
                        router.push(quest.path);
                      }
                    }}
                    className="kf-start-button"
                  >
                    {text.start}
                    <span>→</span>
                  </button>
                ) : (
                  <div className="kf-coming-box">
                    <span>🔒</span>
                    <span>
                      {text.soonDescription}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="kf-quests-footer">
          Karma<span>Facie</span> · {text.footer}
        </footer>
      </div>

      <style>{`
        .kf-quests-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #596a78;
          --kf-muted: #7e898f;
          --kf-orange: #ff7a00;
          --kf-blue: #edf5fa;
          --kf-blue-line: #d5e5ed;
          --kf-peach: #fff2e4;
          --kf-peach-line: #efddc7;
          --kf-green: #eef6e7;
          --kf-green-line: #d6e6ca;
          --kf-lavender: #f4eff9;
          --kf-lavender-line: #e0d4ea;
          --kf-line: #ddd7ce;

          min-height: 100vh;
          padding: 20px 16px 72px;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
            radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
            radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          color: var(--kf-body);
          font-family: var(--font-body);
        }

        .kf-quests-page *,
        .kf-quests-page *::before,
        .kf-quests-page *::after {
          box-sizing: border-box;
        }

        .kf-quests-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .kf-quests-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          min-height: 84px;
          margin-bottom: 28px;
          padding: 10px 14px;
          border-radius: 32px;
          border: 1px solid var(--kf-line);
          background: rgba(255,255,255,.94);
          box-shadow: 0 14px 36px rgba(16,27,43,.07);
          backdrop-filter: blur(16px);
        }

        .kf-header-side {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .kf-header-left {
          justify-content: flex-start;
        }

        .kf-header-right {
          justify-content: flex-end;
        }

        .kf-back-button {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 48px;
          padding: 0 18px;
          border: 1px solid #dfe3e7;
          border-radius: 999px;
          background: #fff;
          color: #52616f;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 5px 18px rgba(16,32,51,.035);
        }

        .kf-back-button span {
          color: var(--kf-orange);
          font-size: 20px;
          line-height: 1;
        }

        .kf-brand-lockup {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          white-space: nowrap;
        }

        .kf-brand-box {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: var(--kf-orange);
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 31px;
          line-height: 1;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(255,122,0,.18);
        }

        .kf-brand-name {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 29px;
          line-height: .95;
          letter-spacing: -.045em;
          font-weight: 800;
        }

        .kf-brand-name span,
        .kf-quests-footer span {
          color: var(--kf-orange);
        }

        .kf-brand-caption {
          margin-top: 5px;
          color: var(--kf-navy);
          font-size: 9px;
          line-height: 1;
          letter-spacing: .24em;
          font-weight: 900;
        }

        .kf-language {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #556573;
          font-size: 14px;
          font-weight: 800;
        }

        .kf-language select {
          min-width: 132px;
          padding: 12px 16px;
          border: 1px solid #d7d1c9;
          border-radius: 999px;
          background: #fff;
          color: #304154;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .kf-language select:focus {
          border-color: #e6ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-quests-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 18px;
          padding: 32px;
          border-radius: 33px;
          border: 1px solid var(--kf-line);
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97);
          box-shadow: 0 18px 48px rgba(16,27,43,.06);
        }

        .kf-hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-hero-blue {
          width: 190px;
          height: 190px;
          right: -76px;
          top: -84px;
          background: rgba(208,227,239,.58);
        }

        .kf-hero-peach {
          width: 170px;
          height: 105px;
          left: -46px;
          bottom: -54px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.46);
          transform: rotate(8deg);
        }

        .kf-hero-content {
          position: relative;
          z-index: 1;
        }

        .kf-eyebrow,
        .kf-section-kicker,
        .kf-card-kicker {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-eyebrow {
          color: #8f765f;
        }

        .kf-hero-grid {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-top: 9px;
        }

        .kf-hero-grid h1 {
          margin: 0;
          max-width: 780px;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(46px, 6vw, 66px);
          line-height: .96;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-hero-grid p {
          max-width: 760px;
          margin: 13px 0 0;
          color: #586a78;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-hero-badge {
          min-width: 145px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 23px;
          background: #f4eff9;
          border: 1px solid var(--kf-lavender-line);
        }

        .kf-hero-badge-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #fffdf9;
          border: 1px solid #e2d9eb;
          font-size: 20px;
        }

        .kf-hero-badge strong {
          display: block;
          color: #304458;
          font-family: var(--font-display);
          font-size: 21px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-hero-badge span {
          display: block;
          margin-top: 4px;
          color: #7d6d90;
          font-size: 9px;
          line-height: 1.2;
          font-weight: 900;
        }

        .kf-hero-note {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255,253,249,.76);
          border: 1px solid rgba(16,27,43,.08);
          color: #64737e;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-library-section {
          padding: 27px;
          border-radius: 30px;
          border: 1px solid #ddd8d0;
          background: rgba(255,253,249,.94);
          box-shadow: 0 14px 38px rgba(16,27,43,.05);
        }

        .kf-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 19px;
        }

        .kf-section-kicker {
          color: #7b6d8c;
        }

        .kf-section-heading h2 {
          margin: 5px 0 4px;
          color: #263a4e;
          font-family: var(--font-display);
          font-size: 32px;
          line-height: 1.02;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .kf-section-heading p {
          margin: 0;
          color: #677781;
          font-size: 12px;
          line-height: 1.6;
        }

        .kf-count-pill {
          padding: 8px 11px;
          border-radius: 999px;
          background: #edf5fa;
          border: 1px solid #d7e5ed;
          color: #5b7a91;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .kf-quest-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 13px;
        }

        .kf-quest-card {
          display: flex;
          flex-direction: column;
          min-height: 390px;
          padding: 20px;
          border-radius: 25px;
          border: 1px solid;
          box-shadow: 0 10px 28px rgba(16,27,43,.045);
        }

        .kf-card-blue {
          background: #edf5fa;
          border-color: var(--kf-blue-line);
        }

        .kf-card-peach {
          background: #fff3e6;
          border-color: var(--kf-peach-line);
        }

        .kf-card-green {
          background: #eef6e7;
          border-color: var(--kf-green-line);
        }

        .kf-card-lavender {
          background: #f4eff9;
          border-color: var(--kf-lavender-line);
        }

        .kf-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .kf-quest-icon {
          width: 57px;
          height: 57px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: rgba(255,253,249,.82);
          border: 1px solid rgba(16,27,43,.07);
          font-size: 29px;
        }

        .kf-availability {
          padding: 7px 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          white-space: nowrap;
        }

        .kf-available {
          background: #e4f1db;
          border: 1px solid #d1e2c4;
          color: #5e7d42;
        }

        .kf-coming {
          background: rgba(255,253,249,.78);
          border: 1px solid rgba(16,27,43,.08);
          color: #7b858b;
        }

        .kf-quest-category {
          color: #7b858d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .kf-quest-card h3 {
          margin: 7px 0 0;
          color: #2e4356;
          font-family: var(--font-display);
          font-size: 24px;
          line-height: 1.04;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .kf-quest-description {
          margin: 9px 0 0;
          color: #64747f;
          font-size: 12px;
          line-height: 1.68;
          flex: 1;
        }

        .kf-quest-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 8px;
          margin: 18px 0 13px;
        }

        .kf-stat {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 11px;
          border-radius: 16px;
          background: rgba(255,253,249,.76);
          border: 1px solid rgba(16,27,43,.07);
        }

        .kf-stat-icon {
          font-size: 15px;
        }

        .kf-stat strong {
          display: block;
          color: #304457;
          font-family: var(--font-display);
          font-size: 17px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-stat small {
          display: block;
          margin-top: 3px;
          color: #7d8890;
          font-size: 8px;
          font-weight: 800;
        }

        .kf-start-button {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 999px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(255,122,0,.16);
        }

        .kf-start-button span {
          font-size: 14px;
        }

        .kf-coming-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-height: 43px;
          padding: 11px 12px;
          border-radius: 17px;
          background: rgba(255,253,249,.72);
          border: 1px solid rgba(16,27,43,.08);
          color: #77838a;
          font-size: 9px;
          line-height: 1.5;
          font-weight: 700;
        }

        .kf-coming-box > span:first-child {
          font-size: 13px;
        }

        .kf-quests-footer {
          padding: 18px 4px 0;
          color: #899298;
          font-family: var(--font-display);
          font-size: 12px;
          text-align: center;
          font-weight: 700;
        }

        @media (max-width: 960px) {
          .kf-quest-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .kf-hero-grid {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .kf-quests-page {
            padding: 14px 11px 56px;
          }

          .kf-quests-topbar {
            grid-template-columns: 1fr auto;
          }

          .kf-brand-lockup {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          .kf-back-button {
            grid-column: 1;
            grid-row: 2;
          }

          .kf-language {
            grid-column: 2;
            grid-row: 2;
          }

          .kf-brand-caption {
            display: none;
          }

          .kf-language span {
            display: none;
          }

          .kf-language select {
            min-width: 108px;
          }

          .kf-quests-hero {
            padding: 24px 20px;
            border-radius: 28px;
          }

          .kf-hero-grid h1 {
            font-size: 44px;
          }

          .kf-hero-grid p {
            font-size: 14px;
          }

          .kf-hero-badge {
            align-self: flex-start;
          }

          .kf-library-section {
            padding: 21px 18px;
            border-radius: 25px;
          }

          .kf-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-quest-grid {
            grid-template-columns: 1fr;
          }

          .kf-quest-card {
            min-height: 0;
          }
        }


/* =========================================================
   KARMAFACIE — CIVIC QUESTS / DARK MODE
   Scoped only to the Civic Quests library page.
   ========================================================= */

html[data-theme="dark"] .kf-quests-page {
  --kf-ivory: #07111f;
  --kf-white: #f5f7fb;
  --kf-navy: #f5f7fb;
  --kf-ink: #e6edf7;
  --kf-body: #b7c7da;
  --kf-muted: #8192a8;
  --kf-orange: #ff7a00;

  --kf-blue: #10263a;
  --kf-blue-line: #254461;
  --kf-peach: #30251b;
  --kf-peach-line: #5d432c;
  --kf-green: #182c25;
  --kf-green-line: #2f5a48;
  --kf-lavender: #27233a;
  --kf-lavender-line: #49416a;
  --kf-line: #1f3048;

  min-height: 100vh;
  color-scheme: dark;
  color: var(--kf-body);
  background:
    radial-gradient(circle at 96% 1%, rgba(0,212,255,.12) 0%, rgba(0,212,255,0) 25%),
    radial-gradient(circle at 2% 26%, rgba(0,212,255,.07) 0%, rgba(0,212,255,0) 22%),
    radial-gradient(circle at 92% 94%, rgba(255,122,0,.10) 0%, rgba(255,122,0,0) 26%),
    radial-gradient(circle at 8% 88%, rgba(255,122,0,.05) 0%, rgba(255,122,0,0) 20%),
    #07111f;
}

/* Ambient page depth */
html[data-theme="dark"] .kf-quests-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 20% 10%, rgba(0,212,255,.035), transparent 24%),
    radial-gradient(circle at 84% 76%, rgba(255,122,0,.035), transparent 25%);
}

html[data-theme="dark"] .kf-quests-shell {
  position: relative;
  z-index: 1;
}

/* ---------- NAVBAR ---------- */
html[data-theme="dark"] .kf-quests-topbar {
  position: relative;
  overflow: visible;
  border: 1px solid transparent;
  background: rgba(4,10,20,.72);
  box-shadow:
    -10px 0 24px -8px rgba(0,212,255,.25),
     10px 0 24px -8px rgba(255,140,26,.25),
     0 12px 30px rgba(0,0,0,.34);
  backdrop-filter: blur(14px) saturate(125%);
}

html[data-theme="dark"] .kf-quests-topbar::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background:
    linear-gradient(
      90deg,
      #00d4ff 0%,
      rgba(0,212,255,.55) 22%,
      rgba(31,68,96,.35) 42%,
      rgba(31,68,96,.20) 58%,
      rgba(255,140,26,.55) 78%,
      #ff8c1a 100%
    );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

html[data-theme="dark"] .kf-quests-topbar::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      rgba(0,212,255,.10),
      transparent 32%,
      transparent 68%,
      rgba(255,140,26,.10)
    );
  filter: blur(10px);
  opacity: .34;
  pointer-events: none;
  z-index: -1;
}

html[data-theme="dark"] .kf-quests-topbar > * {
  position: relative;
  z-index: 2;
}

html[data-theme="dark"] .kf-back-button {
  border-color: #263b55;
  background: #10243a;
  color: #edf3fa;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}

html[data-theme="dark"] .kf-back-button:hover {
  border-color: #365776;
  background: #142b45;
}

html[data-theme="dark"] .kf-brand-box {
  background: #ff7a00;
  color: #07111f;
  box-shadow:
    0 8px 20px rgba(255,122,0,.22),
    0 0 22px rgba(255,122,0,.08);
}

html[data-theme="dark"] .kf-brand-name {
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-brand-name span {
  color: #ff7a00;
}

html[data-theme="dark"] .kf-brand-caption {
  color: #7f91a8;
}

html[data-theme="dark"] .kf-language {
  color: #8293aa;
}

html[data-theme="dark"] .kf-language select {
  border-color: #29405a !important;
  background: #10243a !important;
  color: #f2f6fb !important;
}

html[data-theme="dark"] .kf-language select:focus {
  border-color: rgba(0,212,255,.55) !important;
  box-shadow: 0 0 0 4px rgba(0,212,255,.08) !important;
}

html[data-theme="dark"] .kf-language option {
  background: #10243a !important;
  color: #f5f7fb !important;
}

/* ---------- HERO ---------- */
html[data-theme="dark"] .kf-quests-hero {
  border-color: #21364e;
  background:
    radial-gradient(circle at 93% 2%, rgba(0,212,255,.17) 0%, rgba(0,212,255,0) 30%),
    radial-gradient(circle at 2% 100%, rgba(255,122,0,.13) 0%, rgba(255,122,0,0) 32%),
    linear-gradient(135deg, #0c1a2c 0%, #0d1d31 52%, #10283d 100%);
  box-shadow:
    0 20px 50px rgba(0,0,0,.25),
    inset 0 1px 0 rgba(255,255,255,.018);
}

html[data-theme="dark"] .kf-hero-blue {
  background: rgba(0,212,255,.10);
  box-shadow: 0 0 80px rgba(0,212,255,.08);
}

html[data-theme="dark"] .kf-hero-peach {
  background: rgba(255,122,0,.11);
  box-shadow: 0 0 70px rgba(255,122,0,.07);
}

html[data-theme="dark"] .kf-eyebrow {
  color: #ff9a47;
}

html[data-theme="dark"] .kf-hero-grid h1 {
  color: #f5f7fb;
  text-shadow: 0 4px 24px rgba(0,0,0,.16);
}

html[data-theme="dark"] .kf-hero-grid p {
  color: #b7c7da;
}

html[data-theme="dark"] .kf-hero-badge {
  background: linear-gradient(135deg, rgba(39,35,58,.95), rgba(32,31,51,.82));
  border-color: #49416a;
  box-shadow: 0 12px 26px rgba(0,0,0,.14);
}

html[data-theme="dark"] .kf-hero-badge-icon {
  background: #10243a;
  border-color: #2d4965;
}

html[data-theme="dark"] .kf-hero-badge strong {
  color: #f2f6fb;
}

html[data-theme="dark"] .kf-hero-badge span {
  color: #a89cc5;
}

html[data-theme="dark"] .kf-hero-note {
  background: rgba(24,44,37,.76);
  border-color: #2f5a48;
  color: #9dd2bb;
}

/* ---------- LIBRARY ---------- */
html[data-theme="dark"] .kf-library-section {
  border-color: #1f3048;
  background:
    linear-gradient(180deg, rgba(13,29,49,.97), rgba(10,24,40,.97));
  box-shadow:
    0 16px 42px rgba(0,0,0,.24),
    inset 0 1px 0 rgba(255,255,255,.015);
}

html[data-theme="dark"] .kf-section-kicker {
  color: #ff9a47;
}

html[data-theme="dark"] .kf-section-heading h2 {
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-section-heading p {
  color: #8ea2ba;
}

html[data-theme="dark"] .kf-count-pill {
  background: #10263a;
  border-color: #254461;
  color: #8dc8ea;
}

/* ---------- QUEST CARDS ---------- */
html[data-theme="dark"] .kf-quest-card {
  box-shadow:
    0 12px 30px rgba(0,0,0,.16),
    inset 0 1px 0 rgba(255,255,255,.018);
}

html[data-theme="dark"] .kf-card-blue {
  background: linear-gradient(155deg, #102a40 0%, #10263a 100%);
  border-color: #27506c;
}

html[data-theme="dark"] .kf-card-peach {
  background: linear-gradient(155deg, #38291d 0%, #30251b 100%);
  border-color: #65472e;
}

html[data-theme="dark"] .kf-card-green {
  background: linear-gradient(155deg, #1a332a 0%, #182c25 100%);
  border-color: #35634f;
}

html[data-theme="dark"] .kf-card-lavender {
  background: linear-gradient(155deg, #2b2741 0%, #27233a 100%);
  border-color: #4d4570;
}

html[data-theme="dark"] .kf-quest-icon {
  background: rgba(7,17,31,.55);
  border-color: rgba(255,255,255,.08);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}

html[data-theme="dark"] .kf-available {
  background: rgba(24,61,47,.9);
  border-color: #376b52;
  color: #8ed2b4;
}

html[data-theme="dark"] .kf-coming {
  background: rgba(16,36,58,.86);
  border-color: #2b445e;
  color: #91a1b5;
}

html[data-theme="dark"] .kf-quest-category {
  color: #8da1b8;
}

html[data-theme="dark"] .kf-quest-card h3 {
  color: #f3f6fb;
}

html[data-theme="dark"] .kf-quest-description {
  color: #b0bfd2;
}

html[data-theme="dark"] .kf-stat {
  background: rgba(7,17,31,.42);
  border-color: rgba(255,255,255,.075);
}

html[data-theme="dark"] .kf-stat strong {
  color: #eef3f9;
}

html[data-theme="dark"] .kf-stat small {
  color: #8799ae;
}

html[data-theme="dark"] .kf-coming-box {
  background: rgba(7,17,31,.42);
  border-color: rgba(255,255,255,.08);
  color: #9aabbe;
}

html[data-theme="dark"] .kf-start-button {
  background: #ff7a00;
  color: #07111f;
  box-shadow:
    0 10px 24px rgba(255,122,0,.18),
    0 0 0 1px rgba(255,255,255,.03) inset;
}

html[data-theme="dark"] .kf-start-button:hover {
  background: #ff8c2b;
}

html[data-theme="dark"] .kf-quests-footer {
  color: #667990;
}

html[data-theme="dark"] .kf-quests-footer span {
  color: #ff7a00;
}

/* Stronger anti-leakage for future inline/light additions */
html[data-theme="dark"] .kf-quests-page [style*="background: #fff"],
html[data-theme="dark"] .kf-quests-page [style*="background: #f"],
html[data-theme="dark"] .kf-quests-page [style*="background: rgba(255"] {
  background-color: #10243a !important;
}

@media (max-width: 700px) {
  html[data-theme="dark"] .kf-quests-page {
    background:
      radial-gradient(circle at 96% 1%, rgba(0,212,255,.11) 0%, rgba(0,212,255,0) 34%),
      radial-gradient(circle at 8% 88%, rgba(255,122,0,.08) 0%, rgba(255,122,0,0) 30%),
      #07111f;
  }
}

      `}</style>
    </main>
  );
}
function QuestCardView({
  quest,
  language,
  text,
  onStart,
}: {
  quest: QuestCard;
  language: Language;
  text: (typeof ui)[Language];
  onStart: () => void;
}) {
  return (
    <article
      style={{
        ...cardStyle,
        opacity: quest.available ? 1 : 0.92,
      }}
    >
      <div style={cardTopStyle}>
        <div style={iconStyle}>{quest.icon}</div>
        <div
          style={{
            ...statusStyle,
            background: quest.available ? "#ecfdf5" : "#f1f5f9",
            color: quest.available ? "#15803d" : "#64748b",
          }}
        >
          {quest.available ? text.available : text.comingSoon}
        </div>
      </div>

      <div style={categoryStyle}>{quest.category[language]}</div>
      <h3 style={cardTitleStyle}>{quest.title[language]}</h3>
      <p style={cardDescriptionStyle}>{quest.description[language]}</p>

      <div style={statsStyle}>
        <Stat icon="❓" value={`${quest.questions}`} label={text.questions} />
        <Stat icon="⭐" value={`${quest.xp}`} label={text.xp} />
      </div>

      {quest.available ? (
        <button type="button" onClick={onStart} style={primaryButtonStyle}>
          {text.start}
        </button>
      ) : (
        <div style={disabledButtonStyle}>{text.soonDescription}</div>
      )}
    </article>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div style={statStyle}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <strong style={{ color: "#0f172a", fontSize: "15px" }}>{value}</strong>
      <span style={{ color: "#64748b", fontSize: "13px" }}>{label}</span>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  color: "#0f172a",
  padding: "34px 20px 60px",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1120px",
  margin: "0 auto",
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "28px",
};

const backButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#475569",
  padding: 0,
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const languageControlStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const languageLabelStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: "13px",
  fontWeight: 700,
};

const languageSelectStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  borderRadius: "12px",
  padding: "9px 34px 9px 12px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
  outline: "none",
};

const heroStyle: React.CSSProperties = {
  background: "#0f172a",
  borderRadius: "28px",
  padding: "42px 40px",
  marginBottom: "42px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#ff7a00",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "1.5px",
  marginBottom: "12px",
};

const heroTitleStyle: React.CSSProperties = {
  color: "white",
  fontSize: "clamp(32px, 5vw, 52px)",
  lineHeight: 1.08,
  margin: 0,
  maxWidth: "760px",
};

const heroDescriptionStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "17px",
  lineHeight: 1.7,
  maxWidth: "700px",
  margin: "18px 0 0",
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "18px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const sectionEyebrowStyle: React.CSSProperties = {
  color: "#ff7a00",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "1.2px",
  marginBottom: "6px",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "30px",
  lineHeight: 1.2,
};

const countBadgeStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "white",
  color: "#475569",
  borderRadius: "999px",
  padding: "8px 13px",
  fontSize: "13px",
  fontWeight: 700,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 8px 25px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  minHeight: "370px",
};

const cardTopStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "18px",
};

const iconStyle: React.CSSProperties = {
  width: "56px",
  height: "56px",
  borderRadius: "17px",
  background: "#fff7ed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};

const statusStyle: React.CSSProperties = {
  borderRadius: "999px",
  padding: "7px 10px",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "0.7px",
  whiteSpace: "nowrap",
};

const categoryStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "7px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "22px",
  lineHeight: 1.25,
  margin: "0 0 10px",
  color: "#0f172a",
};

const cardDescriptionStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.65,
  margin: 0,
  flex: 1,
};

const statsStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  margin: "20px 0",
};

const statStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: "1px solid #f1f5f9",
  padding: "10px 11px",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: "14px",
  padding: "13px 16px",
  background: "#ff7a00",
  color: "white",
  fontWeight: 800,
  fontSize: "14px",
  cursor: "pointer",
};

const disabledButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  padding: "13px 14px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: "12px",
  lineHeight: 1.45,
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "13px",
  marginTop: "42px",
};
