const decoder = new TextDecoder();
const encoder = new TextEncoder();

(async function() {
  const memory = new WebAssembly.Memory({
    initial: 2,
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
	  offset: 0,
	  ctx: null,
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
        rt_render_update(pixels) {
          const pixbuf = new Uint8ClampedArray(
            memory.buffer,
            pixels,
            global.size.width * global.size.height * 4
          );

          for (let i = global.offset * 4; i < (global.offset + global.size.width) * 4; i += 4) {
            const tmp = pixbuf[i];
            pixbuf[i] = pixbuf[i + 2];
            pixbuf[i + 2] = tmp;
            pixbuf[i + 3] = 255;
          }
          global.offset += global.size.width;

          const image = new ImageData(pixbuf, global.size.width);
          global.ctx.putImageData(image, 0, 0);
          global.ctx.commit();
        },
      },
    }
  );

  self.onmessage = msg => {
	  const { file, size, canvas } = msg.data
	  const ctx = canvas.getContext('2d', {
		alpha: false,
	   });

	   global.ctx = ctx;
	   global.size = size;
	   global.offset = 0
		const ptr = malloc.exports.malloc(file.length);

		new Uint8Array(memory.buffer).set(encoder.encode(file), ptr);

		const pixels = rt.exports.rt_render(ptr, file.length);
  }
  self.postMessage("ready");

})();
