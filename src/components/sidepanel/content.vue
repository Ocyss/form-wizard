<script setup lang="ts">
import { useEmail } from "@/composables/useEmail";
import { useTab } from "@/composables/useTab";
import { ref, computed } from "vue";

const { emails, initEmails } = useEmail();
const { tab } = useTab();
await initEmails();

// 当前选中的邮箱
const selectedEmail = ref<string|undefined>(emails.value?.[0]?.id);

// 获取当前URL并生成邮箱地址
const currentUrl = computed(() => {
  if (!tab.value?.url) return "";
  try {
    return new URL(tab.value.url).hostname;
  } catch (e) {
    return "";
  }
});

const domainParts = computed(() => {
  if (!currentUrl.value) return [];

  const parts = currentUrl.value.split(".");
  const result = [];

  // 完整域名
  result.push(currentUrl.value);

  // 如果有三段或以上，添加不带子域名的版本
  if (parts.length >= 3) {
    result.push(parts.slice(parts.length - 2).join("."));
  }

  // 添加最短版本（通常是主域名）
  if (parts.length >= 2) {
    result.push(parts[parts.length - 2]);
  }

  return result;
});

// 生成邮箱地址
const generatedEmails = computed(() => {
  if (!selectedEmail.value || !currentUrl.value) return [];

  const email = emails.value.find((email) => email.id === selectedEmail.value);
  if (!email) return [];

  const result: string[] = [];

  if (email.value.startsWith("@")) {
    domainParts.value.forEach((part) => {
      result.push(`${part}${email.value}`);
    });
  } else {
    const [username, domain] = email.value.split("@");

    domainParts.value.forEach((part) => {
      result.push(`${username}+${part}@${domain}`);
      if (part === domainParts.value[domainParts.value.length - 1]) {
        result.push(`${username}.${part}@${domain}`);
      }
    });
  }

  return result;
});

const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(true);

const generatePassword = (n: number) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#^&*.";

  let chars = "";
  if (includeUppercase.value) chars += uppercase;
  if (includeLowercase.value) chars += lowercase;
  if (includeNumbers.value) chars += numbers;
  if (includeSymbols.value) chars += symbols;

  if (!chars) chars = lowercase + numbers; // 默认至少包含小写字母和数字

  let password = "";
  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
};

const generatedPassword = ref([generatePassword(16), generatePassword(22)]);

const regeneratePassword = () => {
  generatedPassword.value = [generatePassword(16), generatePassword(22)];
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ title: "已复制", color: "success",duration:500 });
  } catch (err) {
    toast.add({ title: "复制失败", color: "error",duration:0 });
  }
};

const toast = useToast();
</script>

<template>
  <div class="p-4 space-y-6">
    <!-- 邮箱选择和生成区域 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-lg font-medium flex-1">邮箱生成</div>
          <USelect
              v-model="selectedEmail"
              :items="emails"
              value-key="id"
              label-key="value"
              placeholder="选择邮箱"
  
         />
        </div>
      </template>

      <div class="space-y-4">
        <div v-if="generatedEmails.length > 0">
  
          <div class="space-y-2">
              <div
                v-for="(email, index) in generatedEmails"
                :key="index"
                class="flex items-center"
              >
                <UInput :model-value="email" readonly class="w-full" />
                <UButton
                  icon="i-lucide-copy"
                  color="primary"
                  variant="ghost"
                  size="sm"
                  class="ml-2"
                  @click="copyToClipboard(email)"
                />
              </div>
            </div>
 
        </div>
        <div v-else class="text-center py-8">
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
      </div>
    </UCard>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">密码生成</h3>
          <UButton
            icon="i-lucide-refresh-cw"
            color="primary"
            variant="ghost"
            size="xs"
            @click="regeneratePassword"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-2">
          <UCheckbox
            v-model="includeUppercase"
            label="大写字母"
            @change="regeneratePassword"
          />
          <UCheckbox
            v-model="includeLowercase"
            label="小写字母"
            @change="regeneratePassword"
          />
          <UCheckbox
            v-model="includeNumbers"
            label="数字"
            @change="regeneratePassword"
          />
          <UCheckbox
            v-model="includeSymbols"
            label="特殊符号"
            @change="regeneratePassword"
          />
        </div>
        <div class="flex items-center" v-for="(password, index) in generatedPassword" :key="index">
          <UInput :model-value="password" readonly class="w-full" />
          <UButton
            icon="i-lucide-copy"
            color="primary"
            variant="ghost"
            size="sm"
            class="ml-2"
            @click="copyToClipboard(password)"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
