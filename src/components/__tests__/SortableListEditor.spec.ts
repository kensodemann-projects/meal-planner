import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SortableListEditor from '../SortableListEditor.vue';

interface TestItem {
  id: string;
  value: string;
}

describe('SortableListEditor', () => {
  let vuetify: ReturnType<typeof createVuetify>;
  let wrapper: VueWrapper<any>;

  const defaultProps = {
    modelValue: [] as TestItem[],
    title: 'Test Items',
    validateItem: (item: TestItem) => !!item.value.trim(),
    createItem: () => ({ id: globalThis.crypto.randomUUID(), value: '' }),
    testIdPrefix: 'test-item',
  };

  beforeEach(() => {
    vuetify = createVuetify({ components, directives });
  });

  const mountComponent = (props = {}) => {
    return mount(SortableListEditor, {
      props: { ...defaultProps, ...props } as any,
      global: {
        plugins: [vuetify],
        stubs: {
          draggable: {
            name: 'draggable',
            template: `
              <div class="draggable-stub" :class="$attrs.class">
                <div v-for="(item, index) in modelValue" :key="item[itemKey]">
                  <slot name="item" :element="item" :index="index" />
                </div>
              </div>
            `,
            props: ['modelValue', 'itemKey', 'disabled', 'handle'],
          },
        },
      },
      slots: {
        item: `<template #item="{ item, onChange, onDelete }">
          <div class="test-item">
            <input :value="item.value" @input="(e) => onChange({ ...item, value: e.target.value })" />
            <button @click="onDelete">Delete</button>
          </div>
        </template>`,
      },
    });
  };

  it('renders the title', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain('Test Items');
  });

  it('renders add button with correct test id', () => {
    wrapper = mountComponent();
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');
    expect(addButton.exists()).toBe(true);
  });

  it('disables add button when there are invalid items', () => {
    const items: TestItem[] = [
      { id: '1', value: '' }, // Invalid item
    ];
    wrapper = mountComponent({ modelValue: items });
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');
    expect(addButton.attributes('disabled')).toBeDefined();
  });

  it('enables add button when all items are valid', () => {
    const items: TestItem[] = [{ id: '1', value: 'Valid' }];
    wrapper = mountComponent({ modelValue: items });
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');
    expect(addButton.attributes('disabled')).toBeUndefined();
  });

  it('enables add button when list is empty', () => {
    wrapper = mountComponent({ modelValue: [] });
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');
    expect(addButton.attributes('disabled')).toBeUndefined();
  });

  it('adds a new item when add button is clicked', async () => {
    wrapper = mountComponent();
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');

    await addButton.trigger('click');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    const emittedValue = emitted?.[0]?.[0] as TestItem[];
    expect(emittedValue).toHaveLength(1);
    expect(emittedValue?.[0]).toHaveProperty('id');
    expect(emittedValue?.[0]).toHaveProperty('value', '');
  });

  it('emits list-modified when item is added', async () => {
    wrapper = mountComponent();
    const addButton = wrapper.find('[data-testid="add-test-item-button"]');

    await addButton.trigger('click');

    expect(wrapper.emitted('list-modified')).toBeTruthy();
  });

  it('renders items using the slot', () => {
    const items: TestItem[] = [
      { id: '1', value: 'First' },
      { id: '2', value: 'Second' },
    ];
    wrapper = mountComponent({ modelValue: items });

    const testItems = wrapper.findAll('.test-item');
    expect(testItems).toHaveLength(2);
  });

  it('updates item when onChange is called from slot', async () => {
    const items: TestItem[] = [{ id: '1', value: 'Original' }];
    wrapper = mountComponent({ modelValue: items });

    const input = wrapper.find('input');
    await input.setValue('Updated');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    const emittedValue = emitted?.[0]?.[0] as TestItem[];
    expect(emittedValue?.[0]?.value).toBe('Updated');
    expect(wrapper.emitted('list-modified')).toBeTruthy();
  });

  it('deletes item when onDelete is called from slot', async () => {
    const items: TestItem[] = [
      { id: '1', value: 'First' },
      { id: '2', value: 'Second' },
    ];
    wrapper = mountComponent({ modelValue: items });

    const deleteButton = wrapper.findAll('button').find((btn) => btn.text() === 'Delete');
    await deleteButton!.trigger('click');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    const emittedValue = emitted?.[0]?.[0] as TestItem[];
    expect(emittedValue).toHaveLength(1);
    expect(emittedValue?.[0]?.id).toBe('2');
    expect(wrapper.emitted('list-modified')).toBeTruthy();
  });

  it('shows drag handle when sortable is true', () => {
    const items: TestItem[] = [{ id: '1', value: 'First' }];
    wrapper = mountComponent({ modelValue: items, sortable: true });

    const dragHandle = wrapper.find('.drag-handle');
    expect(dragHandle.exists()).toBe(true);
  });

  it('hides drag handle when sortable is false', () => {
    const items: TestItem[] = [{ id: '1', value: 'First' }];
    wrapper = mountComponent({ modelValue: items, sortable: false });

    const dragHandle = wrapper.find('.drag-handle');
    expect(dragHandle.exists()).toBe(false);
  });

  it('uses custom list class when provided', () => {
    wrapper = mountComponent({ listClass: 'custom-list-class' });

    const draggable = wrapper.find('[class*="custom-list-class"]');
    expect(draggable.exists()).toBe(true);
  });

  it('preserves item IDs when updating', async () => {
    const items: TestItem[] = [{ id: 'original-id', value: 'Original' }];
    wrapper = mountComponent({ modelValue: items });

    const input = wrapper.find('input');
    await input.setValue('Updated');

    const emitted = wrapper.emitted('update:modelValue');
    const emittedValue = emitted?.[0]?.[0] as TestItem[];
    expect(emittedValue?.[0]?.id).toBe('original-id');
  });
});
