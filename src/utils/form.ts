import { uid } from '@/utils/id'



  
  export  function getFormItems(formID: string) {
    const items: Record<string, FormItem> = {}
    const form = document.querySelector(`form[data-fw_id="${formID}"]`)
    if (!form) {
      return undefined
    }
    function getFormItemDescription(form: Element, item: HTMLElement) {
        const parent = item.parentElement
      
        if (!parent || parent === form) {
          return undefined
        }
        const content = parent.innerText?.trim() ?? ''
        if (content.length >= 3) {
          return content
        }
        return getFormItemDescription(form, parent)
      }

    form.querySelectorAll<FormItemElement>('input, textarea, select').forEach((item) => {
        let itemID = item.dataset.fw_id
        if (!itemID) {
          itemID = uid()
          item.dataset.fw_id = itemID
        }
        items[itemID] = { $el: item, id: itemID, description: getFormItemDescription(form, item) }
      })
    return items
  }

export function getFormMap(): Record<string, Form> {
  const formMap: Record<string, Form> = {}
  const forms = document.querySelectorAll('form')
  if (forms.length === 0) {
    return formMap
  }

    forms.forEach((form, index) => {
      let id = form.dataset.fw_id
      if (!id) {
        id = uid()
        form.dataset.fw_id = id
      }
      formMap[id] = { $el: form, items: {}, id, title: `Form ${index + 1}: ${form.innerText.trim()}`, index }
      
    })
  
  return formMap
}