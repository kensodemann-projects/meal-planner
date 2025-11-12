import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import FdcFoodListItem from '../FdcFoodListItem.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mockFood = {
  description: 'Apple, raw',
  fdcId: 171688,
  foodCategory: 'Fruits and Fruit Juices',
};

const createWrapper = (props = {}) => {
  return mount(FdcFoodListItem, {
    props: {
      food: mockFood,
      ...props,
    },
    global: {
      plugins: [vuetify],
    },
  });
};

describe('FdcFoodListItem', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders the component correctly', () => {
    wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.fdc-food-list-item').exists()).toBe(true);
  });

  it('displays food description as title', () => {
    wrapper = createWrapper();

    const title = wrapper.findComponent({ name: 'VListItemTitle' });
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Apple, raw');
  });

  it('displays food category as subtitle', () => {
    wrapper = createWrapper();

    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });
    expect(subtitle.exists()).toBe(true);
    expect(subtitle.text()).toBe('Fruits and Fruit Juices');
  });

  it('renders the Add Item button', () => {
    wrapper = createWrapper();

    const button = wrapper.findComponent({ name: 'VBtn' });
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Add Item');
  });

  it('emits add event when Add Item button is clicked', async () => {
    wrapper = createWrapper();

    const button = wrapper.findComponent({ name: 'VBtn' });
    await button.trigger('click');

    expect(wrapper.emitted('add')).toBeTruthy();
    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted('add')?.[0]).toEqual([mockFood]);
  });

  it('displays different food data correctly', () => {
    const customFood = {
      description: 'Chicken breast, boneless, skinless',
      fdcId: 171077,
      foodCategory: 'Poultry Products',
    };

    wrapper = createWrapper({ food: customFood });

    const title = wrapper.findComponent({ name: 'VListItemTitle' });
    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });

    expect(title.text()).toBe('Chicken breast, boneless, skinless');
    expect(subtitle.text()).toBe('Poultry Products');
  });

  it('handles long food descriptions correctly', () => {
    const longDescriptionFood = {
      description:
        'This is a very long food description that might wrap to multiple lines and should be handled gracefully by the component',
      fdcId: 123456,
      foodCategory: 'Test Category',
    };

    wrapper = createWrapper({ food: longDescriptionFood });

    const title = wrapper.findComponent({ name: 'VListItemTitle' });
    expect(title.text()).toBe(longDescriptionFood.description);
  });

  it('handles empty or special characters in food data', () => {
    const specialCharFood = {
      description: 'Café au lait & crème brûlée (100g)',
      fdcId: 999999,
      foodCategory: 'Beverages & Desserts',
    };

    wrapper = createWrapper({ food: specialCharFood });

    const title = wrapper.findComponent({ name: 'VListItemTitle' });
    const subtitle = wrapper.findComponent({ name: 'VListItemSubtitle' });

    expect(title.text()).toBe('Café au lait & crème brûlée (100g)');
    expect(subtitle.text()).toBe('Beverages & Desserts');
  });

  it('has proper component structure', () => {
    wrapper = createWrapper();

    expect(wrapper.find('.fdc-food-list-item').exists()).toBe(true);

    const listItem = wrapper.findComponent({ name: 'VListItem' });
    expect(listItem.exists()).toBe(true);

    const title = listItem.findComponent({ name: 'VListItemTitle' });
    const subtitle = listItem.findComponent({ name: 'VListItemSubtitle' });

    expect(title.exists()).toBe(true);
    expect(subtitle.exists()).toBe(true);
  });

  it('maintains button functionality with different food objects', async () => {
    const foods = [
      {
        description: 'Food 1',
        fdcId: 1,
        foodCategory: 'Category 1',
      },
      {
        description: 'Food 2',
        fdcId: 2,
        foodCategory: 'Category 2',
      },
    ];

    for (const food of foods) {
      const wrapper = createWrapper({ food });
      const button = wrapper.findComponent({ name: 'VBtn' });

      await button.trigger('click');

      expect(wrapper.emitted('add')).toBeTruthy();
      expect(wrapper.emitted('add')?.[0]).toEqual([food]);
      wrapper.unmount();
    }
  });

  it('does not emit add event on list item click, only button click', async () => {
    wrapper = createWrapper();

    const listItem = wrapper.findComponent({ name: 'VListItem' });
    await listItem.trigger('click');

    expect(wrapper.emitted('add')).toBeFalsy();

    const button = wrapper.findComponent({ name: 'VBtn' });
    await button.trigger('click');

    expect(wrapper.emitted('add')).toBeTruthy();
  });

  it('emits the complete food object', async () => {
    const complexFood = {
      description: 'Complex food item with all properties',
      fdcId: 987654321,
      foodCategory: 'Complex Category',
    };

    wrapper = createWrapper({ food: complexFood });
    const button = wrapper.findComponent({ name: 'VBtn' });

    await button.trigger('click');

    const emittedEvents = wrapper.emitted('add');
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents?.[0]![0]).toEqual(complexFood);
  });
});
