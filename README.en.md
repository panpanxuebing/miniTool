# miniTool

A lightweight tool application built with Vue 3 + TypeScript + Vite, offering task management and a money box accounting feature.

## Features

### 📝 Todo List
- Add, edit, and delete tasks
- Mark tasks as completed or incomplete
- Filter tasks (All / Active / Completed)
- Data persistence via local storage

### 💰 Money Box
- Record income and expenses
- Link transactions to specific tasks/items
- View detailed transaction history
- Real-time balance calculation and display

## Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Routing**: Vue Router
- **Styling**: Less + CSS

## Project Structure

```
src/
├── assets/          # Static assets (images, SVGs)
├── composables/     # Composable functions
│   ├── useMoneyTasks.ts   # Money box data logic
│   └── useTodos.ts        # Todo list data logic
├── pages/           # Page components
│   ├── Home/              # Home page
│   ├── MoneyBoxPage/      # Money box page
│   └── TodoPage/          # Todo list page
├── router/          # Routing configuration
├── styles.less      # Global styles
├── utils/           # Utility functions
├── App.vue          # Root component
└── main.ts          # Entry file
```

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## Usage Instructions

1. **Todo List**: Navigate to the Todo section from the homepage to add new tasks and manage their completion status.
2. **Money Box**: Navigate to the Money Box section from the homepage to record daily income and expenses, with support for linking transactions to task types.

Data is automatically saved to browser local storage—no database configuration required.

## License

MIT License