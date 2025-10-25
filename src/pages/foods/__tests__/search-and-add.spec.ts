import { useFoodsData } from '@/data/foods';
import { fetchFoodItem, searchFdcData } from '@/data/usda-fdc-data';
import type { FoodItem } from '@/models';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SearchAndAddPage from '../search-and-add.vue';

vi.mock('vue-router');
vi.mock('@/data/usda-fdc-data');
vi.mock('@/data/foods');

const vuetify = createVuetify({
  components,
  directives,
});

const createWrapper = (props = {}) => {
  return mount(SearchAndAddPage, {
    props,
    global: {
      plugins: [vuetify],
    },
  });
};

describe('SearchAndAddPage', () => {
  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
  });

  it('renders the page correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-page').exists()).toBe(true);
  });

  it('renders a search input', () => {
    const wrapper = createWrapper();

    const searchInput = wrapper.findComponent({ name: 'SearchInput' });
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.props('label')).toBe('Search for food');
    expect(searchInput.props('placeholder')).toBe('Search for a food to add...');
  });

  it('does not show results container initially', () => {
    const wrapper = createWrapper();

    const resultsContainer = wrapper.find('[data-testid="results-container"]');
    expect(resultsContainer.exists()).toBe(false);
  });

  it('does not show no results message initially', () => {
    const wrapper = createWrapper();

    const noResults = wrapper.find('[data-testid="no-results"]');
    expect(noResults.exists()).toBe(false);
  });

  describe('on search', () => {
    it('calls the FDC search API with the correct query', async () => {
      const wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      expect(searchFdcData).toHaveBeenCalledExactlyOnceWith(testQuery);
    });

    it('shows no results message when search returns empty', async () => {
      (searchFdcData as ReturnType<typeof vi.fn>).mockResolvedValue({
        foods: [],
        totalHits: 0,
        currentPage: 1,
        totalPages: 1,
      });

      const wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'unknown food';
      await searchInput.vm.$emit('search', testQuery);
      await flushPromises();

      const noResults = wrapper.find('[data-testid="no-results"]');
      expect(noResults.exists()).toBe(true);
    });

    it('shows results container when there are search results', async () => {
      (searchFdcData as ReturnType<typeof vi.fn>).mockResolvedValue({
        foods: [{ fdcId: 1, description: 'Apple', dataType: 'Foundation' }],
        totalHits: 1,
        currentPage: 1,
        totalPages: 1,
      });

      const wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      await flushPromises();

      const resultsContainer = wrapper.find('[data-testid="results-container"]');
      expect(resultsContainer.exists()).toBe(true);
    });

    it('displays the totalHits in the results header', async () => {
      (searchFdcData as ReturnType<typeof vi.fn>).mockResolvedValue({
        foods: [{ fdcId: 1, description: 'Apple', dataType: 'Foundation' }],
        totalHits: 42,
        currentPage: 1,
        totalPages: 1,
      });

      const wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      await flushPromises();

      const resultsContainer = wrapper.find('[data-testid="results-container"]');
      const resultsHeader = resultsContainer.find('h2');
      expect(resultsHeader.text()).toContain('42 items found');
    });

    it('displays an FdcFoodListItem for each search result', async () => {
      (searchFdcData as ReturnType<typeof vi.fn>).mockResolvedValue({
        foods: [
          { fdcId: 1, description: 'Apple', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
          { fdcId: 2, description: 'Banana', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
        ],
        totalHits: 2,
        currentPage: 1,
        totalPages: 1,
      });

      const wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'fruit';
      await searchInput.vm.$emit('search', testQuery);
      await flushPromises();

      const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
      expect(listItems).toHaveLength(2);
      expect(listItems[0]?.props('food')).toEqual({
        fdcId: 1,
        description: 'Apple',
        dataType: 'Foundation',
        foodCategory: 'Fruits & Juices',
      });
      expect(listItems[1]?.props('food')).toEqual({
        fdcId: 2,
        description: 'Banana',
        dataType: 'Foundation',
        foodCategory: 'Fruits & Juices',
      });
    });

    describe('when "add" is clicked in a food item', () => {
      let wrapper: ReturnType<typeof createWrapper>;
      beforeEach(async () => {
        const { addFood } = useFoodsData();
        (addFood as Mock).mockResolvedValueOnce('fiif8e88fe9');

        (searchFdcData as Mock).mockResolvedValue({
          foods: [
            { fdcId: 1, description: 'Apple', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
            { fdcId: 2, description: 'Banana', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
          ],
          totalHits: 2,
          currentPage: 1,
          totalPages: 1,
        });

        wrapper = createWrapper();
        const searchInput = wrapper.findComponent({ name: 'SearchInput' });
        const testQuery = 'fruit';
        await searchInput.vm.$emit('search', testQuery);
        await flushPromises();
      });

      it('fetches the specified food item', async () => {
        const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
        listItems[1]!.vm.$emit('add', {
          fdcId: 2,
          description: 'Banana',
          dataType: 'Foundation',
          foodCategory: 'Fruits & Juices',
        });
        expect(fetchFoodItem).toHaveBeenCalledExactlyOnceWith(2);
      });

      it('adds the food item', async () => {
        const { addFood } = useFoodsData();
        (fetchFoodItem as Mock).mockResolvedValue(BANANA);
        const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
        listItems[1]!.vm.$emit('add', {
          fdcId: 2,
          description: 'Banana',
          dataType: 'Foundation',
          foodCategory: 'Fruits & Juices',
        });
        await flushPromises();
        expect(addFood).toHaveBeenCalledExactlyOnceWith(BANANA);
      });

      it('navigates to the edit page for the food', async () => {
        const router = useRouter();
        (fetchFoodItem as Mock).mockResolvedValue(BANANA);
        const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
        listItems[1]!.vm.$emit('add', {
          fdcId: 2,
          description: 'Banana',
          dataType: 'Foundation',
          foodCategory: 'Fruits & Juices',
        });
        await flushPromises();
        expect(router.push).toHaveBeenCalledExactlyOnceWith('/foods/fiif8e88fe9');
      });
    });

    describe('when changing the diplayed page of results', () => {
      let wrapper: ReturnType<typeof createWrapper>;
      beforeEach(async () => {
        (searchFdcData as Mock).mockResolvedValue({
          foods: [
            { fdcId: 1, description: 'Apple', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
            { fdcId: 2, description: 'Banana', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
            { fdcId: 3, description: 'Pineapple', dataType: 'Foundation', foodCategory: 'Fruits & Juices' },
          ],
          foodSearchCriteria: { query: 'fruit' },
          totalHits: 3,
          currentPage: 1,
          totalPages: 3,
        });

        wrapper = createWrapper();
        const searchInput = wrapper.findComponent({ name: 'SearchInput' });
        const testQuery = 'fruit';
        await searchInput.vm.$emit('search', testQuery);
        await flushPromises();
        vi.clearAllMocks();
      });

      it('queries for the clicked page', async () => {
        const pagination = wrapper.findComponent(components.VPagination);
        const buttons = pagination.findAll('.v-btn');
        await buttons[3]!.trigger('click');
        await flushPromises();
        expect(searchFdcData).toHaveBeenCalledExactlyOnceWith('fruit', 3);
      });
    });
  });
});

const BANANA: FoodItem = {
  name: 'banana',
  fdcId: 1105314,
  category: 'Produce',
  grams: 100,
  unitOfMeasure: { id: 'g', name: 'Grams', type: 'weight', system: 'metric' },
  units: 100,
  calories: 98,
  carbs: 23,
  sugar: 15.8,
  sodium: 4,
  fat: 0,
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
      fat: 0,
      protein: 0.851,
    },
  ],
};
