import { describe, expect, it } from 'vitest';
import type { MenuItem } from '../menu-item';

describe('MenuItem interface', () => {
  it('accepts valid menu item objects', () => {
    const menuItem: MenuItem = {
      icon: 'mdi-home',
      title: 'Home',
      value: 'home',
      path: '/',
    };

    expect(menuItem.icon).toBe('mdi-home');
    expect(menuItem.title).toBe('Home');
    expect(menuItem.value).toBe('home');
    expect(menuItem.path).toBe('/');
  });

  it('requires all properties to be defined', () => {
    const menuItems: MenuItem[] = [
      {
        icon: 'mdi-food',
        title: 'Foods',
        value: 'foods',
        path: '/foods',
      },
      {
        icon: 'mdi-book-open-variant',
        title: 'Recipes',
        value: 'recipes',
        path: '/recipes',
      },
      {
        icon: 'mdi-calendar',
        title: 'Planning',
        value: 'planning',
        path: '/planning',
      },
    ];

    expect(menuItems).toHaveLength(3);
    menuItems.forEach((item) => {
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('value');
      expect(item).toHaveProperty('path');
    });
  });

  it('accepts string values for all properties', () => {
    const menuItem: MenuItem = {
      icon: '',
      title: '',
      value: '',
      path: '',
    };

    expect(typeof menuItem.icon).toBe('string');
    expect(typeof menuItem.title).toBe('string');
    expect(typeof menuItem.value).toBe('string');
    expect(typeof menuItem.path).toBe('string');
  });
});
