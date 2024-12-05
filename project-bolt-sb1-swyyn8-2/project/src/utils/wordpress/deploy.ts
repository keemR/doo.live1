import type { DeploymentConfig } from '../../types/wordpress';
import { migrateToWordPress } from './migration';
import { setupContentPipeline } from './content-pipeline';
import { validateWordPressConnection } from './validation';

export async function deployToWordPress(config: DeploymentConfig) {
  try {
    // 1. Validate WordPress connection and credentials
    await validateWordPressConnection(config);

    // 2. Install and configure required WordPress plugins
    await installRequiredPlugins(config);

    // 3. Migrate existing content
    await migrateToWordPress();

    // 4. Set up content pipeline
    await setupContentPipeline();

    return {
      success: true,
      dashboardUrl: `${config.wpUrl}/wp-admin`,
      apiUrl: `${config.wpUrl}/wp-json`
    };
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

async function installRequiredPlugins(config: DeploymentConfig) {
  const requiredPlugins = [
    'wordpress-seo', // Yoast SEO
    'rest-api',      // WP REST API
    'advanced-custom-fields', // ACF
    'doorillio-content-optimizer' // Our custom plugin
  ];

  for (const plugin of requiredPlugins) {
    await installPlugin(config, plugin);
  }
}

async function installPlugin(config: DeploymentConfig, pluginSlug: string) {
  const response = await fetch(`${config.wpUrl}/wp-json/wp/v2/plugins`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${config.username}:${config.password}`)}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: pluginSlug,
      status: 'active'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to install plugin ${pluginSlug}`);
  }
}