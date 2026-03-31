import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useSettingsData } from '@/data/settings';
import { useRouter } from 'vue-router';
import { useMealPlansData } from '@/data/meal-plans';
import { multiDayMealPlanNutrients, daysWithMeals } from '@/core/nutritional-calculations';

vi.mock('@/data/settings');
vi.mock('vue-router');
vi.mock('@/data/meal-plans');
vi.mock('@/core/nutritional-calculations');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Planning', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 11, 25));
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
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

  it('gets the settings', async () => {
    wrapper = mountPage();
    expect(useSettingsData).toHaveBeenCalled();
  });

  describe('week cards', () => {
    it('exists for 6 weeks', async () => {
      wrapper = mountPage();
      await flushPromises();
      const weekCards = wrapper.findAllComponents(components.VCard);
      expect(weekCards.length).toBe(6);
    });

    describe('this week', () => {
      it('is the first card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const title = weekCards[0]?.findComponent(components.VCardTitle);
        const subTitle = weekCards[0]?.findComponent(components.VCardSubtitle);
        expect(title?.text()).toBe('This Week');
        expect(subTitle?.text()).toBe('12/22/2025 - 12/28/2025');
      });

      it('navigates to the week details for next week', async () => {
        const router = useRouter();
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const nextWeekCard = weekCards[0]!;
        await nextWeekCard.trigger('click');
        expect(router.push).toHaveBeenCalledExactlyOnceWith({
          path: 'planning/week',
          query: { dt: '2025-12-22' },
        });
      });

      describe('stats', () => {
        it('displays days with meals from daysWithMeals()', async () => {
          (daysWithMeals as Mock).mockReturnValue(5);
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(components.VCard)[0]!;
          const text = card.findComponent(components.VCardText);
          expect(text.text()).toContain('Days with Meals: 5');
        });

        it('displays average calories from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 14002,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(components.VCard)[0]!;
          const text = card.findComponent(components.VCardText);
          expect(text.text()).toContain('Average Calories: 2000');
        });

        it('displays average protein from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 703,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(components.VCard)[0]!;
          const text = card.findComponent(components.VCardText);
          expect(text.text()).toContain('Average Protein: 100g');
        });

        it('displays average carbs from multiDayMealPlanNutrients()', async () => {
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 2102,
            sugar: 0,
            sodium: 0,
          });
          (daysWithMeals as Mock).mockReturnValue(7);
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(components.VCard)[0]!;
          const text = card.findComponent(components.VCardText);
          expect(text.text()).toContain('Average Carbs: 300g');
        });

        it('displays zero average when no plans exist', async () => {
          (daysWithMeals as Mock).mockReturnValue(0);
          (multiDayMealPlanNutrients as Mock).mockReturnValue({
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
            sodium: 0,
          });
          wrapper = mountPage();
          await flushPromises();
          const card = wrapper.findAllComponents(components.VCard)[0]!;
          const text = card.findComponent(components.VCardText);
          expect(text.text()).toContain('Average Calories: 0');
          expect(text.text()).toContain('Average Protein: 0g');
          expect(text.text()).toContain('Average Carbs: 0g');
        });
      });
    });

    describe('next week', () => {
      it('is the second card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const title = weekCards[1]?.findComponent(components.VCardTitle);
        const subTitle = weekCards[1]?.findComponent(components.VCardSubtitle);
        expect(title?.text()).toBe('Next Week (Planning)');
        expect(subTitle?.text()).toBe('12/29/2025 - 1/4/2026');
      });

      it('navigates to the week details for next week', async () => {
        const router = useRouter();
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const nextWeekCard = weekCards[1]!;
        await nextWeekCard.trigger('click');
        expect(router.push).toHaveBeenCalledExactlyOnceWith({
          path: 'planning/week',
          query: { dt: '2025-12-29' },
        });
      });
    });

    describe('previous weeks', () => {
      it('are in the correct order', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const titles = weekCards.slice(2).map((card) => card.findComponent(components.VCardTitle).text());
        const subTitles = weekCards.slice(2).map((card) => card.findComponent(components.VCardSubtitle).text());
        expect(titles).toEqual(['Weeks Ago: 1', 'Weeks Ago: 2', 'Weeks Ago: 3', 'Weeks Ago: 4']);
        expect(subTitles).toEqual([
          '12/15/2025 - 12/21/2025',
          '12/8/2025 - 12/14/2025',
          '12/1/2025 - 12/7/2025',
          '11/24/2025 - 11/30/2025',
        ]);
      });

      it('navigates to the week page', async () => {
        const router = useRouter();
        wrapper = mountPage();
        const targetDates = ['2025-12-15', '2025-12-08', '2025-12-01', '2025-11-24'];
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        for (let i = 2; i < weekCards.length; i++) {
          const weekCard = weekCards[i]!;
          await weekCard.trigger('click');
          expect(router.push).toHaveBeenCalledWith({
            path: 'planning/week',
            query: { dt: targetDates[i - 2] },
          });
        }
      });
    });

    describe('data fetching', () => {
      it('calls useMealPlansData', async () => {
        wrapper = mountPage();
        await flushPromises();
        expect(useMealPlansData).toHaveBeenCalled();
      });

      it('fetches exactly 6 meal plans', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledTimes(6);
      });

      it('fetches meal plans for this week', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-22', '2025-12-28');
      });

      it('fetches meal plans for next week', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-29', '2026-01-04');
      });

      it('fetches meal plans for all four previous weeks', async () => {
        const { getMealPlansForPeriod } = useMealPlansData();
        wrapper = mountPage();
        await flushPromises();
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-15', '2025-12-21');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-08', '2025-12-14');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-12-01', '2025-12-07');
        expect(getMealPlansForPeriod).toHaveBeenCalledWith('2025-11-24', '2025-11-30');
      });
    });
  });
});
