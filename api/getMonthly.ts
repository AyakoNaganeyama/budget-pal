import { Transaction, useTransactionStore } from "@/globalStore/transactionStore";
import { supabase } from "@/util/supabase";

export const getMonthlyTransactions = async (userId: string, monthDate?: Date) => {
  const date = monthDate ?? new Date();
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const { data, error } = await supabase
  .from("transactions")
  .select("id, amount, date, description, category_id (name)") // include id & date & description
  .eq("user_id", userId)
  .gte("date", startOfMonth.toISOString())
  .lt("date", endOfMonth.toISOString());

    const setTransactions = useTransactionStore.getState().setTransactions;
  setTransactions(data as Transaction[]);



  if (error) throw error;
 return data as Transaction[];
};
