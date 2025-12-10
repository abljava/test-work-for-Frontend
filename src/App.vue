<template>
  <v-app>
    <v-app-bar color="white" density="compact">
      <img
        class="logo ml-12 mr-4"
        src="https://storage.yandexcloud.net/forlogo/logo.svg"
        alt="Логотип"
      />
      <v-app-bar-title>Управление задачами</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h1 class="text-h4 mb-4">Мои задачи</h1>

                  <TaskFilters
                    :current-filter="currentFilter"
                    :total-count="taskStats.total"
                    :active-count="taskStats.active"
                    :completed-count="taskStats.completed"
                    @filter-change="handleFilterChange"
                  />

                  <TaskForm />

                  <TaskList :tasks="filteredTasks" />

                  <TaskStats />
                </v-col>
              </v-row>
            </v-container>
          </v-col>

          <TaskHistory />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import TaskFilters from '@/components/TaskFilters.vue'
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
import TaskStats from '@/components/TaskStats.vue'
import TaskHistory from '@/components/TaskHistory.vue'
import {
  tasks,
  currentFilter,
  filteredTasks,
  taskStats,
  initTasks
} from '@/composables/useTasks'
import { initHistory } from '@/composables/useTaskHistory'

// Инициализация данных при монтировании
onMounted(() => {
  initTasks()
  initHistory()

  // Если задач нет, загружаем начальные данные
  if (tasks.value.length === 0) {
    loadInitialTasks()
  }
})

// Загрузка начальных задач (для демонстрации)
const loadInitialTasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const initialTasks = [
    {
      id: Date.now() + 1,
      title: 'Изучить Vue 3 Composition API',
      completed: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      completedAt: new Date('2024-01-20')
    },
    {
      id: Date.now() + 2,
      title: 'Написать тестовое задание',
      completed: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      completedAt: null
    },
    {
      id: Date.now() + 3,
      title: 'Рефакторинг legacy кода',
      completed: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
      completedAt: null
    },
    {
      id: Date.now() + 4,
      title: 'Изучить Pinia и лучшие практики',
      completed: true,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-30'),
      completedAt: new Date('2024-01-30')
    }
  ]

  tasks.value = initialTasks
}

const handleFilterChange = (filter: typeof currentFilter.value) => {
  currentFilter.value = filter
}
</script>

<style scoped>
.logo {
  width: 50px;
  height: 50px;
}
</style>
