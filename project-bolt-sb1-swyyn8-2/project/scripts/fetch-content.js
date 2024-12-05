import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const parser = new Parser();
const RSS_FEEDS = [
  { url: 'https://www.medicalnewstoday.com/feed', category: 'health' },
  { url: 'https://www.healthline.com/rss/nutrition', category: 'nutrition' },
  { url: 'https://www.mindbodygreen.com/rss', category: 'wellness' }
];

async function fetchAndParseFeeds() {
  const articles = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedContent = await parser.parseURL(feed.url);
      
      for (const item of feedContent.items) {
        articles.push({
          title: item.title,
          content: item.content,
          link: item.link,
          pubDate: item.pubDate,
          category: feed.category,
          source: feedContent.title
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feed.url}:`, error);
    }
  }

  await writeFile(
    join(process.cwd(), 'src/data/raw-content.json'),
    JSON.stringify(articles, null, 2)
  );
}

fetchAndParseFeeds();