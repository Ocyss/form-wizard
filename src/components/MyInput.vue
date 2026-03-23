<script lang="ts" setup>
import type { InputProps as UInputProps, TextareaProps as UTextareaProps } from "@nuxt/ui";
import UFormField from "@nuxt/ui/components/FormField.vue";

interface TextareaProps extends /* @vue-ignore */ UTextareaProps {
  copyable?: boolean;
  readonly?: boolean;
  isArea: true;
  label?: string;
}

interface InputProps extends /* @vue-ignore */ UInputProps {
  copyable?: boolean;
  readonly?: boolean;
  isArea: false;
  label?: string;
}

const props = withDefaults(defineProps<InputProps | TextareaProps>(), {});
const emit = defineEmits<{
  (e: "copy", value: string): void;
}>();

const modelValue = defineModel<string>({required: true});

</script>

<template>
  <UFormField :label="props.label">
    <UInput
      v-if="!props.isArea"
      v-bind="props"
      :readonly="readonly"
      v-model="modelValue"
    >
      <template v-if="props.copyable && modelValue" #trailing>
        <CopyBtn :value="modelValue" @copy="emit('copy', modelValue)" />
      </template>
    </UInput>
    <UTextarea
      v-else
      v-bind="props"
      trailing
      v-model="modelValue"
      :readonly="readonly"
    >
      <template v-if="props.copyable && modelValue" #trailing>
        <CopyBtn :value="modelValue" @copy="emit('copy', modelValue)" />
      </template>
    </UTextarea>
  </UFormField>
</template>
