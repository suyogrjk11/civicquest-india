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
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson";

/*
 * Lakshadweep is rendered from its dedicated GeoJSON dataset as well.
 * At India-wide scale, very small island geometries can be simplified
 * or become visually negligible in the whole-country dataset.
 * This overlay uses the actual Lakshadweep geometry — no fake shapes.
 */
const LAKSHADWEEP_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [74.101309779322889, 11.204314719848469],
          [74.082077180217766, 11.202950491472052],
          [74.052196187204345, 11.213123219560998],
          [74.011678779252293, 11.240625850202889],
          [73.995932946148628, 11.25583684749256],
          [73.978239053789366, 11.27990122156416],
          [73.965056744473259, 11.305959030185136],
          [73.962622291385685, 11.321640574353069],
          [73.967280793973543, 11.336865941909764],
          [73.97830933310928, 11.347660570079313],
          [73.991425607006192, 11.352093635113192],
          [74.01207805575774, 11.348536335283711],
          [74.050197475433208, 11.330733370448741],
          [74.0728253588033, 11.314894737202394],
          [74.089973290734861, 11.297792730949823],
          [74.107800818752821, 11.275057195133513],
          [74.117623699773958, 11.257793895471934],
          [74.123133452047227, 11.234720611167347],
          [74.121299741589837, 11.223593521623798],
          [74.112931865613177, 11.210933927958479],
          [74.101309779322889, 11.204314719848469],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [71.844857797449436, 11.835468855803128],
          [71.840101043028767, 11.82145600728893],
          [71.814885159922255, 11.831285994752932],
          [71.795554844080868, 11.831354329738588],
          [71.782011779819811, 11.835288960816911],
          [71.761024795857679, 11.872320707134975],
          [71.755074740007274, 11.917343189736471],
          [71.750049055019929, 11.931371188229775],
          [71.732904585478309, 11.947071759354287],
          [71.734454446515542, 11.961092020980061],
          [71.773353818523958, 12.003507835718096],
          [71.785957407808155, 12.002117954180278],
          [71.800803091489513, 11.970430628770544],
          [71.808479487738225, 11.939974915909715],
          [71.816563574549377, 11.927220390708499],
          [71.830676361125199, 11.893005665479109],
          [71.831535051801268, 11.882546551881887],
          [71.840494366022256, 11.842961373968308],
          [71.844857797449436, 11.835468855803128],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.264894889687469, 10.011303618267391],
          [72.240689633220029, 10.007611996596438],
          [72.235015264542881, 10.016960460057248],
          [72.244512762753857, 10.0559334002063],
          [72.260213752962386, 10.0722578912887],
          [72.269262935536119, 10.077306807563161],
          [72.276325231524254, 10.09306288574362],
          [72.313461578888791, 10.121405012831133],
          [72.322927533379016, 10.136910172066848],
          [72.334204478753747, 10.130994964945728],
          [72.342245587863658, 10.099277400731523],
          [72.334292596126488, 10.078768196894828],
          [72.322649959428134, 10.056417217480657],
          [72.301202272566854, 10.029964434710962],
          [72.28522847121701, 10.02362655432205],
          [72.264894889687469, 10.011303618267391],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.178781370164131, 11.49134833355879],
          [72.161355879570237, 11.493218072655964],
          [72.147330462131151, 11.503337667899132],
          [72.138740299825031, 11.523753453758957],
          [72.137088990764369, 11.552426715720401],
          [72.151397762996396, 11.579465822289933],
          [72.166320484402888, 11.601763917071139],
          [72.175558450861899, 11.606670047085061],
          [72.190568794114597, 11.599922651409258],
          [72.195163917880564, 11.590508117455727],
          [72.190118982904778, 11.551654510147557],
          [72.195122295457622, 11.495777870552331],
          [72.178781370164131, 11.49134833355879],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.095625533791406, 11.192404333393313],
          [72.083030696709329, 11.141682547511607],
          [72.075586776108878, 11.129400562086346],
          [72.059559717806792, 11.1218992674373],
          [72.04312383579645, 11.128177446332131],
          [72.025477755893803, 11.160730859341754],
          [72.001278364804762, 11.191560650603606],
          [72.009781450253797, 11.193848625713542],
          [72.025480851360271, 11.187651257199832],
          [72.067114339555189, 11.192854604156707],
          [72.077908233877963, 11.198001706613525],
          [72.102894499381705, 11.21791065884986],
          [72.095625533791406, 11.192404333393313],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [71.900911032418264, 12.285319025152944],
          [71.891467929701264, 12.288278496155726],
          [71.88882237065593, 12.300811967997959],
          [71.88999348041483, 12.32044668007029],
          [71.883312623778636, 12.335726659857528],
          [71.883552769744597, 12.354292613113671],
          [71.879892500238725, 12.393948084736394],
          [71.897445618120855, 12.403049041280269],
          [71.920417763768853, 12.387808628065784],
          [71.926430487976688, 12.378152286199111],
          [71.925803524712933, 12.345844413289115],
          [71.919837128180973, 12.316375651515159],
          [71.906816363184646, 12.289286726101579],
          [71.900911032418264, 12.285319025152944],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [73.06269421826363, 8.328953440948567],
          [73.080647457114537, 8.329399515475302],
          [73.079516752995801, 8.319790476149592],
          [73.068439401357352, 8.298321842279222],
          [73.069798458632022, 8.283024219592107],
          [73.049886335386134, 8.261878896493954],
          [73.039970825093576, 8.260258111322855],
          [73.016205845223624, 8.265762993767225],
          [73.007604286708499, 8.275436858024648],
          [73.006749364191876, 8.297794891720912],
          [73.01032622607454, 8.302522946077147],
          [73.052710784874876, 8.328651482779776],
          [73.06269421826363, 8.328953440948567],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [73.645936249158638, 10.05336895821091],
          [73.640187917538412, 10.054916766095914],
          [73.621510279276038, 10.075126411154997],
          [73.620215882357115, 10.103152906781247],
          [73.634853176932609, 10.120285448614595],
          [73.643983588971537, 10.136125626896217],
          [73.658619460819523, 10.15462929850338],
          [73.665929177389671, 10.138009508731898],
          [73.653875177297664, 10.105942591177666],
          [73.649297584016324, 10.078785367650653],
          [73.649728778360497, 10.060895844867389],
          [73.645936249158638, 10.05336895821091],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.647077402700006, 10.577804855609656],
          [72.65098117713967, 10.56110169148991],
          [72.615383666922753, 10.541626612678101],
          [72.61533041176915, 10.552528710731451],
          [72.632555381425789, 10.578309656765271],
          [72.647077402700006, 10.577804855609656],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [73.669953721786896, 10.816875162258953],
          [73.69975730115857, 10.816468326951792],
          [73.703875619664188, 10.811481884781188],
          [73.677694862927638, 10.800505480243771],
          [73.663019893053672, 10.801565611863566],
          [73.661202734618541, 10.816459259087594],
          [73.669953721786896, 10.816875162258953],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [73.009444167414472, 11.467001564270845],
          [73.000299871641801, 11.477912184299896],
          [72.997250287670681, 11.4918148038102],
          [73.010911925744836, 11.487840731164852],
          [73.013068143879821, 11.470654753414181],
          [73.009444167414472, 11.467001564270845],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.718915312491731, 11.695228647883823],
          [72.709110090558283, 11.679229455075358],
          [72.699957981475734, 11.688036625589859],
          [72.707935646113242, 11.700316800679843],
          [72.718915312491731, 11.695228647883823],
        ]]],
      },
    },
    {
      type: "Feature",
      properties: { ST_NM: "Lakshadweep" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [[[
          [72.721910554028909, 11.111532210243354],
          [72.716804708870256, 11.120331942465214],
          [72.722182160977979, 11.130025418238517],
          [72.733130769269621, 11.124641149269678],
          [72.721910554028909, 11.111532210243354],
        ]]],
      },
    },
  ],
} as const;

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
  "#9fc8ea",
  "#c7b5e8",
  "#a9d9b4",
  "#f3c08e",
  "#8fc4e9",
  "#f1cf82",
  "#b8d9ef",
  "#d3a9e6",
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
/* ISLAND TERRITORY MARKERS                                   */
/* ========================================================= */

const islandTerritories = new Set([
  "Andaman and Nicobar Islands",
  "Lakshadweep",
  "Dadra and Nagar Haveli and Daman and Diu",
]);

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
          background: "#ffffff",
          border: "1px solid #e4e8ed",
          boxShadow: "0 24px 60px rgba(16,32,51,0.14)",
          overflow: "hidden",
          fontFamily: "'Quicksand', sans-serif",
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
          className="kf-map-state-panel-header"
          style={{
            padding:
              "20px 20px 17px",
            background:
              "linear-gradient(135deg, #fff4e8 0%, #ffffff 72%)",
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
                className="kf-map-state-panel-type"
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
                className="kf-map-state-panel-name"
                style={{
                  color: "#102033",
                  fontSize:
                    "25px",
                  fontWeight:
                    900,
                  lineHeight:
                    1.12,
                  overflowWrap:
                    "anywhere",
                  fontFamily: "'Baloo 2', sans-serif",
                }}
              >
                {displayName}
              </div>
            </div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="kf-map-state-panel-close"
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
                border: "1px solid #dbe1e8",
                background: "#f8f3ea",
                color: "#102033",
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
            className="kf-map-state-panel-capital"
            style={{
              marginTop:
                "14px",
              color: "#334155",
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
          className="kf-map-state-panel-details"
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
            className="kf-map-state-panel-languages"
            style={{
              marginTop:
                "10px",
              padding:
                "13px 14px",
              borderRadius:
                "13px",
              background: "#fff4e8",
              border: "1px solid #f5d6b8",
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
                color: "#102033",
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
              background: "linear-gradient(135deg, #fff0df, #fff8f1)",
              color: "#102033",
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
              background: "#f3effa",
              border: "1px solid #e4dff0",
              color: "#64748b",
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
          className="kf-know-india-map-canvas"
          style={{
            position:
              "relative",
            width:
              "100%",
            borderRadius:
              "30px",
            background: "#102033",
            border: "1px solid #24364a",
            boxShadow: "0 24px 70px rgba(16,32,51,0.10)",
            overflow: "visible",
          }}
        >
          {/* MAP TITLE */}

          <div
            className="kf-know-india-map-title"
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
              className="kf-map-title-eyebrow"
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
              className="kf-map-title-hint"
              style={{
                color: "#cbd5e1",
                fontSize:
                  "13px",
              }}
            >
              {text.hoverHint}
            </div>
          </div>

          {/* MAP */}

          <div
            className="kf-know-india-map-svg-wrap"
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
                          ? "#ff7a00"
                          : islandTerritories.has(
                                stateName
                            )
                            ? isHovered &&
                              !selectedState
                              ? "#8bd09a"
                              : "#62b878"
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
                          className={`kf-map-state kf-map-color-${index % mapColors.length}${isSelected ? " kf-map-state-selected" : isActive ? " kf-map-state-active" : ""}`}

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
                              ? "#ff9a3d"
                              : "#ffffff"
                          }

                          strokeWidth={
                            isActive
                              ? 2
                              : 1.2
                          }

                          opacity={
                            islandTerritories.has(
                              stateName
                            )
                              ? 1
                              : selectedState &&
                                !isSelected
                                ? isHovered
                                  ? 1
                                  : 0.9
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

              {/* ================================================= */}
              {/* LAKSHADWEEP — DEDICATED REAL GEOMETRY OVERLAY    */}
              {/* ================================================= */}

              <Geographies
                geography={
                  LAKSHADWEEP_GEOJSON
                }
              >
                {({
                  geographies,
                }) =>
                  geographies.map(
                    (geo) => {
                      const stateName =
                        "Lakshadweep";

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

                      return (
                        <Geography
                          key={`lakshadweep-${geo.rsmKey}`}
                          geography={geo}
                          className={`kf-map-state kf-map-state-island kf-map-color-2${isSelected ? " kf-map-state-selected" : isActive ? " kf-map-state-active" : ""}`}
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
                          onMouseEnter={(event) =>
                            handleHover(
                              stateName,
                              event.clientX,
                              event.clientY
                            )
                          }
                          onMouseMove={(event) =>
                            handleHover(
                              stateName,
                              event.clientX,
                              event.clientY
                            )
                          }
                          onMouseLeave={() =>
                            handleLeave()
                          }
                          onFocus={() =>
                            handleHover(
                              stateName
                            )
                          }
                          onBlur={() =>
                            handleLeave()
                          }
                          onClick={(event) =>
                            handleClick(
                              stateName,
                              event.currentTarget
                            )
                          }
                          fill={
                            isSelected
                              ? "#ff7a00"
                              : isHovered &&
                                !selectedState
                              ? "#8bd09a"
                              : "#62b878"
                          }
                          stroke={
                            isActive
                              ? "#ff9a3d"
                              : "#ffffff"
                          }
                          strokeWidth={
                            isActive
                              ? 2
                              : 1.2
                          }
                          opacity={1}
                          style={{
                            outline: "none",
                            cursor: "pointer",
                            transition:
                              "fill 120ms ease, stroke 120ms ease",
                          }}
                          tabIndex={0}
                          aria-label={
                            getStateData(
                              stateName
                            )?.localizedName[
                              language
                            ] || stateName
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
                    className="kf-map-capital-core"
                    r={7}
                    fill="white"
                    stroke="#ff7a00"
                    strokeWidth={3}
                    pointerEvents="none"
                  />

                  <circle
                    className="kf-map-capital-ring"
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
                className="kf-know-india-hover-card"
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
                  background: "#ffffff",
                  border: "1px solid #f0c9a6",
                  boxShadow: "0 18px 45px rgba(16,32,51,0.16)",
                  pointerEvents:
                    "none",
                  zIndex: 30,
                }}
              >
                {/* LOCALIZED TYPE */}

                <div
                  className="kf-map-hover-type"
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
                  className="kf-map-hover-name"
                  style={{
                    color: "#102033",
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
                  className="kf-map-hover-capital"
                  style={{
                    marginTop:
                      "5px",
                    color: "#64748b",
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
            className="kf-know-india-map-footer"
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
              borderTop: "1px solid #e5e9ee",
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
      className="kf-know-india-info-box"
      style={{
        minWidth: 0,
        padding:
          "12px 13px",
        borderRadius:
          "13px",
        background: "#f4f7fa",
        border: "1px solid #e4e8ed",
      }}
    >
      <div
        className="kf-know-india-info-label"
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
        className="kf-know-india-info-value"
        style={{
          color: "#102033",
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