import { addTransaction } from "@/api/addTransactions";
import { fetchCategories } from "@/api/fetchCategory";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const resetForm = () => {
    setAmount("");
    setType("expense");
    setCategory(undefined);
    setDate(new Date());
    setDescription("");
    setErrorMsg("");
  };

  const handleSave = async () => {
    if (!amount || !category) {
      setErrorMsg("Amount and category are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await addTransaction({
        amount: Number(amount),
        type: "expense", // or "expense" if you remove income completely
        categoryId: category,
        description,
        date,
      });

      onSaved();
      onClose();
      resetForm();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save transaction");
      Alert.alert("Failed to save transaction");
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.title}>Add Transaction</Text>

              {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Type picker (optional – remove if only expense) */}
              <View style={{ marginVertical: 5 }}>
                <Text style={styles.label}>Type</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setType("expense")}
                >
                  <Text style={{ color: "white" }}>{type}</Text>
                </TouchableOpacity>
              </View>

              {/* Category picker */}
              <View style={{ marginVertical: 5 }}>
                <Text style={styles.label}>Category</Text>
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
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text style={{ color: "white" }}>{date.toDateString()}</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
              />

              {/* Buttons */}
              <View style={styles.buttons}>
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
                  style={styles.button}
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
        </TouchableWithoutFeedback>

        {/* Category Picker Modal */}
        {categoryPickerVisible && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalIOS}>
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

        {/* Date Picker */}
        {datePickerVisible && Platform.OS === "ios" && (
          <Modal transparent animationType="slide">
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalIOS}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
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

        {datePickerVisible && Platform.OS === "android" && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setDatePickerVisible(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
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
  label: {
    color: "white",
    marginBottom: 5,
    fontWeight: "500",
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
  error: { color: "red", textAlign: "center", marginBottom: 8 },
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
    marginBottom: 30,
  },
  cancel: { backgroundColor: "#f44336" },
  buttonText: { color: "white", fontWeight: "bold" },
  pickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingBottom: 20,
  },
  pickerModalIOS: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "flex-end",
    maxHeight: "50%",
  },
});
