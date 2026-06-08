---
title: "The Data Center Industry Just Quietly Admitted Air Cooling Can't Keep Up"
date: 2026-05-08
author: "Tanner South"
authorKey: "tanner_south"
excerpt: "Racks pulling 15 kilowatts three years ago now pull 130. Air cooling didn't scale to meet that — the industry mutated around it. And the water and chemical consequences of liquid cooling at scale are arriving faster than anyone's disclosing."
category: "Infrastructure"
tags: ["cooling technology", "liquid cooling", "water usage", "AI infrastructure", "power consumption", "biocides", "sustainability"]
featured: false
---

## The Ecological Development Brief

Three years ago, a standard hyperscale rack pulled 8 to 15 kilowatts. You cooled it the same way the industry had cooled racks since the 1980s — move cold air across hot metal, exhaust the heat, repeat. It worked because the thermal loads were manageable.

They're not manageable anymore.

Nvidia's GB200 NVL72 racks dissipate roughly 120 kilowatts each. That's nearly ten times what a 2019 enterprise rack handled. Air, at the flow rates achievable inside a rack without destroying components, cannot carry that much heat away. That's not a design challenge. It's physics. And the industry's quiet acknowledgment of it — in the form of a rapid, sector-wide shift toward liquid cooling — is one of the more significant under-reported infrastructure stories going right now. Not because of what it means for energy efficiency. Because of what it means for water.

Tom Carroll at ebm-papst Americas has been telling OEM partners that 2026 belongs to hybrid cooling: liquid-to-the-chip for GPU modules, high-efficiency air handlers for memory and storage, rear-door heat exchangers bridging the thermal zones. That's the practical answer for facilities needing to run current AI hardware without replacing their entire mechanical plant. But hybrid cooling is a transitional architecture, not a destination. And the water and chemical footprint of liquid cooling at full hyperscale deployment hasn't gotten proportional attention alongside the efficiency gains the vendors are promoting.

## Water & Cooling Impact Analysis

Here's what the cooling vendors don't lead with: liquid cooling doesn't automatically reduce water consumption. In some configurations, it increases it.

Air-cooled facilities in dry climates can run economizer modes during cool weather — rejecting heat directly to the atmosphere without evaporative loss. Liquid-cooled facilities running continuous heat rejection through cooling towers consume water year-round, tracking the AI rack thermal load, which runs near-continuous high utilization during training workloads. A 200-megawatt AI campus under liquid cooling with evaporative heat rejection can use 500,000 to 1.5 million gallons of water per day depending on cooling tower design and local wet-bulb conditions. I haven't seen that number disclosed proactively by any facility announcement I've tracked. It's not required. It should be.

But volume is only part of it. Closed-loop liquid cooling systems use heat transfer fluids — treated water with corrosion inhibitors, biocides, and pH adjustment chemicals. They require periodic blowdown: deliberate discharge of a fraction of the coolant volume to control dissolved solids buildup. That blowdown carries treatment chemicals into municipal wastewater. The specific biocide compounds in common use — isothiazolones, glutaraldehyde, quaternary ammonium salts — are acutely toxic to aquatic invertebrates at concentrations well below what conventional treatment handles. The chemical fate of cooling system blowdown in receiving watersheds, at the scale that liquid-cooled AI deployments will produce as they scale, hasn't been characterized. That gap is going to matter.

Worth noting on the efficiency side: the high-voltage DC power distribution shift happening in parallel does have an indirect water benefit. Cutting conversion stages from six to two recovers 3 to 5 percent of total facility power — less heat to reject, lower evaporative cooling load, less water consumed. At gigawatt scale that's a real reduction. But it's not being calculated or disclosed as a water benefit anywhere I've seen. The efficiency gains get reported as energy savings. The water savings stay implicit.

## Power Grid & Emissions Profile

Grid operators are the constraint that no cooling innovation gets around. Northern Virginia, Dublin, and Singapore have all implemented interconnection moratoriums or significant restrictions on new approvals in the past 18 months. PJM's queue for new large-load customers runs past 2030. Operators who locked power agreements in 2022 and 2023 have a structural position nobody else can buy their way into right now.

Switchgear lead times hit 80 weeks during the worst of the supply crunch. That made it functionally impossible to respond to customer demand on normal commercial timelines. The response — localized manufacturing in Mexico, the U.S. Southeast, Eastern Europe — reduces shipping distances and tariff exposure. Shorter supply chains are generally better for emissions. But the industrial buildout required to localize that manufacturing carries its own land footprint and arrives before the efficiency gains do.

Tariffs sharpened the localization argument. AI deployment cadence forced the actual decision. When you're building a $4 billion campus and the switchgear is stuck on a container ship, supply chain becomes a board-level conversation fast. What doesn't become a board-level conversation is what happens to the watershed two miles downstream from the cooling towers — even though the volume of water those towers consume and the chemistry of what they discharge is, at AI scale, a genuinely significant environmental variable. That asymmetry is the problem.

## Sustainability Metrics

| Ecological & Technical Metric | Project Specification |
| :--- | :--- |
| AI Rack Thermal Density (2026) | 120–130 kW per rack (Nvidia GB200 NVL72) |
| Air Cooling Practical Limit | ~25–30 kW per rack |
| Liquid Cooling Water Consumption | 500K–1.5M gallons/day estimated for 200MW AI campus |
| High-Voltage DC Power Recovery | 3–5% of facility power vs. traditional AC distribution |
| Interconnection Queue (PJM) | New large-load customers queued past 2030 |
| Switchgear Lead Times | Up to 80 weeks at peak supply constraint |
| Cooling Blowdown Chemistry | Not standard in facility environmental disclosures |
| Biocide Compounds in Common Use | Isothiazolones, glutaraldehyde, quaternary ammonium salts |

## Land Conservation & Community Impact

Facilities built to house liquid-cooled AI infrastructure are physically larger than their air-cooled predecessors for a given IT load. The mechanical plant — cooling distribution units, rear-door heat exchangers, chilled water loops, cooling towers — adds footprint that the compute density gains don't fully offset. A campus sized for 100 megawatts of liquid-cooled AI compute needs more land for its mechanical plant than the equivalent air-cooled facility. Planning commissions aren't accounting for that. It's a real land use variable that's currently invisible in the zoning and permitting process.

Communities downstream of the cooling towers have a legitimate stake in the water consumption and discharge chemistry conversation. They're not at the table. Data center environmental review in most jurisdictions doesn't require facility-level water withdrawal disclosure, doesn't require blowdown chemistry disclosure, and doesn't require post-operational monitoring of receiving water quality. What gets built is effectively a major new industrial water user with chemical discharge into the municipal wastewater stream, reviewed under permit processes designed for far lower-impact facilities.

Watch which operators publish PUE numbers that include cooling-loop pumping losses in the denominator. Watch which ones quietly redefine the denominator when the numbers get inconvenient. The companies treating the cooling transition honestly — the water volume, the discharge chemistry, the mechanical plant footprint — are the ones worth believing when they make sustainability claims. The ones who lead with efficiency ratios and stop there are telling you exactly as much as they're required to. Which isn't enough.
