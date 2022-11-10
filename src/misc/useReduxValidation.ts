import React from 'react'
import {
  calculateIsValid,
  createGetAllErrors,
  createGetError,
  createGetFieldValid,
  createValidate,
  createValidateAll,
  createValidateAllIfDirty,
  createValidateIfDirty,
  createValidateOnBlur,
  createValidateOnChange,
  createValidationState,
  gatherValidationErrors,
  GetAllErrors,
  GetError,
  GetFieldValid,
  ResetValidationState,
  SchemaConfig,
  Validate,
  ValidateAll,
  ValidateAllIfDirty,
  ValidateIfDirty,
  ValidateOnBlur,
  ValidateOnChange,
  ValidationSchema,
  ValidationState,
} from '@de-formed/base'
import { useRedux } from '../redux/useRedux'
import { API_ERRORS, RESET_VALIDATIONS, SUBMIT_FAILED } from '../redux/_keys'

/**
 * A hook that can be used to generate an object containing functions and
 * properties pertaining to the validation schema provided.
 * @param validationSchema an object containing all properties to validate
 * @returns validationObject
 */
export const useValidation = <S>(
  validationSchema: ValidationSchema<S>,
  config?: SchemaConfig
) => {
  // --[ local states ]--------------------------------------------------------
  const [validationState, setValidationState] = React.useState<ValidationState>(
    () =>
      createValidationState({
        validationSchema,
        config,
      })
  )
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])
  const [isValid, setIsValid] = React.useState<boolean>(true)

  // --[ validation logic ] ---------------------------------------------------

  const resetValidationState: ResetValidationState = () =>
    setValidationState(
      createValidationState({
        validationSchema,
        config,
      })
    )

  const validate: Validate<S> = createValidate({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const validateAll: ValidateAll<S> = createValidateAll({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const validateAllIfDirty: ValidateAllIfDirty<S> = createValidateAllIfDirty({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const validateIfDirty: ValidateIfDirty<S> = createValidateIfDirty({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const validateOnBlur: ValidateOnBlur<S> = createValidateOnBlur({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const validateOnChange: ValidateOnChange<S> = createValidateOnChange({
    config,
    validationSchema,
    validationState,
    setValidationState,
  })

  const getAllErrors: GetAllErrors<S> = createGetAllErrors(validationState)

  const getError: GetError<S> = createGetError(validationState)

  const getFieldValid: GetFieldValid<S> = createGetFieldValid(validationState)

  // redux
  const { dispatch: setSubmitFailed, data: submitFailed } =
    useRedux<boolean>(SUBMIT_FAILED)
  const { dispatch: setAPIerrors, data: APIerrors } = useRedux<{}>(API_ERRORS)
  const { dispatch: setResetValidation, data: resetValidation } =
    useRedux<boolean>(RESET_VALIDATIONS, 'useFormProvider')

  // -- update validation error array and isValid when validation state changes
  React.useEffect(() => {
    setValidationErrors(gatherValidationErrors(validationState))
    setIsValid(calculateIsValid(validationState))
  }, [validationState])

  const validationObject: any = {
    getAllErrors,
    getError,
    getFieldValid,
    isValid,
    resetValidationState,
    setValidationState,
    validate,
    validateAll,
    validateAllIfDirty,
    validateIfDirty,
    validateOnBlur,
    validateOnChange,
    validationErrors,
    validationState,

    // experiments
    APIerrors,
    resetValidation,
    setAPIerrors,
    setResetValidation,
    setSubmitFailed,
    submitFailed,
  }

  return validationObject
}
