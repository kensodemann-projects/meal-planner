import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import MealItemEditorCard from '../MealItemEditorCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { type: 'food' | 'recipe' } = { type: 'food' }) =>
  mount(MealItemEditorCard, { props, global: { plugins: [vuetify] } });

// const getInputs = (wrapper: ReturnType<typeof mountComponent>) => ({
//   recipeOrFoodInput: wrapper.findComponent('[data-testid="recipe-or-food-input"]').find('input'),
//   unitsInput: wrapper.findComponent('[data-testid="units-input"]').find('input'),
//   unitOfMeasureInput: wrapper.findComponent('[data-testid="unit-of-measure-input"]').find('input'),
//   caloriesInput: wrapper.findComponent('[data-testid="calories-input"]').find('input'),
//   sodiumInput: wrapper.findComponent('[data-testid="sodium-input"]').find('input'),
//   sugarInput: wrapper.findComponent('[data-testid="sugar-input"]').find('input'),
//   carbsInput: wrapper.findComponent('[data-testid="carbs-input"]').find('input'),
//   fatInput: wrapper.findComponent('[data-testid="fat-input"]').find('input'),
//   proteinInput: wrapper.findComponent('[data-testid="protein-input"]').find('input'),
// });

describe('Meal Item Editor Card', () => {
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

  describe('adding', () => {
    describe('a recipe', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'recipe' });
      });

      it('placeholder', () => {
        expect(true).toBe(true);
      });
    });

    describe('a food', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'food' });
      });

      it('placeholder', () => {
        expect(true).toBe(true);
      });
    });
  });

  describe('updating', () => {
    describe('a recipe', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'recipe' });
      });

      it('placeholder', () => {
        expect(true).toBe(true);
      });
    });

    describe('a food', () => {
      beforeEach(() => {
        wrapper = mountComponent({ type: 'food' });
      });

      it('placeholder', () => {
        expect(true).toBe(true);
      });
    });
  });
});
