import { TEST_RECIPE } from '@/data/__tests__/test-data';
import type { Recipe } from '@/models/recipe';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeSummaryCard from '../RecipeSummaryCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { recipe: Recipe } = { recipe: TEST_RECIPE }) =>
  mount(RecipeSummaryCard, { props, global: { plugins: [vuetify] } });

describe('Recipe List Item', () => {
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

  it('displays the name in the title', () => {
    wrapper = mountComponent();
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe(TEST_RECIPE.name);
  });

  it('displays the category in the subtitle', () => {
    wrapper = mountComponent();
    const subtitle = wrapper.findComponent(components.VCardSubtitle);
    expect(subtitle.text()).toContain(TEST_RECIPE.category);
  });

  // it('displays the description', () => {
  //   wrapper = mountComponent();
  //   const item = wrapper.findComponent(components.VListItem);
  //   expect(item.text()).toContain(TEST_RECIPE.description);
  // });
});
