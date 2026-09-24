"use client";

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

    welcomeLabel: "WELCOME BACK",
    hello: "Hello",
    welcomeDescription:
      "Welcome to KarmaFacie. Explore civic knowledge, understand your community and build your civic participation journey.",

    location: "Location",
    ageGroup: "Age Group",
    interests: "Interests",
    civicProfile: "Your civic profile",
    topics: "topics",
    interestedTopics: "Topics you're interested in",

    learningLabel: "YOUR LEARNING",
    progressTitle: "Your KarmaFacie Progress",
    progressDescription:
      "Complete KarmaFacie topics and test what you learn through interactive quizzes.",

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

    civicQuestLabel: "KARMAFACIE",
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

    knowIndia: "Know India",
    knowIndiaDescription:
      "Discover India's Constitution, institutions, history, geography and civic systems.",
    knowIndiaAlert: "Know India feature is coming soon.",

    comingSoon: "COMING SOON",
    journeyTitle: "Your civic journey will grow here.",
    journeyDescription:
      "KarmaFacie will gradually add interactive experiences, Civic Quests, community participation, issue reporting and tools to help you understand and participate in civic life.",

    footer: "Your civic journey starts here.",

    loading: "Loading your dashboard...",
    profileError: "Could not load your profile.",
  },

  hi: {
    dashboardSubtitle: "आपका नागरिक डैशबोर्ड",
    editProfile: "प्रोफ़ाइल संपादित करें",

    welcomeLabel: "वापसी पर स्वागत है",
    hello: "नमस्ते",
    welcomeDescription:
      "KarmaFacie में आपका स्वागत है। नागरिक ज्ञान को जानें, अपने समुदाय को समझें और अपनी नागरिक भागीदारी की यात्रा शुरू करें।",

    location: "स्थान",
    ageGroup: "आयु वर्ग",
    interests: "रुचियाँ",
    civicProfile: "आपकी नागरिक प्रोफ़ाइल",
    topics: "विषय",
    interestedTopics: "आपकी रुचि के विषय",

    learningLabel: "आपकी सीखने की यात्रा",
    progressTitle: "आपकी KarmaFacie प्रगति",
    progressDescription:
      "KarmaFacie के विषय पूरे करें और इंटरैक्टिव क्विज़ के माध्यम से अपनी सीख का परीक्षण करें।",

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

    civicQuestLabel: "KARMAFACIE",
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

    knowIndia: "भारत को जानें",
    knowIndiaDescription:
      "भारत के संविधान, संस्थाओं, इतिहास, भूगोल और नागरिक व्यवस्थाओं के बारे में जानें।",
    knowIndiaAlert: "Know India सुविधा जल्द आ रही है।",

    comingSoon: "जल्द आ रहा है",
    journeyTitle: "आपकी नागरिक यात्रा यहाँ आगे बढ़ेगी।",
    journeyDescription:
      "KarmaFacie में धीरे-धीरे इंटरैक्टिव अनुभव, Civic Quests, समुदाय में भागीदारी, समस्या रिपोर्टिंग और नागरिक जीवन को समझने तथा उसमें भाग लेने में मदद करने वाले उपकरण जोड़े जाएंगे।",

    footer: "आपकी नागरिक यात्रा यहीं से शुरू होती है।",

    loading: "आपका डैशबोर्ड लोड हो रहा है...",
    profileError: "आपकी प्रोफ़ाइल लोड नहीं हो सकी।",
  },

  mr: {
    dashboardSubtitle: "तुमचा नागरिक डॅशबोर्ड",
    editProfile: "प्रोफाइल संपादित करा",

    welcomeLabel: "पुन्हा स्वागत आहे",
    hello: "नमस्कार",
    welcomeDescription:
      "KarmaFacie मध्ये तुमचे स्वागत आहे. नागरिक ज्ञान जाणून घ्या, तुमचा समुदाय समजून घ्या आणि तुमच्या नागरिक सहभागाची वाटचाल सुरू करा.",

    location: "स्थान",
    ageGroup: "वयोगट",
    interests: "आवडी",
    civicProfile: "तुमची नागरिक प्रोफाइल",
    topics: "विषय",
    interestedTopics: "तुम्हाला आवडणारे विषय",

    learningLabel: "तुमची शिकण्याची वाटचाल",
    progressTitle: "तुमची KarmaFacie प्रगती",
    progressDescription:
      "KarmaFacie चे विषय पूर्ण करा आणि इंटरॅक्टिव्ह क्विझद्वारे तुम्ही काय शिकलात ते तपासा.",

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

    civicQuestLabel: "KARMAFACIE",
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

    knowIndia: "भारत जाणून घ्या",
    knowIndiaDescription:
      "भारताचे संविधान, संस्था, इतिहास, भूगोल आणि नागरिक व्यवस्था याबद्दल जाणून घ्या.",
    knowIndiaAlert: "Know India सुविधा लवकरच येत आहे.",

    comingSoon: "लवकरच येत आहे",
    journeyTitle: "तुमची नागरिक वाटचाल येथे पुढे वाढेल.",
    journeyDescription:
      "KarmaFacie मध्ये हळूहळू इंटरॅक्टिव्ह अनुभव, Civic Quests, समुदाय सहभाग, समस्या नोंदणी आणि नागरिक जीवन समजून घेण्यासाठी व त्यात सहभागी होण्यासाठी उपयुक्त साधने जोडली जातील.",

    footer: "तुमची नागरिक वाटचाल येथून सुरू होते.",

    loading: "तुमचा डॅशबोर्ड लोड होत आहे...",
    profileError: "तुमची प्रोफाइल लोड करता आली नाही.",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();

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
        router.push("/auth");
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
        router.push("/get-started");
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
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "12px",
            }}
          >
            Civic<span style={{ color: "#ff7a00" }}>Quest</span>
          </div>

          <p style={{ color: "#94a3b8" }}>
            {text.loading}
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "32px 5% 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
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
            marginBottom: "55px",
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
              {text.dashboardSubtitle}
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/get-started")}
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
            {text.editProfile}
          </button>
        </header>

        {/* WELCOME */}

        <section
          style={{
            marginBottom: "45px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            {text.welcomeLabel}
          </div>

          <h1
            style={{
              fontSize: "46px",
              fontWeight: "800",
              margin: "0 0 14px",
            }}
          >
            {text.hello}, {profile.name} 👋
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              lineHeight: "1.6",
              maxWidth: "750px",
              margin: 0,
            }}
          >
            {text.welcomeDescription}
          </p>
        </section>

        {/* PROFILE SUMMARY */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "55px",
          }}
        >
          <InfoCard
            icon="📍"
            title={text.location}
            value={profile.city}
            subtitle={profile.state}
          />

          <InfoCard
            icon="🎂"
            title={text.ageGroup}
            value={profile.ageGroup}
            subtitle={text.civicProfile}
          />

          <InfoCard
            icon="💡"
            title={text.interests}
            value={`${profile.interests.length} ${text.topics}`}
            subtitle={text.interestedTopics}
          />
        </section>

        {/* LEARNING PROGRESS */}

        <section
          style={{
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                color: "#ff7a00",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              {text.learningLabel}
            </div>

            <h2
              style={{
                fontSize: "30px",
                margin: "0 0 10px",
              }}
            >
              {text.progressTitle}
            </h2>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {text.progressDescription}
            </p>
          </div>

          {/* OVERALL PROGRESS */}

          <div
            style={{
              background:
                "linear-gradient(135deg, #0f172a, #111827)",
              border: "1px solid #334155",
              borderRadius: "22px",
              padding: "28px",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "20px",
                marginBottom: "18px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginBottom: "7px",
                  }}
                >
                  {text.overallCompletion}
                </div>

                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: "800",
                  }}
                >
                  {completedCount}/{totalTopics} {text.topicsLabel}
                </div>
              </div>

              <div
                style={{
                  color: "#ff7a00",
                  fontSize: "30px",
                  fontWeight: "800",
                }}
              >
                {completionPercentage}%
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "12px",
                background: "#020617",
                borderRadius: "999px",
                overflow: "hidden",
                border: "1px solid #1e293b",
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
                color: "#64748b",
                fontSize: "13px",
                margin: "12px 0 0",
              }}
            >
              {text.keepExploring}
            </p>
          </div>

          {/* TOPIC PROGRESS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {learningTopics.map((topic) => {
              const progress = learningProgress.find(
                (item) => item.topic === topic.key
              );

              const completed = progress?.completed === true;

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
                />
              );
            })}
          </div>
        </section>

        {/* FEATURES */}

        <section>
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                color: "#ff7a00",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              {text.civicQuestLabel}
            </div>

            <h2
              style={{
                fontSize: "30px",
                margin: 0,
              }}
            >
              {text.whatWouldYouLike}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* EXPLORE */}

            <FeatureCard
              icon="📖"
              title={text.explore}
              description={text.exploreDescription}
              actionText={text.exploreAction}
              onClick={() => router.push("/civic-learning")}
            />

            {/* REPORT ISSUE */}

            <FeatureCard
              icon="📢"
              title={text.reportIssue}
              description={text.reportIssueDescription}
              actionText={text.reportIssueAction}
              onClick={() => router.push("/report-issue")}
            />

            {/* MY CIVIC ISSUES */}

            <FeatureCard
              icon="📋"
              title={text.myCivicIssues}
              description={text.myCivicIssuesDescription}
              actionText={text.myCivicIssuesAction}
              onClick={() => router.push("/my-issues")}
            />

            {/* CIVIC QUESTS */}

            <FeatureCard
              icon="🎯"
              title={text.civicQuests}
              description={text.civicQuestsDescription}
              actionText="Explore Civic Quests →"
              onClick={() => router.push("/civic-quests")}
            />

            {/* COMMUNITY */}

            <FeatureCard
              icon="👥"
              title={text.community}
              description={text.communityDescription}
              actionText={text.communityAction}
              onClick={() => router.push("/community")}
            />

            {/* MY IMPACT */}

            <FeatureCard
              icon="📊"
              title={text.myImpact}
              description={text.myImpactDescription}
              actionText={text.myImpactAction}
              onClick={() => router.push("/my-impact")}
            />

            {/* KNOW INDIA */}

            <FeatureCard
              icon="🇮🇳"
              title={text.knowIndia}
              description={text.knowIndiaDescription}
              actionText="Explore Know India →"
              onClick={() => router.push("/know-india")}
            />
          </div>
        </section>

        {/* COMING SOON */}

        <section
          style={{
            marginTop: "50px",
            padding: "30px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              color: "#ff7a00",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            {text.comingSoon}
          </div>

          <h2
            style={{
              fontSize: "25px",
              margin: "0 0 10px",
            }}
          >
            {text.journeyTitle}
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            {text.journeyDescription}
          </p>
        </section>

        {/* FOOTER */}

        <p
          style={{
            marginTop: "35px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {text.footer}
        </p>
      </div>
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
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "18px",
        padding: "22px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "19px",
          fontWeight: "700",
          marginBottom: "5px",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
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
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: "#0f172a",
        color: "white",
        border: completed
          ? "1px solid rgba(34, 197, 94, 0.45)"
          : "1px solid #1e293b",
        borderRadius: "18px",
        padding: "22px",
        cursor: "pointer",
        minHeight: "190px",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            fontSize: "30px",
          }}
        >
          {icon}
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: "700",
            padding: "6px 10px",
            borderRadius: "999px",
            background: completed
              ? "rgba(34, 197, 94, 0.1)"
              : "rgba(148, 163, 184, 0.08)",
            color: completed
              ? "#22c55e"
              : "#94a3b8",
          }}
        >
          {completed ? completedLabel : notStartedLabel}
        </div>
      </div>

      <h3
        style={{
          fontSize: "18px",
          lineHeight: "1.4",
          margin: "0 0 10px",
        }}
      >
        {title}
      </h3>

      {completed && score !== null ? (
        <div
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {quizScoreLabel}{" "}
          <strong style={{ color: "#ff7a00" }}>
            {score}/5
          </strong>
        </div>
      ) : (
        <div
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          {completeQuizLabel}
        </div>
      )}

      <div
        style={{
          color: "#ff7a00",
          fontSize: "14px",
          fontWeight: "700",
        }}
      >
        {completed ? reviewTopicLabel : startLearningLabel}
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
}: {
  icon: string;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: "#0f172a",
        color: "white",
        border: "1px solid #1e293b",
        borderRadius: "20px",
        padding: "28px",
        minHeight: "220px",
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          fontSize: "38px",
          marginBottom: "18px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "21px",
          margin: "0 0 12px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: "1.6",
          margin: 0,
        }}
      >
        {description}
      </p>

      <div
        style={{
          color: "#ff7a00",
          fontSize: "14px",
          fontWeight: "600",
          marginTop: "18px",
        }}
      >
        {actionText}
      </div>
    </button>
  );
}