import { getMonthlyTransactions } from "@/api/getMonthly";
import AddTransactionModal from "@/components/Modal";
import MonthlyDonutChart from "@/components/MonthlyDounutChart";
import { Colors } from "@/constants/theme";
import { useTransactionStore } from "@/globalStore/transactionStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/util/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardScreen() {
  const transactions = useTransactionStore((state) => state.transactions);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [showModal, setShowModal] = React.useState(false);
  const [displayTransactions, setDisplayTransactions] =
    React.useState(transactions);

  // Example: open modal or navigate on button press
  const handleAddPress = () => {
    setShowModal(true);
  };

  const refreshTransactions = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await getMonthlyTransactions(session.user.id);
    }
  };
  useEffect(() => {
    setDisplayTransactions(transactions);
  }, [transactions]);

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session) {
  //       await getMonthlyTransactions(session.user.id); // updates store
  //     }
  //   };
  //   fetchTransactions();
  // }, []);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
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
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>

          {/* Render the chart */}
          <MonthlyDonutChart />

          {/* Transactions Cards */}
          <View style={{ marginTop: 30 }}>
            {displayTransactions.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: themeColors.inactive }}
              >
                No transactions to display
              </Text>
            ) : (
              displayTransactions.map((t) => (
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

        {/* Floating Add Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themeColors.tint }]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <AddTransactionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={refreshTransactions}
      />
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
