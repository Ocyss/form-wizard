<script lang="ts" setup>
import type { InputProps } from '@nuxt/ui'

const props = withDefaults(
  defineProps<
    InputProps & {
      copyable?: boolean
      readonly?: boolean
    }
  >(),
  {},
)

const modelValue = defineModel<string | null>()
const copied = ref(false)

function copy() {
  if (!modelValue.value)
    return
  navigator.clipboard.writeText(modelValue.value)
  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function updateModelValue(value: string | number | null) {
  if (props.readonly) {
    return
  }
  modelValue.value = value as string | null
}
</script>

<template>
  <UInput v-bind="props" :model-value="modelValue" @update:model-value="updateModelValue">
    <template v-if="props.copyable && modelValue" #trailing>
      <UTooltip text="Copy to clipboard" :content="{ side: 'right' }">
        <UButton
          :color="copied ? 'success' : 'neutral'"
          variant="link"
          size="sm"
          :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          @click="copy"
        />
      </UTooltip>
    </template>
  </UInput>
</template>
