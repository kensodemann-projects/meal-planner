import {
  unitsOfMeasure,
  type AutcompleteOptionDivider,
  type AutocompleteOption,
  type AutocompleteOptionSubheader,
} from '@meal-planner/common';

export const unitOfMeasureOptions: Array<AutocompleteOption | AutcompleteOptionDivider | AutocompleteOptionSubheader> =
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
