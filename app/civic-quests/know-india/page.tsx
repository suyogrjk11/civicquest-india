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
    language: string;
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
    language: "Language",
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
    language: "भाषा",
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
    language: "भाषा",
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
  const { language, setLanguage } = useLanguage();
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
        console.error("Error saving KrutBharat progress:", error);
      }
    } catch (error) {
      console.error(
        "Unexpected error while saving KrutBharat progress:",
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

  const answeredCount = Object.keys(answers).length;
  const isCorrect = answers[current] === question.correctAnswer;
  const progress = ((current + 1) / questions.length) * 100;

  if (finished) {
    const xp = score * knowIndiaQuest.xpPerQuestion;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="kf-q-page">
        <div className="kf-q-shell">
          <header className="kf-q-topbar">
            <button
              type="button"
              onClick={() => router.push("/civic-quests")}
              className="kf-q-back"
            >
              <span>←</span>
              {text.questLibrary}
            </button>

            <Brand />

            <LanguageControl
              language={language}
              setLanguage={setLanguage}
              label={text.language}
            />
          </header>

          <section className="kf-q-result">
            <div className="kf-q-result-orb kf-q-result-orb-blue" />
            <div className="kf-q-result-orb kf-q-result-orb-peach" />

            <div className="kf-q-result-content">
              <div className="kf-q-result-icon">
                {percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}
              </div>

              <div className="kf-q-eyebrow">QUEST COMPLETE</div>

              <h1>{text.complete}</h1>

              <p>
                {percentage >= 80 ? text.excellent : text.keepGoing}
              </p>

              <div className="kf-q-result-grid">
                <div className="kf-q-result-stat kf-q-result-blue">
                  <span>{text.score}</span>
                  <strong>{text.outOf(score, questions.length)}</strong>
                </div>

                <div className="kf-q-result-stat kf-q-result-peach">
                  <span>{text.xpEarned}</span>
                  <strong>+{xp} XP</strong>
                </div>
              </div>

              <div className="kf-q-actions">
                <button
                  type="button"
                  onClick={restart}
                  className="kf-q-primary"
                >
                  {text.tryAgain}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/civic-quests")}
                  className="kf-q-secondary"
                >
                  {text.questLibrary}
                </button>
              </div>
            </div>
          </section>

          <footer className="kf-q-footer">
            Krut<span>Bharat</span> · {text.questLibrary}
          </footer>
        </div>

        <QuestStyles />
      </main>
    );
  }

  return (
    <main className="kf-q-page">
      <div className="kf-q-shell">
        <header className="kf-q-topbar">
          <button
            type="button"
            onClick={() => router.push("/civic-quests")}
            className="kf-q-back"
          >
            <span>←</span>
            {text.back.replace("← ", "")}
          </button>

          <Brand />

          <LanguageControl
            language={language}
            setLanguage={setLanguage}
            label={text.language}
          />
        </header>

        <section className="kf-q-hero">
          <div className="kf-q-hero-orb kf-q-orb-blue" />
          <div className="kf-q-hero-orb kf-q-orb-peach" />

          <div className="kf-q-hero-content">
            <div className="kf-q-eyebrow">🇮🇳 KNOW INDIA QUEST</div>

            <div className="kf-q-hero-row">
              <div className="kf-q-hero-copy">
                <h1>{knowIndiaQuest.title[language]}</h1>
                <p>{knowIndiaQuest.description[language]}</p>
              </div>

              <div className="kf-q-xp-card">
                <div className="kf-q-xp-icon">⭐</div>
                <div>
                  <strong>+{knowIndiaQuest.xpPerQuestion}</strong>
                  <span>{text.xpCorrect}</span>
                </div>
              </div>
            </div>

            <div className="kf-q-progress-meta">
              <span>{text.questionOf(current + 1, questions.length)}</span>
              <span>
                {text.answered(answeredCount, questions.length)}
              </span>
            </div>

            <div className="kf-q-progress">
              <div
                className="kf-q-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="kf-q-question-card">
          <div className="kf-q-question-kicker">
            {language === "en"
              ? "YOUR QUESTION"
              : language === "hi"
                ? "आपका प्रश्न"
                : "तुमचा प्रश्न"}
          </div>

          <h2>{question.question[language]}</h2>

          <div className="kf-q-options">
            {options.map((option, index) => {
              const chosen = selected === index;
              const questionWasSubmitted = submitted;
              const correct =
                questionWasSubmitted && index === question.correctAnswer;
              const wrong =
                questionWasSubmitted &&
                chosen &&
                index !== question.correctAnswer;

              return (
                <button
                  key={option}
                  type="button"
                  disabled={submitted}
                  onClick={() => {
                    if (submitted) return;
                    setSelected(index);
                  }}
                  className={[
                    "kf-q-option",
                    chosen && !submitted ? "kf-q-option-selected" : "",
                    correct ? "kf-q-option-correct" : "",
                    wrong ? "kf-q-option-wrong" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="kf-q-option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="kf-q-option-text">{option}</span>
                  {correct && <span className="kf-q-option-marker">✓</span>}
                  {wrong && (
                    <span className="kf-q-option-marker kf-q-option-marker-wrong">
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selected === null && (
            <div className="kf-q-hint">{text.selectAnswer}</div>
          )}

          {submitted && (
            <div
              className={
                isCorrect
                  ? "kf-q-answer kf-q-answer-good"
                  : "kf-q-answer kf-q-answer-bad"
              }
            >
              <div className="kf-q-answer-head">
                <span>{isCorrect ? "✓" : "!"}</span>
                <strong>
                  {isCorrect ? text.correct : text.incorrect}
                </strong>
              </div>

              <div className="kf-q-explanation">
                <span>{text.explanation}</span>
                <p>{question.explanation[language]}</p>
              </div>
            </div>
          )}

          <div className="kf-q-controls">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={current === 0}
              className="kf-q-secondary"
            >
              {text.previous}
            </button>

            <button
              type="button"
              onClick={nextQuestion}
              disabled={selected === null || savingProgress}
              className="kf-q-primary"
            >
              {savingProgress
                ? language === "en"
                  ? "Saving…"
                  : language === "hi"
                    ? "सेव हो रहा है…"
                    : "सेव्ह होत आहे…"
                : !submitted
                  ? language === "en"
                    ? "Check Answer"
                    : language === "hi"
                      ? "उत्तर जाँचें"
                      : "उत्तर तपासा"
                  : current === questions.length - 1
                    ? text.finish
                    : text.next}
            </button>
          </div>
        </section>

        <footer className="kf-q-footer">
          Krut<span>Bharat</span> · {text.questLibrary}
        </footer>
      </div>

      <QuestStyles />
    </main>
  );
}

function Brand() {
  return (
    <div className="kf-q-brand-lockup">
      <div className="kf-q-brand-box">K</div>
      <div>
        <div className="kf-q-brand-name">
          Krut<span>Bharat</span>
        </div>
        <div className="kf-q-brand-caption">CIVIC LEARNING</div>
      </div>
    </div>
  );
}

function LanguageControl({
  language,
  setLanguage,
  label,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
  label: string;
}) {
  return (
    <label className="kf-q-language">
      <span>{label}</span>
      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value as Language)
        }
        aria-label={label}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="mr">मराठी</option>
      </select>
    </label>
  );
}

function QuestStyles() {
  return (
    <style>{`
      .kf-q-page {
        --kf-ivory: #f8f3ea;
        --kf-white: #fffdf9;
        --kf-navy: #102033;
        --kf-ink: #263447;
        --kf-body: #596a78;
        --kf-muted: #7b8790;
        --kf-orange: #ff7a00;
        --kf-blue: #eaf3f8;
        --kf-blue-line: #d4e4ed;
        --kf-peach: #fff0df;
        --kf-peach-line: #eed9c0;
        --kf-green: #eef6e7;
        --kf-green-line: #d5e5c9;
        --kf-lavender: #f4eff9;
        --kf-lavender-line: #dfd4ea;
        --kf-line: #ddd7ce;
        min-height: 100vh;
        padding: 20px 16px 72px;
        background:
          radial-gradient(circle at 92% 2%, rgba(215,232,242,.96) 0%, rgba(215,232,242,0) 25%),
          radial-gradient(circle at 5% 30%, rgba(231,242,248,.80) 0%, rgba(231,242,248,0) 24%),
          radial-gradient(circle at 90% 94%, rgba(255,229,205,.78) 0%, rgba(255,229,205,0) 25%),
          var(--kf-ivory);
        color: var(--kf-body);
        font-family: var(--font-body);
      }
      .kf-q-page *, .kf-q-page *::before, .kf-q-page *::after { box-sizing: border-box; }
      .kf-q-shell { width: min(980px, 100%); margin: 0 auto; }
      .kf-q-topbar {
        display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:16px;
        margin-bottom:16px; padding:12px 14px; border:1px solid var(--kf-line); border-radius:25px;
        background:rgba(255,253,249,.95); box-shadow:0 14px 36px rgba(16,27,43,.055); backdrop-filter:blur(16px);
      }
      .kf-q-back,.kf-q-primary,.kf-q-secondary{min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 14px;border-radius:999px;font-family:var(--font-body);font-size:11px;font-weight:900;cursor:pointer;}
      .kf-q-back{justify-self:start;border:1px solid #dad4cc;background:#fffdf9;color:#506171;}
      .kf-q-back span{color:var(--kf-orange);font-size:15px;}
      .kf-q-brand-lockup{display:flex;align-items:center;gap:10px;}
      .kf-q-brand-box{width:38px;height:38px;display:grid;place-items:center;border-radius:13px;background:var(--kf-orange);color:#fff;font-family:var(--font-display);font-size:21px;font-weight:800;box-shadow:0 8px 18px rgba(255,122,0,.17);}
      .kf-q-brand-name{color:var(--kf-navy);font-family:var(--font-display);font-size:23px;line-height:1;letter-spacing:-.045em;font-weight:800;}
      .kf-q-brand-name span,.kf-q-footer span{color:var(--kf-orange);}
      .kf-q-brand-caption{margin-top:3px;color:#8b938f;font-size:8px;line-height:1;letter-spacing:.16em;font-weight:900;}
      .kf-q-language{justify-self:end;display:inline-flex;align-items:center;gap:9px;color:#53636f;font-size:11px;font-weight:900;}
      .kf-q-language select{min-width:120px;padding:10px 13px;border:1px solid #d7d1c9;border-radius:999px;background:#fffdf9;color:#304154;font-family:var(--font-body);font-size:11px;font-weight:800;cursor:pointer;outline:none;}
      .kf-q-language select:focus{border-color:#e5ad76;box-shadow:0 0 0 4px rgba(255,122,0,.08);}
      .kf-q-hero,.kf-q-result{position:relative;overflow:hidden;margin-bottom:16px;padding:31px;border:1px solid var(--kf-line);border-radius:33px;background:radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),rgba(255,253,249,.97);box-shadow:0 18px 48px rgba(16,27,43,.06);}
      .kf-q-hero-orb,.kf-q-result-orb{position:absolute;border-radius:50%;pointer-events:none;}
      .kf-q-orb-blue,.kf-q-result-orb-blue{width:190px;height:190px;right:-80px;top:-85px;background:rgba(207,227,239,.58);}
      .kf-q-orb-peach,.kf-q-result-orb-peach{width:165px;height:105px;left:-50px;bottom:-55px;border-radius:55% 45% 0 0;background:rgba(255,229,206,.45);transform:rotate(7deg);}
      .kf-q-hero-content,.kf-q-result-content{position:relative;z-index:1;}
      .kf-q-eyebrow{color:#8d755e;font-size:9px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;}
      .kf-q-hero-row{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;margin-top:9px;}
      .kf-q-hero-copy{max-width:700px;}
      .kf-q-hero-copy h1{margin:0;color:var(--kf-navy);font-family:var(--font-display);font-size:clamp(44px,6vw,62px);line-height:.97;letter-spacing:-.05em;font-weight:800;}
      .kf-q-hero-copy p{margin:12px 0 0;color:#5a6c79;font-size:15px;line-height:1.72;}
      .kf-q-xp-card{min-width:132px;display:flex;align-items:center;gap:9px;padding:14px;border-radius:22px;background:var(--kf-peach);border:1px solid var(--kf-peach-line);}
      .kf-q-xp-icon{font-size:19px;}
      .kf-q-xp-card strong{display:block;color:#966b47;font-family:var(--font-display);font-size:23px;line-height:1;font-weight:800;}
      .kf-q-xp-card span{display:block;margin-top:3px;color:#977f69;font-size:8px;font-weight:900;}
      .kf-q-progress-meta{display:flex;justify-content:space-between;gap:12px;margin-top:23px;margin-bottom:8px;color:#77858f;font-size:9px;font-weight:900;}
      .kf-q-progress{height:9px;overflow:hidden;border:1px solid #e0e5e2;border-radius:999px;background:#edf0ed;}
      .kf-q-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#ff7a00 0%,#ff9e47 100%);}
      .kf-q-question-card{padding:28px;border:1px solid var(--kf-line);border-radius:30px;background:rgba(255,253,249,.97);box-shadow:0 16px 42px rgba(16,27,43,.055);}
      .kf-q-question-kicker{color:#77858d;font-size:9px;font-weight:900;letter-spacing:.17em;}
      .kf-q-question-card h2{margin:9px 0 23px;color:#263a4e;font-family:var(--font-display);font-size:clamp(28px,4.2vw,36px);line-height:1.18;letter-spacing:-.03em;font-weight:800;}
      .kf-q-options{display:grid;gap:10px;}
      .kf-q-option{width:100%;display:flex;align-items:center;gap:12px;padding:15px 16px;border:1px solid #ddd8d0;border-radius:20px;background:#fffdf9;color:#405365;font-family:var(--font-body);font-size:14px;line-height:1.55;text-align:left;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;}
      .kf-q-option:hover:not(:disabled){transform:translateY(-1px);border-color:#e3b17c;box-shadow:0 9px 22px rgba(16,27,43,.045);}
      .kf-q-option-selected{background:#fff2e5;border-color:#e6a66b;}
      .kf-q-option-correct{background:#eef6e7;border-color:#c7ddba;color:#536b3f;}
      .kf-q-option-wrong{background:#fff0ee;border-color:#e7c0bb;color:#9b6158;}
      .kf-q-option-letter{width:38px;height:38px;min-width:38px;display:grid;place-items:center;border-radius:13px;background:#f0f3f2;color:#586976;font-family:var(--font-display);font-size:15px;font-weight:800;}
      .kf-q-option-selected .kf-q-option-letter{background:#ffdec1;color:#a45f27;}
      .kf-q-option-correct .kf-q-option-letter{background:#dbead2;color:#5d7b4d;}
      .kf-q-option-wrong .kf-q-option-letter{background:#f3d9d5;color:#956058;}
      .kf-q-option-text{flex:1;}
      .kf-q-option-marker{font-size:18px;font-weight:900;}
      .kf-q-option-marker-wrong{color:#a65d55;}
      .kf-q-answer{margin-top:18px;padding:17px 18px;border-radius:19px;}
      .kf-q-answer-good{background:#eef6e7;border:1px solid #cadfbe;}
      .kf-q-answer-bad{background:#fff1ee;border:1px solid #e8c9c3;}
      .kf-q-answer-head{display:flex;align-items:center;gap:9px;color:#536b5a;font-size:16px;}
      .kf-q-answer-bad .kf-q-answer-head{color:#966159;}
      .kf-q-answer-head span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:#d9ead0;font-weight:900;}
      .kf-q-answer-bad .kf-q-answer-head span{background:#efd4cf;}
      .kf-q-explanation{margin-top:11px;padding-top:11px;border-top:1px solid rgba(16,27,43,.07);}
      .kf-q-explanation span{color:#718079;font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}
      .kf-q-explanation p{margin:5px 0 0;color:#52636d;font-size:13px;line-height:1.7;}
      .kf-q-controls{display:flex;justify-content:space-between;gap:12px;margin-top:23px;}
      .kf-q-primary{border:0;background:var(--kf-orange);color:#fff;box-shadow:0 9px 20px rgba(255,122,0,.16);}
      .kf-q-secondary{border:1px solid #dad4cc;background:#fffdf9;color:#536574;}
      .kf-q-primary:disabled,.kf-q-secondary:disabled{opacity:.45;cursor:not-allowed;}
      .kf-q-hint{margin-top:10px;color:#889399;font-size:10px;font-weight:700;text-align:right;}
      .kf-q-result{text-align:center;padding:44px 31px;min-height:520px;display:flex;align-items:center;justify-content:center;}
      .kf-q-result-icon{font-size:64px;line-height:1;margin-bottom:15px;}
      .kf-q-result h1{margin:8px 0 10px;color:var(--kf-navy);font-family:var(--font-display);font-size:clamp(38px,6vw,56px);line-height:1;letter-spacing:-.045em;font-weight:800;}
      .kf-q-result p{max-width:540px;margin:0 auto 28px;color:#64747d;font-size:14px;line-height:1.7;}
      .kf-q-result-grid{display:grid;grid-template-columns:repeat(2,minmax(0,190px));justify-content:center;gap:10px;margin-bottom:24px;}
      .kf-q-result-stat{padding:17px;border-radius:20px;text-align:left;border:1px solid;}
      .kf-q-result-stat span{display:block;font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}
      .kf-q-result-stat strong{display:block;margin-top:4px;color:#304457;font-family:var(--font-display);font-size:25px;line-height:1;font-weight:800;}
      .kf-q-result-blue{background:var(--kf-blue);border-color:var(--kf-blue-line);}
      .kf-q-result-peach{background:var(--kf-peach);border-color:var(--kf-peach-line);}
      .kf-q-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;}
      .kf-q-footer{padding:17px 4px 0;color:#899298;font-family:var(--font-display);font-size:12px;text-align:center;font-weight:700;}
      @media (max-width:700px){
        .kf-q-topbar{grid-template-columns:1fr auto;}
        .kf-q-brand-lockup{grid-column:1/-1;grid-row:1;justify-content:center;}
        .kf-q-back{grid-column:1;grid-row:2;}
        .kf-q-language{grid-column:2;grid-row:2;}
        .kf-q-hero-row{flex-direction:column;align-items:stretch;}
        .kf-q-xp-card{align-self:flex-start;}
        .kf-q-controls{flex-direction:column-reverse;}
        .kf-q-controls button{width:100%;}
        .kf-q-result-grid{grid-template-columns:1fr;max-width:360px;margin-left:auto;margin-right:auto;}
      }


/* =========================================================
   KRUTBHARAT — CIVIC QUEST / DARK MODE
   Shared visual system for Constitution, Governance,
   Elections and Know India quest screens.
   ========================================================= */

html[data-theme="dark"] .kf-q-page {
  --kf-ivory: #07111f;
  --kf-white: #f5f7fb;
  --kf-navy: #f5f7fb;
  --kf-ink: #e6edf7;
  --kf-body: #b7c7da;
  --kf-muted: #8192a8;
  --kf-orange: #ff7a00;

  --kf-blue: #10263a;
  --kf-blue-line: #254461;
  --kf-peach: #30251b;
  --kf-peach-line: #5d432c;
  --kf-green: #182c25;
  --kf-green-line: #2f5a48;
  --kf-lavender: #27233a;
  --kf-lavender-line: #49416a;
  --kf-line: #1f3048;

  min-height: 100vh;
  color-scheme: dark;
  color: var(--kf-body);
  background:
    radial-gradient(circle at 96% 1%, rgba(0,212,255,.12) 0%, rgba(0,212,255,0) 25%),
    radial-gradient(circle at 4% 24%, rgba(0,212,255,.065) 0%, rgba(0,212,255,0) 22%),
    radial-gradient(circle at 93% 94%, rgba(255,122,0,.09) 0%, rgba(255,122,0,0) 27%),
    #07111f;
}

html[data-theme="dark"] .kf-q-shell {
  position: relative;
}

/* ---------- TOPBAR ---------- */
html[data-theme="dark"] .kf-q-topbar {
  position: relative;
  overflow: visible;
  border: 1px solid transparent;
  background: rgba(4,10,20,.72);
  box-shadow:
    -10px 0 24px -8px rgba(0,212,255,.25),
     10px 0 24px -8px rgba(255,140,26,.25),
     0 12px 30px rgba(0,0,0,.34);
  backdrop-filter: blur(14px) saturate(125%);
}

html[data-theme="dark"] .kf-q-topbar::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background:
    linear-gradient(
      90deg,
      #00d4ff 0%,
      rgba(0,212,255,.55) 22%,
      rgba(31,68,96,.35) 42%,
      rgba(31,68,96,.20) 58%,
      rgba(255,140,26,.55) 78%,
      #ff8c1a 100%
    );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

html[data-theme="dark"] .kf-q-topbar::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      rgba(0,212,255,.10),
      transparent 32%,
      transparent 68%,
      rgba(255,140,26,.10)
    );
  filter: blur(10px);
  opacity: .34;
  pointer-events: none;
  z-index: -1;
}

html[data-theme="dark"] .kf-q-topbar > * {
  position: relative;
  z-index: 2;
}

html[data-theme="dark"] .kf-q-back {
  border-color: #263b55;
  background: #10243a;
  color: #edf3fa;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}

html[data-theme="dark"] .kf-q-back:hover {
  background: #142b45;
  border-color: #365776;
}

html[data-theme="dark"] .kf-q-brand-box {
  background: #ff7a00;
  color: #07111f;
  box-shadow:
    0 8px 20px rgba(255,122,0,.22),
    0 0 22px rgba(255,122,0,.08);
}

html[data-theme="dark"] .kf-q-brand-name {
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-q-brand-name span {
  color: #ff7a00;
}

html[data-theme="dark"] .kf-q-brand-caption {
  color: #7f91a8;
}

html[data-theme="dark"] .kf-q-language {
  color: #8293aa;
}

html[data-theme="dark"] .kf-q-language select {
  border-color: #29405a !important;
  background: #10243a !important;
  color: #f2f6fb !important;
}

html[data-theme="dark"] .kf-q-language select:focus {
  border-color: rgba(0,212,255,.55) !important;
  box-shadow: 0 0 0 4px rgba(0,212,255,.08) !important;
}

html[data-theme="dark"] .kf-q-language option {
  background: #10243a !important;
  color: #f5f7fb !important;
}

/* ---------- HERO / RESULT ---------- */
html[data-theme="dark"] .kf-q-hero,
html[data-theme="dark"] .kf-q-result {
  border-color: #21364e;
  background:
    radial-gradient(circle at 94% 0%, rgba(0,212,255,.14) 0%, rgba(0,212,255,0) 31%),
    radial-gradient(circle at 0% 100%, rgba(255,122,0,.12) 0%, rgba(255,122,0,0) 32%),
    linear-gradient(135deg, #0c1a2c 0%, #0d1d31 53%, #10283d 100%);
  box-shadow:
    0 20px 50px rgba(0,0,0,.25),
    inset 0 1px 0 rgba(255,255,255,.015);
}

html[data-theme="dark"] .kf-q-hero-orb,
html[data-theme="dark"] .kf-q-result-orb {
  opacity: 1;
}

html[data-theme="dark"] .kf-q-orb-blue,
html[data-theme="dark"] .kf-q-result-orb-blue {
  background: rgba(0,212,255,.095);
  box-shadow: 0 0 90px rgba(0,212,255,.10);
}

html[data-theme="dark"] .kf-q-orb-peach,
html[data-theme="dark"] .kf-q-result-orb-peach {
  background: rgba(255,122,0,.095);
  box-shadow: 0 0 80px rgba(255,122,0,.08);
}

html[data-theme="dark"] .kf-q-eyebrow {
  color: #ff9a47;
}

html[data-theme="dark"] .kf-q-hero-copy h1,
html[data-theme="dark"] .kf-q-result h1 {
  color: #f5f7fb;
  text-shadow: 0 4px 24px rgba(0,0,0,.16);
}

html[data-theme="dark"] .kf-q-hero-copy p,
html[data-theme="dark"] .kf-q-result-content > p {
  color: #b7c7da;
}

html[data-theme="dark"] .kf-q-xp-card {
  background: linear-gradient(145deg, #38291d, #30251b);
  border-color: #65472e;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.02);
}

html[data-theme="dark"] .kf-q-xp-card strong {
  color: #ffb071;
}

html[data-theme="dark"] .kf-q-xp-card span {
  color: #bd9a7b;
}

/* Progress */
html[data-theme="dark"] .kf-q-progress-meta {
  color: #8195ad;
}

html[data-theme="dark"] .kf-q-progress {
  border-color: #27415d;
  background: #0a1a2c;
}

html[data-theme="dark"] .kf-q-progress-fill {
  background: linear-gradient(90deg, #ff7a00 0%, #ff9a3d 54%, #ffd09c 100%);
  box-shadow: 0 0 16px rgba(255,122,0,.15);
}

/* ---------- QUESTION CARD ---------- */
html[data-theme="dark"] .kf-q-question-card {
  border-color: #1f3048;
  background: linear-gradient(180deg, #0d1d31 0%, #0c1a2c 100%);
  box-shadow:
    0 18px 45px rgba(0,0,0,.24),
    inset 0 1px 0 rgba(255,255,255,.015);
}

html[data-theme="dark"] .kf-q-question-kicker {
  color: #8297b0;
}

html[data-theme="dark"] .kf-q-question-card h2 {
  color: #f4f7fb;
}

/* ---------- ANSWER OPTIONS ---------- */
html[data-theme="dark"] .kf-q-option {
  border-color: #29415b;
  background: #10243a;
  color: #d7e1ec;
  box-shadow: none;
}

html[data-theme="dark"] .kf-q-option:hover:not(:disabled) {
  border-color: #3d607f;
  background: #132b43;
  box-shadow:
    0 8px 20px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.02);
}

html[data-theme="dark"] .kf-q-option-selected {
  background: #30251b;
  border-color: #b96f25;
  color: #f7e7d8;
  box-shadow: 0 0 0 1px rgba(255,122,0,.05) inset;
}

html[data-theme="dark"] .kf-q-option-correct {
  background: #182c25;
  border-color: #376c53;
  color: #bde7d0;
}

html[data-theme="dark"] .kf-q-option-wrong {
  background: #321f23;
  border-color: #713f45;
  color: #efb7be;
}

html[data-theme="dark"] .kf-q-option-letter {
  background: #0b1b2d;
  border-color: #2a425e;
  color: #90a4bb;
}

html[data-theme="dark"] .kf-q-option-selected .kf-q-option-letter {
  background: #4a2d18;
  border-color: #a86323;
  color: #ffb071;
}

html[data-theme="dark"] .kf-q-option-correct .kf-q-option-letter {
  background: #204535;
  border-color: #3e775c;
  color: #9fe0bd;
}

html[data-theme="dark"] .kf-q-option-wrong .kf-q-option-letter {
  background: #4b282f;
  border-color: #7d4850;
  color: #f2b8bf;
}

html[data-theme="dark"] .kf-q-option-marker {
  background: #224b3a;
  color: #9fe0bd;
}

html[data-theme="dark"] .kf-q-option-marker-wrong {
  background: #4b282f;
  color: #f2b8bf;
}

/* ---------- FEEDBACK / EXPLANATION ---------- */
html[data-theme="dark"] .kf-q-answer-good {
  background: #182c25;
  border-color: #376c53;
}

html[data-theme="dark"] .kf-q-answer-bad {
  background: #321f23;
  border-color: #713f45;
}

html[data-theme="dark"] .kf-q-answer-head,
html[data-theme="dark"] .kf-q-answer-good .kf-q-answer-head {
  color: #bfe8d1;
}

html[data-theme="dark"] .kf-q-answer-bad .kf-q-answer-head {
  color: #f0bbc2;
}

html[data-theme="dark"] .kf-q-answer-head span {
  background: rgba(7,17,31,.58);
}

html[data-theme="dark"] .kf-q-explanation {
  border-top-color: rgba(255,255,255,.08);
}

html[data-theme="dark"] .kf-q-explanation > span {
  color: #8fa1b6;
}

html[data-theme="dark"] .kf-q-explanation p {
  color: #b8c6d8;
}

/* ---------- CONTROLS ---------- */
html[data-theme="dark"] .kf-q-primary {
  background: #ff7a00;
  color: #07111f;
  box-shadow:
    0 10px 24px rgba(255,122,0,.18),
    0 0 0 1px rgba(255,255,255,.03) inset;
}

html[data-theme="dark"] .kf-q-primary:hover:not(:disabled) {
  background: #ff8c2b;
}

html[data-theme="dark"] .kf-q-secondary {
  border-color: #29415b;
  background: #10243a;
  color: #dce6f0;
}

html[data-theme="dark"] .kf-q-secondary:hover:not(:disabled) {
  border-color: #3c5b78;
  background: #132b43;
}

html[data-theme="dark"] .kf-q-primary:disabled,
html[data-theme="dark"] .kf-q-secondary:disabled {
  opacity: .43;
}

html[data-theme="dark"] .kf-q-hint {
  color: #72869d;
}

/* ---------- RESULT STATS ---------- */
html[data-theme="dark"] .kf-q-result-grid .kf-q-result-blue {
  background: linear-gradient(145deg, #102a40, #10263a);
  border-color: #2b506c;
}

html[data-theme="dark"] .kf-q-result-grid .kf-q-result-peach {
  background: linear-gradient(145deg, #38291d, #30251b);
  border-color: #65472e;
}

html[data-theme="dark"] .kf-q-result-stat span {
  color: #8fa0b3;
}

html[data-theme="dark"] .kf-q-result-stat strong {
  color: #f3f6fb;
}

/* ---------- LOADING ---------- */
html[data-theme="dark"] .kf-q-loading {
  min-height: 100vh;
  background: #07111f;
}

html[data-theme="dark"] .kf-q-loading-card {
  border-color: #1f3048;
  background: linear-gradient(145deg, #0d1d31, #10243a);
  box-shadow: 0 20px 56px rgba(0,0,0,.28);
}

html[data-theme="dark"] .kf-q-brand {
  color: #f5f7fb;
}

html[data-theme="dark"] .kf-q-brand span {
  color: #ff7a00;
}

html[data-theme="dark"] .kf-q-loading-card p {
  color: #8fa1b6;
}

html[data-theme="dark"] .kf-q-footer {
  color: #657991;
}

html[data-theme="dark"] .kf-q-footer span {
  color: #ff7a00;
}

/* Kill accidental light inline blocks without affecting semantic colors */
html[data-theme="dark"] .kf-q-page [style*="background: #fff"],
html[data-theme="dark"] .kf-q-page [style*="background: #f"],
html[data-theme="dark"] .kf-q-page [style*="background: rgba(255"] {
  background-color: #10243a !important;
}

@media (max-width: 760px) {
  html[data-theme="dark"] .kf-q-page {
    background:
      radial-gradient(circle at 96% 1%, rgba(0,212,255,.11) 0%, rgba(0,212,255,0) 34%),
      radial-gradient(circle at 8% 90%, rgba(255,122,0,.08) 0%, rgba(255,122,0,0) 30%),
      #07111f;
  }
}

    `}</style>
  );
}
