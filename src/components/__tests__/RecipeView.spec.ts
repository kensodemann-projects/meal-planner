import { TEST_RECIPE } from '@/data/__tests__/test-data';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeView from '../RecipeView.vue';
import type { Recipe } from '@/models/recipe';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { recipe: Recipe } = { recipe: { ...TEST_RECIPE, id: 'test-132' } }) =>
  mount(RecipeView, { props, global: { plugins: [vuetify] } });

describe('RecipeView', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the name in an h1 header', () => {
    wrapper = mountComponent();
    const header = wrapper.find('h1');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe(TEST_RECIPE.name);
  });

  it('renders the category', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain(`Category: ${TEST_RECIPE.category}`);
  });

  it('renders the servings', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain(`Servings: ${TEST_RECIPE.servings}`);
  });

  it('renders the difficulty', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain(`Difficulty: ${TEST_RECIPE.difficulty}`);
  });

  it('renders the description', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain(TEST_RECIPE.description);
  });

  it('has sections for Ingredients, Steps, and Nutritional Information', () => {
    wrapper = mountComponent();
    const subHeaders = wrapper.findAll('h2').map((h) => h.text());
    expect(subHeaders.length).toBe(3);
    expect(subHeaders[0]).toBe('Ingredients');
    expect(subHeaders[1]).toBe('Steps');
    expect(subHeaders[2]).toBe('Nutritional Information');
  });
});
