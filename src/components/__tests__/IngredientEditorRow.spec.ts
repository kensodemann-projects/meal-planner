import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IngredientEditorRow from '../IngredientEditorRow.vue';
import { TEST_FOODS } from '@/data/__tests__/test-data';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = { foods: TEST_FOODS }) =>
  mount(IngredientEditorRow, { props, global: { plugins: [vuetify] } });

describe('Ingredient Editor Row', () => {
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
});
