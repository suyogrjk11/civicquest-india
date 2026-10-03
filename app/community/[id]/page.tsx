"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type CivicIssue = {
  id: string;
  category: string;
  title: string | null;
  description: string | null;
  location_text: string | null;
  photo_path: string | null;
  status: string;
  authority_name: string | null;
  reported_city: string | null;
  reported_state: string | null;
  reported_at: string | null;
  community_key?: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type AuthorityDirectory = {
  id: number;
  city: string;
  state: string;
  authority_name: string;
  department_name: string | null;
  sub_department_name: string | null;
  official_complaint_type: string | null;
  issue_category: string;
  grievance_url: string | null;
  official_source_url: string | null;
  submission_method: string | null;
  submission_mode: string | null;
  notes: string | null;
  official_instagram_url: string | null;
  official_x_url: string | null;
  official_facebook_url: string | null;
  official_youtube_url: string | null;
  is_active: boolean;
  verified_at: string | null;
};

const copy: Record<Language, Record<string, string>> = {
  en: {
    back: "← Back to Community",
    loading: "Loading community issue...",
    error: "Unable to load this community issue.",
    notFound: "This community issue could not be found.",
    communityIssue: "COMMUNITY ISSUE",
    peopleReported: "people reported this issue",
    personReported: "person reported this issue",
    share: "Share Issue",
    copy: "Copy Link",
    copied: "Link copied",
    sharing: "Preparing...",
    authority: "Matched Authority",
    officialSite: "Official Website →",
    complaintChannel: "Official Complaint Channel →",
    noAuthority: "No verified authority route is attached to this issue yet.",
    journey: "Issue Journey",
    reported: "Reported",
    current: "Current Status",
    resolved: "Resolved",
    whatNext: "What happens next?",
    reportedNext: "The issue is visible to the community. The next step is review and routing through the appropriate authority.",
    reviewNext: "The issue is currently under review. Community members can continue sharing evidence and following the issue.",
    progressNext: "Work is recorded as in progress. The community can continue tracking the issue until resolution.",
    resolvedNext: "KrutBharat records this issue as resolved. Citizens can verify the outcome through their own observations.",
    communitySignal: "Community Signal",
    communitySignalText: "This page shows the public KrutBharat view of the issue. Citizen identity and private account details are not displayed.",
    details: "Issue Details",
    location: "Location",
    category: "Category",
    cityState: "City / State",
    reference: "KrutBharat Reference",
    myIssue: "Open My Issue →",
    evidence: "Evidence",
    noPhoto: "No photo evidence was attached to this report.",
    privacy: "Community view",
    privacyText: "This is a KrutBharat community record, not an official government response. Official status is shown only when supported by recorded authority information.",
    social: "Tag the Authority",
    socialText: "Verified authority social profiles will appear here when they are added to the authority directory.",
    noSocial: "No verified social profile is currently stored for this authority.",
    tagAuthority: "Tag Authority",
    verified: "Directory verified",
    report: "Report",
    shareHeading: "COMMUNITY ISSUE",
    shareReportSingular: "community report",
    shareReportPlural: "community reports",
    shareAuthority: "Authority",
    shareInstagram: "Tag the authority on Instagram",
    shareRecord: "KrutBharat community record",
    shareOfficial: "Verify official responses through the authority's official channel.",
    defaultTitle: "Civic issue reported by the community",
    locationNotSpecified: "Location not specified",
  },
  hi: {
    back: "← कम्युनिटी पर वापस जाएँ",
    loading: "कम्युनिटी समस्या लोड हो रही है...",
    error: "यह कम्युनिटी समस्या लोड नहीं हो सकी।",
    notFound: "यह कम्युनिटी समस्या नहीं मिली।",
    communityIssue: "कम्युनिटी समस्या",
    peopleReported: "लोगों ने इस समस्या की रिपोर्ट की",
    personReported: "व्यक्ति ने इस समस्या की रिपोर्ट की",
    share: "समस्या साझा करें",
    copy: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    sharing: "तैयार हो रहा है...",
    authority: "संबंधित प्राधिकरण",
    officialSite: "आधिकारिक वेबसाइट →",
    complaintChannel: "आधिकारिक शिकायत चैनल →",
    noAuthority: "इस समस्या से अभी कोई सत्यापित प्राधिकरण मार्ग जुड़ा नहीं है।",
    journey: "समस्या की यात्रा",
    reported: "रिपोर्ट की गई",
    current: "वर्तमान स्थिति",
    resolved: "समाधान",
    whatNext: "आगे क्या होगा?",
    reportedNext: "यह समस्या कम्युनिटी को दिखाई दे रही है। अगला कदम उचित प्राधिकरण द्वारा समीक्षा और रूटिंग है।",
    reviewNext: "समस्या की अभी समीक्षा हो रही है। कम्युनिटी सदस्य जानकारी और सबूत साझा कर सकते हैं।",
    progressNext: "काम प्रगति पर दर्ज है। समाधान तक कम्युनिटी इस समस्या को ट्रैक कर सकती है।",
    resolvedNext: "KrutBharat में समस्या का समाधान दर्ज है। नागरिक अपने निरीक्षण से परिणाम की पुष्टि कर सकते हैं।",
    communitySignal: "कम्युनिटी संकेत",
    communitySignalText: "यह पेज KrutBharat में समस्या का सार्वजनिक दृश्य दिखाता है। नागरिक की पहचान और निजी अकाउंट जानकारी प्रदर्शित नहीं की जाती।",
    details: "समस्या विवरण",
    location: "स्थान",
    category: "श्रेणी",
    cityState: "शहर / राज्य",
    reference: "KrutBharat संदर्भ",
    myIssue: "मेरी समस्या खोलें →",
    evidence: "सबूत",
    noPhoto: "इस रिपोर्ट में फोटो सबूत संलग्न नहीं है।",
    privacy: "कम्युनिटी दृश्य",
    privacyText: "यह KrutBharat का कम्युनिटी रिकॉर्ड है, आधिकारिक सरकारी प्रतिक्रिया नहीं। आधिकारिक स्थिति केवल दर्ज प्राधिकरण जानकारी के आधार पर दिखाई जाती है।",
    social: "प्राधिकरण को टैग करें",
    socialText: "सत्यापित प्राधिकरण सोशल प्रोफाइल यहाँ दिखाई देंगे जब उन्हें प्राधिकरण डायरेक्टरी में जोड़ा जाएगा।",
    noSocial: "इस प्राधिकरण के लिए अभी कोई सत्यापित सोशल प्रोफाइल दर्ज नहीं है।",
    verified: "डायरेक्टरी सत्यापित",
    report: "रिपोर्ट",
    shareHeading: "कम्युनिटी समस्या",
    shareReportSingular: "कम्युनिटी रिपोर्ट",
    shareReportPlural: "कम्युनिटी रिपोर्ट",
    shareAuthority: "प्राधिकरण",
    shareInstagram: "प्राधिकरण को Instagram पर टैग करें",
    shareRecord: "KrutBharat कम्युनिटी रिकॉर्ड",
    shareOfficial: "आधिकारिक प्रतिक्रिया की पुष्टि प्राधिकरण के आधिकारिक चैनल से करें।",
    defaultTitle: "कम्युनिटी द्वारा रिपोर्ट की गई नागरिक समस्या",
    locationNotSpecified: "स्थान उपलब्ध नहीं है",
  },
  mr: {
    back: "← कम्युनिटीवर परत जा",
    loading: "कम्युनिटी समस्या लोड होत आहे...",
    error: "ही कम्युनिटी समस्या लोड करता आली नाही.",
    notFound: "ही कम्युनिटी समस्या सापडली नाही.",
    communityIssue: "कम्युनिटी समस्या",
    peopleReported: "लोकांनी या समस्येची नोंद केली",
    personReported: "व्यक्तीने या समस्येची नोंद केली",
    share: "समस्या शेअर करा",
    copy: "लिंक कॉपी करा",
    copied: "लिंक कॉपी झाली",
    sharing: "तयार करत आहे...",
    authority: "संबंधित प्राधिकरण",
    officialSite: "अधिकृत वेबसाइट →",
    complaintChannel: "अधिकृत तक्रार माध्यम →",
    noAuthority: "या समस्येला अद्याप कोणताही सत्यापित प्राधिकरण मार्ग जोडलेला नाही.",
    journey: "समस्येचा प्रवास",
    reported: "नोंदवले",
    current: "सध्याची स्थिती",
    resolved: "निराकरण",
    whatNext: "पुढे काय?",
    reportedNext: "ही समस्या कम्युनिटीला दिसत आहे. पुढील टप्पा योग्य प्राधिकरणाकडून तपासणी आणि मार्गी लावणे आहे.",
    reviewNext: "समस्येची सध्या तपासणी सुरू आहे. कम्युनिटी सदस्य माहिती आणि पुरावे शेअर करू शकतात.",
    progressNext: "काम प्रगतीपथावर नोंदवले आहे. निराकरण होईपर्यंत कम्युनिटी ही समस्या ट्रॅक करू शकते.",
    resolvedNext: "KrutBharat मध्ये समस्या निकाली काढल्याची नोंद आहे. नागरिक स्वतःच्या निरीक्षणातून परिणाम तपासू शकतात.",
    communitySignal: "कम्युनिटी संकेत",
    communitySignalText: "हे पेज KrutBharat मधील समस्येचे सार्वजनिक दृश्य दाखवते. नागरिकाची ओळख आणि खासगी अकाउंट माहिती दाखवली जात नाही.",
    details: "समस्या तपशील",
    location: "स्थान",
    category: "श्रेणी",
    cityState: "शहर / राज्य",
    reference: "KrutBharat संदर्भ",
    myIssue: "माझी समस्या उघडा →",
    evidence: "पुरावा",
    noPhoto: "या अहवालासोबत फोटो पुरावा जोडलेला नाही.",
    privacy: "कम्युनिटी दृश्य",
    privacyText: "हा KrutBharat कम्युनिटी रेकॉर्ड आहे, अधिकृत सरकारी प्रतिसाद नाही. अधिकृत स्थिती केवळ नोंदवलेल्या प्राधिकरण माहितीनुसार दाखवली जाते.",
    social: "प्राधिकरणाला टॅग करा",
    socialText: "सत्यापित प्राधिकरण सोशल प्रोफाइल प्राधिकरण डायरेक्टरीमध्ये जोडल्यावर येथे दिसतील.",
    noSocial: "या प्राधिकरणासाठी सध्या कोणतेही सत्यापित सोशल प्रोफाइल नोंदवलेले नाही.",
    verified: "डायरेक्टरी सत्यापित",
    report: "अहवाल",
    shareHeading: "कम्युनिटी समस्या",
    shareReportSingular: "कम्युनिटी अहवाल",
    shareReportPlural: "कम्युनिटी अहवाल",
    shareAuthority: "प्राधिकरण",
    shareInstagram: "प्राधिकरणाला Instagram वर टॅग करा",
    shareRecord: "KrutBharat कम्युनिटी रेकॉर्ड",
    shareOfficial: "अधिकृत प्रतिसादाची पुष्टी प्राधिकरणाच्या अधिकृत माध्यमातून करा.",
    defaultTitle: "कम्युनिटीने नोंदवलेली नागरी समस्या",
    locationNotSpecified: "स्थान उपलब्ध नाही",
  },
};


const localizedValues: Record<string, Record<Language, string>> = {
  "Vigilance": {
    en: "Vigilance",
    hi: "सतर्कता",
    mr: "सतर्कता",
  },
  "Streetlight is broken": {
    en: "Streetlight is broken",
    hi: "रस्त्यावरील दिवा खराब आहे",
    mr: "रस्त्यावरील दिवा खराब आहे",
  },
  "Streetlight is not working": {
    en: "Streetlight is not working",
    hi: "रस्त्यावरील दिवा काम करत नाही",
    mr: "रस्त्यावरील दिवा काम करत नाही",
  },
  "Broken Streetlight near me": {
    en: "Broken Streetlight near me",
    hi: "मेरे पास की स्ट्रीटलाइट खराब है",
    mr: "माझ्याजवळील रस्त्यावरील दिवा खराब आहे",
  },
  "Streetlight is broken at Devlai Road near Vinayak Park.": {
    en: "Streetlight is broken at Devlai Road near Vinayak Park.",
    hi: "विनायक पार्क के पास देवलई रोड की स्ट्रीटलाइट खराब है।",
    mr: "विनायक पार्कजवळील देवळाई रोडवरील रस्त्यावरील दिवा खराब आहे.",
  },
  "Broken Streetlight at Devlai Road near Vinayak Park.": {
    en: "Broken Streetlight at Devlai Road near Vinayak Park.",
    hi: "विनायक पार्क के पास देवलई रोड की स्ट्रीटलाइट खराब है।",
    mr: "विनायक पार्कजवळील देवळाई रोडवरील रस्त्यावरील दिवा खराब आहे.",
  },
  "Broken Streetlight at Devlai Road near Vinayak Park": {
    en: "Broken Streetlight at Devlai Road near Vinayak Park",
    hi: "विनायक पार्क के पास देवलई रोड की स्ट्रीटलाइट खराब है",
    mr: "विनायक पार्कजवळील देवळाई रोडवरील रस्त्यावरील दिवा खराब आहे",
  },
  "Broken Streetlight at Devlai Road near Vinayak Park. ": {
    en: "Broken Streetlight at Devlai Road near Vinayak Park. ",
    hi: "विनायक पार्क के पास देवलई रोड की स्ट्रीटलाइट खराब है। ",
    mr: "विनायक पार्कजवळील देवळाई रोडवरील रस्त्यावरील दिवा खराब आहे. ",
  },
  "Broken Streetlight": {
    en: "Broken Streetlight",
    hi: "खराब स्ट्रीटलाइट",
    mr: "खराब रस्त्यावरील दिवा",
  },
  "Public Safety Issue": {
    en: "Public Safety Issue",
    hi: "सार्वजनिक सुरक्षा समस्या",
    mr: "सार्वजनिक सुरक्षेची समस्या",
  },
  "Local Streetlight / Civic Authority": {
    en: "Local Streetlight / Civic Authority",
    hi: "स्थानीय स्ट्रीटलाइट / नागरिक प्राधिकरण",
    mr: "स्थानिक रस्त्यावरील दिवे / नागरी प्राधिकरण",
  },
  "Chhatrapati Sambhajinagar": {
    en: "Chhatrapati Sambhajinagar",
    hi: "छत्रपति संभाजीनगर",
    mr: "छत्रपती संभाजीनगर",
  },
  "Maharashtra": {
    en: "Maharashtra",
    hi: "महाराष्ट्र",
    mr: "महाराष्ट्र",
  },
  "Chhatrapati Sambhajinagar, Maharashtra": {
    en: "Chhatrapati Sambhajinagar, Maharashtra",
    hi: "छत्रपति संभाजीनगर, महाराष्ट्र",
    mr: "छत्रपती संभाजीनगर, महाराष्ट्र",
  },
  "Chhatrapati Sambhajinagar Municipal Corporation (CSMC)": {
    en: "Chhatrapati Sambhajinagar Municipal Corporation (CSMC)",
    hi: "छत्रपति संभाजीनगर महानगरपालिका (CSMC)",
    mr: "छत्रपती संभाजीनगर महानगरपालिका (CSMC)",
  },
  "Devlai Road": {
    en: "Devlai Road",
    hi: "देवलई रोड",
    mr: "देवळाई रोड",
  },
  "Vinayak Park": {
    en: "Vinayak Park",
    hi: "विनायक पार्क",
    mr: "विनायक पार्क",
  },
  "Location not specified": {
    en: "Location not specified",
    hi: "स्थान उपलब्ध नहीं है",
    mr: "स्थान उपलब्ध नाही",
  },
};

function localizeValue(value: string | null | undefined, language: Language): string {
  if (!value) return "";
  const exact = localizedValues[value];
  if (exact) return exact[language];

  const normalized = value.trim();
  const normalizedMatch = Object.keys(localizedValues).find(
    (key) => key.trim().toLowerCase() === normalized.toLowerCase()
  );

  return normalizedMatch ? localizedValues[normalizedMatch][language] : value;
}

function localizeLocation(value: string | null | undefined, language: Language): string {
  if (!value) return "";
  const exact = localizeValue(value, language);
  if (exact !== value) return exact;

  let result = value;
  if (language === "hi") {
    result = result
      .replace(/\bDevlai Road\b/gi, "देवलई रोड")
      .replace(/\bVinayak Park\b/gi, "विनायक पार्क")
      .replace(/\bRoad\b/gi, "रोड");
  } else if (language === "mr") {
    result = result
      .replace(/\bDevlai Road\b/gi, "देवळाई रोड")
      .replace(/\bVinayak Park\b/gi, "विनायक पार्क")
      .replace(/\bRoad\b/gi, "रोड");
  }
  return result;
}

function socialLinks(authority: AuthorityDirectory) {
  return [
    { key: "instagram", label: "Instagram", url: authority.official_instagram_url },
    { key: "x", label: "X", url: authority.official_x_url },
    { key: "facebook", label: "Facebook", url: authority.official_facebook_url },
    { key: "youtube", label: "YouTube", url: authority.official_youtube_url },
  ].filter((item) => Boolean(item.url));
}

const statusMeta: Record<string, { icon: string; label: keyof typeof copy.en; className: string }> = {
  reported: { icon: "📨", label: "reported", className: "statusReported" },
  under_review: { icon: "🔍", label: "current", className: "statusReview" },
  in_progress: { icon: "🔧", label: "current", className: "statusProgress" },
  resolved: { icon: "✅", label: "resolved", className: "statusResolved" },
  rejected: { icon: "⚠️", label: "current", className: "statusRejected" },
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

function statusLabel(status: string, language: Language) {
  const t = copy[language];
  if (status === "reported") return t.reported;
  if (status === "resolved") return t.resolved;
  if (status === "under_review") return language === "hi" ? "समीक्षा में" : language === "mr" ? "तपासणीत" : "Under Review";
  if (status === "in_progress") return language === "hi" ? "प्रगति में" : language === "mr" ? "प्रगतीपथावर" : "In Progress";
  if (status === "rejected") return language === "hi" ? "अस्वीकृत" : language === "mr" ? "नाकारले" : "Rejected";
  return localizeValue(status.replace(/_/g, " "), language);
}

function categoryLabel(category: string, language: Language) {
  const labels: Record<string, Record<Language, string>> = {
    roads: { en: "Roads & Streets", hi: "सड़कें और गलियाँ", mr: "रस्ते आणि मार्ग" },
    water: { en: "Water Supply", hi: "जल आपूर्ति", mr: "पाणीपुरवठा" },
    sanitation: { en: "Sanitation", hi: "स्वच्छता", mr: "स्वच्छता" },
    waste: { en: "Waste Management", hi: "कचरा प्रबंधन", mr: "कचरा व्यवस्थापन" },
    streetlights: { en: "Street Lights", hi: "स्ट्रीट लाइट", mr: "पथदिवे" },
    drainage: { en: "Drainage", hi: "जल निकासी", mr: "निचरा व्यवस्था" },
    traffic: { en: "Traffic", hi: "यातायात", mr: "वाहतूक" },
  };
  return labels[category]?.[language] || localizeValue(category.replace(/_/g, " "), language);
}


function CommunityDetailBrand() {
  return (
    <div className="kf-community-detail-brand" aria-label="KrutBharat Community Issues">
      <div className="kf-community-detail-brand-mark">K</div>
      <div className="kf-community-detail-brand-copy">
        <div className="kf-community-detail-brand-name">
          <span>Karma</span><span>Facie</span>
        </div>
        <div className="kf-community-detail-brand-subtitle">COMMUNITY ISSUES</div>
      </div>
    </div>
  );
}

function LanguageSwitcher({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  return (
    <div className="kf-community-detail-language-row" style={styles.languageRow} aria-label="Language selection">
      {(
        [
          ["en", "English"],
          ["hi", "हिंदी"],
          ["mr", "मराठी"],
        ] as const
      ).map(([code, label]) => (
        <button
          className="kf-community-detail-language-button"
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          style={{
            ...styles.languageButton,
            ...(language === code ? styles.languageButtonActive : {}),
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function CommunityIssuePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = copy[language];
  const supabase = useMemo(() => createClient(), []);

  const [issue, setIssue] = useState<CivicIssue | null>(null);
  const [authority, setAuthority] = useState<AuthorityDirectory | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [reportCount, setReportCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) void loadIssue(params.id);
  }, [params.id]);

  async function loadIssue(issueId: string) {
    setLoading(true);
    setError("");

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      router.push("/auth");
      return;
    }

    const { data, error: issueError } = await supabase
      .from("community_issues")
      .select(`
        id,
        category,
        title,
        description,
        location_text,
        photo_path,
        status,
        authority_name,
        reported_city,
        reported_state,
        reported_at,
        created_at,
        updated_at
      `)
      .eq("id", issueId)
      .maybeSingle();

    if (issueError || !data) {
      setError(issueError?.message || t.notFound);
      setLoading(false);
      return;
    }

    const currentIssue = data as CivicIssue;
    setIssue(currentIssue);

    if (currentIssue.photo_path) {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (accessToken) {
        try {
          const response = await fetch(
            `/api/community/photo?id=${encodeURIComponent(currentIssue.id)}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              cache: "no-store",
            }
          );
          const result = await response.json();
          if (response.ok && result.photo_url) setPhotoUrl(result.photo_url);
        } catch {
          setPhotoUrl(null);
        }
      }
    }

    if (currentIssue.authority_name) {
      let authorityQuery = supabase
        .from("authority_directory")
        .select(`
          id,
          city,
          state,
          authority_name,
          department_name,
          sub_department_name,
          official_complaint_type,
          issue_category,
          grievance_url,
          official_source_url,
          submission_method,
          submission_mode,
          notes,
          official_instagram_url,
          official_x_url,
          official_facebook_url,
          official_youtube_url,
          is_active,
          verified_at
        `)
        .eq("authority_name", currentIssue.authority_name)
        .eq("is_active", true);

      if (currentIssue.reported_state) {
        authorityQuery = authorityQuery.eq("state", currentIssue.reported_state);
      }
      if (currentIssue.reported_city) {
        authorityQuery = authorityQuery.eq("city", currentIssue.reported_city);
      }

      const { data: authorityData } = await authorityQuery
        .order("verified_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (authorityData) setAuthority(authorityData as AuthorityDirectory);
    }

    if (currentIssue.community_key) {
      const { count } = await supabase
        .from("community_issues")
        .select("id", { count: "exact", head: true })
        .eq("community_key", currentIssue.community_key);

      setReportCount(Math.max(count || 1, 1));
    } else {
      const { count } = await supabase
        .from("community_issues")
        .select("id", { count: "exact", head: true })
        .eq("category", currentIssue.category)
        .eq("reported_city", currentIssue.reported_city)
        .eq("location_text", currentIssue.location_text)
        .eq("title", currentIssue.title);

      setReportCount(Math.max(count || 1, 1));
    }
    setLoading(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function createShareImage() {
    if (!issue) throw new Error("Missing issue");

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    ctx.fillStyle = "#f8f3ea";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff7a00";
    ctx.fillRect(0, 0, canvas.width, 18);

    ctx.fillStyle = "#102033";
    ctx.font = "700 34px Arial";
    ctx.fillText("KRUTBHARAT", 70, 82);

    ctx.fillStyle = "#e56800";
    ctx.font = "700 22px Arial";
    ctx.fillText(t.shareHeading, 70, 126);

    let imageBottom = 180;
    if (photoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = photoUrl;
        });
        const boxX = 70;
        const boxY = 165;
        const boxW = 940;
        const boxH = 430;
        const ratio = Math.max(boxW / img.width, boxH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 26);
        ctx.clip();
        ctx.drawImage(img, boxX + (boxW - w) / 2, boxY + (boxH - h) / 2, w, h);
        ctx.restore();
        imageBottom = 635;
      } catch {
        imageBottom = 180;
      }
    }

    const title = localizeValue(issue.title, language) || categoryLabel(issue.category, language) || t.defaultTitle;
    ctx.fillStyle = "#102033";
    ctx.font = "700 42px Arial";
    wrapCanvasText(ctx, title, 70, imageBottom + 65, 940, 52, 3);

    ctx.fillStyle = "#66778b";
    ctx.font = "400 24px Arial";
    const location = issue.location_text ? localizeLocation(issue.location_text, language) : [issue.reported_city, issue.reported_state].filter(Boolean).map((value) => localizeValue(value, language)).join(", ") || t.locationNotSpecified;
    wrapCanvasText(ctx, location, 70, imageBottom + 225, 940, 34, 2);

    ctx.fillStyle = "#e56800";
    ctx.font = "700 24px Arial";
    ctx.fillText(`${reportCount} ${reportCount === 1 ? t.shareReportSingular : t.shareReportPlural}`, 70, imageBottom + 310);

    if (authority?.authority_name) {
      ctx.fillStyle = "#40546a";
      ctx.font = "600 23px Arial";
      wrapCanvasText(ctx, `${t.shareAuthority}: ${localizeValue(authority.authority_name, language)}`, 70, imageBottom + 355, 940, 32, 2);

      if (authority.official_instagram_url) {
        ctx.fillStyle = "#ffb36a";
        ctx.font = "600 20px Arial";
        ctx.fillText(t.shareInstagram, 70, imageBottom + 430);
      }
    }

    ctx.fillStyle = "#8a96a5";
    ctx.font = "400 19px Arial";
    ctx.fillText(t.shareRecord, 70, 1270);
    ctx.fillText(t.shareOfficial, 70, 1304);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image failed"))), "image/png");
    });
  }

  async function shareIssue() {
    if (!issue || sharing) return;
    setSharing(true);
    try {
      const blob = await createShareImage();
      const file = new File([blob], "civicquest-community-issue.png", { type: "image/png" });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: localizeValue(issue.title, language) || t.communityIssue,
          text: `${t.communityIssue}: ${localizeValue(issue.title, language) || categoryLabel(issue.category, language)}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "civicquest-community-issue.png";
        a.click();
        URL.revokeObjectURL(url);
        await copyLink();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(err);
    } finally {
      setSharing(false);
    }
  }

  if (loading) {
    return <main className="kf-community-detail-page" style={styles.page}><div className="kf-community-detail-container" style={styles.container}><p style={styles.muted}>{t.loading}</p></div></main>;
  }

  if (error || !issue) {
    return (
      <main className="kf-community-detail-page" style={styles.page}>
        <div className="kf-community-detail-container" style={styles.container}>
          <div className="kf-community-detail-topbar" style={styles.topBar}>
            <button className="kf-community-detail-back" onClick={() => router.push("/community")} style={styles.back}>{t.back}</button>
            <CommunityDetailBrand />
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
          <section className="kf-community-detail-error-card" style={styles.card}><h1 className="kf-community-detail-error-heading" style={styles.heading}>{t.error}</h1><p style={styles.muted}>{error || t.notFound}</p></section>
        </div>
      </main>
    );
  }

  const meta = statusMeta[issue.status] || statusMeta.reported;
  const nextText = issue.status === "resolved" ? t.resolvedNext : issue.status === "in_progress" ? t.progressNext : issue.status === "under_review" ? t.reviewNext : t.reportedNext;
  const cityStateRaw = [issue.reported_city, issue.reported_state].filter(Boolean).join(", ");
  const cityState = cityStateRaw ? localizeValue(cityStateRaw, language) : "—";
  const location = issue.location_text ? localizeLocation(issue.location_text, language) : cityState;
  const countText = reportCount === 1 ? t.personReported : t.peopleReported;

  return (
    <main className="kf-community-detail-page" style={styles.page}>
      <div className="kf-community-detail-container" style={styles.container}>
        <div className="kf-community-detail-topbar" style={styles.topBar}>
            <button className="kf-community-detail-back" onClick={() => router.push("/community")} style={styles.back}>{t.back}</button>
            <CommunityDetailBrand />
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>

        <section className="kf-community-detail-hero" style={styles.hero}>
          <div className="kf-community-detail-hero-top" style={styles.heroTop}>
            <div>
              <div className="kf-community-detail-eyebrow" style={styles.eyebrow}>{t.communityIssue}</div>
              <div className="kf-community-detail-category" style={styles.category}>{categoryLabel(issue.category, language)}</div>
            </div>
            <span className={`kf-community-detail-status ${meta.className}`} data-status={issue.status} style={styles.statusPill}>{meta.icon} {statusLabel(issue.status, language)}</span>
          </div>

          <h1 className="kf-community-detail-title" style={styles.heroTitle}>{localizeValue(issue.title, language) || categoryLabel(issue.category, language)}</h1>
          <p className="kf-community-detail-description" style={styles.heroDescription}>{localizeValue(issue.description, language) || "—"}</p>

          {photoUrl ? <img className="kf-community-detail-image" src={photoUrl} alt={localizeValue(issue.title, language) || t.communityIssue} style={styles.heroImage} /> : <div className="kf-community-detail-no-photo" style={styles.noPhoto}>{t.noPhoto}</div>}

          <div className="kf-community-detail-meta" style={styles.heroMeta}>
            <span>📍 {location}</span>
            <span>📅 {formatDate(issue.reported_at || issue.created_at, language)}</span>
          </div>
        </section>

        <section className="kf-community-detail-signal" style={styles.signalCard}>
          <div>
            <div style={styles.eyebrow}>{t.communitySignal}</div>
            <div className="kf-community-detail-signal-number" style={styles.signalNumber}>{reportCount}</div>
            <div className="kf-community-detail-signal-label" style={styles.signalLabel}>{countText}</div>
          </div>
          <div className="kf-community-detail-signal-text" style={styles.signalText}>{t.communitySignalText}</div>
          <div className="kf-community-detail-actions" style={styles.actions}>
            <button className="kf-community-detail-primary" onClick={() => void shareIssue()} disabled={sharing} style={styles.primaryButton}>📤 {sharing ? t.sharing : t.share}</button>
            <button className="kf-community-detail-secondary" onClick={() => void copyLink()} style={styles.secondaryButton}>🔗 {copied ? t.copied : t.copy}</button>
          </div>
        </section>

        <section className="kf-community-detail-grid" style={styles.grid}>
          <div className="kf-community-detail-card kf-community-detail-authority" style={styles.card}>
            <div className="kf-community-detail-card-eyebrow" style={styles.cardEyebrow}>{t.authority}</div>
            {authority ? (
              <>
                <h2 className="kf-community-detail-card-title" style={styles.cardTitle}>🏛️ {authority.authority_name}</h2>
                {authority.department_name && <p className="kf-community-detail-line" style={styles.detailLine}>{authority.department_name}</p>}
                {authority.sub_department_name && <p className="kf-community-detail-line" style={styles.detailLine}>{authority.sub_department_name}</p>}
                {authority.verified_at && <p className="kf-community-detail-verified" style={styles.verified}>✓ {t.verified}: {formatDate(authority.verified_at, language)}</p>}
                <div className="kf-community-detail-link-row" style={styles.linkRow}>
                  {authority.official_source_url && <a className="kf-community-detail-link" href={authority.official_source_url} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>{t.officialSite}</a>}
                  {authority.grievance_url && <a className="kf-community-detail-link" href={authority.grievance_url} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>{t.complaintChannel}</a>}
                </div>
                <div className="kf-community-detail-social-box" style={styles.socialBox}>
                  <div className="kf-community-detail-social-title" style={styles.socialTitle}>📣 {t.social}</div>
                  <p style={styles.mutedSmall}>{t.socialText}</p>

                  {socialLinks(authority).length > 0 ? (
                    <>
                      <div className="kf-community-detail-social-links" style={styles.socialLinks}>
                        {socialLinks(authority).map((item) => (
                          <a
                            key={item.key}
                            href={item.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kf-community-detail-social-button" style={styles.socialButton}
                          >
                            {item.label} →
                          </a>
                        ))}
                      </div>

                      {authority.official_instagram_url && (
                        <a
                          href={authority.official_instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="kf-community-detail-tag-button" style={styles.tagButton}
                        >
                          📣 {t.tagAuthority}
                        </a>
                      )}
                    </>
                  ) : (
                    <p style={styles.mutedSmall}>{t.noSocial}</p>
                  )}
                </div>
              </>
            ) : <p style={styles.muted}>{t.noAuthority}</p>}
          </div>

          <div className="kf-community-detail-card kf-community-detail-details-card" style={styles.card}>
            <div className="kf-community-detail-card-eyebrow" style={styles.cardEyebrow}>{t.details}</div>
            <div className="kf-community-detail-details-grid" style={styles.detailsGrid}>
              <Detail label={t.location} value={location} />
              <Detail label={t.category} value={categoryLabel(issue.category, language)} />
              <Detail label={t.cityState} value={cityState} />
              <Detail label={t.reference} value={issue.id} mono />
            </div>
            <button className="kf-community-detail-secondary kf-community-detail-open-my-issue" onClick={() => router.push(`/my-issues/${issue.id}`)} style={styles.secondaryButton}>{t.myIssue}</button>
          </div>
        </section>

        <section className="kf-community-detail-journey-card" style={styles.card}>
          <div className="kf-community-detail-card-eyebrow" style={styles.cardEyebrow}>{t.journey}</div>
          <div className="kf-community-detail-timeline" style={styles.timeline}>
            <TimelineItem active icon="📨" title={t.reported} date={formatDate(issue.reported_at || issue.created_at, language)} />
            <TimelineItem active={issue.status !== "reported"} icon={meta.icon} title={statusLabel(issue.status, language)} date={formatDate(issue.updated_at, language)} />
            <TimelineItem active={issue.status === "resolved"} icon="✅" title={t.resolved} date={formatDate(issue.status === "resolved" ? issue.updated_at : null, language)} last />
          </div>
        </section>

        <section className="kf-community-detail-next-card" style={styles.nextCard}>
          <div className="kf-community-detail-card-eyebrow" style={styles.cardEyebrow}>{t.whatNext}</div>
          <p className="kf-community-detail-next-text" style={styles.nextText}>{nextText}</p>
        </section>

        <section className="kf-community-detail-privacy" style={styles.privacyCard}>
          <strong>{t.privacy}</strong>
          <span className="kf-community-detail-privacy-text">{t.privacyText}</span>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="kf-community-detail-detail-box" style={styles.detailBox}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={{ ...styles.detailValue, ...(mono ? { fontFamily: "monospace", fontSize: 12 } : {}) }}>{value}</div>
    </div>
  );
}

function TimelineItem({ active, icon, title, date, last = false }: { active: boolean; icon: string; title: string; date: string; last?: boolean }) {
  return (
    <div className="kf-community-detail-timeline-item" style={styles.timelineItem}>
      <div className="kf-community-detail-timeline-rail" style={styles.timelineRail}>
        <div className={`kf-community-detail-timeline-dot ${active ? "is-active" : "is-inactive"}`} style={{ ...styles.timelineDot, opacity: active ? 1 : 0.3 }}>{icon}</div>
        {!last && <div className="kf-community-detail-timeline-line" style={{ ...styles.timelineLine, opacity: active ? 1 : 0.25 }} />}
      </div>
      <div className="kf-community-detail-timeline-content" style={{ paddingBottom: last ? 0 : 22 }}>
        <div className="kf-community-detail-timeline-title" style={styles.timelineTitle}>{title}</div>
        <div className="kf-community-detail-timeline-date" style={styles.mutedSmall}>{date}</div>
      </div>
    </div>
  );
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(/\s+/);
  let line = "";
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines += 1;
      line = word;
      if (lines >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  if (lines < maxLines) ctx.fillText(line, x, y + lines * lineHeight);
}

const styles: Record<string, CSSProperties> = {
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap" as const,
    marginBottom: 0,
  },
  languageRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: 4,
    borderRadius: 999,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(16,32,51,0.10)",
    boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
  },
  languageButton: {
    border: 0,
    background: "transparent",
    color: "#65748a",
    borderRadius: 999,
    padding: "8px 12px",
    cursor: "pointer",
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 12,
    fontWeight: 700,
  },
  languageButtonActive: {
    background: "#ff7a00",
    color: "#ffffff",
    boxShadow: "0 5px 14px rgba(255,122,0,0.18)",
  },
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 7% 4%, rgba(255,122,0,0.07), transparent 23%), radial-gradient(circle at 92% 18%, rgba(171,204,229,0.14), transparent 28%), #f8f3ea",
    color: "#102033",
    padding: "42px 20px 80px",
    fontFamily: "'Quicksand', sans-serif",
  },
  container: {
    maxWidth: 1080,
    margin: "0 auto",
  },
  heading: {
    fontFamily: "'Baloo 2', sans-serif",
    color: "#102033",
    fontSize: 30,
    lineHeight: 1.1,
    fontWeight: 700,
    margin: "0 0 8px",
  },
  back: {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(16,32,51,0.09)",
    color: "#536579",
    fontSize: 14,
    cursor: "pointer",
    padding: "9px 15px",
    borderRadius: 999,
    marginBottom: 0,
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 600,
    boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
  },
  hero: {
    background: "#ffffff",
    border: "1px solid rgba(16,32,51,0.08)",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 14px 36px rgba(16,32,51,0.07)",
  },
  heroTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
  eyebrow: {
    color: "#ff7a00",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "1.4px",
    textTransform: "uppercase" as const,
  },
  category: {
    color: "#718096",
    fontSize: 13,
    marginTop: 6,
    fontWeight: 600,
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  },
  statusReported: {
    background: "#fff2df",
    borderColor: "rgba(255,122,0,0.16)",
    color: "#a86724",
  },
  statusReview: {
    background: "#f2eef9",
    borderColor: "rgba(117,91,161,0.12)",
    color: "#67558a",
  },
  statusProgress: {
    background: "#edf5fb",
    borderColor: "rgba(79,113,142,0.12)",
    color: "#4f718e",
  },
  statusResolved: {
    background: "#edf7e9",
    borderColor: "rgba(82,123,69,0.12)",
    color: "#527b45",
  },
  statusRejected: {
    background: "#fff0ef",
    borderColor: "rgba(190,86,74,0.12)",
    color: "#a24f46",
  },
  heroTitle: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: "clamp(34px, 5vw, 52px)",
    lineHeight: 1.05,
    fontWeight: 700,
    color: "#102033",
    margin: "25px 0 10px",
    letterSpacing: "-0.5px",
  },
  heroDescription: {
    color: "#718096",
    fontSize: 16,
    lineHeight: 1.7,
    maxWidth: 820,
    margin: 0,
    fontWeight: 500,
  },
  heroImage: {
    width: "100%",
    maxHeight: 480,
    objectFit: "cover",
    borderRadius: 20,
    marginTop: 24,
    border: "1px solid rgba(16,32,51,0.08)",
    display: "block",
  },
  noPhoto: {
    marginTop: 24,
    padding: 28,
    borderRadius: 20,
    background: "#edf5fb",
    color: "#718096",
    border: "1px dashed rgba(79,113,142,0.18)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
  },
  heroMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    color: "#718096",
    fontSize: 13,
    marginTop: 16,
    fontWeight: 600,
  },
  signalCard: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "minmax(150px, 0.55fr) minmax(240px, 1.4fr) auto",
    gap: 22,
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    background: "#fff4e5",
    border: "1px solid rgba(255,122,0,0.15)",
    boxShadow: "0 10px 28px rgba(16,32,51,0.05)",
  },
  signalNumber: {
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 46,
    lineHeight: 1,
    fontWeight: 700,
    color: "#102033",
    marginTop: 5,
  },
  signalLabel: {
    color: "#a86724",
    fontSize: 13,
    lineHeight: 1.4,
    marginTop: 3,
    fontWeight: 600,
  },
  signalText: {
    color: "#66778b",
    fontSize: 14,
    lineHeight: 1.65,
  },
  actions: {
    display: "flex",
    gap: 9,
    flexWrap: "wrap",
  },
  primaryButton: {
    border: 0,
    borderRadius: 999,
    padding: "11px 16px",
    background: "#ff7a00",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 12.5,
    boxShadow: "0 6px 16px rgba(255,122,0,0.18)",
  },
  secondaryButton: {
    border: "1px solid rgba(16,32,51,0.10)",
    borderRadius: 999,
    padding: "10px 15px",
    background: "#ffffff",
    color: "#536579",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 12.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
    gap: 18,
    marginTop: 18,
  },
  card: {
    background: "#ffffff",
    border: "1px solid rgba(16,32,51,0.08)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 10px 28px rgba(16,32,51,0.05)",
  },
  cardEyebrow: {
    color: "#7a899b",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.2px",
    textTransform: "uppercase" as const,
    marginBottom: 11,
  },
  cardTitle: {
    margin: "0 0 8px",
    fontFamily: "'Baloo 2', sans-serif",
    fontSize: 24,
    lineHeight: 1.15,
    fontWeight: 600,
    color: "#102033",
  },
  detailLine: {
    color: "#718096",
    margin: "4px 0",
    fontSize: 14,
    lineHeight: 1.5,
  },
  verified: {
    color: "#527b45",
    fontSize: 12,
    margin: "12px 0 0",
    fontWeight: 600,
  },
  linkRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  linkButton: {
    display: "inline-block",
    padding: "9px 12px",
    borderRadius: 999,
    background: "#edf5fb",
    border: "1px solid rgba(79,113,142,0.12)",
    color: "#4f718e",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 700,
  },
  socialBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 17,
    background: "#f7f4ee",
    border: "1px solid rgba(16,32,51,0.07)",
  },
  socialTitle: {
    fontWeight: 800,
    fontSize: 14,
    color: "#102033",
  },
  socialLinks: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    marginTop: 10,
  },
  socialButton: {
    display: "inline-block",
    padding: "8px 11px",
    borderRadius: 999,
    background: "#ffffff",
    border: "1px solid rgba(16,32,51,0.09)",
    color: "#536579",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 700,
  },
  tagButton: {
    display: "inline-block",
    marginTop: 12,
    padding: "10px 14px",
    borderRadius: 999,
    background: "#ff7a00",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 800,
  },
  muted: {
    color: "#718096",
    lineHeight: 1.65,
    fontSize: 14,
  },
  mutedSmall: {
    color: "#7a899b",
    fontSize: 12,
    lineHeight: 1.5,
  },
  detailsGrid: {
    display: "grid",
    gap: 10,
    marginBottom: 16,
  },
  detailBox: {
    padding: "13px 14px",
    borderRadius: 15,
    background: "#f7f4ee",
    border: "1px solid rgba(16,32,51,0.07)",
  },
  detailLabel: {
    color: "#8793a1",
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 4,
    textTransform: "uppercase" as const,
    letterSpacing: ".6px",
  },
  detailValue: {
    color: "#40546a",
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: "break-word" as const,
  },
  timeline: {
    marginTop: 12,
  },
  timelineItem: {
    display: "flex",
    gap: 14,
  },
  timelineRail: {
    width: 36,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  timelineDot: {
    width: 34,
    height: 34,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    fontSize: 15,
    flexShrink: 0,
  },
  timelineDotActive: {
    background: "#fff2df",
    border: "1px solid rgba(255,122,0,0.18)",
  },
  timelineDotInactive: {
    background: "#f2f4f6",
    border: "1px solid rgba(16,32,51,0.08)",
    opacity: 0.45,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 22,
    marginTop: 5,
    borderRadius: 999,
  },
  timelineLineActive: {
    background: "#ffd5a8",
  },
  timelineLineInactive: {
    background: "#dce2e8",
  },
  timelineTitle: {
    fontFamily: "'Baloo 2', sans-serif",
    color: "#102033",
    fontWeight: 600,
    fontSize: 17,
    marginTop: 5,
  },
  nextCard: {
    marginTop: 18,
    padding: 24,
    borderRadius: 24,
    background: "#edf5fb",
    border: "1px solid rgba(79,113,142,0.10)",
    boxShadow: "0 10px 28px rgba(16,32,51,0.04)",
  },
  nextText: {
    margin: 0,
    color: "#66778b",
    lineHeight: 1.7,
    fontSize: 14,
    maxWidth: 850,
  },
  privacyCard: {
    marginTop: 18,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    padding: "16px 18px",
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(16,32,51,0.07)",
    color: "#718096",
    fontSize: 12,
    lineHeight: 1.6,
    boxShadow: "0 8px 22px rgba(16,32,51,0.03)",
  },
};
