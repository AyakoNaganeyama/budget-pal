import { getMonthlyTransactions } from "@/api/getMonthly";
import { supabase } from "@/util/supabase";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface Transaction {
  amount: number;
  category_id?: {
    name: string;
  };
}

interface MonthlyDonutChartProps {
  transactions: Transaction[];
}

export default function MonthlyDonutChart({
  transactions,
}: MonthlyDonutChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const transactions = useTransactionStore((state) => state.transactions);

  // Get current user ID from Supabase session
  const getUserId = async (): Promise<string | null> => {
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return sessionData.session?.user.id || null;
  };

  useEffect(() => {
    const grouped: Record<string, number> = {};

    transactions.forEach((t) => {
      const categoryName = t.category_id?.name || "Unknown";
      grouped[categoryName] = (grouped[categoryName] || 0) + t.amount;
    });

    const formatted = Object.entries(grouped).map(([text, value], index) => ({
      text,
      value,
      color: ["#FF8C00", "#4CAF50", "#2196F3", "#E91E63"][index % 4],
    }));

    setChartData(formatted);
  }, [transactions]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userId = await getUserId();
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const transactions: Transaction[] = await getMonthlyTransactions(
          userId
        );
        console.log("Transactions:", transactions);

        if (!transactions || transactions.length === 0) {
          setChartData([]);
          setLoading(false);
          return;
        }

        // Group transactions by category name
        const grouped: Record<string, number> = {};
        transactions.forEach((t) => {
          const categoryName = t.category_id?.name || "Unknown";
          grouped[categoryName] =
            (grouped[categoryName] || 0) + Number(t.amount);
        });

        // Format data for PieChart
        const formatted = Object.entries(grouped).map(
          ([text, value], index) => ({
            text,
            value,
            color: ["#FF8C00", "#4CAF50", "#2196F3", "#E91E63"][index % 4],
          })
        );

        setChartData(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // No dependency needed

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error)
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
        {error}
      </Text>
    );

  if (chartData.length === 0)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        No transactions this month
      </Text>
    );

  return (
    <View style={{ alignItems: "center", marginTop: 40 }}>
      <PieChart
        data={chartData}
        donut
        radius={120}
        innerRadius={70}
        showText
        textColor="white"
        focusOnPress
        showTooltip
      />

      {/* Category totals list */}
      <View style={{ marginTop: 20, width: "80%" }}>
        {chartData.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              paddingVertical: 6,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: item.color,
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 16, color: "white" }}>{item.text}</Text>
            </View>
            <Text style={{ fontWeight: "bold", color: "white" }}>
              ${item.value.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
