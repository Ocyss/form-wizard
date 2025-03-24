interface Form {
  $el: HTMLFormElement
  items: Record<string, FormItem>
  id: string
  index: number
  title?: string
  description?: string
}

type FormItemElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

interface FormItem {
  $el: FormItemElement
  id: string
  label?: string
  description?: string
}
