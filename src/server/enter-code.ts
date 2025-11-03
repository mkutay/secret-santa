"use server";

import type z from "zod";
import { errAsync, okAsync } from "neverthrow";
import { enterCodeSchema } from "@/config/schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

interface EnterCodeError {
  code: "INVALID_CODE";
  message: string;
}

export const enterCode = async (values: z.infer<typeof enterCodeSchema>) =>
  resultAsyncToActionResult(
    parseSchema(enterCodeSchema, values)
      .asyncAndThen(() => runQuery((supabase) => supabase.from("secret_santas").select("*").eq("code", values.code)))
      .andThen((secretSantas) => {
        if (secretSantas.length === 0) {
          return errAsync({
            code: "INVALID_CODE",
            message: "Girdiğiniz kod geçersiz. Lütfen tekrar deneyin.",
          } as EnterCodeError);
        }
        return okAsync(secretSantas[0]);
      }),
  );
