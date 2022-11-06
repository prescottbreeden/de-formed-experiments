import { Person } from './CreatePerson'
import { required } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'
import {usePetValidation} from './usePetValidation'

export const usePersonValidation = () => {
  const { validateAll: validatePet } = usePetValidation()
  return useValidation<Person>({
    name: [required()],
    eyes: [required()],
    pet: [
      {
        error: 'Pet is invalid',
        validation: validatePet
      }
    ]
  })
}
