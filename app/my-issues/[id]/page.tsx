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
    "KRUTBHARAT": "KRUTBHARAT",
    "📷 Photo Evidence": "📷 Photo Evidence",
    "Issue Information": "Issue Information",
    "🏙️ Reported from:": "🏙️ Reported from:",
    "📍 Location:": "📍 Location:",
    "GPS:": "GPS:",
    "Reported:": "Reported:",
    "Complaint Journey": "Complaint Journey",
    "A combined KrutBharat timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "A combined KrutBharat timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.",
    "Current KrutBharat status:": "Current KrutBharat status:",
    "Status History": "Status History",
    "This timeline shows status changes actually recorded in KrutBharat.": "This timeline shows status changes actually recorded in KrutBharat.",
    "No status-history records are currently available for this issue.": "No status-history records are currently available for this issue.",
    "Recorded by": "Recorded by",
    "Status history is generated from recorded KrutBharat status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "Status history is generated from recorded KrutBharat status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.",
    "DIRECTORY ROUTING": "DIRECTORY ROUTING",
    "Department:": "Department:",
    "Sub-Department:": "Sub-Department:",
    "Official Complaint Type:": "Official Complaint Type:",
    "Issue type:": "Issue type:",
    "Channel:": "Channel:",
    "Open Official Complaint Channel →": "Open Official Complaint Channel →",
    "This opens the official complaint channel for the matched authority. KrutBharat does not submit the complaint automatically through this route.": "This opens the official complaint channel for the matched authority. KrutBharat does not submit the complaint automatically through this route.",
    "Directory information verified:": "Directory information verified:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ No verified directory route is currently attached to this report.",
    "OFFICIAL SUBMISSION": "OFFICIAL SUBMISSION",
    "📤 Review Your Complaint": "📤 Review Your Complaint",
    "KrutBharat has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "KrutBharat has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.",
    "Your complaint package has not been prepared yet. KrutBharat will assemble it from the information already stored for this issue.": "Your complaint package has not been prepared yet. KrutBharat will assemble it from the information already stored for this issue.",
    "A verified authority route is required before the submission package can be prepared.": "A verified authority route is required before the submission package can be prepared.",
    "Submission record #": "Submission record #",
    "✓ Photo evidence attached": "✓ Photo evidence attached",
    "No photo evidence attached": "No photo evidence attached",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.",
    "✓ Ready for official submission": "✓ Ready for official submission",
    "Confirmed on": "Confirmed on",
    "Next step: Submission Gateway": "Next step: Submission Gateway",
    "Your complaint package has been prepared and confirmed. KrutBharat will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "Your complaint package has been prepared and confirmed. KrutBharat will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.",
    "✓ Official form opened": "✓ Official form opened",
    "KrutBharat recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KrutBharat recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.",
    "KrutBharat has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "KrutBharat has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.",
    "Reference number:": "Reference number:",
    "Notes:": "Notes:",
    "Recorded on": "Recorded on",
    "Once the government form confirms your submission, enter the reference/complaint number here. KrutBharat will store it as a citizen-provided reference; it will not be treated as an official KrutBharat submission confirmation.": "Once the government form confirms your submission, enter the reference/complaint number here. KrutBharat will store it as a citizen-provided reference; it will not be treated as an official KrutBharat submission confirmation.",
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
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KrutBharat later receives verifiable information from the authority.": "Record what happened after your complaint was submitted. These updates are citizen-reported unless KrutBharat later receives verifiable information from the authority.",
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
    "This is a KrutBharat administrative verification, not an official government confirmation.": "This is a KrutBharat administrative verification, not an official government confirmation.",
    "Verification note:": "Verification note:",
    "🔗 Verification source →": "🔗 Verification source →",
    "📎 View attached evidence →": "📎 View attached evidence →",
    "RESOLUTION VERIFICATION": "RESOLUTION VERIFICATION",
    "Did the problem actually get fixed?": "Did the problem actually get fixed?",
    "KrutBharat currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KrutBharat currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.",
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
    "KrutBharat stores these observations as a separate history. They do not automatically change the administrative issue status.": "KrutBharat stores these observations as a separate history. They do not automatically change the administrative issue status.",
    "SUBMISSION ASSISTANT": "SUBMISSION ASSISTANT",
    "🧾 Your Complaint Copy Pack": "🧾 Your Complaint Copy Pack",
    "KrutBharat has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KrutBharat does not bypass cross-domain controls or CAPTCHA.": "KrutBharat has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KrutBharat does not bypass cross-domain controls or CAPTCHA.",
    "Prepared details:": "Prepared details:",
    "Citizen profile fields are loaded from KrutBharat, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "Citizen profile fields are loaded from KrutBharat, while the matched authority directory supplies the configured department, sub-department and official complaint type.",
    "✓ Photo evidence ready": "✓ Photo evidence ready",
    "Use the evidence image shown above when the official form asks for a photo.": "Use the evidence image shown above when the official form asks for a photo.",
    "Still required on the official form:": "Still required on the official form:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KrutBharat does not have, enter CAPTCHA, and perform the final Submit action yourself.": "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KrutBharat does not have, enter CAPTCHA, and perform the final Submit action yourself.",
    "Report Reference": "Report Reference",
    "Civic Issue ID:": "Civic Issue ID:",
    "Authority Directory ID:": "Authority Directory ID:",
    "Authority Reference ID:": "Authority Reference ID:",
    "Submission Record ID:": "Submission Record ID:",
    "KrutBharat currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KrutBharat currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.",
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
    "Not provided in KrutBharat profile.": "Not provided in KrutBharat profile.",
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
    "KrutBharat Admin": "KrutBharat Admin",
    "KrutBharat System": "KrutBharat System",
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
    "Unable to connect to the KrutBharat submission gateway.": "Unable to connect to the KrutBharat submission gateway.",
    "No confirmed submission record is available yet.": "No confirmed submission record is available yet.",
    "KrutBharat could not save the official-form handoff. Please try again.": "KrutBharat could not save the official-form handoff. Please try again.",
    "Please enter the complaint/reference number from the official government system.": "Please enter the complaint/reference number from the official government system.",
    "Unable to save the official complaint reference.": "Unable to save the official complaint reference.",
    "This civic issue is not available.": "This civic issue is not available.",
    "Unable to save this follow-up update.": "Unable to save this follow-up update.",
    "Unable to save this resolution check.": "Unable to save this resolution check.",
    "Resolution verification becomes available after the KrutBharat issue is marked Resolved.": "Resolution verification becomes available after the KrutBharat issue is marked Resolved.",
    "Please choose an image or PDF file.": "Please choose an image or PDF file.",
    "Evidence file must be 5 MB or smaller.": "Evidence file must be 5 MB or smaller.",
    "Copied ✓": "Copied ✓",
    "Copy": "Copy",
    "✓ KrutBharat verified": "✓ KrutBharat verified",
    "⚠ Not verified": "⚠ Not verified",
    "⏳ Verification pending": "⏳ Verification pending",
  },

  hi: {
    "Loading civic issue...": "नागरिक समस्या लोड हो रही है...",
    "← Back to My Issues": "← मेरी नागरिक समस्याओं पर वापस जाएँ",
    "Unable to load issue": "समस्या लोड नहीं हो सकी",
    "KRUTBHARAT": "KRUTBHARAT",
    "📷 Photo Evidence": "📷 फोटो प्रमाण",
    "Issue Information": "समस्या की जानकारी",
    "🏙️ Reported from:": "🏙️ रिपोर्ट का स्थान:",
    "📍 Location:": "📍 स्थान:",
    "GPS:": "GPS:",
    "Reported:": "रिपोर्ट की गई:",
    "Complaint Journey": "शिकायत की यात्रा",
    "A combined KrutBharat timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "इस शिकायत के लिए KrutBharat में दर्ज प्रमुख चरणों की संयुक्त समयरेखा। जब तक किसी सरकारी प्राधिकरण की आधिकारिक प्रतिक्रिया या संदर्भ दर्ज न हो, सरकारी कार्रवाई को पुष्टि की गई नहीं माना जाता।",
    "Current KrutBharat status:": "वर्तमान KrutBharat स्थिति:",
    "Status History": "स्थिति का इतिहास",
    "This timeline shows status changes actually recorded in KrutBharat.": "यह समयरेखा KrutBharat में वास्तव में दर्ज स्थिति परिवर्तनों को दिखाती है।",
    "No status-history records are currently available for this issue.": "इस समस्या के लिए अभी कोई स्थिति-इतिहास रिकॉर्ड उपलब्ध नहीं है।",
    "Recorded by": "दर्ज करने वाला:",
    "Status history is generated from recorded KrutBharat status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "स्थिति का इतिहास KrutBharat में दर्ज स्थिति घटनाओं से बनाया जाता है। जब तक किसी घटना को स्पष्ट रूप से किसी प्राधिकरण से आया हुआ दर्ज नहीं किया गया है, इससे यह नहीं माना जाता कि किसी सरकारी प्राधिकरण ने स्थिति बदली है।",
    "DIRECTORY ROUTING": "डायरेक्टरी रूटिंग",
    "Department:": "विभाग:",
    "Sub-Department:": "उप-विभाग:",
    "Official Complaint Type:": "आधिकारिक शिकायत प्रकार:",
    "Issue type:": "समस्या का प्रकार:",
    "Channel:": "माध्यम:",
    "Open Official Complaint Channel →": "आधिकारिक शिकायत माध्यम खोलें →",
    "This opens the official complaint channel for the matched authority. KrutBharat does not submit the complaint automatically through this route.": "यह संबंधित प्राधिकरण का आधिकारिक शिकायत माध्यम खोलता है। KrutBharat इस माध्यम से शिकायत स्वतः सबमिट नहीं करता।",
    "Directory information verified:": "डायरेक्टरी जानकारी सत्यापित:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ इस रिपोर्ट से अभी कोई सत्यापित डायरेक्टरी मार्ग जुड़ा नहीं है।",
    "OFFICIAL SUBMISSION": "आधिकारिक सबमिशन",
    "📤 Review Your Complaint": "📤 अपनी शिकायत की समीक्षा करें",
    "KrutBharat has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "KrutBharat ने इस रिपोर्ट के लिए आवश्यक जानकारी पहले ही एकत्र कर ली है। चयनित प्राधिकरण के लिए पुष्टि करने से पहले तैयार पैकेज की समीक्षा करें।",
    "Your complaint package has not been prepared yet. KrutBharat will assemble it from the information already stored for this issue.": "आपका शिकायत पैकेज अभी तैयार नहीं हुआ है। KrutBharat इस समस्या में पहले से संग्रहीत जानकारी से इसे तैयार करेगा।",
    "A verified authority route is required before the submission package can be prepared.": "सबमिशन पैकेज तैयार करने से पहले सत्यापित प्राधिकरण मार्ग आवश्यक है।",
    "Submission record #": "सबमिशन रिकॉर्ड #",
    "✓ Photo evidence attached": "✓ फोटो प्रमाण संलग्न है",
    "No photo evidence attached": "कोई फोटो प्रमाण संलग्न नहीं है",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "मैं पुष्टि करता/करती हूँ कि ऊपर दी गई शिकायत की जानकारी, स्थान और प्रमाण सही हैं और इन्हें आधिकारिक सबमिशन प्रक्रिया में उपयोग किया जा सकता है।",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "यह पुष्टि इस पैकेज के लिए आपकी स्वीकृति दर्ज करती है। इसका अर्थ यह नहीं है कि सरकारी शिकायत सबमिट हो चुकी है।",
    "✓ Ready for official submission": "✓ आधिकारिक सबमिशन के लिए तैयार",
    "Confirmed on": "पुष्टि की गई:",
    "Next step: Submission Gateway": "अगला चरण: सबमिशन गेटवे",
    "Your complaint package has been prepared and confirmed. KrutBharat will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "आपका शिकायत पैकेज तैयार और पुष्टि किया जा चुका है। KrutBharat अब निर्धारित प्राधिकरण सबमिशन मार्ग की जाँच करेगा। वर्तमान CSMC मार्ग के लिए गेटवे आपको आधिकारिक शिकायत प्रणाली तक ले जाएगा; यह स्वतः सरकारी सबमिशन का दावा नहीं करेगा।",
    "✓ Official form opened": "✓ आधिकारिक फॉर्म खोला गया",
    "KrutBharat recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KrutBharat ने इस आधिकारिक फॉर्म हैंडऑफ को आपकी शिकायत में दर्ज कर लिया है। इसका अर्थ यह नहीं है कि सरकारी शिकायत सबमिट हो गई है।",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "आधिकारिक माध्यम खोलने का अर्थ अपने आप यह नहीं है कि सरकारी शिकायत सबमिट हो गई है। कोई भी आधिकारिक सबमिशन या संदर्भ संख्या सरकारी प्रणाली से ही आनी चाहिए।",
    "KrutBharat has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "KrutBharat ने आपके द्वारा दी गई संदर्भ संख्या दर्ज कर ली है। यह नागरिक द्वारा दी गई जानकारी है और सरकारी प्रणाली द्वारा स्वतंत्र रूप से सत्यापित नहीं की गई है।",
    "Reference number:": "संदर्भ संख्या:",
    "Notes:": "टिप्पणियाँ:",
    "Recorded on": "दर्ज किया गया:",
    "Once the government form confirms your submission, enter the reference/complaint number here. KrutBharat will store it as a citizen-provided reference; it will not be treated as an official KrutBharat submission confirmation.": "जब सरकारी फॉर्म आपके सबमिशन की पुष्टि कर दे, तब यहाँ संदर्भ/शिकायत संख्या दर्ज करें। KrutBharat इसे नागरिक द्वारा दी गई संदर्भ संख्या के रूप में संग्रहीत करेगा; इसे आधिकारिक KrutBharat सबमिशन पुष्टि नहीं माना जाएगा।",
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
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KrutBharat later receives verifiable information from the authority.": "शिकायत सबमिट होने के बाद क्या हुआ, उसे दर्ज करें। जब तक KrutBharat को बाद में प्राधिकरण से सत्यापित जानकारी प्राप्त नहीं होती, ये अपडेट नागरिक द्वारा रिपोर्ट किए गए माने जाते हैं।",
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
    "This is a KrutBharat administrative verification, not an official government confirmation.": "यह KrutBharat का प्रशासनिक सत्यापन है, आधिकारिक सरकारी पुष्टि नहीं।",
    "Verification note:": "सत्यापन नोट:",
    "🔗 Verification source →": "🔗 सत्यापन स्रोत →",
    "📎 View attached evidence →": "📎 संलग्न प्रमाण देखें →",
    "RESOLUTION VERIFICATION": "समाधान सत्यापन",
    "Did the problem actually get fixed?": "क्या समस्या वास्तव में ठीक हुई?",
    "KrutBharat currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KrutBharat में यह समस्या वर्तमान में समाधान के रूप में दर्ज है। स्वयं स्थान की जाँच करें और जो देखें उसे दर्ज करें। यह नागरिक का अवलोकन है और इससे प्रशासनिक स्थिति स्वतः नहीं बदलती।",
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
    "KrutBharat stores these observations as a separate history. They do not automatically change the administrative issue status.": "KrutBharat इन अवलोकनों को अलग इतिहास के रूप में संग्रहीत करता है। वे प्रशासनिक समस्या की स्थिति को स्वतः नहीं बदलते।",
    "SUBMISSION ASSISTANT": "सबमिशन सहायक",
    "🧾 Your Complaint Copy Pack": "🧾 आपकी शिकायत कॉपी पैक",
    "KrutBharat has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KrutBharat does not bypass cross-domain controls or CAPTCHA.": "KrutBharat ने आपकी प्रोफ़ाइल में सहेजे गए नागरिक विवरण को लोड करके शिकायत की जानकारी के साथ जोड़ा है। आधिकारिक सरकारी फॉर्म भरते समय यह कॉपी पैक तैयार रखें। KrutBharat cross-domain नियंत्रण या CAPTCHA को बायपास नहीं करता।",
    "Prepared details:": "तैयार विवरण:",
    "Citizen profile fields are loaded from KrutBharat, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "नागरिक प्रोफ़ाइल के फ़ील्ड KrutBharat से लिए गए हैं, जबकि संबंधित प्राधिकरण डायरेक्टरी विभाग, उप-विभाग और आधिकारिक शिकायत प्रकार की कॉन्फ़िगर जानकारी देती है।",
    "✓ Photo evidence ready": "✓ फोटो प्रमाण तैयार है",
    "Use the evidence image shown above when the official form asks for a photo.": "जब आधिकारिक फॉर्म फोटो माँगे, ऊपर दिखाई गई प्रमाण फोटो का उपयोग करें।",
    "Still required on the official form:": "आधिकारिक फॉर्म पर अभी आवश्यक:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KrutBharat does not have, enter CAPTCHA, and perform the final Submit action yourself.": "कॉपी किए गए नागरिक विवरण और प्राधिकरण-विशिष्ट मैपिंग की जाँच करें, KrutBharat में उपलब्ध न होने वाले ज़ोन/वार्ड या अन्य विकल्प पूरे करें, CAPTCHA दर्ज करें और अंतिम Submit कार्रवाई स्वयं करें।",
    "Report Reference": "रिपोर्ट संदर्भ",
    "Civic Issue ID:": "नागरिक समस्या ID:",
    "Authority Directory ID:": "प्राधिकरण डायरेक्टरी ID:",
    "Authority Reference ID:": "प्राधिकरण संदर्भ ID:",
    "Submission Record ID:": "सबमिशन रिकॉर्ड ID:",
    "KrutBharat currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KrutBharat वर्तमान में प्रमाण, स्थान, रिपोर्ट स्थिति, स्थिति इतिहास, सबमिशन पैकेज और डायरेक्टरी-आधारित रूटिंग जानकारी दर्ज करता है। जब तक कोई आधिकारिक प्राधिकरण संदर्भ या सत्यापित सरकारी प्रतिक्रिया दर्ज न हो, यह पृष्ठ आधिकारिक सरकारी स्थिति का प्रतिनिधित्व नहीं करता।",
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
    "Not provided in KrutBharat profile.": "KrutBharat प्रोफ़ाइल में उपलब्ध नहीं है।",
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
    "KrutBharat Admin": "KrutBharat एडमिन",
    "KrutBharat System": "KrutBharat सिस्टम",
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
    "Unable to connect to the KrutBharat submission gateway.": "KrutBharat सबमिशन गेटवे से कनेक्ट नहीं हो सका।",
    "No confirmed submission record is available yet.": "अभी कोई पुष्टि किया हुआ सबमिशन रिकॉर्ड उपलब्ध नहीं है।",
    "KrutBharat could not save the official-form handoff. Please try again.": "KrutBharat आधिकारिक फॉर्म हैंडऑफ को सहेज नहीं सका। कृपया फिर से प्रयास करें।",
    "Please enter the complaint/reference number from the official government system.": "कृपया आधिकारिक सरकारी प्रणाली से शिकायत/संदर्भ संख्या दर्ज करें।",
    "Unable to save the official complaint reference.": "आधिकारिक शिकायत संदर्भ सहेजा नहीं जा सका।",
    "This civic issue is not available.": "यह नागरिक समस्या उपलब्ध नहीं है।",
    "Unable to save this follow-up update.": "यह फॉलो-अप अपडेट सहेजा नहीं जा सका।",
    "Unable to save this resolution check.": "यह समाधान सत्यापन सहेजा नहीं जा सका।",
    "Resolution verification becomes available after the KrutBharat issue is marked Resolved.": "समाधान सत्यापन तब उपलब्ध होगा जब KrutBharat में समस्या को समाधान के रूप में चिह्नित किया जाएगा।",
    "Please choose an image or PDF file.": "कृपया इमेज या PDF फ़ाइल चुनें।",
    "Evidence file must be 5 MB or smaller.": "प्रमाण फ़ाइल 5 MB या उससे छोटी होनी चाहिए।",
    "Copied ✓": "कॉपी किया गया ✓",
    "Copy": "कॉपी करें",
    "✓ KrutBharat verified": "✓ KrutBharat द्वारा सत्यापित",
    "⚠ Not verified": "⚠ सत्यापित नहीं",
    "⏳ Verification pending": "⏳ सत्यापन लंबित",
  },

  mr: {
    "Loading civic issue...": "नागरी समस्या लोड होत आहे...",
    "← Back to My Issues": "← माझ्या नागरी समस्यांकडे परत जा",
    "Unable to load issue": "समस्या लोड करता आली नाही",
    "KRUTBHARAT": "KRUTBHARAT",
    "📷 Photo Evidence": "📷 फोटो पुरावा",
    "Issue Information": "समस्येची माहिती",
    "🏙️ Reported from:": "🏙️ नोंदवलेले स्थान:",
    "📍 Location:": "📍 स्थान:",
    "GPS:": "GPS:",
    "Reported:": "नोंदवले:",
    "Complaint Journey": "तक्रारीचा प्रवास",
    "A combined KrutBharat timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded.": "या तक्रारीसाठी KrutBharat मध्ये नोंदवलेल्या प्रमुख टप्प्यांची संयुक्त वेळरेषा. अधिकृत प्राधिकरणाचा प्रतिसाद किंवा संदर्भ नोंदवला नसल्यास सरकारी कारवाईला पुष्टी झालेली मानली जात नाही.",
    "Current KrutBharat status:": "सध्याची KrutBharat स्थिती:",
    "Status History": "स्थितीचा इतिहास",
    "This timeline shows status changes actually recorded in KrutBharat.": "ही वेळरेषा KrutBharat मध्ये प्रत्यक्ष नोंदवलेले स्थिती बदल दर्शवते.",
    "No status-history records are currently available for this issue.": "या समस्येसाठी सध्या स्थिती इतिहासाची कोणतीही नोंद उपलब्ध नाही.",
    "Recorded by": "नोंद करणारे:",
    "Status history is generated from recorded KrutBharat status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority.": "स्थितीचा इतिहास KrutBharat मध्ये नोंदवलेल्या स्थिती घटनांमधून तयार केला जातो. एखादी घटना प्राधिकरणाकडून आल्याचे स्पष्टपणे नोंदवलेले नसल्यास, सरकारी प्राधिकरणाने स्थिती बदलली असे यावरून मानले जात नाही.",
    "DIRECTORY ROUTING": "डायरेक्टरी रूटिंग",
    "Department:": "विभाग:",
    "Sub-Department:": "उप-विभाग:",
    "Official Complaint Type:": "अधिकृत तक्रारीचा प्रकार:",
    "Issue type:": "समस्येचा प्रकार:",
    "Channel:": "माध्यम:",
    "Open Official Complaint Channel →": "अधिकृत तक्रार माध्यम उघडा →",
    "This opens the official complaint channel for the matched authority. KrutBharat does not submit the complaint automatically through this route.": "यामुळे जुळलेल्या प्राधिकरणाचे अधिकृत तक्रार माध्यम उघडेल. KrutBharat या मार्गाने तक्रार आपोआप सबमिट करत नाही.",
    "Directory information verified:": "डायरेक्टरी माहिती पडताळली:",
    "ℹ️ No verified directory route is currently attached to this report.": "ℹ️ या नोंदीला सध्या कोणताही सत्यापित डायरेक्टरी मार्ग जोडलेला नाही.",
    "OFFICIAL SUBMISSION": "अधिकृत सबमिशन",
    "📤 Review Your Complaint": "📤 तुमच्या तक्रारीचे पुनरावलोकन करा",
    "KrutBharat has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority.": "या नोंदीसाठी आवश्यक माहिती KrutBharat ने आधीच जमा केली आहे. निवडलेल्या प्राधिकरणासाठी पुष्टी करण्यापूर्वी तयार पॅकेज तपासा.",
    "Your complaint package has not been prepared yet. KrutBharat will assemble it from the information already stored for this issue.": "तुमचे तक्रार पॅकेज अद्याप तयार झालेले नाही. या समस्येसाठी आधीच साठवलेल्या माहितीतून KrutBharat ते तयार करेल.",
    "A verified authority route is required before the submission package can be prepared.": "सबमिशन पॅकेज तयार करण्यापूर्वी सत्यापित प्राधिकरणाचा मार्ग आवश्यक आहे.",
    "Submission record #": "सबमिशन नोंद #",
    "✓ Photo evidence attached": "✓ फोटो पुरावा जोडलेला आहे",
    "No photo evidence attached": "फोटो पुरावा जोडलेला नाही",
    "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process.": "वर दिलेली तक्रारीची माहिती, स्थान आणि पुरावे योग्य आहेत आणि अधिकृत सबमिशन प्रक्रियेसाठी वापरले जाऊ शकतात याची मी पुष्टी करतो/करते.",
    "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted.": "ही पुष्टी या पॅकेजसाठी तुमची मान्यता नोंदवते. याचा अर्थ सरकारी तक्रार सबमिट झाली आहे असा होत नाही.",
    "✓ Ready for official submission": "✓ अधिकृत सबमिशनसाठी तयार",
    "Confirmed on": "पुष्टी दिनांक:",
    "Next step: Submission Gateway": "पुढील टप्पा: सबमिशन गेटवे",
    "Your complaint package has been prepared and confirmed. KrutBharat will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission.": "तुमचे तक्रार पॅकेज तयार आणि पुष्टी झाले आहे. KrutBharat आता कॉन्फिगर केलेला प्राधिकरण सबमिशन मार्ग तपासेल. सध्याच्या CSMC मार्गासाठी गेटवे तुम्हाला अधिकृत तक्रार प्रणालीकडे नेईल; आपोआप सरकारी सबमिशन झाल्याचा दावा केला जाणार नाही.",
    "✓ Official form opened": "✓ अधिकृत फॉर्म उघडला",
    "KrutBharat recorded this official-form handoff in your complaint record. This does not mean the government complaint has been submitted.": "KrutBharat ने हा अधिकृत फॉर्म हँडऑफ तुमच्या तक्रार नोंदीत नोंदवला आहे. याचा अर्थ सरकारी तक्रार सबमिट झाली आहे असा होत नाही.",
    "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system.": "अधिकृत माध्यम उघडल्याने सरकारी तक्रार सबमिट झाल्याचा अर्थ होत नाही. कोणताही अधिकृत सबमिशन किंवा संदर्भ क्रमांक सरकारी प्रणालीतूनच मिळायला हवा.",
    "KrutBharat has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system.": "तुम्ही दिलेला संदर्भ क्रमांक KrutBharat ने नोंदवला आहे. ही नागरिकाने दिलेली नोंद आहे आणि सरकारी प्रणालीने स्वतंत्रपणे पडताळलेली नाही.",
    "Reference number:": "संदर्भ क्रमांक:",
    "Notes:": "नोंदी:",
    "Recorded on": "नोंद दिनांक:",
    "Once the government form confirms your submission, enter the reference/complaint number here. KrutBharat will store it as a citizen-provided reference; it will not be treated as an official KrutBharat submission confirmation.": "सरकारी फॉर्मने तुमचे सबमिशन निश्चित केल्यानंतर येथे संदर्भ/तक्रार क्रमांक टाका. KrutBharat तो नागरिकाने दिलेला संदर्भ म्हणून साठवेल; तो अधिकृत KrutBharat सबमिशन पुष्टी म्हणून मानला जाणार नाही.",
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
    "Record what happened after your complaint was submitted. These updates are citizen-reported unless KrutBharat later receives verifiable information from the authority.": "तक्रार सबमिट केल्यानंतर काय झाले ते नोंदवा. KrutBharat ला नंतर प्राधिकरणाकडून पडताळता येणारी माहिती मिळेपर्यंत हे अपडेट्स नागरिकाने दिलेले मानले जातात.",
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
    "This is a KrutBharat administrative verification, not an official government confirmation.": "ही KrutBharat ची प्रशासकीय पडताळणी आहे, अधिकृत सरकारी पुष्टी नाही.",
    "Verification note:": "पडताळणी नोंद:",
    "🔗 Verification source →": "🔗 पडताळणी स्रोत →",
    "📎 View attached evidence →": "📎 जोडलेला पुरावा पाहा →",
    "RESOLUTION VERIFICATION": "निराकरण पडताळणी",
    "Did the problem actually get fixed?": "समस्या खरोखर ठीक झाली का?",
    "KrutBharat currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status.": "KrutBharat मध्ये ही समस्या सध्या निराकरण झालेली म्हणून नोंदवली आहे. स्वतः ठिकाण तपासा आणि तुम्ही जे पाहता ते नोंदवा. हे नागरिकाचे निरीक्षण आहे आणि प्रशासकीय स्थिती आपोआप बदलत नाही.",
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
    "KrutBharat stores these observations as a separate history. They do not automatically change the administrative issue status.": "KrutBharat ही निरीक्षणे स्वतंत्र इतिहास म्हणून साठवते. त्यातून प्रशासकीय समस्येची स्थिती आपोआप बदलत नाही.",
    "SUBMISSION ASSISTANT": "सबमिशन सहाय्यक",
    "🧾 Your Complaint Copy Pack": "🧾 तुमचे तक्रार कॉपी पॅक",
    "KrutBharat has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KrutBharat does not bypass cross-domain controls or CAPTCHA.": "KrutBharat ने तुमच्या प्रोफाइलमधील नागरिक तपशील लोड करून तक्रारीच्या माहितीसोबत एकत्र केले आहेत. अधिकृत सरकारी फॉर्म भरताना हा कॉपी पॅक तयार ठेवा. KrutBharat cross-domain नियंत्रण किंवा CAPTCHA बायपास करत नाही.",
    "Prepared details:": "तयार तपशील:",
    "Citizen profile fields are loaded from KrutBharat, while the matched authority directory supplies the configured department, sub-department and official complaint type.": "नागरिक प्रोफाइलमधील फील्ड KrutBharat मधून घेतली जातात, तर जुळलेली प्राधिकरण डायरेक्टरी विभाग, उप-विभाग आणि अधिकृत तक्रारीचा प्रकार देते.",
    "✓ Photo evidence ready": "✓ फोटो पुरावा तयार आहे",
    "Use the evidence image shown above when the official form asks for a photo.": "अधिकृत फॉर्म फोटो मागितल्यास वर दाखवलेली पुरावा प्रतिमा वापरा.",
    "Still required on the official form:": "अधिकृत फॉर्मवर अजून आवश्यक:",
    "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KrutBharat does not have, enter CAPTCHA, and perform the final Submit action yourself.": "कॉपी केलेले नागरिक तपशील आणि प्राधिकरणानुसार केलेले मॅपिंग तपासा, KrutBharat कडे नसलेले झोन/प्रभाग किंवा इतर पर्याय पूर्ण करा, CAPTCHA भरा आणि अंतिम Submit कृती स्वतः करा.",
    "Report Reference": "रिपोर्ट संदर्भ",
    "Civic Issue ID:": "नागरी समस्या ID:",
    "Authority Directory ID:": "प्राधिकरण डायरेक्टरी ID:",
    "Authority Reference ID:": "प्राधिकरण संदर्भ ID:",
    "Submission Record ID:": "सबमिशन नोंद ID:",
    "KrutBharat currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded.": "KrutBharat सध्या पुरावा, स्थान, नोंद स्थिती, स्थिती इतिहास, सबमिशन पॅकेज आणि डायरेक्टरी-आधारित रूटिंग माहिती नोंदवते. अधिकृत प्राधिकरण संदर्भ किंवा पडताळलेला सरकारी प्रतिसाद नोंदवलेला नसेल तर हे पृष्ठ अधिकृत सरकारी स्थिती दर्शवत नाही.",
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
    "Not provided in KrutBharat profile.": "KrutBharat प्रोफाइलमध्ये उपलब्ध नाही.",
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
    "KrutBharat Admin": "KrutBharat प्रशासक",
    "KrutBharat System": "KrutBharat प्रणाली",
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
    "Unable to connect to the KrutBharat submission gateway.": "KrutBharat सबमिशन गेटवेशी जोडता आले नाही.",
    "No confirmed submission record is available yet.": "अद्याप पुष्टी केलेली सबमिशन नोंद उपलब्ध नाही.",
    "KrutBharat could not save the official-form handoff. Please try again.": "KrutBharat अधिकृत फॉर्म हँडऑफ जतन करू शकले नाही. कृपया पुन्हा प्रयत्न करा.",
    "Please enter the complaint/reference number from the official government system.": "कृपया अधिकृत सरकारी प्रणालीतील तक्रार/संदर्भ क्रमांक टाका.",
    "Unable to save the official complaint reference.": "अधिकृत तक्रार संदर्भ जतन करता आला नाही.",
    "This civic issue is not available.": "ही नागरी समस्या उपलब्ध नाही.",
    "Unable to save this follow-up update.": "हा फॉलो-अप अपडेट जतन करता आला नाही.",
    "Unable to save this resolution check.": "ही निराकरण पडताळणी जतन करता आली नाही.",
    "Resolution verification becomes available after the KrutBharat issue is marked Resolved.": "KrutBharat मध्ये समस्या निराकरण झालेली म्हणून चिन्हांकित केल्यानंतर निराकरण पडताळणी उपलब्ध होते.",
    "Please choose an image or PDF file.": "कृपया इमेज किंवा PDF फाइल निवडा.",
    "Evidence file must be 5 MB or smaller.": "पुरावा फाइल 5 MB किंवा त्यापेक्षा कमी असावी.",
    "Copied ✓": "कॉपी केले ✓",
    "Copy": "कॉपी करा",
    "✓ KrutBharat verified": "✓ KrutBharat ने पडताळले",
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
      return "KrutBharat Admin";

    case "system":
      return "KrutBharat System";

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
  const { language, setLanguage } = useLanguage();

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
      description: "Your civic issue was recorded in KrutBharat.",
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
        ? "KrutBharat recorded the official-form handoff."
        : "The official complaint form has not yet been opened from KrutBharat.",
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
        "Unable to connect to the KrutBharat submission gateway."
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
        "KrutBharat could not save the official-form handoff. Please try again."
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
        "Resolution verification becomes available after the KrutBharat issue is marked Resolved."
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
        className="kf-detail-page kf-detail-loading"
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
        className="kf-detail-page kf-detail-error"
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
            className="kf-detail-error-back-button"
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
            className="kf-detail-error-card"
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
        "Not provided in KrutBharat profile.",
    },
    {
      key: "mobile",
      label: "Mobile Number",
      value:
        citizenProfile?.mobile ||
        "Not provided in KrutBharat profile.",
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
        "Not provided in KrutBharat profile.",
    },
    {
      key: "address",
      label: "Residential Address",
      value:
        citizenProfile?.address ||
        "Not provided in KrutBharat profile.",
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
        "Not provided in KrutBharat profile.",
    },
    {
      key: "ward",
      label: "Ward",
      value:
        citizenProfile?.ward ||
        "Not provided in KrutBharat profile.",
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


  const t = (key: string) =>
    uiTranslations[language]?.[key] ?? key;

  const status = issue?.status ?? "";

  const statusTone =
    status === "resolved"
      ? {
          background: "#eaf5df",
          border: "#cfe2bd",
          text: "#55733c",
          dot: "#77a04f",
        }
      : status === "in_progress"
        ? {
            background: "#fff0de",
            border: "#edd0aa",
            text: "#94683e",
            dot: "#e49a53",
          }
        : status === "under_review"
          ? {
              background: "#eaf3f9",
              border: "#d0e1ec",
              text: "#52738d",
              dot: "#6d99b7",
            }
          : status === "rejected"
            ? {
                background: "#fff0ed",
                border: "#ecd0c8",
                text: "#965c4d",
                dot: "#c97865",
              }
            : {
                background: "#f2f0eb",
                border: "#ddd8cf",
                text: "#606b74",
                dot: "#8d969d",
              };

  const sectionStyle = {
    borderRadius: "30px",
    border: "1px solid #dfd9d0",
    background: "rgba(255,253,249,.96)",
    boxShadow: "0 16px 42px rgba(16,27,43,.055)",
  };

  const softSection = (background: string, border: string) => ({
    ...sectionStyle,
    background,
    border,
  });

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background:
            "radial-gradient(circle at 88% 6%, rgba(218,234,243,.92) 0%, rgba(218,234,243,0) 28%), radial-gradient(circle at 8% 92%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 28%), #f8f3ea",
          color: "#102033",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            width: "min(430px, 100%)",
            padding: "34px",
            textAlign: "center",
            borderRadius: "32px",
            background: "rgba(255,253,249,.96)",
            border: "1px solid #dfd9d0",
            boxShadow: "0 20px 60px rgba(16,27,43,.08)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-.05em",
            }}
          >
            <span className="kf-detail-brand-krut">Krut</span><span className="kf-detail-brand-bharat">Bharat</span>
          </div>

          <div
            style={{
              width: "68px",
              height: "5px",
              margin: "14px auto 15px",
              borderRadius: "999px",
              background: "#ff7a00",
            }}
          />

          <p
            style={{
              margin: 0,
              color: "#647481",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {t("Loading civic issue...")}
          </p>
        </div>
      </main>
    );
  }

  if (!issue) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          background:
            "radial-gradient(circle at 90% 5%, rgba(218,234,243,.85) 0%, rgba(218,234,243,0) 26%), #f8f3ea",
          color: "#102033",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          style={{
            width: "min(560px, 100%)",
            padding: "32px",
            borderRadius: "30px",
            background: "#fffdf9",
            border: "1px solid #dfd9d0",
            boxShadow: "0 18px 48px rgba(16,27,43,.06)",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: ".18em",
              textTransform: "uppercase",
            }}
          >
            KRUTBHARAT
          </div>

          <h1
            style={{
              margin: "10px 0 8px",
              color: "#203449",
              fontFamily: "var(--font-display)",
              fontSize: "40px",
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            {t("Unable to load this civic issue.")}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667682",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            {error || t("This civic issue could not be found.")}
          </p>

          <button
            className="kf-detail-primary-action"
            type="button"
            onClick={() => router.push("/my-issues")}
            style={{
              marginTop: "22px",
              border: 0,
              borderRadius: "999px",
              background: "#ff7a00",
              color: "#fff",
              padding: "13px 18px",
              fontSize: "12px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 10px 22px rgba(255,122,0,.17)",
            }}
          >
            {t("← Back to My Issues")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="kf-detail-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 93% 2%, rgba(218,234,243,.92) 0%, rgba(218,234,243,0) 24%), radial-gradient(circle at 4% 23%, rgba(232,242,248,.78) 0%, rgba(232,242,248,0) 23%), radial-gradient(circle at 90% 92%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 24%), #f8f3ea",
        color: "#52616e",
        padding: "18px 16px 80px",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        className="kf-detail-shell"
        style={{
          width: "min(1120px, 100%)",
          margin: "0 auto",
        }}
      >
        {/* TOP BAR */}
        <header
          className="kf-topbar kf-detail-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            padding: "12px 14px",
            marginBottom: "16px",
            borderRadius: "25px",
            background: "rgba(255,253,249,.94)",
            border: "1px solid #ded8cf",
            boxShadow: "0 14px 36px rgba(16,27,43,.055)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
            }}
          >
            <button
              className="kf-detail-back-button"
              type="button"
              onClick={() => router.push("/my-issues")}
              aria-label={t("← Back to My Issues")}
              style={{
                width: "38px",
                height: "38px",
                display: "grid",
                placeItems: "center",
                border: "1px solid #ddd7cf",
                borderRadius: "13px",
                background: "#fffdf9",
                color: "#304154",
                fontSize: "18px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ←
            </button>

            <div
              className="kf-detail-brand-lockup"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                className="kf-detail-brand-box"
                style={{
                  width: "38px",
                  height: "38px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "13px",
                  background: "#ff7a00",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontSize: "21px",
                  fontWeight: 800,
                  boxShadow: "0 8px 18px rgba(255,122,0,.18)",
                }}
              >
                K
              </div>

              <div>
                <div
                  className="kf-detail-brand-name"
                  style={{
                    color: "#102033",
                    fontFamily: "var(--font-display)",
                    fontSize: "23px",
                    lineHeight: 1,
                    letterSpacing: "-.045em",
                    fontWeight: 800,
                  }}
                >
                  <span className="kf-detail-brand-krut">Krut</span>
                  <span className="kf-detail-brand-bharat" style={{ color: "#ff7a00" }}>Bharat</span>
                </div>

                <div
                  className="kf-detail-brand-caption"
                  style={{
                    marginTop: "3px",
                    color: "#89918e",
                    fontSize: "8px",
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: ".16em",
                  }}
                >
                  CIVIC PARTICIPATION
                </div>
              </div>
            </div>
          </div>

          <label
            className="kf-detail-language-label"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              color: "#50616f",
              fontSize: "11px",
              fontWeight: 900,
            }}
          >
            <span>
              {language === "hi"
                ? "भाषा"
                : language === "mr"
                  ? "भाषा"
                  : "Language"}
            </span>

            <select
              className="kf-detail-language-select"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label="Language"
              style={{
                minWidth: "122px",
                padding: "10px 13px",
                border: "1px solid #d8d2ca",
                borderRadius: "999px",
                background: "#fffdf9",
                color: "#304154",
                fontSize: "11px",
                fontWeight: 800,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        {/* HERO */}
        <section
          className="kf-detail-section kf-detail-hero"
          style={{
            ...softSection(
              "linear-gradient(135deg, rgba(255,253,249,.98) 0%, rgba(255,253,249,.96) 54%, rgba(231,241,247,.95) 100%)",
              "#ddd8cf"
            ),
            position: "relative",
            overflow: "hidden",
            padding: "32px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-34px",
              top: "-48px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(217,232,241,.58)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "-40px",
              bottom: "-72px",
              width: "180px",
              height: "130px",
              borderRadius: "55% 45% 0 0",
              background: "rgba(255,229,205,.46)",
              transform: "rotate(7deg)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              className="kf-detail-hero-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#fff0df",
                border: "1px solid #efddc8",
                color: "#966f4e",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: ".18em",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ff7a00",
                }}
              />
              KRUTBHARAT CIVIC ISSUE
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "17px",
              }}
            >
              <div style={{ maxWidth: "780px" }}>
                <h1
                  style={{
                    margin: 0,
                    color: "#102033",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(42px, 5.8vw, 62px)",
                    lineHeight: ".98",
                    letterSpacing: "-.05em",
                    fontWeight: 800,
                  }}
                >
                  {issue.title || t("Civic Issue")}
                </h1>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "15px",
                  }}
                >
                  <span
                    className="kf-detail-category-pill"
                    style={{
                      padding: "8px 12px",
                      borderRadius: "999px",
                      background: "#fff3e7",
                      border: "1px solid #f0dbc5",
                      color: "#986e4b",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    {issue.category}
                  </span>

                  <span
                    className={`kf-detail-status-pill kf-detail-status-${issue.status}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      background: statusTone.background,
                      border: `1px solid ${statusTone.border}`,
                      color: statusTone.text,
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: statusTone.dot,
                      }}
                    />
                    {getStatusIcon(issue.status)}{" "}
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
              </div>

              <div
                className="kf-detail-hero-reported-card"
                style={{
                  minWidth: "180px",
                  padding: "14px 15px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.76)",
                  border: "1px solid rgba(16,27,43,.08)",
                }}
              >
                <div
                  style={{
                    color: "#92999f",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".15em",
                  }}
                >
                  {t("Reported:")}
                </div>

                <div
                  style={{
                    marginTop: "5px",
                    color: "#34475a",
                    fontSize: "12px",
                    fontWeight: 800,
                    lineHeight: 1.45,
                  }}
                >
                  {formatDate(issue.reported_at || issue.created_at)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {(error || submissionError || followUpError || resolutionCheckError) && (
          <div
            role="alert"
            style={{
              marginBottom: "14px",
              padding: "14px 16px",
              borderRadius: "18px",
              background: "#fff0ed",
              border: "1px solid #ecd0c8",
              color: "#965c4d",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1.6,
            }}
          >
            {error ||
              submissionError ||
              followUpError ||
              resolutionCheckError}
          </div>
        )}

        {/* ISSUE OVERVIEW */}
        <section
          className="kf-detail-section kf-detail-overview-section"
          style={{
            ...sectionStyle,
            padding: "26px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "17px",
            }}
          >
            <div
              className="kf-detail-record-icon"
              style={{
                width: "38px",
                height: "38px",
                display: "grid",
                placeItems: "center",
                borderRadius: "14px",
                background: "#fff0df",
                fontSize: "18px",
              }}
            >
              📋
            </div>

            <div>
              <div
                style={{
                  color: "#9a9188",
                  fontSize: "9px",
                  fontWeight: 900,
                  letterSpacing: ".17em",
                }}
              >
                CIVIC RECORD
              </div>

              <h2
                style={{
                  margin: "3px 0 0",
                  color: "#24364a",
                  fontFamily: "var(--font-display)",
                  fontSize: "30px",
                  lineHeight: 1,
                  fontWeight: 800,
                }}
              >
                {t("Issue Information")}
              </h2>
            </div>
          </div>

          <div
            className="kf-overview-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "10px",
            }}
          >
            <div
              className="kf-detail-overview-tile kf-detail-overview-tile-blue"
              style={{
                padding: "15px",
                borderRadius: "20px",
                background: "#f3f7fa",
                border: "1px solid #dce8ef",
              }}
            >
              <div className="kf-info-label">🏙️ {t("Reported from:")}</div>
              <div className="kf-info-value">
                {issue.reported_city || "—"}
                {issue.reported_state
                  ? `, ${issue.reported_state}`
                  : ""}
              </div>
            </div>

            <div
              className="kf-detail-overview-tile kf-detail-overview-tile-warm"
              style={{
                padding: "15px",
                borderRadius: "20px",
                background: "#fff4e8",
                border: "1px solid #efdfcd",
              }}
            >
              <div className="kf-info-label">📍 {t("Location:")}</div>
              <div className="kf-info-value">
                {issue.location_text ||
                  t("Location not provided.")}
              </div>
            </div>

            <div
              className="kf-detail-overview-tile kf-detail-overview-tile-green"
              style={{
                padding: "15px",
                borderRadius: "20px",
                background: "#f2f6ed",
                border: "1px solid #dbe7d0",
              }}
            >
              <div className="kf-info-label">{t("GPS:")}</div>
              <div className="kf-info-value">
                {issue.latitude !== null &&
                issue.longitude !== null
                  ? `${issue.latitude.toFixed(6)}, ${issue.longitude.toFixed(6)}`
                  : t("GPS coordinates not available.")}
              </div>
            </div>

            <div
              className="kf-detail-overview-tile kf-detail-overview-tile-lavender"
              style={{
                padding: "15px",
                borderRadius: "20px",
                background: "#f5f0fa",
                border: "1px solid #e3d9ec",
              }}
            >
              <div className="kf-info-label">🕒 {t("Reported:")}</div>
              <div className="kf-info-value">
                {formatDate(issue.reported_at || issue.created_at)}
              </div>
            </div>
          </div>

          <div
            className="kf-detail-description-card"
            style={{
              marginTop: "12px",
              padding: "17px",
              borderRadius: "21px",
              background: "#fffdf9",
              border: "1px solid #e3ded6",
            }}
          >
            <div className="kf-info-label">{t("Description")}</div>

            <p
              style={{
                margin: "7px 0 0",
                color: "#34495b",
                fontSize: "16px",
                lineHeight: 1.72,
                whiteSpace: "pre-wrap",
              }}
            >
              {issue.description || t("No description provided.")}
            </p>
          </div>
        </section>

        {/* PHOTO */}
        {photoUrl && (
          <section
            className="kf-detail-section kf-detail-photo-section"
            style={{
              ...softSection("#fffdf9", "#dfd9d0"),
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "18px 22px",
                background: "#fff4ea",
                borderBottom: "1px solid #ecdccf",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8d735e",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".17em",
                  }}
                >
                  VISUAL EVIDENCE
                </div>

                <h2
                  style={{
                    margin: "4px 0 0",
                    color: "#283b4f",
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    lineHeight: 1,
                    fontWeight: 800,
                  }}
                >
                  {t("📷 Photo Evidence")}
                </h2>
              </div>

              <span
                className="kf-detail-photo-badge"
                style={{
                  padding: "8px 10px",
                  borderRadius: "999px",
                  background: "#fffdf9",
                  border: "1px solid #eadbcf",
                  color: "#7d756e",
                  fontSize: "9px",
                  fontWeight: 900,
                }}
              >
                {t("Evidence")}
              </span>
            </div>

            <div
              className="kf-detail-photo-body"
              style={{
                padding: "18px",
                background: "#eeece7",
              }}
            >
              <img
                src={photoUrl}
                alt={issue.title || t("📷 Photo Evidence")}
                style={{
                  width: "100%",
                  maxHeight: "650px",
                  objectFit: "contain",
                  display: "block",
                  borderRadius: "22px",
                  background: "#e6e2dc",
                }}
              />
            </div>
          </section>
        )}

        {/* COMPLAINT JOURNEY */}
        <section
          className="kf-detail-section kf-detail-journey-section"
          style={{
            ...softSection(
              "linear-gradient(135deg, #fffdf9 0%, #fbfdf9 100%)",
              "#dfe5d8"
            ),
            padding: "26px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "21px" }}>
            <div className="kf-section-kicker" style={{ color: "#79915e" }}>
              CIVIC JOURNEY
            </div>

            <h2 className="kf-section-title">
              {t("Complaint Journey")}
            </h2>

            <p className="kf-section-desc">
              {t(
                "A combined KrutBharat timeline for the major steps recorded for this complaint. Government actions are not marked as confirmed unless an official authority response or reference is recorded."
              )}
            </p>
          </div>

          <div className="kf-journey-grid">
            {journeySteps.map((step, index) => (
              <div
                key={step.key}
                className="kf-journey-step kf-journey-step-themed"
                style={{
                  padding: "17px",
                  borderRadius: "22px",
                  background: step.completed ? "#f2f7ec" : "#f7f5f1",
                  border: `1px solid ${
                    step.completed ? "#d8e7cd" : "#e5e0d8"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "12px",
                      background: step.completed
                        ? "#dceccd"
                        : "#e9e6e0",
                      color: step.completed
                        ? "#628247"
                        : "#8b9296",
                      fontSize: "12px",
                      fontWeight: 900,
                    }}
                  >
                    {step.completed ? "✓" : String(index + 1).padStart(2, "0")}
                  </span>

                  {step.timestamp && (
                    <span
                      style={{
                        color: "#87928b",
                        fontSize: "9px",
                        fontWeight: 800,
                        textAlign: "right",
                      }}
                    >
                      {formatDate(step.timestamp)}
                    </span>
                  )}
                </div>

                <h3
                  style={{
                    margin: "14px 0 5px",
                    color: "#2c4053",
                    fontFamily: "var(--font-display)",
                    fontSize: "19px",
                    lineHeight: 1.05,
                    fontWeight: 800,
                  }}
                >
                  {step.label}
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#647482",
                    fontSize: "11px",
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="kf-detail-journey-current"
            style={{
              marginTop: "14px",
              padding: "13px 15px",
              borderRadius: "18px",
              background: "#edf4f8",
              border: "1px solid #d9e6ed",
              color: "#58758a",
              fontSize: "11px",
              fontWeight: 800,
            }}
          >
            {t("Current KrutBharat status:")}{" "}
            <strong>{getStatusLabel(issue.status)}</strong>
          </div>
        </section>

        {/* STATUS HISTORY */}
        <section
          className="kf-detail-section kf-detail-history-section"
          style={{
            ...softSection("#fffdf9", "#dfe5ea"),
            padding: "26px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "19px" }}>
            <div className="kf-section-kicker" style={{ color: "#6689a3" }}>
              ACTIVITY RECORD
            </div>

            <h2 className="kf-section-title">
              {t("Status History")}
            </h2>

            <p className="kf-section-desc">
              {t(
                "This timeline shows status changes actually recorded in KrutBharat."
              )}
            </p>
          </div>

          {history.length === 0 ? (
            <div className="kf-empty">
              {t("No status-history records are currently available for this issue.")}
            </div>
          ) : (
            <div className="kf-history">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="kf-history-row"
                >
                  <div className="kf-history-rail">
                    <div className="kf-history-dot">
                      {getActorIcon(item.actor_type)}
                    </div>

                    {index < history.length - 1 && (
                      <div className="kf-history-line" />
                    )}
                  </div>

                  <div
                    className="kf-history-card"
                    style={{
                      flex: 1,
                      padding: "15px 17px",
                      marginBottom: index < history.length - 1 ? "10px" : 0,
                      borderRadius: "21px",
                      background:
                        index === history.length - 1
                          ? "#f7fbfd"
                          : "#fbfaf7",
                      border:
                        index === history.length - 1
                          ? "1px solid #d9e7ef"
                          : "1px solid #e6e1da",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          color: "#7d8790",
                          fontSize: "10px",
                          fontWeight: 800,
                        }}
                      >
                        {formatDate(item.created_at)}
                      </div>

                      <span
                        className="kf-history-status-pill"
                        style={{
                          padding: "6px 9px",
                          borderRadius: "999px",
                          background: "#edf5fa",
                          border: "1px solid #d7e6ee",
                          color: "#5c7d94",
                          fontSize: "9px",
                          fontWeight: 900,
                        }}
                      >
                        {getStatusLabel(item.new_status)}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: "8px 0 6px",
                        color: "#304559",
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        lineHeight: 1.1,
                        fontWeight: 800,
                      }}
                    >
                      {item.old_status
                        ? `${getStatusLabel(item.old_status)} → `
                        : ""}
                      {getStatusLabel(item.new_status)}
                    </h3>

                    <div
                      style={{
                        color: "#657582",
                        fontSize: "11px",
                        lineHeight: 1.55,
                      }}
                    >
                      {t("Recorded by")}{" "}
                      <strong>{getActorLabel(item.actor_type)}</strong>
                    </div>

                    {item.note && (
                      <p
                        style={{
                          margin: "9px 0 0",
                          color: "#677885",
                          fontSize: "12px",
                          lineHeight: 1.65,
                        }}
                      >
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="kf-history-footnote"
            style={{
              marginTop: "13px",
              padding: "12px 14px",
              borderRadius: "17px",
              background: "#f4f6f6",
              border: "1px solid #e1e6e5",
              color: "#7b858d",
              fontSize: "10px",
              lineHeight: 1.6,
            }}
          >
            {t(
              "Status history is generated from recorded KrutBharat status events. It does not imply that a government authority has changed the status unless the event is explicitly recorded as coming from an authority."
            )}
          </div>
        </section>

        {/* AUTHORITY ROUTING */}
        <section
          className="kf-detail-section kf-detail-authority-section"
          style={{
            ...softSection("#fffdf9", "#dbe5d1"),
            padding: "26px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="kf-section-kicker" style={{ color: "#718b57" }}>
                {t("DIRECTORY ROUTING")}
              </div>

              <h2 className="kf-section-title">
                {authority?.authority_name || t("Authority")}
              </h2>
            </div>

            {authority?.verified_at && (
              <span
                className="kf-authority-verified"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 11px",
                  borderRadius: "999px",
                  background: "#eef6e7",
                  border: "1px solid #d6e6c9",
                  color: "#65804a",
                  fontSize: "9px",
                  fontWeight: 900,
                }}
              >
                ✓ {t("Directory information verified:")}{" "}
                {formatDateOnly(authority.verified_at)}
              </span>
            )}
          </div>

          {authority ? (
            <>
              <div
                className="kf-authority-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "10px",
                  marginTop: "18px",
                }}
              >
                <div className="kf-detail-tile">
                  <div className="kf-info-label">{t("Department:")}</div>
                  <div className="kf-info-value">
                    {authority.department_name || t("Not specified")}
                  </div>
                </div>

                <div className="kf-detail-tile">
                  <div className="kf-info-label">{t("Sub-Department:")}</div>
                  <div className="kf-info-value">
                    {authority.sub_department_name || t("Not specified")}
                  </div>
                </div>

                <div className="kf-detail-tile">
                  <div className="kf-info-label">{t("Official Complaint Type:")}</div>
                  <div className="kf-info-value">
                    {authority.official_complaint_type || t("Not specified")}
                  </div>
                </div>

                <div className="kf-detail-tile">
                  <div className="kf-info-label">{t("Issue type:")}</div>
                  <div className="kf-info-value">{issue.category}</div>
                </div>
              </div>

              {authority.submission_method && (
                <div
                  className="kf-authority-channel"
                  style={{
                    marginTop: "12px",
                    padding: "14px 15px",
                    borderRadius: "19px",
                    background: "#eef4f8",
                    border: "1px solid #dae6ed",
                    color: "#557287",
                    fontSize: "12px",
                    lineHeight: 1.55,
                    fontWeight: 700,
                  }}
                >
                  {t("Channel:")}{" "}
                  <strong>{authority.submission_method}</strong>
                </div>
              )}

              {authority.notes && (
                <p
                  style={{
                    margin: "13px 0 0",
                    color: "#6b7985",
                    fontSize: "12px",
                    lineHeight: 1.65,
                  }}
                >
                  {authority.notes}
                </p>
              )}

              {authority.grievance_url && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "18px",
                  }}
                >
                  <a
                    href={authority.grievance_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      padding: "12px 16px",
                      borderRadius: "999px",
                      background: "#ff7a00",
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "11px",
                      fontWeight: 900,
                      boxShadow: "0 10px 22px rgba(255,122,0,.18)",
                    }}
                  >
                    {t("Open Official Complaint Channel →")}
                  </a>

                  <span
                    style={{
                      maxWidth: "620px",
                      color: "#7c878f",
                      fontSize: "10px",
                      lineHeight: 1.55,
                    }}
                  >
                    {t(
                      "This opens the official complaint channel for the matched authority. KrutBharat does not submit the complaint automatically through this route."
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div
              className="kf-empty"
              style={{ marginTop: "15px" }}
            >
              {t("ℹ️ No verified directory route is currently attached to this report.")}
            </div>
          )}
        </section>

        {/* OFFICIAL SUBMISSION */}
        <section
          className="kf-detail-section kf-detail-official-section"
          style={{
            ...softSection(
              "linear-gradient(135deg, #fffdf9 0%, #f9f5ee 54%, #edf4f8 100%)",
              "#ddd9d0"
            ),
            padding: "27px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div className="kf-section-kicker" style={{ color: "#b07848" }}>
              {t("OFFICIAL SUBMISSION")}
            </div>

            <h2 className="kf-section-title">
              {t("📤 Review Your Complaint")}
            </h2>

            <p className="kf-section-desc">
              {submission
                ? t(
                    "KrutBharat has already collected the information needed for this report. Review the prepared package before confirming it for the selected authority."
                  )
                : t(
                    "Your complaint package has not been prepared yet. KrutBharat will assemble it from the information already stored for this issue."
                  )}
            </p>
          </div>

          {!authority ? (
            <div className="kf-notice kf-notice-warm">
              {t(
                "A verified authority route is required before the submission package can be prepared."
              )}
            </div>
          ) : (
            <>
              {!submission && (
                <div
                  className="kf-official-prepare-panel"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                    padding: "18px",
                    borderRadius: "21px",
                    background: "#fff8ef",
                    border: "1px solid #f0dec8",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#314356",
                        fontSize: "15px",
                        fontWeight: 900,
                      }}
                    >
                      Prepare your complaint package
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        color: "#7b838a",
                        fontSize: "11px",
                      }}
                    >
                      KrutBharat will assemble the data already stored for this issue.
                    </div>
                  </div>

                  <button
                    className="kf-detail-primary-action"
                    type="button"
                    onClick={() => void prepareSubmission()}
                    disabled={preparingSubmission}
                    style={{
                      border: 0,
                      borderRadius: "999px",
                      background: preparingSubmission
                        ? "#d8c1ab"
                        : "#ff7a00",
                      color: "#fff",
                      padding: "13px 17px",
                      fontSize: "11px",
                      fontWeight: 900,
                      cursor: preparingSubmission
                        ? "not-allowed"
                        : "pointer",
                      boxShadow: "0 10px 22px rgba(255,122,0,.16)",
                    }}
                  >
                    {preparingSubmission
                      ? "Preparing..."
                      : "Prepare Complaint →"}
                  </button>
                </div>
              )}

              {submission && (
                <>
                  <div
                    className={`kf-submission-status-panel kf-submission-status-${submissionConfirmed ? "confirmed" : "ready"}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap",
                      padding: "15px 17px",
                      borderRadius: "21px",
                      background: submissionConfirmed
                        ? "#eef6e7"
                        : "#edf4f8",
                      border: `1px solid ${
                        submissionConfirmed ? "#d3e4c7" : "#d5e5ed"
                      }`,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: submissionConfirmed
                            ? "#5f7b45"
                            : "#55748a",
                          fontSize: "14px",
                          fontWeight: 900,
                        }}
                      >
                        {submissionConfirmed
                          ? "✓ Complaint details confirmed"
                          : "Complaint package ready for review"}
                      </div>

                      <div
                        style={{
                          marginTop: "4px",
                          color: "#7c878f",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        {t("Submission record #")}{submission.id}
                      </div>
                    </div>

                    <span
                      className="kf-submission-mode-pill"
                      style={{
                        padding: "7px 10px",
                        borderRadius: "999px",
                        background: "#fffdf9",
                        border: "1px solid #ddd8d0",
                        color: "#66737e",
                        fontSize: "9px",
                        fontWeight: 900,
                      }}
                    >
                      {getSubmissionModeLabel(submission.submission_mode)}
                    </span>
                  </div>

                  {/* COMPLAINT PREVIEW */}
                  <div
                    className="kf-preview-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "10px",
                      marginTop: "14px",
                    }}
                  >
                    <div className="kf-detail-tile">
                      <div className="kf-info-label">{t("Authority")}</div>
                      <div className="kf-info-value">
                        {authority.authority_name}
                      </div>
                    </div>

                    <div className="kf-detail-tile">
                      <div className="kf-info-label">{t("Department:")}</div>
                      <div className="kf-info-value">
                        {authority.department_name || t("Not specified")}
                      </div>
                    </div>

                    <div className="kf-detail-tile">
                      <div className="kf-info-label">{t("Issue")}</div>
                      <div className="kf-info-value">
                        {issue.title || t("Civic Issue")}
                      </div>
                    </div>

                    <div className="kf-detail-tile">
                      <div className="kf-info-label">{t("Issue Location")}</div>
                      <div className="kf-info-value">
                        {issue.location_text || t("Location not provided.")}
                      </div>
                    </div>
                  </div>

                  {/* CONFIRMATION */}
                  {!submissionConfirmed &&
                    submission.submission_status !== "FAILED" && (
                      <div
                        className="kf-confirmation-panel"
                        style={{
                          marginTop: "15px",
                          padding: "18px",
                          borderRadius: "22px",
                          background: "#faf8f4",
                          border: "1px solid #e4ded6",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "11px",
                            color: "#3c4f61",
                            fontSize: "13px",
                            lineHeight: 1.6,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={consentChecked}
                            onChange={(event) =>
                              setConsentChecked(event.target.checked)
                            }
                            style={{
                              width: "18px",
                              height: "18px",
                              marginTop: "2px",
                              accentColor: "#ff7a00",
                            }}
                          />

                          <span>
                            {t(
                              "I confirm that the complaint details, location and evidence shown above are correct and may be used for the official submission process."
                            )}
                          </span>
                        </label>

                        <p className="kf-small-note">
                          {t(
                            "Confirmation records your approval of this package. It does not itself mean that a government complaint has been submitted."
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() => void confirmSubmission()}
                          disabled={!consentChecked || confirmingSubmission}
                          style={{
                            marginTop: "13px",
                            border: 0,
                            borderRadius: "999px",
                            background:
                              !consentChecked || confirmingSubmission
                                ? "#d8d3cc"
                                : "#263b50",
                            color: "#fff",
                            padding: "13px 17px",
                            fontSize: "11px",
                            fontWeight: 900,
                            cursor:
                              !consentChecked || confirmingSubmission
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {confirmingSubmission
                            ? "Confirming..."
                            : "Confirm Complaint Details →"}
                        </button>
                      </div>
                    )}

                  {/* CONFIRMED */}
                  {submissionConfirmed && (
                    <div
                      className="kf-submission-confirmed-panel"
                      style={{
                        marginTop: "15px",
                        padding: "17px",
                        borderRadius: "22px",
                        background: "#eff7e9",
                        border: "1px solid #d4e7c8",
                      }}
                    >
                      <div
                        style={{
                          color: "#5e7b45",
                          fontSize: "15px",
                          fontWeight: 900,
                        }}
                      >
                        ✓ Ready for official submission
                      </div>

                      {submission.citizen_confirmed_at && (
                        <div
                          style={{
                            marginTop: "4px",
                            color: "#7e8b7a",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          {t("Confirmed on")}{" "}
                          {formatDate(submission.citizen_confirmed_at)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* GATEWAY */}
                  {submissionConfirmed &&
                    submission.submission_mode === "DIRECT_LINK" &&
                    submission.submission_status !== "SUBMITTED" && (
                      <div
                        className="kf-submission-gateway-panel"
                        style={{
                          marginTop: "15px",
                          padding: "19px",
                          borderRadius: "24px",
                          background:
                            "linear-gradient(135deg, #eef5f9 0%, #f5f8fa 100%)",
                          border: "1px solid #d8e6ee",
                        }}
                      >
                        <div className="kf-section-kicker" style={{ color: "#6888a0" }}>
                          SUBMISSION GATEWAY
                        </div>

                        <h3 className="kf-subsection-title">
                          {t("Next step: Submission Gateway")}
                        </h3>

                        <p className="kf-section-desc">
                          {t(
                            "Your complaint package has been prepared and confirmed. KrutBharat will now check the configured authority submission route. For the current CSMC route, the gateway will direct you to the official complaint system rather than claiming an automatic government submission."
                          )}
                        </p>

                        {gatewayMessage && (
                          <div className="kf-notice kf-notice-blue">
                            {gatewayMessage}
                          </div>
                        )}

                        {gatewayUrl && (
                          <a
                            className="kf-detail-primary-action"
                            href={gatewayUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => void markOfficialComplaintChannelOpened()}
                            style={{
                              display: "inline-flex",
                              marginTop: "10px",
                              padding: "13px 17px",
                              borderRadius: "999px",
                              background: "#ff7a00",
                              color: "#fff",
                              textDecoration: "none",
                              fontSize: "11px",
                              fontWeight: 900,
                              boxShadow: "0 10px 22px rgba(255,122,0,.18)",
                            }}
                          >
                            {t("Open Official Complaint Channel →")}
                          </a>
                        )}

                        {!gatewayUrl && (
                          <button
                            className="kf-detail-primary-action"
                            type="button"
                            onClick={() => void submitThroughGateway()}
                            disabled={submittingSubmission}
                            style={{
                              marginTop: "10px",
                              border: 0,
                              borderRadius: "999px",
                              background: submittingSubmission
                                ? "#d8c1ab"
                                : "#ff7a00",
                              color: "#fff",
                              padding: "13px 17px",
                              fontSize: "11px",
                              fontWeight: 900,
                              cursor: submittingSubmission
                                ? "not-allowed"
                                : "pointer",
                              boxShadow: "0 10px 22px rgba(255,122,0,.16)",
                            }}
                          >
                            {submittingSubmission
                              ? "Opening..."
                              : "Continue to Official Channel →"}
                          </button>
                        )}
                      </div>
                    )}

                  {/* CITIZEN SUBMISSION RECORD */}
                  {submissionConfirmed &&
                    submission.submission_mode === "DIRECT_LINK" &&
                    officialHandoffOpenedAt &&
                    submission.submission_status !== "SUBMITTED" && (
                      <div
                        className="kf-citizen-submission-panel"
                        style={{
                          marginTop: "15px",
                          padding: "19px",
                          borderRadius: "24px",
                          background: "#f5f0fa",
                          border: "1px solid #e3d9ec",
                        }}
                      >
                        <div className="kf-section-kicker" style={{ color: "#7a6c92" }}>
                          CITIZEN-REPORTED SUBMISSION
                        </div>

                        <h3 className="kf-subsection-title">
                          {submission.citizen_reported_submitted_at
                            ? "✓ Submission reported by you"
                            : "After you submit on the official form"}
                        </h3>

                        {submission.citizen_reported_submitted_at ? (
                          <div
                            style={{
                              display: "grid",
                              gap: "8px",
                              marginTop: "10px",
                            }}
                          >
                            <div className="kf-detail-tile">
                              <div className="kf-info-label">
                                {t("Reference number:")}
                              </div>
                              <div className="kf-info-value">
                                {submission.official_reference_number ||
                                  referenceNumber ||
                                  "—"}
                              </div>
                            </div>

                            {submission.official_submission_notes && (
                              <div className="kf-detail-tile">
                                <div className="kf-info-label">
                                  {t("Notes:")}
                                </div>
                                <div className="kf-info-value">
                                  {submission.official_submission_notes}
                                </div>
                              </div>
                            )}

                            <div
                              style={{
                                color: "#857d8f",
                                fontSize: "10px",
                                lineHeight: 1.55,
                              }}
                            >
                              {t(
                                "KrutBharat has recorded the reference number you provided. This is a citizen-reported record and has not been independently verified by the government system."
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="kf-section-desc">
                              {t(
                                "Opening the official channel does not itself mean that a government complaint has been submitted. Any official submission or reference number must come from the government system."
                              )}
                            </p>

                            <div
                              className="kf-input-grid"
                              style={{
                                display: "grid",
                                gap: "10px",
                                marginTop: "10px",
                              }}
                            >
                              <label className="kf-field">
                                <span>{t("Government Complaint / Reference Number")}</span>
                                <input
                                  type="text"
                                  value={referenceNumber}
                                  onChange={(event) =>
                                    setReferenceNumber(event.target.value)
                                  }
                                  placeholder={t(
                                    "Enter the number shown after successful submission"
                                  )}
                                />
                              </label>

                              <label className="kf-field">
                                <span>{t("Notes (optional)")}</span>
                                <textarea
                                  value={submissionNotes}
                                  onChange={(event) =>
                                    setSubmissionNotes(event.target.value)
                                  }
                                  rows={4}
                                  placeholder={t(
                                    "Example: submitted on the CSMC website and received confirmation screen"
                                  )}
                                />
                              </label>
                            </div>

                            <p className="kf-small-note">
                              {t(
                                "Once the government form confirms your submission, enter the reference/complaint number here. KrutBharat will store it as a citizen-provided reference; it will not be treated as an official KrutBharat submission confirmation."
                              )}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                void recordOfficialComplaintReference()
                              }
                              disabled={savingOfficialReference}
                              style={{
                                marginTop: "9px",
                                border: 0,
                                borderRadius: "999px",
                                background: savingOfficialReference
                                  ? "#d8d3cc"
                                  : "#30455a",
                                color: "#fff",
                                padding: "12px 16px",
                                fontSize: "11px",
                                fontWeight: 900,
                                cursor: savingOfficialReference
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {savingOfficialReference
                                ? "Saving..."
                                : "Save Official Reference →"}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                  {/* API MODE */}
                  {submissionConfirmed &&
                    submission.submission_mode === "API" && (
                      <div className="kf-notice kf-notice-blue" style={{ marginTop: "15px" }}>
                        {t(
                          "API submission mode is configured for this authority. The actual government API call will only be enabled after an authorized integration is connected."
                        )}
                      </div>
                    )}

                  {/* ALREADY SUBMITTED */}
                  {submission.submission_status === "SUBMITTED" && (
                    <div
                      className="kf-official-submitted-panel kf-dark-panel-green"
                      style={{
                        marginTop: "15px",
                        padding: "18px",
                        borderRadius: "22px",
                        background: "#eef6e7",
                        border: "1px solid #d4e6c7",
                      }}
                    >
                      <div
                        style={{
                          color: "#5b7844",
                          fontSize: "15px",
                          fontWeight: 900,
                        }}
                      >
                        {t("✓ Official submission recorded")}
                      </div>

                      {submission.official_reference_id && (
                        <div
                          style={{
                            marginTop: "7px",
                            color: "#536b49",
                            fontSize: "12px",
                            lineHeight: 1.55,
                          }}
                        >
                          <strong>{t("Official reference:")}</strong>{" "}
                          {submission.official_reference_id}
                        </div>
                      )}

                      {submission.submitted_at && (
                        <div
                          style={{
                            marginTop: "4px",
                            color: "#73826d",
                            fontSize: "10px",
                          }}
                        >
                          {t("Submitted:")}{" "}
                          {formatDate(submission.submitted_at)}
                        </div>
                      )}

                      {submission.official_reference_url && (
                        <a
                          href={submission.official_reference_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            marginTop: "10px",
                            color: "#4f728a",
                            fontSize: "11px",
                            fontWeight: 900,
                            textDecoration: "none",
                          }}
                        >
                          {t("View Official Reference →")}
                        </a>
                      )}
                    </div>
                  )}

                  {submission.error_message && (
                    <div className="kf-notice kf-notice-red" style={{ marginTop: "13px" }}>
                      {submission.error_message}
                    </div>
                  )}

                  {submission.submission_status === "FAILED" && (
                    <button
                      className="kf-detail-primary-action kf-detail-retry-action"
                      type="button"
                      onClick={() => void prepareSubmission()}
                      disabled={preparingSubmission}
                      style={{
                        marginTop: "12px",
                        border: 0,
                        borderRadius: "999px",
                        background: preparingSubmission
                          ? "#d8d3cc"
                          : "#30455a",
                        color: "#fff",
                        padding: "12px 16px",
                        fontSize: "11px",
                        fontWeight: 900,
                        cursor: preparingSubmission
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {preparingSubmission ? "Preparing..." : t("Try Again →")}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </section>

        {/* FOLLOW-UP */}
        <section
          className="kf-detail-section kf-detail-followup-section"
          style={{
            ...softSection(
              "linear-gradient(135deg, #fffdf9 0%, #fbf8f4 100%)",
              "#e1d9e7"
            ),
            padding: "26px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "19px" }}>
            <div className="kf-section-kicker" style={{ color: "#7d6a94" }}>
              FOLLOW-UP
            </div>

            <h2 className="kf-section-title">
              {t("Follow-up & Government Updates")}
            </h2>

            <p className="kf-section-desc">
              {t(
                "Record what happened after your complaint was submitted. These updates are citizen-reported unless KrutBharat later receives verifiable information from the authority."
              )}
            </p>
          </div>

          <div
            className="kf-followup-form-panel"
            style={{
              padding: "19px",
              borderRadius: "23px",
              background: "#f5f0fa",
              border: "1px solid #e3d9ec",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <label className="kf-field">
                <span>{t("What happened after submission?")}</span>

                <select
                  value={followUpStatus}
                  onChange={(event) =>
                    setFollowUpStatus(
                      event.target.value as FollowUpStatus
                    )
                  }
                >
                  <option value="NO_RESPONSE">
                    {t("No Response / Awaiting Update")}
                  </option>
                  <option value="ACKNOWLEDGED">
                    {t("Acknowledged")}
                  </option>
                  <option value="IN_PROGRESS">
                    {t("In Progress")}
                  </option>
                  <option value="RESOLVED">
                    {t("Resolved")}
                  </option>
                  <option value="CLOSED">{t("Closed")}</option>
                  <option value="REJECTED">{t("Rejected")}</option>
                </select>
              </label>

              <label className="kf-field">
                <span>{t("Update note (optional)")}</span>
                <textarea
                  value={followUpNote}
                  onChange={(event) =>
                    setFollowUpNote(event.target.value)
                  }
                  rows={4}
                  placeholder={t(
                    "Example: I received an SMS saying the complaint was acknowledged"
                  )}
                />
              </label>

              <label className="kf-field">
                <span>{t("Evidence attachment (optional)")}</span>
                <input
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  onChange={(event) =>
                    setFollowUpEvidence(event.target.files?.[0] ?? null)
                  }
                />
                <small>
                  {t(
                    "Attach a photo or PDF that supports this update. Maximum 5 MB."
                  )}
                </small>
              </label>

              {followUpEvidence && (
                <div className="kf-file-chip">
                  {t("Selected:")} {followUpEvidence.name}
                </div>
              )}

              <button
                type="button"
                onClick={() => void recordFollowUp()}
                disabled={savingFollowUp}
                style={{
                  justifySelf: "start",
                  border: 0,
                  borderRadius: "999px",
                  background: savingFollowUp ? "#d8c9dd" : "#806796",
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: "11px",
                  fontWeight: 900,
                  cursor: savingFollowUp
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {savingFollowUp ? "Saving..." : "Record Follow-up →"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: "17px" }}>
            <div className="kf-list-heading">
              {t("Recorded follow-ups")}
            </div>

            {followups.length === 0 ? (
              <div className="kf-empty">
                {t(
                  "No citizen-reported follow-up updates have been recorded yet."
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                {followups.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="kf-record-card"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          color: "#304457",
                          fontFamily: "var(--font-display)",
                          fontSize: "19px",
                          fontWeight: 800,
                        }}
                      >
                        {followUpStatusLabel(followUp.status)}
                      </div>

                      <span className="kf-time">
                        {formatDate(followUp.created_at)}
                      </span>
                    </div>

                    <div className="kf-record-caption">
                      {t("Citizen-reported update")}
                    </div>

                    {followUp.note && (
                      <p className="kf-record-note">
                        {followUp.note}
                      </p>
                    )}

                    {followUp.verification_status === "VERIFIED" && (
                      <div className="kf-verified">
                        {t("✓ KrutBharat verified")}
                      </div>
                    )}

                    {followUp.verification_status === "NOT_VERIFIED" && (
                      <div className="kf-not-verified">
                        {t("⚠ Not verified")}
                      </div>
                    )}

                    {followUp.verification_status === "PENDING" && (
                      <div className="kf-pending">
                        {t("⏳ Verification pending")}
                      </div>
                    )}

                    {followUp.verification_note && (
                      <div className="kf-record-extra">
                        <strong>{t("Verification note:")}</strong>{" "}
                        {followUp.verification_note}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                      }}
                    >
                      {followUp.verification_source_url && (
                        <a
                          href={followUp.verification_source_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("🔗 Verification source →")}
                        </a>
                      )}

                      {followUp.evidence_url && (
                        <a
                          href={followUp.evidence_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("📎 View attached evidence →")}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RESOLUTION */}
        {issue.status === "resolved" && (
          <section
            className="kf-detail-section kf-detail-resolution-section"
            style={{
              ...softSection(
                "linear-gradient(135deg, #f4f9ee 0%, #fffdf9 100%)",
                "#d9e6cc"
              ),
              padding: "26px",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "19px" }}>
              <div className="kf-section-kicker" style={{ color: "#6d874b" }}>
                {t("RESOLUTION VERIFICATION")}
              </div>

              <h2 className="kf-section-title">
                {t("Did the problem actually get fixed?")}
              </h2>

              <p className="kf-section-desc">
                {t(
                  "KrutBharat currently records this issue as Resolved. Check the location yourself and record what you observe. This is a citizen observation and does not automatically change the administrative status."
                )}
              </p>
            </div>

            <div
              className="kf-resolution-form-panel"
              style={{
                padding: "19px",
                borderRadius: "23px",
                background: "#eef6e7",
                border: "1px solid #d8e8cc",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <label className="kf-field">
                  <span>{t("What did you observe?")}</span>

                  <select
                    value={resolutionResult}
                    onChange={(event) =>
                      setResolutionResult(
                        event.target.value as ResolutionCheckResult
                      )
                    }
                  >
                    <option value="FIXED">{t("✅ Fixed")}</option>
                    <option value="PARTIALLY_FIXED">
                      {t("🟡 Partially Fixed")}
                    </option>
                    <option value="NOT_FIXED">
                      {t("❌ Not Fixed")}
                    </option>
                    <option value="RETURNED">
                      {t("🔁 Problem Returned")}
                    </option>
                  </select>
                </label>

                <label className="kf-field">
                  <span>{t("Observation note (optional)")}</span>

                  <textarea
                    value={resolutionNote}
                    onChange={(event) =>
                      setResolutionNote(event.target.value)
                    }
                    rows={4}
                    placeholder={t(
                      "Describe what you observed at the location..."
                    )}
                  />
                </label>

                <label className="kf-field">
                  <span>{t("After-repair evidence (optional)")}</span>

                  <input
                    type="file"
                    accept="image/*,.pdf,application/pdf"
                    onChange={(event) =>
                      setResolutionEvidence(
                        event.target.files?.[0] ?? null
                      )
                    }
                  />

                  <small>
                    {t(
                      "Upload a current photo or PDF that supports your observation. Maximum 5 MB."
                    )}
                  </small>
                </label>

                {resolutionEvidence && (
                  <div className="kf-file-chip">
                    {t("Selected:")} {resolutionEvidence.name}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void recordResolutionCheck()}
                  disabled={savingResolutionCheck}
                  style={{
                    justifySelf: "start",
                    border: 0,
                    borderRadius: "999px",
                    background: savingResolutionCheck
                      ? "#c5d3b7"
                      : "#66834a",
                    color: "#fff",
                    padding: "12px 16px",
                    fontSize: "11px",
                    fontWeight: 900,
                    cursor: savingResolutionCheck
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {savingResolutionCheck
                    ? "Saving..."
                    : "Save Resolution Check →"}
                </button>
              </div>
            </div>

            <div style={{ marginTop: "17px" }}>
              <div className="kf-list-heading">
                {t("Recorded resolution checks")}
              </div>

              {resolutionChecks.length === 0 ? (
                <div className="kf-empty">
                  {t("No citizen resolution checks have been recorded yet.")}
                </div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {resolutionChecks.map((check) => (
                    <div
                      key={check.id}
                      className="kf-record-card"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            color: "#304457",
                            fontFamily: "var(--font-display)",
                            fontSize: "19px",
                            fontWeight: 800,
                          }}
                        >
                          {resolutionResultIcon(check.resolution_result)}{" "}
                          {resolutionResultLabel(check.resolution_result)}
                        </div>

                        <span className="kf-time">
                          {formatDate(check.created_at)}
                        </span>
                      </div>

                      <div className="kf-record-caption">
                        {t("Citizen-reported resolution check")}
                      </div>

                      {check.note && (
                        <p className="kf-record-note">
                          {check.note}
                        </p>
                      )}

                      {check.evidence_url && (
                        <a
                          href={check.evidence_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("📎 View resolution evidence →")}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="kf-small-note" style={{ marginTop: "13px" }}>
              {t(
                "KrutBharat stores these observations as a separate history. They do not automatically change the administrative issue status."
              )}
            </div>
          </section>
        )}

        {/* SUBMISSION ASSISTANT */}
        {submission &&
          submissionConfirmed &&
          submission.submission_mode === "DIRECT_LINK" && (
            <section
              className="kf-detail-section kf-detail-assistant-section"
              style={{
                ...softSection(
                  "linear-gradient(135deg, #fffdf9 0%, #fff7ee 100%)",
                  "#ead9ca"
                ),
                padding: "26px",
                marginBottom: "16px",
              }}
            >
              <div style={{ marginBottom: "19px" }}>
                <div className="kf-section-kicker" style={{ color: "#9d764f" }}>
                  {t("SUBMISSION ASSISTANT")}
                </div>

                <h2 className="kf-section-title">
                  {t("🧾 Your Complaint Copy Pack")}
                </h2>

                <p className="kf-section-desc">
                  {t(
                    "KrutBharat has loaded the citizen details saved in your profile and combined them with the complaint information. Keep this copy pack ready while completing the official government form. KrutBharat does not bypass cross-domain controls or CAPTCHA."
                  )}
                </p>
              </div>

              <div className="kf-copy-grid">
                {[
                  [t("Person Name"), citizenProfile?.name || t("Not provided in KrutBharat profile."), "name"],
                  [t("Mobile Number"), citizenProfile?.mobile || t("Not provided in KrutBharat profile."), "mobile"],
                  [t("Email"), citizenEmail || t("No email available from the authenticated account."), "email"],
                  [t("Residential Address"), [citizenProfile?.house_no, citizenProfile?.address].filter(Boolean).join(", ") || t("Not provided in KrutBharat profile."), "address"],
                  [t("City / State"), [citizenProfile?.city, citizenProfile?.state].filter(Boolean).join(", ") || t("City / State not available."), "cityState"],
                  [t("Zone"), citizenProfile?.zone || t("Not configured in authority directory."), "zone"],
                  [t("Ward"), citizenProfile?.ward || t("Not configured in authority directory."), "ward"],
                  [t("Authority"), authority?.authority_name || t("Not specified"), "authority"],
                  [t("Sub-Department"), authority?.sub_department_name || t("Not configured in authority directory."), "subDepartment"],
                  [t("Subject"), issue.title || t("Civic Issue"), "subject"],
                  [t("Complaint Description"), issue.description || t("No complaint description provided."), "description"],
                  [t("Issue Location"), issue.location_text || t("Location not provided."), "location"],
                  [t("GPS Coordinates"), issue.latitude !== null && issue.longitude !== null ? `${issue.latitude}, ${issue.longitude}` : t("GPS coordinates not available."), "gps"],
                  [t("Submission Route"), authority?.submission_method || t("Not specified"), "route"],
                ].map(([label, value, key]) => (
                  <div
                    key={String(key)}
                    className="kf-copy-item"
                  >
                    <div className="kf-copy-label">{label}</div>
                    <div className="kf-copy-value">{value}</div>

                    <button
                      type="button"
                      onClick={() => void copyField(String(key), String(value))}
                      className="kf-copy-button"
                    >
                      {copiedField === key
                        ? t("Copied ✓")
                        : t("Copy")}
                    </button>
                  </div>
                ))}

                <div
                  className="kf-copy-item kf-copy-evidence"
                  style={{
                    gridColumn: "1 / -1",
                    background: "#f3f7fa",
                    borderColor: "#d9e7ef",
                  }}
                >
                  <div className="kf-copy-label">{t("Evidence")}</div>
                  <div className="kf-copy-value">
                    {photoUrl
                      ? t("✓ Photo evidence ready")
                      : t("No photo evidence attached")}
                  </div>

                  {photoUrl && (
                    <a
                      href={photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="kf-copy-link"
                    >
                      {t("Use the evidence image shown above when the official form asks for a photo.")}
                    </a>
                  )}
                </div>
              </div>

              <div className="kf-notice kf-notice-warm" style={{ marginTop: "14px" }}>
                <strong>{t("Still required on the official form:")}</strong>{" "}
                {t(
                  "verify the copied citizen details and the authority-specific mapping, complete any zone/ward or other selections that KrutBharat does not have, enter CAPTCHA, and perform the final Submit action yourself."
                )}
              </div>

              <div
                className="kf-assistant-footnote"
                style={{
                  marginTop: "12px",
                  padding: "13px 14px",
                  borderRadius: "18px",
                  background: "#fffdf9",
                  border: "1px solid #e4ded5",
                  color: "#78848d",
                  fontSize: "10px",
                  lineHeight: 1.65,
                }}
              >
                {t(
                  "Citizen profile fields are loaded from KrutBharat, while the matched authority directory supplies the configured department, sub-department and official complaint type."
                )}
              </div>
            </section>
          )}

        {/* REPORT REFERENCE */}
        <section
          className="kf-detail-section kf-detail-reference-section"
          style={{
            ...softSection("#f1f6f9", "#d7e5ec"),
            padding: "25px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              color: "#66849a",
              fontSize: "9px",
              fontWeight: 900,
              letterSpacing: ".17em",
              marginBottom: "5px",
            }}
          >
            REPORT REFERENCE
          </div>

          <h2 className="kf-section-title">
            {t("Report Reference")}
          </h2>

          <div
            className="kf-reference-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gap: "9px",
              marginTop: "14px",
            }}
          >
            <div className="kf-detail-tile">
              <div className="kf-info-label">{t("Civic Issue ID:")}</div>
              <div className="kf-info-value kf-break">{issue.id}</div>
            </div>

            {issue.authority_directory_id && (
              <div className="kf-detail-tile">
                <div className="kf-info-label">
                  {t("Authority Directory ID:")}
                </div>
                <div className="kf-info-value">
                  {issue.authority_directory_id}
                </div>
              </div>
            )}

            {issue.authority_reference_id && (
              <div className="kf-detail-tile">
                <div className="kf-info-label">
                  {t("Authority Reference ID:")}
                </div>
                <div className="kf-info-value kf-break">
                  {issue.authority_reference_id}
                </div>
              </div>
            )}

            {submission && (
              <div className="kf-detail-tile">
                <div className="kf-info-label">
                  {t("Submission Record ID:")}
                </div>
                <div className="kf-info-value">
                  {submission.id}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <div
          className="kf-detail-footer"
          style={{
            padding: "18px 19px",
            borderRadius: "21px",
            background: "rgba(255,253,249,.78)",
            border: "1px solid #e1dbd2",
            color: "#77828a",
            fontSize: "10px",
            lineHeight: 1.7,
          }}
        >
          {t(
            "KrutBharat currently records the evidence, location, report status, status history, submission package and directory-based routing information. This page does not represent an official government status unless an official authority reference or verified government response has been recorded."
          )}
        </div>
      </div>

      <style>{`
        .kf-detail-page * {
          box-sizing: border-box;
        }

        .kf-detail-page button,
        .kf-detail-page input,
        .kf-detail-page textarea,
        .kf-detail-page select,
        .kf-detail-page a {
          font-family: var(--font-body);
        }

        .kf-detail-page h1,
        .kf-detail-page h2,
        .kf-detail-page h3 {
          text-shadow: none !important;
        }

        .kf-section-kicker {
          margin-bottom: 5px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .17em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .kf-section-title {
          margin: 0;
          color: #24364a;
          font-family: var(--font-display);
          font-size: 30px;
          line-height: 1.05;
          letter-spacing: -.03em;
          font-weight: 800;
        }

        .kf-section-desc {
          margin: 8px 0 0;
          max-width: 850px;
          color: #637482 !important;
          font-size: 13px !important;
          line-height: 1.7 !important;
        }

        .kf-subsection-title {
          margin: 7px 0 0;
          color: #294054;
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-info-label {
          color: #6f7f8a !important;
          font-size: 10px;
          line-height: 1.35;
          font-weight: 900;
          letter-spacing: .045em;
        }

        .kf-info-value {
          margin-top: 5px;
          color: #2d4255 !important;
          font-size: 14px;
          line-height: 1.55;
          font-weight: 800;
        }

        .kf-detail-tile {
          padding: 15px;
          border-radius: 19px;
          background: #fbfaf7;
          border: 1px solid #e4dfd7;
        }

        .kf-empty {
          padding: 17px;
          border-radius: 20px;
          background: #f7f5f1;
          border: 1px solid #e4dfd9;
          color: #667580;
          font-size: 12px;
          line-height: 1.65;
        }

        .kf-journey-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .kf-journey-step {
          min-width: 0;
        }

        .kf-history {
          display: grid;
          gap: 0;
        }

        .kf-history-row {
          display: grid;
          grid-template-columns: 50px minmax(0, 1fr);
          gap: 8px;
        }

        .kf-history-rail {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .kf-history-dot {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #edf5fa;
          border: 1px solid #d4e4ed;
          color: #587991;
          font-size: 15px;
          z-index: 1;
        }

        .kf-history-line {
          flex: 1;
          width: 2px;
          margin: -2px 0 -2px;
          background: #dce8ee;
        }

        .kf-notice {
          padding: 14px 15px;
          border-radius: 19px;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 700;
        }

        .kf-notice-warm {
          background: #fff7ec;
          border: 1px solid #efdcc6;
          color: #8a6c4f;
        }

        .kf-notice-blue {
          background: #edf5f9;
          border: 1px solid #d6e5ed;
          color: #55738a;
        }

        .kf-notice-red {
          background: #fff0ed;
          border: 1px solid #ebd0c8;
          color: #925b4d;
        }

        .kf-field {
          display: grid;
          gap: 7px;
        }

        .kf-field > span {
          color: #425669;
          font-size: 11px;
          font-weight: 900;
        }

        .kf-field > small {
          color: #7b878f;
          font-size: 10px;
          line-height: 1.5;
        }

        .kf-field input,
        .kf-field textarea,
        .kf-field select {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid #d6d0c8;
          border-radius: 16px;
          background: #fffdf9;
          color: #304154;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
        }

        .kf-field textarea {
          resize: vertical;
          min-height: 105px;
        }

        .kf-field input:focus,
        .kf-field textarea:focus,
        .kf-field select:focus {
          border-color: #e4ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-file-chip {
          padding: 10px 12px;
          border-radius: 14px;
          background: #fffdf9;
          border: 1px solid #ded8d0;
          color: #63727e;
          font-size: 10px;
          font-weight: 800;
          word-break: break-word;
        }

        .kf-small-note {
          margin-top: 10px;
          color: #7a858d !important;
          font-size: 10px !important;
          line-height: 1.65 !important;
        }

        .kf-list-heading {
          margin-bottom: 9px;
          color: #77838c;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .kf-record-card {
          padding: 16px;
          border-radius: 21px;
          background: #fffdf9;
          border: 1px solid #e4ded6;
        }

        .kf-time {
          color: #8a959c;
          font-size: 9px;
          font-weight: 800;
        }

        .kf-record-caption {
          margin-top: 5px;
          color: #7c8790;
          font-size: 10px;
          font-weight: 700;
        }

        .kf-record-note {
          margin: 9px 0 0 !important;
          color: #5f6f7c !important;
          font-size: 12px !important;
          line-height: 1.65 !important;
        }

        .kf-record-extra {
          margin-top: 8px;
          color: #687680;
          font-size: 10px;
          line-height: 1.6;
        }

        .kf-verified,
        .kf-not-verified,
        .kf-pending {
          display: inline-flex;
          margin-top: 9px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
        }

        .kf-verified {
          background: #eef6e7;
          border: 1px solid #d7e7cb;
          color: #628047;
        }

        .kf-not-verified {
          background: #fff0ed;
          border: 1px solid #ecd0c8;
          color: #925b4d;
        }

        .kf-pending {
          background: #fff7e7;
          border: 1px solid #eee0c6;
          color: #8d704e;
        }

        .kf-copy-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .kf-copy-item {
          position: relative;
          min-width: 0;
          padding: 14px 46px 14px 15px;
          border-radius: 19px;
          background: #fffdf9;
          border: 1px solid #e4ded6;
        }

        .kf-copy-label {
          color: #78848d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .kf-copy-value {
          margin-top: 6px;
          color: #304457;
          font-size: 12px;
          line-height: 1.6;
          font-weight: 800;
          word-break: break-word;
        }

        .kf-copy-button {
          position: absolute;
          right: 10px;
          top: 10px;
          border: 1px solid #ddd6cd !important;
          border-radius: 999px !important;
          background: #f6f4ef !important;
          color: #60707c !important;
          padding: 6px 8px !important;
          font-size: 8px !important;
          font-weight: 900 !important;
          cursor: pointer;
        }

        .kf-copy-link {
          display: inline-block;
          margin-top: 8px;
          color: #527891;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .kf-break {
          word-break: break-all;
        }

        /* Dark-mode navbar brand:
           the global stylesheet has a broader ".brand-name span" rule that
           can recolor every span. Use a more specific selector here so
           Krut stays white while Bharat remains orange. */
        html[data-theme="dark"] .kf-detail-page .kf-detail-brand-name .kf-detail-brand-krut,
        html[data-theme="dark"] .kf-detail-page .kf-detail-brand-name span.kf-detail-brand-krut {
          color: #ffffff !important;
        }

        html[data-theme="dark"] .kf-detail-page .kf-detail-brand-name .kf-detail-brand-bharat {
          color: #ff7a00 !important;
        }

        @media (max-width: 900px) {
          .kf-journey-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .kf-detail-page {
            padding: 14px 11px 56px !important;
          }

          .kf-topbar {
            position: relative;
            top: 0;
          }

          .kf-topbar label > span {
            display: none;
          }

          .kf-section-title {
            font-size: 27px;
          }

          .kf-issue-page h1 {
            font-size: 42px !important;
          }

          .kf-overview-grid,
          .kf-authority-grid,
          .kf-preview-grid,
          .kf-reference-grid,
          .kf-copy-grid,
          .kf-journey-grid {
            grid-template-columns: 1fr !important;
          }

          .kf-history-row {
            grid-template-columns: 42px minmax(0, 1fr);
          }

          .kf-detail-page section {
            padding: 20px !important;
            border-radius: 25px !important;
          }

          .kf-copy-item {
            padding-right: 42px;
          }
        }
      `}</style>
    </main>
  );
}
