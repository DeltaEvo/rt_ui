<template>
  <div class="editor">
    <div class="progress" v-show="progress != 1" :style="`width: ${progress * 100}%`"></div>
    <scene-tree class="tree" :scene="scene" @change="changeScene"></scene-tree>
    <render
      class="render"
      :style="`height: ${scene.height / scene.width * 100}%`"
      :scene="scene"
      @progress="value => progress = value"
    ></render>
  </div>
</template>

<script>
import Render from "../components/Render"
import SceneTree from "../components/SceneTree"
import { parse } from "@iarna/toml"
import { set } from "dot-prop"

const scene = parse(`
name = "Perspective Cubes"
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
        position = { x = 0.5, y = 0, z = -20 }

test = false
`);

export default {
  data() {
    return {
      scene,
      progress: 1
    }
  },
  methods: {
    changeScene({ key, value }) {
      set(this.scene, key, value)
    }
  },
  components: {
    Render,
    SceneTree
  }
};
</script>
<style lang="stylus">
.editor {
  display: flex;
  flex-direction: row;

  & > .progress {
    position: fixed;
    appearance: none;
    top: 0;
    left: 0;
    height: 3px;
    background: #29d;
  }

  & > .tree {
    width: 100%;
    padding: 12px;
  }

  & > .render {
    width: 80vw;
  }
}
</style>

