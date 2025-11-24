import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeEditor from '../RecipeEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(RecipeEditor, { global: { plugins: [vuetify] } });

describe('Recipe Editor', () => {
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  describe('name input', () => {
    it('exists', () => {
      const wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="name-input"]');
      expect(input.exists()).toBe(true);
    });
  });
});
