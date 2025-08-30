/**
 * Thanks to:
 *
 * https://github.com/chatgptuk/Real-US-Address-Generator
 * https://github.com/Adonis142857/Real-Address-Generator (https://linux.do/t/topic/208185)
 *
 * This code is based on the implementation of the above projects
 */

import type { Card } from '@/composables/useCards'
import UButton from '@nuxt/ui/components/Button.vue'
import USelectMenu from '@nuxt/ui/components/SelectMenu.vue'
import UIcon from '@nuxt/ui/runtime/vue/components/Icon.vue'
import { computed, defineComponent, onMounted, ref } from 'vue'
import MyCard from '@/components/MyCard.vue'
import MyInput from '@/components/MyInput.vue'
import { useStore } from '@/composables/useStore'

interface AddressInfo {
  name: string
  gender: string
  address: string
  country: string
}

interface CountryInfo {
  name: string
  code: string
  icon: string
}

interface SavedAddress {
  id: number
  code: string
  note: string
  info: AddressInfo
}

interface AddressState {
  selectedCountry: CountryInfo
  selectedSavedAddress: SavedAddress | null
  viewMode: 'generate' | 'saved'
  language: 'en-US' | 'zh-CN'
}

interface AddressApiResponse {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: {
    'amenity': string
    'house_number': string
    'road': string
    'quarter': string
    'suburb': string
    'city': string
    'state': string
    'ISO3166-2-lvl4': string
    'postcode': string
    'country': string
    'country_code': string
    'town': string
    'village': string
  }
  boundingbox: Array<string>
}

interface UserApiResponse {
  results?: Array<{
    name: {
      first: string
      last: string
    }
    gender: string
  }>
}

const countries: Record<string, CountryInfo> = {
  US: { name: '美国', code: 'US', icon: 'i-flag-us-4x3' },
  UK: { name: '英国', code: 'UK', icon: 'i-flag-gb-4x3' },
  FR: { name: '法国', code: 'FR', icon: 'i-flag-fr-4x3' },
  DE: { name: '德国', code: 'DE', icon: 'i-flag-de-4x3' },
  CN: { name: '中国', code: 'CN', icon: 'i-flag-cn-4x3' },
  TW: { name: '中国台湾', code: 'TW', icon: 'i-flag-tw-4x3' },
  HK: { name: '中国香港', code: 'HK', icon: 'i-flag-hk-4x3' },
  JP: { name: '日本', code: 'JP', icon: 'i-flag-jp-4x3' },
  IN: { name: '印度', code: 'IN', icon: 'i-flag-in-4x3' },
  AU: { name: '澳大利亚', code: 'AU', icon: 'i-flag-au-4x3' },
  BR: { name: '巴西', code: 'BR', icon: 'i-flag-br-4x3' },
  CA: { name: '加拿大', code: 'CA', icon: 'i-flag-ca-4x3' },
  RU: { name: '俄罗斯', code: 'RU', icon: 'i-flag-ru-4x3' },
  ZA: { name: '南非', code: 'ZA', icon: 'i-flag-za-4x3' },
  MX: { name: '墨西哥', code: 'MX', icon: 'i-flag-mx-4x3' },
  KR: { name: '韩国', code: 'KR', icon: 'i-flag-kr-4x3' },
  IT: { name: '意大利', code: 'IT', icon: 'i-flag-it-4x3' },
  ES: { name: '西班牙', code: 'ES', icon: 'i-flag-es-4x3' },
  TR: { name: '土耳其', code: 'TR', icon: 'i-flag-tr-4x3' },
  SA: { name: '沙特阿拉伯', code: 'SA', icon: 'i-flag-sa-4x3' },
  AR: { name: '阿根廷', code: 'AR', icon: 'i-flag-ar-4x3' },
  EG: { name: '埃及', code: 'EG', icon: 'i-flag-eg-4x3' },
  NG: { name: '尼日利亚', code: 'NG', icon: 'i-flag-ng-4x3' },
  ID: { name: '印度尼西亚', code: 'ID', icon: 'i-flag-id-4x3' },
}

const countryCoordinates: Record<string, { lat: number, lng: number }[]> = {
  US: [{ lat: 37.7749, lng: -122.4194 }, { lat: 34.0522, lng: -118.2437 }],
  UK: [{ lat: 51.5074, lng: -0.1278 }, { lat: 53.4808, lng: -2.2426 }],
  FR: [{ lat: 48.8566, lng: 2.3522 }, { lat: 45.7640, lng: 4.8357 }],
  DE: [{ lat: 52.5200, lng: 13.4050 }, { lat: 48.1351, lng: 11.5820 }],
  CN: [{ lat: 39.9042, lng: 116.4074 }, { lat: 31.2304, lng: 121.4737 }],
  TW: [{ lat: 25.0330, lng: 121.5654 }, { lat: 22.6273, lng: 120.3014 }],
  HK: [{ lat: 22.3193, lng: 114.1694 }, { lat: 22.3964, lng: 114.1095 }],
  JP: [{ lat: 35.6895, lng: 139.6917 }, { lat: 34.6937, lng: 135.5023 }],
  IN: [{ lat: 28.6139, lng: 77.2090 }, { lat: 19.0760, lng: 72.8777 }],
  AU: [{ lat: -33.8688, lng: 151.2093 }, { lat: -37.8136, lng: 144.9631 }],
  BR: [{ lat: -23.5505, lng: -46.6333 }, { lat: -22.9068, lng: -43.1729 }],
  CA: [{ lat: 43.651070, lng: -79.347015 }, { lat: 45.501690, lng: -73.567253 }],
  RU: [{ lat: 55.7558, lng: 37.6173 }, { lat: 59.9343, lng: 30.3351 }],
  ZA: [{ lat: -33.9249, lng: 18.4241 }, { lat: -26.2041, lng: 28.0473 }],
  MX: [{ lat: 19.4326, lng: -99.1332 }, { lat: 20.6597, lng: -103.3496 }],
  KR: [{ lat: 37.5665, lng: 126.9780 }, { lat: 35.1796, lng: 129.0756 }],
  IT: [{ lat: 41.9028, lng: 12.4964 }, { lat: 45.4642, lng: 9.1900 }],
  ES: [{ lat: 40.4168, lng: -3.7038 }, { lat: 41.3851, lng: 2.1734 }],
  TR: [{ lat: 41.0082, lng: 28.9784 }, { lat: 39.9334, lng: 32.8597 }],
  SA: [{ lat: 24.7136, lng: 46.6753 }, { lat: 21.3891, lng: 39.8579 }],
  AR: [{ lat: -34.6037, lng: -58.3816 }, { lat: -31.4201, lng: -64.1888 }],
  EG: [{ lat: 30.0444, lng: 31.2357 }, { lat: 31.2156, lng: 29.9553 }],
  NG: [{ lat: 6.5244, lng: 3.3792 }, { lat: 9.0579, lng: 7.4951 }],
  ID: [{ lat: -6.2088, lng: 106.8456 }, { lat: -7.7956, lng: 110.3695 }],
}

const savedAddressesRef = useStore<SavedAddress[]>('card/realAddresses', [])
const addressStateRef = useStore<AddressState>('card/addressState', {
  selectedCountry: countries.US,
  selectedSavedAddress: null,
  viewMode: 'generate',
  language: 'en-US',
})

function useRealAddress() {
  const initData = async () => {
    await Promise.all([
      savedAddressesRef.init(),
      addressStateRef.init(),
    ])
    return {
      addresses: savedAddressesRef.value,
      state: addressStateRef.value,
    }
  }

  const saveAddress = async (address: SavedAddress) => {
    savedAddressesRef.value.push(address)
    await savedAddressesRef.save()
  }

  const removeAddress = async (id: number) => {
    savedAddressesRef.value = savedAddressesRef.value.filter(addr => addr.id !== id)
    await savedAddressesRef.save()
  }

  const updateState = async (updates: Partial<AddressState>) => {
    Object.assign(addressStateRef.value, updates)
    await addressStateRef.save()
  }

  return {
    addresses: savedAddressesRef,
    state: addressStateRef,
    initData,
    saveAddress,
    removeAddress,
    updateState,
  }
}

function getRandomLocationInCountry(country: string) {
  const coordsArray = countryCoordinates[country]
  if (!coordsArray)
    return { lat: 0, lng: 0 }

  const randomCity = coordsArray[Math.floor(Math.random() * coordsArray.length)]
  const lat = randomCity.lat + (Math.random() - 0.5) * 0.1
  const lng = randomCity.lng + (Math.random() - 0.5) * 0.1
  return { lat, lng }
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
        点击刷新按钮生成真实地址信息
      </p>
    </div>
  )
}

export default function (): Card {
  const info = {
    key: 'RealAddressGenerator',
    title: '地址生成',
    description: '生成真实的地址信息',
    icon: 'i-heroicons-map-pin',
  }

  return {
    ...info,
    render: defineComponent(
      (props: { editState: boolean }) => {
        const { addresses, state, initData, saveAddress, removeAddress, updateState } = useRealAddress()
        const currentAddress = ref<AddressInfo | null>(null)
        const isGenerating = ref(false)

        const savedAddressOptions = computed<(SavedAddress & CountryInfo)[]>(() =>
          addresses.value.map(address =>
            ({
              ...address,
              ...countries[address.code],
            }),
          ),
        )

        const selectedSavedAddress = computed(() =>
          addresses.value.find(addr => addr.id === state.value.selectedSavedAddress?.id),
        )

        async function generateAddress() {
          isGenerating.value = true
          try {
            let address = ''
            let name = 'John Doe'
            let gender = 'Unknown'

            for (let i = 0; i < 100; i++) {
              const location = getRandomLocationInCountry(state.value.selectedCountry.code)
              const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1&accept-language=${state.value.language}`

              try {
                const response = await fetch(apiUrl, {
                  headers: { 'User-Agent': 'Form Wizard Extension' },
                })
                const data = await response.json() as AddressApiResponse

                if (data?.address?.house_number && data.address.road && (data.address.city || data.address.town)) {
                  address = data.display_name
                  break
                }
              }
              catch (e) {
                console.warn('地理编码请求失败:', e)
              }
            }

            if (!address) {
              address = '无法获取地址，请重试'
            }

            try {
              const userData = await fetch('https://randomuser.me/api/')
              const userJson = await userData.json() as UserApiResponse
              if (userJson?.results?.[0]) {
                const user = userJson.results[0]
                name = `${user.name.first} ${user.name.last}`
                gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
              }
            }
            catch (e) {
              console.warn('用户数据获取失败，使用默认值:', e)
            }

            currentAddress.value = {
              name,
              gender,
              address,
              country: state.value.selectedCountry.code,
            }
          }
          catch (error) {
            console.error('生成地址失败:', error)
            currentAddress.value = {
              name: 'Error',
              gender: 'Unknown',
              address: '生成失败，请重试',
              country: state.value.selectedCountry.code,
            }
          }
          finally {
            isGenerating.value = false
          }
        }

        async function saveCurrentAddress() {
          if (!currentAddress.value)
            return

          const note = prompt('请输入备注（可选）') || ''

          const savedAddress: SavedAddress = {
            code: state.value.selectedCountry.code,
            info: currentAddress.value,
            note,
            id: Date.now(),
          }

          await saveAddress(savedAddress)
        }

        async function toggleViewMode() {
          const newMode = state.value.viewMode === 'generate' ? 'saved' : 'generate'
          await updateState({ viewMode: newMode })
        }

        async function onCountryChange(country: CountryInfo) {
          await updateState({ selectedCountry: country })
          await generateAddress()
        }

        async function onSavedAddressChange(v: SavedAddress) {
          await updateState({ selectedSavedAddress: v })
        }

        async function deleteSavedAddress(v: SavedAddress) {
          await removeAddress(v.id)
          if (state.value.selectedSavedAddress?.id === v.id) {
            await updateState({ selectedSavedAddress: null })
          }
        }

        const displayAddress = computed(() => {
          if (state.value.viewMode === 'saved') {
            return selectedSavedAddress.value?.info || null
          }
          return currentAddress.value
        })

        onMounted(async () => {
          await initData()
          await generateAddress()
        })

        return () => (
          <MyCard info={info} editState={props.editState}>
            {{
              headerRight: () => (
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-lucide-bookmark"
                    color={state.value.viewMode === 'saved' ? 'primary' : 'neutral'}
                    variant={state.value.viewMode === 'saved' ? 'solid' : 'ghost'}
                    size="xs"
                    onClick={toggleViewMode}
                  />

                  {state.value.viewMode === 'generate'
                    ? (
                        <>
                          <USelectMenu
                            model-value={state.value.selectedCountry}
                            onUpdate:modelValue={onCountryChange}
                            items={Object.values(countries)}
                            placeholder="选择国家"
                            labelKey="name"
                            size="xs"
                            class="w-24"
                            ui={{ content: 'min-w-fit' }}
                            icon={state.value.selectedCountry.icon}
                          />
                          <UButton
                            icon={state.value.language === 'en-US' ? 'i-uil-letter-english-a' : 'i-uil-letter-chinese-a'}
                            color="primary"
                            variant="ghost"
                            size="xs"
                            onClick={async () => updateState({ language: state.value.language === 'en-US' ? 'zh-CN' : 'en-US' })}
                          />
                          <UButton
                            icon="i-heroicons-arrow-path"
                            color="primary"
                            variant="ghost"
                            size="xs"
                            loading={isGenerating.value}
                            onClick={generateAddress}
                          />
                        </>
                      )
                    : (
                        <USelectMenu
                          model-value={state.value.selectedSavedAddress}
                          onUpdate:modelValue={onSavedAddressChange}
                          items={savedAddressOptions.value}
                          placeholder="选择收藏"
                          labelKey="note"
                          size="xs"
                          class="w-48"
                          ui={{ content: 'min-w-fit' }}
                          icon={countries[state.value.selectedSavedAddress?.code ?? 'US'].icon}
                        />
                      )}
                </div>
              ),
              default: () => (
                <div class="space-y-4">
                  {displayAddress.value
                    ? (
                        <div class="space-y-2">
                          {
                            [
                              { key: '姓名', value: displayAddress.value.name },
                              { key: '性别', value: displayAddress.value.gender },
                              { key: '地址', value: displayAddress.value.address, isArea: true },
                            ].map(({ key, value, isArea }) => (
                              <div key={key} class="flex items-start gap-2">
                                {/* <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap pt-2 min-w-12">
                                {key}
                                :
                              </span> */}
                                <MyInput
                                  model-value={value}
                                  placeholder={key}
                                  readonly
                                  copyable
                                  isArea={isArea}
                                  class="flex-1"
                                />
                              </div>
                            ))
                          }

                          <div class="flex justify-between pt-2">
                            {state.value.viewMode === 'saved' && selectedSavedAddress.value && (
                              <UButton
                                color="error"
                                variant="soft"
                                size="sm"
                                icon="i-heroicons-trash"
                                onClick={async () => deleteSavedAddress(selectedSavedAddress.value!)}
                              >
                                删除
                              </UButton>
                            )}

                            {state.value.viewMode === 'generate' && (
                              <div class="ml-auto">
                                <UButton
                                  color="primary"
                                  variant="soft"
                                  size="sm"
                                  icon="i-lucide-bookmark-plus"
                                  onClick={saveCurrentAddress}
                                >
                                  收藏
                                </UButton>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    : (
                        state.value.viewMode === 'saved'
                          ? (
                              <div class="text-center py-8">
                                <UIcon
                                  name="i-heroicons-bookmark"
                                  class="mx-auto h-12 w-12 text-gray-400"
                                />
                                <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                  暂无收藏
                                </h3>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  先生成地址并收藏，然后在这里查看
                                </p>
                              </div>
                            )
                          : (
                              AddressEmpty()
                            )
                      )}
                </div>
              ),
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
