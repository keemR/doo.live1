import natural from 'natural';
import type { Keyword } from '../../types';

export function generateKeywords(topic: string, content: string): Keyword[] {
  const tfidf = new natural.TfIdf();
  
  // Add the content to TF-IDF
  tfidf.addDocument(content);
  
  // Get topic-specific keywords
  const topicKeywords = extractTopicKeywords(topic);
  
  // Get content-based keywords using TF-IDF
  const contentKeywords = extractContentKeywords(tfidf);
  
  // Combine and score keywords
  return scoreAndRankKeywords([...topicKeywords, ...contentKeywords]);
}

function extractTopicKeywords(topic: string): Keyword[] {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(topic);
  
  return tokens.map(token => ({
    term: token.toLowerCase(),
    score: 1,
    type: 'topic'
  }));
}

function extractContentKeywords(tfidf: natural.TfIdf): Keyword[] {
  return tfidf
    .listTerms(0)
    .slice(0, 20)
    .map(term => ({
      term: term.term,
      score: term.score,
      type: 'content'
    }));
}

function scoreAndRankKeywords(keywords: Keyword[]): Keyword[] {
  // Remove duplicates and combine scores
  const uniqueKeywords = new Map<string, Keyword>();
  
  keywords.forEach(keyword => {
    if (uniqueKeywords.has(keyword.term)) {
      const existing = uniqueKeywords.get(keyword.term)!;
      existing.score += keyword.score;
    } else {
      uniqueKeywords.set(keyword.term, { ...keyword });
    }
  });
  
  // Convert back to array and sort by score
  return Array.from(uniqueKeywords.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}