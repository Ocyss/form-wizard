import type { Card } from "@/composables/useCards";
import UButton from "@nuxt/ui/components/Button.vue";
import USelectMenu from "@nuxt/ui/components/SelectMenu.vue";
import URadioGroup from "@nuxt/ui/components/RadioGroup.vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import MyCard from "@/components/MyCard.vue";
import MyInput from "@/components/MyInput.vue";
import { useStore } from "@/composables/useStore";
import {
  getCountryList,
  getRandomFirstName,
  getRandomGender,
  getRandomLastName,
  getRandomNickname,
  type NameData,
} from "@/utils/names";

export interface UsernameInfo {
  firstName: string;
  lastName: string;
  nickname: string;
  gender: string;
  country: string;
}

export interface SavedUsername {
  id: number;
  code: string;
  note: string;
  info: UsernameInfo;
}

export interface UsernameState {
  selectedCountryCode: string;
  selectedGender: string;
  viewMode: "generate" | "saved";
  selectedSavedUsername: SavedUsername | null;
}

const countries = getCountryList();
const countryOptions = countries.map((c) => ({ code: c.code, name: c.name, icon: c.icon }));

const genderOptions = [
  { value: "Male", label: "男" },
  { value: "Female", label: "女" },
];

const savedUsernamesRef = useStore<SavedUsername[]>("card/usernames", []);
const usernameStateRef = useStore<UsernameState>("card/usernameState", {
  selectedCountryCode: "US",
  selectedGender: "Male",
  viewMode: "generate",
  selectedSavedUsername: null,
});

function useUsername() {
  const initData = async () => {
    await Promise.all([savedUsernamesRef.init(), usernameStateRef.init()]);
    return {
      usernames: savedUsernamesRef.value,
      state: usernameStateRef.value,
    };
  };

  const saveUsername = async (username: SavedUsername) => {
    savedUsernamesRef.value.push(username);
    await savedUsernamesRef.save();
  };

  const removeUsername = async (id: number) => {
    savedUsernamesRef.value = savedUsernamesRef.value.filter((u) => u.id !== id);
    await savedUsernamesRef.save();
  };

  const updateState = async (updates: Partial<UsernameState>) => {
    Object.assign(usernameStateRef.value, updates);
    await usernameStateRef.save();
  };

  return {
    usernames: savedUsernamesRef,
    state: usernameStateRef,
    initData,
    saveUsername,
    removeUsername,
    updateState,
  };
}

function UsernameEmpty() {
  return (
    <div class="text-center py-8">
      <div class="i-heroicons-user mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">暂无用户名</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">点击刷新按钮生成用户名信息</p>
    </div>
  );
}

function generateUsername(countryCode: string, gender: string): UsernameInfo {
  const firstName = getRandomFirstName(countryCode, gender);
  const lastName = getRandomLastName(countryCode);
  const nickname = getRandomNickname(countryCode);

  return {
    firstName,
    lastName,
    nickname,
    gender: gender === "Male" ? "男" : "女",
    country: countryCode,
  };
}

export default function (): Card {
  const info = {
    key: "UsernameGenerator",
    title: "用户名生成",
    description: "生成随机用户名信息",
    icon: "i-heroicons-user",
  };

  return {
    ...info,
    render: defineComponent(
      (props: { editState: boolean; globalCountry: string }) => {
        const { usernames, state, initData, saveUsername, removeUsername, updateState } =
          useUsername();
        const currentUsername = ref<UsernameInfo | null>(null);
        const isGenerating = ref(false);

        const hasGlobalCountry = computed(() => !!props.globalCountry);
        const effectiveCountry = computed(() =>
          props.globalCountry || state.value.selectedCountryCode,
        );

        const savedUsernameOptions = computed<(SavedUsername & { name: string })[]>(() =>
          usernames.value.map((u) => ({
            ...u,
            name: u.note || `${u.info.nickname} (${u.info.firstName} ${u.info.lastName})`,
          })),
        );

        const selectedSavedUsername = computed(() =>
          usernames.value.find((u) => u.id === state.value.selectedSavedUsername?.id),
        );

        async function generate() {
          isGenerating.value = true;
          try {
            currentUsername.value = generateUsername(
              effectiveCountry.value,
              state.value.selectedGender,
            );
          } catch (error) {
            console.error("生成用户名失败:", error);
            currentUsername.value = {
              firstName: "Error",
              lastName: "Error",
              nickname: "Error",
              gender: "Unknown",
              country: effectiveCountry.value,
            };
          } finally {
            isGenerating.value = false;
          }
        }

        async function saveCurrentUsername() {
          if (!currentUsername.value) return;

          const note = prompt("请输入备注（可选）") || "";

          const savedUsername: SavedUsername = {
            code: state.value.selectedCountryCode,
            info: currentUsername.value,
            note,
            id: Date.now(),
          };

          await saveUsername(savedUsername);
        }

        async function toggleViewMode() {
          const newMode = state.value.viewMode === "generate" ? "saved" : "generate";
          await updateState({ viewMode: newMode });
        }

        async function onCountryChange(country: { code: string; name: string; icon: string }) {
          if (props.globalCountry) return;
          await updateState({ selectedCountryCode: country.code });
          if (state.value.viewMode === "generate") {
            await generate();
          }
        }

        async function onGenderChange(gender: { value: string; label: string }) {
          await updateState({ selectedGender: gender.value });
          if (state.value.viewMode === "generate") {
            await generate();
          }
        }

        async function onSavedUsernameChange(v: SavedUsername) {
          await updateState({ selectedSavedUsername: v });
        }

        async function deleteSavedUsername(v: SavedUsername) {
          await removeUsername(v.id);
          if (state.value.selectedSavedUsername?.id === v.id) {
            await updateState({ selectedSavedUsername: null });
          }
        }

        const displayUsername = computed(() => {
          if (state.value.viewMode === "saved") {
            return selectedSavedUsername.value?.info || null;
          }
          return currentUsername.value;
        });

        const currentCountry = computed(
          () => countries.find((c) => c.code === effectiveCountry.value) || countries[0],
        );

        onMounted(async () => {
          await initData();
          await generate();
        });

        return () => (
          <MyCard info={info} editState={props.editState}>
            {{
              headerRight: () => (
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-lucide-bookmark"
                    color={state.value.viewMode === "saved" ? "primary" : "neutral"}
                    variant={state.value.viewMode === "saved" ? "solid" : "ghost"}
                    size="xs"
                    onClick={toggleViewMode}
                  />

                  {state.value.viewMode === "generate" ? (
                    <>
                      {!hasGlobalCountry.value && (
                        <USelectMenu
                          model-value={currentCountry.value}
                          onUpdate:modelValue={onCountryChange}
                          items={countryOptions}
                          placeholder="选择国家"
                          labelKey="name"
                          size="xs"
                          class="w-24"
                          ui={{ content: "min-w-fit" }}
                          icon={currentCountry.value.icon}
                        />
                      )}
                      <URadioGroup
                        model-value={state.value.selectedGender}
                        onUpdate:modelValue={(v: string) =>
                          onGenderChange({
                            value: v,
                            label: genderOptions.find((o) => o.value === v)?.label || "",
                          })
                        }
                        items={genderOptions}
                        class="flex gap-2"
                        orientation="horizontal"
                      />
                      <UButton
                        icon="i-heroicons-arrow-path"
                        color="primary"
                        variant="ghost"
                        size="xs"
                        loading={isGenerating.value}
                        onClick={generate}
                      />
                    </>
                  ) : (
                    <USelectMenu
                      model-value={state.value.selectedSavedUsername}
                      onUpdate:modelValue={onSavedUsernameChange}
                      items={savedUsernameOptions.value}
                      placeholder="选择收藏"
                      labelKey="name"
                      size="xs"
                      class="w-48"
                      ui={{ content: "min-w-fit" }}
                    />
                  )}
                </div>
              ),
              default: () => (
                <div class="space-y-4">
                  {displayUsername.value ? (
                    <div class="space-y-2">
                      <MyInput model-value={displayUsername.value.nickname} label="昵称" readonly copyable class="flex-1" />
                      <MyInput model-value={displayUsername.value.firstName} label="名" readonly copyable class="flex-1" />
                      <MyInput model-value={displayUsername.value.lastName} label="姓" readonly copyable class="flex-1" />
                      <MyInput model-value={displayUsername.value.gender} label="性别" readonly copyable class="flex-1" />

                      <div class="flex justify-between pt-2">
                        {state.value.viewMode === "saved" && selectedSavedUsername.value && (
                          <UButton
                            color="error"
                            variant="soft"
                            size="sm"
                            icon="i-heroicons-trash"
                            onClick={async () =>
                              deleteSavedUsername(selectedSavedUsername.value!)
                            }
                          >
                            删除
                          </UButton>
                        )}

                        {state.value.viewMode === "generate" && (
                          <div class="ml-auto">
                            <UButton
                              color="primary"
                              variant="soft"
                              size="sm"
                              icon="i-lucide-bookmark-plus"
                              onClick={saveCurrentUsername}
                            >
                              收藏
                            </UButton>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : state.value.viewMode === "saved" ? (
                    <div class="text-center py-8">
                      <div class="i-heroicons-bookmark mx-auto h-12 w-12 text-gray-400" />
                      <h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                        暂无收藏
                      </h3>
                      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        先生成用户名并收藏，然后在这里查看
                      </p>
                    </div>
                  ) : (
                    UsernameEmpty()
                  )}
                </div>
              ),
            }}
          </MyCard>
        );
      },
      {
        props: ["editState"],
      },
    ),
  };
}
