import type { Article } from '../../types';

export function generateInternalLinks(content: string, relatedArticles: Article[]): string {
  let contentWithLinks = content;
  
  // Sort articles by relevance to current content
  const sortedArticles = sortArticlesByRelevance(content, relatedArticles);
  
  // Add links to the most relevant articles
  sortedArticles.slice(0, 5).forEach(article => {
    const anchor = findBestAnchorText(content, article);
    if (anchor) {
      contentWithLinks = addLink(contentWithLinks, anchor, article.href);
    }
  });
  
  return contentWithLinks;
}

function sortArticlesByRelevance(content: string, articles: Article[]): Article[] {
  return articles.sort((a, b) => {
    const scoreA = calculateRelevanceScore(content, a);
    const scoreB = calculateRelevanceScore(content, b);
    return scoreB - scoreA;
  });
}

function calculateRelevanceScore(content: string, article: Article): number {
  const words = content.toLowerCase().split(/\W+/);
  const titleWords = article.title.toLowerCase().split(/\W+/);
  const descriptionWords = article.description.toLowerCase().split(/\W+/);
  
  let score = 0;
  [...titleWords, ...descriptionWords].forEach(word => {
    if (words.includes(word)) {
      score += 1;
    }
  });
  
  return score;
}

function findBestAnchorText(content: string, article: Article): string | null {
  const titleWords = article.title.toLowerCase().split(/\W+/);
  const contentWords = content.toLowerCase().split(/\W+/);
  
  // Find the best matching phrase in content
  let bestMatch = null;
  let bestScore = 0;
  
  for (let i = 0; i < contentWords.length - 2; i++) {
    const phrase = contentWords.slice(i, i + 3).join(' ');
    const score = calculatePhraseScore(phrase, titleWords);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = phrase;
    }
  }
  
  return bestMatch;
}

function addLink(content: string, anchor: string, href: string): string {
  const regex = new RegExp(`\\b${anchor}\\b`, 'i');
  return content.replace(regex, `<a href="${href}">${anchor}</a>`);
}