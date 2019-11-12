const decoder = new TextDecoder();
const encoder = new TextEncoder();

(async function() {
  const memory = new WebAssembly.Memory({
    initial: 200,
  });

  const {instance: malloc} = await WebAssembly.instantiateStreaming(
    fetch('/wasm/malloc.wasm'),
    {
      env: {memory},
    }
  );

  const {instance: libm} = await WebAssembly.instantiateStreaming(
    fetch('/wasm/libm.wasm')
  );

  const global = {
    ctx: null,
    canvas: null,
	  size: null
  }

  const {instance: rt} = await WebAssembly.instantiateStreaming(
    fetch('/wasm/rt.wasm'),
    {
      env: {
        ...libm.exports,
        ...malloc.exports,
        memory,
        assert() {
          console.log('assert', arguments);
        },
        write(fd, address, size) {
          const msg = decoder.decode(
            new Uint8Array(memory.buffer).slice(address, address + size)
          );
          console.log('Write', msg);
        },
        open() {
         console.log('open', arguments)
        },
        close() {
         console.log('open', arguments)
        },
        perror() {
         console.log('perror', arguments)
        },
        read(fd, address, size) {
          return -1;
        },
        strlen() {
          console.log('strlen', arguments);
          return 0;
        },
        getpixel() {
          console.log('getpixel', arguments);
          return 0;
        },
        load_image() {
          console.log('load_image', arguments);
          return 0;
        },
        get_image_error() {
          console.log('get_image_error', arguments);
        },
        free_image() {
          console.log('free_image', arguments);
        },
        printf() {
          console.log('printf', arguments);
        },
        rand() {
          return Math.random() * 10000
        },
        rt_render_update(pixels, progress) {
          const pixbuf = new Uint8ClampedArray(
            memory.buffer,
            pixels,
            global.size.width * global.size.height * 4
          );

          const image = new ImageData(pixbuf, global.size.width);
          global.ctx.putImageData(image, 0, 0);
          const bitmap = global.canvas.transferToImageBitmap();
          self.postMessage({
            id: "render",
            bitmap,
            progress: Math.min(progress / (global.size.width * global.size.height), 1) 
          }, [bitmap])
        },
      },
    }
  );

  self.onmessage = msg => {
    const { file, size } = msg.data
    
    const canvas = new OffscreenCanvas(size.width || 0, size.height || 0);

	  const ctx = canvas.getContext('2d');

    global.ctx = ctx;
    global.canvas = canvas;
    global.size = size;
    global.offset = 0
		const ptr = malloc.exports.malloc(file.length);

		new Uint8Array(memory.buffer).set(encoder.encode(file), ptr);

		const pixels = rt.exports.rt_render(ptr, file.length);
  }
  self.postMessage({ id: "ready" });

})();
