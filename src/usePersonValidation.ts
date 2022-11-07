import { Pet, usePetValidation } from './usePetValidation'
import { required } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'

export type Person = {
  id: string
  name: string
  eyes: string
  pet: Pet
}

export const emptyPerson = () => ({
  id: 'person',
  name: '',
  eyes: '',
  pet: {
    id: 'pet',
    name: '',
    sex: '',
  },
})

export const usePersonValidation = () => {
  const { validateAll: validatePet } = usePetValidation()
  return useValidation<Person>({
    name: [required()],
    eyes: [required()],
    pet: [
      {
        error: 'Pet is invalid',
        validation: ({ pet }) => validatePet(pet),
      },
    ],
  })
}
