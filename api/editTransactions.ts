// api/updateTransaction.ts
import { supabase } from "@/util/supabase";
export interface UpdateTransactionPayload {
  id: string;
  amount: number;
  type: "expense" | "income";
  categoryId?: string;
  date: Date;
  description?: string;
}

export const updateTransaction = async (
  payload: UpdateTransactionPayload
): Promise<boolean> => {
  const { id, amount, type, categoryId, date, description } = payload;

  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("User not logged in:", sessionError);
    return false;
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      amount,
      type,
      category_id: categoryId,
      date: date.toISOString().split("T")[0], // yyyy-mm-dd
      description: description ?? null,
    })
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error updating transaction:", error);
    return false;
  }

  return true;
};
