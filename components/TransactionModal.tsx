import {
  Transaction,
  useTransactionStore,
} from "@/globalStore/transactionStore";
import { supabase } from "@/util/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface EditTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transactionId: string;
  onUpdated?: () => void;
}

export default function EditTransactionModal({
  visible,
  onClose,
  transactionId,
  onUpdated,
}: EditTransactionModalProps) {
  const transactions = useTransactionStore((state) => state.transactions);
  const updateTransactionInStore = useTransactionStore(
    (state) => state.setTransactions
  );

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState<string | undefined>();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Fetch categories from Supabase
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

  // Set initial transaction values
  useEffect(() => {
    const t = transactions.find((tr) => tr.id === transactionId);
    if (t) {
      setTransaction(t);
      setAmount(t.amount.toString());
      setType("expense");
      setCategory(t.category_id?.[0]?.id);
      setDate(new Date(t.date));
      setDescription(t.description || "");
    }
  }, [transactionId, transactions]);

  // Save edited transaction
  const handleSave = async () => {
    if (!transaction) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: Number(amount),
        type,
        category_id: category,
        date: date.toISOString().split("T")[0],
        description,
      })
      .eq("id", transaction.id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error updating transaction:", error);
      return;
    }

    // Update Zustand store
    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id
        ? {
            ...t,
            amount: Number(amount),
            type,
            category_id: categories.filter((c) => c.id === category),
            date: date.toISOString(),
            description,
          }
        : t
    );
    updateTransactionInStore(updatedTransactions);

    onUpdated?.();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modal}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Edit Transaction</Text>

              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Type picker */}
              <View style={{ marginVertical: 5 }}>
                <Text style={{ color: "white", marginBottom: 5 }}>Type</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() =>
                    setType(type === "expense" ? "income" : "expense")
                  }
                >
                  <Text style={{ color: "white" }}>{type}</Text>
                </TouchableOpacity>
              </View>

              {/* Category picker */}
              <View style={{ marginVertical: 5 }}>
                <Text style={{ color: "white", marginBottom: 5 }}>
                  Category
                </Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setCategoryPickerVisible(true)}
                >
                  <Text style={{ color: category ? "white" : "#aaa" }}>
                    {category
                      ? categories.find((c) => c.id === category)?.name
                      : "Select Category"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Date picker */}
              <View style={{ marginVertical: 5 }}>
                <Text style={{ color: "white", marginBottom: 5 }}>Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text style={{ color: "white" }}>{date.toDateString()}</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
              />

              {/* Buttons */}
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancel]}
                  onPress={onClose}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {/* Category Picker Modal */}
        {categoryPickerVisible && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModal}>
                <Picker
                  selectedValue={category}
                  onValueChange={(val) => setCategory(val)}
                >
                  {categories.map((c) => (
                    <Picker.Item key={c.id} label={c.name} value={c.id} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setCategoryPickerVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Date Picker Modal */}
        {datePickerVisible && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModal}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(_, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                  }}
                  style={{ width: "100%" }}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setDatePickerVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modal: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: "white",
    backgroundColor: "#2c2c2c",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  cancel: { backgroundColor: "#f44336" },
  buttonText: { color: "white", fontWeight: "bold" },
  pickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingBottom: 20,
  },
  pickerModal: {
    backgroundColor: "#1e1e1e",
    padding: 20,
  },
});
