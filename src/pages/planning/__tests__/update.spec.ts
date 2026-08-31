import MealItemEditor from '@/components/meals/MealItemEditor.vue';
import { TEST_MEAL_PLANS } from '@/data/__tests__/test-data';
import { useMealPlansData } from '@/data/meal-plans';
import type { PlannedMealItem } from '@/models/meal';
import type { MealPlan } from '@/models/meal-plan.ts';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import update from '../update.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');
vi.mock('@/data/meal-plans');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(update, { props, global: { plugins: [vuetify] } });
const renderPage = async (props = {}) => {
  const wrapper = mountPage(props);
  await flushPromises();
  return wrapper;
};

const TEST_PLANNED_MEAL_ITEM: PlannedMealItem = {
  mealDate: '2025-12-23',
  mealType: 'Dinner',
  mealItem: TEST_MEAL_PLANS[1]!.meals[0]!.items[1]!,
};

describe('update', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    const { mealPlans, loading } = useMealPlansData();
    (mealPlans.value as MealPlan[]) = TEST_MEAL_PLANS;
    (loading.value as boolean) = false;
    vi.clearAllMocks();
    (useRoute as Mock).mockReturnValue({
      query: {
        weekStartDate: '2025-12-22',
        mealPlanId: TEST_MEAL_PLANS[1]!.id,
        mealType: TEST_MEAL_PLANS[1]!.meals[0]!.type,
        mealItemId: TEST_MEAL_PLANS[1]!.meals[0]!.items[1]!.id,
      },
    });
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the page heading', async () => {
    wrapper = await renderPage();
    expect(wrapper.find('h1').text()).toBe('Update Meal Item');
  });

  it('shows a loading indicator while meal plans are being fetched', () => {
    const { loading } = useMealPlansData();
    (loading.value as boolean) = true;
    wrapper = mountPage();
    expect(wrapper.findComponent({ name: 'VProgressCircular' }).exists()).toBe(true);
  });

  it('does not render MealItemEditor while meal plans are loading', () => {
    const { loading } = useMealPlansData();
    (loading.value as boolean) = true;
    wrapper = mountPage();
    expect(wrapper.findComponent(MealItemEditor).exists()).toBe(false);
  });

  it('hides the loading indicator once meal plans have loaded', async () => {
    wrapper = await renderPage();
    expect(wrapper.findComponent({ name: 'VProgressCircular' }).exists()).toBe(false);
  });

  it('renders MealItemEditor with the week start date from the route', async () => {
    wrapper = await renderPage();
    const editor = wrapper.findComponent(MealItemEditor);
    expect(editor.exists()).toBe(true);
    expect(editor.props('weekStartDate')).toBe('2025-12-22');
  });

  it('renders MealItemEditor with the meal item from the route', async () => {
    wrapper = await renderPage();
    const editor = wrapper.findComponent(MealItemEditor);
    expect(editor.exists()).toBe(true);
    expect(editor.props('mealDate')).toBe(TEST_MEAL_PLANS[1]!.date);
    expect(editor.props('mealType')).toBe(TEST_MEAL_PLANS[1]!.meals[0]!.type);
    expect(editor.props('mealItem')).toEqual(TEST_MEAL_PLANS[1]!.meals[0]!.items[1]!);
  });

  describe('on cancel', () => {
    it('does not update the meal item', async () => {
      const { updateMealItemInMealPlan } = useMealPlansData();
      wrapper = await renderPage();
      wrapper.findComponent(MealItemEditor).vm.$emit('cancel');
      await flushPromises();
      expect(updateMealItemInMealPlan).not.toHaveBeenCalled();
    });

    it('navigates to the week page', async () => {
      wrapper = await renderPage();
      const editor = wrapper.findComponent(MealItemEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      const { replace } = useRouter();
      expect(replace).toHaveBeenCalledExactlyOnceWith({
        path: '/planning/week',
        query: { weekStartDate: '2025-12-22' },
      });
    });
  });

  describe('on save', () => {
    it('adds the meal item to the meal plan', async () => {
      const { updateMealItemInMealPlan } = useMealPlansData();
      wrapper = await renderPage();
      const editor = wrapper.findComponent(MealItemEditor);
      editor.vm.$emit('save', TEST_PLANNED_MEAL_ITEM);
      await flushPromises();
      expect(updateMealItemInMealPlan).toHaveBeenCalledExactlyOnceWith(
        TEST_PLANNED_MEAL_ITEM,
        TEST_MEAL_PLANS[1]!.date,
        TEST_MEAL_PLANS[1]!.meals[0]!.type,
      );
    });

    it('navigates to the week page', async () => {
      wrapper = await renderPage();
      const editor = wrapper.findComponent(MealItemEditor);
      editor.vm.$emit('save', TEST_PLANNED_MEAL_ITEM);
      await flushPromises();
      const { replace } = useRouter();
      expect(replace).toHaveBeenCalledExactlyOnceWith({
        path: '/planning/week',
        query: { weekStartDate: '2025-12-22' },
      });
    });
  });
});
