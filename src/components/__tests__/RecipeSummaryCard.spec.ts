import { TEST_RECIPE } from '@/data/__tests__/test-data';
import type { Recipe } from '@/models/recipe';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('RecipeSummaryCard', () => {
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

  describe('the card text area', () => {
    let cardText: VueWrapper<components.VCardText>;
    beforeEach(() => {
      wrapper = mountComponent();
      cardText = wrapper.findComponent(components.VCardText);
    });

    it('contains five chips', () => {
      const chips = cardText.findAllComponents(components.VChip);
      expect(chips).toHaveLength(5);
      expect(chips[0]!.text()).toBe(TEST_RECIPE.cuisine);
      expect(chips[1]!.text()).toBe(TEST_RECIPE.difficulty);
      expect(chips[2]!.text()).toBe(String(TEST_RECIPE.servings));
      expect(chips[3]!.text()).toBe(String(TEST_RECIPE.prepTimeMinutes + TEST_RECIPE.cookTimeMinutes));
      expect(chips[4]!.text()).toBe(`${TEST_RECIPE.calories} kcal`);
    });

    it('displays the description', () => {
      expect(cardText.text()).toContain(TEST_RECIPE.description);
    });
  });
});
