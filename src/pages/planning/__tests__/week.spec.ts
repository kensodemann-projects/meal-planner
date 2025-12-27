import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import week from '../week.vue';
import { useRoute } from 'vue-router';
import { intlFormat } from 'date-fns';

vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(week, { props, global: { plugins: [vuetify] } });

describe('week', () => {
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

  it('displays the proper headers for the week starting with dt', () => {
    wrapper = mountPage();
    const headers = wrapper.findAll('h2');
    expect(headers).toHaveLength(7);
    expect(headers[0]!.text()).toBe(intlFormat(new Date(2025, 11, 29), { dateStyle: 'full' }));
    expect(headers[1]!.text()).toBe(intlFormat(new Date(2025, 11, 30), { dateStyle: 'full' }));
    expect(headers[2]!.text()).toBe(intlFormat(new Date(2025, 11, 31), { dateStyle: 'full' }));
    expect(headers[3]!.text()).toBe(intlFormat(new Date(2026, 0, 1), { dateStyle: 'full' }));
    expect(headers[4]!.text()).toBe(intlFormat(new Date(2026, 0, 2), { dateStyle: 'full' }));
    expect(headers[5]!.text()).toBe(intlFormat(new Date(2026, 0, 3), { dateStyle: 'full' }));
    expect(headers[6]!.text()).toBe(intlFormat(new Date(2026, 0, 4), { dateStyle: 'full' }));
  });

  it('does not display the page load error', () => {
    wrapper = mountPage();
    expect(wrapper.findComponent({ name: 'PageLoadError' }).exists()).toBe(false);
  });

  describe('failed parameter validation', () => {
    it('displays the page load error when dt is missing', () => {
      (useRoute as Mock).mockReturnValue({
        query: {},
      });
      wrapper = mountPage();
      expect(wrapper.findComponent({ name: 'PageLoadError' }).exists()).toBe(true);
    });

    it('displays the page load error when dt is invalid', () => {
      (useRoute as Mock).mockReturnValue({
        query: { dt: 'not-a-date' },
      });
      wrapper = mountPage();
      expect(wrapper.findComponent({ name: 'PageLoadError' }).exists()).toBe(true);
    });

    it('displays the page load error when dt has an invalid month', () => {
      (useRoute as Mock).mockReturnValue({
        query: { dt: '2025-13-01' },
      });
      wrapper = mountPage();
      expect(wrapper.findComponent({ name: 'PageLoadError' }).exists()).toBe(true);
    });

    it('displays the page load error when dt has an invalid day', () => {
      (useRoute as Mock).mockReturnValue({
        query: { dt: '2025-12-32' },
      });
      wrapper = mountPage();
      expect(wrapper.findComponent({ name: 'PageLoadError' }).exists()).toBe(true);
    });
  });
});
