// screens/DashboardBase.tsx
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

type KPI = {
  label: string;
  value: string;
  sublabel?: string;
  delta?: string;
  deltaColor?: string;
};

type Allocation = {
  label: string;
  value: number;
  color: string;
};

export type Position = {
  id: string;
  name: string;
  amount: string;
  perf?: string;
  assetClass?: string;
  assetColor?: string;
};

type Props = {
  username: string;
  title: string;
  kpis: KPI[];
  cashLabel?: string;
  cashValue?: string;
  allocation?: Allocation[];
  positions: Position[];
};

const COLORS = {
  bg: "#051124",
  card: "#161a33",
  text: "#E9ECF5",
  sub: "#A9B1C7",
  border: "rgba(255,255,255,0.06)",
  green: "#22c55e",
  red: "#ef4444",
  gold: "#d4b258",
  username: "#6DDAF2",
};

// 👇 même gradient que le Dashboard Santé
const GRADIENT = {
  colors: ["#0f1325", "#1c2748"] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
} as const;

const ROW = {
  fontSize: 14,
  lineHeight: 18,
  vpad: 4, // très compact
  hpad: 12,
  badgePadV: 2,
  badgePadH: 8,
};

export default function DashboardBase({
  username,
  title,
  kpis,
  cashLabel,
  cashValue,
  allocation,
  positions,
}: Props) {
  const navigation = useNavigation<any>();
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: title,
      // on aligne le header sur le haut du gradient
      headerStyle: { backgroundColor: GRADIENT.colors[0] },
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
  }, [navigation, title]);

  const donut = useMemo(() => {
    if (!allocation) return null;
    const size = 150;
    const strokeWidth = 32;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;
    const total = allocation.reduce((s, a) => s + a.value, 0);

    const segments = allocation.map((a) => {
      const frac = a.value / total;
      const length = circumference * frac;
      const seg = {
        key: a.label,
        color: a.color,
        dasharray: `${length} ${circumference - length}`,
        dashoffset: -offset,
      };
      offset += length;
      return seg;
    });

    return { size, strokeWidth, radius, segments };
  }, [allocation]);

  const Header = (
    <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
      {/* Bienvenue */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: "800" }}>
          Bienvenue <Text style={{ color: COLORS.username }}>{username}</Text> 👋
        </Text>
        <Text style={{ color: COLORS.sub, marginTop: 6 }}>{title}</Text>
      </View>

      {/* KPIs */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
        {kpis.map((kpi) => (
          <View
            key={kpi.label}
            style={{
              flex: 1,
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ color: COLORS.sub, marginBottom: 6 }}>{kpi.label}</Text>

            {/* Valeur principale */}
            <Text
              style={{
                color: kpi.label.includes("Performance")
                  ? kpi.deltaColor ?? COLORS.text
                  : COLORS.text,
                fontSize: 20,
                fontWeight: "700",
              }}
              numberOfLines={1}
            >
              {kpi.value}
            </Text>

            {/* Delta si dispo */}
            {kpi.delta && (
              <Text
                style={{
                  color: kpi.deltaColor ?? COLORS.sub,
                  marginTop: 6,
                  fontWeight: "600",
                }}
              >
                {kpi.delta}
              </Text>
            )}

            {/* Sous-label optionnel */}
            {kpi.sublabel && (
              <Text style={{ color: COLORS.sub, marginTop: 6 }}>{kpi.sublabel}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Liquidités */}
      {cashLabel && cashValue && (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: COLORS.sub, marginBottom: 6, textAlign: "center" }}>
            {cashLabel}
          </Text>
          <Text
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {cashValue}
          </Text>
        </View>
      )}

      {/* Donut */}
      {donut && (
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 14,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontWeight: "700",
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            Allocation
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
                  onPress={() =>
                    setActiveSlice(activeSlice === s.key ? null : s.key)
                  }
                />
              ))}
            </Svg>

            {/* Légende */}
            <View style={{ flex: 1, gap: 8 }}>
              {allocation!.map((a) => {
                const isActive =
                  activeSlice === a.label || activeSlice === null;
                return (
                  <TouchableOpacity
                    key={a.label}
                    onPress={() =>
                      setActiveSlice(activeSlice === a.label ? null : a.label)
                    }
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.04)"
                        : "transparent",
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: a.color,
                        }}
                      />
                      <Text
                        style={{ color: COLORS.text, fontWeight: "600" }}
                        numberOfLines={1}
                      >
                        {a.label}
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.text, fontWeight: "700" }}>
                      {a.value}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Titre tableau */}
      <Text
        style={{
          color: COLORS.text,
          fontWeight: "700",
          fontSize: 18,
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        Positions
      </Text>

      {/* En-têtes */}
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 6,
          paddingHorizontal: ROW.hpad,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.border,
          marginBottom: 0,
        }}
      >
        <Text style={[styles.th, { width: 160 }]} numberOfLines={1}>
          Instrument
        </Text>
        <Text style={[styles.th, { width: 120 }]} numberOfLines={1}>
          Montant
        </Text>
        <Text style={[styles.th, { width: 90 }]} numberOfLines={1}>
          Perf.
        </Text>
        <Text style={[styles.th, { flex: 1 }]} numberOfLines={1}>
          Classe
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 🎨 Dégradé de fond (comme Santé) */}
      <LinearGradient
        colors={GRADIENT.colors}
        start={GRADIENT.start}
        end={GRADIENT.end}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <FlatList
          data={positions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={Header}
          ListHeaderComponentStyle={{
            marginBottom: -StyleSheet.hairlineWidth,
            paddingBottom: 0,
          }}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: COLORS.border,
              }}
            />
          )}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                paddingVertical: ROW.vpad,
                paddingHorizontal: ROW.hpad,
                alignItems: "center",
              }}
            >
              <Text style={[styles.td, { width: 160 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.td, { width: 140 }]} numberOfLines={1}>
                {item.amount}
              </Text>
              <Text
                style={[
                  styles.tdBold,
                  {
                    width: 100,
                    color: (item.perf ?? "").startsWith("-")
                      ? COLORS.red
                      : COLORS.green,
                  },
                ]}
                numberOfLines={1}
              >
                {item.perf ?? "-"}
              </Text>

              {item.assetClass && (
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      paddingHorizontal: ROW.badgePadH,
                      paddingVertical: ROW.badgePadV,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      backgroundColor: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: item.assetColor ?? "#aaa",
                      }}
                    />
                    <Text style={[styles.td]} numberOfLines={1}>
                      {item.assetClass}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  th: {
    color: COLORS.sub,
    fontSize: ROW.fontSize,
    lineHeight: ROW.lineHeight,
  },
  td: {
    color: COLORS.text,
    fontSize: ROW.fontSize,
    lineHeight: ROW.lineHeight,
  },
  tdBold: {
    color: COLORS.text,
    fontSize: ROW.fontSize,
    lineHeight: ROW.lineHeight,
    fontWeight: "700",
  },
});
