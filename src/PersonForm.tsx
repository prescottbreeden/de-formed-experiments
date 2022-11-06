import React from 'react'
import { FieldText } from './FieldText'
import { Person } from './CreatePerson'
import { Pet } from './usePetValidation'
import { PetForm } from './PetForm'
import { useComposedForm } from './useMagicForm'
import { usePersonValidation } from './usePersonValidation'

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
      <FieldText name="name" onChange={handleChange} validate={{ v, data }} />
      <FieldText name="eyes" onChange={handleChange} validate={{ v, data }} />
      <PetForm onChange={handlePetChange} data={data.pet} />
    </>
  )
}
