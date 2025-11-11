import { Colors } from "@/constants/theme";
import { Transaction } from "@/globalStore/transactionStore";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TransactionCardsProps {
  transactions: Transaction[];
  colorScheme: "light" | "dark";
}

export default function TransactionCards({
  transactions,
  colorScheme,
}: TransactionCardsProps) {
  const themeColors = Colors[colorScheme ?? "light"];

  if (transactions.length === 0) {
    return (
      <Text style={{ textAlign: "center", color: themeColors.inactive }}>
        No transactions to display
      </Text>
    );
  }

  return (
    <>
      {transactions.map((t) => (
        <View
          key={t.id}
          style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
        >
          <Text style={[styles.amount, { color: themeColors.text }]}>
            ${t.amount.toFixed(2)}
          </Text>
          <Text style={[styles.category, { color: themeColors.text }]}>
            {t.category_id?.name || "Unknown"}
          </Text>
          <Text style={[styles.date, { color: themeColors.inactive }]}>
            {t.date ? new Date(t.date).toLocaleDateString() : "Unknown date"}
          </Text>
          {t.description && (
            <Text style={[styles.desc, { color: themeColors.text }]}>
              {t.description}
            </Text>
          )}
        </View>
      ))}
    </>
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
  amount: { fontSize: 18, fontWeight: "bold" },
  category: { fontSize: 14, marginTop: 4 },
  date: { fontSize: 12, marginTop: 2 },
  desc: { fontSize: 14, marginTop: 5 },
});
