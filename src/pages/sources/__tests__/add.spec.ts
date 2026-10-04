import SourceEditor from '@/components/sources/SourceEditor.vue';
import { useSourcesData } from '@/data/sources.ts';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AddPage from '../add.vue';

vi.mock('@/data/sources');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(AddPage, { global: { plugins: [vuetify] } });

describe('Source Add Page', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ replace: vi.fn() });
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

  describe('on cancel', () => {
    it('does not create a new source', async () => {
      const { addSource } = useSourcesData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('cancel');
      expect(addSource).not.toHaveBeenCalled();
    });

    it('navigates to the source list page', () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('cancel');
      expect(replace).toHaveBeenCalledExactlyOnceWith('/sources');
    });
  });

  describe('on save', () => {
    it('creates a new source', async () => {
      const { addSource } = useSourcesData();
      wrapper = mountPage();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('save', { id: undefined, name: 'Somewhere Else' });
      expect(addSource).toHaveBeenCalledExactlyOnceWith({ name: 'Somewhere Else' });
    });

    it('navigates to the source list page', async () => {
      const { replace } = useRouter();
      wrapper = mountPage();
      const editor = wrapper.findComponent(SourceEditor);
      editor.vm.$emit('save', { id: undefined, name: 'Somewhere Else' });
      await flushPromises();
      expect(replace).toHaveBeenCalledExactlyOnceWith('/sources');
    });
  });
});
