import {
  autocompleteIsRequired,
  numberInputIsRequired,
  textFieldIsNotRequired,
  textFieldIsRequired,
} from '@/components/__tests__/test-utils';
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { TEST_PORTION } from '@/data/__tests__/test-data';
import type { FoodItem } from '@/models/food';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ConfirmDialog from '../../core/ConfirmDialog.vue';
import PortionDataCard from '../../portions/PortionDataCard.vue';
import PortionEditorCard from '../../portions/PortionEditorCard.vue';
import FoodEditor from '../FoodEditor.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (props = {}) => {
  return mount(FoodEditor, {
    props,
    global: {
      plugins: [vuetify],
    },
  });
};

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
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
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    // Polyfill visualViewport for Vuetify overlays/snackbars in jsdom
    if (!window.visualViewport) {
      // @ts-expect-error Polyfill for Vuetify overlay in jsdom
      window.visualViewport = {
        addEventListener: () => {},
        removeEventListener: () => {},
        width: window.innerWidth,
        height: window.innerHeight,
        scale: 1,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
      };
    }
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders ', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('includes the proper sub-sections', () => {
    wrapper = mountComponent();
    const subheaders = wrapper.findAll('h2');
    expect(subheaders.length).toBe(3);
    expect(subheaders[0]!.text()).toBe('Basic Information');
    expect(subheaders[1]!.text()).toBe('Nutritional Information');
    expect(subheaders[2]!.text()).toBe('Alternative Portions');
  });

  describe('name', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const nameInput = wrapper.findComponent('[data-testid="name-input"]') as VueWrapper<components.VTextField>;
      expect(nameInput.exists()).toBe(true);
      expect(nameInput.props('label')).toBe('Name');
      expect(nameInput.props('placeholder')).toBe('Enter the name of the food...');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await textFieldIsRequired(wrapper, 'name-input');
    });
  });

  describe('brand', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const brandInput = wrapper.findComponent('[data-testid="brand-input"]') as VueWrapper<components.VTextField>;
      expect(brandInput.exists()).toBe(true);
      expect(brandInput.props('label')).toBe('Brand');
      expect(brandInput.props('placeholder')).toBe('Enter the brand (optional)...');
    });

    it('is not required', async () => {
      wrapper = mountComponent();
      await textFieldIsNotRequired(wrapper, 'brand-input');
    });
  });

  describe('food category', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const categoryInput = wrapper.findComponent(
        '[data-testid="food-category-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(categoryInput.exists()).toBe(true);
      expect(categoryInput.props('label')).toBe('Food Category');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'food-category-input');
    });
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.exists()).toBe(true);
      expect(unitsInput.props('label')).toBe('Units');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'units-input');
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const unitOfMeasureInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(unitOfMeasureInput.exists()).toBe(true);
      expect(unitOfMeasureInput.props('label')).toBe('Unit of Measure');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await autocompleteIsRequired(wrapper, 'unit-of-measure-input');
    });
  });

  describe('equivalent grams', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.exists()).toBe(true);
      expect(gramsInput.props('label')).toBe('Grams');
      expect(gramsInput.props('placeholder')).toBe('Equivalent grams...');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'grams-input');
    });
  });

  describe('calories', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const caloriesInput = wrapper.findComponent(
        '[data-testid="calories-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(caloriesInput.exists()).toBe(true);
      expect(caloriesInput.props('label')).toBe('Calories');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'calories-input');
    });
  });

  describe('sodium', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'sodium-input');
    });
  });

  describe('sugar', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.exists()).toBe(true);
      expect(sugarInput.props('label')).toBe('Sugar (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'sugar-input');
    });
  });

  describe('carbs', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Total Carbs (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'carbs-input');
    });
  });

  describe('fat', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Fat (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent();
      await numberInputIsRequired(wrapper, 'fat-input');
    });
  });

  describe('protein', () => {
    it('renders', () => {
      wrapper = mountComponent();
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Protein (g)');
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

    it('defaults the non-calorie nutritional information to zero', async () => {
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

    describe('cancel button', () => {
      describe('without changes', () => {
        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });

      describe('with changes', () => {
        it('does not display the confirm dialog', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const button = wrapper.findComponent('[data-testid="cancel-button"]');
          await button.trigger('click');
          await flushPromises();
          const confirmDialog = wrapper.findComponent(ConfirmDialog);
          expect(confirmDialog.exists()).toBe(false);
        });

        it('emits the "cancel" event', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });
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
        const portions = wrapper.findAllComponents(PortionDataCard);
        expect(portions.length).toBe(0);
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        it('displays the portion editor for add', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
          await button.trigger('click');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(true);
        });

        it('disables the save button', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          const saveButton = wrapper.findComponent('[data-testid="save-button"]');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
          await button.trigger('click');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('disables the cancel button', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
          await button.trigger('click');
          expect(cancelButton.attributes('disabled')).toBeDefined();
        });

        it('is disabled once the editor is opened', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          await button.trigger('click');
          expect(button.attributes('disabled')).toBeDefined();
        });

        describe('cancel', () => {
          it('hides the portion editor', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('cancel');
            await flushPromises();
            expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
            expect(button.attributes('disabled')).toBeUndefined();
          });

          it('does not add a portion', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('cancel');
            await flushPromises();
            const portions = wrapper.findAllComponents(components.VCard);
            expect(portions.length).toBe(0);
          });
        });

        describe('save', () => {
          it('hides the portion editor', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('save', TEST_PORTION);
            await flushPromises();
            expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
            expect(button.attributes('disabled')).toBeUndefined();
          });

          it('adds the saved portion to the front of the list', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('save', TEST_PORTION);
            await flushPromises();
            const portions = wrapper.findAllComponents(PortionDataCard);
            expect(portions.length).toBe(1);
            expect(portions[0]!.text()).toContain('Serving Size: 2 Each (240g)');
            expect(portions[0]!.text()).toContain('Calories: 940');
          });
        });
      });
    });
  });

  describe('for update', () => {
    beforeEach(() => {
      wrapper = mountComponent({ food: BANANA });
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

    describe('cancel button', () => {
      describe('without changes', () => {
        it('emits the "cancel" event on click', async () => {
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });
      });

      describe('with changes', () => {
        it('displays confirm dialog', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const button = wrapper.findComponent('[data-testid="cancel-button"]');
          await button.trigger('click');
          await flushPromises();
          const confirmDialog = wrapper.findComponent(ConfirmDialog);
          expect(confirmDialog.exists()).toBe(true);
        });

        it('does not cancel', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');
          expect(wrapper.emitted('cancel')).toBeFalsy();
        });

        it('cancels on confirm', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');

          const confirmDialog = wrapper.findComponent(ConfirmDialog);
          expect(confirmDialog.exists()).toBe(true);

          await confirmDialog.vm.$emit('confirm');
          await flushPromises();

          expect(wrapper.emitted('cancel')).toBeTruthy();
          expect(wrapper.emitted('cancel')).toHaveLength(1);
        });

        it('does not cancel on confirmation being cancelled', async () => {
          const inputs = getInputs(wrapper);
          await inputs.nameInput.setValue('Apple');
          const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
          await cancelButton.trigger('click');

          const confirmDialog = wrapper.findComponent(ConfirmDialog);
          expect(confirmDialog.exists()).toBe(true);

          await confirmDialog.vm.$emit('cancel');
          await flushPromises();

          expect(wrapper.emitted('cancel')).toBeFalsy();
        });
      });
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
        const portions = wrapper.findAllComponents(PortionDataCard);
        expect(portions.length).toBe(2);
      });

      it('displays the proper data in each card', () => {
        const portions = wrapper.findAllComponents(PortionDataCard);
        expect(portions[0]!.text()).toContain('Serving Size: 1 Each (115g)');
        expect(portions[0]!.text()).toContain('Calories: 113');
        expect(portions[1]!.text()).toContain('Serving Size: 4 Ounce (112g)');
        expect(portions[1]!.text()).toContain('Calories: 110');
      });

      describe('modify portion', () => {
        it('switches from the card to the editor', async () => {
          let portions = wrapper.findAllComponents(PortionDataCard);
          let editors = wrapper.findAllComponents(PortionEditorCard);
          expect(editors.length).toBe(0);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          portions = wrapper.findAllComponents(PortionDataCard);
          expect(portions.length).toBe(1);
          editors = wrapper.findAllComponents(PortionEditorCard);
          expect(editors.length).toBe(1);
        });

        it('disables the save button', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          const portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('disables the cancel button', async () => {
          const cancelButton = wrapper.getComponent('[data-testid="cancel-button"]');
          const portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          expect(cancelButton.attributes('disabled')).toBeDefined();
        });

        it('switches back to the card on cancel', async () => {
          let portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          let editors = wrapper.findAllComponents(PortionEditorCard);
          editors[0]?.vm.$emit('cancel');
          await flushPromises();
          portions = wrapper.findAllComponents(PortionDataCard);
          expect(portions.length).toBe(2);
          editors = wrapper.findAllComponents(PortionEditorCard);
          expect(editors.length).toBe(0);
        });

        it('does not enable the save on cancel', async () => {
          const portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          const editors = wrapper.findAllComponents(PortionEditorCard);
          editors[0]?.vm.$emit('cancel');
          await flushPromises();
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
        });

        it('enables the save if the modification is saved', async () => {
          const portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('modify');
          await flushPromises();
          const editors = wrapper.findAllComponents(PortionEditorCard);
          editors[0]?.vm.$emit('save', TEST_PORTION);
          await flushPromises();
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });
      });

      describe('add button', () => {
        it('is enabled', () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(button.attributes('disabled')).toBeUndefined();
        });

        it('displays the portion editor for add', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
          await button.trigger('click');
          expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(true);
        });

        it('is disabled once the editor is opened', async () => {
          const button = wrapper.findComponent('[data-testid="add-portion-button"]');
          await button.trigger('click');
          expect(button.attributes('disabled')).toBeDefined();
        });

        describe('cancel', () => {
          it('hides the portion editor', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('cancel');
            await flushPromises();
            expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
            expect(button.attributes('disabled')).toBeUndefined();
          });

          it('does not add a portion', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('cancel');
            await flushPromises();
            const portions = wrapper.findAllComponents(components.VCard);
            expect(portions.length).toBe(2);
          });
        });

        describe('save', () => {
          it('hides the portion editor', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('save', TEST_PORTION);
            await flushPromises();
            expect(wrapper.findComponent(PortionEditorCard).exists()).toBe(false);
            expect(button.attributes('disabled')).toBeUndefined();
          });

          it('adds the saved portion to the front of the list', async () => {
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            editor.vm.$emit('save', TEST_PORTION);
            await flushPromises();
            const portions = wrapper.findAllComponents(PortionDataCard);
            expect(portions.length).toBe(3);
            expect(portions[0]!.text()).toContain('Serving Size: 2 Each (240g)');
            expect(portions[0]!.text()).toContain('Calories: 940');
          });

          it('enables the food item save button', async () => {
            const saveButton = wrapper.getComponent('[data-testid="save-button"]');
            const button = wrapper.findComponent('[data-testid="add-portion-button"]');
            await button.trigger('click');
            const editor = wrapper.findComponent(PortionEditorCard);
            expect(saveButton.attributes('disabled')).toBeDefined();
            editor.vm.$emit('save', TEST_PORTION);
            await flushPromises();
            expect(saveButton.attributes('disabled')).toBeUndefined();
          });
        });
      });

      describe('delete event', () => {
        it('removes the portion from the list', async () => {
          let portions = wrapper.findAllComponents(PortionDataCard);
          expect(portions.length).toBe(2);
          portions[0]?.vm.$emit('delete');
          await flushPromises();
          portions = wrapper.findAllComponents(PortionDataCard);
          expect(portions.length).toBe(1);
        });

        it('enables the save button when a portion is deleted', async () => {
          const saveButton = wrapper.getComponent('[data-testid="save-button"]');
          expect(saveButton.attributes('disabled')).toBeDefined();
          const portions = wrapper.findAllComponents(PortionDataCard);
          portions[0]?.vm.$emit('delete');
          await flushPromises();
          expect(saveButton.attributes('disabled')).toBeUndefined();
        });

        it('removes the correct portion when deleting from multiple', async () => {
          const portions = wrapper.findAllComponents(PortionDataCard);
          expect(portions[0]!.text()).toContain('Serving Size: 1 Each (115g)');
          expect(portions[1]!.text()).toContain('Serving Size: 4 Ounce (112g)');
          portions[0]?.vm.$emit('delete');
          await flushPromises();
          const updatedPortions = wrapper.findAllComponents(PortionDataCard);
          expect(updatedPortions.length).toBe(1);
          expect(updatedPortions[0]!.text()).toContain('Serving Size: 4 Ounce (112g)');
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
      unitOfMeasure: { id: 'each', name: 'Each', type: 'quantity', system: 'none', fdcId: 9999 },
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
      unitOfMeasure: { id: 'oz', name: 'Ounce', type: 'weight', system: 'customary', fdcId: 1038 },
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
