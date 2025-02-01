import { runCommand } from "@/features/shared/utills/command.utils";
import "dotenv/config";
import * as process from "node:process";

runCommand(
  `npx supabase gen types typescript --project-id ${process.env.EXPO_PUBLIC_PROJECT_ID} > ./supabase/supabase.ts`,
);
