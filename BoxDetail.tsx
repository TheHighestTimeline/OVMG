import type { Project, Vendor } from "../types";
import { TEMPLATE_BOM, TEMPLATE_VENDORS, TEMPLATE_BUILD_TASKS } from "./templates";

// Stable IDs so cross-references (BOM ↔ vendor ↔ PO) line up in the demo data.
function vendorsWithIds(): Vendor[] {
  return TEMPLATE_VENDORS.map((v, i) => ({ ...v, id: `vend-${i + 1}` }));
}

function buildProject(over: Partial<Project> & Pick<Project, "id" | "name" | "customer" | "stage">): Project {
  const vendors = over.vendors ?? vendorsWithIds();
  const bom =
    over.bom ??
    TEMPLATE_BOM.map((b, i) => ({ ...b, id: `bom-${over.id}-${i + 1}` }));
  const buildTasks =
    over.buildTasks ??
    TEMPLATE_BUILD_TASKS.map((t, i) => ({ ...t, id: `task-${over.id}-${i + 1}` }));

  return {
    contractNo: "N00024-26-C-0000",
    requestedDelivery: "2026-09-30",
    location: "Warehouse A — Shreveport, LA",
    owner: "Tanner South",
    description: "Standard 20-ft DCB build for forward deployment.",
    securityRequirements: "ITAR controlled. MIL-STD-810 ruggedization. Full nut-and-bolt traceability required.",
    milestones: [],
    stakeholders: [
      { role: "Program Coordinator", name: "Tanner South", email: "tanner.south@example.com", phone: "318-555-0101" },
      { role: "Product Integration Lead", name: "Alyssa Cho", email: "alyssa.cho@example.com" },
      { role: "Quality Manager", name: "Devin Pratt", email: "devin.pratt@example.com" },
    ],
    purchaseOrders: [],
    inspections: [],
    documents: [],
    deployment: {
      siteAddress: "",
      containerSerial: "",
      shipMethod: "Flatbed truck",
      customerSignoff: false,
    },
    audit: [
      { id: "a1", timestamp: "2026-05-01T14:02:00Z", user: "Tanner South", action: "Project created", entity: over.id },
    ],
    createdAt: "2026-05-01T14:02:00Z",
    updatedAt: "2026-05-20T09:30:00Z",
    vendors,
    bom,
    buildTasks,
    ...over,
  };
}

const v = vendorsWithIds();

export const SEED_PROJECTS: Project[] = [
  // ── Box 1: Procurement stage ──────────────────────────────────────────────
  buildProject({
    id: "DCB-2026-00123",
    name: "Fort Polk Edge Node A",
    customer: "US Army — JRTC",
    stage: "Procurement",
    requestedDelivery: "2026-08-15",
    milestones: [
      { label: "Requirement Capture", planned: "2026-05-05", actual: "2026-05-04" },
      { label: "PO Issued", planned: "2026-05-20", actual: "2026-05-22" },
      { label: "Components Received", planned: "2026-06-25" },
      { label: "Build Complete", planned: "2026-07-25" },
      { label: "Delivered", planned: "2026-08-15" },
    ],
    purchaseOrders: [
      { id: "po1", poNumber: "PO-44501", vendorId: "vend-1", description: "12x 42U racks", amount: 38400, stage: "In Transit", creationDate: "2026-05-22", expectedDelivery: "2026-06-20", trackingNumber: "1Z999AA10123456784" },
      { id: "po2", poNumber: "PO-44502", vendorId: "vend-3", description: "48x compute nodes", amount: 412000, stage: "PO Issued", creationDate: "2026-05-22", expectedDelivery: "2026-06-28" },
      { id: "po3", poNumber: "PO-44503", vendorId: "vend-4", description: "20-ft ISO container", amount: 9800, stage: "Quote", creationDate: "2026-05-23", expectedDelivery: "2026-06-15" },
      { id: "po4", poNumber: "PO-44504", vendorId: "vend-5", description: "2x CRAC units", amount: 54000, stage: "Received", creationDate: "2026-05-10", expectedDelivery: "2026-05-28" },
    ],
    audit: [
      { id: "a1", timestamp: "2026-05-01T14:02:00Z", user: "Tanner South", action: "Project created", entity: "DCB-2026-00123" },
      { id: "a2", timestamp: "2026-05-22T10:15:00Z", user: "Alyssa Cho", action: "PO-44501 issued to Apex Rack Systems", entity: "po1" },
      { id: "a3", timestamp: "2026-05-28T16:40:00Z", user: "Warehouse", action: "CRAC units received & tagged (SN CRAC-7781/7782)", entity: "po4" },
    ],
  }),

  // ── Box 2: Build stage ────────────────────────────────────────────────────
  (() => {
    const p = buildProject({
      id: "DCB-2026-00118",
      name: "Camp Lejeune Comms Box",
      customer: "USMC — II MEF",
      stage: "Build",
      requestedDelivery: "2026-07-10",
      location: "Integration Bay 3 — Shreveport, LA",
    });
    // mark most BOM received/installed
    p.bom = p.bom.map((b, i) => ({
      ...b,
      status: i < 7 ? "Received" : "In Transit",
      receivedDate: i < 7 ? "2026-05-18" : undefined,
      serialTag: i < 7 ? `SN-${118000 + i}` : undefined,
    }));
    p.buildTasks = p.buildTasks.map((t, i) => ({
      ...t,
      status: i < 3 ? "Complete" : i === 3 ? "In Progress" : "Not Started",
      startDate: i <= 3 ? "2026-05-25" : "",
      endDate: i < 3 ? "2026-05-28" : "",
    }));
    p.inspections = [
      { id: "i1", name: "Incoming rack inspection", inspector: "Yuki Tanaka", result: "Pass", timestamp: "2026-05-19T11:00:00Z" },
      { id: "i2", name: "Electrical bonding & grounding", inspector: "Yuki Tanaka", result: "Pending", timestamp: "2026-05-27T09:00:00Z" },
    ];
    p.purchaseOrders = [
      { id: "po1", poNumber: "PO-44210", vendorId: "vend-1", description: "12x 42U racks", amount: 38400, stage: "Closed", creationDate: "2026-04-10", expectedDelivery: "2026-05-05" },
      { id: "po2", poNumber: "PO-44211", vendorId: "vend-3", description: "48x compute nodes", amount: 412000, stage: "Received", creationDate: "2026-04-10", expectedDelivery: "2026-05-12" },
    ];
    p.deployment.containerSerial = "IRNH-2026-0042";
    return p;
  })(),

  // ── Box 3: Planning stage (fresh) ─────────────────────────────────────────
  buildProject({
    id: "DCB-2026-00131",
    name: "Eglin AFB Test Article",
    customer: "US Air Force — AFRL",
    stage: "Planning",
    requestedDelivery: "2026-11-01",
    location: "Not yet assigned",
  }),

  // ── Box 4: Delivered ──────────────────────────────────────────────────────
  (() => {
    const p = buildProject({
      id: "DCB-2026-00099",
      name: "Pendleton Pilot Unit",
      customer: "USMC — I MEF",
      stage: "Delivered",
      requestedDelivery: "2026-05-15",
      location: "Camp Pendleton, CA — Installed",
    });
    p.bom = p.bom.map((b, i) => ({ ...b, status: "Installed", receivedDate: "2026-03-20", serialTag: `SN-${99000 + i}` }));
    p.buildTasks = p.buildTasks.map((t) => ({ ...t, status: "Complete", startDate: "2026-03-25", endDate: "2026-04-20" }));
    p.inspections = [
      { id: "i1", name: "Final acceptance test", inspector: "Yuki Tanaka", result: "Pass", timestamp: "2026-04-28T15:00:00Z" },
      { id: "i2", name: "Traceability package review", inspector: "Devin Pratt", result: "Pass", timestamp: "2026-04-30T10:00:00Z" },
    ];
    p.deployment = {
      siteAddress: "Bldg 22120, Camp Pendleton, CA 92055",
      containerSerial: "IRNH-2026-0011",
      shipMethod: "Flatbed truck",
      shipDate: "2026-05-02",
      arrivalDate: "2026-05-08",
      installLeadVendorId: "vend-8",
      handoverDate: "2026-05-14",
      customerSignoff: true,
    };
    return p;
  })(),
];

export const DEMO_VENDOR_DIRECTORY = v;
