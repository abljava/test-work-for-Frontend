/**
 * Composable для управления задачами
 */

import { ref, computed, watch } from 'vue'
import type { Task, TaskFilter } from '@/types/task'
import { saveTasks, loadTasks } from '@/services/taskStorage'
import { logTaskCreated, logTaskCompleted, logTaskUncompleted, logTaskDeleted } from './useTaskHistory'

const tasks = ref<Task[]>([])
const currentFilter = ref<TaskFilter>('all')
const pendingDeletions = ref<Set<number>>(new Set())
const deletionTimers = ref<Record<number, { timerId: number; timeLeft: number }>>({})

/**
 * Инициализация задач из localStorage
 */
export const initTasks = () => {
  const loadedTasks = loadTasks()
  if (loadedTasks.length > 0) {
    tasks.value = loadedTasks
  }
}

/**
 * Отфильтрованные задачи
 */
export const filteredTasks = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return tasks.value.filter(t => !t.completed)
    case 'completed':
      return tasks.value.filter(t => t.completed)
    default:
      return tasks.value
  }
})

/**
 * Статистика задач
 */
export const taskStats = computed(() => {
  const total = tasks.value.length
  const active = tasks.value.filter(t => !t.completed).length
  const completed = tasks.value.filter(t => t.completed).length
  const percentage = total > 0 ? (completed / total * 100).toFixed(1) : '0'
  
  return { total, active, completed, percentage }
})

/**
 * Добавляет новую задачу
 */
export const addTask = (title: string): void => {
  const trimmedTitle = title.trim()
  if (!trimmedTitle) return

  // Валидация длины
  if (trimmedTitle.length > 500) {
    throw new Error('Название задачи не может превышать 500 символов')
  }

  // Санитизация ввода
  const sanitizedTitle = trimmedTitle.replace(/[<>]/g, '')

  const newTask: Task = {
    id: Date.now() + Math.random(), // Более надежная генерация ID
    title: sanitizedTitle,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null
  }

  tasks.value.push(newTask)
  logTaskCreated(newTask)
}

/**
 * Переключает статус выполнения задачи
 */
export const toggleTask = (id: number): void => {
  const task = tasks.value.find(t => t.id === id)
  if (!task) return

  const wasCompleted = task.completed
  task.completed = !task.completed
  task.updatedAt = new Date()
  task.completedAt = task.completed ? new Date() : null

  if (task.completed && !wasCompleted) {
    logTaskCompleted(task)
  } else if (!task.completed && wasCompleted) {
    logTaskUncompleted(task)
  }
}

/**
 * Начинает процесс удаления задачи с отсрочкой
 */
export const startDeletion = (id: number): void => {
  pendingDeletions.value.add(id)

  const timerId = window.setInterval(() => {
    if (deletionTimers.value[id]) {
      deletionTimers.value[id].timeLeft--

      if (deletionTimers.value[id].timeLeft <= 0) {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
          logTaskDeleted(task.title, task.id)
        }
        
        tasks.value = tasks.value.filter(t => t.id !== id)
        pendingDeletions.value.delete(id)

        const timer = deletionTimers.value[id]
        if (timer) {
          clearInterval(timer.timerId)
          delete deletionTimers.value[id]
        }
      }
    }
  }, 1000)

  deletionTimers.value[id] = {
    timerId,
    timeLeft: 10
  }
}

/**
 * Отменяет удаление задачи
 */
export const cancelDeletion = (id: number): void => {
  pendingDeletions.value.delete(id)

  const timer = deletionTimers.value[id]
  if (timer) {
    clearInterval(timer.timerId)
    delete deletionTimers.value[id]
  }
}

/**
 * Проверяет, находится ли задача в процессе удаления
 */
export const isPendingDeletion = (id: number): boolean => {
  return pendingDeletions.value.has(id)
}

/**
 * Получает оставшееся время до удаления
 */
export const getDeletionTimeLeft = (id: number): number => {
  return deletionTimers.value[id]?.timeLeft || 10
}

/**
 * Автоматическое сохранение при изменении задач
 */
watch(
  tasks,
  () => {
    saveTasks(tasks.value)
  },
  { deep: true }
)

// Экспорт реактивных переменных
export { tasks, currentFilter }

