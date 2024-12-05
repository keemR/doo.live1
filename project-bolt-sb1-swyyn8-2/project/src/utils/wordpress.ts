import type { Article } from '../types';

const WP_API_URL = process.env.WORDPRESS_API_URL;
const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

export async function fetchWordPressArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts?_embed`);
    const posts = await response.json();
    
    return posts.map(post => ({
      title: post.title.rendered,
      description: post.excerpt.rendered,
      content: post.content.rendered,
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
      href: `/articles/${post.slug}`,
      date: new Date(post.date)
    }));
  } catch (error) {
    console.error('Failed to fetch WordPress articles:', error);
    return [];
  }
}

export async function createWordPressPost(article: Article) {
  try {
    const response = await fetch(`${WP_API_URL}/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`)
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        excerpt: article.description,
        status: 'draft'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create WordPress post:', error);
    throw error;
  }
}