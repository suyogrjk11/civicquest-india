"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useState } from "react";

import StateSpotlight from "./StateSpotlight";

import {
  INDIA_STATE_MAP,
  type IndiaState,
  type Language,
} from "@/lib/india-state-data";

type IndiaMapProps = {
  language: Language;
};

const INDIA_GEOJSON =
  "https://raw.githubusercontent.com/india-in-data/india-states-2019/master/india_states.geojson";

/* ========================================================= */
/* TRANSLATIONS                                               */
/* ========================================================= */

const translated: Record<
  Language,
  {
    states: string;
    unionTerritories: string;
    hoverHint: string;
    clickHint: string;
    stateLabel: string;
    utLabel: string;
    close: string;
    capital: string;
    region: string;
    area: string;
    population: string;
    languages: string;
    populationSource: string;
    stateType: string;
    selectState: string;
    selectedHint: string;
  }
> = {
  en: {
    states: "States",
    unionTerritories: "Union Territories",
    hoverHint: "Hover over a state to discover it.",
    clickHint: "Click a state for more information.",
    stateLabel: "STATE",
    utLabel: "UNION TERRITORY",
    close: "Close",
    capital: "Capital",
    region: "Region",
    area: "Area",
    population: "Population",
    languages: "Major languages",
    populationSource: "Population reference: Census 2011",
    stateType: "Type",
    selectState: "Select a state or Union Territory",
    selectedHint: "Click the selected state again to close.",
  },

  hi: {
    states: "राज्य",
    unionTerritories: "केंद्र शासित प्रदेश",
    hoverHint:
      "किसी राज्य पर कर्सर ले जाकर उसकी जानकारी देखें।",
    clickHint:
      "अधिक जानकारी के लिए किसी राज्य पर क्लिक करें।",
    stateLabel: "राज्य",
    utLabel: "केंद्र शासित प्रदेश",
    close: "बंद करें",
    capital: "राजधानी",
    region: "क्षेत्र",
    area: "क्षेत्रफल",
    population: "जनसंख्या",
    languages: "प्रमुख भाषाएँ",
    populationSource:
      "जनसंख्या संदर्भ: जनगणना 2011",
    stateType: "प्रकार",
    selectState:
      "किसी राज्य या केंद्र शासित प्रदेश को चुनें",
    selectedHint:
      "पैनल बंद करने के लिए उसी राज्य पर फिर से क्लिक करें।",
  },

  mr: {
    states: "राज्ये",
    unionTerritories: "केंद्रशासित प्रदेश",
    hoverHint:
      "एखाद्या राज्यावर कर्सर नेऊन त्याची माहिती पाहा.",
    clickHint:
      "अधिक माहितीसाठी एखाद्या राज्यावर क्लिक करा.",
    stateLabel: "राज्य",
    utLabel: "केंद्रशासित प्रदेश",
    close: "बंद करा",
    capital: "राजधानी",
    region: "प्रदेश",
    area: "क्षेत्रफळ",
    population: "लोकसंख्या",
    languages: "प्रमुख भाषा",
    populationSource:
      "लोकसंख्या संदर्भ: जनगणना 2011",
    stateType: "प्रकार",
    selectState:
      "राज्य किंवा केंद्रशासित प्रदेश निवडा",
    selectedHint:
      "पॅनेल बंद करण्यासाठी त्याच राज्यावर पुन्हा क्लिक करा.",
  },
};

/* ========================================================= */
/* MAP COLORS                                                 */
/* ========================================================= */

const mapColors = [
  "#172554",
  "#1e293b",
  "#1e3a5f",
  "#312e81",
  "#263449",
  "#1f2937",
  "#29354d",
  "#243447",
];

/* ========================================================= */
/* CAPITAL COORDINATES                                        */
/* ========================================================= */

const capitalCoordinates: Record<
  string,
  [number, number]
> = {
  "Andhra Pradesh": [80.6321, 16.5151],
  "Arunachal Pradesh": [93.6053, 27.0844],
  Assam: [91.7898, 26.1433],
  Bihar: [85.1376, 25.5941],
  Chhattisgarh: [81.6296, 21.2514],
  Goa: [73.8278, 15.4909],
  Gujarat: [72.6369, 23.2156],
  Haryana: [76.7794, 30.7333],
  "Himachal Pradesh": [77.1734, 31.1048],
  Jharkhand: [85.3096, 23.3441],
  Karnataka: [77.5946, 12.9716],
  Kerala: [76.9366, 8.5241],
  "Madhya Pradesh": [77.4126, 23.2599],
  Maharashtra: [72.8777, 19.076],
  Manipur: [93.9368, 24.817],
  Meghalaya: [91.8933, 25.5788],
  Mizoram: [92.7176, 23.7271],
  Nagaland: [94.1086, 25.6751],
  Odisha: [85.8245, 20.2961],
  Punjab: [76.7794, 30.7333],
  Rajasthan: [75.7873, 26.9124],
  Sikkim: [88.6138, 27.3314],
  "Tamil Nadu": [80.2707, 13.0827],
  Telangana: [78.4867, 17.385],
  Tripura: [91.2868, 23.8315],
  "Uttar Pradesh": [80.9462, 26.8467],
  Uttarakhand: [78.0322, 30.3165],
  "West Bengal": [88.3639, 22.5726],

  "Andaman and Nicobar Islands": [92.7265, 11.6234],
  Chandigarh: [76.7794, 30.7333],
  "Dadra and Nagar Haveli and Daman and Diu": [
    72.8328,
    20.3974,
  ],
  Delhi: [77.209, 28.6139],
  "Jammu and Kashmir": [74.7973, 34.0837],
  Ladakh: [77.5771, 34.1526],
  Lakshadweep: [72.6358, 10.5593],
  Puducherry: [79.8083, 11.9416],
};

/* ========================================================= */
/* TYPES                                                       */
/* ========================================================= */

type PanelSide = "left" | "right";

type HoverPoint = {
  x: number;
  y: number;
};

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function normalizeStateName(rawName: string) {
  const name = rawName.trim();

  const aliases: Record<string, string> = {
    "Jammu & Kashmir": "Jammu and Kashmir",

    "NCT of Delhi": "Delhi",

    "Dadra & Nagar Haveli and Daman & Diu":
      "Dadra and Nagar Haveli and Daman and Diu",

    "Dadra and Nagar Haveli":
      "Dadra and Nagar Haveli and Daman and Diu",

    "Daman and Diu":
      "Dadra and Nagar Haveli and Daman and Diu",

    Orissa: "Odisha",

    Pondicherry: "Puducherry",

    Pondicherri: "Puducherry",
  };

  return aliases[name] || name;
}

function getStateName(geo: {
  properties?: {
    [key: string]: unknown;
  } | null;
}) {
  const properties = geo.properties || {};

  const possibleNames = [
    properties.ST_NM,
    properties.STNAME,
    properties.st_nm,
    properties.st_name,
    properties.name,
    properties.NAME_1,
    properties.NAME,
  ];

  for (const value of possibleNames) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return normalizeStateName(value);
    }
  }

  return "";
}

function getStateData(
  stateName: string
): IndiaState | null {
  return INDIA_STATE_MAP[stateName] || null;
}

function getCapitalCoordinates(
  stateName: string
): [number, number] {
  return (
    capitalCoordinates[stateName] || [
      78,
      22,
    ]
  );
}

function getPanelSide(
  element: Element,
  mapElement: HTMLElement
): PanelSide {
  const stateRect =
    element.getBoundingClientRect();

  const mapRect =
    mapElement.getBoundingClientRect();

  const stateCenterX =
    stateRect.left +
    stateRect.width / 2;

  const mapCenterX =
    mapRect.left +
    mapRect.width / 2;

  return stateCenterX < mapCenterX
    ? "left"
    : "right";
}

function getPanelTop(
  element: Element,
  mapElement: HTMLElement
) {
  const stateRect =
    element.getBoundingClientRect();

  const mapRect =
    mapElement.getBoundingClientRect();

  const stateCenterY =
    stateRect.top +
    stateRect.height / 2 -
    mapRect.top;

  const estimatedPanelHeight = 470;
  const padding = 16;

  const maxTop = Math.max(
    padding,
    mapRect.height -
      estimatedPanelHeight -
      padding
  );

  return clamp(
    stateCenterY -
      estimatedPanelHeight / 2,
    padding,
    maxTop
  );
}

function getHoverPosition(
  clientX: number,
  clientY: number,
  mapElement: HTMLElement
): HoverPoint {
  const rect =
    mapElement.getBoundingClientRect();

  const cardWidth = 220;
  const cardHeight = 98;
  const padding = 12;

  const cursorX =
    clientX - rect.left;

  const cursorY =
    clientY - rect.top;

  let x = cursorX + 18;
  let y = cursorY - 48;

  if (
    x + cardWidth >
    rect.width - padding
  ) {
    x =
      cursorX -
      cardWidth -
      18;
  }

  if (x < padding) {
    x = padding;
  }

  if (y < 70) {
    y = cursorY + 18;
  }

  if (
    y + cardHeight >
    rect.height - padding
  ) {
    y =
      rect.height -
      cardHeight -
      padding;
  }

  if (y < 70) {
    y = 70;
  }

  return {
    x,
    y,
  };
}

/* ========================================================= */
/* COMPONENT                                                   */
/* ========================================================= */

export default function IndiaMap({
  language,
}: IndiaMapProps) {
  const text = translated[language];

  const [hoveredState, setHoveredState] =
    useState<string | null>(null);

  const [selectedState, setSelectedState] =
    useState<string | null>(null);

  const [
    selectedPanelSide,
    setSelectedPanelSide,
  ] = useState<PanelSide>("right");

  const [
    selectedPanelTop,
    setSelectedPanelTop,
  ] = useState(16);

  const [
    hoverPosition,
    setHoverPosition,
  ] = useState<HoverPoint>({
    x: 24,
    y: 90,
  });

  const [
    mapElement,
    setMapElement,
  ] = useState<HTMLDivElement | null>(
    null
  );

  /*
   * IMPORTANT:
   *
   * The map keeps the English state name internally
   * because that is what the GeoJSON uses.
   *
   * The displayed name/capital is taken from
   * INDIA_STATE_MAP and changes according
   * to the selected language.
   */

  const selectedInfo =
    selectedState
      ? getStateData(selectedState)
      : null;

  const activeState =
    selectedState || hoveredState;

  const activeInfo =
    activeState
      ? getStateData(activeState)
      : null;

  function getDisplayName(
    info: IndiaState
  ) {
    return info.localizedName[
      language
    ];
  }

  function getDisplayCapital(
    info: IndiaState
  ) {
    return info.localizedCapital[
      language
    ];
  }

  function clearSelection() {
    setSelectedState(null);
    setHoveredState(null);
  }

  function handleHover(
    stateName: string,
    clientX?: number,
    clientY?: number
  ) {
    if (!stateName) {
      return;
    }

    /*
     * Only use states that exist in our
     * shared data file.
     */
    if (!getStateData(stateName)) {
      return;
    }

    setHoveredState(stateName);

    if (
      mapElement &&
      typeof clientX === "number" &&
      typeof clientY === "number"
    ) {
      setHoverPosition(
        getHoverPosition(
          clientX,
          clientY,
          mapElement
        )
      );
    }
  }

  function handleLeave() {
    if (!selectedState) {
      setHoveredState(null);
    } else {
      setHoveredState(null);
    }
  }

  function handleClick(
    stateName: string,
    element: Element
  ) {
    if (
      !stateName ||
      !mapElement
    ) {
      return;
    }

    if (
      !getStateData(stateName)
    ) {
      return;
    }

    /*
     * Click same state again = close.
     */
    if (
      selectedState === stateName
    ) {
      clearSelection();
      return;
    }

    setSelectedState(stateName);
    setHoveredState(null);

    setSelectedPanelSide(
      getPanelSide(
        element,
        mapElement
      )
    );

    setSelectedPanelTop(
      getPanelTop(
        element,
        mapElement
      )
    );
  }

  /* ======================================================= */
  /* SELECTED STATE PANEL                                    */
  /* ======================================================= */

  function renderStatePanel(
    info: IndiaState
  ) {
    const displayName =
      getDisplayName(info);

    const displayCapital =
      getDisplayCapital(info);

    return (
      <div
        style={{
          width: "330px",
          maxWidth: "100%",
          marginTop:
            selectedPanelTop,
          borderRadius: "22px",
          background:
            "rgba(15,23,42,0.98)",
          border:
            "1px solid rgba(255,122,0,0.45)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55)",
          backdropFilter:
            "blur(18px)",
          overflow: "hidden",
        }}
      >
        {/* ORANGE TOP LINE */}

        <div
          style={{
            height: "5px",
            background: "#ff7a00",
          }}
        />

        {/* HEADER */}

        <div
          style={{
            padding:
              "20px 20px 17px",
            background:
              "linear-gradient(135deg, rgba(255,122,0,0.11), rgba(255,122,0,0))",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  color:
                    "#ff7a00",
                  fontSize:
                    "10px",
                  fontWeight: 800,
                  letterSpacing:
                    "1.2px",
                  marginBottom:
                    "6px",
                }}
              >
                {info.type ===
                "State"
                  ? text.stateLabel
                  : text.utLabel}
              </div>

              {/* LOCALIZED STATE NAME */}

              <div
                style={{
                  color: "white",
                  fontSize:
                    "25px",
                  fontWeight:
                    900,
                  lineHeight:
                    1.12,
                  overflowWrap:
                    "anywhere",
                }}
              >
                {displayName}
              </div>
            </div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              aria-label={
                text.close
              }
              onClick={
                clearSelection
              }
              style={{
                width: "34px",
                height: "34px",
                flexShrink: 0,
                borderRadius:
                  "50%",
                border:
                  "1px solid #334155",
                background:
                  "#020617",
                color:
                  "#cbd5e1",
                cursor:
                  "pointer",
                fontSize:
                  "19px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* LOCALIZED CAPITAL */}

          <div
            style={{
              marginTop:
                "14px",
              color:
                "#e2e8f0",
              fontSize:
                "14px",
              fontWeight:
                700,
              lineHeight:
                1.45,
            }}
          >
            📍 {text.capital}:{" "}
            {displayCapital}
          </div>
        </div>

        {/* DETAILS */}

        <div
          style={{
            padding:
              "16px",
          }}
        >
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "10px",
            }}
          >
            <InfoBox
              label={
                text.region
              }
              value={
                info.region
              }
            />

            <InfoBox
              label={
                text.stateType
              }
              value={
                info.type ===
                "State"
                  ? text.stateLabel
                  : text.utLabel
              }
            />

            <InfoBox
              label={
                text.area
              }
              value={
                info.area
              }
            />

            <InfoBox
              label={
                text.population
              }
              value={
                info.population2011
              }
            />
          </div>

          {/* LANGUAGES */}

          <div
            style={{
              marginTop:
                "10px",
              padding:
                "13px 14px",
              borderRadius:
                "13px",
              background:
                "rgba(255,122,0,0.05)",
              border:
                "1px solid rgba(255,122,0,0.15)",
            }}
          >
            <div
              style={{
                color:
                  "#64748b",
                fontSize:
                  "10px",
                fontWeight:
                  800,
                letterSpacing:
                  "0.8px",
                textTransform:
                  "uppercase",
                marginBottom:
                  "6px",
              }}
            >
              {text.languages}
            </div>

            <div
              style={{
                color:
                  "#f8fafc",
                fontSize:
                  "13px",
                fontWeight:
                  600,
                lineHeight:
                  1.5,
              }}
            >
              {info.majorLanguages}
            </div>
          </div>

          {/* POPULATION SOURCE */}

          <div
            style={{
              marginTop:
                "14px",
              color:
                "#64748b",
              fontSize:
                "10px",
              lineHeight:
                1.55,
            }}
          >
            {text.populationSource}

            {info.populationNote && (
              <>
                <br />
                {info.populationNote}
              </>
            )}
          </div>

          {/* CLOSE HINT */}

          <button
            type="button"
            onClick={() => {
              document
                .getElementById("state-spotlight")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            style={{
              width: "100%",
              marginTop: "14px",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,122,0,0.55)",
              background: "linear-gradient(135deg, rgba(255,122,0,0.18), rgba(255,122,0,0.06))",
              color: "#fff7ed",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 800,
              textAlign: "left",
            }}
          >
            🔎 {language === "hi" ? "इस राज्य के बारे में और जानें ↓" : language === "mr" ? "या राज्याबद्दल अधिक जाणून घ्या ↓" : `Explore ${displayName} ↓`}
          </button>

          <div
            style={{
              marginTop: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#94a3b8",
              fontSize: "10px",
              lineHeight: 1.5,
            }}
          >
            👆 {text.selectedHint}
          </div>
        </div>
      </div>
    );
  }

  /* ======================================================= */
  /* RENDER                                                    */
  /* ======================================================= */

  return (
    <div
      style={{
        width: "100%",
        maxWidth:
          "1500px",
        margin:
          "0 auto",
      }}
    >
      <div
        className={
          selectedInfo
            ? "grid grid-cols-1 gap-5 lg:grid-cols-[330px_minmax(0,1fr)_330px] lg:items-start"
            : "grid grid-cols-1 gap-5"
        }
      >
        {/* ================================================= */
        /* LEFT PANEL                                         */
        /* ================================================= */}

        <div>
          {selectedInfo &&
            selectedPanelSide ===
              "left" &&
            renderStatePanel(
              selectedInfo
            )}
        </div>

        {/* ================================================= */
        /* MAP                                                */
        /* ================================================= */}

        <div
          ref={setMapElement}
          style={{
            position:
              "relative",
            width:
              "100%",
            borderRadius:
              "30px",
            background:
              "radial-gradient(circle at 50% 38%, rgba(37,99,235,0.16), rgba(2,6,23,0) 56%), #020617",
            border:
              "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 30px 100px rgba(0,0,0,0.45)",
            overflow:
              "visible",
          }}
        >
          {/* MAP TITLE */}

          <div
            style={{
              position:
                "absolute",
              top:
                "22px",
              left:
                "24px",
              zIndex:
                20,
              pointerEvents:
                "none",
            }}
          >
            <div
              style={{
                color:
                  "#ff7a00",
                fontSize:
                  "12px",
                fontWeight:
                  800,
                letterSpacing:
                  "1.5px",
                marginBottom:
                  "7px",
              }}
            >
              {text.states.toUpperCase()} ·{" "}
              {text.unionTerritories.toUpperCase()}
            </div>

            <div
              style={{
                color:
                  "#cbd5e1",
                fontSize:
                  "13px",
              }}
            >
              {text.hoverHint}
            </div>
          </div>

          {/* MAP */}

          <div
            style={{
              width:
                "100%",
              padding:
                "78px 10px 18px",
            }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale:
                  820,
                center: [
                  79,
                  22.5,
                ],
              }}
              width={900}
              height={720}
              style={{
                width:
                  "100%",
                height:
                  "auto",
                display:
                  "block",
              }}
            >
              <Geographies
                geography={
                  INDIA_GEOJSON
                }
              >
                {({
                  geographies,
                }) =>
                  geographies.map(
                    (
                      geo,
                      index
                    ) => {
                      const stateName =
                        getStateName(
                          geo
                        );

                      const stateData =
                        getStateData(
                          stateName
                        );

                      /*
                       * Ignore any GeoJSON shapes
                       * that aren't represented in
                       * our 36-entry data set.
                       */
                      if (
                        !stateData
                      ) {
                        return null;
                      }

                      const isSelected =
                        selectedState ===
                        stateName;

                      const isHovered =
                        hoveredState ===
                        stateName;

                      const isActive =
                        isSelected ||
                        (
                          isHovered &&
                          !selectedState
                        );

                      const fill =
                        isSelected
                          ? "#ea580c"
                          : isHovered &&
                            !selectedState
                            ? "#ff7a00"
                            : mapColors[
                                index %
                                  mapColors.length
                              ];

                      return (
                        <Geography
                          key={
                            geo.rsmKey
                          }
                          geography={
                            geo
                          }

                          /* POINTER EVENTS */

                          onPointerEnter={() =>
                            handleHover(
                              stateName
                            )
                          }

                          onPointerMove={() =>
                            handleHover(
                              stateName
                            )
                          }

                          onPointerLeave={() =>
                            handleLeave()
                          }

                          /* MOUSE EVENTS */

                          onMouseEnter={(
                            event
                          ) =>
                            handleHover(
                              stateName,
                              event.clientX,
                              event.clientY
                            )
                          }

                          onMouseMove={(
                            event
                          ) =>
                            handleHover(
                              stateName,
                              event.clientX,
                              event.clientY
                            )
                          }

                          onMouseLeave={() =>
                            handleLeave()
                          }

                          /* KEYBOARD */

                          onFocus={() =>
                            handleHover(
                              stateName
                            )
                          }

                          onBlur={() =>
                            handleLeave()
                          }

                          /* CLICK */

                          onClick={(
                            event
                          ) =>
                            handleClick(
                              stateName,
                              event.currentTarget
                            )
                          }

                          fill={
                            fill
                          }

                          stroke={
                            isActive
                              ? "#fed7aa"
                              : "#64748b"
                          }

                          strokeWidth={
                            isActive
                              ? 1.6
                              : 0.6
                          }

                          opacity={
                            selectedState &&
                            !isSelected
                              ? isHovered
                                ? 0.88
                                : 0.55
                              : 1
                          }

                          style={{
                            outline:
                              "none",
                            cursor:
                              "pointer",
                            transition:
                              "fill 120ms ease, stroke 120ms ease, opacity 120ms ease",
                          }}

                          tabIndex={
                            0
                          }

                          /*
                           * Accessible label is
                           * ALSO translated.
                           */
                          aria-label={
                            stateData
                              .localizedName[
                                language
                              ]
                          }
                        />
                      );
                    }
                  )
                }
              </Geographies>

              {/* =========================================== */}
              {/* CAPITAL MARKER                               */}
              {/* =========================================== */}

              {activeInfo && (
                <Marker
                  coordinates={
                    getCapitalCoordinates(
                      activeInfo.name
                    )
                  }
                >
                  <circle
                    r={7}
                    fill="white"
                    stroke="#ff7a00"
                    strokeWidth={3}
                    pointerEvents="none"
                  />

                  <circle
                    r={13}
                    fill="none"
                    stroke="#ff7a00"
                    strokeWidth={2}
                    opacity={0.65}
                    pointerEvents="none"
                  >
                    <animate
                      attributeName="r"
                      values="9;18;9"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />

                    <animate
                      attributeName="opacity"
                      values="0.7;0;0.7"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </Marker>
              )}
            </ComposableMap>
          </div>

          {/* ================================================= */
          /* HOVER CARD                                         */
          /* ================================================= */}

          {hoveredState &&
            activeInfo &&
            !selectedState && (
              <div
                style={{
                  position:
                    "absolute",
                  left:
                    `${hoverPosition.x}px`,
                  top:
                    `${hoverPosition.y}px`,
                  width:
                    "210px",
                  padding:
                    "12px 14px",
                  borderRadius:
                    "15px",
                  background:
                    "rgba(15,23,42,0.97)",
                  border:
                    "1px solid rgba(255,122,0,0.52)",
                  boxShadow:
                    "0 18px 50px rgba(0,0,0,0.35)",
                  backdropFilter:
                    "blur(12px)",
                  pointerEvents:
                    "none",
                  zIndex: 30,
                }}
              >
                {/* LOCALIZED TYPE */}

                <div
                  style={{
                    color:
                      "#ff7a00",
                    fontSize:
                      "9px",
                    fontWeight:
                      800,
                    letterSpacing:
                      "1px",
                    marginBottom:
                      "4px",
                  }}
                >
                  {activeInfo.type ===
                  "State"
                    ? text.stateLabel
                    : text.utLabel}
                </div>

                {/* LOCALIZED STATE NAME */}

                <div
                  style={{
                    color:
                      "white",
                    fontSize:
                      "16px",
                    fontWeight:
                      800,
                    lineHeight:
                      1.25,
                  }}
                >
                  {
                    activeInfo
                      .localizedName[
                        language
                      ]
                  }
                </div>

                {/* LOCALIZED CAPITAL */}

                <div
                  style={{
                    marginTop:
                      "5px",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "12px",
                  }}
                >
                  📍{" "}
                  {
                    text.capital
                  }
                  :{" "}
                  {
                    activeInfo
                      .localizedCapital[
                        language
                      ]
                  }
                </div>
              </div>
            )}

          {/* ================================================= */
          /* MAP FOOTER                                         */
          /* ================================================= */}

          <div
            style={{
              padding:
                "12px 22px 18px",
              display:
                "flex",
              justifyContent:
                "space-between",
              gap:
                "15px",
              flexWrap:
                "wrap",
              color:
                "#64748b",
              fontSize:
                "11px",
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span>
              🖱️ {text.hoverHint}
            </span>

            <span>
              👆 {text.clickHint}
            </span>
          </div>
        </div>

        {/* ================================================= */
        /* RIGHT PANEL                                        */
        /* ================================================= */}

        <div>
          {selectedInfo &&
            selectedPanelSide ===
              "right" &&
            renderStatePanel(
              selectedInfo
            )}
        </div>
      </div>

      {/* =================================================== */}
      {/* MOBILE SELECTED CARD                                */}
      {/* =================================================== */}

      {selectedInfo && (
        <div className="mt-8 block lg:hidden">
          {renderStatePanel(
            selectedInfo
          )}
        </div>
      )}

      {selectedInfo && (
        <StateSpotlight
          state={selectedInfo}
          language={language}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* INFO BOX                                                    */
/* ========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        minWidth: 0,
        padding:
          "12px 13px",
        borderRadius:
          "13px",
        background:
          "rgba(255,255,255,0.035)",
        border:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          color:
            "#64748b",
          fontSize:
            "10px",
          fontWeight:
            800,
          letterSpacing:
            "0.8px",
          textTransform:
            "uppercase",
          marginBottom:
            "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:
            "#e2e8f0",
          fontSize:
            "13px",
          lineHeight:
            1.4,
          fontWeight:
            700,
          overflowWrap:
            "anywhere",
        }}
      >
        {value}
      </div>
    </div>
  );
}