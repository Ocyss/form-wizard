import { jsonClone } from '@/utils/clone'

export enum EmailType {
  DOMAIN = 'domain',
  ALIAS = 'alias',
}

export namespace EmailType {
  export const radioItems: { label: string, value: EmailType }[] = [
    {
      label: '域名邮箱',
      value: EmailType.DOMAIN,
    },
    {
      label: '别名邮箱',
      value: EmailType.ALIAS,
    },
  ]

  export function getLabel(type: EmailType) {
    return type === EmailType.DOMAIN ? '域名邮箱' : '别名邮箱'
  }

  export function getColor(type: EmailType) {
    return type === EmailType.DOMAIN ? 'primary' : 'info'
  }
}

export interface Email {
  id: string
  value: string
  type: EmailType
  active: boolean
}
const emailsKey = 'local:emails'

const emailsRef = ref<Email[]>([])

export function useEmail() {
  const initEmails = async () => {
    const emails = await storage.getItem<Email[]>(emailsKey, { fallback: [] })
    emailsRef.value = emails
    return emails
  }
  const setEmails = async (emails: Email[]) => {
    // 不知啥原因，导致 Array 变成 Object
    emails = jsonClone(emails)
    await storage.setItem(emailsKey, emails)
    emailsRef.value = emails
  }
  return {
    emails: emailsRef,
    initEmails,
    getEmails: initEmails,
    setEmails,
  }
}
