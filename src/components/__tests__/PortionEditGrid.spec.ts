import { TEST_FOOD } from '@/data/__tests__/test-data';
import type { Portion } from '@meal-planner/common';
import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PortionEditGrid from '../PortionEditGrid.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const mountComponent = (modelValue: Partial<Portion>) =>
  mount(PortionEditGrid, { props: { modelValue }, global: { plugins: [vuetify] } });

describe('Portion Edit Grid', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent({});
    expect(wrapper.exists()).toBe(true);
  });

  describe('units', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.exists()).toBe(true);
      expect(unitsInput.props('label')).toBe('Units');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
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
      wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      expect(unitsInput.find('input').element.value).toBe('42');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, units: 42 });
      const unitsInput = wrapper.findComponent('[data-testid="units-input"]') as VueWrapper<components.VNumberInput>;
      const input = unitsInput.find('input');
      await input.trigger('focus');
      await input.setValue(73);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).units).toBe(73);
    });
  });

  describe('unit of measure', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const uomInput = wrapper.findComponent(
        '[data-testid="unit-of-measure-input"]',
      ) as VueWrapper<components.VAutocomplete>;
      expect(uomInput.exists()).toBe(true);
      expect(uomInput.props('label')).toBe('Unit of Measure');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
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
      wrapper = mountComponent(TEST_FOOD);
      expect((wrapper.vm as any).unitOfMeasureId).toBe(TEST_FOOD.unitOfMeasure.id);
    });
  });

  describe('grams', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.exists()).toBe(true);
      expect(gramsInput.props('label')).toBe('Grams');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
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
      wrapper = mountComponent({ ...TEST_FOOD, grams: 420 });
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      expect(gramsInput.find('input').element.value).toBe('420');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent(TEST_FOOD);
      const gramsInput = wrapper.findComponent('[data-testid="grams-input"]') as VueWrapper<components.VNumberInput>;
      const input = gramsInput.find('input');
      await input.trigger('focus');
      await input.setValue(124);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).grams).toBe(124);
    });
  });

  describe('calories', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(calsInput.exists()).toBe(true);
      expect(calsInput.props('label')).toBe('Calories');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      const input = calsInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, calories: 143 });
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      expect(calsInput.find('input').element.value).toBe('143');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, calories: 42 });
      const calsInput = wrapper.findComponent('[data-testid="calories-input"]') as VueWrapper<components.VNumberInput>;
      const input = calsInput.find('input');
      await input.trigger('focus');
      await input.setValue(173);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).calories).toBe(173);
    });
  });

  describe('sodium', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.exists()).toBe(true);
      expect(sodiumInput.props('label')).toBe('Sodium (mg)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      const input = sodiumInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, sodium: 19 });
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      expect(sodiumInput.find('input').element.value).toBe('19');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, sodium: 42 });
      const sodiumInput = wrapper.findComponent('[data-testid="sodium-input"]') as VueWrapper<components.VNumberInput>;
      const input = sodiumInput.find('input');
      await input.trigger('focus');
      await input.setValue(267);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).sodium).toBe(267);
    });
  });

  describe('sugar', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.exists()).toBe(true);
      expect(sugarInput.props('label')).toBe('Sugar (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      const input = sugarInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, sugar: 143 });
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      expect(sugarInput.find('input').element.value).toBe('143');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, sugar: 92 });
      const sugarInput = wrapper.findComponent('[data-testid="sugar-input"]') as VueWrapper<components.VNumberInput>;
      const input = sugarInput.find('input');
      await input.trigger('focus');
      await input.setValue(486);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).sugar).toBe(486);
    });
  });

  describe('carbs', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.exists()).toBe(true);
      expect(carbsInput.props('label')).toBe('Total Carbs (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      const input = carbsInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, carbs: 18 });
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      expect(carbsInput.find('input').element.value).toBe('18');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, carbs: 13 });
      const carbsInput = wrapper.findComponent('[data-testid="carbs-input"]') as VueWrapper<components.VNumberInput>;
      const input = carbsInput.find('input');
      await input.trigger('focus');
      await input.setValue(27);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).carbs).toBe(27);
    });
  });

  describe('fat', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.exists()).toBe(true);
      expect(fatInput.props('label')).toBe('Fat (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      const input = fatInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, fat: 8 });
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      expect(fatInput.find('input').element.value).toBe('8');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, fat: 4 });
      const fatInput = wrapper.findComponent('[data-testid="fat-input"]') as VueWrapper<components.VNumberInput>;
      const input = fatInput.find('input');
      await input.trigger('focus');
      await input.setValue(19);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).fat).toBe(19);
    });
  });

  describe('protein', () => {
    it('renders', () => {
      wrapper = mountComponent({});
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.exists()).toBe(true);
      expect(proteinInput.props('label')).toBe('Protein (g)');
    });

    it('is required', async () => {
      wrapper = mountComponent({});
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = proteinInput.find('input');

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
      wrapper = mountComponent({ ...TEST_FOOD, protein: 12 });
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      expect(proteinInput.find('input').element.value).toBe('12');
    });

    it('is emitted on change', async () => {
      wrapper = mountComponent({ ...TEST_FOOD, protein: 14 });
      const proteinInput = wrapper.findComponent(
        '[data-testid="protein-input"]',
      ) as VueWrapper<components.VNumberInput>;
      const input = proteinInput.find('input');
      await input.trigger('focus');
      await input.setValue(23);
      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted?.length).toBe(1);
      expect((emitted![0]![0] as Portion).protein).toBe(23);
    });
  });
});
