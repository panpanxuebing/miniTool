

# miniTool

一个基于 Vue 3 + TypeScript + Vite 构建的轻量级工具应用，提供待办事项管理和零钱罐记账功能。

## 功能特性

### 📝 待办事项 (Todo)
- 添加、编辑、删除待办事项
- 标记完成/未完成状态
- 筛选功能（全部/进行中/已完成）
- 数据持久化存储

### 💰 零钱罐记账 (MoneyBox)
- 记录收入和支出
- 可关联具体任务/事项
- 查看历史记录明细
- 余额实时计算显示

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **语言**: TypeScript
- **路由**: Vue Router
- **样式**: Less + CSS

## 项目结构

```
src/
├── assets/          # 静态资源（图片、SVG）
├── composables/     # 组合式函数
│   ├── useMoneyTasks.ts   # 零钱罐数据逻辑
│   └── useTodos.ts        # 待办事项数据逻辑
├── pages/           # 页面组件
│   ├── Home/              # 首页
│   ├── MoneyBoxPage/      # 零钱罐页面
│   └── TodoPage/          # 待办事项页面
├── router/          # 路由配置
├── styles.less      # 全局样式
├── utils/           # 工具函数
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 使用说明

1. **待办事项**: 在首页点击待办事项进入，可添加新的任务并管理完成状态
2. **零钱罐**: 在首页点击零钱罐进入，可记录日常收支，支持关联任务类型

数据会自动保存至浏览器本地存储，无需额外配置数据库。

## 许可证

MIT License