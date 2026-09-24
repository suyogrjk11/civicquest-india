"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CivicIssue = {
  id: string;
  category: string;
  title: string | null;
  description: string | null;
  location_text: string | null;
  photo_path: string | null;
  status: string;
  authority_name: string | null;
  reported_city: string | null;
  reported_state: string | null;
  reported_at: string | null;
  community_key: string | null;
};

type IssueWithPhoto = CivicIssue & {
  photo_url: string | null;
  related_count: number;
};

const filters = ["all", "reported", "under_review", "in_progress", "resolved"];

export default function CommunityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [issues, setIssues] = useState<IssueWithPhoto[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ totalReports: 0, activeReports: 0, resolvedReports: 0 });

  useEffect(() => {
    void loadIssues();
  }, []);

  async function loadIssues() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error: issueError } = await supabase
        .from("community_issues")
        .select(`
          id,
          category,
          title,
          description,
          location_text,
          photo_path,
          status,
          authority_name,
          reported_city,
          reported_state,
          reported_at,
          community_key,
          created_at,
          updated_at
        `)
        .order("reported_at", { ascending: false });

      if (issueError) throw new Error(issueError.message);

      const raw = data || [];

      setStats({
        totalReports: raw.length,
        activeReports: raw.filter((item) => item.status !== "resolved").length,
        resolvedReports: raw.filter((item) => item.status === "resolved").length,
      });

      const photoCache = new Map<string, string | null>();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const withPhotos: IssueWithPhoto[] = [];

      for (const issue of raw) {
        let photoUrl: string | null = null;

        if (issue.photo_path && accessToken) {
          if (photoCache.has(issue.id)) {
            photoUrl = photoCache.get(issue.id) ?? null;
          } else {
            try {
              const response = await fetch(
                `/api/community/photo?id=${encodeURIComponent(issue.id)}`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                  cache: "no-store",
                }
              );
              const result = await response.json();
              photoUrl = response.ok ? result.photo_url ?? null : null;
            } catch {
              photoUrl = null;
            }
            photoCache.set(issue.id, photoUrl);
          }
        }

        withPhotos.push({
          ...issue,
          photo_url: photoUrl,
          related_count: 1,
        });
      }

      // Proper community grouping uses the database-generated community_key.
      // If the migration has not been run yet, fall back safely to the existing
      // exact-match grouping so the page keeps working.
      const groups = new Map<string, number>();

      for (const issue of raw) {
        const fallbackKey = [
          issue.category,
          issue.title?.trim().toLowerCase(),
          issue.reported_city?.trim().toLowerCase(),
          issue.location_text?.trim().toLowerCase(),
        ].join("|");

        const key = issue.community_key || fallbackKey;
        groups.set(key, (groups.get(key) || 0) + 1);
      }

      // Show one public card per community issue group, using the newest report
      // as the representative record. This prevents duplicate cards when many
      // citizens report the same problem.
      const grouped = new Map<string, IssueWithPhoto>();

      for (const issue of withPhotos) {
        const fallbackKey = [
          issue.category,
          issue.title?.trim().toLowerCase(),
          issue.reported_city?.trim().toLowerCase(),
          issue.location_text?.trim().toLowerCase(),
        ].join("|");

        const key = issue.community_key || fallbackKey;
        const current = grouped.get(key);

        if (!current) {
          grouped.set(key, {
            ...issue,
            related_count: groups.get(key) || 1,
          });
        }
      }

      setIssues(Array.from(grouped.values()));
    } catch (err) {
      console.error("Community loading error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load community issues."
      );
    } finally {
      setLoading(false);
    }
  }

  const visibleIssues = useMemo(() => {
    if (filter === "all") return issues;
    return issues.filter((issue) => issue.status === filter);
  }, [issues, filter]);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={{ marginBottom: 30 }}>
          <button onClick={() => router.push("/dashboard")} style={backButton}>
            ← Dashboard
          </button>

          <div style={eyebrow}>KARMAFACIE COMMUNITY</div>
          <h1 style={title}>Community Issues</h1>
          <p style={subtitle}>
            Discover civic problems reported by citizens and see what is
            happening in your community.
          </p>
        </header>

        <section style={noticeStyle}>
          <strong>Public civic feed</strong>
          <span>
            Citizen identities are not displayed. Information shown here comes
            from KarmaFacie civic issue records.
          </span>
        </section>

        <section style={statsGridStyle}>
          <StatCard icon="📋" label="Total Reports" value={stats.totalReports} />
          <StatCard icon="👥" label="Community Issues" value={issues.length} />
          <StatCard icon="🔧" label="Active Reports" value={stats.activeReports} />
          <StatCard icon="✅" label="Resolved Reports" value={stats.resolvedReports} />
        </section>

        <div style={filterRow}>
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              style={{
                ...filterButton,
                ...(filter === item ? activeFilterButton : {}),
              }}
            >
              {item === "all"
                ? "All"
                : item.replaceAll("_", " ").replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
            </button>
          ))}
        </div>

        {loading && <div style={emptyCard}>Loading community issues...</div>}

        {!loading && error && (
          <div style={errorCard}>
            <strong>Unable to load Community</strong>
            <p>{error}</p>
            <button onClick={() => void loadIssues()} style={primaryButton}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && visibleIssues.length === 0 && (
          <div style={emptyCard}>
            <div style={{ fontSize: 42 }}>🏙️</div>
            <h2>No civic issues found</h2>
            <p>Reported community issues will appear here.</p>
          </div>
        )}

        <section style={gridStyle}>
          {!loading &&
            !error &&
            visibleIssues.map((issue) => (
              <article key={issue.id} style={cardStyle}>
                {issue.photo_url ? (
                  <img
                    src={issue.photo_url}
                    alt="Civic issue evidence"
                    style={imageStyle}
                  />
                ) : (
                  <div style={imagePlaceholder}>📍</div>
                )}

                <div style={{ padding: 20 }}>
                  <div style={topRow}>
                    <span style={categoryBadge}>{issue.category}</span>
                    <span style={statusBadge(issue.status)}>
                      {issue.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <h2 style={cardTitle}>
                    {issue.title || "Civic issue reported"}
                  </h2>

                  <p style={description}>
                    {issue.description || "No description provided."}
                  </p>

                  <div style={meta}>
                    <div>📍 {issue.location_text || "Location not provided"}</div>
                    {issue.reported_city && (
                      <div>
                        🏙️ {issue.reported_city}
                        {issue.reported_state ? `, ${issue.reported_state}` : ""}
                      </div>
                    )}
                    {issue.authority_name && (
                      <div>🏛️ {issue.authority_name}</div>
                    )}
                  </div>

                  <div style={impactRow}>
                    <span>
                      👥 {issue.related_count}{" "}
                      {issue.related_count === 1 ? "report" : "reports"}
                    </span>

                    <button
                      onClick={() => router.push(`/community/${issue.id}`)}
                      style={viewButton}
                    >
                      View Issue →
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: 25 }}>{icon}</div>
      <div>
        <div style={statValueStyle}>{value}</div>
        <div style={statLabelStyle}>{label}</div>
      </div>
    </div>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
  margin: "18px 0 24px",
};

const statCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "16px 18px",
  background: "#0f172a",
  border: "1px solid #243244",
  borderRadius: 16,
};

const statValueStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: "#ffffff",
};

const statLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 2,
};

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #18222e 0%, #0b0f14 45%, #070a0d 100%)",
  color: "white",
  padding: "42px 20px 70px",
};

const containerStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const backButton = {
  background: "transparent",
  border: 0,
  color: "#94a3b8",
  cursor: "pointer",
  padding: 0,
  marginBottom: 24,
  fontSize: 15,
};

const eyebrow = {
  color: "#ff7a00",
  fontWeight: 800,
  letterSpacing: "1.5px",
  fontSize: 13,
};

const title = {
  fontSize: "clamp(34px, 5vw, 52px)",
  margin: "8px 0 10px",
};

const subtitle = {
  color: "#94a3b8",
  maxWidth: 720,
  lineHeight: 1.7,
  margin: 0,
};

const noticeStyle = {
  display: "flex",
  gap: 12,
  flexDirection: "column" as const,
  padding: 18,
  marginBottom: 22,
  borderRadius: 16,
  background: "rgba(255,122,0,0.07)",
  border: "1px solid rgba(255,122,0,0.18)",
  color: "#cbd5e1",
  lineHeight: 1.5,
};

const filterRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
  marginBottom: 24,
};

const filterButton = {
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#cbd5e1",
  borderRadius: 999,
  padding: "10px 15px",
  cursor: "pointer",
};

const activeFilterButton = {
  background: "#ff7a00",
  border: "1px solid #ff7a00",
  color: "#111827",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
  gap: 20,
};

const cardStyle = {
  overflow: "hidden",
  borderRadius: 20,
  background: "#0f172a",
  border: "1px solid #1e293b",
};

const imageStyle = {
  width: "100%",
  height: 210,
  objectFit: "cover" as const,
  display: "block",
};

const imagePlaceholder = {
  height: 210,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#111827",
  fontSize: 50,
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  flexWrap: "wrap" as const,
};

const categoryBadge = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#172033",
  color: "#cbd5e1",
  fontSize: 12,
};

function statusBadge(status: string) {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background:
      status === "resolved"
        ? "rgba(34,197,94,0.15)"
        : status === "in_progress"
          ? "rgba(59,130,246,0.15)"
          : "rgba(255,122,0,0.12)",
    color:
      status === "resolved"
        ? "#86efac"
        : status === "in_progress"
          ? "#93c5fd"
          : "#fdba74",
    fontSize: 12,
    textTransform: "capitalize" as const,
  };
}

const cardTitle = {
  fontSize: 21,
  margin: "17px 0 8px",
};

const description = {
  color: "#94a3b8",
  lineHeight: 1.6,
  minHeight: 52,
};

const meta = {
  display: "grid",
  gap: 7,
  color: "#cbd5e1",
  fontSize: 13,
  marginTop: 15,
};

const impactRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 20,
  paddingTop: 16,
  borderTop: "1px solid #1e293b",
};

const viewButton = {
  border: 0,
  background: "#ff7a00",
  color: "#111827",
  fontWeight: 800,
  borderRadius: 10,
  padding: "10px 13px",
  cursor: "pointer",
};

const primaryButton = {
  border: 0,
  background: "#ff7a00",
  color: "#111827",
  fontWeight: 800,
  borderRadius: 10,
  padding: "11px 15px",
  cursor: "pointer",
};

const emptyCard = {
  textAlign: "center" as const,
  padding: "70px 20px",
  borderRadius: 20,
  background: "#0f172a",
  border: "1px solid #1e293b",
  color: "#94a3b8",
};

const errorCard = {
  padding: 24,
  borderRadius: 20,
  background: "#0f172a",
  border: "1px solid rgba(248,113,113,0.3)",
  color: "#cbd5e1",
};
