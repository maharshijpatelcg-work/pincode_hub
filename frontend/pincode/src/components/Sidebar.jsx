import "../styles/Sidebar.css";

function Sidebar({ viewMode, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3 className="sidebar-title">Sections</h3>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-item ${viewMode === "search" ? "active" : ""}`}
            onClick={() => onNavigate("search")}
          >
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-label">Search Pincode</span>
          </button>

          <button
            className={`sidebar-item ${viewMode === "map" ? "active" : ""}`}
            onClick={() => onNavigate("map")}
          >
            <span className="sidebar-icon">MAP</span>
            <span className="sidebar-label">Interactive Map</span>
          </button>

          <button
            className={`sidebar-item ${viewMode === "state" ? "active" : ""}`}
            onClick={() => onNavigate("state")}
          >
            <span className="sidebar-icon">📍</span>
            <span className="sidebar-label">Browse State</span>
          </button>

          <button
            className={`sidebar-item ${viewMode === "district" ? "active" : ""}`}
            onClick={() => onNavigate("district")}
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
