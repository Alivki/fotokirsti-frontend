import { z } from "zod";

export const categoryEnum = z.enum([
    "Barn",
    "Familie",
    "Portrett",
    "Konfirmant",
    "Bryllup",
    "Produkt",
    "Reklame",
]);

export const medalEnum = z.enum([
    "Gull",
    "Sølv",
    "Bronse",
    "Hederlig omtale",
]);

export const photoUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "Filen er for stor (maks 10MB)",
        })
        .refine((file) => file.type.startsWith("image/"), {
            message: "Filen må være et bilde",
        }),

    preview: z.string(),

    title: z
        .string()
        .trim()
        .min(1, "Du må fylle inn tittel"),
    alt: z
        .string()
        .trim()
        .min(1, "Du må fylle inn beskrivelse/alt-tekst"),

    published: z.boolean().default(true),

    category: z
        .union([categoryEnum, z.literal(""), z.null(), z.undefined()])
        .refine((val) => val != null && val !== "", {
            message: "Du må velge kategori",
        }),

    hasPrize: z.boolean().default(false),

    prizeTitle: z.string().trim().optional().nullable(),
    prizeMedal: medalEnum.optional().nullable(),
}).superRefine((data, ctx) => {
    if (data.hasPrize) {
        if (!data.prizeTitle) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Du må legge inn pris-tittel",
                path: ["prizeTitle"],
            });
        }

        if (!data.prizeMedal) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Du må velge medalje",
                path: ["prizeMedal"],
            });
        }
    }
});
