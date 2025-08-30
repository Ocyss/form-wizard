<script lang="ts" setup>
import type { InputProps as UInputProps, TextareaProps as UTextareaProps } from '@nuxt/ui'

interface TextareaProps extends /* @vue-ignore */ UTextareaProps {
  copyable?: boolean
  readonly?: boolean
  isArea: true
}

interface InputProps extends /* @vue-ignore */ UInputProps {
  copyable?: boolean
  readonly?: boolean
  isArea: false
}

const props = withDefaults(
  defineProps<InputProps | TextareaProps>(),
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
