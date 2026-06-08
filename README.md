// ── Core domain model for the DCB (Data Center in a Box) tracker ────────────

/** The high-level lifecycle stages every box moves through (the top-level Kanban). */
export const STAGES = [
  "Planning",
  "Procurement",
  "Build",
  "Test",
  "Ship",
  "Delivered",
] as const;
export type Stage = (typeof STAGES)[number];

export type ItemStatus =
  | "Planned"
  | "Quoted"
  | "Ordered"
  | "In Transit"
  | "Received"
  | "Installed"
  | "Cancelled";

export type Category =
  | "Mechanical"
  | "Electrical"
  | "IT-Hardware"
  | "Cooling"
  | "Structural"
  | "Networking"
  | "Software"
  | "Other";

export interface BomItem {
  id: string;
  itemNo: string;
  partNo: string;
  description: string;
  qty: number;
  uom: string; // EA, FT, KIT, etc.
  vendorCode: string;
  epsItemId: string;
  category: Category;
  status: ItemStatus;
  requiredDate: string; // ISO date
  receivedDate?: string;
  serialTag?: string;
}

export type VendorScope =
  | "Component Manufacturer"
  | "Container Supplier"
  | "Integration / Outfitting"
  | "Cooling Systems"
  | "Logistics / Shipping"
  | "Install / Commissioning"
  | "Inspection / QA";

export type VendorStatus =
  | "Contracted"
  | "Outreach Sent"
  | "Confirmed"
  | "In Progress"
  | "Complete"
  | "Not Started";

export interface Vendor {
  id: string;
  name: string;
  scope: VendorScope;
  contractNo: string;
  contactName: string;
  contactEmail: string;
  location: string;
  status: VendorStatus;
  notes?: string;
}

export type POStage = "Quote" | "PO Issued" | "In Transit" | "Received" | "Closed";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  description: string;
  amount: number;
  stage: POStage;
  creationDate: string;
  expectedDelivery: string;
  trackingNumber?: string;
}

export type TaskStatus = "Not Started" | "In Progress" | "Blocked" | "Complete";

export interface BuildTask {
  id: string;
  name: string;
  ownerRole: string;
  vendorId?: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  dependsOn?: string[];
}

export type InspectionResult = "Pass" | "Fail" | "Pending";

export interface Inspection {
  id: string;
  name: string;
  inspector: string;
  result: InspectionResult;
  timestamp: string;
  notes?: string;
}

export interface DocFile {
  id: string;
  name: string;
  type: string; // mime or label
  category: "Certification" | "Shipping" | "Email" | "Drawing" | "Photo" | "Other";
  size: number;
  uploadedAt: string;
  dataUrl?: string; // base64 for real uploads (MVP, client-side only)
}

export interface DeploymentInfo {
  siteAddress: string;
  containerSerial: string;
  shipMethod: string;
  shipDate?: string;
  arrivalDate?: string;
  installLeadVendorId?: string;
  handoverDate?: string;
  customerSignoff: boolean;
}

export interface Stakeholder {
  role: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Milestone {
  label: string;
  planned: string;
  actual?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
}

export interface Project {
  id: string; // DCB-2026-00123
  name: string;
  customer: string;
  contractNo: string;
  requestedDelivery: string;
  stage: Stage;
  location: string;
  owner: string;
  description: string;
  securityRequirements: string;
  milestones: Milestone[];
  stakeholders: Stakeholder[];
  bom: BomItem[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  buildTasks: BuildTask[];
  inspections: Inspection[];
  documents: DocFile[];
  deployment: DeploymentInfo;
  audit: AuditEvent[];
  createdAt: string;
  updatedAt: string;
}
