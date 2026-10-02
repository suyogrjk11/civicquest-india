"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalBody = {
  id: string;
  lgd_code: number | null;
  state: string;
  district: string | null;
  local_body_name: string;
  local_body_name_local: string | null;
  local_body_type: string | null;
  source_name: string | null;
  pincode_codes?: string[] | null;
};

type MaharashtraDistrict = {
  id: string;
  lgd_district_code: number;
  district_name: string;
};

type MaharashtraTaluka = {
  id: string;
  district_id: string;
  lgd_subdistrict_code: number;
  district_name: string;
  taluka_name: string;
};

type MaharashtraLocalBodyTaluka = {
  local_body_id: string;
  taluka_id: string;
};

type MaharashtraPincode = {
  id: string;
  pincode: string;
  district_id: string | null;
  taluka_id: string | null;
  district_name: string | null;
  taluka_name: string | null;
};

type MaharashtraLocalBodyPincode = {
  local_body_id: string;
  pincode_id: string;
};

type MaharashtraWard = {
  local_body_id: string;
  lgd_ward_code: number;
  ward_number: string | null;
  ward_name: string;
};

type ProfileLocation = {
  state: string | null;
  city: string | null;
  pincode: string | null;
  ward: string | null;
  zone: string | null;
  local_body_id: string | null;
};

type AuthorityRoute = {
  id: number;
  city: string | null;
  state: string | null;
  authority_name: string | null;
  department_name: string | null;
  issue_category: string | null;
  grievance_url: string | null;
  official_source_url: string | null;
  submission_method: string | null;
  notes: string | null;
  is_active: boolean | null;
};

type PublicAreaAuthority = {
  id: number;
  local_body_id: string | null;
  state: string;
  district: string | null;
  city: string | null;
  authority_type: string;
  authority_name: string;
  office_title: string | null;
  office_holder_name: string | null;
  jurisdiction_description: string | null;
  official_source_url: string | null;
  source_name: string | null;
  source_checked_at: string | null;
  notes: string | null;
  is_active: boolean;
};

type ElectedRepresentative = {
  id: number;
  local_body_id: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  pincode: string | null;
  jurisdiction_level: "MUNICIPAL" | "WARD" | "ASSEMBLY" | "LOK_SABHA" | "OTHER";
  office_title: string;
  constituency_name: string | null;
  constituency_code: string | null;
  ward_name: string | null;
  ward_number: string | null;
  representative_name: string;
  political_party: string | null;
  election_year: number | null;
  official_source_url: string | null;
  source_name: string | null;
  source_checked_at: string | null;
  notes: string | null;
  is_active: boolean | null;
};

type SearchMode = "profile" | "manual" | "current";

const LOCATION_ALIASES: Record<string, string[]> = {
  "chhatrapati sambhajinagar": [
    "Chhatrapati Sambhajinagar",
    "Aurangabad",
    "Aurangabad Municipal Corporation",
    "Chh. Sambhajinagar",
    "Chhatrapati Sambhaji Nagar",
  ],
  aurangabad: [
    "Aurangabad",
    "Chhatrapati Sambhajinagar",
    "Aurangabad Municipal Corporation",
    "Chh. Sambhajinagar",
    "Chhatrapati Sambhaji Nagar",
  ],
};

function normalizeLocationName(value: string | null | undefined) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function canonicalLocationKey(value: string | null | undefined) {
  const normalized = normalizeLocationName(value);
  if (
    normalized === "aurangabad" ||
    normalized === "aurangabadmunicipalcorporation" ||
    normalized === "chhatsambhajinagar" ||
    normalized === "chhatrapatisambhajinagar" ||
    normalized === "chhatrapatisambhajinagarmunicipalcorporation"
  ) {
    return "chhatrapati sambhajinagar";
  }
  return normalized;
}

function locationAliases(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return [];
  return LOCATION_ALIASES[canonicalLocationKey(raw)] || [raw];
}

function displayLocationName(
  value: string | null | undefined,
  language: Language
) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (canonicalLocationKey(raw) === "chhatrapati sambhajinagar") {
    return language === "en"
      ? "Chhatrapati Sambhajinagar"
      : "छत्रपती संभाजीनगर";
  }
  return raw;
}

/*
 * Current 2026 Pune Municipal Corporation election ward-name crosswalk.
 *
 * This is intentionally separate from civic_maharashtra_wards because the
 * LGD geography master and municipal-election ward naming serve different
 * purposes. The selector uses this crosswalk for Pune when available, while
 * the LGD master remains unchanged.
 *
 * Source checked: Indian Express, "Maharashtra Municipal Corporation Election
 * Results 2026: Full Ward-Wise List", updated 19 Jan 2026.
 */
const PUNE_2026_ELECTION_WARDS: Record<string, string> = {
  "1": "Kalas-Dhanori-Lohegaon",
  "2": "Phulenagar-Nagpur Chawl",
  "3": "Vimannagar-Lohegaon",
  "4": "Kharadi-Wagholi",
  "5": "Kalyaninagar-Vadgaonsheri",
  "6": "Yerawada-Gandhinagar",
  "7": "Gokhalenagar-Wakdewadi",
  "8": "Aundh-Bopodi",
  "9": "Sus-Baner-Pashan",
  "10": "Bavdhan-Bhusari Colony",
  "11": "Rambaug Colony-Shivteerthnagar",
  "12": "Shivajinagar-Model Colony",
  "13": "Pune Station-Jay Jawannagar",
  "14": "Koregaon Park-Ghorpadi-Mundhwa",
  "15": "Manjri-Budhruk-Keshavnagar-Sadesatranali",
  "16": "Hadapsar-Satavwadi",
  "17": "Ramtekdi-Malwadi-Vaiduwadi",
  "18": "Wanowrie-Salunkhe Vihar",
  "19": "Kondhwa Khurd-Kausurbaug",
  "20": "Shankar Maharaj Math-Bibewadi",
  "21": "Mukundnagar-Salisbury Park",
  "22": "Kashewadi-Dias Plot",
  "23": "Rawiwar Peth-Nana Peth",
  "24": "Kasba Ganpati-Kamla Nehru Hospital-KEM hospital",
  "25": "Shaniwar Peth-Mahatma Phule Mandai",
  "26": "GhorpadePeth-Gurwarpeth-Samta Bhoomi",
  "27": "Navi Peth-Parvati",
  "28": "Janta Vasahat-Hingane Khurd",
  "29": "Deccan Gymkhana-Happy Colony",
  "30": "Karvenagar-Hingane Home Colony",
  "31": "Mayur Colony-Kothrud",
  "32": "Warje-Popularnagar",
  "33": "Shivane-Khadakwasla-Dhayari",
  "34": "Vadgaon Budhruk-Dhayari",
  "35": "Suncity-Manikbaug",
  "36": "Sahakarnagar-Padmavati",
  "37": "Dhankawadi-Katraj Dairy",
  "38": "Balajinagar-Ambegaon-Katraj",
  "39": "Upper Super Indiranagar",
  "40": "Kondhwa Budhruk-Yeolewadi",
  "41": "Mohammadwadi-Undri",
};

const municipalElectionWardNames = (body: LocalBody | null) => {
  if (!body) return null;

  const normalized = normalizeLocationName(body.local_body_name);
  if (
    normalized === "pune" ||
    normalized === "punemcorp" ||
    normalized === "punemunicipalcorporation"
  ) {
    return PUNE_2026_ELECTION_WARDS;
  }

  return null;
};

const copy: Record<Language, any> = {
  en: {
    eyebrow: "KRUTBHARAT · RESPONSIBLE AUTHORITIES",
    title: "Know who is responsible for your area.",
    subtitle: "Know the people and public institutions connected to your area.",
    intro:
      "Find the local government and directory-listed civic authorities connected to an area — whether it is your saved profile location, somewhere you are visiting, or another place you want to research.",
    back: "← Dashboard",
    language: "Language",

    howItWorks: "HOW THIS WORKS",
    howItWorksTitle: "Three ways to identify an area.",
    howItWorksBody:
      "Your saved profile location is the default. You can investigate another area without changing your profile, or use your device location to identify the place where you are standing right now.",
    profileMode: "My Profile",
    profileModeBody: "Use the location saved in your AUTH / My Profile.",
    manualMode: "Search Any Area",
    manualModeBody: "Choose or enter another area independently.",
    currentMode: "Use My Location",
    currentModeBody: "Detect the area where you are physically present now.",

    yourProfileLocation: "PROFILE LOCATION",
    manualSearch: "MANUAL AREA SEARCH",
    currentLocation: "CURRENT DEVICE LOCATION",
    currentLocationNote:
      "This uses your device's current location only for this search. It does not change your saved profile location.",

    yourLocation: "Your civic location",
    selectedLocation: "Selected area",
    state: "State",
    district: "District",
    municipality: "City / Municipal Corporation",
    ward: "Ward / Locality",
    taluka: "Taluka / Tehsil",
    zone: "Zone",
    pincode: "Pincode",
    locality: "Locality",
    notSet: "Not available",

    chooseArea: "Choose an area",
    chooseAreaBody:
      "Start with State → District → City / ULB. Verified taluka, pincode and ward options are then populated from the selected geography.",
    selectState: "Select State",
    selectDistrict: "Select District",
    selectCity: "Select City / ULB",
    selectPincode: "Select Pincode",
    enterLocality: "Enter locality / ward",
    selectWard: "Select Ward / Locality",
    loadingWards: "Loading wards…",
    noWardOptions: "No verified wards available",
    enterTaluka: "Enter taluka / tehsil",
    searchArea: "Search this area",
    clearSearch: "Clear",

    useMyLocation: "Use My Location",
    detectingLocation: "Detecting location…",
    detected: "Current device location detected. Review the area below.",
    locationDenied:
      "Location access was denied. Select an area manually instead.",
    locationUnavailable:
      "Your device location could not be detected. Select an area manually instead.",
    locationLookupError:
      "We could not resolve your device location. Select the area manually instead.",
    locationOutsideIndia: "This location is outside India.",

    profileDefault: "Default: your saved profile location",
    manualIndependent:
      "Independent search: your saved profile location will not be changed.",
    currentIndependent:
      "Live location: this search is temporary and does not change your profile.",

    responsibleAuthorities: "Responsible authorities",
    responsibleAuthoritiesIntro:
      "The local government below is identified from KrutBharat's canonical Local Government Directory (LGD) data. Directory-listed authorities are shown separately when an active authority-directory route exists for the selected area.",
    representativesLabel: "PEOPLE WHO REPRESENT THIS AREA",
    representativesTitle: "Elected representatives",
    representativesBody:
      "Where verified records are available, see the applicable municipal / ward representatives, MLA and MP — including political party, constituency and election year.",
    municipalRepresentatives: "Municipal / Ward representatives",
    municipalRepresentativesBody:
      "Local elected representatives mapped to the selected municipal or ward area.",
    selectWardForRepresentatives: "Select a ward / locality to view its ward representatives.",
    mlaLabel: "MLA",
    mlaBody: "Representative of the Assembly constituency covering this area.",
    mpLabel: "MP",
    mpBody: "Representative of the Lok Sabha constituency covering this area.",
    representative: "Representative",
    party: "Political party",
    constituency: "Constituency",
    electionYear: "Election year",
    sourceLabel: "Source",
    wardDetails: "Ward",
    noRepresentative: "No verified representative record is available for this area yet.",
    noRepresentativeBody:
      "KrutBharat does not guess names, parties or constituency assignments. Verified records appear here when available.",
    politicalNeutral: "INFORMATIONAL · POLITICALLY NEUTRAL",
    politicalNeutralTitle:
      "Know the people. Know the institutions. Make your own judgment.",
    politicalNeutralBody:
      "KrutBharat presents factual area, representative and authority information. It does not rate performance, endorse or oppose representatives or political parties, or tell citizens whom to vote for.",
    localGovernment: "Local government identified",
    localGovernmentBody:
      "This is the municipal / urban local-government layer identified for the selected area. Exact responsibility can still vary by the asset, road, service network or another government agency.",
    authorityDirectory: "Directory-listed civic authorities",
    publicAuthorities: "Public authorities & administrative bodies",
    publicAuthoritiesTitle: "Who governs this area?",
    publicAuthoritiesBody:
      "Current public authorities and administrative bodies relevant to the selected geography. Office-holder details are shown only when verified against an official source.",
    authorityType: "Authority",
    office: "Office",
    officeHolder: "Current office holder",
    jurisdiction: "Jurisdiction",
    verifiedOn: "Checked",
    noPublicAuthorities:
      "No current public-authority record is available for this exact area yet.",
    noPublicAuthoritiesBody:
      "KrutBharat will not guess office holders. Verified records are added from official government sources.",

    authorityDirectoryBody:
      "These entries come from KrutBharat's authority directory and may cover different civic issue categories. The same authority is grouped together when it appears across multiple categories.",
    noAuthorities:
      "No active authority-directory entries were found for this exact area yet.",
    noAuthoritiesBody:
      "The local government can still be identified from LGD. For an actual civic complaint, use KrutBharat's Report an Issue and Smart Handoff flow.",
    department: "Department",
    covers: "Civic areas",
    officialRoute: "Official route",
    source: "Source",
    website: "Official source",
    route: "Grievance route",
    notes: "Notes",

    responsibilityTitle: "What this local government may handle",
    responsibilityIntro:
      "These are broad civic responsibility areas. Exact responsibility can vary by jurisdiction and by the asset involved.",
    roads: "Roads & public infrastructure",
    roadsBody:
      "Local roads and related civic infrastructure may fall under the local government, subject to ownership or control by another agency.",
    waste: "Waste & cleanliness",
    wasteBody:
      "Municipal solid-waste collection, cleanliness services and related local civic operations are commonly handled at the local-government level.",
    water: "Water & sewerage",
    waterBody:
      "Water supply, drainage and sewerage responsibilities depend on the local service arrangement and the authority operating the network.",
    lighting: "Street lighting",
    lightingBody:
      "Street-lighting maintenance can fall under the local government or another designated agency depending on the asset and jurisdiction.",
    publicSpaces: "Public spaces",
    publicSpacesBody:
      "Maintenance of municipal public spaces and local civic amenities may be handled by the local government.",
    property: "Public property",
    propertyBody:
      "Local public assets can be maintained by the municipality or another government agency depending on ownership.",

    reportingNote: "Need to report something?",
    reportingNoteBody:
      "This page helps you understand responsibility. When you want to submit a civic issue, use KrutBharat's existing Report an Issue and Smart Handoff flows.",
    openReport: "Report a civic issue →",

    locationDataSource: "LOCATION DATA SOURCE",
    locationDataSourceBody:
      "Local government identity comes from KrutBharat's LGD-based local-body master. Profile location remains separate from manual and current-location searches.",
    lgd: "LGD",

    footer: "© 2026 KrutBharat · by KarmaFacie Corporation",
  },

  hi: {
    eyebrow: "KRUTBHARAT · जिम्मेदार प्राधिकरण",
    title: "जानें कि आपके क्षेत्र के लिए कौन जिम्मेदार है।",
    subtitle: "अपने क्षेत्र से जुड़े लोगों और सार्वजनिक संस्थाओं को जानें।",
    intro:
      "किसी भी क्षेत्र से जुड़े स्थानीय निकाय और उपलब्ध नागरिक प्राधिकरण खोजें — चाहे वह आपकी प्रोफ़ाइल लोकेशन हो, आपकी यात्रा का स्थान हो या कोई दूसरा क्षेत्र।",
    back: "← डैशबोर्ड",
    language: "भाषा",

    howItWorks: "यह कैसे काम करता है",
    howItWorksTitle: "क्षेत्र पहचानने के तीन तरीके।",
    howItWorksBody:
      "आपकी प्रोफ़ाइल में सेव लोकेशन डिफ़ॉल्ट है। आप अपनी प्रोफ़ाइल बदले बिना किसी दूसरे क्षेत्र को खोज सकते हैं या अभी जहाँ खड़े हैं वहाँ की लोकेशन का उपयोग कर सकते हैं।",
    profileMode: "मेरी प्रोफ़ाइल",
    profileModeBody: "AUTH / प्रोफ़ाइल में सेव लोकेशन का उपयोग करें।",
    manualMode: "किसी भी क्षेत्र को खोजें",
    manualModeBody: "किसी दूसरे क्षेत्र को स्वतंत्र रूप से चुनें या दर्ज करें।",
    currentMode: "मेरी लोकेशन इस्तेमाल करें",
    currentModeBody: "इस समय आप जहाँ मौजूद हैं वहाँ का क्षेत्र पहचानें।",

    yourProfileLocation: "प्रोफ़ाइल लोकेशन",
    manualSearch: "मैनुअल क्षेत्र खोज",
    currentLocation: "वर्तमान डिवाइस लोकेशन",
    currentLocationNote:
      "यह आपकी डिवाइस की वर्तमान लोकेशन का उपयोग केवल इस खोज के लिए करता है। आपकी प्रोफ़ाइल लोकेशन नहीं बदलेगी।",

    yourLocation: "आपका नागरिक क्षेत्र",
    selectedLocation: "चयनित क्षेत्र",
    state: "राज्य",
    district: "जिला",
    municipality: "शहर / नगरपालिका",
    ward: "वार्ड / स्थानीयता",
    taluka: "तालुका / तहसील",
    zone: "ज़ोन",
    pincode: "पिनकोड",
    locality: "स्थानीयता",
    notSet: "उपलब्ध नहीं",

    chooseArea: "क्षेत्र चुनें",
    chooseAreaBody:
      "राज्य → जिला → शहर / ULB चुनें। इसके बाद सत्यापित तालुका, पिनकोड और वार्ड विकल्प चुनी गई भूगोल जानकारी के अनुसार दिखेंगे।",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    selectCity: "शहर / ULB चुनें",
    selectPincode: "पिनकोड चुनें",
    enterLocality: "स्थानीयता / वार्ड दर्ज करें",
    selectWard: "वार्ड / स्थानीयता चुनें",
    loadingWards: "वार्ड लोड हो रहे हैं…",
    noWardOptions: "सत्यापित वार्ड उपलब्ध नहीं हैं",
    enterTaluka: "तालुका / तहसील दर्ज करें",
    searchArea: "इस क्षेत्र को खोजें",
    clearSearch: "साफ़ करें",

    useMyLocation: "मेरी लोकेशन इस्तेमाल करें",
    detectingLocation: "लोकेशन पहचान रहे हैं…",
    detected: "वर्तमान डिवाइस लोकेशन मिल गई। नीचे दिए क्षेत्र की समीक्षा करें।",
    locationDenied:
      "लोकेशन की अनुमति नहीं मिली। इसके बजाय क्षेत्र को मैनुअली चुनें।",
    locationUnavailable:
      "डिवाइस लोकेशन नहीं मिल सकी। इसके बजाय क्षेत्र को मैनुअली चुनें।",
    locationLookupError:
      "डिवाइस लोकेशन को क्षेत्र में बदला नहीं जा सका। क्षेत्र मैनुअली चुनें।",
    locationOutsideIndia: "यह लोकेशन भारत के बाहर है।",

    profileDefault: "डिफ़ॉल्ट: आपकी सेव प्रोफ़ाइल लोकेशन",
    manualIndependent:
      "स्वतंत्र खोज: आपकी सेव प्रोफ़ाइल लोकेशन में कोई बदलाव नहीं होगा।",
    currentIndependent:
      "लाइव लोकेशन: यह खोज अस्थायी है और प्रोफ़ाइल नहीं बदलेगी।",

    responsibleAuthorities: "जिम्मेदार प्राधिकरण",
    responsibleAuthoritiesIntro:
      "नीचे का स्थानीय निकाय KrutBharat के LGD आधारित डेटा से पहचाना जाता है। चुने गए क्षेत्र के लिए सक्रिय authority-directory route मिलने पर वे अलग से दिखाए जाते हैं।",
    representativesLabel: "इस क्षेत्र का प्रतिनिधित्व करने वाले लोग",
    representativesTitle: "निर्वाचित प्रतिनिधि",
    representativesBody:
      "जहाँ सत्यापित रिकॉर्ड उपलब्ध हों, वहाँ नगरपालिका / वार्ड प्रतिनिधि, MLA और MP — राजनीतिक दल, निर्वाचन क्षेत्र और चुनाव-वर्ष सहित — देखें।",
    municipalRepresentatives: "नगरपालिका / वार्ड प्रतिनिधि",
    municipalRepresentativesBody:
      "चुने गए नगरपालिका या वार्ड क्षेत्र से जुड़े निर्वाचित स्थानीय प्रतिनिधि।",
    selectWardForRepresentatives: "वार्ड प्रतिनिधियों को देखने के लिए पहले वार्ड / स्थानीयता चुनें।",
    mlaLabel: "MLA",
    mlaBody: "इस क्षेत्र को कवर करने वाले विधानसभा निर्वाचन क्षेत्र के प्रतिनिधि।",
    mpLabel: "MP",
    mpBody: "इस क्षेत्र को कवर करने वाले लोकसभा निर्वाचन क्षेत्र के प्रतिनिधि।",
    representative: "प्रतिनिधि",
    party: "राजनीतिक दल",
    constituency: "निर्वाचन क्षेत्र",
    electionYear: "चुनाव वर्ष",
    sourceLabel: "स्रोत",
    wardDetails: "वार्ड",
    noRepresentative: "इस क्षेत्र के लिए अभी सत्यापित प्रतिनिधि रिकॉर्ड उपलब्ध नहीं है।",
    noRepresentativeBody:
      "KrutBharat नाम, दल या निर्वाचन क्षेत्र का अनुमान नहीं लगाता। सत्यापित रिकॉर्ड उपलब्ध होने पर वे यहाँ दिखाई देंगे।",
    politicalNeutral: "सूचनात्मक · राजनीतिक रूप से तटस्थ",
    politicalNeutralTitle:
      "लोगों को जानें। संस्थाओं को जानें। अपना निष्कर्ष स्वयं बनाएं।",
    politicalNeutralBody:
      "KrutBharat क्षेत्र, प्रतिनिधि और प्राधिकरण से संबंधित तथ्यात्मक जानकारी प्रस्तुत करता है। यह प्रदर्शन की रेटिंग, समर्थन या विरोध, या वोट किसे दें यह नहीं बताता।",
    localGovernment: "पहचानी गई स्थानीय सरकार",
    localGovernmentBody:
      "यह चुने गए क्षेत्र के लिए पहचाना गया नगरपालिका / शहरी स्थानीय निकाय है। किसी संपत्ति, सड़क, सेवा नेटवर्क या अन्य सरकारी एजेंसी के कारण सटीक जिम्मेदारी अलग हो सकती है।",
    authorityDirectory: "डायरेक्टरी में सूचीबद्ध नागरिक प्राधिकरण",
    publicAuthorities: "सार्वजनिक प्राधिकरण और प्रशासनिक संस्थाएँ",
    publicAuthoritiesTitle: "इस क्षेत्र का शासन कौन करता है?",
    publicAuthoritiesBody:
      "चयनित क्षेत्र से संबंधित वर्तमान सार्वजनिक प्राधिकरण और प्रशासनिक संस्थाएँ। पदाधिकारी की जानकारी केवल आधिकारिक स्रोत से सत्यापन होने पर दिखाई जाती है।",
    authorityType: "प्राधिकरण",
    office: "पद",
    officeHolder: "वर्तमान पदाधिकारी",
    jurisdiction: "अधिकार क्षेत्र",
    verifiedOn: "सत्यापन",
    noPublicAuthorities:
      "इस सटीक क्षेत्र के लिए अभी वर्तमान सार्वजनिक प्राधिकरण का सत्यापित रिकॉर्ड उपलब्ध नहीं है।",
    noPublicAuthoritiesBody:
      "KrutBharat पदाधिकारी का अनुमान नहीं लगाता। सत्यापित रिकॉर्ड आधिकारिक सरकारी स्रोतों से जोड़े जाते हैं।",

    authorityDirectoryBody:
      "ये प्रविष्टियाँ KrutBharat की authority directory से आती हैं और अलग-अलग नागरिक समस्या श्रेणियों को कवर कर सकती हैं। एक ही प्राधिकरण को कई श्रेणियों में दिखने पर समूहित किया जाता है।",
    noAuthorities:
      "इस सटीक क्षेत्र के लिए अभी कोई सक्रिय authority-directory entry नहीं मिली।",
    noAuthoritiesBody:
      "स्थानीय निकाय की पहचान LGD से फिर भी की जा सकती है। वास्तविक शिकायत के लिए Report an Issue और Smart Handoff का उपयोग करें।",
    department: "विभाग",
    covers: "नागरिक क्षेत्र",
    officialRoute: "आधिकारिक मार्ग",
    source: "स्रोत",
    website: "आधिकारिक स्रोत",
    route: "शिकायत मार्ग",
    notes: "नोट्स",

    responsibilityTitle: "यह स्थानीय सरकार किन चीज़ों को संभाल सकती है",
    responsibilityIntro:
      "ये व्यापक नागरिक जिम्मेदारी क्षेत्र हैं। सटीक जिम्मेदारी क्षेत्र और संबंधित संपत्ति के आधार पर बदल सकती है।",
    roads: "सड़कें और सार्वजनिक बुनियादी ढांचा",
    roadsBody:
      "स्थानीय सड़कें और संबंधित नागरिक बुनियादी ढांचा स्थानीय निकाय के अंतर्गत हो सकता है, लेकिन स्वामित्व या नियंत्रण किसी अन्य एजेंसी के पास हो सकता है।",
    waste: "कचरा और स्वच्छता",
    wasteBody:
      "नगरपालिका ठोस कचरा संग्रहण, स्वच्छता सेवाएँ और संबंधित स्थानीय संचालन सामान्यतः स्थानीय सरकार के स्तर पर संभाले जाते हैं।",
    water: "पानी और सीवरेज",
    waterBody:
      "जल आपूर्ति, जल निकासी और सीवरेज की जिम्मेदारी स्थानीय सेवा व्यवस्था और नेटवर्क संचालित करने वाली संस्था पर निर्भर करती है।",
    lighting: "स्ट्रीट लाइट",
    lightingBody:
      "स्ट्रीट लाइट का रखरखाव स्थानीय निकाय या किसी अन्य निर्धारित एजेंसी के पास हो सकता है।",
    publicSpaces: "सार्वजनिक स्थान",
    publicSpacesBody:
      "नगरपालिका के सार्वजनिक स्थानों और स्थानीय नागरिक सुविधाओं का रखरखाव स्थानीय निकाय द्वारा किया जा सकता है।",
    property: "सार्वजनिक संपत्ति",
    propertyBody:
      "स्थानीय सार्वजनिक संपत्तियों का रखरखाव स्वामित्व के आधार पर नगरपालिका या किसी अन्य सरकारी संस्था द्वारा किया जा सकता है।",

    reportingNote: "कुछ रिपोर्ट करना है?",
    reportingNoteBody:
      "यह पेज जिम्मेदारी समझने में मदद करता है। शिकायत दर्ज करने के लिए KrutBharat के Report an Issue और Smart Handoff विकल्पों का उपयोग करें।",
    openReport: "नागरिक समस्या रिपोर्ट करें →",

    locationDataSource: "लोकेशन डेटा का स्रोत",
    locationDataSourceBody:
      "स्थानीय निकाय की पहचान KrutBharat के LGD आधारित local-body master से आती है। प्रोफ़ाइल लोकेशन, मैनुअल और वर्तमान-लोकेशन खोजों से अलग रहती है।",
    lgd: "LGD",

    footer: "© 2026 KrutBharat · by KarmaFacie Corporation",
  },

  mr: {
    eyebrow: "KRUTBHARAT · जबाबदार प्राधिकरण",
    title: "तुमच्या परिसरासाठी कोण जबाबदार आहे ते जाणून घ्या.",
    subtitle: "तुमच्या परिसराशी संबंधित लोक आणि सार्वजनिक संस्था जाणून घ्या.",
    intro:
      "कोणत्याही परिसराशी संबंधित स्थानिक संस्था आणि उपलब्ध नागरी प्राधिकरण शोधा — तुमचे प्रोफाइल लोकेशन, प्रवासातील ठिकाण किंवा इतर कोणताही परिसर असो.",
    back: "← डॅशबोर्ड",
    language: "भाषा",

    howItWorks: "हे कसे काम करते",
    howItWorksTitle: "परिसर ओळखण्याचे तीन मार्ग.",
    howItWorksBody:
      "तुमच्या प्रोफाइलमध्ये सेव्ह केलेले लोकेशन डिफॉल्ट असते. प्रोफाइल न बदलता दुसरा परिसर शोधू शकता किंवा तुम्ही आत्ता जिथे उभे आहात ते लोकेशन वापरू शकता.",
    profileMode: "माझे प्रोफाइल",
    profileModeBody: "AUTH / प्रोफाइलमध्ये सेव्ह केलेले लोकेशन वापरा.",
    manualMode: "कोणताही परिसर शोधा",
    manualModeBody: "दुसरा परिसर स्वतंत्रपणे निवडा किंवा नोंदवा.",
    currentMode: "माझे लोकेशन वापरा",
    currentModeBody: "तुम्ही सध्या जिथे आहात तो परिसर ओळखा.",

    yourProfileLocation: "प्रोफाइल लोकेशन",
    manualSearch: "मॅन्युअल परिसर शोध",
    currentLocation: "सध्याचे डिव्हाइस लोकेशन",
    currentLocationNote:
      "हे तुमच्या डिव्हाइसचे सध्याचे लोकेशन फक्त या शोधासाठी वापरते. तुमचे प्रोफाइल लोकेशन बदलत नाही.",

    yourLocation: "तुमचा नागरी परिसर",
    selectedLocation: "निवडलेला परिसर",
    state: "राज्य",
    district: "जिल्हा",
    municipality: "शहर / महानगरपालिका",
    ward: "प्रभाग / स्थानिकता",
    taluka: "तालुका / तहसील",
    zone: "झोन",
    pincode: "पिनकोड",
    locality: "स्थानिकता",
    notSet: "उपलब्ध नाही",

    chooseArea: "परिसर निवडा",
    chooseAreaBody:
      "राज्य → जिल्हा → शहर / ULB निवडा. त्यानंतर निवडलेल्या शहर / ULB चे उपलब्ध पिनकोड आणि सत्यापित प्रभाग आपोआप दिसतील.",
    selectState: "राज्य निवडा",
    selectDistrict: "जिल्हा निवडा",
    selectCity: "शहर / ULB निवडा",
    selectPincode: "पिनकोड निवडा",
    enterLocality: "स्थानिकता / प्रभाग नोंदवा",
    selectWard: "प्रभाग / स्थानिकता निवडा",
    loadingWards: "प्रभाग लोड होत आहेत…",
    noWardOptions: "सत्यापित प्रभाग उपलब्ध नाहीत",
    enterTaluka: "तालुका / तहसील नोंदवा",
    searchArea: "हा परिसर शोधा",
    clearSearch: "साफ करा",

    useMyLocation: "माझे लोकेशन वापरा",
    detectingLocation: "लोकेशन ओळखत आहे…",
    detected: "सध्याचे डिव्हाइस लोकेशन सापडले. खालील परिसर तपासा.",
    locationDenied:
      "लोकेशनची परवानगी नाकारली. त्याऐवजी परिसर मॅन्युअली निवडा.",
    locationUnavailable:
      "डिव्हाइस लोकेशन सापडले नाही. त्याऐवजी परिसर मॅन्युअली निवडा.",
    locationLookupError:
      "डिव्हाइस लोकेशनचा परिसर ठरवता आला नाही. परिसर मॅन्युअली निवडा.",
    locationOutsideIndia: "हे लोकेशन भारताबाहेर आहे.",

    profileDefault: "डिफॉल्ट: तुमचे सेव्ह केलेले प्रोफाइल लोकेशन",
    manualIndependent:
      "स्वतंत्र शोध: तुमच्या सेव्ह केलेल्या प्रोफाइल लोकेशनमध्ये बदल होणार नाही.",
    currentIndependent:
      "लाइव्ह लोकेशन: हा शोध तात्पुरता आहे आणि प्रोफाइल बदलत नाही.",

    responsibleAuthorities: "जबाबदार प्राधिकरण",
    responsibleAuthoritiesIntro:
      "खालील स्थानिक संस्था KrutBharat च्या LGD आधारित डेटावरून ओळखली जाते. निवडलेल्या परिसरासाठी सक्रिय authority-directory route उपलब्ध असल्यास ते स्वतंत्रपणे दाखवले जातात.",
    representativesLabel: "या परिसराचे प्रतिनिधित्व करणारे लोक",
    representativesTitle: "निवडून आलेले प्रतिनिधी",
    representativesBody:
      "सत्यापित नोंदी उपलब्ध असल्यास महानगरपालिका / प्रभाग प्रतिनिधी, MLA आणि MP — राजकीय पक्ष, मतदारसंघ आणि निवडणूक वर्षासह — पाहा.",
    municipalRepresentatives: "महानगरपालिका / प्रभाग प्रतिनिधी",
    municipalRepresentativesBody:
      "निवडलेल्या महानगरपालिका किंवा प्रभाग क्षेत्राशी संबंधित स्थानिक प्रतिनिधी.",
    selectWardForRepresentatives: "प्रभाग प्रतिनिधी पाहण्यासाठी प्रथम प्रभाग / स्थानिकता निवडा.",
    mlaLabel: "MLA",
    mlaBody: "या परिसराचा समावेश असलेल्या विधानसभा मतदारसंघाचा प्रतिनिधी.",
    mpLabel: "MP",
    mpBody: "या परिसराचा समावेश असलेल्या लोकसभा मतदारसंघाचा प्रतिनिधी.",
    representative: "प्रतिनिधी",
    party: "राजकीय पक्ष",
    constituency: "मतदारसंघ",
    electionYear: "निवडणूक वर्ष",
    sourceLabel: "स्रोत",
    wardDetails: "प्रभाग",
    noRepresentative: "या परिसरासाठी अद्याप सत्यापित प्रतिनिधी नोंद उपलब्ध नाही.",
    noRepresentativeBody:
      "KrutBharat नाव, पक्ष किंवा मतदारसंघाचा अंदाज लावत नाही. सत्यापित नोंदी उपलब्ध झाल्यावर त्या येथे दिसतील.",
    politicalNeutral: "माहितीपर · राजकीयदृष्ट्या तटस्थ",
    politicalNeutralTitle:
      "लोकांना जाणून घ्या. संस्था जाणून घ्या. स्वतःचे मत स्वतः ठरवा.",
    politicalNeutralBody:
      "KrutBharat परिसर, प्रतिनिधी आणि प्राधिकरणांची तथ्यात्मक माहिती दाखवते. हे कामगिरीचे रेटिंग, समर्थन किंवा विरोध किंवा कोणाला मत द्यावे हे सांगत नाही.",
    localGovernment: "ओळखलेले स्थानिक सरकार",
    localGovernmentBody:
      "निवडलेल्या परिसरासाठी ओळखलेली महानगरपालिका / शहरी स्थानिक स्वराज्य संस्था येथे दाखवली आहे. मालमत्ता, रस्ता, सेवा नेटवर्क किंवा इतर सरकारी संस्थेमुळे अचूक जबाबदारी बदलू शकते.",
    authorityDirectory: "डायरेक्टरीमधील नागरी प्राधिकरण",
    publicAuthorities: "सार्वजनिक प्राधिकरण आणि प्रशासकीय संस्था",
    publicAuthoritiesTitle: "या परिसराचे प्रशासन कोण करते?",
    publicAuthoritiesBody:
      "निवडलेल्या परिसराशी संबंधित सध्याचे सार्वजनिक प्राधिकरण आणि प्रशासकीय संस्था. पदाधिकाऱ्यांची माहिती अधिकृत स्रोतावरून सत्यापित झाल्यावरच दाखवली जाते.",
    authorityType: "प्राधिकरण",
    office: "पद",
    officeHolder: "सध्याचे पदाधिकारी",
    jurisdiction: "अधिकार क्षेत्र",
    verifiedOn: "तपासले",
    noPublicAuthorities:
      "या नेमक्या परिसरासाठी सध्याच्या सार्वजनिक प्राधिकरणाची सत्यापित नोंद अद्याप उपलब्ध नाही.",
    noPublicAuthoritiesBody:
      "KrutBharat पदाधिकाऱ्यांचा अंदाज लावत नाही. अधिकृत सरकारी स्रोतांवरून सत्यापित नोंदी जोडल्या जातात.",

    authorityDirectoryBody:
      "या नोंदी KrutBharat च्या authority directory मधून येतात आणि विविध नागरी समस्या प्रकारांशी संबंधित असू शकतात. एकच प्राधिकरण अनेक प्रकारांमध्ये असल्यास ते एकत्र दाखवले जाते.",
    noAuthorities:
      "या नेमक्या परिसरासाठी सध्या कोणतीही सक्रिय authority-directory नोंद सापडली नाही.",
    noAuthoritiesBody:
      "स्थानिक संस्था LGD वरून तरी ओळखता येते. प्रत्यक्ष तक्रारीसाठी Report an Issue आणि Smart Handoff वापरा.",
    department: "विभाग",
    covers: "नागरी क्षेत्रे",
    officialRoute: "अधिकृत मार्ग",
    source: "स्रोत",
    website: "अधिकृत स्रोत",
    route: "तक्रार मार्ग",
    notes: "नोंदी",

    responsibilityTitle: "या स्थानिक सरकारकडे कोणत्या गोष्टी असू शकतात",
    responsibilityIntro:
      "ही व्यापक नागरी जबाबदारीची क्षेत्रे आहेत. नेमकी जबाबदारी परिसर आणि संबंधित मालमत्तेनुसार बदलू शकते.",
    roads: "रस्ते आणि सार्वजनिक पायाभूत सुविधा",
    roadsBody:
      "स्थानिक रस्ते आणि संबंधित नागरी पायाभूत सुविधा स्थानिक संस्थेच्या अखत्यारीत असू शकतात; मात्र मालकी किंवा नियंत्रण दुसऱ्या संस्थेकडे असू शकते.",
    waste: "कचरा आणि स्वच्छता",
    wasteBody:
      "घनकचरा संकलन, स्वच्छता सेवा आणि संबंधित स्थानिक नागरी कामकाज सामान्यतः स्थानिक सरकारच्या स्तरावर हाताळले जाते.",
    water: "पाणी आणि सांडपाणी",
    waterBody:
      "पाणीपुरवठा, निचरा आणि सांडपाण्याची जबाबदारी स्थानिक सेवा व्यवस्था आणि नेटवर्क चालवणाऱ्या संस्थेवर अवलंबून असते.",
    lighting: "पथदिवे",
    lightingBody:
      "पथदिव्यांची देखभाल स्थानिक स्वराज्य संस्था किंवा नियुक्त इतर संस्थेकडे असू शकते.",
    publicSpaces: "सार्वजनिक जागा",
    publicSpacesBody:
      "महानगरपालिका सार्वजनिक जागा आणि स्थानिक नागरी सुविधांची देखभाल स्थानिक स्वराज्य संस्थेकडून केली जाऊ शकते.",
    property: "सार्वजनिक मालमत्ता",
    propertyBody:
      "स्थानिक सार्वजनिक मालमत्तेची देखभाल मालकीनुसार महानगरपालिका किंवा इतर सरकारी संस्थेकडून केली जाऊ शकते.",

    reportingNote: "काहीतरी नोंदवायचे आहे?",
    reportingNoteBody:
      "हे पेज जबाबदारी समजून घेण्यासाठी आहे. तक्रार नोंदवण्यासाठी KrutBharat मधील Report an Issue आणि Smart Handoff पर्याय वापरा.",
    openReport: "नागरी समस्या नोंदवा →",

    locationDataSource: "लोकेशन डेटाचा स्रोत",
    locationDataSourceBody:
      "स्थानिक संस्थेची ओळख KrutBharat च्या LGD आधारित local-body master मधून येते. प्रोफाइल, मॅन्युअल आणि सध्याच्या लोकेशनचे शोध स्वतंत्र आहेत.",
    lgd: "LGD",

    footer: "© 2026 KrutBharat · by KarmaFacie Corporation",
  },
};

const responsibilities = [
  ["roads", "🛣️"],
  ["waste", "🗑️"],
  ["water", "🚰"],
  ["lighting", "💡"],
  ["publicSpaces", "🏙️"],
  ["property", "🏛️"],
] as const;

const css = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 8% 4%, rgba(223,234,243,.72), transparent 30%), radial-gradient(circle at 92% 5%, rgba(255,215,179,.56), transparent 28%), var(--kf-ivory,#f8f3ea)",
    color: "var(--kf-ink,#101b2b)",
    padding: "22px 5% 70px",
  } as CSSProperties,
  shell: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
  } as CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    padding: "12px 14px",
    marginBottom: 38,
    border: "1px solid var(--kf-border,rgba(16,27,43,.1))",
    borderRadius: 26,
    background: "rgba(255,255,255,.58)",
    boxShadow: "0 14px 38px rgba(16,32,51,.055)",
    backdropFilter: "blur(18px) saturate(130%)",
  } as CSSProperties,
  logo: {
    fontFamily: "var(--font-display,'Baloo 2'),sans-serif",
    fontSize: 25,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-.045em",
  } as CSSProperties,
  sub: {
    marginTop: 7,
    color: "var(--kf-muted,#657080)",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".12em",
    textTransform: "uppercase",
  } as CSSProperties,
  back: {
    border: "1px solid var(--kf-border,rgba(16,27,43,.1))",
    borderRadius: 999,
    background: "rgba(255,255,255,.72)",
    color: "var(--kf-ink,#101b2b)",
    padding: "11px 18px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  } as CSSProperties,
  eyebrow: {
    color: "var(--kf-orange,#ff7a1a)",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: ".18em",
    marginBottom: 12,
    textTransform: "uppercase",
  } as CSSProperties,
  title: {
    margin: 0,
    maxWidth: 850,
    fontFamily: "var(--font-display,'Baloo 2'),sans-serif",
    fontSize: "clamp(38px,5vw,58px)",
    lineHeight: 1.02,
    fontWeight: 800,
    letterSpacing: "-.055em",
  } as CSSProperties,
  intro: {
    maxWidth: 780,
    margin: "15px 0 0",
    color: "var(--kf-muted,#657080)",
    fontSize: 15,
    lineHeight: 1.7,
  } as CSSProperties,
  info: {
    marginTop: 22,
    padding: 24,
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,.92)",
    background:
      "linear-gradient(135deg,rgba(255,255,255,.88),rgba(238,246,249,.82))",
    boxShadow: "0 20px 52px rgba(16,32,51,.06)",
  } as CSSProperties,
  infoTitle: {
    margin: 0,
    fontFamily: "var(--font-display,'Baloo 2'),sans-serif",
    color: "var(--kf-ink,#101b2b)",
    fontSize: 27,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-.04em",
  } as CSSProperties,
  infoBody: {
    maxWidth: 760,
    margin: "9px 0 0",
    color: "var(--kf-muted,#657080)",
    fontSize: 12,
    lineHeight: 1.7,
  } as CSSProperties,
  modeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: 10,
    marginTop: 18,
  } as CSSProperties,
  modeCard: {
    textAlign: "left",
    padding: 17,
    borderRadius: 20,
    border: "1px solid rgba(16,27,43,.08)",
    background: "rgba(255,255,255,.72)",
    cursor: "pointer",
  } as CSSProperties,
  modeTitle: {
    margin: 0,
    color: "var(--kf-ink,#101b2b)",
    fontFamily: "var(--font-display,'Baloo 2'),sans-serif",
    fontSize: 17,
    lineHeight: 1.1,
    fontWeight: 800,
  } as CSSProperties,
  modeBody: {
    margin: "7px 0 0",
    color: "var(--kf-muted,#657080)",
    fontSize: 11,
    lineHeight: 1.55,
  } as CSSProperties,
  card: {
    marginTop: 18,
    padding: "clamp(22px,4vw,32px)",
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,.92)",
    background:
      "linear-gradient(135deg,rgba(255,255,255,.86),rgba(255,253,249,.70))",
    boxShadow:
      "0 28px 80px rgba(16,32,51,.075),inset 0 1px 0 rgba(255,255,255,.98)",
    backdropFilter: "blur(24px) saturate(135%)",
  } as CSSProperties,
  selectorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: 12,
    marginTop: 20,
  } as CSSProperties,
  field: {
    display: "grid",
    gap: 7,
  } as CSSProperties,
  fieldLabel: {
    color: "var(--kf-muted,#657080)",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: ".12em",
    textTransform: "uppercase",
  } as CSSProperties,
  input: {
    width: "100%",
    border: "1px solid var(--kf-border,rgba(16,27,43,.1))",
    borderRadius: 16,
    background: "rgba(255,255,255,.78)",
    color: "var(--kf-ink,#101b2b)",
    padding: "13px 14px",
    fontSize: 12,
    fontWeight: 800,
    outline: "none",
  } as CSSProperties,
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 16,
  } as CSSProperties,
  primary: {
    border: 0,
    borderRadius: 999,
    background: "var(--kf-orange,#ff7a1a)",
    color: "#fff",
    padding: "12px 18px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 25px rgba(255,122,26,.18)",
  } as CSSProperties,
  darkButton: {
    border: 0,
    borderRadius: 999,
    background: "var(--kf-ink,#101b2b)",
    color: "#fff",
    padding: "12px 18px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  } as CSSProperties,
  ghost: {
    border: "1px solid var(--kf-border,rgba(16,27,43,.1))",
    borderRadius: 999,
    background: "transparent",
    color: "var(--kf-ink,#101b2b)",
    padding: "11px 16px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  } as CSSProperties,
  sectionEyebrow: {
    color: "var(--kf-orange,#ff7a1a)",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: ".14em",
    textTransform: "uppercase",
    marginBottom: 10,
  } as CSSProperties,
  sectionTitle: {
    margin: 0,
    fontFamily: "var(--font-display,'Baloo 2'),sans-serif",
    color: "var(--kf-ink,#101b2b)",
    fontSize: "clamp(25px,3vw,34px)",
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-.035em",
  } as CSSProperties,
  sectionIntro: {
    maxWidth: 760,
    margin: "10px 0 22px",
    color: "var(--kf-muted,#657080)",
    fontSize: 13,
    lineHeight: 1.65,
  } as CSSProperties,
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 12,
  } as CSSProperties,
  resultItem: {
    minHeight: 86,
    padding: 16,
    borderRadius: 20,
    background: "rgba(255,255,255,.62)",
    border: "1px solid rgba(16,27,43,.08)",
  } as CSSProperties,
  label: {
    color: "var(--kf-muted,#657080)",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    marginBottom: 8,
  } as CSSProperties,
  value: {
    color: "var(--kf-ink,#101b2b)",
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 800,
  } as CSSProperties,
  authorityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 14,
  } as CSSProperties,
  authorityCard: {
    position: "relative",
    overflow: "hidden",
    padding: 22,
    borderRadius: 25,
    border: "1px solid #dbe5e6",
    background:
      "linear-gradient(145deg,#edf8f5 0%,#f7fbfa 68%,#fffdf9 100%)",
    boxShadow: "0 14px 36px rgba(16,32,51,.055)",
  } as CSSProperties,
  smallCard: {
    padding: 20,
    borderRadius: 23,
    border: "1px solid var(--kf-border,rgba(16,27,43,.1))",
    background: "rgba(255,255,255,.60)",
    boxShadow: "0 14px 38px rgba(16,32,51,.045)",
  } as CSSProperties,
};

const dedupeAuthorities = (routes: AuthorityRoute[]) => {
  const groups = new Map<
    string,
    AuthorityRoute & { categories: string[]; routes: AuthorityRoute[] }
  >();

  for (const route of routes) {
    const name = (route.authority_name || "Unnamed authority").trim();
    const department = (route.department_name || "").trim();
    const key = `${name.toLocaleLowerCase()}|${department.toLocaleLowerCase()}`;

    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        ...route,
        categories: route.issue_category ? [route.issue_category] : [],
        routes: [route],
      });
      continue;
    }

    if (
      route.issue_category &&
      !existing.categories.includes(route.issue_category)
    ) {
      existing.categories.push(route.issue_category);
    }
    existing.routes.push(route);
  }

  return Array.from(groups.values()).sort((a, b) =>
    (a.authority_name || "").localeCompare(b.authority_name || "")
  );
};

export default function ResponsibleAuthoritiesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();
  const t = copy[language];

  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [profile, setProfile] = useState<ProfileLocation | null>(null);
  const [localBodies, setLocalBodies] = useState<LocalBody[]>([]);
  const [localBody, setLocalBody] = useState<LocalBody | null>(null);
  const [authorities, setAuthorities] = useState<AuthorityRoute[]>([]);
  const [representatives, setRepresentatives] = useState<ElectedRepresentative[]>([]);
  const [representativeLoading, setRepresentativeLoading] = useState(false);
  const [representativeLoadError, setRepresentativeLoadError] = useState("");
  const [publicAuthorities, setPublicAuthorities] = useState<PublicAreaAuthority[]>([]);
  const [publicAuthoritiesLoading, setPublicAuthoritiesLoading] = useState(false);

  const [mode, setMode] = useState<SearchMode>("profile");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedWardOrLocality, setSelectedWardOrLocality] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");
  const [maharashtraDistricts, setMaharashtraDistricts] = useState<MaharashtraDistrict[]>([]);
  const [maharashtraTalukas, setMaharashtraTalukas] = useState<MaharashtraTaluka[]>([]);
  const [maharashtraLocalBodyTalukas, setMaharashtraLocalBodyTalukas] = useState<MaharashtraLocalBodyTaluka[]>([]);
  const [maharashtraPincodes, setMaharashtraPincodes] = useState<MaharashtraPincode[]>([]);
  const [maharashtraLocalBodyPincodes, setMaharashtraLocalBodyPincodes] = useState<MaharashtraLocalBodyPincode[]>([]);
  const [maharashtraWards, setMaharashtraWards] = useState<MaharashtraWard[]>([]);
  const [municipalElectionWardOptions, setMunicipalElectionWardOptions] = useState<
    Array<{ wardNumber: string; wardName: string | null }>
  >([]);
  const [municipalElectionWardLoading, setMunicipalElectionWardLoading] =
    useState(false);
  const wardOptionsRequestId = useRef(0);

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [authorityLoading, setAuthorityLoading] = useState(false);

  const fetchAuthorities = async (
    body: LocalBody | null,
    city: string,
    state: string
  ) => {
    setAuthorityLoading(true);
    setAuthorities([]);

    let routes: AuthorityRoute[] = [];

    if (body?.id) {
      const { data: byLocalBody, error } = await supabase
        .from("authority_directory")
        .select(
          "id, city, state, authority_name, department_name, issue_category, grievance_url, official_source_url, submission_method, notes, is_active"
        )
        .eq("local_body_id", body.id)
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (!error && byLocalBody?.length) {
        routes = byLocalBody as AuthorityRoute[];
      }
    }

    if (!routes.length && city && state) {
      const { data: byCity, error } = await supabase
        .from("authority_directory")
        .select(
          "id, city, state, authority_name, department_name, issue_category, grievance_url, official_source_url, submission_method, notes, is_active"
        )
        .eq("city", city)
        .eq("state", state)
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (!error && byCity?.length) {
        routes = byCity as AuthorityRoute[];
      }
    }

    setAuthorities(routes);
    setAuthorityLoading(false);
  };

  const fetchPublicAuthorities = async (
    body: LocalBody | null,
    city: string,
    district: string,
    state: string
  ) => {
    setPublicAuthoritiesLoading(true);
    setPublicAuthorities([]);

    const select =
      "id, local_body_id, state, district, city, authority_type, authority_name, office_title, office_holder_name, jurisdiction_description, official_source_url, source_name, source_checked_at, notes, is_active";

    try {
      if (body?.id) {
        const { data, error } = await supabase
          .from("civic_area_authorities")
          .select(select)
          .eq("local_body_id", body.id)
          .eq("is_active", true)
          .order("authority_type", { ascending: true })
          .order("authority_name", { ascending: true });

        if (!error && data?.length) {
          setPublicAuthorities(data as PublicAreaAuthority[]);
          return;
        }
      }

      let query = supabase
        .from("civic_area_authorities")
        .select(select)
        .eq("state", state)
        .eq("is_active", true);

      const cityValues = locationAliases(city);
      if (cityValues.length) query = query.in("city", cityValues);

      const districtValues = district
        ? Array.from(new Set([district, ...locationAliases(district)]))
        : [];
      if (districtValues.length) query = query.in("district", districtValues);

      const { data, error } = await query
        .order("authority_type", { ascending: true })
        .order("authority_name", { ascending: true });

      if (!error && data?.length) {
        setPublicAuthorities(data as PublicAreaAuthority[]);
      }
    } catch (error) {
      console.error("Responsible Authorities public-authority error:", error);
    } finally {
      setPublicAuthoritiesLoading(false);
    }
  };

  const loadMunicipalElectionWardOptions = async (body: LocalBody | null) => {
    const requestId = ++wardOptionsRequestId.current;

    const isLatest = () => requestId === wardOptionsRequestId.current;

    if (!body || normalizeLocationName(body.state) !== "maharashtra") {
      if (isLatest()) {
        setMunicipalElectionWardOptions([]);
        setMunicipalElectionWardLoading(false);
      }
      return [];
    }

    const electionWardNames = municipalElectionWardNames(body);

    if (electionWardNames) {
      const options = Object.entries(electionWardNames)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([wardNumber, wardName]) => ({
          wardNumber,
          wardName,
        }));

      if (isLatest()) {
        setMunicipalElectionWardOptions(options);
        setMunicipalElectionWardLoading(false);
      }
      return options;
    }

    if (isLatest()) {
      setMunicipalElectionWardLoading(true);
      setMunicipalElectionWardOptions([]);
    }

    try {
      const { data, error } = await supabase
        .from("civic_area_representatives")
        .select("ward_number, ward_name")
        .eq("local_body_id", body.id)
        .eq("jurisdiction_level", "WARD")
        .eq("is_active", true)
        .order("ward_number", { ascending: true });

      if (error) {
        console.error(
          "Responsible Authorities municipal-election ward options query:",
          error
        );
        if (isLatest()) setMunicipalElectionWardOptions([]);
        return [];
      }

      const byWardNumber = new Map<
        string,
        { wardNumber: string; wardName: string | null }
      >();

      for (const row of data ?? []) {
        const rawNumber = String(row.ward_number ?? "").trim();
        const numberMatch = rawNumber.match(/\d{1,3}/);
        if (!numberMatch?.[0]) continue;

        const wardNumber = numberMatch[0];
        const wardName = String(row.ward_name ?? "").trim() || null;
        const existing = byWardNumber.get(wardNumber);

        if (!existing || (!existing.wardName && wardName)) {
          byWardNumber.set(wardNumber, { wardNumber, wardName });
        }
      }

      const options = Array.from(byWardNumber.values()).sort(
        (a, b) =>
          Number(a.wardNumber) - Number(b.wardNumber) ||
          a.wardNumber.localeCompare(b.wardNumber)
      );

      if (isLatest()) setMunicipalElectionWardOptions(options);
      return options;
    } finally {
      if (isLatest()) setMunicipalElectionWardLoading(false);
    }
  };

  const resetMunicipalElectionWardOptions = () => {
    wardOptionsRequestId.current += 1;
    setMunicipalElectionWardOptions([]);
    setMunicipalElectionWardLoading(false);
  };

  const fetchRepresentatives = async (
    body: LocalBody | null,
    city: string,
    state: string,
    pincode: string,
    wardOrLocality = ""
  ) => {
    setRepresentativeLoading(true);
    setRepresentativeLoadError("");

    const select =
      "id, local_body_id, state, district, city, pincode, jurisdiction_level, office_title, constituency_name, constituency_code, ward_name, ward_number, representative_name, political_party, election_year, official_source_url, source_name, source_checked_at, notes, is_active";

    /*
     * Only treat a value as a ward number when the value explicitly looks
     * like a ward selector value or is just a numeric ward number.
     *
     * This deliberately does NOT grab arbitrary numbers from a profile field
     * such as a pincode (e.g. 411041), which could otherwise filter every
     * WARD row out and produce the visible "0" result.
     */
    const extractBaseWardNumber = (value: string | null | undefined) => {
      const raw = String(value ?? "").trim();
      if (!raw) return "";

      const explicitWardMatch = raw.match(
        /\b(?:ward|prabhag)\s*(?:no\.?\s*)?(\d{1,3})\b/i
      );
      if (explicitWardMatch?.[1]) return explicitWardMatch[1];

      if (/^\d{1,3}[A-Za-z]?$/.test(raw)) {
        return raw.replace(/[A-Za-z]+$/, "");
      }

      const electionWardNames = municipalElectionWardNames(body);
      const normalizedRaw = normalizeLocationName(raw);

      if (electionWardNames && normalizedRaw) {
        for (const [wardNumber, wardName] of Object.entries(
          electionWardNames
        )) {
          const normalizedName = normalizeLocationName(wardName);

          if (
            normalizedName === normalizedRaw ||
            normalizedName.includes(normalizedRaw) ||
            normalizedRaw.includes(normalizedName)
          ) {
            return wardNumber;
          }
        }
      }

      return "";
    };

    const selectedWardValue = String(wardOrLocality ?? "").trim();
    let selectedBaseWardNumber = extractBaseWardNumber(selectedWardValue);

    const wardMatchesSelection = (
      representative: ElectedRepresentative
    ) => {
      if (!selectedBaseWardNumber) return true;

      return (
        extractBaseWardNumber(representative.ward_number) ===
        selectedBaseWardNumber
      );
    };

    try {
      const rowsById = new Map<number, ElectedRepresentative>();

      const addRows = (
        incoming: ElectedRepresentative[] | null | undefined
      ) => {
        for (const row of incoming ?? []) {
          if (!rowsById.has(row.id)) {
            rowsById.set(row.id, row);
          }
        }
      };

      const localRepresentativeLevels = [
        "MUNICIPAL",
        "WARD",
        "OTHER",
      ] as const;

      let localRows: ElectedRepresentative[] = [];

      /*
       * 1. Canonical lookup: the selected ULB UUID.
       *
       * The Pune diagnostic confirms the 2026 WARD records use the Pune ULB
       * UUID directly, so this remains the primary lookup.
       */
      if (body?.id) {
        const { data, error } = await supabase
          .from("civic_area_representatives")
          .select(select)
          .eq("local_body_id", body.id)
          .in("jurisdiction_level", [...localRepresentativeLevels])
          .eq("is_active", true)
          .order("jurisdiction_level", { ascending: true })
          .order("ward_number", { ascending: true })
          .order("representative_name", { ascending: true });

        if (error) {
          console.error(
            "Responsible Authorities representative local-body query:",
            error
          );
          throw new Error(
            "Municipal / ward representative data could not be read."
          );
        }

        localRows = (data ?? []) as ElectedRepresentative[];
      }

      if (!selectedBaseWardNumber && selectedWardValue) {
        const normalizedSelectedWard = normalizeLocationName(selectedWardValue);

        const matchingWard = localRows.find((row) => {
          if (row.jurisdiction_level !== "WARD" || !row.ward_name) {
            return false;
          }

          const normalizedWardName = normalizeLocationName(row.ward_name);
          return (
            normalizedWardName === normalizedSelectedWard ||
            normalizedWardName.includes(normalizedSelectedWard) ||
            normalizedSelectedWard.includes(normalizedWardName)
          );
        });

        if (matchingWard) {
          selectedBaseWardNumber = extractBaseWardNumber(
            matchingWard.ward_number
          );
        }
      }

      /*
       * 2. Robust city fallback.
       *
       * Do not require an exact city string. Some ULB-backed representative
       * rows can carry names such as "Pune (M Corp)" while the visible
       * location is simply "Pune".
       */
      if (!localRows.length && state && city) {
        const cityTerm = city
          .trim()
          .replace(/[%_]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        let query = supabase
          .from("civic_area_representatives")
          .select(select)
          .ilike("state", state)
          .in("jurisdiction_level", [...localRepresentativeLevels])
          .eq("is_active", true);

        if (cityTerm) {
          query = query.ilike("city", `%${cityTerm}%`);
        }

        const { data, error } = await query
          .order("jurisdiction_level", { ascending: true })
          .order("ward_number", { ascending: true })
          .order("representative_name", { ascending: true });

        if (error) {
          console.error(
            "Responsible Authorities representative city query:",
            error
          );
        } else {
          localRows = (data ?? []) as ElectedRepresentative[];
        }
      }

      /*
       * 3. Only after finding the correct local-body/city rows do we apply
       * an optional ward filter.
       */
      addRows(
        localRows.filter((row) => {
          if (row.jurisdiction_level !== "WARD") return true;
          if (!selectedBaseWardNumber) return false;
          return wardMatchesSelection(row);
        })
      );

      /*
       * 4. Resolve Assembly and Lok Sabha constituencies from the completed
       * ULB → constituency maps.
       */
      if (body?.id) {
        const [assemblyMapResult, lokSabhaMapResult] = await Promise.all([
          supabase
            .from("civic_maharashtra_local_body_assembly_map")
            .select("assembly_constituency_id")
            .eq("local_body_id", body.id)
            .eq("is_active", true),

          supabase
            .from("civic_maharashtra_local_body_lok_sabha_map")
            .select("lok_sabha_constituency_id")
            .eq("local_body_id", body.id)
            .eq("is_active", true),
        ]);

        if (assemblyMapResult.error) {
          console.error(
            "Responsible Authorities ULB → Assembly mapping query:",
            assemblyMapResult.error
          );
          throw new Error("Assembly constituency mapping could not be read.");
        }

        if (lokSabhaMapResult.error) {
          console.error(
            "Responsible Authorities ULB → Lok Sabha mapping query:",
            lokSabhaMapResult.error
          );
          throw new Error("Lok Sabha constituency mapping could not be read.");
        }

        const assemblyIds = Array.from(
          new Set(
            (assemblyMapResult.data ?? [])
              .map((row) => row.assembly_constituency_id)
              .filter((value): value is string => Boolean(value))
          )
        );

        const lokSabhaIds = Array.from(
          new Set(
            (lokSabhaMapResult.data ?? [])
              .map((row) => row.lok_sabha_constituency_id)
              .filter((value): value is string => Boolean(value))
          )
        );

        const [assemblyMasterResult, lokSabhaMasterResult] =
          await Promise.all([
            assemblyIds.length
              ? supabase
                  .from("civic_maharashtra_assembly_constituencies")
                  .select("id, ac_number, ac_name")
                  .in("id", assemblyIds)
                  .eq("is_active", true)
              : Promise.resolve({ data: [], error: null }),

            lokSabhaIds.length
              ? supabase
                  .from("civic_maharashtra_lok_sabha_constituencies")
                  .select("id, pc_number, pc_name")
                  .in("id", lokSabhaIds)
                  .eq("is_active", true)
              : Promise.resolve({ data: [], error: null }),
          ]);

        if (assemblyMasterResult.error) {
          console.error(
            "Responsible Authorities Assembly constituency master query:",
            assemblyMasterResult.error
          );
          throw new Error(
            "Assembly constituency information could not be read."
          );
        }

        if (lokSabhaMasterResult.error) {
          console.error(
            "Responsible Authorities Lok Sabha constituency master query:",
            lokSabhaMasterResult.error
          );
          throw new Error(
            "Lok Sabha constituency information could not be read."
          );
        }

        const assemblyCodes = Array.from(
          new Set(
            (assemblyMasterResult.data ?? [])
              .map((row) => row.ac_number)
              .filter(
                (value): value is number =>
                  typeof value === "number" && Number.isFinite(value)
              )
              .map(String)
          )
        );

        const lokSabhaCodes = Array.from(
          new Set(
            (lokSabhaMasterResult.data ?? [])
              .map((row) => row.pc_number)
              .filter(
                (value): value is number =>
                  typeof value === "number" && Number.isFinite(value)
              )
              .map(String)
          )
        );

        const [assemblyRepresentativeResult, lokSabhaRepresentativeResult] =
          await Promise.all([
            assemblyCodes.length
              ? supabase
                  .from("civic_area_representatives")
                  .select(select)
                  .eq("jurisdiction_level", "ASSEMBLY")
                  .in("constituency_code", assemblyCodes)
                  .eq("is_active", true)
                  .order("constituency_code", { ascending: true })
                  .order("representative_name", { ascending: true })
              : Promise.resolve({ data: [], error: null }),

            lokSabhaCodes.length
              ? supabase
                  .from("civic_area_representatives")
                  .select(select)
                  .eq("jurisdiction_level", "LOK_SABHA")
                  .in("constituency_code", lokSabhaCodes)
                  .eq("is_active", true)
                  .order("constituency_code", { ascending: true })
                  .order("representative_name", { ascending: true })
              : Promise.resolve({ data: [], error: null }),
          ]);

        if (assemblyRepresentativeResult.error) {
          console.error(
            "Responsible Authorities Assembly representative query:",
            assemblyRepresentativeResult.error
          );
          throw new Error("Assembly representative data could not be read.");
        }

        if (lokSabhaRepresentativeResult.error) {
          console.error(
            "Responsible Authorities Lok Sabha representative query:",
            lokSabhaRepresentativeResult.error
          );
          throw new Error("Lok Sabha representative data could not be read.");
        }

        addRows(
          (assemblyRepresentativeResult.data ??
            []) as ElectedRepresentative[]
        );

        addRows(
          (lokSabhaRepresentativeResult.data ??
            []) as ElectedRepresentative[]
        );
      }

      const jurisdictionOrder: Record<string, number> = {
        MUNICIPAL: 1,
        WARD: 2,
        ASSEMBLY: 3,
        LOK_SABHA: 4,
        OTHER: 5,
      };

      const rows = Array.from(rowsById.values()).sort((a, b) => {
        const levelDifference =
          (jurisdictionOrder[a.jurisdiction_level] ?? 99) -
          (jurisdictionOrder[b.jurisdiction_level] ?? 99);

        if (levelDifference !== 0) {
          return levelDifference;
        }

        const wardDifference = String(a.ward_number ?? "").localeCompare(
          String(b.ward_number ?? ""),
          undefined,
          { numeric: true, sensitivity: "base" }
        );

        if (wardDifference !== 0) {
          return wardDifference;
        }

        const constituencyDifference = String(
          a.constituency_code ?? ""
        ).localeCompare(String(b.constituency_code ?? ""), undefined, {
          numeric: true,
        });

        if (constituencyDifference !== 0) {
          return constituencyDifference;
        }

        return a.representative_name.localeCompare(
          b.representative_name
        );
      });

      setRepresentatives(rows);

      if (!rows.length) {
        console.warn(
          "Responsible Authorities: no representative rows matched",
          {
            bodyId: body?.id,
            city,
            state,
            district: selectedDistrict,
            pincode,
            selectedWard: selectedWardValue,
            selectedBaseWardNumber,
          }
        );
      }
    } catch (error) {
      console.error(
        "Responsible Authorities representative query failed:",
        error
      );
      setRepresentatives([]);
      setRepresentativeLoadError(
        "Representative information could not be loaded for this area. Please try again or select the area manually."
      );
    } finally {
      setRepresentativeLoading(false);
    }
  };
  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setSignedIn(false);
          setLoading(false);
        }
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("state, city, pincode, ward, zone, local_body_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Responsible Authorities profile error:", profileError);
      }

      // Supabase REST responses are paginated. Load the complete ULB master
      // plus the new Maharashtra geography masters so the selectors are
      // driven by verified geography tables rather than the old embedded
      // pincode_codes / ward-representative fields.
      const PAGE_SIZE = 1000;

      const fetchAllRows = async <T,>(
        table: string,
        select: string,
        orderColumn: string
      ): Promise<T[]> => {
        const rows: T[] = [];
        let from = 0;

        while (true) {
          const { data, error } = await supabase
            .from(table)
            .select(select)
            .eq("is_active", true)
            .order(orderColumn, { ascending: true })
            .range(from, from + PAGE_SIZE - 1);

          if (error) {
            console.error(
              `Responsible Authorities ${table} load error:`,
              error
            );
            break;
          }

          const page = (data ?? []) as T[];
          rows.push(...page);

          if (page.length < PAGE_SIZE) break;
          from += PAGE_SIZE;
        }

        return rows;
      };

      const [
        bodies,
        mahaDistrictRows,
        mahaTalukaRows,
        mahaLocalBodyTalukaRows,
        mahaPincodeRows,
        mahaLocalBodyPincodeRows,
        mahaWardRows,
      ] = await Promise.all([
        fetchAllRows<LocalBody>(
          "civic_local_bodies",
          "id, lgd_code, state, district, local_body_name, local_body_name_local, local_body_type, source_name, pincode_codes",
          "state"
        ),
        fetchAllRows<MaharashtraDistrict>(
          "civic_maharashtra_districts",
          "id, lgd_district_code, district_name",
          "district_name"
        ),
        fetchAllRows<MaharashtraTaluka>(
          "civic_maharashtra_talukas",
          "id, district_id, lgd_subdistrict_code, district_name, taluka_name",
          "taluka_name"
        ),
        fetchAllRows<MaharashtraLocalBodyTaluka>(
          "civic_maharashtra_local_body_talukas",
          "local_body_id, taluka_id",
          "local_body_id"
        ),
        fetchAllRows<MaharashtraPincode>(
          "civic_maharashtra_pincodes",
          "id, pincode, district_id, taluka_id, district_name, taluka_name",
          "pincode"
        ),
        fetchAllRows<MaharashtraLocalBodyPincode>(
          "civic_maharashtra_local_body_pincodes",
          "local_body_id, pincode_id",
          "local_body_id"
        ),
        fetchAllRows<MaharashtraWard>(
          "civic_maharashtra_wards",
          "local_body_id, lgd_ward_code, ward_number, ward_name",
          "ward_name"
        ),
      ]);

      if (!active) return;


      const nextProfile = (profileData ?? null) as ProfileLocation | null;

      setProfile(nextProfile);
      setLocalBodies(bodies);
      setMaharashtraDistricts(mahaDistrictRows);
      setMaharashtraTalukas(mahaTalukaRows);
      setMaharashtraLocalBodyTalukas(mahaLocalBodyTalukaRows);
      setMaharashtraPincodes(mahaPincodeRows);
      setMaharashtraLocalBodyPincodes(mahaLocalBodyPincodeRows);
      setMaharashtraWards(mahaWardRows);

      let profileBody: LocalBody | null = null;

      if (nextProfile?.local_body_id) {
        const candidate =
          bodies.find((item) => item.id === nextProfile.local_body_id) ?? null;

        const normal = (value: string) =>
          value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

        if (
          candidate &&
          (!nextProfile.state ||
            normal(candidate.state) === normal(nextProfile.state)) &&
          (!nextProfile.city ||
            normal(candidate.local_body_name) === normal(nextProfile.city) ||
            normal(candidate.local_body_name).includes(
              normal(nextProfile.city)
            ) ||
            normal(nextProfile.city).includes(
              normal(candidate.local_body_name)
            ))
        ) {
          profileBody = candidate;
        }
      }

      if (!profileBody && nextProfile?.state && nextProfile?.city) {
        const normal = (value: string) =>
          value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

        profileBody =
          bodies.find(
            (item) =>
              normal(item.state) === normal(nextProfile.state || "") &&
              normal(item.local_body_name) === normal(nextProfile.city || "")
          ) ?? null;
      }

      setLocalBody(profileBody);

      if (profileBody) {
        setSelectedState(profileBody.state);
        setSelectedDistrict(profileBody.district || "");
        setSelectedCity(profileBody.local_body_name);
        setSelectedPincode(nextProfile?.pincode || "");

        if (normalizeLocationName(profileBody.state) === "maharashtra") {
          const mappedTalukas = mahaLocalBodyTalukaRows
            .filter((row) => row.local_body_id === profileBody!.id)
            .map((row) => mahaTalukaRows.find((taluka) => taluka.id === row.taluka_id))
            .filter((taluka): taluka is MaharashtraTaluka => Boolean(taluka));

          if (mappedTalukas.length === 1) {
            setSelectedTaluka(mappedTalukas[0].taluka_name);
          } else {
            setSelectedTaluka(nextProfile?.zone || "");
          }
        } else {
          setSelectedTaluka("");
        }

        setSelectedWardOrLocality(nextProfile?.ward || "");
        await loadMunicipalElectionWardOptions(profileBody);
      } else if (nextProfile) {
        setSelectedState(nextProfile.state || "");
        setSelectedCity(nextProfile.city || "");
        setSelectedPincode(nextProfile.pincode || "");
        setSelectedWardOrLocality(nextProfile.ward || "");
        setMunicipalElectionWardOptions([]);
      }

      if (profileBody || nextProfile?.city) {
        const resolvedCity =
          profileBody?.local_body_name || nextProfile?.city || "";
        const resolvedState =
          profileBody?.state || nextProfile?.state || "";

        await Promise.all([
          fetchAuthorities(profileBody, resolvedCity, resolvedState),
          fetchRepresentatives(
            profileBody,
            resolvedCity,
            resolvedState,
            nextProfile?.pincode || "",
            nextProfile?.ward || ""
          ),
          fetchPublicAuthorities(
            profileBody,
            resolvedCity,
            profileBody?.district || "",
            resolvedState
          ),
        ]);
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  const isMaharashtraSelection =
    normalizeLocationName(selectedState) === "maharashtra";

  const stateOptions = useMemo(
    () =>
      Array.from(
        new Set(localBodies.map((item) => item.state).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [localBodies]
  );

  const districtOptions = useMemo(() => {
    if (isMaharashtraSelection && maharashtraDistricts.length) {
      return maharashtraDistricts
        .map((item) => item.district_name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    }

    return Array.from(
      new Set(
        localBodies
          .filter((item) => item.state === selectedState)
          .map((item) => item.district || "")
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [
    isMaharashtraSelection,
    maharashtraDistricts,
    localBodies,
    selectedState,
  ]);

  const cityOptions = useMemo(
    () =>
      localBodies.filter(
        (item) =>
          item.state === selectedState &&
          (!selectedDistrict || item.district === selectedDistrict)
      ),
    [localBodies, selectedState, selectedDistrict]
  );

  const selectedBody = useMemo(
    () =>
      cityOptions.find(
        (item) =>
          normalizeLocationName(item.local_body_name) ===
          normalizeLocationName(selectedCity)
      ) ?? null,
    [cityOptions, selectedCity]
  );

  const talukaOptions = useMemo(() => {
    if (!isMaharashtraSelection) return [];

    const talukaIds = new Set(
      selectedBody
        ? maharashtraLocalBodyTalukas
            .filter((row) => row.local_body_id === selectedBody.id)
            .map((row) => row.taluka_id)
        : []
    );

    if (talukaIds.size) {
      return maharashtraTalukas
        .filter((taluka) => talukaIds.has(taluka.id))
        .sort((a, b) => a.taluka_name.localeCompare(b.taluka_name));
    }

    if (selectedDistrict) {
      const districtRecord = maharashtraDistricts.find(
        (item) =>
          normalizeLocationName(item.district_name) ===
          normalizeLocationName(selectedDistrict)
      );

      if (districtRecord) {
        return maharashtraTalukas
          .filter((taluka) => taluka.district_id === districtRecord.id)
          .sort((a, b) => a.taluka_name.localeCompare(b.taluka_name));
      }
    }

    return [];
  }, [
    isMaharashtraSelection,
    selectedBody,
    maharashtraLocalBodyTalukas,
    maharashtraTalukas,
    maharashtraDistricts,
    selectedDistrict,
  ]);

  const pincodeOptions = useMemo(() => {
    if (isMaharashtraSelection && selectedBody) {
      const pincodeIds = new Set(
        maharashtraLocalBodyPincodes
          .filter((row) => row.local_body_id === selectedBody.id)
          .map((row) => row.pincode_id)
      );

      return maharashtraPincodes
        .filter((row) => pincodeIds.has(row.id))
        .map((row) => row.pincode)
        .filter((pin) => /^\d{6}$/.test(pin))
        .sort();
    }

    if (!selectedBody) return [];

    return Array.from(
      new Set(
        (selectedBody.pincode_codes ?? [])
          .map((pin) => String(pin).trim())
          .filter((pin) => /^\d{6}$/.test(pin))
      )
    ).sort();
  }, [
    isMaharashtraSelection,
    selectedBody,
    maharashtraLocalBodyPincodes,
    maharashtraPincodes,
  ]);

  const wardOptions = useMemo(() => {
    if (!isMaharashtraSelection || !selectedBody) return [];

    if (municipalElectionWardOptions.length) {
      return municipalElectionWardOptions.map(({ wardNumber, wardName }) => {
        const name = String(wardName || "").trim();
        const genericName = name
          .toLocaleLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        if (name && !/^((ward|prabhag)(\s+no\.?|\s*)?\s*\d+)/i.test(genericName)) {
          return `Ward No. ${wardNumber} · ${name}`;
        }

        return `Ward No. ${wardNumber}`;
      });
    }

    return maharashtraWards
      .filter((ward) => ward.local_body_id === selectedBody.id)
      .sort((a, b) => {
        const aNumber = Number(a.ward_number);
        const bNumber = Number(b.ward_number);

        if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
          return aNumber - bNumber;
        }

        return a.ward_name.localeCompare(b.ward_name);
      })
      .map((ward) => {
        const wardName = String(ward.ward_name || "").trim();
        const wardNumber = String(ward.ward_number || "").trim();

        if (wardName && wardNumber) {
          return `${wardName} · No. ${wardNumber}`;
        }

        if (wardName) return wardName;
        if (wardNumber) return `Ward No. ${wardNumber}`;
        return "";
      })
      .filter(Boolean);
  }, [
    isMaharashtraSelection,
    selectedBody,
    municipalElectionWardOptions,
    maharashtraWards,
  ]);

  const rows = useMemo(
    () => [
      [t.state, localBody?.state || selectedState || t.notSet],
      [t.district, localBody?.district || selectedDistrict || t.notSet],
      [
        t.municipality,
        localBody?.local_body_name || selectedCity || profile?.city || t.notSet,
      ],
      [t.taluka, selectedTaluka || t.notSet],
      [t.ward, selectedWardOrLocality || profile?.ward || t.notSet],
      [t.pincode, selectedPincode || profile?.pincode || t.notSet],
    ],
    [
      localBody,
      selectedState,
      selectedDistrict,
      selectedCity,
      selectedTaluka,
      selectedWardOrLocality,
      selectedPincode,
      profile,
      t,
    ]
  );

  const applyResolvedArea = async (
    nextMode: SearchMode,
    state: string,
    district: string,
    city: string,
    pincode: string,
    locality = "",
    taluka = ""
  ) => {
    setMode(nextMode);
    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedCity(city);
    setSelectedPincode(pincode);
    setSelectedWardOrLocality(locality);
    setSelectedTaluka(taluka);

    const normal = (value: string) =>
      value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

    const body =
      localBodies.find(
        (item) =>
          normal(item.state) === normal(state) &&
          (!district || normal(item.district || "") === normal(district)) &&
          normal(item.local_body_name) === normal(city)
      ) ??
      localBodies.find(
        (item) =>
          normal(item.state) === normal(state) &&
          !!pincode &&
          (item.pincode_codes ?? []).includes(pincode)
      ) ??
      null;

    setLocalBody(body);
    await loadMunicipalElectionWardOptions(body);

    if (
      body &&
      normal(state) === "maharashtra" &&
      !taluka
    ) {
      const mappedTalukas = maharashtraLocalBodyTalukas
        .filter((row) => row.local_body_id === body.id)
        .map((row) => maharashtraTalukas.find((item) => item.id === row.taluka_id))
        .filter((item): item is MaharashtraTaluka => Boolean(item));

      if (mappedTalukas.length === 1) {
        setSelectedTaluka(mappedTalukas[0].taluka_name);
      }
    }

    const resolvedCity = body?.local_body_name || city;
    const resolvedState = body?.state || state;

    await Promise.all([
      fetchAuthorities(body, resolvedCity, resolvedState),
      fetchRepresentatives(
        body,
        resolvedCity,
        resolvedState,
        pincode,
        locality
      ),
      fetchPublicAuthorities(
        body,
        resolvedCity,
        body?.district || district || "",
        resolvedState
      ),
    ]);

    return body;
  };

  const searchManualArea = async () => {
    setLocationMessage("");

    if (!selectedState) {
      setLocationMessage(t.selectState);
      return;
    }

    const exactCity =
      cityOptions.find((item) => item.local_body_name === selectedCity) ?? null;

    const pinBody =
      !exactCity && selectedPincode
        ? localBodies.find(
            (item) =>
              item.state === selectedState &&
              (item.pincode_codes ?? []).includes(selectedPincode)
          ) ?? null
        : null;

    const body = exactCity || pinBody;

    if (body) {
      setLocalBody(body);
      await loadMunicipalElectionWardOptions(body);
      if (!selectedDistrict) setSelectedDistrict(body.district || "");
      if (!selectedCity) setSelectedCity(body.local_body_name);
      await fetchAuthorities(body, body.local_body_name, body.state);
      await fetchRepresentatives(
        body,
        body.local_body_name,
        body.state,
        selectedPincode,
        selectedWardOrLocality
      );
      await fetchPublicAuthorities(
        body,
        body.local_body_name,
        body.district || selectedDistrict,
        body.state
      );
      return;
    }

    setLocalBody(null);
    resetMunicipalElectionWardOptions();
    await fetchAuthorities(null, selectedCity, selectedState);
    await fetchRepresentatives(
      null,
      selectedCity,
      selectedState,
      selectedPincode,
      selectedWardOrLocality
    );
    await fetchPublicAuthorities(
      null,
      selectedCity,
      selectedDistrict,
      selectedState
    );
  };

  const useProfileLocation = async () => {
    setLocationMessage("");

    if (!profile?.state && !profile?.city) {
      setMode("manual");
      setLocationMessage(t.locationUnavailable);
      return;
    }

    setMode("profile");
    setSelectedState(profile.state || "");
    setSelectedDistrict("");
    setSelectedCity(profile.city || "");
    setSelectedPincode(profile.pincode || "");
    setSelectedWardOrLocality(profile.ward || "");
    setSelectedTaluka("");

    const normal = (value: string) =>
      value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

    const profileBodyCandidate =
      profile.local_body_id
        ? localBodies.find((item) => item.id === profile.local_body_id) ?? null
        : null;

    const body =
      (profileBodyCandidate &&
        (!profile.state ||
          normal(profileBodyCandidate.state) === normal(profile.state)) &&
        (!profile.city ||
          normal(profileBodyCandidate.local_body_name) ===
            normal(profile.city) ||
          normal(profileBodyCandidate.local_body_name).includes(
            normal(profile.city)
          ) ||
          normal(profile.city).includes(
            normal(profileBodyCandidate.local_body_name)
          ))
        ? profileBodyCandidate
        : null) ||
      localBodies.find(
        (item) =>
          normal(item.state) === normal(profile.state || "") &&
          (normal(item.local_body_name) === normal(profile.city || "") ||
            normal(item.local_body_name).includes(
              normal(profile.city || "")
            ) ||
            normal(profile.city || "").includes(
              normal(item.local_body_name)
            ))
      ) ||
      null;

    setLocalBody(body);
    await loadMunicipalElectionWardOptions(body);
    const resolvedCity = body?.local_body_name || profile.city || "";
    const resolvedState = body?.state || profile.state || "";

    await Promise.all([
      fetchAuthorities(body, resolvedCity, resolvedState),
      fetchRepresentatives(
        body,
        resolvedCity,
        resolvedState,
        profile.pincode || "",
        profile.ward || ""
      ),
      fetchPublicAuthorities(
        body,
        resolvedCity,
        body?.district || "",
        resolvedState
      ),
    ]);
  };

  const detectCurrentLocation = () => {
    setMode("current");
    setLocationMessage("");
    setDetectingLocation(true);

    if (!navigator.geolocation) {
      setLocationMessage(t.locationUnavailable);
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
              latitude
            )}&longitude=${encodeURIComponent(
              longitude
            )}&localityLanguage=${encodeURIComponent(language)}`
          );

          if (!response.ok) {
            throw new Error(`Reverse geocoding failed: ${response.status}`);
          }

          const data = await response.json();

          if (data.countryCode !== "IN") {
            setLocationMessage(t.locationOutsideIndia);
            return;
          }

          const rawState = data.principalSubdivision || data.state || "";
          const rawDistrict = data.localityInfo?.administrative?.find(
            (item: { name?: string; description?: string }) =>
              item.description?.toLocaleLowerCase().includes("district")
          )?.name || "";
          const rawCity = data.city || data.locality || "";
          const rawLocality = data.locality || "";
          let pin =
            typeof data.postcode === "string" &&
            /^\d{6}$/.test(data.postcode.trim())
              ? data.postcode.trim()
              : "";

          if (!pin) {
            try {
              const fallback = await fetch(
                `/api/reverse-geocode?latitude=${encodeURIComponent(
                  latitude
                )}&longitude=${encodeURIComponent(longitude)}`,
                { headers: { Accept: "application/json" } }
              );

              if (fallback.ok) {
                const fallbackData = await fallback.json();
                if (
                  typeof fallbackData?.pincode === "string" &&
                  /^\d{6}$/.test(fallbackData.pincode)
                ) {
                  pin = fallbackData.pincode;
                }
              }
            } catch (error) {
              console.error(
                "Pincode reverse-geocoding fallback failed:",
                error
              );
            }
          }

          const normal = (value: string) =>
            value.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

          const stateMatch = localBodies.find(
            (item) => normal(item.state) === normal(rawState)
          );

          const resolvedState = stateMatch?.state || rawState;

          const stateBodies = localBodies.filter(
            (item) => item.state === resolvedState
          );

          const body =
            stateBodies.find(
              (item) =>
                normal(item.local_body_name).includes(normal(rawCity)) ||
                normal(rawCity).includes(normal(item.local_body_name))
            ) ||
            stateBodies.find(
              (item) =>
                !!pin && (item.pincode_codes ?? []).includes(pin)
            ) ||
            null;

          const resolvedDistrict =
            body?.district ||
            (rawDistrict &&
            stateBodies.some(
              (item) => normal(item.district || "") === normal(rawDistrict)
            )
              ? rawDistrict
              : "");

          const resolvedCity = body?.local_body_name || rawCity;

          await applyResolvedArea(
            "current",
            resolvedState,
            resolvedDistrict,
            resolvedCity,
            pin,
            rawLocality
          );

          setLocationMessage(t.detected);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setLocationMessage(t.locationLookupError);
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? t.locationDenied
            : t.locationUnavailable
        );
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  const authorityGroups = useMemo(
    () => dedupeAuthorities(authorities),
    [authorities]
  );

  const representativeGroups = useMemo(
    () => ({
      municipal: representatives.filter(
        (item) =>
          item.jurisdiction_level === "MUNICIPAL" ||
          item.jurisdiction_level === "WARD"
      ),
      mla: representatives.filter(
        (item) => item.jurisdiction_level === "ASSEMBLY"
      ),
      mp: representatives.filter(
        (item) => item.jurisdiction_level === "LOK_SABHA"
      ),
    }),
    [representatives]
  );

  const modeNote =
    mode === "profile"
      ? t.profileDefault
      : mode === "manual"
        ? t.manualIndependent
        : t.currentIndependent;

  if (loading) {
    return (
      <main
        className="kf-responsible-authorities-page"
        style={css.page}
      >
        <div
          style={{
            minHeight: "70vh",
            display: "grid",
            placeItems: "center",
            color: "var(--kf-muted,#657080)",
          }}
        >
          {t.loading || "Loading…"}
        </div>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main
        className="kf-responsible-authorities-page"
        style={css.page}
      >
        <div style={css.shell}>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={css.back}
          >
            {t.back}
          </button>
          <section style={{ marginTop: 50 }}>
            <div style={css.eyebrow}>{t.eyebrow}</div>
            <h1 style={css.title}>{t.title}</h1>
            <p style={css.intro}>{t.currentLocationNote}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="kf-responsible-authorities-page" style={css.page}>
      <div style={css.shell}>
        <header className="kf-ra-premium-header">
          <button
            type="button"
            className="kf-ra-back-button"
            onClick={() => router.push("/dashboard")}
            aria-label={t.back}
            title={t.back}
          >
            <span aria-hidden="true">←</span>
          </button>

          <div className="kf-ra-premium-brand">
            <div className="kf-ra-premium-mark">K</div>
            <div>
              <div className="kf-ra-premium-wordmark"><span>Krut</span><b>Bharat</b></div>
              <div className="kf-ra-premium-sub">KNOW YOUR AREA</div>
            </div>
          </div>

          <label className="kf-ra-premium-language">
            <span>{t.language}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={t.language}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        <section className="kf-ra-premium-hero">
          <div className="hero-glow glow-blue" />
          <div className="hero-glow glow-orange" />
          <div className="hero-copy">
            <div className="premium-eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <div className="kf-ra-hero-subtitle">{t.subtitle}</div>
            <p>{t.intro}</p>
          </div>

          <div className="hero-identity">
            <div className="hero-identity-icon">🏛️</div>
            <div className="hero-identity-line" />
            <span>AREA</span>
            <span className="hero-arrow">↓</span>
            <span>PEOPLE</span>
            <span className="hero-arrow">↓</span>
            <span>PUBLIC BODIES</span>
          </div>
        </section>

        <section className="kf-ra-location-control">
          <div className="location-control-intro">
            <div className="premium-eyebrow">{t.howItWorks}</div>
            <h2>{t.howItWorksTitle}</h2>
            <p>{t.howItWorksBody}</p>
          </div>

          <div className="location-modes">
            <button type="button" className={`location-mode ${mode === "profile" ? "active" : ""}`} onClick={useProfileLocation}>
              <span className="location-mode-icon">⌂</span>
              <span><strong>{t.profileMode}</strong><em>{t.profileModeBody}</em></span>
            </button>
            <button type="button" className={`location-mode ${mode === "current" ? "active" : ""}`} onClick={detectCurrentLocation} disabled={detectingLocation}>
              <span className="location-mode-icon">⌖</span>
              <span><strong>{detectingLocation ? t.detectingLocation : t.currentMode}</strong><em>{t.currentModeBody}</em></span>
            </button>
            <button type="button" className={`location-mode ${mode === "manual" ? "active" : ""}`} onClick={() => { setMode("manual"); setLocationMessage(""); }}>
              <span className="location-mode-icon">⌕</span>
              <span><strong>{t.manualMode}</strong><em>{t.manualModeBody}</em></span>
            </button>
          </div>
        </section>

        <section className="kf-ra-selected-area">
          <div className="selected-area-heading">
            <div>
              <div className="premium-eyebrow">{t.selectedLocation}</div>
              <h2>
                {displayLocationName(
                  selectedCity || localBody?.local_body_name,
                  language
                ) || t.notSet}
              </h2>
              <div className="selected-area-path">
                {[
                  displayLocationName(selectedDistrict, language),
                  displayLocationName(selectedState, language),
                ].filter(Boolean).join(" · ")}
              </div>
            </div>
            <span className={`selected-area-badge mode-${mode}`}>
              {mode === "current" ? "⌖" : mode === "manual" ? "⌕" : "⌂"}{" "}
              {mode === "current" ? t.currentLocation : mode === "manual" ? t.manualSearch : t.yourProfileLocation}
            </span>
          </div>

          {mode === "manual" ? (
            <div className="manual-area-panel">
              <div className="manual-grid">
                <label><span>{t.state}</span>
                  <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(""); setSelectedCity(""); setSelectedPincode(""); setSelectedWardOrLocality(""); setSelectedTaluka(""); resetMunicipalElectionWardOptions(); }}>
                    <option value="">{t.selectState}</option>
                    {stateOptions.map((value) => <option key={value} value={value}>{displayLocationName(value, language)}</option>)}
                  </select>
                </label>
                <label><span>{t.district}</span>
                  <select value={selectedDistrict} disabled={!selectedState} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedCity(""); setSelectedPincode(""); setSelectedWardOrLocality(""); setSelectedTaluka(""); resetMunicipalElectionWardOptions(); }}>
                    <option value="">{t.selectDistrict}</option>
                    {districtOptions.map((value) => <option key={value} value={value}>{displayLocationName(value, language)}</option>)}
                  </select>
                </label>
                <label><span>{t.municipality}</span>
                  <select value={selectedCity} disabled={!selectedState} onChange={async (e) => {
                    const nextCity = e.target.value;
                    setSelectedCity(nextCity);
                    setSelectedPincode("");
                    setSelectedWardOrLocality("");
                    setSelectedTaluka("");

                    const nextBody = cityOptions.find(
                      (item) => item.local_body_name === nextCity
                    ) ?? null;

                    await loadMunicipalElectionWardOptions(nextBody);
                  }}>
                    <option value="">{t.selectCity}</option>
                    {cityOptions.map((item) => <option key={item.id} value={item.local_body_name}>{displayLocationName(item.local_body_name, language)}</option>)}
                  </select>
                </label>
                <label><span>{t.pincode}</span>
                  <select value={selectedPincode} disabled={!selectedCity} onChange={(e) => setSelectedPincode(e.target.value)}>
                    <option value="">{t.selectPincode}</option>
                    {pincodeOptions.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label><span>{t.ward}</span>
                  <select
                    value={selectedWardOrLocality}
                    disabled={
                      !selectedCity ||
                      municipalElectionWardLoading ||
                      !wardOptions.length
                    }
                    onChange={(e) => setSelectedWardOrLocality(e.target.value)}
                  >
                    <option value="">
                      {!selectedCity
                        ? t.selectCity
                        : municipalElectionWardLoading
                          ? t.loadingWards
                          : wardOptions.length
                            ? t.selectWard
                            : t.noWardOptions}
                    </option>
                    {wardOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
                <label><span>{t.taluka}</span>
                  <select
                    value={selectedTaluka}
                    disabled={!selectedDistrict || !talukaOptions.length}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                  >
                    <option value="">
                      {!selectedDistrict
                        ? t.selectDistrict
                        : talukaOptions.length
                          ? t.taluka
                          : t.enterTaluka}
                    </option>
                    {talukaOptions.map((item) => (
                      <option key={item.id} value={item.taluka_name}>
                        {item.taluka_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="manual-actions">
                <button type="button" className="kf-ra-orange-button" onClick={searchManualArea}>{t.searchArea} →</button>
                <button type="button" className="kf-ra-location-button" onClick={detectCurrentLocation} disabled={detectingLocation}>📍 {detectingLocation ? t.detectingLocation : t.useMyLocation}</button>
              </div>
            </div>
          ) : (
            <div className="resolved-area-grid">
              {[
                [t.state, displayLocationName(selectedState, language) || "—"],
                [t.district, displayLocationName(selectedDistrict, language) || "—"],
                [t.taluka, selectedTaluka || "—"],
                [t.municipality, displayLocationName(selectedCity, language) || "—"],
                [t.pincode, selectedPincode || "—"],
                [t.ward, selectedWardOrLocality || "—"],
              ].map(([label, value]) => (
                <div key={label} className="resolved-area-cell"><span>{label}</span><strong>{value}</strong></div>
              ))}
            </div>
          )}

          {locationMessage ? <div className="kf-ra-alert">{locationMessage}</div> : null}
        </section>

        <section className="kf-ra-people-section">
          <div className="section-header-row">
            <div>
              <div className="premium-eyebrow">{t.representativesLabel}</div>
              <h2>{t.representativesTitle}</h2>
              <p>{t.representativesBody}</p>
            </div>
            <div className="section-index">01 · PEOPLE</div>
          </div>

          {representativeLoadError ? (
            <div className="kf-ra-alert kf-ra-data-access-alert">
              {representativeLoadError}
            </div>
          ) : null}

          {representativeLoading ? (
            <div className="kf-ra-loading-box">Loading representative information…</div>
          ) : (
            <div className="representative-feature-grid">
              {[
                {
                  title: t.municipalRepresentatives,
                  body: t.municipalRepresentativesBody,
                  rows: representativeGroups.municipal,
                  tone: "local",
                  icon: "🏘️",
                  badge: "LOCAL",
                },
                {
                  title: t.mlaLabel,
                  body: t.mlaBody,
                  rows: representativeGroups.mla,
                  tone: "mla",
                  icon: "🏛️",
                  badge: "MLA",
                },
                {
                  title: t.mpLabel,
                  body: t.mpBody,
                  rows: representativeGroups.mp,
                  tone: "mp",
                  icon: "🇮🇳",
                  badge: "MP",
                },
              ].map((group) => (
                <article key={group.title} className={`representative-feature representative-feature-${group.tone}`}>
                  <div className="rep-feature-top">
                    <div>
                      <span className="rep-feature-icon">{group.icon}</span>
                      <div className="rep-feature-kicker">{group.badge === "LOCAL" ? "LOCAL GOVERNMENT" : group.badge === "MLA" ? "ASSEMBLY" : "PARLIAMENT"}</div>
                      <h3>{group.title}</h3>
                      <p>{group.body}</p>
                    </div>
                    <span className="rep-feature-count">{group.rows.length}</span>
                  </div>

                  {group.rows.length ? (
                    <div className="rep-list">
                      {group.rows.map((rep) => (
                        <div key={rep.id} className="rep-person">
                          <div className="rep-avatar">{group.badge}</div>
                          <div>
                            <span className="rep-role">{rep.office_title}</span>
                            <h4>{rep.representative_name}</h4>
                            <div className="rep-facts">
                              {rep.political_party ? <div><span>{t.party}</span><strong>{rep.political_party}</strong></div> : null}
                              {rep.constituency_name ? <div><span>{t.constituency}</span><strong>{rep.constituency_name}</strong></div> : null}
                              {rep.ward_name || rep.ward_number ? <div><span>{t.wardDetails}</span><strong>{rep.ward_name || ""}{rep.ward_name && rep.ward_number ? " · " : ""}{rep.ward_number ? `No. ${rep.ward_number}` : ""}</strong></div> : null}
                              {rep.election_year ? <div><span>{t.electionYear}</span><strong>{rep.election_year}</strong></div> : null}
                            </div>
                            {rep.official_source_url ? (
                              <a href={rep.official_source_url} target="_blank" rel="noreferrer">
                                {t.sourceLabel}: {rep.source_name || "Official source"} ↗
                              </a>
                            ) : rep.source_name ? (
                              <div className="kf-ra-source-text">{t.sourceLabel}: {rep.source_name}</div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rep-empty">
                      <strong>
                        {group.badge === "LOCAL" &&
                        !selectedWardOrLocality
                          ? t.selectWardForRepresentatives
                          : t.noRepresentative}
                      </strong>
                      <span>
                        {group.badge === "LOCAL" &&
                        !selectedWardOrLocality
                          ? t.municipalRepresentativesBody
                          : t.noRepresentativeBody}
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="kf-ra-authorities-section">
          <div className="section-header-row">
            <div>
              <div className="premium-eyebrow">{t.authorityDirectory}</div>
              <h2>{t.responsibleAuthorities}</h2>
              <p>{t.authorityDirectoryBody}</p>
            </div>
            <div className="section-index">02 · INSTITUTIONS</div>
          </div>

          <div className="local-government-banner">
            <div className="kf-ra-lgd-icon">🏙️</div>
            <div>
              <span>{t.localGovernment}</span>
              <h3>
                {displayLocationName(
                  localBody?.local_body_name || selectedCity,
                  language
                ) || t.notSet}
              </h3>
              <p>{t.localGovernmentBody}</p>
            </div>
            {localBody?.lgd_code ? <strong>{t.lgd} {localBody.lgd_code}</strong> : null}
          </div>

          <div className="kf-ra-current-authorities-block">
            <div className="current-authorities-heading">
              <div>
                <div className="premium-eyebrow">{t.publicAuthorities}</div>
                <h3>{t.publicAuthoritiesTitle}</h3>
                <p>{t.publicAuthoritiesBody}</p>
              </div>
              <div className="current-authorities-index">03 · PUBLIC BODIES</div>
            </div>

            {publicAuthoritiesLoading ? (
              <div className="kf-ra-loading-box">Loading current public-authority records…</div>
            ) : publicAuthorities.length ? (
              <div className="current-authorities-grid">
                {publicAuthorities.map((authority) => (
                  <article
                    key={`${authority.id}-${authority.authority_name}-${authority.office_title || ""}`}
                    className="current-authority-card"
                  >
                    <div className="current-authority-top">
                      <span className="current-authority-icon">🏛️</span>
                      <span className="current-authority-type">
                        {authority.authority_type}
                      </span>
                    </div>

                    <h4>{authority.authority_name}</h4>

                    {authority.office_title ? (
                      <div className="current-authority-row">
                        <span>{t.office}</span>
                        <strong>{authority.office_title}</strong>
                      </div>
                    ) : null}

                    {authority.office_holder_name ? (
                      <div className="current-authority-holder">
                        <span>{t.officeHolder}</span>
                        <strong>{authority.office_holder_name}</strong>
                      </div>
                    ) : null}

                    {authority.jurisdiction_description ? (
                      <p className="current-authority-description">
                        {authority.jurisdiction_description}
                      </p>
                    ) : null}

                    {authority.source_checked_at ? (
                      <div className="current-authority-checked">
                        {t.verifiedOn}:{" "}
                        {new Date(authority.source_checked_at).toLocaleDateString()}
                      </div>
                    ) : null}

                    {authority.official_source_url ? (
                      <a
                        href={authority.official_source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="current-authority-source"
                      >
                        {t.website} ↗
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="kf-ra-empty-panel">
                <strong>{t.noPublicAuthorities}</strong>
                <span>{t.noPublicAuthoritiesBody}</span>
              </div>
            )}
          </div>

          {authorityLoading ? (
            <div className="kf-ra-loading-box">Loading public authorities…</div>
          ) : authorityGroups.length ? (
            <div className="authority-directory-grid">
              {authorityGroups.map((authority) => (
                <article key={`${authority.authority_name}-${authority.department_name}`} className="authority-directory-card">
                  <div className="authority-heading">
                    <span className="authority-dot" />
                    <div>
                      <h4>{authority.authority_name || "Public authority"}</h4>
                      {authority.department_name ? <span>{authority.department_name}</span> : null}
                    </div>
                  </div>

                  {authority.categories.length ? (
                    <div className="authority-categories">
                      {authority.categories.slice(0,5).map((category) => <span key={category}>{category}</span>)}
                    </div>
                  ) : null}

                  {authority.submission_method ? (
                    <div className="authority-method">
                      <span>{t.officialRoute}</span>
                      <strong>{authority.submission_method}</strong>
                    </div>
                  ) : null}

                  <div className="authority-links">
                    {authority.grievance_url ? <a href={authority.grievance_url} target="_blank" rel="noreferrer">{t.route} ↗</a> : null}
                    {authority.official_source_url ? <a href={authority.official_source_url} target="_blank" rel="noreferrer">{t.website} ↗</a> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="kf-ra-empty-panel">
              <strong>{t.noAuthorities}</strong>
              <span>{t.noAuthoritiesBody}</span>
            </div>
          )}
        </section>

        <section className="kf-ra-neutrality-section">
          <div className="neutrality-symbol">◎</div>
          <div>
            <div className="premium-eyebrow">{t.politicalNeutral}</div>
            <h2>{t.politicalNeutralTitle}</h2>
            <p>{t.politicalNeutralBody}</p>
          </div>
        </section>

        <section className="kf-ra-report-bar">
          <div>
            <div className="premium-eyebrow">{t.reportingNote}</div>
            <p>{t.reportingNoteBody}</p>
          </div>
          <button type="button" className="kf-ra-orange-button" onClick={() => router.push("/report-issue")}>{t.openReport}</button>
        </section>

        <footer className="kf-ra-premium-footer">
          <div className="footer-wordmark"><span>Krut</span><b>Bharat</b></div>
          <span>Know India. Think Civic. Shape Its Future.</span>
          <span>{t.footer}</span>
        </footer>
      </div>
        <style>{`
          .kf-responsible-authorities-page,.kf-responsible-authorities-page *{box-sizing:border-box}

          .kf-ra-premium-header{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:18px;min-height:84px;margin-bottom:18px;padding:10px 12px;border:1px solid rgba(209,221,228,.9);border-radius:28px;background:rgba(255,255,255,.72);box-shadow:0 18px 48px rgba(16,32,51,.06);backdrop-filter:blur(18px) saturate(130%)}
          .kf-ra-back-button,.kf-ra-premium-language select{min-height:44px;padding:10px 15px;border:1px solid rgba(45,74,92,.12);border-radius:999px;background:rgba(255,255,255,.82);color:#42596a;font:900 11px var(--font-body,sans-serif);cursor:pointer}
          .kf-ra-back-button{width:42px;height:42px;min-height:42px;padding:0;display:grid;place-items:center;justify-self:start;border-radius:14px}
          .kf-ra-back-button span{margin:0;color:#ff7a00;font-size:19px;line-height:1;font-weight:900}
          .kf-ra-premium-brand{display:flex;align-items:center;justify-content:center;gap:10px}
          .kf-ra-premium-mark{width:50px;height:50px;display:grid;place-items:center;border-radius:16px;background:#ff7a00;color:#102033;font:900 28px var(--font-display,sans-serif);box-shadow:0 12px 24px rgba(255,122,0,.15)}
          .kf-ra-premium-wordmark{font:900 28px/1 var(--font-display,sans-serif);letter-spacing:-.05em}.kf-ra-premium-wordmark span{color:#102033}.kf-ra-premium-wordmark b{color:#ff7a00}
          .kf-ra-premium-sub{margin-top:5px;color:#8797a1;font:900 8px var(--font-body,sans-serif);letter-spacing:.18em}
          .kf-ra-premium-language{justify-self:end;display:flex;align-items:center;gap:9px;color:#778791;font:900 9px var(--font-body,sans-serif);letter-spacing:.11em;text-transform:uppercase}
          .kf-ra-premium-language select{outline:none}

          .premium-eyebrow{color:#ff7a00;font:900 10px var(--font-body,sans-serif);letter-spacing:.18em;text-transform:uppercase}
          .kf-ra-premium-hero{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 235px;gap:30px;align-items:center;min-height:360px;padding:39px;overflow:hidden;border-radius:34px;border:1px solid rgba(80,136,168,.25);background:radial-gradient(circle at 88% 4%,rgba(57,132,169,.36),transparent 31%),radial-gradient(circle at 4% 100%,rgba(255,155,91,.17),transparent 28%),linear-gradient(145deg,#16364f 0%,#0f253a 58%,#09192a 100%);box-shadow:0 30px 72px rgba(7,28,45,.18)}
          .hero-glow{position:absolute;border-radius:50%;pointer-events:none}.glow-blue{width:220px;height:220px;top:-128px;right:-38px;background:rgba(137,199,224,.15)}.glow-orange{width:165px;height:165px;bottom:-102px;left:-62px;background:rgba(255,169,104,.13)}
          .hero-copy{position:relative;z-index:1}.kf-ra-premium-hero h1{max-width:850px;margin:8px 0 11px;color:#f7f9fc;font:800 clamp(48px,6.1vw,76px)/.93 var(--font-display,sans-serif);letter-spacing:-.055em}.kf-ra-premium-hero h1 span{color:#ff7a00}
          .kf-ra-hero-subtitle{max-width:700px;color:#d9e6ef;font:800 20px/1.25 var(--font-display,sans-serif)}.hero-copy>p{max-width:790px;margin:13px 0 0;color:#a8bdcb;font:500 13px/1.82 var(--font-body,sans-serif)}
          .hero-identity{position:relative;z-index:1;min-height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(151,194,215,.16);border-radius:28px;background:rgba(255,255,255,.045)}
          .hero-identity-icon{width:90px;height:90px;display:grid;place-items:center;margin-bottom:5px;border-radius:25px;background:#ff7a00;font-size:41px;box-shadow:0 18px 35px rgba(255,122,0,.17)}.hero-identity-line{width:1px;height:12px;background:rgba(176,210,225,.32)}
          .hero-identity>span{color:#9fb7c5;font:900 8px var(--font-body,sans-serif);letter-spacing:.15em}.hero-arrow{color:#ff9758!important;font-size:10px!important}

          .kf-ra-location-control,.kf-ra-selected-area,.kf-ra-people-section,.kf-ra-authorities-section{margin-top:18px;padding:27px;border-radius:30px;border:1px solid rgba(211,223,229,.9);background:rgba(255,255,255,.78);box-shadow:0 20px 56px rgba(16,32,51,.05)}
          .kf-ra-location-control{display:grid;grid-template-columns:.72fr 1.28fr;gap:22px}
          .location-control-intro h2,.section-header-row h2{margin:5px 0 7px;color:#263a4e;font:800 clamp(28px,3.6vw,42px)/1.03 var(--font-display,sans-serif);letter-spacing:-.043em}.location-control-intro p,.section-header-row p{max-width:790px;margin:0;color:#6d7c87;font:500 12px/1.75 var(--font-body,sans-serif)}
          .location-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.location-mode{display:flex;align-items:flex-start;gap:10px;min-width:0;padding:16px;border:1px solid rgba(70,105,123,.13);border-radius:21px;background:rgba(255,255,255,.8);text-align:left;cursor:pointer;transition:.17s ease}.location-mode:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 25px rgba(16,32,51,.06)}.location-mode.active{border-color:rgba(255,122,0,.46);background:linear-gradient(145deg,#fff8ef,#eef7fa);box-shadow:0 12px 26px rgba(255,122,0,.07)}.location-mode:disabled{opacity:.7;cursor:wait}
          .location-mode-icon{width:39px;height:39px;flex:0 0 auto;display:grid;place-items:center;border-radius:13px;background:#eef5f9;color:#ff7a00;font:900 18px var(--font-display,sans-serif)}.location-mode strong,.location-mode em{display:block}.location-mode strong{color:#2e4558;font:800 13px/1.08 var(--font-display,sans-serif)}.location-mode em{margin-top:5px;color:#76858e;font:500 9px/1.55 var(--font-body,sans-serif);font-style:normal}

          .selected-area-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}.selected-area-heading h2{margin:5px 0 0;color:#263e52;font:800 clamp(29px,3.8vw,43px)/1.02 var(--font-display,sans-serif);letter-spacing:-.045em}.selected-area-path{margin-top:4px;color:#7c8b95;font:700 10px var(--font-body,sans-serif)}
          .selected-area-badge{padding:8px 12px;border-radius:999px;font:900 8px var(--font-body,sans-serif);letter-spacing:.08em;text-transform:uppercase}.selected-area-badge.mode-profile{color:#4d7461;background:#edf7f2;border:1px solid #cee2d7}.selected-area-badge.mode-current{color:#a05f39;background:#fff0e6;border:1px solid #edd6c4}.selected-area-badge.mode-manual{color:#695a84;background:#f4eff8;border:1px solid #dfd4e9}
          .resolved-area-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px;margin-top:18px}.resolved-area-cell{min-height:78px;padding:13px;border-radius:17px;border:1px solid rgba(71,105,123,.1);background:rgba(255,255,255,.72)}.resolved-area-cell span{display:block;color:#85939d;font:900 7px var(--font-body,sans-serif);letter-spacing:.12em;text-transform:uppercase}.resolved-area-cell strong{display:block;margin-top:6px;color:#3a5568;font:800 11px/1.35 var(--font-body,sans-serif)}
          .manual-area-panel{margin-top:18px;padding:18px;border-radius:22px;border:1px solid #e0dbd3;background:#fffdf9}.manual-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.manual-grid label{display:grid;gap:6px}.manual-grid label span{color:#7f8c95;font:900 7px var(--font-body,sans-serif);letter-spacing:.12em;text-transform:uppercase}.manual-grid select,.manual-grid input{width:100%;min-height:43px;padding:10px 12px;border:1px solid #d8e0e3;border-radius:14px;background:#fff;color:#3c5465;font:700 10px var(--font-body,sans-serif);outline:none}.manual-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:13px}
          .kf-ra-orange-button,.kf-ra-location-button{min-height:42px;padding:10px 16px;border-radius:999px;font:900 10px var(--font-body,sans-serif);cursor:pointer}.kf-ra-orange-button{border:0;background:#ff7a00;color:#fff;box-shadow:0 10px 22px rgba(255,122,0,.16)}.kf-ra-location-button{border:1px solid #d5e0e4;background:#edf4f7;color:#405b6c}.kf-ra-alert{margin-top:12px;padding:10px 12px;border-radius:14px;border:1px solid #f0d2c2;background:#fff0e8;color:#89634f;font:800 9.5px/1.55 var(--font-body,sans-serif)}

          .section-header-row{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.section-index{padding:8px 11px;border-radius:999px;border:1px solid #dfe6e9;background:#f4f7f8;color:#87959e;font:900 7px var(--font-body,sans-serif);letter-spacing:.15em}
          .representative-feature-grid{display:grid;grid-template-columns:1.25fr .88fr .88fr;gap:12px;margin-top:20px}.representative-feature{min-width:0;padding:20px;border-radius:26px;border:1px solid}.representative-feature-local{border-color:#c9e0ea;background:radial-gradient(circle at 95% 0%,rgba(174,218,235,.34),transparent 30%),linear-gradient(145deg,#eaf7fb,#fbfdfe)}.representative-feature-mla{border-color:#d9cee8;background:radial-gradient(circle at 95% 0%,rgba(221,205,239,.36),transparent 31%),linear-gradient(145deg,#f5effa,#fdfbfe)}.representative-feature-mp{border-color:#cfe2d6;background:radial-gradient(circle at 95% 0%,rgba(193,225,201,.38),transparent 31%),linear-gradient(145deg,#edf8f1,#fcfdfc)}
          .rep-feature-top{display:flex;justify-content:space-between;gap:12px}.rep-feature-icon{width:44px;height:44px;display:grid;place-items:center;margin-bottom:10px;border-radius:15px;background:rgba(255,255,255,.78);font-size:20px}.rep-feature-kicker{color:#ff7a00;font:900 8px var(--font-body,sans-serif);letter-spacing:.12em;text-transform:uppercase}.rep-feature-top h3{margin:4px 0 4px;color:#304b5d;font:800 20px/1.05 var(--font-display,sans-serif);letter-spacing:-.03em}.rep-feature-top p{margin:0;color:#74848d;font:500 9.5px/1.55 var(--font-body,sans-serif)}.rep-feature-count{width:30px;height:30px;display:grid;place-items:center;flex:0 0 auto;border-radius:999px;background:rgba(255,255,255,.72);color:#6f8190;font:900 9px var(--font-body,sans-serif)}
          .rep-list{display:grid;gap:9px;margin-top:16px}.rep-person{display:flex;gap:10px;padding:13px;border-radius:18px;background:rgba(255,255,255,.68);border:1px solid rgba(75,104,123,.1)}.rep-avatar{width:44px;height:44px;flex:0 0 auto;display:grid;place-items:center;border-radius:14px;background:rgba(255,255,255,.84);color:#5a7080;font:900 7px var(--font-body,sans-serif)}.rep-role{color:#87949d;font:900 7px var(--font-body,sans-serif);letter-spacing:.11em;text-transform:uppercase}.rep-person h4{margin:4px 0 0;color:#2e4658;font:800 18px/1.05 var(--font-display,sans-serif);letter-spacing:-.025em}.rep-facts{display:grid;gap:7px;margin-top:10px}.rep-facts span{display:block;color:#8a969f;font:900 7px var(--font-body,sans-serif);letter-spacing:.11em;text-transform:uppercase}.rep-facts strong{display:block;margin-top:2px;color:#536b79;font:800 9.5px/1.45 var(--font-body,sans-serif)}.rep-person a,.kf-ra-source-text{display:inline-flex;margin-top:11px;color:#5e7a8b;font:800 8px var(--font-body,sans-serif);text-decoration:none}.rep-empty{display:grid;gap:5px;margin-top:16px;padding:14px;border-radius:17px;border:1px dashed rgba(74,106,124,.16);background:rgba(255,255,255,.6)}.rep-empty strong{color:#506978;font:800 10px var(--font-body,sans-serif)}.rep-empty span{color:#788892;font:500 8.5px/1.6 var(--font-body,sans-serif)}

          .local-government-banner{display:flex;align-items:center;gap:13px;margin-top:19px;padding:20px;border-radius:25px;border:1px solid #cfe3d8;background:radial-gradient(circle at 96% 0%,rgba(116,193,165,.24),transparent 28%),linear-gradient(145deg,#edf8f3,#f9fbfa)}.kf-ra-lgd-icon{width:56px;height:56px;display:grid;place-items:center;flex:0 0 auto;border-radius:18px;background:#fffdf8;font-size:25px}.local-government-banner span{color:#5c8875;font:900 7px var(--font-body,sans-serif);letter-spacing:.13em;text-transform:uppercase}.local-government-banner h3{margin:4px 0 0;color:#2e4d41;font:800 23px/1.06 var(--font-display,sans-serif);letter-spacing:-.03em}.local-government-banner p{margin:5px 0 0;color:#6d7d76;font:500 9px/1.6 var(--font-body,sans-serif)}.local-government-banner>strong{margin-left:auto;padding:7px 10px;border-radius:999px;background:#f8fdf9;border:1px solid #d6e8df;color:#608173;font:900 7px var(--font-body,sans-serif);letter-spacing:.08em}
          .authority-directory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px;margin-top:16px}.authority-directory-card{padding:16px;border-radius:20px;border:1px solid #d6e1e6;background:linear-gradient(145deg,#f5fafc,#fffdfa)}.authority-heading{display:flex;align-items:flex-start;gap:9px}.authority-dot{width:8px;height:8px;flex:0 0 auto;margin-top:5px;border-radius:50%;background:#ff7a00;box-shadow:0 0 0 5px rgba(255,122,0,.09)}.authority-heading h4{margin:0;color:#354f61;font:800 15px/1.12 var(--font-display,sans-serif)}.authority-heading div>span{display:block;margin-top:3px;color:#798892;font:700 8px/1.45 var(--font-body,sans-serif)}.authority-categories{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.authority-categories span{padding:5px 7px;border-radius:999px;border:1px solid #dce6ea;background:#f7fbfc;color:#687b87;font:800 7px var(--font-body,sans-serif)}.authority-method{margin-top:10px}.authority-method span{display:block;color:#8a969d;font:900 7px var(--font-body,sans-serif);letter-spacing:.12em;text-transform:uppercase}.authority-method strong{display:block;margin-top:3px;color:#4d6675;font:800 9px var(--font-body,sans-serif)}.authority-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.authority-links a{color:#5e7b8c;font:900 8px var(--font-body,sans-serif);text-decoration:none}
          .kf-ra-loading-box,.kf-ra-empty-panel{margin-top:18px;padding:18px;border-radius:19px;background:#f1f7fa;border:1px solid #d6e4e9}.kf-ra-empty-panel strong{display:block;color:#3e5667;font:800 15px var(--font-display,sans-serif)}.kf-ra-empty-panel span{display:block;margin-top:5px;color:#758691;font:500 9.5px/1.6 var(--font-body,sans-serif)}
          .kf-ra-neutrality-section{display:flex;align-items:center;gap:17px;margin-top:18px;padding:24px 26px;border-radius:28px;background:linear-gradient(135deg,#182e3d,#1d3445 58%,#342723);border:1px solid rgba(164,194,210,.12);box-shadow:0 22px 55px rgba(9,25,38,.16)}.neutrality-symbol{width:56px;height:56px;flex:0 0 auto;display:grid;place-items:center;border-radius:18px;background:#ff7a00;color:#fff;font:900 26px var(--font-display,sans-serif)}.kf-ra-neutrality-section h2{margin:4px 0 5px;color:#f6f9fc;font:800 clamp(24px,3vw,31px)/1.03 var(--font-display,sans-serif);letter-spacing:-.035em}.kf-ra-neutrality-section p{max-width:850px;margin:0;color:#b9cad5;font:500 10px/1.7 var(--font-body,sans-serif)}
          .kf-ra-report-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:18px;padding:21px 23px;border-radius:24px;border:1px solid #edd7be;background:linear-gradient(145deg,#fff1df,#f8eee2)}.kf-ra-report-bar p{max-width:800px;margin:6px 0 0;color:#786b60;font:500 9.5px/1.65 var(--font-body,sans-serif)}
          .kf-ra-premium-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:30px;padding:22px 3px 0;border-top:1px solid rgba(43,65,81,.1);color:#87939c;font:800 8.5px var(--font-body,sans-serif);text-align:center}.footer-wordmark{font:900 20px var(--font-display,sans-serif);letter-spacing:-.045em}.footer-wordmark span{color:#102033}.footer-wordmark b{color:#ff7a00}
          @media(max-width:980px){.kf-ra-premium-hero,.kf-ra-location-control,.representative-feature-grid{grid-template-columns:1fr}.hero-identity{min-height:175px;flex-direction:row}.hero-identity-line,.hero-arrow{transform:rotate(-90deg)}.location-modes,.manual-grid{grid-template-columns:1fr 1fr}.resolved-area-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
          @media(max-width:650px){.kf-responsible-authorities-page{padding:12px 10px 55px!important}.kf-ra-premium-header{grid-template-columns:1fr auto;border-radius:23px}.kf-ra-premium-brand{grid-column:1/-1;grid-row:1}.kf-ra-back-button{grid-column:1}.kf-ra-premium-language{grid-column:2}.kf-ra-premium-hero,.kf-ra-location-control,.kf-ra-selected-area,.kf-ra-people-section,.kf-ra-authorities-section{padding:21px;border-radius:24px}.kf-ra-premium-hero h1{font-size:46px}.location-modes,.manual-grid,.resolved-area-grid,.authority-directory-grid{grid-template-columns:1fr}.selected-area-heading,.section-header-row,.kf-ra-report-bar,.kf-ra-premium-footer{flex-direction:column;align-items:flex-start}.selected-area-badge,.section-index{align-self:flex-start}.local-government-banner{flex-wrap:wrap;align-items:flex-start}.local-government-banner>strong{margin-left:0}.kf-ra-neutrality-section{align-items:flex-start}}
          html[data-theme="dark"] .kf-responsible-authorities-page{background:radial-gradient(circle at 4% 2%,rgba(24,191,255,.07),transparent 25%),radial-gradient(circle at 96% 6%,rgba(255,122,0,.08),transparent 24%),linear-gradient(180deg,#06111d 0%,#071a2a 56%,#050c16 100%)!important}
          html[data-theme="dark"] .kf-ra-premium-header,html[data-theme="dark"] .kf-ra-location-control,html[data-theme="dark"] .kf-ra-selected-area,html[data-theme="dark"] .kf-ra-people-section,html[data-theme="dark"] .kf-ra-authorities-section{border-color:rgba(125,162,193,.14);background:rgba(10,28,45,.90);box-shadow:0 24px 65px rgba(0,0,0,.23)}
          html[data-theme="dark"] .kf-ra-back-button,html[data-theme="dark"] .kf-ra-premium-language select{border-color:rgba(215,224,236,.11);background:rgba(15,36,55,.84);color:#dce7f0}.html[data-theme="dark"] .kf-ra-premium-wordmark span{color:#fff}
          html[data-theme="dark"] .kf-ra-premium-wordmark span{color:#fff}html[data-theme="dark"] .kf-ra-premium-sub,html[data-theme="dark"] .kf-ra-premium-language{color:#8ea5b8}
          html[data-theme="dark"] .location-control-intro h2,html[data-theme="dark"] .section-header-row h2,html[data-theme="dark"] .selected-area-heading h2{color:#f5f8fb}html[data-theme="dark"] .location-control-intro p,html[data-theme="dark"] .section-header-row p{color:#aebfd0}
          html[data-theme="dark"] .location-mode,html[data-theme="dark"] .resolved-area-cell,html[data-theme="dark"] .manual-area-panel,html[data-theme="dark"] .rep-person{border-color:rgba(125,162,193,.13);background:rgba(16,40,64,.78)}html[data-theme="dark"] .location-mode.active{background:linear-gradient(145deg,#243343,#18394c);border-color:rgba(255,145,71,.40)}
          html[data-theme="dark"] .location-mode strong,html[data-theme="dark"] .resolved-area-cell strong{color:#edf4fa}html[data-theme="dark"] .location-mode em,html[data-theme="dark"] .resolved-area-cell span,html[data-theme="dark"] .selected-area-path{color:#90a7b8}
          html[data-theme="dark"] .manual-grid select,html[data-theme="dark"] .manual-grid input{background:#0e253a;border-color:rgba(215,224,236,.13);color:#dbe6ef}html[data-theme="dark"] .manual-grid select option{background:#0e253a;color:#dbe6ef}
          html[data-theme="dark"] .representative-feature-local{border-color:rgba(70,137,169,.34);background:linear-gradient(145deg,#143550,#10293f)}html[data-theme="dark"] .representative-feature-mla{border-color:rgba(140,107,170,.32);background:linear-gradient(145deg,#2a2340,#1f2841)}html[data-theme="dark"] .representative-feature-mp{border-color:rgba(78,157,125,.32);background:linear-gradient(145deg,#153a34,#112d31)}
          html[data-theme="dark"] .rep-feature-top h3,html[data-theme="dark"] .rep-person h4{color:#f1f6fa}html[data-theme="dark"] .rep-feature-top p,html[data-theme="dark"] .rep-facts span,html[data-theme="dark"] .rep-facts strong,html[data-theme="dark"] .rep-role,html[data-theme="dark"] .rep-empty span{color:#9eb4c4}html[data-theme="dark"] .rep-person a,html[data-theme="dark"] .kf-ra-source-text{color:#9eb7c8}html[data-theme="dark"] .rep-empty{background:rgba(255,255,255,.04);border-color:rgba(125,162,193,.18)}html[data-theme="dark"] .rep-empty strong{color:#edf4fa}
          html[data-theme="dark"] .local-government-banner{border-color:rgba(108,189,162,.16);background:radial-gradient(circle at 96% 0%,rgba(108,193,164,.16),transparent 28%),#153b3a}html[data-theme="dark"] .local-government-banner span,html[data-theme="dark"] .local-government-banner p{color:#9dbab2}html[data-theme="dark"] .local-government-banner h3{color:#f4f8fa}html[data-theme="dark"] .local-government-banner>strong{background:rgba(255,255,255,.05);color:#b0c8be;border-color:rgba(109,189,162,.14)}
          html[data-theme="dark"] .authority-directory-card{border-color:rgba(125,162,193,.14);background:linear-gradient(145deg,#14334a,#10283d)}html[data-theme="dark"] .authority-heading h4{color:#f0f6fa}html[data-theme="dark"] .authority-heading div>span,html[data-theme="dark"] .authority-method span{color:#90a7b9}html[data-theme="dark"] .authority-categories span{background:rgba(255,255,255,.05);border-color:rgba(215,224,236,.10);color:#a8bccb}html[data-theme="dark"] .authority-method strong,html[data-theme="dark"] .authority-links a{color:#a3bbca}
          html[data-theme="dark"] .kf-ra-loading-box,html[data-theme="dark"] .kf-ra-empty-panel{background:#102840;border-color:rgba(125,162,193,.14)}html[data-theme="dark"] .kf-ra-empty-panel strong{color:#eef5fa}html[data-theme="dark"] .kf-ra-empty-panel span{color:#9eb3c4}
          html[data-theme="dark"] .kf-ra-neutrality-section{background:linear-gradient(135deg,#1a303f,#152d3e 60%,#34251f)}html[data-theme="dark"] .kf-ra-neutrality-section p{color:#b7c8d3}html[data-theme="dark"] .kf-ra-report-bar{border-color:rgba(255,177,117,.14);background:linear-gradient(145deg,#3a281d,#2b1c17)}html[data-theme="dark"] .kf-ra-report-bar p{color:#d8c4b7}html[data-theme="dark"] .kf-ra-premium-footer{border-top-color:rgba(215,224,236,.10);color:#8298ac}html[data-theme="dark"] .footer-wordmark span{color:#fff}

          /* RESPONSIBLE AUTHORITIES — FINAL 2026 THEME PASS */

          .kf-responsible-authorities-page {
            background:
              radial-gradient(circle at 5% 0%, rgba(223,234,243,.58), transparent 27%),
              radial-gradient(circle at 95% 2%, rgba(255,215,179,.42), transparent 25%),
              #f8f3ea !important;
            color: #172536 !important;
          }

          .kf-responsible-authorities-page h1,
          .kf-responsible-authorities-page h2,
          .kf-responsible-authorities-page h3,
          .kf-responsible-authorities-page h4 {
            color: #172536 !important;
            text-shadow: none !important;
          }

          .kf-responsible-authorities-page p {
            color: #536677 !important;
          }

          .kf-responsible-authorities-page .kf-ra-current-authorities-block {
            margin: 18px 0 24px;
            padding: 24px;
            border-radius: 28px;
            background: linear-gradient(145deg,#f1f7fa,#ffffff) !important;
            border: 1px solid #d7e4e9 !important;
          }

          .kf-responsible-authorities-page .current-authorities-heading {
            display:flex;
            justify-content:space-between;
            gap:24px;
            align-items:flex-end;
            margin-bottom:18px;
          }

          .kf-responsible-authorities-page .current-authorities-heading h3 {
            margin:7px 0 0;
            font-size:26px;
            line-height:1.05;
          }

          .kf-responsible-authorities-page .current-authorities-heading p {
            max-width:720px;
            margin:8px 0 0;
          }

          .kf-responsible-authorities-page .current-authorities-index {
            color:#80909c;
            font:900 9px var(--font-body,sans-serif);
            letter-spacing:.16em;
            white-space:nowrap;
          }

          .kf-responsible-authorities-page .current-authorities-grid {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:12px;
          }

          .kf-responsible-authorities-page .current-authority-card {
            padding:19px;
            border-radius:21px;
            background:#fff !important;
            border:1px solid rgba(16,27,43,.09) !important;
            box-shadow:0 12px 28px rgba(16,27,43,.045) !important;
          }

          .kf-responsible-authorities-page .current-authority-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
          }

          .kf-responsible-authorities-page .current-authority-icon {
            width:38px;
            height:38px;
            display:grid;
            place-items:center;
            border-radius:12px;
            background:#eef5f8;
            border:1px solid #dae7eb;
          }

          .kf-responsible-authorities-page .current-authority-type {
            color:#d76d19;
            font:900 9px var(--font-body,sans-serif);
            letter-spacing:.12em;
            text-transform:uppercase;
          }

          .kf-responsible-authorities-page .current-authority-card h4 {
            margin:14px 0 12px;
            color:#1d3549 !important;
            font-size:20px;
            line-height:1.08;
          }

          .kf-responsible-authorities-page .current-authority-row,
          .kf-responsible-authorities-page .current-authority-holder {
            display:grid;
            gap:5px;
            padding:10px 12px;
            margin-top:7px;
            border-radius:14px;
            background:#f5f9fa;
            border:1px solid #e0e9ed;
          }

          .kf-responsible-authorities-page .current-authority-row span,
          .kf-responsible-authorities-page .current-authority-holder span {
            color:#778996;
            font-size:9px;
            font-weight:900;
            letter-spacing:.11em;
            text-transform:uppercase;
          }

          .kf-responsible-authorities-page .current-authority-row strong,
          .kf-responsible-authorities-page .current-authority-holder strong {
            color:#304a5d;
            font-size:13px;
          }

          .kf-responsible-authorities-page .current-authority-description {
            margin:11px 0 0 !important;
            color:#657988 !important;
            font-size:11px;
            line-height:1.55;
          }

          .kf-responsible-authorities-page .current-authority-checked {
            margin-top:11px;
            color:#8998a4;
            font-size:9px;
            font-weight:800;
          }

          .kf-responsible-authorities-page .current-authority-source {
            display:inline-flex;
            margin-top:9px;
            color:#e86f14 !important;
            font-size:10px;
            font-weight:900;
            text-decoration:none;
          }

          /* Light-mode contrast exceptions for intentionally dark surfaces.
             The final light-theme pass above sets generic h1/h2/p colors with
             !important; these selectors restore readable light text inside
             the dark hero and neutrality panels without changing the rest
             of the light theme. */
          .kf-responsible-authorities-page .kf-ra-premium-hero h1 {
            color:#f7f9fc !important;
          }
          .kf-responsible-authorities-page .kf-ra-premium-hero .kf-ra-hero-subtitle {
            color:#d9e6ef !important;
          }
          .kf-responsible-authorities-page .kf-ra-premium-hero .hero-copy>p {
            color:#a8bdcb !important;
          }
          .kf-responsible-authorities-page .kf-ra-neutrality-section h2 {
            color:#f6f9fc !important;
          }
          .kf-responsible-authorities-page .kf-ra-neutrality-section p {
            color:#b9cad5 !important;
          }

          /* Dark mode */
          html[data-theme="dark"] .kf-responsible-authorities-page {
            background:
              radial-gradient(circle at 4% 0%,rgba(79,181,255,.055),transparent 24%),
              radial-gradient(circle at 96% 2%,rgba(255,122,26,.065),transparent 23%),
              linear-gradient(180deg,#07111f 0%,#081827 55%,#06101c 100%) !important;
            color:#edf4fa !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page h1,
          html[data-theme="dark"] .kf-responsible-authorities-page h2,
          html[data-theme="dark"] .kf-responsible-authorities-page h3,
          html[data-theme="dark"] .kf-responsible-authorities-page h4 {
            color:#f7fafc !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page p {
            color:#bdccda !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .kf-ra-current-authorities-block {
            background:linear-gradient(145deg,#0e2439,#0b1a2c) !important;
            border-color:rgba(126,165,196,.16) !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authorities-index {
            color:#8098ac !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-card {
            background:#112a43 !important;
            border-color:rgba(125,162,193,.16) !important;
            box-shadow:0 12px 28px rgba(0,0,0,.18) !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-icon {
            background:#17364f !important;
            border-color:rgba(143,181,211,.18) !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-card h4 {
            color:#f7fafc !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-row,
          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-holder {
            background:rgba(255,255,255,.045) !important;
            border-color:rgba(215,224,236,.09) !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-row span,
          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-holder span {
            color:#8fa5b8 !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-row strong,
          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-holder strong {
            color:#dce7ef !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-description {
            color:#b2c4d2 !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-checked {
            color:#839aab !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .current-authority-source {
            color:#ff9347 !important;
          }

          @media (max-width:760px) {
            .kf-responsible-authorities-page .current-authorities-heading {
              align-items:flex-start;
              flex-direction:column;
            }
            .kf-responsible-authorities-page .current-authorities-grid {
              grid-template-columns:1fr;
            }
          }

          .kf-responsible-authorities-page .kf-ra-data-access-alert {
            margin: 16px 0 0;
            border-color: #e4b6a3 !important;
            background: #fff0e9 !important;
            color: #8a4d36 !important;
          }

          html[data-theme="dark"] .kf-responsible-authorities-page .kf-ra-data-access-alert {
            border-color: rgba(255,145,71,.25) !important;
            background: rgba(255,122,26,.08) !important;
            color: #e1bca7 !important;
          }


          /* RESPONSIBLE AUTHORITIES — PASTEL LIGHT MODE */
          /* Light-mode panels use pastel blue, ivory and beige; dark mode remains unchanged. */
          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-premium-hero {
            border-color:#ddd4c8 !important;
            background:
              radial-gradient(circle at 90% 0%,rgba(183,211,220,.34),transparent 28%),
              radial-gradient(circle at 2% 100%,rgba(238,196,158,.28),transparent 27%),
              linear-gradient(135deg,#f5efe6 0%,#eef3f3 56%,#f8e9dc 100%) !important;
            box-shadow:0 24px 62px rgba(71,63,54,.10) !important;
            color:#172536 !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-premium-hero h1 {
            color:#172536 !important;
            text-shadow:none !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-hero-subtitle {
            color:#2b3d4e !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .hero-copy>p {
            color:#5c6973 !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .hero-identity {
            border-color:rgba(42,63,78,.12) !important;
            background:rgba(255,255,255,.40) !important;
            box-shadow:inset 0 1px 0 rgba(255,255,255,.72) !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .hero-identity-line {
            background:rgba(43,62,75,.20) !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .hero-identity>span {
            color:#5d6c75 !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .hero-arrow {
            color:#ff7a00 !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-neutrality-section {
            border-color:#dfd3c4 !important;
            background:
              radial-gradient(circle at 92% 0%,rgba(184,211,218,.25),transparent 25%),
              radial-gradient(circle at 4% 100%,rgba(239,194,152,.23),transparent 27%),
              linear-gradient(135deg,#f2e9de 0%,#edf2f1 57%,#f6e5d7 100%) !important;
            box-shadow:0 20px 48px rgba(71,63,54,.09) !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-neutrality-section h2 {
            color:#172536 !important;
            text-shadow:none !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .kf-ra-neutrality-section p {
            color:#5a6872 !important;
          }

          html:not([data-theme="dark"]) .kf-responsible-authorities-page .neutrality-symbol {
            background:#ff7a00 !important;
            color:#172536 !important;
            box-shadow:0 12px 26px rgba(255,122,0,.15) !important;
          }

`}</style>
    </main>
  );
}
