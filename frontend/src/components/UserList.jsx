import { useEffect, useState } from "react";

function decideBadge(item) {
  if (!item) {
    return "Unknown";
  }

  if (!item.active) {
    return item.tasksCount > 0 ? "Inactive with tasks" : "Inactive";
  }

  if (item.tasksCount === 0) {
    return "Idle";
  }

  return item.score > 20 ? "Top Contributor" : "Active";
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
        const response = await fetch(`${apiBaseUrl}/api/users?level=full`);

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const payload = await response.json();

        if (!isActive) {
          return;
        }

        setUsers(Array.isArray(payload.data) ? payload.data : []);
        setStatus("loaded");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setError(requestError.message || "Unexpected error");
        setStatus("error");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Failed to load users: {error}</p>;
  }

  return (
    <section className="card">
      <h2>Users</h2>
      <p className="subtitle">Current state: {status}</p>

      {users.map((item) => (
        <div className="row" key={item.id}>
          <span>{item.name}</span>
          <span>{decideBadge(item)}</span>
        </div>
      ))}
    </section>
  );
}
