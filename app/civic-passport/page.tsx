"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type Passport = {
  user_id: string;
  total_karma_credits: number;
  missions_submitted: number;
  missions_verified: number;
  missions_rejected: number;
  current_league_id: string | null;
  current_league_name: string | null;
  current_team_id: string | null;
  current_team_name: string | null;
  current_team_type: string | null;
};

type KarmaEntry = {
  id: string;
  points_delta: number;
  source_type: string;
  reason: string;
  created_at: string;
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

type ParticipationSnapshot = {
  issues_reported: number;
  quests_completed: number;
  learning_completed: number;
  xp_earned: number;
};

type JourneyKind =
  | "learning"
  | "quest"
  | "issue"
  | "followup"
  | "issue_status"
  | "resolution"
  | "mission"
  | "impact"
  | "karma";

type JourneyEvent = {
  id: string;
  kind: JourneyKind;
  date: string;
  title: string;
  description: string;
  status?: string | null;
  meta?: string | null;
  verified?: boolean;
};

const ui: Record<
  Language,
  {
    back: string;
    language: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    karma: string;
    karmaSub: string;
    verifiedActions: string;
    verifiedActionsSub: string;
    submitted: string;
    verified: string;
    rejected: string;
    participation: string;
    participationSub: string;
    issues: string;
    quests: string;
    learning: string;
    xp: string;
    league: string;
    noLeague: string;
    team: string;
    journey: string;
    journeySub: string;
    learn: string;
    learnSub: string;
    act: string;
    actSub: string;
    verify: string;
    verifySub: string;
    earn: string;
    earnSub: string;
    activity: string;
    activitySub: string;
    noKarma: string;
    timeline: string;
    timelineSub: string;
    all: string;
    learningFilter: string;
    issuesFilter: string;
    missionsFilter: string;
    impactFilter: string;
    noJourney: string;
    learned: string;
    observed: string;
    reported: string;
    followedUp: string;
    acted: string;
    evidence: string;
    resolution: string;
    recorded: string;
    completed: string;
    rejectedStatus: string;
    verifiedStatus: string;
    missions: string;
    missionsSub: string;
    noMissions: string;
    points: string;
    verifiedOn: string;
    viewImpact: string;
    viewLeagues: string;
    unavailable: string;
    loading: string;
    signedOut: string;
  }
> = {
  en: {
    back: "Dashboard",
    language: "Language",
    eyebrow: "YOUR CIVIC RECORD",
    title: "Civic Passport",
    subtitle: "The Record of Your Good Karmic Journey",
    description:
      "A personal record of the civic actions you take and the verified contributions you build over time.",
    karma: "Karma Credits",
    karmaSub: "Credits earned from verified civic actions.",
    verifiedActions: "Verified actions",
    verifiedActionsSub: "Real-world civic missions confirmed through review.",
    submitted: "Missions submitted",
    verified: "Missions verified",
    rejected: "Missions rejected",
    participation: "Participation Snapshot",
    participationSub: "A quick view of the learning and civic participation connected to your record.",
    issues: "Issues reported",
    quests: "Quests completed",
    learning: "Learning completed",
    xp: "Quest XP earned",
    league: "Current League",
    noLeague: "No active league",
    team: "Current Team",
    journey: "Your Civic Journey",
    journeySub: "Learn, act, verify and earn — all in one civic record.",
    learn: "Learn",
    learnSub: "Build civic knowledge.",
    act: "Act",
    actSub: "Take part in real-world missions.",
    verify: "Verify",
    verifySub: "Build a trusted participation record.",
    earn: "Earn",
    earnSub: "Receive Karma Credits for verified action.",
    activity: "Karma Activity",
    activitySub: "A transparent record of Karma Credits added to your account.",
    noKarma: "No Karma transactions yet.",
    timeline: "Your Civic Journey",
    timelineSub: "A chronological record of the learning, issues, actions, evidence, verification and impact connected to your civic participation.",
    all: "All",
    learningFilter: "Learning",
    issuesFilter: "Issues",
    missionsFilter: "Missions",
    impactFilter: "Impact",
    noJourney: "Your civic journey will appear here as you learn, participate, report issues and build verified contributions.",
    learned: "Learned",
    observed: "Observed",
    reported: "Reported",
    followedUp: "Followed up",
    acted: "Acted",
    evidence: "Evidence / Impact",
    resolution: "Resolution check",
    recorded: "Recorded",
    completed: "Completed",
    rejectedStatus: "Rejected",
    verifiedStatus: "Verified",
    missions: "Verified Civic Missions",
    missionsSub: "Your verified real-world civic actions.",
    noMissions: "No verified missions yet.",
    points: "Karma Credits",
    verifiedOn: "Verified",
    viewImpact: "View My Impact →",
    viewLeagues: "Explore Leagues →",
    unavailable: "Activity history is currently unavailable.",
    loading: "Loading Civic Passport...",
    signedOut: "Please sign in to view your Civic Passport.",
  },
  hi: {
    back: "डैशबोर्ड",
    language: "भाषा",
    eyebrow: "आपका नागरिक रिकॉर्ड",
    title: "सिविक पासपोर्ट",
    subtitle: "आपकी अच्छी कर्म यात्रा का रिकॉर्ड",
    description: "आपके नागरिक कार्यों और समय के साथ किए गए सत्यापित योगदान का व्यक्तिगत रिकॉर्ड।",
    karma: "कर्मा क्रेडिट्स",
    karmaSub: "सत्यापित नागरिक कार्यों से अर्जित क्रेडिट्स।",
    verifiedActions: "सत्यापित कार्य",
    verifiedActionsSub: "समीक्षा के माध्यम से पुष्टि किए गए वास्तविक नागरिक मिशन।",
    submitted: "जमा किए गए मिशन",
    verified: "सत्यापित मिशन",
    rejected: "अस्वीकृत मिशन",
    participation: "भागीदारी का सारांश",
    participationSub: "आपके रिकॉर्ड से जुड़ी सीखने और नागरिक भागीदारी की एक झलक।",
    issues: "रिपोर्ट की गई समस्याएँ",
    quests: "पूरी की गई क्वेस्ट",
    learning: "पूरा किया गया सीखना",
    xp: "प्राप्त क्वेस्ट XP",
    league: "वर्तमान लीग",
    noLeague: "कोई सक्रिय लीग नहीं",
    team: "वर्तमान टीम",
    journey: "आपकी नागरिक यात्रा",
    journeySub: "सीखें, कार्य करें, सत्यापित करें और अर्जित करें — एक ही नागरिक रिकॉर्ड में।",
    learn: "सीखें",
    learnSub: "नागरिक ज्ञान बढ़ाएँ।",
    act: "कार्य करें",
    actSub: "वास्तविक नागरिक मिशनों में भाग लें।",
    verify: "सत्यापन",
    verifySub: "विश्वसनीय भागीदारी रिकॉर्ड बनाएँ।",
    earn: "अर्जित करें",
    earnSub: "सत्यापित कार्यों के लिए कर्मा क्रेडिट्स पाएँ।",
    activity: "कर्मा गतिविधि",
    activitySub: "आपके खाते में जोड़े गए कर्मा क्रेडिट्स का पारदर्शी रिकॉर्ड।",
    noKarma: "अभी कोई कर्मा लेनदेन नहीं है।",
    timeline: "आपकी नागरिक यात्रा",
    timelineSub: "आपकी सीख, समस्याओं, कार्रवाइयों, प्रमाण, सत्यापन और प्रभाव से जुड़ी नागरिक भागीदारी की कालानुक्रमिक नोंद।",
    all: "सभी",
    learningFilter: "सीखना",
    issuesFilter: "समस्याएँ",
    missionsFilter: "मिशन",
    impactFilter: "प्रभाव",
    noJourney: "जैसे-जैसे आप सीखेंगे, भाग लेंगे, समस्याएँ रिपोर्ट करेंगे और सत्यापित योगदान बनाएँगे, आपकी नागरिक यात्रा यहाँ दिखाई देगी।",
    learned: "सीखा",
    observed: "देखा",
    reported: "रिपोर्ट किया",
    followedUp: "फॉलो-अप किया",
    acted: "कार्य किया",
    evidence: "प्रमाण / प्रभाव",
    resolution: "समाधान जाँच",
    recorded: "दर्ज",
    completed: "पूर्ण",
    rejectedStatus: "अस्वीकृत",
    verifiedStatus: "सत्यापित",
    missions: "सत्यापित नागरिक मिशन",
    missionsSub: "आपकी सत्यापित वास्तविक नागरिक गतिविधियाँ।",
    noMissions: "अभी कोई सत्यापित मिशन नहीं है।",
    points: "कर्मा क्रेडिट्स",
    verifiedOn: "सत्यापित",
    viewImpact: "मेरा प्रभाव देखें →",
    viewLeagues: "लीग देखें →",
    unavailable: "गतिविधि इतिहास अभी उपलब्ध नहीं है।",
    loading: "सिविक पासपोर्ट लोड हो रहा है...",
    signedOut: "अपना सिविक पासपोर्ट देखने के लिए साइन इन करें।",
  },
  mr: {
    back: "डॅशबोर्ड",
    language: "भाषा",
    eyebrow: "तुमचा नागरिक रेकॉर्ड",
    title: "सिविक पासपोर्ट",
    subtitle: "तुमच्या चांगल्या कर्मप्रवासाची नोंद",
    description: "तुम्ही केलेल्या नागरी कृतींचा आणि कालांतराने निर्माण केलेल्या सत्यापित योगदानांचा वैयक्तिक रेकॉर्ड.",
    karma: "कर्मा क्रेडिट्स",
    karmaSub: "सत्यापित नागरी कृतींमधून मिळवलेले क्रेडिट्स.",
    verifiedActions: "सत्यापित कृती",
    verifiedActionsSub: "पुनरावलोकनातून पुष्टी झालेली प्रत्यक्ष नागरी मिशन.",
    submitted: "सादर केलेले मिशन",
    verified: "सत्यापित मिशन",
    rejected: "नाकारलेले मिशन",
    participation: "सहभागाचा आढावा",
    participationSub: "तुमच्या रेकॉर्डशी जोडलेल्या शिकण्याचा आणि नागरी सहभागाचा संक्षिप्त आढावा.",
    issues: "नोंदवलेल्या समस्या",
    quests: "पूर्ण केलेल्या क्वेस्ट",
    learning: "पूर्ण केलेले शिक्षण",
    xp: "मिळवलेले क्वेस्ट XP",
    league: "सध्याची लीग",
    noLeague: "सक्रिय लीग नाही",
    team: "सध्याची टीम",
    journey: "तुमचा नागरिक प्रवास",
    journeySub: "शिका, कृती करा, सत्यापित करा आणि मिळवा — एकाच नागरिक रेकॉर्डमध्ये.",
    learn: "शिका",
    learnSub: "नागरी ज्ञान वाढवा.",
    act: "कृती करा",
    actSub: "प्रत्यक्ष नागरी मिशनमध्ये सहभागी व्हा.",
    verify: "सत्यापन",
    verifySub: "विश्वसनीय सहभागाची नोंद तयार करा.",
    earn: "मिळवा",
    earnSub: "सत्यापित कृतींसाठी कर्मा क्रेडिट्स मिळवा.",
    activity: "कर्मा गतिविधी",
    activitySub: "तुमच्या खात्यात जमा झालेल्या कर्मा क्रेडिट्सची पारदर्शक नोंद.",
    noKarma: "अजून कोणतेही कर्मा व्यवहार नाहीत.",
    timeline: "तुमचा नागरिक प्रवास",
    timelineSub: "तुमच्या शिकण्याशी, समस्या, कृती, पुरावे, सत्यापन आणि प्रभावाशी जोडलेल्या नागरी सहभागाची कालानुक्रमिक नोंद.",
    all: "सर्व",
    learningFilter: "शिकणे",
    issuesFilter: "समस्या",
    missionsFilter: "मिशन",
    impactFilter: "प्रभाव",
    noJourney: "तुम्ही शिकत, सहभागी होत, समस्या नोंदवत आणि सत्यापित योगदान तयार करत गेल्यावर तुमचा नागरिक प्रवास येथे दिसेल.",
    learned: "शिकलात",
    observed: "निरीक्षण केले",
    reported: "नोंदवले",
    followedUp: "फॉलो-अप केले",
    acted: "कृती केली",
    evidence: "पुरावा / प्रभाव",
    resolution: "निराकरण तपासणी",
    recorded: "नोंदवले",
    completed: "पूर्ण",
    rejectedStatus: "नाकारले",
    verifiedStatus: "सत्यापित",
    missions: "सत्यापित नागरी मिशन",
    missionsSub: "तुमच्या सत्यापित प्रत्यक्ष नागरी कृती.",
    noMissions: "अजून कोणतेही सत्यापित मिशन नाही.",
    points: "कर्मा क्रेडिट्स",
    verifiedOn: "सत्यापित",
    viewImpact: "माझा प्रभाव पहा →",
    viewLeagues: "लीग पहा →",
    unavailable: "गतिविधी इतिहास सध्या उपलब्ध नाही.",
    loading: "सिविक पासपोर्ट लोड होत आहे...",
    signedOut: "तुमचा सिविक पासपोर्ट पाहण्यासाठी साइन इन करा.",
  },
};

function formatDate(date: string | null, language: Language) {
  if (!date) return "—";
  const locale = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function localizedMissionTitle(mission: Mission, language: Language) {
  return mission.title_i18n?.[language] || mission.title;
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 8% 0%, rgba(255,122,0,0.08), transparent 23%), radial-gradient(circle at 92% 8%, rgba(171,204,229,0.15), transparent 28%), #f8f3ea",
  color: "#102033",
  padding: "22px 20px 80px",
  fontFamily: "'Quicksand', sans-serif",
};

const shellStyle = {
  maxWidth: 1100,
  margin: "0 auto",
};

const topbarStyle = {
  position: "relative" as const,
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: 18,
  width: "100%",
  padding: "16px 22px",
  marginBottom: 24,
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(16,32,51,0.08)",
  borderRadius: 32,
  boxShadow: "0 10px 28px rgba(16,32,51,0.055)",
};

const brandLockupStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 11,
};

const brandBoxStyle = {
  width: 42,
  height: 42,
  borderRadius: 13,
  display: "grid",
  placeItems: "center",
  background: "#ff7a00",
  color: "#102033",
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 24,
  fontWeight: 800,
  boxShadow: "0 8px 20px rgba(255,122,0,0.16)",
};

const brandNameStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 21,
  lineHeight: 1,
  fontWeight: 700,
  color: "#102033",
};

const brandAccentStyle = { color: "#ff7a00" };

const brandCaptionStyle = {
  marginTop: 4,
  color: "#8793a1",
  fontSize: 9.5,
  fontWeight: 800,
  letterSpacing: "1.25px",
};

const languageStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 7,
};

const languageLabelStyle = {
  color: "#8793a1",
  fontSize: 11,
  fontWeight: 700,
};

const selectStyle = {
  appearance: "none" as const,
  border: "1px solid rgba(16,32,51,0.10)",
  background: "rgba(255,255,255,0.86)",
  color: "#536579",
  borderRadius: 999,
  padding: "9px 34px 9px 13px",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 12,
  fontWeight: 700,
  boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
};

const backStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  border: "1px solid rgba(16,32,51,0.10)",
  background: "#ffffff",
  color: "#536579",
  padding: "11px 18px",
  borderRadius: 999,
  margin: 0,
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 13,
  fontWeight: 700,
  boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
};

const eyebrowStyle = {
  color: "#ff7a00",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "1.55px",
  textTransform: "uppercase" as const,
};

const heroTitleStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: "clamp(42px, 6vw, 62px)",
  lineHeight: 1.04,
  fontWeight: 700,
  color: "#102033",
  margin: "0 0 12px",
};

const subtitleStyle = {
  maxWidth: 720,
  margin: "8px 0 0",
  color: "#102033",
  fontSize: 19,
  lineHeight: 1.4,
  fontWeight: 700,
  letterSpacing: "-0.01em",
};

const descriptionStyle = {
  maxWidth: 720,
  margin: "7px 0 0",
  color: "#718096",
  fontSize: 15,
  lineHeight: 1.7,
  fontWeight: 500,
};

const panelStyle = {
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.08)",
  borderRadius: 24,
  boxShadow: "0 12px 32px rgba(16,32,51,0.055)",
};

const sectionTitleStyle = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 27,
  lineHeight: 1.1,
  fontWeight: 600,
  color: "#102033",
  margin: 0,
};

const mutedStyle = {
  color: "#718096",
  fontSize: 13.5,
  lineHeight: 1.65,
  margin: "5px 0 0",
};

export default function CivicPassportPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const text = ui[language];

  const [passport, setPassport] = useState<Passport | null>(null);
  const [karmaEntries, setKarmaEntries] = useState<KarmaEntry[]>([]);
  const [verifiedMissions, setVerifiedMissions] = useState<Array<MissionCompletion & { mission: Mission | null }>>([]);
  const [journeyEvents, setJourneyEvents] = useState<JourneyEvent[]>([]);
  const [journeyFilter, setJourneyFilter] = useState<"all" | "learning" | "issues" | "missions" | "impact">("all");
  const [participation, setParticipation] = useState<ParticipationSnapshot>({
    issues_reported: 0,
    quests_completed: 0,
    learning_completed: 0,
    xp_earned: 0,
  });
  const [historyError, setHistoryError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPassport() {
    try {
      setLoading(true);
      setError("");
      setHistoryError(false);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error(text.signedOut);

      const { data: passportData, error: passportError } = await supabase.rpc(
        "get_my_civic_passport"
      );

      if (passportError) throw passportError;

      const row = Array.isArray(passportData) ? passportData[0] : passportData;
      if (!row) throw new Error("Civic Passport data could not be loaded.");
      setPassport(row as Passport);

      const [
        ledgerResult,
        completionResult,
        issuesResult,
        questsResult,
        learningResult,
        followupsResult,
        issueHistoryResult,
        resolutionResult,
        impactsResult,
      ] = await Promise.all([
        supabase
          .from("civic_points_ledger")
          .select("id,points_delta,source_type,reason,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("civic_mission_completions")
          .select("id,mission_id,status,submitted_at,reviewed_at,notes")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false })
          .limit(30),
        supabase
          .from("civic_issues")
          .select("id,title,category,status,reported_at,updated_at,location_text")
          .eq("user_id", user.id)
          .order("reported_at", { ascending: false })
          .limit(30),
        supabase
          .from("civic_quest_progress")
          .select("id,quest_id,score,xp_earned,completed,created_at,updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("learning_progress")
          .select("id,topic,completed,score,completed_at,created_at,updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }),
        supabase
          .from("civic_issue_followups")
          .select("id,issue_id,status,note,verification_status,verified_at,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("civic_issue_status_history")
          .select("id,issue_id,old_status,new_status,note,actor_type,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("civic_issue_resolution_checks")
          .select("id,issue_id,issue_status_at_check,resolution_result,note,created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("civic_mission_impacts")
          .select("id,completion_id,impact_type,before_note,after_note,impact_summary,status,reviewed_at,created_at,updated_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);

      setParticipation({
        issues_reported: issuesResult.error ? 0 : (issuesResult.data || []).length,
        quests_completed: questsResult.error ? 0 : (questsResult.data || []).filter((row) => row.completed === true).length,
        learning_completed: learningResult.error ? 0 : (learningResult.data || []).filter((row) => row.completed === true).length,
        xp_earned: questsResult.error
          ? 0
          : (questsResult.data || []).reduce((total, row) => total + (typeof row.xp_earned === "number" ? row.xp_earned : 0), 0),
      });

      if (ledgerResult.error || completionResult.error) {
        console.error("Civic Passport history loading error:", {
          ledger: ledgerResult.error,
          completions: completionResult.error,
        });
        setHistoryError(true);
      } else {
        const ledger = (ledgerResult.data || []) as KarmaEntry[];
        const completions = (completionResult.data || []) as MissionCompletion[];
        setKarmaEntries(ledger);

        const missionIds = Array.from(
          new Set([
            ...completions.map((completion) => completion.mission_id),
            ...((impactsResult.data || []) as Array<{ completion_id: string }>).map((impact) => {
              const completion = completions.find((item) => item.id === impact.completion_id);
              return completion?.mission_id || "";
            }),
          ].filter(Boolean))
        );

        let missionMap = new Map<string, Mission>();

        if (missionIds.length > 0) {
          const { data: missionsData, error: missionsError } = await supabase
            .from("civic_missions")
            .select("id,title,title_i18n,points")
            .in("id", missionIds);

          if (missionsError) {
            console.error("Civic Passport mission history error:", missionsError);
            setHistoryError(true);
          } else {
            missionMap = new Map(
              ((missionsData || []) as Mission[]).map((mission) => [mission.id, mission])
            );
          }
        }

        setVerifiedMissions(
          completions
            .filter((completion) => completion.status === "verified")
            .map((completion) => ({
              ...completion,
              mission: missionMap.get(completion.mission_id) || null,
            }))
        );

        const issueMap = new Map(
          ((issuesResult.data || []) as Array<{ id: string; title: string | null; category: string | null }>)
            .map((issue) => [issue.id, issue])
        );

        const events: JourneyEvent[] = [];

        for (const row of learningResult.data || []) {
          if (row.completed) {
            events.push({
              id: `learning-${row.id}`,
              kind: "learning",
              date: row.completed_at || row.updated_at || row.created_at,
              title: text.learned,
              description: row.topic || text.learning,
              status: text.completed,
              verified: true,
            });
          }
        }

        for (const row of questsResult.data || []) {
          if (row.completed) {
            events.push({
              id: `quest-${row.id}`,
              kind: "quest",
              date: row.updated_at || row.created_at,
              title: text.learned,
              description: `Civic Quest · ${row.quest_id}`,
              meta: typeof row.xp_earned === "number" ? `+${row.xp_earned} XP` : null,
              status: text.completed,
              verified: true,
            });
          }
        }

        for (const row of issuesResult.data || []) {
          events.push({
            id: `issue-${row.id}`,
            kind: "issue",
            date: row.reported_at || row.updated_at,
            title: text.reported,
            description: row.title || row.category || "Civic issue",
            meta: row.location_text || row.category || null,
            status: row.status || null,
          });
        }

        for (const row of followupsResult.data || []) {
          events.push({
            id: `followup-${row.id}`,
            kind: "followup",
            date: row.verified_at || row.created_at,
            title: text.followedUp,
            description: row.note || issueMap.get(row.issue_id)?.title || "Civic issue follow-up",
            status: row.verification_status || row.status || null,
            verified: row.verification_status === "VERIFIED",
          });
        }

        for (const row of issueHistoryResult.data || []) {
          if (!issueMap.has(row.issue_id)) continue;
          events.push({
            id: `issue-status-${row.id}`,
            kind: "issue_status",
            date: row.created_at,
            title: text.observed,
            description:
              row.note ||
              `${row.old_status ? `${row.old_status} → ` : ""}${row.new_status}`,
            meta: issueMap.get(row.issue_id)?.title || null,
            status: row.new_status || null,
          });
        }

        for (const row of resolutionResult.data || []) {
          events.push({
            id: `resolution-${row.id}`,
            kind: "resolution",
            date: row.created_at,
            title: text.resolution,
            description: row.note || row.resolution_result || "Resolution check recorded",
            meta: issueMap.get(row.issue_id)?.title || null,
            status: row.resolution_result || null,
          });
        }

        for (const row of completions) {
          const mission = missionMap.get(row.mission_id);
          const isVerified = row.status === "verified";
          events.push({
            id: `mission-${row.id}`,
            kind: "mission",
            date: row.reviewed_at || row.submitted_at || new Date().toISOString(),
            title: isVerified ? text.verifiedStatus : row.status === "rejected" ? text.rejectedStatus : text.acted,
            description: mission ? localizedMissionTitle(mission, language) : "Civic Mission",
            meta: mission ? `${mission.points} ${text.points}` : null,
            status: row.status || null,
            verified: isVerified,
          });
        }

        const completionMap = new Map(completions.map((completion) => [completion.id, completion]));

        for (const row of impactsResult.data || []) {
          const completion = completionMap.get(row.completion_id);
          const mission = completion ? missionMap.get(completion.mission_id) : null;
          events.push({
            id: `impact-${row.id}`,
            kind: "impact",
            date: row.reviewed_at || row.updated_at || row.created_at,
            title: text.evidence,
            description:
              row.impact_summary ||
              row.after_note ||
              row.before_note ||
              (mission ? localizedMissionTitle(mission, language) : text.evidence),
            meta: row.impact_type || null,
            status: row.status || null,
            verified: row.status === "verified",
          });
        }

        for (const row of ledger) {
          events.push({
            id: `karma-${row.id}`,
            kind: "karma",
            date: row.created_at,
            title: text.earn,
            description: row.reason || text.karma,
            meta: `${row.points_delta >= 0 ? "+" : ""}${row.points_delta} ${text.points}`,
            status: row.source_type || null,
            verified: row.points_delta > 0,
          });
        }

        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setJourneyEvents(events);
      }

    } catch (err) {
      console.error("Civic Passport load error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null
            ? JSON.stringify(err)
            : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPassport();
  }, []);

  if (loading) {
    return (
      <main className={`kf-civic-passport-page kf-passport-${language}`} data-language={language} style={pageStyle}>
        <div className="kf-civic-passport-loading-shell" style={{ ...shellStyle, minHeight: "calc(100vh - 100px)", display: "grid", placeItems: "center" }}>
          <div className="kf-civic-passport-loading-card" style={{ textAlign: "center" }}>
            <div style={{ ...brandBoxStyle, margin: "0 auto 14px" }}>K</div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 24, fontWeight: 600 }}>{text.loading}</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`kf-civic-passport-page kf-passport-${language}`} data-language={language} style={pageStyle}>
        <div className="kf-civic-passport-shell" style={shellStyle}>
          <header className="kf-civic-passport-topbar" style={topbarStyle}>
            <div />
            <div style={brandLockupStyle}>
              <div style={brandBoxStyle}>K</div>
              <div>
                <div style={brandNameStyle}>Krut<span style={brandAccentStyle}>Bharat</span></div>
                <div style={brandCaptionStyle}>CIVIC PASSPORT</div>
              </div>
            </div>
            <div />
          </header>
          <div className="kf-civic-passport-error-card" style={{ ...panelStyle, marginTop: 28, padding: 28 }}>
            <div style={eyebrowStyle}>KrutBharat</div>
            <h1 style={{ ...sectionTitleStyle, marginTop: 8 }}>{text.title}</h1>
            <p style={{ ...mutedStyle, color: "#b45353", marginTop: 12 }}>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!passport) return null;

  return (
    <main className={`kf-civic-passport-page kf-passport-${language}`} data-language={language} style={pageStyle}>
      <div className="kf-civic-passport-shell" style={shellStyle}>
        <header className="kf-civic-passport-topbar" style={topbarStyle}>
          <div>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              style={backStyle}
            >
              <span>←</span>
              {text.back}
            </button>
          </div>

          <div style={brandLockupStyle}>
            <div style={brandBoxStyle}>K</div>
            <div>
              <div style={brandNameStyle}>
                Krut<span style={brandAccentStyle}>Bharat</span>
              </div>
              <div style={brandCaptionStyle}>CIVIC PASSPORT</div>
            </div>
          </div>

          <label style={languageStyle}>
            <span style={languageLabelStyle}>{text.language}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              aria-label={text.language}
              style={selectStyle}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        <section className="kf-civic-passport-hero" style={{ margin: "44px 0 34px" }}>
          <div className="kf-civic-passport-hero-eyebrow" style={eyebrowStyle}>{text.eyebrow}</div>
          <h1 className="kf-civic-passport-hero-title" style={heroTitleStyle}>{text.title}</h1>
          <p style={subtitleStyle}>{text.subtitle}</p>
          <p style={descriptionStyle}>{text.description}</p>
        </section>

        <section
          className="kf-civic-passport-karma"
          style={{
            ...panelStyle,
            position: "relative",
            overflow: "hidden",
            padding: "30px 30px 27px",
            background:
              "linear-gradient(135deg, #fff0df 0%, #ffe3c4 58%, #f8eee2 100%)",
            borderColor: "rgba(255,122,0,0.12)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 190,
              height: 190,
              borderRadius: "50%",
              right: -65,
              top: -75,
              background: "rgba(255,255,255,0.30)",
            }}
          />
          <div style={{ position: "relative" }}>
            <div style={{ color: "#9a6b43", fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {text.karma}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 13, marginTop: 5 }}>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 70, lineHeight: 0.95, fontWeight: 700, color: "#102033" }}>
                {passport.total_karma_credits}
              </div>
              <div style={{ paddingBottom: 7, color: "#8a725d", fontSize: 12, fontWeight: 700 }}>
                {text.verifiedActions}
              </div>
            </div>
            <p style={{ ...mutedStyle, color: "#7e6c5b", marginTop: 10 }}>{text.karmaSub}</p>
          </div>
        </section>

        <section className="kf-civic-passport-mission-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: 14, marginTop: 18 }}>
          {[
            { label: text.submitted, value: passport.missions_submitted, icon: "📋", bg: "#edf5fb" },
            { label: text.verified, value: passport.missions_verified, icon: "✓", bg: "#eff7e9" },
            { label: text.rejected, value: passport.missions_rejected, icon: "↺", bg: "#f7f2ec" },
          ].map((stat, index) => (
            <div key={stat.label} className={`kf-passport-mission-stat kf-passport-mission-stat-${index + 1}`} style={{ ...panelStyle, padding: 20, background: stat.bg, boxShadow: "0 8px 22px rgba(16,32,51,0.045)" }}>
              <div style={{ width: 39, height: 39, borderRadius: 13, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.72)", fontSize: 18, marginBottom: 12 }}>
                {stat.icon}
              </div>
              <div style={{ color: "#65748a", fontSize: 11, fontWeight: 800, letterSpacing: "0.5px" }}>{stat.label}</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 32, lineHeight: 1, fontWeight: 700, marginTop: 7 }}>{stat.value}</div>
            </div>
          ))}
        </section>

        <section className="kf-civic-passport-participation" style={{ ...panelStyle, marginTop: 18, padding: 26 }}>
          <div>
            <div style={eyebrowStyle}>{text.participation}</div>
            <h2 style={{ ...sectionTitleStyle, marginTop: 5 }}>{text.participation}</h2>
            <p style={mutedStyle}>{text.participationSub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginTop: 18 }}>
            {[
              { label: text.issues, value: participation.issues_reported, icon: "📢", bg: "#edf5fb" },
              { label: text.quests, value: participation.quests_completed, icon: "🎯", bg: "#f2eef9" },
              { label: text.learning, value: participation.learning_completed, icon: "📚", bg: "#eff7e9" },
              { label: text.xp, value: `+${participation.xp_earned}`, icon: "⚡", bg: "#fff0e5" },
            ].map((stat, index) => (
              <div key={stat.label} className={`kf-passport-participation-stat kf-passport-participation-stat-${index + 1}`} style={{ padding: 15, borderRadius: 17, background: stat.bg, border: "1px solid rgba(16,32,51,0.06)" }}>
                <div style={{ fontSize: 17 }}>{stat.icon}</div>
                <div style={{ marginTop: 8, color: "#65748a", fontSize: 10.5, fontWeight: 800 }}>{stat.label}</div>
                <div style={{ marginTop: 3, color: "#102033", fontFamily: "'Baloo 2', sans-serif", fontSize: 25, fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="kf-civic-passport-league" style={{ ...panelStyle, marginTop: 18, padding: 26 }}>
          <div style={eyebrowStyle}>{text.league}</div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 18, marginTop: 7 }}>
            <div>
              <h2 style={sectionTitleStyle}>{passport.current_league_name || text.noLeague}</h2>
              {passport.current_team_name && (
                <div style={{ marginTop: 11, color: "#65748a", fontSize: 13 }}>
                  <strong style={{ color: "#102033" }}>{passport.current_team_name}</strong>
                  {passport.current_team_type ? ` · ${passport.current_team_type}` : ""}
                </div>
              )}
            </div>
            <div className="kf-civic-passport-team-card" style={{ minWidth: 150, padding: "13px 15px", borderRadius: 17, background: "#f7f4ee", border: "1px solid rgba(16,32,51,0.06)" }}>
              <div style={{ color: "#8793a1", fontSize: 10, fontWeight: 800, letterSpacing: "0.8px", textTransform: "uppercase" }}>{text.team}</div>
              <div style={{ marginTop: 4, color: "#102033", fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 600 }}>
                {passport.current_team_name || "—"}
              </div>
            </div>
          </div>
        </section>

        <section className="kf-civic-passport-journey" style={{ marginTop: 34 }}>
          <div style={{ marginBottom: 15 }}>
            <div style={eyebrowStyle}>{text.journey}</div>
            <h2 style={{ ...sectionTitleStyle, marginTop: 5 }}>{text.journey}</h2>
            <p style={mutedStyle}>{text.journeySub}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {[
              ["01", "📚", text.learn, text.learnSub, "#edf5fb"],
              ["02", "✦", text.act, text.actSub, "#fff0e5"],
              ["03", "✓", text.verify, text.verifySub, "#eff7e9"],
              ["04", "✧", text.earn, text.earnSub, "#f2eef9"],
            ].map(([number, icon, title, description, background], index) => (
              <div key={number} className={`kf-passport-stage-card kf-passport-stage-${index + 1}`} style={{ ...panelStyle, padding: 19, background: background as string, boxShadow: "0 8px 22px rgba(16,32,51,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.72)", fontSize: 17 }}>{icon}</div>
                  <div style={{ color: "#8793a1", fontSize: 11, fontWeight: 800 }}>{number}</div>
                </div>
                <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, fontWeight: 600, margin: "14px 0 2px" }}>{title}</h3>
                <p style={{ color: "#718096", fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="kf-civic-passport-timeline" style={{ ...panelStyle, marginTop: 30, padding: 26 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 15, flexWrap: "wrap" }}>
            <div>
              <div style={eyebrowStyle}>{text.timeline}</div>
              <h2 style={{ ...sectionTitleStyle, marginTop: 5 }}>{text.timeline}</h2>
              <p style={mutedStyle}>{text.timelineSub}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 18 }}>
            {([
              ["all", text.all],
              ["learning", text.learningFilter],
              ["issues", text.issuesFilter],
              ["missions", text.missionsFilter],
              ["impact", text.impactFilter],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                className={`kf-passport-filter ${journeyFilter === value ? "is-active" : ""}`}
                type="button"
                onClick={() => setJourneyFilter(value)}
                style={{
                  border: journeyFilter === value ? "1px solid #102033" : "1px solid rgba(16,32,51,0.09)",
                  background: journeyFilter === value ? "#102033" : "#fffdf9",
                  color: journeyFilter === value ? "#ffffff" : "#536579",
                  borderRadius: 999,
                  padding: "8px 13px",
                  cursor: "pointer",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11.5,
                  fontWeight: 800,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {journeyEvents.length === 0 ? (
            <div style={{ marginTop: 18, padding: 28, borderRadius: 18, background: "#f7f4ee", textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>✦</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 600, color: "#536579", marginTop: 5 }}>
                {text.noJourney}
              </div>
            </div>
          ) : (
            <div style={{ position: "relative", marginTop: 22, paddingLeft: 8 }}>
              <div
                className="kf-passport-timeline-line"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 24,
                  top: 8,
                  bottom: 8,
                  width: 2,
                  background: "#e6dfd5",
                }}
              />

              {journeyEvents
                .filter((event) => {
                  if (journeyFilter === "all") return true;
                  if (journeyFilter === "learning") return event.kind === "learning" || event.kind === "quest";
                  if (journeyFilter === "issues") return ["issue", "followup", "issue_status", "resolution"].includes(event.kind);
                  if (journeyFilter === "missions") return event.kind === "mission";
                  return event.kind === "impact" || event.kind === "karma";
                })
                .slice(0, 40)
                .map((event) => {
                  const dot =
                    event.kind === "learning" || event.kind === "quest"
                      ? "📚"
                      : event.kind === "issue" || event.kind === "followup" || event.kind === "issue_status" || event.kind === "resolution"
                        ? "📍"
                        : event.kind === "mission"
                          ? "✦"
                          : event.kind === "impact"
                            ? "◌"
                            : "✓";

                  return (
                    <div key={event.id} className={`kf-passport-timeline-event kf-passport-event-${event.kind}`} style={{ position: "relative", display: "grid", gridTemplateColumns: "48px 1fr", gap: 13, paddingBottom: 18 }}>
                      <div
                        className="kf-passport-timeline-dot"
                        style={{
                          position: "relative",
                          zIndex: 1,
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          background: "#fffdf9",
                          border: "1px solid #ddd7ce",
                          fontSize: 14,
                          boxShadow: "0 4px 12px rgba(16,32,51,0.045)",
                        }}
                      >
                        {dot}
                      </div>

                      <div
                        className="kf-passport-timeline-content"
                        style={{
                          padding: "13px 15px",
                          borderRadius: 17,
                          background: "#fffdf9",
                          border: "1px solid rgba(16,32,51,0.07)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                          <div>
                            <div style={{ color: "#102033", fontFamily: "'Baloo 2', sans-serif", fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>
                              {event.title}
                            </div>
                            <div style={{ color: "#536579", fontSize: 12.5, lineHeight: 1.55, marginTop: 4 }}>
                              {event.description}
                            </div>
                          </div>
                          {event.verified && (
                            <span className="kf-passport-verified-pill" style={{ padding: "5px 8px", borderRadius: 999, background: "#edf7e9", color: "#527b45", fontSize: 9.5, fontWeight: 800, whiteSpace: "nowrap" }}>
                              ✓ {text.verifiedStatus}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                          <span style={{ color: "#8793a1", fontSize: 10.5 }}>{formatDate(event.date, language)}</span>
                          {event.status && (
                            <span style={{ color: "#8793a1", fontSize: 10.5 }}>
                              · {String(event.status).replace(/_/g, " ")}
                            </span>
                          )}
                          {event.meta && (
                            <span style={{ color: "#9a6b43", fontSize: 10.5, fontWeight: 700 }}>
                              · {event.meta}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        <section className="kf-civic-passport-activity" style={{ ...panelStyle, marginTop: 30, padding: 26 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 15, flexWrap: "wrap" }}>
            <div>
              <div style={eyebrowStyle}>{text.activity}</div>
              <h2 style={{ ...sectionTitleStyle, marginTop: 5 }}>{text.activity}</h2>
              <p style={mutedStyle}>{text.activitySub}</p>
            </div>
            <div className="kf-civic-passport-activity-total" style={{ padding: "7px 11px", borderRadius: 999, background: "#fff2df", color: "#9a6b43", fontSize: 11, fontWeight: 800 }}>
              {passport.total_karma_credits} {text.karma}
            </div>
          </div>

          {historyError ? (
            <div style={{ marginTop: 18, padding: 18, borderRadius: 17, background: "#f7f4ee", color: "#718096", fontSize: 13 }}>
              {text.unavailable}
            </div>
          ) : karmaEntries.length === 0 ? (
            <div style={{ marginTop: 18, padding: 28, borderRadius: 18, background: "#f7f4ee", textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>✦</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 600, color: "#536579", marginTop: 4 }}>{text.noKarma}</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 9, marginTop: 18 }}>
              {karmaEntries.map((entry) => (
                <div key={entry.id} className="kf-passport-karma-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 15, padding: 14, borderRadius: 17, background: "#f8f6f1", border: "1px solid rgba(16,32,51,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <div style={{ width: 39, height: 39, flexShrink: 0, borderRadius: 13, display: "grid", placeItems: "center", background: "#fff0e5", color: "#c46d1b", fontWeight: 800 }}>+</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "#102033", fontFamily: "'Baloo 2', sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{entry.reason}</div>
                      <div style={{ color: "#8793a1", fontSize: 11, marginTop: 3 }}>
                        {entry.source_type.replace(/_/g, " ")} · {formatDate(entry.created_at, language)}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: entry.points_delta >= 0 ? "#527b45" : "#a34c4c", fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {entry.points_delta >= 0 ? "+" : ""}{entry.points_delta}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="kf-civic-passport-missions" style={{ ...panelStyle, marginTop: 18, padding: 26 }}>
          <div>
            <div style={eyebrowStyle}>{text.missions}</div>
            <h2 style={{ ...sectionTitleStyle, marginTop: 5 }}>{text.missions}</h2>
            <p style={mutedStyle}>{text.missionsSub}</p>
          </div>

          {historyError ? (
            <div style={{ marginTop: 18, padding: 18, borderRadius: 17, background: "#f7f4ee", color: "#718096", fontSize: 13 }}>{text.unavailable}</div>
          ) : verifiedMissions.length === 0 ? (
            <div style={{ marginTop: 18, padding: 28, borderRadius: 18, background: "#f7f4ee", textAlign: "center" }}>
              <div style={{ fontSize: 28 }}>◌</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 19, fontWeight: 600, color: "#536579", marginTop: 4 }}>{text.noMissions}</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 9, marginTop: 18 }}>
              {verifiedMissions.map((completion) => (
                <div key={completion.id} className="kf-passport-mission-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 15, padding: 15, borderRadius: 17, background: "#f8f6f1", border: "1px solid rgba(16,32,51,0.06)" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#102033", fontFamily: "'Baloo 2', sans-serif", fontSize: 17, fontWeight: 600, lineHeight: 1.2 }}>
                      {completion.mission ? localizedMissionTitle(completion.mission, language) : "Civic Mission"}
                    </div>
                    <div style={{ color: "#8793a1", fontSize: 11, marginTop: 4 }}>
                      {text.verifiedOn} · {formatDate(completion.reviewed_at, language)}
                    </div>
                  </div>
                  <div className="kf-passport-mission-points" style={{ padding: "7px 10px", borderRadius: 999, background: "#edf7e9", color: "#527b45", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>
                    +{completion.mission?.points ?? 0} {text.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="kf-civic-passport-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          <button className="kf-passport-action-primary" type="button" onClick={() => router.push("/my-impact")} style={{ border: 0, borderRadius: 999, padding: "12px 18px", background: "#102033", color: "#fff", cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 800, boxShadow: "0 8px 20px rgba(16,32,51,0.10)" }}>
            {text.viewImpact}
          </button>
          <button className="kf-passport-action-secondary" type="button" onClick={() => router.push("/leagues")} style={{ border: "1px solid rgba(16,32,51,0.10)", borderRadius: 999, padding: "12px 18px", background: "rgba(255,255,255,0.82)", color: "#536579", cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 800 }}>
            {text.viewLeagues}
          </button>
        </section>
      </div>
    </main>
  );
}
