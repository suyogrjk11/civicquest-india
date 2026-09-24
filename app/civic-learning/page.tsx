"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

const topics: Record<
  Language,
  { key: string; title: string; description: string; icon: string; path: string }[]
> = {
  en: [
    { key: "government", title: "Government & Governance", description: "Understand how government institutions work and how decisions are made.", icon: "🏛️", path: "/explore/government" },
    { key: "constitution", title: "Constitution & Democracy", description: "Learn the foundations of India's Constitution, rights and democratic institutions.", icon: "⚖️", path: "/explore/constitution" },
    { key: "elections", title: "Elections & Civic Participation", description: "Understand elections, voting and the ways citizens participate in democracy.", icon: "🗳️", path: "/explore/elections" },
    { key: "local-issues", title: "Local Issues", description: "Learn how local civic problems are handled and how citizens can participate.", icon: "🏙️", path: "/explore/local-issues" },
    { key: "environment", title: "Environment", description: "Explore environmental issues, public responsibility and sustainable civic action.", icon: "🌱", path: "/explore/environment" },
    { key: "economy", title: "Economy & Jobs", description: "Understand the economy, employment and issues that affect everyday life.", icon: "💼", path: "/explore/economy" },
    { key: "education", title: "Education", description: "Learn how India's education system works and what citizens should know.", icon: "🎓", path: "/explore/education" },
    { key: "healthcare", title: "Healthcare", description: "Understand public healthcare, services and the role of citizens and institutions.", icon: "🏥", path: "/explore/healthcare" },
  ],
  hi: [
    { key: "government", title: "सरकार और शासन व्यवस्था", description: "जानें कि सरकारी संस्थाएँ कैसे काम करती हैं और निर्णय कैसे लिए जाते हैं।", icon: "🏛️", path: "/explore/government" },
    { key: "constitution", title: "संविधान और लोकतंत्र", description: "भारत के संविधान, अधिकारों और लोकतांत्रिक संस्थाओं की बुनियाद समझें।", icon: "⚖️", path: "/explore/constitution" },
    { key: "elections", title: "चुनाव और नागरिक भागीदारी", description: "चुनाव, मतदान और लोकतंत्र में नागरिकों की भागीदारी को समझें।", icon: "🗳️", path: "/explore/elections" },
    { key: "local-issues", title: "स्थानीय समस्याएँ", description: "जानें कि स्थानीय नागरिक समस्याएँ कैसे सुलझाई जाती हैं और नागरिक कैसे भाग ले सकते हैं।", icon: "🏙️", path: "/explore/local-issues" },
    { key: "environment", title: "पर्यावरण", description: "पर्यावरणीय समस्याओं, सार्वजनिक जिम्मेदारी और टिकाऊ नागरिक कार्रवाई को समझें।", icon: "🌱", path: "/explore/environment" },
    { key: "economy", title: "अर्थव्यवस्था और रोजगार", description: "अर्थव्यवस्था, रोजगार और रोज़मर्रा की ज़िंदगी को प्रभावित करने वाले मुद्दों को समझें।", icon: "💼", path: "/explore/economy" },
    { key: "education", title: "शिक्षा", description: "भारत की शिक्षा व्यवस्था और नागरिकों के लिए महत्वपूर्ण बातों के बारे में जानें।", icon: "🎓", path: "/explore/education" },
    { key: "healthcare", title: "स्वास्थ्य सेवा", description: "सार्वजनिक स्वास्थ्य सेवा, सुविधाओं और नागरिकों तथा संस्थाओं की भूमिका को समझें।", icon: "🏥", path: "/explore/healthcare" },
  ],
  mr: [
    { key: "government", title: "सरकार आणि शासनव्यवस्था", description: "सरकारी संस्था कशा काम करतात आणि निर्णय कसे घेतले जातात हे समजून घ्या.", icon: "🏛️", path: "/explore/government" },
    { key: "constitution", title: "संविधान आणि लोकशाही", description: "भारताचे संविधान, अधिकार आणि लोकशाही संस्थांची मूलभूत माहिती जाणून घ्या.", icon: "⚖️", path: "/explore/constitution" },
    { key: "elections", title: "निवडणुका आणि नागरिकांचा सहभाग", description: "निवडणुका, मतदान आणि लोकशाहीतील नागरिकांचा सहभाग समजून घ्या.", icon: "🗳️", path: "/explore/elections" },
    { key: "local-issues", title: "स्थानिक समस्या", description: "स्थानिक नागरी समस्या कशा हाताळल्या जातात आणि नागरिक कसे सहभागी होऊ शकतात हे जाणून घ्या.", icon: "🏙️", path: "/explore/local-issues" },
    { key: "environment", title: "पर्यावरण", description: "पर्यावरणीय समस्या, सार्वजनिक जबाबदारी आणि शाश्वत नागरी कृती समजून घ्या.", icon: "🌱", path: "/explore/environment" },
    { key: "economy", title: "अर्थव्यवस्था आणि रोजगार", description: "अर्थव्यवस्था, रोजगार आणि दैनंदिन जीवनावर परिणाम करणारे मुद्दे समजून घ्या.", icon: "💼", path: "/explore/economy" },
    { key: "education", title: "शिक्षण", description: "भारताची शिक्षण व्यवस्था आणि नागरिकांसाठी महत्त्वाच्या बाबी जाणून घ्या.", icon: "🎓", path: "/explore/education" },
    { key: "healthcare", title: "आरोग्य सेवा", description: "सार्वजनिक आरोग्य सेवा, सुविधा आणि नागरिक व संस्थांची भूमिका समजून घ्या.", icon: "🏥", path: "/explore/healthcare" },
  ],
};

const ui: Record<Language, { back: string; eyebrow: string; title: string; subtitle: string; learn: string; questsTitle: string; questsText: string; questsButton: string }> = {
  en: { back: "← Dashboard", eyebrow: "LEARN ABOUT CIVIC LIFE", title: "Civic Learning", subtitle: "Build practical civic knowledge through simple guides on government, democracy, elections, local issues and public services.", learn: "Choose a topic", questsTitle: "Ready to test what you learned?", questsText: "Take an interactive Civic Quest after exploring the topic.", questsButton: "Explore Civic Quests →" },
  hi: { back: "← डैशबोर्ड", eyebrow: "नागरिक जीवन के बारे में जानें", title: "नागरिक शिक्षा", subtitle: "सरकार, लोकतंत्र, चुनाव, स्थानीय समस्याओं और सार्वजनिक सेवाओं के बारे में सरल जानकारी के साथ अपना नागरिक ज्ञान बढ़ाएँ।", learn: "एक विषय चुनें", questsTitle: "जो सीखा उसे परखना चाहते हैं?", questsText: "विषय पढ़ने के बाद एक इंटरैक्टिव Civic Quest लें।", questsButton: "Civic Quests देखें →" },
  mr: { back: "← डॅशबोर्ड", eyebrow: "नागरी जीवनाबद्दल जाणून घ्या", title: "नागरिक शिक्षण", subtitle: "सरकार, लोकशाही, निवडणुका, स्थानिक समस्या आणि सार्वजनिक सेवांबद्दल सोप्या मार्गदर्शकांमधून तुमचे नागरिक ज्ञान वाढवा.", learn: "एक विषय निवडा", questsTitle: "तुम्ही शिकलेले तपासायचे आहे?", questsText: "विषय पाहिल्यानंतर इंटरॅक्टिव्ह Civic Quest घ्या.", questsButton: "Civic Quests पहा →" },
};

export default function CivicLearningPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = ui[language];
  const list = topics[language];

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "40px 20px 70px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "15px", cursor: "pointer", padding: 0, marginBottom: "42px" }}>{text.back}</button>

        <section style={{ maxWidth: "850px", marginBottom: "42px" }}>
          <div style={{ color: "#ff7a00", fontSize: "13px", fontWeight: 800, letterSpacing: "1.5px", marginBottom: "10px" }}>{text.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", lineHeight: 1.02, margin: "0 0 18px", fontWeight: 850 }}>📚 {text.title}</h1>
          <p style={{ color: "#94a3b8", fontSize: "18px", lineHeight: 1.7, margin: 0 }}>{text.subtitle}</p>
        </section>

        <section>
          <h2 style={{ fontSize: "28px", margin: "0 0 20px" }}>{text.learn}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
            {list.map((topic) => (
              <button key={topic.key} onClick={() => router.push(topic.path)} style={{ textAlign: "left", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "20px", padding: "24px", color: "#f8fafc", cursor: "pointer", minHeight: "190px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "34px", marginBottom: "16px" }}>{topic.icon}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: "20px" }}>{topic.title}</h3>
                <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6, fontSize: "14px" }}>{topic.description}</p>
                <div style={{ marginTop: "auto", paddingTop: "18px", color: "#ff7a00", fontWeight: 750, fontSize: "14px" }}>Learn more →</div>
              </button>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "42px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "22px", padding: "28px", display: "flex", gap: "24px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: "24px" }}>🎯 {text.questsTitle}</h2>
            <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.6 }}>{text.questsText}</p>
          </div>
          <button onClick={() => router.push("/civic-quests")} style={{ background: "#ff7a00", color: "#020617", border: "none", borderRadius: "12px", padding: "14px 20px", fontWeight: 800, fontSize: "15px", cursor: "pointer" }}>{text.questsButton}</button>
        </section>
      </div>
    </main>
  );
}
