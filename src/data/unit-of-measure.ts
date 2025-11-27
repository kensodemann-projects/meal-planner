import type { AutocompleteOption, AutocompleteOptionDivider, AutocompleteOptionSubheader } from '@/models/option';
import { unitsOfMeasure } from '@/models/unit-of-measure';

export const unitOfMeasureOptions: Array<AutocompleteOption | AutocompleteOptionDivider | AutocompleteOptionSubheader> =
  [
    { type: 'subheader', title: 'Volume' },
    ...unitsOfMeasure.filter((x) => x.type === 'volume').map((x) => ({ title: x.name, value: x.id })),
    { type: 'divider' },
    { type: 'subheader', title: 'Weight' },
    ...unitsOfMeasure.filter((x) => x.type === 'weight').map((x) => ({ title: x.name, value: x.id })),
    { type: 'divider' },
    { type: 'subheader', title: 'Quantity' },
    ...unitsOfMeasure.filter((x) => x.type === 'quantity').map((x) => ({ title: x.name, value: x.id })),
  ];
