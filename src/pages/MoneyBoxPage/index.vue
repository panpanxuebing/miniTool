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
          <div class="catWrap" aria-label="招财猫">
            <img :src="catImg" alt="招财猫" class="catImg" />
            <div class="amountOverlay" :class="{ 'amountOverlay--low': balanceAmount < 0 }">
              ￥{{ balanceAmount }}
            </div>
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
            @toggle="toggleTask"
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
