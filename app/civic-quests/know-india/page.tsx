"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from "@/lib/supabase/client";
import type { Language } from "@/lib/i18n";
import { knowIndiaQuest } from "@/lib/know-india-quest";

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

export default function KnowIndiaQuestPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();
  const text = ui[language];

  const questions = knowIndiaQuest.questions;
  const progressStorageKey = "civicquest-know-india-progress-v2";

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressHydrated, setProgressHydrated] = useState(false);

  // Restore progress from Supabase first so the quest resumes across
  // refreshes and devices. Fall back to localStorage only if no cloud
  // progress exists.
  useEffect(() => {
    let mounted = true;

    const restoreProgress = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("civic_quest_progress")
            .select("current_question, answers, completed")
            .eq("user_id", user.id)
            .eq("quest_id", "know-india")
            .maybeSingle();

          if (!error && data && mounted) {
            const savedAnswers =
              data.answers && typeof data.answers === "object"
                ? Object.fromEntries(
                    Object.entries(data.answers).map(([key, value]) => [
                      Number(key),
                      Number(value),
                    ])
                  )
                : {};

            const savedCurrent =
              typeof data.current_question === "number"
                ? Math.min(
                    Math.max(data.current_question, 0),
                    questions.length - 1
                  )
                : 0;

            setAnswers(savedAnswers);
            setCurrent(savedCurrent);
            setSelected(savedAnswers[savedCurrent] ?? null);
            setSubmitted(savedAnswers[savedCurrent] !== undefined);
            setFinished(Boolean(data.completed));
            return;
          }
        }

        // Local fallback keeps the existing refresh-resume behavior if the
        // user is offline or no cloud row exists yet.
        const saved = window.localStorage.getItem(progressStorageKey);
        if (!saved || !mounted) return;

        const parsed = JSON.parse(saved);

        const localCurrent =
          typeof parsed.current === "number" &&
          parsed.current >= 0 &&
          parsed.current < questions.length
            ? parsed.current
            : 0;

        const localAnswers =
          parsed.answers && typeof parsed.answers === "object"
            ? parsed.answers
            : {};

        setCurrent(localCurrent);
        setAnswers(localAnswers);
        setSelected(
          typeof localAnswers[localCurrent] === "number"
            ? localAnswers[localCurrent]
            : null
        );
        setSubmitted(localAnswers[localCurrent] !== undefined);
        setFinished(Boolean(parsed.finished));
      } catch (error) {
        console.error("Unable to restore Know India progress:", error);
      } finally {
        if (mounted) setProgressHydrated(true);
      }
    };

    restoreProgress();

    return () => {
      mounted = false;
    };
  }, []);

  // Do not write anything until the saved state has been restored.
  // This prevents the initial React state (Question 1) from overwriting
  // the saved Question 2+ state during a refresh.
  useEffect(() => {
    if (!progressHydrated) return;

    try {
      window.localStorage.setItem(
        progressStorageKey,
        JSON.stringify({
          current,
          selected,
          answers,
          submitted,
          finished,
        })
      );
    } catch (error) {
      console.error("Unable to save Know India progress locally:", error);
    }
  }, [
    progressHydrated,
    current,
    selected,
    answers,
    submitted,
    finished,
  ]);

  const question = questions[current];
  const options = question.options[language];

  const calculateScore = (answerMap: Record<number, number>) => {
    return questions.reduce(
      (total, item, index) =>
        total + (answerMap[index] === item.correctAnswer ? 1 : 0),
      0
    );
  };

  const saveProgress = async (
    questionIndex: number,
    answerMap: Record<number, number>,
    finalScore: number,
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
            quest_id: "know-india",
            current_question: questionIndex,
            answers: answerMap,
            score: finalScore,
            xp_earned: finalScore * knowIndiaQuest.xpPerQuestion,
            completed,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,quest_id",
          }
        );

      if (error) {
        console.error("Error saving KarmaFacie progress:", error);
      }
    } catch (error) {
      console.error(
        "Unexpected error while saving KarmaFacie progress:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const submitAnswer = async () => {
    if (selected === null) return;

    const updatedAnswers = {
      ...answers,
      [current]: selected,
    };

    const updatedScore = calculateScore(updatedAnswers);

    setAnswers(updatedAnswers);
    setSubmitted(true);

    // Save immediately so the selected answer and score survive a refresh.
    await saveProgress(current, updatedAnswers, updatedScore, false);
  };

  const nextQuestion = async () => {
    if (!submitted) {
      await submitAnswer();
      return;
    }

    if (current === questions.length - 1) {
      const finalAnswers = {
        ...answers,
        [current]: selected as number,
      };
      const finalScore = calculateScore(finalAnswers);

      setAnswers(finalAnswers);
      setFinished(true);
      await saveProgress(current, finalAnswers, finalScore, true);
      return;
    }

    const nextIndex = current + 1;

    setCurrent(nextIndex);
    setSelected(answers[nextIndex] ?? null);
    setSubmitted(false);

    // Store the next question index in Supabase so the quest can resume
    // from the same question even on another device/session.
    await saveProgress(
      nextIndex,
      answers,
      calculateScore(answers),
      false
    );
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
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setSubmitted(false);
    setFinished(false);

    try {
      window.localStorage.removeItem(progressStorageKey);
    } catch (error) {
      console.error("Unable to clear Know India progress:", error);
    }

    await saveProgress(0, {}, 0, false);
  };

  const score = questions.reduce(
    (total, item, index) =>
      total + (answers[index] === item.correctAnswer ? 1 : 0),
    0
  );

  if (finished) {
    const xp = score * knowIndiaQuest.xpPerQuestion;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <button
            type="button"
            onClick={() => router.push("/civic-quests")}
            style={backButtonStyle}
          >
            {text.questLibrary}
          </button>

          <section style={resultCardStyle}>
            <div style={{ fontSize: "64px", marginBottom: "18px" }}>
              {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}
            </div>

            <div style={eyebrowStyle}>🇮🇳 KARMAFACIE</div>

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

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={restart}
                style={primaryButtonStyle}
              >
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={eyebrowStyle}>🇮🇳 KNOW INDIA · 04</div>
              <h1 style={titleStyle}>{knowIndiaQuest.title[language]}</h1>
              <p style={descriptionStyle}>
                {knowIndiaQuest.description[language]}
              </p>
            </div>

            <div style={xpBadgeStyle}>
              ⭐ {knowIndiaQuest.xpPerQuestion} {text.xpCorrect}
            </div>
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
              const correct =
                submitted && index === question.correctAnswer;
              const wrong =
                submitted && chosen && index !== question.correctAnswer;

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
                      : "1px solid #1e293b",
                    background: correct
                      ? "rgba(34,197,94,0.12)"
                      : wrong
                      ? "rgba(239,68,68,0.12)"
                      : chosen
                      ? "#ff7a00"
                      : "#0f172a",
                    color: correct
                      ? "#166534"
                      : wrong
                      ? "#991b1b"
                      : chosen
                      ? "#0f172a"
                      : "white",
                    cursor: submitted ? "default" : "pointer",
                    fontSize: "16px",
                    lineHeight: 1.5,
                    fontWeight: chosen || submitted ? 700 : 500,
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
                      background: correct
                        ? "#dcfce7"
                        : wrong
                        ? "#fee2e2"
                        : chosen
                        ? "rgba(255,255,255,0.75)"
                        : "#1e293b",
                      color: correct
                        ? "#166534"
                        : wrong
                        ? "#991b1b"
                        : chosen
                        ? "#0f172a"
                        : "white",
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

          {selected === null && (
            <p style={hintStyle}>{text.selectAnswer}</p>
          )}

          {submitted && (
            <div
              style={{
                marginTop: "22px",
                padding: "18px",
                borderRadius: "14px",
                background: isCorrect
                  ? "rgba(34,197,94,0.10)"
                  : "rgba(239,68,68,0.10)",
                border: isCorrect
                  ? "1px solid rgba(34,197,94,0.35)"
                  : "1px solid rgba(239,68,68,0.35)",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "17px",
                  marginBottom: "8px",
                  color: isCorrect ? "#16a34a" : "#dc2626",
                }}
              >
                {isCorrect ? "✓ " : "✕ "}
                {isCorrect ? text.correct : text.incorrect}
              </div>

              <div
                style={{
                  color: "#475569",
                  fontWeight: 800,
                  fontSize: "13px",
                  marginBottom: "6px",
                }}
              >
                {text.explanation}
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#334155",
                  lineHeight: 1.65,
                }}
              >
                {question.explanation[language]}
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={previousQuestion}
              disabled={current === 0}
              style={{
                ...secondaryButtonStyle,
                opacity: current === 0 ? 0.45 : 1,
                cursor: current === 0 ? "not-allowed" : "pointer",
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
                opacity:
                  selected === null || savingProgress ? 0.45 : 1,
                cursor:
                  selected === null || savingProgress
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {submitted && current === questions.length - 1
                ? savingProgress
                  ? "Saving..."
                  : text.finish
                : text.next}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={resultStatStyle}>
      <div
        style={{
          color: "#64748b",
          fontSize: "13px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: "7px",
          fontSize: "28px",
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #07111f 0%, #0f172a 42%, #f8fafc 42%, #f8fafc 100%)",
  padding: "32px 20px 60px",
};

const containerStyle = {
  width: "100%",
  maxWidth: "920px",
  margin: "0 auto",
};

const backButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#cbd5e1",
  fontWeight: 800,
  cursor: "pointer",
  padding: "8px 0",
  marginBottom: "26px",
  fontSize: "14px",
};

const eyebrowStyle = {
  color: "#ff7a00",
  fontWeight: 900,
  fontSize: "12px",
  letterSpacing: "0.12em",
};

const titleStyle = {
  color: "white",
  fontSize: "clamp(30px, 5vw, 48px)",
  lineHeight: 1.05,
  margin: "10px 0 12px",
  fontWeight: 900,
};

const descriptionStyle = {
  color: "#cbd5e1",
  maxWidth: "680px",
  lineHeight: 1.65,
  margin: 0,
};

const xpBadgeStyle = {
  background: "rgba(255, 122, 0, 0.12)",
  border: "1px solid rgba(255, 122, 0, 0.35)",
  color: "#ffb067",
  borderRadius: "999px",
  padding: "10px 14px",
  fontWeight: 800,
  whiteSpace: "nowrap" as const,
};

const progressTrackStyle = {
  height: "8px",
  background: "#1e293b",
  borderRadius: "999px",
  overflow: "hidden",
  marginBottom: "12px",
};

const mutedLabelStyle = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "12px 0 18px",
};

const answeredStyle = {
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 800,
  marginBottom: "14px",
};

const questionCardStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "22px",
  padding: "clamp(22px, 5vw, 38px)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.10)",
};

const questionStyle = {
  color: "#0f172a",
  fontSize: "clamp(23px, 4vw, 32px)",
  lineHeight: 1.25,
  margin: "0 0 24px",
};

const hintStyle = {
  color: "#64748b",
  fontSize: "14px",
  marginTop: "16px",
};

const primaryButtonStyle = {
  border: "none",
  background: "#ff7a00",
  color: "white",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#0f172a",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 800,
  cursor: "pointer",
};

const resultCardStyle = {
  marginTop: "40px",
  background: "white",
  borderRadius: "24px",
  padding: "clamp(28px, 6vw, 56px)",
  textAlign: "center" as const,
  boxShadow: "0 22px 60px rgba(15, 23, 42, 0.12)",
};

const resultTitleStyle = {
  color: "#0f172a",
  fontSize: "clamp(30px, 5vw, 46px)",
  margin: "8px 0 10px",
};

const resultDescriptionStyle = {
  color: "#64748b",
  lineHeight: 1.6,
  margin: "0 auto 28px",
  maxWidth: "520px",
};

const resultGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "26px",
};

const resultStatStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "20px",
  background: "#f8fafc",
};
