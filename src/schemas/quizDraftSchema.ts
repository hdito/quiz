import { array, number, object, string, type InferType, boolean } from 'yup'

export const QuizDraftSchema = object({
  title: string(),
  description: string(),
  questions: array(
    object({
      text: string(),
      answers: array(
        object({
          text: string(),
          score: number()
        })
      ).required()
    })
  ).required(),
  results: array(
    object({
      text: string(),
      min: number(),
      max: number()
    })
  ).required(),
  id: string().required(),
  isPublished: boolean().required(),
  owner: string().required()
})

export type QuizDraft = InferType<typeof QuizDraftSchema>
