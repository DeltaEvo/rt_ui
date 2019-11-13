<template>
  <div class="editor">
    <div class="progress" v-show="progress != 1" :style="`width: ${progress * 100}%`"></div>
    <scene-tree class="tree" :scene="scene" @change="changeScene" @delete="deleteScene"></scene-tree>
    <div class="render">
      <render
        :scene="scene"
        @progress="value => progress = value"
      ></render>
    </div>
  </div>
</template>

<script>
import Render from "../components/Render"
import SceneTree from "../components/SceneTree"
import { parse, stringify } from "@iarna/toml"
import * as dot from "dot-prop"

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
      dot.set(this.scene, key, value)
      this.scene = this.scene;
    },
    deleteScene(key) {
      dot.delete(this.scene, key)
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
    background: #FF9883;
  }

  & > .tree {
    width: 350px;
    height: 100vh;
    padding: 12px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0 !important
    }

  }

  & > .render {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    canvas {
      width: 100%;
    }
  }
}
</style>

