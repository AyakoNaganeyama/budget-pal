import { getMonthlyTransactions } from "@/api/getMonthly";
import TransactionCards from "@/components/Cards";
import AddTransactionModal from "@/components/Modal";
import MonthlyDonutChart from "@/components/MonthlyDounutChart";
import EditTransactionModal from "@/components/TransactionModal";
import { Colors } from "@/constants/theme";
import { useTransactionStore } from "@/globalStore/transactionStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/util/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
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
  const [showModal, setShowModal] = useState(false);
  const [displayTransactions, setDisplayTransactions] = useState(transactions);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleEdit = (id: string) => {
    setSelectedTransactionId(id);
    setEditModalVisible(true);
  };

  const handleAddPress = () => setShowModal(true);

  const refreshTransactions = useCallback(async () => {
    setRefreshing(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await getMonthlyTransactions(session.user.id);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  useEffect(() => {
    setDisplayTransactions(transactions);
  }, [transactions]);

  const monthYearLabel = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <View style={{ flex: 1, backgroundColor: themeColors.background }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            paddingBottom: 100, // extra padding for FAB
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshTransactions}
              tintColor={themeColors.tint}
            />
          }
        >
          <Text style={[styles.monthLabel, { color: themeColors.text }]}>
            {monthYearLabel}
          </Text>

          {/* Render the chart */}
          {displayTransactions.length > 0 ? (
            <MonthlyDonutChart transactions={displayTransactions} />
          ) : (
            <Text
              style={{
                color: "#aaa",
                fontSize: 16,
                marginTop: 40,
                textAlign: "center",
              }}
            >
              No transactions for this month
            </Text>
          )}

          {/* Transactions Cards */}
          {displayTransactions.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <TransactionCards
                transactions={displayTransactions}
                colorScheme={colorScheme ?? "light"}
                onEdit={handleEdit}
              />
            </View>
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themeColors.tint }]}
          onPress={handleAddPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <AddTransactionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSaved={refreshTransactions}
      />

      <EditTransactionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        transactionId={selectedTransactionId}
        onUpdated={refreshTransactions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  monthLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
