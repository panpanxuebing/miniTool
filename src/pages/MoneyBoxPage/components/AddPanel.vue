<template>
  <form class="addPanel" @submit.prevent="submitAdd">
    <input
      v-model="draftText"
      class="moneyInput"
      type="text"
      maxlength="120"
      placeholder="输入任务，回车提交…"
      aria-label="任务输入框"
    />

    <div class="addMetaRow">
      <el-date-picker
        v-model="draftDate"
        class="moneyBoxDatePicker"
        type="date"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        placeholder="选择日期"
        clearable
        aria-label="日期选择"
      />
      <input
        v-model.number="draftAmount"
        class="moneyInput"
        type="number"
        aria-label="金额输入框"
        placeholder="金额"
      />
    </div>

    <div class="hint">
      提示：日期/金额在添加时填写；在“详情”里可以切换完成状态，已完成的任务会计入金额。
    </div>

    <button class="btn primary" type="submit" :disabled="submitDisabled">确定</button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatYMD } from '@src/utils'

const props = defineProps<{
  defaultAmount: number
}>()

const emit = defineEmits<{
  (e: 'add', payload: { text: string; date: string; amount: number }): void
}>()

const draftText = ref('')
const draftDate = ref(formatYMD(Date.now()))
const draftAmount = ref(props.defaultAmount)

watch(
  () => props.defaultAmount,
  (v) => {
    draftAmount.value = v
  },
)

const submitDisabled = computed(() => draftText.value.trim().length === 0)

function submitAdd() {
  const text = draftText.value.trim()
  if (!text) return

  emit('add', { text, date: draftDate.value, amount: draftAmount.value })

  // reset inputs
  draftText.value = ''
  draftDate.value = formatYMD(Date.now())
  draftAmount.value = props.defaultAmount
}
</script>
