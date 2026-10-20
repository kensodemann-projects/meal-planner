import { textFieldIsNotRequired, textFieldIsRequired } from '@/components/__tests__/test-utils.ts';
import { TEST_SOURCES } from '@/data/__tests__/test-data.ts';
import { GENERIC_RESTAURANT_SOURCE_ID, useSourcesData } from '@/data/sources.ts';
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

const sourceWith = (property: keyof Source): Source => {
  const source = TEST_SOURCES.find((item) => item.id !== GENERIC_RESTAURANT_SOURCE_ID && !!item[property]);
  if (!source) throw new Error(`No TEST_SOURCES entry includes ${property}`);
  return source;
};

const sourceWithout = (property: keyof Source): Source => {
  const source = TEST_SOURCES.find((item) => item.id !== GENERIC_RESTAURANT_SOURCE_ID && !item[property]);
  if (!source) throw new Error(`No TEST_SOURCES entry omits ${property}`);
  return source;
};

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

  describe('description', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="description-input"]') as VueWrapper<components.VTextarea>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Description');
      expect(input.find('textarea').exists()).toBe(true);
    });

    it('is optional', async () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('url', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="url-input"]') as VueWrapper<components.VTextField>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('URL');
    });

    it('is optional', async () => {
      wrapper = mountComponent();
      await textFieldIsNotRequired(wrapper, 'url-input');
    });

    it('must be an http or https URL', async () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="url-input"]').find('input');

      expect(wrapper.text()).not.toContain('Must be an http or https URL');
      await input.trigger('focus');
      await input.setValue('example.com');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Must be an http or https URL');
      await input.setValue('ftp://example.com');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Must be an http or https URL');
      await input.setValue('https://example.com');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Must be an http or https URL');
    });
  });

  describe('initialization', () => {
    describe('for create', () => {
      it('initializes the name with a blank value', () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        expect(input.element.value).toBe('');
      });

      it('initializes the description with a blank value', () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        expect(input.element.value).toBe('');
      });

      it('initializes the url with a blank value', () => {
        wrapper = mountComponent();
        const input = wrapper.findComponent('[data-testid="url-input"]').find('input');
        expect(input.element.value).toBe('');
      });
    });

    describe('for update', () => {
      it('initializes the name with the source value', () => {
        const source = sourceWith('name');
        wrapper = mountComponent({ source });
        const input = wrapper.findComponent('[data-testid="name-input"]').find('input');
        expect(input.element.value).toBe(source.name);
      });

      it('initializes the description with the source value', () => {
        const source = sourceWith('description');
        wrapper = mountComponent({ source });
        const input = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        expect(input.element.value).toBe(source.description);
      });

      it('initializes a missing description as blank', () => {
        const source = sourceWithout('description');
        wrapper = mountComponent({ source });
        const input = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        expect(input.element.value).toBe('');
      });

      it('initializes the url with the source value', () => {
        const source = sourceWith('url');
        wrapper = mountComponent({ source });
        const input = wrapper.findComponent('[data-testid="url-input"]').find('input');
        expect(input.element.value).toBe(source.url);
      });

      it('initializes a missing url as blank', () => {
        const source = sourceWithout('url');
        wrapper = mountComponent({ source });
        const input = wrapper.findComponent('[data-testid="url-input"]').find('input');
        expect(input.element.value).toBe('');
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

      it('is disabled when the url is invalid', async () => {
        wrapper = mountComponent();
        const nameInput = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const urlInput = wrapper.findComponent('[data-testid="url-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await nameInput.setValue('something else');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await urlInput.setValue('not a url');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeDefined();
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

      it('emits the description and url when provided', async () => {
        wrapper = mountComponent();
        const nameInput = wrapper.findComponent('[data-testid="name-input"]').find('input');
        const descriptionInput = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        const urlInput = wrapper.findComponent('[data-testid="url-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await nameInput.setValue('Somewhere Else');
        await descriptionInput.setValue('A neighborhood bistro.');
        await urlInput.setValue('https://example.com/bistro');
        await flushPromises();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toEqual([
          [
            {
              name: 'Somewhere Else',
              description: 'A neighborhood bistro.',
              url: 'https://example.com/bistro',
            },
          ],
        ]);
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

      it('is enabled when only the description changes', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[3] });
        const input = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue('Updated description');
        await flushPromises();
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled when only the url changes', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[3] });
        const input = wrapper.findComponent('[data-testid="url-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        await input.setValue('https://example.com/updated');
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
        expect(wrapper.emitted('save')).toEqual([
          [{ id: TEST_SOURCES[1].id, name: 'Something Else', description: TEST_SOURCES[1].description }],
        ]);
      });

      it('emits the description and url when they change', async () => {
        wrapper = mountComponent({ source: TEST_SOURCES[3] });
        const descriptionInput = wrapper.findComponent('[data-testid="description-input"]').find('textarea');
        const urlInput = wrapper.findComponent('[data-testid="url-input"]').find('input');
        const saveButton = wrapper.findComponent('[data-testid="save-button"]');
        await descriptionInput.setValue('Updated description');
        await urlInput.setValue('https://example.com/updated');
        await flushPromises();
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toEqual([
          [
            {
              id: TEST_SOURCES[3].id,
              name: TEST_SOURCES[3].name,
              description: 'Updated description',
              url: 'https://example.com/updated',
            },
          ],
        ]);
      });
    });
  });
});
