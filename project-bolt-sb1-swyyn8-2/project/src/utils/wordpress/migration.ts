import type { Article } from '../../types';
import { fetchWordPressArticles, createWordPressPost } from './api';
import { generateArticleContent } from '../content/generator';
import { optimizeContent } from '../content/optimizer';

export async function migrateToWordPress() {
  try {
    // 1. Fetch all existing articles from the current system
    const existingArticles = await fetchExistingArticles();
    
    // 2. Migrate each article to WordPress
    for (const article of existingArticles) {
      await migrateArticle(article);
    }
    
    // 3. Set up automatic content generation pipeline
    await setupContentPipeline();
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function migrateArticle(article: Article) {
  // Optimize existing content before migration
  const optimizedContent = await optimizeContent(article.content, []);
  
  // Create WordPress post
  await createWordPressPost({
    title: article.title,
    content: optimizedContent.content,
    excerpt: optimizedContent.excerpt,
    status: 'publish',
    categories: [article.category],
    meta: {
      original_url: article.href,
      seo_score: optimizedContent.seoScore
    }
  });
}

async function setupContentPipeline() {
  // Set up WordPress hooks for content generation
  const hooks = [
    {
      name: 'publish_post',
      callback: async (postId: number) => {
        const relatedArticles = await fetchWordPressArticles();
        await updateInternalLinks(postId, relatedArticles);
      }
    },
    {
      name: 'draft_to_publish',
      callback: async (postId: number) => {
        await optimizeWordPressPost(postId);
      }
    }
  ];
  
  // Register hooks in WordPress
  for (const hook of hooks) {
    await registerWordPressHook(hook.name, hook.callback);
  }
}

async function optimizeWordPressPost(postId: number) {
  const post = await fetchWordPressPost(postId);
  const optimizedContent = await optimizeContent(post.content, []);
  
  await updateWordPressPost(postId, {
    content: optimizedContent.content,
    meta: {
      _yoast_wpseo_metadesc: optimizedContent.excerpt,
      seo_score: optimizedContent.seoScore
    }
  });
}

async function updateInternalLinks(postId: number, relatedArticles: Article[]) {
  const post = await fetchWordPressPost(postId);
  const contentWithLinks = await generateInternalLinks(post.content, relatedArticles);
  
  await updateWordPressPost(postId, {
    content: contentWithLinks
  });
}