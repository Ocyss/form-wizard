<script lang="tsx" setup>
import type { SlotItemMapArray, Swapy } from "swapy";
import UButton from "@nuxt/ui/components/Button.vue";
import UCard from "@nuxt/ui/components/Card.vue";
import USelectMenu from "@nuxt/ui/components/SelectMenu.vue";
import { utils } from "swapy";
import { computed, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { useCards } from "@/composables/useCards";
import { useTab } from "@/composables/useTab";
import { useGlobalSettings } from "@/composables/useGlobalSettings";
import { getCountryList } from "@/utils/names";

const {
  cards,
  cardMap,
  unusedCards,
  addCard,
  initCards,
  saveCards,
  editState: cardEditState,
} = useCards();

await initCards();

const { settings, init: initSettings, updateSettings } = useGlobalSettings();
await initSettings();

const countries = getCountryList();
const countryOptions = [
  { code: "", name: "默认", icon: "" },
  ...countries.map((c) => ({ code: c.code, name: c.name, icon: c.icon })),
];

const languageOptions = [
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
];

const currentCountry = computed(() => {
  return countries.find((c) => c.code === settings.value.countryCode) || null;
});

const container = useTemplateRef("container");
const swapy = ref<Swapy | null>(null);
const slotItemMap = ref<SlotItemMapArray>([...utils.initSlotItemMap(cards.value, "key")]);

watch(
  cards,
  () =>
    utils.dynamicSwapy(
      swapy.value,
      cards.value,
      "key",
      slotItemMap.value,
      (value: SlotItemMapArray) => (slotItemMap.value = value),
    ),
  { deep: true },
);

const slottedItems = computed(() => utils.toSlottedItems(cards.value, "key", slotItemMap.value));

onUnmounted(() => {
  swapy.value?.destroy();
});

const { tab, refreshTab } = useTab();
await refreshTab();
// const currentFormID = ref(formArray.value?.[0]?.id)
// const currentForm = computedAsync(async () => await formService.value?.queryForm(currentFormID.value))

const editState = ref(false);

function highlightTab() {
  if (!tab.value?.id) {
    return;
  }
  chrome.tabs.update(
    tab.value.id,
    {
      active: true,
    },
    () => {
      console.log("highlighted");
    },
  );
}

async function editCard() {
  editState.value = !editState.value;
  if (editState.value) {
    // TODO: 样式bug
    // if (container.value) {
    //   swapy.value = createSwapy(container.value, {
    //     manualSwap: true,
    //     animation: 'none',
    //     autoScrollOnDrag: true,
    //     dragAxis: 'y',
    //     swapMode: 'hover',
    //   })
    //   swapy.value.onSwap((event) => {
    //     requestAnimationFrame(() => {
    //       slotItemMap.value = event.newSlotItemMap.asArray
    //     })
    //   })
    // }
  } else {
    await initCards();
    swapy.value?.destroy();
  }
}
</script>

<template>
  <header
    v-if="tab"
    class="flex justify-between *:flex *:items-center *:gap-2 px-3 bg-(--ui-bg-elevated)/85 backdrop-blur border-b border-(--ui-border) h-(--ui-header-height) sticky top-0 z-50"
  >
    <div class="flex-1 max-w-4/7">
      <UButton
        class="cursor-pointer truncate"
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
      <UButton
        class="font-bold rounded-full"
        icon="i-ic:twotone-sync"
        color="neutral"
        size="xs"
        @click="refreshTab()"
      />
    </div>
    <div>
      <USelectMenu
        :model-value="currentCountry || countryOptions[0]"
        :items="countryOptions"
        placeholder="全局地区"
        label-key="name"
        size="xs"
        class="w-28"
        ui="{ content: 'min-w-fit' }"
        :icon="currentCountry?.icon"
        @update:model-value="(v: any) => updateSettings({ countryCode: v?.code || '' })"
      />
      <UButton
        :icon="editState ? 'i-icon-park-twotone:back' : 'i-icon-park-twotone:edit'"
        color="neutral"
        size="xs"
        @click="editCard()"
      />
      <UButton
        v-if="cardEditState"
        icon="i-icon-park-twotone:save"
        color="neutral"
        size="xs"
        @click="
          () => {
            saveCards();
            editState = false;
          }
        "
      />
    </div>
  </header>
  <main class="p-5 space-y-6">
    <div ref="container" class="space-y-4">
      <div
        v-for="{ slotId, itemId, item } in slottedItems"
        :key="slotId"
        class="rounded-[calc(var(--ui-radius)*2)] data-swapy-highlighted:bg-white/20 select-none"
        :data-swapy-slot="slotId"
      >
        <component
          :is="cardMap[item.key].render"
          v-if="item"
          :key="itemId"
          :data-swapy-item="itemId"
          :edit-state="editState"
          :global-country="settings.countryCode"
        />
      </div>
    </div>
    <UCard v-if="unusedCards.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">工具箱</h3>
        </div>
      </template>
      <div
        class="flex flex-wrap gap-4 *:w-22 *:h-23 *:select-none *:cursor-pointer *:hover:bg-(--ui-bg-muted)"
      >
        <UCard
          v-for="item in unusedCards"
          :key="item.key"
          @click="addCard({ key: item.key, isTemp: !editState }, editState)"
        >
          <div class="flex flex-col items-center gap-2">
            <UIcon class="size-6" :name="item.icon" />
            <div>{{ item.title }}</div>
          </div>
        </UCard>
      </div>
    </UCard>
  </main>
</template>

<style></style>
