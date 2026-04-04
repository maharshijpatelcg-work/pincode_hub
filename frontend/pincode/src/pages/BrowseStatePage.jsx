import { useState } from "react";
import axios from "axios";

function BrowseStatePage() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  const getStates = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API}/states`);
      setStates(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setStates([]);
    }

    setLoading(false);
  };

  const getCities = async (state) => {
    setSelectedState(state);
    setLoading(true);

    try {
      const res = await axios.get(
        `${API}/states/${encodeURIComponent(state)}`
      );
      setCities(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setCities([]);
    }

    setLoading(false);
  };

  return (
    <div id="state" className="browse-section">
      <h2>📍 Browse by State</h2>
      <button onClick={getStates} className="btn btn-success">
        {loading && states.length === 0 ? "Loading..." : "Load All States"}
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
                  <p>
                    <strong>Office:</strong> {city.officeName || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {city.officeType || "N/A"}
                  </p>
                  <p>
                    <strong>District:</strong>{" "}
                    {city.districtName || city.city || "N/A"}
                  </p>
                  <p>
                    <strong>State:</strong>{" "}
                    <span className="tag-state">
                      {city.stateName || city.state || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Region:</strong> {city.regionName || "N/A"}
                  </p>
                  <p>
                    <strong>Delivery:</strong>{" "}
                    <span className="tag">{city.deliveryStatus || "N/A"}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseStatePage;
