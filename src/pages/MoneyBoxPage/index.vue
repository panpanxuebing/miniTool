<template>
  <div class="container">
    <div class="card moneyBox">
      <div class="header">
        <router-link class="btn back-home-btn" to="/" aria-label="返回首页">
          <img :src="backHomeIconUrl" width="16" height="16" alt="" aria-hidden="true" />
        </router-link>

        <div class="title page-title--with-back">
          <h1>储钱罐</h1>
          <p>完成任务存钱，支出会从余额中扣除</p>
        </div>
        <div class="badge">余额 {{ balanceAmount }} 元</div>
      </div>

      <div class="content">
        <div class="moneyStage">
          <div class="catWrap" aria-label="招财猫" title="点击互动" @click="handleCatClick">
            <div class="amountOverlay" :class="{ 'amountOverlay--low': balanceAmount < 0 }">
              ￥{{ balanceAmount }}
            </div>
            <img
              :src="catImg"
              alt="招财猫"
              class="catImg"
              :class="{ 'catImg--bounce': catBouncing }"
            />
            <transition name="coin-fade">
              <div v-if="showCoinHint" class="coinHint">🪙</div>
            </transition>
          </div>

          <div class="panelButtons">
            <button
              class="btn"
              :class="{ primary: panel === 'add' }"
              type="button"
              @click="panel = 'add'"
            >
              添加任务
            </button>
            <button
              class="btn"
              :class="{ primary: panel === 'details' }"
              type="button"
              @click="panel = 'details'"
            >
              任务详情
            </button>
            <button
              class="btn"
              :class="{ primary: panel === 'expense' }"
              type="button"
              @click="panel = 'expense'"
            >
              支出
            </button>
          </div>
        </div>

        <div class="panelBody">
          <MoneyBoxAddPanel
            v-show="panel === 'add'"
            :default-amount="defaultAmountPerTask"
            @add="handleAdd"
          />

          <MoneyBoxExpensePanel
            v-show="panel === 'expense'"
            :sorted-expenses="sortedExpenses"
            @add="handleExpenseAdd"
            @update="handleExpenseUpdate"
            @delete="handleExpenseDelete"
          />

          <MoneyBoxDetailsPanel
            v-show="panel === 'details'"
            :tasks="tasks"
            :sorted-tasks="sortedTasks"
            @toggle="handleToggle"
            @update="handleUpdate"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMoneyExpenses } from '@src/composables/useMoneyExpenses'
import { useMoneyTasks } from '@src/composables/useMoneyTasks'

import catImg from '@src/assets/money-cat.png'
import backHomeIconUrl from '@src/assets/svg/back-home.svg'
import coinMp3 from '@src/assets/coin.mp3'
import encourageMp3 from '@src/assets/encourage.mp3'
import MoneyBoxAddPanel from '@src/pages/MoneyBoxPage/components/AddPanel.vue'
import MoneyBoxExpensePanel from '@src/pages/MoneyBoxPage/components/ExpensePanel.vue'
import MoneyBoxDetailsPanel from '@src/pages/MoneyBoxPage/components/DetailsPanel.vue'

import './index.less'

const defaultAmountPerTask = 0

type Panel = 'add' | 'expense' | 'details'
const panel = ref<Panel>('add')

const {
  tasks,
  sortedTasks,
  totalAmount: savedTotal,
  addTask,
  toggleTask,
  updateTask,
  removeTask,
} = useMoneyTasks(defaultAmountPerTask)

const { sortedExpenses, totalExpenseAmount, addExpense, updateExpense, removeExpense } =
  useMoneyExpenses()

const balanceAmount = computed(() => savedTotal.value - totalExpenseAmount.value)

// --- 点击互动 ---
const clickCount = ref(0)
const catBouncing = ref(false)
const showCoinHint = ref(false)

function playCoinSound() {
  const audio = new Audio(coinMp3)
  audio.play()
}

function playEncouragement() {
  new Audio(encourageMp3).play()
}

function triggerCoinEffect() {
  playCoinSound()
  catBouncing.value = false
  requestAnimationFrame(() => {
    catBouncing.value = true
    setTimeout(() => {
      catBouncing.value = false
    }, 450)
  })
  showCoinHint.value = true
  setTimeout(() => {
    showCoinHint.value = false
  }, 900)
}

function handleCatClick() {
  // 弹跳动画
  catBouncing.value = false
  requestAnimationFrame(() => {
    catBouncing.value = true
    setTimeout(() => {
      catBouncing.value = false
    }, 450)
  })

  clickCount.value++
  if (clickCount.value % 2 === 1) {
    // 奇数次：钱币声 + 短暂显示硬币提示
    triggerCoinEffect()
  } else {
    // 偶数次：语音播报余额
    playEncouragement()
  }
}

function handleToggle(id: string) {
  const task = tasks.value.find((t) => t.id === id)
  const wasCompleted = task?.completed ?? true
  toggleTask(id)
  // 未完成 → 完成才算入账
  if (!wasCompleted) triggerCoinEffect()
}

function handleAdd(payload: { text: string; date: string; amount: number }) {
  addTask(payload.text, payload.date, payload.amount)
}

function handleUpdate(payload: { id: string; text: string; date: string; amount: number }) {
  updateTask(payload.id, payload.text, payload.date, payload.amount)
}

function handleDelete(id: string) {
  removeTask(id)
}

function handleExpenseAdd(payload: { text: string; date: string; amount: number }) {
  addExpense(payload.text, payload.date, payload.amount)
}

function handleExpenseUpdate(payload: { id: string; text: string; date: string; amount: number }) {
  updateExpense(payload.id, payload.text, payload.date, payload.amount)
}

function handleExpenseDelete(id: string) {
  removeExpense(id)
}
</script>
