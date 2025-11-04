"use server";

import type z from "zod";
import { errAsync, okAsync, safeTry } from "neverthrow";

import { seeMatchingSchema } from "@/config/schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";

interface SeeMatchingError {
  code: "INVALID_CODE" | "NOT_FOUND" | "MATCHING_NOT_DONE" | "HUH";
  message: string;
}

export type PersonInformation = ReturnType<Awaited<ReturnType<typeof seeMatchingResultAsync>>["_unsafeUnwrap"]>;

const seeMatchingResultAsync = (values: z.infer<typeof seeMatchingSchema>) =>
  safeTry(async function* () {
    const parsed = yield* parseSchema(seeMatchingSchema, values);
    const secretSantas = yield* await runQuery((supabase) =>
      supabase.from("secret_santas").select("*").eq("code", parsed.code),
    );

    if (secretSantas.length === 0) {
      yield* errAsync({
        code: "INVALID_CODE",
        message: "Girdiğiniz kod geçersiz. Lütfen tekrar deneyin.",
      } as SeeMatchingError);
    }

    const submissions = yield* await runQuery((s) =>
      s
        .from("submissions")
        .select("*")
        .eq("secret_santa_id", secretSantas[0].id)
        .eq("password", parsed.password)
        .like("name", parsed.name),
    );

    if (submissions.length === 0) {
      yield* errAsync({
        code: "NOT_FOUND",
        message: "Parola veya isim geçersiz. Lütfen tekrar deneyin.",
      } as SeeMatchingError);
    }
    if (submissions.length > 1) {
      yield* errAsync({
        code: "HUH",
        message: "Bir şeyler ters gitti. Birden fazla eşleşme bulundu.",
      } as SeeMatchingError);
    }

    const subm = submissions[0];
    const matchedTo = subm.matched_to;
    if (matchedTo === null) {
      return yield* errAsync({
        code: "MATCHING_NOT_DONE",
        message: "Eşlemeniz henüz yapılmadı. Lütfen daha sonra tekrar deneyin.",
      } as SeeMatchingError);
    }

    const matchedSubmission = yield* await runQuery((s) =>
      s.from("submissions").select("*").eq("id", matchedTo).single(),
    );

    return okAsync({
      name: matchedSubmission.name,
      surname: matchedSubmission.surname,
      country: matchedSubmission.country,
      city: matchedSubmission.city,
      address: matchedSubmission.address,
      phoneNumber: matchedSubmission.phone_number,
      deliveryInstructions: matchedSubmission.delivery_instructions,
      wishList: matchedSubmission.wish_list,
      doNotSend: matchedSubmission.do_not_send,
    });
  });

export const seeMatching = async (values: z.infer<typeof seeMatchingSchema>) =>
  resultAsyncToActionResult(seeMatchingResultAsync(values));
