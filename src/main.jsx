import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  Routess  from './Routes'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <-- this enables dropdowns, modals, navbar toggle, etc.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <Routess />
    </Provider>
  </StrictMode>,
)
