import { getFormItems, getFormMap } from '@/utils/form'

const tabRef = ref<chrome.tabs.Tab | null>(null)
const formMapRef = ref<{ [key: string]: Form }>()

async function runScript<T extends (...args: any[]) => any>(func: T, args?: Parameters<T>): Promise<ReturnType<T> | undefined> {
  if (!tabRef.value || !tabRef.value.id) {
    return
  }
  const res = (await browser.scripting.executeScript({
    target: { tabId: tabRef.value.id },
    func,
    args,
  }))?.[0]?.result as ReturnType<T>
  return res
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
      formMapRef.value = await runScript(getFormMap)

      const formKeys = Object.keys(formMapRef.value ?? {})
      if (formMapRef.value && formKeys.length > 0) {
        const formKey = formKeys[0]
        const formItems = await runScript(getFormItems, [formKey])
        console.log('formItems', formItems)
        if (formItems) {
          formMapRef.value[formKey].items = formItems
        }
      }
    }
    catch (error) {
      console.error(error)
    }
  }
  return {
    tab: tabRef,
    refreshTab,
    formMap: formMapRef,
  }
}
