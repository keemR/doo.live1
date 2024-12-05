import type { WordPressPost, WordPressCategory } from '../../types/wordpress';

const WP_API_URL = process.env.WORDPRESS_API_URL;
const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

export async function fetchWordPressPost(postId: number): Promise<WordPressPost> {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch WordPress post: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function updateWordPressPost(postId: number, data: Partial<WordPressPost>): Promise<void> {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts/${postId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update WordPress post: ${response.statusText}`);
  }
}

export async function createWordPressPost(data: Partial<WordPressPost>): Promise<WordPressPost> {
  const response = await fetch(`${WP_API_URL}/wp/v2/posts`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create WordPress post: ${response.statusText}`);
  }
  
  return await response.json();
}

export async function registerWordPressHook(name: string, callback: Function): Promise<void> {
  // This would require a custom WordPress plugin to handle hook registration
  const response = await fetch(`${WP_API_URL}/doorillio/v1/hooks`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hook_name: name,
      callback_url: `${process.env.API_URL}/hooks/${name}`
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to register WordPress hook: ${response.statusText}`);
  }
}

function getAuthHeaders() {
  return {
    'Authorization': 'Basic ' + btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`)
  };
}