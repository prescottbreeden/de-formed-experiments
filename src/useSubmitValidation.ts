import { ValidationObject } from '@de-formed/base'

export const useSubmitValidation = <T>(
  v: ValidationObject<T>,
  formState: any
) => {
  const submit = (callback: any, data: T) => {
    if (v.validateAll(data)) {
      formState.setSubmitFailed(false)
      callback(data).then((response: any) => {
        formState.setAPIerrors(response)
      })
    } else {
      formState.setSubmitFailed(true)
    }
  }

  return {
    ...v,
    submit,
  }
}
