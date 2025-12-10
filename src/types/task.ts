export interface Task {
  id: number
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

export interface TaskHistoryEntry {
  id: string
  taskId: number
  taskTitle: string
  action: 'created' | 'completed' | 'uncompleted' | 'deleted'
  timestamp: Date
}

export type TaskFilter = 'all' | 'active' | 'completed'
