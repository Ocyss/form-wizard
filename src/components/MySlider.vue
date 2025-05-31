<script setup lang="ts">
import { computed, ref } from '#imports'
import { useEventListener } from '@vueuse/core'

interface Props {
  options: number[]
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const modelValue = defineModel<number>({ required: true })
const sliderRef = ref<HTMLDivElement>()
const isDragging = ref(false)

const currentIndex = computed(() => {
  return props.options.findIndex(val => val === modelValue.value)
})

function handleClick(index: number) {
  modelValue.value = props.options[index]
}

const trackWidth = computed(() => {
  if (props.options.length <= 1)
    return '0%'
  return `${(currentIndex.value / (props.options.length - 1)) * 100}%`
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      track: 'h-1.5',
      thumb: 'w-3 h-3',
      mark: 'w-1 h-1',
    },
    md: {
      track: 'h-2',
      thumb: 'w-4 h-4',
      mark: 'w-1.5 h-1.5',
    },
    lg: {
      track: 'h-2.5',
      thumb: 'w-5 h-5',
      mark: 'w-2 h-2',
    },
  }
  return sizes[props.size]
})

function updateValueFromPosition(clientX: number) {
  if (!sliderRef.value)
    return

  const rect = sliderRef.value.getBoundingClientRect()
  const position = (clientX - rect.left) / rect.width
  const index = Math.round(position * (props.options.length - 1))
  const boundedIndex = Math.max(0, Math.min(props.options.length - 1, index))
  modelValue.value = props.options[boundedIndex]
}

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true
  updateValueFromPosition(e.clientX)
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value)
    return
  updateValueFromPosition(e.clientX)
}

function handleMouseUp() {
  isDragging.value = false
}

// 添加全局鼠标事件监听
useEventListener(document, 'mousemove', handleMouseMove)
useEventListener(document, 'mouseup', handleMouseUp)
</script>

<template>
  <div ref="sliderRef" class="relative w-full select-none" @mousedown="handleMouseDown">
    <!-- 轨道 -->
    <div :class="`w-full bg-(--ui-border-muted) rounded-full ${sizeClasses.track}`">
      <!-- 填充轨道 -->
      <div
        :class="`bg-(--ui-primary) rounded-full transition-all duration-200 ${sizeClasses.track}`"
        :style="{ width: trackWidth }"
      />
    </div>

    <!-- 标记点和滑块 -->
    <div class="absolute inset-0 flex items-center justify-between">
      <button
        v-for="(value, index) in options"
        :key="value"
        :class="`
          relative border-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-110
          ${currentIndex === index
            ? `bg-(--ui-primary) border-(--ui-primary) ${sizeClasses.thumb}`
            : `bg-(--ui-bg) border-(--ui-border-muted) hover:border-(--ui-primary) ${sizeClasses.mark}`
        }
        `"
        @click="handleClick(index)"
      />
    </div>
  </div>
</template>
