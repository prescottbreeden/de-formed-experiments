export type Person = {
  id: string
  name: string
  eyes: string
  pet: Pet
}

export const emptyPerson = () => ({
  id: 'person',
  name: '',
  eyes: '',
  pet: {
    id: 'pet',
    name: '',
    sex: '',
  },
})

export type Pet = {
  id: string
  name: string
  sex: string
  dancesTo?: string
}

