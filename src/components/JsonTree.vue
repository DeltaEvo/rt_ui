<template>
    <div class="json-object">
        <div class="json-member" v-for="(value, key) in data" :key="key">
            <span>{{ key }}</span>
            <span>:&nbsp;</span>
            <json-tree
                v-if="value !== null && typeof value === 'object'"
                :data="value"
                @change="({ key: vKey, value }) => $emit('change', { key: `${key}.${vKey}`, value })"
            ></json-tree>
            <template v-else>
                <input
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
    props: ['data']
}
</script>

<style lang="stylus">
.json-object {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.json-member {
    text-align: left;
    & > .json-object {
        margin-left: 15px;
    }
}
</style>
