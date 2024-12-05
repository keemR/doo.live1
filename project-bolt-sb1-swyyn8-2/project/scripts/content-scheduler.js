import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function scheduleContent() {
  const articles = JSON.parse(
    await readFile(join(process.cwd(), 'src/content/optimized-articles.json'), 'utf-8')
  );

  // Sort articles by SEO score
  const sortedArticles = articles
    .filter(article => !article.scheduled)
    .sort((a, b) => b.seoScore - a.seoScore);

  // Schedule top performing articles
  for (const article of sortedArticles.slice(0, 5)) {
    const publishDate = getNextOptimalPublishTime();
    
    // Schedule social media posts
    await scheduleSocialPosts(article, publishDate);
    
    article.scheduled = true;
    article.scheduledDate = publishDate.toISOString();
  }

  await writeFile(
    join(process.cwd(), 'src/content/optimized-articles.json'),
    JSON.stringify(articles, null, 2)
  );
}

function getNextOptimalPublishTime() {
  const now = new Date();
  const optimalHours = [9, 12, 15, 17, 20]; // Best times to post
  
  let nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(optimalHours[0], 0, 0, 0);
  
  return nextDate;
}

async function scheduleSocialPosts(article, publishDate) {
  const tweet = `${article.title}\n\nRead more: https://healthylife.com/articles/${article.slug}\n\n${article.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}`;
  
  try {
    // Schedule tweet
    await client.v2.tweet(tweet, {
      scheduled_time: publishDate.toISOString(),
    });
  } catch (error) {
    console.error('Error scheduling social post:', error);
  }
}

scheduleContent();