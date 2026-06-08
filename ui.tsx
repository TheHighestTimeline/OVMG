import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BoxDetail from "./pages/BoxDetail";
import VendorDirectory from "./pages/VendorDirectory";
import Portfolio from "./pages/Portfolio";
import { useStore } from "./store";

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { projects, resetDemo } = useStore();
  const active = projects.filter((p) => p.stage !== "Delivered");
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <img src="/favicon.svg" alt="" />
        <div>
          <b>DCB Tracker</b>
          <span>Data Center in a Box</span>
        </div>
      </div>

      <NavLink to="/" end onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        ▦ Build Board
      </NavLink>
      <NavLink to="/portfolio" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        ▤ Portfolio Metrics
      </NavLink>
      <NavLink to="/vendors" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
        ⚙ Vendor Directory
      </NavLink>

      <div className="nav-section">Active Builds ({active.length})</div>
      {active.map((p) => (
        <NavLink key={p.id} to={`/box/${p.id}`} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          📦 <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.id}</span>
        </NavLink>
      ))}

      <div style={{ marginTop: 24 }}>
        <button className="btn sm" style={{ width: "100%" }} onClick={() => { if (confirm("Reset all demo data back to the seeded examples?")) resetDemo(); }}>
          ↺ Reset demo data
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer whenever the route changes (covers in-page nav like cards).
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <div className="app">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="app-overlay" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <header className="mobile-header">
          <button className="hamburger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>☰</button>
          <div className="brand" style={{ margin: 0 }}>
            <img src="/favicon.svg" alt="" />
            <b>DCB Tracker</b>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/vendors" element={<VendorDirectory />} />
          <Route path="/box/:id" element={<BoxDetail />} />
        </Routes>
      </div>
    </div>
  );
}
