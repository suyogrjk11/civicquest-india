"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

import { useLanguage } from "@/components/LanguageProvider";
import { languages, type Language } from "@/lib/i18n";

const content = {

  en: {

    signupTitle: "Create your KrutBharat account",

    signinBeforeBrand: "Welcome back to ",
    signinAfterBrand: "",

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

    newToKrutBharat: "New to KrutBharat?",

    readyToLearn: "Learn. Understand.",

    participate: "Participate.",

    supportingText:

      "A simpler way to understand India, discover your civic role and participate meaningfully.",

  },

  hi: {

    signupTitle: "अपना KrutBharat अकाउंट बनाएं",

    signinBeforeBrand: "",
    signinAfterBrand: " में आपका स्वागत है",

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

    newToKrutBharat: "KrutBharat पर नए हैं?",

    readyToLearn: "जानें। समझें।",

    participate: "भाग लें।",

    supportingText:

      "भारत को समझने, अपनी नागरिक भूमिका जानने और सार्थक भागीदारी करने का एक सरल तरीका।",

  },

  mr: {

    signupTitle: "तुमचे KrutBharat अकाउंट तयार करा",

    signinBeforeBrand: "",
    signinAfterBrand: " मध्ये तुमचे स्वागत आहे",

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

    newToKrutBharat: "KrutBharat वर नवीन आहात?",

    readyToLearn: "शिका. समजून घ्या.",

    participate: "सहभागी व्हा.",

    supportingText:

      "भारत समजून घेण्यासाठी, तुमची नागरिक म्हणून भूमिका जाणून घेण्यासाठी आणि अर्थपूर्ण सहभागासाठी एक सोपा मार्ग.",

  },

};

export default function AuthPage() {

  const supabase = createClient();

  const { language, setLanguage } = useLanguage();

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

        window.location.replace("/dashboard");

      }

    }

    setLoading(false);

  }

  return (

    <main

      className="kf-auth-page min-h-screen px-5 py-6 md:px-8 md:py-8"

      style={{

        background:

          "radial-gradient(circle at 8% 8%, rgba(213,232,246,0.55), transparent 28%), radial-gradient(circle at 92% 10%, rgba(255,218,180,0.48), transparent 26%), #F7F1E5",

        color: "#102033",

      }}

    >

      {/* ==================================================

          TOP BAR

         ================================================== */}

      <div className="kf-auth-topbar mx-auto w-full max-w-[1280px]">

        <div className="flex items-center justify-between">

          <button

            type="button"

            onClick={() => {

              window.location.href = "/";

            }}

            className="kf-glass-logo shrink-0 rounded-xl px-2 py-1 text-left text-[21px] font-black tracking-[-0.045em] text-[#102033] transition hover:bg-white/45 sm:px-2.5 sm:text-[23px]"

            style={{ fontFamily: "var(--font-display)" }}

            aria-label="KrutBharat home"

          >

            Krut<span className="text-[#ff7a00]">Bharat</span>

          </button>
          <div className="flex items-center gap-2.5">
            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              aria-label="Select language"
              className="kf-auth-language rounded-full border border-[#d8d1c7] bg-white/70 px-4 py-2.5 text-[12px] font-bold text-[#102033] shadow-[0_8px_24px_rgba(16,32,51,0.06)] backdrop-blur-xl outline-none transition hover:bg-white"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.nativeLabel}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="kf-auth-back rounded-full border border-[#d8d1c7] bg-white/70 px-4 py-2.5 text-[12px] font-bold text-[#102033] shadow-[0_8px_24px_rgba(16,32,51,0.06)] backdrop-blur-xl transition hover:bg-white"
            >
              ← {text.backHome}
            </button>
          </div>

        </div>

      </div>

      {/* ==================================================

          AUTH AREA

         ================================================== */}

      <section className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[1280px] items-center justify-center py-10 md:py-14">

        <div className="kf-auth-shell grid w-full max-w-[1180px] overflow-hidden rounded-[34px] border border-white/80 bg-white/78 shadow-[0_30px_90px_rgba(16,32,51,0.12)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">

          {/* ==================================================

              VISUAL PANEL

             ================================================== */}

          <div className="kf-auth-visual relative hidden min-h-[620px] overflow-hidden bg-[#101828] lg:block">

            <img

              src="/images/kf-hero.jpg"

              alt="India Gate at sunrise"

              className="absolute inset-0 h-full w-full object-cover"

            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102033]/85 via-[#102033]/18 to-transparent" />

            <div className="absolute left-8 right-8 top-8">

              <div className="inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-2 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">

                🇮🇳 Built for citizens of India

              </div>

            </div>

            <div className="absolute bottom-8 left-8 right-8">

              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#ffb26f]">

                KrutBharat

              </p>

              <h2 className="max-w-md text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] text-white xl:text-[50px]">

                {text.readyToLearn}

                <br />

                <span className="text-[#ff7a00]">{text.participate}</span>

              </h2>

              <p className="mt-5 max-w-md text-[13px] leading-6 text-white/78">

                {text.supportingText}

              </p>

            </div>

          </div>

          {/* ==================================================

              FORM PANEL

             ================================================== */}

          <div className="kf-auth-form relative flex items-center justify-center overflow-hidden bg-white/72 p-7 sm:p-10 md:p-12 lg:p-14">

            {/* Decorative shapes */}

            <div

              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffd8b5]/45 blur-3xl"

              aria-hidden="true"

            />

            <div

              className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-[#dceefa]/75 blur-3xl"

              aria-hidden="true"

            />

            <div className="relative z-10 w-full max-w-[430px]">

              {/* Brand mark */}

              <div className="mb-7">

                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffe0c4] bg-[#fff5ea] text-[15px] text-[#ff7a00] shadow-sm">

                  ✦

                </div>

                <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-[#102033] md:text-[39px]">
                  {isSignUp ? (
                    text.signupTitle
                  ) : (
                    <>
                      {text.signinBeforeBrand}
                      <span>Krut</span>
                      <span className="text-[#ff7a00]">Bharat</span>
                      {text.signinAfterBrand}
                    </>
                  )}
                </h1>

                <p className="mt-3 max-w-[390px] text-[13px] leading-6 text-[#718095]">

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

                    className="mb-2 block text-[12px] font-bold tracking-[0.01em] text-[#24364a]"

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

                    className="w-full rounded-[15px] border border-[#dfe3e8] bg-white/85 px-4 py-3.5 text-[14px] text-[#102033] outline-none shadow-[0_5px_18px_rgba(16,32,51,0.035)] placeholder:text-[#a1aab5] transition focus:border-[#ffb36f] focus:ring-4 focus:ring-[#ffb36f]/12"

                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label

                    htmlFor="password"

                    className="mb-2 block text-[12px] font-bold tracking-[0.01em] text-[#24364a]"

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

                    className="w-full rounded-[15px] border border-[#dfe3e8] bg-white/85 px-4 py-3.5 text-[14px] text-[#102033] outline-none shadow-[0_5px_18px_rgba(16,32,51,0.035)] placeholder:text-[#a1aab5] transition focus:border-[#ffb36f] focus:ring-4 focus:ring-[#ffb36f]/12"

                  />

                </div>

                {/* AUTH BUTTON */}

                <button

                  type="button"

                  onClick={handleAuth}

                  disabled={loading}

                  className={`w-full rounded-[15px] bg-[#ff7a00] px-5 py-3.5 text-[13px] font-black text-white shadow-[0_12px_26px_rgba(255,122,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ef6c00] hover:shadow-[0_16px_32px_rgba(255,122,0,0.22)] ${

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

                  <div className="rounded-2xl border border-[#ffd8b5] bg-[#fff7ee] px-4 py-3 text-[12px] leading-6 text-[#5d6670]">

                    {message}

                  </div>

                )}

              </div>

              {/* ==================================================

                  MODE SWITCH

                 ================================================== */}

              <div className="mt-7 text-center text-[12px] text-[#7b8794]">

                {isSignUp

                  ? text.alreadyAccount

                  : text.noAccount}

                <button

                  type="button"

                  onClick={() => {

                    setIsSignUp(!isSignUp);

                    setMessage("");

                  }}

                  className="ml-2 font-black text-[#ff7a00] transition hover:text-[#e96800]"

                >

                  {isSignUp

                    ? text.signInLink

                    : text.createOne}

                </button>

              </div>

              {/* Bottom note */}

              <div className="mt-9 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#a1a9b1]">

                <span className="h-px w-8 bg-slate-200" />

                <span>KrutBharat</span>

                <span className="h-px w-8 bg-slate-200" />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="kf-dashboard-footer">
        <div className="kf-dashboard-footer-inner">
          <div
            className="kf-dashboard-footer-brand"
            aria-label="KrutBharat"
          >
            <span className="kf-dashboard-footer-karma">Krut</span>
            <span className="kf-dashboard-footer-facie">Bharat</span>
          </div>

          <div className="kf-dashboard-footer-tagline">
            Know India. Think Civic. Shape Its Future.
          </div>

          <div className="kf-dashboard-footer-context">
            © 2026 KrutBharat <span aria-hidden="true">·</span> by KarmaFacie Corporation
          </div>
        </div>
      </footer>

      <style>{`
        .kf-dashboard-footer {
          width: 100%;
          margin-top: 72px;
          border-top: 1px solid #ece7df;
          background: #fffaf2;
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
          color: #6f7d8d;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .01em;
          text-align: center;
        }

        .kf-dashboard-footer-context {
          color: #7d8794;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .20em;
          text-transform: uppercase;
          text-align: center;
        }

        .kf-dashboard-footer-context span {
          color: #ff7a00;
          margin: 0 .35em;
        }

        .kf-auth-language {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          padding-right: 30px;
          background-image:
            linear-gradient(45deg, transparent 50%, #7d8794 50%),
            linear-gradient(135deg, #7d8794 50%, transparent 50%);
          background-position:
            calc(100% - 15px) 50%,
            calc(100% - 10px) 50%;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        @media (min-width: 768px) {
          .kf-dashboard-footer {
            margin-top: 96px;
          }

          .kf-dashboard-footer-inner {
            flex-direction: row;
            align-items: center;
            text-align: left;
          }

          .kf-dashboard-footer-tagline {
            text-align: center;
          }

          .kf-dashboard-footer-context {
            text-align: right;
            white-space: nowrap;
          }
        }

        @media (max-width: 640px) {
          .kf-auth-topbar > div {
            gap: 10px;
          }

          .kf-auth-language,
          .kf-auth-back {
            padding-left: 12px;
            padding-right: 12px;
          }

          .kf-dashboard-footer-inner {
            padding: 32px 20px;
          }

          .kf-dashboard-footer-context {
            white-space: normal;
          }
        }

        html[data-theme="dark"] .kf-dashboard-footer {
          border-top-color: #1e3043;
          background: #091726;
        }

        html[data-theme="dark"] .kf-dashboard-footer-karma {
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-dashboard-footer-tagline {
          color: #a8b6c7;
        }

        html[data-theme="dark"] .kf-dashboard-footer-context {
          color: #7f91a5;
        }

        html[data-theme="dark"] .kf-auth-language {
          border-color: rgba(255,255,255,0.16);
          background-color: rgba(15,23,42,0.72);
          color: #f5f7fb;
        }

        html[data-theme="dark"] .kf-auth-language option {
          background: #0f172a;
          color: #f5f7fb;
        }
      `}</style>

    </main>

  );
}
