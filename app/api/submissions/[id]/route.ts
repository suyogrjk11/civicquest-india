import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  decideSubmissionRoute,
  type SubmissionAdapterPackage,
} from "@/lib/submissions/adapters";

export async function POST(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await params;
    const submissionId = Number(id);

    if (!Number.isInteger(submissionId)) {
      return NextResponse.json(
        { error: "Invalid submission ID." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const {
      data: adapterPackage,
      error: adapterError,
    } = await supabase.rpc(
      "get_civic_issue_submission_adapter_package",
      {
        p_submission_id: submissionId,
      }
    );

    if (adapterError) {
      console.error(
        "Submission adapter error:",
        adapterError
      );

      return NextResponse.json(
        {
          error:
            adapterError.message ||
            "Unable to prepare submission adapter.",
        },
        { status: 400 }
      );
    }

    if (!adapterPackage) {
      return NextResponse.json(
        {
          error:
            "Submission adapter returned no package.",
        },
        { status: 500 }
      );
    }

    const decision = decideSubmissionRoute(
      adapterPackage as SubmissionAdapterPackage
    );

    if (decision.status === "MANUAL_REQUIRED") {
      return NextResponse.json(
        {
          success: false,
          status: decision.status,
          submission_id: submissionId,
          message: decision.message,
          official_url: decision.officialUrl,
          adapter_ready: Boolean(
            adapterPackage?.adapter?.adapter_key
          ),
          external_submission:
            decision.externalSubmission,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        status: decision.status,
        submission_id: submissionId,
        message: decision.message,
        official_url: decision.officialUrl,
        adapter_ready: Boolean(
          adapterPackage?.adapter?.adapter_key
        ),
        external_submission:
          decision.externalSubmission,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error(
      "Submission gateway error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unexpected submission gateway error.",
      },
      { status: 500 }
    );
  }
}