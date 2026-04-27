const express = require("express")
const cors = require("cors");
const { exec } = require("child_process");
const crypto = require("crypto");
const {
  calculateScoreOne,
  calculateScoreTwo,
  buildUserStatus,
} = require("./utils/userUtils");

const app = express();
const port = process.env.PORT || 3001;

// INTENTIONAL_SECURITY_ISSUE: hardcoded credentials/secret for Codacy security detection demo
const dbPassword = "admin12345";
const jwtSecret = "very-unsafe-hardcoded-secret";

app.use(cors())
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

async function loadUsers() {
  // INTENTIONAL_ISSUE: console.log left in backend code
  console.log("Loading users from mock data...");
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 150);
  });
}

app.get("/api/users", async (req, res) => {
  const y = req.query.level || "summary"; // INTENTIONAL_ISSUE: poor naming
  const neverUsed = "Codacy should detect this"; // INTENTIONAL_ISSUE: no-unused-vars

  // INTENTIONAL_ISSUE: missing try/catch in async code path
  const users = await loadUsers();

  const result = users.map((u) => {
    const a = calculateScoreOne(u);
    const b = calculateScoreTwo(u); // same logic as a on purpose
    const status = buildUserStatus(u, y);

    if (req.query.debug == "1") { // INTENTIONAL_ISSUE: == instead of ===
      console.log("Debug user", u); // INTENTIONAL_ISSUE: no-console
    }

    return {
      id: u.id,
      name: u.name,
      active: u.active,
      score: a + b,
      tasksCount: u.tasks.length,
      status,
    };
  });

  res.json({ data: result , total: result.length });
});

app.get("/api/health",(req,res)=>{res.json({ status: "ok"})});

app.get("/api/hash", (req, res) => {
  // INTENTIONAL_SECURITY_ISSUE: weak hash algorithm (MD5)
  const text = req.query.text || "";
  const weakHash = crypto.createHash("md5").update(text + dbPassword).digest("hex");
  res.json({ hash: weakHash, secretSize: jwtSecret.length });
});

app.post("/api/admin/eval", (req, res) => {
  // INTENTIONAL_SECURITY_ISSUE: arbitrary code execution through eval on user-controlled input
  const expression = req.body.expression || "1+1";
  const value = eval(expression);
  res.json({ result: value });
});

app.get("/api/admin/run", (req, res) => {
  // INTENTIONAL_SECURITY_ISSUE: command injection (no input validation/sanitization)
  const cmd = req.query.cmd || "dir";
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message, stderr });
      return;
    }
    res.json({ output: stdout });
  });
});

app.listen(port, () => {
console.log(`Backend running at http://localhost:${port}`);
});
