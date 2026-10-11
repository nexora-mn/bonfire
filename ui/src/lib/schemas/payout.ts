import { z } from "zod";
import { BANK_CODES } from "../constants";

export const payoutAccountSchema = z.object({
	bankCode: z.enum(BANK_CODES, "Банкаа сонгоно уу."),
	accountHolder: z
		.string()
		.trim()
		.min(2, "Данс эзэмшигчийн нэрийг оруулна уу.")
		.max(100, "Нэр хэт урт байна."),
	accountNumber: z
		.string()
		.transform((v) => v.replaceAll(" ", "").toUpperCase())
		.pipe(
			z
				.string()
				.regex(
					/^([0-9]{6,20}|MN[0-9]{18})$/,
					"Дансны дугаар буруу байна (6–20 оронтой тоо эсвэл IBAN).",
				),
		),
});
