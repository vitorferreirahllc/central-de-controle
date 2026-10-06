export const HQ_TIMEZONE = "America/Sao_Paulo";

export type OperationTimezone = {
  name: string;
  city: string;
  region: string;
  country: "Estados Unidos" | "Canadá";
  flag: string;
  timezone: string;
  units?: { label: string; city: string; region: string }[];
};

export const OPERATIONS_TIMEZONES: OperationTimezone[] = [
  { name: "O Rei Da Picanha", city: "Philadelphia", region: "PA", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "Sagrado Cafe", city: "Miami", region: "FL", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "Summer House Cafe", city: "Hyannis", region: "MA", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "Temak House Orlando", city: "Orlando", region: "FL", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "Touken Sushi", city: "Orlando", region: "FL", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York", units: [{ label: "Hunters Creek", city: "Orlando", region: "FL" }, { label: "Ocoee", city: "Ocoee", region: "FL" }] },
  { name: "Zaatar Grill & Pizza", city: "Winter Garden", region: "FL", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "From Brazil Restaurant", city: "Peabody", region: "MA", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/New_York" },
  { name: "That's Bananas", city: "Nepean", region: "ON", country: "Canadá", flag: "🇨🇦", timezone: "America/Toronto" },
  { name: "Emporio Brazilian Grill", city: "Houston", region: "TX", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/Chicago" },
  { name: "Flauzino", city: "California", region: "CA", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/Los_Angeles" },
  { name: "Piroshky & Crepes European Bakery & Cafe", city: "Everett", region: "WA", country: "Estados Unidos", flag: "🇺🇸", timezone: "America/Los_Angeles" },
];

/** Offset UTC atual (em minutos) de um timezone IANA, já considerando DST. */
export function getUtcOffsetMinutes(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const match = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = match[3] ? Number(match[3]) : 0;
  return sign * (hours * 60 + minutes);
}

export function formatLocalTime(timeZone: string, date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatUtcLabel(offsetMinutes: number): string {
  const hours = offsetMinutes / 60;
  const sign = hours >= 0 ? "+" : "−";
  return `UTC${sign}${Math.abs(hours)}`;
}

export function formatDiffLabel(diffMinutes: number): string {
  if (diffMinutes === 0) return "Mesmo horário de Brasília";
  const hours = Math.abs(diffMinutes) / 60;
  const hoursLabel = hours === 1 ? "1h" : `${hours}h`;
  return diffMinutes < 0
    ? `${hoursLabel} atrás de Brasília`
    : `${hoursLabel} à frente de Brasília`;
}

export function formatDiffBadge(diffMinutes: number): string {
  if (diffMinutes === 0) return "Brasília";
  const hours = Math.abs(diffMinutes) / 60;
  const sign = diffMinutes < 0 ? "−" : "+";
  return `${sign}${hours}h Brasília`;
}
