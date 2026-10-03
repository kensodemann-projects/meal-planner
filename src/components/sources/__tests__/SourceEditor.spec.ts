import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SourceEditor from '../SourceEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(SourceEditor, { props, global: { plugins: [vuetify] } });

describe('Source Editor', () => {
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

  describe('name', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Name');
    });

    it.todo('is required');

    it.todo('must be unique ignoring case');

    it.todo('allows the current name when renaming');
  });

  describe('cancel button', () => {
    it('exists', () => {
      wrapper = mountComponent();
      expect(wrapper.findComponent('[data-testid="cancel-button"]').exists()).toBe(true);
    });

    it.todo('emits cancel on click');
  });

  describe('save button', () => {
    it('exists', () => {
      wrapper = mountComponent();
      expect(wrapper.findComponent('[data-testid="save-button"]').exists()).toBe(true);
    });

    describe('for create', () => {
      it.todo('initializes the name with a blank value');

      it.todo('is disabled until the name is filled in');

      it.todo('emits the entered name on click');
    });

    describe('for update', () => {
      it.todo('initializes the name with the source value');

      it.todo('emits the entered name on click');
    });
  });
});
