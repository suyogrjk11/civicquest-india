"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
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
  community_key: string | null;
};

type IssueWithPhoto = CivicIssue & {
  photo_url: string | null;
  related_count: number;
};

const filters = ["all", "reported", "under_review", "in_progress", "resolved"];

type CommunityTranslation = {
  backDashboard: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  publicFeed: string;
  publicFeedDescription: string;
  totalReports: string;
  communityIssues: string;
  activeReports: string;
  resolvedReports: string;
  filterCommunityIssues: string;
  filters: Record<(typeof filters)[number], string>;
  loadingTitle: string;
  loadingText: string;
  unableToLoad: string;
  tryAgain: string;
  noIssuesTitle: string;
  noIssuesText: string;
  civicIssueEvidence: string;
  noEvidenceImage: string;
  civicIssueReported: string;
  noDescription: string;
  locationNotProvided: string;
  reportSingular: string;
  reportPlural: string;
  viewIssue: string;
  statuses: Record<string, string>;
  categories: Record<string, string>;
};

const communityTranslations: Record<Language, CommunityTranslation> = {
  en: {
    backDashboard: "← Dashboard",
    eyebrow: "KRUTBHARAT COMMUNITY",
    title: "Community Issues",
    subtitle:
      "Discover civic problems reported by citizens and see what is happening in your community.",
    publicFeed: "Public civic feed",
    publicFeedDescription:
      "Citizen identities are not displayed. Information shown here comes from KrutBharat civic issue records.",
    totalReports: "Total Reports",
    communityIssues: "Community Issues",
    activeReports: "Active Reports",
    resolvedReports: "Resolved Reports",
    filterCommunityIssues: "Filter community issues",
    filters: {
      all: "All",
      reported: "Reported",
      under_review: "Under Review",
      in_progress: "In Progress",
      resolved: "Resolved",
    },
    loadingTitle: "Loading community issues...",
    loadingText: "Please wait while the latest civic reports are loaded.",
    unableToLoad: "Unable to load Community",
    tryAgain: "Try Again",
    noIssuesTitle: "No civic issues found",
    noIssuesText: "Reported community issues will appear here.",
    civicIssueEvidence: "Civic issue evidence",
    noEvidenceImage: "No evidence image",
    civicIssueReported: "Civic issue reported",
    noDescription: "No description provided.",
    locationNotProvided: "Location not provided",
    reportSingular: "report",
    reportPlural: "reports",
    viewIssue: "View Issue →",
    statuses: {
      reported: "Reported",
      under_review: "Under Review",
      in_progress: "In Progress",
      resolved: "Resolved",
      pending: "Pending",
      submitted: "Submitted",
      acknowledged: "Acknowledged",
      verified: "Verified",
      rejected: "Rejected",
      closed: "Closed",
      open: "Open",
      escalated: "Escalated",
      awaiting_action: "Awaiting Action",
    },
    categories: {
      roads: "Roads",
      road: "Road",
      garbage: "Garbage",
      waste: "Waste",
      water: "Water",
      drainage: "Drainage",
      sewerage: "Sewerage",
      streetlight: "Streetlight",
      street_lights: "Streetlights",
      electricity: "Electricity",
      traffic: "Traffic",
      parking: "Parking",
      cleanliness: "Cleanliness",
      sanitation: "Sanitation",
      public_toilet: "Public Toilet",
      pothole: "Pothole",
      environment: "Environment",
      pollution: "Pollution",
      encroachment: "Encroachment",
      public_safety: "Public Safety",
      public_safety_issue: "Public Safety Issue",
      broken_streetlight: "Broken Streetlight",
      broken_street_light: "Broken Streetlight",
      street_light: "Streetlight",
      other: "Other",
    },
  },
  hi: {
    backDashboard: "← डैशबोर्ड",
    eyebrow: "कर्माफेसी कम्युनिटी",
    title: "सामुदायिक समस्याएँ",
    subtitle:
      "नागरिकों द्वारा रिपोर्ट की गई नागरिक समस्याएँ देखें और जानें कि आपके समुदाय में क्या हो रहा है।",
    publicFeed: "सार्वजनिक नागरिक फ़ीड",
    publicFeedDescription:
      "नागरिकों की पहचान प्रदर्शित नहीं की जाती। यहाँ दिखाई गई जानकारी कर्माफेसी के नागरिक समस्या रिकॉर्ड से आती है।",
    totalReports: "कुल रिपोर्ट",
    communityIssues: "सामुदायिक समस्याएँ",
    activeReports: "सक्रिय रिपोर्ट",
    resolvedReports: "समाधान की गई रिपोर्ट",
    filterCommunityIssues: "सामुदायिक समस्याएँ फ़िल्टर करें",
    filters: {
      all: "सभी",
      reported: "रिपोर्ट की गई",
      under_review: "समीक्षा में",
      in_progress: "प्रगति में",
      resolved: "समाधान की गई",
    },
    loadingTitle: "सामुदायिक समस्याएँ लोड हो रही हैं...",
    loadingText: "कृपया प्रतीक्षा करें, नवीनतम नागरिक रिपोर्ट लोड की जा रही हैं।",
    unableToLoad: "कम्युनिटी लोड नहीं हो सकी",
    tryAgain: "फिर कोशिश करें",
    noIssuesTitle: "कोई नागरिक समस्या नहीं मिली",
    noIssuesText: "रिपोर्ट की गई सामुदायिक समस्याएँ यहाँ दिखाई देंगी।",
    civicIssueEvidence: "नागरिक समस्या का प्रमाण",
    noEvidenceImage: "प्रमाण की कोई तस्वीर नहीं",
    civicIssueReported: "नागरिक समस्या रिपोर्ट की गई",
    noDescription: "कोई विवरण उपलब्ध नहीं है।",
    locationNotProvided: "स्थान उपलब्ध नहीं है",
    reportSingular: "रिपोर्ट",
    reportPlural: "रिपोर्टें",
    viewIssue: "समस्या देखें →",
    statuses: {
      reported: "रिपोर्ट की गई",
      under_review: "समीक्षा में",
      in_progress: "प्रगति में",
      resolved: "समाधान की गई",
      pending: "लंबित",
      submitted: "जमा की गई",
      acknowledged: "स्वीकार की गई",
      verified: "सत्यापित",
      rejected: "अस्वीकृत",
      closed: "बंद",
      open: "खुली",
      escalated: "आगे भेजी गई",
      awaiting_action: "कार्रवाई की प्रतीक्षा में",
    },
    categories: {
      roads: "सड़कें",
      road: "सड़क",
      garbage: "कचरा",
      waste: "अपशिष्ट",
      water: "पानी",
      drainage: "जल निकासी",
      sewerage: "सीवरेज",
      streetlight: "स्ट्रीट लाइट",
      street_lights: "स्ट्रीट लाइटें",
      electricity: "बिजली",
      traffic: "यातायात",
      parking: "पार्किंग",
      cleanliness: "स्वच्छता",
      sanitation: "स्वच्छता व्यवस्था",
      public_toilet: "सार्वजनिक शौचालय",
      pothole: "गड्ढा",
      environment: "पर्यावरण",
      pollution: "प्रदूषण",
      encroachment: "अतिक्रमण",
      public_safety: "सार्वजनिक सुरक्षा",
      public_safety_issue: "सार्वजनिक सुरक्षा समस्या",
      broken_streetlight: "खराब स्ट्रीट लाइट",
      broken_street_light: "खराब स्ट्रीट लाइट",
      street_light: "स्ट्रीट लाइट",
      other: "अन्य",
    },
  },
  mr: {
    backDashboard: "← डॅशबोर्ड",
    eyebrow: "कर्माफेसी कम्युनिटी",
    title: "समुदायातील समस्या",
    subtitle:
      "नागरिकांनी नोंदवलेल्या नागरी समस्या पहा आणि तुमच्या समुदायात काय घडत आहे ते जाणून घ्या.",
    publicFeed: "सार्वजनिक नागरी फीड",
    publicFeedDescription:
      "नागरिकांची ओळख दाखवली जात नाही. येथे दिसणारी माहिती कर्माफेसीच्या नागरी समस्या नोंदींमधून घेतली जाते.",
    totalReports: "एकूण रिपोर्ट",
    communityIssues: "समुदायातील समस्या",
    activeReports: "सक्रिय रिपोर्ट",
    resolvedReports: "निराकरण केलेले रिपोर्ट",
    filterCommunityIssues: "समुदायातील समस्या फिल्टर करा",
    filters: {
      all: "सर्व",
      reported: "नोंदवलेल्या",
      under_review: "पुनरावलोकनात",
      in_progress: "प्रगतीपथावर",
      resolved: "निराकरण केलेल्या",
    },
    loadingTitle: "समुदायातील समस्या लोड होत आहेत...",
    loadingText: "कृपया प्रतीक्षा करा, नवीनतम नागरी रिपोर्ट लोड केले जात आहेत.",
    unableToLoad: "कम्युनिटी लोड करता आली नाही",
    tryAgain: "पुन्हा प्रयत्न करा",
    noIssuesTitle: "कोणतीही नागरी समस्या आढळली नाही",
    noIssuesText: "नोंदवलेल्या समुदायातील समस्या येथे दिसतील.",
    civicIssueEvidence: "नागरी समस्येचा पुरावा",
    noEvidenceImage: "पुराव्याची प्रतिमा उपलब्ध नाही",
    civicIssueReported: "नागरी समस्या नोंदवली आहे",
    noDescription: "वर्णन उपलब्ध नाही.",
    locationNotProvided: "स्थान उपलब्ध नाही",
    reportSingular: "रिपोर्ट",
    reportPlural: "रिपोर्ट्स",
    viewIssue: "समस्या पहा →",
    statuses: {
      reported: "नोंदवलेली",
      under_review: "पुनरावलोकनात",
      in_progress: "प्रगतीपथावर",
      resolved: "निराकरण केलेली",
      pending: "प्रलंबित",
      submitted: "सादर केलेली",
      acknowledged: "स्वीकारलेली",
      verified: "सत्यापित",
      rejected: "नाकारलेली",
      closed: "बंद",
      open: "उघडी",
      escalated: "पुढे पाठवलेली",
      awaiting_action: "कारवाईची प्रतीक्षा",
    },
    categories: {
      roads: "रस्ते",
      road: "रस्ता",
      garbage: "कचरा",
      waste: "कचरा",
      water: "पाणी",
      drainage: "निचरा",
      sewerage: "सांडपाणी व्यवस्था",
      streetlight: "रस्त्यावरील दिवा",
      street_lights: "रस्त्यावरील दिवे",
      electricity: "वीज",
      traffic: "वाहतूक",
      parking: "पार्किंग",
      cleanliness: "स्वच्छता",
      sanitation: "स्वच्छता व्यवस्था",
      public_toilet: "सार्वजनिक शौचालय",
      pothole: "खड्डा",
      environment: "पर्यावरण",
      pollution: "प्रदूषण",
      encroachment: "अतिक्रमण",
      public_safety: "सार्वजनिक सुरक्षितता",
      public_safety_issue: "सार्वजनिक सुरक्षिततेची समस्या",
      broken_streetlight: "खराब रस्त्यावरील दिवा",
      broken_street_light: "खराब रस्त्यावरील दिवा",
      street_light: "रस्त्यावरील दिवा",
      other: "इतर",
    },
  },
};

function normalizeDynamicKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function translateDynamicValue(
  value: string | null | undefined,
  dictionary: Record<string, string>,
): string {
  if (!value) return "";

  const trimmed = value.trim();
  const normalized = normalizeDynamicKey(trimmed);

  return (
    dictionary[normalized] ??
    dictionary[trimmed.toLowerCase()] ??
    dictionary[trimmed] ??
    value
  );
}

// Some community records contain seeded/demo English text. These exact values
// are translated when they are displayed; unknown citizen-entered text is kept
// unchanged so the app never guesses at a user's meaning.
const issueContentTranslations: Record<Language, Record<string, string>> = {
  en: {},
  hi: {
    vigilance: "सतर्कता",
    streetlight_is_broken: "स्ट्रीट लाइट खराब है",
    streetlight_is_not_working: "स्ट्रीट लाइट काम नहीं कर रही है",
    broken_streetlight_near_me: "मेरे पास स्ट्रीट लाइट खराब है",
    broken_streetlight_at_devlai_road_near_vinayak_park:
      "विनायक पार्क के पास देवलई रोड पर स्ट्रीट लाइट खराब है।",
    streetlight_is_not_working_on_the_devlai_road_near_vinayak_park:
      "विनायक पार्क के पास देवलई रोड पर स्ट्रीट लाइट काम नहीं कर रही है",
    local_streetlight_civic_authority: "स्थानीय स्ट्रीट लाइट / नागरिक प्राधिकरण",
    chhatrapati_sambhajinagar: "छत्रपति संभाजीनगर",
    maharashtra: "महाराष्ट्र",
    chhatrapati_sambhajinagar_maharashtra: "छत्रपति संभाजीनगर, महाराष्ट्र",
    chhatrapati_sambhajinagar_municipal_corporation_csmc:
      "छत्रपति संभाजीनगर महानगरपालिका (CSMC)",
  },
  mr: {
    vigilance: "सतर्कता",
    streetlight_is_broken: "रस्त्यावरील दिवा खराब आहे",
    streetlight_is_not_working: "रस्त्यावरील दिवा काम करत नाही",
    broken_streetlight_near_me: "माझ्या जवळील रस्त्यावरील दिवा खराब आहे",
    broken_streetlight_at_devlai_road_near_vinayak_park:
      "विनायक पार्कजवळील देवलई रोडवरील रस्त्यावरील दिवा खराब आहे.",
    streetlight_is_not_working_on_the_devlai_road_near_vinayak_park:
      "विनायक पार्कजवळील देवलई रोडवरील रस्त्यावरील दिवा काम करत नाही",
    local_streetlight_civic_authority: "स्थानिक रस्त्यावरील दिवा / नागरी प्राधिकरण",
    chhatrapati_sambhajinagar: "छत्रपती संभाजीनगर",
    maharashtra: "महाराष्ट्र",
    chhatrapati_sambhajinagar_maharashtra: "छत्रपती संभाजीनगर, महाराष्ट्र",
    chhatrapati_sambhajinagar_municipal_corporation_csmc:
      "छत्रपती संभाजीनगर महानगरपालिका (CSMC)",
  },
};

function translateIssueContent(
  value: string | null | undefined,
  language: Language,
): string {
  if (!value) return "";

  const normalized = normalizeDynamicKey(value);
  const dictionary = issueContentTranslations[language];

  return dictionary[normalized] ?? value;
}

export default function CommunityPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const ui = communityTranslations[language];

  const [issues, setIssues] = useState<IssueWithPhoto[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalReports: 0,
    activeReports: 0,
    resolvedReports: 0,
  });

  useEffect(() => {
    void loadIssues();
  }, []);

  async function loadIssues() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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
          community_key,
          created_at,
          updated_at
        `)
        .order("reported_at", { ascending: false });

      if (issueError) throw new Error(issueError.message);

      const raw = data || [];

      setStats({
        totalReports: raw.length,
        activeReports: raw.filter((item) => item.status !== "resolved").length,
        resolvedReports: raw.filter((item) => item.status === "resolved").length,
      });

      const photoCache = new Map<string, string | null>();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const withPhotos: IssueWithPhoto[] = [];

      for (const issue of raw) {
        let photoUrl: string | null = null;

        if (issue.photo_path && accessToken) {
          if (photoCache.has(issue.id)) {
            photoUrl = photoCache.get(issue.id) ?? null;
          } else {
            try {
              const response = await fetch(
                `/api/community/photo?id=${encodeURIComponent(issue.id)}`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                  cache: "no-store",
                }
              );

              const result = await response.json();
              photoUrl = response.ok ? result.photo_url ?? null : null;
            } catch {
              photoUrl = null;
            }

            photoCache.set(issue.id, photoUrl);
          }
        }

        withPhotos.push({
          ...issue,
          photo_url: photoUrl,
          related_count: 1,
        });
      }

      // Proper community grouping uses the database-generated community_key.
      // If the migration has not been run yet, fall back safely to the existing
      // exact-match grouping so the page keeps working.
      const groups = new Map<string, number>();

      for (const issue of raw) {
        const fallbackKey = [
          issue.category,
          issue.title?.trim().toLowerCase(),
          issue.reported_city?.trim().toLowerCase(),
          issue.location_text?.trim().toLowerCase(),
        ].join("|");

        const key = issue.community_key || fallbackKey;
        groups.set(key, (groups.get(key) || 0) + 1);
      }

      // Show one public card per community issue group, using the newest report
      // as the representative record. This prevents duplicate cards when many
      // citizens report the same problem.
      const grouped = new Map<string, IssueWithPhoto>();

      for (const issue of withPhotos) {
        const fallbackKey = [
          issue.category,
          issue.title?.trim().toLowerCase(),
          issue.reported_city?.trim().toLowerCase(),
          issue.location_text?.trim().toLowerCase(),
        ].join("|");

        const key = issue.community_key || fallbackKey;
        const current = grouped.get(key);

        if (!current) {
          grouped.set(key, {
            ...issue,
            related_count: groups.get(key) || 1,
          });
        }
      }

      setIssues(Array.from(grouped.values()));
    } catch (err) {
      console.error("Community loading error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load community issues."
      );
    } finally {
      setLoading(false);
    }
  }

  const visibleIssues = useMemo(() => {
    if (filter === "all") return issues;
    return issues.filter((issue) => issue.status === filter);
  }, [issues, filter]);

  return (
    <main className="kf-community-page" style={pageStyle}>
      <div className="kf-community-container" style={containerStyle}>
        <header className="kf-community-topbar" style={topNavStyle}>
          <div style={headerSideStyle}>
            <button className="kf-community-back" onClick={() => router.push("/dashboard")} style={backButton}>
              <span style={backArrowStyle}>←</span>
              <span>{ui.backDashboard.replace("← ", "")}</span>
            </button>
          </div>

          <div className="kf-community-brand" style={brandStyle} aria-label="KrutBharat Community Issues">
            <div className="kf-community-brand-mark" style={brandMarkStyle}>K</div>

            <div className="kf-community-brand-text" style={brandTextWrapStyle}>
              <div className="kf-community-brand-name" style={brandNameStyle}>
                <span>Krut</span>
                <span className="kf-community-brand-accent" style={brandAccentStyle}>Bharat</span>
              </div>
              <div className="kf-community-brand-subtitle" style={brandSubtitleStyle}>COMMUNITY ISSUES</div>
            </div>
          </div>

          <div
            style={{
              ...headerSideStyle,
              justifyContent: "flex-end",
            }}
          >
            <div className="kf-community-language-control" style={languageControlStyle}>
              <span className="kf-community-language-label" style={languageLabelStyle}>
                {language === "en" ? "Language" : language === "hi" ? "भाषा" : "भाषा"}
              </span>

              <div className="kf-community-language-switcher" style={languageSwitcher} aria-label="Language selection">
                {(["en", "hi", "mr"] as Language[]).map((code) => (
                  <button
                    className="kf-community-language-button"
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    style={{
                      ...languageButton,
                      ...(language === code ? activeLanguageButton : {}),
                    }}
                  >
                    {code === "en" ? "English" : code === "hi" ? "हिंदी" : "मराठी"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <header className="kf-community-hero-head" style={headerStyle}>
          <div className="kf-community-eyebrow" style={eyebrow}>{ui.eyebrow}</div>

          <h1 className="kf-community-title" style={title}>{ui.title}</h1>

          <p className="kf-community-subtitle" style={subtitle}>{ui.subtitle}</p>
        </header>

        <section className="kf-community-notice" style={noticeStyle}>
          <div className="kf-community-notice-icon" style={noticeIcon}>👥</div>

          <div className="kf-community-notice-content" style={noticeContent}>
            <strong>{ui.publicFeed}</strong>
<span>{ui.publicFeedDescription}</span>
          </div>
        </section>

        <section className="kf-community-stats" style={statsGridStyle}>
          <StatCard
            icon="📋"
            label={ui.totalReports}
            value={stats.totalReports}
            tone="blue"
          />

          <StatCard
            icon="👥"
            label={ui.communityIssues}
            value={issues.length}
            tone="green"
          />

          <StatCard
            icon="🔧"
            label={ui.activeReports}
            value={stats.activeReports}
            tone="orange"
          />

          <StatCard
            icon="✅"
            label={ui.resolvedReports}
            value={stats.resolvedReports}
            tone="lavender"
          />
        </section>

        <div className="kf-community-filter-section" style={filterSection}>
          <div className="kf-community-filter-label" style={filterLabel}>{ui.filterCommunityIssues}</div>

          <div className="kf-community-filter-row" style={filterRow}>
            {filters.map((item) => (
              <button
                className="kf-community-filter-button"
                key={item}
                onClick={() => setFilter(item)}
                style={{
                  ...filterButton,
                  ...(filter === item ? activeFilterButton : {}),
                }}
              >
{ui.filters[item as (typeof filters)[number]]}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="kf-community-empty" style={emptyCard}>
            <div style={stateIcon}>⏳</div>
            <h2 style={stateTitle}>{ui.loadingTitle}</h2>
<p style={stateText}>{ui.loadingText}</p>
          </div>
        )}

        {!loading && error && (
          <div className="kf-community-error" style={errorCard}>
            <div style={stateIcon}>⚠️</div>

            <div>
              <strong className="kf-community-error-title" style={errorTitle}>{ui.unableToLoad}</strong>
              <p className="kf-community-error-text" style={errorText}>{error}</p>

              <button className="kf-community-retry"
                onClick={() => void loadIssues()}
                style={primaryButton}
              >
                {ui.tryAgain}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && visibleIssues.length === 0 && (
          <div className="kf-community-empty" style={emptyCard}>
            <div style={stateIcon}>🏙️</div>

            <h2 style={stateTitle}>{ui.noIssuesTitle}</h2>

<p style={stateText}>{ui.noIssuesText}</p>
          </div>
        )}

        <section className="kf-community-issue-grid" style={gridStyle}>
          {!loading &&
            !error &&
            visibleIssues.map((issue, index) => (
              <article key={issue.id} className={`kf-community-issue-card kf-community-issue-card-${index % 4}`} style={cardStyle}>
                <div className="kf-community-image-frame" style={imageFrame}>
                  {issue.photo_url ? (
                    <img className="kf-community-image"
                      src={issue.photo_url}
                      alt={ui.civicIssueEvidence}
                      style={imageStyle}
                    />
                  ) : (
                    <div className="kf-community-image-placeholder" style={imagePlaceholder}>
                      <span>📍</span>
                      <small>{ui.noEvidenceImage}</small>
                    </div>
                  )}
                </div>

                <div className="kf-community-card-content" style={cardContent}>
                  <div className="kf-community-top-row" style={topRow}>
                    <span className="kf-community-category-badge" style={categoryBadge}>{translateDynamicValue(issue.category, ui.categories)}</span>

                    <span className="kf-community-status-badge" data-status={issue.status} style={statusBadge(issue.status)}>
                      {translateDynamicValue(issue.status, ui.statuses) || issue.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <h2 className="kf-community-card-title" style={cardTitle}>
                    {issue.title ? translateIssueContent(issue.title, language) : ui.civicIssueReported}
                  </h2>

                  <p className="kf-community-card-description" style={description}>
                    {issue.description ? translateIssueContent(issue.description, language) : ui.noDescription}
                  </p>

                  <div className="kf-community-card-meta" style={meta}>
                    <div>📍 {issue.location_text ? translateIssueContent(issue.location_text, language) : ui.locationNotProvided}</div>

                    {issue.reported_city && (
                      <div>
                        🏙️ {translateIssueContent(issue.reported_city, language)}
                        {issue.reported_state
                          ? `, ${translateIssueContent(issue.reported_state, language)}`
                          : ""}
                      </div>
                    )}

                    {issue.authority_name && (
                      <div>🏛️ {translateIssueContent(issue.authority_name, language)}</div>
                    )}
                  </div>

                  <div className="kf-community-impact-row" style={impactRow}>
                    <span className="kf-community-related" style={relatedReports}>
                      👥 {issue.related_count}{" "}
                      {issue.related_count === 1
                        ? ui.reportSingular
                        : ui.reportPlural}
                    </span>

                    <button className="kf-community-view-button"
                      onClick={() => router.push(`/community/${issue.id}`)}
                      style={viewButton}
                    >
                      {ui.viewIssue}
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: number;
  tone: "blue" | "green" | "orange" | "lavender";
}) {
  return (
    <div className={`kf-community-stat-card kf-community-stat-${tone}`} style={{ ...statCardStyle, ...statCardTone[tone] }}>
      <div className="kf-community-stat-icon" style={statIcon}>{icon}</div>

      <div>
        <div className="kf-community-stat-value" style={statValueStyle}>{value}</div>
        <div className="kf-community-stat-label" style={statLabelStyle}>{label}</div>
      </div>
    </div>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 14,
  margin: "22px 0 28px",
};

const statCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "18px 20px",
  borderRadius: 20,
  border: "1px solid rgba(16,32,51,0.08)",
  boxShadow: "0 10px 28px rgba(16,32,51,0.06)",
};

const statCardTone: Record<
  "blue" | "green" | "orange" | "lavender",
  CSSProperties
> = {
  blue: {
    background: "#edf5fb",
  },
  green: {
    background: "#eff7e9",
  },
  orange: {
    background: "#fff2df",
  },
  lavender: {
    background: "#f2eef9",
  },
};

const statIcon: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.8)",
  fontSize: 23,
  flexShrink: 0,
};

const statValueStyle: CSSProperties = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 27,
  lineHeight: 1,
  fontWeight: 700,
  color: "#102033",
};

const statLabelStyle: CSSProperties = {
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#718096",
  marginTop: 5,
};

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 8% 5%, rgba(255,122,0,0.07), transparent 24%), radial-gradient(circle at 90% 20%, rgba(171,204,229,0.14), transparent 28%), #f8f3ea",
  color: "#102033",
  padding: "42px 20px 80px",
  fontFamily: "'Quicksand', sans-serif",
};

const containerStyle: CSSProperties = {
  maxWidth: "1120px",
  margin: "0 auto",
};

const topNavStyle: CSSProperties = {
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

const headerSideStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  minWidth: 0,
};

const backArrowStyle: CSSProperties = {
  color: "#ff7a00",
  fontSize: 20,
  lineHeight: 1,
  fontWeight: 500,
};

const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  whiteSpace: "nowrap",
};

const brandMarkStyle: CSSProperties = {
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

const brandTextWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
};

const brandNameStyle: CSSProperties = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 29,
  lineHeight: 0.95,
  fontWeight: 800,
  letterSpacing: "-0.8px",
  color: "#102033",
};

const brandAccentStyle: CSSProperties = {
  color: "#ff7a00",
};

const brandSubtitleStyle: CSSProperties = {
  marginTop: 5,
  color: "#102033",
  fontSize: 9,
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "2.4px",
};

const languageControlStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
};

const languageLabelStyle: CSSProperties = {
  color: "#536579",
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const languageSwitcher: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: 4,
  borderRadius: 999,
  background: "rgba(255,255,255,0.78)",
  border: "1px solid rgba(16,32,51,0.10)",
  boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
};

const languageButton: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#65748a",
  borderRadius: 999,
  padding: "8px 12px",
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 12,
  fontWeight: 700,
};

const activeLanguageButton: CSSProperties = {
  background: "#ff7a00",
  color: "#ffffff",
  boxShadow: "0 5px 14px rgba(255,122,0,0.18)",
};

const headerStyle: CSSProperties = {
  marginBottom: 30,
};

const backButton: CSSProperties = {
  background: "rgba(255,255,255,0.72)",
  border: "1px solid rgba(16,32,51,0.10)",
  color: "#536579",
  cursor: "pointer",
  padding: "9px 14px",
  marginBottom: 0,
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: "'Quicksand', sans-serif",
  boxShadow: "0 5px 18px rgba(16,32,51,0.04)",
};

const eyebrow: CSSProperties = {
  color: "#ff7a00",
  fontWeight: 800,
  letterSpacing: "1.6px",
  fontSize: 12,
  fontFamily: "'Quicksand', sans-serif",
};

const title: CSSProperties = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: "clamp(38px, 5vw, 56px)",
  lineHeight: 1.05,
  fontWeight: 700,
  color: "#102033",
  margin: "7px 0 10px",
};

const subtitle: CSSProperties = {
  color: "#718096",
  maxWidth: 720,
  lineHeight: 1.75,
  margin: 0,
  fontSize: 16,
  fontWeight: 500,
};

const noticeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "18px 20px",
  marginBottom: 22,
  borderRadius: 20,
  background: "#fff4e5",
  border: "1px solid rgba(255,122,0,0.16)",
  color: "#536579",
  lineHeight: 1.5,
  boxShadow: "0 8px 24px rgba(16,32,51,0.04)",
};

const noticeIcon: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffe8c8",
  fontSize: 21,
  flexShrink: 0,
};

const noticeContent: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const filterSection: CSSProperties = {
  marginBottom: 28,
};

const filterLabel: CSSProperties = {
  color: "#102033",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 10,
};

const filterRow: CSSProperties = {
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
};

const filterButton: CSSProperties = {
  border: "1px solid rgba(16,32,51,0.10)",
  background: "rgba(255,255,255,0.78)",
  color: "#65748a",
  borderRadius: 999,
  padding: "9px 15px",
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(16,32,51,0.03)",
};

const activeFilterButton: CSSProperties = {
  background: "#ff7a00",
  border: "1px solid #ff7a00",
  color: "#ffffff",
  boxShadow: "0 6px 16px rgba(255,122,0,0.18)",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: 20,
};

const cardStyle: CSSProperties = {
  overflow: "hidden",
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.08)",
  boxShadow: "0 12px 32px rgba(16,32,51,0.07)",
};

const imageFrame: CSSProperties = {
  padding: 8,
  paddingBottom: 0,
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: 210,
  objectFit: "cover",
  display: "block",
  borderRadius: 18,
};

const imagePlaceholder: CSSProperties = {
  height: 210,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  background: "#edf5fb",
  borderRadius: 18,
  color: "#8392a5",
  fontSize: 42,
};

const cardContent: CSSProperties = {
  padding: 20,
};

const topRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const categoryBadge: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#edf5fb",
  color: "#48677f",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "capitalize",
};

function statusBadge(status: string): CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background:
      status === "resolved"
        ? "#edf7e9"
        : status === "in_progress"
          ? "#edf5fb"
          : "#fff2df",
    color:
      status === "resolved"
        ? "#527b45"
        : status === "in_progress"
          ? "#4f718e"
          : "#a86724",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
  };
}

const cardTitle: CSSProperties = {
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 23,
  lineHeight: 1.15,
  fontWeight: 600,
  color: "#102033",
  margin: "17px 0 8px",
};

const description: CSSProperties = {
  color: "#718096",
  lineHeight: 1.65,
  minHeight: 52,
  margin: 0,
  fontSize: 14,
  fontWeight: 500,
};

const meta: CSSProperties = {
  display: "grid",
  gap: 7,
  color: "#64748b",
  fontSize: 12.5,
  marginTop: 17,
  lineHeight: 1.45,
};

const impactRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 20,
  paddingTop: 16,
  borderTop: "1px solid rgba(16,32,51,0.08)",
};

const relatedReports: CSSProperties = {
  color: "#718096",
  fontSize: 12.5,
  fontWeight: 600,
};

const viewButton: CSSProperties = {
  border: "1px solid rgba(255,122,0,0.22)",
  background: "#fff4e5",
  color: "#e56800",
  fontWeight: 700,
  borderRadius: 999,
  padding: "9px 13px",
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 12.5,
};

const primaryButton: CSSProperties = {
  border: 0,
  background: "#ff7a00",
  color: "#ffffff",
  fontWeight: 700,
  borderRadius: 999,
  padding: "10px 16px",
  cursor: "pointer",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: 13,
};

const emptyCard: CSSProperties = {
  textAlign: "center",
  padding: "70px 20px",
  borderRadius: 24,
  background: "#ffffff",
  border: "1px solid rgba(16,32,51,0.08)",
  boxShadow: "0 12px 30px rgba(16,32,51,0.05)",
  color: "#718096",
  marginBottom: 24,
};

const errorCard: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 18,
  padding: 26,
  borderRadius: 24,
  background: "#fff7f5",
  border: "1px solid rgba(220,95,75,0.16)",
  boxShadow: "0 10px 28px rgba(16,32,51,0.04)",
  color: "#64748b",
  marginBottom: 24,
};

const stateIcon: CSSProperties = {
  fontSize: 40,
  lineHeight: 1,
  marginBottom: 8,
};

const stateTitle: CSSProperties = {
  fontFamily: "'Baloo 2', sans-serif",
  color: "#102033",
  fontSize: 24,
  fontWeight: 600,
  margin: "4px 0 5px",
};

const stateText: CSSProperties = {
  color: "#718096",
  margin: 0,
  lineHeight: 1.6,
  fontSize: 14,
};

const errorTitle: CSSProperties = {
  display: "block",
  color: "#102033",
  fontFamily: "'Baloo 2', sans-serif",
  fontSize: 22,
  marginBottom: 5,
};

const errorText: CSSProperties = {
  color: "#718096",
  lineHeight: 1.6,
  margin: "0 0 16px",
  fontSize: 14,
};