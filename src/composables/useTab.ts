import type { Adapter, Message, OnMessage, SendMessage } from 'comctx'
import type { FormService } from '@/service/formService'
import { browser } from '#imports'
import { computed, ref } from 'vue'
// import { injectFormService } from '@/service/formService'

const tabRef = ref<chrome.tabs.Tab | null>(null)
const formRef = ref<{ [key: string]: Form }>()
const formService = ref<FormService>()

export default class InjectAdapter implements Adapter {
  public tab: chrome.tabs.Tab
  constructor(tab: chrome.tabs.Tab) {
    this.tab = tab
  }

  sendMessage: SendMessage = async (message) => {
    if (!this.tab.id) {
      return
    }
    await browser.tabs.sendMessage(this.tab.id, message)
  }

  onMessage: OnMessage = (callback) => {
    const handler = (message: Partial<Message> | undefined): undefined => {
      callback(message)
    }
    browser.runtime.onMessage.addListener(handler)
    return () => browser.runtime.onMessage.removeListener(handler)
  }
}

export function useTab() {
  const refreshTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab || !tab.id) {
        console.error('No tab found')
        return
      }
      tabRef.value = tab

      // await browser.scripting.executeScript({
      //   target: { tabId: tab.id },
      //   files: ['content-scripts/main.js'],
      // })
      // formService.value = injectFormService(new InjectAdapter(tab))
      // formRef.value = await formService.value?.getFormMap()
    }
    catch (error) {
      console.error(error)
    }
  }
  return {
    tab: tabRef,
    refreshTab,
    formService,
    form: formRef,
    formArray: computed(() => Object.values(formRef.value ?? {}).sort((a, b) => a.index - b.index)),
  }
}
