// data/realEstate.ts

export function getRealEstateData(login: string) {
  // Tu peux ajuster les valeurs par utilisateur ici
  if (login === "Raphaël") {
    return {
      patrimoine: 26_901_000,            // Valeur totale du parc immo (€)
      deltaPatrimoinePct: 0.0042,       
      perfYtdPct: 0.082,                
      cash: 64_452,                    // Trésorerie liée à l’immo (€)
      allocation: [
        { label: "Personnel", value: 48 },
        { label: "Locatif", value: 36 },
        { label: "Investissement", value: 12 },
        { label: "Liquidités", value: 4 },
      ],
      positions: [
        { id: "p1", name: "Madrid (RP)", amount: 12_000_000, perfYtdPct: 0.0038, assetClass: "Personnel" },
        { id: "p2", name: "Mérignies", amount: 2_351_000, perfYtdPct: 0.0010, assetClass: "Locatif" },
        { id: "p3", name: "PF GRAND PARIS", amount: 1_351_667, perfYtdPct: 0.016, assetClass: "Investissement" },
        { id: "p4", name: "EPARGNE PIERRE", amount: 708_579, perfYtdPct: 0.023, assetClass: "Investissement" },
        { id: "p5", name: "Charles V", amount: 610_000, perfYtdPct: 0.0036,    assetClass: "Locatif" },
        { id: "p6", name: "Lepic", amount: 560_000, perfYtdPct: 0.0016,    assetClass: "Locatif" },
        { id: "p7", name: "Clodion", amount: 440_100, perfYtdPct: 0.0025,    assetClass: "Locatif" },
      ],
    };
  } else {
    return {
      patrimoine: 3_420_000,
      deltaPatrimoinePct: -0.0035,      // -0.35 %
      perfYtdPct: 0.026,                // +2.60 %
      cash: 28_700.0,
      allocation: [
        { label: "Résidentiel", value: 50 },
        { label: "Commercial", value: 30 },
        { label: "Foncier", value: 12 },
        { label: "Liquidités", value: 8 },
      ],
      positions: [
        { id: "p1", name: "Immeuble Marseille", amount: 1_450_000, perfYtdPct: 0.029, assetClass: "Résidentiel" },
        { id: "p2", name: "Local Nice Centre", amount: 780_000,   perfYtdPct: 0.021, assetClass: "Commercial" },
        { id: "p3", name: "Terrain Toulouse",   amount: 220_000,  perfYtdPct: 0.007, assetClass: "Foncier" },
        { id: "p4", name: "Cash Immo",          amount: 28_700,   perfYtdPct: 0.0,   assetClass: "Liquidités" },
      ],
    };
  }
}
