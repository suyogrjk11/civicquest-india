"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

const categories = [
  "Pothole / Road Damage",
  "Open Drain / Gutters",
  "Broken Streetlight",
  "Broken Barricade",
  "Garbage / Waste",
  "Water / Sewerage Problem",
  "Traffic / Parking Issue",
  "Damaged Public Property",
  "Public Safety Issue",
  "Other",
];

const categoryLabels: Record<
  Language,
  Record<string, string>
> = {
  en: {
    "Pothole / Road Damage": "Pothole / Road Damage",
    "Open Drain / Gutters": "Open Drain / Gutters",
    "Broken Streetlight": "Broken Streetlight",
    "Broken Barricade": "Broken Barricade",
    "Garbage / Waste": "Garbage / Waste",
    "Water / Sewerage Problem": "Water / Sewerage Problem",
    "Traffic / Parking Issue": "Traffic / Parking Issue",
    "Damaged Public Property": "Damaged Public Property",
    "Public Safety Issue": "Public Safety Issue",
    Other: "Other",
  },

  hi: {
    "Pothole / Road Damage": "गड्ढा / सड़क क्षति",
    "Open Drain / Gutters": "खुली नाली / गटर",
    "Broken Streetlight": "खराब स्ट्रीट लाइट",
    "Broken Barricade": "टूटी हुई बैरिकेड",
    "Garbage / Waste": "कचरा / अपशिष्ट",
    "Water / Sewerage Problem": "पानी / सीवरेज समस्या",
    "Traffic / Parking Issue": "यातायात / पार्किंग समस्या",
    "Damaged Public Property": "क्षतिग्रस्त सार्वजनिक संपत्ति",
    "Public Safety Issue": "सार्वजनिक सुरक्षा समस्या",
    Other: "अन्य",
  },

  mr: {
    "Pothole / Road Damage": "खड्डा / रस्त्याचे नुकसान",
    "Open Drain / Gutters": "उघडी नाली / गटार",
    "Broken Streetlight": "बंद / खराब स्ट्रीटलाइट",
    "Broken Barricade": "तुटलेले बॅरिकेड",
    "Garbage / Waste": "कचरा / टाकाऊ पदार्थ",
    "Water / Sewerage Problem": "पाणी / सांडपाणी समस्या",
    "Traffic / Parking Issue": "वाहतूक / पार्किंग समस्या",
    "Damaged Public Property": "नुकसान झालेली सार्वजनिक मालमत्ता",
    "Public Safety Issue": "सार्वजनिक सुरक्षेची समस्या",
    Other: "इतर",
  },
};

const content = {
  en: {
    back: "← Back to Dashboard",
    languageLabel: "Language",

    label: "KARMAFACIE",
    title: "Report an Issue",
    description:
      "Report a civic problem with clear and factual information. Add evidence and location details to make the report more useful.",

    reportingFrom: "📍 Reporting from",

    category: "Issue Category",
    selectIssue: "Select an issue type",
    checkingAuthority:
      "🔎 Checking verified authority information...",
    verifiedMatch: "VERIFIED DIRECTORY MATCH",
    department: "Department:",
    channel: "Channel:",
    noAuthority:
      "ℹ️ No verified authority match is currently available for this category in",
    multipleAuthorities:
      "VERIFIED DIRECTORY MATCHES",
    selectAuthority:
      "Select the department that best matches your issue:",
    routeSelected:
      "Selected route:",

    issueTitle: "Issue Title",
    issueTitlePlaceholder:
      "Example: Large pothole near main road",

    describeProblem: "Describe the Problem",
    describePlaceholder:
      "Describe what you observed. Mention useful details such as exact location, approximate size, obstruction, safety concerns, etc.",

    location: "Location",
    locationPlaceholder:
      "Enter location manually or use GPS",
    useLocation: "📍 Use My Location",
    gpsCaptured: "GPS captured:",

    photoEvidence: "📷 Photo Evidence",
    clickUpload: "Click to upload a photo",
    fileTypes: "JPG, PNG, WEBP • Maximum 10 MB",
    removePhoto: "Remove Photo",
    selectedEvidence: "Selected evidence",

    submit: "Submit Civic Issue",
    submitting: "Uploading & Submitting...",

    loading: "Loading KarmaFacie...",

    profileError:
      "Unable to load your civic profile.",

    locationUnsupported:
      "Location services are not supported by your browser.",
    locationDenied:
      "Unable to access your location. Please allow location permission.",

    invalidImage:
      "Please select a valid image file.",
    imageTooLarge:
      "Please select an image smaller than 10 MB.",

    photoSelected: "Photo selected:",

    categoryRequired:
      "Please select an issue category.",
    titleRequired:
      "Please enter a title for the issue.",
    descriptionRequired:
      "Please describe the problem.",

    uploadFailed: "Photo upload failed:",

    issueSuccess:
      "Issue reported successfully!",
    authoritySuggested:
      "Suggested authority:",
    noVerifiedRoute:
      "Issue reported successfully! No verified authority route was found for this issue yet.",

    viewAndTrack: "View & Track Issue →",
    backToDashboard: "Back to Dashboard",

    reportError:
      "Something went wrong while reporting the issue.",
  },

  hi: {
    back: "← डैशबोर्ड पर वापस जाएँ",
    languageLabel: "भाषा",

    label: "KARMAFACIE",
    title: "समस्या की रिपोर्ट करें",
    description:
      "किसी नागरिक समस्या की स्पष्ट और तथ्यात्मक जानकारी के साथ रिपोर्ट करें। रिपोर्ट को अधिक उपयोगी बनाने के लिए प्रमाण और स्थान की जानकारी जोड़ें।",

    reportingFrom: "📍 यहाँ से रिपोर्ट की जा रही है",

    category: "समस्या की श्रेणी",
    selectIssue: "समस्या का प्रकार चुनें",
    checkingAuthority:
      "🔎 सत्यापित प्राधिकरण की जानकारी जाँची जा रही है...",
    verifiedMatch: "सत्यापित डायरेक्टरी मिलान",
    department: "विभाग:",
    channel: "माध्यम:",
    noAuthority:
      "ℹ️ इस श्रेणी के लिए वर्तमान में कोई सत्यापित प्राधिकरण उपलब्ध नहीं है",
    multipleAuthorities:
      "सत्यापित डायरेक्टरी मिलान",
    selectAuthority:
      "अपनी समस्या से सबसे अधिक संबंधित विभाग चुनें:",
    routeSelected:
      "चयनित मार्ग:",

    issueTitle: "समस्या का शीर्षक",
    issueTitlePlaceholder:
      "उदाहरण: मुख्य सड़क के पास बड़ा गड्ढा",

    describeProblem: "समस्या का विवरण दें",
    describePlaceholder:
      "आपने क्या देखा, उसका विवरण दें। सटीक स्थान, अनुमानित आकार, रास्ते में रुकावट, सुरक्षा संबंधी चिंताएँ आदि जैसी उपयोगी जानकारी शामिल करें।",

    location: "स्थान",
    locationPlaceholder:
      "स्थान मैन्युअल रूप से दर्ज करें या GPS का उपयोग करें",
    useLocation: "📍 मेरा स्थान उपयोग करें",
    gpsCaptured: "GPS दर्ज हुआ:",

    photoEvidence: "📷 फोटो प्रमाण",
    clickUpload: "फोटो अपलोड करने के लिए क्लिक करें",
    fileTypes: "JPG, PNG, WEBP • अधिकतम 10 MB",
    removePhoto: "फोटो हटाएँ",
    selectedEvidence: "चयनित प्रमाण",

    submit: "नागरिक समस्या सबमिट करें",
    submitting: "अपलोड और सबमिट किया जा रहा है...",

    loading: "KarmaFacie लोड हो रहा है...",

    profileError:
      "आपकी नागरिक प्रोफ़ाइल लोड नहीं हो सकी।",

    locationUnsupported:
      "आपका ब्राउज़र स्थान सेवाओं का समर्थन नहीं करता।",
    locationDenied:
      "आपके स्थान तक पहुँच नहीं हो सकी। कृपया स्थान की अनुमति दें।",

    invalidImage:
      "कृपया एक मान्य इमेज फ़ाइल चुनें।",
    imageTooLarge:
      "कृपया 10 MB से छोटी इमेज चुनें।",

    photoSelected: "फोटो चुनी गई:",

    categoryRequired:
      "कृपया समस्या की श्रेणी चुनें।",
    titleRequired:
      "कृपया समस्या का शीर्षक दर्ज करें।",
    descriptionRequired:
      "कृपया समस्या का विवरण दें।",

    uploadFailed: "फोटो अपलोड विफल हुआ:",

    issueSuccess:
      "समस्या सफलतापूर्वक रिपोर्ट हो गई!",
    authoritySuggested:
      "सुझाया गया प्राधिकरण:",
    noVerifiedRoute:
      "समस्या सफलतापूर्वक रिपोर्ट हो गई! इस समस्या के लिए अभी कोई सत्यापित प्राधिकरण मार्ग नहीं मिला है।",

    viewAndTrack: "समस्या देखें और ट्रैक करें →",
    backToDashboard: "डैशबोर्ड पर वापस जाएँ",

    reportError:
      "समस्या रिपोर्ट करते समय कुछ गलत हो गया।",
  },

  mr: {
    back: "← डॅशबोर्डवर परत जा",
    languageLabel: "भाषा",

    label: "KARMAFACIE",
    title: "समस्या नोंदवा",
    description:
      "नागरी समस्येची स्पष्ट आणि तथ्यात्मक माहितीसह नोंद करा. नोंद अधिक उपयुक्त होण्यासाठी पुरावे आणि स्थानाची माहिती जोडा.",

    reportingFrom: "📍 येथून नोंद केली जात आहे",

    category: "समस्येची श्रेणी",
    selectIssue: "समस्येचा प्रकार निवडा",
    checkingAuthority:
      "🔎 सत्यापित प्राधिकरणाची माहिती तपासली जात आहे...",
    verifiedMatch: "सत्यापित डायरेक्टरी जुळणी",
    department: "विभाग:",
    channel: "माध्यम:",
    noAuthority:
      "ℹ️ या श्रेणीसाठी सध्या कोणतेही सत्यापित प्राधिकरण उपलब्ध नाही",
    multipleAuthorities:
      "सत्यापित डायरेक्टरी जुळण्या",
    selectAuthority:
      "तुमच्या समस्येशी सर्वाधिक संबंधित विभाग निवडा:",
    routeSelected:
      "निवडलेला मार्ग:",

    issueTitle: "समस्येचे शीर्षक",
    issueTitlePlaceholder:
      "उदाहरण: मुख्य रस्त्याजवळ मोठा खड्डा",

    describeProblem: "समस्येचे वर्णन करा",
    describePlaceholder:
      "तुम्ही काय पाहिले त्याचे वर्णन करा. अचूक स्थान, अंदाजे आकार, अडथळा, सुरक्षेशी संबंधित चिंता इत्यादी उपयुक्त माहिती द्या.",

    location: "स्थान",
    locationPlaceholder:
      "स्थान स्वतः टाका किंवा GPS वापरा",
    useLocation: "📍 माझे स्थान वापरा",
    gpsCaptured: "GPS नोंदवले:",

    photoEvidence: "📷 फोटो पुरावा",
    clickUpload: "फोटो अपलोड करण्यासाठी क्लिक करा",
    fileTypes: "JPG, PNG, WEBP • कमाल 10 MB",
    removePhoto: "फोटो काढा",
    selectedEvidence: "निवडलेला पुरावा",

    submit: "नागरी समस्या सबमिट करा",
    submitting: "अपलोड आणि सबमिट केले जात आहे...",

    loading: "KarmaFacie लोड होत आहे...",

    profileError:
      "तुमची नागरिक प्रोफाइल लोड करता आली नाही.",

    locationUnsupported:
      "तुमचा ब्राउझर स्थान सेवांना समर्थन देत नाही.",
    locationDenied:
      "तुमच्या स्थानापर्यंत पोहोचता आले नाही. कृपया स्थानाची परवानगी द्या.",

    invalidImage:
      "कृपया योग्य इमेज फाइल निवडा.",
    imageTooLarge:
      "कृपया 10 MB पेक्षा लहान इमेज निवडा.",

    photoSelected: "फोटो निवडला:",

    categoryRequired:
      "कृपया समस्येची श्रेणी निवडा.",
    titleRequired:
      "कृपया समस्येचे शीर्षक टाका.",
    descriptionRequired:
      "कृपया समस्येचे वर्णन करा.",

    uploadFailed: "फोटो अपलोड अयशस्वी:",

    issueSuccess:
      "समस्या यशस्वीरित्या नोंदवली गेली!",
    authoritySuggested:
      "सुचवलेले प्राधिकरण:",
    noVerifiedRoute:
      "समस्या यशस्वीरित्या नोंदवली गेली! या समस्येसाठी अद्याप कोणताही सत्यापित प्राधिकरण मार्ग सापडलेला नाही.",

    viewAndTrack: "समस्या पहा आणि ट्रॅक करा →",
    backToDashboard: "डॅशबोर्डवर परत जा",

    reportError:
      "समस्या नोंदवताना काहीतरी चूक झाली.",
  },
};

type AuthorityDirectoryRecord = {
  id: number;
  city: string;
  state: string;
  authority_name: string;
  department_name: string | null;
  issue_category: string;
  grievance_url: string | null;
  official_source_url: string | null;
  submission_method: string | null;
  notes: string | null;
  is_active: boolean;
};

export default function ReportIssuePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();

  const text = content[language];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);
  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");

  const [matchedAuthorities, setMatchedAuthorities] =
    useState<AuthorityDirectoryRecord[]>([]);
  const [selectedAuthorityId, setSelectedAuthorityId] =
    useState<number | null>(null);

  const [checkingAuthority, setCheckingAuthority] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndLoadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!category || !userCity || !userState) {
      setMatchedAuthorities([]);
      setSelectedAuthorityId(null);
      return;
    }

    findAuthority(category);
  }, [category, userCity, userState]);

  async function checkUserAndLoadProfile() {
    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      router.push("/auth");
      return;
    }

    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("city, state")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Profile loading error:",
        profileError
      );

      setError(text.profileError);

      setLoading(false);
      return;
    }

    if (!profileData) {
      router.push("/get-started");
      return;
    }

    setUserCity(profileData.city || "");
    setUserState(profileData.state || "");

    setLoading(false);
  }

  async function findAuthority(
    selectedCategory: string
  ) {
    setCheckingAuthority(true);
    setMatchedAuthorities([]);
    setSelectedAuthorityId(null);

    try {
      const {
        data,
        error: authorityError,
      } = await supabase
        .from("authority_directory")
        .select(
          "id, city, state, authority_name, department_name, issue_category, grievance_url, official_source_url, submission_method, notes, is_active"
        )
        .eq("city", userCity)
        .eq("state", userState)
        .eq("issue_category", selectedCategory)
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (authorityError) {
        console.error(
          "Authority directory lookup error:",
          authorityError
        );
        return;
      }

      const routes = data || [];
      setMatchedAuthorities(routes);

      if (routes.length === 1) {
        setSelectedAuthorityId(routes[0].id);
      }
    } catch (err) {
      console.error(
        "Authority lookup failed:",
        err
      );
    } finally {
      setCheckingAuthority(false);
    }
  }

  function getLocation() {
    setError("");
    setMessage("");

    if (!navigator.geolocation) {
      setError(text.locationUnsupported);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords.latitude;
        const lng =
          position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        setLocationText(
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        );

        setMessage(
          language === "en"
            ? "Location captured successfully."
            : language === "hi"
              ? "स्थान सफलतापूर्वक दर्ज हो गया।"
              : "स्थान यशस्वीरित्या नोंदवले गेले."
        );
      },
      () => {
        setError(text.locationDenied);
      }
    );
  }

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setMessage("");

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(text.invalidImage);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(text.imageTooLarge);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);

    setMessage(
      `${text.photoSelected} ${file.name}`
    );
  }

  function removePhoto() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setMessage("");
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!category) {
      setError(text.categoryRequired);
      return;
    }

    if (!title.trim()) {
      setError(text.titleRequired);
      return;
    }

    if (!description.trim()) {
      setError(text.descriptionRequired);
      return;
    }

    if (
      matchedAuthorities.length > 1 &&
      selectedAuthorityId === null
    ) {
      setError(text.selectAuthority);
      return;
    }

    setSaving(true);

    let uploadedPhotoPath: string | null =
      null;

    try {
      // ------------------------------------------
      // 1. Get current authenticated user
      // ------------------------------------------

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push("/auth");
        return;
      }

      const user = userData.user;

      // ------------------------------------------
      // 2. Find verified authority
      // ------------------------------------------

      const {
        data: authorityData,
        error: authorityError,
      } = await supabase
        .from("authority_directory")
        .select(
          "id, city, state, authority_name, department_name, issue_category, grievance_url, official_source_url, submission_method, notes, is_active"
        )
        .eq("city", userCity)
        .eq("state", userState)
        .eq("issue_category", category)
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (authorityError) {
        console.error(
          "Authority lookup during submission:",
          authorityError
        );
      }

      const submissionRoutes =
        authorityData || [];

      const authority =
        submissionRoutes.find(
          (route) => route.id === selectedAuthorityId
        ) ||
        (submissionRoutes.length === 1
          ? submissionRoutes[0]
          : matchedAuthorities.find(
              (route) => route.id === selectedAuthorityId
            )) ||
        (matchedAuthorities.length === 1
          ? matchedAuthorities[0]
          : null);

      if (
        submissionRoutes.length > 1 &&
        !authority
      ) {
        setError(
          text.selectAuthority
        );
        return;
      }

      // ------------------------------------------
      // 3. Upload photo to Supabase Storage
      // ------------------------------------------

      if (selectedFile) {
        const fileExtension =
          selectedFile.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const fileName = `${crypto.randomUUID()}.${fileExtension}`;

        const filePath =
          `${user.id}/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from("civic-issue-photos")
          .upload(
            filePath,
            selectedFile,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                selectedFile.type,
            }
          );

        if (uploadError) {
          console.error(
            "Photo upload error:",
            uploadError
          );

          setError(
            `${text.uploadFailed} ${uploadError.message}`
          );

          return;
        }

        uploadedPhotoPath = filePath;
      }

      // ------------------------------------------
      // 4. Create Civic Issue record
      // ------------------------------------------

      const {
        data,
        error: insertError,
      } = await supabase
        .from("civic_issues")
        .insert({
          user_id: user.id,

          category,

          title: title.trim(),

          description:
            description.trim(),

          location_text:
            locationText || null,

          latitude,

          longitude,

          photo_path:
            uploadedPhotoPath,

          status: "reported",

          reported_city:
            userCity || null,

          reported_state:
            userState || null,

          authority_directory_id:
            authority?.id ?? null,

          authority_name:
            authority?.authority_name ??
            null,
        })
        .select()
        .single();

      if (insertError) {
        console.error(
          "Issue creation error:",
          insertError
        );

        // Clean up photo when issue creation fails.
        if (uploadedPhotoPath) {
          await supabase.storage
            .from("civic-issue-photos")
            .remove([
              uploadedPhotoPath,
            ]);
        }

        setError(
          insertError.message
        );

        return;
      }

      console.log(
        "Created civic issue:",
        data
      );

      setCreatedIssueId(data.id);

      // ------------------------------------------
      // 5. Success message
      // ------------------------------------------

      if (authority) {
        setMessage(
          `${text.issueSuccess} ${text.authoritySuggested} ${authority.authority_name}`
        );
      } else {
        setMessage(
          text.noVerifiedRoute
        );
      }

      // ------------------------------------------
      // 6. Reset form
      // ------------------------------------------

      setCategory("");
      setTitle("");
      setDescription("");
      setLocationText("");

      setLatitude(null);
      setLongitude(null);

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setSelectedFile(null);
      setPreviewUrl("");

      setMatchedAuthorities([]);
      setSelectedAuthorityId(null);

      // ------------------------------------------
      // 7. Keep the user on the success state
      // ------------------------------------------
      // The issue detail page is the tracking and Smart Handoff
      // destination. Let the citizen choose whether to open it
      // or return to the dashboard.
      // ------------------------------------------
    } catch (err) {
      console.error(err);

      if (uploadedPhotoPath) {
        await supabase.storage
          .from("civic-issue-photos")
          .remove([
            uploadedPhotoPath,
          ]);
      }

      setError(
        text.reportError
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="kf-report-page"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 88% 8%, rgba(223,234,243,.88) 0%, rgba(223,234,243,0) 25%), radial-gradient(circle at 8% 92%, rgba(255,225,197,.70) 0%, rgba(255,225,197,0) 27%), #f8f3ea",
          color: "#102033",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div className="kf-report-loading-card"
          style={{
            width: "min(420px, 100%)",
            textAlign: "center",
            padding: "34px 28px",
            borderRadius: "30px",
            background: "rgba(255,255,255,.82)",
            border: "1px solid rgba(16,27,43,.10)",
            boxShadow: "0 22px 60px rgba(16,27,43,.08)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            Karma<span style={{ color: "#ff7a00" }}>Facie</span>
          </div>
          <div
            style={{
              width: "72px",
              height: "5px",
              margin: "15px auto 14px",
              borderRadius: "999px",
              background: "#ff7a00",
            }}
          />
          <p
            style={{
              margin: 0,
              color: "#78838e",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {text.loading}
          </p>
        </div>
      </main>
    );
  }

  const translatedCategory = (value: string) =>
    categoryLabels[language][value] || value;

  return (
    <main className="kf-report-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 88% 4%, rgba(223,234,243,.70) 0%, rgba(223,234,243,0) 22%), radial-gradient(circle at 5% 55%, rgba(232,241,247,.78) 0%, rgba(232,241,247,0) 24%), radial-gradient(circle at 92% 86%, rgba(255,229,207,.58) 0%, rgba(255,229,207,0) 22%), #f8f3ea",
        color: "#102033",
        padding: "20px 16px 72px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 8px",
        }}
      >
        {/* TOP BAR */}
        <header className="kf-report-topbar"
          style={{
            position: "sticky",
            top: "14px",
            zIndex: 30,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "18px",
            minHeight: "84px",
            padding: "10px 14px",
            marginBottom: "28px",
            borderRadius: "32px",
            background: "rgba(255,255,255,.94)",
            border: "1px solid rgba(16,27,43,.10)",
            boxShadow: "0 14px 36px rgba(16,27,43,.07)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* LEFT — DASHBOARD */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              minWidth: 0,
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                minHeight: "48px",
                padding: "0 18px",
                border: "1px solid #dfe3e7",
                borderRadius: "999px",
                background: "#fff",
                color: "#52616f",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 800,
                boxShadow: "0 5px 18px rgba(16,32,51,.035)",
              }}
            >
              <span
                style={{
                  color: "#ff7a00",
                  fontSize: "20px",
                  lineHeight: 1,
                  fontWeight: 500,
                }}
              >
                ←
              </span>
              {text.back.replace("← ", "")}
            </button>
          </div>

          {/* CENTER — KARMAFACIE / REPORT AN ISSUE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                display: "grid",
                placeItems: "center",
                borderRadius: "17px",
                background: "#ff7a00",
                color: "#102033",
                fontFamily: "var(--font-display)",
                fontSize: "31px",
                lineHeight: 1,
                fontWeight: 800,
                boxShadow: "0 8px 18px rgba(255,122,0,.18)",
              }}
            >
              K
            </div>

            <div>
              <div
                style={{
                  color: "#102033",
                  fontFamily: "var(--font-display)",
                  fontSize: "29px",
                  lineHeight: ".95",
                  letterSpacing: "-0.045em",
                  fontWeight: 800,
                }}
              >
                Karma<span style={{ color: "#ff7a00" }}>Facie</span>
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#102033",
                  fontSize: "9px",
                  lineHeight: 1,
                  letterSpacing: ".24em",
                  fontWeight: 900,
                }}
              >
                REPORT AN ISSUE
              </div>
            </div>
          </div>

          {/* RIGHT — LANGUAGE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              minWidth: 0,
            }}
          >
            <span
              style={{
                color: "#52616f",
                fontSize: "14px",
                fontWeight: 800,
              }}
            >
              {text.languageLabel}
            </span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label={text.languageLabel}
              style={{
                appearance: "none",
                minWidth: "132px",
                padding: "12px 16px",
                border: "1px solid #d7d1c9",
                borderRadius: "999px",
                background: "#fff",
                color: "#304154",
                fontSize: "13px",
                fontWeight: 800,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </header>
        {/* INTRO */}
        <section className="kf-report-intro"
          style={{
            position: "relative",
            overflow: "hidden",
            marginBottom: "16px",
            padding: "28px",
            borderRadius: "32px",
            border: "1px solid rgba(16,27,43,.10)",
            background:
              "radial-gradient(circle at 92% 0%, #e7f1f7 0%, rgba(231,241,247,0) 34%), radial-gradient(circle at 4% 100%, #ffecd9 0%, rgba(255,236,217,0) 35%), rgba(255,253,249,.96)",
            boxShadow: "0 16px 44px rgba(16,27,43,.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-46px",
              top: "-48px",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(208,228,240,.56)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#fff3e7",
                border: "1px solid rgba(255,122,0,.14)",
                color: "#8c725a",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: ".18em",
                textTransform: "uppercase",
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
              {text.label}
            </div>

            <h1
              style={{
                margin: "16px 0 10px",
                color: "#102033",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 6vw, 58px)",
                lineHeight: "1.00",
                letterSpacing: "-0.05em",
                fontWeight: 800,
              }}
            >
              {text.title}
            </h1>

            <p
              style={{
                maxWidth: "720px",
                margin: 0,
                color: "#697682",
                fontSize: "15px",
                lineHeight: "1.7",
              }}
            >
              {text.description}
            </p>

            {userCity && userState && (
              <div className="kf-report-location-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  flexWrap: "wrap",
                  marginTop: "18px",
                  padding: "9px 12px",
                  borderRadius: "999px",
                  background: "#f0f5f8",
                  border: "1px solid #e0e8ed",
                  color: "#71808c",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                <span>{text.reportingFrom}</span>
                <strong style={{ color: "#314154" }}>
                  {userCity}, {userState}
                </strong>
              </div>
            )}
          </div>
        </section>

        {/* FEEDBACK */}
        {message && (
          <div className="kf-report-feedback kf-report-success"
            role="status"
            style={{
              marginBottom: "14px",
              padding: "16px",
              borderRadius: "22px",
              background: "#eff6e8",
              border: "1px solid #d7e5c9",
              color: "#58723f",
              fontSize: "12px",
              lineHeight: "1.5",
              fontWeight: 700,
            }}
          >
            <div>{message}</div>

            {createdIssueId && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "14px",
                }}
              >
                <button className="kf-report-primary-button"
                  type="button"
                  onClick={() =>
                    router.push(`/my-issues/${createdIssueId}`)
                  }
                  style={{
                    minHeight: "42px",
                    padding: "0 16px",
                    border: "1px solid #ff7a00",
                    borderRadius: "999px",
                    background: "#ff7a00",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 800,
                    boxShadow: "0 8px 18px rgba(255,122,0,.16)",
                  }}
                >
                  {text.viewAndTrack}
                </button>

                <button className="kf-report-secondary-button"
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  style={{
                    minHeight: "42px",
                    padding: "0 16px",
                    border: "1px solid #d8e1e7",
                    borderRadius: "999px",
                    background: "#fffdf9",
                    color: "#314154",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {text.backToDashboard}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="kf-report-feedback kf-report-error"
            role="alert"
            style={{
              marginBottom: "14px",
              padding: "13px 15px",
              borderRadius: "18px",
              background: "#fff1ed",
              border: "1px solid #f0d0c5",
              color: "#9c5948",
              fontSize: "12px",
              lineHeight: "1.5",
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}

        <form className="kf-report-form" onSubmit={handleSubmit}>
          {/* STEP 1 — CATEGORY + AUTHORITY */}
          <section className="kf-report-section kf-report-section-1"
            style={{
              marginBottom: "14px",
              padding: "22px",
              borderRadius: "28px",
              border: "1px solid rgba(16,27,43,.10)",
              background: "rgba(255,255,255,.90)",
              boxShadow: "0 12px 32px rgba(16,27,43,.045)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "12px",
                  background: "#fff0df",
                  color: "#ff7a00",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                01
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#979da3",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                  }}
                >
                  {text.category}
                </p>
                <h2
                  style={{
                    margin: "3px 0 0",
                    color: "#263447",
                    fontFamily: "var(--font-display)",
                    fontSize: "23px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                  }}
                >
                  Choose what you observed
                </h2>
              </div>
            </div>

            <select className="kf-report-control kf-report-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label={text.category}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 15px",
                borderRadius: "17px",
                border: category
                  ? "1px solid #efc29b"
                  : "1px solid #e1ddd5",
                background: "#fffdf9",
                color: category ? "#263447" : "#8b949c",
                fontSize: "13px",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">{text.selectIssue}</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {translatedCategory(item)}
                </option>
              ))}
            </select>

            {checkingAuthority && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: "#f1f6fa",
                  border: "1px solid #e1ebf1",
                  color: "#6e7d89",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {text.checkingAuthority}
              </div>
            )}

            {!checkingAuthority &&
              category &&
              matchedAuthorities.length === 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "13px 14px",
                    borderRadius: "16px",
                    background: "#fff8ef",
                    border: "1px solid #f0dfc9",
                    color: "#8b755d",
                    fontSize: "11px",
                    lineHeight: "1.5",
                    fontWeight: 700,
                  }}
                >
                  {text.noAuthority} {userCity}, {userState}.
                </div>
              )}

            {!checkingAuthority &&
              matchedAuthorities.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      marginBottom: "9px",
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#7d9853",
                      }}
                    />
                    <span
                      style={{
                        color: "#70805e",
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: ".16em",
                      }}
                    >
                      {matchedAuthorities.length > 1
                        ? text.multipleAuthorities
                        : text.verifiedMatch}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: "9px" }}>
                    {matchedAuthorities.map((authority) => {
                      const selected =
                        selectedAuthorityId === authority.id;

                      return (
                        <button className="kf-report-authority-button"
                          data-authority-selected={selected ? "true" : "false"}
                          key={authority.id}
                          type="button"
                          onClick={() =>
                            setSelectedAuthorityId(authority.id)
                          }
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "15px",
                            borderRadius: "18px",
                            border: selected
                              ? "1px solid #b8cd98"
                              : "1px solid #e0e5dc",
                            background: selected
                              ? "#f3f7ed"
                              : "#fbfcf9",
                            cursor: "pointer",
                            boxShadow: selected
                              ? "0 8px 20px rgba(74,93,54,.07)"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: "14px",
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  color: "#263447",
                                  fontSize: "14px",
                                  fontWeight: 900,
                                }}
                              >
                                {authority.authority_name}
                              </div>

                              {authority.department_name && (
                                <div
                                  style={{
                                    marginTop: "4px",
                                    color: "#78838d",
                                    fontSize: "11px",
                                  }}
                                >
                                  {text.department}{" "}
                                  {authority.department_name}
                                </div>
                              )}

                              {authority.submission_method && (
                                <div
                                  style={{
                                    marginTop: "3px",
                                    color: "#78838d",
                                    fontSize: "11px",
                                  }}
                                >
                                  {text.channel}{" "}
                                  {authority.submission_method}
                                </div>
                              )}
                            </div>

                            <span
                              style={{
                                width: "24px",
                                height: "24px",
                                flexShrink: 0,
                                display: "grid",
                                placeItems: "center",
                                borderRadius: "50%",
                                background: selected
                                  ? "#78934d"
                                  : "#edf1e9",
                                color: selected
                                  ? "#ffffff"
                                  : "#8c9a7a",
                                fontSize: "11px",
                                fontWeight: 900,
                              }}
                            >
                              {selected ? "✓" : "○"}
                            </span>
                          </div>

                          {selected && (
                            <div
                              style={{
                                marginTop: "10px",
                                paddingTop: "9px",
                                borderTop: "1px solid #dfe7d5",
                                color: "#71815f",
                                fontSize: "10px",
                                fontWeight: 800,
                              }}
                            >
                              {text.routeSelected}{" "}
                              {authority.authority_name}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
          </section>

          {/* STEP 2 — DETAILS */}
          <section className="kf-report-section kf-report-section-2"
            style={{
              marginBottom: "14px",
              padding: "22px",
              borderRadius: "28px",
              border: "1px solid rgba(16,27,43,.10)",
              background: "rgba(255,255,255,.90)",
              boxShadow: "0 12px 32px rgba(16,27,43,.045)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "12px",
                  background: "#edf5fb",
                  color: "#527a96",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                02
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#979da3",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                  }}
                >
                  Issue details
                </p>
                <h2
                  style={{
                    margin: "3px 0 0",
                    color: "#263447",
                    fontFamily: "var(--font-display)",
                    fontSize: "23px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                  }}
                >
                  Describe what happened
                </h2>
              </div>
            </div>

            <label
              style={{
                display: "block",
                color: "#667480",
                fontSize: "11px",
                fontWeight: 900,
                marginBottom: "7px",
              }}
            >
              {text.issueTitle}
            </label>

            <input className="kf-report-control"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={text.issueTitlePlaceholder}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 15px",
                borderRadius: "16px",
                border: "1px solid #dfdad2",
                background: "#fffdf9",
                color: "#263447",
                fontSize: "13px",
                outline: "none",
              }}
            />

            <label
              style={{
                display: "block",
                color: "#667480",
                fontSize: "11px",
                fontWeight: 900,
                margin: "16px 0 7px",
              }}
            >
              {text.describeProblem}
            </label>

            <textarea className="kf-report-control kf-report-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={text.describePlaceholder}
              rows={7}
              style={{
                width: "100%",
                boxSizing: "border-box",
                minHeight: "170px",
                padding: "14px 15px",
                borderRadius: "16px",
                border: "1px solid #dfdad2",
                background: "#fffdf9",
                color: "#263447",
                fontSize: "13px",
                lineHeight: "1.6",
                outline: "none",
                resize: "vertical",
              }}
            />
          </section>

          {/* STEP 3 — LOCATION */}
          <section className="kf-report-section kf-report-section-3"
            style={{
              marginBottom: "14px",
              padding: "22px",
              borderRadius: "28px",
              border: "1px solid rgba(16,27,43,.10)",
              background: "rgba(255,255,255,.90)",
              boxShadow: "0 12px 32px rgba(16,27,43,.045)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "12px",
                  background: "#eef5e6",
                  color: "#6d8746",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                03
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#979da3",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                  }}
                >
                  {text.location}
                </p>
                <h2
                  style={{
                    margin: "3px 0 0",
                    color: "#263447",
                    fontFamily: "var(--font-display)",
                    fontSize: "23px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                  }}
                >
                  Where is the issue?
                </h2>
              </div>
            </div>

            <input className="kf-report-control"
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder={text.locationPlaceholder}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 15px",
                borderRadius: "16px",
                border: "1px solid #dfdad2",
                background: "#fffdf9",
                color: "#263447",
                fontSize: "13px",
                outline: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "10px",
              }}
            >
              <button className="kf-report-secondary-button"
                type="button"
                onClick={getLocation}
                style={{
                  border: "1px solid #d9e1e7",
                  borderRadius: "999px",
                  background: "#edf5fb",
                  color: "#52758d",
                  padding: "11px 15px",
                  fontSize: "11px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {text.useLocation}
              </button>

              {latitude !== null && longitude !== null && (
                <span
                  style={{
                    color: "#71808b",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {text.gpsCaptured}{" "}
                  {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </span>
              )}
            </div>
          </section>

          {/* STEP 4 — EVIDENCE */}
          <section className="kf-report-section kf-report-section-4"
            style={{
              marginBottom: "14px",
              padding: "22px",
              borderRadius: "28px",
              border: "1px solid rgba(16,27,43,.10)",
              background: "rgba(255,255,255,.90)",
              boxShadow: "0 12px 32px rgba(16,27,43,.045)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "12px",
                  background: "#f4edf8",
                  color: "#805e98",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                04
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#979da3",
                    fontSize: "9px",
                    fontWeight: 900,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                  }}
                >
                  {text.photoEvidence}
                </p>
                <h2
                  style={{
                    margin: "3px 0 0",
                    color: "#263447",
                    fontFamily: "var(--font-display)",
                    fontSize: "23px",
                    lineHeight: "1.05",
                    fontWeight: 800,
                  }}
                >
                  Add visual proof
                </h2>
              </div>
            </div>

            {!selectedFile ? (
              <label className="kf-report-upload-zone"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "30px 18px",
                  borderRadius: "22px",
                  border: "1px dashed #d8d1c7",
                  background: "#fcfaf6",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />

                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 12px",
                    borderRadius: "18px",
                    background: "#f4edf8",
                    fontSize: "24px",
                  }}
                >
                  📷
                </div>

                <div
                  style={{
                    color: "#39485a",
                    fontSize: "13px",
                    fontWeight: 900,
                  }}
                >
                  {text.clickUpload}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    color: "#929aa1",
                    fontSize: "10px",
                  }}
                >
                  {text.fileTypes}
                </div>
              </label>
            ) : (
              <div className="kf-report-upload-preview"
                style={{
                  overflow: "hidden",
                  borderRadius: "22px",
                  border: "1px solid #e2ddd5",
                  background: "#fcfaf6",
                }}
              >
                {previewUrl && (
                  <div
                    style={{
                      height: "260px",
                      overflow: "hidden",
                      background: "#f0ece6",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt={text.selectedEvidence}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    padding: "13px 15px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: "#697581",
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: ".15em",
                        textTransform: "uppercase",
                      }}
                    >
                      {text.selectedEvidence}
                    </div>
                    <div
                      style={{
                        marginTop: "3px",
                        color: "#2f4052",
                        fontSize: "12px",
                        fontWeight: 800,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "520px",
                      }}
                    >
                      {selectedFile.name}
                    </div>
                  </div>

                  <button className="kf-report-remove-button"
                    type="button"
                    onClick={removePhoto}
                    style={{
                      border: "1px solid #e0cfc8",
                      borderRadius: "999px",
                      background: "#fff3ef",
                      color: "#9a5b4b",
                      padding: "9px 13px",
                      fontSize: "10px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {text.removePhoto}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* SUBMIT */}
          <section className="kf-report-submit-section"
            style={{
              marginTop: "18px",
              overflow: "hidden",
              borderRadius: "30px",
              border: "1px solid #e5ddd2",
              background:
                "radial-gradient(circle at 92% 8%, #e6f1f7 0%, rgba(230,241,247,0) 32%), radial-gradient(circle at 8% 100%, #ffecd8 0%, rgba(255,236,216,0) 30%), #fffdf9",
              boxShadow: "0 16px 42px rgba(16,27,43,.06)",
            }}
          >
            <div
              style={{
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "15px",
                    background: "#fff0df",
                    fontSize: "20px",
                  }}
                >
                  ✦
                </div>

                <div>
                  <div
                    style={{
                      color: "#9a8e83",
                      fontSize: "9px",
                      fontWeight: 900,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                    }}
                  >
                    KarmaFacie guidance
                  </div>

                  <h2
                    style={{
                      margin: "4px 0 7px",
                      color: "#263447",
                      fontFamily: "var(--font-display)",
                      fontSize: "24px",
                      lineHeight: "1.05",
                      fontWeight: 800,
                    }}
                  >
                    {language === "en"
                      ? "Ready to report the issue?"
                      : language === "hi"
                      ? "समस्या रिपोर्ट करने के लिए तैयार हैं?"
                      : "समस्या नोंदवण्यासाठी तयार आहात?"}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#77838e",
                      fontSize: "12px",
                      lineHeight: "1.6",
                    }}
                  >
                    {language === "en"
                      ? "Check your details and submit. KarmaFacie will keep the report connected to the authority information available for your location."
                      : language === "hi"
                      ? "अपनी जानकारी जाँचें और सबमिट करें। KarmaFacie आपकी लोकेशन के लिए उपलब्ध प्राधिकरण जानकारी से रिपोर्ट को जोड़कर रखेगा।"
                      : "तुमची माहिती तपासा आणि सबमिट करा. तुमच्या स्थानासाठी उपलब्ध प्राधिकरणाच्या माहितीसोबत KarmaFacie तुमची नोंद जोडून ठेवेल."}
                  </p>
                </div>
              </div>

              <button className="kf-report-submit-button"
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  border: 0,
                  borderRadius: "999px",
                  background: saving ? "#d4a276" : "#ff7a00",
                  color: "#ffffff",
                  padding: "15px 20px",
                  fontSize: "13px",
                  fontWeight: 900,
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: saving
                    ? "none"
                    : "0 12px 24px rgba(255,122,0,.18)",
                }}
              >
                {saving ? text.submitting : text.submit}
              </button>
            </div>
          </section>
        </form>
      </div>

      <style>{`

        /* =========================================================
           REPORT ISSUE — DARK MODE
           Exact visual language of the current Civic Learning page.
           Light mode remains unchanged.
           ========================================================= */

        html[data-theme="dark"] .kf-report-page {
          --kf-ivory: #07111f !important;
          --kf-white: #0d1d31 !important;
          --kf-navy: #f5f7fb !important;
          --kf-ink: #e8edf5 !important;
          --kf-body: #b8c4d9 !important;
          --kf-muted: #8291aa !important;
          --kf-line: #1f2e47 !important;

          background:
            radial-gradient(circle at 92% 2%, rgba(42,76,108,.28) 0%, rgba(42,76,108,0) 27%),
            radial-gradient(circle at 4% 32%, rgba(36,78,106,.18) 0%, rgba(36,78,106,0) 25%),
            radial-gradient(circle at 92% 94%, rgba(132,72,32,.16) 0%, rgba(132,72,32,0) 26%),
            #07111f !important;
          color: #b8c4d9 !important;
        }

        html[data-theme="dark"] .kf-report-page > div {
          background: transparent !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar {
          border-color: #1f2e47 !important;
          background: rgba(13,29,49,.94) !important;
          box-shadow: 0 18px 48px rgba(0,0,0,.25) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar button,
        html[data-theme="dark"] .kf-report-page .kf-report-topbar select {
          border-color: #2a3c56 !important;
          background: #10243a !important;
          color: #dce5f2 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar button span {
          color: #ff8a24 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar > div:nth-child(2) > div:first-child {
          background: #ff7a00 !important;
          color: #102033 !important;
          box-shadow: 0 8px 18px rgba(255,122,0,.20) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar > div:nth-child(2) > div:last-child > div:first-child {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar > div:nth-child(2) > div:last-child > div:first-child span {
          color: #ff7a00 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-topbar > div:nth-child(2) > div:last-child > div:last-child {
          color: #8ea3b8 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-intro {
          background:
            radial-gradient(circle at 94% 0%, rgba(48,84,114,.34) 0%, rgba(48,84,114,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(111,63,31,.22) 0%, rgba(111,63,31,0) 35%),
            #10243a !important;
          border-color: #1f2e47 !important;
          box-shadow: 0 20px 55px rgba(0,0,0,.24) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-intro h1 {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-intro p {
          color: #b8c4d9 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-location-pill {
          background: rgba(16,36,58,.82) !important;
          border-color: #2a3c56 !important;
          color: #aebbd0 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-location-pill strong {
          color: #d7e0ec !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-success {
          background: #182c25 !important;
          border-color: #315040 !important;
          color: #a8d6af !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-error {
          background: #2a1c20 !important;
          border-color: #60404a !important;
          color: #f0b7bf !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section,
        html[data-theme="dark"] .kf-report-page .kf-report-submit-section {
          background: #0d1d31 !important;
          border-color: #1f2e47 !important;
          box-shadow: 0 18px 48px rgba(0,0,0,.20) !important;
          color: #b8c4d9 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section h2,
        html[data-theme="dark"] .kf-report-page .kf-report-section h3,
        html[data-theme="dark"] .kf-report-page .kf-report-submit-section h2 {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section p,
        html[data-theme="dark"] .kf-report-page .kf-report-submit-section p {
          color: #b8c4d9 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-1 > div:first-child > div:first-child {
          background: #30251b !important;
          color: #ffb37a !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-2 > div:first-child > div:first-child {
          background: #10263a !important;
          color: #9fc4df !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-3 > div:first-child > div:first-child {
          background: #182c25 !important;
          color: #9bd8a0 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-4 > div:first-child > div:first-child {
          background: #27233a !important;
          color: #b9a8ff !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-control {
          background: #10243a !important;
          border-color: #2a3c56 !important;
          color: #edf3fa !important;
          caret-color: #ff8a24 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.025) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-control::placeholder {
          color: #718198 !important;
          opacity: 1 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-category-select option {
          background: #10243a !important;
          color: #edf3fa !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-control:focus {
          border-color: #4a6e91 !important;
          box-shadow:
            0 0 0 3px rgba(79,181,255,.10),
            inset 0 1px 0 rgba(255,255,255,.025) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section label {
          color: #9fb0c5 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button {
          background: #10243a !important;
          border-color: #2a3c56 !important;
          color: #dce5f2 !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button[data-authority-selected="true"] {
          background: #182c25 !important;
          border-color: #315040 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button div[style*="color: #263447"] {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button div[style*="color: #78838d"] {
          color: #8291aa !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button span {
          background: #10263a !important;
          color: #9fc4df !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-authority-button[data-authority-selected="true"] span {
          background: #ff7a00 !important;
          color: #102033 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-1 div[style*="background: #f1f6fa"] {
          background: #10263a !important;
          border-color: #29445d !important;
          color: #9fb0c5 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-1 div[style*="background: #fff8ef"] {
          background: #30251b !important;
          border-color: #5a3d27 !important;
          color: #d7b996 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-section-1 span[style*="background: #7d9853"] {
          background: #8fd18b !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-secondary-button {
          background: #10263a !important;
          border-color: #29445d !important;
          color: #9fc4df !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-secondary-button:hover {
          background: #132943 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-upload-zone,
        html[data-theme="dark"] .kf-report-page .kf-report-upload-preview {
          background: #10243a !important;
          border-color: #2a3c56 !important;
          color: #dce5f2 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-upload-zone > div:first-of-type {
          background: #27233a !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-upload-zone > div:nth-of-type(2) {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-upload-zone > div:nth-of-type(3) {
          color: #718198 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-upload-preview > div[style*="height: 260px"] {
          background: #1a2940 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-remove-button {
          background: #2a1c20 !important;
          border-color: #60404a !important;
          color: #f0b7bf !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-submit-section {
          background:
            linear-gradient(135deg, #30251b 0%, #10243a 56%, #182c25 100%) !important;
          border-color: #3b3a35 !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-submit-section > div > div:first-child > div:first-child {
          background: rgba(255,140,26,.10) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-submit-section > div > div:first-child > div:nth-child(2) > div:first-child {
          color: #8291aa !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-submit-button,
        html[data-theme="dark"] .kf-report-page .kf-report-primary-button {
          background: #ff7a00 !important;
          border-color: #ff7a00 !important;
          color: #102033 !important;
          box-shadow: 0 10px 26px rgba(255,122,0,.22) !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-submit-button:disabled {
          background: #6d553f !important;
          border-color: #6d553f !important;
          color: #d0c7be !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-loading-card {
          background: #0d1d31 !important;
          border-color: #1f2e47 !important;
          box-shadow: 0 18px 48px rgba(0,0,0,.25) !important;
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-report-page .kf-report-loading-card p {
          color: #8291aa !important;
        }

        @media (max-width: 900px) {
          html[data-theme="dark"] .kf-report-page {
            padding: 14px 10px 52px !important;
          }

          html[data-theme="dark"] .kf-report-page .kf-report-topbar {
            top: 10px !important;
            margin-bottom: 26px !important;
            border-radius: 24px !important;
          }
        }

        @media (max-width: 760px) {
          main > div > header {
            position: relative !important;
            top: 0 !important;
          }
          main form section {
            padding: 18px !important;
          }
        }

/* =========================================================
   REPORT ISSUE — DARK NAVBAR GLOW
   Match the Healthcare/Civic Explore navbar glow exactly.
   IMPORTANT: no navbar dimensions, content, spacing or layout
   values are changed here; this only adds the visual glow.
   ========================================================= */
html[data-theme="dark"] .kf-report-page .kf-report-topbar {
  border: 1px solid transparent !important;
  background: rgba(4,10,20,.62) !important;
  background-image: none !important;
  box-shadow:
    -10px 0 24px -8px rgba(0,212,255,.30),
     10px 0 24px -8px rgba(255,140,26,.30),
     0 10px 30px rgba(0,0,0,.34) !important;
  backdrop-filter: blur(14px) saturate(125%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
  isolation: isolate !important;
}

html[data-theme="dark"] .kf-report-page .kf-report-topbar::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  border-radius: inherit !important;
  padding: 1.25px !important;
  background: linear-gradient(
    90deg,
    #00d4ff 0%,
    rgba(0,174,255,.52) 16%,
    rgba(90,120,150,.28) 43%,
    rgba(120,120,130,.22) 57%,
    rgba(255,150,40,.52) 84%,
    #ff8c1a 100%
  ) !important;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0) !important;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0) !important;
  -webkit-mask-composite: xor !important;
  mask-composite: exclude !important;
  pointer-events: none !important;
  z-index: 0 !important;
}

html[data-theme="dark"] .kf-report-page .kf-report-topbar::after {
  content: "" !important;
  position: absolute !important;
  inset: -5px !important;
  border-radius: 29px !important;
  background: linear-gradient(
    90deg,
    #00d4ff 0%,
    rgba(0,150,255,.32) 18%,
    transparent 36%,
    transparent 64%,
    rgba(255,140,26,.34) 82%,
    #ff8c1a 100%
  ) !important;
  filter: blur(10px) !important;
  opacity: .34 !important;
  pointer-events: none !important;
  z-index: -1 !important;
}

html[data-theme="dark"] .kf-report-page .kf-report-topbar > * {
  position: relative !important;
  z-index: 2 !important;
}

      `}</style>
    </main>
  );
}
