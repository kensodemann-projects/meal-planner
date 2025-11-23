export interface AutocompleteOption {
  value: string | number;
  title: string;
}

export interface AutocompleteOptionDivider {
  type: 'divider';
  text?: string;
}

export interface AutocompleteOptionSubheader {
  type: 'subheader';
  title: string;
}
