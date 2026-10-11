/**
 * Colors come from Tailwind classes and CSS variables, so every element's
 * computed paint is inlined; otherwise the file renders black-on-transparent.
 */
export function svgMarkup(svg: SVGSVGElement, size: number) {
	const clone = svg.cloneNode(true) as SVGSVGElement;
	const source = [svg, ...svg.querySelectorAll("*")];
	const target = [clone, ...clone.querySelectorAll("*")];
	source.forEach((el, i) => {
		const style = getComputedStyle(el);
		const out = target[i] as SVGElement;
		out.removeAttribute("class");
		out.setAttribute("fill", style.fill);
		out.setAttribute("stroke", style.stroke);
		out.setAttribute("color", style.color);
	});
	clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	clone.setAttribute("width", String(size));
	clone.setAttribute("height", String(size));
	return new XMLSerializer().serializeToString(clone);
}

/** Rasterizes onto a white square with a quiet-zone margin. */
export async function pngBlob(markup: string, size: number) {
	const img = new Image();
	img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
	await img.decode();
	const margin = Math.round(size * 0.08);
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = size + margin * 2;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas unavailable");
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, margin, margin, size, size);
	return new Promise<Blob>((resolve, reject) =>
		canvas.toBlob(
			(b) => (b ? resolve(b) : reject(new Error("png failed"))),
			"image/png",
		),
	);
}

export function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
