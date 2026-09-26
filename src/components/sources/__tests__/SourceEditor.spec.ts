import { mount } from '@vue/test-utils';
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
    it.todo('exists');

    it.todo('is required');

    it.todo('must be unique ignoring case');

    it.todo('rejects Generic Restaurant when that source already exists');

    it.todo('allows the current name when renaming');
  });

  describe('cancel button', () => {
    it.todo('renders');

    it.todo('emits cancel on click');
  });

  describe('save button', () => {
    it.todo('renders');

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
