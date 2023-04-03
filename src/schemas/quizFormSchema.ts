import { array, number, object, string } from 'yup'

export const QuizFormSchema = object({
  title: string().required('Название не может быть пустым'),
  description: string().required('Описание не может быть пустым'),
  questions: array(
    object({
      text: string().required('Вопрос не может быть пустым'),
      answers: array(
        object({
          text: string().required('Ответ не может быть пустым'),
          score: number().required('Балл ответа не может быть пустым')
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
      text: string().required('Результат не может быть пустым'),
      min: number().required('Минимальный балл не может быть пустым'),
      max: number().required('Максимальный балл не может быть пустым')
    })
  ).test({
    message: 'Тест должен иметь хотя бы 1 результат',
    test: (array) => array && array.length !== 0
  })
})
