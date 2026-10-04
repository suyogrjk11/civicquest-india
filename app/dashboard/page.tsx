"use client";

import KrutBharatMobileShell from "@/components/KrutBharatMobileShell";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";

type Profile = {
  name: string;
  state: string;
  city: string;
  ageGroup: string;
  interests: string[];
};

function displayCityName(value: string, language: Language) {
  const normalized = String(value ?? "").trim().toLocaleLowerCase();

  if (normalized === "aurangabad") {
    return language === "en"
      ? "Chhatrapati Sambhajinagar"
      : "छत्रपती संभाजीनगर";
  }

  return String(value ?? "").trim();
}

type LearningProgress = {
  topic: string;
  completed: boolean;
  score: number | null;
};

const supabase = createClient();

const learningTopicsByLanguage: Record<
  Language,
  {
    key: string;
    title: string;
    icon: string;
    path: string;
  }[]
> = {
  en: [
    {
      key: "government",
      title: "Government & Governance",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "Constitution & Democracy",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "Elections & Civic Participation",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "Local Issues",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "Environment",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "Economy & Jobs",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "Education",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "Healthcare",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],

  hi: [
    {
      key: "government",
      title: "सरकार और शासन व्यवस्था",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "संविधान और लोकतंत्र",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "चुनाव और नागरिक भागीदारी",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "स्थानीय समस्याएँ",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "पर्यावरण",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "अर्थव्यवस्था और रोजगार",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "शिक्षा",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "स्वास्थ्य सेवा",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],

  mr: [
    {
      key: "government",
      title: "सरकार आणि शासनव्यवस्था",
      icon: "🏛️",
      path: "/explore/government",
    },
    {
      key: "constitution",
      title: "संविधान आणि लोकशाही",
      icon: "⚖️",
      path: "/explore/constitution",
    },
    {
      key: "elections",
      title: "निवडणुका आणि नागरिकांचा सहभाग",
      icon: "🗳️",
      path: "/explore/elections",
    },
    {
      key: "local-issues",
      title: "स्थानिक समस्या",
      icon: "🏙️",
      path: "/explore/local-issues",
    },
    {
      key: "environment",
      title: "पर्यावरण",
      icon: "🌱",
      path: "/explore/environment",
    },
    {
      key: "economy",
      title: "अर्थव्यवस्था आणि रोजगार",
      icon: "💼",
      path: "/explore/economy",
    },
    {
      key: "education",
      title: "शिक्षण",
      icon: "🎓",
      path: "/explore/education",
    },
    {
      key: "healthcare",
      title: "आरोग्य सेवा",
      icon: "🏥",
      path: "/explore/healthcare",
    },
  ],
};

const content = {
  en: {
    dashboardSubtitle: "Your civic dashboard",
    editProfile: "Edit Profile",
    home: "Home",
    civicLeagues: "Civic Leagues",
    civicLeaguesDescription:
      "Join a local civic team, complete real-world missions and build measurable civic impact.",
    civicLeaguesAction: "Explore Civic Leagues →",

    welcomeLabel: "WELCOME BACK",
    hello: "Hello",
    welcomeDescription:
      "Welcome to KrutBharat. Explore civic knowledge, understand your community and build your civic participation journey.",

    location: "Location",
    ageGroup: "Age Group",
    interests: "Interests",
    civicProfile: "Your civic profile",
    topics: "topics",
    interestedTopics: "Topics you're interested in",

    learningLabel: "YOUR LEARNING",
    progressTitle: "Your KrutBharat Progress",
    progressDescription:
      "Complete KrutBharat topics and test what you learn through interactive quizzes.",

    overallCompletion: "OVERALL COMPLETION",
    topicsLabel: "Topics",
    keepExploring:
      "Keep exploring and complete all eight civic learning topics.",

    completed: "Completed",
    notStarted: "Not Started",
    quizScore: "Quiz score:",
    completeQuiz:
      "Complete the lesson quiz to track your progress.",
    reviewTopic: "Review Topic →",
    startLearning: "Start Learning →",

    civicQuestLabel: "KRUTBHARAT",
    quickAccessLabel: "QUICK ACCESS",
    quickAccessTitle: "Start with what you need.",
    whatWouldYouLike: "What would you like to do?",

    explore: "Civic Learning",
    exploreDescription:
      "Learn how government, democracy, elections, local issues and public services affect everyday civic life.",
    exploreAction: "Explore Civic Learning →",

    reportIssue: "Report an Issue",
    reportIssueDescription:
      "Report civic problems in your locality with evidence, location and useful details.",
    reportIssueAction: "Report a civic issue →",

    myCivicIssues: "My Civic Issues",
    myCivicIssuesDescription:
      "View the civic problems you have reported, see your evidence and track their current status.",
    myCivicIssuesAction: "View your reports →",

    civicSense: "Civic Sense",
    civicSenseDescription:
      "Understand the everyday habits that make shared spaces cleaner, safer and more respectful.",
    civicSenseAction: "Explore Civic Sense →",
    responsibleAuthorities: "Responsible Authorities",
    responsibleAuthoritiesDescription:
      "Know who represents and governs the area you are in, from local bodies to MLA, MP and public authorities.",
    responsibleAuthoritiesAction: "View Responsible Authorities →",

    civicQuests: "Civic Quests",
    civicQuestsDescription:
      "Take interactive civic challenges and test your understanding of India and democracy.",
    civicQuestsAlert: "Civic Quests feature is coming soon.",

    community: "Community",
    communityDescription:
      "Connect with civic-minded people and discover conversations around your community.",
    communityAction: "Open Community →",
    communityAlert: "Community feature is coming soon.",

    myImpact: "My Impact",
    myImpactDescription:
      "Track your civic participation and see how your activities contribute to your community.",
    myImpactAction: "Open My Impact →",
    myImpactAlert: "My Impact feature is coming soon.",

    civicPassport: "Civic Passport",
    civicPassportDescription:
      "Your personal record of verified civic participation, Karma Credits, missions and team contribution.",
    civicPassportAction: "Open Civic Passport →",

    knowIndia: "Know India",
    knowIndiaDescription:
      "Discover India's Constitution, institutions, history, geography and civic systems.",
    knowIndiaAlert: "Know India feature is coming soon.",

    footer: "Your civic journey starts here.",

    loading: "Loading your dashboard...",
    profileError: "Could not load your profile.",
  },

  hi: {
    dashboardSubtitle: "आपका नागरिक डैशबोर्ड",
    editProfile: "प्रोफ़ाइल संपादित करें",
    home: "होम",
    civicLeagues: "सिविक लीग्स",
    civicLeaguesDescription:
      "एक स्थानीय नागरिक टीम से जुड़ें, वास्तविक दुनिया के मिशन पूरे करें और मापने योग्य नागरिक प्रभाव बनाएँ।",
    civicLeaguesAction: "सिविक लीग्स देखें →",

    welcomeLabel: "वापसी पर स्वागत है",
    hello: "नमस्ते",
    welcomeDescription:
      "KrutBharat में आपका स्वागत है। नागरिक ज्ञान को जानें, अपने समुदाय को समझें और अपनी नागरिक भागीदारी की यात्रा शुरू करें।",

    location: "स्थान",
    ageGroup: "आयु वर्ग",
    interests: "रुचियाँ",
    civicProfile: "आपकी नागरिक प्रोफ़ाइल",
    topics: "विषय",
    interestedTopics: "आपकी रुचि के विषय",

    learningLabel: "आपकी सीखने की यात्रा",
    progressTitle: "आपकी KrutBharat प्रगति",
    progressDescription:
      "KrutBharat के विषय पूरे करें और इंटरैक्टिव क्विज़ के माध्यम से अपनी सीख का परीक्षण करें।",

    overallCompletion: "कुल प्रगति",
    topicsLabel: "विषय",
    keepExploring:
      "सीखना जारी रखें और सभी आठ नागरिक शिक्षा विषय पूरे करें।",

    completed: "पूरा हुआ",
    notStarted: "शुरू नहीं हुआ",
    quizScore: "क्विज़ स्कोर:",
    completeQuiz:
      "अपनी प्रगति दर्ज करने के लिए पाठ का क्विज़ पूरा करें।",
    reviewTopic: "विषय दोबारा देखें →",
    startLearning: "सीखना शुरू करें →",

    civicQuestLabel: "KRUTBHARAT",
    quickAccessLabel: "त्वरित पहुँच",
    quickAccessTitle: "जिसकी ज़रूरत है, वहीं से शुरू करें।",
    whatWouldYouLike: "आप क्या करना चाहते हैं?",

    explore: "नागरिक शिक्षा",
    exploreDescription:
      "सरकार, लोकतंत्र, चुनाव, स्थानीय समस्याओं और सार्वजनिक सेवाओं के बारे में नागरिक ज्ञान बढ़ाएँ।",
    exploreAction: "नागरिक शिक्षा देखें →",

    reportIssue: "समस्या की रिपोर्ट करें",
    reportIssueDescription:
      "अपने क्षेत्र की नागरिक समस्याओं की प्रमाण, स्थान और उपयोगी विवरण के साथ रिपोर्ट करें।",
    reportIssueAction: "नागरिक समस्या रिपोर्ट करें →",

    myCivicIssues: "मेरी नागरिक समस्याएँ",
    myCivicIssuesDescription:
      "आपके द्वारा रिपोर्ट की गई नागरिक समस्याएँ देखें, अपने प्रमाण देखें और उनकी वर्तमान स्थिति को ट्रैक करें।",
    myCivicIssuesAction: "अपनी रिपोर्ट देखें →",

    civicSense: "नागरिक बोध",
    civicSenseDescription:
      "उन रोज़मर्रा की आदतों को समझें जो साझा स्थानों को साफ़, सुरक्षित और सम्मानजनक बनाती हैं।",
    civicSenseAction: "नागरिक बोध देखें →",
    responsibleAuthorities: "जिम्मेदार प्राधिकरण",
    responsibleAuthoritiesDescription:
      "जानें कि आप जिस क्षेत्र में हैं उसका प्रतिनिधित्व और प्रशासन कौन करता है — स्थानीय निकाय, MLA, MP और सार्वजनिक प्राधिकरण सहित।",
    responsibleAuthoritiesAction: "जिम्मेदार प्राधिकरण देखें →",

    civicQuests: "Civic Quests",
    civicQuestsDescription:
      "इंटरैक्टिव नागरिक चुनौतियों में भाग लें और भारत तथा लोकतंत्र की अपनी समझ को परखें।",
    civicQuestsAlert: "Civic Quests सुविधा जल्द आ रही है।",

    community: "समुदाय",
    communityDescription:
      "नागरिक मामलों में रुचि रखने वाले लोगों से जुड़ें और अपने समुदाय से जुड़ी चर्चाओं को जानें।",
    communityAction: "Community खोलें →",
    communityAlert: "Community सुविधा जल्द आ रही है।",

    myImpact: "मेरा प्रभाव",
    myImpactDescription:
      "अपनी नागरिक भागीदारी को ट्रैक करें और देखें कि आपकी गतिविधियाँ आपके समुदाय में कैसे योगदान करती हैं।",
    myImpactAction: "मेरा प्रभाव खोलें →",
    myImpactAlert: "My Impact सुविधा जल्द आ रही है।",

    civicPassport: "Civic Passport",
    civicPassportDescription:
      "आपकी सत्यापित नागरिक भागीदारी, Karma Credits, मिशनों और टीम योगदान का व्यक्तिगत रिकॉर्ड।",
    civicPassportAction: "Civic Passport खोलें →",

    knowIndia: "भारत को जानें",
    knowIndiaDescription:
      "भारत के संविधान, संस्थाओं, इतिहास, भूगोल और नागरिक व्यवस्थाओं के बारे में जानें।",
    knowIndiaAlert: "Know India सुविधा जल्द आ रही है।",

    footer: "आपकी नागरिक यात्रा यहीं से शुरू होती है।",

    loading: "आपका डैशबोर्ड लोड हो रहा है...",
    profileError: "आपकी प्रोफ़ाइल लोड नहीं हो सकी।",
  },

  mr: {
    dashboardSubtitle: "तुमचा नागरिक डॅशबोर्ड",
    editProfile: "प्रोफाइल संपादित करा",
    home: "होम",
    civicLeagues: "सिविक लीग्स",
    civicLeaguesDescription:
      "स्थानिक नागरिक टीममध्ये सामील व्हा, प्रत्यक्ष नागरी मिशन्स पूर्ण करा आणि मोजता येण्याजोगा नागरिक प्रभाव निर्माण करा.",
    civicLeaguesAction: "सिविक लीग्स एक्सप्लोर करा →",

    welcomeLabel: "पुन्हा स्वागत आहे",
    hello: "नमस्कार",
    welcomeDescription:
      "KrutBharat मध्ये तुमचे स्वागत आहे. नागरिक ज्ञान जाणून घ्या, तुमचा समुदाय समजून घ्या आणि तुमच्या नागरिक सहभागाची वाटचाल सुरू करा.",

    location: "स्थान",
    ageGroup: "वयोगट",
    interests: "आवडी",
    civicProfile: "तुमची नागरिक प्रोफाइल",
    topics: "विषय",
    interestedTopics: "तुम्हाला आवडणारे विषय",

    learningLabel: "तुमची शिकण्याची वाटचाल",
    progressTitle: "तुमची KrutBharat प्रगती",
    progressDescription:
      "KrutBharat चे विषय पूर्ण करा आणि इंटरॅक्टिव्ह क्विझद्वारे तुम्ही काय शिकलात ते तपासा.",

    overallCompletion: "एकूण प्रगती",
    topicsLabel: "विषय",
    keepExploring:
      "शिकत राहा आणि नागरिक शिक्षणाचे सर्व आठ विषय पूर्ण करा.",

    completed: "पूर्ण झाले",
    notStarted: "सुरू केलेले नाही",
    quizScore: "क्विझ गुण:",
    completeQuiz:
      "तुमची प्रगती नोंदवण्यासाठी धड्याचा क्विझ पूर्ण करा.",
    reviewTopic: "विषय पुन्हा पाहा →",
    startLearning: "शिकायला सुरुवात करा →",

    civicQuestLabel: "KRUTBHARAT",
    quickAccessLabel: "द्रुत प्रवेश",
    quickAccessTitle: "तुम्हाला हवे तेथून सुरुवात करा.",
    whatWouldYouLike: "तुम्हाला काय करायचे आहे?",

    explore: "नागरिक शिक्षण",
    exploreDescription:
      "सरकार, लोकशाही, निवडणुका, स्थानिक समस्या आणि सार्वजनिक सेवांबद्दल नागरिक ज्ञान वाढवा.",
    exploreAction: "नागरिक शिक्षण पहा →",

    reportIssue: "समस्या नोंदवा",
    reportIssueDescription:
      "तुमच्या परिसरातील नागरी समस्या पुरावे, स्थान आणि उपयुक्त माहितीसह नोंदवा.",
    reportIssueAction: "नागरी समस्या नोंदवा →",

    myCivicIssues: "माझ्या नागरी समस्या",
    myCivicIssuesDescription:
      "तुम्ही नोंदवलेल्या नागरी समस्या पाहा, तुमचे पुरावे तपासा आणि त्यांची सध्याची स्थिती ट्रॅक करा.",
    myCivicIssuesAction: "तुमच्या नोंदी पाहा →",

    civicSense: "नागरी जाणीव",
    civicSenseDescription:
      "सामायिक जागा स्वच्छ, सुरक्षित आणि अधिक आदरयुक्त ठेवणाऱ्या दैनंदिन सवयी समजून घ्या.",
    civicSenseAction: "नागरी जाणीव पाहा →",
    responsibleAuthorities: "जबाबदार प्राधिकरण",
    responsibleAuthoritiesDescription:
      "तुम्ही ज्या परिसरात आहात त्याचे प्रतिनिधित्व आणि प्रशासन कोण करते ते जाणून घ्या — स्थानिक संस्था, MLA, MP आणि सार्वजनिक प्राधिकरणांसह.",
    responsibleAuthoritiesAction: "जबाबदार प्राधिकरण पाहा →",

    civicQuests: "Civic Quests",
    civicQuestsDescription:
      "इंटरॅक्टिव्ह नागरी आव्हानांमध्ये सहभागी व्हा आणि भारत व लोकशाहीबद्दलची तुमची समज तपासा.",
    civicQuestsAlert: "Civic Quests सुविधा लवकरच येत आहे.",

    community: "समुदाय",
    communityDescription:
      "नागरी विषयांमध्ये रस असलेल्या लोकांशी जोडा आणि तुमच्या समुदायाशी संबंधित चर्चांचा शोध घ्या.",
    communityAction: "Community उघडा →",
    communityAlert: "Community सुविधा लवकरच येत आहे.",

    myImpact: "माझा प्रभाव",
    myImpactDescription:
      "तुमचा नागरिक सहभाग ट्रॅक करा आणि तुमच्या उपक्रमांमुळे समुदायाला कसा फायदा होतो ते पाहा.",
    myImpactAction: "माझा प्रभाव उघडा →",
    myImpactAlert: "My Impact सुविधा लवकरच येत आहे.",

    civicPassport: "Civic Passport",
    civicPassportDescription:
      "तुमच्या सत्यापित नागरिक सहभाग, Karma Credits, मिशन्स आणि टीम योगदानाची वैयक्तिक नोंद.",
    civicPassportAction: "Civic Passport उघडा →",

    knowIndia: "भारत जाणून घ्या",
    knowIndiaDescription:
      "भारताचे संविधान, संस्था, इतिहास, भूगोल आणि नागरिक व्यवस्था याबद्दल जाणून घ्या.",
    knowIndiaAlert: "Know India सुविधा लवकरच येत आहे.",

    footer: "तुमची नागरिक वाटचाल येथून सुरू होते.",

    loading: "तुमचा डॅशबोर्ड लोड होत आहे...",
    profileError: "तुमची प्रोफाइल लोड करता आली नाही.",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const text = content[language];
  const learningTopics = learningTopicsByLanguage[language];

  const [profile, setProfile] = useState<Profile | null>(null);
  const [learningProgress, setLearningProgress] = useState<
    LearningProgress[]
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/auth");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, state, city, age_group, interests")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Dashboard profile loading error:",
          profileError
        );

        alert(
          `${text.profileError}\n\n${profileError.message}`
        );

        setLoading(false);
        return;
      }

      if (!profileData) {
        router.replace("/get-started");
        return;
      }

      setProfile({
        name: profileData.name || "",
        state: profileData.state || "",
        city: profileData.city || "",
        ageGroup: profileData.age_group || "",
        interests: profileData.interests || [],
      });

      const {
        data: progressData,
        error: progressError,
      } = await supabase
        .from("learning_progress")
        .select("topic, completed, score")
        .eq("user_id", user.id);

      if (progressError) {
        console.error(
          "Dashboard learning progress loading error:",
          progressError
        );

        setLearningProgress([]);
      } else {
        setLearningProgress(progressData || []);
      }

      setLoading(false);
    };

    loadDashboard();
  }, [router, text.profileError]);

  const completedCount = learningTopics.filter((topic) =>
    learningProgress.some(
      (progress) =>
        progress.topic === topic.key &&
        progress.completed === true
    )
  ).length;

  const totalTopics = learningTopics.length;

  const completionPercentage = Math.round(
    (completedCount / totalTopics) * 100
  );

  if (loading) {
    return (
      <main
        className="kf-dashboard-page kf-dashboard-loading"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 88% 8%, rgba(223,234,243,.9) 0%, rgba(223,234,243,0) 24%), radial-gradient(circle at 8% 92%, rgba(255,225,197,.72) 0%, rgba(255,225,197,0) 25%), #f8f3ea",
          color: "#102033",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
      <KrutBharatMobileShell />
        <div
          style={{
            width: "min(420px, 100%)",
            textAlign: "center",
            background: "rgba(255,255,255,.78)",
            border: "1px solid rgba(16,27,43,.10)",
            borderRadius: "30px",
            padding: "36px 28px",
            boxShadow: "0 24px 60px rgba(16,27,43,.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            style={{
              fontSize: "34px",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              marginBottom: "10px",
              fontFamily: "var(--font-display)",
            }}
          >
            Krut<span style={{ color: "#ff7a00" }}>Bharat</span>
          </div>

          <div
            style={{
              width: "70px",
              height: "5px",
              margin: "0 auto 16px",
              borderRadius: "999px",
              background: "#ff7a00",
            }}
          />

          <p
            style={{
              color: "#7a8590",
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {text.loading}
          </p>
        </div>
      
      <style>{`
        @media (max-width: 1023px) {
          .kf-dashboard-page {
            padding: 0 10px 112px !important;
            overflow-x: clip !important;
          }

          .kf-dashboard-page .kf-dashboard-header {
            display: none !important;
          }

          .kf-dashboard-page > div {
            width: 100% !important;
            max-width: 760px !important;
            margin: 0 auto !important;
          }
        }

        @media (max-width: 420px) {
          .kf-dashboard-page {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
        }
      `}</style>

    </main>
    );
  }

  if (!profile) {
    return null;
  }

  const pastelCards = [
    { bg: "#edf5fb", accent: "#b5d3e7" },
    { bg: "#fff0df", accent: "#f1c38d" },
    { bg: "#eef5e6", accent: "#bdd29f" },
    { bg: "#f4edf8", accent: "#ceb0df" },
    { bg: "#edf5f0", accent: "#acd0c1" },
    { bg: "#fff3e2", accent: "#f2c783" },
    { bg: "#eef4f8", accent: "#bfd0dd" },
    { bg: "#f7eee6", accent: "#e4bea2" },
  ];

  const actionCards = [
    {
      icon: "📖",
      title: text.explore,
      description: text.exploreDescription,
      actionText: text.exploreAction,
      path: "/civic-learning",
      bg: "#edf5fb",
      accent: "#b5d3e7",
    },
    {
      icon: "🤝",
      title: text.civicSense,
      description: text.civicSenseDescription,
      actionText: text.civicSenseAction,
      path: "/civic-sense",
      bg: "#eaf4f2",
      accent: "#9fcfc5",
    },
    {
      icon: "🏛️",
      title: text.responsibleAuthorities,
      description: text.responsibleAuthoritiesDescription,
      actionText: text.responsibleAuthoritiesAction,
      path: "/responsible-authorities",
      bg: "#f4edf8",
      accent: "#c8a7dc",
    },
    {
      icon: "📢",
      title: text.reportIssue,
      description: text.reportIssueDescription,
      actionText: text.reportIssueAction,
      path: "/report-issue",
      bg: "#fff0df",
      accent: "#f1c38d",
    },
    {
      icon: "📋",
      title: text.myCivicIssues,
      description: text.myCivicIssuesDescription,
      actionText: text.myCivicIssuesAction,
      path: "/my-issues",
      bg: "#eef5e6",
      accent: "#bdd29f",
    },
    {
      icon: "🎯",
      title: text.civicQuests,
      description: text.civicQuestsDescription,
      actionText: "Explore Civic Quests →",
      path: "/civic-quests",
      bg: "#f4edf8",
      accent: "#ceb0df",
    },
    {
      icon: "🏆",
      title: text.civicLeagues,
      description: text.civicLeaguesDescription,
      actionText: text.civicLeaguesAction,
      path: "/leagues",
      bg: "#eef5e6",
      accent: "#bdd29f",
    },
    {
      icon: "👥",
      title: text.community,
      description: text.communityDescription,
      actionText: text.communityAction,
      path: "/community",
      bg: "#edf5f0",
      accent: "#acd0c1",
    },
    {
      icon: "📊",
      title: text.myImpact,
      description: text.myImpactDescription,
      actionText: text.myImpactAction,
      path: "/my-impact",
      bg: "#fff3e2",
      accent: "#f2c783",
    },
    {
      icon: "🪪",
      title: text.civicPassport,
      description: text.civicPassportDescription,
      actionText: text.civicPassportAction,
      path: "/civic-passport",
      bg: "#fff0df",
      accent: "#f1b875",
    },
    {
      icon: "🇮🇳",
      title: text.knowIndia,
      description: text.knowIndiaDescription,
      actionText: "Explore Know India →",
      path: "/know-india",
      bg: "#edf5fb",
      accent: "#b5d3e7",
    },
  ];

  return (
    <main
      className="kf-dashboard-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 90% 8%, rgba(223,234,243,.78) 0%, rgba(223,234,243,0) 22%), radial-gradient(circle at 4% 55%, rgba(231,241,247,.72) 0%, rgba(231,241,247,0) 23%), radial-gradient(circle at 88% 82%, rgba(255,229,207,.68) 0%, rgba(255,229,207,0) 21%), #f8f3ea",
        color: "#102033",
        padding: "18px 16px 0",
      }}
    >
      <KrutBharatMobileShell />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <header
          className="kf-dashboard-header sticky top-3 z-50"
          style={{
            position: "sticky",
            top: "12px",
            zIndex: 50,
            width: "100%",
            marginBottom: "26px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "18px",
                            flexWrap: "wrap",
                            padding: "10px 14px",
                            minHeight: 0,
                            boxSizing: "border-box",
                            background: "rgba(4, 10, 20, .62)",
                            border: "1px solid transparent",
                            borderRadius: "24px",
                            boxShadow:
                              "-10px 0 24px -8px rgba(0, 212, 255, .46), " +
                              "10px 0 24px -8px rgba(255, 140, 26, .46), " +
                              "0 10px 30px rgba(0,0,0,.34)",
                            backdropFilter: "blur(14px) saturate(125%)",
                            WebkitBackdropFilter: "blur(14px) saturate(125%)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => router.push("/")}
                            style={{
                              background: "transparent",
                              border: 0,
                              padding: "0 4px",
                              cursor: "pointer",
                              color: "#102033",
                              fontSize: "28px",
                              fontWeight: 800,
                              letterSpacing: "-0.045em",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            Krut<span style={{ color: "#ff7a00" }}>Bharat</span>
                          </button>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <select
                              value={language}
                              onChange={(e) => setLanguage(e.target.value as Language)}
                              aria-label="Language"
                              style={{
                                appearance: "none",
                                background: "rgba(255,255,255,.80)",
                                color: "#263447",
                                border: "1px solid rgba(16,27,43,.14)",
                                borderRadius: "999px",
                                padding: "10px 14px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              <option value="en">English</option>
                              <option value="hi">हिन्दी</option>
                              <option value="mr">मराठी</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => router.push("/")}
                              style={{
                                background: "#ffffff",
                                color: "#263447",
                                border: "1px solid rgba(16,27,43,.12)",
                                borderRadius: "999px",
                                padding: "10px 16px",
                                fontSize: "12px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              ← {text.home}
                            </button>

                            <button
                              type="button"
                              onClick={() => router.replace("/get-started")}
                              style={{
                                background: "#fff0df",
                                color: "#263447",
                                border: "1px solid rgba(255,122,0,.16)",
                                borderRadius: "999px",
                                padding: "10px 16px",
                                fontSize: "12px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              {text.editProfile}
                            </button>
                          </div>
        </header>

        {/* WELCOME */}
        <section
          className="kf-welcome-section"
          style={{
            marginBottom: "28px",
            overflow: "hidden",
            position: "relative",
            background:
              "radial-gradient(circle at 88% 10%, #e5eff6 0%, rgba(229,239,246,0) 32%), radial-gradient(circle at 12% 95%, #ffecd8 0%, rgba(255,236,216,0) 34%), rgba(255,253,249,.95)",
            border: "1px solid rgba(16,27,43,.10)",
            borderRadius: "34px",
            boxShadow: "0 18px 48px rgba(16,27,43,.065)",
          }}
        >
          {/* Decorative atmosphere */}
          <div
            className="kf-welcome-orb kf-welcome-orb-blue"
            aria-hidden="true"
            style={{
              position: "absolute",
              right: "-55px",
              top: "-65px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(214,231,242,.74)",
            }}
          />
          <div
            className="kf-welcome-orb kf-welcome-orb-orange"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-45px",
              bottom: "-85px",
              width: "210px",
              height: "210px",
              borderRadius: "50%",
              background: "rgba(255,222,190,.52)",
            }}
          />

          <div
            className="kf-welcome-grid"
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(330px, .8fr)",
              gap: "42px",
              alignItems: "center",
              padding: "34px 40px",
              minHeight: "358px",
              zIndex: 1,
            }}
          >
            <div className="kf-welcome-copy" style={{ minWidth: 0 }}>
              <div
                className="kf-welcome-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fff3e7",
                  color: "#866e5a",
                  border: "1px solid rgba(255,122,0,.15)",
                  borderRadius: "999px",
                  padding: "8px 12px",
                  fontSize: "10px",
                  fontWeight: 900,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#ff7a00",
                    flexShrink: 0,
                  }}
                />
                {text.welcomeLabel}
              </div>

              <h1
                className="kf-welcome-title"
                style={{
                  color: "#102033",
                  fontSize: "clamp(40px, 4.45vw, 64px)",
                  lineHeight: "1.02",
                  fontWeight: 800,
                  letterSpacing: "-0.055em",
                  margin: "22px 0 16px",
                  fontFamily: "var(--font-display)",
                }}
              >
                <span className="kf-welcome-hello">
                  {text.hello}
                </span>, {profile.name}{" "}
                <span
                  style={{
                    display: "inline-block",
                  }}
                >
                  👋
                </span>
              </h1>

              <p
                className="kf-welcome-description"
                style={{
                  color: "#687582",
                  fontSize: "16px",
                  lineHeight: "1.65",
                  maxWidth: "760px",
                  margin: 0,
                }}
              >
                {text.welcomeDescription}
              </p>

              <div
                className="kf-welcome-actions"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginTop: "25px",
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push("/civic-learning")}
                  style={{
                    background: "#ff7a00",
                    color: "#ffffff",
                    border: 0,
                    borderRadius: "999px",
                    padding: "13px 24px",
                    fontSize: "12px",
                    fontWeight: 900,
                    cursor: "pointer",
                    boxShadow: "0 10px 22px rgba(255,122,0,.16)",
                  }}
                >
                  {text.exploreAction}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/report-issue")}
                  style={{
                    background: "rgba(255,255,255,.78)",
                    color: "#263447",
                    border: "1px solid rgba(16,27,43,.13)",
                    borderRadius: "999px",
                    padding: "13px 24px",
                    fontSize: "12px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {text.reportIssueAction}
                </button>
              </div>
            </div>

            <div
              className="kf-welcome-profile"
              style={{
                position: "relative",
                overflow: "hidden",
                background: "rgba(255,255,255,.78)",
                border: "1px solid rgba(16,27,43,.09)",
                borderRadius: "28px",
                padding: "18px",
                boxShadow: "0 12px 32px rgba(16,27,43,.05)",
                minHeight: "286px",
              }}
            >
              <div
                className="kf-welcome-profile-orb"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: "-34px",
                  top: "-58px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "rgba(214,231,242,.34)",
                }}
              />

              <div
                className="kf-welcome-profile-head"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                  zIndex: 2,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#9aa0a5",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: ".17em",
                      textTransform: "uppercase",
                    }}
                  >
                    {text.civicProfile}
                  </div>
                  <div
                    className="kf-welcome-profile-name"
                    style={{
                      color: "#102033",
                      fontSize: "17px",
                      fontWeight: 900,
                      marginTop: "4px",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Krut<span style={{ color: "#ff7a00" }}>Bharat</span>
                  </div>
                </div>

                <div
                  className="kf-welcome-profile-in-badge"
                  style={{
                    width: "46px",
                    height: "46px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "16px",
                    background: "#ffffff",
                    color: "#000000",
                    fontSize: "18px",
                    fontWeight: 900,
                    flexShrink: 0,
                    border: "1px solid rgba(16,27,43,.12)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.65)",
                  }}
                >
                  IN
                </div>
              </div>

              <div
                className="kf-welcome-profile-rows"
                style={{ position: "relative", zIndex: 2 }}
              >
                {[
                  {
                    label: text.location,
                    value: `${displayCityName(profile.city, language)}, ${profile.state}`,
                    bg: "#f2f6f9",
                    icon: "location",
                  },
                  {
                    label: text.ageGroup,
                    value: profile.ageGroup,
                    bg: "#fff7ee",
                    icon: "users",
                  },
                  {
                    label: text.interests,
                    value: `${profile.interests.length} ${text.topics}`,
                    bg: "#f1f5e9",
                    icon: "star",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="kf-welcome-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "8px",
                      padding: "10px 12px",
                      borderRadius: "15px",
                      background: item.bg,
                    }}
                  >
                    <span
                      className="kf-welcome-row-icon"
                      aria-hidden="true"
                      style={{
                        display: "none",
                        width: "32px",
                        height: "32px",
                        placeItems: "center",
                        borderRadius: "10px",
                        background: "rgba(4,13,24,.34)",
                        color: "#7fa4c2",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon === "location" ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      ) : item.icon === "users" ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                          <path d="m12 2.7 2.84 5.75 6.35.92-4.6 4.48 1.09 6.32L12 17.2l-5.68 2.97 1.09-6.32-4.6-4.48 6.35-.92L12 2.7Z" />
                        </svg>
                      )}
                    </span>

                    <span
                      className="kf-welcome-row-label"
                      style={{
                        color: "#8a949d",
                        fontSize: "9px",
                        fontWeight: 900,
                        letterSpacing: ".13em",
                        textTransform: "uppercase",
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </span>

                    <strong
                      className="kf-welcome-row-value"
                      style={{
                        color: "#304054",
                        fontSize: "12px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "72%",
                      }}
                    >
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section
          className="kf-dashboard-quick-access"
          style={{ marginBottom: "38px" }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                color: "#ff7a00",
                fontSize: "10px",
                fontWeight: 900,
                letterSpacing: ".19em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              {text.quickAccessLabel}
            </div>

            <h2
              style={{
                color: "#102033",
                fontSize: "26px",
                lineHeight: "1.08",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                margin: 0,
                fontFamily: "var(--font-display)",
              }}
            >
              {text.quickAccessTitle}
            </h2>
          </div>

          <div
            className="kf-dashboard-quick-access-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            {actionCards.slice(0, 4).map((card) => (
              <button
                key={`quick-${card.path}`}
                type="button"
                onClick={() => router.push(card.path)}
                className="kf-dashboard-quick-access-card"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  minHeight: "74px",
                  padding: "12px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16,27,43,.09)",
                  background: card.bg,
                  color: "#102033",
                  textAlign: "left",
                  cursor: "pointer",
                  boxShadow: "0 8px 22px rgba(16,27,43,.04)",
                  transition:
                    "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                  boxSizing: "border-box",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "42px",
                    height: "42px",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    borderRadius: "14px",
                    background: "rgba(255,255,255,.72)",
                    border: "1px solid rgba(16,27,43,.07)",
                    fontSize: "20px",
                  }}
                >
                  {card.icon}
                </span>

                <span
                  style={{
                    minWidth: 0,
                    display: "block",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      fontSize: "13px",
                      lineHeight: "1.15",
                      fontWeight: 900,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {card.title}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "3px",
                      color: "#6c7782",
                      fontSize: "10px",
                      lineHeight: "1.35",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {card.actionText}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* PROFILE SUMMARY */}
        <section style={{ marginBottom: "50px" }}>
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                color: "#ff7a00",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: ".20em",
                textTransform: "uppercase",
                marginBottom: "7px",
              }}
            >
              {text.civicProfile}
            </div>

            <h2
              style={{
                color: "#102033",
                fontSize: "34px",
                lineHeight: "1.06",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: 0,
                fontFamily: "var(--font-display)",
              }}
            >
              {text.civicProfile}
            </h2>
          </div>

          <div
            className="kf-dashboard-profile-summary-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <InfoCard
              icon="📍"
              title={text.location}
              value={displayCityName(profile.city, language)}
              subtitle={profile.state}
              tint="#edf5fb"
            />

            <InfoCard
              icon="🎂"
              title={text.ageGroup}
              value={profile.ageGroup}
              subtitle={text.civicProfile}
              tint="#fff0df"
            />

            <InfoCard
              icon="💡"
              title={text.interests}
              value={`${profile.interests.length} ${text.topics}`}
              subtitle={text.interestedTopics}
              tint="#eef5e6"
            />
          </div>
        </section>

        {/* LEARNING PROGRESS */}
        <section style={{ marginBottom: "52px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                color: "#ff7a00",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: ".20em",
                textTransform: "uppercase",
                marginBottom: "7px",
              }}
            >
              {text.learningLabel}
            </div>

            <h2
              style={{
                color: "#102033",
                fontSize: "34px",
                lineHeight: "1.05",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: "0 0 8px",
                fontFamily: "var(--font-display)",
              }}
            >
              {text.progressTitle}
            </h2>

            <p
              style={{
                color: "#6c7782",
                lineHeight: "1.65",
                margin: 0,
                maxWidth: "760px",
                fontSize: "15px",
              }}
            >
              {text.progressDescription}
            </p>
          </div>

          {/* OVERALL PROGRESS */}
          <div
            style={{
              background:
                "radial-gradient(circle at 88% 12%, #e8f2f8 0%, rgba(232,242,248,0) 30%), #fffdf9",
              border: "1px solid rgba(16,27,43,.10)",
              borderRadius: "30px",
              padding: "26px",
              marginBottom: "16px",
              boxShadow: "0 14px 38px rgba(16,27,43,.055)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#989fa6",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: ".18em",
                    marginBottom: "7px",
                  }}
                >
                  {text.overallCompletion}
                </div>

                <div
                  style={{
                    color: "#102033",
                    fontSize: "34px",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {completedCount}/{totalTopics}{" "}
                  <span
                    style={{
                      color: "#7c8791",
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                      letterSpacing: 0,
                    }}
                  >
                    {text.topicsLabel}
                  </span>
                </div>
              </div>

              <div
                style={{
                  minWidth: "76px",
                  height: "76px",
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  background:
                    `conic-gradient(#ff7a00 ${completionPercentage * 3.6}deg, #ede7dd 0deg)`,
                }}
              >
                <div
                  className="kf-overall-percentage-ring"
                  style={{
                    width: "60px",
                    height: "60px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                    background: "#fffdf9",
                  }}
                >
                  <span
                    className="kf-overall-percentage"
                    style={{
                      color: "#000000",
                      fontSize: "17px",
                      fontWeight: 900,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {completionPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "11px",
                background: "#eee8df",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: "100%",
                  background: "#ff7a00",
                  borderRadius: "999px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <p
              style={{
                color: "#7a858f",
                fontSize: "12px",
                lineHeight: "1.55",
                margin: "12px 0 0",
              }}
            >
              {text.keepExploring}
            </p>
          </div>

          {/* TOPIC PROGRESS */}
          <div
            className="kf-dashboard-learning-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {learningTopics.map((topic, index) => {
              const progress = learningProgress.find(
                (item) => item.topic === topic.key
              );

              const completed = progress?.completed === true;
              const palette = pastelCards[index % pastelCards.length];

              return (
                <LearningTopicCard
                  key={topic.key}
                  icon={topic.icon}
                  title={topic.title}
                  completed={completed}
                  score={progress?.score ?? null}
                  completedLabel={text.completed}
                  notStartedLabel={text.notStarted}
                  quizScoreLabel={text.quizScore}
                  completeQuizLabel={text.completeQuiz}
                  reviewTopicLabel={text.reviewTopic}
                  startLearningLabel={text.startLearning}
                  onClick={() => router.push(topic.path)}
                  tint={palette.bg}
                  accent={palette.accent}
                />
              );
            })}
          </div>
        </section>

        {/* FEATURES */}
        <section>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                color: "#ff7a00",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: ".20em",
                textTransform: "uppercase",
                marginBottom: "7px",
              }}
            >
              {text.civicQuestLabel}
            </div>

            <h2
              style={{
                color: "#102033",
                fontSize: "34px",
                lineHeight: "1.05",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: 0,
                fontFamily: "var(--font-display)",
              }}
            >
              {text.whatWouldYouLike}
            </h2>
          </div>

          <div
            className="kf-dashboard-action-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            {actionCards.map((card, index) => (
              <FeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                actionText={card.actionText}
                onClick={() => router.push(card.path)}
                tint={card.bg}
                accent={card.accent}
                index={index}
                cardKey={card.path.replace("/", "").replaceAll("/", "-")}
              />
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="kf-dashboard-footer">
          <div className="kf-dashboard-footer-inner">
            <div className="kf-dashboard-footer-brand" aria-label="KrutBharat">
              <span className="kf-dashboard-footer-karma">Krut</span><span className="kf-dashboard-footer-facie">Bharat</span>
            </div>

            <div className="kf-dashboard-footer-tagline">
              Know India. Think Civic. Shape Its Future.
            </div>

            <div className="kf-dashboard-footer-context">
              © 2026 KrutBharat <span aria-hidden="true">·</span> by KarmaFacie Corporation
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        /* --------------------------------------------------
           KRUTBHARAT DASHBOARD FOOTER
           Light + dark mode, matching the Explore footer language
           -------------------------------------------------- */

        .kf-dashboard-footer {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-top: 108px;
          padding: 0;
          border-top: 1px solid #ece7df;
          background: #fffaf2;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }

        .kf-dashboard-footer-inner {
          width: min(1152px, 100%);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          padding: 36px 24px;
          box-sizing: border-box;
          text-align: center;
        }

        .kf-dashboard-footer-brand {
          align-self: center;
          display: inline-flex;
          align-items: baseline;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -.035em;
          line-height: 1;
        }

        .kf-dashboard-footer-karma {
          color: #102033;
        }

        .kf-dashboard-footer-facie {
          color: #ff7a00;
        }

        .kf-dashboard-footer-tagline {
          align-self: center;
          color: #6f7d8d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .01em;
          text-align: center;
        }

        .kf-dashboard-footer-context {
          align-self: center;
          color: #7d8794;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .20em;
          text-transform: uppercase;
          text-align: right;
          white-space: nowrap;
        }

        .kf-dashboard-footer-context span {
          color: #ff7a00;
          margin: 0 .35em;
        }

        @media (min-width: 768px) {
          .kf-dashboard-footer-inner {
            flex-direction: row;
            align-items: center;
            text-align: left;
          }

          .kf-dashboard-footer-brand {
            align-self: center;
          }

          .kf-dashboard-footer-tagline {
            align-self: center;
            text-align: center;
          }

          .kf-dashboard-footer-context {
            align-self: center;
            text-align: right;
          }
        }

        .kf-dashboard-quick-access-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(16,27,43,.07);
          border-color: rgba(16,27,43,.14);
        }

        @media (max-width: 980px) {
          .kf-dashboard-quick-access-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          main > div > header + section > div {
            grid-template-columns: 1fr !important;
          }
          main > div section:nth-of-type(3) > div:last-child,
          main > div section:nth-of-type(4) > div:last-child {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .kf-dashboard-footer {
            margin-top: 72px;
          }

          .kf-dashboard-footer-inner {
            flex-direction: column;
            gap: 20px;
            padding: 36px 24px;
            text-align: center;
          }

          .kf-dashboard-footer-brand,
          .kf-dashboard-footer-tagline,
          .kf-dashboard-footer-context {
            align-self: center;
            text-align: center;
          }

          .kf-dashboard-footer-context {
            white-space: normal;
          }

          .kf-dashboard-header {
            width: 100% !important;
          }
          .kf-dashboard-header > div {
            width: 100%;
            justify-content: flex-start !important;
          }
          .kf-dashboard-header button {
            flex: 1 1 auto;
          }
          main > div section:nth-of-type(3) > div:last-child,
          main > div section:nth-of-type(4) > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }

        /* --------------------------------------------------
           KRUTBHARAT LOCKED DARK THEME — DASHBOARD
           Visual reference: locked Homepage + Explore
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-footer {
          background: #07111f !important;
          border-top-color: rgba(133,173,209,.14) !important;
          box-shadow: 0 -16px 36px rgba(0,0,0,.16) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        html[data-theme="dark"] .kf-dashboard-footer-karma {
          color: #f5f7fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-footer-facie {
          color: #ff7a1a !important;
        }

        html[data-theme="dark"] .kf-dashboard-footer-tagline {
          color: #9fb0c3 !important;
        }

        html[data-theme="dark"] .kf-dashboard-footer-context {
          color: #93a4b7 !important;
        }

        html[data-theme="dark"] .kf-dashboard-footer-context span {
          color: #ff7a1a !important;
        }

        html[data-theme="dark"] .kf-dashboard-page {
          background:
            radial-gradient(circle at 88% 6%, rgba(20, 72, 112, .42) 0%, rgba(20, 72, 112, 0) 25%),
            radial-gradient(circle at 6% 58%, rgba(16, 52, 78, .34) 0%, rgba(16, 52, 78, 0) 27%),
            radial-gradient(circle at 88% 84%, rgba(105, 54, 25, .26) 0%, rgba(105, 54, 25, 0) 24%),
            #07111f !important;
          color: #f7f8fb !important;
          position: relative;
          isolation: isolate;
        }

        html[data-theme="dark"] .kf-dashboard-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          background:
            linear-gradient(rgba(7,17,31,.84), rgba(7,17,31,.84)),
            url("/images/kf-background.png") center / cover no-repeat;
          opacity: .42;
          filter: saturate(.72) brightness(.62);
        }

        /* Dashboard header — same locked glass language as homepage */
        html[data-theme="dark"] .kf-dashboard-header {
          background: rgba(4, 10, 20, .62) !important;
          border: 1px solid transparent !important;
          box-shadow:
            -10px 0 24px -8px rgba(0, 212, 255, .46),
             10px 0 24px -8px rgba(255, 140, 26, .46),
             0 10px 30px rgba(0,0,0,.34) !important;
          backdrop-filter: blur(14px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
          isolation: isolate;
        }

        html[data-theme="dark"] .kf-dashboard-header::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1.25px;
          background: linear-gradient(
            90deg,
            #00d4ff 0%,
            rgba(0,174,255,.72) 16%,
            rgba(90,120,150,.28) 43%,
            rgba(120,120,130,.22) 57%,
            rgba(255,150,40,.72) 84%,
            #ff8c1a 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 0;
        }

        html[data-theme="dark"] .kf-dashboard-header > * {
          position: relative;
          z-index: 2;
        }

        html[data-theme="dark"] .kf-dashboard-header button:first-child {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-header select,
        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child) {
          background: rgba(4,10,20,.48) !important;
          color: #e7eef6 !important;
          border-color: rgba(210,225,240,.20) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child):hover,
        html[data-theme="dark"] .kf-dashboard-header select:hover {
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(255,255,255,.30) !important;
          color: #fff !important;
        }

        /* Shared dark typography */
        html[data-theme="dark"] .kf-dashboard-page h1,
        html[data-theme="dark"] .kf-dashboard-page h2,
        html[data-theme="dark"] .kf-dashboard-page h3 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page p {
          color: #aebed0 !important;
        }

        /* Welcome */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) {
          background:
            radial-gradient(circle at 88% 8%, rgba(23,69,104,.58) 0%, rgba(23,69,104,0) 34%),
            radial-gradient(circle at 8% 92%, rgba(104,54,27,.34) 0%, rgba(104,54,27,0) 34%),
            #10243a !important;
          border-color: rgba(145,174,204,.17) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div:first-child > div:first-child,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div:first-child > div:nth-child(2) {
          opacity: .24;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) div[style*="background: #fff3e7"] {
          background: rgba(255,139,50,.10) !important;
          color: #ffb36f !important;
          border-color: rgba(255,139,50,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) button {
          box-shadow: 0 10px 24px rgba(0,0,0,.18) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) button:nth-of-type(2) {
          background: rgba(4,10,20,.46) !important;
          color: #e7eef6 !important;
          border-color: rgba(210,225,240,.18) !important;
        }

        /* Welcome profile card */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child {
          background: rgba(7,17,31,.54) !important;
          border-color: rgba(145,174,204,.15) !important;
          box-shadow: 0 14px 34px rgba(0,0,0,.22) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #fff0df"] {
          background: rgba(255,139,50,.12) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #f2f6f9"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #fff7ee"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #f1f5e9"] {
          background: rgba(255,255,255,.045) !important;
          border: 1px solid rgba(145,174,204,.08);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="color: #263447"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child strong {
          color: #dce7f1 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="color: #9aa0a5"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child span {
          color: #8296aa !important;
        }

        /* Section labels */
        html[data-theme="dark"] .kf-dashboard-page > div > section > div > div:first-child {
          color: #ff8b32 !important;
        }

        /* Profile summary cards */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div {
          background: #10263a !important;
          border-color: rgba(145,174,204,.15) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.20) !important;
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div:nth-child(2) {
          background: #30251b !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div:nth-child(3) {
          background: #182c25 !important;
        }

        /* Neutralize decorative circles inside cards while keeping their tint */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:first-child {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(3) {
          color: #8296aa !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(4) {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(5) {
          color: #9fb0c0 !important;
        }

        /* Overall learning progress */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) {
          background:
            radial-gradient(circle at 88% 12%, rgba(24,64,94,.55) 0%, rgba(24,64,94,0) 32%),
            #10243a !important;
          border-color: rgba(145,174,204,.16) !important;
          box-shadow: 0 16px 38px rgba(0,0,0,.22) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) div[style*="background: #fffdf9"] {
          background: #0d1d31 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) div[style*="background: #eee8df"] {
          background: rgba(255,255,255,.08) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) p {
          color: #9fb0c0 !important;
        }

        /* Learning topic cards */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button {
          background: #10243a !important;
          color: #f7f8fb !important;
          border-color: rgba(145,174,204,.15) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(2n) {
          background: #30251b !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(3n) {
          background: #182c25 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(4n) {
          background: #342947 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #faf8f4"] {
          background: rgba(255,255,255,.06) !important;
          color: #8fa1b3 !important;
          border-color: rgba(145,174,204,.14) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #eff5e8"] {
          background: rgba(126,169,91,.16) !important;
          color: #a9cf8d !important;
          border-color: rgba(126,169,91,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #edf5fb"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #fff0df"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #eef5e6"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #f4edf8"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #edf5f0"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #fff3e2"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #eef4f8"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div[style*="background: #f7eee6"] {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button h3 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button div[style*="color: #7c8790"],
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button div[style*="color: #89939c"] {
          color: #9fb0c0 !important;
        }

        /* Feature cards */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button {
          background: #10263a !important;
          color: #f7f8fb !important;
          border-color: rgba(145,174,204,.15) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(2n) {
          background: #30251b !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(3n) {
          background: #182c25 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(4n) {
          background: #342947 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button h3 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button p {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button span[style*="background: #fffdf9"] {
          background: rgba(4,10,20,.48) !important;
          border-color: rgba(145,174,204,.16) !important;
          color: #9fb0c0 !important;
        }

        /* Coming-soon panel */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(5) {
          background:
            radial-gradient(circle at 90% 10%, rgba(48,84,51,.48) 0%, rgba(48,84,51,0) 32%),
            #182c25 !important;
          border-color: rgba(126,169,91,.20) !important;
          box-shadow: 0 14px 34px rgba(0,0,0,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(5) h2 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(5) p {
          color: #b6c7ba !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(5) > div:first-child {
          color: #a9cf8d !important;
        }

        /* Footer */
        html[data-theme="dark"] .kf-dashboard-page > div > p:last-child {
          color: #71859a !important;
        }

        /* Structural overrides for inline-styled child components */
        html[data-theme="dark"] .kf-dashboard-page.kf-dashboard-loading {
          background:
            radial-gradient(circle at 88% 8%, rgba(20,72,112,.42) 0%, rgba(20,72,112,0) 24%),
            radial-gradient(circle at 8% 92%, rgba(105,54,25,.26) 0%, rgba(105,54,25,0) 25%),
            #07111f !important;
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-loading > div {
          background: rgba(16,36,58,.90) !important;
          border-color: rgba(145,174,204,.16) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,.30) !important;
        }

        html[data-theme="dark"] .kf-dashboard-loading p {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(2) {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(2),
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button > div:first-child {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(3) > div:first-child,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button > div:nth-child(3) > div:first-child {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(3) > div:nth-child(2) {
          background: rgba(255,255,255,.06) !important;
          color: #9fb0c0 !important;
          border-color: rgba(145,174,204,.14) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button h3,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button h3 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(5),
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button > p {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:first-child,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button > div:nth-child(6) > span:first-child {
          color: #ff9a4d !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:last-child {
          color: #7f94a8 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button > div:nth-child(6) > span:last-child {
          background: rgba(4,10,20,.48) !important;
          border-color: rgba(145,174,204,.16) !important;
          color: #9fb0c0 !important;
        }

        /* Keep responsive layout intact */
        @media (max-width: 980px) {
          html[data-theme="dark"] .kf-dashboard-header {
            border-radius: 24px !important;
          }
        }

        @media (max-width: 640px) {
          html[data-theme="dark"] .kf-dashboard-header {
            background: rgba(4,10,20,.68) !important;
          }
        }

        /* -------------------------------------------------- */
        /* DASHBOARD DARK-MODE POLISH — FINAL VISUAL PASS     */
        /* -------------------------------------------------- */

        html[data-theme="dark"] body {
          background: #07111f !important;
          overflow-x: hidden !important;
        }

        /* --------------------------------------------------
           1. FIXED TOP NAVIGATION
           The dashboard nav is permanently attached to the
           viewport. Page content scrolls underneath it.
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page {
          padding-top: 108px !important;
          overflow-x: clip !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div {
          max-width: 1200px;
          margin: 0 auto;
        }

        html[data-theme="dark"] .kf-dashboard-header {
          box-sizing: border-box !important;

          min-height: 88px;
          padding: 13px max(18px, calc((100vw - 1200px) / 2 + 18px)) !important;

          display: flex !important;
          align-items: center !important;

          border-radius: 0 0 22px 22px !important;
          border: 1px solid rgba(128, 178, 220, .20) !important;
          border-top-color: rgba(255,255,255,.07) !important;

          background:
            linear-gradient(
              100deg,
              rgba(8, 18, 32, .84) 0%,
              rgba(13, 29, 48, .72) 48%,
              rgba(10, 21, 36, .84) 100%
            ) !important;

          backdrop-filter: blur(22px) saturate(145%) !important;
          -webkit-backdrop-filter: blur(22px) saturate(145%) !important;

          box-shadow:
            -18px 8px 42px -24px rgba(0, 212, 255, .72),
             18px 8px 42px -24px rgba(255, 140, 26, .68),
             0 14px 40px rgba(0,0,0,.36) !important;

          isolation: isolate !important;
        }

        html[data-theme="dark"] .kf-dashboard-header::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0 0 22px 22px;
          padding: 1.15px;
          background:
            linear-gradient(
              90deg,
              #00d4ff 0%,
              rgba(0,174,255,.68) 18%,
              rgba(96,129,159,.20) 43%,
              rgba(96,129,159,.20) 57%,
              rgba(255,148,42,.68) 82%,
              #ff8c1a 100%
            );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          z-index: -1;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > header::after {
          content: "";
          position: absolute;
          inset: -7px 2px -5px;
          border-radius: 0 0 27px 27px;
          background:
            linear-gradient(
              90deg,
              rgba(0,212,255,.30),
              transparent 27%,
              transparent 73%,
              rgba(255,140,26,.30)
            );
          filter: blur(13px);
          opacity: .70;
          pointer-events: none;
          z-index: -2;
        }

        html[data-theme="dark"] .kf-dashboard-header > * {
          position: relative;
          z-index: 2;
        }

        html[data-theme="dark"] .kf-dashboard-header button:first-child {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-header select,
        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child) {
          background: rgba(5, 13, 24, .48) !important;
          color: #eaf1f7 !important;
          border: 1px solid rgba(172,202,227,.19) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }

        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child):hover,
        html[data-theme="dark"] .kf-dashboard-header select:hover {
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(255,255,255,.30) !important;
          color: #fff !important;
        }

        /* --------------------------------------------------
           2. WELCOME BACK — CLASSIER DARK PALETTE
           Navy / midnight blue / muted champagne accents.
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) {
          background:
            radial-gradient(
              circle at 92% 8%,
              rgba(69, 130, 177, .25) 0%,
              rgba(69, 130, 177, 0) 29%
            ),
            radial-gradient(
              circle at 8% 94%,
              rgba(183, 126, 65, .16) 0%,
              rgba(183, 126, 65, 0) 27%
            ),
            linear-gradient(
              120deg,
              #101b2b 0%,
              #12253b 52%,
              #0d2034 100%
            ) !important;

          border: 1px solid rgba(132,177,213,.22) !important;
          box-shadow:
            0 24px 58px rgba(0,0,0,.30),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        /* Reduce the old pale decorative circles to sophisticated
           low-opacity atmospheric shapes. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div:first-child > div:first-child,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div:first-child > div:nth-child(2) {
          opacity: .14 !important;
          filter: saturate(.55);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) div[style*="background: #fff3e7"] {
          background: rgba(238,190,133,.10) !important;
          border: 1px solid rgba(238,190,133,.18) !important;
          color: #e9bd8b !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) h1 {
          color: #fbfcff !important;
          text-shadow: 0 2px 18px rgba(0,0,0,.18);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) p {
          color: #b8c7d7 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) button {
          box-shadow: 0 12px 28px rgba(0,0,0,.22) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) button:first-of-type {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #101722 !important;
          border-color: rgba(255,184,111,.55) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) button:nth-of-type(2) {
          background: rgba(7,17,31,.52) !important;
          color: #e4edf5 !important;
          border-color: rgba(167,199,224,.22) !important;
        }

        /* Welcome profile inset */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child {
          background:
            linear-gradient(
              145deg,
              rgba(5,14,25,.80),
              rgba(11,28,45,.68)
            ) !important;
          border: 1px solid rgba(151,190,218,.20) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 18px 38px rgba(0,0,0,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #fff0df"] {
          background: rgba(224,174,113,.12) !important;
          border-color: rgba(224,174,113,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #f2f6f9"] {
          background: rgba(76,143,190,.13) !important;
          border-color: rgba(113,176,218,.18) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #fff7ee"] {
          background: rgba(185,126,70,.13) !important;
          border-color: rgba(218,162,103,.18) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="background: #f1f5e9"] {
          background: rgba(93,139,106,.14) !important;
          border-color: rgba(130,187,145,.18) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child strong {
          color: #edf4fa !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child span,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div[style*="color: #9aa0a5"] {
          color: #91a7bb !important;
        }

        /* --------------------------------------------------
           3. PROFILE CARDS — THREE DISTINCT PREMIUM TINTS
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div {
          border-radius: 27px !important;
          box-shadow:
            0 16px 34px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
          color: #f7f8fb !important;
        }

        /* Location — sapphire */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div:nth-child(1) {
          background:
            linear-gradient(145deg, #102d49, #0f253d) !important;
          border-color: rgba(89,166,220,.27) !important;
        }

        /* Age — copper / espresso */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div:nth-child(2) {
          background:
            linear-gradient(145deg, #3b2a1e, #302318) !important;
          border-color: rgba(224,157,87,.27) !important;
        }

        /* Interests — deep jade */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div:nth-child(3) {
          background:
            linear-gradient(145deg, #15382e, #122e26) !important;
          border-color: rgba(103,190,148,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:first-child {
          background: rgba(255,255,255,.075) !important;
          border: 1px solid rgba(255,255,255,.055);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(3) {
          color: #9bb0c3 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(4) {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(5) {
          color: #a8bacb !important;
        }

        /* --------------------------------------------------
           4. LEARNING PROGRESS — DEEP BLUE RAISED CARD
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) {
          background:
            radial-gradient(circle at 92% 8%, rgba(50,111,157,.22), transparent 31%),
            linear-gradient(145deg, #102941, #0d2136) !important;
          border-color: rgba(92,165,215,.22) !important;
          box-shadow: 0 18px 40px rgba(0,0,0,.26) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) div[style*="background: #fffdf9"] {
          background: rgba(4,12,22,.48) !important;
          border-color: rgba(158,194,220,.13) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) div[style*="background: #eee8df"] {
          background: rgba(255,255,255,.075) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) p {
          color: #a9bbcc !important;
        }

        /* --------------------------------------------------
           5. LEARNING CARDS — 8 DISTINCT COLOR FAMILIES
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button {
          min-height: 235px;
          border-radius: 26px !important;
          color: #f7f8fb !important;
          box-shadow:
            0 15px 34px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease,
            filter .22s ease !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(1) {
          background: linear-gradient(145deg, #102f4c, #0e253d) !important;
          border-color: rgba(83,166,222,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(2) {
          background: linear-gradient(145deg, #3a2a1e, #302217) !important;
          border-color: rgba(225,157,85,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(3) {
          background: linear-gradient(145deg, #153a30, #112d25) !important;
          border-color: rgba(99,190,146,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(4) {
          background: linear-gradient(145deg, #392e52, #2e2743) !important;
          border-color: rgba(186,159,229,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(5) {
          background: linear-gradient(145deg, #17344b, #10283d) !important;
          border-color: rgba(135,190,213,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(6) {
          background: linear-gradient(145deg, #263b2e, #1b3026) !important;
          border-color: rgba(126,190,144,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(7) {
          background: linear-gradient(145deg, #132f4b, #10263e) !important;
          border-color: rgba(113,174,218,.27) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:nth-child(8) {
          background: linear-gradient(145deg, #3b3151, #302841) !important;
          border-color: rgba(193,169,227,.26) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,80,.48) !important;
          box-shadow: 0 20px 44px rgba(0,0,0,.34) !important;
          filter: brightness(1.055);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button h3 {
          color: #f8fafc !important;
          text-shadow: 0 1px 0 rgba(0,0,0,.18);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(2) {
          background: rgba(255,255,255,.075) !important;
          border: 1px solid rgba(255,255,255,.055);
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(3) > div:first-child {
          background: rgba(255,255,255,.07) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(3) > div:nth-child(2) {
          background: rgba(3,11,20,.30) !important;
          color: #c0cfdb !important;
          border-color: rgba(205,224,239,.15) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(5) {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:first-child {
          color: #ff9b4f !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:last-child {
          color: #9fb2c3 !important;
        }

        /* --------------------------------------------------
           6. FEATURE CARDS — DISTINCT BUT RELATED PALETTE
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button {
          border-radius: 26px !important;
          color: #f7f8fb !important;
          box-shadow:
            0 15px 34px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(1) {
          background: linear-gradient(145deg, #102f4b, #0e263d) !important;
          border-color: rgba(83,166,222,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(2) {
          background: linear-gradient(145deg, #3b2c1f, #302419) !important;
          border-color: rgba(225,157,85,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(3) {
          background: linear-gradient(145deg, #153a30, #122f26) !important;
          border-color: rgba(99,190,146,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:nth-child(4) {
          background: linear-gradient(145deg, #3a3050, #302741) !important;
          border-color: rgba(190,165,226,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button:hover {
          transform: translateY(-4px);
          border-color: rgba(255,155,80,.45) !important;
          box-shadow: 0 20px 44px rgba(0,0,0,.32) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button h3 {
          color: #f8fafc !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button p {
          color: #aebed0 !important;
        }

        /* Footer */
        html[data-theme="dark"] .kf-dashboard-page > div > p:last-child {
          color: #72879c !important;
        }

        /* Keep global search/theme controls above dashboard content. */
        html[data-theme="dark"] .kf-dashboard-page .kf-global-search-trigger,
        html[data-theme="dark"] .kf-dashboard-page .kf-global-theme-toggle {
          z-index: 1100 !important;
        }

        /* Mobile fixed-nav treatment */
        @media (max-width: 640px) {
          html[data-theme="dark"] .kf-dashboard-page {
            padding-top: 92px !important;
          }

          html[data-theme="dark"] .kf-dashboard-header {
            min-height: 76px;
            padding: 10px 14px !important;
            border-radius: 0 0 18px 18px !important;
          }

          html[data-theme="dark"] .kf-dashboard-header::before {
            border-radius: 0 0 18px 18px;
          }

          html[data-theme="dark"] .kf-dashboard-page > div > header::after {
            border-radius: 0 0 22px 22px;
          }
        }

        @media (min-width: 641px) and (max-width: 980px) {
          html[data-theme="dark"] .kf-dashboard-page {
            padding-top: 104px !important;
          }

          html[data-theme="dark"] .kf-dashboard-header {
            padding-left: 22px !important;
            padding-right: 22px !important;
          }
        }

        /* ============================================================
           FINAL DASHBOARD PASS
           Floating Explore-style navbar + high-contrast dark theme.
           This block intentionally comes last so it overrides the
           earlier experimental dashboard navbar rules.
           ============================================================ */

        .kf-dashboard-page {
          overflow-x: clip !important;
          padding-top: 104px !important;
        }

        /* ---------- FIXED FLOATING NAV — LIGHT ---------- */
        .kf-dashboard-header {
          padding: 10px 14px !important;
          border-radius: 24px !important;
          background: rgba(255,253,249,.62) !important;
          background-image: none !important;
          border: 1px solid rgba(255,255,255,.78) !important;
          box-shadow:
            0 10px 28px rgba(16,27,43,.075),
            inset 0 1px 0 rgba(255,255,255,.75) !important;
          backdrop-filter: blur(20px) saturate(130%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(130%) !important;
          isolation: isolate !important;
          z-index: 1000 !important;
        }

        .kf-dashboard-header > * {
          position: relative !important;
          z-index: 2 !important;
        }

        .kf-dashboard-header button:first-child {
          color: #102033 !important;
        }

        .kf-dashboard-header select,
        .kf-dashboard-header button:not(:first-child) {
          border-radius: 999px !important;
        }

        /* ---------- FIXED FLOATING NAV — DARK ---------- */
        html[data-theme="dark"] .kf-dashboard-page {
          padding-top: 104px !important;
        }

        html[data-theme="dark"] .kf-dashboard-header {
          border-radius: 24px !important;
          border: 1px solid transparent !important;
          background: rgba(4,10,20,.60) !important;
          background-image: none !important;
          box-shadow:
            -7px 0 14px -9px rgba(0,212,255,.95),
             7px 0 14px -9px rgba(255,140,26,.95),
             0 8px 24px -14px rgba(0,0,0,.80) !important;
          backdrop-filter: blur(14px) saturate(125%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(125%) !important;
          isolation: isolate !important;
        }

        html[data-theme="dark"] .kf-dashboard-header::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          z-index: 0 !important;
          padding: 1px !important;
          border-radius: inherit !important;
          background: linear-gradient(
            90deg,
            #00d4ff 0%,
            #0096ff 17%,
            rgba(93,119,145,.42) 38%,
            rgba(93,119,145,.20) 50%,
            rgba(255,145,45,.62) 82%,
            #ff8c1a 100%
          ) !important;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0) !important;
          -webkit-mask-composite: xor !important;
          mask-composite: exclude !important;
          pointer-events: none !important;
        }

        html[data-theme="dark"] .kf-dashboard-header::after {
          content: "" !important;
          position: absolute !important;
          inset: -5px !important;
          z-index: -1 !important;
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
        }

        html[data-theme="dark"] .kf-dashboard-header > * {
          position: relative !important;
          z-index: 2 !important;
        }

        html[data-theme="dark"] .kf-dashboard-header button:first-child {
          color: #f7f8fb !important;
          background: transparent !important;
          border: 0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-header select,
        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child) {
          background: rgba(4,10,20,.42) !important;
          color: #e7eef6 !important;
          border: 1px solid rgba(210,225,240,.18) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
        }

        html[data-theme="dark"] .kf-dashboard-header button:not(:first-child):hover,
        html[data-theme="dark"] .kf-dashboard-header select:hover {
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(255,255,255,.30) !important;
          color: #fff !important;
        }

        /* ---------- DARK BODY CONTRAST ---------- */
        html[data-theme="dark"] .kf-dashboard-page h1,
        html[data-theme="dark"] .kf-dashboard-page h2,
        html[data-theme="dark"] .kf-dashboard-page h3 {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page p {
          color: #aebed0 !important;
        }

        /* Welcome profile inset: no more dark-on-dark text. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child * {
          color: #eaf1f7 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child {
          background: linear-gradient(145deg, rgba(5,14,25,.86), rgba(11,28,45,.72)) !important;
          border-color: rgba(151,190,218,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div:first-child div:first-child {
          color: #91a7bb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child div:first-child div:nth-child(2) {
          color: #f3f7fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child > div:not(:first-child) span {
          color: #8fa4b7 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(1) > div > div:last-child > div:not(:first-child) strong {
          color: #e6eef5 !important;
        }

        /* Keep the three profile summary cards readable. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div * {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(3),
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(2) > div:nth-child(2) > div > div:nth-child(5) {
          color: #aebed0 !important;
        }

        /* Progress card: white text, muted secondary text, visible track. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2),
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) * {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) p {
          color: #aebed0 !important;
        }

        /* Cards: never allow the old light inline text colors to survive. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button * {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(5) {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:first-child {
          color: #ff9b4f !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(3) > button > div:nth-child(6) > span:last-child {
          color: #9fb2c3 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button * {
          color: #f7f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > button p {
          color: #aebed0 !important;
        }

        /* Section labels stay orange; footer stays muted. */
        html[data-theme="dark"] .kf-dashboard-page > div > section > div > div:first-child {
          color: #ff8b32 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > p:last-child {
          color: #71859a !important;
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 640px) {
          .kf-dashboard-header,
          html[data-theme="dark"] .kf-dashboard-header {
            top: 10px !important;
            width: calc(100vw - 20px) !important;
            padding: 9px 11px !important;
            border-radius: 20px !important;
          }

          html[data-theme="dark"] .kf-dashboard-page {
            padding-top: 92px !important;
          }

          html[data-theme="dark"] .kf-dashboard-header::after {
            border-radius: 25px !important;
          }
        }

        /* --------------------------------------------------
           LEARNING CARDS — PREMIUM DARK GLASS / NEON
           Visual-only styling. Card dimensions, spacing, grid,
           typography, icons, text and structure remain unchanged.
           -------------------------------------------------- */

        html[data-theme="dark"] .kf-learning-card {
          --learning-accent: #00bfff;
          --learning-glow: rgba(0, 191, 255, .24);
          background:
            linear-gradient(118deg, rgba(255,255,255,.075) 0%, rgba(255,255,255,.025) 11%, transparent 27%, transparent 73%, rgba(255,255,255,.018) 89%, rgba(255,255,255,.045) 100%),
            radial-gradient(circle at 87% 14%, rgba(255,255,255,.035) 0%, transparent 26%),
            radial-gradient(circle at 14% 88%, color-mix(in srgb, var(--learning-accent) 10%, transparent) 0%, transparent 34%),
            linear-gradient(145deg, rgba(10,22,36,.97), rgba(5,13,23,.99)) !important;
          backdrop-filter: blur(10px) saturate(125%);
          -webkit-backdrop-filter: blur(10px) saturate(125%);
          color: #f4f8fc !important;
          border: 1px solid color-mix(in srgb, var(--learning-accent) 72%, rgba(255,255,255,.16)) !important;
          box-shadow:
            0 16px 34px rgba(0,0,0,.28),
            0 0 26px var(--learning-glow),
            inset 0 1px 0 rgba(255,255,255,.095),
            inset 0 -1px 0 rgba(0,0,0,.28),
            inset 0 0 22px rgba(255,255,255,.018) !important;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease,
            filter .22s ease !important;
          isolation: isolate;
        }

        html[data-theme="dark"] .kf-learning-card::before {
          content: "";
          position: absolute;
          inset: -18% -8%;
          z-index: 0;
          pointer-events: none;
          border: 1px solid color-mix(in srgb, var(--learning-accent) 16%, transparent);
          border-radius: 46% 54% 42% 58% / 56% 44% 58% 42%;
          transform: rotate(-8deg);
          opacity: .42;
          box-shadow:
            inset 0 0 28px color-mix(in srgb, var(--learning-accent) 7%, transparent),
            inset 0 16px 24px rgba(255,255,255,.018);
        }

        html[data-theme="dark"] .kf-learning-card::after {
          content: "";
          position: absolute;
          right: 10px;
          bottom: 44px;
          width: 132px;
          height: 92px;
          z-index: 0;
          pointer-events: none;
          opacity: .17;
          background-image:
            radial-gradient(circle, color-mix(in srgb, var(--learning-accent) 74%, white 0%) 1px, transparent 1.4px);
          background-size: 12px 12px;
          mask-image: linear-gradient(to left, #000 0%, rgba(0,0,0,.88) 42%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, #000 0%, rgba(0,0,0,.88) 42%, transparent 100%);
        }

        html[data-theme="dark"] .kf-learning-card > * {
          position: relative;
          z-index: 2;
        }

        html[data-theme="dark"] .kf-learning-card > .kf-learning-accentbar,
        html[data-theme="dark"] .kf-learning-card > .kf-learning-orb {
          z-index: 1;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-accentbar {
          height: 2px !important;
          background: linear-gradient(
            90deg,
            var(--learning-accent),
            color-mix(in srgb, var(--learning-accent) 64%, transparent)
          ) !important;
          box-shadow: 0 0 14px var(--learning-glow) !important;
          opacity: .95;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-orb {
          background:
            radial-gradient(circle at 35% 35%, color-mix(in srgb, var(--learning-accent) 20%, white 0%), transparent 66%) !important;
          box-shadow: 0 0 42px color-mix(in srgb, var(--learning-accent) 16%, transparent);
          opacity: .62;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-icon {
          background:
            radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--learning-accent) 25%, white 0%), transparent 58%),
            rgba(255,255,255,.075) !important;
          border: 1px solid rgba(255,255,255,.07);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.045),
            0 0 20px color-mix(in srgb, var(--learning-accent) 10%, transparent) !important;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-status {
          background: rgba(3,11,20,.44) !important;
          color: var(--learning-accent) !important;
          border: 1px solid color-mix(in srgb, var(--learning-accent) 62%, rgba(255,255,255,.10)) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-title {
          color: #f7f9fc !important;
          text-shadow: 0 1px 0 rgba(0,0,0,.28);
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-score,
        html[data-theme="dark"] .kf-learning-card .kf-learning-description {
          color: #aebfd0 !important;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-score strong {
          color: var(--learning-accent) !important;
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-cta {
          color: var(--learning-accent) !important;
          text-shadow: 0 0 12px color-mix(in srgb, var(--learning-accent) 18%, transparent);
        }

        html[data-theme="dark"] .kf-learning-card .kf-learning-arrow {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--learning-accent) 55%, rgba(255,255,255,.10)) !important;
          border-radius: 50%;
          background: rgba(3,11,20,.34) !important;
          color: #f2f7fb !important;
          font-size: 17px !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 0 16px color-mix(in srgb, var(--learning-accent) 7%, transparent);
        }

        html[data-theme="dark"] .kf-learning-card:nth-child(1) {
          --learning-accent: #00dfc0;
          --learning-glow: rgba(0,223,192,.26);
          background:
            radial-gradient(circle at 87% 11%, rgba(0,223,192,.14) 0%, transparent 29%),
            linear-gradient(145deg, #0b403b, #071f20) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(2) {
          --learning-accent: #b6f33a;
          --learning-glow: rgba(174,239,52,.26);
          background:
            radial-gradient(circle at 87% 11%, rgba(174,239,52,.13) 0%, transparent 29%),
            linear-gradient(145deg, #24491f, #102517) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(3) {
          --learning-accent: #ff4fc6;
          --learning-glow: rgba(255,79,198,.27);
          background:
            radial-gradient(circle at 87% 11%, rgba(255,79,198,.14) 0%, transparent 29%),
            linear-gradient(145deg, #54133f, #260b27) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(4) {
          --learning-accent: #18bfff;
          --learning-glow: rgba(24,191,255,.28);
          background:
            radial-gradient(circle at 87% 11%, rgba(24,191,255,.14) 0%, transparent 29%),
            linear-gradient(145deg, #123f70, #081d36) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(5) {
          --learning-accent: #ffad2f;
          --learning-glow: rgba(255,173,47,.27);
          background:
            radial-gradient(circle at 87% 11%, rgba(255,173,47,.15) 0%, transparent 29%),
            linear-gradient(145deg, #432711, #1c110a) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(6) {
          --learning-accent: #765cff;
          --learning-glow: rgba(118,92,255,.28);
          background:
            radial-gradient(circle at 87% 11%, rgba(118,92,255,.15) 0%, transparent 29%),
            linear-gradient(145deg, #1a1d70, #0b0e32) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(7) {
          --learning-accent: #00b9ff;
          --learning-glow: rgba(0,185,255,.27);
          background:
            radial-gradient(circle at 87% 11%, rgba(0,185,255,.14) 0%, transparent 29%),
            linear-gradient(145deg, #102d55, #08162a) !important;
        }
        html[data-theme="dark"] .kf-learning-card:nth-child(8) {
          --learning-accent: #ff4fb2;
          --learning-glow: rgba(255,79,178,.28);
          background:
            radial-gradient(circle at 87% 11%, rgba(255,79,178,.15) 0%, transparent 29%),
            linear-gradient(145deg, #55133b, #230b22) !important;
        }

        html[data-theme="dark"] .kf-learning-card:hover {
          transform: translateY(-4px);
          border-color: var(--learning-accent) !important;
          box-shadow:
            0 20px 44px rgba(0,0,0,.34),
            0 0 30px var(--learning-glow),
            inset 0 1px 0 rgba(255,255,255,.13),
            inset 0 0 30px rgba(255,255,255,.025) !important;
          filter: brightness(1.055) saturate(1.04);
        }

        html[data-theme="dark"] .kf-learning-card:focus-visible {
          outline: 2px solid var(--learning-accent);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          html[data-theme="dark"] .kf-learning-card::after {
            width: 96px;
            height: 72px;
          }
        }

        /* ------------------------------------------------------------
           FINAL DASHBOARD STICKY NAVBAR
           Same positioning model as the Explore page: the header
           remains in normal document flow and sticks to the viewport
           while the page scrolls.
           ------------------------------------------------------------ */
        .kf-dashboard-header {
          position: sticky !important;
          top: 12px !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
          width: 100% !important;
          max-width: 1200px !important;
          min-height: 0 !important;
          height: auto !important;
          box-sizing: border-box !important;
          padding: 10px 14px !important;
          margin: 0 0 26px !important;
          transform: none !important;
          z-index: 50 !important;
          border-radius: 24px !important;
        }

        html[data-theme="dark"] .kf-dashboard-header {
          position: sticky !important;
          top: 12px !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
          width: 100% !important;
          max-width: 1200px !important;
          min-height: 0 !important;
          height: auto !important;
          box-sizing: border-box !important;
          padding: 10px 14px !important;
          margin: 0 0 26px !important;
          transform: none !important;
          z-index: 50 !important;
          border-radius: 24px !important;
        }

        /* Sticky positioning needs the page hierarchy to remain unclipped. */
        .kf-dashboard-page {
          overflow-x: visible !important;
          padding-top: 18px !important;
        }

        html[data-theme="dark"] .kf-dashboard-page {
          overflow-x: visible !important;
          padding-top: 18px !important;
        }

        @media (max-width: 640px) {
          .kf-dashboard-header,
          html[data-theme="dark"] .kf-dashboard-header {
            position: sticky !important;
            top: 10px !important;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 0 20px !important;
            transform: none !important;
            z-index: 50 !important;
          }

          .kf-dashboard-page,
          html[data-theme="dark"] .kf-dashboard-page {
            padding-top: 18px !important;
          }
        }

        /* --------------------------------------------------
           WELCOME HERO — SECOND REFERENCE IMAGE
           Dark-mode-only visual pass. The rest of the dashboard
           theme and palette remain unchanged.
           -------------------------------------------------- */
        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section {
          background:
            radial-gradient(circle at 90% 8%, rgba(48,110,158,.44) 0%, rgba(48,110,158,0) 31%),
            radial-gradient(circle at 8% 96%, rgba(193,142,91,.30) 0%, rgba(193,142,91,0) 31%),
            linear-gradient(115deg, #132a40 0%, #10273d 48%, #0b1d30 100%) !important;
          border-color: rgba(102,154,198,.22) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,.24) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section > .kf-welcome-orb-blue {
          background: rgba(122,169,201,.18) !important;
          opacity: 1 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section > .kf-welcome-orb-orange {
          background: rgba(198,148,95,.30) !important;
          opacity: 1 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-grid {
          grid-template-columns: minmax(0, 1.2fr) minmax(330px, .8fr) !important;
          gap: 42px !important;
          padding: 34px 40px !important;
          min-height: 358px !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-badge {
          background: rgba(255,139,50,.14) !important;
          color: #f2c9a5 !important;
          border-color: rgba(255,139,50,.20) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-title {
          background: linear-gradient(100deg, #f7f8fb 0%, #f7f8fb 40%, #f6d7b2 74%, #f0b477 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
          text-shadow: 0 2px 18px rgba(0,0,0,.10) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-title span {
          -webkit-text-fill-color: initial !important;
          color: #ffb15f !important;
          background: none !important;
        }

        /* --------------------------------------------------
           DASHBOARD — HINDI/MARATHI GREETING MATRA FIX
           Keep the dark-mode gradient on the overall title, but
           opt the translated greeting word out of that gradient.
           This prevents Devanagari vowel marks such as "े" from
           being clipped by the transparent text-fill treatment.
           -------------------------------------------------- */
        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-title .kf-welcome-hello {
          display: inline-block !important;
          font-family:
            "Baloo 2",
            "Noto Sans Devanagari",
            "Nirmala UI",
            "Mangal",
            sans-serif !important;
          line-height: 1.10 !important;
          letter-spacing: -0.012em !important;
          background: none !important;
          background-clip: initial !important;
          -webkit-background-clip: initial !important;
          color: #f7f8fb !important;
          -webkit-text-fill-color: #f7f8fb !important;
          text-shadow: none !important;
        }

        html[data-theme="light"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-title .kf-welcome-hello {
          display: inline-block !important;
          font-family:
            "Baloo 2",
            "Noto Sans Devanagari",
            "Nirmala UI",
            "Mangal",
            sans-serif !important;
          line-height: 1.10 !important;
          letter-spacing: -0.012em !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-description {
          color: #a9bfd3 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-actions button:first-of-type {
          background: linear-gradient(135deg, #ff9a3d, #ff7a00) !important;
          color: #101722 !important;
          border: 1px solid rgba(255,184,111,.55) !important;
          box-shadow:
            0 0 0 1px rgba(255,122,0,.08),
            0 8px 18px rgba(255,122,0,.28),
            0 0 24px rgba(255,122,0,.30) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-actions button:last-of-type {
          background: rgba(7,17,31,.52) !important;
          color: #e4edf5 !important;
          border-color: rgba(167,199,224,.22) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.025) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section > .kf-welcome-grid > .kf-welcome-copy {
          position: relative !important;
          z-index: 2 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section > .kf-welcome-grid > .kf-welcome-profile {
          position: relative !important;
          overflow: hidden !important;
          background: linear-gradient(145deg, rgba(5,14,25,.86), rgba(11,28,45,.72)) !important;
          border: 1px solid rgba(128,175,208,.22) !important;
          border-radius: 28px !important;
          padding: 22px !important;
          min-height: 286px !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 18px 38px rgba(0,0,0,.24) !important;
          color: #eaf1f7 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-orb {
          background: rgba(102,153,190,.14) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-head {
          position: relative !important;
          z-index: 3 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-head > div:first-child > div:first-child {
          color: #8da5b9 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-name {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          font-size: 19px !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-name span {
          color: #ff7a00 !important;
          -webkit-text-fill-color: #ff7a00 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-head > div:last-child,
        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-in-badge {
          background: #000000 !important;
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
          border-color: rgba(255,255,255,.12) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 8px 22px rgba(0,0,0,.18) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile-rows {
          position: relative !important;
          z-index: 3 !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row {
          background: rgba(48,111,160,.19) !important;
          border: 1px solid rgba(77,151,207,.17) !important;
          min-height: 50px !important;
          padding: 8px 14px !important;
          margin-top: 9px !important;
          border-radius: 15px !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(2) {
          background: rgba(133,85,42,.20) !important;
          border-color: rgba(226,154,77,.17) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(3) {
          background: rgba(35,87,134,.23) !important;
          border-color: rgba(49,138,213,.20) !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row-icon {
          display: grid !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(2) .kf-welcome-row-icon {
          color: #ffc27f !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(3) .kf-welcome-row-icon {
          color: #69c1ff !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row-label {
          color: #8ea6ba !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row-value {
          color: #9fb9cc !important;
          max-width: 62% !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(2) .kf-welcome-row-value {
          color: #f5b66e !important;
        }

        html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-row:nth-child(3) .kf-welcome-row-value {
          color: #27b2ff !important;
        }

        @media (max-width: 980px) {
          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-grid {
            grid-template-columns: 1fr !important;
            gap: 26px !important;
          }
        }

        @media (max-width: 640px) {
          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-grid {
            padding: 26px 22px !important;
            min-height: 0 !important;
          }

          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-title {
            font-size: clamp(36px, 11vw, 48px) !important;
          }

          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-profile {
            min-height: 0 !important;
            padding: 18px !important;
          }

          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-actions {
            gap: 10px !important;
          }

          html[data-theme="dark"] main.kf-dashboard-page > div > section.kf-welcome-section .kf-welcome-actions button {
            width: 100%;
          }
        }

        /* ---------- OVERALL COMPLETION PERCENTAGE ---------- */
        html[data-theme="dark"] .kf-dashboard-page .kf-overall-percentage-ring {
          background: #fffdf9 !important;
          color: #000000 !important;
          border: 0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-overall-percentage {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          opacity: 1 !important;
          text-shadow: none !important;
          visibility: visible !important;
          mix-blend-mode: normal !important;
        }

/* =========================================================
   CIVIC SENSE — DASHBOARD CARD
   ========================================================= */
html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense {
  background:
    radial-gradient(circle at 92% 6%, rgba(255,209,102,.14), transparent 28%),
    radial-gradient(circle at 8% 100%, rgba(24,191,255,.10), transparent 30%),
    linear-gradient(145deg, #173947 0%, #10283a 58%, #0c1d2d 100%) !important;
  border-color: rgba(255,209,102,.48) !important;
  color: #f7f9fc !important;
  box-shadow:
    0 18px 42px rgba(0,0,0,.26),
    0 0 24px rgba(255,209,102,.08) !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense > div:first-child {
  background: rgba(255,209,102,.13) !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense > div:nth-child(2) > div:first-child {
  background: rgba(255,255,255,.07) !important;
  border-color: rgba(255,255,255,.10) !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense h3 {
  color: #f7f9fc !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense p {
  color: #b7c8d7 !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense > div:nth-child(5) > span:first-child {
  color: #ffae45 !important;
}

html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card-civic-sense > div:nth-child(5) > span:last-child {
  background: rgba(255,255,255,.06) !important;
  border-color: rgba(255,255,255,.12) !important;
  color: #a9bdcf !important;
}



/* =====================================================
   MOBILE / TABLET PROFILE INFORMATION
   Desktop remains unchanged. Narrow layouts use compact,
   structured cards so city/age/interests do not become
   tall narrow columns.
   ===================================================== */
@media (max-width: 1023px) {
  .kf-dashboard-profile-summary-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
    gap: 10px !important;
  }

  .kf-dashboard-profile-summary-grid > .kf-dashboard-info-card:first-child {
    grid-column: 1 / -1 !important;
  }

  .kf-dashboard-info-card {
    min-height: 0 !important;
    height: auto !important;
    padding: 14px !important;
    border-radius: 20px !important;
    box-shadow: 0 8px 22px rgba(16,27,43,.045) !important;
  }

  .kf-dashboard-info-card > div:nth-child(2) {
    width: 38px !important;
    height: 38px !important;
    border-radius: 13px !important;
    font-size: 18px !important;
  }

  .kf-dashboard-info-card > div:nth-child(3) {
    margin-top: 9px !important;
    margin-bottom: 3px !important;
    font-size: 8px !important;
    line-height: 1.2 !important;
    letter-spacing: .11em !important;
  }

  .kf-dashboard-info-card > div:nth-child(4) {
    margin-bottom: 2px !important;
    font-size: 15px !important;
    line-height: 1.18 !important;
    overflow-wrap: anywhere !important;
  }

  .kf-dashboard-info-card > div:nth-child(5) {
    font-size: 10px !important;
    line-height: 1.35 !important;
  }

  .kf-welcome-profile {
    min-height: 0 !important;
    padding: 16px !important;
  }

  .kf-welcome-row {
    gap: 8px !important;
    padding: 9px 10px !important;
    border-radius: 13px !important;
  }

  .kf-welcome-row-label {
    font-size: 8px !important;
    letter-spacing: .10em !important;
  }

  .kf-welcome-row-value {
    max-width: 62% !important;
    white-space: normal !important;
    overflow-wrap: anywhere !important;
    text-align: right !important;
    font-size: 11px !important;
    line-height: 1.25 !important;
  }
}

@media (max-width: 430px) {
  .kf-dashboard-quick-access-grid {
    grid-template-columns: 1fr !important;
  }

  .kf-dashboard-quick-access-card {
    min-height: 68px !important;
  }

  .kf-dashboard-profile-summary-grid {
    grid-template-columns: 1fr 1fr !important;
  }

  .kf-dashboard-info-card {
    padding: 12px !important;
  }

  .kf-dashboard-info-card > div:nth-child(4) {
    font-size: 14px !important;
  }
}

@media (max-width: 360px) {
  .kf-dashboard-profile-summary-grid {
    grid-template-columns: 1fr !important;
  }

  .kf-dashboard-profile-summary-grid > .kf-dashboard-info-card:first-child {
    grid-column: auto !important;
  }
}


        /* =====================================================
           DARK MODE — DASHBOARD RECTANGLES
           Light mode stays exactly as it is.
           ===================================================== */

        /* Quick Access cards */
        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card {
          color: #f4f7fb !important;
          border-color: rgba(145,174,204,.18) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card:nth-child(1) {
          background: linear-gradient(145deg, #102f4b, #0e263d) !important;
          border-color: rgba(83,166,222,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card:nth-child(2) {
          background: linear-gradient(145deg, #163a30, #122f27) !important;
          border-color: rgba(99,190,146,.26) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card:nth-child(3) {
          background: linear-gradient(145deg, #342d4d, #2a243e) !important;
          border-color: rgba(190,165,226,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card:nth-child(4) {
          background: linear-gradient(145deg, #3b2c1f, #302419) !important;
          border-color: rgba(225,157,85,.28) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card > span:first-child {
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(255,255,255,.10) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card strong {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-quick-access-card > span:nth-child(2) > span {
          color: #9fb2c3 !important;
        }

        /* Civic Profile cards */
        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card {
          color: #f7f8fb !important;
          border-color: rgba(145,174,204,.16) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.20) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-profile-summary-grid > .kf-dashboard-info-card:nth-child(1) {
          background: linear-gradient(145deg, #102f4b, #0e263d) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-profile-summary-grid > .kf-dashboard-info-card:nth-child(2) {
          background: linear-gradient(145deg, #3b2c1f, #302419) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-profile-summary-grid > .kf-dashboard-info-card:nth-child(3) {
          background: linear-gradient(145deg, #18352b, #122b23) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card > div:first-child {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card > div:nth-child(2) {
          background: rgba(255,255,255,.075) !important;
          border: 1px solid rgba(255,255,255,.08) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card > div:nth-child(3) {
          color: #90a2b4 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card > div:nth-child(4) {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-info-card > div:nth-child(5) {
          color: #a5b6c6 !important;
        }

        /* Learning progress summary rectangle */
        html[data-theme="dark"] .kf-dashboard-page .kf-overall-percentage-ring {
          background: #0d1d31 !important;
          border: 0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-overall-percentage {
          color: #f7f8fb !important;
          -webkit-text-fill-color: #f7f8fb !important;
        }

        /* Feature rectangles */
        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card {
          color: #f7f8fb !important;
          box-shadow:
            0 15px 34px rgba(0,0,0,.25),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(1) {
          background: linear-gradient(145deg, #102f4b, #0e263d) !important;
          border-color: rgba(83,166,222,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(2) {
          background: linear-gradient(145deg, #163a30, #122f27) !important;
          border-color: rgba(99,190,146,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(3) {
          background: linear-gradient(145deg, #342d4d, #2a243e) !important;
          border-color: rgba(190,165,226,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(4) {
          background: linear-gradient(145deg, #3b2c1f, #302419) !important;
          border-color: rgba(225,157,85,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(5) {
          background: linear-gradient(145deg, #18352b, #122b23) !important;
          border-color: rgba(126,169,91,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(6) {
          background: linear-gradient(145deg, #342947, #292039) !important;
          border-color: rgba(190,165,226,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(7) {
          background: linear-gradient(145deg, #213a2d, #182d23) !important;
          border-color: rgba(126,169,91,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(8) {
          background: linear-gradient(145deg, #12333b, #102a30) !important;
          border-color: rgba(78,178,194,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(9) {
          background: linear-gradient(145deg, #392b1e, #2f2419) !important;
          border-color: rgba(225,157,85,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(10) {
          background: linear-gradient(145deg, #3a2c20, #302319) !important;
          border-color: rgba(230,166,97,.24) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card:nth-child(11) {
          background: linear-gradient(145deg, #102f4b, #0e263d) !important;
          border-color: rgba(83,166,222,.25) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card > div:first-child {
          background: rgba(255,255,255,.055) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card > div:nth-child(3) > div:first-child {
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(255,255,255,.08) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card h3 {
          color: #f7f9fc !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card p {
          color: #aebed0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card > div:last-child > span:first-child {
          color: #ff9a4d !important;
        }

        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-feature-card > div:last-child > span:last-child {
          background: rgba(4,10,20,.48) !important;
          border-color: rgba(145,174,204,.16) !important;
          color: #9fb0c0 !important;
        }




        /* ==================================================
           FINAL DARK-MODE RECTANGLE FIX
           ================================================== */

        /* 1) Learning Progress overall-completion rectangle */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) {
          background:
            radial-gradient(circle at 88% 12%, rgba(32,76,112,.30) 0%, rgba(32,76,112,0) 32%),
            linear-gradient(145deg, #101f33 0%, #0b1728 100%) !important;
          border: 1px solid rgba(139,174,204,.18) !important;
          box-shadow:
            0 18px 40px rgba(0,0,0,.28),
            inset 0 1px 0 rgba(255,255,255,.035) !important;
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) > div:first-child {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) div[style*="color: #989fa6"] {
          color: #91a5b7 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) div[style*="color: #102033"] {
          color: #f5f8fb !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) span[style*="color: #7c8791"] {
          color: #9db0c1 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) div[style*="background: #fffdf9"] {
          background: #0b1728 !important;
          border: 0 !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) div[style*="background: #eee8df"] {
          background: rgba(255,255,255,.085) !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(4) > div:nth-child(2) p {
          color: #9fb1c2 !important;
        }

        /* 2) Remove the unwanted green block around FEATURES */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(5) {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        /* Remove the rectangular backdrop behind the Civic Profile cards.
           The older dashboard dark-mode block also targets section 3 > div 2,
           so this selector intentionally matches that specificity and wins. */
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2) {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          background-image: none !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          background-image: none !important;
        }

        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2)::before,
        html[data-theme="dark"] .kf-dashboard-page > div > section:nth-of-type(3) > div:nth-child(2)::after,
        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-profile-summary-grid::before,
        html[data-theme="dark"] .kf-dashboard-page .kf-dashboard-profile-summary-grid::after {
          content: none !important;
          display: none !important;
          background: none !important;
        }


        /* =========================================================
           DASHBOARD — MOBILE / TABLET CARD SHAPE FIX
           Desktop uses inline 4-column grids. These hooks let
           mobile/tablet override the grid and keep cards readable.
           ========================================================= */

        @media (max-width: 1023px) {
          .kf-dashboard-learning-grid,
          .kf-dashboard-action-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 12px !important;
            align-items: stretch !important;
          }

          .kf-dashboard-page .kf-learning-card,
          .kf-dashboard-page .kf-dashboard-feature-card {
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card {
            min-height: 290px !important;
            height: auto !important;
            padding: 16px !important;
            border-radius: 24px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card h3 {
            font-size: 18px !important;
            line-height: 1.12 !important;
            margin-top: 15px !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > p {
            font-size: 11.5px !important;
            line-height: 1.5 !important;
            margin-top: 8px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > div:last-child {
            position: static !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            width: 100% !important;
            margin-top: 16px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > div:last-child > span:first-child {
            max-width: calc(100% - 36px) !important;
            font-size: 10px !important;
            line-height: 1.25 !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > div:last-child > span:last-child {
            flex: 0 0 30px !important;
            width: 30px !important;
            height: 30px !important;
          }

          .kf-dashboard-page .kf-learning-card {
            min-height: 250px !important;
            height: auto !important;
            border-radius: 24px !important;
          }
        }

        @media (max-width: 640px) {
          .kf-dashboard-learning-grid,
          .kf-dashboard-action-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card {
            min-height: 275px !important;
            padding: 14px !important;
            border-radius: 22px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card h3 {
            font-size: 17px !important;
            line-height: 1.1 !important;
            margin-top: 13px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > p {
            font-size: 10.5px !important;
            line-height: 1.46 !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card > div:nth-child(3) > div:first-child {
            width: 44px !important;
            height: 44px !important;
            border-radius: 15px !important;
            font-size: 20px !important;
          }

          .kf-dashboard-page .kf-learning-card {
            min-height: 235px !important;
            border-radius: 22px !important;
          }
        }

        @media (max-width: 380px) {
          .kf-dashboard-learning-grid,
          .kf-dashboard-action-grid {
            gap: 8px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card {
            min-height: 260px !important;
            padding: 12px !important;
          }

          .kf-dashboard-page .kf-dashboard-feature-card h3 {
            font-size: 16px !important;
          }
        }

`}</style>
    </main>
  );
}

/* -------------------------------------------------- */
/* INFO CARD */
/* -------------------------------------------------- */

function InfoCard({
  icon,
  title,
  value,
  subtitle,
  tint = "#edf5fb",
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  tint?: string;
}) {
  return (
    <div
      className="kf-dashboard-info-card"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid rgba(16,27,43,.10)",
        borderRadius: "24px",
        padding: "20px",
        color: "#102033",
        boxShadow: "0 10px 28px rgba(16,27,43,.045)",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-30px",
          top: "-30px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: tint,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "48px",
          height: "48px",
          display: "grid",
          placeItems: "center",
          borderRadius: "17px",
          background: tint,
          fontSize: "23px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          position: "relative",
          color: "#949ca4",
          fontSize: "10px",
          fontWeight: 900,
          letterSpacing: ".15em",
          textTransform: "uppercase",
          marginTop: "17px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "relative",
          color: "#263447",
          fontSize: "19px",
          fontWeight: "800",
          marginBottom: "4px",
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>

      <div
        style={{
          position: "relative",
          color: "#7e8993",
          fontSize: "12px",
          lineHeight: "1.45",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* LEARNING TOPIC CARD */
/* -------------------------------------------------- */

function LearningTopicCard({
  icon,
  title,
  completed,
  score,
  completedLabel,
  notStartedLabel,
  quizScoreLabel,
  completeQuizLabel,
  reviewTopicLabel,
  startLearningLabel,
  onClick,
  tint = "#edf5fb",
  accent = "#b5d3e7",
}: {
  icon: string;
  title: string;
  completed: boolean;
  score: number | null;
  completedLabel: string;
  notStartedLabel: string;
  quizScoreLabel: string;
  completeQuizLabel: string;
  reviewTopicLabel: string;
  startLearningLabel: string;
  onClick: () => void;
  tint?: string;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="kf-learning-card"
      data-completed={completed ? "true" : "false"}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "235px",
        overflow: "hidden",
        textAlign: "left",
        background: "#ffffff",
        color: "#102033",
        border: completed
          ? "1px solid #cdddbd"
          : "1px solid rgba(16,27,43,.10)",
        borderRadius: "25px",
        padding: "20px",
        cursor: "pointer",
        boxShadow: "0 10px 28px rgba(16,27,43,.042)",
        transition:
          "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 18px 36px rgba(16,27,43,.085)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 28px rgba(16,27,43,.042)";
      }}
    >
      <div
        className="kf-learning-accentbar"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "5px",
          background: accent,
        }}
      />

      <div
        className="kf-learning-orb"
        style={{
          position: "absolute",
          right: "-26px",
          top: "-26px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: tint,
        }}
      />

      <div
        className="kf-learning-card-header"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div
          className="kf-learning-icon"
          style={{
            width: "48px",
            height: "48px",
            display: "grid",
            placeItems: "center",
            borderRadius: "17px",
            background: tint,
            fontSize: "22px",
          }}
        >
          {icon}
        </div>

        <div
          className="kf-learning-status"
          style={{
            fontSize: "9px",
            fontWeight: 900,
            padding: "6px 10px",
            borderRadius: "999px",
            background: completed ? "#eff5e8" : "#faf8f4",
            color: completed ? "#658040" : "#9aa0a5",
            border: completed
              ? "1px solid #d8e5cc"
              : "1px solid #e8e2d9",
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {completed ? completedLabel : notStartedLabel}
        </div>
      </div>

      <h3
        className="kf-learning-title"
        style={{
          position: "relative",
          fontSize: "18px",
          lineHeight: "1.12",
          margin: "18px 0 0",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          color: "#102033",
        }}
      >
        {title}
      </h3>

      {completed && score !== null ? (
        <div
          className="kf-learning-score"
          style={{
            color: "#7c8790",
            fontSize: "11px",
            marginTop: "10px",
          }}
        >
          {quizScoreLabel}{" "}
          <strong style={{ color: "#ff7a00" }}>
            {score}/5
          </strong>
        </div>
      ) : (
        <div
          className="kf-learning-description"
          style={{
            color: "#89939c",
            fontSize: "11px",
            lineHeight: "1.5",
            marginTop: "10px",
          }}
        >
          {completeQuizLabel}
        </div>
      )}

      <div
        className="kf-learning-footer"
        style={{
          position: "absolute",
          left: "20px",
          right: "20px",
          bottom: "17px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          className="kf-learning-cta"
          style={{
            color: "#ff7a00",
            fontSize: "11px",
            fontWeight: 900,
          }}
        >
          {completed ? reviewTopicLabel : startLearningLabel}
        </span>

        <span
          className="kf-learning-arrow"
          style={{
            color: "#afb5b9",
            fontSize: "15px",
          }}
        >
          →
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------- */
/* FEATURE CARD */
/* -------------------------------------------------- */

function FeatureCard({
  icon,
  title,
  description,
  actionText,
  onClick,
  tint = "#edf5fb",
  accent = "#b5d3e7",
  index = 0,
  cardKey = "",
}: {
  icon: string;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
  tint?: string;
  accent?: string;
  index?: number;
  cardKey?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`kf-dashboard-feature-card ${cardKey ? `kf-dashboard-feature-card-${cardKey}` : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "250px",
        textAlign: "left",
        background: "#ffffff",
        color: "#102033",
        border: "1px solid rgba(16,27,43,.10)",
        borderRadius: "28px",
        padding: "20px",
        cursor: "pointer",
        boxShadow: "0 10px 30px rgba(16,27,43,.045)",
        transition:
          "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 20px 42px rgba(16,27,43,.09)";
        e.currentTarget.style.borderColor = accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(16,27,43,.045)";
        e.currentTarget.style.borderColor = "rgba(16,27,43,.10)";
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-22px",
          top: "-22px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: tint,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "4px",
          background: accent,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            display: "grid",
            placeItems: "center",
            borderRadius: "18px",
            background: tint,
            fontSize: "24px",
          }}
        >
          {icon}
        </div>

        <span
          style={{
            color: "#a1a6ab",
            fontSize: "10px",
            fontWeight: 900,
            letterSpacing: ".18em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3
        style={{
          position: "relative",
          fontSize: "20px",
          lineHeight: "1.08",
          margin: "20px 0 0",
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          color: "#102033",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          position: "relative",
          color: "#74808b",
          fontSize: "12.5px",
          lineHeight: "1.6",
          margin: "10px 0 0",
        }}
      >
        {description}
      </p>

      <div
        style={{
          position: "absolute",
          left: "20px",
          right: "20px",
          bottom: "17px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            color: "#ff7a00",
            fontSize: "11px",
            fontWeight: 900,
          }}
        >
          {actionText}
        </span>

        <span
          style={{
            width: "30px",
            height: "30px",
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(16,27,43,.10)",
            borderRadius: "50%",
            color: "#8c949b",
            background: "#fffdf9",
            fontSize: "13px",
          }}
        >
          →
        </span>
      </div>
    </button>
  );
}
