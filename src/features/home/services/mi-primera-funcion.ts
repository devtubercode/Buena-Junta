import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getMyFirstFunctionInvokeData = async (name: string) => {
  const { data, error } = await supabase.functions.invoke(
    "mi-primera-funcion",
    {
      method: "POST",
      body: JSON.stringify({ name }),
    },
  );

  if (error) {
    throw error;
  }
  console.log("Response from mi-primera-funcion:", data);
  return data;
};

export const getMyFirstFunctionFetchData = async (name: string) => {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/mi-primera-funcion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: supabaseKey,
      },
      body: JSON.stringify({ name: `Call function with ${name} fetch` }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error calling mi-primera-funcion");
  }
  console.log("Response from mi-primera-funcion (fetch):", data);
  return data;
};
