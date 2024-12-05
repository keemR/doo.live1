import natural from 'natural';
import compromise from 'compromise';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import slugify from 'slugify';
import { SummarizerManager } from 'node-summarizer';

const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

async function generateUniqueArticle(sourceContent) {
  try {
    // Extract key sentences and concepts
    const summarizer = new SummarizerManager(sourceContent, 5);
    const summary = await summarizer.getSummaryByRank();
    
    // Analyze and extract key topics
    const doc = compromise(sourceContent);
    const topics = doc.topics().json();
    
    // Generate TF-IDF scores
    tfidf.addDocument(sourceContent);
    const keywords = [];
    tfidf.listTerms(0).forEach(item => {
      if (item.score > 0.5) {
        keywords.push(item.term);
      }
    });

    // Rewrite content using extracted information
    const sentences = natural.SentenceTokenizer.tokenize(sourceContent);
    let rewrittenContent = '';

    sentences.forEach(sentence => {
      const tokens = tokenizer.tokenize(sentence);
      const rewrittenSentence = tokens
        .map(token => {
          const synonyms = natural.WordNet.lookupSynonyms(token);
          return synonyms.length > 0 ? synonyms[0] : token;
        })
        .join(' ');
      rewrittenContent += rewrittenSentence + ' ';
    });

    // Combine summary with rewritten content
    return `${summary}\n\n${rewrittenContent}`;
  } catch (error) {
    console.error('Error generating article:', error);
    return null;
  }
}

async function processArticles() {
  const rawContent = JSON.parse(
    await readFile(join(process.cwd(), 'src/data/raw-content.json'), 'utf-8')
  );

  const processedArticles = [];

  for (const article of rawContent) {
    const uniqueContent = await generateUniqueArticle(article.content);
    if (uniqueContent) {
      const slug = slugify(article.title, { lower: true });
      
      processedArticles.push({
        title: article.title,
        content: uniqueContent,
        slug,
        category: article.category,
        pubDate: article.pubDate,
        originalSource: article.source
      });
    }
  }

  await writeFile(
    join(process.cwd(), 'src/content/articles.json'),
    JSON.stringify(processedArticles, null, 2)
  );
}

processArticles();