<template>
    <json-tree :data="scene" @change="params => $emit('change', params)"></json-tree>
</template>

<script>
import JsonTree from "./JsonTree"
export default {
    props: ['scene'],
    components: {
        JsonTree
    },
}
</script>

<style>

</style>
