import type { MealItem } from '@/models/meal';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MealItemEditor from '../MealItemEditor.vue';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props: { mealItem?: MealItem } = {}) =>
  mount(MealItemEditor, { props, global: { plugins: [vuetify] } });

describe('MealItemEditor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('should render', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });
});
