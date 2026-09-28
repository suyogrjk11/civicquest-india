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
  const { language, setLanguage } = useLanguage();
  const t = content[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const getText = (value: LocalizedText) => value[language];

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
    setSavingProgress(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user found.");
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
      console.error(
        "Unexpected error while saving learning progress:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
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

  const languageLabel =
    language === "en"
      ? "Language"
      : language === "hi"
        ? "भाषा"
        : "भाषा";

  const progress =
    ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <main className="kf-constitution-page">
      <div className="kf-explore-shell">
        <header className="kf-explore-topbar">
          <button
            type="button"
            onClick={() => router.push("/explore")}
            className="kf-explore-back"
          >
            <span>←</span>
            {t.back.replace("← ", "")}
          </button>

          <div className="kf-explore-brand">
            <div className="kf-explore-brand-box">K</div>
            <div>
              <div className="kf-explore-brand-name">
                Karma<span>Facie</span>
              </div>
              <div className="kf-explore-brand-caption">
                EXPLORE &amp; LEARN
              </div>
            </div>
          </div>

          <label className="kf-explore-language">
            <span>{languageLabel}</span>
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label={languageLabel}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
        </header>

        <section className="kf-explore-hero">
          <div className="kf-explore-hero-orb kf-explore-orb-blue" />
          <div className="kf-explore-hero-orb kf-explore-orb-peach" />

          <div className="kf-explore-hero-content">
            <div className="kf-explore-eyebrow">
              {t.topicLabel}
            </div>

            <div className="kf-explore-hero-row">
              <div className="kf-explore-hero-copy">
                <h1>{t.heroTitle}</h1>
                <p>{t.heroDescription}</p>
              </div>

              <div className="kf-explore-topic-badge">
                <div className="kf-explore-topic-badge-icon">
                  📜
                </div>
                <div>
                  <strong>
                    {language === "en"
                      ? "Civic knowledge"
                      : language === "hi"
                        ? "नागरिक ज्ञान"
                        : "नागरी ज्ञान"}
                  </strong>
                  <span>
                    {language === "en"
                      ? "Constitution"
                      : language === "hi"
                        ? "संविधान"
                        : "संविधान"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="kf-explore-section kf-surface-blue">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section1Label}
              </div>
              <h2>{t.section1Title}</h2>
              <p>{t.section1Description}</p>
            </div>
          </div>

          <div className="kf-four-grid">
            <KnowledgeCard
              icon="🏛️"
              title={t.institutionsTitle}
              text={t.institutionsText}
              tone="blue"
            />
            <KnowledgeCard
              icon="⚖️"
              title={t.rightsTitle}
              text={t.rightsText}
              tone="peach"
            />
            <KnowledgeCard
              icon="📜"
              title={t.principlesTitle}
              text={t.principlesText}
              tone="green"
            />
            <KnowledgeCard
              icon="🇮🇳"
              title={t.dutiesTitle}
              text={t.dutiesText}
              tone="lavender"
            />
          </div>
        </section>

        <section className="kf-explore-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section2Label}
              </div>
              <h2>{t.section2Title}</h2>
              <p>{t.section2Description}</p>
            </div>

            <div className="kf-count-pill">
              {rights.length}{" "}
              {language === "en"
                ? "rights"
                : language === "hi"
                  ? "अधिकार"
                  : "अधिकार"}
            </div>
          </div>

          <div className="kf-rights-grid">
            {rights.map((right, index) => (
              <KnowledgeCard
                key={right.title.en}
                icon={right.icon}
                title={getText(right.title)}
                text={getText(right.text)}
                tone={
                  index % 4 === 0
                    ? "blue"
                    : index % 4 === 1
                      ? "peach"
                      : index % 4 === 2
                        ? "green"
                        : "lavender"
                }
              />
            ))}
          </div>
        </section>

        <section className="kf-explore-section kf-surface-peach">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section3Label}
              </div>
              <h2>{t.section3Title}</h2>
              <p>{t.section3Description}</p>
            </div>
          </div>

          <div className="kf-info-callout">
            <div className="kf-info-callout-icon">⚖️</div>
            <div>
              <h3>{t.rightsDifferenceTitle}</h3>
              <p>{t.rightsDifferenceText}</p>
            </div>
          </div>
        </section>

        <section className="kf-explore-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section4Label}
              </div>
              <h2>{t.section4Title}</h2>
              <p>{t.section4Description}</p>
            </div>

            <div className="kf-count-pill kf-count-green">
              {duties.length}{" "}
              {language === "en"
                ? "duties"
                : language === "hi"
                  ? "कर्तव्य"
                  : "कर्तव्ये"}
            </div>
          </div>

          <div className="kf-duty-list">
            {duties.map((duty, index) => (
              <div className="kf-duty-item" key={duty.en}>
                <div className="kf-duty-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <p>{getText(duty)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="kf-explore-section kf-surface-green">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section5Label}
              </div>
              <h2>{t.section5Title}</h2>
              <p>{t.section5Description}</p>
            </div>
          </div>

          <div className="kf-three-grid">
            <KnowledgeCard
              icon="👥"
              title={t.representationTitle}
              text={t.representationText}
              tone="blue"
            />
            <KnowledgeCard
              icon="🗳️"
              title={t.electionsTitle}
              text={t.electionsText}
              tone="peach"
            />
            <KnowledgeCard
              icon="🏛️"
              title={t.parliamentaryTitle}
              text={t.parliamentaryText}
              tone="lavender"
            />
          </div>
        </section>

        <section className="kf-explore-section">
          <div className="kf-section-heading">
            <div>
              <div className="kf-section-kicker">
                {t.section6Label}
              </div>
              <h2>{t.section6Title}</h2>
              <p>{t.section6Description}</p>
            </div>
          </div>

          <div className="kf-participation-card">
            <div className="kf-participation-orb kf-participation-blue" />
            <div className="kf-participation-orb kf-participation-peach" />
            <div className="kf-participation-content">
              <div className="kf-participation-icon">🤝</div>
              <div>
                <h3>{t.participationTitle}</h3>
                <p>{t.participationText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="kf-quiz-section">
          <div className="kf-quiz-head">
            <div>
              <div className="kf-explore-eyebrow">
                {t.quizLabel}
              </div>
              <h2>{t.quizTitle}</h2>
              <p>{t.quizDescription}</p>
            </div>

            {!quizFinished && (
              <div className="kf-quiz-progress-pill">
                {currentQuestion + 1}/{quizQuestions.length}
              </div>
            )}
          </div>

          {!quizFinished ? (
            <div className="kf-quiz-body">
              <div className="kf-quiz-progress-meta">
                <span>
                  {t.question} {currentQuestion + 1} {t.of}{" "}
                  {quizQuestions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="kf-quiz-progress">
                <div
                  className="kf-quiz-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="kf-quiz-question-kicker">
                {language === "en"
                  ? "CHECK YOUR UNDERSTANDING"
                  : language === "hi"
                    ? "अपनी समझ जाँचें"
                    : "तुमची समज तपासा"}
              </div>

              <h3>{question.question[language]}</h3>

              <div className="kf-quiz-options">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.answer;
                  const answered = selectedAnswer !== null;

                  return (
                    <button
                      key={option.en}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswer(index)}
                      className={[
                        "kf-quiz-option",
                        isSelected && !isCorrect
                          ? "kf-quiz-option-wrong"
                          : "",
                        answered && isCorrect
                          ? "kf-quiz-option-correct"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="kf-quiz-option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="kf-quiz-option-text">
                        {option[language]}
                      </span>

                      {answered && isCorrect && (
                        <span className="kf-quiz-option-mark">
                          ✓
                        </span>
                      )}

                      {answered &&
                        isSelected &&
                        !isCorrect && (
                          <span className="kf-quiz-option-mark kf-mark-wrong">
                            ×
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div
                  className={[
                    "kf-quiz-feedback",
                    selectedAnswer === question.answer
                      ? "kf-feedback-good"
                      : "kf-feedback-bad",
                  ].join(" ")}
                >
                  <strong>
                    {selectedAnswer === question.answer
                      ? language === "en"
                        ? "Correct!"
                        : language === "hi"
                          ? "सही!"
                          : "बरोबर!"
                      : language === "en"
                        ? "Not quite."
                        : language === "hi"
                          ? "यह सही उत्तर नहीं है।"
                          : "हे योग्य उत्तर नाही."}
                  </strong>

                  <span>
                    {language === "en"
                      ? "Choose the next question to continue."
                      : language === "hi"
                        ? "जारी रखने के लिए अगला प्रश्न चुनें।"
                        : "पुढे जाण्यासाठी पुढील प्रश्न निवडा."}
                  </span>
                </div>
              )}

              <div className="kf-quiz-controls">
                {selectedAnswer !== null ? (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={savingProgress}
                    className="kf-primary-button"
                  >
                    {currentQuestion ===
                    quizQuestions.length - 1
                      ? savingProgress
                        ? t.saving
                        : t.finishQuiz
                      : t.nextQuestion}
                  </button>
                ) : (
                  <div className="kf-quiz-hint">
                    {language === "en"
                      ? "Select an answer to continue."
                      : language === "hi"
                        ? "जारी रखने के लिए एक उत्तर चुनें।"
                        : "पुढे जाण्यासाठी एक उत्तर निवडा."}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="kf-quiz-complete">
              <div className="kf-complete-orb kf-complete-blue" />
              <div className="kf-complete-orb kf-complete-peach" />

              <div className="kf-complete-content">
                <div className="kf-complete-icon">🎉</div>
                <div className="kf-explore-eyebrow">
                  {language === "en"
                    ? "LEARNING COMPLETE"
                    : language === "hi"
                      ? "सीखना पूरा हुआ"
                      : "शिकणे पूर्ण झाले"}
                </div>

                <h3>{t.quizComplete}</h3>

                <p>
                  {t.scoreText}{" "}
                  <strong>
                    {score}/{quizQuestions.length}
                  </strong>
                </p>

                <button
                  type="button"
                  onClick={restartQuiz}
                  className="kf-secondary-button"
                >
                  {t.tryAgain}
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="kf-explore-footer">
          Karma<span>Facie</span> · {t.footer}
        </footer>
      </div>

      <style>{`
        .kf-constitution-page {
          --kf-ivory: #f8f3ea;
          --kf-white: #fffdf9;
          --kf-navy: #102033;
          --kf-ink: #263447;
          --kf-body: #596a78;
          --kf-muted: #7b8790;
          --kf-orange: #ff7a00;
          --kf-blue: #edf5fa;
          --kf-blue-line: #d5e5ed;
          --kf-peach: #fff2e4;
          --kf-peach-line: #efddc7;
          --kf-green: #eef6e7;
          --kf-green-line: #d6e6ca;
          --kf-lavender: #f4eff9;
          --kf-lavender-line: #dfd4ea;
          --kf-line: #ddd7ce;

          min-height: 100vh;
          padding: 20px 16px 72px;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
            radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
            radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%),
            var(--kf-ivory);
          color: var(--kf-body);
          font-family: var(--font-body);
        }

        .kf-constitution-page *,
        .kf-constitution-page *::before,
        .kf-constitution-page *::after {
          box-sizing: border-box;
        }

        .kf-explore-shell {
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .kf-explore-topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid var(--kf-line);
          border-radius: 25px;
          background: rgba(255,253,249,.95);
          box-shadow: 0 14px 36px rgba(16,27,43,.055);
          backdrop-filter: blur(16px);
        }

        .kf-explore-back,
        .kf-explore-language select,
        .kf-primary-button,
        .kf-secondary-button {
          font-family: var(--font-body);
        }

        .kf-explore-back {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 42px;
          padding: 10px 14px;
          border: 1px solid #dad4cc;
          border-radius: 999px;
          background: #fffdf9;
          color: #506171;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .kf-explore-back span {
          color: var(--kf-orange);
          font-size: 15px;
        }

        .kf-explore-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kf-explore-brand-box {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--kf-orange);
          color: #fff;
          font-family: var(--font-display);
          font-size: 21px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(255,122,0,.17);
        }

        .kf-explore-brand-name {
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: 23px;
          line-height: 1;
          letter-spacing: -.045em;
          font-weight: 800;
        }

        .kf-explore-brand-name span,
        .kf-explore-footer span {
          color: var(--kf-orange);
        }

        .kf-explore-brand-caption {
          margin-top: 3px;
          color: #8b938f;
          font-size: 8px;
          line-height: 1;
          letter-spacing: .16em;
          font-weight: 900;
        }

        .kf-explore-language {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #53636f;
          font-size: 11px;
          font-weight: 900;
        }

        .kf-explore-language select {
          min-width: 120px;
          padding: 10px 13px;
          border: 1px solid #d7d1c9;
          border-radius: 999px;
          background: #fffdf9;
          color: #304154;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .kf-explore-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 16px;
          padding: 32px;
          border: 1px solid var(--kf-line);
          border-radius: 33px;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97);
          box-shadow: 0 18px 48px rgba(16,27,43,.06);
        }

        .kf-explore-hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-explore-orb-blue {
          width: 190px;
          height: 190px;
          right: -76px;
          top: -84px;
          background: rgba(208,227,239,.58);
        }

        .kf-explore-orb-peach {
          width: 170px;
          height: 105px;
          left: -46px;
          bottom: -54px;
          border-radius: 55% 45% 0 0;
          background: rgba(255,229,206,.46);
          transform: rotate(8deg);
        }

        .kf-explore-hero-content {
          position: relative;
          z-index: 1;
        }

        .kf-explore-eyebrow,
        .kf-section-kicker {
          color: #8d755e;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .kf-explore-hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-top: 8px;
        }

        .kf-explore-hero-copy {
          max-width: 800px;
        }

        .kf-explore-hero-copy h1 {
          margin: 0;
          color: var(--kf-navy);
          font-family: var(--font-display);
          font-size: clamp(46px, 6vw, 66px);
          line-height: .97;
          letter-spacing: -.05em;
          font-weight: 800;
        }

        .kf-explore-hero-copy p {
          max-width: 790px;
          margin: 14px 0 0;
          color: #586a78;
          font-size: 15px;
          line-height: 1.72;
        }

        .kf-explore-topic-badge {
          min-width: 160px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px;
          border-radius: 23px;
          background: var(--kf-peach);
          border: 1px solid var(--kf-peach-line);
        }

        .kf-explore-topic-badge-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #fffdf9;
          border: 1px solid #ead8c4;
          font-size: 21px;
        }

        .kf-explore-topic-badge strong {
          display: block;
          color: #34485a;
          font-family: var(--font-display);
          font-size: 18px;
          line-height: 1.05;
          font-weight: 800;
        }

        .kf-explore-topic-badge span {
          display: block;
          margin-top: 4px;
          color: #917b67;
          font-size: 9px;
          font-weight: 900;
        }

        .kf-explore-section {
          margin-bottom: 16px;
          padding: 28px;
          border: 1px solid var(--kf-line);
          border-radius: 30px;
          background: rgba(255,253,249,.96);
          box-shadow: 0 14px 38px rgba(16,27,43,.05);
        }

        .kf-surface-blue {
          background:
            radial-gradient(circle at 98% 0%, rgba(221,236,245,.92), transparent 28%),
            rgba(255,253,249,.96);
        }

        .kf-surface-peach {
          background:
            radial-gradient(circle at 100% 0%, rgba(255,235,216,.95), transparent 30%),
            rgba(255,253,249,.96);
        }

        .kf-surface-green {
          background:
            radial-gradient(circle at 100% 0%, rgba(227,240,216,.9), transparent 28%),
            rgba(255,253,249,.96);
        }

        .kf-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .kf-section-heading h2 {
          margin: 6px 0 6px;
          color: #293e51;
          font-family: var(--font-display);
          font-size: clamp(30px, 4vw, 39px);
          line-height: 1.03;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .kf-section-heading p {
          max-width: 840px;
          margin: 0;
          color: #64747e;
          font-size: 13px;
          line-height: 1.72;
        }

        .kf-count-pill {
          padding: 8px 12px;
          border: 1px solid #d6e4ec;
          border-radius: 999px;
          background: #edf5fa;
          color: #5b7b91;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .kf-count-green {
          border-color: #d2e2c8;
          background: #eef6e7;
          color: #607d4d;
        }

        .kf-four-grid,
        .kf-three-grid,
        .kf-rights-grid {
          display: grid;
          gap: 12px;
        }

        .kf-four-grid {
          grid-template-columns: repeat(4, minmax(0,1fr));
        }

        .kf-three-grid {
          grid-template-columns: repeat(3, minmax(0,1fr));
        }

        .kf-rights-grid {
          grid-template-columns: repeat(3, minmax(0,1fr));
        }

        .kf-knowledge-card {
          min-height: 170px;
          padding: 18px;
          border: 1px solid;
          border-radius: 22px;
        }

        .kf-card-blue {
          background: var(--kf-blue);
          border-color: var(--kf-blue-line);
        }

        .kf-card-peach {
          background: var(--kf-peach);
          border-color: var(--kf-peach-line);
        }

        .kf-card-green {
          background: var(--kf-green);
          border-color: var(--kf-green-line);
        }

        .kf-card-lavender {
          background: var(--kf-lavender);
          border-color: var(--kf-lavender-line);
        }

        .kf-knowledge-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border-radius: 15px;
          background: rgba(255,253,249,.78);
          border: 1px solid rgba(16,27,43,.07);
          font-size: 21px;
        }

        .kf-knowledge-card h3 {
          margin: 0 0 8px;
          color: #304658;
          font-family: var(--font-display);
          font-size: 20px;
          line-height: 1.08;
          font-weight: 800;
        }

        .kf-knowledge-card p {
          margin: 0;
          color: #62727d;
          font-size: 12px;
          line-height: 1.66;
        }

        .kf-info-callout {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 21px;
          border: 1px solid #ecd8c0;
          border-radius: 23px;
          background: #fff7ed;
        }

        .kf-info-callout-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 16px;
          background: #fffdf9;
          border: 1px solid #ecdac6;
          font-size: 22px;
        }

        .kf-info-callout h3 {
          margin: 0 0 7px;
          color: #354a5c;
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
        }

        .kf-info-callout p {
          margin: 0;
          color: #697781;
          font-size: 13px;
          line-height: 1.68;
        }

        .kf-duty-list {
          display: grid;
          gap: 9px;
        }

        .kf-duty-item {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 13px 15px;
          border: 1px solid #d9e4d2;
          border-radius: 18px;
          background: #f4f8ef;
        }

        .kf-duty-number {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 12px;
          background: #fffdf9;
          border: 1px solid #d8e4cf;
          color: #637f51;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
        }

        .kf-duty-item p {
          margin: 0;
          color: #53665b;
          font-size: 13px;
          line-height: 1.62;
        }

        .kf-participation-card {
          position: relative;
          overflow: hidden;
          padding: 22px;
          border: 1px solid #d7e4eb;
          border-radius: 24px;
          background:
            radial-gradient(circle at 100% 0%, rgba(211,231,242,.92), transparent 34%),
            radial-gradient(circle at 0% 100%, rgba(255,230,207,.82), transparent 35%),
            #fffdf9;
        }

        .kf-participation-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-participation-blue {
          width: 160px;
          height: 160px;
          right: -85px;
          top: -85px;
          background: rgba(207,227,239,.45);
        }

        .kf-participation-peach {
          width: 145px;
          height: 90px;
          left: -60px;
          bottom: -45px;
          background: rgba(255,229,206,.38);
        }

        .kf-participation-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .kf-participation-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 17px;
          background: #edf5fa;
          border: 1px solid #d7e5ed;
          font-size: 24px;
        }

        .kf-participation-content h3 {
          margin: 0 0 7px;
          color: #32485a;
          font-family: var(--font-display);
          font-size: 23px;
          font-weight: 800;
        }

        .kf-participation-content p {
          margin: 0;
          max-width: 900px;
          color: #667781;
          font-size: 13px;
          line-height: 1.7;
        }

        .kf-quiz-section {
          padding: 29px;
          border: 1px solid #e7d7c4;
          border-radius: 30px;
          background:
            radial-gradient(circle at 96% 0%, rgba(218,235,244,.96), transparent 28%),
            radial-gradient(circle at 0% 100%, rgba(255,231,209,.90), transparent 32%),
            #fffdf9;
          box-shadow: 0 17px 42px rgba(16,27,43,.065);
        }

        .kf-quiz-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .kf-quiz-head h2 {
          margin: 7px 0 5px;
          color: #2d4254;
          font-family: var(--font-display);
          font-size: clamp(31px, 4vw, 42px);
          line-height: 1.02;
          letter-spacing: -.035em;
          font-weight: 800;
        }

        .kf-quiz-head p {
          margin: 0;
          color: #677781;
          font-size: 13px;
          line-height: 1.65;
        }

        .kf-quiz-progress-pill {
          padding: 9px 12px;
          border: 1px solid #e2d8cc;
          border-radius: 999px;
          background: #fff8f0;
          color: #907050;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-quiz-body {
          padding: 21px;
          border: 1px solid #ddd7ce;
          border-radius: 24px;
          background: rgba(255,253,249,.98);
        }

        .kf-quiz-progress-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          color: #78868e;
          font-size: 10px;
          font-weight: 900;
        }

        .kf-quiz-progress {
          height: 8px;
          overflow: hidden;
          margin-bottom: 21px;
          border: 1px solid #dde4e7;
          border-radius: 999px;
          background: #eef1f1;
        }

        .kf-quiz-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff7a00 0%, #ff9e47 100%);
          transition: width .2s ease;
        }

        .kf-quiz-question-kicker {
          color: #8a7562;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .16em;
        }

        .kf-quiz-body h3 {
          margin: 8px 0 19px;
          color: #273c4e;
          font-family: var(--font-display);
          font-size: clamp(25px, 3.6vw, 33px);
          line-height: 1.22;
          letter-spacing: -.025em;
          font-weight: 800;
        }

        .kf-quiz-options {
          display: grid;
          gap: 10px;
        }

        .kf-quiz-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 15px;
          border: 1px solid #ddd8d0;
          border-radius: 18px;
          background: #fffdf9;
          color: #425668;
          font-family: var(--font-body);
          font-size: 13px;
          line-height: 1.55;
          text-align: left;
          cursor: pointer;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }

        .kf-quiz-option:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: #e5b07b;
          box-shadow: 0 7px 18px rgba(16,27,43,.05);
        }

        .kf-quiz-option:disabled {
          cursor: default;
        }

        .kf-quiz-option-letter {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #edf2f5;
          color: #536878;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
        }

        .kf-quiz-option-text {
          flex: 1;
        }

        .kf-quiz-option-correct {
          border-color: #cadfbd;
          background: #eef6e7;
          color: #4d6440;
        }

        .kf-quiz-option-correct .kf-quiz-option-letter {
          background: #fffdf9;
          color: #5d7c4c;
        }

        .kf-quiz-option-wrong {
          border-color: #efcaca;
          background: #fff1f1;
          color: #9b5050;
        }

        .kf-quiz-option-wrong .kf-quiz-option-letter {
          background: #fffdf9;
          color: #9d5454;
        }

        .kf-quiz-option-mark {
          color: #5d8a46;
          font-size: 20px;
          font-weight: 900;
        }

        .kf-mark-wrong {
          color: #c35b5b;
        }

        .kf-quiz-feedback {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 15px;
          font-size: 11px;
        }

        .kf-feedback-good {
          border: 1px solid #cfe1c5;
          background: #f0f7ec;
          color: #58704a;
        }

        .kf-feedback-bad {
          border: 1px solid #efcccc;
          background: #fff1f1;
          color: #985555;
        }

        .kf-quiz-feedback strong {
          font-family: var(--font-display);
          font-size: 14px;
        }

        .kf-quiz-controls {
          display: flex;
          justify-content: flex-end;
          margin-top: 18px;
        }

        .kf-primary-button,
        .kf-secondary-button {
          min-height: 43px;
          padding: 11px 18px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .kf-primary-button {
          border: none;
          background: var(--kf-orange);
          color: #fff;
          box-shadow: 0 9px 20px rgba(255,122,0,.16);
        }

        .kf-secondary-button {
          border: 1px solid #d8d2ca;
          background: #fffdf9;
          color: #4d6171;
        }

        .kf-quiz-hint {
          color: #8c979d;
          font-size: 10px;
          font-weight: 800;
        }

        .kf-quiz-complete {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border: 1px solid #ddd7ce;
          border-radius: 24px;
          background:
            radial-gradient(circle at 96% 0%, rgba(218,235,244,.94), transparent 29%),
            radial-gradient(circle at 0% 100%, rgba(255,231,209,.90), transparent 34%),
            #fffdf9;
        }

        .kf-complete-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .kf-complete-blue {
          width: 180px;
          height: 180px;
          right: -86px;
          top: -88px;
          background: rgba(207,227,239,.52);
        }

        .kf-complete-peach {
          width: 150px;
          height: 100px;
          left: -60px;
          bottom: -48px;
          background: rgba(255,229,206,.42);
        }

        .kf-complete-content {
          position: relative;
          z-index: 1;
          min-height: 310px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 8px;
          padding: 30px;
          text-align: center;
        }

        .kf-complete-icon {
          margin-bottom: 2px;
          font-size: 54px;
        }

        .kf-complete-content h3 {
          margin: 4px 0 0;
          color: #2d4254;
          font-family: var(--font-display);
          font-size: 39px;
          line-height: 1;
          font-weight: 800;
        }

        .kf-complete-content p {
          margin: 0 0 11px;
          color: #6b7a83;
          font-size: 14px;
        }

        .kf-complete-content strong {
          color: var(--kf-orange);
          font-family: var(--font-display);
          font-size: 22px;
        }

        .kf-explore-footer {
          padding: 18px 4px 0;
          color: #899298;
          font-family: var(--font-display);
          font-size: 12px;
          text-align: center;
          font-weight: 700;
        }

        @media (max-width: 980px) {
          .kf-four-grid,
          .kf-rights-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .kf-three-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .kf-explore-topbar {
            grid-template-columns: 1fr 1fr;
          }

          .kf-explore-brand {
            grid-column: 1 / -1;
            grid-row: 1;
            justify-self: center;
          }

          .kf-explore-back {
            grid-column: 1;
            grid-row: 2;
          }

          .kf-explore-language {
            grid-column: 2;
            grid-row: 2;
          }

          .kf-explore-hero,
          .kf-explore-section,
          .kf-quiz-section {
            padding: 21px;
            border-radius: 25px;
          }

          .kf-explore-hero-row,
          .kf-section-heading,
          .kf-quiz-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .kf-explore-topic-badge,
          .kf-count-pill,
          .kf-quiz-progress-pill {
            align-self: flex-start;
          }

          .kf-four-grid,
          .kf-rights-grid {
            grid-template-columns: 1fr;
          }

          .kf-quiz-controls {
            justify-content: stretch;
          }

          .kf-primary-button,
          .kf-secondary-button {
            width: 100%;
          }

          .kf-quiz-feedback {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .kf-quiz-option {
            transition: none;
          }

          .kf-quiz-progress-fill {
            transition: none;
          }
        }

        /* =========================================================
           CONSTITUTION & DEMOCRACY — DARK MODE
           EXACT VISUAL LANGUAGE OF THE LOCKED GOVERNMENT PAGE.
           Light mode remains unchanged.
           ========================================================= */

        html[data-theme="dark"] .kf-constitution-page {
          min-height: 100vh !important;
          padding: 32px 5% 70px !important;
          background:
            radial-gradient(circle at 92% 2%, rgba(42,116,177,.12) 0%, transparent 26%),
            radial-gradient(circle at 6% 82%, rgba(255,122,26,.055) 0%, transparent 23%),
            linear-gradient(180deg, #07111f 0%, #081525 52%, #07111f 100%) !important;
          color: #f7f8fb !important;
          font-family: var(--font-body) !important;
          overflow-x: hidden !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-shell {
          width: min(1120px, 100%) !important;
          margin: 0 auto !important;
        }

        /* ---------------- NAVBAR — LOCKED GOVERNMENT VERSION ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-explore-topbar {
          position: sticky !important;
          top: 12px !important;
          z-index: 100 !important;
          min-height: 0 !important;
          height: auto !important;
          /* Government page final visible gap: 16px light + 12px sticky offset. */
          margin-bottom: 28px !important;
          padding: 10px 14px !important;
          border: 1px solid rgba(82,205,255,.78) !important;
          border-right-color: rgba(255,141,29,.82) !important;
          border-radius: 24px !important;
          background: linear-gradient(
            90deg,
            rgba(4,14,25,.78) 0%,
            rgba(5,12,22,.72) 48%,
            rgba(14,12,20,.76) 100%
          ) !important;
          box-shadow:
            -10px 0 28px -9px rgba(0,212,255,.56),
             10px 0 28px -9px rgba(255,140,26,.56),
             0 12px 30px rgba(0,0,0,.34),
             inset 0 1px 0 rgba(255,255,255,.055) !important;
          backdrop-filter: blur(18px) saturate(135%) !important;
          -webkit-backdrop-filter: blur(18px) saturate(135%) !important;
          isolation: isolate !important;
        }

        /* Same soft cyan/orange internal sheen used by Government. */
        html[data-theme="dark"] .kf-constitution-page .kf-explore-topbar::after {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          border-radius: inherit !important;
          background: linear-gradient(
            90deg,
            rgba(0,212,255,.07),
            transparent 28%,
            transparent 72%,
            rgba(255,140,26,.07)
          ) !important;
          z-index: 0 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-topbar > * {
          position: relative !important;
          z-index: 2 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-brand-name {
          color: #ffffff !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-brand-name span {
          color: #ff7a00 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-brand-caption {
          color: #7f97ad !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-brand-box {
          width: 42px !important;
          height: 42px !important;
          border-radius: 14px !important;
          background: #ff7a00 !important;
          color: #ffffff !important;
          box-shadow: 0 8px 22px rgba(255,122,0,.24) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-back {
          min-height: 40px !important;
          padding: 9px 14px !important;
          background: rgba(6,18,31,.62) !important;
          color: #e6eef6 !important;
          border-color: rgba(136,169,198,.20) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-back span {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-language {
          color: #9db1c4 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-language select {
          min-width: 112px !important;
          padding: 9px 13px !important;
          background: rgba(6,18,31,.62) !important;
          color: #edf4f9 !important;
          border-color: rgba(136,169,198,.20) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        /* ---------------- HERO ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-explore-hero {
          margin-bottom: 16px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(46,111,159,.34) 0%, transparent 35%),
            radial-gradient(circle at 0% 100%, rgba(196,128,61,.18) 0%, transparent 32%),
            linear-gradient(145deg, #132a40 0%, #0f2236 54%, #0a1a2b 100%) !important;
          border-color: rgba(91,145,188,.25) !important;
          box-shadow:
            0 22px 54px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-hero-copy h1 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-hero-copy p,
        html[data-theme="dark"] .kf-constitution-page .kf-explore-section p,
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-head p,
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-body p {
          color: #aebfd0 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-eyebrow,
        html[data-theme="dark"] .kf-constitution-page .kf-section-kicker {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-topic-badge {
          min-width: 255px !important;
          background: rgba(5,16,29,.70) !important;
          border-color: rgba(119,164,196,.22) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-topic-badge-icon {
          background: rgba(255,255,255,.065) !important;
          border-color: rgba(255,255,255,.075) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-topic-badge strong {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-topic-badge span {
          color: #8ea6ba !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-orb-blue {
          background: rgba(100,155,195,.14) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-explore-orb-peach {
          background: rgba(190,124,69,.18) !important;
        }

        /* ---------------- SECTION SURFACES / TYPOGRAPHY ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-explore-section {
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-section-heading h2,
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-head h2,
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-body h3,
        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-card h3,
        html[data-theme="dark"] .kf-constitution-page .kf-info-callout h3,
        html[data-theme="dark"] .kf-constitution-page .kf-participation-content h3,
        html[data-theme="dark"] .kf-constitution-page .kf-complete-content h3 {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-section-heading p,
        html[data-theme="dark"] .kf-constitution-page .kf-copy,
        html[data-theme="dark"] .kf-constitution-page .kf-info-callout p,
        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-card p,
        html[data-theme="dark"] .kf-constitution-page .kf-duty-item p,
        html[data-theme="dark"] .kf-constitution-page .kf-participation-content p {
          color: #aebfd0 !important;
        }

        /* ---------------- KNOWLEDGE CARDS — GOVERNMENT PALETTE ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-card {
          position: relative !important;
          overflow: hidden !important;
          border-radius: 20px !important;
          color: #f5f8fb !important;
          background:
            linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.008) 28%, transparent 62%),
            rgba(7,16,28,.90) !important;
          border: 1px solid rgba(143,178,207,.18) !important;
          box-shadow:
            0 18px 38px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.045) !important;
          backdrop-filter: blur(12px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(125%) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-card::before {
          content: "" !important;
          position: absolute !important;
          width: 180px !important;
          height: 180px !important;
          right: -85px !important;
          top: -105px !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.035) !important;
          box-shadow: 0 0 60px rgba(255,255,255,.02) !important;
          pointer-events: none !important;
        }

        /* Blue */
        html[data-theme="dark"] .kf-constitution-page .kf-card-blue {
          background:
            radial-gradient(circle at 88% 8%, rgba(24,191,255,.14), transparent 30%),
            linear-gradient(145deg, #12365d, #081a31) !important;
          border-color: rgba(24,191,255,.34) !important;
        }

        /* Amber / brown */
        html[data-theme="dark"] .kf-constitution-page .kf-card-peach {
          background:
            radial-gradient(circle at 88% 8%, rgba(255,173,47,.16), transparent 30%),
            linear-gradient(145deg, #3d2711, #1b110a) !important;
          border-color: rgba(255,173,47,.38) !important;
        }

        /* Teal */
        html[data-theme="dark"] .kf-constitution-page .kf-card-green {
          background:
            radial-gradient(circle at 88% 8%, rgba(0,223,192,.15), transparent 30%),
            linear-gradient(145deg, #0d3d37, #071e20) !important;
          border-color: rgba(0,223,192,.36) !important;
        }

        /* Violet */
        html[data-theme="dark"] .kf-constitution-page .kf-card-lavender {
          background:
            radial-gradient(circle at 88% 8%, rgba(123,109,255,.17), transparent 30%),
            linear-gradient(145deg, #171d58, #0b1030) !important;
          border-color: rgba(123,109,255,.38) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-card > * {
          position: relative !important;
          z-index: 1 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-knowledge-icon {
          background: rgba(255,255,255,.055) !important;
          border-color: rgba(160,190,214,.16) !important;
        }

        /* ---------------- CALLOUT / DUTIES / PARTICIPATION ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-info-callout {
          background:
            radial-gradient(circle at 92% 8%, rgba(255,173,47,.12), transparent 28%),
            linear-gradient(145deg, #1a261b, #0b1712) !important;
          border-color: rgba(143,185,110,.22) !important;
          color: #f5f8fb !important;
          box-shadow:
            0 16px 34px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-info-callout-icon {
          background: rgba(255,173,47,.10) !important;
          border-color: rgba(255,173,47,.20) !important;
          color: #ffad2f !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-duty-item {
          background:
            linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.006)),
            #0b1929 !important;
          border-color: rgba(129,168,199,.18) !important;
          box-shadow:
            0 14px 30px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.04) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-duty-number {
          background: rgba(0,223,192,.08) !important;
          color: #00dfc0 !important;
          border-color: rgba(0,223,192,.16) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-participation-card {
          background:
            radial-gradient(circle at 92% 6%, rgba(24,191,255,.14), transparent 30%),
            linear-gradient(145deg, #12365d, #081a31) !important;
          border-color: rgba(24,191,255,.26) !important;
          box-shadow:
            0 18px 40px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.045) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-participation-orb {
          opacity: .22 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-participation-icon {
          background: rgba(255,255,255,.055) !important;
          border-color: rgba(155,190,215,.16) !important;
        }

        /* ---------------- QUIZ ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-section {
          background:
            radial-gradient(circle at 94% 0%, rgba(65,118,166,.17), transparent 34%),
            linear-gradient(145deg, #0d1e32, #091728) !important;
          border: 1px solid rgba(105,151,190,.20) !important;
          border-radius: 24px !important;
          box-shadow:
            0 20px 46px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-progress-pill {
          background: rgba(255,122,26,.08) !important;
          border-color: rgba(255,150,75,.20) !important;
          color: #ff9a52 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-body {
          background: rgba(4,12,22,.56) !important;
          border-color: rgba(125,164,195,.20) !important;
          box-shadow:
            0 14px 30px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-progress-meta,
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-question-kicker {
          color: #8ea2b6 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-progress {
          background: rgba(255,255,255,.05) !important;
          border-color: rgba(120,155,183,.14) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-progress-fill {
          background: linear-gradient(90deg, #ff7a00, #ff9e47) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option {
          background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
          color: #f7f9fc !important;
          border-color: rgba(146,176,204,.24) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.045),
            0 8px 20px rgba(0,0,0,.18) !important;
          text-shadow: 0 1px 2px rgba(0,0,0,.55) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option:hover:not(:disabled) {
          background: linear-gradient(135deg, #0b1a2b 0%, #10223a 100%) !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,.28) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.06),
            0 10px 24px rgba(0,0,0,.24) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-letter {
          background: rgba(255,255,255,.055) !important;
          color: #c4d0dc !important;
        }

        /* Final Government-page rule: correct answer becomes KarmaFacie orange. */
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-correct {
          background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
          color: #08111b !important;
          border-color: #ffad63 !important;
          box-shadow:
            0 8px 24px rgba(255,122,26,.24),
            inset 0 1px 0 rgba(255,255,255,.18) !important;
          text-shadow: none !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-correct .kf-quiz-option-letter {
          background: rgba(8,17,27,.10) !important;
          color: #08111b !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-correct .kf-quiz-option-mark {
          color: #08111b !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-wrong {
          background:
            linear-gradient(145deg, rgba(239,68,68,.10), rgba(75,15,15,.04)),
            #1b0d10 !important;
          border-color: rgba(239,68,68,.42) !important;
          color: #ffe8e8 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-wrong .kf-quiz-option-letter {
          background: rgba(239,68,68,.10) !important;
          color: #ff9b9b !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-option-mark {
          color: #66ead7 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-mark-wrong {
          color: #ff9b9b !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-feedback {
          background: rgba(5,15,25,.62) !important;
          border-color: rgba(125,164,195,.18) !important;
          color: #d8e3ed !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-feedback-good {
          border-color: rgba(0,223,192,.28) !important;
          background: rgba(0,223,192,.065) !important;
          color: #a9f4e8 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-feedback-bad {
          border-color: rgba(239,68,68,.28) !important;
          background: rgba(239,68,68,.065) !important;
          color: #ffc2c2 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-primary-button {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #111923 !important;
          border-color: rgba(255,176,112,.55) !important;
          box-shadow:
            0 8px 18px rgba(255,122,0,.22),
            0 0 20px rgba(255,122,0,.16) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-secondary-button {
          background: rgba(4,12,22,.68) !important;
          color: #e9f1f7 !important;
          border-color: rgba(139,174,204,.20) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-quiz-hint {
          color: #7e93a8 !important;
        }

        /* ---------------- QUIZ COMPLETE ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-quiz-complete {
          border-color: rgba(105,151,190,.20) !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(65,118,166,.17), transparent 30%),
            radial-gradient(circle at 0% 100%, rgba(255,122,26,.07), transparent 30%),
            #081827 !important;
          box-shadow:
            0 20px 46px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-complete-blue {
          background: rgba(100,155,195,.14) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-complete-peach {
          background: rgba(190,124,69,.16) !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-complete-content h3 {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-complete-content p {
          color: #9eb2c5 !important;
        }

        html[data-theme="dark"] .kf-constitution-page .kf-complete-content strong {
          color: #ff9a52 !important;
        }

        /* ---------------- FOOTER ---------------- */
        html[data-theme="dark"] .kf-constitution-page .kf-explore-footer {
          color: #7f94a8 !important;
        }

        /* Override legacy global light conversion rules that target
           inline #020617 / #0f172a styles on older pages. */
        html[data-theme="dark"] .kf-constitution-page [style*="background: #020617"],
        html[data-theme="dark"] .kf-constitution-page [style*="background:#020617"],
        html[data-theme="dark"] .kf-constitution-page [style*="background: #0f172a"],
        html[data-theme="dark"] .kf-constitution-page [style*="background:#0f172a"] {
          background: transparent !important;
        }

        html[data-theme="dark"] .kf-constitution-page [style*="color: white"],
        html[data-theme="dark"] .kf-constitution-page [style*="color:#fff"],
        html[data-theme="dark"] .kf-constitution-page [style*="color: #fff"] {
          color: #f5f8fb !important;
        }

        @media (max-width: 680px) {
          html[data-theme="dark"] .kf-constitution-page {
            padding: 18px 14px 56px !important;
          }

          html[data-theme="dark"] .kf-constitution-page .kf-explore-topbar {
            top: 10px !important;
            margin-bottom: 26px !important;
            padding: 9px 11px !important;
            border-radius: 20px !important;
          }

          html[data-theme="dark"] .kf-constitution-page .kf-explore-brand-box {
            width: 38px !important;
            height: 38px !important;
            border-radius: 12px !important;
            font-size: 21px !important;
          }

          html[data-theme="dark"] .kf-constitution-page .kf-quiz-section,
          html[data-theme="dark"] .kf-constitution-page .kf-quiz-body {
            border-radius: 20px !important;
          }
        }

      `}</style>
    </main>
  );
}

function KnowledgeCard({
  icon,
  title,
  text,
  tone,
}: {
  icon: string;
  title: string;
  text: string;
  tone: "blue" | "peach" | "green" | "lavender";
}) {
  return (
    <article className={`kf-knowledge-card kf-card-${tone}`}>
      <div className="kf-knowledge-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
