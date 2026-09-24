export type StateType = "State" | "Union Territory";

export type Language = "en" | "hi" | "mr";

export type LocalizedText = {
  en: string;
  hi: string;
  mr: string;
};

export type IndiaState = {
  slug: string;
  name: string;
  type: StateType;
  capital: string;

  /*
   * Localized display names.
   * English uses the original name/capital.
   * Hindi and Marathi use reviewed UI translations.
   */
  localizedName: LocalizedText;
  localizedCapital: LocalizedText;

  region: string;
  area: string;
  population2011: string;
  populationNote?: string;
  majorLanguages: string;

  /*
   * Optional fields for the richer State Spotlight experience.
   * We will populate these gradually with verified content.
   */
  shortDescription?: string;
  formationInfo?: string;
  geography?: string;
  governance?: string;
  culture?: string;
  famousPlaces?: string[];
  majorRivers?: string[];
  nationalParks?: string[];
  funFacts?: string[];
  heroImage?: string;
};

export const INDIA_DATA_SOURCE = {
  currentStructure:
    "Government of India National Portal — States and Union Territories",
  population:
    "Office of the Registrar General & Census Commissioner, India — Census 2011",
} as const;

/* ======================================================= */
/* LOCALIZED STATE + CAPITAL NAMES                         */
/* ======================================================= */

export const INDIA_STATE_LOCALIZATION: Record<
  string,
  {
    hi: {
      name: string;
      capital: string;
    };
    mr: {
      name: string;
      capital: string;
    };
  }
> = {
  "andhra-pradesh": {
    hi: {
      name: "आंध्र प्रदेश",
      capital: "अमरावती",
    },
    mr: {
      name: "आंध्र प्रदेश",
      capital: "अमरावती",
    },
  },

  "arunachal-pradesh": {
    hi: {
      name: "अरुणाचल प्रदेश",
      capital: "ईटानगर",
    },
    mr: {
      name: "अरुणाचल प्रदेश",
      capital: "ईटानगर",
    },
  },

  assam: {
    hi: {
      name: "असम",
      capital: "दिसपुर",
    },
    mr: {
      name: "आसाम",
      capital: "दिसपूर",
    },
  },

  bihar: {
    hi: {
      name: "बिहार",
      capital: "पटना",
    },
    mr: {
      name: "बिहार",
      capital: "पाटणा",
    },
  },

  chhattisgarh: {
    hi: {
      name: "छत्तीसगढ़",
      capital: "रायपुर",
    },
    mr: {
      name: "छत्तीसगड",
      capital: "रायपूर",
    },
  },

  goa: {
    hi: {
      name: "गोवा",
      capital: "पणजी",
    },
    mr: {
      name: "गोवा",
      capital: "पणजी",
    },
  },

  gujarat: {
    hi: {
      name: "गुजरात",
      capital: "गांधीनगर",
    },
    mr: {
      name: "गुजरात",
      capital: "गांधीनगर",
    },
  },

  haryana: {
    hi: {
      name: "हरियाणा",
      capital: "चंडीगढ़",
    },
    mr: {
      name: "हरियाणा",
      capital: "चंदीगड",
    },
  },

  "himachal-pradesh": {
    hi: {
      name: "हिमाचल प्रदेश",
      capital: "शिमला",
    },
    mr: {
      name: "हिमाचल प्रदेश",
      capital: "शिमला",
    },
  },

  jharkhand: {
    hi: {
      name: "झारखंड",
      capital: "रांची",
    },
    mr: {
      name: "झारखंड",
      capital: "रांची",
    },
  },

  karnataka: {
    hi: {
      name: "कर्नाटक",
      capital: "बेंगलुरु",
    },
    mr: {
      name: "कर्नाटक",
      capital: "बेंगळुरू",
    },
  },

  kerala: {
    hi: {
      name: "केरल",
      capital: "तिरुवनंतपुरम",
    },
    mr: {
      name: "केरळ",
      capital: "तिरुवनंतपुरम",
    },
  },

  "madhya-pradesh": {
    hi: {
      name: "मध्य प्रदेश",
      capital: "भोपाल",
    },
    mr: {
      name: "मध्य प्रदेश",
      capital: "भोपाळ",
    },
  },

  maharashtra: {
    hi: {
      name: "महाराष्ट्र",
      capital: "मुंबई",
    },
    mr: {
      name: "महाराष्ट्र",
      capital: "मुंबई",
    },
  },

  manipur: {
    hi: {
      name: "मणिपुर",
      capital: "इंफाल",
    },
    mr: {
      name: "मणिपूर",
      capital: "इंफाळ",
    },
  },

  meghalaya: {
    hi: {
      name: "मेघालय",
      capital: "शिलांग",
    },
    mr: {
      name: "मेघालय",
      capital: "शिलाँग",
    },
  },

  mizoram: {
    hi: {
      name: "मिजोरम",
      capital: "आइजोल",
    },
    mr: {
      name: "मिझोराम",
      capital: "आयझॉल",
    },
  },

  nagaland: {
    hi: {
      name: "नागालैंड",
      capital: "कोहिमा",
    },
    mr: {
      name: "नागालँड",
      capital: "कोहिमा",
    },
  },

  odisha: {
    hi: {
      name: "ओडिशा",
      capital: "भुवनेश्वर",
    },
    mr: {
      name: "ओडिशा",
      capital: "भुवनेश्वर",
    },
  },

  punjab: {
    hi: {
      name: "पंजाब",
      capital: "चंडीगढ़",
    },
    mr: {
      name: "पंजाब",
      capital: "चंदीगड",
    },
  },

  rajasthan: {
    hi: {
      name: "राजस्थान",
      capital: "जयपुर",
    },
    mr: {
      name: "राजस्थान",
      capital: "जयपूर",
    },
  },

  sikkim: {
    hi: {
      name: "सिक्किम",
      capital: "गंगटोक",
    },
    mr: {
      name: "सिक्कीम",
      capital: "गंगटोक",
    },
  },

  "tamil-nadu": {
    hi: {
      name: "तमिलनाडु",
      capital: "चेन्नई",
    },
    mr: {
      name: "तामिळनाडू",
      capital: "चेन्नई",
    },
  },

  telangana: {
    hi: {
      name: "तेलंगाना",
      capital: "हैदराबाद",
    },
    mr: {
      name: "तेलंगणा",
      capital: "हैदराबाद",
    },
  },

  tripura: {
    hi: {
      name: "त्रिपुरा",
      capital: "अगरतला",
    },
    mr: {
      name: "त्रिपुरा",
      capital: "अगरतळा",
    },
  },

  "uttar-pradesh": {
    hi: {
      name: "उत्तर प्रदेश",
      capital: "लखनऊ",
    },
    mr: {
      name: "उत्तर प्रदेश",
      capital: "लखनौ",
    },
  },

  uttarakhand: {
    hi: {
      name: "उत्तराखंड",
      capital: "देहरादून",
    },
    mr: {
      name: "उत्तराखंड",
      capital: "देहरादून",
    },
  },

  "west-bengal": {
    hi: {
      name: "पश्चिम बंगाल",
      capital: "कोलकाता",
    },
    mr: {
      name: "पश्चिम बंगाल",
      capital: "कोलकाता",
    },
  },

  "andaman-and-nicobar-islands": {
    hi: {
      name: "अंडमान और निकोबार द्वीपसमूह",
      capital: "पोर्ट ब्लेयर",
    },
    mr: {
      name: "अंदमान आणि निकोबार बेटे",
      capital: "पोर्ट ब्लेअर",
    },
  },

  chandigarh: {
    hi: {
      name: "चंडीगढ़",
      capital: "चंडीगढ़",
    },
    mr: {
      name: "चंदीगड",
      capital: "चंदीगड",
    },
  },

  "dadra-and-nagar-haveli-and-daman-and-diu": {
    hi: {
      name: "दादरा और नगर हवेली और दमन और दीव",
      capital: "दमन",
    },
    mr: {
      name: "दादरा आणि नगर हवेली आणि दमण आणि दीव",
      capital: "दमण",
    },
  },

  delhi: {
    hi: {
      name: "दिल्ली",
      capital: "नई दिल्ली",
    },
    mr: {
      name: "दिल्ली",
      capital: "नवी दिल्ली",
    },
  },

  "jammu-and-kashmir": {
    hi: {
      name: "जम्मू और कश्मीर",
      capital: "श्रीनगर (ग्रीष्म) · जम्मू (शीतकाल)",
    },
    mr: {
      name: "जम्मू आणि काश्मीर",
      capital: "श्रीनगर (उन्हाळी) · जम्मू (हिवाळी)",
    },
  },

  ladakh: {
    hi: {
      name: "लद्दाख",
      capital: "लेह",
    },
    mr: {
      name: "लडाख",
      capital: "लेह",
    },
  },

  lakshadweep: {
    hi: {
      name: "लक्षद्वीप",
      capital: "कवरत्ती",
    },
    mr: {
      name: "लक्षद्वीप",
      capital: "कवरत्ती",
    },
  },

  puducherry: {
    hi: {
      name: "पुडुचेरी",
      capital: "पुडुचेरी",
    },
    mr: {
      name: "पुद्दुचेरी",
      capital: "पुद्दुचेरी",
    },
  },
};

/* ======================================================= */
/* STATES + UNION TERRITORIES                               */
/* ======================================================= */

const baseIndiaStates: IndiaState[] = [
  /* ======================================================= */
  /* STATES                                                   */
  /* ======================================================= */

  {
    slug: "andhra-pradesh",
    name: "Andhra Pradesh",
    type: "State",
    capital: "Amaravati",

    localizedName: {
      en: "Andhra Pradesh",
      hi: "आंध्र प्रदेश",
      mr: "आंध्र प्रदेश",
    },

    localizedCapital: {
      en: "Amaravati",
      hi: "अमरावती",
      mr: "अमरावती",
    },

    region: "South India",
    area: "162,968 km²",
    population2011: "4,93,86,799",
    majorLanguages: "Telugu",
  },

  {
    slug: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    type: "State",
    capital: "Itanagar",

    localizedName: {
      en: "Arunachal Pradesh",
      hi: "अरुणाचल प्रदेश",
      mr: "अरुणाचल प्रदेश",
    },

    localizedCapital: {
      en: "Itanagar",
      hi: "ईटानगर",
      mr: "ईटानगर",
    },

    region: "Northeast India",
    area: "83,743 km²",
    population2011: "13,83,727",
    majorLanguages:
      "English and several indigenous languages",
  },

  {
    slug: "assam",
    name: "Assam",
    type: "State",
    capital: "Dispur",

    localizedName: {
      en: "Assam",
      hi: "असम",
      mr: "आसाम",
    },

    localizedCapital: {
      en: "Dispur",
      hi: "दिसपुर",
      mr: "दिसपूर",
    },

    region: "Northeast India",
    area: "78,438 km²",
    population2011: "3,12,05,576",
    majorLanguages:
      "Assamese, Bengali, Bodo and others",
  },

  {
    slug: "bihar",
    name: "Bihar",
    type: "State",
    capital: "Patna",

    localizedName: {
      en: "Bihar",
      hi: "बिहार",
      mr: "बिहार",
    },

    localizedCapital: {
      en: "Patna",
      hi: "पटना",
      mr: "पाटणा",
    },

    region: "Eastern India",
    area: "94,163 km²",
    population2011: "10,40,99,452",
    majorLanguages:
      "Hindi, Maithili, Bhojpuri and others",
  },

  {
    slug: "chhattisgarh",
    name: "Chhattisgarh",
    type: "State",
    capital: "Raipur",

    localizedName: {
      en: "Chhattisgarh",
      hi: "छत्तीसगढ़",
      mr: "छत्तीसगड",
    },

    localizedCapital: {
      en: "Raipur",
      hi: "रायपुर",
      mr: "रायपूर",
    },

    region: "Central India",
    area: "135,192 km²",
    population2011: "2,55,45,198",
    majorLanguages:
      "Hindi, Chhattisgarhi and others",
  },

  {
    slug: "goa",
    name: "Goa",
    type: "State",
    capital: "Panaji",

    localizedName: {
      en: "Goa",
      hi: "गोवा",
      mr: "गोवा",
    },

    localizedCapital: {
      en: "Panaji",
      hi: "पणजी",
      mr: "पणजी",
    },

    region: "Western India",
    area: "3,702 km²",
    population2011: "14,58,545",
    majorLanguages:
      "Konkani, Marathi and English",
  },

  {
    slug: "gujarat",
    name: "Gujarat",
    type: "State",
    capital: "Gandhinagar",

    localizedName: {
      en: "Gujarat",
      hi: "गुजरात",
      mr: "गुजरात",
    },

    localizedCapital: {
      en: "Gandhinagar",
      hi: "गांधीनगर",
      mr: "गांधीनगर",
    },

    region: "Western India",
    area: "196,024 km²",
    population2011: "6,04,39,692",
    majorLanguages:
      "Gujarati, Hindi and English",
  },

  {
    slug: "haryana",
    name: "Haryana",
    type: "State",
    capital: "Chandigarh",

    localizedName: {
      en: "Haryana",
      hi: "हरियाणा",
      mr: "हरियाणा",
    },

    localizedCapital: {
      en: "Chandigarh",
      hi: "चंडीगढ़",
      mr: "चंदीगड",
    },

    region: "Northern India",
    area: "44,212 km²",
    population2011: "2,53,51,462",
    majorLanguages: "Hindi and Punjabi",
  },

  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    type: "State",
    capital: "Shimla",

    localizedName: {
      en: "Himachal Pradesh",
      hi: "हिमाचल प्रदेश",
      mr: "हिमाचल प्रदेश",
    },

    localizedCapital: {
      en: "Shimla",
      hi: "शिमला",
      mr: "शिमला",
    },

    region: "Northern India",
    area: "55,673 km²",
    population2011: "68,64,602",
    majorLanguages:
      "Hindi and regional Pahari languages",
  },

  {
    slug: "jharkhand",
    name: "Jharkhand",
    type: "State",
    capital: "Ranchi",

    localizedName: {
      en: "Jharkhand",
      hi: "झारखंड",
      mr: "झारखंड",
    },

    localizedCapital: {
      en: "Ranchi",
      hi: "रांची",
      mr: "रांची",
    },

    region: "Eastern India",
    area: "79,716 km²",
    population2011: "3,29,88,134",
    majorLanguages:
      "Hindi, Santali and others",
  },

  {
    slug: "karnataka",
    name: "Karnataka",
    type: "State",
    capital: "Bengaluru",

    localizedName: {
      en: "Karnataka",
      hi: "कर्नाटक",
      mr: "कर्नाटक",
    },

    localizedCapital: {
      en: "Bengaluru",
      hi: "बेंगलुरु",
      mr: "बेंगळुरू",
    },

    region: "South India",
    area: "191,791 km²",
    population2011: "6,10,95,297",
    majorLanguages:
      "Kannada, English and others",
  },

  {
    slug: "kerala",
    name: "Kerala",
    type: "State",
    capital: "Thiruvananthapuram",

    localizedName: {
      en: "Kerala",
      hi: "केरल",
      mr: "केरळ",
    },

    localizedCapital: {
      en: "Thiruvananthapuram",
      hi: "तिरुवनंतपुरम",
      mr: "तिरुवनंतपुरम",
    },

    region: "South India",
    area: "38,852 km²",
    population2011: "3,34,06,061",
    majorLanguages:
      "Malayalam and English",
  },

  {
    slug: "madhya-pradesh",
    name: "Madhya Pradesh",
    type: "State",
    capital: "Bhopal",

    localizedName: {
      en: "Madhya Pradesh",
      hi: "मध्य प्रदेश",
      mr: "मध्य प्रदेश",
    },

    localizedCapital: {
      en: "Bhopal",
      hi: "भोपाल",
      mr: "भोपाळ",
    },

    region: "Central India",
    area: "308,252 km²",
    population2011: "7,26,26,809",
    majorLanguages:
      "Hindi and regional languages",
  },

  {
    slug: "maharashtra",
    name: "Maharashtra",
    type: "State",
    capital: "Mumbai",

    localizedName: {
      en: "Maharashtra",
      hi: "महाराष्ट्र",
      mr: "महाराष्ट्र",
    },

    localizedCapital: {
      en: "Mumbai",
      hi: "मुंबई",
      mr: "मुंबई",
    },

    region: "Western India",
    area: "307,713 km²",
    population2011: "11,23,74,333",
    majorLanguages:
      "Marathi, Hindi and English",

    shortDescription:
      "Maharashtra is a large state in western and central peninsular India, stretching from the Arabian Sea coast across the Deccan Plateau. Its landscape includes the Konkan coast, the Sahyadri range, broad plateau regions and major river valleys.",

    formationInfo:
      "Maharashtra was formed on 1 May 1960 following the reorganisation of the former Bombay State. The new state was created alongside Gujarat, with the reorganisation taking effect on 1 May 1960.",

    geography:
      "Maharashtra has a 720-km Arabian Sea coastline. The Sahyadri range forms a major physical backbone, while the Konkan is a narrow coastal lowland to the west. The state also includes the Satpuda hills in the north and the Bhamragad-Chiroli-Gaikhuri ranges in the east. Much of the plateau region is associated with the Deccan Traps basalt formation. Rainfall varies sharply: the Konkan and Sahyadri receive heavy monsoon rain, while parts of the interior lie in rain-shadow zones.",

    governance:
      "Maharashtra is administratively divided into 6 revenue divisions and 36 districts. Its state administration operates through departments, district administrations and local self-government institutions. Marathi is the state's official language under the Maharashtra Official Languages Act.",

    culture:
      "Marathi language and literature are central to Maharashtra's cultural identity. The state has a rich tradition of devotional and folk culture, theatre, music and festivals. Ganesh Chaturthi is especially prominent, while historic and religious traditions are represented by places such as the Ajanta and Ellora Caves, Bhimashankar and Shirdi.",

    famousPlaces: [
      "Ajanta Caves",
      "Ellora Caves",
      "Elephanta Caves",
      "Chhatrapati Shivaji Maharaj Terminus, Mumbai",
      "Gateway of India, Mumbai",
      "Bhimashankar",
      "Shirdi",
      "Mahabaleshwar",
      "Lonavala and Khandala",
      "Tadoba-Andhari Tiger Reserve",
    ],

    majorRivers: [
      "Godavari",
      "Krishna",
      "Bhima",
      "Tapi",
      "Purna",
      "Wardha",
      "Wainganga",
    ],

    nationalParks: [
      "Sanjay Gandhi National Park",
      "Tadoba-Andhari National Park",
      "Chandoli National Park",
      "Gugamal National Park",
      "Navegaon National Park",
    ],

    funFacts: [
      "The state has a 720-km-long Arabian Sea coastline.",
      "The Sahyadri range is one of Maharashtra's defining physical features.",
      "Ajanta and Ellora are UNESCO World Heritage Sites in Maharashtra.",
      "Ellora's rock-cut complex contains Hindu, Buddhist and Jain monuments.",
      "Bhimashankar is both a major pilgrimage site and a biodiversity-rich area in the Sahyadris.",
      "Maharashtra's rainfall varies greatly between the wet Konkan-Sahyadri belt and the drier interior rain-shadow regions.",
    ],
  },

  {
    slug: "manipur",
    name: "Manipur",
    type: "State",
    capital: "Imphal",

    localizedName: {
      en: "Manipur",
      hi: "मणिपुर",
      mr: "मणिपूर",
    },

    localizedCapital: {
      en: "Imphal",
      hi: "इंफाल",
      mr: "इंफाळ",
    },

    region: "Northeast India",
    area: "22,327 km²",
    population2011: "28,55,794",
    majorLanguages:
      "Meitei and English",
  },

  {
    slug: "meghalaya",
    name: "Meghalaya",
    type: "State",
    capital: "Shillong",

    localizedName: {
      en: "Meghalaya",
      hi: "मेघालय",
      mr: "मेघालय",
    },

    localizedCapital: {
      en: "Shillong",
      hi: "शिलांग",
      mr: "शिलाँग",
    },

    region: "Northeast India",
    area: "22,429 km²",
    population2011: "29,66,889",
    majorLanguages:
      "English, Khasi and Garo",
  },

  {
    slug: "mizoram",
    name: "Mizoram",
    type: "State",
    capital: "Aizawl",

    localizedName: {
      en: "Mizoram",
      hi: "मिजोरम",
      mr: "मिझोराम",
    },

    localizedCapital: {
      en: "Aizawl",
      hi: "आइजोल",
      mr: "आयझॉल",
    },

    region: "Northeast India",
    area: "21,081 km²",
    population2011: "10,97,206",
    majorLanguages:
      "Mizo and English",
  },

  {
    slug: "nagaland",
    name: "Nagaland",
    type: "State",
    capital: "Kohima",

    localizedName: {
      en: "Nagaland",
      hi: "नागालैंड",
      mr: "नागालँड",
    },

    localizedCapital: {
      en: "Kohima",
      hi: "कोहिमा",
      mr: "कोहिमा",
    },

    region: "Northeast India",
    area: "16,579 km²",
    population2011: "19,78,502",
    majorLanguages:
      "English and Naga languages",
  },

  {
    slug: "odisha",
    name: "Odisha",
    type: "State",
    capital: "Bhubaneswar",

    localizedName: {
      en: "Odisha",
      hi: "ओडिशा",
      mr: "ओडिशा",
    },

    localizedCapital: {
      en: "Bhubaneswar",
      hi: "भुवनेश्वर",
      mr: "भुवनेश्वर",
    },

    region: "Eastern India",
    area: "155,707 km²",
    population2011: "4,19,74,218",
    majorLanguages:
      "Odia and English",
  },

  {
    slug: "punjab",
    name: "Punjab",
    type: "State",
    capital: "Chandigarh",

    localizedName: {
      en: "Punjab",
      hi: "पंजाब",
      mr: "पंजाब",
    },

    localizedCapital: {
      en: "Chandigarh",
      hi: "चंडीगढ़",
      mr: "चंदीगड",
    },

    region: "Northern India",
    area: "50,362 km²",
    population2011: "2,77,43,338",
    majorLanguages:
      "Punjabi and Hindi",
  },

  {
    slug: "rajasthan",
    name: "Rajasthan",
    type: "State",
    capital: "Jaipur",

    localizedName: {
      en: "Rajasthan",
      hi: "राजस्थान",
      mr: "राजस्थान",
    },

    localizedCapital: {
      en: "Jaipur",
      hi: "जयपुर",
      mr: "जयपूर",
    },

    region: "Northern India",
    area: "342,239 km²",
    population2011: "6,85,48,437",
    majorLanguages:
      "Hindi and Rajasthani language varieties",
  },

  {
    slug: "sikkim",
    name: "Sikkim",
    type: "State",
    capital: "Gangtok",

    localizedName: {
      en: "Sikkim",
      hi: "सिक्किम",
      mr: "सिक्कीम",
    },

    localizedCapital: {
      en: "Gangtok",
      hi: "गंगटोक",
      mr: "गंगटोक",
    },

    region: "Northeast India",
    area: "7,096 km²",
    population2011: "6,10,577",
    majorLanguages:
      "Nepali, Sikkimese, Lepcha and English",
  },

  {
    slug: "tamil-nadu",
    name: "Tamil Nadu",
    type: "State",
    capital: "Chennai",

    localizedName: {
      en: "Tamil Nadu",
      hi: "तमिलनाडु",
      mr: "तामिळनाडू",
    },

    localizedCapital: {
      en: "Chennai",
      hi: "चेन्नई",
      mr: "चेन्नई",
    },

    region: "South India",
    area: "130,058 km²",
    population2011: "7,21,47,030",
    majorLanguages:
      "Tamil and English",
  },

  {
    slug: "telangana",
    name: "Telangana",
    type: "State",
    capital: "Hyderabad",

    localizedName: {
      en: "Telangana",
      hi: "तेलंगाना",
      mr: "तेलंगणा",
    },

    localizedCapital: {
      en: "Hyderabad",
      hi: "हैदराबाद",
      mr: "हैदराबाद",
    },

    region: "South India",
    area: "112,077 km²",
    population2011: "3,50,03,674",
    majorLanguages:
      "Telugu, Urdu and English",
  },

  {
    slug: "tripura",
    name: "Tripura",
    type: "State",
    capital: "Agartala",

    localizedName: {
      en: "Tripura",
      hi: "त्रिपुरा",
      mr: "त्रिपुरा",
    },

    localizedCapital: {
      en: "Agartala",
      hi: "अगरतला",
      mr: "अगरतळा",
    },

    region: "Northeast India",
    area: "10,486 km²",
    population2011: "36,73,917",
    majorLanguages:
      "Bengali, Kokborok and English",
  },

  {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    type: "State",
    capital: "Lucknow",

    localizedName: {
      en: "Uttar Pradesh",
      hi: "उत्तर प्रदेश",
      mr: "उत्तर प्रदेश",
    },

    localizedCapital: {
      en: "Lucknow",
      hi: "लखनऊ",
      mr: "लखनौ",
    },

    region: "Northern India",
    area: "240,928 km²",
    population2011: "19,98,12,341",
    majorLanguages:
      "Hindi, Urdu and others",
  },

  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    type: "State",
    capital: "Dehradun",

    localizedName: {
      en: "Uttarakhand",
      hi: "उत्तराखंड",
      mr: "उत्तराखंड",
    },

    localizedCapital: {
      en: "Dehradun",
      hi: "देहरादून",
      mr: "देहरादून",
    },

    region: "Northern India",
    area: "53,483 km²",
    population2011: "1,00,86,292",
    majorLanguages:
      "Hindi and regional Pahari languages",
  },

  {
    slug: "west-bengal",
    name: "West Bengal",
    type: "State",
    capital: "Kolkata",

    localizedName: {
      en: "West Bengal",
      hi: "पश्चिम बंगाल",
      mr: "पश्चिम बंगाल",
    },

    localizedCapital: {
      en: "Kolkata",
      hi: "कोलकाता",
      mr: "कोलकाता",
    },

    region: "Eastern India",
    area: "88,752 km²",
    population2011: "9,12,76,115",
    majorLanguages:
      "Bengali, Hindi and English",
  },

  /* ======================================================= */
  /* UNION TERRITORIES                                        */
  /* ======================================================= */

  {
    slug: "andaman-and-nicobar-islands",
    name: "Andaman and Nicobar Islands",
    type: "Union Territory",
    capital: "Port Blair",

    localizedName: {
      en: "Andaman and Nicobar Islands",
      hi: "अंडमान और निकोबार द्वीपसमूह",
      mr: "अंदमान आणि निकोबार बेटे",
    },

    localizedCapital: {
      en: "Port Blair",
      hi: "पोर्ट ब्लेयर",
      mr: "पोर्ट ब्लेअर",
    },

    region: "Island Territories",
    area: "8,249 km²",
    population2011: "3,80,581",
    majorLanguages:
      "Hindi, Bengali, Tamil, Telugu and others",
  },

  {
    slug: "chandigarh",
    name: "Chandigarh",
    type: "Union Territory",
    capital: "Chandigarh",

    localizedName: {
      en: "Chandigarh",
      hi: "चंडीगढ़",
      mr: "चंदीगड",
    },

    localizedCapital: {
      en: "Chandigarh",
      hi: "चंडीगढ़",
      mr: "चंदीगड",
    },

    region: "Northern India",
    area: "114 km²",
    population2011: "10,55,450",
    majorLanguages:
      "Hindi, Punjabi and English",
  },

  {
    slug: "dadra-and-nagar-haveli-and-daman-and-diu",
    name:
      "Dadra and Nagar Haveli and Daman and Diu",
    type: "Union Territory",
    capital: "Daman",

    localizedName: {
      en: "Dadra and Nagar Haveli and Daman and Diu",
      hi: "दादरा और नगर हवेली और दमन और दीव",
      mr: "दादरा आणि नगर हवेली आणि दमण आणि दीव",
    },

    localizedCapital: {
      en: "Daman",
      hi: "दमन",
      mr: "दमण",
    },

    region: "Western India",
    area: "603 km²",
    population2011: "5,85,764†",
    populationNote:
      "† Combined reference from the 2011 Census figures of the pre-merger territories; the present UT was formed by merger in 2020.",
    majorLanguages:
      "Gujarati, Hindi, Marathi and English",
  },

  {
    slug: "delhi",
    name: "Delhi",
    type: "Union Territory",
    capital: "New Delhi",

    localizedName: {
      en: "Delhi",
      hi: "दिल्ली",
      mr: "दिल्ली",
    },

    localizedCapital: {
      en: "New Delhi",
      hi: "नई दिल्ली",
      mr: "नवी दिल्ली",
    },

    region: "Northern India",
    area: "1,483 km²",
    population2011: "1,67,53,235",
    majorLanguages:
      "Hindi, Punjabi, Urdu and English",
  },

  {
    slug: "jammu-and-kashmir",
    name: "Jammu and Kashmir",
    type: "Union Territory",
    capital:
      "Srinagar (Summer) · Jammu (Winter)",

    localizedName: {
      en: "Jammu and Kashmir",
      hi: "जम्मू और कश्मीर",
      mr: "जम्मू आणि काश्मीर",
    },

    localizedCapital: {
      en: "Srinagar (Summer) · Jammu (Winter)",
      hi: "श्रीनगर (ग्रीष्म) · जम्मू (शीतकाल)",
      mr: "श्रीनगर (उन्हाळी) · जम्मू (हिवाळी)",
    },

    region: "Northern India",
    area: "55,538 km²",
    population2011: "1,25,48,926†",
    populationNote:
      "† 2011 Census figure refers to the territory before the 2019 reorganisation and is not a current population estimate for the present UT.",
    majorLanguages:
      "Kashmiri, Dogri, Urdu, Hindi and others",
  },

  {
    slug: "ladakh",
    name: "Ladakh",
    type: "Union Territory",
    capital: "Leh",

    localizedName: {
      en: "Ladakh",
      hi: "लद्दाख",
      mr: "लडाख",
    },

    localizedCapital: {
      en: "Leh",
      hi: "लेह",
      mr: "लेह",
    },

    region: "Northern India",
    area: "59,146 km²",
    population2011: "2,74,289†",
    populationNote:
      "† Derived from the 2011 Census figures of the districts that constitute the present UT; not a current population estimate.",
    majorLanguages:
      "Ladakhi, Balti, Urdu, Hindi and English",
  },

  {
    slug: "lakshadweep",
    name: "Lakshadweep",
    type: "Union Territory",
    capital: "Kavaratti",

    localizedName: {
      en: "Lakshadweep",
      hi: "लक्षद्वीप",
      mr: "लक्षद्वीप",
    },

    localizedCapital: {
      en: "Kavaratti",
      hi: "कवरत्ती",
      mr: "कवरत्ती",
    },

    region: "Island Territories",
    area: "32 km²",
    population2011: "64,429",
    majorLanguages:
      "Malayalam and Mahl",
  },

  {
    slug: "puducherry",
    name: "Puducherry",
    type: "Union Territory",
    capital: "Puducherry",

    localizedName: {
      en: "Puducherry",
      hi: "पुडुचेरी",
      mr: "पुद्दुचेरी",
    },

    localizedCapital: {
      en: "Puducherry",
      hi: "पुडुचेरी",
      mr: "पुद्दुचेरी",
    },

    region: "South India",
    area: "490 km²",
    population2011: "12,44,464",
    majorLanguages:
      "Tamil, Telugu, Malayalam, French and English",
  },
];

/* ======================================================= */
/* STATE SPOTLIGHT — RICH PROFILES                         */
/* ======================================================= */

const STATE_SPOTLIGHT_DATA: Record<string, Partial<IndiaState>> = {
  "andhra-pradesh": {
    shortDescription: "A coastal state of southeastern India with a long Bay of Bengal coastline, fertile river deltas and the Eastern Ghats.",
    formationInfo: "Andhra State was created in 1953 and Andhra Pradesh was formed in 1956; the present state took its current boundaries after the reorganisation that created Telangana in 2014.",
    geography: "Andhra Pradesh combines coastal plains, the Eastern Ghats and inland plateau areas. The Godavari and Krishna river systems are major geographic features, while the Coromandel coast supports ports, agriculture and fisheries.",
    governance: "The state is organised into districts and local bodies, with the state government headquartered at Amaravati. It has a legislative assembly and a three-tier local-government system.",
    culture: "Telugu language and literature are central to the state. Kuchipudi dance, Carnatic music traditions, temple architecture, coastal cuisine and festivals such as Ugadi are important parts of its cultural life.",
    famousPlaces: ["Tirupati and Tirumala", "Araku Valley", "Visakhapatnam", "Amaravati", "Lepakshi", "Borra Caves"],
    majorRivers: ["Godavari", "Krishna", "Penna", "Tungabhadra"],
    nationalParks: ["Papikonda National Park", "Sri Venkateswara National Park", "Rajiv Gandhi National Park"],
    funFacts: ["Kuchipudi takes its name from a village in Krishna district.", "The state has a major stretch of Bay of Bengal coastline.", "Tirumala is one of India’s major pilgrimage destinations."],
  },
  "arunachal-pradesh": {
    shortDescription: "India’s northeasternmost state, known for high Himalayan mountains, deep valleys, forests and great cultural diversity.",
    formationInfo: "Arunachal Pradesh became a Union Territory in 1972 and attained full statehood on 20 February 1987.",
    geography: "The state rises from the Himalayan foothills to high mountain ranges and includes the Siang, Subansiri and Lohit river valleys. Much of the landscape is mountainous and heavily forested.",
    governance: "Arunachal Pradesh is divided into districts administered through the state government and district authorities. It has a legislative assembly and local self-government institutions.",
    culture: "The state is home to many tribal communities with distinct languages, crafts, festivals and traditions. Festivals such as Losar, Nyokum, Solung and Dree are celebrated by different communities.",
    famousPlaces: ["Tawang Monastery", "Ziro Valley", "Sela Pass", "Namdapha", "Bomdila", "Itanagar"],
    majorRivers: ["Siang", "Subansiri", "Lohit", "Dibang", "Kameng"],
    nationalParks: ["Namdapha National Park", "Mouling National Park"],
    funFacts: ["It is the largest state in Northeast India by area.", "The state contains some of the eastern Himalayas’ most biodiverse forests.", "Tawang Monastery is one of the largest Buddhist monasteries in India."],
  },
  "assam": {
    shortDescription: "A major northeastern state centred on the Brahmaputra valley and known for tea, wetlands, forests and wildlife.",
    formationInfo: "Assam became a constituent state of India at independence; its boundaries changed over time as several northeastern regions became separate states.",
    geography: "The Brahmaputra and Barak valleys form the principal lowland areas, surrounded by hills and forested landscapes. Floodplains, wetlands and river islands are characteristic features.",
    governance: "Assam is organised into districts and local bodies and has a state legislative assembly. Dispur serves as the state capital.",
    culture: "Assamese language and literature, Bihu festivals, Sattriya dance, handloom traditions and the cultural heritage of many indigenous and tribal communities are prominent.",
    famousPlaces: ["Kaziranga National Park", "Majuli", "Kamakhya Temple", "Manas National Park", "Sivasagar", "Tezpur"],
    majorRivers: ["Brahmaputra", "Barak", "Manas", "Subansiri"],
    nationalParks: ["Kaziranga National Park", "Manas National Park", "Nameri National Park", "Orang National Park", "Dibru-Saikhowa National Park"],
    funFacts: ["Assam is internationally known for its tea-growing regions.", "Majuli is a large river island in the Brahmaputra system.", "Kaziranga is famous for its population of Indian one-horned rhinoceroses."],
  },
  "bihar": {
    shortDescription: "A densely settled state in eastern India, shaped by the Ganga and its tributaries and by a long history of learning and religious traditions.",
    formationInfo: "Bihar became a separate province in 1912. Modern Bihar took shape after the creation of Jharkhand in 2000.",
    geography: "The Ganga crosses Bihar from west to east and is joined by rivers including the Gandak, Kosi and Son. The plains are largely alluvial and agriculturally important.",
    governance: "Bihar is divided into administrative divisions and districts and has a legislative assembly and elected local bodies. Patna is the capital.",
    culture: "Maithili, Bhojpuri, Magahi and Hindi are widely used. Chhath Puja is a major festival, while Madhubani painting and traditions associated with Buddhism, Jainism and ancient learning are important.",
    famousPlaces: ["Bodh Gaya", "Nalanda", "Rajgir", "Vaishali", "Patna Museum", "Valmiki Tiger Reserve"],
    majorRivers: ["Ganga", "Kosi", "Gandak", "Son", "Bagmati"],
    nationalParks: ["Valmiki National Park"],
    funFacts: ["Bodh Gaya is associated with the Buddha’s enlightenment.", "Nalanda was a major ancient centre of learning.", "Madhubani painting is one of Bihar’s best-known traditional art forms."],
  },
  "chhattisgarh": {
    shortDescription: "A central Indian state with extensive forests, mineral resources, river valleys and a strong tribal cultural heritage.",
    formationInfo: "Chhattisgarh was created as a separate state from Madhya Pradesh on 1 November 2000.",
    geography: "The state includes the Chhattisgarh Plain, forested northern and southern uplands and parts of the Maikal and Bastar regions. The Mahanadi and Indravati systems are important.",
    governance: "The state is divided into districts and local-government areas and has a legislative assembly. Raipur is the capital.",
    culture: "Chhattisgarhi and several tribal languages are widely used. Bastar is known for metal craft, woodwork, folk traditions and community festivals.",
    famousPlaces: ["Chitrakote Falls", "Bastar", "Barnawapara", "Sirpur", "Bhoramdeo Temple", "Raipur"],
    majorRivers: ["Mahanadi", "Indravati", "Shivnath", "Hasdeo"],
    nationalParks: ["Indravati National Park", "Kanger Valley National Park", "Guru Ghasidas National Park"],
    funFacts: ["Chitrakote is one of India’s best-known wide waterfalls.", "Bastar is noted for traditional bell-metal craft.", "The state is an important producer of several minerals."],
  },
  "goa": {
    shortDescription: "India’s smallest state by area, located on the Konkan coast and known for beaches, estuaries, forests and Indo-Portuguese heritage.",
    formationInfo: "Goa was liberated from Portuguese rule in 1961 and became a full state of India on 30 May 1987.",
    geography: "Goa has a narrow coastal plain backed by the Western Ghats. The Mandovi and Zuari estuaries, lateritic plateaus, beaches and forested uplands shape its landscape.",
    governance: "Goa is divided into North Goa and South Goa districts and has a legislative assembly and elected local bodies. Panaji is the capital.",
    culture: "Konkani is central to Goan culture. The state combines local traditions with Portuguese-influenced architecture, music and cuisine; Carnival and Shigmo are well-known festivals.",
    famousPlaces: ["Panaji", "Old Goa", "Baga and Calangute", "Dudhsagar Falls", "Basilica of Bom Jesus", "Palolem"],
    majorRivers: ["Mandovi", "Zuari", "Chapora", "Tiracol"],
    nationalParks: ["Mollem National Park"],
    funFacts: ["Goa is India’s smallest state by area.", "The Churches and Convents of Goa are a UNESCO World Heritage Site.", "Dudhsagar is a major waterfall on the Mandovi river system."],
  },
  "gujarat": {
    shortDescription: "A western Indian state with a long Arabian Sea coastline, diverse landscapes and major commercial and industrial centres.",
    formationInfo: "Gujarat was formed on 1 May 1960 when the former Bombay State was divided into Gujarat and Maharashtra.",
    geography: "Gujarat includes the Kachchh region, Saurashtra peninsula, mainland plains and the eastern hills. The Gulf of Kachchh and Gulf of Khambhat create distinctive coastal environments.",
    governance: "Gujarat is divided into districts and administrative divisions and has a legislative assembly and local self-government institutions. Gandhinagar is the capital.",
    culture: "Gujarati language, literature, textiles, handicrafts, cuisine and dance traditions are prominent. Navratri and Garba are especially associated with the state.",
    famousPlaces: ["Rann of Kachchh", "Gir National Park", "Somnath", "Dwarka", "Ahmedabad old city", "Statue of Unity"],
    majorRivers: ["Narmada", "Sabarmati", "Tapi", "Mahi", "Banas"],
    nationalParks: ["Gir National Park", "Blackbuck National Park", "Vansda National Park", "Marine National Park"],
    funFacts: ["Gir is the last natural habitat of the Asiatic lion.", "The Rann of Kachchh is a vast seasonal salt marsh.", "Ahmedabad’s historic city is a UNESCO World Heritage Site."],
  },
  "haryana": {
    shortDescription: "A north Indian state in the fertile plains around the Yamuna and Ghaggar systems, closely linked to the National Capital Region.",
    formationInfo: "Haryana was created as a separate state from Punjab on 1 November 1966.",
    geography: "Most of Haryana lies in the Indo-Gangetic plain. The Shivalik foothills occur in the northeast, while the Aravalli outcrops and semi-arid zones influence the south.",
    governance: "Haryana is divided into districts and has a legislative assembly and elected local bodies. Chandigarh is the state capital and is also a Union Territory.",
    culture: "Haryanvi and Hindi traditions include folk music, dance, wrestling, fairs and agricultural festivals. The state also has important sites associated with the Mahabharata tradition.",
    famousPlaces: ["Kurukshetra", "Sultanpur National Park", "Pinjore Gardens", "Morni Hills", "Panipat", "Surajkund"],
    majorRivers: ["Yamuna", "Ghaggar", "Markanda", "Sahibi"],
    nationalParks: ["Sultanpur National Park", "Kalesar National Park"],
    funFacts: ["Kurukshetra is traditionally associated with the Mahabharata.", "Haryana is a major agricultural state.", "Gurugram is a major business and technology centre in the NCR."],
  },
  "himachal-pradesh": {
    shortDescription: "A Himalayan state of high mountains, valleys, forests and river systems, known for hill towns, orchards and mountain culture.",
    formationInfo: "Himachal Pradesh became a full state of India on 25 January 1971.",
    geography: "The state ranges from lower Himalayan foothills to high mountain terrain. The Sutlej, Beas, Ravi, Chenab and Yamuna tributaries drain different valleys.",
    governance: "Himachal Pradesh is organised into districts and local bodies and has a legislative assembly. Shimla is the capital.",
    culture: "Pahari languages and traditions, temple architecture, handicrafts, woollens and seasonal festivals are important. Apple cultivation is a major part of the hill economy.",
    famousPlaces: ["Shimla", "Manali", "Dharamshala", "Spiti Valley", "Kinnaur", "Great Himalayan National Park"],
    majorRivers: ["Sutlej", "Beas", "Ravi", "Chenab", "Yamuna"],
    nationalParks: ["Great Himalayan National Park", "Pin Valley National Park", "Khirganga National Park", "Inderkilla National Park"],
    funFacts: ["Great Himalayan National Park is a UNESCO World Heritage Site.", "Himachal is one of India’s major apple-producing regions.", "The state contains landscapes ranging from subtropical foothills to high alpine zones."],
  },
  "jharkhand": {
    shortDescription: "An eastern Indian state centred on the Chota Nagpur Plateau, with extensive forests, mineral resources and waterfalls.",
    formationInfo: "Jharkhand was created from Bihar on 15 November 2000.",
    geography: "The Chota Nagpur Plateau dominates the state. The Damodar, Subarnarekha and other river systems cut through uplands, forests and waterfalls.",
    governance: "Jharkhand is divided into districts and has a legislative assembly and local self-government institutions. Ranchi is the capital.",
    culture: "The state is home to many Adivasi communities with distinctive languages, dances, music, crafts and festivals such as Sarhul and Sohrai.",
    famousPlaces: ["Ranchi", "Hundru Falls", "Netarhat", "Deoghar", "Betla National Park", "Parasnath"],
    majorRivers: ["Damodar", "Subarnarekha", "Barakar", "Koel"],
    nationalParks: ["Betla National Park"],
    funFacts: ["Jharkhand has major reserves of coal and several metallic minerals.", "Sohrai and Khovar painting traditions are associated with the state.", "The state is known for numerous waterfalls around its plateau landscapes."],
  },
  "karnataka": {
    shortDescription: "A large southern state spanning the Deccan Plateau, Western Ghats and Arabian Sea coast, with major technology, manufacturing and cultural centres.",
    formationInfo: "The state was formed in 1956 through the reorganisation of Kannada-speaking areas and was renamed Karnataka in 1973.",
    geography: "Karnataka includes the elevated Deccan Plateau, the forested Western Ghats and the coastal Karavali region. The Krishna, Kaveri and Tungabhadra systems are important.",
    governance: "Karnataka is divided into districts and has a legislative assembly, local bodies and a broad network of urban and rural administrations. Bengaluru is the capital.",
    culture: "Kannada literature, classical and folk arts, Yakshagana, Mysuru traditions, temple architecture and diverse regional cuisines are prominent.",
    famousPlaces: ["Hampi", "Mysuru Palace", "Coorg", "Gokarna", "Badami-Aihole-Pattadakal", "Bengaluru"],
    majorRivers: ["Krishna", "Kaveri", "Tungabhadra", "Sharavathi", "Malaprabha"],
    nationalParks: ["Bandipur National Park", "Nagarhole National Park", "Bannerghatta National Park", "Kudremukh National Park", "Anshi-Dandeli Tiger Reserve"],
    funFacts: ["Hampi is a UNESCO World Heritage Site.", "Bengaluru is a major Indian technology and startup centre.", "Yakshagana is a distinctive traditional theatre form of coastal Karnataka."],
  },
  "kerala": {
    shortDescription: "A narrow southwestern state between the Arabian Sea and Western Ghats, known for backwaters, high literacy, biodiversity and a distinctive cultural heritage.",
    formationInfo: "Kerala was formed on 1 November 1956 by combining Malayalam-speaking regions of the former Travancore-Cochin state and adjoining areas.",
    geography: "The state has a coastal plain, extensive backwaters and the Western Ghats along its eastern edge. Short rivers descend from the hills toward the Arabian Sea.",
    governance: "Kerala is divided into 14 districts and has a legislative assembly and elected local bodies. Thiruvananthapuram is the capital.",
    culture: "Malayalam language and literature, Kathakali, Mohiniyattam, Theyyam, Onam and diverse religious traditions are important parts of Kerala’s cultural life.",
    famousPlaces: ["Alappuzha backwaters", "Munnar", "Kochi", "Thiruvananthapuram", "Wayanad", "Sree Padmanabhaswamy Temple"],
    majorRivers: ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"],
    nationalParks: ["Eravikulam National Park", "Silent Valley National Park", "Anamudi Shola National Park", "Mathikettan Shola National Park"],
    funFacts: ["Kerala is famous for its interconnected backwaters and lagoons.", "The Western Ghats support high biological diversity.", "Onam is the state’s major harvest and cultural festival."],
  },
  "madhya-pradesh": {
    shortDescription: "A large central Indian state of plateaus, forests, river valleys and historic sites, often described geographically as the heart of India.",
    formationInfo: "Madhya Pradesh was formed in 1956; Chhattisgarh was separated from it in 2000.",
    geography: "The state contains the Malwa Plateau, Vindhya and Satpura ranges and major river basins including the Narmada, Chambal, Betwa and Son.",
    governance: "Madhya Pradesh is divided into administrative divisions and districts and has a legislative assembly and local governments. Bhopal is the capital.",
    culture: "Hindi and many regional traditions shape the state’s culture. Gond and other tribal art, folk music, fairs, temples and historic architecture are prominent.",
    famousPlaces: ["Khajuraho", "Sanchi", "Pachmarhi", "Gwalior Fort", "Bhimbetka", "Ujjain"],
    majorRivers: ["Narmada", "Chambal", "Betwa", "Son", "Tapti"],
    nationalParks: ["Kanha National Park", "Bandhavgarh National Park", "Pench National Park", "Satpura National Park", "Panna National Park"],
    funFacts: ["Khajuraho, Sanchi and Bhimbetka are UNESCO World Heritage Sites.", "Madhya Pradesh has several important tiger reserves.", "The Narmada flows westward across the central Indian rift valley."],
  },
  "manipur": {
    shortDescription: "A northeastern state centred on the Imphal Valley and surrounded by forested hills, known for distinctive arts, sports and biodiversity.",
    formationInfo: "Manipur became a full state of India on 21 January 1972.",
    geography: "The central Imphal Valley is surrounded by hills. Loktak Lake and the surrounding wetlands are major geographic features.",
    governance: "Manipur is divided into districts and has a legislative assembly and elected local bodies. Imphal is the capital.",
    culture: "Meitei traditions, Manipuri classical dance, handloom, martial arts and indigenous hill-community cultures are important. The state has a strong tradition of polo.",
    famousPlaces: ["Loktak Lake", "Keibul Lamjao National Park", "Imphal", "Kangla Fort", "Ukhrul", "Shirui Hills"],
    majorRivers: ["Imphal", "Barak", "Iril", "Thoubal"],
    nationalParks: ["Keibul Lamjao National Park", "Shirui National Park"],
    funFacts: ["Keibul Lamjao is famous as a floating national park.", "Loktak is the largest freshwater lake in Northeast India.", "Modern polo is strongly associated with the traditional Manipuri game of Sagol Kangjei."],
  },
  "meghalaya": {
    shortDescription: "A hill state in Northeast India known for plateaus, caves, waterfalls, living-root bridges and very high rainfall in some areas.",
    formationInfo: "Meghalaya became an autonomous state in 1970 and a full state of India on 21 January 1972.",
    geography: "The Meghalaya Plateau includes the Khasi, Jaintia and Garo hills. Deep valleys, limestone caves, waterfalls and high-rainfall zones shape the landscape.",
    governance: "Meghalaya is divided into districts and has a legislative assembly and local self-government institutions. Shillong is the capital.",
    culture: "Khasi, Garo and Jaintia communities have distinctive languages, music, festivals and social traditions. Matrilineal traditions are present among several communities.",
    famousPlaces: ["Cherrapunji", "Mawsynram", "Shillong", "Nongriat living-root bridges", "Dawki", "Mawlynnong"],
    majorRivers: ["Umiam", "Myntdu", "Simsang", "Kynshi"],
    nationalParks: ["Nokrek National Park", "Balpakram National Park"],
    funFacts: ["Mawsynram and Cherrapunji are among the world’s best-known high-rainfall locations.", "Living-root bridges are traditional bio-engineering structures.", "The state has extensive limestone cave systems."],
  },
  "mizoram": {
    shortDescription: "A mountainous northeastern state with steep ridges, forested valleys and a strong Mizo cultural identity.",
    formationInfo: "Mizoram became a Union Territory in 1972 and a full state on 20 February 1987.",
    geography: "Mizoram is dominated by parallel north-south hill ranges cut by river valleys. Forests cover much of the state’s terrain.",
    governance: "Mizoram is divided into districts and has a legislative assembly and elected local bodies. Aizawl is the capital.",
    culture: "Mizo language, community institutions, choral music, handloom and festivals such as Chapchar Kut are important.",
    famousPlaces: ["Aizawl", "Reiek", "Mizoram State Museum", "Phawngpui", "Durtlang Hills", "Vantawng Falls"],
    majorRivers: ["Tlawng", "Tuirial", "Chhimtuipui", "Tuivawl"],
    nationalParks: ["Murlen National Park", "Phawngpui Blue Mountain National Park"],
    funFacts: ["Mizoram is one of India’s most heavily forested states.", "Chapchar Kut is a major traditional Mizo festival.", "Phawngpui is the highest peak in the state."],
  },
  "nagaland": {
    shortDescription: "A mountainous northeastern state known for diverse Naga communities, forests, festivals and distinctive village traditions.",
    formationInfo: "Nagaland became a full state of India on 1 December 1963.",
    geography: "The state consists largely of rugged hills and valleys along the Naga Hills. The Dzüko Valley and Japfü range are notable landscapes.",
    governance: "Nagaland is divided into districts and has a legislative assembly and local self-government institutions. Kohima is the capital.",
    culture: "Naga communities have distinct languages, textiles, music, food traditions and festivals. The Hornbill Festival showcases many of these cultural traditions.",
    famousPlaces: ["Kohima", "Dzüko Valley", "Hornbill Festival site", "Mokokchung", "Mon", "Khonoma"],
    majorRivers: ["Doyang", "Dhansiri", "Tizu"],
    nationalParks: ["Intanki National Park"],
    funFacts: ["Nagaland has many distinct Naga communities and languages.", "The Hornbill Festival is held annually near Kisama.", "Dzüko Valley is known for seasonal flowers and mountain scenery."],
  },
  "odisha": {
    shortDescription: "An eastern coastal state with the Mahanadi delta, forested hills, ancient temples and a strong maritime and artistic heritage.",
    formationInfo: "Odisha became a separate province on 1 April 1936 and was renamed Odisha in 2011.",
    geography: "The state includes coastal plains, the Mahanadi delta, Eastern Ghats and forested uplands. Chilika Lake is a major coastal lagoon.",
    governance: "Odisha is divided into districts and administrative divisions and has a legislative assembly and elected local bodies. Bhubaneswar is the capital.",
    culture: "Odia language and literature, Jagannath traditions, Odissi dance, Pattachitra painting and Rath Yatra are central to the state’s cultural identity.",
    famousPlaces: ["Jagannath Temple, Puri", "Konark Sun Temple", "Chilika Lake", "Bhubaneswar temples", "Udayagiri and Khandagiri", "Similipal"],
    majorRivers: ["Mahanadi", "Brahmani", "Baitarani", "Subarnarekha", "Rushikulya"],
    nationalParks: ["Similipal National Park", "Bhitarkanika National Park"],
    funFacts: ["Konark Sun Temple is a UNESCO World Heritage Site.", "Chilika is one of India’s largest brackish-water lagoons.", "Odissi is one of India’s major classical dance traditions."],
  },
  "punjab": {
    shortDescription: "A fertile northwestern state of the Indus river plains, known for agriculture, Sikh heritage, vibrant music and major borderland history.",
    formationInfo: "The present state of Punjab was created on 1 November 1966 after the reorganisation of the former Punjab.",
    geography: "Punjab is largely a fertile alluvial plain crossed by rivers of the Indus system. The Shivalik foothills occur in the northeast.",
    governance: "Punjab is divided into districts and has a legislative assembly and local governments. Chandigarh is the state capital and is a Union Territory.",
    culture: "Punjabi language, Sikh traditions, bhangra and giddha, Punjabi literature, cuisine and festivals such as Baisakhi are prominent.",
    famousPlaces: ["Golden Temple", "Jallianwala Bagh", "Wagah-Attari border", "Anandpur Sahib", "Patiala", "Harike Wetland"],
    majorRivers: ["Sutlej", "Beas", "Ravi", "Ghaggar"],
    nationalParks: ["Harike Wetland and wildlife area"],
    funFacts: ["The Golden Temple is in Amritsar.", "Punjab played a major role in the Green Revolution.", "Baisakhi is closely associated with the agricultural calendar and Sikh history."],
  },
  "rajasthan": {
    shortDescription: "India’s largest state by area, spanning the Thar Desert, Aravalli range, historic cities and diverse dryland ecosystems.",
    formationInfo: "Rajasthan was formed through the integration of princely states after independence; the present state took shape in stages and was reorganised in 1956.",
    geography: "The Thar Desert dominates the west while the Aravalli range runs roughly southwest to northeast. The Chambal basin and eastern plains are more fertile.",
    governance: "Rajasthan is divided into administrative divisions and districts and has a legislative assembly and local bodies. Jaipur is the capital.",
    culture: "Rajasthani languages and traditions include folk music, dance, textiles, miniature painting, puppetry and colourful festivals and fairs.",
    famousPlaces: ["Jaipur", "Udaipur", "Jaisalmer Fort", "Jodhpur", "Ranthambore", "Mount Abu"],
    majorRivers: ["Chambal", "Banas", "Luni", "Mahi"],
    nationalParks: ["Ranthambore National Park", "Keoladeo National Park", "Desert National Park", "Sariska National Park", "Mukundra Hills National Park"],
    funFacts: ["Rajasthan is India’s largest state by area.", "Keoladeo National Park is a UNESCO World Heritage Site.", "The Aravalli range is one of India’s oldest mountain systems."],
  },
  "sikkim": {
    shortDescription: "A small Himalayan state bordered by Nepal, Bhutan and Tibet, known for high mountains, monasteries, forests and alpine landscapes.",
    formationInfo: "Sikkim became a full state of India on 16 May 1975.",
    geography: "The state rises from subtropical valleys to high Himalayan terrain. Kanchenjunga dominates the landscape and the Teesta system drains much of the state.",
    governance: "Sikkim is divided into districts and has a legislative assembly and elected local bodies. Gangtok is the capital.",
    culture: "Sikkim’s cultural life reflects Lepcha, Bhutia, Nepali and other traditions. Buddhist monasteries, Losar, Pang Lhabsol and other festivals are important.",
    famousPlaces: ["Gangtok", "Tsomgo Lake", "Nathula Pass", "Pelling", "Rumtek Monastery", "Yuksom"],
    majorRivers: ["Teesta", "Rangeet"],
    nationalParks: ["Khangchendzonga National Park"],
    funFacts: ["Khangchendzonga National Park is a UNESCO World Heritage Site.", "Sikkim is India’s least populous state according to Census 2011.", "Kanchenjunga is the dominant high mountain in the state."],
  },
  "tamil-nadu": {
    shortDescription: "A southern state with a long Bay of Bengal coastline, major temple cities, fertile river deltas and a strong Tamil literary tradition.",
    formationInfo: "The state was formed in its present linguistic framework through the reorganisation of Madras State; it was renamed Tamil Nadu in 1969.",
    geography: "Tamil Nadu includes the Eastern Ghats, Western Ghats, coastal plains and the fertile Cauvery delta. The state has several long coastal stretches and dry interior zones.",
    governance: "Tamil Nadu is divided into districts and has a legislative assembly and elected local bodies. Chennai is the capital.",
    culture: "Tamil language and literature have a very long history. Bharatanatyam, Carnatic music, temple architecture, Pongal and Tamil cuisine are prominent.",
    famousPlaces: ["Chennai", "Madurai Meenakshi Temple", "Mahabalipuram", "Thanjavur", "Ooty", "Rameswaram"],
    majorRivers: ["Kaveri", "Vaigai", "Palar", "Tamiraparani"],
    nationalParks: ["Mukurthi National Park", "Guindy National Park", "Gulf of Mannar Marine Biosphere Reserve"],
    funFacts: ["Mahabalipuram is a UNESCO World Heritage Site.", "Tamil is one of India’s major classical languages.", "The Cauvery delta is an important agricultural region."],
  },
  "telangana": {
    shortDescription: "A Deccan Plateau state centred on the historic Hyderabad region, with dryland landscapes, reservoirs and major technology and pharmaceutical industries.",
    formationInfo: "Telangana became a separate state from Andhra Pradesh on 2 June 2014.",
    geography: "Telangana lies largely on the Deccan Plateau. The Godavari and Krishna river systems and numerous reservoirs shape its geography.",
    governance: "Telangana is divided into districts and has a legislative assembly and elected local bodies. Hyderabad is the capital.",
    culture: "Telugu and Urdu traditions coexist with Deccan cultural influences. Bathukamma and Bonalu are prominent festivals, while the region is known for cuisine, crafts and historic architecture.",
    famousPlaces: ["Hyderabad", "Charminar", "Golconda Fort", "Warangal", "Ramappa Temple", "Nagarjuna Sagar"],
    majorRivers: ["Godavari", "Krishna", "Musi", "Manjeera"],
    nationalParks: ["Kasu Brahmananda Reddy National Park", "Mahavir Harina Vanasthali National Park"],
    funFacts: ["Hyderabad is a major technology and pharmaceutical centre.", "Ramappa Temple is a UNESCO World Heritage Site.", "Bathukamma is a major floral festival of Telangana."],
  },
  "tripura": {
    shortDescription: "A small northeastern state surrounded on three sides by Bangladesh, with forested hills, plains and a rich royal heritage.",
    formationInfo: "Tripura became a Union Territory in 1956 and a full state on 21 January 1972.",
    geography: "The state combines lowland plains with parallel hill ranges. Several rivers flow westward toward Bangladesh.",
    governance: "Tripura is divided into districts and has a legislative assembly and local bodies. Agartala is the capital.",
    culture: "Bengali, Kokborok and other traditions coexist. Tribal festivals, handloom, bamboo and cane crafts and the heritage of the Manikya dynasty are important.",
    famousPlaces: ["Ujjayanta Palace", "Neermahal", "Unakoti", "Jampui Hills", "Sepahijala", "Agartala"],
    majorRivers: ["Gomati", "Khowai", "Manu", "Feni"],
    nationalParks: ["Clouded Leopard National Park", "Bison National Park"],
    funFacts: ["Neermahal is a palace built in the middle of Rudrasagar Lake.", "Unakoti is famous for its rock-cut sculptures.", "Tripura has a long tradition of bamboo and cane craft."],
  },
  "uttar-pradesh": {
    shortDescription: "India’s most populous state, centred on the Ganga-Yamuna plains and home to major historical, religious and cultural sites.",
    formationInfo: "The state was known as the United Provinces before being renamed Uttar Pradesh in 1950; Uttarakhand was separated from it in 2000.",
    geography: "The Ganga-Yamuna doab, eastern plains, central uplands and Himalayan foothill belt define the state. Major rivers include the Ganga, Yamuna, Ghaghara and Gomti.",
    governance: "Uttar Pradesh is divided into administrative divisions and districts and has a large legislative assembly and elected local bodies. Lucknow is the capital.",
    culture: "Hindi and Urdu literature, Awadhi and Braj traditions, classical music, Kathak, crafts and major religious festivals are prominent.",
    famousPlaces: ["Taj Mahal", "Varanasi", "Ayodhya", "Agra Fort", "Prayagraj", "Sarnath"],
    majorRivers: ["Ganga", "Yamuna", "Ghaghara", "Gomti", "Rapti", "Betwa"],
    nationalParks: ["Dudhwa National Park", "Katarniaghat Wildlife Sanctuary"],
    funFacts: ["The Taj Mahal and Agra Fort are UNESCO World Heritage Sites.", "Varanasi is one of the world’s oldest continuously inhabited cities.", "Uttar Pradesh is India’s most populous state based on Census 2011."],
  },
  "uttarakhand": {
    shortDescription: "A Himalayan state of snow peaks, river valleys, forests and pilgrimage centres, often described through its Garhwal and Kumaon regions.",
    formationInfo: "Uttarakhand was created from Uttar Pradesh on 9 November 2000 and was known as Uttaranchal until 2007.",
    geography: "The state includes the Greater Himalaya, Middle Himalaya and foothill zones. The Ganga and Yamuna systems originate in or pass through its mountain landscape.",
    governance: "Uttarakhand is divided into districts and has a legislative assembly and elected local bodies. Dehradun is the winter capital; Gairsain is the summer capital.",
    culture: "Garhwali and Kumaoni languages and traditions, pilgrimage, folk music, dance and mountain festivals are central to the state’s cultural life.",
    famousPlaces: ["Haridwar", "Rishikesh", "Valley of Flowers", "Kedarnath", "Badrinath", "Nainital"],
    majorRivers: ["Ganga", "Yamuna", "Alaknanda", "Bhagirathi", "Mandakini"],
    nationalParks: ["Jim Corbett National Park", "Rajaji National Park", "Nanda Devi National Park", "Valley of Flowers National Park", "Gangotri National Park"],
    funFacts: ["Nanda Devi and Valley of Flowers National Parks form a UNESCO World Heritage Site.", "Several major Himalayan pilgrimage routes pass through the state.", "The Ganga system begins in the Himalayan region of Uttarakhand."],
  },
  "west-bengal": {
    shortDescription: "An eastern state stretching from the Himalayas to the Bay of Bengal, with the Ganga-Brahmaputra delta, tea regions and a rich literary and artistic heritage.",
    formationInfo: "West Bengal was created during the partition of British India in 1947 and its present territorial shape developed through later reorganisations.",
    geography: "The state includes Himalayan foothills in the north, the Ganga plains, lateritic uplands in the west and the Sundarbans delta in the south.",
    governance: "West Bengal is divided into districts and has a legislative assembly and elected local bodies. Kolkata is the capital.",
    culture: "Bengali literature, music, theatre, visual arts, Durga Puja and diverse food traditions are major features of the state’s cultural life.",
    famousPlaces: ["Kolkata", "Darjeeling", "Sundarbans", "Victoria Memorial", "Bishnupur", "Digha"],
    majorRivers: ["Ganga/Hooghly", "Teesta", "Damodar", "Mahananda", "Rupnarayan"],
    nationalParks: ["Sundarbans National Park", "Jaldapara National Park", "Gorumara National Park", "Neora Valley National Park", "Singalila National Park"],
    funFacts: ["Sundarbans National Park is a UNESCO World Heritage Site.", "Darjeeling is famous for tea and Himalayan views.", "Durga Puja in Kolkata is recognised by UNESCO as intangible cultural heritage."],
  },
  "andaman-and-nicobar-islands": {
    shortDescription: "An island Union Territory in the Bay of Bengal with tropical forests, coral ecosystems and a distinctive maritime geography.",
    formationInfo: "The islands became a Union Territory of India after independence; the present administrative territory comprises the Andaman and Nicobar island groups.",
    geography: "The territory consists of hundreds of islands and islets stretching between the Bay of Bengal and the Andaman Sea. Tropical forests, coral reefs and volcanic features occur here.",
    governance: "The Union Territory is administered by the Union government through a Lieutenant Governor and local administrative institutions. Port Blair is the capital.",
    culture: "The islands have diverse settler communities as well as Indigenous communities with distinct histories and protections. Bengali, Hindi, Tamil, Telugu and other languages are used.",
    famousPlaces: ["Port Blair", "Cellular Jail", "Swaraj Dweep", "Shaheed Dweep", "Baratang", "Barren Island"],
    majorRivers: ["Kalpong"],
    nationalParks: ["Mahatma Gandhi Marine National Park", "Campbell Bay National Park", "Galathea National Park", "Mount Manipur National Park"],
    funFacts: ["Barren Island is India’s only confirmed active volcano.", "The Cellular Jail is a major site associated with India’s freedom struggle.", "The territory contains important coral reef and marine ecosystems."],
  },
  "chandigarh": {
    shortDescription: "A planned Union Territory and major urban centre that serves as the capital of both Punjab and Haryana.",
    formationInfo: "Chandigarh became a Union Territory on 1 November 1966 after the reorganisation of Punjab.",
    geography: "Chandigarh lies at the foothills of the Shivalik range and was planned as a modern city with sector-based neighbourhoods, open spaces and a strong landscape structure.",
    governance: "Chandigarh is administered as a Union Territory by the Union government through an Administrator. It has no separate legislative assembly.",
    culture: "The city is known for modernist architecture, planned urban design, Punjabi and North Indian cultural influences and institutions such as museums and galleries.",
    famousPlaces: ["Capitol Complex", "Rock Garden", "Sukhna Lake", "Rose Garden", "Government Museum and Art Gallery"],
    majorRivers: ["Sukhna Choe", "Patiala Ki Rao"],
    nationalParks: ["Sukhna Wildlife Sanctuary"],
    funFacts: ["The Capitol Complex is a UNESCO World Heritage Site.", "The city was planned by architect Le Corbusier and his team.", "Chandigarh serves as the capital of two neighbouring states."],
  },
  "dadra-and-nagar-haveli-and-daman-and-diu": {
    shortDescription: "A western coastal Union Territory combining the former territories of Dadra and Nagar Haveli and Daman and Diu.",
    formationInfo: "Dadra and Nagar Haveli and Daman and Diu was formed as a single Union Territory on 26 January 2020 by merging the two former Union Territories.",
    geography: "The territory includes inland forested areas around Silvassa and coastal enclaves at Daman and Diu. The Daman Ganga is an important river system.",
    governance: "The Union Territory is administered by the Union government through an Administrator and local administrative bodies. Daman is the capital.",
    culture: "Gujarati, Marathi, Hindi and tribal traditions coexist with Portuguese-influenced heritage in Daman and Diu. Local crafts, food and coastal festivals are important.",
    famousPlaces: ["Diu Fort", "Daman", "Silvassa", "Nagoa Beach", "St. Paul’s Church, Diu", "Dudhni"],
    majorRivers: ["Daman Ganga", "Sakartond"],
    nationalParks: ["Dudhni and surrounding forest landscapes"],
    funFacts: ["Diu has a prominent Portuguese-era fort and historic churches.", "The territory combines coastal and inland landscapes.", "Silvassa is the principal urban centre of Dadra and Nagar Haveli."],
  },
  "delhi": {
    shortDescription: "India’s National Capital Territory, a major political, cultural and economic centre built around the Yamuna and a long historical urban landscape.",
    formationInfo: "Delhi became a Union Territory in 1956 and was redesignated as the National Capital Territory with a special constitutional framework in 1991.",
    geography: "Delhi lies on the Yamuna floodplain and the northern extension of the Aravalli ridge. The city contains old riverine settlements, planned colonial areas and extensive modern suburbs.",
    governance: "Delhi is a Union Territory with a legislative assembly and council of ministers subject to the constitutional framework applicable to the NCT. New Delhi is the national capital.",
    culture: "Delhi combines traditions from across India with its own historic Mughal, Sultanate, colonial and modern urban cultures.",
    famousPlaces: ["Red Fort", "Qutub Minar", "India Gate", "Humayun’s Tomb", "Lotus Temple", "National Museum"],
    majorRivers: ["Yamuna"],
    nationalParks: ["National Zoological Park", "Asola-Bhatti Wildlife Sanctuary"],
    funFacts: ["Delhi contains three UNESCO World Heritage Sites.", "New Delhi was designed as the imperial capital during the British period.", "The Yamuna is the principal river through the territory."],
  },
  "jammu-and-kashmir": {
    shortDescription: "A Himalayan Union Territory with high mountains, valleys, lakes and a long cultural history spanning Jammu, Kashmir and Ladakh-era heritage.",
    formationInfo: "Jammu and Kashmir became a Union Territory on 31 October 2019 following the reorganisation of the former state of Jammu and Kashmir.",
    geography: "The territory includes the Jammu plains and hills, the Kashmir Valley and high mountain ranges. The Jhelum and Chenab systems are major geographic features.",
    governance: "Jammu and Kashmir is a Union Territory with a legislative assembly framework provided by Parliament and an administration headed by a Lieutenant Governor. Srinagar is the summer capital and Jammu the winter capital.",
    culture: "Kashmiri, Dogra, Gujjar, Bakarwal and other traditions contribute to the region’s languages, crafts, cuisine, music and festivals.",
    famousPlaces: ["Srinagar and Dal Lake", "Gulmarg", "Pahalgam", "Vaishno Devi", "Mughal Gardens", "Jammu"],
    majorRivers: ["Jhelum", "Chenab", "Tawi", "Ravi"],
    nationalParks: ["Dachigam National Park", "Kishtwar National Park", "Kazinag National Park"],
    funFacts: ["Dal Lake is one of the best-known landscapes of Kashmir.", "Kashmiri shawls and carpet traditions have a long history.", "The territory contains landscapes from subtropical Jammu to alpine Himalayan zones."],
  },
  "ladakh": {
    shortDescription: "A high-altitude Himalayan Union Territory of stark mountains, cold deserts, lakes and Tibetan Buddhist cultural heritage.",
    formationInfo: "Ladakh became a separate Union Territory on 31 October 2019.",
    geography: "Ladakh lies between major Himalayan and Trans-Himalayan ranges. High plateaus, valleys, glaciers, cold deserts and high-altitude lakes dominate the landscape.",
    governance: "Ladakh is administered as a Union Territory by the Union government through a Lieutenant Governor, with local autonomous hill councils in Leh and Kargil.",
    culture: "Ladakhi, Balti and other Himalayan traditions are reflected in monasteries, festivals, music, crafts and food. Buddhist and Muslim cultural traditions are both important.",
    famousPlaces: ["Leh", "Pangong Lake", "Nubra Valley", "Tso Moriri", "Thiksey Monastery", "Kargil"],
    majorRivers: ["Indus", "Shyok", "Zanskar", "Sur u"],
    nationalParks: ["Hemis National Park"],
    funFacts: ["Ladakh contains some of India’s highest inhabited settlements.", "Hemis National Park is known for the snow leopard.", "Pangong Lake extends across India and China."],
  },
  "lakshadweep": {
    shortDescription: "India’s smallest Union Territory by area, made up of coral islands and atolls in the Arabian Sea.",
    formationInfo: "The Lakshadweep islands became a Union Territory in 1956 and were known as the Laccadive, Minicoy and Amindivi Islands before being renamed Lakshadweep in 1973.",
    geography: "Lakshadweep consists of coral atolls, reefs, lagoons and small islands. Its geography is strongly shaped by coral formation and the surrounding Arabian Sea.",
    governance: "The islands are administered as a Union Territory by the Union government through an Administrator. Kavaratti is the capital.",
    culture: "Malayalam is widely used in the northern islands while Mahl is associated with Minicoy. Island communities have strong fishing, seafaring and coconut-growing traditions.",
    famousPlaces: ["Kavaratti", "Agatti", "Bangaram", "Minicoy", "Kadmat"],
    majorRivers: [],
    nationalParks: ["Pitti Bird Sanctuary"],
    funFacts: ["Lakshadweep is India’s only coral-island Union Territory.", "Most of the territory’s land area consists of very small islands.", "Lagoons and coral reefs are central to the islands’ ecology and livelihoods."],
  },
  "puducherry": {
    shortDescription: "A Union Territory of four geographically separate former French settlements, known for coastal landscapes, heritage streets and multilingual culture.",
    formationInfo: "Puducherry became a Union Territory after the transfer of French possessions to India; the de facto transfer took place in 1954 and the territory was formally integrated in 1962.",
    geography: "The territory consists of four non-contiguous regions: Puducherry and Karaikal on the Tamil Nadu coast, Mahe on the Kerala coast and Yanam on the Andhra Pradesh coast.",
    governance: "Puducherry is a Union Territory with a legislative assembly and council of ministers under its special constitutional framework. Puducherry city is the capital.",
    culture: "Tamil, Telugu, Malayalam, French and English influences are visible in language, architecture, cuisine and public life. Auroville and Sri Aurobindo traditions are also associated with the territory.",
    famousPlaces: ["Puducherry French Quarter", "Auroville", "Promenade Beach", "Sri Aurobindo Ashram", "Paradise Beach", "Mahe"],
    majorRivers: ["Sankarani", "Ariyankuppam"],
    nationalParks: ["Ousteri Lake and surrounding wetland"],
    funFacts: ["Puducherry consists of four geographically separate regions.", "French colonial architecture remains prominent in parts of Puducherry city.", "Auroville is an international settlement near Puducherry."],
  },
};

/* Merge the rich profile layer with the existing verified base data. */
export const indiaStates: IndiaState[] = baseIndiaStates.map((state) => ({
  ...state,
  ...(STATE_SPOTLIGHT_DATA[state.slug] ?? {}),
}));

/* ======================================================= */
/* LOOKUP MAP                                               */
/* ======================================================= */

export const INDIA_STATE_MAP = Object.fromEntries(
  indiaStates.map((state) => [
    state.name,
    state,
  ])
) as Record<string, IndiaState>;

/* ======================================================= */
/* HELPERS                                                   */
/* ======================================================= */

export function getIndiaStateBySlug(
  slug: string
) {
  return indiaStates.find(
    (state) => state.slug === slug
  );
}

export function getIndiaStateByName(
  name: string
) {
  return indiaStates.find(
    (state) => state.name === name
  );
}

/**
 * Get the localized state name.
 */
export function getLocalizedStateName(
  state: IndiaState,
  language: Language
) {
  return state.localizedName[language];
}

/**
 * Get the localized capital name.
 */
export function getLocalizedCapital(
  state: IndiaState,
  language: Language
) {
  return state.localizedCapital[language];
}

/**
 * Get a state directly by its English map name
 * and return the translated display name.
 */
export function getLocalizedStateByName(
  name: string,
  language: Language
) {
  const state = getIndiaStateByName(name);

  if (!state) {
    return null;
  }

  return {
    ...state,
    displayName:
      state.localizedName[language],
    displayCapital:
      state.localizedCapital[language],
  };
}