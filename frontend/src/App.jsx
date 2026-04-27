import React from "react";
import AdminLab from "./components/AdminLab";
import ReportsPanel from "./components/ReportsPanel";
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
    React.createElement(ReportsPanel),
    React.createElement(AdminLab),
  );
}

export default App;
