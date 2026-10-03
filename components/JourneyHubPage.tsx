"use client";



import Link from "next/link";

import type { ReactNode } from "react";

import { useLanguage } from "@/components/LanguageProvider";

import type { Language } from "@/lib/i18n";

import KrutBharatMobileShell from "@/components/KrutBharatMobileShell";



type JourneyKind = "learn" | "understand" | "participate";



type Localized<T> = Record<Language, T>;



const journeyMeta: Record<

  JourneyKind,

  Localized<{

    label: string;

    title: string;

    description: string;

    icon: string;

  }>

> = {

  learn: {

    en: {

      label: "LEARN",

      title: "Start with knowledge.",

      description:

        "Explore civic life in India and discover the country through a simple, visual learning journey.",

      icon: "📖",

    },

    hi: {

      label: "सीखें",

      title: "ज्ञान से शुरुआत करें।",

      description:

        "भारत के नागरिक जीवन को समझें और एक सरल, दृश्य सीखने की यात्रा के माध्यम से देश को जानें।",

      icon: "📖",

    },

    mr: {

      label: "शिका",

      title: "ज्ञानापासून सुरुवात करा.",

      description:

        "भारताचे नागरिक जीवन समजून घ्या आणि सोप्या, दृश्य शिकण्याच्या प्रवासातून देश जाणून घ्या.",

      icon: "📖",

    },

  },

  understand: {

    en: {

      label: "UNDERSTAND",

      title: "Make civic life easier to understand.",

      description:

        "Understand civic issues, everyday civic sense and the authorities connected to your area.",

      icon: "💡",

    },

    hi: {

      label: "समझें",

      title: "नागरिक जीवन को समझना आसान बनाएं।",

      description:

        "नागरिक समस्याओं, रोज़मर्रा के नागरिक बोध और अपने क्षेत्र से जुड़े प्राधिकरणों को समझें।",

      icon: "💡",

    },

    mr: {

      label: "समजून घ्या",

      title: "नागरी जीवन समजणे सोपे करा.",

      description:

        "नागरी समस्या, दैनंदिन नागरी जाणीव आणि तुमच्या परिसराशी संबंधित प्राधिकरण समजून घ्या.",

      icon: "💡",

    },

  },

  participate: {

    en: {

      label: "PARTICIPATE",

      title: "Turn knowledge into participation.",

      description:

        "Take part, contribute, track your civic journey and build a record of verified participation.",

      icon: "👥",

    },

    hi: {

      label: "भाग लें",

      title: "ज्ञान को भागीदारी में बदलें।",

      description:

        "भाग लें, योगदान दें, अपनी नागरिक यात्रा को ट्रैक करें और सत्यापित भागीदारी का रिकॉर्ड बनाएं।",

      icon: "👥",

    },

    mr: {

      label: "सहभाग",

      title: "ज्ञानाचे सहभागात रूपांतर करा.",

      description:

        "सहभाग घ्या, योगदान द्या, तुमचा नागरी प्रवास ट्रॅक करा आणि सत्यापित सहभागाची नोंद तयार करा.",

      icon: "👥",

    },

  },

};



const uiCopy: Localized<{

  back: string;

  home: string;

  open: string;

  explore: string;

  discover: string;

  understand: string;

  participate: string;

  topics: string;

  tools: string;

  view: string;

  official: string;

}> = {

  en: {

    back: "Back to KrutBharat",

    home: "Home",

    open: "Open",

    explore: "Explore",

    discover: "Discover India",

    understand: "Understand",

    participate: "Participate",

    topics: "Topics",

    tools: "Tools",

    view: "View section",

    official: "Open experience",

  },

  hi: {

    back: "KrutBharat पर वापस",

    home: "होम",

    open: "खोलें",

    explore: "एक्सप्लोर करें",

    discover: "भारत जानें",

    understand: "समझें",

    participate: "भाग लें",

    topics: "विषय",

    tools: "उपकरण",

    view: "सेक्शन देखें",

    official: "अनुभव खोलें",

  },

  mr: {

    back: "KrutBharat वर परत",

    home: "होम",

    open: "उघडा",

    explore: "एक्सप्लोर करा",

    discover: "भारत जाणून घ्या",

    understand: "समजून घ्या",

    participate: "सहभाग",

    topics: "विषय",

    tools: "साधने",

    view: "सेक्शन पहा",

    official: "अनुभव उघडा",

  },

};



const topicData = [

  { icon: "🏛️", key: "government", href: "/explore/government" },

  { icon: "📜", key: "constitution", href: "/explore/constitution" },

  { icon: "🗳️", key: "elections", href: "/explore/elections" },

  { icon: "🏙️", key: "localIssues", href: "/explore/local-issues" },

  { icon: "🌱", key: "environment", href: "/explore/environment" },

  { icon: "💼", key: "economy", href: "/explore/economy" },

  { icon: "🎓", key: "education", href: "/explore/education" },

  { icon: "🏥", key: "healthcare", href: "/explore/healthcare" },

] as const;



const topicLabels: Localized<Record<(typeof topicData)[number]["key"], string>> = {

  en: {

    government: "Government & Governance",

    constitution: "Constitution & Democracy",

    elections: "Elections & Civic Participation",

    localIssues: "Local Issues",

    environment: "Environment",

    economy: "Economy & Jobs",

    education: "Education",

    healthcare: "Healthcare",

  },

  hi: {

    government: "सरकार और शासन व्यवस्था",

    constitution: "संविधान और लोकतंत्र",

    elections: "चुनाव और नागरिक भागीदारी",

    localIssues: "स्थानीय समस्याएँ",

    environment: "पर्यावरण",

    economy: "अर्थव्यवस्था और रोजगार",

    education: "शिक्षा",

    healthcare: "स्वास्थ्य सेवा",

  },

  mr: {

    government: "सरकार आणि शासन व्यवस्था",

    constitution: "संविधान आणि लोकशाही",

    elections: "निवडणुका आणि नागरी सहभाग",

    localIssues: "स्थानिक समस्या",

    environment: "पर्यावरण",

    economy: "अर्थव्यवस्था आणि रोजगार",

    education: "शिक्षण",

    healthcare: "आरोग्य सेवा",

  },

};



const learnCopy: Localized<{

  exploreTitle: string;

  exploreDescription: string;

  exploreAction: string;

  discoverTitle: string;

  discoverDescription: string;

}> = {

  en: {

    exploreTitle: "Explore Civic Life",

    exploreDescription:

      "Explore all eight KrutBharat learning areas without creating an account.",

    exploreAction: "Explore all topics →",

    discoverTitle: "Discover India",

    discoverDescription:

      "Know India is the visual starting point for understanding India's States and Union Territories, people, places, culture, history, geography and civic context.",

  },

  hi: {

    exploreTitle: "नागरिक जीवन को एक्सप्लोर करें",

    exploreDescription:

      "बिना अकाउंट बनाए KrutBharat के सभी आठ सीखने वाले क्षेत्रों को एक्सप्लोर करें।",

    exploreAction: "सभी विषय देखें →",

    discoverTitle: "भारत जानें",

    discoverDescription:

      "Know India भारत को समझने की दृश्य शुरुआत है — राज्यों और केंद्र शासित प्रदेशों, लोगों, स्थानों, संस्कृति, इतिहास, भूगोल और नागरिक संदर्भ के साथ।",

  },

  mr: {

    exploreTitle: "नागरी जीवन एक्सप्लोर करा",

    exploreDescription:

      "अकाउंट तयार न करता KrutBharat मधील सर्व आठ शिकण्याची क्षेत्रे एक्सप्लोर करा.",

    exploreAction: "सर्व विषय पहा →",

    discoverTitle: "भारत जाणून घ्या",

    discoverDescription:

      "Know India हा भारत समजून घेण्याचा दृश्य प्रारंभबिंदू आहे — राज्ये व केंद्रशासित प्रदेश, लोक, ठिकाणे, संस्कृती, इतिहास, भूगोल आणि नागरी संदर्भासह.",

  },

};



const understandCopy: Localized<{

  issueTitle: string;

  issueDescription: string;

  issueSteps: string[];

  senseTitle: string;

  senseDescription: string;

  senseActions: string[];

  authorityTitle: string;

  authorityDescription: string;

  authoritySteps: string[];

}> = {

  en: {

    issueTitle: "Civic Issue Journey",

    issueDescription:

      "See a civic problem? Understand what to do next — from documenting it and finding the relevant authority to Smart Handoff, official submission and tracking.",

    issueSteps: [

      "See a problem",

      "Document it",

      "Find the right authority",

      "Prepare your report",

      "Smart Handoff",

      "Submit officially",

      "Track & verify",

    ],

    senseTitle: "Civic Sense",

    senseDescription:

      "Small everyday choices shape the places we share. Explore practical civic habits that keep public spaces cleaner, safer and more considerate.",

    senseActions: ["Use a bin", "Respect queues", "Protect public property"],

    authorityTitle: "Responsible Authorities",

    authorityDescription:

      "Understand the local government layer around you and discover the people and public institutions connected to your area.",

    authoritySteps: ["AREA", "WARD", "ASSEMBLY", "LOK SABHA"],

  },

  hi: {

    issueTitle: "नागरिक समस्या की यात्रा",

    issueDescription:

      "नागरिक समस्या दिखी? आगे क्या करना है, समझें — समस्या दर्ज करने और सही प्राधिकरण खोजने से लेकर Smart Handoff, आधिकारिक सबमिशन और ट्रैकिंग तक।",

    issueSteps: [

      "समस्या देखें",

      "समस्या दर्ज करें",

      "सही प्राधिकरण खोजें",

      "रिपोर्ट तैयार करें",

      "Smart Handoff",

      "आधिकारिक रूप से जमा करें",

      "ट्रैक और सत्यापित करें",

    ],

    senseTitle: "नागरिक बोध",

    senseDescription:

      "रोज़मर्रा की छोटी-छोटी आदतें उन जगहों को बदलती हैं जिन्हें हम साझा करते हैं। स्वच्छ, सुरक्षित और सम्मानजनक सार्वजनिक स्थानों के लिए व्यावहारिक नागरिक आदतें जानें।",

    senseActions: ["कूड़ेदान का उपयोग", "कतार का सम्मान", "सार्वजनिक संपत्ति की रक्षा"],

    authorityTitle: "जिम्मेदार प्राधिकरण",

    authorityDescription:

      "अपने आसपास के स्थानीय सरकार के स्तर को समझें और अपने क्षेत्र से जुड़े लोगों तथा सार्वजनिक संस्थाओं को जानें।",

    authoritySteps: ["क्षेत्र", "वार्ड", "विधानसभा", "लोकसभा"],

  },

  mr: {

    issueTitle: "नागरी समस्या प्रवास",

    issueDescription:

      "नागरी समस्या दिसली? पुढे काय करायचे ते समजून घ्या — समस्या नोंदवण्यापासून संबंधित प्राधिकरण शोधणे, Smart Handoff, अधिकृत सबमिशन आणि ट्रॅकिंगपर्यंत.",

    issueSteps: [

      "समस्या पहा",

      "समस्या नोंदवा",

      "योग्य प्राधिकरण शोधा",

      "अहवाल तयार करा",

      "Smart Handoff",

      "अधिकृतपणे सादर करा",

      "ट्रॅक आणि पडताळा",

    ],

    senseTitle: "नागरी जाणीव",

    senseDescription:

      "दररोजच्या छोट्या सवयी आपण सामायिक करत असलेल्या जागांचे स्वरूप घडवतात. स्वच्छ, सुरक्षित आणि परस्पर सन्मान राखणाऱ्या सार्वजनिक जागांसाठी व्यावहारिक नागरी सवयी जाणून घ्या.",

    senseActions: ["कचरापेटी वापरा", "रांगेचा आदर करा", "सार्वजनिक मालमत्तेचे संरक्षण करा"],

    authorityTitle: "जबाबदार प्राधिकरण",

    authorityDescription:

      "तुमच्या परिसरातील स्थानिक शासनाची पातळी समजून घ्या आणि त्या परिसराशी संबंधित लोक व सार्वजनिक संस्था ओळखा.",

    authoritySteps: ["परिसर", "प्रभाग", "विधानसभा", "लोकसभा"],

  },

};



const participationTools: Localized<

  {

    icon: string;

    href: string;

    title: string;

  }[]

> = {

  en: [

    ["📖", "/civic-learning", "Civic Learning"],

    ["📣", "/report-issue", "Report an Issue"],

    ["📋", "/my-issues", "My Civic Issues"],

    ["🎯", "/civic-quests", "Civic Quests"],

    ["🏆", "/leagues", "Civic Leagues"],

    ["👥", "/community", "Community"],

    ["📊", "/my-impact", "My Impact"],

    ["🪪", "/civic-passport", "Civic Passport"],

    ["🇮🇳", "/know-india", "Know India"],

  ].map(([icon, href, title]) => ({ icon, href, title })),

  hi: [

    ["📖", "/civic-learning", "नागरिक शिक्षा"],

    ["📣", "/report-issue", "समस्या रिपोर्ट करें"],

    ["📋", "/my-issues", "मेरी नागरिक समस्याएँ"],

    ["🎯", "/civic-quests", "सिविक क्वेस्ट्स"],

    ["🏆", "/leagues", "सिविक लीग्स"],

    ["👥", "/community", "कम्युनिटी"],

    ["📊", "/my-impact", "मेरा प्रभाव"],

    ["🪪", "/civic-passport", "सिविक पासपोर्ट"],

    ["🇮🇳", "/know-india", "भारत जानें"],

  ].map(([icon, href, title]) => ({ icon, href, title })),

  mr: [

    ["📖", "/civic-learning", "नागरिक शिक्षण"],

    ["📣", "/report-issue", "समस्या नोंदवा"],

    ["📋", "/my-issues", "माझ्या नागरी समस्या"],

    ["🎯", "/civic-quests", "सिविक क्वेस्ट्स"],

    ["🏆", "/leagues", "सिविक लीग्स"],

    ["👥", "/community", "कम्युनिटी"],

    ["📊", "/my-impact", "माझा प्रभाव"],

    ["🪪", "/civic-passport", "सिविक पासपोर्ट"],

    ["🇮🇳", "/know-india", "भारत जाणून घ्या"],

  ].map(([icon, href, title]) => ({ icon, href, title })),

};



const participateCopy: Localized<{

  participationTitle: string;

  participationDescription: string;

  leaguesTitle: string;

  leaguesDescription: string;

  recordTitle: string;

  recordSubtitle: string;

}> = {

  en: {

    participationTitle: "Civic Participation",

    participationDescription:

      "The same civic tools available across KrutBharat come together here — from learning and reporting to tracking, community and impact.",

    leaguesTitle: "Civic Leagues",

    leaguesDescription:

      "Join a local civic team, complete real-world missions, earn Karma Credits and see verified contributions reflected in team progress.",

    recordTitle: "Your Civic Record",

    recordSubtitle: "Your Civic Passport.",

  },

  hi: {

    participationTitle: "नागरिक भागीदारी",

    participationDescription:

      "KrutBharat के नागरिक उपकरण यहाँ एक साथ आते हैं — सीखने और रिपोर्टिंग से लेकर ट्रैकिंग, कम्युनिटी और प्रभाव तक।",

    leaguesTitle: "सिविक लीग्स",

    leaguesDescription:

      "एक स्थानीय नागरिक टीम से जुड़ें, वास्तविक नागरिक मिशन पूरे करें, Karma Credits अर्जित करें और सत्यापित योगदानों को टीम की प्रगति में देखें।",

    recordTitle: "आपका नागरिक रिकॉर्ड",

    recordSubtitle: "आपका Civic Passport।",

  },

  mr: {

    participationTitle: "नागरी सहभाग",

    participationDescription:

      "KrutBharat मधील नागरी साधने येथे एकत्र येतात — शिकणे आणि समस्या नोंदवण्यापासून ट्रॅकिंग, कम्युनिटी आणि प्रभावापर्यंत.",

    leaguesTitle: "सिविक लीग्स",

    leaguesDescription:

      "स्थानिक नागरी टीममध्ये सहभागी व्हा, प्रत्यक्ष नागरी मिशन्स पूर्ण करा, Karma Credits मिळवा आणि सत्यापित योगदान टीमच्या प्रगतीत पाहा.",

    recordTitle: "तुमची नागरी नोंद",

    recordSubtitle: "तुमचा Civic Passport.",

  },

};



const utilityLinks: Record<string, string> = {

  learn: "/learn",

  understand: "/understand",

  participate: "/participate",

};



function JourneyTabs({

  current,

  copy,

}: {

  current: JourneyKind;

  copy: ReturnType<typeof getCopy>;

}) {

  const tabs: Array<[JourneyKind, string, string]> = [

    ["learn", copy.learnTab, "📖"],

    ["understand", copy.understandTab, "💡"],

    ["participate", copy.participateTab, "👥"],

  ];



  return (

    <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-1 sm:px-6">

      {tabs.map(([key, label, icon]) => (

        <Link

          key={key}

          href={utilityLinks[key]}

          className={`kf-journey-tab kf-journey-tab-${key} shrink-0 rounded-full border px-4 py-2 text-[12px] font-extrabold transition ${

            current === key

              ? "kf-journey-tab-active"

              : "kf-journey-tab-inactive"

          }`}

        >

          <span className="mr-1.5">{icon}</span>

          {label}

        </Link>

      ))}

    </div>

  );

}



function getCopy(language: Language) {

  return {

    learnTab: language === "en" ? "Learn" : language === "hi" ? "सीखें" : "शिका",

    understandTab: language === "en" ? "Understand" : language === "hi" ? "समझें" : "समजून घ्या",

    participateTab: language === "en" ? "Participate" : language === "hi" ? "भाग लें" : "सहभाग",

  };

}



function HubHeader({

  current,

  meta,

}: {

  current: JourneyKind;

  meta: {

    label: string;

    title: string;

    description: string;

    icon: string;

  };

}) {

  const { language, setLanguage } = useLanguage();

  const copy = uiCopy[language];



  return (

    <>

      <header className="kf-journey-desktop-header sticky top-0 z-40 border-b border-[#e9e1d7]/80 bg-[#f8f3ea]/90 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">

          <Link

            href="/www"

            className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-[13px] font-bold text-[#536170] transition hover:bg-white/70"

          >

            <span className="text-[18px]">←</span>

            <span className="hidden sm:inline">{copy.back}</span>

            <span className="sm:hidden">{copy.home}</span>

          </Link>



          <div className="absolute left-1/2 -translate-x-1/2">

            <Link

              href="/www"

              className="font-black tracking-[-0.04em] text-[#102033]"

              style={{ fontFamily: "var(--font-display)" }}

            >

              Krut<span className="text-[#ff7a00]">Bharat</span>

            </Link>

          </div>



          <label className="shrink-0">

            <span className="sr-only">Language</span>

            <select

              aria-label="Language"

              value={language}

              onChange={(event) => setLanguage(event.target.value as Language)}

              className="rounded-full border border-[#e5ddd2] bg-white/80 px-3 py-2 text-[11px] font-bold text-[#334155] outline-none"

            >

              <option value="en">English</option>

              <option value="hi">हिन्दी</option>

              <option value="mr">मराठी</option>

            </select>

          </label>

        </div>

      </header>



      <div className="pt-4">

        <JourneyTabs current={current} copy={getCopy(language)} />

      </div>



      <section className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:px-6 sm:pt-10">

        <div className="kf-journey-hero-card relative overflow-hidden rounded-[30px] border border-[#e7ded1] bg-white/75 p-6 shadow-[0_18px_48px_rgba(35,47,58,.06)] sm:p-9">

          <div className="kf-journey-hero-orb kf-journey-hero-orb-a pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#fff0dc]" />

          <div className="kf-journey-hero-orb kf-journey-hero-orb-b pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#e8f2f8]" />

          <div className="relative max-w-3xl">

            <div className="kf-journey-hero-chip mb-3 inline-flex items-center gap-2 rounded-full border border-[#eadfd3] bg-[#fbf5ec] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#7c6f61]">

              <span className="text-[16px]">{meta.icon}</span>

              {meta.label}

            </div>

            <h1 className="text-[38px] font-black leading-[1.02] tracking-[-0.04em] text-[#102033] sm:text-[54px]">

              {meta.title}

            </h1>

            <p className="mt-4 max-w-2xl text-[14px] leading-7 text-[#657482] sm:text-[16px]">

              {meta.description}

            </p>

          </div>

        </div>

      </section>

    </>

  );

}



function PageShell({

  current,

  children,

}: {

  current: JourneyKind;

  children: ReactNode;

}) {

  const { language } = useLanguage();

  const meta = journeyMeta[current][language];



  return (

    <main className={`kf-journey-hub kf-journey-${current} min-h-screen overflow-x-hidden bg-[#f8f3ea] text-[#102033]`}>

      <KrutBharatMobileShell />

      <HubHeader current={current} meta={meta} />

      <div className="mx-auto max-w-6xl space-y-6 px-4 pb-28 sm:space-y-8 sm:px-6">{children}</div>

      <style>{`

        .kf-journey-hub a, .kf-journey-hub button, .kf-journey-hub select {

          -webkit-tap-highlight-color: transparent;

        }



        /* Desktop keeps the existing JourneyHub presentation untouched. */

        html[data-theme="dark"] .kf-journey-hub {

          background: #07111f !important;

          color: #f7f8fb !important;

        }



        html[data-theme="dark"] .kf-journey-hub .kf-journey-desktop-header {

          background: rgba(7,17,31,.90) !important;

          border-bottom-color: rgba(143,181,220,.14) !important;

        }



        html[data-theme="dark"] .kf-journey-hub .kf-journey-surface {

          background: #10263a !important;

          border-color: rgba(143,181,220,.16) !important;

          color: #f7f8fb !important;

          box-shadow: 0 18px 45px rgba(0,0,0,.22) !important;

        }



        html[data-theme="dark"] .kf-journey-hub .kf-journey-muted {

          color: #b9c7d7 !important;

        }



        html[data-theme="dark"] .kf-journey-hub .kf-journey-subtle {

          color: #9fb2c5 !important;

        }



        @media (max-width: 1023px) {

          .kf-journey-hub {

            min-height: 100dvh !important;

            padding-bottom: 118px !important;

          }



          /* The common app shell owns the mobile/tablet top header. */

          .kf-journey-hub .kf-journey-desktop-header {

            display: none !important;

          }



          .kf-journey-hub > .pt-4 {

            padding-top: 4px !important;

            margin-top: 0 !important;

          }



          .kf-journey-hub > .pt-4 > div {

            max-width: none !important;

            padding: 0 10px 4px !important;

            gap: 7px !important;

          }



          .kf-journey-tab {

            min-height: 42px !important;

            display: inline-flex !important;

            align-items: center !important;

            justify-content: center !important;

            border-radius: 16px !important;

            padding: 8px 13px !important;

            border-width: 1px !important;

            box-shadow: 0 7px 16px rgba(16,32,51,.06) !important;

          }



          .kf-journey-tab-learn {

            --journey-accent: #8eb63b;

            --journey-accent-soft: #edf6d9;

          }



          .kf-journey-tab-understand {

            --journey-accent: #d74f9f;

            --journey-accent-soft: #fbe8f3;

          }



          .kf-journey-tab-participate {

            --journey-accent: #1598c8;

            --journey-accent-soft: #e6f6fb;

          }



          .kf-journey-tab-active {

            border-color: var(--journey-accent) !important;

            background: linear-gradient(145deg, var(--journey-accent-soft), #ffffff) !important;

            color: #203047 !important;

            box-shadow:

              0 9px 20px color-mix(in srgb, var(--journey-accent) 18%, transparent),

              inset 0 1px 0 rgba(255,255,255,.95) !important;

          }



          .kf-journey-tab-inactive {

            border-color: color-mix(in srgb, var(--journey-accent) 30%, #e5ddd2) !important;

            background: rgba(255,255,255,.78) !important;

            color: #526170 !important;

          }



          .kf-journey-tab-active:hover,

          .kf-journey-tab-inactive:hover {

            transform: translateY(-1px);

          }



          .kf-journey-hub section {

            scroll-margin-top: 88px;

          }



          .kf-journey-hub .kf-journey-surface {

            border-radius: 25px !important;

            padding: 18px !important;

          }



          .kf-journey-hub .kf-journey-surface h2 {

            font-size: clamp(23px, 7vw, 31px) !important;

            line-height: 1.04 !important;

          }



          .kf-journey-hub .kf-journey-surface > .relative > .flex {

            gap: 10px !important;

          }



          .kf-journey-icon-box {

            width: 44px !important;

            height: 44px !important;

            border-radius: 14px !important;

            flex: 0 0 44px !important;

          }



          .kf-journey-hub .kf-journey-item {

            border-radius: 17px !important;

          }



          .kf-journey-hub .kf-journey-surface .mt-6 {

            margin-top: 18px !important;

          }



          html[data-theme="dark"] .kf-journey-hub {

            background:

              radial-gradient(circle at 94% 2%, rgba(255,122,26,.10), transparent 24%),

              radial-gradient(circle at 4% 42%, rgba(52,160,220,.07), transparent 25%),

              linear-gradient(180deg, #07111f 0%, #081827 48%, #050d18 100%) !important;

            color: #f7f9fc !important;

          }



          /* Dark hero: remove the cream/white decorative arcs completely.

             Keep only deep blue surfaces and restrained brand accents. */

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card {

            background:

              radial-gradient(circle at 91% 13%, rgba(255,177,90,.08), transparent 22%),

              radial-gradient(circle at 6% 86%, rgba(91,174,202,.07), transparent 24%),

              linear-gradient(145deg, #10263a 0%, #0b1c2e 100%) !important;

            border-color: rgba(118,163,202,.22) !important;

            box-shadow:

              0 20px 46px rgba(0,0,0,.24),

              inset 0 1px 0 rgba(255,255,255,.035) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-orb-a {

            background: rgba(255,171,95,.13) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-orb-b {

            background: rgba(91,174,202,.10) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-chip {

            background: #162d43 !important;

            border-color: rgba(139,176,209,.20) !important;

            color: #b8c9d9 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card h1 {

            color: #f3f7fb !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card p {

            color: #aebfd0 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-tab-active {

            color: #081321 !important;

            border-color: var(--journey-accent) !important;

            box-shadow:

              0 10px 22px color-mix(in srgb, var(--journey-accent) 24%, transparent),

              inset 0 1px 0 rgba(255,255,255,.22) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-tab-inactive {

            background: #0d2035 !important;

            color: #b8c8d8 !important;

            border-color: color-mix(in srgb, var(--journey-accent) 36%, rgba(130,165,200,.16)) !important;

            box-shadow: inset 0 1px 0 rgba(255,255,255,.025) !important;

          }



          html[data-theme="dark"] .kf-journey-tab-learn.kf-journey-tab-active {

            --journey-accent: #b6f33a;

            --journey-accent-soft: #7fa827;

            background: linear-gradient(145deg, #9bbd57, #6f8e3f) !important;

          }



          html[data-theme="dark"] .kf-journey-tab-understand.kf-journey-tab-active {

            --journey-accent: #ff4fc6;

            --journey-accent-soft: #b5368b;

            color: #fff !important;

            background: linear-gradient(145deg, #d06b9f, #9b476f) !important;

          }



          html[data-theme="dark"] .kf-journey-tab-participate.kf-journey-tab-active {

            --journey-accent: #19c2ff;

            --journey-accent-soft: #197ea4;

            background: linear-gradient(145deg, #4e9bb7, #35768f) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-surface {

            background:

              radial-gradient(circle at 100% 0%, rgba(79,181,255,.065), transparent 28%),

              linear-gradient(145deg, #10263a 0%, #0b1c2e 100%) !important;

            border-color: rgba(118,163,202,.19) !important;

            color: #f5f8fc !important;

            box-shadow:

              0 18px 42px rgba(0,0,0,.24),

              inset 0 1px 0 rgba(255,255,255,.035) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-icon-box {

            background: #132b45 !important;

            border-color: rgba(145,181,211,.10) !important;

            color: #f3f8fc !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item {

            background: linear-gradient(145deg, #0f253d, #0a1a2c) !important;

            border-color: rgba(110,159,201,.18) !important;

            color: #e8f0f7 !important;

            box-shadow:

              0 9px 20px rgba(0,0,0,.14),

              inset 0 1px 0 rgba(255,255,255,.025) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item:hover {

            background: linear-gradient(145deg, #122d48, #0c2034) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item .text-\\\\[\\\\#263447\\\\],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item .text-\\\\[\\\\#334155\\\\],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item .text-\\\\[\\\\#4a3348\\\\],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item .text-\\\\[\\\\#4a3b2d\\\\] {

            color: #e7eff7 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#eef5fa]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#eef7eb]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#eef5fa]"] {

            background: #17344f !important;

            color: #bfe2f7 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#fff1df]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#fff0df]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#fff0f8]"] {

            background: #3b2530 !important;

            color: #ffb0d8 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="bg-[#f8fcff]"] {

            background: #102b43 !important;

            color: #c3d7e7 !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#e6e0d7]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#e9e1d7]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#eddbe8]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#dce7ef]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#e1e7dc]"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item [class*="border-[#eadfd2]"] {

            border-color: rgba(109,158,201,.16) !important;

          }



          /* Rich dark backgrounds for the three journey families. */

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item:nth-child(odd) {

            background: linear-gradient(145deg, #102a43, #0a1c2e) !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-item:nth-child(even) {

            background: linear-gradient(145deg, #10243a, #0a1a2b) !important;

          }



          /* Avoid hard-coded white/pastel card surfaces leaking through. */

          html[data-theme="dark"] .kf-journey-hub [class*="bg-white/"],

          html[data-theme="dark"] .kf-journey-hub [class*="bg-[#fffdf9]"],

          html[data-theme="dark"] .kf-journey-hub [class*="bg-[#fffafd]"],

          html[data-theme="dark"] .kf-journey-hub [class*="bg-[#fbfdf9]"],

          html[data-theme="dark"] .kf-journey-hub [class*="bg-[#fcf9ff]"] {

            background: #0f243b !important;

          }



          html[data-theme="dark"] .kf-journey-hub [class*="text-[#102033]"] {

            color: #f7f9fc !important;

          }



          html[data-theme="dark"] .kf-journey-hub [class*="text-[#657482]"] {

            color: #aebfd0 !important;

          }



          html[data-theme="dark"] .kf-journey-hub [class*="text-[#71808e]"] {

            color: #94a9bd !important;

          }



          html[data-theme="dark"] .kf-journey-hub [class*="border-[#e5ddd2]"],

          html[data-theme="dark"] .kf-journey-hub [class*="border-[#e6ded4]"],

          html[data-theme="dark"] .kf-journey-hub [class*="border-[#e5dcec]"] {

            border-color: rgba(110,159,201,.18) !important;

          }



          /* Keep orange actions saturated, never washed-out. */

          html[data-theme="dark"] .kf-journey-hub a[class*="bg-[#ff7a00]"] {

            background: linear-gradient(145deg, #ff9b4a, #ff7a00) !important;

            color: #fff !important;

            border-color: rgba(255,173,117,.45) !important;

            box-shadow: 0 10px 22px rgba(255,122,0,.22) !important;

          }



          /* Topic / information chips. */

          html[data-theme="dark"] .kf-journey-hub span[class*="bg-white"] {

            background: #122a43 !important;

            border-color: rgba(114,163,204,.16) !important;

            color: #bed0df !important;

          }



          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card [class*="bg-white"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card [class*="bg-[#fff"],

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card [class*="bg-[#fb"] {

            background: #122a43 !important;

            color: #c1d1df !important;

            border-color: rgba(114,163,204,.16) !important;

          }



          @media (max-width: 639px) {

            .kf-journey-hub h1 {

              overflow-wrap: anywhere;

            }



            .kf-journey-hub .kf-journey-surface {

              padding: 16px !important;

              border-radius: 23px !important;

            }



            .kf-journey-hub > .mx-auto.max-w-6xl.space-y-6 {

              padding-left: 10px !important;

              padding-right: 10px !important;

              gap: 12px !important;

            }



            .kf-journey-hub > .pt-4 > div {

              overflow-x: auto !important;

              scrollbar-width: none;

            }



            .kf-journey-hub > .pt-4 > div::-webkit-scrollbar {

              display: none;

            }



            .kf-journey-tab {

              min-width: 98px !important;

              font-size: 10px !important;

            }

          }

        }



        /* =========================================================
           JOURNEY THEMES — MOBILE + TABLET ONLY
           Learn = sage / civic green
           Understand = muted rose / plum
           Participate = civic blue / cyan
           Desktop / PC (1024px+) intentionally unchanged.
           ========================================================= */

        @media (max-width: 1023px) {
          /* Shared journey typography / contrast foundation. */
          .kf-journey-hub {
            --journey-page-bg: #f3f5ed;
            --journey-surface: #fbfcf8;
            --journey-surface-raised: #ffffff;
            --journey-soft: #e9efda;
            --journey-border: #ced9b5;
            --journey-accent: #718f3b;
            --journey-accent-strong: #58722c;
            --journey-heading: #17231b;
            --journey-text: #314137;
            --journey-muted: #607064;
            --journey-icon-bg: #e6eed4;
          }

          .kf-journey-hub,
          .kf-journey-hub .kf-journey-surface,
          .kf-journey-hub .kf-journey-item {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
          }

          .kf-journey-hub > .mx-auto.max-w-6xl {
            padding-bottom: 110px !important;
          }

          .kf-journey-hub .kf-journey-hero-card {
            color: var(--journey-heading) !important;
            background:
              radial-gradient(circle at 92% 8%, color-mix(in srgb, var(--journey-accent) 13%, transparent), transparent 25%),
              linear-gradient(145deg, var(--journey-surface-raised) 0%, var(--journey-page-bg) 100%) !important;
            border-color: var(--journey-border) !important;
            box-shadow:
              0 18px 42px rgba(21, 35, 28, .09),
              inset 0 1px 0 rgba(255,255,255,.88) !important;
          }

          .kf-journey-hub .kf-journey-hero-card h1,
          .kf-journey-hub .kf-journey-surface h2 {
            color: var(--journey-heading) !important;
          }

          .kf-journey-hub .kf-journey-hero-card p,
          .kf-journey-hub .kf-journey-muted,
          .kf-journey-hub .kf-journey-subtle {
            color: var(--journey-muted) !important;
          }

          .kf-journey-hub .kf-journey-hero-chip {
            background: var(--journey-soft) !important;
            border-color: color-mix(in srgb, var(--journey-accent) 28%, white) !important;
            color: var(--journey-accent-strong) !important;
          }

          .kf-journey-hub .kf-journey-hero-orb,
          .kf-journey-hub .kf-journey-card-orb {
            transition: opacity .2s ease, background .2s ease, transform .2s ease;
          }

          .kf-journey-hub .kf-journey-card-orb {
            opacity: .62 !important;
          }

          .kf-journey-hub .kf-journey-surface {
            background:
              linear-gradient(145deg, var(--journey-surface-raised) 0%, var(--journey-surface) 100%) !important;
            border-color: var(--journey-border) !important;
            color: var(--journey-text) !important;
            box-shadow:
              0 14px 34px rgba(21, 35, 28, .07),
              inset 0 1px 0 rgba(255,255,255,.76) !important;
          }

          .kf-journey-hub .kf-journey-icon-box {
            background: var(--journey-icon-bg) !important;
            border-color: color-mix(in srgb, var(--journey-accent) 18%, white) !important;
            color: var(--journey-accent-strong) !important;
            box-shadow: 0 8px 18px color-mix(in srgb, var(--journey-accent) 10%, transparent) !important;
          }

          .kf-journey-hub .kf-journey-item {
            background: var(--journey-surface) !important;
            border-color: color-mix(in srgb, var(--journey-accent) 20%, var(--journey-border)) !important;
            color: var(--journey-text) !important;
            box-shadow:
              0 7px 16px color-mix(in srgb, var(--journey-accent) 7%, transparent),
              inset 0 1px 0 rgba(255,255,255,.52) !important;
          }

          .kf-journey-hub .kf-journey-item > span:nth-child(2),
          .kf-journey-hub .kf-journey-item > div {
            color: var(--journey-text) !important;
          }

          .kf-journey-hub .kf-journey-item > span:first-child {
            background: var(--journey-icon-bg) !important;
            color: var(--journey-accent-strong) !important;
          }

          .kf-journey-hub .kf-journey-item:hover {
            transform: translateY(-1px);
            background: var(--journey-surface-raised) !important;
            border-color: color-mix(in srgb, var(--journey-accent) 34%, var(--journey-border)) !important;
          }

          /* Journey tabs follow the homepage button family. */
          .kf-journey-tab {
            border-width: 1px !important;
            border-radius: 15px !important;
            min-height: 42px !important;
            padding: 8px 13px !important;
            font-weight: 850 !important;
            box-shadow: 0 7px 16px color-mix(in srgb, var(--journey-accent) 7%, transparent) !important;
          }

          .kf-journey-tab-active {
            border-color: color-mix(in srgb, var(--journey-accent) 72%, black 8%) !important;
            background: linear-gradient(145deg, var(--journey-soft), color-mix(in srgb, var(--journey-soft) 72%, white)) !important;
            color: var(--journey-accent-strong) !important;
            box-shadow:
              0 9px 20px color-mix(in srgb, var(--journey-accent) 18%, transparent),
              inset 0 1px 0 rgba(255,255,255,.90) !important;
          }

          .kf-journey-tab-inactive {
            border-color: color-mix(in srgb, var(--journey-accent) 20%, var(--journey-border)) !important;
            background: color-mix(in srgb, var(--journey-surface) 94%, transparent) !important;
            color: var(--journey-muted) !important;
          }

          /* Theme-aware action buttons instead of one orange for all three journeys. */
          .kf-journey-hub a[class*="bg-[#ff7a00]"] {
            background: linear-gradient(145deg, var(--journey-accent), var(--journey-accent-strong)) !important;
            border: 1px solid color-mix(in srgb, var(--journey-accent) 62%, black 8%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 22px color-mix(in srgb, var(--journey-accent) 22%, transparent) !important;
          }

          .kf-journey-hub a[class*="bg-[#ff7a00]"]:hover {
            filter: brightness(1.06);
          }

          /* ---------- LEARN ---------- */
          .kf-journey-learn {
            --journey-page-bg: #f1f5e8;
            --journey-surface: #f9fbf5;
            --journey-surface-raised: #ffffff;
            --journey-soft: #e4edcf;
            --journey-border: #c7d6a8;
            --journey-accent: #708f38;
            --journey-accent-strong: #526e28;
            --journey-heading: #1b281d;
            --journey-text: #314136;
            --journey-muted: #627167;
            --journey-icon-bg: #e0eacf;
          }

          .kf-journey-learn .kf-journey-hero-orb-a,
          .kf-journey-learn .kf-journey-card-orb {
            background: #dce8bf !important;
          }

          .kf-journey-learn .kf-journey-hero-orb-b {
            background: #dce8f1 !important;
          }

          /* ---------- UNDERSTAND ---------- */
          .kf-journey-understand {
            --journey-page-bg: #f8eff4;
            --journey-surface: #fff9fc;
            --journey-surface-raised: #ffffff;
            --journey-soft: #f1dce7;
            --journey-border: #dbb9ca;
            --journey-accent: #ad527e;
            --journey-accent-strong: #873e62;
            --journey-heading: #2b1d25;
            --journey-text: #4a3440;
            --journey-muted: #705c68;
            --journey-icon-bg: #efd9e4;
          }

          .kf-journey-understand .kf-journey-hero-orb-a,
          .kf-journey-understand .kf-journey-card-orb {
            background: #efd5e2 !important;
          }

          .kf-journey-understand .kf-journey-hero-orb-b {
            background: #e1eaf1 !important;
          }

          /* ---------- PARTICIPATE ---------- */
          .kf-journey-participate {
            --journey-page-bg: #edf5f8;
            --journey-surface: #f8fcfd;
            --journey-surface-raised: #ffffff;
            --journey-soft: #d9ebf2;
            --journey-border: #b9d2dd;
            --journey-accent: #3d89a4;
            --journey-accent-strong: #2c6f89;
            --journey-heading: #182932;
            --journey-text: #2f4550;
            --journey-muted: #60727c;
            --journey-icon-bg: #d7eaf1;
          }

          .kf-journey-participate .kf-journey-hero-orb-a,
          .kf-journey-participate .kf-journey-card-orb {
            background: #cfe7ef !important;
          }

          .kf-journey-participate .kf-journey-hero-orb-b {
            background: #d7e5ee !important;
          }

          /* ---------- DARK MODE — distinct, rich, readable surfaces ---------- */
          html[data-theme="dark"] .kf-journey-hub {
            background: var(--journey-dark-page-bg) !important;
            color: var(--journey-dark-heading) !important;
          }

          html[data-theme="dark"] .kf-journey-learn {
            --journey-dark-page-bg: #081712;
            --journey-dark-surface: #10261f;
            --journey-dark-surface-raised: #143127;
            --journey-dark-soft: #1d3b2f;
            --journey-dark-border: rgba(157, 190, 103, .30);
            --journey-dark-accent: #a7ca6b;
            --journey-dark-heading: #f3f8ed;
            --journey-dark-text: #d7e6d6;
            --journey-dark-muted: #aebfae;
            --journey-dark-icon: #204331;
            background:
              radial-gradient(circle at 92% 5%, rgba(143,190,88,.10), transparent 24%),
              linear-gradient(180deg, #081712 0%, #0a1a16 56%, #050d0a 100%) !important;
          }

          html[data-theme="dark"] .kf-journey-understand {
            --journey-dark-page-bg: #120b11;
            --journey-dark-surface: #281522;
            --journey-dark-surface-raised: #341b2a;
            --journey-dark-soft: #452439;
            --journey-dark-border: rgba(218, 145, 180, .30);
            --journey-dark-accent: #df97ba;
            --journey-dark-heading: #fcf1f7;
            --journey-dark-text: #edd9e2;
            --journey-dark-muted: #c9afbb;
            --journey-dark-icon: #48263a;
            background:
              radial-gradient(circle at 92% 5%, rgba(224,132,176,.10), transparent 24%),
              linear-gradient(180deg, #120b11 0%, #1a1018 56%, #08090f 100%) !important;
          }

          html[data-theme="dark"] .kf-journey-participate {
            --journey-dark-page-bg: #07151d;
            --journey-dark-surface: #0d2635;
            --journey-dark-surface-raised: #123348;
            --journey-dark-soft: #19445a;
            --journey-dark-border: rgba(115, 196, 219, .30);
            --journey-dark-accent: #7cc8dc;
            --journey-dark-heading: #eff8fb;
            --journey-dark-text: #d5e8ee;
            --journey-dark-muted: #a9c1cb;
            --journey-dark-icon: #194258;
            background:
              radial-gradient(circle at 92% 5%, rgba(82,190,224,.10), transparent 24%),
              linear-gradient(180deg, #07151d 0%, #091c27 56%, #050d14 100%) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card {
            background:
              linear-gradient(145deg, var(--journey-dark-surface-raised), var(--journey-dark-surface)) !important;
            border-color: var(--journey-dark-border) !important;
            color: var(--journey-dark-heading) !important;
            box-shadow:
              0 20px 46px rgba(0,0,0,.30),
              inset 0 1px 0 rgba(255,255,255,.045) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card h1,
          html[data-theme="dark"] .kf-journey-hub .kf-journey-surface h2 {
            color: var(--journey-dark-heading) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-card p,
          html[data-theme="dark"] .kf-journey-hub .kf-journey-muted,
          html[data-theme="dark"] .kf-journey-hub .kf-journey-subtle {
            color: var(--journey-dark-muted) !important;
          }

          /* No white circles / cream spots in dark mode. */
          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-orb-a,
          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-orb-b,
          html[data-theme="dark"] .kf-journey-hub .kf-journey-card-orb {
            opacity: .42 !important;
            filter: saturate(.65) brightness(.62) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-surface {
            background:
              linear-gradient(145deg, var(--journey-dark-surface-raised), var(--journey-dark-surface)) !important;
            border-color: var(--journey-dark-border) !important;
            color: var(--journey-dark-text) !important;
            box-shadow:
              0 18px 42px rgba(0,0,0,.28),
              inset 0 1px 0 rgba(255,255,255,.035) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-icon-box {
            background: var(--journey-dark-icon) !important;
            border-color: color-mix(in srgb, var(--journey-dark-accent) 24%, transparent) !important;
            color: var(--journey-dark-accent) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item {
            background: linear-gradient(145deg, var(--journey-dark-surface-raised), var(--journey-dark-surface)) !important;
            border-color: color-mix(in srgb, var(--journey-dark-accent) 22%, transparent) !important;
            color: var(--journey-dark-text) !important;
            box-shadow:
              0 9px 20px rgba(0,0,0,.18),
              inset 0 1px 0 rgba(255,255,255,.025) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item > span:nth-child(2),
          html[data-theme="dark"] .kf-journey-hub .kf-journey-item > div {
            color: var(--journey-dark-text) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item > span:first-child {
            background: var(--journey-dark-icon) !important;
            color: var(--journey-dark-accent) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-item:hover {
            background: linear-gradient(145deg, var(--journey-dark-soft), var(--journey-dark-surface)) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-hero-chip {
            background: var(--journey-dark-soft) !important;
            border-color: var(--journey-dark-border) !important;
            color: var(--journey-dark-accent) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-tab-active {
            border-color: color-mix(in srgb, var(--journey-dark-accent) 76%, transparent) !important;
            background: linear-gradient(145deg, var(--journey-dark-soft), var(--journey-dark-surface-raised)) !important;
            color: var(--journey-dark-accent) !important;
            box-shadow:
              0 10px 22px color-mix(in srgb, var(--journey-dark-accent) 18%, transparent),
              inset 0 1px 0 rgba(255,255,255,.06) !important;
          }

          html[data-theme="dark"] .kf-journey-hub .kf-journey-tab-inactive {
            background: rgba(10, 25, 39, .78) !important;
            color: var(--journey-dark-muted) !important;
            border-color: color-mix(in srgb, var(--journey-dark-accent) 18%, rgba(120,160,190,.16)) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.02) !important;
          }

          html[data-theme="dark"] .kf-journey-hub a[class*="bg-[#ff7a00]"] {
            background: linear-gradient(145deg, var(--journey-dark-accent), color-mix(in srgb, var(--journey-dark-accent) 72%, black)) !important;
            border-color: color-mix(in srgb, var(--journey-dark-accent) 60%, transparent) !important;
            color: #071019 !important;
            box-shadow: 0 11px 24px color-mix(in srgb, var(--journey-dark-accent) 20%, transparent) !important;
          }

          /* Journey-specific accent bars / numbers / chevrons. */
          .kf-journey-learn .kf-journey-item > span:last-child,
          .kf-journey-learn .kf-journey-surface > .relative > .mt-6 a {
            color: var(--journey-accent) !important;
          }

          .kf-journey-understand .kf-journey-item > span:last-child,
          .kf-journey-understand .kf-journey-surface > .relative > .mt-6 a {
            color: var(--journey-accent) !important;
          }

          .kf-journey-participate .kf-journey-item > span:last-child,
          .kf-journey-participate .kf-journey-surface > .relative > .mt-6 a {
            color: var(--journey-accent) !important;
          }

          html[data-theme="dark"] .kf-journey-learn .kf-journey-item > span:last-child,
          html[data-theme="dark"] .kf-journey-understand .kf-journey-item > span:last-child,
          html[data-theme="dark"] .kf-journey-participate .kf-journey-item > span:last-child {
            color: var(--journey-dark-accent) !important;
          }

          /* Phone tuning. */
          @media (max-width: 640px) {
            .kf-journey-hub > .mx-auto.max-w-6xl {
              padding-left: 8px !important;
              padding-right: 8px !important;
              gap: 12px !important;
            }

            .kf-journey-hub .kf-journey-hero-card {
              border-radius: 23px !important;
              padding: 18px !important;
            }

            .kf-journey-hub .kf-journey-surface {
              border-radius: 22px !important;
              padding: 16px !important;
            }

            .kf-journey-hub .kf-journey-surface h2 {
              font-size: clamp(22px, 6.9vw, 29px) !important;
            }

            .kf-journey-tab {
              min-width: 94px !important;
              min-height: 40px !important;
              padding-inline: 11px !important;
              font-size: 10px !important;
            }

            .kf-journey-hub .kf-journey-item {
              border-radius: 16px !important;
            }
          }

          /* Discover India panel — keep it tied to the journey palette instead of
             a generic white card. Mobile/tablet only; desktop remains unchanged. */
          @media (max-width: 1023px) {
            .kf-journey-learn .kf-journey-discover-panel {
              background: linear-gradient(145deg, #eef4df 0%, #e4edd0 100%) !important;
              border-color: #c8d7a5 !important;
              box-shadow: 0 12px 26px rgba(93,119,48,.10) !important;
            }

            .kf-journey-understand .kf-journey-discover-panel {
              background: linear-gradient(145deg, #f7e8ee 0%, #f0dce5 100%) !important;
              border-color: #dfbdcd !important;
              box-shadow: 0 12px 26px rgba(150,74,112,.10) !important;
            }

            .kf-journey-participate .kf-journey-discover-panel {
              background: linear-gradient(145deg, #e4f1f5 0%, #d8eaf0 100%) !important;
              border-color: #b9d3dd !important;
              box-shadow: 0 12px 26px rgba(40,118,143,.10) !important;
            }

            .kf-journey-learn .kf-journey-discover-chip {
              background: #f6f9ee !important;
              border-color: #cad9a9 !important;
              color: #50642f !important;
            }

            .kf-journey-understand .kf-journey-discover-chip {
              background: #fbf0f5 !important;
              border-color: #dfbfce !important;
              color: #74455e !important;
            }

            .kf-journey-participate .kf-journey-discover-chip {
              background: #f0f8fb !important;
              border-color: #c2dbe3 !important;
              color: #315f70 !important;
            }

            html[data-theme="dark"] .kf-journey-learn .kf-journey-discover-panel {
              background: linear-gradient(145deg, #16352d 0%, #10271f 100%) !important;
              border-color: rgba(164,199,106,.28) !important;
              box-shadow: 0 14px 30px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.025) !important;
            }

            html[data-theme="dark"] .kf-journey-understand .kf-journey-discover-panel {
              background: linear-gradient(145deg, #351e2e 0%, #21141f 100%) !important;
              border-color: rgba(228,154,187,.28) !important;
              box-shadow: 0 14px 30px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.025) !important;
            }

            html[data-theme="dark"] .kf-journey-participate .kf-journey-discover-panel {
              background: linear-gradient(145deg, #123347 0%, #0d2433 100%) !important;
              border-color: rgba(119,199,221,.28) !important;
              box-shadow: 0 14px 30px rgba(0,0,0,.20), inset 0 1px 0 rgba(255,255,255,.025) !important;
            }

            html[data-theme="dark"] .kf-journey-learn .kf-journey-discover-chip {
              background: #193c31 !important;
              border-color: rgba(164,199,106,.24) !important;
              color: #cae4a1 !important;
            }

            html[data-theme="dark"] .kf-journey-understand .kf-journey-discover-chip {
              background: #47283b !important;
              border-color: rgba(228,154,187,.24) !important;
              color: #f2bfd3 !important;
            }

            html[data-theme="dark"] .kf-journey-participate .kf-journey-discover-chip {
              background: #173b4d !important;
              border-color: rgba(119,199,221,.24) !important;
              color: #bce5f0 !important;
            }

            html[data-theme="dark"] .kf-journey-discover-panel .kf-journey-subtle {
              color: #aabed0 !important;
            }
          }

          /* Tablet tuning. */
          @media (min-width: 641px) and (max-width: 1023px) {
            .kf-journey-hub > .mx-auto.max-w-6xl {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }

            .kf-journey-hub .kf-journey-hero-card,
            .kf-journey-hub .kf-journey-surface {
              border-radius: 27px !important;
            }
          }
        }
      `}</style>

    </main>

  );

}



function SectionCard({

  icon,

  title,

  description,

  tint,

  children,

  action,

}: {

  icon: string;

  title: string;

  description: string;

  tint: string;

  children: ReactNode;

  action?: { href: string; label: string };

}) {

  return (

    <section className="kf-journey-surface relative overflow-hidden rounded-[30px] border border-[#e5ddd2] bg-white/80 p-5 shadow-[0_16px_40px_rgba(35,47,58,.055)] sm:p-7">

      <div className={`kf-journey-card-orb pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full ${tint}`} />

      <div className="relative">

        <div className="flex items-start gap-3">

          <div className="kf-journey-icon-box grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white bg-[#f8f1e6] text-[22px] shadow-sm">

            {icon}

          </div>

          <div className="min-w-0">

            <h2 className="text-[25px] font-black leading-tight tracking-[-0.03em] text-[#102033] sm:text-[32px]">

              {title}

            </h2>

            <p className="kf-journey-muted mt-2 max-w-3xl text-[13px] leading-6 text-[#657482] sm:text-[14px]">

              {description}

            </p>

          </div>

        </div>



        <div className="mt-6">{children}</div>



        {action ? (

          <Link

            href={action.href}

            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff7a00] px-5 text-[12px] font-extrabold text-white shadow-[0_10px_24px_rgba(255,122,0,.16)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00]"

          >

            {action.label}

          </Link>

        ) : null}

      </div>

    </section>

  );

}



export function LearnPage() {

  const { language } = useLanguage();

  const copy = uiCopy[language];

  const page = learnCopy[language];



  return (

    <PageShell current="learn">

      <SectionCard

        icon="🧭"

        title={page.exploreTitle}

        description={page.exploreDescription}

        tint="bg-[#e6f2fb]"

        action={{ href: "/explore#explore", label: page.exploreAction }}

      >

        <div className="grid gap-2 sm:grid-cols-2">

          {topicData.map((topic) => (

            <Link

              key={topic.key}

              href={topic.href}

              className="kf-journey-item flex min-h-14 items-center gap-3 rounded-2xl border border-[#e6e0d7] bg-[#fffdf9] px-3.5 py-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_rgba(35,47,58,.05)]"

            >

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef5fa] text-[18px]">

                {topic.icon}

              </span>

              <span className="min-w-0 text-[12px] font-extrabold leading-5 text-[#263447]">

                {topicLabels[language][topic.key]}

              </span>

              <span className="ml-auto text-[#9ba7b3]">›</span>

            </Link>

          ))}

        </div>

      </SectionCard>



      <SectionCard

        icon="🇮🇳"

        title={page.discoverTitle}

        description={page.discoverDescription}

        tint="bg-[#fff0dc]"

        action={{

          href: "/know-india",

          label: `${copy.discover} →`,

        }}

      >

        <div className="kf-journey-discover-panel rounded-[24px] border p-5">

          <div className="flex flex-wrap gap-2">

            {(language === "en"

              ? ["States & UTs", "Culture", "History", "Geography", "Civic India"]

              : language === "hi"

              ? ["राज्य और UTs", "संस्कृति", "इतिहास", "भूगोल", "नागरिक भारत"]

              : ["राज्ये व केंद्रशासित प्रदेश", "संस्कृती", "इतिहास", "भूगोल", "नागरी भारत"]

            ).map((item) => (

              <span key={item} className="kf-journey-discover-chip rounded-full border px-3 py-1.5 text-[10px] font-bold">

                {item}

              </span>

            ))}

          </div>

          <p className="kf-journey-subtle mt-4 text-[12px] leading-6 text-[#71808e]">

            {page.discoverDescription}

          </p>

        </div>

      </SectionCard>



      <div className="grid gap-3 sm:grid-cols-3">

        {[

          ["📖", language === "en" ? "Lessons" : language === "hi" ? "पाठ" : "धडे", "/civic-learning"],

          ["🎯", language === "en" ? "Quests" : language === "hi" ? "क्वेस्ट्स" : "क्वेस्ट्स", "/civic-quests"],

          ["🗺️", copy.discover, "/know-india"],

        ].map(([icon, label, href]) => (

          <Link key={href} href={href} className="kf-journey-item kf-journey-surface rounded-2xl border border-[#e5ddd2] bg-white/80 p-4 text-center shadow-sm transition hover:-translate-y-0.5">

            <div className="text-[23px]">{icon}</div>

            <div className="mt-1 text-[11px] font-extrabold text-[#334155]">{label}</div>

          </Link>

        ))}

      </div>

    </PageShell>

  );

}



export function UnderstandPage() {

  const { language } = useLanguage();

  const copy = uiCopy[language];

  const page = understandCopy[language];



  return (

    <PageShell current="understand">

      <SectionCard

        icon="🧭"

        title={page.issueTitle}

        description={page.issueDescription}

        tint="bg-[#fff0df]"

        action={{ href: "/explore#issue-journey", label: `${copy.view} →` }}

      >

        <div className="space-y-2">

          {page.issueSteps.map((step, index) => (

            <div key={step} className="kf-journey-item flex items-center gap-3 rounded-2xl border border-[#e9e1d7] bg-[#fffdf9] px-3.5 py-3.5">

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff0df] text-[12px] font-black text-[#ff7a00]">

                {String(index + 1).padStart(2, "0")}

              </span>

              <span className="text-[12px] font-extrabold text-[#263447]">{step}</span>

              {index === page.issueSteps.length - 1 ? (

                <span className="ml-auto text-[#ff7a00]">✓</span>

              ) : (

                <span className="ml-auto text-[#9ba7b3]">→</span>

              )}

            </div>

          ))}

        </div>

      </SectionCard>



      <SectionCard

        icon="🌱"

        title={page.senseTitle}

        description={page.senseDescription}

        tint="bg-[#f8dff0]"

        action={{ href: "/civic-sense", label: `${copy.view} →` }}

      >

        <div className="grid gap-2">

          {page.senseActions.map((item, index) => (

            <Link key={item} href="/civic-sense" className="kf-journey-item flex items-center gap-3 rounded-2xl border border-[#eddbe8] bg-[#fffafd] px-3.5 py-3.5 transition hover:-translate-y-0.5">

              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f8] text-[16px]">

                {["🗑️", "⏳", "🏛️"][index]}

              </span>

              <span className="text-[12px] font-extrabold text-[#4a3348]">{item}</span>

              <span className="ml-auto text-[#b8799f]">›</span>

            </Link>

          ))}

        </div>

      </SectionCard>



      <SectionCard

        icon="🏛️"

        title={page.authorityTitle}

        description={page.authorityDescription}

        tint="bg-[#e5f0f8]"

        action={{ href: "/responsible-authorities", label: `${copy.view} →` }}

      >

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

          {page.authoritySteps.map((step) => (

            <div key={step} className="kf-journey-item rounded-2xl border border-[#dce7ef] bg-[#f8fcff] px-3 py-4 text-center">

              <div className="text-[10px] font-black tracking-[0.14em] text-[#648099]">{step}</div>

            </div>

          ))}

        </div>

      </SectionCard>

    </PageShell>

  );

}



export function ParticipatePage() {

  const { language } = useLanguage();

  const page = participateCopy[language];



  return (

    <PageShell current="participate">

      <SectionCard

        icon="🤝"

        title={page.participationTitle}

        description={page.participationDescription}

        tint="bg-[#e9f4e7]"

      >

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

          {participationTools[language].map((tool) => (

            <Link

              key={tool.href}

              href={tool.href}

              className="kf-journey-item flex min-h-14 items-center gap-3 rounded-2xl border border-[#e1e7dc] bg-[#fbfdf9] px-3.5 py-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_rgba(35,47,58,.05)]"

            >

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef7eb] text-[17px]">

                {tool.icon}

              </span>

              <span className="min-w-0 text-[12px] font-extrabold leading-5 text-[#29422f]">{tool.title}</span>

              <span className="ml-auto text-[#7b9a7d]">›</span>

            </Link>

          ))}

        </div>

      </SectionCard>



      <div className="grid gap-6 md:grid-cols-2">

        <SectionCard

          icon="🏆"

          title={page.leaguesTitle}

          description={page.leaguesDescription}

          tint="bg-[#fff0dc]"

          action={{ href: "/leagues", label: language === "en" ? "Explore →" : language === "hi" ? "देखें →" : "एक्सप्लोर करा →" }}

        >

          <div className="grid gap-2">

            {(language === "en"

              ? ["Join a team", "Complete real-world missions", "Earn & track"]

              : language === "hi"

              ? ["एक टीम से जुड़ें", "वास्तविक नागरिक मिशन पूरे करें", "अर्जित करें और ट्रैक करें"]

              : ["टीममध्ये सामील व्हा", "प्रत्यक्ष नागरी मिशन्स पूर्ण करा", "मिळवा आणि ट्रॅक करा"]

            ).map((item, index) => (

              <div key={item} className="kf-journey-item flex items-center gap-3 rounded-2xl border border-[#eadfd2] bg-[#fffdf9] px-3.5 py-3">

                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fff1df] text-[11px] font-black text-[#ff7a00]">{index + 1}</span>

                <span className="text-[12px] font-extrabold text-[#4a3b2d]">{item}</span>

              </div>

            ))}

          </div>

        </SectionCard>



        <SectionCard

          icon="🪪"

          title={page.recordTitle}

          description={page.recordSubtitle}

          tint="bg-[#f4eafb]"

          action={{ href: "/civic-passport", label: language === "en" ? "Civic Passport →" : language === "hi" ? "Civic Passport →" : "Civic Passport →" }}

        >

          <div className="kf-journey-item rounded-[24px] border border-[#e5dcec] bg-[#fcf9ff] p-5">

            <div className="grid grid-cols-3 gap-2 text-center">

              {[

                ["🎯", language === "en" ? "Quests" : language === "hi" ? "क्वेस्ट्स" : "क्वेस्ट्स"],

                ["✨", language === "en" ? "Karma" : language === "hi" ? "कर्म" : "कर्म"],

                ["🏆", language === "en" ? "Leagues" : language === "hi" ? "लीग्स" : "लीग्स"],

              ].map(([icon, label]) => (

                <div key={label}>

                  <div className="text-[20px]">{icon}</div>

                  <div className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#7d698e]">{label}</div>

                </div>

              ))}

            </div>

            <p className="kf-journey-muted mt-5 text-[12px] leading-6 text-[#657482]">

              {language === "en"

                ? "Keep your civic participation, Karma Credits, missions and League contribution connected in one record."

                : language === "hi"

                ? "अपनी नागरिक भागीदारी, Karma Credits, मिशन और League योगदान को एक रिकॉर्ड में जोड़कर रखें।"

                : "तुमचा नागरी सहभाग, Karma Credits, मिशन्स आणि League मधील योगदान एका नोंदीत जोडून ठेवा."}

            </p>

          </div>

        </SectionCard>

      </div>

    </PageShell>

  );

}
