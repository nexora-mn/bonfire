import type { IconSvgElement } from "@hugeicons/react";
import type { LinkProps } from "@tanstack/react-router";

export type ShellNavItem = {
	to: LinkProps["to"];
	label: string;
	icon: IconSvgElement;
	/** Only match this exact path (an area's root would otherwise match all). */
	exact?: boolean;
	/** Show in the phone tab bar; the rest go under "more". Defaults to true. */
	mobile?: boolean;
};

export type ShellNavGroup = {
	label: string;
	items: ShellNavItem[];
};

/** A way out of the area, pinned above everything in the rail. */
export type ShellBack = {
	to: LinkProps["to"];
	label: string;
};

export type ShellAction = {
	to: LinkProps["to"];
	search?: Record<string, unknown>;
	label: string;
	icon: IconSvgElement;
};
