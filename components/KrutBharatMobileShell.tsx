"use client";



import { useEffect, useMemo, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "@/components/LanguageProvider";

import type { Language } from "@/lib/i18n";



type NavItem = {

  key: string;

  label: string;

  icon: ReactNode;

  path: string;

};



const copy: Record<Language, {

  searchPlaceholder: string;

  searchTitle: string;

  close: string;

  home: string;

  drawer: string;

  civicSense: string;

  knowIndia: string;

  report: string;

  authorities: string;

  profile: string;

  learn: string;

  understand: string;

  participate: string;

  community: string;

  leagues: string;

  learning: string;

  issues: string;

  impact: string;

  settings: string;

}> = {

  en: {

    searchPlaceholder: "Search KrutBharat...",

    searchTitle: "Search",

    close: "Close",

    home: "Home",

    drawer: "Menu",

    civicSense: "Civic Sense",

    knowIndia: "Know India",

    report: "Report an Issue",

    authorities: "Know Authorities",

    profile: "My Profile",

    learn: "Learn",

    understand: "Understand",

    participate: "Participate",

    community: "Community",

    leagues: "Civic Leagues",

    learning: "Civic Learning",

    issues: "My Issues",

    impact: "My Impact",

    settings: "Settings",

  },

  hi: {

    searchPlaceholder: "KrutBharat में खोजें...",

    searchTitle: "खोजें",

    close: "बंद करें",

    home: "होम",

    drawer: "मेनू",

    civicSense: "नागरिक बोध",

    knowIndia: "भारत को जानें",

    report: "समस्या रिपोर्ट करें",

    authorities: "प्राधिकरण जानें",

    profile: "मेरी प्रोफ़ाइल",

    learn: "सीखें",

    understand: "समझें",

    participate: "भाग लें",

    community: "समुदाय",

    leagues: "सिविक लीग्स",

    learning: "नागरिक शिक्षा",

    issues: "मेरी समस्याएँ",

    impact: "मेरा प्रभाव",

    settings: "सेटिंग्स",

  },

  mr: {

    searchPlaceholder: "KrutBharat मध्ये शोधा...",

    searchTitle: "शोधा",

    close: "बंद करा",

    home: "होम",

    drawer: "मेनू",

    civicSense: "नागरी जाणीव",

    knowIndia: "भारत जाणून घ्या",

    report: "समस्या नोंदवा",

    authorities: "प्राधिकरण जाणून घ्या",

    profile: "माझी प्रोफाइल",

    learn: "शिका",

    understand: "समजून घ्या",

    participate: "सहभागी व्हा",

    community: "समुदाय",

    leagues: "सिविक लीग्स",

    learning: "नागरिक शिक्षण",

    issues: "माझ्या समस्या",

    impact: "माझा प्रभाव",

    settings: "सेटिंग्ज",

  },

};



const THEME_STORAGE_KEY = "KrutBharat-theme";

const LEGACY_THEME_STORAGE_KEY = "karmafacie-theme";



function Icon({ name, size = 18 }: { name: string; size?: number }) {

  const common = {

    width: size,

    height: size,

    viewBox: "0 0 24 24",

    fill: "none",

    stroke: "currentColor",

    strokeWidth: 1.9,

    strokeLinecap: "round" as const,

    strokeLinejoin: "round" as const,

    "aria-hidden": true,

  };



  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;

  if (name === "home") return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>;

  if (name === "sense") return <svg {...common}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.2 14.6A7 7 0 1 1 15.8 14.6c-.8.8-1.6 1.6-1.6 3.4h-4.4c0-1.8-.8-2.6-1.6-3.4Z" /></svg>;

  if (name === "india") return <svg {...common}><path d="m12 3 2 3.6 4.2.9-2.9 3 0.5 4.5L12 13l-3.8 2 0.5-4.5-2.9-3 4.2-.9L12 3Z" /><path d="M12 2v20" opacity=".35" /></svg>;

  if (name === "report") return <svg {...common}><path d="M4 5.5h16v13H4z" /><path d="M8 9h8M8 12h6M8 15h4" /></svg>;

  if (name === "authority") return <svg {...common}><path d="M3 10h18" /><path d="M5 10v9M9 10v9M15 10v9M19 10v9" /><path d="M3 19h18M4 7l8-4 8 4" /></svg>;

  if (name === "profile") return <svg {...common}><circle cx="12" cy="8" r="3.2" /><path d="M5 21a7 7 0 0 1 14 0" /></svg>;

  if (name === "book") return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5v15M8 7h8M8 10h8" /></svg>;

  if (name === "understand") return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v6l4 2" /></svg>;

  if (name === "participate") return <svg {...common}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M14 19a4 4 0 0 1 6.5 1" /></svg>;

  if (name === "community") return <svg {...common}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></svg>;

  if (name === "leagues") return <svg {...common}><path d="m12 3 2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 8.1l4.8-.7L12 3Z" /></svg>;

  if (name === "learning") return <svg {...common}><path d="M3 5h8v14H3zM13 5h8v14h-8z" /><path d="M6 8h2M6 11h2M16 8h2M16 11h2" /></svg>;

  if (name === "issues") return <svg {...common}><path d="M6 3h12v18H6z" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>;

  if (name === "impact") return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="m7 15 3-4 3 2 4-6" /></svg>;

  if (name === "sun") return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;

  if (name === "moon") return <svg {...common}><path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></svg>;

  return <svg {...common}><circle cx="12" cy="12" r="8.5" /></svg>;

}



export default function KrutBharatMobileShell() {

  const router = useRouter();

  const pathname = usePathname();

  const { language, setLanguage } = useLanguage();

  const text = copy[language];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme] = useState<"light" | "dark">("light");



  useEffect(() => {

    const root = document.documentElement;



    try {

      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);

      const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

      const preferred =

        saved === "dark" || saved === "light"

          ? saved

          : legacy === "dark" || legacy === "light"

            ? legacy

            : null;



      if (preferred) {

        root.dataset.theme = preferred;

        window.localStorage.setItem(THEME_STORAGE_KEY, preferred);

        window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, preferred);

      } else if (root.dataset.theme !== "dark" && root.dataset.theme !== "light") {

        root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches

          ? "dark"

          : "light";

        window.localStorage.setItem(THEME_STORAGE_KEY, root.dataset.theme);

        window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, root.dataset.theme);

      }

    } catch {

      if (root.dataset.theme !== "dark" && root.dataset.theme !== "light") {

        root.dataset.theme = "light";

      }

    }



    const sync = () =>

      setTheme(root.dataset.theme === "dark" ? "dark" : "light");



    sync();

    const observer = new MutationObserver(sync);

    observer.observe(root, {

      attributes: true,

      attributeFilter: ["data-theme"],

    });



    return () => observer.disconnect();

  }, []);



  useEffect(() => {

    document.body.classList.add("kf-mobile-shell-active");

    return () => document.body.classList.remove("kf-mobile-shell-active");

  }, []);



  useEffect(() => {

    const onKeyDown = (event: KeyboardEvent) => {

      if (event.key === "Escape") {

        setDrawerOpen(false);

        setSearchOpen(false);

      }

    };

    document.addEventListener("keydown", onKeyDown);

    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";

    return () => {

      document.removeEventListener("keydown", onKeyDown);

      document.body.style.overflow = "";

    };

  }, [drawerOpen, searchOpen]);



  const toggleTheme = () => {

    const root = document.documentElement;

    const next: "light" | "dark" =

      root.dataset.theme === "dark" ? "light" : "dark";



    root.dataset.theme = next;



    try {

      window.localStorage.setItem(THEME_STORAGE_KEY, next);

      window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, next);

    } catch {

      // Ignore storage failures; the active theme still applies for this session.

    }



    setTheme(next);

  };



  const bottomItems: NavItem[] = useMemo(() => [

    { key: "sense", label: text.civicSense, path: "/civic-sense", icon: <Icon name="sense" /> },

    { key: "india", label: text.knowIndia, path: "/know-india", icon: <Icon name="india" /> },

    { key: "report", label: text.report, path: "/report-issue", icon: <Icon name="report" /> },

    { key: "authority", label: text.authorities, path: "/responsible-authorities", icon: <Icon name="authority" /> },

    { key: "profile", label: text.profile, path: "/dashboard", icon: <Icon name="profile" /> },

  ], [text]);



  const drawerItems: NavItem[] = useMemo(() => [

    { key: "home", label: text.home, path: "/www", icon: <Icon name="home" /> },

    { key: "learn", label: text.learn, path: "/learn", icon: <Icon name="book" /> },

    { key: "understand", label: text.understand, path: "/understand", icon: <Icon name="understand" /> },

    { key: "participate", label: text.participate, path: "/participate", icon: <Icon name="participate" /> },

    { key: "learning", label: text.learning, path: "/civic-learning", icon: <Icon name="learning" /> },

    { key: "sense", label: text.civicSense, path: "/civic-sense", icon: <Icon name="sense" /> },

    { key: "india", label: text.knowIndia, path: "/know-india", icon: <Icon name="india" /> },

    { key: "authority", label: text.authorities, path: "/responsible-authorities", icon: <Icon name="authority" /> },

    { key: "report", label: text.report, path: "/report-issue", icon: <Icon name="report" /> },

    { key: "issues", label: text.issues, path: "/my-issues", icon: <Icon name="issues" /> },

    { key: "impact", label: text.impact, path: "/my-impact", icon: <Icon name="impact" /> },

    { key: "community", label: text.community, path: "/community", icon: <Icon name="community" /> },

    { key: "leagues", label: text.leagues, path: "/leagues", icon: <Icon name="leagues" /> },

    { key: "profile", label: text.profile, path: "/dashboard", icon: <Icon name="profile" /> },

  ], [text]);



  const searchItems = useMemo(() => [

    ...drawerItems,

  ], [drawerItems]);



  const filteredResults = useMemo(() => {

    const q = searchQuery.trim().toLocaleLowerCase();

    if (!q) return searchItems.slice(0, 7);

    return searchItems.filter((item) => item.label.toLocaleLowerCase().includes(q)).slice(0, 8);

  }, [searchItems, searchQuery]);



  const go = (path: string) => {

    setDrawerOpen(false);

    setSearchOpen(false);

    setSearchQuery("");



    // Persist the currently active theme before navigating so the destination

    // route never falls back to light mode during a client-side transition.

    try {

      const currentTheme = document.documentElement.dataset.theme;

      if (currentTheme === "dark" || currentTheme === "light") {

        window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

        window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, currentTheme);

      }

    } catch {

      // Ignore storage failures; Next.js navigation should still continue.

    }



    router.push(path);

  };



  const isActive = (path: string) => {

    if (path === "/dashboard") return pathname === "/dashboard";

    return pathname === path || pathname.startsWith(`${path}/`);

  };



  return (

    <>

      <div className="kf-mobile-shell" aria-label="KrutBharat app navigation">

        <header className="kf-mobile-shell-header">

          <div className="kf-mobile-shell-header-inner">

            <button type="button" className="kf-mobile-shell-brand" onClick={() => go("/www")} aria-label={text.home}>

              Krut<span>Bharat</span>

            </button>



            <div className="kf-mobile-shell-header-actions">

              <button type="button" className="kf-mobile-shell-icon-button" onClick={() => setSearchOpen(true)} aria-label={text.searchTitle} title={text.searchTitle}>

                <Icon name="search" size={19} />

              </button>

              <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="kf-mobile-shell-language" aria-label="Language">

                <option value="en">English</option>

                <option value="hi">हिन्दी</option>

                <option value="mr">मराठी</option>

              </select>

              <button type="button" className="kf-mobile-shell-menu" onClick={() => setDrawerOpen(true)} aria-label={text.drawer} aria-expanded={drawerOpen}>

                <span aria-hidden="true">☰</span>

              </button>

            </div>

          </div>

        </header>



        <div className="kf-mobile-shell-top-spacer" aria-hidden="true" />



        <div className={`kf-mobile-shell-overlay ${drawerOpen ? "is-open" : ""}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />

        <aside className={`kf-mobile-shell-drawer ${drawerOpen ? "is-open" : ""}`} aria-label={text.drawer} aria-hidden={!drawerOpen}>

          <div className="kf-mobile-shell-drawer-header">

            <button type="button" className="kf-mobile-shell-drawer-brand" onClick={() => go("/www")}>

              Krut<span>Bharat</span>

            </button>

            <div className="kf-mobile-shell-drawer-header-actions">

              <button type="button" className="kf-mobile-shell-theme" onClick={toggleTheme} aria-label={theme === "dark" ? "Light mode" : "Dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>

                <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />

              </button>

              <button type="button" className="kf-mobile-shell-close" onClick={() => setDrawerOpen(false)} aria-label={text.close}>×</button>

            </div>

          </div>



          <nav className="kf-mobile-shell-drawer-nav">

            {drawerItems.map((item, index) => (

              <div key={item.key}>

                {index === 4 && <div className="kf-mobile-shell-divider" />}

                <button type="button" className={`kf-mobile-shell-drawer-item ${isActive(item.path) ? "is-active" : ""}`} onClick={() => go(item.path)}>

                  <span className="kf-mobile-shell-drawer-icon">{item.icon}</span>

                  <span>{item.label}</span>

                  <span className="kf-mobile-shell-drawer-arrow">›</span>

                </button>

              </div>

            ))}

          </nav>

        </aside>



        <div className={`kf-mobile-shell-search ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>

          <div className="kf-mobile-shell-search-backdrop" onClick={() => setSearchOpen(false)} />

          <div className="kf-mobile-shell-search-panel" role="dialog" aria-modal="true" aria-label={text.searchTitle}>

            <div className="kf-mobile-shell-search-head">

              <div className="kf-mobile-shell-search-title"><Icon name="search" size={18} /> {text.searchTitle}</div>

              <button type="button" onClick={() => setSearchOpen(false)} className="kf-mobile-shell-close" aria-label={text.close}>×</button>

            </div>

            <div className="kf-mobile-shell-search-input-wrap">

              <Icon name="search" size={18} />

              <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={text.searchPlaceholder} />

            </div>

            <div className="kf-mobile-shell-search-results">

              {filteredResults.map((item) => (

                <button key={item.key} type="button" className="kf-mobile-shell-search-result" onClick={() => go(item.path)}>

                  <span className="kf-mobile-shell-search-result-icon">{item.icon}</span>

                  <span>{item.label}</span>

                  <span className="kf-mobile-shell-drawer-arrow">›</span>

                </button>

              ))}

            </div>

          </div>

        </div>



        <nav className="kf-mobile-shell-bottom-nav" aria-label="Primary">

          {bottomItems.map((item) => (

            <button key={item.key} type="button" className={`kf-mobile-shell-bottom-item ${item.key === "report" ? "is-report" : ""} ${isActive(item.path) ? "is-active" : ""}`} onClick={() => go(item.path)}>

              <span className="kf-mobile-shell-bottom-icon">{item.icon}</span>

              <span>{item.label}</span>

            </button>

          ))}

        </nav>

      </div>



      <style>{`

        .kf-mobile-shell { display: none; }



        @media (max-width: 1023px) {

          .kf-mobile-shell {

            display: block;

            position: relative;

            z-index: 500;

          }



          body.kf-mobile-shell-active {

            padding-bottom: calc(108px + env(safe-area-inset-bottom)) !important;

          }



          .kf-mobile-shell-header {

            position: fixed;

            top: 10px;

            left: 0;

            right: 0;

            z-index: 1000;

            pointer-events: none;

          }



          .kf-mobile-shell-header-inner {

            pointer-events: auto;

            width: min(calc(100% - 18px), 980px);

            margin: 0 auto;

            min-height: 58px;

            padding: 8px 9px 8px 15px;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 9px;

            border: 1px solid rgba(16,32,51,.09);

            border-radius: 20px;

            background: rgba(255,253,249,.95);

            box-shadow:

              0 12px 34px rgba(16,32,51,.10),

              inset 0 1px 0 rgba(255,255,255,.82);

            backdrop-filter: blur(20px) saturate(125%);

            -webkit-backdrop-filter: blur(20px) saturate(125%);

          }



          .kf-mobile-shell-brand,

          .kf-mobile-shell-drawer-brand {

            border: 0;

            background: none;

            padding: 0;

            color: #102033;

            font-family: var(--font-display);

            font-size: 23px;

            font-weight: 900;

            letter-spacing: -.045em;

            cursor: pointer;

          }



          .kf-mobile-shell-brand span,

          .kf-mobile-shell-drawer-brand span {

            color: #ff7a00;

          }



          .kf-mobile-shell-header-actions {

            display: flex;

            align-items: center;

            gap: 6px;

            min-width: 0;

          }



          .kf-mobile-shell-icon-button,

          .kf-mobile-shell-menu,

          .kf-mobile-shell-theme,

          .kf-mobile-shell-close {

            display: grid;

            place-items: center;

            border: 1px solid rgba(16,32,51,.10);

            background: rgba(255,255,255,.88);

            color: #102033;

            cursor: pointer;

          }



          .kf-mobile-shell-icon-button,

          .kf-mobile-shell-menu {

            width: 38px;

            height: 38px;

            border-radius: 13px;

          }



          .kf-mobile-shell-icon-button:active,

          .kf-mobile-shell-menu:active,

          .kf-mobile-shell-theme:active,

          .kf-mobile-shell-close:active {

            transform: scale(.97);

          }



          .kf-mobile-shell-menu {

            font-size: 19px;

            line-height: 1;

          }



          .kf-mobile-shell-language {

            min-width: 82px;

            max-width: 108px;

            height: 38px;

            padding: 0 10px;

            border-radius: 13px;

            border: 1px solid rgba(16,32,51,.10);

            background: rgba(255,255,255,.88);

            color: #263447;

            font-size: 10px;

            font-weight: 800;

            outline: none;

          }



          .kf-mobile-shell-top-spacer {

            /* Keep content close to the fixed app header; older 80px spacer
               created a visible dead band on smaller screens. */
            height: 64px;

          }



          .kf-mobile-shell-overlay {

            position: fixed;

            inset: 0;

            z-index: 1090;

            background: rgba(6,14,24,.42);

            opacity: 0;

            pointer-events: none;

            transition: opacity .22s ease;

          }



          .kf-mobile-shell-overlay.is-open {

            opacity: 1;

            pointer-events: auto;

          }



          .kf-mobile-shell-drawer {

            position: fixed;

            z-index: 1100;

            top: 0;

            right: 0;

            bottom: 0;

            width: min(88vw, 380px);

            padding: 14px 14px calc(22px + env(safe-area-inset-bottom));

            background: #fffaf2;

            border-left: 1px solid rgba(16,32,51,.10);

            box-shadow: -18px 0 60px rgba(16,32,51,.18);

            transform: translateX(105%);

            transition: transform .25s cubic-bezier(.2,.8,.2,1);

            overflow: auto;

            overscroll-behavior: contain;

          }



          .kf-mobile-shell-drawer.is-open {

            transform: translateX(0);

          }



          .kf-mobile-shell-drawer-header {

            position: sticky;

            top: 0;

            z-index: 2;

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 10px;

            padding: 7px 2px 16px;

            background: #fffaf2;

            border-bottom: 1px solid rgba(16,32,51,.08);

          }



          .kf-mobile-shell-drawer-header-actions {

            display: flex;

            align-items: center;

            gap: 7px;

          }



          /* Small circular theme switch stays beside X in the drawer. */

          .kf-mobile-shell-theme {

            width: 34px;

            height: 34px;

            border-radius: 50%;

          }



          .kf-mobile-shell-close {

            width: 34px;

            height: 34px;

            border-radius: 50%;

            font-size: 23px;

            line-height: 1;

          }



          .kf-mobile-shell-drawer-nav {

            padding-top: 9px;

          }



          .kf-mobile-shell-divider {

            height: 1px;

            margin: 8px 7px 9px;

            background: rgba(16,32,51,.08);

          }



          .kf-mobile-shell-drawer-item {

            width: 100%;

            min-height: 49px;

            display: grid;

            grid-template-columns: 30px minmax(0,1fr) 18px;

            align-items: center;

            gap: 10px;

            border: 0;

            border-radius: 14px;

            padding: 8px 10px;

            background: transparent;

            color: #263447;

            text-align: left;

            font-size: 13px;

            font-weight: 800;

            cursor: pointer;

          }



          .kf-mobile-shell-drawer-item:hover,

          .kf-mobile-shell-drawer-item.is-active {

            background: #fff0df;

            color: #ff7a00;

          }



          .kf-mobile-shell-drawer-icon {

            width: 30px;

            height: 30px;

            display: grid;

            place-items: center;

            border-radius: 10px;

            background: #f1f5f8;

            color: #5f7487;

          }



          .kf-mobile-shell-drawer-item.is-active .kf-mobile-shell-drawer-icon {

            background: #ffe4c5;

            color: #ff7a00;

          }



          .kf-mobile-shell-drawer-arrow {

            color: #9aa4ae;

            font-size: 20px;

            line-height: 1;

            text-align: right;

          }



          .kf-mobile-shell-search {

            display: none;

            position: fixed;

            inset: 0;

            z-index: 1200;

          }



          .kf-mobile-shell-search.is-open {

            display: block;

          }



          .kf-mobile-shell-search-backdrop {

            position: absolute;

            inset: 0;

            background: rgba(6,14,24,.44);

          }



          .kf-mobile-shell-search-panel {

            position: absolute;

            left: 50%;

            top: 74px;

            transform: translateX(-50%);

            width: min(calc(100% - 22px), 660px);

            max-height: calc(100vh - 100px);

            overflow: auto;

            padding: 14px;

            border: 1px solid rgba(16,32,51,.10);

            border-radius: 24px;

            background: #fffaf2;

            box-shadow: 0 24px 70px rgba(16,32,51,.22);

          }



          .kf-mobile-shell-search-head {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 10px;

            padding: 2px 2px 12px;

          }



          .kf-mobile-shell-search-title {

            display: flex;

            align-items: center;

            gap: 8px;

            color: #102033;

            font-size: 13px;

            font-weight: 900;

          }



          .kf-mobile-shell-search-input-wrap {

            display: flex;

            align-items: center;

            gap: 9px;

            height: 48px;

            padding: 0 14px;

            border: 1px solid rgba(16,32,51,.11);

            border-radius: 16px;

            background: #fff;

            color: #7b8792;

          }



          .kf-mobile-shell-search-input-wrap input {

            width: 100%;

            border: 0;

            outline: 0;

            background: transparent;

            color: #102033;

            font-size: 14px;

          }



          .kf-mobile-shell-search-results {

            display: grid;

            gap: 5px;

            margin-top: 10px;

          }



          .kf-mobile-shell-search-result {

            width: 100%;

            display: grid;

            grid-template-columns: 34px minmax(0,1fr) 18px;

            align-items: center;

            gap: 10px;

            padding: 9px;

            border: 0;

            border-radius: 14px;

            background: transparent;

            color: #263447;

            text-align: left;

            font-size: 13px;

            font-weight: 800;

            cursor: pointer;

          }



          .kf-mobile-shell-search-result:hover {

            background: #edf5fb;

          }



          .kf-mobile-shell-search-result-icon {

            width: 34px;

            height: 34px;

            display: grid;

            place-items: center;

            border-radius: 10px;

            background: #f1f5f8;

            color: #5f7487;

          }



          /* ==========================================================

             BEAUTIFIED MOBILE APP BOTTOM NAV

             ========================================================== */

          .kf-mobile-shell-bottom-nav {

            position: fixed;

            left: 50%;

            bottom: calc(9px + env(safe-area-inset-bottom));

            transform: translateX(-50%);

            z-index: 1000;

            width: min(calc(100% - 16px), 980px);

            min-height: 78px;

            padding: 7px 6px 8px;

            display: grid;

            grid-template-columns: repeat(5, minmax(0,1fr));

            align-items: stretch;

            gap: 3px;

            border: 1px solid rgba(16,32,51,.10);

            border-radius: 25px;

            background: rgba(255,253,249,.97);

            box-shadow:

              0 18px 48px rgba(16,32,51,.16),

              inset 0 1px 0 rgba(255,255,255,.86);

            backdrop-filter: blur(22px) saturate(130%);

            -webkit-backdrop-filter: blur(22px) saturate(130%);

          }



          .kf-mobile-shell-bottom-nav::before {

            content: "";

            position: absolute;

            left: 10px;

            right: 10px;

            top: 0;

            height: 1px;

            background: linear-gradient(

              90deg,

              rgba(255,122,0,0),

              rgba(255,122,0,.30),

              rgba(255,122,0,0)

            );

            pointer-events: none;

          }



          .kf-mobile-shell-bottom-item {

            position: relative;

            min-width: 0;

            min-height: 62px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            gap: 4px;

            padding: 4px 2px 5px;

            border: 0;

            border-radius: 17px;

            background: transparent;

            color: #738294;

            cursor: pointer;

            font-size: 8.2px;

            font-weight: 850;

            line-height: 1.05;

            text-align: center;

            transition:

              background .18s ease,

              color .18s ease,

              transform .18s ease;

          }



          .kf-mobile-shell-bottom-item > span:last-child {

            display: flex;

            align-items: center;

            justify-content: center;

            min-height: 20px;

            max-width: 68px;

            text-wrap: balance;

          }



          .kf-mobile-shell-bottom-item.is-active:not(.is-report) {

            background: #fff3e5;

            color: #ff7a00;

          }



          .kf-mobile-shell-bottom-item.is-active:not(.is-report)::after {

            content: "";

            position: absolute;

            bottom: 3px;

            width: 22px;

            height: 3px;

            border-radius: 999px;

            background: #ff7a00;

          }



          .kf-mobile-shell-bottom-item.is-report {

            margin-top: -13px;

            padding-top: 0;

            color: #647486;

          }



          .kf-mobile-shell-bottom-item.is-report .kf-mobile-shell-bottom-icon {

            width: 50px;

            height: 50px;

            border-radius: 17px;

            background: linear-gradient(145deg, #ff8b2e, #ff7a00);

            color: #fff;

            box-shadow:

              0 10px 24px rgba(255,122,0,.30),

              0 0 0 5px rgba(255,253,249,.97);

          }



          .kf-mobile-shell-bottom-item.is-report.is-active .kf-mobile-shell-bottom-icon {

            box-shadow:

              0 11px 26px rgba(255,122,0,.34),

              0 0 0 5px rgba(255,253,249,.97);

          }



          .kf-mobile-shell-bottom-item.is-report.is-active {

            color: #ff7a00;

            background: transparent;

          }



          .kf-mobile-shell-bottom-item:active {

            transform: translateY(1px);

          }



          .kf-mobile-shell-bottom-icon {

            width: 34px;

            height: 34px;

            flex: 0 0 auto;

            display: grid;

            place-items: center;

            border-radius: 12px;

            background: #f0f4f7;

            color: #718398;

            transition: background .18s ease, color .18s ease;

          }



          .kf-mobile-shell-bottom-item.is-active:not(.is-report) .kf-mobile-shell-bottom-icon {

            background: #ffe6c9;

            color: #ff7a00;

          }



          /* Hide page-specific desktop headers on mobile/tablet.

             The shared app shell owns the mobile navigation. */

          .kf-know-india-topbar,

          .kf-dashboard-header,

          .kf-civic-sense-topbar,

          .kf-ra-premium-header,

          .kf-report-topbar,

          .kf-my-impact-topbar,

          .kf-community-topbar,

          .kf-leagues-topbar {

            display: none !important;

          }



          /* Dashboard has an older header style; ensure it never appears

             beneath the new app shell on phones/tablets. */

          .kf-dashboard-page .kf-dashboard-header {

            display: none !important;

          }



          /* The shared mobile/tablet shell owns search + theme. Hide the

             desktop/global floating buttons everywhere below 1024px. */

          .kf-theme-toggle,

          .kf-global-theme-toggle,

          .kf-global-search-trigger {

            display: none !important;

          }



          /* Defensive hiding for legacy floating utility controls that may

             still exist in older page versions. */

          .kf-mobile-shell ~ .theme-toggle,

          .kf-mobile-shell ~ .global-search,

          .kf-mobile-shell ~ [data-floating-theme-toggle],

          .kf-mobile-shell ~ [data-floating-global-search] {

            display: none !important;

          }



          html[data-theme="dark"] .kf-mobile-shell-header-inner,

          html[data-theme="dark"] .kf-mobile-shell-bottom-nav {

            background: rgba(8,20,34,.97);

            border-color: rgba(145,174,204,.20);

            box-shadow:

              0 20px 52px rgba(0,0,0,.34),

              inset 0 1px 0 rgba(255,255,255,.04);

          }



          html[data-theme="dark"] .kf-mobile-shell-brand,

          html[data-theme="dark"] .kf-mobile-shell-icon-button,

          html[data-theme="dark"] .kf-mobile-shell-menu,

          html[data-theme="dark"] .kf-mobile-shell-language {

            color: #f5f8fc;

          }



          html[data-theme="dark"] .kf-mobile-shell-icon-button,

          html[data-theme="dark"] .kf-mobile-shell-menu,

          html[data-theme="dark"] .kf-mobile-shell-language {

            background: #0e2034;

            border-color: rgba(145,174,204,.20);

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer {

            background: #081523;

            border-left-color: rgba(145,174,204,.12);

            box-shadow: -20px 0 64px rgba(0,0,0,.34);

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer-header {

            background: #081523;

            border-color: rgba(145,174,204,.12);

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer-brand,

          html[data-theme="dark"] .kf-mobile-shell-search-title,

          html[data-theme="dark"] .kf-mobile-shell-search-input-wrap input {

            color: #f5f8fc;

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer-item {

            color: #d7e5f2;

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer-item:hover,

          html[data-theme="dark"] .kf-mobile-shell-drawer-item.is-active {

            background: #142a43;

            color: #ff9a55;

          }



          html[data-theme="dark"] .kf-mobile-shell-drawer-icon,

          html[data-theme="dark"] .kf-mobile-shell-bottom-icon,

          html[data-theme="dark"] .kf-mobile-shell-search-result-icon {

            background: #10263d;

            color: #93abc0;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item {

            color: #91a5b9;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item.is-active:not(.is-report) {

            background: rgba(255,122,0,.11);

            color: #ff9a55;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item.is-active:not(.is-report)::after {

            background: #ff8a3d;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item.is-active:not(.is-report) .kf-mobile-shell-bottom-icon {

            background: rgba(255,122,0,.18);

            color: #ff9a55;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item.is-report {

            color: #a9b9c9;

          }



          html[data-theme="dark"] .kf-mobile-shell-bottom-item.is-report .kf-mobile-shell-bottom-icon {

            background: linear-gradient(145deg, #ff9846, #ff7a00);

            color: #fff;

            box-shadow:

              0 10px 26px rgba(255,122,0,.34),

              0 0 0 5px rgba(8,20,34,.97);

          }



          html[data-theme="dark"] .kf-mobile-shell-theme,

          html[data-theme="dark"] .kf-mobile-shell-close,

          html[data-theme="dark"] .kf-mobile-shell-search-panel {

            background: #0b1d31;

            color: #f5f8fc;

            border-color: rgba(145,174,204,.18);

          }

          html[data-theme="dark"] .kf-mobile-shell-close {
            background: #06111d !important;
            color: #ffffff !important;
            border-color: rgba(145,174,204,.22) !important;
            box-shadow: 0 6px 18px rgba(0,0,0,.28);
          }

          html[data-theme="dark"] .kf-mobile-shell-close:hover,
          html[data-theme="dark"] .kf-mobile-shell-close:focus-visible {
            background: #10263d !important;
            color: #ffffff !important;
          }



          html[data-theme="dark"] .kf-mobile-shell-search-input-wrap {

            background: #0d2238;

            border-color: rgba(145,174,204,.18);

          }



          html[data-theme="dark"] .kf-mobile-shell-search-result {

            color: #d7e5f2;

          }



          html[data-theme="dark"] .kf-mobile-shell-search-result:hover {

            background: #132a43;

          }



          html[data-theme="dark"] .kf-mobile-shell-divider {

            background: rgba(145,174,204,.13);

          }

        }



        @media (max-width: 420px) {

          .kf-mobile-shell-header-inner {

            width: calc(100% - 12px);

            min-height: 55px;

            border-radius: 18px;

            padding-left: 13px;

          }



          .kf-mobile-shell-brand {

            font-size: 21px;

          }



          .kf-mobile-shell-icon-button,

          .kf-mobile-shell-menu,

          .kf-mobile-shell-language {

            height: 36px;

          }



          .kf-mobile-shell-icon-button,

          .kf-mobile-shell-menu {

            width: 36px;

          }



          .kf-mobile-shell-language {

            width: 78px;

            min-width: 78px;

            max-width: 78px;

            height: 36px;

            padding: 0 18px 0 10px;

            box-sizing: border-box;

            font-size: 10px;

            font-weight: 800;

            line-height: 1;

            white-space: nowrap;

            overflow: hidden;

            appearance: none;

            -webkit-appearance: none;

            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1 5 5 9 1' fill='none' stroke='%2393abc0' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");

            background-repeat: no-repeat;

            background-position: right 7px center;

            background-size: 9px 6px;

          }



          .kf-mobile-shell-top-spacer {

            /* Reduce the dead band beneath the fixed app header. */
            height: 64px;

          }



          .kf-mobile-shell-bottom-nav {

            width: calc(100% - 10px);

            min-height: 76px;

            bottom: calc(6px + env(safe-area-inset-bottom));

          }



          .kf-mobile-shell-bottom-item {

            font-size: 7.7px;

            border-radius: 15px;

          }



          .kf-mobile-shell-bottom-item > span:last-child {

            max-width: 62px;

          }



          .kf-mobile-shell-bottom-icon {

            width: 32px;

            height: 32px;

          }



          .kf-mobile-shell-bottom-item.is-report .kf-mobile-shell-bottom-icon {

            width: 48px;

            height: 48px;

          }

        }

      `}</style>

    </>

  );

}
