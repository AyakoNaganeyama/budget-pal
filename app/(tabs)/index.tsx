import MonthlyDonutChart from "@/components/MonthlyDounutChart";
import { Colors } from "@/constants/theme";
import { useTransactionStore } from "@/globalStore/transactionStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const transactions = useTransactionStore((state) => state.transactions);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: themeColors.background,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: themeColors.text,
        }}
      >
        My Dashboard
      </Text>

      {/* Render the chart */}
      <MonthlyDonutChart />

      {/* Transactions Cards */}
      <View style={{ marginTop: 30 }}>
        {transactions.length === 0 ? (
          <Text style={{ textAlign: "center", color: themeColors.inactive }}>
            No transactions to display
          </Text>
        ) : (
          transactions.map((t) => (
            <View
              key={t.id}
              style={[
                styles.card,
                { backgroundColor: themeColors.cardBackground },
              ]}
            >
              <Text style={[styles.amount, { color: themeColors.text }]}>
                ${t.amount.toFixed(2)}
              </Text>
              <Text style={[styles.category, { color: themeColors.text }]}>
                {t.category_id?.name || "Unknown"}
              </Text>
              <Text style={[styles.date, { color: themeColors.inactive }]}>
                {t.date
                  ? new Date(t.date).toLocaleDateString()
                  : "Unknown date"}
              </Text>
              {t.description && (
                <Text style={[styles.desc, { color: themeColors.text }]}>
                  {t.description}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  desc: {
    fontSize: 14,
    marginTop: 5,
  },
});
