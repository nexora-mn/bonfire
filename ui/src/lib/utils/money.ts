// en-US grouping: mn-MN output differs between ICU builds and breaks hydration.
const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatAmount = (amount: number) =>
	grouped.format(Math.round(amount));

export const formatMNT = (amount: number) => `${formatAmount(amount)}₮`;
