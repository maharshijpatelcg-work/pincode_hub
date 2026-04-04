import { useState } from "react";
import axios from "axios";
import IndiaMap from "../components/IndiaMap";

function InteractiveMapPage() {
  const [selectedMapState, setSelectedMapState] = useState("");
  const [mapStateDetails, setMapStateDetails] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState("");

  const API = "http://localhost:5000";

  const getMapStateDetails = async (state, page = 1) => {
    if (!state) {
      setSelectedMapState("");
      setMapStateDetails(null);
      setMapError("");
      return;
    }

    setMapLoading(true);
    setMapError("");

    try {
      const res = await axios.get(
        `${API}/states/${encodeURIComponent(state)}/pincodes?page=${page}&limit=12`
      );

      if (res.data && res.data.records) {
        setSelectedMapState(state);
        setMapStateDetails(res.data);
      } else {
        setMapError(`No data found for ${state}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMapError(`Failed to load data for ${state}`);
    }

    setMapLoading(false);
  };

  return (
    <div id="map" className="map-section">
      <h2>🗺️ Interactive Map</h2>

      <div className="map-container">
        <IndiaMap
          onStateClick={getMapStateDetails}
          selectedState={selectedMapState}
        />
      </div>

      {mapError && <p className="error-message">{mapError}</p>}

      {mapStateDetails && (
        <div className="map-details">
          <h3>{selectedMapState}</h3>

          {mapStateDetails.featuredRecord && (
            <div className="map-featured">
              <strong>Featured Record:</strong>
              <div className="map-featured-item">
                <span className="map-featured-label">Pincode</span>
                <strong>{mapStateDetails.featuredRecord.pincode || "N/A"}</strong>
              </div>
              <div className="map-featured-item">
                <span className="map-featured-label">District</span>
                <strong>
                  {mapStateDetails.featuredRecord.districtName || "N/A"}
                </strong>
              </div>
              <div className="map-featured-item">
                <span className="map-featured-label">City</span>
                <strong>
                  {mapStateDetails.featuredRecord.cityName || "N/A"}
                </strong>
              </div>
              <div className="map-featured-item">
                <span className="map-featured-label">Office</span>
                <strong>
                  {mapStateDetails.featuredRecord.officeName || "N/A"}
                </strong>
              </div>
            </div>
          )}

          {mapStateDetails.districtPreview?.length > 0 && (
            <div className="map-district-preview">
              {mapStateDetails.districtPreview.map((district) => (
                <span key={district} className="map-district-preview-chip">
                  {district}
                </span>
              ))}
            </div>
          )}

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
                    <p>
                      <strong>District:</strong> {item.districtName || "N/A"}
                    </p>
                    <p>
                      <strong>City:</strong> {item.cityName || "N/A"}
                    </p>
                    <p>
                      <strong>Office:</strong> {item.officeName || "N/A"}
                    </p>
                    <p>
                      <strong>Type:</strong> {item.officeType || "N/A"}
                    </p>
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

          {mapStateDetails.pagination && (
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
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveMapPage;
