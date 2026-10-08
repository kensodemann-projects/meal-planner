import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { useNutritionGenerator } from '@/core/nutrition-generator';
import { TEST_PREPARED_RECIPE, TEST_RECIPES, TEST_SOURCES } from '@/data/__tests__/test-data';
import { useRecipesData } from '@/data/recipes';
import { useSourcesData } from '@/data/sources';
import type { Source } from '@/models/source';
import type { Recipe, RecipeIngredient, RecipeKind, RecipeStep } from '@/models/recipe';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Component, Ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {
  autocompleteIsRequired,
  numberInputIsRequired,
  numberInputMustBeZeroOrGreater,
  textFieldIsRequired,
} from '../../__tests__/test-utils';
import IngredientEditorRow from '../IngredientEditorRow.vue';
import RecipeEditor from '../RecipeEditor.vue';
import StepEditorRow from '../StepEditorRow.vue';

vi.mock('@/core/nutrition-generator');
vi.mock('@/data/recipes');
vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props = {}) =>
  mount(RecipeEditor, {
    props,
    global: {
      plugins: [vuetify],
      stubs: {
        SortableListEditor: {
          name: 'SortableListEditor',
          template: `
            <div>
              <div class="header-section">
                <h2>{{ title }}</h2>
                <button
                  :data-testid="'add-' + testIdPrefix + '-button'"
                  :disabled="hasInvalidItems"
                  @click="addItem"
                >Add</button>
              </div>
              <div :data-testid="testIdPrefix + '-list-grid'" class="list-container">
                <div v-for="(item, index) in modelValue" :key="item.id" class="list-item">
                  <slot name="item" :item="item" :index="index"
                    :on-change="(updated) => changeItem(updated, index)"
                    :on-delete="() => deleteItem(index)"
                  />
                </div>
              </div>
            </div>
          `,
          props: ['modelValue', 'title', 'validateItem', 'createItem', 'testIdPrefix', 'listClass', 'sortable'],
          computed: {
            hasInvalidItems() {
              return this.modelValue.some((item: any) => !this.validateItem(item));
            },
          },
          methods: {
            addItem() {
              const newArr = [...this.modelValue, this.createItem()];
              this.$emit('update:modelValue', newArr);
              this.$emit('list-modified');
            },
            changeItem(updated: any, index: number) {
              const arr = [...this.modelValue];
              arr[index] = updated;
              this.$emit('update:modelValue', arr);
              this.$emit('list-modified');
            },
            deleteItem(index: number) {
              const arr = [...this.modelValue];
              arr.splice(index, 1);
              this.$emit('update:modelValue', arr);
              this.$emit('list-modified');
            },
          },
        },
      },
    },
  });

type EditorWrapper = ReturnType<typeof mountComponent>;
type FieldSetter = { setValue: (value: string) => Promise<void> };

const getInputs = (wrapper: EditorWrapper) => ({
  name: wrapper.findComponent('[data-testid="name-input"]').find('input'),
  description: wrapper.findComponent('[data-testid="description-input"]').find('textarea'),
  category: wrapper.findComponent('[data-testid="category-input"]') as VueWrapper<components.VAutocomplete>,
  cuisine: wrapper.findComponent('[data-testid="cuisine-input"]') as VueWrapper<components.VAutocomplete>,
  difficulty: wrapper.findComponent('[data-testid="difficulty-input"]') as VueWrapper<components.VAutocomplete>,
  servings: wrapper.findComponent('[data-testid="servings-input"]').find('input'),
  prepTimeMinutes: wrapper.findComponent('[data-testid="prep-time-input"]').find('input'),
  cookTimeMinutes: wrapper.findComponent('[data-testid="cook-time-input"]').find('input'),
});

const getPreparedInputs = (wrapper: EditorWrapper) => {
  const source = wrapper.findComponent('[data-testid="source-input"]') as VueWrapper<components.VAutocomplete>;
  if (!source.exists() || source.props('label') !== 'Source') throw new Error('Source field was not rendered');
  return {
    name: wrapper.findComponent('[data-testid="name-input"]').find('input'),
    description: wrapper.findComponent('[data-testid="description-input"]').find('textarea'),
    category: wrapper.findComponent('[data-testid="category-input"]') as VueWrapper<components.VAutocomplete>,
    cuisine: wrapper.findComponent('[data-testid="cuisine-input"]') as VueWrapper<components.VAutocomplete>,
    source,
    servings: wrapper.findComponent('[data-testid="servings-input"]').find('input'),
  };
};

const autocompleteLabeled = (wrapper: EditorWrapper, label: string) =>
  wrapper.findAllComponents(components.VAutocomplete).find((field) => field.props('label') === label);

const expectHomemadeFields = (wrapper: EditorWrapper) => {
  expect(wrapper.find('[data-testid="name-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="description-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="category-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="cuisine-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="servings-input"]').exists()).toBe(true);
  expect(autocompleteLabeled(wrapper, 'Difficulty')).toBeDefined();
  expect(wrapper.find('[data-testid="prep-time-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="cook-time-input"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="ingredient-list-grid"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="step-list-grid"]').exists()).toBe(true);
  expect(wrapper.find('[data-testid="calories-input"]').exists()).toBe(true);
  expect(autocompleteLabeled(wrapper, 'Source')).toBeUndefined();
};

const getNutritionInputs = (wrapper: EditorWrapper) => ({
  calories: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodium: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugar: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  carbs: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
  fat: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  protein: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
});

const asFieldSetters = (fields: Record<string, FieldSetter>) => fields;

const fillHomemade = async (wrapper: EditorWrapper, options?: { name?: string; description?: string }) => {
  const inputs = getInputs(wrapper);
  const nutritionInputs = getNutritionInputs(wrapper);
  await inputs.category.setValue('Dessert');
  await inputs.cuisine.setValue('American');
  await inputs.difficulty.setValue('Easy');
  await inputs.name.setValue(options?.name ?? 'Apple Pie');
  await inputs.servings.setValue('2');
  await inputs.prepTimeMinutes.setValue('30');
  await inputs.cookTimeMinutes.setValue('45');
  await nutritionInputs.calories.setValue('325');
  if (options?.description !== undefined) {
    await inputs.description.setValue(options.description);
  }
};

const fillPrepared = async (
  wrapper: EditorWrapper,
  sourceId: string,
  options?: { name?: string; description?: string },
) => {
  const inputs = getPreparedInputs(wrapper);
  const nutritionInputs = getNutritionInputs(wrapper);
  await inputs.category.setValue('Seafood');
  await inputs.cuisine.setValue('Japanese');
  await inputs.source.setValue(sourceId);
  await inputs.name.setValue(options?.name ?? 'Black Cod Bowl');
  await inputs.servings.setValue('1');
  await nutritionInputs.calories.setValue('540');
  if (options?.description !== undefined) {
    await inputs.description.setValue(options.description);
  }
};

const FILLED_INGREDIENT: RecipeIngredient = {
  id: 'bd3543e0-68d4-4ba0-a1a6-29548d46464b',
  units: 1,
  unitOfMeasure: findUnitOfMeasure('lb'),
  name: 'fudge',
};

const FILLED_STEP: RecipeStep = {
  id: 'bd3543e0-68d4-4ba0-a1a6-29548d46464b',
  instruction: 'Preheat oven to 375°F (190°C).',
};

const describeEditableList = <T extends object>(
  getWrapper: () => EditorWrapper,
  options: {
    title: string;
    noun: string;
    testIdPrefix: string;
    row: Component;
    prop: string;
    initialItems: readonly T[];
    filledItem: T;
  },
) => {
  const { title, noun, testIdPrefix, row, prop, initialItems, filledItem } = options;

  describe(title, () => {
    const listRows = () => getWrapper().find(`[data-testid="${testIdPrefix}-list-grid"]`).findAllComponents(row);
    const addButton = () => getWrapper().find(`[data-testid="add-${testIdPrefix}-button"]`);

    if (initialItems.length === 0) {
      it('is empty', () => {
        expect(listRows().length).toBe(0);
      });
    } else {
      it(`contains each ${noun}`, () => {
        const rows = listRows();
        expect(rows.length).toBe(initialItems.length);
        rows.forEach((listRow: VueWrapper, index: number) => {
          const rowProps = listRow.props() as Record<string, unknown>;
          expect(rowProps[prop]).toEqual(initialItems[index]);
        });
      });
    }

    it('has add enabled', () => {
      expect(addButton().attributes('disabled')).toBeUndefined();
    });

    it(`adds a blank ${noun}`, async () => {
      await addButton().trigger('click');
      expect(listRows().length).toBe(initialItems.length + 1);
    });

    it(`disables add when the blank ${noun} is added`, async () => {
      expect(addButton().attributes('disabled')).toBeUndefined();
      await addButton().trigger('click');
      expect(addButton().attributes('disabled')).toBeDefined();
    });

    it(`enables add once the blank ${noun} is filled in`, async () => {
      await addButton().trigger('click');
      expect(addButton().attributes('disabled')).toBeDefined();
      const rows = listRows();
      await rows[rows.length - 1]?.vm.$emit('changed', filledItem);
      expect(addButton().attributes('disabled')).toBeUndefined();
    });

    it(`removes the ${noun} from the list`, async () => {
      if (initialItems.length === 0) {
        await addButton().trigger('click');
        let rows = listRows();
        expect(rows.length).toBe(1);
        await rows[0]?.vm.$emit('delete');
        rows = listRows();
        expect(rows.length).toBe(0);
        return;
      }

      let rows = listRows();
      expect(rows.length).toBe(initialItems.length);
      await rows[2]?.vm.$emit('delete');
      rows = listRows();
      expect(rows.length).toBe(initialItems.length - 1);
    });
  });
};

const BEER_CHEESE: Recipe = {
  id: 'fie039950912',
  name: 'Hearty Beer Cheese Soup',
  description: 'A rich and creamy soup combining sharp cheddar cheese with beer and savory seasonings.',
  kind: 'homemade',
  category: 'Soup',
  cuisine: 'American',
  difficulty: 'Normal',
  servings: 6,
  prepTimeMinutes: 15,
  cookTimeMinutes: 30,
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

describe('Recipe Editor', () => {
  let wrapper: EditorWrapper;

  beforeEach(() => {
    const { recipes } = useRecipesData();
    (recipes as Ref<Recipe[]>).value = TEST_RECIPES;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('rendering', () => {
    it('renders', () => {
      wrapper = mountComponent();
      expect(wrapper.exists()).toBe(true);
    });

    describe('homemade', () => {
      it('shows the homemade fields and hides source when kind is homemade', () => {
        wrapper = mountComponent({ kind: 'homemade' });
        expectHomemadeFields(wrapper);
      });

      it('behaves like homemade when kind is omitted', () => {
        wrapper = mountComponent();
        expectHomemadeFields(wrapper);
      });

      it('treats a stored recipe with no kind as homemade', () => {
        wrapper = mountComponent({ recipe: { ...BEER_CHEESE, kind: undefined } });
        expectHomemadeFields(wrapper);
      });

      it('includes the homemade sub-sections', () => {
        wrapper = mountComponent();
        const subheaders = wrapper.findAll('h2');
        expect(subheaders.length).toBe(4);
        expect(subheaders[0]!.text()).toBe('Basic Information');
        expect(subheaders[1]!.text()).toBe('Ingredients');
        expect(subheaders[2]!.text()).toBe('Steps');
        expect(subheaders[3]!.text()).toBe('Nutritional Information Per Serving');
      });
    });

    describe('prepared', () => {
      it('hides the homemade-only fields and shows source when kind is prepared', () => {
        wrapper = mountComponent({ kind: 'prepared' });

        expect(wrapper.find('[data-testid="name-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="description-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="category-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="cuisine-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="servings-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="calories-input"]').exists()).toBe(true);
        expect(autocompleteLabeled(wrapper, 'Source')).toBeDefined();

        expect(autocompleteLabeled(wrapper, 'Difficulty')).toBeUndefined();
        expect(wrapper.find('[data-testid="prep-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="cook-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ingredient-list-grid"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="step-list-grid"]').exists()).toBe(false);
      });
    });
  });

  describe('validation', () => {
    beforeEach(() => {
      wrapper = mountComponent();
    });

    describe('name', () => {
      it('is required', async () => {
        await textFieldIsRequired(wrapper, 'name-input');
      });

      it('must be unique', async () => {
        const textField = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
        const input = textField.find('input');

        expect(wrapper.text()).not.toContain('already exists');
        await input.trigger('focus');
        await input.setValue(TEST_RECIPES[0].name);
        await input.trigger('blur');
        expect(wrapper.text()).toContain('already exists');

        await input.setValue('redrum');
        await input.trigger('blur');
        expect(wrapper.text()).not.toContain('already exists');
      });

      it('allows the name to be reset', async () => {
        wrapper.unmount();
        wrapper = mountComponent({ recipe: { ...TEST_RECIPES[0] } });
        const input = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
        const textField = input.find('input');

        expect(wrapper.text()).not.toContain('already exists');
        await textField.setValue(TEST_RECIPES[1].name);
        await textField.trigger('blur');
        expect(wrapper.text()).toContain('already exists');

        await textField.setValue(TEST_RECIPES[0].name);
        await textField.trigger('blur');
        expect(wrapper.text()).not.toContain('already exists');
      });
    });

    describe('category', () => {
      it('is required', async () => {
        await autocompleteIsRequired(wrapper, 'category-input');
      });
    });

    describe('cuisine', () => {
      it('is required', async () => {
        await autocompleteIsRequired(wrapper, 'cuisine-input');
      });
    });

    describe('difficulty', () => {
      it('is required', async () => {
        await autocompleteIsRequired(wrapper, 'difficulty-input');
      });
    });

    describe('servings', () => {
      it('is required', async () => {
        await numberInputIsRequired(wrapper, 'servings-input');
      });
    });

    describe('prep time', () => {
      it('is required', async () => {
        await numberInputIsRequired(wrapper, 'prep-time-input');
      });

      it('must be zero or greater', async () => {
        await numberInputMustBeZeroOrGreater(wrapper, 'prep-time-input');
      });
    });

    describe('cook time', () => {
      it('is required', async () => {
        await numberInputIsRequired(wrapper, 'cook-time-input');
      });

      it('must be zero or greater', async () => {
        await numberInputMustBeZeroOrGreater(wrapper, 'cook-time-input');
      });
    });
  });

  describe('for create', () => {
    describe('homemade', () => {
      beforeEach(() => {
        wrapper = mountComponent();
      });

      it('initializes the inputs with blank values', () => {
        const inputs = getInputs(wrapper);
        const nutritionInputs = getNutritionInputs(wrapper);
        expect(inputs.name.element.value).toBe('');
        expect(inputs.description.element.value).toBe('');
        expect(inputs.category.props('modelValue')).toBeNull();
        expect(inputs.cuisine.props('modelValue')).toBeNull();
        expect(inputs.difficulty.props('modelValue')).toBeNull();
        expect(inputs.servings.element.value).toBe('');
        expect(inputs.prepTimeMinutes.element.value).toBe('');
        expect(inputs.cookTimeMinutes.element.value).toBe('');
        expect(nutritionInputs.calories.element.value).toBe('');
        expect(nutritionInputs.sodium.element.value).toBe('0');
        expect(nutritionInputs.sugar.element.value).toBe('0');
        expect(nutritionInputs.carbs.element.value).toBe('0');
        expect(nutritionInputs.fat.element.value).toBe('0');
        expect(nutritionInputs.protein.element.value).toBe('0');
      });

      describeEditableList(() => wrapper, {
        title: 'the ingredients list',
        noun: 'ingredient',
        testIdPrefix: 'ingredient',
        row: IngredientEditorRow,
        prop: 'ingredient',
        initialItems: [],
        filledItem: FILLED_INGREDIENT,
      });

      describeEditableList(() => wrapper, {
        title: 'the steps list',
        noun: 'step',
        testIdPrefix: 'step',
        row: StepEditorRow,
        prop: 'step',
        initialItems: [],
        filledItem: FILLED_STEP,
      });

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('emits the description if entered', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillHomemade(wrapper, { description: '  A delicious apple pie recipe.   ' });
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          const emittedData = wrapper.emitted('save')?.[0]?.[0] as Recipe;
          expect(emittedData.description).toBe('A delicious apple pie recipe.');
        });

        it('is disabled until all required fields are filled in', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          await inputs.category.setValue('Dessert');
          await inputs.cuisine.setValue('American');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await fillHomemade(wrapper);
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });

        it('is disabled if an invalid ingredient exists in the ingredients list', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillHomemade(wrapper);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          const button = wrapper.find('[data-testid="add-ingredient-button"]');
          await button.trigger('click');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled if an invalid step exists in the steps list', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillHomemade(wrapper);
          expect(saveButton.attributes('disabled')).toBeUndefined();
          const button = wrapper.find('[data-testid="add-step-button"]');
          await button.trigger('click');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('emits the entered data on click', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillHomemade(wrapper, { name: ' Apple Pie   ' });
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          expect(wrapper.emitted('save')?.[0]).toEqual([
            {
              name: 'Apple Pie',
              description: null,
              kind: 'homemade',
              category: 'Dessert',
              cuisine: 'American',
              difficulty: 'Easy',
              servings: 2,
              prepTimeMinutes: 30,
              cookTimeMinutes: 45,
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
      });
    });

    describe('prepared', () => {
      const sourceId = 'fiie002934009ser';

      beforeEach(() => {
        const { sources } = useSourcesData();
        (sources as Ref<Source[]>).value = TEST_SOURCES;
        wrapper = mountComponent({ kind: 'prepared' });
      });

      it('initializes the inputs with blank values', () => {
        const inputs = getPreparedInputs(wrapper);
        const nutritionInputs = getNutritionInputs(wrapper);
        expect(inputs.name.element.value).toBe('');
        expect(inputs.description.element.value).toBe('');
        expect(inputs.category.props('modelValue')).toBeNull();
        expect(inputs.cuisine.props('modelValue')).toBeNull();
        expect(inputs.source.props('modelValue')).toBeNull();
        expect(inputs.servings.element.value).toBe('');
        expect(nutritionInputs.calories.element.value).toBe('');
        expect(nutritionInputs.sodium.element.value).toBe('0');
        expect(nutritionInputs.sugar.element.value).toBe('0');
        expect(nutritionInputs.carbs.element.value).toBe('0');
        expect(nutritionInputs.fat.element.value).toBe('0');
        expect(nutritionInputs.protein.element.value).toBe('0');
        expect(autocompleteLabeled(wrapper, 'Difficulty')).toBeUndefined();
        expect(wrapper.find('[data-testid="prep-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="cook-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ingredient-list-grid"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="step-list-grid"]').exists()).toBe(false);
      });

      describe('the save button', () => {
        it('begins disabled', () => {
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled until all required fields are filled in', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getPreparedInputs(wrapper);
          const nutritionInputs = getNutritionInputs(wrapper);
          await inputs.category.setValue('Seafood');
          await inputs.cuisine.setValue('Japanese');
          await inputs.name.setValue('Black Cod Bowl');
          await inputs.servings.setValue('1');
          await nutritionInputs.calories.setValue('540');
          expect(saveButton.attributes('disabled')).toBeDefined();
          await inputs.source.setValue(sourceId);
          await flushPromises();
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });

        it('emits the description if entered', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillPrepared(wrapper, sourceId, {
            description: '  Chef-prepared miso cod over forbidden rice.   ',
          });
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          const emittedData = wrapper.emitted('save')?.[0]?.[0] as Recipe;
          expect(emittedData.description).toBe('Chef-prepared miso cod over forbidden rice.');
        });

        it('emits the entered data on click', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await fillPrepared(wrapper, sourceId, { name: '  Black Cod Bowl  ' });
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          expect(wrapper.emitted('save')?.[0]).toEqual([
            {
              name: 'Black Cod Bowl',
              description: null,
              kind: 'prepared',
              sourceId,
              category: 'Seafood',
              cuisine: 'Japanese',
              difficulty: 'Easy',
              servings: 1,
              prepTimeMinutes: 0,
              cookTimeMinutes: 0,
              calories: 540,
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
      });
    });
  });

  describe('for update', () => {
    describe('nutrition', () => {
      it('updates internal state when NutritionEditorRows emits changes', async () => {
        const recipe: Partial<Recipe> = {
          name: 'Test Recipe',
          calories: 250,
          sodium: 400,
          sugar: 12,
          carbs: 30,
          fat: 8,
          protein: 15,
          ingredients: [],
          steps: [],
        };
        wrapper = mountComponent({ recipe });
        const nutritionEditor = wrapper.findComponent({ name: 'NutritionEditorRows' });

        await nutritionEditor.vm.$emit('update:modelValue', {
          calories: 300,
          sodium: 500,
          sugar: 15,
          carbs: 35,
          fat: 10,
          protein: 20,
        });

        const updatedProps = nutritionEditor.props('modelValue');
        expect(updatedProps.calories).toBe(300);
        expect(updatedProps.sodium).toBe(500);
        expect(updatedProps.sugar).toBe(15);
        expect(updatedProps.carbs).toBe(35);
        expect(updatedProps.fat).toBe(10);
        expect(updatedProps.protein).toBe(20);
      });
    });

    describe('homemade', () => {
      beforeEach(() => {
        wrapper = mountComponent({ recipe: BEER_CHEESE });
      });

      it('initializes the inputs with recipe values', () => {
        const inputs = getInputs(wrapper);
        const nutritionInputs = getNutritionInputs(wrapper);
        expect(inputs.name.element.value).toBe(BEER_CHEESE.name);
        expect(inputs.description.element.value).toBe(BEER_CHEESE.description);
        expect(inputs.category.props('modelValue')).toBe(BEER_CHEESE.category);
        expect(inputs.cuisine.props('modelValue')).toBe(BEER_CHEESE.cuisine);
        expect(inputs.difficulty.props('modelValue')).toBe(BEER_CHEESE.difficulty);
        expect(inputs.servings.element.value).toBe(BEER_CHEESE.servings.toString());
        expect(inputs.prepTimeMinutes.element.value).toBe(BEER_CHEESE.prepTimeMinutes.toString());
        expect(inputs.cookTimeMinutes.element.value).toBe(BEER_CHEESE.cookTimeMinutes.toString());
        expect(nutritionInputs.calories.element.value).toBe(BEER_CHEESE.calories.toString());
        expect(nutritionInputs.sodium.element.value).toBe(BEER_CHEESE.sodium.toString());
        expect(nutritionInputs.sugar.element.value).toBe(BEER_CHEESE.sugar.toString());
        expect(nutritionInputs.carbs.element.value).toBe(BEER_CHEESE.carbs.toString());
        expect(nutritionInputs.fat.element.value).toBe(BEER_CHEESE.fat.toString());
        expect(nutritionInputs.protein.element.value).toBe(BEER_CHEESE.protein.toString());
      });

      describeEditableList(() => wrapper, {
        title: 'the ingredients list',
        noun: 'ingredient',
        testIdPrefix: 'ingredient',
        row: IngredientEditorRow,
        prop: 'ingredient',
        initialItems: BEER_CHEESE.ingredients,
        filledItem: FILLED_INGREDIENT,
      });

      describeEditableList(() => wrapper, {
        title: 'the steps list',
        noun: 'step',
        testIdPrefix: 'step',
        row: StepEditorRow,
        prop: 'step',
        initialItems: BEER_CHEESE.steps,
        filledItem: FILLED_STEP,
      });

      describe('the save button', () => {
        const HOMEMADE_FIELD_CHANGES = [
          { field: 'name', value: 'Apple Pie' },
          { field: 'description', value: 'Fudge covered pickles with apples in a pie crust' },
          { field: 'category', value: 'Dessert' },
          { field: 'cuisine', value: 'Italian' },
          { field: 'difficulty', value: 'Easy' },
          { field: 'servings', value: '8' },
          { field: 'prepTimeMinutes', value: '20' },
          { field: 'cookTimeMinutes', value: '45' },
          { field: 'calories', value: '500' },
          { field: 'sodium', value: '900' },
          { field: 'sugar', value: '10' },
          { field: 'carbs', value: '30' },
          { field: 'fat', value: '35' },
          { field: 'protein', value: '20' },
        ] as const;
        const getFieldSetters = () => asFieldSetters({ ...getInputs(wrapper), ...getNutritionInputs(wrapper) });

        it('begins disabled', () => {
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('begins disabled for a recipe with a null description', () => {
          wrapper.unmount();
          wrapper = mountComponent({ recipe: { ...BEER_CHEESE, description: null } });
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it.each(HOMEMADE_FIELD_CHANGES)('is enabled if the $field value is changed', async ({ field, value }) => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await getFieldSetters()[field].setValue(value);
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
          const button = wrapper.find('[data-testid="add-ingredient-button"]');
          await button.trigger('click');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled if an invalid step exists in the steps list', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          await inputs.name.setValue('Apple Pie');
          expect(saveButton.attributes('disabled')).toBeUndefined();
          const button = wrapper.find('[data-testid="add-step-button"]');
          await button.trigger('click');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('emits the entered data on click', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getInputs(wrapper);
          const nutritionInputs = getNutritionInputs(wrapper);
          await inputs.category.setValue('Dessert');
          await inputs.difficulty.setValue('Normal');
          await inputs.name.setValue('Apple Pie');
          await nutritionInputs.calories.setValue('325');
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
          expect(emittedData.prepTimeMinutes).toBe(BEER_CHEESE.prepTimeMinutes);
          expect(emittedData.cookTimeMinutes).toBe(BEER_CHEESE.cookTimeMinutes);
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

    describe('prepared', () => {
      const prepared: Recipe = { ...TEST_PREPARED_RECIPE, id: 'prepared-99' };
      const nextSourceId = 'iir00305003lfkdj';

      beforeEach(() => {
        const { sources } = useSourcesData();
        (sources as Ref<Source[]>).value = TEST_SOURCES;
        wrapper = mountComponent({ recipe: prepared });
      });

      it('initializes the inputs with recipe values', () => {
        const inputs = getPreparedInputs(wrapper);
        const nutritionInputs = getNutritionInputs(wrapper);
        expect(inputs.name.element.value).toBe(prepared.name);
        expect(inputs.description.element.value).toBe(prepared.description);
        expect(inputs.category.props('modelValue')).toBe(prepared.category);
        expect(inputs.cuisine.props('modelValue')).toBe(prepared.cuisine);
        expect(inputs.source.props('modelValue')).toBe(prepared.sourceId);
        expect(inputs.servings.element.value).toBe(prepared.servings.toString());
        expect(nutritionInputs.calories.element.value).toBe(prepared.calories.toString());
        expect(nutritionInputs.sodium.element.value).toBe(prepared.sodium.toString());
        expect(nutritionInputs.sugar.element.value).toBe(prepared.sugar.toString());
        expect(nutritionInputs.carbs.element.value).toBe(prepared.carbs.toString());
        expect(nutritionInputs.fat.element.value).toBe(prepared.fat.toString());
        expect(nutritionInputs.protein.element.value).toBe(prepared.protein.toString());
        expect(autocompleteLabeled(wrapper, 'Difficulty')).toBeUndefined();
        expect(wrapper.find('[data-testid="prep-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="cook-time-input"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ingredient-list-grid"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="step-list-grid"]').exists()).toBe(false);
      });

      describe('the save button', () => {
        const PREPARED_FIELD_CHANGES = [
          { field: 'name', value: 'Updated Black Cod' },
          { field: 'description', value: 'Reheated until hot.' },
          { field: 'category', value: 'Poultry' },
          { field: 'cuisine', value: 'Italian' },
          { field: 'source', value: nextSourceId },
          { field: 'servings', value: '2' },
          { field: 'calories', value: '600' },
          { field: 'sodium', value: '900' },
          { field: 'sugar', value: '10' },
          { field: 'carbs', value: '30' },
          { field: 'fat', value: '35' },
          { field: 'protein', value: '20' },
        ] as const;
        const getFieldSetters = () => asFieldSetters({ ...getPreparedInputs(wrapper), ...getNutritionInputs(wrapper) });

        it('begins disabled', () => {
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('begins disabled for a recipe with a null description', () => {
          wrapper.unmount();
          wrapper = mountComponent({ recipe: { ...prepared, description: null } });
          const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it.each(PREPARED_FIELD_CHANGES)('is enabled if the $field value is changed', async ({ field, value }) => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          await getFieldSetters()[field].setValue(value);
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });

        it('emits the entered data on click', async () => {
          wrapper.unmount();
          wrapper = mountComponent({
            recipe: {
              ...prepared,
              difficulty: 'Advanced',
              prepTimeMinutes: 15,
              cookTimeMinutes: 20,
              ingredients: [
                {
                  id: 'ingredient-1',
                  units: 1,
                  unitOfMeasure: findUnitOfMeasure('cup'),
                  name: 'Rice',
                },
              ],
              steps: [{ id: 'step-1', instruction: 'Heat and serve.' }],
            },
          });
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const inputs = getPreparedInputs(wrapper);
          const nutritionInputs = getNutritionInputs(wrapper);
          await inputs.category.setValue('Poultry');
          await inputs.source.setValue(nextSourceId);
          await inputs.name.setValue('  Updated Black Cod  ');
          await nutritionInputs.calories.setValue('600');
          await saveButton.trigger('click');
          expect(wrapper.emitted('save')).toBeTruthy();
          expect(wrapper.emitted('save')).toHaveLength(1);
          expect(wrapper.emitted('save')?.[0]).toEqual([
            {
              id: prepared.id,
              name: 'Updated Black Cod',
              description: prepared.description,
              kind: 'prepared',
              sourceId: nextSourceId,
              category: 'Poultry',
              cuisine: prepared.cuisine,
              difficulty: 'Easy',
              servings: prepared.servings,
              prepTimeMinutes: 0,
              cookTimeMinutes: 0,
              calories: 600,
              sodium: prepared.sodium,
              sugar: prepared.sugar,
              carbs: prepared.carbs,
              fat: prepared.fat,
              protein: prepared.protein,
              ingredients: [],
              steps: [],
            },
          ]);
        });
      });
    });
  });

  describe('cancel', () => {
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

  describe('calculate nutrition button', () => {
    const addValidIngredient = async (w: EditorWrapper) => {
      const addButton = w.find('[data-testid="add-ingredient-button"]');
      await addButton.trigger('click');
      const ingredientRows = w.find('[data-testid="ingredient-list-grid"]').findAllComponents(IngredientEditorRow);
      await ingredientRows[0]?.vm.$emit('changed', {
        id: 'test-ingredient-id',
        units: 1,
        unitOfMeasure: findUnitOfMeasure('cup'),
        name: 'Test Ingredient',
      });
    };

    const setupValidState = async (w: EditorWrapper, kind: RecipeKind = 'homemade') => {
      if (kind === 'homemade') {
        const inputs = getInputs(w);
        await inputs.name.setValue('Test Recipe');
        await inputs.servings.setValue('4');
        await addValidIngredient(w);
        return;
      }

      const { sources } = useSourcesData();
      (sources as Ref<Source[]>).value = TEST_SOURCES;
      const inputs = getPreparedInputs(w);
      await inputs.name.setValue('Test Recipe');
      await inputs.servings.setValue('4');
      await inputs.source.setValue(TEST_SOURCES[0]!.id);
    };

    it('renders', () => {
      wrapper = mountComponent();
      const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
      expect(button.exists()).toBe(true);
    });

    it('is disabled when name is missing', async () => {
      wrapper = mountComponent();
      const inputs = getInputs(wrapper);
      await inputs.servings.setValue('4');
      await addValidIngredient(wrapper);
      const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
      expect(button.attributes('disabled')).toBeDefined();
    });

    it('is disabled when servings is missing', async () => {
      wrapper = mountComponent();
      const inputs = getInputs(wrapper);
      await inputs.name.setValue('Test Recipe');
      await addValidIngredient(wrapper);
      const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
      expect(button.attributes('disabled')).toBeDefined();
    });

    describe('for a homemade recipe', () => {
      it('is disabled when there are no valid ingredients', async () => {
        wrapper = mountComponent();
        const inputs = getInputs(wrapper);
        await inputs.name.setValue('Test Recipe');
        await inputs.servings.setValue('4');
        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        expect(button.attributes('disabled')).toBeDefined();
      });

      it('is disabled when an ingredient row exists but is invalid', async () => {
        wrapper = mountComponent();
        const inputs = getInputs(wrapper);
        await inputs.name.setValue('Test Recipe');
        await inputs.servings.setValue('4');

        const addIngredientButton = wrapper.find('[data-testid="add-ingredient-button"]');
        await addIngredientButton.trigger('click');
        await flushPromises();

        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        expect(button.attributes('disabled')).toBeDefined();
      });

      it('is enabled when name, valid ingredients, and servings are all present', async () => {
        wrapper = mountComponent();
        await setupValidState(wrapper);
        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });
    });

    describe('for a prepared recipe', () => {
      it('is disabled when source is missing', async () => {
        wrapper = mountComponent({ kind: 'prepared' });
        const inputs = getPreparedInputs(wrapper);
        await inputs.name.setValue('Test Recipe');
        await inputs.servings.setValue('4');
        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        expect(button.attributes('disabled')).toBeDefined();
      });

      it('is enabled when name, source, and servings are all present', async () => {
        wrapper = mountComponent({ kind: 'prepared' });
        await setupValidState(wrapper, 'prepared');
        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        expect(button.attributes('disabled')).toBeUndefined();
      });
    });

    describe('on click', () => {
      it('shows a loading state while the calculation is in progress', async () => {
        const { generateNutritionData } = useNutritionGenerator();
        let resolveCalculation!: (value: unknown) => void;
        (generateNutritionData as Mock).mockReturnValue(new Promise((resolve) => (resolveCalculation = resolve)));
        wrapper = mountComponent();
        await setupValidState(wrapper);
        const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
        await button.trigger('click');
        const vBtn = button.findComponent(components.VBtn);
        expect(vBtn.props('loading')).toBe(true);
        resolveCalculation({ calories: 300, sodium: 400, sugar: 5, carbs: 20, fat: 10, protein: 15 });
        await flushPromises();
        expect(vBtn.props('loading')).toBe(false);
      });

      describe('on success', () => {
        const nutritionResult = { calories: 350, sodium: 500, sugar: 8, carbs: 25, fat: 12, protein: 18 };

        beforeEach(() => {
          const { generateNutritionData } = useNutritionGenerator();
          (generateNutritionData as Mock).mockResolvedValue(nutritionResult);
        });

        it('populates nutritional values with the returned data', async () => {
          wrapper = mountComponent();
          await setupValidState(wrapper);
          const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
          await button.trigger('click');
          await flushPromises();
          const nutritionInputs = getNutritionInputs(wrapper);
          expect(nutritionInputs.calories.element.value).toBe(nutritionResult.calories.toString());
          expect(nutritionInputs.sodium.element.value).toBe(nutritionResult.sodium.toString());
          expect(nutritionInputs.sugar.element.value).toBe(nutritionResult.sugar.toString());
          expect(nutritionInputs.carbs.element.value).toBe(nutritionResult.carbs.toString());
          expect(nutritionInputs.fat.element.value).toBe(nutritionResult.fat.toString());
          expect(nutritionInputs.protein.element.value).toBe(nutritionResult.protein.toString());
        });

        it('shows a success toast', async () => {
          wrapper = mountComponent();
          await setupValidState(wrapper);
          const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
          await button.trigger('click');
          await flushPromises();
          const successSnackbar = wrapper
            .findAllComponents(components.VSnackbar)
            .find((s) => s.props('color') === 'success');
          expect(successSnackbar).toBeDefined();
          expect(successSnackbar!.props('modelValue')).toBe(true);
        });
      });

      describe('on error', () => {
        beforeEach(() => {
          const { generateNutritionData } = useNutritionGenerator();
          (generateNutritionData as Mock).mockRejectedValue(new Error('AI service unavailable'));
        });

        it('shows an error toast', async () => {
          wrapper = mountComponent();
          await setupValidState(wrapper);
          const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
          await button.trigger('click');
          await flushPromises();
          const errorSnackbar = wrapper
            .findAllComponents(components.VSnackbar)
            .find((s) => s.props('color') === 'error');
          expect(errorSnackbar).toBeDefined();
          expect(errorSnackbar!.props('modelValue')).toBe(true);
        });

        it('does not modify nutritional values', async () => {
          wrapper = mountComponent({ recipe: BEER_CHEESE });
          const button = wrapper.findComponent('[data-testid="calculate-nutrition-button"]');
          await button.trigger('click');
          await flushPromises();
          const nutritionInputs = getNutritionInputs(wrapper);
          expect(nutritionInputs.calories.element.value).toBe(BEER_CHEESE.calories.toString());
          expect(nutritionInputs.sodium.element.value).toBe(BEER_CHEESE.sodium.toString());
          expect(nutritionInputs.sugar.element.value).toBe(BEER_CHEESE.sugar.toString());
          expect(nutritionInputs.carbs.element.value).toBe(BEER_CHEESE.carbs.toString());
          expect(nutritionInputs.fat.element.value).toBe(BEER_CHEESE.fat.toString());
          expect(nutritionInputs.protein.element.value).toBe(BEER_CHEESE.protein.toString());
        });
      });
    });
  });
});
