import MyInput from '@/components/MyInput.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USlider from '@nuxt/ui/components/Slider.vue'
import MyCard from './MyCard.vue'

export default function () {
  const info = {
    key: 'PasswordGenerator',
    title: '密码生成',
    description: '生成随机密码',
    icon: 'i-bi:lock',
  }
  return {
    ...info,
    render: defineComponent(
      (props: { editState: boolean }) => {
        const includeUppercase = ref(true)
        const includeLowercase = ref(true)
        const includeNumbers = ref(true)
        const includeSymbols = ref(true)

        function generatePassword(n: number) {
          const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          const lowercase = 'abcdefghijklmnopqrstuvwxyz'
          const numbers = '0123456789'
          const symbols = '!@#.^&*'

          let chars = ''
          if (includeUppercase.value)
            chars += uppercase
          if (includeLowercase.value)
            chars += lowercase
          if (includeNumbers.value)
            chars += numbers
          if (includeSymbols.value)
            chars += symbols

          if (!chars)
            chars = lowercase + numbers

          let password = ''
          for (let i = 0; i < n; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length)
            password += chars[randomIndex]
          }

          return password
        }
        const currentLen = ref(12)

        const generatedPassword = ref({
          16: generatePassword(16),
          22: generatePassword(22),
          current: generatePassword(currentLen.value),
        })

        function regeneratePassword(flag = false) {
          generatedPassword.value = {
            16: flag ? generatedPassword.value[16] : generatePassword(16),
            22: flag ? generatedPassword.value[22] : generatePassword(22),
            current: generatePassword(currentLen.value),
          }
        }
        return () => (
          <MyCard info={info} editState={props.editState}>
            {{
              headerRight: () => {
                return (
                  <UButton
                    icon="i-lucide-refresh-cw"
                    color="primary"
                    variant="ghost"
                    size="xs"
                    onClick={() => regeneratePassword()}
                  />
                )
              },
              default: () => {
                return (
                  <div class="space-y-4">
                    <div class="flex flex-wrap gap-6">
                      <UCheckbox
                        v-model={includeUppercase.value}
                        label="A-Z"
                        onChange={() => regeneratePassword()}
                        size="sm"
                      />
                      <UCheckbox
                        v-model={includeLowercase.value}
                        label="a-z"
                        size="sm"
                        onChange={() => regeneratePassword()}
                      />
                      <UCheckbox
                        v-model={includeNumbers.value}
                        label="0-9"
                        size="sm"
                        onChange={() => regeneratePassword()}
                      />
                      <UCheckbox
                        v-model={includeSymbols.value}
                        label="!@#.^&*"
                        size="sm"
                        onChange={() => regeneratePassword()}
                      />
                    </div>
                    {Object.entries(generatedPassword.value).map(
                      ([key, password]) => (
                        <>
                          {key === 'current' && (
                            <USlider
                              min={4}
                              max={36}
                              v-model={currentLen.value}
                              onChange={() => regeneratePassword(true)}
                              size="xs"
                            />
                          )}
                          <div key={key} class="flex items-center gap-2">
                            {key === 'current'
                              ? (
                                  <UInputNumber
                                    v-model={currentLen.value}
                                    ui={{ root: 'w-18' }}
                                    min={4}
                                    max={36}
                                    size="sm"
                                    orientation="vertical"
                                    onUpdate:modelValue={() =>
                                      regeneratePassword(true)}
                                  />
                                )
                              : (
                                  `${key}:`
                                )}
                            <MyInput
                              copyable
                              readonly
                              model-value={password}
                              class="w-full"
                            />
                          </div>
                        </>
                      ),
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
