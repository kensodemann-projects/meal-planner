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
});
