---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import { getCollection } from 'astro:content';

const authorMeta: Record<string, any> = {
  tanner_south: {
    name: 'Tanner South',
    title: 'Co-Founder & Environmental Infrastructure Reporter',
    bio: 'Tanner South is the co-founder of The Footprint and a lifelong conservationist. He founded SPLASH — Students Protecting Land and Sea Habitats — in high school, organizing coastal cleanups and habitat restoration projects that continued well past graduation. He brings that same on-the-ground accountability lens to data center infrastructure: who is actually accountable for the water consumed, the land cleared, and the emissions produced. Tanner covers infrastructure development, power sourcing, and the gap between corporate sustainability pledges and operational reality.',
    topics: ['Water Consumption', 'Land Use', 'Carbon Emissions', 'Power Sourcing', 'Greenwashing', 'Coastal Ecosystems', 'Community Impact'],
    twitter: '@TannerSouthDCP'
  },
  nathan_south: {
    name: 'Nathan South',
    title: 'Co-Founder & Environmental Science Correspondent',
    bio: 'Nathan South is the co-founder of The Footprint and a graduate researcher in molecular biology, with internship experience at NASA studying environmental systems. He brings a scientist\'s rigor to infrastructure journalism — examining not just the headline emissions numbers but the downstream biological and ecological effects that rarely make it into press releases. Nathan covers thermal pollution in waterways, electromagnetic effects on local wildlife corridors, chemical runoff from cooling systems, and what large-scale land conversion actually means at the cellular and ecosystem level.',
    topics: ['Biological Impact', 'Thermal Pollution', 'Watershed Hydrology', 'Ecosystem Disruption', 'Molecular Environmental Science', 'NASA Research', 'Wildlife Corridors'],
    twitter: '@NathanSouthDCP'
  },
};

export async function getStaticPaths() {
  return ['tanner_south', 'nathan_south'].map(key => ({
    params: { author: key }
  }));
}

const { author } = Astro.params;
const meta = authorMeta[author] || { name: author, title: 'Reporter', bio: '', topics: [] };
const allArticles = await getCollection('articles');
const authorArticles = allArticles
  .filter(a => a.data.authorKey === author)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title={`${meta.name} — The Footprint`}>
  <Header />
  <main class="max-w-7xl mx-auto px-4 py-10 flex-1">
    <div class="flex items-start gap-6 mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
      <div class="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
        {meta.name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{meta.name}</h1>
        <p class="text-green-700 dark:text-green-400 font-medium">{meta.title}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-2xl leading-relaxed">{meta.bio}</p>
        <div class="flex flex-wrap gap-1.5 mt-3">
          {meta.topics.map((t: string) => (
            <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{t}</span>
          ))}
        </div>
        {meta.twitter && (
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">{meta.twitter}</p>
        )}
      </div>
    </div>
    <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-5">
      {authorArticles.length} Article{authorArticles.length !== 1 ? 's' : ''} by {meta.name}
    </h2>
    {authorArticles.length === 0 ? (
      <p class="text-gray-500 dark:text-gray-400">No articles published yet.</p>
    ) : (
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorArticles.map(article => (
          <ArticleCard
            title={article.data.title}
            excerpt={article.data.excerpt}
            author={article.data.author}
            authorKey={article.data.authorKey}
            date={article.data.date}
            category={article.data.category}
            slug={article.slug}
            size="medium"
          />
        ))}
      </div>
    )}
  </main>
  <Footer />
</BaseLayout>
