"use client";

import KrutBharatMobileShell from "@/components/KrutBharatMobileShell";



import { useMemo, useState, type CSSProperties } from "react";



import Link from "next/link";



import { useLanguage } from "@/components/LanguageProvider";



import type { Language } from "@/lib/i18n";



type Scenario = {



  question: string;



  options: string[];



  answer: number;



};



type Habit = {



  icon: string;



  title: string;



  description: string;



};



type CivicSenseCopy = {



  back: string;



  language: string;



  eyebrow: string;



  title: string;



  titleAccent: string;



  subtitle: string;



  description: string;



  whatIsLabel: string;



  whatIsTitle: string;



  whatIsDescription: string;



  habitsLabel: string;



  habitsTitle: string;



  habitsDescription: string;



  scenariosLabel: string;



  scenariosTitle: string;



  scenariosDescription: string;



  chooseAnswer: string;



  next: string;



  finish: string;



  restart: string;



  resultTitle: string;



  resultExcellent: string;



  resultGood: string;



  resultKeepGoing: string;



  smallKarmaLabel: string;



  smallKarmaTitle: string;



  smallKarmaDescription: string;



  smallKarmaItems: string[];



  finalLabel: string;



  finalTitle: string;



  finalDescription: string;



  openDashboard: string;



  home: string;



  habits: Habit[];



  scenarios: Scenario[];



};



const copy: Record<Language, CivicSenseCopy> = {



  en: {



    back: "Dashboard",



    language: "Language",



    eyebrow: "EVERYDAY CITIZENSHIP",



    title: "Civic",



    titleAccent: "Sense",



    subtitle: "Small habits. Better shared spaces. Stronger communities.",



    description:



      "Civic sense is the everyday habit of respecting people, public spaces, shared resources and the community around us.",



    whatIsLabel: "WHAT IS CIVIC SENSE?",



    whatIsTitle: "Good citizenship starts with ordinary actions.",



    whatIsDescription:



      "You do not need a big campaign or a complicated process to practise civic sense. It shows up in the small choices we make when nobody is watching — how we treat a road, a queue, a park, a public toilet, a neighbour or a shared bus.",



    habitsLabel: "EVERYDAY CIVIC HABITS",



    habitsTitle: "Simple things that make a difference.",



    habitsDescription:



      "Civic sense is practical. Start with habits that protect cleanliness, safety, dignity and shared public spaces.",



    scenariosLabel: "WHAT WOULD YOU DO?",



    scenariosTitle: "Try the Civic Sense Challenge.",



    scenariosDescription:



      "Pick the response that best protects people and shared spaces. There is no penalty for getting one wrong — the goal is to learn.",



    chooseAnswer: "Choose an answer",



    next: "Next →",



    finish: "See my result →",



    restart: "Try again",



    resultTitle: "Your Civic Sense Check",



    resultExcellent:



      "You have a strong grasp of everyday civic behaviour. Keep turning awareness into habits.",



    resultGood:



      "You understand many of the basics. A few small habits can make your everyday civic choices even stronger.",



    resultKeepGoing:



      "Civic sense grows through practice. Start with one small habit today and repeat it tomorrow.",



    smallKarmaLabel: "SMALL KARMA",



    smallKarmaTitle: "Good civic behaviour is made of tiny choices.",



    smallKarmaDescription:



      "Carry your waste until you find a bin. Give someone their turn. Lower your volume. Protect something that belongs to everyone.",



    smallKarmaItems: [



      "Carry waste until you find a bin.",



      "Respect queues and give people their turn.",



      "Keep noise at a level that does not disturb others.",



      "Use public facilities as if the next person matters.",



      "Leave shared spaces a little better than you found them.",



      "Speak up respectfully when a public space is being damaged.",



    ],



    finalLabel: "ONE IDEA TO REMEMBER",



    finalTitle: "Civic sense is not about being perfect.",



    finalDescription:



      "It is about noticing that our everyday choices affect other people — and choosing to act with consideration.",



    openDashboard: "Back to Dashboard →",



    home: "Home",



    habits: [



      {



        icon: "🗑️",



        title: "Use a bin",



        description: "Do not leave wrappers, bottles or food waste on roads, footpaths or parks.",



      },



      {



        icon: "🚫",



        title: "Do not spit in public",



        description: "Keep walls, lifts, stairways, buses and other shared spaces clean.",



      },



      {



        icon: "🏛️",



        title: "Protect public property",



        description: "Benches, signs, streetlights, buses, parks and public facilities belong to everyone.",



      },



      {



        icon: "🔇",



        title: "Keep noise considerate",



        description: "Avoid unnecessary shouting, loud music, honking or disturbance around others.",



      },



      {



        icon: "🚦",



        title: "Follow traffic discipline",



        description: "Use crossings, obey signals and avoid creating risks for other road users.",



      },



      {



        icon: "⏳",



        title: "Respect queues",



        description: "Wait your turn at hospitals, counters, bus stops, offices and public services.",



      },



      {



        icon: "🚶",



        title: "Keep pathways clear",



        description: "Do not block footpaths, entrances, stairways or doorways without need.",



      },



      {



        icon: "🚻",



        title: "Leave facilities usable",



        description: "Treat public toilets, taps and other shared facilities with care.",



      },



      {



        icon: "🌱",



        title: "Respect nature",



        description: "Keep lakes, parks, rivers and open spaces free from litter and avoid damaging greenery.",



      },



      {



        icon: "🤝",



        title: "Help thoughtfully",



        description: "Be helpful without creating another safety or access problem for people around you.",



      },



    ],



    scenarios: [



      {



        question: "You finish a packet of chips and there is no bin nearby. What do you do?",



        options: [



          "Throw it beside the road",



          "Hide it under a bench",



          "Keep it with you until you find a bin",



          "Leave it on a wall",



        ],



        answer: 2,



      },



      {



        question: "You are waiting at a crowded government counter. Someone asks to go ahead because they are late. What is the civic choice?",



        options: [



          "Let them go only if you know them",



          "Respect the queue and their turn",



          "Start an argument",



          "Leave your place to everyone",



        ],



        answer: 1,



      },



      {



        question: "Your friends are playing very loud music late at night near homes. What should you do?",



        options: [



          "Turn it louder",



          "Ignore everyone around you",



          "Reduce the noise and avoid disturbing others",



          "Move the speaker into a public road",



        ],



        answer: 2,



      },



      {



        question: "You see someone scratching a public bus seat. What is a sensible response?",



        options: [



          "Join them",



          "Ignore all damage",



          "Respectfully discourage the damage",



          "Break another seat",



        ],



        answer: 2,



      },



      {



        question: "A footpath is blocked by a parked vehicle and people are forced onto the road. What is the civic-minded approach?",



        options: [



          "Block the road too",



          "Use the footpath less",



          "Avoid adding another obstruction and use the appropriate way to report it",



          "Damage the vehicle",



        ],



        answer: 2,



      },



      {



        question: "You see a public park after a picnic with litter left behind. What is a good choice?",



        options: [



          "Leave it because it is someone else's problem",



          "Add your own waste",



          "Put your waste in a bin and encourage your group to clean up",



          "Hide it in the plants",



        ],



        answer: 2,



      },



    ],



  },



  hi: {



    back: "डैशबोर्ड",



    language: "भाषा",



    eyebrow: "रोज़मर्रा की नागरिकता",



    title: "नागरिक",



    titleAccent: "बोध",



    subtitle: "छोटी आदतें। बेहतर साझा स्थान। मजबूत समुदाय।",



    description:



      "नागरिक बोध का अर्थ है लोगों, सार्वजनिक स्थानों, साझा संसाधनों और अपने आसपास के समुदाय का रोज़मर्रा में सम्मान करना।",



    whatIsLabel: "नागरिक बोध क्या है?",



    whatIsTitle: "अच्छी नागरिकता साधारण कामों से शुरू होती है।",



    whatIsDescription:



      "नागरिक बोध के लिए किसी बड़े अभियान की जरूरत नहीं है। यह उन छोटे फैसलों में दिखाई देता है जो हम हर दिन लेते हैं — सड़क, कतार, पार्क, सार्वजनिक शौचालय, पड़ोसी या बस जैसे साझा स्थानों के साथ हम कैसा व्यवहार करते हैं।",



    habitsLabel: "रोज़मर्रा की नागरिक आदतें",



    habitsTitle: "छोटी बातें जो फर्क पैदा करती हैं।",



    habitsDescription:



      "नागरिक बोध व्यावहारिक है। स्वच्छता, सुरक्षा, सम्मान और साझा सार्वजनिक स्थानों की रक्षा करने वाली आदतों से शुरुआत करें।",



    scenariosLabel: "आप क्या करेंगे?",



    scenariosTitle: "नागरिक बोध चुनौती आज़माएँ।",



    scenariosDescription:



      "वह उत्तर चुनें जो लोगों और साझा स्थानों की सबसे अच्छी तरह रक्षा करता है। गलत उत्तर पर कोई दंड नहीं है — उद्देश्य सीखना है।",



    chooseAnswer: "एक उत्तर चुनें",



    next: "अगला →",



    finish: "मेरा परिणाम देखें →",



    restart: "फिर से प्रयास करें",



    resultTitle: "आपका नागरिक बोध परीक्षण",



    resultExcellent:



      "आप रोज़मर्रा के नागरिक व्यवहार की अच्छी समझ रखते हैं। जागरूकता को आदतों में बदलते रहें।",



    resultGood:



      "आप कई बुनियादी बातें समझते हैं। कुछ छोटी आदतें आपके रोज़मर्रा के नागरिक फैसलों को और बेहतर बना सकती हैं।",



    resultKeepGoing:



      "नागरिक बोध अभ्यास से बढ़ता है। आज एक छोटी अच्छी आदत शुरू करें और कल भी दोहराएँ।",



    smallKarmaLabel: "छोटा कर्म",



    smallKarmaTitle: "अच्छा नागरिक व्यवहार छोटी-छोटी पसंदों से बनता है।",



    smallKarmaDescription:



      "कूड़ा डिब्बा मिलने तक अपने साथ रखें। दूसरों को उनकी बारी दें। आवाज़ कम रखें। उस चीज़ की रक्षा करें जो सभी की है।",



    smallKarmaItems: [



      "कूड़ा डिब्बा मिलने तक अपने साथ रखें।",



      "कतार का सम्मान करें और सबको उनकी बारी दें।",



      "आवाज़ इतनी रखें कि दूसरों को परेशानी न हो।",



      "सार्वजनिक सुविधाओं का उपयोग ऐसे करें जैसे अगला व्यक्ति भी मायने रखता है।",



      "साझा स्थान को जितना साफ मिला था, उससे थोड़ा बेहतर छोड़ें।",



      "सार्वजनिक स्थान को नुकसान पहुँचते देखें तो सम्मानपूर्वक रोकने की कोशिश करें।",



    ],



    finalLabel: "एक बात याद रखें",



    finalTitle: "नागरिक बोध पूर्णता के बारे में नहीं है।",



    finalDescription:



      "यह समझने के बारे में है कि हमारे रोज़मर्रा के फैसले दूसरों को प्रभावित करते हैं — और सोच-समझकर व्यवहार करना है।",



    openDashboard: "डैशबोर्ड पर वापस जाएँ →",



    home: "होम",



    habits: [



      { icon: "🗑️", title: "कूड़ेदान का उपयोग करें", description: "रैपर, बोतल या भोजन का कचरा सड़क, फुटपाथ या पार्क में न छोड़ें।" },



      { icon: "🚫", title: "सार्वजनिक स्थान पर न थूकें", description: "दीवारों, लिफ्ट, सीढ़ियों, बसों और साझा स्थानों को साफ रखें।" },



      { icon: "🏛️", title: "सार्वजनिक संपत्ति की रक्षा करें", description: "बेंच, संकेत, स्ट्रीट लाइट, बसें, पार्क और सार्वजनिक सुविधाएँ सभी की हैं।" },



      { icon: "🔇", title: "आवाज़ का ध्यान रखें", description: "अनावश्यक चिल्लाने, तेज़ संगीत, हॉर्न या शोर से दूसरों को परेशान न करें।" },



      { icon: "🚦", title: "यातायात अनुशासन मानें", description: "क्रॉसिंग का उपयोग करें, संकेतों का पालन करें और दूसरों के लिए जोखिम न बनें।" },



      { icon: "⏳", title: "कतार का सम्मान करें", description: "अस्पताल, काउंटर, बस स्टॉप, कार्यालय और सार्वजनिक सेवाओं में अपनी बारी का इंतज़ार करें।" },



      { icon: "🚶", title: "रास्ते खुले रखें", description: "बिना जरूरत फुटपाथ, प्रवेश द्वार, सीढ़ियाँ या दरवाज़े न रोकें।" },



      { icon: "🚻", title: "सुविधाएँ उपयोग योग्य छोड़ें", description: "सार्वजनिक शौचालय, नल और साझा सुविधाओं का ध्यान रखें।" },



      { icon: "🌱", title: "प्रकृति का सम्मान करें", description: "पार्क, झील, नदी और खुले स्थानों को कचरे से मुक्त रखें और हरियाली को नुकसान न पहुँचाएँ।" },



      { icon: "🤝", title: "समझदारी से मदद करें", description: "मदद करें, लेकिन ऐसा करते समय दूसरों के लिए कोई नई सुरक्षा या रास्ते की समस्या न बनाएं।" },



    ],



    scenarios: [



      {



        question: "आपने चिप्स का पैकेट खत्म किया और पास में कूड़ेदान नहीं है। आप क्या करेंगे?",



        options: ["सड़क के किनारे फेंक देंगे", "बेंच के नीचे छिपा देंगे", "कूड़ेदान मिलने तक अपने साथ रखेंगे", "दीवार पर छोड़ देंगे"],



        answer: 2,



      },



      {



        question: "आप एक भीड़भाड़ वाले सरकारी काउंटर पर कतार में हैं। कोई कहता है कि वह देर से है। नागरिक विकल्प क्या है?",



        options: ["अगर जान-पहचान हो तो आगे जाने दें", "कतार और उसकी बारी का सम्मान करें", "बहस शुरू करें", "सबको अपनी जगह दे दें"],



        answer: 1,



      },



      {



        question: "आपके दोस्त घरों के पास देर रात बहुत तेज़ संगीत बजा रहे हैं। क्या करना चाहिए?",



        options: ["आवाज़ और बढ़ाएँ", "आसपास के लोगों को नज़रअंदाज़ करें", "आवाज़ कम करें और दूसरों को परेशान न करें", "स्पीकर सड़क पर ले जाएँ"],



        answer: 2,



      },



      {



        question: "आप किसी को सार्वजनिक बस की सीट पर खरोंच बनाते देखते हैं। समझदारी भरी प्रतिक्रिया क्या है?",



        options: ["उनके साथ मिल जाएँ", "हर नुकसान को नज़रअंदाज़ करें", "सम्मानपूर्वक नुकसान करने से रोकने की कोशिश करें", "एक और सीट तोड़ दें"],



        answer: 2,



      },



      {



        question: "एक वाहन फुटपाथ रोक रहा है और लोगों को सड़क पर चलना पड़ रहा है। नागरिक दृष्टिकोण क्या है?",



        options: ["सड़क भी रोक दें", "फुटपाथ का उपयोग कम करें", "नई रुकावट न जोड़ें और उचित तरीके से इसकी रिपोर्ट करें", "वाहन को नुकसान पहुँचाएँ"],



        answer: 2,



      },



      {



        question: "पिकनिक के बाद पार्क में कचरा पड़ा है। अच्छा विकल्प क्या है?",



        options: ["उसे छोड़ दें क्योंकि यह किसी और की समस्या है", "अपना कचरा भी जोड़ दें", "अपना कचरा कूड़ेदान में डालें और समूह को साफ करने के लिए प्रेरित करें", "पौधों में छिपा दें"],



        answer: 2,



      },



    ],



  },



  mr: {



    back: "डॅशबोर्ड",



    language: "भाषा",



    eyebrow: "दैनंदिन नागरीपणा",



    title: "नागरी",



    titleAccent: "जाणीव",



    subtitle: "छोट्या सवयी. चांगली सामायिक ठिकाणे. मजबूत समुदाय.",



    description:



      "नागरी जाणीव म्हणजे लोक, सार्वजनिक ठिकाणे, सामायिक साधने आणि आपल्या आसपासच्या समुदायाचा दैनंदिन जीवनात आदर करणे.",



    whatIsLabel: "नागरी जाणीव म्हणजे काय?",



    whatIsTitle: "चांगला नागरिकपणा साध्या कृतींपासून सुरू होतो.",



    whatIsDescription:



      "नागरी जाणीव दाखवण्यासाठी मोठ्या मोहिमेची गरज नाही. आपण दररोज घेत असलेल्या छोट्या निर्णयांत ती दिसते — रस्ता, रांग, उद्यान, सार्वजनिक स्वच्छतागृह, शेजारी किंवा बस यांसारख्या सामायिक जागांशी आपण कसे वागतो यात.",



    habitsLabel: "दैनंदिन नागरी सवयी",



    habitsTitle: "छोट्या गोष्टी ज्या फरक घडवतात.",



    habitsDescription:



      "नागरी जाणीव ही कृतीतून दिसते. स्वच्छता, सुरक्षितता, सन्मान आणि सार्वजनिक जागांचे संरक्षण करणाऱ्या सवयींपासून सुरुवात करा.",



    scenariosLabel: "तुम्ही काय कराल?",



    scenariosTitle: "नागरी जाणीव आव्हान करून पाहा.",



    scenariosDescription:



      "लोक आणि सामायिक जागांचे सर्वोत्तम रक्षण करणारा पर्याय निवडा. चुकीच्या उत्तरासाठी शिक्षा नाही — उद्देश शिकणे हा आहे.",



    chooseAnswer: "एक पर्याय निवडा",



    next: "पुढे →",



    finish: "माझा निकाल पाहा →",



    restart: "पुन्हा प्रयत्न करा",



    resultTitle: "तुमची नागरी जाणीव चाचणी",



    resultExcellent:



      "दैनंदिन नागरी वर्तनाची तुमची समज चांगली आहे. जागरूकतेचे सवयींमध्ये रूपांतर करत रहा.",



    resultGood:



      "तुम्हाला अनेक मूलभूत गोष्टी समजतात. काही छोट्या सवयी तुमच्या दैनंदिन नागरी निवडी आणखी चांगल्या करू शकतात.",



    resultKeepGoing:



      "नागरी जाणीव सरावाने वाढते. आज एक छोटी चांगली सवय सुरू करा आणि उद्याही तीच पाळा.",



    smallKarmaLabel: "छोटे कर्म",



    smallKarmaTitle: "चांगले नागरी वर्तन छोट्या छोट्या निवडींनी घडते.",



    smallKarmaDescription:



      "कचरापेटी मिळेपर्यंत कचरा स्वतःजवळ ठेवा. प्रत्येकाला त्याची पाळी द्या. आवाज कमी ठेवा. सर्वांची असलेल्या गोष्टीचे संरक्षण करा.",



    smallKarmaItems: [



      "कचरापेटी मिळेपर्यंत कचरा स्वतःजवळ ठेवा.",



      "रांगेचा आदर करा आणि प्रत्येकाला त्याची पाळी द्या.",



      "इतरांना त्रास होणार नाही इतकाच आवाज ठेवा.",



      "सार्वजनिक सुविधांचा वापर असा करा की पुढच्या व्यक्तीचाही विचार केला जाईल.",



      "सामायिक जागा जशी मिळाली त्यापेक्षा थोडी चांगली ठेवण्याचा प्रयत्न करा.",



      "सार्वजनिक जागेचे नुकसान होताना दिसल्यास नम्रपणे त्याला आळा घालण्याचा प्रयत्न करा.",



    ],



    finalLabel: "एक गोष्ट लक्षात ठेवा",



    finalTitle: "नागरी जाणीव परिपूर्ण असण्याबद्दल नाही.",



    finalDescription:



      "आपल्या दैनंदिन निवडींचा इतरांवर परिणाम होतो हे ओळखणे — आणि विचारपूर्वक वागणे — एवढेच महत्त्वाचे आहे.",



    openDashboard: "डॅशबोर्डवर परत जा →",



    home: "होम",



    habits: [



      { icon: "🗑️", title: "कचरापेटी वापरा", description: "कागद, बाटल्या किंवा अन्नाचा कचरा रस्त्यावर, फुटपाथवर किंवा उद्यानात टाकू नका." },



      { icon: "🚫", title: "सार्वजनिक ठिकाणी थुंकू नका", description: "भिंती, लिफ्ट, जिने, बस आणि इतर सामायिक जागा स्वच्छ ठेवा." },



      { icon: "🏛️", title: "सार्वजनिक मालमत्तेचे रक्षण करा", description: "बाक, फलक, स्ट्रीटलाइट, बस, उद्याने आणि सार्वजनिक सुविधा सर्वांच्या आहेत." },



      { icon: "🔇", title: "आवाजाची जाणीव ठेवा", description: "अनावश्यक ओरडणे, मोठे संगीत, हॉर्न किंवा इतरांना त्रास देणारा आवाज टाळा." },



      { icon: "🚦", title: "वाहतूक शिस्त पाळा", description: "क्रॉसिंगचा वापर करा, सिग्नलचे पालन करा आणि इतरांसाठी धोका निर्माण करू नका." },



      { icon: "⏳", title: "रांगेचा आदर करा", description: "रुग्णालय, काउंटर, बसस्टॉप, कार्यालय आणि सार्वजनिक सेवांमध्ये आपली पाळी येईपर्यंत थांबा." },



      { icon: "🚶", title: "मार्ग मोकळे ठेवा", description: "गरज नसताना फुटपाथ, प्रवेशद्वार, जिने किंवा दरवाजे अडवू नका." },



      { icon: "🚻", title: "सुविधा पुढच्यासाठीही चांगल्या ठेवा", description: "सार्वजनिक स्वच्छतागृहे, नळ आणि इतर सामायिक सुविधा जपून वापरा." },



      { icon: "🌱", title: "निसर्गाचा आदर करा", description: "उद्यान, तलाव, नद्या आणि मोकळ्या जागा कचरामुक्त ठेवा आणि हिरवाईचे नुकसान टाळा." },



      { icon: "🤝", title: "विचारपूर्वक मदत करा", description: "मदत करताना आजूबाजूच्या लोकांसाठी नवी सुरक्षा किंवा अडथळ्याची समस्या निर्माण होणार नाही याची काळजी घ्या." },



    ],



    scenarios: [



      {



        question: "तुम्ही चिप्सचे पाकीट संपवले आहे आणि जवळ कचरापेटी नाही. तुम्ही काय कराल?",



        options: ["रस्त्याच्या कडेला टाकाल", "बाकाखाली लपवाल", "कचरापेटी मिळेपर्यंत स्वतःजवळ ठेवाल", "भिंतीवर ठेवून द्याल"],



        answer: 2,



      },



      {



        question: "तुम्ही सरकारी काउंटरवर रांगेत उभे आहात. कोणीतरी उशीर झाल्यामुळे पुढे जाण्याची विनंती करतो. नागरी पर्याय कोणता?",



        options: ["ओळखीचा असेल तर पुढे जाऊ द्या", "रांगेचा आणि त्याच्या पाळीचा आदर करा", "वाद घाला", "आपली जागा सगळ्यांना द्या"],



        answer: 1,



      },



      {



        question: "तुमचे मित्र रात्री उशिरा घरांच्या जवळ मोठ्या आवाजात संगीत वाजवत आहेत. काय करावे?",



        options: ["आवाज आणखी वाढवा", "आजूबाजूच्या लोकांकडे दुर्लक्ष करा", "आवाज कमी करा आणि इतरांना त्रास होणार नाही याची काळजी घ्या", "स्पीकर रस्त्यावर घेऊन जा"],



        answer: 2,



      },



      {



        question: "कोणीतरी सार्वजनिक बसच्या सीटवर ओरखडे काढताना दिसतो. योग्य प्रतिक्रिया कोणती?",



        options: ["त्यांच्यात सामील व्हा", "सर्व नुकसान दुर्लक्षित करा", "नम्रपणे नुकसान करण्यापासून परावृत्त करा", "दुसरी सीट तोडा"],



        answer: 2,



      },



      {



        question: "एका वाहनामुळे फुटपाथ अडला आहे आणि लोकांना रस्त्यावरून चालावे लागत आहे. नागरी दृष्टिकोन कोणता?",



        options: ["रस्ताही अडवा", "फुटपाथ कमी वापरा", "नवीन अडथळा निर्माण करू नका आणि योग्य मार्गाने त्याची नोंद करा", "वाहनाचे नुकसान करा"],



        answer: 2,



      },



      {



        question: "पिकनिकनंतर उद्यानात कचरा पडलेला आहे. चांगला पर्याय कोणता?",



        options: ["सोडून द्या, ती दुसऱ्याची समस्या आहे", "तुमचा कचरा त्यात वाढवा", "तुमचा कचरा कचरापेटीत टाका आणि समूहाला साफसफाईसाठी प्रोत्साहित करा", "तो झाडांमध्ये लपवा"],



        answer: 2,



      },



    ],



  },



};



const shellStyle = {



  width: "min(1120px, 100%)",



  margin: "0 auto",



};



const pageStyle: CSSProperties = {



  minHeight: "100vh",



  padding: "20px 16px 80px",



  background:



    "radial-gradient(circle at 92% 4%, rgba(214,232,243,.92) 0%, rgba(214,232,243,0) 27%), radial-gradient(circle at 6% 40%, rgba(255,229,205,.72) 0%, rgba(255,229,205,0) 24%), #f8f3ea",



  color: "#102033",



  fontFamily: "var(--font-body)",



};



export default function CivicSensePage() {



  const { language, setLanguage } = useLanguage();



  const text = copy[language];



  const [currentScenario, setCurrentScenario] = useState(0);



  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);



  const [score, setScore] = useState(0);



  const [showResult, setShowResult] = useState(false);



  const current = text.scenarios[currentScenario];



  const progress = useMemo(



    () => Math.round(((currentScenario + 1) / text.scenarios.length) * 100),



    [currentScenario, text.scenarios.length]



  );



  function chooseAnswer(index: number) {



    if (selectedAnswer !== null) return;



    setSelectedAnswer(index);



  }



  function nextScenario() {



    if (selectedAnswer === null) return;



    if (selectedAnswer === current.answer) {



      setScore((value) => value + 1);



    }



    if (currentScenario === text.scenarios.length - 1) {



      setShowResult(true);



      return;



    }



    setCurrentScenario((value) => value + 1);



    setSelectedAnswer(null);



  }



  function restartChallenge() {



    setCurrentScenario(0);



    setSelectedAnswer(null);



    setScore(0);



    setShowResult(false);



  }



  const finalScore =



    score + (selectedAnswer === current.answer && showResult ? 1 : 0);



  return (



    <main className="kf-civic-sense-page" style={pageStyle}>
      <KrutBharatMobileShell />



      <div style={shellStyle}>



        <header className="kf-civic-sense-topbar">



          <Link href="/dashboard" className="kf-civic-sense-back">



            <span>←</span>



            {text.back}



          </Link>



          <div className="kf-civic-sense-brand" aria-label="KrutBharat Civic Sense">



            <div className="kf-civic-sense-brand-mark">K</div>



            <div>



              <div className="kf-civic-sense-brand-name">



                <span className="krut">Krut</span>



                <span className="bharat">Bharat</span>



              </div>



              <div className="kf-civic-sense-brand-caption">CIVIC SENSE</div>



            </div>



          </div>



          <label className="kf-civic-sense-language">



            <span>{text.language}</span>



            <select



              value={language}



              onChange={(event) =>



                setLanguage(event.target.value as Language)



              }



              aria-label={text.language}



            >



              <option value="en">English</option>



              <option value="hi">हिन्दी</option>



              <option value="mr">मराठी</option>



            </select>



          </label>



        </header>



        <section className="kf-civic-sense-hero">



          <div className="kf-civic-sense-hero-orb kf-orb-one" />



          <div className="kf-civic-sense-hero-orb kf-orb-two" />



          <div className="kf-civic-sense-hero-copy">



            <div className="kf-civic-sense-eyebrow">{text.eyebrow}</div>



            <h1>



              <span>{text.title}</span> <strong>{text.titleAccent}</strong>



            </h1>



            <p className="kf-civic-sense-hero-subtitle">{text.subtitle}</p>



            <p className="kf-civic-sense-hero-description">{text.description}</p>



          </div>



          <div className="kf-civic-sense-hero-badge" aria-hidden="true">



            <div className="big-icon">🤝</div>



            <div className="badge-label">PEOPLE · PLACES · COMMUNITY</div>



          </div>



        </section>



        <section className="kf-civic-sense-section kf-civic-sense-intro">



          <div className="section-kicker">{text.whatIsLabel}</div>



          <h2>{text.whatIsTitle}</h2>



          <p>{text.whatIsDescription}</p>



        </section>



        <section className="kf-civic-sense-section">



          <div className="section-kicker">{text.habitsLabel}</div>



          <h2>{text.habitsTitle}</h2>



          <p className="section-description">{text.habitsDescription}</p>



          <div className="kf-civic-sense-habit-grid">



            {text.habits.map((habit) => (



              <article key={habit.title} className="kf-civic-sense-habit-card">



                <div className="habit-icon">{habit.icon}</div>



                <h3>{habit.title}</h3>



                <p>{habit.description}</p>



              </article>



            ))}



          </div>



        </section>



        <section className="kf-civic-sense-section kf-civic-sense-challenge">



          <div className="section-kicker">{text.scenariosLabel}</div>



          <h2>{text.scenariosTitle}</h2>



          <p className="section-description">{text.scenariosDescription}</p>



          {!showResult ? (



            <div className="kf-challenge-card">



              <div className="challenge-top">



                <div className="challenge-step">



                  {String(currentScenario + 1).padStart(2, "0")} /{" "}



                  {String(text.scenarios.length).padStart(2, "0")}



                </div>



                <div className="challenge-progress">



                  <span style={{ width: `${progress}%` }} />



                </div>



              </div>



              <div className="challenge-question">{current.question}</div>



              <div className="challenge-label">{text.chooseAnswer}</div>



              <div className="challenge-options">



                {current.options.map((option, index) => {



                  const isSelected = selectedAnswer === index;



                  const isCorrect =



                    selectedAnswer !== null && index === current.answer;



                  const isWrong =



                    selectedAnswer === index && index !== current.answer;



                  return (



                    <button



                      key={option}



                      type="button"



                      onClick={() => chooseAnswer(index)}



                      className={`challenge-option ${



                        isSelected ? "selected" : ""



                      } ${isCorrect ? "correct" : ""} ${



                        isWrong ? "wrong" : ""



                      }`}



                    >



                      <span className="option-letter">



                        {String.fromCharCode(65 + index)}



                      </span>



                      <span>{option}</span>



                    </button>



                  );



                })}



              </div>



              <div className="challenge-footer">



                <span>



                  {selectedAnswer === null



                    ? ""



                    : selectedAnswer === current.answer



                      ? "✓"



                      : "•"}



                </span>



                <button



                  type="button"



                  onClick={nextScenario}



                  disabled={selectedAnswer === null}



                  className="challenge-next"



                >



                  {currentScenario === text.scenarios.length - 1



                    ? text.finish



                    : text.next}



                </button>



              </div>



            </div>



          ) : (



            <div className="kf-challenge-result">



              <div className="result-score">



                {finalScore}/{text.scenarios.length}



              </div>



              <div className="section-kicker">{text.resultTitle}</div>



              <h3>



                {finalScore >= 5



                  ? text.resultExcellent



                  : finalScore >= 3



                    ? text.resultGood



                    : text.resultKeepGoing}



              </h3>



              <button



                type="button"



                onClick={restartChallenge}



                className="challenge-restart"



              >



                {text.restart}



              </button>



            </div>



          )}



        </section>



        <section className="kf-civic-sense-small-karma">



          <div>



            <div className="section-kicker">{text.smallKarmaLabel}</div>



            <h2>{text.smallKarmaTitle}</h2>



            <p>{text.smallKarmaDescription}</p>



          </div>



          <div className="small-karma-list">



            {text.smallKarmaItems.map((item, index) => (



              <div key={item} className="small-karma-item">



                <span>{String(index + 1).padStart(2, "0")}</span>



                <p>{item}</p>



              </div>



            ))}



          </div>



        </section>



        <section className="kf-civic-sense-final">



          <div className="section-kicker">{text.finalLabel}</div>



          <h2>{text.finalTitle}</h2>



          <p>{text.finalDescription}</p>



          <div className="final-actions">



            <Link href="/dashboard" className="final-primary">



              {text.openDashboard}



            </Link>



            <Link href="/" className="final-secondary">



              {text.home}



            </Link>



          </div>



        </section>



        <footer className="kf-civic-sense-footer">



          <div className="footer-brand">



            <span className="footer-krut">Krut</span>



            <span className="footer-bharat">Bharat</span>



          </div>



          <div>Know India. Think Civic. Shape Its Future.</div>



          <div>© 2026 KrutBharat · by KarmaFacie Corporation</div>



        </footer>



      </div>



      <style>{`



        .kf-civic-sense-page,



        .kf-civic-sense-page * {



          box-sizing: border-box;



        }



        .kf-civic-sense-topbar {



          display: grid;



          grid-template-columns: 1fr auto 1fr;



          align-items: center;



          gap: 18px;



          min-height: 84px;



          margin-bottom: 18px;



          padding: 10px 14px;



          border: 1px solid #ddd7ce;



          border-radius: 32px;



          background: rgba(255,255,255,.94);



          box-shadow: 0 14px 36px rgba(16,27,43,.06);



          backdrop-filter: blur(16px);



        }



        .kf-civic-sense-back,



        .kf-civic-sense-language select {



          min-height: 44px;



          padding: 10px 15px;



          border: 1px solid #d9d3cb;



          border-radius: 999px;



          background: #fffdf9;



          color: #506171;



          font-family: var(--font-body);



          font-size: 12px;



          font-weight: 800;



          text-decoration: none;



        }



        .kf-civic-sense-back {



          display: inline-flex;



          width: fit-content;



          align-items: center;



          gap: 7px;



        }



        .kf-civic-sense-back span {



          color: #ff7a00;



          font-size: 18px;



        }



        .kf-civic-sense-brand {



          display: flex;



          align-items: center;



          gap: 10px;



          justify-content: center;



        }



        .kf-civic-sense-brand-mark {



          width: 56px;



          height: 56px;



          display: grid;



          place-items: center;



          border-radius: 17px;



          background: #ff7a00;



          color: #102033;



          font-family: var(--font-display);



          font-size: 31px;



          font-weight: 800;



        }



        .kf-civic-sense-brand-name {



          font-family: var(--font-display);



          font-size: 28px;



          line-height: .95;



          font-weight: 800;



          letter-spacing: -.045em;



        }



        .kf-civic-sense-brand-name .krut {



          color: #102033;



        }



        .kf-civic-sense-brand-name .bharat {



          color: #ff7a00;



        }



        .kf-civic-sense-brand-caption {



          margin-top: 5px;



          color: #8793a1;



          font-size: 9px;



          font-weight: 900;



          letter-spacing: .21em;



        }



        .kf-civic-sense-language {



          display: flex;



          align-items: center;



          justify-content: flex-end;



          gap: 10px;



          color: #7e8a95;



          font-size: 11px;



          font-weight: 900;



        }



        .kf-civic-sense-language select {



          min-width: 126px;



          outline: none;



          cursor: pointer;



        }



        .kf-civic-sense-hero {



          position: relative;



          display: grid;



          grid-template-columns: minmax(0,1.3fr) 300px;



          align-items: center;



          gap: 30px;



          min-height: 350px;



          margin-bottom: 18px;



          padding: 40px;



          overflow: hidden;



          border: 1px solid #dcd7cf;



          border-radius: 33px;



          background:



            radial-gradient(circle at 88% 4%, rgba(213,233,244,.98) 0%, rgba(213,233,244,0) 34%),



            radial-gradient(circle at 1% 100%, rgba(255,224,199,.86) 0%, rgba(255,224,199,0) 36%),



            linear-gradient(135deg, #fffdf9 0%, #f2f8fb 100%);



          box-shadow: 0 18px 48px rgba(16,27,43,.06);



        }



        .kf-civic-sense-hero-orb {



          position: absolute;



          border-radius: 50%;



          pointer-events: none;



        }



        .kf-orb-one {



          width: 190px;



          height: 190px;



          right: -60px;



          top: -75px;



          background: rgba(191,220,237,.55);



        }



        .kf-orb-two {



          width: 160px;



          height: 105px;



          left: -46px;



          bottom: -58px;



          border-radius: 55% 45% 0 0;



          background: rgba(255,209,175,.50);



          transform: rotate(7deg);



        }



        .kf-civic-sense-hero-copy {



          position: relative;



          z-index: 1;



        }



        .kf-civic-sense-eyebrow,



        .section-kicker {



          color: #ff7a00;



          font-size: 10px;



          font-weight: 900;



          letter-spacing: .18em;



          text-transform: uppercase;



        }



        .kf-civic-sense-hero h1 {



          margin: 8px 0 8px;



          color: #102033;



          font-family: var(--font-display);



          font-size: clamp(48px, 6vw, 74px);



          line-height: .92;



          font-weight: 800;



          letter-spacing: -.055em;



        }



        .kf-civic-sense-hero h1 strong {



          color: #ff7a00;



          font-weight: 800;



        }



        .kf-civic-sense-hero-subtitle {



          max-width: 650px;



          margin: 12px 0 0;



          color: #32475a;



          font-family: var(--font-display);



          font-size: 21px;



          line-height: 1.22;



          font-weight: 700;



        }



        .kf-civic-sense-hero-description {



          max-width: 710px;



          margin: 11px 0 0;



          color: #657482;



          font-size: 14px;



          line-height: 1.75;



        }



        .kf-civic-sense-hero-badge {



          position: relative;



          z-index: 1;



          min-height: 250px;



          display: grid;



          place-items: center;



          align-content: center;



          gap: 16px;



          border-radius: 28px;



          background:



            radial-gradient(circle at 30% 20%, rgba(255,255,255,.92), transparent 35%),



            linear-gradient(145deg, #f6efe4, #e9f3f6);



          border: 1px solid #ddd5c9;



          box-shadow: 0 14px 38px rgba(16,27,43,.06);



        }



        .big-icon {



          width: 105px;



          height: 105px;



          display: grid;



          place-items: center;



          border-radius: 30px;



          background: #ff7a00;



          font-size: 50px;



          box-shadow: 0 18px 30px rgba(255,122,0,.20);



        }



        .badge-label {



          color: #7b8791;



          font-size: 9px;



          font-weight: 900;



          letter-spacing: .16em;



          text-align: center;



        }



        .kf-civic-sense-section {



          margin-top: 18px;



          padding: 28px;



          border: 1px solid #ddd7ce;



          border-radius: 30px;



          background: rgba(255,253,249,.95);



          box-shadow: 0 14px 38px rgba(16,27,43,.045);



        }



        .kf-civic-sense-section h2,



        .kf-civic-sense-small-karma h2,



        .kf-civic-sense-final h2 {



          margin: 5px 0 7px;



          color: #263a4e;



          font-family: var(--font-display);



          font-size: clamp(29px, 4vw, 43px);



          line-height: 1.02;



          font-weight: 800;



          letter-spacing: -.04em;



        }



        .kf-civic-sense-section > p,



        .section-description {



          max-width: 760px;



          margin: 0;



          color: #697883;



          font-size: 13px;



          line-height: 1.72;



        }



        .kf-civic-sense-habit-grid {



          display: grid;



          grid-template-columns: repeat(2, minmax(0,1fr));



          gap: 12px;



          margin-top: 18px;



        }



        .kf-civic-sense-habit-card {

  position: relative;

  overflow: hidden;

  padding: 18px;

  border: 1px solid #e0dbd4;

  border-radius: 23px;

  background: #fffdf9;

  box-shadow: inset 0 1px 0 rgba(255,255,255,.78), 0 10px 26px rgba(35,47,58,.045);

  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;

}



.kf-civic-sense-habit-card::after {

  content: "";

  position: absolute;

  width: 120px;

  height: 120px;

  right: -52px;

  bottom: -58px;

  border-radius: 50%;

  opacity: .48;

  pointer-events: none;

}



.kf-civic-sense-habit-card:nth-child(1) {

  background: linear-gradient(145deg, #fff8f0 0%, #fffdf9 72%);

  border-color: #efd8bf;

}

.kf-civic-sense-habit-card:nth-child(1)::after { background: #ffdcb9; }



.kf-civic-sense-habit-card:nth-child(2) {

  background: linear-gradient(145deg, #f6f0fb 0%, #fffdf9 72%);

  border-color: #ded1eb;

}

.kf-civic-sense-habit-card:nth-child(2)::after { background: #e4d4f1; }



.kf-civic-sense-habit-card:nth-child(3) {

  background: linear-gradient(145deg, #eef8f5 0%, #fffdf9 72%);

  border-color: #cfe3da;

}

.kf-civic-sense-habit-card:nth-child(3)::after { background: #cfeadf; }



.kf-civic-sense-habit-card:nth-child(4) {

  background: linear-gradient(145deg, #eef6fb 0%, #fffdf9 72%);

  border-color: #cddfe9;

}

.kf-civic-sense-habit-card:nth-child(4)::after { background: #cce4f1; }



.kf-civic-sense-habit-card:nth-child(5) {

  background: linear-gradient(145deg, #f3f7e9 0%, #fffdf9 72%);

  border-color: #d8e3c6;

}

.kf-civic-sense-habit-card:nth-child(5)::after { background: #dce9c5; }



.kf-civic-sense-habit-card:nth-child(6) {

  background: linear-gradient(145deg, #fff3e5 0%, #fffdf9 72%);

  border-color: #efd8bd;

}

.kf-civic-sense-habit-card:nth-child(6)::after { background: #ffe0bd; }



.kf-civic-sense-habit-card:nth-child(7) {

  background: linear-gradient(145deg, #eef7f8 0%, #fffdf9 72%);

  border-color: #cfe1e3;

}

.kf-civic-sense-habit-card:nth-child(7)::after { background: #d2e9ea; }



.kf-civic-sense-habit-card:nth-child(8) {

  background: linear-gradient(145deg, #f5f1fb 0%, #fffdf9 72%);

  border-color: #ddd3ea;

}

.kf-civic-sense-habit-card:nth-child(8)::after { background: #e1d7ef; }



.kf-civic-sense-habit-card:nth-child(9) {

  background: linear-gradient(145deg, #f0f8eb 0%, #fffdf9 72%);

  border-color: #d3e3c8;

}

.kf-civic-sense-habit-card:nth-child(9)::after { background: #d6e9ca; }



.kf-civic-sense-habit-card:nth-child(10) {

  background: linear-gradient(145deg, #fff4e9 0%, #fffdf9 72%);

  border-color: #ecd9c5;

}

.kf-civic-sense-habit-card:nth-child(10)::after { background: #ffdfbd; }



.kf-civic-sense-habit-card:hover {

  transform: translateY(-2px);

  box-shadow: inset 0 1px 0 rgba(255,255,255,.82), 0 16px 30px rgba(35,47,58,.08);

}



        .habit-icon {



          width: 44px;



          height: 44px;



          display: grid;



          place-items: center;



          border-radius: 14px;



          background: #edf5fa;



          font-size: 22px;



        }



        .kf-civic-sense-habit-card h3 {



          margin: 11px 0 4px;



          color: #304457;



          font-family: var(--font-display);



          font-size: 20px;



          font-weight: 800;



        }



        .kf-civic-sense-habit-card p {



          margin: 0;



          color: #697883;



          font-size: 11.5px;



          line-height: 1.68;



        }



        .kf-civic-sense-challenge {



          background:



            linear-gradient(135deg, #f7f2fb 0%, #eef5fb 100%);



          border-color: #ddd5e6;



        }



        .kf-challenge-card {



          margin-top: 20px;



          padding: 22px;



          border-radius: 25px;



          background: #fffdf9;



          border: 1px solid #e0d9d1;



          box-shadow: 0 12px 32px rgba(16,27,43,.055);



        }



        .challenge-top {



          display: flex;



          align-items: center;



          gap: 12px;



        }



        .challenge-step {



          color: #8c7b70;



          font-size: 10px;



          font-weight: 900;



          letter-spacing: .14em;



          white-space: nowrap;



        }



        .challenge-progress {



          height: 6px;



          flex: 1;



          overflow: hidden;



          border-radius: 999px;



          background: #eee8df;



        }



        .challenge-progress span {



          display: block;



          height: 100%;



          border-radius: inherit;



          background: linear-gradient(90deg, #18bfff, #ff7a00);



          transition: width .25s ease;



        }



        .challenge-question {



          margin-top: 24px;



          color: #263a4e;



          font-family: var(--font-display);



          font-size: clamp(23px, 3vw, 34px);



          line-height: 1.12;



          font-weight: 800;



          letter-spacing: -.025em;



        }



        .challenge-label {



          margin-top: 18px;



          color: #8793a1;



          font-size: 10px;



          font-weight: 900;



          letter-spacing: .14em;



          text-transform: uppercase;



        }



        .challenge-options {



          display: grid;



          gap: 9px;



          margin-top: 10px;



        }



        .challenge-option {



          display: flex;



          align-items: center;



          gap: 11px;



          width: 100%;



          padding: 13px 14px;



          border: 1px solid #e2dcd4;



          border-radius: 17px;



          background: #fffdf9;



          color: #536579;



          text-align: left;



          cursor: pointer;



          font-family: var(--font-body);



          font-size: 12px;



          font-weight: 700;



          transition: transform .15s ease, border-color .15s ease, background .15s ease;



        }



        .challenge-option:hover {



          transform: translateY(-1px);



          border-color: #bccfdb;



        }



        .challenge-option.selected {



          border-color: #6f9ab1;



          background: #edf5fa;



        }



        .challenge-option.correct {



          border-color: #9dc28d;



          background: #eff7e9;



          color: #4c6f42;



        }



        .challenge-option.wrong {



          border-color: #e8b5a7;



          background: #fff0ed;



          color: #935c4d;



        }



        .option-letter {



          width: 30px;



          height: 30px;



          flex: 0 0 auto;



          display: grid;



          place-items: center;



          border-radius: 10px;



          background: #f4f1eb;



          color: #7e8994;



          font-size: 10px;



          font-weight: 900;



        }



        .challenge-footer {



          display: flex;



          align-items: center;



          justify-content: space-between;



          gap: 12px;



          margin-top: 18px;



        }



        .challenge-next,



        .challenge-restart {



          border: 0;



          border-radius: 999px;



          padding: 11px 16px;



          background: #ff7a00;



          color: #fff;



          font-family: var(--font-body);



          font-size: 11px;



          font-weight: 900;



          cursor: pointer;



          box-shadow: 0 10px 22px rgba(255,122,0,.16);



        }



        .challenge-next:disabled {



          cursor: not-allowed;



          opacity: .42;



          box-shadow: none;



        }



        .kf-challenge-result {



          margin-top: 20px;



          padding: 30px;



          border-radius: 25px;



          text-align: center;



          background:



            radial-gradient(circle at 50% 0%, rgba(255,224,190,.55), transparent 42%),



            #fffdf9;



          border: 1px solid #e1d9cf;



        }



        .result-score {



          color: #ff7a00;



          font-family: var(--font-display);



          font-size: 72px;



          line-height: 1;



          font-weight: 800;



          letter-spacing: -.05em;



        }



        .kf-challenge-result h3 {



          max-width: 780px;



          margin: 8px auto 18px;



          color: #304457;



          font-family: var(--font-display);



          font-size: 24px;



          line-height: 1.2;



          font-weight: 700;



        }



        .kf-civic-sense-small-karma {



          display: grid;



          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);



          gap: 24px;



          align-items: start;



          margin-top: 18px;



          padding: 28px;



          border-radius: 30px;



          background:



            linear-gradient(135deg, #fff0df 0%, #ffe5c9 56%, #f7efe4 100%);



          border: 1px solid #eed8bb;



          box-shadow: 0 14px 38px rgba(16,27,43,.045);



        }



        .kf-civic-sense-small-karma p {



          margin: 0;



          color: #7b6d5d;



          font-size: 13px;



          line-height: 1.7;



        }



        .small-karma-list {



          display: grid;



          gap: 8px;



        }



        .small-karma-item {

  position: relative;

  overflow: hidden;

  display: grid;

  grid-template-columns: 34px 1fr;

  gap: 10px;

  align-items: start;

  padding: 10px 12px;

  border-radius: 15px;

  background: rgba(255,255,255,.62);

  border: 1px solid rgba(159,119,83,.11);

  box-shadow: inset 0 1px 0 rgba(255,255,255,.68), 0 6px 18px rgba(105,74,46,.035);

}



.small-karma-item::after {

  content: "";

  position: absolute;

  width: 74px;

  height: 74px;

  right: -30px;

  top: -34px;

  border-radius: 50%;

  opacity: .46;

  pointer-events: none;

}



.small-karma-item:nth-child(1) {

  background: linear-gradient(90deg, rgba(255,248,238,.86), rgba(255,239,220,.74));

  border-color: rgba(219,171,126,.24);

}

.small-karma-item:nth-child(1)::after { background: #f7c995; }



.small-karma-item:nth-child(2) {

  background: linear-gradient(90deg, rgba(247,241,252,.86), rgba(239,230,249,.74));

  border-color: rgba(176,149,205,.23);

}

.small-karma-item:nth-child(2)::after { background: #d9c3ec; }



.small-karma-item:nth-child(3) {

  background: linear-gradient(90deg, rgba(238,249,245,.86), rgba(226,241,234,.74));

  border-color: rgba(130,174,150,.22);

}

.small-karma-item:nth-child(3)::after { background: #b8ddc5; }



.small-karma-item:nth-child(4) {

  background: linear-gradient(90deg, rgba(238,246,252,.88), rgba(224,239,248,.74));

  border-color: rgba(126,165,192,.22);

}

.small-karma-item:nth-child(4)::after { background: #bbdcec; }



.small-karma-item:nth-child(5) {

  background: linear-gradient(90deg, rgba(244,248,234,.88), rgba(232,243,216,.74));

  border-color: rgba(147,171,108,.22);

}

.small-karma-item:nth-child(5)::after { background: #d0df9e; }



.small-karma-item:nth-child(6) {

  background: linear-gradient(90deg, rgba(255,244,233,.88), rgba(251,229,209,.74));

  border-color: rgba(209,150,112,.22);

}

.small-karma-item:nth-child(6)::after { background: #f2c3a1; }



        .small-karma-item > span {



          color: #b07a4e;



          font-size: 9px;



          font-weight: 900;



          letter-spacing: .12em;



        }



        .small-karma-item p {



          color: #6f6255;



          font-size: 11.5px;



          line-height: 1.55;



        }



        .kf-civic-sense-final {



          margin-top: 18px;



          padding: 34px 28px;



          border-radius: 30px;



          text-align: center;



          background:



            radial-gradient(circle at 90% 0%, rgba(184,219,237,.50), transparent 24%),



            radial-gradient(circle at 10% 100%, rgba(255,216,181,.42), transparent 26%),



            #fffdf9;



          border: 1px solid #ded8cf;



        }



        .kf-civic-sense-final p {



          max-width: 700px;



          margin: 0 auto;



          color: #697883;



          font-size: 13px;



          line-height: 1.75;



        }



        .final-actions {



          display: flex;



          justify-content: center;



          gap: 9px;



          flex-wrap: wrap;



          margin-top: 18px;



        }



        .final-primary,



        .final-secondary {



          display: inline-flex;



          min-height: 44px;



          align-items: center;



          justify-content: center;



          border-radius: 999px;



          padding: 10px 16px;



          font-family: var(--font-body);



          font-size: 11px;



          font-weight: 900;



          text-decoration: none;



        }



        .final-primary {



          background: #ff7a00;



          color: #fff;



          box-shadow: 0 10px 22px rgba(255,122,0,.15);



        }



        .final-secondary {



          border: 1px solid #d8d1c7;



          background: #fffdf9;



          color: #526273;



        }



        .kf-civic-sense-footer {



          display: flex;



          align-items: center;



          justify-content: space-between;



          gap: 20px;



          margin-top: 28px;



          padding: 26px 4px 4px;



          color: #8793a1;



          font-size: 10px;



          line-height: 1.5;



          font-weight: 800;



          text-align: center;



        }



        .kf-civic-sense-footer .footer-brand {



          font-family: var(--font-display);



          font-size: 18px;



          line-height: 1;



          letter-spacing: -.035em;



        }



        .footer-krut {



          color: #102033;



        }



        .footer-bharat {



          color: #ff7a00;



        }



        @media (max-width: 850px) {



          .kf-civic-sense-topbar {



            grid-template-columns: 1fr auto;



          }



          .kf-civic-sense-brand {



            grid-column: 1 / -1;



            grid-row: 1;



          }



          .kf-civic-sense-back {



            grid-row: 2;



          }



          .kf-civic-sense-language {



            grid-row: 2;



          }



          .kf-civic-sense-hero {



            grid-template-columns: 1fr;



            padding: 28px;



          }



          .kf-civic-sense-hero-badge {



            min-height: 190px;



          }



          .kf-civic-sense-small-karma {



            grid-template-columns: 1fr;



          }



        }



        @media (max-width: 640px) {



          .kf-civic-sense-page {



            padding: 12px 10px 55px !important;



          }



          .kf-civic-sense-topbar {



            min-height: 0;



            padding: 9px 10px;



            border-radius: 25px;



          }



          .kf-civic-sense-brand-name {



            font-size: 24px;



          }



          .kf-civic-sense-brand-mark {



            width: 46px;



            height: 46px;



            border-radius: 14px;



            font-size: 25px;



          }



          .kf-civic-sense-hero {



            min-height: 0;



            padding: 24px 20px;



            border-radius: 25px;



          }



          .kf-civic-sense-section,



          .kf-civic-sense-small-karma,



          .kf-civic-sense-final {



            padding: 22px 19px;



            border-radius: 24px;



          }



          .kf-civic-sense-habit-grid {



            grid-template-columns: 1fr;



          }



          .kf-civic-sense-footer {



            flex-direction: column;



          }



        }



        html[data-theme="dark"] body {

          background: #050c16 !important;

        }



        html[data-theme="dark"] .kf-civic-sense-page {

          background:

            radial-gradient(circle at 92% 4%, rgba(32,92,123,.24) 0%, transparent 27%),

            radial-gradient(circle at 6% 40%, rgba(145,73,36,.16) 0%, transparent 24%),

            linear-gradient(180deg, #06111d 0%, #081a2a 52%, #050c16 100%) !important;

          color: #f5f7fb !important;

        }



        html[data-theme="dark"] .kf-civic-sense-topbar {



          border-color: rgba(115,166,205,.20);



          background: rgba(10,29,47,.92);



          box-shadow: 0 18px 46px rgba(0,0,0,.28), 0 0 22px rgba(24,191,255,.05);



        }



        html[data-theme="dark"] .kf-civic-sense-back,



        html[data-theme="dark"] .kf-civic-sense-language select {



          border-color: rgba(145,174,204,.18);



          background: rgba(15,34,54,.82);



          color: #dce8f3;



        }



        html[data-theme="dark"] .kf-civic-sense-brand-name .krut,



        html[data-theme="dark"] .footer-krut {



          color: #ffffff;



        }



        html[data-theme="dark"] .kf-civic-sense-brand-caption {



          color: #8ea6bc;



        }



        html[data-theme="dark"] .kf-civic-sense-hero {



          border-color: rgba(126,169,201,.18);



          background:



            radial-gradient(circle at 88% 4%, rgba(35,102,138,.28) 0%, transparent 34%),



            radial-gradient(circle at 1% 100%, rgba(163,87,43,.18) 0%, transparent 36%),



            linear-gradient(145deg, #102b42 0%, #0a1d32 58%, #08182a 100%);



          box-shadow: 0 22px 55px rgba(0,0,0,.28);



        }



        html[data-theme="dark"] .kf-civic-sense-hero h1,



        html[data-theme="dark"] .kf-civic-sense-section h2,



        html[data-theme="dark"] .kf-civic-sense-small-karma h2,



        html[data-theme="dark"] .kf-civic-sense-final h2 {



          color: #f7f9fc;



        }



        html[data-theme="dark"] .kf-civic-sense-hero-subtitle {



          color: #d7e4ef;



        }



        html[data-theme="dark"] .kf-civic-sense-hero-description,



        html[data-theme="dark"] .kf-civic-sense-section > p,



        html[data-theme="dark"] .section-description,



        html[data-theme="dark"] .kf-civic-sense-habit-card p,



        html[data-theme="dark"] .kf-civic-sense-final p {



          color: #aebfd0;



        }



        html[data-theme="dark"] .kf-civic-sense-hero-badge {



          background: linear-gradient(145deg, #1a3c53, #152a3d);



          border-color: rgba(135,173,201,.18);



        }



        html[data-theme="dark"] .badge-label {



          color: #9db1c3;



        }



        html[data-theme="dark"] .kf-civic-sense-section {



          background: rgba(12,31,50,.94);



          border-color: rgba(125,162,193,.18);



          box-shadow: 0 18px 44px rgba(0,0,0,.22);



        }



        html[data-theme="dark"] .kf-civic-sense-habit-card {

  background: #102840;

  border-color: rgba(125,162,193,.16);

  box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 14px 30px rgba(0,0,0,.17);

}



html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(1) {

  background: linear-gradient(145deg, #33281f 0%, #14263a 100%);

  border-color: rgba(238,173,111,.26);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(2) {

  background: linear-gradient(145deg, #2d2741 0%, #12283c 100%);

  border-color: rgba(189,156,225,.24);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(3) {

  background: linear-gradient(145deg, #19392f 0%, #10283d 100%);

  border-color: rgba(127,197,163,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(4) {

  background: linear-gradient(145deg, #19394a 0%, #112a40 100%);

  border-color: rgba(112,188,223,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(5) {

  background: linear-gradient(145deg, #293822 0%, #12293b 100%);

  border-color: rgba(184,213,107,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(6) {

  background: linear-gradient(145deg, #3a2a21 0%, #15283d 100%);

  border-color: rgba(240,172,117,.24);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(7) {

  background: linear-gradient(145deg, #193941 0%, #112a3e 100%);

  border-color: rgba(111,186,194,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(8) {

  background: linear-gradient(145deg, #302843 0%, #14283d 100%);

  border-color: rgba(195,166,226,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(9) {

  background: linear-gradient(145deg, #273a24 0%, #12293b 100%);

  border-color: rgba(152,202,123,.22);

}

html[data-theme="dark"] .kf-civic-sense-habit-card:nth-child(10) {

  background: linear-gradient(145deg, #3a2a20 0%, #15293c 100%);

  border-color: rgba(238,173,113,.24);

}



        html[data-theme="dark"] .kf-civic-sense-habit-card h3 {



          color: #f4f8fc;



        }



        html[data-theme="dark"] .habit-icon {



          background: rgba(24,191,255,.10);



          border: 1px solid rgba(24,191,255,.16);



        }



        html[data-theme="dark"] .kf-civic-sense-challenge {



          background:



            linear-gradient(145deg, #2c2440 0%, #142b43 100%);



          border-color: rgba(180,148,215,.17);



        }



        html[data-theme="dark"] .kf-challenge-card,



        html[data-theme="dark"] .kf-challenge-result {



          background: #0d2237;



          border-color: rgba(125,162,193,.16);



        }



        html[data-theme="dark"] .challenge-question {



          color: #f6f9fc;



        }



        html[data-theme="dark"] .challenge-label,



        html[data-theme="dark"] .challenge-step {



          color: #91a8bc;



        }



        html[data-theme="dark"] .challenge-option {



          background: #102840;



          border-color: rgba(125,162,193,.18);



          color: #bdcada;



        }



        html[data-theme="dark"] .challenge-option.selected {



          background: #153a56;



          border-color: rgba(24,191,255,.40);



        }



        html[data-theme="dark"] .challenge-option.correct {



          background: #163524;



          border-color: rgba(182,243,58,.34);



          color: #d9edca;



        }



        html[data-theme="dark"] .challenge-option.wrong {



          background: #3b1d27;



          border-color: rgba(255,100,100,.28);



          color: #ffd8d8;



        }



        html[data-theme="dark"] .option-letter {



          background: rgba(255,255,255,.06);



          color: #a8bacb;



        }



        html[data-theme="dark"] .challenge-progress {



          background: rgba(255,255,255,.07);



        }



        html[data-theme="dark"] .kf-civic-sense-small-karma {



          background:



            linear-gradient(145deg, #3a271c 0%, #2a1b16 100%);



          border-color: rgba(255,179,122,.18);



        }



        html[data-theme="dark"] .kf-civic-sense-small-karma p,



        html[data-theme="dark"] .small-karma-item p {



          color: #d1c2b5;



        }



        html[data-theme="dark"] .small-karma-item {

  background: rgba(255,255,255,.04);

  border-color: rgba(255,179,122,.13);

  box-shadow: inset 0 1px 0 rgba(255,255,255,.025), 0 8px 20px rgba(0,0,0,.12);

}



html[data-theme="dark"] .small-karma-item:nth-child(1) {

  background: linear-gradient(90deg, rgba(94,58,34,.50), rgba(60,42,31,.40));

  border-color: rgba(245,181,126,.18);

}

html[data-theme="dark"] .small-karma-item:nth-child(2) {

  background: linear-gradient(90deg, rgba(66,48,88,.50), rgba(45,37,64,.40));

  border-color: rgba(198,167,228,.17);

}

html[data-theme="dark"] .small-karma-item:nth-child(3) {

  background: linear-gradient(90deg, rgba(33,76,60,.48), rgba(26,52,46,.40));

  border-color: rgba(136,205,170,.16);

}

html[data-theme="dark"] .small-karma-item:nth-child(4) {

  background: linear-gradient(90deg, rgba(34,72,93,.48), rgba(24,48,67,.40));

  border-color: rgba(123,194,222,.16);

}

html[data-theme="dark"] .small-karma-item:nth-child(5) {

  background: linear-gradient(90deg, rgba(70,81,40,.46), rgba(43,50,31,.38));

  border-color: rgba(201,219,126,.15);

}

html[data-theme="dark"] .small-karma-item:nth-child(6) {

  background: linear-gradient(90deg, rgba(92,54,37,.50), rgba(59,40,31,.40));

  border-color: rgba(241,174,122,.18);

}



        html[data-theme="dark"] .kf-civic-sense-final {



          background:



            radial-gradient(circle at 90% 0%, rgba(35,102,138,.23), transparent 24%),



            #102840;



          border-color: rgba(125,162,193,.18);



        }



        html[data-theme="dark"] .kf-civic-sense-footer {



          color: #8298ac;



        }



        html[data-theme="dark"] .kf-civic-sense-hero .kf-civic-sense-eyebrow,



        html[data-theme="dark"] .kf-civic-sense-page .section-kicker {



          color: #ff9147;



        }



      `}</style>



    
        <style>{`
          @media (max-width: 1023px) {
            .kf-civic-sense-page {
              width: 100% !important;
              min-height: 100vh !important;
              padding: 82px 10px 112px !important;
              overflow-x: clip !important;
              box-sizing: border-box !important;
            }

            .kf-civic-sense-page > div {
              width: 100% !important;
              max-width: 760px !important;
              margin: 0 auto !important;
            }

            .kf-civic-sense-topbar {
              display: none !important;
            }

            .kf-civic-sense-hero {
              display: block !important;
              width: 100% !important;
              min-height: 0 !important;
              margin: 0 0 14px !important;
              padding: 24px 18px 20px !important;
              border-radius: 24px !important;
              box-sizing: border-box !important;
            }

            .kf-civic-sense-hero-copy {
              width: 100% !important;
              max-width: none !important;
            }

            .kf-civic-sense-hero h1 {
              font-size: clamp(42px, 12vw, 58px) !important;
              line-height: .96 !important;
              letter-spacing: -.05em !important;
              margin: 8px 0 9px !important;
            }

            .kf-civic-sense-hero-subtitle {
              max-width: none !important;
              font-size: 17px !important;
              line-height: 1.24 !important;
              margin: 10px 0 0 !important;
            }

            .kf-civic-sense-hero-description {
              max-width: none !important;
              font-size: 13px !important;
              line-height: 1.68 !important;
              margin: 10px 0 0 !important;
            }

            .kf-civic-sense-hero-badge {
              width: 100% !important;
              min-height: 116px !important;
              margin-top: 15px !important;
              display: grid !important;
              place-items: center !important;
              border-radius: 20px !important;
              box-sizing: border-box !important;
            }

            .kf-civic-sense-hero-badge .big-icon {
              font-size: 42px !important;
            }

            .kf-civic-sense-section,
            .kf-civic-sense-small-karma,
            .kf-civic-sense-final {
              width: 100% !important;
              margin-bottom: 14px !important;
              padding: 20px 17px !important;
              border-radius: 22px !important;
              box-sizing: border-box !important;
            }

            .kf-civic-sense-section h2,
            .kf-civic-sense-small-karma h2,
            .kf-civic-sense-final h2 {
              font-size: clamp(28px, 8vw, 38px) !important;
              line-height: 1.02 !important;
              margin-top: 6px !important;
            }

            .kf-civic-sense-section > p {
              font-size: 13px !important;
              line-height: 1.68 !important;
            }

            .kf-civic-sense-habit-grid {
              grid-template-columns: 1fr !important;
              gap: 9px !important;
            }

            .kf-civic-sense-habit-card {
              min-height: 0 !important;
              padding: 15px !important;
              border-radius: 17px !important;
            }

            .kf-civic-sense-scenario-card {
              padding: 16px !important;
              border-radius: 18px !important;
            }

            .kf-civic-sense-scenario-option {
              width: 100% !important;
              min-height: 48px !important;
              text-align: left !important;
              padding: 11px 12px !important;
              border-radius: 14px !important;
              box-sizing: border-box !important;
            }

            .kf-civic-sense-small-karma {
              display: block !important;
            }

            .kf-civic-sense-small-karma > div {
              width: 100% !important;
            }

            .kf-civic-sense-footer {
              width: 100% !important;
              gap: 8px !important;
              padding: 14px 2px 4px !important;
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            /* Avoid decorative orbs forcing horizontal overflow. */
            .kf-civic-sense-hero-orb {
              opacity: .45 !important;
            }
          }

          @media (max-width: 420px) {
            .kf-civic-sense-page {
              padding-left: 8px !important;
              padding-right: 8px !important;
            }

            .kf-civic-sense-hero {
              padding: 21px 15px 17px !important;
            }

            .kf-civic-sense-section,
            .kf-civic-sense-small-karma,
            .kf-civic-sense-final {
              padding: 18px 15px !important;
            }

            .kf-civic-sense-hero-badge {
              min-height: 102px !important;
            }
          }

          html[data-theme="dark"] .kf-civic-sense-hero,
          html[data-theme="dark"] .kf-civic-sense-section,
          html[data-theme="dark"] .kf-civic-sense-small-karma,
          html[data-theme="dark"] .kf-civic-sense-final {
            border-color: rgba(145,174,204,.14) !important;
          }
        `}</style>

    </main>



  );



}
