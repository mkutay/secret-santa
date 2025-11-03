"use server";

import type z from "zod";

import { createSubmissionSchema } from "@/config/schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

export const submission = async (values: z.infer<typeof createSubmissionSchema>) =>
  resultAsyncToActionResult(
    parseSchema(createSubmissionSchema, values).asyncAndThen(() =>
      runQuery((supabase) =>
        supabase
          .from("submissions")
          .insert({
            secret_santa_id: values.secretSantaId,
            name: values.name,
            country: values.country,
          })
          .select("*"),
      ),
    ),
  );
