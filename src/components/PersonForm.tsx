import React from 'react'
import { FieldText } from '@looker/components'
import { usePersonValidation } from '../validations/usePersonValidation'
import { Person, Pet } from '../types'
import { PetForm } from './PetForm'
import { Validate } from './Validate'
import { useComposedForm } from '../hooks/useComposedForm'

interface PersonFormProps {
  data: Person
  onChange: (partial: Partial<Person>) => void
}
export const PersonForm: React.FC<PersonFormProps> = ({ data, onChange }) => {
  const v = usePersonValidation()
  useComposedForm<Person>(v, data)

  const handleChange = (event: any) => {
    onChange({
      [event.target.name]: event.target.value,
    })
  }

  const handlePetChange = (partial: Partial<Pet>) => {
    onChange({ pet: { ...data.pet, ...partial } })
  }

  return (
    <>
      <Validate validation={{ v, data }}>
        <FieldText name="name" onChange={handleChange} />
        <FieldText name="eyes" onChange={handleChange} />
      </Validate>
      <PetForm onChange={handlePetChange} data={data.pet} />
    </>
  )
}
