"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Completion = {
  id: string;
  mission_id: string;
  user_id: string;
  league_id: string | null;
  team_id: string | null;
  status: string;
  evidence: Record<string, unknown>;
  latitude: number | null;
  longitude: number | null;
  evidence_photo_path: string | null;
  notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_note: string | null;
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

export default function MissionReviewPage() {
  const supabase = createClient();

  const [completions, setCompletions] = useState<Completion[]>([]);
  const [missions, setMissions] =
    useState<Record<string, Mission>>({});
  const [teams, setTeams] =
    useState<Record<string, Team>>({});
  const [photoUrls, setPhotoUrls] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadSubmissions() {
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
      const { data: adminRecord, error: adminError } =
        await supabase
          .from("civicquest_admins")
          .select("user_id,is_active")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!adminRecord) {
        throw new Error("Administrator access required.");
      }

      // Load pending mission submissions
      const {
        data: completionData,
        error: completionError,
      } = await supabase
        .from("civic_mission_completions")
        .select(
          "id,mission_id,user_id,league_id,team_id,status,evidence,latitude,longitude,evidence_photo_path,notes,submitted_at,reviewed_at,reviewed_by,review_note"
        )
        .in("status", ["submitted", "under_review"])
        .order("submitted_at", { ascending: true });

      if (completionError) {
        throw completionError;
      }

      const rows = (completionData ?? []) as Completion[];

      setCompletions(rows);

      // Nothing pending
      if (rows.length === 0) {
        setMissions({});
        setTeams({});
        setPhotoUrls({});
        return;
      }

      // Collect mission IDs
      const missionIds = [
        ...new Set(
          rows.map((row) => row.mission_id)
        ),
      ];

      // Collect team IDs
      const teamIds = [
        ...new Set(
          rows
            .map((row) => row.team_id)
            .filter(
              (teamId): teamId is string =>
                Boolean(teamId)
            )
        ),
      ];

      // Load mission + team data
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
                .select("id,team_name")
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

      const missionMap: Record<string, Mission> = {};

      for (const mission of missionResult.data ?? []) {
        missionMap[mission.id] =
          mission as Mission;
      }

      const teamMap: Record<string, Team> = {};

      for (const team of teamResult.data ?? []) {
        teamMap[team.id] = team as Team;
      }

      setMissions(missionMap);
      setTeams(teamMap);

      // Create temporary signed URLs for private evidence photos
      const photoEntries = await Promise.all(
        rows
          .filter(
            (row) =>
              Boolean(row.evidence_photo_path)
          )
          .map(async (row) => {
            const path =
              row.evidence_photo_path!;

            const { data, error } =
              await supabase.storage
                .from("civic-mission-evidence")
                .createSignedUrl(path, 60 * 15);

            if (error || !data?.signedUrl) {
              console.error(
                "Unable to create signed photo URL:",
                row.id,
                error
              );

              return null;
            }

            return {
              completionId: row.id,
              signedUrl: data.signedUrl,
            };
          })
      );

      const photoMap: Record<string, string> = {};

      for (const entry of photoEntries) {
        if (entry) {
          photoMap[entry.completionId] =
            entry.signedUrl;
        }
      }

      setPhotoUrls(photoMap);
    } catch (err) {
      console.error(
        "Mission review load error:",
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

  async function reviewSubmission(
    completionId: string,
    decision: "verified" | "rejected"
  ) {
    try {
      setReviewingId(completionId);
      setError("");
      setSuccess("");

      const note =
        decision === "verified"
          ? "Evidence reviewed and verified by KrutBharat admin."
          : "Evidence did not meet the verification requirements.";

      const { error: rpcError } =
        await supabase.rpc(
          "review_civic_mission_completion",
          {
            p_completion_id: completionId,
            p_decision: decision,
            p_review_note: note,
          }
        );

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(
        decision === "verified"
          ? "Mission verified. Points have been awarded."
          : "Mission submission rejected."
      );

      await loadSubmissions();
    } catch (err) {
      console.error(
        "Mission review error:",
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
    loadSubmissions();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-70">
            Loading mission reviews...
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
            Mission Review
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70">
            Review citizen mission submissions before civic
            points are awarded.
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
            Pending review
          </div>

          <div className="mt-1 text-3xl font-bold">
            {completions.length}
          </div>
        </section>

        {/* Empty */}
        {completions.length === 0 && (
          <section className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              No pending submissions
            </h2>

            <p className="mt-2 text-sm opacity-60">
              New citizen mission submissions will appear here.
            </p>
          </section>
        )}

        {/* Submissions */}
        <section className="space-y-5">
          {completions.map((completion) => {
            const mission =
              missions[completion.mission_id];

            const team = completion.team_id
              ? teams[completion.team_id]
              : null;

            const photoUrl =
              photoUrls[completion.id];

            const isReviewing =
              reviewingId === completion.id;

            return (
              <article
                key={completion.id}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8"
              >
                {/* Submission header */}
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      {mission?.mission_type?.replaceAll(
                        "_",
                        " "
                      ) || "Mission"}
                    </div>

                    <h2 className="mt-2 text-2xl font-bold">
                      {mission?.title ||
                        "Unknown Mission"}
                    </h2>

                    <p className="mt-2 text-sm opacity-60">
                      Citizen ID:{" "}
                      {completion.user_id}
                    </p>

                    {team && (
                      <p className="mt-1 text-sm opacity-60">
                        Team: {team.team_name}
                      </p>
                    )}
                  </div>

                  <div
                    className="shrink-0 rounded-2xl px-5 py-4 text-center"
                    style={{
                      background:
                        "var(--kf-orange-soft)",
                    }}
                  >
                    <div className="text-2xl font-bold">
                      +{mission?.points ?? 0}
                    </div>

                    <div className="text-xs font-semibold opacity-60">
                      POINTS
                    </div>
                  </div>

                </div>

                {/* Evidence area */}
                <div className="mt-7 grid gap-5 lg:grid-cols-2">

                  {/* Notes */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Citizen submission
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                      {completion.notes ||
                        "No notes provided."}
                    </p>

                    <p className="mt-4 text-xs opacity-50">
                      Submitted:{" "}
                      {new Date(
                        completion.submitted_at
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Location evidence
                    </div>

                    {completion.latitude !== null &&
                    completion.longitude !== null ? (
                      <div className="mt-3">
                        <p className="text-sm font-semibold">
                          ✓ Location captured
                        </p>

                        <p className="mt-2 text-xs opacity-50">
                          Latitude:{" "}
                          {completion.latitude}
                        </p>

                        <p className="text-xs opacity-50">
                          Longitude:{" "}
                          {completion.longitude}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm opacity-60">
                        No location submitted.
                      </p>
                    )}
                  </div>

                </div>

                {/* Photo evidence */}
                <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                    Photo evidence
                  </div>

                  {photoUrl ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                      <img
                        src={photoUrl}
                        alt="Citizen mission evidence"
                        className="max-h-[520px] w-full object-contain"
                      />
                    </div>
                  ) : completion.evidence_photo_path ? (
                    <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      Photo was uploaded, but a temporary preview
                      could not be generated.
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-black/10 px-4 py-3 text-sm opacity-60">
                      No photo evidence uploaded.
                    </div>
                  )}
                </div>

                {/* Evidence metadata */}
                <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                    Evidence metadata
                  </div>

                  <pre className="mt-3 overflow-x-auto text-xs leading-5 opacity-70">
                    {JSON.stringify(
                      completion.evidence,
                      null,
                      2
                    )}
                  </pre>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      reviewSubmission(
                        completion.id,
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
                      : `Verify +${mission?.points ?? 0} points`}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      reviewSubmission(
                        completion.id,
                        "rejected"
                      )
                    }
                    disabled={isReviewing}
                    className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Reject submission
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