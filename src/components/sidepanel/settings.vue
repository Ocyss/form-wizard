<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import type { SlotItemMapArray, Swapy } from "swapy";
import { EmailType, useEmail } from "@/composables/useEmail";
import { createSwapy, utils } from "swapy";
import { reactive } from "vue";

const { getEmails, setEmails } = useEmail();

const emails = ref(await getEmails());
const emailsEdit = ref(false);
const emailsSwapy = ref<Swapy | null>(null);
const emailsContainer = useTemplateRef("emailsContainer");
const emailsSlotItemMap = ref<SlotItemMapArray>([
  ...utils.initSlotItemMap(emails.value, "id"),
]);

watch(
  emails,
  () =>
    utils.dynamicSwapy(
      emailsSwapy.value,
      emails.value,
      "id",
      emailsSlotItemMap.value,
      (value: SlotItemMapArray) => (emailsSlotItemMap.value = value),
    ),
  { deep: true },
);

const emailsSlottedItems = computed(() =>
  utils.toSlottedItems(emails.value, "id", emailsSlotItemMap.value),
);

const newEmail = reactive({
  value: "",
  type: EmailType.DOMAIN,
});

const formState = reactive({
  error: "",
  isValid: false,
});

function validateEmail(state: Partial<typeof newEmail>) {
  const errors: FormError[] = [];
  if (!state.value) {
    errors.push({
      name: "value",
      message: "请输入邮箱",
    });
  }

  if (state.type === EmailType.DOMAIN) {
    if (!state.value?.startsWith("@")) {
      errors.push({
        name: "value",
        message: "域名格式邮箱必须以@开头",
      });
    }
  } else if (state.type === EmailType.ALIAS) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(state.value ?? "")) {
      errors.push({
        name: "value",
        message: "请输入有效的邮箱地址",
      });
    }
  }

  if (emails.value.some((email) => email.value === state.value)) {
    errors.push({
      name: "value",
      message: "该邮箱已存在",
    });
  }

  return errors;
}

function addEmail(event: FormSubmitEvent<typeof newEmail>) {
  emails.value.push({
    id: Date.now().toString(),
    value: event.data.value,
    type: event.data.type,
    active: true,
  });
  emailsEdit.value = true;
  newEmail.value = "";
  newEmail.type = EmailType.DOMAIN;
  formState.isValid = false;
}

function removeEmail(item: Email) {
  emails.value = emails.value.filter((email) => email.id !== item.id);
  emailsEdit.value = true;
}

function toggleEmailStatus(item: Email) {
  const email = emails.value.find((email) => email.id === item.id);
  if (email) {
    email.active = !email.active;
    emailsEdit.value = true;
  }
}

function saveEmails() {
  setEmails(
    emailsSlottedItems.value
      .map((item) => item.item)
      .filter((item) => item !== null),
  );
  emailsEdit.value = false;
}

onMounted(() => {
  if (emailsContainer.value) {
    emailsSwapy.value = createSwapy(emailsContainer.value, {
      manualSwap: true,
      animation: "dynamic",
      autoScrollOnDrag: true,
      swapMode: "hover",
      enabled: true,
      dragAxis: "y",
    });
    emailsSwapy.value.onSwap((event) => {
      emailsEdit.value = true;
      requestAnimationFrame(() => {
        emailsSlotItemMap.value = event.newSlotItemMap.asArray;
      });
    });
  }
});

onUnmounted(() => {
  emailsSwapy.value?.destroy();
});
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">邮箱设置</h2>

      <UPopover>
        <UButton
          label="Open"
          icon="i-heroicons-plus"
          color="primary"
          variant="soft"
        >
          添加邮箱
        </UButton>
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold">添加新邮箱</h3>
              </div>
            </template>

            <UForm
              :validate="validateEmail"
              :state="newEmail"
              class="space-y-4"
              @submit="addEmail"
            >
              <UFormField label="邮箱类型" name="type">
                <URadioGroup
                  v-model="newEmail.type"
                  orientation="horizontal"
                  class="mt-1"
                  :items="EmailType.radioItems"
                />
              </UFormField>

              <UFormField label="邮箱地址" name="value">
                <UInput
                  v-model="newEmail.value"
                  :placeholder="
                    newEmail.type === EmailType.DOMAIN
                      ? '@example.com'
                      : 'user@example.com'
                  "
                />
              </UFormField>
              <div class="flex justify-end">
                <UButton color="primary" type="submit"> 添加 </UButton>
              </div>
            </UForm>
          </UCard>
        </template>
      </UPopover>
    </div>

    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        添加邮箱后，插件将根据当前网站URL自动生成对应的Catch-all邮箱地址，用于溯源和个性化。
      </p>
    </div>

    <div v-show="emails.length > 0" ref="emailsContainer" class="space-y-3">
      <div
        class="rounded-[calc(var(--ui-radius)*2)] ring ring-(--ui-border) divide-y divide-(--ui-border) relative select-none"
        v-for="{ slotId, itemId, item: email } in emailsSlottedItems"
        :key="slotId"
        :data-swapy-slot="slotId"
      >
        <div
          v-if="email"
          class="flex items-center justify-between py-4 px-3 rounded-[calc(var(--ui-radius)*2)] bg-(--ui-bg-muted)/40"
          :data-swapy-item="itemId"
          :key="itemId"
        >
          <div class="flex items-center space-x-3">
            <UBadge
              :color="EmailType.getColor(email.type)"
              variant="subtle"
              size="sm"
            >
              {{ EmailType.getLabel(email.type) }}
            </UBadge>
            <span data-swapy-no-drag class="font-mono text-base select-text">{{
              email.value
            }}</span>
          </div>
          <div data-swapy-no-drag class="flex items-center space-x-2">
            <USwitch
              :model-value="email.active"
              @change="toggleEmailStatus(email)"
            />
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-trash"
              size="xs"
              @click="removeEmail(email)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-show="emails.length === 0" class="text-center py-8">
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
    <div class="flex justify-end">
      <UButton v-if="emailsEdit" color="primary" @click="saveEmails">
        保存
      </UButton>
    </div>
  </div>
</template>
