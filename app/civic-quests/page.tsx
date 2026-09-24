"use client";

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
  }
> = {
  en: {
    eyebrow: "🎯 KARMAFACIE",
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
  },
  hi: {
    eyebrow: "🎯 KARMAFACIE",
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
  },
  mr: {
    eyebrow: "🎯 KARMAFACIE",
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

export default function KarmaFaciesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = ui[language];

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={backButtonStyle}
        >
          {text.backDashboard}
        </button>

        <header style={heroStyle}>
          <div style={eyebrowStyle}>{text.eyebrow}</div>
          <h1 style={heroTitleStyle}>{text.title}</h1>
          <p style={heroDescriptionStyle}>{text.description}</p>
        </header>

        <section>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionEyebrowStyle}>KARMAFACIE</div>
              <h2 style={sectionTitleStyle}>{text.library}</h2>
            </div>
            <div style={countBadgeStyle}>{quests.length} quests</div>
          </div>

          <div style={gridStyle}>
            {quests.map((quest) => (
              <QuestCardView
                key={quest.id}
                quest={quest}
                language={language}
                text={text}
                onStart={() => {
                  if (quest.available && quest.path) {
                    router.push(quest.path);
                  }
                }}
              />
            ))}
          </div>
        </section>

        <footer style={footerStyle}>{text.footer}</footer>
      </div>
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

const backButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#475569",
  padding: 0,
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: "28px",
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
