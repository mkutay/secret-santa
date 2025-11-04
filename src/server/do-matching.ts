"use server";

import type z from "zod";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { doMatchingSchema } from "@/config/schemas";
import { resultAsyncToActionResult } from "@/types/error-typing";
import { parseSchema } from "@/utils/parse-schema";
import { runQuery } from "@/utils/supabase-run";
import type { Tables } from "@/types/database.types";

interface DoMatchingError {
  code: "NOT_ENOUGH_SUBMISSIONS" | "CONFLICTING_PREFERENCES" | "INVALID_MATCHING";
  message: string;
}

const getSubmissions = (code: string) =>
  runQuery((s) => s.from("secret_santas").select("*").eq("code", code).single()).andThen((secretSanta) =>
    runQuery((s) => s.from("submissions").select("*").eq("secret_santa_id", secretSanta.id)),
  );

class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const shuffleArray = <T>(array: T[], seed?: number): T[] => {
  const result = [...array];
  const rng = seed !== undefined ? new SeededRandom(seed) : null;

  for (let i = result.length - 1; i > 0; i--) {
    const random = rng ? rng.next() : Math.random();
    const j = Math.floor(random * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// check if a giver can give a gift to a receiver
const canMatch = (giver: Tables<"submissions">, receiver: Tables<"submissions">): boolean => {
  if (giver.id === receiver.id) {
    return false;
  }

  // international shipping: giver must be willing to send to different country
  if (giver.country !== receiver.country) {
    if (!giver.willingness_for_high_shipping_fees) {
      return false;
    }
  }

  return true;
};

/**
 * Attempts to create a valid Secret Santa matching using backtracking
 */
const createMatchesWithBacktracking = (
  submissions: Tables<"submissions">[],
  maxAttempts: number = 100,
  seed?: number,
): { id: string; matchedTo: string }[] | null => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffleArray(submissions, seed !== undefined ? seed + attempt : undefined);
    const matches: { [key: string]: string } = {};
    let valid = true;

    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiverIndex = (i + 1) % shuffled.length;
      const receiver = shuffled[receiverIndex];

      if (!canMatch(giver, receiver)) {
        valid = false;
        break;
      }

      matches[giver.id] = receiver.id;
    }

    if (valid) {
      return Object.entries(matches).map(([id, matchedTo]) => ({
        id,
        matchedTo,
      }));
    }
  }

  return null;
};

const createMatches = (
  submissions: Tables<"submissions">[],
  seed?: number,
): ResultAsync<{ id: string; matchedTo: string }[], DoMatchingError> => {
  if (submissions.length < 2) {
    return errAsync({
      code: "NOT_ENOUGH_SUBMISSIONS",
      message: "Eşleme yapmak için en az 2 gönderim gereklidir.",
    } as DoMatchingError);
  }

  const matches = createMatchesWithBacktracking(submissions, 100, seed);

  if (!matches) {
    return errAsync({
      code: "CONFLICTING_PREFERENCES",
      message: "Çakışan tercihler nedeniyle geçerli bir eşleme oluşturulamadı.",
    } as DoMatchingError);
  }

  return okAsync(matches);
};

const validateMatches = (matches: { id: string; matchedTo: string }[]) => {
  const matchedIds = new Set(matches.map((m) => m.id));
  const receiverIds = new Set(matches.map((m) => m.matchedTo));

  // check that everyone is both a giver and a receiver
  if (matchedIds.size !== matches.length || receiverIds.size !== matches.length) {
    return errAsync({
      code: "INVALID_MATCHING",
      message: "Geçersiz eşleme: herkes hem verici hem de alıcı değil.",
    } as DoMatchingError);
  }

  // check that no one is matched to themselves
  if (matches.some((m) => m.id === m.matchedTo)) {
    return errAsync({
      code: "INVALID_MATCHING",
      message: "Geçersiz eşleme: biri kendisine eşleştirilmiş.",
    } as DoMatchingError);
  }

  return okAsync();
};

const updateMatches = (matches: { id: string; matchedTo: string }[]) =>
  ResultAsync.combine(
    matches.map((match) =>
      runQuery((s) => s.from("submissions").update({ matched_to: match.matchedTo }).eq("id", match.id)),
    ),
  );

export const doMatching = async (values: z.infer<typeof doMatchingSchema>) =>
  resultAsyncToActionResult(
    parseSchema(doMatchingSchema, values)
      .asyncAndThen(() => getSubmissions(values.code))
      .andThen((submissions) => createMatches(submissions, values.seed))
      .andThrough(validateMatches)
      .andThen(updateMatches),
  );
