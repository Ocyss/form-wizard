<script lang="ts" setup>
import type { AlertProps } from '@nuxt/ui'
import { tv } from 'tailwind-variants'

interface Props extends /* @vue-ignore */ AlertProps {
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const alert = tv({
  base: 'border',
  variants: {
    color: {
      primary: 'bg-(--ui-primary)/10  border-(--ui-primary)/25 text-(--ui-color-primary-600) dark:text-(--ui-color-primary-300)',
      secondary: 'bg-(--ui-secondary)/10 border-(--ui-secondary)/25 text-(--ui-color-secondary-600) dark:text-(--ui-color-secondary-300)',
      success: 'bg-(--ui-success)/10 border-(--ui-success)/25 text-(--ui-color-success-600) dark:text-(--ui-color-success-300)',
      info: 'bg-(--ui-info)/10 border-(--ui-info)/25 text-(--ui-color-info-600) dark:text-(--ui-color-info-300)',
      warning: 'bg-(--ui-warning)/10 border-(--ui-warning)/25 text-(--ui-color-warning-600) dark:text-(--ui-color-warning-300)',
      error: 'bg-(--ui-error)/10 border-(--ui-error)/25 text-(--ui-color-error-600) dark:text-(--ui-color-error-300)',
      neutral: 'bg-(--ui-neutral)/10 border-(--ui-neutral)/25 text-(--ui-color-neutral-600) dark:text-(--ui-color-neutral-300)',
    },
  },
})
</script>

<template>
  <UAlert
    v-bind="props"
    :class="alert({ color: props.color, class: props.class })"
  />
</template>
