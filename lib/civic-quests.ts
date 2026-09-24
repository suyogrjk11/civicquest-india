type Language = "en" | "hi" | "mr";

type Localized = Record<Language, string>;

type KarmaFacieion = {
  question: Localized;
  options: Record<Language, string[]>;
  correctAnswer: number;
  explanation: Localized;
};

export const constitutionQuest = {
  title: {
    en: "The Constitution of India",
    hi: "भारत का संविधान",
    mr: "भारताची राज्यघटना",
  },

  description: {
    en: "Test your understanding of the Constitution, Fundamental Rights, Duties and democratic system.",
    hi: "संविधान, मौलिक अधिकार, कर्तव्य और लोकतांत्रिक व्यवस्था की अपनी समझ को परखें।",
    mr: "राज्यघटना, मूलभूत अधिकार, कर्तव्य आणि लोकशाही व्यवस्थेबद्दलची तुमची समज तपासा.",
  },

  xpPerQuestion: 10,

  questions: [
    {
      question: {
        en: "Where are Fundamental Rights primarily provided in the Constitution of India?",
        hi: "भारत के संविधान में मौलिक अधिकार मुख्य रूप से कहाँ दिए गए हैं?",
        mr: "भारताच्या राज्यघटनेत मूलभूत अधिकार प्रामुख्याने कुठे दिले आहेत?",
      },
      options: {
        en: ["Part III", "Part IV", "Part IVA", "Part IX"],
        hi: ["भाग III", "भाग IV", "भाग IVA", "भाग IX"],
        mr: ["भाग III", "भाग IV", "भाग IVA", "भाग IX"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Fundamental Rights are contained in Part III of the Constitution.",
        hi: "मौलिक अधिकार संविधान के भाग III में दिए गए हैं।",
        mr: "मूलभूत अधिकार राज्यघटनेच्या भाग III मध्ये दिले आहेत.",
      },
    },

    {
      question: {
        en: "Which of the following is a Fundamental Duty?",
        hi: "निम्नलिखित में से कौन सा मौलिक कर्तव्य है?",
        mr: "खालीलपैकी कोणते मूलभूत कर्तव्य आहे?",
      },
      options: {
        en: [
          "Protect and improve the natural environment",
          "Elect the Prime Minister directly",
          "Appoint Supreme Court judges",
          "Pass the Union Budget",
        ],
        hi: [
          "प्राकृतिक पर्यावरण की रक्षा और सुधार करना",
          "प्रधानमंत्री को सीधे चुनना",
          "सर्वोच्च न्यायालय के न्यायाधीश नियुक्त करना",
          "केंद्रीय बजट पारित करना",
        ],
        mr: [
          "नैसर्गिक पर्यावरणाचे संरक्षण व सुधारणा करणे",
          "पंतप्रधानांची थेट निवड करणे",
          "सर्वोच्च न्यायालयाच्या न्यायाधीशांची नियुक्ती करणे",
          "केंद्रीय अर्थसंकल्प मंजूर करणे",
        ],
      },
      correctAnswer: 0,
      explanation: {
        en: "Protecting and improving the natural environment is one of the Fundamental Duties under Article 51A.",
        hi: "प्राकृतिक पर्यावरण की रक्षा और सुधार करना अनुच्छेद 51A के अंतर्गत मौलिक कर्तव्यों में से एक है।",
        mr: "नैसर्गिक पर्यावरणाचे संरक्षण व सुधारणा करणे हे अनुच्छेद 51A अंतर्गत मूलभूत कर्तव्यांपैकी एक आहे.",
      },
    },

    {
      question: {
        en: "Which Part of the Constitution contains the Directive Principles of State Policy?",
        hi: "संविधान के किस भाग में राज्य के नीति निदेशक तत्व दिए गए हैं?",
        mr: "राज्यघटनेच्या कोणत्या भागात राज्याच्या धोरणाची मार्गदर्शक तत्त्वे दिली आहेत?",
      },
      options: {
        en: ["Part II", "Part III", "Part IV", "Part V"],
        hi: ["भाग II", "भाग III", "भाग IV", "भाग V"],
        mr: ["भाग II", "भाग III", "भाग IV", "भाग V"],
      },
      correctAnswer: 2,
      explanation: {
        en: "The Directive Principles of State Policy are contained in Part IV.",
        hi: "राज्य के नीति निदेशक तत्व संविधान के भाग IV में दिए गए हैं।",
        mr: "राज्याच्या धोरणाची मार्गदर्शक तत्त्वे राज्यघटनेच्या भाग IV मध्ये दिली आहेत.",
      },
    },

    {
      question: {
        en: "Fundamental Duties are contained in which Part of the Constitution?",
        hi: "मौलिक कर्तव्य संविधान के किस भाग में दिए गए हैं?",
        mr: "मूलभूत कर्तव्य राज्यघटनेच्या कोणत्या भागात दिले आहेत?",
      },
      options: {
        en: ["Part III", "Part IV", "Part IVA", "Part VI"],
        hi: ["भाग III", "भाग IV", "भाग IVA", "भाग VI"],
        mr: ["भाग III", "भाग IV", "भाग IVA", "भाग VI"],
      },
      correctAnswer: 2,
      explanation: {
        en: "Fundamental Duties are contained in Part IVA of the Constitution.",
        hi: "मौलिक कर्तव्य संविधान के भाग IVA में दिए गए हैं।",
        mr: "मूलभूत कर्तव्य राज्यघटनेच्या भाग IVA मध्ये दिले आहेत.",
      },
    },

    {
      question: {
        en: "India has which form of government?",
        hi: "भारत में किस प्रकार की शासन प्रणाली है?",
        mr: "भारतामध्ये कोणती शासनपद्धती आहे?",
      },
      options: {
        en: [
          "Presidential system",
          "Parliamentary system",
          "Absolute monarchy",
          "Military government",
        ],
        hi: [
          "राष्ट्रपति प्रणाली",
          "संसदीय प्रणाली",
          "पूर्ण राजशाही",
          "सैन्य शासन",
        ],
        mr: [
          "अध्यक्षीय प्रणाली",
          "संसदीय प्रणाली",
          "संपूर्ण राजेशाही",
          "लष्करी शासन",
        ],
      },
      correctAnswer: 1,
      explanation: {
        en: "India follows a parliamentary form of government.",
        hi: "भारत में संसदीय शासन प्रणाली है।",
        mr: "भारतामध्ये संसदीय शासनपद्धती आहे.",
      },
    },

    {
      question: {
        en: "Which Article guarantees equality before the law and equal protection of laws?",
        hi: "कौन सा अनुच्छेद कानून के समक्ष समानता और कानूनों के समान संरक्षण की गारंटी देता है?",
        mr: "कायदा समोर समानता आणि कायद्यांचे समान संरक्षण कोणता अनुच्छेद सुनिश्चित करतो?",
      },
      options: {
        en: ["Article 14", "Article 19", "Article 21", "Article 32"],
        hi: ["अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21", "अनुच्छेद 32"],
        mr: ["अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21", "अनुच्छेद 32"],
      },
      correctAnswer: 0,
      explanation: {
        en: "Article 14 guarantees equality before the law and equal protection of the laws.",
        hi: "अनुच्छेद 14 कानून के समक्ष समानता और कानूनों के समान संरक्षण की गारंटी देता है।",
        mr: "अनुच्छेद 14 कायद्यापुढे समानता आणि कायद्यांचे समान संरक्षण सुनिश्चित करतो.",
      },
    },

    {
      question: {
        en: "Who is the constitutional head of the Union of India?",
        hi: "भारत संघ का संवैधानिक प्रमुख कौन है?",
        mr: "भारत संघाचे घटनात्मक प्रमुख कोण आहेत?",
      },
      options: {
        en: [
          "Prime Minister",
          "President",
          "Chief Justice of India",
          "Home Minister",
        ],
        hi: [
          "प्रधानमंत्री",
          "राष्ट्रपति",
          "भारत के मुख्य न्यायाधीश",
          "गृह मंत्री",
        ],
        mr: [
          "पंतप्रधान",
          "राष्ट्रपती",
          "भारताचे सरन्यायाधीश",
          "गृहमंत्री",
        ],
      },
      correctAnswer: 1,
      explanation: {
        en: "The President is the constitutional head of the Union.",
        hi: "राष्ट्रपति संघ के संवैधानिक प्रमुख होते हैं।",
        mr: "राष्ट्रपती हे संघाचे घटनात्मक प्रमुख आहेत.",
      },
    },

    {
      question: {
        en: "Which institution is known as the guardian of the Constitution?",
        hi: "किस संस्था को संविधान का संरक्षक माना जाता है?",
        mr: "कोणत्या संस्थेला राज्यघटनेचा संरक्षक मानले जाते?",
      },
      options: {
        en: [
          "Supreme Court",
          "Parliament",
          "Election Commission",
          "Finance Commission",
        ],
        hi: [
          "सर्वोच्च न्यायालय",
          "संसद",
          "निर्वाचन आयोग",
          "वित्त आयोग",
        ],
        mr: [
          "सर्वोच्च न्यायालय",
          "संसद",
          "निवडणूक आयोग",
          "वित्त आयोग",
        ],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Supreme Court plays a central role in protecting and interpreting the Constitution.",
        hi: "सर्वोच्च न्यायालय संविधान की रक्षा और व्याख्या में महत्वपूर्ण भूमिका निभाता है।",
        mr: "सर्वोच्च न्यायालय राज्यघटनेचे संरक्षण आणि अर्थ लावण्यात महत्त्वाची भूमिका बजावते.",
      },
    },

    {
      question: {
        en: "Which Article is associated with the Right to Constitutional Remedies?",
        hi: "कौन सा अनुच्छेद संवैधानिक उपचार के अधिकार से संबंधित है?",
        mr: "संवैधानिक उपायांच्या अधिकाराशी कोणता अनुच्छेद संबंधित आहे?",
      },
      options: {
        en: ["Article 14", "Article 19", "Article 21", "Article 32"],
        hi: ["अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21", "अनुच्छेद 32"],
        mr: ["अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21", "अनुच्छेद 32"],
      },
      correctAnswer: 3,
      explanation: {
        en: "Article 32 provides the Right to Constitutional Remedies for enforcement of Fundamental Rights.",
        hi: "अनुच्छेद 32 मौलिक अधिकारों के प्रवर्तन के लिए संवैधानिक उपचार का अधिकार देता है।",
        mr: "अनुच्छेद 32 मूलभूत अधिकारांच्या अंमलबजावणीसाठी संवैधानिक उपायांचा अधिकार देतो.",
      },
    },

    {
      question: {
        en: "The Constitution of India establishes India as a:",
        hi: "भारत का संविधान भारत को किस रूप में स्थापित करता है?",
        mr: "भारताची राज्यघटना भारताला कोणत्या स्वरूपाचे राष्ट्र म्हणून स्थापित करते?",
      },
      options: {
        en: [
          "Sovereign Socialist Secular Democratic Republic",
          "Absolute monarchy",
          "Military republic",
          "Unitary monarchy",
        ],
        hi: [
          "संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतांत्रिक गणराज्य",
          "पूर्ण राजशाही",
          "सैन्य गणराज्य",
          "एकात्मक राजशाही",
        ],
        mr: [
          "सार्वभौम समाजवादी धर्मनिरपेक्ष लोकशाही गणराज्य",
          "संपूर्ण राजेशाही",
          "लष्करी गणराज्य",
          "एकात्मक राजेशाही",
        ],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Preamble describes India as a Sovereign Socialist Secular Democratic Republic.",
        hi: "प्रस्तावना भारत को संपूर्ण प्रभुत्व-संपन्न समाजवादी पंथनिरपेक्ष लोकतांत्रिक गणराज्य के रूप में वर्णित करती है।",
        mr: "प्रास्ताविकेत भारताचे वर्णन सार्वभौम समाजवादी धर्मनिरपेक्ष लोकशाही गणराज्य असे केले आहे.",
      },
    },
  ] satisfies KarmaFacieion[],
};