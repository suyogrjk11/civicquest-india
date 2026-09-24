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
    resolvedNext: "KarmaFacie records this issue as resolved. Citizens can verify the outcome through their own observations.",
    communitySignal: "Community Signal",
    communitySignalText: "This page shows the public KarmaFacie view of the issue. Citizen identity and private account details are not displayed.",
    details: "Issue Details",
    location: "Location",
    category: "Category",
    cityState: "City / State",
    reference: "KarmaFacie Reference",
    myIssue: "Open My Issue →",
    evidence: "Evidence",
    noPhoto: "No photo evidence was attached to this report.",
    privacy: "Community view",
    privacyText: "This is a KarmaFacie community record, not an official government response. Official status is shown only when supported by recorded authority information.",
    social: "Tag the Authority",
    socialText: "Verified authority social profiles will appear here when they are added to the authority directory.",
    noSocial: "No verified social profile is currently stored for this authority.",
    tagAuthority: "Tag Authority",
    verified: "Directory verified",
    report: "Report",
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
    resolvedNext: "KarmaFacie में समस्या का समाधान दर्ज है। नागरिक अपने निरीक्षण से परिणाम की पुष्टि कर सकते हैं।",
    communitySignal: "कम्युनिटी संकेत",
    communitySignalText: "यह पेज KarmaFacie में समस्या का सार्वजनिक दृश्य दिखाता है। नागरिक की पहचान और निजी अकाउंट जानकारी प्रदर्शित नहीं की जाती।",
    details: "समस्या विवरण",
    location: "स्थान",
    category: "श्रेणी",
    cityState: "शहर / राज्य",
    reference: "KarmaFacie संदर्भ",
    myIssue: "मेरी समस्या खोलें →",
    evidence: "सबूत",
    noPhoto: "इस रिपोर्ट में फोटो सबूत संलग्न नहीं है।",
    privacy: "कम्युनिटी दृश्य",
    privacyText: "यह KarmaFacie का कम्युनिटी रिकॉर्ड है, आधिकारिक सरकारी प्रतिक्रिया नहीं। आधिकारिक स्थिति केवल दर्ज प्राधिकरण जानकारी के आधार पर दिखाई जाती है।",
    social: "प्राधिकरण को टैग करें",
    socialText: "सत्यापित प्राधिकरण सोशल प्रोफाइल यहाँ दिखाई देंगे जब उन्हें प्राधिकरण डायरेक्टरी में जोड़ा जाएगा।",
    noSocial: "इस प्राधिकरण के लिए अभी कोई सत्यापित सोशल प्रोफाइल दर्ज नहीं है।",
    verified: "डायरेक्टरी सत्यापित",
    report: "रिपोर्ट",
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
    resolvedNext: "KarmaFacie मध्ये समस्या निकाली काढल्याची नोंद आहे. नागरिक स्वतःच्या निरीक्षणातून परिणाम तपासू शकतात.",
    communitySignal: "कम्युनिटी संकेत",
    communitySignalText: "हे पेज KarmaFacie मधील समस्येचे सार्वजनिक दृश्य दाखवते. नागरिकाची ओळख आणि खासगी अकाउंट माहिती दाखवली जात नाही.",
    details: "समस्या तपशील",
    location: "स्थान",
    category: "श्रेणी",
    cityState: "शहर / राज्य",
    reference: "KarmaFacie संदर्भ",
    myIssue: "माझी समस्या उघडा →",
    evidence: "पुरावा",
    noPhoto: "या अहवालासोबत फोटो पुरावा जोडलेला नाही.",
    privacy: "कम्युनिटी दृश्य",
    privacyText: "हा KarmaFacie कम्युनिटी रेकॉर्ड आहे, अधिकृत सरकारी प्रतिसाद नाही. अधिकृत स्थिती केवळ नोंदवलेल्या प्राधिकरण माहितीनुसार दाखवली जाते.",
    social: "प्राधिकरणाला टॅग करा",
    socialText: "सत्यापित प्राधिकरण सोशल प्रोफाइल प्राधिकरण डायरेक्टरीमध्ये जोडल्यावर येथे दिसतील.",
    noSocial: "या प्राधिकरणासाठी सध्या कोणतेही सत्यापित सोशल प्रोफाइल नोंदवलेले नाही.",
    verified: "डायरेक्टरी सत्यापित",
    report: "अहवाल",
  },
};

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
  return status.replace(/_/g, " ");
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
  return labels[category]?.[language] || category.replace(/_/g, " ");
}

export default function CommunityIssuePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { language } = useLanguage();
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

    ctx.fillStyle = "#08111c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff7a00";
    ctx.fillRect(0, 0, canvas.width, 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 34px Arial";
    ctx.fillText("KARMAFACIE", 70, 82);

    ctx.fillStyle = "#ffb36a";
    ctx.font = "700 22px Arial";
    ctx.fillText("COMMUNITY ISSUE", 70, 126);

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

    const title = issue.title || "Civic issue reported by the community";
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 42px Arial";
    wrapCanvasText(ctx, title, 70, imageBottom + 65, 940, 52, 3);

    ctx.fillStyle = "#a9b7c7";
    ctx.font = "400 24px Arial";
    const location = issue.location_text || [issue.reported_city, issue.reported_state].filter(Boolean).join(", ") || "Location not specified";
    wrapCanvasText(ctx, location, 70, imageBottom + 225, 940, 34, 2);

    ctx.fillStyle = "#ff9a3d";
    ctx.font = "700 24px Arial";
    ctx.fillText(`${reportCount} ${reportCount === 1 ? "community report" : "community reports"}`, 70, imageBottom + 310);

    if (authority?.authority_name) {
      ctx.fillStyle = "#dce6f2";
      ctx.font = "600 23px Arial";
      wrapCanvasText(ctx, `Authority: ${authority.authority_name}`, 70, imageBottom + 355, 940, 32, 2);

      if (authority.official_instagram_url) {
        ctx.fillStyle = "#ffb36a";
        ctx.font = "600 20px Arial";
        ctx.fillText("Tag the authority on Instagram", 70, imageBottom + 430);
      }
    }

    ctx.fillStyle = "#6f8195";
    ctx.font = "400 19px Arial";
    ctx.fillText("KarmaFacie community record", 70, 1270);
    ctx.fillText("Verify official responses through the authority's official channel.", 70, 1304);

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
          title: issue.title || "KarmaFacie Community Issue",
          text: `KarmaFacie community issue: ${issue.title || issue.category}`,
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
    return <main style={styles.page}><div style={styles.container}><p style={styles.muted}>{t.loading}</p></div></main>;
  }

  if (error || !issue) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <button onClick={() => router.push("/community")} style={styles.back}>{t.back}</button>
          <section style={styles.card}><h1 style={styles.heading}>{t.error}</h1><p style={styles.muted}>{error || t.notFound}</p></section>
        </div>
      </main>
    );
  }

  const meta = statusMeta[issue.status] || statusMeta.reported;
  const nextText = issue.status === "resolved" ? t.resolvedNext : issue.status === "in_progress" ? t.progressNext : issue.status === "under_review" ? t.reviewNext : t.reportedNext;
  const cityState = [issue.reported_city, issue.reported_state].filter(Boolean).join(", ") || "—";
  const location = issue.location_text || cityState;
  const countText = reportCount === 1 ? t.personReported : t.peopleReported;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => router.push("/community")} style={styles.back}>{t.back}</button>

        <section style={styles.hero}>
          <div style={styles.heroTop}>
            <div>
              <div style={styles.eyebrow}>{t.communityIssue}</div>
              <div style={styles.category}>{categoryLabel(issue.category, language)}</div>
            </div>
            <span className={meta.className} style={styles.statusPill}>{meta.icon} {statusLabel(issue.status, language)}</span>
          </div>

          <h1 style={styles.heroTitle}>{issue.title || categoryLabel(issue.category, language)}</h1>
          <p style={styles.heroDescription}>{issue.description || "—"}</p>

          {photoUrl ? <img src={photoUrl} alt={issue.title || "Community issue evidence"} style={styles.heroImage} /> : <div style={styles.noPhoto}>{t.noPhoto}</div>}

          <div style={styles.heroMeta}>
            <span>📍 {location}</span>
            <span>📅 {formatDate(issue.reported_at || issue.created_at, language)}</span>
          </div>
        </section>

        <section style={styles.signalCard}>
          <div>
            <div style={styles.eyebrow}>{t.communitySignal}</div>
            <div style={styles.signalNumber}>{reportCount}</div>
            <div style={styles.signalLabel}>{countText}</div>
          </div>
          <div style={styles.signalText}>{t.communitySignalText}</div>
          <div style={styles.actions}>
            <button onClick={() => void shareIssue()} disabled={sharing} style={styles.primaryButton}>📤 {sharing ? t.sharing : t.share}</button>
            <button onClick={() => void copyLink()} style={styles.secondaryButton}>🔗 {copied ? t.copied : t.copy}</button>
          </div>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardEyebrow}>{t.authority}</div>
            {authority ? (
              <>
                <h2 style={styles.cardTitle}>🏛️ {authority.authority_name}</h2>
                {authority.department_name && <p style={styles.detailLine}>{authority.department_name}</p>}
                {authority.sub_department_name && <p style={styles.detailLine}>{authority.sub_department_name}</p>}
                {authority.verified_at && <p style={styles.verified}>✓ {t.verified}: {formatDate(authority.verified_at, language)}</p>}
                <div style={styles.linkRow}>
                  {authority.official_source_url && <a href={authority.official_source_url} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>{t.officialSite}</a>}
                  {authority.grievance_url && <a href={authority.grievance_url} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>{t.complaintChannel}</a>}
                </div>
                <div style={styles.socialBox}>
                  <div style={styles.socialTitle}>📣 {t.social}</div>
                  <p style={styles.mutedSmall}>{t.socialText}</p>

                  {socialLinks(authority).length > 0 ? (
                    <>
                      <div style={styles.socialLinks}>
                        {socialLinks(authority).map((item) => (
                          <a
                            key={item.key}
                            href={item.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.socialButton}
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
                          style={styles.tagButton}
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

          <div style={styles.card}>
            <div style={styles.cardEyebrow}>{t.details}</div>
            <div style={styles.detailsGrid}>
              <Detail label={t.location} value={location} />
              <Detail label={t.category} value={categoryLabel(issue.category, language)} />
              <Detail label={t.cityState} value={cityState} />
              <Detail label={t.reference} value={issue.id} mono />
            </div>
            <button onClick={() => router.push(`/my-issues/${issue.id}`)} style={styles.secondaryButton}>{t.myIssue}</button>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardEyebrow}>{t.journey}</div>
          <div style={styles.timeline}>
            <TimelineItem active icon="📨" title={t.reported} date={formatDate(issue.reported_at || issue.created_at, language)} />
            <TimelineItem active={issue.status !== "reported"} icon={meta.icon} title={statusLabel(issue.status, language)} date={formatDate(issue.updated_at, language)} />
            <TimelineItem active={issue.status === "resolved"} icon="✅" title={t.resolved} date={formatDate(issue.status === "resolved" ? issue.updated_at : null, language)} last />
          </div>
        </section>

        <section style={styles.nextCard}>
          <div style={styles.cardEyebrow}>{t.whatNext}</div>
          <p style={styles.nextText}>{nextText}</p>
        </section>

        <section style={styles.privacyCard}>
          <strong>{t.privacy}</strong>
          <span>{t.privacyText}</span>
        </section>
      </div>
    </main>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={styles.detailBox}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={{ ...styles.detailValue, ...(mono ? { fontFamily: "monospace", fontSize: 12 } : {}) }}>{value}</div>
    </div>
  );
}

function TimelineItem({ active, icon, title, date, last = false }: { active: boolean; icon: string; title: string; date: string; last?: boolean }) {
  return (
    <div style={styles.timelineItem}>
      <div style={styles.timelineRail}>
        <div style={{ ...styles.timelineDot, opacity: active ? 1 : 0.3 }}>{icon}</div>
        {!last && <div style={{ ...styles.timelineLine, opacity: active ? 1 : 0.25 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 22 }}>
        <div style={styles.timelineTitle}>{title}</div>
        <div style={styles.mutedSmall}>{date}</div>
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
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #152333 0%, #080d13 48%, #05080c 100%)",
    color: "#f8fafc",
    padding: "28px 18px 70px",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  back: { background: "transparent", border: 0, color: "#9fb1c5", fontSize: 14, cursor: "pointer", padding: "6px 0 20px" },
  hero: { background: "#0d1723", border: "1px solid #223247", borderRadius: 26, padding: "28px", boxShadow: "0 18px 50px rgba(0,0,0,.18)" },
  heroTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  eyebrow: { color: "#ff9a3d", fontSize: 12, fontWeight: 800, letterSpacing: "1.3px", textTransform: "uppercase" as const },
  category: { color: "#a9b7c7", fontSize: 13, marginTop: 6 },
  statusPill: { display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 999, background: "#162235", border: "1px solid #2c3c52", fontSize: 13, fontWeight: 700 },
  heroTitle: { fontSize: "clamp(30px, 5vw, 48px)", lineHeight: 1.08, margin: "26px 0 12px", letterSpacing: "-1px" },
  heroDescription: { color: "#aebdcd", fontSize: 16, lineHeight: 1.7, maxWidth: 820, margin: 0 },
  heroImage: { width: "100%", maxHeight: 480, objectFit: "cover", borderRadius: 20, marginTop: 24, border: "1px solid #26384e" },
  noPhoto: { marginTop: 24, padding: 26, borderRadius: 18, background: "#101c29", color: "#72859a", border: "1px dashed #2b3c50" },
  heroMeta: { display: "flex", flexWrap: "wrap", gap: 18, color: "#8295aa", fontSize: 13, marginTop: 16 },
  signalCard: { marginTop: 18, display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 22, alignItems: "center", padding: 24, borderRadius: 22, background: "linear-gradient(135deg, rgba(255,122,0,.12), rgba(255,122,0,.035))", border: "1px solid rgba(255,154,61,.25)" },
  signalNumber: { fontSize: 42, fontWeight: 900, marginTop: 4 },
  signalLabel: { color: "#ffb36a", fontSize: 13, lineHeight: 1.35 },
  signalText: { color: "#aebdcd", fontSize: 14, lineHeight: 1.65 },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
  primaryButton: { border: 0, borderRadius: 12, padding: "12px 16px", background: "#ff7a00", color: "#10151c", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  secondaryButton: { border: "1px solid #35475c", borderRadius: 12, padding: "11px 15px", background: "#162235", color: "#e5edf5", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  grid: { display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 18, marginTop: 18 },
  card: { background: "#0d1723", border: "1px solid #223247", borderRadius: 22, padding: 24 },
  cardEyebrow: { color: "#7f95aa", fontSize: 11, fontWeight: 800, letterSpacing: "1.1px", textTransform: "uppercase" as const, marginBottom: 10 },
  cardTitle: { margin: "0 0 8px", fontSize: 22, lineHeight: 1.25 },
  detailLine: { color: "#aebdcd", margin: "4px 0", fontSize: 14 },
  verified: { color: "#77d59a", fontSize: 12, margin: "12px 0 0" },
  linkRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 },
  linkButton: { display: "inline-block", padding: "9px 11px", borderRadius: 10, background: "#152235", border: "1px solid #2d4056", color: "#bcd3ea", textDecoration: "none", fontSize: 12, fontWeight: 700 },
  socialBox: { marginTop: 18, padding: 14, borderRadius: 14, background: "#101b28", border: "1px solid #203145" },
  socialTitle: { fontWeight: 800, fontSize: 14 },
  socialLinks: { display: "flex", flexWrap: "wrap" as const, gap: 8, marginTop: 10 },
  socialButton: { display: "inline-block", padding: "8px 11px", borderRadius: 9, background: "#152235", border: "1px solid #2d4056", color: "#dbeafe", textDecoration: "none", fontSize: 12, fontWeight: 700 },
  tagButton: { display: "inline-block", marginTop: 12, padding: "10px 13px", borderRadius: 10, background: "#ff7a00", color: "#111827", textDecoration: "none", fontSize: 12, fontWeight: 800 },
  muted: { color: "#8ea0b4", lineHeight: 1.6 },
  mutedSmall: { color: "#75889d", fontSize: 12, lineHeight: 1.5 },
  detailsGrid: { display: "grid", gap: 10, marginBottom: 16 },
  detailBox: { padding: "12px 14px", borderRadius: 13, background: "#101b28", border: "1px solid #1f3044" },
  detailLabel: { color: "#71859b", fontSize: 11, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: ".5px" },
  detailValue: { color: "#dbe6f0", fontSize: 13, lineHeight: 1.5, wordBreak: "break-word" as const },
  timeline: { marginTop: 12 },
  timelineItem: { display: "flex", gap: 14 },
  timelineRail: { width: 34, display: "flex", flexDirection: "column" as const, alignItems: "center" },
  timelineDot: { width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "#18283a", border: "1px solid #31475f", fontSize: 15 },
  timelineLine: { width: 1, flex: 1, minHeight: 22, background: "#39516b", marginTop: 5 },
  timelineTitle: { fontWeight: 800, fontSize: 15, marginTop: 5 },
  nextCard: { marginTop: 18, padding: 24, borderRadius: 22, background: "#0b1622", border: "1px solid #203246" },
  nextText: { margin: 0, color: "#aebdcd", lineHeight: 1.7, fontSize: 14 },
  privacyCard: { marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap", padding: "16px 18px", borderRadius: 16, background: "rgba(148,163,184,.05)", border: "1px solid #1d2c3d", color: "#72859a", fontSize: 12, lineHeight: 1.6 },
};

