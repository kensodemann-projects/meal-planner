import { findUnitOfMeasure } from '@/data/unit-of-measure';
import type { FoodItem } from '@/models';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import FoodEditor from '../FoodEditor.vue';
import NutritionalInformation from '../NutritionalInformation.vue';
import DangerButton from '../buttons/DangerButton.vue';
import ModifyButton from '../buttons/ModifyButton.vue';
import NutritionalInformationEditor from '../NutritionalInformationEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const createWrapper = (props = {}) => {
  return mount(FoodEditor, {
    props,
    global: {
      plugins: [vuetify],
    },
  });
};

const getInputs = (wrapper: ReturnType<typeof createWrapper>) => ({
  nameInput: wrapper.findComponent('[data-testid="name-input"]').find('input'),
  brandInput: wrapper.findComponent('[data-testid="brand-input"]').find('input'),
  categoryInput: wrapper.findComponent('[data-testid="food-category-input"]').find('input'),
  unitsInput: wrapper.findComponent('[data-testid="units-input"]').find('input'),
  unitOfMeasureInput: wrapper.findComponent('[data-testid="unit-of-measure-input"]').find('input'),
  gramsInput: wrapper.findComponent('[data-testid="grams-input"]').find('input'),
  caloriesInput: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
  sodiumInput: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
  sugarInput: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
  carbsInput: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
  fatInput: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
  proteinInput: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
});

describe('FoodEditor', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders ', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it('includes the proper sub-sections', () => {
    wrapper = createWrapper();
    const subheaders = wrapper.findAll('h2');
    expect(subheaders.length).toBe(3);
    expect(subheaders[0]!.text()).toBe('Basic Information');
    expect(subheaders[1]!.text()).toBe('Nutritional Information');
    expect(subheaders[2]!.text()).toBe('Alternative Portions');
  });

  describe('name', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const nameInput = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      expect(nameInput.exists()).toBe(true);
      expect(nameInput.props('label')).toBe('Name');
      expect(nameInput.props('placeholder')).toBe('Enter the name of the food...');
    });

    it('is required', async () => {
      wrapper = createWrapper();
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

  describe('brand', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const brandInput = wrapper.findComponent('[data-testid="brand-input"]') as VueWrapper<components.VTextField>;
      expect(brandInput.exists()).toBe(true);
      expect(brandInput.props('label')).toBe('Brand');
      expect(brandInput.props('placeholder')).toBe('Enter the brand (optional)...');
    });

    it('is not required', async () => {
      wrapper = createWrapper();
      const brandInput = wrapper.findComponent('[data-testid="brand-input"]') as VueWrapper<components.VTextField>;
      const input = brandInput.find('input');

      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('food category', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const categoryInput = wrapper.findComponent(
        '[data-testid="food-category-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(categoryInput.exists()).toBe(true);
      expect(categoryInput.props('label')).toBe('Food Category');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const categoryInput = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      const input = categoryInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue('Produce');
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.exists()).toBe(true);
      expect(unitsInput.props('label')).toBe('Units');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      const input = unitsInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(2);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const unitOfMeasureInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(unitOfMeasureInput.exists()).toBe(true);
      expect(unitOfMeasureInput.props('label')).toBe('Unit of Measure');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const unitOfMeasureInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      const input = unitOfMeasureInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');
    });
  });

  describe('equivalent grams', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.exists()).toBe(true);
      expect(gramsInput.props('label')).toBe('Grams');
      expect(gramsInput.props('placeholder')).toBe('Equivalent grams...');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      const input = gramsInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('calories', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="calories-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Calories');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="calories-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = caloriesInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('sodium', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      const input = sodiumInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('sugar', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.exists()).toBe(true);
      expect(sugarInput.props('label')).toBe('Sugar (g)');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      const input = sugarInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('carbs', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Total Carbs (g)');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      const input = carbsInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('fat', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Fat (g)');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      const input = fatInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('protein', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Protein (g)');
    });

    it('is required', async () => {
      wrapper = createWrapper();
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = proteinInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(50);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });
  });

  describe('cancel button', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      expect(cancelButton.exists()).toBe(true);
    });

    it('emits the "cancel" event on click', async () => {
      wrapper = createWrapper();
      const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
      await cancelButton.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });
  });

  describe('save button', () => {
    it('renders', () => {
      wrapper = createWrapper();
      const saveButton = wrapper.findComponent('[data-testid="save-button"]') as VueWrapper<components.VBtn>;
      expect(saveButton.exists()).toBe(true);
    });
  });

  describe('for create', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('defaults the  non-calorie nutritional information to zero', async () => {
      const inputs = getInputs(wrapper);
      expect(inputs.nameInput.element.value).toBe('');
      expect(inputs.brandInput.element.value).toBe('');
      expect(inputs.categoryInput.element.value).toBe('');
      expect(inputs.unitsInput.element.value).toBe('');
      expect(inputs.unitOfMeasureInput.element.value).toBe('');
      expect(inputs.gramsInput.element.value).toBe('');
      expect(inputs.caloriesInput.element.value).toBe('');
      expect(inputs.sodiumInput.element.value).toBe('0');
      expect(inputs.sugarInput.element.value).toBe('0');
      expect(inputs.carbsInput.element.value).toBe('0');
      expect(inputs.fatInput.element.value).toBe('0');
      expect(inputs.proteinInput.element.value).toBe('0');
    });

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled until all required fields are filled in', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.nameInput.setValue('Apple');
        await inputs.categoryInput.setValue('Produce');
        (wrapper.vm as any).category = 'Produce';
        await inputs.unitsInput.setValue(1);
        (wrapper.vm as any).portion.unitOfMeasure = findUnitOfMeasure('each');
        await inputs.gramsInput.setValue(56);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.caloriesInput.setValue(75);
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits the entered data on click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.nameInput.setValue('Apple');
        await inputs.categoryInput.setValue('Produce');
        (wrapper.vm as any).category = 'Produce';
        await inputs.unitsInput.setValue(1);
        (wrapper.vm as any).portion.unitOfMeasure = findUnitOfMeasure('each');
        await inputs.gramsInput.setValue(56);
        await inputs.caloriesInput.setValue(75);
        await inputs.sugarInput.setValue(4);
        await inputs.carbsInput.setValue(15);
        await inputs.proteinInput.setValue(7.45);
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            name: 'Apple',
            brand: null,
            fdcId: null,
            category: 'Produce',
            grams: 56,
            unitOfMeasure: { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
            units: 1,
            calories: 75,
            carbs: 15,
            sugar: 4,
            sodium: 0,
            fat: 0,
            protein: 7.45,
            alternativePortions: [],
          },
        ]);
      });
    });

    describe('alternative portions', () => {
      it('are blank', () => {
        const portions = wrapper.findAllComponents(NutritionalInformation);
        expect(portions.length).toBe(0);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        it('displays the portion editor for add', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(wrapper.findComponent(NutritionalInformationEditor).exists()).toBe(false);
          await button.trigger('click');
          expect(wrapper.findComponent(NutritionalInformationEditor).exists()).toBe(true);
        });
      });
    });
  });

  describe('for update', () => {
    beforeEach(() => {
      wrapper = createWrapper({ food: BANANA });
    });

    it('initializes the inputs', () => {
      const inputs = getInputs(wrapper);
      expect(inputs.nameInput.element.value).toBe('banana');
      expect(inputs.brandInput.element.value).toBe('dole');
      expect((wrapper.vm as any).category).toBe('Produce');
      expect(inputs.unitsInput.element.value).toBe('100');
      expect((wrapper.vm as any).portion.unitOfMeasure).toEqual(findUnitOfMeasure('g'));
      expect(inputs.gramsInput.element.value).toBe('100');
      expect(inputs.caloriesInput.element.value).toBe('98');
      expect(inputs.sodiumInput.element.value).toBe('4');
      expect(inputs.sugarInput.element.value).toBe('15.8');
      expect(inputs.carbsInput.element.value).toBe('23');
      expect(inputs.fatInput.element.value).toBe('1');
      expect(inputs.proteinInput.element.value).toBe('0.75');
    });

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is disabled until data is changed', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.nameInput.setValue('Apple');
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('is disabled if a required field is cleared', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.nameInput.setValue('Apple');
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.nameInput.setValue('');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits the food item with changed data on click', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.brandInput.setValue('Chiquita');
        await inputs.sugarInput.setValue(14);
        await inputs.caloriesInput.setValue(90);
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            ...BANANA,
            brand: 'Chiquita',
            sugar: 14,
            calories: 90,
          },
        ]);
      });
    });

    describe('alternative portions', () => {
      it('are each displayed in a card', () => {
        const portions = wrapper.findAllComponents(components.VCard);
        expect(portions.length).toBe(2);
        portions.forEach((p) => {
          expect(p.findComponent(NutritionalInformation).exists()).toBe(true);
          expect(p.findComponent(ModifyButton).exists()).toBe(true);
          expect(p.findComponent(DangerButton).exists()).toBe(true);
        });
      });

      it('displays the proper data in each card', () => {
        const portions = wrapper.findAllComponents(components.VCard);
        expect(portions[0]!.text()).toContain('Serving Size: 1 Each (115g)');
        expect(portions[0]!.text()).toContain('Calories: 113');
        expect(portions[1]!.text()).toContain('Serving Size: 4 Ounce (112g)');
        expect(portions[1]!.text()).toContain('Calories: 110');
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        it('displays the portion editor for add', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(wrapper.findComponent(NutritionalInformationEditor).exists()).toBe(false);
          await button.trigger('click');
          expect(wrapper.findComponent(NutritionalInformationEditor).exists()).toBe(true);
        });
      });
    });
  });
});

const BANANA: FoodItem = {
  id: 'aaidffe99fe0999rr8f8f8f8f8f8f8f8',
  name: 'banana',
  brand: 'dole',
  fdcId: 1105314,
  category: 'Produce',
  grams: 100,
  unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
  units: 100,
  calories: 98,
  carbs: 23,
  sugar: 15.8,
  sodium: 4,
  fat: 1,
  protein: 0.75,
  alternativePortions: [
    {
      grams: 115,
      unitOfMeasure: { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
      units: 1,
      calories: 113,
      carbs: 24.4,
      sugar: 18.2,
      sodium: 4,
      fat: 1.2,
      protein: 0.851,
    },
    {
      grams: 112,
      unitOfMeasure: { id: 'oz', name: 'Ounce', type: 'weight', system: 'customary' },
      units: 4,
      calories: 110,
      carbs: 24.3,
      sugar: 18.1,
      sodium: 3,
      fat: 1.1,
      protein: 0.845,
    },
  ],
};
