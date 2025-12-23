import type { RecipeStep } from '@/models/recipe';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ConfirmDialog from '../ConfirmDialog.vue';
import StepEditorRow from '../StepEditorRow.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { step: RecipeStep } = { step: TEST_STEPS[0]! }) =>
  mount(StepEditorRow, { props, global: { plugins: [vuetify] } });

describe('StepEditorRow', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    // Polyfill visualViewport for Vuetify overlays/dialogs in jsdom
    if (!window.visualViewport) {
      // @ts-expect-error Polyfill for Vuetify overlay in jsdom
      window.visualViewport = {
        addEventListener: () => {},
        removeEventListener: () => {},
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
      };
    }
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({ step: TEST_STEPS[1]! });
    expect(wrapper.exists()).toBe(true);
  });

  describe('instruction', () => {
    it('renders', () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const input = wrapper.findComponent('[data-testid="instruction-input"]') as VueWrapper<components.VTextField>;
      expect(input.exists()).toBe(true);
    });

    it('is initialized', () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const instruction = wrapper.findComponent(
        '[data-testid="instruction-input"]',
      ) as VueWrapper<components.VTextField>;
      const input = instruction.find('input');
      expect(input.element.value).toBe('In a large bowl, combine flour, sugar, baking powder, and salt.');
    });

    it('emits changed', async () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const input = wrapper.findComponent('[data-testid="instruction-input"]') as VueWrapper<components.VTextField>;
      await input.setValue('Dump the stuff in the thing and mix');
      const emitted = wrapper.emitted('changed');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as RecipeStep).instruction).toBe('Dump the stuff in the thing and mix');
    });

    it('emits add-next when Ctrl+Enter is pressed', async () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const input = wrapper.findComponent('[data-testid="instruction-input"]');

      await input.trigger('keydown.ctrl.enter');

      const emitted = wrapper.emitted('add-next');
      expect(emitted).toBeTruthy();
      expect(emitted?.length).toBe(1);
    });
  });

  describe('delete button', () => {
    it('renders', () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]') as VueWrapper<components.VBtn>;
      expect(button.exists()).toBe(true);
    });

    it('displays confirm dialog when clicked', async () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();
      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);
    });

    it('emits delete and closes dialog when user confirms', async () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();

      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);

      await confirmDialog.vm.$emit('confirm');
      await flushPromises();

      const emitted = wrapper.emitted('delete');
      expect(emitted?.length).toBe(1);

      const activeOverlay = document.querySelector('.v-overlay--active');
      expect(activeOverlay).toBeNull();
    });

    it('does not emit delete and closes dialog when user cancels', async () => {
      wrapper = mountComponent({ step: TEST_STEPS[1]! });
      const button = wrapper.findComponent('[data-testid="delete-button"]');
      await button.trigger('click');
      await flushPromises();

      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);

      await confirmDialog.vm.$emit('cancel');
      await flushPromises();

      const emitted = wrapper.emitted('delete');
      expect(emitted).toBeUndefined();

      const activeOverlay = document.querySelector('.v-overlay--active');
      expect(activeOverlay).toBeNull();
    });
  });
});

const TEST_STEPS: RecipeStep[] = [
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    instruction: 'Preheat oven to 375°F (190°C).',
  },
  {
    id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    instruction: 'In a large bowl, combine flour, sugar, baking powder, and salt.',
  },
  {
    id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    instruction: 'In a separate bowl, whisk together eggs, milk, and melted butter.',
  },
  {
    id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
    instruction: 'Pour wet ingredients into dry ingredients and stir until just combined.',
  },
  {
    id: 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
    instruction: 'Bake for 25-30 minutes or until a toothpick inserted in the center comes out clean.',
  },
];
