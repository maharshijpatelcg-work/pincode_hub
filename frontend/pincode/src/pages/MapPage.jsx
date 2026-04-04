import { useState } from "react";
import IndiaMap from "../components/IndiaMap";

function MapPage() {
  const [selectedState, setSelectedState] = useState("");

  return (
    <div className="tw-space-y-6">
      <div className="tw-rounded-lg tw-bg-slate-800 tw-p-6">
        <h1 className="tw-mb-2 tw-text-3xl tw-font-bold tw-text-white">
          🗺️ Interactive Map
        </h1>
        <p className="tw-text-slate-400">
          Click on a state to view pincode information
        </p>
      </div>

      <div className="tw-rounded-lg tw-bg-slate-800 tw-p-6">
        <IndiaMap onStateClick={setSelectedState} selectedState={selectedState} />
      </div>

      {selectedState && (
        <div className="tw-rounded-lg tw-bg-slate-800 tw-p-6">
          <h2 className="tw-mb-4 tw-text-2xl tw-font-bold tw-text-white">
            {selectedState}
          </h2>
          <p className="tw-text-slate-400">State details will be shown here</p>
        </div>
      )}
    </div>
  );
}

export default MapPage;
