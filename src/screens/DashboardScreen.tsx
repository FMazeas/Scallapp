// DashboardScreen.tsx
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

type Position = {
  id: string;
  name: string;
  amount: number; // €
  perfYtdPct: number; // ex: 0.062 => +6.2%
  assetClass: "Actions" | "Obligations" | "Private Markets" | "Liquidités";
};

type UserData = {
  patrimoine: number;
  deltaPatrimoinePct: number;
  perfYtdPct: number;
  cash: number;
  allocation: ReadonlyArray<{ label: Position["assetClass"]; value: number }>;
  positions: Position[];
};

type RootParams = {
  Dashboard: { login: string } | undefined;
};

const ACCENT = "#7aa2ff";

const COLORS = {
  bg: "#0f1325",
  card: "#161a33",
  text: "#E9ECF5",
  sub: "#A9B1C7",
  border: "rgba(255,255,255,0.06)",
  green: "#22c55e",
  red: "#ef4444",
  donut: {
    Actions: "#6a8dff",
    Obligations: "#4ade80",
    "Private Markets": "#fbbf24",
    Liquidités: "#a78bfa",
  },
};

// Format 2 345 678,90 €
function formatCurrencyEUR(value: number): string {
  return (
    value
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",") + " €"
  );
}
function formatPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${(pct * 100).toFixed(2)} %`;
}

// Texte 1 ligne auto-réductible
const Fit = ({
  children,
  style,
  min = 0.7,
}: {
  children: React.ReactNode;
  style?: any;
  min?: number;
}) => (
  <Text
    style={style}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={min}
    allowFontScaling
  >
    {children}
  </Text>
);

// --- Données par utilisateur ---
function getUserData(login: string): UserData {
  const normalized = login.trim().toLowerCase();

  if (normalized === "dev") {
    return {
      patrimoine: 12_345_678.9,
      deltaPatrimoinePct: 0.0078,
      perfYtdPct: 0.0456,
      cash: 123_456.78,
      allocation: [
        { label: "Actions", value: 55 },
        { label: "Obligations", value: 20 },
        { label: "Private Markets", value: 15 },
        { label: "Liquidités", value: 10 },
      ],
      positions: [
        { id: "1", name: "MSCI World ETF", amount: 5_200_000, perfYtdPct: 0.062, assetClass: "Actions" },
        { id: "2", name: "Euro Gov Bonds 10Y", amount: 3_100_000, perfYtdPct: 0.021, assetClass: "Obligations" },
        { id: "3", name: "PE Secondaries Fund", amount: 2_750_000, perfYtdPct: 0.085, assetClass: "Private Markets" },
        { id: "4", name: "Money Market EUR", amount: 1_295_678.9, perfYtdPct: 0.017, assetClass: "Liquidités" },
      ],
    };
  }

  if (normalized === "test") {
    return {
      patrimoine: 2_345_678_901.23, // bien plus gros pour test
      deltaPatrimoinePct: -0.0031,
      perfYtdPct: 0.0289,
      cash: 987_654.32,
      allocation: [
        { label: "Actions", value: 42 },
        { label: "Obligations", value: 33 },
        { label: "Private Markets", value: 15 },
        { label: "Liquidités", value: 10 },
      ],
      positions: [
        { id: "1", name: "Stoxx Europe 600", amount: 820_000_000, perfYtdPct: 0.054, assetClass: "Actions" },
        { id: "2", name: "US Treasuries 5Y", amount: 380_000_000, perfYtdPct: 0.015, assetClass: "Obligations" },
        { id: "3", name: "Infra Equity Fund", amount: 210_000_000, perfYtdPct: 0.067, assetClass: "Private Markets" },
        { id: "4", name: "Cash EUR", amount: 987_654.32, perfYtdPct: 0.004, assetClass: "Liquidités" },
      ],
    };
  }

  // Fallback générique
  return {
    patrimoine: 1_234_567.89,
    deltaPatrimoinePct: 0.002,
    perfYtdPct: 0.0123,
    cash: 12_345.67,
    allocation: [
      { label: "Actions", value: 50 },
      { label: "Obligations", value: 30 },
      { label: "Private Markets", value: 10 },
      { label: "Liquidités", value: 10 },
    ],
    positions: [
      { id: "1", name: "Global Equity", amount: 520_000, perfYtdPct: 0.032, assetClass: "Actions" },
      { id: "2", name: "Euro Bonds", amount: 310_000, perfYtdPct: 0.012, assetClass: "Obligations" },
      { id: "3", name: "PE Growth Fund", amount: 275_000, perfYtdPct: 0.058, assetClass: "Private Markets" },
      { id: "4", name: "Cash EUR", amount: 129_567, perfYtdPct: 0.003, assetClass: "Liquidités" },
    ],
  };
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootParams, "Dashboard">>();
  const scheme = useColorScheme();
  const username = route.params?.login ?? "dev";

  const data = getUserData(username);
  const { patrimoine, deltaPatrimoinePct, perfYtdPct, cash, allocation, positions } = data;

  // Header natif + logout
  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Espace personnel",
      headerStyle: { backgroundColor: COLORS.bg },
      headerTintColor: COLORS.text,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleLogout}
          accessibilityLabel="Se déconnecter"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            marginRight: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Feather name="log-out" size={20} color={COLORS.red} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ----- Donut -----
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const donut = useMemo(() => {
    const size = 190;
    const strokeWidth = 22;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    const total = allocation.reduce((s, a) => s + a.value, 0);

    const segments = allocation.map((a) => {
      const frac = a.value / total;
      const length = circumference * frac;
      const seg = {
        key: a.label,
        color: COLORS.donut[a.label as keyof typeof COLORS.donut],
        dasharray: `${length} ${circumference - length}`,
        dashoffset: -offset,
      };
      offset += length;
      return seg;
    });

    return { size, strokeWidth, radius, circumference, segments };
  }, [allocation]);

  // ----- Header scrollable -----
  const Header = (
    <View style={{ padding: 16, gap: 18 }}>
      {/* Bienvenue */}
      <View>
        <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: "800", flexWrap: "wrap" }}>
          Bienvenue <Text style={{ color: ACCENT }}>{username}</Text> 👋
        </Text>
        <Text style={{ color: COLORS.sub, marginTop: 6 }}>Aperçu de votre portefeuille</Text>
      </View>

      {/* KPIs */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            minWidth: 0,
          }}
        >
          <Text style={{ color: COLORS.sub, marginBottom: 6 }}>Patrimoine actualisé</Text>
          <Fit style={{ color: COLORS.text, fontSize: 20, fontWeight: "700" }}>
            {formatCurrencyEUR(patrimoine)}
          </Fit>
          <Text
            style={{
              color: deltaPatrimoinePct >= 0 ? COLORS.green : COLORS.red,
              marginTop: 6,
              fontWeight: "600",
            }}
          >
            {formatPct(deltaPatrimoinePct)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            minWidth: 0,
          }}
        >
          <Text style={{ color: COLORS.sub, marginBottom: 6 }}>Performance YTD</Text>
          <Fit style={{ color: perfYtdPct >= 0 ? COLORS.green : COLORS.red, fontSize: 20, fontWeight: "700" }}>
            {formatPct(perfYtdPct)}
          </Fit>
          <Text style={{ color: COLORS.sub, marginTop: 6 }}>Depuis le 1ᵉʳ janvier</Text>
        </View>
      </View>

      {/* Liquidités */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: COLORS.sub, marginBottom: 6, textAlign: "center" }}>
          Liquidités (disponible immédiatement)
        </Text>
        <Fit style={{ color: COLORS.text, fontSize: 18, fontWeight: "700", textAlign: "center", maxWidth: "90%" }}>
          {formatCurrencyEUR(cash)}
        </Fit>
      </View>

      {/* Donut Allocation */}
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 14,
        }}
      >
        <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
          Allocation par classe d’actif
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <Svg width={donut.size} height={donut.size}>
            <Circle
              cx={donut.size / 2}
              cy={donut.size / 2}
              r={donut.radius}
              stroke={"#0b0e1f"}
              strokeWidth={donut.strokeWidth}
              fill="none"
            />
            {donut.segments.map((s) => (
              <Circle
                key={s.key}
                cx={donut.size / 2}
                cy={donut.size / 2}
                r={donut.radius}
                stroke={s.color}
                strokeWidth={activeSlice === s.key ? donut.strokeWidth + 2 : donut.strokeWidth}
                fill="none"
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
                strokeLinecap="butt"
                onPress={() => setActiveSlice(activeSlice === s.key ? null : s.key)}
              />
            ))}
          </Svg>

          {/* Légende */}
          <View style={{ flex: 1, gap: 8, minWidth: 0 }}>
            {allocation.map((a) => {
              const color = COLORS.donut[a.label as keyof typeof COLORS.donut];
              const isActive = activeSlice === a.label || activeSlice === null;
              return (
                <TouchableOpacity
                  key={a.label}
                  onPress={() => setActiveSlice(activeSlice === a.label ? null : a.label)}
                  activeOpacity={0.7}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 999,
                    backgroundColor: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: color,
                      }}
                    />
                    <Fit style={{ color: COLORS.text, fontWeight: "600", maxWidth: 140 }} min={0.8}>
                      {a.label}
                    </Fit>
                  </View>
                  <Text style={{ color: COLORS.text, fontWeight: "700" }}>{a.value}%</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Titre tableau */}
      <Text style={{ color: COLORS.text, fontWeight: "700", fontSize: 18, marginTop: 4 }}>
        Positions du portefeuille
      </Text>

      {/* En-têtes */}
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Text style={{ color: COLORS.sub, width: 160 }} numberOfLines={1}>
          Instrument
        </Text>
        <Text style={{ color: COLORS.sub, width: 120 }} numberOfLines={1}>
          Montant
        </Text>
        <Text style={{ color: COLORS.sub, width: 82 }} numberOfLines={1}>
          Perf. YTD
        </Text>
        <Text style={{ color: COLORS.sub, flex: 1 }} numberOfLines={1}>
          Classe d’actif
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <FlatList
        data={positions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: COLORS.border, marginLeft: 12 }} />
        )}
        renderItem={({ item }) => {
          const color = item.perfYtdPct >= 0 ? COLORS.green : COLORS.red;
          const badgeColor = COLORS.donut[item.assetClass as keyof typeof COLORS.donut];
          return (
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 12,
                paddingHorizontal: 12,
                alignItems: "center",
              }}
            >
              <Fit style={{ color: COLORS.text, width: 160 }}>{item.name}</Fit>
              <Fit style={{ color: COLORS.text, width: 140 }}>
                {formatCurrencyEUR(item.amount)}
              </Fit>
              <Fit style={{ color, width: 82, fontWeight: "700" }} min={0.8}>
                {formatPct(item.perfYtdPct)}
              </Fit>

              {/* Badge classe d’actif */}
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: badgeColor,
                    }}
                  />
                  <Fit style={{ color: COLORS.text, maxWidth: 140 }} min={0.8}>
                    {item.assetClass}
                  </Fit>
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
