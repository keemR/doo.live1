import type { Article, GeneratedContent } from '../../types';

const WP_API_URL = process.env.WORDPRESS_API_URL;
const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

export async function syncToWordPress(content: GeneratedContent): Promise<void> {
  try {
    // First, check if similar content already exists
    const existingPost = await findSimilarPost(content.title);
    
    if (existingPost) {
      // Update existing post
      await updatePost(existingPost.id, content);
    } else {
      // Create new post
      await createPost(content);
    }
  } catch (error) {
    console.error('WordPress sync failed:', error);
    throw error;
  }
}

async function findSimilarPost(title: string): Promise<any> {
  const response = await fetch(
    `${WP_API_URL}/wp/v2/posts?search=${encodeURIComponent(title)}`,
    {
      headers: getAuthHeaders()
    }
  );
  
  const posts = await response.json();
  return posts.length > 0 ? posts[0] : null;
}

async function createPost(content: GeneratedContent): Promise<void> {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: content.title,
      content: content.content,
      excerpt: content.excerpt,
      status: 'draft',
      meta: {
        _yoast_wpseo_metadesc: content.excerpt,
        _yoast_wpseo_focuskw: content.keywords.map(k => k.term).join(',')
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create WordPress post: ${response.statusText}`);
  }
}

async function updatePost(id: number, content: GeneratedContent): Promise<void> {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: content.title,
      content: content.content,
      excerpt: content.excerpt,
      meta: {
        _yoast_wpseo_metadesc: content.excerpt,
        _yoast_wpseo_focuskw: content.keywords.map(k => k.term).join(',')
      }
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update WordPress post: ${response.statusText}`);
  }
}

function getAuthHeaders() {
  return {
    'Authorization': 'Basic ' + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`)
  };
}