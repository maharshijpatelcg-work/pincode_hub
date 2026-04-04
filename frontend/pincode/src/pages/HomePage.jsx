import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function HomePage() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="container">
        <div className="header">
          <h1>🚀 Pincode Finder - India</h1>
          <p>Search for any Indian pincode to get detailed postal information</p>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default HomePage;
