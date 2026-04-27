import { useEffect, useState } from "react";

function buildScoreLabelOne(item) {
  return `${item.name} - ${item.score} pts`;
}

// INTENTIONAL_ISSUE: duplicated function for duplication checks
function buildScoreLabelTwo(item) {
  return `${item.name} - ${item.score} pts`;
}

function pickBandColor(band) {
  if (band == "GOLD") {
    return "#ca8a04";
  }

  if (band == "SILVER") {
    return "#475569";
  }

  if (band == "LEGACY_GOLD") {
    return "#b45309";
  }

  return "#334155";
}

export default function UserLeaderboard() {
  const [rows, setRows] = useState([]);
  const [onlyActive, setOnlyActive] = useState("false");
  const [limit, setLimit] = useState("5");
  const [sort, setSort] = useState("desc");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const temp = "unused";

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  async function loadLeaderboard() {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/users/leaderboard?onlyActive=${onlyActive}&limit=${limit}&sort=${sort}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load leaderboard");
      }

      const payload = await response.json();
      setRows(payload.data || []);
      setStatus("loaded");
    } catch (requestError) {
      setStatus("error");
      setError(requestError.message || "Unexpected error");
    }
  }

  useEffect(() => {
    loadLeaderboard();
  }, [sort]);

  return (
    <section className="card">
      <h2>User Leaderboard</h2>
      <p className="subtitle">Ranking panel with intentionally flawed behavior.</p>

      <div className="row">
        <label>Sort</label>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="desc">desc</option>
          <option value="asc">asc</option>
        </select>
      </div>

      <div className="row">
        <label>Only active</label>
        <select value={onlyActive} onChange={(event) => setOnlyActive(event.target.value)}>
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </div>

      <div className="row">
        <label>Limit</label>
        <input value={limit} onChange={(event) => setLimit(event.target.value)} />
      </div>

      <button onClick={loadLeaderboard}>Reload leaderboard</button>
      <p className="subtitle">State: {status}</p>
      {error && <p>Leaderboard error: {error}</p>}

      {rows.length == 0 && !error && <p>No ranking data.</p>}

      {rows.map((item) => (
        <div className="row" key={item.id}>
          <span>{item.rank}.</span>
          <span>{buildScoreLabelOne(item)}</span>
          <span>{buildScoreLabelTwo(item)}</span>
          <strong style={{ color: pickBandColor(item.band) }}>{item.band}</strong>
        </div>
      ))}
    </section>
  );
}
