import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import IndiaMap from "./components/IndiaMap";
import "./App.css";

const SECTION_VIEW_MODES = new Set(["search", "map", "state", "district"]);
const MAP_PAGE_SIZE = 12;

const getViewModeFromHash = () => {
  if (typeof window === "undefined") {
    return "all";
  }

  const hashValue = window.location.hash.replace("#", "").toLowerCase();
  return SECTION_VIEW_MODES.has(hashValue) ? hashValue : "all";
};

function App() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districtStates, setDistrictStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtPincodes, setDistrictPincodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [districtStatesLoading, setDistrictStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrictState, setSelectedDistrictState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMapState, setSelectedMapState] = useState("");
  const [mapStateDetails, setMapStateDetails] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");
  const [viewMode, setViewMode] = useState(getViewModeFromHash);

  const API = "http://localhost:5000";

  useEffect(() => {
    const syncViewModeWithHash = () => {
      setViewMode(getViewModeFromHash());
    };

    syncViewModeWithHash();
    window.addEventListener("hashchange", syncViewModeWithHash);

    return () => {
      window.removeEventListener("hashchange", syncViewModeWithHash);
    };
  }, []);

  useEffect(() => {
    if (viewMode !== "all" && viewMode !== "district" && viewMode !== "map") {
      return;
    }

    if (districtStates.length > 0) {
      return;
    }

    const loadDistrictStates = async () => {
      setDistrictStatesLoading(true);

      try {
        const nextStates = await fetchAllStates();
        setDistrictStates(nextStates);
      } catch (error) {
        console.error("Error:", error);
        setDistrictStates([]);
      }

      setDistrictStatesLoading(false);
    };

    loadDistrictStates();
  }, [districtStates.length, viewMode]);

  const navigateToView = (mode) => {
    const nextViewMode = SECTION_VIEW_MODES.has(mode) ? mode : "all";
    const nextHash = nextViewMode === "all" ? "" : `#${nextViewMode}`;

    setViewMode(nextViewMode);

    if (typeof window === "undefined" || window.location.hash === nextHash) {
      return;
    }

    if (nextHash) {
      window.location.hash = nextHash;
      return;
    }

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}${window.location.search}`
    );
  };

  const searchPincode = async () => {
    if (!pincode.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/pincode/${pincode}`);
      setResult(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setResult([]);
    }

    setLoading(false);
  };

  const fetchAllStates = async () => {
    const res = await axios.get(`${API}/states`);
    return res.data || [];
  };

  const getStates = async () => {
    setLoading(true);

    try {
      const nextStates = await fetchAllStates();
      setStates(nextStates);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const refreshMapStates = async () => {
    setDistrictStatesLoading(true);
    setMapError("");

    try {
      const nextStates = await fetchAllStates();
      setDistrictStates(nextStates);
    } catch (error) {
      console.error("Error:", error);
      setDistrictStates([]);
      setMapError("Unable to refresh state markers right now.");
    }

    setDistrictStatesLoading(false);
  };

  const getCities = async (state) => {
    setSelectedState(state);
    setLoading(true);

    try {
      const res = await axios.get(`${API}/states/${encodeURIComponent(state)}`);
      setCities(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setCities([]);
    }

    setLoading(false);
  };

  const getDistricts = async () => {
    setSelectedDistrictState("");
    setSelectedDistrict("");
    setDistrictPincodes([]);
    setDistrictsLoading(true);

    try {
      const res = await axios.get(`${API}/districts`);
      setDistricts(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setDistricts([]);
    }

    setDistrictsLoading(false);
  };

  const getDistrictsByState = async (state) => {
    setSelectedDistrictState(state);
    setSelectedDistrict("");
    setDistrictPincodes([]);

    if (!state) {
      await getDistricts();
      return;
    }

    setDistrictsLoading(true);

    try {
      const res = await axios.get(
        `${API}/states/${encodeURIComponent(state)}/cities`
      );
      setDistricts(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setDistricts([]);
    }

    setDistrictsLoading(false);
  };

  const getPincodesByDistrict = async (district) => {
    setSelectedDistrict(district);
    setLoading(true);

    try {
      const res = await axios.get(
        `${API}/districts/${encodeURIComponent(district)}`
      );
      setDistrictPincodes(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setDistrictPincodes([]);
    }

    setLoading(false);
  };

  const getMapStateDetails = async (state, page = 1) => {
    if (!state) {
      return;
    }

    setSelectedMapState(state);
    setMapLoading(true);
    setMapError("");
    setMapStateDetails(null);

    try {
      const res = await axios.get(`${API}/map/states/${encodeURIComponent(state)}`, {
        params: {
          page,
          limit: MAP_PAGE_SIZE,
        },
      });
      setMapStateDetails(res.data || null);
    } catch (error) {
      console.error("Error:", error);
      setMapStateDetails(null);
      setMapError(`Unable to load map details for ${state}.`);
    }

    setMapLoading(false);
  };

  return (
    <>
      <Navbar onNavigate={navigateToView} />
      <Sidebar viewMode={viewMode} onNavigate={navigateToView} />
      <div className="container">
        <div className="header">
          <h1>🚀 Pincode Finder - India</h1>
          <p>Search for any Indian pincode to get detailed postal information</p>
        </div>

        {(viewMode === "all" || viewMode === "search") && (
          <div id="search" className="search-section">
            <h2>🔍 Search by Pincode</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter 6-digit pincode (e.g., 504293)"
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && searchPincode()}
                className="search-input"
              />
              <button onClick={searchPincode} className="btn btn-primary">
                {loading ? "Loading..." : "Search"}
              </button>
            </div>

            {result.length > 0 && (
              <div className="results">
                <h3>📍 Results ({result.length} found)</h3>
                <div className="cards-grid">
                  {result.map((item, index) => (
                    <div key={index} className="card">
                      <div className="card-header">
                        <span className="badge">{item.pincode}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Office Name:</strong> {item.officeName || "N/A"}</p>
                        <p><strong>Office Type:</strong> {item.officeType || "N/A"}</p>
                        <p><strong>Delivery Status:</strong> <span className="tag">{item.deliveryStatus || "N/A"}</span></p>
                        <p><strong>District:</strong> {item.districtName || item.city || "N/A"}</p>
                        <p><strong>State:</strong> <span className="tag-state">{item.stateName || item.state || "N/A"}</span></p>
                        <p><strong>Region:</strong> {item.regionName || "N/A"}</p>
                        <p><strong>Division:</strong> {item.divisionName || "N/A"}</p>
                        <p><strong>Circle:</strong> {item.circleName || "N/A"}</p>
                        <p><strong>Taluk:</strong> {item.taluk || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.length === 0 && pincode && !loading && (
              <p className="no-results">❌ No results found for pincode: {pincode}</p>
            )}
          </div>
        )}

        {viewMode === "all" && <hr className="divider" />}

        {(viewMode === "all" || viewMode === "map") && (
          <div id="map" className="map-section">
            <div className="map-section-header">
              <div>
                <h2>Interactive India Map</h2>
                <p className="map-section-copy">
                  Click any colored state on the India map to load the state
                  name, district, city, and pincode details in a safe,
                  paginated view.
                </p>
              </div>
              <button onClick={refreshMapStates} className="btn btn-map">
                {districtStatesLoading ? "Loading..." : "Refresh States"}
              </button>
            </div>

            {districtStates.length > 0 ? (
              <IndiaMap
                states={districtStates}
                selectedState={selectedMapState}
                onSelectState={getMapStateDetails}
                loading={mapLoading}
              />
            ) : (
              !districtStatesLoading && (
                <p className="no-results">
                  Unable to load the state map right now. Please try refreshing
                  the states.
                </p>
              )
            )}

            {mapError && <p className="no-results">{mapError}</p>}

            {mapStateDetails && (
              <div className="map-results">
                <div className="map-results-header">
                  <div>
                    <h3>{mapStateDetails.state}</h3>
                    <p className="results-count">
                      Showing page {mapStateDetails.pagination?.page || 1}
                      {mapStateDetails.pagination?.totalPages
                        ? ` of ${mapStateDetails.pagination.totalPages}`
                        : ""}
                    </p>
                  </div>
                  <div className="map-summary-grid">
                    <div className="map-summary-card">
                      <span className="map-summary-label">Records</span>
                      <strong>{mapStateDetails.summary?.totalRecords || 0}</strong>
                    </div>
                    <div className="map-summary-card">
                      <span className="map-summary-label">Districts</span>
                      <strong>{mapStateDetails.summary?.totalDistricts || 0}</strong>
                    </div>
                    <div className="map-summary-card">
                      <span className="map-summary-label">Cities</span>
                      <strong>{mapStateDetails.summary?.totalCities || 0}</strong>
                    </div>
                  </div>
                </div>

                {mapStateDetails.records?.length > 0 ? (
                  <div className="cards-grid">
                    {mapStateDetails.records.map((item, index) => (
                      <div key={`${item.pincode}-${index}`} className="card">
                        <div className="card-header">
                          <span className="badge">{item.pincode || "N/A"}</span>
                        </div>
                        <div className="card-body">
                          <p>
                            <strong>State:</strong>{" "}
                            <span className="tag-state">
                              {item.stateName || mapStateDetails.state}
                            </span>
                          </p>
                          <p><strong>District:</strong> {item.districtName || "N/A"}</p>
                          <p><strong>City:</strong> {item.cityName || "N/A"}</p>
                          <p><strong>Office:</strong> {item.officeName || "N/A"}</p>
                          <p><strong>Type:</strong> {item.officeType || "N/A"}</p>
                          <p>
                            <strong>Delivery:</strong>{" "}
                            <span className="tag">
                              {item.deliveryStatus || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-results">
                    No map records are available for {mapStateDetails.state}.
                  </p>
                )}

                <div className="map-pagination">
                  <button
                    type="button"
                    className="btn btn-map-secondary"
                    onClick={() =>
                      getMapStateDetails(
                        selectedMapState,
                        mapStateDetails.pagination.page - 1
                      )
                    }
                    disabled={
                      mapLoading || !mapStateDetails.pagination?.hasPreviousPage
                    }
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-map-secondary"
                    onClick={() =>
                      getMapStateDetails(
                        selectedMapState,
                        mapStateDetails.pagination.page + 1
                      )
                    }
                    disabled={mapLoading || !mapStateDetails.pagination?.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === "all" && <hr className="divider" />}

        {(viewMode === "all" || viewMode === "state") && (
          <div id="state" className="browse-section">
            <h2>📍 Browse by State</h2>
            <button onClick={getStates} className="btn btn-success">
              {loading && !selectedState ? "Loading..." : "Load All States"}
            </button>

            {states.length > 0 && (
              <div className="states-container">
                <h3>Select a State:</h3>
                <div className="states-grid">
                  {states.map((state, index) => (
                    <button
                      key={index}
                      onClick={() => getCities(state)}
                      className={`btn-state ${selectedState === state ? "active" : ""}`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cities.length > 0 && (
              <div className="cities-results">
                <h3>🏙️ Pincodes in {selectedState}</h3>
                <p className="results-count">Found {cities.length} pincodes</p>
                <div className="cards-grid">
                  {cities.map((city, index) => (
                    <div key={index} className="card">
                      <div className="card-header">
                        <span className="badge">{city.pincode}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Office:</strong> {city.officeName || "N/A"}</p>
                        <p><strong>Type:</strong> {city.officeType || "N/A"}</p>
                        <p><strong>District:</strong> {city.districtName || city.city || "N/A"}</p>
                        <p><strong>State:</strong> <span className="tag-state">{city.stateName || city.state || "N/A"}</span></p>
                        <p><strong>Region:</strong> {city.regionName || "N/A"}</p>
                        <p><strong>Delivery:</strong> <span className="tag">{city.deliveryStatus || "N/A"}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === "all" && <hr className="divider" />}

        {(viewMode === "all" || viewMode === "district") && (
          <div id="district" className="district-section">
            <h2>🏘️ Browse by District</h2>
            <button onClick={getDistricts} className="btn btn-info">
              {districtsLoading && !selectedDistrictState
                ? "Loading..."
                : "Load All Districts"}
            </button>

            <div className="district-filter-group">
              <label
                htmlFor="district-state-filter"
                className="district-filter-label"
              >
                Filter Districts by State:
              </label>
              <select
                id="district-state-filter"
                className="district-filter-select"
                value={selectedDistrictState}
                onChange={(event) => getDistrictsByState(event.target.value)}
                disabled={districtStatesLoading}
              >
                <option value="">
                  {districtStatesLoading ? "Loading states..." : "All States"}
                </option>
                {districtStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {(districts.length > 0 || selectedDistrictState) && (
              <div className="districts-container">
                <h3>
                  {selectedDistrictState
                    ? `Select a District in ${selectedDistrictState}:`
                    : "Select a District:"}
                </h3>
                {districts.length > 0 ? (
                  <div className="districts-grid">
                    {districts.map((district, index) => (
                      <button
                        key={index}
                        onClick={() => getPincodesByDistrict(district)}
                        className={`btn-district ${selectedDistrict === district ? "active" : ""}`}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                ) : (
                  !districtsLoading && (
                    <p className="results-count">
                      No districts found for {selectedDistrictState}.
                    </p>
                  )
                )}
              </div>
            )}

            {districtPincodes.length > 0 && (
              <div className="district-results">
                <h3>📮 Pincodes in {selectedDistrict} District</h3>
                <p className="results-count">Found {districtPincodes.length} pincodes</p>
                <div className="cards-grid">
                  {districtPincodes.map((pincodeItem, index) => (
                    <div key={index} className="card">
                      <div className="card-header">
                        <span className="badge">{pincodeItem.pincode}</span>
                      </div>
                      <div className="card-body">
                        <p><strong>Office:</strong> {pincodeItem.officeName || "N/A"}</p>
                        <p><strong>City:</strong> {pincodeItem.districtName || "N/A"}</p>
                        <p><strong>Type:</strong> {pincodeItem.officeType || "N/A"}</p>
                        <p><strong>State:</strong> <span className="tag-state">{pincodeItem.stateName || "N/A"}</span></p>
                        <p><strong>Delivery:</strong> <span className="tag">{pincodeItem.deliveryStatus || "N/A"}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
