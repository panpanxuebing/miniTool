<template>
  <div class="item">
    <div class="left">
      <button
        class="check"
        :class="{ checked: todo.completed }"
        type="button"
        :aria-pressed="todo.completed"
        aria-label="切换完成状态"
        @click="toggle"
        :disabled="isEditing"
      >
        <svg
          v-if="todo.completed"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2 3.6L5.1 8.7L1.8 5.4"
            stroke="rgba(255,255,255,0.95)"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="text" :class="{ completed: todo.completed }">
        <div v-if="!isEditing" class="main" :title="todo.text" @dblclick="startEdit">
          {{ todo.text }}
        </div>

        <form v-else class="row input" @submit.prevent="saveEdit">
          <input
            v-model="draftText"
            type="text"
            placeholder="编辑待办…"
            maxlength="120"
            aria-label="编辑待办输入框"
            @keydown.esc.prevent="cancelEdit"
          />
          <button class="btn primary" type="submit">保存</button>
          <button class="btn" type="button" @click="cancelEdit">取消</button>
        </form>

        <div class="meta">{{ formatMeta(todo.createdAt) }}</div>
      </div>
    </div>

    <div class="itemActions">
      <button v-if="!isEditing" class="btn" type="button" @click="startEdit">编辑</button>

      <button class="btn danger" type="button" @click="remove">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import type { Todo } from '../composables/useTodos'

const props = defineProps<{
  todo: Todo
}>()

const { todo } = toRefs(props)

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
  (e: 'updateTodoText', payload: { id: string; text: string }): void
}>()

const isEditing = ref(false)
const draftText = ref(todo.value.text)

watch(
  () => todo.value.text,
  (next) => {
    // 不在编辑中时，同步显示文本
    if (!isEditing.value) draftText.value = next
  },
)

function toggle() {
  emit('toggle', todo.value.id)
}

function remove() {
  emit('remove', todo.value.id)
}

function startEdit() {
  isEditing.value = true
  draftText.value = todo.value.text
}

function cancelEdit() {
  isEditing.value = false
  draftText.value = todo.value.text
}

function saveEdit() {
  const next = draftText.value.trim()
  if (!next) return
  emit('updateTodoText', { id: todo.value.id, text: next })
  isEditing.value = false
}

function formatMeta(ts: number) {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
</script>
