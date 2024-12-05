import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import natural from 'natural';
import compromise from 'compromise';
import slugify from 'slugify';
import { GrammarBot } from 'grammarbot';

const grammarBot = new GrammarBot();
const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

async function optimizeContent() {
  const articles = JSON.parse(
    await readFile(join(process.cwd(), 'src/content/articles.json'), 'utf-8')
  );

  const optimizedArticles = await Promise.all(
    articles.map(async (article) => {
      // Analyze content with NLP
      const doc = compromise(article.content);
      const topics = doc.topics().json();
      
      // Generate optimized title
      const titleKeywords = topics
        .slice(0, 3)
        .map(t => t.text)
        .join(' ');
      const optimizedTitle = `${titleKeywords}: ${article.title}`;

      // Generate meta description
      const sentences = doc.sentences().json();
      const metaDescription = sentences[0].text.slice(0, 155);

      // Generate tags using TF-IDF
      tfidf.addDocument(article.content);
      const tags = tfidf
        .listTerms(0)
        .slice(0, 6)
        .map(term => term.term);

      // Check grammar and optimize content
      const { matches } = await grammarBot.check(article.content);
      let optimizedContent = article.content;
      matches.forEach(match => {
        optimizedContent = optimizedContent.replace(
          match.context.text,
          match.replacements[0] || match.context.text
        );
      });

      return {
        ...article,
        title: optimizedTitle,
        metaDescription,
        content: optimizedContent,
        tags,
        slug: slugify(optimizedTitle, { lower: true }),
        seoScore: calculateSEOScore({
          title: optimizedTitle,
          description: metaDescription,
          content: optimizedContent,
          tags
        })
      };
    })
  );

  await writeFile(
    join(process.cwd(), 'src/content/optimized-articles.json'),
    JSON.stringify(optimizedArticles, null, 2)
  );
}

function calculateSEOScore({ title, description, content, tags }) {
  let score = 100;
  
  // Title length check (50-60 characters ideal)
  if (title.length < 50) score -= 5;
  if (title.length > 60) score -= 5;
  
  // Description length check (145-155 characters ideal)
  if (description.length < 145) score -= 5;
  if (description.length > 155) score -= 5;
  
  // Content length check (minimum 1500 words recommended)
  const wordCount = content.split(' ').length;
  if (wordCount < 1500) score -= 10;
  
  // Tags check (5-7 tags recommended)
  if (tags.length < 5) score -= 5;
  if (tags.length > 7) score -= 5;
  
  return score;
}

optimizeContent();