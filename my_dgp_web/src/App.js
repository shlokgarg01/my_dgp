import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import NotFound from './components/NotFound'
import UserDetails from './components/UserDetails'
import Checkout from './components/Checkout'
import './utils/Variables.css'

export default function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/details" element={<UserDetails />} />
      <Route exact path="/checkout" element={<Checkout />} />
      <Route exact path="/admin/login" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
