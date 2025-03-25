<script lang="ts" setup>
import Index from '@/components/sidepanel/index.vue'
import { zh_cn } from '@nuxt/ui/locale'
</script>

<template>
  <UApp :locale="zh_cn">
    <Suspense>
      <Index />
    </Suspense>
  </UApp>
</template>

<style>
</style>
