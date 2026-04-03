import { useState, useEffect } from "react";
import "../styles/Sidebar.css";

function Sidebar({ viewMode, setViewMode }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3 className="sidebar-title">Sections</h3>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${viewMode === "search" ? "active" : ""}`}
            onClick={() => setViewMode("search")}
          >
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-label">Search Pincode</span>
          </button>

          <button
            className={`sidebar-item ${viewMode === "state" ? "active" : ""}`}
            onClick={() => setViewMode("state")}
          >
            <span className="sidebar-icon">📍</span>
            <span className="sidebar-label">Browse State</span>
          </button>

          <button
            className={`sidebar-item ${viewMode === "district" ? "active" : ""}`}
            onClick={() => setViewMode("district")}
          >
            <span className="sidebar-icon">🏘️</span>
            <span className="sidebar-label">Browse District</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
