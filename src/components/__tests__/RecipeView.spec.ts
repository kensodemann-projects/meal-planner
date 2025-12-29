import { TEST_RECIPE } from '@/data/__tests__/test-data';
import type { Recipe } from '@/models/recipe';
import { DOMWrapper, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeView from '../RecipeView.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (props: { recipe: Recipe } = { recipe: { ...TEST_RECIPE, id: 'test-132' } }) =>
  mount(RecipeView, { props, global: { plugins: [vuetify] } });

describe('RecipeView', () => {
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

  it('renders the name in an h1 header', () => {
    wrapper = mountComponent();
    const header = wrapper.find('h1');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe(TEST_RECIPE.name);
  });

  describe('the description section', () => {
    let section: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      wrapper = mountComponent();
      section = wrapper.find('[data-testid="description-section"]');
    });

    it('exists', () => {
      expect(section.exists()).toBe(true);
    });

    it('does not have a sub-header', () => {
      const header = section.find('h2');
      expect(header.exists()).toBe(false);
    });

    it('renders the category', () => {
      expect(section.text()).toContain(`Category: ${TEST_RECIPE.category}`);
    });

    it('renders the cuisine', () => {
      expect(section.text()).toContain(`Cuisine: ${TEST_RECIPE.cuisine}`);
    });

    it('renders the servings', () => {
      expect(section.text()).toContain(`Servings: ${TEST_RECIPE.servings}`);
    });

    it('renders the difficulty', () => {
      expect(section.text()).toContain(`Difficulty: ${TEST_RECIPE.difficulty}`);
    });

    it('renders the description', () => {
      expect(section.text()).toContain(TEST_RECIPE.description);
    });

    it('renders the prep time', () => {
      expect(section.text()).toContain(`Prep Time: ${TEST_RECIPE.prepTimeMinutes} minutes`);
    });

    it('renders the cook time', () => {
      expect(section.text()).toContain(`Cook Time: ${TEST_RECIPE.cookTimeMinutes} minutes`);
    });
  });

  describe('the ingredients section', () => {
    let section: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      wrapper = mountComponent();
      section = wrapper.find('[data-testid="ingredients-section"]');
    });

    it('exists', () => {
      expect(section.exists()).toBe(true);
    });

    it('has a subheader', () => {
      const header = section.find('h2');
      expect(header.exists()).toBe(true);
      expect(header.text()).toBe('Ingredients');
    });

    it('lists the ingredients', () => {
      const lists = section.findAll('ul');
      const listItems = lists[0]?.findAll('li').map((li) => li.text());
      expect(listItems?.length).toBe(TEST_RECIPE.ingredients.length);
      TEST_RECIPE.ingredients.forEach((ingredient, index) => {
        expect(listItems?.[index]).toContain(ingredient.name);
      });
    });
  });

  describe('the steps section', () => {
    let section: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      wrapper = mountComponent();
      section = wrapper.find('[data-testid="steps-section"]');
    });

    it('exists', () => {
      expect(section.exists()).toBe(true);
    });

    it('has a subheader', () => {
      const header = section.find('h2');
      expect(header.exists()).toBe(true);
      expect(header.text()).toBe('Steps');
    });

    it('lists the steps', () => {
      const lists = section.findAll('ol');
      const listItems = lists[0]?.findAll('li').map((li) => li.text());
      expect(listItems?.length).toBe(TEST_RECIPE.steps.length);
      TEST_RECIPE.steps.forEach((step, index) => {
        expect(listItems?.[index]).toBe(step.instruction);
      });
    });
  });

  describe('the nutritional information section', () => {
    let section: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      wrapper = mountComponent();
      section = wrapper.find('[data-testid="nutritional-information-section"]');
    });

    it('exists', () => {
      expect(section.exists()).toBe(true);
    });

    it('has a subheader', () => {
      const header = section.find('h2');
      expect(header.exists()).toBe(true);
      expect(header.text()).toBe('Nutritional Information');
    });

    it('displays the nutritional information', () => {
      const text = section.text();
      expect(text).toContain(`Calories: ${TEST_RECIPE.calories}`);
      expect(text).toContain(`Sodium: ${TEST_RECIPE.sodium}mg`);
      expect(text).toContain(`Sugar: ${TEST_RECIPE.sugar}g`);
      expect(text).toContain(`Total Carbs: ${TEST_RECIPE.carbs}g`);
      expect(text).toContain(`Fat: ${TEST_RECIPE.fat}g`);
      expect(text).toContain(`Protein: ${TEST_RECIPE.protein}g`);
    });
  });
});
