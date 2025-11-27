import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeEditor from '../RecipeEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(RecipeEditor, { props, global: { plugins: [vuetify] } });

describe('Recipe Editor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  describe('name input', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="name-input"]');
      expect(input.exists()).toBe(true);
    });

    it('is required', async () => {
      wrapper = mountComponent();
      const nameInput = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      const input = nameInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue('Kiwi fruit');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('category', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const categoryInput = wrapper.findComponent(
        '[data-testid="category-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(categoryInput.exists()).toBe(true);
      expect(categoryInput.props('label')).toBe('Category');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      const categoryInput = wrapper.findComponent(
        '[data-testid="category-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      const input = categoryInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');
    });
  });

  describe('difficulty', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const categoryInput = wrapper.findComponent(
        '[data-testid="difficulty-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(categoryInput.exists()).toBe(true);
      expect(categoryInput.props('label')).toBe('Difficulty');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      const difficultyInput = wrapper.findComponent(
        '[data-testid="difficulty-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      const input = difficultyInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');
    });
  });

  describe('cancel button', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      expect(cancelButton.exists()).toBe(true);
    });

    it('emits the "cancel" event on click', async () => {
      wrapper = mountComponent();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      await cancelButton.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });
  });

  describe('save button', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
      expect(saveButton.exists()).toBe(true);
    });
  });
});
