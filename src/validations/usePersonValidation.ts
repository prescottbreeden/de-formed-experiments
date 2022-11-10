import { usePetValidation } from './usePetValidation'
import { required } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'
import { Person } from '../types'

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
