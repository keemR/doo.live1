import type { DeploymentConfig } from '../../types/wordpress';

export async function validateWordPressConnection(config: DeploymentConfig) {
  try {
    // Check basic connection
    await checkConnection(config);
    
    // Verify API access
    await verifyAPIAccess(config);
    
    // Validate permissions
    await validatePermissions(config);
    
    return true;
  } catch (error) {
    throw new Error(`WordPress validation failed: ${error.message}`);
  }
}

async function checkConnection(config: DeploymentConfig) {
  const response = await fetch(`${config.wpUrl}/wp-json`);
  
  if (!response.ok) {
    throw new Error('Could not connect to WordPress site');
  }
  
  const data = await response.json();
  if (!data.authentication || !data.namespaces.includes('wp/v2')) {
    throw new Error('WordPress REST API is not properly configured');
  }
}

async function verifyAPIAccess(config: DeploymentConfig) {
  const response = await fetch(`${config.wpUrl}/wp-json/wp/v2/users/me`, {
    headers: {
      'Authorization': `Basic ${btoa(`${config.username}:${config.password}`)}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Invalid WordPress credentials');
  }
}

async function validatePermissions(config: DeploymentConfig) {
  const response = await fetch(`${config.wpUrl}/wp-json/wp/v2/users/me`, {
    headers: {
      'Authorization': `Basic ${btoa(`${config.username}:${config.password}`)}`
    }
  });
  
  const user = await response.json();
  if (!user.capabilities.publish_posts || !user.capabilities.edit_posts) {
    throw new Error('User does not have required permissions');
  }
}