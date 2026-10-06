import CancelButton from '@/components/core/buttons/CancelButton.vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
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
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  describe('when a recipe type card is clicked', () => {
    it('navigates to the homemade recipe page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-homemade"]').trigger('click');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-homemade');
    });

    it('navigates to the prepared recipe page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-prepared"]').trigger('click');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-prepared');
    });
  });

  describe('on cancel', () => {
    it('navigates to the recipe list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent(CancelButton).trigger('click');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes');
    });
  });
});
