<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="title">
          <h1>首页</h1>
          <p>选择一个功能开始使用。</p>
        </div>
      </div>

      <div class="content">
        <div style="display: flex; gap: 10px; flex-wrap: wrap">
          <router-link class="btn primary" to="/todo">待办事项</router-link>
        </div>

        <div class="empty" style="margin-top: 16px">
          你可以在首页菜单导航到 `/todo`，查看待办事项应用。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
