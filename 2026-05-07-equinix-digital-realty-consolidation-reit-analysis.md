---
export interface Props {
  title: string;
  excerpt: string;
  author: string;
  authorKey: string;
  date: Date;
  category: string;
  slug: string;
  featured?: boolean;
  size?: 'large' | 'medium' | 'small';
}
const { title, excerpt, author, authorKey, date, category, slug, featured = false, size = 'medium' } = Astro.props;

const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
const articleUrl = `/articles/${slug}`;

const categoryColors: Record<string, string> = {
  Infrastructure: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Cloud: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  AI: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Sustainability: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Markets: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Policy: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};
const catColor = categoryColors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
---

{size === 'large' ? (
  <article class="group border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
    <div class="flex items-center gap-2 mb-3">
      <span class={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${catColor}`}>{category}</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
    </div>
    <a href={articleUrl} class="block mb-3">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{title}</h2>
    </a>
    <p class="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4 max-w-2xl">{excerpt}</p>
    <div class="flex items-center gap-3">
      <a href={`/authors/${authorKey}`} class="flex items-center gap-2 group/author">
        <div class="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">{author.split(' ').map((n: string) => n[0]).join('')}</div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/author:text-brand-600 dark:group-hover/author:text-brand-400">{author}</span>
      </a>
      <span class="text-gray-400">·</span>
      <a href={articleUrl} class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">Read more →</a>
    </div>
  </article>
) : size === 'medium' ? (
  <article class="group flex flex-col border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-gray-800/50 transition-all bg-white dark:bg-gray-900">
    <div class="flex items-center gap-2 mb-3">
      <span class={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${catColor}`}>{category}</span>
      <span class="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
    </div>
    <a href={articleUrl} class="block mb-2 flex-1">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-3">{title}</h3>
    </a>
    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">{author.split(' ').map((n: string) => n[0]).join('')}</div>
      <a href={`/authors/${authorKey}`} class="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">{author}</a>
    </div>
  </article>
) : (
  <article class="group flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class={`text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${catColor}`}>{category}</span>
      </div>
      <a href={articleUrl}>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug line-clamp-2">{title}</h4>
      </a>
      <div class="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{author}</span>
        <span>·</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  </article>
)}
