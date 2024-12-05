# Doorillio WordPress Deployment and Maintenance Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [WordPress Configuration](#wordpress-configuration)
3. [Content Management](#content-management)
4. [Maintenance Tasks](#maintenance-tasks)
5. [Feature Improvements](#feature-improvements)

## Initial Setup

### Prerequisites
1. A WordPress hosting account
2. WordPress installed on your domain
3. Admin access to WordPress
4. Node.js environment for running deployment scripts

### Environment Configuration
1. Create a `.env` file in your project root:
```env
WP_URL="https://your-wordpress-site.com"
WP_USERNAME="your-admin-username"
WP_APP_PASSWORD="your-application-password"
```

2. Generate an application password in WordPress:
   - Go to WordPress Admin → Users → Your Profile
   - Scroll to "Application Passwords"
   - Enter "Doorillio" as the name
   - Click "Add New"
   - Copy the generated password

### Deployment Steps
1. Install required WordPress plugins:
   ```bash
   node scripts/deploy.js --install-plugins
   ```

2. Migrate existing content:
   ```bash
   node scripts/deploy.js --migrate-content
   ```

3. Set up content pipeline:
   ```bash
   node scripts/deploy.js --setup-pipeline
   ```

## WordPress Configuration

### Required Plugins
1. **Yoast SEO**
   - Purpose: SEO optimization
   - Settings:
     - Enable XML sitemaps
     - Connect Google Search Console
     - Set up social media profiles

2. **Advanced Custom Fields**
   - Purpose: Custom content fields
   - Required fields:
     - SEO Score
     - Featured Status
     - Content Type

3. **Doorillio Content Optimizer**
   - Purpose: Custom optimization features
   - Settings:
     - Enable auto-optimization
     - Set content schedule
     - Configure internal linking

### Theme Setup
1. Use a lightweight theme (recommended: GeneratePress)
2. Configure theme settings:
   ```json
   {
     "typography": {
       "font-family": "Inter",
       "base-size": "16px",
       "line-height": "1.6"
     },
     "colors": {
       "primary": "#10b981",
       "secondary": "#059669"
     }
   }
   ```

## Content Management

### Automated Content Generation
The system automatically generates content using these schedules:
- Morning post: 9:00 AM
- Afternoon post: 2:00 PM
- Evening post: 7:00 PM

To modify the schedule:
1. Edit `src/utils/wordpress/content-pipeline.ts`
2. Update the `schedule` array
3. Deploy changes:
   ```bash
   node scripts/deploy.js --update-pipeline
   ```

### Content Optimization
Content is automatically optimized for:
- SEO (using Yoast guidelines)
- Readability
- Keyword density
- Internal linking

Manual optimization:
1. Go to WordPress Admin → Posts
2. Click "Optimize" button
3. Review and approve changes

## Maintenance Tasks

### Daily Tasks
1. Monitor content generation:
   ```bash
   node scripts/monitor.js --check-generation
   ```

2. Review optimization reports:
   ```bash
   node scripts/monitor.js --check-optimization
   ```

3. Check error logs:
   ```bash
   node scripts/monitor.js --check-logs
   ```

### Weekly Tasks
1. Update plugins and themes
2. Backup database and files
3. Review content performance:
   ```bash
   node scripts/analytics.js --weekly-report
   ```

### Monthly Tasks
1. Content audit:
   ```bash
   node scripts/audit.js --full-content
   ```

2. SEO performance review:
   ```bash
   node scripts/analytics.js --seo-report
   ```

3. Update content strategy:
   ```bash
   node scripts/strategy.js --update
   ```

## Feature Improvements

### Adding New Features

1. **Content Generation**
   ```typescript
   // Add new content type
   // In src/types/content.ts
   interface NewContentType {
     type: string;
     template: string;
     keywords: string[];
   }
   ```

2. **Optimization Rules**
   ```typescript
   // Add new optimization rule
   // In src/utils/content/optimizer.ts
   function newOptimizationRule(content: string): string {
     // Implementation
     return optimizedContent;
   }
   ```

3. **Analytics Integration**
   ```typescript
   // Add analytics tracking
   // In src/utils/analytics/tracker.ts
   async function trackContentPerformance(postId: number) {
     // Implementation
   }
   ```

### Customizing Features

1. **Modify Content Schedule**
   ```typescript
   // In src/utils/wordpress/content-pipeline.ts
   const schedule = [
     { hour: 8, minute: 0 },  // Earlier morning post
     { hour: 12, minute: 0 }, // Noon post
     { hour: 16, minute: 0 }, // Afternoon post
     { hour: 20, minute: 0 }  // Evening post
   ];
   ```

2. **Adjust SEO Rules**
   ```typescript
   // In src/utils/content/optimizer.ts
   const seoRules = {
     minWordCount: 2000,    // Increase minimum word count
     keywordDensity: 0.02,  // Adjust keyword density
     maxTitleLength: 65     // Modify title length limit
   };
   ```

3. **Customize Internal Linking**
   ```typescript
   // In src/utils/content/internal-links.ts
   const linkingRules = {
     maxLinksPerPost: 8,    // Adjust maximum links
     minRelevanceScore: 0.6 // Increase relevance threshold
   };
   ```

### Testing New Features

1. Set up test environment:
   ```bash
   node scripts/setup-test.js
   ```

2. Run tests:
   ```bash
   npm run test:features
   ```

3. Deploy to staging:
   ```bash
   node scripts/deploy.js --environment=staging
   ```

### Monitoring Changes

1. Set up monitoring:
   ```bash
   node scripts/monitor.js --setup
   ```

2. Check performance:
   ```bash
   node scripts/monitor.js --performance
   ```

3. View reports:
   ```bash
   node scripts/monitor.js --reports
   ```