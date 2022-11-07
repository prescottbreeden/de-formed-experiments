import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { ComponentsProvider } from '@looker/components'
import { Provider } from 'react-redux'
import { store } from './redux/_store'

ReactDOM.render(
  <Provider store={store}>
    {/** @ts-ignore */}
    <ComponentsProvider>
      <App />
    </ComponentsProvider>
  </Provider>,
  document.getElementById('root')
)
