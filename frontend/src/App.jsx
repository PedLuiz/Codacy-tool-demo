import React from "react";
import AdminLab from "./components/AdminLab";
import ReportsPanel from "./components/ReportsPanel";
import TrendPanel from "./components/TrendPanel";
import UserLeaderboard from "./components/UserLeaderboard";
import UserList from "./components/UserList";
import "./styles.css";

function App() {
  return React.createElement(
    "main",
    { className: "container" },
    React.createElement("h1", null, "Codacy Real-Time Analysis Demo"),
    React.createElement(
      "p",
      null,
      "React + Express project with extra features and intentionally injected issues."
    ),
    React.createElement(UserList),
    React.createElement(UserLeaderboard),
    React.createElement(ReportsPanel),
    React.createElement(TrendPanel),
    React.createElement(AdminLab),
  );
}

export default App;
