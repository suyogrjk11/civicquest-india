"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedDbText = Partial<Record<Language, string>> | null;

type League = {
  id: string;
  name: string;
  name_i18n: LocalizedDbText;
  league_type: string;
  city: string | null;
  state: string | null;
  description: string | null;
  description_i18n: LocalizedDbText;
  starts_at: string | null;
  ends_at: string | null;
};

type Team = {
  id: string;
  league_id: string;
  team_name: string;
  team_name_i18n: LocalizedDbText;
  team_key: string;
  team_type: string;
  locality_name: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  description_i18n: LocalizedDbText;
};

type Mission = {
  id: string;
  title: string;
  title_i18n: LocalizedDbText;
  description: string;
  description_i18n: LocalizedDbText;
  mission_type: string;
  points: number;
  starts_at: string;
  ends_at: string;
  verification_required: boolean;
};

type Membership = {
  id: string;
  league_id: string;
  team_id: string;
  user_id: string;
  member_role: string;
  membership_source: string;
  is_active: boolean;
};

type ScoreboardTeam = {
  team_id: string;
  team_name: string;
  team_type: string;
  locality_name: string | null;
  total_karma_credits: number;
  verified_missions: number;
  active_members: number;
};

const PILOT_LEAGUE_ID =
  "0a22e94a-26ab-419a-bd40-6db3a7f996ff";

const ui = {
  en: {
    loading: "Loading Civic League...",
    signIn: "Please sign in to join a Civic League.",
    unableToLoad: "Unable to load the Civic League",
    unableToJoin: "Unable to join this team",
    civicLeagues: "Civic Leagues",
    language: "Language",
    description: "Turn civic participation into a real-world team experience. Join a local team, complete missions, and build measurable civic impact.",
    yourTeam: "Your team",
    joined: "Joined",
    chooseTeam: "Choose your team",
    teamScoreboard: "Every participant contributes to a team scoreboard.",
    yourTeamLabel: "✓ Your team",
    joining: "Joining...",
    alreadyInTeam: "Already in a team",
    joinTeam: "Join team",
    scoreboard: "Civic-Sense Scoreboard",
    scoreboardDescription: "Team standings based on verified civic contributions.",
    rank: "Rank",
    team: "Team",
    karmaCredits: "Karma Credits",
    verifiedMissions: "Verified Missions",
    members: "Members",
    noScoreboard: "No scoreboard data available yet.",
    missions: "Active Civic Missions",
    missionsDescription: "Complete real-world actions and submit evidence for verification.",
    noMissions: "No active missions right now.",
    points: "points",
    evidenceRequired: "Evidence verification required",
    noVerification: "No verification required",
    ends: "Ends",
    home: "Home",
    dashboard: "Dashboard",
    peerReview: "Peer Review",
    peerReviewTitle: "Community Verification",
    peerReviewDescription: "Review evidence submitted by other league members and contribute a community trust signal.",
    peerReviewAction: "Open Peer Review →",
  },
  hi: {
    loading: "सिविक लीग लोड हो रही है...",
    signIn: "सिविक लीग में शामिल होने के लिए कृपया साइन इन करें।",
    unableToLoad: "सिविक लीग लोड नहीं हो सकी",
    unableToJoin: "इस टीम में शामिल नहीं हो सके",
    civicLeagues: "सिविक लीग्स",
    language: "भाषा",
    description: "नागरिक भागीदारी को वास्तविक जीवन के टीम अनुभव में बदलें। स्थानीय टीम से जुड़ें, मिशन पूरे करें और मापने योग्य नागरिक प्रभाव बनाएं।",
    yourTeam: "आपकी टीम",
    joined: "शामिल हो गए",
    chooseTeam: "अपनी टीम चुनें",
    teamScoreboard: "हर प्रतिभागी टीम स्कोरबोर्ड में योगदान देता है।",
    yourTeamLabel: "✓ आपकी टीम",
    joining: "शामिल हो रहे हैं...",
    alreadyInTeam: "आप पहले से एक टीम में हैं",
    joinTeam: "टीम में शामिल हों",
    scoreboard: "सिविक-सेंस स्कोरबोर्ड",
    scoreboardDescription: "सत्यापित नागरिक योगदान के आधार पर टीम की स्थिति।",
    rank: "रैंक",
    team: "टीम",
    karmaCredits: "कर्मा क्रेडिट्स",
    verifiedMissions: "सत्यापित मिशन",
    members: "सदस्य",
    noScoreboard: "अभी कोई स्कोरबोर्ड डेटा उपलब्ध नहीं है।",
    missions: "सक्रिय सिविक मिशन",
    missionsDescription: "वास्तविक जीवन की कार्रवाइयाँ पूरी करें और सत्यापन के लिए प्रमाण जमा करें।",
    noMissions: "अभी कोई सक्रिय मिशन नहीं है।",
    points: "अंक",
    evidenceRequired: "प्रमाण सत्यापन आवश्यक",
    noVerification: "सत्यापन आवश्यक नहीं",
    ends: "समाप्ति",
    home: "होम",
    dashboard: "डैशबोर्ड",
    peerReview: "पीयर रिव्यू",
    peerReviewTitle: "सामुदायिक सत्यापन",
    peerReviewDescription: "अन्य लीग सदस्यों द्वारा जमा किए गए प्रमाण की समीक्षा करें और सामुदायिक भरोसे के संकेत में योगदान दें।",
    peerReviewAction: "पीयर रिव्यू खोलें →",
  },
  mr: {
    loading: "सिविक लीग लोड होत आहे...",
    signIn: "सिविक लीगमध्ये सहभागी होण्यासाठी कृपया साइन इन करा.",
    unableToLoad: "सिविक लीग लोड करता आली नाही",
    unableToJoin: "या टीममध्ये सहभागी होता आले नाही",
    civicLeagues: "सिविक लीग्स",
    language: "भाषा",
    description: "नागरिक सहभागाला वास्तविक जीवनातील टीम अनुभवात बदला. स्थानिक टीममध्ये सहभागी व्हा, मिशन पूर्ण करा आणि मोजता येणारा नागरी प्रभाव निर्माण करा.",
    yourTeam: "तुमची टीम",
    joined: "सहभागी",
    chooseTeam: "तुमची टीम निवडा",
    teamScoreboard: "प्रत्येक सहभागी टीम स्कोअरबोर्डमध्ये योगदान देतो.",
    yourTeamLabel: "✓ तुमची टीम",
    joining: "सहभागी होत आहे...",
    alreadyInTeam: "तुम्ही आधीच एका टीममध्ये आहात",
    joinTeam: "टीममध्ये सहभागी व्हा",
    scoreboard: "सिविक-सेंस स्कोअरबोर्ड",
    scoreboardDescription: "सत्यापित नागरी योगदानावर आधारित टीमची स्थिती.",
    rank: "क्रमांक",
    team: "टीम",
    karmaCredits: "कर्मा क्रेडिट्स",
    verifiedMissions: "सत्यापित मिशन",
    members: "सदस्य",
    noScoreboard: "अद्याप कोणताही स्कोअरबोर्ड डेटा उपलब्ध नाही.",
    missions: "सक्रिय सिविक मिशन",
    missionsDescription: "वास्तविक जीवनातील कृती पूर्ण करा आणि सत्यापनासाठी पुरावे सादर करा.",
    noMissions: "सध्या कोणतेही सक्रिय मिशन नाही.",
    points: "गुण",
    evidenceRequired: "पुरावा सत्यापन आवश्यक",
    noVerification: "सत्यापन आवश्यक नाही",
    ends: "समाप्ती",
    home: "होम",
    dashboard: "डॅशबोर्ड",
    peerReview: "पीअर रिव्ह्यू",
    peerReviewTitle: "समुदाय पडताळणी",
    peerReviewDescription: "इतर लीग सदस्यांनी सादर केलेल्या पुराव्यांचे परीक्षण करा आणि समुदायाच्या विश्वासाच्या संकेतामध्ये योगदान द्या.",
    peerReviewAction: "पीअर रिव्ह्यू उघडा →",
  },
} as const;

function localizeLeagueType(value: string, language: Language) {
  const key = value.toLowerCase();
  const map: Record<string, Record<Language, string>> = {
    city: { en: "City", hi: "शहर", mr: "शहर" },
    state: { en: "State", hi: "राज्य", mr: "राज्य" },
    ward: { en: "Ward", hi: "वार्ड", mr: "प्रभाग" },
    college: { en: "College", hi: "कॉलेज", mr: "कॉलेज" },
    national: { en: "National", hi: "राष्ट्रीय", mr: "राष्ट्रीय" },
  };
  return map[key]?.[language] ?? value;
}

function localizeTeamType(value: string, language: Language) {
  const key = value.toLowerCase();
  const map: Record<string, Record<Language, string>> = {
    city: { en: "City", hi: "शहर", mr: "शहर" },
    ward: { en: "Ward", hi: "वार्ड", mr: "प्रभाग" },
    college: { en: "College", hi: "कॉलेज", mr: "कॉलेज" },
    locality: { en: "Locality", hi: "क्षेत्र", mr: "परिसर" },
  };
  return map[key]?.[language] ?? value;
}

function localizedText(
  value: LocalizedDbText,
  fallback: string,
  language: Language
) {
  const resolved = value?.[language] || value?.en || fallback;

  return resolved.replace(/KarmaFacie/gi, "KrutBharat");
}

function localizeLeagueName(
  league: League,
  language: Language
) {
  const fromDb = localizedText(
    league.name_i18n,
    "",
    language
  );

  if (fromDb) return fromDb;

  if (
    league.name === "KrutBharat Pilot Civic League" ||
    league.name === "KarmaFacie Pilot Civic League"
  ) {
    return language === "hi"
      ? "KrutBharat पायलट सिविक लीग"
      : language === "mr"
      ? "KrutBharat पायलट सिविक लीग"
      : "KrutBharat Pilot Civic League";
  }

  return league.name.replace(/KarmaFacie/gi, "KrutBharat");
}

function localizeTeamName(
  team: Team | null | undefined,
  language: Language,
  fallback = ""
) {
  if (!team) return fallback;

  const fromDb = localizedText(
    team.team_name_i18n,
    "",
    language
  );

  if (fromDb) return fromDb;

  const fallbackMap: Record<string, Record<Language, string>> = {
    "College Pilot Team": {
      en: "College Pilot Team",
      hi: "कॉलेज पायलट टीम",
      mr: "महाविद्यालय पायलट टीम",
    },
    "KrutBharat Pilot Team": {
      en: "KrutBharat Pilot Team",
      hi: "KrutBharat पायलट टीम",
      mr: "KrutBharat पायलट टीम",
    },
    "Ward Pilot Team": {
      en: "Ward Pilot Team",
      hi: "वार्ड पायलट टीम",
      mr: "प्रभाग पायलट टीम",
    },
  };

  return (
    fallbackMap[team.team_name]?.[language] ??
    team.team_name ??
    fallback
  );
}

function localizeMissionType(value: string, language: Language) {
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

export default function LeaguesPage() {
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const text = ui[language];

  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [membership, setMembership] =
    useState<Membership | null>(null);
  const [scoreboard, setScoreboard] =
    useState<ScoreboardTeam[]>([]);

  const [loading, setLoading] = useState(true);
  const [joiningTeamId, setJoiningTeamId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadLeague() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(text.signIn);
        setLoading(false);
        return;
      }

      const [
        leagueResult,
        teamsResult,
        missionsResult,
        membershipResult,
        scoreboardResult,
      ] = await Promise.all([
        supabase
          .from("civic_leagues")
          .select(
            "id,name,name_i18n,league_type,city,state,description,description_i18n,starts_at,ends_at"
          )
          .eq("id", PILOT_LEAGUE_ID)
          .eq("is_active", true)
          .maybeSingle(),

        supabase
          .from("civic_league_teams")
          .select(
            "id,league_id,team_name,team_name_i18n,team_key,team_type,locality_name,city,state,description,description_i18n"
          )
          .eq("league_id", PILOT_LEAGUE_ID)
          .eq("is_active", true)
          .order("team_name"),

        supabase
          .from("civic_missions")
          .select(
            "id,title,title_i18n,description,description_i18n,mission_type,points,starts_at,ends_at,verification_required"
          )
          .eq("league_id", PILOT_LEAGUE_ID)
          .eq("is_active", true)
          .order("points", { ascending: false }),

        supabase
          .from("civic_league_members")
          .select(
            "id,league_id,team_id,user_id,member_role,membership_source,is_active"
          )
          .eq("league_id", PILOT_LEAGUE_ID)
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle(),

        supabase.rpc(
          "get_civic_league_scoreboard",
          {
            p_league_id: PILOT_LEAGUE_ID,
          }
        ),
      ]);

      if (leagueResult.error) {
        throw leagueResult.error;
      }

      if (teamsResult.error) {
        throw teamsResult.error;
      }

      if (missionsResult.error) {
        throw missionsResult.error;
      }

      if (membershipResult.error) {
        throw membershipResult.error;
      }

      if (scoreboardResult.error) {
        throw scoreboardResult.error;
      }

      setLeague(leagueResult.data);
      setTeams(teamsResult.data ?? []);
      setMissions(missionsResult.data ?? []);
      setMembership(
        membershipResult.data as Membership | null
      );
      setScoreboard(
        (scoreboardResult.data ??
          []) as ScoreboardTeam[]
      );
    } catch (err) {
      console.error(
        "Civic League load error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null
          ? JSON.stringify(err)
          : String(err);

      setError(
        `${text.unableToLoad}: ${message}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function joinTeam(teamId: string) {
    try {
      setJoiningTeamId(teamId);
      setError("");

      const { data, error: rpcError } =
        await supabase.rpc(
          "join_civic_league",
          {
            p_league_id: PILOT_LEAGUE_ID,
            p_team_id: teamId,
          }
        );

      if (rpcError) {
        throw rpcError;
      }

      setMembership(data as Membership);

      await loadLeague();
    } catch (err) {
      console.error(
        "Civic League join error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null
          ? JSON.stringify(err)
          : String(err);

      setError(
        `${text.unableToJoin}: ${message}`
      );
    } finally {
      setJoiningTeamId(null);
    }
  }

  useEffect(() => {
    loadLeague();
  }, []);

  if (loading) {
    return (
      <main className="kf-leagues-page kf-loading-page">
        <div className="kf-loading-card">
          <div className="kf-wordmark">
            Krut<span>Bharat</span>
          </div>
          <div className="kf-loading-bar" />
          <p>{text.loading}</p>
        </div>
      </main>
    );
  }

  if (error && !league) {
    return (
      <main className="kf-leagues-page kf-loading-page">
        <div className="kf-error-card">
          <div className="kf-eyebrow">
            KRUTBHARAT
          </div>
          <h1>{text.civicLeagues}</h1>
          <p>{error}</p>
          <Link
            href="/dashboard"
            className="kf-primary-button kf-primary-button-inline"
          >
            {text.dashboard}
          </Link>
        </div>
      </main>
    );
  }

  const localizedLeagueDescription = league
    ? localizedText(
        league.description_i18n,
        league.description || "",
        language
      ) ||
      (language === "en"
        ? "A pilot civic participation league on KrutBharat."
        : language === "hi"
          ? "KrutBharat पर नागरिक भागीदारी की सुविधाओं के परीक्षण के लिए एक पायलट लीग।"
          : "KrutBharat वरील नागरी सहभागाच्या सुविधांची चाचणी घेण्यासाठी पायलट लीग.")
    : "";

  return (
    <main className="kf-leagues-page">
      <div className="kf-leagues-shell">

        {/* HEADER */}
        <header className="kf-leagues-topbar">
          <div className="kf-header-side kf-header-left">
            <Link href="/dashboard" className="kf-header-dashboard">
              <span className="kf-header-arrow">←</span>
              <span>{text.dashboard}</span>
            </Link>
          </div>

          <div className="kf-brand-lockup kf-centered-brand">
            <div className="kf-brand-box">K</div>
            <div>
              <div className="kf-brand-name">
                Krut<span>Bharat</span>
              </div>
              <div className="kf-brand-caption">
                CIVIC LEAGUES
              </div>
            </div>
          </div>

          <div className="kf-header-side kf-header-right">
            <label className="kf-language">
              <span>{text.language}</span>
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
                aria-label={
                  language === "en" ? "Language" : "भाषा"
                }
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </label>
          </div>
        </header>

        {/* HERO */}
        <section className="kf-leagues-hero">
          <div className="kf-orb kf-orb-blue" />
          <div className="kf-orb kf-orb-peach" />

          <div className="kf-hero-copy">
            <div className="kf-eyebrow">
              {text.civicLeagues}
            </div>

            <div className="kf-hero-grid">
              <div>
                <h1>{text.civicLeagues}</h1>

                <p>
                  {text.description}
                </p>
              </div>

              <div className="kf-hero-actions">
                <Link
                  href="/"
                  className="kf-secondary-button"
                >
                  ← {text.home}
                </Link>

                <Link
                  href="/dashboard"
                  className="kf-secondary-button"
                >
                  {text.dashboard}
                </Link>

                <Link
                  href="/leagues/peer-review"
                  className="kf-orange-button"
                >
                  {text.peerReview}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {error && league && (
          <div className="kf-alert kf-alert-error">
            {error}
          </div>
        )}

        {/* LEAGUE IDENTITY */}
        {league && (
          <section className="kf-league-identity">
            <div className="kf-identity-main">
              <div className="kf-card-kicker">
                {localizeLeagueType(
                  league.league_type,
                  language
                )}{" "}
                {language === "en"
                  ? "league"
                  : language === "hi"
                    ? "लीग"
                    : "लीग"}
              </div>

              <h2>
                {localizeLeagueName(
                  league,
                  language
                )}
              </h2>

              <p>
                {localizedLeagueDescription}
              </p>

              {(league.city || league.state) && (
                <div className="kf-location-pill">
                  📍{" "}
                  {[league.city, league.state]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>

            {membership && (
              <div className="kf-your-team">
                <div className="kf-card-kicker">
                  {text.yourTeam}
                </div>

                <div className="kf-your-team-name">
                  {localizeTeamName(
                    teams.find(
                      (team) =>
                        team.id === membership.team_id
                    ),
                    language,
                    text.joined
                  )}
                </div>

                <div className="kf-joined-pill">
                  ✓ {text.joined}
                </div>
              </div>
            )}
          </section>
        )}

        {/* COMMUNITY VERIFICATION */}
        <section className="kf-feature-banner kf-feature-banner-lavender">
          <div>
            <div className="kf-section-kicker">
              {text.peerReview}
            </div>

            <h2>{text.peerReviewTitle}</h2>

            <p>
              {text.peerReviewDescription}
            </p>
          </div>

          <Link
            href="/leagues/peer-review"
            className="kf-orange-button"
          >
            {text.peerReviewAction}
          </Link>
        </section>

        {/* TEAMS */}
        <section className="kf-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker kf-kicker-blue">
                YOUR LOCAL TEAM
              </div>

              <h2>{text.chooseTeam}</h2>

              <p>
                {text.teamScoreboard}
              </p>
            </div>
          </div>

          <div className="kf-team-grid">
            {teams.map((team) => {
              const isMyTeam =
                membership?.team_id === team.id;

              return (
                <article
                  key={team.id}
                  className={
                    isMyTeam
                      ? "kf-team-card kf-team-active"
                      : "kf-team-card"
                  }
                >
                  <div className="kf-team-top">
                    <div className="kf-team-type">
                      {localizeTeamType(
                        team.team_type,
                        language
                      )}
                    </div>

                    {isMyTeam && (
                      <span className="kf-team-badge">
                        ✓ {text.yourTeamLabel.replace(
                          "✓ ",
                          ""
                        )}
                      </span>
                    )}
                  </div>

                  <h3>
                    {localizeTeamName(
                      team,
                      language
                    )}
                  </h3>

                  {team.locality_name && (
                    <div className="kf-team-locality">
                      📍 {team.locality_name}
                    </div>
                  )}

                  {team.description && (
                    <p>
                      {localizedText(
                        team.description_i18n,
                        team.description,
                        language
                      )}
                    </p>
                  )}

                  {isMyTeam ? (
                    <div className="kf-team-current">
                      {text.yourTeamLabel}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        joinTeam(team.id)
                      }
                      disabled={
                        joiningTeamId !== null ||
                        membership !== null
                      }
                      className="kf-team-button"
                    >
                      {joiningTeamId === team.id
                        ? text.joining
                        : membership
                          ? text.alreadyInTeam
                          : text.joinTeam}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* SCOREBOARD */}
        <section className="kf-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker kf-kicker-green">
                KARMA CREDITS
              </div>

              <h2>{text.scoreboard}</h2>

              <p>
                {text.scoreboardDescription}
              </p>
            </div>
          </div>

          <div className="kf-scoreboard">
            <div className="kf-score-head">
              <span>{text.rank}</span>
              <span>{text.team}</span>
              <span>{text.karmaCredits}</span>
              <span>{text.verifiedMissions}</span>
              <span>{text.members}</span>
            </div>

            {scoreboard.length === 0 ? (
              <div className="kf-empty">
                {text.noScoreboard}
              </div>
            ) : (
              scoreboard.map((team, index) => {
                const isMyTeam =
                  membership?.team_id === team.team_id;

                return (
                  <div
                    key={team.team_id}
                    className={
                      isMyTeam
                        ? "kf-score-row kf-score-active"
                        : "kf-score-row"
                    }
                  >
                    <div className="kf-rank">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="kf-score-team">
                        {localizeTeamName(
                          teams.find(
                            (sourceTeam) =>
                              sourceTeam.id ===
                              team.team_id
                          ),
                          language,
                          team.team_name
                        )}
                      </div>

                      <div className="kf-score-sub">
                        {localizeTeamType(
                          team.team_type,
                          language
                        )}
                        {team.locality_name
                          ? ` · ${team.locality_name}`
                          : ""}
                      </div>
                    </div>

                    <div className="kf-score-value">
                      <span className="kf-mobile-label">
                        {text.karmaCredits}
                      </span>
                      {team.total_karma_credits}
                    </div>

                    <div className="kf-score-value">
                      <span className="kf-mobile-label">
                        {text.verifiedMissions}
                      </span>
                      {team.verified_missions}
                    </div>

                    <div className="kf-score-value">
                      <span className="kf-mobile-label">
                        {text.members}
                      </span>
                      {team.active_members}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* MISSIONS */}
        <section className="kf-section kf-missions-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker kf-kicker-orange">
                TAKE ACTION
              </div>

              <h2>{text.missions}</h2>

              <p>
                {text.missionsDescription}
              </p>
            </div>
          </div>

          {missions.length === 0 ? (
            <div className="kf-empty">
              {text.noMissions}
            </div>
          ) : (
            <div className="kf-mission-grid">
              {missions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/leagues/missions/${mission.id}`}
                  className="kf-mission-card"
                >
                  <div className="kf-mission-top">
                    <div>
                      <div className="kf-mission-type">
                        {localizeMissionType(
                          mission.mission_type,
                          language
                        )}
                      </div>

                      <h3>
                        {localizedText(
                          mission.title_i18n,
                          mission.title,
                          language
                        )}
                      </h3>
                    </div>

                    <div className="kf-mission-points">
                      +{mission.points}
                    </div>
                  </div>

                  <p>
                    {localizedText(
                      mission.description_i18n,
                      mission.description,
                      language
                    )}
                  </p>

                  <div className="kf-mission-footer">
                    <span>
                      {mission.verification_required
                        ? `✓ ${text.evidenceRequired}`
                        : `○ ${text.noVerification}`}
                    </span>

                    <span>
                      {text.ends}{" "}
                      {new Date(
                        mission.ends_at
                      ).toLocaleDateString(
                        language === "hi"
                          ? "hi-IN"
                          : language === "mr"
                            ? "mr-IN"
                            : "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="kf-mission-cta">
                    {language === "en"
                      ? "Open mission →"
                      : language === "hi"
                        ? "मिशन खोलें →"
                        : "मिशन उघडा →"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className="kf-leagues-footer">
          Krut<span>Bharat</span> ·{" "}
          {text.civicLeagues}
        </footer>
      </div>

      <style>{`
        .kf-leagues-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #556675;
          --kf-muted: #7b8790;
          --kf-orange: #ff7a00;
          --kf-blue: #eaf3f8;
          --kf-blue-line: #d5e5ed;
          --kf-green: #eef6e7;
          --kf-green-line: #d6e6cb;
          --kf-peach: #fff0df;
          --kf-peach-line: #eed9c0;
          --kf-lavender: #f4eff9;
          --kf-lavender-line: #e1d5eb;
          --kf-line: #ddd7ce;

          min-height: 100vh;
          padding: 20px 16px 72px;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
            radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
            radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          color: var(--kf-body);
          font-family: var(--font-body);
        }

        .kf-leagues-page *,
        .kf-leagues-page *::before,
        .kf-leagues-page *::after {
          box-sizing: border-box;
        }

        .kf-leagues-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .kf-leagues-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
          min-height: 84px;
          padding: 10px 14px;
          border: 1px solid var(--kf-line);
          border-radius: 32px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 14px 36px rgba(16,27,43,.07);
          backdrop-filter: blur(16px);
        }

        .kf-header-side {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .kf-header-left {
          justify-content: flex-start;
        }

        .kf-header-right {
          justify-content: flex-end;
        }

        .kf-header-dashboard {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 48px;
          padding: 0 18px;
          border: 1px solid #dfe3e7;
          border-radius: 999px;
          background: #fff;
          color: #52616f;
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 800;
          box-shadow: 0 5px 18px rgba(16,32,51,.035);
        }

        .kf-header-arrow {
          color: var(--kf-orange);
          font-size: 20px;
          line-height: 1;
          font-weight: 500;
        }

        .kf-centered-brand {
          justify-content: center;
          gap: 12px;
          white-space: nowrap;
        }

        .kf-brand-lockup,
        .kf-mission-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-brand-box {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          background: var(--kf-orange);
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 31px;
          line-height: 1;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(255,122,0,.18);
        }

        .kf-brand-name,
        .kf-wordmark {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-weight: 800;
          letter-spacing: -.045em;
        }

        .kf-brand-name {
          font-size: 29px;
          line-height: .95;
          letter-spacing: -.045em;
        }

        .kf-brand-name span,
        .kf-wordmark span,
        .kf-leagues-footer span {
          color: var(--kf-orange);
        }

        .kf-brand-caption {
          margin-top: 5px;
          color: var(--kf-navy);
          font-size: 9px;
          line-height: 1;
          letter-spacing: .24em;
          font-weight: 900;
        }

        .kf-language {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #52616f;
          font-size: 14px;
          font-weight: 800;
        }

        .kf-language select {
          min-width: 132px;
          padding: 12px 16px;
          border: 1px solid #d7d1c9;
          border-radius: 999px;
          background: #fff;
          color: #304154;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .kf-language select:focus {
          border-color: #e6ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-leagues-hero {
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

        .kf-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-orb-blue {
          width: 190px;
          height: 190px;
          right: -76px;
          top: -82px;
          background: rgba(207,227,239,.58);
        }

        .kf-orb-peach {
          width: 170px;
          height: 105px;
          left: -48px;
          bottom: -54px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.46);
          transform: rotate(8deg);
        }

        .kf-hero-copy,
        .kf-hero-grid {
          position: relative;
          z-index: 1;
        }

        .kf-eyebrow,
        .kf-card-kicker,
        .kf-section-kicker {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
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
          margin-top: 9px;
        }

        .kf-hero-grid h1 {
          margin: 0;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(45px, 6vw, 66px);
          line-height: .96;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-hero-grid p {
          max-width: 730px;
          margin: 12px 0 0;
          color: #596b79;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .kf-secondary-button,
        .kf-orange-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .kf-secondary-button {
          background: #fffdf9;
          border: 1px solid #dad4cc;
          color: #506171;
        }

        .kf-orange-button {
          border: 1px solid var(--kf-orange);
          background: var(--kf-orange);
          color: #fff;
          box-shadow: 0 10px 22px rgba(255,122,0,.15);
        }

        .kf-league-identity {
          display: grid;
          grid-template-columns: minmax(0,1fr) 265px;
          gap: 18px;
          margin-bottom: 16px;
          padding: 26px;
          border: 1px solid #e3d8ce;
          border-top: 4px solid var(--kf-orange);
          border-radius: 30px;
          background:
            linear-gradient(135deg, #fffdf9 0%, #fff8ef 100%);
          box-shadow: 0 14px 38px rgba(16,27,43,.055);
        }

        .kf-card-kicker {
          color: #928780;
        }

        .kf-identity-main h2 {
          margin: 5px 0 7px;
          color: #263a4e;
          font-family: var(--font-display);
          font-size: 32px;
          line-height: 1.05;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .kf-identity-main p {
          max-width: 740px;
          margin: 0;
          color: #61717e;
          font-size: 13px;
          line-height: 1.68;
        }

        .kf-location-pill {
          display: inline-flex;
          margin-top: 13px;
          padding: 7px 10px;
          border-radius: 999px;
          background: #eef4f7;
          border: 1px solid #dbe6ec;
          color: #607889;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-your-team {
          align-self: stretch;
          padding: 17px;
          border-radius: 22px;
          background: #eef6e7;
          border: 1px solid var(--kf-green-line);
        }

        .kf-your-team-name {
          margin-top: 6px;
          color: #344b5d;
          font-family: var(--font-display);
          font-size: 23px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-joined-pill {
          display: inline-flex;
          margin-top: 10px;
          padding: 7px 9px;
          border-radius: 999px;
          background: #fffdf9;
          border: 1px solid #dce7d4;
          color: #67804d;
          font-size: 9px;
          font-weight: 900;
        }

        .kf-feature-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 22px;
          padding: 22px 24px;
          border-radius: 26px;
          border: 1px solid;
          box-shadow: 0 12px 30px rgba(16,27,43,.045);
        }

        .kf-feature-banner-lavender {
          background: #f4eff9;
          border-color: var(--kf-lavender-line);
        }

        .kf-feature-banner h2 {
          margin: 5px 0 6px;
          color: #304154;
          font-family: var(--font-display);
          font-size: 26px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-feature-banner p {
          max-width: 740px;
          margin: 0;
          color: #64727e;
          font-size: 12px;
          line-height: 1.65;
        }

        .kf-section {
          margin-bottom: 18px;
          padding: 27px;
          border-radius: 30px;
          border: 1px solid var(--kf-line);
          background: rgba(255,253,249,.95);
          box-shadow: 0 14px 38px rgba(16,27,43,.05);
        }

        .kf-missions-section {
          background:
            linear-gradient(135deg, #fffdf9 0%, #f7fbfd 100%);
          border-color: #dce7ed;
        }

        .kf-section-heading {
          margin-bottom: 17px;
        }

        .kf-section-heading h2 {
          margin: 5px 0 5px;
          color: #263a4e;
          font-family: var(--font-display);
          font-size: 31px;
          line-height: 1.02;
          letter-spacing: -.03em;
          font-weight: 800;
        }

        .kf-section-heading p {
          margin: 0;
          color: #697883;
          font-size: 12px;
          line-height: 1.6;
        }

        .kf-kicker-blue { color: #66849a; }
        .kf-kicker-green { color: #718855; }
        .kf-kicker-orange { color: #a46e45; }

        .kf-team-grid,
        .kf-mission-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
        }

        .kf-team-card {
          padding: 19px;
          border: 1px solid #e1dcd4;
          border-radius: 24px;
          background: #fffdf9;
          box-shadow: 0 10px 26px rgba(16,27,43,.04);
        }

        .kf-team-active {
          background: #f1f7eb;
          border-color: #cfdfc2;
        }

        .kf-team-top,
        .kf-mission-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .kf-team-type,
        .kf-mission-type {
          color: #7c878f;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .kf-team-badge {
          padding: 6px 8px;
          border-radius: 999px;
          background: #fffdf9;
          border: 1px solid #d9e6cf;
          color: #6d854f;
          font-size: 8px;
          font-weight: 900;
        }

        .kf-team-card h3,
        .kf-mission-card h3 {
          margin: 8px 0 0;
          color: #304457;
          font-family: var(--font-display);
          font-weight: 800;
        }

        .kf-team-card h3 {
          font-size: 21px;
          line-height: 1.05;
        }

        .kf-team-locality {
          margin-top: 8px;
          color: #71808a;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-team-card p {
          margin: 10px 0 0;
          color: #687782;
          font-size: 11px;
          line-height: 1.62;
        }

        .kf-team-current {
          margin-top: 15px;
          padding: 10px;
          border-radius: 15px;
          background: #e6f0dc;
          color: #5e7746;
          text-align: center;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-team-button {
          width: 100%;
          margin-top: 15px;
          padding: 11px 13px;
          border: 0;
          border-radius: 999px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(255,122,0,.14);
        }

        .kf-team-button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }

        .kf-scoreboard {
          overflow: hidden;
          border: 1px solid #ddd8d0;
          border-radius: 24px;
          background: #fffdf9;
        }

        .kf-score-head,
        .kf-score-row {
          display: grid;
          grid-template-columns: 70px minmax(0,1fr) 150px 145px 110px;
          gap: 12px;
          align-items: center;
        }

        .kf-score-head {
          padding: 13px 16px;
          background: #f2f4f3;
          color: #79848c;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .kf-score-row {
          padding: 16px;
          border-top: 1px solid #e8e3dc;
        }

        .kf-score-active {
          background: #f0f6eb;
        }

        .kf-rank {
          color: #304457;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
        }

        .kf-score-team {
          color: #304457;
          font-size: 12px;
          font-weight: 900;
        }

        .kf-score-sub {
          margin-top: 3px;
          color: #7a868e;
          font-size: 9px;
        }

        .kf-score-value {
          color: #304457;
          font-size: 12px;
          font-weight: 900;
          text-align: right;
        }

        .kf-mobile-label {
          display: none;
          color: #89939a;
          font-size: 9px;
          font-weight: 800;
        }

        .kf-mission-card {
          display: block;
          padding: 20px;
          border: 1px solid #dfe5e8;
          border-radius: 25px;
          background: #fffdf9;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 11px 28px rgba(16,27,43,.045);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .kf-mission-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(16,27,43,.08);
        }

        .kf-mission-card:nth-child(3n + 1) {
          background: #f2f7fa;
          border-color: #d9e7ef;
        }

        .kf-mission-card:nth-child(3n + 2) {
          background: #fff5e9;
          border-color: #efdfca;
        }

        .kf-mission-card:nth-child(3n) {
          background: #f3f7ed;
          border-color: #dbe7cf;
        }

        .kf-mission-card h3 {
          font-size: 22px;
          line-height: 1.08;
        }

        .kf-mission-points {
          min-width: 58px;
          padding: 8px 10px;
          border-radius: 999px;
          background: #fffdf9;
          border: 1px solid rgba(16,27,43,.09);
          color: #8c6848;
          font-size: 11px;
          font-weight: 900;
          text-align: center;
        }

        .kf-mission-card p {
          margin: 12px 0 0;
          color: #63737f;
          font-size: 11px;
          line-height: 1.68;
        }

        .kf-mission-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
          padding-top: 11px;
          border-top: 1px solid rgba(16,27,43,.08);
          color: #7b878e;
          font-size: 9px;
          line-height: 1.45;
        }

        .kf-mission-cta {
          margin-top: 12px;
          color: #4f7188;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-alert {
          margin-bottom: 13px;
          padding: 13px 15px;
          border-radius: 18px;
          font-size: 11px;
          font-weight: 800;
        }

        .kf-alert-error {
          background: #fff0ed;
          border: 1px solid #ecd0c8;
          color: #955b4d;
        }

        .kf-empty {
          padding: 18px;
          border-radius: 20px;
          background: #f6f4f0;
          border: 1px solid #e2ddd6;
          color: #6b7882;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        .kf-leagues-footer {
          padding: 16px 3px 0;
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

        .kf-loading-card,
        .kf-error-card {
          width: min(480px, 100%);
          padding: 36px 30px;
          border-radius: 31px;
          border: 1px solid var(--kf-line);
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

        .kf-loading-card p,
        .kf-error-card p {
          margin: 0;
          color: #687985;
          font-size: 13px;
          line-height: 1.65;
        }

        .kf-error-card h1 {
          margin: 7px 0 9px;
          color: var(--kf-ink);
          font-family: var(--font-display);
          font-size: 39px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-primary-button-inline {
          width: auto;
          margin-top: 20px;
        }

        .kf-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 17px;
          border: 0;
          border-radius: 999px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 10px 22px rgba(255,122,0,.16);
        }

        @media (max-width: 950px) {
          .kf-hero-grid {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-hero-actions {
            justify-content: flex-start;
          }

          .kf-league-identity {
            grid-template-columns: 1fr;
          }

          .kf-team-grid,
          .kf-mission-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .kf-score-head,
          .kf-score-row {
            grid-template-columns: 58px minmax(0,1fr) 120px 120px 90px;
          }
        }

        @media (max-width: 700px) {
          .kf-leagues-page {
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

          .kf-leagues-hero {
            padding: 24px 20px;
            border-radius: 28px;
          }

          .kf-hero-grid h1 {
            font-size: 45px;
          }

          .kf-section,
          .kf-league-identity {
            padding: 21px 18px;
            border-radius: 25px;
          }

          .kf-feature-banner {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .kf-team-grid,
          .kf-mission-grid {
            grid-template-columns: 1fr;
          }

          .kf-scoreboard {
            border-radius: 20px;
          }

          .kf-score-head {
            display: none;
          }

          .kf-score-row {
            display: grid;
            grid-template-columns: 48px minmax(0,1fr);
            gap: 8px 12px;
            padding: 15px;
          }

          .kf-score-value {
            grid-column: 2;
            display: flex;
            justify-content: space-between;
            text-align: left;
          }

          .kf-mobile-label {
            display: inline;
          }

          .kf-your-team-name {
            font-size: 21px;
          }
        }

/* =========================================================
   KRUTBHARAT — CIVIC LEAGUES DARK MODE
   Scoped only to .kf-leagues-page
   ========================================================= */

html[data-theme="dark"] .kf-leagues-page {
  --kf-ivory: #07111f;
  --kf-white: #f5f7fb;
  --kf-navy: #0d1d31;
  --kf-ink: #f5f7fb;
  --kf-body: #b8c4d9;
  --kf-muted: #8291aa;
  --kf-orange: #ff7a00;
  --kf-blue: #10263a;
  --kf-blue-line: #27435e;
  --kf-green: #182c25;
  --kf-green-line: #315443;
  --kf-peach: #30251b;
  --kf-peach-line: #5d4027;
  --kf-lavender: #27233a;
  --kf-lavender-line: #484061;
  --kf-line: #1f2e47;

  color: var(--kf-body);
  background:
    radial-gradient(circle at 92% 4%, rgba(0, 212, 255, .09) 0%, rgba(0, 212, 255, 0) 25%),
    radial-gradient(circle at 6% 82%, rgba(255, 122, 0, .08) 0%, rgba(255, 122, 0, 0) 25%),
    #07111f;
}

html[data-theme="dark"] .kf-leagues-page .kf-leagues-topbar {
  position: relative;
  border: 1px solid transparent;
  background: rgba(4, 10, 20, .68);
  box-shadow:
    -10px 0 24px -8px rgba(0, 212, 255, .28),
    10px 0 24px -8px rgba(255, 140, 26, .28),
    0 10px 30px rgba(0, 0, 0, .34);
  backdrop-filter: blur(14px) saturate(125%);
}

html[data-theme="dark"] .kf-leagues-page .kf-leagues-topbar::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    90deg,
    #00d4ff 0%,
    rgba(0, 212, 255, .35) 24%,
    rgba(31, 46, 71, .45) 50%,
    rgba(255, 140, 26, .35) 76%,
    #ff8c1a 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

html[data-theme="dark"] .kf-leagues-page .kf-leagues-topbar::after {
  content: "";
  position: absolute;
  inset: -5px;
  z-index: -2;
  border-radius: inherit;
  background:
    linear-gradient(90deg, rgba(0,212,255,.18), transparent 38%, transparent 62%, rgba(255,140,26,.18));
  filter: blur(10px);
  opacity: .34;
  pointer-events: none;
}

html[data-theme="dark"] .kf-leagues-page .kf-header-dashboard,
html[data-theme="dark"] .kf-leagues-page .kf-header-dashboard:hover,
html[data-theme="dark"] .kf-leagues-page .kf-secondary-button,
html[data-theme="dark"] .kf-leagues-page .kf-team-button:disabled {
  background: #10243a;
  color: #edf5ff;
  border-color: #29405b;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}

html[data-theme="dark"] .kf-leagues-page .kf-header-arrow {
  color: #ff9a3d;
}

html[data-theme="dark"] .kf-leagues-page .kf-brand-box {
  background: #ff7a00;
  color: #091321;
  box-shadow: 0 10px 26px rgba(255,122,0,.20);
}

html[data-theme="dark"] .kf-leagues-page .kf-brand-name,
html[data-theme="dark"] .kf-leagues-page .kf-brand-caption {
  color: #f5f7fb;
}
html[data-theme="dark"] .kf-leagues-page .kf-brand-name span,
html[data-theme="dark"] .kf-leagues-page .kf-leagues-footer span {
  color: #ff7a00;
}

html[data-theme="dark"] .kf-leagues-page .kf-language,
html[data-theme="dark"] .kf-leagues-page .kf-language span {
  color: #a7b5ca;
}

html[data-theme="dark"] .kf-leagues-page .kf-language select {
  background: #10243a;
  color: #f5f7fb;
  border-color: #2a3c56;
  box-shadow: none;
}
html[data-theme="dark"] .kf-leagues-page .kf-language select:focus {
  border-color: #ff7a00;
  box-shadow: 0 0 0 4px rgba(255,122,0,.10);
}
html[data-theme="dark"] .kf-leagues-page .kf-language select option {
  background: #0d1d31;
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-leagues-page .kf-leagues-hero {
  border-color: #203550;
  background:
    radial-gradient(circle at 100% 0%, rgba(0, 212, 255, .11) 0%, rgba(0,212,255,0) 35%),
    radial-gradient(circle at 0% 100%, rgba(255, 122, 0, .11) 0%, rgba(255,122,0,0) 34%),
    linear-gradient(135deg, #0d1d31 0%, #10253a 54%, #102b38 100%);
  box-shadow: 0 22px 55px rgba(0,0,0,.22);
}

html[data-theme="dark"] .kf-leagues-page .kf-orb-blue {
  background: rgba(0, 212, 255, .08);
  box-shadow: 0 0 55px rgba(0,212,255,.08);
}
html[data-theme="dark"] .kf-leagues-page .kf-orb-peach {
  background: rgba(255, 122, 0, .08);
  box-shadow: 0 0 55px rgba(255,122,0,.07);
}

html[data-theme="dark"] .kf-leagues-page .kf-eyebrow,
html[data-theme="dark"] .kf-leagues-page .kf-section-kicker,
html[data-theme="dark"] .kf-leagues-page .kf-card-kicker {
  color: #ff9a3d;
}

html[data-theme="dark"] .kf-leagues-page .kf-hero-grid h1,
html[data-theme="dark"] .kf-leagues-page .kf-section-heading h2,
html[data-theme="dark"] .kf-leagues-page .kf-identity-main h2,
html[data-theme="dark"] .kf-leagues-page .kf-feature-banner h2,
html[data-theme="dark"] .kf-leagues-page .kf-team-card h3,
html[data-theme="dark"] .kf-leagues-page .kf-mission-card h3 {
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-leagues-page .kf-hero-grid p,
html[data-theme="dark"] .kf-leagues-page .kf-section-heading p,
html[data-theme="dark"] .kf-leagues-page .kf-feature-banner p,
html[data-theme="dark"] .kf-leagues-page .kf-team-card p,
html[data-theme="dark"] .kf-leagues-page .kf-mission-card p,
html[data-theme="dark"] .kf-leagues-page .kf-team-locality,
html[data-theme="dark"] .kf-leagues-page .kf-score-sub {
  color: #9fb0c7;
}

html[data-theme="dark"] .kf-leagues-page .kf-hero-badge,
html[data-theme="dark"] .kf-leagues-page .kf-location-pill,
html[data-theme="dark"] .kf-leagues-page .kf-joined-pill,
html[data-theme="dark"] .kf-leagues-page .kf-mission-type,
html[data-theme="dark"] .kf-leagues-page .kf-team-badge {
  background: rgba(255,255,255,.045);
  color: #dbe8f7;
  border-color: #2a3e57;
}

html[data-theme="dark"] .kf-leagues-page .kf-league-identity {
  border-color: #28445a;
  background: linear-gradient(135deg, #10263a 0%, #112d3f 100%);
  box-shadow: 0 18px 44px rgba(0,0,0,.18);
}
html[data-theme="dark"] .kf-leagues-page .kf-location-pill {
  background: #142a3e;
}
html[data-theme="dark"] .kf-leagues-page .kf-your-team {
  background: #182c25;
  border-color: #315443;
}
html[data-theme="dark"] .kf-leagues-page .kf-your-team-name,
html[data-theme="dark"] .kf-leagues-page .kf-team-current {
  color: #8fe1a9;
}
html[data-theme="dark"] .kf-leagues-page .kf-joined-pill {
  background: rgba(82, 208, 123, .10);
  border-color: rgba(82,208,123,.25);
  color: #8fe1a9;
}

html[data-theme="dark"] .kf-leagues-page .kf-feature-banner {
  background: #27233a;
  border-color: #484061;
}
html[data-theme="dark"] .kf-leagues-page .kf-feature-banner h2,
html[data-theme="dark"] .kf-leagues-page .kf-feature-banner p {
  color: #eeeaff;
}

html[data-theme="dark"] .kf-leagues-page .kf-section {
  border-color: #1f3048;
  background: #0d1d31;
  box-shadow: 0 18px 46px rgba(0,0,0,.18);
}

html[data-theme="dark"] .kf-leagues-page .kf-mission-grid {
  background: transparent;
}

html[data-theme="dark"] .kf-leagues-page .kf-team-card,
html[data-theme="dark"] .kf-leagues-page .kf-mission-card,
html[data-theme="dark"] .kf-leagues-page .kf-scoreboard {
  color: #dbe7f5;
  box-shadow: 0 14px 34px rgba(0,0,0,.16);
}

html[data-theme="dark"] .kf-leagues-page .kf-team-card:nth-child(3n + 1) {
  background: linear-gradient(145deg, #10263a 0%, #122b42 100%);
  border-color: #2a4965;
}
html[data-theme="dark"] .kf-leagues-page .kf-team-card:nth-child(3n + 2) {
  background: linear-gradient(145deg, #30251b 0%, #35291d 100%);
  border-color: #5b442b;
}
html[data-theme="dark"] .kf-leagues-page .kf-team-card:nth-child(3n) {
  background: linear-gradient(145deg, #182c25 0%, #1b332a 100%);
  border-color: #315443;
}
html[data-theme="dark"] .kf-leagues-page .kf-team-active {
  box-shadow: 0 0 0 1px rgba(255,122,0,.24), 0 16px 38px rgba(0,0,0,.20);
}

html[data-theme="dark"] .kf-leagues-page .kf-team-badge {
  background: rgba(255,255,255,.055);
}

html[data-theme="dark"] .kf-leagues-page .kf-team-button {
  background: #ff7a00;
  color: #081321;
  border-color: #ff7a00;
  box-shadow: 0 10px 26px rgba(255,122,0,.16);
}
html[data-theme="dark"] .kf-leagues-page .kf-team-button:hover {
  background: #ff8c2b;
}

html[data-theme="dark"] .kf-leagues-page .kf-scoreboard {
  background: #0b192a;
  border-color: #223852;
}
html[data-theme="dark"] .kf-leagues-page .kf-score-head {
  background: #13263b;
  color: #93a7c1;
  border-color: #263d57;
}
html[data-theme="dark"] .kf-leagues-page .kf-score-row {
  border-color: #223852;
  background: #0d1d31;
}
html[data-theme="dark"] .kf-leagues-page .kf-score-row:nth-child(odd) {
  background: #10263a;
}
html[data-theme="dark"] .kf-leagues-page .kf-score-active {
  background: #182c25 !important;
}
html[data-theme="dark"] .kf-leagues-page .kf-rank,
html[data-theme="dark"] .kf-leagues-page .kf-score-team,
html[data-theme="dark"] .kf-leagues-page .kf-score-value {
  color: #edf4fb;
}
html[data-theme="dark"] .kf-leagues-page .kf-score-value {
  color: #ffb06b;
}

html[data-theme="dark"] .kf-leagues-page .kf-mission-card {
  border-color: #2a4059;
}
html[data-theme="dark"] .kf-leagues-page .kf-mission-card:nth-child(3n + 1) {
  background: linear-gradient(145deg, #10263a 0%, #122b42 100%);
  border-color: #2b4b67;
}
html[data-theme="dark"] .kf-leagues-page .kf-mission-card:nth-child(3n + 2) {
  background: linear-gradient(145deg, #30251b 0%, #35291d 100%);
  border-color: #5d452d;
}
html[data-theme="dark"] .kf-leagues-page .kf-mission-card:nth-child(3n) {
  background: linear-gradient(145deg, #182c25 0%, #1a3329 100%);
  border-color: #315443;
}
html[data-theme="dark"] .kf-leagues-page .kf-mission-card:hover {
  box-shadow: 0 20px 40px rgba(0,0,0,.24);
}
html[data-theme="dark"] .kf-leagues-page .kf-mission-points {
  color: #ffb06b;
}

html[data-theme="dark"] .kf-leagues-page .kf-orange-button,
html[data-theme="dark"] .kf-leagues-page .kf-primary-button,
html[data-theme="dark"] .kf-leagues-page .kf-primary-button-inline {
  background: #ff7a00;
  color: #081321;
  border-color: #ff7a00;
  box-shadow: 0 10px 28px rgba(255,122,0,.16);
}
html[data-theme="dark"] .kf-leagues-page .kf-orange-button:hover,
html[data-theme="dark"] .kf-leagues-page .kf-primary-button:hover,
html[data-theme="dark"] .kf-leagues-page .kf-primary-button-inline:hover {
  background: #ff8d32;
}

html[data-theme="dark"] .kf-leagues-page .kf-empty {
  background: #10243a;
  border-color: #29415d;
  color: #a8b7ca;
}

html[data-theme="dark"] .kf-leagues-page .kf-alert-error {
  background: #321f27;
  border-color: #643642;
  color: #ffb9c7;
}
html[data-theme="dark"] .kf-leagues-page .kf-alert-success {
  background: #182c25;
  border-color: #315443;
  color: #99e6ae;
}

html[data-theme="dark"] .kf-leagues-page .kf-leagues-footer {
  color: #71839b;
}
html[data-theme="dark"] .kf-leagues-page .kf-leagues-footer span {
  color: #ff7a00;
}

html[data-theme="dark"] .kf-leagues-page .kf-loading-card,
html[data-theme="dark"] .kf-leagues-page .kf-error-card {
  background: #0d1d31;
  border-color: #263a54;
  color: #dbe7f5;
  box-shadow: 0 24px 60px rgba(0,0,0,.28);
}
html[data-theme="dark"] .kf-leagues-page .kf-loading-card p,
html[data-theme="dark"] .kf-leagues-page .kf-error-card p {
  color: #94a7bf;
}
html[data-theme="dark"] .kf-leagues-page .kf-wordmark {
  color: #f5f7fb;
}
html[data-theme="dark"] .kf-leagues-page .kf-wordmark span {
  color: #ff7a00;
}
html[data-theme="dark"] .kf-leagues-page .kf-loading-bar {
  background: #ff7a00;
}

@media (max-width: 700px) {
  html[data-theme="dark"] .kf-leagues-page .kf-leagues-hero {
    background:
      radial-gradient(circle at 100% 0%, rgba(0,212,255,.10), transparent 42%),
      radial-gradient(circle at 0% 100%, rgba(255,122,0,.10), transparent 42%),
      #0d1d31;
  }
}

      `}</style>
    </main>
  );
}
