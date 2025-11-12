import { deleteTransaction } from "@/api/deleteTransaction";
import { Colors } from "@/constants/theme";
import { Transaction } from "@/globalStore/transactionStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface TransactionCardsProps {
  transactions: Transaction[];
  colorScheme: "light" | "dark";
  onEdit?: (id: string) => void; // pass callback
}

export default function TransactionCards({
  transactions,
  colorScheme,
  onEdit,
}: TransactionCardsProps) {
  const themeColors = Colors[colorScheme ?? "light"];

  if (transactions.length === 0) {
    return (
      <Text style={{ textAlign: "center", color: themeColors.inactive }}>
        No transactions to display
      </Text>
    );
  }

  const onDlete = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      Alert.alert("Transaction deleted:", id);
    }
  };

  return (
    <>
      {transactions.map((t) => (
        <View
          key={t.id}
          style={[styles.card, { backgroundColor: themeColors.cardBackground }]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => onEdit?.(t.id)}>
              <Text style={[styles.amount, { color: themeColors.text }]}>
                ${t.amount.toFixed(2)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDlete(t.id)}>
              <MaterialIcons name="delete-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
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
