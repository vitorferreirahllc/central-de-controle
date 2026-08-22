export const CLIENTS = [
  "From Brazil",
  "Zaatar",
  "H SPOT | Picollo Pizza",
  "Sagrado Café",
  "K'Delícia",
  "DaToni Pronto",
  "Empório Brazilian Grill",
  "That's Bananas",
] as const;

export type ClientName = (typeof CLIENTS)[number];
