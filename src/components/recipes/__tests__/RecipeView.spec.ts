import DetailStatCard from '@/components/core/DetailStatCard.vue';
import { TEST_HOMEMADE_RECIPE, TEST_PREPARED_RECIPE, TEST_SOURCES } from '@/data/__tests__/test-data';
import { useSourcesData } from '@/data/sources';
import type { Recipe } from '@/models/recipe';
import type { Source } from '@/models/source';
import { DOMWrapper, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import RecipeView from '../RecipeView.vue';

vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = (
  props: { recipe: Recipe; headingLevel?: 1 | 2 } = { recipe: { ...TEST_HOMEMADE_RECIPE, id: 'test-132' } },
) => mount(RecipeView, { props, global: { plugins: [vuetify] } });

const preparedSource = TEST_SOURCES.find((source) => source.id === TEST_PREPARED_RECIPE.sourceId)!;

const metadataCard = (root: ReturnType<typeof mountComponent>, label: string) =>
  root.findAllComponents(DetailStatCard).find((card) => card.props('label') === label);

describe('RecipeView', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    const { sources } = useSourcesData();
    (sources as Ref<Source[]>).value = [];
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
    expect(header.text()).toBe(TEST_HOMEMADE_RECIPE.name);
  });

  describe('homemade recipes', () => {
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

      it('renders the description', () => {
        expect(section.text()).toContain(TEST_HOMEMADE_RECIPE.description);
      });

      it('renders chips for the category and cuisine', () => {
        const chips = section.findAllComponents(components.VChip);
        expect(chips.length).toBe(2);
        expect(chips[0].text()).toBe(TEST_HOMEMADE_RECIPE.cuisine);
        expect(chips[1].text()).toBe(TEST_HOMEMADE_RECIPE.category);
      });

      it('renders the difficulty', () => {
        expect(section.text()).toContain(`Difficulty: ${TEST_HOMEMADE_RECIPE.difficulty}`);
      });

      it('renders the prep time', () => {
        expect(section.text()).toContain(`Prep Time: ${TEST_HOMEMADE_RECIPE.prepTimeMinutes} minutes`);
      });

      it('renders the cook time', () => {
        expect(section.text()).toContain(`Cook Time: ${TEST_HOMEMADE_RECIPE.cookTimeMinutes} minutes`);
      });

      it('does not render a source', () => {
        expect(metadataCard(wrapper, 'Source')).toBeUndefined();
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
        expect(listItems?.length).toBe(TEST_HOMEMADE_RECIPE.ingredients.length);
        TEST_HOMEMADE_RECIPE.ingredients.forEach((ingredient, index) => {
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
        expect(listItems?.length).toBe(TEST_HOMEMADE_RECIPE.steps.length);
        TEST_HOMEMADE_RECIPE.steps.forEach((step, index) => {
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
        expect(text).toContain(`Calories: ${TEST_HOMEMADE_RECIPE.calories}`);
        expect(text).toContain(`Sodium: ${TEST_HOMEMADE_RECIPE.sodium}mg`);
        expect(text).toContain(`Sugar: ${TEST_HOMEMADE_RECIPE.sugar}g`);
        expect(text).toContain(`Carbs: ${TEST_HOMEMADE_RECIPE.carbs}g`);
        expect(text).toContain(`Fat: ${TEST_HOMEMADE_RECIPE.fat}g`);
        expect(text).toContain(`Protein: ${TEST_HOMEMADE_RECIPE.protein}g`);
      });
    });

    describe('when headingLevel is 2', () => {
      beforeEach(() => {
        wrapper = mountComponent({
          recipe: { ...TEST_HOMEMADE_RECIPE, id: 'test-132' },
          headingLevel: 2,
        });
      });

      it('does not render an h1', () => {
        expect(wrapper.find('h1').exists()).toBe(false);
      });

      it('renders the name in an h2', () => {
        expect(wrapper.find('h2').text()).toBe(TEST_HOMEMADE_RECIPE.name);
      });

      it('renders Ingredients as an h3 and omits an h2 in that section', () => {
        const section = wrapper.find('[data-testid="ingredients-section"]');
        expect(section.find('h2').exists()).toBe(false);
        expect(section.find('h3').text()).toBe('Ingredients');
      });

      it('renders Steps as an h3', () => {
        const section = wrapper.find('[data-testid="steps-section"]');
        expect(section.find('h3').text()).toBe('Steps');
      });

      it('renders Nutritional Information as an h3', () => {
        const section = wrapper.find('[data-testid="nutritional-information-section"]');
        expect(section.find('h3').text()).toBe('Nutritional Information');
      });
    });
  });

  describe('prepared recipes', () => {
    let section: DOMWrapper<HTMLElement>;

    beforeEach(() => {
      const { sources } = useSourcesData();
      (sources as Ref<Source[]>).value = TEST_SOURCES;
      wrapper = mountComponent({ recipe: { ...TEST_PREPARED_RECIPE, id: 'prepared-1' } });
      section = wrapper.find('[data-testid="description-section"]');
    });

    it('renders the description, cuisine, and category', () => {
      expect(section.text()).toContain(TEST_PREPARED_RECIPE.description);
      const chips = section.findAllComponents(components.VChip);
      expect(chips.length).toBe(2);
      expect(chips[0].text()).toBe(TEST_PREPARED_RECIPE.cuisine);
      expect(chips[1].text()).toBe(TEST_PREPARED_RECIPE.category);
    });

    it('renders the source', () => {
      const card = metadataCard(wrapper, 'Source');
      expect(card?.props('value')).toBe(preparedSource.name);
      expect(card?.props('icon')).toBe('mdi-storefront');
    });

    it('renders the servings', () => {
      expect(metadataCard(wrapper, 'Servings')?.props('value')).toBe(TEST_PREPARED_RECIPE.servings);
    });

    it('hides difficulty, prep time, and cook time', () => {
      expect(section.text()).not.toContain('Difficulty:');
      expect(section.text()).not.toContain('Prep Time:');
      expect(section.text()).not.toContain('Cook Time:');
    });

    it('hides the ingredients section', () => {
      expect(wrapper.find('[data-testid="ingredients-section"]').exists()).toBe(false);
    });

    it('hides the steps section', () => {
      expect(wrapper.find('[data-testid="steps-section"]').exists()).toBe(false);
    });

    it('displays the nutritional information', () => {
      const nutrition = wrapper.find('[data-testid="nutritional-information-section"]');
      const text = nutrition.text();
      expect(text).toContain(`Calories: ${TEST_PREPARED_RECIPE.calories}`);
      expect(text).toContain(`Sodium: ${TEST_PREPARED_RECIPE.sodium}mg`);
      expect(text).toContain(`Sugar: ${TEST_PREPARED_RECIPE.sugar}g`);
      expect(text).toContain(`Carbs: ${TEST_PREPARED_RECIPE.carbs}g`);
      expect(text).toContain(`Fat: ${TEST_PREPARED_RECIPE.fat}g`);
      expect(text).toContain(`Protein: ${TEST_PREPARED_RECIPE.protein}g`);
    });

    it('shows a blank source when the source cannot be found', () => {
      wrapper.unmount();
      wrapper = mountComponent({ recipe: { ...TEST_PREPARED_RECIPE, sourceId: 'missing-source' } });
      expect(metadataCard(wrapper, 'Source')?.props('value')).toBe('');
    });
  });

  describe('prepared recipes when headingLevel is 2', () => {
    beforeEach(() => {
      const { sources } = useSourcesData();
      (sources as Ref<Source[]>).value = TEST_SOURCES;
      wrapper = mountComponent({
        recipe: { ...TEST_PREPARED_RECIPE, id: 'prepared-1' },
        headingLevel: 2,
      });
    });

    it('renders the name in an h2', () => {
      expect(wrapper.find('h2').text()).toBe(TEST_PREPARED_RECIPE.name);
    });

    it('renders Nutritional Information as an h3', () => {
      const section = wrapper.find('[data-testid="nutritional-information-section"]');
      expect(section.find('h3').text()).toBe('Nutritional Information');
    });

    it('hides the ingredients and steps sections', () => {
      expect(wrapper.find('[data-testid="ingredients-section"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="steps-section"]').exists()).toBe(false);
    });

    it('renders the source name', () => {
      expect(metadataCard(wrapper, 'Source')?.props('value')).toBe(preparedSource.name);
    });

    it('hides difficulty, prep time, and cook time', () => {
      const section = wrapper.find('[data-testid="description-section"]');
      expect(section.text()).not.toContain('Difficulty:');
      expect(section.text()).not.toContain('Prep Time:');
      expect(section.text()).not.toContain('Cook Time:');
    });
  });
});
