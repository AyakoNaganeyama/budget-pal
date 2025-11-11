import { useTransactionStore } from "@/globalStore/transactionStore";
import { supabase } from "@/util/supabase";

export const deleteTransaction = async (transactionId: string) => {
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

   useTransactionStore.getState().removeTransaction(transactionId);

  return true;
};
