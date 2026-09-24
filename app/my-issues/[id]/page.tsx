"use client";

import { useEffect, useState } from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type CivicIssue = {
  id: string;
  category: string;
  title: string | null;
  description: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  photo_path: string | null;
  status: string;
  authority_name: string | null;
  authority_reference_id: string | null;
  reported_city: string | null;
  reported_state: string | null;
  authority_directory_id: number | null;
  reported_at: string | null;
  resolved_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CitizenProfile = {
  name: string | null;
  mobile: string | null;
  house_no: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zone: string | null;
  ward: string | null;
};

type SubmissionMode =
  | "DIRECT_LINK"
  | "ASSISTED_SUBMISSION"
  | "API"
  | "PHONE"
  | "EMAIL";

type SubmissionStatus =
  | "PREPARED"
  | "PENDING"
  | "SUBMITTED"
  | "FAILED"
  | "MANUAL_REQUIRED";

type AuthorityDirectory = {
  id: number;
  city: string;
  state: string;
  authority_name: string;
  department_name: string | null;
  sub_department_name: string | null;
  official_complaint_type: string | null;
  issue_category: string;
  grievance_url: string | null;
  official_source_url: string | null;
  submission_method: string | null;
  submission_mode: SubmissionMode | null;
  notes: string | null;
  is_active: boolean;
  verified_at: string | null;
};

type StatusHistory = {
  id: number;
  issue_id: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  actor_type:
    | "system"
    | "citizen"
    | "admin"
    | "authority";
  created_at: string;
};

type SubmissionRecord = {
  id: number;
  issue_id: string;
  authority_directory_id: number | null;
  submission_mode: SubmissionMode;
  provider_name: string | null;
  submission_status: SubmissionStatus;
  official_reference_id: string | null;
  official_reference_url: string | null;
  attempted_at: string | null;
  submitted_at: string | null;
  last_synced_at: string | null;
  error_message: string | null;
  citizen_confirmed_at: string | null;
  official_form_opened_at: string | null;
  citizen_reported_submitted_at: string | null;
  official_reference_number: string | null;
  official_submission_notes: string | null;
  submission_payload: Record<
    string,
    unknown
  > | null;
  created_at: string;
  updated_at: string;
};


type FollowUpStatus =
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED"
  | "NO_RESPONSE";

type FollowUpRecord = {
  id: number;
  issue_id: string;
  user_id: string;
  status: FollowUpStatus;
  note: string | null;
  evidence_path: string | null;
  evidence_url?: string | null;
  verification_status: "PENDING" | "VERIFIED" | "NOT_VERIFIED";
  verified_at: string | null;
  verified_by: string | null;
  verification_note: string | null;
  verification_source_url: string | null;
  created_at: string;
};

type ResolutionCheckResult =
  | "FIXED"
  | "PARTIALLY_FIXED"
  | "NOT_FIXED"
  | "RETURNED";

type ResolutionCheckRecord = {
  id: number;
  issue_id: string;
  user_id: string;
  issue_status_at_check: string;
  resolution_result: ResolutionCheckResult;
  note: string | null;
  evidence_path: string | null;
  evidence_url?: string | null;
  created_at: string;
};

type GatewayResponse = {
  success?: boolean;
  status?: string;
  message?: string;
  official_url?: string | null;
  external_submission?: boolean;
};


const uiTranslations: Record<Language, Record<string, string>> = {
  en: {
    "Loading civic issue...": "Loading civic issue...",
    "← Back to My Issues": "← Back to My Issues",
    "Unable to load issue": "Unable to load issue",
    "KARMAFACIE": "KARMAFACIE",
    "📷 Photo Evidence": "📷 Photo Evidence",
    "Issue Information": "Issue Information",
    "🏙️ Reported from:": "🏙️ Reported from:",
    "📍 Location:": "📍 Location:",
    "GPS:": "GPS:",
    "Reported:": "Reported:",
    "Complaint Journey": "Complaint Journey",
    "A combined KarmaFacie timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "A combined KarmaFacie timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.",
    "Current KarmaFacie status:": "Current KarmaFacie status:",
    "Status History": "Status History",
    "This timeline shows status changes actually recorded in KarmaFacie.": "This timeline shows status changes actually recorded in KarmaFacie.",
    "No status-history records are currently available for this issue.": "No status-history records are currently available for this issue.",
    "Recorded by": "Recorded by",
    "Status history is generated from recorded KarmaFacie status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "Status history is generated from recorded KarmaFacie status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.",
    "DIRECTORY ROUTING": "DIRECTORY ROUTING",
    "Department:": "Department:",
    "Sub-Department:": "Sub-Department:",
    "Official Complaint Type:": "Official Complaint Type:",
    "Issue type:": "Issue type:",
    "Channel:": "Channel:",
    "Open Official Complaint Channel →": "Open Official Complaint Channel →",
    "This opens the official complaint channel for the matched authority. KarmaFacie does not submit the complaint automatically through this route.": "This opens the official complaint channel for the matched authority. KarmaFacie does not submit the complaint automatically through this route.",
    "Directory information verified:": "Directory information verified:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ No verified directory route is currently attached to this report.",
    "OFFICIAL SUBMISSION": "OFFICIAL SUBMISSION",
    "📤 Review Your Complaint": "📤 Review Your Complaint",
    "KarmaFacie has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "KarmaFacie has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.",
    "Your complaint package has not been prepared yet. KarmaFacie will assemble it from the information already stored for this issue.": "Your complaint package has not been prepared yet. KarmaFacie will assemble it from the information already stored for this issue.",
    "A verified authority route is required before the submission package can be prepared.": "A verified authority route is required before the submission package can be prepared.",
    "Submission record #": "Submission record #",
    "✓ Photo evidence attached": "✓ Photo evidence attached",
    "No photo evidence attached": "No photo evidence attached",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.",
    "✓ Ready for official submission": "✓ Ready for official submission",
    "Confirmed on": "Confirmed on",
    "Next step: Submission Gateway": "Next step: Submission Gateway",
    "Your complaint package has been prepared and confirmed. KarmaFacie will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "Your complaint package has been prepared and confirmed. KarmaFacie will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.",
    "✓ Official form opened": "✓ Official form opened",
    "KarmaFacie recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KarmaFacie recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.",
    "KarmaFacie has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "KarmaFacie has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.",
    "Reference number:": "Reference number:",
    "Notes:": "Notes:",
    "Recorded on": "Recorded on",
    "Once the government form confirms your submission, enter the reference/complaint number here. KarmaFacie will store it as a citizen-provided reference; it will not be treated as an official KarmaFacie submission confirmation.": "Once the government form confirms your submission, enter the reference/complaint number here. KarmaFacie will store it as a citizen-provided reference; it will not be treated as an official KarmaFacie submission confirmation.",
    "Government Complaint / Reference Number": "Government Complaint / Reference Number",
    "Enter the number shown after successful submission": "Enter the number shown after successful submission",
    "Notes (optional)": "Notes (optional)",
    "Example: submitted on the CSMC website and received confirmation screen": "Example: submitted on the CSMC website and received confirmation screen",
    "API submission mode is configured for this authority. The actual government API call will only be enabled after an authorized integration is connected.": "API submission mode is configured for this authority. The actual government API call will only be enabled after an authorized integration is connected.",
    "✓ Official submission recorded": "✓ Official submission recorded",
    "Official reference:": "Official reference:",
    "Submitted:": "Submitted:",
    "View Official Reference →": "View Official Reference →",
    "Follow-up & Government Updates": "Follow-up & Government Updates",
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KarmaFacie later receives verifiable information from the authority.": "Record what happened after your complaint was submitted. These updates are citizen-reported unless KarmaFacie later receives verifiable information from the authority.",
    "What happened after submission?": "What happened after submission?",
    "No Response / Awaiting Update": "No Response / Awaiting Update",
    "Acknowledged": "Acknowledged",
    "In Progress": "In Progress",
    "Resolved": "Resolved",
    "Closed": "Closed",
    "Rejected": "Rejected",
    "Update note (optional)": "Update note (optional)",
    "Example: I received an SMS saying the complaint was acknowledged": "Example: I received an SMS saying the complaint was acknowledged",
    "Evidence attachment (optional)": "Evidence attachment (optional)",
    "Attach a photo or PDF that supports this update. Maximum 5 MB.": "Attach a photo or PDF that supports this update. Maximum 5 MB.",
    "Selected:": "Selected:",
    "Recorded follow-ups": "Recorded follow-ups",
    "No citizen-reported follow-up updates have been recorded yet.": "No citizen-reported follow-up updates have been recorded yet.",
    "Citizen-reported update": "Citizen-reported update",
    "This is a KarmaFacie administrative verification, not an official government confirmation.": "This is a KarmaFacie administrative verification, not an official government confirmation.",
    "Verification note:": "Verification note:",
    "🔗 Verification source →": "🔗 Verification source →",
    "📎 View attached evidence →": "📎 View attached evidence →",
    "RESOLUTION VERIFICATION": "RESOLUTION VERIFICATION",
    "Did the problem actually get fixed?": "Did the problem actually get fixed?",
    "KarmaFacie currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KarmaFacie currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.",
    "What did you observe?": "What did you observe?",
    "✅ Fixed": "✅ Fixed",
    "🟡 Partially Fixed": "🟡 Partially Fixed",
    "❌ Not Fixed": "❌ Not Fixed",
    "🔁 Problem Returned": "🔁 Problem Returned",
    "Observation note (optional)": "Observation note (optional)",
    "Describe what you observed at the location...": "Describe what you observed at the location...",
    "After-repair evidence (optional)": "After-repair evidence (optional)",
    "Upload a current photo or PDF that supports your observation. Maximum 5 MB.": "Upload a current photo or PDF that supports your observation. Maximum 5 MB.",
    "Recorded resolution checks": "Recorded resolution checks",
    "No citizen resolution checks have been recorded yet.": "No citizen resolution checks have been recorded yet.",
    "Citizen-reported resolution check": "Citizen-reported resolution check",
    "📎 View resolution evidence →": "📎 View resolution evidence →",
    "KarmaFacie stores these observations as a separate history. They do not automatically change the administrative issue status.": "KarmaFacie stores these observations as a separate history. They do not automatically change the administrative issue status.",
    "SUBMISSION ASSISTANT": "SUBMISSION ASSISTANT",
    "🧾 Your Complaint Copy Pack": "🧾 Your Complaint Copy Pack",
    "KarmaFacie has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KarmaFacie does not bypass cross-domain controls or CAPTCHA.": "KarmaFacie has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KarmaFacie does not bypass cross-domain controls or CAPTCHA.",
    "Prepared details:": "Prepared details:",
    "Citizen profile fields are loaded from KarmaFacie, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "Citizen profile fields are loaded from KarmaFacie, while the matched authority directory supplies the configured department, sub-department and official complaint type.",
    "✓ Photo evidence ready": "✓ Photo evidence ready",
    "Use the evidence image shown above when the official form asks for a photo.": "Use the evidence image shown above when the official form asks for a photo.",
    "Still required on the official form:": "Still required on the official form:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KarmaFacie does not have, enter CAPTCHA, and perform the final Submit action yourself.": "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KarmaFacie does not have, enter CAPTCHA, and perform the final Submit action yourself.",
    "Report Reference": "Report Reference",
    "Civic Issue ID:": "Civic Issue ID:",
    "Authority Directory ID:": "Authority Directory ID:",
    "Authority Reference ID:": "Authority Reference ID:",
    "Submission Record ID:": "Submission Record ID:",
    "KarmaFacie currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KarmaFacie currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.",
    "Civic Issue": "Civic Issue",
    "No description provided.": "No description provided.",
    "Location not provided.": "Location not provided.",
    "GPS coordinates not available.": "GPS coordinates not available.",
    "Person Name": "Person Name",
    "Mobile Number": "Mobile Number",
    "Email": "Email",
    "Residential Address": "Residential Address",
    "City / State": "City / State",
    "Zone": "Zone",
    "Ward": "Ward",
    "Authority": "Authority",
    "Sub-Department": "Sub-Department",
    "Subject": "Subject",
    "Complaint Description": "Complaint Description",
    "Issue Location": "Issue Location",
    "GPS Coordinates": "GPS Coordinates",
    "Evidence": "Evidence",
    "Description": "Description",
    "Submission Route": "Submission Route",
    "Not specified": "Not specified",
    "Not provided in KarmaFacie profile.": "Not provided in KarmaFacie profile.",
    "No email available from the authenticated account.": "No email available from the authenticated account.",
    "City / State not available.": "City / State not available.",
    "Not configured in authority directory.": "Not configured in authority directory.",
    "No complaint description provided.": "No complaint description provided.",
    "Loading": "Loading",
    "Reported": "Reported",
    "Under Review": "Under Review",
    "Draft": "Draft",
    "Government Authority": "Government Authority",
    "Citizen": "Citizen",
    "KarmaFacie Admin": "KarmaFacie Admin",
    "KarmaFacie System": "KarmaFacie System",
    "Unknown": "Unknown",
    "Official Website": "Official Website",
    "Assisted Submission": "Assisted Submission",
    "API Integration": "API Integration",
    "Phone": "Phone",
    "Date unavailable": "Date unavailable",
    "Fixed": "Fixed",
    "Partially Fixed": "Partially Fixed",
    "Not Fixed": "Not Fixed",
    "Problem Returned": "Problem Returned",
    "Unable to load this civic issue.": "Unable to load this civic issue.",
    "This civic issue could not be found.": "This civic issue could not be found.",
    "Unable to prepare the submission.": "Unable to prepare the submission.",
    "Submission preparation returned no data.": "Submission preparation returned no data.",
    "Unable to confirm the submission details.": "Unable to confirm the submission details.",
    "Submission confirmation returned no data.": "Submission confirmation returned no data.",
    "The submission gateway completed the request.": "The submission gateway completed the request.",
    "This authority currently requires submission through its official complaint system.": "This authority currently requires submission through its official complaint system.",
    "The submission gateway could not continue this request.": "The submission gateway could not continue this request.",
    "Unable to connect to the KarmaFacie submission gateway.": "Unable to connect to the KarmaFacie submission gateway.",
    "No confirmed submission record is available yet.": "No confirmed submission record is available yet.",
    "KarmaFacie could not save the official-form handoff. Please try again.": "KarmaFacie could not save the official-form handoff. Please try again.",
    "Please enter the complaint/reference number from the official government system.": "Please enter the complaint/reference number from the official government system.",
    "Unable to save the official complaint reference.": "Unable to save the official complaint reference.",
    "This civic issue is not available.": "This civic issue is not available.",
    "Unable to save this follow-up update.": "Unable to save this follow-up update.",
    "Unable to save this resolution check.": "Unable to save this resolution check.",
    "Resolution verification becomes available after the KarmaFacie issue is marked Resolved.": "Resolution verification becomes available after the KarmaFacie issue is marked Resolved.",
    "Please choose an image or PDF file.": "Please choose an image or PDF file.",
    "Evidence file must be 5 MB or smaller.": "Evidence file must be 5 MB or smaller.",
    "Copied ✓": "Copied ✓",
    "Copy": "Copy",
    "✓ KarmaFacie verified": "✓ KarmaFacie verified",
    "⚠ Not verified": "⚠ Not verified",
    "⏳ Verification pending": "⏳ Verification pending",
  },

  hi: {
    "Loading civic issue...": "नागरिक समस्या लोड हो रही है...",
    "← Back to My Issues": "← मेरी नागरिक समस्याओं पर वापस जाएँ",
    "Unable to load issue": "समस्या लोड नहीं हो सकी",
    "KARMAFACIE": "KARMAFACIE",
    "📷 Photo Evidence": "📷 फोटो प्रमाण",
    "Issue Information": "समस्या की जानकारी",
    "🏙️ Reported from:": "🏙️ रिपोर्ट का स्थान:",
    "📍 Location:": "📍 स्थान:",
    "GPS:": "GPS:",
    "Reported:": "रिपोर्ट की गई:",
    "Complaint Journey": "शिकायत की यात्रा",
    "A combined KarmaFacie timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "इस शिकायत के लिए KarmaFacie में दर्ज प्रमुख चरणों की संयुक्त समयरेखा। जब तक किसी सरकारी प्राधिकरण की आधिकारिक प्रतिक्रिया या संदर्भ दर्ज न हो, सरकारी कार्रवाई को पुष्टि की गई नहीं माना जाता।",
    "Current KarmaFacie status:": "वर्तमान KarmaFacie स्थिति:",
    "Status History": "स्थिति का इतिहास",
    "This timeline shows status changes actually recorded in KarmaFacie.": "यह समयरेखा KarmaFacie में वास्तव में दर्ज स्थिति परिवर्तनों को दिखाती है।",
    "No status-history records are currently available for this issue.": "इस समस्या के लिए अभी कोई स्थिति-इतिहास रिकॉर्ड उपलब्ध नहीं है।",
    "Recorded by": "दर्ज करने वाला:",
    "Status history is generated from recorded KarmaFacie status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "स्थिति का इतिहास KarmaFacie में दर्ज स्थिति घटनाओं से बनाया जाता है। जब तक किसी घटना को स्पष्ट रूप से किसी प्राधिकरण से आया हुआ दर्ज नहीं किया गया है, इससे यह नहीं माना जाता कि किसी सरकारी प्राधिकरण ने स्थिति बदली है।",
    "DIRECTORY ROUTING": "डायरेक्टरी रूटिंग",
    "Department:": "विभाग:",
    "Sub-Department:": "उप-विभाग:",
    "Official Complaint Type:": "आधिकारिक शिकायत प्रकार:",
    "Issue type:": "समस्या का प्रकार:",
    "Channel:": "माध्यम:",
    "Open Official Complaint Channel →": "आधिकारिक शिकायत माध्यम खोलें →",
    "This opens the official complaint channel for the matched authority. KarmaFacie does not submit the complaint automatically through this route.": "यह संबंधित प्राधिकरण का आधिकारिक शिकायत माध्यम खोलता है। KarmaFacie इस माध्यम से शिकायत स्वतः सबमिट नहीं करता।",
    "Directory information verified:": "डायरेक्टरी जानकारी सत्यापित:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ इस रिपोर्ट से अभी कोई सत्यापित डायरेक्टरी मार्ग जुड़ा नहीं है।",
    "OFFICIAL SUBMISSION": "आधिकारिक सबमिशन",
    "📤 Review Your Complaint": "📤 अपनी शिकायत की समीक्षा करें",
    "KarmaFacie has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "KarmaFacie ने इस रिपोर्ट के लिए आवश्यक जानकारी पहले ही एकत्र कर ली है। चयनित प्राधिकरण के लिए पुष्टि करने से पहले तैयार पैकेज की समीक्षा करें।",
    "Your complaint package has not been prepared yet. KarmaFacie will assemble it from the information already stored for this issue.": "आपका शिकायत पैकेज अभी तैयार नहीं हुआ है। KarmaFacie इस समस्या में पहले से संग्रहीत जानकारी से इसे तैयार करेगा।",
    "A verified authority route is required before the submission package can be prepared.": "सबमिशन पैकेज तैयार करने से पहले सत्यापित प्राधिकरण मार्ग आवश्यक है।",
    "Submission record #": "सबमिशन रिकॉर्ड #",
    "✓ Photo evidence attached": "✓ फोटो प्रमाण संलग्न है",
    "No photo evidence attached": "कोई फोटो प्रमाण संलग्न नहीं है",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "मैं पुष्टि करता/करती हूँ कि ऊपर दी गई शिकायत की जानकारी, स्थान और प्रमाण सही हैं और इन्हें आधिकारिक सबमिशन प्रक्रिया में उपयोग किया जा सकता है।",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "यह पुष्टि इस पैकेज के लिए आपकी स्वीकृति दर्ज करती है। इसका अर्थ यह नहीं है कि सरकारी शिकायत सबमिट हो चुकी है।",
    "✓ Ready for official submission": "✓ आधिकारिक सबमिशन के लिए तैयार",
    "Confirmed on": "पुष्टि की गई:",
    "Next step: Submission Gateway": "अगला चरण: सबमिशन गेटवे",
    "Your complaint package has been prepared and confirmed. KarmaFacie will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "आपका शिकायत पैकेज तैयार और पुष्टि किया जा चुका है। KarmaFacie अब निर्धारित प्राधिकरण सबमिशन मार्ग की जाँच करेगा। वर्तमान CSMC मार्ग के लिए गेटवे आपको आधिकारिक शिकायत प्रणाली तक ले जाएगा; यह स्वतः सरकारी सबमिशन का दावा नहीं करेगा।",
    "✓ Official form opened": "✓ आधिकारिक फॉर्म खोला गया",
    "KarmaFacie recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KarmaFacie ने इस आधिकारिक फॉर्म हैंडऑफ को आपकी शिकायत में दर्ज कर लिया है। इसका अर्थ यह नहीं है कि सरकारी शिकायत सबमिट हो गई है।",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "आधिकारिक माध्यम खोलने का अर्थ अपने आप यह नहीं है कि सरकारी शिकायत सबमिट हो गई है। कोई भी आधिकारिक सबमिशन या संदर्भ संख्या सरकारी प्रणाली से ही आनी चाहिए।",
    "KarmaFacie has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "KarmaFacie ने आपके द्वारा दी गई संदर्भ संख्या दर्ज कर ली है। यह नागरिक द्वारा दी गई जानकारी है और सरकारी प्रणाली द्वारा स्वतंत्र रूप से सत्यापित नहीं की गई है।",
    "Reference number:": "संदर्भ संख्या:",
    "Notes:": "टिप्पणियाँ:",
    "Recorded on": "दर्ज किया गया:",
    "Once the government form confirms your submission, enter the reference/complaint number here. KarmaFacie will store it as a citizen-provided reference; it will not be treated as an official KarmaFacie submission confirmation.": "जब सरकारी फॉर्म आपके सबमिशन की पुष्टि कर दे, तब यहाँ संदर्भ/शिकायत संख्या दर्ज करें। KarmaFacie इसे नागरिक द्वारा दी गई संदर्भ संख्या के रूप में संग्रहीत करेगा; इसे आधिकारिक KarmaFacie सबमिशन पुष्टि नहीं माना जाएगा।",
    "Government Complaint / Reference Number": "सरकारी शिकायत / संदर्भ संख्या",
    "Enter the number shown after successful submission": "सफल सबमिशन के बाद दिखाई गई संख्या दर्ज करें",
    "Notes (optional)": "टिप्पणियाँ (वैकल्पिक)",
    "Example: submitted on the CSMC website and received confirmation screen": "उदाहरण: CSMC वेबसाइट पर सबमिट किया और पुष्टि स्क्रीन प्राप्त हुई",
    "API submission mode is configured for this authority. The actual government API call will only be enabled after an authorized integration is connected.": "इस प्राधिकरण के लिए API सबमिशन मोड कॉन्फ़िगर है। वास्तविक सरकारी API कॉल केवल अधिकृत इंटीग्रेशन जुड़ने के बाद सक्षम होगा।",
    "✓ Official submission recorded": "✓ आधिकारिक सबमिशन दर्ज किया गया",
    "Official reference:": "आधिकारिक संदर्भ:",
    "Submitted:": "सबमिट किया गया:",
    "View Official Reference →": "आधिकारिक संदर्भ देखें →",
    "Follow-up & Government Updates": "फॉलो-अप और सरकारी अपडेट",
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KarmaFacie later receives verifiable information from the authority.": "शिकायत सबमिट होने के बाद क्या हुआ, उसे दर्ज करें। जब तक KarmaFacie को बाद में प्राधिकरण से सत्यापित जानकारी प्राप्त नहीं होती, ये अपडेट नागरिक द्वारा रिपोर्ट किए गए माने जाते हैं।",
    "What happened after submission?": "सबमिशन के बाद क्या हुआ?",
    "No Response / Awaiting Update": "कोई प्रतिक्रिया नहीं / अपडेट की प्रतीक्षा",
    "Acknowledged": "प्राप्ति की पुष्टि",
    "In Progress": "कार्य प्रगति पर",
    "Resolved": "समाधान हो गया",
    "Closed": "बंद",
    "Rejected": "अस्वीकृत",
    "Update note (optional)": "अपडेट नोट (वैकल्पिक)",
    "Example: I received an SMS saying the complaint was acknowledged": "उदाहरण: मुझे SMS मिला कि शिकायत स्वीकार कर ली गई है",
    "Evidence attachment (optional)": "प्रमाण संलग्नक (वैकल्पिक)",
    "Attach a photo or PDF that supports this update. Maximum 5 MB.": "इस अपडेट का समर्थन करने वाली फोटो या PDF संलग्न करें। अधिकतम 5 MB।",
    "Selected:": "चयनित:",
    "Recorded follow-ups": "दर्ज किए गए फॉलो-अप",
    "No citizen-reported follow-up updates have been recorded yet.": "अभी तक नागरिक द्वारा रिपोर्ट किया गया कोई फॉलो-अप अपडेट दर्ज नहीं हुआ है।",
    "Citizen-reported update": "नागरिक द्वारा रिपोर्ट किया गया अपडेट",
    "This is a KarmaFacie administrative verification, not an official government confirmation.": "यह KarmaFacie का प्रशासनिक सत्यापन है, आधिकारिक सरकारी पुष्टि नहीं।",
    "Verification note:": "सत्यापन नोट:",
    "🔗 Verification source →": "🔗 सत्यापन स्रोत →",
    "📎 View attached evidence →": "📎 संलग्न प्रमाण देखें →",
    "RESOLUTION VERIFICATION": "समाधान सत्यापन",
    "Did the problem actually get fixed?": "क्या समस्या वास्तव में ठीक हुई?",
    "KarmaFacie currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KarmaFacie में यह समस्या वर्तमान में समाधान के रूप में दर्ज है। स्वयं स्थान की जाँच करें और जो देखें उसे दर्ज करें। यह नागरिक का अवलोकन है और इससे प्रशासनिक स्थिति स्वतः नहीं बदलती।",
    "What did you observe?": "आपने क्या देखा?",
    "✅ Fixed": "✅ ठीक हुआ",
    "🟡 Partially Fixed": "🟡 आंशिक रूप से ठीक हुआ",
    "❌ Not Fixed": "❌ ठीक नहीं हुआ",
    "🔁 Problem Returned": "🔁 समस्या फिर से उत्पन्न हुई",
    "Observation note (optional)": "अवलोकन नोट (वैकल्पिक)",
    "Describe what you observed at the location...": "स्थान पर आपने जो देखा उसका विवरण दें...",
    "After-repair evidence (optional)": "मरम्मत के बाद का प्रमाण (वैकल्पिक)",
    "Upload a current photo or PDF that supports your observation. Maximum 5 MB.": "आपके अवलोकन का समर्थन करने वाली वर्तमान फोटो या PDF अपलोड करें। अधिकतम 5 MB।",
    "Recorded resolution checks": "दर्ज किए गए समाधान सत्यापन",
    "No citizen resolution checks have been recorded yet.": "अभी तक नागरिक द्वारा कोई समाधान सत्यापन दर्ज नहीं किया गया है।",
    "Citizen-reported resolution check": "नागरिक द्वारा रिपोर्ट किया गया समाधान सत्यापन",
    "📎 View resolution evidence →": "📎 समाधान प्रमाण देखें →",
    "KarmaFacie stores these observations as a separate history. They do not automatically change the administrative issue status.": "KarmaFacie इन अवलोकनों को अलग इतिहास के रूप में संग्रहीत करता है। वे प्रशासनिक समस्या की स्थिति को स्वतः नहीं बदलते।",
    "SUBMISSION ASSISTANT": "सबमिशन सहायक",
    "🧾 Your Complaint Copy Pack": "🧾 आपकी शिकायत कॉपी पैक",
    "KarmaFacie has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KarmaFacie does not bypass cross-domain controls or CAPTCHA.": "KarmaFacie ने आपकी प्रोफ़ाइल में सहेजे गए नागरिक विवरण को लोड करके शिकायत की जानकारी के साथ जोड़ा है। आधिकारिक सरकारी फॉर्म भरते समय यह कॉपी पैक तैयार रखें। KarmaFacie cross-domain नियंत्रण या CAPTCHA को बायपास नहीं करता।",
    "Prepared details:": "तैयार विवरण:",
    "Citizen profile fields are loaded from KarmaFacie, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "नागरिक प्रोफ़ाइल के फ़ील्ड KarmaFacie से लिए गए हैं, जबकि संबंधित प्राधिकरण डायरेक्टरी विभाग, उप-विभाग और आधिकारिक शिकायत प्रकार की कॉन्फ़िगर जानकारी देती है।",
    "✓ Photo evidence ready": "✓ फोटो प्रमाण तैयार है",
    "Use the evidence image shown above when the official form asks for a photo.": "जब आधिकारिक फॉर्म फोटो माँगे, ऊपर दिखाई गई प्रमाण फोटो का उपयोग करें।",
    "Still required on the official form:": "आधिकारिक फॉर्म पर अभी आवश्यक:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KarmaFacie does not have, enter CAPTCHA, and perform the final Submit action yourself.": "कॉपी किए गए नागरिक विवरण और प्राधिकरण-विशिष्ट मैपिंग की जाँच करें, KarmaFacie में उपलब्ध न होने वाले ज़ोन/वार्ड या अन्य विकल्प पूरे करें, CAPTCHA दर्ज करें और अंतिम Submit कार्रवाई स्वयं करें।",
    "Report Reference": "रिपोर्ट संदर्भ",
    "Civic Issue ID:": "नागरिक समस्या ID:",
    "Authority Directory ID:": "प्राधिकरण डायरेक्टरी ID:",
    "Authority Reference ID:": "प्राधिकरण संदर्भ ID:",
    "Submission Record ID:": "सबमिशन रिकॉर्ड ID:",
    "KarmaFacie currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KarmaFacie वर्तमान में प्रमाण, स्थान, रिपोर्ट स्थिति, स्थिति इतिहास, सबमिशन पैकेज और डायरेक्टरी-आधारित रूटिंग जानकारी दर्ज करता है। जब तक कोई आधिकारिक प्राधिकरण संदर्भ या सत्यापित सरकारी प्रतिक्रिया दर्ज न हो, यह पृष्ठ आधिकारिक सरकारी स्थिति का प्रतिनिधित्व नहीं करता।",
    "Civic Issue": "नागरिक समस्या",
    "No description provided.": "कोई विवरण उपलब्ध नहीं है।",
    "Location not provided.": "स्थान उपलब्ध नहीं है।",
    "GPS coordinates not available.": "GPS निर्देशांक उपलब्ध नहीं हैं।",
    "Person Name": "व्यक्ति का नाम",
    "Mobile Number": "मोबाइल नंबर",
    "Email": "ईमेल",
    "Residential Address": "निवास का पता",
    "City / State": "शहर / राज्य",
    "Zone": "ज़ोन",
    "Ward": "वार्ड",
    "Authority": "प्राधिकरण",
    "Sub-Department": "उप-विभाग",
    "Subject": "विषय",
    "Complaint Description": "शिकायत का विवरण",
    "Issue Location": "समस्या का स्थान",
    "GPS Coordinates": "GPS निर्देशांक",
    "Evidence": "प्रमाण",
    "Description": "विवरण",
    "Submission Route": "सबमिशन मार्ग",
    "Not specified": "निर्दिष्ट नहीं",
    "Not provided in KarmaFacie profile.": "KarmaFacie प्रोफ़ाइल में उपलब्ध नहीं है।",
    "No email available from the authenticated account.": "प्रमाणित अकाउंट से कोई ईमेल उपलब्ध नहीं है।",
    "City / State not available.": "शहर / राज्य उपलब्ध नहीं है।",
    "Not configured in authority directory.": "प्राधिकरण डायरेक्टरी में कॉन्फ़िगर नहीं है।",
    "No complaint description provided.": "शिकायत का विवरण उपलब्ध नहीं है।",
    "Loading": "लोड हो रहा है",
    "Reported": "रिपोर्ट की गई",
    "Under Review": "समीक्षा के अधीन",
    "Draft": "ड्राफ्ट",
    "Government Authority": "सरकारी प्राधिकरण",
    "Citizen": "नागरिक",
    "KarmaFacie Admin": "KarmaFacie एडमिन",
    "KarmaFacie System": "KarmaFacie सिस्टम",
    "Unknown": "अज्ञात",
    "Official Website": "आधिकारिक वेबसाइट",
    "Assisted Submission": "सहायित सबमिशन",
    "API Integration": "API इंटीग्रेशन",
    "Phone": "फोन",
    "Date unavailable": "तारीख उपलब्ध नहीं है",
    "Fixed": "ठीक हुआ",
    "Partially Fixed": "आंशिक रूप से ठीक हुआ",
    "Not Fixed": "ठीक नहीं हुआ",
    "Problem Returned": "समस्या फिर से उत्पन्न हुई",
    "Unable to load this civic issue.": "यह नागरिक समस्या लोड नहीं हो सकी।",
    "This civic issue could not be found.": "यह नागरिक समस्या नहीं मिली।",
    "Unable to prepare the submission.": "सबमिशन तैयार नहीं किया जा सका।",
    "Submission preparation returned no data.": "सबमिशन तैयार करने पर कोई डेटा नहीं मिला।",
    "Unable to confirm the submission details.": "सबमिशन विवरण की पुष्टि नहीं की जा सकी।",
    "Submission confirmation returned no data.": "सबमिशन पुष्टि पर कोई डेटा नहीं मिला।",
    "The submission gateway completed the request.": "सबमिशन गेटवे ने अनुरोध पूरा कर दिया।",
    "This authority currently requires submission through its official complaint system.": "यह प्राधिकरण वर्तमान में अपनी आधिकारिक शिकायत प्रणाली के माध्यम से सबमिशन चाहता है।",
    "The submission gateway could not continue this request.": "सबमिशन गेटवे इस अनुरोध को आगे नहीं बढ़ा सका।",
    "Unable to connect to the KarmaFacie submission gateway.": "KarmaFacie सबमिशन गेटवे से कनेक्ट नहीं हो सका।",
    "No confirmed submission record is available yet.": "अभी कोई पुष्टि किया हुआ सबमिशन रिकॉर्ड उपलब्ध नहीं है।",
    "KarmaFacie could not save the official-form handoff. Please try again.": "KarmaFacie आधिकारिक फॉर्म हैंडऑफ को सहेज नहीं सका। कृपया फिर से प्रयास करें।",
    "Please enter the complaint/reference number from the official government system.": "कृपया आधिकारिक सरकारी प्रणाली से शिकायत/संदर्भ संख्या दर्ज करें।",
    "Unable to save the official complaint reference.": "आधिकारिक शिकायत संदर्भ सहेजा नहीं जा सका।",
    "This civic issue is not available.": "यह नागरिक समस्या उपलब्ध नहीं है।",
    "Unable to save this follow-up update.": "यह फॉलो-अप अपडेट सहेजा नहीं जा सका।",
    "Unable to save this resolution check.": "यह समाधान सत्यापन सहेजा नहीं जा सका।",
    "Resolution verification becomes available after the KarmaFacie issue is marked Resolved.": "समाधान सत्यापन तब उपलब्ध होगा जब KarmaFacie में समस्या को समाधान के रूप में चिह्नित किया जाएगा।",
    "Please choose an image or PDF file.": "कृपया इमेज या PDF फ़ाइल चुनें।",
    "Evidence file must be 5 MB or smaller.": "प्रमाण फ़ाइल 5 MB या उससे छोटी होनी चाहिए।",
    "Copied ✓": "कॉपी किया गया ✓",
    "Copy": "कॉपी करें",
    "✓ KarmaFacie verified": "✓ KarmaFacie द्वारा सत्यापित",
    "⚠ Not verified": "⚠ सत्यापित नहीं",
    "⏳ Verification pending": "⏳ सत्यापन लंबित",
  },

  mr: {
    "Loading civic issue...": "नागरी समस्या लोड होत आहे...",
    "← Back to My Issues": "← माझ्या नागरी समस्यांकडे परत जा",
    "Unable to load issue": "समस्या लोड करता आली नाही",
    "KARMAFACIE": "KARMAFACIE",
    "📷 Photo Evidence": "📷 फोटो पुरावा",
    "Issue Information": "समस्येची माहिती",
    "🏙️ Reported from:": "🏙️ नोंदवलेले स्थान:",
    "📍 Location:": "📍 स्थान:",
    "GPS:": "GPS:",
    "Reported:": "नोंदवले:",
    "Complaint Journey": "तक्रारीचा प्रवास",
    "A combined KarmaFacie timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "या तक्रारीसाठी KarmaFacie मध्ये नोंदवलेल्या प्रमुख टप्प्यांची संयुक्त वेळरेषा. अधिकृत प्राधिकरणाचा प्रतिसाद किंवा संदर्भ नोंदवला नसल्यास सरकारी कारवाईला पुष्टी झालेली मानली जात नाही.",
    "Current KarmaFacie status:": "सध्याची KarmaFacie स्थिती:",
    "Status History": "स्थितीचा इतिहास",
    "This timeline shows status changes actually recorded in KarmaFacie.": "ही वेळरेषा KarmaFacie मध्ये प्रत्यक्ष नोंदवलेले स्थिती बदल दर्शवते.",
    "No status-history records are currently available for this issue.": "या समस्येसाठी सध्या स्थिती इतिहासाची कोणतीही नोंद उपलब्ध नाही.",
    "Recorded by": "नोंद करणारे:",
    "Status history is generated from recorded KarmaFacie status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "स्थितीचा इतिहास KarmaFacie मध्ये नोंदवलेल्या स्थिती घटनांमधून तयार केला जातो. एखादी घटना प्राधिकरणाकडून आल्याचे स्पष्टपणे नोंदवलेले नसल्यास, सरकारी प्राधिकरणाने स्थिती बदलली असे यावरून मानले जात नाही.",
    "DIRECTORY ROUTING": "डायरेक्टरी रूटिंग",
    "Department:": "विभाग:",
    "Sub-Department:": "उप-विभाग:",
    "Official Complaint Type:": "अधिकृत तक्रारीचा प्रकार:",
    "Issue type:": "समस्येचा प्रकार:",
    "Channel:": "माध्यम:",
    "Open Official Complaint Channel →": "अधिकृत तक्रार माध्यम उघडा →",
    "This opens the official complaint channel for the matched authority. KarmaFacie does not submit the complaint automatically through this route.": "यामुळे जुळलेल्या प्राधिकरणाचे अधिकृत तक्रार माध्यम उघडेल. KarmaFacie या मार्गाने तक्रार आपोआप सबमिट करत नाही.",
    "Directory information verified:": "डायरेक्टरी माहिती पडताळली:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ या नोंदीला सध्या कोणताही सत्यापित डायरेक्टरी मार्ग जोडलेला नाही.",
    "OFFICIAL SUBMISSION": "अधिकृत सबमिशन",
    "📤 Review Your Complaint": "📤 तुमच्या तक्रारीचे पुनरावलोकन करा",
    "KarmaFacie has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "या नोंदीसाठी आवश्यक माहिती KarmaFacie ने आधीच जमा केली आहे. निवडलेल्या प्राधिकरणासाठी पुष्टी करण्यापूर्वी तयार पॅकेज तपासा.",
    "Your complaint package has not been prepared yet. KarmaFacie will assemble it from the information already stored for this issue.": "तुमचे तक्रार पॅकेज अद्याप तयार झालेले नाही. या समस्येसाठी आधीच साठवलेल्या माहितीतून KarmaFacie ते तयार करेल.",
    "A verified authority route is required before the submission package can be prepared.": "सबमिशन पॅकेज तयार करण्यापूर्वी सत्यापित प्राधिकरणाचा मार्ग आवश्यक आहे.",
    "Submission record #": "सबमिशन नोंद #",
    "✓ Photo evidence attached": "✓ फोटो पुरावा जोडलेला आहे",
    "No photo evidence attached": "फोटो पुरावा जोडलेला नाही",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "वर दिलेली तक्रारीची माहिती, स्थान आणि पुरावे योग्य आहेत आणि अधिकृत सबमिशन प्रक्रियेसाठी वापरले जाऊ शकतात याची मी पुष्टी करतो/करते.",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "ही पुष्टी या पॅकेजसाठी तुमची मान्यता नोंदवते. याचा अर्थ सरकारी तक्रार सबमिट झाली आहे असा होत नाही.",
    "✓ Ready for official submission": "✓ अधिकृत सबमिशनसाठी तयार",
    "Confirmed on": "पुष्टी दिनांक:",
    "Next step: Submission Gateway": "पुढील टप्पा: सबमिशन गेटवे",
    "Your complaint package has been prepared and confirmed. KarmaFacie will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "तुमचे तक्रार पॅकेज तयार आणि पुष्टी झाले आहे. KarmaFacie आता कॉन्फिगर केलेला प्राधिकरण सबमिशन मार्ग तपासेल. सध्याच्या CSMC मार्गासाठी गेटवे तुम्हाला अधिकृत तक्रार प्रणालीकडे नेईल; आपोआप सरकारी सबमिशन झाल्याचा दावा केला जाणार नाही.",
    "✓ Official form opened": "✓ अधिकृत फॉर्म उघडला",
    "KarmaFacie recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KarmaFacie ने हा अधिकृत फॉर्म हँडऑफ तुमच्या तक्रार नोंदीत नोंदवला आहे. याचा अर्थ सरकारी तक्रार सबमिट झाली आहे असा होत नाही.",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "अधिकृत माध्यम उघडल्याने सरकारी तक्रार सबमिट झाल्याचा अर्थ होत नाही. कोणताही अधिकृत सबमिशन किंवा संदर्भ क्रमांक सरकारी प्रणालीतूनच मिळायला हवा.",
    "KarmaFacie has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "तुम्ही दिलेला संदर्भ क्रमांक KarmaFacie ने नोंदवला आहे. ही नागरिकाने दिलेली नोंद आहे आणि सरकारी प्रणालीने स्वतंत्रपणे पडताळलेली नाही.",
    "Reference number:": "संदर्भ क्रमांक:",
    "Notes:": "नोंदी:",
    "Recorded on": "नोंद दिनांक:",
    "Once the government form confirms your submission, enter the reference/complaint number here. KarmaFacie will store it as a citizen-provided reference; it will not be treated as an official KarmaFacie submission confirmation.": "सरकारी फॉर्मने तुमचे सबमिशन निश्चित केल्यानंतर येथे संदर्भ/तक्रार क्रमांक टाका. KarmaFacie तो नागरिकाने दिलेला संदर्भ म्हणून साठवेल; तो अधिकृत KarmaFacie सबमिशन पुष्टी म्हणून मानला जाणार नाही.",
    "Government Complaint / Reference Number": "सरकारी तक्रार / संदर्भ क्रमांक",
    "Enter the number shown after successful submission": "यशस्वी सबमिशननंतर दिसणारा क्रमांक टाका",
    "Notes (optional)": "नोंदी (ऐच्छिक)",
    "Example: submitted on the CSMC website and received confirmation screen": "उदाहरण: CSMC वेबसाइटवर सबमिट केले आणि पुष्टी स्क्रीन मिळाली",
    "API submission mode is configured for this authority. The actual government API call will only be enabled after an authorized integration is connected.": "या प्राधिकरणासाठी API सबमिशन मोड कॉन्फिगर केला आहे. अधिकृत इंटिग्रेशन जोडले गेल्यानंतरच प्रत्यक्ष सरकारी API कॉल सक्षम केला जाईल.",
    "✓ Official submission recorded": "✓ अधिकृत सबमिशन नोंदवले",
    "Official reference:": "अधिकृत संदर्भ:",
    "Submitted:": "सबमिट केले:",
    "View Official Reference →": "अधिकृत संदर्भ पाहा →",
    "Follow-up & Government Updates": "फॉलो-अप आणि सरकारी अपडेट्स",
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KarmaFacie later receives verifiable information from the authority.": "तक्रार सबमिट केल्यानंतर काय झाले ते नोंदवा. KarmaFacie ला नंतर प्राधिकरणाकडून पडताळता येणारी माहिती मिळेपर्यंत हे अपडेट्स नागरिकाने दिलेले मानले जातात.",
    "What happened after submission?": "सबमिशननंतर काय झाले?",
    "No Response / Awaiting Update": "प्रतिसाद नाही / अपडेटची प्रतीक्षा",
    "Acknowledged": "स्वीकारले",
    "In Progress": "काम सुरू",
    "Resolved": "निराकरण झाले",
    "Closed": "बंद",
    "Rejected": "नाकारण्‍यात आले",
    "Update note (optional)": "अपडेट नोंद (ऐच्छिक)",
    "Example: I received an SMS saying the complaint was acknowledged": "उदाहरण: तक्रार स्वीकारल्याचा SMS मला मिळाला",
    "Evidence attachment (optional)": "पुरावा जोडणी (ऐच्छिक)",
    "Attach a photo or PDF that supports this update. Maximum 5 MB.": "या अपडेटला समर्थन देणारा फोटो किंवा PDF जोडा. कमाल 5 MB.",
    "Selected:": "निवडलेले:",
    "Recorded follow-ups": "नोंदवलेले फॉलो-अप",
    "No citizen-reported follow-up updates have been recorded yet.": "अद्याप नागरिकाने नोंदवलेला कोणताही फॉलो-अप अपडेट नाही.",
    "Citizen-reported update": "नागरिकाने नोंदवलेले अपडेट",
    "This is a KarmaFacie administrative verification, not an official government confirmation.": "ही KarmaFacie ची प्रशासकीय पडताळणी आहे, अधिकृत सरकारी पुष्टी नाही.",
    "Verification note:": "पडताळणी नोंद:",
    "🔗 Verification source →": "🔗 पडताळणी स्रोत →",
    "📎 View attached evidence →": "📎 जोडलेला पुरावा पाहा →",
    "RESOLUTION VERIFICATION": "निराकरण पडताळणी",
    "Did the problem actually get fixed?": "समस्या खरोखर ठीक झाली का?",
    "KarmaFacie currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KarmaFacie मध्ये ही समस्या सध्या निराकरण झालेली म्हणून नोंदवली आहे. स्वतः ठिकाण तपासा आणि तुम्ही जे पाहता ते नोंदवा. हे नागरिकाचे निरीक्षण आहे आणि प्रशासकीय स्थिती आपोआप बदलत नाही.",
    "What did you observe?": "तुम्ही काय पाहिले?",
    "✅ Fixed": "✅ ठीक झाले",
    "🟡 Partially Fixed": "🟡 अंशतः ठीक झाले",
    "❌ Not Fixed": "❌ ठीक झाले नाही",
    "🔁 Problem Returned": "🔁 समस्या पुन्हा आली",
    "Observation note (optional)": "निरीक्षण नोंद (ऐच्छिक)",
    "Describe what you observed at the location...": "ठिकाणी तुम्ही काय पाहिले ते वर्णन करा...",
    "After-repair evidence (optional)": "दुरुस्तीनंतरचा पुरावा (ऐच्छिक)",
    "Upload a current photo or PDF that supports your observation. Maximum 5 MB.": "तुमच्या निरीक्षणाला समर्थन देणारा सध्याचा फोटो किंवा PDF अपलोड करा. कमाल 5 MB.",
    "Recorded resolution checks": "नोंदवलेली निराकरण पडताळणी",
    "No citizen resolution checks have been recorded yet.": "अद्याप नागरिकाने कोणतीही निराकरण पडताळणी नोंदवलेली नाही.",
    "Citizen-reported resolution check": "नागरिकाने नोंदवलेली निराकरण पडताळणी",
    "📎 View resolution evidence →": "📎 निराकरणाचा पुरावा पाहा →",
    "KarmaFacie stores these observations as a separate history. They do not automatically change the administrative issue status.": "KarmaFacie ही निरीक्षणे स्वतंत्र इतिहास म्हणून साठवते. त्यातून प्रशासकीय समस्येची स्थिती आपोआप बदलत नाही.",
    "SUBMISSION ASSISTANT": "सबमिशन सहाय्यक",
    "🧾 Your Complaint Copy Pack": "🧾 तुमचे तक्रार कॉपी पॅक",
    "KarmaFacie has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KarmaFacie does not bypass cross-domain controls or CAPTCHA.": "KarmaFacie ने तुमच्या प्रोफाइलमधील नागरिक तपशील लोड करून तक्रारीच्या माहितीसोबत एकत्र केले आहेत. अधिकृत सरकारी फॉर्म भरताना हा कॉपी पॅक तयार ठेवा. KarmaFacie cross-domain नियंत्रण किंवा CAPTCHA बायपास करत नाही.",
    "Prepared details:": "तयार तपशील:",
    "Citizen profile fields are loaded from KarmaFacie, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "नागरिक प्रोफाइलमधील फील्ड KarmaFacie मधून घेतली जातात, तर जुळलेली प्राधिकरण डायरेक्टरी विभाग, उप-विभाग आणि अधिकृत तक्रारीचा प्रकार देते.",
    "✓ Photo evidence ready": "✓ फोटो पुरावा तयार आहे",
    "Use the evidence image shown above when the official form asks for a photo.": "अधिकृत फॉर्म फोटो मागितल्यास वर दाखवलेली पुरावा प्रतिमा वापरा.",
    "Still required on the official form:": "अधिकृत फॉर्मवर अजून आवश्यक:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KarmaFacie does not have, enter CAPTCHA, and perform the final Submit action yourself.": "कॉपी केलेले नागरिक तपशील आणि प्राधिकरणानुसार केलेले मॅपिंग तपासा, KarmaFacie कडे नसलेले झोन/प्रभाग किंवा इतर पर्याय पूर्ण करा, CAPTCHA भरा आणि अंतिम Submit कृती स्वतः करा.",
    "Report Reference": "रिपोर्ट संदर्भ",
    "Civic Issue ID:": "नागरी समस्या ID:",
    "Authority Directory ID:": "प्राधिकरण डायरेक्टरी ID:",
    "Authority Reference ID:": "प्राधिकरण संदर्भ ID:",
    "Submission Record ID:": "सबमिशन नोंद ID:",
    "KarmaFacie currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KarmaFacie सध्या पुरावा, स्थान, नोंद स्थिती, स्थिती इतिहास, सबमिशन पॅकेज आणि डायरेक्टरी-आधारित रूटिंग माहिती नोंदवते. अधिकृत प्राधिकरण संदर्भ किंवा पडताळलेला सरकारी प्रतिसाद नोंदवलेला नसेल तर हे पृष्ठ अधिकृत सरकारी स्थिती दर्शवत नाही.",
    "Civic Issue": "नागरी समस्या",
    "No description provided.": "कोणतेही वर्णन उपलब्ध नाही.",
    "Location not provided.": "स्थान दिलेले नाही.",
    "GPS coordinates not available.": "GPS निर्देशांक उपलब्ध नाहीत.",
    "Person Name": "व्यक्तीचे नाव",
    "Mobile Number": "मोबाईल क्रमांक",
    "Email": "ईमेल",
    "Residential Address": "निवासी पत्ता",
    "City / State": "शहर / राज्य",
    "Zone": "झोन",
    "Ward": "प्रभाग",
    "Authority": "प्राधिकरण",
    "Sub-Department": "उप-विभाग",
    "Subject": "विषय",
    "Complaint Description": "तक्रारीचे वर्णन",
    "Issue Location": "समस्येचे ठिकाण",
    "GPS Coordinates": "GPS निर्देशांक",
    "Evidence": "पुरावा",
    "Description": "वर्णन",
    "Submission Route": "सबमिशन मार्ग",
    "Not specified": "निर्दिष्ट नाही",
    "Not provided in KarmaFacie profile.": "KarmaFacie प्रोफाइलमध्ये उपलब्ध नाही.",
    "No email available from the authenticated account.": "प्रमाणित अकाउंटमधून ईमेल उपलब्ध नाही.",
    "City / State not available.": "शहर / राज्य उपलब्ध नाही.",
    "Not configured in authority directory.": "प्राधिकरण डायरेक्टरीमध्ये कॉन्फिगर केलेले नाही.",
    "No complaint description provided.": "तक्रारीचे वर्णन उपलब्ध नाही.",
    "Loading": "लोड होत आहे",
    "Reported": "नोंदवलेली",
    "Under Review": "तपासणी सुरू",
    "Draft": "मसुदा",
    "Government Authority": "सरकारी प्राधिकरण",
    "Citizen": "नागरिक",
    "KarmaFacie Admin": "KarmaFacie प्रशासक",
    "KarmaFacie System": "KarmaFacie प्रणाली",
    "Unknown": "अज्ञात",
    "Official Website": "अधिकृत वेबसाइट",
    "Assisted Submission": "सहाय्यित सबमिशन",
    "API Integration": "API एकत्रीकरण",
    "Phone": "फोन",
    "Date unavailable": "तारीख उपलब्ध नाही",
    "Fixed": "ठीक झाले",
    "Partially Fixed": "अंशतः ठीक झाले",
    "Not Fixed": "ठीक झाले नाही",
    "Problem Returned": "समस्या पुन्हा आली",
    "Unable to load this civic issue.": "ही नागरी समस्या लोड करता आली नाही.",
    "This civic issue could not be found.": "ही नागरी समस्या सापडली नाही.",
    "Unable to prepare the submission.": "सबमिशन तयार करता आले नाही.",
    "Submission preparation returned no data.": "सबमिशन तयार करताना कोणताही डेटा मिळाला नाही.",
    "Unable to confirm the submission details.": "सबमिशन तपशीलाची पुष्टी करता आली नाही.",
    "Submission confirmation returned no data.": "सबमिशन पुष्टी करताना कोणताही डेटा मिळाला नाही.",
    "The submission gateway completed the request.": "सबमिशन गेटवेने विनंती पूर्ण केली.",
    "This authority currently requires submission through its official complaint system.": "या प्राधिकरणाला सध्या अधिकृत तक्रार प्रणालीद्वारे सबमिशन आवश्यक आहे.",
    "The submission gateway could not continue this request.": "सबमिशन गेटवे ही विनंती पुढे नेऊ शकले नाही.",
    "Unable to connect to the KarmaFacie submission gateway.": "KarmaFacie सबमिशन गेटवेशी जोडता आले नाही.",
    "No confirmed submission record is available yet.": "अद्याप पुष्टी केलेली सबमिशन नोंद उपलब्ध नाही.",
    "KarmaFacie could not save the official-form handoff. Please try again.": "KarmaFacie अधिकृत फॉर्म हँडऑफ जतन करू शकले नाही. कृपया पुन्हा प्रयत्न करा.",
    "Please enter the complaint/reference number from the official government system.": "कृपया अधिकृत सरकारी प्रणालीतील तक्रार/संदर्भ क्रमांक टाका.",
    "Unable to save the official complaint reference.": "अधिकृत तक्रार संदर्भ जतन करता आला नाही.",
    "This civic issue is not available.": "ही नागरी समस्या उपलब्ध नाही.",
    "Unable to save this follow-up update.": "हा फॉलो-अप अपडेट जतन करता आला नाही.",
    "Unable to save this resolution check.": "ही निराकरण पडताळणी जतन करता आली नाही.",
    "Resolution verification becomes available after the KarmaFacie issue is marked Resolved.": "KarmaFacie मध्ये समस्या निराकरण झालेली म्हणून चिन्हांकित केल्यानंतर निराकरण पडताळणी उपलब्ध होते.",
    "Please choose an image or PDF file.": "कृपया इमेज किंवा PDF फाइल निवडा.",
    "Evidence file must be 5 MB or smaller.": "पुरावा फाइल 5 MB किंवा त्यापेक्षा कमी असावी.",
    "Copied ✓": "कॉपी केले ✓",
    "Copy": "कॉपी करा",
    "✓ KarmaFacie verified": "✓ KarmaFacie ने पडताळले",
    "⚠ Not verified": "⚠ पडताळलेले नाही",
    "⏳ Verification pending": "⏳ पडताळणी प्रलंबित",
  },
};

const dynamicUiPrefixes: Array<Record<Language, string>> = [
  { en: "Routed to ", hi: "को भेजा गया: ", mr: "यांच्याकडे मार्गित: " },
  { en: "Issue status set to ", hi: "समस्या की स्थिति निर्धारित की गई: ", mr: "समस्येची स्थिती निश्चित केली: " },
  { en: "Reported from: ", hi: "रिपोर्ट का स्थान: ", mr: "नोंदवलेले स्थान: " },
  { en: "📍 Location: ", hi: "📍 स्थान: ", mr: "📍 स्थान: " },
  { en: "GPS: ", hi: "GPS: ", mr: "GPS: " },
  { en: "Reported: ", hi: "रिपोर्ट की गई: ", mr: "नोंदवले: " },
  { en: "Selected: ", hi: "चयनित: ", mr: "निवडलेले: " },
  { en: "Reference ID: ", hi: "रेफरेंस ID: ", mr: "संदर्भ ID: " },
  { en: "Authority Directory ID: ", hi: "प्राधिकरण डायरेक्टरी ID: ", mr: "प्राधिकरण डायरेक्टरी ID: " },
  { en: "Authority Reference ID: ", hi: "प्राधिकरण संदर्भ ID: ", mr: "प्राधिकरण संदर्भ ID: " },
  { en: "Submission Record ID: ", hi: "सबमिशन रिकॉर्ड ID: ", mr: "सबमिशन नोंद ID: " },
  { en: "Confirmed on ", hi: "पुष्टि की गई ", mr: "पुष्टी दिनांक " },
  { en: "Recorded on ", hi: "दर्ज किया गया ", mr: "नोंद दिनांक " },
  { en: "Submitted: ", hi: "सबमिट किया गया: ", mr: "सबमिट केले: " },
];

function normalizeUiText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function preserveUiWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateUiText(value: string, language: Language) {
  const normalized = normalizeUiText(value);

  if (!normalized) {
    return value;
  }

  const directTarget = uiTranslations[language][normalized];
  if (directTarget) {
    return preserveUiWhitespace(value, directTarget);
  }

  // Translate known exact values from any supported language into English first,
  // then from English into the selected language. This allows switching back and forth.
  let englishKey = normalized;

  for (const candidateLanguage of ["en", "hi", "mr"] as Language[]) {
    const entries = uiTranslations[candidateLanguage];
    const match = Object.entries(entries).find(
      ([english, translated]) =>
        translated === normalized || english === normalized
    );

    if (match) {
      englishKey = match[0];
      break;
    }
  }

  const translatedExact = uiTranslations[language][englishKey];
  if (translatedExact) {
    return preserveUiWhitespace(value, translatedExact);
  }

  // Translate dynamic strings that contain citizen/authority data.
  for (const prefix of dynamicUiPrefixes) {
    for (const candidateLanguage of ["en", "hi", "mr"] as Language[]) {
      const sourcePrefix = prefix[candidateLanguage];
      if (normalized.startsWith(sourcePrefix)) {
        const remainder = normalized.slice(sourcePrefix.length);
        const targetPrefix = prefix[language];
        return preserveUiWhitespace(
          value,
          `${targetPrefix}${remainder}`
        );
      }
    }
  }

  return value;
}

function translateIssuePageDom(language: Language) {
  if (typeof document === "undefined") {
    return;
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    const node = current as Text;
    const parentElement = node.parentElement;

    if (
      parentElement &&
      !parentElement.closest("script, style")
    ) {
      textNodes.push(node);
    }

    current = walker.nextNode();
  }

  for (const node of textNodes) {
    const original = node.textContent ?? "";
    const translated = translateUiText(original, language);

    if (translated !== original) {
      node.textContent = translated;
    }
  }

  const translatableAttributes = [
    "placeholder",
    "title",
    "alt",
    "aria-label",
  ];

  const selector = translatableAttributes
    .map((attribute) => `[${attribute}]`)
    .join(",");

  document.querySelectorAll<HTMLElement>(selector).forEach(
    (element) => {
      for (const attribute of translatableAttributes) {
        const value = element.getAttribute(attribute);

        if (!value) {
          continue;
        }

        const translated = translateUiText(
          value,
          language
        );

        if (translated !== value) {
          element.setAttribute(
            attribute,
            translated
          );
        }
      }
    }
  );
}

const panelStyle: CSSProperties = {
  background: "rgba(17,24,39,0.88)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "20px",
};

const mutedTextStyle: CSSProperties = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: 1.6,
};

const buttonStyle: CSSProperties = {
  padding: "12px 16px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

function InfoBox({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "12px",
        background:
          "rgba(255,255,255,0.025)",
        border:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#d1d5db",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function getStatusLabel(
  status: string
) {
  switch (status) {
    case "reported":
      return "Reported";

    case "under_review":
      return "Under Review";

    case "in_progress":
      return "In Progress";

    case "resolved":
      return "Resolved";

    case "rejected":
      return "Rejected";

    case "draft":
      return "Draft";

    default:
      return status;
  }
}

function getStatusIcon(
  status: string
) {
  switch (status) {
    case "reported":
      return "📨";

    case "under_review":
      return "🔍";

    case "in_progress":
      return "🔧";

    case "resolved":
      return "✅";

    case "rejected":
      return "⚠️";

    default:
      return "📌";
  }
}

function getActorLabel(
  actorType: StatusHistory["actor_type"]
) {
  switch (actorType) {
    case "authority":
      return "Government Authority";

    case "citizen":
      return "Citizen";

    case "admin":
      return "KarmaFacie Admin";

    case "system":
      return "KarmaFacie System";

    default:
      return "Unknown";
  }
}

function getActorIcon(
  actorType: StatusHistory["actor_type"]
) {
  switch (actorType) {
    case "authority":
      return "🏛️";

    case "citizen":
      return "👤";

    case "admin":
      return "🛡️";

    case "system":
      return "⚙️";

    default:
      return "📌";
  }
}

function getSubmissionModeLabel(
  mode: SubmissionMode
) {
  switch (mode) {
    case "DIRECT_LINK":
      return "Official Website";

    case "ASSISTED_SUBMISSION":
      return "Assisted Submission";

    case "API":
      return "API Integration";

    case "PHONE":
      return "Phone";

    case "EMAIL":
      return "Email";

    default:
      return mode;
  }
}

function formatDate(
  date: string | null
) {
  if (!date) {
    return "Date unavailable";
  }

  const storedLanguage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("civicquest-language")
      : "en";

  const locale =
    storedLanguage === "hi"
      ? "hi-IN"
      : storedLanguage === "mr"
        ? "mr-IN"
        : "en-IN";

  return new Date(
    date
  ).toLocaleString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatDateOnly(
  date: string | null
) {
  if (!date) {
    return "Date unavailable";
  }

  const storedLanguage =
    typeof window !== "undefined"
      ? window.localStorage.getItem("civicquest-language")
      : "en";

  const locale =
    storedLanguage === "hi"
      ? "hi-IN"
      : storedLanguage === "mr"
        ? "mr-IN"
        : "en-IN";

  return new Date(
    date
  ).toLocaleDateString(
    locale,
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function followUpStatusLabel(
  status: FollowUpStatus
) {
  switch (status) {
    case "ACKNOWLEDGED":
      return "Acknowledged";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    case "REJECTED":
      return "Rejected";
    case "NO_RESPONSE":
      return "No Response / Awaiting Update";
    default:
      return status;
  }
}

export default function IssueDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const supabase = createClient();
  const { language } = useLanguage();

  useEffect(() => {
    translateIssuePageDom(language);

    const observer = new MutationObserver(() => {
      translateIssuePageDom(language);
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "placeholder",
        "title",
        "alt",
        "aria-label",
      ],
    });

    return () => observer.disconnect();
  }, [language]);

  const issueId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [issue, setIssue] =
    useState<CivicIssue | null>(null);

  const [citizenProfile, setCitizenProfile] =
    useState<CitizenProfile | null>(null);

  const [citizenEmail, setCitizenEmail] =
    useState("");

  const [authority, setAuthority] =
    useState<AuthorityDirectory | null>(
      null
    );

  const [history, setHistory] =
    useState<StatusHistory[]>([]);

  const [photoUrl, setPhotoUrl] =
    useState<string | null>(null);

  const [submission, setSubmission] =
    useState<SubmissionRecord | null>(
      null
    );

  const [
    preparingSubmission,
    setPreparingSubmission,
  ] = useState(false);

  const [
    confirmingSubmission,
    setConfirmingSubmission,
  ] = useState(false);

  const [consentChecked, setConsentChecked] =
    useState(false);

  const [submissionError, setSubmissionError] =
    useState("");

  const [
    submittingSubmission,
    setSubmittingSubmission,
  ] = useState(false);

  const [gatewayUrl, setGatewayUrl] =
    useState<string | null>(null);

  const [gatewayMessage, setGatewayMessage] =
    useState("");

  const [officialHandoffOpenedAt, setOfficialHandoffOpenedAt] =
    useState<string | null>(null);

  const [referenceNumber, setReferenceNumber] =
    useState("");

  const [submissionNotes, setSubmissionNotes] =
    useState("");

  const [savingOfficialReference, setSavingOfficialReference] =
    useState(false);

  const [followups, setFollowups] =
    useState<FollowUpRecord[]>([]);

  const [followUpStatus, setFollowUpStatus] =
    useState<FollowUpStatus>("NO_RESPONSE");

  const [followUpNote, setFollowUpNote] =
    useState("");

  const [followUpEvidence, setFollowUpEvidence] =
    useState<File | null>(null);

  const [savingFollowUp, setSavingFollowUp] =
    useState(false);

  const [followUpError, setFollowUpError] =
    useState("");

  const [resolutionChecks, setResolutionChecks] =
    useState<ResolutionCheckRecord[]>([]);

  const [resolutionResult, setResolutionResult] =
    useState<ResolutionCheckResult>("FIXED");

  const [resolutionNote, setResolutionNote] =
    useState("");

  const [resolutionEvidence, setResolutionEvidence] =
    useState<File | null>(null);

  const [savingResolutionCheck, setSavingResolutionCheck] =
    useState(false);

  const [resolutionCheckError, setResolutionCheckError] =
    useState("");

  const [copiedField, setCopiedField] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const submissionConfirmed =
    Boolean(
      submission?.citizen_confirmed_at
    );

  const journeySteps = [
    {
      key: "reported",
      label: "Issue Reported",
      description: "Your civic issue was recorded in KarmaFacie.",
      completed: Boolean(issue?.reported_at || issue?.created_at),
      timestamp: issue?.reported_at ?? issue?.created_at ?? null,
    },
    {
      key: "mapped",
      label: "Authority Mapped",
      description: authority
        ? `Routed to ${authority.authority_name}.`
        : "No authority directory match is currently recorded.",
      completed: Boolean(
        authority?.id || issue?.authority_directory_id
      ),
      timestamp: authority?.verified_at ?? null,
    },
    {
      key: "prepared",
      label: "Complaint Prepared",
      description: submissionConfirmed
        ? "The complaint package was prepared and confirmed."
        : "The complaint package has not yet been confirmed.",
      completed: submissionConfirmed,
      timestamp: submission?.citizen_confirmed_at ?? null,
    },
    {
      key: "official_form",
      label: "Official Form Opened",
      description: officialHandoffOpenedAt
        ? "KarmaFacie recorded the official-form handoff."
        : "The official complaint form has not yet been opened from KarmaFacie.",
      completed: Boolean(officialHandoffOpenedAt),
      timestamp: officialHandoffOpenedAt,
    },
    {
      key: "citizen_submitted",
      label: "Submission Reported by Citizen",
      description: submission?.citizen_reported_submitted_at
        ? "A reference number was recorded from the citizen."
        : "No citizen-reported official reference has been recorded yet.",
      completed: Boolean(
        submission?.citizen_reported_submitted_at
      ),
      timestamp:
        submission?.citizen_reported_submitted_at ?? null,
    },
  ];

  useEffect(() => {
    if (issueId) {
      void loadIssue();
    }
  }, [issueId]);

  async function loadIssue() {
    setLoading(true);
    setError("");

    setGatewayUrl(null);
    setGatewayMessage("");
    setOfficialHandoffOpenedAt(null);
    setReferenceNumber("");
    setSubmissionNotes("");
    setSubmissionError("");
    setFollowups([]);
    setFollowUpStatus("NO_RESPONSE");
    setFollowUpNote("");
    setFollowUpError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      setCitizenEmail(
        user.email || ""
      );

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          `
            name,
            mobile,
            house_no,
            address,
            state,
            city,
            zone,
            ward
          `
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Citizen profile loading error:",
          profileError
        );
      } else if (profileData) {
        setCitizenProfile(
          profileData as CitizenProfile
        );
      }

      setIssue(null);
      setAuthority(null);
      setHistory([]);
      setPhotoUrl(null);
      setSubmission(null);
      setConsentChecked(false);

      const {
        data: issueData,
        error: issueError,
      } = await supabase
        .from("civic_issues")
        .select(
          `
            id,
            category,
            title,
            description,
            location_text,
            latitude,
            longitude,
            photo_path,
            status,
            authority_name,
            authority_reference_id,
            reported_city,
            reported_state,
            authority_directory_id,
            reported_at,
            resolved_at,
            created_at,
            updated_at
          `
        )
        .eq("id", issueId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (issueError) {
        setError(
          issueError.message
        );
        return;
      }

      if (!issueData) {
        setError(
          "This civic issue could not be found."
        );
        return;
      }

      const typedIssue =
        issueData as CivicIssue;

      setIssue(typedIssue);

      if (
        typedIssue.authority_directory_id
      ) {
        const {
          data: authorityData,
          error: authorityError,
        } = await supabase
          .from("authority_directory")
          .select(
            `
              id,
              city,
              state,
              authority_name,
              department_name,
              sub_department_name,
              official_complaint_type,
              issue_category,
              grievance_url,
              official_source_url,
              submission_method,
              submission_mode,
              notes,
              is_active,
              verified_at
            `
          )
          .eq(
            "id",
            typedIssue.authority_directory_id
          )
          .maybeSingle();

        if (authorityError) {
          console.error(
            "Authority loading error:",
            authorityError
          );
        }

        if (authorityData) {
          setAuthority(
            authorityData as AuthorityDirectory
          );
        }
      }

      const {
        data: historyData,
        error: historyError,
      } = await supabase
        .from(
          "civic_issue_status_history"
        )
        .select(
          `
            id,
            issue_id,
            old_status,
            new_status,
            note,
            actor_type,
            created_at
          `
        )
        .eq("issue_id", issueId)
        .order("created_at", {
          ascending: true,
        });

      if (historyError) {
        console.error(
          "Status history error:",
          historyError
        );
      } else {
        setHistory(
          (historyData ||
            []) as StatusHistory[]
        );
      }

      const {
        data: submissionData,
        error: submissionErrorData,
      } = await supabase
        .from(
          "civic_issue_submissions"
        )
        .select(
          `
            id,
            issue_id,
            authority_directory_id,
            submission_mode,
            provider_name,
            submission_status,
            official_reference_id,
            official_reference_url,
            attempted_at,
            submitted_at,
            last_synced_at,
            error_message,
            citizen_confirmed_at,
            official_form_opened_at,
            citizen_reported_submitted_at,
            official_reference_number,
            official_submission_notes,
            submission_payload,
            created_at,
            updated_at
          `
        )
        .eq(
          "issue_id",
          issueId
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (submissionErrorData) {
        console.error(
          "Submission loading error:",
          submissionErrorData
        );
        setOfficialHandoffOpenedAt(null);
      } else if (
        submissionData
      ) {
        const typedSubmission =
          submissionData as SubmissionRecord;

        setSubmission(typedSubmission);
        setOfficialHandoffOpenedAt(
          typedSubmission.official_form_opened_at ??
            null
        );
        setReferenceNumber(
          typedSubmission.official_reference_number ??
            ""
        );
        setSubmissionNotes(
          typedSubmission.official_submission_notes ??
            ""
        );
      } else {
        setSubmission(null);
        setOfficialHandoffOpenedAt(null);
      }

      const {
        data: followUpData,
        error: followUpLoadError,
      } = await supabase
        .from("civic_issue_followups")
        .select(
          `
            id,
            issue_id,
            user_id,
            status,
            note,
            evidence_path,
            verification_status,
            verified_at,
            verified_by,
            verification_note,
            verification_source_url,
            created_at
          `
        )
        .eq("issue_id", issueId)
        .order("created_at", {
          ascending: false,
        });

      if (followUpLoadError) {
        console.error(
          "Follow-up loading error:",
          followUpLoadError
        );
      } else {
        const loadedFollowups =
          (followUpData || []) as FollowUpRecord[];

        const followupsWithUrls =
          await Promise.all(
            loadedFollowups.map(async (followUp) => {
              if (!followUp.evidence_path) {
                return followUp;
              }

              const {
                data: evidenceUrlData,
                error: evidenceUrlError,
              } = await supabase.storage
                .from("civic-issue-photos")
                .createSignedUrl(
                  followUp.evidence_path,
                  60 * 60
                );

              if (evidenceUrlError) {
                console.error(
                  "Follow-up evidence URL error:",
                  evidenceUrlError
                );
              }

              return {
                ...followUp,
                evidence_url:
                  evidenceUrlData?.signedUrl ?? null,
              };
            })
          );

        setFollowups(followupsWithUrls);
      }

      const {
        data: resolutionCheckData,
        error: resolutionCheckLoadError,
      } = await supabase
        .from("civic_issue_resolution_checks")
        .select(
          `
            id,
            issue_id,
            user_id,
            issue_status_at_check,
            resolution_result,
            note,
            evidence_path,
            created_at
          `
        )
        .eq("issue_id", issueId)
        .order("created_at", {
          ascending: false,
        });

      if (resolutionCheckLoadError) {
        console.error(
          "Resolution check loading error:",
          resolutionCheckLoadError
        );
      } else {
        const loadedResolutionChecks =
          (resolutionCheckData || []) as ResolutionCheckRecord[];

        const resolutionChecksWithUrls =
          await Promise.all(
            loadedResolutionChecks.map(async (check) => {
              if (!check.evidence_path) {
                return check;
              }

              const {
                data: evidenceUrlData,
                error: evidenceUrlError,
              } = await supabase.storage
                .from("civic-issue-photos")
                .createSignedUrl(
                  check.evidence_path,
                  60 * 60
                );

              if (evidenceUrlError) {
                console.error(
                  "Resolution evidence URL error:",
                  evidenceUrlError
                );
              }

              return {
                ...check,
                evidence_url:
                  evidenceUrlData?.signedUrl ?? null,
              };
            })
          );

        setResolutionChecks(
          resolutionChecksWithUrls
        );
      }

      if (typedIssue.photo_path) {
        const {
          data: signedUrlData,
          error: signedUrlError,
        } =
          await supabase.storage
            .from(
              "civic-issue-photos"
            )
            .createSignedUrl(
              typedIssue.photo_path,
              3600
            );

        if (
          !signedUrlError &&
          signedUrlData?.signedUrl
        ) {
          setPhotoUrl(
            signedUrlData.signedUrl
          );
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this civic issue."
      );
    } finally {
      setLoading(false);
    }
  }

  async function prepareSubmission() {
    if (!issue) {
      return;
    }

    setPreparingSubmission(true);
    setSubmissionError("");
    setConsentChecked(false);

    try {
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "prepare_civic_issue_submission",
        {
          p_issue_id:
            issue.id,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      const preparedSubmission =
        Array.isArray(data)
          ? data[0]
          : data;

      if (!preparedSubmission) {
        throw new Error(
          "Submission preparation returned no data."
        );
      }

      const typedPreparedSubmission =
        preparedSubmission as SubmissionRecord;

      setSubmission(
        typedPreparedSubmission
      );
      setReferenceNumber(
        typedPreparedSubmission.official_reference_number ??
          ""
      );
      setSubmissionNotes(
        typedPreparedSubmission.official_submission_notes ??
          ""
      );

      setGatewayUrl(null);
      setGatewayMessage("");
    } catch (err) {
      console.error(err);

      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Unable to prepare the submission."
      );
    } finally {
      setPreparingSubmission(false);
    }
  }

  async function confirmSubmission() {
    if (!submission) {
      return;
    }

    setConfirmingSubmission(true);
    setSubmissionError("");

    try {
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "confirm_civic_issue_submission",
        {
          p_submission_id:
            submission.id,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      const confirmedSubmission =
        Array.isArray(data)
          ? data[0]
          : data;

      if (!confirmedSubmission) {
        throw new Error(
          "Submission confirmation returned no data."
        );
      }

      const typedConfirmedSubmission =
        confirmedSubmission as SubmissionRecord;

      setSubmission(
        typedConfirmedSubmission
      );
      setReferenceNumber(
        typedConfirmedSubmission.official_reference_number ??
          ""
      );
      setSubmissionNotes(
        typedConfirmedSubmission.official_submission_notes ??
          ""
      );

      setConsentChecked(false);
    } catch (err) {
      console.error(err);

      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Unable to confirm the submission details."
      );
    } finally {
      setConfirmingSubmission(false);
    }
  }

  async function submitThroughGateway() {
    if (!submission) {
      return;
    }

    setSubmittingSubmission(true);
    setSubmissionError("");
    setGatewayMessage("");
    setGatewayUrl(null);

    try {
      const response = await fetch(
        `/api/submissions/${submission.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        (await response.json()) as GatewayResponse;

      if (data.success) {
        setGatewayMessage(
          data.message ||
            "The submission gateway completed the request."
        );

        if (
          data.external_submission
        ) {
          await loadIssue();
        }

        return;
      }

      if (
        data.status ===
        "MANUAL_REQUIRED"
      ) {
        setGatewayMessage(
          data.message ||
            "This authority currently requires submission through its official complaint system."
        );

        setGatewayUrl(
          data.official_url || null
        );

        return;
      }

      setSubmissionError(
        data.message ||
          "The submission gateway could not continue this request."
      );
    } catch (err) {
      console.error(
        "Submission gateway request error:",
        err
      );

      setSubmissionError(
        "Unable to connect to the KarmaFacie submission gateway."
      );
    } finally {
      setSubmittingSubmission(false);
    }
  }

  async function markOfficialComplaintChannelOpened() {
    if (!submission) {
      setSubmissionError(
        "No confirmed submission record is available yet."
      );
      return;
    }

    setSubmissionError("");

    const {
      data,
      error,
    } = await supabase.rpc(
      "mark_civic_issue_official_form_opened",
      {
        p_submission_id: submission.id,
      }
    );

    if (error) {
      console.error(
        "Official form handoff save error:",
        error
      );

      setSubmissionError(
        "KarmaFacie could not save the official-form handoff. Please try again."
      );
      return;
    }

    if (data) {
      setOfficialHandoffOpenedAt(
        String(data)
      );
    }
  }

  async function recordOfficialComplaintReference() {
    if (!submission) {
      setSubmissionError(
        "No confirmed submission record is available yet."
      );
      return;
    }

    if (!referenceNumber.trim()) {
      setSubmissionError(
        "Please enter the complaint/reference number from the official government system."
      );
      return;
    }

    setSavingOfficialReference(true);
    setSubmissionError("");

    try {
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "record_civic_issue_official_reference",
        {
          p_submission_id: submission.id,
          p_reference_number: referenceNumber.trim(),
          p_notes: submissionNotes.trim() || null,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      const submittedAt =
        data ? String(data) : new Date().toISOString();

      setSubmission((current) =>
        current
          ? {
              ...current,
              citizen_reported_submitted_at:
                current.citizen_reported_submitted_at ??
                submittedAt,
              official_reference_number:
                referenceNumber.trim(),
              official_submission_notes:
                submissionNotes.trim() || null,
            }
          : current
      );
    } catch (err) {
      console.error(
        "Official reference save error:",
        err
      );

      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Unable to save the official complaint reference."
      );
    } finally {
      setSavingOfficialReference(false);
    }
  }

  async function recordFollowUp() {
    if (!issue) {
      setFollowUpError(
        "This civic issue is not available."
      );
      return;
    }

    setSavingFollowUp(true);
    setFollowUpError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      let uploadedEvidencePath: string | null = null;

      if (followUpEvidence) {
        const fileName =
          followUpEvidence.name
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(-120);

        const filePath =
          `followups/${user.id}/${issue.id}/${crypto.randomUUID()}-${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("civic-issue-photos")
          .upload(filePath, followUpEvidence, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedEvidencePath = filePath;
      }

      const {
        data,
        error: insertError,
      } = await supabase
        .from("civic_issue_followups")
        .insert({
          issue_id: issue.id,
          user_id: user.id,
          status: followUpStatus,
          note: followUpNote.trim() || null,
          evidence_path: uploadedEvidencePath,
        })
        .select(
          `
            id,
            issue_id,
            user_id,
            status,
            note,
            evidence_path,
            created_at
          `
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      let evidenceUrl: string | null = null;

      if (uploadedEvidencePath) {
        const {
          data: evidenceUrlData,
          error: evidenceUrlError,
        } = await supabase.storage
          .from("civic-issue-photos")
          .createSignedUrl(
            uploadedEvidencePath,
            60 * 60
          );

        if (evidenceUrlError) {
          console.error(
            "Follow-up evidence URL error:",
            evidenceUrlError
          );
        } else {
          evidenceUrl =
            evidenceUrlData?.signedUrl ?? null;
        }
      }

      setFollowups((current) => [
        {
          ...(data as FollowUpRecord),
          evidence_url: evidenceUrl,
        },
        ...current,
      ]);
      setFollowUpStatus("NO_RESPONSE");
      setFollowUpNote("");
      setFollowUpEvidence(null);
    } catch (err) {
      console.error(
        "Citizen follow-up save error:",
        err
      );

      setFollowUpError(
        err instanceof Error
          ? err.message
          : "Unable to save this follow-up update."
      );
    } finally {
      setSavingFollowUp(false);
    }
  }

  function resolutionResultLabel(
    result: ResolutionCheckResult
  ) {
    switch (result) {
      case "FIXED":
        return "Fixed";
      case "PARTIALLY_FIXED":
        return "Partially Fixed";
      case "NOT_FIXED":
        return "Not Fixed";
      case "RETURNED":
        return "Problem Returned";
      default:
        return result;
    }
  }

  function resolutionResultIcon(
    result: ResolutionCheckResult
  ) {
    switch (result) {
      case "FIXED":
        return "✅";
      case "PARTIALLY_FIXED":
        return "🟡";
      case "NOT_FIXED":
        return "❌";
      case "RETURNED":
        return "🔁";
      default:
        return "📌";
    }
  }

  async function recordResolutionCheck() {
    if (!issue) {
      setResolutionCheckError(
        "This civic issue is not available."
      );
      return;
    }

    if (issue.status !== "resolved") {
      setResolutionCheckError(
        "Resolution verification becomes available after the KarmaFacie issue is marked Resolved."
      );
      return;
    }

    setSavingResolutionCheck(true);
    setResolutionCheckError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/auth");
        return;
      }

      let uploadedEvidencePath: string | null = null;

      if (resolutionEvidence) {
        const fileName =
          resolutionEvidence.name
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(-120);

        const filePath =
          `resolution-checks/${user.id}/${issue.id}/${crypto.randomUUID()}-${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("civic-issue-photos")
            .upload(
              filePath,
              resolutionEvidence,
              {
                cacheControl: "3600",
                upsert: false,
              }
            );

        if (uploadError) {
          throw uploadError;
        }

        uploadedEvidencePath = filePath;
      }

      const {
        data,
        error: insertError,
      } = await supabase
        .from("civic_issue_resolution_checks")
        .insert({
          issue_id: issue.id,
          user_id: user.id,
          issue_status_at_check: issue.status,
          resolution_result: resolutionResult,
          note: resolutionNote.trim() || null,
          evidence_path: uploadedEvidencePath,
        })
        .select(
          `
            id,
            issue_id,
            user_id,
            issue_status_at_check,
            resolution_result,
            note,
            evidence_path,
            created_at
          `
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      let evidenceUrl: string | null = null;

      if (uploadedEvidencePath) {
        const {
          data: evidenceUrlData,
          error: evidenceUrlError,
        } = await supabase.storage
          .from("civic-issue-photos")
          .createSignedUrl(
            uploadedEvidencePath,
            60 * 60
          );

        if (evidenceUrlError) {
          console.error(
            "Resolution evidence URL error:",
            evidenceUrlError
          );
        } else {
          evidenceUrl =
            evidenceUrlData?.signedUrl ?? null;
        }
      }

      setResolutionChecks((current) => [
        {
          ...(data as ResolutionCheckRecord),
          evidence_url: evidenceUrl,
        },
        ...current,
      ]);

      setResolutionResult("FIXED");
      setResolutionNote("");
      setResolutionEvidence(null);
    } catch (err) {
      console.error(
        "Citizen resolution check save error:",
        err
      );

      setResolutionCheckError(
        err instanceof Error
          ? err.message
          : "Unable to save this resolution check."
      );
    } finally {
      setSavingResolutionCheck(false);
    }
  }

  async function copyField(
    key: string,
    value: string
  ) {
    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopiedField(key);

      window.setTimeout(() => {
        setCopiedField(
          (current) =>
            current === key
              ? null
              : current
        );
      }, 1800);
    } catch (err) {
      console.error(
        "Clipboard copy failed:",
        err
      );
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b0f14",
          color: "white",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontSize: "18px",
        }}
      >
        Loading civic issue...
      </main>
    );
  }

  if (error || !issue) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #18222e 0%, #0b0f14 45%, #070a0d 100%)",
          color: "white",
          padding:
            "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth:
              "850px",
            margin:
              "0 auto",
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                "/my-issues"
              )
            }
            style={{
              background:
                "transparent",
              border: "none",
              color:
                "#9ca3af",
              cursor:
                "pointer",
              fontSize:
                "15px",
              marginBottom:
                "24px",
            }}
          >
            ← Back to My Issues
          </button>

          <div
            style={panelStyle}
          >
            <h1
              style={{
                margin:
                  "0 0 10px",
              }}
            >
              Unable to load issue
            </h1>

            <p
              style={{
                color:
                  "#9ca3af",
              }}
            >
              {error ||
                "This issue could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const copyFields = [
    {
      key: "name",
      label: "Person Name",
      value:
        citizenProfile?.name ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "mobile",
      label: "Mobile Number",
      value:
        citizenProfile?.mobile ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "email",
      label: "Email",
      value:
        citizenEmail ||
        "No email available from the authenticated account.",
    },
    {
      key: "house_no",
      label:
        "House / Flat / Building Number",
      value:
        citizenProfile?.house_no ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "address",
      label: "Residential Address",
      value:
        citizenProfile?.address ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "city_state",
      label: "City / State",
      value:
        `${citizenProfile?.city || issue.reported_city || ""}${
          citizenProfile?.state ||
          issue.reported_state
            ? `, ${
                citizenProfile?.state ||
                issue.reported_state ||
                ""
              }`
            : ""
        }`.trim() ||
        "City / State not available.",
    },
    {
      key: "zone",
      label: "Zone",
      value:
        citizenProfile?.zone ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "ward",
      label: "Ward",
      value:
        citizenProfile?.ward ||
        "Not provided in KarmaFacie profile.",
    },
    {
      key: "department",
      label: "Department",
      value:
        authority?.department_name ||
        "Not configured in authority directory.",
    },
    {
      key: "sub_department",
      label: "Sub-Department",
      value:
        authority?.sub_department_name ||
        "Not configured in authority directory.",
    },
    {
      key: "official_complaint_type",
      label: "Official Complaint Type",
      value:
        authority?.official_complaint_type ||
        "Not configured in authority directory.",
    },
    {
      key: "subject",
      label: "Subject",
      value:
        issue.title ||
        "Civic Issue",
    },
    {
      key: "description",
      label: "Complaint Description",
      value:
        issue.description ||
        "No complaint description provided.",
    },
    {
      key: "location",
      label: "Issue Location",
      value:
        issue.location_text ||
        `${issue.reported_city || ""}${
          issue.reported_state
            ? `, ${issue.reported_state}`
            : ""
        }`.trim() ||
        "Location not provided.",
    },
    {
      key: "gps",
      label: "GPS Coordinates",
      value:
        issue.latitude !==
          null &&
        issue.longitude !==
          null
          ? `${issue.latitude.toFixed(
              6
            )}, ${issue.longitude.toFixed(
              6
            )}`
          : "GPS coordinates not available.",
    },
  ];

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "radial-gradient(circle at top, #18222e 0%, #0b0f14 45%, #070a0d 100%)",
        color:
          "white",
        padding:
          "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth:
            "1000px",
          margin:
            "0 auto",
        }}
      >
        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push(
              "/my-issues"
            )
          }
          style={{
            background:
              "transparent",
            border:
              "none",
            color:
              "#9ca3af",
            cursor:
              "pointer",
            fontSize:
              "15px",
            marginBottom:
              "24px",
          }}
        >
          ← Back to My Issues
        </button>

        {/* HEADER */}

        <div
          style={{
            marginBottom:
              "28px",
          }}
        >
          <div
            style={{
              fontSize:
                "14px",
              color:
                "#60a5fa",
              fontWeight:
                700,
              marginBottom:
                "8px",
              letterSpacing:
                "0.5px",
            }}
          >
            KARMAFACIE
          </div>

          <h1
            style={{
              fontSize:
                "34px",
              margin:
                "0 0 10px",
              fontWeight:
                800,
            }}
          >
            {issue.title ||
              "Civic Issue"}
          </h1>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                "10px",
              flexWrap:
                "wrap",
            }}
          >
            <span
              style={{
                color:
                  "#60a5fa",
                fontWeight:
                  700,
                fontSize:
                  "14px",
              }}
            >
              {
                issue.category
              }
            </span>

            <span
              style={{
                background:
                  "rgba(255,255,255,0.06)",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                borderRadius:
                  "999px",
                padding:
                  "7px 12px",
                fontSize:
                  "13px",
                fontWeight:
                  700,
              }}
            >
              {getStatusIcon(
                issue.status
              )}{" "}
              {getStatusLabel(
                issue.status
              )}
            </span>
          </div>
        </div>

        {/* PHOTO EVIDENCE */}

        {photoUrl && (
          <section
            style={{
              ...panelStyle,
              padding:
                0,
              overflow:
                "hidden",
            }}
          >
            <div
              style={{
                padding:
                  "20px 24px",
                borderBottom:
                  "1px solid rgba(255,255,255,0.06)",
                fontWeight:
                  700,
              }}
            >
              📷 Photo Evidence
            </div>

            <div
              style={{
                background:
                  "#05080b",
                display:
                  "flex",
                justifyContent:
                  "center",
              }}
            >
              <img
                src={
                  photoUrl
                }
                alt={
                  issue.title ||
                  "Civic issue evidence"
                }
                style={{
                  width:
                    "100%",
                  maxHeight:
                    "620px",
                  objectFit:
                    "contain",
                  display:
                    "block",
                }}
              />
            </div>
          </section>
        )}

        {/* ISSUE INFORMATION */}

        <section
          style={
            panelStyle
          }
        >
          <h2
            style={{
              fontSize:
                "21px",
              margin:
                "0 0 18px",
            }}
          >
            Issue Information
          </h2>

          <p
            style={{
              color:
                "#d1d5db",
              lineHeight:
                1.7,
              margin:
                "0 0 18px",
            }}
          >
            {issue.description ||
              "No description provided."}
          </p>

          {issue.reported_city && (
            <div
              style={{
                color:
                  "#9ca3af",
                fontSize:
                  "14px",
                marginBottom:
                  "8px",
              }}
            >
              🏙️ Reported from:{" "}
              <strong
                style={{
                  color:
                    "#d1d5db",
                }}
              >
                {
                  issue.reported_city
                }
                {issue.reported_state
                  ? `, ${issue.reported_state}`
                  : ""}
              </strong>
            </div>
          )}

          {issue.location_text && (
            <div
              style={{
                color:
                  "#9ca3af",
                fontSize:
                  "14px",
                marginBottom:
                  "8px",
              }}
            >
              📍 Location:{" "}
              <strong
                style={{
                  color:
                    "#d1d5db",
                }}
              >
                {
                  issue.location_text
                }
              </strong>
            </div>
          )}

          {issue.latitude !==
            null &&
            issue.longitude !==
              null && (
              <div
                style={{
                  color:
                    "#6b7280",
                  fontSize:
                    "13px",
                }}
              >
                GPS:{" "}
                {issue.latitude.toFixed(
                  6
                )}
                ,{" "}
                {issue.longitude.toFixed(
                  6
                )}
              </div>
            )}

          <div
            style={{
              color:
                "#6b7280",
              fontSize:
                "13px",
              marginTop:
                "14px",
            }}
          >
            Reported:{" "}
            {formatDate(
              issue.reported_at
            )}
          </div>
        </section>

        {/* COMPLAINT JOURNEY */}

        <section
          style={
            panelStyle
          }
        >
          <div
            style={{
              marginBottom:
                "22px",
            }}
          >
            <h2
              style={{
                fontSize:
                  "21px",
                margin:
                  "0 0 8px",
              }}
            >
              Complaint Journey
            </h2>

            <p
              style={{
                ...mutedTextStyle,
                margin:
                  0,
              }}
            >
              A combined KarmaFacie timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.
            </p>
          </div>

          <div
            style={{
              display:
                "grid",
              gap:
                "12px",
            }}
          >
            {journeySteps.map(
              (step, index) => (
                <div
                  key={step.key}
                  style={{
                    display:
                      "flex",
                    gap:
                      "12px",
                    alignItems:
                      "stretch",
                  }}
                >
                  <div
                    style={{
                      width:
                        "30px",
                      minWidth:
                        "30px",
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                    }}
                  >
                    <div
                      style={{
                        width:
                          "30px",
                        height:
                          "30px",
                        borderRadius:
                          "50%",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        background:
                          step.completed
                            ? "rgba(34,197,94,0.14)"
                            : "rgba(148,163,184,0.06)",
                        border:
                          step.completed
                            ? "1px solid rgba(34,197,94,0.28)"
                            : "1px solid rgba(148,163,184,0.14)",
                        color:
                          step.completed
                            ? "#86efac"
                            : "#64748b",
                        fontSize:
                          "13px",
                        fontWeight:
                          800,
                      }}
                    >
                      {step.completed ? "✓" : index + 1}
                    </div>

                    {index <
                      journeySteps.length - 1 && (
                      <div
                        style={{
                          flex:
                            1,
                          width:
                            "2px",
                          minHeight:
                            "14px",
                          marginTop:
                            "6px",
                          background:
                            "rgba(148,163,184,0.12)",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      flex:
                        1,
                      background:
                        "rgba(255,255,255,0.025)",
                      border:
                        step.completed
                          ? "1px solid rgba(34,197,94,0.14)"
                          : "1px solid rgba(255,255,255,0.06)",
                      borderRadius:
                        "14px",
                      padding:
                        "13px 14px",
                      marginBottom:
                        index <
                        journeySteps.length - 1
                          ? "0"
                          : undefined,
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        gap:
                          "10px",
                        alignItems:
                          "baseline",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            "15px",
                          fontWeight:
                            700,
                          color:
                            step.completed
                              ? "#f8fafc"
                              : "#94a3b8",
                        }}
                      >
                        {step.label}
                      </div>

                      {step.timestamp && (
                        <div
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              "11px",
                          }}
                        >
                          {formatDate(
                            step.timestamp
                          )}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                        fontSize:
                          "12px",
                        lineHeight:
                          1.5,
                        marginTop:
                          "5px",
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div
            style={{
              marginTop:
                "14px",
              padding:
                "12px 14px",
              borderRadius:
                "12px",
              background:
                "rgba(96,165,250,0.05)",
              border:
                "1px solid rgba(96,165,250,0.12)",
              color:
                "#93c5fd",
              fontSize:
                "12px",
              lineHeight:
                1.5,
            }}
          >
            Current KarmaFacie status: <strong>{issue ? getStatusLabel(issue.status) : "Loading"}</strong>
          </div>
        </section>

        {/* STATUS HISTORY */}

        <section
          style={
            panelStyle
          }
        >
          <div
            style={{
              marginBottom:
                "22px",
            }}
          >
            <h2
              style={{
                fontSize:
                  "21px",
                margin:
                  "0 0 8px",
              }}
            >
              Status History
            </h2>

            <p
              style={{
                ...mutedTextStyle,
                margin:
                  0,
              }}
            >
              This timeline shows
              status changes actually
              recorded in KarmaFacie.
            </p>
          </div>

          {history.length ===
          0 ? (
            <div
              style={{
                padding:
                  "18px",
                borderRadius:
                  "14px",
                background:
                  "rgba(148,163,184,0.04)",
                border:
                  "1px solid rgba(148,163,184,0.1)",
                color:
                  "#94a3b8",
                fontSize:
                  "13px",
                lineHeight:
                  1.6,
              }}
            >
              No status-history
              records are currently
              available for this issue.
            </div>
          ) : (
            <div
              style={{
                position:
                  "relative",
              }}
            >
              <div
                style={{
                  position:
                    "absolute",
                  left:
                    "16px",
                  top:
                    "18px",
                  bottom:
                    "18px",
                  width:
                    "2px",
                  background:
                    "rgba(96,165,250,0.18)",
                }}
              />

              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "18px",
                }}
              >
                {history.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      style={{
                        position:
                          "relative",
                        display:
                          "flex",
                        gap:
                          "14px",
                      }}
                    >
                      <div
                        style={{
                          position:
                            "relative",
                          zIndex:
                            2,
                          width:
                            "34px",
                          height:
                            "34px",
                          minWidth:
                            "34px",
                          borderRadius:
                            "50%",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          background:
                            index ===
                            history.length -
                              1
                              ? "#ff7a00"
                              : "#1e293b",
                          border:
                            index ===
                            history.length -
                              1
                              ? "2px solid #ffb067"
                              : "2px solid #334155",
                          fontSize:
                            "15px",
                        }}
                      >
                        {getStatusIcon(
                          item.new_status
                        )}
                      </div>

                      <div
                        style={{
                          flex:
                            1,
                          background:
                            "rgba(255,255,255,0.025)",
                          border:
                            index ===
                            history.length -
                              1
                              ? "1px solid rgba(255,122,0,0.22)"
                              : "1px solid rgba(255,255,255,0.06)",
                          borderRadius:
                            "14px",
                          padding:
                            "15px",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#6b7280",
                            fontSize:
                              "12px",
                            marginBottom:
                              "7px",
                          }}
                        >
                          {formatDate(
                            item.created_at
                          )}
                        </div>

                        <div
                          style={{
                            fontSize:
                              "16px",
                            fontWeight:
                              700,
                            marginBottom:
                              "8px",
                          }}
                        >
                          {item.old_status
                            ? `${getStatusLabel(
                                item.old_status
                              )} → ${getStatusLabel(
                                item.new_status
                              )}`
                            : `Issue status set to ${getStatusLabel(
                                item.new_status
                              )}`}
                        </div>

                        <div
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            gap:
                              "6px",
                            background:
                              "rgba(96,165,250,0.08)",
                            border:
                              "1px solid rgba(96,165,250,0.15)",
                            borderRadius:
                              "999px",
                            padding:
                              "6px 10px",
                            color:
                              "#93c5fd",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                            marginBottom:
                              "10px",
                          }}
                        >
                          {getStatusIcon(
                            item.new_status
                          )}{" "}
                          {getStatusLabel(
                            item.new_status
                          )}
                        </div>

                        <div
                          style={{
                            color:
                              "#9ca3af",
                            fontSize:
                              "12px",
                            marginBottom:
                              item.note
                                ? "9px"
                                : 0,
                          }}
                        >
                          {getActorIcon(
                            item.actor_type
                          )}{" "}
                          Recorded by{" "}
                          <strong
                            style={{
                              color:
                                "#d1d5db",
                            }}
                          >
                            {getActorLabel(
                              item.actor_type
                            )}
                          </strong>
                        </div>

                        {item.note && (
                          <div
                            style={{
                              color:
                                "#94a3b8",
                              fontSize:
                                "13px",
                              lineHeight:
                                1.6,
                              paddingTop:
                                "9px",
                              borderTop:
                                "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            {item.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {history.length >
            0 && (
            <div
              style={{
                marginTop:
                  "18px",
                padding:
                  "12px 14px",
                borderRadius:
                  "12px",
                background:
                  "rgba(255,255,255,0.025)",
                color:
                  "#64748b",
                fontSize:
                  "11px",
                lineHeight:
                  1.5,
              }}
            >
              Status history is generated
              from recorded KarmaFacie
              status events. It does not
              imply that a government
              authority has changed the
              status unless the event is
              explicitly recorded as
              coming from an authority.
            </div>
          )}
        </section>

        {/* AUTHORITY ROUTING */}

        {authority ? (
          <section
            style={{
              ...panelStyle,
              background:
                "rgba(34,197,94,0.05)",
              border:
                "1px solid rgba(34,197,94,0.18)",
            }}
          >
            <div
              style={{
                color:
                  "#86efac",
                fontSize:
                  "12px",
                fontWeight:
                  700,
                letterSpacing:
                  "0.5px",
                marginBottom:
                  "10px",
              }}
            >
              DIRECTORY ROUTING
            </div>

            <h2
              style={{
                fontSize:
                  "21px",
                margin:
                  "0 0 16px",
              }}
            >
              🏛️{" "}
              {
                authority.authority_name
              }
            </h2>

            {authority.department_name && (
              <div
                style={{
                  color:
                    "#d1d5db",
                  fontSize:
                    "14px",
                  marginBottom:
                    "8px",
                }}
              >
                <strong>
                  Department:
                </strong>{" "}
                {
                  authority.department_name
                }
              </div>
            )}

            {authority.sub_department_name && (
              <div
                style={{
                  color:
                    "#d1d5db",
                  fontSize:
                    "14px",
                  marginBottom:
                    "8px",
                }}
              >
                <strong>
                  Sub-Department:
                </strong>{" "}
                {
                  authority.sub_department_name
                }
              </div>
            )}

            {authority.official_complaint_type && (
              <div
                style={{
                  color:
                    "#d1d5db",
                  fontSize:
                    "14px",
                  marginBottom:
                    "8px",
                }}
              >
                <strong>
                  Official Complaint Type:
                </strong>{" "}
                {
                  authority.official_complaint_type
                }
              </div>
            )}

            <div
              style={{
                color:
                  "#d1d5db",
                fontSize:
                  "14px",
                marginBottom:
                  "8px",
              }}
            >
              <strong>
                Issue type:
              </strong>{" "}
              {
                authority.issue_category
              }
            </div>

            {authority.submission_method && (
              <div
                style={{
                  color:
                    "#d1d5db",
                  fontSize:
                    "14px",
                  marginBottom:
                    "8px",
                }}
              >
                <strong>
                  Channel:
                </strong>{" "}
                {
                  authority.submission_method
                }
              </div>
            )}

            {authority.notes && (
              <div
                style={{
                  color:
                    "#9ca3af",
                  fontSize:
                    "13px",
                  lineHeight:
                    1.6,
                  marginTop:
                    "12px",
                }}
              >
                {
                  authority.notes
                }
              </div>
            )}

            {authority.submission_mode ===
              "DIRECT_LINK" &&
              authority.grievance_url && (
                <div
                  style={{
                    marginTop:
                      "16px",
                  }}
                >
                  <a
                    href={
                      authority.grievance_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      void markOfficialComplaintChannelOpened();
                    }}
                    style={{
                      ...buttonStyle,
                      background:
                        "#2563eb",
                      textDecoration:
                        "none",
                      display:
                        "inline-block",
                    }}
                  >
                    Open Official
                    Complaint Channel →
                  </a>

                  <div
                    style={{
                      color:
                        "#64748b",
                      fontSize:
                        "11px",
                      lineHeight:
                        1.5,
                      marginTop:
                        "8px",
                    }}
                  >
                    This opens the
                    official complaint
                    channel for the
                    matched authority.
                    KarmaFacie does not
                    submit the complaint
                    automatically through
                    this route.
                  </div>
                </div>
              )}

            {authority.verified_at && (
              <div
                style={{
                  color:
                    "#6b7280",
                  fontSize:
                    "11px",
                  marginTop:
                    "12px",
                }}
              >
                Directory information
                verified:{" "}
                {formatDateOnly(
                  authority.verified_at
                )}
              </div>
            )}
          </section>
        ) : (
          <section
            style={
              panelStyle
            }
          >
            <div
              style={
                mutedTextStyle
              }
            >
              ℹ️ No verified directory
              route is currently attached
              to this report.
            </div>
          </section>
        )}

        {/* OFFICIAL SUBMISSION */}

        <section
          style={{
            ...panelStyle,
            background:
              "rgba(37,99,235,0.05)",
            border:
              "1px solid rgba(96,165,250,0.18)",
          }}
        >
          <div
            style={{
              color:
                "#93c5fd",
              fontSize:
                "12px",
              fontWeight:
                700,
              letterSpacing:
                "0.5px",
              marginBottom:
                "10px",
            }}
          >
            OFFICIAL SUBMISSION
          </div>

          <h2
            style={{
              fontSize:
                "21px",
              margin:
                "0 0 10px",
            }}
          >
            📤 Review Your Complaint
          </h2>

          <p
            style={{
              ...mutedTextStyle,
              margin:
                "0 0 18px",
            }}
          >
            KarmaFacie has already
            collected the information
            needed for this report.
            Review the prepared package
            before confirming it for the
            selected authority.
          </p>

          {!submission ? (
            <>
              <div
                style={{
                  padding:
                    "15px 16px",
                  borderRadius:
                    "14px",
                  background:
                    "rgba(255,255,255,0.025)",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "13px",
                  lineHeight:
                    1.6,
                }}
              >
                Your complaint package has
                not been prepared yet.
                KarmaFacie will assemble it
                from the information already
                stored for this issue.
              </div>

              <button
                type="button"
                onClick={() =>
                  void prepareSubmission()
                }
                disabled={
                  preparingSubmission ||
                  !authority
                }
                style={{
                  ...buttonStyle,
                  marginTop:
                    "16px",
                  background:
                    preparingSubmission ||
                    !authority
                      ? "#475569"
                      : "#2563eb",
                  cursor:
                    preparingSubmission ||
                    !authority
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {preparingSubmission
                  ? "Preparing Complaint..."
                  : "Prepare Complaint →"}
              </button>

              {!authority && (
                <div
                  style={{
                    ...mutedTextStyle,
                    marginTop:
                      "10px",
                    fontSize:
                      "12px",
                  }}
                >
                  A verified authority
                  route is required before
                  the submission package can
                  be prepared.
                </div>
              )}
            </>
          ) : (
            <>
              {/* SUBMISSION STATUS */}

              <div
                style={{
                  padding:
                    "14px 16px",
                  borderRadius:
                    "12px",
                  background:
                    submissionConfirmed
                      ? "rgba(34,197,94,0.07)"
                      : submission.submission_status ===
                          "FAILED"
                        ? "rgba(239,68,68,0.07)"
                        : "rgba(96,165,250,0.07)",
                  border:
                    submissionConfirmed
                      ? "1px solid rgba(34,197,94,0.18)"
                      : submission.submission_status ===
                          "FAILED"
                        ? "1px solid rgba(239,68,68,0.18)"
                        : "1px solid rgba(96,165,250,0.16)",
                  marginBottom:
                    "18px",
                }}
              >
                <div
                  style={{
                    color:
                      submissionConfirmed
                        ? "#86efac"
                        : submission.submission_status ===
                            "FAILED"
                          ? "#fca5a5"
                          : "#93c5fd",
                    fontSize:
                      "14px",
                    fontWeight:
                      700,
                  }}
                >
                  {submissionConfirmed
                    ? "✓ Complaint details confirmed"
                    : submission.submission_status ===
                        "FAILED"
                      ? "⚠ Submission preparation needs attention"
                      : "✓ Complaint package prepared"}
                </div>

                <div
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "12px",
                    marginTop:
                      "5px",
                  }}
                >
                  Submission record #
                  {
                    submission.id
                  }
                </div>
              </div>

              {/* COMPLAINT PREVIEW */}

              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "10px",
                }}
              >
                <InfoBox label="Authority">
                  <strong
                    style={{
                      color:
                        "#e5e7eb",
                    }}
                  >
                    {
                      authority?.authority_name ||
                      submission.provider_name ||
                      "Not specified"
                    }
                  </strong>
                </InfoBox>

                {authority?.department_name && (
                  <InfoBox label="Department">
                    {
                      authority.department_name
                    }
                  </InfoBox>
                )}

                {authority?.sub_department_name && (
                  <InfoBox label="Sub-Department">
                    {
                      authority.sub_department_name
                    }
                  </InfoBox>
                )}

                {authority?.official_complaint_type && (
                  <InfoBox label="Official Complaint Type">
                    {
                      authority.official_complaint_type
                    }
                  </InfoBox>
                )}

                <InfoBox label="Issue">
                  <strong
                    style={{
                      color:
                        "#e5e7eb",
                    }}
                  >
                    {issue.title ||
                      "Civic Issue"}
                  </strong>

                  <div
                    style={{
                      color:
                        "#94a3b8",
                      marginTop:
                        "4px",
                    }}
                  >
                    {
                      issue.category
                    }
                  </div>
                </InfoBox>

                <InfoBox label="Description">
                  {issue.description ||
                    "No description provided."}
                </InfoBox>

                <InfoBox label="Location">
                  <div>
                    {
                      issue.location_text ||
                      "Location not provided."
                    }
                  </div>

                  {(issue.reported_city ||
                    issue.reported_state) && (
                    <div
                      style={{
                        color:
                          "#94a3b8",
                        marginTop:
                          "4px",
                      }}
                    >
                      {
                        issue.reported_city
                      }
                      {issue.reported_state
                        ? `, ${issue.reported_state}`
                        : ""}
                    </div>
                  )}

                  {issue.latitude !==
                    null &&
                    issue.longitude !==
                      null && (
                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                          marginTop:
                            "5px",
                        }}
                      >
                        GPS:{" "}
                        {issue.latitude.toFixed(
                          6
                        )}
                        ,{" "}
                        {issue.longitude.toFixed(
                          6
                        )}
                      </div>
                    )}
                </InfoBox>

                <InfoBox label="Evidence">
                  {photoUrl ? (
                    <span
                      style={{
                        color:
                          "#86efac",
                      }}
                    >
                      ✓ Photo evidence
                      attached
                    </span>
                  ) : (
                    <span>
                      No photo evidence
                      attached
                    </span>
                  )}
                </InfoBox>

                <InfoBox label="Submission Route">
                  {getSubmissionModeLabel(
                    submission.submission_mode
                  )}
                </InfoBox>
              </div>

              {/* CITIZEN CONFIRMATION */}

              {!submissionConfirmed &&
                submission.submission_status !==
                  "FAILED" && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "16px",
                      borderRadius:
                        "14px",
                      background:
                        "rgba(255,255,255,0.025)",
                      border:
                        "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <label
                      style={{
                        display:
                          "flex",
                        gap:
                          "10px",
                        alignItems:
                          "flex-start",
                        color:
                          "#d1d5db",
                        fontSize:
                          "13px",
                        lineHeight:
                          1.6,
                        cursor:
                          "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          consentChecked
                        }
                        onChange={(
                          event
                        ) =>
                          setConsentChecked(
                            event.target
                              .checked
                          )
                        }
                        style={{
                          marginTop:
                            "3px",
                          width:
                            "16px",
                          height:
                            "16px",
                          accentColor:
                            "#2563eb",
                        }}
                      />

                      <span>
                        I confirm that the
                        complaint details,
                        location and evidence
                        shown above are correct
                        and may be used for the
                        official submission
                        process.
                      </span>
                    </label>

                    <button
                      type="button"
                      disabled={
                        confirmingSubmission ||
                        !consentChecked
                      }
                      onClick={() =>
                        void confirmSubmission()
                      }
                      style={{
                        ...buttonStyle,
                        marginTop:
                          "14px",
                        background:
                          confirmingSubmission ||
                          !consentChecked
                            ? "#475569"
                            : "#2563eb",
                        cursor:
                          confirmingSubmission ||
                          !consentChecked
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {confirmingSubmission
                        ? "Confirming..."
                        : "Confirm & Continue →"}
                    </button>

                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "11px",
                        lineHeight:
                          1.5,
                        marginTop:
                          "9px",
                      }}
                    >
                      Confirmation records
                      your approval of this
                      package. It does not itself
                      mean that a government
                      complaint has been submitted.
                    </div>
                  </div>
                )}

              {/* CONFIRMED STATE */}

              {submission &&
                submissionConfirmed && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "16px",
                      borderRadius:
                        "14px",
                      background:
                        "rgba(34,197,94,0.06)",
                      border:
                        "1px solid rgba(34,197,94,0.18)",
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#86efac",
                        fontSize:
                          "14px",
                        fontWeight:
                          700,
                      }}
                    >
                      ✓ Ready for official submission
                    </div>

                    {submission.citizen_confirmed_at && (
                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize:
                            "11px",
                          marginTop:
                            "5px",
                        }}
                      >
                        Confirmed on{" "}
                        {formatDate(
                          submission.citizen_confirmed_at
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* SUBMISSION GATEWAY */}

              {submission &&
                submissionConfirmed &&
                submission.submission_mode ===
                  "DIRECT_LINK" &&
                submission.submission_status !==
                  "SUBMITTED" && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "16px",
                      borderRadius:
                        "14px",
                      background:
                        "rgba(37,99,235,0.06)",
                      border:
                        "1px solid rgba(96,165,250,0.16)",
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#93c5fd",
                        fontSize:
                          "14px",
                        fontWeight:
                          700,
                        marginBottom:
                          "7px",
                      }}
                    >
                      Next step: Submission Gateway
                    </div>

                    <div
                      style={{
                        ...mutedTextStyle,
                        fontSize:
                          "12px",
                      }}
                    >
                      Your complaint package
                      has been prepared and
                      confirmed. KarmaFacie will
                      now check the configured
                      authority submission route.
                      For the current CSMC route,
                      the gateway will direct you
                      to the official complaint
                      system rather than claiming
                      an automatic government
                      submission.
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void submitThroughGateway()
                      }
                      disabled={
                        submittingSubmission
                      }
                      style={{
                        ...buttonStyle,
                        marginTop:
                          "14px",
                        background:
                          submittingSubmission
                            ? "#475569"
                            : "#2563eb",
                        cursor:
                          submittingSubmission
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {submittingSubmission
                        ? "Checking Submission Route..."
                        : "Continue to Submission Gateway →"}
                    </button>

                    {gatewayMessage && (
                      <div
                        style={{
                          marginTop:
                            "12px",
                          padding:
                            "12px 14px",
                          borderRadius:
                            "10px",
                          background:
                            "rgba(96,165,250,0.07)",
                          border:
                            "1px solid rgba(96,165,250,0.14)",
                          color:
                            "#bfdbfe",
                          fontSize:
                            "12px",
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          gatewayMessage
                        }
                      </div>
                    )}

                    {gatewayUrl && (
                      <a
                        href={gatewayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          void markOfficialComplaintChannelOpened();
                        }}
                        style={{
                          ...buttonStyle,
                          marginTop:
                            "12px",
                          background:
                            "#2563eb",
                          textDecoration:
                            "none",
                          display:
                            "inline-block",
                        }}
                      >
                        Open Official
                        Complaint Channel →
                      </a>
                    )}

                    {officialHandoffOpenedAt && (
                      <div
                        style={{
                          marginTop:
                            "12px",
                          padding:
                            "12px 14px",
                          borderRadius:
                            "10px",
                          background:
                            "rgba(34,197,94,0.07)",
                          border:
                            "1px solid rgba(34,197,94,0.16)",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#86efac",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          ✓ Official form opened
                        </div>
                        <div
                          style={{
                            color:
                              "#94a3b8",
                            fontSize:
                              "11px",
                            lineHeight:
                              1.5,
                            marginTop:
                              "4px",
                          }}
                        >
                          KarmaFacie recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "11px",
                        lineHeight:
                          1.5,
                        marginTop:
                          "9px",
                      }}
                    >
                      Opening the official
                      channel does not itself
                      mean that a government
                      complaint has been submitted.
                      Any official submission or
                      reference number must come
                      from the government system.
                    </div>
                  </div>
                )}

              {/* CITIZEN REPORTED OFFICIAL SUBMISSION */}

              {submission &&
                submissionConfirmed &&
                submission.submission_mode ===
                  "DIRECT_LINK" &&
                officialHandoffOpenedAt &&
                submission.submission_status !==
                  "SUBMITTED" && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "16px",
                      borderRadius:
                        "14px",
                      background:
                        "rgba(168,85,247,0.05)",
                      border:
                        "1px solid rgba(168,85,247,0.16)",
                    }}
                  >
                    <div
                      style={{
                        color:
                          "#d8b4fe",
                        fontSize:
                          "14px",
                        fontWeight:
                          700,
                        marginBottom:
                          "7px",
                      }}
                    >
                      {submission.citizen_reported_submitted_at
                        ? "✓ Submission reported by you"
                        : "After you submit on the official form"}
                    </div>

                    {submission.citizen_reported_submitted_at ? (
                      <>
                        <div
                          style={{
                            ...mutedTextStyle,
                            fontSize:
                              "12px",
                          }}
                        >
                          KarmaFacie has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.
                        </div>

                        <div
                          style={{
                            marginTop:
                              "12px",
                            color:
                              "#e5e7eb",
                            fontSize:
                              "13px",
                          }}
                        >
                          <strong>Reference number:</strong>{" "}
                          {submission.official_reference_number}
                        </div>

                        {submission.official_submission_notes && (
                          <div
                            style={{
                              marginTop:
                                "7px",
                              color:
                                "#cbd5e1",
                              fontSize:
                                "12px",
                              lineHeight:
                                1.5,
                            }}
                          >
                            <strong>Notes:</strong>{" "}
                            {submission.official_submission_notes}
                          </div>
                        )}

                        {submission.citizen_reported_submitted_at && (
                          <div
                            style={{
                              marginTop:
                                "7px",
                              color:
                                "#94a3b8",
                              fontSize:
                                "11px",
                            }}
                          >
                            Recorded on{" "}
                            {formatDate(
                              submission.citizen_reported_submitted_at
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            ...mutedTextStyle,
                            fontSize:
                              "12px",
                          }}
                        >
                          Once the government form confirms your submission, enter the reference/complaint number here. KarmaFacie will store it as a citizen-provided reference; it will not be treated as an official KarmaFacie submission confirmation.
                        </div>

                        <div
                          style={{
                            display:
                              "grid",
                            gap:
                              "10px",
                            marginTop:
                              "12px",
                          }}
                        >
                          <div>
                            <label
                              htmlFor="official-reference-number"
                              style={{
                                display:
                                  "block",
                                color:
                                  "#cbd5e1",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "6px",
                              }}
                            >
                              Government Complaint / Reference Number
                            </label>
                            <input
                              id="official-reference-number"
                              value={
                                referenceNumber
                              }
                              onChange={(event) =>
                                setReferenceNumber(
                                  event.target.value
                                )
                              }
                              placeholder="Enter the number shown after successful submission"
                              style={{
                                width:
                                  "100%",
                                boxSizing:
                                  "border-box",
                                padding:
                                  "11px 12px",
                                borderRadius:
                                  "9px",
                                border:
                                  "1px solid rgba(148,163,184,0.2)",
                                background:
                                  "rgba(15,23,42,0.72)",
                                color:
                                  "#e5e7eb",
                                fontSize:
                                  "12px",
                                outline:
                                  "none",
                              }}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="official-submission-notes"
                              style={{
                                display:
                                  "block",
                                color:
                                  "#cbd5e1",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  700,
                                marginBottom:
                                  "6px",
                              }}
                            >
                              Notes (optional)
                            </label>
                            <textarea
                              id="official-submission-notes"
                              value={
                                submissionNotes
                              }
                              onChange={(event) =>
                                setSubmissionNotes(
                                  event.target.value
                                )
                              }
                              rows={3}
                              placeholder="Example: submitted on the CSMC website and received confirmation screen"
                              style={{
                                width:
                                  "100%",
                                boxSizing:
                                  "border-box",
                                padding:
                                  "11px 12px",
                                borderRadius:
                                  "9px",
                                border:
                                  "1px solid rgba(148,163,184,0.2)",
                                background:
                                  "rgba(15,23,42,0.72)",
                                color:
                                  "#e5e7eb",
                                fontSize:
                                  "12px",
                                lineHeight:
                                  1.5,
                                resize:
                                  "vertical",
                                outline:
                                  "none",
                              }}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              void recordOfficialComplaintReference()
                            }
                            disabled={
                              savingOfficialReference
                            }
                            style={{
                              ...buttonStyle,
                              background:
                                savingOfficialReference
                                  ? "#475569"
                                  : "#7c3aed",
                              cursor:
                                savingOfficialReference
                                  ? "not-allowed"
                                  : "pointer",
                              justifySelf:
                                "start",
                            }}
                          >
                            {savingOfficialReference
                              ? "Saving Reference..."
                              : "Save Submission Reference →"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

              {/* API MODE */}

              {submission &&
                submissionConfirmed &&
                submission.submission_mode ===
                  "API" && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "14px 16px",
                      borderRadius:
                        "12px",
                      background:
                        "rgba(96,165,250,0.06)",
                      border:
                        "1px solid rgba(96,165,250,0.16)",
                      color:
                        "#93c5fd",
                      fontSize:
                        "12px",
                      lineHeight:
                        1.5,
                    }}
                  >
                    API submission mode is
                    configured for this authority.
                    The actual government API call
                    will only be enabled after an
                    authorized integration is connected.
                  </div>
                )}

              {/* ALREADY SUBMITTED */}

              {submission.submission_status ===
                "SUBMITTED" && (
                <div
                  style={{
                    marginTop:
                      "18px",
                    padding:
                      "16px",
                    borderRadius:
                      "14px",
                    background:
                      "rgba(34,197,94,0.06)",
                    border:
                      "1px solid rgba(34,197,94,0.18)",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#86efac",
                      fontSize:
                        "14px",
                      fontWeight:
                        700,
                      marginBottom:
                        "8px",
                    }}
                  >
                    ✓ Official submission recorded
                  </div>

                  {submission.official_reference_id && (
                    <div
                      style={{
                        color:
                          "#d1d5db",
                        fontSize:
                          "13px",
                      }}
                    >
                      <strong>
                        Official reference:
                      </strong>{" "}
                      {
                        submission.official_reference_id
                      }
                    </div>
                  )}

                  {submission.submitted_at && (
                    <div
                      style={{
                        color:
                          "#94a3b8",
                        fontSize:
                          "12px",
                        marginTop:
                          "5px",
                      }}
                    >
                      Submitted:{" "}
                      {formatDate(
                        submission.submitted_at
                      )}
                    </div>
                  )}

                  {submission.official_reference_url && (
                    <a
                      href={
                        submission.official_reference_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display:
                          "inline-block",
                        marginTop:
                          "12px",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "9px",
                        background:
                          "rgba(96,165,250,0.12)",
                        border:
                          "1px solid rgba(96,165,250,0.18)",
                        color:
                          "#93c5fd",
                        textDecoration:
                          "none",
                        fontSize:
                          "12px",
                        fontWeight:
                          700,
                      }}
                    >
                      View Official Reference →
                    </a>
                  )}
                </div>
              )}

              {/* SUBMISSION ERROR */}

              {submission.error_message && (
                <div
                  style={{
                    marginTop:
                      "14px",
                    padding:
                      "12px 14px",
                    borderRadius:
                      "10px",
                    background:
                      "rgba(239,68,68,0.08)",
                    border:
                      "1px solid rgba(239,68,68,0.18)",
                    color:
                      "#fca5a5",
                    fontSize:
                      "12px",
                    lineHeight:
                      1.5,
                  }}
                >
                  {
                    submission.error_message
                  }
                </div>
              )}

              {/* RETRY */}

              {submission.submission_status ===
                "FAILED" && (
                <button
                  type="button"
                  onClick={() =>
                    void prepareSubmission()
                  }
                  disabled={
                    preparingSubmission
                  }
                  style={{
                    ...buttonStyle,
                    marginTop:
                      "14px",
                    background:
                      preparingSubmission
                        ? "#475569"
                        : "#2563eb",
                    cursor:
                      preparingSubmission
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {preparingSubmission
                    ? "Preparing..."
                    : "Try Again →"}
                </button>
              )}
            </>
          )}

          {submissionError && (
            <div
              style={{
                marginTop:
                  "14px",
                padding:
                  "12px 14px",
                borderRadius:
                  "10px",
                background:
                  "rgba(239,68,68,0.08)",
                border:
                  "1px solid rgba(239,68,68,0.18)",
                color:
                  "#fca5a5",
                fontSize:
                  "12px",
                lineHeight:
                  1.5,
              }}
            >
              {submissionError}
            </div>
          )}
        </section>

        {/* FOLLOW-UP TRACKING */}

        <section
          style={
            panelStyle
          }
        >
          <div
            style={{
              marginBottom:
                "20px",
            }}
          >
            <h2
              style={{
                fontSize:
                  "21px",
                margin:
                  "0 0 8px",
              }}
            >
              Follow-up &amp; Government Updates
            </h2>

            <p
              style={{
                ...mutedTextStyle,
                margin:
                  0,
              }}
            >
              Record what happened after your complaint was submitted. These updates are citizen-reported unless KarmaFacie later receives verifiable information from the authority.
            </p>
          </div>

          <div
            style={{
              display:
                "grid",
              gap:
                "12px",
              padding:
                "16px",
              borderRadius:
                "14px",
              background:
                "rgba(96,165,250,0.04)",
              border:
                "1px solid rgba(96,165,250,0.12)",
            }}
          >
            <div>
              <label
                htmlFor="follow-up-status"
                style={{
                  display:
                    "block",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                  marginBottom:
                    "6px",
                }}
              >
                What happened after submission?
              </label>

              <select
                id="follow-up-status"
                value={
                  followUpStatus
                }
                onChange={(event) =>
                  setFollowUpStatus(
                    event.target.value as FollowUpStatus
                  )
                }
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "11px 12px",
                  borderRadius:
                    "9px",
                  border:
                    "1px solid rgba(148,163,184,0.2)",
                  background:
                    "rgba(15,23,42,0.72)",
                  color:
                    "#e5e7eb",
                  fontSize:
                    "12px",
                  outline:
                    "none",
                }}
              >
                <option value="NO_RESPONSE">
                  No Response / Awaiting Update
                </option>
                <option value="ACKNOWLEDGED">
                  Acknowledged
                </option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="RESOLVED">
                  Resolved
                </option>
                <option value="CLOSED">
                  Closed
                </option>
                <option value="REJECTED">
                  Rejected
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="follow-up-note"
                style={{
                  display:
                    "block",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                  marginBottom:
                    "6px",
                }}
              >
                Update note (optional)
              </label>

              <textarea
                id="follow-up-note"
                value={
                  followUpNote
                }
                onChange={(event) =>
                  setFollowUpNote(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Example: I received an SMS saying the complaint was acknowledged"
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "11px 12px",
                  borderRadius:
                    "9px",
                  border:
                    "1px solid rgba(148,163,184,0.2)",
                  background:
                    "rgba(15,23,42,0.72)",
                  color:
                    "#e5e7eb",
                  fontSize:
                    "12px",
                  lineHeight:
                    1.5,
                  resize:
                    "vertical",
                  outline:
                    "none",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="follow-up-evidence"
                style={{
                  display:
                    "block",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                  marginBottom:
                    "6px",
                }}
              >
                Evidence attachment (optional)
              </label>

              <input
                id="follow-up-evidence"
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => {
                  const file =
                    event.target.files?.[0] ??
                    null;

                  if (!file) {
                    setFollowUpEvidence(null);
                    return;
                  }

                  const maxSize =
                    5 * 1024 * 1024;

                  const allowedType =
                    file.type.startsWith("image/") ||
                    file.type === "application/pdf";

                  if (!allowedType) {
                    setFollowUpEvidence(null);
                    setFollowUpError(
                      "Please choose an image or PDF file."
                    );
                    event.target.value = "";
                    return;
                  }

                  if (file.size > maxSize) {
                    setFollowUpEvidence(null);
                    setFollowUpError(
                      "Evidence file must be 5 MB or smaller."
                    );
                    event.target.value = "";
                    return;
                  }

                  setFollowUpError("");
                  setFollowUpEvidence(file);
                }}
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "10px 11px",
                  borderRadius:
                    "9px",
                  border:
                    "1px solid rgba(148,163,184,0.2)",
                  background:
                    "rgba(15,23,42,0.72)",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "12px",
                }}
              />

              <div
                style={{
                  marginTop:
                    "6px",
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                  lineHeight:
                    1.5,
                }}
              >
                Attach a photo or PDF that supports this update. Maximum 5 MB.
              </div>

              {followUpEvidence && (
                <div
                  style={{
                    marginTop:
                      "7px",
                    color:
                      "#93c5fd",
                    fontSize:
                      "11px",
                  }}
                >
                  Selected: {followUpEvidence.name}
                </div>
              )}
            </div>

            {followUpError && (
              <div
                style={{
                  padding:
                    "10px 12px",
                  borderRadius:
                    "9px",
                  background:
                    "rgba(239,68,68,0.08)",
                  border:
                    "1px solid rgba(239,68,68,0.16)",
                  color:
                    "#fca5a5",
                  fontSize:
                    "12px",
                  lineHeight:
                    1.5,
                }}
              >
                {followUpError}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                void recordFollowUp()
              }
              disabled={
                savingFollowUp
              }
              style={{
                ...buttonStyle,
                background:
                  savingFollowUp
                    ? "#475569"
                    : "#2563eb",
                cursor:
                  savingFollowUp
                    ? "not-allowed"
                    : "pointer",
                justifySelf:
                  "start",
              }}
            >
              {savingFollowUp
                ? "Saving Update..."
                : "Save Follow-up Update →"}
            </button>
          </div>

          <div
            style={{
              marginTop:
                "20px",
            }}
          >
            <div
              style={{
                color:
                  "#64748b",
                fontSize:
                  "11px",
                fontWeight:
                  700,
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.6px",
                marginBottom:
                  "10px",
              }}
            >
              Recorded follow-ups
            </div>

            {followups.length === 0 ? (
              <div
                style={{
                  padding:
                    "14px",
                  borderRadius:
                    "12px",
                  background:
                    "rgba(255,255,255,0.025)",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  color:
                    "#64748b",
                  fontSize:
                    "12px",
                  lineHeight:
                    1.5,
                }}
              >
                No citizen-reported follow-up updates have been recorded yet.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "10px",
                }}
              >
                {followups.map(
                  (followUp) => (
                    <div
                      key={
                        followUp.id
                      }
                      style={{
                        padding:
                          "14px",
                        borderRadius:
                          "12px",
                        background:
                          "rgba(255,255,255,0.025)",
                        border:
                          "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap:
                            "10px",
                          flexWrap:
                            "wrap",
                          alignItems:
                            "baseline",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#e5e7eb",
                            fontSize:
                              "13px",
                            fontWeight:
                              700,
                          }}
                        >
                          {followUpStatusLabel(
                            followUp.status
                          )}
                        </div>

                        <div
                          style={{
                            color:
                              "#64748b",
                            fontSize:
                              "11px",
                          }}
                        >
                          {formatDate(
                            followUp.created_at
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop:
                            "7px",
                          color:
                            "#94a3b8",
                          fontSize:
                            "11px",
                        }}
                      >
                        Citizen-reported update
                      </div>

                      <div
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap:
                            "6px",
                          marginTop:
                            "9px",
                          padding:
                            "6px 9px",
                          borderRadius:
                            "999px",
                          background:
                            followUp.verification_status ===
                            "VERIFIED"
                              ? "rgba(34,197,94,0.12)"
                              : followUp.verification_status ===
                                "NOT_VERIFIED"
                                ? "rgba(239,68,68,0.12)"
                                : "rgba(245,158,11,0.12)",
                          border:
                            followUp.verification_status ===
                            "VERIFIED"
                              ? "1px solid rgba(34,197,94,0.25)"
                              : followUp.verification_status ===
                                "NOT_VERIFIED"
                                ? "1px solid rgba(239,68,68,0.25)"
                                : "1px solid rgba(245,158,11,0.25)",
                          color:
                            followUp.verification_status ===
                            "VERIFIED"
                              ? "#86efac"
                              : followUp.verification_status ===
                                "NOT_VERIFIED"
                                ? "#fca5a5"
                                : "#fcd34d",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                        }}
                      >
                        {followUp.verification_status ===
                        "VERIFIED"
                          ? "✓ KarmaFacie verified"
                          : followUp.verification_status ===
                            "NOT_VERIFIED"
                            ? "⚠ Not verified"
                            : "⏳ Verification pending"}
                      </div>

                      {followUp.verification_status ===
                        "VERIFIED" && (
                        <div
                          style={{
                            marginTop:
                              "7px",
                            color:
                              "#94a3b8",
                            fontSize:
                              "11px",
                            lineHeight:
                              1.5,
                          }}
                        >
                          This is a KarmaFacie administrative verification,
                          not an official government confirmation.
                        </div>
                      )}

                      {followUp.verification_note && (
                        <div
                          style={{
                            marginTop:
                              "8px",
                            padding:
                              "9px 10px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(255,255,255,0.02)",
                            border:
                              "1px solid rgba(255,255,255,0.05)",
                            color:
                              "#cbd5e1",
                            fontSize:
                              "12px",
                            lineHeight:
                              1.5,
                          }}
                        >
                          <strong>Verification note:</strong>{" "}
                          {followUp.verification_note}
                        </div>
                      )}

                      {followUp.verification_source_url && (
                        <div
                          style={{
                            marginTop:
                              "8px",
                          }}
                        >
                          <a
                            href={
                              followUp.verification_source_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color:
                                "#93c5fd",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              textDecoration:
                                "none",
                            }}
                          >
                            🔗 Verification source →
                          </a>
                        </div>
                      )}

                      {followUp.evidence_url && (
                        <div
                          style={{
                            marginTop:
                              "9px",
                          }}
                        >
                          <a
                            href={
                              followUp.evidence_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color:
                                "#93c5fd",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              textDecoration:
                                "none",
                            }}
                          >
                            📎 View attached evidence →
                          </a>
                        </div>
                      )}

                      {followUp.note && (
                        <div
                          style={{
                            marginTop:
                              "8px",
                            color:
                              "#cbd5e1",
                            fontSize:
                              "12px",
                            lineHeight:
                              1.5,
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {followUp.note}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* RESOLUTION VERIFICATION */}

        {issue.status === "resolved" && (
          <section
            style={
              panelStyle
            }
          >
            <div
              style={{
                marginBottom:
                  "20px",
              }}
            >
              <div
                style={{
                  color:
                    "#86efac",
                  fontSize:
                    "12px",
                  fontWeight:
                    700,
                  letterSpacing:
                    "0.5px",
                  marginBottom:
                    "8px",
                }}
              >
                RESOLUTION VERIFICATION
              </div>

              <h2
                style={{
                  fontSize:
                    "21px",
                  margin:
                    "0 0 8px",
                }}
              >
                Did the problem actually get fixed?
              </h2>

              <p
                style={{
                  ...mutedTextStyle,
                  margin:
                    0,
                }}
              >
                KarmaFacie currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.
              </p>
            </div>

            <div
              style={{
                display:
                  "grid",
                gap:
                  "12px",
                padding:
                  "16px",
                borderRadius:
                  "14px",
                background:
                  "rgba(34,197,94,0.04)",
                border:
                  "1px solid rgba(34,197,94,0.12)",
              }}
            >
              <div>
                <label
                  htmlFor="resolution-result"
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  What did you observe?
                </label>

                <select
                  id="resolution-result"
                  value={
                    resolutionResult
                  }
                  onChange={(event) =>
                    setResolutionResult(
                      event.target
                        .value as ResolutionCheckResult
                    )
                  }
                  disabled={
                    savingResolutionCheck
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #374151",
                    background:
                      "#111827",
                    color:
                      "white",
                    fontSize:
                      "13px",
                    outline:
                      "none",
                  }}
                >
                  <option value="FIXED">✅ Fixed</option>
                  <option value="PARTIALLY_FIXED">🟡 Partially Fixed</option>
                  <option value="NOT_FIXED">❌ Not Fixed</option>
                  <option value="RETURNED">🔁 Problem Returned</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="resolution-note"
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  Observation note (optional)
                </label>

                <textarea
                  id="resolution-note"
                  value={
                    resolutionNote
                  }
                  onChange={(event) =>
                    setResolutionNote(
                      event.target.value
                    )
                  }
                  disabled={
                    savingResolutionCheck
                  }
                  placeholder="Describe what you observed at the location..."
                  rows={
                    4
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #374151",
                    background:
                      "#111827",
                    color:
                      "white",
                    fontSize:
                      "13px",
                    outline:
                      "none",
                    resize:
                      "vertical",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="resolution-evidence"
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    marginBottom:
                      "7px",
                  }}
                >
                  After-repair evidence (optional)
                </label>

                <input
                  id="resolution-evidence"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => {
                    const file =
                      event.target.files?.[0] ??
                      null;

                    if (!file) {
                      setResolutionEvidence(null);
                      return;
                    }

                    const maxSize =
                      5 * 1024 * 1024;

                    const allowedType =
                      file.type.startsWith("image/") ||
                      file.type === "application/pdf";

                    if (!allowedType) {
                      setResolutionEvidence(null);
                      setResolutionCheckError(
                        "Please choose an image or PDF file."
                      );
                      event.target.value = "";
                      return;
                    }

                    if (file.size > maxSize) {
                      setResolutionEvidence(null);
                      setResolutionCheckError(
                        "Evidence file must be 5 MB or smaller."
                      );
                      event.target.value = "";
                      return;
                    }

                    setResolutionCheckError("");
                    setResolutionEvidence(file);
                  }}
                  disabled={
                    savingResolutionCheck
                  }
                  style={{
                    width:
                      "100%",
                    boxSizing:
                      "border-box",
                    padding:
                      "10px 11px",
                    borderRadius:
                      "9px",
                    border:
                      "1px solid rgba(148,163,184,0.2)",
                    background:
                      "rgba(15,23,42,0.72)",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "12px",
                  }}
                />

                <div
                  style={{
                    marginTop:
                      "6px",
                    color:
                      "#64748b",
                    fontSize:
                      "11px",
                    lineHeight:
                      1.5,
                  }}
                >
                  Upload a current photo or PDF that supports your observation. Maximum 5 MB.
                </div>

                {resolutionEvidence && (
                  <div
                    style={{
                      marginTop:
                        "7px",
                      color:
                        "#93c5fd",
                      fontSize:
                        "11px",
                    }}
                  >
                    Selected: {resolutionEvidence.name}
                  </div>
                )}
              </div>

              {resolutionCheckError && (
                <div
                  style={{
                    padding:
                      "10px 12px",
                    borderRadius:
                      "9px",
                    background:
                      "rgba(239,68,68,0.08)",
                    border:
                      "1px solid rgba(239,68,68,0.16)",
                    color:
                      "#fca5a5",
                    fontSize:
                      "12px",
                    lineHeight:
                      1.5,
                  }}
                >
                  {resolutionCheckError}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  void recordResolutionCheck()
                }
                disabled={
                  savingResolutionCheck
                }
                style={{
                  ...buttonStyle,
                  background:
                    savingResolutionCheck
                      ? "#475569"
                      : "#2563eb",
                  cursor:
                    savingResolutionCheck
                      ? "not-allowed"
                      : "pointer",
                  justifySelf:
                    "start",
                }}
              >
                {savingResolutionCheck
                  ? "Saving Resolution Check..."
                  : "Save Resolution Check →"}
              </button>
            </div>

            <div
              style={{
                marginTop:
                  "20px",
              }}
            >
              <div
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "11px",
                  fontWeight:
                    700,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.6px",
                  marginBottom:
                    "10px",
                }}
              >
                Recorded resolution checks
              </div>

              {resolutionChecks.length === 0 ? (
                <div
                  style={{
                    padding:
                      "14px",
                    borderRadius:
                      "12px",
                    background:
                      "rgba(255,255,255,0.025)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    color:
                      "#64748b",
                    fontSize:
                      "12px",
                    lineHeight:
                      1.5,
                  }}
                >
                  No citizen resolution checks have been recorded yet.
                </div>
              ) : (
                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "10px",
                  }}
                >
                  {resolutionChecks.map(
                    (check) => (
                      <div
                        key={
                          check.id
                        }
                        style={{
                          padding:
                            "14px",
                          borderRadius:
                            "12px",
                          background:
                            "rgba(255,255,255,0.025)",
                          border:
                            "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            gap:
                              "10px",
                            flexWrap:
                              "wrap",
                            alignItems:
                              "baseline",
                          }}
                        >
                          <div
                            style={{
                              color:
                                "#e5e7eb",
                              fontSize:
                                "13px",
                              fontWeight:
                                700,
                            }}
                          >
                            {resolutionResultIcon(check.resolution_result)} {resolutionResultLabel(check.resolution_result)}
                          </div>

                          <div
                            style={{
                              color:
                                "#64748b",
                              fontSize:
                                "11px",
                            }}
                          >
                            {formatDate(
                              check.created_at
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            marginTop:
                              "7px",
                            color:
                              "#94a3b8",
                            fontSize:
                              "11px",
                          }}
                        >
                          Citizen-reported resolution check
                        </div>

                        {check.evidence_url && (
                          <div
                            style={{
                              marginTop:
                                "9px",
                            }}
                          >
                            <a
                              href={
                                check.evidence_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color:
                                  "#93c5fd",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  700,
                                textDecoration:
                                  "none",
                              }}
                            >
                              📎 View resolution evidence →
                            </a>
                          </div>
                        )}

                        {check.note && (
                          <div
                            style={{
                              marginTop:
                                "8px",
                              color:
                                "#cbd5e1",
                              fontSize:
                                "12px",
                              lineHeight:
                                1.5,
                              whiteSpace:
                                "pre-wrap",
                            }}
                          >
                            {check.note}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                marginTop:
                  "16px",
                color:
                  "#64748b",
                fontSize:
                  "11px",
                lineHeight:
                  1.5,
              }}
            >
              KarmaFacie stores these observations as a separate history. They do not automatically change the administrative issue status.
            </div>
          </section>
        )}

        {/* SUBMISSION ASSISTANT */}

        {submission &&
          submissionConfirmed &&
          submission.submission_mode ===
            "DIRECT_LINK" && (
          <section
            style={
              panelStyle
            }
          >
            <div
              style={{
                color:
                  "#93c5fd",
                fontSize:
                  "12px",
                fontWeight:
                  700,
                letterSpacing:
                  "0.5px",
                marginBottom:
                  "10px",
              }}
            >
              SUBMISSION ASSISTANT
            </div>

            <h2
              style={{
                fontSize:
                  "21px",
                margin:
                  "0 0 10px",
              }}
            >
              🧾 Your Complaint Copy Pack
            </h2>

            <p
              style={{
                ...mutedTextStyle,
                margin:
                  "0 0 18px",
              }}
            >
              KarmaFacie has loaded the
              citizen details saved in your
              profile and combined them with
              the complaint information. Keep
              this copy pack ready while
              completing the official government
              form. KarmaFacie does not bypass
              cross-domain controls or CAPTCHA.
            </p>

            <div
              style={{
                padding:
                  "14px 16px",
                borderRadius:
                  "12px",
                background:
                  "rgba(96,165,250,0.05)",
                border:
                  "1px solid rgba(96,165,250,0.12)",
                color:
                  "#93c5fd",
                fontSize:
                  "12px",
                lineHeight:
                  1.5,
                marginBottom:
                  "14px",
              }}
            >
              <strong>
                Prepared details:
              </strong>{" "}
              Citizen profile fields are loaded
              from KarmaFacie, while the matched
              authority directory supplies the
              configured department, sub-department
              and official complaint type.
            </div>

            <div
              style={{
                display:
                  "grid",
                gap:
                  "10px",
              }}
            >
              {copyFields.map(
                (field) => (
                  <div
                    key={
                      field.key
                    }
                    style={{
                      padding:
                        "14px",
                      borderRadius:
                        "12px",
                      background:
                        "rgba(255,255,255,0.025)",
                      border:
                        "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap:
                          "12px",
                        marginBottom:
                          "8px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.5px",
                        }}
                      >
                        {
                          field.label
                        }
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void copyField(
                            field.key,
                            field.value
                          )
                        }
                        style={{
                          padding:
                            "7px 10px",
                          borderRadius:
                            "8px",
                          border:
                            "1px solid rgba(96,165,250,0.18)",
                          background:
                            "rgba(96,165,250,0.08)",
                          color:
                            "#93c5fd",
                          cursor:
                            "pointer",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                        }}
                      >
                        {copiedField ===
                        field.key
                          ? "Copied ✓"
                          : "Copy"}
                      </button>
                    </div>

                    <div
                      style={{
                        color:
                          "#d1d5db",
                        fontSize:
                          "13px",
                        lineHeight:
                          1.6,
                        whiteSpace:
                          "pre-wrap",
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {
                        field.value
                      }
                    </div>
                  </div>
                )
              )}
            </div>

            {photoUrl && (
              <div
                style={{
                  marginTop:
                    "12px",
                  padding:
                    "14px",
                  borderRadius:
                    "12px",
                  background:
                    "rgba(34,197,94,0.05)",
                  border:
                    "1px solid rgba(34,197,94,0.14)",
                }}
              >
                <div
                  style={{
                    color:
                      "#86efac",
                    fontSize:
                      "13px",
                    fontWeight:
                      700,
                  }}
                >
                  ✓ Photo evidence ready
                </div>

                <div
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "11px",
                    lineHeight:
                      1.5,
                    marginTop:
                      "5px",
                  }}
                >
                  Use the evidence
                  image shown above
                  when the official
                  form asks for a
                  photo.
                </div>
              </div>
            )}

            <div
              style={{
                marginTop:
                  "16px",
                padding:
                  "14px 16px",
                borderRadius:
                  "12px",
                background:
                  "rgba(250,204,21,0.05)",
                border:
                  "1px solid rgba(250,204,21,0.14)",
                color:
                  "#fde68a",
                fontSize:
                  "12px",
                lineHeight:
                  1.6,
              }}
            >
              <strong>
                Still required on the
                official form:
              </strong>{" "}
              verify the copied citizen details
              and the authority-specific mapping,
              complete any zone/ward or other
              selections that KarmaFacie does not
              have, enter CAPTCHA, and perform the
              final Submit action yourself.
            </div>
          </section>
        )}

        {/* REPORT REFERENCE */}

        <section
          style={
            panelStyle
          }
        >
          <h2
            style={{
              fontSize:
                "19px",
              margin:
                "0 0 16px",
            }}
          >
            Report Reference
          </h2>

          <div
            style={{
              color:
                "#6b7280",
              fontSize:
                "12px",
              lineHeight:
                1.8,
              wordBreak:
                "break-all",
            }}
          >
            <div>
              Civic Issue ID:{" "}
              {issue.id}
            </div>

            {issue.authority_directory_id && (
              <div>
                Authority Directory ID:{" "}
                {
                  issue.authority_directory_id
                }
              </div>
            )}

            {issue.authority_reference_id && (
              <div>
                Authority Reference ID:{" "}
                {
                  issue.authority_reference_id
                }
              </div>
            )}

            {submission && (
              <div>
                Submission Record ID:{" "}
                {
                  submission.id
                }
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}

        <div
          style={{
            marginTop:
              "24px",
            padding:
              "18px",
            borderRadius:
              "14px",
            background:
              "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(255,255,255,0.06)",
            color:
              "#9ca3af",
            fontSize:
              "13px",
            lineHeight:
              1.6,
          }}
        >
          KarmaFacie currently records the
          evidence, location, report status,
          status history, submission package
          and directory-based routing
          information. This page does not
          represent an official government
          status unless an official authority
          reference or verified government
          response has been recorded.
        </div>
      </div>
    </main>
  );
}
