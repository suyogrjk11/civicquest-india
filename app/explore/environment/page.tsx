"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type PollutionType = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type EnvironmentalArea = {
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

const pollutionTypes: PollutionType[] = [
  {
    icon: "🌫️",
    title: {
      en: "Air Pollution",
      hi: "वायु प्रदूषण",
      mr: "वायू प्रदूषण",
    },
    text: {
      en: "Air pollution occurs when harmful substances enter the atmosphere and affect air quality and human or environmental health.",
      hi: "वायु प्रदूषण तब होता है जब हानिकारक पदार्थ वायुमंडल में प्रवेश करते हैं और वायु की गुणवत्ता तथा मानव या पर्यावरणीय स्वास्थ्य को प्रभावित करते हैं।",
      mr: "हानिकारक पदार्थ वातावरणात मिसळल्यामुळे हवेची गुणवत्ता तसेच मानवी किंवा पर्यावरणीय आरोग्यावर परिणाम होतो, तेव्हा वायू प्रदूषण होते.",
    },
  },
  {
    icon: "💧",
    title: {
      en: "Water Pollution",
      hi: "जल प्रदूषण",
      mr: "जल प्रदूषण",
    },
    text: {
      en: "Water pollution can occur when harmful substances contaminate rivers, lakes, groundwater or other water resources.",
      hi: "जब हानिकारक पदार्थ नदियों, झीलों, भूजल या अन्य जल संसाधनों को दूषित करते हैं, तब जल प्रदूषण हो सकता है।",
      mr: "हानिकारक पदार्थ नद्या, तलाव, भूजल किंवा इतर जलस्रोत दूषित करतात तेव्हा जल प्रदूषण होऊ शकते.",
    },
  },
  {
    icon: "🔊",
    title: {
      en: "Noise Pollution",
      hi: "ध्वनि प्रदूषण",
      mr: "ध्वनी प्रदूषण",
    },
    text: {
      en: "Excessive or unwanted sound can affect people, animals and the surrounding environment.",
      hi: "अत्यधिक या अवांछित शोर लोगों, जानवरों और आसपास के पर्यावरण को प्रभावित कर सकता है।",
      mr: "अतिरिक्त किंवा अनावश्यक आवाजाचा परिणाम माणसे, प्राणी आणि आसपासच्या पर्यावरणावर होऊ शकतो.",
    },
  },
  {
    icon: "🏭",
    title: {
      en: "Industrial Pollution",
      hi: "औद्योगिक प्रदूषण",
      mr: "औद्योगिक प्रदूषण",
    },
    text: {
      en: "Industrial activities can generate emissions, wastewater and different types of waste that require environmental management.",
      hi: "औद्योगिक गतिविधियों से उत्सर्जन, अपशिष्ट जल और विभिन्न प्रकार का कचरा उत्पन्न हो सकता है, जिनके लिए पर्यावरणीय प्रबंधन आवश्यक होता है।",
      mr: "औद्योगिक क्रियांमधून उत्सर्जन, सांडपाणी आणि विविध प्रकारचा कचरा निर्माण होऊ शकतो, ज्यासाठी पर्यावरणीय व्यवस्थापन आवश्यक असते.",
    },
  },
];

const environmentalAreas: EnvironmentalArea[] = [
  {
    icon: "🌳",
    title: {
      en: "Forests",
      hi: "वन",
      mr: "जंगले",
    },
    text: {
      en: "Forests support biodiversity and provide important ecological services such as carbon storage, soil protection and water-related functions.",
      hi: "वन जैव विविधता का समर्थन करते हैं और कार्बन भंडारण, मिट्टी संरक्षण तथा जल से संबंधित कार्यों जैसी महत्वपूर्ण पारिस्थितिक सेवाएँ प्रदान करते हैं।",
      mr: "जंगले जैवविविधतेला आधार देतात आणि कार्बन साठवण, मातीचे संरक्षण तसेच पाण्याशी संबंधित कार्ये यांसारख्या महत्त्वाच्या पर्यावरणीय सेवा पुरवतात.",
    },
  },
  {
    icon: "🐅",
    title: {
      en: "Wildlife",
      hi: "वन्यजीव",
      mr: "वन्यजीव",
    },
    text: {
      en: "Wildlife conservation involves protecting animals, plants and their habitats through laws, institutions and conservation programmes.",
      hi: "वन्यजीव संरक्षण में कानूनों, संस्थाओं और संरक्षण कार्यक्रमों के माध्यम से जानवरों, पौधों और उनके आवासों की रक्षा करना शामिल है।",
      mr: "वन्यजीव संवर्धनामध्ये कायदे, संस्था आणि संवर्धन कार्यक्रमांच्या माध्यमातून प्राणी, वनस्पती आणि त्यांच्या अधिवासांचे संरक्षण केले जाते.",
    },
  },
  {
    icon: "🦋",
    title: {
      en: "Biodiversity",
      hi: "जैव विविधता",
      mr: "जैवविविधता",
    },
    text: {
      en: "Biodiversity refers to the variety of living organisms, including plants, animals and ecosystems.",
      hi: "जैव विविधता का अर्थ पौधों, जानवरों और पारिस्थितिक तंत्र सहित विभिन्न जीवित प्रजातियों की विविधता से है।",
      mr: "जैवविविधता म्हणजे वनस्पती, प्राणी आणि परिसंस्था यांसह विविध सजीवांची विविधता.",
    },
  },
  {
    icon: "🏞️",
    title: {
      en: "Wetlands",
      hi: "आर्द्रभूमियाँ",
      mr: "पाणथळ जागा",
    },
    text: {
      en: "Wetlands are important ecosystems that support biodiversity and provide ecological functions.",
      hi: "आर्द्रभूमियाँ महत्वपूर्ण पारिस्थितिक तंत्र हैं जो जैव विविधता को सहारा देती हैं और पारिस्थितिक कार्य करती हैं।",
      mr: "पाणथळ जागा या महत्त्वाच्या परिसंस्था आहेत ज्या जैवविविधतेला आधार देतात आणि पर्यावरणीय कार्ये पार पाडतात.",
    },
  },
];

const citizenActions: CitizenAction[] = [
  {
    number: "01",
    title: {
      en: "Reduce unnecessary waste",
      hi: "अनावश्यक कचरा कम करें",
      mr: "अनावश्यक कचरा कमी करा",
    },
    text: {
      en: "Avoid unnecessary consumption and choose reusable products where practical.",
      hi: "अनावश्यक उपभोग से बचें और जहाँ व्यावहारिक हो, पुन: उपयोग किए जा सकने वाले उत्पाद चुनें।",
      mr: "अनावश्यक वापर टाळा आणि शक्य असेल तेथे पुनर्वापर करता येणारी उत्पादने निवडा.",
    },
  },
  {
    number: "02",
    title: {
      en: "Segregate waste",
      hi: "कचरे को अलग-अलग करें",
      mr: "कचऱ्याचे वर्गीकरण करा",
    },
    text: {
      en: "Follow the waste-segregation system applicable in your local area.",
      hi: "अपने स्थानीय क्षेत्र में लागू कचरा-अलगाव व्यवस्था का पालन करें।",
      mr: "तुमच्या स्थानिक भागात लागू असलेल्या कचरा वर्गीकरणाच्या पद्धतीचे पालन करा.",
    },
  },
  {
    number: "03",
    title: {
      en: "Use resources carefully",
      hi: "संसाधनों का सावधानी से उपयोग करें",
      mr: "संसाधनांचा काळजीपूर्वक वापर करा",
    },
    text: {
      en: "Conserve water, electricity and other resources in everyday life.",
      hi: "दैनिक जीवन में पानी, बिजली और अन्य संसाधनों का संरक्षण करें।",
      mr: "दैनंदिन जीवनात पाणी, वीज आणि इतर संसाधनांची बचत करा.",
    },
  },
  {
    number: "04",
    title: {
      en: "Protect local spaces",
      hi: "स्थानीय स्थानों की रक्षा करें",
      mr: "स्थानिक जागांचे संरक्षण करा",
    },
    text: {
      en: "Help keep public spaces, water bodies and surrounding areas clean.",
      hi: "सार्वजनिक स्थानों, जल निकायों और आसपास के क्षेत्रों को स्वच्छ रखने में मदद करें।",
      mr: "सार्वजनिक जागा, जलस्रोत आणि आजूबाजूचा परिसर स्वच्छ ठेवण्यास मदत करा.",
    },
  },
  {
    number: "05",
    title: {
      en: "Report environmental problems",
      hi: "पर्यावरणीय समस्याओं की शिकायत करें",
      mr: "पर्यावरणीय समस्यांची तक्रार करा",
    },
    text: {
      en: "Where an official grievance mechanism is available, citizens can report pollution or other environmental concerns.",
      hi: "जहाँ आधिकारिक शिकायत-निवारण व्यवस्था उपलब्ध हो, वहाँ नागरिक प्रदूषण या अन्य पर्यावरणीय समस्याओं की शिकायत कर सकते हैं।",
      mr: "जिथे अधिकृत तक्रार निवारण यंत्रणा उपलब्ध असेल, तिथे नागरिक प्रदूषण किंवा इतर पर्यावरणीय समस्या नोंदवू शकतात.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "Which of these is a type of pollution?",
      hi: "इनमें से कौन-सा प्रदूषण का एक प्रकार है?",
      mr: "यापैकी कोणता प्रदूषणाचा एक प्रकार आहे?",
    },
    options: [
      {
        en: "Air pollution",
        hi: "वायु प्रदूषण",
        mr: "वायू प्रदूषण",
      },
      {
        en: "Election pollution",
        hi: "चुनाव प्रदूषण",
        mr: "निवडणूक प्रदूषण",
      },
      {
        en: "Constitution pollution",
        hi: "संविधान प्रदूषण",
        mr: "राज्यघटना प्रदूषण",
      },
      {
        en: "Currency pollution",
        hi: "मुद्रा प्रदूषण",
        mr: "चलन प्रदूषण",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What does biodiversity refer to?",
      hi: "जैव विविधता का क्या अर्थ है?",
      mr: "जैवविविधता म्हणजे काय?",
    },
    options: [
      {
        en: "Only forests",
        hi: "केवल वन",
        mr: "फक्त जंगले",
      },
      {
        en: "The variety of living organisms and ecosystems",
        hi: "जीवित प्राणियों और पारिस्थितिक तंत्रों की विविधता",
        mr: "विविध सजीव आणि परिसंस्थांची विविधता",
      },
      {
        en: "Only wild animals",
        hi: "केवल जंगली जानवर",
        mr: "फक्त वन्य प्राणी",
      },
      {
        en: "Only agricultural crops",
        hi: "केवल कृषि फसलें",
        mr: "फक्त कृषी पिके",
      },
    ],
    answer: 1,
  },
  {
    question: {
      en: "Which organisation is responsible for important national pollution-control functions?",
      hi: "महत्वपूर्ण राष्ट्रीय प्रदूषण-नियंत्रण कार्यों के लिए कौन-सा संगठन जिम्मेदार है?",
      mr: "महत्त्वाच्या राष्ट्रीय प्रदूषण नियंत्रण कार्यांसाठी कोणती संस्था जबाबदार आहे?",
    },
    options: [
      {
        en: "Central Pollution Control Board",
        hi: "केंद्रीय प्रदूषण नियंत्रण बोर्ड",
        mr: "केंद्रीय प्रदूषण नियंत्रण मंडळ",
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
      {
        en: "Union Public Service Commission",
        hi: "संघ लोक सेवा आयोग",
        mr: "संघ लोकसेवा आयोग",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which is a useful waste-management practice?",
      hi: "कचरा प्रबंधन की उपयोगी पद्धति कौन-सी है?",
      mr: "कचरा व्यवस्थापनाची उपयुक्त पद्धत कोणती?",
    },
    options: [
      {
        en: "Mixing all waste together",
        hi: "सभी कचरे को एक साथ मिलाना",
        mr: "सर्व कचरा एकत्र मिसळणे",
      },
      {
        en: "Throwing waste into rivers",
        hi: "कचरे को नदियों में फेंकना",
        mr: "कचरा नद्यांमध्ये टाकणे",
      },
      {
        en: "Following local waste-segregation systems",
        hi: "स्थानीय कचरा-अलगाव व्यवस्था का पालन करना",
        mr: "स्थानिक कचरा वर्गीकरण पद्धतीचे पालन करणे",
      },
      {
        en: "Burning all household waste",
        hi: "सभी घरेलू कचरे को जलाना",
        mr: "सर्व घरगुती कचरा जाळणे",
      },
    ],
    answer: 2,
  },
  {
    question: {
      en: "What can citizens do about a local environmental problem?",
      hi: "स्थानीय पर्यावरणीय समस्या के बारे में नागरिक क्या कर सकते हैं?",
      mr: "स्थानिक पर्यावरणीय समस्येबाबत नागरिक काय करू शकतात?",
    },
    options: [
      {
        en: "Ignore it",
        hi: "उसे अनदेखा करें",
        mr: "दुर्लक्ष करा",
      },
      {
        en: "Report it through an appropriate official mechanism",
        hi: "उचित आधिकारिक व्यवस्था के माध्यम से इसकी शिकायत करें",
        mr: "योग्य अधिकृत यंत्रणेद्वारे त्याची तक्रार करा",
      },
      {
        en: "Wait for a national election",
        hi: "राष्ट्रीय चुनाव की प्रतीक्षा करें",
        mr: "राष्ट्रीय निवडणुकीची वाट पाहा",
      },
      {
        en: "Contact a foreign government",
        hi: "किसी विदेशी सरकार से संपर्क करें",
        mr: "परदेशी सरकारशी संपर्क करा",
      },
    ],
    answer: 1,
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
    civicPerspectiveTitle: string;
    civicPerspectiveText: string;

    section2Label: string;
    section2Title: string;
    section2Text: string;

    section3Label: string;
    section3Title: string;
    section3Text: string;
    solidWasteTitle: string;
    solidWasteText: string;
    plasticWasteTitle: string;
    plasticWasteText: string;
    eWasteTitle: string;
    eWasteText: string;
    hazardousWasteTitle: string;
    hazardousWasteText: string;
    rememberTitle: string;
    rememberText: string;

    section4Label: string;
    section4Title: string;
    section4Text: string;

    section5Label: string;
    section5Title: string;
    section5Text: string;
    energyTitle: string;
    energyText: string;
    waterTitle: string;
    waterText: string;
    ecosystemsTitle: string;
    ecosystemsText: string;

    section6Label: string;
    section6Title: string;
    section6Text: string;
    moefccTitle: string;
    moefccText: string;
    cpcbTitle: string;
    cpcbText: string;
    stateInstitutionsTitle: string;
    stateInstitutionsText: string;

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
    subtitle: "Environment",
    back: "Explore",
    heroLabel: "CIVIC BASICS · 05",
    heroTitle: "Environment",
    heroText:
      "Understand pollution, biodiversity, forests, waste management and the role of government and citizens in protecting the environment.",

    section1Label: "01 · UNDERSTANDING THE ENVIRONMENT",
    section1Title: "Why does the environment matter?",
    section1Text:
      "The environment includes the natural systems and resources that support life. Air, water, forests, wildlife, biodiversity and ecosystems are connected to human well-being and economic activity.",
    civicPerspectiveTitle: "A civic perspective",
    civicPerspectiveText:
      "Environmental issues are not only scientific or ecological issues. They can also involve public administration, laws, infrastructure, public health and citizen participation.",

    section2Label: "02 · POLLUTION",
    section2Title: "Different forms of pollution",
    section2Text:
      "Pollution can affect air, water and land and may arise from different human activities. Pollution-control institutions monitor and work on prevention and control of pollution.",

    section3Label: "03 · WASTE MANAGEMENT",
    section3Title: "What happens to the waste we produce?",
    section3Text:
      "Waste management involves activities such as collection, transportation, processing, treatment and disposal. Different categories of waste can require different management systems.",
    solidWasteTitle: "Solid Waste",
    solidWasteText:
      "Household and municipal waste needs appropriate collection, processing and disposal.",
    plasticWasteTitle: "Plastic Waste",
    plasticWasteText:
      "Plastic waste requires appropriate collection, processing, recycling or disposal according to applicable systems.",
    eWasteTitle: "E-Waste",
    eWasteText:
      "Discarded electronic products require specialised handling and recycling systems.",
    hazardousWasteTitle: "Hazardous Waste",
    hazardousWasteText:
      "Some wastes can pose environmental or health risks and require specialised management.",
    rememberTitle: "Remember",
    rememberText:
      "The exact waste-collection and segregation system can differ between cities and local authorities. Follow the system applicable in your area.",

    section4Label: "04 · FORESTS & BIODIVERSITY",
    section4Title: "Protecting natural ecosystems",
    section4Text:
      "Forests, wildlife and biodiversity are important parts of India's natural environment. The Ministry of Environment, Forest and Climate Change oversees national policy areas involving conservation of natural resources, biodiversity, forests and wildlife.",

    section5Label: "05 · CLIMATE & SUSTAINABILITY",
    section5Title: "Thinking about the long term",
    section5Text:
      "Climate change and environmental protection involve long-term questions about energy, natural resources, ecosystems, infrastructure and development. Sustainable development seeks to balance environmental considerations with social and economic needs.",
    energyTitle: "Energy",
    energyText:
      "How energy is produced and consumed can affect emissions, resources and the environment.",
    waterTitle: "Water",
    waterText:
      "Efficient use and protection of water resources are important parts of environmental sustainability.",
    ecosystemsTitle: "Ecosystems",
    ecosystemsText:
      "Healthy ecosystems support biodiversity and provide important ecological functions.",

    section6Label: "06 · ENVIRONMENTAL GOVERNANCE",
    section6Title: "Who works on environmental protection?",
    section6Text:
      "Environmental governance involves multiple institutions and levels of government. At the Union level, the Ministry of Environment, Forest and Climate Change is the nodal ministry for several environment, forest and wildlife policy areas. The Central Pollution Control Board has important functions relating to prevention and control of air and water pollution and works with State Pollution Control Boards.",
    moefccTitle: "MoEFCC",
    moefccText:
      "The Union ministry overseeing major policy and programme areas involving environment, forests, wildlife and biodiversity.",
    cpcbTitle: "CPCB",
    cpcbText:
      "The Central Pollution Control Board works on pollution prevention, control, monitoring and related environmental programmes.",
    stateInstitutionsTitle: "State Institutions",
    stateInstitutionsText:
      "State-level environmental departments and Pollution Control Boards have important responsibilities under applicable laws and programmes.",

    section7Label: "07 · CITIZEN ACTION",
    section7Title: "What can citizens do?",
    section7Text:
      "Environmental protection is also connected to everyday choices and civic participation. Citizens can reduce waste, conserve resources, follow local waste-management systems and report environmental problems through appropriate official channels.",

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
    subtitle: "पर्यावरण",
    back: "एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 05",
    heroTitle: "पर्यावरण",
    heroText:
      "प्रदूषण, जैव विविधता, वन, कचरा प्रबंधन तथा पर्यावरण की रक्षा में सरकार और नागरिकों की भूमिका को समझें।",

    section1Label: "01 · पर्यावरण को समझना",
    section1Title: "पर्यावरण क्यों महत्वपूर्ण है?",
    section1Text:
      "पर्यावरण में वे प्राकृतिक प्रणालियाँ और संसाधन शामिल हैं जो जीवन को सहारा देते हैं। वायु, जल, वन, वन्यजीव, जैव विविधता और पारिस्थितिक तंत्र मानव कल्याण और आर्थिक गतिविधियों से जुड़े हुए हैं।",
    civicPerspectiveTitle: "नागरिक दृष्टिकोण",
    civicPerspectiveText:
      "पर्यावरणीय मुद्दे केवल वैज्ञानिक या पारिस्थितिक मुद्दे नहीं हैं। इनमें सार्वजनिक प्रशासन, कानून, बुनियादी ढाँचा, सार्वजनिक स्वास्थ्य और नागरिक भागीदारी भी शामिल हो सकती है।",

    section2Label: "02 · प्रदूषण",
    section2Title: "प्रदूषण के विभिन्न रूप",
    section2Text:
      "प्रदूषण वायु, जल और भूमि को प्रभावित कर सकता है और विभिन्न मानवीय गतिविधियों से उत्पन्न हो सकता है। प्रदूषण-नियंत्रण संस्थाएँ प्रदूषण की निगरानी, रोकथाम और नियंत्रण पर काम करती हैं।",

    section3Label: "03 · कचरा प्रबंधन",
    section3Title: "हमारे द्वारा उत्पन्न कचरे का क्या होता है?",
    section3Text:
      "कचरा प्रबंधन में संग्रह, परिवहन, प्रसंस्करण, उपचार और निपटान जैसी गतिविधियाँ शामिल होती हैं। अलग-अलग प्रकार के कचरे के लिए अलग-अलग प्रबंधन प्रणालियों की आवश्यकता हो सकती है।",
    solidWasteTitle: "ठोस कचरा",
    solidWasteText:
      "घरेलू और नगर निकायों से उत्पन्न कचरे के लिए उचित संग्रह, प्रसंस्करण और निपटान आवश्यक है।",
    plasticWasteTitle: "प्लास्टिक कचरा",
    plasticWasteText:
      "लागू प्रणालियों के अनुसार प्लास्टिक कचरे के लिए उचित संग्रह, प्रसंस्करण, पुनर्चक्रण या निपटान आवश्यक है।",
    eWasteTitle: "ई-कचरा",
    eWasteText:
      "फेंके गए इलेक्ट्रॉनिक उत्पादों के लिए विशेष संभाल और पुनर्चक्रण प्रणालियों की आवश्यकता होती है।",
    hazardousWasteTitle: "खतरनाक कचरा",
    hazardousWasteText:
      "कुछ कचरा पर्यावरण या स्वास्थ्य के लिए जोखिम पैदा कर सकता है और उसके लिए विशेष प्रबंधन आवश्यक होता है।",
    rememberTitle: "याद रखें",
    rememberText:
      "कचरा संग्रह और अलग-अलग करने की सटीक व्यवस्था शहर और स्थानीय प्राधिकरण के अनुसार अलग हो सकती है। अपने क्षेत्र में लागू व्यवस्था का पालन करें।",

    section4Label: "04 · वन और जैव विविधता",
    section4Title: "प्राकृतिक पारिस्थितिक तंत्रों की रक्षा",
    section4Text:
      "वन, वन्यजीव और जैव विविधता भारत के प्राकृतिक पर्यावरण के महत्वपूर्ण हिस्से हैं। पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय प्राकृतिक संसाधनों, जैव विविधता, वन और वन्यजीवों के संरक्षण से जुड़े राष्ट्रीय नीति क्षेत्रों की देखरेख करता है।",

    section5Label: "05 · जलवायु और स्थिरता",
    section5Title: "दीर्घकालिक दृष्टि से सोचना",
    section5Text:
      "जलवायु परिवर्तन और पर्यावरण संरक्षण में ऊर्जा, प्राकृतिक संसाधनों, पारिस्थितिक तंत्रों, बुनियादी ढाँचे और विकास से जुड़े दीर्घकालिक प्रश्न शामिल हैं। सतत विकास पर्यावरणीय विचारों को सामाजिक और आर्थिक आवश्यकताओं के साथ संतुलित करने का प्रयास करता है।",
    energyTitle: "ऊर्जा",
    energyText:
      "ऊर्जा का उत्पादन और उपयोग उत्सर्जन, संसाधनों और पर्यावरण को प्रभावित कर सकता है।",
    waterTitle: "जल",
    waterText:
      "जल संसाधनों का कुशल उपयोग और संरक्षण पर्यावरणीय स्थिरता के महत्वपूर्ण हिस्से हैं।",
    ecosystemsTitle: "पारिस्थितिक तंत्र",
    ecosystemsText:
      "स्वस्थ पारिस्थितिक तंत्र जैव विविधता को सहारा देते हैं और महत्वपूर्ण पारिस्थितिक कार्य करते हैं।",

    section6Label: "06 · पर्यावरणीय शासन",
    section6Title: "पर्यावरण संरक्षण के लिए कौन काम करता है?",
    section6Text:
      "पर्यावरणीय शासन में विभिन्न संस्थाएँ और सरकार के अलग-अलग स्तर शामिल होते हैं। केंद्र स्तर पर पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय कई पर्यावरण, वन और वन्यजीव नीति क्षेत्रों के लिए नोडल मंत्रालय है। केंद्रीय प्रदूषण नियंत्रण बोर्ड के पास वायु और जल प्रदूषण की रोकथाम और नियंत्रण से जुड़े महत्वपूर्ण कार्य हैं और यह राज्य प्रदूषण नियंत्रण बोर्डों के साथ काम करता है।",
    moefccTitle: "MoEFCC",
    moefccText:
      "पर्यावरण, वन, वन्यजीव और जैव विविधता से जुड़े प्रमुख नीति और कार्यक्रम क्षेत्रों की देखरेख करने वाला केंद्रीय मंत्रालय।",
    cpcbTitle: "CPCB",
    cpcbText:
      "केंद्रीय प्रदूषण नियंत्रण बोर्ड प्रदूषण की रोकथाम, नियंत्रण, निगरानी और संबंधित पर्यावरणीय कार्यक्रमों पर कार्य करता है।",
    stateInstitutionsTitle: "राज्य संस्थाएँ",
    stateInstitutionsText:
      "राज्य स्तर के पर्यावरण विभाग और प्रदूषण नियंत्रण बोर्ड लागू कानूनों और कार्यक्रमों के तहत महत्वपूर्ण जिम्मेदारियाँ निभाते हैं।",

    section7Label: "07 · नागरिक कार्रवाई",
    section7Title: "नागरिक क्या कर सकते हैं?",
    section7Text:
      "पर्यावरण संरक्षण रोजमर्रा के विकल्पों और नागरिक भागीदारी से भी जुड़ा है। नागरिक कचरा कम कर सकते हैं, संसाधनों का संरक्षण कर सकते हैं, स्थानीय कचरा प्रबंधन व्यवस्था का पालन कर सकते हैं और उचित आधिकारिक माध्यमों से पर्यावरणीय समस्याओं की शिकायत कर सकते हैं।",

    quizLabel: "08 · त्वरित क्विज़",
    quizTitle: "आपने क्या सीखा, जाँचें",
    quizText:
      "इस KrutBharat को पूरा करने के लिए पाँच प्रश्नों के उत्तर दें।",
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
    subtitle: "पर्यावरण",
    back: "एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 05",
    heroTitle: "पर्यावरण",
    heroText:
      "प्रदूषण, जैवविविधता, जंगले, कचरा व्यवस्थापन आणि पर्यावरणाच्या संरक्षणात सरकार व नागरिकांची भूमिका समजून घ्या.",

    section1Label: "01 · पर्यावरण समजून घेणे",
    section1Title: "पर्यावरण महत्त्वाचे का आहे?",
    section1Text:
      "पर्यावरणामध्ये जीवनाला आधार देणाऱ्या नैसर्गिक व्यवस्था आणि संसाधनांचा समावेश होतो. हवा, पाणी, जंगले, वन्यजीव, जैवविविधता आणि परिसंस्था यांचा मानवी कल्याण आणि आर्थिक क्रियाकलापांशी संबंध आहे.",
    civicPerspectiveTitle: "नागरी दृष्टिकोन",
    civicPerspectiveText:
      "पर्यावरणीय समस्या या केवळ वैज्ञानिक किंवा पर्यावरणशास्त्रीय समस्या नाहीत. त्यामध्ये सार्वजनिक प्रशासन, कायदे, पायाभूत सुविधा, सार्वजनिक आरोग्य आणि नागरिकांचा सहभाग यांचाही संबंध असू शकतो.",

    section2Label: "02 · प्रदूषण",
    section2Title: "प्रदूषणाचे विविध प्रकार",
    section2Text:
      "प्रदूषणाचा परिणाम हवा, पाणी आणि जमीन यांच्यावर होऊ शकतो आणि ते विविध मानवी क्रियांमुळे निर्माण होऊ शकते. प्रदूषण नियंत्रण संस्था प्रदूषणाच्या प्रतिबंध आणि नियंत्रणासाठी देखरेख व कार्य करतात.",

    section3Label: "03 · कचरा व्यवस्थापन",
    section3Title: "आपण निर्माण केलेल्या कचऱ्याचे काय होते?",
    section3Text:
      "कचरा व्यवस्थापनामध्ये संकलन, वाहतूक, प्रक्रिया, उपचार आणि विल्हेवाट यांसारख्या क्रियांचा समावेश होतो. वेगवेगळ्या प्रकारच्या कचऱ्यासाठी वेगवेगळ्या व्यवस्थापन पद्धतींची आवश्यकता असू शकते.",
    solidWasteTitle: "घनकचरा",
    solidWasteText:
      "घरगुती आणि नगरपालिका कचऱ्यासाठी योग्य संकलन, प्रक्रिया आणि विल्हेवाट आवश्यक असते.",
    plasticWasteTitle: "प्लास्टिक कचरा",
    plasticWasteText:
      "लागू व्यवस्थेनुसार प्लास्टिक कचऱ्यासाठी योग्य संकलन, प्रक्रिया, पुनर्वापर किंवा विल्हेवाट आवश्यक असते.",
    eWasteTitle: "ई-कचरा",
    eWasteText:
      "टाकून दिलेल्या इलेक्ट्रॉनिक उत्पादनांसाठी विशेष हाताळणी आणि पुनर्वापर प्रणाली आवश्यक असतात.",
    hazardousWasteTitle: "धोकादायक कचरा",
    hazardousWasteText:
      "काही कचऱ्यामुळे पर्यावरण किंवा आरोग्याला धोका निर्माण होऊ शकतो आणि त्यासाठी विशेष व्यवस्थापन आवश्यक असते.",
    rememberTitle: "लक्षात ठेवा",
    rememberText:
      "कचरा संकलन आणि वर्गीकरणाची अचूक पद्धत शहर आणि स्थानिक प्राधिकरणानुसार बदलू शकते. तुमच्या भागात लागू असलेल्या पद्धतीचे पालन करा.",

    section4Label: "04 · जंगले आणि जैवविविधता",
    section4Title: "नैसर्गिक परिसंस्थांचे संरक्षण",
    section4Text:
      "जंगले, वन्यजीव आणि जैवविविधता हे भारताच्या नैसर्गिक पर्यावरणाचे महत्त्वाचे भाग आहेत. पर्यावरण, वन आणि हवामान बदल मंत्रालय नैसर्गिक संसाधने, जैवविविधता, जंगले आणि वन्यजीव यांच्या संवर्धनाशी संबंधित राष्ट्रीय धोरण क्षेत्रांवर देखरेख करते.",

    section5Label: "05 · हवामान आणि शाश्वतता",
    section5Title: "दीर्घकालीन विचार",
    section5Text:
      "हवामान बदल आणि पर्यावरण संरक्षणामध्ये ऊर्जा, नैसर्गिक संसाधने, परिसंस्था, पायाभूत सुविधा आणि विकासाशी संबंधित दीर्घकालीन प्रश्नांचा समावेश होतो. शाश्वत विकासामध्ये पर्यावरणीय बाबी सामाजिक आणि आर्थिक गरजांशी संतुलित करण्याचा प्रयत्न केला जातो.",
    energyTitle: "ऊर्जा",
    energyText:
      "ऊर्जेचे उत्पादन आणि वापर यांचा उत्सर्जन, संसाधने आणि पर्यावरणावर परिणाम होऊ शकतो.",
    waterTitle: "पाणी",
    waterText:
      "जलसंसाधनांचा कार्यक्षम वापर आणि संरक्षण हे पर्यावरणीय शाश्वततेचे महत्त्वाचे भाग आहेत.",
    ecosystemsTitle: "परिसंस्था",
    ecosystemsText:
      "निरोगी परिसंस्था जैवविविधतेला आधार देतात आणि महत्त्वाची पर्यावरणीय कार्ये पार पाडतात.",

    section6Label: "06 · पर्यावरणीय प्रशासन",
    section6Title: "पर्यावरण संरक्षणासाठी कोण काम करते?",
    section6Text:
      "पर्यावरणीय प्रशासनामध्ये अनेक संस्था आणि सरकारच्या विविध पातळ्यांचा सहभाग असतो. केंद्र स्तरावर पर्यावरण, वन आणि हवामान बदल मंत्रालय हे अनेक पर्यावरण, वन आणि वन्यजीव धोरण क्षेत्रांसाठी नोडल मंत्रालय आहे. केंद्रीय प्रदूषण नियंत्रण मंडळाकडे हवा आणि पाणी प्रदूषणाच्या प्रतिबंध आणि नियंत्रणाशी संबंधित महत्त्वाची कार्ये आहेत आणि ते राज्य प्रदूषण नियंत्रण मंडळांसोबत काम करते.",
    moefccTitle: "MoEFCC",
    moefccText:
      "पर्यावरण, जंगले, वन्यजीव आणि जैवविविधता यांच्याशी संबंधित प्रमुख धोरण व कार्यक्रम क्षेत्रांवर देखरेख करणारे केंद्रीय मंत्रालय.",
    cpcbTitle: "CPCB",
    cpcbText:
      "केंद्रीय प्रदूषण नियंत्रण मंडळ प्रदूषण प्रतिबंध, नियंत्रण, देखरेख आणि संबंधित पर्यावरणीय कार्यक्रमांवर कार्य करते.",
    stateInstitutionsTitle: "राज्य संस्था",
    stateInstitutionsText:
      "राज्यस्तरीय पर्यावरण विभाग आणि प्रदूषण नियंत्रण मंडळे लागू कायदे आणि कार्यक्रमांनुसार महत्त्वाच्या जबाबदाऱ्या पार पाडतात.",

    section7Label: "07 · नागरिकांची कृती",
    section7Title: "नागरिक काय करू शकतात?",
    section7Text:
      "पर्यावरण संरक्षणाचा संबंध दैनंदिन निर्णय आणि नागरिकांच्या सहभागाशीही आहे. नागरिक कचरा कमी करू शकतात, संसाधनांची बचत करू शकतात, स्थानिक कचरा व्यवस्थापन पद्धतीचे पालन करू शकतात आणि योग्य अधिकृत माध्यमांद्वारे पर्यावरणीय समस्यांची तक्रार करू शकतात.",

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

export default function EnvironmentPage() {
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
            topic: "environment",
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
    <main className="kf-explore-page kf-environment-page"
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
                color: "#fff",
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
                EXPLORE & LEARN
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
              className="kf-explore-language-select"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label={
                language === "en" ? "Language" : "भाषा"
              }
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
          className="kf-explore-hero"
          style={{
            marginBottom: "16px",
          }}
        >
          <SectionLabel text={t.heroLabel} />

          <div
            className="kf-environment-hero-row"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <div className="kf-explore-hero-copy">
              <h1
                style={{
                  fontSize: "68px",
                  lineHeight: "1.02",
                  fontWeight: "800",
                  letterSpacing: "-.045em",
                  margin: "0 0 20px",
                  maxWidth: "950px",
                  fontFamily: "var(--font-display)",
                }}
              >
                {t.heroTitle}
              </h1>

              <p
                style={{
                  color: "#667780",
                  fontSize: "19px",
                  lineHeight: "1.7",
                  maxWidth: "900px",
                  margin: 0,
                }}
              >
                {t.heroText}
              </p>
            </div>

            <div
              className="kf-environment-topic-badge"
              style={{
                minWidth: "250px",
                padding: "18px 22px",
                border: "1px solid #eedbc6",
                borderRadius: "28px",
                background: "#fff2e4",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 8px 24px rgba(16,27,43,.035)",
              }}
            >
              <div
                className="kf-explore-topic-badge-icon"
                style={{
                  width: "56px",
                  height: "56px",
                  flex: "0 0 56px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "18px",
                  background: "#fffdf9",
                  border: "1px solid #eadfd2",
                  fontSize: "27px",
                }}
              >
                📄
              </div>

              <div>
                <div
                  style={{
                    color: "#34485b",
                    fontFamily: "var(--font-display)",
                    fontSize: "21px",
                    lineHeight: "1.15",
                    fontWeight: "800",
                  }}
                >
                  {language === "en"
                    ? "Civic knowledge"
                    : language === "hi"
                      ? "नागरिक ज्ञान"
                      : "नागरी ज्ञान"}
                </div>

                <div
                  style={{
                    marginTop: "7px",
                    color: "#8b7969",
                    fontSize: "12px",
                    lineHeight: "1.2",
                    fontWeight: "700",
                  }}
                >
                  {t.heroTitle}
                </div>
              </div>
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
            className="kf-environment-callout"
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
              {t.civicPerspectiveTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.civicPerspectiveText}
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
            {pollutionTypes.map((pollution, index) => (
              <SimpleCard
                key={`${pollution.icon}-${index}`}
                icon={pollution.icon}
                title={pollution.title[language]}
                text={pollution.text[language]}
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
            className="kf-environment-waste-card-grid"
            data-environment-grid="waste"
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <SimpleCard
              icon="🗑️"
              title={t.solidWasteTitle}
              text={t.solidWasteText}
            />

            <SimpleCard
              icon="♻️"
              title={t.plasticWasteTitle}
              text={t.plasticWasteText}
            />

            <SimpleCard
              icon="💻"
              title={t.eWasteTitle}
              text={t.eWasteText}
            />

            <SimpleCard
              icon="☣️"
              title={t.hazardousWasteTitle}
              text={t.hazardousWasteText}
            />
          </div>

          <div
            className="kf-environment-callout"
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
              {t.rememberTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.rememberText}
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
            {environmentalAreas.map((area, index) => (
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
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <SimpleCard
              icon="⚡"
              title={t.energyTitle}
              text={t.energyText}
            />

            <SimpleCard
              icon="💧"
              title={t.waterTitle}
              text={t.waterText}
            />

            <SimpleCard
              icon="🌱"
              title={t.ecosystemsTitle}
              text={t.ecosystemsText}
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
            {t.section6Text}
          </p>

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
              icon="🏛️"
              title={t.moefccTitle}
              text={t.moefccText}
            />

            <SimpleCard
              icon="🌫️"
              title={t.cpcbTitle}
              text={t.cpcbText}
            />

            <SimpleCard
              icon="🏢"
              title={t.stateInstitutionsTitle}
              text={t.stateInstitutionsText}
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
              display: "grid",
              gap: "12px",
            }}
          >
            {citizenActions.map((action) => (
              <div
                key={action.number}
                className="kf-environment-action-card"
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
                  className="kf-environment-action-number"
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
                  const isSelected = selectedAnswer === index;
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
                      key={`${index}-${option.en}`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className="kf-quiz-answer"
                      data-quiz-state={
                        selectedAnswer === null
                          ? "default"
                          : isSelected && !isCorrect
                          ? "wrong"
                          : isCorrect
                          ? "correct"
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
                  onClick={nextQuestion}
                  disabled={savingProgress}
                  className="kf-quiz-next"
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
                className="kf-quiz-restart"
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

          .kf-simple-card { background:#fffdf9 !important; border:1px solid rgba(16,27,43,.08) !important; border-radius:22px !important; box-shadow:0 8px 24px rgba(16,27,43,.035) !important; }
          .kf-simple-card h3 { color:var(--kf-ink) !important; }
          .kf-simple-card p { color:var(--kf-body) !important; }

          .kf-explore-page header {
            margin-bottom: 16px !important;
            padding: 12px 14px !important;
            border: 1px solid var(--kf-line) !important;
            border-radius: 25px !important;
            background: rgba(255,253,249,.96) !important;
            box-shadow: 0 14px 36px rgba(16,27,43,.055) !important;
            backdrop-filter: blur(16px);
          }

          .kf-explore-page header div {
            color: var(--kf-navy) !important;
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
          .kf-explore-page > div > section:nth-of-type(9) { background: var(--kf-green) !important; border-color: var(--kf-green-line) !important; }

          .kf-explore-page h1,
          .kf-explore-page h2,
          .kf-explore-page h3 {
            color: var(--kf-ink) !important;
            font-family: var(--font-display) !important;
          }

          .kf-explore-page p,
          .kf-explore-page li {
            color: var(--kf-body) !important;
          }

          .kf-explore-page [style*="background"] {
            box-shadow: 0 9px 22px rgba(16,27,43,.035) !important;
          }

          .kf-explore-page > div > section:nth-of-type(2) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(4) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(5) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(6) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(8) [style*="background"],
          .kf-explore-page > div > section:nth-of-type(9) [style*="background"] {
            background: rgba(255,253,249,.80) !important;
            border: 1px solid rgba(16,27,43,.075) !important;
            border-radius: 22px !important;
          }

          .kf-explore-page > div > section:nth-of-type(3) > div:last-child,
          .kf-explore-page > div > section:nth-of-type(7) > div:last-child {
            background: rgba(255,253,249,.80) !important;
            border: 1px solid rgba(16,27,43,.075) !important;
            border-radius: 23px !important;
          }

          .kf-explore-page > div > section:nth-of-type(1) [style*="color: #ff7a00"],
          .kf-explore-page [style*="color: #ff7a00"] {
            color: #9c6b42 !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) {
            position: relative !important;
            overflow: hidden !important;
            padding: 30px !important;
            background:
              radial-gradient(circle at 94% 0%, rgba(218,235,244,.95) 0%, rgba(218,235,244,0) 34%),
              radial-gradient(circle at 0% 100%, rgba(255,232,210,.88) 0%, rgba(255,232,210,0) 34%),
              rgba(255,253,249,.98) !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) button {
            border-radius: 19px !important;
          }

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

          .kf-explore-page > div > div:last-child {
            color: #89939a !important;
            text-align: center !important;
          }

          @media (max-width: 900px) {
            .kf-explore-page > div > section { padding: 22px !important; }
          }

          @media (max-width: 680px) {
            .kf-explore-page { padding: 12px 10px 44px !important; }
            .kf-explore-page > div > section { padding: 20px !important; border-radius: 24px !important; }
            .kf-explore-page header { padding: 11px 12px !important; }
          }

          .kf-explore-page > div > section:nth-of-type(8) { background: var(--kf-lavender) !important; border-color: var(--kf-lavender-line) !important; }

          .kf-explore-page > div > section:nth-of-type(9) {
            position: relative !important;
            overflow: hidden !important;
            padding: 30px !important;
            background:
              radial-gradient(circle at 94% 0%, rgba(218,235,244,.95) 0%, rgba(218,235,244,0) 34%),
              radial-gradient(circle at 0% 100%, rgba(255,232,210,.88) 0%, rgba(255,232,210,0) 34%),
              rgba(255,253,249,.98) !important;
            border: 1px solid var(--kf-line) !important;
            border-radius: 31px !important;
            box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
          }

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

          /* Constitution-style branding and hero */
          .kf-explore-page .kf-environment-hero-row h1 {
            color: var(--kf-ink) !important;
            font-family: var(--font-display) !important;
          }

          .kf-explore-page header .kf-explore-brand-box {
            color: #ffffff !important;
            -webkit-text-fill-color: #ffffff !important;
          }

          .kf-explore-page .kf-environment-topic-badge {
            align-self: center;
          }

          /* Soften the older dark editorial blocks into the Constitution-style
             ivory/pastel card system. */
          .kf-explore-page > div > section:nth-of-type(2) [style*="background: #0f172a"],
          .kf-explore-page > div > section:nth-of-type(4) [style*="background: #0f172a"],
          .kf-explore-page > div > section:nth-of-type(8) [style*="background: #0f172a"],
          .kf-explore-page > div > section:nth-of-type(4) [style*="linear-gradient(135deg, #0f172a"],
          .kf-explore-page > div > section:nth-of-type(9) [style*="background: #020617"] {
            background: rgba(255,253,249,.84) !important;
            border-color: rgba(16,27,43,.075) !important;
            color: var(--kf-ink) !important;
            box-shadow: 0 9px 22px rgba(16,27,43,.035) !important;
          }

          .kf-explore-page > div > section:nth-of-type(2) [style*="background: #0f172a"] p,
          .kf-explore-page > div > section:nth-of-type(4) [style*="background: #0f172a"] p,
          .kf-explore-page > div > section:nth-of-type(8) [style*="background: #0f172a"] p {
            color: var(--kf-body) !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) [style*="background: #020617"] {
            color: var(--kf-ink) !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) [style*="background: #020617"]:hover {
            background: #fffdf9 !important;
          }

          @media (max-width: 900px) {
            .kf-explore-page .kf-environment-hero-row {
              grid-template-columns: 1fr !important;
            }

            .kf-explore-page .kf-environment-topic-badge {
              width: fit-content;
              min-width: 0 !important;
            }

            .kf-explore-page .kf-environment-hero-row h1 {
              font-size: 58px !important;
            }
          }

          @media (max-width: 680px) {
            .kf-explore-page .kf-environment-hero-row h1 {
              font-size: 46px !important;
            }

            .kf-explore-page .kf-environment-topic-badge {
              width: 100%;
            }
          }


          /* =========================================================
             ENVIRONMENT — FINAL DARK THEME
             Mirrors the Local Issues visual system.
             Scoped so it cannot affect other Explore pages.
             ========================================================= */

          html[data-theme="dark"] .kf-environment-page {
            background:
              radial-gradient(circle at 90% 0%, rgba(57,118,177,.16), transparent 28%),
              radial-gradient(circle at 6% 78%, rgba(255,122,26,.055), transparent 23%),
              linear-gradient(180deg, #07111f 0%, #091625 52%, #07111f 100%) !important;
            color: #f5f7fb !important;
            padding: 32px 5% 70px !important;
          }

          html[data-theme="dark"] .kf-environment-page > div {
            background: transparent !important;
          }

          /* ---------- NAVBAR ---------- */
          html[data-theme="dark"] .kf-environment-page .kf-explore-topbar {
            position: sticky !important;
            top: 12px !important;
            z-index: 999 !important;
            margin-bottom: 28px !important;
            padding: 10px 14px !important;
            border: 1px solid transparent !important;
            border-radius: 24px !important;
            background: rgba(4,10,20,.62) !important;
            background-image: none !important;
            box-shadow:
              -10px 0 24px -8px rgba(0,212,255,.46),
               10px 0 24px -8px rgba(255,140,26,.46),
               0 10px 30px rgba(0,0,0,.34) !important;
            backdrop-filter: blur(14px) saturate(125%) !important;
            -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
            isolation: isolate !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topbar::before {
            content: "" !important;
            position: absolute !important;
            inset: 0 !important;
            border-radius: inherit !important;
            padding: 1.25px !important;
            background: linear-gradient(
              90deg,
              #00d4ff 0%,
              rgba(0,174,255,.72) 16%,
              rgba(90,120,150,.28) 43%,
              rgba(120,120,130,.22) 57%,
              rgba(255,150,40,.72) 84%,
              #ff8c1a 100%
            ) !important;
            -webkit-mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0) !important;
            mask:
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0) !important;
            -webkit-mask-composite: xor !important;
            mask-composite: exclude !important;
            pointer-events: none !important;
            z-index: 0 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topbar::after {
            content: "" !important;
            position: absolute !important;
            inset: -5px !important;
            border-radius: 29px !important;
            background: linear-gradient(
              90deg,
              #00d4ff 0%,
              rgba(0,150,255,.48) 18%,
              transparent 36%,
              transparent 64%,
              rgba(255,140,26,.52) 82%,
              #ff8c1a 100%
            ) !important;
            filter: blur(12px) !important;
            opacity: .52 !important;
            pointer-events: none !important;
            z-index: -1 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topbar > * {
            position: relative !important;
            z-index: 2 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-back {
            min-height: 40px !important;
            background: rgba(7,16,28,.58) !important;
            color: #e8f0f7 !important;
            border-color: rgba(137,169,202,.18) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-back span {
            color: #ff8b32 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-brand-name {
            color: #f7f9fc !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-brand-name span {
            color: #ff7a00 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-brand-caption {
            color: #7f97ad !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-brand-box {
            background: #ff7a00 !important;
            color: #ffffff !important;
            box-shadow: 0 8px 22px rgba(255,122,0,.24) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-language {
            color: #9fb1c3 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-language-select,
          html[data-theme="dark"] .kf-environment-page .kf-explore-language select {
            min-width: 112px !important;
            padding: 9px 13px !important;
            background: rgba(7,16,28,.58) !important;
            color: #e8f0f7 !important;
            border-color: rgba(137,169,202,.18) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-language select option {
            background: #10243a !important;
            color: #f5f7fb !important;
          }

          /* ---------- HERO ---------- */
          html[data-theme="dark"] .kf-environment-page .kf-explore-hero {
            margin-bottom: 16px !important;
            background:
              radial-gradient(circle at 94% 0%, rgba(58,116,167,.25) 0%, rgba(58,116,167,0) 34%),
              radial-gradient(circle at 0% 100%, rgba(181,119,57,.16) 0%, rgba(181,119,57,0) 34%),
              linear-gradient(145deg, #10263c 0%, #0d2034 54%, #091827 100%) !important;
            border: 1px solid rgba(102,156,202,.22) !important;
            border-radius: 31px !important;
            box-shadow:
              0 20px 50px rgba(0,0,0,.24),
              inset 0 1px 0 rgba(255,255,255,.035) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-hero-row h1,
          html[data-theme="dark"] .kf-environment-page .kf-explore-hero-copy h1 {
            color: #f7f9fc !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-hero p,
          html[data-theme="dark"] .kf-environment-page .kf-explore-hero-copy p {
            color: #aebed0 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-eyebrow {
            color: #ff8b32 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topic-badge {
            min-width: 255px !important;
            background: linear-gradient(145deg, rgba(7,18,31,.78), rgba(16,37,58,.72)) !important;
            border-color: rgba(104,159,208,.21) !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topic-badge-icon {
            background: rgba(255,255,255,.06) !important;
            border-color: rgba(135,169,198,.16) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topic-badge div {
            color: #f5f7fb !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-explore-topic-badge div:last-child > div:last-child {
            color: #8ea6ba !important;
          }

          /* ---------- DARK SECTIONS / WRAPPERS ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(n+2) {
            background: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section > div[style*="display: grid"] {
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
          }

          html[data-theme="dark"] .kf-environment-page h2,
          html[data-theme="dark"] .kf-environment-page h3 {
            color: #f5f7fb !important;
          }

          html[data-theme="dark"] .kf-environment-page p {
            color: #aebfd0 !important;
          }

          /* ---------- CARDS: POLLUTION ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(1),
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(5) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(2),
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(6) {
            background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
            border-color: rgba(255,173,47,.30) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(3) .kf-environment-card:nth-child(4) {
            background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
            border-color: rgba(123,109,255,.30) !important;
          }

          /* ---------- CARDS: WASTE ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-card:nth-child(1) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-card:nth-child(2) {
            background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
            border-color: rgba(255,173,47,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-card:nth-child(4) {
            background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
            border-color: rgba(123,109,255,.30) !important;
          }

          /* ---------- CARDS: FORESTS / BIODIVERSITY ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(5) .kf-environment-card:nth-child(1),
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(5) .kf-environment-card:nth-child(5) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(5) .kf-environment-card:nth-child(2) {
            background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
            border-color: rgba(255,173,47,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(5) .kf-environment-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(5) .kf-environment-card:nth-child(4) {
            background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
            border-color: rgba(123,109,255,.30) !important;
          }

          /* ---------- CARDS: CLIMATE ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(6) .kf-environment-card:nth-child(1) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(6) .kf-environment-card:nth-child(2) {
            background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
            border-color: rgba(255,173,47,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(6) .kf-environment-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }

          /* ---------- CARDS: ENVIRONMENTAL GOVERNANCE ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(7) .kf-environment-card:nth-child(1) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(7) .kf-environment-card:nth-child(2) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(7) .kf-environment-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
            border-color: rgba(123,109,255,.30) !important;
          }

          /* ---------- CITIZEN ACTION CARDS ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(8) .kf-environment-action-card:nth-child(1),
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(8) .kf-environment-action-card:nth-child(5) {
            background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
            border-color: rgba(24,191,255,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(8) .kf-environment-action-card:nth-child(2) {
            background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
            border-color: rgba(255,173,47,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(8) .kf-environment-action-card:nth-child(3) {
            background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
            border-color: rgba(0,223,192,.30) !important;
          }
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(8) .kf-environment-action-card:nth-child(4) {
            background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
            border-color: rgba(123,109,255,.30) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-card,
          html[data-theme="dark"] .kf-environment-page .kf-environment-action-card {
            position: relative !important;
            overflow: hidden !important;
            color: #f5f8fb !important;
            border-radius: 20px !important;
            box-shadow:
              0 18px 38px rgba(0,0,0,.28),
              inset 0 1px 0 rgba(255,255,255,.045) !important;
            backdrop-filter: blur(12px) saturate(125%) !important;
            -webkit-backdrop-filter: blur(12px) saturate(125%) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-card::before,
          html[data-theme="dark"] .kf-environment-page .kf-environment-action-card::before {
            content: "" !important;
            position: absolute !important;
            width: 180px !important;
            height: 180px !important;
            right: -85px !important;
            top: -105px !important;
            border-radius: 50% !important;
            background: rgba(255,255,255,.035) !important;
            pointer-events: none !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-card > *,
          html[data-theme="dark"] .kf-environment-page .kf-environment-action-card > * {
            position: relative !important;
            z-index: 1 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-card h3,
          html[data-theme="dark"] .kf-environment-page .kf-environment-action-card h3 {
            color: #f7f9fc !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-card p,
          html[data-theme="dark"] .kf-environment-page .kf-environment-action-card p {
            color: #aebfd0 !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-action-number {
            background: rgba(255,140,26,.10) !important;
            color: #ff983f !important;
            border: 1px solid rgba(255,140,26,.28) !important;
          }

          /* ---------- CALLOUTS ---------- */
          html[data-theme="dark"] .kf-environment-page .kf-environment-callout {
            background:
              linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.006)),
              #0b1929 !important;
            border-color: rgba(129,168,199,.18) !important;
            color: #f5f8fb !important;
            box-shadow:
              0 14px 30px rgba(0,0,0,.22),
              inset 0 1px 0 rgba(255,255,255,.04) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-callout h3 {
            color: #f5f8fb !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-environment-callout p {
            color: #aebfd0 !important;
          }

          /* ---------- QUIZ ---------- */
          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(9),
          html[data-theme="dark"] .kf-environment-page .kf-quiz-section {
            background:
              radial-gradient(circle at 94% 0%, rgba(58,116,167,.25), transparent 34%),
              radial-gradient(circle at 0% 100%, rgba(181,119,57,.16), transparent 34%),
              linear-gradient(145deg, #10263c 0%, #0d2034 54%, #091827 100%) !important;
            border: 1px solid rgba(102,156,202,.22) !important;
            border-radius: 24px !important;
            box-shadow:
              0 20px 44px rgba(0,0,0,.30),
              inset 0 1px 0 rgba(255,255,255,.04) !important;
            color: #f5f7fb !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-answer {
            background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
            color: #f7f9fc !important;
            border: 1px solid rgba(146,176,204,.24) !important;
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,.045),
              0 8px 20px rgba(0,0,0,.18) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,.55) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-answer:hover {
            background: linear-gradient(135deg, #0b1a2b 0%, #10223a 100%) !important;
            color: #ffffff !important;
            border-color: rgba(255,255,255,.28) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-answer[data-quiz-state="correct"] {
            background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
            color: #08111b !important;
            border-color: #ffad63 !important;
            text-shadow: none !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-answer[data-quiz-state="wrong"] {
            background: linear-gradient(135deg, #1a1216 0%, #120d12 100%) !important;
            color: #fff4f4 !important;
            border-color: rgba(239,68,68,.72) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-next {
            background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
            color: #111923 !important;
            border: 1px solid rgba(255,176,112,.55) !important;
            box-shadow:
              0 8px 18px rgba(255,122,0,.22),
              0 0 20px rgba(255,122,0,.16) !important;
          }

          html[data-theme="dark"] .kf-environment-page .kf-quiz-restart {
            color: #d6e1ec !important;
            background: transparent !important;
            border-color: rgba(137,169,202,.22) !important;
          }

          /* Light-mode quiz: neutral options, orange action only. */
          html:not([data-theme="dark"]) .kf-environment-page .kf-quiz-answer {
            background: #fffdf9 !important;
            color: #425565 !important;
            border-color: #ded9d1 !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page .kf-quiz-answer[data-quiz-state="correct"] {
            background: rgba(34,197,94,.08) !important;
            color: #425565 !important;
            border-color: #22c55e !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page .kf-quiz-answer[data-quiz-state="wrong"] {
            background: rgba(239,68,68,.08) !important;
            color: #425565 !important;
            border-color: #ef4444 !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page .kf-quiz-next {
            background: var(--kf-orange) !important;
            color: #fff !important;
            border-color: var(--kf-orange) !important;
          }

          @media (max-width: 680px) {
            html[data-theme="dark"] .kf-environment-page {
              padding: 12px 10px 44px !important;
            }

            html[data-theme="dark"] .kf-environment-page .kf-explore-topbar {
              top: 10px !important;
              margin-bottom: 26px !important;
              padding: 9px 11px !important;
              border-radius: 20px !important;
            }

            html[data-theme="dark"] .kf-environment-page .kf-explore-brand-box {
              width: 38px !important;
              height: 38px !important;
              border-radius: 12px !important;
              font-size: 21px !important;
            }

            html[data-theme="dark"] .kf-environment-page .kf-quiz-section {
              border-radius: 20px !important;
            }
          }


          /* FINAL QUIZ SAFETY: answer options are never identified by position. */
          html:not([data-theme="dark"]) .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer {
            background: #fffdf9 !important;
            color: #425565 !important;
            border-color: #ded9d1 !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer[data-quiz-state="correct"] {
            background: rgba(34,197,94,.08) !important;
            color: #425565 !important;
            border-color: #22c55e !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer[data-quiz-state="wrong"] {
            background: rgba(239,68,68,.08) !important;
            color: #425565 !important;
            border-color: #ef4444 !important;
          }

          html:not([data-theme="dark"]) .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-next {
            background: var(--kf-orange) !important;
            color: #fff !important;
            border-color: var(--kf-orange) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer {
            background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
            color: #f7f9fc !important;
            border-color: rgba(146,176,204,.24) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer[data-quiz-state="correct"] {
            background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
            color: #08111b !important;
            border-color: #ffad63 !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-answer[data-quiz-state="wrong"] {
            background: linear-gradient(135deg, #1a1216 0%, #120d12 100%) !important;
            color: #fff4f4 !important;
            border-color: rgba(239,68,68,.72) !important;
          }

          html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(9) .kf-quiz-next {
            background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
            color: #111923 !important;
            border-color: rgba(255,176,112,.55) !important;
          }
  

        /* =========================================================
           ENVIRONMENT — FINAL DARK SURFACE CLEANUP
           1) Remove the stray painted wrapper behind the four waste cards.
           2) Force the Remember/callout panel to use the dark glass surface.
           These selectors intentionally outrank legacy Explore attribute
           selectors such as [style*="background"].
           ========================================================= */

        html[data-theme="dark"] .kf-environment-page .kf-environment-waste-card-grid {
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-callout {
          background:
            linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.006)),
            #0b1929 !important;
          background-color: #0b1929 !important;
          border: 1px solid rgba(129,168,199,.18) !important;
          color: #f5f8fb !important;
          box-shadow:
            0 14px 30px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.04) !important;
          opacity: 1 !important;
          filter: none !important;
        }

        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-callout h3 {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-callout p {
          color: #aebfd0 !important;
        }

        /* Guard against any generic dark Explore rule painting this section's
           descendants because their inline styles contain "background". */
        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-waste-card-grid,
        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-waste-card-grid::before,
        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) .kf-environment-waste-card-grid::after {
          background: transparent !important;
          background-color: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        /* FINAL: the four waste cards are the only painted surfaces inside
           this grid. Remove any inherited rectangle/panel from the wrapper. */
        html[data-theme="dark"] .kf-environment-page > div > section:nth-of-type(4) > .kf-environment-waste-card-grid {
          display: grid !important;
          gap: 18px !important;
          background: none !important;
          background-image: none !important;
          background-color: transparent !important;
          border: none !important;
          border-width: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin-top: 30px !important;
        }

        /* =========================================================
           ENVIRONMENT — ABSOLUTE WASTE GRID WRAPPER RESET
           The wrapper itself must never render a visible rectangle.
           Only the four cards are painted.
           ========================================================= */
        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid,
        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid::before,
        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid::after {
          background: transparent !important;
          background-image: none !important;
          background-color: transparent !important;
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          outline: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          opacity: 1 !important;
          filter: none !important;
        }


        /* FINAL: Civic knowledge badge matches the Local Issues/Elections
           dark-glass treatment instead of the light peach surface. */
        html[data-theme="dark"] .kf-environment-page .kf-environment-topic-badge {
          background: linear-gradient(145deg, rgba(16,38,60,.96), rgba(9,24,39,.96)) !important;
          background-image: linear-gradient(145deg, rgba(16,38,60,.96), rgba(9,24,39,.96)) !important;
          border: 1px solid rgba(102,156,202,.28) !important;
          box-shadow:
            0 18px 38px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.045) !important;
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-environment-page .kf-environment-topic-badge .kf-explore-topic-badge-icon {
          background: rgba(255,255,255,.055) !important;
          border-color: rgba(135,169,198,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-environment-page .kf-environment-topic-badge > div:not(.kf-explore-topic-badge-icon) > div:first-child {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-environment-page .kf-environment-topic-badge > div:not(.kf-explore-topic-badge-icon) > div:last-child {
          color: #9fb1c3 !important;
        }

        /* =========================================================
           ENVIRONMENT — WASTE GRID GAP RESET
           The grid wrapper must contribute no painted surface.
           The inline background/border/box-shadow declarations were
           intentionally removed so legacy [style*="background"] rules
           cannot match this wrapper. Only the four cards are visible.
           ========================================================= */
        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid {
          background: transparent !important;
          background-image: none !important;
          background-color: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin-top: 30px !important;
        }

        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid::before,
        html[data-theme="dark"] main.kf-explore-page.kf-environment-page > div > section:nth-of-type(4) > div.kf-environment-waste-card-grid::after {
          content: none !important;
          display: none !important;
          background: none !important;
          box-shadow: none !important;
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
      className="kf-explore-eyebrow"
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
      className="kf-simple-card kf-environment-card"
      style={{
        background: "#fffdf9",
        border: "1px solid rgba(16,27,43,.08)",
        borderRadius: "22px",
        padding: "18px",
        boxShadow: "0 8px 24px rgba(16,27,43,.035)",
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
          color: "#667780",
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