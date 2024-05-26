// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// react-leaflet for Maps
import 'leaflet/dist/leaflet.css';

// Toast messgae styles
import 'react-custom-alert/dist/index.css';

import { ToastContainer } from 'react-custom-alert';

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer floatingTime={3500} />
    <App />
  </Provider>
);
