import { ValidationObject } from '@de-formed/base'
import { startCase } from 'lodash'
import React from 'react'

interface ValidateProps {
  validation: {
    v: ValidationObject<any>
    data: any
  }
  children: any
}
// Validate composes field inputs with default de-formed validation behavior.
// If you need to customize the validation logic it is advisable to avoid using
// this component wrapper.
export const Validate: React.FC<ValidateProps> = ({ validation, children }) => {
  return React.Children.map(children, (child) => {
    // components that don't return events can be caught
    if (child.type.displayName === 'FieldSelect') {
      // if validation is present, fire both an explicit onBlur event handler in
      // addition to running blur validation
      const onBlur = validation
        ? (event: any) => {
            validation.v.validateOnBlur(validation.data)(event)
            child.props?.onBlur && child.props.onBlur(event)
          }
        : child.props.onBlur

      // wrap onChange handler in validate or pass original along
      const onChange = validation
        ? (value: string) => {
          const updated = { ...validation.data, [child.props.name]: value}
          validation.v.validate(child.props.name, updated)
          child.props.onChange(value)
        }
        : child.props.onChange

      const error = validation.v.getError(child.props.name)

      // take explicit error message value if present
      const validationMessage = child.props.validationMessage
        ? child.props.validationMessage
        : error
        ? { type: 'error', message: error }
        : undefined
      // if no label is provided, auto generate a label
      const label = child.props.label
        ? child.props.label
        : startCase(child.props.name)

      // take explicit value over implicit -- only use case for this I can
      // currently think of is if the value is being transformed before render
      const value = child.props.value
        ? child.props.value
        : validation?.data[child.props.name]

      return React.cloneElement(child, {
        label,
        onBlur,
        onChange,
        validate: validation,
        validationMessage,
        value,
      })
    } else {
      // if validation is present, fire both an explicit onBlur event handler in
      // addition to running blur validation
      const onBlur = validation
        ? (event: any) => {
            validation.v.validateOnBlur(validation.data)(event)
            child.props?.onBlur && child.props.onBlur(event)
          }
        : child.props.onBlur

      // wrap onChange handler in validate or pass original along
      const onChange = validation
        ? validation.v.validateOnChange(child.props.onChange, validation.data)
        : child.props.onChange

      // take explicit value over implicit -- only use case for this I can
      // currently think of is if the value is being transformed before render
      const value = child.props.value
        ? child.props.value
        : validation?.data[child.props.name]

      const error = validation.v.getError(child.props.name)

      // take explicit error message value if present
      const validationMessage = child.props.validationMessage
        ? child.props.validationMessage
        : error
        ? { type: 'error', message: error }
        : undefined

      // if no label is provided, auto generate a label
      const label = child.props.label
        ? child.props.label
        : startCase(child.props.name)

      return React.cloneElement(child, {
        label,
        onBlur,
        onChange,
        validate: validation,
        validationMessage,
        value,
      })
    }
  })
}
