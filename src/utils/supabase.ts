/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";

export const supabase = createClient(
  env.DATABASE_API_URL,
  env.DATABASE_API_KEY
);
