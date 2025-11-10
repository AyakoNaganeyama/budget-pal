import MonthlyDonutChart from "@/components/MonthlyDounutChart";
import React from "react";
import { ScrollView, Text } from "react-native";

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        My Dashboard
      </Text>

      {/* Render the chart */}
      <MonthlyDonutChart />
    </ScrollView>
  );
}
