import { TEST_FOOD } from '@/data/__tests__/test-data';
import type { Portion } from '@/models';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalInformationEditGrid from '../NutritionalInformationEditGrid.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (modelValue: Partial<Portion>) =>
  mount(NutritionalInformationEditGrid, { props: { modelValue }, global: { plugins: [vuetify] } });

describe('Nutritional Information Edit Grid', () => {
  it('renders', () => {
    const wrapper = mountComponent({});
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      const wrapper = mountComponent({});
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.exists()).toBe(true);
      expect(unitsInput.props('label')).toBe('Units');
    });

    it('is required', async () => {
      const wrapper = mountComponent({});
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

    it('is initialized properly', () => {
      const wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.find('input').element.value).toBe('42');
    });

    it('is emitted on change', async () => {
      const wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      const input = unitsInput.find('input');
      await input.trigger('focus');
      await input.setValue(73);
      await input.trigger('blur');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      const wrapper = mountComponent({});
      const uomInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(uomInput.exists()).toBe(true);
      expect(uomInput.props('label')).toBe('Unit of Measure');
    });

    it('is required', async () => {
      const wrapper = mountComponent({});
      const uomInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      const input = uomInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');
    });

    it('is initialized properly', () => {
      const wrapper = mountComponent(TEST_FOOD);
      expect((wrapper.vm as any).unitOfMeasureId).toBe(TEST_FOOD.unitOfMeasure.id);
    });
  });

  describe('grams', () => {
    it('renders', () => {
      const wrapper = mountComponent({});
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.exists()).toBe(true);
      expect(gramsInput.props('label')).toBe('Grams');
    });

    it('is required', async () => {
      const wrapper = mountComponent({});
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      const input = gramsInput.find('input');

      expect(wrapper.text()).not.toContain('Required');
      await input.trigger('focus');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.text()).toContain('Required');

      await input.setValue(2);
      await input.trigger('blur');
      expect(wrapper.text()).not.toContain('Required');
    });

    it('is initialized properly', () => {
      const wrapper = mountComponent({ ...TEST_FOOD, grams: 420 });
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.find('input').element.value).toBe('420');
    });

    it('is emitted on change', async () => {
      const wrapper = mountComponent({ ...TEST_FOOD });
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      const input = gramsInput.find('input');
      await input.trigger('focus');
      await input.setValue(124);
      await input.trigger('blur');
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).grams).toBe(124);
    });
  });
});
