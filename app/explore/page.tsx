"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

const topicsByLanguage: Record<
  Language,
  {
    icon: string;
    title: string;
    description: string;
    path: string;
  }[]
> = {
  en: [
    {
      icon: "🏛️",
      title: "Government & Governance",
      description:
        "Understand how the Union, State and Local governments work and how their responsibilities are divided.",
      path: "/explore/government",
    },
    {
      icon: "📜",
      title: "Constitution & Democracy",
      description:
        "Learn about the Constitution, Fundamental Rights, Directive Principles, Fundamental Duties and democracy.",
      path: "/explore/constitution",
    },
    {
      icon: "🗳️",
      title: "Elections & Civic Participation",
      description:
        "Understand elections, electoral rolls, voting, EVMs, VVPAT and ways citizens participate in democracy.",
      path: "/explore/elections",
    },
    {
      icon: "🏙️",
      title: "Local Issues",
      description:
        "Learn how local government works and how everyday civic issues are handled in your city or community.",
      path: "/explore/local-issues",
    },
    {
      icon: "🌱",
      title: "Environment",
      description:
        "Explore environmental issues, sustainability, conservation and the role citizens can play.",
      path: "/explore/environment",
    },
    {
      icon: "💼",
      title: "Economy & Jobs",
      description:
        "Understand basic economic concepts, employment, taxation, public finance and India's economy.",
      path: "/explore/economy",
    },
    {
      icon: "🎓",
      title: "Education",
      description:
        "Learn about India's education system, policies, institutions and opportunities for citizens.",
      path: "/explore/education",
    },
    {
      icon: "🏥",
      title: "Healthcare",
      description:
        "Understand India's healthcare system, public health institutions and healthcare-related civic issues.",
      path: "/explore/healthcare",
    },
  ],

  hi: [
    {
      icon: "🏛️",
      title: "सरकार और शासन व्यवस्था",
      description:
        "समझें कि केंद्र, राज्य और स्थानीय सरकारें कैसे काम करती हैं और उनकी जिम्मेदारियाँ कैसे बाँटी गई हैं।",
      path: "/explore/government",
    },
    {
      icon: "📜",
      title: "संविधान और लोकतंत्र",
      description:
        "संविधान, मौलिक अधिकार, राज्य के नीति-निर्देशक तत्व, मौलिक कर्तव्य और लोकतंत्र के बारे में जानें।",
      path: "/explore/constitution",
    },
    {
      icon: "🗳️",
      title: "चुनाव और नागरिक भागीदारी",
      description:
        "चुनाव, मतदाता सूची, मतदान, EVM, VVPAT और लोकतंत्र में नागरिकों की भागीदारी के तरीकों को समझें।",
      path: "/explore/elections",
    },
    {
      icon: "🏙️",
      title: "स्थानीय समस्याएँ",
      description:
        "जानें कि स्थानीय सरकार कैसे काम करती है और आपके शहर या समुदाय की रोज़मर्रा की नागरिक समस्याओं का समाधान कैसे होता है।",
      path: "/explore/local-issues",
    },
    {
      icon: "🌱",
      title: "पर्यावरण",
      description:
        "पर्यावरणीय समस्याओं, सतत विकास, संरक्षण और नागरिकों की भूमिका के बारे में जानें।",
      path: "/explore/environment",
    },
    {
      icon: "💼",
      title: "अर्थव्यवस्था और रोजगार",
      description:
        "बुनियादी आर्थिक अवधारणाओं, रोजगार, कर व्यवस्था, सार्वजनिक वित्त और भारत की अर्थव्यवस्था को समझें।",
      path: "/explore/economy",
    },
    {
      icon: "🎓",
      title: "शिक्षा",
      description:
        "भारत की शिक्षा व्यवस्था, नीतियों, संस्थानों और नागरिकों के लिए उपलब्ध अवसरों के बारे में जानें।",
      path: "/explore/education",
    },
    {
      icon: "🏥",
      title: "स्वास्थ्य सेवा",
      description:
        "भारत की स्वास्थ्य व्यवस्था, सार्वजनिक स्वास्थ्य संस्थानों और स्वास्थ्य से जुड़े नागरिक मुद्दों को समझें।",
      path: "/explore/healthcare",
    },
  ],

  mr: [
    {
      icon: "🏛️",
      title: "सरकार आणि शासनव्यवस्था",
      description:
        "केंद्र, राज्य आणि स्थानिक सरकारे कशी काम करतात आणि त्यांच्या जबाबदाऱ्या कशा विभागल्या आहेत हे समजून घ्या.",
      path: "/explore/government",
    },
    {
      icon: "📜",
      title: "संविधान आणि लोकशाही",
      description:
        "संविधान, मूलभूत अधिकार, राज्याच्या धोरणनिर्देशक तत्त्वे, मूलभूत कर्तव्ये आणि लोकशाही याबद्दल जाणून घ्या.",
      path: "/explore/constitution",
    },
    {
      icon: "🗳️",
      title: "निवडणुका आणि नागरिकांचा सहभाग",
      description:
        "निवडणुका, मतदार यादी, मतदान, EVM, VVPAT आणि लोकशाहीमध्ये नागरिक सहभागी होण्याचे मार्ग समजून घ्या.",
      path: "/explore/elections",
    },
    {
      icon: "🏙️",
      title: "स्थानिक समस्या",
      description:
        "स्थानिक सरकार कसे काम करते आणि तुमच्या शहरातील किंवा परिसरातील दैनंदिन नागरी समस्यांवर कशा प्रकारे उपाय केले जातात हे जाणून घ्या.",
      path: "/explore/local-issues",
    },
    {
      icon: "🌱",
      title: "पर्यावरण",
      description:
        "पर्यावरणीय समस्या, शाश्वत विकास, संवर्धन आणि नागरिकांची भूमिका याबद्दल जाणून घ्या.",
      path: "/explore/environment",
    },
    {
      icon: "💼",
      title: "अर्थव्यवस्था आणि रोजगार",
      description:
        "मूलभूत आर्थिक संकल्पना, रोजगार, करव्यवस्था, सार्वजनिक वित्त आणि भारताची अर्थव्यवस्था समजून घ्या.",
      path: "/explore/economy",
    },
    {
      icon: "🎓",
      title: "शिक्षण",
      description:
        "भारताची शिक्षण व्यवस्था, धोरणे, संस्था आणि नागरिकांसाठी उपलब्ध संधींबद्दल जाणून घ्या.",
      path: "/explore/education",
    },
    {
      icon: "🏥",
      title: "आरोग्य सेवा",
      description:
        "भारताची आरोग्य व्यवस्था, सार्वजनिक आरोग्य संस्था आणि आरोग्याशी संबंधित नागरी समस्यांबद्दल समजून घ्या.",
      path: "/explore/healthcare",
    },
  ],
};

const content = {
  en: {
    subtitle: "Explore & Learn",
    dashboard: "← Dashboard",
    label: "KARMAFACIE · EXPLORE",
    heroTitle: "Learn how India works.",
    heroDescription:
      "Explore simple, interactive lessons about government, democracy, elections, society and the systems that affect everyday life.",
    startLearning: "Start learning →",
    comingSoon: "MORE COMING SOON",
    growingTitle: "KarmaFacie is growing.",
    growingDescription:
      "More interactive lessons, quizzes, civic challenges and real-world learning experiences will be added as KarmaFacie develops.",
    footer: "KarmaFacie · Learn. Understand. Participate.",
  },

  hi: {
    subtitle: "जानें और समझें",
    dashboard: "← डैशबोर्ड",
    label: "KARMAFACIE · जानें",
    heroTitle: "जानें कि भारत कैसे काम करता है।",
    heroDescription:
      "सरकार, लोकतंत्र, चुनाव, समाज और हमारे दैनिक जीवन को प्रभावित करने वाली व्यवस्थाओं के बारे में सरल और इंटरैक्टिव पाठों के माध्यम से जानें।",
    startLearning: "सीखना शुरू करें →",
    comingSoon: "और भी जल्द आ रहा है",
    growingTitle: "KarmaFacie लगातार विकसित हो रहा है।",
    growingDescription:
      "KarmaFacie के विकास के साथ और अधिक इंटरैक्टिव पाठ, क्विज़, नागरिक चुनौतियाँ और वास्तविक जीवन से जुड़ी सीखने की गतिविधियाँ जोड़ी जाएँगी।",
    footer: "KarmaFacie · सीखें। समझें। भाग लें।",
  },

  mr: {
    subtitle: "शिका आणि समजून घ्या",
    dashboard: "← डॅशबोर्ड",
    label: "KARMAFACIE · एक्सप्लोर",
    heroTitle: "भारत कसा कार्य करतो हे जाणून घ्या.",
    heroDescription:
      "सरकार, लोकशाही, निवडणुका, समाज आणि आपल्या दैनंदिन जीवनावर परिणाम करणाऱ्या व्यवस्थांबद्दल सोप्या आणि इंटरॅक्टिव्ह धड्यांमधून जाणून घ्या.",
    startLearning: "शिकायला सुरुवात करा →",
    comingSoon: "आणखी लवकरच येत आहे",
    growingTitle: "KarmaFacie विकसित होत आहे.",
    growingDescription:
      "KarmaFacie विकसित होत असताना आणखी इंटरॅक्टिव्ह धडे, क्विझ, नागरिकांसाठी आव्हाने आणि वास्तविक जीवनाशी संबंधित शिकण्याचे अनुभव जोडले जातील.",
    footer: "KarmaFacie · शिका. समजून घ्या. सहभागी व्हा.",
  },
};

export default function ExplorePage() {
  const router = useRouter();
  const { language } = useLanguage();

  const topics = topicsByLanguage[language];
  const text = content[language];

  const handleTopicClick = (path: string) => {
    router.push(path);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "32px 5% 70px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "65px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
              }}
            >
              Civic<span style={{ color: "#ff7a00" }}>Quest</span>
            </div>

            <div
              style={{
                color: "#94a3b8",
                marginTop: "5px",
              }}
            >
              {text.subtitle}
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "12px 20px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {text.dashboard}
          </button>
        </header>

        {/* HERO */}

        <section
          style={{
            marginBottom: "55px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            {text.label}
          </div>

          <h1
            style={{
              fontSize: "52px",
              lineHeight: "1.1",
              fontWeight: "800",
              margin: "0 0 20px",
              maxWidth: "850px",
            }}
          >
            {text.heroTitle}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "19px",
              lineHeight: "1.7",
              maxWidth: "780px",
              margin: 0,
            }}
          >
            {text.heroDescription}
          </p>
        </section>

        {/* TOPICS */}

        <section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {topics.map((topic, index) => {
              return (
                <button
                  key={topic.path}
                  onClick={() => handleTopicClick(topic.path)}
                  style={{
                    textAlign: "left",
                    background: "#0f172a",
                    color: "white",
                    border: "1px solid #1e293b",
                    borderRadius: "20px",
                    padding: "28px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    minHeight: "250px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* NUMBER */}

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      fontWeight: "700",
                      letterSpacing: "1px",
                      marginBottom: "20px",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* ICON */}

                  <div
                    style={{
                      fontSize: "38px",
                      marginBottom: "18px",
                    }}
                  >
                    {topic.icon}
                  </div>

                  {/* TITLE */}

                  <h2
                    style={{
                      fontSize: "22px",
                      lineHeight: "1.3",
                      margin: "0 0 12px",
                    }}
                  >
                    {topic.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      margin: "0 0 25px",
                    }}
                  >
                    {topic.description}
                  </p>

                  {/* ACTION */}

                  <div
                    style={{
                      marginTop: "auto",
                      color: "#ff7a00",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    {text.startLearning}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* COMING SOON */}

        <section
          style={{
            marginTop: "70px",
            background: "linear-gradient(135deg, #0f172a, #111827)",
            border: "1px solid #1e293b",
            borderRadius: "24px",
            padding: "35px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            {text.comingSoon}
          </div>

          <h2
            style={{
              fontSize: "30px",
              margin: "0 0 12px",
            }}
          >
            {text.growingTitle}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.7",
              fontSize: "16px",
              maxWidth: "750px",
              margin: 0,
            }}
          >
            {text.growingDescription}
          </p>
        </section>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "45px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {text.footer}
        </div>
      </div>
    </main>
  );
}