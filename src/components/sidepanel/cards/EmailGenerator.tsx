import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { SlotItemMapArray, Swapy } from 'swapy'
import MyInput from '@/components/MyInput.vue'
import { EmailType, useEmail } from '@/composables/useEmail'
import { useTab } from '@/composables/useTab'
import { copyToClipboard } from '@/utils/copy'
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCard from '@nuxt/ui/components/Card.vue'
import UDrawer from '@nuxt/ui/components/Drawer.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UPopover from '@nuxt/ui/components/Popover.vue'
import URadioGroup from '@nuxt/ui/components/RadioGroup.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import USwitch from '@nuxt/ui/components/Switch.vue'
import UIcon from '@nuxt/ui/runtime/vue/components/Icon.vue'
import { createSwapy, utils } from 'swapy'
import { reactive } from 'vue'
import MyCard from './MyCard.vue'

function EmailEmpty() {
  return (
    <div class="text-center py-8">
      <UIcon
        name="i-heroicons-envelope"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        暂无邮箱
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        添加邮箱以使用表单精灵的自动生成功能
      </p>
    </div>
  )
}

const EmailGeneratorSettings = defineComponent(async () => {
  const { getEmails, setEmails } = useEmail()

  const emails = ref(await getEmails())
  const emailsEdit = ref(false)
  const emailsSwapy = ref<Swapy | null>(null)
  const emailsContainer = ref<HTMLElement | null>(null)
  const emailsSlotItemMap = ref<SlotItemMapArray>([
    ...utils.initSlotItemMap(emails.value, 'id'),
  ])
  onMounted(() => {
    if (emailsContainer.value) {
      emailsSwapy.value = createSwapy(emailsContainer.value, {
        manualSwap: true,
        animation: 'dynamic',
        autoScrollOnDrag: true,
        swapMode: 'hover',
        enabled: true,
        dragAxis: 'y',
      })
      emailsSwapy.value.onSwap((event) => {
        emailsEdit.value = true
        requestAnimationFrame(() => {
          emailsSlotItemMap.value = event.newSlotItemMap.asArray
        })
      })
    }
  })

  onUnmounted(() => {
    emailsSwapy.value?.destroy()
  })
  watch(
    emails,
    () =>
      utils.dynamicSwapy(
        emailsSwapy.value,
        emails.value,
        'id',
        emailsSlotItemMap.value,
        (value: SlotItemMapArray) => (emailsSlotItemMap.value = value),
      ),
    { deep: true },
  )

  const emailsSlottedItems = computed(() =>
    utils.toSlottedItems(emails.value, 'id', emailsSlotItemMap.value),
  )

  const newEmail = reactive({
    value: '',
    type: EmailType.DOMAIN,
  })

  const formState = reactive({
    error: '',
    isValid: false,
  })

  function validateEmail(state: Partial<typeof newEmail>) {
    const errors: FormError[] = []
    if (!state.value) {
      errors.push({
        name: 'value',
        message: '请输入邮箱',
      })
    }

    if (state.type === EmailType.DOMAIN) {
      if (!state.value?.startsWith('@')) {
        errors.push({
          name: 'value',
          message: '域名格式邮箱必须以@开头',
        })
      }
    }
    else if (state.type === EmailType.ALIAS) {
      const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
      if (!emailRegex.test(state.value ?? '')) {
        errors.push({
          name: 'value',
          message: '请输入有效的邮箱地址',
        })
      }
    }

    if (emails.value.some(email => email.value === state.value)) {
      errors.push({
        name: 'value',
        message: '该邮箱已存在',
      })
    }

    return errors
  }

  function addEmail(event: FormSubmitEvent<typeof newEmail>) {
    emails.value.push({
      id: Date.now().toString(),
      value: event.data.value,
      type: event.data.type,
      active: true,
    })
    emailsEdit.value = true
    newEmail.value = ''
    newEmail.type = EmailType.DOMAIN
    formState.isValid = false
  }

  function removeEmail(item: Email) {
    emails.value = emails.value.filter(email => email.id !== item.id)
    emailsEdit.value = true
  }

  function toggleEmailStatus(item: Email) {
    const email = emails.value.find(email => email.id === item.id)
    if (email) {
      email.active = !email.active
      emailsEdit.value = true
    }
  }

  async function saveEmails() {
    await setEmails(
      emailsSlottedItems.value
        .map(item => item.item)
        .filter(item => item !== null),
    )
    emailsEdit.value = false
  }
  return () => (
    <>
      <div class="p-4 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold">邮箱设置</h2>
          <UPopover>
            {{
              default() {
                return (
                  <UButton
                    label="Open"
                    icon="i-heroicons-plus"
                    color="primary"
                    variant="soft"
                  >
                    添加邮箱
                  </UButton>
                )
              },
              content() {
                return (
                  <UCard>
                    {{
                      header() {
                        return (
                          <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold">添加新邮箱</h3>
                          </div>
                        )
                      },
                      default() {
                        return (
                          <UForm
                            validate={validateEmail}
                            state={newEmail}
                            class="space-y-4"
                            onSubmit={addEmail}
                          >
                            <UFormField label="邮箱类型" name="type">
                              <URadioGroup
                                v-model={newEmail.type}
                                orientation="horizontal"
                                class="mt-1"
                                items={EmailType.radioItems}
                              />
                            </UFormField>

                            <UFormField label="邮箱地址" name="value">
                              <UInput
                                v-model={newEmail.value}
                                placeholder={
                                  newEmail.type === EmailType.DOMAIN
                                    ? '@example.com'
                                    : 'user@example.com'
                                }
                              />
                            </UFormField>
                            <div class="flex justify-end">
                              <UButton color="primary" type="submit">
                                {' '}
                                添加
                                {' '}
                              </UButton>
                            </div>
                          </UForm>
                        )
                      },
                    }}
                  </UCard>
                )
              },
            }}
          </UPopover>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            添加邮箱后，插件将根据当前网站URL自动生成对应的Catch-all邮箱地址，用于溯源和个性化。
          </p>
        </div>

        <div
          ref={emailsContainer}
          class={['space-y-3', emails.value.length > 0 ? 'block' : 'hidden']}
        >
          {emailsSlottedItems.value.map(({ slotId, itemId, item: email }) => (
            <div
              class="rounded-[calc(var(--ui-radius)*2)] ring ring-(--ui-border) divide-y divide-(--ui-border) relative select-none"
              v-for="{ slotId, itemId, item: email } in emailsSlottedItems"
              key={slotId}
              data-swapy-slot={slotId}
            >
              {email
                ? (
                    <div
                      class="flex items-center justify-between py-4 px-3 rounded-[calc(var(--ui-radius)*2)] bg-(--ui-bg-muted)/40"
                      data-swapy-item={itemId}
                      key={itemId}
                    >
                      <div class="flex items-center space-x-3">
                        <UBadge
                          color={EmailType.getColor(email.type)}
                          variant="subtle"
                          size="sm"
                        >
                          {EmailType.getLabel(email.type)}
                        </UBadge>
                        <span
                          data-swapy-no-drag
                          class="font-mono text-base select-text"
                        >
                          {email.value}
                        </span>
                      </div>
                      <div data-swapy-no-drag class="flex items-center space-x-2">
                        <USwitch
                          model-value={email.active}
                          onChange={() => toggleEmailStatus(email)}
                        />
                        <UButton
                          color="neutral"
                          variant="ghost"
                          icon="i-heroicons-trash"
                          size="xs"
                          onClick={() => removeEmail(email)}
                        />
                      </div>
                    </div>
                  )
                : (
                    <div></div>
                  )}
            </div>
          ))}
        </div>
        {emails.value.length === 0 && EmailEmpty()}
        <div class="flex justify-end">
          {emailsEdit.value && (
            <UButton color="primary" onClick={saveEmails}>
              保存
            </UButton>
          )}
        </div>
      </div>
    </>
  )
})

export default function (): Card {
  const info = {
    key: 'EmailGenerator',
    title: '邮箱生成',
    description: '生成邮箱地址',
    icon: 'i-bi:envelope-open',
  }
  return {
    ...info,
    render: defineComponent(
      (props: { editState: boolean }) => {
        const { emails, initEmails } = useEmail()
        const { tab } = useTab()
        const currentUrl = computed(() => {
          if (!tab.value?.url)
            return ''
          try {
            return new URL(tab.value.url).hostname
          }
          catch (e) {
            console.log('获取当前URL失败', e)
            return ''
          }
        })

        const selectedEmail = ref<string | undefined>()
        const domainParts = computed(() => {
          if (!currentUrl.value)
            return []

          const parts = currentUrl.value.split('.')
          const result = []

          // 完整域名
          result.push(currentUrl.value)

          // 如果有三段或以上，添加不带子域名的版本
          if (parts.length >= 3) {
            result.push(parts.slice(parts.length - 2).join('.'))
          }

          // 添加最短版本（通常是主域名）
          if (parts.length >= 2) {
            result.push(parts[parts.length - 2])
          }

          return result
        })

        const generatedEmails = computed(() => {
          if (!selectedEmail.value || !currentUrl.value)
            return []

          const email = emails.value.find(
            email => email.id === selectedEmail.value,
          )
          if (!email)
            return []

          const result: string[] = []

          if (email.value.startsWith('@')) {
            domainParts.value.forEach((part) => {
              result.push(`${part}${email.value}`)
            })
          }
          else {
            const [username, domain] = email.value.split('@')

            domainParts.value.forEach((part) => {
              result.push(`${username}+${part}@${domain}`)
              if (part === domainParts.value[domainParts.value.length - 1]) {
                result.push(`${username}.${part}@${domain}`)
              }
            })
          }

          return result
        })
        onMounted(async () => {
          selectedEmail.value = (await initEmails())[0]?.id
        })
        return () => (
          <MyCard info={info} editState={props.editState}>
            {{
              headerRight: () => {
                return (
                  <div class="flex items-center gap-1">
                    <USelect
                      v-model={selectedEmail.value}
                      items={emails.value}
                      value-key="id"
                      label-key="value"
                      placeholder="选择邮箱"
                      size="sm"
                    />
                    <UDrawer
                      handle-only
                      should-scale-background
                      set-background-color-on-scale
                      ui={{ content: 'min-h-3/5' }}
                    >
                      {{
                        default() {
                          return (
                            <UButton
                              icon="i-ic:twotone-settings"
                              color="primary"
                              variant="ghost"
                              size="xs"
                            />
                          )
                        },
                        content() {
                          return <EmailGeneratorSettings />
                        },
                      }}
                    </UDrawer>
                  </div>
                )
              },
              default: () => {
                return (
                  <div class="space-y-4">
                    {selectedEmail.value != null
                      ? (
                          <div class="space-y-2">
                            {generatedEmails.value.map((email, index) => (
                              <MyInput
                                key={index}
                                model-value={email}
                                class="w-full"
                                readonly
                                copyable
                              />
                            ))}
                          </div>
                        )
                      : (
                          EmailEmpty()
                        )}
                  </div>
                )
              },
            }}
          </MyCard>
        )
      },
      {
        props: ['editState'],
      },
    ),
  }
}
