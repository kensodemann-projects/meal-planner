import { mount } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DashboardPage from '../dashboard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(DashboardPage, { global: { plugins: [vuetify] } });

it('renders', () => {
  const wrapper = mountPage();
  expect(wrapper.exists()).toBe(true);
  wrapper.unmount();
  vi.clearAllTimers();
  try {
    vi.useRealTimers();
  } catch {}
});
