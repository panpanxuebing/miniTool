<template>
  <div class="filters">
    <div class="filterGroup" role="tablist" aria-label="待办筛选">
      <button class="chip" :class="{ active: filter === 'all' }" type="button" @click="set('all')">
        全部
      </button>
      <button
        class="chip"
        :class="{ active: filter === 'active' }"
        type="button"
        @click="set('active')"
      >
        未完成
      </button>
      <button
        class="chip"
        :class="{ active: filter === 'completed' }"
        type="button"
        @click="set('completed')"
      >
        已完成
      </button>
    </div>

    <div class="muted">
      剩余 <b>{{ remainingCount }}</b> / 已完成 <b>{{ completedCount }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { TodoFilter } from '@src/composables/useTodos'

const props = defineProps<{
  filter: TodoFilter
  remainingCount: number
  completedCount: number
}>()

const { filter, remainingCount, completedCount } = toRefs(props)

const emit = defineEmits<{
  (e: 'changeFilter', next: TodoFilter): void
}>()

function set(next: TodoFilter) {
  emit('changeFilter', next)
}
</script>
