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

    reportError:
      "Something went wrong while reporting the issue.",
  },

  hi: {
    back: "← डैशबोर्ड पर वापस जाएँ",

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

    reportError:
      "समस्या रिपोर्ट करते समय कुछ गलत हो गया।",
  },

  mr: {
    back: "← डॅशबोर्डवर परत जा",

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
  const { language } = useLanguage();

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
      // 7. Go to dashboard
      // ------------------------------------------

      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
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
      <main
        style={{
          minHeight: "100vh",
          background: "#0b0f14",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        {text.loading}
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #18222e 0%, #0b0f14 45%, #070a0d 100%)",
        color: "white",
        padding:
          "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          style={{
            background: "transparent",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "24px",
          }}
        >
          {text.back}
        </button>

        <div
          style={{
            background:
              "rgba(17, 24, 39, 0.88)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#60a5fa",
                fontWeight: 700,
                marginBottom: "8px",
                letterSpacing:
                  "0.5px",
              }}
            >
              {text.label}
            </div>

            <h1
              style={{
                fontSize: "34px",
                margin: "0 0 10px",
                fontWeight: 800,
              }}
            >
              {text.title}
            </h1>

            <p
              style={{
                color: "#9ca3af",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {text.description}
            </p>

            {userCity && userState && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background:
                    "rgba(96,165,250,0.08)",
                  border:
                    "1px solid rgba(96,165,250,0.18)",
                  color: "#93c5fd",
                  fontSize: "13px",
                }}
              >
                {text.reportingFrom}{" "}
                <strong>
                  {userCity}, {userState}
                </strong>
              </div>
            )}
          </div>

          {message && (
            <div
              style={{
                background:
                  "rgba(34,197,94,0.12)",
                border:
                  "1px solid rgba(34,197,94,0.3)",
                color: "#86efac",
                padding:
                  "14px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background:
                  "rgba(239,68,68,0.12)",
                border:
                  "1px solid rgba(239,68,68,0.3)",
                color: "#fca5a5",
                padding:
                  "14px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            {/* CATEGORY */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label
                htmlFor="category"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: 600,
                }}
              >
                {text.category}
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #374151",
                  background:
                    "#111827",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing:
                    "border-box",
                }}
              >
                <option value="">
                  {text.selectIssue}
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {categoryLabels[
                        language
                      ][item]}
                    </option>
                  )
                )}
              </select>

              {/* AUTHORITY MATCH */}

              {category &&
                checkingAuthority && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#94a3b8",
                      fontSize: "13px",
                    }}
                  >
                    {text.checkingAuthority}
                  </div>
                )}

              {category &&
                !checkingAuthority &&
                matchedAuthorities.length > 0 && (
                  <div
                    style={{
                      marginTop: "12px",
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "#86efac",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {matchedAuthorities.length > 1
                        ? text.multipleAuthorities
                        : text.verifiedMatch}
                    </div>

                    {matchedAuthorities.length > 1 && (
                      <div
                        style={{
                          color: "#d1d5db",
                          fontSize: "13px",
                        }}
                      >
                        {text.selectAuthority}
                      </div>
                    )}

                    {matchedAuthorities.map((authority) => {
                      const selected =
                        selectedAuthorityId === authority.id;

                      return (
                        <button
                          key={authority.id}
                          type="button"
                          onClick={() =>
                            setSelectedAuthorityId(
                              authority.id
                            )
                          }
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "14px",
                            borderRadius: "12px",
                            background: selected
                              ? "rgba(34,197,94,0.14)"
                              : "rgba(34,197,94,0.07)",
                            border: selected
                              ? "1px solid #22c55e"
                              : "1px solid rgba(34,197,94,0.2)",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: "15px",
                            }}
                          >
                            🏛️ {authority.authority_name}
                          </div>

                          {authority.department_name && (
                            <div
                              style={{
                                color: "#d1d5db",
                                fontSize: "13px",
                                marginTop: "5px",
                              }}
                            >
                              {text.department}{" "}
                              {authority.department_name}
                            </div>
                          )}

                          {authority.submission_method && (
                            <div
                              style={{
                                color: "#9ca3af",
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              {text.channel}{" "}
                              {authority.submission_method}
                            </div>
                          )}

                          {authority.notes && (
                            <div
                              style={{
                                color: "#94a3b8",
                                fontSize: "12px",
                                lineHeight: 1.5,
                                marginTop: "7px",
                              }}
                            >
                              {authority.notes}
                            </div>
                          )}

                          {selected && (
                            <div
                              style={{
                                color: "#86efac",
                                fontSize: "12px",
                                fontWeight: 700,
                                marginTop: "8px",
                              }}
                            >
                              ✓ {text.routeSelected}{" "}
                              {authority.department_name ||
                                authority.authority_name}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              {category &&
                !checkingAuthority &&
                matchedAuthorities.length === 0 && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#94a3b8",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {text.noAuthority}{" "}
                    {userCity}.
                    <br />
                    {language === "en"
                      ? "The report can still be submitted."
                      : language === "hi"
                        ? "फिर भी रिपोर्ट सबमिट की जा सकती है।"
                        : "तरीही नोंद सबमिट केली जाऊ शकते."}
                  </div>
                )}

            </div>

            {/* TITLE */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label
                htmlFor="title"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: 600,
                }}
              >
                {text.issueTitle}
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder={
                  text.issueTitlePlaceholder
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #374151",
                  background:
                    "#111827",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* DESCRIPTION */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label
                htmlFor="description"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: 600,
                }}
              >
                {text.describeProblem}
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder={
                  text.describePlaceholder
                }
                rows={6}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border:
                    "1px solid #374151",
                  background:
                    "#111827",
                  color: "white",
                  fontSize: "15px",
                  outline: "none",
                  resize: "vertical",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            {/* LOCATION */}

            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <label
                htmlFor="location"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontWeight: 600,
                }}
              >
                {text.location}
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  id="location"
                  type="text"
                  value={locationText}
                  onChange={(e) =>
                    setLocationText(
                      e.target.value
                    )
                  }
                  placeholder={
                    text.locationPlaceholder
                  }
                  style={{
                    flex: 1,
                    minWidth:
                      "250px",
                    padding: "14px",
                    borderRadius: "12px",
                    border:
                      "1px solid #374151",
                    background:
                      "#111827",
                    color: "white",
                    fontSize: "15px",
                    outline: "none",
                    boxSizing:
                      "border-box",
                  }}
                />

                <button
                  type="button"
                  onClick={getLocation}
                  style={{
                    padding:
                      "14px 18px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #374151",
                    background:
                      "#1f2937",
                    color: "white",
                    cursor:
                      "pointer",
                    fontWeight: 600,
                  }}
                >
                  {text.useLocation}
                </button>
              </div>

              {latitude !== null &&
                longitude !== null && (
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "13px",
                      marginTop:
                        "9px",
                      marginBottom: 0,
                    }}
                  >
                    {text.gpsCaptured}{" "}
                    {latitude.toFixed(6)},{" "}
                    {longitude.toFixed(6)}
                  </p>
                )}
            </div>

            {/* PHOTO */}

            <div
              style={{
                border:
                  "1px dashed #374151",
                borderRadius:
                  "14px",
                padding: "20px",
                marginBottom:
                  "28px",
                background:
                  "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom:
                    "10px",
                }}
              >
                {text.photoEvidence}
              </div>

              {!selectedFile ? (
                <label
                  style={{
                    display: "block",
                    border:
                      "1px solid #374151",
                    borderRadius:
                      "12px",
                    padding: "24px",
                    textAlign:
                      "center",
                    background:
                      "#111827",
                    cursor:
                      "pointer",
                    color:
                      "#d1d5db",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={
                      handlePhotoChange
                    }
                    style={{
                      display: "none",
                    }}
                  />

                  <div
                    style={{
                      fontSize: "36px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    📸
                  </div>

                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    {text.clickUpload}
                  </div>

                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "13px",
                      marginTop:
                        "6px",
                    }}
                  >
                    {text.fileTypes}
                  </div>
                </label>
              ) : (
                <div>
                  <div
                    style={{
                      borderRadius:
                        "14px",
                      overflow:
                        "hidden",
                      marginBottom:
                        "14px",
                      background:
                        "#0b0f14",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt={text.selectedEvidence}
                      style={{
                        display: "block",
                        width: "100%",
                        maxHeight:
                          "400px",
                        objectFit:
                          "contain",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: "10px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize:
                            "14px",
                        }}
                      >
                        {
                          selectedFile.name
                        }
                      </div>

                      <div
                        style={{
                          color:
                            "#6b7280",
                          fontSize:
                            "12px",
                          marginTop:
                            "4px",
                        }}
                      >
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        removePhoto
                      }
                      style={{
                        padding:
                          "9px 14px",
                        borderRadius:
                          "10px",
                        border:
                          "1px solid #4b5563",
                        background:
                          "#1f2937",
                        color:
                          "#fca5a5",
                        cursor:
                          "pointer",
                        fontWeight:
                          600,
                      }}
                    >
                      {text.removePhoto}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius:
                  "14px",
                border: "none",
                background: saving
                  ? "#374151"
                  : "#2563eb",
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {saving
                ? text.submitting
                : text.submit}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}