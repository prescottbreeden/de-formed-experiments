import React from 'react'
import { FieldText } from './FieldText'
import { useComposedForm } from './useMagicForm'
import { usePetValidation } from './usePetValidation'
import { Pet } from './usePetValidation'
import { Validate } from './Validate'

interface PetFormProps {
  data: Pet
  onChange: (partial: Partial<Pet>) => void
}
export const PetForm: React.FC<PetFormProps> = ({ data, onChange }) => {
  const v = usePetValidation()
  useComposedForm<Pet>(v, data)

  const handleChange = (event: any) => {
    onChange({
      [event.target.name]: event.target.value,
    })
  }
  return (
    <>
      <Validate validation={{ v, data }}>
        <FieldText name="name" onChange={handleChange} />
        <FieldText name="sex" onChange={handleChange} />
      </Validate>
    </>
  )
}
