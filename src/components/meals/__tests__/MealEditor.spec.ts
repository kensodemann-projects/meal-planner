import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealEditor from '../MealEditor.vue';
import { useFoodsData } from '@/data/foods';
import { useRecipesData } from '@/data/recipes';

vi.mock('@/data/foods');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(MealEditor, { props, global: { plugins: [vuetify] } });

describe('Meal Editor', () => {
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

  it('gets references to the food items and recipes', () => {
    wrapper = mountComponent();
    expect(useFoodsData).toHaveBeenCalledExactlyOnceWith();
    expect(useRecipesData).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not have any active meal item editors', () => {
    wrapper = mountComponent();
    expect(wrapper.findAllComponents({ name: 'MealItemEditorCard' }).length).toBe(0);
  });
});
