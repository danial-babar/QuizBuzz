import { colors } from './colors';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export const categories: Category[] = [
  {
    id: 'general',
    name: 'General Knowledge',
    icon: 'globe-outline',
    color: colors.white,
    backgroundColor: colors.primary,
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'flask-outline',
    color: colors.white,
    backgroundColor: '#8E44AD',
  },
  {
    id: 'history',
    name: 'History',
    icon: 'time-outline',
    color: colors.white,
    backgroundColor: '#E67E22',
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'earth-outline',
    color: colors.white,
    backgroundColor: '#27AE60',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'basketball-outline',
    color: colors.white,
    backgroundColor: '#E74C3C',
  },
  {
    id: 'movies',
    name: 'Movies',
    icon: 'film-outline',
    color: colors.white,
    backgroundColor: '#9B59B6',
  },
  {
    id: 'music',
    name: 'Music',
    icon: 'musical-notes-outline',
    color: colors.white,
    backgroundColor: '#3498DB',
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: 'hardware-chip-outline',
    color: colors.white,
    backgroundColor: '#2C3E50',
  },
  {
    id: 'art',
    name: 'Art',
    icon: 'color-palette-outline',
    color: colors.white,
    backgroundColor: '#E91E63',
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: 'paw-outline',
    color: colors.white,
    backgroundColor: '#795548',
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'car-sport-outline',
    color: colors.white,
    backgroundColor: '#34495E',
  },
  {
    id: 'celebrities',
    name: 'Celebrities',
    icon: 'star-outline',
    color: colors.white,
    backgroundColor: '#F1C40F',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getRandomCategory = (): Category => {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

export const getPopularCategories = (count: number = 6): Category[] => {
  // In a real app, this would be based on user data or analytics
  const popularIds = ['general', 'science', 'history', 'geography', 'sports', 'movies'];
  return categories
    .filter(category => popularIds.includes(category.id))
    .slice(0, count);
};

export default categories;
