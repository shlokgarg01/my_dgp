import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import NotFound from './screens/NotFound'
import UserDetails from './screens/UserDetails'
import Checkout from './screens/Checkout'
import './utils/Variables.css'
import SearchingRider from './screens/SearchingRider'
// import "leaflet/dist/leaflet.css";
import Banner from './images/desktop_banner.jpg'


export default function App() {
  return (
    <div className="app-container">
      <div className="app-image">
        <img src={Banner} alt="Display"  />
      </div>
      <div className="app-content">
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/details" element={<UserDetails />} />
            <Route exact path="/searchingRider" element={<SearchingRider />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route exact path="/admin/login" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
