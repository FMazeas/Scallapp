// screens/DashboardFinance.tsx
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { getFinanceData } from "../../data/finance";
import { useSession } from "../navigation/AppNavigator";
import { COLORS, formatCurrencyEUR, formatPct } from "../utils/format";
import DashboardBase from "./DashboardBase";

type AnyRouteParams = { login?: string };
type AnyRoutesMap = Record<string, AnyRouteParams>;

export default function DashboardFinance() {
  const route = useRoute<RouteProp<AnyRoutesMap, string>>();
  const { login } = useSession();    
  const username = login;

  

  const d = getFinanceData(username);

  const kpis = [
    {
      label: "Patrimoine actualisé",
      value: formatCurrencyEUR(d.patrimoine),
      delta: formatPct(d.deltaPatrimoinePct),
      deltaColor: d.deltaPatrimoinePct >= 0 ? COLORS.green : COLORS.red,
    },
    {
      label: "Performance YTD",
      value: formatPct(d.perfYtdPct),
      sublabel: "Depuis le 1ᵉʳ janvier",
      deltaColor: d.perfYtdPct >= 0 ? COLORS.green : COLORS.red,
    },
  ];

  const allocation = d.allocation.map((a) => ({
    label: a.label,
    value: a.value,
    color: COLORS.donutFinance[a.label as keyof typeof COLORS.donutFinance] ?? "#888",

  }));

  const positions = d.positions.map((p) => ({
    id: p.id,
    name: p.name,
    amount: formatCurrencyEUR(p.amount),
    perf: formatPct(p.perfYtdPct),
    assetClass: p.assetClass,
    assetColor: COLORS.donutFinance[p.assetClass as keyof typeof COLORS.donutFinance] ?? "#aaa",
  }));

  return (
    <DashboardBase
      username={username}
      title="Espace financier"
      kpis={kpis}
      cashLabel="Liquidités (disponible immédiatement)"
      cashValue={formatCurrencyEUR(d.cash)}
      allocation={allocation}
      positions={positions}
    />
  );
}
