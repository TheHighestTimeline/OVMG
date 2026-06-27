import { useState } from "react";

const C = {
  ink: "#0C1A0C",
  forest: "#1B4332",
  green: "#2D6A4F",
  sage: "#52B788",
  mint: "#B7E4C7",
  cream: "#F5F1EA",
  gold: "#C9931A",
  amber: "#FFF8E0",
  slate: "#1C3A5E",
  sky: "#3A7BD5",
  mist: "#EEF4FC",
  rust: "#8B3A1A",
  rose: "#FFF0EB",
  mid: "#666",
  rule: "#DDD8CF",
  white: "#FFFFFF",
};

const programs = [
  {
    id: "infrasound",
    icon: "🔊",
    title: "World's First Infrasound-Monitored Data Center",
    tagline: "Making the invisible audible — and legally defensible",
    accent: C.slate,
    lightBg: C.mist,
    heroStat: "0",
    heroLabel: "data centers globally with public infrasound monitoring",
    sections: [
      {
        heading: "What Is Infrasound & Why It Matters",
        body: "Infrasound is sound below 20 Hz — below the threshold of human hearing, but not below the threshold of human biology. Combined-cycle gas turbines, large HVAC systems, and rows of server fans all generate infrasonic vibrations that radiate outward through the ground and air for miles. At sufficient intensity, infrasound causes headaches, anxiety, sleep disruption, dizziness, and a vague feeling of unease that residents can't attribute to anything visible. This is precisely the kind of invisible impact that has fueled lawsuits against industrial neighbors for decades. No data center operator has ever proactively monitored and publicly published infrasound data. SEED does it first."
      },
      {
        heading: "The Monitoring System",
        items: [
          { label: "Sensor Type", val: "Professional microbarometers (CEA MB3d class or equivalent), 0.01–28 Hz range" },
          { label: "Array Configuration", val: "12 sensors: 4 on-site perimeter + 8 off-site community locations within 2-mile radius" },
          { label: "Placement", val: "3 residential homes, 2 schools, 1 park, 1 church, 1 community center — all with signed data agreements" },
          { label: "Data Output", val: "Real-time streaming to public dashboard (1 Hz update rate); 10-year data archive" },
          { label: "Alert Threshold", val: "Auto-alert at 85 dB (infrasound scale) sustained >10 min — triggers ops review" },
          { label: "Pre-Construction Baseline", val: "6-month baseline study begins during site prep — establishes legal 'before' record" },
        ]
      },
      {
        heading: "Cost Breakdown",
        table: [
          { item: "12× Professional infrasound sensors (MB3d class)", cost: "$72,000" },
          { item: "Wind-noise reduction arrays (WNRS) per sensor", cost: "$24,000" },
          { item: "Data acquisition hardware + servers", cost: "$18,000" },
          { item: "Enclosures, installation, weatherproofing", cost: "$15,000" },
          { item: "Software platform + public dashboard", cost: "$22,000" },
          { item: "Pre-construction baseline study (6 mo, 3rd party acoustician)", cost: "$45,000" },
          { item: "Annual monitoring contract + calibration", cost: "$28,000/yr" },
          { total: true, item: "Total Install", cost: "$196,000" },
          { total: true, item: "Annual Ongoing", cost: "$28,000/yr" },
        ]
      },
      {
        heading: "The Strategic Value",
        items: [
          { label: "Legal shield", val: "Pre-construction baseline means no neighbor can claim harm without measured comparison" },
          { label: "Community trust", val: "Public real-time data is the single most effective community relations tool available" },
          { label: "Operational feedback", val: "Early detection of resonance build-up lets maintenance act before it becomes a complaint" },
          { label: "Industry first", val: "Press story writes itself: 'First data center in history to publish live infrasound data'" },
          { label: "ESG differentiation", val: "Directly addressable in SEC ESG disclosures, investor pitches, and regulatory filings" },
        ]
      },
      {
        heading: "Sound Barrier Stack (Layered Approach)",
        items: [
          { label: "Layer 1 — Acoustic Louvers", val: "All turbine and container HVAC inlets/outlets fitted with industrial acoustic louvers. Attenuation: 15–25 dB across 63–4000 Hz." },
          { label: "Layer 2 — Sound Blanket Enclosures", val: "Mass-loaded vinyl (MLV) blanket wraps on generator enclosures. STC 32–35. Cost: ~$8–12/sq ft installed." },
          { label: "Layer 3 — MLV Perimeter Fencing", val: "15–20 ft perimeter fence, MLV-lined. Insertion loss 20–30 dB. Estimated perimeter: 4,000 LF. Cost: ~$400K." },
          { label: "Layer 4 — Earth Berm with Evergreens", val: "Sloped berm 15 ft high, 30 ft base, native evergreens. Low-frequency damping 5–15 dB. Doubles as visual buffer." },
          { label: "Layer 5 — Rubberized Asphalt Roads", val: "All interior roads use rubberized asphalt concrete (RAC). Reduces tire/vehicle rolling noise 6–10 dB." },
          { label: "Layer 6 — Community Window Rebates", val: "$2,000 rebate per home within 0.5 mi for triple-pane window upgrades. Budget: $200K covers ~100 homes." },
        ]
      }
    ]
  },
  {
    id: "greenhouse",
    icon: "🥬",
    title: "Waste-Heat Greenhouse Network",
    tagline: "Turning server exhaust into community food — the Sweden model, done bigger",
    accent: C.green,
    lightBg: "#F0FAF4",
    heroStat: "9 GW",
    heroLabel: "of turbine heat available to grow food year-round at zero fuel cost",
    sections: [
      {
        heading: "The Sweden Precedent",
        body: "EcoDataCenter in Falun, Sweden partnered with agritech firm Wa3rm to co-locate fish farms and vegetable greenhouses directly with their data centers — powered entirely by waste heat. Hive Datacenter in Boden piped warm return air (30–40°C) into a 10,000 m² greenhouse operated by startup Agtira. RISE Research Institutes of Sweden found that a 1 MW data center could recover up to one-third of electricity costs by attaching a 2,000 m² greenhouse. A 10,000 m² greenhouse could meet two-thirds of its heating needs from data center exhaust alone. SEED is a 9 GW campus — the heat available dwarfs anything Sweden has attempted. We don't run experimental greenhouses. We run a regional food system."
      },
      {
        heading: "Proposed Greenhouse Configuration",
        items: [
          { label: "Greenhouse 1 — Leafy Greens + Herbs", val: "20,000 sq ft (0.46 acres). NFT hydroponic rails. Crops: lettuce, spinach, kale, basil, cilantro, microgreens. Yield: ~150,000 lbs/yr." },
          { label: "Greenhouse 2 — Fruiting Crops", val: "15,000 sq ft. Dutch bucket system. Crops: tomatoes, cucumbers, peppers, strawberries. Yield: ~120,000 lbs/yr." },
          { label: "Greenhouse 3 — Mushrooms", val: "8,000 sq ft. Substrate growing rooms. Crops: oyster, shiitake, lion's mane. Low light = ideal for waste-heat zones. Yield: ~40,000 lbs/yr." },
          { label: "Greenhouse 4 — Root & Staple Crops", val: "10,000 sq ft. Deep water culture + vertical tower system. Crops: sweet potatoes, carrots, beets, radishes." },
          { label: "Aquaponics Module", val: "5,000 sq ft. Tilapia + lettuce closed loop (Japan White Data Center model using cooling water for fish farming). ~15,000 lbs fish/yr." },
          { label: "Processing + Retail Hub", val: "3,000 sq ft wash-pack facility, cold storage, on-site farm stand open to public 3 days/week." },
        ]
      },
      {
        heading: "Heat Recovery Engineering",
        items: [
          { label: "Heat Source", val: "Turbine exhaust and server HVAC return air. Servers typically exhaust at 35–45°C — ideal for greenhouse heating (most crops: 18–28°C optimal)." },
          { label: "Transfer System", val: "Heat exchangers on turbine cooling loops → insulated glycol distribution pipes → greenhouse floor radiant heating + overhead air handling units." },
          { label: "Thermal Buffer", val: "6.31-acre detention pond acts as thermal mass — absorbs excess heat in summer, releases in winter." },
          { label: "Backup Heating", val: "Electric heat pump backup for extreme cold snaps. Powered from BESS during off-peak. Virtually never needed in NC climate." },
          { label: "NC Climate Advantage", val: "Unlike Sweden (sub-arctic), NC averages 50°F winters. Waste heat supplements rather than fully replacing solar gain. Year-round growing is easy." },
        ]
      },
      {
        heading: "Production & Community Distribution",
        items: [
          { label: "Annual total yield estimate", val: "~350,000 lbs of produce + 15,000 lbs fish across all houses" },
          { label: "Feed how many?", val: "Average American eats ~400 lbs produce/yr. 350K lbs serves ~875 people fully, supplements ~3,000–4,000 more" },
          { label: "Pricing model", val: "Not free — ultra-low cost. Suggested: 40–60% below grocery retail. No antibiotics, no pesticides, certified clean." },
          { label: "Priority access", val: "Dignity Village + Sanctuary Village residents get first allocation at cost. Public buys remainder at farm-stand pricing." },
          { label: "Food bank partnership", val: "10% of production donated weekly to Franklin County food bank. Tax-deductible. Community goodwill." },
          { label: "Vocational pipeline", val: "6–8 full-time greenhouse jobs filled from Dignity Village graduates. Includes paid apprenticeships in agri-tech." },
        ]
      },
      {
        heading: "Capital & Operating Costs",
        table: [
          { item: "Greenhouse structures (4 buildings, commercial steel + poly)", cost: "$1,200,000" },
          { item: "Hydroponic systems + NFT/DWC/Dutch bucket hardware", cost: "$380,000" },
          { item: "Aquaponics tank system", cost: "$120,000" },
          { item: "Heat exchange plumbing + radiant floor", cost: "$280,000" },
          { item: "LED grow lighting (supplemental, for low-light months)", cost: "$160,000" },
          { item: "Wash-pack facility + cold storage + farm stand", cost: "$220,000" },
          { item: "Irrigation, sensors, climate control automation", cost: "$140,000" },
          { total: true, item: "Total Capital Cost", cost: "$2,500,000" },
          { item: "Annual labor (6 FTE at avg $42K + benefits)", cost: "$323,000/yr" },
          { item: "Nutrients, growing media, seeds, supplies", cost: "$95,000/yr" },
          { item: "Utilities (grow lights, pumps — heat is FREE)", cost: "$48,000/yr" },
          { item: "Maintenance, pest management, certifications", cost: "$34,000/yr" },
          { total: true, item: "Total Annual OpEx", cost: "$500,000/yr" },
          { item: "Estimated annual produce revenue (at-cost sales)", cost: "$280,000/yr" },
          { item: "Net annual cost to project (subsidy needed)", cost: "$220,000/yr" },
        ]
      }
    ]
  },
  {
    id: "plaza",
    icon: "🎉",
    title: "Community Event Plaza",
    tagline: "Parking lot by day, neighborhood hub on demand — secured, ticketed, free to attend",
    accent: C.gold,
    lightBg: C.amber,
    heroStat: "~3 acres",
    heroLabel: "of hardscaped plaza convertible for 500–2,000 person events in under 4 hours",
    sections: [
      {
        heading: "The Concept",
        body: "The front parking lot facing US Highway 64 is designed dual-purpose from day one. On a normal day it's a functional vehicle lot. For a block party, farmers market, concert, or community fair it converts to a fully equipped outdoor venue in under half a day — power, lighting, sound hookups, and restroom access already built in. No tents needed. No permits pulled each time. The infrastructure is permanent and the event is just a scheduled activation. Visitor passes are free, issued online, and auto-cap attendance by event size. Every registrant is in a database. No wristbands. QR codes on phones."
      },
      {
        heading: "Physical Infrastructure (Built Once)",
        items: [
          { label: "Surface", val: "Permeable pavers with embedded flush power pedestals every 30 ft (120V/240V 30A outlets, data ports). Drainage integrated." },
          { label: "Perimeter Lighting", val: "Solar LED poles already planned for community lighting — doubled as event ambiance. Programmable RGB capable." },
          { label: "Permanent Stage Pad", val: "20×40 ft reinforced concrete pad with flush conduit stub-ups for stage power (400A service), speaker rigging anchor points, and backstage utility room (fenced, lockable)." },
          { label: "Restroom Building", val: "Permanent 8-stall restroom + 2 ADA stalls + utility sink + janitor closet. Doubles as security office on non-event days." },
          { label: "Water Stations", val: "6 permanent hydration stations with filtered tap + bottle fill. On/off valve in utility room." },
          { label: "Sound Reflector Walls", val: "Two permanent 12-ft wing walls flanking stage area act as acoustic reflectors for outdoor events AND as sound baffles facing the highway." },
          { label: "Wi-Fi Blanket", val: "Existing public Wi-Fi mesh extends to plaza. 500+ simultaneous connections. Visitor check-in is Wi-Fi dependent." },
          { label: "Security Cameras", val: "16 PTZ cameras covering plaza + entry gates. Existing campus security monitors all cameras from main office." },
        ]
      },
      {
        heading: "Event Access & Visitor Management System",
        items: [
          { label: "Registration portal", val: "Simple public web form: name, phone, # attending, email → QR code issued instantly. No account required. Free always." },
          { label: "Capacity control", val: "Each event type has a cap (block party: 500, concert: 1,200, market: 2,000). Portal auto-closes when cap is reached." },
          { label: "Check-in", val: "2 staffed QR scan gates at plaza entrance. Scan = entry logged. Non-registrants turned away or same-day registered on-site if under cap." },
          { label: "Visitor data use", val: "Aggregate attendance data only. No selling data. Used for: cap management, grant reporting (community impact metrics), event planning." },
          { label: "Tours", val: "Free 45-min guided tours offered every Saturday 10am and 1pm, max 25 per tour. Registration same portal. Tour covers: greenhouse, sound barrier walk, community spaces, infrasound display." },
          { label: "Security protocol", val: "2 additional security staff on event days. Existing perimeter fencing + cameras remain active. Single entry/exit point during events." },
        ]
      },
      {
        heading: "Event Calendar Framework",
        items: [
          { label: "Monthly Block Party", val: "1st Saturday of every month. Free entry. Live music, food trucks (priority to Vocational Academy graduates' food carts), kids activities." },
          { label: "Weekly Farm Stand", val: "Every Saturday 8am–1pm. Greenhouse produce sales at below-retail pricing. Open to public, no registration required." },
          { label: "Quarterly Community Fair", val: "4× per year. Larger scale: 1,500–2,000 attendees. Craft vendors, live performances, health screenings, career fair (Vocational Academy)." },
          { label: "Annual SEED Day", val: "Full campus open house. Tours, demos, community awards, showcase of Dignity Village and Academy graduates." },
          { label: "School Tours", val: "Offered year-round, Tuesday–Thursday by request. K-12 groups learn about renewable energy, hydroponics, infrasound science." },
        ]
      },
      {
        heading: "Infrastructure Cost (One-Time)",
        table: [
          { item: "Permeable paver surface with power pedestal grid (3 acres)", cost: "$420,000" },
          { item: "Stage pad + conduit + power service + anchor points", cost: "$85,000" },
          { item: "Permanent restroom building (ADA compliant)", cost: "$145,000" },
          { item: "Sound reflector wing walls (2× 12-ft panels)", cost: "$38,000" },
          { item: "6 hydration stations + plumbing", cost: "$22,000" },
          { item: "Visitor management software + kiosk + scan equipment", cost: "$18,000" },
          { total: true, item: "Total Plaza Infrastructure", cost: "$728,000" },
          { item: "Annual event ops (staffing 2 extra guards × 24 events)", cost: "$28,800/yr" },
          { item: "Annual software + portal maintenance", cost: "$4,800/yr" },
          { item: "Cleaning + maintenance per event", cost: "$12,000/yr" },
          { total: true, item: "Annual Operating Cost", cost: "$45,600/yr" },
        ]
      }
    ]
  },
  {
    id: "waste",
    icon: "♻️",
    title: "Waste-to-Energy System",
    tagline: "Diverting landfill waste, recovering energy, closing the loop — 24/7",
    accent: C.rust,
    lightBg: C.rose,
    heroStat: "90%",
    heroLabel: "volume reduction of municipal solid waste — what enters as trash leaves as energy + ash",
    sections: [
      {
        heading: "The Concept & Technology Choice",
        body: "Municipal solid waste (MSW) gasification — not incineration — is the recommended technology for this site. Gasification operates in a low-oxygen environment, breaking waste into syngas (hydrogen + CO + methane) rather than burning it completely. This produces dramatically lower NOx, SOx, and particulate emissions than mass-burn incineration, and the syngas can be cleaned and used to generate electricity or fed back into the turbine fuel mix. The on-site WtE unit handles construction waste during build-out, then transitions to a 24/7 community waste diversion operation. Tipping fees — what haulers pay to drop off waste — become a revenue stream. SEED pays to take other people's garbage."
      },
      {
        heading: "Technology: MSW Gasification vs. Alternatives",
        items: [
          { label: "Gasification (Recommended)", val: "Low-oxygen thermal decomposition → syngas. Electrical efficiency up to 35%. Lower emissions than incineration. Best for mixed MSW. $5–8M per MW installed." },
          { label: "Pyrolysis", val: "Zero-oxygen thermal decomposition → bio-oil + biochar + syngas. Excellent for plastics. ~75% thermal efficiency. Higher upfront cost. Good for biochar production for greenhouses." },
          { label: "Mass-Burn Incineration", val: "Simplest technology, highest throughput, most common globally (2,800+ plants worldwide). Higher emissions than gasification. Easier to permit in some states. $4–10M/MW." },
          { label: "Anaerobic Digestion", val: "Biological conversion of organic waste → biogas (methane). Lower heat/cost. Only processes food + organic waste. Good as ADD-ON to primary WtE." },
          { label: "SEED Recommendation", val: "Phase 1: Modular gasification unit (50–100 tons/day capacity). Phase 2: Add anaerobic digestion module for organic waste from greenhouses + cafeteria." },
        ]
      },
      {
        heading: "Operational Model",
        items: [
          { label: "Construction phase", val: "WtE unit processes demolition debris, land clearing waste, construction packaging. Diverts ~500–1,000 tons from landfill during 18-month build." },
          { label: "Operational phase", val: "Accept MSW from county haulers and regional municipalities. NC averages ~1,200 lbs MSW/person/year. Franklin County alone generates ~44,000 tons/yr." },
          { label: "Sorting system", val: "Incoming waste sorted on-site: recyclables separated (sold), organics to anaerobic digester, remainder to gasifier. Manual + conveyor sort line, 6 FTE." },
          { label: "Energy output", val: "A 100 ton/day unit generates approximately 2–3 MW of electricity. At SEED scale that's supplemental, not primary — but offsets grid draw and earns carbon credits." },
          { label: "Revenue: Tipping fees", val: "NC tipping fee average: $45–75/ton. At 100 tons/day: $4,500–$7,500/day → $1.6M–$2.7M/year in gate revenue." },
          { label: "Revenue: Energy", val: "2–3 MW × 8,760 hrs × $0.05/kWh = $876K–$1.3M/yr in avoided energy cost or sold back to grid." },
          { label: "Revenue: Carbon credits", val: "Each ton diverted from landfill avoids ~0.5 tons CO2e (methane avoided). At $15–25/ton CO2e: $330K–$550K/yr additional revenue." },
          { label: "Residual ash", val: "Gasification produces ~5–10% ash by weight. Tested, treated, and used as road base material or aggregate — circular." },
        ]
      },
      {
        heading: "Emissions & Community Protection",
        items: [
          { label: "Air quality monitoring", val: "Dedicated PM2.5, NOx, SOx, dioxin sensor array at WtE stack and downwind community locations. All data on public dashboard." },
          { label: "Dioxin control", val: "Secondary combustion chamber holds 950–1100°C for ≥2 seconds — the EPA standard for complete dioxin destruction." },
          { label: "Ash containment", val: "Enclosed ash conveyor direct to sealed storage. Zero open-air ash handling. Weekly third-party testing." },
          { label: "Odor control", val: "Waste receiving building kept at negative pressure (air drawn in, not out). All air exhausted through biofilter before release." },
          { label: "Truck routing", val: "Dedicated haul road from US-64 direct to WtE facility — waste trucks never enter community green zone or residential areas." },
          { label: "Permit pathway", val: "NC DEQ Title V Air Permit required. Timeline: 12–18 months. Begin permit application during site plan approval phase." },
        ]
      },
      {
        heading: "Capital & Revenue Summary",
        table: [
          { item: "Modular gasification unit (50 tons/day, Phase 1)", cost: "$8,000,000" },
          { item: "Sorting facility + conveyor + receiving building", cost: "$1,800,000" },
          { item: "Negative-pressure enclosure + biofilter odor system", cost: "$400,000" },
          { item: "Syngas cleanup + power generation equipment", cost: "$1,200,000" },
          { item: "Ash handling + storage + testing facility", cost: "$280,000" },
          { item: "Emissions monitoring stack + community sensors", cost: "$180,000" },
          { item: "Dedicated haul road + truck turnaround", cost: "$340,000" },
          { total: true, item: "Total Capital Cost (Phase 1)", cost: "$12,200,000" },
          { item: "Annual labor (sorting + ops, 12 FTE)", cost: "$624,000/yr" },
          { item: "Maintenance + consumables", cost: "$280,000/yr" },
          { item: "Permitting + compliance + third-party testing", cost: "$95,000/yr" },
          { total: true, item: "Total Annual OpEx", cost: "$999,000/yr" },
          { item: "Revenue: Tipping fees (100 tons/day)", cost: "+$2,190,000/yr" },
          { item: "Revenue: Energy output (2.5 MW avg)", cost: "+$1,095,000/yr" },
          { item: "Revenue: Carbon credits (est)", cost: "+$440,000/yr" },
          { total: true, item: "Net Annual Revenue (after OpEx)", cost: "+$2,726,000/yr ✅" },
        ]
      }
    ]
  }
];

function ProgramHeader({ prog, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 180, background: active ? prog.accent : "#fff",
      border: `2px solid ${active ? prog.accent : C.rule}`,
      borderRadius: 10, padding: "14px 16px", cursor: "pointer",
      textAlign: "left", transition: "all 0.2s",
    }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{prog.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: active ? "#fff" : C.ink, fontFamily: "sans-serif", lineHeight: 1.3 }}>{prog.title}</div>
      <div style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.7)" : C.mid, marginTop: 4, fontFamily: "sans-serif", fontStyle: "italic" }}>{prog.tagline.split("—")[0]}</div>
    </button>
  );
}

function TableSection({ rows, accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.rule}`, marginTop: 8 }}>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "9px 14px", borderBottom: i < rows.length - 1 ? `1px solid ${C.rule}` : "none",
          background: r.total ? `${accent}12` : (i % 2 === 0 ? "#fafafa" : "#fff"),
        }}>
          <span style={{ fontSize: 13, color: C.ink, fontFamily: "sans-serif", fontWeight: r.total ? 700 : 400 }}>{r.item}</span>
          <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 800, color: r.cost?.startsWith("+") ? C.green : (r.total ? accent : C.ink) }}>{r.cost}</span>
        </div>
      ))}
    </div>
  );
}

function ItemList({ items, accent }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${accent}`, display: "grid", gridTemplateColumns: "140px 1fr", gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: accent, fontFamily: "sans-serif", lineHeight: 1.4 }}>{it.label}</span>
          <span style={{ fontSize: 13, color: C.ink, fontFamily: "sans-serif", lineHeight: 1.6 }}>{it.val}</span>
        </div>
      ))}
    </div>
  );
}

function ProgramDetail({ prog }) {
  return (
    <div style={{ background: prog.lightBg, borderRadius: 12, padding: 24 }}>
      {/* Hero stat */}
      <div style={{ background: prog.accent, borderRadius: 10, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", fontFamily: "monospace", lineHeight: 1 }}>{prog.heroStat}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif", marginTop: 4, maxWidth: 400 }}>{prog.heroLabel}</div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>{prog.title}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, fontStyle: "italic", fontFamily: "sans-serif" }}>{prog.tagline}</div>
        </div>
      </div>

      {/* Sections */}
      {prog.sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 16, color: prog.accent, fontFamily: "Georgia, serif", borderBottom: `2px solid ${prog.accent}30`, paddingBottom: 6 }}>{sec.heading}</h3>
          {sec.body && <p style={{ margin: 0, fontSize: 14, color: C.ink, lineHeight: 1.8, fontFamily: "sans-serif", background: "#fff", borderRadius: 8, padding: "14px 16px" }}>{sec.body}</p>}
          {sec.items && <ItemList items={sec.items} accent={prog.accent} />}
          {sec.table && <TableSection rows={sec.table} accent={prog.accent} />}
        </div>
      ))}
    </div>
  );
}

export default function FlagshipPrograms() {
  const [active, setActive] = useState("infrasound");
  const prog = programs.find(p => p.id === active);

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.cream, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.ink} 0%, #0D2818 50%, ${C.forest} 100%)`, padding: "32px 28px 24px" }}>
        <div style={{ fontSize: 11, color: C.mint, letterSpacing: 3, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 8 }}>SEED INITIATIVE — FLAGSHIP PROGRAMS DEEP DIVE</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, color: "#fff", fontWeight: 900, lineHeight: 1.2 }}>Four Programs.<br />Full Engineering + Cost Detail.</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: 0, maxWidth: 560, lineHeight: 1.7, fontStyle: "italic" }}>
          Infrasound monitoring (world first) · Waste-heat greenhouse network · Community event plaza · Waste-to-energy system. Every spec, every cost, every revenue line.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ background: C.ink, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {programs.map(p => (
            <ProgramHeader key={p.id} prog={p} active={active === p.id} onClick={() => setActive(p.id)} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>
        <ProgramDetail prog={prog} />
      </div>

      {/* Summary bar */}
      <div style={{ background: C.forest, padding: "16px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: C.mint, fontSize: 11, fontFamily: "sans-serif", letterSpacing: 2, marginBottom: 10, fontWeight: 700 }}>COMBINED INVESTMENT SUMMARY — ALL FOUR PROGRAMS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { label: "Infrasound System", capex: "$196K", opex: "$28K/yr", rev: "—" },
              { label: "Greenhouse Network", capex: "$2.5M", opex: "$500K/yr", rev: "$280K/yr sales" },
              { label: "Event Plaza", capex: "$728K", opex: "$46K/yr", rev: "Community goodwill" },
              { label: "Waste-to-Energy", capex: "$12.2M", opex: "$999K/yr", rev: "+$2.7M/yr NET ✅" },
            ].map(r => (
              <div key={r.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, fontFamily: "sans-serif", marginBottom: 6 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>Build: <strong style={{ color: C.mint }}>{r.capex}</strong></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>Ops: <strong style={{ color: C.mint }}>{r.opex}</strong></div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>Revenue: <strong style={{ color: r.rev.includes("✅") ? "#69db7c" : C.mint }}>{r.rev}</strong></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "sans-serif" }}>Total 4-program capital investment</span>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontFamily: "monospace" }}>~$15.6M</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "sans-serif" }}>WtE net revenue alone covers all 4 programs' annual operating costs</span>
            <span style={{ color: "#69db7c", fontSize: 16, fontWeight: 900, fontFamily: "monospace" }}>Self-funding by Year 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
