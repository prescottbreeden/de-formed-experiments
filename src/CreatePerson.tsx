import React from 'react'
import { FormContext, useFormProvider } from './useForm'
import { PersonForm } from './PersonForm'
import { Query } from './fakeAPI'
import { emptyPerson, Person, usePersonValidation } from './usePersonValidation'

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
    // only way to auto handle form state is to receive the state setter and
    // store the intial state of the form - this behavior is not super common,
    // but there are times where a dev will need to reset the state of a form
    // for other reasons and I think when they do they should probably handle
    // what state they want to set for the form data.
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
