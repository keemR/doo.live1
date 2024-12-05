export interface Article {
  title: string;
  description: string;
  image: string;
  category: string;
  href: string;
  views?: string;
  date?: Date;
}

export interface Topic {
  name: string;
  href: string;
  count: number;
}

export interface NavigationItem {
  name: string;
  href: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
}