import { useState } from "react";

const P = {
  ink: "#0B1A0B", forest: "#1B4332", green: "#2D6A4F", sage: "#52B788",
  mint: "#B7E4C7", cream: "#F4F0E8", gold: "#C9931A", amber: "#FFF7DD",
  slate: "#1B3A5C", sky: "#3A7BD5", mist: "#EAF2FC", rust: "#8B3A1A",
  rose: "#FFF0EB", mid: "#666", rule: "#DDD8CF", white: "#FFF",
};

function Card({ children, accent = P.green, bg }) {
  return <div style={{ background: bg || P.white, borderRadius: 10,
    borderLeft: `4px solid ${accent}`, padding: "16px 18px", marginBottom: 12 }}>{children}</div>;
}
function SH({ children, accent = P.green }) {
  return <h3 style={{ margin: "0 0 10px", color: accent, fontFamily: "Georgia,serif",
    fontSize: 16, borderBottom: `2px solid ${accent}22`, paddingBottom: 5 }}>{children}</h3>;
}
function Kv({ k, v, accent = P.green }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 8,
      padding: "7px 0", borderBottom: `1px solid ${P.rule}`, alignItems: "start" }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: accent, fontFamily: "sans-serif", lineHeight: 1.4 }}>{k}</span>
      <span style={{ fontSize: 13, color: P.ink, lineHeight: 1.6, fontFamily: "sans-serif" }}>{v}</span>
    </div>
  );
}
function CostLine({ label, cost, sub, positive, total, accent = P.forest }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 14px",
      background: total ? `${accent}14` : (positive ? "#F0FAF4" : (label?.includes("—") ? "#fafafa" : P.white)),
      borderBottom: `1px solid ${P.rule}` }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: total ? 800 : 400, fontFamily: "sans-serif", color: P.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif" }}>{sub}</div>}
      </div>
      <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13,
        color: positive ? P.green : (total ? accent : P.ink), whiteSpace: "nowrap" }}>{cost}</span>
    </div>
  );
}
function StatBox({ stat, label, color = P.green }) {
  return (
    <div style={{ flex: 1, minWidth: 110, background: P.white, borderRadius: 8,
      padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "monospace" }}>{stat}</div>
      <div style={{ fontSize: 11, color: P.mid, marginTop: 4, fontFamily: "sans-serif", lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

const SECTIONS = [
  { id: "infra",  icon: "🏗️", label: "Infrastructure" },
  { id: "ro",     icon: "💧", label: "Water Treatment" },
  { id: "solar",  icon: "☀️", label: "Solar + Storage" },
  { id: "rent",   icon: "🏠", label: "Rent Stabilization" },
  { id: "costs",  icon: "💰", label: "Full Cost Summary" },
];

function InfraSection() {
  return (
    <div>
      <Card accent={P.slate}>
        <SH accent={P.slate}>⚡ Underground Utility Lines — Burying Overhead Wires</SH>
        <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12,
          borderLeft: `3px solid ${P.slate}` }}>
          Overhead lines cost <strong>~$284K/mile to install</strong> but require constant trimming, fail in storms, and are visually blighting. Underground distribution lines cost <strong>$1–2M/mile in rural/suburban NC</strong> but last 30–35 years with 97% fewer outages. FEMA's HMGP program covers up to 75% of undergrounding cost in hazard-mitigation eligible areas.
        </div>
        <Kv k="Target Area" v="All overhead distribution lines within 2-mile radius of SEED campus. Estimate: 8–12 miles of residential feeder lines serving low/medium income neighborhoods along US-64 corridor." accent={P.slate} />
        <Kv k="Technology" v="Open trenching preferred for residential streets (lower cost). Micro-trenching option for paved sections ($6–10/ft vs $25+/ft for full trench). All new conduit sized for future fiber broadband pull-through." accent={P.slate} />
        <Kv k="Cost Estimate" v="$1.5M/mile (rural/suburban NC) × 10 miles = $15M. FEMA HMGP grant: 75% = $11.25M covered. SEED contribution: ~$3.75M. Net cost to project: under $4M." accent={P.slate} />
        <Kv k="Community Benefit" v="Storm outages reduced 97%. No more downed lines in hurricanes. Improved aesthetics = measurable property value increase. Bonus fiber conduit enables free public broadband expansion." accent={P.slate} />
        <Kv k="Funding" v="FEMA Hazard Mitigation Grant Program (HMGP), USDA ReConnect Program (rural broadband piggyback), Duke Energy partnership (utility saves on long-term maintenance)." accent={P.slate} />
      </Card>

      <Card accent={P.gold}>
        <SH accent={P.gold}>🚦 Smart Traffic Signal Network</SH>
        <Kv k="What It Is" v="Replace all signalized intersections within 3-mile radius with adaptive traffic signal control (ATSC) systems. Sensors monitor real-time vehicle count, speed, and queue length. Signal timing auto-adjusts every cycle." accent={P.gold} />
        <Kv k="Vehicle Detection" v="Radar + video analytics sensors at every approach. Detects bicycles, pedestrians, emergency vehicles, and trucks separately. Counts vehicles. Logs data. All streamed to public dashboard." accent={P.gold} />
        <Kv k="Emergency Preemption" v="All signals hard-wired for emergency vehicle preemption. Fire truck or ambulance within 0.5 miles auto-clears every light on their route. Zero delay in life-threatening situations." accent={P.gold} />
        <Kv k="Pedestrian Upgrades" v="Every crosswalk: Rapid Flashing Beacons (RRFB) + audible pedestrian signals + countdown timers. Curb ramps rebuilt to ADA 2024 standard at every intersection." accent={P.gold} />
        <Kv k="Target Count" v="20 intersections within 3-mile priority zone. Phase 2: extend to 40 intersections across broader community area." accent={P.gold} />
        <Kv k="Cost" v="$120,000–$180,000 per full intersection (hardware + install + software license). 20 intersections: $2.4–$3.6M. Annual software/maintenance: $80K/yr." accent={P.gold} />
        <Kv k="Funding" v="USDOT RAISE Grant, FHWA Signal Timing Improvement Program, NC DOT Safety Program funds." accent={P.gold} />
      </Card>

      <Card accent={P.green}>
        <SH accent={P.green}>🚶 ADA Sidewalk Network — Miles of Connectivity</SH>
        <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          <strong style={{ color: P.forest }}>Core idea:</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Low and medium income housing areas in rural NC typically have <em>zero</em> sidewalk access. Workers walk in the road shoulder to reach bus stops, grocery stores, and jobs. This is dangerous, dignity-destroying, and completely solvable. We build the missing miles.</span>
        </div>
        <Kv k="Priority Routes" v="1. Housing to nearest bus stop (every route within 2 miles). 2. Housing to grocery store. 3. Housing to SEED campus (direct pedestrian access). 4. School routes for children K–12." accent={P.green} />
        <Kv k="Standard" v="5-ft minimum width ADA compliant. Concrete (not asphalt — lasts 30 years vs 10). Detectable warning strips at all curb cuts. Tactile guidance strips on key routes." accent={P.green} />
        <Kv k="Cost per mile" v="ADA-compliant concrete sidewalk: $150,000–$250,000/mile (5-ft wide, curb ramps, detectable warnings). Baltimore DOT data: $150K/mile for standard repair/replacement." accent={P.green} />
        <Kv k="Target miles" v="Phase 1: 15 priority miles (highest-need routes). Phase 2: 25 additional miles. Total: 40 miles." accent={P.green} />
        <Kv k="Phase 1 Cost" v="15 miles × $200K = $3,000,000" accent={P.green} />
        <Kv k="Full Build Cost" v="40 miles × $200K = $8,000,000 (over 3–5 years)" accent={P.green} />
        <Kv k="Funding" v="USDOT Safe Streets & Roads for All (SS4A) grant (up to $25M/project), CDBG (HUD), NC DOT TASA (Transportation Alternatives Set-Aside), Americans with Disabilities Act compliance grants." accent={P.green} />
      </Card>

      <Card accent={P.sage}>
        <SH accent={P.sage}>🌳 Street Tree Canopy Program</SH>
        <Kv k="Goal" v="Plant street trees along every upgraded sidewalk corridor. Target: 1 tree per 30 linear feet of new sidewalk = ~7,000 trees across 40 miles of routes." accent={P.sage} />
        <Kv k="Species" v="NC native selections prioritized for road tolerance: Willow Oak, Sweetgum, American Elm (disease-resistant cultivar), Eastern Redbud, Serviceberry. All sourced from NC nurseries." accent={P.sage} />
        <Kv k="Benefits" v="Urban heat island reduction (street temp -5 to -8°F under canopy). CO₂ sequestration (~48 lbs/tree/yr). Stormwater interception (mature tree captures 1,000+ gal rain/yr). Property value +5–15% documented by USDA Forest Service." accent={P.sage} />
        <Kv k="Cost" v="$400–$600 per tree installed (3-inch caliper B&B, street grate, irrigation bag). 7,000 trees = $2.8–$4.2M. Phase 1 (2,500 trees, priority corridors): ~$1.5M." accent={P.sage} />
        <Kv k="Maintenance" v="3-year establishment care included in install contract. After Year 3: maintained by county/municipality per standard street tree program." accent={P.sage} />
        <Kv k="Funding" v="USDA Urban and Community Forestry Grant, USDA ReLeaf, NC Forest Service community tree programs, green infrastructure grants." accent={P.sage} />
      </Card>

      <Card accent={P.sky}>
        <SH accent={P.sky}>💡 Solar-Powered LED Street Lighting</SH>
        <Kv k="Concept" v="Replace all existing streetlights in target area with off-grid solar LED units. No utility bills. No outages from grid failure. Runs on battery through 3+ cloudy days." accent={P.sky} />
        <Kv k="Spec" v="Monocrystalline solar panel (80–120W), lithium iron phosphate battery (2–3 day autonomy), 30–50W LED fixture (2700K warm spectrum, full cutoff). Motion dimming 11pm–5am saves battery." accent={P.sky} />
        <Kv k="Coverage" v="300 new poles in target area (fills gaps in currently unlit residential streets). Replace 150 existing aging poles on priority pedestrian routes." accent={P.sky} />
        <Kv k="Cost" v="All-in pole + solar + LED + battery + install: $8,000–$14,000 per unit. 450 total units (300 new + 150 replacements) × $10,000 avg = $4,500,000." accent={P.sky} />
        <Kv k="Annual Savings" v="vs. grid-powered: ~$90/pole/yr utility avoided. 450 poles = $40,500/yr perpetual savings to municipality." accent={P.sky} />
        <Kv k="Funding" v="EPA Solar for All, USDA Rural Energy for America Program (REAP), NC Clean Energy Technology Center grants, DOE IIJA Community Benefits funds." accent={P.sky} />
      </Card>
    </div>
  );
}

function ROSection() {
  return (
    <div>
      <Card accent={P.sky}>
        <SH accent={P.sky}>💧 Community Reverse Osmosis Water Treatment Plant</SH>
        <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 14,
          borderLeft: `3px solid ${P.sky}` }}>
          Franklin County draws water from surface sources and private wells. Many rural low-income households have no access to municipal water at all, or receive water with elevated contaminants (nitrates from agriculture, PFAS from industrial sites, iron/manganese from geology). An on-site or community-adjacent RO plant delivers clean, remineralized drinking water to all community connections and acts as a resilience node during emergencies.
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            { stat: "99%+", label: "PFAS removal by RO membrane" },
            { stat: "95%+", label: "nitrate, heavy metal, and TDS removal" },
            { stat: "0.5 MGD", label: "target capacity (500,000 gal/day)" },
            { stat: "~5,000", label: "people served at 100 gal/person/day" },
          ].map(s => <StatBox key={s.label} stat={s.stat} label={s.label} color={P.sky} />)}
        </div>

        <Kv k="System Design" v="Multi-stage: Pre-filtration (sediment + activated carbon) → Reverse Osmosis (PVDF membrane array) → UV disinfection → Remineralization (calcium/magnesium add-back) → Distribution. All stages monitored continuously." accent={P.sky} />
        <Kv k="Capacity" v="0.5 MGD (500,000 gallons/day) Phase 1. Expandable to 2 MGD with modular membrane addition. Sized for SEED campus + community distribution network." accent={P.sky} />
        <Kv k="Power" v="RO is energy-intensive (~3–5 kWh per 1,000 gallons). 500K GPD × 4 kWh/1,000 gal = 2,000 kWh/day. Powered by on-site BESS + solar. Zero grid draw for water treatment." accent={P.sky} />
        <Kv k="Brine Disposal" v="RO produces ~30% brine (reject water). Treated further through brine concentrator before WtE process assists with evaporation. Zero discharge to waterways." accent={P.sky} />
        <Kv k="Community Distribution" v="Network of community water kiosks (8 locations in low-income housing areas): clean water dispensing at $0.01–$0.02/gallon. Eliminates bottled water dependency for families." accent={P.sky} />
        <Kv k="Emergency Role" v="During power outages or contamination events, RO plant continues operating on BESS. SEED becomes the community's backup water supply. Disaster resilience node." accent={P.sky} />

        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}`, marginTop: 12 }}>
          {[
            { label: "RO membrane array + high-pressure pumps", cost: "$800,000" },
            { label: "Pre-treatment (sediment, carbon, softening)", cost: "$280,000" },
            { label: "UV disinfection + remineralization system", cost: "$120,000" },
            { label: "Brine concentrator", cost: "$180,000" },
            { label: "Storage tanks (500K gal treated + 200K raw)", cost: "$320,000" },
            { label: "Building, piping, electrical, controls", cost: "$400,000" },
            { label: "8 community water kiosks + distribution network", cost: "$240,000" },
            { label: "TOTAL CAPITAL", cost: "$2,340,000", total: true },
            { label: "Annual operating (labor 2 FTE, membranes, chemicals)", cost: "$185,000/yr" },
            { label: "Revenue: community kiosk water sales (@$0.015/gal)", cost: "+$75,000/yr", positive: true },
            { label: "Net annual cost", cost: "$110,000/yr", total: true },
          ].map((r, i) => <CostLine key={i} {...r} accent={P.sky} />)}
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: P.mid, fontFamily: "sans-serif",
          lineHeight: 1.7, background: P.mist, borderRadius: 6, padding: "10px 12px" }}>
          <strong style={{ color: P.sky }}>Funding:</strong> EPA Water Infrastructure Finance and Innovation Act (WIFIA) loans, USDA Rural Water/Wastewater grants, NC Rural Infrastructure Authority, EPA PFAS remediation grants (if PFAS contamination confirmed in area).
        </div>
      </Card>
    </div>
  );
}

function SolarSection() {
  return (
    <div>
      <Card accent={P.gold}>
        <SH accent={P.gold}>☀️ Subsidized Solar + Battery for Low-Income Housing</SH>
        <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginBottom: 14,
          borderLeft: `3px solid ${P.gold}` }}>
          <strong style={{ color: P.gold }}>The Program:</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> SEED approaches single-family homes and small residential buildings in low/medium income neighborhoods within 3 miles and offers a fully subsidized rooftop solar + battery storage installation. Federal programs cover 30–40% through tax credits; SEED's 5% revenue endowment covers the gap. Homeowners and renters see 30–50% lower electricity bills with no upfront cost.</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {[
            { stat: "30%", label: "Federal ITC tax credit covers install cost" },
            { stat: "$0", label: "upfront cost to homeowner or renter" },
            { stat: "30–50%", label: "reduction in electricity bills" },
            { stat: "300", label: "target homes Phase 1 (3-yr pilot)" },
          ].map(s => <StatBox key={s.label} stat={s.stat} label={s.label} color={P.gold} />)}
        </div>

        <Kv k="Single-Family Homes" v="Average 5kW rooftop system + 10 kWh battery (Powerwall-equivalent). System cost: $15,000–$22,000 installed. ITC (30%): $4,500–$6,600 credit. NC state credit + USDA REAP grant covers additional 10–15%. Net homeowner cost: near zero with proper structuring." accent={P.gold} />
        <Kv k="Ownership Model" v="SEED-sponsored Community Solar LLC owns the systems. Homeowners receive power purchase agreement (PPA) at 20% below utility rate. After 10 years, system ownership transfers to homeowner free and clear." accent={P.gold} />
        <Kv k="Battery Storage Purpose" v="Battery provides backup power during outages (critical for elderly, medical equipment users). Stores solar surplus during day for evening use. Reduces grid draw during peak rate hours. Bidirectional: can export to grid for additional savings." accent={P.gold} />
        <Kv k="Aggregated Impact" v="300 homes × 5kW average = 1.5 MW community solar generation. At 4.5 peak-sun hrs/day: 2.4 MWh/day or ~876 MWh/yr. Offsets ~700 tons CO₂/yr. Grid stability improvement during peak demand." accent={P.gold} />
        <Kv k="Funding Pipeline" v="IRS ITC (30% tax credit), USDA REAP (Rural Energy for America Program, up to 25% grant), EPA Solar for All (low-income solar initiative), NC Utilities Commission net metering rules, DOE Low-Income Solar Program." accent={P.gold} />
      </Card>

      <Card accent={P.forest}>
        <SH accent={P.forest}>🏢 Apartment Complex Solar Partnership Program</SH>
        <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "14px 16px", marginBottom: 14,
          borderLeft: `3px solid ${P.forest}` }}>
          <strong style={{ color: P.forest }}>The Deal:</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> SEED approaches apartment complexes and multifamily properties near the campus. The pitch is simple: we help you get solar panels on your building that reduce your utility bill, and in exchange you sign a 3-year rent stabilization covenant with a maximum 2.5% annual increase. During those 3 years, SEED delivers community infrastructure upgrades that provably raise property values — streets, trees, sidewalks, water quality, lighting. Your property becomes more valuable while your utility costs drop.</span>
        </div>

        <Kv k="What SEED Offers" v="Solar system design, permit coordination, installation project management, ITC tax credit optimization guidance, virtual net metering enrollment (excess power credits residents' bills). Free to the property owner — financed through ITC + grants." accent={P.forest} />
        <Kv k="What the Complex Gets" v="Common area power (hallways, laundry, office, exterior lights, parking) covered by solar — saves $800–$2,000/month on typical 50-unit complex. Remaining surplus split equally among tenants via virtual net metering." accent={P.forest} />
        <Kv k="Tenant Benefit" v="30–50% reduction in electricity portion of utility bill. Battery backup for common areas. No rent increase for 3 years beyond CPI cap." accent={P.forest} />
        <Kv k="3-Year Rent Cap Terms" v="Max 2.5% increase per year (vs. typical 5–8% market increases). Tied to CPI. If property values rise more than 10% due to SEED infrastructure upgrades, cap extends an additional year automatically." accent={P.forest} />
        <Kv k="Property Value Argument" v="USDA Forest Service data: each street tree adds $1,000–$10,000 to adjacent property value. Sidewalk access + reduced crime + improved lighting = documented 5–15% property value increase in similar programs. Owner's equity goes up while rent is capped — net win for owner too." accent={P.forest} />
        <Kv k="Target" v="Phase 1: 10 apartment complexes, avg 40 units each = 400 apartments served. Phase 2: 30 complexes = 1,200+ units." accent={P.forest} />
        <Kv k="Typical System Size" v="50-unit complex: 30–50 kW rooftop system + 50–100 kWh battery bank. System cost $80,000–$140,000. ITC (30%) = $24,000–$42,000 credit. USDA REAP (25%) = $20,000–$35,000. Net project cost after incentives: $20,000–$65,000 per complex." accent={P.forest} />
        <Kv k="Legal Structure" v="Covenant recorded on property title (3-year rent stabilization). Releases automatically at year 4 with optional renewal. Property owner retains full ownership. No government involvement required beyond permit." accent={P.forest} />

        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}`, marginTop: 12 }}>
          {[
            { label: "— Phase 1: 10 complexes, ~40 units each —", cost: "" },
            { label: "Solar install (avg 40kW/complex × 10)", cost: "$1,000,000" },
            { label: "Battery storage (avg 75kWh/complex × 10)", cost: "$450,000" },
            { label: "Permits, design, coordination", cost: "$80,000" },
            { label: "ITC 30% tax credit recovered", cost: "-$459,000", positive: true },
            { label: "USDA REAP 25% grants", cost: "-$382,500", positive: true },
            { label: "Net SEED out-of-pocket (Phase 1)", cost: "~$688,500", total: true },
            { label: "— Annual ongoing —", cost: "" },
            { label: "Monitoring + maintenance (all 10 complexes)", cost: "$25,000/yr" },
            { label: "Utility savings to complexes", cost: "$180,000/yr", positive: true },
            { label: "Tenant bill savings (400 units × $50/mo)", cost: "$240,000/yr", positive: true },
          ].map((r, i) => <CostLine key={i} {...r} accent={P.forest} />)}
        </div>
      </Card>
    </div>
  );
}

function RentSection() {
  return (
    <div>
      <Card accent={P.rust}>
        <SH accent={P.rust}>🏠 Rent Stabilization + Property Value Covenant Program</SH>
        <div style={{ background: P.rose, borderRadius: 8, padding: "14px 16px", marginBottom: 14,
          borderLeft: `3px solid ${P.rust}` }}>
          <strong style={{ color: P.rust }}>The Problem SEED Solves:</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Major infrastructure investments (new roads, lights, parks, transit connections) consistently raise property values — which raises rents, which displaces the low-income residents the investment was meant to help. This is the gentrification paradox. SEED breaks it with a voluntary private covenant: a contractual rent cap in exchange for real, quantifiable property improvements.</span>
        </div>

        <Kv k="Mechanism" v="Property owner signs a 3-year deed-recorded covenant: rent increases capped at 2.5% per year max. In exchange, SEED guarantees infrastructure upgrades within 0.5 miles of the property during covenant period." accent={P.rust} />
        <Kv k="What Owners Get" v="Solar panels (described above). Adjacent street/sidewalk/tree upgrades raise property value 5–15% over 3 years, building owner equity. Reduced vacancy: stable tenants stay longer in improved areas. Tax credit eligibility for solar." accent={P.rust} />
        <Kv k="What Tenants Get" v="Rent stability. Lower utility bills (solar). Better walkability and lighting. Cleaner water. Safe sidewalk access to jobs. No displacement for at least 3 years while they stabilize financially." accent={P.rust} />
        <Kv k="NC Legal Context" v="North Carolina has no statewide rent control law (NC Gen Stat § 42-14.1 prohibits municipalities from passing rent control). This covenant is VOLUNTARY and PRIVATE — it does not conflict with state law. Property owners opt in. Key distinction." accent={P.rust} />
        <Kv k="Anti-Displacement Tracking" v="SEED monitors housing turnover in the 2-mile community zone quarterly. If displacement metrics rise despite covenants, program expands with additional tenant protections including rental assistance bridge funds." accent={P.rust} />
        <Kv k="Community Land Trust Integration" v="Long-term: SEED's CLT purchases key parcels as they come to market within 0.5 miles of campus. CLT land = permanent affordability because the land is removed from speculative market forever." accent={P.rust} />
        <Kv k="Phase 1 Target" v="20 properties (mix of single-family rentals and small apartment complexes) representing ~200 units. Phase 2: 50 properties, ~500 units." accent={P.rust} />

        <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginTop: 12 }}>
          <div style={{ fontWeight: 800, color: P.gold, fontFamily: "sans-serif", marginBottom: 8 }}>📊 The Math for a Property Owner</div>
          {[
            ["Current average rent (Franklin County 2-bed)", "$900/mo"],
            ["3-year rent cap scenario (2.5%/yr)", "$900 → $923 → $946 → $970"],
            ["Without covenant (typical 5%/yr)", "$900 → $945 → $992 → $1,042"],
            ["Owner foregoes", "~$72/unit/yr in rent increases"],
            ["Owner gains: solar savings", "~$150–200/mo in utility costs"],
            ["Owner gains: property value increase", "+5–15% on asset value"],
            ["Net financial outcome for owner", "Strongly positive — solar + value > foregone rent increase"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between",
              padding: "5px 0", borderBottom: `1px solid ${P.rule}` }}>
              <span style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink }}>{k}</span>
              <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                color: P.forest }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CostSummary() {
  const programs = [
    {
      name: "Underground Utility Lines",
      icon: "⚡", accent: P.slate,
      capex: "$15,000,000",
      funded: "$11,250,000 (FEMA 75%)",
      net: "$3,750,000",
      opex: "—",
      note: "Reduces storm outages 97%. Property values +5–10%."
    },
    {
      name: "Smart Traffic Signals (20 intersections)",
      icon: "🚦", accent: P.gold,
      capex: "$3,000,000",
      funded: "$1,500,000–$2,250,000 (USDOT/FHWA grants)",
      net: "$750,000–$1,500,000",
      opex: "$80,000/yr",
      note: "Emergency preemption, pedestrian safety, real-time traffic data."
    },
    {
      name: "ADA Sidewalks (15 priority miles, Phase 1)",
      icon: "🚶", accent: P.green,
      capex: "$3,000,000",
      funded: "$1,500,000–$2,100,000 (SS4A / CDBG grants)",
      net: "$900,000–$1,500,000",
      opex: "Minimal",
      note: "Safe walking routes for low-income residents. 40-mile full build = $8M."
    },
    {
      name: "Street Tree Planting (2,500 trees, Phase 1)",
      icon: "🌳", accent: P.sage,
      capex: "$1,500,000",
      funded: "$500,000–$750,000 (USDA urban forestry)",
      net: "$750,000–$1,000,000",
      opex: "$60,000/yr (3-yr establishment)",
      note: "CO₂ sequestration, heat reduction, property value increase."
    },
    {
      name: "Solar LED Street Lighting (450 poles)",
      icon: "💡", accent: P.sky,
      capex: "$4,500,000",
      funded: "$1,800,000–$2,700,000 (EPA Solar for All, USDA REAP)",
      net: "$1,800,000–$2,700,000",
      opex: "$40,500/yr saved vs. grid",
      note: "Off-grid resilience. No utility bill ever. Warm spectrum, wildlife-safe."
    },
    {
      name: "RO Water Treatment Plant (0.5 MGD)",
      icon: "💧", accent: P.sky,
      capex: "$2,340,000",
      funded: "$700,000–$1,000,000 (EPA WIFIA / USDA rural water)",
      net: "$1,340,000–$1,640,000",
      opex: "$110,000/yr net",
      note: "Removes PFAS, nitrates, heavy metals. 5,000 people served. Community kiosks."
    },
    {
      name: "Home Solar + Battery (300 homes, Phase 1)",
      icon: "🏡", accent: P.gold,
      capex: "$5,250,000",
      funded: "$2,625,000–$3,675,000 (ITC 30% + REAP 25%)",
      net: "$1,575,000–$2,625,000",
      opex: "Self-sustaining",
      note: "$0 upfront for homeowners. 30–50% bill reduction. 700 tons CO₂/yr offset."
    },
    {
      name: "Apartment Solar Partnership (10 complexes, Phase 1)",
      icon: "🏢", accent: P.forest,
      capex: "$1,530,000",
      funded: "$841,500 (ITC + REAP)",
      net: "$688,500",
      opex: "$25,000/yr",
      note: "3-yr rent cap covenant. $420K/yr in combined utility savings to owners + tenants."
    },
  ];

  const totalCapex = "$36,120,000";
  const totalFunded = "~$20,716,500";
  const totalNet = "~$15,403,500";

  return (
    <div>
      <div style={{ background: P.forest, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ color: P.mint, fontSize: 11, letterSpacing: 2, fontFamily: "sans-serif",
          fontWeight: 700, marginBottom: 10 }}>OFF-SITE INVESTMENT PORTFOLIO SUMMARY</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { stat: totalCapex, label: "Total program capital", color: P.white },
            { stat: totalFunded, label: "Covered by grants/tax credits", color: P.mint },
            { stat: totalNet, label: "Net SEED investment", color: P.gold },
            { stat: "~5,000+", label: "Community members directly served", color: P.sage },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 140,
              background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px",
              textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color,
                fontFamily: "monospace" }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)",
                fontFamily: "sans-serif", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {programs.map(p => (
          <div key={p.name} style={{ background: P.white, borderRadius: 10,
            borderLeft: `4px solid ${p.accent}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <div style={{ fontWeight: 800, color: P.ink, fontSize: 14,
                fontFamily: "sans-serif" }}>{p.icon} {p.name}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: `${p.accent}18`, color: p.accent,
                  padding: "3px 10px", borderRadius: 10, fontSize: 11,
                  fontFamily: "monospace", fontWeight: 800 }}>{p.capex}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 6 }}>
              {[
                { k: "Grants/Credits Available", v: p.funded },
                { k: "Net SEED Cost", v: p.net },
                { k: "Annual OpEx", v: p.opex },
                { k: "Impact", v: p.note },
              ].map(r => (
                <div key={r.k} style={{ fontSize: 12, fontFamily: "sans-serif" }}>
                  <span style={{ color: P.mid }}>{r.k}: </span>
                  <span style={{ color: P.ink, fontWeight: r.k === "Net SEED Cost" ? 700 : 400 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: P.amber, borderRadius: 10, padding: "16px 18px", marginTop: 16,
        border: `1px solid ${P.gold}40` }}>
        <div style={{ fontWeight: 800, color: P.gold, fontFamily: "sans-serif",
          marginBottom: 8 }}>🏦 Key Funding Programs Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { name: "FEMA HMGP", desc: "75% of undergrounding cost in eligible areas" },
            { name: "USDOT SS4A Grant", desc: "Up to $25M for safe streets / sidewalk programs" },
            { name: "EPA Solar for All", desc: "Low-income solar installation subsidies" },
            { name: "USDA REAP", desc: "Up to 25% grant for rural solar/energy projects" },
            { name: "IRS Investment Tax Credit", desc: "30% of solar install cost as federal tax credit" },
            { name: "EPA WIFIA Loans", desc: "Low-interest water infrastructure financing" },
            { name: "HUD CDBG", desc: "Community development block grants for infrastructure" },
            { name: "USDA Urban Forestry", desc: "Grants for street tree planting programs" },
          ].map(f => (
            <div key={f.name} style={{ background: P.white, borderRadius: 6,
              padding: "8px 10px", borderLeft: `3px solid ${P.gold}` }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: P.gold,
                fontFamily: "sans-serif" }}>{f.name}</div>
              <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif",
                marginTop: 2 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OffsiteTab() {
  const [active, setActive] = useState("infra");
  const s = SECTIONS.find(s => s.id === active);

  return (
    <div style={{ fontFamily: "Georgia,serif", background: P.cream, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${P.slate} 0%, #0D2040 50%, ${P.forest} 100%)`,
        padding: "28px 24px 20px" }}>
        <div style={{ fontSize: 11, color: P.mint, letterSpacing: 3, fontFamily: "sans-serif",
          fontWeight: 700, marginBottom: 6 }}>SEED INITIATIVE — OFF-SITE COMMUNITY INVESTMENT</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 26, color: "#fff", fontWeight: 900,
          lineHeight: 1.2 }}>🏙️ Beyond the Fence Line</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 16px",
          maxWidth: 600, lineHeight: 1.7, fontStyle: "italic" }}>
          Infrastructure upgrades, clean water, solar power, and rent protection for the neighborhoods that neighbor us — fully costed with real funding sources.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["~$36M Total Investment", "~57% Grant/Credit Funded", "~$15.4M Net SEED Cost",
            "5,000+ People Served", "40 Miles of Sidewalk (Full Build)"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)", color: P.mint,
              fontSize: 11, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: P.ink, display: "flex", overflowX: "auto",
        borderBottom: `3px solid ${P.slate}` }}>
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => setActive(sec.id)} style={{
            padding: "12px 18px", background: active === sec.id ? P.slate : "transparent",
            color: active === sec.id ? P.white : "#999",
            border: "none", cursor: "pointer", fontFamily: "sans-serif",
            fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
            borderBottom: active === sec.id ? `3px solid ${P.sage}` : "3px solid transparent" }}>
            {sec.icon} {sec.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>
        {active === "infra"  && <InfraSection />}
        {active === "ro"     && <ROSection />}
        {active === "solar"  && <SolarSection />}
        {active === "rent"   && <RentSection />}
        {active === "costs"  && <CostSummary />}
      </div>

      <div style={{ background: P.ink, color: "rgba(255,255,255,0.3)", padding: "12px 24px",
        textAlign: "center", fontSize: 11, fontFamily: "sans-serif" }}>
        SEED Initiative Off-Site Community Investment Plan · Tanner South, Northrop Grumman Aeronautics Systems
      </div>
    </div>
  );
}
