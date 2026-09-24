"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

const categoryLabels: Record<
  Language,
  Record<string, string>
> = {
  en: {
    "Pothole / Road Damage": "Pothole / Road Damage",
    "Open Drain / Gutters": "Open Drain / Gutters",
    "Broken Streetlight": "Broken Streetlight",
    "Broken Barricade": "Broken Barricade",
    "Garbage / Waste": "Garbage / Waste",
    "Water / Sewerage Problem": "Water / Sewerage Problem",
    "Traffic / Parking Issue": "Traffic / Parking Issue",
    "Damaged Public Property": "Damaged Public Property",
    "Public Safety Issue": "Public Safety Issue",
    Other: "Other",
  },

  hi: {
    "Pothole / Road Damage": "गड्ढा / सड़क क्षति",
    "Open Drain / Gutters": "खुली नाली / गटर",
    "Broken Streetlight": "खराब स्ट्रीट लाइट",
    "Broken Barricade": "टूटी हुई बैरिकेड",
    "Garbage / Waste": "कचरा / अपशिष्ट",
    "Water / Sewerage Problem": "पानी / सीवरेज समस्या",
    "Traffic / Parking Issue": "यातायात / पार्किंग समस्या",
    "Damaged Public Property": "क्षतिग्रस्त सार्वजनिक संपत्ति",
    "Public Safety Issue": "सार्वजनिक सुरक्षा समस्या",
    Other: "अन्य",
  },

  mr: {
    "Pothole / Road Damage": "खड्डा / रस्त्याचे नुकसान",
    "Open Drain / Gutters": "उघडी नाली / गटार",
    "Broken Streetlight": "बंद / खराब स्ट्रीटलाइट",
    "Broken Barricade": "तुटलेले बॅरिकेड",
    "Garbage / Waste": "कचरा / टाकाऊ पदार्थ",
    "Water / Sewerage Problem": "पाणी / सांडपाणी समस्या",
    "Traffic / Parking Issue": "वाहतूक / पार्किंग समस्या",
    "Damaged Public Property": "नुकसान झालेली सार्वजनिक मालमत्ता",
    "Public Safety Issue": "सार्वजनिक सुरक्षेची समस्या",
    Other: "इतर",
  },
};

const content = {
  en: {
    back: "← Back to Dashboard",

    label: "KARMAFACIE",
    title: "My Civic Issues",
    description:
      "View the civic problems you have reported and track their progress.",

    loadingReports: "Loading your civic reports...",

    noIssuesTitle: "No Issues Reported Yet",
    noIssuesDescription:
      "Have you spotted a civic problem? Report it through KarmaFacie.",
    reportIssue: "Report an Issue",

    reported: "Reported",
    underReview: "Under Review",
    inProgress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
    draft: "Draft",

    dateUnavailable: "Date unavailable",
    verificationDateUnavailable:
      "Verification date unavailable",

    untitledIssue: "Untitled Civic Issue",
    noDescription: "No description provided.",

    gps: "GPS:",
    reportedAt: "Reported:",

    directoryRouting: "DIRECTORY ROUTING",
    department: "Department:",
    issueType: "Issue type:",
    channel: "Channel:",
    directoryVerified: "Directory information verified:",
    authorityDirectoryId: "Authority Directory ID:",

    authority: "Authority:",
    referenceId: "Reference ID:",

    noVerifiedRoute:
      "ℹ️ No verified directory route is currently attached to this report.",

    reportedFrom: "Reported from:",
    civicIssueId: "Civic Issue ID:",

    viewFullDetails: "View Full Details →",

    disclaimer:
      "KarmaFacie currently provides directory-based authority routing information along with your report, evidence, location and status. Authority details are maintained as directory information and do not by themselves represent an official determination by the government authority. Official grievance submission and direct government-system integration will be developed separately.",

    civicIssueEvidence: "Civic issue evidence",
  },

  hi: {
    back: "← डैशबोर्ड पर वापस जाएँ",

    label: "KARMAFACIE",
    title: "मेरी नागरिक समस्याएँ",
    description:
      "आपके द्वारा रिपोर्ट की गई नागरिक समस्याएँ देखें और उनकी प्रगति को ट्रैक करें।",

    loadingReports: "आपकी नागरिक रिपोर्ट लोड हो रही हैं...",

    noIssuesTitle: "अभी तक कोई समस्या रिपोर्ट नहीं की गई",
    noIssuesDescription:
      "क्या आपने कोई नागरिक समस्या देखी है? उसे KarmaFacie के माध्यम से रिपोर्ट करें।",
    reportIssue: "समस्या की रिपोर्ट करें",

    reported: "रिपोर्ट की गई",
    underReview: "समीक्षा के अधीन",
    inProgress: "कार्य प्रगति पर",
    resolved: "समाधान हो गया",
    rejected: "अस्वीकृत",
    draft: "ड्राफ्ट",

    dateUnavailable: "तारीख उपलब्ध नहीं है",
    verificationDateUnavailable:
      "सत्यापन की तारीख उपलब्ध नहीं है",

    untitledIssue: "बिना शीर्षक की नागरिक समस्या",
    noDescription: "कोई विवरण उपलब्ध नहीं है।",

    gps: "GPS:",
    reportedAt: "रिपोर्ट की गई:",

    directoryRouting: "डायरेक्टरी रूटिंग",
    department: "विभाग:",
    issueType: "समस्या का प्रकार:",
    channel: "माध्यम:",
    directoryVerified: "डायरेक्टरी जानकारी सत्यापित:",
    authorityDirectoryId: "प्राधिकरण डायरेक्टरी ID:",

    authority: "प्राधिकरण:",
    referenceId: "रेफरेंस ID:",

    noVerifiedRoute:
      "ℹ️ इस रिपोर्ट से अभी कोई सत्यापित डायरेक्टरी मार्ग जुड़ा नहीं है।",

    reportedFrom: "रिपोर्ट का स्थान:",
    civicIssueId: "नागरिक समस्या ID:",

    viewFullDetails: "पूरी जानकारी देखें →",

    disclaimer:
      "KarmaFacie वर्तमान में आपकी रिपोर्ट, प्रमाण, स्थान और स्थिति के साथ डायरेक्टरी-आधारित प्राधिकरण मार्गदर्शन की जानकारी प्रदान करता है। प्राधिकरण की जानकारी डायरेक्टरी के रूप में रखी जाती है और अपने आप में संबंधित सरकारी प्राधिकरण के आधिकारिक निर्णय का प्रतिनिधित्व नहीं करती। आधिकारिक शिकायत सबमिशन और सरकारी सिस्टम के साथ सीधा एकीकरण अलग से विकसित किया जाएगा।",

    civicIssueEvidence: "नागरिक समस्या का प्रमाण",
  },

  mr: {
    back: "← डॅशबोर्डवर परत जा",

    label: "KARMAFACIE",
    title: "माझ्या नागरी समस्या",
    description:
      "तुम्ही नोंदवलेल्या नागरी समस्या पाहा आणि त्यांची प्रगती ट्रॅक करा.",

    loadingReports:
      "तुमच्या नागरी नोंदी लोड होत आहेत...",

    noIssuesTitle:
      "अद्याप कोणतीही समस्या नोंदवलेली नाही",
    noIssuesDescription:
      "तुम्हाला नागरी समस्या दिसली आहे का? ती KarmaFacie द्वारे नोंदवा.",
    reportIssue: "समस्या नोंदवा",

    reported: "नोंदवलेली",
    underReview: "तपासणी सुरू",
    inProgress: "काम सुरू",
    resolved: "निराकरण झाले",
    rejected: "नाकारण्‍यात आले",
    draft: "मसुदा",

    dateUnavailable: "तारीख उपलब्ध नाही",
    verificationDateUnavailable:
      "पडताळणीची तारीख उपलब्ध नाही",

    untitledIssue: "शीर्षक नसलेली नागरी समस्या",
    noDescription: "कोणतेही वर्णन उपलब्ध नाही.",

    gps: "GPS:",
    reportedAt: "नोंदवले:",

    directoryRouting: "डायरेक्टरी रूटिंग",
    department: "विभाग:",
    issueType: "समस्येचा प्रकार:",
    channel: "माध्यम:",
    directoryVerified: "डायरेक्टरी माहिती पडताळली:",
    authorityDirectoryId: "प्राधिकरण डायरेक्टरी ID:",

    authority: "प्राधिकरण:",
    referenceId: "संदर्भ ID:",

    noVerifiedRoute:
      "ℹ️ या नोंदीला सध्या कोणताही सत्यापित डायरेक्टरी मार्ग जोडलेला नाही.",

    reportedFrom: "नोंदवलेले स्थान:",
    civicIssueId: "नागरी समस्या ID:",

    viewFullDetails: "संपूर्ण माहिती पाहा →",

    disclaimer:
      "KarmaFacie सध्या तुमच्या नोंदी, पुरावे, स्थान आणि स्थितीसोबत डायरेक्टरी-आधारित प्राधिकरण मार्गदर्शनाची माहिती देते. प्राधिकरणाची माहिती डायरेक्टरी स्वरूपात ठेवली जाते आणि ती स्वतःहून संबंधित सरकारी प्राधिकरणाचा अधिकृत निर्णय दर्शवत नाही. अधिकृत तक्रार सबमिशन आणि सरकारी प्रणालीशी थेट एकत्रीकरण स्वतंत्रपणे विकसित केले जाईल.",

    civicIssueEvidence: "नागरी समस्येचा पुरावा",
  },
};

type CivicIssue = {
  id: string;
  category: string;
  title: string | null;
  description: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  photo_path: string | null;
  status: string;
  authority_name: string | null;
  authority_reference_id: string | null;
  reported_city: string | null;
  reported_state: string | null;
  authority_directory_id: number | null;
  reported_at: string | null;
};

type AuthorityDirectory = {
  id: number;
  city: string;
  state: string;
  authority_name: string;
  department_name: string | null;
  issue_category: string;
  grievance_url: string | null;
  official_source_url: string | null;
  submission_method: string | null;
  notes: string | null;
  is_active: boolean;
  verified_at: string | null;
};

type IssueWithPhoto = CivicIssue & {
  photo_url: string | null;
  authority_details:
    | AuthorityDirectory
    | null;
};

export default function MyIssuesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const text = content[language];

  const [issues, setIssues] =
    useState<IssueWithPhoto[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIssues();
  }, []);

  async function loadIssues() {
    setLoading(true);
    setError("");

    try {
      // ------------------------------------------
      // 1. Get current authenticated user
      // ------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      // ------------------------------------------
      // 2. Load user's civic issues
      // ------------------------------------------

      const {
        data,
        error: issuesError,
      } = await supabase
        .from("civic_issues")
        .select(
          `
          id,
          category,
          title,
          description,
          location_text,
          latitude,
          longitude,
          photo_path,
          status,
          authority_name,
          authority_reference_id,
          reported_city,
          reported_state,
          authority_directory_id,
          reported_at
          `
        )
        .eq("user_id", user.id)
        .order("reported_at", {
          ascending: false,
        });

      if (issuesError) {
        console.error(issuesError);
        setError(issuesError.message);
        return;
      }

      const rawIssues = data || [];

      // ------------------------------------------
      // 3. Load authority directory records
      // ------------------------------------------

      const authorityIds = Array.from(
        new Set(
          rawIssues
            .map(
              (issue) =>
                issue.authority_directory_id
            )
            .filter(
              (id): id is number =>
                id !== null
            )
        )
      );

      let authorityMap =
        new Map<
          number,
          AuthorityDirectory
        >();

      if (authorityIds.length > 0) {
        const {
          data: authorityData,
          error: authorityError,
        } = await supabase
          .from("authority_directory")
          .select(
            `
            id,
            city,
            state,
            authority_name,
            department_name,
            issue_category,
            grievance_url,
            official_source_url,
            submission_method,
            notes,
            is_active,
            verified_at
            `
          )
          .in("id", authorityIds);

        if (authorityError) {
          console.error(
            "Authority directory loading error:",
            authorityError
          );
        } else {
          authorityMap = new Map(
            (authorityData || []).map(
              (authority) => [
                authority.id,
                authority,
              ]
            )
          );
        }
      }

      // ------------------------------------------
      // 4. Create signed photo URLs
      // ------------------------------------------

      const loadedIssues: IssueWithPhoto[] =
        [];

      for (const issue of rawIssues) {
        let photoUrl: string | null =
          null;

        if (issue.photo_path) {
          const {
            data: signedUrlData,
            error: signedUrlError,
          } = await supabase.storage
            .from("civic-issue-photos")
            .createSignedUrl(
              issue.photo_path,
              3600
            );

          if (
            !signedUrlError &&
            signedUrlData?.signedUrl
          ) {
            photoUrl =
              signedUrlData.signedUrl;
          }
        }

        const authorityDetails =
          issue.authority_directory_id
            ? authorityMap.get(
                issue.authority_directory_id
              ) || null
            : null;

        loadedIssues.push({
          ...issue,
          photo_url: photoUrl,
          authority_details:
            authorityDetails,
        });
      }

      setIssues(loadedIssues);
    } catch (err) {
      console.error(err);

      setError(
        language === "en"
          ? "Unable to load your reported issues."
          : language === "hi"
            ? "आपकी रिपोर्ट की गई समस्याएँ लोड नहीं हो सकीं।"
            : "तुमच्या नोंदवलेल्या समस्या लोड करता आल्या नाहीत."
      );
    } finally {
      setLoading(false);
    }
  }

  function getStatusLabel(
    status: string
  ) {
    switch (status) {
      case "reported":
        return text.reported;

      case "under_review":
        return text.underReview;

      case "in_progress":
        return text.inProgress;

      case "resolved":
        return text.resolved;

      case "rejected":
        return text.rejected;

      case "draft":
        return text.draft;

      default:
        return status;
    }
  }

  function getStatusIcon(
    status: string
  ) {
    switch (status) {
      case "reported":
        return "📨";

      case "under_review":
        return "🔍";

      case "in_progress":
        return "🔧";

      case "resolved":
        return "✅";

      case "rejected":
        return "⚠️";

      default:
        return "📌";
    }
  }

  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return text.dateUnavailable;
    }

    const locale =
      language === "hi"
        ? "hi-IN"
        : language === "mr"
          ? "mr-IN"
          : "en-IN";

    return new Date(
      date
    ).toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatVerifiedDate(
    date: string | null
  ) {
    if (!date) {
      return text.verificationDateUnavailable;
    }

    const locale =
      language === "hi"
        ? "hi-IN"
        : language === "mr"
          ? "mr-IN"
          : "en-IN";

    return new Date(
      date
    ).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getCategoryLabel(
    category: string
  ) {
    return (
      categoryLabels[language][category] ||
      category
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #18222e 0%, #0b0f14 45%, #070a0d 100%)",
        color: "white",
        padding:
          "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* BACK TO DASHBOARD */}

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          style={{
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "24px",
          }}
        >
          {text.back}
        </button>

        {/* HEADER */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#60a5fa",
              fontWeight: 700,
              marginBottom: "8px",
              letterSpacing:
                "0.5px",
            }}
          >
            {text.label}
          </div>

          <h1
            style={{
              fontSize: "34px",
              margin: "0 0 10px",
              fontWeight: 800,
            }}
          >
            {text.title}
          </h1>

          <p
            style={{
              color: "#9ca3af",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {text.description}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background:
                "rgba(239,68,68,0.12)",
              border:
                "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
              padding: "14px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              background:
                "rgba(17,24,39,0.88)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding:
                "50px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                marginBottom: "15px",
              }}
            >
              🏙️
            </div>

            <div
              style={{
                color: "#9ca3af",
                fontSize: "16px",
              }}
            >
              {text.loadingReports}
            </div>
          </div>
        ) : issues.length === 0 ? (
          /* NO ISSUES */

          <div
            style={{
              background:
                "rgba(17,24,39,0.88)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding:
                "50px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              🏙️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "24px",
              }}
            >
              {text.noIssuesTitle}
            </h2>

            <p
              style={{
                color: "#9ca3af",
                marginBottom:
                  "25px",
              }}
            >
              {text.noIssuesDescription}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/report-issue"
                )
              }
              style={{
                padding:
                  "13px 20px",
                borderRadius:
                  "12px",
                border: "none",
                background:
                  "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {text.reportIssue}
            </button>
          </div>
        ) : (
          /* ISSUE LIST */

          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            {issues.map((issue) => (
              <div
                key={issue.id}
                style={{
                  background:
                    "rgba(17,24,39,0.88)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap:
                      "wrap",
                  }}
                >
                  {/* PHOTO */}

                  {issue.photo_url && (
                    <div
                      style={{
                        width: "260px",
                        minHeight:
                          "220px",
                        background:
                          "#0b0f14",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={
                          issue.photo_url
                        }
                        alt={
                          issue.title ||
                          text.civicIssueEvidence
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          minHeight:
                            "220px",
                          objectFit:
                            "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  )}

                  {/* DETAILS */}

                  <div
                    style={{
                      padding: "24px",
                      flex: 1,
                      minWidth:
                        "280px",
                    }}
                  >
                    {/* CATEGORY + STATUS */}

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                        flexWrap:
                          "wrap",
                        marginBottom:
                          "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color:
                            "#60a5fa",
                          fontWeight: 700,
                        }}
                      >
                        {getCategoryLabel(
                          issue.category
                        )}
                      </span>

                      <span
                        style={{
                          background:
                            "rgba(255,255,255,0.06)",
                          border:
                            "1px solid rgba(255,255,255,0.1)",
                          borderRadius:
                            "999px",
                          padding:
                            "7px 11px",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                        }}
                      >
                        {getStatusIcon(
                          issue.status
                        )}{" "}
                        {getStatusLabel(
                          issue.status
                        )}
                      </span>
                    </div>

                    {/* TITLE */}

                    <h2
                      style={{
                        margin:
                          "0 0 10px",
                        fontSize:
                          "22px",
                      }}
                    >
                      {issue.title ||
                        text.untitledIssue}
                    </h2>

                    {/* DESCRIPTION */}

                    <p
                      style={{
                        color:
                          "#d1d5db",
                        lineHeight:
                          1.6,
                        margin:
                          "0 0 16px",
                      }}
                    >
                      {issue.description ||
                        text.noDescription}
                    </p>

                    {/* LOCATION */}

                    {issue.location_text && (
                      <div
                        style={{
                          color:
                            "#9ca3af",
                          fontSize:
                            "14px",
                          marginBottom:
                            "8px",
                        }}
                      >
                        📍{" "}
                        {issue.location_text}
                      </div>
                    )}

                    {/* GPS */}

                    {issue.latitude !==
                      null &&
                      issue.longitude !==
                        null && (
                        <div
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                            marginBottom:
                              "12px",
                          }}
                        >
                          {text.gps}{" "}
                          {issue.latitude.toFixed(
                            6
                          )}
                          ,{" "}
                          {issue.longitude.toFixed(
                            6
                          )}
                        </div>
                      )}

                    {/* REPORTED DATE */}

                    <div
                      style={{
                        color:
                          "#6b7280",
                        fontSize:
                          "13px",
                        marginBottom:
                          "16px",
                      }}
                    >
                      {text.reportedAt}{" "}
                      {formatDate(
                        issue.reported_at
                      )}
                    </div>

                    {/* AUTHORITY ROUTING */}

                    {issue.authority_details ? (
                      <div
                        style={{
                          background:
                            "rgba(34,197,94,0.06)",
                          border:
                            "1px solid rgba(34,197,94,0.18)",
                          borderRadius:
                            "14px",
                          padding:
                            "16px",
                          marginBottom:
                            "14px",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#86efac",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                            letterSpacing:
                              "0.5px",
                            marginBottom:
                              "9px",
                          }}
                        >
                          {
                            text.directoryRouting
                          }
                        </div>

                        <div
                          style={{
                            fontSize:
                              "16px",
                            fontWeight:
                              700,
                            marginBottom:
                              "8px",
                          }}
                        >
                          🏛️{" "}
                          {
                            issue
                              .authority_details
                              .authority_name
                          }
                        </div>

                        {issue
                          .authority_details
                          .department_name && (
                          <div
                            style={{
                              color:
                                "#d1d5db",
                              fontSize:
                                "14px",
                              marginBottom:
                                "6px",
                            }}
                          >
                            <strong>
                              {
                                text.department
                              }
                            </strong>{" "}
                            {
                              issue
                                .authority_details
                                .department_name
                            }
                          </div>
                        )}

                        <div
                          style={{
                            color:
                              "#d1d5db",
                            fontSize:
                              "14px",
                            marginBottom:
                              "6px",
                          }}
                        >
                          <strong>
                            {
                              text.issueType
                            }
                          </strong>{" "}
                          {getCategoryLabel(
                            issue
                              .authority_details
                              .issue_category
                          )}
                        </div>

                        {issue
                          .authority_details
                          .submission_method && (
                          <div
                            style={{
                              color:
                                "#d1d5db",
                              fontSize:
                                "14px",
                              marginBottom:
                                "6px",
                            }}
                          >
                            <strong>
                              {
                                text.channel
                              }
                            </strong>{" "}
                            {
                              issue
                                .authority_details
                                .submission_method
                            }
                          </div>
                        )}

                        {issue
                          .authority_details
                          .notes && (
                          <div
                            style={{
                              color:
                                "#9ca3af",
                              fontSize:
                                "13px",
                              lineHeight:
                                1.5,
                              marginTop:
                                "10px",
                            }}
                          >
                            {
                              issue
                                .authority_details
                                .notes
                            }
                          </div>
                        )}

                        {issue
                          .authority_details
                          .verified_at && (
                          <div
                            style={{
                              color:
                                "#6b7280",
                              fontSize:
                                "11px",
                              marginTop:
                                "10px",
                            }}
                          >
                            {
                              text.directoryVerified
                            }{" "}
                            {formatVerifiedDate(
                              issue
                                .authority_details
                                .verified_at
                            )}
                          </div>
                        )}

                        <div
                          style={{
                            color:
                              "#4b5563",
                            fontSize:
                              "11px",
                            marginTop:
                              "8px",
                          }}
                        >
                          {
                            text.authorityDirectoryId
                          }{" "}
                          {
                            issue
                              .authority_details
                              .id
                          }
                        </div>
                      </div>
                    ) : issue.authority_name ? (
                      /* FALLBACK FOR OLDER REPORTS */

                      <div
                        style={{
                          background:
                            "rgba(96,165,250,0.08)",
                          border:
                            "1px solid rgba(96,165,250,0.18)",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 13px",
                          marginBottom:
                            "12px",
                          fontSize:
                            "14px",
                        }}
                      >
                        🏛️{" "}
                        {
                          text.authority
                        }{" "}
                        <strong>
                          {
                            issue.authority_name
                          }
                        </strong>

                        {issue.authority_reference_id && (
                          <div
                            style={{
                              color:
                                "#9ca3af",
                              fontSize:
                                "12px",
                              marginTop:
                                "4px",
                            }}
                          >
                            {
                              text.referenceId
                            }{" "}
                            {
                              issue.authority_reference_id
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          background:
                            "rgba(148,163,184,0.05)",
                          border:
                            "1px solid rgba(148,163,184,0.12)",
                          borderRadius:
                            "12px",
                          padding:
                            "12px 14px",
                          marginBottom:
                            "12px",
                          color:
                            "#94a3b8",
                          fontSize:
                            "13px",
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          text.noVerifiedRoute
                        }
                      </div>
                    )}

                    {/* CITY */}

                    {issue.reported_city && (
                      <div
                        style={{
                          color:
                            "#6b7280",
                          fontSize:
                            "12px",
                          marginBottom:
                            "10px",
                        }}
                      >
                        {
                          text.reportedFrom
                        }{" "}
                        {
                          issue.reported_city
                        }
                        {issue.reported_state
                          ? `, ${issue.reported_state}`
                          : ""}
                      </div>
                    )}

                    {/* ISSUE ID */}

                    <div
                      style={{
                        color:
                          "#4b5563",
                        fontSize:
                          "11px",
                        wordBreak:
                          "break-all",
                      }}
                    >
                      {
                        text.civicIssueId
                      }{" "}
                      {issue.id}
                    </div>

                    {/* VIEW FULL DETAILS */}

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/my-issues/${issue.id}`
                        )
                      }
                      style={{
                        marginTop:
                          "14px",
                        padding:
                          "11px 16px",
                        borderRadius:
                          "10px",
                        border:
                          "1px solid #334155",
                        background:
                          "#1e293b",
                        color: "white",
                        cursor:
                          "pointer",
                        fontSize:
                          "13px",
                        fontWeight:
                          700,
                      }}
                    >
                      {
                        text.viewFullDetails
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DISCLAIMER */}

        <div
          style={{
            marginTop: "28px",
            padding: "18px",
            borderRadius: "14px",
            background:
              "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            color: "#9ca3af",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          {text.disclaimer}
        </div>
      </div>
    </main>
  );
}