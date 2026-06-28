---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ArticleCard from '../components/ArticleCard.astro';
import { getCollection } from 'astro:content';

const allArticles = await getCollection('articles');
const sorted = allArticles.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const featured = sorted[0];
const secondary = sorted.slice(1, 3);
const grid = sorted.slice(3, 9);
const sidebar = sorted.slice(9, 15);
const categories = ['Infrastructure', 'Cloud', 'AI', 'Sustainability', 'Markets', 'Policy'];
---
<BaseLayout title="The Footprint — Infrastructure Intelligence">
  <Header />

  <main class="max-w-7xl mx-auto px-4 py-8 flex-1">

    <!-- Category pill nav -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-8">
      <a href="/" class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-brand-600 text-white">All</a>
      {categories.map(cat => (
        <a href={`/category/${cat.toLowerCase()}`} class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">{cat}</a>
      ))}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main content column -->
      <div class="lg:col-span-2">

        <!-- Featured article -->
        {featured && (
          <ArticleCard
            title={featured.data.title}
            excerpt={featured.data.excerpt}
            author={featured.data.author}
            authorKey={featured.data.authorKey}
            date={featured.data.date}
            category={featured.data.category}
            slug={featured.slug}
            size="large"
          />
        )}

        <!-- Secondary pair -->
        {secondary.length > 0 && (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {secondary.map(article => (
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

        <!-- Grid -->
        {grid.length > 0 && (
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 mb-5">More Stories</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              {grid.map(article => (
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
          </div>
        )}
      </div>

      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <!-- Latest news -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
          <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Latest</h3>
          <div class="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            {sidebar.map(article => (
              <ArticleCard
                title={article.data.title}
                excerpt={article.data.excerpt}
                author={article.data.author}
                authorKey={article.data.authorKey}
                date={article.data.date}
                category={article.data.category}
                slug={article.slug}
                size="small"
              />
            ))}
          </div>
        </div>

        <!-- About box -->
        <div class="bg-brand-900 text-white rounded-xl p-5 mb-6">
          <h3 class="font-bold text-sm uppercase tracking-wider mb-2 text-blue-200">About The Footprint</h3>
          <p class="text-sm text-blue-100/80 leading-relaxed">
            Daily coverage of the data center industry. Infrastructure intelligence for professionals who build, operate, and invest in the backbone of the digital economy.
          </p>
        </div>

        <!-- Topics -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Topics</h3>
          <div class="flex flex-wrap gap-2">
            {categories.map(cat => (
              <a href={`/category/${cat.toLowerCase()}`} class="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">{cat}</a>
            ))}
          </div>
        </div>
      </aside>
    </div>
  </main>

  <Footer />
</BaseLayout>
