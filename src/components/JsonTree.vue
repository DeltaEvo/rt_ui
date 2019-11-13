<template>
    <div class="json-object">
        <div
          class="json-member"
          :class="{ collapsed: key in collapsed }"
          v-for="(value, key) in data"
          :key="key">
            <span class="key" @click="onClick(key)" @contextmenu.prevent="$emit('menu', { $event,  key })">{{ key }}:&nbsp;</span>
            <json-tree
                v-if="value !== null && typeof value === 'object'"
                :data="value"
                @menu="({ key: vKey, $event }) => $emit('menu', { key: `${key}.${vKey}`, $event })"
                @change="({ key: vKey, value }) => $emit('change', { key: `${key}.${vKey}`, value })"
            ></json-tree>
            <template v-else>
                <input
                    class="value"
                    step="any"
                    :type="{ boolean: 'checkbox', number: 'number', string: 'text'}[typeof value]"
                    :value="value"
                    @change="({ target }) => $emit('change', { key, value: ({
                        boolean: target => target.checked,
                        number: target => +target.value,
                        string: target => target.value
                    }[typeof value])(target) })"
                >
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'json-tree',
    props: ['data'],
    data() {
        return { collapsed: {} };
    },
    methods: {
        onClick(key) {
            if (typeof this.data[key] == 'object') {
                if (key in this.collapsed)
                    this.$delete(this.collapsed, key)
                else
                    this.$set(this.collapsed, key, true)
            }
        }
    }
}
</script>

<style lang="stylus">
.json-member {
    text-align: left;
    color: #A8A8A8;

    & > .json-object {
        margin-left: 15px;
    }

    &.collapsed > .json-object  {
        height: 0;
    }

    &.collapsed > .key::after {
        color: #E6E1E1;
        content: "[...]";
    }

    .value {
       font-size: inherit;
       color: #E6E1E1;
       background-color: transparent;
       border: none;
    }

    .key {
        cursor: pointer;
    }
}

.json-object {
    overflow: hidden;
    font-size: 16px;
	color: #E6E1E1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
