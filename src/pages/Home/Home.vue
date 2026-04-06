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
          <router-link class="btn" to="/todo">待办事项</router-link>
          <router-link class="btn" to="/moneybox">储钱罐</router-link>
          <router-link class="btn" to="/study-diary">学习日记</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
