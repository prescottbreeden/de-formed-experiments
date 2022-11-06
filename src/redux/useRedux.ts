import { useDispatch, useSelector } from 'react-redux'
import { action, read } from './DuxBox'
import { ReduxPayload } from './types'
import _pipe from 'lodash/fp/flow'

// local string builder helper function
const createMetaData = (meta: string = '?', location: string = '?') =>
  [meta, '::', location].join('')

export const useRedux = <T>(key: string, meta?: string) => {
  const d = useDispatch()

  // return data from store
  const data = useSelector(read<T>(key))

  // send a function to map
  const dispatch = (payload: ReduxPayload<T>, location?: string) =>
    _pipe(action<T>(key, createMetaData(payload.name, location)), d)(payload)

  // send a pipeline
  const pipe = (...fns: Array<(s: T) => T>) =>
    _pipe(
      action(key, createMetaData(meta, 'pipe')),
      d
    )((state: T) => fns.reduce((acc, fn) => fn(acc), state))

  return {
    data,
    dispatch,
    pipe,
  }
}
