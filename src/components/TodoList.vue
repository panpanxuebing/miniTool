<template>
  <div class="list">
    <TodoItem
      v-for="t in todos"
      :key="t.id"
      :todo="t"
      @toggle="toggleTodo"
      @remove="removeTodo"
      @updateTodoText="updateTodoText"
    />

    <div v-if="todos.length === 0" class="empty">暂无待办，试试添加一个吧。</div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import TodoItem from './TodoItem.vue'
import type { Todo } from '../composables/useTodos'

const props = defineProps<{
  todos: Todo[]
}>()

const { todos } = toRefs(props)

const emit = defineEmits<{
  (e: 'toggleTodo', id: string): void
  (e: 'removeTodo', id: string): void
  (e: 'updateTodoText', payload: { id: string; text: string }): void
}>()

function toggleTodo(id: string) {
  emit('toggleTodo', id)
}

function removeTodo(id: string) {
  emit('removeTodo', id)
}

function updateTodoText(payload: { id: string; text: string }) {
  emit('updateTodoText', payload)
}
</script>
