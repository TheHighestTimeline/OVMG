---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const categories = ['infrastructure', 'cloud', 'ai', 'sustainability', 'markets', 'policy'];
  return categories.map(cat => ({ params: { category: cat } }));
}

const { category } = Astro.params;
const displayName = category.charAt(0).toUpperCase() + category.slice(1);
const allArticles = await getCollection('articles');
const filtered = allArticles
  .filter(a => a.data.category.toLowerCase() === category)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title={`${displayName} — The Footprint`}>
  <Header />
  <main class="max-w-7xl mx-auto px-4 py-8 flex-1">
    <div class="mb-8">
      <div class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Coverage Area</div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</p>
    </div>
    {filtered.length === 0 ? (
      <div class="text-center py-16">
        <p class="text-gray-500 dark:text-gray-400 text-lg">No articles yet in this category.</p>
        <a href="/" class="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">← Back to all articles</a>
      </div>
    ) : (
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(article => (
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
