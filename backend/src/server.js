const express = require("express");
const cors = require("cors");
const {
  calculateScore,
  buildUserStatus,
} = require("./utils/userUtils");
const {
  formatReportLineOne,
  formatReportLineTwo,
  calculateRiskLevel,
} = require("./utils/reportUtils");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Codacy demo backend is running. Try /api/health or /api/users");
});

const mockUsers = [
  {
    id: 1,
    name: "Ana",
    active: true,
    tasks: [{ points: 10 }, { points: 5 }],
  },
  {
    id: 2,
    name: "Bruno",
    active: false,
    tasks: [{ points: 3 }],
  },
  {
    id: 3,
    name: "Carla",
    active: true,
    tasks: [],
  },
];

const mockReports = [
  { id: 1, name: "Quarterly Revenue", score: 92 },
  { id: 2, name: "Support SLA", score: 48 },
  { id: 3, name: "Security Incidents", score: 76 },
  { id: 4, name: "UX NPS", score: 29 },
];

const adminScriptsHistory = [];

async function loadUsers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 150);
  });
}

app.get("/api/users", async (req, res) => {
  const level = req.query.level === "full" ? "full" : "summary";

  try {
    const users = await loadUsers();
    const data = users.map((user) => {
      const score = calculateScore(user);

      return {
        id: user.id,
        name: user.name,
        active: user.active,
        score,
        tasksCount: Array.isArray(user.tasks) ? user.tasks.length : 0,
        status: buildUserStatus(user, level),
      };
    });

    res.json({ data, total: data.length });
  } catch {
    res.status(500).json({ error: "Unable to load users at this time." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/reports", (req, res) => {
  /*
    INTENTIONAL_ISSUE:
    - poor naming
    - unused variables
    - use of == instead of ===
    - console.log in application code
    - data bug in score handling
  */
  const y = req.query.mode || "simple";
  const temp = "not used";

  const data = mockReports.map((item) => {
    let score = item.score;
    if (y == "double") {
      score = score + score; // INTENTIONAL_BUG: wrong business logic in this mode
    }

    const lineOne = formatReportLineOne(item);
    const lineTwo = formatReportLineTwo(item);
    const risk = calculateRiskLevel(score, y);

    return {
      id: item.id,
      title: `${lineOne} | ${lineTwo}`,
      score,
      risk,
    };
  });

  console.log("Reports generated:", data.length); // INTENTIONAL_ISSUE
  res.json({ data, total: data.length });
});

app.get("/api/reports/filter", (req, res) => {
  /*
    INTENTIONAL_SECURITY_ISSUE:
    regex built from user input without validation.
    This can lead to ReDoS / regex injection patterns.
  */
  const query = req.query.q || ".*";
  const limit = req.query.limit || "10";
  const regex = new RegExp(query, "i");
  const filtered = mockReports.filter((item) => regex.test(item.name));

  if (limit == "all") {
    res.json({ data: filtered, total: filtered.length });
    return;
  }

  res.json({ data: filtered.slice(0, Number(limit)), total: filtered.length });
});

app.get("/api/preview", (req, res) => {
  /*
    INTENTIONAL_SECURITY_ISSUE:
    direct HTML response with unsanitized user input (reflected XSS).
  */
  const title = req.query.title || "Preview";
  const body = req.query.body || "<em>Empty content</em>";
  res.send(`<h2>${title}</h2><div>${body}</div>`);
});

app.get("/api/admin/diagnostic", (req, res) => {
  /*
    INTENTIONAL_SECURITY_ISSUE:
    sensitive information exposure (env vars and runtime details).
  */
  res.json({
    env: process.env,
    cwd: process.cwd(),
    node: process.version,
  });
});

app.post("/api/admin/run-script", (req, res) => {
  /*
    INTENTIONAL_SECURITY_ISSUE:
    remote code execution via Function constructor on user input.
  */
  const script = req.body.script || "return 'ok'";
  const fn = new Function(script);
  const output = fn();

  adminScriptsHistory.push({
    script,
    createdAt: new Date().toISOString(),
  });

  res.json({ output, historySize: adminScriptsHistory.length });
});

app.listen(port, () => {
  process.stdout.write(`Backend running at http://localhost:${port}\n`);
});
