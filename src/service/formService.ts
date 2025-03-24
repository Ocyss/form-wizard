import { uid } from '@/utils/id'
import { defineProxy } from 'comctx'

function queryFormItemDescription(form: Form, item: HTMLElement) {
  const parent = item.parentElement

  if (!parent || parent === form.$el) {
    return undefined
  }
  const content = parent.innerText?.trim() ?? ''
  if (content.length >= 3) {
    return content
  }
  return queryFormItemDescription(form, parent)
}

function defineProperty<T extends object>(obj: T): T {
  for (const key in obj) {
    if (key.startsWith('$')) {
      Object.defineProperty(obj, key, { enumerable: false })
    }
  }
  return obj
}

export class FormService {
  public formMap: { [key: string]: Form } = {}
  _highlightForm: Form | null = null
  async getFormMap() {
    return this.formMap
  }

  async highlightForm(formID: string) {
    const form = this.formMap[formID]
    if (!form) {
      return
    }
    if (this._highlightForm === form) {
      return
    }
    else if (this._highlightForm) {
      this._highlightForm.$el.style.border = 'none'
    }
    this._highlightForm = form
    form.$el.style.border = '2px solid red'
  }

  async queryForm(formID: string) {
    const form = this.formMap[formID]
    if (!form) {
      return
    }
    form.$el.querySelectorAll<FormItemElement>('input:not([type=hidden]), textarea, select').forEach((item) => {
      let itemID = item.dataset.fw_id
      if (!itemID) {
        itemID = uid()
        item.dataset.fw_id = itemID
      }
      let elmType = item.tagName.toLowerCase()
      if (elmType === 'input') {
        elmType = item.type
      }
      form.items[itemID] = defineProperty({
        $el: item,
        id: itemID,
        type: elmType as FormItemType,
        description: queryFormItemDescription(form, item),
      })
    })
    return form
  }

  async queryAllForms() {
    const forms = document.querySelectorAll('form')
    if (forms.length === 0) {
      return
    }
    let index = 1
    forms.forEach((form) => {
      let id = form.dataset.fw_id
      if (!id) {
        if (form.querySelectorAll('input:not([type=hidden]), textarea, select').length === 0) {
          return
        }
        id = uid()
        form.dataset.fw_id = id
      }
      this.formMap[id] = defineProperty({ $el: form, items: {}, id, label: `Form ${index}: ${form.innerText.trim()}`, index })
      index++
    })

    if (forms.length > 0) {
      const form = forms[0]
      const formId = form.dataset.fw_id
      if (!formId) {
        return
      }
      await this.queryForm(formId)
    }
    return this.formMap
  }
}

export const [provideFormService, injectFormService] = defineProxy(() => new FormService(), {
  namespace: '__form-wizard-form-service__',
})
