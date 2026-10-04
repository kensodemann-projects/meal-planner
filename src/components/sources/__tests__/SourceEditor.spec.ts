import { textFieldIsRequired } from '@/components/__tests__/test-utils.ts';
import { TEST_SOURCES } from '@/data/__tests__/test-data.ts';
import { useSourcesData } from '@/data/sources.ts';
import type { Source } from '@/models/source.ts';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SourceEditor from '../SourceEditor.vue';

vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(SourceEditor, { props, global: { plugins: [vuetify] } });

describe('Source Editor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    const { sources } = useSourcesData();
    (sources as Ref<Source[]>).value = TEST_SOURCES;
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

  describe('name', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Name');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await textFieldIsRequired(wrapper, 'name-input');
    });

    it('must be unique ignoring case', async () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="name-input"]').find('input');

      expect(wrapper.text()).not.toContain('already exists');
      await input.trigger('focus');
      await input.setValue(TEST_SOURCES[1].name);
      await input.trigger('blur');
      expect(wrapper.text()).toContain('already exists');
      await input.setValue(TEST_SOURCES[1].name.toUpperCase());
      await input.trigger('blur');
      expect(wrapper.text()).toContain('already exists');
      await input.setValue(TEST_SOURCES[1].name.toLowerCase());
      await input.trigger('blur');
      expect(wrapper.text()).toContain('already exists');

      await input.setValue('redrum');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('already exists');
    });

    it('allows the current name when renaming', async () => {
      wrapper = mountComponent({ source: TEST_SOURCES[1] });
      const input = wrapper.findComponent('[data-testid="name-input"]').find('input');

      expect(wrapper.text()).not.toContain('already exists');
      await input.trigger('focus');
      await input.setValue(TEST_SOURCES[2].name);
      await input.trigger('blur');
      expect(wrapper.text()).toContain('already exists');
      await input.setValue(TEST_SOURCES[1].name);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('already exists');
    });
  });

  describe('initialization', () => {
    describe('for create', () => {
      it('initializes the name with a blank value', () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        expect(input.element.value).toBe('');
      });
    });

    describe('for update', () => {
      it('initializes the name with the source value', () => {
        wrapper = mountComponent({ source: TEST_SOURCES[1] });
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        expect(input.element.value).toBe(TEST_SOURCES[1].name);
      });
    });
  });

  describe('cancel button', () => {
    it('exists', () => {
      wrapper = mountComponent();
      expect(wrapper.findComponent('[data-testid="cancel-button"]').exists()).toBe(true);
    });

    it('emits cancel on click', async () => {
      wrapper = mountComponent();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]');
      await cancelButton.trigger('click');
      expect(wrapper.emitted('cancel')).toBeDefined();
    });
  });

  describe('save button', () => {
    it('exists', () => {
      wrapper = mountComponent();
      expect(wrapper.findComponent('[data-testid="save-button"]').exists()).toBe(true);
    });

    describe('for create', () => {
      it('is disabled until all valid data is filled in', async () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue(TEST_SOURCES[1].name);
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue('something else');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits the updated source data on click', async () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await input.setValue('Somewhere Else');
        await flushPromises();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeDefined();
        expect(wrapper.emitted('save')).toEqual([[{ name: 'Somewhere Else' }]]);
      });
    });

    describe('for update', () => {
      it('is disabled if a field is invalid', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[1] });
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue('');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled until the source data is modified', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[1] });
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue('something else');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits the updated source data on click', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[1] });
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await input.setValue('Something Else');
        await flushPromises();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeDefined();
        expect(wrapper.emitted('save')).toEqual([[{ id: TEST_SOURCES[1].id, name: 'Something Else' }]]);
      });
    });
  });
});
