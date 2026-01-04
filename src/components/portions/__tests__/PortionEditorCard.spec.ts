import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { TEST_PORTION } from '@/data/__tests__/test-data';
import type { Portion } from '@/models/portion';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PortionEditorCard from '../PortionEditorCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { portion?: Portion } = {}) =>
  mount(PortionEditorCard, { props, global: { plugins: [vuetify] } });

const updateEditPortion = async (wrapper: ReturnType<typeof mountComponent>, updates: Partial<Portion>) => {
  (wrapper.vm as any).editPortion = {
    ...(wrapper.vm as any).editPortion,
    ...updates,
  };
  await wrapper.vm.$nextTick();
  await flushPromises();
};

describe('Portion Editor', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
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
      const editPortion = (wrapper.vm as any).editPortion;
      expect(editPortion.units).toBeUndefined();
      expect(editPortion.unitOfMeasure).toBeUndefined();
      expect(editPortion.grams).toBeUndefined();
      expect(editPortion.calories).toBeUndefined();
      expect(editPortion.sodium).toBe(0);
      expect(editPortion.sugar).toBe(0);
      expect(editPortion.carbs).toBe(0);
      expect(editPortion.fat).toBe(0);
      expect(editPortion.protein).toBe(0);
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
        await updateEditPortion(wrapper, { units: 1 });
        await updateEditPortion(wrapper, { unitOfMeasure: findUnitOfMeasure('each') });
        await updateEditPortion(wrapper, { grams: 56 });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { calories: 75 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
      });

      it('emits "save" with the data', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        await updateEditPortion(wrapper, {
          units: 1,
          unitOfMeasure: findUnitOfMeasure('each'),
          grams: 56,
          calories: 75,
          carbs: 14,
          sugar: 8,
          fat: 17,
          protein: 4,
        });
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
      const editPortion = (wrapper.vm as any).editPortion;
      expect(editPortion.units).toBe(TEST_PORTION.units);
      expect(editPortion.grams).toBe(TEST_PORTION.grams);
      expect(editPortion.calories).toBe(TEST_PORTION.calories);
      expect(editPortion.sodium).toBe(TEST_PORTION.sodium);
      expect(editPortion.sugar).toBe(TEST_PORTION.sugar);
      expect(editPortion.carbs).toBe(TEST_PORTION.carbs);
      expect(editPortion.fat).toBe(TEST_PORTION.fat);
      expect(editPortion.protein).toBe(TEST_PORTION.protein);
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
        await updateEditPortion(wrapper, { units: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { units: TEST_PORTION.units });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { grams: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { grams: TEST_PORTION.grams });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { calories: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { calories: TEST_PORTION.calories });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { sugar: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { sugar: TEST_PORTION.sugar });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { carbs: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { carbs: TEST_PORTION.carbs });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { fat: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { fat: TEST_PORTION.fat });
        expect(saveButton.attributes('disabled')).toBeDefined();
        await updateEditPortion(wrapper, { protein: 1 });
        expect(saveButton.attributes('disabled')).toBeUndefined();
        await updateEditPortion(wrapper, { protein: TEST_PORTION.protein });
        expect(saveButton.attributes('disabled')).toBeDefined();
      });

      it('emits "save" with the data', async () => {
        const saveButton = wrapper.getComponent('[data-testid="save-button"]');
        await updateEditPortion(wrapper, {
          units: 1,
          sodium: 819,
        });
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
