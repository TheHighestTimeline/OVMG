import { useRef, useState } from "react";
import type { Project, PurchaseOrder, DocFile, POStage } from "../types";
import { useStore } from "../store";
import { Badge, StatusBadge, SelectCell, Modal } from "./ui";
import { fmtDate, fmtMoney, fmtBytes, uid, todayISO } from "../lib/util";

const ITEM_STATUSES = ["Planned", "Quoted", "Ordered", "In Transit", "Received", "Installed", "Cancelled"] as const;
const VENDOR_STATUSES = ["Not Started", "Contracted", "Outreach Sent", "Confirmed", "In Progress", "Complete"] as const;
const TASK_STATUSES = ["Not Started", "In Progress", "Blocked", "Complete"] as const;
const PO_STAGES: POStage[] = ["Quote", "PO Issued", "In Transit", "Received", "Closed"];

// ─────────────────────────────────────────── Summary
export function SummaryTab({ p }: { p: Project }) {
  const { updateProject } = useStore();
  return (
    <div className="grid cols-2">
      <div className="panel">
        <h3>Project Overview</h3>
        <dl className="kv">
          <dt>Project ID</dt><dd>{p.id}</dd>
          <dt>Customer</dt><dd>{p.customer}</dd>
          <dt>Contract #</dt><dd>{p.contractNo}</dd>
          <dt>Requested delivery</dt><dd>{fmtDate(p.requestedDelivery)}</dd>
          <dt>Owner</dt><dd>{p.owner}</dd>
          <dt>Location</dt><dd>{p.location}</dd>
        </dl>
        <div className="field mt">
          <label>Description</label>
          <textarea rows={3} value={p.description} onChange={(e) => updateProject(p.id, (x) => ({ ...x, description: e.target.value }))} />
        </div>
        <div className="field">
          <label>Security requirements</label>
          <textarea rows={2} value={p.securityRequirements} onChange={(e) => updateProject(p.id, (x) => ({ ...x, securityRequirements: e.target.value }))} />
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel">
          <h3>Milestone Timeline</h3>
          {p.milestones.map((m) => {
            const late = m.actual && new Date(m.actual) > new Date(m.planned);
            return (
              <div key={m.label} className="spread" style={{ padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <span>{m.label}</span>
                <span className="row" style={{ gap: 8 }}>
                  <span className="muted" style={{ fontSize: 12 }}>plan {fmtDate(m.planned)}</span>
                  {m.actual ? <Badge color={late ? "amber" : "green"}>actual {fmtDate(m.actual)}</Badge> : <Badge color="gray">pending</Badge>}
                </span>
              </div>
            );
          })}
        </div>
        <div className="panel">
          <h3>Stakeholder Roster</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Role</th><th>Name</th><th>Email</th></tr></thead>
              <tbody>
                {p.stakeholders.map((s, i) => (
                  <tr key={i}><td>{s.role}</td><td>{s.name}</td><td>{s.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── BOM
export function BomTab({ p }: { p: Project }) {
  const { updateProject, logAudit } = useStore();
  const vendorName = (code: string) => p.vendors.find((v) => v.id === code)?.name;
  const setStatus = (itemId: string, status: string) => {
    updateProject(p.id, (x) => ({
      ...x,
      bom: x.bom.map((b) =>
        b.id === itemId
          ? { ...b, status: status as any, receivedDate: status === "Received" || status === "Installed" ? (b.receivedDate ?? todayISO().slice(0, 10)) : b.receivedDate }
          : b,
      ),
    }));
    const it = p.bom.find((b) => b.id === itemId);
    logAudit(p.id, `BOM item ${it?.partNo} → ${status}`, itemId);
  };
  const received = p.bom.filter((b) => b.status === "Received" || b.status === "Installed").length;
  return (
    <div className="panel">
      <div className="spread mb">
        <h3 style={{ margin: 0 }}>Bill of Materials</h3>
        <span className="muted">{received}/{p.bom.length} received · {p.bom.reduce((s, b) => s + b.qty, 0)} total units</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Part #</th><th>Description</th><th>Qty</th><th>Vendor</th>
              <th>EPS ID</th><th>Category</th><th>Status</th><th>Required</th><th>Serial Tag</th>
            </tr>
          </thead>
          <tbody>
            {p.bom.map((b) => (
              <tr key={b.id}>
                <td>{b.itemNo}</td>
                <td><code>{b.partNo}</code></td>
                <td>{b.description}</td>
                <td>{b.qty} {b.uom}</td>
                <td>{vendorName(b.vendorCode) ?? b.vendorCode}</td>
                <td className="muted">{b.epsItemId}</td>
                <td><Badge color="gray">{b.category}</Badge></td>
                <td><SelectCell value={b.status} options={ITEM_STATUSES} onChange={(v) => setStatus(b.id, v)} /></td>
                <td>{fmtDate(b.requiredDate)}</td>
                <td className="muted">{b.serialTag ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── Vendors & Contracts
export function VendorsTab({ p }: { p: Project }) {
  const { updateProject, logAudit } = useStore();
  const setStatus = (vid: string, status: string) => {
    updateProject(p.id, (x) => ({ ...x, vendors: x.vendors.map((v) => (v.id === vid ? { ...v, status: status as any } : v)) }));
    const ven = p.vendors.find((v) => v.id === vid);
    logAudit(p.id, `Vendor ${ven?.name} → ${status}`, vid);
  };
  const sendOutreach = (vid: string) => {
    const ven = p.vendors.find((v) => v.id === vid);
    setStatus(vid, "Outreach Sent");
    alert(`(Demo) Outreach email drafted to ${ven?.contactName} <${ven?.contactEmail}> for ${ven?.scope}.\n\nIn production this hooks to the Gmail/Outlook connector.`);
  };
  return (
    <div className="panel">
      <h3>Vendors & Contracts</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Vendor</th><th>Scope</th><th>Contract #</th><th>Contact</th><th>Location</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {p.vendors.map((v) => (
              <tr key={v.id}>
                <td><b>{v.name}</b></td>
                <td><Badge color="purple">{v.scope}</Badge></td>
                <td className="muted">{v.contractNo}</td>
                <td>{v.contactName}<br /><span className="muted" style={{ fontSize: 12 }}>{v.contactEmail}</span></td>
                <td>{v.location}</td>
                <td><SelectCell value={v.status} options={VENDOR_STATUSES} onChange={(s) => setStatus(v.id, s)} /></td>
                <td><button className="btn sm" onClick={() => sendOutreach(v.id)}>✉ Outreach</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── Procurement Kanban (POs)
export function ProcurementTab({ p }: { p: Project }) {
  const { updateProject, logAudit } = useStore();
  const [drag, setDrag] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const move = (poId: string, stage: POStage) => {
    updateProject(p.id, (x) => ({ ...x, purchaseOrders: x.purchaseOrders.map((po) => (po.id === poId ? { ...po, stage } : po)) }));
    const po = p.purchaseOrders.find((o) => o.id === poId);
    logAudit(p.id, `${po?.poNumber} → ${stage}`, poId);
    setDrag(null);
  };
  const vendorName = (id: string) => p.vendors.find((v) => v.id === id)?.name ?? "—";

  return (
    <>
      <div className="spread mb">
        <h3 style={{ margin: 0 }}>Procurement — Purchase Orders</h3>
        <button className="btn primary sm" onClick={() => setShowAdd(true)}>+ New PO</button>
      </div>
      <div className="kanban">
        {PO_STAGES.map((stage) => {
          const items = p.purchaseOrders.filter((po) => po.stage === stage);
          const total = items.reduce((s, po) => s + po.amount, 0);
          return (
            <div key={stage} className="kcol" style={{ width: 240 }}
              onDragOver={(e) => e.preventDefault()} onDrop={() => drag && move(drag, stage)}>
              <div className="kcol-head"><span>{stage}</span><span className="count">{fmtMoney(total)}</span></div>
              <div className="kcol-body">
                {items.map((po) => (
                  <div key={po.id} className="kcard" draggable onDragStart={() => setDrag(po.id)}>
                    <div className="id">{po.poNumber}</div>
                    <div className="title" style={{ fontSize: 13 }}>{po.description}</div>
                    <div className="meta">{vendorName(po.vendorId)}</div>
                    <div className="meta">{fmtMoney(po.amount)} · ETA {fmtDate(po.expectedDelivery)}</div>
                    {po.trackingNumber && <div className="meta">📦 {po.trackingNumber}</div>}
                  </div>
                ))}
                {items.length === 0 && <div className="muted" style={{ textAlign: "center", fontSize: 12 }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
      {showAdd && <AddPOModal p={p} onClose={() => setShowAdd(false)} />}
    </>
  );
}

function AddPOModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const { updateProject, logAudit } = useStore();
  const [f, setF] = useState({ description: "", vendorId: p.vendors[0]?.id ?? "", amount: "", expectedDelivery: "" });
  const submit = () => {
    if (!f.description.trim()) return alert("Add a description.");
    const po: PurchaseOrder = {
      id: uid("po"),
      poNumber: `PO-${Math.floor(40000 + Math.random() * 9999)}`,
      vendorId: f.vendorId,
      description: f.description,
      amount: Number(f.amount) || 0,
      stage: "Quote",
      creationDate: todayISO().slice(0, 10),
      expectedDelivery: f.expectedDelivery || todayISO().slice(0, 10),
    };
    updateProject(p.id, (x) => ({ ...x, purchaseOrders: [...x.purchaseOrders, po] }));
    logAudit(p.id, `${po.poNumber} created (${po.description})`, po.id);
    onClose();
  };
  return (
    <Modal title="New Purchase Order" onClose={onClose}>
      <div className="field"><label>Description *</label><input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} autoFocus /></div>
      <div className="field"><label>Vendor</label>
        <select value={f.vendorId} onChange={(e) => setF({ ...f, vendorId: e.target.value })}>
          {p.vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>
      <div className="grid cols-2">
        <div className="field"><label>Amount (USD)</label><input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></div>
        <div className="field"><label>Expected delivery</label><input type="date" value={f.expectedDelivery} onChange={(e) => setF({ ...f, expectedDelivery: e.target.value })} /></div>
      </div>
      <div className="modal-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={submit}>Add PO</button></div>
    </Modal>
  );
}

// ─────────────────────────────────────────── Build Plan
export function BuildTab({ p }: { p: Project }) {
  const { updateProject, logAudit } = useStore();
  const setStatus = (tid: string, status: string) => {
    updateProject(p.id, (x) => ({ ...x, buildTasks: x.buildTasks.map((t) => (t.id === tid ? { ...t, status: status as any } : t)) }));
    const t = p.buildTasks.find((t) => t.id === tid);
    logAudit(p.id, `Build task "${t?.name}" → ${status}`, tid);
  };
  const done = p.buildTasks.filter((t) => t.status === "Complete").length;
  return (
    <div className="panel">
      <div className="spread mb">
        <h3 style={{ margin: 0 }}>Build Plan</h3>
        <span className="muted">{done}/{p.buildTasks.length} complete</span>
      </div>
      <div className="pill-progress mb"><div style={{ width: `${p.buildTasks.length ? (done / p.buildTasks.length) * 100 : 0}%` }} /></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Task</th><th>Owner</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
          <tbody>
            {p.buildTasks.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td><Badge color="gray">{t.ownerRole}</Badge></td>
                <td>{fmtDate(t.startDate)}</td>
                <td>{fmtDate(t.endDate)}</td>
                <td><SelectCell value={t.status} options={TASK_STATUSES} onChange={(s) => setStatus(t.id, s)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── Quality & Docs
export function QualityTab({ p }: { p: Project }) {
  const { updateProject, logAudit } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = async (files: FileList) => {
    const docs: DocFile[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(file);
      });
      docs.push({
        id: uid("doc"),
        name: file.name,
        type: file.type || "file",
        category: guessCategory(file.name),
        size: file.size,
        uploadedAt: todayISO(),
        dataUrl,
      });
    }
    updateProject(p.id, (x) => ({ ...x, documents: [...docs, ...x.documents] }));
    logAudit(p.id, `Uploaded ${docs.length} document(s)`, "documents");
  };

  const addInspection = () => {
    const name = prompt("Inspection name?");
    if (!name) return;
    updateProject(p.id, (x) => ({
      ...x,
      inspections: [{ id: uid("i"), name, inspector: "Yuki Tanaka", result: "Pending", timestamp: todayISO() }, ...x.inspections],
    }));
    logAudit(p.id, `Inspection "${name}" added`, "inspection");
  };
  const setResult = (iid: string, result: string) => {
    updateProject(p.id, (x) => ({ ...x, inspections: x.inspections.map((i) => (i.id === iid ? { ...i, result: result as any, timestamp: todayISO() } : i)) }));
    const ins = p.inspections.find((i) => i.id === iid);
    logAudit(p.id, `Inspection "${ins?.name}" → ${result}`, iid);
  };

  return (
    <div className="grid cols-2">
      <div className="panel">
        <div className="spread mb"><h3 style={{ margin: 0 }}>Inspections</h3><button className="btn sm" onClick={addInspection}>+ Add</button></div>
        {p.inspections.length === 0 ? <div className="empty">No inspections recorded.</div> :
          <div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Inspector</th><th>When</th><th>Result</th></tr></thead>
            <tbody>{p.inspections.map((i) => (
              <tr key={i.id}><td>{i.name}</td><td>{i.inspector}</td><td>{fmtDate(i.timestamp)}</td>
                <td><SelectCell value={i.result} options={["Pending", "Pass", "Fail"]} onChange={(r) => setResult(i.id, r)} /></td></tr>
            ))}</tbody>
          </table></div>}
      </div>

      <div className="panel">
        <h3>Documents & Certifications</h3>
        <div
          className={`dropzone ${dragOver ? "drag" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        >
          ⬆ Drag & drop certifications, shipping docs, email screenshots…<br />
          <span style={{ fontSize: 12 }}>or click to browse</span>
          <input ref={fileRef} type="file" multiple style={{ display: "none" }}
            onChange={(e) => e.target.files && addFiles(e.target.files)} />
        </div>
        <div className="mt">
          {p.documents.length === 0 ? <div className="empty">No documents uploaded yet.</div> :
            p.documents.map((d) => (
              <div key={d.id} className="spread" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <a href={d.dataUrl} download={d.name}>{d.name}</a>
                  <div className="muted" style={{ fontSize: 12 }}>{fmtBytes(d.size)} · {fmtDate(d.uploadedAt)}</div>
                </div>
                <Badge color="blue">{d.category}</Badge>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function guessCategory(name: string): DocFile["category"] {
  const n = name.toLowerCase();
  if (n.match(/cert|coc|compliance|itar/)) return "Certification";
  if (n.match(/ship|bol|track|invoice/)) return "Shipping";
  if (n.match(/email|screenshot|\.eml|\.msg/)) return "Email";
  if (n.match(/draw|dwg|cad|spec/)) return "Drawing";
  if (n.match(/\.png|\.jpg|\.jpeg|\.heic/)) return "Photo";
  return "Other";
}

// ─────────────────────────────────────────── Logistics & Deployment
export function LogisticsTab({ p }: { p: Project }) {
  const { updateProject } = useStore();
  const d = p.deployment;
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    updateProject(p.id, (x) => ({ ...x, deployment: { ...x.deployment, [k]: e.target.value } }));
  return (
    <div className="panel" style={{ maxWidth: 640 }}>
      <h3>Logistics & Deployment</h3>
      <div className="field"><label>Container serial number</label><input value={d.containerSerial} onChange={set("containerSerial")} placeholder="IRNH-2026-…" /></div>
      <div className="field"><label>Site address</label><input value={d.siteAddress} onChange={set("siteAddress")} placeholder="Building, base, city, state" /></div>
      <div className="grid cols-2">
        <div className="field"><label>Ship method</label><input value={d.shipMethod} onChange={set("shipMethod")} /></div>
        <div className="field"><label>Install lead vendor</label>
          <select value={d.installLeadVendorId ?? ""} onChange={set("installLeadVendorId")}>
            <option value="">—</option>
            {p.vendors.filter((v) => v.scope === "Install / Commissioning" || v.scope === "Logistics / Shipping").map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid cols-3">
        <div className="field"><label>Ship date</label><input type="date" value={d.shipDate ?? ""} onChange={set("shipDate")} /></div>
        <div className="field"><label>Arrival date</label><input type="date" value={d.arrivalDate ?? ""} onChange={set("arrivalDate")} /></div>
        <div className="field"><label>Handover date</label><input type="date" value={d.handoverDate ?? ""} onChange={set("handoverDate")} /></div>
      </div>
      <label className="row" style={{ cursor: "pointer", marginTop: 8 }}>
        <input type="checkbox" style={{ width: "auto" }} checked={d.customerSignoff}
          onChange={(e) => updateProject(p.id, (x) => ({ ...x, deployment: { ...x.deployment, customerSignoff: e.target.checked } }))} />
        Customer sign-off received
      </label>
    </div>
  );
}

// ─────────────────────────────────────────── Audit Trail
export function AuditTab({ p }: { p: Project }) {
  return (
    <div className="panel">
      <h3>Audit Trail <span className="muted" style={{ fontWeight: 400 }}>· immutable change log for compliance</span></h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th></tr></thead>
          <tbody>
            {p.audit.map((a) => (
              <tr key={a.id}>
                <td className="muted">{new Date(a.timestamp).toLocaleString()}</td>
                <td>{a.user}</td><td>{a.action}</td><td className="muted"><code>{a.entity}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
