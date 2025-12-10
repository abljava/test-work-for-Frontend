/**
 * Composable для управления историей изменений задач
 */

import { ref, computed } from 'vue'
import type { TaskHistoryEntry, Task } from '@/types/task'
import { saveHistory, loadHistory } from '@/services/taskStorage'

const history = ref<TaskHistoryEntry[]>([])

/**
 * Инициализация истории из localStorage
 */
export const initHistory = () => {
  history.value = loadHistory()
}

/**
 * Добавляет запись в историю
 */
const addHistoryEntry = (
  taskId: number,
  taskTitle: string,
  action: TaskHistoryEntry['action']
) => {
  const entry: TaskHistoryEntry = {
    id: `${taskId}-${Date.now()}-${Math.random()}`,
    taskId,
    taskTitle: taskTitle.length > 30 ? taskTitle.substring(0, 30) + '...' : taskTitle,
    action,
    timestamp: new Date()
  }

  history.value.unshift(entry)

  // Ограничиваем историю последними 100 записями
  if (history.value.length > 100) {
    history.value = history.value.slice(0, 100)
  }

  saveHistory(history.value)
}

/**
 * Создает запись о создании задачи
 */
export const logTaskCreated = (task: Task) => {
  addHistoryEntry(task.id, task.title, 'created')
}

/**
 * Создает запись о завершении задачи
 */
export const logTaskCompleted = (task: Task) => {
  addHistoryEntry(task.id, task.title, 'completed')
}

/**
 * Создает запись об отмене завершения задачи
 */
export const logTaskUncompleted = (task: Task) => {
  addHistoryEntry(task.id, task.title, 'uncompleted')
}

/**
 * Создает запись об удалении задачи
 */
export const logTaskDeleted = (taskTitle: string, taskId: number) => {
  addHistoryEntry(taskId, taskTitle, 'deleted')
}

/**
 * Получает историю изменений
 */
export const getHistory = computed(() => history.value)

