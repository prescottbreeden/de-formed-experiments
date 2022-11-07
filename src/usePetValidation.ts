import { is, required } from '@de-formed/base'
import { useValidation } from '@de-formed/react-validations'

export type Pet = {
  id: string
  name: string
  sex: string
  dancesTo?: string
}

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
