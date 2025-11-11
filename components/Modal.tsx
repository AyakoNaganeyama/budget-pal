import { useTransactionStore } from "@/globalStore/transactionStore";
import { supabase } from "@/util/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddTransactionModal({
  visible,
  onClose,
  onSaved,
}: AddTransactionModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) console.error("Error fetching categories:", error);
      else setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategoryId(null);
    setDate(new Date());
    setType("expense");
  };

  // Save transaction
  const handleSave = async () => {
    if (!amount || !categoryId) {
      alert("Please enter an amount and select a category.");
      return;
    }

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("User not logged in");
      setLoading(false);
      return;
    }

    const newTransaction = {
      user_id: session.user.id,
      amount: Number(amount),
      type,
      category_id: categoryId,
      description,
      date: date.toISOString().split("T")[0],
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert([newTransaction])
      .select()
      .single(); // get the inserted transaction back

    if (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction");
    } else {
      // ✅ Add the new transaction to the store immediately
      const addTransaction = useTransactionStore.getState().addTransaction;

      // Map the inserted transaction to your store format
      addTransaction({
        id: data.id,
        amount: data.amount,
        category_id: data.category_id, // make sure matches your store interface
        date: data.date,
        description: data.description,
      });

      onSaved && (await onSaved()); // optional: refetch if needed
      onClose();
      setAmount("");
      setDescription("");
      setCategoryId(null);
      setDate(new Date());
      setType("expense");
    }

    setLoading(false);
  };

  const styles = getStyles(isDark);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Add Transaction</Text>

              <TextInput
                placeholder="Amount"
                placeholderTextColor={isDark ? "#aaa" : "#777"}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
              />

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={styles.picker}
                >
                  <Picker.Item label="Expense" value="expense" />
                  <Picker.Item label="Income" value="income" />
                </Picker>
              </View>

              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={categoryId}
                  onValueChange={setCategoryId}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Category" value={null} />
                  {categories.map((c) => (
                    <Picker.Item key={c.id} label={c.name} value={c.id} />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                  Date: {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                />
              )}

              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor={isDark ? "#aaa" : "#777"}
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancel]}
                  onPress={() => {
                    onClose();
                    resetForm();
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.save]}
                  onPress={handleSave}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// Themed styles
const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
      maxHeight: "90%",
      width: "100%",
      backgroundColor: isDark ? "#121212" : "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
      color: isDark ? "#fff" : "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#ccc",
      borderRadius: 6,
      padding: 10,
      marginBottom: 12,
      color: isDark ? "#fff" : "#000",
      backgroundColor: isDark ? "#1e1e1e" : "#fff",
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#ccc",
      borderRadius: 6,
      marginBottom: 12,
      backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
    },
    picker: {
      color: isDark ? "#fff" : "#000",
    },
    dateText: {
      marginBottom: 12,
      color: isDark ? "#ddd" : "#555",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
    },
    cancel: {
      backgroundColor: "#888",
      marginRight: 10,
    },
    save: {
      backgroundColor: "#4CAF50",
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
  });
