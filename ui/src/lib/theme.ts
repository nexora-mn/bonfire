export const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

const storageKey = "theme";

export function getStoredTheme(): Theme {
	try {
		const value = localStorage.getItem(storageKey);
		return themes.includes(value as Theme) ? (value as Theme) : "system";
	} catch {
		return "system";
	}
}

/** Marketing pages force their own `.dark` scope, so this only affects the app. */
export function setTheme(theme: Theme) {
	try {
		localStorage.setItem(storageKey, theme);
	} catch {}
	const dark =
		theme === "dark" ||
		(theme === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", dark);
	document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/**
 * Runs in <head> before first paint so the stored theme never flashes, and
 * keeps "system" in step with the OS. Kept as a literal string: stringifying
 * a function gives different text on the server and in the browser, which
 * breaks hydration.
 */
export const themeScript = `(() => {
	const query = window.matchMedia("(prefers-color-scheme: dark)");
	const apply = () => {
		let theme = "system";
		try {
			theme = localStorage.getItem("${storageKey}") ?? "system";
		} catch {}
		const dark = theme === "dark" || (theme !== "light" && query.matches);
		document.documentElement.classList.toggle("dark", dark);
		document.documentElement.style.colorScheme = dark ? "dark" : "light";
	};
	apply();
	query.addEventListener("change", apply);
})()`;
