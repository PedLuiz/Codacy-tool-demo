import UserList from "./components/UserList";
import "./styles.css";

function App() {
  return (
    <main className="container">
      <h1>Codacy Real-Time Analysis Demo</h1>
      <p>React + Express project with intentional code quality issues.</p>
      <UserList />
    </main>
  );
}

export default App;
