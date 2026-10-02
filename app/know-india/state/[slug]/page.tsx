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
    civicQuest: "The KrutBharat way",
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
    civicQuest: "KrutBharat का तरीका",
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
    civicQuest: "KrutBharat ची पद्धत",
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
    <div className="kf-state-page-info-card group rounded-2xl border border-[#e8e0d4] bg-white p-5 shadow-[0_8px_24px_rgba(16,32,51,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(16,32,51,0.10)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="kf-state-page-info-icon flex h-10 w-10 items-center justify-center rounded-xl text-xl transition group-hover:bg-[#ff7a00] group-hover:text-white">
          {icon}
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-[#6f7b86]">
          {label}
        </p>
      </div>

      <p className="text-base font-bold leading-6 text-[#102033]">{value}</p>
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
    <section className="kf-state-page-detail-section group rounded-3xl border border-[#e8e0d4] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,51,0.06)] transition duration-200 hover:shadow-[0_14px_34px_rgba(16,32,51,0.10)] sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="kf-state-page-detail-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl transition group-hover:bg-[#ff7a00] group-hover:text-white">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-[#102033]">{title}</h2>
      </div>

      <p className="text-[15px] leading-7 text-[#536170]">{text}</p>
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
    <section className="kf-state-page-list-section rounded-3xl border border-[#e8e0d4] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,51,0.06)] sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="kf-state-page-list-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl">
          {icon}
        </div>

        <h2 className="text-xl font-bold text-[#102033]">{title}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="kf-state-page-list-item rounded-2xl border p-4 transition"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#102033] text-xs font-bold text-white">
                {index + 1}
              </span>

              <p className="text-sm leading-6 text-[#536170]">{item}</p>
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
      <main className="kf-state-page min-h-screen bg-[#f8f3ea] px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#e8e0d4] bg-white p-8 text-center shadow-[0_12px_35px_rgba(16,32,51,0.08)] sm:p-12">
          <div className="text-6xl">🗺️</div>

          <h1 className="mt-5 text-2xl font-black text-[#102033]">
            {t.stateNotFound}
          </h1>

          <p className="mt-3 leading-7 text-[#536170]">
            {t.stateNotFoundText}
          </p>

          <button
            onClick={() => router.push("/know-india")}
            className="mt-7 rounded-xl bg-[#102033] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1b334d]"
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
    <main className="kf-state-page min-h-screen bg-[#f8f3ea] font-[Quicksand,sans-serif]">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="kf-state-page-hero relative overflow-hidden bg-[#f8f3ea] text-[#102033]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,0,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(104,179,207,0.14),transparent_34%)]" />

        <div className="kf-state-page-hero-orb kf-state-page-hero-orb-blue absolute -right-24 top-20 h-72 w-72 rounded-full border" />
        <div className="kf-state-page-hero-orb kf-state-page-hero-orb-green absolute -left-24 bottom-0 h-64 w-64 rounded-full border" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          <button
            onClick={() => router.push("/know-india")}
            className="mb-10 inline-flex items-center gap-2 rounded-xl border border-[#ded5c8] bg-white/80 px-4 py-2.5 text-sm font-semibold text-[#102033] shadow-sm backdrop-blur transition hover:bg-white"
          >
            <span>←</span>
            <span>{t.back}</span>
          </button>

          <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f0d5b7] bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#a85600] shadow-sm backdrop-blur">
                <span>{state.type === "State" ? "🇮🇳" : "🏛️"}</span>
                {typeLabel}
              </div>

              <h1 className="max-w-5xl font-[Baloo_2,sans-serif] text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                {displayName}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#6f7b86]">
                <span>{state.region}</span>
                <span className="text-[#c5b9aa]">•</span>
                <span>{displayCapital}</span>
              </div>

              {state.shortDescription && (
                <p className="mt-7 max-w-3xl text-lg leading-8 text-[#536170]">
                  {state.shortDescription}
                </p>
              )}
            </div>

            {/* Capital card */}
            <div className="kf-state-page-capital-wrap lg:justify-self-end">
              <div className="kf-state-page-capital-card relative overflow-hidden kf-state-page-capital-card rounded-3xl border border-[#e8e0d4] bg-white/90 p-6 shadow-[0_16px_40px_rgba(16,32,51,0.10)] backdrop-blur-md lg:min-w-[310px]">
                <div className="kf-state-page-capital-orb absolute -right-10 -top-10 h-28 w-28 rounded-full" />

                <div className="relative">
                  <div className="kf-state-page-capital-icon flex h-12 w-12 items-center justify-center rounded-2xl text-2xl">
                    🏛️
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#7b8792]">
                    {t.capital}
                  </p>

                  <p className="mt-1 font-[Baloo_2,sans-serif] text-3xl font-black text-[#102033]">
                    {displayCapital}
                  </p>

                  <div className="mt-5 h-px bg-[#e8e0d4]" />

                  <p className="mt-4 text-sm text-[#6f7b86]">
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
      <section className="kf-state-page-content mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Quick facts */}
        <div className="kf-state-page-facts grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="kf-state-page-language-card mt-5 rounded-3xl border border-[#e8e0d4] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,51,0.06)] sm:p-7">
          <div className="flex items-start gap-4">
            <div className="kf-state-page-list-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl">
              🗣️
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6f7b86]">
                {t.languages}
              </p>

              <p className="mt-1.5 font-semibold leading-7 text-[#102033]">
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a7d6e]">
                  {displayName}
                </p>

                <h2 className="mt-1 font-[Baloo_2,sans-serif] text-3xl font-black tracking-tight text-[#102033]">
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

        {/* KrutBharat */}
        <section className="kf-state-page-krutBharat relative mt-10 overflow-hidden rounded-3xl border border-[#e7d5c0] bg-[#fff0df] p-8 text-[#102033] shadow-[0_10px_30px_rgba(16,32,51,0.07)] sm:p-10">
          <div className="kf-state-page-krut-orb kf-state-page-krut-orb-warm absolute -right-20 -top-20 h-56 w-56 rounded-full" />
          <div className="kf-state-page-krut-orb kf-state-page-krut-orb-cool absolute -bottom-24 -left-16 h-56 w-56 rounded-full" />

          <div className="relative grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div>
              <div className="kf-state-page-krut-icon flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm">
                🧭
              </div>

              <h2 className="mt-5 font-[Baloo_2,sans-serif] text-3xl font-black tracking-tight text-[#102033]">
                {t.civicQuest}
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-8 text-[#536170]">
              {t.civicQuestText}
            </p>
          </div>
        </section>

        {/* Sources */}
        <section className="kf-state-page-sources mt-8 rounded-3xl border border-[#e8e0d4] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,51,0.06)] sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="kf-state-page-source-icon flex h-11 w-11 items-center justify-center rounded-2xl text-xl">
              📚
            </div>

            <h2 className="text-lg font-bold text-[#102033]">
              {t.source}
            </h2>
          </div>

          <div className="space-y-2 text-sm leading-6 text-[#536170]">
            <p>
              • {t.nationalPortal}
            </p>

            <p>
              • {t.census}
            </p>

            {INDIA_DATA_SOURCE?.currentStructure && (
              <p className="text-[#7b8792]">
                • {INDIA_DATA_SOURCE.currentStructure}
              </p>
            )}
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.push("/know-india")}
            className="rounded-xl border border-[#d8cec0] bg-white px-5 py-3 text-sm font-bold text-[#102033] transition hover:bg-[#fbf8f3]"
          >
            ← {t.back}
          </button>

          <button
            onClick={() => router.push("/explore")}
            className="rounded-xl bg-[#ff7a00] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e96d00]"
          >
            {t.exploreLearning} →
          </button>
        </div>
      </section>
    </main>
  );
}