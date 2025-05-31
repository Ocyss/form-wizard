<script lang="ts" setup>
import type { InputProps, TextareaProps } from '@nuxt/ui'

const props = withDefaults(
  defineProps<
    (InputProps & {
      copyable?: boolean
      readonly?: boolean
      isArea?: false
    }) | (TextareaProps & {
      copyable?: boolean
      readonly?: boolean
      isArea: true
    })
  >(),
  {},
)
const emit = defineEmits<{
  (e: 'copy', value: string): void
}>()

const modelValue = defineModel<string | null>()

function updateModelValue(value: string | number | null) {
  if (props.readonly) {
    return
  }
  modelValue.value = value as string | null
}
</script>

<template>
  <UInput v-if="!props.isArea" v-bind="props" :model-value="modelValue" @update:model-value="updateModelValue">
    <template v-if="props.copyable && modelValue" #trailing>
      <CopyBtn :value="modelValue" @copy="emit('copy', modelValue)" />
    </template>
  </UInput>
  <UTextarea v-else v-bind="props" :model-value="modelValue" trailing @update:model-value="updateModelValue">
    <template v-if="props.copyable && modelValue" #trailing>
      <CopyBtn :value="modelValue" @copy="emit('copy', modelValue)" />
    </template>
  </UTextarea>
</template>
