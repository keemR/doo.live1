import type { Category } from '../types';

export const categories: Category[] = [
  {
    name: 'Nutrition',
    slug: 'nutrition',
    description: 'Healthy eating tips and diet advice',
    icon: 'M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10z'
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    description: 'Workouts and exercise guides',
    icon: 'M13 6v18h-2v-18h2zm5 0v18h-2v-18h2z'
  },
  {
    name: 'Mental Health',
    slug: 'mental-health',
    description: 'Tips for emotional well-being',
    icon: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'
  },
  {
    name: 'Wellness',
    slug: 'wellness',
    description: 'Holistic health and lifestyle',
    icon: 'M12 21.35l-1.45-1.32c-5.15-4.67-8.55-7.75-8.55-11.53 0-3.08 2.42-5.5 5.5-5.5z'
  },
  {
    name: 'Alternative Medicine',
    slug: 'alternative-medicine',
    description: 'Natural and holistic healing approaches',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
  },
  {
    name: 'Sleep Health',
    slug: 'sleep-health',
    description: 'Better sleep and recovery tips',
    icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z'
  },
  {
    name: 'Recipes',
    slug: 'recipes',
    description: 'Healthy cooking and meal plans',
    icon: 'M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5'
  },
  {
    name: 'Supplements',
    slug: 'supplements',
    description: 'Guide to vitamins and supplements',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
  }
];