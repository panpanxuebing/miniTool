<template>
  <div class="container">
    <div class="card studyDiary">
      <div class="header">
        <router-link class="btn back-home-btn" to="/" aria-label="返回首页">
          <img :src="backHomeIconUrl" width="16" height="16" alt="" aria-hidden="true" />
        </router-link>

        <div class="title page-title--with-back">
          <h1>学习日记</h1>
          <p>按日期记录每天的学习内容，数据保存在本机浏览器。</p>
        </div>
        <div class="badge">共 {{ entries.length }} 条</div>
      </div>

      <div class="content">
        <section class="studyDiary__compose" aria-label="新增记录">
          <div class="studyDiary__row">
            <label class="studyDiary__label" for="study-date">日期</label>
            <el-date-picker
              id="study-date"
              v-model="draftDate"
              class="studyDiary__datePicker"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              placeholder="选择日期"
              :clearable="false"
              aria-label="日记日期"
            />
          </div>
          <label class="studyDiary__label" for="study-content">学习内容</label>
          <textarea
            id="study-content"
            v-model="draftContent"
            class="studyDiary__textarea"
            rows="5"
            maxlength="4000"
            placeholder="例如：今日复习了 Vue 组合式 API，完成一个小练习…"
            aria-label="学习内容"
          />
          <div class="studyDiary__actions">
            <button class="btn primary" type="button" :disabled="!canSubmit" @click="submit">
              保存记录
            </button>
          </div>
        </section>

        <section class="studyDiary__list" aria-label="历史记录">
          <h2 class="studyDiary__listTitle">历史记录</h2>
          <div v-if="entriesByDate.length === 0" class="empty">暂无记录，先在上方写一条吧。</div>
          <div v-else class="studyDiary__groups">
            <div v-for="[date, items] in entriesByDate" :key="date" class="studyDiary__group">
              <h3 class="studyDiary__dateHeading">{{ date }}</h3>
              <ul class="studyDiary__items">
                <li v-for="item in items" :key="item.id" class="studyDiary__item">
                  <template v-if="editingId === item.id">
                    <textarea
                      v-model="editDraft"
                      class="studyDiary__textarea studyDiary__textarea--inline"
                      rows="4"
                      maxlength="4000"
                      :aria-label="`编辑：${date}`"
                    />
                    <div class="studyDiary__itemActions">
                      <button class="btn primary" type="button" @click="saveEdit(item.id)">
                        保存
                      </button>
                      <button class="btn" type="button" @click="cancelEdit">取消</button>
                    </div>
                  </template>
                  <template v-else>
                    <p class="studyDiary__itemText">{{ item.content }}</p>
                    <div class="studyDiary__itemActions">
                      <button class="btn" type="button" @click="startEdit(item)">编辑</button>
                      <button class="btn danger" type="button" @click="remove(item.id)">
                        删除
                      </button>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatYMD } from '@src/utils'
import type { StudyDiaryEntry } from '@src/composables/useStudyDiary'
import { useStudyDiary } from '@src/composables/useStudyDiary'
import backHomeIconUrl from '@src/assets/svg/back-home.svg'

import './index.less'

const draftDate = ref(formatYMD(Date.now()))
const draftContent = ref('')

const { entries, entriesByDate, addEntry, updateEntry, removeEntry } = useStudyDiary()

const canSubmit = computed(() => draftContent.value.trim().length > 0 && !!draftDate.value)

function submit() {
  if (!canSubmit.value || !draftDate.value) return
  addEntry(draftDate.value, draftContent.value)
  draftContent.value = ''
}

const editingId = ref<string | null>(null)
const editDraft = ref('')

function startEdit(item: StudyDiaryEntry) {
  editingId.value = item.id
  editDraft.value = item.content
}

function cancelEdit() {
  editingId.value = null
  editDraft.value = ''
}

function saveEdit(id: string) {
  updateEntry(id, editDraft.value)
  cancelEdit()
}

function remove(id: string) {
  removeEntry(id)
  if (editingId.value === id) cancelEdit()
}
</script>
