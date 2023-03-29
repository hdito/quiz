import { array, number, object, string, type InferType } from 'yup'

export const QuizSchema = object({
  title: string().required(),
  description: string().required(),
  questions: array(
    object({
      text: string().required(),
      answers: array(
        object({
          text: string().required(),
          score: number().required()
        })
      ).required()
    })
  ).required(),
  results: array(
    object({
      text: string().required(),
      min: number().required(),
      max: number().required()
    })
  ).required(),
  id: string().required()
})

export type Quiz = InferType<typeof QuizSchema>
