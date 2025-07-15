import type { ChainInfo } from "tlock-js";
import { copyToClipboard } from "@/utils/copy";
import UButton from "@nuxt/ui/components/Button.vue";
import UCheckbox from "@nuxt/ui/components/Checkbox.vue";
import UPopover from "@nuxt/ui/components/Popover.vue";
import UCalendar from "@nuxt/ui/components/Calendar.vue";
import UTextarea from "@nuxt/ui/components/Textarea.vue";
import USlider from "@nuxt/ui/components/Slider.vue";
import UFormField from "@nuxt/ui/components/FormField.vue";
import MyInput from "@/components/MyInput.vue";
import {
  mainnetClient,
  roundAt,
  roundTime,
  timelockDecrypt,
  timelockEncrypt,
} from "tlock-js";
import MyCard from "@/components/MyCard.vue";
import { Buffer } from "buffer";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import MyAlert from "@/components/MyAlert.vue";
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "@/composables/useStore";
import {
  usePasswordGenerator,
  PASSWORD_CHARSETS,
  PasswordOptions,
} from "@/composables/usePasswordGenerator";

const client = mainnetClient();

export async function encrypt(
  message: string,
  targetTime: number,
): Promise<string> {
  const chainInfo = await client.chain().info();
  const roundId = roundAt(targetTime, chainInfo);
  const ciphertext = await timelockEncrypt(
    roundId,
    Buffer.from(message),
    client,
  );

  return btoa(ciphertext);
}

export async function decrypt(ciphertext: string): Promise<string | Date> {
  try {
    const message = await timelockDecrypt(atob(ciphertext), client);
    return message.toString();
  } catch (e) {
    const chainInfo = await client.chain().info();
    return localisedDecryptionMessageOrDefault(e, chainInfo);
  }
}

// This takes an error thrown from decryption
// if the error is because decryption has been attempted too early, it remaps the message to tell the user when they can decrypt
// otherwise it just returns a generic error message, as some of the internal tlock error messages are a bit inscrutable to the end user
function localisedDecryptionMessageOrDefault(
  err: unknown,
  chainInfo: ChainInfo,
): Date {
  let message = "未知错误";
  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }
  const tooEarlyToDecryptErrorMessage =
    "It's too early to decrypt the ciphertext - decryptable at round ";

  if (!message.startsWith(tooEarlyToDecryptErrorMessage)) {
    throw new Error("解密过程中出错！您的密文是否有效？");
  }

  const roundNumber = Number.parseInt(
    message.split(tooEarlyToDecryptErrorMessage)[1],
  );
  const timeToDecryption = new Date(roundTime(chainInfo, roundNumber));
  return timeToDecryption;
}

// 使用可复用的密码生成器

function getPresetDates() {
  const now = new Date();
  const current = new CalendarDate(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );
  const getNextYearDate = (month: number, date: number) => {
    const targetDate = new Date(now.getFullYear(), month - 1, date);
    return now > targetDate
      ? new CalendarDate(now.getFullYear() + 1, month, date)
      : new CalendarDate(now.getFullYear(), month, date);
  };
  return (
    [
      ["下周", current.add({ days: 7 })],
      ["下个月", current.add({ months: 1 })],
      ["三个月", current.add({ months: 3 })],
      ["半年", current.add({ months: 6 })],
      ["一年", current.add({ years: 1 })],
      ["三年", current.add({ years: 3 })],
      ["元旦", getNextYearDate(1, 1)],
      ["劳动节", getNextYearDate(5, 1)],
      ["国庆节", getNextYearDate(10, 1)],
    ] as [string, CalendarDate][]
  ).sort((a, b) => a[1].compare(b[1]));
}

export default function () {
  const info = {
    key: "TimeCapsuleVault",
    title: "时间密码",
    description: "生成时间胶囊，未到时间前不可解密",
    icon: "i-bi:clock",
  };
  return {
    ...info,
    render: defineComponent(
      (props: { editState: boolean }) => {
        const isEncryptMode = ref(true);
        const password = ref("");
        const ciphertext = ref("");
        const decryptResult = ref("");
        const isLoading = ref(false);
        const errorMessage = ref("");
        const decryptionDate = ref<Date | null>(null);
        const passwordOptions = useStore<PasswordOptions>(
          "timeCapsule/passwordOptions",
          {
            length: 4,
            numbers: true,
            uppercase: false,
            lowercase: false,
            special: false,
          },
          {
            autoSave: true,
          },
        );

        const now = new Date();

        const minSelectedDate = new CalendarDate(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate(),
        );

        const selectedDate = ref(minSelectedDate.add({ days: 1 }));

        const df = new DateFormatter("zh-CN", {
          dateStyle: "medium",
        });

        const presetDates = getPresetDates();

        const encryptPassword = async () => {
          const { generatePassword } = usePasswordGenerator();

          password.value = generatePassword(passwordOptions.value);

          try {
            isLoading.value = true;
            errorMessage.value = "";

            const targetDate = selectedDate.value.toDate(getLocalTimeZone());
            const encryptedText = await encrypt(
              password.value,
              targetDate.getTime(),
            );
            ciphertext.value = encryptedText;
          } catch (error) {
            if (error instanceof Error) {
              errorMessage.value = error.message;
            } else {
              errorMessage.value = "加密过程中发生错误";
            }
          } finally {
            isLoading.value = false;
          }
        };

        const decryptPassword = async () => {
          if (!ciphertext.value) {
            errorMessage.value = "请输入密文";
            return;
          }

          try {
            isLoading.value = true;
            errorMessage.value = "";
            decryptionDate.value = null;

            const result = await decrypt(ciphertext.value);
            if (result instanceof Date) {
              decryptionDate.value = result;
              decryptResult.value = "";
            } else {
              decryptResult.value = result;
            }
          } catch (error) {
            if (error instanceof Error) {
              errorMessage.value = error.message;
            } else {
              errorMessage.value = "解密过程中发生错误";
            }
          } finally {
            isLoading.value = false;
          }
        };

        const toggleMode = () => {
          isEncryptMode.value = !isEncryptMode.value;
          errorMessage.value = "";
          if (isEncryptMode.value) {
            decryptResult.value = "";
            decryptionDate.value = null;
          } else {
            ciphertext.value = "";
          }
        };

        onMounted(() => {
          passwordOptions.init();
        });

        return () => (
          <MyCard info={info} editState={props.editState}>
            {{
              headerRight: () => {
                return (
                  <UButton
                    icon={
                      isEncryptMode.value
                        ? "i-lucide-lock-open"
                        : "i-lucide-lock"
                    }
                    color="primary"
                    variant="ghost"
                    size="xs"
                    label={isEncryptMode.value ? "切换到解密" : "切换到加密"}
                    onClick={toggleMode}
                  />
                );
              },
              default: () => {
                return (
                  <div class="space-y-4">
                    {isEncryptMode.value ? (
                      <div class="space-y-4">
                        <UFormField label="解锁日期">
                          <UPopover>
                            {{
                              default: () => {
                                return (
                                  <UButton
                                    color="neutral"
                                    variant="subtle"
                                    icon="i-lucide-calendar"
                                    class="w-full"
                                    disabled={!!ciphertext.value}
                                  >
                                    {selectedDate.value
                                      ? df.format(
                                          selectedDate.value.toDate(
                                            getLocalTimeZone(),
                                          ),
                                        )
                                      : "选择日期"}
                                  </UButton>
                                );
                              },
                              content: () => {
                                return (
                                  <div class="w-[90vw] p-4 bg-(--ui-bg-muted)">
                                    <UCalendar
                                      v-model={selectedDate.value}
                                      minValue={minSelectedDate}
                                    />
                                    <div class="mt-3 flex flex-wrap gap-2 *:cursor-pointer select-none">
                                      {presetDates.map(([label, date]) => (
                                        <UButton
                                          key={label}
                                          size="xs"
                                          color="primary"
                                          variant="soft"
                                          onClick={() => {
                                            selectedDate.value = date;
                                          }}
                                        >
                                          {label}
                                        </UButton>
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            }}
                          </UPopover>
                        </UFormField>
                        {ciphertext.value ? (
                          <div class="space-y-3">
                            <UFormField label="加密结果" class="relative">
                              <UTextarea
                                class="w-full"
                                modelValue={ciphertext.value}
                                maxrows={4}
                                autoresize
                                ui={{
                                  base: "scrollbar-none",
                                }}
                              />
                              <UButton
                                icon="i-lucide-copy"
                                color="primary"
                                size="xs"
                                class="absolute top-2 right-2"
                                onClick={() =>
                                  copyToClipboard(ciphertext.value)
                                }
                              />
                            </UFormField>

                            <MyAlert
                              color="warning"
                              description={`此密文只能在
                              ${df.format(
                                selectedDate.value.toDate(getLocalTimeZone()),
                              )}
                              之后解密`}
                              icon="i-lucide-alert-triangle"
                            />
                            <MyAlert
                              color="error"
                              description="请复制原文使用，并妥善保管密文，待时间到时进行解密（请勿私自保存原文）"
                              icon="i-lucide-info"
                            />

                            <div class="flex justify-end gap-2">
                              <UButton
                                icon="i-lucide-copy"
                                color="primary"
                                size="xs"
                                label="复制原文"
                                onClick={() => {
                                  copyToClipboard(password.value);
                                }}
                              />
                              <UButton
                                icon="i-lucide-copy"
                                color="primary"
                                size="xs"
                                label="复制密文"
                                onClick={() => {
                                  copyToClipboard(ciphertext.value);
                                }}
                              />
                              <UButton
                                icon="i-lucide-refresh-cw"
                                color="primary"
                                size="xs"
                                label="继续生成"
                                onClick={() => {
                                  ciphertext.value = "";
                                  password.value = "";
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div class="space-y-3">
                              <UFormField
                                label={`密码长度: ${passwordOptions.value.length}`}
                                size="xs"
                              >
                                <USlider
                                  min={4}
                                  max={22}
                                  v-model={passwordOptions.value.length}
                                />
                              </UFormField>
                              <div class="flex flex-wrap gap-4">
                                {Object.entries(PASSWORD_CHARSETS).map(
                                  ([key, val]) => (
                                    <UCheckbox
                                      v-model={
                                        passwordOptions.value[
                                          key as keyof typeof passwordOptions.value
                                        ]
                                      }
                                      label={val.label}
                                      size="sm"
                                    />
                                  ),
                                )}
                              </div>
                              <div class="flex justify-end">
                                <UButton
                                  color="primary"
                                  variant="solid"
                                  icon="i-lucide-lock"
                                  label="生成密码和密文"
                                  loading={isLoading.value}
                                  onClick={encryptPassword}
                                  class="flex-1"
                                  size="sm"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium mb-1">
                            输入密文
                          </label>
                          <textarea
                            v-model={ciphertext.value}
                            placeholder="粘贴要解密的密文"
                            class="w-full p-2 border rounded-md min-h-[80px]"
                          />
                        </div>

                        <UButton
                          color="primary"
                          variant="solid"
                          icon="i-lucide-unlock"
                          label="解密"
                          loading={isLoading.value}
                          onClick={decryptPassword}
                          class="w-full"
                        />

                        {decryptResult.value && (
                          <UFormField label="解密结果" class="relative">
                            <MyInput
                              modelValue={decryptResult.value}
                              class="w-full"
                              copyable
                              readonly
                            />
                          </UFormField>
                        )}

                        {decryptionDate.value && (
                          <div class="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                            <p class="text-amber-700 dark:text-amber-300 text-sm">
                              此密文尚未到解锁时间，将在{" "}
                              {df.format(decryptionDate.value)} 后可解密
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {errorMessage.value && (
                      <MyAlert
                        color="warning"
                        title="解密失败"
                        description={errorMessage.value}
                        icon="i-lucide-alert-triangle"
                      />
                    )}
                  </div>
                );
              },
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
