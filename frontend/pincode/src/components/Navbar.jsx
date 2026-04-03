import { useState } from "react";
import "../styles/Navbar.css";

function Navbar({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (event, mode) => {
    event.preventDefault();
    setIsOpen(false);
    onNavigate(mode);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🚀</span>
          <a
            href="#"
            className="navbar-title"
            onClick={(event) => handleNavigate(event, "all")}
          >
            PincodeHub
          </a>
        </div>

        <button
          className={`navbar-toggle ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <a
              href="#search"
              className="navbar-link"
              onClick={(event) => handleNavigate(event, "search")}
            >
              Search Pincode
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="#map"
              className="navbar-link"
              onClick={(event) => handleNavigate(event, "map")}
            >
              Explore Map
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="#state"
              className="navbar-link"
              onClick={(event) => handleNavigate(event, "state")}
            >
              Browse State
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="#district"
              className="navbar-link"
              onClick={(event) => handleNavigate(event, "district")}
            >
              Browse District
            </a>
          </li>
          <li className="navbar-item">
            <a href="#about" className="navbar-link navbar-link-primary">
              About
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-underline"></div>
    </nav>
  );
}

export default Navbar;
