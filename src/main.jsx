import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MyTimer from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
      <MyTimer />
    </ErrorBoundary>
  </StrictMode>
);
