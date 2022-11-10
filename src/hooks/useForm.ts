import React from 'react'
import { ValidationObject, ValidationState } from '@de-formed/base'

export const FormContext = React.createContext<any>({})
export const useForm = () => React.useContext(FormContext)

// useFormProvider generates everything needed to handle sideEffects across
// form components that have no knowledge of their place in the hierarchy. This
// is essential for forms to be truly composable
export const useFormProvider = <T>(v: ValidationObject<T>, data: T) => {
  const [submitFailed, setSubmitFailed] = React.useState<boolean>(false)
  const [APIerrors, setAPIerrors] = React.useState<{
    [key: string]: ValidationState
  }>({})
  const [resetValidation, setResetValidation] = React.useState<boolean>(false)

  return {
    provider: {
      APIerrors,
      resetValidation,
      setAPIerrors,
      setResetValidation,
      setSubmitFailed,
      submitFailed,
    },
    validateSubmit: (callback: () => any): void => {
      if (v.validateAll(data)) {
        setSubmitFailed(false)
        callback()
      } else {
        setSubmitFailed(true)
      }
    },
    resetValidations: (): void => {
      setResetValidation((prev) => !prev)
      setSubmitFailed(false)
    },
    validationObject: v
  }
}
