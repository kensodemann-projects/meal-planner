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

  describe('recipe type cards', () => {
    it('exposes each choice as a keyboard button', () => {
      wrapper = mountPage();

      for (const testId of ['choice-homemade', 'choice-prepared']) {
        const card = wrapper.find(`[data-testid="${testId}"]`);
        expect(card.attributes('role')).toBe('button');
        expect(card.attributes('tabindex')).toBe('0');
      }
    });
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

  describe('when a recipe type card is activated from the keyboard', () => {
    it('navigates to the homemade recipe page when Enter is pressed', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-homemade"]').trigger('keydown', { key: 'Enter' });
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-homemade');
    });

    it('navigates to the prepared recipe page when Enter is pressed', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-prepared"]').trigger('keydown', { key: 'Enter' });
      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-prepared');
    });

    it('navigates to the homemade recipe page and prevents scrolling when Space is pressed', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const card = wrapper.findComponent('[data-testid="choice-homemade"]');
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });

      card.element.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-homemade');
      expect(event.defaultPrevented).toBe(true);
    });

    it('navigates to the prepared recipe page and prevents scrolling when Space is pressed', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const card = wrapper.findComponent('[data-testid="choice-prepared"]');
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });

      card.element.dispatchEvent(event);
      await wrapper.vm.$nextTick();

      expect(replace).toHaveBeenCalledExactlyOnceWith('/recipes/add-prepared');
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not navigate when another key is pressed', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await wrapper.findComponent('[data-testid="choice-homemade"]').trigger('keydown', { key: 'Tab' });
      expect(replace).not.toHaveBeenCalled();
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
