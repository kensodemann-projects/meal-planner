import DeleteButton from '@/components/core/buttons/DeleteButton.vue';
import ModifyButton from '@/components/core/buttons/ModifyButton.vue';
import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
import { TEST_PORTION } from '@/data/__tests__/test-data';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PortionData from '../PortionData.vue';
import PortionDataCard from '../PortionDataCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(PortionDataCard, { props: { value: TEST_PORTION }, global: { plugins: [vuetify] } });

describe('Portion Data Card', () => {
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
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('embeds portion data in a card', () => {
    const card = wrapper.findComponent(components.VCard);
    expect(card.exists()).toBe(true);
    const contents = card.findComponent(components.VCardText);
    expect(contents.exists()).toBe(true);
    const data = contents.findComponent(PortionData);
    expect(data.exists()).toBe(true);
  });

  describe('modify button', () => {
    it('emits modify', async () => {
      const button = wrapper.findComponent(ModifyButton);
      await button.trigger('click');
      expect(wrapper.emitted('modify')).toBeTruthy();
      expect(wrapper.emitted('modify')?.length).toBe(1);
    });
  });

  describe('delete button', () => {
    it('displays a confirmation dialog', async () => {
      const button = wrapper.findComponent(DeleteButton);
      await button.trigger('click');
      await wrapper.vm.$nextTick();
      const dialog = wrapper.findComponent(ConfirmDialog);
      expect(dialog.exists()).toBe(true);
    });

    describe('on confirm', () => {
      it('emits delete', async () => {
        const button = wrapper.findComponent(DeleteButton);
        await button.trigger('click');
        await wrapper.vm.$nextTick();
        const dialog = wrapper.findComponent(ConfirmDialog);
        dialog.vm.$emit('confirm');
        expect(wrapper.emitted('delete')).toBeTruthy();
        expect(wrapper.emitted('delete')?.length).toBe(1);
      });
    });

    describe('on cancel', () => {
      it('does not emit delete', async () => {
        const button = wrapper.findComponent(DeleteButton);
        await button.trigger('click');
        await wrapper.vm.$nextTick();
        const dialog = wrapper.findComponent(ConfirmDialog);
        dialog.vm.$emit('cancel');
        expect(wrapper.emitted('delete')).toBeFalsy();
      });
    });
  });
});
