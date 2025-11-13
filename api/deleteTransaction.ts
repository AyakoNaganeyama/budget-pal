import { supabase } from "@/util/supabase";
import { getMonthlyTransactions } from "./getMonthly";

export const deleteTransaction = async (transactionId: string,monthDate: Date) => {
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error("User not logged in");
    return false;
  }

  const userId = session.user.id;

  // Delete transaction where both id and user_id match
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to delete transaction:", error);
    return false;
  }

  await getMonthlyTransactions(userId, monthDate);

  //  useTransactionStore.getState().removeTransaction(transactionId);


  return true;
};
