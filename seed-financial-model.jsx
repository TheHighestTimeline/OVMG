import { useState } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  ink:     "#0E1A0E",
  forest:  "#1B4332",
  green:   "#2D6A4F",
  sage:    "#52B788",
  mint:    "#B7E4C7",
  cream:   "#F4F1EB",
  gold:    "#C9931A",
  amber:   "#FFF3CD",
  slate:   "#1C3A5E",
  sky:     "#3A7BD5",
  mist:    "#E8F4FD",
  red:     "#8B2323",
  rose:    "#FFF0F0",
  mid:     "#6B6B6B",
  rule:    "#D9D4CA",
};

// ─── SHARED DATA ──────────────────────────────────────────────────────────────
const VILLAGES = {
  dignity: {
    id: "dignity",
    label: "Dignity Village",
    subtitle: "Homeless Re-Entry Campus",
    icon: "🏠",
    accent: C.green,
    bg: "#F0FAF4",
  },
  sanctuary: {
    id: "sanctuary",
    label: "Sanctuary Village",
    subtitle: "Therapeutic Micro-Town",
    icon: "🧠",
    accent: C.slate,
    bg: "#EEF4FC",
  },
  reentry: {
    id: "reentry",
    label: "Reentry City",
    subtitle: "Recidivism Reduction Campus",
    icon: "🔑",
    accent: C.gold,
    bg: "#FFF8E8",
  },
};

// ─── FINANCIAL DATA ───────────────────────────────────────────────────────────
const MODEL = {
  dignity: {
    sizes: [
      { label: "Pilot (100 beds)", residents: 100 },
      { label: "Mid-Scale (250 beds)", residents: 250 },
      { label: "City-Scale (500 beds)", residents: 500 },
    ],
    land: { acres: 8, costPerAcre: 12000, note: "Rural NC land ~$10–15K/acre" },
    construction: {
      homeCost: 35000,
      homeSize: "200–400 sq ft",
      sharedFacilities: 1200000,
      infrastructure: 800000,
      note: "Tiny home $25–50K in rural NC; shared bathhouses, laundry, dining hall",
      perUnit: 35000,
    },
    opex: {
      staffDayPerResident: 1/5,
      staffNightPer: 50,
      salaries: [
        { role: "Case Manager / Vocational Coach", count: 10, day: true, salary: 52000 },
        { role: "Residential Monitor (Night)", count: 2, day: false, salary: 45000 },
        { role: "Security Guard (Day)", count: 4, day: true, salary: 48000 },
        { role: "Security Guard (Night)", count: 4, day: false, salary: 50000 },
        { role: "Clinical Support / Nurse", count: 2, day: true, salary: 62000 },
        { role: "Maintenance & Facilities", count: 3, day: true, salary: 44000 },
        { role: "Administrative / Director", count: 2, day: true, salary: 68000 },
        { role: "Food Services", count: 3, day: true, salary: 38000 },
      ],
      perResidentMonth: 900,
      utilities: 120000,
      food: 540000,
      medical: 200000,
      programming: 150000,
      insuranceLegal: 80000,
      note: "Based on $30/day supportive housing benchmark; LA villages ran $31,959/bed/yr",
    },
    stateROI: 54000,
    roiNote: "NC incarcerates at $54,000/person/yr. Every housed recidivist prevented = $54K saved.",
  },

  sanctuary: {
    sizes: [
      { label: "Pilot (50 beds)", residents: 50 },
      { label: "Mid-Scale (150 beds)", residents: 150 },
      { label: "City-Scale (300 beds)", residents: 300 },
    ],
    land: { acres: 5, costPerAcre: 12000, note: "Includes secured perimeter buffer" },
    construction: {
      homeCost: 85000,
      homeSize: "300–500 sq ft ADA therapeutic",
      sharedFacilities: 3500000,
      infrastructure: 1200000,
      note: "Higher spec: ADA, sensory design, acoustic treatment, clinical exam rooms, airlock mantrap; ~$300K/bed benchmark from OR residential MH data",
      perUnit: 85000,
    },
    opex: {
      salaries: [
        { role: "LCSW / Licensed Therapist (Day)", count: 8, day: true, salary: 68000 },
        { role: "Psychiatric Technician (Day)", count: 9, day: true, salary: 55000 },
        { role: "Psychiatric Technician (Night)", count: 5, day: false, salary: 58000 },
        { role: "Psychiatrist (Part-Time)", count: 1, day: true, salary: 120000 },
        { role: "Nurse Practitioner", count: 2, day: true, salary: 92000 },
        { role: "Security Guard (Day)", count: 4, day: true, salary: 48000 },
        { role: "Security Guard (Night)", count: 4, day: false, salary: 50000 },
        { role: "Occupational Therapist", count: 2, day: true, salary: 72000 },
        { role: "Recreation / Activities Staff", count: 3, day: true, salary: 40000 },
        { role: "Food Services", count: 4, day: true, salary: 38000 },
        { role: "Facilities / Maintenance", count: 2, day: true, salary: 44000 },
        { role: "Administrative / Director", count: 2, day: true, salary: 75000 },
      ],
      utilities: 160000,
      food: 270000,
      medical: 480000,
      programming: 200000,
      insuranceLegal: 120000,
      note: "1:3 staff-resident ratio per clinical standard; ~$100–200K/bed/yr for SMI residential (OR benchmark)",
    },
    stateROI: 80000,
    roiNote: "Avg SMI hospitalization = $1,200/day. Stable housing averts 2–4 hospitalizations/yr per resident = $60–100K saved each.",
  },

  reentry: {
    sizes: [
      { label: "Pilot (200 beds)", residents: 200 },
      { label: "Mid-Scale (500 beds)", residents: 500 },
      { label: "City-Scale (1,000 beds)", residents: 1000 },
    ],
    land: { acres: 20, costPerAcre: 12000, note: "Includes vocational yards, green space, athletic facilities" },
    construction: {
      homeCost: 45000,
      homeSize: "300–500 sq ft private room or dorm pod",
      sharedFacilities: 4500000,
      infrastructure: 2000000,
      note: "Dorm pods or modular units; large vocational academy, medical clinic, dining hall, gym, outdoor courts",
      perUnit: 45000,
    },
    opex: {
      salaries: [
        { role: "Case Manager / Reentry Coach", count: 20, day: true, salary: 50000 },
        { role: "Vocational Instructor", count: 8, day: true, salary: 56000 },
        { role: "Substance Use Counselor", count: 6, day: true, salary: 58000 },
        { role: "Mental Health Counselor", count: 4, day: true, salary: 62000 },
        { role: "Residential Monitor (Night)", count: 6, day: false, salary: 45000 },
        { role: "Security Guard (Day)", count: 8, day: true, salary: 48000 },
        { role: "Security Guard (Night)", count: 8, day: false, salary: 50000 },
        { role: "Medical / Nurse", count: 3, day: true, salary: 65000 },
        { role: "Employment Specialist", count: 4, day: true, salary: 52000 },
        { role: "Food Services", count: 6, day: true, salary: 38000 },
        { role: "Facilities / Maintenance", count: 4, day: true, salary: 44000 },
        { role: "Administrative / Director", count: 3, day: true, salary: 78000 },
        { role: "Program Director", count: 1, day: true, salary: 95000 },
      ],
      utilities: 280000,
      food: 1080000,
      medical: 300000,
      programming: 400000,
      insuranceLegal: 150000,
      note: "Halfway-house model: $30/day supportive housing; vocational and substance use programs add ~$8–12/day/person",
    },
    stateROI: 54000,
    roiNote: "NC saves $54K/yr per person kept out of prison. 200-bed campus preventing 40% recidivism = 80 people × $54K = $4.3M/yr state savings.",
  },
};

// ─── CALC ENGINE ─────────────────────────────────────────────────────────────
function calcModel(villageId, sizeIndex) {
  const v = MODEL[villageId];
  const size = v.sizes[sizeIndex];
  const n = size.residents;

  // CAPEX
  const landCost = v.land.acres * (n / v.sizes[0].residents) * v.land.costPerAcre;
  const unitCost = n * v.construction.perUnit;
  const sharedFac = v.construction.sharedFacilities * Math.pow(n / v.sizes[0].residents, 0.65);
  const infra = v.construction.infrastructure * Math.pow(n / v.sizes[0].residents, 0.7);
  const softCosts = (unitCost + sharedFac + infra) * 0.12;
  const contingency = (unitCost + sharedFac + infra) * 0.08;
  const totalCapex = landCost + unitCost + sharedFac + infra + softCosts + contingency;

  // OPEX — Staffing (scale staff roughly with residents)
  const scaleFactor = n / v.sizes[0].residents;
  const staffScaled = v.opex.salaries.map(s => ({
    ...s,
    scaledCount: Math.max(s.count, Math.round(s.count * Math.pow(scaleFactor, 0.75))),
  }));
  const totalSalaries = staffScaled.reduce((sum, s) => sum + s.scaledCount * s.salary * 1.28, 0); // 28% benefits

  const utilScaled = v.opex.utilities * Math.pow(scaleFactor, 0.8);
  const foodScaled = v.opex.food * scaleFactor;
  const medScaled = v.opex.medical * Math.pow(scaleFactor, 0.9);
  const progScaled = v.opex.programming * Math.pow(scaleFactor, 0.8);
  const insScaled = v.opex.insuranceLegal * Math.pow(scaleFactor, 0.7);
  const totalOpex = totalSalaries + utilScaled + foodScaled + medScaled + progScaled + insScaled;

  // ROI
  const preventedResidents = Math.round(n * 0.4);
  const stateSavings = preventedResidents * v.stateROI;
  const netPublicBenefit = stateSavings - totalOpex;

  return {
    n, size, landCost, unitCost, sharedFac, infra, softCosts, contingency, totalCapex,
    staffScaled, totalSalaries, utilScaled, foodScaled, medScaled, progScaled, insScaled, totalOpex,
    preventedResidents, stateSavings, netPublicBenefit,
  };
}

// ─── FORMAT ───────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 0) => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(decimals === 0 ? 1 : decimals)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Row({ label, value, sub, bold, highlight, indent }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "7px 0", borderBottom: `1px solid ${C.rule}`,
      background: highlight ? C.amber : "transparent",
      paddingLeft: indent ? 16 : 0,
    }}>
      <span style={{ fontSize: 13, color: bold ? C.ink : C.mid, fontWeight: bold ? 700 : 400, fontFamily: "sans-serif" }}>
        {indent && <span style={{ color: C.rule, marginRight: 6 }}>└</span>}
        {label}
      </span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: highlight ? C.gold : (bold ? C.forest : C.ink), fontFamily: "monospace" }}>{value}</span>
        {sub && <div style={{ fontSize: 11, color: C.mid }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionHead({ label, color }) {
  return (
    <div style={{ background: color, color: "#fff", padding: "6px 12px", borderRadius: 4, margin: "16px 0 4px", fontSize: 11, fontWeight: 800, letterSpacing: 1.5, fontFamily: "sans-serif", textTransform: "uppercase" }}>
      {label}
    </div>
  );
}

function VillagePanel({ villageId }) {
  const v = VILLAGES[villageId];
  const m = MODEL[villageId];
  const [sizeIdx, setSizeIdx] = useState(0);
  const d = calcModel(villageId, sizeIdx);

  const dayStaff = d.staffScaled.filter(s => s.day);
  const nightStaff = d.staffScaled.filter(s => !s.day);
  const totalFTE = d.staffScaled.reduce((s, r) => s + r.scaledCount, 0);

  return (
    <div style={{ background: v.bg, border: `2px solid ${v.accent}30`, borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
      {/* Header */}
      <div style={{ background: v.accent, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 26, marginBottom: 2 }}>{v.icon}</div>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 900, fontFamily: "Georgia, serif" }}>{v.label}</h2>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "sans-serif" }}>{v.subtitle}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "sans-serif", letterSpacing: 1 }}>SCALE SELECTOR</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {m.sizes.map((s, i) => (
              <button key={i} onClick={() => setSizeIdx(i)} style={{
                padding: "6px 12px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.5)",
                background: sizeIdx === i ? "#fff" : "transparent",
                color: sizeIdx === i ? v.accent : "#fff",
                fontFamily: "sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.2s",
              }}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px" }}>
        {/* Source note */}
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.mid, borderLeft: `3px solid ${v.accent}` }}>
          <strong style={{ color: v.accent }}>Data sources:</strong> {m.construction.note}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* LEFT: CAPEX */}
          <div>
            <SectionHead label="Capital Expenditure (One-Time Build)" color={v.accent} />
            <Row label="Land Acquisition" value={fmt(d.landCost)} sub={`${(m.land.acres * d.n / m.sizes[0].residents).toFixed(0)} acres × $${m.land.costPerAcre.toLocaleString()}/ac`} />
            <Row label={`Residential Units (${d.n} × ${fmt(m.construction.perUnit)})`} value={fmt(d.unitCost)} sub={m.construction.homeSize} />
            <Row label="Shared Facilities" value={fmt(d.sharedFac)} sub="Dining, clinical, recreation, laundry" />
            <Row label="Site Infrastructure" value={fmt(d.infra)} sub="Roads, utilities, fencing, security systems" />
            <Row label="Soft Costs (arch, permits, legal)" value={fmt(d.softCosts)} sub="12% of hard costs" />
            <Row label="Contingency Reserve" value={fmt(d.contingency)} sub="8% of hard costs" />
            <Row label="TOTAL CAPITAL COST" value={fmt(d.totalCapex)} bold highlight />
            <div style={{ fontSize: 11, color: C.mid, marginTop: 6, fontFamily: "sans-serif" }}>
              Per-bed capital cost: <strong>{fmt(d.totalCapex / d.n)}</strong>
            </div>
          </div>

          {/* RIGHT: OPEX */}
          <div>
            <SectionHead label="Annual Operating Expenses" color={v.accent} />
            <Row label="Total Salaries + Benefits (28%)" value={fmt(d.totalSalaries)} sub={`${totalFTE} FTEs total`} />
            <Row label="Food & Meals" value={fmt(d.foodScaled)} sub={`$${Math.round(d.foodScaled / d.n / 365)}/day/resident`} />
            <Row label="Medical & Clinical Supplies" value={fmt(d.medScaled)} />
            <Row label="Utilities (power, water, internet)" value={fmt(d.utilScaled)} />
            <Row label="Programs & Vocational Materials" value={fmt(d.progScaled)} />
            <Row label="Insurance, Legal & Compliance" value={fmt(d.insScaled)} />
            <Row label="TOTAL ANNUAL OPEX" value={fmt(d.totalOpex)} bold highlight />
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: v.accent, fontFamily: "monospace" }}>{fmt(d.totalOpex / 12)}</div>
                <div style={{ fontSize: 10, color: C.mid, fontFamily: "sans-serif" }}>per month</div>
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: v.accent, fontFamily: "monospace" }}>{fmt(d.totalOpex / d.n)}</div>
                <div style={{ fontSize: 10, color: C.mid, fontFamily: "sans-serif" }}>per resident / yr</div>
              </div>
            </div>
          </div>
        </div>

        {/* STAFFING BREAKDOWN */}
        <SectionHead label={`Staffing Breakdown — ${totalFTE} Total FTEs`} color={C.mid} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: v.accent, marginBottom: 6, fontFamily: "sans-serif", letterSpacing: 1 }}>☀️ DAY SHIFT (8AM–8PM)</div>
            {dayStaff.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.rule}`, fontSize: 12 }}>
                <span style={{ color: C.ink, fontFamily: "sans-serif" }}>{s.role}</span>
                <span style={{ fontWeight: 700, color: v.accent, fontFamily: "monospace" }}>×{s.scaledCount}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, marginBottom: 6, fontFamily: "sans-serif", letterSpacing: 1 }}>🌙 NIGHT SHIFT (8PM–8AM)</div>
            {nightStaff.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.rule}`, fontSize: 12 }}>
                <span style={{ color: C.ink, fontFamily: "sans-serif" }}>{s.role}</span>
                <span style={{ fontWeight: 700, color: C.slate, fontFamily: "monospace" }}>×{s.scaledCount}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, background: "#fff", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.mid, fontFamily: "sans-serif" }}>Overnight payroll alone</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.slate, fontFamily: "monospace" }}>
                {fmt(nightStaff.reduce((s, r) => s + r.scaledCount * r.salary * 1.28, 0))}/yr
              </div>
            </div>
          </div>
        </div>

        {/* ROI */}
        <SectionHead label="Public ROI — State Savings Argument" color={C.forest} />
        <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 12 }}>
            {[
              { label: "Residents Served", val: d.n.toLocaleString() },
              { label: "Estimated Outcomes Prevented (40%)", val: d.preventedResidents.toLocaleString() },
              { label: "Annual State $ Saved", val: fmt(d.stateSavings) },
            ].map(b => (
              <div key={b.label} style={{ background: C.cream, borderRadius: 6, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.forest, fontFamily: "monospace" }}>{b.val}</div>
                <div style={{ fontSize: 11, color: C.mid, marginTop: 4, fontFamily: "sans-serif" }}>{b.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: d.netPublicBenefit > 0 ? "#F0FAF4" : "#FFF0F0", borderRadius: 6, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontFamily: "sans-serif", color: C.ink }}>Net Public Benefit (Savings minus OpEx)</span>
            <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: d.netPublicBenefit > 0 ? C.forest : C.red }}>
              {d.netPublicBenefit > 0 ? "+" : ""}{fmt(d.netPublicBenefit)}/yr
            </span>
          </div>
          <div style={{ fontSize: 11, color: C.mid, marginTop: 8, fontFamily: "sans-serif", lineHeight: 1.6 }}>
            {m.roiNote}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMBINED SUMMARY ─────────────────────────────────────────────────────────
function CombinedSummary() {
  const combos = [
    { label: "Site 1 Only (SEED Campus)", dignity: 0, sanctuary: 0, reentry: null },
    { label: "Full SEED + Pilot Reentry City", dignity: 0, sanctuary: 0, reentry: 0 },
    { label: "Mid-Scale All Three", dignity: 1, sanctuary: 1, reentry: 1 },
    { label: "City-Scale Vision", dignity: 2, sanctuary: 2, reentry: 2 },
  ];
  const [idx, setIdx] = useState(1);
  const combo = combos[idx];

  const d = calcModel("dignity", combo.dignity);
  const s = calcModel("sanctuary", combo.sanctuary);
  const r = combo.reentry !== null ? calcModel("reentry", combo.reentry) : null;

  const totalCapex = d.totalCapex + s.totalCapex + (r ? r.totalCapex : 0);
  const totalOpex = d.totalOpex + s.totalOpex + (r ? r.totalOpex : 0);
  const totalRes = d.n + s.n + (r ? r.n : 0);
  const totalSavings = d.stateSavings + s.stateSavings + (r ? r.stateSavings : 0);

  return (
    <div style={{ background: C.ink, borderRadius: 14, padding: "22px 24px", marginBottom: 24, color: "#fff" }}>
      <h3 style={{ margin: "0 0 16px", fontFamily: "Georgia, serif", fontSize: 20 }}>📊 Combined Scenario Planner</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {combos.map((c, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            padding: "8px 14px", borderRadius: 20, border: "2px solid rgba(255,255,255,0.3)",
            background: idx === i ? C.sage : "transparent", color: "#fff",
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>{c.label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {[
          { label: "Total Capital (Build Everything)", val: fmt(totalCapex), sub: "One-time construction" },
          { label: "Total Annual Operating Cost", val: fmt(totalOpex), sub: `${fmt(totalOpex / 12)} / month` },
          { label: "Total Residents Served", val: totalRes.toLocaleString(), sub: "Across all campuses" },
          { label: "Annual State Savings Generated", val: fmt(totalSavings), sub: "Prison + hospital costs averted" },
          { label: "Net Public Benefit / Year", val: fmt(totalSavings - totalOpex), sub: totalSavings > totalOpex ? "✅ Net positive to taxpayers" : "⚠️ Needs subsidy / revenue" },
          { label: "Per-Resident Annual Cost", val: fmt(totalOpex / totalRes), sub: `vs $54K/yr to incarcerate` },
        ].map(b => (
          <div key={b.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginBottom: 4 }}>{b.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.mint, fontFamily: "monospace" }}>{b.val}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2, fontFamily: "sans-serif" }}>{b.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontFamily: "sans-serif" }}>
          <strong style={{ color: C.mint }}>Scenario includes:</strong> Dignity Village ({MODEL.dignity.sizes[combo.dignity].label}), Sanctuary Village ({MODEL.sanctuary.sizes[combo.sanctuary].label}){r ? `, Reentry City (${MODEL.reentry.sizes[combo.reentry].label})` : " (Reentry City not yet included in this scenario)"}.
        </div>
      </div>
    </div>
  );
}

// ─── FUNDING SOURCES ─────────────────────────────────────────────────────────
function FundingTable() {
  const sources = [
    { source: "SEED Initiative 5% Revenue Endowment", type: "Private", amount: "$3.8M–$15M/yr", notes: "Scales with data center revenue; primary OpEx coverage" },
    { source: "HUD CDBG (Community Development Block Grants)", type: "Federal", amount: "Up to $5M/project", notes: "Construction, infrastructure, community programs" },
    { source: "HUD CoC Program (Continuum of Care)", type: "Federal", amount: "$500K–$3M/yr", notes: "Supportive housing operations for homeless individuals" },
    { source: "SAMHSA MH Block Grant (NC)", type: "Federal/State", amount: "$1–2M/yr", notes: "Mental health services and staffing" },
    { source: "NC Reentry 2030 Strategic Plan Funds", type: "State", amount: "TBD", notes: "NC officially enrolled in Reentry 2030; state seeking federal match" },
    { source: "DOJ Second Chance Act Grants", type: "Federal", amount: "$500K–$2.5M", notes: "Reentry programming, vocational training" },
    { source: "IRS Low-Income Housing Tax Credits (LIHTC)", type: "Tax Credit", amount: "30–70% of construction", notes: "Equity financing for affordable residential units" },
    { source: "HHS 1115 Medicaid Reentry Waiver", type: "Federal", amount: "Per-resident billing", notes: "New 2023 rule: Medicaid can cover pre-release health services" },
    { source: "ESG (Emergency Solutions Grants)", type: "Federal", amount: "$250K–$1M/yr", notes: "Rapid rehousing and homeless prevention operations" },
    { source: "Corporate Vendor-Inject Clause (SEED)", type: "Private", amount: "10% of vendor labor", notes: "10% of every contracted vendor's labor budget reserved for graduates" },
    { source: "Social Impact Bonds (SIBs)", type: "Private/Gov", amount: "Variable", notes: "Government pays investors back from proven recidivism savings" },
    { source: "Impact Investment ESG Bonds", type: "Private", amount: "2% of capex", notes: "Road and substation infrastructure" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.rule}`, marginBottom: 24 }}>
      <div style={{ background: C.forest, padding: "14px 18px" }}>
        <h3 style={{ margin: 0, color: "#fff", fontFamily: "Georgia, serif", fontSize: 16 }}>💡 Available Funding Sources</h3>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "sans-serif", marginTop: 4 }}>Every major program that applies to this model, with realistic amounts</div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: C.cream }}>
            {["Funding Source", "Type", "Amount", "Notes"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontFamily: "sans-serif", fontWeight: 800, color: C.forest, letterSpacing: 0.5, borderBottom: `1px solid ${C.rule}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map((s, i) => {
            const typeColors = { Private: C.gold, Federal: C.sky, State: C.green, "Federal/State": C.sage, "Tax Credit": "#7B4F2E", "Private/Gov": C.mid };
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff", borderBottom: `1px solid ${C.rule}` }}>
                <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: "sans-serif" }}>{s.source}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ background: `${typeColors[s.type] || C.mid}20`, color: typeColors[s.type] || C.mid, padding: "3px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700, fontFamily: "sans-serif" }}>{s.type}</span>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: C.forest, fontFamily: "monospace" }}>{s.amount}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: C.mid, fontFamily: "sans-serif" }}>{s.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function FinancialModel() {
  const [tab, setTab] = useState("model");

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.ink} 0%, ${C.forest} 60%, ${C.green} 100%)`, padding: "32px 28px 24px" }}>
        <div style={{ fontSize: 12, color: C.mint, letterSpacing: 3, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>SEED INITIATIVE — FINANCIAL FEASIBILITY MODEL</div>
        <h1 style={{ margin: "0 0 10px", fontSize: 32, color: "#fff", fontWeight: 900, lineHeight: 1.1 }}>From Ground-Up Cost<br />to Public ROI</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, fontStyle: "italic", maxWidth: 560, lineHeight: 1.7 }}>
          Full end-to-end financials: land, construction, staffing (day + night), monthly/annual operations, and state savings — for all three village types, at three scales each.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[
            { id: "model", label: "📐 Full Model" },
            { id: "funding", label: "💡 Funding Sources" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 16px", borderRadius: 20,
              background: tab === t.id ? C.sage : "rgba(255,255,255,0.1)",
              border: "none", color: "#fff", fontFamily: "sans-serif", fontWeight: 700,
              fontSize: 13, cursor: "pointer",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 1000, margin: "0 auto" }}>
        {tab === "model" && (
          <>
            <CombinedSummary />
            <VillagePanel villageId="dignity" />
            <VillagePanel villageId="sanctuary" />
            <VillagePanel villageId="reentry" />
          </>
        )}
        {tab === "funding" && <FundingTable />}
      </div>

      <div style={{ background: C.ink, color: "rgba(255,255,255,0.4)", padding: "14px 24px", textAlign: "center", fontSize: 11, fontFamily: "sans-serif" }}>
        All figures based on published benchmarks: HUD PIT data, A-Mark Foundation tiny home village cost reports, Oregon MH residential bed costs ($300K/bed), NC DOC incarceration rate ($54,000/person/yr), LA County tiny home village OpEx studies, and CSG Justice Center recidivism research. Adjust per local contractor bids.
      </div>
    </div>
  );
}
