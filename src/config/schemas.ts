import z from "zod";

export const countries = [
  "Türkiye",
  "Birleşik Krallık",
  "Hollanda",
  "Almanya",
  "Fransa",
  "İtalya",
  "ABD",
  "Kanada",
  "Avustralya",
  "Diğer (Lütfen adres alanında belirtin)",
];

export const enterCodeSchema = z.object({
  code: z.string().min(1, "Kod gereklidir."),
});

export const seeMatchingSchema = enterCodeSchema.extend({
  password: z.string().min(4, "Parola en az 4 karakter olmalıdır."),
  name: z.string().min(1, "İsim gereklidir."),
});

export const createSubmissionSchema = z.object({
  secretSantaId: z.string().min(1, "Secret Santa kimliği gereklidir."),
  name: z.string().min(1, "İsim gereklidir."),
  surname: z.string().min(1, "Soyadı gereklidir."),
  country: z.enum(countries, "Ülke gereklidir."),
  city: z.string().min(1, "Şehir gereklidir."),
  address: z.string().min(1, "Adres gereklidir."),
  phoneNumber: z.string().min(1, "Telefon numarası gereklidir."),
  deliveryInstructions: z.string().optional(),
  willingnessForHighShippingFees: z.boolean(),
  wishList: z.string().optional(),
  doNotSend: z.string().optional(),
  dataProcessingConsent: z.literal(true, "Veri işleme onayı gereklidir."),
  IWontBeABitch: z.literal(true, "Lütfen bu kutuyu işaretleyin."),
  password: z.string().min(4, "Parola en az 4 karakter olmalıdır."),
});
