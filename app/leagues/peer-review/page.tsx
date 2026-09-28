"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type PeerSubmission = {
  completion_id: string;
  mission_id: string;
  mission_title: string;
  mission_title_i18n?: Record<string, string> | null;
  mission_type: string;
  points: number;
  team_id: string | null;
  team_name: string | null;
  team_name_i18n?: Record<string, string> | null;
  submitted_at: string;
  notes: string | null;
  evidence_photo_path: string | null;
  has_location: boolean;
  confirm_count: number;
  reject_count: number;
};


const peerUi: Record<
  Language,
  {
    language: string;
    loading: string;
    title: string;
    description: string;
    available: string;
    emptyTitle: string;
    emptyText: string;
    missionPoints: string;
    team: string;
    submitted: string;
    evidencePhoto: string;
    photoCouldNotLoad: string;
    noPhoto: string;
    citizenDescription: string;
    noDescription: string;
    locationEvidence: string;
    locationCaptured: string;
    noLocation: string;
    communitySignals: string;
    confirmations: string;
    rejections: string;
    reviewNote: string;
    processing: string;
    confirm: string;
    reject: string;
    pointLabel: string;
    home: string;
    dashboard: string;
    civicLeagues: string;
  }
> = {
  en: {
    language: "Language",
    loading: "Loading community verification...",
    title: "Community Verification",
    description:
      "Help strengthen trust in civic participation by reviewing evidence from other members of your league. Your confirmation is a trust signal, not an automatic award of Karma Credits.",
    available: "Available for review",
    emptyTitle: "No community reviews available",
    emptyText:
      "New eligible mission submissions from other league members will appear here.",
    missionPoints: "MISSION POINTS",
    team: "Team",
    submitted: "Submitted",
    evidencePhoto: "Evidence photo",
    photoCouldNotLoad: "Evidence photo could not be loaded for preview.",
    noPhoto: "No photo evidence supplied.",
    citizenDescription: "Citizen's description",
    noDescription: "No description provided.",
    locationEvidence: "Location evidence",
    locationCaptured: "✓ Location evidence captured",
    noLocation: "No location evidence",
    communitySignals: "Community signals",
    confirmations: "Confirmations",
    rejections: "Rejections",
    reviewNote:
      "Review the evidence fairly. Community verification contributes to trust signals; final Karma Credit decisions remain under the KarmaFacie verification process.",
    processing: "Processing...",
    confirm: "Confirm evidence",
    reject: "Reject evidence",
    pointLabel: "POINTS",
    home: "Home",
    dashboard: "Dashboard",
    civicLeagues: "Civic Leagues",
  },
  hi: {
    language: "भाषा",
    loading: "सामुदायिक सत्यापन लोड हो रहा है...",
    title: "सामुदायिक सत्यापन",
    description:
      "अपने लीग के अन्य सदस्यों के प्रमाण की समीक्षा करके नागरिक भागीदारी में विश्वास मजबूत करने में मदद करें। आपका पुष्टिकरण एक भरोसे का संकेत है, अपने आप Karma Credits देने का आधार नहीं।",
    available: "समीक्षा के लिए उपलब्ध",
    emptyTitle: "कोई सामुदायिक समीक्षा उपलब्ध नहीं है",
    emptyText:
      "अन्य लीग सदस्यों के नए पात्र मिशन सबमिशन यहाँ दिखाई देंगे।",
    missionPoints: "मिशन अंक",
    team: "टीम",
    submitted: "जमा किया गया",
    evidencePhoto: "प्रमाण फोटो",
    photoCouldNotLoad: "प्रमाण फोटो का पूर्वावलोकन लोड नहीं हो सका।",
    noPhoto: "कोई फोटो प्रमाण नहीं दिया गया।",
    citizenDescription: "नागरिक का विवरण",
    noDescription: "कोई विवरण नहीं दिया गया।",
    locationEvidence: "स्थान प्रमाण",
    locationCaptured: "✓ स्थान का प्रमाण दर्ज है",
    noLocation: "कोई स्थान प्रमाण नहीं है",
    communitySignals: "सामुदायिक संकेत",
    confirmations: "पुष्टिकरण",
    rejections: "अस्वीकृतियाँ",
    reviewNote:
      "प्रमाण की निष्पक्ष समीक्षा करें। सामुदायिक सत्यापन भरोसे के संकेतों में योगदान देता है; अंतिम Karma Credit निर्णय KarmaFacie की सत्यापन प्रक्रिया के अंतर्गत रहते हैं।",
    processing: "प्रक्रिया जारी है...",
    confirm: "प्रमाण की पुष्टि करें",
    reject: "प्रमाण अस्वीकार करें",
    pointLabel: "अंक",
    home: "होम",
    dashboard: "डैशबोर्ड",
    civicLeagues: "सिविक लीग्स",
  },
  mr: {
    language: "भाषा",
    loading: "समुदाय पडताळणी लोड होत आहे...",
    title: "समुदाय पडताळणी",
    description:
      "तुमच्या लीगमधील इतर सदस्यांच्या पुराव्यांचे परीक्षण करून नागरी सहभागावरील विश्वास वाढवण्यास मदत करा. तुमचे पुष्टीकरण हे विश्वासाचे संकेत आहे; त्यावर आपोआप Karma Credits दिले जात नाहीत.",
    available: "पुनरावलोकनासाठी उपलब्ध",
    emptyTitle: "समुदाय पुनरावलोकने उपलब्ध नाहीत",
    emptyText:
      "इतर लीग सदस्यांचे नवीन पात्र मिशन सबमिशन येथे दिसतील.",
    missionPoints: "मिशन गुण",
    team: "टीम",
    submitted: "सादर केले",
    evidencePhoto: "पुरावा छायाचित्र",
    photoCouldNotLoad: "पुरावा छायाचित्राचे पूर्वदृश्य लोड करता आले नाही.",
    noPhoto: "कोणताही छायाचित्र पुरावा दिलेला नाही.",
    citizenDescription: "नागरिकाचे वर्णन",
    noDescription: "कोणतेही वर्णन दिलेले नाही.",
    locationEvidence: "ठिकाणाचा पुरावा",
    locationCaptured: "✓ ठिकाणाचा पुरावा नोंदवला आहे",
    noLocation: "ठिकाणाचा पुरावा नाही",
    communitySignals: "समुदाय संकेत",
    confirmations: "पुष्टीकरणे",
    rejections: "नकार",
    reviewNote:
      "पुराव्याचे निष्पक्ष परीक्षण करा. समुदाय पडताळणी विश्वासाच्या संकेतांना मदत करते; अंतिम Karma Credit निर्णय KarmaFacie पडताळणी प्रक्रियेत घेतले जातात.",
    processing: "प्रक्रिया सुरू आहे...",
    confirm: "पुराव्याची पुष्टी करा",
    reject: "पुरावा नाकारा",
    pointLabel: "गुण",
    home: "होम",
    dashboard: "डॅशबोर्ड",
    civicLeagues: "सिविक लीग्स",
  },
};

function localizedValue(
  value: Record<string, string> | null | undefined,
  fallback: string,
  language: Language
) {
  return value?.[language] || value?.en || fallback;
}

function localizeMissionType(
  value: string,
  language: Language
) {
  const key = value.toLowerCase();
  const map: Record<string, Record<Language, string>> = {
    green_action: {
      en: "Green Action",
      hi: "हरित कार्रवाई",
      mr: "हरित कृती",
    },
    clean_space: {
      en: "Clean Space Mission",
      hi: "स्वच्छ स्थान मिशन",
      mr: "स्वच्छ जागा मिशन",
    },
    civic_revisit: {
      en: "Civic Revisit",
      hi: "नागरिक पुनः निरीक्षण",
      mr: "नागरी पुनर्भेट",
    },
    community_awareness: {
      en: "Community Awareness",
      hi: "सामुदायिक जागरूकता",
      mr: "समुदाय जनजागृती",
    },
    public_space_observation: {
      en: "Public Space Observation",
      hi: "सार्वजनिक स्थान निरीक्षण",
      mr: "सार्वजनिक जागा निरीक्षण",
    },
  };

  return map[key]?.[language] ?? value.replaceAll("_", " ");
}

function localizeTeamName(
  teamName: string | null,
  language: Language
) {
  if (!teamName) return "";
  const map: Record<string, Record<Language, string>> = {
    "College Pilot Team": {
      en: "College Pilot Team",
      hi: "कॉलेज पायलट टीम",
      mr: "महाविद्यालय पायलट टीम",
    },
    "KarmaFacie Pilot Team": {
      en: "KarmaFacie Pilot Team",
      hi: "KarmaFacie पायलट टीम",
      mr: "KarmaFacie पायलट टीम",
    },
    "Ward Pilot Team": {
      en: "Ward Pilot Team",
      hi: "वार्ड पायलट टीम",
      mr: "प्रभाग पायलट टीम",
    },
  };

  return map[teamName]?.[language] ?? teamName;
}


const PILOT_LEAGUE_ID =
  "0a22e94a-26ab-419a-bd40-6db3a7f996ff";

export default function PeerReviewPage() {
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const t = peerUi[language];

  const [submissions, setSubmissions] = useState<
    PeerSubmission[]
  >([]);

  const [photoUrls, setPhotoUrls] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadQueue() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Please sign in to participate in peer verification."
        );
      }

      const { data, error: queueError } =
        await supabase.rpc(
          "get_civic_peer_verification_queue",
          {
            p_league_id: PILOT_LEAGUE_ID,
          }
        );

      if (queueError) {
        throw queueError;
      }

      let rows = (data ?? []) as PeerSubmission[];

      const missionIds = Array.from(
        new Set(rows.map((row) => row.mission_id))
      );
      const teamIds = Array.from(
        new Set(
          rows
            .map((row) => row.team_id)
            .filter(
              (id): id is string => Boolean(id)
            )
        )
      );

      const [missionResult, teamResult] =
        await Promise.all([
          missionIds.length
            ? supabase
                .from("civic_missions")
                .select("id,title,title_i18n")
                .in("id", missionIds)
            : Promise.resolve({ data: [], error: null }),
          teamIds.length
            ? supabase
                .from("civic_league_teams")
                .select("id,team_name,team_name_i18n")
                .in("id", teamIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

      if (missionResult.error) {
        throw missionResult.error;
      }

      if (teamResult.error) {
        throw teamResult.error;
      }

      const missionMap = new Map(
        (missionResult.data ?? []).map((mission) => [
          mission.id,
          mission,
        ])
      );
      const teamMap = new Map(
        (teamResult.data ?? []).map((team) => [
          team.id,
          team,
        ])
      );

      rows = rows.map((row) => {
        const mission = missionMap.get(row.mission_id);
        const team = row.team_id
          ? teamMap.get(row.team_id)
          : null;

        return {
          ...row,
          mission_title_i18n:
            (mission?.title_i18n as Record<string, string> | null) ??
            null,
          team_name_i18n:
            (team?.team_name_i18n as Record<string, string> | null) ??
            null,
          mission_title:
            mission?.title ?? row.mission_title,
          team_name:
            team?.team_name ?? row.team_name,
        };
      });

      setSubmissions(rows);

      if (rows.length === 0) {
        setPhotoUrls({});
        return;
      }

      const photoResults = await Promise.all(
        rows.map(async (submission) => {
          if (!submission.evidence_photo_path) {
            return null;
          }

          const {
            data: signedData,
            error: signedError,
          } = await supabase.storage
            .from("civic-mission-evidence")
            .createSignedUrl(
              submission.evidence_photo_path,
              60 * 15
            );

          if (signedError || !signedData?.signedUrl) {
            console.error(
              "Peer evidence preview error:",
              submission.completion_id,
              signedError
            );

            return null;
          }

          return {
            completionId: submission.completion_id,
            signedUrl: signedData.signedUrl,
          };
        })
      );

      const urlMap: Record<string, string> = {};

      for (const result of photoResults) {
        if (result) {
          urlMap[result.completionId] =
            result.signedUrl;
        }
      }

      setPhotoUrls(urlMap);
    } catch (err) {
      console.error(
        "Peer review queue error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null
          ? JSON.stringify(err)
          : String(err);

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function submitPeerVerification(
    completionId: string,
    decision: "confirm" | "reject"
  ) {
    try {
      setReviewingId(completionId);
      setError("");
      setSuccess("");

      const note =
        decision === "confirm"
          ? "Community member confirmed this civic mission evidence."
          : "Community member rejected this civic mission evidence.";

      const {
        error: rpcError,
      } = await supabase.rpc(
        "submit_civic_mission_peer_verification",
        {
          p_completion_id: completionId,
          p_decision: decision,
          p_note: note,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(
        decision === "confirm"
          ? "Your community confirmation was recorded."
          : "Your community rejection was recorded."
      );

      await loadQueue();
    } catch (err) {
      console.error(
        "Peer verification error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null
          ? JSON.stringify(err)
          : String(err);

      setError(message);
    } finally {
      setReviewingId(null);
    }
  }

  useEffect(() => {
    loadQueue();
  }, []);


  if (loading) {
    return (
      <main className="kf-peer-page kf-loading-page">
        <div className="kf-loading-card">
          <div className="kf-wordmark">
            Karma<span>Facie</span>
          </div>

          <div className="kf-loading-bar" />

          <p>{t.loading}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="kf-peer-page">
      <div className="kf-peer-shell">

        {/* TOP BAR */}
        <header className="kf-peer-topbar">
          <div className="kf-brand-lockup">
            <div className="kf-brand-box">K</div>

            <div>
              <div className="kf-brand-name">
                Karma<span>Facie</span>
              </div>

              <div className="kf-brand-caption">
                CIVIC PARTICIPATION
              </div>
            </div>
          </div>

          <label className="kf-language">
            <span>{t.language}</span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as Language
                )
              }
              aria-label={t.language}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        {/* HERO */}
        <section className="kf-peer-hero">
          <div className="kf-hero-orb kf-blue-orb" />
          <div className="kf-hero-orb kf-peach-orb" />

          <div className="kf-hero-content">
            <div className="kf-eyebrow">
              {t.civicLeagues}
            </div>

            <div className="kf-hero-grid">
              <div>
                <h1>{t.title}</h1>

                <p>{t.description}</p>
              </div>

              <div className="kf-hero-icon">
                🔎
              </div>
            </div>

            <div className="kf-peer-nav">
              <Link
                href="/"
                className="kf-secondary-button"
              >
                ← {t.home}
              </Link>

              <Link
                href="/dashboard"
                className="kf-secondary-button"
              >
                {t.dashboard}
              </Link>

              <Link
                href="/leagues"
                className="kf-secondary-button"
              >
                {t.civicLeagues}
              </Link>
            </div>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="kf-alert kf-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="kf-alert kf-alert-success">
            {success}
          </div>
        )}

        {/* SUMMARY */}
        <section className="kf-summary-card">
          <div>
            <div className="kf-card-kicker">
              {t.available}
            </div>

            <h2>
              {submissions.length}
            </h2>

            <p>
              {language === "en"
                ? "eligible mission submissions waiting for a community signal"
                : language === "hi"
                  ? "सामुदायिक संकेत की प्रतीक्षा कर रहे पात्र मिशन सबमिशन"
                  : "समुदायाच्या संकेताची प्रतीक्षा करणारी पात्र मिशन सबमिशन्स"}
            </p>
          </div>

          <div className="kf-summary-badge">
            🤝
          </div>
        </section>

        {/* EMPTY */}
        {submissions.length === 0 && (
          <section className="kf-empty-card">
            <div className="kf-empty-icon">✓</div>

            <div className="kf-card-kicker">
              {t.available}
            </div>

            <h2>{t.emptyTitle}</h2>

            <p>{t.emptyText}</p>
          </section>
        )}

        {/* QUEUE */}
        {submissions.length > 0 && (
          <section className="kf-queue-section">
            <div className="kf-section-heading">
              <div>
                <div className="kf-section-kicker">
                  COMMUNITY REVIEW
                </div>

                <h2>{t.available}</h2>

                <p>
                  {language === "en"
                    ? "Review each submission using the evidence, notes, location signal and existing community counts."
                    : language === "hi"
                      ? "प्रमाण, विवरण, स्थान संकेत और मौजूदा सामुदायिक गणना देखकर प्रत्येक सबमिशन की समीक्षा करें।"
                      : "पुरावा, नोंद, स्थान संकेत आणि उपलब्ध समुदाय गणना पाहून प्रत्येक सबमिशनचे परीक्षण करा."}
                </p>
              </div>
            </div>

            <div className="kf-queue">
              {submissions.map((submission) => {
                const photoUrl =
                  photoUrls[
                    submission.completion_id
                  ];

                const isReviewing =
                  reviewingId ===
                  submission.completion_id;

                return (
                  <article
                    key={submission.completion_id}
                    className="kf-review-card"
                  >
                    <div className="kf-review-main">

                      {/* SUBMISSION HEADER */}
                      <div className="kf-review-header">
                        <div>
                          <div className="kf-review-type">
                            {localizeMissionType(
                              submission.mission_type,
                              language
                            )}
                          </div>

                          <h3>
                            {localizedValue(
                              submission.mission_title_i18n,
                              submission.mission_title,
                              language
                            )}
                          </h3>

                          {submission.team_name && (
                            <div className="kf-review-team">
                              {t.team}:{" "}
                              {localizedValue(
                                submission.team_name_i18n,
                                localizeTeamName(
                                  submission.team_name,
                                  language
                                ),
                                language
                              )}
                            </div>
                          )}

                          <div className="kf-review-time">
                            {t.submitted}{" "}
                            {new Date(
                              submission.submitted_at
                            ).toLocaleString(
                              language === "hi"
                                ? "hi-IN"
                                : language === "mr"
                                  ? "mr-IN"
                                  : "en-IN"
                            )}
                          </div>
                        </div>

                        <div className="kf-points-badge">
                          <strong>
                            +{submission.points}
                          </strong>
                          <span>
                            {t.pointLabel}
                          </span>
                        </div>
                      </div>

                      {/* EVIDENCE */}
                      <div className="kf-evidence-grid">

                        <div className="kf-evidence-panel kf-photo-panel">
                          <div className="kf-panel-kicker">
                            {t.evidencePhoto}
                          </div>

                          {photoUrl ? (
                            <div className="kf-photo-frame">
                              <img
                                src={photoUrl}
                                alt={t.evidencePhoto}
                              />
                            </div>
                          ) : submission.evidence_photo_path ? (
                            <div className="kf-photo-empty kf-photo-warning">
                              {t.photoCouldNotLoad}
                            </div>
                          ) : (
                            <div className="kf-photo-empty">
                              {t.noPhoto}
                            </div>
                          )}
                        </div>

                        <div className="kf-evidence-panel kf-details-panel">
                          <div className="kf-panel-kicker">
                            {t.citizenDescription}
                          </div>

                          <p className="kf-description">
                            {submission.notes ||
                              t.noDescription}
                          </p>

                          <div className="kf-location-box">
                            <div className="kf-panel-kicker">
                              {t.locationEvidence}
                            </div>

                            <div
                              className={
                                submission.has_location
                                  ? "kf-location-positive"
                                  : "kf-location-negative"
                              }
                            >
                              {submission.has_location
                                ? t.locationCaptured
                                : t.noLocation}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SIGNALS */}
                      <div className="kf-signals-panel">
                        <div className="kf-panel-kicker">
                          {t.communitySignals}
                        </div>

                        <div className="kf-signal-grid">
                          <div className="kf-signal confirm">
                            <span>✓</span>
                            <div>
                              <strong>
                                {submission.confirm_count}
                              </strong>
                              <small>
                                {t.confirmations}
                              </small>
                            </div>
                          </div>

                          <div className="kf-signal reject">
                            <span>×</span>
                            <div>
                              <strong>
                                {submission.reject_count}
                              </strong>
                              <small>
                                {t.rejections}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* REVIEW GUIDANCE */}
                      <div className="kf-review-guidance">
                        <span>ⓘ</span>
                        <p>{t.reviewNote}</p>
                      </div>

                      {/* ACTIONS */}
                      <div className="kf-review-actions">
                        <button
                          type="button"
                          onClick={() =>
                            submitPeerVerification(
                              submission.completion_id,
                              "confirm"
                            )
                          }
                          disabled={isReviewing}
                          className="kf-confirm-button"
                        >
                          {isReviewing
                            ? t.processing
                            : `✓ ${t.confirm}`}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            submitPeerVerification(
                              submission.completion_id,
                              "reject"
                            )
                          }
                          disabled={isReviewing}
                          className="kf-reject-button"
                        >
                          {isReviewing
                            ? t.processing
                            : `× ${t.reject}`}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <footer className="kf-peer-footer">
          Karma<span>Facie</span> ·{" "}
          {t.title}
        </footer>
      </div>

      <style>{`
        .kf-peer-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #556674;
          --kf-muted: #7b8790;
          --kf-orange: #ff7a00;
          --kf-blue: #eaf3f8;
          --kf-blue-line: #d3e4ed;
          --kf-green: #eef6e7;
          --kf-green-line: #d4e5c8;
          --kf-peach: #fff0df;
          --kf-peach-line: #eed9c0;
          --kf-lavender: #f4eff9;
          --kf-lavender-line: #dfd4ea;
          --kf-line: #ded8cf;

          min-height: 100vh;
          padding: 20px 16px 74px;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
            radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
            radial-gradient(circle at 90% 94%, rgba(255,229,205,.76) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          color: var(--kf-body);
          font-family: var(--font-body);
        }

        .kf-peer-page *,
        .kf-peer-page *::before,
        .kf-peer-page *::after {
          box-sizing: border-box;
        }

        .kf-peer-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .kf-peer-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid var(--kf-line);
          border-radius: 25px;
          background: rgba(255,253,249,.95);
          box-shadow: 0 14px 36px rgba(16,27,43,.055);
          backdrop-filter: blur(16px);
        }

        .kf-brand-lockup {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-brand-box {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(255,122,0,.17);
        }

        .kf-brand-name,
        .kf-wordmark {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-weight: 800;
          letter-spacing: -.045em;
        }

        .kf-brand-name {
          font-size: 23px;
          line-height: 1;
        }

        .kf-brand-name span,
        .kf-wordmark span,
        .kf-peer-footer span {
          color: var(--kf-orange);
        }

        .kf-brand-caption {
          margin-top: 3px;
          color: #8b938f;
          font-size: 8px;
          line-height: 1;
          letter-spacing: .16em;
          font-weight: 900;
        }

        .kf-language {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #52616f;
          font-size: 11px;
          font-weight: 900;
        }

        .kf-language select {
          min-width: 120px;
          padding: 10px 13px;
          border: 1px solid #d7d1c9;
          border-radius: 999px;
          background: #fffdf9;
          color: #304154;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .kf-language select:focus {
          border-color: #e4ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-peer-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
          padding: 30px;
          border: 1px solid var(--kf-line);
          border-radius: 33px;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97);
          box-shadow: 0 18px 48px rgba(16,27,43,.06);
        }

        .kf-hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-blue-orb {
          width: 190px;
          height: 190px;
          right: -72px;
          top: -82px;
          background: rgba(207,227,239,.56);
        }

        .kf-peach-orb {
          width: 165px;
          height: 105px;
          left: -48px;
          bottom: -52px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.44);
          transform: rotate(7deg);
        }

        .kf-hero-content {
          position: relative;
          z-index: 1;
        }

        .kf-eyebrow,
        .kf-card-kicker,
        .kf-section-kicker,
        .kf-panel-kicker {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .kf-eyebrow {
          color: #95765d;
        }

        .kf-hero-grid {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 26px;
          margin-top: 8px;
        }

        .kf-hero-grid h1 {
          margin: 0;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(44px, 6vw, 64px);
          line-height: .96;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-hero-grid p {
          max-width: 800px;
          margin: 12px 0 0;
          color: #596b79;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-hero-icon {
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 25px;
          background: var(--kf-lavender);
          border: 1px solid var(--kf-lavender-line);
          font-size: 33px;
          box-shadow: 0 10px 24px rgba(65,45,90,.05);
        }

        .kf-peer-nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .kf-secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          background: #fffdf9;
          border: 1px solid #dad4cc;
          color: #506171;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .kf-alert {
          margin-bottom: 12px;
          padding: 13px 15px;
          border-radius: 18px;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 800;
        }

        .kf-alert-error {
          background: #fff0ed;
          border: 1px solid #ecd0c8;
          color: #955b4d;
        }

        .kf-alert-success {
          background: #eef6e7;
          border: 1px solid #d4e5c8;
          color: #5e7a44;
        }

        .kf-summary-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
          padding: 22px 24px;
          border-radius: 27px;
          border: 1px solid var(--kf-blue-line);
          background:
            linear-gradient(135deg, #edf5fa 0%, #f8fbfc 100%);
          box-shadow: 0 12px 30px rgba(16,27,43,.045);
        }

        .kf-summary-card h2 {
          margin: 4px 0 2px;
          color: #2c4356;
          font-family: var(--font-display);
          font-size: 42px;
          line-height: .95;
          font-weight: 800;
        }

        .kf-summary-card p {
          margin: 0;
          color: #657680;
          font-size: 11px;
          line-height: 1.5;
        }

        .kf-summary-badge {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: #fffdf9;
          border: 1px solid #d7e4eb;
          font-size: 23px;
        }

        .kf-empty-card {
          padding: 48px 28px;
          margin-bottom: 18px;
          border-radius: 30px;
          border: 1px solid #d9e5da;
          background:
            radial-gradient(circle at 50% 0%, #eaf3e3 0%, rgba(234,243,227,0) 38%),
            #fffdf9;
          box-shadow: 0 14px 36px rgba(16,27,43,.05);
          text-align: center;
        }

        .kf-empty-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          border-radius: 22px;
          background: #e8f2df;
          border: 1px solid #d3e5c6;
          color: #67834b;
          font-size: 25px;
          font-weight: 900;
        }

        .kf-empty-card h2 {
          margin: 6px 0 7px;
          color: #304457;
          font-family: var(--font-display);
          font-size: 31px;
          line-height: 1.02;
          font-weight: 800;
        }

        .kf-empty-card p {
          max-width: 620px;
          margin: 0 auto;
          color: #667680;
          font-size: 13px;
          line-height: 1.7;
        }

        .kf-queue-section {
          padding: 27px;
          border-radius: 30px;
          border: 1px solid #ddd8d0;
          background: rgba(255,253,249,.94);
          box-shadow: 0 14px 38px rgba(16,27,43,.05);
        }

        .kf-section-heading {
          margin-bottom: 18px;
        }

        .kf-section-kicker {
          color: #7a6d8d;
        }

        .kf-section-heading h2 {
          margin: 5px 0 5px;
          color: #263a4e;
          font-family: var(--font-display);
          font-size: 31px;
          line-height: 1.04;
          letter-spacing: -.03em;
          font-weight: 800;
        }

        .kf-section-heading p {
          max-width: 830px;
          margin: 0;
          color: #667680;
          font-size: 12px;
          line-height: 1.65;
        }

        .kf-queue {
          display: grid;
          gap: 14px;
        }

        .kf-review-card {
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid #dfe0db;
          background: #fffdf9;
          box-shadow: 0 11px 30px rgba(16,27,43,.045);
        }

        .kf-review-main {
          padding: 23px;
        }

        .kf-review-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .kf-review-type {
          color: #7a8790;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .kf-review-header h3 {
          margin: 7px 0 0;
          color: #2d4154;
          font-family: var(--font-display);
          font-size: 27px;
          line-height: 1.03;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .kf-review-team {
          margin-top: 7px;
          color: #677781;
          font-size: 11px;
          font-weight: 700;
        }

        .kf-review-time {
          margin-top: 5px;
          color: #8a949b;
          font-size: 9px;
          font-weight: 800;
        }

        .kf-points-badge {
          min-width: 87px;
          padding: 12px 10px;
          border-radius: 20px;
          background: var(--kf-peach);
          border: 1px solid var(--kf-peach-line);
          text-align: center;
        }

        .kf-points-badge strong {
          display: block;
          color: #946943;
          font-family: var(--font-display);
          font-size: 25px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-points-badge span {
          display: block;
          margin-top: 4px;
          color: #9a826c;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .kf-evidence-grid {
          display: grid;
          grid-template-columns: minmax(0,1.15fr) minmax(0,.85fr);
          gap: 12px;
          margin-top: 18px;
        }

        .kf-evidence-panel {
          min-width: 0;
          padding: 17px;
          border-radius: 23px;
          border: 1px solid #e1ddd6;
        }

        .kf-photo-panel {
          background: #edf5fa;
          border-color: var(--kf-blue-line);
        }

        .kf-details-panel {
          background: #fff6eb;
          border-color: var(--kf-peach-line);
        }

        .kf-panel-kicker {
          color: #77858e;
        }

        .kf-photo-frame {
          overflow: hidden;
          margin-top: 10px;
          min-height: 290px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          border: 1px solid #d9e5ec;
          background: #e3ebef;
        }

        .kf-photo-frame img {
          display: block;
          width: 100%;
          max-height: 520px;
          object-fit: contain;
        }

        .kf-photo-empty {
          display: grid;
          place-items: center;
          min-height: 110px;
          margin-top: 10px;
          padding: 15px;
          border-radius: 18px;
          border: 1px dashed #cbd7dd;
          background: rgba(255,253,249,.70);
          color: #74828b;
          font-size: 11px;
          line-height: 1.55;
          text-align: center;
        }

        .kf-photo-warning {
          background: #fff7e7;
          border-color: #eedfc2;
          color: #8b704e;
        }

        .kf-description {
          min-height: 145px;
          margin: 10px 0 0;
          padding: 13px;
          border-radius: 18px;
          background: rgba(255,253,249,.76);
          border: 1px solid #eadfd2;
          color: #596b78;
          font-size: 12px;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .kf-location-box {
          margin-top: 12px;
          padding: 13px;
          border-radius: 18px;
          background: #fffdf9;
          border: 1px solid #e6ddd4;
        }

        .kf-location-positive,
        .kf-location-negative {
          margin-top: 7px;
          font-size: 11px;
          font-weight: 900;
        }

        .kf-location-positive {
          color: #638048;
        }

        .kf-location-negative {
          color: #8a7461;
        }

        .kf-signals-panel {
          margin-top: 12px;
          padding: 16px;
          border-radius: 22px;
          background: var(--kf-lavender);
          border: 1px solid var(--kf-lavender-line);
        }

        .kf-signal-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .kf-signal {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255,253,249,.80);
          border: 1px solid rgba(16,27,43,.07);
        }

        .kf-signal > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          font-size: 16px;
          font-weight: 900;
        }

        .kf-signal.confirm > span {
          background: #e7f2dc;
          color: #658046;
        }

        .kf-signal.reject > span {
          background: #ffecea;
          color: #a16051;
        }

        .kf-signal strong {
          display: block;
          color: #304457;
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-signal small {
          display: block;
          margin-top: 3px;
          color: #7b8790;
          font-size: 9px;
          font-weight: 800;
        }

        .kf-review-guidance {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 12px;
          padding: 12px 13px;
          border-radius: 17px;
          background: #f3f4f2;
          border: 1px solid #e2e5e2;
        }

        .kf-review-guidance > span {
          color: #6e8a58;
          font-size: 15px;
          line-height: 1;
        }

        .kf-review-guidance p {
          margin: 0;
          color: #697780;
          font-size: 10px;
          line-height: 1.65;
          font-weight: 700;
        }

        .kf-review-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .kf-confirm-button,
        .kf-reject-button {
          min-height: 43px;
          padding: 11px 15px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .kf-confirm-button {
          border: 1px solid var(--kf-orange);
          background: var(--kf-orange);
          color: #fff;
          box-shadow: 0 10px 22px rgba(255,122,0,.15);
        }

        .kf-reject-button {
          border: 1px solid #dfd7d2;
          background: #fffdf9;
          color: #6d5f59;
        }

        .kf-confirm-button:disabled,
        .kf-reject-button:disabled {
          cursor: not-allowed;
          opacity: .55;
          box-shadow: none;
        }

        .kf-peer-footer {
          padding: 17px 4px 0;
          color: #8a9398;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .kf-loading-page {
          display: grid;
          place-items: center;
        }

        .kf-loading-card {
          width: min(480px, 100%);
          padding: 36px 30px;
          border-radius: 31px;
          border: 1px solid #ded8cf;
          background: rgba(255,253,249,.96);
          box-shadow: 0 20px 56px rgba(16,27,43,.08);
          text-align: center;
        }

        .kf-wordmark {
          font-size: 37px;
          line-height: 1;
        }

        .kf-loading-bar {
          width: 68px;
          height: 5px;
          margin: 15px auto;
          border-radius: 999px;
          background: var(--kf-orange);
        }

        .kf-loading-card p {
          margin: 0;
          color: #687985;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 820px) {
          .kf-evidence-grid {
            grid-template-columns: 1fr;
          }

          .kf-hero-grid {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-hero-icon {
            width: 62px;
            height: 62px;
          }
        }

        @media (max-width: 680px) {
          .kf-peer-page {
            padding: 14px 11px 56px;
          }

          .kf-brand-caption {
            display: none;
          }

          .kf-language span {
            display: none;
          }

          .kf-language select {
            min-width: 108px;
          }

          .kf-peer-hero {
            padding: 24px 20px;
            border-radius: 28px;
          }

          .kf-hero-grid h1 {
            font-size: 45px;
          }

          .kf-peer-nav {
            gap: 7px;
          }

          .kf-summary-card,
          .kf-queue-section,
          .kf-review-main {
            padding: 20px;
          }

          .kf-summary-card {
            align-items: flex-start;
          }

          .kf-summary-card h2 {
            font-size: 36px;
          }

          .kf-review-header {
            flex-direction: column;
          }

          .kf-points-badge {
            align-self: flex-start;
          }

          .kf-signal-grid {
            grid-template-columns: 1fr;
          }

          .kf-review-actions {
            flex-direction: column;
          }

          .kf-confirm-button,
          .kf-reject-button {
            width: 100%;
          }
        }
      


/* =========================================================
   KARMAFACIE — COMMUNITY VERIFICATION DARK MODE
   ========================================================= */

html[data-theme="dark"] .kf-peer-page {
  --kf-ivory:#07111f;
  --kf-white:#f5f7fb;
  --kf-navy:#0d1d31;
  --kf-ink:#f5f7fb;
  --kf-body:#b8c4d9;
  --kf-muted:#8291aa;
  --kf-orange:#ff7a00;
  --kf-blue:#10263a;
  --kf-blue-line:#294863;
  --kf-green:#182c25;
  --kf-green-line:#315443;
  --kf-peach:#30251b;
  --kf-peach-line:#5d432a;
  --kf-lavender:#27233a;
  --kf-lavender-line:#49415f;
  --kf-line:#1f2e47;

  color:var(--kf-body);
  background:
    radial-gradient(circle at 92% 3%,rgba(0,212,255,.07),transparent 25%),
    radial-gradient(circle at 6% 88%,rgba(255,122,0,.07),transparent 25%),
    #07111f;
}

html[data-theme="dark"] .kf-peer-page .kf-peer-topbar {
  position:relative;
  border:1px solid transparent;
  background:rgba(4,10,20,.68);
  box-shadow:
    -10px 0 24px -8px rgba(0,212,255,.28),
    10px 0 24px -8px rgba(255,140,26,.28),
    0 10px 30px rgba(0,0,0,.34);
  backdrop-filter:blur(14px) saturate(125%);
}
html[data-theme="dark"] .kf-peer-page .kf-peer-topbar::before {
  content:""; position:absolute; inset:0; z-index:-1; border-radius:inherit; padding:1px;
  background:linear-gradient(90deg,#00d4ff 0%,rgba(0,212,255,.35) 24%,rgba(31,46,71,.45) 50%,rgba(255,140,26,.35) 76%,#ff8c1a 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
html[data-theme="dark"] .kf-peer-page .kf-peer-topbar::after {
  content:""; position:absolute; inset:-5px; z-index:-2; border-radius:inherit;
  background:linear-gradient(90deg,rgba(0,212,255,.18),transparent 38%,transparent 62%,rgba(255,140,26,.18));
  filter:blur(10px); opacity:.34; pointer-events:none;
}

html[data-theme="dark"] .kf-peer-page .kf-brand-box {
  background:#ff7a00; color:#07111f; box-shadow:0 10px 26px rgba(255,122,0,.20);
}
html[data-theme="dark"] .kf-peer-page .kf-brand-name,
html[data-theme="dark"] .kf-peer-page .kf-brand-caption { color:#f5f7fb; }
html[data-theme="dark"] .kf-peer-page .kf-brand-name span,
html[data-theme="dark"] .kf-peer-page .kf-peer-footer span { color:#ff7a00; }
html[data-theme="dark"] .kf-peer-page .kf-language,
html[data-theme="dark"] .kf-peer-page .kf-language span { color:#9fb1c8; }
html[data-theme="dark"] .kf-peer-page .kf-language select {
  background:#10243a; color:#f5f7fb; border-color:#2a3e58;
}
html[data-theme="dark"] .kf-peer-page .kf-language select:focus {
  border-color:#ff7a00; box-shadow:0 0 0 4px rgba(255,122,0,.10);
}
html[data-theme="dark"] .kf-peer-page .kf-language select option {
  background:#0d1d31; color:#f5f7fb;
}

html[data-theme="dark"] .kf-peer-page .kf-peer-hero {
  border-color:#24405a;
  background:
    radial-gradient(circle at 100% 0%,rgba(0,212,255,.10),transparent 34%),
    radial-gradient(circle at 0% 100%,rgba(255,122,0,.10),transparent 35%),
    linear-gradient(135deg,#0d1d31 0%,#10273b 55%,#102c3a 100%);
  box-shadow:0 22px 55px rgba(0,0,0,.22);
}
html[data-theme="dark"] .kf-peer-page .kf-blue-orb { background:rgba(0,212,255,.08); box-shadow:0 0 55px rgba(0,212,255,.08); }
html[data-theme="dark"] .kf-peer-page .kf-peach-orb { background:rgba(255,122,0,.08); box-shadow:0 0 55px rgba(255,122,0,.07); }
html[data-theme="dark"] .kf-peer-page .kf-eyebrow,
html[data-theme="dark"] .kf-peer-page .kf-panel-kicker,
html[data-theme="dark"] .kf-peer-page .kf-section-kicker,
html[data-theme="dark"] .kf-peer-page .kf-card-kicker { color:#ff9a3d; }
html[data-theme="dark"] .kf-peer-page .kf-hero-grid h1,
html[data-theme="dark"] .kf-peer-page .kf-summary-card h2,
html[data-theme="dark"] .kf-peer-page .kf-empty-card h2,
html[data-theme="dark"] .kf-peer-page .kf-section-heading h2,
html[data-theme="dark"] .kf-peer-page .kf-review-header h3 { color:#f5f7fb; }
html[data-theme="dark"] .kf-peer-page .kf-hero-grid p,
html[data-theme="dark"] .kf-peer-page .kf-summary-card p,
html[data-theme="dark"] .kf-peer-page .kf-empty-card p,
html[data-theme="dark"] .kf-peer-page .kf-section-heading p,
html[data-theme="dark"] .kf-peer-page .kf-description { color:#9fb0c7; }

html[data-theme="dark"] .kf-peer-page .kf-peer-nav .kf-secondary-button {
  background:#10243a; color:#e9f1fb; border-color:#2a435f;
}
html[data-theme="dark"] .kf-peer-page .kf-peer-nav .kf-secondary-button:hover {
  background:#15304a; border-color:#395773;
}

html[data-theme="dark"] .kf-peer-page .kf-summary-card {
  background:linear-gradient(135deg,#10263a 0%,#122b42 100%);
  border-color:#294863;
  box-shadow:0 16px 36px rgba(0,0,0,.17);
}
html[data-theme="dark"] .kf-peer-page .kf-summary-badge {
  background:#27233a;
  color:#f0eaff;
  border:1px solid #49415f;
}

html[data-theme="dark"] .kf-peer-page .kf-empty-card {
  background:linear-gradient(145deg,#182c25 0%,#1b332a 100%);
  border-color:#315443;
}
html[data-theme="dark"] .kf-peer-page .kf-empty-icon {
  background:#10263a;
  color:#8fe1a9;
  border-color:#315443;
}

html[data-theme="dark"] .kf-peer-page .kf-queue-section {
  background:transparent;
}
html[data-theme="dark"] .kf-peer-page .kf-review-card {
  background:#0d1d31;
  border-color:#263b55;
  box-shadow:0 18px 44px rgba(0,0,0,.20);
}
html[data-theme="dark"] .kf-peer-page .kf-review-header {
  background:linear-gradient(135deg,#10263a 0%,#0f2237 100%);
  border-color:#294863;
}
html[data-theme="dark"] .kf-peer-page .kf-review-type { color:#ff9a3d; }
html[data-theme="dark"] .kf-peer-page .kf-review-team { color:#8fe1a9; }
html[data-theme="dark"] .kf-peer-page .kf-review-time { color:#8195ad; }

html[data-theme="dark"] .kf-peer-page .kf-points-badge {
  background:#30251b;
  border-color:#5d432a;
}
html[data-theme="dark"] .kf-peer-page .kf-points-badge strong { color:#ffb06b; }
html[data-theme="dark"] .kf-peer-page .kf-points-badge span { color:#cdbba8; }

html[data-theme="dark"] .kf-peer-page .kf-evidence-panel {
  border-color:#2a415b;
}
html[data-theme="dark"] .kf-peer-page .kf-photo-panel {
  background:linear-gradient(145deg,#10263a 0%,#122b42 100%);
}
html[data-theme="dark"] .kf-peer-page .kf-details-panel {
  background:linear-gradient(145deg,#30251b 0%,#35291d 100%);
}
html[data-theme="dark"] .kf-peer-page .kf-photo-frame {
  background:#07111f;
  border-color:#294863;
}
html[data-theme="dark"] .kf-peer-page .kf-photo-empty {
  background:rgba(7,17,31,.48);
  color:#8ea2bb;
  border-color:#2a405a;
}
html[data-theme="dark"] .kf-peer-page .kf-photo-warning {
  color:#ffb7c5;
  background:#321f27;
  border-color:#643642;
}
html[data-theme="dark"] .kf-peer-page .kf-location-box {
  background:#182c25;
  border-color:#315443;
}
html[data-theme="dark"] .kf-peer-page .kf-location-positive {
  color:#9ce8ae;
}
html[data-theme="dark"] .kf-peer-page .kf-location-negative {
  color:#ffb7c5;
}

html[data-theme="dark"] .kf-peer-page .kf-signals-panel {
  background:#182c25;
  border-color:#315443;
}
html[data-theme="dark"] .kf-peer-page .kf-signal {
  background:rgba(255,255,255,.035);
  border-color:rgba(255,255,255,.08);
}
html[data-theme="dark"] .kf-peer-page .kf-signal strong { color:#f0f6fb; }
html[data-theme="dark"] .kf-peer-page .kf-signal small { color:#899db5; }
html[data-theme="dark"] .kf-peer-page .kf-signal.confirm > span { color:#8fe1a9; }
html[data-theme="dark"] .kf-peer-page .kf-signal.reject > span { color:#ff9bab; }

html[data-theme="dark"] .kf-peer-page .kf-review-guidance {
  background:#27233a;
  border-color:#49415f;
  color:#ddd4ef;
}
html[data-theme="dark"] .kf-peer-page .kf-review-guidance p { color:#b7abcf; }

html[data-theme="dark"] .kf-peer-page .kf-reject-button {
  background:#321f27; color:#ffbdc9; border-color:#643642;
}
html[data-theme="dark"] .kf-peer-page .kf-confirm-button {
  background:#ff7a00; color:#07111f; border-color:#ff7a00;
  box-shadow:0 10px 25px rgba(255,122,0,.15);
}
html[data-theme="dark"] .kf-peer-page .kf-confirm-button:hover { background:#ff8d32; }

html[data-theme="dark"] .kf-peer-page .kf-alert-error {
  background:#321f27; border-color:#643642; color:#ffb9c7;
}
html[data-theme="dark"] .kf-peer-page .kf-alert-success {
  background:#182c25; border-color:#315443; color:#99e6ae;
}
html[data-theme="dark"] .kf-peer-page .kf-peer-footer { color:#71839b; }

html[data-theme="dark"] .kf-peer-page .kf-loading-card {
  background:#0d1d31; border-color:#263a54; color:#dbe7f5;
  box-shadow:0 24px 60px rgba(0,0,0,.28);
}
html[data-theme="dark"] .kf-peer-page .kf-loading-card p { color:#94a7bf; }
html[data-theme="dark"] .kf-peer-page .kf-wordmark { color:#f5f7fb; }
html[data-theme="dark"] .kf-peer-page .kf-wordmark span { color:#ff7a00; }
html[data-theme="dark"] .kf-peer-page .kf-loading-bar { background:#ff7a00; }

      `}</style>
    </main>
  );
}