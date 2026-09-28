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
  updated_at: string | null;
};

type LearningProgress = {
  topic: string;
  completed: boolean | null;
  score: number | null;
  completed_at: string | null;
};

type MissionCompletion = {
  id: string;
  mission_id: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
};

type Mission = {
  id: string;
  title: string;
  title_i18n: Record<string, string> | null;
  points: number;
};

type PassportSummary = {
  total_karma_credits: number;
  missions_verified: number;
};

type MissionImpact = {
  id: string;
  completion_id: string;
  impact_type: string | null;
  before_note: string | null;
  after_note: string | null;
  impact_summary: string | null;
  status: string | null;
  created_at: string | null;
};

type IssueFollowup = {
  id: number;
  issue_id: string;
  status: string | null;
  note: string | null;
  created_at: string | null;
};

type ResolutionCheck = {
  id: number;
  issue_id: string;
  resolution_result: string | null;
  note: string | null;
  created_at: string | null;
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
    verifiedMissions: string;
    verifiedMissionsSub: string;
    karmaCredits: string;
    karmaCreditsSub: string;
    passport: string;
    passportDescription: string;
    viewPassport: string;
    journey: string;
    journeyDescription: string;
    learnStage: string;
    noticeStage: string;
    actStage: string;
    verifyStage: string;
    impactStage: string;
    journeyPathDescription: string;
    recentActivity: string;
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
    activityPreparing: string;
    score: string;
    completed: string;
    verified: string;
    impactSection: string;
    impactDescription: string;
    verifiedImpact: string;
    verifiedImpactSub: string;
    issueOutcomes: string;
    issueOutcomesSub: string;
    evidenceRecorded: string;
    evidenceRecordedSub: string;
    noImpactYet: string;
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
    xpEarnedSub: "XP earned across your Civic Quest progress",
    learningCompleted: "Learning Completed",
    learningCompletedSub: "Civic learning topics completed",
    verifiedMissions: "Verified Missions",
    verifiedMissionsSub: "Real-world civic actions verified",
    karmaCredits: "Karma Credits",
    karmaCreditsSub: "Verified civic contribution record",
    passport: "Civic Passport",
    passportDescription: "Your verified civic record, Karma Credits and participation history.",
    viewPassport: "View Civic Passport →",
    journey: "Your Civic Journey",
    journeyDescription:
      "Every report, learning activity and Civic Quest progress contributes to your personal civic journey.",
    learnStage: "Learn",
    noticeStage: "Notice",
    actStage: "Act",
    verifyStage: "Verify",
    impactStage: "Impact",
    journeyPathDescription: "Your journey from civic knowledge to visible, verified participation.",
    recentActivity: "Recent activity",
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
    footer:
      "KarmaFacie helps you learn, participate and make your civic actions visible.",
    status: "Current status",
    activityPreparing: "Your civic activity is being prepared.",
    score: "Score",
    completed: "Completed",
    verified: "Verified",
    impactSection: "What Changed",
    impactDescription: "See the evidence and outcomes connected to the civic actions you have taken.",
    verifiedImpact: "Verified impact records",
    verifiedImpactSub: "Before-and-after evidence recorded for your actions",
    issueOutcomes: "Issue outcomes",
    issueOutcomesSub: "Resolution checks and follow-up observations",
    evidenceRecorded: "Evidence recorded",
    evidenceRecordedSub: "Impact records linked to your verified missions",
    noImpactYet: "No impact evidence has been recorded yet. Complete a civic action and document what changed.",
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
    xpEarnedSub: "आपकी Civic Quest प्रगति से अर्जित XP",
    learningCompleted: "सीखना पूरा",
    learningCompletedSub: "पूरे किए गए नागरिक सीखने के विषय",
    verifiedMissions: "सत्यापित मिशन",
    verifiedMissionsSub: "सत्यापित वास्तविक नागरिक कार्य",
    karmaCredits: "कर्मा क्रेडिट्स",
    karmaCreditsSub: "सत्यापित नागरिक योगदान का रिकॉर्ड",
    passport: "सिविक पासपोर्ट",
    passportDescription: "आपका सत्यापित नागरिक रिकॉर्ड, कर्मा क्रेडिट्स और भागीदारी इतिहास।",
    viewPassport: "सिविक पासपोर्ट देखें →",
    journey: "आपकी नागरिक यात्रा",
    journeyDescription:
      "हर रिपोर्ट, सीखने की गतिविधि और Civic Quest की प्रगति आपकी नागरिक यात्रा का हिस्सा है।",
    learnStage: "सीखें",
    noticeStage: "ध्यान दें",
    actStage: "कृती करें",
    verifyStage: "सत्यापित करें",
    impactStage: "प्रभाव",
    journeyPathDescription: "नागरिक ज्ञान से दिखाई देने वाली और सत्यापित भागीदारी तक आपकी यात्रा।",
    recentActivity: "हाल की गतिविधि",
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
    activityPreparing: "आपकी नागरिक गतिविधि तैयार की जा रही है।",
    score: "स्कोर",
    completed: "पूरा हुआ",
    verified: "सत्यापित",
    impactSection: "क्या बदला",
    impactDescription: "आपकी नागरिक कार्रवाइयों से जुड़े साक्ष्य और परिणाम यहाँ दिखाई देंगे।",
    verifiedImpact: "सत्यापित प्रभाव रिकॉर्ड",
    verifiedImpactSub: "आपकी कार्रवाइयों के लिए दर्ज पहले और बाद के साक्ष्य",
    issueOutcomes: "समस्या के परिणाम",
    issueOutcomesSub: "समाधान जाँच और फॉलो-अप अवलोकन",
    evidenceRecorded: "दर्ज साक्ष्य",
    evidenceRecordedSub: "सत्यापित मिशनों से जुड़े प्रभाव रिकॉर्ड",
    noImpactYet: "अभी कोई प्रभाव साक्ष्य दर्ज नहीं है। नागरिक कार्रवाई पूरी करें और हुए बदलाव को दर्ज करें।",
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
    xpEarnedSub: "तुमच्या Civic Quest प्रगतीतून मिळवलेले XP",
    learningCompleted: "शिकणे पूर्ण",
    learningCompletedSub: "पूर्ण केलेले नागरिक शिक्षण विषय",
    verifiedMissions: "सत्यापित मिशन",
    verifiedMissionsSub: "सत्यापित प्रत्यक्ष नागरी कृती",
    karmaCredits: "कर्मा क्रेडिट्स",
    karmaCreditsSub: "सत्यापित नागरी योगदानाची नोंद",
    passport: "सिविक पासपोर्ट",
    passportDescription: "तुमचा सत्यापित नागरी रेकॉर्ड, कर्मा क्रेडिट्स आणि सहभागाचा इतिहास.",
    viewPassport: "सिविक पासपोर्ट पहा →",
    journey: "तुमचा नागरिक प्रवास",
    journeyDescription:
      "प्रत्येक समस्या नोंद, शिकण्याची कृती आणि पूर्ण केलेली Civic Quest तुमच्या नागरिक प्रवासाचा भाग आहे.",
    learnStage: "शिका",
    noticeStage: "नोंद घ्या",
    actStage: "कृती करा",
    verifyStage: "सत्यापित करा",
    impactStage: "प्रभाव",
    journeyPathDescription: "नागरी ज्ञानापासून दिसणाऱ्या आणि सत्यापित सहभागापर्यंतचा तुमचा प्रवास.",
    recentActivity: "अलीकडील गतिविधी",
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
    activityPreparing: "तुमची नागरिक गतिविधी तयार केली जात आहे.",
    score: "स्कोअर",
    completed: "पूर्ण झाले",
    verified: "सत्यापित",
    impactSection: "काय बदलले",
    impactDescription: "तुम्ही केलेल्या नागरिक कृतींशी जोडलेले पुरावे आणि परिणाम येथे दिसतील.",
    verifiedImpact: "सत्यापित प्रभाव नोंदी",
    verifiedImpactSub: "तुमच्या कृतींसाठी नोंदवलेले आधी आणि नंतरचे पुरावे",
    issueOutcomes: "समस्यांचे परिणाम",
    issueOutcomesSub: "निराकरण तपासण्या आणि फॉलो-अप निरीक्षणे",
    evidenceRecorded: "नोंदवलेले पुरावे",
    evidenceRecordedSub: "सत्यापित मिशनशी जोडलेल्या प्रभाव नोंदी",
    noImpactYet: "अजून प्रभावाचा पुरावा नोंदवलेला नाही. नागरिक कृती पूर्ण करा आणि झालेला बदल नोंदवा.",
  },
};

const questNames: Record<string, Record<Language, string>> = {
  constitution: {
    en: "Constitution & Democracy",
    hi: "संविधान और लोकतंत्र",
    mr: "संविधान आणि लोकशाही",
  },
  governance: {
    en: "Governance",
    hi: "शासन व्यवस्था",
    mr: "शासन व्यवस्था",
  },
  elections: {
    en: "Elections & Voting",
    hi: "चुनाव और मतदान",
    mr: "निवडणुका आणि मतदान",
  },
  "know-india": {
    en: "Know India",
    hi: "भारत को जानें",
    mr: "भारत जाणून घ्या",
  },
};

function statusLabel(status: string | null, language: Language) {
  switch (status) {
    case "reported":
      return language === "hi" ? "रिपोर्ट की गई" : language === "mr" ? "नोंदवलेली" : "Reported";
    case "under_review":
      return language === "hi" ? "समीक्षा में" : language === "mr" ? "तपासणीत" : "Under Review";
    case "in_progress":
      return language === "hi" ? "प्रगति में" : language === "mr" ? "प्रगतीपथावर" : "In Progress";
    case "resolved":
      return language === "hi" ? "समाधान हुआ" : language === "mr" ? "निराकरण झाले" : "Resolved";
    case "rejected":
      return language === "hi" ? "अस्वीकृत" : language === "mr" ? "नाकारले" : "Rejected";
    default:
      return status || (language === "hi" ? "अज्ञात" : language === "mr" ? "अज्ञात" : "Unknown");
  }
}

function categoryLabel(category: string | null, language: Language) {
  if (!category) {
    return language === "hi" ? "नागरिक समस्या" : language === "mr" ? "नागरी समस्या" : "Civic issue";
  }

  const labels: Record<string, Record<Language, string>> = {
    roads: { en: "Roads & Streets", hi: "सड़कें और गलियाँ", mr: "रस्ते आणि मार्ग" },
    water: { en: "Water Supply", hi: "जल आपूर्ति", mr: "पाणीपुरवठा" },
    sanitation: { en: "Sanitation", hi: "स्वच्छता", mr: "स्वच्छता" },
    waste: { en: "Waste Management", hi: "कचरा प्रबंधन", mr: "कचरा व्यवस्थापन" },
    streetlights: { en: "Street Lights", hi: "स्ट्रीट लाइट", mr: "पथदिवे" },
    drainage: { en: "Drainage", hi: "जल निकासी", mr: "निचरा व्यवस्था" },
    traffic: { en: "Traffic", hi: "यातायात", mr: "वाहतूक" },
    public_safety: { en: "Public Safety", hi: "सार्वजनिक सुरक्षा", mr: "सार्वजनिक सुरक्षितता" },
    cleanliness: { en: "Cleanliness", hi: "स्वच्छता", mr: "स्वच्छता" },
    environment: { en: "Environment", hi: "पर्यावरण", mr: "पर्यावरण" },
    education: { en: "Education", hi: "शिक्षण", mr: "शिक्षण" },
    healthcare: { en: "Healthcare", hi: "स्वास्थ्य सेवा", mr: "आरोग्यसेवा" },
  };

  return labels[category]?.[language] || category.replace(/_/g, " ");
}

function formatDate(date: string | null, language: Language) {
  if (!date) return "—";

  const locale =
    language === "hi"
      ? "hi-IN"
      : language === "mr"
        ? "mr-IN"
        : "en-IN";

  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyImpactPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const text = content[language];

  const [issues, setIssues] = useState<Issue[]>([]);
  const [quests, setQuests] = useState<QuestProgress[]>([]);
  const [learning, setLearning] = useState<LearningProgress[]>([]);
  const [missions, setMissions] = useState<Array<MissionCompletion & { mission: Mission | null }>>([]);
  const [impacts, setImpacts] = useState<MissionImpact[]>([]);
  const [followups, setFollowups] = useState<IssueFollowup[]>([]);
  const [resolutionChecks, setResolutionChecks] = useState<ResolutionCheck[]>([]);
  const [passport, setPassport] = useState<PassportSummary | null>(null);
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

      const [
        issuesResult,
        questsResult,
        learningResult,
        missionResult,
        passportResult,
        impactResult,
        followupResult,
        resolutionResult,
      ] = await Promise.all([
          supabase
            .from("civic_issues")
            .select("id, status, reported_at, category")
            .eq("user_id", user.id)
            .order("reported_at", { ascending: false }),

          supabase
            .from("civic_quest_progress")
            .select("quest_id, score, xp_earned, completed, updated_at")
            .eq("user_id", user.id),

          supabase
            .from("learning_progress")
            .select("topic, completed, score, completed_at")
            .eq("user_id", user.id),

          supabase
            .from("civic_mission_completions")
            .select("id, mission_id, status, submitted_at, reviewed_at")
            .eq("user_id", user.id)
            .eq("status", "verified")
            .order("reviewed_at", { ascending: false }),

          supabase.rpc("get_my_civic_passport"),

          supabase
            .from("civic_mission_impacts")
            .select(
              "id, completion_id, impact_type, before_note, after_note, impact_summary, status, created_at"
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),

          supabase
            .from("civic_issue_followups")
            .select("id, issue_id, status, note, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),

          supabase
            .from("civic_issue_resolution_checks")
            .select("id, issue_id, resolution_result, note, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

      if (issuesResult.error) {
        console.error(
          "Impact issues loading error:",
          issuesResult.error
        );
      }

      if (questsResult.error) {
        console.error(
          "Impact quest loading error:",
          questsResult.error
        );
      }

      if (learningResult.error) {
        console.error(
          "Impact learning loading error:",
          learningResult.error
        );
      }

      if (missionResult.error) {
        console.error(
          "Impact mission loading error:",
          missionResult.error
        );
      }

      if (passportResult.error) {
        console.error(
          "Impact passport loading error:",
          passportResult.error
        );
      }

      const passportRow = Array.isArray(passportResult.data)
        ? passportResult.data[0]
        : passportResult.data;

      setPassport((passportRow as PassportSummary) || null);
      setIssues((issuesResult.data as Issue[]) || []);
      setQuests((questsResult.data as QuestProgress[]) || []);
      setLearning(
        (learningResult.data as LearningProgress[]) || []
      );
      setImpacts((impactResult.data as MissionImpact[]) || []);
      setFollowups((followupResult.data as IssueFollowup[]) || []);
      setResolutionChecks((resolutionResult.data as ResolutionCheck[]) || []);

      if (impactResult.error) console.error("Impact evidence loading error:", impactResult.error);
      if (followupResult.error) console.error("Impact follow-up loading error:", followupResult.error);
      if (resolutionResult.error) console.error("Impact resolution loading error:", resolutionResult.error);

      const completions = (missionResult.data as MissionCompletion[]) || [];
      if (completions.length > 0) {
        const missionIds = Array.from(new Set(completions.map((completion) => completion.mission_id)));
        const { data: missionData, error: missionDataError } = await supabase
          .from("civic_missions")
          .select("id,title,title_i18n,points")
          .in("id", missionIds);

        if (missionDataError) {
          console.error("Impact mission details loading error:", missionDataError);
        }

        const missionMap = new Map(
          ((missionData || []) as Mission[]).map((mission) => [mission.id, mission])
        );

        setMissions(
          completions.map((completion) => ({
            ...completion,
            mission: missionMap.get(completion.mission_id) || null,
          }))
        );
      } else {
        setMissions([]);
      }

      setLoading(false);
    }

    loadImpact();
  }, [router]);

  const resolvedCount = useMemo(
    () =>
      issues.filter(
        (issue) => issue.status === "resolved"
      ).length,
    [issues]
  );

  const activeCount = useMemo(
    () =>
      issues.filter(
        (issue) =>
          issue.status !== "resolved" &&
          issue.status !== "rejected"
      ).length,
    [issues]
  );

  const completedQuests = useMemo(
    () =>
      quests.filter(
        (quest) => quest.completed === true
      ),
    [quests]
  );

  const totalXp = useMemo(
    () =>
      quests.reduce(
        (total, quest) =>
          total +
          (typeof quest.xp_earned === "number"
            ? quest.xp_earned
            : 0),
        0
      ),
    [quests]
  );

  const completedLearning = useMemo(
    () =>
      learning.filter(
        (item) => item.completed === true
      ).length,
    [learning]
  );

  const completedMissions = missions.length;


  const journeyStages = [
    {
      key: "learn",
      icon: "📚",
      title: text.learnStage,
      value: completedLearning,
      detail: text.learningCompleted,
      background: "linear-gradient(145deg, #f1f7ec 0%, #e8f1e1 100%)",
    },
    {
      key: "notice",
      icon: "📢",
      title: text.noticeStage,
      value: issues.length,
      detail: text.issuesReported,
      background: "linear-gradient(145deg, #f0f7fb 0%, #e6f0f7 100%)",
    },
    {
      key: "act",
      icon: "✦",
      title: text.actStage,
      value: completedMissions,
      detail: text.verifiedMissions,
      background: "linear-gradient(145deg, #fff5eb 0%, #ffeadb 100%)",
    },
    {
      key: "verify",
      icon: "✓",
      title: text.verifyStage,
      value: completedMissions,
      detail: text.verified,
      background: "linear-gradient(145deg, #f7f3fb 0%, #eee9f6 100%)",
    },
    {
      key: "impact",
      icon: "🌱",
      title: text.impactStage,
      value: resolvedCount,
      detail: text.resolved,
      background: "linear-gradient(145deg, #fff6e9 0%, #ffedd5 100%)",
    },
  ];

  const journeyEvents = useMemo(() => {
    const events: Array<{
      id: string;
      type: "issue" | "mission" | "quest" | "learning" | "impact" | "followup" | "resolution";
      date: string | null;
      title: string;
      detail: string;
      value?: string;
      status?: string | null;
    }> = [];

    issues.forEach((issue) => {
      events.push({
        id: `issue-${issue.id}`,
        type: "issue",
        date: issue.reported_at,
        title: text.reporting,
        detail: `${categoryLabel(issue.category, language)} · ${formatDate(issue.reported_at, language)}`,
        status: issue.status,
      });
    });

    missions.forEach((completion) => {
      events.push({
        id: `mission-${completion.id}`,
        type: "mission",
        date: completion.reviewed_at || completion.submitted_at,
        title: completion.mission?.title_i18n?.[language] || completion.mission?.title || "Civic Mission",
        detail: `${text.verified} · ${formatDate(completion.reviewed_at || completion.submitted_at, language)}`,
        value: `+${completion.mission?.points ?? 0} Karma`,
      });
    });

    completedQuests.forEach((quest) => {
      events.push({
        id: `quest-${quest.quest_id}`,
        type: "quest",
        date: quest.updated_at,
        title: questNames[quest.quest_id]?.[language] || quest.quest_id,
        detail: `${text.score}: ${quest.score ?? 0} · ${formatDate(quest.updated_at, language)}`,
        value: `+${quest.xp_earned || 0} XP`,
      });
    });

    learning.filter((item) => item.completed === true).forEach((item, index) => {
      events.push({
        id: `learning-${item.topic}-${index}`,
        type: "learning",
        date: item.completed_at,
        title: item.topic,
        detail: `${text.completed} · ${formatDate(item.completed_at, language)}`,
        value: typeof item.score === "number" ? `${text.score}: ${item.score}` : undefined,
      });
    });

    impacts.forEach((impact) => {
      events.push({
        id: `impact-${impact.id}`,
        type: "impact",
        date: impact.created_at,
        title: text.impactSection,
        detail: `${impact.impact_summary || impact.after_note || text.verified} · ${formatDate(impact.created_at, language)}`,
        value: impact.status || undefined,
      });
    });

    followups.forEach((followup) => {
      events.push({
        id: `followup-${followup.id}`,
        type: "followup",
        date: followup.created_at,
        title: text.issueOutcomes,
        detail: `${followup.status || "Update"} · ${formatDate(followup.created_at, language)}`,
      });
    });

    resolutionChecks.forEach((check) => {
      events.push({
        id: `resolution-${check.id}`,
        type: "resolution",
        date: check.created_at,
        title: text.issueOutcomes,
        detail: `${check.resolution_result || "Observation"} · ${formatDate(check.created_at, language)}`,
      });
    });

    return events
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 10);
  }, [issues, missions, completedQuests, learning, impacts, followups, resolutionChecks, language, text]);

  if (loading) {
    return (
      <main className="kf-my-impact-page kf-my-impact-loading" style={pageStyle}>
        <div className="kf-my-impact-loading-card" style={loadingCardStyle}>
          <div style={loadingIconStyle}>📊</div>
          <div style={loadingTitleStyle}>
            {text.loading}
          </div>
          <div style={loadingTextStyle}>
            {text.activityPreparing}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="kf-my-impact-page" style={pageStyle}>
      <div className="kf-my-impact-shell" style={containerStyle}>
        <header className="kf-my-impact-topbar" style={topNavStyle}>
          <div style={headerSideStyle}>
            <button
              className="kf-my-impact-back-button"
              type="button"
              onClick={() => router.push("/dashboard")}
              style={backButtonStyle}
            >
              <span style={backArrowStyle}>←</span>
              <span>{text.back.replace("← ", "")}</span>
            </button>
          </div>

          <div className="kf-my-impact-brand" style={brandStyle} aria-label="KarmaFacie My Impact">
            <div className="kf-my-impact-brand-mark" style={brandMarkStyle}>K</div>

            <div className="kf-my-impact-brand-copy" style={brandTextWrapStyle}>
              <div className="kf-my-impact-brand-name" style={brandNameStyle}>
                <span className="kf-my-impact-brand-karma">Karma</span>
                <span className="kf-my-impact-brand-facie" style={brandAccentStyle}>Facie</span>
              </div>

              <div className="kf-my-impact-brand-subtitle" style={brandSubtitleStyle}>MY IMPACT</div>
            </div>
          </div>

          <div
            style={{
              ...headerSideStyle,
              justifyContent: "flex-end",
            }}
          >
            <div style={languageControlStyle}>
              <span className="kf-my-impact-language-label" style={languageLabelStyle}>Language</span>

              <div className="kf-my-impact-language-switcher" style={languageSwitcherStyle} aria-label="Language selection">
                {(
                  [
                    ["en", "English"],
                    ["hi", "हिंदी"],
                    ["mr", "मराठी"],
                  ] as const
                ).map(([code, label]) => (
                  <button
                    className={`kf-my-impact-language-button ${language === code ? "is-active" : ""}`}
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    style={{
                      ...languageButtonStyle,
                      ...(language === code
                        ? activeLanguageButtonStyle
                        : {}),
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <header className="kf-my-impact-hero" style={headerStyle}>
          <div className="kf-my-impact-eyebrow" style={eyebrowStyle}>{text.eyebrow}</div>

          <h1 className="kf-my-impact-title" style={titleStyle}>{text.title}</h1>

          <p className="kf-my-impact-subtitle" style={subtitleStyle}>
            {text.subtitle}
          </p>
        </header>

        <section className="kf-my-impact-stats" style={statsGridStyle}>
          <Stat
            icon="📢"
            label={text.issuesReported}
            value={issues.length}
            sub={text.issuesReportedSub}
            tone="blue"
          />

          <Stat
            icon="✅"
            label={text.resolved}
            value={resolvedCount}
            sub={text.resolvedSub}
            tone="green"
          />

          <Stat
            icon="🔧"
            label={text.active}
            value={activeCount}
            sub={text.activeSub}
            tone="orange"
          />

          <Stat
            icon="🎯"
            label={text.questsCompleted}
            value={completedQuests.length}
            sub={text.questsCompletedSub}
            tone="lavender"
          />

          <Stat
            icon="⚡"
            label={text.xpEarned}
            value={`+${totalXp}`}
            sub={text.xpEarnedSub}
            tone="peach"
          />

          <Stat
            icon="📚"
            label={text.learningCompleted}
            value={completedLearning}
            sub={text.learningCompletedSub}
            tone="blue"
          />

          <Stat
            icon="✓"
            label={text.verifiedMissions}
            value={completedMissions}
            sub={text.verifiedMissionsSub}
            tone="green"
          />

          <Stat
            icon="✦"
            label={text.karmaCredits}
            value={passport?.total_karma_credits ?? 0}
            sub={text.karmaCreditsSub}
            tone="peach"
          />
        </section>

        <section className="kf-my-impact-journey" style={panelStyle}>
          <div style={eyebrowStyle}>
            KARMAFACIE
          </div>

          <h2 style={sectionTitleStyle}>
            {text.journey}
          </h2>

          <p style={mutedStyle}>
            {text.journeyDescription}
          </p>

          <div style={journeyPathHeaderStyle}>
            <span style={journeyPathEyebrowStyle}>{text.journeyPathDescription}</span>
          </div>

          <div className="kf-my-impact-journey-path" style={journeyPathStyle}>
            {journeyStages.map((stage, index) => (
              <div key={stage.key} className={`kf-my-impact-stage-wrap kf-stage-${stage.key}`} style={journeyStageWrapStyle}>
                <div
                  style={{
                    ...journeyStageStyle,
                    background: stage.background,
                  }}
                >
                  <div className="kf-my-impact-stage-icon" style={journeyStageIconStyle}>{stage.icon}</div>
                  <div className="kf-my-impact-stage-title" style={journeyStageTitleStyle}>{stage.title}</div>
                  <div className="kf-my-impact-stage-value" style={journeyStageValueStyle}>{stage.value}</div>
                  <div className="kf-my-impact-stage-detail" style={journeyStageDetailStyle}>{stage.detail}</div>
                </div>
                {index < journeyStages.length - 1 ? (
                  <div className="kf-my-impact-journey-connector" style={journeyConnectorStyle}>→</div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="kf-my-impact-activity-header" style={journeyActivityHeaderStyle}>
            <div className="kf-my-impact-activity-title" style={journeyActivityTitleStyle}>{text.recentActivity}</div>
            <div className="kf-my-impact-activity-sub" style={journeyActivitySubStyle}>
              {journeyEvents.length} {text.recentActivity.toLowerCase()}
            </div>
          </div>

          {journeyEvents.length === 0 ? (
            <div className="kf-my-impact-empty" style={emptyStyle}>
              <div style={emptyIconStyle}>🌱</div>
              <div className="kf-my-impact-empty-title" style={emptyTitleStyle}>
                {text.noActivity}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 22,
              }}
            >
              {journeyEvents.map((event) => {
                const icon =
                  event.type === "issue"
                    ? "📢"
                    : event.type === "mission"
                      ? "✦"
                      : event.type === "quest"
                        ? "🎯"
                        : event.type === "learning"
                          ? "📚"
                          : event.type === "impact"
                            ? "🌱"
                            : event.type === "resolution"
                              ? "✓"
                              : "↻";

                const background =
                  event.type === "issue"
                    ? "#edf5fb"
                    : event.type === "mission"
                      ? "#fff0e5"
                      : event.type === "quest"
                        ? "#f2eef9"
                        : event.type === "learning"
                          ? "#eff7e9"
                          : event.type === "impact"
                            ? "#fff4df"
                            : event.type === "resolution"
                              ? "#edf7e9"
                              : "#f4eff9";

                return (
                  <div key={event.id} className={`kf-my-impact-event kf-impact-event-${event.type}`} style={timelineRowStyle}>
                    <div
                      className="kf-my-impact-event-icon"
                      style={{
                        ...timelineIconStyle,
                        background,
                      }}
                    >
                      {icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong className="kf-my-impact-event-title" style={timelineTitleStyle}>
                        {event.title}
                      </strong>

                      <div style={mutedSmallStyle}>
                        {event.detail}
                      </div>
                    </div>

                    {event.status ? (
                      <span style={statusPillStyle(event.status)}>
                        {statusLabel(event.status, language)}
                      </span>
                    ) : event.value ? (
                      <span style={xpPillStyle}>
                        {event.value}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="kf-my-impact-impact-section" style={impactPanelStyle}>
          <div style={eyebrowStyle}>{text.impactStage}</div>
          <h2 style={sectionTitleStyle}>{text.impactSection}</h2>
          <p style={mutedStyle}>{text.impactDescription}</p>

          <div className="kf-my-impact-impact-grid" style={impactGridStyle}>
            <div className="kf-my-impact-metric kf-metric-impact" style={{ ...impactCardStyle, background: "linear-gradient(145deg, #fff7e9 0%, #ffedd7 100%)" }}>
              <div className="kf-my-impact-metric-icon" style={impactMetricIconStyle}>🌱</div>
              <div className="kf-my-impact-metric-value" style={impactMetricValueStyle}>{impacts.length}</div>
              <div className="kf-my-impact-metric-title" style={impactMetricTitleStyle}>{text.verifiedImpact}</div>
              <div className="kf-my-impact-metric-sub" style={impactMetricSubStyle}>{text.verifiedImpactSub}</div>
            </div>

            <div className="kf-my-impact-metric kf-metric-outcomes" style={{ ...impactCardStyle, background: "linear-gradient(145deg, #edf7e9 0%, #e5f1df 100%)" }}>
              <div className="kf-my-impact-metric-icon" style={impactMetricIconStyle}>✓</div>
              <div className="kf-my-impact-metric-value" style={impactMetricValueStyle}>{resolvedCount}</div>
              <div className="kf-my-impact-metric-title" style={impactMetricTitleStyle}>{text.issueOutcomes}</div>
              <div className="kf-my-impact-metric-sub" style={impactMetricSubStyle}>{text.issueOutcomesSub}</div>
            </div>

            <div className="kf-my-impact-metric kf-metric-evidence" style={{ ...impactCardStyle, background: "linear-gradient(145deg, #edf5fb 0%, #e5f0f7 100%)" }}>
              <div className="kf-my-impact-metric-icon" style={impactMetricIconStyle}>📎</div>
              <div className="kf-my-impact-metric-value" style={impactMetricValueStyle}>{impacts.filter((impact) => Boolean(impact.before_note || impact.after_note || impact.impact_summary)).length}</div>
              <div className="kf-my-impact-metric-title" style={impactMetricTitleStyle}>{text.evidenceRecorded}</div>
              <div className="kf-my-impact-metric-sub" style={impactMetricSubStyle}>{text.evidenceRecordedSub}</div>
            </div>
          </div>

          {impacts.length === 0 && resolutionChecks.length === 0 ? (
            <div className="kf-my-impact-impact-empty" style={impactEmptyStyle}>
              <div style={emptyIconStyle}>🌱</div>
              <div className="kf-my-impact-empty-title" style={emptyTitleStyle}>{text.noImpactYet}</div>
            </div>
          ) : (
            <div className="kf-my-impact-record-grid" style={impactRecordGridStyle}>
              {impacts.slice(0, 4).map((impact) => (
                <div key={impact.id} className="kf-my-impact-record" style={impactRecordStyle}>
                  <div style={impactRecordTopStyle}>
                    <span className="kf-my-impact-record-badge" style={impactRecordBadgeStyle}>🌱 {text.verified}</span>
                    <span className="kf-my-impact-record-date" style={impactRecordDateStyle}>{formatDate(impact.created_at, language)}</span>
                  </div>
                  <strong style={timelineTitleStyle}>{impact.impact_summary || text.verifiedImpact}</strong>
                  {impact.before_note ? <div className="kf-my-impact-record-note" style={impactNoteStyle}><b>Before:</b> {impact.before_note}</div> : null}
                  {impact.after_note ? <div className="kf-my-impact-record-note" style={impactNoteStyle}><b>After:</b> {impact.after_note}</div> : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="kf-my-impact-action-grid" style={threeColumnStyle}>
          <ActionCard
            icon="📢"
            title={text.reporting}
            description={text.reportingDescription}
            button={text.reportIssue}
            onClick={() =>
              router.push("/report-issue")
            }
            tone="peach"
          />

          <ActionCard
            icon="📚"
            title={text.learning}
            description={text.learningDescription}
            button={text.continueLearning}
            onClick={() =>
              router.push("/civic-learning")
            }
            tone="blue"
          />

          <ActionCard
            icon="🪪"
            title={text.passport}
            description={text.passportDescription}
            button={text.viewPassport}
            onClick={() =>
              router.push("/civic-passport")
            }
            tone="blue"
          />

          <ActionCard
            icon="👥"
            title={text.community}
            description={text.communityDescription}
            button={text.exploreCommunity}
            onClick={() =>
              router.push("/community")
            }
            tone="green"
          />
        </section>

        <p className="kf-my-impact-footer" style={footerStyle}>
          {text.footer}
        </p>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  tone:
    | "blue"
    | "green"
    | "orange"
    | "lavender"
    | "peach";
}) {
  return (
    <div
      className={`kf-my-impact-stat-card kf-stat-${tone}`}
      style={{
        ...statCardStyle,
        ...statCardTones[tone],
      }}
    >
      <div className="kf-my-impact-stat-icon" style={statIconStyle}>{icon}</div>

      <div className="kf-my-impact-stat-label" style={statLabelStyle}>{label}</div>

      <div className="kf-my-impact-stat-value" style={statValueStyle}>{value}</div>

      <div className="kf-my-impact-stat-sub" style={statSubStyle}>{sub}</div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  button,
  onClick,
  tone,
}: {
  icon: string;
  title: string;
  description: string;
  button: string;
  onClick: () => void;
  tone: "blue" | "green" | "peach";
}) {
  return (
    <div
      className={`kf-my-impact-action-card kf-action-${tone}`}
      style={{
        ...actionCardStyle,
        ...actionCardTones[tone],
      }}
    >
      <div className="kf-my-impact-action-icon" style={actionIconStyle}>{icon}</div>

      <h3 className="kf-my-impact-action-title" style={actionTitleStyle}>
        {title}
      </h3>

      <p className="kf-my-impact-action-description" style={actionDescriptionStyle}>
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        style={primaryButtonStyle}
      >
        {button}
      </button>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%), radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%), radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%), #f8f3ea",
  color: "#102033",
  padding: "20px 16px 74px",
  fontFamily: "var(--font-body, 'Quicksand', sans-serif)",
};

const topNavStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 18,
  minHeight: 84,
  padding: "10px 14px",
  marginBottom: 42,
  background: "rgba(255,255,255,.94)",
  border: "1px solid rgba(16,32,51,0.09)",
  borderRadius: 32,
  boxShadow: "0 14px 36px rgba(16,27,43,.07)",
  backdropFilter: "blur(18px)",
};

const headerSideStyle = {
  display: "flex",
  alignItems: "center",
  minWidth: 0,
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
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  fontSize: 31,
  lineHeight: 1,
  fontWeight: 800,
  boxShadow: "0 8px 18px rgba(255,122,0,.18)",
};

const brandTextWrapStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  justifyContent: "center",
};

const brandNameStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
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

const containerStyle = {
  maxWidth: 1100,
  margin: "0 auto",
};

const loadingCardStyle = {
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  color: "#718096",
  textAlign: "center" as const,
};

const loadingIconStyle = {
  width: 62,
  height: 62,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#edf5fb",
  fontSize: 28,
  marginBottom: 14,
};

const loadingTitleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  fontSize: 25,
  fontWeight: 600,
};

const loadingTextStyle = {
  color: "#8793a1",
  fontSize: 13,
  marginTop: 4,
};

const backButtonStyle = {
  background: "#ffffff",
  color: "#43566c",
  border: "1px solid rgba(16,32,51,0.10)",
  borderRadius: 999,
  padding: "9px 15px",
  cursor: "pointer",
  fontWeight: 700,
  fontFamily: "var(--font-body, 'Quicksand', sans-serif)",
  fontSize: 14,
  boxShadow: "0 6px 18px rgba(16,32,51,0.045)",
};

const headerTopRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap" as const,
};

const languageSwitcherStyle = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: 4,
  borderRadius: 999,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(16,32,51,0.10)",
  boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
};

const languageButtonStyle = {
  border: 0,
  background: "transparent",
  color: "#65748a",
  borderRadius: 999,
  padding: "8px 12px",
  cursor: "pointer",
  fontFamily: "var(--font-body, 'Quicksand', sans-serif)",
  fontSize: 12,
  fontWeight: 700,
};

const activeLanguageButtonStyle = {
  background: "#ff7a00",
  color: "#ffffff",
  boxShadow: "0 5px 14px rgba(255,122,0,0.18)",
};

const headerStyle = {
  margin: "27px 0 34px",
};

const eyebrowStyle = {
  color: "#8e755f",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
};

const titleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  fontSize: "clamp(40px, 6vw, 58px)",
  margin: "6px 0 9px",
  lineHeight: 0.96,
  fontWeight: 800,
  color: "#102033",
};

const subtitleStyle = {
  color: "#586b79",
  maxWidth: 770,
  lineHeight: 1.75,
  margin: 0,
  fontSize: 15,
  fontWeight: 500,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(165px, 1fr))",
  gap: 14,
  marginBottom: 26,
};

const statCardStyle = {
  border: "1px solid rgba(16,32,51,0.075)",
  borderRadius: 25,
  padding: 19,
  boxShadow: "0 12px 28px rgba(16,32,51,0.045)",
  minHeight: 155,
  boxSizing: "border-box" as const,
};

const statCardTones = {
  blue: {
    background: "linear-gradient(145deg, #f1f7fb 0%, #e8f2f9 100%)",
  },
  green: {
    background: "linear-gradient(145deg, #f2f7ed 0%, #eaf3e2 100%)",
  },
  orange: {
    background: "linear-gradient(145deg, #fff7e9 0%, #ffefd9 100%)",
  },
  lavender: {
    background: "linear-gradient(145deg, #f7f3fb 0%, #eee9f6 100%)",
  },
  peach: {
    background: "linear-gradient(145deg, #fff5ed 0%, #ffeadc 100%)",
  },
};

const statIconStyle = {
  width: 42,
  height: 42,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.90)",
  border: "1px solid rgba(255,255,255,0.92)",
  fontSize: 22,
  marginBottom: 12,
  boxShadow: "0 5px 12px rgba(16,32,51,0.035)",
};

const statLabelStyle = {
  color: "#65748a",
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.35,
};

const statValueStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  fontSize: 31,
  lineHeight: 1,
  fontWeight: 700,
  margin: "7px 0 6px",
};

const statSubStyle = {
  color: "#7a899b",
  fontSize: 11.5,
  lineHeight: 1.45,
};

const panelStyle = {
  background: "rgba(255,253,249,.94)",
  border: "1px solid rgba(16,32,51,0.075)",
  borderRadius: 30,
  padding: 27,
  marginBottom: 24,
  boxShadow: "0 16px 38px rgba(16,32,51,0.055)",
};

const sectionTitleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 600,
  margin: "7px 0 7px",
};

const mutedStyle = {
  color: "#718096",
  lineHeight: 1.7,
  fontSize: 14,
  margin: 0,
};

const mutedSmallStyle = {
  color: "#8793a1",
  fontSize: 11.5,
  lineHeight: 1.45,
  marginTop: 3,
};

const emptyStyle = {
  marginTop: 20,
  padding: 28,
  borderRadius: 18,
  background: "#f7f4ee",
  border: "1px solid rgba(16,32,51,0.07)",
  color: "#718096",
  textAlign: "center" as const,
};

const emptyIconStyle = {
  fontSize: 32,
  marginBottom: 7,
};

const emptyTitleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#536579",
  fontSize: 20,
  fontWeight: 600,
};

const timelineRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 13,
  padding: 14,
  borderRadius: 17,
  background: "#fbfaf7",
  border: "1px solid rgba(16,32,51,0.065)",
  boxShadow: "0 5px 15px rgba(16,32,51,0.025)",
};

const timelineIconStyle = {
  width: 40,
  height: 40,
  borderRadius: 13,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  fontSize: 19,
};

const timelineTitleStyle = {
  color: "#102033",
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  fontSize: 17,
  fontWeight: 600,
  lineHeight: 1.2,
};

function statusPillStyle(status: string | null) {
  if (status === "resolved") {
    return {
      padding: "6px 10px",
      borderRadius: 999,
      background: "#edf7e9",
      color: "#527b45",
      border: "1px solid rgba(82,123,69,0.10)",
      fontSize: 11,
      fontWeight: 800,
      whiteSpace: "nowrap" as const,
    };
  }

  if (status === "in_progress") {
    return {
      padding: "6px 10px",
      borderRadius: 999,
      background: "#edf5fb",
      color: "#4f718e",
      border: "1px solid rgba(79,113,142,0.10)",
      fontSize: 11,
      fontWeight: 800,
      whiteSpace: "nowrap" as const,
    };
  }

  if (status === "under_review") {
    return {
      padding: "6px 10px",
      borderRadius: 999,
      background: "#f2eef9",
      color: "#67558a",
      border: "1px solid rgba(103,85,138,0.10)",
      fontSize: 11,
      fontWeight: 800,
      whiteSpace: "nowrap" as const,
    };
  }

  return {
    padding: "6px 10px",
    borderRadius: 999,
    background: "#fff2df",
    color: "#a86724",
    border: "1px solid rgba(168,103,36,0.10)",
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap" as const,
  };
}

const xpPillStyle = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#fff0e5",
  color: "#e56800",
  border: "1px solid rgba(255,122,0,0.10)",
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: "nowrap" as const,
};

const journeyPathHeaderStyle = {
  marginTop: 26,
  marginBottom: 10,
  paddingLeft: 2,
};

const journeyPathEyebrowStyle = {
  color: "#6f7f91",
  fontSize: 12,
  lineHeight: 1.5,
  fontWeight: 700,
};

const journeyPathStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
  gap: 9,
  alignItems: "stretch",
  marginTop: 12,
};

const journeyStageWrapStyle = {
  position: "relative" as const,
  minWidth: 0,
};

const journeyStageStyle = {
  minHeight: 158,
  borderRadius: 20,
  border: "1px solid rgba(16,32,51,0.065)",
  padding: 15,
  display: "flex",
  flexDirection: "column" as const,
  boxSizing: "border-box" as const,
  boxShadow: "0 8px 20px rgba(16,32,51,0.035)",
};

const journeyStageIconStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.95)",
  fontSize: 18,
  marginBottom: 10,
  boxShadow: "0 5px 12px rgba(16,32,51,0.035)",
};

const journeyStageTitleStyle = {
  color: "#65748a",
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.2,
};

const journeyStageValueStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  fontSize: 30,
  lineHeight: 1,
  fontWeight: 700,
  margin: "9px 0 6px",
};

const journeyStageDetailStyle = {
  color: "#7a899b",
  fontSize: 11,
  lineHeight: 1.4,
};

const journeyConnectorStyle = {
  position: "absolute" as const,
  top: "50%",
  right: -14,
  transform: "translateY(-50%)",
  width: 22,
  height: 22,
  display: "grid",
  placeItems: "center",
  color: "#ff7a00",
  fontSize: 16,
  fontWeight: 800,
  zIndex: 2,
  textShadow: "0 2px 8px rgba(255,122,0,0.14)",
};

const journeyActivityHeaderStyle = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 28,
  marginBottom: 10,
  paddingTop: 20,
  borderTop: "1px solid rgba(16,32,51,0.075)",
};

const journeyActivityTitleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  fontSize: 20,
  fontWeight: 600,
};

const journeyActivitySubStyle = {
  color: "#9aa4af",
  fontSize: 11,
  fontWeight: 700,
};

const impactPanelStyle = {
  ...panelStyle,
  background: "rgba(255,253,249,.96)",
};

const impactGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 13,
  marginTop: 22,
};

const impactCardStyle = {
  border: "1px solid rgba(16,32,51,0.065)",
  borderRadius: 21,
  padding: 17,
  minHeight: 145,
  boxSizing: "border-box" as const,
  boxShadow: "0 8px 20px rgba(16,32,51,0.035)",
};

const impactMetricIconStyle = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,.9)",
  fontSize: 18,
  marginBottom: 10,
};

const impactMetricValueStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 700,
  color: "#102033",
};

const impactMetricTitleStyle = {
  color: "#526477",
  fontSize: 12,
  fontWeight: 800,
  marginTop: 7,
};

const impactMetricSubStyle = {
  color: "#7c8a99",
  fontSize: 11,
  lineHeight: 1.45,
  marginTop: 4,
};

const impactRecordGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
  gap: 12,
  marginTop: 15,
};

const impactRecordStyle = {
  padding: 16,
  borderRadius: 18,
  background: "#fbfaf7",
  border: "1px solid rgba(16,32,51,0.065)",
};

const impactRecordTopStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 10,
};

const impactRecordBadgeStyle = {
  color: "#527b45",
  background: "#edf7e9",
  borderRadius: 999,
  padding: "5px 9px",
  fontSize: 10.5,
  fontWeight: 800,
};

const impactRecordDateStyle = {
  color: "#9aa4af",
  fontSize: 10.5,
  fontWeight: 700,
};

const impactNoteStyle = {
  color: "#718096",
  fontSize: 12,
  lineHeight: 1.55,
  marginTop: 7,
};

const impactEmptyStyle = {
  marginTop: 18,
  padding: 22,
  borderRadius: 18,
  background: "#f7f4ee",
  border: "1px solid rgba(16,32,51,0.065)",
  textAlign: "center" as const,
};

const threeColumnStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 16,
};

const actionCardStyle = {
  border: "1px solid rgba(16,32,51,0.075)",
  borderRadius: 25,
  padding: 22,
  boxShadow: "0 12px 28px rgba(16,32,51,0.045)",
};

const actionCardTones = {
  peach: {
    background: "linear-gradient(145deg, #fff6ed 0%, #ffeadb 100%)",
  },
  blue: {
    background: "linear-gradient(145deg, #f2f8fc 0%, #e8f2f9 100%)",
  },
  green: {
    background: "linear-gradient(145deg, #f3f8ee 0%, #eaf2e3 100%)",
  },
};

const actionIconStyle = {
  width: 48,
  height: 48,
  borderRadius: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(255,255,255,0.95)",
  fontSize: 24,
  boxShadow: "0 6px 14px rgba(16,32,51,0.035)",
};

const actionTitleStyle = {
  fontFamily: "var(--font-display, 'Baloo 2', sans-serif)",
  color: "#102033",
  margin: "13px 0 7px",
  fontSize: 22,
  lineHeight: 1.1,
  fontWeight: 600,
};

const actionDescriptionStyle = {
  color: "#718096",
  lineHeight: 1.65,
  minHeight: 70,
  fontSize: 13.5,
  margin: "0 0 16px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #ff8612 0%, #ff7000 100%)",
  color: "#ffffff",
  border: "none",
  borderRadius: 999,
  padding: "10px 16px",
  fontWeight: 800,
  cursor: "pointer",
  fontFamily: "var(--font-body, 'Quicksand', sans-serif)",
  fontSize: 12.5,
  boxShadow: "0 7px 17px rgba(255,122,0,0.19)",
};

const footerStyle = {
  textAlign: "center" as const,
  color: "#8a96a5",
  fontSize: 12,
  lineHeight: 1.5,
  marginTop: 34,
};
