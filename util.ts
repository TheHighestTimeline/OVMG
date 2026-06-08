import React from "react";

type Color = "green" | "amber" | "red" | "blue" | "purple" | "gray";

export function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: Color }) {
  return <span className={`badge ${color}`}>{children}</span>;
}

const STAGE_COLOR: Record<string, Color> = {
  Planning: "gray",
  Procurement: "blue",
  Build: "amber",
  Test: "purple",
  Ship: "blue",
  Delivered: "green",
};
export const stageColor = (s: string): Color => STAGE_COLOR[s] ?? "gray";

const STATUS_COLOR: Record<string, Color> = {
  // item / PO
  Planned: "gray",
  Quoted: "blue",
  Ordered: "blue",
  "In Transit": "amber",
  Received: "green",
  Installed: "green",
  Cancelled: "red",
  Quote: "gray",
  "PO Issued": "blue",
  Closed: "green",
  // tasks
  "Not Started": "gray",
  "In Progress": "amber",
  Blocked: "red",
  Complete: "green",
  // vendor
  Contracted: "blue",
  "Outreach Sent": "amber",
  Confirmed: "purple",
  // inspection
  Pass: "green",
  Fail: "red",
  Pending: "amber",
};
export const statusColor = (s: string): Color => STATUS_COLOR[s] ?? "gray";

export function StatusBadge({ value }: { value: string }) {
  return <Badge color={statusColor(value)}>{value}</Badge>;
}

/** Inline editable select cell. */
export function SelectCell({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "auto", padding: "3px 6px", fontSize: 12 }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Modal({
  title,
  hint,
  onClose,
  children,
}: {
  title: string;
  hint?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {hint && <p className="hint">{hint}</p>}
        {children}
      </div>
    </div>
  );
}
