import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = "/api";
const nextStatus = {
  PLANNED: "RUNNING",
  RUNNING: "SUCCEEDED",
  SUCCEEDED: "PLANNED",
  FAILED: "PLANNED",
};

function App() {
  const [deployments, setDeployments] = useState([]);
  const [stats, setStats] = useState({ total: 0, planned: 0, running: 0, succeeded: 0, failed: 0 });
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const [deploymentResponse, statsResponse] = await Promise.all([
        fetch(`${API}/deployments`),
        fetch(`${API}/deployments/stats`),
      ]);
      if (!deploymentResponse.ok || !statsResponse.ok) throw new Error("API connection failed");
      setDeployments(await deploymentResponse.json());
      setStats(await statsResponse.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = filter === "ALL" ? deployments : deployments.filter((item) => item.status === filter);

  const advance = async (deployment) => {
    await fetch(`${API}/deployments/${deployment.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus[deployment.status] }),
    });
    load();
  };

  const create = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`${API}/deployments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_name: form.get("service_name"),
        version: form.get("version"),
        environment: form.get("environment"),
        risk: form.get("risk"),
        owner: form.get("owner"),
        change_summary: form.get("change_summary"),
      }),
    });
    if (!response.ok) {
      setError("The deployment could not be created");
      return;
    }
    event.currentTarget.reset();
    setShowForm(false);
    load();
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">D</span><div><b>DeployFlow</b><small>Release operations</small></div></div>
        <nav>
          <a className="active">▦ <span>Overview</span></a>
          <a>◇ <span>Deployments</span></a>
          <a>◫ <span>Services</span></a>
          <a>⌁ <span>Observability</span></a>
        </nav>
        <div className="side-bottom">
          <div className="upgrade"><strong>Release with context</strong><p>Track service versions, environment risk and deployment state in one view.</p></div>
          <div className="profile"><div className="avatar">DO</div><div><b>DevOps team</b><small>Platform engineering</small></div><span>⋮</span></div>
        </div>
      </aside>
      <main className="main">
        <header>
          <div><p className="eyebrow">RELEASE CONTROL / OVERVIEW</p><h1>Deployment command center</h1><p className="muted">Current changes across development, staging and production.</p></div>
          <button className="primary" onClick={() => setShowForm(true)}>＋ Plan deployment</button>
        </header>
        {error && <div className="alert">⚠ {error}. Confirm the backend and PostgreSQL services are healthy.</div>}
        <section className="stats">
          <Stat label="All deployments" value={stats.total} icon="▦" />
          <Stat label="Planned" value={stats.planned} icon="○" />
          <Stat label="Running" value={stats.running} icon="◔" />
          <Stat label="Succeeded" value={stats.succeeded} icon="✓" />
        </section>
        <section className="content-grid">
          <div className="panel tasks-panel">
            <div className="panel-head"><div><h2>Release queue</h2><p className="muted">Review ownership and risk before promotion.</p></div><div className="filters">{["ALL", "PLANNED", "RUNNING", "SUCCEEDED", "FAILED"].map((item) => <button className={filter === item ? "selected" : ""} onClick={() => setFilter(item)} key={item}>{item === "ALL" ? "All" : item}</button>)}</div></div>
            {loading ? <div className="empty">Loading deployments…</div> : <div className="table-wrap"><table><thead><tr><th>Service</th><th>Environment</th><th>Owner</th><th>Risk</th><th>Status</th><th></th></tr></thead><tbody>{visible.map((deployment) => <tr key={deployment.id}><td><div className="task-title"><span className={`dot ${deployment.status.toLowerCase()}`}></span><div><b>{deployment.service_name} <code>{deployment.version}</code></b><small>{deployment.change_summary}</small></div></div></td><td><span className="environment">{deployment.environment}</span></td><td>{deployment.owner}</td><td><span className={`priority ${deployment.risk.toLowerCase()}`}>{deployment.risk}</span></td><td><span className={`status ${deployment.status.toLowerCase()}`}>{deployment.status}</span></td><td><button className="icon-btn" onClick={() => advance(deployment)} title="Advance deployment status">↻</button></td></tr>)}</tbody></table>{!visible.length && <div className="empty">No deployments match this filter.</div>}</div>}
          </div>
          <aside className="panel activity">
            <div className="panel-head"><div><h2>Delivery signals</h2><p className="muted">Evidence collected by the platform.</p></div></div>
            <Activity icon="✓" text="API health check passed" time="Just now" />
            <Activity icon="◔" text="Prometheus scrape active" time="15 seconds ago" />
            <Activity icon="⌁" text="Image scan policy enabled" time="Pipeline policy" />
            <Activity icon="↗" text="SHA image tags required" time="Release policy" />
            <div className="pipeline"><span>TEST</span><i></i><span>BUILD</span><i></i><span>SCAN</span><i></i><span>DEPLOY</span></div>
          </aside>
        </section>
        {showForm && <div className="modal-backdrop"><form className="modal" onSubmit={create}><div className="modal-head"><div><p className="eyebrow">CHANGE REQUEST</p><h2>Plan a deployment</h2></div><button type="button" className="close" onClick={() => setShowForm(false)}>×</button></div><div className="form-row"><label>Service<input name="service_name" required placeholder="payments-api" /></label><label>Version<input name="version" required placeholder="v2.4.0" /></label></div><label>Change summary<textarea name="change_summary" placeholder="What will change?" /></label><div className="form-row"><label>Environment<select name="environment"><option>DEV</option><option>STAGING</option><option>PRODUCTION</option></select></label><label>Risk<select name="risk"><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></label></div><label>Owner<input name="owner" defaultValue="Platform team" /></label><button className="primary full">Add to release queue</button></form></div>}
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong><span>Live from the API</span></div></div>;
}

function Activity({ icon, text, time }) {
  return <div className="activity-row"><span className="activity-icon">{icon}</span><div><b>{text}</b><small>{time}</small></div></div>;
}

createRoot(document.getElementById("root")).render(<App />);
