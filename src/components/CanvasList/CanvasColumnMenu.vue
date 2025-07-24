<template>
  <ColumnSelector :show="show" :x="x" :y="y" @update:show="onClose" />
</template>
<script setup lang="ts">
import ColumnSelector from '../TorrentList/HeaderMenu.vue'
const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['close'])
const show = ref(true)
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
