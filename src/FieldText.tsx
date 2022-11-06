import React from 'react'
import { ValidationObject } from '@de-formed/base'

type FieldTextProps<T> = {
  name: string
  onChange: (event: any) => void
  validate?: {
    v: ValidationObject<T>
    data: T
  }
  value?: string
  onBlur?: any
}
export const FieldText: React.FC<FieldTextProps<any>> = ({
  name,
  onBlur,
  onChange,
  validate,
  value
}) => {
  const handleBlur = validate
    ? validate.v.validateOnBlur(validate.data)
    : onBlur

  const handleChange = validate
    ? validate.v.validateOnChange(onChange, validate.data)
    : onChange

  const val = value ? value : validate?.data[name] ?? ''

  return (
    <>
      <div>
        <label htmlFor={name}>{name}</label>
        <div>
          <input
            id={name}
            type="string"
            name={name}
            onBlur={handleBlur}
            onChange={handleChange}
            value={val}
          />
        </div>
        {validate && validate.v.getError(name) && (
          <p>{validate.v.getError(name)}</p>
        )}
      </div>
    </>
  )
}
