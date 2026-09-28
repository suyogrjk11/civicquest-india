"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LocalizedText = Record<Language, string>;

type LocalBody = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type CommonIssue = {
  icon: string;
  title: LocalizedText;
  text: LocalizedText;
};

type IssueStep = {
  number: string;
  title: LocalizedText;
  text: LocalizedText;
};

type QuizQuestion = {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
};

const localBodies: LocalBody[] = [
  {
    icon: "🏘️",
    title: {
      en: "Gram Panchayat",
      hi: "ग्राम पंचायत",
      mr: "ग्रामपंचायत",
    },
    text: {
      en: "A rural local self-government institution that works at the village level.",
      hi: "ग्राम स्तर पर कार्य करने वाली ग्रामीण स्थानीय स्वशासन संस्था।",
      mr: "गावाच्या पातळीवर कार्य करणारी ग्रामीण स्थानिक स्वराज्य संस्था.",
    },
  },
  {
    icon: "🏙️",
    title: {
      en: "Municipality",
      hi: "नगरपालिका",
      mr: "नगरपालिका",
    },
    text: {
      en: "An urban local body that governs towns and cities according to the applicable legal framework.",
      hi: "लागू कानूनी ढाँचे के अनुसार कस्बों और शहरों का प्रशासन करने वाली शहरी स्थानीय संस्था।",
      mr: "लागू कायदेशीर चौकटीच्या अनुसार शहरांचे आणि नगरांचे प्रशासन करणारी शहरी स्थानिक संस्था.",
    },
  },
  {
    icon: "🌆",
    title: {
      en: "Municipal Corporation",
      hi: "नगर निगम / महानगरपालिका",
      mr: "महानगरपालिका",
    },
    text: {
      en: "Large cities may be governed through Municipal Corporations under the applicable constitutional and State legal framework.",
      hi: "बड़े शहरों का प्रशासन लागू संवैधानिक और राज्य के कानूनी ढाँचे के तहत नगर निगमों के माध्यम से किया जा सकता है।",
      mr: "मोठ्या शहरांचे प्रशासन लागू घटनात्मक आणि राज्याच्या कायदेशीर चौकटीअंतर्गत महानगरपालिकांमार्फत केले जाऊ शकते.",
    },
  },
];

const commonIssues: CommonIssue[] = [
  {
    icon: "💧",
    title: {
      en: "Water Supply",
      hi: "जल आपूर्ति",
      mr: "पाणीपुरवठा",
    },
    text: {
      en: "Local authorities may be involved in water supply, distribution, infrastructure and related civic services.",
      hi: "स्थानीय प्राधिकरण जल आपूर्ति, वितरण, बुनियादी ढाँचे और संबंधित नागरिक सेवाओं से जुड़े हो सकते हैं।",
      mr: "स्थानिक प्राधिकरण पाणीपुरवठा, वितरण, पायाभूत सुविधा आणि संबंधित नागरी सेवांमध्ये सहभागी असू शकतात.",
    },
  },
  {
    icon: "🗑️",
    title: {
      en: "Waste Management",
      hi: "कचरा प्रबंधन",
      mr: "कचरा व्यवस्थापन",
    },
    text: {
      en: "Collection, transportation and management of solid waste are important local civic functions.",
      hi: "ठोस कचरे का संग्रह, परिवहन और प्रबंधन महत्वपूर्ण स्थानीय नागरिक कार्य हैं।",
      mr: "घनकचऱ्याचे संकलन, वाहतूक आणि व्यवस्थापन ही महत्त्वाची स्थानिक नागरी कामे आहेत.",
    },
  },
  {
    icon: "🛣️",
    title: {
      en: "Roads & Streets",
      hi: "सड़कें और गलियाँ",
      mr: "रस्ते आणि गल्लीबोळ",
    },
    text: {
      en: "Local roads, streets, drainage and related infrastructure can involve local authorities and other government agencies.",
      hi: "स्थानीय सड़कें, गलियाँ, जल निकासी और संबंधित बुनियादी ढाँचे में स्थानीय प्राधिकरणों और अन्य सरकारी एजेंसियों की भूमिका हो सकती है।",
      mr: "स्थानिक रस्ते, रस्त्यांवरील सुविधा, निचरा व्यवस्था आणि संबंधित पायाभूत सुविधांमध्ये स्थानिक प्राधिकरणे आणि इतर सरकारी यंत्रणांचा सहभाग असू शकतो.",
    },
  },
  {
    icon: "💡",
    title: {
      en: "Street Lighting",
      hi: "सड़क प्रकाश व्यवस्था",
      mr: "पथदिवे",
    },
    text: {
      en: "Street lighting is an everyday public service that may be handled by urban local authorities.",
      hi: "सड़क प्रकाश व्यवस्था एक दैनिक सार्वजनिक सेवा है, जिसे शहरी स्थानीय प्राधिकरण संभाल सकते हैं।",
      mr: "पथदिवे ही दैनंदिन सार्वजनिक सेवा असून ती शहरी स्थानिक प्राधिकरणांकडून हाताळली जाऊ शकते.",
    },
  },
  {
    icon: "🌳",
    title: {
      en: "Public Spaces",
      hi: "सार्वजनिक स्थान",
      mr: "सार्वजनिक जागा",
    },
    text: {
      en: "Local authorities can have responsibilities relating to parks, public spaces and parts of the local environment.",
      hi: "स्थानीय प्राधिकरणों की पार्कों, सार्वजनिक स्थानों और स्थानीय पर्यावरण के कुछ हिस्सों से संबंधित जिम्मेदारियाँ हो सकती हैं।",
      mr: "स्थानिक प्राधिकरणांवर उद्याने, सार्वजनिक जागा आणि स्थानिक पर्यावरणाच्या काही बाबींशी संबंधित जबाबदाऱ्या असू शकतात.",
    },
  },
  {
    icon: "🏥",
    title: {
      en: "Public Health",
      hi: "सार्वजनिक स्वास्थ्य",
      mr: "सार्वजनिक आरोग्य",
    },
    text: {
      en: "Local government has an important role in sanitation, public health measures and related civic services.",
      hi: "स्वच्छता, सार्वजनिक स्वास्थ्य उपायों और संबंधित नागरिक सेवाओं में स्थानीय सरकार की महत्वपूर्ण भूमिका होती है।",
      mr: "स्वच्छता, सार्वजनिक आरोग्यविषयक उपाय आणि संबंधित नागरी सेवांमध्ये स्थानिक स्वराज्य संस्थांची महत्त्वाची भूमिका असते.",
    },
  },
];

const issueSteps: IssueStep[] = [
  {
    number: "01",
    title: {
      en: "Identify the issue",
      hi: "समस्या की पहचान करें",
      mr: "समस्या ओळखा",
    },
    text: {
      en: "Clearly understand what the problem is, where it is happening and how it affects the community.",
      hi: "समझें कि समस्या क्या है, कहाँ हो रही है और इसका समुदाय पर क्या प्रभाव पड़ रहा है।",
      mr: "समस्या नेमकी काय आहे, ती कुठे घडत आहे आणि तिचा समुदायावर कसा परिणाम होतो हे स्पष्टपणे समजून घ्या.",
    },
  },
  {
    number: "02",
    title: {
      en: "Find the responsible authority",
      hi: "जिम्मेदार प्राधिकरण खोजें",
      mr: "जबाबदार प्राधिकरण शोधा",
    },
    text: {
      en: "Different issues may fall under different local, State or other government agencies.",
      hi: "अलग-अलग समस्याएँ अलग-अलग स्थानीय, राज्य या अन्य सरकारी एजेंसियों के अधिकार क्षेत्र में आ सकती हैं।",
      mr: "वेगवेगळ्या समस्या वेगवेगळ्या स्थानिक, राज्य किंवा इतर सरकारी यंत्रणांच्या अखत्यारीत येऊ शकतात.",
    },
  },
  {
    number: "03",
    title: {
      en: "Submit a complaint",
      hi: "शिकायत दर्ज करें",
      mr: "तक्रार नोंदवा",
    },
    text: {
      en: "Use the appropriate official complaint or grievance mechanism available for the issue.",
      hi: "समस्या के लिए उपलब्ध उचित आधिकारिक शिकायत या शिकायत-निवारण व्यवस्था का उपयोग करें।",
      mr: "समस्येसाठी उपलब्ध असलेल्या योग्य अधिकृत तक्रार किंवा गाऱ्हाणे निवारण यंत्रणेचा वापर करा.",
    },
  },
  {
    number: "04",
    title: {
      en: "Keep the reference",
      hi: "संदर्भ संख्या सुरक्षित रखें",
      mr: "संदर्भ क्रमांक जतन करा",
    },
    text: {
      en: "Save the complaint number, acknowledgement or other record so that you can follow up.",
      hi: "शिकायत संख्या, पावती या अन्य रिकॉर्ड को सुरक्षित रखें ताकि आप आगे उसकी स्थिति जान सकें।",
      mr: "तक्रार क्रमांक, पोचपावती किंवा इतर नोंद जतन करा, जेणेकरून तुम्ही पुढील पाठपुरावा करू शकाल.",
    },
  },
  {
    number: "05",
    title: {
      en: "Follow up",
      hi: "अनुवर्ती कार्रवाई करें",
      mr: "पाठपुरावा करा",
    },
    text: {
      en: "If the issue remains unresolved, use the applicable escalation or grievance mechanism.",
      hi: "यदि समस्या का समाधान नहीं होता है, तो लागू शिकायत-निवारण या उच्च स्तर पर शिकायत करने की व्यवस्था का उपयोग करें।",
      mr: "समस्या सुटली नाही तर लागू असलेल्या पुढील स्तरावरील तक्रार किंवा गाऱ्हाणे निवारण यंत्रणेचा वापर करा.",
    },
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question: {
      en: "Which level of government is closest to many everyday civic issues?",
      hi: "रोजमर्रा की कई नागरिक समस्याओं के सबसे करीब सरकार का कौन-सा स्तर होता है?",
      mr: "दैनंदिन अनेक नागरी समस्यांशी सर्वात जवळचा संबंध सरकारच्या कोणत्या स्तराचा असतो?",
    },
    options: [
      {
        en: "Local government",
        hi: "स्थानीय सरकार",
        mr: "स्थानिक सरकार",
      },
      {
        en: "Only the Union Government",
        hi: "केवल केंद्र सरकार",
        mr: "फक्त केंद्र सरकार",
      },
      {
        en: "Only Parliament",
        hi: "केवल संसद",
        mr: "फक्त संसद",
      },
      {
        en: "Only the Supreme Court",
        hi: "केवल सर्वोच्च न्यायालय",
        mr: "फक्त सर्वोच्च न्यायालय",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Which constitutional amendments strengthened local self-government in India?",
      hi: "भारत में स्थानीय स्वशासन को मजबूत करने वाले कौन-से संवैधानिक संशोधन हैं?",
      mr: "भारतातील स्थानिक स्वराज्य व्यवस्था बळकट करणाऱ्या कोणत्या घटनादुरुस्त्या आहेत?",
    },
    options: [
      {
        en: "42nd and 44th Amendments",
        hi: "42वाँ और 44वाँ संशोधन",
        mr: "42वी आणि 44वी घटनादुरुस्ती",
      },
      {
        en: "73rd and 74th Amendments",
        hi: "73वाँ और 74वाँ संशोधन",
        mr: "73वी आणि 74वी घटनादुरुस्ती",
      },
      {
        en: "86th and 91st Amendments",
        hi: "86वाँ और 91वाँ संशोधन",
        mr: "86वी आणि 91वी घटनादुरुस्ती",
      },
      {
        en: "101st and 102nd Amendments",
        hi: "101वाँ और 102वाँ संशोधन",
        mr: "101वी आणि 102वी घटनादुरुस्ती",
      },
    ],
    answer: 1,
  },
  {
    question: {
      en: "Which is an example of an everyday local civic issue?",
      hi: "निम्नलिखित में से रोजमर्रा की स्थानीय नागरिक समस्या का उदाहरण कौन-सा है?",
      mr: "खालीलपैकी दैनंदिन स्थानिक नागरी समस्येचे उदाहरण कोणते?",
    },
    options: [
      {
        en: "Street lighting",
        hi: "सड़क प्रकाश व्यवस्था",
        mr: "पथदिवे",
      },
      {
        en: "Foreign policy",
        hi: "विदेश नीति",
        mr: "परराष्ट्र धोरण",
      },
      {
        en: "Monetary policy",
        hi: "मौद्रिक नीति",
        mr: "चलनविषयक धोरण",
      },
      {
        en: "International treaties",
        hi: "अंतरराष्ट्रीय संधियाँ",
        mr: "आंतरराष्ट्रीय करार",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "What should you do before submitting a civic complaint?",
      hi: "नागरिक शिकायत दर्ज करने से पहले आपको क्या करना चाहिए?",
      mr: "नागरी तक्रार नोंदवण्यापूर्वी तुम्ही काय केले पाहिजे?",
    },
    options: [
      {
        en: "Identify the issue and the responsible authority",
        hi: "समस्या और जिम्मेदार प्राधिकरण की पहचान करें",
        mr: "समस्या आणि जबाबदार प्राधिकरण ओळखा",
      },
      {
        en: "Immediately contact the President",
        hi: "तुरंत राष्ट्रपति से संपर्क करें",
        mr: "तात्काळ राष्ट्रपतींशी संपर्क करा",
      },
      {
        en: "Wait for an election",
        hi: "चुनाव की प्रतीक्षा करें",
        mr: "निवडणुकीची वाट पाहा",
      },
      {
        en: "Join a political party",
        hi: "किसी राजनीतिक दल में शामिल हों",
        mr: "राजकीय पक्षात सामील व्हा",
      },
    ],
    answer: 0,
  },
  {
    question: {
      en: "Why should you keep a complaint reference number?",
      hi: "शिकायत की संदर्भ संख्या क्यों सुरक्षित रखनी चाहिए?",
      mr: "तक्रारीचा संदर्भ क्रमांक का जतन करून ठेवावा?",
    },
    options: [
      {
        en: "To follow up on the complaint",
        hi: "शिकायत पर आगे कार्रवाई के लिए",
        mr: "तक्रारीचा पाठपुरावा करण्यासाठी",
      },
      {
        en: "To vote twice",
        hi: "दो बार मतदान करने के लिए",
        mr: "दोन वेळा मतदान करण्यासाठी",
      },
      {
        en: "To avoid paying taxes",
        hi: "कर भुगतान से बचने के लिए",
        mr: "कर भरणे टाळण्यासाठी",
      },
      {
        en: "To become an elected representative",
        hi: "निर्वाचित प्रतिनिधि बनने के लिए",
        mr: "निवडून आलेला प्रतिनिधी होण्यासाठी",
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
    section3Label: string;
    section3Title: string;
    section3Text: string;
    simpleRuleTitle: string;
    simpleRuleText: string;
    section4Label: string;
    section4Title: string;
    section4Text: string;
    section5Label: string;
    section5Title: string;
    section5Text: string;
    locationTitle: string;
    locationText: string;
    evidenceTitle: string;
    evidenceText: string;
    descriptionTitle: string;
    descriptionText: string;
    section6Label: string;
    section6Title: string;
    section6Text: string;
    thinkLocalTitle: string;
    thinkLocalText: string;
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
    subtitle: "Local Issues",
    back: "Explore",
    heroLabel: "CIVIC BASICS · 04",
    heroTitle: "Local Issues",
    heroText:
      "The issues people experience every day often connect directly with local government. Learn who handles local services and how citizens can raise civic issues.",
    section1Label: "01 · LOCAL GOVERNMENT",
    section1Title: "What is local government?",
    section1Text:
      "Local self-government brings government closer to people. India's constitutional framework recognizes local government through Panchayats in rural areas and Municipalities in urban areas. The 73rd and 74th Constitutional Amendments strengthened this framework.",
    section2Label: "02 · EVERYDAY CIVIC ISSUES",
    section2Title: "Problems you may see around you",
    section2Text:
      "Local issues can involve basic services and infrastructure that people interact with every day. Responsibility can vary depending on the issue, location and applicable State laws.",
    section3Label: "03 · WHO IS RESPONSIBLE?",
    section3Title: "Not every problem belongs to the same authority",
    section3Text:
      "One of the most useful civic skills is identifying which authority is responsible for an issue. A road problem, for example, may involve a municipal body, a development authority, a State department or another agency depending on the road and the applicable law.",
    simpleRuleTitle: "A simple rule",
    simpleRuleText:
      "Before filing a complaint, identify the exact problem, its location and the authority that appears responsible. This can make it easier to use the correct grievance channel.",
    section4Label: "04 · RAISING A CIVIC ISSUE",
    section4Title: "What can a citizen do?",
    section4Text:
      "When you notice a civic problem, you can document the issue, identify the relevant authority and use an official complaint or grievance mechanism where available.",
    section5Label: "05 · DOCUMENT THE PROBLEM",
    section5Title: "Good civic reporting starts with clear information",
    section5Text:
      "A clear description can help an authority understand an issue. Useful information may include the exact location, date and time, a short description of the problem and photographs or other evidence where appropriate.",
    locationTitle: "Location",
    locationText:
      "Mention the street, landmark, ward or other useful location details.",
    evidenceTitle: "Evidence",
    evidenceText:
      "Where appropriate, photographs or other supporting information can help explain the issue.",
    descriptionTitle: "Description",
    descriptionText:
      "Describe what happened, how long it has been happening and what service is affected.",
    section6Label: "06 · CITIZEN PARTICIPATION",
    section6Title: "Local democracy needs participation",
    section6Text:
      "Local self-government is intended to support decentralization and participation in governance. Citizens can participate by understanding local institutions, using official civic services, attending appropriate local forums and staying informed about issues affecting their community.",
    thinkLocalTitle: "Think local",
    thinkLocalText:
      "A civic issue does not always require a national-level solution. Understanding which level of government is responsible is an important part of being an informed citizen.",
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
    subtitle: "स्थानीय मुद्दे",
    back: "एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 04",
    heroTitle: "स्थानीय मुद्दे",
    heroText:
      "लोगों द्वारा रोजमर्रा में अनुभव की जाने वाली कई समस्याएँ सीधे स्थानीय सरकार से जुड़ी होती हैं। जानें कि स्थानीय सेवाओं को कौन संभालता है और नागरिक अपनी समस्याएँ कैसे उठा सकते हैं।",
    section1Label: "01 · स्थानीय सरकार",
    section1Title: "स्थानीय सरकार क्या है?",
    section1Text:
      "स्थानीय स्वशासन सरकार को लोगों के करीब लाता है। भारत का संवैधानिक ढाँचा ग्रामीण क्षेत्रों में पंचायतों और शहरी क्षेत्रों में नगरपालिकाओं के माध्यम से स्थानीय सरकार को मान्यता देता है। 73वें और 74वें संवैधानिक संशोधनों ने इस व्यवस्था को मजबूत किया।",
    section2Label: "02 · रोजमर्रा की नागरिक समस्याएँ",
    section2Title: "आप अपने आसपास कौन-सी समस्याएँ देख सकते हैं?",
    section2Text:
      "स्थानीय मुद्दों में बुनियादी सेवाएँ और बुनियादी ढाँचा शामिल हो सकते हैं जिनसे लोग रोजाना जुड़े रहते हैं। जिम्मेदारी समस्या, स्थान और लागू राज्य कानूनों के अनुसार अलग-अलग हो सकती है।",
    section3Label: "03 · जिम्मेदार कौन है?",
    section3Title: "हर समस्या एक ही प्राधिकरण की नहीं होती",
    section3Text:
      "नागरिक जीवन में एक उपयोगी कौशल यह पहचानना है कि किसी समस्या के लिए कौन-सा प्राधिकरण जिम्मेदार है। उदाहरण के लिए, सड़क की समस्या नगर निकाय, विकास प्राधिकरण, राज्य विभाग या किसी अन्य एजेंसी से संबंधित हो सकती है, जो सड़क और लागू कानून पर निर्भर करता है।",
    simpleRuleTitle: "एक सरल नियम",
    simpleRuleText:
      "शिकायत दर्ज करने से पहले समस्या, उसका सही स्थान और जिम्मेदार दिखाई देने वाले प्राधिकरण की पहचान करें। इससे सही शिकायत माध्यम का उपयोग करना आसान हो सकता है।",
    section4Label: "04 · नागरिक समस्या उठाना",
    section4Title: "एक नागरिक क्या कर सकता है?",
    section4Text:
      "जब आपको किसी नागरिक समस्या का पता चले, तो आप उसका रिकॉर्ड रख सकते हैं, संबंधित प्राधिकरण की पहचान कर सकते हैं और जहाँ उपलब्ध हो वहाँ आधिकारिक शिकायत या शिकायत-निवारण व्यवस्था का उपयोग कर सकते हैं।",
    section5Label: "05 · समस्या का दस्तावेजीकरण",
    section5Title: "अच्छी नागरिक शिकायत स्पष्ट जानकारी से शुरू होती है",
    section5Text:
      "स्पष्ट विवरण किसी प्राधिकरण को समस्या समझने में मदद कर सकता है। उपयोगी जानकारी में सही स्थान, तारीख और समय, समस्या का संक्षिप्त विवरण तथा उचित होने पर फोटो या अन्य प्रमाण शामिल हो सकते हैं।",
    locationTitle: "स्थान",
    locationText:
      "सड़क, प्रमुख स्थान, वार्ड या स्थान से संबंधित अन्य उपयोगी विवरण लिखें।",
    evidenceTitle: "प्रमाण",
    evidenceText:
      "जहाँ उचित हो, फोटो या अन्य सहायक जानकारी समस्या को समझाने में मदद कर सकती है।",
    descriptionTitle: "विवरण",
    descriptionText:
      "बताएँ कि क्या हुआ, यह कब से हो रहा है और कौन-सी सेवा प्रभावित है।",
    section6Label: "06 · नागरिक भागीदारी",
    section6Title: "स्थानीय लोकतंत्र को भागीदारी की आवश्यकता है",
    section6Text:
      "स्थानीय स्वशासन का उद्देश्य शासन में विकेंद्रीकरण और भागीदारी को बढ़ावा देना है। नागरिक स्थानीय संस्थाओं को समझकर, आधिकारिक नागरिक सेवाओं का उपयोग करके, उचित स्थानीय मंचों में भाग लेकर और अपने समुदाय को प्रभावित करने वाले मुद्दों के बारे में जानकारी रखकर भाग ले सकते हैं।",
    thinkLocalTitle: "स्थानीय स्तर पर सोचें",
    thinkLocalText:
      "हर नागरिक समस्या के लिए राष्ट्रीय स्तर के समाधान की आवश्यकता नहीं होती। सरकार का कौन-सा स्तर जिम्मेदार है, यह समझना एक जागरूक नागरिक होने का महत्वपूर्ण हिस्सा है।",
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
    subtitle: "स्थानिक समस्या",
    back: "एक्सप्लोर",
    heroLabel: "नागरिक ज्ञान · 04",
    heroTitle: "स्थानिक समस्या",
    heroText:
      "लोकांना दररोज अनुभवायला येणाऱ्या अनेक समस्या थेट स्थानिक स्वराज्य संस्थांशी संबंधित असतात. स्थानिक सेवा कोण हाताळते आणि नागरिक नागरी समस्या कशा मांडू शकतात ते जाणून घ्या.",
    section1Label: "01 · स्थानिक सरकार",
    section1Title: "स्थानिक सरकार म्हणजे काय?",
    section1Text:
      "स्थानिक स्वराज्य संस्था शासन लोकांच्या जवळ आणतात. भारताची घटनात्मक चौकट ग्रामीण भागात पंचायत आणि शहरी भागात नगरपालिका यांच्या माध्यमातून स्थानिक स्वराज्याला मान्यता देते. 73वी आणि 74वी घटनादुरुस्ती या चौकटीला बळकट करतात.",
    section2Label: "02 · दैनंदिन नागरी समस्या",
    section2Title: "तुमच्या आजूबाजूला दिसणाऱ्या समस्या",
    section2Text:
      "स्थानिक समस्यांमध्ये लोक रोज वापरत असलेल्या मूलभूत सेवा आणि पायाभूत सुविधांचा समावेश होऊ शकतो. जबाबदारी ही समस्या, ठिकाण आणि लागू राज्य कायद्यांनुसार बदलू शकते.",
    section3Label: "03 · जबाबदार कोण?",
    section3Title: "प्रत्येक समस्या एकाच प्राधिकरणाच्या अखत्यारीत नसते",
    section3Text:
      "एखाद्या समस्येसाठी कोणते प्राधिकरण जबाबदार आहे हे ओळखणे हे नागरिकत्वातील एक महत्त्वाचे कौशल्य आहे. उदाहरणार्थ, रस्त्याची समस्या नगरपालिका, विकास प्राधिकरण, राज्य विभाग किंवा इतर यंत्रणेशी संबंधित असू शकते. हे संबंधित रस्ता आणि लागू कायद्यावर अवलंबून असते.",
    simpleRuleTitle: "एक सोपा नियम",
    simpleRuleText:
      "तक्रार करण्यापूर्वी नेमकी समस्या, तिचे ठिकाण आणि जबाबदार दिसणारे प्राधिकरण ओळखा. यामुळे योग्य तक्रार निवारण मार्ग वापरणे सोपे होऊ शकते.",
    section4Label: "04 · नागरी समस्या मांडणे",
    section4Title: "नागरिक काय करू शकतो?",
    section4Text:
      "तुमच्या लक्षात एखादी नागरी समस्या आली तर तिची नोंद ठेवू शकता, संबंधित प्राधिकरण ओळखू शकता आणि उपलब्ध असल्यास अधिकृत तक्रार किंवा गाऱ्हाणे निवारण यंत्रणेचा वापर करू शकता.",
    section5Label: "05 · समस्येची नोंद ठेवा",
    section5Title: "चांगली नागरी तक्रार स्पष्ट माहितीपासून सुरू होते",
    section5Text:
      "स्पष्ट वर्णनामुळे प्राधिकरणाला समस्या समजून घेण्यास मदत होऊ शकते. उपयुक्त माहितीत अचूक ठिकाण, तारीख आणि वेळ, समस्येचे थोडक्यात वर्णन तसेच आवश्यकतेनुसार छायाचित्रे किंवा इतर पुरावे यांचा समावेश होऊ शकतो.",
    locationTitle: "ठिकाण",
    locationText:
      "रस्ता, महत्त्वाची खूण, प्रभाग किंवा ठिकाणाशी संबंधित इतर उपयुक्त तपशील नमूद करा.",
    evidenceTitle: "पुरावा",
    evidenceText:
      "आवश्यकतेनुसार छायाचित्रे किंवा इतर सहाय्यक माहितीमुळे समस्या स्पष्ट करण्यात मदत होऊ शकते.",
    descriptionTitle: "वर्णन",
    descriptionText:
      "काय झाले, ही समस्या किती काळापासून आहे आणि कोणती सेवा प्रभावित झाली आहे ते स्पष्ट करा.",
    section6Label: "06 · नागरिक सहभाग",
    section6Title: "स्थानिक लोकशाहीला नागरिकांच्या सहभागाची गरज आहे",
    section6Text:
      "स्थानिक स्वराज्य व्यवस्थेचा उद्देश शासनातील विकेंद्रीकरण आणि सहभागाला प्रोत्साहन देणे हा आहे. नागरिक स्थानिक संस्थांची माहिती घेऊन, अधिकृत नागरी सेवांचा वापर करून, संबंधित स्थानिक मंचांमध्ये सहभागी होऊन आणि आपल्या समुदायावर परिणाम करणाऱ्या समस्यांबद्दल माहिती ठेवून सहभागी होऊ शकतात.",
    thinkLocalTitle: "स्थानिक पातळीवर विचार करा",
    thinkLocalText:
      "प्रत्येक नागरी समस्येसाठी राष्ट्रीय पातळीवरील उपाय आवश्यक असेलच असे नाही. कोणती सरकारी पातळी जबाबदार आहे हे समजून घेणे हा माहितीपूर्ण नागरिक होण्याचा महत्त्वाचा भाग आहे.",
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

export default function LocalIssuesPage() {
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
            topic: "local-issues",
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
    <main className="kf-explore-page kf-local-issues-page"
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
              className="kf-logo-box"
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
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label={
                language === "en" ? "Language" : "भाषा"
              }
              className="kf-explore-language-select"
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
            padding: "32px",
            border: "1px solid var(--kf-line)",
            borderRadius: "31px",
            boxShadow: "0 14px 38px rgba(16,27,43,.05)",
            background:
              "radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%), radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%), rgba(255,253,249,.97)",
          }}
        >
          <SectionLabel text={t.heroLabel} />

          <div
            className="kf-explore-hero-row"
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
                  color: "var(--kf-ink)",
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
              className="kf-explore-topic-badge"
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
                  fontSize: "28px",
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
                  {language === "en"
                    ? "Local Issues"
                    : language === "hi"
                    ? "स्थानीय मुद्दे"
                    : "स्थानिक समस्या"}
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
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {localBodies.map((body, index) => (
              <SimpleCard
                key={`${body.icon}-${index}`}
                icon={body.icon}
                title={body.title[language]}
                text={body.text[language]}
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
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
              marginTop: "30px",
            }}
          >
            {commonIssues.map((issue, index) => (
              <SimpleCard
                key={`${issue.icon}-${index}`}
                icon={issue.icon}
                title={issue.title[language]}
                text={issue.text[language]}
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
            className="kf-local-callout"
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
              {t.simpleRuleTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.simpleRuleText}
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
              marginTop: "30px",
              display: "grid",
              gap: "12px",
            }}
          >
            {issueSteps.map((step) => (
              <div
                key={step.number}
                className="kf-local-step-card"
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
                  className="kf-local-step-number"
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
                  {step.number}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "19px",
                      margin: "0 0 7px",
                    }}
                  >
                    {step.title[language]}
                  </h3>

                  <p
                    style={{
                      color: "#94a3b8",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {step.text[language]}
                  </p>
                </div>
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
            <SimpleCard
              icon="📍"
              title={t.locationTitle}
              text={t.locationText}
            />

            <SimpleCard
              icon="📸"
              title={t.evidenceTitle}
              text={t.evidenceText}
            />

            <SimpleCard
              icon="📝"
              title={t.descriptionTitle}
              text={t.descriptionText}
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
            className="kf-local-callout"
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
              {t.thinkLocalTitle}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {t.thinkLocalText}
            </p>
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
                  const isSelected =
                    selectedAnswer === index;
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
                      key={`${index}-${option.en}`}
                      type="button"
                      onClick={() => handleAnswer(index)}
                      className="kf-quiz-answer"
                      data-quiz-state={
                        selectedAnswer === null
                          ? "idle"
                          : isCorrect
                          ? "correct"
                          : isSelected
                          ? "wrong"
                          : "idle"
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
          className="kf-explore-footer"
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
        .kf-local-issues-page {
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

        .kf-local-issues-page > div {
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

        .kf-simple-card h3 {
          color: var(--kf-ink) !important;
        }

        .kf-simple-card p {
          color: var(--kf-body) !important;
        }

        .kf-local-issues-page header {
          margin-bottom: 16px !important;
          padding: 12px 14px !important;
          border: 1px solid var(--kf-line) !important;
          border-radius: 25px !important;
          background: rgba(255,253,249,.96) !important;
          box-shadow: 0 14px 36px rgba(16,27,43,.055) !important;
          backdrop-filter: blur(16px);
        }

        .kf-local-issues-page header div {
          color: var(--kf-navy) !important;
        }

        .kf-local-issues-page header .kf-logo-box {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        .kf-local-issues-page header select {
          background: #fffdf9 !important;
          color: #304154 !important;
          border: 1px solid #d7d1c9 !important;
          border-radius: 999px !important;
        }

        .kf-local-issues-page header button {
          color: #4d6070 !important;
          border-color: #dad4cc !important;
          border-radius: 999px !important;
          background: #fffdf9 !important;
        }

        .kf-local-issues-page > div > section {
          margin-bottom: 16px !important;
          padding: 30px !important;
          border: 1px solid var(--kf-line) !important;
          border-radius: 31px !important;
          box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
        }

        /* Local Issues has 6 content sections + 1 quiz:
           section 1 = hero, sections 2-7 = content, section 8 = quiz. */
        .kf-local-issues-page > div > section:nth-of-type(1) {
          padding: 32px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97) !important;
        }

        /* Constitution-style editorial color rhythm. */
        .kf-local-issues-page > div > section:nth-of-type(2) {
          background: rgba(255,253,249,.98) !important;
          border-color: var(--kf-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(3) {
          background: var(--kf-blue) !important;
          border-color: var(--kf-blue-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(4) {
          background: var(--kf-peach) !important;
          border-color: var(--kf-peach-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(5) {
          background: var(--kf-green) !important;
          border-color: var(--kf-green-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(6) {
          background: var(--kf-lavender) !important;
          border-color: var(--kf-lavender-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(7) {
          background: var(--kf-blue) !important;
          border-color: var(--kf-blue-line) !important;
        }

        .kf-local-issues-page h1,
        .kf-local-issues-page h2,
        .kf-local-issues-page h3 {
          color: var(--kf-ink) !important;
          font-family: var(--font-display) !important;
        }

        .kf-local-issues-page h2 {
          font-size: 40px !important;
          line-height: 1.08 !important;
          letter-spacing: "-.035em" !important;
          font-weight: 800 !important;
        }

        .kf-local-issues-page p,
        .kf-local-issues-page li {
          color: var(--kf-body) !important;
        }

        .kf-local-issues-page [style*="background"] {
          box-shadow: 0 9px 22px rgba(16,27,43,.035) !important;
        }


        .kf-local-issues-page > div > section:nth-of-type(2) .kf-simple-card:nth-child(1),
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-simple-card:nth-child(1) {
          background: #edf5fa !important;
          border-color: #d6e5ed !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(2) .kf-simple-card:nth-child(2),
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-simple-card:nth-child(2) {
          background: #fff2e4 !important;
          border-color: #eedbc6 !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(2) .kf-simple-card:nth-child(3),
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-simple-card:nth-child(3) {
          background: #eef6e7 !important;
          border-color: #d5e5ca !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(2) .kf-simple-card:nth-child(4),
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-simple-card:nth-child(4) {
          background: #f4eff9 !important;
          border-color: #dfd4ea !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(2) .kf-simple-card,
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-simple-card {
          box-shadow: 0 8px 24px rgba(16,27,43,.035) !important;
        }

        /* White editorial cards inside the pastel sections. */
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(2) [style*="background"],
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(4) [style*="background"],
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(5) [style*="background"],
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(6) [style*="background"],
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(7) [style*="background"] {
          background: rgba(255,253,249,.80) !important;
          border: 1px solid rgba(16,27,43,.075) !important;
          border-radius: 22px !important;
        }

        /* Warm editorial callouts, matching the Constitution page. */
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(4) > div:last-child,
        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(7) > div:last-child {
          background: rgba(255,253,249,.82) !important;
          border: 1px solid rgba(16,27,43,.075) !important;
          border-radius: 23px !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(3) > div:last-child {
          background: rgba(255,253,249,.82) !important;
          border: 1px solid rgba(16,27,43,.075) !important;
          border-radius: 23px !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(1) [style*="color: #ff7a00"],
        .kf-local-issues-page [style*="color: #ff7a00"] {
          color: #9c6b42 !important;
        }

        /* Quiz is section 8 on Local Issues. */
        .kf-local-issues-page > div > section:nth-of-type(8) {
          position: relative !important;
          overflow: hidden !important;
          padding: 30px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.95) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.88) 0%, rgba(255,232,210,0) 34%),
            rgba(255,253,249,.98) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(8) button {
          border-radius: 19px !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer {
          color: #425565 !important;
          background: #fffdf9 !important;
          border-color: #ded9d1 !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-next {
          color: #fff !important;
          background: var(--kf-orange) !important;
          border-color: var(--kf-orange) !important;
        }

        .kf-local-issues-page > div > div:last-child {
          color: #89939a !important;
          text-align: center !important;
        }

        @media (max-width: 900px) {
          .kf-local-issues-page > div > section {
            padding: 22px !important;
          }

          .kf-local-issues-page > div > section:first-of-type > div {
            grid-template-columns: 1fr !important;
          }

          .kf-local-issues-page > div > section:first-of-type h1 {
            font-size: 58px !important;
          }

          .kf-local-issues-page h2 {
            font-size: 36px !important;
          }

          .kf-local-issues-page > div > section:first-of-type > div > div:last-child {
            width: fit-content;
            min-width: 0;
          }
        }

        @media (max-width: 680px) {
          .kf-local-issues-page {
            padding: 12px 10px 44px !important;
          }

          .kf-local-issues-page > div > section {
            padding: 20px !important;
            border-radius: 24px !important;
          }

          .kf-local-issues-page header {
            padding: 11px 12px !important;
          }
        }

        /* =========================================================
           LOCAL ISSUES — ELECTIONS THEME
           Shared visual language for bright + dark modes.
           Does not change content or layout structure.
           ========================================================= */

        /* ---- Common page shell ---- */
        .kf-local-issues-page {
          --local-ivory: #f8f3ea;
          --local-white: #fffdf9;
          --local-ink: #263447;
          --local-body: #596a78;
          --local-muted: #7b8790;
          --local-orange: #ff7a00;
          --local-blue: #edf5fa;
          --local-blue-line: #d6e5ed;
          --local-peach: #fff2e4;
          --local-peach-line: #eedbc6;
          --local-green: #eef6e7;
          --local-green-line: #d5e5ca;
          --local-lavender: #f4eff9;
          --local-lavender-line: #dfd4ea;
          --local-line: #ddd7ce;
          min-height: 100vh !important;
          background:
            radial-gradient(circle at 92% 2%, rgba(215,232,242,.95) 0%, rgba(215,232,242,0) 26%),
            radial-gradient(circle at 5% 35%, rgba(231,242,248,.78) 0%, rgba(231,242,248,0) 25%),
            radial-gradient(circle at 92% 93%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 28%),
            var(--local-ivory) !important;
          color: var(--local-body) !important;
          font-family: var(--font-body) !important;
          overflow-x: hidden !important;
        }

        .kf-local-issues-page > div {
          width: min(1120px, 100%) !important;
          max-width: none !important;
          margin: 0 auto !important;
          background: transparent !important;
        }

        /* ---- Navbar ---- */
        .kf-local-issues-page .kf-explore-topbar {
          margin-bottom: 16px !important;
          padding: 12px 14px !important;
          border: 1px solid var(--local-line) !important;
          border-radius: 25px !important;
          background: rgba(255,253,249,.96) !important;
          box-shadow: 0 14px 36px rgba(16,27,43,.055) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .kf-local-issues-page .kf-explore-brand-name {
          color: #102033 !important;
        }

        .kf-local-issues-page .kf-explore-brand-name span {
          color: #ff7a00 !important;
        }

        .kf-local-issues-page .kf-explore-brand-caption {
          color: #8b938f !important;
        }

        .kf-local-issues-page .kf-explore-brand-box {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        .kf-local-issues-page .kf-explore-back {
          color: #4d6070 !important;
          border-color: #dad4cc !important;
          background: #fffdf9 !important;
        }

        .kf-local-issues-page .kf-explore-back span {
          color: #ff7a00 !important;
        }

        .kf-local-issues-page .kf-explore-language {
          color: #53636f !important;
        }

        .kf-local-issues-page .kf-explore-language-select,
        .kf-local-issues-page .kf-explore-language select {
          background: #fffdf9 !important;
          color: #304154 !important;
          border-color: #d7d1c9 !important;
        }

        /* ---- Hero ---- */
        .kf-local-issues-page .kf-explore-hero {
          margin-bottom: 16px !important;
          padding: 32px !important;
          border: 1px solid var(--local-line) !important;
          border-radius: 31px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
            rgba(255,253,249,.97) !important;
          box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
        }

        .kf-local-issues-page .kf-explore-hero h1 {
          color: var(--local-ink) !important;
          font-family: var(--font-display) !important;
          letter-spacing: -.045em !important;
        }

        .kf-local-issues-page .kf-explore-hero p {
          color: var(--local-body) !important;
        }

        .kf-local-issues-page .kf-explore-topic-badge {
          min-width: 250px !important;
          background: #fff2e4 !important;
          border-color: #eedbc6 !important;
          color: var(--local-ink) !important;
          border-radius: 28px !important;
        }

        .kf-local-issues-page .kf-explore-topic-badge-icon {
          background: #fffdf9 !important;
          border-color: #eadfd2 !important;
        }

        /* ---- Content sections ---- */
        .kf-local-issues-page > div > section {
          margin-bottom: 16px !important;
          padding: 30px !important;
          border: 1px solid var(--local-line) !important;
          border-radius: 31px !important;
          box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
        }

        .kf-local-issues-page > div > section h2,
        .kf-local-issues-page > div > section h3 {
          color: var(--local-ink) !important;
          font-family: var(--font-display) !important;
        }

        .kf-local-issues-page > div > section > div:first-child {
          color: #9c6b42 !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(2) {
          background: var(--local-blue) !important;
          border-color: var(--local-blue-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(3) {
          background: var(--local-peach) !important;
          border-color: var(--local-peach-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(4) {
          background: var(--local-green) !important;
          border-color: var(--local-green-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(5) {
          background: var(--local-lavender) !important;
          border-color: var(--local-lavender-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(6) {
          background: var(--local-blue) !important;
          border-color: var(--local-blue-line) !important;
        }

        .kf-local-issues-page > div > section:nth-of-type(7) {
          background: var(--local-peach) !important;
          border-color: var(--local-peach-line) !important;
        }

        .kf-local-issues-page .kf-explore-eyebrow {
          color: #9c6b42 !important;
        }

        /* ---- Cards ---- */
        .kf-local-issues-page .kf-local-issue-card {
          position: relative !important;
          overflow: hidden !important;
          background: rgba(255,253,249,.80) !important;
          border: 1px solid rgba(16,27,43,.075) !important;
          border-radius: 22px !important;
          box-shadow: 0 9px 22px rgba(16,27,43,.035) !important;
        }

        /* pastel rhythm for local-body cards */
        .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(1),
        .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(1) {
          background: #edf5fa !important;
          border-color: #d6e5ed !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(2),
        .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(2) {
          background: #fff2e4 !important;
          border-color: #eedbc6 !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(3),
        .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(3) {
          background: #eef6e7 !important;
          border-color: #d5e5ca !important;
        }

        /* six everyday-issue cards */
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(1),
        .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(1) {
          background: #edf5fa !important; border-color: #d6e5ed !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(2),
        .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(2) {
          background: #fff2e4 !important; border-color: #eedbc6 !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(3),
        .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(3) {
          background: #eef6e7 !important; border-color: #d5e5ca !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(4),
        .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(4) {
          background: #f4eff9 !important; border-color: #dfd4ea !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(5),
        .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(5) {
          background: #edf5fa !important; border-color: #d6e5ed !important;
        }
        .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(6) {
          background: #fff2e4 !important; border-color: #eedbc6 !important;
        }

        .kf-local-issues-page .kf-local-issue-card h3,
        .kf-local-issues-page .kf-local-step-card h3 {
          color: var(--local-ink) !important;
        }

        .kf-local-issues-page .kf-local-issue-card p,
        .kf-local-issues-page .kf-local-step-card p {
          color: var(--local-body) !important;
        }

        .kf-local-issues-page .kf-local-step-card {
          border-radius: 20px !important;
          border: 1px solid rgba(16,27,43,.075) !important;
          box-shadow: 0 9px 22px rgba(16,27,43,.035) !important;
          background: rgba(255,253,249,.82) !important;
        }

        .kf-local-issues-page .kf-local-step-number {
          border-radius: 14px !important;
        }

        /* ---- Callouts ---- */
        .kf-local-issues-page .kf-local-callout {
          border-radius: 23px !important;
          box-shadow: 0 12px 28px rgba(16,27,43,.045) !important;
        }

        /* ---- Quiz ---- */
        .kf-local-issues-page .kf-quiz-section {
          position: relative !important;
          overflow: hidden !important;
          padding: 30px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(218,235,244,.95) 0%, rgba(218,235,244,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(255,232,210,.88) 0%, rgba(255,232,210,0) 34%),
            rgba(255,253,249,.98) !important;
          border: 1px solid var(--local-line) !important;
          border-radius: 24px !important;
          box-shadow: 0 14px 38px rgba(16,27,43,.05) !important;
          color: var(--local-ink) !important;
        }

        .kf-local-issues-page .kf-quiz-answer {
          background: #fffdf9 !important;
          color: #425565 !important;
          border-color: #ded9d1 !important;
          border-radius: 19px !important;
        }

        .kf-local-issues-page .kf-quiz-answer:hover {
          background: #ffffff !important;
          color: #304b5f !important;
          border-color: #cfc8bf !important;
        }

        .kf-local-issues-page .kf-quiz-answer[data-quiz-state="correct"] {
          background: rgba(34,197,94,.08) !important;
          color: #425565 !important;
          border-color: #22c55e !important;
        }

        .kf-local-issues-page .kf-quiz-answer[data-quiz-state="wrong"] {
          background: rgba(239,68,68,.08) !important;
          color: #425565 !important;
          border-color: #ef4444 !important;
        }

        .kf-local-issues-page .kf-quiz-next {
          background: #ff7a00 !important;
          color: #fff !important;
          border-color: #ff7a00 !important;
        }

        .kf-local-issues-page .kf-quiz-restart {
          color: #4d6070 !important;
          background: transparent !important;
          border-color: #cfc8bf !important;
        }

        .kf-local-issues-page .kf-explore-footer {
          color: #89939a !important;
          text-align: center !important;
        }

        /* ---- Dark mode: exact Elections visual language ---- */
        html[data-theme="dark"] .kf-local-issues-page {
          min-height: 100vh !important;
          padding: 32px 5% 70px !important;
          background:
            radial-gradient(circle at 90% 0%, rgba(57,118,177,.16), transparent 28%),
            radial-gradient(circle at 6% 78%, rgba(255,122,26,.055), transparent 23%),
            linear-gradient(180deg, #07111f 0%, #091625 52%, #07111f 100%) !important;
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div {
          position: relative !important;
          background: transparent !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topbar {
          position: sticky !important;
          top: 12px !important;
          z-index: 999 !important;
          min-height: 0 !important;
          height: auto !important;
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

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topbar::before {
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

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topbar::after {
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

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topbar > * {
          position: relative !important;
          z-index: 2 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-back {
          min-height: 40px !important;
          background: rgba(7,16,28,.58) !important;
          color: #e8f0f7 !important;
          border-color: rgba(137,169,202,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-back span {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-brand-box {
          width: 42px !important;
          height: 42px !important;
          border-radius: 14px !important;
          background: #ff7a00 !important;
          color: #ffffff !important;
          box-shadow: 0 8px 22px rgba(255,122,0,.24) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-brand-name {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-brand-name span {
          color: #ff7a00 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-brand-caption {
          color: #7f97ad !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-language {
          color: #9fb1c3 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-language-select,
        html[data-theme="dark"] .kf-local-issues-page .kf-explore-language select {
          min-width: 112px !important;
          padding: 9px 13px !important;
          background: rgba(7,16,28,.58) !important;
          color: #e8f0f7 !important;
          border-color: rgba(137,169,202,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-language select option {
          background: #10243a !important;
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-hero {
          margin-bottom: 16px !important;
          background:
            radial-gradient(circle at 94% 0%, rgba(58,116,167,.25) 0%, rgba(58,116,167,0) 34%),
            radial-gradient(circle at 0% 100%, rgba(181,119,57,.16) 0%, rgba(181,119,57,0) 34%),
            linear-gradient(145deg, #10263c 0%, #0d2034 54%, #091827 100%) !important;
          border-color: rgba(102,156,202,.22) !important;
          box-shadow:
            0 20px 50px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-hero h1 {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-hero p {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-eyebrow {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topic-badge {
          min-width: 255px !important;
          background: linear-gradient(145deg, rgba(7,18,31,.78), rgba(16,37,58,.72)) !important;
          border-color: rgba(104,159,208,.21) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-topic-badge-icon {
          background: rgba(255,255,255,.06) !important;
          border-color: rgba(135,169,198,.16) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-hero > div {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section {
          color: #f5f7fb !important;
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section h2,
        html[data-theme="dark"] .kf-local-issues-page > div > section h3 {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section > div:first-child,
        html[data-theme="dark"] .kf-local-issues-page .kf-explore-eyebrow {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page p {
          color: #aebed0 !important;
        }

        /* Election-style premium cards. */
        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card {
          position: relative !important;
          overflow: hidden !important;
          color: #f5f8fb !important;
          background:
            linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.008) 28%, transparent 62%),
            rgba(7,16,28,.90) !important;
          border: 1px solid rgba(143,178,207,.18) !important;
          border-radius: 20px !important;
          box-shadow:
            0 18px 38px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.045) !important;
          backdrop-filter: blur(12px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(125%) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card::before,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card::before {
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

        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card > *,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card > * {
          position: relative !important;
          z-index: 1 !important;
        }

        /* Local government cards: blue / amber / green. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(1),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(1) {
          background: radial-gradient(circle at 88% 8%, rgba(35,142,255,.16), transparent 32%), linear-gradient(145deg, #102d47, #0a1c2e) !important;
          border-color: rgba(55,166,255,.30) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(2),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(2) {
          background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.15), transparent 32%), linear-gradient(145deg, #3d2711, #1b110a) !important;
          border-color: rgba(255,173,47,.34) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(3),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(3) {
          background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.15), transparent 32%), linear-gradient(145deg, #0d3d37, #071e20) !important;
          border-color: rgba(0,223,192,.32) !important;
        }

        /* Everyday issue cards use Elections palette rhythm. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(1),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(5) {
          background: radial-gradient(circle at 88% 8%, rgba(35,142,255,.13), transparent 30%), linear-gradient(145deg, #102d47, #0a1c2e) !important;
          border-color: rgba(55,166,255,.28) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(2),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(6) {
          background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
          border-color: rgba(255,173,47,.30) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(3) {
          background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
          border-color: rgba(0,223,192,.30) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(4) {
          background: radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%), linear-gradient(145deg, #171d58, #0b1030) !important;
          border-color: rgba(123,109,255,.30) !important;
        }

        /* Document / evidence cards can reuse blue / amber / teal. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(1) {
          background: radial-gradient(circle at 88% 8%, rgba(24,191,255,.14), transparent 30%), linear-gradient(145deg, #12365d, #081a31) !important;
          border-color: rgba(24,191,255,.32) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(2) {
          background: radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%), linear-gradient(145deg, #3d2711, #1b110a) !important;
          border-color: rgba(255,173,47,.30) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(6) .kf-local-issue-card:nth-child(3) {
          background: radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%), linear-gradient(145deg, #103a36, #071f20) !important;
          border-color: rgba(0,223,192,.30) !important;
        }

        /* Reapply readable card text over inline styles. */
        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card h3,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card h3 {
          color: #f7f9fc !important;
        }
        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card p,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card p {
          color: #aebfd0 !important;
        }

        /* Steps and number pills. */
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card {
          background: linear-gradient(145deg, #10263c, #091827) !important;
          border-color: rgba(102,156,202,.22) !important;
        }
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-number {
          background: rgba(255,140,26,.10) !important;
          color: #ff983f !important;
          border: 1px solid rgba(255,140,26,.28) !important;
        }

        /* Callouts / info panels. */
        html[data-theme="dark"] .kf-local-issues-page .kf-local-callout {
          background:
            linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.006)),
            #0b1929 !important;
          border-color: rgba(129,168,199,.18) !important;
          color: #f5f8fb !important;
          box-shadow:
            0 14px 30px rgba(0,0,0,.22),
            inset 0 1px 0 rgba(255,255,255,.04) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-callout h3 {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-callout p {
          color: #aebfd0 !important;
        }

        /* Quiz — exact Elections answer / action separation. */
        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-section {
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

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-answer {
          background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
          color: #f7f9fc !important;
          border: 1px solid rgba(146,176,204,.24) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.045),
            0 8px 20px rgba(0,0,0,.18) !important;
          text-shadow: 0 1px 2px rgba(0,0,0,.55) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-answer:hover {
          background: linear-gradient(135deg, #0b1a2b 0%, #10223a 100%) !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,.28) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-answer[data-quiz-state="correct"] {
          background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
          color: #08111b !important;
          border-color: #ffad63 !important;
          box-shadow:
            0 8px 24px rgba(255,122,26,.24),
            inset 0 1px 0 rgba(255,255,255,.18) !important;
          text-shadow: none !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-answer[data-quiz-state="wrong"] {
          background: linear-gradient(135deg, #1a1216 0%, #120d12 100%) !important;
          color: #fff4f4 !important;
          border-color: rgba(239,68,68,.72) !important;
          box-shadow:
            0 8px 20px rgba(239,68,68,.10),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-next {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #111923 !important;
          border: 1px solid rgba(255,176,112,.55) !important;
          box-shadow:
            0 8px 18px rgba(255,122,0,.22),
            0 0 20px rgba(255,122,0,.16) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-quiz-restart {
          color: #d6e1ec !important;
          background: transparent !important;
          border-color: rgba(137,169,202,.22) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-explore-footer {
          color: #7f97ad !important;
        }

        /* =========================================================
           LOCAL ISSUES — FINAL DARK SURFACE ISOLATION
           Prevent light-mode wrapper/card surfaces from leaking into
           dark mode. Grid wrappers stay transparent; only the actual
           cards/callouts receive painted surfaces.
           ========================================================= */
        html[data-theme="dark"] .kf-local-issues-page > div > section > div[style*="display: grid"] {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card {
          background:
            linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.008) 28%, transparent 62%),
            #0b1929 !important;
          color: #f5f8fb !important;
          border-color: rgba(143,178,207,.20) !important;
          box-shadow:
            0 18px 38px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.045) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card h3,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card h3 {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-local-issues-page .kf-local-issue-card p,
        html[data-theme="dark"] .kf-local-issues-page .kf-local-step-card p {
          color: #aebfd0 !important;
        }

        /* Preserve the Elections-style color rhythm, but keep every
           card definitively dark. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(1),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(1),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(5) {
          background:
            radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%),
            linear-gradient(145deg, #12365d, #081a31) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(2),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(2),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(6) {
          background:
            radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%),
            linear-gradient(145deg, #3d2711, #1b110a) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(2) .kf-local-issue-card:nth-child(3),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(3) {
          background:
            radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%),
            linear-gradient(145deg, #103a36, #071f20) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(3) .kf-local-issue-card:nth-child(4) {
          background:
            radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%),
            linear-gradient(145deg, #171d58, #0b1030) !important;
        }

        /* Final quiz safety: only the actual correct answer gets the
           orange feedback state; no positional selector is used. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer {
          background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
          color: #f7f9fc !important;
          border-color: rgba(146,176,204,.24) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="correct"] {
          background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
          color: #08111b !important;
          border-color: #ffad63 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="wrong"] {
          background: linear-gradient(135deg, #1a1216 0%, #120d12 100%) !important;
          color: #fff4f4 !important;
          border-color: rgba(239,68,68,.72) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-next {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #111923 !important;
          border-color: rgba(255,176,112,.55) !important;
        }

        /* ---- Mobile ---- */
        @media (max-width: 900px) {
          .kf-local-issues-page > div > section {
            padding: 22px !important;
          }
        }

        @media (max-width: 680px) {
          .kf-local-issues-page {
            padding: 12px 10px 44px !important;
          }

          .kf-local-issues-page .kf-explore-topbar {
            grid-template-columns: 1fr 1fr !important;
          }

          .kf-local-issues-page .kf-explore-brand {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            grid-row: 1 !important;
          }

          .kf-local-issues-page .kf-explore-back {
            grid-column: 1 !important;
            grid-row: 2 !important;
          }

          .kf-local-issues-page .kf-explore-language {
            grid-column: 2 !important;
            grid-row: 2 !important;
          }

          .kf-local-issues-page .kf-explore-language > span {
            display: none !important;
          }

          .kf-local-issues-page .kf-explore-hero {
            padding: 24px !important;
          }

          .kf-local-issues-page .kf-explore-hero-row {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .kf-local-issues-page .kf-explore-topic-badge {
            min-width: 0 !important;
            width: 100% !important;
          }

          html[data-theme="dark"] .kf-local-issues-page .kf-explore-topbar {
            top: 10px !important;
            margin-bottom: 26px !important;
            padding: 9px 11px !important;
            border-radius: 20px !important;
          }

          html[data-theme="dark"] .kf-local-issues-page .kf-explore-brand-box {
            width: 38px !important;
            height: 38px !important;
            border-radius: 12px !important;
            font-size: 21px !important;
          }

          html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) {
            border-radius: 20px !important;
          }
        }

        @media (min-width: 681px) {
          .kf-local-issues-page .kf-explore-brand-box {
            width: 48px !important;
            height: 48px !important;
            border-radius: 14px !important;
            font-size: 25px !important;
          }

          .kf-local-issues-page .kf-explore-brand-name {
            font-size: 29px !important;
          }
        }


        /* =========================================================
           LOCAL ISSUES — FINAL FIX FOR SECTION 04 + QUIZ
           Section 04 is the 5th <section> on the page because the
           hero is the first <section>. The earlier light-mode
           nth-child card rules have higher specificity, so these
           dark selectors intentionally match that specificity.
           ========================================================= */

        /* Section 04 step cards: definitively dark in dark mode. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) > div[style*="display: grid"] {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(1),
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(5) {
          background:
            radial-gradient(circle at 88% 8%, rgba(24,191,255,.13), transparent 30%),
            linear-gradient(145deg, #12365d, #081a31) !important;
          border-color: rgba(24,191,255,.30) !important;
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(2) {
          background:
            radial-gradient(circle at 88% 8%, rgba(255,173,47,.13), transparent 30%),
            linear-gradient(145deg, #3d2711, #1b110a) !important;
          border-color: rgba(255,173,47,.30) !important;
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(3) {
          background:
            radial-gradient(circle at 88% 8%, rgba(0,223,192,.13), transparent 30%),
            linear-gradient(145deg, #103a36, #071f20) !important;
          border-color: rgba(0,223,192,.30) !important;
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card:nth-child(4) {
          background:
            radial-gradient(circle at 88% 8%, rgba(123,109,255,.14), transparent 30%),
            linear-gradient(145deg, #171d58, #0b1030) !important;
          border-color: rgba(123,109,255,.30) !important;
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card h3 {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-card p {
          color: #aebfd0 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(5) .kf-local-step-number {
          background: rgba(255,140,26,.10) !important;
          color: #ff983f !important;
          border-color: rgba(255,140,26,.28) !important;
        }

        /* Quiz: answer options and action button are class-only.
           No positional :last-child styling can affect answers. */
        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer {
          background: linear-gradient(135deg, #07111f 0%, #0b1726 100%) !important;
          color: #f7f9fc !important;
          border-color: rgba(146,176,204,.24) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.045),
            0 8px 20px rgba(0,0,0,.18) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer:hover {
          background: linear-gradient(135deg, #0b1a2b 0%, #10223a 100%) !important;
          color: #ffffff !important;
          border-color: rgba(255,255,255,.28) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="correct"] {
          background: linear-gradient(135deg, #ff983f 0%, #ff7a00 100%) !important;
          color: #08111b !important;
          border-color: #ffad63 !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="wrong"] {
          background: linear-gradient(135deg, #1a1216 0%, #120d12 100%) !important;
          color: #fff4f4 !important;
          border-color: rgba(239,68,68,.72) !important;
        }

        html[data-theme="dark"] .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-next {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #111923 !important;
          border-color: rgba(255,176,112,.55) !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer {
          background: #fffdf9 !important;
          color: #425565 !important;
          border-color: #ded9d1 !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="correct"] {
          background: rgba(34,197,94,.08) !important;
          color: #425565 !important;
          border-color: #22c55e !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-answer[data-quiz-state="wrong"] {
          background: rgba(239,68,68,.08) !important;
          color: #425565 !important;
          border-color: #ef4444 !important;
        }

        html:not([data-theme="dark"]) .kf-local-issues-page > div > section:nth-of-type(8) .kf-quiz-next {
          background: var(--kf-orange) !important;
          color: #fff !important;
          border-color: var(--kf-orange) !important;
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
      className="kf-local-issue-card"
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