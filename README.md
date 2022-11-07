# Install
- clone repo
- `npm i` or `yarn`
- `npm run build` or `yarn build`
- `open index.html`

Repo is using esbuild so there is no hot loading. If you want to
leverage port forwarding, run `python3 -m http.server {port}`

looks like there are some esbuild bugs with @looker/components. will need
to delete the invalid export statements that are bugs to build.

## Boilerplate Setup
Types, empty state, and validation schemas

### Example Form State Types

```ts
type Person = {
  id: string
  name: string
  eyes: string
  pet: Pet
}

type Pet = {
  id: string
  name: string
  sex: string
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
```

### Example Validations

```tsx
export const usePetValidation = () => {
  return useValidation<Pet>({
    name: [required()],
    sex: [
      required(),
      is((s: string) => s === 'm' || s === 'f', 'must be m or f'),
    ],
  })
}

export const usePersonValidation = () => {
  const { validateAll: validatePet } = usePetValidation()
  return useValidation<Person>({
    name: [required()],
    eyes: [required()],
    pet: [
      {
        error: 'Pet is invalid',
        validation: ({ pet }) => validatePet(pet),
      },
    ],
  })
}
```

---

## Form Controller
If using composed forms, `useFormProvider` will generate a value for context
and `useComposedForm` will listen for changes in context behind the scenes and
run necessary behaviors (don't totally love names).

```tsx
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
```

---

## Form Component Syntax with Fancy Stuff
Validation hook is still imported as usual, but `useComposedForm` now handles
all sideEffects (submit failed, reset form, and setting API errors). Validate
is a composed component that sets the onChange, onBlur, and value of child
form elements.

```tsx
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
```

---

## useFormProvider

```ts
import React from 'react'
import { ValidationObject, ValidationState } from '@de-formed/base'

export const FormContext = React.createContext<any>({})
export const useForm = () => React.useContext(FormContext)

export const useFormProvider = <T>(v: ValidationObject<T>, data: T) => {
  const [submitFailed, setSubmitFailed] = React.useState<boolean>(false)
  const [APIerrors, setAPIerrors] = React.useState<{
    [key: string]: ValidationState
  }>({})
  const [resetValidation, setResetValidation] = React.useState<boolean>(false)

  return {
    provider: {
      APIerrors,
      resetValidation,
      setAPIerrors,
      setResetValidation,
      setSubmitFailed,
      submitFailed,
    },
    validateSubmit: (callback: any) => {
      if (v.validateAll(data)) {
        setSubmitFailed(false)
        callback()
      } else {
        setSubmitFailed(true)
      }
    },
    resetValidations: () => {
      setResetValidation((prev) => !prev)
      setSubmitFailed(false)
    },
    validationObject: v,
  }
}
```

---

## useComposedForm

the `id` logic bugs me, but yet to think of another solution that can handle
truly composable forms with nested data and recursive types

```ts
export const useComposedForm = <T>(v: ValidationObject<T>, data: T) => {
  const sideEffects = useForm()

  // --[ Side Effects ]--------------------------------------------------------
  if ('submitFailed' in sideEffects) {
    React.useEffect(() => {
      if (sideEffects.submitFailed) {
        v.validateAll(data)
      }
    }, [sideEffects.submitFailed])
  }

  if ('APIerrors' in sideEffects) {
    React.useEffect(() => {
      if (sideEffects.APIerrors[(data as any).id]) {
        v.setValidationState({
          ...v.validationState,
          ...sideEffects.APIerrors[(data as any).id],
        })
      }
    }, [sideEffects.APIerrors, (data as any).id])
  }

  if ('resetValidation' in sideEffects) {
    React.useEffect(() => {
      v.resetValidationState()
    }, [sideEffects.resetValidation])
  }
}
```

---

## Validate Composed Component

```tsx
import { ValidationObject } from '@de-formed/base'
import React from 'react'

interface ValidateProps {
  validation: {
    v: ValidationObject<any>
    data: any
  }
  children: any
}
// Validate composes field inputs with default de-formed validation behavior.
// If you need to customize the validation logic it is advisable to avoid using
// this component wrapper.
export const Validate: React.FC<ValidateProps> = ({ validation, children }) => {
  return React.Children.map(children, (child) => {
    // if validation is present, fire both an explicit onBlur event handler in
    // addition to running blur validation
    const onBlur = validation
      ? (event: any) => {
        validation.v.validateOnBlur(validation.data)(event)
        child.props?.onBlur && child.props.onBlur(event)
      }
      : child.props.onBlur

    // wrap onChange handler in validate or pass original along
    const onChange = validation
      ? validation.v.validateOnChange(child.props.onChange, validation.data)
      : child.props.onChange

    // take explicit value over implicit -- only use case for this I can
    // currently think of is if the value is being transformed before render
    const value = child.props.value
      ? child.props.value
      : validation?.data[child.props.name]

    // take explicit error message value if present
    const validationMessage = child.props.validationMessage
      ? child.props.validationMessage
      : { error: validation.v.getError(child.props.name) }

    return React.cloneElement(child, {
      onBlur,
      onChange,
      validate: validation,
      validationMessage,
      value,
    })
  })
}
```
