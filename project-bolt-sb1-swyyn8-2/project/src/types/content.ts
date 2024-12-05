export interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  keywords: Keyword[];
  suggestedInternalLinks: string[];
  seoScore: number;
}

export interface Keyword {
  term: string;
  score: number;
  type: 'topic' | 'content';
}

export interface OptimizedContent {
  title: string;
  content: string;
  excerpt: string;
  seoScore: number;
  suggestedLinks: string[];
}

export interface ContentMetrics {
  wordCount: number;
  readingTime: number;
  keywordDensity: Map<string, number>;
  readabilityScore: number;
}