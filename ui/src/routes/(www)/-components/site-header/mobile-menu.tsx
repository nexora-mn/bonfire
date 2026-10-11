import { Dialog } from "@base-ui/react/dialog";
import {
	ArrowRight01Icon,
	Cancel01Icon,
	Menu02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { useState } from "react";
import { FlameMark } from "@/components/flame-mark";
import { buttonVariants } from "@/components/ui/button";

const iconButton =
	"grid size-11 place-items-center rounded-full bg-foreground/[0.07] text-foreground transition-colors hover:bg-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";
// Each row slides up a beat after the one before it.
const rise =
	"animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-500 ease-out motion-reduce:animate-none";

export function MobileMenu({ signedIn }: { signedIn: boolean }) {
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const delay = (i: number) => ({ animationDelay: `${80 + i * 60}ms` });

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger
				aria-label="Цэс нээх"
				className={cn(iconButton, "md:hidden")}
			>
				<HugeiconsIcon
					icon={Menu02Icon}
					aria-hidden="true"
					className="size-5"
				/>
			</Dialog.Trigger>
			<Dialog.Portal>
				{/* The popup renders outside the page wrapper, so it sets dark mode itself. */}
				<Dialog.Popup className="dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-5 pb-8 text-foreground transition-[opacity,translate] duration-300 ease-out data-ending-style:-translate-y-4 data-ending-style:opacity-0 data-starting-style:-translate-y-4 data-starting-style:opacity-0 sm:px-8 md:hidden">
					<Dialog.Title className="sr-only">{"Цэс"}</Dialog.Title>
					<div className="flex h-18 shrink-0 items-center justify-between">
						<Link
							to="/"
							onClick={close}
							className="flex items-center gap-2 text-[1.45rem] leading-none font-extrabold"
						>
							<FlameMark className="size-8 text-foreground" />
							{"Bonfire"}
						</Link>
						<Dialog.Close aria-label="Цэс хаах" className={iconButton}>
							<HugeiconsIcon
								icon={Cancel01Icon}
								aria-hidden="true"
								className="size-5"
							/>
						</Dialog.Close>
					</div>

					<nav aria-label="Үндсэн цэс" className="mt-8 flex flex-col">
						<p
							className={cn(rise, "font-hand text-sm text-foreground/50")}
							style={delay(0)}
						>
							{"Хэрэгсэл"}
						</p>
						<Link
							to="/qr-code"
							onClick={close}
							style={delay(1)}
							className={cn(
								rise,
								"group flex items-center justify-between gap-4 border-b border-foreground/10 py-5",
							)}
						>
							<span>
								<span className="display-3 block text-3xl">{"QR код"}</span>
								<span className="mt-1 block text-sm text-foreground/60">
									{"Нэг уншуулахад дэмжлэг. Зурагт хуудас, бараа, лангуунд."}
								</span>
							</span>
							<HugeiconsIcon
								icon={ArrowRight01Icon}
								aria-hidden="true"
								className="size-6 shrink-0 text-flame transition-transform group-hover:translate-x-1"
							/>
						</Link>
						<div
							style={delay(2)}
							className={cn(
								rise,
								"border-b border-foreground/10 py-5 text-foreground/50",
							)}
						>
							<span className="flex items-center gap-3">
								<span className="display-3 text-3xl">{"Стрим мэдэгдэл"}</span>
								<span className="rounded-full bg-flame px-2 py-0.5 font-hand text-xs text-ink">
									{"Удахгүй"}
								</span>
							</span>
							<span className="mt-1 block text-sm text-foreground/45">
								{
									"Шууд дамжуулалтын үеэр дэмжигчдэдээ дэлгэцэн дээр талархал илэрхийл."
								}
							</span>
						</div>
						<Link
							to="/blog"
							onClick={close}
							style={delay(3)}
							className={cn(
								rise,
								"group flex items-center justify-between gap-4 border-b border-foreground/10 py-5",
							)}
						>
							<span className="display-3 text-3xl">{"Блог"}</span>
							<HugeiconsIcon
								icon={ArrowRight01Icon}
								aria-hidden="true"
								className="size-6 shrink-0 text-flame transition-transform group-hover:translate-x-1"
							/>
						</Link>
					</nav>

					<div
						className={cn(rise, "mt-auto grid gap-3 pt-10")}
						style={delay(4)}
					>
						{signedIn ? (
							<Link
								to="/home"
								onClick={close}
								className={buttonVariants({ size: "lg" })}
							>
								{"Хянах самбар"}
							</Link>
						) : (
							<>
								<Link
									to="/signup"
									onClick={close}
									className={buttonVariants({ size: "lg" })}
								>
									{"Хуудсаа нээх"}
								</Link>
								<Link
									to="/login"
									onClick={close}
									className={buttonVariants({ size: "lg", variant: "outline" })}
								>
									{"Нэвтрэх"}
								</Link>
							</>
						)}
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
