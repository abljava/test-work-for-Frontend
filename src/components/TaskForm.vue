<template>
  <v-form ref="formRef" @submit.prevent="handleSubmit" class="mb-6">
    <v-text-field
      v-model="taskTitle"
      label="Новая задача"
      :rules="[validateTaskTitle]"
      validate-on="submit lazy"
      variant="outlined"
      density="comfortable"
      :maxlength="500"
      counter
    />
    <v-btn type="submit" color="primary" class="mt-2">Добавить</v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { addTask } from '@/composables/useTasks'

const taskTitle = ref('')
const formRef = ref<{
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => Promise<void>
} | null>(null)

const validateTaskTitle = (value: string): boolean | string => {
  if (!value?.trim()) {
    return 'Введите текст задачи'
  }
  return true
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate() ?? { valid: false }

  if (!valid) return

  try {
    addTask(taskTitle.value.trim())
    taskTitle.value = ''
    // Используем nextTick для корректного сброса валидации после очистки поля
    await nextTick()
    await formRef.value?.resetValidation()
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  }
}
</script>

