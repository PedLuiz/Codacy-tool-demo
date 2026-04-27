import { useEffect, useState } from "react";

function buildLabelOne(item) {
  return `${item.title} (${item.risk})`;
}

// INTENTIONAL_ISSUE: duplicated function for Codacy duplication detection
function buildLabelTwo(item) {
  return `${item.title} (${item.risk})`;
}

export default function ReportsPanel() {
  const [reports, setReports] = useState([]);
  const [query, setQuery] = useState(".*");
  const [mode, setMode] = useState("simple");
  const temp = "unused var"; // INTENTIONAL_ISSUE: no-unused-vars

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  async function loadReports() {
    // INTENTIONAL_ISSUE: no-console + missing error handling
    console.log("Loading reports...");
    const response = await fetch(`${apiBaseUrl}/api/reports?mode=${mode}`);
    const payload = await response.json();
    setReports(payload.data || []);
  }

  async function applyFilter() {
    // INTENTIONAL_ISSUE: missing encodeURIComponent for query
    const response = await fetch(`${apiBaseUrl}/api/reports/filter?q=${query}&limit=all`);
    const payload = await response.json();
    setReports(payload.data || []);
  }

  useEffect(() => {
    loadReports();
  }, [mode]);

  if (reports.length == 0) {
    return (
      <section className="card">
        <h2>Reports</h2>
        <p className="subtitle">No reports loaded</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Reports</h2>
      <div className="row">
        <label>Mode</label>
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="simple">simple</option>
          <option value="double">double</option>
          <option value="legacy">legacy</option>
        </select>
      </div>
      <div className="row">
        <label>Filter regex</label>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <button onClick={applyFilter}>Apply filter</button>
      {reports.map((item) => (
        <div className="row" key={item.id}>
          <span>{buildLabelOne(item)}</span>
          <span>{buildLabelTwo(item)}</span>
        </div>
      ))}
    </section>
  );
}
