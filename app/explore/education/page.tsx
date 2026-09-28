"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type EducationItem = {
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

const educationStages: EducationItem[] = [
  {
    icon: "🧒",
    title: {
      en: "Foundational Stage",
      hi: "आधारभूत चरण",
      mr: "पायाभूत टप्पा",
    },
    text: {
      en: "The foundational stage covers ages 3–8 and includes three years of preschool or Anganwadi education followed by Classes 1 and 2.",
      hi: "आधारभूत चरण 3–8 वर्ष की आयु को शामिल करता है और इसमें प्री-स्कूल या आंगनवाड़ी शिक्षा के तीन वर्ष, उसके बाद कक्षा 1 और 2 शामिल हैं।",
      mr: "पायाभूत टप्प्यात 3–8 वर्षे वयोगटाचा समावेश होतो. यामध्ये पूर्व-प्राथमिक किंवा अंगणवाडी शिक्षणाची तीन वर्षे आणि त्यानंतर इयत्ता 1 व 2 यांचा समावेश होतो.",
    },
  },
  {
    icon: "📚",
    title: {
      en: "Preparatory Stage",
      hi: "तैयारी चरण",
      mr: "तयारीचा टप्पा",
    },
    text: {
      en: "The preparatory stage covers Classes 3–5 and builds on foundational learning through interactive and experiential approaches.",
      hi: "तैयारी चरण में कक्षा 3–5 शामिल हैं और यह संवादात्मक तथा अनुभवात्मक तरीकों से आधारभूत सीख पर आगे बढ़ता है।",
      mr: "तयारीच्या टप्प्यात इयत्ता 3–5 चा समावेश होतो आणि परस्परसंवादी व अनुभवाधारित पद्धतींद्वारे पायाभूत शिक्षणावर पुढे भर दिला जातो.",
    },
  },
  {
    icon: "🔬",
    title: {
      en: "Middle Stage",
      hi: "मध्य चरण",
      mr: "मधला टप्पा",
    },
    text: {
      en: "The middle stage covers Classes 6–8 and introduces more subject-oriented learning while developing conceptual understanding.",
      hi: "मध्य चरण में कक्षा 6–8 शामिल हैं और इसमें अवधारणात्मक समझ विकसित करते हुए अधिक विषय-केंद्रित शिक्षा शुरू होती है।",
      mr: "मधल्या टप्प्यात इयत्ता 6–8 चा समावेश होतो आणि संकल्पनात्मक समज विकसित करत अधिक विषयाधारित शिक्षण सुरू होते.",
    },
  },
  {
    icon: "🎓",
    title: {
      en: "Secondary Stage",
      hi: "माध्यमिक चरण",
      mr: "माध्यमिक टप्पा",
    },
    text: {
      en: "The secondary stage covers Classes 9–12 and provides greater depth, flexibility and opportunities to explore different areas.",
      hi: "माध्यमिक चरण में कक्षा 9–12 शामिल हैं और इसमें अधिक गहराई, लचीलापन तथा विभिन्न क्षेत्रों को जानने के अवसर मिलते हैं।",
      mr: "माध्यमिक टप्प्यात इयत्ता 9–12 चा समावेश होतो आणि अधिक सखोलता, लवचिकता तसेच विविध क्षेत्रांचा अभ्यास करण्याच्या संधी मिळतात.",
    },
  },
];

const educationAreas: EducationItem[] = [
  {
    icon: "📖",
    title: {
      en: "School Education",
      hi: "स्कूली शिक्षा",
      mr: "शालेय शिक्षण",
    },
    text: {
      en: "School education includes early childhood care and education, foundational learning and schooling through the secondary stage.",
      hi: "स्कूली शिक्षा में प्रारंभिक बाल्यावस्था देखभाल और शिक्षा, आधारभूत सीख तथा माध्यमिक चरण तक की स्कूली शिक्षा शामिल है।",
      mr: "शालेय शिक्षणामध्ये बालपणातील प्रारंभिक देखभाल व शिक्षण, पायाभूत शिक्षण आणि माध्यमिक टप्प्यापर्यंतचे शालेय शिक्षण यांचा समावेश होतो.",
    },
  },
  {
    icon: "🏫",
    title: {
      en: "Higher Education",
      hi: "उच्च शिक्षा",
      mr: "उच्च शिक्षण",
    },
    text: {
      en: "Higher education includes universities, colleges and other institutions offering undergraduate, postgraduate and research programmes.",
      hi: "उच्च शिक्षा में विश्वविद्यालय, महाविद्यालय और अन्य संस्थाएँ शामिल हैं जो स्नातक, स्नातकोत्तर और शोध कार्यक्रम प्रदान करती हैं।",
      mr: "उच्च शिक्षणामध्ये विद्यापीठे, महाविद्यालये आणि पदवी, पदव्युत्तर व संशोधन अभ्यासक्रम देणाऱ्या इतर संस्था यांचा समावेश होतो.",
    },
  },
  {
    icon: "🛠️",
    title: {
      en: "Vocational Education",
      hi: "व्यावसायिक शिक्षा",
      mr: "व्यावसायिक शिक्षण",
    },
    text: {
      en: "Vocational education develops practical and occupational skills and can complement broader academic education.",
      hi: "व्यावसायिक शिक्षा व्यावहारिक और व्यावसायिक कौशल विकसित करती है और व्यापक शैक्षणिक शिक्षा का पूरक हो सकती है।",
      mr: "व्यावसायिक शिक्षण व्यावहारिक आणि रोजगाराशी संबंधित कौशल्ये विकसित करते आणि व्यापक शैक्षणिक शिक्षणाला पूरक ठरू शकते.",
    },
  },
  {
    icon: "💻",
    title: {
      en: "Digital Learning",
      hi: "डिजिटल शिक्षा",
      mr: "डिजिटल शिक्षण",
    },
    text: {
      en: "Technology can support teaching, learning, educational access and the sharing of educational resources.",
      hi: "तकनीक शिक्षण, सीखने, शैक्षणिक पहुँच और शैक्षणिक संसाधनों को साझा करने में सहायता कर सकती है।",
      mr: "तंत्रज्ञान अध्यापन, शिक्षण, शैक्षणिक प्रवेश आणि शैक्षणिक संसाधनांची देवाणघेवाण यांना मदत करू शकते.",
    },
  },
];

const citizenActions: CitizenAction[] = [
  {
    number: "01",
    title: {
      en: "Know your educational rights",
      hi: "अपने शैक्षणिक अधिकारों को जानें",
      mr: "तुमचे शैक्षणिक अधिकार जाणून घ्या",
    },
    text: {
      en: "Understand the rights and protections available to children and students under applicable laws and policies.",
      hi: "लागू कानूनों और नीतियों के तहत बच्चों और छात्रों को उपलब्ध अधिकारों और सुरक्षा को समझें।",
      mr: "लागू कायदे आणि धोरणांनुसार मुलांना व विद्यार्थ्यांना उपलब्ध असलेले हक्क आणि संरक्षण समजून घ्या.",
    },
  },
  {
    number: "02",
    title: {
      en: "Support learning",
      hi: "सीखने में सहयोग करें",
      mr: "शिक्षणाला पाठबळ द्या",
    },
    text: {
      en: "Families and communities can contribute to a learning environment that encourages curiosity, attendance and continued education.",
      hi: "परिवार और समुदाय ऐसा सीखने का वातावरण बनाने में योगदान दे सकते हैं जो जिज्ञासा, उपस्थिति और निरंतर शिक्षा को प्रोत्साहित करे।",
      mr: "कुटुंबे आणि समुदाय जिज्ञासा, नियमित उपस्थिती आणि शिक्षण सुरू ठेवण्यास प्रोत्साहन देणारे शैक्षणिक वातावरण तयार करण्यात योगदान देऊ शकतात.",
    },
  },
  {
    number: "03",
    title: {
      en: "Explore opportunities",
      hi: "अवसरों को जानें",
      mr: "संधींचा शोध घ्या",
    },
    text: {
      en: "Students can learn about scholarships, vocational programmes, higher education and skill-development opportunities.",
      hi: "छात्र छात्रवृत्तियों, व्यावसायिक कार्यक्रमों, उच्च शिक्षा और कौशल-विकास के अवसरों के बारे में जान सकते हैं।",
      mr: "विद्यार्थी शिष्यवृत्ती, व्यावसायिक कार्यक्रम, उच्च शिक्षण आणि कौशल्य विकासाच्या संधींबद्दल माहिती घेऊ शकतात.",
    },
  },
  {
    number: "04",
    title: {
      en: "Participate in institutions",
      hi: "शैक्षणिक संस्थाओं में भाग लें",
      mr: "शैक्षणिक संस्थांमध्ये सहभागी व्हा",
    },
    text: {
      en: "Parents, students and communities can participate through appropriate school or institutional forums and mechanisms.",
      hi: "माता-पिता, छात्र और समुदाय उचित स्कूल या संस्थागत मंचों और व्यवस्थाओं के माध्यम से भाग ले सकते हैं।",
      mr: "पालक, विद्यार्थी आणि समुदाय योग्य शालेय किंवा संस्थात्मक मंच व यंत्रणांद्वारे सहभागी होऊ शकतात.",
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
      en: "Education policies and programmes can change, so citizens should refer to official sources for current information.",
      hi: "शिक्षा नीतियाँ और कार्यक्रम बदल सकते हैं, इसलिए नागरिकों को वर्तमान जानकारी के लिए आधिकारिक स्रोतों का संदर्भ लेना चाहिए।",
      mr: "शिक्षणविषयक धोरणे आणि कार्यक्रम बदलू शकतात, त्यामुळे सध्याची माहिती मिळवण्यासाठी नागरिकांनी अधिकृत स्रोतांचा संदर्भ घ्यावा.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "What structure does NEP 2020 propose for school education?",
      hi: "NEP 2020 स्कूली शिक्षा के लिए कौन-सी संरचना प्रस्तावित करता है?",
      mr: "NEP 2020 शालेय शिक्षणासाठी कोणती रचना प्रस्तावित करते?",
    },
    options: [
      {
        en: "5+3+3+4",
        hi: "5+3+3+4",
        mr: "5+3+3+4",
      },
      {
        en: "10+2+2",
        hi: "10+2+2",
        mr: "10+2+2",
      },
      {
        en: "4+4+4+4",
        hi: "4+4+4+4",
        mr: "4+4+4+4",
      },
      {
        en: "8+4",
        hi: "8+4",
        mr: "8+4",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which stage covers Classes 9–12 under the NEP 2020 structure?",
      hi: "NEP 2020 की संरचना के अनुसार कक्षा 9–12 किस चरण में आती हैं?",
      mr: "NEP 2020 च्या रचनेनुसार इयत्ता 9–12 कोणत्या टप्प्यात येतात?",
    },
    options: [
      {
        en: "Foundational Stage",
        hi: "आधारभूत चरण",
        mr: "पायाभूत टप्पा",
      },
      {
        en: "Preparatory Stage",
        hi: "तैयारी चरण",
        mr: "तयारीचा टप्पा",
      },
      {
        en: "Middle Stage",
        hi: "मध्य चरण",
        mr: "मधला टप्पा",
      },
      {
        en: "Secondary Stage",
        hi: "माध्यमिक चरण",
        mr: "माध्यमिक टप्पा",
      },
    ],
    answer: 3,
  },
  {
    question: {
      en: "Which is an example of higher education?",
      hi: "उच्च शिक्षा का उदाहरण कौन-सा है?",
      mr: "उच्च शिक्षणाचे उदाहरण कोणते?",
    },
    options: [
      {
        en: "A university degree programme",
        hi: "विश्वविद्यालय की डिग्री का कार्यक्रम",
        mr: "विद्यापीठातील पदवी अभ्यासक्रम",
      },
      {
        en: "A municipal road",
        hi: "नगरपालिका की सड़क",
        mr: "महानगरपालिकेचा रस्ता",
      },
      {
        en: "A village water tank",
        hi: "गाँव की पानी की टंकी",
        mr: "गावातील पाण्याची टाकी",
      },
      {
        en: "A polling station",
        hi: "मतदान केंद्र",
        mr: "मतदान केंद्र",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What is one purpose of vocational education?",
      hi: "व्यावसायिक शिक्षा का एक उद्देश्य क्या है?",
      mr: "व्यावसायिक शिक्षणाचा एक उद्देश काय आहे?",
    },
    options: [
      {
        en: "Developing practical and occupational skills",
        hi: "व्यावहारिक और व्यावसायिक कौशल विकसित करना",
        mr: "व्यावहारिक आणि रोजगाराशी संबंधित कौशल्ये विकसित करणे",
      },
      {
        en: "Replacing all academic education",
        hi: "सभी शैक्षणिक शिक्षा को बदलना",
        mr: "सर्व शैक्षणिक शिक्षणाची जागा घेणे",
      },
      {
        en: "Managing elections",
        hi: "चुनावों का प्रबंधन करना",
        mr: "निवडणुकांचे व्यवस्थापन करणे",
      },
      {
        en: "Collecting government taxes",
        hi: "सरकारी कर एकत्र करना",
        mr: "सरकारी कर गोळा करणे",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Why should citizens check official education sources?",
      hi: "नागरिकों को आधिकारिक शिक्षा स्रोत क्यों देखने चाहिए?",
      mr: "नागरिकांनी अधिकृत शिक्षण स्रोत का तपासले पाहिजेत?",
    },
    options: [
      {
        en: "Policies and programmes can change",
        hi: "नीतियाँ और कार्यक्रम बदल सकते हैं",
        mr: "धोरणे आणि कार्यक्रम बदलू शकतात",
      },
      {
        en: "Education never changes",
        hi: "शिक्षा कभी नहीं बदलती",
        mr: "शिक्षण कधीही बदलत नाही",
      },
      {
        en: "Only schools need information",
        hi: "केवल स्कूलों को जानकारी चाहिए",
        mr: "फक्त शाळांनाच माहितीची गरज असते",
      },
      {
        en: "Official information is unnecessary",
        hi: "आधिकारिक जानकारी आवश्यक नहीं है",
        mr: "अधिकृत माहितीची गरज नाही",
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
    educationCitizenshipTitle: string;
    educationCitizenshipText: string;

    section2Label: string;
    section2Title: string;
    section2Text: string;

    section3Label: string;
    section3Title: string;
    section3Text: string;

    section4Label: string;
    section4Title: string;
    section4Text: string;
    undergraduateTitle: string;
    undergraduateText: string;
    postgraduateTitle: string;
    postgraduateText: string;
    researchTitle: string;
    researchText: string;
    professionalTitle: string;
    professionalText: string;

    section5Label: string;
    section5Title: string;
    section5Text: string;
    skillsMatterTitle: string;
    skillsMatterText: string;

    section6Label: string;
    section6Title: string;
    section6Text: string;
    onlineLearningTitle: string;
    onlineLearningText: string;
    digitalAccessTitle: string;
    digitalAccessText: string;
    digitalSkillsTitle: string;
    digitalSkillsText: string;

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
    subtitle: "Education",
    back: "Explore",

    heroLabel: "CIVIC BASICS · 07",
    heroTitle: "Education",
    heroText:
      "Understand India's education system, the different stages of learning, higher and vocational education, and how citizens can participate in education.",

    section1Label: "01 · EDUCATION IN INDIA",
    section1Title: "Why is education a civic issue?",
    section1Text:
      "Education affects individual opportunities as well as society more broadly. It contributes to knowledge, skills, social development and participation in public life. India's education system includes school education, higher education, vocational education and other learning pathways.",
    educationCitizenshipTitle: "Education and citizenship",
    educationCitizenshipText:
      "Education can help people understand institutions, rights, responsibilities and the world around them. NEP 2020 also discusses Constitutional values, responsible citizenship, skills and holistic development.",

    section2Label: "02 · SCHOOL EDUCATION",
    section2Title: "Understanding the 5+3+3+4 structure",
    section2Text:
      "NEP 2020 proposes restructuring school education into a 5+3+3+4 pedagogical and curricular structure covering ages 3–18. The four stages are Foundational, Preparatory, Middle and Secondary.",

    section3Label: "03 · LEARNING PATHWAYS",
    section3Title: "Education has many pathways",
    section3Text:
      "Students can follow different educational pathways depending on their interests, abilities and circumstances. Academic, professional, technical and vocational learning can all contribute to education and skills development.",

    section4Label: "04 · HIGHER EDUCATION",
    section4Title: "What happens after school?",
    section4Text:
      "Higher education includes universities, colleges and other institutions offering undergraduate, postgraduate and research programmes. It can support knowledge creation, innovation, professional development and economic and social development.",
    undergraduateTitle: "Undergraduate",
    undergraduateText:
      "Bachelor's-level programmes provide foundational and specialised higher education in different fields.",
    postgraduateTitle: "Postgraduate",
    postgraduateText:
      "Postgraduate programmes allow students to develop deeper knowledge and specialised skills.",
    researchTitle: "Research",
    researchText:
      "Research programmes contribute to knowledge creation, innovation and the study of complex problems.",
    professionalTitle: "Professional Education",
    professionalText:
      "Professional and technical programmes prepare learners for specialised occupations and careers.",

    section5Label: "05 · VOCATIONAL EDUCATION",
    section5Title: "Learning practical skills",
    section5Text:
      "Vocational education focuses on developing practical and occupational skills. It can provide pathways into employment and can also complement academic education.",
    skillsMatterTitle: "Why do skills matter?",
    skillsMatterText:
      "Skills can help people perform specific jobs, adapt to changing workplaces and pursue different career pathways. NEP 2020 places emphasis on vocational education and the integration of skills into the broader education system.",

    section6Label: "06 · EDUCATION & TECHNOLOGY",
    section6Title: "Technology is changing learning",
    section6Text:
      "Digital technology can support access to educational content, online learning, teacher development and communication. At the same time, access to devices, connectivity and digital skills can affect how easily learners benefit from technology.",
    onlineLearningTitle: "Online Learning",
    onlineLearningText:
      "Digital platforms can provide access to courses, educational material and learning resources.",
    digitalAccessTitle: "Digital Access",
    digitalAccessText:
      "Devices and internet connectivity influence access to digital learning opportunities.",
    digitalSkillsTitle: "Digital Skills",
    digitalSkillsText:
      "Learners increasingly need the ability to use technology effectively and responsibly.",

    section7Label: "07 · CITIZEN PARTICIPATION",
    section7Title: "What can citizens do?",
    section7Text:
      "Education is not only the responsibility of schools and governments. Families, students, teachers and communities can all contribute to a supportive learning environment.",

    quizLabel: "08 · QUICK QUIZ",
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
    subtitle: "शिक्षा",
    back: "एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 07",
    heroTitle: "शिक्षा",
    heroText:
      "भारत की शिक्षा व्यवस्था, सीखने के विभिन्न चरणों, उच्च और व्यावसायिक शिक्षा तथा शिक्षा में नागरिकों की भागीदारी को समझें।",

    section1Label: "01 · भारत में शिक्षा",
    section1Title: "शिक्षा एक नागरिक मुद्दा क्यों है?",
    section1Text:
      "शिक्षा व्यक्तिगत अवसरों के साथ-साथ व्यापक रूप से समाज को भी प्रभावित करती है। यह ज्ञान, कौशल, सामाजिक विकास और सार्वजनिक जीवन में भागीदारी में योगदान देती है। भारत की शिक्षा व्यवस्था में स्कूली शिक्षा, उच्च शिक्षा, व्यावसायिक शिक्षा और सीखने के अन्य मार्ग शामिल हैं।",
    educationCitizenshipTitle: "शिक्षा और नागरिकता",
    educationCitizenshipText:
      "शिक्षा लोगों को संस्थाओं, अधिकारों, जिम्मेदारियों और अपने आसपास की दुनिया को समझने में मदद कर सकती है। NEP 2020 में संवैधानिक मूल्यों, जिम्मेदार नागरिकता, कौशल और समग्र विकास पर भी चर्चा की गई है।",

    section2Label: "02 · स्कूली शिक्षा",
    section2Title: "5+3+3+4 संरचना को समझना",
    section2Text:
      "NEP 2020 में 3–18 वर्ष की आयु को शामिल करते हुए स्कूली शिक्षा को 5+3+3+4 शैक्षणिक और पाठ्यचर्या संरचना में पुनर्गठित करने का प्रस्ताव है। चार चरण हैं: आधारभूत, तैयारी, मध्य और माध्यमिक।",

    section3Label: "03 · शिक्षा के मार्ग",
    section3Title: "शिक्षा के कई मार्ग हैं",
    section3Text:
      "छात्र अपनी रुचियों, क्षमताओं और परिस्थितियों के आधार पर अलग-अलग शैक्षणिक मार्ग चुन सकते हैं। शैक्षणिक, पेशेवर, तकनीकी और व्यावसायिक शिक्षा सभी शिक्षा और कौशल विकास में योगदान दे सकती हैं।",

    section4Label: "04 · उच्च शिक्षा",
    section4Title: "स्कूल के बाद क्या होता है?",
    section4Text:
      "उच्च शिक्षा में विश्वविद्यालय, महाविद्यालय और अन्य संस्थाएँ शामिल हैं जो स्नातक, स्नातकोत्तर और शोध कार्यक्रम प्रदान करती हैं। यह ज्ञान निर्माण, नवाचार, पेशेवर विकास तथा आर्थिक और सामाजिक विकास में सहायता कर सकती है।",
    undergraduateTitle: "स्नातक शिक्षा",
    undergraduateText:
      "स्नातक स्तर के कार्यक्रम विभिन्न क्षेत्रों में आधारभूत और विशेषीकृत उच्च शिक्षा प्रदान करते हैं।",
    postgraduateTitle: "स्नातकोत्तर शिक्षा",
    postgraduateText:
      "स्नातकोत्तर कार्यक्रम छात्रों को गहरा ज्ञान और विशेष कौशल विकसित करने का अवसर देते हैं।",
    researchTitle: "शोध",
    researchText:
      "शोध कार्यक्रम ज्ञान निर्माण, नवाचार और जटिल समस्याओं के अध्ययन में योगदान देते हैं।",
    professionalTitle: "पेशेवर शिक्षा",
    professionalText:
      "पेशेवर और तकनीकी कार्यक्रम शिक्षार्थियों को विशेष व्यवसायों और करियर के लिए तैयार करते हैं।",

    section5Label: "05 · व्यावसायिक शिक्षा",
    section5Title: "व्यावहारिक कौशल सीखना",
    section5Text:
      "व्यावसायिक शिक्षा व्यावहारिक और रोजगार से जुड़े कौशल विकसित करने पर केंद्रित होती है। यह रोजगार के रास्ते प्रदान कर सकती है और शैक्षणिक शिक्षा की पूरक भी हो सकती है।",
    skillsMatterTitle: "कौशल क्यों महत्वपूर्ण हैं?",
    skillsMatterText:
      "कौशल लोगों को विशिष्ट कार्य करने, बदलते कार्यस्थलों के अनुसार ढलने और अलग-अलग करियर मार्ग अपनाने में मदद कर सकते हैं। NEP 2020 व्यावसायिक शिक्षा और व्यापक शिक्षा व्यवस्था में कौशल के एकीकरण पर जोर देता है।",

    section6Label: "06 · शिक्षा और तकनीक",
    section6Title: "तकनीक सीखने के तरीके बदल रही है",
    section6Text:
      "डिजिटल तकनीक शैक्षणिक सामग्री, ऑनलाइन सीखने, शिक्षक विकास और संचार तक पहुँच में सहायता कर सकती है। साथ ही, उपकरणों, कनेक्टिविटी और डिजिटल कौशल की उपलब्धता यह प्रभावित कर सकती है कि शिक्षार्थी तकनीक से कितनी आसानी से लाभ उठा पाते हैं।",
    onlineLearningTitle: "ऑनलाइन शिक्षा",
    onlineLearningText:
      "डिजिटल प्लेटफ़ॉर्म पाठ्यक्रमों, शैक्षणिक सामग्री और सीखने के संसाधनों तक पहुँच प्रदान कर सकते हैं।",
    digitalAccessTitle: "डिजिटल पहुँच",
    digitalAccessText:
      "उपकरण और इंटरनेट कनेक्टिविटी डिजिटल शिक्षा के अवसरों तक पहुँच को प्रभावित करते हैं।",
    digitalSkillsTitle: "डिजिटल कौशल",
    digitalSkillsText:
      "शिक्षार्थियों को तकनीक का प्रभावी और जिम्मेदार तरीके से उपयोग करने की क्षमता की आवश्यकता बढ़ रही है।",

    section7Label: "07 · नागरिक भागीदारी",
    section7Title: "नागरिक क्या कर सकते हैं?",
    section7Text:
      "शिक्षा केवल स्कूलों और सरकारों की जिम्मेदारी नहीं है। परिवार, छात्र, शिक्षक और समुदाय सभी एक सहायक सीखने का वातावरण बनाने में योगदान दे सकते हैं।",

    quizLabel: "08 · त्वरित क्विज़",
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
    subtitle: "शिक्षण",
    back: "एक्सप्लोर",

    heroLabel: "नागरिक ज्ञान · 07",
    heroTitle: "शिक्षण",
    heroText:
      "भारताची शिक्षण व्यवस्था, शिक्षणाचे विविध टप्पे, उच्च व व्यावसायिक शिक्षण आणि शिक्षणामध्ये नागरिकांचा सहभाग समजून घ्या.",

    section1Label: "01 · भारतातील शिक्षण",
    section1Title: "शिक्षण हा नागरिक विषय का आहे?",
    section1Text:
      "शिक्षणाचा परिणाम व्यक्तीच्या संधींवर तसेच व्यापक समाजावर होतो. ते ज्ञान, कौशल्ये, सामाजिक विकास आणि सार्वजनिक जीवनातील सहभागाला हातभार लावते. भारताच्या शिक्षण व्यवस्थेत शालेय शिक्षण, उच्च शिक्षण, व्यावसायिक शिक्षण आणि शिकण्याचे इतर मार्ग यांचा समावेश होतो.",
    educationCitizenshipTitle: "शिक्षण आणि नागरिकत्व",
    educationCitizenshipText:
      "शिक्षणामुळे लोकांना संस्था, हक्क, जबाबदाऱ्या आणि आपल्या सभोवतालच्या जगाची समज विकसित करण्यास मदत होऊ शकते. NEP 2020 मध्ये घटनात्मक मूल्ये, जबाबदार नागरिकत्व, कौशल्ये आणि सर्वांगीण विकास यांचाही विचार केला आहे.",

    section2Label: "02 · शालेय शिक्षण",
    section2Title: "5+3+3+4 रचना समजून घेणे",
    section2Text:
      "NEP 2020 मध्ये 3–18 वर्षे वयोगटासाठी शालेय शिक्षणाची 5+3+3+4 अशी शैक्षणिक व अभ्यासक्रमाची रचना प्रस्तावित केली आहे. हे चार टप्पे आहेत: पायाभूत, तयारीचा, मधला आणि माध्यमिक.",

    section3Label: "03 · शिक्षणाचे मार्ग",
    section3Title: "शिक्षणाचे अनेक मार्ग आहेत",
    section3Text:
      "विद्यार्थी त्यांच्या आवडी, क्षमता आणि परिस्थितीनुसार वेगवेगळे शैक्षणिक मार्ग निवडू शकतात. शैक्षणिक, व्यावसायिक, तांत्रिक आणि रोजगाराभिमुख शिक्षण हे सर्व शिक्षण व कौशल्य विकासाला हातभार लावू शकतात.",

    section4Label: "04 · उच्च शिक्षण",
    section4Title: "शाळेनंतर काय होते?",
    section4Text:
      "उच्च शिक्षणामध्ये विद्यापीठे, महाविद्यालये आणि पदवी, पदव्युत्तर व संशोधन कार्यक्रम देणाऱ्या इतर संस्थांचा समावेश होतो. यामुळे ज्ञाननिर्मिती, नवकल्पना, व्यावसायिक विकास तसेच आर्थिक आणि सामाजिक विकासाला चालना मिळू शकते.",
    undergraduateTitle: "पदवीपूर्व शिक्षण",
    undergraduateText:
      "पदवी स्तरावरील अभ्यासक्रम विविध क्षेत्रांमध्ये मूलभूत आणि विशेषीकृत उच्च शिक्षण देतात.",
    postgraduateTitle: "पदव्युत्तर शिक्षण",
    postgraduateText:
      "पदव्युत्तर अभ्यासक्रम विद्यार्थ्यांना अधिक सखोल ज्ञान आणि विशेष कौशल्ये विकसित करण्याची संधी देतात.",
    researchTitle: "संशोधन",
    researchText:
      "संशोधन कार्यक्रम ज्ञाननिर्मिती, नवकल्पना आणि गुंतागुंतीच्या समस्यांच्या अभ्यासाला हातभार लावतात.",
    professionalTitle: "व्यावसायिक शिक्षण",
    professionalText:
      "व्यावसायिक आणि तांत्रिक अभ्यासक्रम विद्यार्थ्यांना विशेष व्यवसाय आणि करिअरसाठी तयार करतात.",

    section5Label: "05 · व्यावसायिक शिक्षण",
    section5Title: "व्यावहारिक कौशल्ये शिकणे",
    section5Text:
      "व्यावसायिक शिक्षण व्यावहारिक आणि रोजगाराशी संबंधित कौशल्ये विकसित करण्यावर भर देते. त्यातून रोजगाराच्या संधींकडे जाणारे मार्ग उपलब्ध होऊ शकतात आणि ते शैक्षणिक शिक्षणाला पूरक ठरू शकते.",
    skillsMatterTitle: "कौशल्ये महत्त्वाची का आहेत?",
    skillsMatterText:
      "कौशल्यांमुळे लोकांना विशिष्ट कामे करता येतात, बदलत्या कार्यस्थळांशी जुळवून घेता येते आणि विविध करिअर मार्ग निवडता येतात. NEP 2020 मध्ये व्यावसायिक शिक्षण आणि व्यापक शिक्षण व्यवस्थेत कौशल्यांचे एकत्रीकरण यावर भर दिला आहे.",

    section6Label: "06 · शिक्षण आणि तंत्रज्ञान",
    section6Title: "तंत्रज्ञान शिक्षण बदलत आहे",
    section6Text:
      "डिजिटल तंत्रज्ञानामुळे शैक्षणिक सामग्री, ऑनलाइन शिक्षण, शिक्षक विकास आणि संवाद यांपर्यंत पोहोचण्यास मदत होऊ शकते. त्याच वेळी उपकरणे, इंटरनेट कनेक्टिव्हिटी आणि डिजिटल कौशल्यांची उपलब्धता यामुळे शिकणाऱ्यांना तंत्रज्ञानाचा किती सहज लाभ घेता येईल हे बदलू शकते.",
    onlineLearningTitle: "ऑनलाइन शिक्षण",
    onlineLearningText:
      "डिजिटल प्लॅटफॉर्ममुळे अभ्यासक्रम, शैक्षणिक साहित्य आणि शिक्षण संसाधनांपर्यंत पोहोच मिळू शकते.",
    digitalAccessTitle: "डिजिटल प्रवेश",
    digitalAccessText:
      "उपकरणे आणि इंटरनेट कनेक्टिव्हिटी डिजिटल शिक्षणाच्या संधींपर्यंतचा प्रवेश प्रभावित करतात.",
    digitalSkillsTitle: "डिजिटल कौशल्ये",
    digitalSkillsText:
      "शिकणाऱ्यांना तंत्रज्ञानाचा प्रभावी आणि जबाबदारीने वापर करण्याची क्षमता अधिकाधिक आवश्यक होत आहे.",

    section7Label: "07 · नागरिक सहभाग",
    section7Title: "नागरिक काय करू शकतात?",
    section7Text:
      "शिक्षण ही केवळ शाळा आणि सरकारची जबाबदारी नाही. कुटुंबे, विद्यार्थी, शिक्षक आणि समुदाय हे सर्व सहाय्यकारी शैक्षणिक वातावरण तयार करण्यात योगदान देऊ शकतात.",

    quizLabel: "08 · झटपट क्विझ",
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

export default function EducationPage() {
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
            topic: "education",
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

      setScore(finalScore);
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
      className="kf-explore-page kf-education-page"
      style={{
        minHeight: "100vh",
        background: "#f8f3ea",
        color: "#102033",
        padding: "24px 3% 70px",
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
                color: "#ffffff",
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
                Karma<span style={{ color: "#ff7a00" }}>Facie</span>
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
                EXPLORE &amp; LEARN
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
          className="kf-explore-hero kf-hero"
          style={{
            marginBottom: "65px",
          }}
        >
          <div className="kf-hero-copy">
            <SectionLabel text={t.heroLabel} />

            <h1
              style={{
                fontSize: "72px",
                lineHeight: "0.98",
                letterSpacing: "-0.045em",
                fontWeight: "800",
                margin: "0 0 24px",
                maxWidth: "920px",
              }}
            >
              {t.heroTitle}
            </h1>

            <p
              style={{
                color: "#596a78",
                fontSize: "19px",
                lineHeight: "1.72",
                maxWidth: "900px",
                margin: 0,
              }}
            >
              {t.heroText}
            </p>
          </div>

          <div className="kf-hero-badge">
            <div className="kf-hero-badge-icon">📚</div>
            <div>
              <div className="kf-hero-badge-title">Civic knowledge</div>
              <div className="kf-hero-badge-subtitle">Education</div>
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
            className="kf-education-callout"
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
              {t.educationCitizenshipTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.educationCitizenshipText}
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
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {educationStages.map((stage, index) => (
              <SimpleCard
                key={`${stage.icon}-${index}`}
                icon={stage.icon}
                title={stage.title[language]}
                text={stage.text[language]}
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
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {educationAreas.map((area, index) => (
              <SimpleCard
                key={`${area.icon}-${index}`}
                icon={area.icon}
                title={area.title[language]}
                text={area.text[language]}
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
              icon="🎓"
              title={t.undergraduateTitle}
              text={t.undergraduateText}
            />

            <SimpleCard
              icon="📘"
              title={t.postgraduateTitle}
              text={t.postgraduateText}
            />

            <SimpleCard
              icon="🔬"
              title={t.researchTitle}
              text={t.researchText}
            />

            <SimpleCard
              icon="💼"
              title={t.professionalTitle}
              text={t.professionalText}
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
            className="kf-education-callout"
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
              {t.skillsMatterTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.skillsMatterText}
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

          <h2 style={sectionHeadingStyle}>
            {t.section6Title}
          </h2>

          <p style={paragraphStyle}>
            {t.section6Text}
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
              icon="💻"
              title={t.onlineLearningTitle}
              text={t.onlineLearningText}
            />

            <SimpleCard
              icon="📱"
              title={t.digitalAccessTitle}
              text={t.digitalAccessText}
            />

            <SimpleCard
              icon="🧠"
              title={t.digitalSkillsTitle}
              text={t.digitalSkillsText}
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
                className="kf-education-action-card"
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
                  className="kf-education-action-number"
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
                      className="kf-quiz-answer"
                      key={`${index}-${option.en}`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      data-quiz-state={
                        selectedAnswer === null
                          ? "default"
                          : isCorrect
                            ? "correct"
                            : isSelected
                              ? "wrong"
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
                  className="kf-quiz-next"
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
                className="kf-quiz-restart"
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

          .kf-simple-card {
            background: #fffdf9 !important;
            border: 1px solid rgba(16,27,43,.08) !important;
            border-radius: 22px !important;
            box-shadow: 0 8px 24px rgba(16,27,43,.035) !important;
          }

          .kf-simple-card h3 { color: var(--kf-ink) !important; }
          .kf-simple-card p { color: var(--kf-body) !important; }

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

          /* Keep the KarmaFacie K white inside the orange logo box. */
          .kf-explore-page header .kf-explore-brand-box {
            color: #ffffff !important;
          }

          .kf-explore-page .kf-hero {
            position: relative !important;
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto !important;
            align-items: center !important;
            gap: 34px !important;
          }

          .kf-explore-page .kf-hero-copy {
            min-width: 0;
          }

          .kf-explore-page .kf-hero-badge {
            min-width: 285px;
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 18px 20px;
            border: 1px solid var(--kf-peach-line);
            border-radius: 28px;
            background: rgba(255,242,228,.92);
            box-shadow: 0 10px 28px rgba(16,27,43,.045);
          }

          .kf-explore-page .kf-hero-badge-icon {
            width: 56px;
            height: 56px;
            flex: 0 0 56px;
            display: grid;
            place-items: center;
            border: 1px solid #eadfd3;
            border-radius: 18px;
            background: #fffdf9;
            font-size: 25px;
          }

          .kf-explore-page .kf-hero-badge-title {
            color: #304154 !important;
            font-family: var(--font-display);
            font-size: 21px;
            line-height: 1.1;
            font-weight: 800;
          }

          .kf-explore-page .kf-hero-badge-subtitle {
            margin-top: 6px;
            color: #8b725f !important;
            font-family: var(--font-body);
            font-size: 12px;
            line-height: 1.2;
            font-weight: 700;
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
          .kf-explore-page > div > section:nth-of-type(8) { background: var(--kf-green) !important; border-color: var(--kf-green-line) !important; }

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
          .kf-explore-page > div > section:nth-of-type(8) [style*="background"] {
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

          .kf-explore-page > div > section:nth-of-type(9) button:not([style*="margin-top"]) {
            color: #425565 !important;
            background: #fffdf9 !important;
            border-color: #ded9d1 !important;
          }

          .kf-explore-page > div > section:nth-of-type(9) button[style*="margin-top"] {
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

            .kf-explore-page .kf-hero {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }

            .kf-explore-page .kf-hero-badge {
              width: fit-content;
              min-width: 0;
            }

            .kf-explore-page .kf-hero h1 {
              font-size: 58px !important;
            }
          }

          @media (max-width: 680px) {
            .kf-explore-page { padding: 12px 10px 44px !important; }
            .kf-explore-page > div > section { padding: 20px !important; border-radius: 24px !important; }
            .kf-explore-page header { padding: 11px 12px !important; }

            .kf-explore-page .kf-hero {
              gap: 20px !important;
            }

            .kf-explore-page .kf-hero h1 {
              font-size: 46px !important;
              line-height: 1 !important;
            }

            .kf-explore-page .kf-hero-badge {
              width: 100%;
              box-sizing: border-box;
              padding: 15px 16px;
              border-radius: 22px;
            }

            .kf-explore-page .kf-hero-badge-icon {
              width: 50px;
              height: 50px;
              flex-basis: 50px;
              border-radius: 15px;
            }
          }
        `}</style>
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
      className="kf-simple-card kf-education-card"
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
  fontSize: "38px",
  lineHeight: "1.08",
  letterSpacing: "-0.025em",
  fontWeight: "800",
  margin: "0 0 16px",
};

const paragraphStyle = {
  color: "#94a3b8",
  fontSize: "17px",
  lineHeight: "1.75",
  maxWidth: "850px",
  margin: 0,
};
