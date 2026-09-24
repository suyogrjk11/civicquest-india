export type QuestLanguage = "en" | "hi" | "mr";

type Localized = {
  en: string;
  hi: string;
  mr: string;
};

export type KnowIndiaQuestion = {
  id: string;
  question: Localized;
  options: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  correctAnswer: number;
  explanation: Localized;
};

export const knowIndiaQuest = {
  title: {
    en: "Know India Challenge",
    hi: "भारत को जानें चुनौती",
    mr: "भारत जाणून घ्या आव्हान",
  },
  description: {
    en: "Test your knowledge of India's states, capitals, geography, national identity and civic basics.",
    hi: "भारत के राज्यों, राजधानियों, भूगोल, राष्ट्रीय पहचान और नागरिक मूल बातों के बारे में अपने ज्ञान को परखें।",
    mr: "भारताची राज्ये, राजधानी, भूगोल, राष्ट्रीय ओळख आणि नागरिक जीवनातील मूलभूत बाबींबद्दलचे तुमचे ज्ञान तपासा.",
  },
  xpPerQuestion: 10,
  questions: [
    {
      id: "ki-1",
      question: {
        en: "What is the capital of Maharashtra?",
        hi: "महाराष्ट्र की राजधानी क्या है?",
        mr: "महाराष्ट्राची राजधानी कोणती आहे?",
      },
      options: {
        en: ["Pune", "Mumbai", "Nagpur", "Nashik"],
        hi: ["पुणे", "मुंबई", "नागपुर", "नासिक"],
        mr: ["पुणे", "मुंबई", "नागपूर", "नाशिक"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Mumbai is the capital of Maharashtra.",
        hi: "मुंबई महाराष्ट्र की राजधानी है।",
        mr: "मुंबई ही महाराष्ट्राची राजधानी आहे.",
      },
    },
    {
      id: "ki-2",
      question: {
        en: "Which state has Jaipur as its capital?",
        hi: "किस राज्य की राजधानी जयपुर है?",
        mr: "जयपूर ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Gujarat", "Rajasthan", "Haryana", "Madhya Pradesh"],
        hi: ["गुजरात", "राजस्थान", "हरियाणा", "मध्य प्रदेश"],
        mr: ["गुजरात", "राजस्थान", "हरियाणा", "मध्य प्रदेश"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Jaipur is the capital of Rajasthan.",
        hi: "जयपुर राजस्थान की राजधानी है।",
        mr: "जयपूर ही राजस्थानची राजधानी आहे.",
      },
    },
    {
      id: "ki-3",
      question: {
        en: "What is the capital of Assam?",
        hi: "असम की राजधानी क्या है?",
        mr: "आसामची राजधानी कोणती आहे?",
      },
      options: {
        en: ["Guwahati", "Dispur", "Shillong", "Agartala"],
        hi: ["गुवाहाटी", "दिसपुर", "शिलांग", "अगरतला"],
        mr: ["गुवाहाटी", "दिसपूर", "शिलाँग", "अगरतळा"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Dispur is the capital of Assam.",
        hi: "दिसपुर असम की राजधानी है।",
        mr: "दिसपूर ही आसामची राजधानी आहे.",
      },
    },
    {
      id: "ki-4",
      question: {
        en: "Which state is known for having Lucknow as its capital?",
        hi: "लखनऊ किस राज्य की राजधानी है?",
        mr: "लखनौ ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Uttar Pradesh", "Bihar", "Jharkhand", "Chhattisgarh"],
        hi: ["उत्तर प्रदेश", "बिहार", "झारखंड", "छत्तीसगढ़"],
        mr: ["उत्तर प्रदेश", "बिहार", "झारखंड", "छत्तीसगड"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Lucknow is the capital of Uttar Pradesh.",
        hi: "लखनऊ उत्तर प्रदेश की राजधानी है।",
        mr: "लखनौ ही उत्तर प्रदेशची राजधानी आहे.",
      },
    },
    {
      id: "ki-5",
      question: {
        en: "Which Union Territory has Kavaratti as its capital?",
        hi: "किस केंद्र शासित प्रदेश की राजधानी कवरत्ती है?",
        mr: "कावरत्ती ही कोणत्या केंद्रशासित प्रदेशाची राजधानी आहे?",
      },
      options: {
        en: ["Lakshadweep", "Ladakh", "Chandigarh", "Puducherry"],
        hi: ["लक्षद्वीप", "लद्दाख", "चंडीगढ़", "पुडुचेरी"],
        mr: ["लक्षद्वीप", "लडाख", "चंदीगड", "पुद्दुचेरी"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Kavaratti is the capital of Lakshadweep.",
        hi: "कवरत्ती लक्षद्वीप की राजधानी है।",
        mr: "कावरत्ती ही लक्षद्वीपची राजधानी आहे.",
      },
    },
    {
      id: "ki-6",
      question: {
        en: "Which state has Chennai as its capital?",
        hi: "चेन्नई किस राज्य की राजधानी है?",
        mr: "चेन्नई ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Kerala", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
        hi: ["केरल", "कर्नाटक", "तमिलनाडु", "आंध्र प्रदेश"],
        mr: ["केरळ", "कर्नाटक", "तमिळनाडू", "आंध्र प्रदेश"],
      },
      correctAnswer: 2,
      explanation: {
        en: "Chennai is the capital of Tamil Nadu.",
        hi: "चेन्नई तमिलनाडु की राजधानी है।",
        mr: "चेन्नई ही तमिळनाडूची राजधानी आहे.",
      },
    },
    {
      id: "ki-7",
      question: {
        en: "Which state has Dehradun as its capital?",
        hi: "देहरादून किस राज्य की राजधानी है?",
        mr: "डेहराडून ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Himachal Pradesh", "Uttarakhand", "Sikkim", "Haryana"],
        hi: ["हिमाचल प्रदेश", "उत्तराखंड", "सिक्किम", "हरियाणा"],
        mr: ["हिमाचल प्रदेश", "उत्तराखंड", "सिक्कीम", "हरियाणा"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Dehradun is listed as the capital of Uttarakhand in the KarmaFacie state data.",
        hi: "KarmaFacie के राज्य डेटा में देहरादून को उत्तराखंड की राजधानी बताया गया है।",
        mr: "KarmaFacie च्या राज्य डेटामध्ये डेहराडून ही उत्तराखंडची राजधानी दिली आहे.",
      },
    },
    {
      id: "ki-8",
      question: {
        en: "Which of these is a Union Territory rather than a State?",
        hi: "इनमें से कौन राज्य के बजाय केंद्र शासित प्रदेश है?",
        mr: "यापैकी कोणते राज्य नसून केंद्रशासित प्रदेश आहे?",
      },
      options: {
        en: ["Goa", "Sikkim", "Ladakh", "Tripura"],
        hi: ["गोवा", "सिक्किम", "लद्दाख", "त्रिपुरा"],
        mr: ["गोवा", "सिक्कीम", "लडाख", "त्रिपुरा"],
      },
      correctAnswer: 2,
      explanation: {
        en: "Ladakh is a Union Territory.",
        hi: "लद्दाख एक केंद्र शासित प्रदेश है।",
        mr: "लडाख हा केंद्रशासित प्रदेश आहे.",
      },
    },
    {
      id: "ki-9",
      question: {
        en: "Which state has Panaji as its capital?",
        hi: "पणजी किस राज्य की राजधानी है?",
        mr: "पणजी ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Goa", "Kerala", "Odisha", "West Bengal"],
        hi: ["गोवा", "केरल", "ओडिशा", "पश्चिम बंगाल"],
        mr: ["गोवा", "केरळ", "ओडिशा", "पश्चिम बंगाल"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Panaji is the capital of Goa.",
        hi: "पणजी गोवा की राजधानी है।",
        mr: "पणजी ही गोव्याची राजधानी आहे.",
      },
    },
    {
      id: "ki-10",
      question: {
        en: "Which state has Kolkata as its capital?",
        hi: "कोलकाता किस राज्य की राजधानी है?",
        mr: "कोलकाता ही कोणत्या राज्याची राजधानी आहे?",
      },
      options: {
        en: ["Odisha", "West Bengal", "Bihar", "Jharkhand"],
        hi: ["ओडिशा", "पश्चिम बंगाल", "बिहार", "झारखंड"],
        mr: ["ओडिशा", "पश्चिम बंगाल", "बिहार", "झारखंड"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Kolkata is the capital of West Bengal.",
        hi: "कोलकाता पश्चिम बंगाल की राजधानी है।",
        mr: "कोलकाता ही पश्चिम बंगालची राजधानी आहे.",
      },
    },
  ] satisfies KnowIndiaQuestion[],
} as const;
