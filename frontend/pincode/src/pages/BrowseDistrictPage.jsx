import { useState, useEffect } from "react";
import axios from "axios";

function BrowseDistrictPage() {
  const [districtStates, setDistrictStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtPincodes, setDistrictPincodes] = useState([]);
  const [selectedDistrictState, setSelectedDistrictState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtStatesLoading, setDistrictStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  const API = "http://localhost:5000";

  useEffect(() => {
    const loadDistrictStates = async () => {
      setDistrictStatesLoading(true);

      try {
        const res = await axios.get(`${API}/states`);
        setDistrictStates(res.data || []);
      } catch (error) {
        console.error("Error:", error);
        setDistrictStates([]);
      }

      setDistrictStatesLoading(false);
    };

    loadDistrictStates();
  }, []);

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

    try {
      const res = await axios.get(
        `${API}/search?q=${encodeURIComponent(district)}&limit=100`
      );
      setDistrictPincodes(res.data?.records || []);
    } catch (error) {
      console.error("Error:", error);
      setDistrictPincodes([]);
    }
  };

  return (
    <div id="district" className="district-section">
      <h2>🏘️ Browse by District</h2>
      <button onClick={getDistricts} className="btn btn-info">
        {districtsLoading && selectedDistrictState === "" ? "Loading..." : "Load All Districts"}
      </button>

      <div className="district-filter-group">
        <label htmlFor="district-state-filter" className="district-filter-label">
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
                  className={`btn-district ${
                    selectedDistrict === district ? "active" : ""
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          ) : (
            <p className="no-results">
              No districts found for {selectedDistrictState}
            </p>
          )}
        </div>
      )}

      {districtPincodes.length > 0 && (
        <div className="district-pincodes-results">
          <h3>📮 Pincodes in {selectedDistrict}</h3>
          <p className="results-count">Found {districtPincodes.length} pincodes</p>
          <div className="cards-grid">
            {districtPincodes.map((pincode, index) => (
              <div key={index} className="card">
                <div className="card-header">
                  <span className="badge">{pincode.pincode}</span>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Office:</strong> {pincode.officeName || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {pincode.officeType || "N/A"}
                  </p>
                  <p>
                    <strong>District:</strong> {pincode.districtName || "N/A"}
                  </p>
                  <p>
                    <strong>State:</strong>{" "}
                    <span className="tag-state">
                      {pincode.stateName || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>City:</strong> {pincode.cityName || "N/A"}
                  </p>
                  <p>
                    <strong>Delivery:</strong>{" "}
                    <span className="tag">{pincode.deliveryStatus || "N/A"}</span>
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

export default BrowseDistrictPage;
