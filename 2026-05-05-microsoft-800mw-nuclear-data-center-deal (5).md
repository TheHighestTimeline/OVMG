---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map(article => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content } = await article.render();
const { title, author, authorKey, date, category, excerpt, tags, image, imageAlt, imageCreditName, imageCreditUrl, imageUnsplashUrl } = article.data;

const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'long', day: 'numeric'
}).format(date);
---

<BaseLayout title={`${title} — The Footprint`} description={excerpt}>
  <Header />

  <main class="flex-1 bg-white dark:bg-gray-950">

    <!-- Article header band -->
    <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div class="max-w-4xl mx-auto px-6 pt-10 pb-8">

        <!-- Breadcrumb + category -->
        <div class="flex items-center gap-3 mb-5">
          <a href={`/category/${category.toLowerCase()}`}
             class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {category}
          </a>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <a href="/" class="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{category}</span>
        </div>

        <!-- Headline -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-5">
          {title}
        </h1>

        <!-- Deck / excerpt -->
        <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-light">
          {excerpt}
        </p>

        <!-- Byline row -->
        <div class="flex items-center justify-between flex-wrap gap-4 pt-5 border-t border-gray-200 dark:border-gray-800">
          <a href={`/authors/${authorKey}`} class="flex items-center gap-3 group">
            <div class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {author.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <div class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                {author}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">The Footprint</div>
            </div>
          </a>
          <time class="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
        </div>
      </div>
    </div>

    <!-- Article body + sidebar -->
    <div class="max-w-6xl mx-auto px-6 py-10">
      <div class="flex gap-16">

        <!-- Main content -->
        <article class="min-w-0 flex-1">

          {image && (
            <div class="mb-8">
              <img
                src={image}
                alt={imageAlt || title}
                class="w-full rounded-sm object-cover max-h-96"
              />
              {imageCreditName && (
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                  Photo by <a href={imageCreditUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-600">{imageCreditName}</a> on <a href={imageUnsplashUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-gray-600">Unsplash</a>
                </p>
              )}
            </div>
          )}

          <div class="article-body prose prose-lg dark:prose-invert max-w-none">
            <Content />
          </div>

          <!-- Tags -->
          {tags.length > 0 && (
            <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <span class="text-xs font-bold uppercase tracking-widest text-gray-400 mr-3">Topics</span>
              {tags.map((tag: string) => (
                <span class="inline-block px-3 py-1 mr-2 mb-2 text-xs rounded-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <!-- Sidebar -->
        <aside class="hidden lg:block w-72 flex-shrink-0">
          <div class="sticky top-24 space-y-6">

            <!-- Author card -->
            <div class="border border-gray-200 dark:border-gray-800 rounded-sm p-5">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">About the author</p>
              <a href={`/authors/${authorKey}`} class="flex flex-col items-center text-center group">
                <div class="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                  {author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{author}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Staff Reporter</p>
                <p class="text-xs text-blue-600 dark:text-blue-400 mt-3 font-medium">View all articles →</p>
              </a>
            </div>

            <!-- More from The Footprint -->
            <div class="border border-gray-200 dark:border-gray-800 rounded-sm p-5">
              <p class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Subscribe</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Get the day's top data center and infrastructure news delivered to your inbox.
              </p>
              <a href="/"
                 class="block w-full text-center text-xs font-bold uppercase tracking-wider px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-sm">
                Sign up free
              </a>
            </div>

          </div>
        </aside>

      </div>
    </div>
  </main>

  <Footer />
</BaseLayout>

<style>
  .article-body :global(h2) {
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: #111827;
    letter-spacing: -0.01em;
  }

  :global(.dark) .article-body :global(h2) {
    color: #f9fafb;
  }

  .article-body :global(h3) {
    font-size: 1.1rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
    padding: 0.4rem 0.75rem;
    border-left: 3px solid #16a34a;
    background: #f0fdf4;
    color: #14532d;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  :global(.dark) .article-body :global(h3) {
    background: #052e16;
    border-left-color: #4ade80;
    color: #bbf7d0;
  }

  .article-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
  }

  .article-body :global(th) {
    background: #f0fdf4;
    color: #14532d;
    font-weight: 700;
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 2px solid #16a34a;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  :global(.dark) .article-body :global(th) {
    background: #052e16;
    color: #4ade80;
    border-bottom-color: #16a34a;
  }

  .article-body :global(td) {
    padding: 0.65rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    vertical-align: top;
  }

  :global(.dark) .article-body :global(td) {
    border-bottom-color: #1f2937;
    color: #d1d5db;
  }

  .article-body :global(tr:last-child td) {
    border-bottom: none;
  }

  .article-body :global(tr:nth-child(even) td) {
    background: #f9fafb;
  }

  :global(.dark) .article-body :global(tr:nth-child(even) td) {
    background: #111827;
  }

  .article-body :global(p) {
    font-size: 1.125rem;
    line-height: 1.85;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  :global(.dark) .article-body :global(p) {
    color: #d1d5db;
  }

  .article-body :global(strong) {
    font-weight: 600;
    color: #111827;
  }

  :global(.dark) .article-body :global(strong) {
    color: #f3f4f6;
  }

  .article-body :global(blockquote) {
    border-left: 3px solid #2563eb;
    padding-left: 1.25rem;
    margin: 2rem 0;
    font-style: italic;
    color: #374151;
  }

  :global(.dark) .article-body :global(blockquote) {
    color: #9ca3af;
  }
</style>
