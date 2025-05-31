import type { StorageItemKey } from '@wxt-dev/storage'

import type { Ref } from 'vue'
import { extendRef, useCloned } from '@vueuse/core'
import { storage } from '@wxt-dev/storage'
import { ref } from 'vue'
import { jsonClone } from '@/utils/clone'

function formatKey(key: string): StorageItemKey {
  if (key.split(':').length !== 2) {
    key = `local:${key}`
  }
  return key as StorageItemKey
}

export function useStore<T>(key: string | StorageItemKey, defaultData: T) {
  const storageKey = formatKey(key)
  const data = ref(defaultData)
  const { cloned, sync, isModified } = useCloned<T>(data as Ref<T>, { manual: true })

  const store = extendRef(cloned, {
    isModified,
    reset: sync,
    async get() {
      const value = await storage.getItem<T>(storageKey)
      return value
    },
    async set(value: T) {
      await storage.setItem(storageKey, value)
      data.value = value
      sync()
    },
    async save(handler = (d: T) => d) {
      return this.set(handler(jsonClone(cloned.value)))
    },
    async init() {
      const value = await this.get()
      if (value) {
        data.value = value
        sync()
      }
    },
  })

  return store
}
