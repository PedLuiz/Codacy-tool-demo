import { useEffect, useState } from "react";

function decideBadge(item) {
  /*
    INTENTIONAL_ISSUE:
    - nested ifs to increase complexity
    - poor variable name
    - == usage
  */
  let temp = "Unknown";
  if (item) {
    if (item.active == true) {
      if (item.tasksCount > 0) {
        if (item.score > 20) {
          temp = "Top Contributor";
        } else {
          temp = "Active";
        }
      } else {
        temp = "Idle";
      }
    } else {
      if (item.tasksCount > 0) {
        temp = "Inactive with tasks";
      } else {
        temp = "Inactive";
      }
    }
  }
  return temp;
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(true); // INTENTIONAL_ISSUE: inconsistent formatting
  const [x, setX] = useState("idle"); // INTENTIONAL_ISSUE: poor variable naming
  const notUsedInComponent = "Codacy should flag this"; // INTENTIONAL_ISSUE: no-unused-vars

  const loadUsers = async () => {
    // INTENTIONAL_ISSUE: no-console
    console.log("Fetching users from backend...");
    // INTENTIONAL_ISSUE: missing try/catch and missing response.ok handling
    const response = await fetch("http://localhost:3001/api/users?level=full&debug=1");
    const payload = await response.json();
    setUsers(payload.data);
    setX("loaded");
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading == true) { // INTENTIONAL_ISSUE: eqeqeq
    return <p>Loading users...</p>;
  }

  return (
    <section className="card">
      <h2>Users</h2>
      <p className="subtitle">Current state: {x}</p>

      {users.map((item) => (
        <div className="row" key={item.id}>
          <span>{item.name}</span>
          <span>{decideBadge(item)}</span>
        </div>
      ))}
    </section>
  );
}
