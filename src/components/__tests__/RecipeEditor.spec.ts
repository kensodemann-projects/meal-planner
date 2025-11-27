import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeEditor from '../RecipeEditor.vue';
import type { Recipe } from '@/models/recipe';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(RecipeEditor, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
  name: wrapper.findComponent('[data-testid="name-input"]').find('input'),
  category: wrapper.findComponent('[data-testid="category-input"]').find('input'),
  difficulty: wrapper.findComponent('[data-testid="difficulty-input"]').find('input'),
});

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

  describe('for create', () => {
    beforeEach(() => {
      wrapper = mountComponent();
    });

    it('initializes the inputs with blank values', () => {
      const inputs = getInputs(wrapper);
      expect(inputs.name.element.value).toBe('');
      expect(inputs.category.element.value).toBe('');
      expect(inputs.difficulty.element.value).toBe('');
    });

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled until all required fields are filled in', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.name.setValue('Apple Pie');
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits the entered data in click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.name.setValue('Apple Pie');
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            name: 'Apple Pie',
            category: 'Dessert',
            difficulty: 'Easy',
          },
        ]);
      });
    });
  });

  describe('for update', () => {
    beforeEach(() => {
      wrapper = mountComponent({ recipe: BEER_CHEESE });
    });

    it('initializes the inputs with blank values', () => {
      const inputs = getInputs(wrapper);
      expect(inputs.name.element.value).toBe(BEER_CHEESE.name);
      expect((wrapper.vm as any).category).toBe(BEER_CHEESE.category);
      expect((wrapper.vm as any).difficulty).toBe(BEER_CHEESE.difficulty);
    });

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled if a value is changed', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.name.setValue('Apple Pie');
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits the entered data in click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Normal');
        (wrapper.vm as any).difficulty = 'Normal';
        await inputs.name.setValue('Apple Pie');
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            id: 'fie039950912',
            name: 'Apple Pie',
            category: 'Dessert',
            difficulty: 'Normal',
          },
        ]);
      });
    });
  });
});

const BEER_CHEESE: Recipe = {
  id: 'fie039950912',
  name: 'Beer Cheese',
  category: 'Beverage',
  difficulty: 'Easy',
};
