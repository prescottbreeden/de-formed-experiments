import { ValidationObject } from '@de-formed/base'
import React from 'react'

interface ValidateProps {
  validation: {
    v: ValidationObject<any>
    data: any
  }
  children: any
}
export const Validate: React.FC<ValidateProps> = ({ validation, children }) => {
  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      validate: validation,
      value: child.props.value
        ? child.props.value
        : validation.data[child.props.name],
    })
  })
}
