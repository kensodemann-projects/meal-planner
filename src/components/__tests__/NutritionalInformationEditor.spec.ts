import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalInformationEditor from '../NutritionalInformationEditor.vue';
import type { Portion } from '@/models';
import { TEST_PORTION } from '@/data/__tests__/test-data';
import { findUnitOfMeasure } from '@/data/unit-of-measure';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { portion?: Portion } = {}) =>
  mount(NutritionalInformationEditor, { props, global: { plugins: [vuetify] } });

const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
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

describe('Nutritional Information Editor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  describe('for add', () => {
    beforeEach(() => {
      wrapper = mountComponent();
    });

    it('defaults the nutrients to zero', () => {
      const inputs = getInputs(wrapper);
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

    describe('the cancel button', () => {
      it('renders', () => {
        const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
        expect(cancelButton.exists()).toBe(true);
      });

      it('emits the "cancel" event on click', async () => {
        const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
        await cancelButton.trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
        expect(wrapper.emitted('cancel')).toHaveLength(1);
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
        await inputs.unitsInput.setValue(1);
        (wrapper.vm as any).editPortion.unitOfMeasure = findUnitOfMeasure('each');
        await inputs.gramsInput.setValue(56);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.caloriesInput.setValue(75);
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits "save" with the data', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.unitsInput.setValue(1);
        (wrapper.vm as any).editPortion.unitOfMeasure = findUnitOfMeasure('each');
        await inputs.gramsInput.setValue(56);
        await inputs.caloriesInput.setValue(75);
        await inputs.carbsInput.setValue(14);
        await inputs.sugarInput.setValue(8);
        await inputs.fatInput.setValue(17);
        await inputs.proteinInput.setValue(4);
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            grams: 56,
            unitOfMeasure: { id: 'each', name: 'Each', type: 'quantity', system: 'none' },
            units: 1,
            calories: 75,
            carbs: 14,
            sugar: 8,
            sodium: 0,
            fat: 17,
            protein: 4,
          },
        ]);
      });
    });
  });

  describe('for update', () => {
    beforeEach(() => {
      wrapper = mountComponent({ portion: TEST_PORTION });
    });

    it('initializes the data to the portion values', () => {
      const inputs = getInputs(wrapper);
      expect(inputs.unitsInput.element.value).toBe(TEST_PORTION.units.toString());
      expect(inputs.gramsInput.element.value).toBe(TEST_PORTION.grams.toString());
      expect(inputs.caloriesInput.element.value).toBe(TEST_PORTION.calories.toString());
      expect(inputs.sodiumInput.element.value).toBe(TEST_PORTION.sodium.toString());
      expect(inputs.sugarInput.element.value).toBe(TEST_PORTION.sugar.toString());
      expect(inputs.carbsInput.element.value).toBe(TEST_PORTION.carbs.toString());
      expect(inputs.fatInput.element.value).toBe(TEST_PORTION.fat.toString());
      expect(inputs.proteinInput.element.value).toBe(TEST_PORTION.protein.toString());
    });

    describe('the cancel button', () => {
      it('renders', () => {
        const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
        expect(cancelButton.exists()).toBe(true);
      });

      it('emits the "cancel" event on click', async () => {
        const cancelButton = wrapper.findComponent('[data-testid="cancel-button"]') as VueWrapper<components.VBtn>;
        await cancelButton.trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
        expect(wrapper.emitted('cancel')).toHaveLength(1);
      });
    });

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('is enabled when a value is validly changed', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.unitsInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.unitsInput.setValue(TEST_PORTION.units);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.gramsInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.gramsInput.setValue(TEST_PORTION.grams);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.caloriesInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.caloriesInput.setValue(TEST_PORTION.calories);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.sugarInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.sugarInput.setValue(TEST_PORTION.sugar);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.carbsInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.carbsInput.setValue(TEST_PORTION.carbs);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.fatInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.fatInput.setValue(TEST_PORTION.fat);
        expect(saveButton.attributes('disabled')).toBeDefined();
        await inputs.proteinInput.setValue(1);
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await inputs.proteinInput.setValue(TEST_PORTION.protein);
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits "save" with the data', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        const inputs = getInputs(wrapper);
        await inputs.unitsInput.setValue(1);
        await inputs.sodiumInput.setValue(819);
        await saveButton.trigger('click');
        expect(wrapper.emitted('save')).toBeTruthy();
        expect(wrapper.emitted('save')).toHaveLength(1);
        expect(wrapper.emitted('save')?.[0]).toEqual([
          {
            ...TEST_PORTION,
            units: 1,
            sodium: 819,
          },
        ]);
      });
    });
  });
});
