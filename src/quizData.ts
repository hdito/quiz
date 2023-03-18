import type { Quiz } from './types/quiz'

export const quizData: Quiz = {
  title: 'Тестовый тест',
  description: 'Описание тестового теста',
  questions: [
    {
      text: 'Первый вопрос',
      answers: [
        { score: 0, text: 'Нет' },
        { score: 1, text: 'Да' }
      ]
    },
    {
      text: 'Второй вопрос',
      answers: [
        { score: 0, text: 'Нет' },
        { score: 1, text: 'Да' }
      ]
    },
    {
      text: 'Третий вопрос',
      answers: [
        { score: 0, text: 'Нет' },
        { score: 1, text: 'Да' }
      ]
    }
  ],
  results: [
    { maxScore: 1, minScore: 0, text: 'Первый результат' },
    { minScore: 1, maxScore: 2, text: 'Второй результат' },
    { minScore: 2, maxScore: 3, text: 'Третий результат' }
  ]
}
