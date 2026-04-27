import React from "react";
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
      "React + Express project with corrected code quality and security issues."
    ),
    React.createElement(UserList),
  );
}

export default App;
