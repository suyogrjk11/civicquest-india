"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Language } from "@/lib/i18n";

type JourneyKey = "learn" | "understand" | "participate";

const content: Record<
  Language,
  {
    navAbout: string;
    navWhatWeDo: string;
    navExplore: string;
    navWhy: string;
    signIn: string;

    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDescription: string;
    exploreNow: string;
    signInUp: string;

    aboutLabel: string;
    aboutTitle: string;
    aboutDescription: string;

    whatWeDoLabel: string;
    whatWeDoTitle: string;
    whatWeDoDescription: string;

    learnTitle: string;
    learnDescription: string;
    learnReveal: string;

    understandTitle: string;
    understandDescription: string;
    understandReveal: string;

    participateTitle: string;
    participateDescription: string;
    participateReveal: string;

    howLabel: string;
    howTitle: string;
    howDescription: string;

    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step4Title: string;
    step4Description: string;
    step5Title: string;
    step5Description: string;

    exploreLabel: string;
    exploreTitle: string;
    exploreDescription: string;
    exploreAll: string;

    government: string;
    governmentDescription: string;
    constitution: string;
    constitutionDescription: string;
    elections: string;
    electionsDescription: string;
    localIssues: string;
    localIssuesDescription: string;
    environment: string;
    environmentDescription: string;
    economy: string;
    economyDescription: string;
    education: string;
    educationDescription: string;
    healthcare: string;
    healthcareDescription: string;

    issueJourneyLabel: string;
    issueJourneyTitle: string;
    issueJourneyDescription: string;

    issueStep1: string;
    issueStep2: string;
    issueStep3: string;
    issueStep4: string;
    issueStep5: string;
    issueStep6: string;
    issueStep7: string;

    reportIssueNow: string;

    whyLabel: string;
    whyTitle: string;
    problemTitle: string;
    problem1: string;
    problem2: string;
    problem3: string;
    problem4: string;
    solutionTitle: string;
    solution1: string;
    solution2: string;
    solution3: string;
    solution4: string;

    trustLabel: string;
    trustTitle: string;
    trustDescription: string;
    trust1Title: string;
    trust1Description: string;
    trust2Title: string;
    trust2Description: string;
    trust3Title: string;
    trust3Description: string;

    ctaTitle1: string;
    ctaTitle2: string;
    ctaDescription: string;

    footerTagline: string;
  }
> = {
  en: {
    navAbout: "About",
    navWhatWeDo: "What We Do",
    navExplore: "Explore",
    navWhy: "Why KarmaFacie?",
    signIn: "Sign in / Sign up",

    heroBadge: "🇮🇳 Built for citizens of India",
    heroTitle1: "Know. Understand.",
    heroTitle2: "Participate.",
    heroDescription:
      "KarmaFacie helps citizens learn how India works, understand the issues around them and take meaningful civic action.",
    exploreNow: "Explore KarmaFacie →",
    signInUp: "Sign in / Sign up",

    aboutLabel: "What is KarmaFacie?",
    aboutTitle:
      "Democracy works better when citizens understand it.",
    aboutDescription:
      "KarmaFacie brings civic learning and civic participation together in one simple experience. Learn about government, understand how systems affect everyday life, and discover practical ways to participate in your community.",

    whatWeDoLabel: "What can you do with KarmaFacie?",
    whatWeDoTitle: "From learning to action.",
    whatWeDoDescription:
      "KarmaFacie is designed around the complete journey of an informed citizen.",

    learnTitle: "Learn",
    learnDescription:
      "Build your civic knowledge through simple lessons and interactive quizzes.",
    learnReveal:
      "Explore Government, Constitution, Elections, Environment, Economy, Education, Healthcare and Local Issues.",

    understandTitle: "Understand",
    understandDescription:
      "Connect civic knowledge with the systems and decisions that affect everyday life.",
    understandReveal:
      "Understand responsibilities, institutions, local governance, public systems and how civic issues are handled.",

    participateTitle: "Participate",
    participateDescription:
      "Turn knowledge into meaningful civic participation.",
    participateReveal:
      "Report civic issues, follow progress, complete civic challenges and discover ways to contribute.",

    howLabel: "How KarmaFacie Works",
    howTitle: "From knowledge to action.",
    howDescription:
      "A simple journey designed to help citizens move from curiosity to informed participation.",

    step1Title: "Learn",
    step1Description:
      "Build a foundation of civic knowledge.",
    step2Title: "Understand",
    step2Description:
      "Connect knowledge to real-world systems and issues.",
    step3Title: "Find the right path",
    step3Description:
      "Understand which authority or civic process is relevant.",
    step4Title: "Take action",
    step4Description:
      "Use KarmaFacie tools to participate and report issues.",
    step5Title: "Track & verify",
    step5Description:
      "Follow updates and verify outcomes where possible.",

    exploreLabel: "Explore Civic Life",
    exploreTitle: "Start anywhere. Learn at your pace.",
    exploreDescription:
      "Explore all eight KarmaFacie learning areas without creating an account.",
    exploreAll: "Explore all topics →",

    government: "Government & Governance",
    governmentDescription:
      "Understand the Union, State and Local governments and their responsibilities.",

    constitution: "Constitution & Democracy",
    constitutionDescription:
      "Learn about rights, duties, democracy and the Constitution.",

    elections: "Elections & Civic Participation",
    electionsDescription:
      "Understand voting, electoral rolls, EVMs, VVPAT and participation.",

    localIssues: "Local Issues",
    localIssuesDescription:
      "Understand everyday civic problems and how local government handles them.",

    environment: "Environment",
    environmentDescription:
      "Explore environmental issues, sustainability and citizen action.",

    economy: "Economy & Jobs",
    economyDescription:
      "Understand economic concepts, employment, taxation and public finance.",

    education: "Education",
    educationDescription:
      "Learn about India's education system, policies and opportunities.",

    healthcare: "Healthcare",
    healthcareDescription:
      "Understand healthcare systems, institutions and civic health issues.",

    issueJourneyLabel: "Civic Issue Journey",
    issueJourneyTitle:
      "See a civic problem? Know what to do next.",
    issueJourneyDescription:
      "KarmaFacie is designed to help citizens move from seeing a problem to taking informed action.",

    issueStep1: "See a problem",
    issueStep2: "Take a photo",
    issueStep3: "Add the location",
    issueStep4: "Describe the issue",
    issueStep5: "Find the relevant authority",
    issueStep6: "Use the official channel",
    issueStep7: "Track and verify",

    reportIssueNow: "Report a Civic Issue →",

    whyLabel: "Why KarmaFacie?",
    whyTitle:
      "Making civic life easier to understand and navigate.",

    problemTitle: "The challenge",
    problem1:
      "Civic information can be difficult to understand.",
    problem2:
      "Relevant information is often spread across different places.",
    problem3:
      "Government terminology can make simple processes feel complicated.",
    problem4:
      "Citizens may not know where a local problem should be reported.",

    solutionTitle: "What KarmaFacie changes",
    solution1:
      "Simple, structured civic learning.",
    solution2:
      "Interactive lessons and quizzes.",
    solution3:
      "Local issue reporting and authority routing information.",
    solution4:
      "A clear journey from learning to participation.",

    trustLabel: "Trust & Transparency",
    trustTitle: "Built for citizens, with clarity at the core.",
    trustDescription:
      "KarmaFacie helps citizens learn and navigate civic processes while clearly distinguishing its own tools from official government systems.",

    trust1Title: "Official information",
    trust1Description:
      "Authority information can be linked to maintained directory records and official sources where available.",

    trust2Title: "Citizen-controlled reports",
    trust2Description:
      "Citizens remain in control of the civic reports and information they provide through KarmaFacie.",

    trust3Title: "Clear boundaries",
    trust3Description:
      "KarmaFacie does not present itself as a government authority or automatically treat a report as an official government submission.",

    ctaTitle1: "Ready to start your",
    ctaTitle2: " KarmaFacie journey?",
    ctaDescription:
      "Explore civic knowledge first. Create an account when you're ready to save your progress and use personalized features.",

    footerTagline:
      "Learn. Understand. Participate.",
  },

  hi: {
    navAbout: "परिचय",
    navWhatWeDo: "हम क्या करते हैं",
    navExplore: "एक्सप्लोर करें",
    navWhy: "KarmaFacie क्यों?",
    signIn: "साइन इन / साइन अप",

    heroBadge: "🇮🇳 भारत के नागरिकों के लिए बनाया गया",
    heroTitle1: "जानें। समझें।",
    heroTitle2: "भाग लें।",
    heroDescription:
      "KarmaFacie नागरिकों को यह समझने में मदद करता है कि भारत कैसे काम करता है, उनके आसपास के मुद्दों को समझने में मदद करता है और सार्थक नागरिक भागीदारी के तरीके दिखाता है।",
    exploreNow: "KarmaFacie एक्सप्लोर करें →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KarmaFacie क्या है?",
    aboutTitle:
      "जब नागरिक लोकतंत्र को समझते हैं, तो लोकतंत्र बेहतर काम करता है।",
    aboutDescription:
      "KarmaFacie नागरिक शिक्षा और नागरिक भागीदारी को एक सरल अनुभव में जोड़ता है। सरकार के बारे में जानें, समझें कि व्यवस्थाएँ हमारे दैनिक जीवन को कैसे प्रभावित करती हैं और अपने समुदाय में भाग लेने के व्यावहारिक तरीके खोजें।",

    whatWeDoLabel: "KarmaFacie में आप क्या कर सकते हैं?",
    whatWeDoTitle: "सीखने से कार्रवाई तक।",
    whatWeDoDescription:
      "KarmaFacie एक जागरूक नागरिक की पूरी यात्रा को ध्यान में रखकर बनाया गया है।",

    learnTitle: "सीखें",
    learnDescription:
      "सरल पाठों और इंटरैक्टिव क्विज़ के माध्यम से नागरिक ज्ञान बढ़ाएँ।",
    learnReveal:
      "सरकार, संविधान, चुनाव, पर्यावरण, अर्थव्यवस्था, शिक्षा, स्वास्थ्य सेवा और स्थानीय समस्याओं के बारे में जानें।",

    understandTitle: "समझें",
    understandDescription:
      "नागरिक ज्ञान को उन व्यवस्थाओं और निर्णयों से जोड़ें जो दैनिक जीवन को प्रभावित करते हैं।",
    understandReveal:
      "जिम्मेदारियों, संस्थाओं, स्थानीय शासन, सार्वजनिक व्यवस्थाओं और नागरिक समस्याओं के समाधान की प्रक्रिया को समझें।",

    participateTitle: "भाग लें",
    participateDescription:
      "अपने ज्ञान को सार्थक नागरिक भागीदारी में बदलें।",
    participateReveal:
      "नागरिक समस्याएँ रिपोर्ट करें, उनकी प्रगति देखें, Civic Quests में भाग लें और योगदान के नए तरीके खोजें।",

    howLabel: "KarmaFacie कैसे काम करता है",
    howTitle: "ज्ञान से कार्रवाई तक।",
    howDescription:
      "एक सरल यात्रा जो नागरिकों को जिज्ञासा से जागरूक भागीदारी तक ले जाने के लिए बनाई गई है।",

    step1Title: "सीखें",
    step1Description:
      "नागरिक ज्ञान की मजबूत नींव बनाएँ।",
    step2Title: "समझें",
    step2Description:
      "ज्ञान को वास्तविक व्यवस्थाओं और मुद्दों से जोड़ें।",
    step3Title: "सही रास्ता खोजें",
    step3Description:
      "समझें कि कौन सा प्राधिकरण या नागरिक प्रक्रिया प्रासंगिक है।",
    step4Title: "कार्रवाई करें",
    step4Description:
      "भाग लेने और समस्याएँ रिपोर्ट करने के लिए KarmaFacie के उपकरणों का उपयोग करें।",
    step5Title: "ट्रैक और सत्यापित करें",
    step5Description:
      "जहाँ संभव हो, अपडेट देखें और परिणामों की पुष्टि करें।",

    exploreLabel: "नागरिक जीवन को एक्सप्लोर करें",
    exploreTitle: "कहीं से भी शुरुआत करें। अपनी गति से सीखें।",
    exploreDescription:
      "बिना अकाउंट बनाए KarmaFacie के सभी आठ सीखने वाले क्षेत्रों को एक्सप्लोर करें।",
    exploreAll: "सभी विषय देखें →",

    government: "सरकार और शासन व्यवस्था",
    governmentDescription:
      "केंद्र, राज्य और स्थानीय सरकारों तथा उनकी जिम्मेदारियों को समझें।",

    constitution: "संविधान और लोकतंत्र",
    constitutionDescription:
      "अधिकारों, कर्तव्यों, लोकतंत्र और संविधान के बारे में जानें।",

    elections: "चुनाव और नागरिक भागीदारी",
    electionsDescription:
      "मतदान, मतदाता सूची, EVM, VVPAT और नागरिक भागीदारी को समझें।",

    localIssues: "स्थानीय समस्याएँ",
    localIssuesDescription:
      "रोज़मर्रा की नागरिक समस्याओं और स्थानीय सरकार द्वारा उनके समाधान को समझें।",

    environment: "पर्यावरण",
    environmentDescription:
      "पर्यावरणीय समस्याओं, सतत विकास और नागरिकों की भूमिका को जानें।",

    economy: "अर्थव्यवस्था और रोजगार",
    economyDescription:
      "आर्थिक अवधारणाओं, रोजगार, कर व्यवस्था और सार्वजनिक वित्त को समझें।",

    education: "शिक्षा",
    educationDescription:
      "भारत की शिक्षा व्यवस्था, नीतियों और अवसरों के बारे में जानें।",

    healthcare: "स्वास्थ्य सेवा",
    healthcareDescription:
      "स्वास्थ्य व्यवस्था, संस्थाओं और स्वास्थ्य से जुड़े नागरिक मुद्दों को समझें।",

    issueJourneyLabel: "नागरिक समस्या की यात्रा",
    issueJourneyTitle:
      "नागरिक समस्या दिखी? आगे क्या करना है, जानें।",
    issueJourneyDescription:
      "KarmaFacie नागरिकों को समस्या देखने से लेकर जागरूक कार्रवाई तक जाने में मदद करने के लिए बनाया गया है।",

    issueStep1: "समस्या देखें",
    issueStep2: "फोटो लें",
    issueStep3: "स्थान जोड़ें",
    issueStep4: "समस्या का विवरण दें",
    issueStep5: "सही प्राधिकरण खोजें",
    issueStep6: "आधिकारिक माध्यम का उपयोग करें",
    issueStep7: "ट्रैक और सत्यापित करें",

    reportIssueNow: "नागरिक समस्या रिपोर्ट करें →",

    whyLabel: "KarmaFacie क्यों?",
    whyTitle:
      "नागरिक जीवन को समझना और उसमें आगे बढ़ना आसान बनाना।",

    problemTitle: "समस्या",
    problem1:
      "नागरिक जानकारी समझना कठिन हो सकता है।",
    problem2:
      "संबंधित जानकारी अक्सर अलग-अलग जगहों पर बिखरी होती है।",
    problem3:
      "सरकारी शब्दावली सरल प्रक्रियाओं को भी जटिल बना सकती है।",
    problem4:
      "नागरिकों को यह पता नहीं हो सकता कि स्थानीय समस्या कहाँ रिपोर्ट करनी है।",

    solutionTitle: "KarmaFacie क्या बदलता है",
    solution1:
      "सरल और व्यवस्थित नागरिक शिक्षा।",
    solution2:
      "इंटरैक्टिव पाठ और क्विज़।",
    solution3:
      "स्थानीय समस्या रिपोर्टिंग और प्राधिकरण मार्गदर्शन।",
    solution4:
      "सीखने से भागीदारी तक स्पष्ट यात्रा।",

    trustLabel: "विश्वास और पारदर्शिता",
    trustTitle:
      "नागरिकों के लिए बनाया गया, स्पष्टता को केंद्र में रखकर।",
    trustDescription:
      "KarmaFacie नागरिकों को सीखने और नागरिक प्रक्रियाओं को समझने में मदद करता है तथा अपने उपकरणों और आधिकारिक सरकारी प्रणालियों के बीच स्पष्ट अंतर रखता है।",

    trust1Title: "आधिकारिक जानकारी",
    trust1Description:
      "जहाँ उपलब्ध हो, प्राधिकरण की जानकारी बनाए रखी गई डायरेक्टरी और आधिकारिक स्रोतों से जोड़ी जा सकती है।",

    trust2Title: "नागरिकों के नियंत्रण में रिपोर्ट",
    trust2Description:
      "KarmaFacie के माध्यम से दी गई नागरिक रिपोर्ट और जानकारी पर नागरिकों का नियंत्रण रहता है।",

    trust3Title: "स्पष्ट सीमाएँ",
    trust3Description:
      "KarmaFacie स्वयं को सरकारी प्राधिकरण के रूप में प्रस्तुत नहीं करता और किसी रिपोर्ट को स्वतः आधिकारिक सरकारी सबमिशन नहीं मानता।",

    ctaTitle1: "क्या आप अपनी",
    ctaTitle2: " KarmaFacie यात्रा शुरू करने के लिए तैयार हैं?",
    ctaDescription:
      "पहले नागरिक ज्ञान को एक्सप्लोर करें। प्रगति सेव करने और व्यक्तिगत सुविधाओं का उपयोग करने के लिए तैयार होने पर अकाउंट बनाएँ।",

    footerTagline:
      "सीखें। समझें। भाग लें।",
  },

  mr: {
    navAbout: "परिचय",
    navWhatWeDo: "आम्ही काय करतो",
    navExplore: "एक्सप्लोर करा",
    navWhy: "KarmaFacie का?",
    signIn: "साइन इन / साइन अप",

    heroBadge: "🇮🇳 भारतातील नागरिकांसाठी तयार केलेले",
    heroTitle1: "जाणा. समजून घ्या.",
    heroTitle2: "सहभागी व्हा.",
    heroDescription:
      "KarmaFacie नागरिकांना भारत कसा कार्य करतो हे जाणून घेण्यास, आजूबाजूच्या समस्या समजून घेण्यास आणि अर्थपूर्ण नागरिक सहभागाचे मार्ग शोधण्यास मदत करते.",
    exploreNow: "KarmaFacie एक्सप्लोर करा →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KarmaFacie म्हणजे काय?",
    aboutTitle:
      "नागरिकांना लोकशाही समजली तर लोकशाही अधिक प्रभावीपणे कार्य करते.",
    aboutDescription:
      "KarmaFacie नागरिक शिक्षण आणि नागरिक सहभाग एका सोप्या अनुभवामध्ये एकत्र आणते. सरकारबद्दल शिका, विविध व्यवस्था आपल्या दैनंदिन जीवनावर कसा परिणाम करतात हे समजून घ्या आणि आपल्या समुदायात सहभागी होण्याचे व्यावहारिक मार्ग शोधा.",

    whatWeDoLabel: "KarmaFacie मध्ये तुम्ही काय करू शकता?",
    whatWeDoTitle: "शिकण्यापासून कृतीपर्यंत.",
    whatWeDoDescription:
      "KarmaFacie एका जागरूक नागरिकाच्या संपूर्ण वाटचालीचा विचार करून तयार केले आहे.",

    learnTitle: "शिका",
    learnDescription:
      "सोप्या धड्यांमधून आणि इंटरॅक्टिव्ह क्विझद्वारे तुमचे नागरिक ज्ञान वाढवा.",
    learnReveal:
      "सरकार, संविधान, निवडणुका, पर्यावरण, अर्थव्यवस्था, शिक्षण, आरोग्य सेवा आणि स्थानिक समस्यांबद्दल जाणून घ्या.",

    understandTitle: "समजून घ्या",
    understandDescription:
      "नागरिक ज्ञानाचा आपल्या दैनंदिन जीवनावर परिणाम करणाऱ्या व्यवस्था आणि निर्णयांशी संबंध समजून घ्या.",
    understandReveal:
      "जबाबदाऱ्या, संस्था, स्थानिक शासन, सार्वजनिक व्यवस्था आणि नागरिक समस्यांवर कशा प्रकारे उपाय केले जातात हे समजून घ्या.",

    participateTitle: "सहभागी व्हा",
    participateDescription:
      "तुमच्या ज्ञानाचे अर्थपूर्ण नागरिक सहभागामध्ये रूपांतर करा.",
    participateReveal:
      "नागरी समस्या नोंदवा, त्यांची प्रगती पाहा, Civic Quests मध्ये सहभागी व्हा आणि योगदान देण्याचे नवे मार्ग शोधा.",

    howLabel: "KarmaFacie कसे कार्य करते",
    howTitle: "ज्ञानापासून कृतीपर्यंत.",
    howDescription:
      "नागरिकांना जिज्ञासेपासून जागरूक सहभागापर्यंत नेण्यासाठी तयार केलेली सोपी वाटचाल.",

    step1Title: "शिका",
    step1Description:
      "नागरिक ज्ञानाची मजबूत पायाभरणी करा.",
    step2Title: "समजून घ्या",
    step2Description:
      "ज्ञानाचा वास्तविक व्यवस्था आणि समस्यांशी संबंध समजून घ्या.",
    step3Title: "योग्य मार्ग शोधा",
    step3Description:
      "कोणते प्राधिकरण किंवा नागरी प्रक्रिया संबंधित आहे हे समजून घ्या.",
    step4Title: "कृती करा",
    step4Description:
      "सहभाग घेण्यासाठी आणि समस्या नोंदवण्यासाठी KarmaFacie ची साधने वापरा.",
    step5Title: "ट्रॅक आणि पडताळा",
    step5Description:
      "शक्य असेल तिथे अपडेट्स पाहा आणि परिणामांची पडताळणी करा.",

    exploreLabel: "नागरी जीवन एक्सप्लोर करा",
    exploreTitle: "कुठूनही सुरुवात करा. तुमच्या गतीने शिका.",
    exploreDescription:
      "अकाउंट न बनवता KarmaFacie चे सर्व आठ शिकण्याचे विषय एक्सप्लोर करा.",
    exploreAll: "सर्व विषय एक्सप्लोर करा →",

    government: "सरकार आणि शासनव्यवस्था",
    governmentDescription:
      "केंद्र, राज्य आणि स्थानिक सरकारे व त्यांच्या जबाबदाऱ्या समजून घ्या.",

    constitution: "संविधान आणि लोकशाही",
    constitutionDescription:
      "अधिकार, कर्तव्ये, लोकशाही आणि संविधानाबद्दल जाणून घ्या.",

    elections: "निवडणुका आणि नागरिकांचा सहभाग",
    electionsDescription:
      "मतदान, मतदार यादी, EVM, VVPAT आणि नागरिकांचा सहभाग समजून घ्या.",

    localIssues: "स्थानिक समस्या",
    localIssuesDescription:
      "दैनंदिन नागरी समस्या आणि स्थानिक सरकार त्यावर कसे उपाय करते हे समजून घ्या.",

    environment: "पर्यावरण",
    environmentDescription:
      "पर्यावरणीय समस्या, शाश्वतता आणि नागरिकांची भूमिका जाणून घ्या.",

    economy: "अर्थव्यवस्था आणि रोजगार",
    economyDescription:
      "आर्थिक संकल्पना, रोजगार, करव्यवस्था आणि सार्वजनिक वित्त समजून घ्या.",

    education: "शिक्षण",
    educationDescription:
      "भारताची शिक्षण व्यवस्था, धोरणे आणि उपलब्ध संधींबद्दल जाणून घ्या.",

    healthcare: "आरोग्य सेवा",
    healthcareDescription:
      "आरोग्य व्यवस्था, संस्था आणि आरोग्याशी संबंधित नागरी समस्या समजून घ्या.",

    issueJourneyLabel: "नागरी समस्या वाटचाल",
    issueJourneyTitle:
      "नागरी समस्या दिसली? पुढे काय करायचे ते जाणून घ्या.",
    issueJourneyDescription:
      "KarmaFacie नागरिकांना समस्या दिसल्यापासून माहितीपूर्ण कृतीपर्यंत जाण्यास मदत करण्यासाठी तयार केले आहे.",

    issueStep1: "समस्या दिसली",
    issueStep2: "फोटो घ्या",
    issueStep3: "स्थान जोडा",
    issueStep4: "समस्येचे वर्णन करा",
    issueStep5: "योग्य प्राधिकरण शोधा",
    issueStep6: "अधिकृत माध्यम वापरा",
    issueStep7: "ट्रॅक आणि पडताळा",

    reportIssueNow: "नागरी समस्या नोंदवा →",

    whyLabel: "KarmaFacie का?",
    whyTitle:
      "नागरी जीवन समजून घेणे आणि त्यात मार्गक्रमण करणे सोपे करणे.",

    problemTitle: "आव्हान",
    problem1:
      "नागरी माहिती समजणे कठीण असू शकते.",
    problem2:
      "संबंधित माहिती अनेक वेगवेगळ्या ठिकाणी विखुरलेली असू शकते.",
    problem3:
      "सरकारी शब्दावलीमुळे साध्या प्रक्रियाही गुंतागुंतीच्या वाटू शकतात.",
    problem4:
      "स्थानिक समस्या कुठे नोंदवायची हे नागरिकांना माहीत नसू शकते.",

    solutionTitle: "KarmaFacie काय बदलते",
    solution1:
      "सोपे आणि व्यवस्थित नागरिक शिक्षण.",
    solution2:
      "इंटरॅक्टिव्ह धडे आणि क्विझ.",
    solution3:
      "स्थानिक समस्या नोंदणी आणि प्राधिकरण मार्गदर्शन.",
    solution4:
      "शिकण्यापासून सहभागापर्यंत स्पष्ट वाटचाल.",

    trustLabel: "विश्वास आणि पारदर्शकता",
    trustTitle:
      "नागरिकांसाठी तयार केलेले, स्पष्टतेला केंद्रस्थानी ठेवून.",
    trustDescription:
      "KarmaFacie नागरिकांना शिकण्यास आणि नागरी प्रक्रियेत मार्गदर्शन मिळवण्यास मदत करते आणि स्वतःच्या साधनांमध्ये व अधिकृत सरकारी प्रणालींमध्ये स्पष्ट फरक ठेवते.",

    trust1Title: "अधिकृत माहिती",
    trust1Description:
      "जिथे उपलब्ध असेल तिथे प्राधिकरणाची माहिती देखभाल केलेल्या डायरेक्टरी आणि अधिकृत स्रोतांशी जोडली जाऊ शकते.",

    trust2Title: "नागरिकांच्या नियंत्रणातील नोंदी",
    trust2Description:
      "KarmaFacie द्वारे दिलेल्या नागरी नोंदी आणि माहितीवर नागरिकांचे नियंत्रण राहते.",

    trust3Title: "स्पष्ट मर्यादा",
    trust3Description:
      "KarmaFacie स्वतःला सरकारी प्राधिकरण म्हणून सादर करत नाही आणि कोणतीही नोंद आपोआप अधिकृत सरकारी सबमिशन मानत नाही.",

    ctaTitle1: "तुमची",
    ctaTitle2: " KarmaFacie वाटचाल सुरू करण्यास तयार आहात?",
    ctaDescription:
      "सुरुवातीला नागरिक ज्ञान एक्सप्लोर करा. तुमची प्रगती जतन करण्यासाठी आणि वैयक्तिक सुविधा वापरण्यासाठी तयार झाल्यावर अकाउंट तयार करा.",

    footerTagline:
      "शिका. समजून घ्या. सहभागी व्हा.",
  },
};

const topics = [
  {
    icon: "🏛️",
    path: "/explore/government",
    titleKey: "government",
    descriptionKey: "governmentDescription",
  },
  {
    icon: "📜",
    path: "/explore/constitution",
    titleKey: "constitution",
    descriptionKey: "constitutionDescription",
  },
  {
    icon: "🗳️",
    path: "/explore/elections",
    titleKey: "elections",
    descriptionKey: "electionsDescription",
  },
  {
    icon: "🏙️",
    path: "/explore/local-issues",
    titleKey: "localIssues",
    descriptionKey: "localIssuesDescription",
  },
  {
    icon: "🌱",
    path: "/explore/environment",
    titleKey: "environment",
    descriptionKey: "environmentDescription",
  },
  {
    icon: "💼",
    path: "/explore/economy",
    titleKey: "economy",
    descriptionKey: "economyDescription",
  },
  {
    icon: "🎓",
    path: "/explore/education",
    titleKey: "education",
    descriptionKey: "educationDescription",
  },
  {
    icon: "🏥",
    path: "/explore/healthcare",
    titleKey: "healthcare",
    descriptionKey: "healthcareDescription",
  },
];

const journeyCards: {
  key: JourneyKey;
  icon: string;
  titleKey: "learnTitle" | "understandTitle" | "participateTitle";
  descriptionKey:
    | "learnDescription"
    | "understandDescription"
    | "participateDescription";
  revealKey:
    | "learnReveal"
    | "understandReveal"
    | "participateReveal";
}[] = [
  {
    key: "learn",
    icon: "📚",
    titleKey: "learnTitle",
    descriptionKey: "learnDescription",
    revealKey: "learnReveal",
  },
  {
    key: "understand",
    icon: "🧭",
    titleKey: "understandTitle",
    descriptionKey: "understandDescription",
    revealKey: "understandReveal",
  },
  {
    key: "participate",
    icon: "🤝",
    titleKey: "participateTitle",
    descriptionKey: "participateDescription",
    revealKey: "participateReveal",
  },
];

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = content[language];
  const [activeJourney, setActiveJourney] = useState<JourneyKey | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="kf-site min-h-screen overflow-x-hidden">
      <div className="kf-background" aria-hidden="true">
        <div className="kf-glow kf-glow-warm" />
        <div className="kf-glow kf-glow-blue" />
        <div className="kf-paper-shape kf-paper-left" />
        <div className="kf-paper-shape kf-paper-right" />
      </div>

      <nav className="kf-nav">
        <div className="kf-container kf-nav-inner">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="kf-logo"
            aria-label="KarmaFacie home"
          >
            <span>Karma</span><em>Facie</em>
          </button>

          <div className="kf-nav-links">
            <button type="button" onClick={() => scrollToSection("about")} className="kf-nav-link">{text.navAbout}</button>
            <button type="button" onClick={() => scrollToSection("what-we-do")} className="kf-nav-link">{text.navWhatWeDo}</button>
            <button type="button" onClick={() => scrollToSection("explore")} className="kf-nav-link">{text.navExplore}</button>
            <button type="button" onClick={() => scrollToSection("why")} className="kf-nav-link">{text.navWhy}</button>
          </div>

          <div className="kf-nav-actions">
            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="kf-button kf-button-primary"
            >
              {text.signIn} <span aria-hidden="true">↗</span>
            </button>
            <div className="kf-language-wrap"><LanguageSwitcher /></div>
          </div>
        </div>
      </nav>

      <section className="kf-hero">
        <div className="kf-container kf-hero-grid">
          <div className="kf-hero-copy">
            <div className="kf-badge">🇮🇳 <span>{text.heroBadge.replace("🇮🇳 ", "")}</span></div>
            <h1 className="kf-hero-title">
              <span>{text.heroTitle1}</span>
              <em>{text.heroTitle2}</em>
            </h1>
            <p className="kf-hero-description">{text.heroDescription}</p>
            <div className="kf-hero-actions">
              <button type="button" onClick={() => router.push("/explore")} className="kf-button kf-button-primary kf-button-lg">
                {text.exploreNow} <span aria-hidden="true">→</span>
              </button>
              <button type="button" onClick={() => router.push("/auth")} className="kf-button kf-button-ghost kf-button-lg">
                {text.signInUp}
              </button>
            </div>
            <div className="kf-scroll-cue"><span>↓</span> SCROLL TO EXPLORE</div>
          </div>

          <div className="kf-hero-visual">
            <div className="kf-hero-orb kf-hero-orb-one" />
            <div className="kf-hero-orb kf-hero-orb-two" />
            <div className="kf-hero-image-frame">
              <img src="/images/kf-hero.jpg" alt="India Gate at sunrise" />
            </div>
            <div className="kf-hero-caption">
              <span>PEOPLE</span>
              <span>KNOWLEDGE</span>
              <span>ACTION</span>
              <strong>A STRONGER INDIA</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="what-we-do" className="kf-section kf-section-soft">
        <div className="kf-container">
          <div className="kf-section-intro">
            <div>
              <p className="kf-eyebrow">{text.whatWeDoLabel}</p>
              <h2 className="kf-section-title">From learning<br />to a stronger India.</h2>
            </div>
            <p>{text.whatWeDoDescription}</p>
          </div>

          <div className="kf-feature-grid">
            {[
              { key: "learn" as JourneyKey, image: "/images/kf-learn.jpg", titleKey: "learnTitle" as const, descriptionKey: "learnDescription" as const, accent: "warm" },
              { key: "understand" as JourneyKey, image: "/images/kf-understand.jpg", titleKey: "understandTitle" as const, descriptionKey: "understandDescription" as const, accent: "blue" },
              { key: "participate" as JourneyKey, image: "/images/kf-participate.jpg", titleKey: "participateTitle" as const, descriptionKey: "participateDescription" as const, accent: "green" },
            ].map((card) => (
              <button
                key={card.key}
                type="button"
                onMouseEnter={() => setActiveJourney(card.key)}
                onMouseLeave={() => setActiveJourney(null)}
                onFocus={() => setActiveJourney(card.key)}
                onClick={() => setActiveJourney(activeJourney === card.key ? null : card.key)}
                className={`kf-feature-card kf-card-${card.accent} ${activeJourney === card.key ? "is-active" : ""}`}
              >
                <div className="kf-feature-image">
                  <img src={card.image} alt="" />
                </div>
                <div className="kf-feature-overlay" />
                <div className="kf-feature-content">
                  <span className="kf-feature-icon">{card.key === "learn" ? "⌑" : card.key === "understand" ? "◉" : "◎"}</span>
                  <div>
                    <h3>{text[card.titleKey]}</h3>
                    <p>{text[card.descriptionKey]}</p>
                  </div>
                  <span className="kf-feature-arrow">↗</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="kf-section">
        <div className="kf-container kf-split-section">
          <div className="kf-copy-block">
            <p className="kf-eyebrow">{text.aboutLabel}</p>
            <h2 className="kf-section-title">{text.aboutTitle}</h2>
            <p className="kf-copy">{text.aboutDescription}</p>
          </div>
          <div className="kf-quote-card">
            <span>“</span>
            <p>Knowledge gives citizens context. Participation gives that knowledge a purpose.</p>
            <small>KARMAFACIE</small>
          </div>
        </div>
      </section>

      <section id="explore" className="kf-section kf-section-soft">
        <div className="kf-container">
          <p className="kf-eyebrow">{text.exploreLabel}</p>
          <div className="kf-section-heading-row">
            <h2 className="kf-section-title">{text.exploreTitle}</h2>
            <p>{text.exploreDescription}</p>
          </div>
          <div className="kf-topic-grid">
            {topics.map((topic, index) => (
              <button key={topic.path} type="button" onClick={() => router.push(topic.path)} className="kf-topic-card">
                <span className="kf-topic-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="kf-topic-icon">{topic.icon}</span>
                <span className="kf-topic-title">{text[topic.titleKey as keyof typeof text] as string}</span>
                <span className="kf-topic-arrow">↗</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="kf-section">
        <div className="kf-container kf-impact-panel">
          <div className="kf-impact-image"><img src="/images/kf-participate.jpg" alt="Citizen using a phone to document a civic issue" /></div>
          <div className="kf-impact-copy">
            <p className="kf-eyebrow">REAL ISSUES. REAL PEOPLE. REAL CHANGE.</p>
            <h2 className="kf-section-title">Civic action creates a stronger India.</h2>
            <p className="kf-copy">{text.issueJourneyDescription}</p>
            <button type="button" onClick={() => router.push("/report-issue")} className="kf-button kf-button-primary kf-button-lg">{text.reportIssueNow} <span>→</span></button>
          </div>
        </div>
      </section>

      <section id="why" className="kf-section kf-section-soft">
        <div className="kf-container">
          <p className="kf-eyebrow">{text.whyLabel}</p>
          <h2 className="kf-section-title kf-why-title">{text.whyTitle}</h2>
          <div className="kf-why-grid">
            <div className="kf-why-card"><span>01</span><h3>{text.problemTitle}</h3><p>{[text.problem1, text.problem2, text.problem3, text.problem4].join(" ")}</p></div>
            <div className="kf-why-card kf-why-card-accent"><span>02</span><h3>{text.solutionTitle}</h3><p>{[text.solution1, text.solution2, text.solution3, text.solution4].join(" ")}</p></div>
          </div>
        </div>
      </section>

      <section className="kf-section">
        <div className="kf-container kf-trust-section">
          <div>
            <p className="kf-eyebrow">{text.trustLabel}</p>
            <h2 className="kf-section-title">{text.trustTitle}</h2>
          </div>
          <div className="kf-trust-copy"><p className="kf-copy">{text.trustDescription}</p><div className="kf-trust-pills"><span>{text.trust1Title}</span><span>{text.trust2Title}</span><span>{text.trust3Title}</span></div></div>
        </div>
      </section>

      <section className="kf-cta-section">
        <div className="kf-container kf-cta-card">
          <p className="kf-eyebrow">KarmaFacie</p>
          <h2 className="kf-cta-title">{text.ctaTitle1}<span>{text.ctaTitle2}</span></h2>
          <p>{text.ctaDescription}</p>
          <div className="kf-hero-actions">
            <button type="button" onClick={() => router.push("/explore")} className="kf-button kf-button-primary kf-button-lg">{text.exploreNow} <span>→</span></button>
            <button type="button" onClick={() => router.push("/auth")} className="kf-button kf-button-ghost kf-button-lg">{text.signInUp}</button>
          </div>
        </div>
      </section>

      <footer className="kf-footer">
        <div className="kf-container kf-footer-inner">
          <div><div className="kf-logo"><span>Karma</span><em>Facie</em></div><p>{text.footerTagline}</p></div>
          <p>© {new Date().getFullYear()} KarmaFacie India</p>
        </div>
      </footer>
    </main>
  );
}
