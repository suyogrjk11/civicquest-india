import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server configuration is missing." },
        { status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userError } = await admin.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 });
    }

    const issueId = request.nextUrl.searchParams.get("id");

    if (!issueId) {
      return NextResponse.json({ error: "Issue id is required" }, { status: 400 });
    }

    const { data: issue, error: issueError } = await admin
      .from("community_issues")
      .select("photo_path")
      .eq("id", issueId)
      .maybeSingle();

    if (issueError) {
      console.error("Community photo lookup error:", issueError);
      return NextResponse.json({ error: "Unable to load community photo" }, { status: 500 });
    }

    if (!issue?.photo_path) {
      return NextResponse.json({ photo_url: null });
    }

    // Never allow Community to expose follow-up or resolution evidence.
    if (
      issue.photo_path.startsWith("followups/") ||
      issue.photo_path.startsWith("resolution-checks/")
    ) {
      return NextResponse.json({ photo_url: null });
    }

    const { data: signed, error: signedError } = await admin.storage
      .from("civic-issue-photos")
      .createSignedUrl(issue.photo_path, 60 * 60);

    if (signedError || !signed?.signedUrl) {
      console.error("Community photo signing error:", signedError);
      return NextResponse.json({ photo_url: null });
    }

    return NextResponse.json({ photo_url: signed.signedUrl });
  } catch (error) {
    console.error("Community photo API error:", error);
    return NextResponse.json({ error: "Unable to load community photo" }, { status: 500 });
  }
}
