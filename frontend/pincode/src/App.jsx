import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtPincodes, setDistrictPincodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all", "search", "state", "district"

  const API = "http://localhost:5000";

  // 🔍 Search by pincode
  const searchPincode = async () => {
    if (!pincode.trim()) return;
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

  // 📍 Get all states
  const getStates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/states`);
      setStates(res.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // 🏙️ Get cities by state
  const getCities = async (state) => {
    setSelectedState(state);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/states/${state}`);
      setCities(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setCities([]);
    }
    setLoading(false);
  };

  // 🏘️ Get all districts
  const getDistricts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/districts`);
      setDistricts(res.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // 🏘️ Get pincodes by district
  const getPincodesByDistrict = async (district) => {
    setSelectedDistrict(district);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/districts/${district}`);
      setDistrictPincodes(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setDistrictPincodes([]);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Sidebar viewMode={viewMode} setViewMode={setViewMode} />
      <div className="container">
        <div className="header">
          <h1>🚀 Pincode Finder - India</h1>
          <p>Search for any Indian pincode to get detailed postal information</p>
        </div>

        {/* 🔍 PINCODE SEARCH */}
        {(viewMode === "all" || viewMode === "search") && (
        <div id="search" className="search-section">
          <h2>🔍 Search by Pincode</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter 6-digit pincode (e.g., 504293)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchPincode()}
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
              {result.map((item, i) => (
                <div key={i} className="card">
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

      <hr className="divider" />

      {/* 📍 STATES & CITIES */}
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
              {states.map((state, i) => (
                <button
                  key={i}
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
              {cities.map((c, i) => (
                <div key={i} className="card">
                  <div className="card-header">
                    <span className="badge">{c.pincode}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Office:</strong> {c.officeName || "N/A"}</p>
                    <p><strong>Type:</strong> {c.officeType || "N/A"}</p>
                    <p><strong>District:</strong> {c.districtName || c.city || "N/A"}</p>
                    <p><strong>State:</strong> <span className="tag-state">{c.stateName || c.state || "N/A"}</span></p>
                    <p><strong>Region:</strong> {c.regionName || "N/A"}</p>
                    <p><strong>Delivery:</strong> <span className="tag">{c.deliveryStatus || "N/A"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

      <hr className="divider" />

      {/* 🏘️ DISTRICTS & PINCODES */}
      {(viewMode === "all" || viewMode === "district") && (
      <div id="district" className="district-section">
        <h2>🏘️ Browse by District</h2>
        <button onClick={getDistricts} className="btn btn-info">
          {loading && !selectedDistrict ? "Loading..." : "Load All Districts"}
        </button>

        {districts.length > 0 && (
          <div className="districts-container">
            <h3>Select a District:</h3>
            <div className="districts-grid">
              {districts.map((district, i) => (
                <button
                  key={i}
                  onClick={() => getPincodesByDistrict(district)}
                  className={`btn-district ${selectedDistrict === district ? "active" : ""}`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        )}

        {districtPincodes.length > 0 && (
          <div className="district-results">
            <h3>📮 Pincodes in {selectedDistrict} District</h3>
            <p className="results-count">Found {districtPincodes.length} pincodes</p>
            <div className="cards-grid">
              {districtPincodes.map((p, i) => (
                <div key={i} className="card">
                  <div className="card-header">
                    <span className="badge">{p.pincode}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Office:</strong> {p.officeName || "N/A"}</p>
                    <p><strong>City:</strong> {p.districtName || "N/A"}</p>
                    <p><strong>Type:</strong> {p.officeType || "N/A"}</p>
                    <p><strong>State:</strong> <span className="tag-state">{p.stateName || "N/A"}</span></p>
                    <p><strong>Delivery:</strong> <span className="tag">{p.deliveryStatus || "N/A"}</span></p>
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