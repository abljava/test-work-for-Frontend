<template>
  <v-form @submit.prevent="handleSubmit" class="mb-6">
    <v-text-field
      v-model="taskTitle"
      label="Новая задача"
      :rules="[validateTaskTitle]"
      variant="outlined"
      density="comfortable"
      :maxlength="500"
      counter
    />
    <v-btn type="submit" color="primary" class="mt-2">Добавить</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addTask } from '@/composables/useTasks'

const taskTitle = ref('')

const validateTaskTitle = (value: string): boolean | string => {
  if (!value || !value.trim()) {
    return 'Введите текст задачи'
  }
  if (value.trim().length > 500) {
    return 'Название задачи не может превышать 500 символов'
  }
  return true
}

const handleSubmit = () => {
  if (!taskTitle.value.trim()) return

  try {
    addTask(taskTitle.value)
    taskTitle.value = ''
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}
</script>

