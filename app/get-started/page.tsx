"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

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

const content = {
  en: {
    profileTitle: "Your Civic Profile",
    dashboard: "← Dashboard",

    label: "KARMAFACIE · PROFILE",

    newTitle: "Tell us about yourself.",
    editTitle: "Edit your profile.",

    newDescription:
      "This helps KarmaFacie personalize your learning experience and prepare civic reports for the appropriate authority.",

    editDescription:
      "Update your details and interests to keep your KarmaFacie profile current.",

    name: "Name",
    namePlaceholder: "Enter your name",

    mobile: "Mobile Number",
    mobilePlaceholder: "Enter your mobile number",
    mobileHelp:
      "Used to help prepare official complaint forms when required.",

    state: "State",
    statePlaceholder: "Enter your state",

    city: "City",
    cityPlaceholder: "Enter your city",

    address: "Address",
    addressPlaceholder: "Enter your residential address",
    addressHelp:
      "This can help KarmaFacie prepare address information for official grievance forms.",

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
      "Select the topics you would like to explore on KarmaFacie.",

    privacyNote:
      "Your contact and address details are stored in your KarmaFacie profile and can be used to prepare information for official civic grievance forms.",

    save: "Save Profile",
    update: "Update Profile",
    saving: "Saving...",

    loading: "Loading your profile...",

    saveError:
      "Something went wrong while saving your profile.",
    saved: "Profile saved successfully!",

    footer: "KarmaFacie · Learn. Understand. Participate.",
  },

  hi: {
    profileTitle: "आपकी नागरिक प्रोफ़ाइल",
    dashboard: "← डैशबोर्ड",

    label: "KARMAFACIE · प्रोफ़ाइल",

    newTitle: "अपने बारे में बताएं।",
    editTitle: "अपनी प्रोफ़ाइल संपादित करें।",

    newDescription:
      "इससे KarmaFacie आपके सीखने के अनुभव को आपकी आवश्यकताओं के अनुसार बेहतर बना सकता है और आपकी नागरिक शिकायतों को सही प्राधिकरण तक पहुँचाने के लिए आवश्यक जानकारी तैयार कर सकता है।",

    editDescription:
      "अपनी KarmaFacie प्रोफ़ाइल को अपडेट रखने के लिए अपनी जानकारी और रुचियों को संपादित करें।",

    name: "नाम",
    namePlaceholder: "अपना नाम दर्ज करें",

    mobile: "मोबाइल नंबर",
    mobilePlaceholder: "अपना मोबाइल नंबर दर्ज करें",
    mobileHelp:
      "आवश्यक होने पर आधिकारिक शिकायत फॉर्म तैयार करने में सहायता के लिए उपयोग किया जाता है।",

    state: "राज्य",
    statePlaceholder: "अपना राज्य दर्ज करें",

    city: "शहर",
    cityPlaceholder: "अपना शहर दर्ज करें",

    address: "पता",
    addressPlaceholder: "अपना निवास का पता दर्ज करें",
    addressHelp:
      "इससे KarmaFacie आधिकारिक शिकायत फॉर्म के लिए पते की जानकारी तैयार कर सकता है।",

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
      "वे विषय चुनें जिन्हें आप KarmaFacie पर देखना और सीखना चाहते हैं।",

    privacyNote:
      "आपकी संपर्क और पते की जानकारी आपके KarmaFacie प्रोफ़ाइल में सुरक्षित रखी जाती है और आधिकारिक नागरिक शिकायत फॉर्म के लिए आवश्यक जानकारी तैयार करने में उपयोग की जा सकती है।",

    save: "प्रोफ़ाइल सेव करें",
    update: "प्रोफ़ाइल अपडेट करें",
    saving: "सेव किया जा रहा है...",

    loading: "आपकी प्रोफ़ाइल लोड हो रही है...",

    saveError:
      "आपकी प्रोफ़ाइल सेव करते समय कुछ गलत हो गया।",
    saved: "प्रोफ़ाइल सफलतापूर्वक सेव हो गई!",

    footer: "KarmaFacie · सीखें। समझें। भाग लें।",
  },

  mr: {
    profileTitle: "तुमची नागरिक प्रोफाइल",
    dashboard: "← डॅशबोर्ड",

    label: "KARMAFACIE · प्रोफाइल",

    newTitle: "तुमच्याबद्दल सांगा.",
    editTitle: "तुमची प्रोफाइल संपादित करा.",

    newDescription:
      "यामुळे KarmaFacie तुमचा शिकण्याचा अनुभव अधिक योग्य प्रकारे तयार करू शकते आणि तुमच्या नागरिक तक्रारीसाठी योग्य प्राधिकरणाकडे आवश्यक माहिती तयार करू शकते.",

    editDescription:
      "तुमची KarmaFacie प्रोफाइल अद्ययावत ठेवण्यासाठी तुमची माहिती आणि आवडी संपादित करा.",

    name: "नाव",
    namePlaceholder: "तुमचे नाव टाका",

    mobile: "मोबाईल क्रमांक",
    mobilePlaceholder: "तुमचा मोबाईल क्रमांक टाका",
    mobileHelp:
      "आवश्यकतेनुसार अधिकृत तक्रार अर्ज तयार करण्यासाठी मदत म्हणून वापरला जातो.",

    state: "राज्य",
    statePlaceholder: "तुमचे राज्य टाका",

    city: "शहर",
    cityPlaceholder: "तुमचे शहर टाका",

    address: "पत्ता",
    addressPlaceholder: "तुमचा निवासी पत्ता टाका",
    addressHelp:
      "यामुळे KarmaFacie अधिकृत तक्रार फॉर्मसाठी पत्त्याची माहिती तयार करू शकते.",

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
      "KarmaFacie वर तुम्हाला ज्या विषयांबद्दल जाणून घ्यायचे आहे ते निवडा.",

    privacyNote:
      "तुमची संपर्क आणि पत्त्याची माहिती तुमच्या KarmaFacie प्रोफाइलमध्ये सुरक्षित ठेवली जाते आणि अधिकृत नागरिक तक्रार फॉर्मसाठी आवश्यक माहिती तयार करण्यासाठी वापरली जाऊ शकते.",

    save: "प्रोफाइल सेव्ह करा",
    update: "प्रोफाइल अपडेट करा",
    saving: "सेव्ह होत आहे...",

    loading: "तुमची प्रोफाइल लोड होत आहे...",

    saveError:
      "तुमची प्रोफाइल सेव्ह करताना काहीतरी चूक झाली.",
    saved: "प्रोफाइल यशस्वीरित्या सेव्ह झाली!",

    footer: "KarmaFacie · शिका. समजून घ्या. सहभागी व्हा.",
  },
};

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
  const [city, setCity] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
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
  // Load existing profile
  // ------------------------------------------

  const loadProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
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
      setAgeGroup(profile.age_group || "");
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
      router.push("/auth");
      return;
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
          age_group: ageGroup,
          interests,

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

    router.push("/dashboard");
  };

  // ------------------------------------------
  // Loading state
  // ------------------------------------------

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
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
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            Civic
            <span
              style={{
                color: "#ff7a00",
              }}
            >
              Quest
            </span>
          </div>

          <p
            style={{
              color: "#94a3b8",
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
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "32px 5% 70px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* ---------------------------------- */}
        {/* HEADER */}
        {/* ---------------------------------- */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "55px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
              }}
            >
              Civic
              <span
                style={{
                  color: "#ff7a00",
                }}
              >
                Quest
              </span>
            </div>

            <div
              style={{
                color: "#94a3b8",
                marginTop: "5px",
              }}
            >
              {text.profileTitle}
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "12px 20px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {text.dashboard}
          </button>
        </header>

        {/* ---------------------------------- */}
        {/* HERO */}
        {/* ---------------------------------- */}

        <section
          style={{
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            {text.label}
          </div>

          <h1
            style={{
              fontSize: "44px",
              lineHeight: "1.15",
              fontWeight: "800",
              margin: "0 0 15px",
            }}
          >
            {isEditing
              ? text.editTitle
              : text.newTitle}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "17px",
              lineHeight: "1.7",
              maxWidth: "700px",
              margin: 0,
            }}
          >
            {isEditing
              ? text.editDescription
              : text.newDescription}
          </p>
        </section>

        {/* ---------------------------------- */}
        {/* FORM */}
        {/* ---------------------------------- */}

        <form onSubmit={handleSave}>
          <section
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "24px",
              padding: "30px",
            }}
          >
            {/* -------------------------------- */}
            {/* NAME */}
            {/* -------------------------------- */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <label
                htmlFor="name"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.name}
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={text.namePlaceholder}
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#020617",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 15px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* -------------------------------- */}
            {/* MOBILE NUMBER */}
            {/* -------------------------------- */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <label
                htmlFor="mobile"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.mobile}
              </label>

              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value)
                }
                placeholder={text.mobilePlaceholder}
                inputMode="numeric"
                maxLength={15}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#020617",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 15px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />

              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "7px",
                }}
              >
                {text.mobileHelp}
              </div>
            </div>

            {/* -------------------------------- */}
            {/* STATE + CITY */}
            {/* -------------------------------- */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div>
                <label
                  htmlFor="state"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {text.state}
                </label>

                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  placeholder={text.statePlaceholder}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#020617",
                    color: "white",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "14px 15px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {text.city}
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder={text.cityPlaceholder}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#020617",
                    color: "white",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "14px 15px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* -------------------------------- */}
            {/* ADDRESS */}
            {/* -------------------------------- */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <label
                htmlFor="address"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.address}
              </label>

              <textarea
                id="address"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder={text.addressPlaceholder}
                rows={4}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#020617",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 15px",
                  fontSize: "15px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />

              <div
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "7px",
                }}
              >
                {text.addressHelp}
              </div>
            </div>

            {/* -------------------------------- */}
            {/* HOUSE NUMBER */}
            {/* -------------------------------- */}

            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <label
                htmlFor="houseNo"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.houseNo}
              </label>

              <input
                id="houseNo"
                type="text"
                value={houseNo}
                onChange={(event) =>
                  setHouseNo(event.target.value)
                }
                placeholder={text.houseNoPlaceholder}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#020617",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 15px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>

            {/* -------------------------------- */}
            {/* ZONE + WARD */}
            {/* -------------------------------- */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div>
                <label
                  htmlFor="zone"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {text.zone}
                </label>

                <input
                  id="zone"
                  type="text"
                  value={zone}
                  onChange={(event) =>
                    setZone(event.target.value)
                  }
                  placeholder={text.zonePlaceholder}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#020617",
                    color: "white",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "14px 15px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="ward"
                  style={{
                    display: "block",
                    marginBottom: "9px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {text.ward}
                </label>

                <input
                  id="ward"
                  type="text"
                  value={ward}
                  onChange={(event) =>
                    setWard(event.target.value)
                  }
                  placeholder={text.wardPlaceholder}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#020617",
                    color: "white",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "14px 15px",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* -------------------------------- */}
            {/* AGE GROUP */}
            {/* -------------------------------- */}

            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <label
                htmlFor="ageGroup"
                style={{
                  display: "block",
                  marginBottom: "9px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.ageGroup}
              </label>

              <select
                id="ageGroup"
                value={ageGroup}
                onChange={(event) =>
                  setAgeGroup(event.target.value)
                }
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#020617",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  padding: "14px 15px",
                  fontSize: "15px",
                  outline: "none",
                }}
              >
                <option value="">
                  {text.selectAgeGroup}
                </option>

                {[
                  "Under 18",
                  "18-25",
                  "26-35",
                  "36-45",
                  "46-60",
                  "60+",
                ].map((value) => (
                  <option key={value} value={value}>
                    {ageGroupLabels[language][value]}
                  </option>
                ))}
              </select>
            </div>

            {/* -------------------------------- */}
            {/* INTERESTS */}
            {/* -------------------------------- */}

            <div>
              <div
                style={{
                  marginBottom: "8px",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {text.interestsTitle}
              </div>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0 0 18px",
                }}
              >
                {text.interestsDescription}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "10px",
                }}
              >
                {interestOptions.map((interest) => {
                  const selected =
                    interests.includes(interest);

                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() =>
                        toggleInterest(interest)
                      }
                      style={{
                        textAlign: "left",
                        background: selected
                          ? "rgba(255,122,0,0.12)"
                          : "#020617",
                        color: selected
                          ? "#ff7a00"
                          : "#cbd5e1",
                        border: selected
                          ? "1px solid #ff7a00"
                          : "1px solid #334155",
                        borderRadius: "12px",
                        padding: "13px 14px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      {selected ? "✓ " : ""}
                      {interestLabels[language][interest]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------- */}
            {/* PRIVACY NOTE */}
            {/* -------------------------------- */}

            <div
              style={{
                marginTop: "30px",
                padding: "14px 16px",
                borderRadius: "12px",
                background:
                  "rgba(96,165,250,0.05)",
                border:
                  "1px solid rgba(96,165,250,0.12)",
                color: "#94a3b8",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              {text.privacyNote}
            </div>

            {/* -------------------------------- */}
            {/* SAVE */}
            {/* -------------------------------- */}

            <div
              style={{
                marginTop: "35px",
                paddingTop: "25px",
                borderTop: "1px solid #1e293b",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  background: saving
                    ? "#7c3f00"
                    : "#ff7a00",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "15px 20px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {saving
                  ? text.saving
                  : isEditing
                    ? text.update
                    : text.save}
              </button>
            </div>
          </section>
        </form>

        {/* ---------------------------------- */}
        {/* FOOTER */}
        {/* ---------------------------------- */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {text.footer}
        </div>
      </div>
    </main>
  );
}