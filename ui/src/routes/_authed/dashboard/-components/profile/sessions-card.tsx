import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrandButton } from "@/components/brand-button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSignOut } from "../use-sign-out";

export function SessionsCard() {
	const signOut = useSignOut();

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
				<BrandButton variant="neutral" onClick={() => signOut()}>
					<HugeiconsIcon icon={Logout03Icon} />
					{"Энэ төхөөрөмжөөс гарах"}
				</BrandButton>
				<BrandButton
					variant="destructive"
					onClick={() => signOut({ everywhere: true })}
				>
					{"Бүх төхөөрөмжөөс гарах"}
				</BrandButton>
			</CardFooter>
		</Card>
	);
}
