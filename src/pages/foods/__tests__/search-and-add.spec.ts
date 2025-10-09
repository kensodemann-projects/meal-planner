import { mount } from '@vue/test-utils';
import { beforeEach, describe, it, expect, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SearchAndAddPage from '../search-and-add.vue';
import { fetchFoodItem, searchFdcData } from '@/core/usda-fdc-data';

vi.mock('@/core/usda-fdc-data');

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
  it('renders the page correctly', () => {
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-page').exists()).toBe(true);
  });

  it('renders a search input', () => {
    const wrapper = createWrapper();

    const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
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
      const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
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
      const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
      const testQuery = 'unknown food';
      await searchInput.vm.$emit('search', testQuery);
      await wrapper.vm.$nextTick();

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
      const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      await wrapper.vm.$nextTick();

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
      const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
      const testQuery = 'apple';
      await searchInput.vm.$emit('search', testQuery);
      await wrapper.vm.$nextTick();

      const resultsContainer = wrapper.find('[data-testid="results-container"]');
      const resultsHeader = resultsContainer.find('h2');
      expect(resultsHeader.text()).toContain('42 items found');
    });

    it('displays an AppFdcFoodListItem for each search result', async () => {
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
      const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
      const testQuery = 'fruit';
      await searchInput.vm.$emit('search', testQuery);
      await wrapper.vm.$nextTick();

      const listItems = wrapper.findAllComponents({ name: 'AppFdcFoodListItem' });
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
        const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
        const testQuery = 'fruit';
        await searchInput.vm.$emit('search', testQuery);
        await wrapper.vm.$nextTick();
      });

      it('fetches the specified food item when "add" is clicked', async () => {
        const listItems = wrapper.findAllComponents({ name: 'AppFdcFoodListItem' });
        listItems[1]!.vm.$emit('add', {
          fdcId: 2,
          description: 'Banana',
          dataType: 'Foundation',
          foodCategory: 'Fruits & Juices',
        });
        expect(fetchFoodItem).toHaveBeenCalledExactlyOnceWith(2);
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
        const searchInput = wrapper.findComponent({ name: 'AppSearchInput' });
        const testQuery = 'fruit';
        await searchInput.vm.$emit('search', testQuery);
        await wrapper.vm.$nextTick();
        vi.clearAllMocks();
      });

      it('queries for the clicked page', async () => {
        const pagination = wrapper.findComponent(components.VPagination);
        const buttons = pagination.findAll('.v-btn');
        await buttons[3]!.trigger('click');
        await wrapper.vm.$nextTick();
        expect(searchFdcData).toHaveBeenCalledExactlyOnceWith('fruit', 3);
      });
    });
  });
});
