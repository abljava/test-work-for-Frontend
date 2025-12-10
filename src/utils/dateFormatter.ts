/**
 * Утилита для форматирования дат
 */

export const formatDate = (date: Date | null): string => {
  if (!date) return '—'
  
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } catch (error) {
    console.error('Ошибка форматирования даты:', error)
    return '—'
  }
}

