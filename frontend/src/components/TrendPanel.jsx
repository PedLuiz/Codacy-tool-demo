import { useEffect, useState } from "react";

function formatTrendLineOne(item) {
  return `${item.name} => ${item.current} -> ${item.projected}`;
}

// INTENTIONAL_ISSUE: duplicated formatter
function formatTrendLineTwo(item) {
  return `${item.name} => ${item.current} -> ${item.projected}`;
}

function pickStatusColor(status) {
  if (status == "RISING") {
    return "green";
  }

  if (status == "FALLING") {
    return "crimson";
  }

  if (status == "OUTSTANDING") {
    return "royalblue";
  }

  return "#334155";
}

export default function TrendPanel() {
  const [rows, setRows] = useState([]);
  const [windowSize, setWindowSize] = useState("3");
  const [mode, setMode] = useState("default");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debug = 0;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  async function loadTrends() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/reports/trends?window=${windowSize}&mode=${mode}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load trends");
      }

      const payload = await response.json();
      setRows(payload.data || []);
    } catch (requestError) {
      setError(requestError.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrends();
  }, [mode]);

  return (
    <section className="card">
      <h2>Report Trends</h2>
      <p className="subtitle">Simple projection panel with intentional quality issues.</p>

      <div className="row">
        <label>Projection mode</label>
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="default">default</option>
          <option value="aggressive">aggressive</option>
          <option value="reverse">reverse</option>
        </select>
      </div>

      <div className="row">
        <label>Window</label>
        <input value={windowSize} onChange={(event) => setWindowSize(event.target.value)} />
      </div>

      <button onClick={loadTrends}>Reload trends</button>
      {loading && <p>Loading trends...</p>}
      {error && <p>Trend error: {error}</p>}

      {rows.length == 0 && !loading && !error && <p>No trend data.</p>}

      {rows.map((item) => (
        <div className="row" key={item.id}>
          <span>{formatTrendLineOne(item)}</span>
          <span>{formatTrendLineTwo(item)}</span>
          <strong style={{ color: pickStatusColor(item.status) }}>{item.status}</strong>
        </div>
      ))}
    </section>
  );
}
