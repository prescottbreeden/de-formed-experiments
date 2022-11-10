import React from 'react'
import { ValidationSchema } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'
import { API_ERRORS, RESET_VALIDATIONS, SUBMIT_FAILED } from '../redux/_keys'
import { useRedux } from '../redux/useRedux'

export const useMagicForm = <T>(schema: ValidationSchema<T>, data: T) => {
  // --[ Redux ]---------------------------------------------------------------
  const { dispatch: setSubmitFailed, data: submitFailed } =
    useRedux<boolean>(SUBMIT_FAILED)
  const { dispatch: setAPIerrors, data: APIerrors } = useRedux<any>(API_ERRORS)
  const { data: resetValidation } = useRedux<boolean>(RESET_VALIDATIONS)

  // --[ Validation Object ]---------------------------------------------------
  const v = useValidation(schema)

  // --[ Submit Callback Wrapper ]---------------------------------------------
  const submit = (callback: any, data: T) => {
    if (v.validateAll(data)) {
      setSubmitFailed(false)
      callback(data).then((response: any) => {
        setAPIerrors(response)
      })
    } else {
      setSubmitFailed(true)
    }
  }

  // --[ Side Effects ]--------------------------------------------------------
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


  return {
    ...v,
    submit,
  }
}
