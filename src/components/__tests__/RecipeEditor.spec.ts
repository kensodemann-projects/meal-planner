import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeEditor from '../RecipeEditor.vue';
import type { Recipe } from '@/models/recipe';
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(RecipeEditor, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
  name: wrapper.findComponent('[data-testid="name-input"]').find('input'),
  category: wrapper.findComponent('[data-testid="category-input"]').find('input'),
  difficulty: wrapper.findComponent('[data-testid="difficulty-input"]').find('input'),
  servings: wrapper.findComponent('[data-testid="servings-input"]').find('input'),
  gramsPerServing: wrapper.findComponent('[data-testid="grams-per-serving-input"]').find('input'),
  servingSize: wrapper.findComponent('[data-testid="serving-size-input"]').find('input'),
  servingUnitOfMeasure: wrapper.findComponent('[data-testid="unit-of-measure-input"]').find('input'),
  calories: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodium: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugar: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  totalCarbs: wrapper.findComponent('[data-testid="total-carbs-input"]').find('input'),
  fat: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  protein: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
});

const numberInputIsRequired = async (wrapper: ReturnType<typeof mountComponent>, testId: string) => {
  const vInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = vInput.find('input');

  expect(wrapper.text()).not.toContain('Required');
  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Required');

  await input.setValue('12');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

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

  it('includes the proper sub-sections', () => {
    wrapper = mountComponent();
    const subheaders = wrapper.findAll('h2');
    expect(subheaders.length).toBe(4);
    expect(subheaders[0]!.text()).toBe('Basic Information');
    expect(subheaders[1]!.text()).toBe('Nutritional Information');
    expect(subheaders[2]!.text()).toBe('Ingredients');
    expect(subheaders[3]!.text()).toBe('Steps');
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

  describe('servings', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="servings-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Servings');
    });
  });

  describe('serving grams', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent(
        '[data-testid="grams-per-serving-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Grams per Serving');
    });
  });

  describe('serving size', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="serving-size-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Serving Size');
    });
  });

  describe('unit of measure', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Serving Units');
    });
  });

  describe('calories', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Calories');
    });
  });

  describe('sodium', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Sodium');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'sodium-input');
    });
  });

  describe('sugar', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Sugar');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'sugar-input');
    });
  });

  describe('total carbs', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="total-carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Total Carbohydrates');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'total-carbs-input');
    });
  });

  describe('fat', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Fat');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'fat-input');
    });
  });

  describe('protein', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="protein-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Protein');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'protein-input');
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
      expect(inputs.servings.element.value).toBe('');
      expect(inputs.gramsPerServing.element.value).toBe('');
      expect(inputs.servingSize.element.value).toBe('');
      expect(inputs.servingUnitOfMeasure.element.value).toBe('');
      expect(inputs.calories.element.value).toBe('');
      expect(inputs.sodium.element.value).toBe('0');
      expect(inputs.sugar.element.value).toBe('0');
      expect(inputs.totalCarbs.element.value).toBe('0');
      expect(inputs.fat.element.value).toBe('0');
      expect(inputs.protein.element.value).toBe('0');
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
            description: null,
            category: 'Dessert',
            difficulty: 'Easy',
            servings: 0,
            servingSize: 0,
            servingSizeUnits: findUnitOfMeasure('item'),
            servingGrams: null,
            calories: 0,
            sodium: 0,
            sugar: 0,
            totalCarbs: 0,
            fat: 0,
            protein: 0,
            ingredients: [],
            steps: [],
          },
        ]);
      });
    });
  });

  describe('for update', () => {
    beforeEach(() => {
      wrapper = mountComponent({ recipe: BEER_CHEESE });
    });

    it('initializes the inputs with recipe values', () => {
      const inputs = getInputs(wrapper);
      expect(inputs.name.element.value).toBe(BEER_CHEESE.name);
      expect((wrapper.vm as any).category).toBe(BEER_CHEESE.category);
      expect((wrapper.vm as any).difficulty).toBe(BEER_CHEESE.difficulty);
      expect(inputs.servings.element.value).toBe(BEER_CHEESE.servings.toString());
      expect(inputs.gramsPerServing.element.value).toBe(BEER_CHEESE.servingGrams?.toString());
      expect(inputs.servingSize.element.value).toBe(BEER_CHEESE.servingSize.toString());
      expect((wrapper.vm as any).servingUnitOfMeasure).toBe('floz');
      expect(inputs.calories.element.value).toBe(BEER_CHEESE.calories.toString());
      expect(inputs.sodium.element.value).toBe(BEER_CHEESE.sodium.toString());
      expect(inputs.sugar.element.value).toBe(BEER_CHEESE.sugar.toString());
      expect(inputs.totalCarbs.element.value).toBe(BEER_CHEESE.totalCarbs.toString());
      expect(inputs.fat.element.value).toBe(BEER_CHEESE.fat.toString());
      expect(inputs.protein.element.value).toBe(BEER_CHEESE.protein.toString());
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
            description: null,
            category: 'Dessert',
            difficulty: 'Normal',
            servings: 0,
            servingSize: 0,
            servingSizeUnits: findUnitOfMeasure('item'),
            servingGrams: null,
            calories: 0,
            sodium: 0,
            sugar: 0,
            totalCarbs: 0,
            fat: 0,
            protein: 0,
            ingredients: [],
            steps: [],
          },
        ]);
      });
    });
  });
});

const BEER_CHEESE: Recipe = {
  id: 'fie039950912',
  name: 'Beer Cheese',
  description: 'It is beery. It is cheesey. How could you go wrong?',
  category: 'Beverage',
  difficulty: 'Easy',
  servings: 2,
  servingSize: 8,
  servingSizeUnits: findUnitOfMeasure('floz'),
  servingGrams: 140,
  calories: 375,
  sodium: 1250,
  sugar: 18,
  totalCarbs: 42,
  fat: 35,
  protein: 15,
  ingredients: [],
  steps: [],
};
