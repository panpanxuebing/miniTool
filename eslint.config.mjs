import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

const baseConfig = defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
)

export default [
  ...baseConfig,
  {
    rules: {
      // 你现有的组件命名（如 Home.vue）是单词名，先放宽该规则避免 lint 打断开发。
      'vue/multi-word-component-names': 'off',
    },
  },
  // 让 ESLint 把 Prettier 格式化差异当作 lint 违规。
  prettierRecommended,
]
