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
            .nullable()
            .transform((value) => (value === Number(value) ? value : null))
        })
      ).required()
    })
  ).required(),
  results: array(
    object({
      text: string(),
      min: number()
        .nullable()
        .transform((value) => (value === Number(value) ? value : null)),
      max: number()
        .nullable()
        .transform((value) => (value === Number(value) ? value : null))
    })
  ).required(),
  id: string().required(),
  isPublished: boolean().required(),
  owner: string().required()
})

export type QuizDraft = InferType<typeof QuizDraftSchema>
