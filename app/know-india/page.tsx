"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Language } from "@/lib/i18n";
import IndiaMap from "@/components/IndiaMap";
import { indiaStates } from "@/lib/india-state-data";

const content: Record<
  Language,
  {
    back: string;
    label: string;
    title: string;
    description: string;
    mapTitle: string;
    mapDescription: string;
    states: string;
    unionTerritories: string;
    nextLabel: string;
    nextTitle: string;
    nextDescription: string;
  }
> = {
  en: {
    back: "← Dashboard",
    label: "KARMAFACIE · KNOW INDIA",
    title: "Discover India.",
    description:
      "Explore India's states, Union Territories, geography, institutions, history and civic systems through an interactive experience.",
    mapTitle: "Explore the map",
    mapDescription:
      "Hover over a state to discover its capital. Click a state to keep it selected.",
    states: "28 States",
    unionTerritories: "8 Union Territories",
    nextLabel: "EXPLORE INDIA",
    nextTitle: "Your India journey starts here.",
    nextDescription:
      "The map is the first part of Know India. More interactive experiences covering geography, history, governance, national symbols and the Constitution will be added here.",
  },
  hi: {
    back: "← डैशबोर्ड",
    label: "KARMAFACIE · भारत जानें",
    title: "भारत को जानें।",
    description:
      "भारत के राज्यों, केंद्र शासित प्रदेशों, भूगोल, संस्थाओं, इतिहास और नागरिक व्यवस्थाओं को इंटरैक्टिव अनुभव के माध्यम से जानें।",
    mapTitle: "मानचित्र को एक्सप्लोर करें",
    mapDescription:
      "किसी राज्य पर कर्सर ले जाकर उसकी राजधानी जानें। राज्य को चयनित रखने के लिए उस पर क्लिक करें।",
    states: "28 राज्य",
    unionTerritories: "8 केंद्र शासित प्रदेश",
    nextLabel: "भारत को एक्सप्लोर करें",
    nextTitle: "भारत की आपकी यात्रा यहीं से शुरू होती है।",
    nextDescription:
      "यह मानचित्र भारत जानें का पहला भाग है। इसके बाद भूगोल, इतिहास, शासन व्यवस्था, राष्ट्रीय प्रतीकों और संविधान से जुड़े और भी इंटरैक्टिव अनुभव यहाँ जोड़े जाएँगे।",
  },
  mr: {
    back: "← डॅशबोर्ड",
    label: "KARMAFACIE · भारत जाणून घ्या",
    title: "भारताचा शोध घ्या.",
    description:
      "भारताची राज्ये, केंद्रशासित प्रदेश, भूगोल, संस्था, इतिहास आणि नागरी व्यवस्था इंटरॅक्टिव्ह अनुभवातून जाणून घ्या.",
    mapTitle: "नकाशा एक्सप्लोर करा",
    mapDescription:
      "एखाद्या राज्यावर कर्सर नेऊन त्याची राजधानी पाहा. राज्य निवडून ठेवण्यासाठी त्यावर क्लिक करा.",
    states: "28 राज्ये",
    unionTerritories: "8 केंद्रशासित प्रदेश",
    nextLabel: "भारत एक्सप्लोर करा",
    nextTitle: "भारताची तुमची वाटचाल इथून सुरू होते.",
    nextDescription:
      "हा नकाशा भारत जाणून घ्या याचा पहिला भाग आहे. यानंतर भूगोल, इतिहास, शासनव्यवस्था, राष्ट्रीय चिन्हे आणि संविधानाशी संबंधित आणखी इंटरॅक्टिव्ह अनुभव येथे जोडले जातील.",
  },
};

function EntityList({
  type,
  language,
  onNavigate,
}: {
  type: "State" | "Union Territory";
  language: Language;
  onNavigate: (slug: string) => void;
}) {
  const items = indiaStates.filter((item) => item.type === type);

  return (
    <div className="kf-know-india-entity-list" style={entityListPanelStyle}>
      <div className="kf-know-india-entity-list-header" style={entityListHeaderStyle}>
        <span>{type === "State" ? "🇮🇳" : "🏛️"}</span>
        <span>{type === "State" ? (language === "hi" ? "राज्य" : language === "mr" ? "राज्ये" : "States") : language === "hi" ? "केंद्र शासित प्रदेश" : language === "mr" ? "केंद्रशासित प्रदेश" : "Union Territories"}</span>
        <span style={entityListCountStyle}>{items.length}</span>
      </div>

      <div style={entityListGridStyle}>
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onNavigate(item.slug)}
            className="kf-know-india-entity-item"
            style={entityListItemStyle}
          >
            <span style={entityListItemNameStyle}>
              {item.localizedName?.[language] || item.name}
            </span>
            <span style={entityListItemCapitalStyle}>
              {item.localizedCapital?.[language] || item.capital}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KnowIndiaPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = content[language];
  const [activeList, setActiveList] = useState<"states" | "uts" | null>(null);

  return (
    <main className={`kf-know-india-page kf-know-india-${language}`} style={pageStyle}>
      <div style={containerStyle}>
        {/* TOP NAVIGATION / KARMAFACIE HEADER */}
        <header className="kf-know-india-topbar" style={topNavStyle}>
          <div style={headerSideStyle}>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="kf-know-india-back"
              style={backButtonStyle}
            >
              <span style={backArrowStyle}>←</span>
              <span>{text.back.replace("← ", "")}</span>
            </button>
          </div>

          <div className="kf-know-india-brand" style={brandStyle} aria-label="KarmaFacie Know India">
            <div style={brandMarkStyle}>K</div>
            <div style={brandTextWrapStyle}>
              <div style={brandNameStyle}>
                <span>Karma</span><span style={brandAccentStyle}>Facie</span>
              </div>
              <div style={brandSubtitleStyle}>KNOW INDIA</div>
            </div>
          </div>

          <div style={{ ...headerSideStyle, justifyContent: "flex-end" }}>
            <div className="kf-know-india-language" style={languageControlStyle}>
              <span style={languageLabelStyle}>Language</span>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="kf-know-india-hero" style={heroStyle}>
          <div style={eyebrowStyle}>{text.label}</div>

          <div className="kf-know-india-flag" style={flagWrapStyle} aria-hidden="true">
            🇮🇳
          </div>

          <h1 style={heroTitleStyle}>
            {language === "en" ? (
              <><span className="kf-know-india-title-white">Discover </span><span style={heroTitleAccentStyle}>India</span><span className="kf-know-india-title-white">.</span></>
            ) : language === "hi" ? (
              <><span style={heroTitleAccentStyle}>भारत</span><span className="kf-know-india-title-white"> को जानें।</span></>
            ) : (
              <><span style={heroTitleAccentStyle}>भारत</span><span className="kf-know-india-title-white">ाचा शोध घ्या।</span></>
            )}
          </h1>

          <p style={heroDescriptionStyle}>{text.description}</p>
        </section>

        {/* MAP HEADING */}
        <section className="kf-know-india-map-section" style={mapSectionStyle}>
          <div style={mapHeaderStyle}>
            <div style={{ maxWidth: 720 }}>
              <div style={sectionEyebrowStyle}>{text.label}</div>
              <h2 className="kf-know-india-map-title-main" style={mapTitleStyle}>{text.mapTitle}</h2>
              <p style={mapDescriptionStyle}>{text.mapDescription}</p>
            </div>

            <div style={statsRowStyle}>
              <div
                style={statMenuWrapperStyle}
                onMouseEnter={() => setActiveList("states")}
                onMouseLeave={() => setActiveList(null)}
              >
                <button
                  type="button"
                  onFocus={() => setActiveList("states")}
                  onBlur={() => setActiveList(null)}
                  onClick={() => setActiveList(activeList === "states" ? null : "states")}
                  className="kf-know-india-states-pill"
                  style={{ ...statPillStyle, ...bluePillStyle, ...activePillButtonStyle }}
                  aria-expanded={activeList === "states"}
                >
                  <strong>{text.states.split(" ")[0]}</strong>
                  <span>{text.states.split(" ").slice(1).join(" ")}</span>
                  <span style={pillChevronStyle}>⌄</span>
                </button>

                <div
                  style={{
                    ...listPopoverBaseStyle,
                    ...(activeList === "states" ? listPopoverOpenStyle : listPopoverClosedStyle),
                  }}
                >
                  <EntityList
                    type="State"
                    language={language}
                    onNavigate={(slug) => router.push(`/know-india/state/${slug}`)}
                  />
                </div>
              </div>

              <div
                style={statMenuWrapperStyle}
                onMouseEnter={() => setActiveList("uts")}
                onMouseLeave={() => setActiveList(null)}
              >
                <button
                  type="button"
                  onFocus={() => setActiveList("uts")}
                  onBlur={() => setActiveList(null)}
                  onClick={() => setActiveList(activeList === "uts" ? null : "uts")}
                  className="kf-know-india-uts-pill"
                  style={{ ...statPillStyle, ...orangePillStyle, ...activePillButtonStyle }}
                  aria-expanded={activeList === "uts"}
                >
                  <strong>{text.unionTerritories.split(" ")[0]}</strong>
                  <span>{text.unionTerritories.split(" ").slice(1).join(" ")}</span>
                  <span style={pillChevronStyle}>⌄</span>
                </button>

                <div
                  style={{
                    ...listPopoverBaseStyle,
                    right: 0,
                    left: "auto",
                    ...(activeList === "uts" ? listPopoverOpenStyle : listPopoverClosedStyle),
                  }}
                >
                  <EntityList
                    type="Union Territory"
                    language={language}
                    onNavigate={(slug) => router.push(`/know-india/state/${slug}`)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* INDIA MAP — existing interactive component unchanged */}
          <div className="kf-know-india-map-card" style={mapCardStyle}>
            <IndiaMap language={language} />
          </div>
        </section>

        {/* FUTURE CONTENT */}
        <section className="kf-know-india-future-card" style={futureCardStyle}>
          <div style={futureAccentStyle} />
          <div style={futureContentStyle}>
            <div style={sectionEyebrowStyle}>{text.nextLabel}</div>
            <h2 className="kf-know-india-future-title" style={futureTitleStyle}>{text.nextTitle}</h2>
            <p style={futureDescriptionStyle}>{text.nextDescription}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 7% 4%, rgba(255,122,0,0.07), transparent 23%), radial-gradient(circle at 92% 16%, rgba(171,204,229,0.14), transparent 28%), #f8f3ea",
  color: "#102033",
  padding: "42px 20px 80px",
  fontFamily: "'Quicksand', sans-serif",
};

const containerStyle = {
  maxWidth: "1120px",
  margin: "0 auto",
};

const topNavStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 18,
  minHeight: 84,
  padding: "10px 14px",
  marginBottom: 42,
  background: "rgba(255,255,255,0.94)",
  border: "1px solid rgba(16,32,51,0.12)",
  borderRadius: 32,
  boxShadow: "0 14px 36px rgba(16,32,51,0.07)",
  backdropFilter: "blur(16px)",
};

const headerSideStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: 0,
};

const backButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.14)",
  color: "#536579",
  cursor: "pointer",
  padding: "11px 17px",
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Quicksand', sans-serif",
  boxShadow: "0 4px 14px rgba(16,32,51,0.04)",
};

const backArrowStyle = {
  color: "#ff7a00",
  fontSize: 20,
  lineHeight: 1,
  fontWeight: 500,
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  whiteSpace: "nowrap" as const,
};

const brandMarkStyle = {
  width: 56,
  height: 56,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ff7a00",
  color: "#102033",
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 31,
  lineHeight: 1,
  fontWeight: 800,
  boxShadow: "0 8px 18px rgba(255,122,0,0.18)",
};

const brandTextWrapStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  justifyContent: "center",
};

const brandNameStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 29,
  lineHeight: 0.95,
  fontWeight: 800,
  letterSpacing: "-0.8px",
  color: "#102033",
};

const brandAccentStyle = {
  color: "#ff7a00",
};

const brandSubtitleStyle = {
  marginTop: 5,
  color: "#102033",
  fontSize: 9,
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "2.4px",
};

const languageControlStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
};

const languageLabelStyle = {
  color: "#536579",
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "nowrap" as const,
};

const heroStyle = {
  textAlign: "center" as const,
  maxWidth: 850,
  margin: "0 auto 56px",
};

const eyebrowStyle = {
  color: "#ff7a00",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "1.5px",
  marginBottom: 10,
};

const flagWrapStyle = {
  width: 68,
  height: 68,
  margin: "18px auto 14px",
  borderRadius: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.07)",
  boxShadow: "0 10px 28px rgba(16,32,51,0.06)",
  fontSize: 38,
};

const heroTitleAccentStyle = {
  color: "#ff7a00",
};

const heroTitleStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: "clamp(42px, 6vw, 58px)",
  lineHeight: 1.04,
  fontWeight: 700,
  color: "#102033",
  margin: "0 0 14px",
};

const heroDescriptionStyle = {
  color: "#718096",
  fontSize: 16,
  lineHeight: 1.75,
  maxWidth: 760,
  margin: "0 auto",
  fontWeight: 500,
};

const mapSectionStyle = {
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.08)",
  borderRadius: 28,
  padding: 26,
  boxShadow: "0 12px 32px rgba(16,32,51,0.06)",
};

const mapHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 24,
  flexWrap: "wrap" as const,
  marginBottom: 22,
};

const sectionEyebrowStyle = {
  color: "#ff7a00",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "1.3px",
  textTransform: "uppercase" as const,
};

const mapTitleStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 30,
  lineHeight: 1.1,
  fontWeight: 600,
  color: "#102033",
  margin: "6px 0 7px",
};

const mapDescriptionStyle = {
  color: "#718096",
  margin: 0,
  lineHeight: 1.65,
  fontSize: 14,
  fontWeight: 500,
};

const statMenuWrapperStyle = {
  position: "relative" as const,
  zIndex: 40,
};

const activePillButtonStyle = {
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  transition: "transform 180ms ease, box-shadow 180ms ease",
};

const pillChevronStyle = {
  fontSize: 14,
  lineHeight: 1,
  marginLeft: 2,
  opacity: 0.7,
};

const listPopoverBaseStyle = {
  position: "absolute" as const,
  top: "calc(100% + 10px)",
  left: 0,
  width: "min(430px, 82vw)",
  transformOrigin: "top left",
  transition: "opacity 220ms ease, transform 220ms ease, max-height 260ms ease",
  overflow: "hidden",
  pointerEvents: "none" as const,
};

const listPopoverOpenStyle = {
  opacity: 1,
  transform: "translateY(0)",
  maxHeight: 430,
  pointerEvents: "auto" as const,
};

const listPopoverClosedStyle = {
  opacity: 0,
  transform: "translateY(-8px)",
  maxHeight: 0,
};

const entityListPanelStyle = {
  background: "rgba(255,255,255,0.98)",
  border: "1px solid #dfe7ee",
  borderRadius: 20,
  padding: 14,
  boxShadow: "0 20px 55px rgba(16,32,51,0.16)",
  backdropFilter: "blur(14px)",
};

const entityListHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "5px 6px 12px",
  color: "#102033",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.4px",
  borderBottom: "1px solid #edf1f4",
};

const entityListCountStyle = {
  marginLeft: "auto",
  minWidth: 26,
  height: 26,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  background: "#edf5fb",
  color: "#4f718e",
  fontSize: 11,
};

const entityListGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 7,
  marginTop: 10,
  maxHeight: 350,
  overflowY: "auto" as const,
  paddingRight: 2,
};

const entityListItemStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  gap: 2,
  width: "100%",
  padding: "9px 10px",
  borderRadius: 12,
  border: "1px solid #e9eef3",
  background: "#f8fafc",
  cursor: "pointer",
  textAlign: "left" as const,
  fontFamily: "'Quicksand', sans-serif",
};

const entityListItemNameStyle = {
  color: "#102033",
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.25,
};

const entityListItemCapitalStyle = {
  color: "#8290a0",
  fontSize: 10,
  fontWeight: 600,
  lineHeight: 1.25,
};

const statsRowStyle = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap" as const,
};

const statPillStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 13px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap" as const,
};

const bluePillStyle = {
  background: "#edf5fb",
  border: "1px solid rgba(79,113,142,0.12)",
  color: "#4f718e",
};

const orangePillStyle = {
  background: "#fff2df",
  border: "1px solid rgba(255,122,0,0.14)",
  color: "#a86724",
};

const mapCardStyle = {
  overflow: "hidden",
  borderRadius: 22,
  background: "#f7f4ee",
  border: "1px solid rgba(16,32,51,0.07)",
  padding: 12,
};

const futureCardStyle = {
  position: "relative" as const,
  overflow: "hidden",
  marginTop: 22,
  borderRadius: 26,
  background: "#edf5fb",
  border: "1px solid rgba(79,113,142,0.10)",
  boxShadow: "0 10px 28px rgba(16,32,51,0.04)",
};

const futureAccentStyle = {
  height: 5,
  background: "#ff7a00",
};

const futureContentStyle = {
  padding: "25px 28px 28px",
};

const futureTitleStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 30,
  lineHeight: 1.1,
  fontWeight: 600,
  color: "#102033",
  margin: "7px 0 10px",
};

const futureDescriptionStyle = {
  color: "#66778b",
  fontSize: 14,
  lineHeight: 1.7,
  maxWidth: 800,
  margin: 0,
};
