import { TEST_FDC_FOODS, TEST_FOOD } from '@/data/__tests__/test-data';
import { fetchFoodItem, searchFdcData } from '@/data/usda-fdc-data';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SearchAndAddPage from '../search-and-add.vue';
import { useFoodsData } from '@/data/foods';

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
  let wrapper: ReturnType<typeof createWrapper>;

  afterEach(async () => {
    await flushPromises();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
    wrapper?.unmount();
  });

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
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
    });
  });

  it('renders the page correctly', () => {
    wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-page').exists()).toBe(true);
  });

  it('renders a search input', () => {
    wrapper = createWrapper();
    const searchInput = wrapper.findComponent({ name: 'SearchInput' });
    expect(searchInput.exists()).toBe(true);
    expect(searchInput.props('label')).toBe('Search for food');
    expect(searchInput.props('placeholder')).toBe('Search for a food to add...');
  });

  it('does not show results container initially', () => {
    wrapper = createWrapper();
    const resultsContainer = wrapper.find('[data-testid="results-container"]');
    expect(resultsContainer.exists()).toBe(false);
  });

  it('does not show no results message initially', () => {
    wrapper = createWrapper();
    const noResults = wrapper.find('[data-testid="no-results"]');
    expect(noResults.exists()).toBe(false);
  });

  describe('on search', () => {
    describe('addFoodItem', () => {
      beforeEach(async () => {
        (searchFdcData as Mock).mockResolvedValue({
          foods: [...TEST_FDC_FOODS],
          totalHits: TEST_FDC_FOODS.length,
          currentPage: 1,
          totalPages: 1,
        });
        wrapper = createWrapper();
        const searchInput = wrapper.findComponent({ name: 'SearchInput' });
        await searchInput.vm.$emit('search', 'test');
        await flushPromises();
      });

      it('displays a food item per result', () => {
        const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
        expect(listItems.length).toBe(TEST_FDC_FOODS.length);
      });

      describe('if the food does not already exist', () => {
        beforeEach(() => {
          const { fdcFoodItemExists, addFood } = useFoodsData();
          (fdcFoodItemExists as Mock).mockReturnValue(false);
          (fetchFoodItem as Mock).mockResolvedValue(TEST_FOOD);
          (addFood as Mock).mockResolvedValue(undefined);
        });

        it('fetches the food details', async () => {
          const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
          await listItems[2]!.vm.$emit('add', TEST_FDC_FOODS[2]);
          await flushPromises();
          expect(fetchFoodItem).toHaveBeenCalledExactlyOnceWith(TEST_FDC_FOODS[2]!.fdcId);
        });

        it('calls addFood', async () => {
          const { addFood } = useFoodsData();
          const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
          await listItems[2]!.vm.$emit('add', TEST_FDC_FOODS[2]);
          await flushPromises();
          expect(addFood).toHaveBeenCalledWith(TEST_FOOD);
        });

        it('shows success', async () => {
          const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
          await listItems[2]!.vm.$emit('add', TEST_FDC_FOODS[2]);
          await flushPromises();
          const snackbar = document.body.querySelector('.v-snackbar');
          expect(snackbar).not.toBeNull();
          expect(snackbar!.textContent).toContain('The food item has been added to your food list.');
        });

        it('shows error if fetchFoodItem throws', async () => {
          (fetchFoodItem as Mock).mockRejectedValueOnce(new Error('fail'));
          const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
          await listItems[2]!.vm.$emit('add', TEST_FDC_FOODS[2]);
          await flushPromises();
          const snackbar = document.body.querySelector('.v-snackbar');
          expect(snackbar).not.toBeNull();
          expect(snackbar!.textContent).toContain('Failed to add food item. Please try again.');
        });

        it('shows error if addFood throws', async () => {
          const { addFood } = useFoodsData();
          (addFood as Mock).mockRejectedValueOnce(new Error('fail'));
          const listItems = wrapper.findAllComponents({ name: 'FdcFoodListItem' });
          await listItems[2]!.vm.$emit('add', TEST_FDC_FOODS[2]);
          await flushPromises();
          const snackbar = document.body.querySelector('.v-snackbar');
          expect(snackbar).not.toBeNull();
          expect(snackbar!.textContent).toContain('Failed to add food item. Please try again.');
        });
      });
    });

    it('calls the FDC search API with the correct query', async () => {
      wrapper = createWrapper();
      const searchInput = wrapper.findComponent({ name: 'SearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      await flushPromises();
      expect(searchFdcData).toHaveBeenCalledExactlyOnceWith(testQuery);
    });

    it('shows no results message when search returns empty', async () => {
      (searchFdcData as ReturnType<typeof vi.fn>).mockResolvedValue({
        foods: [],
        totalHits: 0,
        currentPage: 1,
        totalPages: 1,
      });

      wrapper = createWrapper();
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

      wrapper = createWrapper();
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

      wrapper = createWrapper();
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

      wrapper = createWrapper();
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

    describe('when changing the displayed page of results', () => {
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

  describe('cancel', () => {
    it('navigates to the foods page', async () => {
      const router = useRouter();
      wrapper = createWrapper();
      const button = wrapper.findComponent('[data-testid="cancel-button"]');
      await button.trigger('click');
      expect(router.replace).toHaveBeenCalledExactlyOnceWith('/foods');
    });
  });
});
