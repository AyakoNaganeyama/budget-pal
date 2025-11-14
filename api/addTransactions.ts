
import { supabase } from "@/util/supabase";

export interface AddTransactionInput {
  amount: number;
 type: "expense";

  categoryId: string;
  description?: string;
  date: Date;
}

export const addTransaction = async (input: AddTransactionInput) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User not logged in");
  }

  const { amount, type, categoryId, description, date } = input;

  const { data, error } = await supabase
    .from("transactions")
    .insert([
      {
        user_id: session.user.id,
        amount,
        type,
        category_id: categoryId,
        description,
        // assuming your column is DATE type, not timestamptz
        date: date.toISOString().split("T")[0],
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Failed to save transaction:", error);
    throw error;
  }

  return data;
};
