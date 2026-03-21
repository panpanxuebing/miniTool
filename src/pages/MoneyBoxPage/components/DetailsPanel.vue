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
            <th style="width: 150px">日期</th>
            <th style="width: 110px">状态</th>
            <th style="width: 96px">金额</th>
            <th style="width: 140px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, i) in filteredSortedTasks" :key="t.id">
            <td>{{ i + 1 }}</td>
            <td class="taskCell">
              <div class="taskCellRow">
                <input
                  class="checkBox"
                  type="checkbox"
                  :checked="t.completed"
                  @change="$emit('toggle', t.id)"
                  :aria-label="t.completed ? '标记为未完成' : '标记为已完成'"
                  :disabled="editingId === t.id"
                />

                <!-- 编辑态：任务文字 -->
                <template v-if="editingId === t.id">
                  <input
                    v-model="draftText"
                    class="editTextInput"
                    type="text"
                    maxlength="120"
                    :aria-label="`编辑任务：${t.text}`"
                    @keydown.esc.prevent="cancelEdit"
                  />
                </template>

                <template v-else>
                  <span class="taskText" :class="{ completedText: t.completed }" :title="t.text">
                    {{ t.text }}
                  </span>
                </template>
              </div>
            </td>

            <!-- 编辑态：日期 -->
            <td class="dateCell">
              <template v-if="editingId === t.id">
                <el-date-picker
                  v-model="draftDate"
                  class="moneyBoxDatePicker moneyBoxDatePicker--table"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="选择日期"
                  clearable
                  :aria-label="`编辑日期：${t.date}`"
                  @keydown.esc.prevent="cancelEdit"
                />
              </template>
              <template v-else>
                {{ t.date }}
              </template>
            </td>

            <td>
              <span class="statusPill" :class="{ 'statusPill--done': t.completed }">
                {{ t.completed ? '已完成' : '未完成' }}
              </span>
            </td>

            <!-- 编辑态：金额 -->
            <td class="moneyCell">
              <template v-if="editingId === t.id">
                <input
                  v-model.number="draftAmount"
                  class="editAmountInput"
                  type="number"
                  :aria-label="`编辑金额：${t.amount}`"
                  @keydown.esc.prevent="cancelEdit"
                />
              </template>
              <template v-else>
                {{ t.amount }}
              </template>
            </td>

            <td class="opCell">
              <div v-if="editingId === t.id" class="actions">
                <button class="btn primary" type="button" @click="saveEdit(t.id)">保存</button>
                <button class="btn" type="button" @click="cancelEdit">取消</button>
              </div>
              <div v-else class="actions">
                <button class="btn" type="button" @click="startEdit(t)">编辑</button>
                <button class="btn danger" type="button" @click="removeOne(t.id)">删除</button>
              </div>
            </td>
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

const emit = defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'update', payload: { id: string; text: string; date: string; amount: number }): void
  (e: 'delete', id: string): void
}>()

type DetailFilter = 'all' | 'active' | 'completed'
const detailFilter = ref<DetailFilter>('all')

const filteredSortedTasks = computed(() => {
  if (detailFilter.value === 'active') return props.sortedTasks.filter((t) => !t.completed)
  if (detailFilter.value === 'completed') return props.sortedTasks.filter((t) => t.completed)
  return props.sortedTasks
})

const editingId = ref<string | null>(null)
const draftText = ref('')
const draftDate = ref('')
const draftAmount = ref(0)

function startEdit(task: MoneyTask) {
  editingId.value = task.id
  draftText.value = task.text
  draftDate.value = task.date
  draftAmount.value = task.amount
}

function cancelEdit() {
  editingId.value = null
  draftText.value = ''
  draftDate.value = ''
  draftAmount.value = 0
}

function saveEdit(id: string) {
  emit('update', { id, text: draftText.value, date: draftDate.value, amount: draftAmount.value })
  cancelEdit()
}

function removeOne(id: string) {
  ElMessageBox.confirm('确定删除这条任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('delete', id)
    })
    .catch(() => {
      // 用户取消，无操作
    })
}
</script>
