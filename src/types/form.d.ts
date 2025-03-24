interface Form {
  $el: HTMLFormElement
  items: Record<string, FormItem>
  id: string
  index: number
  label?: string
  description?: string
}

type FormItemElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
type FormItemType = 'text' | 'radio' | 'password' | 'textarea' | 'file' | 'number' | 'checkbox' | 'select'

interface FormItemCommon {
  $el: FormItemElement
  id: string
  label?: string
  description?: string
  type: FormItemType
}

interface FormItemText extends FormItemCommon {
  type: 'text'
  placeholder?: string
}

interface FormItemRadio extends FormItemCommon {
  type: 'radio'
}

interface FormItemPassword extends FormItemCommon {
  type: 'password'
}

interface FormItemTextarea extends FormItemCommon {
  type: 'textarea'
}

interface FormItemFile extends FormItemCommon {
  type: 'file'
}

interface FormItemNumber extends FormItemCommon {
  type: 'number'
}

interface FormItemCheckbox extends FormItemCommon {
  type: 'checkbox'
}

interface FormItemSelect extends FormItemCommon {
  type: 'select'
}

type FormItem = FormItemText | FormItemRadio | FormItemPassword | FormItemTextarea | FormItemFile | FormItemNumber | FormItemCheckbox | FormItemSelect
