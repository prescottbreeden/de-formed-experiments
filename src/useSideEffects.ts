import React from 'react'
import { ValidationObject } from '@de-formed/base'
import { useRedux } from './redux/useRedux'
import { API_ERRORS, RESET_VALIDATIONS, SUBMIT_FAILED } from './redux/_keys'

export const useSideEffects = <T>(v: ValidationObject<T>, data: T) => {
  const { data: submitFailed } = useRedux<boolean>(SUBMIT_FAILED)
  const { data: APIerrors } = useRedux<any>(API_ERRORS)
  const { data: resetValidation } = useRedux<boolean>(RESET_VALIDATIONS)

  React.useEffect(() => {
    if (submitFailed) {
      v.validateAll(data)
    }
  }, [submitFailed])

  React.useEffect(() => {
    if (APIerrors[(data as any).id]) {
      v.setValidationState({
        ...v.validationState,
        ...APIerrors[(data as any).id],
      })
    }
  }, [APIerrors, (data as any).id])

  React.useEffect(() => {
    v.resetValidationState()
  }, [resetValidation])
}
