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
            surname: values.surname,
            city: values.city,
            address: values.address,
            phone_number: values.phoneNumber,
            delivery_instructions: values.deliveryInstructions,
            willingness_for_high_shipping_fees: values.willingnessForHighShippingFees,
            wish_list: values.wishList,
            do_not_send: values.doNotSend,
            data_processing_consent: values.dataProcessingConsent,
            i_wont_be_a_bitch: values.IWontBeABitch,
            password: values.password,
          })
          .select("*"),
      ),
    ),
  );
