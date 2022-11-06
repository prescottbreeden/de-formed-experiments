import React from 'react'
import { ValidationObject } from '@de-formed/base'
import { useForm } from './useForm'

export const useComposedForm = <T>(v: ValidationObject<T>, data: T) => {
  const sideEffects = useForm()

  // --[ Side Effects ]--------------------------------------------------------
  if ('submitFailed' in sideEffects) {
    React.useEffect(() => {
      if (sideEffects.submitFailed) {
        v.validateAll(data)
      }
    }, [sideEffects.submitFailed])
  }

  if ('APIerrors' in sideEffects) {
    React.useEffect(() => {
      if (sideEffects.APIerrors[(data as any).id]) {
        v.setValidationState({
          ...v.validationState,
          ...sideEffects.APIerrors[(data as any).id],
        })
      }
    }, [sideEffects.APIerrors, (data as any).id])
  }

  if ('resetValidation' in sideEffects) {
    React.useEffect(() => {
      v.resetValidationState()
    }, [sideEffects.resetValidation])
  }
}

