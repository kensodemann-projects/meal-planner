import { mount } from '@vue/test-utils';
import { describe, afterEach, vi, beforeEach, type Mock, it, expect } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AddPage from '../add.vue';

vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(AddPage, { global: { plugins: [vuetify] } });

describe('Recipe Add Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: vi.fn() });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  describe('when a recipe type card is clicked', () => {
    it('navigates to the homemade recipe page', async () => {
      const { push } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-homemade"]').trigger('click');
      expect(push).toHaveBeenCalledExactlyOnceWith('/recipes/add-homemade');
    });

    it('navigates to the prepared recipe page', async () => {
      const { push } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-prepared"]').trigger('click');
      expect(push).toHaveBeenCalledExactlyOnceWith('/recipes/add-prepared');
    });
  });
});
