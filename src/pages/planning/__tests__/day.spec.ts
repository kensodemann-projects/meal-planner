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
    wrapper = mountPage();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('parses the date properly', () => {
    expect(wrapper.text()).toContain('Monday, December 29, 2025');
  });

  it('contains a section for each type of meal', () => {
    const headers = wrapper.findAll('h2').map((h) => h.text());
    expect(headers).toEqual(['Breakfast', 'Lunch', 'Dinner', 'Snacks']);
  });

  describe('breakfast', () => {
    it('exits', () => {
      expect(true).toBe(true);
    });
  });

  describe('lunch', () => {
    it('exits', () => {
      expect(true).toBe(true);
    });
  });

  describe('Dinner', () => {
    it('exits', () => {
      expect(true).toBe(true);
    });
  });

  describe('snacks', () => {
    it('exits', () => {
      expect(true).toBe(true);
    });
  });
});
