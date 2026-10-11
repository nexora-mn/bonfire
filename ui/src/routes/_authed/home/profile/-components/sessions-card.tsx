import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useSignOut } from "../../../-components/use-sign-out";

export function SessionsCard() {
	const signOut = useSignOut();
	const { showDialog } = useConfirmation();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{"Гарах"}</CardTitle>
				<CardDescription>
					{
						"Өөр төхөөрөмж дээр нэвтэрсэн хэвээр байгаа бол бүгдээс нь нэг дор гарч болно."
					}
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex-wrap justify-end gap-2">
				<Button variant="neutral" onClick={() => signOut()}>
					<HugeiconsIcon icon={Logout03Icon} />
					{"Энэ төхөөрөмжөөс гарах"}
				</Button>
				<Button
					variant="destructive"
					onClick={() =>
						showDialog({
							title: "Бүх төхөөрөмжөөс гарах уу?",
							description:
								"Энэ төхөөрөмжийг оруулаад бүх төхөөрөмж дээр дахин нэвтрэх шаардлагатай болно.",
							variant: "destructive",
							confirmText: "Гарах",
							onConfirm: () => signOut({ everywhere: true }),
						})
					}
				>
					{"Бүх төхөөрөмжөөс гарах"}
				</Button>
			</CardFooter>
		</Card>
	);
}
