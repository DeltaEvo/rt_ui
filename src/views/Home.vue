<template>
  <div class="home">
    <canvas ref="canvas" width="1280" height="800"></canvas>
  </div>
</template>

<script>
import { render } from "../rt"
export default {
  name: "home",
  mounted() {
    const file = `name = "Perspective Cubes"
width = 1280
height = 800

[camera]
        type = "PERSPECTIVE"
        position = { x = 0, y = 0, z = 0 }
        rotation = { x = 0, y = 0, z = 0 }

[[objects]]
        type = "BOX"
        material.type = "NORMAL"
        radius = 0.4
        min = { x = -0.25, y = -0.25, z = -0.25 }
        max = { x = 0.25, y = 0.25, z = 0.25 }
        position = { x = -0.5, y = 0, z = -3 }

[[objects]]
        type = "BOX"
        material.type = "NORMAL"
        radius = 0.4
        min = { x = -0.25, y = -0.25, z = -0.25 }
        max = { x = 0.25, y = 0.25, z = 0.25 }
        position = { x = 0.5, y = 0, z = -20 }`;

    render({
      file,
      canvas: this.$refs.canvas,
      size: { width: 1280, height: 800 }
    })
  }
};
</script>
