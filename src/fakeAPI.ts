import { Validation } from '@de-formed/node-validations'
import { Person } from './CreatePerson'

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
    return Promise.resolve(v.validateAll(data)
      ? {}
      : {
          [(data as any).id]: v.validationState,
        })
  },
}
