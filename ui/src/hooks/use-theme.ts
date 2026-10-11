import { useEffect, useState } from "react";
import {
	getStoredTheme,
	setTheme as storeTheme,
	type Theme,
} from "@/lib/theme";

/** Current theme choice and a setter. */
export function useTheme() {
	// localStorage is client-only, so start from "system" and sync after mount.
	const [theme, setThemeState] = useState<Theme>("system");

	useEffect(() => setThemeState(getStoredTheme()), []);

	return {
		theme,
		setTheme: (next: Theme) => {
			storeTheme(next);
			setThemeState(next);
		},
	};
}
