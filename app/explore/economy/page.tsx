"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type EconomyItem = {
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

const economyBasics: EconomyItem[] = [
  {
    icon: "🏭",
    title: {
      en: "Production",
      hi: "उत्पादन",
      mr: "उत्पादन",
    },
    text: {
      en: "Production is the process of creating goods and services that people and organisations use.",
      hi: "उत्पादन वह प्रक्रिया है जिसमें लोगों और संगठनों द्वारा उपयोग की जाने वाली वस्तुओं और सेवाओं का निर्माण किया जाता है।",
      mr: "उत्पादन म्हणजे लोक आणि संस्था वापरतात अशा वस्तू व सेवांची निर्मिती करण्याची प्रक्रिया.",
    },
  },
  {
    icon: "🛒",
    title: {
      en: "Consumption",
      hi: "उपभोग",
      mr: "उपभोग",
    },
    text: {
      en: "Consumption refers to the use of goods and services by households, businesses and other organisations.",
      hi: "उपभोग का अर्थ परिवारों, व्यवसायों और अन्य संगठनों द्वारा वस्तुओं और सेवाओं के उपयोग से है।",
      mr: "उपभोग म्हणजे कुटुंबे, व्यवसाय आणि इतर संस्था यांच्याकडून वस्तू व सेवांचा वापर.",
    },
  },
  {
    icon: "💰",
    title: {
      en: "Income",
      hi: "आय",
      mr: "उत्पन्न",
    },
    text: {
      en: "Income can come from employment, business activity, investments and other legitimate sources.",
      hi: "आय रोजगार, व्यावसायिक गतिविधियों, निवेश और अन्य वैध स्रोतों से प्राप्त हो सकती है।",
      mr: "उत्पन्न रोजगार, व्यवसाय, गुंतवणूक आणि इतर कायदेशीर स्रोतांमधून मिळू शकते.",
    },
  },
  {
    icon: "🔄",
    title: {
      en: "Markets",
      hi: "बाज़ार",
      mr: "बाजारपेठा",
    },
    text: {
      en: "Markets bring together buyers and sellers and help determine the exchange of goods and services.",
      hi: "बाज़ार खरीदारों और विक्रेताओं को एक साथ लाते हैं और वस्तुओं तथा सेवाओं के आदान-प्रदान को निर्धारित करने में मदद करते हैं।",
      mr: "बाजारपेठा खरेदीदार आणि विक्रेते यांना एकत्र आणतात आणि वस्तू व सेवांच्या देवाणघेवाणीची प्रक्रिया ठरवण्यात मदत करतात.",
    },
  },
];

const jobsTopics: EconomyItem[] = [
  {
    icon: "👷",
    title: {
      en: "Employment",
      hi: "रोजगार",
      mr: "रोजगार",
    },
    text: {
      en: "Employment involves people engaging in economic activities in return for income or other compensation.",
      hi: "रोजगार में लोग आय या अन्य पारिश्रमिक के बदले आर्थिक गतिविधियों में भाग लेते हैं।",
      mr: "रोजगारामध्ये लोक उत्पन्न किंवा इतर मोबदल्याच्या बदल्यात आर्थिक उपक्रमांमध्ये सहभागी होतात.",
    },
  },
  {
    icon: "🏢",
    title: {
      en: "Formal Sector",
      hi: "औपचारिक क्षेत्र",
      mr: "औपचारिक क्षेत्र",
    },
    text: {
      en: "Formal employment generally operates within established legal, regulatory and institutional frameworks.",
      hi: "औपचारिक रोजगार आम तौर पर स्थापित कानूनी, नियामक और संस्थागत ढाँचों के भीतर संचालित होता है।",
      mr: "औपचारिक रोजगार सामान्यतः स्थापित कायदेशीर, नियामक आणि संस्थात्मक चौकटीत चालतो.",
    },
  },
  {
    icon: "🧑‍💻",
    title: {
      en: "Informal Sector",
      hi: "अनौपचारिक क्षेत्र",
      mr: "अनौपचारिक क्षेत्र",
    },
    text: {
      en: "Informal economic activities include many forms of work and businesses that may operate outside or partly outside formal arrangements.",
      hi: "अनौपचारिक आर्थिक गतिविधियों में कई प्रकार के काम और व्यवसाय शामिल हैं जो औपचारिक व्यवस्थाओं के बाहर या आंशिक रूप से बाहर संचालित हो सकते हैं।",
      mr: "अनौपचारिक आर्थिक उपक्रमांमध्ये अनेक प्रकारचे काम आणि व्यवसाय येतात जे औपचारिक व्यवस्थेबाहेर किंवा अंशतः त्याबाहेर चालू शकतात.",
    },
  },
  {
    icon: "🎓",
    title: {
      en: "Skills",
      hi: "कौशल",
      mr: "कौशल्ये",
    },
    text: {
      en: "Education, vocational training and skills development can influence employment opportunities and productivity.",
      hi: "शिक्षा, व्यावसायिक प्रशिक्षण और कौशल विकास रोजगार के अवसरों और उत्पादकता को प्रभावित कर सकते हैं।",
      mr: "शिक्षण, व्यावसायिक प्रशिक्षण आणि कौशल्य विकास यांचा रोजगाराच्या संधींवर आणि उत्पादकतेवर परिणाम होऊ शकतो.",
    },
  },
];

const economicIndicators: EconomyItem[] = [
  {
    icon: "📊",
    title: {
      en: "GDP",
      hi: "GDP",
      mr: "GDP",
    },
    text: {
      en: "Gross Domestic Product measures the monetary value of final goods and services produced within an economy over a period.",
      hi: "सकल घरेलू उत्पाद किसी निश्चित अवधि में अर्थव्यवस्था के भीतर उत्पादित अंतिम वस्तुओं और सेवाओं के मौद्रिक मूल्य को मापता है।",
      mr: "सकल देशांतर्गत उत्पादन (GDP) एखाद्या कालावधीत अर्थव्यवस्थेत उत्पादित झालेल्या अंतिम वस्तू आणि सेवांचे आर्थिक मूल्य मोजते.",
    },
  },
  {
    icon: "📈",
    title: {
      en: "Inflation",
      hi: "मुद्रास्फीति",
      mr: "महागाई",
    },
    text: {
      en: "Inflation refers to a sustained increase in the general level of prices of goods and services.",
      hi: "मुद्रास्फीति का अर्थ वस्तुओं और सेवाओं के सामान्य मूल्य स्तर में लगातार वृद्धि से है।",
      mr: "महागाई म्हणजे वस्तू आणि सेवांच्या सर्वसाधारण किंमत पातळीत सातत्याने होणारी वाढ.",
    },
  },
  {
    icon: "👥",
    title: {
      en: "Employment",
      hi: "रोजगार",
      mr: "रोजगार",
    },
    text: {
      en: "Employment and labour-market indicators help describe conditions in the workforce.",
      hi: "रोजगार और श्रम-बाज़ार संकेतक कार्यबल की स्थितियों को समझने में मदद करते हैं।",
      mr: "रोजगार आणि कामगार बाजारातील निर्देशक कामगार वर्गाच्या परिस्थितीचे वर्णन करण्यात मदत करतात.",
    },
  },
  {
    icon: "💱",
    title: {
      en: "Trade",
      hi: "व्यापार",
      mr: "व्यापार",
    },
    text: {
      en: "Trade involves the exchange of goods and services between different regions or countries.",
      hi: "व्यापार में अलग-अलग क्षेत्रों या देशों के बीच वस्तुओं और सेवाओं का आदान-प्रदान शामिल होता है।",
      mr: "व्यापारामध्ये वेगवेगळ्या प्रदेशांमध्ये किंवा देशांमध्ये वस्तू आणि सेवांची देवाणघेवाण होते.",
    },
  },
];

const citizenActions: CitizenAction[] = [
  {
    number: "01",
    title: {
      en: "Understand your money",
      hi: "अपने पैसे को समझें",
      mr: "तुमच्या पैशांबद्दल समजून घ्या",
    },
    text: {
      en: "Learn basic concepts such as income, expenditure, saving, borrowing, interest and inflation.",
      hi: "आय, खर्च, बचत, उधार, ब्याज और मुद्रास्फीति जैसी मूलभूत अवधारणाओं को समझें।",
      mr: "उत्पन्न, खर्च, बचत, कर्ज घेणे, व्याज आणि महागाई यांसारख्या मूलभूत संकल्पना समजून घ्या.",
    },
  },
  {
    number: "02",
    title: {
      en: "Build useful skills",
      hi: "उपयोगी कौशल विकसित करें",
      mr: "उपयुक्त कौशल्ये विकसित करा",
    },
    text: {
      en: "Education, vocational training and continuous learning can help people adapt to changing employment opportunities.",
      hi: "शिक्षा, व्यावसायिक प्रशिक्षण और निरंतर सीखना लोगों को बदलते रोजगार के अवसरों के अनुसार ढलने में मदद कर सकता है।",
      mr: "शिक्षण, व्यावसायिक प्रशिक्षण आणि सतत शिकणे यामुळे बदलत्या रोजगाराच्या संधींशी जुळवून घेण्यास मदत होऊ शकते.",
    },
  },
  {
    number: "03",
    title: {
      en: "Understand taxes",
      hi: "करों को समझें",
      mr: "कर समजून घ्या",
    },
    text: {
      en: "Learn why governments collect taxes and how taxation forms part of public finance.",
      hi: "जानें कि सरकारें कर क्यों एकत्र करती हैं और कराधान सार्वजनिक वित्त का हिस्सा कैसे है।",
      mr: "सरकार कर का गोळा करते आणि करव्यवस्था सार्वजनिक वित्ताचा भाग कशी आहे हे समजून घ्या.",
    },
  },
  {
    number: "04",
    title: {
      en: "Use financial services carefully",
      hi: "वित्तीय सेवाओं का सावधानी से उपयोग करें",
      mr: "आर्थिक सेवांचा काळजीपूर्वक वापर करा",
    },
    text: {
      en: "Understand the terms, costs and risks associated with bank accounts, loans, insurance and other financial products.",
      hi: "बैंक खातों, ऋणों, बीमा और अन्य वित्तीय उत्पादों से जुड़े नियमों, लागत और जोखिमों को समझें।",
      mr: "बँक खाती, कर्जे, विमा आणि इतर आर्थिक उत्पादनांशी संबंधित अटी, खर्च आणि जोखीम समजून घ्या.",
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
      en: "Economic policies and conditions can affect prices, employment, businesses and household finances.",
      hi: "आर्थिक नीतियाँ और परिस्थितियाँ कीमतों, रोजगार, व्यवसायों और परिवारों की वित्तीय स्थिति को प्रभावित कर सकती हैं।",
      mr: "आर्थिक धोरणे आणि परिस्थितींचा परिणाम किंमती, रोजगार, व्यवसाय आणि कुटुंबाच्या आर्थिक स्थितीवर होऊ शकतो.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "What does GDP broadly measure?",
      hi: "GDP मुख्य रूप से क्या मापता है?",
      mr: "GDP साधारणपणे काय मोजते?",
    },
    options: [
      {
        en: "The value of final goods and services produced in an economy",
        hi: "अर्थव्यवस्था में उत्पादित अंतिम वस्तुओं और सेवाओं का मूल्य",
        mr: "अर्थव्यवस्थेत उत्पादित अंतिम वस्तू आणि सेवांचे मूल्य",
      },
      {
        en: "Only government salaries",
        hi: "केवल सरकारी वेतन",
        mr: "फक्त सरकारी वेतन",
      },
      {
        en: "Only exports",
        hi: "केवल निर्यात",
        mr: "फक्त निर्यात",
      },
      {
        en: "The number of banks in a country",
        hi: "किसी देश में बैंकों की संख्या",
        mr: "एखाद्या देशातील बँकांची संख्या",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What is inflation?",
      hi: "मुद्रास्फीति क्या है?",
      mr: "महागाई म्हणजे काय?",
    },
    options: [
      {
        en: "A general increase in the level of prices",
        hi: "कीमतों के सामान्य स्तर में वृद्धि",
        mr: "किंमतींच्या सर्वसाधारण पातळीत वाढ",
      },
      {
        en: "A fall in population",
        hi: "जनसंख्या में कमी",
        mr: "लोकसंख्येत घट",
      },
      {
        en: "An increase in rainfall",
        hi: "वर्षा में वृद्धि",
        mr: "पावसामध्ये वाढ",
      },
      {
        en: "A decrease in government departments",
        hi: "सरकारी विभागों में कमी",
        mr: "सरकारी विभागांमध्ये घट",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which institution is India's central bank?",
      hi: "भारत का केंद्रीय बैंक कौन-सा संस्थान है?",
      mr: "भारताची मध्यवर्ती बँक कोणती संस्था आहे?",
    },
    options: [
      {
        en: "Reserve Bank of India",
        hi: "भारतीय रिज़र्व बैंक",
        mr: "भारतीय रिझर्व्ह बँक",
      },
      {
        en: "Election Commission of India",
        hi: "भारत निर्वाचन आयोग",
        mr: "भारत निवडणूक आयोग",
      },
      {
        en: "Supreme Court of India",
        hi: "भारत का सर्वोच्च न्यायालय",
        mr: "भारताचे सर्वोच्च न्यायालय",
      },
      {
        en: "NITI Aayog",
        hi: "नीति आयोग",
        mr: "नीती आयोग",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Why does the government collect taxes?",
      hi: "सरकार कर क्यों एकत्र करती है?",
      mr: "सरकार कर का गोळा का करते?",
    },
    options: [
      {
        en: "To finance public expenditure and government functions",
        hi: "सार्वजनिक व्यय और सरकारी कार्यों के लिए वित्त उपलब्ध कराने हेतु",
        mr: "सार्वजनिक खर्च आणि सरकारी कार्यांसाठी वित्त उपलब्ध करून देण्यासाठी",
      },
      {
        en: "Only to increase private company profits",
        hi: "केवल निजी कंपनियों के मुनाफे को बढ़ाने के लिए",
        mr: "फक्त खासगी कंपन्यांचा नफा वाढवण्यासाठी",
      },
      {
        en: "To eliminate all prices",
        hi: "सभी कीमतों को समाप्त करने के लिए",
        mr: "सर्व किंमती नष्ट करण्यासाठी",
      },
      {
        en: "To stop international trade",
        hi: "अंतरराष्ट्रीय व्यापार को रोकने के लिए",
        mr: "आंतरराष्ट्रीय व्यापार थांबवण्यासाठी",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which can influence employment opportunities?",
      hi: "रोजगार के अवसरों को कौन प्रभावित कर सकता है?",
      mr: "रोजगाराच्या संधींवर कशाचा परिणाम होऊ शकतो?",
    },
    options: [
      {
        en: "Skills and education",
        hi: "कौशल और शिक्षा",
        mr: "कौशल्ये आणि शिक्षण",
      },
      {
        en: "Only the weather",
        hi: "केवल मौसम",
        mr: "फक्त हवामान",
      },
      {
        en: "Only elections",
        hi: "केवल चुनाव",
        mr: "फक्त निवडणुका",
      },
      {
        en: "Only the size of cities",
        hi: "केवल शहरों का आकार",
        mr: "फक्त शहरांचा आकार",
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

    section2Label: string;
    section2Title: string;
    section2Text: string;
    exampleTitle: string;
    exampleText: string;

    section3Label: string;
    section3Title: string;
    section3Text: string;

    section4Label: string;
    section4Title: string;
    section4Text: string;
    householdsTitle: string;
    householdsText: string;
    businessesTitle: string;
    businessesText: string;
    purchasingPowerTitle: string;
    purchasingPowerText: string;

    section5Label: string;
    section5Title: string;
    section5Text: string;

    section6Label: string;
    section6Title: string;
    section6Text: string;
    publicFinanceTitle: string;
    publicFinanceText: string;
    regulationTitle: string;
    regulationText: string;
    infrastructureTitle: string;
    infrastructureText: string;
    publicServicesTitle: string;
    publicServicesText: string;

    section7Label: string;
    section7Title: string;
    section7Text: string;
    bankingTitle: string;
    bankingText: string;

    section8Label: string;
    section8Title: string;
    section8Text: string;

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
    subtitle: "Economy & Jobs",
    back: "← Explore",

    heroLabel: "CIVIC BASICS · 06",
    heroTitle: "Economy & Jobs",
    heroText:
      "Understand how an economy works, how jobs and businesses fit into it, and how economic decisions can affect everyday life.",

    section1Label: "01 · ECONOMIC BASICS",
    section1Title: "What is an economy?",
    section1Text:
      "An economy is the system through which people, businesses and governments produce, exchange and use goods and services. It involves resources, labour, businesses, households, markets and institutions.",

    section2Label: "02 · GDP & ECONOMIC ACTIVITY",
    section2Title: "How do we measure economic activity?",
    section2Text:
      "Gross Domestic Product, commonly called GDP, measures the monetary value of final goods and services produced within an economy during a specified period. GDP is one important indicator of economic activity, but it does not by itself describe every aspect of people's well-being.",
    exampleTitle: "A simple example",
    exampleText:
      "When a factory produces goods, a restaurant provides meals or a software company provides a service, these activities can contribute to economic output.",

    section3Label: "03 · EMPLOYMENT & JOBS",
    section3Title: "Where do jobs fit into the economy?",
    section3Text:
      "Employment connects people with economic activity. People may work for businesses, government organisations, non-profit organisations or themselves. The nature of work and employment arrangements can vary considerably.",

    section4Label: "04 · INFLATION",
    section4Title: "Why do prices change?",
    section4Text:
      "Inflation describes a sustained increase in the general level of prices of goods and services. When prices rise, the purchasing power of money can change, meaning the same amount of money may buy a different quantity of goods and services.",
    householdsTitle: "Households",
    householdsText:
      "Changes in prices can affect household budgets and spending decisions.",
    businessesTitle: "Businesses",
    businessesText:
      "Businesses may face changes in input costs, selling prices and demand.",
    purchasingPowerTitle: "Purchasing Power",
    purchasingPowerText:
      "Inflation can affect how much goods and services a given amount of money can purchase.",

    section5Label: "05 · ECONOMIC INDICATORS",
    section5Title: "Numbers that help us understand the economy",
    section5Text:
      "Economists and policymakers use multiple indicators to understand economic conditions. No single indicator gives a complete picture.",

    section6Label: "06 · GOVERNMENT & THE ECONOMY",
    section6Title: "What role does the government play?",
    section6Text:
      "Governments influence economic activity through public expenditure, taxation, regulation, infrastructure, economic policy and the delivery of public services. Different institutions have different responsibilities.",
    publicFinanceTitle: "Public Finance",
    publicFinanceText:
      "Government collects revenue and spends money on public services, infrastructure and other approved activities.",
    regulationTitle: "Regulation",
    regulationText:
      "Governments establish and enforce rules that shape how different economic activities operate.",
    infrastructureTitle: "Infrastructure",
    infrastructureText:
      "Public infrastructure such as roads, transport and other facilities can support economic activity.",
    publicServicesTitle: "Public Services",
    publicServicesText:
      "Education, healthcare and other public services form an important part of government activity.",

    section7Label: "07 · BANKING & FINANCE",
    section7Title: "How does money move through the economy?",
    section7Text:
      "Banks and other financial institutions help individuals and businesses save, borrow, make payments and access financial services. The Reserve Bank of India is India's central bank and performs important monetary and banking functions.",
    bankingTitle: "Why should citizens understand banking?",
    bankingText:
      "Understanding interest, loan costs, deposits, digital payments and basic financial risks can help people make more informed financial decisions.",

    section8Label: "08 · CITIZEN ACTION",
    section8Title: "What can citizens do?",
    section8Text:
      "Economic participation is part of everyday life. Citizens can improve their understanding of money, employment, taxation and financial services and stay informed about economic developments.",

    quizLabel: "09 · QUICK QUIZ",
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
    subtitle: "अर्थव्यवस्था और रोजगार",
    back: "← एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 06",
    heroTitle: "अर्थव्यवस्था और रोजगार",
    heroText:
      "समझें कि अर्थव्यवस्था कैसे काम करती है, इसमें रोजगार और व्यवसाय की क्या भूमिका है, और आर्थिक निर्णय रोजमर्रा के जीवन को कैसे प्रभावित कर सकते हैं।",

    section1Label: "01 · आर्थिक मूल बातें",
    section1Title: "अर्थव्यवस्था क्या है?",
    section1Text:
      "अर्थव्यवस्था वह व्यवस्था है जिसके माध्यम से लोग, व्यवसाय और सरकारें वस्तुओं और सेवाओं का उत्पादन, आदान-प्रदान और उपयोग करते हैं। इसमें संसाधन, श्रम, व्यवसाय, परिवार, बाज़ार और संस्थाएँ शामिल होती हैं।",

    section2Label: "02 · GDP और आर्थिक गतिविधि",
    section2Title: "हम आर्थिक गतिविधि को कैसे मापते हैं?",
    section2Text:
      "सकल घरेलू उत्पाद, जिसे सामान्यतः GDP कहा जाता है, किसी निश्चित अवधि में अर्थव्यवस्था के भीतर उत्पादित अंतिम वस्तुओं और सेवाओं के मौद्रिक मूल्य को मापता है। GDP आर्थिक गतिविधि का एक महत्वपूर्ण संकेतक है, लेकिन अकेले यह लोगों के कल्याण के हर पहलू का वर्णन नहीं करता।",
    exampleTitle: "एक सरल उदाहरण",
    exampleText:
      "जब कोई कारखाना वस्तुओं का उत्पादन करता है, कोई रेस्तराँ भोजन उपलब्ध कराता है या कोई सॉफ्टवेयर कंपनी सेवा प्रदान करती है, तो ये गतिविधियाँ आर्थिक उत्पादन में योगदान कर सकती हैं।",

    section3Label: "03 · रोजगार और नौकरियाँ",
    section3Title: "अर्थव्यवस्था में नौकरियों की क्या भूमिका है?",
    section3Text:
      "रोजगार लोगों को आर्थिक गतिविधियों से जोड़ता है। लोग व्यवसायों, सरकारी संगठनों, गैर-लाभकारी संगठनों के लिए या स्वयं के लिए काम कर सकते हैं। काम और रोजगार की व्यवस्थाएँ अलग-अलग हो सकती हैं।",

    section4Label: "04 · मुद्रास्फीति",
    section4Title: "कीमतें क्यों बदलती हैं?",
    section4Text:
      "मुद्रास्फीति वस्तुओं और सेवाओं के सामान्य मूल्य स्तर में लगातार वृद्धि को दर्शाती है। जब कीमतें बढ़ती हैं, तो पैसे की क्रय शक्ति बदल सकती है, जिसका अर्थ है कि समान राशि से वस्तुओं और सेवाओं की अलग मात्रा खरीदी जा सकती है।",
    householdsTitle: "परिवार",
    householdsText:
      "कीमतों में बदलाव परिवार के बजट और खर्च के निर्णयों को प्रभावित कर सकते हैं।",
    businessesTitle: "व्यवसाय",
    businessesText:
      "व्यवसायों को उत्पादन लागत, बिक्री कीमतों और मांग में बदलाव का सामना करना पड़ सकता है।",
    purchasingPowerTitle: "क्रय शक्ति",
    purchasingPowerText:
      "मुद्रास्फीति यह प्रभावित कर सकती है कि एक निश्चित राशि से कितनी वस्तुएँ और सेवाएँ खरीदी जा सकती हैं।",

    section5Label: "05 · आर्थिक संकेतक",
    section5Title: "अर्थव्यवस्था को समझने में मदद करने वाली संख्याएँ",
    section5Text:
      "अर्थशास्त्री और नीति-निर्माता आर्थिक परिस्थितियों को समझने के लिए कई संकेतकों का उपयोग करते हैं। कोई एक संकेतक पूरी तस्वीर नहीं देता।",

    section6Label: "06 · सरकार और अर्थव्यवस्था",
    section6Title: "सरकार की क्या भूमिका है?",
    section6Text:
      "सरकारें सार्वजनिक व्यय, कराधान, विनियमन, बुनियादी ढाँचे, आर्थिक नीति और सार्वजनिक सेवाओं की व्यवस्था के माध्यम से आर्थिक गतिविधियों को प्रभावित करती हैं। अलग-अलग संस्थाओं की अलग-अलग जिम्मेदारियाँ होती हैं।",
    publicFinanceTitle: "सार्वजनिक वित्त",
    publicFinanceText:
      "सरकार राजस्व एकत्र करती है और सार्वजनिक सेवाओं, बुनियादी ढाँचे तथा अन्य स्वीकृत गतिविधियों पर खर्च करती है।",
    regulationTitle: "विनियमन",
    regulationText:
      "सरकारें ऐसे नियम बनाती और लागू करती हैं जो विभिन्न आर्थिक गतिविधियों के संचालन को प्रभावित करते हैं।",
    infrastructureTitle: "बुनियादी ढाँचा",
    infrastructureText:
      "सड़क, परिवहन और अन्य सार्वजनिक सुविधाओं जैसी बुनियादी संरचनाएँ आर्थिक गतिविधि का समर्थन कर सकती हैं।",
    publicServicesTitle: "सार्वजनिक सेवाएँ",
    publicServicesText:
      "शिक्षा, स्वास्थ्य सेवा और अन्य सार्वजनिक सेवाएँ सरकारी गतिविधियों का महत्वपूर्ण हिस्सा हैं।",

    section7Label: "07 · बैंकिंग और वित्त",
    section7Title: "अर्थव्यवस्था में पैसा कैसे चलता है?",
    section7Text:
      "बैंक और अन्य वित्तीय संस्थाएँ व्यक्तियों और व्यवसायों को बचत करने, उधार लेने, भुगतान करने और वित्तीय सेवाओं तक पहुँच प्राप्त करने में मदद करती हैं। भारतीय रिज़र्व बैंक भारत का केंद्रीय बैंक है और महत्वपूर्ण मौद्रिक तथा बैंकिंग कार्य करता है।",
    bankingTitle: "नागरिकों को बैंकिंग क्यों समझनी चाहिए?",
    bankingText:
      "ब्याज, ऋण की लागत, जमा, डिजिटल भुगतान और बुनियादी वित्तीय जोखिमों को समझना लोगों को अधिक सूचित वित्तीय निर्णय लेने में मदद कर सकता है।",

    section8Label: "08 · नागरिक कार्रवाई",
    section8Title: "नागरिक क्या कर सकते हैं?",
    section8Text:
      "आर्थिक भागीदारी रोजमर्रा के जीवन का हिस्सा है। नागरिक पैसे, रोजगार, कराधान और वित्तीय सेवाओं की अपनी समझ को बेहतर कर सकते हैं और आर्थिक घटनाक्रमों के बारे में जानकारी रख सकते हैं।",

    quizLabel: "09 · त्वरित क्विज़",
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
    subtitle: "अर्थव्यवस्था आणि रोजगार",
    back: "← एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 06",
    heroTitle: "अर्थव्यवस्था आणि रोजगार",
    heroText:
      "अर्थव्यवस्था कशी कार्य करते, त्यामध्ये रोजगार आणि व्यवसायांचे स्थान काय आहे आणि आर्थिक निर्णयांचा दैनंदिन जीवनावर कसा परिणाम होऊ शकतो हे समजून घ्या.",

    section1Label: "01 · आर्थिक मूलभूत माहिती",
    section1Title: "अर्थव्यवस्था म्हणजे काय?",
    section1Text:
      "अर्थव्यवस्था ही अशी व्यवस्था आहे ज्याद्वारे लोक, व्यवसाय आणि सरकारे वस्तू व सेवांचे उत्पादन, देवाणघेवाण आणि वापर करतात. यामध्ये संसाधने, कामगार, व्यवसाय, कुटुंबे, बाजारपेठा आणि संस्था यांचा समावेश होतो.",

    section2Label: "02 · GDP आणि आर्थिक क्रियाकलाप",
    section2Title: "आर्थिक क्रियाकलाप कसे मोजले जातात?",
    section2Text:
      "सकल देशांतर्गत उत्पादन, सामान्यतः GDP म्हणून ओळखले जाते, एखाद्या विशिष्ट कालावधीत अर्थव्यवस्थेत उत्पादित अंतिम वस्तू आणि सेवांचे आर्थिक मूल्य मोजते. GDP हा आर्थिक क्रियाकलापाचा एक महत्त्वाचा निर्देशक आहे, परंतु केवळ GDP मुळे लोकांच्या कल्याणाच्या प्रत्येक पैलूचे वर्णन होत नाही.",
    exampleTitle: "एक सोपे उदाहरण",
    exampleText:
      "एखादा कारखाना वस्तू तयार करतो, एखादे उपाहारगृह भोजन देते किंवा एखादी सॉफ्टवेअर कंपनी सेवा पुरवते तेव्हा या क्रिया आर्थिक उत्पादनात योगदान देऊ शकतात.",

    section3Label: "03 · रोजगार आणि नोकऱ्या",
    section3Title: "अर्थव्यवस्थेत नोकऱ्यांचे स्थान काय आहे?",
    section3Text:
      "रोजगार लोकांना आर्थिक क्रियाकलापांशी जोडतो. लोक व्यवसाय, सरकारी संस्था, ना-नफा संस्था किंवा स्वतःसाठी काम करू शकतात. कामाचे स्वरूप आणि रोजगाराच्या व्यवस्था मोठ्या प्रमाणात बदलू शकतात.",

    section4Label: "04 · महागाई",
    section4Title: "किंमती का बदलतात?",
    section4Text:
      "महागाई म्हणजे वस्तू आणि सेवांच्या सर्वसाधारण किंमत पातळीत सातत्याने होणारी वाढ. किंमती वाढल्यावर पैशांची क्रयशक्ती बदलू शकते, म्हणजेच त्याच पैशांत वस्तू आणि सेवांची वेगळी मात्रा खरेदी करता येऊ शकते.",
    householdsTitle: "कुटुंबे",
    householdsText:
      "किंमतीतील बदलांचा कुटुंबाच्या बजेटवर आणि खर्चाच्या निर्णयांवर परिणाम होऊ शकतो.",
    businessesTitle: "व्यवसाय",
    businessesText:
      "व्यवसायांना इनपुट खर्च, विक्री किंमती आणि मागणीतील बदलांचा सामना करावा लागू शकतो.",
    purchasingPowerTitle: "क्रयशक्ती",
    purchasingPowerText:
      "महागाईमुळे ठरावीक पैशांत किती वस्तू आणि सेवा खरेदी करता येतील यावर परिणाम होऊ शकतो.",

    section5Label: "05 · आर्थिक निर्देशक",
    section5Title: "अर्थव्यवस्था समजून घेण्यास मदत करणारे आकडे",
    section5Text:
      "अर्थशास्त्रज्ञ आणि धोरणकर्ते आर्थिक परिस्थिती समजून घेण्यासाठी अनेक निर्देशक वापरतात. कोणताही एक निर्देशक संपूर्ण चित्र देत नाही.",

    section6Label: "06 · सरकार आणि अर्थव्यवस्था",
    section6Title: "सरकारची भूमिका काय आहे?",
    section6Text:
      "सरकारे सार्वजनिक खर्च, करव्यवस्था, नियमन, पायाभूत सुविधा, आर्थिक धोरण आणि सार्वजनिक सेवांच्या माध्यमातून आर्थिक क्रियाकलापांवर प्रभाव टाकतात. वेगवेगळ्या संस्थांच्या वेगवेगळ्या जबाबदाऱ्या असतात.",
    publicFinanceTitle: "सार्वजनिक वित्त",
    publicFinanceText:
      "सरकार महसूल गोळा करते आणि सार्वजनिक सेवा, पायाभूत सुविधा व इतर मंजूर उपक्रमांवर खर्च करते.",
    regulationTitle: "नियमन",
    regulationText:
      "सरकारे विविध आर्थिक क्रियाकलाप कशा पद्धतीने चालतील यावर परिणाम करणारे नियम तयार करतात आणि त्यांची अंमलबजावणी करतात.",
    infrastructureTitle: "पायाभूत सुविधा",
    infrastructureText:
      "रस्ते, वाहतूक आणि इतर सार्वजनिक सुविधांसारख्या पायाभूत सुविधा आर्थिक क्रियाकलापाला आधार देऊ शकतात.",
    publicServicesTitle: "सार्वजनिक सेवा",
    publicServicesText:
      "शिक्षण, आरोग्यसेवा आणि इतर सार्वजनिक सेवा या सरकारी कार्याचा महत्त्वाचा भाग आहेत.",

    section7Label: "07 · बँकिंग आणि वित्त",
    section7Title: "अर्थव्यवस्थेत पैसा कसा फिरतो?",
    section7Text:
      "बँका आणि इतर आर्थिक संस्था व्यक्ती व व्यवसायांना बचत करण्यास, कर्ज घेण्यास, देयके करण्यास आणि आर्थिक सेवांचा वापर करण्यास मदत करतात. भारतीय रिझर्व्ह बँक ही भारताची मध्यवर्ती बँक आहे आणि ती महत्त्वाची चलनविषयक व बँकिंग कार्ये पार पाडते.",
    bankingTitle: "नागरिकांनी बँकिंग समजून घेणे का महत्त्वाचे आहे?",
    bankingText:
      "व्याज, कर्जाचा खर्च, ठेवी, डिजिटल देयके आणि मूलभूत आर्थिक जोखीम समजून घेतल्याने लोकांना अधिक माहितीपूर्ण आर्थिक निर्णय घेण्यास मदत होऊ शकते.",

    section8Label: "08 · नागरिकांची कृती",
    section8Title: "नागरिक काय करू शकतात?",
    section8Text:
      "आर्थिक सहभाग हा दैनंदिन जीवनाचा एक भाग आहे. नागरिक पैसे, रोजगार, करव्यवस्था आणि आर्थिक सेवांबद्दलची आपली समज वाढवू शकतात आणि आर्थिक घडामोडींबद्दल माहिती अद्ययावत ठेवू शकतात.",

    quizLabel: "09 · झटपट क्विझ",
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

export default function EconomyPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

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
            topic: "economy",
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
          <SectionLabel text={t.heroLabel} />

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

          <h2 style={sectionHeadingStyle}>
            {t.section1Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section1Text}
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
            {economyBasics.map((item, index) => (
              <SimpleCard
                key={`${item.icon}-${index}`}
                icon={item.icon}
                title={item.title[language]}
                text={item.text[language]}
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

          <h2 style={sectionHeadingStyle}>
            {t.section2Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section2Text}
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
              {t.exampleTitle}
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
            {jobsTopics.map((item, index) => (
              <SimpleCard
                key={`${item.icon}-${index}`}
                icon={item.icon}
                title={item.title[language]}
                text={item.text[language]}
              />
            ))}
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
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <SimpleCard
              icon="🛒"
              title={t.householdsTitle}
              text={t.householdsText}
            />

            <SimpleCard
              icon="🏪"
              title={t.businessesTitle}
              text={t.businessesText}
            />

            <SimpleCard
              icon="💵"
              title={t.purchasingPowerTitle}
              text={t.purchasingPowerText}
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
            {economicIndicators.map((item, index) => (
              <SimpleCard
                key={`${item.icon}-${index}`}
                icon={item.icon}
                title={item.title[language]}
                text={item.text[language]}
              />
            ))}
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
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <SimpleCard
              icon="🏛️"
              title={t.publicFinanceTitle}
              text={t.publicFinanceText}
            />

            <SimpleCard
              icon="📜"
              title={t.regulationTitle}
              text={t.regulationText}
            />

            <SimpleCard
              icon="🛣️"
              title={t.infrastructureTitle}
              text={t.infrastructureText}
            />

            <SimpleCard
              icon="🏫"
              title={t.publicServicesTitle}
              text={t.publicServicesText}
            />
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
              {t.bankingTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.bankingText}
            </p>
          </div>
        </section>

        {/* SECTION 8 */}

        <section
          style={{
            marginBottom: "65px",
          }}
        >
          <SectionLabel text={t.section8Label} />

          <h2 style={sectionHeadingStyle}>
            {t.section8Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section8Text}
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
                      type="button"
                      key={`${index}-${option.en}`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
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