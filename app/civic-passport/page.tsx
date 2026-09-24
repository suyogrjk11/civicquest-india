"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Passport = {
  user_id: string;
  total_karma_credits: number;
  missions_submitted: number;
  missions_verified: number;
  missions_rejected: number;
  current_league_id: string | null;
  current_league_name: string | null;
  current_team_id: string | null;
  current_team_name: string | null;
  current_team_type: string | null;
};

export default function CivicPassportPage() {
  const supabase = createClient();

  const [passport, setPassport] =
    useState<Passport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPassport() {
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
        throw new Error(
          "Please sign in to view your Civic Passport."
        );
      }

      const { data, error: passportError } =
        await supabase.rpc(
          "get_my_civic_passport"
        );

      if (passportError) {
        throw passportError;
      }

      const row = Array.isArray(data)
        ? data[0]
        : data;

      if (!row) {
        throw new Error(
          "Civic Passport data could not be loaded."
        );
      }

      setPassport(row as Passport);
    } catch (err) {
      console.error(
        "Civic Passport load error:",
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

  useEffect(() => {
    loadPassport();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-70">
            Loading Civic Passport...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-6 py-12 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider opacity-50">
              KarmaFacie
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Civic Passport
            </h1>

            <p className="mt-3 text-red-700">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!passport) {
    return null;
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
            Civic Passport
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 opacity-70">
            Your verified record of civic participation,
            contribution and community action.
          </p>
        </section>

        {/* Karma credits */}
        <section
          className="rounded-3xl p-7 shadow-sm md:p-9"
          style={{
            background: "var(--kf-orange-soft)",
          }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Karma Credits
          </div>

          <div className="mt-2 text-6xl font-bold tracking-tight">
            {passport.total_karma_credits}
          </div>

          <p className="mt-3 text-sm opacity-65">
            Credits earned from verified civic actions.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
              Missions submitted
            </div>

            <div className="mt-2 text-3xl font-bold">
              {passport.missions_submitted}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
              Missions verified
            </div>

            <div className="mt-2 text-3xl font-bold">
              {passport.missions_verified}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
              Missions rejected
            </div>

            <div className="mt-2 text-3xl font-bold">
              {passport.missions_rejected}
            </div>
          </div>

        </section>

        {/* League */}
        <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm md:p-9">

          <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
            Current League
          </div>

          <h2 className="mt-2 text-2xl font-bold">
            {passport.current_league_name ||
              "No active league"}
          </h2>

          {passport.current_team_name && (
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-50">
                Current Team
              </div>

              <div className="mt-2 text-xl font-bold">
                {passport.current_team_name}
              </div>

              {passport.current_team_type && (
                <div className="mt-1 text-sm capitalize opacity-60">
                  {passport.current_team_type}
                </div>
              )}
            </div>
          )}

        </section>

        {/* Civic journey */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Your Civic Journey
            </h2>

            <p className="mt-1 text-sm opacity-60">
              Participation becomes part of your Civic Passport.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold">
                01
              </div>

              <h3 className="mt-3 font-bold">
                Learn
              </h3>

              <p className="mt-1 text-sm opacity-60">
                Build civic knowledge.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold">
                02
              </div>

              <h3 className="mt-3 font-bold">
                Act
              </h3>

              <p className="mt-1 text-sm opacity-60">
                Take part in real-world missions.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold">
                03
              </div>

              <h3 className="mt-3 font-bold">
                Verify
              </h3>

              <p className="mt-1 text-sm opacity-60">
                Build a trusted participation record.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-sm font-bold">
                04
              </div>

              <h3 className="mt-3 font-bold">
                Earn
              </h3>

              <p className="mt-1 text-sm opacity-60">
                Receive Karma Credits for verified action.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}