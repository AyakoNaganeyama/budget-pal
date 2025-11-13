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
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
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
  const [monthYearLabel, setMonthYearLabel] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
      const data = await getMonthlyTransactions(session.user.id);

      // Update month-year label based on the first transaction (or latest)
      if (data && data.length > 0) {
        const transactionDate = new Date(data[0].date);
        const label = transactionDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        setMonthYearLabel(label);
      } else {
        // No transactions, use current month/year
        const now = new Date();
        const label = now.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        setMonthYearLabel(label);
      }
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  useEffect(() => {
    setDisplayTransactions(transactions);

    // Update month-year label whenever transactions change
    if (transactions && transactions.length > 0) {
      const transactionDate = new Date(transactions[0].date);
      const label = transactionDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      setMonthYearLabel(label);
    }
  }, [transactions]);

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
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={[styles.monthLabel, { color: themeColors.text }]}>
              {monthYearLabel || "Select Month"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <View style={{ marginVertical: 10 }}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setSelectedDate(date);

                  // Optionally update label live on iOS
                  if (Platform.OS === "ios" && date) {
                    const label = date.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    });
                    setMonthYearLabel(label);
                  }
                }}
              />

              {/* Save Button */}
              <TouchableOpacity
                onPress={async () => {
                  setShowPicker(false);

                  // Log the selected label
                  const label = selectedDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  });
                  console.log("Saved Month/Year:", label);

                  setMonthYearLabel(label);

                  // Fetch transactions for the selected month
                  const {
                    data: { session },
                  } = await supabase.auth.getSession();
                  if (session) {
                    await getMonthlyTransactions(session.user.id, selectedDate);
                  }
                }}
                style={{
                  backgroundColor: themeColors.tint,
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
              </TouchableOpacity>
            </View>
          )}

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

          {/* Transactions Cards test*/}
          {displayTransactions.length > 0 && (
            <View style={{ marginTop: 30 }}>
              <TransactionCards
                transactions={displayTransactions}
                colorScheme={colorScheme ?? "light"}
                onEdit={handleEdit}
                selectedDate={selectedDate}
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
        onSaved={async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            await getMonthlyTransactions(session.user.id, selectedDate);
          }
        }}
      />

      <EditTransactionModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        transactionId={selectedTransactionId}
        onUpdated={async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            await getMonthlyTransactions(session.user.id, selectedDate);
          }
        }}
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
