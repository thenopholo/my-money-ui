type CardBrand = "visa" | "mastercard" | "elo" | "amex" | "hipercard" | "unknown";

const bankColors: Record<string, string> = {
  nubank: "#820AD1",
  itau: "#EC7000",
  "itaú": "#EC7000",
  bradesco: "#CC092F",
  santander: "#EC0000",
  bb: "#FFEF00",
  "banco do brasil": "#FFEF00",
  caixa: "#005CA9",
  inter: "#FF7A00",
  c6: "#1A1A1A",
  btg: "#003862",
  xp: "#1E1E1E",
  neon: "#00E5FF",
  picpay: "#21C25E",
  pan: "#0066FF",
  next: "#00E676",
};

const FALLBACK_COLOR = "#3a3a4a";

const brandKeywords: Record<CardBrand, string[]> = {
  visa: ["visa"],
  mastercard: ["mastercard", "master"],
  elo: ["elo"],
  amex: ["amex", "american express"],
  hipercard: ["hipercard", "hiper"],
  unknown: [],
};

const brandDisplayNames: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  elo: "Elo",
  amex: "Amex",
  hipercard: "Hipercard",
  unknown: "",
};

export function detectBankColor(cardName: string): string {
  const lower = cardName.toLowerCase();
  for (const [keyword, color] of Object.entries(bankColors)) {
    if (lower.includes(keyword)) {
      return color;
    }
  }
  return FALLBACK_COLOR;
}

export function detectCardBrand(cardName: string): CardBrand {
  const lower = cardName.toLowerCase();
  for (const [brand, keywords] of Object.entries(brandKeywords)) {
    if (brand === "unknown") continue;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return brand as CardBrand;
      }
    }
  }
  return "unknown";
}

export function getBrandDisplayName(brand: CardBrand): string {
  return brandDisplayNames[brand];
}

export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(2.55 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export type { CardBrand };
