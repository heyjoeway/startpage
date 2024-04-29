import { quartOut } from 'svelte/easing';

function blurFall(node: HTMLElement, params?: {
	duration?: number
	radius?: number
}) {
	return {
		duration: params?.duration || 500,
		css: (t: number) => {
			const radius = params?.radius || 64;
			t = quartOut(t);
			return `
				filter: blur(${radius * (1 - t)}px) opacity(${100 * t}%);
				transform: scale(${1 + (1 - t)}) rotateZ(${15 * (1 - t)}deg);
			`;
		}
	};
}

function blurSink(node: HTMLElement, params?: {
	duration?: number
	radius?: number
}) {
	return {
		duration: params?.duration || 500,
		css: (t: number) => {
			const radius = params?.radius || 64;
			return `
				filter: blur(${radius * (1 - t)}px) opacity(${100 * t}%);
				transform: scale(${t});
			`;
		}
	};
}

export { blurFall, blurSink };