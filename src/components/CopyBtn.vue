<script lang="ts" setup>
import { ref } from 'vue'
import { copyToClipboard } from '@/utils/copy'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'copy', value: string): void
}>()

const copied = ref(false)

function copy() {
  if (!props.value)
    return
  copyToClipboard(props.value)
  copied.value = true
  emit('copy', props.value)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <UButton
    :color="copied ? 'success' : 'neutral'"
    variant="link"
    size="sm"
    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
    @click="copy"
  />
</template>
