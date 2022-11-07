import { Person } from './usePersonValidation'
import { required, ValidationSchema } from '@de-formed/base'

export const PersonSchema: ValidationSchema<Person> = {
  name: [required()],
  eyes: [required()],
}
