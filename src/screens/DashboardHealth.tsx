// screens/DashboardHealth.tsx
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useLayoutEffect, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { getHealthData } from "../../data/health";
import { useSession } from "../navigation/AppNavigator";

/* ===== Palette & gradient ===== */
const COLORS = {
  bg: "#0f1325",
  card: "#161a33",
  text: "#E9ECF5",
  sub: "#A9B1C7",
  border: "rgba(255,255,255,0.08)",
  green: "#22c55e",
  yellow: "#fbbf24",
  purple: "#a78bfa",
  blue: "#60a5fa",
  red: "#ef4444",
  accent: "#7aa2ff",
  gold: "#d4b258",
  login: "#6DDAF2",
};

const GRADIENT = {
  colors: ["#0f1325", "#1c2748"] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
} as const;

/* ===== Utils ===== */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const pctStr = (n01: number) => `${Math.round(clamp01(n01) * 100)}%`;
const lastOf = <T,>(arr?: T[]) => (arr && arr.length ? arr[arr.length - 1] : undefined);
const NICE_GLOBAL_SCORE = 0.84; // 👈 Demande : 84%

function niceDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
}

/* ===== Micro-charts ===== */
function Sparkline({ data, width, height = 56 }: { data: number[]; width: number; height?: number }) {
  const path = useMemo(() => {
    if (!data?.length) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const dx = width / Math.max(1, data.length - 1);
    const sy = (v: number) =>
      max === min ? height / 2 : height - ((v - min) / (max - min)) * height;
    return data.reduce((acc, v, i) => acc + (i === 0 ? `M ${i * dx} ${sy(v)}` : ` L ${i * dx} ${sy(v)}`), "");
  }, [data, height, width]);

  return (
    <Svg width={width} height={height}>
      <Path d={path} stroke={COLORS.accent} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function Ring({ pct01, color, size }: { pct01: number; color: string; size: number }) {
  const stroke = Math.max(10, Math.floor(size * 0.12));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = clamp01(pct01) * c;

  return (
    <View style={{ alignItems: "center", width: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={"#0b0e1f"} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={{ color: COLORS.text, fontWeight: "800", marginTop: 8, fontSize: 20 }}>
        {pctStr(pct01)}
      </Text>
    </View>
  );
}

function Bar({ label, value01, color }: { label: string; value01: number; color: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Text style={{ color: COLORS.sub, width: 22 }}>{label}</Text>
      <View style={{ flex: 1, height: 10, backgroundColor: "#0b0e1f", borderRadius: 999, overflow: "hidden" }}>
        <View style={{ width: `${clamp01(value01) * 100}%`, backgroundColor: color, flex: 1 }} />
      </View>
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, borderWidth: 1, borderColor: COLORS.border }}>
      <Text style={{ color: COLORS.text, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

// === Triple anneau Hanches/Genoux/Chevilles ===
// === Triple anneau Hanches/Genoux/Chevilles ===
function TripleRingJoints({
  hips,
  knees,
  ankles,
  size = 200,
  stroke = 12,
}: {
  hips: number;   // 0..1
  knees: number;  // 0..1
  ankles: number; // 0..1
  size?: number;
  stroke?: number;
}) {
  const pad = 8;     // espace entre anneaux
  const inset = 18;   // 👈 nouveau : réduit légèrement tous les rayons

  // rayon de base réduit d’un petit retrait (inset) pour éviter tout rognage
  const baseR = (size - 3 * stroke - 2 * pad) / 2 - inset;

  const rings = [
    { key: "Hanches",   value: hips,   color: COLORS.yellow, r: baseR + (stroke + pad) * 2 },
    { key: "Genoux",    value: knees,  color: COLORS.red,    r: baseR + (stroke + pad) * 1 },
    { key: "Chevilles", value: ankles, color: COLORS.blue,   r: baseR + (stroke + pad) * 0 },
  ];

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        {rings.map((ring) => {
          const c = 2 * Math.PI * ring.r;
          const dash = clamp01(ring.value) * c;
          return (
            <React.Fragment key={ring.key}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ring.r}
                stroke={"#0b0e1f"}
                strokeWidth={stroke}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={ring.r}
                stroke={ring.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Légende compacte */}
      <View style={{ marginTop: 12, gap: 8 }}>
        {rings.map((r) => (
          <View key={r.key} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: r.color }} />
            <Text style={{ color: COLORS.text, fontWeight: "700", width: 90 }}>{r.key}</Text>
            <Text style={{ color: COLORS.sub }}>{Math.round(clamp01(r.value) * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}



/* ===== Adaptateur souple des données ===== */
function useHealthAdapter(raw: any) {
  const assessmentDate: string | undefined =
    raw?.assessmentDate ?? raw?.lastAssessmentISO ?? raw?.posture?.assessmentDateISO ?? undefined;

  // 👇 Demande : score global à 84% (si tu veux reprendre la valeur capteur, remplace par le calcul dessous)
  let globalScore01 = NICE_GLOBAL_SCORE;
  // Exemple si un jour tu veux remettre la valeur réelle :
  // globalScore01 =
  //   typeof raw?.globalScore === "number"
  //     ? clamp01(raw.globalScore)
  //     : typeof raw?.posture?.riskScores?.overall === "number"
  //     ? clamp01(raw.posture.riskScores.overall)
  //     : 0.7;

  const symRaw = raw?.sym ?? raw?.posture?.symmetry ?? { left: 0.62, right: 0.71 };
  const left01 = clamp01(Number(symRaw.left ?? 0.62));
  const right01 = clamp01(Number(symRaw.right ?? 0.71));
  const sym = {
    left01,
    right01,
    dominant: left01 > right01 ? "gauche" : left01 < right01 ? "droite" : "—",
    gapPts: Math.abs(Math.round((left01 - right01) * 100)),
  };

  const balance7d: number[] =
    raw?.balance7d ?? raw?.posture?.trends?.balance7d ?? [18, 20, 19, 22, 25, 24, 26];
  const hipAbd7d: number[] =
    raw?.hipAbduction7d ?? raw?.posture?.trends?.hipAbd30s ?? [26, 28, 27, 29, 31, 32, 33];

  const joints = {
    hips: clamp01(Number(raw?.posture?.riskScores?.hips ?? 0.71)),
    knees: clamp01(Number(raw?.posture?.riskScores?.knees ?? 0.58)),
    ankles: clamp01(Number(raw?.posture?.riskScores?.ankles ?? 0.65)),
  };

  const lastBalance = lastOf(balance7d) ?? 0;
  const lastHipAbd = lastOf(hipAbd7d) ?? 0;

  const alerts: string[] =
    raw?.alerts ??
    (() => {
      const a: string[] = [];
      if ((raw?.posture?.knees?.dynamicValgusDeg ?? 10) >= 10)
        a.push("Genoux : valgus dynamique élevé → stabilité latérale à travailler");
      if ((raw?.posture?.ankles?.dorsiflexionLungeCm ?? 9.5) < 10)
        a.push("Chevilles : dorsiflexion limitée → mobilité cheville/mollet");
      if (Math.abs(left01 - right01) > 0.12)
        a.push("Asymétrie G/D marquée → renforcer le côté le plus faible");
      return a;
    })();

  const exercises: string[] =
    raw?.exercises ?? [
      "Dorsiflexions mur (3×10/j)",
      "Band walks latéraux (3×15 m)",
      "Hip thrust unilatéral (3×8 côté faible)",
      "Squat tempo 3-1-1 (3×6)",
    ];

  return {
    assessmentDate,
    globalScore01,
    sym,
    balance7d,
    hipAbd7d,
    lastBalance,
    lastHipAbd,
    joints,
    alerts,
    exercises,
  };
}

/* ===== Écran ===== */
export default function DashboardHealth() {
  const { login } = useSession();
  const raw = getHealthData(login);
  const nav = useNavigation<any>();
  const { width } = useWindowDimensions();

  // Données adaptées
  const {
    assessmentDate,
    globalScore01,
    sym,
    balance7d,
    hipAbd7d,
    lastBalance,
    lastHipAbd,
    joints,
    alerts,
    exercises,
  } = useHealthAdapter(raw);

  // Header
  const handleLogout = () => nav.reset({ index: 0, routes: [{ name: "Login" }] });
  useLayoutEffect(() => {
    nav.setOptions({
      headerShown: true,
      headerTitle: "Espace santé",
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
  }, [nav]);

  // Layout
  const outerPad = 16;
  const gap = 12;
  const isNarrow = width < 480;
  const cols = isNarrow ? 1 : 2;
  const colW = isNarrow ? width - outerPad * 2 : Math.floor((width - outerPad * 2 - gap) / 2);
  const cardWStyle: ViewStyle = cols === 1 ? { alignSelf: "stretch" } : { width: colW };
  const ringSizeGlobal = isNarrow ? 120 : 140;
  const sparkW = Math.min(Math.max(140, colW - 28), 320);

  // Grille joints (toujours 2 colonnes pour l’esthétique)
  const jointCardW = Math.floor((width - outerPad * 2 - gap) / 2);
  const jointRingSize = isNarrow ? 120 : 130;

  const Header = (
    <View style={{ paddingHorizontal: outerPad, paddingTop: outerPad, paddingBottom: 0, gap: 16 }}>
      {/* Titre */}
      <View>
        <Text style={{ color: COLORS.text, fontSize: 30, fontWeight: "800" }}>
          Bienvenue <Text style={{ color: COLORS.login }}>{login}</Text> 👋
        </Text>
        <Text style={{ color: COLORS.sub, marginTop: 4 }}>
          Bilan posture & prévention · {niceDate(assessmentDate)}
        </Text>
      </View>

      {/* Score global (84%) */}
      <View style={[styles.card, cardWStyle, { alignItems: "center", paddingVertical: 18 }]}>
        <Ring pct01={globalScore01} color={globalScore01 >= 0.75 ? COLORS.green : COLORS.yellow} size={ringSizeGlobal} />
        <Text style={{ color: COLORS.sub, marginTop: 6, fontSize: 12 }}>≥75% = vert</Text>
      </View>

      {/* Symétrie : + air dans la carte */}
      <View style={[styles.card, cardWStyle, { padding: 18, gap: 14 }]}>
        <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 16, marginBottom: 2 }}>
          Symétrie G/D
        </Text>
        <Bar label="G" value01={sym.left01} color={COLORS.blue} />
        <Bar label="D" value01={sym.right01} color={COLORS.purple} />
        <Text style={{ color: COLORS.sub, fontSize: 13, marginTop: 2 }}>
          Dominance {sym.dominant} • Écart ≈ {sym.gapPts} pts
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Badge label={`G ${pctStr(sym.left01)}`} />
          <Badge label={`D ${pctStr(sym.right01)}`} />
        </View>
      </View>

      {/* Tendances : plus d’espace autour des titres */}
      <View style={{ gap: cols === 2 ? 0 : 12, flexDirection: cols === 2 ? "row" : "column" }}>
        <View style={[styles.card, cardWStyle, { padding: 18 }]}>
          <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 10 }}>
            Équilibre unipodal — 7 jours
          </Text>
          <Sparkline data={balance7d} width={sparkW} />
          <Text style={{ color: COLORS.sub, marginTop: 8 }}>
            Dernier : {Math.round(lastBalance ?? 0)} s par jambe
          </Text>
        </View>

        <View style={[styles.card, cardWStyle, { padding: 18 }]}>
          <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 10 }}>
            Abduction hanche — 7 jours
          </Text>
          <Sparkline data={hipAbd7d} width={sparkW} />
          <Text style={{ color: COLORS.sub, marginTop: 8 }}>
            Dernier : {Math.round(lastHipAbd ?? 0)} reps / 30s
          </Text>
        </View>
      </View>
    {/* Synthèse articulations dans une seule carte */}
    <View style={[styles.card, cardWStyle, { alignItems: "center", padding: 16 }]}>
      <Text style={{ color: COLORS.text, fontWeight: "800", fontSize: 16, marginBottom: 10 }}>
        Hanches • Genoux • Chevilles
      </Text>
      <TripleRingJoints
        hips={joints.hips}
        knees={joints.knees}
        ankles={joints.ankles}
        size={Math.min(colW - 20, 200)}   
        stroke={10}                    
      />
    </View>

      {/* Alertes */}
      {!!alerts.length && (
        <View style={[styles.card, cardWStyle, { padding: 16 }]}>
          <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 8 }}>À surveiller</Text>
          {alerts.map((a, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <Feather name="alert-triangle" size={16} color={COLORS.yellow} />
              <Text style={{ color: COLORS.sub, flex: 1 }} numberOfLines={2}>{a}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Exercices */}
      <View style={[styles.card, cardWStyle, { padding: 16, gap: 8 }]}>
        <Text style={{ color: COLORS.text, fontWeight: "800" }}>Exercices conseillés</Text>
        {exercises.map((ex) => (
          <View key={ex} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Feather name="check-circle" size={16} color={COLORS.green} />
            <Text style={{ color: COLORS.sub }}>{ex}</Text>
          </View>
        ))}
        <Text style={{ color: COLORS.sub, marginTop: 6, fontSize: 12 }}>
          Astuce : ajoute 1–2 séries côté le plus faible.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={GRADIENT.colors}
        start={GRADIENT.start}
        end={GRADIENT.end}
        style={StyleSheet.absoluteFill}
      />
      <FlatList
        data={[]}
        keyExtractor={(_, i) => String(i)}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: outerPad }}
        renderItem={null}
      />
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    // petit “glow” moderne
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
