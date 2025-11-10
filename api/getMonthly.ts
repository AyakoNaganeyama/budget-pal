import { supabase } from "@/util/supabase";

export const getMonthlyTransactions = async (userId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, category_id (name)") // join to get category name
    .eq("user_id", userId)
    .gte("date", startOfMonth.toISOString())
    .lt("date", endOfMonth.toISOString());

  if (error) throw error;
  return data;
};
