import { useState } from "react";
import axios from "axios";

function SearchPincodePage() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  const searchPincode = async () => {
    if (!pincode.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`${API}/pincode/${pincode}`);
      setResult(res.data || []);
    } catch (error) {
      console.error("Error:", error);
      setResult([]);
    }

    setLoading(false);
  };

  return (
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
        <div className="cards-grid">
          {result.map((item, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <span className="badge">{item.pincode}</span>
              </div>
              <div className="card-body">
                <p>
                  <strong>Office:</strong> {item.officeName || "N/A"}
                </p>
                <p>
                  <strong>Type:</strong> {item.officeType || "N/A"}
                </p>
                <p>
                  <strong>District:</strong> {item.districtName || "N/A"}
                </p>
                <p>
                  <strong>State:</strong>{" "}
                  <span className="tag-state">{item.stateName || "N/A"}</span>
                </p>
                <p>
                  <strong>Region:</strong> {item.regionName || "N/A"}
                </p>
                <p>
                  <strong>Delivery:</strong>{" "}
                  <span className="tag">{item.deliveryStatus || "N/A"}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {result.length === 0 && !loading && pincode && (
        <p className="no-results">No results found for pincode {pincode}</p>
      )}
    </div>
  );
}

export default SearchPincodePage;
