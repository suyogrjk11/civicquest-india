"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type Mission = {
  id: string;
  title: string;
  title_i18n: Partial<Record<Language, string>> | null;
  description: string;
  description_i18n: Partial<Record<Language, string>> | null;
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



function localizedMissionText(
  value: Partial<Record<Language, string>> | null | undefined,
  fallback: string,
  language: Language
) {
  return value?.[language] || value?.en || fallback;
}

function localizedMissionType(
  value: string,
  language: Language
) {
  const map: Record<string, Record<Language, string>> = {
    green_action: {
      en: "TREE PLANTING",
      hi: "वृक्षारोपण",
      mr: "वृक्षारोपण",
    },
    clean_space: {
      en: "CLEANUP",
      hi: "स्वच्छता",
      mr: "स्वच्छता",
    },
    civic_revisit: {
      en: "ISSUE REVISIT",
      hi: "नागरिक समस्या पुनः निरीक्षण",
      mr: "नागरी समस्या पुनर्भेट",
    },
    community_awareness: {
      en: "AWARENESS",
      hi: "जागरूकता",
      mr: "जनजागृती",
    },
    public_space_observation: {
      en: "CIVIC OBSERVATION",
      hi: "नागरिक निरीक्षण",
      mr: "नागरी निरीक्षण",
    },
  };

  return (
    map[value.toLowerCase()]?.[language] ??
    value.replaceAll("_", " ")
  );
}

const missionUi: Record<
  Language,
  {
    back: string;
    points: string;
    verification: string;
    required: string;
    notRequired: string;
    evidence: string;
    beforeAfter: string;
    photo: string;
    ends: string;
    yourSubmission: string;
    submitted: string;
    verifiedMessage: string;
    awaitingVerification: string;
    completeMission: string;
    genuineEvidence: string;
    evidencePhoto: string;
    evidencePhotoHelp: string;
    selected: string;
    location: string;
    locationHelp: string;
    gettingLocation: string;
    locationCaptured: string;
    captureLocation: string;
    locationCapturedSuccessfully: string;
    whatDidYouDo: string;
    notesPlaceholder: string;
    submitting: string;
    submitForVerification: string;
    impactRecord: string;
    showTheChange: string;
    impactHelp: string;
    before: string;
    beforeHelp: string;
    beforePlaceholder: string;
    after: string;
    afterHelp: string;
    afterPlaceholder: string;
    impactSummary: string;
    impactPlaceholder: string;
    submittingImpact: string;
    submitImpact: string;
    beforeAfterRecorded: string;
    beforeConditionRecorded: string;
    afterConditionRecorded: string;
    impactSubmitted: string;
    loadingMission: string;
    civicMission: string;
  }
> = {
  en: {
    back: "← Back to Civic Leagues",
    points: "POINTS",
    verification: "Verification",
    required: "Required",
    notRequired: "Not required",
    evidence: "Evidence",
    beforeAfter: "Before → After",
    photo: "Photo",
    ends: "Ends",
    yourSubmission: "Your submission",
    submitted: "Submitted",
    verifiedMessage: "✓ Your mission has been verified.",
    awaitingVerification:
      "Your evidence is awaiting verification. Points are awarded only after verification.",
    completeMission: "Complete this mission",
    genuineEvidence:
      "Submit genuine evidence from your real-world civic activity. Your submission will be reviewed before points are awarded.",
    evidencePhoto: "Evidence photo",
    evidencePhotoHelp:
      "Upload a clear photo showing your mission activity. Maximum size: 10 MB.",
    selected: "Selected",
    location: "Location",
    locationHelp:
      "Your location helps verify that the action happened where submitted.",
    gettingLocation: "Getting location...",
    locationCaptured: "✓ Location captured",
    captureLocation: "Capture my location",
    locationCapturedSuccessfully: "Location captured successfully.",
    whatDidYouDo: "What did you do?",
    notesPlaceholder: "Briefly describe the civic action you completed...",
    submitting: "Submitting...",
    submitForVerification: "Submit mission for verification",
    impactRecord: "Impact record",
    showTheChange: "Show the change",
    impactHelp:
      "Capture the same place before and after your civic action. This creates a longitudinal impact record rather than just a claim of participation.",
    before: "Before",
    beforeHelp: "Capture the condition before your action.",
    beforePlaceholder: "Describe the condition before...",
    after: "After",
    afterHelp: "Capture the same place after your action.",
    afterPlaceholder: "Describe the condition after...",
    impactSummary: "Impact summary",
    impactPlaceholder: "What changed because of this action?",
    submittingImpact: "Submitting impact...",
    submitImpact: "Submit Before → After impact",
    beforeAfterRecorded: "Before → After recorded",
    beforeConditionRecorded: "Before condition recorded.",
    afterConditionRecorded: "After condition recorded.",
    impactSubmitted: "Impact submitted",
    loadingMission: "Loading mission...",
    civicMission: "Civic Mission",
  },
  hi: {
    back: "← सिविक लीग्स पर वापस जाएँ",
    points: "अंक",
    verification: "सत्यापन",
    required: "आवश्यक",
    notRequired: "आवश्यक नहीं",
    evidence: "प्रमाण",
    beforeAfter: "पहले → बाद में",
    photo: "फोटो",
    ends: "समाप्ति",
    yourSubmission: "आपका सबमिशन",
    submitted: "जमा किया गया",
    verifiedMessage: "✓ आपका मिशन सत्यापित हो गया है।",
    awaitingVerification:
      "आपका प्रमाण सत्यापन की प्रतीक्षा में है। अंक केवल सत्यापन के बाद दिए जाते हैं।",
    completeMission: "यह मिशन पूरा करें",
    genuineEvidence:
      "अपनी वास्तविक नागरिक गतिविधि का प्रमाण जमा करें। अंक देने से पहले आपके सबमिशन की समीक्षा की जाएगी।",
    evidencePhoto: "प्रमाण फोटो",
    evidencePhotoHelp:
      "अपनी मिशन गतिविधि दिखाने वाली स्पष्ट फोटो अपलोड करें। अधिकतम आकार: 10 MB।",
    selected: "चयनित",
    location: "स्थान",
    locationHelp:
      "आपका स्थान यह सत्यापित करने में मदद करता है कि कार्रवाई बताए गए स्थान पर हुई।",
    gettingLocation: "स्थान प्राप्त किया जा रहा है...",
    locationCaptured: "✓ स्थान दर्ज हो गया",
    captureLocation: "मेरा स्थान दर्ज करें",
    locationCapturedSuccessfully: "स्थान सफलतापूर्वक दर्ज हो गया।",
    whatDidYouDo: "आपने क्या किया?",
    notesPlaceholder: "आपने पूरी की गई नागरिक कार्रवाई का संक्षेप में वर्णन करें...",
    submitting: "जमा किया जा रहा है...",
    submitForVerification: "सत्यापन के लिए मिशन जमा करें",
    impactRecord: "प्रभाव रिकॉर्ड",
    showTheChange: "बदलाव दिखाएँ",
    impactHelp:
      "अपनी नागरिक कार्रवाई से पहले और बाद में उसी स्थान की तस्वीरें लें। इससे केवल भागीदारी के दावे के बजाय समय के साथ प्रभाव का रिकॉर्ड बनता है।",
    before: "पहले",
    beforeHelp: "कार्रवाई से पहले की स्थिति की फोटो लें।",
    beforePlaceholder: "पहले की स्थिति का वर्णन करें...",
    after: "बाद में",
    afterHelp: "कार्रवाई के बाद उसी स्थान की फोटो लें।",
    afterPlaceholder: "बाद की स्थिति का वर्णन करें...",
    impactSummary: "प्रभाव का सारांश",
    impactPlaceholder: "इस कार्रवाई के कारण क्या बदला?",
    submittingImpact: "प्रभाव जमा किया जा रहा है...",
    submitImpact: "पहले → बाद का प्रभाव जमा करें",
    beforeAfterRecorded: "पहले → बाद का रिकॉर्ड तैयार है",
    beforeConditionRecorded: "पहले की स्थिति दर्ज है।",
    afterConditionRecorded: "बाद की स्थिति दर्ज है।",
    impactSubmitted: "प्रभाव जमा किया गया",
    loadingMission: "मिशन लोड हो रहा है...",
    civicMission: "सिविक मिशन",
  },
  mr: {
    back: "← सिविक लीग्सकडे परत जा",
    points: "गुण",
    verification: "पडताळणी",
    required: "आवश्यक",
    notRequired: "आवश्यक नाही",
    evidence: "पुरावा",
    beforeAfter: "आधी → नंतर",
    photo: "छायाचित्र",
    ends: "समाप्ती",
    yourSubmission: "तुमचे सबमिशन",
    submitted: "सादर केले",
    verifiedMessage: "✓ तुमचे मिशन सत्यापित झाले आहे.",
    awaitingVerification:
      "तुमचा पुरावा पडताळणीच्या प्रतीक्षेत आहे. गुण केवळ पडताळणीनंतर दिले जातात.",
    completeMission: "हे मिशन पूर्ण करा",
    genuineEvidence:
      "तुमच्या प्रत्यक्ष नागरी कृतीचा अस्सल पुरावा सादर करा. गुण देण्यापूर्वी तुमच्या सबमिशनची तपासणी केली जाईल.",
    evidencePhoto: "पुरावा छायाचित्र",
    evidencePhotoHelp:
      "तुमची मिशन कृती दिसेल असे स्पष्ट छायाचित्र अपलोड करा. कमाल आकार: 10 MB.",
    selected: "निवडलेले",
    location: "ठिकाण",
    locationHelp:
      "तुम्ही सादर केलेली कृती त्या ठिकाणी झाली हे पडताळण्यासाठी तुमचे स्थान मदत करते.",
    gettingLocation: "स्थान मिळवत आहे...",
    locationCaptured: "✓ स्थान नोंदवले",
    captureLocation: "माझे स्थान नोंदवा",
    locationCapturedSuccessfully: "स्थान यशस्वीपणे नोंदवले गेले.",
    whatDidYouDo: "तुम्ही काय केले?",
    notesPlaceholder: "तुम्ही पूर्ण केलेल्या नागरी कृतीचे थोडक्यात वर्णन करा...",
    submitting: "सादर करत आहे...",
    submitForVerification: "पडताळणीसाठी मिशन सादर करा",
    impactRecord: "परिणाम नोंद",
    showTheChange: "बदल दाखवा",
    impactHelp:
      "तुमच्या नागरी कृतीपूर्वी आणि नंतर त्याच ठिकाणाची छायाचित्रे घ्या. यामुळे केवळ सहभागाचा दावा न राहता कालानुक्रमिक परिणाम नोंदवता येतो.",
    before: "आधी",
    beforeHelp: "कृतीपूर्वीची स्थिती नोंदवा.",
    beforePlaceholder: "आधीची स्थिती वर्णन करा...",
    after: "नंतर",
    afterHelp: "कृतीनंतर त्याच ठिकाणाची स्थिती नोंदवा.",
    afterPlaceholder: "नंतरची स्थिती वर्णन करा...",
    impactSummary: "परिणामाचा सारांश",
    impactPlaceholder: "या कृतीमुळे काय बदलले?",
    submittingImpact: "परिणाम सादर करत आहे...",
    submitImpact: "आधी → नंतर परिणाम सादर करा",
    beforeAfterRecorded: "आधी → नंतर नोंद झाली",
    beforeConditionRecorded: "आधीची स्थिती नोंदवली आहे.",
    afterConditionRecorded: "नंतरची स्थिती नोंदवली आहे.",
    impactSubmitted: "परिणाम सादर केला",
    loadingMission: "मिशन लोड होत आहे...",
    civicMission: "नागरी मिशन",
  },
};

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const t = missionUi[language];

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
          language === "en" ? "Please sign in to participate in this mission." : language === "hi" ? "इस मिशन में भाग लेने के लिए साइन इन करें।" : "या मिशनमध्ये सहभागी होण्यासाठी साइन इन करा."
        );
        return;
      }

      const {
        data: missionData,
        error: missionError,
      } = await supabase
        .from("civic_missions")
        .select(
          "id,title,title_i18n,description,description_i18n,mission_type,points,starts_at,ends_at,verification_required,max_completions_per_user,metadata"
        )
        .eq("id", missionId)
        .eq("is_active", true)
        .maybeSingle();

      if (missionError) {
        throw missionError;
      }

      if (!missionData) {
        setError(
          language === "en" ? "This mission could not be found." : language === "hi" ? "यह मिशन नहीं मिला।" : "हे मिशन सापडले नाही."
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
        language === "en" ? `Unable to load this mission: ${message}` : language === "hi" ? `यह मिशन लोड नहीं हो सका: ${message}` : `हे मिशन लोड करता आले नाही: ${message}`
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
        language === "en" ? "Please select an image file." : language === "hi" ? "कृपया एक इमेज फ़ाइल चुनें।" : "कृपया प्रतिमा फाइल निवडा."
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        language === "en" ? "Each image must be smaller than 10 MB." : language === "hi" ? "प्रत्येक इमेज 10 MB से छोटी होनी चाहिए।" : "प्रत्येक प्रतिमा 10 MB पेक्षा लहान असावी."
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
        language === "en" ? "Location services are not supported by this browser." : language === "hi" ? "इस ब्राउज़र में लोकेशन सेवा समर्थित नहीं है।" : "या ब्राउझरमध्ये स्थान सेवा समर्थित नाही."
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
          language === "en" ? "Unable to get your location. Please allow location access and try again." : language === "hi" ? "आपका स्थान नहीं मिल सका। कृपया लोकेशन की अनुमति दें और फिर प्रयास करें।" : "तुमचे स्थान मिळाले नाही. कृपया स्थानाची परवानगी देऊन पुन्हा प्रयत्न करा."
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
          language === "en" ? "Please sign in before submitting a mission." : language === "hi" ? "मिशन जमा करने से पहले साइन इन करें।" : "मिशन सादर करण्यापूर्वी साइन इन करा."
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
            language === "en" ? "Please capture your location before submitting." : language === "hi" ? "सबमिट करने से पहले अपना स्थान दर्ज करें।" : "सादर करण्यापूर्वी तुमचे स्थान नोंदवा."
          );
        }
      }

      if (
        mission.metadata?.evidence_type &&
        !photo
      ) {
        throw new Error(
          language === "en" ? "Please upload the required evidence photo." : language === "hi" ? "कृपया आवश्यक प्रमाण फोटो अपलोड करें।" : "कृपया आवश्यक पुरावा छायाचित्र अपलोड करा."
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
        language === "en" ? "Mission submitted successfully. Your evidence is now awaiting verification." : language === "hi" ? "मिशन सफलतापूर्वक जमा हुआ। आपका प्रमाण अब सत्यापन की प्रतीक्षा में है।" : "मिशन यशस्वीपणे सादर झाले. तुमचा पुरावा आता पडताळणीच्या प्रतीक्षेत आहे."
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
        language === "en" ? `Unable to submit mission: ${message}` : language === "hi" ? `मिशन जमा नहीं हो सका: ${message}` : `मिशन सादर करता आले नाही: ${message}`
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
        language === "en" ? "Submit the mission first." : language === "hi" ? "पहले मिशन जमा करें।" : "प्रथम मिशन सादर करा."
      );
      return;
    }

    if (!beforePhoto) {
      setImpactError(
        language === "en" ? "Please upload the before photo." : language === "hi" ? "कृपया पहले की फोटो अपलोड करें।" : "कृपया आधीचे छायाचित्र अपलोड करा."
      );
      return;
    }

    if (!afterPhoto) {
      setImpactError(
        language === "en" ? "Please upload the after photo." : language === "hi" ? "कृपया बाद की फोटो अपलोड करें।" : "कृपया नंतरचे छायाचित्र अपलोड करा."
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
          language === "en" ? "Please sign in before submitting impact evidence." : language === "hi" ? "प्रभाव प्रमाण जमा करने से पहले साइन इन करें।" : "परिणामाचा पुरावा सादर करण्यापूर्वी साइन इन करा."
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
        language === "en" ? "Before → After impact submitted successfully." : language === "hi" ? "पहले → बाद का प्रभाव सफलतापूर्वक जमा हुआ।" : "आधी → नंतर परिणाम यशस्वीपणे सादर झाला."
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
        language === "en" ? `Unable to submit impact: ${message}` : language === "hi" ? `प्रभाव जमा नहीं हो सका: ${message}` : `परिणाम सादर करता आला नाही: ${message}`
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
      <main className="kf-mission-page kf-loading-page">
        <div className="kf-loading-card">
          <div className="kf-wordmark">
            Karma<span>Facie</span>
          </div>

          <div className="kf-loading-bar" />

          <p>{t.loadingMission}</p>
        </div>
      </main>
    );
  }

  if (error && !mission) {
    return (
      <main className="kf-mission-page kf-loading-page">
        <div className="kf-error-card">
          <span className="kf-eyebrow">{t.civicMission}</span>

          <h1>{t.civicMission}</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => router.push("/leagues")}
            className="kf-primary-button"
          >
            {t.back}
          </button>
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
    mission.metadata?.evidence_type ===
    "before_after";

  const missionTitle = localizedMissionText(
    mission.title_i18n,
    mission.title,
    language
  );

  const missionDescription =
    localizedMissionText(
      mission.description_i18n,
      mission.description,
      language
    );

  const missionType =
    localizedMissionType(
      mission.mission_type,
      language
    );

  return (
    <main className="kf-mission-page">
      <div className="kf-mission-shell">

        {/* TOP BAR */}
        <header className="kf-mission-topbar">
          <button
            type="button"
            onClick={() => router.push("/leagues")}
            className="kf-back-button"
          >
            <span className="kf-back-arrow">←</span>
            {t.back.replace("← ", "")}
          </button>

          <div className="kf-mission-brand">
            <div className="kf-brand-box">K</div>

            <div>
              <div className="kf-brand-name">
                Karma<span>Facie</span>
              </div>

              <div className="kf-brand-caption">
                CIVIC PARTICIPATION
              </div>
            </div>
          </div>

          <label className="kf-language">
            <span>
              {language === "en"
                ? "Language"
                : "भाषा"}
            </span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as Language
                )
              }
              aria-label={
                language === "en"
                  ? "Language"
                  : "भाषा"
              }
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        {/* HERO */}
        <section className="kf-mission-hero">
          <div className="kf-hero-orb kf-hero-orb-blue" />
          <div className="kf-hero-orb kf-hero-orb-peach" />

          <div className="kf-hero-content">
            <div className="kf-eyebrow">
              {missionType}
            </div>

            <div className="kf-hero-row">
              <div className="kf-hero-copy">
                <h1>{missionTitle}</h1>

                <p>{missionDescription}</p>
              </div>

              <div className="kf-points-card">
                <div className="kf-points-number">
                  +{mission.points}
                </div>

                <div className="kf-points-label">
                  {t.points}
                </div>
              </div>
            </div>

            <div className="kf-mission-meta">
              <div className="kf-meta-tile">
                <span className="kf-meta-icon">✓</span>

                <div>
                  <div className="kf-meta-label">
                    {t.verification}
                  </div>
                  <div className="kf-meta-value">
                    {mission.verification_required
                      ? t.required
                      : t.notRequired}
                  </div>
                </div>
              </div>

              <div className="kf-meta-tile">
                <span className="kf-meta-icon">📸</span>

                <div>
                  <div className="kf-meta-label">
                    {t.evidence}
                  </div>

                  <div className="kf-meta-value">
                    {isBeforeAfterMission
                      ? t.beforeAfter
                      : mission.metadata
                          ?.evidence_type ||
                        t.photo}
                  </div>
                </div>
              </div>

              <div className="kf-meta-tile">
                <span className="kf-meta-icon">⌛</span>

                <div>
                  <div className="kf-meta-label">
                    {t.ends}
                  </div>

                  <div className="kf-meta-value">
                    {new Date(
                      mission.ends_at
                    ).toLocaleDateString(
                      language === "hi"
                        ? "hi-IN"
                        : language === "mr"
                          ? "mr-IN"
                          : "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ALERTS */}
        {error && (
          <div className="kf-alert kf-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="kf-alert kf-alert-success">
            {success}
          </div>
        )}

        {impactError && (
          <div className="kf-alert kf-alert-error">
            {impactError}
          </div>
        )}

        {impactSuccess && (
          <div className="kf-alert kf-alert-success">
            {impactSuccess}
          </div>
        )}

        {/* EXISTING SUBMISSION */}
        {alreadySubmitted && (
          <section className="kf-section kf-status-section">
            <div className="kf-section-head">
              <div>
                <div className="kf-section-kicker">
                  {t.yourSubmission}
                </div>

                <h2>
                  {submission.status
                    .replaceAll("_", " ")}
                </h2>
              </div>

              <div className="kf-status-badge">
                {submission.status === "verified"
                  ? "✓"
                  : "•"}
                <span className="capitalize">
                  {submission.status
                    .replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <p className="kf-section-description">
              {t.submitted}{" "}
              {new Date(
                submission.submitted_at
              ).toLocaleString(
                language === "hi"
                  ? "hi-IN"
                  : language === "mr"
                    ? "mr-IN"
                    : "en-IN"
              )}
            </p>

            {submission.status ===
              "verified" ? (
              <div className="kf-inline-success">
                {t.verifiedMessage}
              </div>
            ) : (
              <div className="kf-inline-info">
                {t.awaitingVerification}
              </div>
            )}
          </section>
        )}

        {/* COMPLETE MISSION */}
        {!alreadySubmitted && (
          <section className="kf-section">
            <div className="kf-section-head">
              <div>
                <div className="kf-section-kicker kf-kicker-orange">
                  {t.completeMission}
                </div>

                <h2>{t.genuineEvidence}</h2>
              </div>

              <div className="kf-step-number">01</div>
            </div>

            <form
              onSubmit={submitMission}
              className="kf-form"
            >
              <div className="kf-form-block kf-blue-block">
                <div className="kf-form-heading">
                  <span className="kf-form-icon">📷</span>

                  <div>
                    <h3>{t.evidencePhoto}</h3>

                    <p>
                      {t.evidencePhotoHelp}
                    </p>
                  </div>
                </div>

                <label className="kf-upload-box">
                  <input
                    id="mission-photo"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={
                      handlePhotoChange
                    }
                    required
                  />

                  <span className="kf-upload-icon">
                    +
                  </span>

                  <strong>
                    {photo
                      ? `${t.selected}: ${photo.name}`
                      : t.evidencePhoto}
                  </strong>

                  <small>
                    {t.evidencePhotoHelp}
                  </small>
                </label>
              </div>

              <div className="kf-form-block kf-green-block">
                <div className="kf-form-heading">
                  <span className="kf-form-icon">📍</span>

                  <div>
                    <h3>{t.location}</h3>

                    <p>
                      {t.locationHelp}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className={
                    latitude !== null
                      ? "kf-location-button kf-location-done"
                      : "kf-location-button"
                  }
                >
                  {locationLoading
                    ? t.gettingLocation
                    : latitude !== null
                      ? t.locationCaptured
                      : t.captureLocation}
                </button>

                {latitude !== null &&
                  longitude !== null && (
                    <div className="kf-location-readout">
                      {t.locationCapturedSuccessfully}{" "}
                      <strong>
                        {latitude.toFixed(6)},{" "}
                        {longitude.toFixed(6)}
                      </strong>
                    </div>
                  )}
              </div>

              <div className="kf-form-block kf-peach-block">
                <div className="kf-form-heading">
                  <span className="kf-form-icon">✍️</span>

                  <div>
                    <h3>{t.whatDidYouDo}</h3>
                    <p>
                      {t.notesPlaceholder}
                    </p>
                  </div>
                </div>

                <textarea
                  id="mission-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder={
                    t.notesPlaceholder
                  }
                  rows={6}
                  className="kf-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="kf-submit-button"
              >
                {submitting
                  ? t.submitting
                  : t.submitForVerification}
              </button>
            </form>
          </section>
        )}

        {/* BEFORE / AFTER */}
        {isBeforeAfterMission &&
          submission &&
          !impact && (
            <section className="kf-section kf-impact-section">
              <div className="kf-section-head">
                <div>
                  <div className="kf-section-kicker kf-kicker-green">
                    {t.impactRecord}
                  </div>

                  <h2>{t.showTheChange}</h2>

                  <p className="kf-section-description">
                    {t.impactHelp}
                  </p>
                </div>

                <div className="kf-step-number">02</div>
              </div>

              <form
                onSubmit={submitImpact}
                className="kf-form"
              >
                <div className="kf-before-after-grid">
                  <div className="kf-compare-card kf-before-card">
                    <div className="kf-compare-tag">
                      {t.before}
                    </div>

                    <h3>
                      {t.beforeHelp}
                    </h3>

                    <label className="kf-upload-box kf-upload-box-compact">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={
                          handleBeforePhotoChange
                        }
                        required
                      />

                      <span className="kf-upload-icon">
                        +
                      </span>

                      <strong>
                        {beforePhoto
                          ? `${t.selected}: ${beforePhoto.name}`
                          : t.before}
                      </strong>

                      <small>
                        {t.beforeHelp}
                      </small>
                    </label>

                    <textarea
                      value={beforeNote}
                      onChange={(event) =>
                        setBeforeNote(
                          event.target.value
                        )
                      }
                      placeholder={
                        t.beforePlaceholder
                      }
                      rows={4}
                      className="kf-textarea"
                    />
                  </div>

                  <div className="kf-compare-card kf-after-card">
                    <div className="kf-compare-tag">
                      {t.after}
                    </div>

                    <h3>
                      {t.afterHelp}
                    </h3>

                    <label className="kf-upload-box kf-upload-box-compact">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={
                          handleAfterPhotoChange
                        }
                        required
                      />

                      <span className="kf-upload-icon">
                        +
                      </span>

                      <strong>
                        {afterPhoto
                          ? `${t.selected}: ${afterPhoto.name}`
                          : t.after}
                      </strong>

                      <small>
                        {t.afterHelp}
                      </small>
                    </label>

                    <textarea
                      value={afterNote}
                      onChange={(event) =>
                        setAfterNote(
                          event.target.value
                        )
                      }
                      placeholder={
                        t.afterPlaceholder
                      }
                      rows={4}
                      className="kf-textarea"
                    />
                  </div>
                </div>

                <div className="kf-form-block kf-lavender-block">
                  <div className="kf-form-heading">
                    <span className="kf-form-icon">✨</span>

                    <div>
                      <h3>{t.impactSummary}</h3>
                      <p>{t.impactPlaceholder}</p>
                    </div>
                  </div>

                  <textarea
                    value={impactSummary}
                    onChange={(event) =>
                      setImpactSummary(
                        event.target.value
                      )
                    }
                    placeholder={
                      t.impactPlaceholder
                    }
                    rows={5}
                    className="kf-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingImpact}
                  className="kf-submit-button kf-submit-green"
                >
                  {submittingImpact
                    ? t.submittingImpact
                    : t.submitImpact}
                </button>
              </form>
            </section>
          )}

        {/* EXISTING IMPACT */}
        {impact && (
          <section className="kf-section kf-impact-record">
            <div className="kf-section-head">
              <div>
                <div className="kf-section-kicker kf-kicker-green">
                  {t.impactRecord}
                </div>

                <h2>
                  {t.beforeAfterRecorded}
                </h2>
              </div>

              <div className="kf-status-badge kf-status-green">
                ✓{" "}
                {impact.status.replaceAll(
                  "_",
                  " "
                )}
              </div>
            </div>

            {impact.impact_summary && (
              <p className="kf-large-note">
                {impact.impact_summary}
              </p>
            )}

            <div className="kf-before-after-grid">
              <div className="kf-record-pane kf-before-card">
                <div className="kf-compare-tag">
                  {t.before}
                </div>

                <p>
                  {impact.before_note ||
                    t.beforeConditionRecorded}
                </p>
              </div>

              <div className="kf-record-pane kf-after-card">
                <div className="kf-compare-tag">
                  {t.after}
                </div>

                <p>
                  {impact.after_note ||
                    t.afterConditionRecorded}
                </p>
              </div>
            </div>

            <div className="kf-record-time">
              {t.impactSubmitted}{" "}
              {new Date(
                impact.created_at
              ).toLocaleString(
                language === "hi"
                  ? "hi-IN"
                  : language === "mr"
                    ? "mr-IN"
                    : "en-IN"
              )}
            </div>
          </section>
        )}

      </div>

      <style>{`
        .kf-mission-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #536574;
          --kf-muted: #74818c;
          --kf-orange: #ff7a00;
          --kf-blue: #eaf3f8;
          --kf-blue-line: #d4e4ec;
          --kf-green: #eef6e7;
          --kf-green-line: #d5e5c9;
          --kf-peach: #fff0df;
          --kf-peach-line: #eed9c2;
          --kf-lavender: #f3eef8;
          --kf-lavender-line: #dfd4ea;
          --kf-line: #ded8d0;

          min-height: 100vh;
          padding: 20px 16px 80px;
          color: var(--kf-body);
          background:
            radial-gradient(circle at 92% 3%, rgba(214,232,242,.95) 0%, rgba(214,232,242,0) 25%),
            radial-gradient(circle at 4% 28%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 23%),
            radial-gradient(circle at 90% 92%, rgba(255,229,205,.76) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          font-family: var(--font-body);
        }

        .kf-mission-page *,
        .kf-mission-page *::before,
        .kf-mission-page *::after {
          box-sizing: border-box;
        }

        .kf-mission-shell {
          width: min(1040px, 100%);
          margin: 0 auto;
        }

        .kf-mission-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid var(--kf-line);
          border-radius: 25px;
          background: rgba(255,253,249,.95);
          box-shadow: 0 13px 34px rgba(16,27,43,.055);
          backdrop-filter: blur(16px);
        }

        .kf-back-button {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          padding: 9px 13px;
          border: 1px solid #ddd7cf;
          border-radius: 999px;
          background: #fffdf9;
          color: #4d6070;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .kf-back-arrow {
          color: var(--kf-orange);
          font-size: 17px;
          line-height: 1;
        }

        .kf-mission-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-brand-box {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(255,122,0,.17);
        }

        .kf-brand-name {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 23px;
          line-height: 1;
          letter-spacing: -.045em;
          font-weight: 800;
        }

        .kf-brand-name span {
          color: var(--kf-orange);
        }

        .kf-brand-caption {
          margin-top: 3px;
          color: #8b938f;
          font-size: 8px;
          line-height: 1;
          letter-spacing: .16em;
          font-weight: 900;
        }

        .kf-language {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #566675;
          font-size: 11px;
          font-weight: 900;
        }

        .kf-language select {
          min-width: 118px;
          padding: 10px 13px;
          border: 1px solid #d7d1c9;
          border-radius: 999px;
          background: #fffdf9;
          color: #304154;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .kf-language select:focus {
          border-color: #e8b17a;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-mission-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
          padding: 31px;
          border: 1px solid #ddd7ce;
          border-radius: 33px;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 35%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97);
          box-shadow: 0 18px 48px rgba(16,27,43,.06);
        }

        .kf-hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-hero-orb-blue {
          width: 180px;
          height: 180px;
          right: -76px;
          top: -76px;
          background: rgba(207,227,239,.54);
        }

        .kf-hero-orb-peach {
          width: 150px;
          height: 100px;
          left: -40px;
          bottom: -52px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.42);
          transform: rotate(8deg);
        }

        .kf-hero-content {
          position: relative;
          z-index: 1;
        }

        .kf-eyebrow,
        .kf-section-kicker {
          color: #8b7560;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-hero-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 22px;
          margin-top: 13px;
        }

        .kf-hero-copy {
          min-width: 0;
          max-width: 770px;
        }

        .kf-hero-copy h1 {
          margin: 0;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(42px, 6vw, 62px);
          line-height: .98;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-hero-copy p {
          max-width: 740px;
          margin: 12px 0 0;
          color: #5b6c7a;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-points-card {
          width: 126px;
          min-width: 126px;
          padding: 16px 13px;
          border-radius: 22px;
          background: var(--kf-peach);
          border: 1px solid var(--kf-peach-line);
          text-align: center;
        }

        .kf-points-number {
          color: #9a6c45;
          font-family: var(--font-display);
          font-size: 30px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-points-label {
          margin-top: 6px;
          color: #967e68;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .kf-mission-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(16,27,43,.09);
        }

        .kf-meta-tile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          border-radius: 19px;
          background: rgba(255,253,249,.74);
          border: 1px solid rgba(16,27,43,.08);
        }

        .kf-meta-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: #edf4f8;
          color: #58788e;
          font-size: 13px;
        }

        .kf-meta-label {
          color: #849098;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .kf-meta-value {
          margin-top: 3px;
          color: #314557;
          font-size: 12px;
          font-weight: 900;
        }

        .kf-section {
          margin-bottom: 16px;
          padding: 27px;
          border: 1px solid var(--kf-line);
          border-radius: 30px;
          background: rgba(255,253,249,.95);
          box-shadow: 0 14px 38px rgba(16,27,43,.055);
        }

        .kf-status-section {
          background: linear-gradient(135deg, #fffdf9 0%, #f2f7ed 100%);
          border-color: #dce8d1;
        }

        .kf-impact-section {
          background: linear-gradient(135deg, #fffdf9 0%, #f4f8ef 100%);
          border-color: #dbe7d0;
        }

        .kf-impact-record {
          background: linear-gradient(135deg, #f4f9ee 0%, #fffdf9 100%);
          border-color: #d8e7cc;
        }

        .kf-section-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .kf-section-head h2 {
          margin: 5px 0 0;
          color: var(--kf-ink);
          font-family: var(--font-display);
          font-size: 32px;
          line-height: 1.03;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .kf-section-description {
          margin: 8px 0 0;
          max-width: 850px;
          color: #60717f;
          font-size: 14px;
          line-height: 1.7;
        }

        .kf-kicker-orange { color: #a26f45; }
        .kf-kicker-green { color: #718855; }

        .kf-step-number {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          background: #f0f3ee;
          border: 1px solid #dde4da;
          color: #74816f;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-form {
          display: grid;
          gap: 12px;
        }

        .kf-form-block {
          padding: 18px;
          border-radius: 23px;
          border: 1px solid #e2ddd5;
        }

        .kf-blue-block {
          background: #edf5fa;
          border-color: var(--kf-blue-line);
        }

        .kf-green-block {
          background: #f0f6eb;
          border-color: var(--kf-green-line);
        }

        .kf-peach-block {
          background: #fff5e9;
          border-color: var(--kf-peach-line);
        }

        .kf-lavender-block {
          background: #f4eff9;
          border-color: var(--kf-lavender-line);
        }

        .kf-form-heading {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 13px;
        }

        .kf-form-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: rgba(255,255,255,.70);
          border: 1px solid rgba(16,27,43,.07);
          font-size: 16px;
        }

        .kf-form-heading h3 {
          margin: 0;
          color: #304559;
          font-family: var(--font-display);
          font-size: 21px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-form-heading p {
          margin: 4px 0 0;
          color: #697984;
          font-size: 11px;
          line-height: 1.55;
        }

        .kf-upload-box {
          position: relative;
          display: grid;
          place-items: center;
          gap: 5px;
          min-height: 126px;
          padding: 20px;
          border: 1px dashed #cbd6dc;
          border-radius: 20px;
          background: rgba(255,253,249,.72);
          text-align: center;
          cursor: pointer;
        }

        .kf-upload-box input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .kf-upload-box strong {
          color: #385064;
          font-size: 12px;
          font-weight: 900;
        }

        .kf-upload-box small {
          max-width: 540px;
          color: #7a8790;
          font-size: 9px;
          line-height: 1.45;
        }

        .kf-upload-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #fffdf9;
          border: 1px solid #dde2e4;
          color: #748a99;
          font-size: 20px;
          font-weight: 500;
        }

        .kf-upload-box-compact {
          min-height: 112px;
        }

        .kf-location-button {
          border: 1px solid #cbdcc0;
          border-radius: 999px;
          background: #fffdf9;
          color: #5f7846;
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .kf-location-button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }

        .kf-location-done {
          background: #e6f1dc;
          color: #55733e;
        }

        .kf-location-readout {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 15px;
          background: rgba(255,253,249,.72);
          border: 1px solid #dce7d5;
          color: #6c7a70;
          font-size: 10px;
          line-height: 1.6;
        }

        .kf-textarea {
          width: 100%;
          resize: vertical;
          min-height: 115px;
          padding: 14px 15px;
          border: 1px solid #d8d2c9;
          border-radius: 17px;
          background: #fffdf9;
          color: #314559;
          font-family: var(--font-body);
          font-size: 13px;
          line-height: 1.65;
          outline: none;
        }

        .kf-textarea:focus {
          border-color: #e6ad76;
          box-shadow: 0 0 0 4px rgba(255,122,0,.08);
        }

        .kf-submit-button,
        .kf-primary-button {
          width: 100%;
          border: 0;
          border-radius: 999px;
          background: var(--kf-orange);
          color: #fff;
          padding: 14px 18px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(255,122,0,.16);
        }

        .kf-submit-button:disabled,
        .kf-primary-button:disabled {
          cursor: not-allowed;
          opacity: .55;
          box-shadow: none;
        }

        .kf-submit-green {
          background: #69864c;
          box-shadow: 0 12px 24px rgba(105,134,76,.13);
        }

        .kf-before-after-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .kf-compare-card,
        .kf-record-pane {
          padding: 18px;
          border-radius: 23px;
          border: 1px solid #e1ddd5;
        }

        .kf-before-card {
          background: #f5eff9;
          border-color: #e0d6e9;
        }

        .kf-after-card {
          background: #eef6e9;
          border-color: #d6e5cc;
        }

        .kf-compare-tag {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #fffdf9;
          border: 1px solid rgba(16,27,43,.09);
          color: #647481;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .kf-compare-card h3 {
          margin: 10px 0 13px;
          color: #304458;
          font-family: var(--font-display);
          font-size: 20px;
          line-height: 1.1;
          font-weight: 800;
        }

        .kf-compare-card .kf-textarea {
          margin-top: 12px;
        }

        .kf-alert {
          margin-bottom: 12px;
          padding: 13px 15px;
          border-radius: 18px;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 800;
        }

        .kf-alert-error {
          background: #fff0ed;
          border: 1px solid #ecd0c8;
          color: #955b4d;
        }

        .kf-alert-success {
          background: #eef6e7;
          border: 1px solid #d5e6ca;
          color: #5e7a44;
        }

        .kf-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border-radius: 999px;
          background: #edf5fa;
          border: 1px solid #d4e5ee;
          color: #5c7890;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-status-green {
          background: #eaf4e3;
          border-color: #d2e2c7;
          color: #5f7a45;
        }

        .kf-inline-info,
        .kf-inline-success {
          margin-top: 14px;
          padding: 13px 14px;
          border-radius: 18px;
          font-size: 11px;
          line-height: 1.6;
          font-weight: 800;
        }

        .kf-inline-info {
          background: #edf5fa;
          border: 1px solid #d7e5ed;
          color: #5c7890;
        }

        .kf-inline-success {
          background: #eef6e7;
          border: 1px solid #d5e6ca;
          color: #5f7b45;
        }

        .kf-large-note {
          margin: 0 0 18px;
          color: #485c6d;
          font-size: 15px;
          line-height: 1.72;
          font-weight: 700;
        }

        .kf-record-pane p {
          margin: 10px 0 0;
          color: #5e6f7d;
          font-size: 13px;
          line-height: 1.7;
        }

        .kf-record-time {
          margin-top: 14px;
          color: #849097;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-loading-page {
          display: grid;
          place-items: center;
        }

        .kf-loading-card,
        .kf-error-card {
          width: min(470px, 100%);
          padding: 35px 30px;
          border: 1px solid var(--kf-line);
          border-radius: 30px;
          background: rgba(255,253,249,.96);
          box-shadow: 0 20px 56px rgba(16,27,43,.08);
          text-align: center;
        }

        .kf-wordmark {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 36px;
          line-height: 1;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-wordmark span {
          color: var(--kf-orange);
        }

        .kf-loading-bar {
          width: 68px;
          height: 5px;
          margin: 15px auto;
          border-radius: 999px;
          background: var(--kf-orange);
        }

        .kf-loading-card p,
        .kf-error-card p {
          margin: 0;
          color: #687985;
          font-size: 13px;
          line-height: 1.65;
        }

        .kf-error-card h1 {
          margin: 8px 0 10px;
          color: var(--kf-ink);
          font-family: var(--font-display);
          font-size: 37px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-error-card .kf-primary-button {
          margin-top: 20px;
          width: auto;
        }

        .capitalize {
          text-transform: capitalize;
        }

        @media (max-width: 900px) {
          .kf-mission-topbar {
            grid-template-columns: 1fr auto;
          }

          .kf-mission-brand {
            grid-column: 1 / -1;
            grid-row: 1;
          }

          .kf-back-button {
            grid-column: 1;
            grid-row: 2;
          }

          .kf-language {
            grid-column: 2;
            grid-row: 2;
          }

          .kf-hero-row {
            flex-direction: column;
          }

          .kf-points-card {
            width: auto;
            min-width: 0;
            align-self: flex-start;
          }

          .kf-mission-meta {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .kf-mission-page {
            padding: 14px 11px 54px;
          }

          .kf-mission-topbar {
            border-radius: 23px;
            padding: 11px 12px;
          }

          .kf-brand-caption {
            display: none;
          }

          .kf-language span {
            display: none;
          }

          .kf-language select {
            min-width: 108px;
          }

          .kf-mission-hero {
            padding: 24px 20px;
            border-radius: 28px;
          }

          .kf-hero-copy h1 {
            font-size: 44px;
          }

          .kf-hero-copy p {
            font-size: 14px;
          }

          .kf-section {
            padding: 21px 18px;
            border-radius: 25px;
          }

          .kf-section-head h2 {
            font-size: 28px;
          }

          .kf-before-after-grid {
            grid-template-columns: 1fr;
          }
        }
      


/* =========================================================
   KARMAFACIE — CIVIC MISSION DARK MODE
   ========================================================= */

html[data-theme="dark"] .kf-mission-page {
  --kf-ivory: #07111f;
  --kf-white: #f5f7fb;
  --kf-navy: #0d1d31;
  --kf-ink: #f5f7fb;
  --kf-body: #b8c4d9;
  --kf-muted: #8291aa;
  --kf-orange: #ff7a00;
  --kf-blue: #10263a;
  --kf-blue-line: #294863;
  --kf-green: #182c25;
  --kf-green-line: #315443;
  --kf-peach: #30251b;
  --kf-peach-line: #5d432a;
  --kf-lavender: #27233a;
  --kf-lavender-line: #49415f;
  --kf-line: #1f2e47;

  color: var(--kf-body);
  background:
    radial-gradient(circle at 94% 4%, rgba(0,212,255,.07), transparent 24%),
    radial-gradient(circle at 6% 90%, rgba(255,122,0,.07), transparent 25%),
    #07111f;
}

html[data-theme="dark"] .kf-mission-page .kf-mission-topbar {
  position: relative;
  border: 1px solid transparent;
  background: rgba(4,10,20,.68);
  box-shadow:
    -10px 0 24px -8px rgba(0,212,255,.28),
    10px 0 24px -8px rgba(255,140,26,.28),
    0 10px 30px rgba(0,0,0,.34);
  backdrop-filter: blur(14px) saturate(125%);
}
html[data-theme="dark"] .kf-mission-page .kf-mission-topbar::before {
  content:"";
  position:absolute; inset:0; z-index:-1; border-radius:inherit; padding:1px;
  background:linear-gradient(90deg,#00d4ff 0%,rgba(0,212,255,.35) 24%,rgba(31,46,71,.45) 50%,rgba(255,140,26,.35) 76%,#ff8c1a 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
html[data-theme="dark"] .kf-mission-page .kf-mission-topbar::after {
  content:""; position:absolute; inset:-5px; z-index:-2; border-radius:inherit;
  background:linear-gradient(90deg,rgba(0,212,255,.18),transparent 38%,transparent 62%,rgba(255,140,26,.18));
  filter:blur(10px); opacity:.34; pointer-events:none;
}

html[data-theme="dark"] .kf-mission-page .kf-back-button,
html[data-theme="dark"] .kf-mission-page .kf-secondary-button {
  background:#10243a;
  color:#e9f1fb;
  border-color:#29415d;
}
html[data-theme="dark"] .kf-mission-page .kf-back-arrow { color:#ff9a3d; }
html[data-theme="dark"] .kf-mission-page .kf-brand-box {
  background:#ff7a00; color:#07111f; box-shadow:0 10px 26px rgba(255,122,0,.20);
}
html[data-theme="dark"] .kf-mission-page .kf-brand-name,
html[data-theme="dark"] .kf-mission-page .kf-brand-caption { color:#f5f7fb; }
html[data-theme="dark"] .kf-mission-page .kf-brand-name span { color:#ff7a00; }
html[data-theme="dark"] .kf-mission-page .kf-language,
html[data-theme="dark"] .kf-mission-page .kf-language span { color:#9fb1c8; }
html[data-theme="dark"] .kf-mission-page .kf-language select {
  background:#10243a; color:#f5f7fb; border-color:#2a3e58;
}
html[data-theme="dark"] .kf-mission-page .kf-language select:focus {
  border-color:#ff7a00; box-shadow:0 0 0 4px rgba(255,122,0,.10);
}
html[data-theme="dark"] .kf-mission-page .kf-language select option {
  background:#0d1d31; color:#f5f7fb;
}

html[data-theme="dark"] .kf-mission-page .kf-mission-hero {
  border-color:#24405a;
  background:
    radial-gradient(circle at 100% 0%, rgba(0,212,255,.10), transparent 34%),
    radial-gradient(circle at 0% 100%, rgba(255,122,0,.10), transparent 35%),
    linear-gradient(135deg,#0d1d31 0%,#10273b 54%,#102c3a 100%);
  box-shadow:0 22px 55px rgba(0,0,0,.22);
}
html[data-theme="dark"] .kf-mission-page .kf-hero-orb-blue {
  background:rgba(0,212,255,.08);
  box-shadow:0 0 55px rgba(0,212,255,.08);
}
html[data-theme="dark"] .kf-mission-page .kf-hero-orb-peach {
  background:rgba(255,122,0,.08);
  box-shadow:0 0 55px rgba(255,122,0,.07);
}
html[data-theme="dark"] .kf-mission-page .kf-section-kicker,
html[data-theme="dark"] .kf-mission-page .kf-eyebrow { color:#ff9a3d; }
html[data-theme="dark"] .kf-mission-page .kf-hero-copy h1,
html[data-theme="dark"] .kf-mission-page .kf-section-head h2,
html[data-theme="dark"] .kf-mission-page .kf-form-heading h3,
html[data-theme="dark"] .kf-mission-page .kf-compare-card h3 { color:#f5f7fb; }
html[data-theme="dark"] .kf-mission-page .kf-hero-copy p,
html[data-theme="dark"] .kf-mission-page .kf-section-description,
html[data-theme="dark"] .kf-mission-page .kf-form-heading p,
html[data-theme="dark"] .kf-mission-page .kf-record-pane p { color:#9fb0c7; }

html[data-theme="dark"] .kf-mission-page .kf-points-card {
  background:#30251b; border-color:#5d432a; color:#fff0df;
  box-shadow:0 16px 34px rgba(0,0,0,.18);
}
html[data-theme="dark"] .kf-mission-page .kf-points-number { color:#ffb06b; }
html[data-theme="dark"] .kf-mission-page .kf-points-label { color:#c9b8a7; }

html[data-theme="dark"] .kf-mission-page .kf-meta-tile {
  color:#dce8f6;
  border-color:#2b425b;
  box-shadow:0 12px 28px rgba(0,0,0,.14);
}
html[data-theme="dark"] .kf-mission-page .kf-meta-tile:nth-child(1) {
  background:#10263a; border-color:#294863;
}
html[data-theme="dark"] .kf-mission-page .kf-meta-tile:nth-child(2) {
  background:#30251b; border-color:#5d432a;
}
html[data-theme="dark"] .kf-mission-page .kf-meta-tile:nth-child(3) {
  background:#182c25; border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-meta-label { color:#8ea3bc; }
html[data-theme="dark"] .kf-mission-page .kf-meta-value { color:#f1f6fc; }

html[data-theme="dark"] .kf-mission-page .kf-section {
  border-color:#1f3048;
  background:#0d1d31;
  box-shadow:0 18px 44px rgba(0,0,0,.18);
}
html[data-theme="dark"] .kf-mission-page .kf-status-section {
  background:linear-gradient(135deg,#122a23 0%,#182c25 100%);
  border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-status-badge {
  background:rgba(90,211,117,.10);
  color:#8fe1a9;
  border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-inline-success {
  background:#19352b;
  color:#9ce8ae;
  border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-inline-info {
  background:#10263a;
  color:#a6c9e8;
  border-color:#294863;
}
html[data-theme="dark"] .kf-mission-page .kf-large-note {
  background:#27233a;
  color:#c8bee0;
  border-color:#49415f;
}

html[data-theme="dark"] .kf-mission-page .kf-form-block {
  border-color:#2a3f57;
  box-shadow:0 14px 34px rgba(0,0,0,.13);
}
html[data-theme="dark"] .kf-mission-page .kf-blue-block {
  background:linear-gradient(145deg,#10263a 0%,#122b42 100%);
  border-color:#294863;
}
html[data-theme="dark"] .kf-mission-page .kf-green-block {
  background:linear-gradient(145deg,#182c25 0%,#1a3329 100%);
  border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-peach-block {
  background:linear-gradient(145deg,#30251b 0%,#35291d 100%);
  border-color:#5d432a;
}
html[data-theme="dark"] .kf-mission-page .kf-lavender-block {
  background:linear-gradient(145deg,#27233a 0%,#2b2741 100%);
  border-color:#49415f;
}
html[data-theme="dark"] .kf-mission-page .kf-form-icon {
  background:rgba(255,255,255,.07);
  color:#f5f7fb;
  border:1px solid rgba(255,255,255,.08);
}
html[data-theme="dark"] .kf-mission-page .kf-upload-box {
  background:rgba(3,10,19,.26);
  border-color:#34506a;
  color:#dbe8f7;
}
html[data-theme="dark"] .kf-mission-page .kf-upload-box:hover {
  border-color:#ff7a00;
  background:rgba(255,122,0,.06);
}
html[data-theme="dark"] .kf-mission-page .kf-upload-box strong { color:#f1f6fb; }
html[data-theme="dark"] .kf-mission-page .kf-upload-box small { color:#8fa2ba; }
html[data-theme="dark"] .kf-mission-page .kf-upload-icon { color:#ff9a3d; }
html[data-theme="dark"] .kf-mission-page .kf-location-button {
  background:#10243a;
  color:#eaf2fb;
  border-color:#2c4762;
}
html[data-theme="dark"] .kf-mission-page .kf-location-done {
  background:#19372c;
  border-color:#315443;
  color:#99e6ae;
}
html[data-theme="dark"] .kf-mission-page .kf-location-readout {
  background:rgba(82,208,123,.06);
  border-color:#315443;
  color:#8fe1a9;
}
html[data-theme="dark"] .kf-mission-page .kf-textarea {
  background:#0a1727;
  color:#f3f6fa;
  border-color:#2a405a;
}
html[data-theme="dark"] .kf-mission-page .kf-textarea::placeholder { color:#697d95; }
html[data-theme="dark"] .kf-mission-page .kf-textarea:focus {
  border-color:#ff7a00;
  box-shadow:0 0 0 4px rgba(255,122,0,.08);
}

html[data-theme="dark"] .kf-mission-page .kf-primary-button,
html[data-theme="dark"] .kf-mission-page .kf-submit-green {
  background:#ff7a00;
  color:#07111f;
  border-color:#ff7a00;
  box-shadow:0 10px 28px rgba(255,122,0,.16);
}
html[data-theme="dark"] .kf-mission-page .kf-primary-button:hover,
html[data-theme="dark"] .kf-mission-page .kf-submit-green:hover { background:#ff8d32; }

html[data-theme="dark"] .kf-mission-page .kf-before-card {
  background:linear-gradient(145deg,#10263a 0%,#122b42 100%);
  border-color:#294863;
}
html[data-theme="dark"] .kf-mission-page .kf-after-card {
  background:linear-gradient(145deg,#182c25 0%,#1a3329 100%);
  border-color:#315443;
}
html[data-theme="dark"] .kf-mission-page .kf-compare-tag {
  background:rgba(255,255,255,.06);
  color:#dfe9f5;
  border-color:rgba(255,255,255,.10);
}
html[data-theme="dark"] .kf-mission-page .kf-record-pane {
  background:#0b192a;
  border-color:#223852;
}
html[data-theme="dark"] .kf-mission-page .kf-alert-error {
  background:#321f27; border-color:#643642; color:#ffb9c7;
}
html[data-theme="dark"] .kf-mission-page .kf-alert-success {
  background:#182c25; border-color:#315443; color:#99e6ae;
}
html[data-theme="dark"] .kf-mission-page .kf-loading-card,
html[data-theme="dark"] .kf-mission-page .kf-error-card {
  background:#0d1d31;
  color:#dbe7f5;
  border-color:#263a54;
  box-shadow:0 24px 60px rgba(0,0,0,.28);
}
html[data-theme="dark"] .kf-mission-page .kf-error-card p { color:#9aabc0; }
html[data-theme="dark"] .kf-mission-page .kf-wordmark { color:#f5f7fb; }
html[data-theme="dark"] .kf-mission-page .kf-wordmark span { color:#ff7a00; }
html[data-theme="dark"] .kf-mission-page .kf-loading-bar { background:#ff7a00; }

      `}</style>
    </main>
  );
}
