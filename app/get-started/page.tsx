"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { indiaStates } from "@/lib/india-state-data";

const interestOptions = [
  "Government",
  "Constitution",
  "Elections",
  "Local Issues",
  "Environment",
  "Economy",
  "Education",
  "Healthcare",
];

const interestLabels: Record<
  Language,
  Record<string, string>
> = {
  en: {
    Government: "Government",
    Constitution: "Constitution",
    Elections: "Elections",
    "Local Issues": "Local Issues",
    Environment: "Environment",
    Economy: "Economy",
    Education: "Education",
    Healthcare: "Healthcare",
  },

  hi: {
    Government: "सरकार",
    Constitution: "संविधान",
    Elections: "चुनाव",
    "Local Issues": "स्थानीय समस्याएँ",
    Environment: "पर्यावरण",
    Economy: "अर्थव्यवस्था",
    Education: "शिक्षा",
    Healthcare: "स्वास्थ्य सेवा",
  },

  mr: {
    Government: "सरकार",
    Constitution: "संविधान",
    Elections: "निवडणुका",
    "Local Issues": "स्थानिक समस्या",
    Environment: "पर्यावरण",
    Economy: "अर्थव्यवस्था",
    Education: "शिक्षण",
    Healthcare: "आरोग्य सेवा",
  },
};

const ageGroupLabels: Record<
  Language,
  Record<string, string>
> = {
  en: {
    "Under 18": "Under 18",
    "18-25": "18–25",
    "26-35": "26–35",
    "36-45": "36–45",
    "46-60": "46–60",
    "60+": "60+",
  },

  hi: {
    "Under 18": "18 वर्ष से कम",
    "18-25": "18–25",
    "26-35": "26–35",
    "36-45": "36–45",
    "46-60": "46–60",
    "60+": "60+",
  },

  mr: {
    "Under 18": "18 वर्षांपेक्षा कमी",
    "18-25": "18–25",
    "26-35": "26–35",
    "36-45": "36–45",
    "46-60": "46–60",
    "60+": "60+",
  },
};

const stateOptions = indiaStates.filter(
  (state) => state.type === "State"
);

const unionTerritoryOptions = indiaStates.filter(
  (state) => state.type === "Union Territory"
);

type LocalBodyOption = {
  id: string;
  local_body_name: string;
};


const content = {
  en: {
    profileTitle: "Your Civic Profile",
    dashboard: "← Dashboard",

    label: "KRUTBHARAT · PROFILE",

    newTitle: "Tell us about yourself.",
    editTitle: "Edit your profile.",

    newDescription:
      "This helps KrutBharat personalize your learning experience and prepare civic reports for the appropriate authority.",

    editDescription:
      "Update your details and interests to keep your KrutBharat profile current.",

    name: "Name",
    namePlaceholder: "Enter your name",

    mobile: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    mobileHelp:
      "Used to help prepare official complaint forms when required.",

    state: "State",
    statePlaceholder: "Enter your state",

    city: "City / Urban Local Body",
    cityPlaceholder: "Enter your city",

    locationTitle: "Location",
    detectLocation: "Use my current location",
    detectingLocation: "Detecting location...",
    locationHelp:
      "Allow location access to detect your current coordinates, pincode, city and state.",
    locationDetected: "Location detected successfully. Please review the details before saving.",
    locationDenied:
      "Location access was denied. You can continue by entering your city manually.",
    locationUnavailable:
      "Unable to detect your location. Please check your browser location permission and try again.",
    locationOutsideIndia:
      "The detected location appears to be outside India. Please select your location manually.",
    locationLookupError:
      "Coordinates were detected, but the location details could not be retrieved. Please try again or enter your city manually.",
    pincode: "Pincode",
    pincodePlaceholder: "Detected pincode",
    coordinates: "GPS Coordinates",
    detectedState: "Detected state",
    detectedCity: "Detected city",
    detectedLocationHelp: "State / City were filled from your current location. You can still edit them manually below.",

    address: "Address",
    addressPlaceholder: "Enter your residential address",
    addressHelp:
      "This can help KrutBharat prepare address information for official grievance forms.",

    houseNo: "House / Flat / Building Number",
    houseNoPlaceholder: "e.g. 21, A-204, Plot 15",

    zone: "Zone",
    zonePlaceholder: "Enter your zone",

    ward: "Ward",
    wardPlaceholder: "Enter your ward",

    ageGroup: "Age Group",
    selectAgeGroup: "Select your age group",

    interestsTitle: "What are you interested in?",
    interestsDescription:
      "Select the topics you would like to explore on KrutBharat.",

    privacyNote:
      "Your contact and address details are stored in your KrutBharat profile and can be used to prepare information for official civic grievance forms.",

    save: "Save Profile",
    update: "Update Profile",
    saving: "Saving...",

    loading: "Loading your profile...",

    saveError:
      "Something went wrong while saving your profile.",
    saved: "Profile saved successfully!",

    footer: "KrutBharat · Learn. Understand. Participate.",
  },

  hi: {
    profileTitle: "आपकी नागरिक प्रोफ़ाइल",
    dashboard: "← डैशबोर्ड",

    label: "KRUTBHARAT · प्रोफ़ाइल",

    newTitle: "अपने बारे में बताएं।",
    editTitle: "अपनी प्रोफ़ाइल संपादित करें।",

    newDescription:
      "इससे KrutBharat आपके सीखने के अनुभव को आपकी आवश्यकताओं के अनुसार बेहतर बना सकता है और आपकी नागरिक शिकायतों को सही प्राधिकरण तक पहुँचाने के लिए आवश्यक जानकारी तैयार कर सकता है।",

    editDescription:
      "अपनी KrutBharat प्रोफ़ाइल को अपडेट रखने के लिए अपनी जानकारी और रुचियों को संपादित करें।",

    name: "नाम",
    namePlaceholder: "अपना नाम दर्ज करें",

    mobile: "मोबाइल नंबर",
    mobilePlaceholder: "अपना मोबाइल नंबर दर्ज करें",
    mobileHelp:
      "आवश्यक होने पर आधिकारिक शिकायत फॉर्म तैयार करने में सहायता के लिए उपयोग किया जाता है।",

    state: "राज्य",
    statePlaceholder: "अपना राज्य दर्ज करें",

    city: "शहर / शहरी स्थानीय निकाय",
    cityPlaceholder: "अपना शहर दर्ज करें",

    locationTitle: "स्थान",
    detectLocation: "मेरी वर्तमान लोकेशन उपयोग करें",
    detectingLocation: "लोकेशन खोजी जा रही है...",
    locationHelp:
      "अपनी वर्तमान लोकेशन, पिनकोड, शहर और राज्य पहचानने के लिए लोकेशन की अनुमति दें।",
    locationDetected: "लोकेशन सफलतापूर्वक पहचान ली गई। सेव करने से पहले विवरण की जाँच करें।",
    locationDenied:
      "लोकेशन की अनुमति नहीं दी गई। आप शहर का नाम स्वयं दर्ज करके आगे बढ़ सकते हैं।",
    locationUnavailable:
      "लोकेशन पहचानना संभव नहीं हुआ। ब्राउज़र की लोकेशन अनुमति जाँचकर फिर प्रयास करें।",
    locationOutsideIndia:
      "पहचानी गई लोकेशन भारत के बाहर प्रतीत होती है। कृपया अपनी लोकेशन मैन्युअल रूप से चुनें।",
    locationLookupError:
      "GPS निर्देशांक मिल गए, लेकिन स्थान का विवरण प्राप्त नहीं हो सका। फिर से प्रयास करें या शहर मैन्युअल रूप से दर्ज करें।",
    pincode: "पिनकोड",
    pincodePlaceholder: "पहचाना गया पिनकोड",
    coordinates: "GPS निर्देशांक",
    detectedState: "पहचाना गया राज्य",
    detectedCity: "पहचाना गया शहर",
    detectedLocationHelp: "राज्य / शहर आपकी वर्तमान लोकेशन से भरे गए हैं। आप नीचे इन्हें मैन्युअली भी बदल सकते हैं।",

    address: "पता",
    addressPlaceholder: "अपना निवास का पता दर्ज करें",
    addressHelp:
      "इससे KrutBharat आधिकारिक शिकायत फॉर्म के लिए पते की जानकारी तैयार कर सकता है।",

    houseNo: "मकान / फ्लैट / भवन नंबर",
    houseNoPlaceholder: "जैसे 21, A-204, Plot 15",

    zone: "ज़ोन",
    zonePlaceholder: "अपना ज़ोन दर्ज करें",

    ward: "वार्ड",
    wardPlaceholder: "अपना वार्ड दर्ज करें",

    ageGroup: "आयु वर्ग",
    selectAgeGroup: "अपना आयु वर्ग चुनें",

    interestsTitle: "आपकी किन विषयों में रुचि है?",
    interestsDescription:
      "वे विषय चुनें जिन्हें आप KrutBharat पर देखना और सीखना चाहते हैं।",

    privacyNote:
      "आपकी संपर्क और पते की जानकारी आपके KrutBharat प्रोफ़ाइल में सुरक्षित रखी जाती है और आधिकारिक नागरिक शिकायत फॉर्म के लिए आवश्यक जानकारी तैयार करने में उपयोग की जा सकती है।",

    save: "प्रोफ़ाइल सेव करें",
    update: "प्रोफ़ाइल अपडेट करें",
    saving: "सेव किया जा रहा है...",

    loading: "आपकी प्रोफ़ाइल लोड हो रही है...",

    saveError:
      "आपकी प्रोफ़ाइल सेव करते समय कुछ गलत हो गया।",
    saved: "प्रोफ़ाइल सफलतापूर्वक सेव हो गई!",

    footer: "KrutBharat · सीखें। समझें। भाग लें।",
  },

  mr: {
    profileTitle: "तुमची नागरिक प्रोफाइल",
    dashboard: "← डॅशबोर्ड",

    label: "KRUTBHARAT · प्रोफाइल",

    newTitle: "तुमच्याबद्दल सांगा.",
    editTitle: "तुमची प्रोफाइल संपादित करा.",

    newDescription:
      "यामुळे KrutBharat तुमचा शिकण्याचा अनुभव अधिक योग्य प्रकारे तयार करू शकते आणि तुमच्या नागरिक तक्रारीसाठी योग्य प्राधिकरणाकडे आवश्यक माहिती तयार करू शकते.",

    editDescription:
      "तुमची KrutBharat प्रोफाइल अद्ययावत ठेवण्यासाठी तुमची माहिती आणि आवडी संपादित करा.",

    name: "नाव",
    namePlaceholder: "तुमचे नाव टाका",

    mobile: "मोबाईल क्रमांक",
    mobilePlaceholder: "तुमचा मोबाईल क्रमांक टाका",
    mobileHelp:
      "आवश्यकतेनुसार अधिकृत तक्रार अर्ज तयार करण्यासाठी मदत म्हणून वापरला जातो.",

    state: "राज्य",
    statePlaceholder: "तुमचे राज्य टाका",

    city: "शहर / शहरी स्थानीय निकाय",
    cityPlaceholder: "तुमचे शहर टाका",

    locationTitle: "स्थान",
    detectLocation: "माझी सध्याची लोकेशन वापरा",
    detectingLocation: "लोकेशन शोधत आहे...",
    locationHelp:
      "तुमचे सध्याचे निर्देशांक, पिनकोड, शहर आणि राज्य ओळखण्यासाठी लोकेशनची परवानगी द्या.",
    locationDetected: "लोकेशन यशस्वीरित्या ओळखले गेले. सेव्ह करण्यापूर्वी तपशील तपासा.",
    locationDenied:
      "लोकेशनची परवानगी दिली नाही. तुम्ही शहराचे नाव स्वतः टाकून पुढे जाऊ शकता.",
    locationUnavailable:
      "लोकेशन ओळखता आले नाही. ब्राउझरची लोकेशन परवानगी तपासून पुन्हा प्रयत्न करा.",
    locationOutsideIndia:
      "ओळखलेले लोकेशन भारताबाहेर असल्याचे दिसते. कृपया तुमचे लोकेशन स्वतः निवडा.",
    locationLookupError:
      "GPS निर्देशांक मिळाले, पण स्थानाचा तपशील मिळवता आला नाही. पुन्हा प्रयत्न करा किंवा शहराचे नाव स्वतः टाका.",
    pincode: "पिनकोड",
    pincodePlaceholder: "ओळखलेला पिनकोड",
    coordinates: "GPS निर्देशांक",
    detectedState: "ओळखलेले राज्य",
    detectedCity: "ओळखलेले शहर",
    detectedLocationHelp: "राज्य / शहर तुमच्या वर्तमान लोकेशनवरून भरले गेले आहेत. तुम्ही खाली ते मॅन्युअली देखील बदलू शकता.",

    address: "पत्ता",
    addressPlaceholder: "तुमचा निवासी पत्ता टाका",
    addressHelp:
      "यामुळे KrutBharat अधिकृत तक्रार फॉर्मसाठी पत्त्याची माहिती तयार करू शकते.",

    houseNo: "घर / फ्लॅट / इमारत क्रमांक",
    houseNoPlaceholder: "उदा. 21, A-204, Plot 15",

    zone: "झोन",
    zonePlaceholder: "तुमचा झोन टाका",

    ward: "प्रभाग",
    wardPlaceholder: "तुमचा प्रभाग टाका",

    ageGroup: "वयोगट",
    selectAgeGroup: "तुमचा वयोगट निवडा",

    interestsTitle: "तुम्हाला कोणत्या विषयांमध्ये रस आहे?",
    interestsDescription:
      "KrutBharat वर तुम्हाला ज्या विषयांबद्दल जाणून घ्यायचे आहे ते निवडा.",

    privacyNote:
      "तुमची संपर्क आणि पत्त्याची माहिती तुमच्या KrutBharat प्रोफाइलमध्ये सुरक्षित ठेवली जाते आणि अधिकृत नागरिक तक्रार फॉर्मसाठी आवश्यक माहिती तयार करण्यासाठी वापरली जाऊ शकते.",

    save: "प्रोफाइल सेव्ह करा",
    update: "प्रोफाइल अपडेट करा",
    saving: "सेव्ह होत आहे...",

    loading: "तुमची प्रोफाइल लोड होत आहे...",

    saveError:
      "तुमची प्रोफाइल सेव्ह करताना काहीतरी चूक झाली.",
    saved: "प्रोफाइल यशस्वीरित्या सेव्ह झाली!",

    footer: "KrutBharat · शिका. समजून घ्या. सहभागी व्हा.",
  },
};


const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "11px",
  fontWeight: 900,
  color: "#24364a",
  letterSpacing: "0.01em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.76)",
  color: "#102033",
  border: "1px solid rgba(206,215,224,0.92)",
  borderRadius: "16px",
  padding: "15px 16px",
  fontSize: "14px",
  outline: "none",
  boxShadow: "0 5px 18px rgba(16,32,51,0.035)",
};

const helpStyle: React.CSSProperties = {
  color: "#8a95a3",
  fontSize: "10px",
  marginTop: "7px",
  lineHeight: "1.5",
};

function Field({
  id,
  label,
  value,
  setValue,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

export default function GetStartedPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const text = content[language];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ------------------------------------------
  // Existing profile fields
  // ------------------------------------------

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [localBodyId, setLocalBodyId] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [localBodyOptions, setLocalBodyOptions] = useState<LocalBodyOption[]>([]);
  const [loadingLocalBodies, setLoadingLocalBodies] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsLocationDetected, setGpsLocationDetected] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [pincodeSource, setPincodeSource] = useState<
    "profile" | "nominatim" | "india-post" | null
  >(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  // ------------------------------------------
  // Citizen submission fields
  // ------------------------------------------

  const [mobile, setMobile] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("");
  const [ward, setWard] = useState("");

  useEffect(() => {
    void loadProfile();
  }, []);

  // ------------------------------------------
  // Track KrutBharat theme
  // ------------------------------------------

  useEffect(() => {
    const syncTheme = () => {
      setIsDarkTheme(
        document.documentElement.getAttribute("data-theme") === "dark"
      );
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // ------------------------------------------
  // Load existing profile
  // ------------------------------------------

  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const {
      data: profile,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);

      setLoading(false);
      return;
    }

    if (profile) {
      // Existing fields
      setName(profile.name || "");
      setState(profile.state || "");
      setCity(profile.city || "");
      setLocalBodyId(profile.local_body_id || null);
      setAgeGroup(profile.age_group || "");
      setPincode(profile.pincode || "");
      setPincodeSource(profile.pincode ? "profile" : null);
      setLatitude(
        typeof profile.latitude === "number" ? profile.latitude : null
      );
      setLongitude(
        typeof profile.longitude === "number" ? profile.longitude : null
      );
      setGpsLocationDetected(false);
      setInterests(profile.interests || []);

      // Citizen submission fields
      setMobile(profile.mobile || "");
      setHouseNo(profile.house_no || "");
      setAddress(profile.address || "");
      setZone(profile.zone || "");
      setWard(profile.ward || "");

      setIsEditing(true);
    }

    setLoading(false);
  };

  // ------------------------------------------
  // Interest selector
  // ------------------------------------------

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  // ------------------------------------------
  // Resolve canonical Local Government Directory
  // local body from State + City.
  //
  // If multiple ULBs share the same city name, we
  // intentionally leave the canonical ID unresolved
  // rather than guessing.
  // ------------------------------------------

  const normalizeLocationName = (value: string) =>
    value
      .toLocaleLowerCase()
      .replace(/municipal\s+corporation/g, "")
      .replace(/municipal\s+municipality/g, "")
      .replace(/municipality/g, "")
      .replace(/municipal\s+council/g, "")
      .replace(/municipal\s+committee/g, "")
      .replace(/town\s+committee/g, "")
      .replace(/city/g, "")
      .replace(/[^a-z0-9\u0900-\u097f]+/g, "")
      .trim();

  // ------------------------------------------
  // Load canonical ULBs for the selected state.
  // The manual city field is backed by this list,
  // so citizens select a real LGD local body rather
  // than entering arbitrary free text.
  // ------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const loadLocalBodies = async () => {
      if (!state) {
        setLocalBodyOptions([]);
        return;
      }

      setLoadingLocalBodies(true);

      const { data, error } = await supabase
        .from("civic_local_bodies")
        .select("id, local_body_name")
        .eq("state", state)
        .eq("is_active", true)
        .order("local_body_name", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Local body list loading error:", error);
        setLocalBodyOptions([]);
        setLoadingLocalBodies(false);
        return;
      }

      const options = (data || []) as LocalBodyOption[];
      setLocalBodyOptions(options);

      // When an existing profile has city text but no canonical
      // local_body_id yet, resolve it against the loaded ULB list.
      if (!localBodyId && city) {
        const normalizedCity = normalizeLocationName(city);

        const exactMatches = options.filter(
          (item) =>
            normalizeLocationName(item.local_body_name) === normalizedCity
        );

        if (exactMatches.length === 1) {
          setLocalBodyId(exactMatches[0].id);
          setCity(exactMatches[0].local_body_name);
        } else if (exactMatches.length === 0) {
          // Keep the existing city text for the user to review,
          // but do not guess a canonical ULB.
          setLocalBodyId(null);
        }
      }

      setLoadingLocalBodies(false);
    };

    void loadLocalBodies();

    return () => {
      cancelled = true;
    };
  }, [state]);

  const resolveLocalBodyId = async (
    nextState: string,
    nextCity: string
  ) => {
    const cleanState = nextState.trim();
    const cleanCity = nextCity.trim();

    if (!cleanState || !cleanCity) {
      return null;
    }

    const normalizedCity = normalizeLocationName(cleanCity);

    // First use the already-loaded state list.
    const localMatch = localBodyOptions.filter(
      (item) =>
        normalizeLocationName(item.local_body_name) === normalizedCity
    );

    if (localMatch.length === 1) {
      return localMatch[0].id;
    }

    // Then query Supabase directly as a fallback.
    const { data, error } = await supabase
      .from("civic_local_bodies")
      .select("id, local_body_name")
      .eq("state", cleanState)
      .eq("is_active", true)
      .ilike("local_body_name", cleanCity)
      .limit(2);

    if (error) {
      console.error("Local body resolution error:", error);
      return null;
    }

    if ((data || []).length === 1) {
      return data[0].id as string;
    }

    if ((data || []).length > 1) {
      console.warn(
        "Multiple matching ULBs found; canonical local_body_id was not guessed.",
        data
      );
    }

    return null;
  };

  // Resolve an auto-detected city against the national LGD ULB list.
  const resolveDetectedLocalBody = async (
    nextState: string,
    detectedCity: string
  ): Promise<LocalBodyOption | null> => {
    const cleanState = nextState.trim();
    const normalizedDetectedCity = normalizeLocationName(detectedCity);

    if (!cleanState || !normalizedDetectedCity) {
      return null;
    }

    const currentOptions =
      localBodyOptions.length > 0 && cleanState === state
        ? localBodyOptions
        : ((await supabase
            .from("civic_local_bodies")
            .select("id, local_body_name")
            .eq("state", cleanState)
            .eq("is_active", true)
            .order("local_body_name", { ascending: true })
            .then(({ data, error }) => {
              if (error) {
                console.error(
                  "Detected local body lookup error:",
                  error
                );
                return [];
              }
              return (data || []) as LocalBodyOption[];
            })) as LocalBodyOption[]);

    const exactMatches = currentOptions.filter(
      (item) =>
        normalizeLocationName(item.local_body_name) ===
        normalizedDetectedCity
    );

    if (exactMatches.length === 1) {
      return exactMatches[0];
    }

    return null;
  };

  // ------------------------------------------
  // Detect current location
  // ------------------------------------------

  const detectCurrentLocation = () => {
    setLocationMessage("");
    setDetectingLocation(true);

    if (!navigator.geolocation) {
      setLocationMessage(text.locationUnavailable);
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const detectedLatitude = position.coords.latitude;
        const detectedLongitude = position.coords.longitude;

        setLatitude(detectedLatitude);
        setLongitude(detectedLongitude);

        try {
          // Existing geocoder continues to provide city/state.
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
              detectedLatitude
            )}&longitude=${encodeURIComponent(
              detectedLongitude
            )}&localityLanguage=${encodeURIComponent(language)}`
          );

          if (!response.ok) {
            throw new Error(
              `Reverse geocoding failed: ${response.status}`
            );
          }

          const locationData = await response.json();

          if (locationData.countryCode !== "IN") {
            setLocationMessage(text.locationOutsideIndia);
            return;
          }

          const detectedStateName =
            locationData.principalSubdivision ||
            locationData.state ||
            "";

          const matchedState = indiaStates.find((item) => {
            const candidates = [
              item.name,
              item.localizedName.en,
              item.localizedName.hi,
              item.localizedName.mr,
            ];

            return candidates.some(
              (candidate) =>
                candidate.trim().toLocaleLowerCase() ===
                detectedStateName.trim().toLocaleLowerCase()
            );
          });

          if (matchedState) {
            setState(matchedState.name);
          } else if (detectedStateName) {
            setState(detectedStateName);
          }

          const detectedCity =
            locationData.city ||
            locationData.locality ||
            locationData.principalSubdivision ||
            "";

          const detectedLocalBody =
            matchedState && detectedCity
              ? await resolveDetectedLocalBody(
                  matchedState.name,
                  detectedCity
                )
              : null;

          if (detectedLocalBody) {
            setState(matchedState?.name || detectedStateName);
            setCity(detectedLocalBody.local_body_name);
            setLocalBodyId(detectedLocalBody.id);
          } else {
            setState(matchedState?.name || detectedStateName);
            setCity("");
            setLocalBodyId(null);
            setLocationMessage(
              `${text.locationDetected} Please select the detected state's city / local body below.`
            );
          }

          let detectedPincode =
            typeof locationData.postcode === "string"
              ? locationData.postcode.trim()
              : "";

          let source:
            | "profile"
            | "nominatim"
            | "india-post"
            | null = null;

          // BigDataCloud sometimes returns city/state but no Indian PIN.
          // In that case, use the server-side fallback.
          if (/^\d{6}$/.test(detectedPincode)) {
            source = "profile";
          } else {
            detectedPincode = "";

            try {
              const fallbackResponse = await fetch(
                `/api/reverse-geocode?latitude=${encodeURIComponent(
                  detectedLatitude
                )}&longitude=${encodeURIComponent(
                  detectedLongitude
                )}`,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                  },
                }
              );

              if (fallbackResponse.ok) {
                const fallbackData =
                  await fallbackResponse.json();

                if (
                  typeof fallbackData?.pincode === "string" &&
                  /^\d{6}$/.test(fallbackData.pincode)
                ) {
                  detectedPincode = fallbackData.pincode;
                  source =
                    fallbackData.source === "india-post"
                      ? "india-post"
                      : "nominatim";
                }
              }
            } catch (fallbackError) {
              console.error(
                "Pincode reverse-geocoding fallback failed:",
                fallbackError
              );
            }
          }

          setPincode(detectedPincode);
          setPincodeSource(source);
          setGpsLocationDetected(true);
          setLocationMessage(text.locationDetected);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setLocationMessage(text.locationLookupError);
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage(text.locationDenied);
        } else {
          setLocationMessage(text.locationUnavailable);
        }

        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  // ------------------------------------------
  // Save profile
  // ------------------------------------------

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    let resolvedLocalBodyId = localBodyId;

    if (!resolvedLocalBodyId && state && city) {
      resolvedLocalBodyId = await resolveLocalBodyId(
        state,
        city
      );
    }

    if (resolvedLocalBodyId) {
      setLocalBodyId(resolvedLocalBodyId);
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,

          // Existing fields
          name,
          state,
          city,
          local_body_id: resolvedLocalBodyId,
          age_group: ageGroup,
          interests,
          pincode: pincode || null,
          latitude,
          longitude,

          // Citizen submission fields
          mobile,
          house_no: houseNo,
          address,
          zone,
          ward,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.error("Error saving profile:", error);

      alert(text.saveError);

      setSaving(false);
      return;
    }

    alert(text.saved);

    setSaving(false);

    router.replace("/dashboard");
  };

  // ------------------------------------------
  // Loading state
  // ------------------------------------------

  if (loading) {
    return (
      <main
        className="kf-get-started-page"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 10% 10%, rgba(220,238,250,0.7), transparent 30%), radial-gradient(circle at 90% 10%, rgba(255,220,187,0.5), transparent 28%), #F7F1E5",
          color: "#102033",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 5%",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "34px",
              lineHeight: "1",
              fontWeight: "800",
              letterSpacing: "-0.045em",
              marginBottom: "10px",
            }}
          >
            Krut<span
              style={{
                color: "#ff7a00",
              }}
            >
              Bharat
            </span>
          </div>

          <p
            className="kf-get-started-description"
            style={{
              color: "#718095",
            }}
          >
            {text.loading}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="kf-get-started-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 8% 4%, rgba(207,230,244,0.78) 0%, rgba(207,230,244,0) 30%), radial-gradient(ellipse at 92% 6%, rgba(255,214,177,0.72) 0%, rgba(255,214,177,0) 28%), radial-gradient(ellipse at 55% 105%, rgba(232,224,246,0.34) 0%, rgba(232,224,246,0) 34%), #F7F1E5",
        color: "#102033",
        padding: "22px 5% 76px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div style={{ position: "absolute", left: "-120px", top: "240px", width: "420px", height: "180px", borderRadius: "999px", background: "rgba(205,229,245,0.28)", filter: "blur(42px)", transform: "rotate(12deg)" }} />
        <div style={{ position: "absolute", right: "-130px", top: "420px", width: "440px", height: "190px", borderRadius: "999px", background: "rgba(255,211,174,0.25)", filter: "blur(46px)", transform: "rotate(-10deg)" }} />
      </div>

      <div style={{ maxWidth: "1120px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <header
          className="kf-get-started-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "46px",
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.72)",
            borderRadius: "24px",
            background: "rgba(255,253,249,0.62)",
            boxShadow: "0 14px 38px rgba(16,32,51,0.055), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px) saturate(135%)",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "var(--font-display), sans-serif",
                fontSize: "23px",
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.045em",
              }}
            >
              <span className="kf-get-started-logo-krut" style={{ color: "#102033" }}>Krut</span>
              <span className="kf-get-started-logo-bharat" style={{ color: "#FF7A00" }}>bharat</span>
            </div>
            <div
              className="kf-get-started-header-subtitle"
              style={{
                color: "#718095",
                marginTop: "7px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              {text.profileTitle}
            </div>
          </div>

          <button
            type="button"
            className="kf-get-started-back"
            onClick={() => router.replace("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.68)",
              color: "#102033",
              border: "1px solid #d8d1c7",
              borderRadius: "999px",
              padding: "11px 18px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(16,32,51,0.06)",
              backdropFilter: "blur(14px)",
            }}
          >
            {text.dashboard}
          </button>
        </header>

        <section
          style={{
            position: "relative",
            marginBottom: "30px",
            padding: "8px 4px 4px",
          }}
        >
          <div
            className="kf-get-started-eyebrow"
            style={{
              color: "#FF7A00",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.18em",
              marginBottom: "12px",
            }}
          >
            {text.label}
          </div>

          <h1
            className="kf-get-started-title"
            style={{
              fontSize: "clamp(38px, 5vw, 58px)",
              lineHeight: "1.02",
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 800,
              letterSpacing: "-0.055em",
              margin: "0 0 14px",
              color: "#102033",
            }}
          >
            {isEditing ? text.editTitle : text.newTitle}
          </h1>

          <p
            style={{
              color: "#718095",
              fontSize: "15px",
              lineHeight: "1.7",
              maxWidth: "700px",
              margin: 0,
            }}
          >
            {isEditing ? text.editDescription : text.newDescription}
          </p>
        </section>

        <form onSubmit={handleSave}>
          <section
            className="kf-get-started-form-card"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,253,249,0.70))",
              border: "1px solid rgba(255,255,255,0.92)",
              borderRadius: "32px",
              padding: "clamp(22px, 4vw, 38px)",
              boxShadow:
                "0 28px 80px rgba(16,32,51,0.09), 0 8px 24px rgba(16,32,51,0.035), inset 0 1px 0 rgba(255,255,255,0.98)",
              backdropFilter: "blur(24px) saturate(135%)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "-90px",
                top: "-100px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "rgba(255,207,164,0.28)",
                filter: "blur(32px)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-100px",
                bottom: "-120px",
                width: "270px",
                height: "270px",
                borderRadius: "50%",
                background: "rgba(205,229,245,0.34)",
                filter: "blur(35px)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              {[
                ["name", text.name, name, setName, text.namePlaceholder],
              ].map(([id, label, value, setter, placeholder]) => (
                <div key={id as string} style={{ marginBottom: "24px" }}>
                  <label
                    htmlFor={id as string}
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#24364a",
                    }}
                  >
                    {label as string}
                  </label>
                  <input
                    id={id as string}
                    type="text"
                    value={value as string}
                    onChange={(event) =>
                      (setter as React.Dispatch<React.SetStateAction<string>>)(
                        event.target.value
                      )
                    }
                    placeholder={placeholder as string}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      background: "rgba(255,255,255,0.76)",
                      color: "#102033",
                      border: "1px solid rgba(206,215,224,0.92)",
                      borderRadius: "16px",
                      padding: "15px 16px",
                      fontSize: "14px",
                      outline: "none",
                      boxShadow: "0 5px 18px rgba(16,32,51,0.035)",
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="mobile" style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 800, color: "#24364a" }}>
                  {text.mobile}
                </label>
                <input id="mobile" type="tel" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder={text.mobilePlaceholder} inputMode="numeric" maxLength={15} style={inputStyle} />
                <div style={helpStyle}>{text.mobileHelp}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginBottom: "18px" }}>
                <div>
                  <label htmlFor="state" style={labelStyle}>
                    {text.state}
                  </label>

                  <select
                    id="state"
                    value={state}
                    onChange={(event) => {
                      const nextState = event.target.value;
                      setState(nextState);
                      setGpsLocationDetected(false);
                      setLocalBodyId(null);

                      if (nextState !== state) {
                        setCity("");
                        setPincode("");
                      }
                    }}
                    required
                    style={inputStyle}
                  >
                    <option value="">
                      {text.statePlaceholder}
                    </option>

                    <optgroup label="States">
                      {stateOptions.map((item) => (
                        <option key={item.slug} value={item.name}>
                          {item.localizedName[language]}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Union Territories">
                      {unionTerritoryOptions.map((item) => (
                        <option key={item.slug} value={item.name}>
                          {item.localizedName[language]}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label htmlFor="city" style={labelStyle}>
                    {text.city}
                  </label>

                  <select
                    id="city"
                    value={localBodyId || ""}
                    onChange={(event) => {
                      const nextId = event.target.value;
                      const selected = localBodyOptions.find(
                        (item) => item.id === nextId
                      );

                      setLocalBodyId(nextId || null);
                      setCity(selected?.local_body_name || "");
                      setGpsLocationDetected(false);
                    }}
                    required
                    disabled={!state || loadingLocalBodies}
                    style={inputStyle}
                  >
                    <option value="">
                      {!state
                        ? text.statePlaceholder
                        : loadingLocalBodies
                          ? "Loading cities..."
                          : text.cityPlaceholder}
                    </option>

                    {localBodyOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.local_body_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                className="kf-get-started-location-card"
                style={{
                  marginBottom: "24px",
                  padding: "16px",
                  borderRadius: "18px",
                  background: isDarkTheme
                    ? "linear-gradient(135deg, rgba(13,31,50,0.96), rgba(7,18,31,0.92))"
                    : "rgba(238,247,252,0.62)",
                  border: isDarkTheme
                    ? "1px solid rgba(76,150,203,0.24)"
                    : "1px solid rgba(176,208,230,0.62)",
                  boxShadow: isDarkTheme
                    ? "0 12px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.035)"
                    : "0 8px 24px rgba(16,32,51,0.035)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: "1 1 280px" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 900,
                        color: isDarkTheme ? "#e1e9f2" : "#24364a",
                        marginBottom: "5px",
                      }}
                    >
                      {text.locationTitle}
                    </div>

                    <div
                      style={{
                        color: isDarkTheme ? "#8fa2b6" : "#718095",
                        fontSize: "11px",
                        lineHeight: "1.55",
                      }}
                    >
                      {text.locationHelp}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={detectCurrentLocation}
                    disabled={detectingLocation}
                    style={{
                      flex: "0 0 auto",
                      background: detectingLocation
                        ? "#d7a06f"
                        : "#FF7A00",
                      color: "#fff",
                      border: "none",
                      borderRadius: "999px",
                      padding: "11px 17px",
                      fontSize: "11px",
                      fontWeight: 900,
                      cursor: detectingLocation ? "not-allowed" : "pointer",
                      boxShadow: "0 9px 22px rgba(255,122,0,0.16)",
                    }}
                  >
                    {detectingLocation
                      ? text.detectingLocation
                      : `📍 ${text.detectLocation}`}
                  </button>
                </div>

                {locationMessage ? (
                  <div
                    style={{
                      marginTop: "11px",
                      fontSize: "10px",
                      lineHeight: "1.55",
                      color: isDarkTheme ? "#9aafc3" : "#5d6f82",
                    }}
                  >
                    {locationMessage}
                  </div>
                ) : null}

                {gpsLocationDetected ? (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "14px",
                      borderTop: isDarkTheme
                        ? "1px solid rgba(110,160,198,0.16)"
                        : "1px solid rgba(176,208,230,0.5)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "10px",
                      }}
                    >
                      {[
                        [text.detectedState, state || "—"],
                        [text.detectedCity, city || "—"],
                        [text.pincode, pincode || "—"],
                        [text.coordinates,
                          latitude !== null && longitude !== null
                            ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                            : "—"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          style={{
                            padding: "10px 11px",
                            borderRadius: "13px",
                            background: isDarkTheme
                              ? "rgba(5,17,30,0.46)"
                              : "rgba(255,255,255,0.58)",
                            border: isDarkTheme
                              ? "1px solid rgba(90,145,185,0.14)"
                              : "1px solid rgba(183,211,229,0.42)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "9px",
                              fontWeight: 900,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: isDarkTheme ? "#6f879d" : "#8392a2",
                              marginBottom: "4px",
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 800,
                              color: isDarkTheme ? "#e1e9f2" : "#24364a",
                              wordBreak: "break-word",
                            }}
                          >
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        marginTop: "9px",
                        fontSize: "10px",
                        lineHeight: "1.5",
                        color: isDarkTheme ? "#8fa2b6" : "#718095",
                      }}
                    >
                      {text.detectedLocationHelp}
                    </div>
                  </div>
                ) : null}

                {pincodeSource === "nominatim" ? (
                  <div
                    style={{
                      marginTop: "7px",
                      fontSize: "9px",
                      lineHeight: "1.5",
                      color: isDarkTheme ? "#6f879d" : "#8a95a3",
                    }}
                  >
                    © OpenStreetMap contributors
                  </div>
                ) : null}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "18px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label htmlFor="pincode" style={labelStyle}>
                    {text.pincode}
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={pincode}
                    onChange={(event) => {
                      setPincode(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      );
                      setPincodeSource(null);
                      setGpsLocationDetected(false);
                    }}
                    placeholder={text.pincodePlaceholder}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="coordinates" style={labelStyle}>
                    {text.coordinates}
                  </label>
                  <input
                    id="coordinates"
                    type="text"
                    value={
                      latitude !== null && longitude !== null
                        ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        : ""
                    }
                    placeholder="Not detected yet"
                    readOnly
                    style={{
                      ...inputStyle,
                      color: isDarkTheme ? "#8fa2b6" : "#718095",
                      background: isDarkTheme
                        ? "rgba(5,17,30,0.62)"
                        : "rgba(247,250,252,0.86)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="address" style={labelStyle}>{text.address}</label>
                <textarea id="address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder={text.addressPlaceholder} rows={4} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
                <div style={helpStyle}>{text.addressHelp}</div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label htmlFor="houseNo" style={labelStyle}>{text.houseNo}</label>
                <input id="houseNo" type="text" value={houseNo} onChange={(event) => setHouseNo(event.target.value)} placeholder={text.houseNoPlaceholder} style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginBottom: "28px" }}>
                <Field id="zone" label={text.zone} value={zone} setValue={setZone} placeholder={text.zonePlaceholder} />
                <Field id="ward" label={text.ward} value={ward} setValue={setWard} placeholder={text.wardPlaceholder} />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label htmlFor="ageGroup" style={labelStyle}>{text.ageGroup}</label>
                <select id="ageGroup" value={ageGroup} onChange={(event) => setAgeGroup(event.target.value)} required style={inputStyle}>
                  <option value="">{text.selectAgeGroup}</option>
                  {["Under 18", "18-25", "26-35", "36-45", "46-60", "60+"].map((value) => (
                    <option key={value} value={value}>{ageGroupLabels[language][value]}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ marginBottom: "7px", fontSize: "12px", fontWeight: 800, color: "#24364a" }}>
                  {text.interestsTitle}
                </div>
                <p style={{ color: "#718095", fontSize: "13px", lineHeight: "1.65", margin: "0 0 16px" }}>
                  {text.interestsDescription}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                  {interestOptions.map((interest) => {
                    const selected = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        className="kf-get-started-interest"
                        data-selected={selected ? "true" : "false"}
                        onClick={() => toggleInterest(interest)}
                        style={{
                          textAlign: "left",
                          background: selected ? "#fff3e6" : "rgba(255,255,255,0.78)",
                          color: selected ? "#d96200" : "#526274",
                          border: selected ? "1px solid #ffb36f" : "1px solid #dfe3e8",
                          borderRadius: "14px",
                          padding: "12px 13px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: selected ? "0 8px 20px rgba(255,122,0,0.08)" : "none",
                          transition: "all 160ms ease",
                        }}
                      >
                        {selected ? "✓ " : ""}{interestLabels[language][interest]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="kf-get-started-privacy"
                style={{
                  marginTop: "28px",
                  padding: "14px 16px",
                  borderRadius: "15px",
                  background: "rgba(220,238,250,0.42)",
                  border: "1px solid rgba(176,208,230,0.5)",
                  color: "#647589",
                  fontSize: "11px",
                  lineHeight: "1.65",
                }}
              >
                {text.privacyNote}
              </div>

              <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #e7e3dc" }}>
                <button
                  type="submit"
                  className="kf-get-started-submit"
                  disabled={saving}
                  style={{
                    width: "100%",
                    background: saving ? "#c47a42" : "#FF7A00",
                    color: "white",
                    border: "none",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    fontSize: "13px",
                    fontWeight: 900,
                    cursor: saving ? "not-allowed" : "pointer",
                    boxShadow: "0 12px 26px rgba(255,122,0,0.18)",
                  }}
                >
                  {saving ? text.saving : isEditing ? text.update : text.save}
                </button>
              </div>
            </div>
          </section>
        </form>

        <div className="kf-get-started-footer" style={{ textAlign: "center", marginTop: "34px", color: "#8a929a", fontSize: "11px", letterSpacing: "0.02em" }}>
          {text.footer}
        </div>
      </div>
    </main>
  );
}
