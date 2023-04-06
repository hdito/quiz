import { ref, computed, type ComputedRef } from 'vue'

export function useDisplayErrors(errors: ComputedRef) {
  const isShowErrors = ref(false)

  const displayedErrors = computed(() => {
    if (!isShowErrors.value) return
    const errorCounter = Object.keys(errors.value).reduce(
      (total, errorKey) => {
        if (errorKey.startsWith('questions')) total.questions += 1
        else if (errorKey.startsWith('results')) total.results += 1
        else if (errorKey.startsWith('title')) total.main += 1
        else if (errorKey.startsWith('description')) total.main += 1
        return total
      },
      { main: 0, questions: 0, results: 0 }
    )

    const results: string[] = []
    Object.entries(errorCounter).forEach(([index, errorCount]) => {
      if (errorCount === 0) return
      results.push(
        `${errorCount} ${
          errorCount === 1 || (errorCount % 10 === 1 && errorCount !== 11)
            ? 'ошибка'
            : (errorCount >= 2 && errorCount <= 4) ||
              (errorCount % 10 >= 2 && errorCount % 10 <= 4 && errorCount > 14)
            ? 'ошибки'
            : 'ошибок'
        } в ${
          index === 'main'
            ? 'основных настройках'
            : index === 'questions'
            ? 'вопросах'
            : 'результатах'
        }`
      )
    })
    return results
  })

  function showErrors() {
    isShowErrors.value = true
  }

  function hideErrors() {
    isShowErrors.value = false
  }
  return { showErrors, hideErrors, displayedErrors }
}
