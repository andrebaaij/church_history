import { z } from "zod";

export const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ids must be lowercase-kebab-case");

export const LANGS = ["en", "nl"] as const;
export type Lang = (typeof LANGS)[number];

export const I18nText = z.object({ en: z.string().min(1) }).catchall(z.string().min(1));
export type I18nText = z.infer<typeof I18nText>;

export const Grade = z.enum(["A", "B", "C", "D", "E"]);
export type Grade = z.infer<typeof Grade>;
export const GRADES: Grade[] = [...Grade.options];

export const When = z
  .object({ from: z.number().int(), to: z.number().int(), circa: z.boolean().default(false) })
  .refine((w) => w.from <= w.to, { message: "when.from must be <= when.to", path: ["to"] });
export type When = z.infer<typeof When>;

export const LonLat = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
export type LonLat = z.infer<typeof LonLat>;

export const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "colours are #rrggbb");
