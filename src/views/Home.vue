<template>
  <div class="home">
    Hello World I'm a Unicorn <br>
    <router-link :to="{ name: 'editor', query: { raw: scene } }">Editor</router-link><br>
    <upload @input="onUpload">Upload</upload>
  </div>
</template>

<script>

const scene = `
name = "Perspective Cubes"
width = 1280
height = 800

[camera]
        type = "PERSPECTIVE"
        position = { x = 0, y = 0, z = 0 }
        rotation = { x = 0, y = 0, z = 0 }

[[objects]]
        type = "BOX"
        radius = 0.4
        material.type = "NORMAL"
        min = { x = -0.25, y = -0.25, z = -0.25 }
        max = { x = 0.25, y = 0.25, z = 0.25 }
        position = { x = -0.5, y = 0, z = -3 }

[[objects]]
        type = "BOX"
        radius = 0.4
        material.type = "NORMAL"
        min = { x = -0.25, y = -0.25, z = -0.25 }
        max = { x = 0.25, y = 0.25, z = 0.25 }
        position = { x = 0.5, y = 0, z = -20 }
`;

import Upload from "../components/Upload"

export default {
  data() {
    return {
      scene
    }
  },
  methods: {
    async onUpload([file]) {
      const text = await new Response(file).text()

      this.$router.push({ name: 'editor', query: { raw: text }})
    }
  },
  components: {
    Upload
  }
}
</script>

<style>

</style>
