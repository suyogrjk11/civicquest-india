 "use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

type Language = "en" | "hi" | "mr";

type Issue = {
  id: string;
  status: string | null;
  reported_at: string | null;
  category: string | null;
};

type QuestProgress = {
  quest_id: string;
  score: number | null;
  xp_earned: number | null;
  completed: boolean | null;
};

type LearningProgress = {
  topic: string;
  completed: boolean | null;
  score: number | null;
};

const content: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    issuesReported: string;
    issuesReportedSub: string;
    resolved: string;
    resolvedSub: string;
    active: string;
    activeSub: string;
    questsCompleted: string;
    questsCompletedSub: string;
    xpEarned: string;
    xpEarnedSub: string;
    learningCompleted: string;
    learningCompletedSub: string;
    journey: string;
    journeyDescription: string;
    reporting: string;
    reportingDescription: string;
    learning: string;
    learningDescription: string;
    community: string;
    communityDescription: string;
    exploreCommunity: string;
    continueLearning: string;
    reportIssue: string;
    noActivity: string;
    footer: string;
    status: string;
  }
> = {
  en: {
    eyebrow: "YOUR CIVIC JOURNEY",
    title: "My Impact",
    subtitle:
      "See the civic actions, learning progress and community contribution connected to your KarmaFacie account.",
    loading: "Loading your impact...",
    back: "← Dashboard",
    issuesReported: "Issues Reported",
    issuesReportedSub: "Civic problems you have reported",
    resolved: "Resolved",
    resolvedSub: "Your reports marked resolved",
    active: "Active Issues",
    activeSub: "Reports still being worked on",
    questsCompleted: "Civic Quests",
    questsCompletedSub: "Quests you have completed",
    xpEarned: "XP Earned",
    xpEarnedSub: "From completed Civic Quests",
    learningCompleted: "Learning Completed",
    learningCompletedSub: "Civic learning topics completed",
    journey: "Your Civic Journey",
    journeyDescription:
      "Every report, learning activity and completed Civic Quest contributes to your personal civic journey.",
    reporting: "Civic Participation",
    reportingDescription:
      "You have helped bring local civic problems into KarmaFacie and made them visible for tracking.",
    learning: "Civic Learning",
    learningDescription:
      "Keep building your civic knowledge through lessons and Civic Quests.",
    community: "Community",
    communityDescription:
      "Explore community issues and see where citizens are raising similar problems.",
    exploreCommunity: "Explore Community →",
    continueLearning: "Explore Civic Learning →",
    reportIssue: "Report an Issue →",
    noActivity: "No activity yet. Start your KarmaFacie journey.",
    footer: "KarmaFacie helps you learn, participate and make your civic actions visible.",
    status: "Current status",
  },
  hi: {
    eyebrow: "आपकी नागरिक यात्रा",
    title: "मेरा प्रभाव",
    subtitle:
      "अपने KarmaFacie खाते से जुड़ी नागरिक गतिविधियों, सीखने की प्रगति और सामुदायिक योगदान को देखें।",
    loading: "आपका प्रभाव लोड हो रहा है...",
    back: "← डैशबोर्ड",
    issuesReported: "रिपोर्ट की गई समस्याएँ",
    issuesReportedSub: "आपके द्वारा रिपोर्ट की गई नागरिक समस्याएँ",
    resolved: "समाधान हुई",
    resolvedSub: "आपकी रिपोर्ट जिनका समाधान हुआ",
    active: "सक्रिय समस्याएँ",
    activeSub: "जिन रिपोर्ट पर अभी काम चल रहा है",
    questsCompleted: "Civic Quests",
    questsCompletedSub: "आपके द्वारा पूरी की गई क्वेस्ट",
    xpEarned: "प्राप्त XP",
    xpEarnedSub: "पूरी की गई Civic Quests से",
    learningCompleted: "सीखना पूरा",
    learningCompletedSub: "पूरे किए गए नागरिक सीखने के विषय",
    journey: "आपकी नागरिक यात्रा",
    journeyDescription:
      "हर रिपोर्ट, सीखने की गतिविधि और पूरी की गई Civic Quest आपकी नागरिक यात्रा का हिस्सा है।",
    reporting: "नागरिक भागीदारी",
    reportingDescription:
      "आपने स्थानीय नागरिक समस्याओं को KarmaFacie पर लाने और उन्हें ट्रैक करने में योगदान दिया है।",
    learning: "नागरिक सीख",
    learningDescription:
      "पाठ और Civic Quests के माध्यम से अपना नागरिक ज्ञान बढ़ाते रहें।",
    community: "समुदाय",
    communityDescription:
      "सामुदायिक समस्याएँ देखें और जानें कि नागरिक किन समान समस्याओं की रिपोर्ट कर रहे हैं।",
    exploreCommunity: "समुदाय देखें →",
    continueLearning: "नागरिक शिक्षा देखें →",
    reportIssue: "समस्या रिपोर्ट करें →",
    noActivity: "अभी कोई गतिविधि नहीं है। अपनी KarmaFacie यात्रा शुरू करें।",
    footer:
      "KarmaFacie आपको सीखने, भाग लेने और अपनी नागरिक गतिविधियों को दिखाई देने योग्य बनाने में मदद करता है।",
    status: "वर्तमान स्थिति",
  },
  mr: {
    eyebrow: "तुमचा नागरिक प्रवास",
    title: "माझा प्रभाव",
    subtitle:
      "तुमच्या KarmaFacie खात्याशी जोडलेला नागरिक सहभाग, शिकण्याची प्रगती आणि समुदायातील योगदान पहा.",
    loading: "तुमचा प्रभाव लोड होत आहे...",
    back: "← डॅशबोर्ड",
    issuesReported: "नोंदवलेल्या समस्या",
    issuesReportedSub: "तुम्ही नोंदवलेल्या नागरी समस्या",
    resolved: "सुटलेल्या",
    resolvedSub: "तुमच्या ज्या नोंदींचे निराकरण झाले",
    active: "सक्रिय समस्या",
    activeSub: "ज्या नोंदींवर अजून काम सुरू आहे",
    questsCompleted: "Civic Quests",
    questsCompletedSub: "तुम्ही पूर्ण केलेल्या क्वेस्ट",
    xpEarned: "मिळवलेले XP",
    xpEarnedSub: "पूर्ण केलेल्या Civic Quests मधून",
    learningCompleted: "शिकणे पूर्ण",
    learningCompletedSub: "पूर्ण केलेले नागरिक शिक्षण विषय",
    journey: "तुमचा नागरिक प्रवास",
    journeyDescription:
      "प्रत्येक समस्या नोंद, शिकण्याची कृती आणि पूर्ण केलेली Civic Quest तुमच्या नागरिक प्रवासाचा भाग आहे.",
    reporting: "नागरिक सहभाग",
    reportingDescription:
      "स्थानिक नागरी समस्या KarmaFacie वर आणण्यासाठी आणि त्यांचा मागोवा घेण्यासाठी तुम्ही योगदान दिले आहे.",
    learning: "नागरिक शिक्षण",
    learningDescription:
      "धडे आणि Civic Quests द्वारे तुमचे नागरिक ज्ञान वाढवत राहा.",
    community: "समुदाय",
    communityDescription:
      "समुदायातील समस्या पहा आणि नागरिक कोणत्या समान समस्यांची नोंद करत आहेत ते जाणून घ्या.",
    exploreCommunity: "समुदाय पहा →",
    continueLearning: "नागरिक शिक्षण पहा →",
    reportIssue: "समस्या नोंदवा →",
    noActivity: "अजून कोणतीही गतिविधी नाही. तुमचा KarmaFacie प्रवास सुरू करा.",
    footer:
      "KarmaFacie तुम्हाला शिकण्यास, सहभागी होण्यास आणि तुमच्या नागरिक कृती दृश्यमान करण्यास मदत करते.",
    status: "सध्याची स्थिती",
  },
};

const questNames: Record<string, string> = {
  constitution: "Constitution & Democracy",
  governance: "Governance",
  elections: "Elections & Voting",
  "know-india": "Know India",
};

function statusLabel(status: string | null) {
  switch (status) {
    case "reported":
      return "Reported";
    case "under_review":
      return "Under Review";
    case "in_progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    case "rejected":
      return "Rejected";
    default:
      return status || "Unknown";
  }
}

function formatDate(date: string | null, language: Language) {
  if (!date) return "—";
  const locale =
    language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyImpactPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();
  const text = content[language];

  const [issues, setIssues] = useState<Issue[]>([]);
  const [quests, setQuests] = useState<QuestProgress[]>([]);
  const [learning, setLearning] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const [issuesResult, questsResult, learningResult] =
        await Promise.all([
          supabase
            .from("civic_issues")
            .select("id, status, reported_at, category")
            .eq("user_id", user.id)
            .order("reported_at", { ascending: false }),
          supabase
            .from("civic_quest_progress")
            .select("quest_id, score, xp_earned, completed")
            .eq("user_id", user.id),
          supabase
            .from("learning_progress")
            .select("topic, completed, score")
            .eq("user_id", user.id),
        ]);

      if (issuesResult.error) {
        console.error("Impact issues loading error:", issuesResult.error);
      }
      if (questsResult.error) {
        console.error("Impact quest loading error:", questsResult.error);
      }
      if (learningResult.error) {
        console.error("Impact learning loading error:", learningResult.error);
      }

      setIssues((issuesResult.data as Issue[]) || []);
      setQuests((questsResult.data as QuestProgress[]) || []);
      setLearning((learningResult.data as LearningProgress[]) || []);
      setLoading(false);
    }

    loadImpact();
  }, [router]);

  const resolvedCount = useMemo(
    () => issues.filter((issue) => issue.status === "resolved").length,
    [issues]
  );

  const activeCount = useMemo(
    () =>
      issues.filter(
        (issue) =>
          issue.status !== "resolved" && issue.status !== "rejected"
      ).length,
    [issues]
  );

  const completedQuests = useMemo(
    () => quests.filter((quest) => quest.completed === true),
    [quests]
  );

  const totalXp = useMemo(
    () =>
      quests.reduce(
        (total, quest) =>
          total + (typeof quest.xp_earned === "number" ? quest.xp_earned : 0),
        0
      ),
    [quests]
  );

  const completedLearning = useMemo(
    () => learning.filter((item) => item.completed === true).length,
    [learning]
  );

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={centerStyle}>{text.loading}</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <button type="button" onClick={() => router.push("/dashboard")} style={backButtonStyle}>
          {text.back}
        </button>

        <header style={{ margin: "24px 0 34px" }}>
          <div style={eyebrowStyle}>📊 {text.eyebrow}</div>
          <h1 style={titleStyle}>{text.title}</h1>
          <p style={subtitleStyle}>{text.subtitle}</p>
        </header>

        <section style={statsGridStyle}>
          <Stat icon="📢" label={text.issuesReported} value={issues.length} sub={text.issuesReportedSub} />
          <Stat icon="✅" label={text.resolved} value={resolvedCount} sub={text.resolvedSub} />
          <Stat icon="🔧" label={text.active} value={activeCount} sub={text.activeSub} />
          <Stat icon="🎯" label={text.questsCompleted} value={completedQuests.length} sub={text.questsCompletedSub} />
          <Stat icon="⚡" label={text.xpEarned} value={`+${totalXp}`} sub={text.xpEarnedSub} />
          <Stat icon="📚" label={text.learningCompleted} value={completedLearning} sub={text.learningCompletedSub} />
        </section>

        <section style={panelStyle}>
          <div style={eyebrowStyle}>KARMAFACIE</div>
          <h2 style={sectionTitleStyle}>{text.journey}</h2>
          <p style={mutedStyle}>{text.journeyDescription}</p>

          {issues.length === 0 && completedQuests.length === 0 && completedLearning === 0 ? (
            <div style={emptyStyle}>{text.noActivity}</div>
          ) : (
            <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
              {issues.slice(0, 4).map((issue) => (
                <div key={issue.id} style={timelineRowStyle}>
                  <div style={timelineIconStyle}>📢</div>
                  <div style={{ flex: 1 }}>
                    <strong>{text.reporting}</strong>
                    <div style={mutedSmallStyle}>
                      {issue.category || "Civic issue"} · {formatDate(issue.reported_at, language)}
                    </div>
                  </div>
                  <span style={statusPillStyle}>{statusLabel(issue.status)}</span>
                </div>
              ))}

              {completedQuests.slice(0, 4).map((quest) => (
                <div key={`quest-${quest.quest_id}`} style={timelineRowStyle}>
                  <div style={timelineIconStyle}>🎯</div>
                  <div style={{ flex: 1 }}>
                    <strong>{questNames[quest.quest_id] || quest.quest_id}</strong>
                    <div style={mutedSmallStyle}>
                      {typeof quest.score === "number" ? `Score: ${quest.score}` : "Completed"}
                    </div>
                  </div>
                  <span style={statusPillStyle}>+{quest.xp_earned || 0} XP</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={threeColumnStyle}>
          <ActionCard
            icon="📢"
            title={text.reporting}
            description={text.reportingDescription}
            button={text.reportIssue}
            onClick={() => router.push("/report-issue")}
          />
          <ActionCard
            icon="📚"
            title={text.learning}
            description={text.learningDescription}
            button={text.continueLearning}
            onClick={() => router.push("/civic-learning")}
          />
          <ActionCard
            icon="👥"
            title={text.community}
            description={text.communityDescription}
            button={text.exploreCommunity}
            onClick={() => router.push("/community")}
          />
        </section>

        <p style={footerStyle}>{text.footer}</p>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: 27, marginBottom: 10 }}>{icon}</div>
      <div style={mutedSmallStyle}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, margin: "5px 0" }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.45 }}>{sub}</div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  button,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div style={actionCardStyle}>
      <div style={{ fontSize: 30 }}>{icon}</div>
      <h3 style={{ margin: "12px 0 8px", fontSize: 18 }}>{title}</h3>
      <p style={{ ...mutedStyle, minHeight: 70 }}>{description}</p>
      <button type="button" onClick={onClick} style={primaryButtonStyle}>
        {button}
      </button>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #172033 0%, #020617 48%, #01030a 100%)",
  color: "white",
  padding: "34px 20px 70px",
};

const containerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
};

const centerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  background: "#020617",
};

const backButtonStyle = {
  background: "transparent",
  color: "#cbd5e1",
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
};

const eyebrowStyle = {
  color: "#ff7a00",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1,
};

const titleStyle = {
  fontSize: "clamp(34px, 6vw, 54px)",
  margin: "8px 0 10px",
  lineHeight: 1.05,
};

const subtitleStyle = {
  color: "#94a3b8",
  maxWidth: 720,
  lineHeight: 1.7,
  margin: 0,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 14,
  marginBottom: 22,
};

const statCardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 18,
  padding: 18,
};

const panelStyle = {
  background: "rgba(15,23,42,0.88)",
  border: "1px solid #1e293b",
  borderRadius: 22,
  padding: 24,
  marginBottom: 22,
};

const sectionTitleStyle = {
  fontSize: 24,
  margin: "7px 0 7px",
};

const mutedStyle = {
  color: "#94a3b8",
  lineHeight: 1.65,
  fontSize: 14,
};

const mutedSmallStyle = {
  color: "#94a3b8",
  fontSize: 12,
};

const emptyStyle = {
  marginTop: 20,
  padding: 22,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  color: "#94a3b8",
  textAlign: "center" as const,
};

const timelineRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 13,
  padding: 14,
  borderRadius: 14,
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const timelineIconStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(255,122,0,0.1)",
  flexShrink: 0,
};

const statusPillStyle = {
  padding: "6px 9px",
  borderRadius: 999,
  background: "rgba(34,197,94,0.1)",
  color: "#86efac",
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: "nowrap" as const,
};

const threeColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const actionCardStyle = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 20,
  padding: 22,
};

const primaryButtonStyle = {
  background: "#ff7a00",
  color: "#111827",
  border: "none",
  borderRadius: 10,
  padding: "11px 14px",
  fontWeight: 800,
  cursor: "pointer",
};

const footerStyle = {
  textAlign: "center" as const,
  color: "#64748b",
  fontSize: 12,
  marginTop: 30,
};
