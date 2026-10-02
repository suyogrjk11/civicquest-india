"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type HealthcareItem = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type CitizenAction = {
  number: string;
  title: LocalizedText;
  text: LocalizedText;
};

type QuizQuestion = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
};

const healthcareLevels: HealthcareItem[] = [
  {
    icon: "🏠",
    title: {
      en: "Primary Care",
      hi: "प्राथमिक स्वास्थ्य सेवा",
      mr: "प्राथमिक आरोग्यसेवा",
    },
    text: {
      en: "Primary care is usually the first point of contact for many common health needs, preventive services and basic treatment.",
      hi: "प्राथमिक स्वास्थ्य सेवा सामान्य स्वास्थ्य आवश्यकताओं, निवारक सेवाओं और बुनियादी उपचार के लिए आमतौर पर पहला संपर्क बिंदु होती है।",
      mr: "सामान्य आरोग्यविषयक गरजा, प्रतिबंधात्मक सेवा आणि प्राथमिक उपचारांसाठी प्राथमिक आरोग्यसेवा ही सामान्यतः पहिली संपर्काची पायरी असते.",
    },
  },
  {
    icon: "🏥",
    title: {
      en: "Secondary Care",
      hi: "द्वितीयक स्वास्थ्य सेवा",
      mr: "दुय्यम आरोग्यसेवा",
    },
    text: {
      en: "Secondary care generally involves more specialised services, often provided through hospitals and specialist facilities.",
      hi: "द्वितीयक स्वास्थ्य सेवा में आमतौर पर अधिक विशेषीकृत सेवाएँ शामिल होती हैं, जो अक्सर अस्पतालों और विशेषज्ञ सुविधाओं के माध्यम से प्रदान की जाती हैं।",
      mr: "दुय्यम आरोग्यसेवेमध्ये सामान्यतः अधिक विशेषीकृत सेवांचा समावेश होतो. या सेवा अनेकदा रुग्णालये आणि विशेष तज्ज्ञ सुविधांमार्फत दिल्या जातात.",
    },
  },
  {
    icon: "🏢",
    title: {
      en: "Tertiary Care",
      hi: "तृतीयक स्वास्थ्य सेवा",
      mr: "तृतीयक आरोग्यसेवा",
    },
    text: {
      en: "Tertiary care provides highly specialised services for complex health conditions and may involve advanced hospitals and specialist centres.",
      hi: "तृतीयक स्वास्थ्य सेवा जटिल स्वास्थ्य स्थितियों के लिए अत्यधिक विशेषीकृत सेवाएँ प्रदान करती है और इसमें उन्नत अस्पताल तथा विशेषज्ञ केंद्र शामिल हो सकते हैं।",
      mr: "तृतीयक आरोग्यसेवा गुंतागुंतीच्या आरोग्यस्थितींसाठी अत्यंत विशेषीकृत सेवा देते आणि यात प्रगत रुग्णालये व तज्ज्ञ केंद्रांचा समावेश होऊ शकतो.",
    },
  },
];

const healthcareAreas: HealthcareItem[] = [
  {
    icon: "🩺",
    title: {
      en: "Preventive Healthcare",
      hi: "निवारक स्वास्थ्य सेवा",
      mr: "प्रतिबंधात्मक आरोग्यसेवा",
    },
    text: {
      en: "Prevention includes activities such as vaccination, health education, screening and measures that reduce health risks.",
      hi: "रोकथाम में टीकाकरण, स्वास्थ्य शिक्षा, स्क्रीनिंग और स्वास्थ्य जोखिमों को कम करने वाले उपाय जैसी गतिविधियाँ शामिल हैं।",
      mr: "प्रतिबंधामध्ये लसीकरण, आरोग्य शिक्षण, तपासणी आणि आरोग्यविषयक जोखीम कमी करणाऱ्या उपायांचा समावेश होतो.",
    },
  },
  {
    icon: "🚑",
    title: {
      en: "Emergency Care",
      hi: "आपातकालीन स्वास्थ्य सेवा",
      mr: "आपत्कालीन आरोग्यसेवा",
    },
    text: {
      en: "Emergency healthcare provides urgent assessment and treatment for conditions that require immediate attention.",
      hi: "आपातकालीन स्वास्थ्य सेवा उन स्थितियों के लिए तुरंत जाँच और उपचार प्रदान करती है जिन पर तत्काल ध्यान देने की आवश्यकता होती है।",
      mr: "तातडीच्या वैद्यकीय लक्षाची गरज असलेल्या स्थितींमध्ये आपत्कालीन आरोग्यसेवा त्वरित तपासणी आणि उपचार देते.",
    },
  },
  {
    icon: "👶",
    title: {
      en: "Maternal & Child Health",
      hi: "मातृ एवं बाल स्वास्थ्य",
      mr: "माता आणि बाल आरोग्य",
    },
    text: {
      en: "Healthcare systems provide services supporting pregnancy, childbirth, newborns and children's health.",
      hi: "स्वास्थ्य प्रणालियाँ गर्भावस्था, प्रसव, नवजात शिशुओं और बच्चों के स्वास्थ्य के लिए सेवाएँ प्रदान करती हैं।",
      mr: "आरोग्य व्यवस्था गर्भधारणा, प्रसूती, नवजात शिशू आणि मुलांच्या आरोग्यासाठी सेवा पुरवते.",
    },
  },
  {
    icon: "🧪",
    title: {
      en: "Diagnostics",
      hi: "नैदानिक सेवाएँ",
      mr: "निदान सेवा",
    },
    text: {
      en: "Laboratory tests, imaging and other diagnostic services help healthcare professionals assess health conditions.",
      hi: "प्रयोगशाला जाँच, इमेजिंग और अन्य नैदानिक सेवाएँ स्वास्थ्य पेशेवरों को स्वास्थ्य स्थितियों का आकलन करने में मदद करती हैं।",
      mr: "प्रयोगशाळा चाचण्या, इमेजिंग आणि इतर निदान सेवा आरोग्य व्यावसायिकांना आरोग्यस्थितीचे मूल्यांकन करण्यास मदत करतात.",
    },
  },
];

const healthcareInstitutions: HealthcareItem[] = [
  {
    icon: "🏛️",
    title: {
      en: "Ministry of Health & Family Welfare",
      hi: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
      mr: "आरोग्य आणि कुटुंब कल्याण मंत्रालय",
    },
    text: {
      en: "The Union Ministry of Health and Family Welfare is responsible for important national health-policy and programme areas.",
      hi: "केंद्रीय स्वास्थ्य और परिवार कल्याण मंत्रालय महत्वपूर्ण राष्ट्रीय स्वास्थ्य-नीति और कार्यक्रम क्षेत्रों के लिए जिम्मेदार है।",
      mr: "केंद्रीय आरोग्य आणि कुटुंब कल्याण मंत्रालय महत्त्वाच्या राष्ट्रीय आरोग्य धोरण आणि कार्यक्रम क्षेत्रांसाठी जबाबदार आहे.",
    },
  },
  {
    icon: "🏥",
    title: {
      en: "Public Health Facilities",
      hi: "सार्वजनिक स्वास्थ्य सुविधाएँ",
      mr: "सार्वजनिक आरोग्य सुविधा",
    },
    text: {
      en: "Government healthcare facilities provide different levels of healthcare services through the public health system.",
      hi: "सरकारी स्वास्थ्य सुविधाएँ सार्वजनिक स्वास्थ्य प्रणाली के माध्यम से विभिन्न स्तरों की स्वास्थ्य सेवाएँ प्रदान करती हैं।",
      mr: "सरकारी आरोग्य सुविधा सार्वजनिक आरोग्य व्यवस्थेद्वारे विविध स्तरांवरील आरोग्यसेवा पुरवतात.",
    },
  },
  {
    icon: "🔬",
    title: {
      en: "Indian Council of Medical Research",
      hi: "भारतीय आयुर्विज्ञान अनुसंधान परिषद",
      mr: "भारतीय वैद्यकीय संशोधन परिषद",
    },
    text: {
      en: "ICMR is India's apex body for the formulation, coordination and promotion of biomedical research.",
      hi: "ICMR जैव-चिकित्सीय अनुसंधान के निर्माण, समन्वय और प्रोत्साहन के लिए भारत की शीर्ष संस्था है।",
      mr: "ICMR ही जैववैद्यकीय संशोधनाची निर्मिती, समन्वय आणि प्रोत्साहन यासाठी भारतातील सर्वोच्च संस्था आहे.",
    },
  },
  {
    icon: "💊",
    title: {
      en: "Health Regulators",
      hi: "स्वास्थ्य नियामक",
      mr: "आरोग्य नियामक संस्था",
    },
    text: {
      en: "Different statutory and regulatory bodies have responsibilities relating to healthcare professionals, medicines, medical education and other areas.",
      hi: "विभिन्न वैधानिक और नियामक संस्थाओं की स्वास्थ्य पेशेवरों, दवाओं, चिकित्सा शिक्षा और अन्य क्षेत्रों से संबंधित जिम्मेदारियाँ होती हैं।",
      mr: "विविध वैधानिक आणि नियामक संस्थांकडे आरोग्य व्यावसायिक, औषधे, वैद्यकीय शिक्षण आणि इतर क्षेत्रांशी संबंधित जबाबदाऱ्या असतात.",
    },
  },
];

const citizenActions: CitizenAction[] = [
  {
    number: "01",
    title: {
      en: "Use healthcare services responsibly",
      hi: "स्वास्थ्य सेवाओं का जिम्मेदारी से उपयोग करें",
      mr: "आरोग्यसेवांचा जबाबदारीने वापर करा",
    },
    text: {
      en: "Understand which healthcare facility or service is appropriate for your needs and follow applicable instructions.",
      hi: "समझें कि आपकी आवश्यकताओं के लिए कौन-सी स्वास्थ्य सुविधा या सेवा उपयुक्त है और लागू निर्देशों का पालन करें।",
      mr: "तुमच्या गरजांसाठी कोणती आरोग्य सुविधा किंवा सेवा योग्य आहे हे समजून घ्या आणि लागू सूचनांचे पालन करा.",
    },
  },
  {
    number: "02",
    title: {
      en: "Focus on prevention",
      hi: "रोकथाम पर ध्यान दें",
      mr: "प्रतिबंधावर लक्ष द्या",
    },
    text: {
      en: "Vaccination, sanitation, healthy practices and appropriate screening can contribute to public health.",
      hi: "टीकाकरण, स्वच्छता, स्वस्थ आदतें और उचित स्क्रीनिंग सार्वजनिक स्वास्थ्य में योगदान दे सकती हैं।",
      mr: "लसीकरण, स्वच्छता, आरोग्यदायी सवयी आणि योग्य तपासणी यामुळे सार्वजनिक आरोग्याला हातभार लागू शकतो.",
    },
  },
  {
    number: "03",
    title: {
      en: "Keep important health records",
      hi: "महत्वपूर्ण स्वास्थ्य रिकॉर्ड रखें",
      mr: "महत्त्वाच्या आरोग्य नोंदी जतन करा",
    },
    text: {
      en: "Maintaining relevant prescriptions, reports and vaccination records can help when accessing healthcare services.",
      hi: "उपयोगी नुस्खे, रिपोर्ट और टीकाकरण रिकॉर्ड सुरक्षित रखना स्वास्थ्य सेवाओं का उपयोग करते समय मददगार हो सकता है।",
      mr: "लागू प्रिस्क्रिप्शन, अहवाल आणि लसीकरण नोंदी जतन करून ठेवल्यास आरोग्यसेवा घेताना मदत होऊ शकते.",
    },
  },
  {
    number: "04",
    title: {
      en: "Know emergency services",
      hi: "आपातकालीन सेवाओं को जानें",
      mr: "आपत्कालीन सेवा जाणून घ्या",
    },
    text: {
      en: "Citizens should know the appropriate emergency services and healthcare facilities available in their area.",
      hi: "नागरिकों को अपने क्षेत्र में उपलब्ध उपयुक्त आपातकालीन सेवाओं और स्वास्थ्य सुविधाओं की जानकारी होनी चाहिए।",
      mr: "नागरिकांना त्यांच्या परिसरात उपलब्ध असलेल्या योग्य आपत्कालीन सेवा आणि आरोग्य सुविधांची माहिती असावी.",
    },
  },
  {
    number: "05",
    title: {
      en: "Stay informed",
      hi: "जानकारी रखें",
      mr: "माहिती अद्ययावत ठेवा",
    },
    text: {
      en: "Use official government and healthcare sources for information about public health programmes and services.",
      hi: "सार्वजनिक स्वास्थ्य कार्यक्रमों और सेवाओं की जानकारी के लिए आधिकारिक सरकारी और स्वास्थ्य स्रोतों का उपयोग करें।",
      mr: "सार्वजनिक आरोग्य कार्यक्रम आणि सेवांची माहिती मिळवण्यासाठी अधिकृत सरकारी आणि आरोग्यविषयक स्रोतांचा वापर करा.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "Which level of care is generally the first point of contact?",
      hi: "आमतौर पर स्वास्थ्य सेवा का पहला संपर्क बिंदु कौन-सा स्तर होता है?",
      mr: "सामान्यतः आरोग्यसेवेच्या संपर्काची पहिली पायरी कोणती असते?",
    },
    options: [
      {
        en: "Primary care",
        hi: "प्राथमिक स्वास्थ्य सेवा",
        mr: "प्राथमिक आरोग्यसेवा",
      },
      {
        en: "Tertiary care only",
        hi: "केवल तृतीयक स्वास्थ्य सेवा",
        mr: "फक्त तृतीयक आरोग्यसेवा",
      },
      {
        en: "Only specialised research centres",
        hi: "केवल विशेषीकृत अनुसंधान केंद्र",
        mr: "फक्त विशेषीकृत संशोधन केंद्रे",
      },
      {
        en: "International healthcare",
        hi: "अंतरराष्ट्रीय स्वास्थ्य सेवा",
        mr: "आंतरराष्ट्रीय आरोग्यसेवा",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which is an example of preventive healthcare?",
      hi: "निवारक स्वास्थ्य सेवा का उदाहरण कौन-सा है?",
      mr: "प्रतिबंधात्मक आरोग्यसेवेचे उदाहरण कोणते?",
    },
    options: [
      {
        en: "Vaccination",
        hi: "टीकाकरण",
        mr: "लसीकरण",
      },
      {
        en: "Ignoring symptoms",
        hi: "लक्षणों को नजरअंदाज करना",
        mr: "लक्षणांकडे दुर्लक्ष करणे",
      },
      {
        en: "Avoiding health information",
        hi: "स्वास्थ्य संबंधी जानकारी से बचना",
        mr: "आरोग्यविषयक माहिती टाळणे",
      },
      {
        en: "Skipping all health check-ups",
        hi: "सभी स्वास्थ्य जाँच छोड़ देना",
        mr: "सर्व आरोग्य तपासण्या टाळणे",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which ministry handles important national health-policy areas?",
      hi: "महत्वपूर्ण राष्ट्रीय स्वास्थ्य-नीति क्षेत्रों को कौन-सा मंत्रालय संभालता है?",
      mr: "महत्त्वाच्या राष्ट्रीय आरोग्य धोरण क्षेत्रांची जबाबदारी कोणत्या मंत्रालयाकडे आहे?",
    },
    options: [
      {
        en: "Ministry of Health and Family Welfare",
        hi: "स्वास्थ्य और परिवार कल्याण मंत्रालय",
        mr: "आरोग्य आणि कुटुंब कल्याण मंत्रालय",
      },
      {
        en: "Ministry of Finance",
        hi: "वित्त मंत्रालय",
        mr: "वित्त मंत्रालय",
      },
      {
        en: "Ministry of Defence",
        hi: "रक्षा मंत्रालय",
        mr: "संरक्षण मंत्रालय",
      },
      {
        en: "Ministry of External Affairs",
        hi: "विदेश मंत्रालय",
        mr: "परराष्ट्र मंत्रालय",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What is one purpose of diagnostic services?",
      hi: "नैदानिक सेवाओं का एक उद्देश्य क्या है?",
      mr: "निदान सेवांचा एक उद्देश काय आहे?",
    },
    options: [
      {
        en: "To help assess health conditions",
        hi: "स्वास्थ्य स्थितियों का आकलन करने में मदद करना",
        mr: "आरोग्यस्थितीचे मूल्यांकन करण्यास मदत करणे",
      },
      {
        en: "To conduct elections",
        hi: "चुनाव कराना",
        mr: "निवडणुका घेणे",
      },
      {
        en: "To collect taxes",
        hi: "कर एकत्र करना",
        mr: "कर गोळा करणे",
      },
      {
        en: "To issue passports",
        hi: "पासपोर्ट जारी करना",
        mr: "पासपोर्ट जारी करणे",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Why should citizens use official healthcare sources?",
      hi: "नागरिकों को आधिकारिक स्वास्थ्य स्रोतों का उपयोग क्यों करना चाहिए?",
      mr: "नागरिकांनी अधिकृत आरोग्य स्रोतांचा वापर का करावा?",
    },
    options: [
      {
        en: "For reliable information about services and programmes",
        hi: "सेवाओं और कार्यक्रमों के बारे में विश्वसनीय जानकारी के लिए",
        mr: "सेवा आणि कार्यक्रमांबद्दल विश्वसनीय माहिती मिळवण्यासाठी",
      },
      {
        en: "Because private healthcare does not exist",
        hi: "क्योंकि निजी स्वास्थ्य सेवा मौजूद नहीं है",
        mr: "कारण खासगी आरोग्यसेवा अस्तित्वात नाही",
      },
      {
        en: "Because health information never changes",
        hi: "क्योंकि स्वास्थ्य जानकारी कभी नहीं बदलती",
        mr: "कारण आरोग्यविषयक माहिती कधीही बदलत नाही",
      },
      {
        en: "Only doctors are allowed to use official sources",
        hi: "केवल डॉक्टरों को आधिकारिक स्रोतों का उपयोग करने की अनुमति है",
        mr: "फक्त डॉक्टरांनाच अधिकृत स्रोत वापरण्याची परवानगी आहे",
      },
    ],
    answer: 0,
  },
];

const content: Record<
  Language,
  {
    subtitle: string;
    back: string;

    heroLabel: string;
    heroTitle: string;
    heroText: string;

    section1Label: string;
    section1Title: string;
    section1Text: string;
    citizenshipTitle: string;
    citizenshipText: string;

    section2Label: string;
    section2Title: string;
    section2Text: string;

    section3Label: string;
    section3Title: string;
    section3Text: string;
    publicHealthcareTitle: string;
    publicHealthcareText: string;
    privateHealthcareTitle: string;
    privateHealthcareText: string;
    communityHealthTitle: string;
    communityHealthText: string;

    section4Label: string;
    section4Title: string;
    section4Text: string;

    section5Label: string;
    section5Title: string;
    section5Text: string;

    section6Label: string;
    section6Title: string;
    section6Text: string;
    emergencyTitle: string;
    emergencyText: string;

    section7Label: string;
    section7Title: string;
    section7Text: string;

    quizLabel: string;
    quizTitle: string;
    quizText: string;
    question: string;
    saving: string;
    finishQuiz: string;
    nextQuestion: string;
    quizComplete: string;
    scored: string;
    tryAgain: string;

    footer: string;
  }
> = {
  en: {
    subtitle: "Healthcare",
    back: "Explore",

    heroLabel: "CIVIC BASICS · 08",
    heroTitle: "Healthcare",
    heroText:
      "Understand India's healthcare system, different levels of care, public health, healthcare institutions and the role citizens can play in maintaining a healthier community.",

    section1Label: "01 · HEALTHCARE IN INDIA",
    section1Title: "Why is healthcare a civic issue?",
    section1Text:
      "Healthcare affects individuals, families and communities. India's healthcare system includes public and private providers, primary and specialised services, preventive health programmes and institutions operating at different levels of government.",
    citizenshipTitle: "Healthcare and citizenship",
    citizenshipText:
      "Healthcare is not only about treatment. Public health, prevention, sanitation, vaccination, health awareness and access to appropriate services are also important parts of a functioning health system.",

    section2Label: "02 · LEVELS OF CARE",
    section2Title: "Primary, secondary and tertiary care",
    section2Text:
      "Healthcare services can be organised into different levels of care. The exact organisation and terminology can vary across healthcare systems and facilities.",

    section3Label: "03 · PUBLIC & PRIVATE HEALTHCARE",
    section3Title: "Different providers, different roles",
    section3Text:
      "People in India may access healthcare through government facilities, private hospitals, clinics, laboratories, pharmacies and other providers. The services available, costs and referral arrangements can differ between providers and locations.",
    publicHealthcareTitle: "Public Healthcare",
    publicHealthcareText:
      "Government healthcare facilities provide services through the public health system and government programmes.",
    privateHealthcareTitle: "Private Healthcare",
    privateHealthcareText:
      "Private hospitals, clinics and other providers offer healthcare services under their respective arrangements.",
    communityHealthTitle: "Community Health",
    communityHealthText:
      "Community-level health workers and local health initiatives can connect people with health information and services.",

    section4Label: "04 · PUBLIC HEALTH",
    section4Title: "Prevention is part of healthcare",
    section4Text:
      "Public health focuses on protecting and improving the health of populations. It can include disease prevention, vaccination, sanitation, health education, surveillance and other population-level measures.",

    section5Label: "05 · HEALTHCARE INSTITUTIONS",
    section5Title: "Who works in the healthcare system?",
    section5Text:
      "India's healthcare system involves multiple institutions and levels of government. Different organisations have different responsibilities relating to policy, healthcare delivery, research, regulation and public health.",

    section6Label: "06 · HEALTHCARE ACCESS",
    section6Title: "Finding the right service",
    section6Text:
      "Understanding the type of service you need can help you navigate the healthcare system. Routine healthcare, preventive services, specialist consultations and emergencies may require different facilities or pathways.",
    emergencyTitle: "In an emergency",
    emergencyText:
      "Emergency situations require prompt medical attention. Citizens should use the appropriate emergency medical service or nearby emergency facility rather than relying on general civic information.",

    section7Label: "07 · CITIZEN PARTICIPATION",
    section7Title: "What can citizens do?",
    section7Text:
      "Citizens can contribute to public health by following appropriate preventive practices, using healthcare services responsibly, supporting healthy communities and staying informed about official health programmes.",

    quizLabel: "08 · QUICK QUIZ",
    quizTitle: "Test what you learned",
    quizText:
      "Answer five questions to complete this Quiz.",
    question: "Question",
    saving: "Saving...",
    finishQuiz: "Finish Quiz",
    nextQuestion: "Next Question →",
    quizComplete: "Quiz complete!",
    scored: "You scored",
    tryAgain: "Try Again",

    footer: "KrutBharat · Learn. Understand. Participate.",
  },

  hi: {
    subtitle: "स्वास्थ्य सेवा",
    back: "एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 08",
    heroTitle: "स्वास्थ्य सेवा",
    heroText:
      "भारत की स्वास्थ्य व्यवस्था, स्वास्थ्य सेवा के विभिन्न स्तरों, सार्वजनिक स्वास्थ्य, स्वास्थ्य संस्थाओं और स्वस्थ समुदाय बनाए रखने में नागरिकों की भूमिका को समझें।",

    section1Label: "01 · भारत में स्वास्थ्य सेवा",
    section1Title: "स्वास्थ्य सेवा एक नागरिक मुद्दा क्यों है?",
    section1Text:
      "स्वास्थ्य सेवा व्यक्तियों, परिवारों और समुदायों को प्रभावित करती है। भारत की स्वास्थ्य व्यवस्था में सरकारी और निजी प्रदाता, प्राथमिक और विशेषीकृत सेवाएँ, निवारक स्वास्थ्य कार्यक्रम तथा सरकार के विभिन्न स्तरों पर काम करने वाली संस्थाएँ शामिल हैं।",
    citizenshipTitle: "स्वास्थ्य सेवा और नागरिकता",
    citizenshipText:
      "स्वास्थ्य सेवा केवल उपचार तक सीमित नहीं है। सार्वजनिक स्वास्थ्य, रोकथाम, स्वच्छता, टीकाकरण, स्वास्थ्य जागरूकता और उचित सेवाओं तक पहुँच भी एक प्रभावी स्वास्थ्य व्यवस्था के महत्वपूर्ण हिस्से हैं।",

    section2Label: "02 · स्वास्थ्य सेवा के स्तर",
    section2Title: "प्राथमिक, द्वितीयक और तृतीयक स्वास्थ्य सेवा",
    section2Text:
      "स्वास्थ्य सेवाओं को देखभाल के अलग-अलग स्तरों में व्यवस्थित किया जा सकता है। अलग-अलग स्वास्थ्य व्यवस्थाओं और संस्थानों में इसकी सटीक व्यवस्था और शब्दावली अलग हो सकती है।",

    section3Label: "03 · सार्वजनिक और निजी स्वास्थ्य सेवा",
    section3Title: "अलग प्रदाता, अलग भूमिकाएँ",
    section3Text:
      "भारत में लोग सरकारी सुविधाओं, निजी अस्पतालों, क्लीनिकों, प्रयोगशालाओं, फार्मेसियों और अन्य प्रदाताओं के माध्यम से स्वास्थ्य सेवा प्राप्त कर सकते हैं। उपलब्ध सेवाएँ, लागत और रेफरल व्यवस्था प्रदाता और स्थान के अनुसार अलग हो सकती हैं।",
    publicHealthcareTitle: "सार्वजनिक स्वास्थ्य सेवा",
    publicHealthcareText:
      "सरकारी स्वास्थ्य सुविधाएँ सार्वजनिक स्वास्थ्य प्रणाली और सरकारी कार्यक्रमों के माध्यम से सेवाएँ प्रदान करती हैं।",
    privateHealthcareTitle: "निजी स्वास्थ्य सेवा",
    privateHealthcareText:
      "निजी अस्पताल, क्लीनिक और अन्य प्रदाता अपनी संबंधित व्यवस्थाओं के तहत स्वास्थ्य सेवाएँ प्रदान करते हैं।",
    communityHealthTitle: "सामुदायिक स्वास्थ्य",
    communityHealthText:
      "सामुदायिक स्तर के स्वास्थ्य कार्यकर्ता और स्थानीय स्वास्थ्य पहल लोगों को स्वास्थ्य जानकारी और सेवाओं से जोड़ सकते हैं।",

    section4Label: "04 · सार्वजनिक स्वास्थ्य",
    section4Title: "रोकथाम भी स्वास्थ्य सेवा का हिस्सा है",
    section4Text:
      "सार्वजनिक स्वास्थ्य का उद्देश्य जनसंख्या के स्वास्थ्य की रक्षा और उसमें सुधार करना है। इसमें रोग की रोकथाम, टीकाकरण, स्वच्छता, स्वास्थ्य शिक्षा, निगरानी और जनसंख्या स्तर के अन्य उपाय शामिल हो सकते हैं।",

    section5Label: "05 · स्वास्थ्य संस्थाएँ",
    section5Title: "स्वास्थ्य व्यवस्था में कौन काम करता है?",
    section5Text:
      "भारत की स्वास्थ्य व्यवस्था में कई संस्थाएँ और सरकार के विभिन्न स्तर शामिल हैं। अलग-अलग संगठनों की नीति, स्वास्थ्य सेवा वितरण, अनुसंधान, विनियमन और सार्वजनिक स्वास्थ्य से जुड़ी अलग-अलग जिम्मेदारियाँ होती हैं।",

    section6Label: "06 · स्वास्थ्य सेवा तक पहुँच",
    section6Title: "सही सेवा ढूँढना",
    section6Text:
      "आपको किस प्रकार की सेवा की आवश्यकता है, यह समझना स्वास्थ्य व्यवस्था को नेविगेट करने में मदद कर सकता है। नियमित स्वास्थ्य सेवा, निवारक सेवाएँ, विशेषज्ञ परामर्श और आपातकालीन स्थितियों के लिए अलग-अलग सुविधाओं या मार्गों की आवश्यकता हो सकती है।",
    emergencyTitle: "आपातकाल में",
    emergencyText:
      "आपातकालीन स्थितियों में तुरंत चिकित्सा सहायता की आवश्यकता होती है। नागरिकों को सामान्य नागरिक जानकारी पर निर्भर रहने के बजाय उचित आपातकालीन चिकित्सा सेवा या नजदीकी आपातकालीन सुविधा का उपयोग करना चाहिए।",

    section7Label: "07 · नागरिक भागीदारी",
    section7Title: "नागरिक क्या कर सकते हैं?",
    section7Text:
      "नागरिक उचित निवारक उपायों का पालन करके, स्वास्थ्य सेवाओं का जिम्मेदारी से उपयोग करके, स्वस्थ समुदायों को समर्थन देकर और आधिकारिक स्वास्थ्य कार्यक्रमों के बारे में जानकारी रखकर सार्वजनिक स्वास्थ्य में योगदान दे सकते हैं।",

    quizLabel: "08 · त्वरित क्विज़",
    quizTitle: "आपने क्या सीखा, जाँचें",
    quizText:
      "इस Quiz को पूरा करने के लिए पाँच प्रश्नों के उत्तर दें।",
    question: "प्रश्न",
    saving: "सहेजा जा रहा है...",
    finishQuiz: "क्विज़ समाप्त करें",
    nextQuestion: "अगला प्रश्न →",
    quizComplete: "क्विज़ पूरा हुआ!",
    scored: "आपका स्कोर",
    tryAgain: "फिर से प्रयास करें",

    footer: "KrutBharat · सीखें। समझें। भाग लें।",
  },

  mr: {
    subtitle: "आरोग्यसेवा",
    back: "एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 08",
    heroTitle: "आरोग्यसेवा",
    heroText:
      "भारताची आरोग्य व्यवस्था, आरोग्यसेवेचे विविध स्तर, सार्वजनिक आरोग्य, आरोग्य संस्था आणि निरोगी समुदाय टिकवून ठेवण्यात नागरिकांची भूमिका समजून घ्या.",

    section1Label: "01 · भारतातील आरोग्यसेवा",
    section1Title: "आरोग्यसेवा हा नागरी विषय का आहे?",
    section1Text:
      "आरोग्यसेवेचा परिणाम व्यक्ती, कुटुंबे आणि समुदायांवर होतो. भारताच्या आरोग्य व्यवस्थेत सरकारी आणि खासगी सेवा पुरवठादार, प्राथमिक व विशेषीकृत सेवा, प्रतिबंधात्मक आरोग्य कार्यक्रम आणि सरकारच्या विविध स्तरांवर कार्य करणाऱ्या संस्थांचा समावेश होतो.",
    citizenshipTitle: "आरोग्यसेवा आणि नागरिकत्व",
    citizenshipText:
      "आरोग्यसेवा ही केवळ उपचारांपुरती मर्यादित नाही. सार्वजनिक आरोग्य, प्रतिबंध, स्वच्छता, लसीकरण, आरोग्यविषयक जनजागृती आणि योग्य सेवांपर्यंतचा प्रवेश हे देखील कार्यक्षम आरोग्य व्यवस्थेचे महत्त्वाचे भाग आहेत.",

    section2Label: "02 · आरोग्यसेवेचे स्तर",
    section2Title: "प्राथमिक, दुय्यम आणि तृतीयक आरोग्यसेवा",
    section2Text:
      "आरोग्यसेवा विविध स्तरांमध्ये आयोजित केली जाऊ शकते. वेगवेगळ्या आरोग्य व्यवस्था आणि संस्थांमध्ये तिची अचूक रचना व संज्ञा बदलू शकतात.",

    section3Label: "03 · सार्वजनिक आणि खासगी आरोग्यसेवा",
    section3Title: "वेगवेगळे सेवा पुरवठादार, वेगवेगळ्या भूमिका",
    section3Text:
      "भारतामध्ये लोक सरकारी सुविधा, खासगी रुग्णालये, दवाखाने, प्रयोगशाळा, औषधांची दुकाने आणि इतर सेवा पुरवठादारांमार्फत आरोग्यसेवा घेऊ शकतात. उपलब्ध सेवा, खर्च आणि रेफरल व्यवस्था सेवा पुरवठादार व ठिकाणानुसार बदलू शकतात.",
    publicHealthcareTitle: "सार्वजनिक आरोग्यसेवा",
    publicHealthcareText:
      "सरकारी आरोग्य सुविधा सार्वजनिक आरोग्य व्यवस्था आणि सरकारी कार्यक्रमांद्वारे सेवा पुरवतात.",
    privateHealthcareTitle: "खासगी आरोग्यसेवा",
    privateHealthcareText:
      "खासगी रुग्णालये, दवाखाने आणि इतर सेवा पुरवठादार त्यांच्या संबंधित व्यवस्थेनुसार आरोग्यसेवा देतात.",
    communityHealthTitle: "समुदाय आरोग्य",
    communityHealthText:
      "समुदाय पातळीवरील आरोग्य कर्मचारी आणि स्थानिक आरोग्य उपक्रम लोकांना आरोग्यविषयक माहिती आणि सेवांशी जोडू शकतात.",

    section4Label: "04 · सार्वजनिक आरोग्य",
    section4Title: "प्रतिबंध हा आरोग्यसेवेचा एक भाग आहे",
    section4Text:
      "सार्वजनिक आरोग्याचा उद्देश लोकसंख्येच्या आरोग्याचे संरक्षण करणे आणि त्यात सुधारणा करणे हा आहे. यामध्ये रोग प्रतिबंध, लसीकरण, स्वच्छता, आरोग्य शिक्षण, देखरेख आणि लोकसंख्या पातळीवरील इतर उपायांचा समावेश होऊ शकतो.",

    section5Label: "05 · आरोग्य संस्था",
    section5Title: "आरोग्य व्यवस्थेत कोण कार्य करते?",
    section5Text:
      "भारताच्या आरोग्य व्यवस्थेत अनेक संस्था आणि सरकारच्या विविध स्तरांचा समावेश आहे. धोरण, आरोग्यसेवा वितरण, संशोधन, नियमन आणि सार्वजनिक आरोग्य याबाबत विविध संस्थांच्या वेगवेगळ्या जबाबदाऱ्या असतात.",

    section6Label: "06 · आरोग्यसेवेपर्यंत पोहोच",
    section6Title: "योग्य सेवा शोधणे",
    section6Text:
      "तुम्हाला कोणत्या प्रकारची सेवा आवश्यक आहे हे समजून घेतल्याने आरोग्य व्यवस्था वापरण्यास मदत होऊ शकते. नियमित आरोग्यसेवा, प्रतिबंधात्मक सेवा, तज्ज्ञांचा सल्ला आणि आपत्कालीन परिस्थिती यासाठी वेगवेगळ्या सुविधा किंवा मार्गांची आवश्यकता असू शकते.",
    emergencyTitle: "आपत्कालीन परिस्थितीत",
    emergencyText:
      "आपत्कालीन परिस्थितींमध्ये त्वरित वैद्यकीय मदतीची आवश्यकता असते. सर्वसाधारण नागरी माहितीकडे अवलंबून राहण्याऐवजी नागरिकांनी योग्य आपत्कालीन वैद्यकीय सेवा किंवा जवळच्या आपत्कालीन सुविधेचा वापर करावा.",

    section7Label: "07 · नागरिक सहभाग",
    section7Title: "नागरिक काय करू शकतात?",
    section7Text:
      "नागरिक योग्य प्रतिबंधात्मक उपायांचे पालन करून, आरोग्यसेवांचा जबाबदारीने वापर करून, निरोगी समुदायांना पाठबळ देऊन आणि अधिकृत आरोग्य कार्यक्रमांबद्दल माहिती अद्ययावत ठेवून सार्वजनिक आरोग्यात योगदान देऊ शकतात.",

    quizLabel: "08 · झटपट क्विझ",
    quizTitle: "तुम्ही काय शिकलात ते तपासा",
    quizText:
      "हे Quiz पूर्ण करण्यासाठी पाच प्रश्नांची उत्तरे द्या.",
    question: "प्रश्न",
    saving: "सेव्ह होत आहे...",
    finishQuiz: "क्विझ पूर्ण करा",
    nextQuestion: "पुढील प्रश्न →",
    quizComplete: "क्विझ पूर्ण!",
    scored: "तुमचा गुण",
    tryAgain: "पुन्हा प्रयत्न करा",

    footer: "KrutBharat · शिका. समजा. सहभागी व्हा.",
  },
};

export default function HealthcarePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage } = useLanguage();

  const t = content[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const saveProgress = async (finalScore: number) => {
    try {
      setSavingProgress(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found:", userError);
        return;
      }

      const { error } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: user.id,
            topic: "healthcare",
            completed: true,
            score: finalScore,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,topic",
          }
        );

      if (error) {
        console.error("Error saving learning progress:", error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setSavingProgress(false);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore =
        score + (selectedAnswer === question.answer ? 1 : 0);

      setQuizFinished(true);
      setScore(finalScore);

      await saveProgress(finalScore);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <main className="kf-explore-page kf-healthcare-page"
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "32px 5% 70px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <header
          className="kf-explore-topbar"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "18px",
            marginBottom: "16px",
            padding: "12px 14px",
            border: "1px solid #ddd7ce",
            borderRadius: "25px",
            background: "rgba(255,253,249,.96)",
            boxShadow: "0 14px 36px rgba(16,27,43,.055)",
            backdropFilter: "blur(16px)",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="kf-explore-back"
            style={{
              justifySelf: "start",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "42px",
              padding: "10px 15px",
              border: "1px solid #dad4cc",
              borderRadius: "999px",
              background: "#fffdf9",
              color: "#506171",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: "#ff7a00",
                fontSize: "15px",
              }}
            >
              ←
            </span>
            {t.back}
          </button>

          <div
            className="kf-explore-brand"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              className="kf-explore-brand-box"
              style={{
                width: "38px",
                height: "38px",
                display: "grid",
                placeItems: "center",
                borderRadius: "13px",
                background: "#ff7a00",
                color: "#ffffff",
                fontFamily: "var(--font-display)",
                fontSize: "21px",
                fontWeight: "800",
              }}
            >
              K
            </div>

            <div>
              <div
                className="kf-explore-brand-name"
                style={{
                  color: "#102033",
                  fontFamily: "var(--font-display)",
                  fontSize: "23px",
                  lineHeight: "1",
                  letterSpacing: "-.045em",
                  fontWeight: "800",
                }}
              >
                Krut<span style={{ color: "#ff7a00" }}>Bharat</span>
              </div>

              <div
                className="kf-explore-brand-caption"
                style={{
                  marginTop: "3px",
                  color: "#8b938f",
                  fontSize: "8px",
                  lineHeight: "1",
                  letterSpacing: ".16em",
                  fontWeight: "900",
                }}
              >
                EXPLORE &amp; LEARN
              </div>
            </div>
          </div>

          <label
            className="kf-explore-language"
            style={{
              justifySelf: "end",
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              color: "#53636f",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: "900",
            }}
          >
            <span>
              {language === "en" ? "Language" : "भाषा"}
            </span>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label={
                language === "en" ? "Language" : "भाषा"
              }
              className="kf-explore-language-select"
              style={{
                minWidth: "120px",
                padding: "10px 13px",
                border: "1px solid #d7d1c9",
                borderRadius: "999px",
                background: "#fffdf9",
                color: "#304154",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: "800",
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
          className="kf-explore-hero kf-hero"
          style={{
            marginBottom: "65px",
          }}
        >
          <div className="kf-hero-copy">
            <SectionLabel text={t.heroLabel} />

            <h1
              style={{
                fontSize: "72px",
                lineHeight: "0.98",
                letterSpacing: "-0.045em",
                fontWeight: "800",
                margin: "0 0 24px",
                maxWidth: "920px",
              }}
            >
              {t.heroTitle}
            </h1>

            <p
              style={{
                color: "#596a78",
                fontSize: "19px",
                lineHeight: "1.72",
                maxWidth: "900px",
                margin: 0,
              }}
            >
              {t.heroText}
            </p>
          </div>

          <div className="kf-hero-badge">
            <div className="kf-hero-badge-icon">🩺</div>
            <div>
              <div className="kf-hero-badge-title">Civic knowledge</div>
              <div className="kf-hero-badge-subtitle">Healthcare</div>
            </div>
          </div>
        </section>

        {/* SECTION 1 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section1Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section1Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section1Text}
          </p>

          <div
            className="kf-healthcare-callout"
            style={{
              marginTop: "30px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "21px",
                margin: "0 0 12px",
              }}
            >
              {t.citizenshipTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.citizenshipText}
            </p>
          </div>
        </section>

        {/* SECTION 2 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section2Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section2Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section2Text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {healthcareLevels.map((level, index) => (
              <SimpleCard
                key={`${level.icon}-${index}`}
                icon={level.icon}
                title={level.title[language]}
                text={level.text[language]}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section3Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section3Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section3Text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            <SimpleCard
              icon="🏛️"
              title={t.publicHealthcareTitle}
              text={t.publicHealthcareText}
            />

            <SimpleCard
              icon="🏥"
              title={t.privateHealthcareTitle}
              text={t.privateHealthcareText}
            />

            <SimpleCard
              icon="🤝"
              title={t.communityHealthTitle}
              text={t.communityHealthText}
            />
          </div>
        </section>

        {/* SECTION 4 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section4Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section4Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section4Text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {healthcareAreas.map((area, index) => (
              <SimpleCard
                key={`${area.icon}-${index}`}
                icon={area.icon}
                title={area.title[language]}
                text={area.text[language]}
              />
            ))}
          </div>
        </section>

        {/* SECTION 5 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section5Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section5Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section5Text}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {healthcareInstitutions.map(
              (institution, index) => (
                <SimpleCard
                  key={`${institution.icon}-${index}`}
                  icon={institution.icon}
                  title={institution.title[language]}
                  text={institution.text[language]}
                />
              )
            )}
          </div>
        </section>

        {/* SECTION 6 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section6Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section6Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section6Text}
          </p>

          <div
            className="kf-healthcare-callout"
            style={{
              marginTop: "30px",
              background:
                "linear-gradient(135deg, #0f172a, #111827)",
              border: "1px solid #334155",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <h3
              style={{
                fontSize: "21px",
                margin: "0 0 12px",
              }}
            >
              {t.emergencyTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.emergencyText}
            </p>
          </div>
        </section>

        {/* SECTION 7 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section7Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section7Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section7Text}
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gap: "12px",
            }}
          >
            {citizenActions.map((action) => (
              <div
                key={action.number}
                className="kf-healthcare-action-card"
                style={{
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div
                  className="kf-healthcare-action-number"
                  style={{
                    minWidth: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background:
                      "rgba(255, 122, 0, 0.1)",
                    color: "#ff7a00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "13px",
                  }}
                >
                  {action.number}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "19px",
                      margin: "0 0 7px",
                    }}
                  >
                    {action.title[language]}
                  </h3>

                  <p
                    style={{
                      color: "#94a3b8",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {action.text[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* QUIZ */}

        <section
          className="kf-quiz-section"
          style={{
            background:
              "linear-gradient(135deg, #0f172a, #111827)",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "35px",
          }}
        >
          <SectionLabel text={t.quizLabel} />

          <h2
            style={{
              fontSize: "30px",
              margin: "0 0 12px",
            }}
          >
            {t.quizTitle}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            {t.quizText}
          </p>

          {!quizFinished ? (
            <div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginBottom: "12px",
                }}
              >
                {t.question} {currentQuestion + 1}{" "}
                {language === "en"
                  ? "of"
                  : language === "hi"
                  ? "में से"
                  : "पैकी"}{" "}
                {quizQuestions.length}
              </div>

              <h3
                style={{
                  fontSize: "22px",
                  lineHeight: "1.5",
                  margin: "0 0 22px",
                }}
              >
                {question.question[language]}
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {question.options.map((option, index) => {
                  const isSelected =
                    selectedAnswer === index;
                  const isCorrect =
                    index === question.answer;

                  let border = "1px solid #334155";
                  let background = "#020617";

                  if (
                    selectedAnswer !== null &&
                    isCorrect
                  ) {
                    border = "1px solid #22c55e";
                    background =
                      "rgba(34, 197, 94, 0.08)";
                  }

                  if (
                    selectedAnswer === index &&
                    !isCorrect
                  ) {
                    border = "1px solid #ef4444";
                    background =
                      "rgba(239, 68, 68, 0.08)";
                  }

                  return (
                    <button
                      type="button"
                      className="kf-quiz-answer"
                      key={`${index}-${option.en}`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      data-quiz-state={
                        selectedAnswer === null
                          ? "default"
                          : isCorrect
                          ? "correct"
                          : isSelected
                          ? "wrong"
                          : "default"
                      }
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "16px 18px",
                        background,
                        color: "white",
                        border,
                        borderRadius: "12px",
                        cursor:
                          selectedAnswer === null
                            ? "pointer"
                            : "default",
                        fontSize: "15px",
                      }}
                    >
                      {option[language]}

                      {selectedAnswer !== null &&
                        isCorrect && (
                          <span
                            style={{
                              float: "right",
                              color: "#22c55e",
                              fontWeight: "700",
                            }}
                          >
                            ✓
                          </span>
                        )}

                      {isSelected && !isCorrect && (
                        <span
                          style={{
                            float: "right",
                            color: "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          ✕
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <button
                  type="button"
                  className="kf-quiz-next"
                  onClick={nextQuestion}
                  disabled={savingProgress}
                  style={{
                    marginTop: "25px",
                    padding: "13px 22px",
                    background: "#ff7a00",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: savingProgress
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
                    opacity: savingProgress ? 0.7 : 1,
                  }}
                >
                  {currentQuestion ===
                  quizQuestions.length - 1
                    ? savingProgress
                      ? t.saving
                      : t.finishQuiz
                    : t.nextQuestion}
                </button>
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  fontSize: "50px",
                  marginBottom: "15px",
                }}
              >
                🎉
              </div>

              <h3
                style={{
                  fontSize: "28px",
                  margin: "0 0 10px",
                }}
              >
                {t.quizComplete}
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "17px",
                  marginBottom: "25px",
                }}
              >
                {t.scored}{" "}
                <strong
                  style={{ color: "#ff7a00" }}
                >
                  {score}/{quizQuestions.length}
                </strong>
              </p>

              <button
                type="button"
                className="kf-quiz-restart"
                onClick={restartQuiz}
                style={{
                  padding: "13px 22px",
                  background: "transparent",
                  color: "white",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                {t.tryAgain}
              </button>
            </div>
          )}
        </section>

        {/* FOOTER */}

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {t.footer}
        </div>
      </div>
        <style>{`
          .kf-explore-page {
            --kf-ivory: #f8f3ea;
            --kf-white: #fffdf9;
            --kf-navy: #102033;
            --kf-ink: #263447;
            --kf-body: #596a78;
            --kf-muted: #7b8790;
            --kf-orange: #ff7a00;
            --kf-blue: #edf5fa;
            --kf-blue-line: #d6e5ed;
            --kf-peach: #fff2e4;
            --kf-peach-line: #eedbc6;
            --kf-green: #eef6e7;
            --kf-green-line: #d5e5ca;
            --kf-lavender: #f4eff9;
            --kf-lavender-line: #dfd4ea;
            --kf-line: #ddd7ce;

            min-height: 100vh !important;
            background:
              radial-gradient(circle at 92% 2%, rgba(215,232,242,.95) 0%, rgba(215,232,242,0) 26%),
              radial-gradient(circle at 5% 35%, rgba(231,242,248,.78) 0%, rgba(231,242,248,0) 25%),
              radial-gradient(circle at 92% 93%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 28%),
              var(--kf-ivory) !important;
            color: var(--kf-body) !important;
            padding: 20px 16px 72px !important;
            font-family: var(--font-body) !important;
          }

          .kf-explore-page > div {
            width: min(1120px, 100%) !important;
            max-width: none !important;
            margin: 0 auto !important;
          }

          .kf-simple-card {
            background: #fffdf9 !important;
            border: 1px solid rgba(16,27,43,.08) !important;
            border-radius: 22px !important;
            box-shadow: 0 8px 24px rgba(16,27,43,.035) !important;
          }
          .kf-simple-card h3 { color: var(--kf-ink) !important; }
          .kf-simple-card p { color: var(--kf-body) !important; }

          .kf-explore-page header {
            margin-bottom: 16px !important;
            padding: 12px 14px !important;
            border: 1px solid var(--kf-line) !important;
            border-radius: 25px !important;
            background: rgba(255,253,249,.96) !important;
            box-shadow: 0 14px 36px rgba(16,27,43,.055) !important;
            backdrop-filter: blur(16px);
          }

          .kf-explore-page header div { color: var(--kf-navy) !important; }

          /* Keep the KrutBharat K white inside the orange logo box. */
          .kf-explore-page header .kf-explore-brand-box {
            color: #ffffff !important;
          }

          .kf-explore-page .kf-hero {
            position: relative !important;
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: center !important;
            gap: 34px !important;
          }

          .kf-explore-page .kf-hero-copy {
            min-width: 0;
          }

          .kf-explore-page .kf-hero-badge {
            min-width: 285px;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 18px 20px;
            border: 1px solid var(--kf-peach-line);
            border-radius: 28px;
            background: rgba(255,242,228,.92);
            box-shadow: 0 10px 28px rgba(16,27,43,.045);
          }

          .kf-explore-page .kf-hero-badge-icon {
            width: 56px;
            height: 56px;
            flex: 0 0 56px;
            display: grid;
            place-items: center;
            border: 1px solid #eadfd3;
            border-radius: 18px;
            background: #fffdf9;
            font-size: 25px;
          }

          .kf-explore-page .kf-hero-badge-title {
            color: #304154 !important;
            font-family: var(--font-display);
            font-size: 21px;
            line-height: 1.1;
            font-weight: 800;
          }

          .kf-explore-page .kf-hero-badge-subtitle {
            margin-top: 6px;
            color: #8b725f !important;
            font-family: var(--font-body);
            font-size: 12px;
            line-height: 1.2;
            font-weight: 700;
          }

          .kf-explore-page header select {
            background: #fffdf9 !important;
            color: #304154 !important;
            border: 1px solid #d7d1c9 !important;
            border-radius: 999px !important;
          }
          .kf-explore-page header button {
            color: #4d6070 !important;
            border-color: #dad4cc !important;
            border-radius: 999px !important;
            background: #fffdf9 !important;
          }

          .kf-explore-page > div > section {
            margin-bottom: 16px !important;
            padding: 30px !important;
            border: 1px solid var(--kf-line) !important;
            border-radius: 31px !important;
            box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
          }

          .kf-explore-page > div > section:nth-of-type(1) {
            padding: 32px !important;
            background:
              radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
              radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
              rgba(255,253,249,.97) !important;
          }

          .kf-explore-page > div > section:nth-of-type(2) { background: var(--kf-blue) !important; border-color: var(--kf-blue-line) !important; }
          .kf-explore-page > div > section:nth-of-type(3) { background: var(--kf-peach) !important; border-color: var(--kf-peach-line) !important; }
          .kf-explore-page > div > section:nth-of-type(4) { background: var(--kf-green) !important; border-color: var(--kf-green-line) !important; }
          .kf-explore-page > div > section:nth-of-type(5) { background: var(--kf-lavender) !important; border-color: var(--kf-lavender-line) !important; }
          .kf-explore-page > div > section:nth-of-type(6) { background: var(--kf-blue) !important; border-color: var(--kf-blue-line) !important; }
          .kf-explore-page > div > section:nth-of-type(7) { background: var(--kf-peach) !important; border-color: var(--kf-peach-line) !important; }
          .kf-explore-page > div > section:nth-of-type(8) { background: var(--kf-lavender) !important; border-color: var(--kf-lavender-line) !important; }

          .kf-explore-page h1,
          .kf-explore-page h2,
          .kf-explore-page h3 {
            color: var(--kf-ink) !important;
            font-family: var(--font-display) !important;
          }

          .kf-explore-page p,
          .kf-explore-page li { color: var(--kf-body) !important; }

          .kf-explore-page [style*="background"] { box-shadow: 0 9px 22px rgba(16,27,43,.035) !important; }

          .kf-explore-page > div > section:nth-of-type(2) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(3) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(4) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(5) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(6) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(7) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(8) [style*="background"] {
            background: rgba(255,253,249,.80) !important;
            border: 1px solid rgba(16,27,43,.075) !important;
            border-radius: 22px !important;
          }

          .kf-explore-page > div > section:nth-of-type(2) > div:last-child,
          .kf-explore-page > div > section:nth-of-type(7) > div:last-child {
            background: rgba(255,253,249,.80) !important;
            border: 1px solid rgba(16,27,43,.075) !important;
            border-radius: 23px !important;
          }

          .kf-explore-page [style*="color: #ff7a00"] { color: #9c6b42 !important; }

          /* Healthcare has 8 content sections after the hero, so the quiz is section 9. */
          .kf-explore-page > div > section:nth-of-type(9) {
            position: relative !important;
            overflow: hidden !important;
            padding: 30px !important;
            background:
              radial-gradient(circle at 94% 0%, rgba(218,235,244,.95) 0%, rgba(218,235,244,0) 34%),
              radial-gradient(circle at 0% 100%, rgba(255,232,210,.88) 0%, rgba(255,232,210,0) 34%),
              rgba(255,253,249,.98) !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) button { border-radius: 19px !important; }
          .kf-explore-page > div > section:nth-of-type(9) button:not(:last-child) {
            color: #425565 !important;
            background: #fffdf9 !important;
            border-color: #ded9d1 !important;
          }
          .kf-explore-page > div > section:nth-of-type(9) button:last-child {
            color: #fff !important;
            background: var(--kf-orange) !important;
            border-color: var(--kf-orange) !important;
          }

          .kf-explore-page > div > div:last-child { color: #89939a !important; text-align: center !important; }

          @media (max-width: 900px) {
            .kf-explore-page > div > section { padding: 22px !important; }
          }
          @media (max-width: 900px) {
            .kf-explore-page > div > section { padding: 22px !important; }

            .kf-explore-page .kf-hero {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }

            .kf-explore-page .kf-hero-badge {
              width: fit-content;
              min-width: 0;
            }

            .kf-explore-page .kf-hero h1 {
              font-size: 58px !important;
            }
          }

          @media (max-width: 680px) {
            .kf-explore-page { padding: 12px 10px 44px !important; }
            .kf-explore-page > div > section { padding: 20px !important; border-radius: 24px !important; }
            .kf-explore-page header { padding: 11px 12px !important; }

            .kf-explore-page .kf-hero {
              gap: 20px !important;
            }

            .kf-explore-page .kf-hero h1 {
              font-size: 46px !important;
              line-height: 1 !important;
            }

            .kf-explore-page .kf-hero-badge {
              width: 100%;
              box-sizing: border-box;
              padding: 15px 16px;
              border-radius: 22px;
            }

            .kf-explore-page .kf-hero-badge-icon {
              width: 50px;
              height: 50px;
              flex-basis: 50px;
              border-radius: 15px;
            }
          }
        `}</style>
    </main>
  );
}

/* -------------------------------------------------- */
/* REUSABLE COMPONENTS */
/* -------------------------------------------------- */

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        color: "#ff7a00",
        fontSize: "14px",
        fontWeight: "700",
        letterSpacing: "1px",
        marginBottom: "10px",
      }}
    >
      {text}
    </div>
  );
}

function SimpleCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="kf-simple-card kf-healthcare-card"
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "18px",
        padding: "25px",
      }}
    >
      <div
        style={{
          fontSize: "32px",
          marginBottom: "14px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "20px",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.65",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

/* -------------------------------------------------- */
/* STYLES */
/* -------------------------------------------------- */

const sectionHeadingStyle = {
  fontSize: "32px",
  margin: "0 0 15px",
};

const paragraphStyle = {
  color: "#94a3b8",
  fontSize: "17px",
  lineHeight: "1.75",
  maxWidth: "850px",
  margin: 0,
};