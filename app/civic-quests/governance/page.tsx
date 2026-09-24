
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { governanceQuest } from "@/lib/governance-quest";
import { createClient } from "@/lib/supabase/client";

const QUEST_ID = "governance";

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
    loading: string;
    saveError: string;
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
    loading: "Loading your progress...",
    saveError: "Your saved progress could not be loaded.",
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
    loading: "आपकी प्रगति लोड हो रही है...",
    saveError: "आपकी सेव की गई प्रगति लोड नहीं हो सकी।",
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
    loading: "तुमची प्रगती लोड होत आहे...",
    saveError: "सेव्ह केलेली प्रगती लोड करता आली नाही.",
  },
};

type Answers = Record<number, number>;

export default function GovernanceQuestPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const text = ui[language];
  const supabase = createClient();
  const questions = governanceQuest.questions;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);

  const calculateScore = (answerMap: Answers) =>
    questions.reduce(
      (total, item, index) =>
        total + (answerMap[index] === item.correctAnswer ? 1 : 0),
      0
    );

  useEffect(() => {
    let mounted = true;

    async function loadProgress() {
      setLoadingProgress(true);
      setProgressError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("civic_quest_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("quest_id", QUEST_ID)
          .maybeSingle();

        if (error) {
          console.log("Civic Quest progress load error:", error);

          if (mounted) {
            setProgressError(
              error.message ||
                error.details ||
                error.hint ||
                `Supabase error (${error.code || "unknown"})`
            );
          }

          return;
        }

        if (!mounted || !data) return;

        const savedAnswers =
          data.answers && typeof data.answers === "object"
            ? (data.answers as Answers)
            : {};

        const savedQuestion =
          typeof data.current_question === "number"
            ? Math.min(
                Math.max(data.current_question, 0),
                questions.length - 1
              )
            : 0;

        setAnswers(savedAnswers);
        setCurrent(savedQuestion);
        setSelected(savedAnswers[savedQuestion] ?? null);
        setSubmitted(savedAnswers[savedQuestion] !== undefined);
        setFinished(Boolean(data.completed));
      } catch (error) {
        console.error("Civic Quest progress load exception:", error);

        if (mounted) {
          setProgressError(
            error instanceof Error
              ? error.message
              : "Unexpected Supabase error while loading progress."
          );
        }
      } finally {
        if (mounted) setLoadingProgress(false);
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, []);

  const persistProgress = async (
    answerMap: Answers,
    questionIndex: number,
    completed: boolean
  ) => {
    setSavingProgress(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const score = calculateScore(answerMap);
      const xpEarned = score * governanceQuest.xpPerQuestion;

      const { error } = await supabase
        .from("civic_quest_progress")
        .upsert(
          {
            user_id: user.id,
            quest_id: QUEST_ID,
            current_question: questionIndex,
            score,
            xp_earned: xpEarned,
            completed,
            answers: answerMap,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,quest_id" }
        );

      if (error) {
        console.log("Civic Quest progress save error:", error);
      }
    } catch (error) {
      console.error("Civic Quest progress save exception:", error);
    } finally {
      setSavingProgress(false);
    }
  };

  const submitAnswer = async () => {
    if (selected === null || submitted) return;

    const nextAnswers = {
      ...answers,
      [current]: selected,
    };

    setAnswers(nextAnswers);
    setSubmitted(true);

    await persistProgress(nextAnswers, current, false);
  };

  const nextQuestion = async () => {
    if (!submitted) {
      await submitAnswer();
      return;
    }

    if (current === questions.length - 1) {
      setFinished(true);
      await persistProgress(answers, current, true);
      return;
    }

    const nextIndex = current + 1;

    setCurrent(nextIndex);
    setSelected(answers[nextIndex] ?? null);
    setSubmitted(answers[nextIndex] !== undefined);

    await persistProgress(answers, nextIndex, false);
  };

  const previousQuestion = async () => {
    if (current === 0) return;

    const previousIndex = current - 1;

    setCurrent(previousIndex);
    setSelected(answers[previousIndex] ?? null);
    setSubmitted(answers[previousIndex] !== undefined);

    await persistProgress(
      answers,
      previousIndex,
      false
    );
  };

  const restart = async () => {
    setCurrent(0);
    setSelected(null);
    setAnswers({});
    setSubmitted(false);
    setFinished(false);

    await persistProgress({}, 0, false);
  };

  const question = questions[current];
  const options = question.options[language];
  const answeredCount = Object.keys(answers).length;
  const score = calculateScore(answers);
  const isCorrect = selected === question.correctAnswer;

  if (loadingProgress) {
    return (
      <main style={loadingPageStyle}>
        <div style={loadingCardStyle}>{text.loading}</div>
      </main>
    );
  }

  if (finished) {
    const xp = score * governanceQuest.xpPerQuestion;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main style={pageStyle}>
        <div style={topBandStyle} />

        <div style={containerStyle}>
          <section style={resultCardStyle}>
            <div style={resultEmojiStyle}>
              {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}
            </div>

            <div style={eyebrowStyle}>KARMAFACIE</div>

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

            <div style={resultActionsStyle}>
              <button
                type="button"
                onClick={restart}
                style={orangeButtonStyle}
              >
                {text.tryAgain}
              </button>

              <button
                type="button"
                onClick={() => router.push("/civic-quests")}
                style={lightButtonStyle}
              >
                {text.questLibrary}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={topBandStyle} />

      <div style={containerStyle}>
        <section style={quizCardStyle}>
          <div style={topRowStyle}>
            <button
              type="button"
              onClick={() => router.push("/civic-quests")}
              style={backButtonStyle}
            >
              {text.back}
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={languageSelectStyle}
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          {progressError && (
            <div style={errorBannerStyle}>
              <strong>{text.saveError}</strong>
              <div>{progressError}</div>
            </div>
          )}

          <div style={answeredRowStyle}>
            <strong>
              {answeredCount} / {questions.length} answered
            </strong>
          </div>

          <div style={progressTrackStyle}>
            <div
              style={{
                ...progressFillStyle,
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div style={questionMetaStyle}>
            {text.questionOf(current + 1, questions.length)}
          </div>

          <h1 style={questionStyle}>{question.question[language]}</h1>

          <div style={optionsStyle}>
            {options.map((option, index) => {
              const chosen = selected === index;
              const correct =
                submitted && index === question.correctAnswer;
              const wrong =
                submitted &&
                chosen &&
                index !== question.correctAnswer;

              return (
                <button
                  key={`${index}-${option}`}
                  type="button"
                  onClick={() => !submitted && setSelected(index)}
                  disabled={submitted}
                  style={{
                    ...optionButtonStyle,
                    ...(correct ? correctOptionStyle : {}),
                    ...(wrong ? wrongOptionStyle : {}),
                    ...(chosen && !submitted
                      ? selectedOptionStyle
                      : {}),
                  }}
                >
                  <span
                    style={{
                      ...optionLetterStyle,
                      ...(chosen && !submitted
                        ? selectedLetterStyle
                        : {}),
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span style={{ flex: 1 }}>{option}</span>

                  {submitted && correct && (
                    <span style={correctIconStyle}>✓</span>
                  )}

                  {submitted && wrong && (
                    <span style={wrongIconStyle}>✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div
              style={{
                ...feedbackStyle,
                ...(isCorrect
                  ? correctFeedbackStyle
                  : incorrectFeedbackStyle),
              }}
            >
              <div style={feedbackTitleStyle}>
                {isCorrect ? text.correct : text.incorrect}
              </div>

              <div style={feedbackTextStyle}>
                <strong>{text.explanation}:</strong>{" "}
                {question.explanation[language]}
              </div>
            </div>
          )}

          <div style={navigationStyle}>
            <button
              type="button"
              onClick={previousQuestion}
              disabled={current === 0}
              style={{
                ...lightButtonStyle,
                opacity: current === 0 ? 0.45 : 1,
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
                ...orangeButtonStyle,
                opacity:
                  selected === null || savingProgress ? 0.5 : 1,
                cursor:
                  selected === null || savingProgress
                    ? "default"
                    : "pointer",
              }}
            >
              {savingProgress
                ? "Saving..."
                : !submitted
                ? "Check Answer"
                : current === questions.length - 1
                ? text.finish
                : text.next}
            </button>
          </div>

          {selected === null && (
            <div style={selectHintStyle}>{text.selectAnswer}</div>
          )}
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
      <div style={resultStatLabelStyle}>{label}</div>
      <div style={resultStatValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  color: "#0f172a",
};

const topBandStyle: React.CSSProperties = {
  height: "150px",
  background: "#0b1730",
  width: "100%",
};

const containerStyle: React.CSSProperties = {
  width: "calc(100% - 32px)",
  maxWidth: "1180px",
  margin: "-72px auto 0",
  position: "relative",
  paddingBottom: "60px",
};

const quizCardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "24px",
  padding: "42px 50px 46px",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
  minHeight: "620px",
};

const topRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
};

const backButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#64748b",
  padding: 0,
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "700",
};

const languageSelectStyle: React.CSSProperties = {
  appearance: "auto",
  background: "#0b1730",
  color: "#ffffff",
  border: "none",
  borderRadius: "14px",
  padding: "12px 15px",
  fontSize: "14px",
  fontWeight: "750",
  minWidth: "125px",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.18)",
};

const answeredRowStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "15px",
  marginBottom: "12px",
};

const progressTrackStyle: React.CSSProperties = {
  width: "100%",
  height: "8px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
  marginBottom: "20px",
};

const progressFillStyle: React.CSSProperties = {
  height: "100%",
  background: "#ff7a00",
  borderRadius: "999px",
  transition: "width 0.25s ease",
};

const questionMetaStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "700",
  marginBottom: "12px",
};

const questionStyle: React.CSSProperties = {
  color: "#0b1730",
  fontSize: "clamp(30px, 4vw, 42px)",
  lineHeight: "1.28",
  fontWeight: "500",
  margin: "0 0 34px",
  letterSpacing: "-0.7px",
};

const optionsStyle: React.CSSProperties = {
  display: "grid",
  gap: "14px",
};

const optionButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "68px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  textAlign: "left",
  border: "1px solid #0b1730",
  borderRadius: "18px",
  background: "#0b1730",
  color: "#ffffff",
  padding: "14px 22px",
  fontSize: "17px",
  fontWeight: "500",
  lineHeight: "1.45",
  cursor: "pointer",
};

const selectedOptionStyle: React.CSSProperties = {
  background: "#ff7a00",
  borderColor: "#ff7a00",
  color: "#07101f",
  fontWeight: "750",
};

const correctOptionStyle: React.CSSProperties = {
  background: "#16a34a",
  borderColor: "#16a34a",
  color: "#ffffff",
  fontWeight: "750",
};

const wrongOptionStyle: React.CSSProperties = {
  background: "#dc2626",
  borderColor: "#dc2626",
  color: "#ffffff",
  fontWeight: "750",
};

const optionLetterStyle: React.CSSProperties = {
  width: "38px",
  height: "38px",
  minWidth: "38px",
  borderRadius: "50%",
  background: "#1d2a42",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "850",
  color: "#ffffff",
};

const selectedLetterStyle: React.CSSProperties = {
  background: "rgba(255,255,255,.82)",
  color: "#0b1730",
};

const correctIconStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "900",
};

const wrongIconStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "900",
};

const feedbackStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "18px 20px",
  borderRadius: "16px",
};

const correctFeedbackStyle: React.CSSProperties = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
};

const incorrectFeedbackStyle: React.CSSProperties = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
};

const feedbackTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "850",
  marginBottom: "7px",
};

const feedbackTextStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
};

const navigationStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginTop: "30px",
};

const orangeButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#ff7a00",
  color: "#ffffff",
  borderRadius: "14px",
  padding: "14px 25px",
  fontSize: "16px",
  fontWeight: "850",
  cursor: "pointer",
  minWidth: "128px",
};

const lightButtonStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  color: "#64748b",
  borderRadius: "14px",
  padding: "13px 23px",
  fontSize: "16px",
  fontWeight: "750",
  cursor: "pointer",
};

const selectHintStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "12px",
  textAlign: "right",
  marginTop: "12px",
};

const errorBannerStyle: React.CSSProperties = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#9a3412",
  borderRadius: "12px",
  padding: "11px 14px",
  fontSize: "13px",
  lineHeight: "1.5",
  marginBottom: "18px",
};

const loadingPageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  paddingTop: "150px",
};

const loadingCardStyle: React.CSSProperties = {
  width: "calc(100% - 32px)",
  maxWidth: "1180px",
  margin: "-72px auto 0",
  background: "#ffffff",
  borderRadius: "24px",
  padding: "70px 40px",
  textAlign: "center",
  color: "#64748b",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
};

const resultCardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "24px",
  padding: "60px 40px",
  textAlign: "center",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
};

const resultEmojiStyle: React.CSSProperties = {
  fontSize: "64px",
  marginBottom: "16px",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#ff7a00",
  fontSize: "13px",
  fontWeight: "900",
  letterSpacing: "1.6px",
  marginBottom: "10px",
};

const resultTitleStyle: React.CSSProperties = {
  color: "#0b1730",
  fontSize: "clamp(34px, 6vw, 52px)",
  margin: "0 0 12px",
};

const resultDescriptionStyle: React.CSSProperties = {
  color: "#64748b",
  lineHeight: "1.6",
  margin: "0 auto 30px",
  maxWidth: "550px",
};

const resultGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  maxWidth: "500px",
  margin: "0 auto 28px",
};

const resultStatStyle: React.CSSProperties = {
  background: "#0b1730",
  color: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
};

const resultStatLabelStyle: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: "13px",
  marginBottom: "7px",
};

const resultStatValueStyle: React.CSSProperties = {
  fontSize: "25px",
  fontWeight: "850",
};

const resultActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "center",
};
