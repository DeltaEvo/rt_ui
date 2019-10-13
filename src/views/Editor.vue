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
import { parse, stringify } from "@iarna/toml"
import { set } from "dot-prop"

export default {
  props: ['raw'],
  data() {
    return {
      progress: 1
    }
  },
  computed: {
    scene: {
      get() {
        return parse(this.raw);
      },
      set(value) {
        this.$router.push({ query: { raw: stringify(value) } })
      }
    }
  },
  methods: {
    changeScene({ key, value }) {
      set(this.scene, key, value)
      this.scene = this.scene;
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

