import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

function PincodeLookupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("code") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (nextCode) => {
    const trimmedCode = String(nextCode || "").trim();

    if (!trimmedCode) {
      setResults([]);
      setError("Enter a pincode to search.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchParams({ code: trimmedCode });

    try {
      const response = await api.get(`/api/pincode/${encodeURIComponent(trimmedCode)}`);
      setResults(response.data || []);

      if (!response.data || response.data.length === 0) {
        setError(`No records found for pincode ${trimmedCode}.`);
      }
    } catch (requestError) {
      console.error("Pincode lookup error:", requestError);
      setResults([]);
      setError("Unable to load pincode details right now.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const initialCode = searchParams.get("code");

    if (initialCode) {
      handleSearch(initialCode);
    }
    // We intentionally run this only on first mount for initial route hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw-space-y-8">
      <section className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-gradient-to-br tw-from-slate-900 tw-via-slate-950 tw-to-fuchsia-950/50 tw-p-8 tw-shadow-2xl">
        <p className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.35em] tw-text-fuchsia-300">
          Pincode Lookup
        </p>
        <h2 className="tw-mt-3 tw-text-4xl tw-font-black tw-text-white">
          Search details by PIN code
        </h2>
        <p className="tw-mt-4 tw-max-w-3xl tw-text-base tw-leading-7 tw-text-slate-300">
          This route uses the dedicated `/api/pincode/:pincode` endpoint and
          shows the complete office-level result cards for the entered code.
        </p>
      </section>

      <section className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
        <div className="tw-flex tw-flex-col tw-gap-4 md:tw-flex-row">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch(inputValue);
              }
            }}
            placeholder="Enter a 6-digit pincode"
            className="tw-flex-1 tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/80 tw-px-4 tw-py-3 tw-text-sm tw-text-white placeholder:tw-text-slate-500 focus:tw-border-fuchsia-400 focus:tw-outline-none"
          />
          <button
            type="button"
            onClick={() => handleSearch(inputValue)}
            className="tw-rounded-2xl tw-border tw-border-fuchsia-400/20 tw-bg-fuchsia-400/15 tw-px-6 tw-py-3 tw-text-sm tw-font-semibold tw-text-fuchsia-100 hover:tw-bg-fuchsia-400/20"
          >
            {loading ? "Searching..." : "Search Pincode"}
          </button>
        </div>

        {error && (
          <div className="tw-mt-4 tw-rounded-2xl tw-border tw-border-amber-400/20 tw-bg-amber-400/10 tw-p-4 tw-text-sm tw-text-amber-100">
            {error}
          </div>
        )}

        <div className="tw-mt-6 tw-grid tw-gap-4 md:tw-grid-cols-2 xl:tw-grid-cols-3">
          {results.map((item, index) => (
            <article
              key={`${item.pincode}-${item.officeName}-${index}`}
              className="tw-rounded-[1.75rem] tw-border tw-border-white/10 tw-bg-slate-900/80 tw-p-5 tw-shadow-lg"
            >
              <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                <span className="tw-rounded-full tw-bg-fuchsia-400/15 tw-px-3 tw-py-1 tw-text-xs tw-font-black tw-tracking-[0.2em] tw-text-fuchsia-200">
                  {item.pincode || "N/A"}
                </span>
                <span className="tw-rounded-full tw-border tw-border-white/10 tw-bg-white/5 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-text-slate-300">
                  {item.officeType || "N/A"}
                </span>
              </div>

              <h3 className="tw-mt-4 tw-text-xl tw-font-bold tw-text-white">
                {item.officeName || "Unknown Office"}
              </h3>

              <dl className="tw-mt-4 tw-space-y-3 tw-text-sm">
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">State</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.stateName || item.state || "N/A"}
                  </dd>
                </div>
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">District</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.districtName || item.city || "N/A"}
                  </dd>
                </div>
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">Taluk</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.taluk || "N/A"}
                  </dd>
                </div>
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">Division</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.divisionName || "N/A"}
                  </dd>
                </div>
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">Region</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.regionName || "N/A"}
                  </dd>
                </div>
                <div className="tw-flex tw-justify-between tw-gap-3">
                  <dt className="tw-text-slate-400">Circle</dt>
                  <dd className="tw-text-right tw-font-semibold tw-text-slate-100">
                    {item.circleName || "N/A"}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PincodeLookupPage;
