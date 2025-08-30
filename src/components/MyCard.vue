<script lang="ts" setup>
import { computed } from 'vue'
import { useCards } from '@/composables/useCards'

const props = defineProps<{
  info: {
    title: string
    key: string
  }
  editState: boolean
}>()

const { deleteCard, cards } = useCards()

const cardState = computed(() => {
  return cards.value.find(card => card.key === props.info.key)
})
</script>

<template>
  <UCard class="relative" :ui="{ root: 'overflow-visible' }">
    <template #header>
      <div data-swapy-handle class="flex items-center justify-between">
        <div class="text-lg font-medium flex-1">
          {{ props.info.title }}
        </div>
        <slot name="headerRight" />
      </div>
    </template>
    <slot />
    <UButton
      v-if="props.editState || cardState?.isTemp"
      class="rounded-full absolute -top-2 -right-2"
      icon="i-akar-icons:cross"
      size="xs"
      :color="cardState?.isTemp ? 'warning' : 'primary'"
      variant="solid"
      @click="deleteCard(props.info.key, props.editState)"
    />
  </UCard>
</template>

<style>

</style>
