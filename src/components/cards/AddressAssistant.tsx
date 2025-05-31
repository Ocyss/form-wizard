import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import UButton from '@nuxt/ui/components/Button.vue'
import UDrawer from '@nuxt/ui/components/Drawer.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import UInputNumber from '@nuxt/ui/components/InputNumber.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import UIcon from '@nuxt/ui/runtime/vue/components/Icon.vue'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import MyCard from '@/components/MyCard.vue'
import MyInput from '@/components/MyInput.vue'
import MySlider from '@/components/MySlider.vue'
import { useStore } from '@/composables/useStore'

interface Address {
  id: string
  name: string
  fullAddress: string
  postalCode: string
  levels: Record<string, string>
}

const levels = useStore<Record<string, string>>('address/levels', {
  100: '省',
  80: '市',
  60: '区',
  40: '街道/镇',
  20: '小区',
  10: '门牌',
})

const addresses = useStore<Address[]>('address/addresses', [])

function extractAddressParts(inputs: Record<string, string>, fullAddress: string) {
  const addressParts: [number, string][] = []
  let remainingAddress = fullAddress
  let currentAddress = ''

  const provinceMatch = remainingAddress.match(/^(.*?(?:省|自治区|特别行政区))/)
    || remainingAddress.match(/^(北京市|上海市|天津市|重庆市|香港|澳门|台湾)/)
  if (provinceMatch) {
    currentAddress = provinceMatch[1]
    addressParts.push([100, currentAddress])
    remainingAddress = remainingAddress.slice(provinceMatch[1].length)
  }

  if (!remainingAddress.startsWith('市辖区')) {
    const cityMatch = remainingAddress.match(/^(.*?(?:[市盟州]|地区))/)
    if (cityMatch) {
      currentAddress += cityMatch[1]
      addressParts.push([80, currentAddress])
      remainingAddress = remainingAddress.slice(cityMatch[1].length)
    }
  }
  else {
    addressParts.push([80, currentAddress])
  }

  const districtMatch = remainingAddress.match(/^(.*?[区县旗])/)
  if (districtMatch) {
    currentAddress += districtMatch[1]
    addressParts.push([60, currentAddress])
    remainingAddress = remainingAddress.slice(districtMatch[1].length)
  }

  const streetMatch = remainingAddress.match(/^(.*?(?:街道|镇|乡|村委会|社区))/)
  if (streetMatch) {
    currentAddress += streetMatch[1]
    addressParts.push([40, currentAddress])
    remainingAddress = remainingAddress.slice(streetMatch[1].length)
  }
  let communityPart = ''
  const communityKeywords = ['小区', '花园', '广场', '大厦', '苑', '庄', '村', '院', '城', '园']
  let foundCommunity = false

  for (const keyword of communityKeywords) {
    const index = remainingAddress.indexOf(keyword)
    if (index !== -1) {
      communityPart = remainingAddress.slice(0, index + keyword.length)
      foundCommunity = true
      break
    }
  }

  if (!foundCommunity) {
    const buildingMatch = remainingAddress.match(/^(.*?)(?=\d{0,5}(?:栋|幢|号楼))/)
    if (buildingMatch) {
      communityPart = buildingMatch[1]
    }
  }

  if (communityPart) {
    currentAddress += communityPart
    addressParts.push([20, currentAddress])
  }

  addressParts.push([10, fullAddress])

  const newInputs: Record<string, string> = { ...inputs }
  addressParts.sort((a, b) => b[0] - a[0])
  console.log(addressParts, levels.value, newInputs)

  for (const levelWeight in levels.value) {
    const weight = Number(levelWeight)
    if (!newInputs[levelWeight]) {
      let result = ''
      for (const [w, v] of addressParts) {
        if (w < weight) {
          break
        }
        result = v || ''
      }
      newInputs[levelWeight] = result
    }
  }

  return newInputs
}

function AddressEmpty() {
  return (
    <div class="text-center py-8">
      <UIcon
        name="i-heroicons-map-pin"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
        暂无地址
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        添加地址以使用地址助手功能
      </p>
    </div>
  )
}

const AddressSettings = defineComponent(async () => {
  const newLevel = reactive({
    name: '',
    weight: 0,
  })
  const editAddressId = ref<string | null>(null)
  const editAddressOpen = ref(false)
  const editAddress = reactive({
    name: '',
    fullAddress: '',
    postalCode: '',
  })

  const addressInputs = ref<Record<string, string>>({})

  const validateLevelError = ref<string | undefined>(undefined)
  function validateLevel(state: Partial<typeof newLevel>): string | undefined {
    if (!state.name?.trim()) {
      return '请输入级别名称'
    }
    if (state.weight === undefined || state.weight < 0 || state.weight > 100) {
      return '权重必须在0-100之间'
    }
    if (state.weight % 10 === 0) {
      return '权重不能为10的倍数'
    }
    if (levels.value[state.weight]) {
      return '该权重已存在'
    }
  }

  function addLevel() {
    validateLevelError.value = validateLevel(newLevel)
    if (validateLevelError.value) {
      return
    }
    levels.value[newLevel.weight] = newLevel.name
    newLevel.name = ''
    newLevel.weight = 0
  }

  function validateAddress(state: Partial<typeof editAddress>) {
    const errors: FormError[] = []
    if (!state.name?.trim()) {
      errors.push({
        name: 'name',
        message: '请输入地址名称',
      })
    }
    if (!state.fullAddress?.trim()) {
      errors.push({
        name: 'fullAddress',
        message: '请输入完整地址',
      })
    }
    return errors
  }

  function removeLevel(levelId: string) {
    delete levels.value[levelId]
  }
  function updateAddress(address?: Address, open = true) {
    if (address) {
      editAddressId.value = address.id
      editAddress.name = address.name
      editAddress.fullAddress = address.fullAddress
      editAddress.postalCode = address.postalCode
      addressInputs.value = address.levels
    }
    else {
      editAddressId.value = null
      editAddress.name = ''
      editAddress.fullAddress = ''
      editAddress.postalCode = ''
      addressInputs.value = {}
    }
    editAddressOpen.value = open
  }
  async function submitAddress(event: FormSubmitEvent<typeof editAddress>) {
    if (editAddressId.value) {
      await addresses.set(addresses.value.map(address => address.id === editAddressId.value
        ? {
            ...address,
            name: event.data.name,
            fullAddress: event.data.fullAddress,
            postalCode: event.data.postalCode,
            levels: addressInputs.value,
          }
        : address))
    }
    else {
      addresses.value.push({
        id: Date.now().toString(),
        name: event.data.name,
        fullAddress: event.data.fullAddress,
        postalCode: event.data.postalCode,
        levels: addressInputs.value,
      })
      await addresses.save()
    }
    editAddressId.value = null
    editAddress.name = ''
    editAddress.fullAddress = ''
    editAddress.postalCode = ''
    addressInputs.value = {}
    editAddressOpen.value = false
  }

  async function removeAddress(addressId: string) {
    return addresses.set(addresses.value.filter(address => address.id !== addressId))
  }

  watch(() => editAddress.fullAddress, (newFullAddress) => {
    if (newFullAddress) {
      const extractedParts = extractAddressParts(addressInputs.value, newFullAddress)
      addressInputs.value = extractedParts
    }
  })

  function onLevelInputChange(levelId: string, value: string) {
    addressInputs.value[levelId] = value
  }

  async function saveLevels() {
    await levels.save()
  }

  const category = ref('地址')

  return () => (
    <div class="p-4">
      <div class="mb-2 flex items-center gap-1 justify-end">
        <USelect v-model={category.value} items={['级别', '地址']} size="sm" />
        <UDrawer v-model:open={editAddressOpen.value}>
          {{
            default: () => (
              <UButton
                icon="i-heroicons-plus"
                size="xs"
                onClick={() => updateAddress()}
              />
            ),
            content: () => (

              <UForm
                class="p-4 space-y-3"
                state={editAddress}
                validate={validateAddress}
                onSubmit={submitAddress}
              >
                <UFormField label="地址名称" description="如：家、公司" class="w-full" required>
                  <UInput
                    v-model={editAddress.name}
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="完整地址" class="w-full" required>
                  <UTextarea
                    v-model={editAddress.fullAddress}
                    class="w-full"
                    rows={3}
                  />
                </UFormField>

                <UFormField label="邮政编码" class="w-full">
                  <UInput
                    v-model={editAddress.postalCode}
                    class="w-full"
                  />
                </UFormField>

                <div class="grid grid-cols-2 gap-2">
                  {Object.entries(levels.value).sort((a, b) => Number(b[0]) - Number(a[0])).map(([weight, name]) => (
                    <UFormField label={name}>
                      <UInput
                        model-value={addressInputs.value[weight]}
                        placeholder={name}
                        size="sm"
                        class="w-full"
                        onChange={(e: Event) => onLevelInputChange(
                          weight,
                          (e.target as HTMLInputElement).value,
                        )}
                      />
                    </UFormField>

                  ))}
                </div>

                <div class="flex justify-end">
                  <UButton type="submit" size="sm">
                    {editAddressId.value ? '编辑地址' : '添加地址'}
                  </UButton>
                </div>
              </UForm>
            ),
          }}

        </UDrawer>
      </div>
      {category.value === '级别'
        ? (
            <div class="space-y-3">
              {Object.entries(levels.value).sort((a, b) => Number(b[0]) - Number(a[0])).map(([weight, name]) => (
                <div key={weight} class="flex items-center gap-3 p-3 border-1 border-(--ui-border-muted) rounded-lg">
                  <UInput
                    v-model={name}
                    class="flex-1"
                  />
                  <UInputNumber
                    model-value={weight}
                    disabled
                    orientation="vertical"
                    class="w-20"
                  />
                  <UButton
                    disabled={Number(weight) % 10 === 0}
                    icon="i-heroicons-trash"
                    color="error"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLevel(weight)}
                  />
                </div>
              ))}

              <div
                class="p-3 border-1 border-(--ui-border-muted) border-dashed rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <UFormField name="name" class="flex-1">
                    <UInput
                      v-model={newLevel.name}
                      placeholder="名称"
                    />
                  </UFormField>
                  <UFormField name="weight" class="w-20">
                    <UInputNumber
                      v-model={newLevel.weight}
                      placeholder="权重"
                      min={0}
                      max={100}
                      orientation="vertical"
                    />
                  </UFormField>
                  <UButton
                    icon="i-heroicons-plus"
                    size="sm"
                    onClick={addLevel}
                  />
                </div>

                {validateLevelError.value && <div class="text-(--ui-error) mt-2">{validateLevelError.value}</div>}

              </div>

              <div class="flex justify-end mt-3">
                <UButton
                  disabled={!levels.isModified}
                  onClick={saveLevels}
                  size="sm"
                  color="primary"
                >
                  保存级别配置
                </UButton>
              </div>

            </div>
          )
        : (
            <div class="space-y-4">
              {addresses.value.length === 0
                ? (
                    <AddressEmpty />
                  )
                : (
                    addresses.value.map(address => (
                      <div key={address.id} class="px-4 py-2 border-1 border-(--ui-border-muted) hover:bg-(--ui-bg-muted) rounded-lg space-y-1">
                        <div class="flex items-center justify-between">
                          <h3 class="text-sm font-medium">{address.name}</h3>
                          <div class="flex items-center gap-1">
                            <UButton
                              icon="i-heroicons-pencil-square"
                              color="primary"
                              variant="ghost"
                              size="sm"
                              onClick={() => updateAddress(address)}
                            />
                            <UButton
                              icon="i-heroicons-trash"
                              color="error"
                              variant="ghost"
                              size="sm"
                              onClick={() => void removeAddress(address.id)}
                            />
                          </div>

                        </div>
                        <div>{address.fullAddress}</div>
                      </div>
                    ))
                  )}

            </div>
          )}
    </div>
  )
})

const AddressDisplay = defineComponent(async () => {
  const selectedAddressId = ref<string>('')

  const sortedLevels = computed(() => {
    return Object.entries(levels.value).sort((a, b) => Number(b[0]) - Number(a[0]))
  })

  const availableWeights = computed(() => {
    return Object.keys(levels.value).map(Number).sort((a, b) => b - a)
  })

  const currentWeight = ref(availableWeights.value[2] || 40)

  const selectedAddress = computed(() => {
    return addresses.value.find(addr => addr.id === selectedAddressId.value) || addresses.value[0]
  })

  const displayAddress = computed(() => {
    if (!selectedAddress.value)
      return { address: '', postalCode: '' }

    // 找到最接近且不大于当前权重的地址
    let address = ''
    const sortedWeights = Object.keys(selectedAddress.value.levels).map(Number).sort((a, b) => b - a)

    for (const weight of sortedWeights) {
      if (weight <= currentWeight.value) {
        address = selectedAddress.value.levels[weight.toString()] || ''
        break
      }
    }

    return {
      address,
      postalCode: selectedAddress.value.postalCode,
    }
  })

  const currentLevelName = computed(() => {
    const level = sortedLevels.value.find(([weight]) => Number(weight) === currentWeight.value)
    return level?.[1] || '自定义'
  })

  onMounted(() => {
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }
  })

  return () => (
    <div class="space-y-4">
      {addresses.value.length === 0
        ? (
            <AddressEmpty />
          )
        : (
            <>
              {addresses.value.length > 1 && (
                <USelect
                  v-model={selectedAddressId.value}
                  items={addresses.value.map(addr => ({
                    label: addr.name,
                    value: addr.id,
                  }))}
                  placeholder="选择地址"
                />
              )}

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">
                    级别:
                    {currentLevelName.value}
                  </span>
                  <span class="text-sm text-gray-500">
                    权重:
                    {currentWeight.value}
                  </span>
                </div>

                <MySlider
                  modelValue={currentWeight.value}
                  options={availableWeights.value}
                  onUpdate:modelValue={(value: number) => { currentWeight.value = value }}
                />
              </div>

              <div class="space-y-2">
                <MyInput
                  copyable
                  isArea
                  readonly
                  model-value={displayAddress.value.address}
                  placeholder="地址"
                  class="w-full"
                />

                {displayAddress.value.postalCode && (
                  <MyInput
                    copyable
                    readonly
                    model-value={displayAddress.value.postalCode}
                    placeholder="邮政编码"
                    class="w-full"
                  />
                )}
              </div>
            </>
          )}
    </div>
  )
})

export default function () {
  const info = {
    key: 'AddressAssistant',
    title: '地址助手',
    description: '快速复制不同颗粒度的地址和邮编',
    icon: 'i-heroicons-map-pin',
  }

  return {
    ...info,
    render: defineComponent((props: { editState: boolean }) => {
      onMounted(async () => {
        await levels.init()
        await addresses.init()
      })
      return () => (
        <MyCard info={info} editState={props.editState}>
          {{
            headerRight: () => (

              <UDrawer>

                {
                  {
                    default: () => (
                      <UButton
                        icon="i-heroicons-cog-6-tooth"
                        color="primary"
                        variant="ghost"
                        size="xs"
                      />
                    ),
                    content: () => <AddressSettings />,

                  }
                }
              </UDrawer>

            ),
            default: () => <AddressDisplay />,
          }}
        </MyCard>
      )
    }),
  }
}
