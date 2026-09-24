"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type League = {
  id: string;
  name: string;
  league_type: string;
  city: string | null;
  state: string | null;
  description: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

type Team = {
  id: string;
  league_id: string;
  team_name: string;
  team_key: string;
  team_type: string;
  locality_name: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
};

type Mission = {
  id: string;
  title: string;
  description: string;
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

export default function LeaguesPage() {
  const supabase = createClient();

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
        setError(
          "Please sign in to join a Civic League."
        );
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
            "id,name,league_type,city,state,description,starts_at,ends_at"
          )
          .eq("id", PILOT_LEAGUE_ID)
          .eq("is_active", true)
          .maybeSingle(),

        supabase
          .from("civic_league_teams")
          .select(
            "id,league_id,team_name,team_key,team_type,locality_name,city,state,description"
          )
          .eq("league_id", PILOT_LEAGUE_ID)
          .eq("is_active", true)
          .order("team_name"),

        supabase
          .from("civic_missions")
          .select(
            "id,title,description,mission_type,points,starts_at,ends_at,verification_required"
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
        `Unable to load the Civic League: ${message}`
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
        `Unable to join this team: ${message}`
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
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-70">
            Loading Civic League...
          </p>
        </div>
      </main>
    );
  }

  if (error && !league) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-2xl font-bold">
              Civic Leagues
            </h1>

            <p className="mt-2 text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* Header */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider opacity-60">
            KarmaFacie
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Civic Leagues
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 opacity-75">
            Turn civic participation into a real-world
            team experience. Join a local team, complete
            missions, and build measurable civic impact.
          </p>
        </section>

        {/* League */}
        {league && (
          <section className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  {league.league_type} league
                </div>

                <h2 className="mt-2 text-3xl font-bold">
                  {league.name}
                </h2>

                <p className="mt-2 max-w-2xl opacity-70">
                  {league.description ||
                    "A pilot civic participation league on KarmaFacie."}
                </p>

                {(league.city ||
                  league.state) && (
                  <p className="mt-4 text-sm font-medium opacity-60">
                    {[league.city, league.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              {membership && (
                <div className="rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-4">
                  <div className="text-xs uppercase tracking-wider opacity-50">
                    Your team
                  </div>

                  <div className="mt-1 text-lg font-bold">
                    {teams.find(
                      (team) =>
                        team.id ===
                        membership.team_id
                    )?.team_name ||
                      "Joined"}
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* Error */}
        {error && league && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Teams */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Choose your team
            </h2>

            <p className="mt-1 text-sm opacity-65">
              Every participant contributes to a
              team scoreboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {teams.map((team) => {
              const isMyTeam =
                membership?.team_id ===
                team.id;

              return (
                <div
                  key={team.id}
                  className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                    {team.team_type}
                  </div>

                  <h3 className="mt-2 text-xl font-bold">
                    {team.team_name}
                  </h3>

                  {team.locality_name && (
                    <p className="mt-2 text-sm opacity-65">
                      {team.locality_name}
                    </p>
                  )}

                  {team.description && (
                    <p className="mt-3 text-sm leading-6 opacity-70">
                      {team.description}
                    </p>
                  )}

                  {isMyTeam ? (
                    <div className="mt-5 rounded-xl bg-black/5 px-4 py-3 text-center text-sm font-semibold">
                      ✓ Your team
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        joinTeam(team.id)
                      }
                      disabled={
                        joiningTeamId !==
                          null ||
                        membership !== null
                      }
                      className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        background:
                          "var(--kf-orange)",
                      }}
                    >
                      {joiningTeamId === team.id
                        ? "Joining..."
                        : membership
                        ? "Already in a team"
                        : "Join team"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Scoreboard */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Civic-Sense Scoreboard
            </h2>

            <p className="mt-1 text-sm opacity-65">
              Team standings based on verified civic
              contributions.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">

            <div className="hidden grid-cols-[80px_1fr_160px_160px_140px] gap-4 border-b border-black/10 bg-black/[0.03] px-6 py-4 text-xs font-semibold uppercase tracking-wider opacity-55 md:grid">
              <div>Rank</div>
              <div>Team</div>
              <div className="text-right">
                Karma Credits
              </div>
              <div className="text-right">
                Verified Missions
              </div>
              <div className="text-right">
                Members
              </div>
            </div>

            {scoreboard.length === 0 ? (
              <div className="p-8 text-center text-sm opacity-60">
                No scoreboard data available yet.
              </div>
            ) : (
              <div>
                {scoreboard.map(
                  (team, index) => {
                    const isMyTeam =
                      membership?.team_id ===
                      team.team_id;

                    return (
                      <div
                        key={team.team_id}
                        className={`grid gap-4 border-b border-black/10 px-6 py-5 last:border-b-0 md:grid-cols-[80px_1fr_160px_160px_140px] md:items-center ${
                          isMyTeam
                            ? "bg-black/[0.03]"
                            : ""
                        }`}
                      >
                        <div className="text-xl font-bold">
                          #{index + 1}
                        </div>

                        <div>
                          <div className="font-bold">
                            {team.team_name}
                          </div>

                          <div className="mt-1 text-xs capitalize opacity-50">
                            {team.team_type}
                            {team.locality_name
                              ? ` · ${team.locality_name}`
                              : ""}
                          </div>
                        </div>

                        <div className="flex justify-between md:block md:text-right">
                          <span className="text-xs opacity-50 md:hidden">
                            Karma Credits
                          </span>

                          <span className="font-bold">
                            {team.total_karma_credits}
                          </span>
                        </div>

                        <div className="flex justify-between md:block md:text-right">
                          <span className="text-xs opacity-50 md:hidden">
                            Verified Missions
                          </span>

                          <span className="font-semibold">
                            {team.verified_missions}
                          </span>
                        </div>

                        <div className="flex justify-between md:block md:text-right">
                          <span className="text-xs opacity-50 md:hidden">
                            Members
                          </span>

                          <span className="font-semibold">
                            {team.active_members}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

          </div>
        </section>

        {/* Missions */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Active Civic Missions
            </h2>

            <p className="mt-1 text-sm opacity-65">
              Complete real-world actions and
              submit evidence for verification.
            </p>
          </div>

          {missions.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm opacity-70">
              No active missions right now.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {missions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/leagues/missions/${mission.id}`}
                  className="block rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                        {mission.mission_type.replaceAll(
                          "_",
                          " "
                        )}
                      </div>

                      <h3 className="mt-2 text-xl font-bold">
                        {mission.title}
                      </h3>
                    </div>

                    <div
                      className="shrink-0 rounded-full px-4 py-2 text-sm font-bold"
                      style={{
                        background:
                          "var(--kf-orange-soft)",
                      }}
                    >
                      +{mission.points} points
                    </div>

                  </div>

                  <p className="mt-4 text-sm leading-6 opacity-70">
                    {mission.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs opacity-55">
                    <span>
                      {mission.verification_required
                        ? "Evidence verification required"
                        : "No verification required"}
                    </span>

                    <span>
                      Ends{" "}
                      {new Date(
                        mission.ends_at
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}