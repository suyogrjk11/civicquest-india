"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = {
  en: string;
  hi: string;
  mr: string;
};

type LocalizedLevel = {
  icon: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
};

type LocalizedQuizQuestion = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
};

const levels: LocalizedLevel[] = [
  {
    icon: "🇮🇳",
    title: {
      en: "Union Government",
      hi: "केंद्र सरकार",
      mr: "केंद्र सरकार",
    },
    subtitle: {
      en: "National level",
      hi: "राष्ट्रीय स्तर",
      mr: "राष्ट्रीय स्तर",
    },
    description: {
      en: "Deals with matters that concern the country as a whole, including areas assigned to the Union by the Constitution.",
      hi: "केंद्र सरकार उन विषयों से संबंधित मामलों को देखती है जो पूरे देश से जुड़े होते हैं, जिनमें संविधान द्वारा केंद्र को सौंपे गए विषय शामिल हैं।",
      mr: "केंद्र सरकार संपूर्ण देशाशी संबंधित विषय हाताळते. यामध्ये संविधानाने केंद्राला सोपवलेल्या विषयांचाही समावेश होतो.",
    },
  },
  {
    icon: "🏛️",
    title: {
      en: "State Government",
      hi: "राज्य सरकार",
      mr: "राज्य सरकार",
    },
    subtitle: {
      en: "State level",
      hi: "राज्य स्तर",
      mr: "राज्य स्तर",
    },
    description: {
      en: "Governs matters assigned to the states and works through the state legislature, executive and administration.",
      hi: "राज्य सरकार उन विषयों का प्रशासन करती है जो राज्यों को सौंपे गए हैं और राज्य विधानमंडल, कार्यपालिका तथा प्रशासन के माध्यम से काम करती है।",
      mr: "राज्य सरकार राज्यांना सोपवलेल्या विषयांचे प्रशासन करते आणि राज्य विधिमंडळ, कार्यपालिका व प्रशासनाच्या माध्यमातून काम करते.",
    },
  },
  {
    icon: "🏙️",
    title: {
      en: "Local Government",
      hi: "स्थानीय सरकार",
      mr: "स्थानिक स्वराज्य संस्था",
    },
    subtitle: {
      en: "Community level",
      hi: "स्थानीय स्तर",
      mr: "स्थानिक पातळी",
    },
    description: {
      en: "Works closer to citizens through institutions such as Panchayats in rural areas and Municipalities in urban areas.",
      hi: "ग्रामीण क्षेत्रों में पंचायतों और शहरी क्षेत्रों में नगरपालिकाओं जैसी संस्थाओं के माध्यम से नागरिकों के निकट काम करती है।",
      mr: "ग्रामीण भागात ग्रामपंचायती आणि शहरी भागात नगरपालिका यांसारख्या संस्थांद्वारे नागरिकांच्या जवळ काम करते.",
    },
  },
];

const quizQuestions: LocalizedQuizQuestion[] = [
  {
    question: {
      en: "Which level of government is closest to citizens in their local community?",
      hi: "स्थानीय समुदाय में नागरिकों के सबसे निकट सरकार का कौन-सा स्तर होता है?",
      mr: "स्थानिक समुदायातील नागरिकांच्या सर्वात जवळ सरकारचा कोणता स्तर असतो?",
    },
    options: [
      {
        en: "Union Government",
        hi: "केंद्र सरकार",
        mr: "केंद्र सरकार",
      },
      {
        en: "State Government",
        hi: "राज्य सरकार",
        mr: "राज्य सरकार",
      },
      {
        en: "Local Government",
        hi: "स्थानीय सरकार",
        mr: "स्थानिक स्वराज्य संस्था",
      },
      {
        en: "International Government",
        hi: "अंतरराष्ट्रीय सरकार",
        mr: "आंतरराष्ट्रीय सरकार",
      },
    ],
    answer: 2,
  },
  {
    question: {
      en: "Panchayats are associated primarily with which areas?",
      hi: "पंचायतें मुख्य रूप से किन क्षेत्रों से संबंधित हैं?",
      mr: "पंचायती राज संस्था प्रामुख्याने कोणत्या भागांशी संबंधित आहेत?",
    },
    options: [
      {
        en: "Rural areas",
        hi: "ग्रामीण क्षेत्र",
        mr: "ग्रामीण भाग",
      },
      {
        en: "International borders",
        hi: "अंतरराष्ट्रीय सीमाएँ",
        mr: "आंतरराष्ट्रीय सीमा",
      },
      {
        en: "Only metropolitan cities",
        hi: "केवल महानगर",
        mr: "फक्त महानगरे",
      },
      {
        en: "Foreign affairs",
        hi: "विदेश मामले",
        mr: "परराष्ट्र व्यवहार",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which institution is associated with urban local government?",
      hi: "शहरी स्थानीय सरकार से कौन-सी संस्था संबंधित है?",
      mr: "शहरी स्थानिक स्वराज्य संस्थांशी कोणती संस्था संबंधित आहे?",
    },
    options: [
      {
        en: "Municipality",
        hi: "नगरपालिका",
        mr: "नगरपालिका",
      },
      {
        en: "Parliament",
        hi: "संसद",
        mr: "संसद",
      },
      {
        en: "Supreme Court",
        hi: "सर्वोच्च न्यायालय",
        mr: "सर्वोच्च न्यायालय",
      },
      {
        en: "Election Commission of India",
        hi: "भारत निर्वाचन आयोग",
        mr: "भारत निवडणूक आयोग",
      },
    ],
    answer: 0,
  },
];

const content: Record<
  Language,
  {
    headerTitle: string;
    topicLabel: string;
    back: string;
    heroTitle: string;
    heroDescription: string;

    section1Label: string;
    section1Title: string;
    section1Description: string;

    section2Label: string;
    section2Title: string;
    section2Description: string;

    parliamentTitle: string;
    parliamentText: string;

    executiveTitle: string;
    executiveText: string;

    judiciaryTitle: string;
    judiciaryText: string;

    section3Label: string;
    section3Title: string;
    section3Description: string;

    example: string;
    exampleText: string;

    section4Label: string;
    section4Title: string;
    section4Description: string;

    panchayatsTitle: string;
    panchayatsText: string;

    municipalitiesTitle: string;
    municipalitiesText: string;

    section5Label: string;
    section5Title: string;
    section5Description: string;

    responsibilityTitle: string;
    responsibilityText: string;

    participationTitle: string;
    participationText: string;

    questionsTitle: string;
    questionsDescription: string;

    question: string;
    saving: string;
    finishQuiz: string;
    nextQuestion: string;

    quizComplete: string;
    scoreText: string;
    tryAgain: string;

    footer: string;
  }
> = {
  en: {
    headerTitle: "Government & Governance",
    topicLabel: "CIVIC BASICS · 01",
    back: "← Explore",

    heroTitle: "How does government work in India?",
    heroDescription:
      "Government is the system through which public institutions make decisions, implement laws, deliver services and administer public affairs. In India, responsibilities are distributed across different levels of government.",

    section1Label: "01 · THE BIG PICTURE",
    section1Title: "India has different levels of government",
    section1Description:
      "A citizen may interact with different public institutions depending on the issue. National matters may involve the Union Government, state-level matters may involve the State Government, while many everyday community issues involve local government.",

    section2Label: "02 · UNION GOVERNMENT",
    section2Title: "The Union Government",
    section2Description:
      "The Union Government operates at the national level. The Constitution distributes legislative and administrative responsibilities between the Union and the States.",

    parliamentTitle: "Parliament",
    parliamentText:
      "The Union legislature consists of the President and two Houses: the Council of States and the House of the People.",

    executiveTitle: "Executive",
    executiveText:
      "The Union executive includes the President, the Vice-President and the Council of Ministers headed by the Prime Minister.",

    judiciaryTitle: "Judiciary",
    judiciaryText:
      "The Supreme Court is the highest court in India's judicial system and forms part of the constitutional structure.",

    section3Label: "03 · STATE GOVERNMENT",
    section3Title: "The State Government",
    section3Description:
      "Each state has its own constitutional institutions. The state legislature makes laws within the areas assigned to the state, while the state executive administers those laws and government functions.",

    example: "Example",
    exampleText:
      "Police and public order are examples of subjects placed in the State List in the Constitution. This illustrates why a citizen may need to interact with state-level institutions for certain issues.",

    section4Label: "04 · LOCAL GOVERNMENT",
    section4Title: "Government closest to the community",
    section4Description:
      "Local government provides a constitutional framework for self-government closer to citizens. The Constitution contains separate provisions for Panchayats in rural areas and Municipalities in urban areas.",

    panchayatsTitle: "Panchayats",
    panchayatsText:
      "Part IX of the Constitution provides for Panchayats as institutions of self-government for rural areas. It provides for village, intermediate and district levels, subject to the constitutional provisions.",

    municipalitiesTitle: "Municipalities",
    municipalitiesText:
      "Part IXA provides for Municipalities in urban areas, including Nagar Panchayats, Municipal Councils and Municipal Corporations.",

    section5Label: "05 · WHY IT MATTERS",
    section5Title: "Why should citizens understand this?",
    section5Description:
      "Knowing which level of government is responsible for an issue can help citizens understand where public decisions are made and which institution may be relevant when they want information, participate in public processes or raise a civic concern.",

    responsibilityTitle: "Understand responsibility",
    responsibilityText:
      "Different public issues can involve different institutions and levels of government.",

    participationTitle: "Participate meaningfully",
    participationText:
      "Civic participation becomes easier when citizens understand how institutions are structured.",

    questionsTitle: "Test what you learned",
    questionsDescription:
      "Answer three questions to complete this KarmaFacie.",

    question: "Question",
    saving: "Saving...",
    finishQuiz: "Finish Quiz",
    nextQuestion: "Next Question →",

    quizComplete: "Quiz complete!",
    scoreText: "You scored",
    tryAgain: "Try Again",

    footer: "KarmaFacie · Learn. Understand. Participate.",
  },

  hi: {
    headerTitle: "सरकार एवं शासन",
    topicLabel: "नागरिक ज्ञान · 01",
    back: "← विषयों पर वापस जाएँ",

    heroTitle: "भारत में सरकार कैसे काम करती है?",
    heroDescription:
      "सरकार वह व्यवस्था है जिसके माध्यम से सार्वजनिक संस्थाएँ निर्णय लेती हैं, कानून लागू करती हैं, सेवाएँ प्रदान करती हैं और सार्वजनिक कार्यों का प्रशासन करती हैं। भारत में जिम्मेदारियाँ सरकार के विभिन्न स्तरों के बीच विभाजित हैं।",

    section1Label: "01 · संपूर्ण समझ",
    section1Title: "भारत में सरकार के विभिन्न स्तर हैं",
    section1Description:
      "किसी विषय के आधार पर एक नागरिक को विभिन्न सार्वजनिक संस्थाओं से संपर्क करना पड़ सकता है। राष्ट्रीय विषय केंद्र सरकार से, राज्य स्तर के विषय राज्य सरकार से और रोज़मर्रा के कई सामुदायिक विषय स्थानीय सरकार से जुड़े हो सकते हैं।",

    section2Label: "02 · केंद्र सरकार",
    section2Title: "केंद्र सरकार",
    section2Description:
      "केंद्र सरकार राष्ट्रीय स्तर पर कार्य करती है। संविधान केंद्र और राज्यों के बीच विधायी तथा प्रशासनिक जिम्मेदारियों का विभाजन करता है।",

    parliamentTitle: "संसद",
    parliamentText:
      "केंद्र की विधायिका में राष्ट्रपति और दो सदन शामिल हैं: राज्य सभा और लोक सभा।",

    executiveTitle: "कार्यपालिका",
    executiveText:
      "केंद्र की कार्यपालिका में राष्ट्रपति, उपराष्ट्रपति और प्रधानमंत्री के नेतृत्व वाली मंत्रिपरिषद शामिल होती है।",

    judiciaryTitle: "न्यायपालिका",
    judiciaryText:
      "सर्वोच्च न्यायालय भारत की न्यायिक व्यवस्था का सर्वोच्च न्यायालय है और संवैधानिक ढाँचे का एक महत्वपूर्ण हिस्सा है।",

    section3Label: "03 · राज्य सरकार",
    section3Title: "राज्य सरकार",
    section3Description:
      "प्रत्येक राज्य की अपनी संवैधानिक संस्थाएँ होती हैं। राज्य विधानमंडल राज्य को सौंपे गए क्षेत्रों में कानून बनाता है, जबकि राज्य की कार्यपालिका उन कानूनों और सरकारी कार्यों का प्रशासन करती है।",

    example: "उदाहरण",
    exampleText:
      "पुलिस और सार्वजनिक व्यवस्था संविधान की राज्य सूची में शामिल विषयों के उदाहरण हैं। इससे समझा जा सकता है कि कुछ मामलों में नागरिकों को राज्य स्तर की संस्थाओं से संपर्क करना पड़ सकता है।",

    section4Label: "04 · स्थानीय सरकार",
    section4Title: "समुदाय के सबसे निकट सरकार",
    section4Description:
      "स्थानीय सरकार नागरिकों के करीब स्वशासन के लिए एक संवैधानिक ढाँचा प्रदान करती है। संविधान ग्रामीण क्षेत्रों में पंचायतों और शहरी क्षेत्रों में नगरपालिकाओं के लिए अलग-अलग प्रावधान करता है।",

    panchayatsTitle: "पंचायतें",
    panchayatsText:
      "संविधान का भाग IX ग्रामीण क्षेत्रों में स्वशासन की संस्थाओं के रूप में पंचायतों का प्रावधान करता है। इसमें संवैधानिक प्रावधानों के अधीन ग्राम, मध्यवर्ती और जिला स्तर शामिल हैं।",

    municipalitiesTitle: "नगरपालिकाएँ",
    municipalitiesText:
      "संविधान का भाग IXA शहरी क्षेत्रों में नगर निकायों का प्रावधान करता है, जिसमें नगर पंचायतें, नगर परिषदें और नगर निगम शामिल हैं।",

    section5Label: "05 · यह क्यों महत्वपूर्ण है",
    section5Title: "नागरिकों को इसे क्यों समझना चाहिए?",
    section5Description:
      "किसी मुद्दे की जिम्मेदारी किस स्तर की सरकार के पास है, यह जानने से नागरिकों को यह समझने में मदद मिल सकती है कि सार्वजनिक निर्णय कहाँ लिए जाते हैं और जानकारी प्राप्त करने, सार्वजनिक प्रक्रियाओं में भाग लेने या नागरिक समस्या उठाने के लिए कौन-सी संस्था प्रासंगिक हो सकती है।",

    responsibilityTitle: "जिम्मेदारी को समझें",
    responsibilityText:
      "अलग-अलग सार्वजनिक मुद्दों में सरकार की अलग-अलग संस्थाएँ और स्तर शामिल हो सकते हैं।",

    participationTitle: "सार्थक भागीदारी करें",
    participationText:
      "जब नागरिक संस्थाओं की संरचना को समझते हैं, तो नागरिक भागीदारी अधिक प्रभावी हो जाती है।",

    questionsTitle: "आपने क्या सीखा, जाँचें",
    questionsDescription:
      "इस KarmaFacie को पूरा करने के लिए तीन प्रश्नों के उत्तर दें।",

    question: "प्रश्न",
    saving: "सहेजा जा रहा है...",
    finishQuiz: "क्विज़ पूरा करें",
    nextQuestion: "अगला प्रश्न →",

    quizComplete: "क्विज़ पूरा हुआ!",
    scoreText: "आपका स्कोर",
    tryAgain: "फिर से प्रयास करें",

    footer: "KarmaFacie · सीखें। समझें। भाग लें।",
  },

  mr: {
    headerTitle: "शासन व प्रशासन",
    topicLabel: "नागरिक ज्ञान · 01",
    back: "← विषयांकडे परत जा",

    heroTitle: "भारतात शासन कसे कार्य करते?",
    heroDescription:
      "शासन ही अशी व्यवस्था आहे ज्याद्वारे सार्वजनिक संस्था निर्णय घेतात, कायदे अंमलात आणतात, सेवा पुरवतात आणि सार्वजनिक कारभाराचे प्रशासन करतात. भारतात जबाबदाऱ्या शासनाच्या विविध स्तरांमध्ये विभागलेल्या आहेत.",

    section1Label: "01 · मोठे चित्र",
    section1Title: "भारतात शासनाचे विविध स्तर आहेत",
    section1Description:
      "एखाद्या विषयानुसार नागरिकांना वेगवेगळ्या सार्वजनिक संस्थांशी संपर्क साधावा लागू शकतो. राष्ट्रीय विषय केंद्र सरकारशी, राज्यस्तरीय विषय राज्य सरकारशी आणि दैनंदिन समुदायाशी संबंधित अनेक विषय स्थानिक स्वराज्य संस्थांशी संबंधित असू शकतात.",

    section2Label: "02 · केंद्र सरकार",
    section2Title: "केंद्र सरकार",
    section2Description:
      "केंद्र सरकार राष्ट्रीय स्तरावर कार्य करते. संविधान केंद्र आणि राज्यांमध्ये विधायी व प्रशासकीय जबाबदाऱ्यांचे विभाजन करते.",

    parliamentTitle: "संसद",
    parliamentText:
      "केंद्राची विधिमंडळ व्यवस्था राष्ट्रपती आणि दोन सभागृहांनी बनलेली आहे: राज्यसभा आणि लोकसभा.",

    executiveTitle: "कार्यपालिका",
    executiveText:
      "केंद्राच्या कार्यपालिकेत राष्ट्रपती, उपराष्ट्रपती आणि पंतप्रधानांच्या नेतृत्वाखालील मंत्रिपरिषद यांचा समावेश होतो.",

    judiciaryTitle: "न्यायपालिका",
    judiciaryText:
      "सर्वोच्च न्यायालय हे भारताच्या न्यायव्यवस्थेतील सर्वोच्च न्यायालय आहे आणि ते घटनात्मक व्यवस्थेचा महत्त्वाचा भाग आहे.",

    section3Label: "03 · राज्य सरकार",
    section3Title: "राज्य सरकार",
    section3Description:
      "प्रत्येक राज्याच्या स्वतःच्या घटनात्मक संस्था असतात. राज्य विधिमंडळ राज्याला सोपवलेल्या विषयांमध्ये कायदे करते, तर राज्याची कार्यपालिका त्या कायद्यांची आणि सरकारी कामकाजाची अंमलबजावणी करते.",

    example: "उदाहरण",
    exampleText:
      "पोलीस आणि सार्वजनिक सुव्यवस्था ही संविधानातील राज्य सूचीतील विषयांची उदाहरणे आहेत. त्यामुळे काही बाबतीत नागरिकांना राज्यस्तरीय संस्थांशी संपर्क साधावा लागू शकतो.",

    section4Label: "04 · स्थानिक स्वराज्य",
    section4Title: "समुदायाच्या सर्वात जवळचे शासन",
    section4Description:
      "स्थानिक स्वराज्य नागरिकांच्या जवळील स्वशासनासाठी घटनात्मक चौकट उपलब्ध करून देते. संविधान ग्रामीण भागातील पंचायती आणि शहरी भागातील नगरपालिका यांच्यासाठी स्वतंत्र तरतुदी करते.",

    panchayatsTitle: "पंचायती",
    panchayatsText:
      "संविधानाच्या भाग IX मध्ये ग्रामीण भागासाठी स्वशासनाच्या संस्था म्हणून पंचायतींची तरतूद आहे. घटनात्मक तरतुदींनुसार ग्राम, मध्यवर्ती आणि जिल्हा स्तरांचा त्यात समावेश होतो.",

    municipalitiesTitle: "नगरपालिका",
    municipalitiesText:
      "संविधानाच्या भाग IXA मध्ये शहरी भागातील नगरपालिकांची तरतूद आहे, ज्यामध्ये नगरपंचायत, नगरपरिषद आणि महानगरपालिका यांचा समावेश होतो.",

    section5Label: "05 · हे महत्त्वाचे का आहे",
    section5Title: "नागरिकांनी हे का समजून घ्यावे?",
    section5Description:
      "एखाद्या विषयाची जबाबदारी शासनाच्या कोणत्या स्तराकडे आहे हे माहीत असल्यास नागरिकांना सार्वजनिक निर्णय कुठे घेतले जातात आणि माहिती मिळवताना, सार्वजनिक प्रक्रियेत सहभागी होताना किंवा नागरी समस्या मांडताना कोणती संस्था संबंधित असू शकते हे समजण्यास मदत होते.",

    responsibilityTitle: "जबाबदारी समजून घ्या",
    responsibilityText:
      "वेगवेगळ्या सार्वजनिक समस्यांमध्ये शासनाच्या वेगवेगळ्या संस्था आणि स्तरांचा सहभाग असू शकतो.",

    participationTitle: "अर्थपूर्ण सहभाग घ्या",
    participationText:
      "नागरिकांना संस्थांची रचना समजल्यास नागरी सहभाग अधिक प्रभावीपणे करता येतो.",

    questionsTitle: "तुम्ही काय शिकलात ते तपासा",
    questionsDescription:
      "ही KarmaFacie पूर्ण करण्यासाठी तीन प्रश्नांची उत्तरे द्या.",

    question: "प्रश्न",
    saving: "जतन केले जात आहे...",
    finishQuiz: "क्विझ पूर्ण करा",
    nextQuestion: "पुढील प्रश्न →",

    quizComplete: "क्विझ पूर्ण झाले!",
    scoreText: "तुमचा गुण",
    tryAgain: "पुन्हा प्रयत्न करा",

    footer: "KarmaFacie · शिका. समजा. सहभागी व्हा.",
  },
};

export default function GovernmentPage() {
  const router = useRouter();
  const supabase = createClient();

  const { language } = useLanguage();

  const t = content[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] =
    useState(false);
  const [savingProgress, setSavingProgress] =
    useState(false);

  const getText = (
    value: LocalizedText
  ) => value[language];

  const question =
    quizQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((previous) => previous + 1);
    }
  };

  const saveProgress = async (
    finalScore: number
  ) => {
    setSavingProgress(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error(
          "No authenticated user found."
        );
        return;
      }

      const { error } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: user.id,
            topic: "government",
            completed: true,
            score: finalScore,
            completed_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "user_id,topic",
          }
        );

      if (error) {
        console.error(
          "Error saving learning progress:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Unexpected error while saving learning progress:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const nextQuestion = async () => {
    if (
      currentQuestion <
      quizQuestions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
      await saveProgress(score);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

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
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "60px",
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
              {t.headerTitle}
            </div>
          </div>

          <button
            onClick={() =>
              router.push("/explore")
            }
            type="button"
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
            {t.back}
          </button>
        </header>

        {/* HERO */}

        <section
          style={{
            marginBottom: "65px",
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
            {t.topicLabel}
          </div>

          <h1
            style={{
              fontSize: "52px",
              lineHeight: "1.1",
              fontWeight: "800",
              margin: "0 0 20px",
              maxWidth: "850px",
            }}
          >
            {t.heroTitle}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "19px",
              lineHeight: "1.7",
              maxWidth: "800px",
              margin: 0,
            }}
          >
            {t.heroDescription}
          </p>
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
            {t.section1Description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {levels.map((level) => (
              <div
                key={level.title.en}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "20px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "18px",
                  }}
                >
                  {level.icon}
                </div>

                <div
                  style={{
                    color: "#ff7a00",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >
                  {getText(
                    level.subtitle
                  ).toUpperCase()}
                </div>

                <h3
                  style={{
                    fontSize: "22px",
                    margin: "0 0 12px",
                  }}
                >
                  {getText(level.title)}
                </h3>

                <p
                  style={{
                    color: "#94a3b8",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {getText(
                    level.description
                  )}
                </p>
              </div>
            ))}
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
            {t.section2Description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <SimpleCard
              icon="🏛️"
              title={t.parliamentTitle}
              text={t.parliamentText}
            />

            <SimpleCard
              icon="👔"
              title={t.executiveTitle}
              text={t.executiveText}
            />

            <SimpleCard
              icon="⚖️"
              title={t.judiciaryTitle}
              text={t.judiciaryText}
            />
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
            {t.section3Description}
          </p>

          <div
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
                margin: "0 0 15px",
              }}
            >
              {t.example}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.exampleText}
            </p>
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
            {t.section4Description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <SimpleCard
              icon="🌾"
              title={t.panchayatsTitle}
              text={t.panchayatsText}
            />

            <SimpleCard
              icon="🏙️"
              title={t.municipalitiesTitle}
              text={t.municipalitiesText}
            />
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
            {t.section5Description}
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gap: "12px",
            }}
          >
            <ReasonCard
              number="01"
              title={t.responsibilityTitle}
              text={t.responsibilityText}
            />

            <ReasonCard
              number="02"
              title={t.participationTitle}
              text={t.participationText}
            />

            <ReasonCard
              number="03"
              title={
                language === "en"
                  ? "Ask better questions"
                  : language === "hi"
                  ? "बेहतर प्रश्न पूछें"
                  : "चांगले प्रश्न विचारा"
              }
              text={
                language === "en"
                  ? "Knowing how government is organised helps citizens identify which institution or level to learn more about."
                  : language === "hi"
                  ? "सरकार की संरचना को समझने से नागरिकों को यह पहचानने में मदद मिलती है कि किस संस्था या स्तर के बारे में अधिक जानकारी प्राप्त करनी चाहिए।"
                  : "शासनाची रचना समजल्याने नागरिकांना कोणत्या संस्था किंवा स्तराबद्दल अधिक माहिती घ्यावी हे ओळखण्यास मदत होते."
              }
            />
          </div>
        </section>

        {/* QUIZ */}

        <section
          style={{
            background:
              "linear-gradient(135deg, #0f172a, #111827)",
            border: "1px solid #334155",
            borderRadius: "24px",
            padding: "35px",
          }}
        >
          <SectionLabel
            text={
              language === "en"
                ? "06 · QUICK QUIZ"
                : language === "hi"
                ? "06 · त्वरित क्विज़"
                : "06 · झटपट क्विझ"
            }
          />

          <h2
            style={{
              fontSize: "30px",
              margin: "0 0 12px",
            }}
          >
            {t.questionsTitle}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            {t.questionsDescription}
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
                {t.question}{" "}
                {currentQuestion + 1}{" "}
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
                {question.options.map(
                  (option, index) => {
                    const isSelected =
                      selectedAnswer === index;

                    const isCorrect =
                      index === question.answer;

                    let border =
                      "1px solid #334155";

                    let background =
                      "#020617";

                    if (
                      selectedAnswer !== null &&
                      isCorrect
                    ) {
                      border =
                        "1px solid #22c55e";

                      background =
                        "rgba(34, 197, 94, 0.08)";
                    }

                    if (
                      selectedAnswer === index &&
                      !isCorrect
                    ) {
                      border =
                        "1px solid #ef4444";

                      background =
                        "rgba(239, 68, 68, 0.08)";
                    }

                    return (
                      <button
                        key={option.en}
                        onClick={() =>
                          handleAnswer(index)
                        }
                        type="button"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding:
                            "16px 18px",
                          background,
                          color: "white",
                          border,
                          borderRadius: "12px",
                          cursor:
                            selectedAnswer ===
                            null
                              ? "pointer"
                              : "default",
                          fontSize: "15px",
                        }}
                      >
                        {option[language]}

                        {selectedAnswer !==
                          null &&
                          isCorrect && (
                            <span
                              style={{
                                float: "right",
                                color:
                                  "#22c55e",
                                fontWeight:
                                  "700",
                              }}
                            >
                              ✓
                            </span>
                          )}

                        {isSelected &&
                          !isCorrect && (
                            <span
                              style={{
                                float: "right",
                                color:
                                  "#ef4444",
                                fontWeight:
                                  "700",
                              }}
                            >
                              ✕
                            </span>
                          )}
                      </button>
                    );
                  }
                )}
              </div>

              {selectedAnswer !== null && (
                <button
                  onClick={nextQuestion}
                  disabled={savingProgress}
                  type="button"
                  style={{
                    marginTop: "25px",
                    padding: "13px 22px",
                    background:
                      savingProgress
                        ? "#7c3f00"
                        : "#ff7a00",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor:
                      savingProgress
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
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
                {t.scoreText}{" "}
                <strong
                  style={{
                    color: "#ff7a00",
                  }}
                >
                  {score}/
                  {quizQuestions.length}
                </strong>
              </p>

              <button
                onClick={restartQuiz}
                type="button"
                style={{
                  padding: "13px 22px",
                  background: "transparent",
                  color: "white",
                  border:
                    "1px solid #334155",
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
    </main>
  );
}


/* -------------------------------------------------- */
/* REUSABLE COMPONENTS */
/* -------------------------------------------------- */

function SectionLabel({
  text,
}: {
  text: string;
}) {
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

function ReasonCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
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
        style={{
          minWidth: "38px",
          height: "38px",
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
        {number}
      </div>

      <div>
        <h3
          style={{
            fontSize: "18px",
            margin: "0 0 6px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#94a3b8",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
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