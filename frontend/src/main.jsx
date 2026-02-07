import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import ToastProvider from './components/ToastProvider';

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <ToastProvider /> 
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
