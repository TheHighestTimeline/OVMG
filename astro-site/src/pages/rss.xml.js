import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');
  return rss({
    title: 'DataCenter Pulse',
    description: 'The data center industry\'s daily news source.',
    site: context.site,
    items: articles
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map(article => ({
        title: article.data.title,
        pubDate: article.data.date,
        description: article.data.excerpt,
        link: `/articles/${article.slug}/`,
      })),
  });
}
