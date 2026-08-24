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

// Nem todo cliente usa todo serviço — essas listas definem quem aparece em cada
// seção do sistema. Semana do Projeto e Saúde do Cliente continuam mostrando todos.
export const DELIVERY_CLIENTS: string[] = [
  "Zaatar",
  "Sagrado Café",
  "From Brazil",
  "Empório Brazilian Grill",
];

export const META_ADS_CLIENTS: string[] = [
  "From Brazil",
  "Zaatar",
  "Empório Brazilian Grill",
];
