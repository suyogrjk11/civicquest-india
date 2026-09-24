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

type LocalizedCard = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type LocalizedQuizQuestion = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
};

/* -------------------------------------------------- */
/* FUNDAMENTAL RIGHTS */
/* -------------------------------------------------- */

const rights: LocalizedCard[] = [
  {
    icon: "⚖️",
    title: {
      en: "Right to Equality",
      hi: "समानता का अधिकार",
      mr: "समतेचा अधिकार",
    },
    text: {
      en: "The Constitution provides for equality before the law and equal protection of the laws.",
      hi: "संविधान कानून के समक्ष समानता और कानूनों के समान संरक्षण का प्रावधान करता है।",
      mr: "संविधान कायद्यापुढे समानता आणि कायद्यांचे समान संरक्षण यांची तरतूद करते.",
    },
  },
  {
    icon: "🗣️",
    title: {
      en: "Right to Freedom",
      hi: "स्वतंत्रता का अधिकार",
      mr: "स्वातंत्र्याचा अधिकार",
    },
    text: {
      en: "The Constitution guarantees a range of freedoms, subject to constitutional limitations.",
      hi: "संविधान कई प्रकार की स्वतंत्रताओं की गारंटी देता है, जो संवैधानिक सीमाओं के अधीन हैं।",
      mr: "संविधान विविध प्रकारच्या स्वातंत्र्यांची हमी देते, जी घटनात्मक मर्यादांच्या अधीन आहेत.",
    },
  },
  {
    icon: "⛓️",
    title: {
      en: "Right against Exploitation",
      hi: "शोषण के विरुद्ध अधिकार",
      mr: "शोषणाविरुद्धचा अधिकार",
    },
    text: {
      en: "The Constitution contains protections against certain forms of exploitation.",
      hi: "संविधान कुछ प्रकार के शोषण के विरुद्ध संरक्षण प्रदान करता है।",
      mr: "संविधान काही प्रकारच्या शोषणाविरुद्ध संरक्षण प्रदान करते.",
    },
  },
  {
    icon: "🛕",
    title: {
      en: "Freedom of Religion",
      hi: "धार्मिक स्वतंत्रता का अधिकार",
      mr: "धर्मस्वातंत्र्याचा अधिकार",
    },
    text: {
      en: "The Constitution provides protections relating to freedom of conscience and religion.",
      hi: "संविधान अंतःकरण की स्वतंत्रता और धर्म से संबंधित स्वतंत्रता के लिए संरक्षण प्रदान करता है।",
      mr: "संविधान अंतःकरणाचे स्वातंत्र्य आणि धर्माशी संबंधित स्वातंत्र्याचे संरक्षण करते.",
    },
  },
  {
    icon: "🎓",
    title: {
      en: "Cultural & Educational Rights",
      hi: "सांस्कृतिक एवं शैक्षिक अधिकार",
      mr: "सांस्कृतिक व शैक्षणिक अधिकार",
    },
    text: {
      en: "The Constitution protects specified cultural and educational rights.",
      hi: "संविधान कुछ निर्धारित सांस्कृतिक और शैक्षिक अधिकारों की रक्षा करता है।",
      mr: "संविधान विशिष्ट सांस्कृतिक आणि शैक्षणिक अधिकारांचे संरक्षण करते.",
    },
  },
  {
    icon: "🏛️",
    title: {
      en: "Constitutional Remedies",
      hi: "संवैधानिक उपचारों का अधिकार",
      mr: "घटनात्मक उपायांचा अधिकार",
    },
    text: {
      en: "The Constitution provides remedies for enforcement of Fundamental Rights.",
      hi: "संविधान मौलिक अधिकारों के प्रवर्तन के लिए उपचार प्रदान करता है।",
      mr: "संविधान मूलभूत अधिकारांच्या अंमलबजावणीसाठी घटनात्मक उपाय उपलब्ध करून देते.",
    },
  },
];

/* -------------------------------------------------- */
/* FUNDAMENTAL DUTIES */
/* -------------------------------------------------- */

const duties: LocalizedText[] = [
  {
    en: "Respect the Constitution, its ideals and institutions, the National Flag and the National Anthem.",
    hi: "संविधान, उसके आदर्शों और संस्थाओं, राष्ट्रीय ध्वज और राष्ट्रगान का सम्मान करना।",
    mr: "संविधान, त्याचे आदर्श व संस्था, राष्ट्रध्वज आणि राष्ट्रगीत यांचा आदर करणे.",
  },
  {
    en: "Protect the sovereignty, unity and integrity of India.",
    hi: "भारत की संप्रभुता, एकता और अखंडता की रक्षा करना।",
    mr: "भारताचे सार्वभौमत्व, एकता आणि अखंडता यांचे रक्षण करणे.",
  },
  {
    en: "Promote harmony and the spirit of common brotherhood.",
    hi: "सद्भाव और समान भ्रातृत्व की भावना को बढ़ावा देना।",
    mr: "सामंजस्य आणि समान बंधुभावाची भावना वाढवणे.",
  },
  {
    en: "Value and preserve India's composite cultural heritage.",
    hi: "भारत की समन्वित सांस्कृतिक विरासत का मूल्य समझना और उसका संरक्षण करना।",
    mr: "भारताच्या समन्वित सांस्कृतिक वारशाचे मोल जाणणे आणि त्याचे जतन करणे.",
  },
  {
    en: "Protect and improve the natural environment and have compassion for living creatures.",
    hi: "प्राकृतिक पर्यावरण की रक्षा और सुधार करना तथा जीव-जंतुओं के प्रति दया रखना।",
    mr: "नैसर्गिक पर्यावरणाचे संरक्षण व संवर्धन करणे आणि सजीव प्राण्यांबद्दल करुणा बाळगणे.",
  },
  {
    en: "Develop scientific temper, humanism and the spirit of inquiry and reform.",
    hi: "वैज्ञानिक दृष्टिकोण, मानवतावाद तथा जिज्ञासा और सुधार की भावना विकसित करना।",
    mr: "वैज्ञानिक दृष्टिकोन, मानवतावाद तसेच चौकसपणा आणि सुधारण्याची भावना विकसित करणे.",
  },
  {
    en: "Safeguard public property and abjure violence.",
    hi: "सार्वजनिक संपत्ति की रक्षा करना और हिंसा का त्याग करना।",
    mr: "सार्वजनिक मालमत्तेचे रक्षण करणे आणि हिंसेचा त्याग करणे.",
  },
];

/* -------------------------------------------------- */
/* QUIZ */
/* -------------------------------------------------- */

const quizQuestions: LocalizedQuizQuestion[] = [
  {
    question: {
      en: "Where are Fundamental Rights primarily provided in the Constitution of India?",
      hi: "भारत के संविधान में मौलिक अधिकार मुख्य रूप से कहाँ दिए गए हैं?",
      mr: "भारताच्या संविधानात मूलभूत अधिकार मुख्यतः कुठे दिले आहेत?",
    },
    options: [
      {
        en: "Part III",
        hi: "भाग III",
        mr: "भाग III",
      },
      {
        en: "Part IV",
        hi: "भाग IV",
        mr: "भाग IV",
      },
      {
        en: "Part IVA",
        hi: "भाग IVA",
        mr: "भाग IVA",
      },
      {
        en: "Part IX",
        hi: "भाग IX",
        mr: "भाग IX",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which of the following is a Fundamental Duty?",
      hi: "निम्नलिखित में से कौन-सा एक मौलिक कर्तव्य है?",
      mr: "खालीलपैकी कोणते एक मूलभूत कर्तव्य आहे?",
    },
    options: [
      {
        en: "To protect and improve the natural environment",
        hi: "प्राकृतिक पर्यावरण की रक्षा और सुधार करना",
        mr: "नैसर्गिक पर्यावरणाचे संरक्षण व संवर्धन करणे",
      },
      {
        en: "To elect the Prime Minister directly",
        hi: "प्रधानमंत्री का सीधे चुनाव करना",
        mr: "पंतप्रधानांची थेट निवड करणे",
      },
      {
        en: "To appoint judges of the Supreme Court",
        hi: "सर्वोच्च न्यायालय के न्यायाधीशों की नियुक्ति करना",
        mr: "सर्वोच्च न्यायालयाच्या न्यायाधीशांची नियुक्ती करणे",
      },
      {
        en: "To pass the Union Budget",
        hi: "केंद्रीय बजट पारित करना",
        mr: "केंद्रीय अर्थसंकल्प मंजूर करणे",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "India has which form of government according to the Election Commission of India?",
      hi: "भारत निर्वाचन आयोग के अनुसार भारत में किस प्रकार की शासन प्रणाली है?",
      mr: "भारत निवडणूक आयोगानुसार भारतात कोणत्या प्रकारची शासनव्यवस्था आहे?",
    },
    options: [
      {
        en: "Presidential system",
        hi: "राष्ट्रपति प्रणाली",
        mr: "अध्यक्षीय प्रणाली",
      },
      {
        en: "Parliamentary system",
        hi: "संसदीय प्रणाली",
        mr: "संसदीय प्रणाली",
      },
      {
        en: "Absolute monarchy",
        hi: "पूर्ण राजतंत्र",
        mr: "संपूर्ण राजेशाही",
      },
      {
        en: "Military government",
        hi: "सैन्य शासन",
        mr: "लष्करी शासन",
      },
    ],
    answer: 1,
  },
];

/* -------------------------------------------------- */
/* PAGE CONTENT */
/* -------------------------------------------------- */

const content: Record<
  Language,
  {
    headerTitle: string;
    back: string;

    topicLabel: string;
    heroTitle: string;
    heroDescription: string;

    section1Label: string;
    section1Title: string;
    section1Description: string;

    institutionsTitle: string;
    institutionsText: string;
    rightsTitle: string;
    rightsText: string;
    principlesTitle: string;
    principlesText: string;
    dutiesTitle: string;
    dutiesText: string;

    section2Label: string;
    section2Title: string;
    section2Description: string;

    section3Label: string;
    section3Title: string;
    section3Description: string;

    rightsDifferenceTitle: string;
    rightsDifferenceText: string;

    section4Label: string;
    section4Title: string;
    section4Description: string;

    section5Label: string;
    section5Title: string;
    section5Description: string;

    representationTitle: string;
    representationText: string;

    electionsTitle: string;
    electionsText: string;

    parliamentaryTitle: string;
    parliamentaryText: string;

    section6Label: string;
    section6Title: string;
    section6Description: string;

    participationTitle: string;
    participationText: string;

    quizLabel: string;
    quizTitle: string;
    quizDescription: string;

    question: string;
    of: string;
    finishQuiz: string;
    nextQuestion: string;
    saving: string;

    quizComplete: string;
    scoreText: string;
    tryAgain: string;

    footer: string;
  }
> = {
  /* ------------------------------------------------ */
  /* ENGLISH */
  /* ------------------------------------------------ */

  en: {
    headerTitle: "Constitution & Democracy",
    back: "← Explore",

    topicLabel: "CIVIC BASICS · 02",
    heroTitle: "Constitution & Democracy",
    heroDescription:
      "The Constitution of India establishes the framework of government, defines institutions and powers, and provides rights and duties that shape India's constitutional democracy.",

    section1Label: "01 · THE CONSTITUTION",
    section1Title: "What is the Constitution?",
    section1Description:
      "The Constitution is the foundational legal framework of the Republic of India. It establishes constitutional institutions, distributes governmental powers and sets out rights, principles and duties within the constitutional system.",

    institutionsTitle: "Institutions",
    institutionsText:
      "The Constitution provides the framework for institutions such as Parliament, the executive and the judiciary.",

    rightsTitle: "Rights",
    rightsText:
      "Part III contains the Fundamental Rights guaranteed by the Constitution.",

    principlesTitle: "Principles",
    principlesText:
      "The Directive Principles of State Policy set out principles intended to guide the State in governance.",

    dutiesTitle: "Duties",
    dutiesText:
      "Part IVA contains the Fundamental Duties of citizens.",

    section2Label: "02 · FUNDAMENTAL RIGHTS",
    section2Title: "Rights protected by the Constitution",
    section2Description:
      "Fundamental Rights are contained in Part III of the Constitution. They include protections relating to equality, freedom, exploitation, religion, cultural and educational rights, and constitutional remedies.",

    section3Label: "03 · DIRECTIVE PRINCIPLES",
    section3Title: "Directive Principles of State Policy",
    section3Description:
      "The Directive Principles of State Policy are contained in Part IV of the Constitution. They provide principles for the State to consider in making laws and policies and are intended to guide governance toward the objectives set out in that part of the Constitution.",

    rightsDifferenceTitle:
      "Rights and Directive Principles are different",
    rightsDifferenceText:
      "Fundamental Rights and Directive Principles are separate parts of the constitutional framework. Fundamental Rights are contained in Part III, while the Directive Principles are contained in Part IV.",

    section4Label: "04 · FUNDAMENTAL DUTIES",
    section4Title: "Responsibilities of citizens",
    section4Description:
      "Article 51A in Part IVA sets out the Fundamental Duties of citizens. These include respecting the Constitution, protecting national unity and integrity, promoting harmony, protecting the environment and developing scientific temper.",

    section5Label: "05 · DEMOCRACY",
    section5Title: "How does democracy work?",
    section5Description:
      "India is a constitutional democracy with a parliamentary system of government. Representation in Parliament and State legislatures takes place through elections. The Election Commission of India is a constitutional authority responsible for administering specified elections.",

    representationTitle: "Representation",
    representationText:
      "Citizens elect representatives to legislatures through the electoral process.",

    electionsTitle: "Elections",
    electionsText:
      "Elections provide a constitutional mechanism for choosing representatives.",

    parliamentaryTitle: "Parliamentary System",
    parliamentaryText:
      "India follows a parliamentary system in its constitutional framework.",

    section6Label: "06 · CITIZEN PARTICIPATION",
    section6Title: "Democracy is more than voting",
    section6Description:
      "Voting is an important part of democratic participation, but citizens can also engage with public institutions, learn about laws and policies, participate in community activities and seek information about public processes.",

    participationTitle: "Civic participation",
    participationText:
      "Understanding institutions and constitutional rights can help citizens participate more effectively in public life. KarmaFacie is designed to help build that basic understanding.",

    quizLabel: "07 · QUICK QUIZ",
    quizTitle: "Test what you learned",
    quizDescription:
      "Answer three questions to complete this KarmaFacie.",

    question: "Question",
    of: "of",
    finishQuiz: "Finish Quiz",
    nextQuestion: "Next Question →",
    saving: "Saving...",

    quizComplete: "Quiz complete!",
    scoreText: "You scored",
    tryAgain: "Try Again",

    footer: "KarmaFacie · Learn. Understand. Participate.",
  },

  /* ------------------------------------------------ */
  /* HINDI */
  /* ------------------------------------------------ */

  hi: {
    headerTitle: "संविधान एवं लोकतंत्र",
    back: "← विषयों पर वापस जाएँ",

    topicLabel: "नागरिक ज्ञान · 02",
    heroTitle: "संविधान एवं लोकतंत्र",
    heroDescription:
      "भारत का संविधान शासन की रूपरेखा स्थापित करता है, संस्थाओं और उनकी शक्तियों को परिभाषित करता है तथा ऐसे अधिकारों और कर्तव्यों का प्रावधान करता है जो भारत के संवैधानिक लोकतंत्र को आकार देते हैं।",

    section1Label: "01 · संविधान",
    section1Title: "संविधान क्या है?",
    section1Description:
      "संविधान भारत गणराज्य की मूल कानूनी रूपरेखा है। यह संवैधानिक संस्थाओं की स्थापना करता है, सरकारी शक्तियों का वितरण करता है और संवैधानिक व्यवस्था के अंतर्गत अधिकारों, सिद्धांतों तथा कर्तव्यों को निर्धारित करता है।",

    institutionsTitle: "संस्थाएँ",
    institutionsText:
      "संविधान संसद, कार्यपालिका और न्यायपालिका जैसी संस्थाओं के लिए रूपरेखा प्रदान करता है।",

    rightsTitle: "अधिकार",
    rightsText:
      "भाग III में संविधान द्वारा गारंटीकृत मौलिक अधिकार शामिल हैं।",

    principlesTitle: "सिद्धांत",
    principlesText:
      "राज्य के नीति-निदेशक तत्व ऐसे सिद्धांत निर्धारित करते हैं जिनका उद्देश्य शासन में राज्य का मार्गदर्शन करना है।",

    dutiesTitle: "कर्तव्य",
    dutiesText:
      "भाग IVA में नागरिकों के मौलिक कर्तव्यों का प्रावधान है।",

    section2Label: "02 · मौलिक अधिकार",
    section2Title: "संविधान द्वारा संरक्षित अधिकार",
    section2Description:
      "मौलिक अधिकार संविधान के भाग III में दिए गए हैं। इनमें समानता, स्वतंत्रता, शोषण, धर्म, सांस्कृतिक एवं शैक्षिक अधिकार तथा संवैधानिक उपचारों से संबंधित संरक्षण शामिल हैं।",

    section3Label: "03 · नीति-निदेशक तत्व",
    section3Title: "राज्य के नीति-निदेशक तत्व",
    section3Description:
      "राज्य के नीति-निदेशक तत्व संविधान के भाग IV में दिए गए हैं। वे कानून और नीतियाँ बनाते समय राज्य के लिए विचार करने योग्य सिद्धांत प्रदान करते हैं और उस भाग में निर्धारित उद्देश्यों की दिशा में शासन का मार्गदर्शन करने के लिए हैं।",

    rightsDifferenceTitle:
      "अधिकार और नीति-निदेशक तत्व अलग हैं",
    rightsDifferenceText:
      "मौलिक अधिकार और राज्य के नीति-निदेशक तत्व संवैधानिक व्यवस्था के अलग-अलग भाग हैं। मौलिक अधिकार भाग III में हैं, जबकि नीति-निदेशक तत्व भाग IV में हैं।",

    section4Label: "04 · मौलिक कर्तव्य",
    section4Title: "नागरिकों की जिम्मेदारियाँ",
    section4Description:
      "भाग IVA में अनुच्छेद 51A नागरिकों के मौलिक कर्तव्यों को निर्धारित करता है। इनमें संविधान का सम्मान करना, राष्ट्रीय एकता और अखंडता की रक्षा करना, सद्भाव को बढ़ावा देना, पर्यावरण की रक्षा करना और वैज्ञानिक दृष्टिकोण विकसित करना शामिल है।",

    section5Label: "05 · लोकतंत्र",
    section5Title: "लोकतंत्र कैसे काम करता है?",
    section5Description:
      "भारत एक संवैधानिक लोकतंत्र है जिसमें संसदीय शासन प्रणाली है। संसद और राज्य विधानमंडलों में प्रतिनिधित्व चुनावों के माध्यम से होता है। भारत निर्वाचन आयोग एक संवैधानिक प्राधिकरण है जो निर्दिष्ट चुनावों के संचालन के लिए जिम्मेदार है।",

    representationTitle: "प्रतिनिधित्व",
    representationText:
      "नागरिक चुनावी प्रक्रिया के माध्यम से विधानमंडलों के लिए अपने प्रतिनिधियों का चुनाव करते हैं।",

    electionsTitle: "चुनाव",
    electionsText:
      "चुनाव प्रतिनिधियों को चुनने के लिए एक संवैधानिक व्यवस्था प्रदान करते हैं।",

    parliamentaryTitle: "संसदीय प्रणाली",
    parliamentaryText:
      "भारत की संवैधानिक व्यवस्था संसदीय शासन प्रणाली का अनुसरण करती है।",

    section6Label: "06 · नागरिक भागीदारी",
    section6Title: "लोकतंत्र केवल मतदान से अधिक है",
    section6Description:
      "मतदान लोकतांत्रिक भागीदारी का एक महत्वपूर्ण हिस्सा है, लेकिन नागरिक सार्वजनिक संस्थाओं से जुड़ सकते हैं, कानूनों और नीतियों के बारे में जान सकते हैं, सामुदायिक गतिविधियों में भाग ले सकते हैं और सार्वजनिक प्रक्रियाओं के बारे में जानकारी प्राप्त कर सकते हैं।",

    participationTitle: "नागरिक भागीदारी",
    participationText:
      "संस्थाओं और संवैधानिक अधिकारों को समझने से नागरिकों को सार्वजनिक जीवन में अधिक प्रभावी ढंग से भाग लेने में मदद मिल सकती है। KarmaFacie इसी बुनियादी समझ को विकसित करने के लिए बनाया गया है।",

    quizLabel: "07 · त्वरित क्विज़",
    quizTitle: "आपने क्या सीखा, जाँचें",
    quizDescription:
      "इस KarmaFacie को पूरा करने के लिए तीन प्रश्नों के उत्तर दें।",

    question: "प्रश्न",
    of: "में से",
    finishQuiz: "क्विज़ पूरा करें",
    nextQuestion: "अगला प्रश्न →",
    saving: "सहेजा जा रहा है...",

    quizComplete: "क्विज़ पूरा हुआ!",
    scoreText: "आपका स्कोर",
    tryAgain: "फिर से प्रयास करें",

    footer: "KarmaFacie · सीखें। समझें। भाग लें।",
  },

  /* ------------------------------------------------ */
  /* MARATHI */
  /* ------------------------------------------------ */

  mr: {
    headerTitle: "संविधान व लोकशाही",
    back: "← विषयांकडे परत जा",

    topicLabel: "नागरिक ज्ञान · 02",
    heroTitle: "संविधान व लोकशाही",
    heroDescription:
      "भारताचे संविधान शासनाची चौकट निश्चित करते, संस्था व त्यांच्या अधिकारांची व्याख्या करते आणि भारताच्या घटनात्मक लोकशाहीला आकार देणारे अधिकार व कर्तव्ये निश्चित करते.",

    section1Label: "01 · संविधान",
    section1Title: "संविधान म्हणजे काय?",
    section1Description:
      "संविधान हे भारत गणराज्याची मूलभूत कायदेशीर चौकट आहे. ते घटनात्मक संस्थांची स्थापना करते, शासनाच्या अधिकारांचे विभाजन करते आणि घटनात्मक व्यवस्थेतील अधिकार, तत्त्वे व कर्तव्ये निश्चित करते.",

    institutionsTitle: "संस्था",
    institutionsText:
      "संविधान संसद, कार्यपालिका आणि न्यायपालिका यांसारख्या संस्थांसाठी चौकट उपलब्ध करून देते.",

    rightsTitle: "अधिकार",
    rightsText:
      "भाग III मध्ये संविधानाने हमी दिलेल्या मूलभूत अधिकारांचा समावेश आहे.",

    principlesTitle: "तत्त्वे",
    principlesText:
      "राज्याच्या धोरणाची मार्गदर्शक तत्त्वे शासन करताना राज्याला दिशा देण्यासाठी काही तत्त्वे निश्चित करतात.",

    dutiesTitle: "कर्तव्ये",
    dutiesText:
      "भाग IVA मध्ये नागरिकांच्या मूलभूत कर्तव्यांची तरतूद आहे.",

    section2Label: "02 · मूलभूत अधिकार",
    section2Title: "संविधानाने संरक्षित केलेले अधिकार",
    section2Description:
      "मूलभूत अधिकार संविधानाच्या भाग III मध्ये आहेत. यामध्ये समानता, स्वातंत्र्य, शोषण, धर्म, सांस्कृतिक व शैक्षणिक अधिकार आणि घटनात्मक उपायांशी संबंधित संरक्षणाचा समावेश होतो.",

    section3Label: "03 · मार्गदर्शक तत्त्वे",
    section3Title: "राज्याच्या धोरणाची मार्गदर्शक तत्त्वे",
    section3Description:
      "राज्याच्या धोरणाची मार्गदर्शक तत्त्वे संविधानाच्या भाग IV मध्ये आहेत. कायदे आणि धोरणे तयार करताना राज्याने विचार करावयाची तत्त्वे त्यात दिली आहेत आणि त्या भागात नमूद केलेल्या उद्दिष्टांच्या दिशेने शासनाला मार्गदर्शन करण्याचा त्यांचा हेतू आहे.",

    rightsDifferenceTitle:
      "अधिकार आणि मार्गदर्शक तत्त्वे वेगवेगळी आहेत",
    rightsDifferenceText:
      "मूलभूत अधिकार आणि राज्याच्या धोरणाची मार्गदर्शक तत्त्वे ही घटनात्मक व्यवस्थेतील स्वतंत्र भाग आहेत. मूलभूत अधिकार भाग III मध्ये आहेत, तर मार्गदर्शक तत्त्वे भाग IV मध्ये आहेत.",

    section4Label: "04 · मूलभूत कर्तव्ये",
    section4Title: "नागरिकांच्या जबाबदाऱ्या",
    section4Description:
      "भाग IVA मधील अनुच्छेद 51A मध्ये नागरिकांची मूलभूत कर्तव्ये नमूद केली आहेत. यामध्ये संविधानाचा आदर करणे, राष्ट्रीय एकता व अखंडतेचे रक्षण करणे, सामंजस्य वाढवणे, पर्यावरणाचे संरक्षण करणे आणि वैज्ञानिक दृष्टिकोन विकसित करणे यांचा समावेश होतो.",

    section5Label: "05 · लोकशाही",
    section5Title: "लोकशाही कशी कार्य करते?",
    section5Description:
      "भारत ही संसदीय शासनपद्धती असलेली घटनात्मक लोकशाही आहे. संसद आणि राज्य विधिमंडळांमध्ये प्रतिनिधित्व निवडणुकांद्वारे होते. भारत निवडणूक आयोग हा एक घटनात्मक प्राधिकरण आहे जो निर्दिष्ट निवडणुकांचे संचालन करण्यासाठी जबाबदार आहे.",

    representationTitle: "प्रतिनिधित्व",
    representationText:
      "नागरिक निवडणूक प्रक्रियेद्वारे विधिमंडळांसाठी आपल्या प्रतिनिधींची निवड करतात.",

    electionsTitle: "निवडणुका",
    electionsText:
      "प्रतिनिधी निवडण्यासाठी निवडणुका ही घटनात्मक व्यवस्था उपलब्ध करून देतात.",

    parliamentaryTitle: "संसदीय प्रणाली",
    parliamentaryText:
      "भारताची घटनात्मक व्यवस्था संसदीय शासनपद्धतीचा अवलंब करते.",

    section6Label: "06 · नागरिक सहभाग",
    section6Title: "लोकशाही म्हणजे केवळ मतदान नाही",
    section6Description:
      "मतदान हा लोकशाही सहभागाचा महत्त्वाचा भाग आहे; परंतु नागरिक सार्वजनिक संस्थांशी संवाद साधू शकतात, कायदे व धोरणांबद्दल माहिती घेऊ शकतात, सामुदायिक उपक्रमांमध्ये सहभागी होऊ शकतात आणि सार्वजनिक प्रक्रियांबद्दल माहिती मिळवू शकतात.",

    participationTitle: "नागरिक सहभाग",
    participationText:
      "संस्था आणि घटनात्मक अधिकार समजून घेतल्यास नागरिकांना सार्वजनिक जीवनात अधिक प्रभावीपणे सहभागी होता येते. KarmaFacie ही मूलभूत समज विकसित करण्यासाठी तयार करण्यात आली आहे.",

    quizLabel: "07 · झटपट क्विझ",
    quizTitle: "तुम्ही काय शिकलात ते तपासा",
    quizDescription:
      "ही KarmaFacie पूर्ण करण्यासाठी तीन प्रश्नांची उत्तरे द्या.",

    question: "प्रश्न",
    of: "पैकी",
    finishQuiz: "क्विझ पूर्ण करा",
    nextQuestion: "पुढील प्रश्न →",
    saving: "जतन केले जात आहे...",

    quizComplete: "क्विझ पूर्ण झाले!",
    scoreText: "तुमचा गुण",
    tryAgain: "पुन्हा प्रयत्न करा",

    footer: "KarmaFacie · शिका. समजा. सहभागी व्हा.",
  },
};

/* -------------------------------------------------- */
/* PAGE */
/* -------------------------------------------------- */

export default function ConstitutionPage() {
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
            topic: "constitution",
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
            type="button"
            onClick={() =>
              router.push("/explore")
            }
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
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <SimpleCard
              icon="🏛️"
              title={t.institutionsTitle}
              text={t.institutionsText}
            />

            <SimpleCard
              icon="⚖️"
              title={t.rightsTitle}
              text={t.rightsText}
            />

            <SimpleCard
              icon="📜"
              title={t.principlesTitle}
              text={t.principlesText}
            />

            <SimpleCard
              icon="🇮🇳"
              title={t.dutiesTitle}
              text={t.dutiesText}
            />
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
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {rights.map((right) => (
              <SimpleCard
                key={right.title.en}
                icon={right.icon}
                title={getText(right.title)}
                text={getText(right.text)}
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
              {t.rightsDifferenceTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.rightsDifferenceText}
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
              marginTop: "30px",
              display: "grid",
              gap: "12px",
            }}
          >
            {duties.map((duty, index) => (
              <div
                key={duty.en}
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
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  {getText(duty)}
                </p>
              </div>
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
            {t.section5Description}
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
              icon="👥"
              title={t.representationTitle}
              text={t.representationText}
            />

            <SimpleCard
              icon="🗳️"
              title={t.electionsTitle}
              text={t.electionsText}
            />

            <SimpleCard
              icon="🏛️"
              title={t.parliamentaryTitle}
              text={t.parliamentaryText}
            />
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
            {t.section6Description}
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
                margin: "0 0 12px",
              }}
            >
              {t.participationTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.participationText}
            </p>
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
            {t.quizDescription}
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
                {t.of}{" "}
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
                      index ===
                      question.answer;

                    let border =
                      "1px solid #334155";

                    let background =
                      "#020617";

                    if (
                      selectedAnswer !==
                        null &&
                      isCorrect
                    ) {
                      border =
                        "1px solid #22c55e";

                      background =
                        "rgba(34, 197, 94, 0.08)";
                    }

                    if (
                      selectedAnswer ===
                        index &&
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
                          handleAnswer(
                            index
                          )
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
                          borderRadius:
                            "12px",
                          cursor:
                            selectedAnswer ===
                            null
                              ? "pointer"
                              : "default",
                          fontSize: "15px",
                        }}
                      >
                        {
                          option[language]
                        }

                        {selectedAnswer !==
                          null &&
                          isCorrect && (
                            <span
                              style={{
                                float:
                                  "right",
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
                                float:
                                  "right",
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
                  type="button"
                  disabled={savingProgress}
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