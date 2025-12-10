<template>
  <v-list lines="two" class="elevation-1 rounded">
    <v-list-item v-for="task in tasks" :key="task.id">
      <template v-slot:prepend>
        <v-checkbox
          :model-value="task.completed"
          @update:model-value="() => toggleTask(task.id)"
          density="comfortable"
        />
      </template>

      <v-list-item-title
        :class="{ 'text-decoration-line-through text-grey': task.completed }"
        class="font-weight-medium"
      >
        {{ task.title }}
      </v-list-item-title>
      <v-list-item-subtitle>
        Создано: {{ formatDate(task.createdAt) }}
        | Обновлено: {{ formatDate(task.updatedAt) }}
        <span v-if="task.completed">
          | Завершено: {{ formatDate(task.completedAt) }}
        </span>
      </v-list-item-subtitle>

      <template v-slot:append>
        <div v-if="isPendingDeletion(task.id)" class="deletion-pending">
          <v-chip color="error" size="small" class="mr-2">
            Удаление через {{ getDeletionTimeLeft(task.id) }}
          </v-chip>
          <v-btn
            @click="cancelDeletion(task.id)"
            variant="text"
            color="warning"
            size="small"
          >
            Отмена
          </v-btn>
        </div>
        <v-btn
          v-else
          icon
          @click="startDeletion(task.id)"
          variant="text"
          color="error"
          size="small"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task'
import { formatDate } from '@/utils/dateFormatter'
import {
  toggleTask,
  startDeletion,
  cancelDeletion,
  isPendingDeletion,
  getDeletionTimeLeft
} from '@/composables/useTasks'

defineProps<{
  tasks: Task[]
}>()
</script>

<style scoped>
.deletion-pending {
  display: flex;
  align-items: center;
}

.text-decoration-line-through {
  text-decoration: line-through;
}
</style>

