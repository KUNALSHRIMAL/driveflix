import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google'


import App from './App'
import { GOOGLE_CLIENT_ID } from '@/config/google'
import { AuthProvider } from "@/context/AuthContext"; // 👈 Missing import

import "@/styles/scrollbar.css"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthProvider>
      </GoogleOAuthProvider>    
  </React.StrictMode>
  
)
