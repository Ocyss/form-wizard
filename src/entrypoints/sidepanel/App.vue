<script lang="ts" setup>
import { useTab } from './hooks/useTab'

const { tab, refreshTab, formMap } = useTab()
void refreshTab()

function highlightTab() {
  if (!tab.value?.id) {
    return
  }
  chrome.tabs.update(tab.value.id, {
    active: true,
  }, () => {
    console.log('highlighted')
  })
}

</script>

<template>
  <UApp>
    <header v-if="tab" class="flex items-center gap-2 bg-(--ui-bg-elevated)/85 backdrop-blur border-b border-(--ui-border) h-(--ui-header-height) sticky top-0 z-50">
      <UButton
        class="cursor-pointer max-w-3/7 truncate"
        :title="tab.title"
        :avatar="{
          src: tab.favIconUrl,
          size: 'sm',
        }"
        size="lg"
        color="neutral"
        variant="link"
        @click="highlightTab()"
      >
        {{ tab.title }}
      </UButton>
      <UButton class="font-bold rounded-full" icon="i-ic:twotone-sync" color="neutral" size="xs" @click="refreshTab()" />
    </header>
    <main class=" px-3 py-2">
      <UCard v-for="form in formMap" :key="form.id">
        <template #header>
          {{ form.title }}
        </template>

        <Placeholder class="h-32" />
      </UCard>
    </main>
  </UApp>
</template>

<style>
</style>
