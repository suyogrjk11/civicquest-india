"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

const content = {
  en: {
    signupTitle: "Create your KarmaFacie account",
    signinTitle: "Welcome back to KarmaFacie",

    email: "Email",
    emailPlaceholder: "you@example.com",

    password: "Password",
    passwordPlaceholder: "Enter your password",

    wait: "Please wait...",
    createAccount: "Create Account",
    signIn: "Sign In",

    accountCreated:
      "Account created! Please check your email to confirm your account.",

    alreadyAccount: "Already have an account?",
    noAccount: "Don't have an account?",

    signInLink: "Sign in",
    createOne: "Create one",

    backHome: "Back to home",
    newToKarmaFacie: "New to KarmaFacie?",
    readyToLearn: "Learn. Understand. Participate.",
    supportingText:
      "A simpler way to understand India, discover your civic role and participate meaningfully.",
  },

  hi: {
    signupTitle: "अपना KarmaFacie अकाउंट बनाएं",
    signinTitle: "KarmaFacie में आपका स्वागत है",

    email: "ईमेल",
    emailPlaceholder: "you@example.com",

    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",

    wait: "कृपया प्रतीक्षा करें...",
    createAccount: "अकाउंट बनाएं",
    signIn: "साइन इन करें",

    accountCreated:
      "अकाउंट बन गया है! कृपया अपने ईमेल की जाँच करके अपना अकाउंट कन्फर्म करें।",

    alreadyAccount: "क्या आपके पास पहले से अकाउंट है?",
    noAccount: "क्या आपका कोई अकाउंट नहीं है?",

    signInLink: "साइन इन करें",
    createOne: "अकाउंट बनाएं",

    backHome: "होम पर वापस जाएं",
    newToKarmaFacie: "KarmaFacie पर नए हैं?",
    readyToLearn: "जानें। समझें। भाग लें।",
    supportingText:
      "भारत को समझने, अपनी नागरिक भूमिका जानने और सार्थक भागीदारी करने का एक सरल तरीका।",
  },

  mr: {
    signupTitle: "तुमचे KarmaFacie अकाउंट तयार करा",
    signinTitle: "KarmaFacie मध्ये तुमचे स्वागत आहे",

    email: "ईमेल",
    emailPlaceholder: "you@example.com",

    password: "पासवर्ड",
    passwordPlaceholder: "तुमचा पासवर्ड टाका",

    wait: "कृपया प्रतीक्षा करा...",
    createAccount: "अकाउंट तयार करा",
    signIn: "साइन इन करा",

    accountCreated:
      "अकाउंट तयार झाले आहे! तुमच्या ईमेलमध्ये जाऊन तुमचे अकाउंट कन्फर्म करा.",

    alreadyAccount: "तुमचे अकाउंट आधीपासून आहे का?",
    noAccount: "तुमचे अकाउंट नाही का?",

    signInLink: "साइन इन करा",
    createOne: "अकाउंट तयार करा",

    backHome: "होमवर परत जा",
    newToKarmaFacie: "KarmaFacie वर नवीन आहात?",
    readyToLearn: "शिका. समजून घ्या. सहभागी व्हा.",
    supportingText:
      "भारत समजून घेण्यासाठी, तुमची नागरिक म्हणून भूमिका जाणून घेण्यासाठी आणि अर्थपूर्ण सहभागासाठी एक सोपा मार्ग.",
  },
};

export default function AuthPage() {
  const supabase = createClient();
  const { language } = useLanguage();

  const text = content[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAuth() {
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(text.accountCreated);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    }

    setLoading(false);
  }

  return (
    <main className="kf-page min-h-screen px-5 py-6 md:px-8 md:py-8">
      {/* ==================================================
          TOP BAR
         ================================================== */}

      <div className="kf-container">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="kf-brand text-2xl md:text-3xl"
            aria-label="KarmaFacie home"
          >
            Karma
            <span className="kf-brand-accent">Facie</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            ← {text.backHome}
          </button>
        </div>
      </div>

      {/* ==================================================
          AUTH AREA
         ================================================== */}

      <section className="kf-container flex min-h-[calc(100vh-120px)] items-center justify-center py-10 md:py-14">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-black/10 bg-white/75 shadow-[0_30px_90px_rgba(16,24,40,0.12)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          {/* ==================================================
              VISUAL PANEL
             ================================================== */}

          <div className="relative hidden min-h-[620px] overflow-hidden bg-[#101828] lg:block">
            <img
              src="/images/kf-hero.jpg"
              alt="India Gate at sunrise"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-[#101828]/25 to-transparent" />

            <div className="absolute left-8 right-8 top-8">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                🇮🇳 Built for citizens of India
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
                KarmaFacie
              </p>

              <h2 className="kf-display max-w-md text-5xl leading-[0.98] text-white xl:text-6xl">
                {text.readyToLearn}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                {text.supportingText}
              </p>
            </div>
          </div>

          {/* ==================================================
              FORM PANEL
             ================================================== */}

          <div className="relative flex items-center justify-center overflow-hidden p-7 sm:p-10 md:p-12 lg:p-14">
            {/* Decorative shapes */}

            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-200/35 blur-2xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-sky-100/70 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-md">
              {/* Brand mark */}

              <div className="mb-8">
                <div className="mb-4 inline-flex rounded-2xl bg-orange-50 px-3 py-2 text-sm">
                  ✦
                </div>

                <h1 className="kf-display text-4xl leading-tight text-slate-900 md:text-5xl">
                  {isSignUp
                    ? text.signupTitle
                    : text.signinTitle}
                </h1>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {isSignUp
                    ? text.supportingText
                    : "Continue your journey from knowledge to meaningful civic participation."}
                </p>
              </div>

              {/* ==================================================
                  FORM
                 ================================================== */}

              <div className="space-y-5">
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    {text.email}
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.emailPlaceholder}
                    autoComplete={isSignUp ? "email" : "username"}
                    className="kf-input"
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    {text.password}
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={text.passwordPlaceholder}
                    autoComplete={
                      isSignUp
                        ? "new-password"
                        : "current-password"
                    }
                    className="kf-input"
                  />
                </div>

                {/* AUTH BUTTON */}

                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={loading}
                  className={`kf-button-primary w-full ${
                    loading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {loading
                    ? text.wait
                    : isSignUp
                      ? text.createAccount
                      : text.signIn}
                </button>

                {/* MESSAGE */}

                {message && (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
                    {message}
                  </div>
                )}
              </div>

              {/* ==================================================
                  MODE SWITCH
                 ================================================== */}

              <div className="mt-7 text-center text-sm text-slate-500">
                {isSignUp
                  ? text.alreadyAccount
                  : text.noAccount}

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setMessage("");
                  }}
                  className="ml-2 font-bold text-orange-600 transition hover:text-orange-500"
                >
                  {isSignUp
                    ? text.signInLink
                    : text.createOne}
                </button>
              </div>

              {/* Bottom note */}

              <div className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                <span className="h-px w-8 bg-slate-200" />
                <span>KarmaFacie</span>
                <span className="h-px w-8 bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}