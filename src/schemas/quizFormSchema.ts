import { array, number, object, string } from 'yup'

export const QuizFormSchema = object({
  title: string().required('Не может быть пустым'),
  description: string().required('Не может быть пустым'),
  questions: array(
    object({
      text: string().required('Не может быть пустым'),
      answers: array(
        object({
          text: string().required('Не может быть пустым'),
          score: number().required('Не может быть пустым')
        })
      ).test({
        message: 'Вопрос должен иметь хотя бы 1 ответ',
        test: (array) => array && array.length !== 0
      })
    })
  ).test({
    message: 'Тест должен иметь хотя бы 1 вопрос',
    test: (array) => array && array.length !== 0
  }),
  results: array(
    object({
      text: string().required('Не может быть пустым'),
      min: number().required('Не может быть пустым'),
      max: number().required('Не может быть пустым')
    })
  ).test({
    message: 'Тест должен иметь хотя бы 1 результат',
    test: (array) => array && array.length !== 0
  })
})
