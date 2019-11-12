<template>
  <div class="home">
    <router-link class="item" :to="{ name: 'editor', query: { raw: scene } }">
      Editor
    </router-link>
    <upload class="item" @input="onUpload">
      Upload
    </upload>
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

<style lang="stylus">
  .home {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-height: 100vh;
    padding: 0 15vw;

   .item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-decoration: none;
      color: #FF9883;
      background-color: #3A3A3A;
      width: 200px;
      height: 200px;
    }
  }
</style>
