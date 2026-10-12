import { Menu } from "@base-ui/react/menu";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@tanstack/react-router";
import { cn } from "cn";

const itemClass =
	"flex flex-col gap-0.5 rounded-2xl px-4 py-3 outline-none select-none";

export function ResourcesMenu({ className }: { className?: string }) {
	return (
		<Menu.Root>
			<Menu.Trigger
				className={cn(
					"group items-center gap-1 rounded-full px-4 py-2 text-[0.95rem] font-medium uppercase text-foreground/75 transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none data-popup-open:text-foreground",
					className,
				)}
			>
				{"Хэрэгсэл"}
				<HugeiconsIcon
					icon={ArrowDown01Icon}
					aria-hidden="true"
					className="size-4 transition-transform group-data-popup-open:rotate-180"
				/>
			</Menu.Trigger>
			<Menu.Portal>
				<Menu.Positioner sideOffset={8} align="start" className="z-50">
					{/* The popup renders outside the page wrapper, so it sets dark mode itself. */}
					<Menu.Popup className="dark w-80 origin-(--transform-origin) rounded-[1.75rem] border border-foreground/10 bg-card p-2 text-foreground shadow-2xl shadow-black/40 transition-[opacity,scale] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
						<Menu.LinkItem
							render={<Link to="/qr-code" />}
							className={cn(itemClass, "data-highlighted:bg-foreground/[0.06]")}
						>
							<span className="font-semibold">{"QR код"}</span>
							<span className="text-sm text-foreground/60">
								{"Нэг уншуулахад дэмжлэг. Зурагт хуудас, бараа, лангуунд."}
							</span>
						</Menu.LinkItem>
						<Menu.Item disabled className={cn(itemClass, "cursor-default")}>
							<span className="flex items-center gap-2 font-semibold text-foreground/60">
								{"Стрим мэдэгдэл"}
								<span className="rounded-full bg-flame px-2 py-0.5 font-hand text-xs text-ink">
									{"Удахгүй"}
								</span>
							</span>
							<span className="text-sm text-foreground/45">
								{
									"Шууд дамжуулалтын үеэр дэмжигчдэдээ дэлгэцэн дээр талархал илэрхийл."
								}
							</span>
						</Menu.Item>
					</Menu.Popup>
				</Menu.Positioner>
			</Menu.Portal>
		</Menu.Root>
	);
}
