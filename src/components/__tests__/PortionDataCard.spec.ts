import { TEST_PORTION } from '@/data/__tests__/test-data';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import PortionData from '../PortionData.vue';
import PortionDataCard from '../PortionDataCard.vue';
import ModifyButton from '../buttons/ModifyButton.vue';
import DeleteButton from '../buttons/DeleteButton.vue';

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () => mount(PortionDataCard, { props: { value: TEST_PORTION }, global: { plugins: [vuetify] } });

describe('Portion Data Card', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('embeds portion data in a card', () => {
    const card = wrapper.findComponent(components.VCard);
    expect(card.exists()).toBe(true);
    const contents = card.findComponent(components.VCardText);
    expect(contents.exists()).toBe(true);
    const data = contents.findComponent(PortionData);
    expect(data.exists()).toBe(true);
  });

  it('emits modify', async () => {
    const button = wrapper.findComponent(ModifyButton);
    await button.trigger('click');
    expect(wrapper.emitted('modify')).toBeTruthy();
    expect(wrapper.emitted('modify')?.length).toBe(1);
  });

  it('emits delete', async () => {
    const button = wrapper.findComponent(DeleteButton);
    await button.trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')?.length).toBe(1);
  });
});
