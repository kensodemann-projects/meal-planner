import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ViewPageActionButtons from '../ViewPageActionButtons.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(ViewPageActionButtons, { props, global: { plugins: [vuetify] } });

describe('View Page Action Buttons', () => {
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

  describe('buttons', () => {
    it('exist', () => {
      wrapper = mountComponent();
      const buttons = wrapper.findAllComponents(components.VBtn);
      expect(buttons.length).toBe(3);
    });

    it('are labeled properly', () => {
      wrapper = mountComponent();
      const buttons = wrapper.findAllComponents(components.VBtn);
      expect(buttons[0]?.text()).toBe('Close');
      expect(buttons[1]?.text()).toBe('Modify');
      expect(buttons[2]?.text()).toBe('Delete');
    });

    it('emit properly', async () => {
      wrapper = mountComponent();
      const buttons = wrapper.findAllComponents(components.VBtn);

      await buttons[0]?.trigger('click');
      expect(wrapper.emitted()['close']).toBeTruthy();

      await buttons[1]?.trigger('click');
      expect(wrapper.emitted()['modify']).toBeTruthy();

      await buttons[2]?.trigger('click');
      expect(wrapper.emitted()['delete']).toBeTruthy();
    });
  });
});
