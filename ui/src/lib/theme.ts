export const themes = ["light", "dark", "system"] as const;

export type Theme = (typeof themes)[number];

const storageKey = "theme";
const darkQuery = "(prefers-color-scheme: dark)";

export function getStoredTheme(): Theme {
	try {
		const value = localStorage.getItem(storageKey);
		return themes.includes(value as Theme) ? (value as Theme) : "system";
	} catch {
		return "system";
	}
}

/** Toggles `.dark` on <html>; marketing pages force their own `.dark` scope. */
export function applyTheme(theme: Theme) {
	const dark =
		theme === "dark" ||
		(theme === "system" && window.matchMedia(darkQuery).matches);
	document.documentElement.classList.toggle("dark", dark);
	document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function setTheme(theme: Theme) {
	try {
		localStorage.setItem(storageKey, theme);
	} catch {}
	applyTheme(theme);
}

/**
 * Runs in <head> before first paint so the stored theme never flashes,
 * and keeps "system" in step with the OS for the life of the page.
 */
export const themeScript = `(${String(() => {
	const query = window.matchMedia("(prefers-color-scheme: dark)");
	const apply = () => {
		let theme = "system";
		try {
			theme = localStorage.getItem("theme") ?? "system";
		} catch {}
		const dark = theme === "dark" || (theme !== "light" && query.matches);
		document.documentElement.classList.toggle("dark", dark);
		document.documentElement.style.colorScheme = dark ? "dark" : "light";
	};
	apply();
	query.addEventListener("change", apply);
})})()`;
