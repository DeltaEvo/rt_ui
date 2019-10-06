const rt = new Worker('./worker.js', { type: 'module' });

const ready = new Promise(resolve => rt.onmessage = resolve)

export async function render({ file, canvas, size }) {
	await ready;
	canvas = canvas.transferControlToOffscreen();
	rt.postMessage({
		file,
		canvas,
		size
	}, [canvas])
}