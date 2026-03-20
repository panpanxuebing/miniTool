<template>
  <div class="detailsPanel">
    <div class="detailsHeader">
      <div class="muted">共 {{ tasks.length }} 条任务，已完成 {{ completedCount }}</div>

      <div class="filters" aria-label="任务筛选">
        <div class="filterGroup" role="tablist" aria-label="筛选条件">
          <span
            class="chip"
            :class="{ active: detailFilter === 'all' }"
            role="tab"
            :aria-selected="detailFilter === 'all'"
            tabindex="0"
            @click="detailFilter = 'all'"
          >
            全部
          </span>
          <span
            class="chip"
            :class="{ active: detailFilter === 'active' }"
            role="tab"
            :aria-selected="detailFilter === 'active'"
            tabindex="0"
            @click="detailFilter = 'active'"
          >
            未完成
          </span>
          <span
            class="chip"
            :class="{ active: detailFilter === 'completed' }"
            role="tab"
            :aria-selected="detailFilter === 'completed'"
            tabindex="0"
            @click="detailFilter = 'completed'"
          >
            已完成
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredSortedTasks.length === 0" class="empty">
      暂无任务。先去“添加”里输入一条任务吧。
    </div>

    <div v-else class="tableWrap">
      <table class="historyTable">
        <thead>
          <tr>
            <th style="width: 54px">序号</th>
            <th>任务</th>
            <th style="width: 120px">日期</th>
            <th style="width: 110px">状态</th>
            <th style="width: 96px">金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, i) in filteredSortedTasks" :key="t.id">
            <td>{{ i + 1 }}</td>
            <td class="taskCell">
              <input
                class="checkBox"
                type="checkbox"
                :checked="t.completed"
                @change="$emit('toggle', t.id)"
                :aria-label="t.completed ? '标记为未完成' : '标记为已完成'"
              />
              <span :class="{ completedText: t.completed }" :title="t.text">{{ t.text }}</span>
            </td>
            <td class="dateCell">{{ t.date }}</td>
            <td>{{ t.completed ? '已完成' : '未完成' }}</td>
            <td class="moneyCell">{{ t.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MoneyTask } from '@src/composables/useMoneyTasks'

const props = defineProps<{
  tasks: MoneyTask[]
  sortedTasks: MoneyTask[]
  completedCount: number
}>()

defineEmits<{
  (e: 'toggle', id: string): void
}>()

type DetailFilter = 'all' | 'active' | 'completed'
const detailFilter = ref<DetailFilter>('all')

const filteredSortedTasks = computed(() => {
  if (detailFilter.value === 'active') return props.sortedTasks.filter((t) => !t.completed)
  if (detailFilter.value === 'completed') return props.sortedTasks.filter((t) => t.completed)
  return props.sortedTasks
})
</script>
