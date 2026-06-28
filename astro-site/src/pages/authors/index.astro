---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const authors = [
  {
    key: 'tanner_south',
    name: 'Tanner South',
    title: 'Co-Founder & Environmental Infrastructure Reporter',
    bio: 'Tanner South founded SPLASH — Students Protecting Land and Sea Habitats — in high school, organizing coastal cleanups and habitat restoration projects across South Florida. He covers infrastructure development, power sourcing, and the gap between corporate sustainability pledges and operational reality.',
    topics: ['Water Consumption', 'Land Use', 'Carbon Emissions', 'Power Sourcing', 'Greenwashing'],
    twitter: '@TannerSouthDCP'
  },
  {
    key: 'nathan_south',
    name: 'Nathan South',
    title: 'Co-Founder & Environmental Science Correspondent',
    bio: 'Nathan South is a graduate researcher in molecular biology with internship experience at NASA studying environmental systems. He covers thermal pollution in waterways, ecosystem disruption from large-scale land conversion, and what industrial-scale water withdrawal means at the biological level.',
    topics: ['Biological Impact', 'Thermal Pollution', 'Watershed Hydrology', 'Ecosystem Disruption', 'NASA Research'],
    twitter: '@NathanSouthDCP'
  }
];

const allArticles = await getCollection('articles');
---
<BaseLayout title="Our Team — The Footprint">
  <Header />
  <main class="max-w-7xl mx-auto px-4 py-12 flex-1">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Team</h1>
      <p class="text-gray-600 dark:text-gray-400">The Footprint is independent environmental journalism from two brothers — a conservationist and a molecular biologist.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {authors.map(author => {
        const authorArticles = allArticles.filter(a => a.data.authorKey === author.key);
        return (
          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <a href={`/authors/${author.key}`} class="font-bold text-lg text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-400">{author.name}</a>
                <p class="text-sm text-green-700 dark:text-green-400 font-medium">{author.title}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''} published</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-1">{author.bio}</p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              {author.topics.map(t => (
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{t}</span>
              ))}
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400 dark:text-gray-500">{author.twitter}</span>
              <a href={`/authors/${author.key}`} class="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline">View all articles →</a>
            </div>
          </div>
        );
      })}
    </div>
  </main>
  <Footer />
</BaseLayout>
