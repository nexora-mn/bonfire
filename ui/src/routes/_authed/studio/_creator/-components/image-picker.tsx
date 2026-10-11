import { Image01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/api/creator";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, type MediaKind } from "@/lib/constants";

/**
 * Avatar and cover uploads are saved on the page by the backend; post and
 * tier images return a key for their form.
 */
export function ImagePicker({
	kind,
	label,
	onUploaded,
	onError,
}: {
	kind: MediaKind;
	label: string;
	onUploaded: (image: { key: string; url: string }) => void | Promise<void>;
	onError: (message: string | null) => void;
}) {
	const input = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState(false);

	return (
		<>
			<input
				ref={input}
				type="file"
				accept={IMAGE_TYPES.join(",")}
				className="hidden"
				onChange={async (event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (!file) return;
					// Checked again on the server; this just saves a pointless upload.
					if (!IMAGE_TYPES.includes(file.type)) {
						return onError("JPEG, PNG, WebP эсвэл GIF зураг сонгоно уу.");
					}
					if (file.size > MAX_IMAGE_BYTES) {
						return onError("Зураг 5 MB-аас ихгүй байх ёстой.");
					}
					onError(null);
					setPending(true);
					try {
						const form = new FormData();
						form.set("kind", kind);
						form.set("file", file);
						const result = await uploadMedia({ data: form });
						if (result.data) await onUploaded(result.data);
						else onError(result.error);
					} finally {
						setPending(false);
					}
				}}
			/>
			<Button
				variant="neutral"
				size="sm"
				disabled={pending}
				onClick={() => input.current?.click()}
			>
				<HugeiconsIcon
					icon={pending ? Loading03Icon : Image01Icon}
					className={pending ? "animate-spin" : undefined}
				/>
				{label}
			</Button>
		</>
	);
}
