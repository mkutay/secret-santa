import z from "zod";

export const enterCodeSchema = z.object({
  code: z.string().min(1, "Code is required."),
});

export const createSubmissionSchema = z.object({
  secretSantaId: z.string().min(1, "Secret Santa ID is required."),
  name: z.string().min(1, "Name is required."),
  country: z.string().min(1, "Country is required."),
});
