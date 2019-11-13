<template>
    <div class="scene-tree">
        <json-tree
            class="json-tree"
            :data="augmentedScene"
            @change="params => $emit('change', params)"
            @menu="({ key, $event }) => $refs.menu.open($event, { key })"
        ></json-tree>

        <vue-context ref="menu">
            <template slot-scope="child" v-if="child.data">
                <li>
                    <a href="#" @click.prevent="$emit('delete', child.data.key)">
                        Delete
                    </a>
                </li>
                <li v-if="isObject(child.data.key)">
                    <a href="#" @click.prevent="addProperty(child.data.key)">
                        Add
                    </a>
                </li>            
            </template>
        </vue-context>
    </div>
</template>

<script>
import { VueContext } from 'vue-context';
import JsonTree from "./JsonTree"
import * as dot from "dot-prop"

export default {
    props: ['scene'],
    computed: {
        augmentedScene() {
            return Object.assign({
                name: '',
                width: 0,
                height: 0,
                camera: {},
                objects: [],
                lights: [],
                filters: []
            }, this.scene)
        }
    },
    methods: {
        isObject(key) {
            return typeof dot.get(this.augmentedScene, key) === 'object'
        },
        addProperty(key) {
            const value = dot.get(this.augmentedScene, key)
            if (Array.isArray(value)) {
                this.$emit('change', { key, value: [...value, {}]})
            } else {
                const name = prompt("name: ");
                const type = prompt("type (bool/number/string/object): ");
                const values = { 'bool': true, 'number': 0, 'string': "", 'object': {}}
                
                if (name && type && type in values)
                    this.$emit('change', { key: `${key}.${name}`, value: values[type] })
            }
        }
    },
    components: {
        VueContext,
        JsonTree
    },
}
</script>

<style lang="stylus">
    @import '~vue-context/dist/css/vue-context.css';

    .scene-tree {
        background-color: #3A3A3A;

        .v-context {
            background-color: #3A3A3A;

            & > li > a {
                color: #FF9883;

                &:hover {
                    background-color #A8A8A8
                }
            }
        }

        .json-tree > .json-member {
            color: #FF9883;
        }
    }
</style>