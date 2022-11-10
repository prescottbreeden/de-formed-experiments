import { ValidationObject } from '@de-formed/base'
import { cond, get, startCase } from 'lodash'
import React from 'react'

// --[ types ]-----------------------------------------------------------------
const inputProps = [
  'label',
  'onBlur',
  'onChange',
  'validationMessage',
  'value',
] as const
type InputProps = typeof inputProps[number]
type Mapper = { [k in InputProps]: ({ validation, child }: any) => any }
type Validation = {
    v: ValidationObject<any>
    data: any
  }
type Config = {
  validation: Validation
  child: any
}

// --[ helpers ]---------------------------------------------------------------
const is =
  (displayName: string) =>
  ({ child }: Config) =>
    child.type.displayName === displayName

const map =
  (mapper: Mapper) =>
  ({ validation, child }: Config) =>
    React.cloneElement(
      child,
      Object.keys(mapper).reduce(
        (acc: { [k in InputProps]: any }, curr: any) => ({
          ...acc,
          [curr]: get(mapper, curr)({ validation, child }),
        }),
        {} as { [k in InputProps]: any }
      )
    )

// --[ default factory functions ]---------------------------------------------
const createValue = ({ validation, child }: Config) =>
  child.props.value ? child.props.value : validation?.data[child.props.name]

const createValidationMessage = ({ validation, child }: Config) => {
  const error = validation.v.getError(child.props.name)
  return child.props.validationMessage
    ? child.props.validationMessage
    : error
    ? { type: 'error', message: error }
    : undefined
}
// if no label is provided, auto generate a label
const createLabel = ({ child }: Config) =>
  child.props.label ? child.props.label : startCase(child.props.name)

// wrap onChange handler in validate or pass original along
const createOnChange = ({ validation, child }: Config) =>
  validation
    ? validation.v.validateOnChange(child.props.onChange, validation.data)
    : child.props.onChange

const createOnBlur = ({ validation, child }: Config) =>
  validation
    ? (event: any) => {
        validation.v.validateOnBlur(validation.data)(event)
        child.props?.onBlur && child.props.onBlur(event)
      }
    : child.props.onBlur

// --[ edge case factory functions ]-------------------------------------------
const createFieldSelectOnChange = ({ validation, child }: Config) =>
  validation
    ? (value: string) => {
        const updated = { ...validation.data, [child.props.name]: value }
        validation.v.validate(child.props.name, updated)
        child.props.onChange(value)
      }
    : child.props.onChange

// --[ configurations for transforming child types ]---------------------------
const Default: Mapper = {
  value: createValue,
  validationMessage: createValidationMessage,
  label: createLabel,
  onChange: createOnChange,
  onBlur: createOnBlur
}
const Select: Mapper = {
  ...Default,
  onChange: createFieldSelectOnChange,
}
const Checkbox: Mapper = {
  ...Default,
  onChange: () => null
}
const Toggle: Mapper = {
  ...Default,
  onChange: () => null
}

const mapChildProps = (validation: Validation) => (child: any) =>
  cond([
    [is('FieldSelect'), map(Select)],
    [is('Select'), map(Select)],
    [is('MultiSelect'), map(Select)],
    [is('Checkbox'), map(Checkbox)],
    [is('Toggle'), map(Toggle)],
    [() => true, map(Default)],
  ])({ validation, child })

export const UNIT_TEST = {
  createFieldSelectOnChange,
  createLabel,
  createOnBlur,
  createOnChange,
  createValidationMessage,
  createValue,
  is,
  mapChildProps
}


interface ValidateProps<T> {
  validation: {
    v: ValidationObject<T>
    data: T
  }
  children: any
}

export const Validate: React.FC<ValidateProps<any>> = ({
  validation,
  children,
}) => React.Children.map(children, mapChildProps(validation))

