import { quartOut } from 'svelte/easing';
import { UAParser } from 'ua-parser-js';

const { browser, cpu, device } = UAParser();

function blurFall(node: HTMLElement, params?: {
	duration?: number
	radius?: number
}) {
	return {
		duration: params?.duration || 500,
		css: (t: number) => {
			const radius = params?.radius || 64;
			t = quartOut(t);
			let out = `
				filter: blur(${radius * (1 - t)}px) opacity(${100 * t}%);
			`;
			if (device.type !== 'mobile') out += `
				scale: ${1 + (1 - t)};
				rotate: z ${15 * (1 - t)}deg;
			`;
			return out;
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
			let out = `
				filter: blur(${radius * (1 - t)}px) opacity(${100 * t}%);
			`;
			if (device.type !== 'mobile') out += `
				scale: ${t};
			`;
			return out;
		}
	};
}

export { blurFall, blurSink };