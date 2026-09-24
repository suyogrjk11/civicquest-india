import type { Language } from "@/lib/i18n";

type Localized = Record<Language, string>;

type KarmaFacieion = {
  question: Localized;
  options: Record<Language, string[]>;
  correctAnswer: number;
  explanation: Localized;
};

export const governanceQuest = {
  title: {
    en: "How India is Governed",
    hi: "भारत में शासन कैसे चलता है",
    mr: "भारतात शासन कसे चालते",
  },

  description: {
    en: "Understand the Union, State and Local levels of government and how responsibilities are organised.",
    hi: "केंद्र, राज्य और स्थानीय स्तर की सरकारों तथा जिम्मेदारियों के बंटवारे को समझें।",
    mr: "केंद्र, राज्य आणि स्थानिक पातळीवरील शासनव्यवस्था आणि जबाबदाऱ्यांची रचना समजून घ्या.",
  },

  xpPerQuestion: 10,

  questions: [
    {
      question: {
        en: "Which three levels of government are commonly used to describe India's governmental structure?",
        hi: "भारत की शासन व्यवस्था को समझने के लिए आम तौर पर सरकार के किन तीन स्तरों का उल्लेख किया जाता है?",
        mr: "भारताची शासनव्यवस्था समजून घेण्यासाठी सामान्यतः सरकारच्या कोणत्या तीन स्तरांचा उल्लेख केला जातो?",
      },
      options: {
        en: ["Union, State and Local", "Union, District and Village only", "State, District and Ward only", "Union and State only"],
        hi: ["केंद्र, राज्य और स्थानीय", "केवल केंद्र, जिला और गांव", "केवल राज्य, जिला और वार्ड", "केवल केंद्र और राज्य"],
        mr: ["केंद्र, राज्य आणि स्थानिक", "फक्त केंद्र, जिल्हा आणि गाव", "फक्त राज्य, जिल्हा आणि प्रभाग", "फक्त केंद्र आणि राज्य"],
      },
      correctAnswer: 0,
      explanation: {
        en: "India's governmental system operates at the Union and State levels, with local self-government institutions at the local level.",
        hi: "भारत में केंद्र और राज्य स्तर के साथ स्थानीय स्तर पर स्थानीय स्वशासन संस्थाएँ भी कार्य करती हैं।",
        mr: "भारतामध्ये केंद्र आणि राज्य पातळीसोबत स्थानिक पातळीवर स्थानिक स्वराज्य संस्थाही कार्य करतात.",
      },
    },

    {
      question: {
        en: "Who is the constitutional head of the Union?",
        hi: "केंद्र का संवैधानिक प्रमुख कौन होता है?",
        mr: "केंद्राचा घटनात्मक प्रमुख कोण असतो?",
      },
      options: {
        en: ["Prime Minister", "President", "Chief Justice of India", "Speaker of Lok Sabha"],
        hi: ["प्रधानमंत्री", "राष्ट्रपति", "भारत के मुख्य न्यायाधीश", "लोकसभा अध्यक्ष"],
        mr: ["पंतप्रधान", "राष्ट्रपती", "भारताचे सरन्यायाधीश", "लोकसभा अध्यक्ष"],
      },
      correctAnswer: 1,
      explanation: {
        en: "The Constitution provides for a President of India as the constitutional head of the Union.",
        hi: "संविधान भारत के राष्ट्रपति के पद का प्रावधान करता है, जो केंद्र के संवैधानिक प्रमुख होते हैं।",
        mr: "राज्यघटनेनुसार भारताच्या राष्ट्रपतींचे पद आहे आणि ते केंद्राचे घटनात्मक प्रमुख असतात.",
      },
    },

    {
      question: {
        en: "Who heads the Council of Ministers at the Union level?",
        hi: "केंद्र स्तर पर मंत्रिपरिषद का नेतृत्व कौन करता है?",
        mr: "केंद्राच्या पातळीवर मंत्रिपरिषदेचे नेतृत्व कोण करतो?",
      },
      options: {
        en: ["President", "Prime Minister", "Vice-President", "Lok Sabha Speaker"],
        hi: ["राष्ट्रपति", "प्रधानमंत्री", "उपराष्ट्रपति", "लोकसभा अध्यक्ष"],
        mr: ["राष्ट्रपती", "पंतप्रधान", "उपराष्ट्रपती", "लोकसभा अध्यक्ष"],
      },
      correctAnswer: 1,
      explanation: {
        en: "The Prime Minister is the head of the Council of Ministers at the Union level.",
        hi: "केंद्र स्तर पर मंत्रिपरिषद का नेतृत्व प्रधानमंत्री करते हैं।",
        mr: "केंद्राच्या पातळीवर मंत्रिपरिषदेचे नेतृत्व पंतप्रधान करतात.",
      },
    },

    {
      question: {
        en: "Which two Houses make up the Parliament of India?",
        hi: "भारत की संसद के दो सदन कौन से हैं?",
        mr: "भारताच्या संसदेची दोन सभागृहे कोणती?",
      },
      options: {
        en: ["Lok Sabha and Rajya Sabha", "Lok Sabha and Vidhan Sabha", "Rajya Sabha and Vidhan Parishad", "Lok Sabha and Gram Sabha"],
        hi: ["लोकसभा और राज्यसभा", "लोकसभा और विधानसभा", "राज्यसभा और विधान परिषद", "लोकसभा और ग्राम सभा"],
        mr: ["लोकसभा आणि राज्यसभा", "लोकसभा आणि विधानसभा", "राज्यसभा आणि विधान परिषद", "लोकसभा आणि ग्रामसभा"],
      },
      correctAnswer: 0,
      explanation: {
        en: "The Parliament of India consists of the President and two Houses: the Council of States (Rajya Sabha) and the House of the People (Lok Sabha).",
        hi: "भारत की संसद में राष्ट्रपति और दो सदन होते हैं: राज्यसभा और लोकसभा।",
        mr: "भारताच्या संसदेत राष्ट्रपती आणि दोन सभागृहे असतात: राज्यसभा आणि लोकसभा.",
      },
    },

    {
      question: {
        en: "Who is the constitutional head of a State?",
        hi: "किसी राज्य का संवैधानिक प्रमुख कौन होता है?",
        mr: "राज्याचा घटनात्मक प्रमुख कोण असतो?",
      },
      options: {
        en: ["Chief Minister", "Governor", "Chief Secretary", "Speaker of the Assembly"],
        hi: ["मुख्यमंत्री", "राज्यपाल", "मुख्य सचिव", "विधानसभा अध्यक्ष"],
        mr: ["मुख्यमंत्री", "राज्यपाल", "मुख्य सचिव", "विधानसभा अध्यक्ष"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Each State has a Governor as provided by the Constitution.",
        hi: "संविधान के अनुसार प्रत्येक राज्य में राज्यपाल का पद होता है।",
        mr: "राज्यघटनेनुसार प्रत्येक राज्यात राज्यपाल हे पद असते.",
      },
    },

    {
      question: {
        en: "Which constitutional Part deals with Panchayats?",
        hi: "पंचायतों से संबंधित प्रावधान संविधान के किस भाग में हैं?",
        mr: "पंचायती राज संस्थांशी संबंधित तरतुदी राज्यघटनेच्या कोणत्या भागात आहेत?",
      },
      options: {
        en: ["Part VIII", "Part IX", "Part IXA", "Part X"],
        hi: ["भाग VIII", "भाग IX", "भाग IXA", "भाग X"],
        mr: ["भाग VIII", "भाग IX", "भाग IXA", "भाग X"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Part IX of the Constitution deals with Panchayats.",
        hi: "संविधान का भाग IX पंचायतों से संबंधित है।",
        mr: "राज्यघटनेचा भाग IX पंचायतींशी संबंधित आहे.",
      },
    },

    {
      question: {
        en: "Which constitutional Part deals with Municipalities?",
        hi: "नगरपालिकाओं से संबंधित प्रावधान संविधान के किस भाग में हैं?",
        mr: "नगरपालिकांशी संबंधित तरतुदी राज्यघटनेच्या कोणत्या भागात आहेत?",
      },
      options: {
        en: ["Part VIII", "Part IX", "Part IXA", "Part XI"],
        hi: ["भाग VIII", "भाग IX", "भाग IXA", "भाग XI"],
        mr: ["भाग VIII", "भाग IX", "भाग IXA", "भाग XI"],
      },
      correctAnswer: 2,
      explanation: {
        en: "Part IXA of the Constitution deals with Municipalities.",
        hi: "संविधान का भाग IXA नगरपालिकाओं से संबंधित है।",
        mr: "राज्यघटनेचा भाग IXA नगरपालिकांशी संबंधित आहे.",
      },
    },

    {
      question: {
        en: "Who forms the Gram Sabha in a Panchayat area?",
        hi: "पंचायत क्षेत्र में ग्राम सभा किन लोगों से मिलकर बनती है?",
        mr: "पंचायत क्षेत्रातील ग्रामसभा कोणापासून बनते?",
      },
      options: {
        en: ["Only elected Panchayat members", "All registered voters in the village-level area", "Only government employees", "Only village officials"],
        hi: ["केवल निर्वाचित पंचायत सदस्य", "गांव स्तर के क्षेत्र की मतदाता सूची में पंजीकृत व्यक्ति", "केवल सरकारी कर्मचारी", "केवल गांव के अधिकारी"],
        mr: ["फक्त निवडून आलेले पंचायत सदस्य", "गावाच्या पातळीवरील क्षेत्राच्या मतदार यादीत नोंद असलेले व्यक्ती", "फक्त सरकारी कर्मचारी", "फक्त गावातील अधिकारी"],
      },
      correctAnswer: 1,
      explanation: {
        en: "The Constitution defines the Gram Sabha as the body of persons registered in the electoral rolls relating to a village within the area of a Panchayat at the village level.",
        hi: "संविधान के अनुसार ग्राम सभा में पंचायत के गांव क्षेत्र से संबंधित मतदाता सूची में पंजीकृत व्यक्ति शामिल होते हैं।",
        mr: "राज्यघटनेनुसार ग्रामसभेत गाव पातळीवरील पंचायत क्षेत्राशी संबंधित मतदार यादीत नोंद असलेले व्यक्ती समाविष्ट होतात.",
      },
    },

    {
      question: {
        en: "Which body has constitutional responsibility for the superintendence, direction and control of elections to Panchayats?",
        hi: "पंचायत चुनावों की तैयारी और संचालन का अधीक्षण, निर्देशन और नियंत्रण किस संस्था के पास है?",
        mr: "पंचायतींच्या निवडणुकांचे अधीक्षण, निर्देशन आणि नियंत्रण कोणत्या संस्थेकडे असते?",
      },
      options: {
        en: ["Election Commission of India", "State Election Commission", "Union Public Service Commission", "Finance Commission"],
        hi: ["भारत निर्वाचन आयोग", "राज्य निर्वाचन आयोग", "संघ लोक सेवा आयोग", "वित्त आयोग"],
        mr: ["भारत निवडणूक आयोग", "राज्य निवडणूक आयोग", "संघ लोकसेवा आयोग", "वित्त आयोग"],
      },
      correctAnswer: 1,
      explanation: {
        en: "Article 243K vests the superintendence, direction and control of Panchayat elections in a State Election Commission.",
        hi: "अनुच्छेद 243K पंचायत चुनावों का अधीक्षण, निर्देशन और नियंत्रण राज्य निर्वाचन आयोग को देता है।",
        mr: "अनुच्छेद 243K पंचायतींच्या निवडणुकांचे अधीक्षण, निर्देशन आणि नियंत्रण राज्य निवडणूक आयोगाकडे सोपवतो.",
      },
    },
  ],
};
