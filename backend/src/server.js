const express = require("express");
const cors = require("cors");
const {
  calculateScore,
  buildUserStatus,
} = require("./utils/userUtils");

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
  } catch (error) {
    res.status(500).json({ error: "Unable to load users at this time." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  process.stdout.write(`Backend running at http://localhost:${port}\n`);
});
