<script lang="ts" setup>
import Content from '@/components/sidepanel/content.vue'
import Settings from '@/components/sidepanel/settings.vue'
import { useTab } from '@/composables/useTab'

const { tab, refreshTab } = useTab()
await refreshTab()
// const currentFormID = ref(formArray.value?.[0]?.id)
// const currentForm = computedAsync(async () => await formService.value?.queryForm(currentFormID.value))
const settingsShow = ref(false)
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
  <header v-if="tab" class="flex justify-between *:flex *:items-center *:gap-2 px-3 bg-(--ui-bg-elevated)/85 backdrop-blur border-b border-(--ui-border) h-(--ui-header-height) sticky top-0 z-50">
    <div class="flex-1 max-w-4/7">
      <UButton
        class="cursor-pointer  truncate"
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
    </div>
    <div>
      <UButton :icon="settingsShow ? 'i-icon-park-twotone:back' : 'i-ic:twotone-settings'" color="neutral" size="xs" @click="settingsShow = !settingsShow" />
    </div>
  </header>
  <main class=" px-3 py-2">
    <Settings v-if="settingsShow" />
    <Content v-else />
  </main>
</template>

<style>
</style>
