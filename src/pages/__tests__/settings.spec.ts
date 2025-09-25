import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SettingsPage from '../settings.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(SettingsPage, { global: { plugins: [vuetify] } });

describe('SettingsPage', () => {
  it('renders', () => {
    expect(mountPage()).toBeDefined();
  });
});
