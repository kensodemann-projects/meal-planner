import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalInformationEditor from '../NutritionalInformationEditor.vue';
import type { Portion } from '@/models';
import { TEST_PORTION } from '@/data/__tests__/test-data';

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
  it('renders', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  describe('for add', () => {
    let wrapper: ReturnType<typeof mountComponent>;
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

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });
    });
  });

  describe('for update', () => {
    let wrapper: ReturnType<typeof mountComponent>;
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

    describe('the save button', () => {
      it('begins disabled', () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        expect(saveButton.attributes('disabled')).toBeDefined();
      });
    });
  });
});
