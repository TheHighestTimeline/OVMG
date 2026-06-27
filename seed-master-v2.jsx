import { useState } from "react";

// ── PALETTE ────────────────────────────────────────────────────────────────────
const P = {
  ink:    "#0B1A0B",
  forest: "#1B4332",
  green:  "#2D6A4F",
  sage:   "#52B788",
  mint:   "#B7E4C7",
  cream:  "#F4F0E8",
  gold:   "#C9931A",
  amber:  "#FFF7DD",
  slate:  "#1B3A5C",
  sky:    "#3A7BD5",
  mist:   "#EAF2FC",
  rust:   "#8B3A1A",
  rose:   "#FFF0EB",
  mid:    "#666",
  rule:   "#DDD8CF",
  white:  "#FFFFFF",
};

// ── NAV TABS ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: "env",       label: "🌿 Environmental", sub: "Carbon · Sound · Wildlife · Water · Air" },
  { id: "food",      label: "🥬 Food & Water",  sub: "Closed-loop aquaponics · Greenhouse" },
  { id: "energy",    label: "⚡ Energy & Waste", sub: "Solar · BESS · Waste-to-Energy" },
  { id: "community", label: "🎉 Community",      sub: "Plaza · Tours · Events" },
  { id: "villages",  label: "🏘️ Villages",       sub: "Dignity · Sanctuary · Re-entry" },
  { id: "qol",       label: "💚 Quality of Life", sub: "Third places · Health · Family · Arts" },
  { id: "compact",   label: "🤝 Social Compact",   sub: "Stewardship · Accountability · Ownership" },
  { id: "capital",   label: "💰 Capital",        sub: "Full cost breakdown" },
  { id: "offsite",   label: "🏙️ Off-Site",       sub: "Roads · Water · Solar · Rent" },
  { id: "politics",  label: "🏛️ Policy & Politics", sub: "Rent · Tax · Housing · Jobs · Supply Chain" },
];

// ── REUSABLE CARD ──────────────────────────────────────────────────────────────
function Card({ children, accent = P.green, style = {} }) {
  return (
    <div style={{ background: P.white, borderRadius: 10, borderLeft: `4px solid ${accent}`,
      padding: "16px 18px", ...style }}>{children}</div>
  );
}
function SectionTitle({ children, accent = P.green }) {
  return <h3 style={{ margin: "0 0 12px", color: accent, fontFamily: "Georgia,serif",
    fontSize: 17, borderBottom: `2px solid ${accent}22`, paddingBottom: 6 }}>{children}</h3>;
}
function Tag({ children, color = P.green }) {
  return <span style={{ background: `${color}18`, color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontFamily: "sans-serif",
    fontWeight: 700, marginRight: 6, marginBottom: 4, display: "inline-block" }}>{children}</span>;
}
function Kv({ k, v, accent = P.green }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8,
      padding: "7px 0", borderBottom: `1px solid ${P.rule}`, alignItems: "start" }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: accent,
        fontFamily: "sans-serif" }}>{k}</span>
      <span style={{ fontSize: 13, color: P.ink, lineHeight: 1.6,
        fontFamily: "sans-serif" }}>{v}</span>
    </div>
  );
}
function CostRow({ label, cost, sub, positive, total }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 12px", background: total ? `${P.forest}10` : (positive ? "#F0FAF4" : P.white),
      borderBottom: `1px solid ${P.rule}` }}>
      <div>
        <div style={{ fontSize: 13, fontFamily: "sans-serif",
          fontWeight: total ? 800 : 400, color: P.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif" }}>{sub}</div>}
      </div>
      <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13,
        color: positive ? P.green : (total ? P.forest : P.ink) }}>{cost}</span>
    </div>
  );
}
function StatBox({ stat, label, color = P.green, sub }) {
  return (
    <div style={{ background: P.white, borderRadius: 8, padding: "14px 16px",
      textAlign: "center", flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 26, fontWeight: 900, color, fontFamily: "monospace",
        lineHeight: 1 }}>{stat}</div>
      <div style={{ fontSize: 11, color: P.mid, marginTop: 5,
        fontFamily: "sans-serif", lineHeight: 1.4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color, fontWeight: 700,
        marginTop: 3, fontFamily: "sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ENVIRONMENTAL
// ══════════════════════════════════════════════════════════════════════════════
function EnvTab() {
  const [open, setOpen] = useState("sound");
  const sections = [
    {
      id: "sound",
      icon: "🔊",
      title: "Sound, Vibration & Infrasound",
      accent: P.slate,
      content: (
        <>
          <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12,
            borderLeft: `3px solid ${P.slate}` }}>
            <strong style={{ color: P.slate }}>World First:</strong>
            <span style={{ fontSize: 13, color: P.ink, fontFamily: "sans-serif" }}> No data center on earth publicly monitors infrasound (1–20 Hz). We do it before the first turbine fires. Pre-construction baseline = legal fortress.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { layer: "L1 – Acoustic Louvers", detail: "All turbine/HVAC inlets. −15 to −25 dB." },
              { layer: "L2 – MLV Blankets", detail: "Mass-loaded vinyl on generators. STC 32–35." },
              { layer: "L3 – MLV Perimeter Wall", detail: "15–20 ft fence, 4,000 LF. −20 to −30 dB." },
              { layer: "L4 – Grass Berm Valley", detail: "Sloped 15 ft earth berm with native evergreens. Low-freq damping −5 to −15 dB. Stormwater detention valley between berm and fence captures runoff." },
              { layer: "L5 – Rubberized Asphalt", detail: "All interior roads. Tire noise −6 to −10 dB." },
              { layer: "L6 – Roof Acoustic Panels", detail: "Mass-loaded vinyl + mineral wool in all building roofs. Internal noise −25 to −40 dB." },
            ].map(r => (
              <div key={r.layer} style={{ background: `${P.slate}10`, borderRadius: 7,
                padding: "10px 12px", borderLeft: `3px solid ${P.slate}` }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: P.slate,
                  fontFamily: "sans-serif", marginBottom: 3 }}>{r.layer}</div>
                <div style={{ fontSize: 12, color: P.ink, fontFamily: "sans-serif",
                  lineHeight: 1.5 }}>{r.detail}</div>
              </div>
            ))}
          </div>
          <Kv k="Infrasound Array" v="12 sensors: 4 on-site + 8 in community (schools, homes, park, church). All data streamed publicly. Pre-construction 6-month baseline." accent={P.slate} />
          <Kv k="Window Rebate Program" v="$2,000 rebate for triple-pane upgrades within 0.5-mile radius. Budget: $200K, covers ~100 homes." accent={P.slate} />
          <Kv k="Install Cost" v="$196,000 | Annual monitoring: $28,000/yr" accent={P.slate} />
        </>
      )
    },
    {
      id: "carbon",
      icon: "🌑",
      title: "Carbon Negative Strategy",
      accent: P.forest,
      content: (
        <>
          <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px",
            marginBottom: 12, borderLeft: `3px solid ${P.forest}` }}>
            <strong style={{ color: P.forest }}>Goal:</strong>
            <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Not carbon neutral — carbon negative. More CO₂ removed from atmosphere than the site generates, permanently.</span>
          </div>
          {[
            { k: "Turbine CO₂ Capture", v: "Direct air capture (DAC) units on turbine exhaust stacks. Partners with industrial CO₂ capture vendors. Captured CO₂ liquefied, piped to sequestration material partner on-site." },
            { k: "Carbon-Seq Interiors", v: "All internal furniture, desks, cabinets, wall panels, and flooring inside data center buildings built using carbon-sequestering materials: biochar-enhanced concrete, mass timber panels, hempcrete wall fill, mycelium composite panels. Each ton of interior material = permanent CO₂ stored in structure for 50–75 years." },
            { k: "Biochar from WtE", v: "Pyrolysis module produces biochar from organic waste. Mixed into all site landscaping soil + greenhouse growing media. Stable carbon storage for 1,000+ years." },
            { k: "Tree Planting Math", v: "A mature NC hardwood (oak, tulip poplar) absorbs ~48 lbs CO₂/yr. To offset 1 ton: ~42 trees. Site plants 5,000 trees across berms, pathways, food forest, and buffer zones. 5,000 trees × 48 lbs = ~120 tons CO₂ sequestered per year. Additional off-site reforestation partnership: 50,000 trees on nearby NC forestland." },
            { k: "Native Tree Species", v: "Loblolly pine (fast-growing), Eastern red cedar (erosion berm), Tulip poplar, White oak, River birch (detention pond edges), Sweetgum, Black walnut (food forest). All sourced from NC nurseries." },
            { k: "Carbon Credit Revenue", v: "Verified carbon removal credits (biochar + trees + DAC + sequestering materials) estimated 2,000–5,000 tons CO₂e/yr removed. At $25–50/ton: $50K–$250K/yr additional revenue." },
          ].map(r => <Kv key={r.k} k={r.k} v={r.v} accent={P.forest} />)}
        </>
      )
    },
    {
      id: "wildlife",
      icon: "🦋",
      title: "Wildlife & Habitat Protection",
      accent: P.sage,
      content: (
        <>
          <Kv k="Pre-Construction Survey" v="Full Phase 1 ecological survey: birds, pollinators, amphibians, mammals. Map movement corridors. Identify nesting areas. All documented before ground breaks." accent={P.sage} />
          <Kv k="Wildlife Corridor" v="40-acre community green zone designed as continuous wildlife corridor. Native meadow strips between tree rows. Unlit zones at night on eastern side to allow nocturnal movement." accent={P.sage} />
          <Kv k="Detention Pond Habitat" v="3 detention ponds engineered as wetland habitat: native emergent plants (cattail, bulrush), wildlife shelves at pond edges, no-fishing buffer zones. Excellent frog/turtle/waterfowl habitat." accent={P.sage} />
          <Kv k="Bird Strike Prevention" v="All glass on buildings uses UV-pattern fritted glass (invisible to humans, visible to birds). Reduces bird-strike mortality by 50–90%. No reflective glass on community-facing facades." accent={P.sage} />
          <Kv k="Pollinator Strips" v="Dedicated 2-acre native wildflower and clover meadow strip along US-64 frontage. Monarch butterfly waystation certified. No pesticides in this zone — ever." accent={P.sage} />
          <Kv k="Berm as Habitat Edge" v="Earth berm planted with layered native species: groundcover → shrubs → understory → canopy. This edge habitat is the most biodiverse zone type in temperate North America." accent={P.sage} />
          <Kv k="Light Pollution" v="All exterior lights: warm spectrum (2700K), downward-facing full-cutoff fixtures. Industrial zones: motion-activated only. Community zone: dimmed to 20% after midnight." accent={P.sage} />
          <Kv k="Heat Island Mitigation" v="Cool roofs (white TPO membrane, SR ≥ 0.65) on all buildings. 40% canopy cover target over hardscaped areas within 10 years. Permeable surfaces reduce ground heat storage." accent={P.sage} />
        </>
      )
    },
    {
      id: "air",
      icon: "💨",
      title: "Air Quality & Pollution Control",
      accent: P.sky,
      content: (
        <>
          <Kv k="Turbine Emissions Stack" v="Selective catalytic reduction (SCR) on all turbine exhausts. Reduces NOₓ by 80–90%. Oxidation catalyst for CO. Continuous emissions monitoring system (CEMS) — required by EPA." accent={P.sky} />
          <Kv k="WtE Emissions Control" v="Secondary combustion chamber at 950–1100°C destroys dioxins. Dry sorbent injection for acid gas (SO₂/HCl). Fabric filter for particulates. All emissions below EPA MACT standards." accent={P.sky} />
          <Kv k="Public Sensor Network" v="12 air quality sensors: PM₂.₅, PM₁₀, NOₓ, SOₓ, CO, VOC, ozone. Placed at 4 site perimeter + 8 community locations. Live public dashboard. Third-party annual audit." accent={P.sky} />
          <Kv k="Odor Control (WtE)" v="Waste receiving hall at negative pressure. Air pulled from hall through biofilter before release. No odor escapes tipping floor." accent={P.sky} />
          <Kv k="Living Air Filter" v="Green walls on all turbine enclosure exteriors: Virginia creeper, climbing hydrangea, native vines. Study-backed PM₂.₅ reduction 20–40% at wall surface. Aesthetic benefit." accent={P.sky} />
          <Kv k="No Idling Zone" v="All delivery trucks and haul vehicles required to shut off within 200 ft of community zone. Electric yard trucks for internal movement." accent={P.sky} />
        </>
      )
    },
    {
      id: "stormwater",
      icon: "💧",
      title: "Stormwater & Water Quality",
      accent: P.sky,
      content: (
        <>
          <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px",
            marginBottom: 12, borderLeft: `3px solid ${P.sky}` }}>
            <strong style={{ color: P.sky }}>Design target:</strong>
            <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Zero net increase in stormwater runoff vs. pre-development conditions. All rainfall managed on-site.</span>
          </div>
          <Kv k="Berm Valley System" v="The MLV perimeter berm is set back 30 ft from the fence, creating a grass valley between them. This valley is graded to channel stormwater to bioswale ends. During rain, the valley fills as a linear detention pond. Zero runoff leaves site." accent={P.sky} />
          <Kv k="Bioswale Network" v="5-acre bioswale belt on US-64 frontage: native grasses, wildflowers, river cobble check dams. Infiltrates 100% of light rain events. Treats runoff before reaching detention pond." accent={P.sky} />
          <Kv k="Detention Ponds" v="3 ponds totaling ~1.5 acres. 100-year storm capacity. Connected to bioswale network. Lined with bentonite clay (not concrete) to allow groundwater recharge." accent={P.sky} />
          <Kv k="Permeable Paving" v="All parking lots, walkways, and plaza: permeable interlocking concrete pavers (PICP). Infiltration rate 100–600 in/hr. Recharges local aquifer directly under site." accent={P.sky} />
          <Kv k="Green Roof (optional)" v="Greenhouse roofs: extensive green roof section with sedums. Retains 50–75% of rainfall. Adds R-value. Weight-tested during structural design." accent={P.sky} />
          <Kv k="Water Reuse" v="HVAC condensate + cooling tower blowdown + greenhouse runoff collected into 500,000-gallon cistern. Treated and reused for irrigation, toilet flushing, greenhouse top-off. Reduces potable water demand by ~60%." accent={P.sky} />
        </>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setOpen(s.id)} style={{
            padding: "9px 14px", borderRadius: 22, border: `2px solid ${open === s.id ? s.accent : P.rule}`,
            background: open === s.id ? s.accent : P.white, color: open === s.id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s.icon} {s.title}
          </button>
        ))}
      </div>
      {sections.filter(s => s.id === open).map(s => (
        <Card key={s.id} accent={s.accent}><SectionTitle accent={s.accent}>{s.icon} {s.title}</SectionTitle>{s.content}</Card>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: FOOD & WATER
// ══════════════════════════════════════════════════════════════════════════════
function FoodTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card accent={P.green}>
        <SectionTitle accent={P.green}>🔄 Closed-Loop Water System — Entire Site</SectionTitle>
        <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          <strong style={{ color: P.forest }}>Yes — hydroponics and aquaponics ARE a closed-loop system.</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Modern recirculating hydroponic systems (NFT, DWC) use 90–95% less water than soil farming. Aquaponics recycles water between fish tanks and plant beds — the only water lost is plant transpiration (~1%/day), which is replenished by HVAC condensate and rainwater capture.</span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          {[
            { stat: "90–95%", label: "less water vs. soil farming", color: P.sky },
            { stat: "~1%", label: "daily water loss from transpiration only", color: P.green },
            { stat: "500K gal", label: "on-site cistern from HVAC + rain capture", color: P.slate },
            { stat: "~Zero", label: "discharge from greenhouse to environment", color: P.forest },
          ].map(s => <StatBox key={s.label} {...s} />)}
        </div>
        {[
          { k: "Turbine Cooling Loop", v: "Closed-cycle cooling towers. Drift eliminators capture 99.5% of droplets. Blowdown treated and fed to cistern — not discharged." },
          { k: "Greenhouse Water Loop", v: "NFT hydroponic channels recirculate nutrient solution. Runoff recaptured, pH/EC adjusted, back to plants. Aquaponics fish tanks → biofilter → plant rafts → back to fish. True closed loop." },
          { k: "Condensate Capture", v: "Data center HVAC produces enormous condensate in NC humidity. Estimated 5,000–15,000 gallons/day from server cooling condensate. Captured, filtered, and routed to greenhouse top-off." },
          { k: "Rainwater Harvesting", v: "All building rooftops drain to underground cistern. 155-acre site at 46 in/yr rainfall = ~218M gal/yr potential. With modest 10% capture: 21.8M gal/yr. Far exceeds site water demand." },
        ].map(r => <Kv key={r.k} {...r} accent={P.green} />)}
      </Card>

      <Card accent={P.sage}>
        <SectionTitle accent={P.sage}>🥬 Greenhouse & Aquaponics Network</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { name: "GH1: Leafy Greens & Herbs", sqft: "20,000 sq ft", system: "NFT hydroponic rails", crops: "Lettuce, spinach, kale, basil, microgreens", yield: "~150,000 lbs/yr" },
            { name: "GH2: Fruiting Crops", sqft: "15,000 sq ft", system: "Dutch bucket, drip", crops: "Tomatoes, cucumbers, peppers, strawberries", yield: "~120,000 lbs/yr" },
            { name: "GH3: Mushrooms", sqft: "8,000 sq ft", system: "Substrate growing rooms", crops: "Oyster, shiitake, lion's mane — low light, ideal for waste-heat zones", yield: "~40,000 lbs/yr" },
            { name: "GH4: Root Crops + Towers", sqft: "10,000 sq ft", system: "DWC + vertical towers", crops: "Sweet potato, beets, radish, carrots", yield: "~80,000 lbs/yr" },
          ].map(g => (
            <div key={g.name} style={{ background: "#F0FAF4", borderRadius: 8,
              padding: "12px 14px", borderLeft: `3px solid ${P.sage}` }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: P.forest,
                fontFamily: "sans-serif", marginBottom: 6 }}>{g.name}</div>
              {[["Size", g.sqft], ["System", g.system], ["Crops", g.crops], ["Annual Yield", g.yield]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 6, fontSize: 12,
                  fontFamily: "sans-serif", marginBottom: 2 }}>
                  <span style={{ color: P.mid, minWidth: 70 }}>{k}:</span>
                  <span style={{ color: P.ink }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, color: P.gold, fontSize: 13,
            fontFamily: "sans-serif", marginBottom: 8 }}>🦐 Large-Scale Aquaponics + Marine Tank System</div>
          {[
            { k: "Fish & Shrimp Tank", v: "20,000 sq ft recirculating aquaculture system (RAS). Species: Tilapia (primary), Pacific white shrimp, freshwater prawns. Yield: ~25,000 lbs fish + 8,000 lbs shrimp/yr." },
            { k: "Marine Showcase Tank", v: "5,000-gallon display tank in community-facing greenhouse — visible from walking path. Species: marine fish, corals, live rock, plankton cultures. Educational + visual centerpiece." },
            { k: "Plankton Cultivation", v: "Controlled phytoplankton tanks feed shrimp larvae and fish fry. Also harvested as omega-3 supplement product. Completely novel for a data center campus." },
            { k: "Sushi-Grade Output", v: "RAS-farmed tilapia and shrimp raised without antibiotics, in clean water, zero-stress environment. Sushi-grade certification achievable. Farm stand sells weekly. Partner with local restaurant for wholesale." },
            { k: "Water Integration", v: "Fish waste → nitrified by biofilter → nutrients fed to GH1 and GH4 plants → cleaned water returned to fish. True aquaponics loop: fish fertilize plants, plants clean fish water." },
          ].map(r => <Kv key={r.k} {...r} accent={P.gold} />)}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { stat: "~390K lbs", label: "annual produce yield", color: P.green },
            { stat: "~33K lbs", label: "fish + shrimp per year", color: P.sage },
            { stat: "~875 people", label: "fully fed on produce alone", color: P.forest },
            { stat: "90%", label: "water reused vs. soil farming", color: P.sky },
          ].map(s => <StatBox key={s.label} {...s} />)}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: ENERGY & WASTE
// ══════════════════════════════════════════════════════════════════════════════
function EnergyTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card accent={P.gold}>
        <SectionTitle accent={P.gold}>☀️ Solar Array Strategy</SectionTitle>
        {[
          { k: "Rooftop Solar", v: "All data center building roofs: bifacial monocrystalline panels. Estimated 40 MW from roof surfaces alone. Orientation and tilt optimized for NC latitude (36°N)." },
          { k: "Carport Solar", v: "Parking lot canopy solar over all vehicle areas. Dual purpose: shade for parked vehicles + power generation. Estimated 8–12 MW additional. EV chargers integrated in posts." },
          { k: "Ground-Mount Array", v: "Agricultural strip (agrivoltaic) along southern property line. Solar panels elevated 8 ft — pollinators and native grasses grow underneath. ~15 MW additional." },
          { k: "Total Solar Estimate", v: "~60–70 MW peak (DC). NC averages 4.5 peak sun hours/day = ~100 GWh/yr production. At 9 GW campus draw, solar provides ~1% — but it's 100% of community zone needs." },
          { k: "BESS (Battery Storage)", v: "Grid-scale battery energy storage (lithium iron phosphate preferred for fire safety). Sized to run community zone, greenhouses, and WtE facility for 8 hrs without grid. Absorbs solar peak output." },
          { k: "Virtual Net Metering", v: "Excess solar generation credited to local apartments and low-income households within 2-mile radius. 30–50% electricity bill reduction for enrolled neighbors." },
        ].map(r => <Kv key={r.k} {...r} accent={P.gold} />)}
      </Card>

      <Card accent={P.rust}>
        <SectionTitle accent={P.rust}>♻️ Waste-to-Energy System</SectionTitle>
        <div style={{ background: P.rose, borderRadius: 8, padding: "12px 14px",
          marginBottom: 12 }}>
          <strong style={{ color: P.rust }}>The only self-funding program on the site.</strong>
          <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Tipping fees + energy + carbon credits generate $2.7M/yr net after all operating costs — covers most of the other programs' annual budgets.</span>
        </div>
        {[
          { k: "Technology", v: "MSW Gasification (Phase 1). Low-oxygen thermal decomposition → syngas → electricity. Lower NOₓ/SOₓ/particulates than incineration. Handles all mixed waste types." },
          { k: "Capacity", v: "100 tons/day (Phase 1). Franklin County generates ~44,000 tons/yr — site can take ~36,500 tons/yr. Diverting ~80% of county waste from landfill." },
          { k: "Construction Phase", v: "Unit processes demolition debris during 18-month build. ~1,000 tons diverted from landfill before site even opens." },
          { k: "Tipping Fee Revenue", v: "$45–75/ton (NC average). 100 tons/day × $55 avg × 365 = ~$2M/yr gate revenue alone." },
          { k: "Energy Output", v: "2–3 MW continuous. Feeds data center BESS and community zone. Estimated $1.1M/yr avoided energy cost." },
          { k: "Carbon Credits", v: "Each ton diverted from landfill prevents ~0.5 tons methane CO₂e. 36,500 tons/yr × 0.5 × $25/ton = ~$456K/yr." },
          { k: "Ash Output", v: "5–10% residual ash by weight. Tested, treated, used as road base aggregate. Zero landfill disposal." },
        ].map(r => <Kv key={r.k} {...r} accent={P.rust} />)}
        <div style={{ display: "grid", borderRadius: 8, overflow: "hidden",
          border: `1px solid ${P.rule}`, marginTop: 12 }}>
          {[
            { label: "Build cost (Phase 1 gasification unit)", cost: "$12.2M" },
            { label: "Annual operating cost", cost: "$999K/yr" },
            { label: "Revenue: Tipping fees", cost: "+$2.0M/yr", positive: true },
            { label: "Revenue: Energy avoided/sold", cost: "+$1.1M/yr", positive: true },
            { label: "Revenue: Carbon credits", cost: "+$456K/yr", positive: true },
            { label: "NET ANNUAL REVENUE", cost: "+$2.56M/yr ✅", positive: true, total: true },
          ].map((r, i) => <CostRow key={i} {...r} />)}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: COMMUNITY
// ══════════════════════════════════════════════════════════════════════════════
function CommunityTab() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card accent={P.gold}>
        <SectionTitle accent={P.gold}>🎉 Community Event Plaza</SectionTitle>
        {[
          { k: "Surface Design", v: "3 acres permeable interlocking pavers. Flush power pedestals (120V/240V 30A) every 30 ft. Storm drainage integrated. Dual-purpose: daily parking + event venue." },
          { k: "Stage Infrastructure", v: "Permanent 20×40 ft reinforced concrete stage pad with 400A electrical service, rigging anchor points, backstage utility room. No rental equipment needed." },
          { k: "Acoustic Wing Walls", v: "Two 12-ft permanent wing walls flanking stage. Function as acoustic reflectors for events AND sound baffles facing US-64." },
          { k: "Restroom Building", v: "Permanent 8-stall + 2 ADA + utility sink. Doubles as security office. No porta-potty rentals ever." },
          { k: "Event Access System", v: "Free online registration → QR code → scan at entry. Capacity auto-caps by event type. Aggregate data for grant reporting. No personal data sold." },
          { k: "Farm Stand (Every Saturday)", v: "8am–1pm. Greenhouse produce, fish, shrimp at below-retail pricing. No registration needed. Open to all." },
          { k: "Site Tours", v: "Free 45-min guided tours: infrasound demo, greenhouse walk-through, sound berm, community spaces. Saturday 10am & 1pm, max 25/tour. School groups Tue–Thu by request." },
          { k: "Build Cost", v: "$728,000 one-time | $46,000/yr operating" },
        ].map(r => <Kv key={r.k} {...r} accent={P.gold} />)}
      </Card>
      <Card accent={P.green}>
        <SectionTitle accent={P.green}>📅 Annual Event Calendar</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { event: "Weekly Farm Stand", freq: "Every Saturday 8am", detail: "Fresh produce + fish + shrimp. Below-retail. Public. No registration." },
            { event: "Monthly Block Party", freq: "1st Saturday/month", detail: "Free. Live music, food trucks, kids activities. Priority to Vocational Academy grad food carts." },
            { event: "Quarterly Community Fair", freq: "4× per year", detail: "1,500–2,000 attendees. Craft vendors, health screenings, career fair, live performances." },
            { event: "Annual SEED Day", freq: "Once per year", detail: "Full campus open house. Tours, demos, community awards, graduate showcases." },
            { event: "School Science Tours", freq: "Year-round Tue–Thu", detail: "K–12 groups. Infrasound demo, aquaponics lab, energy systems. Free." },
            { event: "SEED Night Market", freq: "Summer Fridays", detail: "Evening market. Greenhouse produce, prepared foods, music. Sunset to 10pm." },
          ].map(e => (
            <div key={e.event} style={{ background: "#F0FAF4", borderRadius: 8,
              padding: "12px 14px", borderLeft: `3px solid ${P.gold}` }}>
              <div style={{ fontWeight: 800, color: P.forest, fontSize: 13,
                fontFamily: "sans-serif" }}>{e.event}</div>
              <div style={{ color: P.gold, fontSize: 11, fontWeight: 700,
                fontFamily: "sans-serif", margin: "3px 0" }}>{e.freq}</div>
              <div style={{ color: P.mid, fontSize: 12, fontFamily: "sans-serif",
                lineHeight: 1.5 }}>{e.detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: VILLAGES
// ══════════════════════════════════════════════════════════════════════════════
function VillagesTab() {
  const [active, setActive] = useState("dignity");
  const villages = {
    dignity: {
      label: "🏠 Dignity Village", accent: P.forest, sub: "Homeless Re-Entry",
      stats: [
        { stat: "100", label: "tiny homes (200–400 sq ft each)" },
        { stat: "$5.7M", label: "build cost" },
        { stat: "$3.8M", label: "annual operating cost" },
        { stat: "$54K", label: "state savings per resident kept out of prison" },
      ],
      items: [
        { k: "Residents", v: "100 adults experiencing homelessness. 1 staff : 5 resident ratio." },
        { k: "Day Staff", v: "10 case managers/vocational coaches, 4 security guards, 2 clinical support, 3 maintenance, 2 admin, 3 food services = 24 FTE" },
        { k: "Night Staff", v: "2 residential monitors, 4 security guards, 1 clinical on-call = 7 FTE overnight, always awake" },
        { k: "Key Features", v: "24/7 security, vocational training pipeline, community garden plots per resident, connection to Vocational Academy, path to permanent housing" },
        { k: "New Idea", v: "Resident micro-enterprise seed fund: $500–$5,000 no-interest micro-loans for graduates starting businesses. Managed by CLT." },
        { k: "NC Context", v: "11,626 homeless in NC (2024, +19% from 2023). State has 2,536-bed shelter deficit. Dignity Village fills part of this gap with dignity-centered design." },
      ]
    },
    sanctuary: {
      label: "🧠 Sanctuary Village", accent: P.slate, sub: "Therapeutic Micro-Town",
      stats: [
        { stat: "50", label: "high-acuity mental health residents" },
        { stat: "$10M", label: "build cost (ADA + clinical spec)" },
        { stat: "$4.2M", label: "annual operating cost" },
        { stat: "$80K", label: "state savings per hospitalization prevented" },
      ],
      items: [
        { k: "Residents", v: "50 adults with serious mental illness (SMI). 1 staff : 3 resident ratio required." },
        { k: "Day Staff", v: "8 LCSWs/therapists, 9 psychiatric techs, 1 psychiatrist (PT), 2 NPs, 4 security, 2 OTs, 3 recreation staff, 4 food services, 2 facilities, 2 admin = 37 FTE" },
        { k: "Night Staff", v: "5 psychiatric technicians (awake), 4 security guards = 9 FTE overnight, always awake" },
        { k: "Amenities", v: "Grocery, diner, bowling alley, fitness cage, VR exergame studio, hydroponic garden therapy, park, sensory rest rooms" },
        { k: "Design Standard", v: "All rooms designed by occupational therapists for therapeutic light, texture, and acoustic comfort. No fluorescent lighting." },
        { k: "Secure Access", v: "Air-lock mantrap entry. Geofence monitoring bracelets for community safety. All glass: laminated sound-dampening." },
        { k: "NC Context", v: "356,000 NC adults live with serious mental illness. Only 45% receive any care. 1 in 7 homeless NC residents have SMI. Sanctuary Village is not a warehouse — it's a life." },
      ]
    },
    reentry: {
      label: "🔑 Re-Entry City", accent: P.gold, sub: "Recidivism Reduction Campus (Long-Term Vision)",
      stats: [
        { stat: "200–1,000", label: "beds (phased, start with 200)" },
        { stat: "$18M", label: "200-bed pilot build cost" },
        { stat: "$6.5M", label: "annual operating (200 beds)" },
        { stat: "$4.3M", label: "annual state savings at 40% success rate" },
      ],
      items: [
        { k: "Concept", v: "Purpose-built re-entry campus for people recently released from incarceration. Private rooms or pod dorms, vocational labs, counseling, employment services, substance use treatment." },
        { k: "NC Need", v: "18,000 people released from NC prisons per year. Recidivism rate 40–49%. At $54,000/yr to incarcerate, this costs NC ~$400M+/year." },
        { k: "Day Staff (200 beds)", v: "20 case managers/coaches, 8 vocational instructors, 6 substance use counselors, 4 mental health counselors, 8 security, 3 medical, 4 employment specialists, 6 food, 4 facilities, 4 admin = 67 FTE" },
        { k: "Night Staff", v: "6 residential monitors, 8 security guards = 14 FTE overnight, always awake" },
        { k: "Vocational Connection", v: "Re-entry residents get priority enrollment in SEED Vocational Academy. Direct hiring pipeline to data center, greenhouse, WtE, security, and maintenance roles." },
        { k: "Funding Pathway", v: "DOJ Second Chance Act grants, HHS Medicaid reentry waiver (new 2023 rule), Social Impact Bonds (state repays investors from verified recidivism savings), NC Reentry 2030 strategic funds." },
        { k: "Feasibility Note", v: "This is the most ambitious piece. Pilot with 200 beds on adjacent land purchase. If the 40% success rate holds, the math makes it self-justifying to the state in 3–5 years." },
      ]
    }
  };
  const v = villages[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(villages).map(([id, vv]) => (
          <button key={id} onClick={() => setActive(id)} style={{
            flex: 1, minWidth: 160, padding: "12px 16px", borderRadius: 10,
            border: `2px solid ${active === id ? vv.accent : P.rule}`,
            background: active === id ? vv.accent : P.white,
            color: active === id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {vv.label}<br />
            <span style={{ fontSize: 11, opacity: 0.8 }}>{vv.sub}</span>
          </button>
        ))}
      </div>
      <Card accent={v.accent}>
        <SectionTitle accent={v.accent}>{v.label} — {v.sub}</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {v.stats.map(s => <StatBox key={s.label} stat={s.stat} label={s.label} color={v.accent} />)}
        </div>
        {v.items.map(r => <Kv key={r.k} {...r} accent={v.accent} />)}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: CAPITAL
// ══════════════════════════════════════════════════════════════════════════════
function CapitalTab() {
  const sections = [
    {
      title: "🌿 Environmental & Site", accent: P.green,
      rows: [
        { label: "MLV Perimeter Fencing + Berms (all layers)", cost: "$1,400,000" },
        { label: "Roof Acoustic Panels (all buildings)", cost: "$380,000" },
        { label: "Infrasound Monitoring Network (12 sensors)", cost: "$196,000" },
        { label: "Air Quality Sensor Network (12 sensors)", cost: "$145,000" },
        { label: "Window Rebate Fund (100 homes, 0.5 mi radius)", cost: "$200,000" },
        { label: "Stormwater: Bioswales, permeable paving, ponds", cost: "$1,200,000" },
        { label: "5,000 native trees on-site", cost: "$375,000" },
        { label: "50,000 trees off-site reforestation partnership", cost: "$500,000" },
        { label: "Wildlife habitat design + bird-safe glass", cost: "$180,000" },
        { label: "Carbon-sequestering interior materials (desks, panels, cabinets)", cost: "$850,000" },
        { label: "Green walls on turbine enclosures", cost: "$120,000" },
      ]
    },
    {
      title: "🥬 Food, Water & Aquaponics", accent: P.sage,
      rows: [
        { label: "4 Greenhouse structures (commercial steel + poly)", cost: "$1,200,000" },
        { label: "Hydroponic systems (NFT, DWC, Dutch bucket)", cost: "$380,000" },
        { label: "Aquaponics RAS system (fish + shrimp)", cost: "$420,000" },
        { label: "Marine showcase tank + plankton lab", cost: "$85,000" },
        { label: "Waste-heat exchange plumbing + distribution", cost: "$280,000" },
        { label: "Supplemental LED grow lighting", cost: "$160,000" },
        { label: "500,000-gal water cistern + treatment system", cost: "$180,000" },
        { label: "Wash-pack + cold storage + farm stand building", cost: "$220,000" },
        { label: "Climate control automation + sensors", cost: "$140,000" },
      ]
    },
    {
      title: "⚡ Energy & Waste", accent: P.gold,
      rows: [
        { label: "Rooftop solar (~40 MW, bifacial)", cost: "$36,000,000" },
        { label: "Carport solar (~10 MW)", cost: "$8,000,000" },
        { label: "Ground-mount agrivoltaic array (~15 MW)", cost: "$9,000,000" },
        { label: "BESS (8-hr community zone storage)", cost: "$4,500,000" },
        { label: "WtE Gasification Unit (100 tons/day)", cost: "$8,000,000" },
        { label: "WtE sorting facility + receiving building", cost: "$1,800,000" },
        { label: "WtE emissions control + odor system", cost: "$580,000" },
        { label: "Haul road + truck turnaround", cost: "$340,000" },
      ]
    },
    {
      title: "🎉 Community Infrastructure", accent: P.gold,
      rows: [
        { label: "Event Plaza (permeable paving + power grid)", cost: "$420,000" },
        { label: "Stage pad + electrical + anchor points", cost: "$85,000" },
        { label: "Permanent restroom building (ADA)", cost: "$145,000" },
        { label: "Acoustic wing walls", cost: "$38,000" },
        { label: "Hydration stations + Wi-Fi kiosks", cost: "$40,000" },
        { label: "Visitor management system (software + hardware)", cost: "$18,000" },
        { label: "Solar LED streetlights (150 poles)", cost: "$2,100,000" },
        { label: "ADA sidewalks + RRFB beacons (3 miles)", cost: "$1,400,000" },
        { label: "Smart traffic signals (8 intersections)", cost: "$900,000" },
        { label: "Public Wi-Fi mesh (150 nodes)", cost: "$1,200,000" },
      ]
    },
    {
      title: "🏘️ Villages (Pilot Scale)", accent: P.forest,
      rows: [
        { label: "Dignity Village (100 tiny homes + staff housing)", cost: "$5,700,000" },
        { label: "Sanctuary Village (50 residents, clinical spec)", cost: "$10,000,000" },
        { label: "Vocational Academy (classrooms + labs)", cost: "$900,000" },
        { label: "Security + perimeter tech (cameras, mantrap, geofence)", cost: "$600,000" },
        { label: "Recreation hub (gym, VR, bowling)", cost: "$1,200,000" },
      ]
    },
  ];

  const annualRows = [
    { label: "Village Operations (Dignity + Sanctuary + Vocational)", cost: "$8,000,000" },
    { label: "Greenhouse + Aquaponics Operations", cost: "$500,000" },
    { label: "WtE Operations", cost: "$999,000" },
    { label: "Community + Events + Plaza", cost: "$150,000" },
    { label: "Environmental Monitoring + Compliance", cost: "$250,000" },
    { label: "Security (all zones, 24/7)", cost: "$1,200,000" },
    { label: "Tree maintenance + landscaping", cost: "$180,000" },
    { label: "TOTAL ANNUAL OPEX", cost: "$11,279,000", total: true },
    { label: "WtE Net Revenue", cost: "-$2,560,000", positive: true },
    { label: "Greenhouse Sales + Fish/Shrimp", cost: "-$560,000", positive: true },
    { label: "5% DC Revenue Endowment (est)", cost: "-$5,000,000+", positive: true },
    { label: "NET COMMUNITY COST (after revenue)", cost: "~$3.2M/yr", total: true },
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {sections.map(s => (
        <Card key={s.title} accent={s.accent}>
          <SectionTitle accent={s.accent}>{s.title}</SectionTitle>
          <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}` }}>
            {s.rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between",
                padding: "8px 12px", background: i % 2 === 0 ? "#fafafa" : P.white,
                borderBottom: `1px solid ${P.rule}`, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}>{r.label}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13,
                  color: s.accent }}>{r.cost}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Card accent={P.forest}>
        <SectionTitle accent={P.forest}>📊 Annual Operating Summary</SectionTitle>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}` }}>
          {annualRows.map((r, i) => <CostRow key={i} {...r} />)}
        </div>
        <div style={{ marginTop: 12, background: "#F0FAF4", borderRadius: 8,
          padding: "12px 14px", fontSize: 13, color: P.ink, fontFamily: "sans-serif",
          lineHeight: 1.7 }}>
          <strong style={{ color: P.forest }}>Bottom line:</strong> The WtE system and DC revenue endowment together cover ~75% of all community operating costs. The remaining ~$3.2M/yr is covered by federal grants, impact bonds, and state reentry savings — sources that are actively available and documented in the funding tab.
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: OFF-SITE COMMUNITY INVESTMENT
// ══════════════════════════════════════════════════════════════════════════════
const OFFSITE_SECTIONS = [
  { id: "infra",  icon: "🏗️", label: "Infrastructure" },
  { id: "ro",     icon: "💧", label: "Water Treatment" },
  { id: "solar",  icon: "☀️", label: "Solar + Storage" },
  { id: "rent",   icon: "🏠", label: "Rent Stabilization" },
  { id: "costs",  icon: "💰", label: "Full Cost Summary" },
];

function OKv({ k, v, accent = P.slate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 8,
      padding: "7px 0", borderBottom: `1px solid ${P.rule}`, alignItems: "start" }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: accent, fontFamily: "sans-serif", lineHeight: 1.4 }}>{k}</span>
      <span style={{ fontSize: 13, color: P.ink, lineHeight: 1.6, fontFamily: "sans-serif" }}>{v}</span>
    </div>
  );
}
function OCostLine({ label, cost, sub, positive, total, accent = P.forest }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 14px",
      background: total ? `${accent}14` : (positive ? "#F0FAF4" : (label?.startsWith("—") ? "#fafafa" : P.white)),
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

function OffsiteInfra() {
  return (
    <div>
      <Card accent={P.slate}>
        <SectionTitle accent={P.slate}>⚡ Underground Utility Lines</SectionTitle>
        <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.slate}` }}>
          Overhead lines fail in storms and blight neighborhoods. Underground distribution lines cost <strong>$1–2M/mile in rural/suburban NC</strong> but last 30–35 years with 97% fewer storm outages. FEMA's HMGP program covers up to 75% of undergrounding cost in hazard-mitigation eligible areas — meaning SEED's net cost on a $15M project is under $4M.
        </div>
        <OKv k="Target Area" v="All overhead distribution lines within 2-mile radius. Estimate: 8–12 miles of residential feeder lines along the US-64 corridor." accent={P.slate} />
        <OKv k="Technology" v="Open trenching for residential streets (lower cost). Micro-trenching for paved sections ($6–10/ft vs $25+/ft full trench). All new conduit sized for future fiber broadband pull-through." accent={P.slate} />
        <OKv k="Cost Estimate" v="$1.5M/mile × 10 miles = $15M total. FEMA HMGP grant (75%) = $11.25M covered. SEED contribution: ~$3.75M." accent={P.slate} />
        <OKv k="Community Benefit" v="97% fewer storm outages. No downed lines in hurricanes. Improved aesthetics raises property values. Bonus fiber conduit enables public broadband expansion." accent={P.slate} />
        <OKv k="Funding" v="FEMA Hazard Mitigation Grant Program (75%), USDA ReConnect (rural broadband piggyback), Duke Energy maintenance savings partnership." accent={P.slate} />
      </Card>
      <Card accent={P.gold}>
        <SectionTitle accent={P.gold}>🚦 Smart Traffic Signal Network</SectionTitle>
        <OKv k="Technology" v="Adaptive Traffic Signal Control (ATSC): radar + video analytics sensors at every approach. Real-time vehicle/bike/pedestrian counting. Signal timing auto-adjusts every cycle." accent={P.gold} />
        <OKv k="Emergency Preemption" v="All signals hard-wired for emergency vehicle preemption. Fire truck or ambulance within 0.5 miles auto-clears every light on their route. Zero delay in emergencies." accent={P.gold} />
        <OKv k="Pedestrian Upgrades" v="Every crosswalk: Rapid Flashing Beacons (RRFB) + audible pedestrian signals + countdown timers. Curb ramps rebuilt to ADA 2024 standard." accent={P.gold} />
        <OKv k="Target" v="Phase 1: 20 intersections within 3-mile priority zone. Phase 2: 40 intersections across broader community area." accent={P.gold} />
        <OKv k="Cost" v="$120,000–$180,000 per full intersection. 20 intersections = $2.4–$3.6M. Annual software/maintenance: $80K/yr." accent={P.gold} />
        <OKv k="Funding" v="USDOT RAISE Grant, FHWA Signal Timing Improvement Program, NC DOT Safety Program funds." accent={P.gold} />
      </Card>
      <Card accent={P.green}>
        <SectionTitle accent={P.green}>🚶 ADA Sidewalk Network — Miles of Connectivity</SectionTitle>
        <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          <strong style={{ color: P.forest }}>Core idea:</strong> Low and medium income housing areas in rural NC typically have <em>zero</em> sidewalk access. Workers walk in road shoulders to reach bus stops and jobs. This is dangerous, dignity-destroying, and completely solvable.
        </div>
        <OKv k="Priority Routes" v="1. Housing to nearest bus stop (every route within 2 miles). 2. Housing to grocery store. 3. Housing to SEED campus (direct pedestrian access). 4. School routes K–12." accent={P.green} />
        <OKv k="Standard" v="5-ft minimum ADA compliant concrete. Detectable warning strips at all curb cuts. 30-year lifespan vs. 10 years for asphalt." accent={P.green} />
        <OKv k="Cost per mile" v="$150,000–$250,000/mile (ADA-compliant, 5-ft wide, curb ramps, detectable warnings). Budgeted at $200K/mile." accent={P.green} />
        <OKv k="Phase 1" v="15 priority miles × $200K = $3,000,000" accent={P.green} />
        <OKv k="Full Build" v="40 miles × $200K = $8,000,000 (over 3–5 years)" accent={P.green} />
        <OKv k="Funding" v="USDOT Safe Streets & Roads for All (SS4A, up to $25M/project), HUD CDBG, NC DOT Transportation Alternatives Set-Aside (TASA), ADA compliance grants." accent={P.green} />
      </Card>
      <Card accent={P.sage}>
        <SectionTitle accent={P.sage}>🌳 Street Tree Canopy Program</SectionTitle>
        <OKv k="Goal" v="1 tree per 30 linear feet of new sidewalk corridor = ~7,000 trees across 40 miles. Phase 1 (priority corridors): 2,500 trees." accent={P.sage} />
        <OKv k="NC Native Species" v="Willow Oak, Sweetgum, American Elm (disease-resistant cultivar), Eastern Redbud, Serviceberry. All sourced from NC nurseries." accent={P.sage} />
        <OKv k="Documented Benefits" v="Street temp -5 to -8°F under canopy. ~48 lbs CO₂/tree/yr sequestered. Mature tree captures 1,000+ gal rain/yr (stormwater). Property value +5–15% per USDA Forest Service." accent={P.sage} />
        <OKv k="Cost" v="$400–$600/tree installed (3-inch caliper B&B, street grate, irrigation bag). Phase 1: 2,500 trees = ~$1,500,000. Full 7,000 trees = ~$3,500,000." accent={P.sage} />
        <OKv k="Funding" v="USDA Urban and Community Forestry Grant, USDA ReLeaf Program, NC Forest Service community tree programs." accent={P.sage} />
      </Card>
      <Card accent={P.sky}>
        <SectionTitle accent={P.sky}>💡 Solar-Powered LED Street Lighting</SectionTitle>
        <OKv k="Concept" v="Off-grid solar LED units replacing all existing streetlights in target area. Runs on LiFePO4 battery through 3+ cloudy days. Zero utility bill forever. Resilient during grid outages." accent={P.sky} />
        <OKv k="Spec" v="80–120W monocrystalline panel + LiFePO4 battery (2–3 day autonomy) + 30–50W LED fixture (2700K warm spectrum, full cutoff). Motion dimming 11pm–5am saves battery." accent={P.sky} />
        <OKv k="Coverage" v="300 new poles in unlit residential streets + 150 replacement poles on priority pedestrian routes = 450 total units." accent={P.sky} />
        <OKv k="Cost" v="$8,000–$14,000/unit all-in. 450 units × $10,000 avg = $4,500,000. Annual savings vs. grid: $40,500/yr perpetual to municipality." accent={P.sky} />
        <OKv k="Funding" v="EPA Solar for All, USDA REAP (Rural Energy for America Program), NC Clean Energy Technology Center grants, DOE IIJA Community Benefits funds." accent={P.sky} />
      </Card>
    </div>
  );
}

function OffsiteRO() {
  return (
    <Card accent={P.sky}>
      <SectionTitle accent={P.sky}>💧 Community Reverse Osmosis Water Treatment Plant</SectionTitle>
      <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 14, borderLeft: `3px solid ${P.sky}` }}>
        Many rural low-income households in Franklin County have no municipal water access, or receive water with elevated contaminants — nitrates from agriculture, PFAS from industrial sites, iron/manganese from geology. An on-site RO plant delivers clean, remineralized drinking water and acts as a community resilience node during emergencies.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        {[
          { stat: "99%+", label: "PFAS removal" },
          { stat: "95%+", label: "nitrate + heavy metal removal" },
          { stat: "0.5 MGD", label: "capacity (500K gal/day)" },
          { stat: "~5,000", label: "people served daily" },
        ].map(s => <StatBox key={s.label} stat={s.stat} label={s.label} color={P.sky} />)}
      </div>
      <OKv k="System Design" v="Pre-filtration (sediment + activated carbon) → RO membrane array → UV disinfection → Remineralization (calcium/magnesium add-back) → Distribution. All stages continuously monitored on public dashboard." accent={P.sky} />
      <OKv k="Power" v="~2,000 kWh/day for 0.5 MGD. Powered entirely by on-site BESS + solar. Zero grid draw for water treatment." accent={P.sky} />
      <OKv k="Brine Disposal" v="~30% reject water treated through brine concentrator, then residual handled by WtE evaporation process. Zero discharge to waterways." accent={P.sky} />
      <OKv k="Community Kiosks" v="8 water dispensing kiosks in low-income housing areas. Clean water at $0.01–$0.02/gallon. Eliminates bottled water dependency for families." accent={P.sky} />
      <OKv k="Emergency Role" v="BESS keeps plant running during grid outages. SEED becomes the community's backup water supply — a disaster resilience node." accent={P.sky} />
      <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}`, marginTop: 12 }}>
        {[
          { label: "RO membrane array + high-pressure pumps", cost: "$800,000" },
          { label: "Pre-treatment (sediment, carbon, softening)", cost: "$280,000" },
          { label: "UV disinfection + remineralization", cost: "$120,000" },
          { label: "Brine concentrator", cost: "$180,000" },
          { label: "Storage tanks (500K gal treated + 200K raw)", cost: "$320,000" },
          { label: "Building, piping, electrical, controls", cost: "$400,000" },
          { label: "8 community water kiosks + distribution network", cost: "$240,000" },
          { label: "TOTAL CAPITAL", cost: "$2,340,000", total: true },
          { label: "Annual operating (2 FTE, membranes, chemicals)", cost: "$185,000/yr" },
          { label: "Revenue: community kiosk water sales", cost: "+$75,000/yr", positive: true },
          { label: "Net annual cost", cost: "$110,000/yr", total: true },
        ].map((r, i) => <OCostLine key={i} {...r} accent={P.sky} />)}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: P.mid, fontFamily: "sans-serif", lineHeight: 1.7, background: P.mist, borderRadius: 6, padding: "10px 12px" }}>
        <strong style={{ color: P.sky }}>Funding:</strong> EPA WIFIA low-interest loans, USDA Rural Water/Wastewater grants, NC Rural Infrastructure Authority, EPA PFAS remediation grants.
      </div>
    </Card>
  );
}

function OffsiteSolar() {
  return (
    <div>
      <Card accent={P.gold}>
        <SectionTitle accent={P.gold}>🏡 Subsidized Solar + Battery for Low-Income Homes</SectionTitle>
        <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.gold}` }}>
          <strong style={{ color: P.gold }}>The Program:</strong> SEED approaches single-family homes and small residential buildings in low/medium income neighborhoods within 3 miles. A fully subsidized rooftop solar + battery installation — $0 upfront to the homeowner. Federal programs cover 30–40% through tax credits; SEED's revenue endowment covers the gap. 30–50% lower electricity bills with no out-of-pocket cost.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {[{ stat: "30%", label: "Federal ITC covers install" }, { stat: "$0", label: "upfront to homeowner" }, { stat: "30–50%", label: "electricity bill reduction" }, { stat: "300", label: "target homes Phase 1" }].map(s => <StatBox key={s.label} stat={s.stat} label={s.label} color={P.gold} />)}
        </div>
        <OKv k="Ownership Model" v="SEED-sponsored Community Solar LLC owns systems. Homeowners get PPA at 20% below utility rate. After 10 years, system transfers to homeowner free and clear." accent={P.gold} />
        <OKv k="Battery Purpose" v="Backup power during outages (critical for elderly, medical equipment). Stores solar surplus for evening use. Reduces grid draw during peak rate hours. Bidirectional — can export to grid for additional savings." accent={P.gold} />
        <OKv k="Aggregated Impact" v="300 homes × 5kW avg = 1.5 MW community solar. ~876 MWh/yr generated. ~700 tons CO₂/yr offset. Grid stability improvement during peak demand." accent={P.gold} />
        <OKv k="Funding" v="IRS ITC (30%), USDA REAP (25% grant), EPA Solar for All (low-income solar initiative), NC net metering rules, DOE Low-Income Solar Program." accent={P.gold} />
        <OKv k="Phase 1 Cost" v="300 homes × avg $17,500/system = $5,250,000. ITC + REAP recovers ~$2.6–$3.7M. Net SEED: ~$1.55–$2.65M." accent={P.gold} />
      </Card>
      <Card accent={P.forest}>
        <SectionTitle accent={P.forest}>🏢 Apartment Complex Solar Partnership</SectionTitle>
        <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.forest}` }}>
          <strong style={{ color: P.forest }}>The Deal:</strong> SEED approaches apartment complexes near the campus. We help get solar on your building — reducing common area utility costs — in exchange for a 3-year rent stabilization covenant (max 2.5%/yr increase). During those 3 years, SEED delivers community infrastructure upgrades that raise your property value. You come out ahead financially. Your tenants get stability and lower bills.
        </div>
        <OKv k="What SEED Provides" v="Solar system design, permit coordination, install management, ITC tax credit optimization, virtual net metering enrollment. Free to property owner — financed through ITC + grants." accent={P.forest} />
        <OKv k="Complex Savings" v="Common area power (hallways, laundry, office, exterior lights) covered by solar — saves $800–$2,000/month on a typical 50-unit complex. Remaining surplus split equally among tenants via VNM." accent={P.forest} />
        <OKv k="3-Year Rent Cap Terms" v="Max 2.5%/yr increase (vs. typical 5–8% market). Tied to CPI. Covenant recorded on property title. Releases automatically Year 4 with optional renewal." accent={P.forest} />
        <OKv k="NC Legal Note" v="NC Gen Stat § 42-14.1 prohibits government-imposed rent control. This covenant is VOLUNTARY and PRIVATE — property owners opt in. Fully legal. No conflict with state law." accent={P.forest} />
        <OKv k="Property Value Math" v="USDA: each street tree adds $1,000–$10,000 to adjacent property value. Sidewalk + lighting + water quality improvements = documented 5–15% property value increase. Owner's equity rises while rent is capped — net positive for owner." accent={P.forest} />
        <OKv k="Phase 1 Target" v="10 apartment complexes, avg 40 units = 400 apartments. Phase 2: 30 complexes = 1,200+ units." accent={P.forest} />
        <OKv k="Phase 1 Cost" v="10 complexes × avg $153,000/system = $1,530,000. ITC + REAP recovers ~$841,500. Net SEED: ~$688,500." accent={P.forest} />
      </Card>
    </div>
  );
}

function OffsiteRent() {
  return (
    <Card accent={P.rust}>
      <SectionTitle accent={P.rust}>🏠 Rent Stabilization + Property Value Covenant</SectionTitle>
      <div style={{ background: P.rose, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.rust}` }}>
        <strong style={{ color: P.rust }}>The Gentrification Paradox:</strong> Major infrastructure investments (new roads, lights, parks, sidewalks) raise property values — which raises rents — which displaces the low-income residents the investment was meant to help. SEED breaks this cycle with a voluntary private covenant: a contractual rent cap in exchange for real, quantifiable property improvements.
      </div>
      <OKv k="Mechanism" v="Property owner signs a 3-year deed-recorded covenant: rent increases capped at 2.5%/yr max. In exchange, SEED guarantees specific infrastructure upgrades within 0.5 miles of the property during the covenant period." accent={P.rust} />
      <OKv k="What Owners Get" v="Solar installation (free). Adjacent street/sidewalk/tree/water upgrades raise property value 5–15% over 3 years, building owner equity. Stable tenants stay longer. Tax credit eligibility for solar." accent={P.rust} />
      <OKv k="What Tenants Get" v="Rent stability. Lower utility bills (solar VNM credits). Better walkability and lighting. Cleaner water. Safe sidewalk access to jobs. No displacement for at least 3 years." accent={P.rust} />
      <OKv k="NC Legal Context" v="NC prohibits municipal rent control — this covenant is VOLUNTARY and PRIVATE. Property owners opt in freely. Recorded on title. Releases at year 4 automatically." accent={P.rust} />
      <OKv k="Anti-Displacement Tracking" v="SEED monitors housing turnover in the 2-mile community zone quarterly. If displacement rises despite covenants, program expands with additional tenant protections including rental assistance bridge funds." accent={P.rust} />
      <OKv k="CLT Long-Term Play" v="SEED's Community Land Trust purchases key parcels as they come to market within 0.5 miles. CLT land = permanent affordability because land is permanently removed from the speculative market." accent={P.rust} />
      <OKv k="Phase 1 Target" v="20 properties (~200 units). Phase 2: 50 properties (~500 units)." accent={P.rust} />
      <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginTop: 12 }}>
        <div style={{ fontWeight: 800, color: P.gold, fontFamily: "sans-serif", marginBottom: 8 }}>📊 The Math for a Property Owner (per unit)</div>
        {[
          ["Current avg rent (Franklin County 2-bed)", "$900/mo"],
          ["3-yr cap scenario (2.5%/yr)", "$900 → $923 → $946 → $970"],
          ["Without covenant (5%/yr typical)", "$900 → $945 → $992 → $1,042"],
          ["Foregone rent increase over 3 yrs", "~$72/unit/yr"],
          ["Solar utility savings (common areas)", "$150–200/mo per complex"],
          ["Property value increase (est.)", "+5–15% on asset value"],
          ["Net outcome for owner", "Strongly positive — solar + equity > foregone rent"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${P.rule}` }}>
            <span style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink }}>{k}</span>
            <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: P.forest }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OffsiteCosts() {
  const programs = [
    { name: "Underground Utility Lines (10 miles)", icon: "⚡", accent: P.slate, capex: "$15,000,000", funded: "$11,250,000 (FEMA 75%)", net: "~$3,750,000", opex: "—", note: "97% fewer outages. Property values +5–10%." },
    { name: "Smart Traffic Signals (20 intersections)", icon: "🚦", accent: P.gold, capex: "$3,000,000", funded: "$1,500,000–$2,250,000 (USDOT/FHWA)", net: "$750K–$1.5M", opex: "$80,000/yr", note: "Emergency preemption, pedestrian safety, real-time traffic data." },
    { name: "ADA Sidewalks (15 miles, Phase 1)", icon: "🚶", accent: P.green, capex: "$3,000,000", funded: "$1.5M–$2.1M (SS4A/CDBG)", net: "$900K–$1.5M", opex: "Minimal", note: "40-mile full build = $8M. Safe routes for workers and children." },
    { name: "Street Trees (2,500 trees, Phase 1)", icon: "🌳", accent: P.sage, capex: "$1,500,000", funded: "$500K–$750K (USDA urban forestry)", net: "$750K–$1M", opex: "$60,000/yr (3-yr establishment)", note: "CO₂ sequestration, heat reduction, +5–15% property value." },
    { name: "Solar LED Street Lighting (450 poles)", icon: "💡", accent: P.sky, capex: "$4,500,000", funded: "$1.8M–$2.7M (EPA Solar for All, REAP)", net: "$1.8M–$2.7M", opex: "-$40,500/yr saved", note: "Off-grid resilience. Warm spectrum, wildlife-safe." },
    { name: "RO Water Treatment Plant (0.5 MGD)", icon: "💧", accent: P.sky, capex: "$2,340,000", funded: "$700K–$1M (EPA WIFIA/USDA rural water)", net: "$1.34M–$1.64M", opex: "$110,000/yr net", note: "Removes PFAS, nitrates, heavy metals. 5,000 people served." },
    { name: "Home Solar + Battery (300 homes)", icon: "🏡", accent: P.gold, capex: "$5,250,000", funded: "$2.6M–$3.7M (ITC + REAP)", net: "$1.55M–$2.65M", opex: "Self-sustaining", note: "$0 upfront for homeowners. 700 tons CO₂/yr offset." },
    { name: "Apartment Solar Partnership (10 complexes)", icon: "🏢", accent: P.forest, capex: "$1,530,000", funded: "$841,500 (ITC + REAP)", net: "$688,500", opex: "$25,000/yr", note: "3-yr rent cap. $420K/yr combined utility savings." },
  ];
  return (
    <div>
      <div style={{ background: P.forest, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ color: P.mint, fontSize: 11, letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 10 }}>OFF-SITE INVESTMENT PORTFOLIO — SUMMARY</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { stat: "~$36.1M", label: "Total program capital", color: P.white },
            { stat: "~$20.7M", label: "Covered by grants/tax credits (~57%)", color: P.mint },
            { stat: "~$15.4M", label: "Net SEED investment", color: P.gold },
            { stat: "5,000+", label: "Community members directly served", color: P.sage },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.stat}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {programs.map(p => (
          <div key={p.name} style={{ background: P.white, borderRadius: 10, borderLeft: `4px solid ${p.accent}`, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              <div style={{ fontWeight: 800, color: P.ink, fontSize: 14, fontFamily: "sans-serif" }}>{p.icon} {p.name}</div>
              <span style={{ background: `${p.accent}18`, color: p.accent, padding: "3px 10px", borderRadius: 10, fontSize: 11, fontFamily: "monospace", fontWeight: 800 }}>{p.capex}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 6 }}>
              {[["Grants/Credits Available", p.funded], ["Net SEED Cost", p.net], ["Annual OpEx", p.opex], ["Impact", p.note]].map(([k, v]) => (
                <div key={k} style={{ fontSize: 12, fontFamily: "sans-serif" }}>
                  <span style={{ color: P.mid }}>{k}: </span>
                  <span style={{ color: P.ink, fontWeight: k === "Net SEED Cost" ? 700 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Card accent={P.gold} style={{ background: P.amber }}>
        <SectionTitle accent={P.gold}>🏦 Key Funding Programs</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            ["FEMA HMGP", "75% of undergrounding cost in eligible areas"],
            ["USDOT SS4A Grant", "Up to $25M for safe streets / sidewalk programs"],
            ["EPA Solar for All", "Low-income solar installation subsidies"],
            ["USDA REAP", "Up to 25% grant for rural solar/energy projects"],
            ["IRS Investment Tax Credit", "30% of solar install cost as federal tax credit"],
            ["EPA WIFIA Loans", "Low-interest water infrastructure financing"],
            ["HUD CDBG", "Community development block grants for infrastructure"],
            ["USDA Urban Forestry", "Grants for street tree planting programs"],
          ].map(([name, desc]) => (
            <div key={name} style={{ background: P.white, borderRadius: 6, padding: "8px 10px", borderLeft: `3px solid ${P.gold}` }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: P.gold, fontFamily: "sans-serif" }}>{name}</div>
              <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif", marginTop: 2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card accent={P.forest} style={{ marginTop: 12 }}>
        <SectionTitle accent={P.forest}>📊 Annual Operating Cost Summary — All Off-Site Programs</SectionTitle>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}`, marginBottom: 12 }}>
          {[
            { label: "Smart signal O&M (20 intersections)", cost: "$80,000/yr", note: "Software licenses, sensor calibration, maintenance" },
            { label: "Solar LED pole O&M (450 poles)", cost: "$40,500/yr saved", note: "Eliminates utility bill permanently — net negative cost", positive: true },
            { label: "Street tree establishment care (Yrs 1–3)", cost: "$60,000/yr", note: "Watering, mulching, replacement — drops to ~$20K after Year 3" },
            { label: "RO plant operations (2 FTE + chemicals)", cost: "$110,000/yr net", note: "After $75K/yr kiosk water sales revenue" },
            { label: "Home solar monitoring + maintenance (300 homes)", cost: "Self-sustaining", note: "PPA revenue covers O&M — no SEED outlay after install" },
            { label: "Apartment solar monitoring (10 complexes)", cost: "$25,000/yr", note: "Annual O&M contract across all 10 complexes" },
            { label: "Audit platform (rent covenant portal)", cost: "$4,800/yr", note: "Software subscription + county admin overhead" },
            { label: "Childcare program (10,000 seats @ $3/day)", cost: "$11,000,000/yr", note: "Funded by DC profit share. Returns $35–55M/yr in new taxable income." },
            { label: "Intermodal port O&M (after construction)", cost: "$420,000/yr", note: "Offset by $250K/yr fuel savings + tipping revenue from terminal ops" },
            { label: "TOTAL ANNUAL OFF-SITE OPEX", cost: "~$11.7M/yr", note: "Dominated by childcare — which pays back 3–5× in tax revenue", total: true },
            { label: "Revenue offsets (kiosks + solar savings + port)", cost: "−$366,000/yr", note: "Self-generated revenue reducing net cost", positive: true },
            { label: "Childcare tax revenue return (est.)", cost: "−$35M to −$55M/yr", note: "New taxable income unlocked by parent workforce re-entry", positive: true },
            { label: "NET ANNUAL COMMUNITY BENEFIT", cost: "Strongly positive", note: "Programs cost ~$11.7M/yr, generate $35–55M/yr in economic return", total: true },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "9px 14px", borderBottom: `1px solid ${P.rule}`,
              background: r.total ? `${P.forest}10` : (r.positive ? "#F0FAF4" : (i % 2 === 0 ? "#fafafa" : P.white))
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: r.total ? 800 : 400, color: P.ink }}>{r.label}</div>
                <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif", marginTop: 2 }}>{r.note}</div>
              </div>
              <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", marginLeft: 16,
                color: r.positive ? P.green : (r.total ? P.forest : P.ink) }}>{r.cost}</span>
            </div>
          ))}
        </div>
        <div style={{ background: P.amber, borderRadius: 8, padding: "12px 14px", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.7, color: P.ink }}>
          <strong style={{ color: P.gold }}>The real story:</strong> Strip out the childcare program and all other off-site programs combined cost <strong>~$700K/yr net</strong> after self-generated revenue — less than 0.005% of the $1B community investment pool. The childcare program at $11M/yr is the largest line item, and it returns <strong>3–5× in municipal tax revenue</strong> within 3–5 years. Every dollar spent off-site is a community investment with a documented return.
        </div>
      </Card>
    </div>
  );
}

function OffsiteTab({ offSec, setOffSec }) {
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${P.slate} 0%, #0D2040 60%, ${P.forest} 100%)`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: P.mint, letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>OFF-SITE COMMUNITY INVESTMENT</div>
        <div style={{ fontSize: 20, color: P.white, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>🏙️ Beyond the Fence Line</div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 14px", fontStyle: "italic", fontFamily: "sans-serif", lineHeight: 1.6 }}>Infrastructure upgrades, clean water, solar power, and rent protection for the neighborhoods that neighbor us — fully costed with real funding sources.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["~$36M Total", "~57% Grant Funded", "~$15.4M Net Cost", "40 Miles Sidewalk", "5,000+ People Served"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: P.mint, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {OFFSITE_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setOffSec(s.id)} style={{
            flex: 1, minWidth: 120, padding: "9px 12px", borderRadius: 22,
            border: `2px solid ${offSec === s.id ? P.slate : P.rule}`,
            background: offSec === s.id ? P.slate : P.white,
            color: offSec === s.id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      {offSec === "infra" && <OffsiteInfra />}
      {offSec === "ro"    && <OffsiteRO />}
      {offSec === "solar" && <OffsiteSolar />}
      {offSec === "rent"  && <OffsiteRent />}
      {offSec === "costs" && <OffsiteCosts />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: POLICY & POLITICS
// ══════════════════════════════════════════════════════════════════════════════
const POL_SECTIONS = [
  { id: "rent",    icon: "🏠", label: "Rent Policy" },
  { id: "tax",     icon: "🏛️", label: "Tax Relief" },
  { id: "housing", icon: "🏘️", label: "Housing Tools" },
  { id: "jobs",    icon: "💼", label: "Jobs & Wages" },
  { id: "supply",  icon: "🚛", label: "Supply Chain" },
  { id: "numbers", icon: "📊", label: "Financial Model" },
];

function PoliticsTab({ polSec, setPolSec }) {
  const accent = P.slate;
  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #0D2040 0%, ${P.slate} 60%, ${P.forest} 100%)`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: P.mint, letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>POLICY & POLITICAL STRATEGY</div>
        <div style={{ fontSize: 20, color: P.white, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>🏛️ How to Win the Community — and Keep It</div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 14px", fontStyle: "italic", fontFamily: "sans-serif", lineHeight: 1.6 }}>Dynamic rent caps · Property-tax circuit breakers · Community Land Trust · Supply chain modernization · Automation-proof jobs · Childcare infrastructure</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Why 2.5% Rent Cap Fails", "Dynamic 5%+CPI Model", "Circuit-Breaker Tax Deferment", "$11M Childcare Program", "Intermodal Inland Port", "$1B Community Pledge"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: P.mint, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {POL_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setPolSec(s.id)} style={{
            flex: 1, minWidth: 100, padding: "9px 12px", borderRadius: 22,
            border: `2px solid ${polSec === s.id ? accent : P.rule}`,
            background: polSec === s.id ? accent : P.white,
            color: polSec === s.id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* RENT POLICY */}
      {polSec === "rent" && (
        <div>
          <Card accent={P.rust}>
            <SectionTitle accent={P.rust}>⚠️ Why a Flat 2.5% Rent Cap Fails</SectionTitle>
            <div style={{ background: P.rose, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.rust}` }}>
              A flat 2.5% rent cap sounds protective but creates perverse incentives that collapse the rental market. Operating costs — insurance (8–9%/yr), property taxes, labor, maintenance — routinely outpace 2.5%. Landlords who lose money on every unit eventually sell, convert to condos, or abandon rentals entirely, <strong>shrinking the very supply</strong> renters depend on.
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { issue: "Operating-cost inflation (insurance ≈ 8–9%/yr, taxes, labor)", effect: "Landlords lose money every year → sell, convert to condos, or abandon rentals." },
                { issue: "No profit margin → no incentive to maintain or invest", effect: "Property quality drops, vacancy rises, displacement spikes." },
                { issue: "Small 'profit' pool drives front-loading of initial rents", effect: "New units launch at inflated prices, locking out low-income renters." },
                { issue: "Result: Rental market collapse", effect: "Housing supply shrinks, state loses tax revenue, the very residents you wanted to protect get displaced." },
              ].map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, background: i % 2 === 0 ? "#fafafa" : P.white, borderRadius: 6, padding: "10px 12px", border: `1px solid ${P.rule}` }}>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", color: P.rust, fontWeight: 600 }}>{r.issue}</div>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink }}>{r.effect}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card accent={P.green} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.green}>✅ The Workable Middle Ground — Dynamic Rent Model</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>Updated SEED Position:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Replace the 2.5% flat cap with a dynamic formula: <strong>5% + local CPI, hard ceiling at 10%</strong>. This covers landlord cost inflation while protecting tenants from speculative spikes — and keeps units on the market.</span>
            </div>
            {[
              { k: "Dynamic Cap = 5% + Local CPI (max 10%)", v: "Allows rent to rise with inflation and real cost increases, but never faster than market-rate spikes. Covers landlords' expense growth while protecting tenants from extreme hikes." },
              { k: "New-Construction Exemption (15 yr)", v: "Buildings erected in the last 15 years can charge market rent. Keeps developers' financing viable — the cap only applies after debt service is largely paid down." },
              { k: "Vacancy De-Control", v: "When a unit is voluntarily vacated, the landlord may reset rent to market level. Gives landlords periodic upside to fund repairs and upgrades without penalizing current tenants." },
              { k: "Cost-Plus O&M Petition with Audit", v: "Landlords file a petition showing only verified expense changes (tax, insurance, repairs). Tenants can compel documentation. Prevents 'excess-profit' hikes while preserving a modest, justified return." },
            ].map(r => <Kv key={r.k} k={r.k} v={r.v} accent={P.green} />)}
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>🏢 SEED Apartment Partnership — Updated Terms</SectionTitle>
            <Kv k="Revised Rent Cap" v="Max 5% + local CPI per year (hard ceiling 10%) — replacing the original 2.5% flat cap. Covenant still recorded on property title for 3 years." accent={P.gold} />
            <Kv k="What Changed" v="2.5% was below landlord operating cost inflation (~8–9%/yr for insurance alone). The dynamic model keeps owners viable while protecting tenants from speculative 20–30% spikes." accent={P.gold} />
            <Kv k="New-Unit Carve-Out" v="Any new units added to a partnered property during the covenant period are exempt for 15 years — encouraging owners to expand supply rather than hoard existing units." accent={P.gold} />
            <Kv k="Audit Portal" v="Cloud-based portal where landlords upload verified expense docs (insurance declarations, tax bills, contractor invoices). Tenants can request a review. County audit staff adjudicate within 30 days." accent={P.gold} />
          </Card>
        </div>
      )}

      {/* TAX RELIEF */}
      {polSec === "tax" && (
        <div>
          <Card accent={P.slate}>
            <SectionTitle accent={P.slate}>🏛️ Property-Tax Circuit Breaker & Deferment (NC Model)</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.slate}` }}>
              As SEED infrastructure raises surrounding property values 5–15%, long-time low-income homeowners face rising property tax bills they can't afford — forcing them to sell the homes they've lived in for decades. The Circuit-Breaker program prevents this without freezing market values.
            </div>
            <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
              {[
                { prog: "Circuit-Breaker Tax Deferment", elig: "Low-income seniors (65+) or permanently disabled; income ≤ 30% of state median", mech: "Property-tax bill capped at ~4–5% of household income. Any amount above the cap is deferred — not forgiven, not paid immediately.", payoff: "Only the most recent 3 years of deferred tax (+ interest) become due at sale or transfer. All earlier years are forgiven." },
                { prog: "Homestead Exclusion (Elderly/Disabled)", elig: "Same income thresholds, stricter asset limits", mech: "The greater of $25K or 50% of the home's assessed value is removed before the tax calculation.", payoff: "No repayment ever — the exemption is permanent." },
              ].map(r => (
                <div key={r.prog} style={{ background: `${P.slate}08`, borderRadius: 8, padding: "14px 16px", borderLeft: `4px solid ${P.slate}` }}>
                  <div style={{ fontWeight: 800, color: P.slate, fontSize: 13, fontFamily: "sans-serif", marginBottom: 8 }}>{r.prog}</div>
                  <Kv k="Eligibility" v={r.elig} accent={P.slate} />
                  <Kv k="Mechanism" v={r.mech} accent={P.slate} />
                  <Kv k="Pay-Off At Sale" v={r.payoff} accent={P.slate} />
                </div>
              ))}
            </div>
            <SectionTitle accent={P.slate}>Why the 3-Year Look-Back Is Crucial</SectionTitle>
            <Kv k="Liquidity Protection" v="The homeowner never faces a massive lump-sum tax bill that could force foreclosure. Maximum exposure at sale is always bounded." accent={P.slate} />
            <Kv k="Equity Preservation" v="In a booming market (like post-SEED), home values typically increase far faster than 3 years of deferred taxes — so the lien is a tiny fraction of total equity gained." accent={P.slate} />
            <Kv k="Risk Limitation" v="If the market stalls, maximum exposure is limited to a few thousand dollars, not the full deferred balance." accent={P.slate} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>⚠️ Potential Downsides & Mitigations</SectionTitle>
            {[
              { concern: "Reduced Net Proceeds at Sale", impact: "Sellers receive less cash — the 3-year tax bill is subtracted from proceeds.", mitigation: "Pair deferment with a Local Relief Fund that pays the 3-year amount for qualifying owners, restoring full equity." },
              { concern: "Negative-Equity Scenario (rare)", impact: "In a severe downturn, sale price could be lower than mortgage + 3-year tax debt.", mitigation: "Offer a Home-Equity Bridge Loan (low-interest) to cover the tax portion, payable after the home is sold or refinanced." },
              { concern: "Administrative Burden", impact: "County must track deferments and enforce the 3-year rule accurately.", mitigation: "Create a digital portal integrated with the property-tax system. Owners view deferred balance; county auto-applies 3-year cutoff at disposition." },
            ].map(r => (
              <div key={r.concern} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "8px 0", borderBottom: `1px solid ${P.rule}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: P.rust, fontFamily: "sans-serif" }}>{r.concern}</div>
                <div style={{ fontSize: 12, color: P.ink, fontFamily: "sans-serif" }}>{r.impact}</div>
                <div style={{ fontSize: 12, color: P.green, fontFamily: "sans-serif" }}>{r.mitigation}</div>
              </div>
            ))}
            <div style={{ marginTop: 10, background: P.amber, borderRadius: 8, padding: "12px 14px" }}>
              <strong style={{ color: P.gold, fontSize: 12, fontFamily: "sans-serif" }}>SEED Funding:</strong>
              <span style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink }}> Allocate <strong>$5M–$7M</strong> from SEED's community-impact budget to seed the Local Relief Fund. Language embedded in the Community Benefits Agreement requires the developer to contribute <strong>0.3% of annual profit</strong> to the Relief Fund in perpetuity as surrounding property values rise.</span>
            </div>
          </Card>
        </div>
      )}

      {/* HOUSING TOOLS */}
      {polSec === "housing" && (
        <div>
          <Card accent={P.forest}>
            <SectionTitle accent={P.forest}>🏘️ Housing-Preservation Toolkit</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>Core principle:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Property values can and should rise — benefiting the tax base and municipal services. But targeted tools ensure that seniors, people on fixed incomes, and vulnerable households retain affordable, secure housing and enough purchasing power to enjoy the opportunities SEED creates.</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                { tool: "Community Land Trust (CLT)", how: "Non-profit holds land in perpetuity; resale price of homes is capped at modest appreciation (typically CPI + 1–2%). Residents own the structure, not the land.", why: "Keeps housing affordable forever, even as surrounding values rise. Removes land from the speculative market permanently.", seed: "SEED seeds CLT with $30M from community-impact budget." },
                { tool: "Property-Tax Relief Fund", how: "Dedicated pool pays the incremental property-tax increase for qualifying low-income owners — not the full bill, just the increase attributable to rising values from SEED development.", why: "Prevents 'tax-driven displacement' without freezing overall market values. Targets only the SEED-caused increase.", seed: "Funded by 0.3% of DC annual revenue via CBA language." },
                { tool: "Circuit-Breaker Tax Deferment", how: "Defers excess tax to sale, capped at the most recent 3 years. Gives seniors/disabled households cash-flow relief.", why: "Limits long-term debt exposure. Maximum liability at sale is always bounded to a manageable amount.", seed: "See Tax Relief tab for full detail." },
                { tool: "Right-of-First-Refusal (RFR) Ordinance", how: "When a low-income rental is listed for sale, the tenant or a local non-profit gets the first offer at a regulated price — stopping speculative flips.", why: "Prevents eviction of fixed-income tenants when landlords cash out after SEED raises property values.", seed: "Enacted through county ordinance; no direct SEED cost." },
                { tool: "Community Benefits Agreement (CBA)", how: "Data-center developer commits a fixed percentage of revenue to a 'Legacy-Resident Preservation Fund' for home-repair grants, not just new construction.", why: "Directly offsets cost pressure created by rising property values. Residents receive grants to repair, adapt, and maintain their existing homes.", seed: "Minimum 0.5% of annual DC operational revenue." },
                { tool: "Affordable Unit Set-Aside", how: "Any new multifamily development within 2 miles of SEED campus required to set aside 12–15% of units as affordable, rent-cap tied to the dynamic 5%+CPI model.", why: "Grows the affordable housing supply as the area develops rather than letting 100% of new units be market-rate.", seed: "Enforced via county zoning overlay; paired with low-interest 'rent-stabilization bond' repaid from DC power-purchase agreement." },
              ].map(r => (
                <div key={r.tool} style={{ background: P.white, borderRadius: 8, padding: "14px 16px", border: `1px solid ${P.rule}`, borderLeft: `4px solid ${P.forest}` }}>
                  <div style={{ fontWeight: 800, color: P.forest, fontSize: 13, fontFamily: "sans-serif", marginBottom: 8 }}>{r.tool}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div><div style={{ fontSize: 10, fontWeight: 800, color: P.mid, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 4 }}>HOW IT WORKS</div><div style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink, lineHeight: 1.6 }}>{r.how}</div></div>
                    <div><div style={{ fontSize: 10, fontWeight: 800, color: P.mid, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 4 }}>WHY IT PROTECTS RESIDENTS</div><div style={{ fontSize: 12, fontFamily: "sans-serif", color: P.ink, lineHeight: 1.6 }}>{r.why}</div></div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, fontFamily: "sans-serif", color: P.gold, fontStyle: "italic" }}>SEED role: {r.seed}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* JOBS & WAGES */}
      {polSec === "jobs" && (
        <div>
          <Card accent={P.green}>
            <SectionTitle accent={P.green}>💼 Jobs, Wages & Automation Strategy</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>Core position:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Automation is coming regardless. The question is whether it creates locally-owned wealth or extracts it. SEED funds the transition so local workers become the operators, maintainers, and programmers of the automated systems — not the displaced.</span>
            </div>
            <Kv k="Tax-Incentivized R&D Labs" v="Offer co-location in the SEED business park to biotech, aerospace, and logistics R&D firms with tax incentives tied to local hiring minimums. Each R&D job creates 3–4 ancillary jobs in the surrounding economy." accent={P.green} />
            <Kv k="Skill-Gap Mapping" v="Partner with Franklin County workforce board to map gap between current local skills and SEED job requirements. Fund community-college scholarships, modern labs, and certified tool kits specifically for identified gaps." accent={P.green} />
            <Kv k="Wage-Uplift Grant" v="SEED matches industry salaries with a 'wage-uplift' grant tied to documented pay-scale increases. Employers who raise wages above baseline receive grant funding — creates an upward wage floor." accent={P.green} />
            <Kv k="Human-Oversight Automation Model" v="Robots and AI perform physically demanding or repetitive tasks. Local workers monitor, program, and maintain the systems — earning higher wages than the jobs they replaced. No net job loss, wage increase." accent={P.green} />
            <Kv k="Retraining Grant Program" v="Fund community-college certificates for Automation Technicians, Robotics Maintenance Engineers, Logistics Analysts, and Data Center Operations Specialists. All tied to guaranteed SEED job offers upon certification." accent={P.green} />
            <Kv k="Vocational Academy Pipeline" v="On-site academy trains in turbine ops, BESS maintenance, greenhouse agri-tech, rack-and-stack, solar install, and basic trades. Graduates receive direct hiring pipeline to campus + vendor-inject slots." accent={P.green} />
            <Kv k="$10M/yr Scholarship Fund" v="Allocated annually for up-skilling pipelines aligned with the DC tech stack. Covers tuition, tools, transportation, and living stipend during training period." accent={P.green} />
          </Card>

          <Card accent={P.slate} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.slate}>🧒 Industrial-Scale Childcare Infrastructure</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.slate}` }}>
              Childcare is the single biggest barrier to workforce participation for low-income parents — particularly women. At $2–$5/day per child, SEED's childcare program unlocks the workforce capacity of thousands of parents who currently can't afford to work full-time.
            </div>
            <Kv k="Location" v="24-hour facilities co-located in the SEED business park campus. Workers with non-standard shifts (data center ops runs 24/7) have childcare that matches their schedule." accent={P.slate} />
            <Kv k="Capacity" v="10,000 seats. Priority enrollment for SEED campus employees and Dignity Village residents. Open to community at sliding-scale rates after employee allocation." accent={P.slate} />
            <Kv k="Cost to Parents" v="$2–$5/day per child (vs. national average $35–$75/day). Subsidy funded by DC profit share." accent={P.slate} />
            <Kv k="Annual Program Cost" v="$11,000,000/yr (10,000 seats × $3/day avg × 365 days). Funded entirely from data center operational revenue profit share." accent={P.slate} />
            <Kv k="Economic Return" v="Each parent who enters the workforce due to affordable childcare contributes ~$35,000–$55,000/yr in taxable income. 1,000 newly-employed parents = $35–55M in new annual tax revenue — a 3–5× return on the $11M childcare investment." accent={P.slate} />
            <Kv k="Operator" v="Contract with regional non-profit childcare operator. SEED provides facility and subsidy; non-profit manages staffing and programming. Hybrid model preserves accountability." accent={P.slate} />
          </Card>
        </div>
      )}

      {/* SUPPLY CHAIN */}
      {polSec === "supply" && (
        <div>
          <Card accent={P.rust}>
            <SectionTitle accent={P.rust}>🚛 Supply Chain Modernization</SectionTitle>
            <div style={{ background: P.rose, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.rust}` }}>
              A 9 GW data center campus creates massive logistics demand — construction materials, equipment, cooling infrastructure, ongoing consumables. Without deliberate planning, this means thousands of diesel truck trips through residential streets. SEED designs the logistics system from day one to minimize community impact and maximize regional economic benefit.
            </div>
            <Kv k="Intermodal Inland Port" v="Rail-to-electric-truck terminal adjacent to the SEED site. Heavy freight arrives by rail (lower emissions, no residential road impact), transfers to electric yard trucks for final delivery on-site. Cuts freight-truck mileage by ~30% and saves $0.04/ton-mile in fuel costs." accent={P.rust} />
            <Kv k="Annual Fuel Savings" v="$250,000/yr estimated regional economic multiplier from reduced trucking costs and local freight employment." accent={P.rust} />
            <Kv k="Smart Freight Corridor" v="V2I (vehicle-to-infrastructure) enabled traffic signals on designated freight routes give cargo trucks priority during off-peak hours, cutting idling time and emissions. Freight trucks never enter residential streets." accent={P.rust} />
            <Kv k="Industrial Loop Roads" v="Heavy-duty bypass roads keep all truck traffic out of residential neighborhoods entirely. Separate ingress/egress for WtE waste haulers (dedicated haul road from US-64 direct to facility)." accent={P.rust} />
            <Kv k="Federal Freight Grant" v="Intermodal inland port qualifies for ~$20M in federal freight-infrastructure grants (USDOT RAISE, BUILD program). SEED contribution: ~$5–10M in co-funding. Remaining funded federally." accent={P.rust} />
            <Kv k="Local Jobs Created" v="Inland port operations: 40–80 permanent logistics jobs (crane operators, truck drivers, logistics coordinators, maintenance). All SEED vendor-inject eligible — priority hiring from Dignity Village graduates." accent={P.rust} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>⚡ Micro-Grid & Energy Cost Reduction</SectionTitle>
            <Kv k="Co-Located Micro-Grid" v="Solar (60 MW) + LiFePO4 BESS (8-hr storage, 5–10 MWh) feeds the data center and exports surplus to the municipal grid during peak demand." accent={P.gold} />
            <Kv k="Local Rate Reduction" v="Excess energy sold to utility lowers local residential rates by 10–15%. At average NC residential bill of ~$130/mo, that's $13–$20/month savings per household across the service area." accent={P.gold} />
            <Kv k="Micro-Grid Export Revenue" v="~5 MWh/day exported at $0.04/kWh = +$73,000/yr in revenue for local grid upgrades. Reinvested into infrastructure improvements." accent={P.gold} />
            <Kv k="15-Year Power Purchase Agreement" v="SEED partners with local utility for a 15-year PPA, locking in rates and providing the utility long-term planning certainty in exchange for grid-stability cooperation." accent={P.gold} />
          </Card>
        </div>
      )}

      {/* FINANCIAL MODEL */}
      {polSec === "numbers" && (
        <div>
          <Card accent={P.forest}>
            <SectionTitle accent={P.forest}>📊 Policy Financial Model — Illustrative Annual Numbers</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
              Based on a 300-pole solar LED network, 20-signal smart traffic system, 10,000-seat childcare campus, intermodal port, and dynamic rent cap system. All figures annualized.
            </div>
            <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}` }}>
              {[
                { label: "O&M: Smart signals (20) + Solar LED poles (300)", cost: "$219,000/yr", note: "Baseline annual operating budget" },
                { label: "Electricity savings (grid-connected lights eliminated)", cost: "−$26,900/yr", note: "Offsets O&M — utility bill permanently $0", positive: true },
                { label: "Dynamic cap (5%+CPI) vs. uncapped market rents", cost: "−$45,000/yr", note: "Estimated reduced rent growth per 400 units in covenant", positive: true },
                { label: "Cost-plus O&M petition admin overhead", cost: "$15,000/yr", note: "County audit staff, digital portal maintenance" },
                { label: "Childcare subsidy (10,000 seats @ $3/day avg)", cost: "$11,000,000/yr", note: "Funded by DC profit share; returns $35–55M in new tax revenue" },
                { label: "Micro-grid excess export (~5 MWh/day @ $0.04/kWh)", cost: "+$73,000/yr", note: "Revenue reinvested into local grid upgrades", positive: true },
                { label: "Supply-chain rail terminal ROI (fuel savings)", cost: "+$250,000/yr", note: "Regional economic multiplier from reduced trucking costs", positive: true },
                { label: "Tax relief fund seed (one-time from DC budget)", cost: "$5,000,000–$7,000,000", note: "One-time seed to Local Relief Fund clearing 3-yr tax balances" },
                { label: "NET annual policy program deficit (after offsets)", cost: "≈ −$92,000/yr", note: "Easily absorbed by DC $1B community pledge", total: true },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "10px 14px", background: r.total ? "#F0FAF4" : (r.positive ? "#F8FFF8" : (i % 2 === 0 ? "#fafafa" : P.white)),
                  borderBottom: `1px solid ${P.rule}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: r.total ? 800 : 400, color: P.ink }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: P.mid, fontFamily: "sans-serif", marginTop: 2 }}>{r.note}</div>
                  </div>
                  <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: r.positive ? P.green : (r.total ? P.forest : P.ink), marginLeft: 16, whiteSpace: "nowrap" }}>{r.cost}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, background: P.amber, borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontWeight: 800, color: P.gold, fontFamily: "sans-serif", marginBottom: 8 }}>💡 The Big Picture</div>
              <div style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink, lineHeight: 1.8 }}>
                The $92K/yr net deficit is <strong>0.0092%</strong> of the $1B community investment pool. Meanwhile the childcare program alone unlocks an estimated <strong>$35–55M/yr in new taxable income</strong> as parents re-enter the workforce. Every dollar spent on policy infrastructure returns 3–5× in municipal tax revenue within 3–5 years.
              </div>
            </div>
          </Card>

          <Card accent={P.slate} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.slate}>🗺️ 12-Month Implementation Roadmap</SectionTitle>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { month: "Months 1–2", task: "Legislative Package", detail: "Enact dynamic rent-cap formula, new-construction exemption, O&M petition framework, and RFR ordinance through county commission." },
                { month: "Months 2–3", task: "Create CLT & Tax-Relief Fund", detail: "Seed with $30M from DC community-impact budget. Hire CLT administrator. Open applications for qualifying homeowners." },
                { month: "Months 3–4", task: "Design Micro-Grid / BESS", detail: "Partner with local utility. Secure 15-year power-purchase agreement. Begin solar + BESS permitting and interconnection." },
                { month: "Months 4–6", task: "Build Intermodal Inland Port", detail: "Leverage $20M federal freight-infrastructure grant (USDOT RAISE). Break ground on rail-to-electric-truck terminal." },
                { month: "Months 4–6", task: "Launch Childcare Campus", detail: "Contract regional non-profit operator. Set flat-fee rate at $2–$5/day. Open 2,500-seat Phase 1 (10,000 target by Year 3)." },
                { month: "Months 5–7", task: "Fund Vocational Scholarships", detail: "Allocate $10M/yr for up-skilling pipelines. Partner with Franklin County Community College for certificate programs." },
                { month: "Months 6–8", task: "Deploy Audit Platform", detail: "Cloud-based portal where landlords upload expense docs; tenants can request reviews. County adjudicates within 30 days." },
                { month: "Months 8–12", task: "Monitor & Adjust", detail: "Quarterly KPI dashboard: rent-affordability index, job-creation count, energy-cost reduction, housing-stability metric, childcare enrollment." },
              ].map(r => (
                <div key={r.month} style={{ display: "grid", gridTemplateColumns: "100px 120px 1fr", gap: 10, padding: "10px 12px", background: P.white, borderRadius: 7, border: `1px solid ${P.rule}`, alignItems: "start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: P.slate, fontFamily: "sans-serif" }}>{r.month}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: P.forest, fontFamily: "sans-serif" }}>{r.task}</span>
                  <span style={{ fontSize: 12, color: P.ink, fontFamily: "sans-serif", lineHeight: 1.5 }}>{r.detail}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card accent={P.green} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.green}>🎯 Policy Lever Summary — All Tools Together</SectionTitle>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { lever: "Dynamic Rent Cap (5%+CPI)", goal: "Protect tenants, preserve landlord viability", outcome: "Cost-aligned rent growth, reduced displacement, no market collapse" },
                { lever: "Circuit-Breaker / Homestead Exclusion", goal: "Shield fixed-income seniors & disabled from tax-driven loss", outcome: "Cash-flow stability, limited equity erosion, no forced sales" },
                { lever: "Property-Tax Relief Fund", goal: "Pay incremental tax increases for low-income owners", outcome: "No 'tax-shock' as values rise from SEED infrastructure" },
                { lever: "CLT & Right-of-First-Refusal", goal: "Preserve long-term affordable homeownership", outcome: "Stable supply of low-cost housing permanently removed from speculation" },
                { lever: "CBA Legacy-Resident Fund", goal: "Directly offset cost pressure from rising values", outcome: "Community-owned safety net, home-repair grants for longtime residents" },
                { lever: "Supply-Chain Modernization", goal: "Lower freight costs, attract logistics firms", outcome: "More jobs, lower cost of goods, $250K/yr regional multiplier" },
                { lever: "Automation + Retraining ($10M/yr)", goal: "Increase productivity without job loss", outcome: "Higher wages, skilled workforce, graduates hired directly into SEED" },
                { lever: "Micro-Grid + Childcare ($11M/yr)", goal: "Reduce living expenses dramatically", outcome: "$35–55M/yr in new taxable income unlocked from parent workforce re-entry" },
              ].map(r => (
                <div key={r.lever} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "8px 12px", background: P.white, borderRadius: 6, border: `1px solid ${P.rule}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: P.forest, fontFamily: "sans-serif" }}>{r.lever}</div>
                  <div style={{ fontSize: 12, color: P.mid, fontFamily: "sans-serif" }}>{r.goal}</div>
                  <div style={{ fontSize: 12, color: P.green, fontFamily: "sans-serif", fontWeight: 600 }}>{r.outcome}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: QUALITY OF LIFE
// ══════════════════════════════════════════════════════════════════════════════
const QOL_SECTIONS = [
  { id: "places",  icon: "☕", label: "Third Places" },
  { id: "health",  icon: "🏥", label: "Health" },
  { id: "food",    icon: "🍎", label: "Food Security" },
  { id: "family",  icon: "👨‍👩‍👧", label: "Family" },
  { id: "arts",    icon: "🎨", label: "Arts & Connection" },
  { id: "mobility",icon: "🚲", label: "Mobility" },
  { id: "dignity", icon: "✨", label: "Civic Dignity" },
];

function QualityOfLifeTab({ qolSec, setQolSec }) {
  const accent = P.sage;
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, #1B4332 0%, ${P.green} 60%, ${P.sage} 100%)`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: P.mint, letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>QUALITY OF LIFE & HAPPINESS</div>
        <div style={{ fontSize: 20, color: P.white, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>💚 The Things That Actually Make People Happy</div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "0 0 14px", fontStyle: "italic", fontFamily: "sans-serif", lineHeight: 1.6 }}>Happiness research is clear: social connection and time autonomy outperform almost everything else. These programs invest in the social fabric, not just infrastructure.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["3 Third Places", "Health Clinic + Mobile Unit", "Universal School Meals", "Community Kitchen", "Pet Adoption Support", "Senior Connection Program", "Free Legal Aid"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: P.mint, fontSize: 11, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {QOL_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setQolSec(s.id)} style={{
            flex: 1, minWidth: 100, padding: "9px 12px", borderRadius: 22,
            border: `2px solid ${qolSec === s.id ? accent : P.rule}`,
            background: qolSec === s.id ? accent : P.white,
            color: qolSec === s.id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* THIRD PLACES */}
      {qolSec === "places" && (
        <div>
          <Card accent={P.sage}>
            <SectionTitle accent={P.sage}>☕ Third Places — Free Community Gathering Spaces</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.sage}` }}>
              <strong style={{ color: P.forest }}>The research:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Ray Oldenburg's seminal work on "third places" (not home, not work — coffee shops, libraries, barber shops) is one of the most cited findings in urban happiness research. The decline of third places correlates directly with rising loneliness and weakening social fabric.</span>
            </div>
            <Kv k="The Concept" v="Fund 3 free or near-free community gathering spaces in existing buildings around town — places where anyone can show up without spending money and meet their neighbors." accent={P.sage} />
            <Kv k="Place #1: Community Coffee House" v="$1 coffee, $2 pastries, free Wi-Fi, open mic nights, board games. Hires from Dignity Village graduates. Adjacent to library or transit stop." accent={P.sage} />
            <Kv k="Place #2: Maker Space" v="3D printer, sewing machines, woodworking tools, soldering stations, hand tools. Free use with a 30-min orientation. Weekly classes taught by community members." accent={P.sage} />
            <Kv k="Place #3: Teen Drop-In Center" v="After-school space for ages 12–18. Snacks, homework help, video game tournaments, music studio. Staffed by youth workers (often hired through Cure Violence-style model)." accent={P.sage} />
            <Kv k="Place #4 (Senior Gathering Hall)" v="Daily programming for older residents — bingo, line dancing, card games, weekly meals, health screenings. Connects directly to Senior Connection Program." accent={P.sage} />
            <Kv k="Cost per Place" v="~$300K capital (renovation, furniture, equipment). ~$100K/yr ops (1–2 staff, utilities, supplies)." accent={P.sage} />
            <Kv k="Total Investment" v="4 third places: ~$1.2M capital | ~$400K/yr ops" accent={P.sage} />
          </Card>

          <Card accent={P.slate} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.slate}>📚 Public Library Expansion + Branches</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.slate}` }}>
              Libraries punch massively above their weight on happiness metrics: free childcare while parents job-hunt, climate refuge during heat waves, free internet/computer access, and a non-commercial social space that welcomes everyone.
            </div>
            <Kv k="New Branch Library" v="One new branch in an underserved neighborhood within the SEED 3-mile zone. Full-service: books, computers, study rooms, children's section, meeting rooms." accent={P.slate} />
            <Kv k="Programming" v="Free literacy classes, English as a Second Language, job-search assistance, citizenship test prep, kids' story hour, teen coding club, senior tech help." accent={P.slate} />
            <Kv k="Co-Located Services" v="Notary public, passport processing, voter registration, summer meal site, cooling/warming center during extreme weather." accent={P.slate} />
            <Kv k="Cost" v="$2,000,000–$4,000,000 build (depends on size). $400,000/yr operating (librarians, materials, programming)." accent={P.slate} />
            <Kv k="Funding" v="IMLS (Institute of Museum and Library Services) grants, NC State Library Services Construction grants, local library system partnership." accent={P.slate} />
          </Card>
        </div>
      )}

      {/* HEALTH */}
      {qolSec === "health" && (
        <div>
          <Card accent={P.green}>
            <SectionTitle accent={P.green}>🏥 Free Community Health Clinic (FQHC Model)</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>The need:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Rural NC counties are critically medically underserved. Federally Qualified Health Center (FQHC) model: sliding-scale fees based on income, dental and mental health included alongside primary care, federal grants cover most operating costs.</span>
            </div>
            <Kv k="Services Provided" v="Primary care, dental, pediatrics, women's health, mental health counseling, substance use treatment, chronic disease management, vaccines, basic lab work, on-site pharmacy." accent={P.green} />
            <Kv k="Fee Structure" v="Sliding scale from $0 to standard rate based on documented household income. No one turned away for inability to pay. Accepts Medicaid, Medicare, and private insurance." accent={P.green} />
            <Kv k="Staffing" v="Family medicine MD (1–2), nurse practitioners (3–4), dental staff (1 dentist + 2 hygienists), behavioral health (2 LCSWs + 1 psychiatrist part-time), pharmacy tech, intake/admin." accent={P.green} />
            <Kv k="Cost" v="$3,000,000–$5,000,000 build (medical-grade facility, equipment, dental chairs). HRSA grants cover ~70% of operating costs. SEED gap funding: ~$300,000/yr." accent={P.green} />
            <Kv k="Funding" v="HRSA Health Center Program grants, NC DHHS rural health funds, Medicaid reimbursement, 340B drug pricing program, sliding-scale patient fees." accent={P.green} />
          </Card>

          <Card accent={P.sky} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.sky}>💪 Community Fitness Infrastructure</SectionTitle>
            <Kv k="Outdoor Fitness Equipment" v="Calisthenics rigs and par-course stations every quarter mile along sidewalk routes. Pull-up bars, parallel bars, leg raise stations, stretching posts. Weather-resistant powder-coated steel." accent={P.sky} />
            <Kv k="Measured Walking Trails" v="Distance markers every 0.25 miles along the 40-mile sidewalk network. Color-coded loops of 1, 3, and 5 miles. Trailhead kiosks with maps." accent={P.sky} />
            <Kv k="Community Pool" v="Outdoor swimming pool with 6 lanes, kiddie pool, ADA lift. Free admission for residents. Water safety classes free for all K–8 kids. Rural NC drowning rates are elevated; swimming should not be a class privilege." accent={P.sky} />
            <Kv k="Cost" v="Outdoor fitness stations (20 locations): $400,000. Walking trail markers: $80,000. Community pool: $3,500,000 build + $400,000/yr ops." accent={P.sky} />
            <Kv k="Funding" v="USDA Community Facilities grants, CDC Built Environment grants, NC Parks and Recreation Trust Fund." accent={P.sky} />
          </Card>

          <Card accent={P.rust} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.rust}>🚐 Mobile Health Unit</SectionTitle>
            <Kv k="Concept" v="Converted RV that rotates through neighborhoods weekly. Schedule published in advance. Reaches residents who can't easily get to the main clinic." accent={P.rust} />
            <Kv k="Services" v="Blood pressure checks, diabetes screening, vaccines, prescription refills, basic wound care, mental health check-ins, well-child visits." accent={P.rust} />
            <Kv k="Schedule" v="Monday–Friday rotation through 5 priority neighborhoods. Tuesday + Thursday evening hours for working residents. Saturday at the community plaza farm stand." accent={P.rust} />
            <Kv k="Cost" v="$400,000 vehicle + medical fit-out. $250,000/yr staff (NP + medical assistant + driver). Synergy with FQHC clinic — same staff system, shared electronic health records." accent={P.rust} />
            <Kv k="Funding" v="HRSA mobile health program grants, Robert Wood Johnson Foundation, federal AmeriCorps placements." accent={P.rust} />
          </Card>
        </div>
      )}

      {/* FOOD SECURITY */}
      {qolSec === "food" && (
        <div>
          <Card accent={P.green}>
            <SectionTitle accent={P.green}>🍳 Community Kitchen & Food Hub</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>The vision:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Commercial-grade kitchen rentable by the hour for home food businesses — catering, baking, food trucks, prepared foods. Launches a generation of food entrepreneurs from people who couldn't afford their own commercial kitchen. Doubles as hot meal distribution during emergencies.</span>
            </div>
            <Kv k="Facilities" v="Commercial 6-burner ranges, convection ovens, walk-in cooler/freezer, prep tables, dishwashing station, dry storage. Licensed for retail food production." accent={P.green} />
            <Kv k="Rental Model" v="$10–$25/hr depending on time and equipment. Sliding scale for Dignity Village/Sanctuary Village graduates and low-income residents. First 20 hours free for new businesses." accent={P.green} />
            <Kv k="Business Support" v="Free workshops on food safety certification (ServSafe), small business basics, pricing, packaging, marketing. Partner with Franklin County small business center." accent={P.green} />
            <Kv k="Emergency Role" v="Activates as hot meal distribution hub during disasters. Can produce 1,000+ meals/day for 7+ days. Coordinated with county emergency management." accent={P.green} />
            <Kv k="Cost" v="$1,500,000 build + equipment | $300,000/yr operating | Partially offset by rental revenue (~$80,000/yr at moderate utilization)." accent={P.green} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>🥪 Universal Free School Meals (K–12)</SectionTitle>
            <div style={{ background: P.amber, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.gold}` }}>
              <strong style={{ color: P.gold }}>The gap:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> In many NC counties, school meals are means-tested. Kids whose families are right above the federal cutoff go hungry while their classmates eat. Academic performance research is unambiguous: hungry kids don't learn.</span>
            </div>
            <Kv k="Scope" v="Every K–12 student in Franklin County. No applications, no income verification, no stigma. Universal access." accent={P.gold} />
            <Kv k="Meals Covered" v="Breakfast + lunch on every school day. Summer meal program continues at libraries and community kitchen during break." accent={P.gold} />
            <Kv k="Food Sourcing" v="Greenhouse produce + farm-to-school sourcing prioritized. SEED greenhouse becomes the school district's primary vegetable supplier. Local meat and dairy where available." accent={P.gold} />
            <Kv k="Annual Cost" v="~$3,000,000/yr to cover Franklin County K–12 (~10,000 students × $300/yr in supplemental meals). Federal reimbursement covers a portion through National School Lunch Program." accent={P.gold} />
            <Kv k="Impact" v="Documented academic improvements: better attendance, higher test scores, reduced behavioral issues. Health: lower childhood obesity, better dental health." accent={P.gold} />
          </Card>

          <Card accent={P.sage} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.sage}>🥬 Refrigerated Community Fridges</SectionTitle>
            <Kv k="Network" v="8–10 outdoor refrigerators stocked daily with greenhouse surplus + food bank donations + community contributions. No questions asked. Take what you need." accent={P.sage} />
            <Kv k="Locations" v="Community plaza, library, third places, transit hub, near apartment complexes. Solar-powered to avoid utility bills." accent={P.sage} />
            <Kv k="Stocking" v="Daily restocking by greenhouse staff + Dignity Village graduates + community volunteers. Bad-actor cleanup duty rotates through restorative justice circle assignments." accent={P.sage} />
            <Kv k="Cost" v="$5,000/fridge × 10 = $50,000 capital. Solar panels + small canopy: $30,000. $20,000/yr maintenance + restocking labor." accent={P.sage} />
            <Kv k="Cultural Reinforcement" v="Visible community ownership: each fridge has a small plaque listing the volunteer crew that maintains it. Pride of authorship is the best deterrent against abuse." accent={P.sage} />
          </Card>
        </div>
      )}

      {/* FAMILY */}
      {qolSec === "family" && (
        <div>
          <Card accent={P.forest}>
            <SectionTitle accent={P.forest}>🍼 Doula & Lactation Support</SectionTitle>
            <Kv k="Free Doula Program" v="Trained doulas available to all pregnant residents at no cost. Doulas attend prenatal visits, support during labor, and provide postpartum check-ins for 6 weeks." accent={P.forest} />
            <Kv k="Lactation Consultants" v="Free IBCLC (board-certified lactation consultants) available to all new mothers. Home visits, hospital visits, support groups." accent={P.forest} />
            <Kv k="Outcomes Targeted" v="Improved birth outcomes, reduced C-section rates, reduced postpartum depression, higher breastfeeding success rates, lower NICU admissions. All documented benefits in similar programs." accent={P.forest} />
            <Kv k="Cost" v="$280,000/yr (3 FTE doulas + 1 lactation consultant + supplies). Funded through partnership with FQHC clinic + Medicaid reimbursement where applicable." accent={P.forest} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>🌙 Parent's Night Out Program</SectionTitle>
            <Kv k="Concept" v="Once a month — supervised childcare 6pm–10pm at a community center. Free to all residents. Parents reclaim time together (or alone)." accent={P.gold} />
            <Kv k="Activities" v="Movie night for kids, crafts, games, dinner provided. Two age groups: 3–7 and 8–12. Babies under 3 not included (capacity reasons)." accent={P.gold} />
            <Kv k="Staffing" v="2 lead childcare staff + 4 volunteers (often high school students earning service hours). Background checks required for all." accent={P.gold} />
            <Kv k="Cost" v="$30,000/yr (12 events × 2 staff × ~$150 + supplies + dinner). Tiny budget, enormous impact on parent mental health." accent={P.gold} />
          </Card>

          <Card accent={P.rust} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.rust}>👶 Free Diapers & Period Products</SectionTitle>
            <Kv k="The Gap" v="Diapers aren't covered by SNAP or WIC. Period products aren't either. Low-income families regularly run out — and a baby in a wet diaper too long develops infections, and a teenage girl without period products misses school." accent={P.rust} />
            <Kv k="Distribution Network" v="Stocked at libraries, FQHC clinic, schools, third places. No paperwork, no shame. Pick up what you need." accent={P.rust} />
            <Kv k="Cost" v="$200,000/yr buys an enormous quantity. Diapers ~$0.30 each in bulk. Period products comparable. Funded jointly by SEED + partnership with National Diaper Bank Network." accent={P.rust} />
            <Kv k="Stress Impact" v="Diaper need is one of the strongest predictors of maternal depression. Solving it is one of the cheapest mental-health interventions available." accent={P.rust} />
          </Card>
        </div>
      )}

      {/* ARTS & CONNECTION */}
      {qolSec === "arts" && (
        <div>
          <Card accent={P.gold}>
            <SectionTitle accent={P.gold}>🎵 Arts & Music Programming</SectionTitle>
            <Kv k="Free Music Lessons for Kids" v="Instrument library — kids can borrow violins, guitars, keyboards, drums for the school year. Weekly group lessons free. Annual recital at the community plaza." accent={P.gold} />
            <Kv k="Community Theater Space" v="Renovated black-box theater in one of the third places. Free use for community productions. Annual community play (kids + adults)." accent={P.gold} />
            <Kv k="Mural Commissions" v="$5,000–$15,000 grants for local artists to paint murals on data center walls, underpasses, transit stops, retaining walls. Selection committee includes residents." accent={P.gold} />
            <Kv k="Annual Arts Festival" v="Once a year at the community plaza. Local artists sell work, kids' art exhibit, live music, food trucks, performance stages." accent={P.gold} />
            <Kv k="Cost" v="~$500,000/yr total: instrument library $80K + music instructors $180K + theater space $100K + mural commissions $80K + arts festival $60K." accent={P.gold} />
          </Card>

          <Card accent={P.slate} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.slate}>💙 Grief & Recovery Support Groups</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.slate}` }}>
              <strong style={{ color: P.slate }}>Peer-led, not clinical.</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Different from therapy. These are spaces where people who've been through similar things support each other. Costs almost nothing and dramatically reduces isolation.</span>
            </div>
            <Kv k="Groups Hosted" v="Grief (loss of spouse, child, parent), addiction recovery (AA, NA, SMART Recovery), divorce, job loss, chronic illness, cancer survivors, parents of kids with special needs." accent={P.slate} />
            <Kv k="Format" v="Weekly meetings at third places, libraries, or community spaces. Peer-led with training from established programs. No registration, no fees, no records kept." accent={P.slate} />
            <Kv k="Cost" v="$60,000/yr (facilitator training, materials, light refreshments, meeting space heat/AC). Partnership with existing NC non-profits that already run similar programs." accent={P.slate} />
          </Card>

          <Card accent={P.sage} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.sage}>👵 Senior Connection Program</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <strong style={{ color: P.forest }}>The research:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Loneliness has the mortality impact of smoking 15 cigarettes a day. Isolated seniors in rural NC are one of the highest-risk populations for premature death and cognitive decline.</span>
            </div>
            <Kv k="Befriending Program" v="Modeled on UK's Befriending Networks. Pairs isolated seniors with weekly visitors who provide companionship, light help, and a regular check-in." accent={P.sage} />
            <Kv k="Visitor Stipend" v="$25/hr paid stipend to visitors. Often older teens, college students, or retired residents looking for purpose. Background-checked and trained." accent={P.sage} />
            <Kv k="Match Process" v="Seniors and visitors matched by interests, language, location. Same visitor for at least 6 months for continuity. Coordinator handles disputes and reassignments." accent={P.sage} />
            <Kv k="Cost" v="$280,000/yr (200 senior matches × 2 hrs/week × $25/hr) + coordinator salary. Far cheaper than the medical costs of isolation-driven decline." accent={P.sage} />
          </Card>

          <Card accent={P.rust} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.rust}>🐕 Pet Adoption & Veterinary Support</SectionTitle>
            <Kv k="Low-Cost Spay/Neuter Clinic" v="SEED-funded spay/neuter clinic. $25 cats, $50 dogs (vs. $200–$500 market rate). Reduces shelter overflow and stray populations." accent={P.rust} />
            <Kv k="Community Vet Fund" v="Emergency veterinary care fund for low-income pet owners. Grants up to $500 per pet per year for unexpected medical needs. Prevents surrender-to-shelter due to medical bills." accent={P.rust} />
            <Kv k="Pet Adoption Partnerships" v="Partnership with local animal shelters. Adoption fee subsidy ($50 off for residents). Free starter kit: leash, food bowl, food, vet voucher, ID tag." accent={P.rust} />
            <Kv k="Pet Food Bank" v="Stocked at community fridges and library. Free pet food for residents who need it. Prevents people from skipping their own meals to feed pets." accent={P.rust} />
            <Kv k="Cost" v="$280,000/yr total (clinic operations + community vet fund + adoption subsidies + pet food). Partnership with regional veterinary schools for low-cost clinical hours." accent={P.rust} />
          </Card>
        </div>
      )}

      {/* MOBILITY */}
      {qolSec === "mobility" && (
        <div>
          <Card accent={P.sky}>
            <SectionTitle accent={P.sky}>🚐 Microtransit Shuttle Network</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.sky}` }}>
              <strong style={{ color: P.sky }}>The problem:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Rural NC has almost no public transit. Without transportation, every other SEED service is harder to reach — the clinic, the jobs, the childcare, the greenhouse, the plaza. Transportation is the keystone.</span>
            </div>
            <Kv k="Fleet" v="4 electric vans (15-passenger). Wheelchair accessible. Powered by SEED solar via on-site overnight charging." accent={P.sky} />
            <Kv k="Service Model" v="On-demand routes through low-income neighborhoods via phone app or call-in. Fixed major stops: grocery stores, clinic, library, SEED campus, transit hubs." accent={P.sky} />
            <Kv k="Hours" v="6am–10pm Mon–Sat, 8am–8pm Sun. Service to align with shift changes at SEED campus (24/7 operations have 6am, 2pm, 10pm shift changes)." accent={P.sky} />
            <Kv k="Fare" v="Free for SEED-area residents (verified by ZIP code or apartment address). $1 flat fare for visitors. No fare evasion enforcement — operate on trust." accent={P.sky} />
            <Kv k="Cost" v="$1,000,000 fleet (4 vans @ $250K). $400,000/yr operating (drivers + dispatcher + maintenance + insurance + charging electricity). Funded partly by USDOT Rural Transit grants." accent={P.sky} />
          </Card>

          <Card accent={P.sage} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.sage}>🚲 Community Bike Program</SectionTitle>
            <Kv k="Bike Library" v="Located at community center. Borrow a bike for a day, week, or month. Free. Adult bikes, kids' bikes, cargo bikes for groceries." accent={P.sage} />
            <Kv k="Free Helmets" v="Helmet giveaway for every kid in Franklin County, replaced annually. Properly fitted at the bike library." accent={P.sage} />
            <Kv k="Repair Clinics" v="Free weekly bike repair clinics. Volunteer mechanics teach residents to maintain their own bikes. Bring your bike, learn the skill, fix the bike." accent={P.sage} />
            <Kv k="Cost" v="$120,000 capital (50 adult + 30 kids' bikes + 20 cargo bikes + helmets + repair tools). $40,000/yr operating (1 part-time staffer + repairs + replacements)." accent={P.sage} />
          </Card>
        </div>
      )}

      {/* CIVIC DIGNITY */}
      {qolSec === "dignity" && (
        <div>
          <Card accent={P.gold}>
            <SectionTitle accent={P.gold}>🎉 Community Celebrations Fund</SectionTitle>
            <div style={{ background: P.amber, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.gold}` }}>
              <strong style={{ color: P.gold }}>The idea:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Up to $2,000 per event for any resident who applies. Removes the financial barrier to celebrating life milestones — quinceañeras, weddings, funerals, retirement parties, graduations, baby showers, anniversary parties, block parties.</span>
            </div>
            <Kv k="Application" v="Simple online form: who, when, what kind of celebration, estimated attendance, brief description. Reviewed within 5 business days by community committee." accent={P.gold} />
            <Kv k="Eligibility" v="Open to any resident within the SEED 3-mile zone. Limit one grant per family per year. Larger grants ($3,000–$5,000) available for community-wide events." accent={P.gold} />
            <Kv k="What It Funds" v="Food, decorations, music, venue rental fees, photographer, transportation for elderly relatives. Not cash — payment to vendors directly or reimbursement with receipts." accent={P.gold} />
            <Kv k="Annual Budget" v="$50,000/yr. Covers ~25 family celebrations + a handful of larger community events. Administered by community advisory board." accent={P.gold} />
          </Card>

          <Card accent={P.sage} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.sage}>🏡 Beautification Grants</SectionTitle>
            <Kv k="Concept" v="Small grants ($500–$5,000) for residents to paint their houses, fix porches, plant gardens, repair fences, install solar lights." accent={P.sage} />
            <Kv k="Why It Works" v="People take pride in places that look cared for. Pride is contagious — when one house gets painted, neighboring houses follow. Property value rises gradually for everyone." accent={P.sage} />
            <Kv k="Eligibility" v="Homeowners and renters (with landlord permission) within the SEED 3-mile zone. Priority for elderly, disabled, and low-income households." accent={P.sage} />
            <Kv k="Annual Budget" v="$200,000/yr. Funds ~80 projects at average $2,500 each. Administered with community input." accent={P.sage} />
          </Card>

          <Card accent={P.forest} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.forest}>💼 Small Business Grants</SectionTitle>
            <Kv k="Grant Size" v="$500–$5,000 for residents starting a small business. Higher amounts ($5,000–$15,000) for businesses creating local jobs." accent={P.forest} />
            <Kv k="Requirements" v="(1) Resident of SEED 3-mile zone for 1+ years. (2) Completed small-business course at community college (free for grant applicants). (3) Written business plan with realistic financial projections. (4) Match grant with personal investment (sweat equity counts). (5) Six-month check-ins for first year." accent={P.forest} />
            <Kv k="Priority Sectors" v="Food businesses using community kitchen. Trades (plumbing, electrical, carpentry). Childcare. Home health aides. Repair services. Creative work (photography, graphic design)." accent={P.forest} />
            <Kv k="No-Interest Loans" v="Larger needs ($5K–$25K) available as 0% interest loans. Repaid from business revenue over 3–5 years. Defaults forgiven if business genuinely fails despite good-faith effort." accent={P.forest} />
            <Kv k="Annual Budget" v="$500,000/yr revolving fund (loans repaid back into fund). Administered by CLT in partnership with community college." accent={P.forest} />
          </Card>

          <Card accent={P.slate} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.slate}>⚖️ Free Legal Aid Clinic</SectionTitle>
            <Kv k="Services" v="Housing disputes (evictions, repairs, deposits), immigration paperwork, criminal record expungement, family court (custody, divorce), wills and estate planning, consumer protection, debt collection defense." accent={P.slate} />
            <Kv k="Staffing" v="2 staff attorneys + 1 paralegal + rotation of volunteer attorneys from regional law firms (pro bono hours). Partnership with NC Central University School of Law for student interns." accent={P.slate} />
            <Kv k="Hours" v="Tue/Thu/Sat. Saturday hours essential for working residents. Walk-ins welcome; appointments preferred for complex cases." accent={P.slate} />
            <Kv k="Cost" v="$320,000/yr (2 attorneys + paralegal + office + LexisNexis subscription + court filing fees fund). One attorney resolves ~150 cases/yr. Combined output: ~400+ cases/yr." accent={P.slate} />
            <Kv k="Impact" v="One eviction defended successfully = a family stays housed. One expungement = a person can get a job. The ROI on legal aid is documented to be one of the highest of any community intervention." accent={P.slate} />
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB: SOCIAL COMPACT (collective efficacy)
// ══════════════════════════════════════════════════════════════════════════════
const COMPACT_SECTIONS = [
  { id: "principle",  icon: "🤝", label: "The Principle" },
  { id: "stewards",   icon: "🛡️", label: "Stewards" },
  { id: "earned",     icon: "🎟️", label: "Earned Privileges" },
  { id: "restore",    icon: "🌀", label: "Restorative Justice" },
  { id: "violence",   icon: "🕊️", label: "Cure Violence Model" },
  { id: "rollout",    icon: "📅", label: "6-Month Pilot" },
];

function SocialCompactTab({ compSec, setCompSec }) {
  const accent = P.rust;
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, #4D2818 0%, ${P.rust} 60%, #B8602C 100%)`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#FFD8B8", letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>SOCIAL COMPACT & COLLECTIVE EFFICACY</div>
        <div style={{ fontSize: 20, color: P.white, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>🤝 The Community Has To Own It Too</div>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: "0 0 14px", fontStyle: "italic", fontFamily: "sans-serif", lineHeight: 1.6 }}>You can pour millions into community infrastructure, but if there's no social fabric to maintain it, it gets stripped for copper. The strongest predictor of neighborhood health isn't poverty or policing — it's collective efficacy.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["This Is Ours", "Neighborhood Stewards", "Earned, Not Entitled", "Restorative Justice", "Cure Violence", "6-Month Pilot Test"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFD8B8", fontSize: 11, padding: "4px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {COMPACT_SECTIONS.map(s => (
          <button key={s.id} onClick={() => setCompSec(s.id)} style={{
            flex: 1, minWidth: 110, padding: "9px 12px", borderRadius: 22,
            border: `2px solid ${compSec === s.id ? accent : P.rule}`,
            background: compSec === s.id ? accent : P.white,
            color: compSec === s.id ? P.white : P.mid,
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* PRINCIPLE */}
      {compSec === "principle" && (
        <div>
          <Card accent={P.rust}>
            <SectionTitle accent={P.rust}>🤝 The Founding Principle</SectionTitle>
            <div style={{ background: P.rose, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.rust}` }}>
              <strong style={{ color: P.rust }}>The honest truth:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> SEED is giving away a lot. Free fridges, free clinics, free transit, free childcare, free education, free legal aid. The risk is creating a one-way relationship where the community becomes a passive recipient — and passive recipients don't defend what they receive. They expect it to be replaced when it breaks.</span>
            </div>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "14px 16px", marginBottom: 14 }}>
              <strong style={{ color: P.forest }}>The flip:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Make participation a structural requirement, not a guilt trip. "We're investing in your community. Here's what we expect in return: showing up, looking out for each other, holding bad actors accountable, and treating these spaces like they belong to you — because they do."</span>
            </div>
            <Kv k="Collective Efficacy" v="Robert Sampson's Chicago studies (1997, replicated globally) proved the strongest predictor of neighborhood health isn't poverty rates, isn't police presence — it's whether neighbors will intervene when they see something wrong." accent={P.rust} />
            <Kv k="The Hawaii Example" v="When a tourist threw a rock at a Hawaiian monk seal, a local came up and dealt with it directly. The community polices itself because it has a shared sense of 'this is ours.' That's collective efficacy in its purest form." accent={P.rust} />
            <Kv k="What This Is Not" v="This is NOT vigilantism, racial profiling, deputizing residents, or replacing law enforcement. It's compensating people who are already informally doing the work, training them to do it safely, and giving them institutional backing." accent={P.rust} />
            <Kv k="What This Is" v="A structured social compact. Every SEED program includes a participation agreement — not punitive, aspirational. 'I commit to using this space respectfully, looking out for my neighbors, and telling someone when something's wrong.' You're not a customer. You're a member." accent={P.rust} />
          </Card>

          <Card accent={P.forest} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.forest}>📜 The Community Covenant</SectionTitle>
            <div style={{ background: P.white, borderRadius: 8, padding: "16px 18px", border: `2px solid ${P.forest}`, fontStyle: "italic", fontFamily: "Georgia,serif", lineHeight: 1.9, color: P.ink, fontSize: 14 }}>
              "As a member of this community, I commit to:<br /><br />
              · Using these shared spaces with respect for the people who built them and the people who will use them after me.<br />
              · Looking out for my neighbors, especially elders, children, and those struggling.<br />
              · Speaking up when I see something that damages what we've built together.<br />
              · Supporting accountability when it's needed, and forgiveness when it's earned.<br />
              · Treating these spaces like they belong to me — because they do."
            </div>
            <div style={{ marginTop: 12, fontSize: 13, fontFamily: "sans-serif", color: P.mid, fontStyle: "italic" }}>Signed by every program participant at first use. Symbolic, not legally binding. But it changes the psychology — you're now a member, not a customer.</div>
          </Card>
        </div>
      )}

      {/* STEWARDS */}
      {compSec === "stewards" && (
        <div>
          <Card accent={P.gold}>
            <SectionTitle accent={P.gold}>🛡️ Neighborhood Stewards Program</SectionTitle>
            <div style={{ background: P.amber, borderRadius: 8, padding: "12px 14px", marginBottom: 12, borderLeft: `3px solid ${P.gold}` }}>
              <strong style={{ color: P.gold }}>The model:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Paid stipends for residents who serve as the eyes and ears on each block. Most blocks already have one informally — they know who they are. We compensate them for work they're already doing.</span>
            </div>
            <Kv k="Compensation" v="$100/month per steward. Not a salary, a stipend. Recognition for their role. Equates to ~$1,200/yr per steward." accent={P.gold} />
            <Kv k="Coverage" v="One steward per block (roughly 30–50 households per coverage area). 50–80 stewards across the 3-mile SEED zone." accent={P.gold} />
            <Kv k="Responsibilities" v="Report broken streetlights, vandalism, suspicious activity at clinic after hours, kids in unsafe situations. Welcome new residents. Maintain block-level communication channel (text group). Attend monthly steward meeting." accent={P.gold} />
            <Kv k="What Stewards DON'T Do" v="They are NOT cops. They do NOT confront anyone. They do NOT enforce. They report, they connect, they witness. Any confrontation gets escalated to professional staff or law enforcement." accent={P.gold} />
            <Kv k="Selection" v="Self-nominated + neighbor-endorsed. Existing informal leaders prioritized. Diverse representation: must include elderly residents, working-age residents, parents, renters and owners." accent={P.gold} />
            <Kv k="Training" v="20-hour initial training: de-escalation basics, mandatory reporter laws, mental-health first aid, when to call police vs. social services vs. SEED, documentation, confidentiality." accent={P.gold} />
            <Kv k="Annual Cost" v="80 stewards × $1,200/yr = $96,000/yr stipends + $40,000/yr training + coordinator = ~$200,000/yr total." accent={P.gold} />
          </Card>

          <Card accent={P.green} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.green}>🌟 Rewards for Good Citizenship</SectionTitle>
            <Kv k="Bad Actor Reporting Rewards" v="Residents who report vandalism, theft, or other bad acts (with credible information) receive recognition. Could be a $50–$200 community store credit, public acknowledgment, or scholarship credits for kids." accent={P.green} />
            <Kv k="Good Neighbor of the Month" v="Monthly recognition at community meetings. Plaque, photo on the community board, $200 community credit. Nominated by neighbors. Celebrates the people doing right." accent={P.green} />
            <Kv k="Stewardship Honor Roll" v="Annual community awards ceremony recognizing the volunteer hours contributed by residents. Top contributors receive named recognition in community spaces." accent={P.green} />
            <Kv k="Confidentiality" v="All reporting can be anonymous. Reporters' identities protected. Retaliation against reporters is itself a covenant violation handled at the next-tier community accountability level." accent={P.green} />
          </Card>
        </div>
      )}

      {/* EARNED PRIVILEGES */}
      {compSec === "earned" && (
        <div>
          <Card accent={P.slate}>
            <SectionTitle accent={P.slate}>🎟️ Earned Privileges, Not Entitlements</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.slate}` }}>
              <strong style={{ color: P.slate }}>Core principle:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Some core programs are unconditional. Childcare unlocks workforce participation — that IS the contribution. School meals feed kids who can't earn their own food. Healthcare is a human right. But the optional enrichment programs build a participation muscle.</span>
            </div>
            <Kv k="Always Unconditional" v="Childcare (unlocks parent workforce). School meals (feeding children). FQHC clinic (healthcare). Community fridges (food security). Diapers + period products (dignity). Doula support. Legal aid. Microtransit. These are the safety net — no strings." accent={P.slate} />
            <Kv k="Participation-Required Programs" v="Maker space (2 hrs/month volunteer helping new members). Music lessons (4 hrs/semester family service). Pet adoption subsidy (8 hrs community service). Beautification grants (must complete 'good neighbor' training). Small business grants (mandatory mentorship + check-ins)." accent={P.slate} />
            <Kv k="Why This Works" v="Not punitive — builds membership. People who contribute to a community defend it more fiercely. Volunteer hours create the social fabric that makes everything else work." accent={P.slate} />
            <Kv k="How Hours Are Tracked" v="Simple digital portal (or paper-based for non-tech residents). Hours self-reported, signed off by program coordinators. Audit random samples." accent={P.slate} />
            <Kv k="What Counts" v="Stocking community fridges, restocking maker space supplies, leading workshops in your skill area, helping seniors with technology, mentoring kids, attending community meetings, serving on the steward program." accent={P.slate} />
            <Kv k="Hardship Waivers" v="Residents who cannot contribute hours (disabled, working multiple jobs, caregivers for sick family) get automatic waivers. The point is participation, not punishment." accent={P.slate} />
          </Card>

          <Card accent={P.rust} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.rust}>📢 Public Accountability for Damage</SectionTitle>
            <Kv k="The Principle" v="When the plaza gets tagged, the response isn't quiet repair — it's making the cost visible. People who feel ownership get angry on behalf of the community. People who feel like passive recipients shrug." accent={P.rust} />
            <Kv k="The Process" v="When vandalism or theft occurs: (1) Report it. (2) Document it photographically. (3) Calculate the repair cost. (4) Announce at the next community meeting. (5) Explain what the repair cost means — 'this is one scholarship we didn't fund this month.'" accent={P.rust} />
            <Kv k="Example" v="'The plaza was tagged last week. Repair cost $4,000. That's four scholarships we didn't fund this month. Four kids who don't go to summer programs because someone with a spray can decided this wasn't their place.'" accent={P.rust} />
            <Kv k="Make the Externality Visible" v="People who feel ownership get angry. They demand to know who did it. They organize cleanup days. They become the social pressure that makes the next vandalism less likely." accent={P.rust} />
            <Kv k="When the Bad Actor Is Identified" v="See Restorative Justice tab. The community meeting hears the cost, hears the response, and witnesses the consequence. Public visibility is itself the deterrent." accent={P.rust} />
          </Card>
        </div>
      )}

      {/* RESTORATIVE JUSTICE */}
      {compSec === "restore" && (
        <div>
          <Card accent={P.forest}>
            <SectionTitle accent={P.forest}>🌀 Restorative Justice Circles</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.forest}` }}>
              <strong style={{ color: P.forest }}>Instead of the criminal justice system:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> When a kid tags the plaza, when someone steals from the fridge, the response is a community circle where the person who did it sits with the people affected, hears the impact, and works out how to repair it. Cleveland and Oakland have run these programs for years with documented reductions in repeat offenses.</span>
            </div>
            <Kv k="The Circle Process" v="(1) Identify the harm. (2) Identify those affected. (3) Bring everyone together in a structured facilitated meeting. (4) The person who caused harm tells what happened. (5) Those affected describe the impact. (6) Together they work out repair." accent={P.forest} />
            <Kv k="When It's Used" v="Property damage, theft, vandalism, harassment, conflicts between residents. NOT used for: violent crime, sexual assault, repeated serious offenses. Those go through the criminal justice system." accent={P.forest} />
            <Kv k="Specific Consequences (Example)" v="Kid tagged the plaza? Sweep the plaza for a week. Stock the community fridge for a month. Attend mandatory restorative meetings with the volunteers whose work was undermined. Public apology at next community meeting if appropriate." accent={P.forest} />
            <Kv k="The Theft Example" v="Someone stole from the fridge? They come over, they grab the food from the greenhouse, they stock the fridge themselves for 30 days. They face the volunteers whose food they took. They understand the cost." accent={P.forest} />
            <Kv k="Trained Facilitators" v="2 paid facilitators trained in restorative justice methodology. Often formerly incarcerated people themselves — they have credibility with people in conflict. Confidentiality maintained except for child safety and violent threats." accent={P.forest} />
            <Kv k="When It Fails" v="If the person refuses to participate, refuses to repair, or repeats the harm, escalation to traditional consequences: loss of program privileges, banned from spaces for a period, ultimately police involvement. Restorative justice is the FIRST option, not the only option." accent={P.forest} />
            <Kv k="Cost" v="$140,000/yr (2 facilitators + training + meeting space + coordination). Cheaper than even one juvenile court case." accent={P.forest} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>📋 The Cost Transparency Loop</SectionTitle>
            <div style={{ background: P.amber, borderRadius: 8, padding: "14px 16px", marginBottom: 12, borderLeft: `3px solid ${P.gold}` }}>
              <strong style={{ color: P.gold }}>The full cycle:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Damage happens → cost calculated → community informed → bad actor identified → restorative circle → public consequence → repair completed → community witnesses the resolution.</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {[
                { step: "1", title: "Incident", detail: "Damage, theft, or harm reported." },
                { step: "2", title: "Cost Calculation", detail: "Real dollar amount documented. What had to be diverted to repair this." },
                { step: "3", title: "Community Meeting Announcement", detail: "Cost announced publicly. What got cut because of this damage made visible." },
                { step: "4", title: "Investigation", detail: "Stewards + facilitators identify the responsible party. Often resident reports lead to this." },
                { step: "5", title: "Restorative Circle", detail: "Person responsible meets with those affected. Hears impact. Works out repair plan." },
                { step: "6", title: "Public Consequence", detail: "Person performs repair work visibly. Stocks the fridge. Cleans the plaza. Faces neighbors." },
                { step: "7", title: "Resolution Witness", detail: "Community sees the cycle complete. Sees that accountability works. Trusts the system more." },
              ].map(r => (
                <div key={r.step} style={{ display: "grid", gridTemplateColumns: "40px 130px 1fr", gap: 10, padding: "10px 12px", background: P.white, borderRadius: 7, border: `1px solid ${P.rule}`, alignItems: "start" }}>
                  <div style={{ background: P.gold, color: P.white, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, fontFamily: "sans-serif" }}>{r.step}</div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: P.gold, fontFamily: "sans-serif" }}>{r.title}</span>
                  <span style={{ fontSize: 12, color: P.ink, fontFamily: "sans-serif", lineHeight: 1.5 }}>{r.detail}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CURE VIOLENCE */}
      {compSec === "violence" && (
        <div>
          <Card accent={P.rust}>
            <SectionTitle accent={P.rust}>🕊️ The Cure Violence Model — Adapted</SectionTitle>
            <div style={{ background: P.rose, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.rust}` }}>
              <strong style={{ color: P.rust }}>The original program:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> Cure Violence (started in Chicago) trains "violence interrupters" — former gang members, formerly incarcerated people, respected neighborhood figures — who actually have credibility with the people most likely to cause trouble. They intervene before things escalate. Documented reductions in shootings of 40–70% in pilot neighborhoods.</span>
            </div>
            <Kv k="SEED Adaptation" v="At lower-stakes Franklin County levels, we apply the same principle: who in the neighborhood already commands respect from the kids causing trouble? Hire them. Pay them. They become the front-line interveners." accent={P.rust} />
            <Kv k="Who Gets Hired" v="People with lived experience in struggle. Former gang involvement, prior incarceration, recovery from addiction. People who 'made it back' and have credibility with current at-risk youth." accent={P.rust} />
            <Kv k="What They Do" v="They walk the neighborhoods. They know the kids by name. When trouble's brewing, they're the first call before it escalates. They mediate conflicts. They connect kids to programs. They're a presence." accent={P.rust} />
            <Kv k="What They Don't Do" v="They're not cops. They don't have arrest authority. They don't carry weapons. They de-escalate, mediate, and connect. If situations escalate beyond their scope, professional services take over." accent={P.rust} />
            <Kv k="Staffing" v="6–8 community-based 'connectors' (the SEED term — avoids the 'violence interrupter' framing that doesn't quite fit our context). Paid $50K/yr each + benefits. Includes background-checked formerly incarcerated residents reintegrating from Re-Entry City." accent={P.rust} />
            <Kv k="Training" v="80-hour initial training: conflict de-escalation, trauma-informed approaches, crisis intervention, mental health first aid, when to escalate to police vs. social services, documentation." accent={P.rust} />
            <Kv k="Annual Cost" v="$450,000/yr (8 connectors × $50K + benefits + coordinator + training). Funded by DC community-impact budget + DOJ Office of Justice Programs grants." accent={P.rust} />
          </Card>

          <Card accent={P.green} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.green}>👴 Elders With Roles (The Kids Piece)</SectionTitle>
            <div style={{ background: "#F0FAF4", borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.green}` }}>
              <strong style={{ color: P.forest }}>The cultural restoration:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> "The village raises the child" worked in tight communities because any adult could correct any kid, and the kid's parents would back the adult. That norm has been almost completely destroyed in suburban America. We can't rebuild it through programs alone — but we can build the conditions.</span>
            </div>
            <Kv k="Visible Adult Presence" v="Third places, community plaza, library — staffed during the hours kids are likely to be there. Not security, just presence. Adults whose job is to be there." accent={P.green} />
            <Kv k="Youth Programs That Reach Hard Cases" v="The kids causing trouble are usually bored, often lonely, sometimes traumatized. Teen drop-in center, music programs, sports programs, jobs through Re-Entry City — give them somewhere to be and something to do that isn't trouble." accent={P.green} />
            <Kv k="Mentorship at Scale" v="Senior Connection Program already pairs visitors with isolated seniors. Mirror version: every kid identified as 'at-risk' gets a paired adult mentor — not a court-ordered visit, a real relationship. 1 hour/week minimum, paid stipend to mentor." accent={P.green} />
            <Kv k="Real Consequences From Community Members" v="When kids act out, the response includes restorative justice circles, not just authorities. The kid sits with the community member they affected. That community member's voice — not a uniform — delivers the consequence." accent={P.green} />
            <Kv k="Elders Given Roles" v="Senior residents staffed as informal greeters at third places, community plaza, library. They get paid stipends. Kids encounter respected elders daily. That changes the social environment over time." accent={P.green} />
          </Card>
        </div>
      )}

      {/* ROLLOUT */}
      {compSec === "rollout" && (
        <div>
          <Card accent={P.slate}>
            <SectionTitle accent={P.slate}>📅 The 6-Month Pilot Test</SectionTitle>
            <div style={{ background: P.mist, borderRadius: 8, padding: "14px 16px", marginBottom: 14, borderLeft: `3px solid ${P.slate}` }}>
              <strong style={{ color: P.slate }}>The honest reality:</strong>
              <span style={{ fontSize: 13, fontFamily: "sans-serif", color: P.ink }}> We don't know in advance which neighborhoods will rise to this and which won't. Some communities will embrace ownership. Some won't. We start small, in two specific areas, and we measure what happens.</span>
            </div>
            <Kv k="Pilot Zones" v="Pick 2 specific neighborhoods of ~500 households each within the SEED 3-mile zone. One that already shows informal social fabric (block parties happen, neighbors know each other). One that's struggling more." accent={P.slate} />
            <Kv k="Pilot Programs Deployed" v="Stewards program (10 stewards across pilot zones). 2 community fridges. 1 third place (community coffee house). Covenant signing for new program participants. Restorative justice facilitators on call." accent={P.slate} />
            <Kv k="6-Month Metrics" v="(1) Vandalism incidents per quarter (vs. baseline). (2) Number of community-reported incidents resolved without police. (3) Volunteer hours logged per resident. (4) Third place daily visitor count. (5) Resident satisfaction survey (sample 50 households)." accent={P.slate} />
            <Kv k="Success Criteria" v="If vandalism drops, volunteer hours grow, and resident satisfaction rises after 6 months in BOTH zones — expand the model citywide. If one zone succeeds and one struggles — study what made the difference, adapt, retry the struggling zone with adjustments." accent={P.slate} />
            <Kv k="Failure Criteria" v="If both zones show no improvement or get worse, the social-compact model isn't working in this context. Pull back. Programs continue but without the participation-requirement framework. Try again in 18 months with different approach." accent={P.slate} />
            <Kv k="What We Won't Do" v="Won't blame the community if pilots fail. The model could be wrong. The implementation could be wrong. The neighborhood could need different things. SEED's accountability is to the residents, not to its own theories." accent={P.slate} />
          </Card>

          <Card accent={P.gold} style={{ marginTop: 12 }}>
            <SectionTitle accent={P.gold}>📊 Pilot Budget — 6 Months</SectionTitle>
            <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${P.rule}`, marginBottom: 12 }}>
              {[
                { label: "Steward stipends (10 stewards × 6 mo × $100/mo)", cost: "$6,000" },
                { label: "Steward training (initial 20-hr cohort)", cost: "$15,000" },
                { label: "2 community fridges (capital + first restocks)", cost: "$25,000" },
                { label: "1 third place / community coffee house build-out", cost: "$300,000" },
                { label: "Restorative justice facilitator (1 FTE for pilot)", cost: "$45,000" },
                { label: "1 community connector (Cure Violence model pilot)", cost: "$30,000" },
                { label: "Cost transparency platform (simple web reporting)", cost: "$8,000" },
                { label: "Resident satisfaction survey (twice)", cost: "$6,000" },
                { label: "Pilot evaluation + adjustment workshops", cost: "$15,000" },
                { label: "TOTAL 6-MONTH PILOT COST", cost: "$450,000", total: true },
                { label: "Equivalent at full citywide scale (extrapolated)", cost: "~$2.8M/yr", total: true },
              ].map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "9px 14px", borderBottom: `1px solid ${P.rule}`,
                  background: r.total ? `${P.forest}10` : (i % 2 === 0 ? "#fafafa" : P.white)
                }}>
                  <div style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: r.total ? 800 : 400, color: P.ink }}>{r.label}</div>
                  <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 13, color: r.total ? P.forest : P.ink, marginLeft: 16 }}>{r.cost}</span>
                </div>
              ))}
            </div>
            <div style={{ background: P.amber, borderRadius: 8, padding: "12px 14px", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.7, color: P.ink }}>
              <strong style={{ color: P.gold }}>The math:</strong> $450K is 0.045% of the $1B community pledge. Tiny stakes for a model that, if it works, fundamentally transforms how SEED's programs sustain themselves long-term. If it doesn't work — we learned something cheap.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════════════
export default function SeedMaster() {
  const [tab, setTab] = useState("env");
  const [offSec, setOffSec] = useState("infra");
  const [polSec, setPolSec] = useState("rent");
  const [qolSec, setQolSec] = useState("places");
  const [compSec, setCompSec] = useState("principle");

  return (
    <div style={{ fontFamily: "Georgia,serif", background: P.cream, minHeight: "100vh" }}>
      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${P.ink} 0%, #0D2818 55%, ${P.forest} 100%)`,
        padding: "28px 24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(82,183,136,0.08) 0%, transparent 50%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: P.mint, letterSpacing: 3,
            fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>
            SEED INITIATIVE — SITE 1 (KINGSBORO 900 MW) · SITE 2 (BENNETTSVILLE 3 GW)
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 30, color: P.white, fontWeight: 900,
            lineHeight: 1.1 }}>🌱 The World's First<br />Community-First Data Center</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "0 0 16px",
            maxWidth: 600, lineHeight: 1.7, fontStyle: "italic" }}>
            Carbon negative · Infrasound monitored · Closed-loop water · Waste-heat food production · Landfill diversion · Wildlife habitat · Community governed
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Site 1: Kingsboro 900 MW", "Site 2: Bennettsville 3 GW", "World-First Infrasound Monitoring",
              "Carbon Negative", "Closed-Loop Water", "~$3.2M/yr Net Community Cost"].map(t => (
              <span key={t} style={{ background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)", color: P.mint,
                fontSize: 11, padding: "4px 10px", borderRadius: 20,
                fontFamily: "sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ background: P.ink, display: "flex", overflowX: "auto", borderBottom: `3px solid ${P.forest}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 18px", background: tab === t.id ? P.forest : "transparent",
            color: tab === t.id ? P.white : "#999",
            border: "none", cursor: "pointer", fontFamily: "sans-serif",
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
            borderBottom: tab === t.id ? `3px solid ${P.sage}` : "3px solid transparent",
            transition: "all 0.15s" }}>
            <div>{t.label}</div>
            <div style={{ fontSize: 10, opacity: 0.65, fontWeight: 400 }}>{t.sub}</div>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px 20px", maxWidth: 920, margin: "0 auto" }}>
        {tab === "env"       && <EnvTab />}
        {tab === "food"      && <FoodTab />}
        {tab === "energy"    && <EnergyTab />}
        {tab === "community" && <CommunityTab />}
        {tab === "villages"  && <VillagesTab />}
        {tab === "qol"       && <QualityOfLifeTab qolSec={qolSec} setQolSec={setQolSec} />}
        {tab === "compact"   && <SocialCompactTab compSec={compSec} setCompSec={setCompSec} />}
        {tab === "capital"   && <CapitalTab />}
        {tab === "offsite"   && <OffsiteTab offSec={offSec} setOffSec={setOffSec} />}
        {tab === "politics"  && <PoliticsTab polSec={polSec} setPolSec={setPolSec} />}
      </div>

      <div style={{ background: P.ink, color: "rgba(255,255,255,0.35)", padding: "12px 24px",
        textAlign: "center", fontSize: 11, fontFamily: "sans-serif" }}>
        SEED Initiative · Site 1: Kingsboro 900 MW · Site 2: Bennettsville 3 GW · Tanner South, Northrop Grumman Aeronautics Systems · tanner.south@ngc.com
      </div>
    </div>
  );
}
