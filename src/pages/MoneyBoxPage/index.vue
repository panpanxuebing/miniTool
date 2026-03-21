<template>
  <div class="container">
    <div class="card moneyBox">
      <div class="header">
        <router-link class="btn back-home-btn" to="/" aria-label="返回首页">
          <img :src="backHomeIconUrl" width="16" height="16" alt="" aria-hidden="true" />
        </router-link>

        <div class="title page-title--with-back">
          <h1>储钱罐</h1>
          <p>完成任务即可存钱</p>
        </div>
        <div class="badge">已存 {{ totalAmount }} 元</div>
      </div>

      <div class="content">
        <div class="moneyStage">
          <div class="catWrap" aria-label="招财猫">
            <img :src="catImg" alt="招财猫" class="catImg" />
            <div class="amountOverlay">￥{{ totalAmount }}</div>
          </div>

          <div class="panelButtons">
            <button
              class="btn"
              :class="{ primary: panel === 'add' }"
              type="button"
              @click="panel = 'add'"
            >
              添加
            </button>
            <button
              class="btn"
              :class="{ primary: panel === 'details' }"
              type="button"
              @click="panel = 'details'"
            >
              详情
            </button>
          </div>
        </div>

        <div class="panelBody">
          <MoneyBoxAddPanel
            v-if="panel === 'add'"
            :default-amount="defaultAmountPerTask"
            @add="handleAdd"
          />

          <MoneyBoxDetailsPanel
            v-else
            :tasks="tasks"
            :sorted-tasks="sortedTasks"
            :completed-count="completedCount"
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
import { ref } from 'vue'
import { useMoneyTasks } from '@src/composables/useMoneyTasks'

import catImg from '@src/assets/money-cat.png'
import backHomeIconUrl from '@src/assets/svg/back-home.svg'
import MoneyBoxAddPanel from '@src/pages/MoneyBoxPage/components/AddPanel.vue'
import MoneyBoxDetailsPanel from '@src/pages/MoneyBoxPage/components/DetailsPanel.vue'

import '@src/pages/MoneyBoxPage/index.less'

const defaultAmountPerTask = 0

type Panel = 'add' | 'details'
const panel = ref<Panel>('add')

const {
  tasks,
  sortedTasks,
  completedCount,
  totalAmount,
  addTask,
  toggleTask,
  updateTask,
  removeTask,
} = useMoneyTasks(defaultAmountPerTask)

function handleAdd(payload: { text: string; date: string; amount: number }) {
  addTask(payload.text, payload.date, payload.amount)
}

function handleUpdate(payload: { id: string; text: string; date: string; amount: number }) {
  updateTask(payload.id, payload.text, payload.date, payload.amount)
}

function handleDelete(id: string) {
  removeTask(id)
}
</script>
