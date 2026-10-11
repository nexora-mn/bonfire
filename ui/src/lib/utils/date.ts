// Built by hand instead of Intl: browsers often lack "mn-MN" data and fall
// back to English, so the server and browser text wouldn't match on hydration.

const monthNames = [
	"нэгдүгээр",
	"хоёрдугаар",
	"гуравдугаар",
	"дөрөвдүгээр",
	"тавдугаар",
	"зургаадугаар",
	"долдугаар",
	"наймдугаар",
	"есдүгээр",
	"аравдугаар",
	"арван нэгдүгээр",
	"арван хоёрдугаар",
];

const toDate = (value: string | Date) => new Date(value);

/** "3-р сар" */
export const formatMonthShort = (value: string | Date) =>
	`${toDate(value).getMonth() + 1}-р сар`;

/** "3-р сарын 5" */
export const formatDayMonth = (value: string | Date) => {
	const date = toDate(value);
	return `${date.getMonth() + 1}-р сарын ${date.getDate()}`;
};

/** "2026 оны 3-р сарын 5" */
export const formatDate = (value: string | Date) =>
	`${toDate(value).getFullYear()} оны ${formatDayMonth(value)}`;

/** "2026 оны гуравдугаар сарын 5" */
export const formatLongDate = (value: string | Date) => {
	const date = toDate(value);
	return `${date.getFullYear()} оны ${monthNames[date.getMonth()]} сарын ${date.getDate()}`;
};

/** "2026 оны гуравдугаар сар" */
export const formatMonthYear = (value: string | Date) => {
	const date = toDate(value);
	return `${date.getFullYear()} оны ${monthNames[date.getMonth()]} сар`;
};

/** A "YYYY-MM-DD" date as written, with no timezone shift: "2026 оны 3-р сарын 5". */
export function formatIsoDate(iso: string) {
	const [year, month, day] = iso.split("-").map(Number);
	return `${year} оны ${month}-р сарын ${day}`;
}

/** Local midnight on the 1st; a bare "YYYY-MM" would parse as UTC. */
export const parseMonth = (month: string) => new Date(`${month}-01T00:00:00`);
