import type { OptimizedContent } from '../../types';
import { GrammarBot } from 'grammarbot';

const grammarBot = new GrammarBot();

export async function optimizeContent(
  content: string,
  keywords: Array<{ term: string; score: number }>
): Promise<OptimizedContent> {
  // Check grammar and readability
  const { matches } = await grammarBot.check(content);
  let optimizedContent = content;
  
  // Apply grammar corrections
  matches.forEach(match => {
    optimizedContent = optimizedContent.replace(
      match.context.text,
      match.replacements[0] || match.context.text
    );
  });
  
  // Optimize keyword density
  optimizedContent = optimizeKeywordDensity(optimizedContent, keywords);
  
  // Generate SEO-friendly title
  const title = generateSEOTitle(optimizedContent, keywords);
  
  // Generate excerpt
  const excerpt = generateExcerpt(optimizedContent);
  
  // Calculate SEO score
  const seoScore = calculateSEOScore(optimizedContent, title, excerpt, keywords);
  
  // Find opportunities for additional internal links
  const suggestedLinks = findLinkOpportunities(optimizedContent);
  
  return {
    title,
    content: optimizedContent,
    excerpt,
    seoScore,
    suggestedLinks
  };
}

function optimizeKeywordDensity(
  content: string,
  keywords: Array<{ term: string; score: number }>
): string {
  let optimized = content;
  
  keywords.forEach(({ term, score }) => {
    const density = calculateKeywordDensity(optimized, term);
    if (density < 0.01) { // Less than 1%
      optimized = increaseKeywordDensity(optimized, term);
    } else if (density > 0.03) { // More than 3%
      optimized = decreaseKeywordDensity(optimized, term);
    }
  });
  
  return optimized;
}

function calculateKeywordDensity(content: string, keyword: string): number {
  const wordCount = content.split(/\s+/).length;
  const keywordCount = content.toLowerCase().split(keyword.toLowerCase()).length - 1;
  return keywordCount / wordCount;
}

function generateSEOTitle(content: string, keywords: Array<{ term: string; score: number }>): string {
  // Extract the first sentence
  const firstSentence = content.split('.')[0];
  
  // Include the highest-scoring keyword if not present
  const topKeyword = keywords[0].term;
  if (!firstSentence.toLowerCase().includes(topKeyword.toLowerCase())) {
    return `${topKeyword}: ${firstSentence}`;
  }
  
  return firstSentence;
}

function generateExcerpt(content: string): string {
  const sentences = content.split('.');
  return sentences.slice(0, 2).join('.') + '.';
}

function calculateSEOScore(
  content: string,
  title: string,
  excerpt: string,
  keywords: Array<{ term: string; score: number }>
): number {
  let score = 100;
  
  // Title length check (50-60 characters ideal)
  if (title.length < 50) score -= 5;
  if (title.length > 60) score -= 5;
  
  // Excerpt length check (145-165 characters ideal)
  if (excerpt.length < 145) score -= 5;
  if (excerpt.length > 165) score -= 5;
  
  // Content length check (minimum 1500 words recommended)
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 1500) score -= 10;
  
  // Keyword density checks
  keywords.forEach(({ term }) => {
    const density = calculateKeywordDensity(content, term);
    if (density < 0.01 || density > 0.03) score -= 5;
  });
  
  return Math.max(0, score);
}

function findLinkOpportunities(content: string): string[] {
  // Find phrases that could be linked to other content
  const sentences = content.split('.');
  const opportunities: string[] = [];
  
  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/);
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = words.slice(i, i + 3).join(' ');
      if (isLinkWorthy(phrase)) {
        opportunities.push(phrase);
      }
    }
  });
  
  return opportunities;
}

function isLinkWorthy(phrase: string): boolean {
  // Check if phrase is a good candidate for linking
  const commonWords = new Set(['the', 'and', 'or', 'but', 'for', 'nor', 'yet', 'so']);
  const words = phrase.toLowerCase().split(/\s+/);
  
  // Phrase should not be mostly common words
  const meaningfulWords = words.filter(word => !commonWords.has(word));
  return meaningfulWords.length >= 2;
}