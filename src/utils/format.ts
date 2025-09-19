// utils/format.ts
export const COLORS = {
  green: "#22c55e",
  red: "#ef4444",

  donutFinance: {
    Actions: "#FFBA00",
    Obligations: "#397BF7",
    "Private Markets": "#11D100",
    "Produits Structurés": "#AE3DDB",
    "Fonds Monétaire": "#FA2A2A",
    Liquidités: "#6DDAF2",
  },

  donutRealEstate: {
    Personnel: "#FFBA00",
    Locatif: "#397BF7",
    Investissement: "#11D100",
    Liquidités: "#AE3DDB",
  },
};

export function formatCurrencyEUR(value: number): string {
  return value
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .replace(".", ",") + " €";
}

export function formatPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${(pct * 100).toFixed(2)} %`;
}
