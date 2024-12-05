import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { create } from 'xmlbuilder2';
import slugify from 'slugify';

async function exportToWordPress() {
  try {
    const articles = JSON.parse(
      await readFile(join(process.cwd(), 'src/content/optimized-articles.json'), 'utf-8')
    );

    const xml = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('rss')
      .att('version', '2.0')
      .att('xmlns:excerpt', 'http://wordpress.org/export/1.2/excerpt/')
      .att('xmlns:content', 'http://purl.org/rss/1.0/modules/content/')
      .att('xmlns:wp', 'http://wordpress.org/export/1.2/');

    const channel = xml.ele('channel');
    
    // Add site info
    channel.ele('title').txt('HealthyLife');
    channel.ele('link').txt('https://healthylife.com');
    channel.ele('description').txt('Health and Wellness Information');
    
    // Add articles
    articles.forEach(article => {
      const item = channel.ele('item');
      item.ele('title').txt(article.title);
      item.ele('content:encoded').dat(article.content);
      item.ele('excerpt:encoded').dat(article.metaDescription || '');
      item.ele('wp:post_name').txt(slugify(article.title, { lower: true }));
      item.ele('wp:status').txt('draft'); // Set as draft for review
      item.ele('wp:post_type').txt('post');
      
      // Add category
      if (article.category) {
        item.ele('category')
          .att('domain', 'category')
          .att('nicename', slugify(article.category, { lower: true }))
          .txt(article.category);
      }
    });

    const xmlString = xml.end({ prettyPrint: true });
    await writeFile(join(process.cwd(), 'exports/wordpress-export.xml'), xmlString);
    
    console.log('WordPress export completed successfully!');
    console.log('Next steps:');
    console.log('1. Log in to your WordPress admin panel');
    console.log('2. Go to Tools > Import');
    console.log('3. Choose "WordPress" and upload the generated xml file');
    console.log('4. Review the imported posts before publishing');
    
  } catch (error) {
    console.error('Export failed:', error.message);
  }
}

exportToWordPress();