import type { BomItem, Vendor, BuildTask } from "../types";

/**
 * Standard DCB configuration template.
 * When a coordinator opens a NEW box, these line items, vendors, and build
 * tasks are pre-loaded automatically so outreach + procurement can start
 * immediately. Edit these to refine the "standard box" over time.
 */

export const TEMPLATE_BOM: Omit<BomItem, "id">[] = [
  { itemNo: "01", partNo: "100-RACK-01", description: "42U Rack — steel, powder-coat", qty: 12, uom: "EA", vendorCode: "VEND-RC01", epsItemId: "EPS-12345", category: "Mechanical", status: "Planned", requiredDate: "" },
  { itemNo: "02", partNo: "200-PDU-03", description: "2U PDU, 208V, 30A", qty: 12, uom: "EA", vendorCode: "VEND-EL01", epsItemId: "EPS-12346", category: "Electrical", status: "Planned", requiredDate: "" },
  { itemNo: "03", partNo: "300-SERVER-X", description: "2U Compute node, Intel Xeon, 1TB SSD", qty: 48, uom: "EA", vendorCode: "VEND-SV01", epsItemId: "EPS-12347", category: "IT-Hardware", status: "Planned", requiredDate: "" },
  { itemNo: "04", partNo: "400-CONTAINER-STD", description: "20-ft ISO container, structural steel", qty: 1, uom: "EA", vendorCode: "VEND-CN01", epsItemId: "EPS-12348", category: "Structural", status: "Planned", requiredDate: "" },
  { itemNo: "05", partNo: "500-CRAC-02", description: "In-row cooling unit (CRAC), 20kW", qty: 2, uom: "EA", vendorCode: "VEND-CL01", epsItemId: "EPS-12349", category: "Cooling", status: "Planned", requiredDate: "" },
  { itemNo: "06", partNo: "600-SWITCH-48", description: "48-port 10GbE ToR switch", qty: 4, uom: "EA", vendorCode: "VEND-NW01", epsItemId: "EPS-12350", category: "Networking", status: "Planned", requiredDate: "" },
  { itemNo: "07", partNo: "700-UPS-10K", description: "10kVA rack UPS w/ battery pack", qty: 2, uom: "EA", vendorCode: "VEND-EL01", epsItemId: "EPS-12351", category: "Electrical", status: "Planned", requiredDate: "" },
  { itemNo: "08", partNo: "800-CABLE-KIT", description: "Structured cabling kit (power + data)", qty: 1, uom: "KIT", vendorCode: "VEND-NW01", epsItemId: "EPS-12352", category: "Networking", status: "Planned", requiredDate: "" },
  { itemNo: "09", partNo: "900-FIRE-SUP", description: "Clean-agent fire suppression system", qty: 1, uom: "EA", vendorCode: "VEND-MC01", epsItemId: "EPS-12353", category: "Mechanical", status: "Planned", requiredDate: "" },
  { itemNo: "10", partNo: "950-DCIM-SW", description: "DCIM monitoring software license", qty: 1, uom: "LIC", vendorCode: "VEND-SW01", epsItemId: "EPS-12354", category: "Software", status: "Planned", requiredDate: "" },
];

export const TEMPLATE_VENDORS: Omit<Vendor, "id">[] = [
  { name: "Apex Rack Systems", scope: "Component Manufacturer", contractNo: "C-RACK-2025-08", contactName: "Dana Whitfield", contactEmail: "dana@apexrack.example", location: "Shreveport, LA", status: "Contracted" },
  { name: "Gulf Coast Power Components", scope: "Component Manufacturer", contractNo: "C-ELEC-2025-04", contactName: "Marcus Hale", contactEmail: "mhale@gcpower.example", location: "Baton Rouge, LA", status: "Contracted" },
  { name: "ServerForge Compute", scope: "Component Manufacturer", contractNo: "C-COMP-2025-11", contactName: "Priya Raman", contactEmail: "praman@serverforge.example", location: "Austin, TX", status: "Contracted" },
  { name: "IronHull Containers", scope: "Container Supplier", contractNo: "C-CONT-2025-02", contactName: "Bill Ostrander", contactEmail: "bill@ironhull.example", location: "Houston, TX", status: "Contracted" },
  { name: "ThermalEdge Cooling", scope: "Cooling Systems", contractNo: "C-COOL-2025-06", contactName: "Sofia Nguyen", contactEmail: "sofia@thermaledge.example", location: "Shreveport, LA", status: "Contracted" },
  { name: "NetLink Integrators", scope: "Integration / Outfitting", contractNo: "C-INTG-2025-09", contactName: "Trevor Banks", contactEmail: "tbanks@netlink.example", location: "Shreveport, LA", status: "Contracted" },
  { name: "Bayou Logistics", scope: "Logistics / Shipping", contractNo: "C-LOGI-2025-03", contactName: "Renee Fontenot", contactEmail: "renee@bayoulog.example", location: "New Orleans, LA", status: "Contracted" },
  { name: "FieldOps Install Group", scope: "Install / Commissioning", contractNo: "C-INST-2025-07", contactName: "Carl Jennings", contactEmail: "carl@fieldops.example", location: "Mobile, AL", status: "Contracted" },
  { name: "CertCheck Inspections", scope: "Inspection / QA", contractNo: "C-QA-2025-05", contactName: "Yuki Tanaka", contactEmail: "yuki@certcheck.example", location: "Shreveport, LA", status: "Contracted" },
];

export const TEMPLATE_BUILD_TASKS: Omit<BuildTask, "id">[] = [
  { name: "Container intake & inspection", ownerRole: "Warehouse", status: "Not Started", startDate: "", endDate: "" },
  { name: "Mechanical fit-out (racks, fire suppression)", ownerRole: "Integration", status: "Not Started", startDate: "", endDate: "" },
  { name: "Electrical build (PDUs, UPS, wiring)", ownerRole: "Integration", status: "Not Started", startDate: "", endDate: "" },
  { name: "Cooling install & commissioning", ownerRole: "Cooling Vendor", status: "Not Started", startDate: "", endDate: "" },
  { name: "IT hardware rack & stack", ownerRole: "Integration", status: "Not Started", startDate: "", endDate: "" },
  { name: "Network cabling & switch config", ownerRole: "Integration", status: "Not Started", startDate: "", endDate: "" },
  { name: "Software load & DCIM setup", ownerRole: "IT", status: "Not Started", startDate: "", endDate: "" },
  { name: "System integration test", ownerRole: "QA", status: "Not Started", startDate: "", endDate: "" },
  { name: "Final acceptance & traceability package", ownerRole: "QA", status: "Not Started", startDate: "", endDate: "" },
];
