<template>
  <div class="filter-section mb-4">
    <v-btn
      @click="$emit('filter-change', 'all')"
      :class="{ 'bg-primary': currentFilter === 'all' }"
      variant="tonal"
      class="mr-2"
    >
      Все ({{ totalCount }})
    </v-btn>
    <v-btn
      @click="$emit('filter-change', 'active')"
      :class="{ 'bg-primary': currentFilter === 'active' }"
      variant="tonal"
      class="mr-2"
    >
      Активные ({{ activeCount }})
    </v-btn>
    <v-btn
      @click="$emit('filter-change', 'completed')"
      :class="{ 'bg-primary': currentFilter === 'completed' }"
      variant="tonal"
      class="mr-2"
    >
      Завершенные ({{ completedCount }})
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import type { TaskFilter } from '@/types/task'

defineProps<{
  currentFilter: TaskFilter
  totalCount: number
  activeCount: number
  completedCount: number
}>()

defineEmits<{
  'filter-change': [filter: TaskFilter]
}>()
</script>

<style scoped>
.filter-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 960px) {
  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-section button {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>

