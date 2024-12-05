import type { Article } from '../types';

export const featuredArticle: Article = {
  title: "10 Science-Backed Ways to Improve Your Health",
  description: "Discover evidence-based strategies to enhance your physical and mental well-being.",
  image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  category: "Wellness",
  href: "/articles/improve-health"
};

export const latestArticles: Article[] = [
  {
    title: "The Ultimate Guide to Balanced Nutrition",
    description: "Learn how to create a balanced diet that fuels your body and mind.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Nutrition",
    href: "/articles/balanced-nutrition"
  },
  {
    title: "5 Essential Exercises for Core Strength",
    description: "Build a strong foundation with these effective core exercises.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Fitness",
    href: "/articles/core-strength"
  },
  {
    title: "Mindfulness Techniques for Better Mental Health",
    description: "Simple practices to reduce stress and improve mental well-being.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Mental Health",
    href: "/articles/mindfulness-techniques"
  }
];

export const trendingArticles: Article[] = [
  {
    title: "7 Morning Habits That Boost Your Metabolism",
    views: "234K",
    date: new Date('2024-03-15'),
    href: "/articles/morning-habits-metabolism",
    category: "Wellness",
    image: "",
    description: ""
  },
  {
    title: "Foods to Avoid If You Have High Blood Pressure",
    views: "198K",
    date: new Date('2024-03-14'),
    href: "/articles/foods-high-blood-pressure",
    category: "Nutrition",
    image: "",
    description: ""
  },
  {
    title: "Natural Remedies for Better Sleep",
    views: "156K",
    date: new Date('2024-03-13'),
    href: "/articles/natural-sleep-remedies",
    category: "Wellness",
    image: "",
    description: ""
  }
];