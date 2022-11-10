import React from 'react'
import { useRedux } from '../redux/useRedux'
import { API_ERRORS, RESET_VALIDATIONS, SUBMIT_FAILED } from '../redux/_keys'

export const FormContext = React.createContext<any>({})
export const useForm = () => React.useContext(FormContext)

export const useFormProvider = () => {
  const { dispatch: setSubmitFailed, data: submitFailed } = useRedux<boolean>(
    SUBMIT_FAILED,
    'useFormProvider'
  )
  const { dispatch: setAPIerrors, data: APIerrors } = useRedux<{}>(
    API_ERRORS,
    'useFormProvider'
  )
  const { dispatch: setResetValidation, data: resetValidation } =
    useRedux<boolean>(RESET_VALIDATIONS, 'useFormProvider')

  return {
    APIerrors,
    resetValidation,
    setAPIerrors,
    setResetValidation,
    setSubmitFailed,
    submitFailed,
  }
}
