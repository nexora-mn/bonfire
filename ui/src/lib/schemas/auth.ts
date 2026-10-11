import { z } from "zod";

export const credentialsSchema = z.object({
	email: z.email("Зөв имэйл хаяг оруулна уу."),
	password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байна."),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Нэрээ оруулна уу.")
		.max(80, "Нэр хэт урт байна."),
});

export const passwordSchema = credentialsSchema.pick({ password: true });

/** Password form: the confirmation is checked in the browser only. */
export const newPasswordSchema = passwordSchema
	.extend({ confirm: z.string() })
	.refine((v) => v.password === v.confirm, {
		message: "Нууц үгнүүд таарахгүй байна.",
		path: ["confirm"],
	});
