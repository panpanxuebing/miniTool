<template>
  <div class="expensePanel">
    <form class="addPanel expenseForm" @submit.prevent="submitExpense">
      <input
        v-model="draftText"
        class="moneyInput"
        type="text"
        maxlength="120"
        placeholder="支出说明，如：买书、聚餐…"
        aria-label="支出说明"
      />

      <div class="addMetaRow">
        <el-date-picker
          v-model="draftDate"
          class="moneyBoxDatePicker"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          placeholder="支出日期"
          clearable
          aria-label="支出日期"
        />
        <input
          v-model.number="draftAmount"
          class="moneyInput"
          type="number"
          min="0.01"
          step="0.01"
          aria-label="支出金额"
          placeholder="金额（元）"
        />
      </div>

      <div class="hint">支出会从当前余额中扣除；余额 = 已完成任务金额合计 − 支出合计。</div>

      <button class="btn primary" type="submit" :disabled="submitDisabled">记一笔支出</button>
    </form>

    <div v-if="sortedExpenses.length === 0" class="empty expenseEmpty">暂无支出记录。</div>

    <div v-else class="tableWrap expenseTableWrap">
      <table class="historyTable expenseTable">
        <thead>
          <tr>
            <th style="width: 54px">序号</th>
            <th>说明</th>
            <th style="width: 150px">日期</th>
            <th style="width: 96px">金额</th>
            <th style="width: 140px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in sortedExpenses" :key="e.id">
            <td>{{ i + 1 }}</td>
            <td class="taskCell">
              <template v-if="editingId === e.id">
                <input
                  v-model="draftEditText"
                  class="editTextInput"
                  type="text"
                  maxlength="120"
                  :aria-label="`编辑说明：${e.text}`"
                  @keydown.esc.prevent="cancelEdit"
                />
              </template>
              <span v-else class="taskText" :title="e.text">{{ e.text }}</span>
            </td>
            <td class="dateCell">
              <template v-if="editingId === e.id">
                <el-date-picker
                  v-model="draftEditDate"
                  class="moneyBoxDatePicker moneyBoxDatePicker--table"
                  type="date"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  placeholder="日期"
                  clearable
                  @keydown.esc.prevent="cancelEdit"
                />
              </template>
              <template v-else>{{ e.date }}</template>
            </td>
            <td class="moneyCell moneyCell--expense">
              <template v-if="editingId === e.id">
                <input
                  v-model.number="draftEditAmount"
                  class="editAmountInput"
                  type="number"
                  min="0.01"
                  step="0.01"
                  @keydown.esc.prevent="cancelEdit"
                />
              </template>
              <template v-else>−{{ e.amount }}</template>
            </td>
            <td class="opCell">
              <div v-if="editingId === e.id" class="actions">
                <button class="btn primary" type="button" @click="saveEdit(e.id)">保存</button>
                <button class="btn" type="button" @click="cancelEdit">取消</button>
              </div>
              <div v-else class="actions">
                <button class="btn" type="button" @click="startEdit(e)">编辑</button>
                <button class="btn danger" type="button" @click="removeOne(e.id)">删除</button>
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
import type { MoneyExpense } from '@src/composables/useMoneyExpenses'
import { formatYMD } from '@src/utils'

defineProps<{
  sortedExpenses: MoneyExpense[]
}>()

const emit = defineEmits<{
  (e: 'add', payload: { text: string; date: string; amount: number }): void
  (e: 'update', payload: { id: string; text: string; date: string; amount: number }): void
  (e: 'delete', id: string): void
}>()

const draftText = ref('')
const draftDate = ref(formatYMD(Date.now()))
const draftAmount = ref<number | ''>('')

const submitDisabled = computed(() => {
  const n = Number(draftAmount.value)
  return draftText.value.trim().length === 0 || !Number.isFinite(n) || n <= 0
})

function submitExpense() {
  if (submitDisabled.value) return
  const amount = Number(draftAmount.value)
  emit('add', { text: draftText.value.trim(), date: draftDate.value, amount })
  draftText.value = ''
  draftDate.value = formatYMD(Date.now())
  draftAmount.value = ''
}

const editingId = ref<string | null>(null)
const draftEditText = ref('')
const draftEditDate = ref('')
const draftEditAmount = ref(0)

function startEdit(e: MoneyExpense) {
  editingId.value = e.id
  draftEditText.value = e.text
  draftEditDate.value = e.date
  draftEditAmount.value = e.amount
}

function cancelEdit() {
  editingId.value = null
  draftEditText.value = ''
  draftEditDate.value = ''
  draftEditAmount.value = 0
}

function saveEdit(id: string) {
  emit('update', {
    id,
    text: draftEditText.value,
    date: draftEditDate.value,
    amount: draftEditAmount.value,
  })
  cancelEdit()
}

function removeOne(id: string) {
  ElMessageBox.confirm('确定删除这条支出记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('delete', id)
    })
    .catch(() => {})
}
</script>
