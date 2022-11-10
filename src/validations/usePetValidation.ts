import { Pet } from '../types'
import { is, required } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'

export const usePetValidation = () => {
  return useValidation<Pet>({
    name: [required()],
    sex: [
      required(),
      is((s: string) => s === 'm' || s === 'f', 'must be m or f'),
    ],
    dancesTo: [is('Disco')]
  })
}
