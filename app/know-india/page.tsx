"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import IndiaMap from "@/components/IndiaMap";

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
      "यह मानचित्र Know India का पहला भाग है। इसके बाद भूगोल, इतिहास, शासन व्यवस्था, राष्ट्रीय प्रतीकों और संविधान से जुड़े और भी इंटरैक्टिव अनुभव यहाँ जोड़े जाएँगे।",
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
      "हा नकाशा Know India चा पहिला भाग आहे. यानंतर भूगोल, इतिहास, शासनव्यवस्था, राष्ट्रीय चिन्हे आणि संविधानाशी संबंधित आणखी इंटरॅक्टिव्ह अनुभव येथे जोडले जातील.",
  },
};

export default function KnowIndiaPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const text = content[language];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 38%, #020617 100%)",
        color: "white",
        padding: "35px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* BACK */}

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "35px",
          }}
        >
          {text.back}
        </button>

        {/* HERO */}

        <section
          style={{
            textAlign: "center",
            maxWidth: "850px",
            margin: "0 auto 55px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1.5px",
              marginBottom: "14px",
            }}
          >
            {text.label}
          </div>

          <div
            style={{
              fontSize: "58px",
              marginBottom: "15px",
            }}
          >
            🇮🇳
          </div>

          <h1
            style={{
              fontSize: "52px",
              lineHeight: 1.08,
              fontWeight: 900,
              margin: "0 0 18px",
            }}
          >
            {text.title}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {text.description}
          </p>
        </section>

        {/* MAP HEADING */}

        <section
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "30px",
                  margin: "0 0 8px",
                }}
              >
                {text.mapTitle}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {text.mapDescription}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "9px 12px",
                  borderRadius: "999px",
                  background:
                    "rgba(255,255,255,0.05)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {text.states}
              </div>

              <div
                style={{
                  padding: "9px 12px",
                  borderRadius: "999px",
                  background:
                    "rgba(255,122,0,0.08)",
                  border:
                    "1px solid rgba(255,122,0,0.2)",
                  color: "#fdba74",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {text.unionTerritories}
              </div>
            </div>
          </div>
        </section>

        {/* INDIA MAP */}

        <IndiaMap language={language} />

        {/* FUTURE CONTENT */}

        <section
          style={{
            marginTop: "60px",
            padding: "35px",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.75))",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            {text.nextLabel}
          </div>

          <h2
            style={{
              fontSize: "30px",
              margin: "0 0 12px",
            }}
          >
            {text.nextTitle}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "16px",
              lineHeight: 1.7,
              maxWidth: "800px",
              margin: 0,
            }}
          >
            {text.nextDescription}
          </p>
        </section>
      </div>
    </main>
  );
}