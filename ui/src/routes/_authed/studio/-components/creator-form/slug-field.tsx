import { useEffect, useState } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { checkSlug } from "@/lib/api/creator";
import { type CreatorProfileInput, slugSchema } from "@/lib/schemas/creator";
import { siteHost } from "@/lib/utils/url";

type Availability = "checking" | "available" | "taken" | null;

/** Checks availability as the user types (debounced). */
export function SlugField({
	control,
}: {
	control: Control<CreatorProfileInput>;
}) {
	const slug = useWatch({ control, name: "slug" });
	const [availability, setAvailability] = useState<Availability>(null);

	useEffect(() => {
		const parsed = slugSchema.safeParse(slug);
		if (!parsed.success) {
			setAvailability(null);
			return;
		}
		setAvailability("checking");
		let cancelled = false;
		const timer = setTimeout(async () => {
			try {
				const available = await checkSlug({ data: { slug: parsed.data } });
				if (!cancelled) setAvailability(available ? "available" : "taken");
			} catch {
				if (!cancelled) setAvailability(null);
			}
		}, 400);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [slug]);

	return (
		<Controller
			control={control}
			name="slug"
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid || availability === "taken"}>
					<FieldLabel htmlFor="slug">{"Хуудасны хаяг"}</FieldLabel>
					<div className="flex h-9 items-center rounded-xl sunken transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20">
						<span className="pl-3 text-sm text-muted-foreground select-none">
							{`${siteHost}/`}
						</span>
						<Input
							{...field}
							id="slug"
							autoComplete="off"
							spellCheck={false}
							aria-invalid={fieldState.invalid}
							onChange={(e) => field.onChange(e.target.value.toLowerCase())}
							className="h-full border-0! bg-transparent! pl-0.5 inset-shadow-none! focus-visible:ring-0 aria-invalid:ring-0"
						/>
					</div>
					{fieldState.error ? (
						<FieldError errors={[fieldState.error]} />
					) : (
						<FieldDescription>
							{availability === "checking" && "Шалгаж байна…"}
							{availability === "available" && "✓ Энэ хаяг боломжтой."}
							{availability === "taken" && (
								<span className="text-destructive">
									{"Энэ хаягийг өөр хүн авсан байна."}
								</span>
							)}
							{!availability &&
								"Латин жижиг үсэг, тоо, - эсвэл _. Дараа нь сольж болно; QR код хэвээр ажиллана."}
						</FieldDescription>
					)}
				</Field>
			)}
		/>
	);
}
