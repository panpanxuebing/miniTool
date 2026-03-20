<template>
  <div class="footer">
    <div class="muted">
      {{ remainingCount }} 个未完成事项
      <span v-if="completedCount > 0">，已完成 {{ completedCount }} 个</span>
    </div>

    <div style="display: flex; gap: 10px; align-items: center">
      <button
        v-if="completedCount > 0"
        class="btn danger"
        type="button"
        @click="$emit('clearCompleted')"
      >
        清理已完成
      </button>
      <button class="btn" type="button" @click="$emit('reset')">重置示例</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  remainingCount: number
  completedCount: number
}>()

const { remainingCount, completedCount } = toRefs(props)

defineEmits<{
  (e: 'clearCompleted'): void
  (e: 'reset'): void
}>()
</script>
