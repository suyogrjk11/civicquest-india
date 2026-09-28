
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { electionsQuest } from "@/lib/elections-quest";
import { createClient } from "@/lib/supabase/client";

const QUEST_ID = "elections";

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

export default function ElectionsQuestPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const text = ui[language];
  const supabase = createClient();
  const questions = electionsQuest.questions;

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
      const xpEarned = score * electionsQuest.xpPerQuestion;

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

  if (loadingProgress) {
    return (
      <main className="kf-q-page kf-q-loading">
        <div className="kf-q-loading-card">
          <div className="kf-q-brand">
            Karma<span>Facie</span>
          </div>
          <div className="kf-q-loading-bar" />
          <p>{text.loading}</p>
        </div>
        <QuestStyles />
      </main>
    );
  }

  const question = questions[current];
  const options = question.options[language];
  const answeredCount = Object.keys(answers).length;
  const score = calculateScore(answers);
  const isCorrect = selected === question.correctAnswer;
  const progress = ((current + 1) / questions.length) * 100;

  if (finished) {
    const xp = score * electionsQuest.xpPerQuestion;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="kf-q-page">
        <div className="kf-q-shell">
          <header className="kf-q-topbar">
            <button type="button" onClick={() => router.push("/civic-quests")} className="kf-q-back">
              <span>←</span>
              {text.questLibrary}
            </button>
            <Brand />
            <LanguageControl language={language} setLanguage={setLanguage} label={language === "en" ? "Language" : language === "hi" ? "भाषा" : "भाषा"} />
          </header>

          <section className="kf-q-result">
            <div className="kf-q-result-orb kf-q-result-orb-blue" />
            <div className="kf-q-result-orb kf-q-result-orb-peach" />
            <div className="kf-q-result-content">
              <div className="kf-q-result-icon">{percentage >= 80 ? "🏆" : percentage >= 50 ? "🎉" : "💪"}</div>
              <div className="kf-q-eyebrow">QUEST COMPLETE</div>
              <h1>{text.complete}</h1>
              <p>{percentage >= 80 ? text.excellent : text.keepGoing}</p>
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
                <button type="button" onClick={restart} className="kf-q-primary">{text.tryAgain}</button>
                <button type="button" onClick={() => router.push("/civic-quests")} className="kf-q-secondary">{text.questLibrary}</button>
              </div>
            </div>
          </section>
          <footer className="kf-q-footer">Karma<span>Facie</span> · {text.questLibrary}</footer>
        </div>
        <QuestStyles />
      </main>
    );
  }

  return (
    <main className="kf-q-page">
      <div className="kf-q-shell">
        <header className="kf-q-topbar">
          <button type="button" onClick={() => router.push("/civic-quests")} className="kf-q-back">
            <span>←</span>
            {text.back.replace("← ", "")}
          </button>
          <Brand />
          <LanguageControl language={language} setLanguage={setLanguage} label={language === "en" ? "Language" : language === "hi" ? "भाषा" : "भाषा"} />
        </header>

        <section className="kf-q-hero">
          <div className="kf-q-hero-orb kf-q-orb-blue" />
          <div className="kf-q-hero-orb kf-q-orb-peach" />
          <div className="kf-q-hero-content">
            <div className="kf-q-eyebrow">🗳️ ELECTIONS QUEST</div>
            <div className="kf-q-hero-row">
              <div className="kf-q-hero-copy">
                <h1>{electionsQuest.title[language]}</h1>
                <p>{electionsQuest.description[language]}</p>
              </div>
              <div className="kf-q-xp-card">
                <div className="kf-q-xp-icon">⭐</div>
                <div>
                  <strong>+{electionsQuest.xpPerQuestion}</strong>
                  <span>XP / correct</span>
                </div>
              </div>
            </div>
            <div className="kf-q-progress-meta">
              <span>{text.questionOf(current + 1, questions.length)}</span>
              <span>{answeredCount}/{questions.length} {language === "en" ? "answered" : language === "hi" ? "उत्तर दिए गए" : "उत्तरे दिली"}</span>
            </div>
            <div className="kf-q-progress"><div className="kf-q-progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </section>

        <section className="kf-q-question-card">
          <div className="kf-q-question-kicker">{language === "en" ? "YOUR QUESTION" : language === "hi" ? "आपका प्रश्न" : "तुमचा प्रश्न"}</div>
          <h2>{question.question[language]}</h2>
          <div className="kf-q-options">
            {options.map((option, index) => {
              const chosen = selected === index;
              const correct = submitted && index === question.correctAnswer;
              const wrong = submitted && chosen && index !== question.correctAnswer;
              return (
                <button key={`${index}-${option}`} type="button" disabled={submitted} onClick={() => !submitted && setSelected(index)} className={[
                  "kf-q-option",
                  chosen && !submitted ? "kf-q-option-selected" : "",
                  correct ? "kf-q-option-correct" : "",
                  wrong ? "kf-q-option-wrong" : "",
                ].filter(Boolean).join(" ")}>
                  <span className="kf-q-option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="kf-q-option-text">{option}</span>
                  {correct && <span className="kf-q-option-marker">✓</span>}
                  {wrong && <span className="kf-q-option-marker kf-q-option-marker-wrong">×</span>}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={isCorrect ? "kf-q-answer kf-q-answer-good" : "kf-q-answer kf-q-answer-bad"}>
              <div className="kf-q-answer-head">
                <span>{isCorrect ? "✓" : "!"}</span>
                <strong>{isCorrect ? text.correct : text.incorrect}</strong>
              </div>
              <div className="kf-q-explanation">
                <span>{text.explanation}</span>
                <p>{question.explanation[language]}</p>
              </div>
            </div>
          )}

          <div className="kf-q-controls">
            <button type="button" onClick={previousQuestion} disabled={current === 0} className="kf-q-secondary">{text.previous}</button>
            <button type="button" onClick={nextQuestion} disabled={selected === null || savingProgress} className="kf-q-primary">
              {savingProgress ? (language === "en" ? "Saving…" : language === "hi" ? "सेव हो रहा है…" : "सेव्ह होत आहे…") : !submitted ? (language === "en" ? "Check Answer" : language === "hi" ? "उत्तर जाँचें" : "उत्तर तपासा") : current === questions.length - 1 ? text.finish : text.next}
            </button>
          </div>
          {selected === null && <div className="kf-q-hint">{text.selectAnswer}</div>}
        </section>

        <footer className="kf-q-footer">Karma<span>Facie</span> · {text.questLibrary}</footer>
      </div>
      <QuestStyles />
    </main>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return <div className="kf-q-result-stat"><span>{label}</span><strong>{value}</strong></div>;
}

function Brand() {
  return (
    <div className="kf-q-brand-lockup">
      <div className="kf-q-brand-box">K</div>
      <div>
        <div className="kf-q-brand-name">
          Karma<span>Facie</span>
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

      .kf-q-page *,
      .kf-q-page *::before,
      .kf-q-page *::after {
        box-sizing: border-box;
      }

      .kf-q-shell {
        width: min(980px, 100%);
        margin: 0 auto;
      }

      .kf-q-topbar {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding: 12px 14px;
        border: 1px solid var(--kf-line);
        border-radius: 25px;
        background: rgba(255,253,249,.95);
        box-shadow: 0 14px 36px rgba(16,27,43,.055);
        backdrop-filter: blur(16px);
      }

      .kf-q-back,
      .kf-q-primary,
      .kf-q-secondary {
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        padding: 10px 14px;
        border-radius: 999px;
        font-family: var(--font-body);
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .kf-q-back {
        justify-self: start;
        border: 1px solid #dad4cc;
        background: #fffdf9;
        color: #506171;
      }

      .kf-q-back span {
        color: var(--kf-orange);
        font-size: 15px;
      }

      .kf-q-brand-lockup {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .kf-q-brand-box {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: var(--kf-orange);
        color: #fff;
        font-family: var(--font-display);
        font-size: 21px;
        font-weight: 800;
        box-shadow: 0 8px 18px rgba(255,122,0,.17);
      }

      .kf-q-brand-name {
        color: var(--kf-navy);
        font-family: var(--font-display);
        font-size: 23px;
        line-height: 1;
        letter-spacing: -.045em;
        font-weight: 800;
      }

      .kf-q-brand-name span {
        color: var(--kf-orange);
      }

      .kf-q-brand-caption {
        margin-top: 3px;
        color: #8b938f;
        font-size: 8px;
        line-height: 1;
        letter-spacing: .16em;
        font-weight: 900;
      }

      .kf-q-language {
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        color: #53636f;
        font-size: 11px;
        font-weight: 900;
      }

      .kf-q-language select {
        min-width: 120px;
        padding: 10px 13px;
        border: 1px solid #d7d1c9;
        border-radius: 999px;
        background: #fffdf9;
        color: #304154;
        font-family: var(--font-body);
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        outline: none;
      }

      .kf-q-language select:focus {
        border-color: #e5ad76;
        box-shadow: 0 0 0 4px rgba(255,122,0,.08);
      }

      .kf-q-hero,
      .kf-q-result {
        position: relative;
        overflow: hidden;
        margin-bottom: 16px;
        padding: 31px;
        border: 1px solid var(--kf-line);
        border-radius: 33px;
        background:
          radial-gradient(circle at 94% 0%, rgba(218,235,244,.98) 0%, rgba(218,235,244,0) 34%),
          radial-gradient(circle at 0% 100%, rgba(255,232,210,.90) 0%, rgba(255,232,210,0) 35%),
          rgba(255,253,249,.97);
        box-shadow: 0 18px 48px rgba(16,27,43,.06);
      }

      .kf-q-hero-orb,
      .kf-q-result-orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      .kf-q-orb-blue,
      .kf-q-result-orb-blue {
        width: 190px;
        height: 190px;
        right: -80px;
        top: -85px;
        background: rgba(207,227,239,.58);
      }

      .kf-q-orb-peach,
      .kf-q-result-orb-peach {
        width: 165px;
        height: 105px;
        left: -50px;
        bottom: -55px;
        border-radius: 55% 45% 0 0;
        background: rgba(255,229,206,.45);
        transform: rotate(7deg);
      }

      .kf-q-hero-content,
      .kf-q-result-content {
        position: relative;
        z-index: 1;
      }

      .kf-q-eyebrow {
        color: #8d755e;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .18em;
        text-transform: uppercase;
      }

      .kf-q-hero-row {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 22px;
        margin-top: 9px;
      }

      .kf-q-hero-copy {
        max-width: 700px;
      }

      .kf-q-hero-copy h1 {
        margin: 0;
        color: var(--kf-navy);
        font-family: var(--font-display);
        font-size: clamp(44px, 6vw, 62px);
        line-height: .97;
        letter-spacing: -.05em;
        font-weight: 800;
      }

      .kf-q-hero-copy p {
        margin: 12px 0 0;
        color: #5a6c79;
        font-size: 15px;
        line-height: 1.72;
      }

      .kf-q-xp-card {
        min-width: 132px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 14px;
        border-radius: 22px;
        background: var(--kf-peach);
        border: 1px solid var(--kf-peach-line);
      }

      .kf-q-xp-icon {
        font-size: 19px;
      }

      .kf-q-xp-card strong {
        display: block;
        color: #966b47;
        font-family: var(--font-display);
        font-size: 23px;
        line-height: 1;
        font-weight: 800;
      }

      .kf-q-xp-card span {
        display: block;
        margin-top: 3px;
        color: #977f69;
        font-size: 8px;
        font-weight: 900;
      }

      .kf-q-progress-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 23px;
        margin-bottom: 8px;
        color: #77858f;
        font-size: 9px;
        font-weight: 900;
      }

      .kf-q-progress {
        height: 9px;
        overflow: hidden;
        border: 1px solid #e0e5e2;
        border-radius: 999px;
        background: #edf0ed;
      }

      .kf-q-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #ff7a00 0%, #ff9e47 100%);
      }

      .kf-q-question-card {
        padding: 28px;
        border: 1px solid var(--kf-line);
        border-radius: 30px;
        background: rgba(255,253,249,.97);
        box-shadow: 0 16px 42px rgba(16,27,43,.055);
      }

      .kf-q-question-kicker {
        color: #77858d;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .17em;
      }

      .kf-q-question-card h2 {
        margin: 9px 0 23px;
        color: #263a4e;
        font-family: var(--font-display);
        font-size: clamp(28px, 4.2vw, 36px);
        line-height: 1.18;
        letter-spacing: -.03em;
        font-weight: 800;
      }

      .kf-q-options {
        display: grid;
        gap: 10px;
      }

      .kf-q-option {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px 16px;
        border: 1px solid #ddd8d0;
        border-radius: 20px;
        background: #fffdf9;
        color: #405365;
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.55;
        text-align: left;
        cursor: pointer;
        transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
      }

      .kf-q-option:hover:not(:disabled) {
        transform: translateY(-1px);
        border-color: #e3b17c;
        box-shadow: 0 9px 22px rgba(16,27,43,.045);
      }

      .kf-q-option-selected {
        background: #fff2e5;
        border-color: #e6a66b;
      }

      .kf-q-option-correct {
        background: #eef6e7;
        border-color: #c7ddba;
        color: #536b3f;
      }

      .kf-q-option-wrong {
        background: #fff0ed;
        border-color: #ecc9c0;
        color: #925b4d;
      }

      .kf-q-option-letter {
        width: 33px;
        height: 33px;
        display: grid;
        place-items: center;
        flex-shrink: 0;
        border-radius: 11px;
        background: #f1eee9;
        border: 1px solid #e2ddd5;
        color: #72808a;
        font-size: 11px;
        font-weight: 900;
      }

      .kf-q-option-selected .kf-q-option-letter {
        background: #ffe0c4;
        border-color: #eabd95;
        color: #996a45;
      }

      .kf-q-option-correct .kf-q-option-letter {
        background: #dcebcf;
        border-color: #c4dbb3;
        color: #5f7d44;
      }

      .kf-q-option-wrong .kf-q-option-letter {
        background: #ffddd7;
        border-color: #ecc3b9;
        color: #975c4d;
      }

      .kf-q-option-text {
        flex: 1;
      }

      .kf-q-option-marker {
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #deedcf;
        color: #5e7c44;
        font-size: 14px;
        font-weight: 900;
      }

      .kf-q-option-marker-wrong {
        background: #ffddd7;
        color: #965b4c;
      }

      .kf-q-answer {
        margin-top: 20px;
        padding: 17px;
        border-radius: 21px;
        border: 1px solid;
      }

      .kf-q-answer-good {
        background: var(--kf-green);
        border-color: var(--kf-green-line);
      }

      .kf-q-answer-bad {
        background: #fff0ed;
        border-color: #ecd0c8;
      }

      .kf-q-answer-head {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #34485a;
        font-size: 14px;
        font-weight: 900;
      }

      .kf-q-answer-good .kf-q-answer-head {
        color: #5f7947;
      }

      .kf-q-answer-bad .kf-q-answer-head {
        color: #955c4d;
      }

      .kf-q-answer-head span {
        width: 29px;
        height: 29px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: rgba(255,253,249,.8);
      }

      .kf-q-explanation {
        margin-top: 11px;
        padding-top: 11px;
        border-top: 1px solid rgba(16,27,43,.08);
      }

      .kf-q-explanation > span {
        color: #7d8990;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .13em;
        text-transform: uppercase;
      }

      .kf-q-explanation p {
        margin: 5px 0 0;
        color: #596b79;
        font-size: 13px;
        line-height: 1.7;
      }

      .kf-q-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 23px;
      }

      .kf-q-primary {
        border: 0;
        background: var(--kf-orange);
        color: #fff;
        box-shadow: 0 10px 22px rgba(255,122,0,.16);
      }

      .kf-q-primary:disabled {
        cursor: not-allowed;
        opacity: .45;
        box-shadow: none;
      }

      .kf-q-secondary {
        border: 1px solid #d7d1c9;
        background: #fffdf9;
        color: #506171;
      }

      .kf-q-secondary:disabled {
        cursor: default;
        opacity: .4;
      }

      .kf-q-hint {
        margin-top: 10px;
        color: #89939a;
        font-size: 9px;
        text-align: right;
      }

      .kf-q-result {
        min-height: 560px;
        display: grid;
        place-items: center;
        text-align: center;
      }

      .kf-q-result-icon {
        font-size: 64px;
        margin-bottom: 12px;
      }

      .kf-q-result h1 {
        margin: 6px 0 8px;
        color: #263a4e;
        font-family: var(--font-display);
        font-size: clamp(42px, 6vw, 60px);
        line-height: .98;
        letter-spacing: -.045em;
        font-weight: 800;
      }

      .kf-q-result-content > p {
        max-width: 600px;
        margin: 0 auto;
        color: #647680;
        font-size: 14px;
        line-height: 1.7;
      }

      .kf-q-result-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 11px;
        max-width: 520px;
        margin: 25px auto 19px;
      }

      .kf-q-result-stat {
        padding: 17px;
        border-radius: 22px;
        border: 1px solid;
      }

      .kf-q-result-blue {
        background: var(--kf-blue);
        border-color: var(--kf-blue-line);
      }

      .kf-q-result-peach {
        background: var(--kf-peach);
        border-color: var(--kf-peach-line);
      }

      .kf-q-result-stat span {
        display: block;
        color: #7d8991;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .11em;
        text-transform: uppercase;
      }

      .kf-q-result-stat strong {
        display: block;
        margin-top: 5px;
        color: #304457;
        font-family: var(--font-display);
        font-size: 24px;
        line-height: 1;
        font-weight: 800;
      }

      .kf-q-actions {
        display: flex;
        justify-content: center;
        gap: 9px;
        flex-wrap: wrap;
      }

      .kf-q-footer {
        padding: 17px 4px 0;
        color: #899298;
        font-family: var(--font-display);
        font-size: 12px;
        font-weight: 700;
        text-align: center;
      }

      .kf-q-footer span {
        color: var(--kf-orange);
      }

      .kf-q-loading {
        display: grid;
        place-items: center;
      }

      .kf-q-loading-card {
        width: min(450px,100%);
        padding: 35px 30px;
        border-radius: 31px;
        border: 1px solid var(--kf-line);
        background: rgba(255,253,249,.97);
        box-shadow: 0 20px 56px rgba(16,27,43,.08);
        text-align: center;
      }

      .kf-q-brand {
        color: var(--kf-navy);
        font-family: var(--font-display);
        font-size: 37px;
        line-height: 1;
        letter-spacing: -.05em;
        font-weight: 800;
      }

      .kf-q-brand span {
        color: var(--kf-orange);
      }

      .kf-q-loading-bar {
        width: 68px;
        height: 5px;
        margin: 15px auto;
        border-radius: 999px;
        background: var(--kf-orange);
      }

      .kf-q-loading-card p {
        margin: 0;
        color: #687985;
        font-size: 13px;
        font-weight: 700;
      }

      @media (max-width: 760px) {
        .kf-q-page {
          padding: 14px 11px 56px;
        }

        .kf-q-topbar {
          grid-template-columns: 1fr auto;
        }

        .kf-q-brand-lockup {
          grid-column: 1 / -1;
          grid-row: 1;
          justify-self: center;
        }

        .kf-q-back {
          grid-column: 1;
          grid-row: 2;
        }

        .kf-q-language {
          grid-column: 2;
          grid-row: 2;
        }

        .kf-q-brand-caption,
        .kf-q-language > span {
          display: none;
        }

        .kf-q-language select {
          min-width: 108px;
        }

        .kf-q-hero,
        .kf-q-question-card,
        .kf-q-result {
          padding: 23px 18px;
          border-radius: 27px;
        }

        .kf-q-hero-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .kf-q-hero-copy h1 {
          font-size: 45px;
        }

        .kf-q-hero-copy p {
          font-size: 14px;
        }

        .kf-q-question-card h2 {
          font-size: 28px;
        }

        .kf-q-option {
          padding: 13px;
        }

        .kf-q-controls {
          flex-direction: column-reverse;
        }

        .kf-q-controls .kf-q-primary,
        .kf-q-controls .kf-q-secondary {
          width: 100%;
        }

        .kf-q-result {
          min-height: 520px;
        }

        .kf-q-result-grid {
          grid-template-columns: 1fr;
        }

        .kf-q-result h1 {
          font-size: 44px;
        }
      }


/* =========================================================
   KARMAFACIE — CIVIC QUEST / DARK MODE
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

