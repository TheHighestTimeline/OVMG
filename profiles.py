---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="About — The Footprint" description="Environmental accountability journalism for the data center industry.">
  <Header />
  <main class="max-w-3xl mx-auto px-4 py-12 flex-1">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">About The Footprint</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-8 text-sm">Environmental accountability journalism for the data center industry</p>

    <div class="prose prose-lg dark:prose-invert max-w-none">

      <p>The Footprint covers the data center industry through a strict environmental lens. Every story asks the questions the industry would rather not answer: How much water does this facility consume daily? What watershed does it draw from? Where does the power come from — and what does that actually mean for emissions? What lived in the land before the first shovel broke ground?</p>

      <p>Data centers are among the fastest-growing consumers of energy, water, and land on earth. They are also among the least scrutinized. The Footprint exists to change that.</p>

      <h2>Our Mission</h2>
      <p>To provide rigorous, fact-based environmental accountability reporting on data center infrastructure — for industry professionals, policymakers, local communities, and anyone who wants to understand the ecological cost of the digital economy. We believe data centers can be part of a sustainable future. We also believe that future requires honesty about the gap between what the industry promises and what it actually delivers.</p>

      <h2>Who We Are</h2>

      <h3>Tanner South — Co-Founder & Environmental Infrastructure Reporter</h3>
      <p>Tanner founded SPLASH — Students Protecting Land and Sea Habitats — in high school, organizing coastal cleanups and habitat restoration projects across South Florida. That hands-on conservation work never stopped. He brings the same on-the-ground accountability lens to data center infrastructure: tracking what gets built, what gets consumed, and what gets left behind. Tanner covers power sourcing, water usage, land use, and the growing gap between corporate sustainability pledges and operational reality.</p>

      <h3>Nathan South — Co-Founder & Environmental Science Correspondent</h3>
      <p>Nathan is a graduate researcher in molecular biology with internship experience at NASA studying environmental systems. He brings a scientist's rigor to infrastructure journalism — examining not just headline emissions figures but the downstream biological and ecological effects that rarely make it into press releases. Nathan covers thermal pollution in waterways, ecosystem disruption from large-scale land conversion, chemical runoff from cooling systems, and what industrial-scale water withdrawal actually means at the biological level.</p>

      <h2>Editorial Standards</h2>
      <p>Every article published in The Footprint is sourced from real news events and processed through multiple editorial steps. We do not copy source material — we synthesize facts from multiple outlets and produce original environmental analysis. We attribute breaking news to the outlets that broke it. We do not invent data; when environmental metrics are not publicly disclosed, we say so explicitly and treat that silence as part of the story. We do not accept sponsored content or allow advertisers to influence coverage.</p>

      <h2>Contact</h2>
      <p>The Footprint publishes new articles daily. For tips, corrections, or editorial inquiries, use the contact form below or reach us on social media.</p>

    </div>
  </main>
  <Footer />
</BaseLayout>
