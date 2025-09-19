// navigation/AppNavigator.tsx
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { createContext, useContext, useMemo } from "react";
import DashboardFinance from "../screens/DashboardFinance";
import DashboardHealth from "../screens/DashboardHealth";
import DashboardRealEstate from "../screens/DashboardRealEstate";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: { login: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export const SessionContext = createContext<{ login: string } | null>(null);
export const useSession = () => useContext(SessionContext)!;

type TabsProps = NativeStackScreenProps<RootStackParamList, "MainTabs">;
function Tabs({ route }: TabsProps) {
  const login = route.params?.login ?? "dev";
  const sessionValue = useMemo(() => ({ login }), [login]);

  return (
    <SessionContext.Provider value={sessionValue}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#0f1325", borderTopColor: "rgba(255,255,255,0.06)" },
          tabBarActiveTintColor: "#7aa2ff",
          tabBarInactiveTintColor: "#A9B1C7",
        }}
      >
        <Tab.Screen
          name="Finance"
          component={DashboardFinance}
          options={{ tabBarIcon: ({ color, size }) => <Feather name="trending-up" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Immobilier"
          component={DashboardRealEstate}
          options={{ tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Santé"
          component={DashboardHealth}
          options={{ tabBarIcon: ({ color, size }) => <Feather name="activity" color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </SessionContext.Provider>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="MainTabs" component={Tabs} />
    </RootStack.Navigator>
  );
}
