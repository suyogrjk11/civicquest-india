"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

const topics: Record<
  Language,
  {
    key: string;
    title: string;
    description: string;
    icon: string;
    path: string;
  }[]
> = {
  en: [
    {
      key: "government",
      title: "Government & Governance",
      description:
        "Understand how government institutions work and how decisions are made.",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "Constitution & Democracy",
      description:
        "Learn the foundations of India's Constitution, rights and democratic institutions.",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "Elections & Civic Participation",
      description:
        "Understand elections, voting and the ways citizens participate in democracy.",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "Local Issues",
      description:
        "Learn how local civic problems are handled and how citizens can participate.",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "Environment",
      description:
        "Explore environmental issues, public responsibility and sustainable civic action.",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "Economy & Jobs",
      description:
        "Understand the economy, employment and issues that affect everyday life.",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "Education",
      description:
        "Learn how India's education system works and what citizens should know.",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "Healthcare",
      description:
        "Understand public healthcare, services and the role of citizens and institutions.",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],
  hi: [
    {
      key: "government",
      title: "सरकार और शासन व्यवस्था",
      description:
        "जानें कि सरकारी संस्थाएँ कैसे काम करती हैं और निर्णय कैसे लिए जाते हैं।",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "संविधान और लोकतंत्र",
      description:
        "भारत के संविधान, अधिकारों और लोकतांत्रिक संस्थाओं की बुनियाद समझें।",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "चुनाव और नागरिक भागीदारी",
      description:
        "चुनाव, मतदान और लोकतंत्र में नागरिकों की भागीदारी को समझें।",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "स्थानीय समस्याएँ",
      description:
        "जानें कि स्थानीय नागरिक समस्याएँ कैसे सुलझाई जाती हैं और नागरिक कैसे भाग ले सकते हैं।",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "पर्यावरण",
      description:
        "पर्यावरणीय समस्याओं, सार्वजनिक जिम्मेदारी और टिकाऊ नागरिक कार्रवाई को समझें।",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "अर्थव्यवस्था और रोजगार",
      description:
        "अर्थव्यवस्था, रोजगार और रोज़मर्रा की ज़िंदगी को प्रभावित करने वाले मुद्दों को समझें।",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "शिक्षा",
      description:
        "भारत की शिक्षा व्यवस्था और नागरिकों के लिए महत्वपूर्ण बातों के बारे में जानें।",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "स्वास्थ्य सेवा",
      description:
        "सार्वजनिक स्वास्थ्य सेवा, सुविधाओं और नागरिकों तथा संस्थाओं की भूमिका को समझें।",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],
  mr: [
    {
      key: "government",
      title: "सरकार आणि शासनव्यवस्था",
      description:
        "सरकारी संस्था कशा काम करतात आणि निर्णय कसे घेतले जातात हे समजून घ्या.",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "संविधान आणि लोकशाही",
      description:
        "भारताचे संविधान, अधिकार आणि लोकशाही संस्थांची मूलभूत माहिती जाणून घ्या.",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "निवडणुका आणि नागरिकांचा सहभाग",
      description:
        "निवडणुका, मतदान आणि लोकशाहीतील नागरिकांचा सहभाग समजून घ्या.",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "स्थानिक समस्या",
      description:
        "स्थानिक नागरी समस्या कशा हाताळल्या जातात आणि नागरिक कसे सहभागी होऊ शकतात हे जाणून घ्या.",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "पर्यावरण",
      description:
        "पर्यावरणीय समस्या, सार्वजनिक जबाबदारी आणि शाश्वत नागरी कृती समजून घ्या.",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "अर्थव्यवस्था आणि रोजगार",
      description:
        "अर्थव्यवस्था, रोजगार आणि दैनंदिन जीवनावर परिणाम करणारे मुद्दे समजून घ्या.",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "शिक्षण",
      description:
        "भारताची शिक्षण व्यवस्था आणि नागरिकांसाठी महत्त्वाच्या बाबी जाणून घ्या.",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "आरोग्य सेवा",
      description:
        "सार्वजनिक आरोग्य सेवा, सुविधा आणि नागरिक व संस्थांची भूमिका समजून घ्या.",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],
};

const ui: Record<
  Language,
  {
    back: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    learn: string;
    learnMore: string;
    questsTitle: string;
    questsText: string;
    questsButton: string;
    languageLabel: string;
  }
> = {
  en: {
    back: "← Dashboard",
    eyebrow: "LEARN ABOUT CIVIC LIFE",
    title: "Civic Learning",
    subtitle:
      "Build practical civic knowledge through simple guides on government, democracy, elections, local issues and public services.",
    learn: "Choose a topic",
    learnMore: "Learn more →",
    questsTitle: "Ready to test what you learned?",
    questsText:
      "Take an interactive Civic Quest after exploring the topic.",
    questsButton: "Explore Civic Quests →",
    languageLabel: "Language",
  },
  hi: {
    back: "← डैशबोर्ड",
    eyebrow: "नागरिक जीवन के बारे में जानें",
    title: "नागरिक शिक्षा",
    subtitle:
      "सरकार, लोकतंत्र, चुनाव, स्थानीय समस्याओं और सार्वजनिक सेवाओं के बारे में सरल जानकारी के साथ अपना नागरिक ज्ञान बढ़ाएँ।",
    learn: "एक विषय चुनें",
    learnMore: "और जानें →",
    questsTitle: "जो सीखा उसे परखना चाहते हैं?",
    questsText:
      "विषय पढ़ने के बाद एक इंटरैक्टिव Civic Quest लें।",
    questsButton: "Civic Quests देखें →",
    languageLabel: "भाषा",
  },
  mr: {
    back: "← डॅशबोर्ड",
    eyebrow: "नागरी जीवनाबद्दल जाणून घ्या",
    title: "नागरिक शिक्षण",
    subtitle:
      "सरकार, लोकशाही, निवडणुका, स्थानिक समस्या आणि सार्वजनिक सेवांबद्दल सोप्या मार्गदर्शकांमधून तुमचे नागरिक ज्ञान वाढवा.",
    learn: "एक विषय निवडा",
    learnMore: "अधिक जाणून घ्या →",
    questsTitle: "तुम्ही शिकलेले तपासायचे आहे?",
    questsText:
      "विषय पाहिल्यानंतर इंटरॅक्टिव्ह Civic Quest घ्या.",
    questsButton: "Civic Quests पहा →",
    languageLabel: "भाषा",
  },
};

export default function CivicLearningPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const text = ui[language];
  const list = topics[language];


  return (
    <main className="kf-learning-page">
      <div className="kf-learning-shell">

        {/* TOP BAR */}
        <header className="kf-learning-topbar">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="kf-back-button"
          >
            <span>←</span>
            {text.back.replace("← ", "")}
          </button>

          <div className="kf-brand-lockup">
            <div className="kf-brand-box">K</div>

            <div>
              <div className="kf-brand-name">
                Krut<span>Bharat</span>
              </div>

              <div className="kf-brand-caption">
                CIVIC LEARNING
              </div>
            </div>
          </div>

          <label className="kf-language">
            <span>{text.languageLabel}</span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as Language
                )
              }
              aria-label={text.languageLabel}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        {/* HERO */}
        <section className="kf-learning-hero">
          <div className="kf-hero-orb kf-hero-blue" />
          <div className="kf-hero-orb kf-hero-peach" />

          <div className="kf-hero-content">
            <div className="kf-eyebrow">
              {text.eyebrow}
            </div>

            <div className="kf-hero-grid">
              <div className="kf-hero-copy">
                <h1>
                  📚 {text.title}
                </h1>

                <p>
                  {text.subtitle}
                </p>
              </div>

              <div className="kf-hero-badge">
                <div className="kf-hero-badge-icon">
                  🧭
                </div>

                <div>
                  <strong>
                    {list.length}
                  </strong>
                  <span>
                    {language === "en"
                      ? "topics"
                      : language === "hi"
                        ? "विषय"
                        : "विषय"}
                  </span>
                </div>
              </div>
            </div>

            <div className="kf-hero-note">
              <span>✨</span>
              <span>
                {language === "en"
                  ? "Start with one topic and build your understanding step by step."
                  : language === "hi"
                    ? "एक विषय से शुरू करें और अपनी समझ को धीरे-धीरे बढ़ाएँ।"
                    : "एका विषयापासून सुरुवात करा आणि तुमची समज टप्प्याटप्प्याने वाढवा."}
              </span>
            </div>
          </div>
        </section>

        {/* TOPICS */}
        <section className="kf-topic-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                EXPLORE CIVIC LIFE
              </div>

              <h2>{text.learn}</h2>

              <p>
                {language === "en"
                  ? "Choose a topic to explore a simple, practical guide."
                  : language === "hi"
                    ? "सरल और व्यावहारिक जानकारी के लिए एक विषय चुनें।"
                    : "सोप्या आणि उपयुक्त माहितीसाठी एक विषय निवडा."}
              </p>
            </div>

            <div className="kf-count-pill">
              {list.length}{" "}
              {language === "en"
                ? "topics"
                : language === "hi"
                  ? "विषय"
                  : "विषय"}
            </div>
          </div>

          <div className="kf-topic-grid">
            {list.map((topic, index) => (
              <button
                key={topic.key}
                type="button"
                onClick={() => router.push(topic.path)}
                className={[
                  "kf-topic-card",
                  index % 4 === 0
                    ? "kf-topic-blue"
                    : index % 4 === 1
                      ? "kf-topic-peach"
                      : index % 4 === 2
                        ? "kf-topic-green"
                        : "kf-topic-lavender",
                ].join(" ")}
              >
                <div className="kf-topic-top">
                  <div className="kf-topic-icon">
                    {topic.icon}
                  </div>

                  <span className="kf-topic-arrow">
                    →
                  </span>
                </div>

                <div className="kf-topic-key">
                  {topic.key.replace("-", " ")}
                </div>

                <h3>
                  {topic.title}
                </h3>

                <p>
                  {topic.description}
                </p>

                <div className="kf-learn-more">
                  {text.learnMore}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* QUEST CTA */}
        <section className="kf-quest-cta">
          <div className="kf-quest-cta-orb" />

          <div className="kf-quest-cta-content">
            <div className="kf-cta-kicker">
              KEEP GOING
            </div>

            <div className="kf-cta-grid">
              <div>
                <h2>
                  🎯 {text.questsTitle}
                </h2>

                <p>
                  {text.questsText}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/civic-quests")
                }
                className="kf-cta-button"
              >
                {text.questsButton}
              </button>
            </div>
          </div>
        </section>

        <footer className="kf-learning-footer">
          Krut<span>Bharat</span> · {text.title}
        </footer>
      </div>

      <style>{`
        .kf-learning-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #586a78;
          --kf-muted: #7d8991;
          --kf-orange: #ff7a00;
          --kf-blue: #eaf3f8;
          --kf-blue-line: #d4e4ed;
          --kf-peach: #fff0df;
          --kf-peach-line: #eed9c0;
          --kf-green: #eef6e7;
          --kf-green-line: #d5e5c9;
          --kf-lavender: #f4eff9;
          --kf-lavender-line: #dfd4ea;
          --kf-line: #ddd7ce;

          min-height: 100vh;
          padding: 20px 16px 74px;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
            radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
            radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          color: var(--kf-body);
          font-family: var(--font-body);
        }

        .kf-learning-page *,
        .kf-learning-page *::before,
        .kf-learning-page *::after {
          box-sizing: border-box;
        }

        .kf-learning-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .kf-learning-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          min-height: 84px;
          padding: 10px 14px;
          margin-bottom: 28px;
          border: 1px solid rgba(16,27,43,.10);
          border-radius: 32px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 14px 36px rgba(16,27,43,.07);
          backdrop-filter: blur(16px);
        }

        .kf-back-button {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
          box-shadow: 0 5px 18px rgba(16,32,51,.035);
          cursor: pointer;
        }

        .kf-back-button span {
          color: var(--kf-orange);
          font-size: 20px;
          line-height: 1;
          font-weight: 500;
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
        .kf-learning-footer span {
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
          color: #52616f;
          font-size: 14px;
          font-weight: 800;
        }

        .kf-language select {
          appearance: none;
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
          border-color: #e5ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-learning-hero {
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
          background: rgba(208,227,239,.56);
        }

        .kf-hero-peach {
          width: 170px;
          height: 105px;
          left: -48px;
          bottom: -54px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.45);
          transform: rotate(8deg);
        }

        .kf-hero-content {
          position: relative;
          z-index: 1;
        }

        .kf-eyebrow,
        .kf-section-kicker,
        .kf-cta-kicker {
          color: #8e755f;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-hero-grid {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-top: 9px;
        }

        .kf-hero-copy {
          max-width: 790px;
        }

        .kf-hero-copy h1 {
          margin: 0;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(46px, 6vw, 66px);
          line-height: .96;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-hero-copy p {
          max-width: 770px;
          margin: 13px 0 0;
          color: #586b79;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-hero-badge {
          min-width: 132px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 14px;
          border-radius: 22px;
          background: var(--kf-lavender);
          border: 1px solid var(--kf-lavender-line);
        }

        .kf-hero-badge-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #fffdf9;
          border: 1px solid #e1d8eb;
          font-size: 19px;
        }

        .kf-hero-badge strong {
          display: block;
          color: #304457;
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-hero-badge span {
          display: block;
          margin-top: 3px;
          color: #7c6d91;
          font-size: 8px;
          font-weight: 900;
        }

        .kf-hero-note {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 21px;
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255,253,249,.76);
          border: 1px solid rgba(16,27,43,.08);
          color: #667681;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-topic-section {
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
          color: #7b6c8d;
        }

        .kf-section-heading h2 {
          margin: 5px 0 5px;
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
          background: var(--kf-blue);
          border: 1px solid var(--kf-blue-line);
          color: #5a7a91;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .kf-topic-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
        }

        .kf-topic-card {
          min-height: 275px;
          display: flex;
          flex-direction: column;
          padding: 19px;
          border: 1px solid;
          border-radius: 25px;
          text-align: left;
          cursor: pointer;
          font-family: var(--font-body);
          box-shadow: 0 10px 26px rgba(16,27,43,.045);
          transition: transform .17s ease, box-shadow .17s ease;
        }

        .kf-topic-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(16,27,43,.075);
        }

        .kf-topic-blue {
          background: var(--kf-blue);
          border-color: var(--kf-blue-line);
        }

        .kf-topic-peach {
          background: var(--kf-peach);
          border-color: var(--kf-peach-line);
        }

        .kf-topic-green {
          background: var(--kf-green);
          border-color: var(--kf-green-line);
        }

        .kf-topic-lavender {
          background: var(--kf-lavender);
          border-color: var(--kf-lavender-line);
        }

        .kf-topic-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .kf-topic-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: rgba(255,253,249,.82);
          border: 1px solid rgba(16,27,43,.07);
          font-size: 28px;
        }

        .kf-topic-arrow {
          color: #71818c;
          font-size: 18px;
          font-weight: 900;
        }

        .kf-topic-key {
          margin-top: 17px;
          color: #859097;
          font-size: 8px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .kf-topic-card h3 {
          margin: 7px 0 8px;
          color: #2e4356;
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1.06;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .kf-topic-card p {
          margin: 0;
          color: #63737e;
          font-size: 11px;
          line-height: 1.68;
        }

        .kf-learn-more {
          margin-top: auto;
          padding-top: 15px;
          color: #50748b;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-quest-cta {
          position: relative;
          overflow: hidden;
          margin-top: 18px;
          padding: 23px 24px;
          border-radius: 27px;
          border: 1px solid #e4d9c9;
          background:
            linear-gradient(135deg, #fff2df 0%, #fffdf9 55%, #eef5f9 100%);
          box-shadow: 0 12px 32px rgba(16,27,43,.045);
        }

        .kf-quest-cta-orb {
          position: absolute;
          right: -55px;
          top: -65px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(216,232,241,.47);
        }

        .kf-quest-cta-content {
          position: relative;
          z-index: 1;
        }

        .kf-cta-kicker {
          color: #9b7656;
        }

        .kf-cta-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-top: 4px;
        }

        .kf-cta-grid h2 {
          margin: 0 0 7px;
          color: #2d4255;
          font-family: var(--font-display);
          font-size: 27px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-cta-grid p {
          margin: 0;
          color: #667681;
          font-size: 12px;
          line-height: 1.6;
        }

        .kf-cta-button {
          flex-shrink: 0;
          border: 0;
          border-radius: 999px;
          background: var(--kf-orange);
          color: #fff;
          padding: 13px 17px;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(255,122,0,.16);
        }

        .kf-learning-footer {
          padding: 17px 3px 0;
          color: #899297;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        @media (max-width: 1000px) {
          .kf-topic-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .kf-hero-grid {
            flex-direction: column;
            align-items: flex-start;
          }

          .kf-hero-badge {
            align-self: flex-start;
          }
        }

        @media (max-width: 700px) {
          .kf-learning-page {
            padding: 14px 11px 56px;
          }

          .kf-learning-topbar {
            grid-template-columns: 1fr auto;
          }

          .kf-brand-lockup {
            grid-column: 1 / -1;
            grid-row: 1;
            justify-self: center;
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
            display: block;
          }

          .kf-language span {
            display: none;
          }

          .kf-brand-box {
            width: 50px;
            height: 50px;
            border-radius: 15px;
            font-size: 28px;
          }

          .kf-brand-name {
            font-size: 25px;
          }

          .kf-brand-caption {
            font-size: 8px;
            letter-spacing: .20em;
          }

          .kf-language select {
            min-width: 108px;
            padding: 11px 14px;
          }

          .kf-learning-hero {
            padding: 24px 20px;
            border-radius: 28px;
          }

          .kf-hero-copy h1 {
            font-size: 45px;
          }

          .kf-hero-copy p {
            font-size: 14px;
          }

          .kf-topic-section {
            padding: 21px 18px;
            border-radius: 25px;
          }

          .kf-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-topic-grid {
            grid-template-columns: 1fr;
          }

          .kf-topic-card {
            min-height: 230px;
          }

          .kf-quest-cta {
            padding: 20px;
          }

          .kf-cta-grid {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-cta-button {
            width: 100%;
          }
        }


        /* DARK MODE — Explore / Civic Learning */
        html[data-theme="dark"] .kf-learning-page {
          --kf-ivory: #07111f;
          --kf-white: #0d1d31;
          --kf-navy: #f5f7fb;
          --kf-ink: #e8edf5;
          --kf-body: #b8c4d9;
          --kf-muted: #8291aa;
          --kf-line: #1f2e47;
          background:
            radial-gradient(circle at 92% 2%, rgba(42,76,108,.28) 0%, rgba(42,76,108,0) 27%),
            radial-gradient(circle at 4% 32%, rgba(36,78,106,.18) 0%, rgba(36,78,106,0) 25%),
            radial-gradient(circle at 92% 94%, rgba(132,72,32,.16) 0%, rgba(132,72,32,0) 26%),
            #07111f;
          color: #b8c4d9;
        }

        html[data-theme="dark"] .kf-learning-topbar {
          border-color: #1f2e47;
          background: rgba(13,29,49,.94);
          box-shadow: 0 18px 48px rgba(0,0,0,.25);
        }

        html[data-theme="dark"] .kf-back-button,
        html[data-theme="dark"] .kf-language select {
          border-color: #2a3c56;
          background: #10243a;
          color: #dce5f2;
        }

        html[data-theme="dark"] .kf-back-button span {
          color: #ff8a24;
        }

        html[data-theme="dark"] .kf-brand-name,
        html[data-theme="dark"] .kf-brand-caption {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-brand-box {
          background: #ff7a00;
          color: #102033;
        }

        html[data-theme="dark"] .kf-learning-hero {
          border-color: #1f2e47;
          background:
            radial-gradient(circle at 94% 0%, rgba(48,84,114,.34) 0%, rgba(48,84,114,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(111,63,31,.22) 0%, rgba(111,63,31,0) 35%),
            #10243a;
          box-shadow: 0 20px 55px rgba(0,0,0,.24);
        }

        html[data-theme="dark"] .kf-eyebrow,
        html[data-theme="dark"] .kf-cta-kicker {
          color: #ffad68;
        }

        html[data-theme="dark"] .kf-hero-copy h1,
        html[data-theme="dark"] .kf-section-heading h2,
        html[data-theme="dark"] .kf-cta-grid h2 {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-hero-copy p,
        html[data-theme="dark"] .kf-section-heading p,
        html[data-theme="dark"] .kf-cta-grid p,
        html[data-theme="dark"] .kf-topic-card p {
          color: #b8c4d9;
        }

        html[data-theme="dark"] .kf-hero-badge {
          background: #30251b;
          border-color: #5a3d27;
        }

        html[data-theme="dark"] .kf-hero-badge-icon,
        html[data-theme="dark"] .kf-topic-icon {
          background: #f8f1e6;
          border-color: #eadfce;
        }

        html[data-theme="dark"] .kf-hero-badge strong {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-hero-badge span {
          color: #d7b996;
        }

        html[data-theme="dark"] .kf-hero-note {
          background: rgba(16,36,58,.82);
          border-color: #2a3c56;
          color: #aebbd0;
        }

        html[data-theme="dark"] .kf-topic-section {
          border-color: #1f2e47;
          background: #0d1d31;
          box-shadow: 0 18px 48px rgba(0,0,0,.20);
        }

        html[data-theme="dark"] .kf-section-kicker {
          color: #a9c9df;
        }

        html[data-theme="dark"] .kf-count-pill {
          background: #10263a;
          border-color: #29445d;
          color: #9fc4df;
        }

        html[data-theme="dark"] .kf-topic-blue {
          background: #10263a;
          border-color: #29445d;
        }

        html[data-theme="dark"] .kf-topic-peach {
          background: #30251b;
          border-color: #5a3d27;
        }

        html[data-theme="dark"] .kf-topic-green {
          background: #182c25;
          border-color: #315040;
        }

        html[data-theme="dark"] .kf-topic-lavender {
          background: #27233a;
          border-color: #40385d;
        }

        html[data-theme="dark"] .kf-topic-arrow,
        html[data-theme="dark"] .kf-topic-key,
        html[data-theme="dark"] .kf-learn-more {
          color: #9fb0c5;
        }

        html[data-theme="dark"] .kf-topic-card h3 {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-topic-icon {
          border-color: rgba(255,255,255,.18);
        }

        html[data-theme="dark"] .kf-quest-cta {
          border-color: #3b3a35;
          background: linear-gradient(135deg, #30251b 0%, #10243a 56%, #182c25 100%);
          box-shadow: 0 16px 40px rgba(0,0,0,.22);
        }

        html[data-theme="dark"] .kf-learning-footer {
          color: #718198;
        }


        /*
         * Dark-mode navbar glow — matched to Report Issue.
         * Visual treatment only: existing navbar dimensions, content,
         * padding, spacing and layout remain unchanged.
         */
        html[data-theme="dark"] .kf-learning-topbar {
          position: relative !important;
          border: 1px solid transparent !important;
          background: rgba(4,10,20,.62) !important;
          background-image: none !important;
          box-shadow:
            -10px 0 24px -8px rgba(0,212,255,.30),
             10px 0 24px -8px rgba(255,140,26,.30),
             0 10px 30px rgba(0,0,0,.34) !important;
          backdrop-filter: blur(14px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
          isolation: isolate !important;
        }

        html[data-theme="dark"] .kf-learning-topbar::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          border-radius: inherit !important;
          padding: 1.25px !important;
          background: linear-gradient(
            90deg,
            #00d4ff 0%,
            rgba(0,174,255,.52) 16%,
            rgba(90,120,150,.28) 43%,
            rgba(120,120,130,.22) 57%,
            rgba(255,150,40,.52) 84%,
            #ff8c1a 100%
          ) !important;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0) !important;
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0) !important;
          -webkit-mask-composite: xor !important;
          mask-composite: exclude !important;
          pointer-events: none !important;
          z-index: 0 !important;
        }

        html[data-theme="dark"] .kf-learning-topbar::after {
          content: "" !important;
          position: absolute !important;
          inset: -5px !important;
          border-radius: 29px !important;
          background: linear-gradient(
            90deg,
            #00d4ff 0%,
            rgba(0,150,255,.32) 18%,
            transparent 36%,
            transparent 64%,
            rgba(255,140,26,.34) 82%,
            #ff8c1a 100%
          ) !important;
          filter: blur(10px) !important;
          opacity: .34 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }

        html[data-theme="dark"] .kf-learning-topbar > * {
          position: relative !important;
          z-index: 2 !important;
        }

      `}</style>
    </main>
  );
}