<template>
  <n-dropdown v-model:show="show" :x="x" :y="y" :options="options" @select="onSelect" v-on:clickoutside="onClose" />
</template>
<script setup lang="ts">
import { type DropdownOption } from 'naive-ui'
const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  options: {
    type: Array as PropType<DropdownOption[]>,
    required: true
  }
})
const emit = defineEmits(['select', 'close'])
const show = ref(true)
function onSelect(key: string) {
  emit('select', key)
  show.value = false
}
function onClose() {
  emit('close')
  show.value = false
}
watch(
  () => [props.x, props.y],
  () => {
    show.value = true
  }
)
</script>
