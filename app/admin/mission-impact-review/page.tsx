"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Impact = {
  id: string;
  completion_id: string;
  user_id: string;
  league_id: string | null;
  team_id: string | null;
  impact_type: string;
  before_photo_path: string | null;
  after_photo_path: string | null;
  before_note: string | null;
  after_note: string | null;
  impact_summary: string | null;
  status: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_note: string | null;
  created_at: string;
};

type Completion = {
  id: string;
  mission_id: string;
  user_id: string;
  team_id: string | null;
  status: string;
};

type Mission = {
  id: string;
  title: string;
  mission_type: string;
  points: number;
};

type Team = {
  id: string;
  team_name: string;
};

export default function MissionImpactReviewPage() {
  const supabase = createClient();

  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [completions, setCompletions] =
    useState<Record<string, Completion>>({});
  const [missions, setMissions] =
    useState<Record<string, Mission>>({});
  const [teams, setTeams] =
    useState<Record<string, Team>>({});

  const [photoUrls, setPhotoUrls] =
    useState<
      Record<
        string,
        {
          before?: string;
          after?: string;
        }
      >
    >({});

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadImpacts() {
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
        throw new Error("Please sign in.");
      }

      // Verify active admin
      const {
        data: adminRecord,
        error: adminError,
      } = await supabase
        .from("civicquest_admins")
        .select("user_id,is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!adminRecord) {
        throw new Error(
          "Administrator access required."
        );
      }

      // Load pending impact records
      const {
        data: impactData,
        error: impactError,
      } = await supabase
        .from("civic_mission_impacts")
        .select(
          "id,completion_id,user_id,league_id,team_id,impact_type,before_photo_path,after_photo_path,before_note,after_note,impact_summary,status,reviewed_at,reviewed_by,review_note,created_at"
        )
        .eq("status", "submitted")
        .order("created_at", {
          ascending: true,
        });

      if (impactError) {
        throw impactError;
      }

      const rows = (impactData ?? []) as Impact[];

      setImpacts(rows);

      if (rows.length === 0) {
        setCompletions({});
        setMissions({});
        setTeams({});
        setPhotoUrls({});
        return;
      }

      // Completion IDs
      const completionIds = [
        ...new Set(
          rows.map(
            (impact) => impact.completion_id
          )
        ),
      ];

      // Team IDs
      const teamIds = [
        ...new Set(
          rows
            .map((impact) => impact.team_id)
            .filter(
              (teamId): teamId is string =>
                Boolean(teamId)
            )
        ),
      ];

      // Load linked mission completions
      const {
        data: completionData,
        error: completionLoadError,
      } = await supabase
        .from("civic_mission_completions")
        .select(
          "id,mission_id,user_id,team_id,status"
        )
        .in("id", completionIds);

      if (completionLoadError) {
        throw completionLoadError;
      }

      const completionMap: Record<
        string,
        Completion
      > = {};

      for (const completion of completionData ?? []) {
        completionMap[completion.id] =
          completion as Completion;
      }

      setCompletions(completionMap);

      // Mission IDs
      const missionIds = [
        ...new Set(
          (completionData ?? []).map(
            (completion) =>
              completion.mission_id
          )
        ),
      ];

      const [missionResult, teamResult] =
        await Promise.all([
          supabase
            .from("civic_missions")
            .select(
              "id,title,mission_type,points"
            )
            .in("id", missionIds),

          teamIds.length > 0
            ? supabase
                .from("civic_league_teams")
                .select(
                  "id,team_name"
                )
                .in("id", teamIds)
            : Promise.resolve({
                data: [],
                error: null,
              }),
        ]);

      if (missionResult.error) {
        throw missionResult.error;
      }

      if (teamResult.error) {
        throw teamResult.error;
      }

      const missionMap: Record<
        string,
        Mission
      > = {};

      for (const mission of missionResult.data ?? []) {
        missionMap[mission.id] =
          mission as Mission;
      }

      const teamMap: Record<
        string,
        Team
      > = {};

      for (const team of teamResult.data ?? []) {
        teamMap[team.id] =
          team as Team;
      }

      setMissions(missionMap);
      setTeams(teamMap);

      // Generate temporary signed URLs
      const photoResults = await Promise.all(
        rows.map(async (impact) => {
          const result: {
            completionId: string;
            before?: string;
            after?: string;
          } = {
            completionId: impact.id,
          };

          if (impact.before_photo_path) {
            const {
              data: beforeData,
              error: beforeError,
            } = await supabase.storage
              .from(
                "civic-mission-evidence"
              )
              .createSignedUrl(
                impact.before_photo_path,
                60 * 15
              );

            if (
              !beforeError &&
              beforeData?.signedUrl
            ) {
              result.before =
                beforeData.signedUrl;
            }
          }

          if (impact.after_photo_path) {
            const {
              data: afterData,
              error: afterError,
            } = await supabase.storage
              .from(
                "civic-mission-evidence"
              )
              .createSignedUrl(
                impact.after_photo_path,
                60 * 15
              );

            if (
              !afterError &&
              afterData?.signedUrl
            ) {
              result.after =
                afterData.signedUrl;
            }
          }

          return result;
        })
      );

      const photoMap: Record<
        string,
        {
          before?: string;
          after?: string;
        }
      > = {};

      for (const result of photoResults) {
        photoMap[result.completionId] = {
          before: result.before,
          after: result.after,
        };
      }

      setPhotoUrls(photoMap);
    } catch (err) {
      console.error(
        "Mission impact review load error:",
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

  async function reviewImpact(
    impactId: string,
    decision: "verified" | "rejected"
  ) {
    try {
      setReviewingId(impactId);
      setError("");
      setSuccess("");

      const reviewNote =
        decision === "verified"
          ? "Before and after impact evidence reviewed and verified by KrutBharat admin."
          : "Before and after impact evidence did not meet verification requirements.";

      const {
        error: rpcError,
      } = await supabase.rpc(
        "review_civic_mission_impact",
        {
          p_impact_id: impactId,
          p_decision: decision,
          p_review_note: reviewNote,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(
        decision === "verified"
          ? "Impact verified successfully."
          : "Impact submission rejected."
      );

      await loadImpacts();
    } catch (err) {
      console.error(
        "Mission impact review error:",
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
    loadImpacts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-70">
            Loading impact reviews...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider opacity-60">
            KrutBharat Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Impact Review
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70">
            Review Before → After evidence submitted by citizens
            after completing civic missions.
          </p>
        </section>

        {/* Alerts */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Summary */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
            Pending impact reviews
          </div>

          <div className="mt-1 text-3xl font-bold">
            {impacts.length}
          </div>
        </section>

        {/* Empty */}
        {impacts.length === 0 && (
          <section className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              No pending impact submissions
            </h2>

            <p className="mt-2 text-sm opacity-60">
              New Before → After impact records will appear here.
            </p>
          </section>
        )}

        {/* Impact reviews */}
        <section className="space-y-6">
          {impacts.map((impact) => {
            const completion =
              completions[impact.completion_id];

            const mission = completion
              ? missions[completion.mission_id]
              : undefined;

            const team = impact.team_id
              ? teams[impact.team_id]
              : null;

            const photos =
              photoUrls[impact.id];

            const isReviewing =
              reviewingId === impact.id;

            return (
              <article
                key={impact.id}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8"
              >

                {/* Header */}
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Before → After
                    </div>

                    <h2 className="mt-2 text-2xl font-bold">
                      {mission?.title ||
                        "Civic Mission"}
                    </h2>

                    {mission && (
                      <p className="mt-1 text-sm capitalize opacity-60">
                        {mission.mission_type.replaceAll(
                          "_",
                          " "
                        )}
                      </p>
                    )}

                    <p className="mt-3 text-sm opacity-60">
                      Citizen ID:{" "}
                      {impact.user_id}
                    </p>

                    {team && (
                      <p className="mt-1 text-sm opacity-60">
                        Team: {team.team_name}
                      </p>
                    )}
                  </div>

                  {mission && (
                    <div
                      className="shrink-0 rounded-2xl px-5 py-4 text-center"
                      style={{
                        background:
                          "var(--kf-orange-soft)",
                      }}
                    >
                      <div className="text-2xl font-bold">
                        +{mission.points}
                      </div>

                      <div className="text-xs font-semibold opacity-60">
                        MISSION POINTS
                      </div>
                    </div>
                  )}

                </div>

                {/* Impact summary */}
                <div className="mt-7 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                    Impact summary
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                    {impact.impact_summary ||
                      "No impact summary provided."}
                  </p>
                </div>

                {/* Before / After photos */}
                <div className="mt-6 grid gap-5 md:grid-cols-2">

                  {/* Before */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Before
                    </div>

                    {photos?.before ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                        <img
                          src={photos.before}
                          alt="Before impact evidence"
                          className="max-h-[500px] w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                        Before photo unavailable.
                      </div>
                    )}

                    <p className="mt-4 text-sm leading-6 opacity-70">
                      {impact.before_note ||
                        "No before note provided."}
                    </p>

                  </div>

                  {/* After */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      After
                    </div>

                    {photos?.after ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                        <img
                          src={photos.after}
                          alt="After impact evidence"
                          className="max-h-[500px] w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                        After photo unavailable.
                      </div>
                    )}

                    <p className="mt-4 text-sm leading-6 opacity-70">
                      {impact.after_note ||
                        "No after note provided."}
                    </p>

                  </div>

                </div>

                {/* Metadata */}
                <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                  <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                    Submission details
                  </div>

                  <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">

                    <div>
                      <div className="text-xs opacity-50">
                        Submitted
                      </div>

                      <div className="mt-1 font-semibold">
                        {new Date(
                          impact.created_at
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs opacity-50">
                        Impact type
                      </div>

                      <div className="mt-1 font-semibold capitalize">
                        {impact.impact_type.replaceAll(
                          "_",
                          " "
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs opacity-50">
                        Status
                      </div>

                      <div className="mt-1 font-semibold capitalize">
                        {impact.status.replaceAll(
                          "_",
                          " "
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() =>
                      reviewImpact(
                        impact.id,
                        "verified"
                      )
                    }
                    disabled={isReviewing}
                    className="rounded-xl px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background:
                        "var(--kf-orange)",
                    }}
                  >
                    {isReviewing
                      ? "Processing..."
                      : "Verify impact"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      reviewImpact(
                        impact.id,
                        "rejected"
                      )
                    }
                    disabled={isReviewing}
                    className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject impact
                  </button>

                </div>

              </article>
            );
          })}
        </section>

      </div>
    </main>
  );
}