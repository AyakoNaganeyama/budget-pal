// api/categories.ts
import { supabase } from "@/util/supabase";

export interface Category {
  id: string;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
};
