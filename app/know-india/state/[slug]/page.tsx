"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getIndiaStateBySlug,
  INDIA_DATA_SOURCE,
  type IndiaState,
} from "@/lib/india-state-data";

const translations = {
  en: {
    back: "Back to Know India",
    state: "State",
    unionTerritory: "Union Territory",
    capital: "Capital",
    region: "Region",
    area: "Area",
    population2011: "2011 Census",
    languages: "Major Languages",
    about: "About this place",
    geography: "Geography",
    governance: "Governance",
    culture: "Culture",
    famousPlaces: "Famous Places",
    rivers: "Major Rivers",
    nationalParks: "National Parks",
    funFacts: "Fun Facts",
    formation: "Formation",
    civicQuest: "The KarmaFacie way",
    civicQuestText:
      "Explore the place, understand its identity, and learn how citizens interact with their local government and public institutions.",
    source: "Data sources",
    nationalPortal: "Government of India National Portal",
    census:
      "Office of the Registrar General & Census Commissioner, India — Census 2011",
    exploreLearning: "Explore Civic Learning",
    stateNotFound: "State not found",
    stateNotFoundText:
      "The requested state or Union Territory could not be found.",
  },

  hi: {
    back: "भारत जानें पर वापस जाएँ",
    state: "राज्य",
    unionTerritory: "केंद्र शासित प्रदेश",
    capital: "राजधानी",
    region: "क्षेत्र",
    area: "क्षेत्रफल",
    population2011: "2011 जनगणना",
    languages: "प्रमुख भाषाएँ",
    about: "इस स्थान के बारे में",
    geography: "भूगोल",
    governance: "शासन",
    culture: "संस्कृति",
    famousPlaces: "प्रसिद्ध स्थान",
    rivers: "प्रमुख नदियाँ",
    nationalParks: "राष्ट्रीय उद्यान",
    funFacts: "रोचक तथ्य",
    formation: "गठन",
    civicQuest: "KarmaFacie का तरीका",
    civicQuestText:
      "स्थान को जानें, उसकी पहचान को समझें और सीखें कि नागरिक स्थानीय सरकार तथा सार्वजनिक संस्थाओं के साथ कैसे जुड़ते हैं।",
    source: "डेटा स्रोत",
    nationalPortal: "भारत सरकार का राष्ट्रीय पोर्टल",
    census:
      "भारत के महापंजीयक एवं जनगणना आयुक्त का कार्यालय — जनगणना 2011",
    exploreLearning: "नागरिक शिक्षा देखें",
    stateNotFound: "राज्य नहीं मिला",
    stateNotFoundText:
      "अनुरोधित राज्य या केंद्र शासित प्रदेश नहीं मिला।",
  },

  mr: {
    back: "भारत जाणून घ्या येथे परत जा",
    state: "राज्य",
    unionTerritory: "केंद्रशासित प्रदेश",
    capital: "राजधानी",
    region: "प्रदेश",
    area: "क्षेत्रफळ",
    population2011: "2011 जनगणना",
    languages: "प्रमुख भाषा",
    about: "या ठिकाणाबद्दल",
    geography: "भूगोल",
    governance: "शासन",
    culture: "संस्कृती",
    famousPlaces: "प्रसिद्ध ठिकाणे",
    rivers: "प्रमुख नद्या",
    nationalParks: "राष्ट्रीय उद्याने",
    funFacts: "रोचक तथ्ये",
    formation: "निर्मिती",
    civicQuest: "KarmaFacie ची पद्धत",
    civicQuestText:
      "ठिकाण जाणून घ्या, त्याची ओळख समजून घ्या आणि नागरिक स्थानिक सरकार व सार्वजनिक संस्थांशी कसे जोडले जातात हे शिका.",
    source: "माहितीचे स्रोत",
    nationalPortal: "भारत सरकारचे राष्ट्रीय पोर्टल",
    census:
      "भारताचे महापंजीयक व जनगणना आयुक्त कार्यालय — जनगणना 2011",
    exploreLearning: "नागरी शिक्षण पहा",
    stateNotFound: "राज्य सापडले नाही",
    stateNotFoundText:
      "विनंती केलेले राज्य किंवा केंद्रशासित प्रदेश सापडला नाही.",
  },
} as const;

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white">
          {icon}
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>

      <p className="text-base font-bold leading-6 text-slate-900">{value}</p>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text?: string;
}) {
  if (!text) return null;

  return (
    <section className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      <p className="text-[15px] leading-7 text-slate-600">{text}</p>
    </section>
  );
}

function ListSection({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {index + 1}
              </span>

              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function StateSpotlightPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { language } = useLanguage();

  const t = translations[language];

  const state = useMemo<IndiaState | undefined>(() => {
    if (!params?.slug) return undefined;

    return getIndiaStateBySlug(params.slug);
  }, [params?.slug]);

  if (!state) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="text-6xl">🗺️</div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {t.stateNotFound}
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            {t.stateNotFoundText}
          </p>

          <button
            onClick={() => router.push("/know-india")}
            className="mt-7 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {t.back}
          </button>
        </div>
      </main>
    );
  }

  const typeLabel =
    state.type === "State" ? t.state : t.unionTerritory;

  const displayName =
    state.localizedName?.[language] || state.name;

  const displayCapital =
    state.localizedCapital?.[language] || state.capital;

  const hasExtraInformation =
    Boolean(state.shortDescription) ||
    Boolean(state.formationInfo) ||
    Boolean(state.geography) ||
    Boolean(state.governance) ||
    Boolean(state.culture) ||
    Boolean(state.famousPlaces?.length) ||
    Boolean(state.majorRivers?.length) ||
    Boolean(state.nationalParks?.length) ||
    Boolean(state.funFacts?.length);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_32%)]" />

        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-white/5 bg-white/[0.02]" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full border border-white/5 bg-white/[0.02]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <button
            onClick={() => router.push("/know-india")}
            className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            <span>←</span>
            <span>{t.back}</span>
          </button>

          <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur">
                <span>{state.type === "State" ? "🇮🇳" : "🏛️"}</span>
                {typeLabel}
              </div>

              <h1 className="max-w-5xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                {displayName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">
                <span>{state.region}</span>
                <span className="text-slate-600">•</span>
                <span>{displayCapital}</span>
              </div>

              {state.shortDescription && (
                <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                  {state.shortDescription}
                </p>
              )}
            </div>

            {/* Capital card */}
            <div className="lg:justify-self-end">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-md lg:min-w-[310px]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.05]" />

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    🏛️
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {t.capital}
                  </p>

                  <p className="mt-1 text-3xl font-black text-white">
                    {displayCapital}
                  </p>

                  <div className="mt-5 h-px bg-white/10" />

                  <p className="mt-4 text-sm text-slate-400">
                    {typeLabel} • {state.region}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Quick facts */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon="🏛️"
            label={t.capital}
            value={displayCapital}
          />

          <InfoCard
            icon="📍"
            label={t.region}
            value={state.region}
          />

          <InfoCard
            icon="📐"
            label={t.area}
            value={state.area}
          />

          <InfoCard
            icon="👥"
            label={t.population2011}
            value={state.population2011}
          />
        </div>

        {/* Languages */}
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              🗣️
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t.languages}
              </p>

              <p className="mt-1.5 font-semibold leading-7 text-slate-900">
                {state.majorLanguages}
              </p>
            </div>
          </div>
        </div>

        {/* Rich information */}
        {hasExtraInformation && (
          <>
            <div className="mt-10">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  {displayName}
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                  Discover {language === "en" ? "the place" : displayName}
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <DetailSection
                  icon="📖"
                  title={t.about}
                  text={state.shortDescription}
                />

                <DetailSection
                  icon="📜"
                  title={t.formation}
                  text={state.formationInfo}
                />

                <DetailSection
                  icon="🗺️"
                  title={t.geography}
                  text={state.geography}
                />

                <DetailSection
                  icon="🏛️"
                  title={t.governance}
                  text={state.governance}
                />

                <DetailSection
                  icon="🎭"
                  title={t.culture}
                  text={state.culture}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <ListSection
                icon="📍"
                title={t.famousPlaces}
                items={state.famousPlaces}
              />

              <ListSection
                icon="🌊"
                title={t.rivers}
                items={state.majorRivers}
              />

              <ListSection
                icon="🌳"
                title={t.nationalParks}
                items={state.nationalParks}
              />

              <ListSection
                icon="💡"
                title={t.funFacts}
                items={state.funFacts}
              />
            </div>
          </>
        )}

        {/* KarmaFacie */}
        <section className="relative mt-10 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-sm sm:p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/[0.03]" />

          <div className="relative grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                🧭
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight">
                {t.civicQuest}
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-8 text-slate-300">
              {t.civicQuestText}
            </p>
          </div>
        </section>

        {/* Sources */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              📚
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {t.source}
            </h2>
          </div>

          <div className="space-y-2 text-sm leading-6 text-slate-600">
            <p>
              • {t.nationalPortal}
            </p>

            <p>
              • {t.census}
            </p>

            {INDIA_DATA_SOURCE?.currentStructure && (
              <p className="text-slate-500">
                • {INDIA_DATA_SOURCE.currentStructure}
              </p>
            )}
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push("/know-india")}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← {t.back}
          </button>

          <button
            onClick={() => router.push("/explore")}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {t.exploreLearning} →
          </button>
        </div>
      </section>
    </main>
  );
}