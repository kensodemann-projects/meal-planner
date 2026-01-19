import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import day from '../day.vue';

vi.mock('vue-router');
vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(day, { props, global: { plugins: [vuetify] } });

describe('day', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRoute as Mock).mockReturnValue({
      query: { dt: '2025-12-29' },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('parses the date properly', () => {
    wrapper = mountPage();
    expect(wrapper.text()).toContain('December 29, 2025');
  });

  it('contains a section for each type of meal', () => {
    wrapper = mountPage();
    const headers = wrapper.findAll('h2').map((h) => h.text());
    expect(headers).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snacks']);
  });

  describe('add breakfast button', () => {
    describe('on a day without a meal plan', () => {
      it('exists', () => {
        wrapper = mountPage();
        const addBreakfastButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(addBreakfastButton.exists()).toBe(true);
      });
    });

    describe('on a day with a meal plan', () => {
      it('it exists if the meal plan does not have a breakfast defined', () => {
        wrapper = mountPage();
        const addBreakfastButton = wrapper.findComponent('[data-testid="add-breakfast-button"]');
        expect(addBreakfastButton.exists()).toBe(true);
      });
    });
  });
});
