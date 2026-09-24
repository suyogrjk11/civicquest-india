"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type ElectionStep = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type ElectionFact = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type QuizQuestion = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
};

const electionSteps: ElectionStep[] = [
  {
    icon: "📝",
    title: {
      en: "1. Electoral Roll",
      hi: "1. मतदाता सूची",
      mr: "1. मतदार यादी",
    },
    text: {
      en: "Eligible citizens are enrolled in the electoral roll. Your name must appear in the electoral roll for you to vote.",
      hi: "पात्र नागरिकों के नाम मतदाता सूची में दर्ज किए जाते हैं। मतदान करने के लिए आपका नाम मतदाता सूची में होना आवश्यक है।",
      mr: "पात्र नागरिकांची नावे मतदार यादीत नोंदवली जातात. मतदान करण्यासाठी तुमचे नाव मतदार यादीत असणे आवश्यक आहे.",
    },
  },
  {
    icon: "📢",
    title: {
      en: "2. Election Announcement",
      hi: "2. चुनाव की घोषणा",
      mr: "2. निवडणुकीची घोषणा",
    },
    text: {
      en: "The election schedule is announced and the process for nominations and polling begins.",
      hi: "चुनाव का कार्यक्रम घोषित किया जाता है और नामांकन तथा मतदान की प्रक्रिया शुरू होती है।",
      mr: "निवडणुकीचे वेळापत्रक जाहीर केले जाते आणि नामांकन व मतदानाची प्रक्रिया सुरू होते.",
    },
  },
  {
    icon: "👤",
    title: {
      en: "3. Candidates",
      hi: "3. उम्मीदवार",
      mr: "3. उमेदवार",
    },
    text: {
      en: "Eligible candidates file nominations. After scrutiny and withdrawal, the final list of candidates is published.",
      hi: "पात्र उम्मीदवार नामांकन दाखिल करते हैं। जांच और नाम वापस लेने की प्रक्रिया के बाद उम्मीदवारों की अंतिम सूची प्रकाशित की जाती है।",
      mr: "पात्र उमेदवार नामनिर्देशनपत्र दाखल करतात. छाननी आणि माघारीनंतर उमेदवारांची अंतिम यादी प्रकाशित केली जाते.",
    },
  },
  {
    icon: "🗳️",
    title: {
      en: "4. Polling",
      hi: "4. मतदान",
      mr: "4. मतदान",
    },
    text: {
      en: "Registered electors visit their polling station, complete the required verification and cast their vote.",
      hi: "पंजीकृत मतदाता अपने मतदान केंद्र पर जाते हैं, आवश्यक सत्यापन पूरा करते हैं और अपना वोट डालते हैं।",
      mr: "नोंदणीकृत मतदार मतदान केंद्रावर जातात, आवश्यक पडताळणी पूर्ण करतात आणि मतदान करतात.",
    },
  },
  {
    icon: "🔢",
    title: {
      en: "5. Counting",
      hi: "5. मतगणना",
      mr: "5. मतमोजणी",
    },
    text: {
      en: "Votes are counted according to the prescribed election procedures.",
      hi: "निर्धारित चुनाव प्रक्रियाओं के अनुसार मतों की गिनती की जाती है।",
      mr: "निर्धारित निवडणूक प्रक्रियेनुसार मतांची मोजणी केली जाते.",
    },
  },
  {
    icon: "🏆",
    title: {
      en: "6. Result",
      hi: "6. परिणाम",
      mr: "6. निकाल",
    },
    text: {
      en: "The election result is declared after the counting process is completed.",
      hi: "मतगणना पूरी होने के बाद चुनाव परिणाम घोषित किया जाता है।",
      mr: "मतमोजणी पूर्ण झाल्यानंतर निवडणुकीचा निकाल जाहीर केला जातो.",
    },
  },
];

const electionFacts: ElectionFact[] = [
  {
    icon: "👥",
    title: {
      en: "Who can register?",
      hi: "कौन पंजीकरण कर सकता है?",
      mr: "कोण नोंदणी करू शकतो?",
    },
    text: {
      en: "An Indian citizen who is 18 or older on the relevant qualifying date and ordinarily resident in the concerned area can register, unless otherwise disqualified.",
      hi: "संबंधित योग्यता तिथि पर 18 वर्ष या उससे अधिक आयु वाला और संबंधित क्षेत्र में सामान्य रूप से निवास करने वाला भारतीय नागरिक, यदि अन्यथा अयोग्य न हो, तो पंजीकरण कर सकता है।",
      mr: "संबंधित पात्रता दिनांक रोजी 18 वर्षे किंवा त्याहून अधिक वयाचा आणि संबंधित क्षेत्रात सामान्यतः वास्तव्य करणारा भारतीय नागरिक, अन्यथा अपात्र नसल्यास, नोंदणी करू शकतो.",
    },
  },
  {
    icon: "📋",
    title: {
      en: "Electoral Roll",
      hi: "मतदाता सूची",
      mr: "मतदार यादी",
    },
    text: {
      en: "The electoral roll is the official list of registered electors for a constituency or polling area.",
      hi: "मतदाता सूची किसी निर्वाचन क्षेत्र या मतदान क्षेत्र के पंजीकृत मतदाताओं की आधिकारिक सूची होती है।",
      mr: "मतदार यादी ही एखाद्या मतदारसंघातील किंवा मतदान क्षेत्रातील नोंदणीकृत मतदारांची अधिकृत यादी असते.",
    },
  },
  {
    icon: "🏛️",
    title: {
      en: "Election Commission",
      hi: "निर्वाचन आयोग",
      mr: "निवडणूक आयोग",
    },
    text: {
      en: "The Election Commission of India is a constitutional authority responsible for administering election processes in India.",
      hi: "भारत निर्वाचन आयोग भारत में चुनाव प्रक्रियाओं के प्रशासन के लिए जिम्मेदार एक संवैधानिक प्राधिकरण है।",
      mr: "भारत निवडणूक आयोग ही भारतातील निवडणूक प्रक्रिया प्रशासित करण्यासाठी जबाबदार असलेली घटनात्मक संस्था आहे.",
    },
  },
  {
    icon: "🖥️",
    title: {
      en: "EVM",
      hi: "ईवीएम",
      mr: "ईव्हीएम",
    },
    text: {
      en: "An Electronic Voting Machine is used for recording votes electronically during polling.",
      hi: "मतदान के दौरान वोट दर्ज करने के लिए इलेक्ट्रॉनिक वोटिंग मशीन का उपयोग किया जाता है।",
      mr: "मतदानाच्या वेळी मते इलेक्ट्रॉनिक पद्धतीने नोंदवण्यासाठी इलेक्ट्रॉनिक मतदान यंत्राचा वापर केला जातो.",
    },
  },
  {
    icon: "🧾",
    title: {
      en: "VVPAT",
      hi: "वीवीपैट",
      mr: "व्हीव्हीपॅट",
    },
    text: {
      en: "VVPAT stands for Voter Verifiable Paper Audit Trail. It provides a paper slip that the voter can see briefly after casting a vote.",
      hi: "VVPAT का अर्थ Voter Verifiable Paper Audit Trail है। यह एक कागजी पर्ची प्रदान करता है जिसे मतदाता वोट डालने के बाद थोड़े समय के लिए देख सकता है।",
      mr: "VVPAT म्हणजे Voter Verifiable Paper Audit Trail. मतदान केल्यानंतर मतदाराला थोड्या वेळासाठी एक कागदी पावती दिसते.",
    },
  },
  {
    icon: "📱",
    title: {
      en: "Voter Services",
      hi: "मतदाता सेवाएँ",
      mr: "मतदार सेवा",
    },
    text: {
      en: "The Election Commission provides online services for registration, checking electoral-roll information and updating voter details.",
      hi: "निर्वाचन आयोग पंजीकरण, मतदाता सूची की जानकारी देखने और मतदाता विवरण अपडेट करने के लिए ऑनलाइन सेवाएँ प्रदान करता है।",
      mr: "निवडणूक आयोग नोंदणी, मतदार यादीतील माहिती तपासणे आणि मतदार तपशील अद्ययावत करण्यासाठी ऑनलाइन सेवा प्रदान करतो.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "What must be true for a person to vote in an election?",
      hi: "किसी व्यक्ति के लिए चुनाव में मतदान करने के लिए क्या आवश्यक है?",
      mr: "एखाद्या व्यक्तीला निवडणुकीत मतदान करण्यासाठी काय आवश्यक आहे?",
    },
    options: [
      {
        en: "Their name must appear in the electoral roll",
        hi: "उनका नाम मतदाता सूची में होना चाहिए",
        mr: "त्यांचे नाव मतदार यादीत असले पाहिजे",
      },
      {
        en: "They must own property",
        hi: "उनके पास संपत्ति होनी चाहिए",
        mr: "त्यांच्या मालकीची मालमत्ता असली पाहिजे",
      },
      {
        en: "They must have a government job",
        hi: "उनके पास सरकारी नौकरी होनी चाहिए",
        mr: "त्यांच्याकडे सरकारी नोकरी असली पाहिजे",
      },
      {
        en: "They must be a member of a political party",
        hi: "उन्हें किसी राजनीतिक दल का सदस्य होना चाहिए",
        mr: "ते एखाद्या राजकीय पक्षाचे सदस्य असले पाहिजेत",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What does EVM stand for?",
      hi: "EVM का पूरा नाम क्या है?",
      mr: "EVM चे पूर्ण रूप काय आहे?",
    },
    options: [
      {
        en: "Electronic Voting Machine",
        hi: "Electronic Voting Machine",
        mr: "Electronic Voting Machine",
      },
      {
        en: "Election Verification Method",
        hi: "Election Verification Method",
        mr: "Election Verification Method",
      },
      {
        en: "Electronic Voter Management",
        hi: "Electronic Voter Management",
        mr: "Electronic Voter Management",
      },
      {
        en: "Election Voting Mechanism",
        hi: "Election Voting Mechanism",
        mr: "Election Voting Mechanism",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What does VVPAT stand for?",
      hi: "VVPAT का पूरा नाम क्या है?",
      mr: "VVPAT चे पूर्ण रूप काय आहे?",
    },
    options: [
      {
        en: "Voter Verified Polling and Tracking",
        hi: "Voter Verified Polling and Tracking",
        mr: "Voter Verified Polling and Tracking",
      },
      {
        en: "Voter Verifiable Paper Audit Trail",
        hi: "Voter Verifiable Paper Audit Trail",
        mr: "Voter Verifiable Paper Audit Trail",
      },
      {
        en: "Verified Voting Paper and Technology",
        hi: "Verified Voting Paper and Technology",
        mr: "Verified Voting Paper and Technology",
      },
      {
        en: "Voter Validation and Polling Audit Tool",
        hi: "Voter Validation and Polling Audit Tool",
        mr: "Voter Validation and Polling Audit Tool",
      },
    ],
    answer: 1,
  },
  {
    question: {
      en: "What is the minimum age for registration as a voter, subject to the applicable qualifying date?",
      hi: "लागू योग्यता तिथि के अनुसार मतदाता के रूप में पंजीकरण की न्यूनतम आयु क्या है?",
      mr: "लागू पात्रता दिनांकानुसार मतदार म्हणून नोंदणी करण्यासाठी किमान वय किती आहे?",
    },
    options: [
      {
        en: "16 years",
        hi: "16 वर्ष",
        mr: "16 वर्षे",
      },
      {
        en: "18 years",
        hi: "18 वर्ष",
        mr: "18 वर्षे",
      },
      {
        en: "21 years",
        hi: "21 वर्ष",
        mr: "21 वर्षे",
      },
      {
        en: "25 years",
        hi: "25 वर्ष",
        mr: "25 वर्षे",
      },
    ],
    answer: 1,
  },
  {
    question: {
      en: "Which institution administers elections in India?",
      hi: "भारत में चुनावों का प्रशासन कौन-सी संस्था करती है?",
      mr: "भारतातील निवडणुका कोणती संस्था प्रशासित करते?",
    },
    options: [
      {
        en: "Supreme Court of India",
        hi: "भारत का सर्वोच्च न्यायालय",
        mr: "भारताचे सर्वोच्च न्यायालय",
      },
      {
        en: "Parliament",
        hi: "संसद",
        mr: "संसद",
      },
      {
        en: "Election Commission of India",
        hi: "भारत निर्वाचन आयोग",
        mr: "भारत निवडणूक आयोग",
      },
      {
        en: "Reserve Bank of India",
        hi: "भारतीय रिज़र्व बैंक",
        mr: "भारतीय रिझर्व्ह बँक",
      },
    ],
    answer: 2,
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
    section2Label: string;
    section2Title: string;
    section2Text: string;
    minAgeTitle: string;
    minAgeText: string;
    citizenshipTitle: string;
    citizenshipText: string;
    residenceTitle: string;
    residenceText: string;
    section3Label: string;
    section3Title: string;
    section3Text: string;
    checkNameTitle: string;
    checkNameText: string;
    newRegistrationTitle: string;
    newRegistrationText: string;
    updateDetailsTitle: string;
    updateDetailsText: string;
    section4Label: string;
    section4Title: string;
    section4Text: string;
    evmTitle: string;
    evmText: string;
    vvpatTitle: string;
    vvpatText: string;
    voteRecordedTitle: string;
    voteRecordedText: string;
    section5Label: string;
    section5Title: string;
    section5Text: string;
    eciBoxTitle: string;
    eciBoxText: string;
    section6Label: string;
    section6Title: string;
    section6Text: string;
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
    subtitle: "Elections & Civic Participation",
    back: "← Explore",
    heroLabel: "CIVIC BASICS · 03",
    heroTitle: "Elections & Civic Participation",
    heroText:
      "Elections are an important part of India’s democratic system. Learn how electoral rolls, candidates, polling, EVMs, VVPAT and election administration fit together.",
    section1Label: "01 · WHAT IS AN ELECTION?",
    section1Title: "How does an election work?",
    section1Text:
      "An election is a constitutional process through which eligible voters participate in choosing representatives. The process involves electoral rolls, candidates, polling, counting and declaration of results.",
    section2Label: "02 · WHO CAN VOTE?",
    section2Title: "Understanding voter eligibility",
    section2Text:
      "The Constitution provides for elections to the House of the People and State Legislative Assemblies on the basis of adult suffrage. An eligible voter must satisfy the applicable legal requirements, including citizenship and the minimum age requirement, and must not be otherwise disqualified.",
    minAgeTitle: "Minimum age",
    minAgeText:
      "The constitutional voting age is 18 years, subject to the applicable qualifying date.",
    citizenshipTitle: "Citizenship",
    citizenshipText:
      "Voter registration is available to eligible Indian citizens.",
    residenceTitle: "Residence",
    residenceText:
      "The elector is generally registered in the constituency or polling area where they are ordinarily resident.",
    section3Label: "03 · ELECTORAL ROLL",
    section3Title: "Why is the electoral roll important?",
    section3Text:
      "The electoral roll is the official list of electors for a polling area or constituency. You can vote only if your name appears on the electoral roll for the relevant election.",
    checkNameTitle: "Check your name",
    checkNameText:
      "The Election Commission provides services to search electoral-roll information.",
    newRegistrationTitle: "New registration",
    newRegistrationText:
      "Eligible citizens can apply for registration using Form 6 through the voter services system.",
    updateDetailsTitle: "Update details",
    updateDetailsText:
      "Voters can apply for correction or shifting of residence through the prescribed process.",
    section4Label: "04 · EVM & VVPAT",
    section4Title: "How do you cast a vote?",
    section4Text:
      "Electronic Voting Machines are used for recording votes. The VVPAT system provides a paper slip that allows the voter to visually verify the candidate information for a short period before the slip drops into the sealed VVPAT box.",
    evmTitle: "Electronic Voting Machine",
    evmText:
      "The EVM consists of a Control Unit and Balloting Unit connected by a cable.",
    vvpatTitle: "VVPAT",
    vvpatText:
      "A paper slip showing the candidate's serial number, name and symbol is visible through a transparent window for about 7 seconds.",
    voteRecordedTitle: "Vote recorded",
    voteRecordedText:
      "After the vote is cast, the voter hears a beep indicating that the vote has been recorded.",
    section5Label: "05 · ELECTION COMMISSION",
    section5Title: "Who administers elections?",
    section5Text:
      "The Election Commission of India is an autonomous constitutional authority responsible for administering election processes in India. Its constitutional role is provided under Article 324.",
    eciBoxTitle: "What does the ECI administer?",
    eciBoxText:
      "The Election Commission of India administers elections to the Lok Sabha, Rajya Sabha, State Legislative Assemblies and the offices of the President and Vice President, according to its constitutional and statutory responsibilities.",
    section6Label: "06 · CIVIC PARTICIPATION",
    section6Title: "Being an informed voter",
    section6Text:
      "Civic participation includes understanding how elections work, checking your electoral-roll information, learning about candidates and election procedures, and participating in the democratic process.",
    quizLabel: "07 · QUICK QUIZ",
    quizTitle: "Test what you learned",
    quizText:
      "Answer five questions to complete this KarmaFacie.",
    question: "Question",
    saving: "Saving...",
    finishQuiz: "Finish Quiz",
    nextQuestion: "Next Question →",
    quizComplete: "Quiz complete!",
    scored: "You scored",
    tryAgain: "Try Again",
    footer: "KarmaFacie · Learn. Understand. Participate.",
  },

  hi: {
    subtitle: "चुनाव और नागरिक भागीदारी",
    back: "← एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 03",
    heroTitle: "चुनाव और नागरिक भागीदारी",
    heroText:
      "चुनाव भारत की लोकतांत्रिक व्यवस्था का एक महत्वपूर्ण हिस्सा हैं। जानें कि मतदाता सूची, उम्मीदवार, मतदान, EVM, VVPAT और चुनाव प्रशासन एक-दूसरे से कैसे जुड़े हैं।",
    section1Label: "01 · चुनाव क्या है?",
    section1Title: "चुनाव कैसे काम करता है?",
    section1Text:
      "चुनाव एक संवैधानिक प्रक्रिया है जिसके माध्यम से पात्र मतदाता प्रतिनिधियों को चुनने में भाग लेते हैं। इस प्रक्रिया में मतदाता सूची, उम्मीदवार, मतदान, मतगणना और परिणाम की घोषणा शामिल होती है।",
    section2Label: "02 · कौन मतदान कर सकता है?",
    section2Title: "मतदाता पात्रता को समझना",
    section2Text:
      "संविधान वयस्क मताधिकार के आधार पर लोक सभा और राज्य विधान सभाओं के चुनाव का प्रावधान करता है। पात्र मतदाता को नागरिकता और न्यूनतम आयु सहित लागू कानूनी आवश्यकताओं को पूरा करना चाहिए और उसे अन्यथा अयोग्य घोषित नहीं किया गया होना चाहिए।",
    minAgeTitle: "न्यूनतम आयु",
    minAgeText:
      "लागू योग्यता तिथि के अनुसार संवैधानिक मतदान आयु 18 वर्ष है।",
    citizenshipTitle: "नागरिकता",
    citizenshipText:
      "पात्र भारतीय नागरिक मतदाता के रूप में पंजीकरण कर सकते हैं।",
    residenceTitle: "निवास",
    residenceText:
      "मतदाता का पंजीकरण सामान्यतः उस निर्वाचन क्षेत्र या मतदान क्षेत्र में होता है जहाँ वह सामान्य रूप से निवास करता है।",
    section3Label: "03 · मतदाता सूची",
    section3Title: "मतदाता सूची महत्वपूर्ण क्यों है?",
    section3Text:
      "मतदाता सूची किसी मतदान क्षेत्र या निर्वाचन क्षेत्र के मतदाताओं की आधिकारिक सूची होती है। संबंधित चुनाव में मतदान करने के लिए आपका नाम मतदाता सूची में होना आवश्यक है।",
    checkNameTitle: "अपना नाम जाँचें",
    checkNameText:
      "निर्वाचन आयोग मतदाता सूची की जानकारी खोजने के लिए सेवाएँ उपलब्ध कराता है।",
    newRegistrationTitle: "नया पंजीकरण",
    newRegistrationText:
      "पात्र नागरिक मतदाता सेवा प्रणाली के माध्यम से फॉर्म 6 का उपयोग करके पंजीकरण के लिए आवेदन कर सकते हैं।",
    updateDetailsTitle: "विवरण अपडेट करें",
    updateDetailsText:
      "मतदाता निर्धारित प्रक्रिया के माध्यम से विवरण में सुधार या निवास स्थान बदलने के लिए आवेदन कर सकते हैं।",
    section4Label: "04 · EVM और VVPAT",
    section4Title: "आप मतदान कैसे करते हैं?",
    section4Text:
      "वोट दर्ज करने के लिए इलेक्ट्रॉनिक वोटिंग मशीनों का उपयोग किया जाता है। VVPAT प्रणाली एक कागजी पर्ची प्रदान करती है, जिससे मतदाता थोड़े समय के लिए उम्मीदवार की जानकारी को देख कर सत्यापित कर सकता है, जिसके बाद पर्ची सीलबंद VVPAT बॉक्स में चली जाती है।",
    evmTitle: "इलेक्ट्रॉनिक वोटिंग मशीन",
    evmText:
      "EVM में एक कंट्रोल यूनिट और एक बैलेटिंग यूनिट होती है, जो एक केबल से जुड़ी होती हैं।",
    vvpatTitle: "VVPAT",
    vvpatText:
      "उम्मीदवार का क्रमांक, नाम और चुनाव चिह्न दिखाने वाली कागजी पर्ची लगभग 7 सेकंड के लिए पारदर्शी खिड़की के माध्यम से दिखाई देती है।",
    voteRecordedTitle: "वोट दर्ज हुआ",
    voteRecordedText:
      "वोट डालने के बाद मतदाता को एक बीप सुनाई देती है, जो यह दर्शाती है कि वोट दर्ज हो गया है।",
    section5Label: "05 · निर्वाचन आयोग",
    section5Title: "चुनावों का प्रशासन कौन करता है?",
    section5Text:
      "भारत निर्वाचन आयोग एक स्वायत्त संवैधानिक प्राधिकरण है जो भारत में चुनाव प्रक्रियाओं के प्रशासन के लिए जिम्मेदार है। इसकी संवैधानिक भूमिका अनुच्छेद 324 के अंतर्गत दी गई है।",
    eciBoxTitle: "ECI किन चुनावों का प्रशासन करता है?",
    eciBoxText:
      "भारत निर्वाचन आयोग अपनी संवैधानिक और वैधानिक जिम्मेदारियों के अनुसार लोक सभा, राज्य सभा, राज्य विधान सभाओं तथा राष्ट्रपति और उपराष्ट्रपति के पदों के लिए चुनावों का प्रशासन करता है।",
    section6Label: "06 · नागरिक भागीदारी",
    section6Title: "एक जागरूक मतदाता बनना",
    section6Text:
      "नागरिक भागीदारी में यह समझना शामिल है कि चुनाव कैसे काम करते हैं, अपनी मतदाता सूची की जानकारी जाँचना, उम्मीदवारों और चुनाव प्रक्रियाओं के बारे में जानना तथा लोकतांत्रिक प्रक्रिया में भाग लेना।",
    quizLabel: "07 · त्वरित क्विज़",
    quizTitle: "आपने क्या सीखा, जाँचें",
    quizText:
      "इस KarmaFacie को पूरा करने के लिए पाँच प्रश्नों के उत्तर दें।",
    question: "प्रश्न",
    saving: "सहेजा जा रहा है...",
    finishQuiz: "क्विज़ समाप्त करें",
    nextQuestion: "अगला प्रश्न →",
    quizComplete: "क्विज़ पूरा हुआ!",
    scored: "आपका स्कोर",
    tryAgain: "फिर से प्रयास करें",
    footer: "KarmaFacie · सीखें। समझें। भाग लें।",
  },

  mr: {
    subtitle: "निवडणुका आणि नागरिक सहभाग",
    back: "← एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 03",
    heroTitle: "निवडणुका आणि नागरिक सहभाग",
    heroText:
      "निवडणुका या भारताच्या लोकशाही व्यवस्थेचा एक महत्त्वाचा भाग आहेत. मतदार यादी, उमेदवार, मतदान, EVM, VVPAT आणि निवडणूक प्रशासन हे एकमेकांशी कसे संबंधित आहेत ते जाणून घ्या.",
    section1Label: "01 · निवडणूक म्हणजे काय?",
    section1Title: "निवडणूक कशी कार्य करते?",
    section1Text:
      "निवडणूक ही एक घटनात्मक प्रक्रिया आहे ज्याद्वारे पात्र मतदार प्रतिनिधी निवडण्यात सहभागी होतात. या प्रक्रियेत मतदार यादी, उमेदवार, मतदान, मतमोजणी आणि निकालाची घोषणा यांचा समावेश होतो.",
    section2Label: "02 · कोण मतदान करू शकतो?",
    section2Title: "मतदार पात्रता समजून घेणे",
    section2Text:
      "राज्यघटनेनुसार प्रौढ मताधिकाराच्या आधारावर लोकसभा आणि राज्य विधानसभांच्या निवडणुका घेतल्या जातात. पात्र मतदाराने नागरिकत्व आणि किमान वयाची अट यांसह लागू कायदेशीर आवश्यकता पूर्ण केल्या पाहिजेत आणि तो इतर कोणत्याही कारणाने अपात्र नसावा.",
    minAgeTitle: "किमान वय",
    minAgeText:
      "लागू पात्रता दिनांकानुसार घटनात्मक मतदानाचे वय 18 वर्षे आहे.",
    citizenshipTitle: "नागरिकत्व",
    citizenshipText:
      "पात्र भारतीय नागरिक मतदार म्हणून नोंदणी करू शकतात.",
    residenceTitle: "राहण्याचे ठिकाण",
    residenceText:
      "मतदाराची नोंदणी सामान्यतः तो ज्या मतदारसंघात किंवा मतदान क्षेत्रात नियमितपणे राहतो त्या ठिकाणी केली जाते.",
    section3Label: "03 · मतदार यादी",
    section3Title: "मतदार यादी महत्त्वाची का आहे?",
    section3Text:
      "मतदार यादी ही मतदान क्षेत्र किंवा मतदारसंघातील मतदारांची अधिकृत यादी असते. संबंधित निवडणुकीत मतदान करण्यासाठी तुमचे नाव मतदार यादीत असणे आवश्यक आहे.",
    checkNameTitle: "तुमचे नाव तपासा",
    checkNameText:
      "निवडणूक आयोग मतदार यादीतील माहिती शोधण्यासाठी सेवा उपलब्ध करून देतो.",
    newRegistrationTitle: "नवीन नोंदणी",
    newRegistrationText:
      "पात्र नागरिक मतदार सेवा प्रणालीद्वारे फॉर्म 6 वापरून नोंदणीसाठी अर्ज करू शकतात.",
    updateDetailsTitle: "तपशील अद्ययावत करा",
    updateDetailsText:
      "मतदार निर्धारित प्रक्रियेद्वारे तपशील दुरुस्ती किंवा राहण्याचे ठिकाण बदलण्यासाठी अर्ज करू शकतात.",
    section4Label: "04 · EVM आणि VVPAT",
    section4Title: "मतदान कसे केले जाते?",
    section4Text:
      "मते नोंदवण्यासाठी इलेक्ट्रॉनिक मतदान यंत्रांचा वापर केला जातो. VVPAT प्रणाली एक कागदी पावती उपलब्ध करून देते, ज्याद्वारे मतदाराला उमेदवाराची माहिती थोड्या काळासाठी प्रत्यक्ष पाहून पडताळता येते आणि त्यानंतर ती पावती सीलबंद VVPAT पेटीत जाते.",
    evmTitle: "इलेक्ट्रॉनिक मतदान यंत्र",
    evmText:
      "EVM मध्ये कंट्रोल युनिट आणि बॅलेटिंग युनिट असते आणि ती केबलद्वारे जोडलेली असतात.",
    vvpatTitle: "VVPAT",
    vvpatText:
      "उमेदवाराचा अनुक्रमांक, नाव आणि निवडणूक चिन्ह असलेली कागदी पावती पारदर्शक खिडकीतून सुमारे 7 सेकंद दिसते.",
    voteRecordedTitle: "मत नोंदवले गेले",
    voteRecordedText:
      "मतदान केल्यानंतर मतदाराला एक बीप ऐकू येतो, ज्यामुळे मत नोंदवले गेले असल्याचे सूचित होते.",
    section5Label: "05 · निवडणूक आयोग",
    section5Title: "निवडणुका कोण प्रशासित करते?",
    section5Text:
      "भारत निवडणूक आयोग ही भारतातील निवडणूक प्रक्रिया प्रशासित करण्यासाठी जबाबदार असलेली स्वायत्त घटनात्मक संस्था आहे. तिची घटनात्मक भूमिका अनुच्छेद 324 अंतर्गत दिली आहे.",
    eciBoxTitle: "ECI कोणत्या निवडणुका प्रशासित करते?",
    eciBoxText:
      "भारत निवडणूक आयोग आपल्या घटनात्मक आणि वैधानिक जबाबदाऱ्यांनुसार लोकसभा, राज्यसभा, राज्य विधानसभांच्या तसेच राष्ट्रपती आणि उपराष्ट्रपती पदांच्या निवडणुका प्रशासित करतो.",
    section6Label: "06 · नागरिक सहभाग",
    section6Title: "माहितीपूर्ण मतदार बनणे",
    section6Text:
      "नागरिक सहभागामध्ये निवडणुका कशा कार्य करतात हे समजून घेणे, मतदार यादीतील स्वतःची माहिती तपासणे, उमेदवार आणि निवडणूक प्रक्रियेबद्दल माहिती घेणे आणि लोकशाही प्रक्रियेत सहभागी होणे यांचा समावेश होतो.",
    quizLabel: "07 · झटपट क्विझ",
    quizTitle: "तुम्ही काय शिकलात ते तपासा",
    quizText:
      "हे KarmaFacie पूर्ण करण्यासाठी पाच प्रश्नांची उत्तरे द्या.",
    question: "प्रश्न",
    saving: "सेव्ह होत आहे...",
    finishQuiz: "क्विझ पूर्ण करा",
    nextQuestion: "पुढील प्रश्न →",
    quizComplete: "क्विझ पूर्ण!",
    scored: "तुमचा गुण",
    tryAgain: "पुन्हा प्रयत्न करा",
    footer: "KarmaFacie · शिका. समजा. सहभागी व्हा.",
  },
};

export default function ElectionsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const t = content[language];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
            topic: "elections",
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
              Civic<span style={{ color: "#ff7a00" }}>Quest</span>
            </div>

            <div
              style={{
                color: "#94a3b8",
                marginTop: "5px",
              }}
            >
              {t.subtitle}
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/explore")}
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
            {t.heroLabel}
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
            {t.heroText}
          </p>
        </section>

        {/* SECTION 1 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section1Label} />

          <h2 style={sectionHeadingStyle}>{t.section1Title}</h2>

          <p style={paragraphStyle}>{t.section1Text}</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            {electionSteps.map((step, index) => (
              <SimpleCard
                key={`${step.icon}-${index}`}
                icon={step.icon}
                title={step.title[language]}
                text={step.text[language]}
              />
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

          <h2 style={sectionHeadingStyle}>{t.section2Title}</h2>

          <p style={paragraphStyle}>{t.section2Text}</p>

          <div
            style={{
              marginTop: "30px",
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "20px",
              padding: "28px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              <Highlight
                number="18+"
                title={t.minAgeTitle}
                text={t.minAgeText}
              />

              <Highlight
                number="🇮🇳"
                title={t.citizenshipTitle}
                text={t.citizenshipText}
              />

              <Highlight
                number="📍"
                title={t.residenceTitle}
                text={t.residenceText}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section3Label} />

          <h2 style={sectionHeadingStyle}>{t.section3Title}</h2>

          <p style={paragraphStyle}>{t.section3Text}</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            <SimpleCard
              icon="🔎"
              title={t.checkNameTitle}
              text={t.checkNameText}
            />

            <SimpleCard
              icon="📝"
              title={t.newRegistrationTitle}
              text={t.newRegistrationText}
            />

            <SimpleCard
              icon="🔄"
              title={t.updateDetailsTitle}
              text={t.updateDetailsText}
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

          <h2 style={sectionHeadingStyle}>{t.section4Title}</h2>

          <p style={paragraphStyle}>{t.section4Text}</p>

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            <SimpleCard
              icon="🖥️"
              title={t.evmTitle}
              text={t.evmText}
            />

            <SimpleCard
              icon="🧾"
              title={t.vvpatTitle}
              text={t.vvpatText}
            />

            <SimpleCard
              icon="🔊"
              title={t.voteRecordedTitle}
              text={t.voteRecordedText}
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

          <h2 style={sectionHeadingStyle}>{t.section5Title}</h2>

          <p style={paragraphStyle}>{t.section5Text}</p>

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
              {t.eciBoxTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.eciBoxText}
            </p>
          </div>
        </section>

        {/* SECTION 6 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section6Label} />

          <h2 style={sectionHeadingStyle}>{t.section6Title}</h2>

          <p style={paragraphStyle}>{t.section6Text}</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {electionFacts.map((fact, index) => (
              <SimpleCard
                key={`${fact.icon}-${index}`}
                icon={fact.icon}
                title={fact.title[language]}
                text={fact.text[language]}
              />
            ))}
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
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.answer;

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
                      key={`${index}-${option.en}`}
                      type="button"
                      onClick={() => handleAnswer(index)}
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
                  onClick={nextQuestion}
                  disabled={savingProgress}
                  style={{
                    marginTop: "25px",
                    padding: "13px 22px",
                    background: savingProgress
                      ? "#7c3f00"
                      : "#ff7a00",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: savingProgress
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
                {t.scored}{" "}
                <strong style={{ color: "#ff7a00" }}>
                  {score}/{quizQuestions.length}
                </strong>
              </p>

              <button
                type="button"
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

function Highlight({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#ff7a00",
          marginBottom: "8px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          fontSize: "18px",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.6",
          margin: 0,
          fontSize: "14px",
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