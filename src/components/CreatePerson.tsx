import React from 'react'
import { FormContext, useFormProvider } from '../hooks/useForm'
import { PersonForm } from './PersonForm'
import { Query } from '../fakeAPI'
import { emptyPerson, Person } from '../types'
import { usePersonValidation } from '../validations/usePersonValidation'

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

  // role is used to create form landmark, which is optional for a11y, but not
  // super descriptive with the default of "form" either
  return (
    <>
      <FormContext.Provider value={provider}>
        <div role="Create Person Form">
          <h2>Create Person</h2>
          <PersonForm data={person} onChange={handleChange} />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </FormContext.Provider>
    </>
  )
}
