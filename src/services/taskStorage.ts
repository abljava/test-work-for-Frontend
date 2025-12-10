/**
 * Сервис для работы с localStorage
 */

import type { Task, TaskHistoryEntry } from '@/types/task'

const TASKS_STORAGE_KEY = 'tasks'
const HISTORY_STORAGE_KEY = 'taskHistory'

/**
 * Проверяет доступность localStorage
 */
const isStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Сохраняет задачи в localStorage
 */
export const saveTasks = (tasks: Task[]): void => {
  if (!isStorageAvailable()) {
    console.warn('localStorage недоступен')
    return
  }

  try {
    const serialized = tasks.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      completedAt: task.completedAt ? task.completedAt.toISOString() : null
    }))
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(serialized))
  } catch (error) {
    console.error('Ошибка сохранения задач:', error)
  }
}

/**
 * Загружает задачи из localStorage
 */
export const loadTasks = (): Task[] => {
  if (!isStorageAvailable()) {
    return []
  }

  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored) as Array<{
      id: number
      title: string
      completed: boolean
      createdAt: string
      updatedAt: string
      completedAt: string | null
    }>

    return parsed.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : null
    }))
  } catch (error) {
    console.error('Ошибка загрузки задач:', error)
    return []
  }
}

/**
 * Сохраняет историю изменений в localStorage
 */
export const saveHistory = (history: TaskHistoryEntry[]): void => {
  if (!isStorageAvailable()) {
    console.warn('localStorage недоступен')
    return
  }

  try {
    const serialized = history.map(entry => ({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }))
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(serialized))
  } catch (error) {
    console.error('Ошибка сохранения истории:', error)
  }
}

/**
 * Загружает историю изменений из localStorage
 */
export const loadHistory = (): TaskHistoryEntry[] => {
  if (!isStorageAvailable()) {
    return []
  }

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored) as Array<{
      id: string
      taskId: number
      taskTitle: string
      action: 'created' | 'completed' | 'uncompleted' | 'deleted'
      timestamp: string
    }>

    return parsed.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }))
  } catch (error) {
    console.error('Ошибка загрузки истории:', error)
    return []
  }
}

