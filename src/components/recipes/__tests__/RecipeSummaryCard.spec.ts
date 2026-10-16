import { TEST_HOMEMADE_RECIPE, TEST_PREPARED_RECIPE, TEST_SOURCES } from '@/data/__tests__/test-data';
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
const mountComponent = (props: { recipe: Recipe; sourceName?: string } = { recipe: TEST_HOMEMADE_RECIPE }) =>
  mount(RecipeSummaryCard, { props, global: { plugins: [vuetify] } });

const preparedSourceName = TEST_SOURCES.find((source) => source.id === TEST_PREPARED_RECIPE.sourceId)!.name;

describe('Recipe Summary Card', () => {
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
    expect(title.text()).toBe(TEST_HOMEMADE_RECIPE.name);
  });

  it('displays the category in the subtitle', () => {
    wrapper = mountComponent();
    const subtitle = wrapper.findComponent(components.VCardSubtitle);
    expect(subtitle.text()).toContain(TEST_HOMEMADE_RECIPE.category);
  });

  describe('homemade recipes', () => {
    let cardText: VueWrapper<components.VCardText>;
    beforeEach(() => {
      wrapper = mountComponent();
      cardText = wrapper.findComponent(components.VCardText);
    });

    it('contains five chips', () => {
      const chips = cardText.findAllComponents(components.VChip);
      expect(chips).toHaveLength(5);
      expect(chips[0]!.text()).toBe(TEST_HOMEMADE_RECIPE.cuisine);
      expect(chips[1]!.text()).toBe(TEST_HOMEMADE_RECIPE.difficulty);
      expect(chips[2]!.text()).toBe(String(TEST_HOMEMADE_RECIPE.servings));
      expect(chips[3]!.text()).toBe(
        String(TEST_HOMEMADE_RECIPE.prepTimeMinutes + TEST_HOMEMADE_RECIPE.cookTimeMinutes),
      );
      expect(chips[4]!.text()).toBe(`${TEST_HOMEMADE_RECIPE.calories} kcal`);
    });

    it('displays the description', () => {
      expect(cardText.text()).toContain(TEST_HOMEMADE_RECIPE.description);
    });
  });

  describe('prepared recipes', () => {
    let cardText: VueWrapper<components.VCardText>;

    beforeEach(() => {
      wrapper = mountComponent({ recipe: TEST_PREPARED_RECIPE, sourceName: preparedSourceName });
      cardText = wrapper.findComponent(components.VCardText);
    });

    it('contains four chips', () => {
      const chips = cardText.findAllComponents(components.VChip);
      expect(chips).toHaveLength(4);
      expect(chips[0]!.text()).toBe(TEST_PREPARED_RECIPE.cuisine);
      expect(chips[1]!.text()).toBe(preparedSourceName);
      expect(chips[2]!.text()).toBe(String(TEST_PREPARED_RECIPE.servings));
      expect(chips[3]!.text()).toBe(`${TEST_PREPARED_RECIPE.calories} kcal`);
    });

    it('displays the description', () => {
      expect(cardText.text()).toContain(TEST_PREPARED_RECIPE.description);
    });

    it('shows UNKNOWN when no source name is provided', () => {
      wrapper.unmount();
      wrapper = mountComponent({ recipe: TEST_PREPARED_RECIPE });
      const chips = wrapper.findComponent(components.VCardText).findAllComponents(components.VChip);
      expect(chips).toHaveLength(4);
      expect(chips[1]!.text()).toBe('UNKNOWN');
    });
  });
});
