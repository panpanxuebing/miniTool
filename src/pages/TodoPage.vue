<template>
  <div class="container">
    <div class="card">
      <div class="header" style="position: relative">
        <router-link
          class="btn"
          to="/"
          aria-label="返回首页"
          style="
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            z-index: 2;
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 10.5L12 3L21 10.5V21H14.5V15H9.5V21H3V10.5Z"
              stroke="rgba(255,255,255,0.92)"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
          </svg>
        </router-link>

        <div class="title" style="padding-left: 56px">
          <h1>待办事项</h1>
          <p>支持新增、完成/取消、删除、筛选、编辑与本地持久化。</p>
        </div>
        <div class="badge">剩余 {{ remainingCount }} / 全部 {{ todos.length }}</div>
      </div>

      <div class="content">
        <TodoInput @add="addTodo" />

        <TodoFilters
          :filter="filter"
          :remaining-count="remainingCount"
          :completed-count="completedCount"
          @changeFilter="setFilter"
        />

        <TodoList
          :todos="filteredTodos"
          @toggleTodo="toggleTodo"
          @removeTodo="removeTodo"
          @updateTodoText="(p) => updateTodoText(p.id, p.text)"
        />

        <TodoFooter
          :remaining-count="remainingCount"
          :completed-count="completedCount"
          @clearCompleted="clearCompleted"
          @reset="resetDemo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodos } from '../composables/useTodos'
import TodoInput from '../components/TodoInput.vue'
import TodoFilters from '../components/TodoFilters.vue'
import TodoList from '../components/TodoList.vue'
import TodoFooter from '../components/TodoFooter.vue'

const {
  todos,
  filter,
  filteredTodos,
  remainingCount,
  completedCount,
  addTodo,
  toggleTodo,
  removeTodo,
  updateTodoText,
  clearCompleted,
  setFilter,
} = useTodos()

function resetDemo() {
  // 演示用：清空当前并填充少量示例数据（会同步写入 localStorage）
  todos.value = [
    { id: 'demo_1', text: '写下第一个待办', completed: false, createdAt: Date.now() - 86400000 },
    {
      id: 'demo_2',
      text: '勾选完成，看看筛选效果',
      completed: true,
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'demo_3',
      text: '刷新页面仍能保留数据',
      completed: false,
      createdAt: Date.now() - 600000,
    },
  ]
  setFilter('all')
}
</script>
