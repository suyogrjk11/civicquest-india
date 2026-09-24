export type SubmissionMode =
  | "DIRECT_LINK"
  | "ASSISTED_SUBMISSION"
  | "API"
  | "PHONE"
  | "EMAIL";

export type SubmissionAdapterPackage = {
  adapter?: {
    adapter_key?: string | null;
    submission_mode?: SubmissionMode | string | null;
    provider_name?: string | null;
    authority_directory_id?: number | null;
  };
  authority?: {
    grievance_url?: string | null;
    official_source_url?: string | null;
  };
};

export type SubmissionAdapterDecision = {
  success: false;
  status:
    | "MANUAL_REQUIRED"
    | "API_NOT_CONFIGURED";
  message: string;
  officialUrl: string | null;
  externalSubmission: false;
};

/**
 * Central decision point for government submission adapters.
 *
 * This does not bypass CAPTCHA, scrape government portals,
 * or pretend an undocumented API exists. A future authorized
 * API implementation can be added here without changing the
 * citizen-facing complaint workflow.
 */
export function decideSubmissionRoute(
  pkg: SubmissionAdapterPackage
): SubmissionAdapterDecision {
  const adapterKey =
    pkg.adapter?.adapter_key ?? null;

  const submissionMode =
    pkg.adapter?.submission_mode ?? null;

  const officialUrl =
    pkg.authority?.grievance_url ?? null;

  if (
    adapterKey === "CSMC_SAMADHAAN" &&
    submissionMode === "DIRECT_LINK"
  ) {
    return {
      success: false,
      status: "MANUAL_REQUIRED",
      message:
        "KarmaFacie has prepared and confirmed the complaint, but the current CSMC route requires submission through the official complaint system.",
      officialUrl,
      externalSubmission: false,
    };
  }

  if (submissionMode === "API") {
    return {
      success: false,
      status: "API_NOT_CONFIGURED",
      message:
        "An authorized API integration has not yet been configured for this authority.",
      officialUrl: null,
      externalSubmission: false,
    };
  }

  return {
    success: false,
    status: "MANUAL_REQUIRED",
    message:
      "This authority currently requires a manual or assisted submission workflow.",
    officialUrl,
    externalSubmission: false,
  };
}
