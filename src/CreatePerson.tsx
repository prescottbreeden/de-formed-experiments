import React from 'react'
import { FormContext, useFormProvider } from './useForm'
import { PersonForm } from './PersonForm'
import { Pet } from './usePetValidation'
import { Query } from './fakeAPI'
import { usePersonValidation } from './usePersonValidation'

export type Person = {
  id: string
  name: string
  eyes: string
  pet: Pet
}

const emptyPerson = () => ({
  id: 'person',
  name: '',
  eyes: '',
  pet: {
    id: 'pet',
    name: '',
    sex: '',
  },
})

export const CreatePerson: React.FC = () => {
  const [person, setPerson] = React.useState(emptyPerson)

  const { provider, resetValidations, validateSubmit } =
    useFormProvider<Person>(usePersonValidation(), person)

  const handleChange = (data: Partial<Person>) =>
    setPerson((prev) => ({
      ...prev,
      ...data,
    }))

  const handleSubmit = () =>
    validateSubmit(() => Query.submit(person).then(provider.setAPIerrors))

  const handleReset = () => {
    resetValidations()
    setPerson(emptyPerson())
  }

  return (
    <>
      <FormContext.Provider value={provider}>
        <h2>Create Person</h2>
        <PersonForm data={person} onChange={handleChange} />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleReset}>Reset</button>
      </FormContext.Provider>
    </>
  )
}
