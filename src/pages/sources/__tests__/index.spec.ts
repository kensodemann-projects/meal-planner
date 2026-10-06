import ConfirmDialog from '@/components/core/ConfirmDialog.vue';
import NotificationDialog from '@/components/core/NotificationDialog.vue';
import { TEST_RECIPES, TEST_SOURCES } from '@/data/__tests__/test-data.ts';
import { useRecipesData } from '@/data/recipes';
import { GENERIC_RESTAURANT_SOURCE_ID, useSourcesData } from '@/data/sources';
import type { Recipe } from '@/models/recipe';
import type { Source } from '@/models/source';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import IndexPage from '../index.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');
vi.mock('@/data/sources');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(IndexPage, { global: { plugins: [vuetify] } });

describe('Sources List Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      push: vi.fn(),
    });
    const { loading: recipesLoading, error: recipesError, recipes } = useRecipesData();
    const { loading: sourcesLoading, sources } = useSourcesData();
    (recipes.value as Recipe[]) = TEST_RECIPES;
    (recipesError as Ref<Error | null>).value = null;
    (recipesLoading as Ref<boolean>).value = false;
    (sources.value as Source[]) = TEST_SOURCES;
    (sourcesLoading as Ref<boolean>).value = false;
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

  it('has a title', () => {
    wrapper = mountPage();
    expect(wrapper.find('h1').text()).toBe('Sources for Recipes');
  });

  it('shows a loading indicator while sources are being fetched', () => {
    const { loading } = useSourcesData();
    (loading as Ref<boolean>).value = true;
    wrapper = mountPage();
    expect(wrapper.findComponent(components.VProgressCircular).exists()).toBe(true);
    expect(wrapper.findComponent(components.VList).exists()).toBe(false);
  });

  it('shows a loading indicator while recipes are being fetched', () => {
    const { loading } = useRecipesData();
    (loading as Ref<boolean>).value = true;
    wrapper = mountPage();
    expect(wrapper.findComponent(components.VProgressCircular).exists()).toBe(true);
    expect(wrapper.findComponent(components.VList).exists()).toBe(false);
  });

  it('hides the loading indicator once sources have loaded', () => {
    wrapper = mountPage();
    expect(wrapper.findComponent(components.VProgressCircular).exists()).toBe(false);
    expect(wrapper.findComponent(components.VList).exists()).toBe(true);
  });

  it('displays each source', () => {
    wrapper = mountPage();
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(TEST_SOURCES.length);
    for (let i = 0; i < TEST_SOURCES.length; i++) {
      expect(items[i].text()).toBe(TEST_SOURCES[i].name);
    }
  });

  it('navigates to the given source on click', () => {
    const router = useRouter();
    wrapper = mountPage();
    const items = wrapper.findAllComponents(components.VListItem);
    items[2].trigger('click');
    expect(router.push).toHaveBeenCalledExactlyOnceWith(`/sources/${TEST_SOURCES[2].id}/update`);
  });

  describe('delete button', () => {
    it('renders unless the source is the generic restaurant', () => {
      wrapper = mountPage();
      const items = wrapper.findAllComponents(components.VListItem);
      for (let i = 0; i < TEST_SOURCES.length; i++) {
        expect(items[i].findComponent(components.VIcon).exists()).toBe(
          TEST_SOURCES[i].id !== GENERIC_RESTAURANT_SOURCE_ID,
        );
      }
    });

    it('does not render the delete button if recipes fail to load', () => {
      const { error } = useRecipesData();
      (error as Ref<Error | null>).value = new Error('failed to load recipes');
      wrapper = mountPage();
      const items = wrapper.findAllComponents(components.VListItem);
      expect(items[0].findComponent(components.VIcon).exists()).toBe(false);
    });

    const unusedSourceIndex = TEST_SOURCES.findIndex(
      (source) =>
        source.id !== GENERIC_RESTAURANT_SOURCE_ID && TEST_RECIPES.every((recipe) => recipe.sourceId !== source.id),
    );

    it('confirms the delete with the user', async () => {
      wrapper = mountPage();
      const items = wrapper.findAllComponents(components.VListItem);
      const button = items[unusedSourceIndex].findComponent(components.VIcon);
      await button.trigger('click');
      const confirmDialog = wrapper.findComponent(ConfirmDialog);
      expect(confirmDialog.exists()).toBe(true);
    });

    describe('when the source is used in a recipe', () => {
      const usedSourceIndex = TEST_SOURCES.findIndex(
        (source) =>
          source.id !== GENERIC_RESTAURANT_SOURCE_ID && TEST_RECIPES.some((recipe) => recipe.sourceId === source.id),
      );

      it('displays a notification and does not display the confirmation dialog', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[usedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        await flushPromises();
        expect(wrapper.findComponent(NotificationDialog).exists()).toBe(true);
        expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(false);
      });

      it('does not delete the source after the notification is dismissed', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[usedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        wrapper.findComponent(NotificationDialog).vm.$emit('confirm');
        await flushPromises();
        const { removeSource } = useSourcesData();
        expect(removeSource).not.toHaveBeenCalled();
      });
    });

    it('does not display a notification when the source is not used', async () => {
      wrapper = mountPage();
      const items = wrapper.findAllComponents(components.VListItem);
      const button = items[unusedSourceIndex].findComponent(components.VIcon);
      await button.trigger('click');
      await flushPromises();
      expect(wrapper.findComponent(NotificationDialog).exists()).toBe(false);
    });

    describe('on confirm', () => {
      it('removes the source', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[unusedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('confirm');
        const { removeSource } = useSourcesData();
        expect(removeSource).toHaveBeenCalledExactlyOnceWith(TEST_SOURCES[unusedSourceIndex].id);
      });

      it('hides the confirm dialog', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[unusedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('confirm');
        await flushPromises();
        expect(wrapper.findComponent(ConfirmDialog).isVisible()).toBe(false);
      });
    });

    describe('on cancel', () => {
      it('does not remove the recipe', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[unusedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('cancel');
        const { removeSource } = useSourcesData();
        expect(removeSource).not.toHaveBeenCalled();
      });

      it('hides the confirm dialog', async () => {
        wrapper = mountPage();
        const items = wrapper.findAllComponents(components.VListItem);
        const button = items[unusedSourceIndex].findComponent(components.VIcon);
        await button.trigger('click');
        const confirmDialog = wrapper.findComponent(ConfirmDialog);
        confirmDialog.vm.$emit('cancel');
        await flushPromises();
        expect(wrapper.findComponent(ConfirmDialog).isVisible()).toBe(false);
      });
    });
  });

  describe('add button', () => {
    it('navigates to the source add page', () => {
      const router = useRouter();
      wrapper = mountPage();
      const addButton = wrapper.findComponent(components.VFab);
      addButton.trigger('click');
      expect(router.push).toHaveBeenCalledExactlyOnceWith('/sources/add');
    });
  });

  describe('recipes error message', () => {
    const message = 'Recipes have failed to load, deletion of sources is disabled';

    it('is displayed when recipes fail to load', () => {
      const { error } = useRecipesData();
      (error as Ref<Error | null>).value = new Error('failed to load recipes');
      wrapper = mountPage();
      expect(wrapper.text()).toContain(message);
    });

    it('is not displayed when there is no recipes error', () => {
      wrapper = mountPage();
      expect(wrapper.text()).not.toContain(message);
    });
  });

  describe('empty state message', () => {
    it('is displayed when there are no sources and not loading', () => {
      const { sources } = useSourcesData();
      sources.value = [];
      wrapper = mountPage();
      expect(wrapper.findComponent(components.VList).exists()).toBe(false);
      expect(wrapper.find('h2').text()).toBe('No sources found');
    });

    it('is not displayed when loading', () => {
      const { loading, sources } = useSourcesData();
      sources.value = [];
      (loading as Ref<boolean>).value = true;
      wrapper = mountPage();
      expect(wrapper.findComponent(components.VList).exists()).toBe(false);
      expect(wrapper.find('h2').exists()).toBe(false);
    });

    it('is not displayed when sources exist', () => {
      wrapper = mountPage();
      expect(wrapper.find('h2').exists()).toBe(false);
    });
  });
});
