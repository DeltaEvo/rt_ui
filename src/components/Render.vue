<template>
    <canvas :width="scene.width" :height="scene.height"></canvas>
</template>

<script>
import { render } from "../rt"
import { stringify } from "@iarna/toml"

export default {
    props: ['scene'],
    mounted() {
        render({
            file: stringify(this.scene),
            canvas: this.$el,
            size: { width: this.scene.width, height: this.scene.height }
        }, progress => this.$emit("progress", progress))
    },
    watch: {
        scene: {
            handler(val) {
                console.log(stringify(val))
                render({
                    file: stringify(val),
                    canvas: this.$el,
                    size: { width: val.width, height: val.height }
                }, progress => this.$emit("progress", progress))
                console.log("Scene watch")
            },
            deep: true
        }
    }
}
</script>