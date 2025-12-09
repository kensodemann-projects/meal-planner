import { TEST_RECIPE } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import update from '../update.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(update, { props, global: { plugins: [vuetify] } });

describe('update', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    const { getRecipe } = useRecipesData();
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (getRecipe as Mock).mockResolvedValue({ ...TEST_RECIPE, id: '88f933fiieo' });
  });

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
