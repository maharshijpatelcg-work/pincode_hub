import { useEffect, useRef, useState } from "react";
import indiaPoliticalMapUrl from "../assets/india-political-map.svg?url";

const STATE_ALIASES = {
  "ANDAMAN NICOBAR ISLANDS": "ANDAMAN AND NICOBAR ISLANDS",
  "DADRA NAGAR HAVELI DAMAN DIU":
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DADRA AND NAGAR HAVELI": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "DAMAN DIU": "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
  "JAMMU KASHMIR": "JAMMU AND KASHMIR",
  LAKSHWADEEP: "LAKSHADWEEP",
  "NCT OF DELHI": "DELHI",
  ORISSA: "ODISHA",
  PONDICHERRY: "PUDUCHERRY",
  UTTARANCHAL: "UTTARAKHAND",
  CHATTISGARH: "CHHATTISGARH",
};

const STATE_SVG_IDS = {
  ANDAMAN_AND_NICOBAR_ISLANDS: ["andaman_and_nicobar_2_"],
  ANDHRA_PRADESH: ["Andhra_Pradesh"],
  ARUNACHAL_PRADESH: ["arunachal_pradesh_2_"],
  ASSAM: ["assam_2_"],
  BIHAR: ["bihar"],
  CHANDIGARH: ["chandigarh_2_"],
  CHHATTISGARH: ["chhattisgarh"],
  DADRA_AND_NAGAR_HAVELI_AND_DAMAN_AND_DIU: [
    "dadra_and_nagar_haveli_2_",
    "diu_2_",
  ],
  DELHI: ["delhi_ncr"],
  GOA: ["Goa"],
  GUJARAT: ["gujarat"],
  HARYANA: ["haryana"],
  HIMACHAL_PRADESH: ["himachal_pradesh"],
  JAMMU_AND_KASHMIR: ["jammu_and_kashmir_2_"],
  JHARKHAND: ["jharkhand"],
  KARNATAKA: ["Karnataka"],
  KERALA: ["Kerala"],
  MADHYA_PRADESH: ["madhya_pradesh"],
  MAHARASHTRA: ["maharashtra"],
  MANIPUR: ["manipur"],
  MEGHALAYA: ["meghalaya"],
  MIZORAM: ["mizoram"],
  NAGALAND: ["nagaland"],
  ODISHA: ["orissa"],
  PUDUCHERRY: [
    "yanam_pondicherry_2_",
    "pudducherry_pondicherry_2_",
    "karikal_pondicherry_2_",
    "mahe_pondicherry_2_",
  ],
  PUNJAB: ["punjab"],
  RAJASTHAN: ["rajasthan"],
  SIKKIM: ["sikkim"],
  TAMIL_NADU: ["Tamil_Nadu"],
  TRIPURA: ["tripura"],
  UTTAR_PRADESH: ["uttar_pradesh"],
  UTTARAKHAND: ["uttaranchal"],
  WEST_BENGAL: ["west_bengal"],
};

function sanitizeSvgMarkup(svgMarkup) {
  return svgMarkup
    .replace(/<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?\]>/i, "")
    .replace(
      /<svg\b/,
      '<svg class="india-map-svg" role="img" aria-label="Interactive India political map"'
    );
}

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

function getSvgIdsForState(state) {
  return STATE_SVG_IDS[normalizeStateKey(state)] || [];
}

function IndiaMap({ states, selectedState, onSelectState, loading }) {
  const mapRef = useRef(null);
  const [svgMarkup, setSvgMarkup] = useState("");
  const [svgLoadError, setSvgLoadError] = useState(false);

  const mappedStates = states.filter((state) => {
    return getSvgIdsForState(state).length > 0;
  });

  const overflowStates = states.filter((state) => {
    return getSvgIdsForState(state).length === 0;
  });

  useEffect(() => {
    let ignore = false;

    const loadSvg = async () => {
      try {
        const response = await fetch(indiaPoliticalMapUrl);
        const rawSvg = await response.text();

        if (!ignore) {
          setSvgMarkup(sanitizeSvgMarkup(rawSvg));
        }
      } catch (error) {
        console.error("Error loading India map SVG:", error);

        if (!ignore) {
          setSvgLoadError(true);
        }
      }
    };

    loadSvg();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const mapRoot = mapRef.current;

    if (!mapRoot || !svgMarkup) {
      return undefined;
    }

    const svg = mapRoot.querySelector("svg");

    if (!svg) {
      return undefined;
    }

    const cleanups = [];

    mappedStates.forEach((state) => {
      const isActive = selectedState === state;

      getSvgIdsForState(state).forEach((id) => {
        const segments = svg.querySelectorAll(`[id="${id}"]`);

        segments.forEach((segment) => {
          segment.classList.add("india-map-state-path");
          segment.classList.toggle("active", isActive);
          segment.setAttribute("role", "button");
          segment.setAttribute("tabindex", loading ? "-1" : "0");
          segment.setAttribute("aria-label", `Open details for ${state}`);
          segment.setAttribute("aria-pressed", isActive ? "true" : "false");

          const handleSelect = () => {
            if (!loading) {
              onSelectState(state);
            }
          };

          const handleKeyDown = (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleSelect();
            }
          };

          segment.addEventListener("click", handleSelect);
          segment.addEventListener("keydown", handleKeyDown);

          cleanups.push(() => {
            segment.removeEventListener("click", handleSelect);
            segment.removeEventListener("keydown", handleKeyDown);
          });
        });
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [loading, mappedStates, onSelectState, selectedState, svgMarkup]);

  const handleShortcutSelect = (state) => {
    if (!loading) {
      onSelectState(state);
    }
  };

  return (
    <div className="india-map-shell">
      <div
        ref={mapRef}
        className="india-map-frame"
      >
        {svgMarkup ? (
          <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
        ) : (
          <div className="india-map-placeholder">
            {svgLoadError ? "Unable to load the India map image." : "Loading India map..."}
          </div>
        )}
      </div>

      <p className="india-map-caption">
        Click any state region to load MongoDB-backed state, district, city,
        office, and pincode details.
      </p>

      {overflowStates.length > 0 && (
        <div className="india-map-fallback">
          <p className="india-map-fallback-title">State shortcuts</p>
          <p className="india-map-fallback-copy">
            Some newer state or union territory names are not drawn in this map
            source, so you can open them from these buttons.
          </p>
          <div className="india-map-fallback-grid">
            {overflowStates.map((state) => (
              <button
                key={state}
                type="button"
                className={`india-map-fallback-btn ${
                  selectedState === state ? "active" : ""
                }`}
                onClick={() => handleShortcutSelect(state)}
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
