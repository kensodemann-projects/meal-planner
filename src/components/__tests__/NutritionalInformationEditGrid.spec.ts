import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalInformationEditGrid from '../NutritionalInformationEditGrid.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(NutritionalInformationEditGrid, { global: { plugins: [vuetify] } });

describe('Nutritional Information Edit Grid', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });
});
