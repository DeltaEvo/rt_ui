const rt = new Worker('./worker.js', { type: 'module' });

const ready = new Promise(resolve => rt.onmessage = resolve)

export async function render({ file, canvas, size }, onProgress) {
	await ready;
	const ctx = canvas.getContext("bitmaprenderer");
	rt.onmessage = ({ data }) => {
		const { id } = data;
		if (id === "render") {
			ctx.transferFromImageBitmap(data.bitmap)
			onProgress && onProgress(data.progress)
		}
	}
	rt.postMessage({
		file,
		size
	})
}