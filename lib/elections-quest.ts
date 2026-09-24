import type { Language } from "@/lib/i18n";

type Localized = Record<Language, string>;

type KarmaFacieion = {
  question: Localized;
  options: Record<Language, string[]>;
  correctAnswer: number;
  explanation: Localized;
};

export const electionsQuest = {
  title: {
    en: "Elections & Voting",
    hi: "चुनाव और मतदान",
    mr: "निवडणुका आणि मतदान",
  },

  description: {
    en: "Learn how elections work in India, how voters participate, and how EVMs and VVPAT support the voting process.",
    hi: "जानें कि भारत में चुनाव कैसे होते हैं, मतदाता कैसे भाग लेते हैं और EVM व VVPAT मतदान प्रक्रिया में कैसे काम करते हैं।",
    mr: "भारतात निवडणुका कशा होतात, मतदार कसे सहभागी होतात आणि EVM व VVPAT मतदान प्रक्रियेत कसे काम करतात ते जाणून घ्या.",
  },

  xpPerQuestion: 10,

  questions: [
    {
      question: {
        en: "What is the minimum age for a citizen to be registered as an elector in India?",
        hi: "भारत में मतदाता के रूप में पंजीकरण के लिए न्यूनतम आयु कितनी है?",
        mr: "भारतात मतदार म्हणून नोंदणी करण्यासाठी किमान वय किती आहे?",
      },
      options: {
        en: ["16 years", "18 years", "21 years", "25 years"],
        hi: ["16 वर्ष", "18 वर्ष", "21 वर्ष", "25 वर्ष"],
        mr: ["16 वर्षे", "18 वर्षे", "21 वर्षे", "25 वर्षे"],
      },
      correctAnswer: 1,
      explanation: {
        en: "The Election Commission states that an applicant must be an Indian citizen aged 18 or more, with reference to the qualifying dates, and ordinarily resident in the concerned area.",
        hi: "निर्वाचन आयोग के अनुसार आवेदक भारतीय नागरिक होना चाहिए, निर्धारित पात्रता तिथियों के अनुसार उसकी आयु 18 वर्ष या उससे अधिक होनी चाहिए और वह संबंधित क्षेत्र का सामान्य निवासी होना चाहिए।",
        mr: "निवडणूक आयोगानुसार अर्जदार भारतीय नागरिक असावा, पात्रता तारखेनुसार त्याचे वय 18 वर्षे किंवा त्याहून अधिक असावे आणि तो संबंधित क्षेत्राचा सामान्य रहिवासी असावा.",
      },
    },

    {
      question: {
        en: "Which constitutional body has the superintendence, direction and control of elections to Parliament and State Legislatures?",
        hi: "संसद और राज्य विधानमंडलों के चुनावों का अधीक्षण, निर्देशन और नियंत्रण किस संवैधानिक संस्था के पास है?",
        mr: "संसद आणि राज्य विधानमंडळांच्या निवडणुकांचे अधीक्षण, निर्देशन आणि नियंत्रण कोणत्या घटनात्मक संस्थेकडे आहे?",
      },
      options: {
        en: ["Election Commission of India", "Union Public Service Commission", "Finance Commission", "Comptroller and Auditor General"],
        hi: ["भारत निर्वाचन आयोग", "संघ लोक सेवा आयोग", "वित्त आयोग", "भारत के नियंत्रक एवं महालेखा परीक्षक"],
        mr: ["भारत निवडणूक आयोग", "संघ लोकसेवा आयोग", "वित्त आयोग", "भारताचे नियंत्रक आणि महालेखापरीक्षक"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Article 324 of the Constitution vests the superintendence, direction and control of these elections in the Election Commission.",
        hi: "संविधान का अनुच्छेद 324 इन चुनावों के अधीक्षण, निर्देशन और नियंत्रण की जिम्मेदारी निर्वाचन आयोग को देता है।",
        mr: "राज्यघटनेतील अनुच्छेद 324 या निवडणुकांचे अधीक्षण, निर्देशन आणि नियंत्रण निवडणूक आयोगाकडे सोपवतो.",
      },
    },

    {
      question: {
        en: "What must be true for a person to vote in an election?",
        hi: "किसी व्यक्ति के चुनाव में मतदान करने के लिए क्या आवश्यक है?",
        mr: "एखाद्या व्यक्तीला निवडणुकीत मतदान करण्यासाठी काय आवश्यक आहे?",
      },
      options: {
        en: ["Their name must appear in the electoral roll", "They must own property", "They must hold a passport", "They must have a government job"],
        hi: ["उनका नाम मतदाता सूची में होना चाहिए", "उनके पास संपत्ति होनी चाहिए", "उनके पास पासपोर्ट होना चाहिए", "उनके पास सरकारी नौकरी होनी चाहिए"],
        mr: ["त्यांचे नाव मतदार यादीत असणे आवश्यक आहे", "त्यांच्या नावावर मालमत्ता असणे आवश्यक आहे", "त्यांच्याकडे पासपोर्ट असणे आवश्यक आहे", "त्यांच्याकडे सरकारी नोकरी असणे आवश्यक आहे"],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Election Commission states that a person can vote only if their name appears in the electoral roll.",
        hi: "निर्वाचन आयोग के अनुसार कोई व्यक्ति तभी मतदान कर सकता है जब उसका नाम मतदाता सूची में दर्ज हो।",
        mr: "निवडणूक आयोगानुसार एखादी व्यक्ती तेव्हाच मतदान करू शकते जेव्हा तिचे नाव मतदार यादीत नोंदलेले असते.",
      },
    },

    {
      question: {
        en: "What does EVM stand for?",
        hi: "EVM का पूरा नाम क्या है?",
        mr: "EVM चे पूर्ण रूप काय आहे?",
      },
      options: {
        en: ["Electronic Voting Machine", "Election Verification Machine", "Electronic Voter Monitor", "Election Voting Mechanism"],
        hi: ["इलेक्ट्रॉनिक वोटिंग मशीन", "इलेक्शन वेरिफिकेशन मशीन", "इलेक्ट्रॉनिक वोटर मॉनिटर", "इलेक्शन वोटिंग मैकेनिज्म"],
        mr: ["इलेक्ट्रॉनिक व्होटिंग मशीन", "इलेक्शन व्हेरिफिकेशन मशीन", "इलेक्ट्रॉनिक व्होटर मॉनिटर", "इलेक्शन व्होटिंग मेकॅनिझम"],
      },
      correctAnswer: 0,
      explanation: {
        en: "EVM stands for Electronic Voting Machine. The Election Commission describes it as an electronic system used for casting and counting votes.",
        hi: "EVM का अर्थ Electronic Voting Machine यानी इलेक्ट्रॉनिक वोटिंग मशीन है। इसका उपयोग वोट डालने और मतों की गणना की प्रक्रिया में किया जाता है।",
        mr: "EVM म्हणजे Electronic Voting Machine. मतदान नोंदवण्यासाठी आणि मतमोजणीच्या प्रक्रियेत याचा वापर केला जातो.",
      },
    },

    {
      question: {
        en: "What does VVPAT stand for?",
        hi: "VVPAT का पूरा नाम क्या है?",
        mr: "VVPAT चे पूर्ण रूप काय आहे?",
      },
      options: {
        en: ["Voter Verifiable Paper Audit Trail", "Voter Verified Polling and Tracking", "Voting Verification Paper and Technology", "Verified Voter Paper Authentication Tool"],
        hi: ["वोटर वेरिफाएबल पेपर ऑडिट ट्रेल", "वोटर वेरिफाइड पोलिंग एंड ट्रैकिंग", "वोटिंग वेरिफिकेशन पेपर एंड टेक्नोलॉजी", "वेरिफाइड वोटर पेपर ऑथेंटिकेशन टूल"],
        mr: ["व्होटर व्हेरिफायेबल पेपर ऑडिट ट्रेल", "व्होटर व्हेरिफाइड पोलिंग अँड ट्रॅकिंग", "व्होटिंग व्हेरिफिकेशन पेपर अँड टेक्नॉलॉजी", "व्हेरिफाइड व्होटर पेपर ऑथेंटिकेशन टूल"],
      },
      correctAnswer: 0,
      explanation: {
        en: "VVPAT stands for Voter Verifiable Paper Audit Trail. It provides a paper slip that the voter can see briefly after casting the vote.",
        hi: "VVPAT का अर्थ Voter Verifiable Paper Audit Trail है। मतदान के बाद मतदाता कुछ समय के लिए संबंधित कागजी पर्ची देख सकता है।",
        mr: "VVPAT म्हणजे Voter Verifiable Paper Audit Trail. मतदान केल्यानंतर मतदाराला संबंधित कागदी पावती काही काळ दिसते.",
      },
    },

    {
      question: {
        en: "For approximately how long is the VVPAT slip visible to the voter?",
        hi: "VVPAT पर्ची मतदाता को लगभग कितनी देर दिखाई देती है?",
        mr: "VVPAT ची पावती मतदाराला साधारण किती वेळ दिसते?",
      },
      options: {
        en: ["About 2 seconds", "About 7 seconds", "About 15 seconds", "About 30 seconds"],
        hi: ["लगभग 2 सेकंड", "लगभग 7 सेकंड", "लगभग 15 सेकंड", "लगभग 30 सेकंड"],
        mr: ["सुमारे 2 सेकंद", "सुमारे 7 सेकंद", "सुमारे 15 सेकंद", "सुमारे 30 सेकंद"],
      },
      correctAnswer: 1,
      explanation: {
        en: "The Election Commission's voter guidance says the VVPAT slip is visible through the transparent window for about 7 seconds before it drops into the sealed box.",
        hi: "निर्वाचन आयोग की मतदाता मार्गदर्शिका के अनुसार VVPAT पर्ची पारदर्शी खिड़की में लगभग 7 सेकंड दिखाई देती है और फिर सीलबंद बॉक्स में गिर जाती है।",
        mr: "निवडणूक आयोगाच्या मतदार मार्गदर्शिकेनुसार VVPAT ची पावती पारदर्शक खिडकीत सुमारे 7 सेकंद दिसते आणि त्यानंतर सीलबंद पेटीत पडते.",
      },
    },

    {
      question: {
        en: "What does NOTA mean on an EVM?",
        hi: "EVM पर NOTA का क्या अर्थ है?",
        mr: "EVM वरील NOTA चा अर्थ काय आहे?",
      },
      options: {
        en: ["None of the Above", "National Option to Abstain", "No Official Transfer Allowed", "New Option for Transparent Administration"],
        hi: ["इनमें से कोई नहीं", "राष्ट्रीय मतदान से विरत रहने का विकल्प", "कोई आधिकारिक स्थानांतरण नहीं", "पारदर्शी प्रशासन का नया विकल्प"],
        mr: ["वरीलपैकी कोणीही नाही", "मतदान न करण्याचा राष्ट्रीय पर्याय", "अधिकृत हस्तांतरणास परवानगी नाही", "पारदर्शक प्रशासनासाठी नवीन पर्याय"],
      },
      correctAnswer: 0,
      explanation: {
        en: "NOTA stands for None of the Above. The Election Commission's voter guidance identifies it as the last button on the EVM.",
        hi: "NOTA का अर्थ None of the Above यानी 'इनमें से कोई नहीं' है। निर्वाचन आयोग की मतदाता मार्गदर्शिका इसे EVM का अंतिम बटन बताती है।",
        mr: "NOTA म्हणजे None of the Above अर्थात 'वरीलपैकी कोणीही नाही'. निवडणूक आयोगाच्या मतदार मार्गदर्शिकेत ते EVM वरील शेवटचे बटण म्हणून नमूद आहे.",
      },
    },

    {
      question: {
        en: "Which document is used to record an elector's signature or thumb impression at the polling station?",
        hi: "मतदान केंद्र पर मतदाता के हस्ताक्षर या अंगूठे के निशान को दर्ज करने के लिए किस फॉर्म का उपयोग किया जाता है?",
        mr: "मतदान केंद्रावर मतदाराची स्वाक्षरी किंवा अंगठ्याचा ठसा नोंदवण्यासाठी कोणता फॉर्म वापरला जातो?",
      },
      options: {
        en: ["Form 17A", "Form 7", "Form 8", "Form 20"],
        hi: ["फॉर्म 17A", "फॉर्म 7", "फॉर्म 8", "फॉर्म 20"],
        mr: ["फॉर्म 17A", "फॉर्म 7", "फॉर्म 8", "फॉर्म 20"],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Election Commission's voting procedure says the second polling official takes the elector's signature in Form 17A.",
        hi: "निर्वाचन आयोग की मतदान प्रक्रिया के अनुसार दूसरा मतदान अधिकारी फॉर्म 17A में मतदाता के हस्ताक्षर दर्ज करता है।",
        mr: "निवडणूक आयोगाच्या मतदान प्रक्रियेनुसार दुसरा मतदान अधिकारी फॉर्म 17A मध्ये मतदाराची स्वाक्षरी नोंदवतो.",
      },
    },

    {
      question: {
        en: "Where can voters check their polling station and electoral-roll information online?",
        hi: "मतदाता अपने मतदान केंद्र और मतदाता सूची की जानकारी ऑनलाइन कहाँ देख सकते हैं?",
        mr: "मतदार आपले मतदान केंद्र आणि मतदार यादीची माहिती ऑनलाइन कुठे पाहू शकतात?",
      },
      options: {
        en: ["Election Commission's voter services/electoral search services", "Only at a bank branch", "Only at a passport office", "Only through a political party office"],
        hi: ["निर्वाचन आयोग की मतदाता सेवा/इलेक्टोरल सर्च सेवाएँ", "केवल बैंक शाखा में", "केवल पासपोर्ट कार्यालय में", "केवल किसी राजनीतिक दल के कार्यालय में"],
        mr: ["निवडणूक आयोगाच्या मतदार सेवा/इलेक्टोरल सर्च सेवा", "फक्त बँक शाखेत", "फक्त पासपोर्ट कार्यालयात", "फक्त राजकीय पक्षाच्या कार्यालयात"],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Election Commission provides online voter services for checking electoral-roll details, polling stations and related voter information.",
        hi: "निर्वाचन आयोग मतदाता सूची, मतदान केंद्र और संबंधित मतदाता जानकारी जाँचने के लिए ऑनलाइन सेवाएँ उपलब्ध कराता है।",
        mr: "निवडणूक आयोग मतदार यादी, मतदान केंद्र आणि संबंधित मतदार माहिती तपासण्यासाठी ऑनलाइन सेवा उपलब्ध करून देतो.",
      },
    },
  ],
};
