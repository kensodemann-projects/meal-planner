export interface AutocompleteOption {
  value: string | number;
  title: string;
}

export interface AutcompleteOptionDivider {
  type: 'divider';
  text?: string;
}

export interface AutocompleteOptionSubheader {
  type: 'subheader';
  title: string;
}
