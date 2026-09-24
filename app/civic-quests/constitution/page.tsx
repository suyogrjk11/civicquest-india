"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { constitutionQuest } from "@/lib/civic-quests";

const ui: Record<
  Language,
  {
    back: string;
    questionOf: (current: number, total: number) => string;
    previous: string;
    next: string;
    finish: string;
    selectAnswer: string;
    correct: string;
    incorrect: string;
    explanation: string;
    complete: string;
    score: string;
    xpEarned: string;
    outOf: (score: number, total: number) => string;
    tryAgain: string;
    questLibrary: string;
    excellent: string;
    keepGoing: string;
    answered: (current: number, total: number) => string;
    xpCorrect: string;
  }
> = {
  en: {
    back: "← Back to Civic Quests",
    questionOf: (current, total) => `Question ${current} of ${total}`,
    previous: "← Previous",
    next: "Next →",
    finish: "Finish Quest",
    selectAnswer: "Select an answer to continue.",
    correct: "Correct!",
    incorrect: "Not quite.",
    explanation: "Explanation",
    complete: "Quest Complete!",
    score: "Your Score",
    xpEarned: "XP Earned",
    outOf: (score, total) => `${score} out of ${total}`,
    tryAgain: "Try Again",
    questLibrary: "Quest Library",
    excellent: "Excellent work!",
    keepGoing: "Keep learning and take on another quest.",
    answered: (current, total) => `${current} / ${total} answered`,
    xpCorrect: "XP / correct",
  },
  hi: {
    back: "← Civic Quests पर वापस जाएँ",
    questionOf: (current, total) => `प्रश्न ${current} / ${total}`,
    previous: "← पिछला",
    next: "अगला →",
    finish: "क्वेस्ट पूरा करें",
    selectAnswer: "जारी रखने के लिए एक उत्तर चुनें।",
    correct: "सही!",
    incorrect: "यह सही उत्तर नहीं है।",
    explanation: "व्याख्या",
    complete: "क्वेस्ट पूरा हुआ!",
    score: "आपका स्कोर",
    xpEarned: "अर्जित XP",
    outOf: (score, total) => `${score} / ${total}`,
    tryAgain: "फिर से प्रयास करें",
    questLibrary: "क्वेस्ट लाइब्रेरी",
    excellent: "बहुत बढ़िया!",
    keepGoing: "सीखते रहें और एक और क्वेस्ट का प्रयास करें।",
    answered: (current, total) => `${current} / ${total} उत्तर दिए`,
    xpCorrect: "XP / सही उत्तर",
  },
  mr: {
    back: "← Civic Quests वर परत जा",
    questionOf: (current, total) => `प्रश्न ${current} / ${total}`,
    previous: "← मागील",
    next: "पुढील →",
    finish: "क्वेस्ट पूर्ण करा",
    selectAnswer: "पुढे जाण्यासाठी एक उत्तर निवडा.",
    correct: "बरोबर!",
    incorrect: "हे योग्य उत्तर नाही.",
    explanation: "स्पष्टीकरण",
    complete: "क्वेस्ट पूर्ण!",
    score: "तुमचा स्कोअर",
    xpEarned: "मिळवलेले XP",
    outOf: (score, total) => `${score} / ${total}`,
    tryAgain: "पुन्हा प्रयत्न करा",
    questLibrary: "क्वेस्ट लायब्ररी",
    excellent: "उत्तम काम!",
    keepGoing: "शिकत राहा आणि आणखी एक क्वेस्ट घ्या.",
    answered: (current, total) => `${current} / ${total} उत्तरे दिली`,
    xpCorrect: "XP / बरोबर उत्तर",
  },
};

export default function ConstitutionQuestPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = ui[language];
  const supabase = createClient();
  const questId = "constitution";

  const questions = constitutionQuest.questions;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);

  const question = questions[current];
  const options = question.options[language];

  const calculateScore = (answerMap: Record<number, number>) =>
    questions.reduce(
      (total, item, index) =>
        total + (answerMap[index] === item.correctAnswer ? 1 : 0),
      0
    );

  const saveProgress = async (
    nextCurrent: number,
    nextAnswers: Record<number, number>,
    nextScore: number,
    completed: boolean
  ) => {
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
        .from("civic_quest_progress")
        .upsert(
          {
            user_id: user.id,
            quest_id: questId,
            current_question: nextCurrent,
            answers: nextAnswers,
            score: nextScore,
            xp_earned: nextScore * constitutionQuest.xpPerQuestion,
            completed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,quest_id",
          }
        );

      if (error) {
        console.error("Error saving Constitution quest progress:", error);
      }
    } catch (error) {
      console.error(
        "Unexpected error while saving Constitution quest progress:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("civic_quest_progress")
          .select("current_question, answers, score, completed")
          .eq("user_id", user.id)
          .eq("quest_id", questId)
          .maybeSingle();

        if (error) {
          console.error("Error loading Constitution quest progress:", error);
          return;
        }

        if (data) {
          const restoredAnswers: Record<number, number> =
            data.answers && typeof data.answers === "object"
              ? Object.fromEntries(
                  Object.entries(data.answers).map(([key, value]) => [
                    Number(key),
                    Number(value),
                  ])
                )
              : {};

          const restoredCurrent = Math.min(
            Math.max(Number(data.current_question) || 0, 0),
            questions.length - 1
          );

          setAnswers(restoredAnswers);
          setCurrent(restoredCurrent);
          setSelected(restoredAnswers[restoredCurrent] ?? null);
          setSubmitted(restoredAnswers[restoredCurrent] !== undefined);

          if (data.completed) {
            setFinished(true);
          }
        }
      } catch (error) {
        console.error(
          "Unexpected error loading Constitution quest progress:",
          error
        );
      } finally {
        setProgressHydrated(true);
      }
    };

    loadProgress();
  }, []);

  const submitAnswer = () => {
    if (selected === null) return;

    setAnswers((previous) => ({
      ...previous,
      [current]: selected,
    }));
    setSubmitted(true);
  };

  const nextQuestion = async () => {
    if (!submitted) {
      submitAnswer();
      return;
    }

    const nextAnswers = {
      ...answers,
      [current]: selected as number,
    };
    const nextScore = calculateScore(nextAnswers);

    if (current === questions.length - 1) {
      setAnswers(nextAnswers);
      setFinished(true);
      await saveProgress(current, nextAnswers, nextScore, true);
      return;
    }

    const nextIndex = current + 1;
    setAnswers(nextAnswers);
    setCurrent(nextIndex);
    setSelected(nextAnswers[nextIndex] ?? null);
    setSubmitted(false);
    await saveProgress(nextIndex, nextAnswers, nextScore, false);
  };

  const previousQuestion = async () => {
    if (current === 0) return;

    const previousIndex = current - 1;
    setCurrent(previousIndex);
    setSelected(answers[previousIndex] ?? null);
    setSubmitted(answers[previousIndex] !== undefined);

    await saveProgress(
      previousIndex,
      answers,
      calculateScore(answers),
      false
    );
  };

  const restart = async () => {
    const emptyAnswers: Record<number, number> = {};
    setCurrent(0);
    setSelected(null);
    setAnswers(emptyAnswers);
    setSubmitted(false);
    setFinished(false);

    await saveProgress(0, emptyAnswers, 0, false);
  };

  const score = calculateScore(answers);

  if (!progressHydrated) {
    return null;
  }

  if (finished) {
    const xp = score * constitutionQuest.xpPerQuestion;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <button type="button" onClick={() => router.push("/civic-quests")} style={backButtonStyle}>
            {text.questLibrary}
          </button>

          <section style={resultCardStyle}>
            <div style={{ fontSize: "64px", marginBottom: "18px" }}>
              {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}
            </div>

            <div style={eyebrowStyle}>⚖️ KARMAFACIE</div>

            <h1 style={resultTitleStyle}>{text.complete}</h1>

            <p style={resultDescriptionStyle}>
              {percentage >= 80 ? text.excellent : text.keepGoing}
            </p>

            <div style={resultGridStyle}>
              <ResultStat
                label={text.score}
                value={text.outOf(score, questions.length)}
              />
              <ResultStat label={text.xpEarned} value={`+${xp} XP`} />
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <button type="button" onClick={restart} style={primaryButtonStyle}>
                {text.tryAgain}
              </button>
              <button
                type="button"
                onClick={() => router.push("/civic-quests")}
                style={secondaryButtonStyle}
              >
                {text.questLibrary}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isCorrect = selected === question.correctAnswer;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <header style={{ marginBottom: "28px" }}>
          <button
            type="button"
            onClick={() => router.push("/civic-quests")}
            style={backButtonStyle}
          >
            {text.back}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <div style={eyebrowStyle}>⚖️ KARMAFACIE</div>
              <h1 style={titleStyle}>{constitutionQuest.title[language]}</h1>
              <p style={descriptionStyle}>{constitutionQuest.description[language]}</p>
            </div>

            <div style={xpBadgeStyle}>⭐ {constitutionQuest.xpPerQuestion} {text.xpCorrect}</div>
          </div>
        </header>

        <div style={progressTrackStyle}>
          <div
            style={{
              height: "100%",
              width: `${((current + 1) / questions.length) * 100}%`,
              background: "#ff7a00",
              borderRadius: "999px",
              transition: "width 0.25s ease",
            }}
          />
        </div>

        <div style={mutedLabelStyle}>
          {text.questionOf(current + 1, questions.length)}
        </div>

        <section style={questionCardStyle}>
          <div style={answeredStyle}>
            {text.answered(answeredCount, questions.length)}
          </div>

          <h2 style={questionStyle}>{question.question[language]}</h2>

          <div style={{ display: "grid", gap: "12px" }}>
            {options.map((option, index) => {
              const chosen = selected === index;
              const correct = submitted && index === question.correctAnswer;
              const wrong = submitted && chosen && index !== question.correctAnswer;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => !submitted && setSelected(index)}
                  disabled={submitted}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "17px 18px",
                    borderRadius: "14px",
                    border: correct
                      ? "2px solid #22c55e"
                      : wrong
                      ? "2px solid #ef4444"
                      : chosen
                      ? "2px solid #ff7a00"
                      : "1px solid #e2e8f0",
                    background: correct
                      ? "rgba(34, 197, 94, 0.12)"
                      : wrong
                      ? "rgba(239, 68, 68, 0.12)"
                      : chosen
                      ? "#ff7a00"
                      : "#f8fafc",
                    color: correct
                      ? "#166534"
                      : wrong
                      ? "#991b1b"
                      : chosen
                      ? "#0f172a"
                      : "#0f172a",
                    cursor: submitted ? "default" : "pointer",
                    fontSize: "16px",
                    lineHeight: 1.5,
                    fontWeight: chosen ? 700 : 500,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "12px",
                      background:
                        correct || wrong || chosen
                          ? "rgba(255,255,255,0.75)"
                          : "#e2e8f0",
                      color:
                        correct
                          ? "#166534"
                          : wrong
                          ? "#991b1b"
                          : chosen
                          ? "#0f172a"
                          : "#334155",
                      fontWeight: 800,
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div
              style={{
                marginTop: "22px",
                padding: "18px",
                borderRadius: "15px",
                background: isCorrect
                  ? "rgba(34, 197, 94, 0.10)"
                  : "rgba(239, 68, 68, 0.10)",
                border: isCorrect
                  ? "1px solid rgba(34, 197, 94, 0.35)"
                  : "1px solid rgba(239, 68, 68, 0.35)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: "17px", marginBottom: "8px", color: isCorrect ? "#16a34a" : "#dc2626" }}>
                {isCorrect ? text.correct : text.incorrect}
              </div>
              <div>
                <div style={{ color: "#475569", fontWeight: 800, fontSize: "13px", marginBottom: "6px" }}>
                  {text.explanation}
                </div>
                <p style={{ margin: 0, color: "#334155", lineHeight: 1.65 }}>
                  {question.explanation[language]}
                </p>
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "26px" }}>
            <button
              type="button"
              onClick={previousQuestion}
              disabled={current === 0}
              style={{
                ...secondaryButtonStyle,
                opacity: current === 0 ? 0.4 : 1,
                cursor: current === 0 ? "default" : "pointer",
              }}
            >
              {text.previous}
            </button>

            <button
              type="button"
              onClick={nextQuestion}
              disabled={selected === null || savingProgress}
              style={{
                ...primaryButtonStyle,
                opacity: selected === null || savingProgress ? 0.45 : 1,
                cursor: selected === null || savingProgress ? "default" : "pointer",
              }}
            >
              {!submitted ? "Check Answer" : current === questions.length - 1 ? text.finish : text.next}
            </button>
          </div>

          {selected === null && (
            <div style={{ color: "#64748b", fontSize: "12px", marginTop: "12px", textAlign: "right" }}>
              {text.selectAnswer}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "7px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #07111f 0%, #0f172a 42%, #f8fafc 42%, #f8fafc 100%)",
  color: "#0f172a",
  padding: "32px 20px 60px",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "920px",
  margin: "0 auto",
};

const backButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#cbd5e1",
  fontWeight: 800,
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: "26px",
  fontSize: "14px",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#ff7a00",
  fontWeight: 900,
  fontSize: "12px",
  letterSpacing: "0.12em",
};

const titleStyle: React.CSSProperties = {
  color: "white",
  fontSize: "clamp(30px, 5vw, 48px)",
  lineHeight: 1.05,
  margin: "10px 0 12px",
  fontWeight: 900,
};

const descriptionStyle: React.CSSProperties = {
  color: "#cbd5e1",
  maxWidth: "680px",
  lineHeight: 1.65,
  margin: 0,
};

const xpBadgeStyle: React.CSSProperties = {
  background: "rgba(255, 122, 0, 0.12)",
  border: "1px solid rgba(255, 122, 0, 0.35)",
  color: "#ffb067",
  borderRadius: "999px",
  padding: "10px 14px",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const progressTrackStyle: React.CSSProperties = {
  height: "8px",
  background: "#1e293b",
  borderRadius: "999px",
  overflow: "hidden",
  marginBottom: "12px",
};

const mutedLabelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "12px 0 18px",
};

const answeredStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 800,
  marginBottom: "14px",
};

const questionCardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  padding: "clamp(22px, 5vw, 38px)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.10)",
};

const questionStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "clamp(23px, 4vw, 32px)",
  lineHeight: 1.25,
  margin: "0 0 24px",
};

const primaryButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#ff7a00",
  color: "white",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
};

const resultCardStyle: React.CSSProperties = {
  marginTop: "40px",
  background: "white",
  borderRadius: "24px",
  padding: "clamp(28px, 6vw, 56px)",
  textAlign: "center",
  boxShadow: "0 22px 60px rgba(15, 23, 42, 0.12)",
};

const resultTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: "clamp(30px, 5vw, 46px)",
  margin: "8px 0 10px",
};

const resultDescriptionStyle: React.CSSProperties = {
  color: "#64748b",
  lineHeight: 1.6,
  margin: "0 auto 28px",
  maxWidth: "520px",
};

const resultGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "26px",
};

const resultStatStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "20px",
  background: "#f8fafc",
};
