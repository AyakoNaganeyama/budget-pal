import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
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

  useEffect(() => {
    const grouped: Record<string, number> = {};

    transactions.forEach((t) => {
      const categoryName = t.category_id?.name || "Unknown";
      grouped[categoryName] = (grouped[categoryName] || 0) + t.amount;
    });

    const formatted = Object.entries(grouped).map(
      ([text, value], index, arr) => {
        const hue = (index * 360) / arr.length;
        const color = `hsl(${hue}, 70%, 50%)`;
        return { text, value, color };
      }
    );

    setChartData(formatted);
  }, [transactions]);

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
