"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type JourneyKey = "learn" | "understand" | "participate";

const content: Record<
  Language,
  {
    navAbout: string;
    navWhatWeDo: string;
    navExplore: string;
    navWhy: string;
    navLeagues: string;
    signIn: string;
    signUp: string;
    signOut: string;
    dashboard: string;

    heroBadge: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDescription: string;
    exploreNow: string;
    signInUp: string;

    aboutLabel: string;
    aboutTagline: string;
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

    journeyFlowLabel: string;
    journeyFlowTitle: string;
    journeyFlowDescription: string;
    journeyFlow: Array<{
      title: string;
      description: string;
      icon: string;
    }>;

    featureUniverseLabel: string;
    featureUniverseTitle: string;
    featureUniverseDescription: string;
    featureGroups: Array<{
      title: string;
      description: string;
      items: string[];
      icon: string;
    }>;

    futureLabel: string;
    futureTitle: string;
    futureDescription: string;
    futureFeatures: string[];

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

    leagueLabel: string;
    leagueTitle: string;
    leagueDescription: string;
    leagueFeature1Title: string;
    leagueFeature1Description: string;
    leagueFeature2Title: string;
    leagueFeature2Description: string;
    leagueFeature3Title: string;
    leagueFeature3Description: string;
    leagueAction: string;

    footerTagline: string;
  }
> = {
  en: {
    navAbout: "About",
    navWhatWeDo: "What We Do",
    navExplore: "Explore",
    navWhy: "Why KrutBharat?",
    navLeagues: "Civic Leagues",
    signIn: "Sign in / Sign up",
    signUp: "Sign up",
    signOut: "Log out",
    dashboard: "Dashboard",

    heroBadge: "🇮🇳 Built for citizens of India",
    heroTitle1: "Know. Understand.",
    heroTitle2: "Participate.",
    heroDescription:
      "KrutBharat helps citizens learn how India works, understand the issues around them and take meaningful civic action.",
    exploreNow: "Explore KrutBharat →",
    signInUp: "Sign in / Sign up",

    aboutLabel: "What is KrutBharat?",
    aboutTagline: "Know India. Think Civic. Shape Its Future.",
    aboutTitle:
      "Democracy works better when citizens understand it.",
    aboutDescription:
      "KrutBharat brings civic learning and civic participation together in one simple experience. Learn about government, understand how systems affect everyday life, and discover practical ways to participate in your community.",

    whatWeDoLabel: "What can you do with KrutBharat?",
    whatWeDoTitle: "From learning to action.",
    whatWeDoDescription:
      "KrutBharat is designed around the complete journey of an informed citizen.",

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

    howLabel: "How KrutBharat Works",
    howTitle: "From learning to lasting civic impact.",
    howDescription:
      "KrutBharat connects civic knowledge with real participation, verified contribution and a growing civic record.",

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
      "Use KrutBharat tools to participate, report issues and complete civic missions.",
    step5Title: "Track & verify",
    step5Description:
      "Follow updates, submit evidence and verify outcomes where possible.",

    journeyFlowLabel: "THE KRUTBHARAT JOURNEY",
    journeyFlowTitle: "Discover → Learn → Understand → Act → Show Proof → Verify → Earn → Build & Belong → Repeat",
    journeyFlowDescription:
      "A citizen can move through KrutBharat at their own pace — from learning about India to taking real civic action and building a record of verified participation.",
    journeyFlow: [
      {
        title: "Discover",
        description: "Explore Know India, State Spotlight and civic topics.",
        icon: "🇮🇳",
      },
      {
        title: "Learn",
        description: "Build knowledge through Civic Learning and Civic Quests.",
        icon: "📚",
      },
      {
        title: "Understand",
        description: "Connect issues with institutions, systems and the right civic path.",
        icon: "💡",
      },
      {
        title: "Act",
        description: "Report issues, use official pathways and complete Civic Missions.",
        icon: "✋",
      },
      {
        title: "Show Proof",
        description: "Add photos, evidence and Before / After impact.",
        icon: "📸",
      },
      {
        title: "Verify",
        description: "Actions can move through admin and eligible community review.",
        icon: "✓",
      },
      {
        title: "Earn & Track",
        description: "Verified participation contributes to Karma Credits and impact records.",
        icon: "✨",
      },
      {
        title: "Build & Belong",
        description: "Grow your Civic Passport, join Leagues and teams, and share civic progress.",
        icon: "🏆",
      },
    ],

    featureUniverseLabel: "THE KRUTBHARAT PLATFORM",
    featureUniverseTitle: "Everything connects to the same civic journey.",
    featureUniverseDescription:
      "KrutBharat brings learning, civic services, real-world action, verification, impact and community participation into one connected experience.",
    featureGroups: [
      {
        title: "Learn & Discover",
        description: "Build context before you act.",
        icon: "📖",
        items: [
          "Know India + interactive State Spotlight",
          "Civic Learning with structured lessons",
          "Civic Quests and interactive quizzes",
          "Government, Constitution, Elections, Environment, Economy, Education, Healthcare and Local Issues",
        ],
      },
      {
        title: "Understand Civic Issues",
        description: "Make civic problems easier to understand and navigate.",
        icon: "🧭",
        items: [
          "Explore civic topics and public systems",
          "Authority Directory and responsibility guidance",
          "Report an Issue with location, description and evidence",
          "My Civic Issues and issue status tracking",
        ],
      },
      {
        title: "Take Real Civic Action",
        description: "Move from information to participation.",
        icon: "🤝",
        items: [
          "Civic Missions for practical civic activities",
          "Submission Gateway for structured submissions",
          "Smart Handoff toward the appropriate official channel",
          "Civic Leagues and team-based participation",
        ],
      },
      {
        title: "Show Proof & Verify",
        description: "Make civic contribution visible and reviewable.",
        icon: "🔎",
        items: [
          "Photo and supporting evidence submission",
          "Before / After Impact records",
          "Admin verification and impact review",
          "Community Verification and Peer Review",
        ],
      },
      {
        title: "Karma & Civic Progress",
        description: "Keep a record of what you contribute.",
        icon: "✨",
        items: [
          "Karma Credits ledger and verified rewards",
          "My Impact and contribution history",
          "Civic-Sense Scoreboard and league standings",
          "Civic Passport for a growing personal civic record",
        ],
      },
      {
        title: "Community & Competition",
        description: "Make civic participation a shared experience.",
        icon: "👥",
        items: [
          "Civic Leagues, teams and shared missions",
          "Leaderboards and team progress",
          "Community activity and civic achievements",
          "Shareable mission and impact moments",
        ],
      },
    ],

    futureLabel: "GROWING WITH KRUTBHARAT",
    futureTitle: "The civic journey keeps expanding.",
    futureDescription:
      "Planned layers can deepen progression and personalization as KrutBharat grows.",
    futureFeatures: [
      "XP and levels",
      "Badges, streaks and richer progression",
      "Public / private Civic Passport sharing",
      "Notifications and reminders",
      "Search, filtering and local personalization",
      "Deeper impact analytics",
    ],

    exploreLabel: "Explore Civic Life",
    exploreTitle: "Start anywhere. Learn at your pace.",
    exploreDescription:
      "Explore all eight KrutBharat learning areas without creating an account.",
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
      "KrutBharat helps you document the issue, identify the relevant authority, prepare your report and hand it off to the appropriate official channel.",

    issueStep1: "See a problem",
    issueStep2: "Document it",
    issueStep3: "Find the right authority",
    issueStep4: "Prepare your report",
    issueStep5: "Smart Handoff",
    issueStep6: "Submit officially",
    issueStep7: "Track & verify",

    reportIssueNow: "Report a Civic Issue →",

    whyLabel: "Why KrutBharat?",
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

    solutionTitle: "What KrutBharat changes",
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
      "KrutBharat helps citizens learn and navigate civic processes while clearly distinguishing its own tools from official government systems.",

    trust1Title: "Official information",
    trust1Description:
      "Authority information can be linked to maintained directory records and official sources where available.",

    trust2Title: "Citizen-controlled reports",
    trust2Description:
      "Citizens remain in control of the civic reports and information they provide through KrutBharat.",

    trust3Title: "Clear boundaries",
    trust3Description:
      "KrutBharat does not present itself as a government authority or automatically treat a report as an official government submission.",

    ctaTitle1: "Ready to start your",
    ctaTitle2: " KrutBharat journey?",
    ctaDescription:
      "Explore civic knowledge first. Create an account when you're ready to save your progress and use personalized features.",

    leagueLabel: "Civic Leagues",
    leagueTitle: "Turn civic action into a team experience.",
    leagueDescription:
      "Join a local civic team, complete real-world missions, earn Karma Credits and see verified contributions reflected on the Civic-Sense Scoreboard.",
    leagueFeature1Title: "Join a team",
    leagueFeature1Description:
      "Become part of a local civic team and contribute alongside other participants.",
    leagueFeature2Title: "Complete real-world missions",
    leagueFeature2Description:
      "Take part in practical civic activities and submit evidence for verification.",
    leagueFeature3Title: "Earn & compete",
    leagueFeature3Description:
      "Verified contributions earn Karma Credits and contribute to team standings.",
    leagueAction: "Explore Civic Leagues →",

    footerTagline:
      "Know India. Think Civic. Shape Its Future.",
  },

  hi: {
    navAbout: "परिचय",
    navWhatWeDo: "हम क्या करते हैं",
    navExplore: "एक्सप्लोर करें",
    navWhy: "KrutBharat क्यों?",
    navLeagues: "सिविक लीग्स",
    signIn: "साइन इन / साइन अप",
    signUp: "साइन अप",
    signOut: "लॉग आउट",
    dashboard: "डैशबोर्ड",

    heroBadge: "🇮🇳 भारत के नागरिकों के लिए बनाया गया",
    heroTitle1: "जानें। समझें।",
    heroTitle2: "भाग लें।",
    heroDescription:
      "KrutBharat नागरिकों को यह समझने में मदद करता है कि भारत कैसे काम करता है, उनके आसपास के मुद्दों को समझने में मदद करता है और सार्थक नागरिक भागीदारी के तरीके दिखाता है।",
    exploreNow: "KrutBharat एक्सप्लोर करें →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KrutBharat क्या है?",
    aboutTagline: "Know India. Think Civic. Shape Its Future.",
    aboutTitle:
      "जब नागरिक लोकतंत्र को समझते हैं, तो लोकतंत्र बेहतर काम करता है।",
    aboutDescription:
      "KrutBharat नागरिक शिक्षा और नागरिक भागीदारी को एक सरल अनुभव में जोड़ता है। सरकार के बारे में जानें, समझें कि व्यवस्थाएँ हमारे दैनिक जीवन को कैसे प्रभावित करती हैं और अपने समुदाय में भाग लेने के व्यावहारिक तरीके खोजें।",

    whatWeDoLabel: "KrutBharat में आप क्या कर सकते हैं?",
    whatWeDoTitle: "सीखने से कार्रवाई तक।",
    whatWeDoDescription:
      "KrutBharat एक जागरूक नागरिक की पूरी यात्रा को ध्यान में रखकर बनाया गया है।",

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

    howLabel: "KrutBharat कैसे काम करता है",
    howTitle: "सीखने से स्थायी नागरिक प्रभाव तक।",
    howDescription:
      "KrutBharat नागरिक ज्ञान को वास्तविक भागीदारी, सत्यापित योगदान और एक बढ़ते नागरिक रिकॉर्ड से जोड़ता है।",

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
      "भाग लेने, समस्याएँ रिपोर्ट करने और नागरिक मिशन पूरे करने के लिए KrutBharat के उपकरणों का उपयोग करें।",
    step5Title: "ट्रैक और सत्यापित करें",
    step5Description:
      "अपडेट देखें, प्रमाण जमा करें और जहाँ संभव हो परिणामों की पुष्टि करें।",

    journeyFlowLabel: "KRUTBHARAT की यात्रा",
    journeyFlowTitle: "खोजें → सीखें → समझें → कार्रवाई करें → प्रमाण दिखाएँ → सत्यापित करें → अर्जित करें → अपना रिकॉर्ड बनाएँ → दोहराएँ",
    journeyFlowDescription:
      "KrutBharat में नागरिक अपनी गति से आगे बढ़ सकता है — भारत को जानने से लेकर वास्तविक नागरिक कार्रवाई करने और सत्यापित भागीदारी का रिकॉर्ड बनाने तक।",
    journeyFlow: [
      {
        title: "खोजें",
        description: "Know India, State Spotlight और नागरिक विषयों को एक्सप्लोर करें।",
        icon: "🇮🇳",
      },
      {
        title: "सीखें",
        description: "Civic Learning और Civic Quests के माध्यम से ज्ञान बढ़ाएँ।",
        icon: "📚",
      },
      {
        title: "समझें",
        description: "मुद्दों को संस्थाओं, व्यवस्थाओं और सही नागरिक मार्ग से जोड़ें।",
        icon: "💡",
      },
      {
        title: "कार्रवाई करें",
        description: "समस्याएँ रिपोर्ट करें, आधिकारिक रास्तों का उपयोग करें और Civic Missions पूरे करें।",
        icon: "✋",
      },
      {
        title: "प्रमाण दिखाएँ",
        description: "फोटो, प्रमाण और Before / After Impact जोड़ें।",
        icon: "📸",
      },
      {
        title: "सत्यापित करें",
        description: "कार्रवाई एडमिन और पात्र समुदाय समीक्षा से आगे बढ़ सकती है।",
        icon: "✓",
      },
      {
        title: "अर्जित करें और ट्रैक करें",
        description: "सत्यापित भागीदारी Karma Credits और प्रभाव रिकॉर्ड में जुड़ती है।",
        icon: "✨",
      },
      {
        title: "अपना रिकॉर्ड बनाएँ",
        description: "Civic Passport बढ़ाएँ, Leagues और टीमों से जुड़ें और अपनी नागरिक प्रगति साझा करें।",
        icon: "🏆",
      },
    ],

    featureUniverseLabel: "KRUTBHARAT प्लेटफ़ॉर्म",
    featureUniverseTitle: "हर सुविधा एक ही नागरिक यात्रा से जुड़ी है।",
    featureUniverseDescription:
      "KrutBharat सीखने, नागरिक सेवाओं, वास्तविक कार्रवाई, सत्यापन, प्रभाव और समुदाय की भागीदारी को एक जुड़े हुए अनुभव में लाता है।",
    featureGroups: [
      {
        title: "सीखें और खोजें",
        description: "कार्रवाई से पहले संदर्भ बनाएँ।",
        icon: "📖",
        items: [
          "Know India + इंटरैक्टिव State Spotlight",
          "संरचित पाठों वाला Civic Learning",
          "Civic Quests और इंटरैक्टिव क्विज़",
          "सरकार, संविधान, चुनाव, पर्यावरण, अर्थव्यवस्था, शिक्षा, स्वास्थ्य सेवा और स्थानीय समस्याएँ",
        ],
      },
      {
        title: "नागरिक समस्याएँ समझें",
        description: "नागरिक समस्याओं को समझना और उनमें आगे बढ़ना आसान बनाएँ।",
        icon: "🧭",
        items: [
          "नागरिक विषयों और सार्वजनिक व्यवस्थाओं को एक्सप्लोर करें",
          "Authority Directory और जिम्मेदारी संबंधी मार्गदर्शन",
          "स्थान, विवरण और प्रमाण के साथ समस्या रिपोर्ट करें",
          "My Civic Issues और स्थिति ट्रैकिंग",
        ],
      },
      {
        title: "वास्तविक नागरिक कार्रवाई करें",
        description: "जानकारी से भागीदारी की ओर बढ़ें।",
        icon: "🤝",
        items: [
          "व्यावहारिक नागरिक गतिविधियों के लिए Civic Missions",
          "संरचित सबमिशन के लिए Submission Gateway",
          "उचित आधिकारिक चैनल तक Smart Handoff",
          "टीम आधारित भागीदारी के लिए Civic Leagues",
        ],
      },
      {
        title: "प्रमाण दिखाएँ और सत्यापित करें",
        description: "नागरिक योगदान को स्पष्ट और समीक्षा योग्य बनाएँ।",
        icon: "🔎",
        items: [
          "फोटो और सहायक प्रमाण जमा करना",
          "Before / After Impact रिकॉर्ड",
          "Admin Verification और Impact Review",
          "Community Verification और Peer Review",
        ],
      },
      {
        title: "Karma और नागरिक प्रगति",
        description: "आपके योगदान का रिकॉर्ड बनाए रखें।",
        icon: "✨",
        items: [
          "Karma Credits ledger और सत्यापित rewards",
          "My Impact और योगदान का इतिहास",
          "Civic-Sense Scoreboard और league standings",
          "बढ़ते व्यक्तिगत नागरिक रिकॉर्ड के लिए Civic Passport",
        ],
      },
      {
        title: "समुदाय और प्रतियोगिता",
        description: "नागरिक भागीदारी को साझा अनुभव बनाएँ।",
        icon: "👥",
        items: [
          "Civic Leagues, टीमें और साझा मिशन",
          "Leaderboards और टीम प्रगति",
          "Community activity और civic achievements",
          "शेयर किए जा सकने वाले mission और impact moments",
        ],
      },
    ],

    futureLabel: "KRUTBHARAT के साथ आगे",
    futureTitle: "नागरिक यात्रा लगातार बढ़ती रहेगी।",
    futureDescription:
      "जैसे-जैसे KrutBharat विकसित होगा, progression और personalization की नई परतें जुड़ सकती हैं।",
    futureFeatures: [
      "XP और levels",
      "Badges, streaks और richer progression",
      "Public / private Civic Passport sharing",
      "Notifications और reminders",
      "Search, filtering और local personalization",
      "गहरा impact analytics",
    ],

    exploreLabel: "नागरिक जीवन को एक्सप्लोर करें",
    exploreTitle: "कहीं से भी शुरुआत करें। अपनी गति से सीखें।",
    exploreDescription:
      "बिना अकाउंट बनाए KrutBharat के सभी आठ सीखने वाले क्षेत्रों को एक्सप्लोर करें।",
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
      "KrutBharat समस्या को दर्ज करने, सही प्राधिकरण पहचानने, रिपोर्ट तैयार करने और उसे उचित आधिकारिक माध्यम तक पहुँचाने में मदद करता है।",

    issueStep1: "समस्या देखें",
    issueStep2: "समस्या दर्ज करें",
    issueStep3: "सही प्राधिकरण खोजें",
    issueStep4: "रिपोर्ट तैयार करें",
    issueStep5: "Smart Handoff",
    issueStep6: "आधिकारिक रूप से जमा करें",
    issueStep7: "ट्रैक और सत्यापित करें",

    reportIssueNow: "नागरिक समस्या रिपोर्ट करें →",

    whyLabel: "KrutBharat क्यों?",
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

    solutionTitle: "KrutBharat क्या बदलता है",
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
      "KrutBharat नागरिकों को सीखने और नागरिक प्रक्रियाओं को समझने में मदद करता है तथा अपने उपकरणों और आधिकारिक सरकारी प्रणालियों के बीच स्पष्ट अंतर रखता है।",

    trust1Title: "आधिकारिक जानकारी",
    trust1Description:
      "जहाँ उपलब्ध हो, प्राधिकरण की जानकारी बनाए रखी गई डायरेक्टरी और आधिकारिक स्रोतों से जोड़ी जा सकती है।",

    trust2Title: "नागरिकों के नियंत्रण में रिपोर्ट",
    trust2Description:
      "KrutBharat के माध्यम से दी गई नागरिक रिपोर्ट और जानकारी पर नागरिकों का नियंत्रण रहता है।",

    trust3Title: "स्पष्ट सीमाएँ",
    trust3Description:
      "KrutBharat स्वयं को सरकारी प्राधिकरण के रूप में प्रस्तुत नहीं करता और किसी रिपोर्ट को स्वतः आधिकारिक सरकारी सबमिशन नहीं मानता।",

    ctaTitle1: "क्या आप अपनी",
    ctaTitle2: " KrutBharat यात्रा शुरू करने के लिए तैयार हैं?",
    ctaDescription:
      "पहले नागरिक ज्ञान को एक्सप्लोर करें। प्रगति सेव करने और व्यक्तिगत सुविधाओं का उपयोग करने के लिए तैयार होने पर अकाउंट बनाएँ।",

    leagueLabel: "सिविक लीग्स",
    leagueTitle: "नागरिक कार्रवाई को टीम अनुभव में बदलें।",
    leagueDescription:
      "एक स्थानीय नागरिक टीम से जुड़ें, वास्तविक दुनिया के मिशन पूरे करें, Karma Credits अर्जित करें और सत्यापित योगदानों को Civic-Sense Scoreboard पर देखें।",
    leagueFeature1Title: "एक टीम से जुड़ें",
    leagueFeature1Description:
      "एक स्थानीय नागरिक टीम का हिस्सा बनें और अन्य प्रतिभागियों के साथ योगदान करें।",
    leagueFeature2Title: "वास्तविक नागरिक मिशन पूरे करें",
    leagueFeature2Description:
      "व्यावहारिक नागरिक गतिविधियों में भाग लें और सत्यापन के लिए प्रमाण जमा करें।",
    leagueFeature3Title: "अर्जित करें और प्रतिस्पर्धा करें",
    leagueFeature3Description:
      "सत्यापित योगदानों से Karma Credits अर्जित होते हैं और टीम की स्थिति में योगदान मिलता है।",
    leagueAction: "सिविक लीग्स देखें →",

    footerTagline:
      "Know India. Think Civic. Shape Its Future.",
  },

  mr: {
    navAbout: "परिचय",
    navWhatWeDo: "आम्ही काय करतो",
    navExplore: "एक्सप्लोर करा",
    navWhy: "KrutBharat का?",
    navLeagues: "सिविक लीग्स",
    signIn: "साइन इन / साइन अप",
    signUp: "साइन अप",
    signOut: "लॉग आउट",
    dashboard: "डॅशबोर्ड",

    heroBadge: "🇮🇳 भारतातील नागरिकांसाठी तयार केलेले",
    heroTitle1: "जाणा. समजून घ्या.",
    heroTitle2: "सहभागी व्हा.",
    heroDescription:
      "KrutBharat नागरिकांना भारत कसा कार्य करतो हे जाणून घेण्यास, आजूबाजूच्या समस्या समजून घेण्यास आणि अर्थपूर्ण नागरिक सहभागाचे मार्ग शोधण्यास मदत करते.",
    exploreNow: "KrutBharat एक्सप्लोर करा →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KrutBharat म्हणजे काय?",
    aboutTagline: "सत्कर्मांचा चेहरा।",
    aboutTitle:
      "नागरिकांना लोकशाही समजली तर लोकशाही अधिक प्रभावीपणे कार्य करते.",
    aboutDescription:
      "KrutBharat नागरिक शिक्षण आणि नागरिक सहभाग एका सोप्या अनुभवामध्ये एकत्र आणते. सरकारबद्दल शिका, विविध व्यवस्था आपल्या दैनंदिन जीवनावर कसा परिणाम करतात हे समजून घ्या आणि आपल्या समुदायात सहभागी होण्याचे व्यावहारिक मार्ग शोधा.",

    whatWeDoLabel: "KrutBharat मध्ये तुम्ही काय करू शकता?",
    whatWeDoTitle: "शिकण्यापासून कृतीपर्यंत.",
    whatWeDoDescription:
      "KrutBharat एका जागरूक नागरिकाच्या संपूर्ण वाटचालीचा विचार करून तयार केले आहे.",

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

    howLabel: "KrutBharat कसे कार्य करते",
    howTitle: "शिकण्यापासून दीर्घकालीन नागरिक प्रभावापर्यंत.",
    howDescription:
      "KrutBharat नागरिक ज्ञानाला प्रत्यक्ष सहभाग, सत्यापित योगदान आणि वाढत्या नागरिक नोंदीशी जोडते.",

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
      "सहभाग घ्या, समस्या नोंदवा आणि Civic Missions पूर्ण करण्यासाठी KrutBharat ची साधने वापरा.",
    step5Title: "ट्रॅक आणि पडताळा",
    step5Description:
      "अपडेट्स पाहा, पुरावे सादर करा आणि शक्य असेल तिथे परिणामांची पडताळणी करा.",

    journeyFlowLabel: "KRUTBHARAT ची वाटचाल",
    journeyFlowTitle: "शोधा → शिका → समजून घ्या → कृती करा → पुरावा द्या → पडताळा → मिळवा → तुमची नोंद घडवा → पुन्हा सहभागी व्हा",
    journeyFlowDescription:
      "भारत जाणून घेण्यापासून प्रत्यक्ष नागरिक कृतीपर्यंत आणि सत्यापित सहभागाची नोंद तयार करण्यापर्यंत नागरिक KrutBharat मध्ये आपल्या गतीने पुढे जाऊ शकतात.",
    journeyFlow: [
      {
        title: "शोधा",
        description: "Know India, State Spotlight आणि नागरिक विषय एक्सप्लोर करा.",
        icon: "🇮🇳",
      },
      {
        title: "शिका",
        description: "Civic Learning आणि Civic Quests द्वारे ज्ञान वाढवा.",
        icon: "📚",
      },
      {
        title: "समजून घ्या",
        description: "समस्या, संस्था, व्यवस्था आणि योग्य नागरिक मार्ग यांचा संबंध समजून घ्या.",
        icon: "💡",
      },
      {
        title: "कृती करा",
        description: "समस्या नोंदवा, अधिकृत मार्ग वापरा आणि Civic Missions पूर्ण करा.",
        icon: "✋",
      },
      {
        title: "पुरावा द्या",
        description: "फोटो, पुरावे आणि Before / After Impact जोडा.",
        icon: "📸",
      },
      {
        title: "पडताळा",
        description: "कृतीची Admin आणि पात्र Community Review प्रक्रियेत पडताळणी होऊ शकते.",
        icon: "✓",
      },
      {
        title: "मिळवा आणि ट्रॅक करा",
        description: "सत्यापित सहभाग Karma Credits आणि प्रभाव नोंदीमध्ये जोडला जातो.",
        icon: "✨",
      },
      {
        title: "तुमची नोंद घडवा",
        description: "Civic Passport वाढवा, Leagues आणि टीममध्ये सहभागी व्हा आणि नागरिक प्रगती शेअर करा.",
        icon: "🏆",
      },
    ],

    featureUniverseLabel: "KRUTBHARAT प्लॅटफॉर्म",
    featureUniverseTitle: "प्रत्येक सुविधा एकाच नागरिक वाटचालीशी जोडलेली आहे.",
    featureUniverseDescription:
      "KrutBharat शिक्षण, नागरी सेवा, प्रत्यक्ष कृती, पडताळणी, प्रभाव आणि समुदाय सहभाग यांना एका जोडलेल्या अनुभवात आणते.",
    featureGroups: [
      {
        title: "शिका आणि शोधा",
        description: "कृतीपूर्वी योग्य संदर्भ तयार करा.",
        icon: "📖",
        items: [
          "Know India + इंटरॅक्टिव्ह State Spotlight",
          "संरचित धड्यांसह Civic Learning",
          "Civic Quests आणि इंटरॅक्टिव्ह क्विझ",
          "सरकार, संविधान, निवडणुका, पर्यावरण, अर्थव्यवस्था, शिक्षण, आरोग्य सेवा आणि स्थानिक समस्या",
        ],
      },
      {
        title: "नागरी समस्या समजून घ्या",
        description: "नागरी समस्या समजून घेणे आणि त्यावर पुढे जाणे सोपे करा.",
        icon: "🧭",
        items: [
          "नागरी विषय आणि सार्वजनिक व्यवस्था एक्सप्लोर करा",
          "Authority Directory आणि जबाबदारीबाबत मार्गदर्शन",
          "स्थान, वर्णन आणि पुराव्यासह समस्या नोंदवा",
          "My Civic Issues आणि स्थिती ट्रॅकिंग",
        ],
      },
      {
        title: "प्रत्यक्ष नागरिक कृती करा",
        description: "माहितीपासून सहभागाकडे जा.",
        icon: "🤝",
        items: [
          "व्यावहारिक नागरिक उपक्रमांसाठी Civic Missions",
          "संरचित सबमिशनसाठी Submission Gateway",
          "योग्य अधिकृत माध्यमाकडे Smart Handoff",
          "टीम-आधारित सहभागासाठी Civic Leagues",
        ],
      },
      {
        title: "पुरावा द्या आणि पडताळा",
        description: "नागरिक योगदान स्पष्ट आणि पुनरावलोकनयोग्य बनवा.",
        icon: "🔎",
        items: [
          "फोटो आणि पूरक पुरावे सादर करणे",
          "Before / After Impact नोंदी",
          "Admin Verification आणि Impact Review",
          "Community Verification आणि Peer Review",
        ],
      },
      {
        title: "Karma आणि नागरिक प्रगती",
        description: "तुमच्या योगदानाची नोंद जतन करा.",
        icon: "✨",
        items: [
          "Karma Credits ledger आणि सत्यापित rewards",
          "My Impact आणि योगदानाचा इतिहास",
          "Civic-Sense Scoreboard आणि league standings",
          "वाढत्या वैयक्तिक नागरिक नोंदीसाठी Civic Passport",
        ],
      },
      {
        title: "समुदाय आणि स्पर्धा",
        description: "नागरिक सहभागाला सामायिक अनुभव बनवा.",
        icon: "👥",
        items: [
          "Civic Leagues, टीम आणि सामायिक मिशन्स",
          "Leaderboards आणि टीम प्रगती",
          "Community activity आणि civic achievements",
          "शेअर करता येणारे mission आणि impact moments",
        ],
      },
    ],

    futureLabel: "KRUTBHARAT सोबत पुढे",
    futureTitle: "नागरिक वाटचाल सतत विस्तारत राहील.",
    futureDescription:
      "KrutBharat विकसित होत असताना progression आणि personalization च्या नवीन स्तरांचा विस्तार करता येईल.",
    futureFeatures: [
      "XP आणि levels",
      "Badges, streaks आणि richer progression",
      "Public / private Civic Passport sharing",
      "Notifications आणि reminders",
      "Search, filtering आणि local personalization",
      "सखोल impact analytics",
    ],

    exploreLabel: "नागरी जीवन एक्सप्लोर करा",
    exploreTitle: "कुठूनही सुरुवात करा. तुमच्या गतीने शिका.",
    exploreDescription:
      "अकाउंट न बनवता KrutBharat चे सर्व आठ शिकण्याचे विषय एक्सप्लोर करा.",
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
      "KrutBharat समस्या नोंदवणे, योग्य प्राधिकरण ओळखणे, अहवाल तयार करणे आणि तो योग्य अधिकृत माध्यमापर्यंत पोहोचवण्यात मदत करते.",

    issueStep1: "समस्या दिसली",
    issueStep2: "समस्या नोंदवा",
    issueStep3: "योग्य प्राधिकरण शोधा",
    issueStep4: "अहवाल तयार करा",
    issueStep5: "Smart Handoff",
    issueStep6: "अधिकृतरीत्या जमा करा",
    issueStep7: "ट्रॅक आणि पडताळा",

    reportIssueNow: "नागरी समस्या नोंदवा →",

    whyLabel: "KrutBharat का?",
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

    solutionTitle: "KrutBharat काय बदलते",
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
      "KrutBharat नागरिकांना शिकण्यास आणि नागरी प्रक्रियेत मार्गदर्शन मिळवण्यास मदत करते आणि स्वतःच्या साधनांमध्ये व अधिकृत सरकारी प्रणालींमध्ये स्पष्ट फरक ठेवते.",

    trust1Title: "अधिकृत माहिती",
    trust1Description:
      "जिथे उपलब्ध असेल तिथे प्राधिकरणाची माहिती देखभाल केलेल्या डायरेक्टरी आणि अधिकृत स्रोतांशी जोडली जाऊ शकते.",

    trust2Title: "नागरिकांच्या नियंत्रणातील नोंदी",
    trust2Description:
      "KrutBharat द्वारे दिलेल्या नागरी नोंदी आणि माहितीवर नागरिकांचे नियंत्रण राहते.",

    trust3Title: "स्पष्ट मर्यादा",
    trust3Description:
      "KrutBharat स्वतःला सरकारी प्राधिकरण म्हणून सादर करत नाही आणि कोणतीही नोंद आपोआप अधिकृत सरकारी सबमिशन मानत नाही.",

    ctaTitle1: "तुमची",
    ctaTitle2: " KrutBharat वाटचाल सुरू करण्यास तयार आहात?",
    ctaDescription:
      "सुरुवातीला नागरिक ज्ञान एक्सप्लोर करा. तुमची प्रगती जतन करण्यासाठी आणि वैयक्तिक सुविधा वापरण्यासाठी तयार झाल्यावर अकाउंट तयार करा.",

    leagueLabel: "सिविक लीग्स",
    leagueTitle: "नागरी कृतीला टीमच्या अनुभवात बदला.",
    leagueDescription:
      "स्थानिक नागरिक टीममध्ये सामील व्हा, प्रत्यक्ष नागरी मिशन्स पूर्ण करा, Karma Credits मिळवा आणि सत्यापित योगदान Civic-Sense Scoreboard वर पाहा.",
    leagueFeature1Title: "टीममध्ये सामील व्हा",
    leagueFeature1Description:
      "स्थानिक नागरिक टीमचा भाग बना आणि इतर सहभागींसोबत योगदान द्या.",
    leagueFeature2Title: "प्रत्यक्ष नागरी मिशन्स पूर्ण करा",
    leagueFeature2Description:
      "व्यावहारिक नागरी उपक्रमांमध्ये सहभागी व्हा आणि पडताळणीसाठी पुरावे सादर करा.",
    leagueFeature3Title: "मिळवा आणि स्पर्धा करा",
    leagueFeature3Description:
      "सत्यापित योगदानांमधून Karma Credits मिळतात आणि टीमच्या क्रमवारीत योगदान होते.",
    leagueAction: "सिविक लीग्स एक्सप्लोर करा →",

    footerTagline:
      "Know India. Think Civic. Shape Its Future.",
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

const civicToolsContent: Record<
  Language,
  {
    label: string;
    title: string;
    description: string;
    action: string;
  }
> = {
  en: {
    label: "CIVIC PARTICIPATION",
    title: "Take your next step.",
    description:
      "The same civic tools you see on your dashboard are also available here — with a clear path from learning to participation, tracking and impact.",
    action: "Open",
  },
  hi: {
    label: "नागरिक भागीदारी",
    title: "अपना अगला कदम उठाएँ।",
    description:
      "डैशबोर्ड पर दिखने वाले नागरिक उपकरण यहाँ भी उपलब्ध हैं — सीखने से लेकर भागीदारी, ट्रैकिंग और प्रभाव तक एक स्पष्ट रास्ते के साथ।",
    action: "खोलें",
  },
  mr: {
    label: "नागरिक सहभाग",
    title: "तुमचे पुढचे पाऊल उचला.",
    description:
      "डॅशबोर्डवर दिसणारी नागरिक साधने येथेही उपलब्ध आहेत — शिकण्यापासून सहभाग, ट्रॅकिंग आणि प्रभावापर्यंत स्पष्ट मार्गासह.",
    action: "उघडा",
  },
};

const civicToolsByLanguage: Record<
  Language,
  {
    icon: string;
    path: string;
    title: string;
    description: string;
  }[]
> = {
  en: [
    {
      icon: "📖",
      path: "/civic-learning",
      title: "Civic Learning",
      description:
        "Build practical civic knowledge through structured lessons about India, government and public systems.",
    },
    {
      icon: "📣",
      path: "/report-issue",
      title: "Report an Issue",
      description:
        "Document a local civic problem with useful details and follow the appropriate reporting path.",
    },
    {
      icon: "📋",
      path: "/my-issues",
      title: "My Civic Issues",
      description:
        "View the civic issues you have reported, your evidence and their current status.",
    },
    {
      icon: "🎯",
      path: "/civic-quests",
      title: "Civic Quests",
      description:
        "Test your civic knowledge with interactive challenges covering Constitution, Governance, Elections and Know India.",
    },
    {
      icon: "🏆",
      path: "/leagues",
      title: "Civic Leagues",
      description:
        "Join civic teams, complete shared missions and see verified contributions reflected in team progress.",
    },
    {
      icon: "👥",
      path: "/community",
      title: "Community",
      description:
        "Discover civic activity around your community and connect with shared local participation.",
    },
    {
      icon: "📊",
      path: "/my-impact",
      title: "My Impact",
      description:
        "See your civic participation, contribution history and the progress connected to your actions.",
    },
    {
      icon: "🪪",
      path: "/civic-passport",
      title: "Civic Passport",
      description:
        "View your verified civic participation, Karma Credits, missions and League contribution in one place.",
    },
    {
      icon: "🇮🇳",
      path: "/know-india",
      title: "Know India",
      description:
        "Explore India's Constitution, institutions, history, geography and civic systems through an interactive experience.",
    },
  ],
  hi: [
    {
      icon: "📖",
      path: "/civic-learning",
      title: "नागरिक शिक्षा",
      description:
        "भारत, सरकार और सार्वजनिक व्यवस्थाओं पर व्यवस्थित पाठों के माध्यम से व्यावहारिक नागरिक ज्ञान बढ़ाएँ।",
    },
    {
      icon: "📣",
      path: "/report-issue",
      title: "समस्या रिपोर्ट करें",
      description:
        "स्थानीय नागरिक समस्या का उपयोगी विवरण दर्ज करें और उचित रिपोर्टिंग मार्ग अपनाएँ।",
    },
    {
      icon: "📋",
      path: "/my-issues",
      title: "मेरी नागरिक समस्याएँ",
      description:
        "आपके द्वारा रिपोर्ट की गई समस्याएँ, प्रमाण और उनकी वर्तमान स्थिति देखें।",
    },
    {
      icon: "🎯",
      path: "/civic-quests",
      title: "सिविक क्वेस्ट्स",
      description:
        "संविधान, शासन, चुनाव और Know India पर इंटरैक्टिव चुनौतियों के माध्यम से अपने नागरिक ज्ञान को परखें।",
    },
    {
      icon: "🏆",
      path: "/leagues",
      title: "सिविक लीग्स",
      description:
        "नागरिक टीमों से जुड़ें, साझा मिशन पूरे करें और सत्यापित योगदानों को टीम की प्रगति में देखें।",
    },
    {
      icon: "👥",
      path: "/community",
      title: "कम्युनिटी",
      description:
        "अपने समुदाय की नागरिक गतिविधियों को जानें और स्थानीय भागीदारी से जुड़ें।",
    },
    {
      icon: "📊",
      path: "/my-impact",
      title: "मेरा प्रभाव",
      description:
        "अपनी नागरिक भागीदारी, योगदान इतिहास और अपने कार्यों से जुड़ी प्रगति देखें।",
    },
    {
      icon: "🪪",
      path: "/civic-passport",
      title: "सिविक पासपोर्ट",
      description:
        "अपनी सत्यापित नागरिक भागीदारी, Karma Credits, मिशन और League योगदान एक जगह देखें।",
    },
    {
      icon: "🇮🇳",
      path: "/know-india",
      title: "भारत जानें",
      description:
        "इंटरैक्टिव अनुभव के माध्यम से भारत के संविधान, संस्थाओं, इतिहास, भूगोल और नागरिक व्यवस्थाओं को एक्सप्लोर करें।",
    },
  ],
  mr: [
    {
      icon: "📖",
      path: "/civic-learning",
      title: "नागरिक शिक्षण",
      description:
        "भारत, सरकार आणि सार्वजनिक व्यवस्थांवरील संरचित धड्यांमधून व्यावहारिक नागरिक ज्ञान वाढवा.",
    },
    {
      icon: "📣",
      path: "/report-issue",
      title: "समस्या नोंदवा",
      description:
        "स्थानिक नागरी समस्येचे उपयुक्त तपशील नोंदवा आणि योग्य तक्रार मार्गाचा वापर करा.",
    },
    {
      icon: "📋",
      path: "/my-issues",
      title: "माझ्या नागरी समस्या",
      description:
        "तुम्ही नोंदवलेल्या नागरी समस्या, त्यांचे पुरावे आणि सद्यस्थिती पाहा.",
    },
    {
      icon: "🎯",
      path: "/civic-quests",
      title: "सिविक क्वेस्ट्स",
      description:
        "संविधान, शासन, निवडणुका आणि Know India वरील इंटरॅक्टिव्ह आव्हानांमधून तुमचे नागरिक ज्ञान तपासा.",
    },
    {
      icon: "🏆",
      path: "/leagues",
      title: "सिविक लीग्स",
      description:
        "नागरिक टीममध्ये सहभागी व्हा, सामायिक मिशन्स पूर्ण करा आणि सत्यापित योगदान टीमच्या प्रगतीत पाहा.",
    },
    {
      icon: "👥",
      path: "/community",
      title: "कम्युनिटी",
      description:
        "तुमच्या समुदायातील नागरिक उपक्रम जाणून घ्या आणि स्थानिक सहभागाशी जोडा.",
    },
    {
      icon: "📊",
      path: "/my-impact",
      title: "माझा प्रभाव",
      description:
        "तुमचा नागरिक सहभाग, योगदानाचा इतिहास आणि तुमच्या कृतींशी संबंधित प्रगती पाहा.",
    },
    {
      icon: "🪪",
      path: "/civic-passport",
      title: "सिविक पासपोर्ट",
      description:
        "तुमचा सत्यापित नागरिक सहभाग, Karma Credits, मिशन्स आणि League मधील योगदान एका ठिकाणी पाहा.",
    },
    {
      icon: "🇮🇳",
      path: "/know-india",
      title: "भारत जाणून घ्या",
      description:
        "इंटरॅक्टिव्ह अनुभवातून भारताचे संविधान, संस्था, इतिहास, भूगोल आणि नागरी व्यवस्था एक्सप्लोर करा.",
    },
  ],
};

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

const civicSenseExploreContent: Record<
  Language,
  {
    label: string;
    title: string;
    subtitle: string;
    description: string;
    insideLabel: string;
    insideTitle: string;
    item1Title: string;
    item1Description: string;
    item2Title: string;
    item2Description: string;
    item3Title: string;
    item3Description: string;
    action: string;
    stripLeft: string;
    stripRight: string;
  }
> = {
  en: {
    label: "CIVIC SENSE · EVERYDAY CITIZENSHIP",
    title: "Civic Sense",
    subtitle: "The small habits that make shared spaces better.",
    description:
      "Understand how everyday choices affect other people, public spaces and the community around you — and learn simple ways to practise better civic behaviour.",
    insideLabel: "WHAT'S INSIDE",
    insideTitle: "Learn it. Notice it. Practise it.",
    item1Title: "Understand the basics",
    item1Description:
      "What civic sense means, why it matters and how ordinary behaviour shapes shared public life.",
    item2Title: "Everyday civic habits",
    item2Description:
      "Clean public spaces, do not spit, protect public property, keep noise considerate, respect queues and keep pathways clear.",
    item3Title: "Practise through real situations",
    item3Description:
      "Use simple scenarios to think through the civic choice before you make it in everyday life.",
    action: "Explore Civic Sense →",
    stripLeft: "NOTICE → CHOOSE → PRACTISE",
    stripRight: "Small actions, shared impact.",
  },

  hi: {
    label: "नागरिक बोध · रोज़मर्रा की नागरिकता",
    title: "नागरिक बोध",
    subtitle: "छोटी आदतें जो साझा स्थानों को बेहतर बनाती हैं।",
    description:
      "समझें कि रोज़मर्रा के हमारे फैसले दूसरे लोगों, सार्वजनिक स्थानों और समुदाय को कैसे प्रभावित करते हैं — और बेहतर नागरिक व्यवहार अपनाने के सरल तरीके सीखें।",
    insideLabel: "इसमें क्या है",
    insideTitle: "सीखें। पहचानें। अपनाएँ।",
    item1Title: "बुनियादी बातें समझें",
    item1Description:
      "नागरिक बोध क्या है, यह क्यों जरूरी है और साधारण व्यवहार साझा सार्वजनिक जीवन को कैसे प्रभावित करता है।",
    item2Title: "रोज़मर्रा की नागरिक आदतें",
    item2Description:
      "सार्वजनिक स्थान साफ रखें, न थूकें, सार्वजनिक संपत्ति की रक्षा करें, शोर का ध्यान रखें, कतार का सम्मान करें और रास्ते खुले रखें।",
    item3Title: "वास्तविक परिस्थितियों में अभ्यास करें",
    item3Description:
      "सरल परिस्थितियों के माध्यम से सोचें कि रोज़मर्रा में सही नागरिक विकल्प क्या हो सकता है।",
    action: "नागरिक बोध देखें →",
    stripLeft: "देखें → चुनें → अपनाएँ",
    stripRight: "छोटी आदतें, साझा प्रभाव।",
  },

  mr: {
    label: "नागरी जाणीव · दैनंदिन नागरिकपणा",
    title: "नागरी जाणीव",
    subtitle: "सामायिक जागा अधिक चांगल्या बनवणाऱ्या छोट्या सवयी.",
    description:
      "आपल्या दैनंदिन निवडींचा इतर लोकांवर, सार्वजनिक जागांवर आणि समुदायावर कसा परिणाम होतो हे समजून घ्या — आणि चांगले नागरी वर्तन अंगीकारण्याचे सोपे मार्ग शिका.",
    insideLabel: "यामध्ये काय आहे",
    insideTitle: "शिका. ओळखा. आचरणात आणा.",
    item1Title: "मूलभूत गोष्टी समजून घ्या",
    item1Description:
      "नागरी जाणीव म्हणजे काय, ती का महत्त्वाची आहे आणि साधे वर्तन सामायिक सार्वजनिक जीवनावर कसे परिणाम करते.",
    item2Title: "दैनंदिन नागरी सवयी",
    item2Description:
      "सार्वजनिक जागा स्वच्छ ठेवा, थुंकू नका, सार्वजनिक मालमत्तेचे रक्षण करा, आवाजाची जाणीव ठेवा, रांगेचा आदर करा आणि मार्ग मोकळे ठेवा.",
    item3Title: "प्रत्यक्ष परिस्थितीत सराव करा",
    item3Description:
      "सोप्या प्रसंगांमधून दैनंदिन जीवनात योग्य नागरी पर्याय कोणता असू शकतो याचा विचार करा.",
    action: "नागरी जाणीव पाहा →",
    stripLeft: "लक्ष द्या → निवडा → आचरणात आणा",
    stripRight: "छोट्या सवयी, सामायिक परिणाम.",
  },
};

const responsibleAuthoritiesExploreContent: Record<
  Language,
  {
    label: string;
    title: string;
    subtitle: string;
    description: string;
    insideLabel: string;
    insideTitle: string;
    item1Title: string;
    item1Description: string;
    item2Title: string;
    item2Description: string;
    item3Title: string;
    item3Description: string;
    action: string;
    stripLeft: string;
    stripRight: string;
  }
> = {
  en: {
    label: "RESPONSIBLE AUTHORITIES · KNOW YOUR AREA",
    title: "Who represents and governs this place?",
    subtitle: "Know the people and public bodies connected to the area around you.",
    description:
      "Use your saved profile location or your current device location to identify the area, then explore elected representatives and public authorities mapped to it.",
    insideLabel: "WHAT'S INSIDE",
    insideTitle: "People. Constituencies. Public authorities.",
    item1Title: "Municipal & Ward representatives",
    item1Description:
      "See applicable local elected representatives and their political parties, with ward information where verified.",
    item2Title: "MLA & MP",
    item2Description:
      "See the Assembly and Lok Sabha constituencies, representatives, parties and election years available for the selected area.",
    item3Title: "Public & administrative authorities",
    item3Description:
      "Explore municipal, district, police, development and other public authorities listed for the area.",
    action: "Explore Responsible Authorities →",
    stripLeft: "PROFILE → CURRENT LOCATION → REPRESENTATIVES",
    stripRight: "Purely informational. Politically neutral.",
  },
  hi: {
    label: "जिम्मेदार प्राधिकरण · अपने क्षेत्र को जानें",
    title: "इस क्षेत्र का प्रतिनिधित्व और प्रशासन कौन करता है?",
    subtitle: "अपने आसपास के क्षेत्र से जुड़े लोगों और सार्वजनिक संस्थाओं को जानें।",
    description:
      "अपनी सेव प्रोफ़ाइल लोकेशन या वर्तमान डिवाइस लोकेशन का उपयोग करके क्षेत्र पहचानें और उससे जुड़े निर्वाचित प्रतिनिधियों तथा सार्वजनिक प्राधिकरणों को देखें।",
    insideLabel: "इसमें क्या है",
    insideTitle: "लोग। निर्वाचन क्षेत्र। सार्वजनिक प्राधिकरण।",
    item1Title: "नगरपालिका और वार्ड प्रतिनिधि",
    item1Description:
      "जहाँ सत्यापित जानकारी उपलब्ध हो, वहाँ लागू स्थानीय निर्वाचित प्रतिनिधि और उनके राजनीतिक दल तथा वार्ड की जानकारी देखें।",
    item2Title: "MLA और MP",
    item2Description:
      "चुने गए क्षेत्र के विधानसभा और लोकसभा निर्वाचन क्षेत्र, प्रतिनिधि, दल और उपलब्ध चुनाव-वर्ष की जानकारी देखें।",
    item3Title: "सार्वजनिक और प्रशासनिक प्राधिकरण",
    item3Description:
      "क्षेत्र के लिए सूचीबद्ध नगरपालिका, जिला, पुलिस, विकास और अन्य सार्वजनिक प्राधिकरणों को देखें।",
    action: "जिम्मेदार प्राधिकरण देखें →",
    stripLeft: "प्रोफ़ाइल → वर्तमान लोकेशन → प्रतिनिधि",
    stripRight: "केवल जानकारी। राजनीतिक रूप से तटस्थ।",
  },
  mr: {
    label: "जबाबदार प्राधिकरण · तुमचा परिसर जाणून घ्या",
    title: "या ठिकाणाचे प्रतिनिधित्व आणि प्रशासन कोण करते?",
    subtitle: "तुमच्या आसपासच्या परिसराशी संबंधित लोक आणि सार्वजनिक संस्था जाणून घ्या.",
    description:
      "तुमचे सेव्ह केलेले प्रोफाइल लोकेशन किंवा सध्याचे डिव्हाइस लोकेशन वापरून परिसर ओळखा आणि त्याच्याशी संबंधित निवडून आलेले प्रतिनिधी व सार्वजनिक प्राधिकरण पाहा.",
    insideLabel: "यामध्ये काय आहे",
    insideTitle: "लोक. मतदारसंघ. सार्वजनिक प्राधिकरण.",
    item1Title: "महानगरपालिका आणि प्रभाग प्रतिनिधी",
    item1Description:
      "सत्यापित माहिती उपलब्ध असल्यास लागू स्थानिक प्रतिनिधी, त्यांचे राजकीय पक्ष आणि प्रभागाची माहिती पाहा.",
    item2Title: "MLA आणि MP",
    item2Description:
      "निवडलेल्या परिसराचे विधानसभा आणि लोकसभा मतदारसंघ, प्रतिनिधी, पक्ष आणि उपलब्ध निवडणूक वर्ष पाहा.",
    item3Title: "सार्वजनिक आणि प्रशासकीय प्राधिकरण",
    item3Description:
      "परिसरासाठी सूचीबद्ध महानगरपालिका, जिल्हा, पोलीस, विकास आणि इतर सार्वजनिक प्राधिकरण पाहा.",
    action: "जबाबदार प्राधिकरण पाहा →",
    stripLeft: "प्रोफाइल → सध्याचे लोकेशन → प्रतिनिधी",
    stripRight: "केवळ माहिती. राजकीयदृष्ट्या तटस्थ.",
  },
};

const supabase = createClient();

export default function ExplorePage()
 {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const text = content[language];
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (mounted) setIsAuthenticated(!!user);
    }

    void loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAuthenticated(!!session?.user);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("KrutBharat sign-out failed:", error);
      return;
    }
    setIsAuthenticated(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="kf-explore-page relative min-h-screen overflow-x-hidden bg-transparent text-[#102033]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img src="/images/kf-background.png" alt="" className="h-full w-full object-cover" />
      </div>

      {/* EXPLORE NAVIGATION RAIL */}
      <header className="kf-explore-header sticky top-3 z-50 mx-auto max-w-[1280px] px-3 sm:px-5">
        <div className="kf-explore-ambient pointer-events-none absolute -inset-x-12 -inset-y-8 overflow-visible" aria-hidden="true">
          <div className="kf-explore-wave kf-explore-wave-blue absolute -left-10 top-0 h-24 w-[58%]" />
          <div className="kf-explore-wave kf-explore-wave-orange absolute right-[-3%] top-[-8px] h-28 w-[42%]" />
          <div className="kf-explore-wave kf-explore-wave-soft absolute left-[22%] top-[-18px] h-20 w-[58%]" />
        </div>

        <div className="kf-explore-nav relative overflow-hidden rounded-[24px] border px-3 py-2.5 sm:px-4 sm:py-2.5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-white/16 to-white/27" />
          <div className="pointer-events-none absolute inset-x-[7%] top-0 h-px bg-white/85" />
          <div className="pointer-events-none absolute -left-8 top-[-42px] h-28 w-56 rounded-full bg-[#dceeff]/25 blur-2xl" />
          <div className="pointer-events-none absolute right-10 top-[-52px] h-32 w-40 rounded-full bg-[#ffd9b5]/22 blur-2xl" />

          <div className="kf-explore-nav-content relative flex min-w-0 items-center gap-2 sm:gap-3" style={{ transformStyle: "preserve-3d" }}>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="kf-explore-logo shrink-0 rounded-xl px-2 py-1 text-left text-[21px] font-black tracking-[-0.045em] text-[#102033] transition hover:bg-white/45 sm:px-2.5 sm:text-[23px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Krut<span className="text-[#ff7a00]">Bharat</span>
            </button>

            <div className="mx-1 hidden h-9 w-px bg-white/70 lg:block" aria-hidden="true" />

            <div
              className="kf-explore-section-nav flex min-w-0 flex-1 items-end justify-between gap-1 overflow-visible px-1 pb-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              aria-label="Explore sections"
            >
              {[
                {
                  key: "learn",
                  label: language === "en" ? "LEARN" : language === "hi" ? "सीखें" : "शिका",
                  items: [
                    ["explore", language === "en" ? "Explore Civic Life" : language === "hi" ? "नागरिक जीवन एक्सप्लोर करें" : "नागरी जीवन एक्सप्लोर करा"],
                    ["know-india", language === "en" ? "Discover India" : language === "hi" ? "भारत को जानें" : "भारत जाणून घ्या"],
                  ],
                  groupClass: "bg-[#eaf3fa]/58 border-[#dbeaf5]/65",
                  dot: "bg-[#1f9ee5] kf-discover-india-nav-dot",  // dark-mode accent hook
                  labelClass: "text-[#277aa9]",
                },
                {
                  key: "understand",
                  label: language === "en" ? "UNDERSTAND" : language === "hi" ? "समझें" : "समजून घ्या",
                  items: [
                    ["issue-journey", language === "en" ? "Civic Issue Journey" : language === "hi" ? "नागरिक समस्या यात्रा" : "नागरी समस्या प्रवास"],
                    ["civic-sense", language === "en" ? "Civic Sense" : language === "hi" ? "नागरिक बोध" : "नागरी जाणीव"],
                    ["responsible-authorities", language === "en" ? "Responsible Authorities" : language === "hi" ? "जिम्मेदार प्राधिकरण" : "जबाबदार प्राधिकरण"],
                  ],
                  groupClass: "bg-[#f2ecfa]/58 border-[#e5dcef]/65",
                  dot: "bg-[#8e36b8]",
                  labelClass: "text-[#8a5aa2]",
                },
                {
                  key: "participate",
                  label: language === "en" ? "PARTICIPATE" : language === "hi" ? "भाग लें" : "सहभाग",
                  items: [
                    ["civic-tools", language === "en" ? "Civic Participation" : language === "hi" ? "नागरिक भागीदारी" : "नागरी सहभाग"],
                    ["leagues", language === "en" ? "Civic Leagues" : language === "hi" ? "सिविक लीग्स" : "सिविक लीग्स"],
                    ["civic-passport", language === "en" ? "Your Civic Record" : language === "hi" ? "आपका नागरिक रिकॉर्ड" : "तुमची नागरिक नोंद"],
                  ],
                  groupClass: "bg-[#edf6e8]/58 border-[#dce9d2]/65",
                  dot: "bg-[#5b9834] kf-your-civic-record-nav-dot",  // dark-mode accent hook
                  labelClass: "text-[#63834e]",
                },
              ].map((group) => (
                <div key={group.key} className={`kf-explore-nav-group kf-explore-nav-group-${group.key} flex shrink-0 flex-col items-center gap-1`}>
                  <div className={`flex items-center justify-center gap-1 text-[8px] font-black tracking-[0.16em] ${group.labelClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${group.dot}`} />
                    <span>{group.label}</span>
                  </div>

                  <div className={`flex items-center rounded-[15px] border px-0.5 py-0.5 ${group.groupClass}`}>
                    {group.items.map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className="kf-explore-nav-item group relative rounded-full px-2 py-1.5 text-[9px] font-bold tracking-[-0.01em] text-[#526170] transition-all duration-200 hover:bg-white/70 hover:text-[#102033] sm:px-2.5 sm:text-[10px]"
                      >
                        <span className="relative whitespace-nowrap">
                          {label}
                          <span className="absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#ff7a00] transition-all duration-200 group-hover:w-[65%]" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-1 hidden h-9 w-px bg-white/70 lg:block" aria-hidden="true" />

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => router.push(isAuthenticated ? "/dashboard" : "/auth")}
                className="kf-explore-dashboard hidden rounded-full border border-[#ff9a55]/70 bg-[#ff8a32]/90 px-4 py-2 text-[11px] font-bold text-[#102033] shadow-[0_5px_14px_rgba(255,122,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#ff7f20] hover:shadow-[0_8px_18px_rgba(255,122,0,0.22)] sm:inline-flex"
              >
                {isAuthenticated ? "Dashboard" : "Dashboard"} →
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Language"
                title={language === "en" ? "English" : language === "hi" ? "हिन्दी" : "मराठी"}
                className="kf-explore-control h-10 w-10 appearance-none rounded-full border border-white/75 bg-white/60 p-0 text-center text-[11px] font-extrabold text-[#344153] shadow-sm outline-none backdrop-blur-md transition hover:bg-white/85"
              >
                <option value="en">En</option>
                <option value="hi">हि</option>
                <option value="mr">म</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE INTRO */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-14 md:pb-12 md:pt-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e0d3] bg-white/80 px-3.5 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7f858b]">
                {language === "en" ? "EXPLORE KRUTBHARAT" : language === "hi" ? "KRUTBHARAT एक्सप्लोर करें" : "KRUTBHARAT एक्सप्लोर करा"}
              </span>
            </div>
            <h1 className="kf-explore-hero-title mt-5 max-w-4xl text-[42px] font-black leading-[0.98] tracking-[-0.045em] text-[#102033] md:text-[62px]">
              {language === "en" ? (
                <>
                  Discover. Understand. <span className="kf-participate-orange">Participate.</span>
                </>
              ) : language === "hi" ? (
                "जानें। समझें। भाग लें।"
              ) : (
                "जाणून घ्या. समजून घ्या. सहभागी व्हा."
              )}
            </h1>
            <p className="mt-5 max-w-3xl text-[16px] leading-7 text-[#687581] md:text-[18px]">
              {language === "en"
                ? "Everything KrutBharat offers is organized here as a direct path from civic learning to understanding, action, teams and your growing civic record."
                : language === "hi"
                ? "KrutBharat की सभी प्रमुख सुविधाएँ यहाँ नागरिक सीखने से लेकर समझ, भागीदारी, टीम अनुभव और आपके बढ़ते नागरिक रिकॉर्ड तक एक स्पष्ट मार्ग में व्यवस्थित हैं।"
                : "KrutBharat ची प्रमुख वैशिष्ट्ये येथे नागरिक शिक्षणापासून समज, सहभाग, टीम अनुभव आणि तुमच्या वाढत्या नागरिक नोंदीपर्यंत स्पष्ट मार्गाने मांडली आहेत."}
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .kf-explore-section-nav::-webkit-scrollbar {
          display: none;
        }

        .kf-explore-header {
          perspective: 1100px;
          perspective-origin: 50% 0%;
        }

        .kf-explore-nav {
          isolation: isolate;
          transform: translate3d(0, 0, 0) rotateX(1.15deg);
          transform-style: preserve-3d;
          background: linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.15));
          border-color: rgba(255, 255, 255, 0.62);
          box-shadow:
            0 3px 0 rgba(255,255,255,0.28),
            0 9px 0 rgba(225,231,238,0.14),
            0 18px 38px rgba(16, 32, 51, 0.10),
            0 30px 58px rgba(16, 32, 51, 0.035),
            inset 0 1px 0 rgba(255, 255, 255, 0.78),
            inset 0 -1px 0 rgba(255, 255, 255, 0.20);
          -webkit-backdrop-filter: blur(28px) saturate(165%) brightness(1.03);
          backdrop-filter: blur(28px) saturate(165%) brightness(1.03);
        }

        .kf-explore-nav::before {
          content: "";
          position: absolute;
          inset: 1px;
          z-index: -1;
          border-radius: 23px;
          background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.015));
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.72), inset 0 -10px 24px rgba(255,255,255,0.025);
          pointer-events: none;
        }

        .kf-explore-nav::after {
          content: "";
          position: absolute;
          left: 7%;
          right: 7%;
          bottom: -8px;
          height: 12px;
          z-index: -2;
          border-radius: 999px;
          background: rgba(115, 130, 148, 0.20);
          filter: blur(9px);
          transform: translateZ(-18px);
          pointer-events: none;
        }

        .kf-explore-wave {
          position: absolute;
          border-radius: 999px;
          filter: blur(24px);
          opacity: 0.72;
          transform: rotate(-4deg);
          mix-blend-mode: multiply;
        }

        .kf-explore-wave-blue {
          background: radial-gradient(ellipse at 35% 55%, rgba(168, 213, 244, 0.52) 0%, rgba(197, 226, 247, 0.28) 34%, transparent 70%);
        }

        .kf-explore-wave-orange {
          background: radial-gradient(ellipse at 62% 48%, rgba(255, 188, 130, 0.44) 0%, rgba(255, 220, 181, 0.22) 38%, transparent 72%);
          transform: rotate(5deg);
        }

        .kf-explore-wave-soft {
          background: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.72) 0%, rgba(222, 235, 245, 0.18) 42%, transparent 72%);
          filter: blur(20px);
          opacity: 0.8;
          transform: rotate(1deg);
        }

        .kf-explore-logo,
        .kf-explore-nav-item,
        .kf-explore-control,
        .kf-explore-dashboard {
          transform: translateZ(8px);
          transform-style: preserve-3d;
        }

        .kf-explore-section-nav {
          overflow: visible;
        }

        .kf-explore-nav-group > div:last-child {
          overflow: visible;
        }

        .kf-explore-nav-item:hover,
        .kf-explore-control:hover {
          transform: translate3d(0, -2px, 14px);
          box-shadow: 0 7px 14px rgba(16, 32, 51, 0.10);
        }

        .kf-explore-dashboard:hover {
          transform: translate3d(0, -3px, 16px);
        }

        @media (max-width: 1180px) {
          .kf-explore-section-nav {
            gap: 0.25rem;
            overflow: visible;
          }

          .kf-explore-nav-item {
            padding-left: 0.45rem;
            padding-right: 0.45rem;
            font-size: 9px;
          }
        }

        @media (min-width: 1024px) {
          .kf-explore-section-nav {
            overflow: visible !important;
            justify-content: space-between !important;
          }

          .kf-explore-nav-group {
            flex-shrink: 1;
            min-width: 0;
          }
        }

        @media (max-width: 1023px) {
          .kf-explore-nav {
            transform: none;
            background: rgba(255, 255, 255, 0.48);
          }
        }

        /* Participate is orange in the light-mode Explore hero as well. */
        .kf-explore-page .kf-participate-orange {
          color: #ff7a00 !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-participate-orange {
          color: #ff7a1a !important;
        }
      `}</style>

      <style>{`
/* =========================================================
   KRUTBHARAT EXPLORE — DARK MODE v10
   Visual language: latest KrutBharat homepage v9
   Purpose: richer dark color families + stronger contrast.
   Light mode remains unchanged because every rule is scoped
   to html[data-theme="dark"].
   ========================================================= */

html[data-theme="dark"] .kf-explore-page,
html[data-theme="dark"] .kf-explore-page > .relative.z-10 {
  color: #f7f8fb !important;
  background: transparent !important;
}

html[data-theme="dark"] .kf-explore-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 88% 4%, rgba(63,167,255,.075), transparent 25%),
    radial-gradient(circle at 8% 72%, rgba(255,122,26,.035), transparent 24%),
    #07111f !important;
}

/* ---------- Background atmosphere ---------- */
html[data-theme="dark"] .kf-explore-page > .pointer-events-none.fixed {
  background: #07111f !important;
  opacity: 1 !important;
}

html[data-theme="dark"] .kf-explore-page > .pointer-events-none.fixed img {
  opacity: .075 !important;
  filter: brightness(.52) saturate(.65) contrast(1.04) !important;
}

html[data-theme="dark"] .kf-explore-page > .pointer-events-none.fixed::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 88% 8%, rgba(63,167,255,.10), transparent 27%),
    radial-gradient(circle at 8% 68%, rgba(255,122,26,.045), transparent 25%),
    linear-gradient(180deg, rgba(7,17,31,.76), rgba(7,17,31,.98));
}

/* ---------- Header: dark glass + three visual identities ---------- */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
  background: linear-gradient(135deg, rgba(18,40,63,.58), rgba(10,25,43,.54)) !important;
  border-color: rgba(151,181,214,.22) !important;
  box-shadow:
    0 16px 42px rgba(0,0,0,.30),
    inset 0 1px 0 rgba(255,255,255,.07) !important;
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav::before {
  background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.008)) !important;
  box-shadow: inset 0 1px 1px rgba(255,255,255,.06) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav::after {
  background: rgba(0,0,0,.10) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-logo {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group {
  border-radius: 18px;
  padding: 2px 3px 3px;
  transition: background .2s ease, border-color .2s ease;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn {
  background: rgba(48,103,145,.18) !important;
  border: 1px solid rgba(75,177,239,.20);
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand {
  background: rgba(116,72,133,.18) !important;
  border: 1px solid rgba(194,132,226,.20);
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate {
  background: rgba(58,112,78,.18) !important;
  border: 1px solid rgba(126,195,119,.20);
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item {
  color: #a9d7f4 !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item {
  color: #d1b0e1 !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item {
  color: #b9d7b0 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item:hover {
  background: rgba(63,167,255,.14) !important;
  color: #e8f6ff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item:hover {
  background: rgba(180,104,221,.14) !important;
  color: #fff2ff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item:hover {
  background: rgba(105,185,98,.14) !important;
  color: #efffec !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item span span {
  background: #ff8b32 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-control,
html[data-theme="dark"] .kf-explore-page .kf-explore-auth {
  background: #10243a !important;
  border-color: rgba(151,181,214,.20) !important;
  color: #dce6f0 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-auth:hover,
html[data-theme="dark"] .kf-explore-page .kf-explore-control:hover {
  background: #17314a !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-dashboard {
  background: #ff7a1a !important;
  border-color: #ff9b59 !important;
  color: #101a27 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-control option {
  background: #10243a !important;
  color: #f7f8fb !important;
}

/* ---------- Page typography ---------- */
html[data-theme="dark"] .kf-explore-page h1,
html[data-theme="dark"] .kf-explore-page h2,
html[data-theme="dark"] .kf-explore-page h3,
html[data-theme="dark"] .kf-explore-page h4 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page p {
  color: #aebed0 !important;
}

html[data-theme="dark"] .kf-explore-page .text-\[\#102033\],
html[data-theme="dark"] .kf-explore-page .text-\[\#263447\],
html[data-theme="dark"] .kf-explore-page .text-\[\#304457\],
html[data-theme="dark"] .kf-explore-page .text-\[\#344153\] {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page .text-\[\#697581\],
html[data-theme="dark"] .kf-explore-page .text-\[\#707b86\],
html[data-theme="dark"] .kf-explore-page .text-\[\#7a8590\],
html[data-theme="dark"] .kf-explore-page .text-\[\#687581\],
html[data-theme="dark"] .kf-explore-page .text-\[\#657080\],
html[data-theme="dark"] .kf-explore-page .text-\[\#6d776f\],
html[data-theme="dark"] .kf-explore-page .text-\[\#69736d\] {
  color: #aebed0 !important;
}

html[data-theme="dark"] .kf-explore-page .text-\[\#ff7a00\] {
  color: #ff8b32 !important;
}

html[data-theme="dark"] .kf-explore-page section,
html[data-theme="dark"] .kf-explore-page footer {
  border-top-color: rgba(151,181,214,.10) !important;
}

/* ---------- Section labels ---------- */
html[data-theme="dark"] .kf-explore-page section > div > div:first-child > div:first-child {
  background: #10243a !important;
  border-color: rgba(151,181,214,.18) !important;
  color: #9fb2c7 !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey > div > div:first-child > div:first-child {
  background: #30251b !important;
  border-color: rgba(255,154,85,.22) !important;
  color: #e4b58d !important;
}

html[data-theme="dark"] .kf-explore-page #leagues > div > div:first-child > div:first-child {
  background: #182c25 !important;
  border-color: rgba(126,195,119,.22) !important;
  color: #b8d7ad !important;
}

/* ---------- Civic Learning topic cards: 8 distinct dark families ---------- */
html[data-theme="dark"] .kf-explore-page #explore button.group {
  color: #f7f8fb !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(2) { background: #34261c !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(3) { background: #15352d !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(4) { background: #292541 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(5) { background: #12313b !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(6) { background: #3a291b !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(7) { background: #16362f !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(8) { background: #302544 !important; }

html[data-theme="dark"] .kf-explore-page #explore button.group:hover {
  border-color: rgba(170,201,231,.34) !important;
  box-shadow: 0 24px 50px rgba(0,0,0,.30) !important;
}

html[data-theme="dark"] .kf-explore-page #explore button.group > div:first-child > div {
  background: #f8f1e6 !important;
  color: #263447 !important;
  box-shadow: 0 8px 18px rgba(0,0,0,.14) !important;
}

html[data-theme="dark"] .kf-explore-page #explore button.group > div.absolute {
  opacity: 1 !important;
}
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(1) > div.absolute { background: #1a3e5d !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(2) > div.absolute { background: #4a3320 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(3) > div.absolute { background: #1d493c !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(4) > div.absolute { background: #383157 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(5) > div.absolute { background: #1b4650 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(6) > div.absolute { background: #4d3620 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(7) > div.absolute { background: #225143 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(8) > div.absolute { background: #41345c !important; }

html[data-theme="dark"] .kf-explore-page #explore button.group h3 { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group p { color: #b9c9da !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group span { color: #9fb2c7 !important; }

/* ---------- Know India: distinct card identities around the colorful map ---------- */
html[data-theme="dark"] .kf-explore-page #know-india > div > div {
  background: #10243a !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.25) !important;
}

html[data-theme="dark"] .kf-explore-page #know-india > div > div .absolute {
  opacity: .20 !important;
}

html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card {
  border-color: rgba(151,181,214,.17) !important;
  color: #f7f8fb !important;
  box-shadow: 0 14px 32px rgba(0,0,0,.16) !important;
}
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(1) { background: #102f47 !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(2) { background: #163a3b !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(3) { background: #302947 !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(4) { background: #3a2b1d !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(5) { background: #17382f !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(6) { background: #202e4a !important; }

html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:hover {
  border-color: rgba(180,210,238,.30) !important;
  transform: translateY(-2px);
}

html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card h4 { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card p { color: #aebed0 !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card > div:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.65) !important;
}

html[data-theme="dark"] .kf-explore-page #know-india .rounded-full {
  background: rgba(255,255,255,.055) !important;
  border-color: rgba(151,181,214,.16) !important;
  color: #aebed0 !important;
}

/* ---------- Civic Participation tools: six distinct colors ---------- */
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card {
  color: #f7f8fb !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.22) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(2) { background: #33253e !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(3) { background: #16382f !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(4) { background: #3a2a1d !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(5) { background: #173642 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(6) { background: #242d49 !important; }

html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:hover {
  border-color: rgba(180,210,238,.32) !important;
  box-shadow: 0 24px 50px rgba(0,0,0,.30) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card > div.absolute {
  opacity: 1 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(1) > div.absolute { background: #19415f !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(2) > div.absolute { background: #443251 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(3) > div.absolute { background: #1e4c40 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(4) > div.absolute { background: #4c3520 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(5) > div.absolute { background: #1f4757 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(6) > div.absolute { background: #303b5b !important; }

html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card h3 { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card p { color: #b9c9da !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card > div:first-child > div {
  background: #f8f1e6 !important;
  color: #263447 !important;
}

/* ---------- Civic Issue Journey: each step gets its own accent family ---------- */
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card {
  color: #f7f8fb !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 14px 34px rgba(0,0,0,.20) !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(2) { background: #292541 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(3) { background: #16382f !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(4) { background: #3a2a1d !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(5) { background: #173642 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(6) { background: #193b35 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(7) { background: #242d49 !important; }

html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:hover {
  border-color: rgba(180,210,238,.32) !important;
  transform: translateY(-2px);
}

html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card > div:first-child > div {
  background: #f8f1e6 !important;
  color: #263447 !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card p { color: #f0f4f8 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card span { color: #9fb2c7 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card .text-\[\#d0c8bd\] { color: #8fa9bf !important; }

html[data-theme="dark"] .kf-explore-page #issue-journey .absolute.left-\[12\%\] {
  background: rgba(145,174,204,.22) !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-full:not(.bg-\[\#ff7a00\]) {
  background: #10243a !important;
  border-color: rgba(151,181,214,.17) !important;
  color: #cbd7e5 !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] {
  background: #0d1d31 !important;
  border-color: rgba(151,181,214,.18) !important;
  color: #dbe5ef !important;
}

/* ---------- Civic Leagues: one coherent dark world ---------- */
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden {
  background: #0d1d31 !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.25) !important;
}

html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child {
  background: #17382f !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child .absolute:nth-child(1) {
  background: #225244 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child .absolute:nth-child(2) {
  background: #3f3020 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child .relative > div:first-child {
  background: #f8f1e6 !important;
  color: #263447 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child p {
  color: #b9d7b0 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child span {
  background: rgba(255,255,255,.07) !important;
  border-color: rgba(174,213,165,.18) !important;
  color: #d7e9d2 !important;
}

html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:last-child {
  background: #0f263d !important;
}

html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card {
  color: #f7f8fb !important;
  border-color: rgba(151,181,214,.18) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(2) { background: #3a2a1d !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(3) { background: #292541 !important; }

html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card > div:first-child {
  background: #f8f1e6 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card h3 { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card p { color: #b9c9da !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card > span { color: #9fb2c7 !important; }

html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] {
  background: #10243a !important;
  border-color: rgba(151,181,214,.16) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] p { color: #aebed0 !important; }
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] span { color: #9cc28d !important; }

/* ---------- Civic Passport: warm dark anchor integrated into navy ---------- */
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: transparent !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child {
  background: #102b42 !important;
  border-color: rgba(151,181,214,.12) !important;
  padding: 2rem 0;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child .rounded-full {
  background: #30251b !important;
  border-color: rgba(255,154,85,.22) !important;
  color: #e5b995 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child .grid.h-14 {
  background: #3a2a1d !important;
  border-color: rgba(255,179,122,.22) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child p:not(.text-\[\#ff7a00\]) {
  color: #aebed0 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child {
  background: #34261c !important;
  border-color: rgba(255,179,122,.20) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.26) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:nth-child(1) {
  background: #4a3523 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:nth-child(2) {
  background: #203f4c !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child p {
  color: #d0d8e2 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature {
  border-color: rgba(151,181,214,.18) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(2) { background: #16382f !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(3) { background: #292541 !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(4) { background: #3a2a1d !important; }

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.55) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:last-child {
  color: #dce6f0 !important;
}

/* ---------- Shared buttons / borders / light-mode leftovers ---------- */
html[data-theme="dark"] .kf-explore-page [class*="border-[#e4ded4"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#e5dfd6"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#e2ddd3"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#e3e8db"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#e0e6d7"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#dfe4d3"],
html[data-theme="dark"] .kf-explore-page [class*="border-[#e7dfd2"] {
  border-color: rgba(151,181,214,.16) !important;
}

html[data-theme="dark"] .kf-explore-page [class*="bg-[#ff7a00"] {
  background: #ff7a1a !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-explore-page footer {
  background: #081523 !important;
  color: #8192a8 !important;
}

html[data-theme="dark"] .kf-explore-page footer .text-\[\#102033\] {
  color: #f5f7fb !important;
}

/* ---------- Mobile ---------- */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
    background: rgba(10,24,41,.96) !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   KRUTBHARAT EXPLORE — DARK MODE v11
   FINAL VISUAL CORRECTION PASS
   - one continuous dark page canvas
   - no accidental light/white section surfaces
   - controlled dark color families per card
   - high-contrast typography
   - card-specific decorative accents
   - existing layout/content/functionality preserved
   ========================================================= */

html[data-theme="dark"] .kf-explore-page,
html[data-theme="dark"] .kf-explore-page > .relative.z-10 {
  background: #07111f !important;
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page > .relative.z-10 {
  position: relative;
  isolation: isolate;
}

/* =========================================================
   GLOBAL SECTION CANVAS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #explore,
html[data-theme="dark"] .kf-explore-page #know-india,
html[data-theme="dark"] .kf-explore-page #civic-tools,
html[data-theme="dark"] .kf-explore-page #issue-journey,
html[data-theme="dark"] .kf-explore-page #leagues,
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #07111f !important;
  border-top-color: rgba(145,174,204,.10) !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div,
html[data-theme="dark"] .kf-explore-page #know-india > div,
html[data-theme="dark"] .kf-explore-page #civic-tools > div,
html[data-theme="dark"] .kf-explore-page #issue-journey > div,
html[data-theme="dark"] .kf-explore-page #leagues > div,
html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
}

/* Never let the original light-mode section fills leak through. */
html[data-theme="dark"] .kf-explore-page #explore [class*="bg-[#fbf8f2"],
html[data-theme="dark"] .kf-explore-page #know-india [class*="bg-[#f7f4ed"],
html[data-theme="dark"] .kf-explore-page #civic-tools [class*="bg-[#fbf8f2"],
html[data-theme="dark"] .kf-explore-page #issue-journey [class*="bg-white/25"],
html[data-theme="dark"] .kf-explore-page #leagues [class*="bg-[#fbf8f2"],
html[data-theme="dark"] .kf-explore-page #civic-passport [class*="bg-[#fffaf2"] {
  background: transparent !important;
}

/* =========================================================
   SECTION HEADINGS / LABELS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #explore h2,
html[data-theme="dark"] .kf-explore-page #civic-tools h2,
html[data-theme="dark"] .kf-explore-page #leagues h2,
html[data-theme="dark"] .kf-explore-page #civic-passport h2,
html[data-theme="dark"] .kf-explore-page #know-india h3,
html[data-theme="dark"] .kf-explore-page #issue-journey h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child p,
html[data-theme="dark"] .kf-explore-page #civic-tools > div > div:first-child p,
html[data-theme="dark"] .kf-explore-page #leagues > div > div:first-child p,
html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child > p,
html[data-theme="dark"] .kf-explore-page #civic-passport p {
  color: #aebed0 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child > div:first-child,
html[data-theme="dark"] .kf-explore-page #civic-tools > div > div:first-child,
html[data-theme="dark"] .kf-explore-page #leagues > div > div:first-child > div:first-child,
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child > div:first-child {
  color: #a9bfd3 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button,
html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button:hover {
  background: #10243a !important;
  border-color: rgba(145,174,204,.22) !important;
  color: #f2f6fb !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button:hover {
  background: #17314a !important;
}

/* =========================================================
   HEADER — DARK GLASS, CLEAR GROUP CONTRAST
   ========================================================= */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
  background: linear-gradient(135deg, #142b43 0%, #0b2036 100%) !important;
  border-color: rgba(173,202,229,.23) !important;
  box-shadow: 0 18px 44px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.07) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn {
  background: rgba(32,100,145,.25) !important;
  border-color: rgba(83,188,244,.30) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand {
  background: rgba(105,68,137,.25) !important;
  border-color: rgba(196,143,231,.30) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate {
  background: rgba(48,111,76,.25) !important;
  border-color: rgba(131,205,135,.30) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item {
  background: rgba(18,55,82,.78) !important;
  color: #d2efff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item {
  background: rgba(59,39,79,.78) !important;
  color: #eadbfa !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item {
  background: rgba(30,67,48,.78) !important;
  color: #d9efd4 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item:hover {
  background: #1b4b6c !important;
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item:hover {
  background: #59406f !important;
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item:hover {
  background: #315d42 !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group > div:first-child {
  opacity: 1 !important;
  filter: none !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:first-child { color: #63b9ed !important; }
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:first-child { color: #c48de8 !important; }
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:first-child { color: #8bcf80 !important; }

html[data-theme="dark"] .kf-explore-page .kf-explore-dashboard {
  background: #ff7a1a !important;
  color: #ffffff !important;
  border-color: rgba(255,172,115,.70) !important;
}

/* =========================================================
   CIVIC LEARNING — 8 CONTROLLED COLOR FAMILIES
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #explore button.group {
  border-color: rgba(170,199,225,.20) !important;
  box-shadow: 0 16px 38px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(1) { background: #102b42 !important; border-color: #244c68 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(2) { background: #34261c !important; border-color: #5a4027 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(3) { background: #15372f !important; border-color: #28594d !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(4) { background: #2a2642 !important; border-color: #4a4168 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(5) { background: #12323d !important; border-color: #245767 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(6) { background: #3a291c !important; border-color: #60442a !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(7) { background: #16372f !important; border-color: #2c5c4d !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(8) { background: #302545 !important; border-color: #51406d !important; }

html[data-theme="dark"] .kf-explore-page #explore button.group > div.absolute {
  opacity: .78 !important;
}
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(1) > div.absolute { background: #1b4563 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(2) > div.absolute { background: #513822 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(3) > div.absolute { background: #1e4c40 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(4) > div.absolute { background: #3b3458 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(5) > div.absolute { background: #1b4b58 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(6) > div.absolute { background: #563a22 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(7) > div.absolute { background: #235343 !important; }
html[data-theme="dark"] .kf-explore-page #explore button.group:nth-child(8) > div.absolute { background: #44365e !important; }

html[data-theme="dark"] .kf-explore-page #explore button.group h3 {
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page #explore button.group p {
  color: #bdccdb !important;
}
html[data-theme="dark"] .kf-explore-page #explore button.group span {
  color: #d3dfeb !important;
}
html[data-theme="dark"] .kf-explore-page #explore button.group > div:first-child > div {
  background: #f8f1e6 !important;
  border: 1px solid rgba(255,255,255,.72) !important;
  box-shadow: 0 7px 18px rgba(0,0,0,.18) !important;
}

/* =========================================================
   KNOW INDIA — DARK FRAME + SIX DISTINCT CARDS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #know-india > div > div {
  background: #0d2034 !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] .kf-explore-page #know-india > div > div > .absolute {
  opacity: .16 !important;
}
html[data-theme="dark"] .kf-explore-page #know-india > div > div > .absolute:first-child { background: #1d5272 !important; }
html[data-theme="dark"] .kf-explore-page #know-india > div > div > .absolute:nth-child(2) { background: #4e3826 !important; }

html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card {
  color: #ffffff !important;
  border-color: rgba(164,195,222,.20) !important;
  box-shadow: 0 13px 30px rgba(0,0,0,.17) !important;
}
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(1) { background: #102f47 !important; border-color: #28526e !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(2) { background: #153b3b !important; border-color: #2a5c59 !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(3) { background: #302848 !important; border-color: #4d416d !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(4) { background: #3a2b1d !important; border-color: #60452a !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(5) { background: #173a30 !important; border-color: #2b5d4c !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card:nth-child(6) { background: #202f4b !important; border-color: #394d70 !important; }

html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card h4 { color: #ffffff !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card p { color: #b9cadb !important; }
html[data-theme="dark"] .kf-explore-page #know-india .kf-know-card > div:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
  box-shadow: 0 7px 17px rgba(0,0,0,.16) !important;
}
html[data-theme="dark"] .kf-explore-page #know-india .rounded-full {
  background: rgba(255,255,255,.055) !important;
  border-color: rgba(151,181,214,.17) !important;
  color: #b8c9da !important;
}
html[data-theme="dark"] .kf-explore-page #know-india .border-t {
  border-top-color: rgba(151,181,214,.16) !important;
}

/* =========================================================
   CIVIC PARTICIPATION — 9 DISTINCT DARK COLORS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card {
  color: #ffffff !important;
  border-color: rgba(164,195,222,.20) !important;
  box-shadow: 0 16px 38px rgba(0,0,0,.22) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(1) { background: #102b42 !important; border-color: #28506c !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(2) { background: #302744 !important; border-color: #4e426d !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(3) { background: #16382f !important; border-color: #2b5b4c !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(4) { background: #3a291c !important; border-color: #60442a !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(5) { background: #143544 !important; border-color: #285b70 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(6) { background: #25304c !important; border-color: #3e5073 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(7) { background: #173a31 !important; border-color: #2e604f !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(8) { background: #3b2b20 !important; border-color: #63472e !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(9) { background: #202d48 !important; border-color: #3c4e70 !important; }

html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card > div.absolute {
  opacity: .75 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(1) > div.absolute { background: #1c4765 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(2) > div.absolute { background: #45365d !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(3) > div.absolute { background: #205143 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(4) > div.absolute { background: #563b23 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(5) > div.absolute { background: #205265 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(6) > div.absolute { background: #334264 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(7) > div.absolute { background: #245344 !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(8) > div.absolute { background: #59402a !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card:nth-child(9) > div.absolute { background: #30456a !important; }

html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card h3 { color: #ffffff !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card p { color: #bdccdb !important; }
html[data-theme="dark"] .kf-explore-page #civic-tools .kf-civic-tool-card > div:first-child > div {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
}

/* =========================================================
   CIVIC ISSUE JOURNEY — DARK OUTER WORLD + 7 ACCENTS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child {
  background: #30251b !important;
  border: 1px solid #5a4028 !important;
  border-radius: 30px !important;
  padding: 28px !important;
  box-shadow: 0 18px 44px rgba(0,0,0,.20) !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child h2 {
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child > p {
  color: #c7d0da !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child .rounded-full:not(.bg-\[\#ff7a00\]) {
  background: #412f20 !important;
  border-color: #6a4a2d !important;
  color: #e5c4a5 !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card {
  color: #ffffff !important;
  border-color: rgba(164,195,222,.20) !important;
  box-shadow: 0 14px 32px rgba(0,0,0,.19) !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(1) { background: #102b42 !important; border-color: #28506c !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(2) { background: #2d2744 !important; border-color: #4d416b !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(3) { background: #16382f !important; border-color: #2a5b4b !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(4) { background: #3a291c !important; border-color: #60432a !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(5) { background: #173b48 !important; border-color: #2d6172 !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(6) { background: #17372f !important; border-color: #2b5b4c !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card:nth-child(7) { background: #252f4c !important; border-color: #3d5074 !important; }

html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card p { color: #ffffff !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card span { color: #c1cfdd !important; }
html[data-theme="dark"] .kf-explore-page #issue-journey .kf-journey-card > div:first-child > div {
  background: #f8f1e6 !important;
  color: #263447 !important;
  border: 1px solid rgba(255,255,255,.68) !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .absolute.left-\[12\%\] {
  background: rgba(157,188,216,.25) !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] {
  background: #10243a !important;
  border-color: rgba(151,181,214,.20) !important;
  color: #dce6f0 !important;
}
html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] span,
html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] > div > span {
  color: #aebed0 !important;
}

/* =========================================================
   CIVIC LEAGUES — DARK GREEN + BLUE + AMBER + PURPLE
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden {
  background: #0d1d31 !important;
  border-color: rgba(151,181,214,.20) !important;
  box-shadow: 0 22px 52px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child {
  background: #173a31 !important;
  border-right: 1px solid rgba(112,174,139,.18) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child > .absolute:first-child {
  background: #245444 !important;
  opacity: .65 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child > .absolute:nth-child(2) {
  background: #493323 !important;
  opacity: .55 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child .relative > div:first-child {
  background: #f8f1e6 !important;
  border: 1px solid rgba(255,255,255,.68) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child p {
  color: #b9d9b0 !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:first-child span {
  background: rgba(255,255,255,.07) !important;
  border-color: rgba(174,213,165,.20) !important;
  color: #dcebd7 !important;
}

html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:last-child {
  background: #0f263d !important;
}
html[data-theme="dark"] .kf-explore-page #leagues > div > div.overflow-hidden > div > div:last-child p {
  color: #aebed0 !important;
}

html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card {
  color: #ffffff !important;
  border-color: rgba(164,195,222,.20) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(1) { background: #102b42 !important; border-color: #28506c !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(2) { background: #3a291c !important; border-color: #60442a !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card:nth-child(3) { background: #2d2744 !important; border-color: #4d416b !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card > div:first-child {
  background: #f8f1e6 !important;
  border: 1px solid rgba(255,255,255,.68) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card h3 { color: #ffffff !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card p { color: #bdccdb !important; }
html[data-theme="dark"] .kf-explore-page #leagues .kf-league-feature-card > span { color: #c3d2df !important; }
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] {
  background: #10243a !important;
  border-color: rgba(151,181,214,.20) !important;
}
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] p { color: #b8c8d8 !important; }
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] span { color: #9fc58d !important; }

/* =========================================================
   CIVIC PASSPORT — SIMPLE TWO-PANEL DARK HIERARCHY
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child {
  background: #102b42 !important;
  border-radius: 30px 0 0 30px !important;
  border-color: rgba(151,181,214,.16) !important;
  padding: 2rem !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child {
  background: #34261c !important;
  border-color: #5b4027 !important;
  border-radius: 0 30px 30px 0 !important;
  box-shadow: 0 22px 52px rgba(0,0,0,.25) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child .rounded-full {
  background: #173b50 !important;
  border-color: #2c5c73 !important;
  color: #acd0e5 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child .grid.h-14 {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child h2 {
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child p {
  color: #b9c9da !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:first-child {
  background: #4b3421 !important;
  opacity: .52 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:nth-child(2) {
  background: #1d4350 !important;
  opacity: .42 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child p {
  color: #d0d9e2 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature {
  border-color: rgba(164,195,222,.20) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(1) { background: #102b42 !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(2) { background: #173a31 !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(3) { background: #2d2744 !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(4) { background: #3a291c !important; }
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:last-child {
  color: #e2e9f0 !important;
}

/* =========================================================
   FOOTER
   ========================================================= */
html[data-theme="dark"] .kf-explore-page footer {
  background: #081523 !important;
  border-top-color: rgba(145,174,204,.12) !important;
}
html[data-theme="dark"] .kf-explore-page footer .text-\[\#102033\] { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-explore-page footer .text-\[\#8b9096\],
html[data-theme="dark"] .kf-explore-page footer .text-\[\#a0a4aa\] { color: #8192a8 !important; }

/* =========================================================
   MOBILE — keep the same visual system without changing layout
   ========================================================= */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child,
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child {
    border-radius: 28px !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   KRUTBHARAT EXPLORE — DARK MODE v12
   TARGETED VISUAL CORRECTIONS
   - orange "Participate." in the page intro
   - simplified Civic Passport composition
   - refined light process strips
   - refined Document → Route → Handoff pills
   - refined Guidance Layer strip
   - Explore Civic Life header sits directly on page canvas
   ========================================================= */

html[data-theme="dark"] .kf-explore-page .kf-participate-orange {
  color: #ff7a1a !important;
}

/* =========================================================
   EXPLORE CIVIC LIFE HEADER — REMOVE THE BOX FEEL
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child p {
  color: #b3c2d2 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child > div:first-child {
  background: rgba(16,36,58,.72) !important;
  border-color: rgba(145,174,204,.20) !important;
  color: #b8cde0 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button {
  background: #10243a !important;
  border-color: rgba(145,174,204,.26) !important;
  color: #f4f7fb !important;
  box-shadow: 0 10px 24px rgba(0,0,0,.16) !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button:hover {
  background: #17314a !important;
  border-color: rgba(255,139,50,.45) !important;
  color: #ffffff !important;
}

/* =========================================================
   CIVIC PASSPORT — COHESIVE TWO-TONE DARK COMPOSITION
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #07111f !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child {
  background: #102b42 !important;
  border: 1px solid rgba(90,139,177,.25) !important;
  border-radius: 30px 0 0 30px !important;
  padding: 2rem !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child > div:first-child {
  background: #173b50 !important;
  border-color: rgba(112,177,214,.24) !important;
  color: #c1dced !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child .grid.h-14 {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.72) !important;
  box-shadow: 0 8px 18px rgba(0,0,0,.18) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child p {
  color: #b9c9da !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child {
  background: #30241b !important;
  border: 1px solid rgba(151,112,72,.38) !important;
  border-radius: 0 30px 30px 0 !important;
  box-shadow: 0 22px 52px rgba(0,0,0,.25) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:first-child {
  background: #533923 !important;
  opacity: .38 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child > .absolute:nth-child(2) {
  background: #1c4650 !important;
  opacity: .30 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child p {
  color: #c6d0db !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature {
  border-color: rgba(164,195,222,.20) !important;
  box-shadow: 0 9px 22px rgba(0,0,0,.12) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(1) {
  background: #102b42 !important;
  border-color: #28506c !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(2) {
  background: #173a31 !important;
  border-color: #2d5f4e !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(3) {
  background: #2d2744 !important;
  border-color: #4d416b !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(4) {
  background: #3a291c !important;
  border-color: #60442a !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:last-child {
  color: #edf2f7 !important;
}

/* =========================================================
   LEARN → ACT → VERIFY → EARN → COMPETE STRIP
   Keep light, but make it intentionally connected to the system.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] {
  background: #e9f0dc !important;
  border-color: #d1ddbc !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.55) !important;
}

html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] p {
  color: #263447 !important;
  font-weight: 900 !important;
}

html[data-theme="dark"] .kf-explore-page #leagues .bg-\[\#f4f8ea\] span {
  color: #4e742d !important;
  font-weight: 900 !important;
}

/* =========================================================
   DOCUMENT → ROUTE → HANDOFF PILLS
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child > div:last-child {
  color: #263447 !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child > div:last-child span.rounded-full {
  background: #f8f1e6 !important;
  border-color: #e2d8c9 !important;
  color: #263447 !important;
  box-shadow: 0 5px 12px rgba(0,0,0,.10) !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey > div > div > div:first-child > div:last-child > span:not(.rounded-full) {
  color: #ff7a1a !important;
  font-size: 13px !important;
  font-weight: 900 !important;
}

/* =========================================================
   KRUTBHARAT GUIDANCE LAYER
   Slightly darker warm cream; strong navy typography.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] {
  background: #e8e1d5 !important;
  border-color: #d4c9b9 !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.48) !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] span:first-child {
  color: #536477 !important;
  font-weight: 900 !important;
}

html[data-theme="dark"] .kf-explore-page #issue-journey .rounded-\[22px\] span:last-child {
  color: #263447 !important;
  font-weight: 900 !important;
}

/* =========================================================
   RESPONSIVE PASSPORT
   ========================================================= */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child,
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child {
    border-radius: 28px !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   KRUTBHARAT EXPLORE — DARK MODE v13
   FINAL VISUAL CORRECTIONS
   - Civic Passport matches the homepage dark-card aesthetic
   - Passport right panel is dark navy/blue instead of white
   - Explore Civic Life heading has no rectangular background
   - Preserve existing layout/content/functionality
   ========================================================= */

html[data-theme="dark"] .kf-explore-page #explore {
  background: #07111f !important;
  border-top-color: rgba(145,174,204,.10) !important;
}

/* The Explore Civic Life heading must sit directly on the page canvas. */
html[data-theme="dark"] .kf-explore-page #explore > div {
  background: transparent !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child {
  background: transparent !important;
  background-color: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child p {
  color: #b8c6d6 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child > div:first-child {
  background: rgba(16,36,58,.72) !important;
  border-color: rgba(145,174,204,.20) !important;
  color: #c3d1df !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child button {
  background: #10243a !important;
  border-color: rgba(145,174,204,.25) !important;
  color: #f7f8fb !important;
}

/* =========================================================
   CIVIC PASSPORT — HOMEPAGE-STYLE DARK COMPOSITION
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #07111f !important;
  border-top-color: rgba(145,174,204,.10) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
}

/* Left passport panel */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child {
  background:
    radial-gradient(circle at 92% 8%, rgba(64,143,196,.13), transparent 32%),
    #10243a !important;
  border: 1px solid rgba(111,160,197,.22) !important;
  border-radius: 32px 0 0 32px !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child > div:first-child {
  background: rgba(16,42,65,.86) !important;
  border-color: rgba(112,177,214,.24) !important;
  color: #bfd2e2 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child .grid.h-14 {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.72) !important;
  box-shadow: 0 8px 18px rgba(0,0,0,.20) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child p {
  color: #b8c8d8 !important;
}

/* Right Passport panel — dark navy/blue, never white */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child {
  position: relative !important;
  background:
    radial-gradient(circle at 92% 8%, rgba(63,145,201,.12), transparent 26%),
    radial-gradient(circle at 4% 96%, rgba(255,122,26,.06), transparent 24%),
    #0d1d31 !important;
  border: 1px solid rgba(113,157,193,.23) !important;
  border-radius: 0 32px 32px 0 !important;
  box-shadow:
    0 22px 52px rgba(0,0,0,.24),
    inset 0 1px 0 rgba(255,255,255,.025) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:first-child {
  background: #21455e !important;
  opacity: .42 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:nth-child(2) {
  background: #2c3e57 !important;
  opacity: .32 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child p {
  color: #b8c7d7 !important;
}

/* Four Passport cards remain deliberately different. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(1) {
  background: #102b42 !important;
  border-color: #28506c !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(2) {
  background: #173a31 !important;
  border-color: #2d5f4e !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(3) {
  background: #2d2744 !important;
  border-color: #4d416b !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(4) {
  background: #3a291c !important;
  border-color: #60442a !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.68) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:last-child {
  color: #f0f4f8 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .bg-\[\#ff7a00\] {
  background: #ff7a1a !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .text-\[\#9a9fa5\] {
  color: #8fa0b0 !important;
}

/* =========================================================
   RESPONSIVE PASSPORT
   ========================================================= */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child,
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child {
    border-radius: 28px !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   CIVIC PASSPORT — SINGLE COHESIVE DARK COMPOSITION (v15)
   Match the visual structure of the Civic Leagues section:
   one rounded shell, two integrated panels, no outer color block.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #071525 !important;
  border-top-color: rgba(148, 176, 202, 0.10) !important;
}

/* The section's content wrapper becomes the only outer shell. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  max-width: 90rem !important;
  padding: 0 !important;
  margin-top: 3.5rem !important;
  margin-bottom: 3.5rem !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0 !important;
  overflow: visible !important;
  box-shadow: none !important;
}

/* The inner Passport composition is now the only visible boundary.
   It gets the curved corners directly around the two panels. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div {
  gap: 0 !important;
  width: 100% !important;
  background: #0b1d31 !important;
  border: 1px solid rgba(126, 162, 191, 0.24) !important;
  border-radius: 34px !important;
  overflow: hidden !important;
  box-shadow:
    0 22px 55px rgba(0,0,0,.20),
    inset 0 1px 0 rgba(255,255,255,.025) !important;
}

/* Left panel — lighter navy, like the green left panel in Civic Leagues. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child {
  min-height: 100% !important;
  background:
    radial-gradient(circle at 92% 8%, rgba(66,145,196,.10), transparent 30%),
    radial-gradient(circle at 8% 94%, rgba(66,145,196,.055), transparent 28%),
    linear-gradient(145deg, #102a40 0%, #10283d 58%, #0f263a 100%) !important;
  border: 0 !important;
  border-right: 1px solid rgba(139,177,204,.14) !important;
  border-radius: 0 !important;
  padding: 2.5rem !important;
  box-shadow: none !important;
}

/* Right panel — deeper navy. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child {
  position: relative !important;
  min-height: 100% !important;
  background:
    radial-gradient(circle at 94% 7%, rgba(64,139,190,.085), transparent 24%),
    radial-gradient(circle at 5% 96%, rgba(255,122,26,.025), transparent 22%),
    #0b1d31 !important;
  border: 0 !important;
  border-radius: 0 !important;
  padding: 2.5rem !important;
  box-shadow: none !important;
}

/* Shared typography — bright and calm. */
html[data-theme="dark"] .kf-explore-page #civic-passport h2 {
  color: #f8fafc !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport p {
  color: #a9b8c9 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child p.text-\[\#ff7a00\] {
  color: #ff7a00 !important;
}

/* Civic record pill. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child > div:first-child {
  background: rgba(7,21,37,.38) !important;
  border-color: rgba(105,163,197,.24) !important;
  color: #a9bfd1 !important;
}

/* Passport icon. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child .grid.h-14 {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.55) !important;
  box-shadow: 0 8px 20px rgba(0,0,0,.18) !important;
}

/* Four cards — distinct but all belong to the same dark system. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(1) {
  background: #10304a !important;
  border-color: rgba(68,137,182,.38) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(2) {
  background: #12382f !important;
  border-color: rgba(65,137,111,.38) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(3) {
  background: #2b2544 !important;
  border-color: rgba(112,91,158,.38) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature:nth-child(4) {
  background: #3a281b !important;
  border-color: rgba(145,98,55,.38) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature {
  box-shadow: 0 8px 22px rgba(0,0,0,.12) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:first-child {
  background: #f8f1e6 !important;
  border-color: rgba(255,255,255,.55) !important;
  color: #102033 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature > span:last-child {
  color: #f8fafc !important;
}

/* Orange CTA. */
html[data-theme="dark"] .kf-explore-page #civic-passport button.bg-\[\#ff7a00\] {
  background: #ff7a00 !important;
  color: #fff !important;
  box-shadow: 0 12px 26px rgba(255,122,0,.18) !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport button.bg-\[\#ff7a00\]:hover {
  background: #ef6c00 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport .text-\[\#9a9fa5\] {
  color: #8fa2b4 !important;
}

/* Subtle circles — atmospheric, never large solid blobs. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:first-child {
  background: rgba(53,105,136,.22) !important;
  opacity: .42 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:nth-child(2) {
  background: rgba(58,86,101,.18) !important;
  opacity: .35 !important;
}

@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport > div {
    margin-top: 2rem !important;
    margin-bottom: 2rem !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div {
    border-radius: 28px !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child {
    border-right: 0 !important;
    border-bottom: 1px solid rgba(139,177,204,.14) !important;
    padding: 2rem !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child {
    padding: 2rem !important;
  }
}
`}</style>

      <div className="relative z-10 kf-explore-sections-shell">
      {/* EXPLORE */}
      <section id="explore" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fbf8f2]/85">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="kf-explore-civic-life-chip inline-flex items-center gap-2 rounded-full border border-[#e9e0d3] bg-white/75 px-3.5 py-1.5">
                <span className="kf-explore-civic-life-dot h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                <span className="kf-explore-civic-life-label text-[10px] font-black uppercase tracking-[0.2em] text-[#7f858b]">
                  {text.exploreLabel}
                </span>
              </div>
              <h2 className="mt-4 text-[36px] font-black leading-[1.03] tracking-[-0.04em] text-[#102033] md:text-[48px]">
                {text.exploreTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#697581] md:text-[17px]">
                {text.exploreDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/explore")}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#d5cfc4] bg-white px-6 py-3 text-[12px] font-black text-[#263447] shadow-sm transition hover:-translate-y-0.5 hover:border-[#ffbf8b] hover:shadow-md"
            >
              {text.exploreAll}
            </button>
          </div>

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic, index) => {
              const cardTints = [
                "#edf5fb",
                "#fff0e0",
                "#f1f5e8",
                "#f4edf8",
                "#edf5f0",
                "#fff4df",
                "#eef4f8",
                "#f7eee6",
              ];
              const tint = cardTints[index % cardTints.length];

              return (
                <button
                  key={topic.path}
                  type="button"
                  onClick={() => router.push(topic.path)}
                  className="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-[#e4ded4] bg-white p-5 text-left shadow-[0_10px_26px_rgba(16,27,43,0.045)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_42px_rgba(16,27,43,0.09)]"
                >
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-80 transition duration-300 group-hover:scale-125"
                    style={{ background: tint }}
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-[18px] text-[24px]"
                      style={{ background: tint }}
                    >
                      {topic.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-[0.18em] text-[#a1a6ab]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="relative mt-7 max-w-[235px] text-[18px] font-black leading-[1.08] tracking-[-0.02em] text-[#102033]">
                    {text[topic.titleKey as keyof typeof text] as string}
                  </h3>
                  <p className="relative mt-2.5 max-w-[250px] text-[12.5px] leading-5 text-[#707b86]">
                    {text[topic.descriptionKey as keyof typeof text] as string}
                  </p>

                  <div className="relative mt-5 inline-flex items-center gap-2 text-[11px] font-black text-[#ff7a00]">
                    {language === "en"
                      ? "Explore"
                      : language === "hi"
                      ? "देखें"
                      : "पाहा"}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* KNOW INDIA */}
      <section
        id="know-india"
        className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#f7f4ed]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="overflow-hidden rounded-[36px] border border-[#e2ddd3] bg-[#fffdf9] shadow-[0_20px_55px_rgba(16,27,43,0.055)]">
            <div className="relative overflow-hidden px-7 py-10 md:px-10 md:py-12">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#e5f0f8]" />
              <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#fff0dc]" />

              <div className="relative grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e4ec] bg-white px-3.5 py-1.5">
                      <span className="kf-know-india-discover-dot h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#708397]">
                        {language === "en"
                          ? "Discover India"
                          : language === "hi"
                          ? "भारत को जानें"
                          : "भारत जाणून घ्या"}
                      </span>
                    </div>

                    <h2 className="mt-6 max-w-xl text-[38px] font-black leading-[0.98] tracking-[-0.045em] text-[#102033] md:text-[54px]">
                      {language === "en" ? (
                        <>
                          Start with <span className="text-[#ff7a00]">India</span>.
                        </>
                      ) : language === "hi" ? (
                        "भारत से शुरुआत करें।"
                      ) : (
                        "भारतापासून सुरुवात करा."
                      )}
                    </h2>

                    <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#697581] md:text-[17px]">
                      {language === "en"
                        ? "Know India is your visual starting point for understanding the country — its States and Union Territories, people, places, culture, history, geography and civic context."
                        : language === "hi"
                        ? "Know India भारत को समझने की आपकी दृश्य शुरुआत है — राज्यों और केंद्र शासित प्रदेशों, लोगों, स्थानों, संस्कृति, इतिहास, भूगोल और नागरिक संदर्भ के साथ।"
                        : "Know India हा भारत समजून घेण्याचा तुमचा दृश्य प्रारंभबिंदू आहे — राज्ये व केंद्रशासित प्रदेश, लोक, ठिकाणे, संस्कृती, इतिहास, भूगोल आणि नागरी संदर्भ यांचा परिचय करून देतो."}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {(language === "en"
                        ? ["States & UTs", "Culture", "History", "Geography", "Civic India"]
                        : language === "hi"
                        ? ["राज्य और UTs", "संस्कृति", "इतिहास", "भूगोल", "नागरिक भारत"]
                        : ["राज्ये व केंद्रशासित प्रदेश", "संस्कृती", "इतिहास", "भूगोल", "नागरी भारत"]
                      ).map((label) => (
                        <span
                          key={label}
                          className="rounded-full border border-[#e4ded4] bg-white px-3 py-1.5 text-[10px] font-bold text-[#657080]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex justify-center lg:justify-start">
                      <img
                        src="/india-map.png"
                        alt={
                          language === "en"
                            ? "Illustrated map of India"
                            : language === "hi"
                            ? "भारत का मानचित्र"
                            : "भारताचा नकाशा"
                        }
                        className="h-auto w-[245px] max-w-full object-contain drop-shadow-[0_14px_24px_rgba(16,32,51,0.08)] md:w-[285px]"
                      />
                    </div>
                  </div>

                  <div className="mt-9">
                    <button
                      type="button"
                      onClick={() => router.push("/know-india")}
                      className="kf-know-india-explore-button kf-explore-know-india-final inline-flex items-center gap-2 rounded-full bg-[#ff7a00] px-6 py-3.5 text-[12px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00] hover:shadow-[0_18px_32px_rgba(255,122,0,0.22)]"
                    >
                      {language === "en"
                        ? "Explore Know India"
                        : language === "hi"
                        ? "भारत जानें"
                        : "भारत जाणून घ्या"}
                      <span>→</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff7a00]">
                        {language === "en"
                          ? "What you can discover"
                          : language === "hi"
                          ? "आप क्या जान सकते हैं"
                          : "तुम्ही काय जाणून घेऊ शकता"}
                      </p>
                      <h3 className="mt-2 text-[24px] font-black tracking-[-0.03em] text-[#102033] md:text-[30px]">
                        {language === "en"
                          ? "India, one layer at a time."
                          : language === "hi"
                          ? "भारत को परत-दर-परत जानें।"
                          : "भारताची ओळख टप्प्याटप्प्याने."}
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        icon: "🗺️",
                        title:
                          language === "en"
                            ? "Navigate the India Map"
                            : language === "hi"
                            ? "भारत के मानचित्र पर जाएँ"
                            : "भारताच्या नकाशातून फिरा",
                        description:
                          language === "en"
                            ? "Use the interactive map to select a State or Union Territory and open its detailed State Spotlight."
                            : language === "hi"
                            ? "इंटरैक्टिव मानचित्र से किसी राज्य या केंद्र शासित प्रदेश को चुनें और उसका विस्तृत State Spotlight खोलें।"
                            : "इंटरॅक्टिव्ह नकाशातून राज्य किंवा केंद्रशासित प्रदेश निवडा आणि त्याचा सविस्तर State Spotlight उघडा.",
                        tint: "#edf5fb",
                      },
                      {
                        icon: "🧭",
                        title:
                          language === "en"
                            ? "States & Union Territories"
                            : language === "hi"
                            ? "राज्य और केंद्र शासित प्रदेश"
                            : "राज्ये आणि केंद्रशासित प्रदेश",
                        description:
                          language === "en"
                            ? "Discover capitals, regions and state-level civic context across India's States and UTs."
                            : language === "hi"
                            ? "भारत के राज्यों और केंद्र शासित प्रदेशों की राजधानियाँ, क्षेत्र और नागरिक संदर्भ जानें।"
                            : "भारताच्या राज्ये आणि केंद्रशासित प्रदेशांच्या राजधानी, प्रदेश आणि नागरी संदर्भ जाणून घ्या.",
                        tint: "#fff0e0",
                      },
                      {
                        icon: "🎭",
                        title:
                          language === "en"
                            ? "Culture & Heritage"
                            : language === "hi"
                            ? "संस्कृति और विरासत"
                            : "संस्कृती आणि वारसा",
                        description:
                          language === "en"
                            ? "Explore traditions, languages, festivals, food, arts and heritage that shape each region."
                            : language === "hi"
                            ? "हर क्षेत्र की परंपराओं, भाषाओं, त्योहारों, भोजन, कला और विरासत को जानें।"
                            : "प्रत्येक प्रदेशाची परंपरा, भाषा, सण, खाद्यसंस्कृती, कला आणि वारसा जाणून घ्या.",
                        tint: "#f7eee6",
                      },
                      {
                        icon: "🏛️",
                        title:
                          language === "en"
                            ? "History & Identity"
                            : language === "hi"
                            ? "इतिहास और पहचान"
                            : "इतिहास आणि ओळख",
                        description:
                          language === "en"
                            ? "Understand the historical journeys, movements, landmarks and identities that shaped today's India."
                            : language === "hi"
                            ? "आज के भारत को आकार देने वाले इतिहास, आंदोलनों, स्थलों और पहचानों को समझें।"
                            : "आजच्या भारताला आकार देणारा इतिहास, चळवळी, स्थळे आणि ओळखी समजून घ्या.",
                        tint: "#f1f5e8",
                      },
                      {
                        icon: "🏔️",
                        title:
                          language === "en"
                            ? "Geography & Landscapes"
                            : language === "hi"
                            ? "भूगोल और भौगोलिक विविधता"
                            : "भूगोल आणि भौगोलिक विविधता",
                        description:
                          language === "en"
                            ? "See how mountains, plains, coasts, rivers, climate and landscapes differ across India."
                            : language === "hi"
                            ? "भारत के पर्वत, मैदान, तट, नदियाँ, जलवायु और भौगोलिक विविधता को देखें।"
                            : "भारताची पर्वतश्रेणी, मैदाने, किनारे, नद्या, हवामान आणि भौगोलिक विविधता समजून घ्या.",
                        tint: "#eaf4f2",
                      },
                      {
                        icon: "🇮🇳",
                        title:
                          language === "en"
                            ? "India in Civic Context"
                            : language === "hi"
                            ? "नागरिक संदर्भ में भारत"
                            : "नागरी संदर्भातील भारत",
                        description:
                          language === "en"
                            ? "Connect places and people with how India is organised, governed and experienced by citizens."
                            : language === "hi"
                            ? "स्थान और लोगों को भारत की प्रशासनिक व्यवस्था, शासन और नागरिक जीवन से जोड़ें।"
                            : "ठिकाणे आणि लोक यांचा भारताची प्रशासकीय रचना, शासन आणि नागरी जीवनाशी संबंध समजून घ्या.",
                        tint: "#f4edf8",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="kf-know-card group rounded-[24px] border border-[#e4ded4] bg-[#fffdfa] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(16,27,43,0.07)]"
                      >
                        <div
                          className="grid h-11 w-11 place-items-center rounded-[16px] text-[21px]"
                          style={{ background: item.tint }}
                        >
                          {item.icon}
                        </div>
                        <h4 className="mt-4 text-[15px] font-black leading-tight text-[#102033]">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-[12px] leading-5 text-[#707b86]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mt-2 px-1 pb-1 pt-1 md:px-3">
                <div className="flex items-center gap-3 border-t border-[#eee8df] pt-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff4e8] text-[15px]">
                    🗺️
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ff7a00]">
                      {language === "en"
                        ? "Start with the map"
                        : language === "hi"
                        ? "मानचित्र से शुरुआत करें"
                        : "नकाशापासून सुरुवात करा"}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-[#7a8590]">
                      {language === "en"
                        ? "Choose a State or UT and explore its people, places, culture, history and geography."
                        : language === "hi"
                        ? "किसी राज्य या UT को चुनें और उसके लोगों, स्थानों, संस्कृति, इतिहास और भूगोल को जानें।"
                        : "राज्य किंवा UT निवडा आणि तेथील लोक, ठिकाणे, संस्कृती, इतिहास आणि भूगोल जाणून घ्या."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CIVIC ISSUE JOURNEY */}
      <section id="issue-journey" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-white/25">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#efd9c3] bg-[#fff4e7] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8d7158]">
                  {text.issueJourneyLabel}
                </span>
              </div>

              <h2 className="mt-4 max-w-[560px] text-[36px] font-black leading-[1.03] tracking-[-0.04em] text-[#102033] md:text-[48px]">
                {text.issueJourneyTitle}
              </h2>

              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#697581] md:text-[16px]">
                {text.issueJourneyDescription}
              </p>

              <button
                type="button"
                onClick={() => router.push("/report-issue")}
                className="mt-7 inline-flex items-center rounded-full bg-[#ff7a00] px-6 py-3.5 text-[12px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00] hover:shadow-[0_18px_32px_rgba(255,122,0,0.22)]"
              >
                {text.reportIssueNow}
              </button>

              <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8f969d]">
                <span className="rounded-full border border-[#e5dfd6] bg-white px-3 py-1.5">Document</span>
                <span className="text-[#ff7a00]">→</span>
                <span className="rounded-full border border-[#e5dfd6] bg-white px-3 py-1.5">Route</span>
                <span className="text-[#ff7a00]">→</span>
                <span className="rounded-full border border-[#e5dfd6] bg-white px-3 py-1.5">Handoff</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[12%] right-[12%] top-[34px] hidden h-px bg-[#e3ddd4] lg:block" />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [text.issueStep1, "👀"],
                  [text.issueStep2, "📋"],
                  [text.issueStep3, "🏛️"],
                  [text.issueStep4, "📝"],
                  [text.issueStep5, "↗️"],
                  [text.issueStep6, "✅"],
                  [text.issueStep7, "🔎"],
                ].map(([label, icon], index) => (
                  <div
                    key={label}
                    className={`kf-journey-card group relative rounded-[24px] border border-[#e5dfd6] bg-white p-4 shadow-[0_10px_28px_rgba(16,27,43,0.045)] transition duration-300 hover:-translate-y-1 ${
                      index === 4 ? "border-[#ffd0a5] bg-[#fff7ee]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-[16px] text-[21px] ${
                          index === 4 ? "bg-[#ffe1c5]" : "bg-[#f5efe6]"
                        }`}
                      >
                        {icon}
                      </div>
                      <span className="text-[10px] font-black tracking-[0.18em] text-[#a4a7aa]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="mt-5 text-[13px] font-black leading-5 text-[#263447]">
                      {label}
                    </p>

                    {index < 6 && (
                      <span className="mt-4 hidden text-[13px] font-bold text-[#d0c8bd] lg:block">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[22px] border border-[#e4ded4] bg-[#fbf8f2] px-5 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#969ba0]">
                    KrutBharat guidance layer
                  </span>
                  <span className="text-[12px] font-bold text-[#657080]">
                    Prepare → Hand off → Continue with the official system
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIVIC SENSE */}
      <section
        id="civic-sense"
        className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fbf8f2]/75"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="kf-civic-sense-explore-shell grid gap-0 overflow-hidden rounded-[32px] border border-[#e2ddd5] bg-white shadow-[0_18px_52px_rgba(35,47,58,0.055)] lg:grid-cols-[0.78fr_1.22fr]">
            <div className="kf-civic-sense-explore-left relative overflow-hidden p-7 md:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#dceff1]/75" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-[#ffe4cb]/70" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d8e6df] bg-white/62 px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#678173]">
                    {civicSenseExploreContent[language].label}
                  </span>
                </div>

                <div className="mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-[#e3ddd4] bg-[#fff0df] text-2xl shadow-sm">
                  🤝
                </div>

                <h2 className="mt-5 max-w-xl text-[38px] font-black leading-[1.02] tracking-[-0.04em] text-[#102033] md:text-[52px]">
                  {civicSenseExploreContent[language].title}
                </h2>

                <p className="mt-3 max-w-xl text-[17px] font-black leading-6 text-[#ff7a00] md:text-[18px]">
                  {civicSenseExploreContent[language].subtitle}
                </p>

                <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#65717d] md:text-[16px]">
                  {civicSenseExploreContent[language].description}
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/civic-sense")}
                  className="mt-7 inline-flex items-center rounded-full bg-[#ff7a00] px-6 py-3.5 text-[12px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
                >
                  {civicSenseExploreContent[language].action}
                </button>
              </div>
            </div>

            <div className="kf-civic-sense-explore-right p-6 md:p-8 lg:p-9">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8a929c]">
                    {civicSenseExploreContent[language].insideLabel}
                  </p>
                  <h3 className="mt-2 text-[28px] font-black leading-[1.04] tracking-[-0.03em] text-[#102033] md:text-[34px]">
                    {civicSenseExploreContent[language].insideTitle}
                  </h3>
                </div>

                <div className="hidden h-11 w-11 place-items-center rounded-full border border-[#ddd7ce] bg-[#fffdf9] text-[17px] text-[#ff7a00] shadow-sm sm:grid">
                  →
                </div>
              </div>

              <div className="mt-7 grid gap-3">
                {[
                  {
                    number: "01",
                    icon: "🧭",
                    title: civicSenseExploreContent[language].item1Title,
                    description:
                      civicSenseExploreContent[language].item1Description,
                    className: "kf-civic-sense-explore-item-blue",
                  },
                  {
                    number: "02",
                    icon: "🧹",
                    title: civicSenseExploreContent[language].item2Title,
                    description:
                      civicSenseExploreContent[language].item2Description,
                    className: "kf-civic-sense-explore-item-green",
                  },
                  {
                    number: "03",
                    icon: "💭",
                    title: civicSenseExploreContent[language].item3Title,
                    description:
                      civicSenseExploreContent[language].item3Description,
                    className: "kf-civic-sense-explore-item-purple",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className={`kf-civic-sense-explore-item ${item.className} rounded-[22px] border p-4 md:p-5`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/55 bg-[#fffdf9] text-[20px] shadow-sm">
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black tracking-[0.16em] text-[#89949e]">
                            {item.number}
                          </span>
                          <h4 className="text-[17px] font-black leading-tight text-[#263a4e] md:text-[18px]">
                            {item.title}
                          </h4>
                        </div>
                        <p className="mt-1.5 text-[12px] leading-6 text-[#647482]">
                          {item.description}
                        </p>
                      </div>

                      <span className="hidden text-[18px] text-[#8a949c] sm:block">
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="kf-civic-sense-explore-strip mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full border px-4 py-3">
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#7d8994]">
                  {civicSenseExploreContent[language].stripLeft}
                </span>
                <span className="text-[10px] font-black text-[#6f8d5b]">
                  {civicSenseExploreContent[language].stripRight}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AUTHORITIES */}
      <section
        id="responsible-authorities"
        className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fbf8f2]/75"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
              {/* RESPONSIBLE AUTHORITIES */}
              <div className="kf-ra-explore-shell mt-10 overflow-hidden rounded-[32px] border border-[#dfe6df] shadow-[0_18px_50px_rgba(35,47,58,0.055)]">
                <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
                  <div className="kf-ra-explore-left relative overflow-hidden p-7 md:p-10">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#dfeaf3]/75" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[#f3e6f6]/75" />
                    <div className="relative">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e1e6] bg-white/70 px-3.5 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#697987]">
                          {responsibleAuthoritiesExploreContent[language].label}
                        </span>
                      </div>

                      <div className="mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-[#ddd6e5] bg-[#f4edf8] text-2xl shadow-sm">
                        🏛️
                      </div>

                      <h3 className="mt-5 max-w-xl text-[34px] font-black leading-[1.04] tracking-[-0.04em] text-[#102033] md:text-[47px]">
                        {responsibleAuthoritiesExploreContent[language].title}
                      </h3>

                      <p className="mt-3 max-w-xl text-[16px] font-black leading-6 text-[#7a5a8a] md:text-[18px]">
                        {responsibleAuthoritiesExploreContent[language].subtitle}
                      </p>

                      <p className="mt-4 max-w-xl text-[14px] leading-7 text-[#697581] md:text-[15px]">
                        {responsibleAuthoritiesExploreContent[language].description}
                      </p>

                      <button
                        type="button"
                        onClick={() => router.push("/responsible-authorities")}
                        className="mt-7 inline-flex items-center rounded-full bg-[#ff7a00] px-6 py-3.5 text-[12px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
                      >
                        {responsibleAuthoritiesExploreContent[language].action}
                      </button>
                    </div>
                  </div>

                  <div className="kf-ra-explore-right p-6 md:p-8 lg:p-9">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b939d]">
                          {responsibleAuthoritiesExploreContent[language].insideLabel}
                        </p>
                        <h4 className="mt-2 text-[27px] font-black leading-[1.04] tracking-[-0.03em] text-[#102033] md:text-[34px]">
                          {responsibleAuthoritiesExploreContent[language].insideTitle}
                        </h4>
                      </div>
                      <div className="hidden h-11 w-11 place-items-center rounded-full border border-[#ddd7ce] bg-[#fffdf9] text-[17px] text-[#ff7a00] shadow-sm sm:grid">
                        →
                      </div>
                    </div>

                    <div className="mt-7 grid gap-3">
                      {[
                        {
                          number: "01",
                          icon: "🏛️",
                          title: responsibleAuthoritiesExploreContent[language].item1Title,
                          description: responsibleAuthoritiesExploreContent[language].item1Description,
                          className: "kf-ra-explore-item-blue",
                        },
                        {
                          number: "02",
                          icon: "🗳️",
                          title: responsibleAuthoritiesExploreContent[language].item2Title,
                          description: responsibleAuthoritiesExploreContent[language].item2Description,
                          className: "kf-ra-explore-item-purple",
                        },
                        {
                          number: "03",
                          icon: "🏢",
                          title: responsibleAuthoritiesExploreContent[language].item3Title,
                          description: responsibleAuthoritiesExploreContent[language].item3Description,
                          className: "kf-ra-explore-item-green",
                        },
                      ].map((item) => (
                        <div
                          key={item.number}
                          className={`group grid gap-4 rounded-[24px] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,27,43,0.055)] sm:grid-cols-[46px_1fr_auto] sm:items-center ${item.className}`}
                        >
                          <div className="grid h-11 w-11 place-items-center rounded-[17px] bg-white text-[20px] shadow-sm">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-black tracking-[0.18em] text-[#8e9aa4]">
                                {item.number}
                              </span>
                              <h5 className="text-[16px] font-black leading-tight text-[#102033]">
                                {item.title}
                              </h5>
                            </div>
                            <p className="mt-1.5 text-[12.5px] leading-5 text-[#657482]">
                              {item.description}
                            </p>
                          </div>
                          <span className="hidden text-[18px] text-[#8297a7] transition-transform group-hover:translate-x-1 sm:block">
                            →
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="kf-ra-explore-strip mt-5 flex flex-col gap-2 rounded-[22px] border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#7c8c97]">
                        {responsibleAuthoritiesExploreContent[language].stripLeft}
                      </p>
                      <span className="text-[11.5px] font-bold text-[#7b6e8c]">
                        {responsibleAuthoritiesExploreContent[language].stripRight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </section>

      {/* CIVIC PARTICIPATION TOOLS */}
      <section id="civic-tools" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fbf8f2]/75">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e0d3] bg-white/80 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7f858b]">
                {civicToolsContent[language].label}
              </span>
            </div>

            <h2 className="mt-4 text-[36px] font-black leading-[1.03] tracking-[-0.04em] text-[#102033] md:text-[50px]">
              {civicToolsContent[language].title}
            </h2>

            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#697581] md:text-[17px]">
              {civicToolsContent[language].description}
            </p>
          </div>

          <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {civicToolsByLanguage[language]
              .slice()
              .sort((a, b) => {
                if (a.path === "/know-india") return -1;
                if (b.path === "/know-india") return 1;
                return 0;
              })
              .map((tool, index) => {
              const tints = [
                ["#edf5fb", "#a9cde7"],
                ["#fff0e0", "#f2b777"],
                ["#eef5e8", "#b8cf91"],
                ["#f4edf8", "#c8a7dc"],
                ["#fff4df", "#f0c37b"],
                ["#eaf4f2", "#9fcfc5"],
              ];
              const [tint, accent] = tints[index % tints.length];

              return (
                <button
                  key={tool.path}
                  type="button"
                  onClick={() => router.push(tool.path)}
                  className="kf-civic-tool-card group relative min-h-[250px] overflow-hidden rounded-[26px] border border-[#e4ded4] bg-white p-5 text-left shadow-[0_10px_26px_rgba(16,27,43,0.045)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_42px_rgba(16,27,43,0.09)]"
                >
                  <div
                    className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-80 transition duration-300 group-hover:scale-125"
                    style={{ background: tint }}
                  />

                  <div className="relative flex items-start justify-between">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-[18px] text-[24px]"
                      style={{ background: tint }}
                    >
                      {tool.icon}
                    </div>

                    <span
                      className="rounded-full px-2.5 py-1 text-[9px] font-black tracking-[0.16em]"
                      style={{
                        background: tint,
                        color: accent,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="relative mt-7 text-[19px] font-black leading-[1.1] tracking-[-0.02em] text-[#102033]">
                    {tool.title}
                  </h3>

                  <p className="relative mt-2.5 text-[12.5px] leading-5 text-[#707b86]">
                    {tool.description}
                  </p>

                  <div className="relative mt-5 inline-flex items-center gap-2 text-[11px] font-black text-[#ff7a00]">
                    {civicToolsContent[language].action}
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CIVIC LEAGUES */}
      <section id="leagues" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fbf8f2]/90">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe7d2] bg-[#f2f6e9] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#78934d]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6f7f58]">
                {text.leagueLabel}
              </span>
            </div>
            <h2 className="mt-4 max-w-3xl text-[36px] font-black leading-[1.03] tracking-[-0.04em] text-[#102033] md:text-[50px]">
              {text.leagueTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#697581] md:text-[17px]">
              {text.leagueDescription}
            </p>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-[#dfe4d3] bg-white shadow-[0_18px_50px_rgba(54,70,44,0.065)]">
            <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
              <div className="relative overflow-hidden bg-[#eef4e2] px-7 py-8 md:px-10 md:py-10">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#d9e7c3] opacity-80" />
                <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#fff0dc] opacity-90" />

                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-[20px] bg-white text-[25px] shadow-sm">
                    🏆
                  </div>

                  <p className="mt-7 text-[10px] font-black uppercase tracking-[0.18em] text-[#75904f]">
                    Team-based civic participation
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Teams", "Missions", "Verification", "Karma Credits"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/80 bg-white/75 px-3 py-2 text-[10px] font-black text-[#65725a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/leagues")}
                    className="mt-8 inline-flex items-center rounded-full bg-[#ff7a00] px-6 py-3.5 text-[12px] font-black text-white shadow-[0_10px_22px_rgba(255,122,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
                  >
                    {text.leagueAction} →
                  </button>
                </div>
              </div>

              <div className="bg-[#fafcf5] p-6 md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#78934d]">
                      How the league layer works
                    </p>
                    <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#6d776f]">
                      Civic action becomes a shared team experience, with verified contributions feeding back into progress and standings.
                    </p>
                  </div>
                  <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e2e8d5] bg-white text-[14px] font-black text-[#7b944f] sm:grid">
                    →
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    [text.leagueFeature1Title, text.leagueFeature1Description, "01", "🤝", "#edf4e1"],
                    [text.leagueFeature2Title, text.leagueFeature2Description, "02", "🎯", "#fff0df"],
                    [text.leagueFeature3Title, text.leagueFeature3Description, "03", "✨", "#edf5fb"],
                  ].map(([title, description, number, icon, tint]) => (
                    <div
                      key={title}
                      className="kf-league-feature-card group grid gap-4 rounded-[24px] border border-[#e3e8db] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,27,43,0.055)] sm:grid-cols-[46px_1fr_auto] sm:items-center"
                    >
                      <div
                        className="grid h-11 w-11 place-items-center rounded-[17px] text-[19px]"
                        style={{ background: tint }}
                      >
                        {icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-black tracking-[0.18em] text-[#9ea69b]">
                            {number}
                          </span>
                          <h3 className="text-[16px] font-black leading-tight text-[#102033]">
                            {title}
                          </h3>
                        </div>
                        <p className="mt-1.5 text-[12.5px] leading-5 text-[#69736d]">
                          {description}
                        </p>
                      </div>

                      <span className="hidden text-[18px] text-[#9caf7b] transition-transform group-hover:translate-x-1 sm:block">
                        →
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2 rounded-[22px] border border-[#e0e6d7] bg-[#f4f8ea] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#697564]">
                    Learn → Act → Verify → Earn → Compete
                  </p>
                  <span className="text-[12px] font-bold text-[#7d9556]">
                    Civic participation, together
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIVIC PASSPORT */}
      <section id="civic-passport" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fffaf2]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="kf-passport-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white/80 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b838d]">
                  {language === "en" ? "YOUR CIVIC RECORD" : language === "hi" ? "आपका नागरिक रिकॉर्ड" : "तुमची नागरिक नोंद"}
                </span>
              </div>

              <div className="mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-[#eadfd1] bg-[#fff0df] text-2xl shadow-sm">
                🪪
              </div>

              <h2 className="mt-5 max-w-xl text-[36px] font-black leading-[1.05] tracking-[-0.035em] text-[#102033] md:text-[48px]">
                {language === "en"
                  ? "Your Civic Passport."
                  : language === "hi"
                  ? "आपका Civic Passport।"
                  : "तुमचा Civic Passport."}
              </h2>

              <p className="mt-3 max-w-xl text-[13px] font-black uppercase tracking-[0.14em] text-[#ff7a00] md:text-[14px]">
                {language === "en"
                  ? "The Record of Your Good Karmic Journey"
                  : language === "hi"
                  ? "आपकी अच्छी कर्मिक यात्रा का रिकॉर्ड"
                  : "तुमच्या चांगल्या कर्मिक प्रवासाची नोंद"}
              </p>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#65717d] md:text-[16px]">
                {language === "en"
                  ? "A personal record of the civic actions you take and the verified contributions you build over time."
                  : language === "hi"
                  ? "आपके नागरिक कार्यों और समय के साथ बने सत्यापित योगदान का व्यक्तिगत रिकॉर्ड।"
                  : "तुम्ही केलेल्या नागरिक कृती आणि कालांतराने उभ्या केलेल्या सत्यापित योगदानाची वैयक्तिक नोंद."}
              </p>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#ff7a1a]" />
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-[#e5e0d8] bg-white p-7 shadow-[0_18px_50px_rgba(35,47,58,0.06)] md:p-9">
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#e8f2f8]" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#fff0dd]" />

              <div className="relative">
                <p className="max-w-2xl text-[15px] leading-7 text-[#5f6b77] md:text-[16px]">
                  {language === "en"
                    ? "Civic Passport brings your verified civic participation into one place — including Karma Credits, completed Civic Missions, your League and team, and your growing civic journey."
                    : language === "hi"
                    ? "Civic Passport आपकी सत्यापित नागरिक भागीदारी को एक जगह लाता है — Karma Credits, पूरे किए गए Civic Missions, आपकी League और Team तथा आपकी नागरिक यात्रा के साथ।"
                    : "Civic Passport तुमचा सत्यापित नागरिक सहभाग एका ठिकाणी आणतो — Karma Credits, पूर्ण केलेल्या Civic Missions, तुमची League आणि Team तसेच तुमची नागरिक वाटचाल यांसह."}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    ["🪙", language === "en" ? "Karma Credits" : "Karma Credits", "#fff0df"],
                    ["✓", language === "en" ? "Verified civic actions" : language === "hi" ? "सत्यापित नागरिक कार्य" : "सत्यापित नागरिक कृती", "#edf5fb"],
                    ["🏆", language === "en" ? "League & team contribution" : language === "hi" ? "League और Team योगदान" : "League आणि Team योगदान", "#f1f5e8"],
                    ["📈", language === "en" ? "Your civic journey" : language === "hi" ? "आपकी नागरिक यात्रा" : "तुमची नागरिक वाटचाल", "#f4f0f8"],
                  ].map(([icon, label, tint]) => (
                    <div key={label} className="kf-passport-feature flex items-center gap-3 rounded-2xl border border-[#eee8df] bg-[#fffdf9] px-4 py-3.5">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white text-base shadow-sm"
                        style={{ background: tint }}
                      >
                        {icon}
                      </span>
                      <span className="text-[12.5px] font-bold text-[#4f5d6b]">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(isAuthenticated ? "/civic-passport" : "/auth")}
                    className="kf-explore-civic-passport-final rounded-full bg-[#ff7a00] px-6 py-3 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(255,122,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
                  >
                    {language === "en"
                      ? "Explore Civic Passport →"
                      : language === "hi"
                      ? "Civic Passport देखें →"
                      : "Civic Passport पाहा →"}
                  </button>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9a9fa5]">
                    KrutBharat · Verified participation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <footer className="relative z-10 border-t border-[#ece7df] bg-[#fffaf2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-9 text-center text-sm text-[#7c8288] md:flex-row md:items-center md:justify-between md:text-left">
          <div className="kf-footer-brand font-black text-[16px] text-[#102033]" style={{ fontFamily: "var(--font-display)" }}>
            © 2026 Krut<span className="text-[#ff7a00]">Bharat</span> · by KarmaFacie Corporation
          </div>
          <div className="text-[12px] text-[#8b9096]">{text.footerTagline}</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a0a4aa]">India · Civic participation</div>
        </div>
      </footer>

      <style>{`
/* =========================================================
   CIVIC PASSPORT — v18 FINAL BOUNDARY CLEANUP
   No outer brown frame. The passport composition itself is
   the only visible surface, with soft organic corners.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #07111f !important;
  background-image: none !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
  padding-top: 4.5rem !important;
  padding-bottom: 4.5rem !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* The passport itself is the only visible boundary. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div {
  background: #0b1d31 !important;
  border: 1px solid rgba(126,162,191,.22) !important;
  border-radius: 42px 52px 42px 52px !important;
  overflow: hidden !important;
  box-shadow:
    0 24px 60px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.025) !important;
}

/* Integrated navy panels. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child {
  background:
    radial-gradient(circle at 92% 8%, rgba(66,145,196,.10), transparent 30%),
    linear-gradient(145deg, #102a40 0%, #10283d 58%, #0f263a 100%) !important;
  border: 0 !important;
  border-right: 1px solid rgba(139,177,204,.14) !important;
  border-radius: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child {
  background:
    radial-gradient(circle at 94% 7%, rgba(64,139,190,.075), transparent 24%),
    #0b1d31 !important;
  border: 0 !important;
  border-radius: 0 !important;
}

/* FINAL PASSPORT FRAME FIX — the page and the Passport shell share one navy world. */
html[data-theme="dark"] .kf-explore-page .kf-explore-sections-shell {
  background: #07111f !important;
  background-color: #07111f !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport {
  background: #07111f !important;
  background-color: #07111f !important;
  border: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
  background-color: transparent !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div > div {
  background: #0b1d31 !important;
  background-color: #0b1d31 !important;
  border: 1px solid rgba(126,162,191,.22) !important;
  border-radius: 42px 52px 42px 52px !important;
  overflow: hidden !important;
}

/* Quieter decorative circles. */
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:first-child {
  background: rgba(53,105,136,.18) !important;
  opacity: .30 !important;
}
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:last-child > .absolute:nth-child(2) {
  background: rgba(53,105,136,.14) !important;
  opacity: .24 !important;
}

@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport > div {
    padding-top: 2.5rem !important;
    padding-bottom: 2.5rem !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div {
    border-radius: 34px 40px 34px 40px !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport > div > div > div:first-child {
    border-right: 0 !important;
    border-bottom: 1px solid rgba(139,177,204,.14) !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   PASSPORT — SINGLE-LAYER DARK COMPOSITION
   ========================================================= */
html[data-theme="dark"] .kf-explore-page #civic-passport,
html[data-theme="dark"] .kf-explore-page #civic-passport::before,
html[data-theme="dark"] .kf-explore-page #civic-passport::after {
  background: #07111f !important;
  background-color: #07111f !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport > div {
  background: transparent !important;
  background-color: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* This is the ONLY Passport shell. No brown/cream wrapper. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell,
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell::before,
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell::after {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* Left Passport panel. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:first-child {
  background:
    radial-gradient(circle at 92% 8%, rgba(64,143,196,.13), transparent 32%),
    #10243a !important;
  border: 1px solid rgba(111,160,197,.22) !important;
  border-radius: 32px 0 0 32px !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
}

/* Right Passport panel. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:last-child {
  background:
    radial-gradient(circle at 92% 8%, rgba(63,145,201,.12), transparent 26%),
    radial-gradient(circle at 4% 96%, rgba(255,122,26,.06), transparent 24%),
    #0d1d31 !important;
  border: 1px solid rgba(113,157,193,.23) !important;
  border-radius: 0 32px 32px 0 !important;
  box-shadow: 0 22px 52px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.025) !important;
}

/* Keep the feature cards colored, but never let them create an outer frame. */
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-feature {
  box-shadow: none !important;
}

@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:first-child {
    border-radius: 32px 32px 0 0 !important;
  }
  html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:last-child {
    border-radius: 0 0 32px 32px !important;
  }
}
`}</style>

<style>{`
/* =========================================================
   CIVIC PASSPORT — FINAL FIX
   1) No outer boundary: shared wrapper is fully transparent.
   2) Soft, organic rounded corners on both real inner panels.
   ========================================================= */

html[data-theme="dark"] .kf-explore-page #civic-passport,
html[data-theme="dark"] .kf-explore-page #civic-passport > div,
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div,
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:first-child,
html[data-theme="dark"] .kf-explore-page #civic-passport > div > div:last-child,
html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell {
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport {
  background-color: #07111f !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:first-child {
  background:
    radial-gradient(circle at 85% 10%, rgba(64,143,196,.14), transparent 34%),
    #10243a !important;
  border: 1px solid rgba(111,160,197,.20) !important;
  border-radius: 44px 34px 40px 30px !important;
  box-shadow: 0 18px 40px rgba(0,0,0,.20) !important;
  padding: 2.25rem !important;
}

html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:last-child {
  position: relative !important;
  background:
    radial-gradient(circle at 88% 8%, rgba(63,145,201,.12), transparent 28%),
    radial-gradient(circle at 6% 94%, rgba(255,122,26,.05), transparent 24%),
    #0d1d31 !important;
  border: 1px solid rgba(113,157,193,.20) !important;
  border-radius: 38px 46px 32px 42px !important;
  box-shadow: 0 22px 50px rgba(0,0,0,.24) !important;
}

@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:first-child,
  html[data-theme="dark"] .kf-explore-page #civic-passport .kf-passport-shell > div:last-child {
    border-radius: 34px !important;
  }
}
`}</style>

      <style>{`
/* =========================================================
   KRUTBHARAT NAVBAR — CRISP NEON GLASS (DARK MODE ONLY)
   Navbar-only visual override. Existing markup, links, spacing,
   content and functionality remain unchanged.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page .kf-explore-header {
  z-index: 50 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-ambient {
  opacity: 0 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
  position: relative !important;
  overflow: visible !important;
  isolation: isolate !important;
  background: rgba(4, 10, 20, 0.60) !important;
  background-image: none !important;
  border: 1px solid transparent !important;
  border-radius: 24px !important;
  box-shadow:
    -7px 0 14px -9px rgba(0, 212, 255, 0.95),
     7px 0 14px -9px rgba(255, 140, 26, 0.95),
     0 8px 24px -14px rgba(0, 0, 0, 0.80) !important;
  backdrop-filter: blur(14px) saturate(125%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
}

/* Remove the old bright glass overlays so the new glass stays clean. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div:first-child,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div:nth-child(2),
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div:nth-child(3),
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div:nth-child(4) {
  background: transparent !important;
  background-image: none !important;
  opacity: 0 !important;
}

/* Thin cyan → neutral → orange perimeter ring. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: -1 !important;
  padding: 1px !important;
  border-radius: inherit !important;
  background: linear-gradient(
    90deg,
    #00d4ff 0%,
    #0096ff 17%,
    rgba(93, 119, 145, 0.42) 38%,
    rgba(93, 119, 145, 0.20) 50%,
    rgba(255, 145, 45, 0.62) 82%,
    #ff8c1a 100%
  ) !important;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0) !important;
  -webkit-mask-composite: xor !important;
  mask-composite: exclude !important;
  pointer-events: none !important;
}

/* Tight external glow — intentionally small, crisp and saturated. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav::after {
  content: "" !important;
  position: absolute !important;
  inset: -5px !important;
  z-index: -2 !important;
  border-radius: 29px !important;
  background: linear-gradient(
    90deg,
    #00d4ff 0%,
    rgba(0, 150, 255, 0.48) 18%,
    transparent 36%,
    transparent 64%,
    rgba(255, 140, 26, 0.52) 82%,
    #ff8c1a 100%
  ) !important;
  filter: blur(12px) !important;
  opacity: 0.52 !important;
  pointer-events: none !important;
}

/* Keep the perimeter punchy without creating a large halo. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
  box-shadow:
    -8px 0 16px -10px rgba(0, 212, 255, 1),
     8px 0 16px -10px rgba(255, 140, 26, 1),
     0 7px 18px -14px rgba(0, 0, 0, 0.90) !important;
}

/* Existing logo remains the same brand treatment, with stronger dark-mode contrast. */
html[data-theme="dark"] .kf-explore-page .kf-explore-logo {
  color: #f8fafc !important;
  background: transparent !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-logo:hover {
  background: rgba(255,255,255,0.035) !important;
}

/* Existing section dividers. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div > .bg-white\/70,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav > div > div.bg-white\/70 {
  background: rgba(203, 213, 225, 0.24) !important;
}

/* LEARN — transparent group + thin blue outline. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:last-child {
  background: rgba(4, 10, 20, 0.30) !important;
  border: 1px solid rgba(0, 170, 255, 0.72) !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:first-child {
  color: #69cfff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:first-child > span:first-child {
  background: #00bfff !important;
}

/* UNDERSTAND — transparent group + thin purple outline. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:last-child {
  background: rgba(4, 10, 20, 0.30) !important;
  border: 1px solid rgba(209, 103, 255, 0.78) !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:first-child {
  color: #d77cff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:first-child > span:first-child {
  background: #d45cff !important;
}

/* PARTICIPATE — transparent group + thin green outline. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:last-child {
  background: rgba(4, 10, 20, 0.30) !important;
  border: 1px solid rgba(67, 222, 157, 0.70) !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:first-child {
  color: #55e6a6 !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:first-child > span:first-child {
  background: #22d991 !important;
}

/* All inner navigation buttons: transparent, crisp 1px outline only. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item {
  background: transparent !important;
  border: 1px solid transparent !important;
  color: #e8eef5 !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item:hover {
  background: transparent !important;
  color: #ffffff !important;
  box-shadow: none !important;
  transform: translate3d(0, -1px, 14px) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item {
  border-color: rgba(0, 180, 255, 0.46) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item {
  border-color: rgba(209, 103, 255, 0.50) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item {
  border-color: rgba(67, 222, 157, 0.46) !important;
}

/* Existing orange hover underline stays the only inner accent detail. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item .bg-\[\#ff7a00\] {
  background: #ff8c1a !important;
}

/* Dashboard keeps its existing orange identity. */
html[data-theme="dark"] .kf-explore-page .kf-explore-dashboard {
  background: linear-gradient(90deg, #ff8c1a, #ff6f00) !important;
  border-color: rgba(255, 157, 74, 0.72) !important;
  color: #07111f !important;
  box-shadow: 0 5px 14px rgba(255, 122, 0, 0.15) !important;
}

/* Log out + language remain dark glass controls. */
html[data-theme="dark"] .kf-explore-page .kf-explore-auth,
html[data-theme="dark"] .kf-explore-page .kf-explore-control {
  background: rgba(4, 10, 20, 0.46) !important;
  border-color: rgba(156, 177, 199, 0.34) !important;
  color: #e7edf5 !important;
  box-shadow: none !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-auth:hover,
html[data-theme="dark"] .kf-explore-page .kf-explore-control:hover {
  background: rgba(8, 18, 32, 0.70) !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-control option {
  background: #07111f !important;
  color: #f8fafc !important;
}

/* Keep the navbar compact and responsive exactly as before. */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
    border-radius: 24px !important;
  }
  html[data-theme="dark"] .kf-explore-page .kf-explore-nav::after {
    border-radius: 29px !important;
  }
}
`}</style>

      <style>{`
        /* =========================================================
           EXPLORE NAVBAR — MATCH HOMEPAGE CRISP NEON GLASS
           Same outer glow / border treatment as the homepage navbar.
           Explore-specific group navigation remains unchanged.
           ========================================================= */

        html[data-theme="dark"] .kf-explore-page .kf-explore-header {
          z-index: 50 !important;
        }

        /* Disable the old ambient wave layer so the new perimeter glow
           is the only outer lighting around the navigation bar. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-ambient {
          display: none !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
          position: relative !important;
          isolation: isolate !important;
          overflow: visible !important;
          background:
            linear-gradient(135deg, rgba(18, 40, 63, 0.46), rgba(7, 17, 31, 0.52) 48%, rgba(10, 25, 43, 0.44)) !important;
          background-image:
            radial-gradient(circle at 4% 50%, rgba(0, 212, 255, 0.13), transparent 27%),
            radial-gradient(circle at 96% 50%, rgba(255, 140, 26, 0.13), transparent 27%),
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.012) 42%, rgba(0,0,0,0.08)) !important;
          border: 1px solid transparent !important;
          border-radius: 24px !important;
          backdrop-filter: blur(24px) saturate(145%) brightness(1.08) !important;
          -webkit-backdrop-filter: blur(24px) saturate(145%) brightness(1.08) !important;
          box-shadow:
            -12px 0 28px -8px rgba(0, 212, 255, 0.62),
             12px 0 28px -8px rgba(255, 140, 26, 0.62),
             0 10px 34px rgba(0, 0, 0, 0.38),
             inset 0 1px 0 rgba(255, 255, 255, 0.13),
             inset 0 -1px 0 rgba(0, 0, 0, 0.24),
             inset 0 0 26px rgba(255, 255, 255, 0.025) !important;
        }

        /* Remove the original internal glass overlays. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav > .pointer-events-none.absolute {
          display: none !important;
        }

        /* Exact homepage-style cyan → blue → neutral → orange edge. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          border-radius: inherit !important;
          padding: 1.25px !important;
          background:
            linear-gradient(
              90deg,
              #00d4ff 0%,
              rgba(0, 174, 255, 0.72) 16%,
              rgba(90, 120, 150, 0.28) 43%,
              rgba(120, 120, 130, 0.22) 57%,
              rgba(255, 150, 40, 0.72) 84%,
              #ff8c1a 100%
            ) !important;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0) !important;
          -webkit-mask-composite: xor !important;
          mask-composite: exclude !important;
          pointer-events: none !important;
          z-index: 1 !important;
        }

        /* Tight external glow — same crisp treatment as homepage. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav::after {
          content: "" !important;
          position: absolute !important;
          inset: -6px !important;
          border-radius: inherit !important;
          background:
            linear-gradient(
              90deg,
              rgba(0, 212, 255, 0.95) 0%,
              rgba(0, 174, 255, 0.42) 15%,
              transparent 31%,
              transparent 69%,
              rgba(255, 140, 26, 0.42) 85%,
              rgba(255, 140, 26, 0.95) 100%
            ) !important;
          filter: blur(12px) !important;
          opacity: 0.62 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }

        /* Keep all actual navbar content above the neon edge. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav > .relative {
          position: relative !important;
          z-index: 3 !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-logo {
          color: #f7f8fb !important;
          background: transparent !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-logo:hover {
          background: rgba(255, 255, 255, 0.055) !important;
        }

        /* Preserve the Explore page's three navigation groups,
           but keep their interiors dark and translucent like the homepage. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:last-child,
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:last-child,
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:last-child {
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(4,10,20,0.20)) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.065),
            inset 0 -1px 0 rgba(0,0,0,0.18),
            0 4px 14px rgba(0,0,0,0.10) !important;
          backdrop-filter: blur(12px) saturate(130%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(130%) !important;
        }

        /* Existing Explore group identity remains visible through thin outlines. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:last-child {
          border-color: rgba(0, 170, 255, 0.72) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:last-child {
          border-color: rgba(209, 103, 255, 0.78) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:last-child {
          border-color: rgba(67, 222, 157, 0.70) !important;
        }

        /* Inner pills stay transparent so the outer neon rail remains dominant. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item {
          background: rgba(255,255,255,0.018) !important;
          color: #e8eef5 !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.045),
            inset 0 -1px 0 rgba(0,0,0,0.12) !important;
          backdrop-filter: blur(8px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(8px) saturate(125%) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item:hover {
          background: rgba(255, 255, 255, 0.075) !important;
          color: #ffffff !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.11),
            0 4px 12px rgba(0,0,0,0.12) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item {
          border-color: rgba(0, 180, 255, 0.46) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item {
          border-color: rgba(209, 103, 255, 0.50) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item {
          border-color: rgba(67, 222, 157, 0.46) !important;
        }

        /* Dashboard remains the same orange identity as the homepage. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-dashboard {
          background: linear-gradient(90deg, #ff8a1f, #ff6a00) !important;
          border-color: rgba(255, 166, 100, 0.78) !important;
          color: #08111d !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-auth,
        html[data-theme="dark"] .kf-explore-page .kf-explore-control {
          background: rgba(4, 10, 20, 0.42) !important;
          border-color: rgba(210, 225, 240, 0.22) !important;
          color: #e7eef6 !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-auth:hover,
        html[data-theme="dark"] .kf-explore-page .kf-explore-control:hover {
          background: rgba(255, 255, 255, 0.075) !important;
          border-color: rgba(255, 255, 255, 0.30) !important;
          color: #ffffff !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-control option {
          background: #07111f !important;
          color: #f8fafc !important;
        }

        /* ---------- Dark civic waves painted into the page background ---------- */
        /*
           These are pure CSS background shapes. No image is loaded or layered
           behind the page. The shapes sit on the existing page canvas and stay
           faint so the content remains dominant.
        */
        html[data-theme="dark"] .kf-explore-page::before {
          display: none !important;
          content: "";
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse 74% 58% at 0% 106%,
              transparent 0%,
              transparent 61%,
              rgba(35, 126, 255, 0.25) 62%,
              rgba(35, 126, 255, 0.16) 65%,
              rgba(24, 82, 158, 0.055) 69%,
              transparent 74%
            ),
            radial-gradient(
              ellipse 86% 50% at 46% 112%,
              transparent 0%,
              transparent 65%,
              rgba(82, 105, 137, 0.17) 66%,
              rgba(63, 84, 115, 0.09) 70%,
              transparent 76%
            ),
            radial-gradient(
              ellipse 72% 55% at 102% 108%,
              transparent 0%,
              transparent 60%,
              rgba(255, 181, 91, 0.23) 61%,
              rgba(255, 157, 57, 0.13) 64%,
              rgba(255, 143, 43, 0.045) 68%,
              transparent 74%
            );
          opacity: 0.95;
          filter: blur(1.5px);
        }

        html[data-theme="dark"] .kf-explore-page::after {
          display: none !important;
          content: "";
          position: fixed;
          left: 12vw;
          right: 8vw;
          bottom: -22vh;
          height: 42vh;
          z-index: 1;
          pointer-events: none;
          border-radius: 50%;
          background:
            radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 61%,
              rgba(52, 76, 108, 0.13) 62%,
              rgba(38, 59, 88, 0.075) 66%,
              transparent 73%
            );
          filter: blur(2px);
          opacity: 0.9;
        }

        /* A third, very faint contour creates the layered-wave depth. */
        html[data-theme="dark"] .kf-explore-page > main,
        html[data-theme="dark"] .kf-explore-page > header,
        html[data-theme="dark"] .kf-explore-page > section,
        html[data-theme="dark"] .kf-explore-page > footer {
          position: relative;
          z-index: 2;
        }

        /* Keep the page's existing background artwork subtle underneath. */
        html[data-theme="dark"] .kf-explore-page > .pointer-events-none.fixed {
          z-index: 0 !important;
        }

        /* ---------- Remove the oversized Learn / Understand / Participate containers ---------- */

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }

        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group > div:first-child {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        /* Keep only the compact inner navigation pill. */
        html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group > div:last-child {
          border-radius: 15px !important;
          padding: 2px !important;
          backdrop-filter: blur(12px) saturate(130%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(130%) !important;
        }

        @media (max-width: 700px) {
          html[data-theme="dark"] .kf-dark-wave-background {
            opacity: .82;
          }
        }
      `}
</style>

      <style>{`
/* =========================================================
   FINAL DARK EXPLORE NAV VISIBILITY FIX
   The current stylesheet contains several overlapping navbar
   rules. Make the real content wrapper explicit so decorative
   pseudo-layers can never obscure it.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav {
  position: relative !important;
  isolation: isolate !important;
  overflow: visible !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content {
  position: relative !important;
  z-index: 20 !important;
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  color: #e8eef5 !important;
  transform: none !important;
  transform-style: flat !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-logo,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-section-nav,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-nav-group,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-nav-item,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-dashboard,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-auth,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content .kf-explore-control,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-content > div {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Keep only the navbar's perimeter effects behind the content. */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav::before {
  z-index: 0 !important;
  pointer-events: none !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav::after {
  z-index: -1 !important;
  pointer-events: none !important;
}
`}</style>
      <style>{`
/* FINAL DARK-MODE KNOW INDIA / EXPLORE CONTRAST POLISH */
html[data-theme="dark"] .kf-explore-page .kf-explore-civic-life-chip {
  background: rgba(16,36,58,.86) !important;
  border-color: rgba(79,181,255,.20) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 8px 20px rgba(0,0,0,.16) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-civic-life-dot {
  background: #ff7a00 !important;
}
html[data-theme="dark"] .kf-explore-page .kf-explore-civic-life-label {
  color: #9fb1c3 !important;
}
html[data-theme="dark"] .kf-explore-page .kf-know-india-explore-button {
  background: #ff7a00 !important;
  border-color: #ff9a55 !important;
  color: #ffffff !important;
  box-shadow: 0 12px 26px rgba(255,122,0,.18) !important;
}
html[data-theme="dark"] .kf-explore-page .kf-know-india-explore-button:hover {
  background: #ef6c00 !important;
  color: #ffffff !important;
}
html[data-theme="dark"] .kf-explore-page .kf-footer-brand {
  color: #f7f8fb !important;
}
html[data-theme="dark"] .kf-explore-page .kf-footer-brand span {
  color: #ff7a00 !important;
}
`}</style>

      <style>{`
/* FINAL: remove any rectangular background from the Explore Civic Life heading area. */
html[data-theme="dark"] .kf-explore-page #explore > div,
html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child,
html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child > div:first-child {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child {
  border: 0 !important;
}

html[data-theme="dark"] .kf-explore-page #explore > div > div:first-child > div:first-child {
  border-color: transparent !important;
}
`}</style>

      <style>{`
/* =========================================================
   DARK EXPLORE NAV — OUTER GROUP BORDERS ONLY
   Keep the blue / purple / green perimeter around each
   Learn / Understand / Participate group, while removing
   the individual inner borders around its navigation items.
   Light mode remains unchanged.
   ========================================================= */
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn > div:last-child,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand > div:last-child,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate > div:last-child {
  border-style: solid !important;
  box-shadow: none !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item {
  border: 0 !important;
  border-color: transparent !important;
  background: transparent !important;
  box-shadow: none !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-learn .kf-explore-nav-item:hover,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-understand .kf-explore-nav-item:hover,
html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group-participate .kf-explore-nav-item:hover {
  border: 0 !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
`}</style>

      <style>{`
/* =========================================================
   FINAL DARK-MODE COLOR FIXES — requested only
   ========================================================= */
html[data-theme="dark"] .kf-explore-page .kf-know-india-discover-dot {
  background: #ff7a00 !important;
  opacity: 1 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-know-india-explore-button {
  background: #ff7a00 !important;
  border-color: #ff9a55 !important;
  color: #ffffff !important;
  box-shadow: 0 12px 26px rgba(255,122,0,.18) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-know-india-explore-button:hover {
  background: #ef6c00 !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-explore-page .kf-footer-brand {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .kf-explore-page .kf-footer-brand span {
  color: #ff7a00 !important;
}
`}</style>

<style>{`
/* =====================================================================
   FINAL DARK-MODE ACCENT LOCKS — exact requested elements only
   These rules are intentionally the LAST page-local dark-mode rules so
   they cannot be displaced by earlier Explore theme overrides.
   Light mode is untouched.
   ===================================================================== */
html[data-theme="dark"] main.kf-explore-page .kf-discover-india-nav-dot {
  background: #ff7a00 !important;
  background-color: #ff7a00 !important;
  background-image: none !important;
  opacity: 1 !important;
}

html[data-theme="dark"] main.kf-explore-page .kf-your-civic-record-nav-dot {
  background: #ff7a00 !important;
  background-color: #ff7a00 !important;
  background-image: none !important;
  opacity: 1 !important;
}

html[data-theme="dark"] main.kf-explore-page .kf-explore-know-india-final {
  background: #ff7a00 !important;
  background-color: #ff7a00 !important;
  background-image: none !important;
  border-color: #ff9a55 !important;
  color: #ffffff !important;
  box-shadow: 0 12px 26px rgba(255,122,0,.20) !important;
}

html[data-theme="dark"] main.kf-explore-page .kf-explore-know-india-final:hover {
  background: #ef6c00 !important;
  background-color: #ef6c00 !important;
  color: #ffffff !important;
}

html[data-theme="dark"] main.kf-explore-page .kf-explore-civic-passport-final {
  background: #ff7a00 !important;
  background-color: #ff7a00 !important;
  background-image: none !important;
  border-color: #ff9a55 !important;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(255,122,0,.20) !important;
}

html[data-theme="dark"] main.kf-explore-page .kf-explore-civic-passport-final:hover {
  background: #ef6c00 !important;
  background-color: #ef6c00 !important;
  color: #ffffff !important;
}

/* =========================================================
   CIVIC SENSE — EXPLORE UNDERSTAND SECTION
   ========================================================= */
.kf-civic-sense-explore-shell {
  min-height: 420px;
}

.kf-civic-sense-explore-left {
  background:
    radial-gradient(circle at 90% 8%, rgba(197,224,230,.72) 0%, rgba(197,224,230,0) 34%),
    radial-gradient(circle at 8% 94%, rgba(255,222,194,.72) 0%, rgba(255,222,194,0) 34%),
    linear-gradient(145deg, #f5fafb 0%, #eef6ef 100%);
}

.kf-civic-sense-explore-right {
  background:
    radial-gradient(circle at 92% 8%, rgba(204,231,239,.62) 0%, rgba(204,231,239,0) 30%),
    radial-gradient(circle at 10% 90%, rgba(255,229,205,.52) 0%, rgba(255,229,205,0) 28%),
    linear-gradient(145deg, #f7fbfc 0%, #f1f6f8 56%, #edf4f0 100%);
}

.kf-civic-sense-explore-item-blue {
  background:
    radial-gradient(circle at 90% 0%, rgba(184,222,238,.56) 0%, rgba(184,222,238,0) 38%),
    linear-gradient(135deg, #eaf6fb 0%, #dceff7 100%);
  border-color: #c8dfe9;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 10px 24px rgba(43,83,104,.06);
}

.kf-civic-sense-explore-item-green {
  background:
    radial-gradient(circle at 8% 100%, rgba(196,224,180,.50) 0%, rgba(196,224,180,0) 38%),
    linear-gradient(135deg, #edf8f1 0%, #dff1e7 100%);
  border-color: #c9e0d0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 10px 24px rgba(54,93,67,.055);
}

.kf-civic-sense-explore-item-purple {
  background:
    radial-gradient(circle at 94% 8%, rgba(218,204,236,.54) 0%, rgba(218,204,236,0) 38%),
    linear-gradient(135deg, #f5eefb 0%, #e9e1f5 100%);
  border-color: #d9cce8;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 10px 24px rgba(73,55,93,.05);
}

.kf-civic-sense-explore-item-blue h4,
.kf-civic-sense-explore-item-green h4,
.kf-civic-sense-explore-item-purple h4 {
  color: #263a4e !important;
}

.kf-civic-sense-explore-item-blue p,
.kf-civic-sense-explore-item-green p,
.kf-civic-sense-explore-item-purple p {
  color: #657482 !important;
}

.kf-civic-sense-explore-strip {
  border-color: #d7dfca;
  background: linear-gradient(90deg, #f7f8ec 0%, #f1f6e6 52%, #edf5ef 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.78);
}

@media (max-width: 1023px) {
  .kf-civic-sense-explore-right {
    border-top: 1px solid rgba(125,162,193,.14);
  }
}

html[data-theme="dark"] .kf-explore-page #civic-sense {
  background: rgba(5,14,24,.78) !important;
  border-top-color: rgba(125,162,193,.12) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-shell {
  border-color: rgba(125,162,193,.18) !important;
  background: #0b1b2d !important;
  box-shadow: 0 22px 52px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-left {
  background:
    radial-gradient(circle at 90% 8%, rgba(34,95,119,.25) 0%, rgba(34,95,119,0) 34%),
    radial-gradient(circle at 8% 94%, rgba(161,87,44,.18) 0%, rgba(161,87,44,0) 34%),
    linear-gradient(145deg, #173244 0%, #10283a 100%) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-left h2,
html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-right h3 {
  color: #f7f9fc !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-left .text-\[\#65717d\] {
  color: #b4c6d6 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-right {
  background: #0d2136 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-blue {
  background: #133654 !important;
  border-color: #28506c !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-green {
  background: #16372f !important;
  border-color: #2a5a4b !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-purple {
  background: #2d2743 !important;
  border-color: #4b4166 !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-blue,
html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-green,
html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-item-purple {
  box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 14px 30px rgba(0,0,0,.16) !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-strip {
  border-color: #6f7d55 !important;
  background: #25331f !important;
}

html[data-theme="dark"] .kf-explore-page #civic-sense .kf-civic-sense-explore-strip span:last-child {
  color: #bcd98d !important;
}

/* =========================================================
   RESPONSIBLE AUTHORITIES — UNDERSTAND SECTION
   ========================================================= */
.kf-ra-explore-shell { background:#fff; }
.kf-ra-explore-left {
  background:
    radial-gradient(circle at 90% 8%, rgba(204,224,239,.72) 0%, rgba(204,224,239,0) 34%),
    radial-gradient(circle at 8% 94%, rgba(222,204,238,.54) 0%, rgba(222,204,238,0) 34%),
    linear-gradient(145deg,#f4f8fb 0%,#f7f3f8 100%);
}
.kf-ra-explore-right {
  background:
    radial-gradient(circle at 92% 8%, rgba(214,233,241,.56) 0%, rgba(214,233,241,0) 30%),
    radial-gradient(circle at 10% 90%, rgba(255,230,210,.42) 0%, rgba(255,230,210,0) 28%),
    linear-gradient(145deg,#fbfcfd 0%,#f2f6f8 56%,#f3f0f7 100%);
}
.kf-ra-explore-item-blue {
  background:radial-gradient(circle at 90% 0%,rgba(184,222,238,.46) 0%,rgba(184,222,238,0) 38%),linear-gradient(135deg,#edf7fb 0%,#dff0f7 100%);
  border-color:#c8dfe9;
}
.kf-ra-explore-item-purple {
  background:radial-gradient(circle at 94% 8%,rgba(221,206,238,.48) 0%,rgba(221,206,238,0) 38%),linear-gradient(135deg,#f6effb 0%,#ebe2f5 100%);
  border-color:#d9cde8;
}
.kf-ra-explore-item-green {
  background:radial-gradient(circle at 8% 100%,rgba(197,224,180,.46) 0%,rgba(197,224,180,0) 38%),linear-gradient(135deg,#eef8f2 0%,#e0f0e7 100%);
  border-color:#cae0d1;
}
.kf-ra-explore-strip { border-color:#dfe4d8; background:linear-gradient(90deg,#f6f8ee 0%,#f0f5e8 52%,#edf5ef 100%); }

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-shell {
  border-color:rgba(125,162,193,.18)!important;
  background:#0b1b2d!important;
  box-shadow:0 22px 52px rgba(0,0,0,.24)!important;
}
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left {
  background:radial-gradient(circle at 90% 8%,rgba(34,95,119,.22) 0%,rgba(34,95,119,0) 34%),radial-gradient(circle at 8% 94%,rgba(91,67,111,.20) 0%,rgba(91,67,111,0) 34%),linear-gradient(145deg,#183244 0%,#12293b 100%)!important;
}
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-right { background:#0d2136!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left h3,
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-right h4,
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-right h5 { color:#f7f9fc!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left .text-\[\#697581\] { color:#b4c6d6!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left .text-\[\#7a5a8a\] { color:#d0b9dc!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-blue { background:#133653!important; border-color:#28506c!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-purple { background:#2c2740!important; border-color:#4a3e62!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-green { background:#15372f!important; border-color:#285949!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-blue p,
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-purple p,
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-green p { color:#aebfd0!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-strip { border-color:#536848!important; background:#26341f!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-strip p { color:#aeb8a1!important; }
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-strip span { color:#c0d596!important; }


/* FINAL NAV GROUP VISIBILITY FIX — keep the complete Learn and Participate pill outlines visible. */
html[data-theme="dark"] .kf-explore-page .kf-explore-section-nav {
  overflow: visible !important;
  justify-content: space-between !important;
  min-width: 0 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group {
  flex-shrink: 1 !important;
  min-width: 0 !important;
}

html[data-theme="dark"] .kf-explore-page .kf-explore-nav-group > div:last-child {
  overflow: visible !important;
}

@media (max-width: 1180px) and (min-width: 1024px) {
  html[data-theme="dark"] .kf-explore-page .kf-explore-nav-item {
    padding-left: 0.45rem !important;
    padding-right: 0.45rem !important;
    font-size: 9px !important;
  }
}


/* =========================================================
   RESPONSIBLE AUTHORITIES — FINAL VISUAL REFINEMENT
   ========================================================= */
.kf-ra-explore-shell {
  position: relative;
  isolation: isolate;
  border-color: rgba(179, 196, 214, 0.72) !important;
  background:
    radial-gradient(circle at 100% 0%, rgba(190, 222, 242, 0.40) 0%, rgba(190, 222, 242, 0) 32%),
    radial-gradient(circle at 0% 100%, rgba(220, 204, 237, 0.34) 0%, rgba(220, 204, 237, 0) 34%),
    linear-gradient(135deg, #f8fbfd 0%, #f3f7fb 48%, #f7f2f9 100%) !important;
  box-shadow:
    0 24px 64px rgba(52, 74, 94, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.82) !important;
}

.kf-ra-explore-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(circle at 82% 8%, rgba(179, 217, 238, 0.28) 0%, rgba(179, 217, 238, 0) 24%),
    radial-gradient(circle at 12% 88%, rgba(226, 203, 240, 0.24) 0%, rgba(226, 203, 240, 0) 24%);
}

.kf-ra-explore-shell > * {
  position: relative;
  z-index: 1;
}

.kf-ra-explore-left {
  background:
    radial-gradient(circle at 92% 8%, rgba(183, 218, 239, 0.72) 0%, rgba(183, 218, 239, 0) 34%),
    radial-gradient(circle at 8% 94%, rgba(221, 202, 237, 0.64) 0%, rgba(221, 202, 237, 0) 34%),
    linear-gradient(145deg, #edf5fa 0%, #f1eef7 52%, #f7f3f8 100%) !important;
  border-right: 1px solid rgba(181, 203, 219, 0.50);
}

.kf-ra-explore-right {
  background:
    radial-gradient(circle at 96% 0%, rgba(194, 226, 239, 0.46) 0%, rgba(194, 226, 239, 0) 29%),
    radial-gradient(circle at 0% 100%, rgba(230, 214, 239, 0.30) 0%, rgba(230, 214, 239, 0) 28%),
    linear-gradient(145deg, #fbfdff 0%, #f1f7fb 58%, #f5f1f8 100%) !important;
}

.kf-ra-explore-left .text-\[\#697987\] { color: #5c6e7e !important; }
.kf-ra-explore-left .text-\[\#7a5a8a\] { color: #765b88 !important; }
.kf-ra-explore-right > div:first-child h4 { color: #16283c !important; }

.kf-ra-explore-item-blue {
  background:
    radial-gradient(circle at 96% 0%, rgba(164, 211, 235, 0.55) 0%, rgba(164, 211, 235, 0) 34%),
    linear-gradient(135deg, #e8f5fb 0%, #d9edf7 100%) !important;
  border-color: #bcdbe9 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 8px 22px rgba(57, 107, 132, 0.07) !important;
}

.kf-ra-explore-item-purple {
  background:
    radial-gradient(circle at 96% 0%, rgba(220, 201, 237, 0.60) 0%, rgba(220, 201, 237, 0) 34%),
    linear-gradient(135deg, #f5edfb 0%, #eae0f4 100%) !important;
  border-color: #d5c4e5 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 8px 22px rgba(98, 72, 126, 0.07) !important;
}

.kf-ra-explore-item-green {
  background:
    radial-gradient(circle at 8% 100%, rgba(195, 225, 211, 0.54) 0%, rgba(195, 225, 211, 0) 36%),
    linear-gradient(135deg, #edf8f2 0%, #e0f0e8 100%) !important;
  border-color: #c6dfd0 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 8px 22px rgba(60, 104, 82, 0.07) !important;
}

.kf-ra-explore-strip {
  border-color: #d3ddd2 !important;
  background:
    linear-gradient(90deg, #f4f7ee 0%, #eef5f1 52%, #edf3f7 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 8px 20px rgba(61, 82, 66, 0.05) !important;
}

/* ---------- Dark mode: richer civic-blue / violet glass ---------- */
html[data-theme="dark"] .kf-explore-page .kf-ra-explore-shell {
  border-color: rgba(76, 170, 226, 0.34) !important;
  background:
    radial-gradient(circle at 92% 0%, rgba(57, 135, 177, 0.20) 0%, rgba(57, 135, 177, 0) 28%),
    radial-gradient(circle at 4% 100%, rgba(129, 81, 164, 0.16) 0%, rgba(129, 81, 164, 0) 30%),
    linear-gradient(135deg, #0a182a 0%, #0c2035 52%, #111b30 100%) !important;
  box-shadow:
    0 28px 72px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-shell::before {
  background:
    radial-gradient(circle at 82% 8%, rgba(40, 139, 188, 0.18) 0%, rgba(40, 139, 188, 0) 25%),
    radial-gradient(circle at 11% 92%, rgba(146, 83, 178, 0.17) 0%, rgba(146, 83, 178, 0) 25%);
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left {
  background:
    radial-gradient(circle at 92% 8%, rgba(44, 127, 167, 0.25) 0%, rgba(44, 127, 167, 0) 34%),
    radial-gradient(circle at 8% 94%, rgba(113, 70, 137, 0.22) 0%, rgba(113, 70, 137, 0) 34%),
    linear-gradient(145deg, #123044 0%, #10283c 54%, #17243a 100%) !important;
  border-right-color: rgba(94, 151, 185, 0.18) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-right {
  background:
    radial-gradient(circle at 96% 0%, rgba(38, 119, 160, 0.18) 0%, rgba(38, 119, 160, 0) 30%),
    radial-gradient(circle at 0% 100%, rgba(118, 76, 151, 0.13) 0%, rgba(118, 76, 151, 0) 27%),
    linear-gradient(145deg, #0d2238 0%, #0d1f34 58%, #141d31 100%) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left .text-\[\#697987\] {
  color: #a9bdcc !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left .text-\[\#7a5a8a\] {
  color: #d3b5df !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-blue {
  background:
    radial-gradient(circle at 94% 0%, rgba(46, 139, 188, 0.24) 0%, rgba(46, 139, 188, 0) 34%),
    linear-gradient(135deg, #123a59 0%, #12324d 100%) !important;
  border-color: rgba(62, 151, 204, 0.34) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-purple {
  background:
    radial-gradient(circle at 94% 0%, rgba(145, 83, 185, 0.22) 0%, rgba(145, 83, 185, 0) 34%),
    linear-gradient(135deg, #302746 0%, #2a253d 100%) !important;
  border-color: rgba(168, 112, 207, 0.34) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-item-green {
  background:
    radial-gradient(circle at 8% 100%, rgba(38, 135, 103, 0.20) 0%, rgba(38, 135, 103, 0) 36%),
    linear-gradient(135deg, #153a35 0%, #13332f 100%) !important;
  border-color: rgba(68, 166, 134, 0.30) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-strip {
  border-color: rgba(129, 155, 103, 0.34) !important;
  background:
    linear-gradient(90deg, rgba(54, 70, 39, 0.82) 0%, rgba(42, 58, 36, 0.88) 52%, rgba(34, 51, 42, 0.92) 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 10px 24px rgba(0, 0, 0, 0.15) !important;
}

.kf-ra-explore-left > .pointer-events-none.absolute.-right-16.-top-16 {
  background: rgba(188, 216, 235, 0.58) !important;
}

.kf-ra-explore-left > .pointer-events-none.absolute.-bottom-16.-left-16 {
  background: rgba(219, 201, 235, 0.52) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left > .pointer-events-none.absolute.-right-16.-top-16 {
  background: rgba(49, 130, 170, 0.26) !important;
}

html[data-theme="dark"] .kf-explore-page .kf-ra-explore-left > .pointer-events-none.absolute.-bottom-16.-left-16 {
  background: rgba(128, 77, 151, 0.22) !important;
}


`}


</style>

</main>
  );
}
