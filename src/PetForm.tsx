import React from 'react'
import { FieldSelect, FieldText } from '@looker/components'
import { Pet } from './usePetValidation'
import { Validate } from './Validate'
import { useComposedForm } from './useMagicForm'
import { usePetValidation } from './usePetValidation'

interface PetFormProps {
  data: Pet
  onChange: (partial: Partial<Pet>) => void
}
export const PetForm: React.FC<PetFormProps> = ({ data, onChange }) => {
  const v = usePetValidation()
  useComposedForm<Pet>(v, data)

  const handleChange = (event: any) =>
    onChange({ [event.target.name]: event.target.value })

  const handleSelect = (value: string) => onChange({ dancesTo: value })

  return (
    <>
      <Validate validation={{ v, data }}>
        <FieldText name="name" onChange={handleChange} />
        <FieldText name="sex" onChange={handleChange} />
        <FieldSelect
          name="dancesTo"
          onChange={handleSelect}
          options={[
            { disabled: true, selected: true, value: '-- select an option --' } as any,
            { value: 'Ballet' },
            { value: 'Ballroom' },
            { value: 'Club Music' },
            { value: 'Disco' },
          ]}
        />
      </Validate>
    </>
  )
}
