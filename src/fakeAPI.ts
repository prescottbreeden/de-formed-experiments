import { ValidationState } from '@de-formed/base'
import { Validation } from '@de-formed/node-validations'
import {Person} from './usePersonValidation'

type NestedValidationState = {
  [key: string]: ValidationState
}

export const Query = {
  async submit(data: Person) {
    const v = Validation<Person>({
      name: [
        {
          error: 'must be bob ross',
          validation: ({ name }) => name === 'bob ross',
        },
      ],
      eyes: [
        {
          error: 'must be blue',
          validation: ({ eyes }) => eyes === 'blue',
        },
      ],
    })
    return Promise.resolve(
      v.validateAll(data)
        ? ({} as NestedValidationState)
        : {
            [(data as any).id]: v.validationState,
          } as NestedValidationState
    )
  },
}
