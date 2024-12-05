import { TwitterApi } from 'twitter-api-v2';
import { readFile } from 'fs/promises';
import { join } from 'path';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function postToSocial() {
  const articles = JSON.parse(
    await readFile(join(process.cwd(), 'src/content/articles.json'), 'utf-8')
  );

  for (const article of articles) {
    if (!article.posted) {
      try {
        const tweet = `${article.title}\n\nRead more: https://yourdomain.com/articles/${article.slug}\n\n#Health #Wellness`;
        
        await client.v2.tweet(tweet);
        
        article.posted = true;
      } catch (error) {
        console.error('Error posting to Twitter:', error);
      }
    }
  }

  await writeFile(
    join(process.cwd(), 'src/content/articles.json'),
    JSON.stringify(articles, null, 2)
  );
}

postToSocial();