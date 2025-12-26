import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';
import { useSettingsData } from '@/data/settings';
import { useRouter } from 'vue-router';

vi.mock('@/data/settings');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Planning', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-25'));
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
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
      it('is the second card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const title = weekCards[1]?.findComponent(components.VCardTitle);
        const subTitle = weekCards[1]?.findComponent(components.VCardSubtitle);
        expect(title?.text()).toBe('This Week');
        expect(subTitle?.text()).toBe('12/22/2025 - 12/28/2025');
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
          query: { dt: '2025-12-22' },
        });
      });
    });

    describe('next week', () => {
      it('is the first card', async () => {
        wrapper = mountPage();
        await flushPromises();
        const weekCards = wrapper.findAllComponents(components.VCard);
        const title = weekCards[0]?.findComponent(components.VCardTitle);
        const subTitle = weekCards[0]?.findComponent(components.VCardSubtitle);
        expect(title?.text()).toBe('Next Week (Planning)');
        expect(subTitle?.text()).toBe('12/29/2025 - 1/4/2026');
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
          query: { dt: '2025-12-29' },
        });
      });
    });
  });
});
