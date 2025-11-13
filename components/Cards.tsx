import { deleteTransaction } from "@/api/deleteTransaction";
import { Colors } from "@/constants/theme";
import { Transaction } from "@/globalStore/transactionStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TransactionCardsProps {
  transactions: Transaction[];
  colorScheme: "light" | "dark";
  onEdit?: (id: string) => void;
  selectedDate: Date;
}

export default function TransactionCards({
  transactions,
  colorScheme,
  onEdit,
  selectedDate,
}: TransactionCardsProps) {
  const themeColors = Colors[colorScheme ?? "light"];

  if (transactions.length === 0) {
    return (
      <Text
        style={{
          textAlign: "center",
          color: themeColors.inactive,
          marginTop: 20,
        }}
      >
        No transactions to display
      </Text>
    );
  }

  const onDelete = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteTransaction(id, selectedDate);
            if (success) Alert.alert("Transaction deleted");
          },
        },
      ]
    );
  };

  return (
    <>
      {transactions.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
          activeOpacity={0.8}
          onPress={() => onEdit?.(t.id)}
        >
          <View style={styles.header}>
            <Text style={[styles.amount, { color: themeColors.text }]}>
              ${t.amount.toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => onDelete(t.id)}>
              <MaterialIcons name="delete-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>

          <View style={styles.meta}>
            <Text style={[styles.category, { color: themeColors.text }]}>
              {t.category_id?.name || "Unknown"}
            </Text>
            <Text style={[styles.date, { color: themeColors.inactive }]}>
              {t.date ? new Date(t.date).toLocaleDateString() : "Unknown date"}
            </Text>
          </View>

          {t.description ? (
            <Text style={[styles.desc, { color: themeColors.text }]}>
              {t.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  amount: { fontSize: 18, fontWeight: "bold" },
  category: { fontSize: 14 },
  date: { fontSize: 12 },
  desc: { fontSize: 14, marginTop: 6, lineHeight: 18 },
});
