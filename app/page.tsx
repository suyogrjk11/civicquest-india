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
    trustChip1: string;
    trustChip2: string;
    trustChip3: string;
    trustSystemLabel: string;
    trustSystemDescription: string;

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
    navWhy: "Why KarmaFacie?",
    navLeagues: "Civic Leagues",
    signIn: "Sign in / Sign up",
    signUp: "Sign up",
    signOut: "Log out",
    dashboard: "Dashboard",

    heroBadge: "🇮🇳 Built for citizens of India",
    heroTitle1: "Know. Understand.",
    heroTitle2: "Participate.",
    heroDescription:
      "KarmaFacie helps citizens learn how India works, understand the issues around them and take meaningful civic action.",
    exploreNow: "Explore KarmaFacie →",
    signInUp: "Sign in / Sign up",

    aboutLabel: "What is KarmaFacie?",
    aboutTagline: "A Face for Every Good Civic Action.",
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
    howTitle: "From learning to lasting civic impact.",
    howDescription:
      "KarmaFacie connects civic knowledge with real participation, verified contribution and a growing civic record.",

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
      "Use KarmaFacie tools to participate, report issues and complete civic missions.",
    step5Title: "Track & verify",
    step5Description:
      "Follow updates, submit evidence and verify outcomes where possible.",

    journeyFlowLabel: "THE KARMAFACIE JOURNEY",
    journeyFlowTitle: "Discover → Learn → Understand → Act → Show Proof → Verify → Earn → Build & Belong → Repeat",
    journeyFlowDescription:
      "A citizen can move through KarmaFacie at their own pace — from learning about India to taking real civic action and building a record of verified participation.",
    journeyFlow: [
      {
        title: "Discover",
        description: "Explore Know India, State Spotlight and civic topics.",
        icon: "◉",
      },
      {
        title: "Learn",
        description: "Build knowledge through Civic Learning and Civic Quests.",
        icon: "▦",
      },
      {
        title: "Understand",
        description: "Connect issues with institutions, systems and the right civic path.",
        icon: "◌",
      },
      {
        title: "Act",
        description: "Report issues, use official pathways and complete Civic Missions.",
        icon: "✦",
      },
      {
        title: "Show Proof",
        description: "Add photos, evidence and Before / After impact.",
        icon: "▣",
      },
      {
        title: "Verify",
        description: "Actions can move through admin and eligible community review.",
        icon: "✓",
      },
      {
        title: "Earn & Track",
        description: "Verified participation contributes to Karma Credits and impact records.",
        icon: "✧",
      },
      {
        title: "Build & Belong",
        description: "Grow your Civic Passport, join Leagues and teams, and share civic progress.",
        icon: "◆",
      },
    ],

    featureUniverseLabel: "THE KARMAFACIE PLATFORM",
    featureUniverseTitle: "Everything connects to the same civic journey.",
    featureUniverseDescription:
      "KarmaFacie brings learning, civic services, real-world action, verification, impact and community participation into one connected experience.",
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

    futureLabel: "GROWING WITH KARMAFACIE",
    futureTitle: "The civic journey keeps expanding.",
    futureDescription:
      "Planned layers can deepen progression and personalization as KarmaFacie grows.",
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
      "KarmaFacie helps you document the issue, identify the relevant authority, prepare your report and hand it off to the appropriate official channel.",

    issueStep1: "See a problem",
    issueStep2: "Document it",
    issueStep3: "Find the right authority",
    issueStep4: "Prepare your report",
    issueStep5: "Smart Handoff",
    issueStep6: "Submit officially",
    issueStep7: "Track & verify",

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
    trustTitle: "Built for citizens. Clear and transparent.",
    trustDescription:
      "KarmaFacie helps citizens understand and navigate civic processes. It clearly separates KarmaFacie tools from official government systems.",

    trust1Title: "Official information",
    trust1Description:
      "We provide authority information from maintained directories and official sources where available.",

    trust2Title: "Citizen-controlled reports",
    trust2Description:
      "Citizens control the reports and information they share through KarmaFacie.",

    trust3Title: "Clear boundaries",
    trust3Description:
      "KarmaFacie is not a government authority. A report on KarmaFacie is not automatically an official government submission.",
    trustChip1: "Citizen-first",
    trustChip2: "Evidence-aware",
    trustChip3: "Clear boundaries",
    trustSystemLabel: "KARMAFACIE ≠ GOVERNMENT SYSTEM",
    trustSystemDescription:
      "KarmaFacie helps prepare and guide civic reports. Official submissions, reference numbers and government status remain with the relevant government system.",

    ctaTitle1: "Ready to start your",
    ctaTitle2: " KarmaFacie journey?",
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
      "Learn. Understand. Participate.",
  },

  hi: {
    navAbout: "परिचय",
    navWhatWeDo: "हम क्या करते हैं",
    navExplore: "एक्सप्लोर करें",
    navWhy: "KarmaFacie क्यों?",
    navLeagues: "सिविक लीग्स",
    signIn: "साइन इन / साइन अप",
    signUp: "साइन अप",
    signOut: "लॉग आउट",
    dashboard: "डैशबोर्ड",

    heroBadge: "🇮🇳 भारत के नागरिकों के लिए बनाया गया",
    heroTitle1: "जानें। समझें।",
    heroTitle2: "भाग लें।",
    heroDescription:
      "KarmaFacie नागरिकों को यह समझने में मदद करता है कि भारत कैसे काम करता है, उनके आसपास के मुद्दों को समझने में मदद करता है और सार्थक नागरिक भागीदारी के तरीके दिखाता है।",
    exploreNow: "KarmaFacie एक्सप्लोर करें →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KarmaFacie क्या है?",
    aboutTagline: "सत्कर्मों का चेहरा।",
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
    howTitle: "सीखने से स्थायी नागरिक प्रभाव तक।",
    howDescription:
      "KarmaFacie नागरिक ज्ञान को वास्तविक भागीदारी, सत्यापित योगदान और एक बढ़ते नागरिक रिकॉर्ड से जोड़ता है।",

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
      "भाग लेने, समस्याएँ रिपोर्ट करने और नागरिक मिशन पूरे करने के लिए KarmaFacie के उपकरणों का उपयोग करें।",
    step5Title: "ट्रैक और सत्यापित करें",
    step5Description:
      "अपडेट देखें, प्रमाण जमा करें और जहाँ संभव हो परिणामों की पुष्टि करें।",

    journeyFlowLabel: "KARMAFACIE की यात्रा",
    journeyFlowTitle: "खोजें → सीखें → समझें → कार्रवाई करें → प्रमाण दिखाएँ → सत्यापित करें → अर्जित करें → अपना रिकॉर्ड बनाएँ → दोहराएँ",
    journeyFlowDescription:
      "KarmaFacie में नागरिक अपनी गति से आगे बढ़ सकता है — भारत को जानने से लेकर वास्तविक नागरिक कार्रवाई करने और सत्यापित भागीदारी का रिकॉर्ड बनाने तक।",
    journeyFlow: [
      {
        title: "खोजें",
        description: "Know India, State Spotlight और नागरिक विषयों को एक्सप्लोर करें।",
        icon: "◉",
      },
      {
        title: "सीखें",
        description: "Civic Learning और Civic Quests के माध्यम से ज्ञान बढ़ाएँ।",
        icon: "▦",
      },
      {
        title: "समझें",
        description: "मुद्दों को संस्थाओं, व्यवस्थाओं और सही नागरिक मार्ग से जोड़ें।",
        icon: "◌",
      },
      {
        title: "कार्रवाई करें",
        description: "समस्याएँ रिपोर्ट करें, आधिकारिक रास्तों का उपयोग करें और Civic Missions पूरे करें।",
        icon: "✦",
      },
      {
        title: "प्रमाण दिखाएँ",
        description: "फोटो, प्रमाण और Before / After Impact जोड़ें।",
        icon: "▣",
      },
      {
        title: "सत्यापित करें",
        description: "कार्रवाई एडमिन और पात्र समुदाय समीक्षा से आगे बढ़ सकती है।",
        icon: "✓",
      },
      {
        title: "अर्जित करें और ट्रैक करें",
        description: "सत्यापित भागीदारी Karma Credits और प्रभाव रिकॉर्ड में जुड़ती है।",
        icon: "✧",
      },
      {
        title: "अपना रिकॉर्ड बनाएँ",
        description: "Civic Passport बढ़ाएँ, Leagues और टीमों से जुड़ें और अपनी नागरिक प्रगति साझा करें।",
        icon: "◆",
      },
    ],

    featureUniverseLabel: "KARMAFACIE प्लेटफ़ॉर्म",
    featureUniverseTitle: "हर सुविधा एक ही नागरिक यात्रा से जुड़ी है।",
    featureUniverseDescription:
      "KarmaFacie सीखने, नागरिक सेवाओं, वास्तविक कार्रवाई, सत्यापन, प्रभाव और समुदाय की भागीदारी को एक जुड़े हुए अनुभव में लाता है।",
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

    futureLabel: "KARMAFACIE के साथ आगे",
    futureTitle: "नागरिक यात्रा लगातार बढ़ती रहेगी।",
    futureDescription:
      "जैसे-जैसे KarmaFacie विकसित होगा, progression और personalization की नई परतें जुड़ सकती हैं।",
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
      "KarmaFacie समस्या को दर्ज करने, सही प्राधिकरण पहचानने, रिपोर्ट तैयार करने और उसे उचित आधिकारिक माध्यम तक पहुँचाने में मदद करता है।",

    issueStep1: "समस्या देखें",
    issueStep2: "समस्या दर्ज करें",
    issueStep3: "सही प्राधिकरण खोजें",
    issueStep4: "रिपोर्ट तैयार करें",
    issueStep5: "Smart Handoff",
    issueStep6: "आधिकारिक रूप से जमा करें",
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
      "नागरिकों के लिए बनाया गया। सरल और पारदर्शी।",
    trustDescription:
      "KarmaFacie नागरिकों को नागरिक प्रक्रियाओं को समझने और उनमें आगे बढ़ने में मदद करता है। यह अपने उपकरणों और आधिकारिक सरकारी प्रणालियों के बीच स्पष्ट अंतर रखता है।",

    trust1Title: "आधिकारिक जानकारी",
    trust1Description:
      "जहाँ उपलब्ध हो, हम प्राधिकरण की जानकारी बनाए रखी गई डायरेक्टरी और आधिकारिक स्रोतों से देते हैं।",

    trust2Title: "नागरिकों के नियंत्रण में रिपोर्ट",
    trust2Description:
      "KarmaFacie पर साझा की गई रिपोर्ट और जानकारी पर नागरिकों का नियंत्रण रहता है।",

    trust3Title: "स्पष्ट सीमाएँ",
    trust3Description:
      "KarmaFacie कोई सरकारी प्राधिकरण नहीं है। KarmaFacie पर की गई रिपोर्ट अपने आप आधिकारिक सरकारी शिकायत नहीं बनती।",
    trustChip1: "नागरिक-केंद्रित",
    trustChip2: "प्रमाण पर आधारित",
    trustChip3: "स्पष्ट सीमाएँ",
    trustSystemLabel: "KARMAFACIE ≠ सरकारी प्रणाली",
    trustSystemDescription:
      "KarmaFacie नागरिक रिपोर्ट तैयार करने और सही मार्ग बताने में मदद करता है। आधिकारिक सबमिशन, संदर्भ नंबर और सरकारी स्थिति संबंधित सरकारी प्रणाली के अधीन रहते हैं।",

    ctaTitle1: "क्या आप अपनी",
    ctaTitle2: " KarmaFacie यात्रा शुरू करने के लिए तैयार हैं?",
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
      "सीखें। समझें। भाग लें।",
  },

  mr: {
    navAbout: "परिचय",
    navWhatWeDo: "आम्ही काय करतो",
    navExplore: "एक्सप्लोर करा",
    navWhy: "KarmaFacie का?",
    navLeagues: "सिविक लीग्स",
    signIn: "साइन इन / साइन अप",
    signUp: "साइन अप",
    signOut: "लॉग आउट",
    dashboard: "डॅशबोर्ड",

    heroBadge: "🇮🇳 भारतातील नागरिकांसाठी तयार केलेले",
    heroTitle1: "जाणा. समजून घ्या.",
    heroTitle2: "सहभागी व्हा.",
    heroDescription:
      "KarmaFacie नागरिकांना भारत कसा कार्य करतो हे जाणून घेण्यास, आजूबाजूच्या समस्या समजून घेण्यास आणि अर्थपूर्ण नागरिक सहभागाचे मार्ग शोधण्यास मदत करते.",
    exploreNow: "KarmaFacie एक्सप्लोर करा →",
    signInUp: "साइन इन / साइन अप",

    aboutLabel: "KarmaFacie म्हणजे काय?",
    aboutTagline: "सत्कर्मांचा चेहरा।",
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
    howTitle: "शिकण्यापासून दीर्घकालीन नागरिक प्रभावापर्यंत.",
    howDescription:
      "KarmaFacie नागरिक ज्ञानाला प्रत्यक्ष सहभाग, सत्यापित योगदान आणि वाढत्या नागरिक नोंदीशी जोडते.",

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
      "सहभाग घ्या, समस्या नोंदवा आणि Civic Missions पूर्ण करण्यासाठी KarmaFacie ची साधने वापरा.",
    step5Title: "ट्रॅक आणि पडताळा",
    step5Description:
      "अपडेट्स पाहा, पुरावे सादर करा आणि शक्य असेल तिथे परिणामांची पडताळणी करा.",

    journeyFlowLabel: "KARMAFACIE ची वाटचाल",
    journeyFlowTitle: "शोधा → शिका → समजून घ्या → कृती करा → पुरावा द्या → पडताळा → मिळवा → तुमची नोंद घडवा → पुन्हा सहभागी व्हा",
    journeyFlowDescription:
      "भारत जाणून घेण्यापासून प्रत्यक्ष नागरिक कृतीपर्यंत आणि सत्यापित सहभागाची नोंद तयार करण्यापर्यंत नागरिक KarmaFacie मध्ये आपल्या गतीने पुढे जाऊ शकतात.",
    journeyFlow: [
      {
        title: "शोधा",
        description: "Know India, State Spotlight आणि नागरिक विषय एक्सप्लोर करा.",
        icon: "◉",
      },
      {
        title: "शिका",
        description: "Civic Learning आणि Civic Quests द्वारे ज्ञान वाढवा.",
        icon: "▦",
      },
      {
        title: "समजून घ्या",
        description: "समस्या, संस्था, व्यवस्था आणि योग्य नागरिक मार्ग यांचा संबंध समजून घ्या.",
        icon: "◌",
      },
      {
        title: "कृती करा",
        description: "समस्या नोंदवा, अधिकृत मार्ग वापरा आणि Civic Missions पूर्ण करा.",
        icon: "✦",
      },
      {
        title: "पुरावा द्या",
        description: "फोटो, पुरावे आणि Before / After Impact जोडा.",
        icon: "▣",
      },
      {
        title: "पडताळा",
        description: "कृतीची Admin आणि पात्र Community Review प्रक्रियेत पडताळणी होऊ शकते.",
        icon: "✓",
      },
      {
        title: "मिळवा आणि ट्रॅक करा",
        description: "सत्यापित सहभाग Karma Credits आणि प्रभाव नोंदीमध्ये जोडला जातो.",
        icon: "✧",
      },
      {
        title: "तुमची नोंद घडवा",
        description: "Civic Passport वाढवा, Leagues आणि टीममध्ये सहभागी व्हा आणि नागरिक प्रगती शेअर करा.",
        icon: "◆",
      },
    ],

    featureUniverseLabel: "KARMAFACIE प्लॅटफॉर्म",
    featureUniverseTitle: "प्रत्येक सुविधा एकाच नागरिक वाटचालीशी जोडलेली आहे.",
    featureUniverseDescription:
      "KarmaFacie शिक्षण, नागरी सेवा, प्रत्यक्ष कृती, पडताळणी, प्रभाव आणि समुदाय सहभाग यांना एका जोडलेल्या अनुभवात आणते.",
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

    futureLabel: "KARMAFACIE सोबत पुढे",
    futureTitle: "नागरिक वाटचाल सतत विस्तारत राहील.",
    futureDescription:
      "KarmaFacie विकसित होत असताना progression आणि personalization च्या नवीन स्तरांचा विस्तार करता येईल.",
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
      "KarmaFacie समस्या नोंदवणे, योग्य प्राधिकरण ओळखणे, अहवाल तयार करणे आणि तो योग्य अधिकृत माध्यमापर्यंत पोहोचवण्यात मदत करते.",

    issueStep1: "समस्या दिसली",
    issueStep2: "समस्या नोंदवा",
    issueStep3: "योग्य प्राधिकरण शोधा",
    issueStep4: "अहवाल तयार करा",
    issueStep5: "Smart Handoff",
    issueStep6: "अधिकृतरीत्या जमा करा",
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
      "नागरिकांसाठी तयार केलेले. सोपे आणि पारदर्शक.",
    trustDescription:
      "KarmaFacie नागरिकांना नागरी प्रक्रिया समजून घेण्यास आणि त्यामध्ये पुढे जाण्यास मदत करते. हे स्वतःची साधने आणि अधिकृत सरकारी व्यवस्था यांच्यात स्पष्ट फरक ठेवते.",

    trust1Title: "अधिकृत माहिती",
    trust1Description:
      "जिथे उपलब्ध असेल तिथे आम्ही प्राधिकरणाची माहिती देखभाल केलेल्या डायरेक्टरी आणि अधिकृत स्रोतांमधून देतो.",

    trust2Title: "नागरिकांच्या नियंत्रणातील नोंदी",
    trust2Description:
      "KarmaFacie वर शेअर केलेल्या नोंदी आणि माहितीवर नागरिकांचे नियंत्रण राहते.",

    trust3Title: "स्पष्ट मर्यादा",
    trust3Description:
      "KarmaFacie हे सरकारी प्राधिकरण नाही. KarmaFacie वर केलेली नोंद आपोआप अधिकृत सरकारी तक्रार मानली जात नाही.",
    trustChip1: "नागरिक-केंद्रित",
    trustChip2: "पुराव्याची जाणीव",
    trustChip3: "स्पष्ट मर्यादा",
    trustSystemLabel: "KARMAFACIE ≠ सरकारी व्यवस्था",
    trustSystemDescription:
      "KarmaFacie नागरिकांच्या तक्रारी तयार करण्यास आणि योग्य मार्ग दाखवण्यास मदत करते. अधिकृत सबमिशन, संदर्भ क्रमांक आणि सरकारी स्थिती संबंधित सरकारी व्यवस्थेकडेच राहतात.",

    ctaTitle1: "तुमची",
    ctaTitle2: " KarmaFacie वाटचाल सुरू करण्यास तयार आहात?",
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

const supabase = createClient();

export default function Home() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const text = content[language];

  const [activeJourney, setActiveJourney] =
    useState<JourneyKey | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setIsAuthenticated(!!user);
      }
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session?.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("KarmaFacie sign-out failed:", error);
      return;
    }

    setIsAuthenticated(false);
  };

  const scrollToSection = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const sectionNav = [
    {
      id: "about",
      label: language === "en" ? "About" : language === "hi" ? "परिचय" : "परिचय",
    },
    {
      id: "what-we-do",
      label: language === "en" ? "What We Do" : language === "hi" ? "हम क्या करते हैं" : "आम्ही काय करतो",
    },
    {
      id: "how-it-works",
      label: language === "en" ? "Journey" : language === "hi" ? "यात्रा" : "वाटचाल",
    },
    {
      id: "why",
      label: language === "en" ? "Why" : language === "hi" ? "क्यों" : "का?",
    },
    {
      id: "trust",
      label: language === "en" ? "Trust & Transparency" : language === "hi" ? "विश्वास और पारदर्शिता" : "विश्वास आणि पारदर्शकता",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-[#102033]">
      {/* Reference background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Light mode keeps the existing background exactly as before. */}
        <img
          src="/images/kf-background.png"
          alt=""
          className="h-full w-full object-cover kf-light-background"
        />

        {/* Dark mode uses the exact supplied wave artwork. */}
        <img
          src="/images/kf-dark-waves.png"
          alt=""
          className="h-full w-full object-cover kf-dark-wave-background"
        />
      </div>
      {/* HEADER — FROSTED GLASS NAVIGATION RAIL */}
      <header className="kf-glass-header sticky top-3 z-40 mx-auto max-w-[1280px] px-3 sm:px-5">
        <div className="kf-glass-nav-ambient pointer-events-none absolute -inset-x-12 -inset-y-8 overflow-visible" aria-hidden="true">
          <div className="kf-glass-wave kf-glass-wave-blue absolute -left-10 top-0 h-24 w-[58%]" />
          <div className="kf-glass-wave kf-glass-wave-orange absolute right-[-3%] top-[-8px] h-28 w-[42%]" />
          <div className="kf-glass-wave kf-glass-wave-soft absolute left-[22%] top-[-18px] h-20 w-[58%]" />
        </div>

        <div className="kf-glass-nav relative overflow-hidden rounded-[24px] border px-3 py-2.5 sm:px-4 sm:py-2.5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-white/16 to-white/27" />
          <div className="pointer-events-none absolute inset-x-[7%] top-0 h-px bg-white/85" />
          <div className="pointer-events-none absolute -left-8 top-[-42px] h-28 w-56 rounded-full bg-[#dceeff]/25 blur-2xl" />
          <div className="pointer-events-none absolute right-10 top-[-52px] h-32 w-40 rounded-full bg-[#ffd9b5]/22 blur-2xl" />

          <div className="relative flex min-w-0 items-center gap-2 sm:gap-3" style={{ transformStyle: "preserve-3d" }}>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="kf-glass-logo shrink-0 rounded-xl px-2 py-1 text-left text-[21px] font-black tracking-[-0.045em] text-[#102033] transition hover:bg-white/45 sm:px-2.5 sm:text-[23px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Karma<span className="text-[#ff7a00]">Facie</span>
            </button>

            <div className="mx-1 hidden h-9 w-px bg-white/70 lg:block" aria-hidden="true" />

            <div
              className="kf-section-nav flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto px-0.5 pb-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              aria-label="Homepage sections"
            >
              {sectionNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="kf-glass-nav-item group relative shrink-0 rounded-full px-2.5 py-1.5 text-[12px] font-bold text-[#526170] transition-all duration-200 hover:bg-white/70 hover:text-[#102033] sm:px-3 sm:text-[12px]"
                >
                  <span className="relative whitespace-nowrap">
                    {item.label}
                    <span className="absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#ff7a00] transition-all duration-200 group-hover:w-[65%]" />
                  </span>
                </button>
              ))}
            </div>

            <div className="mx-1 hidden h-9 w-px bg-white/70 lg:block" aria-hidden="true" />

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                aria-label="Search"
                className="kf-glass-control hidden h-8 w-8 place-items-center rounded-full border border-white/65 bg-white/45 text-[#526170] shadow-sm transition hover:bg-white/75 hover:text-[#102033] lg:grid"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => router.push(isAuthenticated ? "/dashboard" : "/auth")}
                className="kf-glass-dashboard hidden rounded-full border border-[#ff9a55]/70 bg-[#ff8a32]/90 px-4 py-2 text-[11px] font-bold text-[#102033] shadow-[0_5px_14px_rgba(255,122,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#ff7f20] hover:shadow-[0_8px_18px_rgba(255,122,0,0.22)] sm:inline-flex"
              >
                {text.dashboard} →
              </button>

              <button
                type="button"
                onClick={isAuthenticated ? handleSignOut : () => router.push("/auth")}
                className="kf-glass-auth-button hidden rounded-full border border-white/75 bg-white/50 px-3.5 py-2 text-[11px] font-semibold text-[#526170] shadow-sm transition hover:-translate-y-0.5 hover:bg-white/80 hover:text-[#102033] sm:inline-flex"
              >
                {isAuthenticated
                  ? text.signOut
                  : language === "en"
                  ? text.signInUp
                  : text.signInUp}
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Language"
                className="kf-glass-control rounded-full border border-white/75 bg-white/55 px-3 py-2 text-[11px] font-semibold text-[#344153] shadow-sm outline-none backdrop-blur-md transition hover:bg-white/80 sm:px-3.5"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <style>{`
/* =========================================================
   KARMAFACIE HOMEPAGE — DARK MODE v5
   Visual reference: ABOUT + WHAT WE DO

   Contrast system:
   - Canvas: deep navy
   - Section labels: orange
   - Main headings: warm white
   - Body copy: cool blue-grey
   - Cards: dark navy / dark blue / dark green / dark warm brown
   - Icons: warm cream
   - Borders: quiet blue-grey
   ========================================================= */

html[data-theme="dark"] main,
html[data-theme="dark"] body {
  background: #07111f !important;
  color: #f7f8fb !important;
}

html[data-theme="dark"] main > section {
  background: transparent !important;
  color: #f7f8fb !important;
}

.kf-dark-wave-background {
  display: none;
}

/* ---------- Background ---------- */
html[data-theme="dark"] main > .pointer-events-none.fixed {
  opacity: 1 !important;
  background: #07111f !important;
}

/* Keep the existing light background untouched in light mode. */
html[data-theme="dark"] main > .pointer-events-none.fixed .kf-light-background {
  display: none !important;
}

/* Exact supplied dark-mode wave artwork: no opacity, filter, tint or overlay. */
html[data-theme="dark"] main > .pointer-events-none.fixed .kf-dark-wave-background {
  display: block !important;
  opacity: 1 !important;
  filter: none !important;
}

/* Remove the previous dark-mode atmospheric overlay so the supplied
   wave colors and structure remain completely unchanged. */
html[data-theme="dark"] main > .pointer-events-none.fixed::after {
  display: none !important;
}

/* ---------- Header ---------- */
html[data-theme="dark"] .kf-glass-nav {
  background: linear-gradient(135deg, rgba(18,40,63,.94), rgba(12,29,49,.94)) !important;
  border-color: rgba(145,174,204,.20) !important;
  box-shadow: 0 16px 42px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.07) !important;
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
}

html[data-theme="dark"] .kf-glass-nav::before {
  background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.008)) !important;
}

html[data-theme="dark"] .kf-glass-logo { color: #f7f8fb !important; }
html[data-theme="dark"] .kf-glass-nav-item { color: #a9b9cb !important; }
html[data-theme="dark"] .kf-glass-nav-item:hover {
  color: #ffffff !important;
  background: rgba(255,255,255,.065) !important;
}

html[data-theme="dark"] .kf-glass-control,
html[data-theme="dark"] .kf-glass-auth-button {
  background: #10243a !important;
  border-color: rgba(145,174,204,.18) !important;
  color: #d7e1ec !important;
}

html[data-theme="dark"] .kf-glass-control:hover,
html[data-theme="dark"] .kf-glass-auth-button:hover {
  background: #17314d !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-glass-dashboard {
  background: #ff7a1a !important;
  border-color: #ff9b59 !important;
  color: #101a27 !important;
}

html[data-theme="dark"] .kf-home-theme-toggle {
  background: #10243a !important;
  border-color: rgba(145,174,204,.22) !important;
  color: #f7f8fb !important;
}

/* ---------- Shared typography ---------- */
html[data-theme="dark"] h1,
html[data-theme="dark"] h2,
html[data-theme="dark"] h3 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] .text-\[\#102033\] {
  color: #f7f8fb !important;
}

/* ---------- Hero ---------- */
html[data-theme="dark"] main > section:first-of-type p {
  color: #aebed0 !important;
}

html[data-theme="dark"] main > section:first-of-type .bg-\[\#fff0dc\] {
  background: #30251b !important;
  color: #ff9a55 !important;
  border-color: rgba(255,154,85,.20) !important;
}

/* =========================================================
   ABOUT — MASTER REFERENCE
   ========================================================= */
html[data-theme="dark"] #about {
  border-top-color: rgba(145,174,204,.10) !important;
}

html[data-theme="dark"] #about .text-\[\#ff7a00\] {
  color: #ff8b32 !important;
  background: transparent !important;
}

html[data-theme="dark"] #about .border-\[\#ddd7cc\] {
  background: #10243a !important;
  border-color: rgba(145,174,204,.18) !important;
  color: #d7e1ec !important;
}

html[data-theme="dark"] #about > div > div > div:last-child {
  background:
    radial-gradient(circle at 92% 0%, rgba(197,215,231,.17), transparent 22%),
    radial-gradient(circle at 4% 100%, rgba(255,179,122,.13), transparent 23%),
    #10263a !important;
  border-color: rgba(145,174,204,.20) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.25) !important;
}

html[data-theme="dark"] #about > div > div > div:last-child p {
  color: #b8c6d6 !important;
}

html[data-theme="dark"] #about > div > div > div:last-child .border-t {
  border-color: rgba(145,174,204,.15) !important;
}

html[data-theme="dark"] #about > div > div > div:last-child span:not(.h-2) {
  color: #8fa2b7 !important;
}

/* =========================================================
   WHAT WE DO — SECOND MASTER REFERENCE
   ========================================================= */
html[data-theme="dark"] #what-we-do {
  background: transparent !important;
}

html[data-theme="dark"] #what-we-do > div > div:first-child > p {
  color: #ff8b32 !important;
  background: transparent !important;
}

html[data-theme="dark"] #what-we-do > div > div:first-child > h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #what-we-do button {
  border-color: rgba(145,174,204,.22) !important;
  background: #10243a !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(1) > div:last-child {
  background: #30251b !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(2) > div:last-child {
  background: #10263a !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(3) > div:last-child {
  background: #182c25 !important;
}

html[data-theme="dark"] #what-we-do button h3 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #what-we-do button p {
  color: #aebed0 !important;
}

html[data-theme="dark"] #what-we-do button .bg-white\/70 {
  background: rgba(7,17,31,.48) !important;
  color: #d0dce8 !important;
  border: 1px solid rgba(145,174,204,.12) !important;
}

/* =========================================================
   HOW KARMAFACIE WORKS
   Same text hierarchy as What We Do.
   ========================================================= */
html[data-theme="dark"] #how-it-works {
  border-top-color: rgba(145,174,204,.10) !important;
}

html[data-theme="dark"] #how-it-works > div > div:first-child p {
  color: #ff8b32 !important;
  background: transparent !important;
}

html[data-theme="dark"] #how-it-works > div > div:first-child h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #how-it-works > div > div:first-child > div:first-child > p:last-child {
  color: #aebed0 !important;
}

html[data-theme="dark"] #how-it-works > div > div:last-child {
  background:
    radial-gradient(circle at 95% 0%, rgba(63,167,255,.07), transparent 25%),
    #10243a !important;
  border-color: rgba(145,174,204,.20) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.25) !important;
}

html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div {
  background: #10263a !important;
  border-color: rgba(145,174,204,.16) !important;
}

html[data-theme="dark"] #how-it-works h3 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #how-it-works p {
  color: #aebed0 !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f6ede1\] {
  background: #f8f1e6 !important;
  color: #263447 !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] {
  background: #0d1d31 !important;
  border-color: rgba(145,174,204,.15) !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] .text-\[\#657080\] {
  color: #b8c6d6 !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] .text-\[\#c5bfb6\] {
  color: #60758b !important;
}

/* =========================================================
   WHY KARMAFACIE
   Remove the pale light-mode feeling completely.
   ========================================================= */
html[data-theme="dark"] #why {
  background: transparent !important;
}

html[data-theme="dark"] #why > div > div:first-child > div:first-child > p {
  color: #ff8b32 !important;
  background: transparent !important;
}

html[data-theme="dark"] #why > div > div:first-child > div:first-child > h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #why > div > div:first-child > div:last-child p {
  color: #aebed0 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child {
  background:
    radial-gradient(circle at 88% 2%, rgba(205,218,231,.13), transparent 18%),
    #10263a !important;
  border-color: rgba(145,174,204,.20) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child {
  background:
    radial-gradient(circle at 5% 98%, rgba(205,232,187,.10), transparent 20%),
    #182c25 !important;
  border-color: rgba(145,174,204,.17) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .text-\[\#8a929c\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .text-\[\#6f9142\] {
  color: #9eb0c2 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .bg-\[\#f8f3ea\] {
  background: #f8f1e6 !important;
  color: #d76b55 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .bg-white\/80 {
  background: #f8f1e6 !important;
  color: #55753d !important;
}

html[data-theme="dark"] #why [class*="bg-[#fbfaf7]"],
html[data-theme="dark"] #why [class*="bg-white/65"] {
  background: rgba(7,17,31,.48) !important;
  border-color: rgba(145,174,204,.13) !important;
}

html[data-theme="dark"] #why [class*="bg-[#fbfaf7]"] span:last-child,
html[data-theme="dark"] #why [class*="bg-white/65"] span:last-child {
  color: #aebed0 !important;
}

html[data-theme="dark"] #why [class*="bg-[#fbfaf7]"] span:first-child,
html[data-theme="dark"] #why [class*="bg-white/65"] span:first-child {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] #why .bg-\[\#fff5e9\] {
  background: rgba(255,122,26,.13) !important;
  border-color: rgba(255,122,26,.22) !important;
  color: #ff8b32 !important;
}

html[data-theme="dark"] #why .bg-\[\#fff5e9\] + * {
  background: rgba(145,174,204,.18) !important;
}

html[data-theme="dark"] #why > div > div:last-child {
  color: #aebed0 !important;
}

/* =========================================================
   TRUST & TRANSPARENCY
   ========================================================= */
html[data-theme="dark"] #trust {
  background: transparent !important;
  border-top-color: rgba(145,174,204,.10) !important;
}

html[data-theme="dark"] #trust > div > div:first-child > div:first-child > div {
  background: #10243a !important;
  border-color: rgba(145,174,204,.16) !important;
}

html[data-theme="dark"] #trust > div > div:first-child > div:first-child > div span:last-child {
  color: #ff8b32 !important;
}

html[data-theme="dark"] #trust > div > div:first-child > div:first-child > h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #trust > div > div:first-child > div:last-child > p {
  color: #aebed0 !important;
}

html[data-theme="dark"] #trust .border-\[\#eadfd1\],
html[data-theme="dark"] #trust .border-\[\#d8e5ef\],
html[data-theme="dark"] #trust .border-\[\#e1e8d5\] {
  border-color: rgba(145,174,204,.16) !important;
  color: #d0dce8 !important;
}

html[data-theme="dark"] #trust .border-\[\#eadfd1\] { background: #30251b !important; }
html[data-theme="dark"] #trust .border-\[\#d8e5ef\] { background: #10263a !important; }
html[data-theme="dark"] #trust .border-\[\#e1e8d5\] { background: #182c25 !important; }

html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(1) {
  background: #10263a !important;
  border-color: rgba(79,181,255,.20) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(2) {
  background: #182c25 !important;
  border-color: rgba(143,209,139,.18) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(3) {
  background: #30251b !important;
  border-color: rgba(255,179,122,.20) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div {
  box-shadow: 0 18px 44px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div h3 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div p {
  color: #aebed0 !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div .absolute {
  opacity: .16 !important;
}

html[data-theme="dark"] #trust > div > div:last-child {
  background: #10243a !important;
  border-color: rgba(145,174,204,.16) !important;
}

html[data-theme="dark"] #trust > div > div:last-child p:first-child {
  color: #9eb0c2 !important;
}

html[data-theme="dark"] #trust > div > div:last-child p:last-child {
  color: #aebed0 !important;
}

/* =========================================================
   FINAL CTA
   ========================================================= */
html[data-theme="dark"] main > section:last-of-type {
  background: transparent !important;
}

html[data-theme="dark"] main > section:last-of-type > div > div {
  background:
    radial-gradient(circle at 88% 4%, rgba(63,167,255,.10), transparent 23%),
    radial-gradient(circle at 4% 96%, rgba(255,179,122,.10), transparent 23%),
    #10263a !important;
  border-color: rgba(145,174,204,.20) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,.28) !important;
}

html[data-theme="dark"] main > section:last-of-type h2 {
  color: #f7f8fb !important;
}

html[data-theme="dark"] main > section:last-of-type h2 .text-\[\#ff7a00\] {
  color: #ff8b32 !important;
}

html[data-theme="dark"] main > section:last-of-type > div > div > div:first-child > div:first-child {
  color: #9eb0c2 !important;
}

html[data-theme="dark"] main > section:last-of-type > div > div > div:first-child > p {
  color: #aebed0 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/70 {
  background: #0d1d31 !important;
  border-color: rgba(145,174,204,.17) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white {
  background: #10263a !important;
  border-color: rgba(145,174,204,.13) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-\[\#edf5fb\],
html[data-theme="dark"] main > section:last-of-type .bg-\[\#fff0df\],
html[data-theme="dark"] main > section:last-of-type .bg-\[\#eef5e6\] {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] main > section:last-of-type .text-\[\#969ba0\] {
  color: #8fa2b7 !important;
}

html[data-theme="dark"] main > section:last-of-type .text-\[\#263447\] {
  color: #f0f4f8 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#edf5fb\] + div,
html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#fff0df\] + div,
html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#eef5e6\] + div {
  background: rgba(145,174,204,.20) !important;
}

html[data-theme="dark"] main > section:last-of-type button:last-child {
  background: #0d1d31 !important;
  border-color: rgba(145,174,204,.18) !important;
  color: #e3ebf3 !important;
}

html[data-theme="dark"] main > section:last-of-type button:last-child:hover {
  background: #17314d !important;
}

/* ---------- Footer ---------- */
html[data-theme="dark"] footer {
  background: #081523 !important;
  border-top-color: rgba(145,174,204,.10) !important;
  color: #8294aa !important;
}

html[data-theme="dark"] footer .text-\[\#102033\] {
  color: #f7f8fb !important;
}

html[data-theme="dark"] footer .text-\[\#8b9096\],
html[data-theme="dark"] footer .text-\[\#a0a4aa\] {
  color: #71839a !important;
}


/* =========================================================
   DARK MODE — FINAL CONTRAST / COLOR POLISH
   ========================================================= */

/* WHY: remove the pale decorative circles and keep them inside the palette. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child > div.absolute {
  background: rgba(146, 180, 208, 0.18) !important;
  opacity: 1 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child > div.absolute {
  background: rgba(143, 209, 139, 0.14) !important;
  opacity: 1 !important;
}

/* WHY: make every label, row and number clearly readable against its dark surface. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .text-\[\#8a929c\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .text-\[\#6f9142\] {
  color: #9fb2c5 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .bg-\[\#f8f3ea\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .bg-white\/80 {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .bg-\[\#f8f3ea\] {
  color: #d76b55 !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .bg-white\/80 {
  color: #5d863f !important;
}

/* HOW IT WORKS: give the eight journey cards the same category-color language as What We Do. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) {
  background: #30251b !important;
  border-color: rgba(255,179,122,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) {
  background: #10263a !important;
  border-color: rgba(79,181,255,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) {
  background: #182c25 !important;
  border-color: rgba(143,209,139,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) {
  background: #292237 !important;
  border-color: rgba(190,157,238,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) {
  background: #30251b !important;
  border-color: rgba(255,179,122,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) {
  background: #182c25 !important;
  border-color: rgba(143,209,139,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) {
  background: #10263a !important;
  border-color: rgba(79,181,255,.18) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) {
  background: #292237 !important;
  border-color: rgba(190,157,238,.18) !important;
}

/* Journey symbols: no more identical cream squares. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) > div:first-child {
  background: #4a3020 !important; color: #ffb37a !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) > div:first-child {
  background: #183b57 !important; color: #8fd0ff !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) > div:first-child {
  background: #254131 !important; color: #a8d78d !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) > div:first-child {
  background: #3a2d49 !important; color: #d5b5ff !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) > div:first-child {
  background: #4a3020 !important; color: #ffc08e !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) > div:first-child {
  background: #254131 !important; color: #a8d78d !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) > div:first-child {
  background: #183b57 !important; color: #8fd0ff !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) > div:first-child {
  background: #3a2d49 !important; color: #d5b5ff !important;
}

/* Journey card typography follows the stronger contrast of About / What We Do. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div h3 {
  color: #f7f8fb !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div p {
  color: #b7c6d6 !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div span {
  color: #9eafc2 !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div > div:first-child > div:first-child {
  font-size: 18px !important;
  font-weight: 900 !important;
}

/* FINAL CTA: the civic-journey panel must be dark, not washed-out white. */
html[data-theme="dark"] main > section:last-of-type .bg-white\/75 {
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.20) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 > p {
  color: #9fb2c5 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white {
  background: #10263a !important;
  border-color: rgba(143,181,220,.16) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white > div:nth-child(2) {
  background: rgba(143,181,220,.28) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white > div:last-child {
  color: #f1f5f9 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white > div:first-child {
  color: #102033 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white:nth-child(1) > div:first-child {
  background: #f8f1e6 !important;
  color: #d76b55 !important;
}
html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white:nth-child(2) > div:first-child {
  background: #f8f1e6 !important;
  color: #c88445 !important;
}
html[data-theme="dark"] main > section:last-of-type .bg-white\/75 .bg-white:nth-child(3) > div:first-child {
  background: #f8f1e6 !important;
  color: #5d863f !important;
}


/* CTA description and secondary button contrast. */
html[data-theme="dark"] main > section:last-of-type p {
  color: #b7c6d6 !important;
}
html[data-theme="dark"] main > section:last-of-type button:last-child {
  color: #edf3f8 !important;
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.25) !important;
}

/* ---------- Mobile ---------- */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-glass-nav {
    background: rgba(10,24,41,.96) !important;
  }
}

/* ---------- Light-mode frosted glass navigation ---------- */
html:not([data-theme="dark"]) .kf-glass-nav {
  background: rgba(255, 253, 249, 0.46) !important;
  border-color: rgba(255, 255, 255, 0.78) !important;
  box-shadow:
    0 18px 44px rgba(16, 32, 51, 0.08),
    0 4px 14px rgba(16, 32, 51, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    inset 0 -1px 0 rgba(255, 255, 255, 0.32) !important;
  backdrop-filter: blur(24px) saturate(145%);
  -webkit-backdrop-filter: blur(24px) saturate(145%);
}

html:not([data-theme="dark"]) .kf-glass-nav::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.42),
    rgba(255, 255, 255, 0.16) 46%,
    rgba(255, 255, 255, 0.34)
  );
  opacity: 0.72;
}

html:not([data-theme="dark"]) .kf-glass-nav > .pointer-events-none.absolute.inset-0 {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.20)
  ) !important;
}

html:not([data-theme="dark"]) .kf-glass-nav-item {
  color: #526170 !important;
}

html:not([data-theme="dark"]) .kf-glass-nav-item:hover {
  color: #102033 !important;
  background: rgba(255, 255, 255, 0.56) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

html:not([data-theme="dark"]) .kf-glass-control,
html:not([data-theme="dark"]) .kf-glass-auth-button,
html:not([data-theme="dark"]) .kf-home-theme-toggle {
  background: rgba(255, 255, 255, 0.48) !important;
  border-color: rgba(255, 255, 255, 0.78) !important;
  backdrop-filter: blur(16px) saturate(135%);
  -webkit-backdrop-filter: blur(16px) saturate(135%);
}

html:not([data-theme="dark"]) .kf-glass-control:hover,
html:not([data-theme="dark"]) .kf-glass-auth-button:hover,
html:not([data-theme="dark"]) .kf-home-theme-toggle:hover {
  background: rgba(255, 255, 255, 0.70) !important;
}

html:not([data-theme="dark"]) .kf-glass-header {
  filter: drop-shadow(0 8px 20px rgba(16, 32, 51, 0.035));
}


/* =========================================================
   KARMAFACIE NAVBAR — CRISP NEON GLASS EDGE
   Navbar-only override. Matches the Explore navbar treatment.
   ========================================================= */

.kf-glass-nav {
  position: relative !important;
  isolation: isolate !important;
  overflow: visible !important;

  /* Dark, near-black transparent glass */
  background: rgba(4, 10, 20, 0.62) !important;
  border: 1px solid transparent !important;
  border-radius: 24px !important;

  backdrop-filter: blur(14px) saturate(125%) !important;
  -webkit-backdrop-filter: blur(14px) saturate(125%) !important;

  /* Tight directional glow */
  box-shadow:
    -10px 0 24px -8px rgba(0, 212, 255, 0.58),
     10px 0 24px -8px rgba(255, 140, 26, 0.58),
     0 8px 30px rgba(0, 0, 0, 0.42) !important;
}

/* Crisp cyan → neutral → orange perimeter */
.kf-glass-nav::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.25px;
  background:
    linear-gradient(
      90deg,
      #00d4ff 0%,
      rgba(0, 174, 255, 0.72) 16%,
      rgba(90, 120, 150, 0.28) 43%,
      rgba(120, 120, 130, 0.22) 57%,
      rgba(255, 150, 40, 0.72) 84%,
      #ff8c1a 100%
    );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

/* Tight external neon edge */
.kf-glass-nav::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      rgba(0, 212, 255, 0.95) 0%,
      rgba(0, 174, 255, 0.42) 15%,
      transparent 31%,
      transparent 69%,
      rgba(255, 140, 26, 0.42) 85%,
      rgba(255, 140, 26, 0.95) 100%
    );
  filter: blur(12px);
  opacity: 0.54;
  pointer-events: none;
  z-index: -1;
}

/* Remove the previous soft/foggy decorative navbar layers.
   The new edge is supplied only by the crisp pseudo-elements above. */
.kf-glass-nav-ambient {
  display: none !important;
}

.kf-glass-nav > .pointer-events-none.absolute {
  display: none !important;
}

/* Keep the existing navbar content above the glow. */
.kf-glass-nav > .relative {
  position: relative !important;
  z-index: 3 !important;
}

/* Logo */
.kf-glass-logo {
  color: #f7f8fb !important;
}

.kf-glass-logo:hover {
  background: rgba(255, 255, 255, 0.055) !important;
}

/* Section navigation */
.kf-glass-nav-item {
  color: #d3dfeb !important;
  background: transparent !important;
}

.kf-glass-nav-item:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.055) !important;
}

/* Search / theme / auth / language controls stay dark glass.
   Functionality and markup remain untouched. */
.kf-glass-control,
.kf-glass-auth-button,
.kf-home-theme-toggle {
  background: rgba(4, 10, 20, 0.42) !important;
  border-color: rgba(210, 225, 240, 0.22) !important;
  color: #e7eef6 !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

.kf-glass-control:hover,
.kf-glass-auth-button:hover,
.kf-home-theme-toggle:hover {
  background: rgba(255, 255, 255, 0.075) !important;
  border-color: rgba(255, 255, 255, 0.30) !important;
  color: #ffffff !important;
}

/* Dashboard keeps the existing KarmaFacie orange treatment. */
.kf-glass-dashboard {
  background: linear-gradient(90deg, #ff8a1f, #ff6a00) !important;
  border-color: rgba(255, 166, 100, 0.78) !important;
  color: #08111d !important;
}

/* Dividers remain subtle and vertical. */
.kf-glass-nav > .relative > .mx-1.h-9.w-px {
  background: rgba(255, 255, 255, 0.18) !important;
}

/* Responsive: preserve the existing navbar geometry. */
@media (max-width: 1023px) {
  .kf-glass-nav {
    border-radius: 24px !important;
  }

  .kf-glass-nav::after {
    border-radius: 24px;
  }
}

/* ---------- FINAL LIGHT-MODE NAVBAR CORRECTION ----------
   The navbar has a later unscoped dark-glass override above. These
   light-mode rules intentionally come last so light mode restores the
   clean ivory/frosted treatment without affecting dark mode. */
html:not([data-theme="dark"]) .kf-glass-nav {
  position: relative !important;
  overflow: hidden !important;
  background: rgba(255, 253, 249, 0.88) !important;
  border: 1px solid rgba(16, 32, 51, 0.08) !important;
  border-radius: 24px !important;
  box-shadow:
    0 16px 36px rgba(16, 32, 51, 0.075),
    0 4px 12px rgba(16, 32, 51, 0.035),
    inset 0 1px 0 rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(20px) saturate(125%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(125%) !important;
}

html:not([data-theme="dark"]) .kf-glass-nav::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  border-radius: inherit !important;
  padding: 1px !important;
  background: linear-gradient(
    90deg,
    rgba(131, 212, 246, 0.38),
    rgba(255, 255, 255, 0.78) 24%,
    rgba(255, 255, 255, 0.78) 72%,
    rgba(255, 192, 137, 0.42)
  ) !important;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
  -webkit-mask-composite: xor !important;
  mask-composite: exclude !important;
  pointer-events: none !important;
  z-index: 1 !important;
}

html:not([data-theme="dark"]) .kf-glass-nav::after {
  display: none !important;
}

html:not([data-theme="dark"]) .kf-glass-nav > .relative {
  position: relative !important;
  z-index: 3 !important;
}

html:not([data-theme="dark"]) .kf-glass-logo {
  color: #102033 !important;
  background: transparent !important;
}

html:not([data-theme="dark"]) .kf-glass-logo:hover {
  background: rgba(16, 32, 51, 0.045) !important;
}

html:not([data-theme="dark"]) .kf-glass-nav-item {
  color: #526170 !important;
  background: transparent !important;
}

html:not([data-theme="dark"]) .kf-glass-nav-item:hover {
  color: #102033 !important;
  background: rgba(255, 255, 255, 0.74) !important;
}

html:not([data-theme="dark"]) .kf-glass-control,
html:not([data-theme="dark"]) .kf-glass-auth-button,
html:not([data-theme="dark"]) .kf-home-theme-toggle {
  background: rgba(255, 255, 255, 0.78) !important;
  border-color: rgba(16, 32, 51, 0.10) !important;
  color: #425264 !important;
  box-shadow: 0 4px 12px rgba(16, 32, 51, 0.045) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

html:not([data-theme="dark"]) .kf-glass-control:hover,
html:not([data-theme="dark"]) .kf-glass-auth-button:hover,
html:not([data-theme="dark"]) .kf-home-theme-toggle:hover {
  background: #ffffff !important;
  border-color: rgba(16, 32, 51, 0.14) !important;
  color: #102033 !important;
}

html:not([data-theme="dark"]) .kf-glass-dashboard {
  background: linear-gradient(90deg, #ff8a1f, #ff6a00) !important;
  border-color: rgba(255, 154, 85, 0.72) !important;
  color: #102033 !important;
  box-shadow: 0 6px 16px rgba(255, 122, 0, 0.16) !important;
}

html:not([data-theme="dark"]) .kf-glass-dashboard:hover {
  background: linear-gradient(90deg, #ff921f, #ff7410) !important;
}

html:not([data-theme="dark"]) .kf-glass-nav > .relative > .mx-1.h-9.w-px {
  background: rgba(16, 32, 51, 0.10) !important;
}

html:not([data-theme="dark"]) .kf-glass-header {
  filter: drop-shadow(0 8px 20px rgba(16, 32, 51, 0.025)) !important;
}


`}</style>

      {/* HERO */}
      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-8 pt-6 lg:grid-cols-[0.95fr_1.05fr] lg:pb-8 lg:pt-4">
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fff0dc] px-3.5 py-1.5 text-[12px] font-medium text-[#4a4a44] shadow-sm">
              🇮🇳 {text.heroBadge.replace("🇮🇳 ", "")}
            </div>

            <h1 className="max-w-2xl text-[42px] font-black leading-[0.96] tracking-[-0.04em] text-[#102033] md:text-[54px]">
              {text.heroTitle1}
              <span className="mt-1 block text-[#ff6f20]">
                {text.heroTitle2}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-6 text-[#566270] md:text-[16px]">
              {text.heroDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/explore")}
                className="rounded-full bg-[#ff7a00] px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
              >
                {text.exploreNow}
              </button>

            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <img
              src="/images/kf-hero.png"
              alt="India Gate"
              className="block h-auto w-full max-w-[590px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-white/45">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff7a00]">
                {text.aboutLabel}
              </p>

              <p className="mt-4 text-[19px] font-bold leading-tight tracking-[-0.02em] text-[#ff7a00] md:text-[22px]">
                {text.aboutTagline}
              </p>

              <h2 className="mt-4 max-w-xl text-[36px] font-black leading-[1.08] tracking-[-0.035em] text-[#102033] md:text-[48px]">
                {text.aboutTitle}
              </h2>

              <div className="mt-7 h-1 w-16 rounded-full bg-[#ff7a1a]" />

              <div className="mt-8 flex flex-wrap gap-2.5">
                {[text.learnTitle, text.understandTitle, text.participateTitle].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#ddd7cc] bg-white/80 px-4 py-2 text-[12px] font-bold tracking-[0.02em] text-[#334155]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-[#e5e0d8] bg-white/90 p-8 shadow-[0_18px_50px_rgba(16,27,43,0.06)] md:p-10">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#dfeaf3]/80 blur-[2px]" />
              <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#ffd7b3]/55 blur-[2px]" />

              <div className="relative">
                <div className="mb-6 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff7a1a]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7a8490]">
                    KarmaFacie
                  </span>
                </div>

                <p className="max-w-2xl text-[17px] leading-8 text-[#5c6874] md:text-[18px]">
                  {text.aboutDescription}
                </p>

                <div className="mt-9 border-t border-[#ece7df] pt-6">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8a929c]">
                    {text.learnTitle} → {text.understandTitle} → {text.participateTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* WHAT YOU CAN DO */}
      <section id="what-we-do" className="relative z-10 scroll-mt-36">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-2">
          <div className="mb-6 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff7a00]">
              {text.whatWeDoLabel}
            </p>

            <h2 className="mt-2 max-w-2xl text-[30px] font-black leading-[1.02] tracking-[-0.035em] text-[#102033] md:text-[42px]">
              {language === "en"
                ? "From learning to a stronger India."
                : language === "hi"
                ? "सीखने से एक मजबूत भारत तक।"
                : "शिकण्यापासून मजबूत भारताकडे."}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                key: "learn" as JourneyKey,
                image: "/images/kf-learn.jpeg",
                icon: "📖",
                title: text.learnTitle,
                description: text.learnDescription,
                reveal: text.learnReveal,
                bg: "#fff0dc",
              },
              {
                key: "understand" as JourneyKey,
                image: "/images/kf-understand.jpeg",
                icon: "💡",
                title: text.understandTitle,
                description: text.understandDescription,
                reveal: text.understandReveal,
                bg: "#e8f3fa",
              },
              {
                key: "participate" as JourneyKey,
                image: "/images/kf-participate.jpeg",
                icon: "👥",
                title: text.participateTitle,
                description: text.participateDescription,
                reveal: text.participateReveal,
                bg: "#edf5dd",
              },
            ].map((card) => {
              const active = activeJourney === card.key;

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() =>
                    setActiveJourney(active ? null : card.key)
                  }
                  className="group overflow-hidden rounded-[24px] border border-[#e4dfd5] bg-white text-left shadow-[0_12px_28px_rgba(35,47,58,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_38px_rgba(35,47,58,0.12)]"
                >
                  <div className="relative h-[168px] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />

                    <div
                      className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/70 text-[21px] shadow-[0_8px_18px_rgba(16,27,43,0.10)]"
                      style={{ background: card.bg }}
                    >
                      {card.icon}
                    </div>

                    <div
                      className="absolute bottom-[-18px] right-4 grid h-11 w-11 place-items-center rounded-full border border-white/70 text-[19px] text-[#102033] shadow-[0_8px_18px_rgba(16,27,43,0.10)]"
                      style={{ background: card.bg }}
                    >
                      {active ? "↑" : "→"}
                    </div>
                  </div>

                  <div
                    className="min-h-[132px] p-5 pt-6"
                    style={{ background: card.bg }}
                  >
                    <h3 className="text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-[#102033]">
                      {card.title}
                    </h3>

                    <p className="mt-2 max-w-[250px] text-[13px] leading-5 text-[#5f6b78]">
                      {card.description}
                    </p>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        active
                          ? "mt-3 max-h-28 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="rounded-2xl bg-white/70 p-3 text-[12px] leading-5 text-[#566270]">
                        {card.reveal}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>


      {/* EXPLORE */}
      {/* HOW KARMAFACIE WORKS */}
      <section id="how-it-works" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-white/25">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff7a00]">
                {text.journeyFlowLabel}
              </p>
              <h2 className="mt-3 text-[36px] font-black leading-tight tracking-[-0.04em] text-[#102033] md:text-[48px]">
                {text.howTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#62707d] md:text-[17px]">
                {text.journeyFlowDescription}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[30px] border border-[#e7e0d7] bg-white/90 p-5 shadow-[0_18px_55px_rgba(16,27,43,0.045)] md:p-7">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {text.journeyFlow.map((step, index) => (
                <div key={step.title} className="group relative rounded-[22px] border border-[#ebe4da] bg-[#fffdfa] px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f6ede1] text-lg">
                      {step.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-[16px] font-extrabold text-[#102033]">
                          {step.title}
                        </h3>
                        <span className="text-[10px] font-black tracking-[0.16em] text-[#a2a7ab]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-5 text-[#727d87]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 hidden items-center justify-between gap-3 rounded-[20px] border border-[#e9e1d7] bg-[#f9f5ed] px-5 py-3 md:flex">
              {text.journeyFlow.map((step, index) => (
                <div key={`${step.title}-rail`} className="flex min-w-0 items-center gap-3">
                  <div className="whitespace-nowrap text-[11px] font-bold text-[#657080]">
                    <span className="mr-1.5 font-black text-[#ff7a00]">{String(index + 1).padStart(2, "0")}</span>
                    {step.title}
                  </div>
                  {index < text.journeyFlow.length - 1 && (
                    <span className="text-[#c5bfb6]">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY KARMAFACIE */}
      <section id="why" className="relative z-10 scroll-mt-36 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff7a00]">
                {text.whyLabel}
              </p>
              <h2 className="mt-3 max-w-[520px] text-[36px] font-black leading-[1.02] tracking-[-0.04em] text-[#102033] md:text-[48px]">
                {text.whyTitle}
              </h2>
            </div>

            <div className="md:justify-self-end md:max-w-[500px]">
              <p className="text-[15px] leading-7 text-[#66727e] md:text-[16px]">
                {text.aboutDescription}
              </p>
            </div>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-[1fr_76px_1fr] md:items-stretch">
            <div className="kf-why-challenge-card relative overflow-hidden rounded-[30px] border border-[#e6e0d8] bg-white p-7 shadow-[0_16px_40px_rgba(16,27,43,0.05)] md:p-8">
              <div className="kf-why-challenge-deco absolute right-0 top-0 h-28 w-28 rounded-full bg-[#dfeaf3]/75 blur-[1px]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="kf-why-challenge-label text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a929c]">
                    {text.problemTitle}
                  </div>
                  <div className="kf-why-challenge-icon grid h-10 w-10 place-items-center rounded-full bg-[#f8f3ea] text-[15px] text-[#d76b55]">
                    ✕
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[text.problem1, text.problem2, text.problem3, text.problem4].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="kf-why-challenge-row flex items-start gap-3 rounded-2xl border border-[#eee9e2] bg-[#fbfaf7] px-4 py-3.5"
                      >
                        <span className="kf-why-challenge-number mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-[#d76b55] shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="kf-why-challenge-text text-[13.5px] leading-6 text-[#5f6b77]">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="relative hidden md:flex items-center justify-center">
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#e2ddd5]" />
              <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-[#f0d6ba] bg-[#fff5e9] text-[18px] font-black text-[#ff7a00] shadow-[0_10px_22px_rgba(16,27,43,0.06)]">
                →
              </div>
            </div>

            <div className="kf-why-solution-card relative overflow-hidden rounded-[30px] border border-[#dfead2] bg-[#edf5dd] p-7 shadow-[0_16px_40px_rgba(16,27,43,0.05)] md:p-8">
              <div className="kf-why-solution-deco absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-white/60 blur-[1px]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="kf-why-solution-label text-[11px] font-bold uppercase tracking-[0.18em] text-[#6f9142]">
                    {text.solutionTitle}
                  </div>
                  <div className="kf-why-solution-icon grid h-10 w-10 place-items-center rounded-full bg-white/80 text-[15px] text-[#6f9142]">
                    ✓
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[text.solution1, text.solution2, text.solution3, text.solution4].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="kf-why-solution-row flex items-start gap-3 rounded-2xl border border-white/80 bg-white/65 px-4 py-3.5"
                      >
                        <span className="kf-why-solution-number mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-[#6f9142] shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="kf-why-solution-text text-[13.5px] leading-6 text-[#4f5b68]">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b939c]">
            <span>KarmaFacie</span>
            <span className="text-[#ff7a00]">•</span>
            <span>Learn</span>
            <span className="text-[#ff7a00]">→</span>
            <span>Understand</span>
            <span className="text-[#ff7a00]">→</span>
            <span>Participate</span>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust" className="relative z-10 scroll-mt-36 border-t border-[#ece7df] bg-[#fffaf2]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e7dfd2] bg-white/80 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b838d]">
                  {text.trustLabel}
                </span>
              </div>

              <h2 className="mt-5 max-w-xl text-[38px] font-black leading-[1.05] tracking-[-0.035em] text-[#102033] md:text-[48px]">
                {text.trustTitle}
              </h2>
            </div>

            <div className="lg:pb-1">
              <p className="max-w-2xl text-[16px] leading-7 text-[#65717d] md:text-[17px]">
                {text.trustDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-[#eadfd1] bg-white px-3.5 py-2 text-[11px] font-bold text-[#5e6874]">
                  {text.trustChip1}
                </span>
                <span className="rounded-full border border-[#d8e5ef] bg-[#edf5fb] px-3.5 py-2 text-[11px] font-bold text-[#536577]">
                  {text.trustChip2}
                </span>
                <span className="rounded-full border border-[#e1e8d5] bg-[#f1f5e8] px-3.5 py-2 text-[11px] font-bold text-[#5d6b4d]">
                  {text.trustChip3}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
            {[
              [text.trust1Title, text.trust1Description, "🔗", "#edf5fb"],
              [text.trust2Title, text.trust2Description, "👤", "#f3f6ea"],
              [text.trust3Title, text.trust3Description, "🛡️", "#fff0e1"],
            ].map(([title, description, icon, tint], index) => (
              <div
                key={title}
                className={`relative overflow-hidden rounded-[26px] border border-[#e5e0d8] bg-white p-6 shadow-[0_14px_34px_rgba(35,47,58,0.05)] ${
                  index === 0 ? "lg:p-7" : ""
                }`}
              >
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-70"
                  style={{ background: tint }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-2xl border border-white/70 text-xl shadow-sm"
                      style={{ background: tint }}
                    >
                      {icon}
                    </div>
                    <span className="text-[10px] font-black tracking-[0.18em] text-[#a1a6ab]">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[18px] font-extrabold tracking-[-0.015em] text-[#102033]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#69737d]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[#e7dfd2] bg-white/75 px-5 py-4 md:px-6">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8b9299]">
                {text.trustSystemLabel}
              </p>
              <p className="max-w-3xl text-[12.5px] leading-5 text-[#66717b] md:text-right">
                {text.trustSystemDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="relative overflow-hidden rounded-[36px] border border-[#e5ded3] bg-[radial-gradient(circle_at_80%_15%,#e8f2f8_0%,transparent_27%),radial-gradient(circle_at_15%_90%,#fff0dd_0%,transparent_30%),#f8f3ea] shadow-[0_20px_55px_rgba(16,27,43,0.07)]">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#dfeaf3]/80" />
            <div className="pointer-events-none absolute -bottom-24 -left-14 h-60 w-60 rounded-full bg-[#ffe0c2]/70" />

            <div className="relative grid gap-10 px-7 py-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-12 md:py-14">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8a8f95]">
                  <span className="h-2 w-2 rounded-full bg-[#ff7a00]" />
                  KarmaFacie
                </div>

                <h2 className="mt-4 max-w-3xl text-[38px] font-black leading-[1.03] tracking-[-0.04em] text-[#102033] md:text-[52px]">
                  {text.ctaTitle1}
                  <span className="text-[#ff7a00]">{text.ctaTitle2}</span>
                </h2>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#66727e] md:text-[16px]">
                  {text.ctaDescription}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/explore")}
                    className="rounded-full bg-[#ff7a00] px-7 py-3.5 text-[12px] font-black text-white shadow-[0_10px_24px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"
                  >
                    {text.exploreNow}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(isAuthenticated ? "/dashboard" : "/auth")
                    }
                    className="rounded-full border border-[#d7d2c9] bg-white/70 px-7 py-3.5 text-[12px] font-black text-[#263447] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    {isAuthenticated ? "Dashboard →" : text.signInUp}
                  </button>
                </div>
              </div>

              <div className="md:justify-self-end md:w-full md:max-w-[340px]">
                <div className="rounded-[28px] border border-[#dedbd4] bg-white/75 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#969ba0]">
                    Your civic journey
                  </p>

                  <div className="mt-4 space-y-2.5">
                    {[
                      ["01", text.learnTitle, "#edf5fb"],
                      ["02", text.understandTitle, "#fff0df"],
                      ["03", text.participateTitle, "#eef5e6"],
                    ].map(([number, label, tint]) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 rounded-[18px] border border-[#eee9e1] bg-white px-3.5 py-3"
                      >
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-black tracking-[0.08em] text-[#263447]"
                          style={{ background: tint }}
                        >
                          {number}
                        </div>
                        <div className="h-px flex-1 bg-[#e8e2d9]" />
                        <div className="text-right text-[12px] font-black text-[#263447]">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#ece7df] bg-[#fffaf2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-9 text-center text-sm text-[#7c8288] md:flex-row md:items-center md:justify-between md:text-left">
          <div
            className="kf-footer-brand font-black text-[16px] text-[#102033]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Karma<span className="text-[#ff7a00]">Facie</span>
          </div>

          <div className="text-[12px] text-[#8b9096]">
            {text.footerTagline}
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a0a4aa]">
            India · Civic participation
          </div>
        </div>
      </footer>

<style>{`
/* =========================================================
   KARMAFACIE HOMEPAGE — DARK MODE
   Step 2 / visual refinement
   Dark mode follows the visual language of About + What We Do:
   deep navy canvas, layered navy cards, soft category tints,
   cream icon surfaces, orange accents and restrained blue/green/peach.
   ========================================================= */

html[data-theme="dark"] main {
  color: #f5f7fb !important;
  background: #07111f !important;
}

html[data-theme="dark"] body {
  background: #07111f !important;
}

/* Background artwork becomes atmosphere instead of a competing canvas. */
html[data-theme="dark"] main > .pointer-events-none.fixed {
  opacity: 1 !important;
  background: #07111f !important;
}

html[data-theme="dark"] main > .pointer-events-none.fixed img {
  opacity: 0.10 !important;
  filter: brightness(0.58) saturate(0.70) contrast(1.04) !important;
}

html[data-theme="dark"] main > .pointer-events-none.fixed::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 88% 8%, rgba(63,167,255,.12), transparent 28%),
    radial-gradient(circle at 10% 72%, rgba(255,122,26,.055), transparent 25%),
    linear-gradient(180deg, rgba(7,17,31,.72), rgba(7,17,31,.96));
}

html[data-theme="dark"] main > section {
  color: #f5f7fb;
  background: transparent !important;
}

/* ---------- Header ---------- */
html[data-theme="dark"] .kf-glass-nav {
  background: linear-gradient(135deg, rgba(18,40,63,.92), rgba(12,29,49,.88)) !important;
  border-color: rgba(126,166,204,.20) !important;
  box-shadow:
    0 16px 42px rgba(0,0,0,.28),
    inset 0 1px 0 rgba(255,255,255,.07) !important;
  backdrop-filter: blur(24px) saturate(135%);
  -webkit-backdrop-filter: blur(24px) saturate(135%);
}

html[data-theme="dark"] .kf-glass-nav::before {
  background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.008)) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08) !important;
}

html[data-theme="dark"] .kf-glass-logo {
  color: #f5f7fb !important;
}

html[data-theme="dark"] .kf-glass-nav-item {
  color: #9eafc2 !important;
}

html[data-theme="dark"] .kf-glass-nav-item:hover {
  background: rgba(255,255,255,.065) !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-glass-control,
html[data-theme="dark"] .kf-glass-auth-button {
  background: rgba(16,36,58,.86) !important;
  border-color: rgba(143,181,220,.18) !important;
  color: #cbd7e5 !important;
}

html[data-theme="dark"] .kf-glass-control:hover,
html[data-theme="dark"] .kf-glass-auth-button:hover {
  background: #172f4a !important;
  color: #ffffff !important;
}

html[data-theme="dark"] .kf-glass-dashboard {
  background: #ff7a1a !important;
  border-color: #ff9a55 !important;
  color: #101a27 !important;
}

html[data-theme="dark"] .kf-glass-nav .bg-gradient-to-r,
html[data-theme="dark"] .kf-glass-nav .bg-white\/30,
html[data-theme="dark"] .kf-glass-nav .bg-white\/16,
html[data-theme="dark"] .kf-glass-nav .bg-white\/27 {
  opacity: .18 !important;
}

html[data-theme="dark"] .kf-home-theme-toggle {
  background: #10243a !important;
  border-color: rgba(143,181,220,.22) !important;
  color: #f5f7fb !important;
}

/* ---------- Shared typography ---------- */
html[data-theme="dark"] h1,
html[data-theme="dark"] h2,
html[data-theme="dark"] h3 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] .text-\[\#102033\] {
  color: #f5f7fb !important;
}

/* ---------- Hero ---------- */
html[data-theme="dark"] main > section:first-of-type .bg-\[\#fff0dc\] {
  background: rgba(255,240,220,.10) !important;
  color: #ffd1aa !important;
  border: 1px solid rgba(255,154,85,.18);
}

html[data-theme="dark"] main > section:first-of-type p {
  color: #aebdd0 !important;
}

/* ---------- ABOUT — master visual reference ---------- */
html[data-theme="dark"] #about {
  border-top-color: rgba(143,181,220,.10) !important;
}

html[data-theme="dark"] #about .text-\[\#ff7a00\] {
  color: #ff8b32 !important;
}

html[data-theme="dark"] #about .border-\[\#ddd7cc\] {
  border-color: rgba(143,181,220,.18) !important;
  background: #10243a !important;
  color: #cbd7e5 !important;
}

html[data-theme="dark"] #about > div > div > div:last-child {
  background:
    radial-gradient(circle at 92% 0%, rgba(197,215,231,.16), transparent 22%),
    radial-gradient(circle at 4% 100%, rgba(255,179,122,.12), transparent 23%),
    #10243a !important;
  border-color: rgba(143,181,220,.18) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.24) !important;
}

html[data-theme="dark"] #about > div > div > div:last-child p {
  color: #b8c6d6 !important;
}

html[data-theme="dark"] #about > div > div > div:last-child .border-t {
  border-color: rgba(143,181,220,.14) !important;
}

html[data-theme="dark"] #about > div > div > div:last-child span:not(.h-2) {
  color: #8296ad !important;
}

/* ---------- WHAT WE DO — keep its successful dark category language ---------- */
html[data-theme="dark"] #what-we-do h2 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] #what-we-do button {
  border-color: rgba(143,181,220,.17) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.18) !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(1) > div:last-child {
  background: #30251b !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(2) > div:last-child {
  background: #10263a !important;
}

html[data-theme="dark"] #what-we-do button:nth-child(3) > div:last-child {
  background: #182c25 !important;
}

html[data-theme="dark"] #what-we-do button h3 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] #what-we-do button p {
  color: #aebdd0 !important;
}

html[data-theme="dark"] #what-we-do button .bg-white\/70 {
  background: rgba(255,255,255,.055) !important;
  color: #c2cedc !important;
}

/* ---------- JOURNEY ---------- */
html[data-theme="dark"] #how-it-works {
  border-top-color: rgba(143,181,220,.10) !important;
}

html[data-theme="dark"] #how-it-works > div > div:last-child {
  background:
    radial-gradient(circle at 95% 0%, rgba(63,167,255,.06), transparent 24%),
    #0d1d31 !important;
  border-color: rgba(143,181,220,.18) !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div {
  background: #10243a !important;
  border-color: rgba(143,181,220,.14) !important;
}

html[data-theme="dark"] #how-it-works h3 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] #how-it-works p {
  color: #aebdd0 !important;
}

/* Cream icon circles — exactly the visual language used by What We Do. */
html[data-theme="dark"] #how-it-works .bg-\[\#f6ede1\] {
  background: #f8f1e6 !important;
  color: #263447 !important;
}

/* Replace the light journey rail with a dark raised rail. */
html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] {
  background: #10243a !important;
  border-color: rgba(143,181,220,.14) !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] .text-\[\#657080\] {
  color: #b7c5d7 !important;
}

html[data-theme="dark"] #how-it-works .bg-\[\#f9f5ed\] .text-\[\#c5bfb6\] {
  color: #60748b !important;
}

/* ---------- WHY KARMAFACIE ---------- */
html[data-theme="dark"] #why {
  background: transparent !important;
}

/* Challenge: deep blue surface. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child {
  background:
    radial-gradient(circle at 88% 2%, rgba(205,218,231,.13), transparent 18%),
    #10243a !important;
  border-color: rgba(143,181,220,.18) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.22) !important;
}

/* What changes: deep civic green, not a pale pastel block. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child {
  background:
    radial-gradient(circle at 5% 98%, rgba(205,232,187,.10), transparent 20%),
    #182c25 !important;
  border-color: rgba(143,181,220,.15) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,.22) !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div h3,
html[data-theme="dark"] #why > div > div:nth-child(2) > div > div.relative > div > div > div {
  color: #f5f7fb !important;
}

html[data-theme="dark"] #why > div > div:nth-child(2) > div p,
html[data-theme="dark"] #why > div > div:nth-child(2) > div > div.relative > div > div > div > span:last-child {
  color: #aebdd0 !important;
}

/* Number rows become the same dark raised cards seen in What We Do. */
html[data-theme="dark"] #why [class*="bg-[#fbfaf7]"],
html[data-theme="dark"] #why [class*="bg-white/65"] {
  background: rgba(7,17,31,.42) !important;
  border-color: rgba(143,181,220,.13) !important;
}

html[data-theme="dark"] #why [class*="bg-[#fbfaf7]"] span:last-child,
html[data-theme="dark"] #why [class*="bg-white/65"] span:last-child {
  color: #aebdd0 !important;
}

html[data-theme="dark"] #why [class*="bg-[#f8f3ea]"] {
  background: #f8f1e6 !important;
  color: #d76b55 !important;
}

html[data-theme="dark"] #why [class*="bg-[#fff5e9]"] {
  background: rgba(255,122,26,.12) !important;
  border-color: rgba(255,122,26,.22) !important;
  color: #ff8b32 !important;
}

/* Central divider and arrow. */
html[data-theme="dark"] #why .bg-\[\#fff5e9\] {
  background: rgba(255,122,26,.12) !important;
}

html[data-theme="dark"] #why .bg-\[\#fff5e9\] + * {
  background: rgba(143,181,220,.18) !important;
}

/* ---------- TRUST & TRANSPARENCY ---------- */
html[data-theme="dark"] #trust {
  border-top-color: rgba(143,181,220,.10) !important;
  background: transparent !important;
}

html[data-theme="dark"] #trust .bg-white\/80 {
  background: #10243a !important;
  border-color: rgba(143,181,220,.15) !important;
}

html[data-theme="dark"] #trust .text-\[\#7b838d\] {
  color: #9eafc2 !important;
}

html[data-theme="dark"] #trust > div > div:first-child > div:last-child p {
  color: #aebdd0 !important;
}

html[data-theme="dark"] #trust .border-\[\#eadfd1\],
html[data-theme="dark"] #trust .border-\[\#d8e5ef\],
html[data-theme="dark"] #trust .border-\[\#e1e8d5\] {
  border-color: rgba(143,181,220,.16) !important;
  color: #cbd7e5 !important;
}

html[data-theme="dark"] #trust .border-\[\#eadfd1\] { background: #30251b !important; }
html[data-theme="dark"] #trust .border-\[\#d8e5ef\] { background: #10263a !important; }
html[data-theme="dark"] #trust .border-\[\#e1e8d5\] { background: #182c25 !important; }

/* Three cards: blue / green / peach — matching the What We Do category system. */
html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(1) {
  background: #10263a !important;
  border-color: rgba(79,181,255,.18) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(2) {
  background: #182c25 !important;
  border-color: rgba(143,209,139,.16) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div:nth-child(3) {
  background: #30251b !important;
  border-color: rgba(255,179,122,.18) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div {
  box-shadow: 0 18px 44px rgba(0,0,0,.20) !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div h3 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div p {
  color: #aebdd0 !important;
}

html[data-theme="dark"] #trust > div > div:nth-child(2) > div .absolute {
  opacity: .28 !important;
}

html[data-theme="dark"] #trust > div > div:last-child {
  background: #10243a !important;
  border-color: rgba(143,181,220,.15) !important;
}

html[data-theme="dark"] #trust > div > div:last-child p {
  color: #aebdd0 !important;
}

/* ---------- FINAL CTA ---------- */
html[data-theme="dark"] main > section:last-of-type {
  background: transparent !important;
}

html[data-theme="dark"] main > section:last-of-type > div > div {
  background:
    radial-gradient(circle at 88% 4%, rgba(63,167,255,.10), transparent 23%),
    radial-gradient(circle at 4% 96%, rgba(255,179,122,.11), transparent 23%),
    #10243a !important;
  border-color: rgba(143,181,220,.18) !important;
  box-shadow: 0 24px 60px rgba(0,0,0,.28) !important;
}

html[data-theme="dark"] main > section:last-of-type h2 {
  color: #f5f7fb !important;
}

html[data-theme="dark"] main > section:last-of-type p {
  color: #aebdd0 !important;
}

/* CTA journey panel follows the About card: dark raised surface + cream icons. */
html[data-theme="dark"] main > section:last-of-type .bg-white\/75 {
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.16) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white {
  background: #10263a !important;
  border-color: rgba(143,181,220,.12) !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-\[\#edf5fb\] {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-\[\#fff0df\] {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-\[\#eef5e6\] {
  background: #f8f1e6 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white .text-\[\#263447\] {
  color: #dce6f0 !important;
}

html[data-theme="dark"] main > section:last-of-type .text-\[\#969ba0\] {
  color: #7f92a8 !important;
}

html[data-theme="dark"] main > section:last-of-type .text-\[\#263447\] {
  color: #dce6f0 !important;
}

html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#edf5fb\] + div,
html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#fff0df\] + div,
html[data-theme="dark"] main > section:last-of-type .bg-white .bg-\[\#eef5e6\] + div {
  background: rgba(143,181,220,.22) !important;
}

html[data-theme="dark"] main > section:last-of-type button:last-child {
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.18) !important;
  color: #dce6f0 !important;
}

html[data-theme="dark"] main > section:last-of-type button:last-child:hover {
  background: #172f4a !important;
}

/* ---------- Footer ---------- */
html[data-theme="dark"] footer {
  background: #081523 !important;
  border-top-color: rgba(143,181,220,.10) !important;
  color: #8192a8 !important;
}

html[data-theme="dark"] footer .text-\[\#102033\] {
  color: #f5f7fb !important;
}

html[data-theme="dark"] footer .text-\[\#8b9096\],
html[data-theme="dark"] footer .text-\[\#a0a4aa\] {
  color: #71839a !important;
}

/* ---------- Mobile ---------- */
@media (max-width: 1023px) {
  html[data-theme="dark"] .kf-glass-nav {
    background: rgba(10,24,41,.94) !important;
  }
}

/* =========================================================
   DARK MODE v7 — CLEAN CONTRAST / NO LIGHT-MODE ARTIFACTS
   ========================================================= */

/* ---------- HOW IT WORKS ---------- */
/* One unified navy card surface; category colors live in the icon,
   border and tiny accent instead of turning every card into a different panel. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div {
  background: #10263a !important;
  border-color: rgba(143,181,220,.16) !important;
  box-shadow: 0 12px 30px rgba(0,0,0,.16) !important;
}

/* Important: the first child inside each card is the flex row.
   Do NOT paint it with a rectangular category background. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div > div:first-child {
  background: transparent !important;
  border: 0 !important;
}

/* Restore a clean, circular category icon only. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div > div:first-child > div:first-child {
  border: 1px solid rgba(248,241,230,.10) !important;
  box-shadow: 0 8px 18px rgba(0,0,0,.16) !important;
}

/* Discover — warm orange */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) > div:first-child > div:first-child {
  background: #3b281d !important;
  color: #ffad70 !important;
  border-color: rgba(255,173,112,.22) !important;
}
/* Learn — civic blue */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) > div:first-child > div:first-child {
  background: #173652 !important;
  color: #78c8ff !important;
  border-color: rgba(120,200,255,.20) !important;
}
/* Understand — civic green */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) > div:first-child > div:first-child {
  background: #203d31 !important;
  color: #9bd681 !important;
  border-color: rgba(155,214,129,.20) !important;
}
/* Act — lavender */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) > div:first-child > div:first-child {
  background: #342947 !important;
  color: #d0a9ff !important;
  border-color: rgba(208,169,255,.20) !important;
}
/* Show Proof — peach */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) > div:first-child > div:first-child {
  background: #3b281d !important;
  color: #ffb67e !important;
  border-color: rgba(255,182,126,.20) !important;
}
/* Verify — green */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) > div:first-child > div:first-child {
  background: #203d31 !important;
  color: #a5dc8c !important;
  border-color: rgba(165,220,140,.20) !important;
}
/* Earn & Track — blue */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) > div:first-child > div:first-child {
  background: #173652 !important;
  color: #83cfff !important;
  border-color: rgba(131,207,255,.20) !important;
}
/* Build & Belong — lavender */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) > div:first-child > div:first-child {
  background: #342947 !important;
  color: #d7b4ff !important;
  border-color: rgba(215,180,255,.20) !important;
}

/* Card text: same contrast hierarchy as About / What We Do. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div h3 {
  color: #f7f8fb !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div p {
  color: #b9c7d7 !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div span {
  color: #91a5ba !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div > div:first-child > div:last-child span {
  color: #91a5ba !important;
}

/* Timeline rail: dark, not cream. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:last-child {
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.16) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.02) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:last-child > div > div {
  color: #c5d2df !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:last-child > div > div span:first-child {
  color: #ff8b32 !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:last-child > div > span {
  color: #60758c !important;
}

/* ---------- WHY KARMAFACIE ---------- */
/* Both sides share the same navy language. Green is reserved for the success mark. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child,
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child {
  background: #10263a !important;
  border-color: rgba(143,181,220,.17) !important;
  box-shadow: 0 18px 45px rgba(0,0,0,.20) !important;
}

/* Decorative circles: no pale white spots. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child > div.absolute {
  background: rgba(91,160,211,.16) !important;
  opacity: 1 !important;
  filter: blur(2px) !important;
}
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child > div.absolute {
  background: rgba(255,139,50,.10) !important;
  opacity: 1 !important;
  filter: blur(2px) !important;
}

/* Section labels. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .text-\[\#8a929c\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .text-\[\#6f9142\] {
  color: #9fb2c5 !important;
}

/* Problem / solution rows. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .bg-\[\#fbfaf7\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .bg-white\/65 {
  background: #0d1d31 !important;
  border-color: rgba(143,181,220,.13) !important;
}
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .text-\[\#5f6b77\],
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .text-\[\#4f5b68\] {
  color: #b8c7d6 !important;
}

/* Cream number circles remain as intentional high-contrast anchors. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .bg-white,
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .bg-white {
  background: #f8f1e6 !important;
}
html[data-theme="dark"] #why > div > div:nth-child(2) > div:first-child .text-\[\#d76b55\] {
  color: #e8795d !important;
}
html[data-theme="dark"] #why > div > div:nth-child(2) > div:last-child .text-\[\#6f9142\] {
  color: #6f9f48 !important;
}

/* Central divider / arrow. */
html[data-theme="dark"] #why > div > div:nth-child(2) > div:nth-child(2) > div:first-child {
  background: rgba(143,181,220,.22) !important;
}
html[data-theme="dark"] #why > div > div:nth-child(2) > div:nth-child(2) > div:last-child {
  background: rgba(255,122,26,.10) !important;
  border-color: rgba(255,122,26,.24) !important;
  color: #ff8b32 !important;
}

/* ---------- FINAL CTA ---------- */
/* Outer CTA uses the same navy canvas as About. */
html[data-theme="dark"] main > section:last-of-type > div > div {
  background:
    radial-gradient(circle at 88% 4%, rgba(74,150,207,.09), transparent 22%),
    radial-gradient(circle at 5% 96%, rgba(255,139,50,.08), transparent 22%),
    #10263a !important;
  border-color: rgba(143,181,220,.18) !important;
}

/* Remove the two pale light-mode decorative blobs. */
html[data-theme="dark"] main > section:last-of-type > div > div > div.absolute {
  opacity: .35 !important;
  filter: blur(1px) !important;
}
html[data-theme="dark"] main > section:last-of-type > div > div > div.absolute:first-child {
  background: rgba(88,159,213,.28) !important;
}
html[data-theme="dark"] main > section:last-of-type > div > div > div.absolute:nth-child(2) {
  background: rgba(255,139,50,.22) !important;
}

/* CTA copy. */
html[data-theme="dark"] main > section:last-of-type h2 {
  color: #f7f8fb !important;
}
html[data-theme="dark"] main > section:last-of-type p {
  color: #b9c7d7 !important;
}

/* The civic journey panel — explicitly target the slash class through
   an attribute selector so the light-mode Tailwind class cannot leak through. */
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] {
  background: #0b1a2b !important;
  border-color: rgba(143,181,220,.20) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,.24) !important;
  color: #f7f8fb !important;
}

html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] > p {
  color: #9fb2c5 !important;
}

/* Journey rows. */
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"] {
  background: #10263a !important;
  border-color: rgba(143,181,220,.15) !important;
  color: #f7f8fb !important;
}

/* The horizontal rule inside each journey row. */
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"] > div:nth-child(2) {
  background: rgba(185,199,215,.40) !important;
}

/* Learn / Understand / Participate labels — warm white, not dark navy. */
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"] > div:last-child {
  color: #f1f5f9 !important;
  text-shadow: 0 1px 10px rgba(0,0,0,.18);
}

/* Journey number circles keep the cream anchor but use theme-colored numerals. */
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"]:nth-child(1) > div:first-child {
  background: #f8f1e6 !important;
  color: #e8795d !important;
}
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"]:nth-child(2) > div:first-child {
  background: #f8f1e6 !important;
  color: #d18b4c !important;
}
html[data-theme="dark"] main > section:last-of-type [class*="bg-white/75"] [class~="bg-white"]:nth-child(3) > div:first-child {
  background: #f8f1e6 !important;
  color: #6f9f48 !important;
}

/* Secondary CTA button. */
html[data-theme="dark"] main > section:last-of-type button:last-child {
  background: #0b1a2b !important;
  border-color: rgba(143,181,220,.24) !important;
  color: #edf3f8 !important;
}
html[data-theme="dark"] main > section:last-of-type button:last-child:hover {
  background: #17324d !important;
}


/* =========================================================
   HOW IT WORKS — V9: FULL-CARD COLOR TINTS / NO INNER PATCHES
   Each journey card keeps its category color as a subtle full-card
   surface. The content row is explicitly transparent so no
   rectangular panel can appear behind the icon or text.
   ========================================================= */

/* Full-card category surfaces. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) {
  background: linear-gradient(135deg, #3a291d 0%, #2f241c 100%) !important;
  border-color: rgba(255, 173, 112, .22) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) {
  background: linear-gradient(135deg, #14324b 0%, #102b42 100%) !important;
  border-color: rgba(120, 200, 255, .20) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) {
  background: linear-gradient(135deg, #1d392d 0%, #183126 100%) !important;
  border-color: rgba(155, 214, 129, .20) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) {
  background: linear-gradient(135deg, #302741 0%, #292138 100%) !important;
  border-color: rgba(208, 169, 255, .20) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) {
  background: linear-gradient(135deg, #3a291d 0%, #2f241c 100%) !important;
  border-color: rgba(255, 182, 126, .22) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) {
  background: linear-gradient(135deg, #1d392d 0%, #183126 100%) !important;
  border-color: rgba(165, 220, 140, .20) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) {
  background: linear-gradient(135deg, #14324b 0%, #102b42 100%) !important;
  border-color: rgba(131, 207, 255, .20) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) {
  background: linear-gradient(135deg, #302741 0%, #292138 100%) !important;
  border-color: rgba(215, 180, 255, .20) !important;
}

/* CRITICAL: the first flex row inside every card must be transparent.
   These selectors intentionally match/exceed the specificity of the
   earlier category rules that created the rectangular patches. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) > div:first-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) > div:first-child {
  background: transparent !important;
  background-image: none !important;
  border: 0 !important;
  box-shadow: none !important;
}

/* Keep the text wrapper completely clean as well. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) > div:first-child > div:last-child,
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) > div:first-child > div:last-child {
  background: transparent !important;
  background-image: none !important;
}

/* Circular icons retain their individual accent colors. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(1) > div:first-child > div:first-child {
  background: rgba(74, 48, 32, .72) !important;
  color: #ffb37a !important;
  border: 1px solid rgba(255, 173, 112, .25) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(2) > div:first-child > div:first-child {
  background: rgba(24, 59, 87, .72) !important;
  color: #8fd0ff !important;
  border: 1px solid rgba(120, 200, 255, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(3) > div:first-child > div:first-child {
  background: rgba(37, 65, 49, .72) !important;
  color: #a8d78d !important;
  border: 1px solid rgba(155, 214, 129, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(4) > div:first-child > div:first-child {
  background: rgba(58, 45, 73, .72) !important;
  color: #d5b5ff !important;
  border: 1px solid rgba(208, 169, 255, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(5) > div:first-child > div:first-child {
  background: rgba(74, 48, 32, .72) !important;
  color: #ffc08e !important;
  border: 1px solid rgba(255, 182, 126, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(6) > div:first-child > div:first-child {
  background: rgba(37, 65, 49, .72) !important;
  color: #a5dc8c !important;
  border: 1px solid rgba(165, 220, 140, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(7) > div:first-child > div:first-child {
  background: rgba(24, 59, 87, .72) !important;
  color: #83cfff !important;
  border: 1px solid rgba(131, 207, 255, .24) !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div:nth-child(8) > div:first-child > div:first-child {
  background: rgba(58, 45, 73, .72) !important;
  color: #d7b4ff !important;
  border: 1px solid rgba(215, 180, 255, .24) !important;
}

/* Strong, consistent text contrast directly on the colored cards. */
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div h3 {
  color: #f7f8fb !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div p {
  color: #c2cfdd !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div span {
  color: #aebed0 !important;
}
html[data-theme="dark"] #how-it-works > div > div:last-child > div:first-child > div > div:first-child > div:last-child span {
  color: #aebed0 !important;
}

html[data-theme="dark"] footer .kf-footer-brand {
  color: #f5f7fb !important;
}

html[data-theme="dark"] footer .kf-footer-brand > span {
  color: #ff7a00 !important;
}

/* =========================================================
   WHY KARMAFACIE — FINAL DARK CARD THEMES
   Dark mode only. Dedicated selectors keep each panel distinctly tinted.
   ========================================================= */
html[data-theme="dark"] #why .kf-why-challenge-card {
  background: radial-gradient(circle at 92% 4%, rgba(255,117,160,.12), transparent 22%), linear-gradient(145deg,#351b29 0%,#24151f 48%,#17111a 100%) !important;
  border-color: rgba(255,115,155,.34) !important;
  box-shadow: 0 24px 58px rgba(0,0,0,.30), 0 0 38px rgba(255,79,130,.06), inset 0 1px 0 rgba(255,255,255,.045) !important;
}
html[data-theme="dark"] #why .kf-why-solution-card {
  background: radial-gradient(circle at 8% 96%, rgba(132,220,138,.12), transparent 24%), linear-gradient(145deg,#193629 0%,#102a21 50%,#0d1f1a 100%) !important;
  border-color: rgba(119,210,132,.34) !important;
  box-shadow: 0 24px 58px rgba(0,0,0,.30), 0 0 38px rgba(93,207,118,.06), inset 0 1px 0 rgba(255,255,255,.045) !important;
}
html[data-theme="dark"] #why .kf-why-challenge-row {
  background: linear-gradient(145deg,rgba(55,25,40,.94),rgba(31,18,27,.96)) !important;
  border-color: rgba(255,115,155,.16) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.018),0 8px 18px rgba(0,0,0,.14) !important;
}
html[data-theme="dark"] #why .kf-why-solution-row {
  background: linear-gradient(145deg,rgba(24,57,43,.94),rgba(14,34,27,.96)) !important;
  border-color: rgba(119,210,132,.16) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.018),0 8px 18px rgba(0,0,0,.14) !important;
}
html[data-theme="dark"] #why .kf-why-challenge-label { color:#ff91ad !important; }
html[data-theme="dark"] #why .kf-why-solution-label { color:#91d995 !important; }
html[data-theme="dark"] #why .kf-why-challenge-text { color:#d6bcc7 !important; }
html[data-theme="dark"] #why .kf-why-solution-text { color:#c4dacb !important; }
html[data-theme="dark"] #why .kf-why-challenge-number,
html[data-theme="dark"] #why .kf-why-challenge-icon { background:#f8efe9 !important; color:#d75d79 !important; box-shadow:0 8px 20px rgba(0,0,0,.16) !important; }
html[data-theme="dark"] #why .kf-why-solution-number,
html[data-theme="dark"] #why .kf-why-solution-icon { background:#eef5ea !important; color:#5f9f68 !important; box-shadow:0 8px 20px rgba(0,0,0,.16) !important; }
html[data-theme="dark"] #why .kf-why-challenge-deco { background:rgba(255,104,146,.14) !important; box-shadow:0 0 34px rgba(255,79,130,.08) !important; }
html[data-theme="dark"] #why .kf-why-solution-deco { background:rgba(121,207,133,.14) !important; box-shadow:0 0 34px rgba(93,207,118,.08) !important; }

`}
</style>

    </main>
  );
}