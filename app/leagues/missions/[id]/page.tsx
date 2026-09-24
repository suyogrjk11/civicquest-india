"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mission = {
  id: string;
  title: string;
  description: string;
  mission_type: string;
  points: number;
  starts_at: string;
  ends_at: string;
  verification_required: boolean;
  max_completions_per_user: number | null;
  metadata: {
    evidence_type?: string;
    requires_location?: boolean;
  } | null;
};

type Submission = {
  id: string;
  status: string;
  submitted_at: string;
  evidence_photo_path: string | null;
  notes: string | null;
  latitude: number | null;
  longitude: number | null;
};

type Impact = {
  id: string;
  completion_id: string;
  impact_type: string;
  before_photo_path: string | null;
  after_photo_path: string | null;
  before_note: string | null;
  after_note: string | null;
  impact_summary: string | null;
  status: string;
  created_at: string;
};

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const missionId = params.id as string;

  const [mission, setMission] =
    useState<Mission | null>(null);

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [impact, setImpact] =
    useState<Impact | null>(null);

  const [notes, setNotes] = useState("");
  const [photo, setPhoto] =
    useState<File | null>(null);

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [beforePhoto, setBeforePhoto] =
    useState<File | null>(null);

  const [afterPhoto, setAfterPhoto] =
    useState<File | null>(null);

  const [beforeNote, setBeforeNote] =
    useState("");

  const [afterNote, setAfterNote] =
    useState("");

  const [impactSummary, setImpactSummary] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submittingImpact, setSubmittingImpact] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [impactError, setImpactError] =
    useState("");

  const [impactSuccess, setImpactSuccess] =
    useState("");

  async function loadMission() {
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
          "Please sign in to participate in this mission."
        );
        return;
      }

      const {
        data: missionData,
        error: missionError,
      } = await supabase
        .from("civic_missions")
        .select(
          "id,title,description,mission_type,points,starts_at,ends_at,verification_required,max_completions_per_user,metadata"
        )
        .eq("id", missionId)
        .eq("is_active", true)
        .maybeSingle();

      if (missionError) {
        throw missionError;
      }

      if (!missionData) {
        setError(
          "This mission could not be found."
        );
        return;
      }

      setMission(missionData as Mission);

      const {
        data: submissionData,
        error: submissionError,
      } = await supabase
        .from("civic_mission_completions")
        .select(
          "id,status,submitted_at,evidence_photo_path,notes,latitude,longitude"
        )
        .eq("mission_id", missionId)
        .eq("user_id", user.id)
        .neq("status", "cancelled")
        .order("submitted_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (submissionError) {
        throw submissionError;
      }

      const currentSubmission =
        submissionData as Submission | null;

      setSubmission(currentSubmission);

      /*
       * Load an existing Before/After Impact record
       * for this mission completion.
       */
      if (currentSubmission) {
        const {
          data: impactData,
          error: impactLoadError,
        } = await supabase
          .from("civic_mission_impacts")
          .select(
            "id,completion_id,impact_type,before_photo_path,after_photo_path,before_note,after_note,impact_summary,status,created_at"
          )
          .eq(
            "completion_id",
            currentSubmission.id
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (impactLoadError) {
          throw impactLoadError;
        }

        setImpact(
          impactData as Impact | null
        );
      } else {
        setImpact(null);
      }
    } catch (err) {
      console.error(
        "Mission load error:",
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
        `Unable to load this mission: ${message}`
      );
    } finally {
      setLoading(false);
    }
  }

  function validateImage(
    file: File
  ) {
    if (!file.type.startsWith("image/")) {
      throw new Error(
        "Please select an image file."
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        "Each image must be smaller than 10 MB."
      );
    }
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setPhoto(null);
      return;
    }

    try {
      validateImage(selectedFile);
      setError("");
      setPhoto(selectedFile);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(message);
      event.target.value = "";
    }
  }

  function handleBeforePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setBeforePhoto(null);
      return;
    }

    try {
      validateImage(selectedFile);
      setImpactError("");
      setBeforePhoto(selectedFile);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setImpactError(message);
      event.target.value = "";
    }
  }

  function handleAfterPhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setAfterPhoto(null);
      return;
    }

    try {
      validateImage(selectedFile);
      setImpactError("");
      setAfterPhoto(selectedFile);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setImpactError(message);
      event.target.value = "";
    }
  }

  function getLocation() {
    setError("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);

      setError(
        "Location services are not supported by this browser."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        setLocationLoading(false);
      },
      (locationError) => {
        console.error(
          "Location error:",
          locationError
        );

        setLocationLoading(false);

        setError(
          "Unable to get your location. Please allow location access and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  async function submitMission(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!mission) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Please sign in before submitting a mission."
        );
      }

      if (
        mission.metadata?.requires_location
      ) {
        if (
          latitude === null ||
          longitude === null
        ) {
          throw new Error(
            "Please capture your location before submitting."
          );
        }
      }

      if (
        mission.metadata?.evidence_type &&
        !photo
      ) {
        throw new Error(
          "Please upload the required evidence photo."
        );
      }

      let evidencePhotoPath:
        | string
        | null = null;

      if (photo) {
        const safeName = photo.name
          .toLowerCase()
          .replace(
            /[^a-z0-9.-]+/g,
            "-"
          );

        const filePath =
          `${user.id}/${mission.id}/${Date.now()}-${safeName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(
            "civic-mission-evidence"
          )
          .upload(
            filePath,
            photo,
            {
              cacheControl: "3600",
              upsert: false,
              contentType: photo.type,
            }
          );

        if (uploadError) {
          throw uploadError;
        }

        evidencePhotoPath =
          filePath;
      }

      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "submit_civic_mission",
        {
          p_mission_id: mission.id,
          p_evidence: {
            evidence_type:
              mission.metadata
                ?.evidence_type ??
              "photo",

            submitted_from:
              "karmafacie_web",
          },
          p_latitude: latitude,
          p_longitude: longitude,
          p_evidence_photo_path:
            evidencePhotoPath,
          p_notes:
            notes.trim() || null,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      const createdSubmission =
        data as Submission;

      setSubmission(
        createdSubmission
      );

      setSuccess(
        "Mission submitted successfully. Your evidence is now awaiting verification."
      );

      setNotes("");
      setPhoto(null);
    } catch (err) {
      console.error(
        "Mission submission error:",
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
        `Unable to submit mission: ${message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitImpact(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!submission) {
      setImpactError(
        "Submit the mission first."
      );
      return;
    }

    if (!beforePhoto) {
      setImpactError(
        "Please upload the before photo."
      );
      return;
    }

    if (!afterPhoto) {
      setImpactError(
        "Please upload the after photo."
      );
      return;
    }

    try {
      setSubmittingImpact(true);
      setImpactError("");
      setImpactSuccess("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Please sign in before submitting impact evidence."
        );
      }

      const beforeSafeName =
        beforePhoto.name
          .toLowerCase()
          .replace(
            /[^a-z0-9.-]+/g,
            "-"
          );

      const afterSafeName =
        afterPhoto.name
          .toLowerCase()
          .replace(
            /[^a-z0-9.-]+/g,
            "-"
          );

      const timestamp =
        Date.now();

      const beforePath =
        `${user.id}/${missionId}/before/${timestamp}-${beforeSafeName}`;

      const afterPath =
        `${user.id}/${missionId}/after/${timestamp}-${afterSafeName}`;

      const {
        error: beforeUploadError,
      } = await supabase.storage
        .from(
          "civic-mission-evidence"
        )
        .upload(
          beforePath,
          beforePhoto,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              beforePhoto.type,
          }
        );

      if (beforeUploadError) {
        throw beforeUploadError;
      }

      const {
        error: afterUploadError,
      } = await supabase.storage
        .from(
          "civic-mission-evidence"
        )
        .upload(
          afterPath,
          afterPhoto,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              afterPhoto.type,
          }
        );

      if (afterUploadError) {
        throw afterUploadError;
      }

      const {
        data,
        error: impactRpcError,
      } = await supabase.rpc(
        "submit_civic_mission_impact",
        {
          p_completion_id:
            submission.id,

          p_impact_type:
            "before_after",

          p_before_photo_path:
            beforePath,

          p_after_photo_path:
            afterPath,

          p_before_note:
            beforeNote.trim() ||
            null,

          p_after_note:
            afterNote.trim() ||
            null,

          p_impact_summary:
            impactSummary.trim() ||
            null,
        }
      );

      if (impactRpcError) {
        throw impactRpcError;
      }

      setImpact(
        data as Impact
      );

      setImpactSuccess(
        "Before → After impact submitted successfully."
      );

      setBeforePhoto(null);
      setAfterPhoto(null);
      setBeforeNote("");
      setAfterNote("");
      setImpactSummary("");
    } catch (err) {
      console.error(
        "Impact submission error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
            err !== null
          ? JSON.stringify(err)
          : String(err);

      setImpactError(
        `Unable to submit impact: ${message}`
      );
    } finally {
      setSubmittingImpact(false);
    }
  }

  useEffect(() => {
    loadMission();
  }, [missionId]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm opacity-70">
            Loading mission...
          </p>
        </div>
      </main>
    );
  }

  if (error && !mission) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-2xl font-bold">
              Civic Mission
            </h1>

            <p className="mt-2 text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!mission) {
    return null;
  }

  const alreadySubmitted =
    submission &&
    [
      "submitted",
      "under_review",
      "verified",
    ].includes(
      submission.status
    );

  const isBeforeAfterMission =
    mission.metadata
      ?.evidence_type ===
    "before_after";

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            router.push("/leagues")
          }
          className="text-sm font-semibold opacity-60 hover:opacity-100"
        >
          ← Back to Civic Leagues
        </button>

        {/* Mission header */}
        <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:p-9">

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                {mission.mission_type.replaceAll(
                  "_",
                  " "
                )}
              </div>

              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {mission.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 opacity-70">
                {mission.description}
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
                +{mission.points}
              </div>

              <div className="text-xs font-semibold opacity-60">
                POINTS
              </div>
            </div>

          </div>

          <div className="mt-7 grid gap-3 border-t border-black/10 pt-6 md:grid-cols-3">

            <div>
              <div className="text-xs uppercase tracking-wider opacity-45">
                Verification
              </div>

              <div className="mt-1 font-semibold">
                {mission.verification_required
                  ? "Required"
                  : "Not required"}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider opacity-45">
                Evidence
              </div>

              <div className="mt-1 font-semibold">
                {isBeforeAfterMission
                  ? "Before → After"
                  : mission.metadata
                      ?.evidence_type ||
                    "Photo"}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider opacity-45">
                Ends
              </div>

              <div className="mt-1 font-semibold">
                {new Date(
                  mission.ends_at
                ).toLocaleDateString(
                  "en-IN"
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Existing mission submission */}
        {alreadySubmitted && (
          <section className="rounded-2xl border border-black/10 bg-black/[0.03] p-6">

            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
              Your submission
            </div>

            <div className="mt-2 text-xl font-bold capitalize">
              {submission.status.replaceAll(
                "_",
                " "
              )}
            </div>

            <p className="mt-2 text-sm opacity-65">
              Submitted{" "}
              {new Date(
                submission.submitted_at
              ).toLocaleString("en-IN")}
            </p>

            {submission.status ===
              "verified" && (
              <p className="mt-4 text-sm font-semibold">
                ✓ Your mission has been verified.
              </p>
            )}

            {submission.status !==
              "verified" && (
              <p className="mt-4 text-sm opacity-70">
                Your evidence is awaiting verification.
                Points are awarded only after verification.
              </p>
            )}

          </section>
        )}

        {/* Mission submission */}
        {!alreadySubmitted && (
          <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:p-9">

            <div className="mb-7">
              <h2 className="text-2xl font-bold">
                Complete this mission
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-65">
                Submit genuine evidence from your real-world
                civic activity. Your submission will be reviewed
                before points are awarded.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form
              onSubmit={submitMission}
              className="space-y-6"
            >

              {/* Photo */}
              <div>
                <label
                  htmlFor="mission-photo"
                  className="block text-sm font-semibold"
                >
                  Evidence photo
                </label>

                <p className="mt-1 text-xs opacity-55">
                  Upload a clear photo showing your mission activity.
                  Maximum size: 10 MB.
                </p>

                <input
                  id="mission-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="mt-3 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  required
                />

                {photo && (
                  <p className="mt-2 text-xs opacity-60">
                    Selected: {photo.name}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <div className="text-sm font-semibold">
                  Location
                </div>

                <p className="mt-1 text-xs opacity-55">
                  Your location helps verify that the action
                  happened where submitted.
                </p>

                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="mt-3 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {locationLoading
                    ? "Getting location..."
                    : latitude !== null
                    ? "✓ Location captured"
                    : "Capture my location"}
                </button>

                {latitude !== null &&
                  longitude !== null && (
                    <p className="mt-2 text-xs opacity-55">
                      Location captured successfully.
                    </p>
                  )}
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="mission-notes"
                  className="block text-sm font-semibold"
                >
                  What did you do?
                </label>

                <textarea
                  id="mission-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="Briefly describe the civic action you completed..."
                  rows={5}
                  className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl px-5 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background:
                    "var(--kf-orange)",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit mission for verification"}
              </button>

            </form>
          </section>
        )}

        {/* Before / After Impact */}
        {isBeforeAfterMission &&
          submission &&
          !impact && (
            <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:p-9">

              <div className="mb-7">
                <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  Impact record
                </div>

                <h2 className="mt-2 text-2xl font-bold">
                  Show the change
                </h2>

                <p className="mt-2 text-sm leading-6 opacity-65">
                  Capture the same place before and after your
                  civic action. This creates a longitudinal impact
                  record rather than just a claim of participation.
                </p>
              </div>

              {impactError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {impactError}
                </div>
              )}

              {impactSuccess && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {impactSuccess}
                </div>
              )}

              <form
                onSubmit={submitImpact}
                className="space-y-7"
              >

                {/* Before */}
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                  <h3 className="text-lg font-bold">
                    Before
                  </h3>

                  <p className="mt-1 text-xs opacity-55">
                    Capture the condition before your action.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={
                      handleBeforePhotoChange
                    }
                    className="mt-4 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                    required
                  />

                  {beforePhoto && (
                    <p className="mt-2 text-xs opacity-60">
                      Selected: {beforePhoto.name}
                    </p>
                  )}

                  <textarea
                    value={beforeNote}
                    onChange={(event) =>
                      setBeforeNote(
                        event.target.value
                      )
                    }
                    placeholder="Describe the condition before..."
                    rows={3}
                    className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />

                </div>

                {/* After */}
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">

                  <h3 className="text-lg font-bold">
                    After
                  </h3>

                  <p className="mt-1 text-xs opacity-55">
                    Capture the same place after your action.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={
                      handleAfterPhotoChange
                    }
                    className="mt-4 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                    required
                  />

                  {afterPhoto && (
                    <p className="mt-2 text-xs opacity-60">
                      Selected: {afterPhoto.name}
                    </p>
                  )}

                  <textarea
                    value={afterNote}
                    onChange={(event) =>
                      setAfterNote(
                        event.target.value
                      )
                    }
                    placeholder="Describe the condition after..."
                    rows={3}
                    className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />

                </div>

                {/* Summary */}
                <div>
                  <label
                    htmlFor="impact-summary"
                    className="block text-sm font-semibold"
                  >
                    Impact summary
                  </label>

                  <textarea
                    id="impact-summary"
                    value={impactSummary}
                    onChange={(event) =>
                      setImpactSummary(
                        event.target.value
                      )
                    }
                    placeholder="What changed because of this action?"
                    rows={4}
                    className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingImpact}
                  className="w-full rounded-xl px-5 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background:
                      "var(--kf-orange)",
                  }}
                >
                  {submittingImpact
                    ? "Submitting impact..."
                    : "Submit Before → After impact"}
                </button>

              </form>
            </section>
          )}

        {/* Existing Impact */}
        {impact && (
          <section className="rounded-3xl border border-black/10 bg-black/[0.03] p-7 md:p-9">

            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
              Impact record
            </div>

            <h2 className="mt-2 text-2xl font-bold">
              Before → After recorded
            </h2>

            <div className="mt-4 inline-flex rounded-full bg-black/5 px-4 py-2 text-sm font-semibold capitalize">
              {impact.status.replaceAll(
                "_",
                " "
              )}
            </div>

            {impact.impact_summary && (
              <p className="mt-5 text-sm leading-7 opacity-70">
                {impact.impact_summary}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  Before
                </div>

                <p className="mt-2 text-sm opacity-65">
                  {impact.before_note ||
                    "Before condition recorded."}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                  After
                </div>

                <p className="mt-2 text-sm opacity-65">
                  {impact.after_note ||
                    "After condition recorded."}
                </p>
              </div>

            </div>

            <p className="mt-5 text-xs opacity-50">
              Impact submitted{" "}
              {new Date(
                impact.created_at
              ).toLocaleString("en-IN")}
            </p>

          </section>
        )}

      </div>
    </main>
  );
}