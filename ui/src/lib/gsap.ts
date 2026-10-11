import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
	useGSAP,
	ScrollTrigger,
	ScrollSmoother,
	SplitText,
	DrawSVGPlugin,
);

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP };
