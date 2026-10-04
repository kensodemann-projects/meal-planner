import SourceEditor from '@/components/sources/SourceEditor.vue';
import { TEST_SOURCES } from '@/data/__tests__/test-data';
import { useSourcesData } from '@/data/sources.ts';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import UpdatePage from '../update.vue';

vi.mock('@/data/sources');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(UpdatePage, { global: { plugins: [vuetify] } });

const SOURCE_ID = TEST_SOURCES[1]!.id!;

describe('Source Update Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    const { getSource } = useSourcesData();
    (useRoute as Mock).mockReturnValue({ params: { id: SOURCE_ID } });
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
    (getSource as Mock).mockResolvedValue({ ...TEST_SOURCES[1]! });
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

  it('gets the source', async () => {
    const { getSource } = useSourcesData();
    wrapper = mountPage();
    await flushPromises();
    expect(getSource).toHaveBeenCalledExactlyOnceWith(SOURCE_ID);
  });

  it('renders the editor', async () => {
    wrapper = mountPage();
    await flushPromises();
    const editor = wrapper.findComponent(SourceEditor);
    expect(editor.exists()).toBe(true);
    expect(editor.props('source')).toEqual(TEST_SOURCES[1]);
  });

  describe('on cancel', () => {
    it('does not save the source', async () => {
      const { updateSource } = useSourcesData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('cancel');
      expect(updateSource).not.toHaveBeenCalled();
    });

    it('navigates to the source list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('cancel');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/sources');
    });
  });

  describe('on save', () => {
    it('saves the modified source', async () => {
      const { updateSource } = useSourcesData();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('save', { ...TEST_SOURCES[1]!, name: 'Somewhere Else' });
      await flushPromises();
      expect(updateSource).toHaveBeenCalledExactlyOnceWith(SOURCE_ID, { name: 'Somewhere Else' });
    });

    it('navigates to the source list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      await flushPromises();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('save', { ...TEST_SOURCES[1]!, name: 'Somewhere Else' });
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/sources');
    });
  });
});
