const STATE_ALIASES = {
  "ANDAMAN NICOBAR ISLANDS": "ANDAMAN AND NICOBAR ISLANDS",
  "DADRA NAGAR HAVELI DAMAN DIU":
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DADRA AND NAGAR HAVELI":
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DAMAN DIU": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "JAMMU KASHMIR": "JAMMU AND KASHMIR",
  LAKSHWADEEP: "LAKSHADWEEP",
  "NCT OF DELHI": "DELHI",
  ORISSA: "ODISHA",
  PONDICHERRY: "PUDUCHERRY",
  UTTARANCHAL: "UTTARAKHAND",
};

const REGION_PALETTE = [
  "#f5c04f",
  "#c9d969",
  "#f7aacb",
  "#bca9ff",
  "#ffb86c",
  "#9fd9d9",
  "#ead0ff",
  "#ffde70",
  "#cfe88f",
  "#f4b7a8",
];

const SHAPE_PRESETS = {
  default: [
    [-0.48, -0.15],
    [-0.28, -0.48],
    [0.08, -0.56],
    [0.42, -0.33],
    [0.5, 0.05],
    [0.24, 0.46],
    [-0.1, 0.56],
    [-0.42, 0.24],
  ],
  wide: [
    [-0.52, -0.12],
    [-0.35, -0.42],
    [0.1, -0.5],
    [0.5, -0.22],
    [0.56, 0.08],
    [0.24, 0.4],
    [-0.14, 0.48],
    [-0.5, 0.2],
  ],
  tall: [
    [-0.36, -0.5],
    [-0.08, -0.58],
    [0.22, -0.5],
    [0.42, -0.14],
    [0.3, 0.42],
    [0.06, 0.58],
    [-0.24, 0.48],
    [-0.42, 0.12],
  ],
  slim: [
    [-0.22, -0.56],
    [0.06, -0.6],
    [0.26, -0.28],
    [0.26, 0.2],
    [0.08, 0.58],
    [-0.2, 0.5],
    [-0.28, 0.02],
  ],
  island: [
    [-0.18, -0.5],
    [0.14, -0.42],
    [0.24, -0.06],
    [0.12, 0.34],
    [-0.14, 0.48],
    [-0.26, 0.08],
  ],
};

const MAP_LAYOUT = {
  LADAKH: {
    x: 340,
    y: 95,
    w: 170,
    h: 125,
    variant: "wide",
    label: ["LADAKH"],
    fontSize: 24,
  },
  JAMMU_AND_KASHMIR: {
    x: 230,
    y: 178,
    w: 150,
    h: 140,
    variant: "tall",
    label: ["JAMMU", "KASHMIR"],
    fontSize: 22,
  },
  HIMACHAL_PRADESH: {
    x: 315,
    y: 250,
    w: 110,
    h: 88,
    variant: "wide",
    label: ["HIMACHAL", "PRADESH"],
    fontSize: 16,
  },
  PUNJAB: {
    x: 230,
    y: 302,
    w: 96,
    h: 90,
    label: ["PUNJAB"],
    fontSize: 20,
  },
  CHANDIGARH: {
    x: 290,
    y: 330,
    w: 40,
    h: 34,
    variant: "island",
    label: ["CH"],
    fontSize: 14,
  },
  HARYANA: {
    x: 245,
    y: 392,
    w: 118,
    h: 96,
    label: ["HARYANA"],
    fontSize: 17,
  },
  DELHI: {
    x: 307,
    y: 390,
    w: 46,
    h: 40,
    variant: "island",
    label: ["DL"],
    fontSize: 14,
  },
  UTTARAKHAND: {
    x: 372,
    y: 322,
    w: 108,
    h: 80,
    variant: "wide",
    label: ["UTTAR", "AKHAND"],
    fontSize: 16,
  },
  RAJASTHAN: {
    x: 170,
    y: 510,
    w: 210,
    h: 210,
    variant: "wide",
    label: ["RAJASTHAN"],
    fontSize: 28,
  },
  UTTAR_PRADESH: {
    x: 446,
    y: 430,
    w: 255,
    h: 120,
    variant: "wide",
    label: ["UTTAR PRADESH"],
    fontSize: 23,
  },
  BIHAR: {
    x: 642,
    y: 480,
    w: 162,
    h: 92,
    variant: "wide",
    label: ["BIHAR"],
    fontSize: 22,
  },
  SIKKIM: {
    x: 736,
    y: 428,
    w: 48,
    h: 46,
    variant: "island",
    label: ["SK"],
    fontSize: 14,
  },
  ARUNACHAL_PRADESH: {
    x: 860,
    y: 346,
    w: 178,
    h: 116,
    variant: "wide",
    label: ["ARUNACHAL", "PRADESH"],
    fontSize: 16,
  },
  ASSAM: {
    x: 806,
    y: 440,
    w: 156,
    h: 76,
    variant: "wide",
    label: ["ASSAM"],
    fontSize: 21,
  },
  MEGHALAYA: {
    x: 756,
    y: 496,
    w: 90,
    h: 54,
    variant: "wide",
    label: ["MEGHA", "LAYA"],
    fontSize: 14,
  },
  NAGALAND: {
    x: 900,
    y: 450,
    w: 88,
    h: 72,
    variant: "tall",
    label: ["NAGA", "LAND"],
    fontSize: 14,
  },
  MANIPUR: {
    x: 904,
    y: 520,
    w: 74,
    h: 68,
    variant: "tall",
    label: ["MANI", "PUR"],
    fontSize: 14,
  },
  MIZORAM: {
    x: 874,
    y: 592,
    w: 92,
    h: 82,
    variant: "tall",
    label: ["MIZORAM"],
    fontSize: 15,
  },
  TRIPURA: {
    x: 790,
    y: 586,
    w: 68,
    h: 78,
    variant: "tall",
    label: ["TRI", "PURA"],
    fontSize: 13,
  },
  WEST_BENGAL: {
    x: 706,
    y: 562,
    w: 102,
    h: 138,
    variant: "tall",
    label: ["WEST", "BENGAL"],
    fontSize: 15,
  },
  JHARKHAND: {
    x: 612,
    y: 588,
    w: 138,
    h: 88,
    variant: "wide",
    label: ["JHARKHAND"],
    fontSize: 19,
  },
  ODISHA: {
    x: 640,
    y: 706,
    w: 170,
    h: 146,
    variant: "tall",
    label: ["ODISHA"],
    fontSize: 24,
  },
  CHHATTISGARH: {
    x: 508,
    y: 628,
    w: 150,
    h: 150,
    variant: "tall",
    label: ["CHHATTI", "SGARH"],
    fontSize: 15,
  },
  MADHYA_PRADESH: {
    x: 372,
    y: 616,
    w: 246,
    h: 174,
    variant: "wide",
    label: ["MADHYA", "PRADESH"],
    fontSize: 23,
  },
  GUJARAT: {
    x: 122,
    y: 666,
    w: 146,
    h: 166,
    variant: "wide",
    label: ["GUJARAT"],
    fontSize: 23,
  },
  DADRA_AND_NAGAR_HAVELI_AND_DAMAN_AND_DIU: {
    x: 166,
    y: 774,
    w: 64,
    h: 52,
    variant: "island",
    label: ["DN"],
    fontSize: 14,
  },
  MAHARASHTRA: {
    x: 292,
    y: 820,
    w: 232,
    h: 152,
    variant: "wide",
    label: ["MAHARASHTRA"],
    fontSize: 22,
  },
  GOA: {
    x: 184,
    y: 904,
    w: 42,
    h: 54,
    variant: "island",
    label: ["GA"],
    fontSize: 14,
  },
  TELANGANA: {
    x: 478,
    y: 802,
    w: 126,
    h: 98,
    label: ["TELAN", "GANA"],
    fontSize: 16,
  },
  ANDHRA_PRADESH: {
    x: 560,
    y: 922,
    w: 176,
    h: 156,
    variant: "tall",
    label: ["ANDHRA", "PRADESH"],
    fontSize: 18,
  },
  KARNATAKA: {
    x: 328,
    y: 972,
    w: 190,
    h: 182,
    variant: "tall",
    label: ["KARNATAKA"],
    fontSize: 22,
  },
  KERALA: {
    x: 254,
    y: 1114,
    w: 80,
    h: 124,
    variant: "slim",
    label: ["KERALA"],
    fontSize: 15,
  },
  TAMIL_NADU: {
    x: 432,
    y: 1096,
    w: 164,
    h: 162,
    variant: "tall",
    label: ["TAMIL", "NADU"],
    fontSize: 20,
  },
  PUDUCHERRY: {
    x: 530,
    y: 1062,
    w: 42,
    h: 40,
    variant: "island",
    label: ["PY"],
    fontSize: 13,
  },
  LAKSHADWEEP: {
    x: 74,
    y: 1010,
    w: 52,
    h: 94,
    variant: "slim",
    label: ["LD"],
    fontSize: 14,
  },
  ANDAMAN_AND_NICOBAR_ISLANDS: {
    x: 854,
    y: 1022,
    w: 62,
    h: 164,
    variant: "slim",
    label: ["A&N"],
    fontSize: 13,
  },
};

function normalizeStateKey(state) {
  const cleaned = String(state || "")
    .toUpperCase()
    .replace(/&/g, " AND ")
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const aliased = STATE_ALIASES[cleaned] || cleaned;
  return aliased.replace(/\s+/g, "_");
}

function getRegionColor(state) {
  const hash = Array.from(state).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return REGION_PALETTE[hash % REGION_PALETTE.length];
}

function getPolygonPoints(layout) {
  const preset = SHAPE_PRESETS[layout.variant] || SHAPE_PRESETS.default;

  return preset
    .map(
      ([pointX, pointY]) =>
        `${layout.x + pointX * layout.w},${layout.y + pointY * layout.h}`
    )
    .join(" ");
}

function renderLabel(layout, labelClassName) {
  const lines = layout.label || [];
  const fontSize = layout.fontSize || 18;
  const lineHeight = fontSize * 1.05;
  const labelX = layout.labelX ?? layout.x;
  const labelY =
    layout.labelY ?? layout.y - ((Math.max(lines.length - 1, 0) * lineHeight) / 2);

  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="middle"
      className={labelClassName}
      style={{ fontSize: `${fontSize}px` }}
    >
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={labelX} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function IndiaMap({ states, selectedState, onSelectState, loading }) {
  const mappedStates = [];
  const overflowStates = [];

  states.forEach((state) => {
    const normalizedState = normalizeStateKey(state);
    const layout = MAP_LAYOUT[normalizedState];

    if (!layout) {
      overflowStates.push(state);
      return;
    }

    mappedStates.push({
      state,
      normalizedState,
      layout,
      fillColor: getRegionColor(normalizedState),
    });
  });

  const handleSelect = (state) => {
    if (loading) {
      return;
    }

    onSelectState(state);
  };

  return (
    <div className="india-map-shell">
      <svg
        viewBox="0 0 1000 1200"
        className="india-map-svg"
        role="img"
        aria-label="Interactive India political style map"
      >
        <rect className="india-map-water" x="0" y="0" width="1000" height="1200" rx="28" />
        <rect
          className="india-map-poster"
          x="18"
          y="18"
          width="964"
          height="1164"
          rx="24"
        />

        <text x="800" y="74" className="india-map-title">
          INDIA
        </text>
        <text x="724" y="112" className="india-map-subtitle">
          States and Union Territories
        </text>

        <text x="72" y="212" className="india-map-neighbor">
          PAKISTAN
        </text>
        <text x="780" y="244" className="india-map-neighbor">
          CHINA
        </text>
        <text x="734" y="305" className="india-map-neighbor india-map-neighbor-soft">
          NEPAL
        </text>
        <text x="810" y="348" className="india-map-neighbor india-map-neighbor-soft">
          BHUTAN
        </text>
        <text x="854" y="610" className="india-map-neighbor">
          MYANMAR
        </text>
        <text x="724" y="572" className="india-map-neighbor">
          BANGLADESH
        </text>
        <text x="710" y="1098" className="india-map-ocean-label">
          BAY OF BENGAL
        </text>
        <text x="164" y="1044" className="india-map-ocean-label" transform="rotate(-78 164 1044)">
          ARABIAN SEA
        </text>
        <text x="440" y="1170" className="india-map-ocean-label-wide">
          INDIAN OCEAN
        </text>

        {mappedStates.map(({ state, layout, fillColor }) => {
          const isActive = selectedState === state;

          return (
            <g
              key={state}
              className={`india-map-region-group ${isActive ? "active" : ""}`}
              role="button"
              tabIndex={loading ? -1 : 0}
              aria-label={`Open details for ${state}`}
              aria-pressed={isActive}
              onClick={() => handleSelect(state)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(state);
                }
              }}
            >
              <polygon
                points={getPolygonPoints(layout)}
                className={`india-map-region-shape ${isActive ? "active" : ""}`}
                style={{ "--region-fill": fillColor }}
              />
              {renderLabel(
                layout,
                `india-map-region-label ${isActive ? "active" : ""}`
              )}
            </g>
          );
        })}

        <g className="india-map-legend">
          <rect x="650" y="1000" width="260" height="118" rx="16" />
          <text x="680" y="1034" className="india-map-legend-title">
            Interactive Legend
          </text>
          <circle cx="690" cy="1060" r="11" className="india-map-legend-dot" />
          <text x="716" y="1066" className="india-map-legend-copy">
            Click a colored state
          </text>
          <circle
            cx="690"
            cy="1090"
            r="11"
            className="india-map-legend-dot india-map-legend-dot-active"
          />
          <text x="716" y="1096" className="india-map-legend-copy">
            Selected state is highlighted
          </text>
        </g>
      </svg>

      {overflowStates.length > 0 && (
        <div className="india-map-fallback">
          <p className="india-map-fallback-title">Extra state shortcuts</p>
          <div className="india-map-fallback-grid">
            {overflowStates.map((state) => (
              <button
                key={state}
                type="button"
                className={`india-map-fallback-btn ${
                  selectedState === state ? "active" : ""
                }`}
                onClick={() => handleSelect(state)}
                disabled={loading}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IndiaMap;
