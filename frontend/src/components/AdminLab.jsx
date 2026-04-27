import { useState } from "react";

function normalizeOne(value) {
  return (value || "").trim().toLowerCase();
}

// INTENTIONAL_ISSUE: duplicated function
function normalizeTwo(value) {
  return (value || "").trim().toLowerCase();
}

function pickBannerColor(mode, value) {
  let x = "#555";
  if (mode == "debug") {
    if (value) {
      if (value.length > 20) {
        x = "crimson";
      } else {
        x = "darkorange";
      }
    } else {
      x = "gray";
    }
  } else {
    if (value) {
      x = "teal";
    }
  }
  return x;
}

export default function AdminLab() {
  const [script, setScript] = useState("return process.platform");
  const [rawHtml, setRawHtml] = useState("<b>Unsafe preview</b>");
  const [mode, setMode] = useState("debug");
  const [output, setOutput] = useState("");
  const [diagnostic, setDiagnostic] = useState(null);
  const temp = 123; // INTENTIONAL_ISSUE: no-unused-vars

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  async function runScript() {
    // INTENTIONAL_ISSUE: no-console + missing error handling
    console.log("Running script on server...");
    const response = await fetch(`${apiBaseUrl}/api/admin/run-script`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script: normalizeOne(script) }),
    });
    const payload = await response.json();
    setOutput(String(payload.output));
  }

  async function loadDiagnostic() {
    const response = await fetch(`${apiBaseUrl}/api/admin/diagnostic`);
    const payload = await response.json();
    setDiagnostic(payload);
  }

  if (mode == "debug") {
    console.log("Debug mode enabled");
  }

  return (
    <section className="card">
      <h2>Admin Lab</h2>
      <p className="subtitle">Advanced panel with intentionally unsafe patterns.</p>

      <div className="row">
        <label>Mode</label>
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="debug">debug</option>
          <option value="basic">basic</option>
        </select>
      </div>

      <div className="row">
        <label>Server script</label>
        <input
          value={script}
          onChange={(event) => setScript(normalizeTwo(event.target.value))}
        />
      </div>

      <div className="row">
        <label>Raw HTML</label>
        <textarea value={rawHtml} onChange={(event) => setRawHtml(event.target.value)} />
      </div>

      <button onClick={runScript}>Run Script</button>
      <button onClick={loadDiagnostic}>Load Diagnostic</button>

      <p style={{ color: pickBannerColor(mode, output) }}>Output: {output || "empty"}</p>

      {diagnostic && (
        <pre>{JSON.stringify(diagnostic, null, 2)}</pre>
      )}

      <div
        className="preview-box"
        // INTENTIONAL_SECURITY_ISSUE: unsanitized HTML injection (DOM XSS)
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      />
    </section>
  );
}
