import type { Article } from '../types';

export function generateMetaTags(article: Article) {
  return {
    title: article.title,
    description: article.description,
    keywords: generateKeywords(article),
    canonical: `https://healthylife.com/articles/${article.slug}`,
    ogImage: article.image,
    structuredData: generateStructuredData(article)
  };
}

function generateKeywords(article: Article): string[] {
  const baseKeywords = ['health', 'wellness', article.category.toLowerCase()];
  const titleWords = article.title
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3);
  
  return [...new Set([...baseKeywords, ...titleWords])];
}

function generateStructuredData(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date?.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'HealthyLife'
    },
    publisher: {
      '@type': 'Organization',
      name: 'HealthyLife',
      logo: {
        '@type': 'ImageObject',
        url: 'https://healthylife.com/logo.png'
      }
    }
  };
}