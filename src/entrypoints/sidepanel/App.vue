<script lang="ts" setup>
import { zh_cn } from '@nuxt/ui/locale'
import Index from '@/components/sidepanel/index.vue'
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
