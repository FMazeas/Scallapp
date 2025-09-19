// data/finance.ts

export function getFinanceData(login: string) {
  if (login === "Raphaël") {
    return {
      patrimoine: 30_858_741,
      deltaPatrimoinePct: 0.0069,
      perfYtdPct: 0.012,
      cash: 7_714_685,
      allocation: [
        { label: "Actions", value: 16 },
        { label: "Obligations", value: 13 },
        { label: "Private Markets", value: 10 },
        { label: "Produits Structurés", value: 18 },
        { label: "Fonds Monétaire", value: 17 },
        { label: "Liquidités", value: 26 },
      ],
      positions: [
        {
          id: "1",
          name: "BROADCOM INC",
          amount: 146874,
          perfYtdPct: 0.2842,
          assetClass: "Actions",
        },
        {
          id: "2",
          name: "Wellington US Eq Large Cap Core VF Sicav Shs I-USD-",
          amount: 220111,
          perfYtdPct: 0.0746,
          assetClass: "Actions",
        },
        {
          id: "3",
          name: "ABEILLE 6,25%22-090933",
          amount: 120689,
          perfYtdPct: 0.033,
          assetClass: "Obligations",
        },
        {
        id: "4",
        name: "GRAND CANYON",
        amount: 136116,
        perfYtdPct: 0.0165,
        assetClass: "Actions",
        },
        {
        id: "5",
        name: "5.5 % CA REVERSE CONVERTIBLEON 10Y EUR CMS 2024-29.12.2034 - Capital guaranteed",
        amount: 1030055,
        perfYtdPct: 0.0,
        assetClass: "Produits Structurés",
        },
        {
        id: "6",
        name: "ELI LILLY & CO",
        amount: 136804,
        perfYtdPct: -0.0016,
        assetClass: "Actions",
        },
        {
        id: "7",
        name: "AIR LIQUIDE",
        amount: 88173,
        perfYtdPct: -0.0419,
        assetClass: "Actions",
        },
      ],
    };
  } else {
    return {
      patrimoine: 8_765_432.1,
      deltaPatrimoinePct: 0.012,
      perfYtdPct: 0.038,
      cash: 432_100.55,
      allocation: [
        { label: "Actions", value: 40 },
        { label: "Obligations", value: 30 },
        { label: "Private Markets", value: 20 },
        { label: "Liquidités", value: 10 },
      ],
      positions: [
        {
          id: "1",
          name: "S&P500 ETF",
          amount: 2_000_000,
          perfYtdPct: 0.034,
          assetClass: "Actions",
        },
        {
          id: "2",
          name: "Euro HY Bonds",
          amount: 500_000,
          perfYtdPct: 0.012,
          assetClass: "Obligations",
        },
      ],
    };
  }
}
