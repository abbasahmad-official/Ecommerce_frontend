import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  Routess  from './Routes'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Routess />
    </Provider>
  </StrictMode>,
)
