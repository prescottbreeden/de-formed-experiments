import { Functor, ReduxAction } from './types'
import pipe from 'lodash/fp/flow'
import eq from 'lodash/fp/eq'
import cond from 'lodash/fp/cond'
import get from 'lodash/fp/get'

// --[ utils ]-----------------------------------------------------------------
export const identity = <A>(A: A) => A

const deepFreeze = (obj: any) => {
  Object.keys(obj).forEach((prop) => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop]))
      deepFreeze(obj[prop])
  })
  return Object.freeze(obj)
}

// Frozen Identity Functor
const DuxBox = <T>(value: T) =>
  deepFreeze({
    value,
    fold: (f: Function) => f(value),
    map: (f: (a: T) => T) => DuxBox(f(value)),
    of: (newValue: T) => DuxBox(newValue),
  })

export const fold =
  <A, B>(f: (a: A) => B) =>
  (x: Functor<A>) =>
    x.fold<B>(f)
export const read =
  <A>(key: string) =>
  (reduxState: { [key: string]: Functor<A> }) =>
    fold<A, A>(identity)(reduxState[key])

// action factory
const actionType = (key: string) => (type: string) => `${key} 🚀 ${type}`
const setAction = (key: string) => actionType(key)('SET')
const mapAction = (key: string) => actionType(key)('MAP')

export const action =
  <T>(key: string, meta?: string) =>
  (payload: T | ((a: T) => T)) =>
    typeof payload === 'function'
      ? { type: mapAction(key), payload, meta }
      : { type: setAction(key), payload, meta }

// action predicates
const shouldMap = (key: string) => pipe(get('type'), eq(mapAction(key)))
const shouldSet = (key: string) => pipe(get('type'), eq(setAction(key)))

// state transformation
const mapState =
  <T>(state: Functor<T>) =>
  ({ payload }: ReduxAction<T>) => {
    return state.map(payload)
  }
const setState =
  <T>(state: Functor<T>) =>
  ({ payload }: ReduxAction<T>) => {
    return state.of(payload as any) // hate you typescript
  }

// one reducer to rule them all and in the darkness bind them
export const createReducer =
  <T>(key: string, initial: T) =>
  (currentState: Functor<T>, action: ReduxAction<T>) => {
    const state = currentState ?? DuxBox(initial)
    return cond([
      [shouldMap(key), mapState(state)],
      [shouldSet(key), setState(state)],
      [() => true, () => state],
    ])(action)
  }
