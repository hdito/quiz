type Answer = {
  text: string
  score: number
}

type Question = {
  text: string
  answers: Answer[]
}

type Result = {
  text: string
  minScore: number
  maxScore: number
}

export type Quiz = {
  title: string
  description: string
  questions: Question[]
  results: Result[]
}
