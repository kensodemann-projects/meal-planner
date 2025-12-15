import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import type { Recipe } from '@/models/recipe';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IngredientEditorRow from '../IngredientEditorRow.vue';
import RecipeEditor from '../RecipeEditor.vue';
import { autocompleteIsRequired, numberInputIsRequired, textFieldIsRequired } from './test-utils';
import StepEditorRow from '../StepEditorRow.vue';

vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) => mount(RecipeEditor, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
  name: wrapper.findComponent('[data-testid="name-input"]').find('input'),
  description: wrapper.findComponent('[data-testid="description-input"]').find('textarea'),
  category: wrapper.findComponent('[data-testid="category-input"]').find('input'),
  cuisine: wrapper.findComponent('[data-testid="cuisine-input"]').find('input'),
  difficulty: wrapper.findComponent('[data-testid="difficulty-input"]').find('input'),
  servings: wrapper.findComponent('[data-testid="servings-input"]').find('input'),
  grams: wrapper.findComponent('[data-testid="grams-input"]').find('input'),
  units: wrapper.findComponent('[data-testid="recipe-units-input"]').find('input'),
  unitOfMeasure: wrapper.findComponent('[data-testid="recipe-unit-of-measure-input"]').find('input'),
  calories: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodium: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugar: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  carbs: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
  fat: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  protein: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
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

  it('includes the proper sub-sections', () => {
    wrapper = mountComponent();
    const subheaders = wrapper.findAll('h2');
    expect(subheaders.length).toBe(4);
    expect(subheaders[0]!.text()).toBe('Basic Information');
    expect(subheaders[1]!.text()).toBe('Ingredients');
    expect(subheaders[2]!.text()).toBe('Steps');
    expect(subheaders[3]!.text()).toBe('Nutritional Information');
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
      await autocompleteIsRequired(wrapper, 'category-input');
    });
  });

  describe('cuisine', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const cuisineInput = wrapper.findComponent(
        '[data-testid="cuisine-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(cuisineInput.exists()).toBe(true);
      expect(cuisineInput.props('label')).toBe('Cuisine');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'cuisine-input');
    });
  });

  describe('difficulty', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const difficultyInput = wrapper.findComponent(
        '[data-testid="difficulty-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(difficultyInput.exists()).toBe(true);
      expect(difficultyInput.props('label')).toBe('Difficulty');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'difficulty-input');
    });
  });

  describe('servings', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="servings-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Servings');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'servings-input');
    });
  });

  describe('serving grams', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Grams per Serving');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'grams-input');
    });
  });

  describe('serving size', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="recipe-units-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Serving Size');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'recipe-units-input');
    });
  });

  describe('unit of measure', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent(
        '[data-testid="recipe-unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Serving Units');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'recipe-unit-of-measure-input');
    });
  });

  describe('calories', () => {
    it('exists', () => {
      wrapper = mountComponent();
      const input = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Calories');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'calories-input');
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
      const input = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(input.exists()).toBe(true);
      expect(input.props('label')).toBe('Total Carbohydrates');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'carbs-input');
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
      expect(inputs.description.element.value).toBe('');
      expect(inputs.category.element.value).toBe('');
      expect(inputs.cuisine.element.value).toBe('');
      expect(inputs.difficulty.element.value).toBe('');
      expect(inputs.servings.element.value).toBe('');
      expect(inputs.grams.element.value).toBe('');
      expect(inputs.units.element.value).toBe('');
      expect(inputs.unitOfMeasure.element.value).toBe('');
      expect(inputs.calories.element.value).toBe('');
      expect(inputs.sodium.element.value).toBe('0');
      expect(inputs.sugar.element.value).toBe('0');
      expect(inputs.carbs.element.value).toBe('0');
      expect(inputs.fat.element.value).toBe('0');
      expect(inputs.protein.element.value).toBe('0');
    });

    describe('the ingredients list', () => {
      it('is empty', () => {
        const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
        const ingredients = listArea.findAllComponents(IngredientEditorRow);
        expect(ingredients.length).toBe(0);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        describe('on click', () => {
          it('adds a blank ingredient', async () => {
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
            await button.trigger('click');
            const ingredients = listArea.findAllComponents(IngredientEditorRow);
            expect(ingredients.length).toBe(1);
          });

          it('becomes disabled', async () => {
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            expect(button.attributes('disabled')).toBeUndefined();
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
          });

          it('remains disabled until the blank ingredient is filled in', async () => {
            const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
            const ingredients = listArea.findAllComponents(IngredientEditorRow);
            await ingredients[0]?.vm.$emit('changed', {
              id: 'bd3543e0-68d4-4ba0-a1a6-29548d46464b',
              units: 1,
              unitOfMeasure: findUnitOfMeasure('lb'),
              name: 'fudge',
            });
            expect(button.attributes('disabled')).toBeUndefined();
          });
        });
      });

      describe('deleting an ingredient', () => {
        it('removes the ingredient from the list', async () => {
          const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
          const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
          await button.trigger('click');
          let ingredients = listArea.findAllComponents(IngredientEditorRow);
          expect(ingredients.length).toBe(1);
          await ingredients[0]?.vm.$emit('delete');
          ingredients = listArea.findAllComponents(IngredientEditorRow);
          expect(ingredients.length).toBe(0);
        });
      });
    });

    describe('the steps list', () => {
      it('is empty', () => {
        const listArea = wrapper.find('[data-testid="step-list-grid"]');
        const steps = listArea.findAllComponents(StepEditorRow);
        expect(steps.length).toBe(0);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-step-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        describe('on click', () => {
          it('adds a blank step', async () => {
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            const listArea = wrapper.find('[data-testid="step-list-grid"]');
            await button.trigger('click');
            const steps = listArea.findAllComponents(StepEditorRow);
            expect(steps.length).toBe(1);
          });

          it('becomes disabled', async () => {
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            expect(button.attributes('disabled')).toBeUndefined();
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
          });

          it('remains disabled until the blank step is filled in', async () => {
            const listArea = wrapper.find('[data-testid="step-list-grid"]');
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
            const steps = listArea.findAllComponents(StepEditorRow);
            await steps[0]?.vm.$emit('changed', {
              id: 'bd3543e0-68d4-4ba0-a1a6-29548d46464b',
              instruction: 'Preheat oven to 375°F (190°C).',
            });
            expect(button.attributes('disabled')).toBeUndefined();
          });
        });
      });

      describe('deleting a step', () => {
        it('removes the step from the list', async () => {
          const button = wrapper.findComponent('[data-testid="add-step-button"]');
          const listArea = wrapper.find('[data-testid="step-list-grid"]');
          await button.trigger('click');
          let steps = listArea.findAllComponents(StepEditorRow);
          expect(steps.length).toBe(1);
          await steps[0]?.vm.$emit('delete');
          steps = listArea.findAllComponents(StepEditorRow);
          expect(steps.length).toBe(0);
        });
      });
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
        await inputs.cuisine.setValue('American');
        (wrapper.vm as any).cuisine = 'American';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.unitOfMeasure.setValue('oz');
        (wrapper.vm as any).unitOfMeasureId = 'oz';
        await inputs.name.setValue('Apple Pie');
        await inputs.grams.setValue('200');
        await inputs.servings.setValue('2');
        await inputs.units.setValue('12');
        await inputs.calories.setValue('325');
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is disabled if an invalid ingredient exists in the ingredients list', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.cuisine.setValue('American');
        (wrapper.vm as any).cuisine = 'American';
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.unitOfMeasure.setValue('oz');
        (wrapper.vm as any).unitOfMeasureId = 'oz';
        await inputs.name.setValue('Apple Pie');
        await inputs.grams.setValue('200');
        await inputs.servings.setValue('2');
        await inputs.units.setValue('12');
        await inputs.calories.setValue('325');
        expect(saveButton.attributes('disabled')).toBeUndefined();
        const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
        await button.trigger('click');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled if an invalid step exists in the steps list', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        await inputs.cuisine.setValue('American');
        (wrapper.vm as any).cuisine = 'American';
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.unitOfMeasure.setValue('oz');
        (wrapper.vm as any).unitOfMeasureId = 'oz';
        await inputs.name.setValue('Apple Pie');
        await inputs.grams.setValue('200');
        await inputs.servings.setValue('2');
        await inputs.units.setValue('12');
        await inputs.calories.setValue('325');
        expect(saveButton.attributes('disabled')).toBeUndefined();
        const button = wrapper.findComponent('[data-testid="add-step-button"]');
        await button.trigger('click');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits the entered data on click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        await inputs.cuisine.setValue('American');
        (wrapper.vm as any).cuisine = 'American';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.unitOfMeasure.setValue('oz');
        (wrapper.vm as any).unitOfMeasureId = 'oz';
        await inputs.name.setValue(' Apple Pie   ');
        await inputs.grams.setValue('200');
        await inputs.servings.setValue('2');
        await inputs.units.setValue('1');
        await inputs.calories.setValue('325');
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            name: 'Apple Pie',
            description: null,
            category: 'Dessert',
            cuisine: 'American',
            difficulty: 'Easy',
            servings: 2,
            units: 1,
            unitOfMeasure: findUnitOfMeasure('oz'),
            grams: 200,
            calories: 325,
            sodium: 0,
            sugar: 0,
            carbs: 0,
            fat: 0,
            protein: 0,
            ingredients: [],
            steps: [],
          },
        ]);
      });

      it('emits the entered description if entered', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        await inputs.cuisine.setValue('American');
        (wrapper.vm as any).cuisine = 'American';
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.difficulty.setValue('Easy');
        (wrapper.vm as any).difficulty = 'Easy';
        await inputs.unitOfMeasure.setValue('oz');
        (wrapper.vm as any).unitOfMeasureId = 'oz';
        await inputs.name.setValue('Apple Pie');
        await inputs.servings.setValue('2');
        await inputs.grams.setValue('200');
        await inputs.units.setValue('1');
        await inputs.calories.setValue('325');
        await inputs.description.setValue('  A delicious apple pie recipe.   ');
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        const emittedData = wrapper.emitted('save')?.[0]?.[0] as Recipe;
        expect(emittedData.description).toBe('A delicious apple pie recipe.');
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
      expect((wrapper.vm as any).cuisine).toBe(BEER_CHEESE.cuisine);
      expect((wrapper.vm as any).difficulty).toBe(BEER_CHEESE.difficulty);
      expect(inputs.servings.element.value).toBe(BEER_CHEESE.servings.toString());
      expect(inputs.grams.element.value).toBe(BEER_CHEESE.grams.toString());
      expect(inputs.units.element.value).toBe(BEER_CHEESE.units.toString());
      expect((wrapper.vm as any).unitOfMeasureId).toBe('cup');
      expect(inputs.calories.element.value).toBe(BEER_CHEESE.calories.toString());
      expect(inputs.sodium.element.value).toBe(BEER_CHEESE.sodium.toString());
      expect(inputs.sugar.element.value).toBe(BEER_CHEESE.sugar.toString());
      expect(inputs.carbs.element.value).toBe(BEER_CHEESE.carbs.toString());
      expect(inputs.fat.element.value).toBe(BEER_CHEESE.fat.toString());
      expect(inputs.protein.element.value).toBe(BEER_CHEESE.protein.toString());
    });

    describe('the ingredients list', () => {
      it('contains each ingredient', () => {
        const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
        const ingredients = listArea.findAllComponents(IngredientEditorRow);
        expect(ingredients.length).toBe(BEER_CHEESE.ingredients.length);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        describe('on click', () => {
          it('adds a blank ingredient', async () => {
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
            await button.trigger('click');
            const ingredients = listArea.findAllComponents(IngredientEditorRow);
            expect(ingredients.length).toBe(BEER_CHEESE.ingredients.length + 1);
          });

          it('becomes disabled', async () => {
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            expect(button.attributes('disabled')).toBeUndefined();
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
          });

          it('remains disabled until the blank ingredient is filled in', async () => {
            const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
            const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
            const ingredients = listArea.findAllComponents(IngredientEditorRow);
            await ingredients[ingredients.length - 1]?.vm.$emit('changed', {
              id: '0e8e3d4e-396d-42e8-aed6-fc8be1892c9e',
              units: 1,
              unitOfMeasure: findUnitOfMeasure('lb'),
              name: 'fudge',
            });
            expect(button.attributes('disabled')).toBeUndefined();
          });
        });
      });

      describe('deleting an ingredient', () => {
        it('removes the ingredient from the list', async () => {
          const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
          let ingredients = listArea.findAllComponents(IngredientEditorRow);
          const originalCount = BEER_CHEESE.ingredients.length;
          expect(ingredients.length).toBe(originalCount);
          await ingredients[2]?.vm.$emit('delete');
          ingredients = listArea.findAllComponents(IngredientEditorRow);
          expect(ingredients.length).toBe(originalCount - 1);
        });
      });
    });

    describe('the steps list', () => {
      it('contains each step', () => {
        const listArea = wrapper.find('[data-testid="step-list-grid"]');
        const steps = listArea.findAllComponents(StepEditorRow);
        expect(steps.length).toBe(BEER_CHEESE.steps.length);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-step-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        describe('on click', () => {
          it('adds a blank step', async () => {
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            const listArea = wrapper.find('[data-testid="step-list-grid"]');
            await button.trigger('click');
            const steps = listArea.findAllComponents(StepEditorRow);
            expect(steps.length).toBe(BEER_CHEESE.steps.length + 1);
          });

          it('becomes disabled', async () => {
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            expect(button.attributes('disabled')).toBeUndefined();
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
          });

          it('remains disabled until the blank step is filled in', async () => {
            const listArea = wrapper.find('[data-testid="step-list-grid"]');
            const button = wrapper.findComponent('[data-testid="add-step-button"]');
            await button.trigger('click');
            expect(button.attributes('disabled')).toBeDefined();
            const steps = listArea.findAllComponents(StepEditorRow);
            await steps[steps.length - 1]?.vm.$emit('changed', {
              id: '0e8e3d4e-396d-42e8-aed6-fc8be1892c9e',
              instruction: 'Mix thoroughly.',
            });
            expect(button.attributes('disabled')).toBeUndefined();
          });
        });
      });

      describe('deleting a step', () => {
        it('removes the step from the list', async () => {
          const listArea = wrapper.find('[data-testid="step-list-grid"]');
          let steps = listArea.findAllComponents(StepEditorRow);
          const originalCount = BEER_CHEESE.steps.length;
          expect(steps.length).toBe(originalCount);
          await steps[2]?.vm.$emit('delete');
          steps = listArea.findAllComponents(StepEditorRow);
          expect(steps.length).toBe(originalCount - 1);
        });
      });
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

      it('is enabled if an ingredient is changed', async () => {
        const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        const ingredients = listArea.findAllComponents(IngredientEditorRow);
        await ingredients[2]?.vm.$emit('changed', {
          id: '3d56a852-d60c-453d-ba8b-61e8091c07aa',
          units: 1,
          unitOfMeasure: findUnitOfMeasure('lb'),
          name: 'fudge',
        });
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is enabled if an ingredient is deleted', async () => {
        const listArea = wrapper.find('[data-testid="ingredient-list-grid"]');
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
        const ingredients = listArea.findAllComponents(IngredientEditorRow);
        await ingredients[2]?.vm.$emit('delete');
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is disabled if an invalid ingredient exists in the ingredients list', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.name.setValue('Apple Pie');
        expect(saveButton.attributes('disabled')).toBeUndefined();
        const button = wrapper.findComponent('[data-testid="add-ingredient-button"]');
        await button.trigger('click');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled if an invalid step exists in the steps list', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.name.setValue('Apple Pie');
        expect(saveButton.attributes('disabled')).toBeUndefined();
        const button = wrapper.findComponent('[data-testid="add-step-button"]');
        await button.trigger('click');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits the entered data on click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.category.setValue('Dessert');
        (wrapper.vm as any).category = 'Dessert';
        await inputs.difficulty.setValue('Normal');
        (wrapper.vm as any).difficulty = 'Normal';
        await inputs.name.setValue('Apple Pie');
        await inputs.calories.setValue('325');
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        const emittedData = wrapper.emitted('save')?.[0]?.[0] as Recipe;
        expect(emittedData.id).toBe('fie039950912');
        expect(emittedData.name).toBe('Apple Pie');
        expect(emittedData.description).toBe(BEER_CHEESE.description);
        expect(emittedData.category).toBe('Dessert');
        expect(emittedData.cuisine).toBe(BEER_CHEESE.cuisine);
        expect(emittedData.difficulty).toBe('Normal');
        expect(emittedData.servings).toBe(BEER_CHEESE.servings);
        expect(emittedData.units).toBe(BEER_CHEESE.units);
        expect(emittedData.unitOfMeasure).toEqual(findUnitOfMeasure('cup'));
        expect(emittedData.grams).toBe(BEER_CHEESE.grams);
        expect(emittedData.calories).toBe(325);
        expect(emittedData.sodium).toBe(BEER_CHEESE.sodium);
        expect(emittedData.sugar).toBe(BEER_CHEESE.sugar);
        expect(emittedData.carbs).toBe(BEER_CHEESE.carbs);
        expect(emittedData.fat).toBe(BEER_CHEESE.fat);
        expect(emittedData.protein).toBe(BEER_CHEESE.protein);
        expect(emittedData.steps).toEqual([...BEER_CHEESE.steps]);
        expect(emittedData.ingredients.length).toBe(BEER_CHEESE.ingredients.length);
        emittedData.ingredients.forEach((ingredient, index) => {
          expect(ingredient.id).toBeDefined();
          expect(typeof ingredient.id).toBe('string');
          expect(ingredient.name).toBe(BEER_CHEESE.ingredients[index]!.name);
          expect(ingredient.units).toBe(BEER_CHEESE.ingredients[index]!.units);
          expect(ingredient.unitOfMeasure).toEqual(BEER_CHEESE.ingredients[index]!.unitOfMeasure);
        });
      });
    });
  });
});

const BEER_CHEESE: Recipe = {
  id: 'fie039950912',
  name: 'Hearty Beer Cheese Soup',
  description: 'A rich and creamy soup combining sharp cheddar cheese with beer and savory seasonings.',
  category: 'Soup',
  cuisine: 'American',
  difficulty: 'Normal',
  servings: 6,
  units: 1.5,
  unitOfMeasure: findUnitOfMeasure('cup'),
  grams: 350,
  calories: 410,
  sodium: 680,
  sugar: 5,
  carbs: 22,
  fat: 30,
  protein: 15,
  ingredients: [
    {
      id: 'c01d5817-8101-4a72-8173-4b303e8dafde',
      units: 0.25,
      unitOfMeasure: findUnitOfMeasure('cup'),
      name: 'Unsalted Butter',
    },
    {
      id: '1fe0060d-7762-4f6a-a3ac-a8eaf98078a9',
      units: 0.25,
      unitOfMeasure: findUnitOfMeasure('cup'),
      name: 'All-Purpose Flour',
    },
    {
      id: '3d56a852-d60c-453d-ba8b-61e8091c07aa',
      units: 0.5,
      unitOfMeasure: findUnitOfMeasure('cup'),
      name: 'Chopped Onion',
    },
    {
      id: 'd8c1ddab-dd3f-4edf-bb60-75991b199247',
      units: 3,
      unitOfMeasure: findUnitOfMeasure('cup'),
      name: 'Chicken Broth',
    },
    {
      id: 'a0d9b316-32b4-44b3-b0aa-d7f139477a44',
      units: 12,
      unitOfMeasure: findUnitOfMeasure('floz'),
      name: 'Lager or Pale Ale Beer',
    },
    {
      id: '88706b21-246b-419a-8b20-de5a964ed1f9',
      units: 8,
      unitOfMeasure: findUnitOfMeasure('oz'),
      name: 'Sharp Cheddar Cheese, shredded',
    },
    {
      id: 'df8f184a-7cea-4f75-a72d-aa4333ec3e9c',
      units: 1,
      unitOfMeasure: findUnitOfMeasure('cup'),
      name: 'Heavy Cream',
    },
  ],
  steps: [
    {
      id: 'a5c9a7b3-6f4e-5d9a-fc6d-4a9c1a3e5f7b',
      instruction: 'In a large pot, melt butter over medium heat. Add onion and cook until softened, about 5 minutes.',
    },
    {
      id: 'b6d0a8c4-7a5f-6e0b-ad7e-5a0d2a4f6a8c',
      instruction: 'Whisk in the flour and cook for 1 minute to create a roux.',
    },
    {
      id: 'c7e1a9b5-8b6a-7f1c-be8f-6a1e3a5a7b9d',
      instruction: 'Slowly whisk in the chicken broth and then the beer, ensuring no lumps remain.',
    },
    {
      id: 'd8f2a0b6-9c7b-8a2d-cf9a-7a2f4a6b8c0e',
      instruction: 'Bring the soup to a simmer and cook for 10 minutes, stirring occasionally.',
    },
    {
      id: 'e9a3a1a7-0d8c-9b3e-da0b-8a3a5a7c9d1f',
      instruction:
        'Reduce heat to low. Stir in the heavy cream and then gradually add the shredded cheese, stirring constantly until fully melted and smooth.',
    },
    {
      id: 'f0b4a2a8-1e9d-0c4f-eb1c-9a4b6a8d0e2a',
      instruction:
        'Do not boil after adding cheese. Season with salt, pepper, and a dash of hot sauce if desired. Serve hot.',
    },
  ],
};
