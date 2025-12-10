<template>
  <v-col cols="12" md="4">
    <v-container>
      <h2 class="text-h5 mb-4">История изменений</h2>
      
      <v-list lines="two" class="elevation-1 rounded" max-height="600" style="overflow-y: auto;">
        <v-list-item v-for="entry in history" :key="entry.id">
          <template v-slot:prepend>
            <v-icon :color="getActionColor(entry.action)" class="mr-2">
              {{ getActionIcon(entry.action) }}
            </v-icon>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ getActionText(entry.action) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <div>Задача: {{ entry.taskTitle }}</div>
            <div>{{ formatDate(entry.timestamp) }}</div>
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-if="history.length === 0">
          <v-list-item-title class="text-grey">
            История изменений пуста
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-container>
  </v-col>
</template>

<script setup lang="ts">
import { getHistory } from '@/composables/useTaskHistory'
import { formatDate } from '@/utils/dateFormatter'
import type { TaskHistoryEntry } from '@/types/task'

const history = getHistory

const getActionText = (action: TaskHistoryEntry['action']): string => {
  const actions = {
    created: 'Создана задача',
    completed: 'Завершена задача',
    uncompleted: 'Отменено завершение',
    deleted: 'Удалена задача'
  }
  return actions[action]
}

const getActionIcon = (action: TaskHistoryEntry['action']): string => {
  const icons = {
    created: 'mdi-plus-circle',
    completed: 'mdi-check-circle',
    uncompleted: 'mdi-close-circle',
    deleted: 'mdi-delete-circle'
  }
  return icons[action]
}

const getActionColor = (action: TaskHistoryEntry['action']): string => {
  const colors = {
    created: 'success',
    completed: 'primary',
    uncompleted: 'warning',
    deleted: 'error'
  }
  return colors[action]
}
</script>

