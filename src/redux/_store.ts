import * as Keys from './_keys'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import { createReducer } from './DuxBox'

const rootReducer = combineReducers({
  [Keys.API_ERRORS]: createReducer(Keys.API_ERRORS, {}),
  [Keys.RESET_VALIDATIONS]: createReducer(Keys.RESET_VALIDATIONS, false),
  [Keys.SUBMIT_FAILED]: createReducer(Keys.SUBMIT_FAILED, false),
})

const middleware: [] = []
const enhancer = applyMiddleware(...middleware)
export const store = legacy_createStore(rootReducer, {}, enhancer)
