import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store";
import { STAGES, type Stage } from "../types";
import { Badge, stageColor } from "../components/ui";
import { fmtDate } from "../lib/util";
import {
  SummaryTab, BomTab, VendorsTab, ProcurementTab,
  BuildTab, QualityTab, LogisticsTab, AuditTab,
} from "../components/tabs";

const TABS = [
  "Summary", "Bill of Materials", "Vendors & Contracts", "Procurement",
  "Build Plan", "Quality & Docs", "Logistics & Deployment", "Audit Trail",
] as const;

export default function BoxDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { getProject, moveStage, deleteProject } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Summary");

  const p = id ? getProject(id) : undefined;
  if (!p) {
    return (
      <div className="content">
        <div className="empty">Box not found. <Link to="/">Back to board</Link></div>
      </div>
    );
  }

  // alerts
  const overduePOs = p.purchaseOrders.filter((o) => o.stage !== "Received" && o.stage !== "Closed" && new Date(o.expectedDelivery) < new Date());
  const openTasks = p.buildTasks.filter((t) => t.status !== "Complete").length;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <Link to="/" className="muted">← Board</Link>
            <h1 style={{ margin: 0 }}>{p.name}</h1>
            <Badge color={stageColor(p.stage)}>{p.stage}</Badge>
          </div>
          <span className="muted">{p.id} · {p.customer} · due {fmtDate(p.requestedDelivery)}</span>
        </div>
        <div className="row">
          <select value={p.stage} onChange={(e) => moveStage(p.id, e.target.value as Stage)} style={{ width: "auto" }}>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn danger sm" onClick={() => { if (confirm(`Delete ${p.id}? This cannot be undone.`)) { deleteProject(p.id); nav("/"); } }}>Delete</button>
        </div>
      </div>

      <div className="content">
        {/* Quick-info tiles */}
        <div className="grid cols-4 mb">
          <div className="tile"><div className="label">Container SN</div><div className="value" style={{ fontSize: 18 }}>{p.deployment.containerSerial || "Unassigned"}</div></div>
          <div className="tile"><div className="label">Location</div><div className="value" style={{ fontSize: 18 }}>{p.location}</div></div>
          <div className="tile"><div className="label">Open build tasks</div><div className="value">{openTasks}</div></div>
          <div className="tile"><div className="label">Overdue POs</div><div className="value" style={{ color: overduePOs.length ? "var(--red)" : undefined }}>{overduePOs.length}</div></div>
        </div>

        {overduePOs.length > 0 && (
          <div className="banner" style={{ borderLeftColor: "var(--red)" }}>
            ⚠ {overduePOs.length} purchase order(s) past expected delivery: {overduePOs.map((o) => o.poNumber).join(", ")}
          </div>
        )}

        <div className="tabs mb">
          {TABS.map((t) => (
            <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        {tab === "Summary" && <SummaryTab p={p} />}
        {tab === "Bill of Materials" && <BomTab p={p} />}
        {tab === "Vendors & Contracts" && <VendorsTab p={p} />}
        {tab === "Procurement" && <ProcurementTab p={p} />}
        {tab === "Build Plan" && <BuildTab p={p} />}
        {tab === "Quality & Docs" && <QualityTab p={p} />}
        {tab === "Logistics & Deployment" && <LogisticsTab p={p} />}
        {tab === "Audit Trail" && <AuditTab p={p} />}
      </div>
    </>
  );
}
