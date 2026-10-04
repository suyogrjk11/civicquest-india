"use client";



import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import KrutBharatMobileShell from "@/components/KrutBharatMobileShell";

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

    languageLabel: "Language",



    label: "KRUTBHARAT",

    title: "My Civic Issues",

    description:

      "View the civic problems you have reported and track their progress.",



    loadingReports: "Loading your civic reports...",



    noIssuesTitle: "No Issues Reported Yet",

    noIssuesDescription:

      "Have you spotted a civic problem? Report it through KrutBharat.",

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

      "KrutBharat currently provides directory-based authority routing information along with your report, evidence, location and status. Authority details are maintained as directory information and do not by themselves represent an official determination by the government authority. Official grievance submission and direct government-system integration will be developed separately.",



    civicIssueEvidence: "Civic issue evidence",

  },



  hi: {

    back: "← डैशबोर्ड पर वापस जाएँ",

    languageLabel: "भाषा",



    label: "KRUTBHARAT",

    title: "मेरी नागरिक समस्याएँ",

    description:

      "आपके द्वारा रिपोर्ट की गई नागरिक समस्याएँ देखें और उनकी प्रगति को ट्रैक करें।",



    loadingReports: "आपकी नागरिक रिपोर्ट लोड हो रही हैं...",



    noIssuesTitle: "अभी तक कोई समस्या रिपोर्ट नहीं की गई",

    noIssuesDescription:

      "क्या आपने कोई नागरिक समस्या देखी है? उसे KrutBharat के माध्यम से रिपोर्ट करें।",

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

      "KrutBharat वर्तमान में आपकी रिपोर्ट, प्रमाण, स्थान और स्थिति के साथ डायरेक्टरी-आधारित प्राधिकरण मार्गदर्शन की जानकारी प्रदान करता है। प्राधिकरण की जानकारी डायरेक्टरी के रूप में रखी जाती है और अपने आप में संबंधित सरकारी प्राधिकरण के आधिकारिक निर्णय का प्रतिनिधित्व नहीं करती। आधिकारिक शिकायत सबमिशन और सरकारी सिस्टम के साथ सीधा एकीकरण अलग से विकसित किया जाएगा।",



    civicIssueEvidence: "नागरिक समस्या का प्रमाण",

  },



  mr: {

    back: "← डॅशबोर्डवर परत जा",

    languageLabel: "भाषा",



    label: "KRUTBHARAT",

    title: "माझ्या नागरी समस्या",

    description:

      "तुम्ही नोंदवलेल्या नागरी समस्या पाहा आणि त्यांची प्रगती ट्रॅक करा.",



    loadingReports:

      "तुमच्या नागरी नोंदी लोड होत आहेत...",



    noIssuesTitle:

      "अद्याप कोणतीही समस्या नोंदवलेली नाही",

    noIssuesDescription:

      "तुम्हाला नागरी समस्या दिसली आहे का? ती KrutBharat द्वारे नोंदवा.",

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

      "KrutBharat सध्या तुमच्या नोंदी, पुरावे, स्थान आणि स्थितीसोबत डायरेक्टरी-आधारित प्राधिकरण मार्गदर्शनाची माहिती देते. प्राधिकरणाची माहिती डायरेक्टरी स्वरूपात ठेवली जाते आणि ती स्वतःहून संबंधित सरकारी प्राधिकरणाचा अधिकृत निर्णय दर्शवत नाही. अधिकृत तक्रार सबमिशन आणि सरकारी प्रणालीशी थेट एकत्रीकरण स्वतंत्रपणे विकसित केले जाईल.",



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

  const { language, setLanguage } = useLanguage();



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



  const totalIssues = issues.length;

  const resolvedIssues = issues.filter(

    (issue) => issue.status === "resolved"

  ).length;

  const activeIssues = issues.filter(

    (issue) =>

      issue.status === "under_review" ||

      issue.status === "in_progress"

  ).length;



  const ui = {

    en: {

      eyebrow: "CIVIC MEMORY",

      intro: "Every report you make stays connected to your civic journey.",

      total: "Total reports",

      active: "In progress",

      resolvedCount: "Resolved",

      section: "Your reported issues",

      sectionDescription:

        "A clear record of what you reported, where it was observed and the authority route attached to it.",

      details: "View Full Details →",

      noRouteTitle: "Authority route not attached",

      reportedRecord: "Report record",

      locationLabel: "Observed at",

      evidence: "Evidence",

      verified: "Directory verified",

      id: "Issue ID",

    },

    hi: {

      eyebrow: "नागरिक रिकॉर्ड",

      intro: "आपकी हर रिपोर्ट आपकी नागरिक यात्रा से जुड़ी रहती है।",

      total: "कुल रिपोर्ट",

      active: "प्रगति में",

      resolvedCount: "समाधान",

      section: "आपकी रिपोर्ट की गई समस्याएँ",

      sectionDescription:

        "आपकी रिपोर्ट, स्थान और उससे जुड़े प्राधिकरण मार्ग का स्पष्ट रिकॉर्ड।",

      details: "पूरी जानकारी देखें →",

      noRouteTitle: "प्राधिकरण मार्ग जुड़ा नहीं है",

      reportedRecord: "रिपोर्ट रिकॉर्ड",

      locationLabel: "स्थान",

      evidence: "प्रमाण",

      verified: "डायरेक्टरी सत्यापित",

      id: "समस्या ID",

    },

    mr: {

      eyebrow: "नागरी नोंद",

      intro: "तुम्ही केलेली प्रत्येक नोंद तुमच्या नागरी प्रवासाशी जोडलेली राहते.",

      total: "एकूण नोंदी",

      active: "प्रगतीमध्ये",

      resolvedCount: "निराकरण",

      section: "तुम्ही नोंदवलेल्या समस्या",

      sectionDescription:

        "तुमच्या नोंदी, स्थान आणि संबंधित प्राधिकरण मार्गाचा स्पष्ट रेकॉर्ड.",

      details: "संपूर्ण माहिती पाहा →",

      noRouteTitle: "प्राधिकरण मार्ग जोडलेला नाही",

      reportedRecord: "नोंद रेकॉर्ड",

      locationLabel: "स्थान",

      evidence: "पुरावा",

      verified: "डायरेक्टरी पडताळली",

      id: "समस्या ID",

    },

  }[language];



  function statusTone(status: string) {

    switch (status) {

      case "resolved":

        return {

          background: "#eef6e7",

          border: "#d4e4c5",

          color: "#607c43",

        };

      case "in_progress":

        return {

          background: "#fff3e4",

          border: "#efd9bc",

          color: "#9a7047",

        };

      case "under_review":

        return {

          background: "#edf5fb",

          border: "#d6e5ef",

          color: "#557892",

        };

      case "rejected":

        return {

          background: "#fff0ed",

          border: "#ecd0c8",

          color: "#9c5f50",

        };

      default:

        return {

          background: "#f2f0eb",

          border: "#e2ddd5",

          color: "#6f777d",

        };

    }

  }



  return (

    <>

      <KrutBharatMobileShell />


      <style>{`
        /* My Civic Issues only: hide its legacy in-page top bar on mobile/tablet. */
        @media (max-width: 1023px) {
          body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-topbar {
            display: none !important;
          }

          /* Keep the Civic Memory hero content-sized on mobile/tablet,
             rather than forcing the desktop 330px height. */
          body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-hero {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 20px 18px !important;
            margin-bottom: 14px !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      <main

      className="kf-my-issues-page"

      style={{

        minHeight: "100vh",

        background:

          "radial-gradient(circle at 92% 2%, rgba(223,234,243,.76) 0%, rgba(223,234,243,0) 24%), radial-gradient(circle at 4% 34%, rgba(233,242,248,.74) 0%, rgba(233,242,248,0) 22%), radial-gradient(circle at 88% 92%, rgba(255,229,205,.62) 0%, rgba(255,229,205,0) 24%), #f8f3ea",

        color: "#102033",

        padding: "20px 16px 72px",

      }}

    >

      <div

        style={{

          maxWidth: "1440px",

          margin: "0 auto",

          padding: "0 8px",

        }}

      >

        {/* TOP BAR */}

        <header

          className="kf-my-issues-topbar"

          style={{

            position: "sticky",

            top: "14px",

            zIndex: 20,

            display: "grid",

            gridTemplateColumns: "1fr auto 1fr",

            alignItems: "center",

            gap: "18px",

            minHeight: "84px",

            padding: "10px 14px",

            marginBottom: "28px",

            borderRadius: "32px",

            background: "rgba(255,255,255,.94)",

            border: "1px solid rgba(16,27,43,.10)",

            boxShadow: "0 14px 36px rgba(16,27,43,.07)",

            backdropFilter: "blur(16px)",

          }}

        >

          {/* LEFT — DASHBOARD */}

          <div

            style={{

              display: "flex",

              alignItems: "center",

              justifyContent: "flex-start",

              minWidth: 0,

            }}

          >

            <button

              type="button"

              onClick={() => router.push("/dashboard")}

              style={{

                display: "inline-flex",

                alignItems: "center",

                justifyContent: "center",

                gap: "7px",

                minHeight: "48px",

                padding: "0 18px",

                border: "1px solid #dfe3e7",

                borderRadius: "999px",

                background: "#fff",

                color: "#52616f",

                cursor: "pointer",

                fontSize: "14px",

                fontWeight: 800,

                boxShadow: "0 5px 18px rgba(16,32,51,.035)",

              }}

            >

              <span

                style={{

                  color: "#ff7a00",

                  fontSize: "20px",

                  lineHeight: 1,

                  fontWeight: 500,

                }}

              >

                ←

              </span>

              {text.back.replace("← ", "")}

            </button>

          </div>



          {/* CENTER — KRUTBHARAT / MY CIVIC ISSUES */}

          <div

            style={{

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              gap: "12px",

              whiteSpace: "nowrap",

            }}

          >

            <div

              style={{

                width: "56px",

                height: "56px",

                display: "grid",

                placeItems: "center",

                borderRadius: "17px",

                background: "#ff7a00",

                color: "#102033",

                fontFamily: "var(--font-display)",

                fontSize: "31px",

                lineHeight: 1,

                fontWeight: 800,

                boxShadow: "0 8px 18px rgba(255,122,0,.18)",

              }}

            >

              K

            </div>



            <div>

              <div

                style={{

                  color: "#102033",

                  fontFamily: "var(--font-display)",

                  fontSize: "29px",

                  lineHeight: ".95",

                  letterSpacing: "-.045em",

                  fontWeight: 800,

                }}

              >

                Krut<span style={{ color: "#ff7a00" }}>Bharat</span>

              </div>



              <div

                style={{

                  marginTop: "5px",

                  color: "#102033",

                  fontSize: "9px",

                  lineHeight: 1,

                  letterSpacing: ".24em",

                  fontWeight: 900,

                }}

              >

                MY CIVIC ISSUES

              </div>

            </div>

          </div>



          {/* RIGHT — LANGUAGE */}

          <div

            style={{

              display: "flex",

              alignItems: "center",

              justifyContent: "flex-end",

              gap: "12px",

              minWidth: 0,

            }}

          >

            <span

              style={{

                color: "#52616f",

                fontSize: "14px",

                fontWeight: 800,

              }}

            >

              {text.languageLabel}

            </span>



            <select

              value={language}

              onChange={(e) =>

                setLanguage(e.target.value as Language)

              }

              aria-label={text.languageLabel}

              style={{

                appearance: "none",

                minWidth: "132px",

                padding: "12px 16px",

                border: "1px solid #d7d1c9",

                borderRadius: "999px",

                background: "#fff",

                color: "#304154",

                fontSize: "13px",

                fontWeight: 800,

                outline: "none",

                cursor: "pointer",

              }}

            >

              <option value="en">English</option>

              <option value="hi">हिन्दी</option>

              <option value="mr">मराठी</option>

            </select>

          </div>

        </header>

        {/* HERO */}

        <section

          className="kf-my-issues-intro kf-my-issues-memory-hero"

          style={{

            position: "relative",

            overflow: "hidden",

            height: "330px",

            minHeight: "330px",

            maxHeight: "330px",

            boxSizing: "border-box",

            display: "block",

            borderRadius: "30px",

            padding: "24px 28px",

            marginBottom: "14px",

            border: "1px solid rgba(16,27,43,.10)",

            background:

              "radial-gradient(circle at 94% 0%, #e7f1f7 0%, rgba(231,241,247,0) 33%), radial-gradient(circle at 3% 100%, #ffecd9 0%, rgba(255,236,217,0) 33%), rgba(255,253,249,.96)",

            boxShadow: "0 16px 44px rgba(16,27,43,.06)",

          }}

        >

          <div

            className="kf-my-issues-memory-orb"

            style={{

              position: "absolute",

              width: "158px",

              height: "158px",

              right: "-52px",

              top: "-58px",

              borderRadius: "50%",

              background: "rgba(211,229,240,.48)",

            }}

          />



          <div

            className="kf-my-issues-memory-content kf-my-issues-memory-layout"

            style={{

              position: "relative",

              zIndex: 2,

              width: "100%",

              height: "auto",

              display: "block",

            }}

          >

            <div style={{ maxWidth: "710px" }}>

              <div

                className="kf-my-issues-memory-badge"

                style={{

                  display: "inline-flex",

                  alignItems: "center",

                  gap: "8px",

                  padding: "8px 12px",

                  borderRadius: "999px",

                  background: "#fff3e7",

                  border: "1px solid rgba(255,122,0,.14)",

                  color: "#8c725a",

                  fontSize: "10px",

                  fontWeight: 900,

                  letterSpacing: ".18em",

                  textTransform: "uppercase",

                }}

              >

                <span

                  style={{

                    width: "7px",

                    height: "7px",

                    borderRadius: "50%",

                    background: "#ff7a00",

                  }}

                />

                {ui.eyebrow}

              </div>



              <h1

                style={{

                  margin: "16px 0 9px",

                  fontFamily: "var(--font-display)",

                  fontSize: "clamp(34px, 5vw, 52px)",

                  lineHeight: "1",

                  letterSpacing: "-0.05em",

                  fontWeight: 800,

                  color: "#102033",

                }}

              >

                {text.title}

              </h1>



              <p

                style={{

                  margin: 0,

                  maxWidth: "650px",

                  color: "#6c7883",

                  fontSize: "14px",

                  lineHeight: "1.7",

                }}

              >

                {text.description}

              </p>



              <p

                style={{

                  margin: "13px 0 0",

                  color: "#8b938e",

                  fontSize: "11px",

                  fontWeight: 700,

                }}

              >

                {ui.intro}

              </p>

            </div>



            <button

              type="button"

              className="kf-my-issues-primary-action"

              onClick={() => router.push("/report-issue")}

              style={{

                position: "absolute",

                right: "28px",

                bottom: "28px",

                zIndex: 3,

                border: 0,

                borderRadius: "999px",

                background: "#ff7a00",

                color: "#fff",

                padding: "13px 17px",

                fontSize: "11px",

                fontWeight: 900,

                cursor: "pointer",

                boxShadow: "0 12px 24px rgba(255,122,0,.18)",

              }}

            >

              + {text.reportIssue}

            </button>

          </div>

        </section>



        {/* ERROR */}

        {error && (

          <div

            className="kf-my-issues-error"

            role="alert"

            style={{

              marginBottom: "14px",

              padding: "13px 15px",

              borderRadius: "18px",

              background: "#fff0ed",

              border: "1px solid #ecd0c8",

              color: "#9c5f50",

              fontSize: "12px",

              lineHeight: 1.5,

              fontWeight: 700,

            }}

          >

            {error}

          </div>

        )}



        {/* STATS */}

        <section

          className="kf-my-issues-stats"

          style={{

            display: "grid",

            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",

            gap: "10px",

            marginBottom: "24px",

          }}

        >

          <div

            className="kf-my-issues-stat kf-my-issues-stat-1"

            style={{

              padding: "17px",

              borderRadius: "23px",

              background: "rgba(255,255,255,.88)",

              border: "1px solid rgba(16,27,43,.09)",

              boxShadow: "0 10px 26px rgba(16,27,43,.04)",

            }}

          >

            <div

              style={{

                color: "#939a9f",

                fontSize: "9px",

                fontWeight: 900,

                letterSpacing: ".15em",

                textTransform: "uppercase",

              }}

            >

              {ui.total}

            </div>

            <div

              style={{

                marginTop: "4px",

                color: "#243346",

                fontFamily: "var(--font-display)",

                fontSize: "28px",

                lineHeight: 1,

                fontWeight: 800,

              }}

            >

              {totalIssues}

            </div>

          </div>



          <div

            className="kf-my-issues-stat kf-my-issues-stat-2"

            style={{

              padding: "17px",

              borderRadius: "23px",

              background: "#edf5fb",

              border: "1px solid #d9e7f0",

              boxShadow: "0 10px 26px rgba(16,27,43,.035)",

            }}

          >

            <div

              style={{

                color: "#7890a1",

                fontSize: "9px",

                fontWeight: 900,

                letterSpacing: ".15em",

                textTransform: "uppercase",

              }}

            >

              {ui.active}

            </div>

            <div

              style={{

                marginTop: "4px",

                color: "#35536a",

                fontFamily: "var(--font-display)",

                fontSize: "28px",

                lineHeight: 1,

                fontWeight: 800,

              }}

            >

              {activeIssues}

            </div>

          </div>



          <div

            className="kf-my-issues-stat kf-my-issues-stat-3"

            style={{

              padding: "17px",

              borderRadius: "23px",

              background: "#eef6e8",

              border: "1px solid #dce9cf",

              boxShadow: "0 10px 26px rgba(16,27,43,.035)",

            }}

          >

            <div

              style={{

                color: "#80936a",

                fontSize: "9px",

                fontWeight: 900,

                letterSpacing: ".15em",

                textTransform: "uppercase",

              }}

            >

              {ui.resolvedCount}

            </div>

            <div

              style={{

                marginTop: "4px",

                color: "#526c3a",

                fontFamily: "var(--font-display)",

                fontSize: "28px",

                lineHeight: 1,

                fontWeight: 800,

              }}

            >

              {resolvedIssues}

            </div>

          </div>

        </section>



        {/* SECTION HEADER */}

        <section className="kf-my-issues-section-header" style={{ marginBottom: "12px" }}>

          <h2

            style={{

              margin: 0,

              color: "#233347",

              fontFamily: "var(--font-display)",

              fontSize: "30px",

              lineHeight: 1.05,

              fontWeight: 800,

              letterSpacing: "-0.035em",

            }}

          >

            {ui.section}

          </h2>

          <p

            style={{

              margin: "7px 0 0",

              color: "#7b858d",

              fontSize: "12px",

              lineHeight: 1.6,

            }}

          >

            {ui.sectionDescription}

          </p>

        </section>



        {/* CONTENT */}

        {loading ? (

          <div

            className="kf-my-issues-loading-card"

            style={{

              padding: "46px 24px",

              borderRadius: "28px",

              background: "rgba(255,255,255,.88)",

              border: "1px solid rgba(16,27,43,.09)",

              textAlign: "center",

              boxShadow: "0 12px 32px rgba(16,27,43,.045)",

            }}

          >

            <div

              style={{

                width: "52px",

                height: "52px",

                display: "grid",

                placeItems: "center",

                margin: "0 auto 13px",

                borderRadius: "17px",

                background: "#edf5fb",

                fontSize: "23px",

              }}

            >

              🏙️

            </div>

            <div

              style={{

                color: "#6f7b85",

                fontSize: "13px",

                fontWeight: 700,

              }}

            >

              {text.loadingReports}

            </div>

          </div>

        ) : issues.length === 0 ? (

          <div

            className="kf-my-issues-empty-card"

            style={{

              padding: "52px 28px",

              borderRadius: "30px",

              background:

                "radial-gradient(circle at 50% 0%, #e9f2f7 0%, rgba(233,242,247,0) 37%), rgba(255,255,255,.90)",

              border: "1px solid rgba(16,27,43,.09)",

              textAlign: "center",

              boxShadow: "0 14px 36px rgba(16,27,43,.05)",

            }}

          >

            <div

              style={{

                width: "70px",

                height: "70px",

                display: "grid",

                placeItems: "center",

                margin: "0 auto 17px",

                borderRadius: "24px",

                background: "#edf5fb",

                fontSize: "31px",

              }}

            >

              🏙️

            </div>



            <h3

              style={{

                margin: "0 0 8px",

                color: "#2b3a4c",

                fontFamily: "var(--font-display)",

                fontSize: "28px",

                fontWeight: 800,

              }}

            >

              {text.noIssuesTitle}

            </h3>



            <p

              style={{

                maxWidth: "520px",

                margin: "0 auto 22px",

                color: "#77828c",

                fontSize: "12px",

                lineHeight: 1.7,

              }}

            >

              {text.noIssuesDescription}

            </p>



            <button

              type="button"

              className="kf-my-issues-primary-action"

              onClick={() => router.push("/report-issue")}

              style={{

                border: 0,

                borderRadius: "999px",

                background: "#ff7a00",

                color: "#fff",

                padding: "13px 19px",

                fontSize: "11px",

                fontWeight: 900,

                cursor: "pointer",

                boxShadow: "0 12px 24px rgba(255,122,0,.18)",

              }}

            >

              {text.reportIssue}

            </button>

          </div>

        ) : (

          <div

            style={{

              display: "grid",

              gap: "14px",

            }}

          >

            {issues.map((issue) => {

              const tone = statusTone(issue.status);



              return (

                <article

                  key={issue.id}

                  className="kf-my-issues-card"

                  style={{

                    overflow: "hidden",

                    borderRadius: "30px",

                    background: "rgba(255,255,255,.91)",

                    border: "1px solid rgba(16,27,43,.10)",

                    boxShadow: "0 13px 36px rgba(16,27,43,.055)",

                  }}

                >

                  <div

                    style={{

                      display: "grid",

                      gridTemplateColumns: issue.photo_url

                        ? "minmax(220px, 280px) minmax(0, 1fr)"

                        : "1fr",

                    }}

                  >

                    {/* PHOTO */}

                    {issue.photo_url && (

                      <div

                        className="kf-my-issues-photo"

                        style={{

                          minHeight: "270px",

                          background: "#eef0ee",

                          position: "relative",

                        }}

                      >

                        <img

                          src={issue.photo_url}

                          alt={

                            issue.title ||

                            text.civicIssueEvidence

                          }

                          style={{

                            width: "100%",

                            height: "100%",

                            minHeight: "270px",

                            display: "block",

                            objectFit: "cover",

                          }}

                        />



                        <div

                          className="kf-my-issues-evidence-badge"

                          style={{

                            position: "absolute",

                            left: "13px",

                            bottom: "13px",

                            padding: "7px 10px",

                            borderRadius: "999px",

                            background: "rgba(255,253,249,.90)",

                            border: "1px solid rgba(16,27,43,.08)",

                            color: "#5f6d78",

                            fontSize: "9px",

                            fontWeight: 900,

                            backdropFilter: "blur(10px)",

                          }}

                        >

                          {ui.evidence}

                        </div>

                      </div>

                    )}



                    {/* DETAILS */}

                    <div style={{ padding: "23px" }}>

                      <div

                        style={{

                          display: "flex",

                          justifyContent: "space-between",

                          alignItems: "flex-start",

                          gap: "12px",

                          flexWrap: "wrap",

                          marginBottom: "11px",

                        }}

                      >

                        <span

                          className="kf-my-issues-category-pill"

                          style={{

                            padding: "7px 10px",

                            borderRadius: "999px",

                            background: "#fff3e7",

                            border: "1px solid #f0dcc7",

                            color: "#956f4f",

                            fontSize: "9px",

                            fontWeight: 900,

                            letterSpacing: ".04em",

                          }}

                        >

                          {getCategoryLabel(issue.category)}

                        </span>



                        <span

                          className={`kf-my-issues-status-pill kf-my-issues-status-${issue.status}`}

                          style={{

                            display: "inline-flex",

                            alignItems: "center",

                            gap: "6px",

                            padding: "7px 10px",

                            borderRadius: "999px",

                            background: tone.background,

                            border: `1px solid ${tone.border}`,

                            color: tone.color,

                            fontSize: "10px",

                            fontWeight: 900,

                          }}

                        >

                          {getStatusIcon(issue.status)}{" "}

                          {getStatusLabel(issue.status)}

                        </span>

                      </div>



                      <h3

                        style={{

                          margin: "0 0 8px",

                          color: "#263447",

                          fontFamily: "var(--font-display)",

                          fontSize: "25px",

                          lineHeight: 1.08,

                          letterSpacing: "-0.025em",

                          fontWeight: 800,

                        }}

                      >

                        {issue.title || text.untitledIssue}

                      </h3>



                      <p

                        style={{

                          margin: "0 0 15px",

                          color: "#71808b",

                          fontSize: "12px",

                          lineHeight: 1.7,

                        }}

                      >

                        {issue.description || text.noDescription}

                      </p>



                      <div

                        style={{

                          display: "grid",

                          gap: "7px",

                          marginBottom: "14px",

                        }}

                      >

                        {issue.location_text && (

                          <div

                            style={{

                              display: "flex",

                              alignItems: "flex-start",

                              gap: "8px",

                              color: "#5f6e7a",

                              fontSize: "11px",

                              lineHeight: 1.55,

                            }}

                          >

                            <span>📍</span>

                            <span>

                              <strong

                                style={{

                                  color: "#36485a",

                                }}

                              >

                                {ui.locationLabel}

                              </strong>{" "}

                              {issue.location_text}

                            </span>

                          </div>

                        )}



                        {issue.latitude !== null &&

                          issue.longitude !== null && (

                            <div

                              style={{

                                color: "#8a949b",

                                fontSize: "10px",

                              }}

                            >

                              {text.gps}{" "}

                              {issue.latitude.toFixed(5)},{" "}

                              {issue.longitude.toFixed(5)}

                            </div>

                          )}



                        <div

                          style={{

                            color: "#8a949b",

                            fontSize: "10px",

                          }}

                        >

                          {text.reportedAt}{" "}

                          {formatDate(issue.reported_at)}

                        </div>

                      </div>



                      {/* AUTHORITY CARD */}

                      {issue.authority_details ? (

                        <div

                          className="kf-my-issues-authority"

                          style={{

                            marginBottom: "13px",

                            padding: "14px",

                            borderRadius: "20px",

                            background:

                              "linear-gradient(135deg, #f2f7ed 0%, #f7faf4 100%)",

                            border: "1px solid #dce8d0",

                          }}

                        >

                          <div

                            style={{

                              display: "flex",

                              alignItems: "center",

                              justifyContent: "space-between",

                              gap: "10px",

                              flexWrap: "wrap",

                              marginBottom: "8px",

                            }}

                          >

                            <span

                              style={{

                                color: "#71855a",

                                fontSize: "9px",

                                fontWeight: 900,

                                letterSpacing: ".16em",

                                textTransform: "uppercase",

                              }}

                            >

                              {text.directoryRouting}

                            </span>



                            {issue.authority_details.verified_at && (

                              <span

                                style={{

                                  color: "#7c8d68",

                                  fontSize: "9px",

                                  fontWeight: 800,

                                }}

                              >

                                ✓ {ui.verified}{" "}

                                {formatVerifiedDate(

                                  issue.authority_details.verified_at

                                )}

                              </span>

                            )}

                          </div>



                          <div

                            style={{

                              color: "#334455",

                              fontSize: "14px",

                              fontWeight: 900,

                              lineHeight: 1.35,

                            }}

                          >

                            🏛️{" "}

                            {issue.authority_details.authority_name}

                          </div>



                          {issue.authority_details.department_name && (

                            <div

                              style={{

                                marginTop: "6px",

                                color: "#6d7b84",

                                fontSize: "10px",

                                lineHeight: 1.5,

                              }}

                            >

                              {text.department}{" "}

                              {issue.authority_details.department_name}

                            </div>

                          )}



                          <div

                            style={{

                              display: "flex",

                              gap: "8px",

                              flexWrap: "wrap",

                              marginTop: "10px",

                            }}

                          >

                            <span

                              className="kf-my-issues-authority-chip"

                              style={{

                                padding: "6px 8px",

                                borderRadius: "999px",

                                background: "#fffdf9",

                                border: "1px solid #e2e9dc",

                                color: "#71805f",

                                fontSize: "9px",

                                fontWeight: 800,

                              }}

                            >

                              {text.issueType}{" "}

                              {getCategoryLabel(

                                issue.authority_details.issue_category

                              )}

                            </span>



                            {issue.authority_details.submission_method && (

                              <span

                                className="kf-my-issues-authority-chip"

                                style={{

                                  padding: "6px 8px",

                                  borderRadius: "999px",

                                  background: "#fffdf9",

                                  border: "1px solid #e2e9dc",

                                  color: "#71805f",

                                  fontSize: "9px",

                                  fontWeight: 800,

                                }}

                              >

                                {text.channel}{" "}

                                {issue.authority_details.submission_method}

                              </span>

                            )}

                          </div>



                          {issue.authority_details.notes && (

                            <p

                              style={{

                                margin: "10px 0 0",

                                color: "#7a858d",

                                fontSize: "10px",

                                lineHeight: 1.55,

                              }}

                            >

                              {issue.authority_details.notes}

                            </p>

                          )}



                          <div

                            style={{

                              marginTop: "9px",

                              color: "#96a18e",

                              fontSize: "9px",

                            }}

                          >

                            {text.authorityDirectoryId}{" "}

                            {issue.authority_details.id}

                          </div>

                        </div>

                      ) : issue.authority_name ? (

                        <div

                          className="kf-my-issues-route"

                          style={{

                            marginBottom: "13px",

                            padding: "12px 13px",

                            borderRadius: "18px",

                            background: "#edf5fb",

                            border: "1px solid #d7e6ef",

                            color: "#607c90",

                            fontSize: "10px",

                            lineHeight: 1.5,

                          }}

                        >

                          🏛️ {text.authority}{" "}

                          <strong style={{ color: "#3f5a6e" }}>

                            {issue.authority_name}

                          </strong>



                          {issue.authority_reference_id && (

                            <div

                              style={{

                                marginTop: "4px",

                                color: "#82909a",

                                fontSize: "9px",

                              }}

                            >

                              {text.referenceId}{" "}

                              {issue.authority_reference_id}

                            </div>

                          )}

                        </div>

                      ) : (

                        <div

                          className="kf-my-issues-no-route"

                          style={{

                            marginBottom: "13px",

                            padding: "13px",

                            borderRadius: "18px",

                            background: "#f6f5f2",

                            border: "1px solid #e5e1da",

                            color: "#7c858d",

                            fontSize: "10px",

                            lineHeight: 1.55,

                          }}

                        >

                          <strong

                            style={{

                              display: "block",

                              color: "#5b6975",

                              fontSize: "11px",

                              marginBottom: "3px",

                            }}

                          >

                            {ui.noRouteTitle}

                          </strong>

                          {text.noVerifiedRoute}

                        </div>

                      )}



                      {/* FOOTER META */}

                      <div

                        style={{

                          display: "flex",

                          justifyContent: "space-between",

                          alignItems: "center",

                          gap: "12px",

                          flexWrap: "wrap",

                          paddingTop: "11px",

                          borderTop: "1px solid #ece8e1",

                        }}

                      >

                        <div

                          style={{

                            display: "grid",

                            gap: "4px",

                            minWidth: 0,

                          }}

                        >

                          {issue.reported_city && (

                            <div

                              style={{

                                color: "#7c878e",

                                fontSize: "9px",

                                fontWeight: 700,

                              }}

                            >

                              {text.reportedFrom}{" "}

                              {issue.reported_city}

                              {issue.reported_state

                                ? `, ${issue.reported_state}`

                                : ""}

                            </div>

                          )}



                          <div

                            style={{

                              color: "#9aa1a7",

                              fontSize: "8px",

                              wordBreak: "break-all",

                            }}

                          >

                            {ui.id}: {issue.id}

                          </div>

                        </div>



                        <button

                          type="button"

                          onClick={() =>

                            router.push(

                              `/my-issues/${issue.id}`

                            )

                          }

                          style={{

                            border: 0,

                            borderRadius: "999px",

                            background: "#23364a",

                            color: "#fff",

                            padding: "10px 14px",

                            fontSize: "10px",

                            fontWeight: 900,

                            cursor: "pointer",

                          }}

                        >

                          {ui.details}

                        </button>

                      </div>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        )}



        {/* DISCLAIMER */}

        <div

          className="kf-my-issues-disclaimer"

          style={{

            marginTop: "18px",

            padding: "16px 17px",

            borderRadius: "20px",

            background: "rgba(255,253,249,.72)",

            border: "1px solid rgba(16,27,43,.08)",

            color: "#858d93",

            fontSize: "9px",

            lineHeight: 1.65,

          }}

        >

          {text.disclaimer}

        </div>

      </div>



      <style>{`
/* My Civic Issues: responsive layout only. Desktop (1024px+) is unchanged. */
@media (max-width: 1023px) {
  .kf-my-issues-page {
    width: 100% !important;
    min-height: 100svh !important;
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 10px 10px calc(112px + env(safe-area-inset-bottom)) !important;
    overflow-x: clip !important;
  }

  .kf-my-issues-page > div {
    width: 100% !important;
    max-width: 760px !important;
    min-width: 0 !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  /* Page-local top bar. Do not style generic main/header elements globally. */
  .kf-my-issues-page .kf-my-issues-topbar {
    position: relative !important;
    top: auto !important;
    z-index: 2 !important;
    width: 100% !important;
    min-height: 0 !important;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
    gap: 8px !important;
    padding: 9px 10px !important;
    margin: 0 0 12px !important;
    border-radius: 22px !important;
    box-sizing: border-box !important;
  }
  .kf-my-issues-page .kf-my-issues-topbar > div {
    min-width: 0 !important;
    max-width: 100% !important;
  }
  .kf-my-issues-page .kf-my-issues-topbar button {
    min-height: 38px !important;
    max-width: 100% !important;
    padding: 0 10px !important;
    font-size: 12px !important;
    white-space: normal !important;
  }
  .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(2) {
    gap: 7px !important;
  }
  .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(2) > div:first-child {
    width: 36px !important;
    height: 36px !important;
    border-radius: 12px !important;
    font-size: 21px !important;
  }
  .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(2) > div:last-child {
    min-width: 0 !important;
    white-space: normal !important;
  }

  .kf-my-issues-page .kf-my-issues-intro,
  .kf-my-issues-page .kf-my-issues-memory-hero {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    margin: 0 0 12px !important;
    padding: 22px 16px !important;
    border-radius: 22px !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
  }
  .kf-my-issues-page .kf-my-issues-memory-content,
  .kf-my-issues-page .kf-my-issues-memory-layout {
    width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    gap: 8px !important;
  }
  .kf-my-issues-page .kf-my-issues-intro h1,
  .kf-my-issues-page .kf-my-issues-memory-hero h1 {
    max-width: 100% !important;
    margin: 10px 0 8px !important;
    font-size: clamp(26px, 6.5vw, 34px) !important;
    line-height: 1.12 !important;
    overflow-wrap: anywhere !important;
  }
  .kf-my-issues-page .kf-my-issues-intro p,
  .kf-my-issues-page .kf-my-issues-memory-hero p {
    max-width: 100% !important;
    margin-top: 0 !important;
    line-height: 1.55 !important;
    overflow-wrap: anywhere !important;
  }
  .kf-my-issues-page .kf-my-issues-primary-action {
    position: static !important;
    inset: auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    align-self: flex-start !important;
    margin: 14px 0 0 !important;
    max-width: 100% !important;
    min-height: 42px !important;
    padding: 10px 14px !important;
    white-space: normal !important;
    box-sizing: border-box !important;
  }

  .kf-my-issues-page .kf-my-issues-stats {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 10px !important;
    width: 100% !important;
    margin: 0 0 18px !important;
  }
  .kf-my-issues-page .kf-my-issues-stat {
    min-width: 0 !important;
    width: 100% !important;
    padding: 14px !important;
    border-radius: 18px !important;
    box-sizing: border-box !important;
  }
  .kf-my-issues-page h2 {
    max-width: 100% !important;
    font-size: clamp(21px, 5.3vw, 28px) !important;
    line-height: 1.2 !important;
    overflow-wrap: anywhere !important;
  }
  .kf-my-issues-page article,
  .kf-my-issues-page section,
  .kf-my-issues-page article > div,
  .kf-my-issues-page section > * {
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  .kf-my-issues-page article > div[style*="grid-template-columns"] {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 12px !important;
  }
  .kf-my-issues-page img,
  .kf-my-issues-page video {
    max-width: 100% !important;
    height: auto;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .kf-my-issues-page { padding: 16px 20px calc(112px + env(safe-area-inset-bottom)) !important; }
  .kf-my-issues-page .kf-my-issues-topbar { margin-bottom: 16px !important; }
  .kf-my-issues-page .kf-my-issues-intro,
  .kf-my-issues-page .kf-my-issues-memory-hero { padding: 26px !important; }
  .kf-my-issues-page .kf-my-issues-stats { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
  .kf-my-issues-page article > div[style*="grid-template-columns"] { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
}

@media (max-width: 420px) {
  .kf-my-issues-page { padding-left: 8px !important; padding-right: 8px !important; }
  .kf-my-issues-page .kf-my-issues-topbar { grid-template-columns: minmax(0, 1fr) auto !important; }
  .kf-my-issues-page .kf-my-issues-topbar > div:first-child { display: none !important; }
  .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(2) { justify-content: flex-start !important; }
  .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(3) { justify-content: flex-end !important; }
  .kf-my-issues-page .kf-my-issues-intro,
  .kf-my-issues-page .kf-my-issues-memory-hero { padding: 19px 14px !important; }
}

/* Explicit app theme wins over the device OS preference. */
html[data-theme="dark"] .kf-my-issues-page {
  background: radial-gradient(circle at 90% 0%, rgba(20,65,91,.35), transparent 28%), #071321 !important;
  color: #edf4fb !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-topbar {
  background: rgba(8, 24, 40, .96) !important;
  border-color: rgba(120, 165, 205, .20) !important;
  box-shadow: 0 12px 30px rgba(0,0,0,.24) !important;
  backdrop-filter: blur(18px) !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-topbar button {
  background: #10263b !important;
  border-color: rgba(120,165,205,.22) !important;
  color: #d9e6f2 !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-topbar > div:nth-child(2) > div:last-child,
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-topbar h1,
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-topbar h2 {
  color: #f4f7fb !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-intro,
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-memory-hero {
  background: radial-gradient(circle at 94% 0%, rgba(22,69,91,.55), transparent 38%), linear-gradient(145deg,#0b1b2c,#102c40) !important;
  border: 1px solid rgba(120,190,220,.18) !important;
  color: #edf4fb !important;
  box-shadow: 0 18px 46px rgba(0,0,0,.20) !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-intro h1,
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-memory-hero h1,
html[data-theme="dark"] .kf-my-issues-page h2,
html[data-theme="dark"] .kf-my-issues-page h3 {
  color: #f4f7fb !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-intro p,
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-memory-hero p,
html[data-theme="dark"] .kf-my-issues-page small {
  color: #a9bac9 !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-stat {
  background: linear-gradient(135deg, #0c1c2e, #10243a) !important;
  color: #edf4fb !important;
  border-color: rgba(130,175,205,.16) !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-my-issues-page .kf-my-issues-stat * {
  color: inherit;
}
html[data-theme="dark"] .kf-my-issues-page article {
  background-color: #0b1b2c !important;
  border-color: rgba(120,165,205,.18) !important;
  color: #e6eef6 !important;
}
html[data-theme="dark"] .kf-my-issues-page article p,
html[data-theme="dark"] .kf-my-issues-page article span,
html[data-theme="dark"] .kf-my-issues-page article label {
  color: #b8c9d9;
}

/* Restore the intended warm ivory / pale civic-blue palette in light mode. */
html:not([data-theme="dark"]) .kf-my-issues-page {
  color: #102033 !important;
}
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-topbar {
  background: rgba(255,253,249,.94) !important;
  border-color: rgba(16,27,43,.10) !important;
  box-shadow: 0 14px 36px rgba(16,27,43,.07) !important;
}
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-intro,
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-memory-hero {
  color: #102033 !important;
  background: radial-gradient(circle at 94% 0%, rgba(210,232,242,.75), transparent 32%), radial-gradient(circle at 0% 100%, rgba(255,229,205,.55), transparent 38%), #fffdf9 !important;
  border-color: rgba(16,32,51,.08) !important;
}
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-intro h1,
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-memory-hero h1,
html:not([data-theme="dark"]) .kf-my-issues-page h2,
html:not([data-theme="dark"]) .kf-my-issues-page h3 {
  color: #102033 !important;
}
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-intro p,
html:not([data-theme="dark"]) .kf-my-issues-page .kf-my-issues-memory-hero p {
  color: #71808e !important;
}
`}</style>

      
<style>{`
  /* My Issues only: collapse excess dark-mode Civic Memory hero height on mobile/tablet. */
  @media (max-width: 1023px) {
    html[data-theme="dark"] body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-hero,
    body.dark body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-hero {
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      padding-top: 22px !important;
      padding-bottom: 22px !important;
      margin-bottom: 12px !important;
      box-sizing: border-box !important;
    }

    html[data-theme="dark"] body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-content,
    html[data-theme="dark"] body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-layout,
    body.dark body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-content,
    body.dark body.kf-mobile-shell-active .kf-my-issues-page .kf-my-issues-memory-layout {
      height: auto !important;
      min-height: 0 !important;
      justify-content: flex-start !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }
  }
`}</style>

</main>

    </>

  );

}
