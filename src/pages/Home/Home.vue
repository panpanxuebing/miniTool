<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="title">
          <h1>小工具集</h1>
          <p>选择一个功能开始使用</p>
        </div>
      </div>

      <div class="content">
        <div class="feature-list">
          <router-link class="feature-item" to="/todo">
            <div class="feature-icon">✓</div>
            <div class="feature-info">
              <h3>待办事项</h3>
              <p>管理你的日常任务，提高工作效率</p>
            </div>
            <div class="feature-arrow">→</div>
          </router-link>

          <router-link class="feature-item" to="/moneybox">
            <div class="feature-icon">💰</div>
            <div class="feature-info">
              <h3>储钱罐</h3>
              <p>记录收支明细，轻松管理个人财务</p>
            </div>
            <div class="feature-arrow">→</div>
          </router-link>

          <router-link class="feature-item" to="/study-diary">
            <div class="feature-icon">📖</div>
            <div class="feature-info">
              <h3>学习日记</h3>
              <p>记录学习心得，追踪成长轨迹</p>
            </div>
            <div class="feature-arrow">→</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s ease;
  cursor: pointer;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(110, 168, 254, 0.4);
  transform: translateX(4px);
}

.feature-item:active {
  transform: translateX(2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(110, 168, 254, 0.15);
  border: 1px solid rgba(110, 168, 254, 0.3);
  border-radius: 12px;
  flex-shrink: 0;
}

.feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.feature-info p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.4;
}

.feature-arrow {
  font-size: 20px;
  color: var(--muted);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.feature-item:hover .feature-arrow {
  transform: translateX(4px);
  color: var(--primary);
}
</style>
