"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PeerSubmission = {
  completion_id: string;
  mission_id: string;
  mission_title: string;
  mission_type: string;
  points: number;
  team_id: string | null;
  team_name: string | null;
  submitted_at: string;
  notes: string | null;
  evidence_photo_path: string | null;
  has_location: boolean;
  confirm_count: number;
  reject_count: number;
};

const PILOT_LEAGUE_ID =
  "0a22e94a-26ab-419a-bd40-6db3a7f996ff";

export default function PeerReviewPage() {
  const supabase = createClient();

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

      const rows = (data ?? []) as PeerSubmission[];

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
      <main className="min-h-screen px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-70">
            Loading community verification...
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
            KarmaFacie
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Community Verification
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 opacity-70">
            Help strengthen trust in civic participation by
            reviewing evidence from other members of your league.
            Your confirmation is a trust signal, not an automatic
            award of Karma Credits.
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
            Available for review
          </div>

          <div className="mt-1 text-3xl font-bold">
            {submissions.length}
          </div>
        </section>

        {/* Empty */}
        {submissions.length === 0 && (
          <section className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              No community reviews available
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 opacity-60">
              New eligible mission submissions from other league
              members will appear here.
            </p>
          </section>
        )}

        {/* Queue */}
        <section className="space-y-6">
          {submissions.map((submission) => {
            const photoUrl =
              photoUrls[submission.completion_id];

            const isReviewing =
              reviewingId ===
              submission.completion_id;

            return (
              <article
                key={submission.completion_id}
                className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm"
              >

                {/* Top */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                        {submission.mission_type.replaceAll(
                          "_",
                          " "
                        )}
                      </div>

                      <h2 className="mt-2 text-2xl font-bold">
                        {submission.mission_title}
                      </h2>

                      {submission.team_name && (
                        <p className="mt-2 text-sm opacity-60">
                          Team:{" "}
                          {submission.team_name}
                        </p>
                      )}

                      <p className="mt-1 text-xs opacity-50">
                        Submitted{" "}
                        {new Date(
                          submission.submitted_at
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div
                      className="shrink-0 rounded-2xl px-5 py-4 text-center"
                      style={{
                        background:
                          "var(--kf-orange-soft)",
                      }}
                    >
                      <div className="text-2xl font-bold">
                        +{submission.points}
                      </div>

                      <div className="text-xs font-semibold opacity-60">
                        MISSION POINTS
                      </div>
                    </div>

                  </div>

                  {/* Evidence */}
                  <div className="mt-7 grid gap-5 md:grid-cols-2">

                    {/* Photo */}
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                        Evidence photo
                      </div>

                      {photoUrl ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                          <img
                            src={photoUrl}
                            alt="Civic mission evidence"
                            className="max-h-[500px] w-full object-contain"
                          />
                        </div>
                      ) : submission.evidence_photo_path ? (
                        <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                          Evidence photo could not be
                          loaded for preview.
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-black/10 px-4 py-3 text-sm opacity-60">
                          No photo evidence supplied.
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                      <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                        Citizen's description
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                        {submission.notes ||
                          "No description provided."}
                      </p>

                      <div className="mt-6 border-t border-black/10 pt-5">
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                          Location evidence
                        </div>

                        <p className="mt-2 text-sm">
                          {submission.has_location
                            ? "✓ Location evidence captured"
                            : "No location evidence"}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Existing community signal */}
                  <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                    <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                      Community signals
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl bg-white px-4 py-4">
                        <div className="text-xs opacity-50">
                          Confirmations
                        </div>

                        <div className="mt-1 text-2xl font-bold">
                          {submission.confirm_count}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-4">
                        <div className="text-xs opacity-50">
                          Rejections
                        </div>

                        <div className="mt-1 text-2xl font-bold">
                          {submission.reject_count}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-7">

                    <p className="mb-4 text-xs leading-5 opacity-55">
                      Review the evidence fairly. Community
                      verification contributes to trust signals;
                      final Karma Credit decisions remain under
                      the KarmaFacie verification process.
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          submitPeerVerification(
                            submission.completion_id,
                            "confirm"
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
                          : "Confirm evidence"}
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
                        className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject evidence
                      </button>

                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </section>

      </div>
    </main>
  );
}