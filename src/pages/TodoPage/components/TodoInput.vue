<template>
  <form class="row input" @submit.prevent="onSubmit">
    <input
      v-model="text"
      type="text"
      placeholder="输入待办并回车…"
      maxlength="120"
      aria-label="待办输入框"
    />
    <button class="btn primary" type="submit">添加</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', text: string): void
}>()

const text = ref('')

function onSubmit() {
  const v = text.value.trim()
  if (!v) return
  emit('add', v)
  text.value = ''
}
</script>
