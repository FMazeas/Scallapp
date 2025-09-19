// screens/DashboardRealEstate.tsx
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { getRealEstateData } from "../../data/realEstate";
import { useSession } from "../navigation/AppNavigator";
import { COLORS, formatCurrencyEUR, formatPct } from "../utils/format";
import DashboardBase from "./DashboardBase";

type AnyRouteParams = { login?: string };
type AnyRoutesMap = Record<string, AnyRouteParams>;

export default function DashboardRealEstate() {
  const route = useRoute<RouteProp<AnyRoutesMap, string>>();
  const { login } = useSession();    
  const username = login;

  const d = getRealEstateData(username);

  const kpis = [
    {
      label: "Valeur immobilière",
      value: formatCurrencyEUR(d.patrimoine),
      delta: formatPct(d.deltaPatrimoinePct),
      deltaColor: d.deltaPatrimoinePct >= 0 ? COLORS.green : COLORS.red,
    },
    {
      label: "Performance YTD",
      value: formatPct(d.perfYtdPct),
      sublabel: "Appréciation + loyers nets",
      deltaColor: d.perfYtdPct >= 0 ? COLORS.green : COLORS.red,
    },
  ];

  const allocation = d.allocation.map((a) => ({
    label: a.label,
    value: a.value,
    color: COLORS.donutRealEstate[a.label as keyof typeof COLORS.donutRealEstate] ?? "#888",
  }));

  const positions = d.positions.map((p) => ({
    id: p.id,
    name: p.name,
    amount: formatCurrencyEUR(p.amount),
    perf: formatPct(p.perfYtdPct),
    assetClass: p.assetClass,
    assetColor: COLORS.donutRealEstate[p.assetClass as keyof typeof COLORS.donutRealEstate] ?? "#aaa",
  }));

  return (
    <DashboardBase
      username={username}
      title="Espace immobilier"
      kpis={kpis}
      cashLabel="Trésorerie immobilière"
      cashValue={formatCurrencyEUR(d.cash)}
      allocation={allocation}
      positions={positions}
    />
  );
}
