import { useEffect, useMemo, useState } from "react";
import { api, buildApiUrl } from "../lib/api";
import useDebouncedValue from "../hooks/useDebouncedValue";

function ExplorePage() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    taluk: "",
    q: "",
  });
  const [tableData, setTableData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingTaluks, setLoadingTaluks] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(filters.q, 350);

  useEffect(() => {
    let ignore = false;

    const loadStates = async () => {
      setLoadingStates(true);

      try {
        const response = await api.get("/api/states");

        if (!ignore) {
          setStates(response.data || []);
        }
      } catch (requestError) {
        console.error("State load error:", requestError);

        if (!ignore) {
          setError("Unable to load states right now.");
        }
      }

      if (!ignore) {
        setLoadingStates(false);
      }
    };

    loadStates();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!filters.state) {
      setDistricts([]);
      setTaluks([]);
      return undefined;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);

      try {
        const response = await api.get(
          `/api/states/${encodeURIComponent(filters.state)}/districts`
        );

        if (!ignore) {
          setDistricts(response.data || []);
        }
      } catch (requestError) {
        console.error("District load error:", requestError);

        if (!ignore) {
          setDistricts([]);
          setError("Unable to load districts for the selected state.");
        }
      }

      if (!ignore) {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();

    return () => {
      ignore = true;
    };
  }, [filters.state]);

  useEffect(() => {
    let ignore = false;

    if (!filters.state || !filters.district) {
      setTaluks([]);
      return undefined;
    }

    const loadTaluks = async () => {
      setLoadingTaluks(true);

      try {
        const response = await api.get(
          `/api/states/${encodeURIComponent(
            filters.state
          )}/districts/${encodeURIComponent(filters.district)}/taluks`
        );

        if (!ignore) {
          setTaluks(response.data || []);
        }
      } catch (requestError) {
        console.error("Taluk load error:", requestError);

        if (!ignore) {
          setTaluks([]);
          setError("Unable to load taluks for the selected district.");
        }
      }

      if (!ignore) {
        setLoadingTaluks(false);
      }
    };

    loadTaluks();

    return () => {
      ignore = true;
    };
  }, [filters.district, filters.state]);

  useEffect(() => {
    let ignore = false;

    const loadTable = async () => {
      setLoadingTable(true);
      setError("");

      try {
        const response = await api.get("/api/pincodes", {
          params: {
            state: filters.state || undefined,
            district: filters.district || undefined,
            taluk: filters.taluk || undefined,
            q: debouncedQuery || undefined,
            page,
            limit: 20,
          },
        });

        if (!ignore) {
          setTableData(
            response.data || {
              data: [],
              total: 0,
              page: 1,
              limit: 20,
              totalPages: 0,
            }
          );
        }
      } catch (requestError) {
        console.error("Pincode table error:", requestError);

        if (!ignore) {
          setError("Unable to load filtered pincode data.");
          setTableData({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        }
      }

      if (!ignore) {
        setLoadingTable(false);
      }
    };

    loadTable();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, filters.district, filters.state, filters.taluk, page]);

  useEffect(() => {
    let ignore = false;

    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const loadSuggestions = async () => {
      setSearching(true);

      try {
        const response = await api.get("/api/search", {
          params: { q: debouncedQuery },
        });

        if (!ignore) {
          setSuggestions(response.data?.suggestions || []);
        }
      } catch (requestError) {
        console.error("Search suggestion error:", requestError);

        if (!ignore) {
          setSuggestions([]);
        }
      }

      if (!ignore) {
        setSearching(false);
      }
    };

    loadSuggestions();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const activeFilterCount = useMemo(() => {
    return [filters.state, filters.district, filters.taluk, debouncedQuery].filter(Boolean)
      .length;
  }, [debouncedQuery, filters.district, filters.state, filters.taluk]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setError("");

    setFilters((currentFilters) => {
      if (key === "state") {
        return {
          ...currentFilters,
          state: value,
          district: "",
          taluk: "",
        };
      }

      if (key === "district") {
        return {
          ...currentFilters,
          district: value,
          taluk: "",
        };
      }

      return {
        ...currentFilters,
        [key]: value,
      };
    });
  };

  const handleSelectSuggestion = (suggestion) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      q: suggestion.queryValue,
    }));
    setSuggestions([]);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      state: "",
      district: "",
      taluk: "",
      q: "",
    });
    setDistricts([]);
    setTaluks([]);
    setSuggestions([]);
    setPage(1);
    setError("");
  };

  const handleExport = () => {
    const exportUrl = buildApiUrl("/api/export", {
      state: filters.state || undefined,
      district: filters.district || undefined,
      taluk: filters.taluk || undefined,
      q: debouncedQuery || undefined,
    });

    window.open(exportUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="tw-space-y-8">
      <section className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-gradient-to-br tw-from-slate-900 tw-via-slate-950 tw-to-sky-950/60 tw-p-8 tw-shadow-2xl">
        <p className="tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.35em] tw-text-sky-300">
          Explore
        </p>
        <h2 className="tw-mt-3 tw-text-4xl tw-font-black tw-text-white">
          Filter PIN Code Records
        </h2>
        <p className="tw-mt-4 tw-max-w-3xl tw-text-base tw-leading-7 tw-text-slate-300">
          This page uses the new APIs for states, districts, taluks, filtered
          pincodes, search suggestions, and CSV export. The original home page
          implementation is still preserved on the root route.
        </p>
      </section>

      <section className="tw-grid tw-gap-6 xl:tw-grid-cols-[360px_1fr]">
        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
            <div>
              <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
                Filters
              </p>
              <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
                Explore by location
              </h3>
            </div>
            <span className="tw-rounded-full tw-border tw-border-white/10 tw-bg-white/5 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-300">
              {activeFilterCount} active
            </span>
          </div>

          <div className="tw-mt-6 tw-space-y-4">
            <div className="tw-relative">
              <label className="tw-mb-2 tw-block tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
                Search
              </label>
              <input
                type="text"
                value={filters.q}
                onChange={(event) => handleFilterChange("q", event.target.value)}
                placeholder="Search office, district, taluk, state or pincode"
                className="tw-w-full tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/80 tw-px-4 tw-py-3 tw-text-sm tw-text-white placeholder:tw-text-slate-500 focus:tw-border-sky-400 focus:tw-outline-none"
              />

              {suggestions.length > 0 && (
                <div className="tw-absolute tw-z-20 tw-mt-2 tw-w-full tw-overflow-hidden tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-950 tw-shadow-2xl">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="tw-flex tw-w-full tw-flex-col tw-gap-1 tw-border-b tw-border-white/5 tw-px-4 tw-py-3 tw-text-left hover:tw-bg-white/5"
                    >
                      <span className="tw-text-sm tw-font-semibold tw-text-white">
                        {suggestion.queryValue}
                      </span>
                      <span className="tw-text-xs tw-text-slate-400">
                        {suggestion.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searching && (
                <p className="tw-mt-2 tw-text-xs tw-text-slate-400">
                  Searching suggestions...
                </p>
              )}
            </div>

            <div>
              <label className="tw-mb-2 tw-block tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
                State
              </label>
              <select
                value={filters.state}
                onChange={(event) => handleFilterChange("state", event.target.value)}
                className="tw-w-full tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/80 tw-px-4 tw-py-3 tw-text-sm tw-text-white focus:tw-border-sky-400 focus:tw-outline-none"
                disabled={loadingStates}
              >
                <option value="">
                  {loadingStates ? "Loading states..." : "All States"}
                </option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="tw-mb-2 tw-block tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
                District
              </label>
              <select
                value={filters.district}
                onChange={(event) =>
                  handleFilterChange("district", event.target.value)
                }
                className="tw-w-full tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/80 tw-px-4 tw-py-3 tw-text-sm tw-text-white focus:tw-border-sky-400 focus:tw-outline-none"
                disabled={!filters.state || loadingDistricts}
              >
                <option value="">
                  {loadingDistricts ? "Loading districts..." : "All Districts"}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="tw-mb-2 tw-block tw-text-xs tw-font-semibold tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
                Taluk
              </label>
              <select
                value={filters.taluk}
                onChange={(event) => handleFilterChange("taluk", event.target.value)}
                className="tw-w-full tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/80 tw-px-4 tw-py-3 tw-text-sm tw-text-white focus:tw-border-sky-400 focus:tw-outline-none"
                disabled={!filters.district || loadingTaluks}
              >
                <option value="">
                  {loadingTaluks ? "Loading taluks..." : "All Taluks"}
                </option>
                {taluks.map((taluk) => (
                  <option key={taluk} value={taluk}>
                    {taluk}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="tw-rounded-full tw-border tw-border-white/15 tw-bg-white/5 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-slate-200 hover:tw-bg-white/10"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="tw-rounded-full tw-border tw-border-emerald-400/20 tw-bg-emerald-400/15 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-emerald-100 hover:tw-bg-emerald-400/20"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="tw-rounded-[2rem] tw-border tw-border-white/10 tw-bg-white/5 tw-p-6">
          <div className="tw-flex tw-flex-col tw-gap-3 sm:tw-flex-row sm:tw-items-end sm:tw-justify-between">
            <div>
              <p className="tw-text-xs tw-uppercase tw-tracking-[0.3em] tw-text-slate-400">
                Results
              </p>
              <h3 className="tw-mt-2 tw-text-2xl tw-font-bold tw-text-white">
                Filtered PIN code table
              </h3>
            </div>
            <div className="tw-rounded-2xl tw-border tw-border-white/10 tw-bg-slate-900/70 tw-px-4 tw-py-3 tw-text-sm tw-text-slate-200">
              {loadingTable
                ? "Loading records..."
                : `${tableData.total || 0} records found`}
            </div>
          </div>

          {error && (
            <div className="tw-mt-4 tw-rounded-2xl tw-border tw-border-rose-400/20 tw-bg-rose-400/10 tw-p-4 tw-text-sm tw-text-rose-100">
              {error}
            </div>
          )}

          <div className="tw-mt-6 tw-overflow-x-auto">
            <table className="tw-min-w-full tw-border-separate tw-border-spacing-y-2">
              <thead>
                <tr className="tw-text-left tw-text-xs tw-uppercase tw-tracking-[0.2em] tw-text-slate-400">
                  <th className="tw-px-3 tw-py-2">Pincode</th>
                  <th className="tw-px-3 tw-py-2">State</th>
                  <th className="tw-px-3 tw-py-2">District</th>
                  <th className="tw-px-3 tw-py-2">Taluk</th>
                  <th className="tw-px-3 tw-py-2">Office</th>
                  <th className="tw-px-3 tw-py-2">Type</th>
                  <th className="tw-px-3 tw-py-2">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {tableData.data.length > 0 ? (
                  tableData.data.map((item, index) => (
                    <tr
                      key={`${item.pincode}-${item.officeName}-${index}`}
                      className="tw-rounded-2xl tw-bg-slate-900/70 tw-text-sm tw-text-slate-200"
                    >
                      <td className="tw-rounded-l-2xl tw-px-3 tw-py-3 tw-font-bold tw-text-white">
                        {item.pincode || "N/A"}
                      </td>
                      <td className="tw-px-3 tw-py-3">{item.stateName || "N/A"}</td>
                      <td className="tw-px-3 tw-py-3">{item.districtName || "N/A"}</td>
                      <td className="tw-px-3 tw-py-3">{item.taluk || "N/A"}</td>
                      <td className="tw-px-3 tw-py-3">{item.officeName || "N/A"}</td>
                      <td className="tw-px-3 tw-py-3">{item.officeType || "N/A"}</td>
                      <td className="tw-rounded-r-2xl tw-px-3 tw-py-3">
                        <span className="tw-inline-flex tw-rounded-full tw-border tw-border-white/10 tw-bg-white/5 tw-px-3 tw-py-1 tw-text-xs tw-font-semibold tw-text-slate-100">
                          {item.deliveryStatus || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="tw-px-3 tw-py-12 tw-text-center tw-text-sm tw-text-slate-400"
                    >
                      {loadingTable
                        ? "Loading filtered records..."
                        : "No records matched the current filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
            <p className="tw-text-sm tw-text-slate-400">
              Page {tableData.page || 1}
              {tableData.totalPages ? ` of ${tableData.totalPages}` : ""}
            </p>
            <div className="tw-flex tw-gap-3">
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                disabled={page <= 1 || loadingTable}
                className="tw-rounded-full tw-border tw-border-white/15 tw-bg-white/5 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-slate-200 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={
                  loadingTable ||
                  (tableData.totalPages > 0 && page >= tableData.totalPages)
                }
                className="tw-rounded-full tw-border tw-border-white/15 tw-bg-white/5 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-slate-200 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExplorePage;
