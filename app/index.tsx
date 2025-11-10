import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
    </View>
  );
}
