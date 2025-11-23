import type { FoodItem } from '@/models/food';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import FoodListItem from '../FoodListItem.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const BANANA: FoodItem = {
  name: 'banana',
  fdcId: 1105314,
  category: 'Produce',
  grams: 100,
  unitOfMeasure: { id: 'g', name: 'Grams', type: 'weight', system: 'metric' },
  units: 100,
  calories: 98,
  carbs: 23,
  sugar: 15.8,
  sodium: 4,
  fat: 0,
  protein: 0.75,
  alternativePortions: [
    {
      grams: 115,
      unitOfMeasure: { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
      units: 1,
      calories: 113,
      carbs: 24.4,
      sugar: 18.2,
      sodium: 4,
      fat: 0,
      protein: 0.851,
    },
  ],
};

const createWrapper = (props = {}) => {
  return mount(FoodListItem, {
    props: {
      food: BANANA,
      ...props,
    },
    global: {
      plugins: [vuetify],
    },
  });
};

describe('Food List Item Component', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.food-list-item').exists()).toBe(true);
  });

  it('displays food description as title', () => {
    wrapper = createWrapper();
    const title = wrapper.findComponent({ name: 'VListItemTitle' });
    expect(title.text()).toBe(BANANA.name);
  });

  it('displays the food category in the subtitle', () => {
    wrapper = createWrapper();
    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });
    expect(subtitle.text()).toContain(BANANA.category);
  });

  it('displays the "no specific brand" if a brand is not specified', () => {
    wrapper = createWrapper();
    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });
    expect(subtitle.text()).toContain('No specific brand');
  });

  it('displays the brand if a brand is specified', () => {
    wrapper = createWrapper({ food: { ...BANANA, brand: 'Dole' } });
    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });
    expect(subtitle.text()).toContain('Dole');
    expect(subtitle.text()).not.toContain('No specific brand');
  });

  it('emits click event when the item is clicked', async () => {
    wrapper = createWrapper();
    const listItem = wrapper.findComponent({ name: 'VListItem' });
    await listItem.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]).toEqual([BANANA]);
  });

  describe('when displaying items still being built in the background', () => {
    it('displays an alternate name', () => {
      wrapper = createWrapper({ food: { id: '299r0r990293', fdcId: 21249934 } });
      const title = wrapper.findComponent({ name: 'VListItemTitle' });
      expect(title.text()).toBe('This food item is being created, please check back later.');
    });
  });
});
